// physics.js — CookedFS Physics Engine
// Runge-Kutta 4 integrator, drag model, collision detection

"use strict";

const Physics = (() => {

  const G = SOLAR.G;

  // ── STATE ──────────────────────────────────────────────────────────────────
  // Rocket state vector: [px, py, vx, vy, angle, angVel]
  // px, py  : position in meters (world space)
  // vx, vy  : velocity in m/s
  // angle   : rotation in radians (0 = pointing up)
  // angVel  : angular velocity rad/s

  function makeState(px, py, vx, vy, angle, angVel) {
    return { px, py, vx, vy, angle, angVel };
  }

  // ── DERIVATIVES ───────────────────────────────────────────────────────────
  function derivatives(state, rocket, t) {
    const { px, py, vx, vy, angle, angVel } = state;

    // 1. Gravity from all bodies
    const { ax: gax, ay: gay } = SOLAR.gravityAt(px, py, t, SOLAR.bodies);

    // 2. Dominant body for atmosphere
    const dom = SOLAR.dominantBody(px, py, SOLAR.bodies);
    const dx  = px - dom._pos.x;
    const dy  = py - dom._pos.y;
    const alt = Math.sqrt(dx*dx + dy*dy) - dom.radius; // altitude above surface

    // 3. Atmosphere drag
    const rho   = SOLAR.atmosphericDensity(dom, Math.max(alt, 0));
    const speed = Math.sqrt(vx*vx + vy*vy);
    let dragAx = 0, dragAy = 0;
    if (rho > 0 && speed > 0.01) {
      const Cd   = rocket.Cd || 0.3;
      const area = rocket.crossSection || 4; // m²
      const mass = rocket.totalMass();       // kg
      const Fd   = 0.5 * rho * speed * speed * Cd * area;
      const dragA = Fd / mass;
      dragAx = -dragA * vx / speed;
      dragAy = -dragA * vy / speed;
    }

    // 4. Thrust
    let thrAx = 0, thrAy = 0;
    const thrust = rocket.currentThrust(); // N
    if (thrust > 0) {
      const mass = rocket.totalMass();
      const a    = thrust / mass;
      // angle=0 means pointing up (+Y in our coord, but canvas Y is flipped)
      // We'll use: thrustDir = (sin(angle), -cos(angle)) for "up" = screen up
      thrAx = a * Math.sin(angle);
      thrAy = -a * Math.cos(angle);
    }

    // 5. Angular control
    let angAcc = 0;
    if (rocket.steering !== 0) {
      const I = rocket.momentOfInertia();
      const torque = rocket.steering * 50_000; // N·m  (RCS / gimbal)
      angAcc = torque / I;
    }
    // Angular damping
    angAcc -= angVel * 0.5;

    return {
      dpx:  vx,
      dpy:  vy,
      dvx:  gax + dragAx + thrAx,
      dvy:  gay + dragAy + thrAy,
      dangle: angVel,
      dangVel: angAcc,
    };
  }

  // ── RK4 INTEGRATOR ────────────────────────────────────────────────────────
  function rk4Step(state, rocket, t, dt) {
    function add(s, d, h) {
      return {
        px:     s.px     + d.dpx     * h,
        py:     s.py     + d.dpy     * h,
        vx:     s.vx     + d.dvx     * h,
        vy:     s.vy     + d.dvy     * h,
        angle:  s.angle  + d.dangle  * h,
        angVel: s.angVel + d.dangVel * h,
      };
    }

    const k1 = derivatives(state, rocket, t);
    const k2 = derivatives(add(state, k1, dt/2), rocket, t + dt/2);
    const k3 = derivatives(add(state, k2, dt/2), rocket, t + dt/2);
    const k4 = derivatives(add(state, k3, dt),   rocket, t + dt);

    return {
      px:     state.px     + (dt/6) * (k1.dpx     + 2*k2.dpx     + 2*k3.dpx     + k4.dpx),
      py:     state.py     + (dt/6) * (k1.dpy     + 2*k2.dpy     + 2*k3.dpy     + k4.dpy),
      vx:     state.vx     + (dt/6) * (k1.dvx     + 2*k2.dvx     + 2*k3.dvx     + k4.dvx),
      vy:     state.vy     + (dt/6) * (k1.dvy     + 2*k2.dvy     + 2*k3.dvy     + k4.dvy),
      angle:  state.angle  + (dt/6) * (k1.dangle  + 2*k2.dangle  + 2*k3.dangle  + k4.dangle),
      angVel: state.angVel + (dt/6) * (k1.dangVel + 2*k2.dangVel + 2*k3.dangVel + k4.dangVel),
    };
  }

  // ── COLLISION DETECTION ───────────────────────────────────────────────────
  function checkCollisions(state) {
    for (const b of SOLAR.bodies) {
      const dx = state.px - b._pos.x;
      const dy = state.py - b._pos.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d <= b.radius + 5) {
        return b; // Collision with this body
      }
    }
    return null;
  }

  // ── ORBIT PREDICTION (trail) ──────────────────────────────────────────────
  // Predict the next N seconds of trajectory analytically (or numerically)
  function predictTrajectory(state, rocket, t, steps, stepDt) {
    const points = [];
    let s = { ...state };
    // Minimal rocket for prediction (no thrust for orbit line)
    const ghostRocket = {
      totalMass: () => rocket.totalMass(),
      currentThrust: () => 0,
      steering: 0,
      Cd: 0,
      crossSection: 0,
      momentOfInertia: () => 1e6,
    };
    for (let i = 0; i < steps; i++) {
      s = rk4Step(s, ghostRocket, t + i*stepDt, stepDt);
      points.push({ x: s.px, y: s.py });
      // Stop if collision
      const col = checkCollisions(s);
      if (col) { points.push({ x: s.px, y: s.py, impact: true }); break; }
    }
    return points;
  }

  // ── SURFACE VELOCITY (relative to rotating body) ──────────────────────────
  function surfaceVelocity(state) {
    const dom = SOLAR.dominantBody(state.px, state.py, SOLAR.bodies);
    const domVx = dom._vel ? dom._vel.x : 0;
    const domVy = dom._vel ? dom._vel.y : 0;
    // Surface rotation contribution
    const dx = state.px - dom._pos.x;
    const dy = state.py - dom._pos.y;
    const r  = Math.sqrt(dx*dx + dy*dy);
    const omega = dom.rotationPeriod ? 2*Math.PI/dom.rotationPeriod : 0;
    const surfVx = domVx - omega * dy;
    const surfVy = domVy + omega * dx;
    return {
      vx: state.vx - surfVx,
      vy: state.vy - surfVy,
      speed: Math.hypot(state.vx - surfVx, state.vy - surfVy),
    };
  }

  // ── TELEMETRY ─────────────────────────────────────────────────────────────
  function telemetry(state, rocket, t) {
    const dom = SOLAR.dominantBody(state.px, state.py, SOLAR.bodies);
    const dx  = state.px - dom._pos.x;
    const dy  = state.py - dom._pos.y;
    const r   = Math.sqrt(dx*dx + dy*dy);
    const alt = r - dom.radius;

    const speed    = Math.hypot(state.vx, state.vy);
    const sv       = surfaceVelocity(state);

    // Relative velocity (to body frame)
    const rvx = state.vx - (dom._vel ? dom._vel.x : 0);
    const rvy = state.vy - (dom._vel ? dom._vel.y : 0);
    const relSpeed = Math.hypot(rvx, rvy);

    // Vertical speed: dot product of velocity with radial direction
    const ux = dx / r, uy = dy / r;
    const vspd = rvx * ux + rvy * uy; // positive = moving away

    // Orbital elements
    let orb = null;
    try {
      orb = SOLAR.orbitalElements(dx, dy, rvx, rvy, dom.mass);
    } catch(e) {}

    // Mach (speed of sound ~340 m/s at Earth surface, varies with atmosphere)
    const rho  = SOLAR.atmosphericDensity(dom, Math.max(alt, 0));
    const cs   = rho > 0 ? 340 * Math.sqrt(rho / (dom.atmDensity0 || 1)) : 0;
    const mach = cs > 0 ? relSpeed / cs : 0;

    // G-force
    const { ax: gax, ay: gay } = SOLAR.gravityAt(state.px, state.py, t, SOLAR.bodies);
    const gravA = Math.hypot(gax, gay);
    const thrust = rocket.currentThrust();
    const mass   = rocket.totalMass();
    const thrA   = thrust / mass;
    const gforce = Math.abs(thrA - gravA) / 9.807;

    return {
      altitude:  alt,
      speed:     relSpeed,
      surfSpeed: sv.speed,
      vspd,
      mach,
      dominantBody: dom,
      orb,
      gforce,
      rho,
      thrA,
    };
  }

  return {
    makeState,
    rk4Step,
    checkCollisions,
    predictTrajectory,
    telemetry,
    surfaceVelocity,
  };

})();

// solar.js — CookedFS Solar System Data
// All values are real, scaled for gameplay.
// DISTANCE_SCALE: real km → game units (pixels at zoom=1)
// SIZE_SCALE: real km radius → game units
// Gravitational constant in game units is chosen so Earth surface g ≈ 9.81 m/s²

"use strict";

// ── SCALE FACTORS ──────────────────────────────────────────────────────────
// We keep SI units internally (meters, kg, seconds) but scale distances
// so the solar system fits on screen at map view.
// 1 game unit = 1 km (real).  Physics uses meters.
// The simulation works in METERS but the canvas maps meters→pixels via camera.

const SOLAR = (() => {

  // Real gravitational constant
  const G = 6.674e-11; // m³ kg⁻¹ s⁻²

  // ── CELESTIAL BODIES ─────────────────────────────────────────────────────
  // radius      : m (real, used for surface collision)
  // mass        : kg
  // semiMajor   : m (orbital semi-major axis, real)
  // orbitalPeriod: s
  // color       : hex
  // atmosphereHeight : m above surface (0 = no atmosphere)
  // atmDensity0 : kg/m³ at surface
  // atmScaleHeight : m (density halves every H meters roughly)
  // axialTilt   : degrees (currently cosmetic)
  // rotationPeriod: s (day length, affects surface texture rotation)

  const bodies = [
    {
      id: "sun",
      name: "Sun",
      radius: 696_000_000,           // m
      mass:   1.989e30,              // kg
      semiMajor: 0,
      orbitalPeriod: 0,
      parent: null,
      color: "#fff7a0",
      glowColor: "#ffcc00",
      atmosphereHeight: 0,
      atmDensity0: 0,
      atmScaleHeight: 1,
      rotationPeriod: 2_160_000,     // ~25 days
      textureBands: [],
      mapRadius: 18,                 // px at map zoom=1e-10
    },
    {
      id: "mercury",
      name: "Mercury",
      radius: 2_439_700,
      mass:   3.3011e23,
      semiMajor: 57_909_050_000,
      orbitalPeriod: 7_600_530,      // s
      parent: "sun",
      color: "#9a9a8a",
      glowColor: null,
      atmosphereHeight: 0,
      atmDensity0: 0,
      atmScaleHeight: 1,
      surfaceGravity: 3.7,           // m/s² (pre-computed for convenience)
      rotationPeriod: 5_067_360,
      textureBands: ["#8a8a7a","#7a7a6a","#9a9a8a"],
      mapRadius: 3,
    },
    {
      id: "venus",
      name: "Venus",
      radius: 6_051_800,
      mass:   4.8675e24,
      semiMajor: 108_208_000_000,
      orbitalPeriod: 19_414_080,
      parent: "sun",
      color: "#e8c870",
      glowColor: "#e8c87040",
      atmosphereHeight: 250_000,
      atmDensity0: 65.0,             // kg/m³ (very dense CO2)
      atmScaleHeight: 15_900,
      surfaceGravity: 8.87,
      rotationPeriod: 20_996_760,
      textureBands: ["#d4a84b","#e8c870","#c8983a"],
      mapRadius: 5,
    },
    {
      id: "earth",
      name: "Earth",
      radius: 6_371_000,
      mass:   5.972e24,
      semiMajor: 149_598_023_000,
      orbitalPeriod: 31_558_150,
      parent: "sun",
      color: "#3080f0",
      glowColor: "#2060c040",
      atmosphereHeight: 100_000,
      atmDensity0: 1.225,
      atmScaleHeight: 8_500,
      surfaceGravity: 9.807,
      rotationPeriod: 86_164,
      textureBands: ["#1a5fa0","#3080f0","#208050","#c8c0a0"],
      mapRadius: 5,
    },
    {
      id: "moon",
      name: "Moon",
      radius: 1_737_400,
      mass:   7.342e22,
      semiMajor: 384_400_000,        // from Earth
      orbitalPeriod: 2_360_591,
      parent: "earth",
      color: "#b0b0a8",
      glowColor: null,
      atmosphereHeight: 0,
      atmDensity0: 0,
      atmScaleHeight: 1,
      surfaceGravity: 1.62,
      rotationPeriod: 2_360_591,
      textureBands: ["#a8a8a0","#b8b8b0","#989888"],
      mapRadius: 2,
    },
    {
      id: "mars",
      name: "Mars",
      radius: 3_389_500,
      mass:   6.4171e23,
      semiMajor: 227_939_200_000,
      orbitalPeriod: 59_354_294,
      parent: "sun",
      color: "#c1440e",
      glowColor: "#c1440e30",
      atmosphereHeight: 11_000,
      atmDensity0: 0.020,
      atmScaleHeight: 11_100,
      surfaceGravity: 3.72,
      rotationPeriod: 88_643,
      textureBands: ["#c1440e","#a83308","#d05520","#8a3008"],
      mapRadius: 4,
    },
    {
      id: "jupiter",
      name: "Jupiter",
      radius: 69_911_000,
      mass:   1.8982e27,
      semiMajor: 778_570_000_000,
      orbitalPeriod: 374_335_776,
      parent: "sun",
      color: "#c88040",
      glowColor: "#c8804020",
      atmosphereHeight: 1_000_000,   // gas giant — "surface" is arbitrary
      atmDensity0: 0.16,
      atmScaleHeight: 27_000,
      surfaceGravity: 24.79,
      rotationPeriod: 35_730,
      textureBands: ["#c88040","#a06028","#e09050","#8a4818","#d8a060","#b07038"],
      mapRadius: 10,
    },
    {
      id: "saturn",
      name: "Saturn",
      radius: 58_232_000,
      mass:   5.6834e26,
      semiMajor: 1_433_530_000_000,
      orbitalPeriod: 929_292_360,
      parent: "sun",
      color: "#e0c890",
      glowColor: "#e0c89020",
      atmosphereHeight: 1_000_000,
      atmDensity0: 0.19,
      atmScaleHeight: 59_500,
      surfaceGravity: 10.44,
      rotationPeriod: 38_362,
      textureBands: ["#e0c890","#c8a860","#f0d8a0","#b09040"],
      ringInner: 66_900_000,         // m from center
      ringOuter: 136_775_000,
      ringColor: "rgba(200,180,130,0.5)",
      mapRadius: 9,
    },
    {
      id: "uranus",
      name: "Uranus",
      radius: 25_362_000,
      mass:   8.6810e25,
      semiMajor: 2_872_460_000_000,
      orbitalPeriod: 2_651_370_019,
      parent: "sun",
      color: "#7de8e8",
      glowColor: "#7de8e820",
      atmosphereHeight: 1_000_000,
      atmDensity0: 0.42,
      atmScaleHeight: 27_700,
      surfaceGravity: 8.69,
      rotationPeriod: 62_064,
      textureBands: ["#7de8e8","#60d0d0","#90f0f0"],
      mapRadius: 7,
    },
    {
      id: "neptune",
      name: "Neptune",
      radius: 24_622_000,
      mass:   1.02413e26,
      semiMajor: 4_495_060_000_000,
      orbitalPeriod: 5_200_418_560,
      parent: "sun",
      color: "#3050f8",
      glowColor: "#3050f820",
      atmosphereHeight: 1_000_000,
      atmDensity0: 0.45,
      atmScaleHeight: 19_700,
      surfaceGravity: 11.15,
      rotationPeriod: 57_996,
      textureBands: ["#3050f8","#2040d8","#4060ff"],
      mapRadius: 7,
    },
  ];

  // ── RUNTIME: positions, velocities ───────────────────────────────────────
  // We compute positions via Keplerian elements (circular orbits for simplicity).
  // Positions are in meters from the solar system barycentre (≈ Sun centre).

  function orbitalAngle(body, t) {
    // t: simulation time in seconds from epoch
    if (!body.orbitalPeriod) return 0;
    return (2 * Math.PI * t / body.orbitalPeriod);
  }

  // Cache parent body objects by id
  const bodyMap = {};
  bodies.forEach(b => { bodyMap[b.id] = b; });

  function worldPos(body, t) {
    // Returns {x, y} in meters
    if (!body.parent) return { x: 0, y: 0 };
    const parent = bodyMap[body.parent];
    const parentPos = worldPos(parent, t);
    const angle = body._angle || 0; // maintained by simulation step
    return {
      x: parentPos.x + body.semiMajor * Math.cos(angle),
      y: parentPos.y + body.semiMajor * Math.sin(angle),
    };
  }

  // ── Initialize angles ─────────────────────────────────────────────────────
  // Start at t=0 with some spread so planets aren't all in a line
  const INITIAL_OFFSETS = {
    mercury: 0.4,
    venus:   1.2,
    earth:   2.0,
    moon:    0.0,
    mars:    3.7,
    jupiter: 0.8,
    saturn:  2.5,
    uranus:  5.1,
    neptune: 4.2,
  };

  bodies.forEach(b => {
    b._angle = INITIAL_OFFSETS[b.id] || 0;
    b._pos   = { x: 0, y: 0 };
    b._vel   = { x: 0, y: 0 };
  });

  // ── ATMOSPHERE HELPERS ───────────────────────────────────────────────────
  function atmosphericDensity(body, altitude) {
    // altitude: meters above surface
    if (!body.atmosphereHeight || altitude >= body.atmosphereHeight) return 0;
    if (altitude < 0) altitude = 0;
    return body.atmDensity0 * Math.exp(-altitude / body.atmScaleHeight);
  }

  function atmosphericPressure(body, altitude) {
    const rho = atmosphericDensity(body, altitude);
    // simple: P = rho * R * T / M  —  approximated as P ≈ rho * 9.81 * H
    return rho * 9.81 * body.atmScaleHeight;
  }

  // ── GRAVITY ──────────────────────────────────────────────────────────────
  function gravityAt(px, py, t, bodyList) {
    // Returns {ax, ay} total gravitational acceleration in m/s²
    let ax = 0, ay = 0;
    for (const b of bodyList) {
      const bpos = b._pos;
      const dx = bpos.x - px;
      const dy = bpos.y - py;
      const r2 = dx*dx + dy*dy;
      if (r2 < 1e6) continue;
      const r  = Math.sqrt(r2);
      const a  = G * b.mass / r2;
      ax += a * dx / r;
      ay += a * dy / r;
    }
    return { ax, ay };
  }

  // ── DOMINANT BODY ─────────────────────────────────────────────────────────
  function dominantBody(px, py, bodyList) {
    let best = null, bestSOI = Infinity;
    for (const b of bodyList) {
      // SOI radius: a*(m/M_parent)^(2/5) — approximate
      let soiR;
      if (!b.parent) {
        soiR = Infinity;
      } else {
        const parent = bodyMap[b.parent];
        soiR = b.semiMajor * Math.pow(b.mass / parent.mass, 0.4);
      }
      const dx = b._pos.x - px;
      const dy = b._pos.y - py;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < soiR && d < bestSOI) {
        bestSOI = d;
        best = b;
      }
    }
    return best || bodyMap["sun"];
  }

  // ── ORBIT ELEMENTS (from position + velocity relative to body) ────────────
  function orbitalElements(rx, ry, vx, vy, centralMass) {
    const mu = G * centralMass;
    const r  = Math.sqrt(rx*rx + ry*ry);
    const v2 = vx*vx + vy*vy;

    const eps   = v2/2 - mu/r;              // specific orbital energy
    const sma   = -mu / (2*eps);            // semi-major axis (m)

    // Angular momentum
    const h = rx*vy - ry*vx;               // z-component

    // Eccentricity vector
    const ex = (vy*h/mu) - rx/r;
    const ey = -(vx*h/mu) - ry/r;
    const ecc = Math.sqrt(ex*ex + ey*ey);

    const apo  = sma * (1 + ecc) - 0; // from center
    const peri = sma * (1 - ecc);

    return { sma, ecc, h, apo, peri, eps };
  }

  // ── STEP PLANETARY POSITIONS ──────────────────────────────────────────────
  function stepPlanets(dt) {
    // Simple Keplerian stepping: angle += omega * dt
    for (const b of bodies) {
      if (!b.parent) { b._pos = { x: 0, y: 0 }; continue; }
      if (!b.orbitalPeriod) continue;
      const omega = 2 * Math.PI / b.orbitalPeriod;
      b._angle += omega * dt;

      const parent = bodyMap[b.parent];
      const px = parent._pos.x;
      const py = parent._pos.y;
      b._pos = {
        x: px + b.semiMajor * Math.cos(b._angle),
        y: py + b.semiMajor * Math.sin(b._angle),
      };

      // Orbital velocity (circular)
      const v = 2 * Math.PI * b.semiMajor / b.orbitalPeriod;
      b._vel = {
        x: -v * Math.sin(b._angle),
        y:  v * Math.cos(b._angle),
      };
    }
  }

  // Initialise positions at t=0
  stepPlanets(0);

  // ── RENDER HELPERS (called by game.js) ────────────────────────────────────

  // Draw a body on the simulation canvas
  function drawBody(ctx, body, cx, cy, screenR, zoom) {
    ctx.save();

    // Glow
    if (body.glowColor && screenR > 3) {
      const grad = ctx.createRadialGradient(cx, cy, screenR*0.5, cx, cy, screenR*2.5);
      grad.addColorStop(0, body.glowColor || "transparent");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, screenR*2.5, 0, Math.PI*2);
      ctx.fill();
    }

    // Body
    if (body.textureBands && body.textureBands.length > 1 && screenR > 4) {
      // Draw banded texture
      const grad = ctx.createRadialGradient(cx - screenR*0.3, cy - screenR*0.3, 0, cx, cy, screenR);
      const bands = body.textureBands;
      for (let i = 0; i < bands.length; i++) {
        grad.addColorStop(i / (bands.length-1), bands[i]);
      }
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = body.color;
    }
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(screenR, 1.5), 0, Math.PI*2);
    ctx.fill();

    // Saturn rings
    if (body.id === "saturn" && screenR > 5) {
      const ri = body.ringInner / body.radius * screenR;
      const ro = body.ringOuter / body.radius * screenR;
      ctx.strokeStyle = body.ringColor || "rgba(200,180,130,0.5)";
      ctx.lineWidth = (ro - ri) * 0.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, (ri+ro)*0.5, (ri+ro)*0.15, 0, 0, Math.PI*2);
      ctx.stroke();
    }

    // Atmosphere haze (only when zoomed in near surface)
    if (body.atmosphereHeight && screenR > 30) {
      const atmScreenR = screenR * (1 + body.atmosphereHeight / body.radius);
      const atmGrad = ctx.createRadialGradient(cx, cy, screenR, cx, cy, atmScreenR);
      const baseColor = body.id === "earth" ? "rgba(80,160,255," :
                        body.id === "venus" ? "rgba(200,170,80," :
                        body.id === "mars"  ? "rgba(180,100,60," :
                                             "rgba(150,200,255,";
      atmGrad.addColorStop(0, baseColor + "0.25)");
      atmGrad.addColorStop(0.5, baseColor + "0.08)");
      atmGrad.addColorStop(1, baseColor + "0)");
      ctx.fillStyle = atmGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, atmScreenR, 0, Math.PI*2);
      ctx.fill();
    }

    // Label
    if (screenR < 60 || zoom < 1e-6) {
      ctx.fillStyle = "#c8f07088";
      ctx.font = "10px 'Courier New'";
      ctx.textAlign = "center";
      ctx.fillText(body.name.toUpperCase(), cx, cy + Math.max(screenR, 4) + 13);
    }

    ctx.restore();
  }

  // Draw orbital path (ellipse, simplified as circle for now)
  function drawOrbit(ctx, body, sunSX, sunSY, meterToPixel) {
    if (!body.parent || !body.semiMajor) return;
    const parent = bodyMap[body.parent];
    const ppx = parent._pos.x * meterToPixel + sunSX;
    const ppy = parent._pos.y * meterToPixel + sunSY;

    const r = body.semiMajor * meterToPixel;
    ctx.save();
    ctx.strokeStyle = "#2a4a0840";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(ppx, ppy, r, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  return {
    G,
    bodies,
    bodyMap,
    atmosphericDensity,
    atmosphericPressure,
    gravityAt,
    dominantBody,
    orbitalElements,
    stepPlanets,
    drawBody,
    drawOrbit,
  };

})();

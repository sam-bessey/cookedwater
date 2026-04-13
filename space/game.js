// game.js — CookedFS Main Game Loop & UI Controller
"use strict";

// ── CANVAS SETUP ──────────────────────────────────────────────────────────────
const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  if (!document.getElementById("screen-vab").classList.contains("hidden")) {
    VAB.init(document.getElementById("vab-canvas"));
  }
});

// ── STARFIELD ─────────────────────────────────────────────────────────────────
const STARS = (() => {
  const N = 1400;
  const stars = [];
  const rng = (n) => Math.random() * n;
  for (let i = 0; i < N; i++) {
    stars.push({
      x: rng(1),
      y: rng(1),
      r: Math.random() < 0.03 ? rng(1.4) + 0.8 : rng(0.8) + 0.3,
      b: rng(0.5) + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: rng(1.5) + 0.5,
    });
  }
  return { stars };
})();

function drawStars(dt) {
  const w = canvas.width, h = canvas.height;
  for (const s of STARS.stars) {
    s.twinkle += s.twinkleSpeed * dt;
    const alpha = s.b + Math.sin(s.twinkle) * 0.15;
    ctx.fillStyle = `rgba(200,230,180,${alpha.toFixed(2)})`;
    ctx.fillRect(s.x * w - s.r, s.y * h - s.r, s.r * 2, s.r * 2);
  }
}

// ── CAMERA ────────────────────────────────────────────────────────────────────
// worldX/Y : camera center in meters
// zoom     : pixels per meter
const Camera = {
  x: 0, y: 0,
  zoom: 1 / 1000,        // start: 1px = 1000m
  minZoom: 1e-12,
  maxZoom: 1.0,
  targetX: 0, targetY: 0,
  targetZoom: 1/1000,
  follow: true,          // follow rocket

  worldToScreen(wx, wy) {
    return {
      sx: canvas.width  / 2 + (wx - this.x) * this.zoom,
      sy: canvas.height / 2 + (wy - this.y) * this.zoom,
    };
  },

  screenToWorld(sx, sy) {
    return {
      wx: this.x + (sx - canvas.width  / 2) / this.zoom,
      wy: this.y + (sy - canvas.height / 2) / this.zoom,
    };
  },

  update(dt) {
    // Smooth follow
    const lerpT = Math.min(1, 5 * dt);
    this.x    += (this.targetX    - this.x)    * lerpT;
    this.y    += (this.targetY    - this.y)    * lerpT;
    this.zoom += (this.targetZoom - this.zoom) * lerpT;
  },

  // Zoom to show radius R meters centered on (cx, cy)
  fitView(cx, cy, R) {
    this.targetX    = cx;
    this.targetY    = cy;
    this.targetZoom = Math.min(canvas.width, canvas.height) * 0.4 / R;
  },
};

// ── FLIGHT STATE ──────────────────────────────────────────────────────────────
const Flight = (() => {
  let rocket    = null;
  let physState = null;
  let simTime   = 0;
  let warpIndex = 0;
  const WARP_STEPS = [1, 5, 10, 50, 100, 1000, 10000, 100000];
  let isMapMode   = false;
  let mapPanX = 0, mapPanY = 0;
  let mapZoom = 1e-10; // pixels per meter at map view
  let isDead  = false;
  let landed  = false;
  let landedBody = null;
  let orbitTrail = [];
  let trailTimer = 0;

  // Input state
  const keys = { w:false, s:false, a:false, d:false, x:false, space:false };

  function start(r) {
    rocket = r;
    rocket.initFuelState();
    rocket.currentStageIdx = rocket.stageList()[rocket.stageList().length - 1] || 0;
    rocket.decoupledStages = new Set();

    // Place on Earth surface
    const earth = SOLAR.bodyMap["earth"];
    const startR = earth.radius + 10; // 10 m above surface
    physState = Physics.makeState(
      earth._pos.x,
      earth._pos.y - startR,
      earth._vel ? earth._vel.x : 0,
      earth._vel ? earth._vel.y : 0,
      0,   // angle
      0    // angVel
    );

    // Add Earth's surface rotation velocity
    const omega = 2 * Math.PI / earth.rotationPeriod;
    physState.vx += -omega * startR; // tangential velocity (west to east)

    simTime   = 0;
    warpIndex = 0;
    isDead    = false;
    landed    = true; // start on ground
    landedBody = earth;
    orbitTrail = [];
    trailTimer = 0;
    isMapMode  = false;

    Camera.x = physState.px;
    Camera.y = physState.py;
    Camera.zoom = 0.01;
    Camera.targetZoom = 0.01;

    bindFlightKeys();
    updateStageUI();
  }

  function bindFlightKeys() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
  }

  function unbindFlightKeys() {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup",   onKeyUp);
  }

  function onKeyDown(e) {
    if (document.getElementById("screen-flight").classList.contains("hidden")) return;
    keys[e.key.toLowerCase()] = true;
    if (e.key === " ") { e.preventDefault(); activateStage(); }
    if (e.key === "m" || e.key === "M") toggleMap();
    if (e.key === ".") warpUp();
    if (e.key === ",") warpDown();
    if (e.key === "x" || e.key === "X") { rocket.throttle = 0; }
    // Highlight control keys
    updateKeyHints();
  }

  function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
    updateKeyHints();
  }

  function warpUp()   { warpIndex = Math.min(warpIndex + 1, WARP_STEPS.length - 1); updateWarpUI(); }
  function warpDown() { warpIndex = Math.max(warpIndex - 1, 0); updateWarpUI(); }

  function updateWarpUI() {
    const w = WARP_STEPS[warpIndex];
    document.getElementById("warp-val").textContent = w + "×";
    document.getElementById("warp-val").style.color = w > 1 ? "var(--orange)" : "var(--green)";
  }

  function updateKeyHints() {
    document.getElementById("key-w").classList.toggle("active", keys.w);
    document.getElementById("key-s").classList.toggle("active", keys.s);
    document.getElementById("key-a").classList.toggle("active", keys.a);
    document.getElementById("key-d").classList.toggle("active", keys.d);
    document.getElementById("key-x").classList.toggle("active", keys.x);
  }

  function toggleMap() {
    isMapMode = !isMapMode;
    document.getElementById("hud-map-btn").classList.toggle("active", isMapMode);
    document.getElementById("map-legend").classList.toggle("hidden", !isMapMode);
    if (isMapMode) {
      // Fit solar system
      mapZoom = Math.min(canvas.width, canvas.height) * 0.4 / 5e11;
      mapPanX = canvas.width  / 2;
      mapPanY = canvas.height / 2;
    }
  }

  function activateStage() {
    if (!rocket || isDead) return;
    const action = rocket.activateStage();
    updateStageUI();
    GameUI.toast(action === "decouple" ? "STAGE SEPARATED" : "STAGE IGNITED", "ok");
  }

  function updateStageUI() {
    if (!rocket) return;
    const list  = rocket.stageList();
    const el    = document.getElementById("stage-list");
    el.innerHTML = "";
    [...list].reverse().forEach(s => {
      const div = document.createElement("div");
      div.className = "stage-item" + (s === rocket.currentStageIdx ? " current" : "");
      div.textContent = `STG ${s}`;
      el.appendChild(div);
    });
  }

  function update(dt) {
    if (!rocket || !physState || isDead) return;

    const warp = WARP_STEPS[warpIndex];
    // Clamp warp if thrusting
    const effectiveWarp = rocket.throttle > 0 ? Math.min(warp, 10) : warp;
    const physDt = dt * effectiveWarp;

    // Sub-step for stability
    const MAX_SUBSTEP = 1.0;
    let remaining = physDt;
    while (remaining > 0) {
      const step = Math.min(remaining, MAX_SUBSTEP);
      remaining -= step;

      // Process input
      processInput(step);

      // Step planets
      SOLAR.stepPlanets(step);

      // Physics step (only if not landed or if launched)
      if (!landed) {
        physState = Physics.rk4Step(physState, rocket, simTime, step);
        rocket.consumeFuel(step);
      } else {
        // Stay locked to body surface
        const earth = landedBody;
        const dx = physState.px - earth._pos.x;
        const dy = physState.py - earth._pos.y;
        const r  = Math.sqrt(dx*dx + dy*dy);
        const nx = dx/r, ny = dy/r;
        physState.px = earth._pos.x + nx * (earth.radius + 5);
        physState.py = earth._pos.y + ny * (earth.radius + 5);
        physState.vx = earth._vel ? earth._vel.x : 0;
        physState.vy = earth._vel ? earth._vel.y : 0;

        // Launch when throttle high enough
        if (rocket.twr() > 0.2 && rocket.throttle > 0.1) {
          landed = false;
          landedBody = null;
          GameUI.toast("LIFTOFF!", "ok");
        }
      }

      simTime += step;

      // Collision check
      if (!landed) {
        const col = Physics.checkCollisions(physState);
        if (col) {
          // Check landing speed
          const telem = Physics.telemetry(physState, rocket, simTime);
          const impactSpd = Math.abs(telem.vspd);
          if (impactSpd < 8 || (col.id !== "sun" && rocket.parts.some(p => PARTS[p.partId]?.isLandingLeg))) {
            // Safe landing
            landed    = true;
            landedBody = col;
            physState.vx = col._vel ? col._vel.x : 0;
            physState.vy = col._vel ? col._vel.y : 0;
            GameUI.showLanding(col, impactSpd);
          } else {
            // Crash
            isDead = true;
            GameUI.showCrash(col, impactSpd);
            return;
          }
        }
      }

      // Orbit trail
      trailTimer += step;
      if (trailTimer > 10) {
        trailTimer = 0;
        orbitTrail.push({ x: physState.px, y: physState.py });
        if (orbitTrail.length > 800) orbitTrail.shift();
      }
    }

    // Camera follow
    if (!isMapMode) {
      Camera.targetX = physState.px;
      Camera.targetY = physState.py;
      // Auto-zoom based on altitude
      const dom = SOLAR.dominantBody(physState.px, physState.py, SOLAR.bodies);
      const dx  = physState.px - dom._pos.x;
      const dy  = physState.py - dom._pos.y;
      const alt = Math.sqrt(dx*dx + dy*dy) - dom.radius;
      const targetZoom = alt < 50_000 ? 0.008 :
                         alt < 500_000 ? 0.002 :
                         alt < 5_000_000 ? 0.0003 : 0.00005;
      Camera.targetZoom = targetZoom;
    }

    updateHUD();
  }

  function processInput(dt) {
    if (!rocket) return;

    // Throttle
    if (keys.w) rocket.throttle = Math.min(1, rocket.throttle + dt * 0.5);
    if (keys.s) rocket.throttle = Math.max(0, rocket.throttle - dt * 0.5);

    // Steering
    if (keys.a) rocket.steering = -1;
    else if (keys.d) rocket.steering = 1;
    else rocket.steering = 0;

    // Parachute
    if (keys.p && !rocket.parachuteDeployed) {
      const dom = SOLAR.dominantBody(physState.px, physState.py, SOLAR.bodies);
      const dx  = physState.px - dom._pos.x;
      const dy  = physState.py - dom._pos.y;
      const alt = Math.sqrt(dx*dx + dy*dy) - dom.radius;
      if (alt < dom.atmosphereHeight && dom.atmosphereHeight > 0) {
        rocket.parachuteDeployed = true;
        rocket.Cd = (rocket.Cd || 0.3) + 30;
        GameUI.toast("PARACHUTE DEPLOYED", "ok");
      } else {
        GameUI.toast("NO ATMOSPHERE", "warn");
      }
    }

    // Update throttle UI
    const pct = Math.round(rocket.throttle * 100);
    document.getElementById("throttle-pct").textContent = pct + "%";
    document.getElementById("throttle-bar").style.height = pct + "%";
  }

  function updateHUD() {
    if (!physState || !rocket) return;
    const telem = Physics.telemetry(physState, rocket, simTime);
    const dom   = telem.dominantBody;

    document.getElementById("t-alt").textContent  = fmtDist(telem.altitude);
    document.getElementById("t-spd").textContent  = fmtSpeed(telem.speed);
    document.getElementById("t-vspd").textContent = (telem.vspd >= 0 ? "+" : "") + fmtSpeed(telem.vspd);
    document.getElementById("t-mach").textContent = telem.mach.toFixed(2);
    document.getElementById("t-body").textContent = dom.name.toUpperCase();
    document.getElementById("t-gforce").textContent = telem.gforce.toFixed(2) + " g";

    const fuelPct = rocket.maxFuel() > 0
      ? Math.round(rocket.activeFuel() / rocket.maxFuel() * 100) : 0;
    const fuelEl = document.getElementById("t-fuel");
    fuelEl.textContent = fuelPct + "%";
    fuelEl.className = "telem-val" + (fuelPct < 20 ? " crit" : fuelPct < 40 ? " warn" : "");

    // Orbital elements
    if (telem.orb && !isNaN(telem.orb.sma) && telem.orb.sma > 0) {
      const apo  = telem.orb.apo  - dom.radius;
      const peri = telem.orb.peri - dom.radius;
      document.getElementById("t-apo").textContent  = fmtDist(apo);
      document.getElementById("t-peri").textContent = fmtDist(peri);
      document.getElementById("t-apo").className  = "telem-val" + (apo > 0 ? "" : " warn");
      document.getElementById("t-peri").className = "telem-val" + (peri > 0 ? "" : " crit");
    } else {
      document.getElementById("t-apo").textContent  = "—";
      document.getElementById("t-peri").textContent = "—";
    }

    // Navball
    drawNavball(physState.angle);
  }

  function drawNavball(angle) {
    const nb  = document.getElementById("navball-canvas");
    const nc  = nb.getContext("2d");
    const cx  = nb.width / 2, cy = nb.height / 2, r = cx - 2;

    nc.clearRect(0, 0, nb.width, nb.height);

    // Background gradient (sky/ground split)
    const rotAngle = -angle; // visual rotation
    nc.save();
    nc.translate(cx, cy);
    nc.rotate(rotAngle);

    // Sky (blue) / Ground (brown) halves
    nc.fillStyle = "#1040a0";
    nc.beginPath(); nc.arc(0, 0, r, 0, Math.PI*2); nc.fill();
    nc.fillStyle = "#604020";
    nc.beginPath(); nc.rect(-r, 0, r*2, r); nc.fill();

    // Horizon line
    nc.strokeStyle = "#c8c870";
    nc.lineWidth = 1.5;
    nc.beginPath(); nc.moveTo(-r, 0); nc.lineTo(r, 0); nc.stroke();

    // Pitch lines
    nc.strokeStyle = "rgba(200,200,100,0.5)";
    nc.lineWidth = 0.8;
    for (let deg = -80; deg <= 80; deg += 10) {
      if (deg === 0) continue;
      const py = deg / 90 * r;
      const pw = deg % 30 === 0 ? r*0.5 : r*0.25;
      nc.beginPath(); nc.moveTo(-pw, py); nc.lineTo(pw, py); nc.stroke();
    }

    nc.restore();

    // Clip to circle
    nc.save();
    nc.globalCompositeOperation = "destination-in";
    nc.beginPath(); nc.arc(cx, cy, r, 0, Math.PI*2); nc.fill();
    nc.restore();

    // Border
    nc.strokeStyle = "#2a4a08";
    nc.lineWidth = 2;
    nc.beginPath(); nc.arc(cx, cy, r, 0, Math.PI*2); nc.stroke();

    // Prograde marker (centre reticle)
    nc.strokeStyle = "#a8ff3e";
    nc.lineWidth = 1.5;
    nc.beginPath(); nc.arc(cx, cy, 5, 0, Math.PI*2); nc.stroke();
    nc.beginPath(); nc.moveTo(cx-10, cy); nc.lineTo(cx+10, cy); nc.stroke();
    nc.beginPath(); nc.moveTo(cx, cy-10); nc.lineTo(cx, cy+10); nc.stroke();
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  function render() {
    if (document.getElementById("screen-flight").classList.contains("hidden")) return;

    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isMapMode) {
      renderMapView();
    } else {
      renderFlightView();
    }
    ctx.restore();
  }

  // Drag + zoom for map view
  let mapDrag = false, mapDragStart = { x:0, y:0 };
  document.getElementById("screen-flight").addEventListener("mousedown", e => {
    if (!isMapMode) return;
    mapDrag = true; mapDragStart = { x:e.clientX, y:e.clientY };
  });
  document.addEventListener("mousemove", e => {
    if (!mapDrag || !isMapMode) return;
    mapPanX += e.clientX - mapDragStart.x;
    mapPanY += e.clientY - mapDragStart.y;
    mapDragStart = { x:e.clientX, y:e.clientY };
  });
  document.addEventListener("mouseup", () => mapDrag = false);
  document.getElementById("screen-flight").addEventListener("wheel", e => {
    if (!isMapMode) return;
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.2 : 0.833;
    mapZoom *= f;
    mapZoom = Math.max(1e-13, Math.min(1e-7, mapZoom));
  }, { passive: false });

  function renderMapView() {
    // Dark bg
    ctx.fillStyle = "#000800";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(0);

    // Draw solar system centered on sun
    const sunSX = mapPanX;
    const sunSY = mapPanY;

    for (const b of SOLAR.bodies) {
      // Orbit path
      SOLAR.drawOrbit(ctx, b, sunSX, sunSY, mapZoom);
    }

    for (const b of SOLAR.bodies) {
      const sx = sunSX + b._pos.x * mapZoom;
      const sy = sunSY + b._pos.y * mapZoom;
      const sr = Math.max(b.mapRadius || 4, b.radius * mapZoom);
      SOLAR.drawBody(ctx, b, sx, sy, sr, mapZoom);
    }

    // Rocket position
    if (physState) {
      const rx = sunSX + physState.px * mapZoom;
      const ry = sunSY + physState.py * mapZoom;
      ctx.fillStyle = "#a8ff3e";
      ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#a8ff3e";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(rx, ry, 8, 0, Math.PI*2); ctx.stroke();

      // Orbit trail
      if (orbitTrail.length > 1) {
        ctx.strokeStyle = "#40b0ff80";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sunSX + orbitTrail[0].x * mapZoom, sunSY + orbitTrail[0].y * mapZoom);
        for (const pt of orbitTrail) {
          ctx.lineTo(sunSX + pt.x * mapZoom, sunSY + pt.y * mapZoom);
        }
        ctx.stroke();
      }

      // Projected orbit
      if (!landed) {
        const dom = SOLAR.dominantBody(physState.px, physState.py, SOLAR.bodies);
        const dx  = physState.px - dom._pos.x;
        const dy  = physState.py - dom._pos.y;
        const rvx = physState.vx - (dom._vel?.x || 0);
        const rvy = physState.vy - (dom._vel?.y || 0);
        try {
          const orb = SOLAR.orbitalElements(dx, dy, rvx, rvy, dom.mass);
          if (orb.sma > 0 && orb.ecc < 0.99) {
            const domSX = sunSX + dom._pos.x * mapZoom;
            const domSY = sunSY + dom._pos.y * mapZoom;
            const a = orb.sma * mapZoom;
            const b = a * Math.sqrt(1 - orb.ecc * orb.ecc);
            ctx.strokeStyle = "#40b0ff60";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.ellipse(domSX, domSY, a, b, 0, 0, Math.PI*2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        } catch(e) {}
      }
    }
  }

  function renderFlightView() {
    // Space background
    ctx.fillStyle = "#000800";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(0.016);

    Camera.update(0.016);

    const mtp = Camera.zoom; // meters to pixels

    // Draw bodies
    for (const b of SOLAR.bodies) {
      const bsx = canvas.width  / 2 + (b._pos.x - Camera.x) * mtp;
      const bsy = canvas.height / 2 + (b._pos.y - Camera.y) * mtp;
      const bsr = Math.max(b.radius * mtp, 2);

      // Only draw if possibly visible
      if (bsx + bsr < -100 || bsx - bsr > canvas.width  + 100) continue;
      if (bsy + bsr < -100 || bsy - bsr > canvas.height + 100) continue;

      SOLAR.drawBody(ctx, b, bsx, bsy, bsr, mtp);

      // Surface grid lines when zoomed in
      if (bsr > 50) {
        drawSurfaceGrid(ctx, b, bsx, bsy, bsr);
      }
    }

    // Orbit trail
    if (orbitTrail.length > 1) {
      ctx.strokeStyle = "#40b0ff40";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      const p0 = orbitTrail[0];
      ctx.moveTo(canvas.width/2 + (p0.x - Camera.x) * mtp, canvas.height/2 + (p0.y - Camera.y) * mtp);
      for (const pt of orbitTrail) {
        ctx.lineTo(canvas.width/2 + (pt.x - Camera.x) * mtp, canvas.height/2 + (pt.y - Camera.y) * mtp);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw rocket
    if (physState && rocket) {
      const rx = canvas.width  / 2;
      const ry = canvas.height / 2;
      drawRocketInFlight(ctx, rocket, rx, ry, physState.angle, mtp);

      // Thrust flame
      if (rocket.throttle > 0 && !landed) {
        drawFlame(ctx, rx, ry, physState.angle, rocket.throttle, mtp);
      }
    }
  }

  function drawSurfaceGrid(ctx, body, cx, cy, sr) {
    // Draw a few surface latitude lines
    ctx.save();
    ctx.strokeStyle = body.color + "30";
    ctx.lineWidth = 0.5;
    for (let lat = -80; lat <= 80; lat += 20) {
      const yr = Math.sin(lat * Math.PI / 180) * sr;
      const xr = Math.cos(lat * Math.PI / 180) * sr;
      ctx.beginPath();
      ctx.arc(cx, cy, xr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRocketInFlight(ctx, rocket, cx, cy, angle, mtp) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle); // angle 0 = up

    // Scale: each part pixel in VAB = 0.5 real meters
    const PART_SCALE = Math.max(0.5 * mtp, 2);
    const b = rocket.bounds();
    if (!b.w) { ctx.restore(); return; }

    const offX = -(b.x + b.w/2) * PART_SCALE;
    const offY = -(b.y + b.h/2) * PART_SCALE;

    for (const p of rocket.parts) {
      if (rocket.decoupledStages.has(p.stageIdx)) continue;
      const def = PARTS[p.partId];
      if (!def) continue;
      const px = offX + p.gridX * PART_SCALE;
      const py = offY + p.gridY * PART_SCALE;
      def.draw(ctx, px, py, def.width * PART_SCALE, def.height * PART_SCALE, false);
    }

    ctx.restore();
  }

  function drawFlame(ctx, cx, cy, angle, throttle, mtp) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const PART_SCALE = Math.max(0.5 * mtp, 2);
    const b = rocket.bounds();
    const offY = (b.h/2) * PART_SCALE;   // bottom of rocket

    // Find engines at bottom of rocket for flame position
    const engineParts = rocket.parts.filter(p =>
      !rocket.decoupledStages.has(p.stageIdx) &&
      p.stageIdx === rocket.currentStageIdx &&
      PARTS[p.partId]?.thrust
    );
    if (!engineParts.length) { ctx.restore(); return; }

    for (const ep of engineParts) {
      const def = PARTS[ep.partId];
      const ex = (-(b.x + b.w/2) + ep.gridX + def.width/2) * PART_SCALE;
      const ey = offY;
      const len = throttle * 80 * PART_SCALE * (0.8 + Math.random() * 0.4);
      const wid = def.width * PART_SCALE * 0.4;

      const grad = ctx.createLinearGradient(ex, ey, ex, ey + len);
      grad.addColorStop(0,   "rgba(255,255,200,0.95)");
      grad.addColorStop(0.1, "rgba(255,200,50,0.85)");
      grad.addColorStop(0.4, "rgba(255,100,20,0.6)");
      grad.addColorStop(0.75,"rgba(200,50,10,0.3)");
      grad.addColorStop(1,   "rgba(100,20,5,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(ex - wid/2, ey);
      ctx.bezierCurveTo(ex - wid, ey + len*0.3, ex - wid*0.5, ey + len*0.7, ex, ey + len);
      ctx.bezierCurveTo(ex + wid*0.5, ey + len*0.7, ex + wid, ey + len*0.3, ex + wid/2, ey);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  return {
    start, update, render, toggleMap, activateStage,
    get physState() { return physState; },
    get rocket() { return rocket; },
    get simTime() { return simTime; },
    get isDead() { return isDead; },
  };
})();

// ── FORMATTING HELPERS ────────────────────────────────────────────────────────
function fmtDist(m) {
  const a = Math.abs(m);
  if (a >= 1e9) return (m/1e9).toFixed(2) + " Gm";
  if (a >= 1e6) return (m/1e6).toFixed(2) + " Mm";
  if (a >= 1e3) return (m/1e3).toFixed(1) + " km";
  return m.toFixed(0) + " m";
}

function fmtSpeed(ms) {
  const a = Math.abs(ms);
  if (a >= 1000) return (ms/1000).toFixed(2) + " km/s";
  return ms.toFixed(1) + " m/s";
}

// ── UI CONTROLLER ─────────────────────────────────────────────────────────────
const GameUI = (() => {
  const screens = ["screen-title", "screen-vab", "screen-flight"];
  let vabInited = false;

  function show(id) {
    screens.forEach(s => document.getElementById(s).classList.add("hidden"));
    if (id) document.getElementById(id).classList.remove("hidden");
    // Only show canvas during flight (or hidden for VAB)
    canvas.style.display = (id === "screen-flight") ? "block" : "block";
  }

  function showTitle() {
    show("screen-title");
  }

  function showVAB() {
    show("screen-vab");
    if (!vabInited) {
      vabInited = true;
      VAB.init(document.getElementById("vab-canvas"));
    } else {
      // Resize VAB canvas
      const wrap = document.getElementById("vab-canvas-wrap");
      const vc = document.getElementById("vab-canvas");
      vc.width  = wrap.clientWidth;
      vc.height = wrap.clientHeight;
    }
  }

  function launchRocket() {
    const rocket = VAB.getRocket();
    if (!rocket.parts.length) {
      toast("NO PARTS! BUILD A ROCKET FIRST.", "err");
      return;
    }
    const hasCommand = rocket.parts.some(p => PARTS[p.partId]?.crew !== undefined);
    if (!hasCommand) {
      toast("NEEDS A COMMAND POD.", "warn");
    }
    const hasEngine = rocket.parts.some(p => PARTS[p.partId]?.thrust);
    if (!hasEngine) {
      toast("NEEDS AN ENGINE.", "warn");
      return;
    }
    show("screen-flight");
    Flight.start(rocket);
  }

  function confirmAbort() {
    showModal(
      "ABORT MISSION",
      "Return to Vehicle Assembly Building?\nAll flight progress will be lost.",
      [
        { label: "ABORT", action: () => { hideModal(); showVAB(); }, cls: "danger" },
        { label: "CONTINUE", action: hideModal, cls: "primary" },
      ]
    );
  }

  function showCrash(body, speed) {
    showModal(
      "✕  VEHICLE DESTROYED",
      `Impacted ${body.name} at ${fmtSpeed(speed)}.\nAll crew aboard have perished.\n\nGodspeed.`,
      [
        { label: "BACK TO VAB", action: () => { hideModal(); showVAB(); }, cls: "" },
      ]
    );
  }

  function showLanding(body, speed) {
    toast(`LANDED ON ${body.name.toUpperCase()}!  Impact: ${fmtSpeed(speed)}`, "ok");
  }

  function showCredits() {
    showModal(
      "CookedFS",
      "2D Space Flight Simulator\n\nBuilt with vanilla HTML5 canvas.\n\nNewtonian physics simulation\nReal solar system data\nFull rocket staging\n\nGood luck out there.",
      [{ label: "CLOSE", action: hideModal, cls: "primary" }]
    );
  }

  // ── Toast system ──
  function toast(msg, type) {
    const wrap = document.getElementById("toast-wrap");
    const el   = document.createElement("div");
    el.className = "toast" + (type === "warn" ? " warn" : type === "err" ? " err" : "");
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ── Modal system ──
  function showModal(title, body, btns) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").textContent  = body;
    const bEl = document.getElementById("modal-btns");
    bEl.innerHTML = "";
    for (const b of btns) {
      const btn = document.createElement("button");
      btn.className = "title-btn" + (b.cls ? " " + b.cls : "");
      btn.style.width = "auto";
      btn.style.padding = "8px 24px";
      btn.textContent = b.label;
      btn.addEventListener("click", b.action);
      bEl.appendChild(btn);
    }
    document.getElementById("modal-overlay").classList.remove("hidden");
  }

  function hideModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
  }

  return { showTitle, showVAB, launchRocket, confirmAbort, showCrash, showLanding, showCredits, toast, showModal, hideModal };
})();

// ── MAIN GAME LOOP ────────────────────────────────────────────────────────────
let lastTime = performance.now();

function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
  lastTime = now;

  // Background starfield on title / VAB
  if (!document.getElementById("screen-title").classList.contains("hidden") ||
      !document.getElementById("screen-vab").classList.contains("hidden")) {
    ctx.fillStyle = "#050a00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(dt);
  }

  // Flight update + render
  if (!document.getElementById("screen-flight").classList.contains("hidden")) {
    SOLAR.stepPlanets(0); // positions updated inside Flight.update too
    Flight.update(dt);
    Flight.render();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Start on title
GameUI.showTitle();

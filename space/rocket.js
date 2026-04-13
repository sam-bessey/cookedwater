// rocket.js — CookedFS Rocket Building System
"use strict";

// ── PART DEFINITIONS ─────────────────────────────────────────────────────────
const PARTS = {

  // ── COMMAND ──
  "pod-mk1": {
    id: "pod-mk1", name: "Mk1 Pod", category: "command",
    mass: 840,          // kg dry
    width: 40, height: 50,
    color: "#c8c8b0", outline: "#a0a090",
    maxTemp: 2400,
    crew: 1,
    dragCoeff: 0.2,
    icon: "🧑‍🚀",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#e0e0c8" : this.color;
      // Capsule shape
      ctx.beginPath();
      ctx.moveTo(x, y + h*0.35);
      ctx.lineTo(x + w*0.15, y);
      ctx.lineTo(x + w*0.85, y);
      ctx.lineTo(x + w, y + h*0.35);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Window
      ctx.fillStyle = "#60a0d0";
      ctx.beginPath();
      ctx.ellipse(x+w/2, y+h*0.45, w*0.2, h*0.15, 0, 0, Math.PI*2);
      ctx.fill();
    },
    description: "Basic command module.\n1 crew. Withstands re-entry.",
  },

  "pod-mk2": {
    id: "pod-mk2", name: "Mk2 Lander Pod", category: "command",
    mass: 600,
    width: 44, height: 44,
    color: "#a8b8c8", outline: "#808898",
    maxTemp: 1800,
    crew: 1,
    dragCoeff: 0.25,
    icon: "🧑‍🚀",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#c0d0e0" : this.color;
      ctx.beginPath();
      ctx.arc(x + w/2, y + h*0.5, w*0.48, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#60a0d0";
      ctx.beginPath();
      ctx.ellipse(x+w/2, y+h*0.42, w*0.22, h*0.15, 0, 0, Math.PI*2);
      ctx.fill();
    },
    description: "Lightweight lander pod.\nIdeal for airless bodies.",
  },

  // ── ENGINES ──
  "engine-spark": {
    id: "engine-spark", name: "Spark Engine", category: "engines",
    mass: 100,
    width: 30, height: 36,
    color: "#808898", outline: "#606070",
    thrust: 18_000,      // N (18 kN)
    isp: 320,            // s (vacuum)
    ispAtm: 270,
    fuelConsumption: 0.0057, // kg/s per N (= 1/isp/g0)
    gimbal: true,
    icon: "🔥",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#a0a8b8" : this.color;
      // Nozzle shape
      ctx.beginPath();
      ctx.moveTo(x + w*0.2, y);
      ctx.lineTo(x + w*0.8, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    },
    description: "Small vacuum engine.\nThrust: 18 kN  Isp: 320s",
  },

  "engine-swivel": {
    id: "engine-swivel", name: "Swivel Engine", category: "engines",
    mass: 1500,
    width: 40, height: 48,
    color: "#a0a0b0", outline: "#707080",
    thrust: 200_000,     // 200 kN
    isp: 345,
    ispAtm: 250,
    fuelConsumption: 0.003,
    gimbal: true,
    icon: "🔥",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#c0c0d0" : this.color;
      ctx.beginPath();
      ctx.moveTo(x + w*0.25, y);
      ctx.lineTo(x + w*0.75, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      // Bell detail
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#50507060";
      ctx.beginPath();
      ctx.arc(x+w/2, y+h*0.3, w*0.2, 0, Math.PI*2);
      ctx.fill();
    },
    description: "Gimballed main engine.\nThrust: 200 kN  Isp: 345s",
  },

  "engine-mainsail": {
    id: "engine-mainsail", name: "Mainsail", category: "engines",
    mass: 6000,
    width: 60, height: 64,
    color: "#909090", outline: "#606060",
    thrust: 1_500_000,   // 1.5 MN
    isp: 310,
    ispAtm: 285,
    fuelConsumption: 0.0033,
    gimbal: true,
    icon: "🔥",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#b0b0b0" : this.color;
      ctx.beginPath();
      ctx.moveTo(x + w*0.2, y);
      ctx.lineTo(x + w*0.8, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    description: "Heavy launch engine.\nThrust: 1500 kN  Isp: 310s",
  },

  "engine-poodle": {
    id: "engine-poodle", name: "Poodle", category: "engines",
    mass: 1750,
    width: 50, height: 38,
    color: "#b8b8c8", outline: "#888898",
    thrust: 250_000,
    isp: 390,
    ispAtm: 90,
    fuelConsumption: 0.00262,
    gimbal: true,
    icon: "🔥",
    draw(ctx, x, y, w, h, sel) {
      // Dual nozzle
      ctx.fillStyle = sel ? "#d0d0e0" : this.color;
      const nw = w*0.35, nh = h;
      ctx.fillRect(x + w*0.05, y, nw, nh*0.5);
      ctx.fillRect(x + w*0.6,  y, nw, nh*0.5);
      ctx.beginPath();
      ctx.moveTo(x + w*0.05, y + nh*0.5);
      ctx.lineTo(x, y + nh);
      ctx.lineTo(x + w*0.4, y + nh);
      ctx.lineTo(x + w*0.4, y + nh*0.5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + w*0.6, y + nh*0.5);
      ctx.lineTo(x + w*0.6, y + nh);
      ctx.lineTo(x + w, y + nh);
      ctx.lineTo(x + w, y + nh*0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + w*0.05, y, nw, nh*0.5);
      ctx.strokeRect(x + w*0.6,  y, nw, nh*0.5);
    },
    description: "High-efficiency vacuum engine.\nThrust: 250 kN  Isp: 390s",
  },

  // ── FUEL TANKS ──
  "tank-tiny": {
    id: "tank-tiny", name: "FL-T100 Tank", category: "fuel",
    mass: 562,           // kg full (112 dry + 450 fuel)
    dryMass: 112,
    fuelMass: 450,
    width: 40, height: 50,
    color: "#c8c8d8", outline: "#9090a0",
    icon: "🛢",
    draw(ctx, x, y, w, h, sel) {
      drawTank(ctx, x, y, w, h, sel ? "#e0e0f0" : this.color, this.outline);
    },
    description: "Small fuel tank.\nFuel: 450 kg",
  },

  "tank-small": {
    id: "tank-small", name: "FL-T400 Tank", category: "fuel",
    mass: 2250,
    dryMass: 250,
    fuelMass: 2000,
    width: 40, height: 100,
    color: "#c8c8d8", outline: "#9090a0",
    icon: "🛢",
    draw(ctx, x, y, w, h, sel) {
      drawTank(ctx, x, y, w, h, sel ? "#e0e0f0" : this.color, this.outline);
    },
    description: "Standard fuel tank.\nFuel: 2000 kg",
  },

  "tank-large": {
    id: "tank-large", name: "FL-T800 Tank", category: "fuel",
    mass: 4500,
    dryMass: 500,
    fuelMass: 4000,
    width: 40, height: 200,
    color: "#c8c8d8", outline: "#9090a0",
    icon: "🛢",
    draw(ctx, x, y, w, h, sel) {
      drawTank(ctx, x, y, w, h, sel ? "#e0e0f0" : this.color, this.outline);
    },
    description: "Large fuel tank.\nFuel: 4000 kg",
  },

  "tank-jumbo": {
    id: "tank-jumbo", name: "Jumbo-64 Tank", category: "fuel",
    mass: 36_000,
    dryMass: 4_000,
    fuelMass: 32_000,
    width: 64, height: 200,
    color: "#d0d0e0", outline: "#9090a8",
    icon: "🛢",
    draw(ctx, x, y, w, h, sel) {
      drawTank(ctx, x, y, w, h, sel ? "#e8e8f8" : this.color, this.outline);
    },
    description: "Heavy launch tank.\nFuel: 32000 kg",
  },

  // ── STRUCTURE ──
  "decoupler-sm": {
    id: "decoupler-sm", name: "TR-18A Decoupler", category: "structure",
    mass: 50,
    width: 40, height: 14,
    color: "#ff8800", outline: "#cc5500",
    isDecoupler: true,
    icon: "💥",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#ffaa44" : this.color;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 2;
      ctx.strokeRect(x+2, y+2, w-4, h-4);
      // Bolts
      ctx.fillStyle = "#ffcc88";
      for (let bx = w*0.15; bx < w; bx += w*0.25) {
        ctx.beginPath();
        ctx.arc(x+bx, y+h/2, 2, 0, Math.PI*2);
        ctx.fill();
      }
    },
    description: "Stage separator.\nActivated by STAGE.",
  },

  "nosecone": {
    id: "nosecone", name: "AE-FF1 Nose Cone", category: "structure",
    mass: 70,
    width: 40, height: 60,
    color: "#c8c8b8", outline: "#909088",
    dragCoeff: -0.1,     // reduces drag when on top
    icon: "▲",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#e0e0d0" : this.color;
      ctx.beginPath();
      ctx.moveTo(x + w/2, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    },
    description: "Aerodynamic nose cone.\nReduces drag.",
  },

  "fin-sm": {
    id: "fin-sm", name: "AV-R8 Fin", category: "structure",
    mass: 100,
    width: 36, height: 40,
    color: "#c8c0b0", outline: "#908880",
    isFin: true,
    icon: "◁",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#e0d8c8" : this.color;
      ctx.beginPath();
      ctx.moveTo(x + w*0.5, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    },
    description: "Aerodynamic stabiliser fin.\nImproves attitude control.",
  },

  // ── UTILITY ──
  "parachute": {
    id: "parachute", name: "Mk2-R Parachute", category: "utility",
    mass: 100,
    width: 34, height: 22,
    color: "#d04040", outline: "#a02020",
    isParachute: true,
    deployed: false,
    icon: "🪂",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#e06060" : this.color;
      ctx.beginPath();
      ctx.arc(x+w/2, y+h*0.8, w*0.45, Math.PI, 0);
      ctx.lineTo(x+w*0.6, y+h);
      ctx.lineTo(x+w*0.4, y+h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    },
    description: "Drogue parachute.\nDeploy in atmosphere.",
  },

  "solar-panel": {
    id: "solar-panel", name: "OX-4 Solar Panel", category: "utility",
    mass: 35,
    width: 60, height: 12,
    color: "#3060c0", outline: "#1040a0",
    icon: "⚡",
    draw(ctx, x, y, w, h, sel) {
      ctx.fillStyle = sel ? "#4080e0" : this.color;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#5090e0";
      ctx.lineWidth = 1;
      for (let gx = x + w/4; gx < x+w; gx += w/4) {
        ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y+h); ctx.stroke();
      }
      ctx.strokeStyle = this.outline;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    },
    description: "Solar electricity generation.\nCosmetic for now.",
  },

  "landing-leg": {
    id: "landing-leg", name: "LT-1 Landing Leg", category: "utility",
    mass: 50,
    width: 30, height: 40,
    color: "#a0a090", outline: "#707060",
    isLandingLeg: true,
    icon: "🦵",
    draw(ctx, x, y, w, h, sel) {
      ctx.strokeStyle = sel ? "#d0d0c0" : this.color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x+w*0.5, y);
      ctx.lineTo(x+w*0.1, y+h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+w*0.1, y+h);
      ctx.lineTo(x+w*0.6, y+h);
      ctx.stroke();
    },
    description: "Deployable landing leg.\nFor soft landings.",
  },
};

// ── SHARED DRAW HELPER ────────────────────────────────────────────────────────
function drawTank(ctx, x, y, w, h, fill, stroke) {
  const r = w * 0.12;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Band markings
  ctx.strokeStyle = stroke + "80";
  ctx.lineWidth = 1;
  const bands = Math.floor(h / 30);
  for (let i = 1; i <= bands; i++) {
    const by = y + h * i / (bands+1);
    ctx.beginPath();
    ctx.moveTo(x+4, by);
    ctx.lineTo(x+w-4, by);
    ctx.stroke();
  }
}

// ── ROCKET CLASS ──────────────────────────────────────────────────────────────
class Rocket {
  constructor() {
    this.name = "Unnamed Rocket";
    // parts: [{partId, gridX, gridY, stageIdx}]
    this.parts = [];
    this.throttle   = 0;    // 0–1
    this.steering   = 0;    // -1 left, +1 right, 0 none
    this.currentStageIdx = 0;
    this.parachuteDeployed = false;

    // Fuel state per tank part (index → remaining fuel kg)
    this.fuelState = {};

    // Decoupled stage indices
    this.decoupledStages = new Set();
  }

  // ── Total mass (dry + remaining fuel) ──
  totalMass() {
    let m = 0;
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      if (this.decoupledStages.has(p.stageIdx)) continue;
      const def = PARTS[p.partId];
      if (!def) continue;
      if (def.dryMass !== undefined) {
        m += def.dryMass + (this.fuelState[i] !== undefined ? this.fuelState[i] : (def.fuelMass || 0));
      } else {
        m += def.mass;
      }
    }
    return Math.max(m, 1);
  }

  // ── Active fuel mass ──
  activeFuel() {
    let f = 0;
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      if (this.decoupledStages.has(p.stageIdx)) continue;
      const def = PARTS[p.partId];
      if (def && def.dryMass !== undefined) {
        f += this.fuelState[i] !== undefined ? this.fuelState[i] : (def.fuelMass || 0);
      }
    }
    return f;
  }

  // ── Maximum fuel ──
  maxFuel() {
    let f = 0;
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      if (this.decoupledStages.has(p.stageIdx)) continue;
      const def = PARTS[p.partId];
      if (def && def.fuelMass) f += def.fuelMass;
    }
    return f;
  }

  // ── Current thrust ──
  currentThrust() {
    if (this.throttle <= 0) return 0;
    let t = 0;
    for (const p of this.parts) {
      if (this.decoupledStages.has(p.stageIdx)) continue;
      if (p.stageIdx !== this.currentStageIdx) continue;
      const def = PARTS[p.partId];
      if (def && def.thrust) t += def.thrust;
    }
    return t * this.throttle;
  }

  // ── Fuel consumption per second ──
  fuelConsumptionRate() {
    if (this.throttle <= 0) return 0;
    let rate = 0;
    for (const p of this.parts) {
      if (this.decoupledStages.has(p.stageIdx)) continue;
      if (p.stageIdx !== this.currentStageIdx) continue;
      const def = PARTS[p.partId];
      if (def && def.fuelConsumption) {
        rate += def.fuelConsumption * def.thrust * this.throttle;
      }
    }
    return rate;
  }

  // ── Consume fuel over dt seconds; returns false if ran out ──
  consumeFuel(dt) {
    const rate = this.fuelConsumptionRate();
    if (rate <= 0) return true;
    let needed = rate * dt;
    // Drain tanks in current (and earlier undecoupled) stages
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      if (this.decoupledStages.has(p.stageIdx)) continue;
      const def = PARTS[p.partId];
      if (!def || def.fuelMass === undefined) continue;
      const cur = this.fuelState[i] !== undefined ? this.fuelState[i] : def.fuelMass;
      const take = Math.min(cur, needed);
      this.fuelState[i] = cur - take;
      needed -= take;
      if (needed <= 0) break;
    }
    return needed <= 0; // true = had enough fuel
  }

  // ── Δv estimate ──
  deltaV() {
    // Tsiolkovsky: Δv = Isp * g0 * ln(m0/m1)
    const g0 = 9.807;
    let totalDv = 0;
    const stages = this.stageList();
    let totalMassNow = this.totalMass() +
      this.parts.filter(p => !this.decoupledStages.has(p.stageIdx))
        .reduce((s, p, i) => s + ((PARTS[p.partId]?.fuelMass || 0) - (this.fuelState[i] || PARTS[p.partId]?.fuelMass || 0)), 0);
    // simplified: use current total mass as m0, dry mass as m1
    for (const st of stages) {
      const stageEngines = this.parts.filter(p => p.stageIdx === st && PARTS[p.partId]?.thrust);
      if (!stageEngines.length) continue;
      const isp = stageEngines.reduce((s, p) => s + (PARTS[p.partId]?.isp || 0), 0) / stageEngines.length;
      const stageFuel = this.parts
        .filter(p => p.stageIdx === st && PARTS[p.partId]?.fuelMass)
        .reduce((s, p, _i, _a) => {
          const idx = this.parts.indexOf(p);
          return s + (this.fuelState[idx] !== undefined ? this.fuelState[idx] : (PARTS[p.partId]?.fuelMass || 0));
        }, 0);
      if (stageFuel > 0 && isp > 0) {
        const m0 = totalMassNow;
        const m1 = totalMassNow - stageFuel;
        totalDv += isp * g0 * Math.log(m0 / Math.max(m1, 1));
        totalMassNow = m1;
      }
    }
    return totalDv;
  }

  // ── Thrust-to-weight ratio ──
  twr() {
    const thrust = this.parts
      .filter(p => !this.decoupledStages.has(p.stageIdx) && p.stageIdx === this.currentStageIdx)
      .reduce((s, p) => s + (PARTS[p.partId]?.thrust || 0), 0);
    return thrust / (this.totalMass() * 9.807);
  }

  // ── Cross-section (for drag) ──
  get crossSection() {
    let maxW = 0;
    for (const p of this.parts) {
      const def = PARTS[p.partId];
      if (def) maxW = Math.max(maxW, def.width);
    }
    // Convert grid pixels → meters (1 grid unit = 0.5 m)
    return Math.PI * Math.pow(maxW * 0.5 / 2, 2);
  }

  // ── Drag coefficient ──
  get Cd() {
    let cd = 0.3;
    for (const p of this.parts) {
      const def = PARTS[p.partId];
      if (def?.dragCoeff) cd += def.dragCoeff;
    }
    return Math.max(cd, 0.1);
  }

  // ── Moment of inertia (simplified) ──
  momentOfInertia() {
    return this.totalMass() * 4; // rough: m*r² with r≈2m
  }

  // ── Stage list ──
  stageList() {
    const s = new Set(this.parts.map(p => p.stageIdx));
    return Array.from(s).sort((a,b) => b - a); // descending (last stage first)
  }

  // ── Activate next stage (decouple / ignite) ──
  activateStage() {
    // Find current stage decouplers → decouple them
    const decouplers = this.parts.filter(p =>
      p.stageIdx === this.currentStageIdx && PARTS[p.partId]?.isDecoupler
    );
    if (decouplers.length > 0) {
      this.decoupledStages.add(this.currentStageIdx);
    }
    // Advance to next stage
    const stages = this.stageList().filter(s => !this.decoupledStages.has(s));
    const ci = stages.indexOf(this.currentStageIdx);
    if (ci > 0) {
      this.currentStageIdx = stages[ci - 1];
    }
    return decouplers.length > 0 ? "decouple" : "ignite";
  }

  // ── Init fuel state ──
  initFuelState() {
    this.fuelState = {};
    for (let i = 0; i < this.parts.length; i++) {
      const def = PARTS[this.parts[i].partId];
      if (def?.fuelMass) this.fuelState[i] = def.fuelMass;
    }
  }

  // ── Bounding box of entire rocket (in VAB grid units) ──
  bounds() {
    if (!this.parts.length) return { x:0, y:0, w:0, h:0 };
    let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
    for (const p of this.parts) {
      const def = PARTS[p.partId];
      if (!def) continue;
      minX = Math.min(minX, p.gridX);
      minY = Math.min(minY, p.gridY);
      maxX = Math.max(maxX, p.gridX + def.width);
      maxY = Math.max(maxY, p.gridY + def.height);
    }
    return { x: minX, y: minY, w: maxX-minX, h: maxY-minY };
  }

  // ── Draw entire rocket (centered) ──
  draw(ctx, cx, cy, scale, highlightDecoupled) {
    const b = this.bounds();
    const offX = cx - (b.x + b.w/2) * scale;
    const offY = cy - (b.y + b.h/2) * scale;
    ctx.save();
    for (const p of this.parts) {
      const def = PARTS[p.partId];
      if (!def) continue;
      const isDecoupled = this.decoupledStages.has(p.stageIdx);
      ctx.globalAlpha = isDecoupled && highlightDecoupled ? 0.3 : 1.0;
      const px = offX + p.gridX * scale;
      const py = offY + p.gridY * scale;
      const pw = def.width  * scale;
      const ph = def.height * scale;
      def.draw(ctx, px, py, pw, ph, false);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ── VAB BUILDER ───────────────────────────────────────────────────────────────
const VAB = (() => {
  const GRID = 4;       // snap grid in pixels
  const BASE_SCALE = 1.0;

  let canvas, ctx;
  let rocket = new Rocket();
  let selectedPartId = null;
  let hovX = 0, hovY = 0;  // hover position in grid units
  let panX = 0, panY = 0;  // canvas pan offset
  let zoom  = 1.0;
  let isPanning = false;
  let panStart = { x:0, y:0 };
  let rotating = 0; // 0, 1, 2, 3 rotation steps (not used in v1, parts stack vertically)
  let nextStage = 0;
  let currentStageForPlacement = 0;

  // Convert canvas coords → grid coords
  function canvasToGrid(cx, cy) {
    return {
      x: Math.round(((cx - panX) / zoom) / GRID) * GRID,
      y: Math.round(((cy - panY) / zoom) / GRID) * GRID,
    };
  }

  function init(_canvas) {
    canvas = _canvas;
    ctx = canvas.getContext("2d");
    resize();
    buildPartsList();
    bindEvents();
    render();
  }

  function resize() {
    const wrap = document.getElementById("vab-canvas-wrap");
    canvas.width  = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    // Center offset
    panX = canvas.width / 2;
    panY = canvas.height * 0.75;
  }

  function bindEvents() {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup",   onMouseUp);
    canvas.addEventListener("contextmenu", onRightClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeyDown);
  }

  function onMouseMove(e) {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    if (isPanning && e.buttons === 4) {
      panX += mx - panStart.x;
      panY += my - panStart.y;
      panStart = { x:mx, y:my };
    }
    const g = canvasToGrid(mx, my);
    hovX = g.x;
    hovY = g.y;
  }

  function onMouseDown(e) {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    if (e.button === 1) { // middle
      isPanning = true;
      panStart = { x:mx, y:my };
      return;
    }
    if (e.button === 0 && selectedPartId) {
      placePart(hovX, hovY);
    } else if (e.button === 0) {
      // Select existing part for info
      selectPartAt(hovX, hovY);
    }
  }

  function onMouseUp(e) {
    if (e.button === 1) isPanning = false;
  }

  function onRightClick(e) {
    e.preventDefault();
    deletePartAt(hovX, hovY);
  }

  function onWheel(e) {
    e.preventDefault();
    const r  = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const factor = e.deltaY < 0 ? 1.12 : 0.88;
    // Zoom toward cursor
    panX = mx - (mx - panX) * factor;
    panY = my - (my - panY) * factor;
    zoom *= factor;
    zoom = Math.max(0.2, Math.min(4, zoom));
  }

  function onKeyDown(e) {
    if (e.key === "r" || e.key === "R") rotating = (rotating + 1) % 2;
    if (e.key === "Escape") selectedPartId = null;
    if (e.key === "]") { currentStageForPlacement++; nextStage = Math.max(nextStage, currentStageForPlacement); }
    if (e.key === "[") { currentStageForPlacement = Math.max(0, currentStageForPlacement - 1); }
  }

  function placePart(gx, gy) {
    const def = PARTS[selectedPartId];
    if (!def) return;
    // Snap to centre horizontally (centre of rocket = 0)
    const cx = -Math.round(def.width / 2 / GRID) * GRID;
    rocket.parts.push({
      partId: selectedPartId,
      gridX: cx,
      gridY: gy,
      stageIdx: currentStageForPlacement,
    });
    updateStats();
  }

  function deletePartAt(gx, gy) {
    for (let i = rocket.parts.length - 1; i >= 0; i--) {
      const p = rocket.parts[i];
      const def = PARTS[p.partId];
      if (!def) continue;
      if (gx >= p.gridX && gx <= p.gridX + def.width &&
          gy >= p.gridY && gy <= p.gridY + def.height) {
        rocket.parts.splice(i, 1);
        updateStats();
        return;
      }
    }
  }

  function selectPartAt(gx, gy) {
    for (let i = rocket.parts.length - 1; i >= 0; i--) {
      const p = rocket.parts[i];
      const def = PARTS[p.partId];
      if (!def) continue;
      if (gx >= p.gridX && gx <= p.gridX + def.width &&
          gy >= p.gridY && gy <= p.gridY + def.height) {
        showPartInfo(def, p);
        return;
      }
    }
  }

  function showPartInfo(def, p) {
    const el = document.getElementById("info-part-detail");
    el.textContent = [
      def.name,
      "─────────────",
      def.description || "",
      "",
      `Mass:   ${def.mass} kg`,
      def.thrust ? `Thrust: ${(def.thrust/1000).toFixed(1)} kN` : "",
      def.fuelMass ? `Fuel:   ${def.fuelMass} kg` : "",
      def.isp ? `Isp:    ${def.isp} s` : "",
      `Stage:  ${p.stageIdx}`,
    ].filter(Boolean).join("\n");
  }

  function updateStats() {
    rocket.initFuelState();
    const parts  = rocket.parts.length;
    const mass   = (rocket.totalMass() / 1000).toFixed(2);
    const thrust = (rocket.parts.reduce((s, p) => s + (PARTS[p.partId]?.thrust || 0), 0) / 1000).toFixed(1);
    const twr    = rocket.twr().toFixed(2);
    const dv     = Math.round(rocket.deltaV());
    const stages = rocket.stageList().length;

    document.getElementById("info-parts").textContent  = parts;
    document.getElementById("info-mass").textContent   = mass + " t";
    document.getElementById("info-thrust").textContent = thrust + " kN";
    document.getElementById("info-twr").textContent    = twr;
    document.getElementById("info-dv").textContent     = dv + " m/s";
    document.getElementById("info-stages").textContent = stages;
  }

  function buildPartsList() {
    const categories = {
      "command":   "parts-command",
      "engines":   "parts-engines",
      "fuel":      "parts-fuel",
      "structure": "parts-structure",
      "utility":   "parts-utility",
    };
    for (const [cat, elId] of Object.entries(categories)) {
      const container = document.getElementById(elId);
      if (!container) continue;
      for (const [id, def] of Object.entries(PARTS)) {
        if (def.category !== cat) continue;
        const btn = document.createElement("button");
        btn.className = "part-btn";
        btn.dataset.partId = id;
        btn.innerHTML = `<span class="part-icon">${def.icon || "□"}</span>${def.name}`;
        btn.addEventListener("click", () => {
          document.querySelectorAll(".part-btn").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          selectedPartId = id;
        });
        container.appendChild(btn);
      }
    }
  }

  function clearRocket() {
    if (!confirm("Clear the rocket?")) return;
    rocket = new Rocket();
    rocket.name = document.getElementById("vab-rocket-name").value || "Unnamed Rocket";
    currentStageForPlacement = 0;
    nextStage = 0;
    updateStats();
  }

  function getRocket() {
    rocket.name = document.getElementById("vab-rocket-name").value || "Unnamed Rocket";
    return rocket;
  }

  function setRocket(r) {
    rocket = r;
    document.getElementById("vab-rocket-name").value = r.name;
    updateStats();
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  const STAGE_COLORS = [
    "#ff9000","#40b0ff","#a8ff3e","#ff4040","#c070ff","#ff70c0","#70ffc0",
  ];

  function render() {
    requestAnimationFrame(render);
    if (document.getElementById("screen-vab").classList.contains("hidden")) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#050a00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid dots
    ctx.fillStyle = "#1a2a08";
    const gs = GRID * zoom;
    const ox = ((panX % gs) + gs) % gs;
    const oy = ((panY % gs) + gs) % gs;
    for (let gx = ox; gx < canvas.width; gx += gs) {
      for (let gy = oy; gy < canvas.height; gy += gs) {
        ctx.fillRect(gx-0.5, gy-0.5, 1, 1);
      }
    }

    // Ground line
    ctx.strokeStyle = "#2a4a08";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(0, panY);
    ctx.lineTo(canvas.width, panY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#1a3a0840";
    ctx.fillRect(0, panY, canvas.width, canvas.height - panY);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Draw placed parts
    for (const p of rocket.parts) {
      const def = PARTS[p.partId];
      if (!def) continue;
      // Stage colour outline
      ctx.save();
      ctx.strokeStyle = STAGE_COLORS[p.stageIdx % STAGE_COLORS.length] + "80";
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(p.gridX - 2/zoom, p.gridY - 2/zoom, def.width + 4/zoom, def.height + 4/zoom);
      ctx.restore();

      def.draw(ctx, p.gridX, p.gridY, def.width, def.height, false);

      // Stage badge
      ctx.fillStyle = STAGE_COLORS[p.stageIdx % STAGE_COLORS.length];
      ctx.font = `${8/zoom}px Courier New`;
      ctx.fillText(`S${p.stageIdx}`, p.gridX + 2, p.gridY + 10/zoom);
    }

    // Ghost part (hover preview)
    if (selectedPartId) {
      const def = PARTS[selectedPartId];
      if (def) {
        ctx.globalAlpha = 0.45;
        const cx = -Math.round(def.width / 2 / GRID) * GRID;
        def.draw(ctx, cx, hovY, def.width, def.height, true);
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();

    // Stage legend
    const stages = rocket.stageList();
    ctx.font = "10px Courier New";
    stages.forEach((s, i) => {
      ctx.fillStyle = STAGE_COLORS[s % STAGE_COLORS.length];
      ctx.fillText(`■ STAGE ${s}${s === currentStageForPlacement ? " ← placing" : ""}`, 16, canvas.height - 16 - i * 16);
    });
    ctx.fillStyle = "#4a7a10";
    ctx.fillText(`STAGE [${currentStageForPlacement}]  [/] prev  []] next  [R] rotate`, canvas.width / 2 - 160, canvas.height - 12);
  }

  return { init, clearRocket, getRocket, setRocket, updateStats };
})();

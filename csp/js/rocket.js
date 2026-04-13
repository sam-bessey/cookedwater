const RocketParts = {
    commandModule: {
        id: 'commandModule',
        name: 'Command Module',
        category: 'capsule',
        mass: 1500,
        dryMass: 1500,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: true },
        crossSection: 4,
        dragCoefficient: 0.3,
        heatShield: 0,
        description: 'Essential capsule for control',
        icon: '▲',
        maxPerRocket: 1
    },
    
    smallTank: {
        id: 'smallTank',
        name: 'Small Fuel Tank',
        category: 'fuel',
        mass: 500,
        dryMass: 100,
        fuel: 400,
        thrust: 0,
        isp: 320,
        maxFuel: 400,
        attachmentPoints: { top: true, bottom: true },
        crossSection: 2,
        dragCoefficient: 0.2,
        heatShield: 0,
        description: '400kg liquid fuel',
        icon: '▮',
        maxPerStage: 4
    },
    
    largeTank: {
        id: 'largeTank',
        name: 'Large Fuel Tank',
        category: 'fuel',
        mass: 2500,
        dryMass: 500,
        fuel: 2000,
        thrust: 0,
        isp: 320,
        maxFuel: 2000,
        attachmentPoints: { top: true, bottom: true },
        crossSection: 4,
        dragCoefficient: 0.2,
        heatShield: 0,
        description: '2000kg liquid fuel',
        icon: '█',
        maxPerStage: 3
    },
    
    smallEngine: {
        id: 'smallEngine',
        name: 'Swivel Engine',
        category: 'engine',
        mass: 1000,
        dryMass: 1000,
        fuel: 0,
        thrust: 450000,
        isp: 320,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: false },
        crossSection: 1,
        dragCoefficient: 0.1,
        heatShield: 0,
        description: '450kN thrust, gimbaled',
        icon: '▼',
        maxPerStage: 2
    },
    
    largeEngine: {
        id: 'largeEngine',
        name: 'Mainsail Engine',
        category: 'engine',
        mass: 3500,
        dryMass: 3500,
        fuel: 0,
        thrust: 1500000,
        isp: 350,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: false },
        crossSection: 3,
        dragCoefficient: 0.1,
        heatShield: 0,
        description: '1500kN thrust',
        icon: '▼▼',
        maxPerStage: 2
    },
    
    ionEngine: {
        id: 'ionEngine',
        name: 'Ion Engine',
        category: 'engine',
        mass: 250,
        dryMass: 250,
        fuel: 0,
        thrust: 2000,
        isp: 2500,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: false },
        crossSection: 1,
        dragCoefficient: 0.05,
        heatShield: 0,
        description: '2kN, 2500s Isp',
        icon: '⁺',
        maxPerStage: 3
    },
    
    decoupler: {
        id: 'decoupler',
        name: 'Decoupler',
        category: 'utility',
        mass: 100,
        dryMass: 100,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: true },
        crossSection: 2,
        dragCoefficient: 0.1,
        heatShield: 0,
        description: 'Stage separator',
        icon: '◇',
        maxPerStage: 3
    },
    
    rcsThrusters: {
        id: 'rcsThrusters',
        name: 'RCS Thrusters',
        category: 'utility',
        mass: 150,
        dryMass: 150,
        fuel: 200,
        thrust: 20000,
        isp: 100,
        maxFuel: 200,
        attachmentPoints: { top: false, bottom: true },
        crossSection: 0,
        dragCoefficient: 0,
        heatShield: 0,
        description: '20kN control jets',
        icon: '◈',
        maxPerStage: 4
    },
    
    parachute: {
        id: 'parachute',
        name: 'Parachute',
        category: 'utility',
        mass: 100,
        dryMass: 100,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: false },
        crossSection: 0,
        dragCoefficient: 0,
        heatShield: 0,
        dragForce: 50000,
        description: 'Deceleration device',
        icon: '◯',
        maxPerStage: 2
    },
    
    heatShield: {
        id: 'heatShield',
        name: 'Heat Shield',
        category: 'thermal',
        mass: 400,
        dryMass: 400,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: false, bottom: true },
        crossSection: 4,
        dragCoefficient: 0.8,
        heatShield: 8000,
        description: 'Reentry protection',
        icon: '◐',
        maxPerStage: 1
    },
    
    landerLeg: {
        id: 'landerLeg',
        name: 'Landing Leg',
        category: 'landing',
        mass: 150,
        dryMass: 150,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: false },
        crossSection: 0,
        dragCoefficient: 0,
        heatShield: 0,
        description: 'Enables safe landing',
        icon: '⊥',
        maxPerStage: 4
    },
    
    solarPanels: {
        id: 'solarPanels',
        name: 'Solar Panels',
        category: 'utility',
        mass: 50,
        dryMass: 50,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: true },
        crossSection: 2,
        dragCoefficient: 0.3,
        heatShield: 0,
        energyGeneration: 50,
        description: 'Solar power',
        icon: '☐',
        maxPerStage: 4
    },
    
    battery: {
        id: 'battery',
        name: 'Battery',
        category: 'utility',
        mass: 100,
        dryMass: 100,
        fuel: 0,
        thrust: 0,
        isp: 0,
        maxFuel: 0,
        attachmentPoints: { top: true, bottom: true },
        crossSection: 0,
        dragCoefficient: 0,
        heatShield: 0,
        capacity: 500,
        description: 'Energy storage',
        icon: '⚡',
        maxPerStage: 4
    }
};

const Rocket = {
    parts: [],
    stages: [],
    currentStage: 0,
    totalMass: 0,
    totalFuel: 0,
    totalDeltaV: 0,
    totalThrust: 0,
    
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    altitude: 0,
    velocity: 0,
    throttle: 0,
    rcsEnabled: false,
    
    fuel: 0,
    maxFuel: 0,
    currentThrust: 0,
    
    landed: false,
    landedOn: null,
    crashed: false,
    
    heat: 0,
    maxHeat: 5000,
    heatDamage: false,
    
    gearDeployed: true,
    
    electricCharge: 100,
    maxElectricCharge: 100,
    monoPropellant: 0,
    maxMonoPropellant: 0,
    
    centerOfMass: { x: 0, y: 0 },
    
    fuelNetwork: {
        tanks: [],
        engines: []
    },
    
    init() {
        this.reset();
    },
    
    reset() {
        this.parts = [];
        this.stages = [{
            parts: [],
            hasEngine: false,
            hasDecoupler: false,
            hasParachute: false,
            hasLandingGear: false,
            totalMass: 0,
            totalFuel: 0,
            totalThrust: 0,
            fuelRemaining: 0
        }];
        this.currentStage = 0;
        this.recalculate();
    },
    
    addPart(partId, stageIndex = null) {
        const partDef = RocketParts[partId];
        if (!partDef) return false;
        
        if (partDef.id === 'commandModule' && this.hasPart('commandModule')) {
            return false;
        }
        
        const stageIdx = stageIndex !== null ? stageIndex : this.stages.length - 1;
        
        if (partDef.maxPerStage) {
            const countInStage = this.stages[stageIdx].parts.filter(p => p.id === partId).length;
            if (countInStage >= partDef.maxPerStage) return false;
        }
        
        this.stages[stageIdx].parts.push({
            ...partDef,
            uid: Date.now() + Math.random()
        });
        
        this.recalculate();
        return true;
    },
    
    removePart(uid, stageIndex = null) {
        const stageIdx = stageIndex !== null ? stageIndex : this.stages.length - 1;
        const stage = this.stages[stageIdx];
        
        const index = stage.parts.findIndex(p => p.uid === uid);
        if (index !== -1) {
            stage.parts.splice(index, 1);
            this.recalculate();
            return true;
        }
        return false;
    },
    
    addDecouplerAsNewStage() {
        this.stages.push({
            parts: [],
            hasEngine: false,
            hasDecoupler: false,
            hasParachute: false,
            hasLandingGear: false,
            totalMass: 0,
            totalFuel: 0,
            totalThrust: 0,
            fuelRemaining: 0
        });
    },
    
    hasPart(partId) {
        for (const stage of this.stages) {
            if (stage.parts.some(p => p.id === partId)) return true;
        }
        return false;
    },
    
    recalculate() {
        this.totalMass = 0;
        this.totalFuel = 0;
        this.totalDeltaV = 0;
        this.totalThrust = 0;
        
        this.fuelNetwork.tanks = [];
        this.fuelNetwork.engines = [];
        
        let comX = 0, comY = 0;
        
        for (const stage of this.stages) {
            stage.totalMass = 0;
            stage.totalFuel = 0;
            stage.totalThrust = 0;
            stage.hasEngine = false;
            stage.hasDecoupler = stage.parts.some(p => p.id === 'decoupler');
            stage.hasParachute = stage.parts.some(p => p.id === 'parachute');
            stage.hasLandingGear = stage.parts.some(p => p.id === 'landerLeg');
            stage.hasHeatShield = stage.parts.some(p => p.id === 'heatShield');
            
            for (const part of stage.parts) {
                stage.totalMass += part.mass;
                stage.totalFuel += part.fuel || 0;
                
                if (part.thrust > 0) {
                    stage.totalThrust += part.thrust;
                    stage.hasEngine = true;
                    this.fuelNetwork.engines.push(part);
                }
                
                if (part.category === 'fuel') {
                    this.fuelNetwork.tanks.push(part);
                }
                
                comX += part.relativeX || 0;
                comY += part.relativeY || 0;
            }
            
            this.totalMass += stage.totalMass;
            this.totalFuel += stage.totalFuel;
            this.totalThrust += stage.totalThrust;
        }
        
        this.maxFuel = this.totalFuel;
        this.fuel = this.totalFuel;
        
        this.maxMonoPropellant = this.stages.reduce((sum, s) => {
            return sum + s.parts.filter(p => p.id === 'rcsThrusters').reduce((t, p) => t + (p.fuel || 0), 0);
        }, 0);
        this.monoPropellant = this.maxMonoPropellant;
        
        const g0 = 9.81;
        let dryMass = this.totalMass;
        
        for (let i = 0; i < this.stages.length; i++) {
            const stage = this.stages[i];
            if (stage.totalFuel > 0) {
                const fuelMass = stage.totalFuel;
                const stageDryMass = stage.totalMass - fuelMass;
                let accMass = dryMass;
                
                for (let j = i + 1; j < this.stages.length; j++) {
                    accMass -= this.stages[j].totalMass;
                }
                
                if (accMass > 0) {
                    const isp = stage.parts.find(p => p.isp)?.isp || 320;
                    stage.deltaV = isp * g0 * Math.log((fuelMass + accMass) / accMass);
                    this.totalDeltaV += stage.deltaV;
                }
            } else {
                stage.deltaV = 0;
            }
        }
    },
    
    launch(startX, startY, parentBody) {
        this.x = startX;
        this.y = startY + parentBody.radius + 100;
        this.vx = parentBody.vx;
        this.vy = parentBody.vy - Physics.calculateOrbitalVelocity(parentBody, 100);
        this.angle = -Math.PI / 2;
        this.throttle = 0;
        this.currentStage = this.stages.length - 1;
        this.fuel = this.maxFuel;
        this.landed = false;
        this.landedOn = null;
        this.crashed = false;
        this.heat = 0;
        this.heatDamage = false;
        
        for (const stage of this.stages) {
            stage.fuelRemaining = stage.totalFuel;
        }
        
        this.electricCharge = this.maxElectricCharge;
        this.monoPropellant = this.maxMonoPropellant;
    },
    
    stage() {
        if (this.currentStage > 0) {
            this.currentStage--;
            const stage = this.stages[this.currentStage];
            stage.fuelRemaining = stage.totalFuel;
            
            const separationForce = 5000;
            this.vx += Math.cos(this.angle) * separationForce / this.totalMass * 0.1;
            this.vy += Math.sin(this.angle) * separationForce / this.totalMass * 0.1;
            
            return true;
        }
        return false;
    },
    
    update(dt, bodies) {
        if (this.crashed) return;
        
        if (this.landed) {
            this.vx = 0;
            this.vy = 0;
            return;
        }
        
        const nearest = Planets.getNearestBody(this.x, this.y);
        const parent = nearest.body;
        
        if (!parent) return;
        
        const dx = this.x - parent.x;
        const dy = this.y - parent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.altitude = dist - parent.radius;
        
        const stage = this.stages[this.currentStage];
        
        const accel = Physics.getGravitationalAcceleration(this.x, this.y, bodies);
        
        let dragX = 0, dragY = 0;
        let heatBuildup = 0;
        
        if (parent.atmosphere && this.altitude < parent.atmosphere.height) {
            const density = Physics.getAtmosphericDensity(this.altitude, parent);
            const speed = this.velocity;
            
            if (speed > 0 && density > 0) {
                const dragArea = this.stages.reduce((sum, s) => {
                    return sum + s.parts.reduce((pSum, p) => pSum + (p.crossSection || 0), 0);
                }, 0);
                
                const dragCoef = this.stages.reduce((sum, s) => {
                    return sum + s.parts.reduce((pSum, p) => pSum + (p.dragCoefficient || 0.3), 0);
                }, 0) / Math.max(1, this.totalMass);
                
                const dragForce = Physics.calculateDrag(speed, density, dragArea, dragCoef);
                
                dragX = -dragForce * (this.vx / speed) / this.totalMass * dt;
                dragY = -dragForce * (this.vy / speed) / this.totalMass * dt;
                
                heatBuildup = Physics.calculateHeat(speed, density) * dt;
            }
        }
        
        if (heatBuildup > 0) {
            const heatShield = stage.parts.find(p => p.heatShield > 0);
            if (heatShield) {
                this.heat -= heatShield.heatShield * 0.001 * dt;
            }
            
            this.heat += heatBuildup;
            
            if (this.heat < 0) this.heat = 0;
            if (this.heat > this.maxHeat) {
                this.heatDamage = true;
                this.crashed = true;
                return;
            }
        }
        
        if (this.throttle > 0 && stage.hasEngine && stage.fuelRemaining > 0) {
            const isp = stage.parts.find(p => p.isp)?.isp || 320;
            const fuelFlow = stage.totalThrust / (isp * 9.81);
            const availableFuel = Math.min(fuelFlow * dt * this.throttle, stage.fuelRemaining);
            
            stage.fuelRemaining -= availableFuel;
            this.fuel -= availableFuel;
            
            this.currentThrust = stage.totalThrust * this.throttle;
            
            const thrustX = Math.cos(this.angle) * this.currentThrust;
            const thrustY = Math.sin(this.angle) * this.currentThrust;
            
            this.vx += (thrustX / this.totalMass + accel.x + dragX) * dt;
            this.vy += (thrustY / this.totalMass + accel.y + dragY) * dt;
        } else {
            this.currentThrust = 0;
            this.vx += (accel.x + dragX) * dt;
            this.vy += (accel.y + dragY) * dt;
        }
        
        if (this.rcsEnabled && this.monoPropellant > 0) {
            const rcsThrust = 20000;
            if (Input.keys['a'] || Input.keys['ArrowLeft']) {
                this.vx -= Math.cos(this.angle - Math.PI/2) * rcsThrust / this.totalMass * dt;
                this.vy -= Math.sin(this.angle - Math.PI/2) * rcsThrust / this.totalMass * dt;
                this.monoPropellant -= 0.1 * dt;
            }
            if (Input.keys['d'] || Input.keys['ArrowRight']) {
                this.vx += Math.cos(this.angle - Math.PI/2) * rcsThrust / this.totalMass * dt;
                this.vy += Math.sin(this.angle - Math.PI/2) * rcsThrust / this.totalMass * dt;
                this.monoPropellant -= 0.1 * dt;
            }
        }
        
        if (this.monoPropellant < 0) this.monoPropellant = 0;
        
        if (Input.keys['q']) {
            this.angle -= 1.5 * dt;
        }
        if (Input.keys['e']) {
            this.angle += 1.5 * dt;
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        this.velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (stage.hasParachute && this.altitude < 1000 && this.altitude > 0 && this.velocity > 50) {
            const parachuteDrag = 50000;
            const speed = this.velocity;
            if (speed > 0) {
                this.vx -= (parachuteDrag / this.totalMass) * (this.vx / speed) * dt;
                this.vy -= (parachuteDrag / this.totalMass) * (this.vy / speed) * dt;
            }
        }
        
        if (this.altitude <= 0) {
            const landingResult = Physics.checkLanding(
                this.velocity,
                this.angle,
                -Math.PI / 2,
                stage.hasLandingGear ? 10 : 3,
                stage.hasLandingGear
            );
            
            if (landingResult.result === 'crashed') {
                this.crashed = true;
            } else if (landingResult.result === 'tipped') {
                this.crashed = true;
            } else {
                this.landed = true;
                this.landedOn = parent;
                this.y = parent.y + dist - parent.radius;
                this.vx = 0;
                this.vy = 0;
            }
        }
    },
    
    getOrbitInfo() {
        const nearest = Planets.getNearestBody(this.x, this.y);
        if (nearest.body) {
            return Physics.getOrbitalElements(
                { x: this.x, y: this.y, vx: this.vx, vy: this.vy },
                nearest.body
            );
        }
        return null;
    },
    
    getStageInfo() {
        const stage = this.stages[this.currentStage];
        if (!stage) return null;
        
        const g0 = 9.81;
        const fuelRemaining = stage.fuelRemaining || 0;
        const massRatio = stage.totalMass > 0 ? stage.totalMass / (stage.totalMass - fuelRemaining / 100) : 1;
        const isp = stage.parts.find(p => p.isp)?.isp || 320;
        const stageDeltaV = fuelRemaining > 0 ? isp * g0 * Math.log(massRatio) : 0;
        
        const twr = this.totalMass > 0 ? stage.totalThrust / (this.totalMass * 9.81) : 0;
        
        return {
            current: this.currentStage,
            total: this.stages.length,
            fuelRemaining: fuelRemaining,
            totalFuel: stage.totalFuel,
            thrust: stage.totalThrust,
            twr: twr,
            deltaV: stageDeltaV,
            hasEngine: stage.hasEngine,
            hasDecoupler: stage.hasDecoupler,
            hasParachute: stage.hasParachute,
            hasLandingGear: stage.hasLandingGear
        };
    },
    
    toJSON() {
        return {
            stages: this.stages.map(s => ({
                parts: s.parts.map(p => ({ id: p.id, uid: p.uid })),
                fuelRemaining: s.fuelRemaining || 0
            })),
            currentStage: this.currentStage
        };
    },
    
    fromJSON(data) {
        this.reset();
        this.stages = [];
        
        for (const stageData of data.stages) {
            const stage = {
                parts: [],
                hasEngine: false,
                hasDecoupler: false,
                hasParachute: false,
                hasLandingGear: false,
                totalMass: 0,
                totalFuel: 0,
                totalThrust: 0,
                fuelRemaining: stageData.fuelRemaining || 0
            };
            
            for (const partData of stageData.parts) {
                const partDef = RocketParts[partData.id];
                if (partDef) {
                    stage.parts.push({ ...partDef, uid: partData.uid });
                }
            }
            
            this.stages.push(stage);
        }
        
        this.currentStage = data.currentStage;
        this.recalculate();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Rocket;
}

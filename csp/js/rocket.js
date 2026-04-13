const RocketParts = {
    commandModule: {
        id: 'commandModule',
        name: 'Command Module',
        category: 'capsule',
        mass: 1.0,
        fuel: 0,
        thrust: 0,
        isp: 0,
        description: 'Essential capsule for control',
        icon: '▲',
        maxPerRocket: 1
    },
    
    smallTank: {
        id: 'smallTank',
        name: 'Small Fuel Tank',
        category: 'fuel',
        mass: 0.5,
        fuel: 100,
        thrust: 0,
        isp: 320,
        description: '100 fuel units',
        icon: '▮',
        maxPerStage: 3
    },
    
    largeTank: {
        id: 'largeTank',
        name: 'Large Fuel Tank',
        category: 'fuel',
        mass: 2.0,
        fuel: 500,
        thrust: 0,
        isp: 320,
        description: '500 fuel units',
        icon: '█',
        maxPerStage: 2
    },
    
    smallEngine: {
        id: 'smallEngine',
        name: 'Small Engine',
        category: 'engine',
        mass: 0.3,
        fuel: 0,
        thrust: 50,
        isp: 320,
        description: '50 thrust units',
        icon: '▼',
        maxPerStage: 2
    },
    
    largeEngine: {
        id: 'largeEngine',
        name: 'Large Engine',
        category: 'engine',
        mass: 1.0,
        fuel: 0,
        thrust: 200,
        isp: 350,
        description: '200 thrust units',
        icon: '▼▼',
        maxPerStage: 2
    },
    
    ionEngine: {
        id: 'ionEngine',
        name: 'Ion Engine',
        category: 'engine',
        mass: 0.2,
        fuel: 0,
        thrust: 5,
        isp: 2000,
        description: '5 thrust, high efficiency',
        icon: '⁺',
        maxPerStage: 3
    },
    
    decoupler: {
        id: 'decoupler',
        name: 'Decoupler',
        category: 'utility',
        mass: 0.1,
        fuel: 0,
        thrust: 0,
        isp: 0,
        description: 'Separates stages',
        icon: '◇',
        maxPerStage: 1
    },
    
    rcsThrusters: {
        id: 'rcsThrusters',
        name: 'RCS Thrusters',
        category: 'utility',
        mass: 0.1,
        fuel: 0,
        thrust: 2,
        isp: 100,
        description: 'Fine rotation control',
        icon: '◈',
        maxPerStage: 2
    },
    
    parachute: {
        id: 'parachute',
        name: 'Parachute',
        category: 'utility',
        mass: 0.2,
        fuel: 0,
        thrust: 0,
        isp: 0,
        description: 'Safe landing descent',
        icon: '◯',
        maxPerStage: 1
    },
    
    solarPanels: {
        id: 'solarPanels',
        name: 'Solar Panels',
        category: 'utility',
        mass: 0.05,
        fuel: 0,
        thrust: 0,
        isp: 0,
        description: 'Provides extra power',
        icon: '☐',
        maxPerStage: 2
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
            totalMass: 0,
            totalFuel: 0,
            totalThrust: 0
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
            totalMass: 0,
            totalFuel: 0,
            totalThrust: 0
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
        
        for (const stage of this.stages) {
            stage.totalMass = 0;
            stage.totalFuel = 0;
            stage.totalThrust = 0;
            stage.hasEngine = false;
            stage.hasDecoupler = stage.parts.some(p => p.id === 'decoupler');
            stage.hasParachute = stage.parts.some(p => p.id === 'parachute');
            
            for (const part of stage.parts) {
                stage.totalMass += part.mass;
                stage.totalFuel += part.fuel;
                if (part.thrust > 0) {
                    stage.totalThrust += part.thrust;
                    stage.hasEngine = true;
                }
            }
            
            stage.totalMass += 0.1;
            
            this.totalMass += stage.totalMass;
            this.totalFuel += stage.totalFuel;
            this.totalThrust += stage.totalThrust;
        }
        
        this.maxFuel = this.totalFuel;
        this.fuel = this.totalFuel;
        
        const g0 = 9.81;
        let dryMass = this.totalMass;
        let fuelMass = this.totalFuel / 100;
        
        for (const stage of this.stages) {
            if (stage.totalFuel > 0) {
                const stageFuelMass = stage.totalFuel / 100;
                const stageDryMass = stage.totalMass - stageFuelMass;
                let accMass = dryMass;
                
                for (let i = this.stages.indexOf(stage) + 1; i < this.stages.length; i++) {
                    accMass -= this.stages[i].totalMass;
                }
                
                const isp = stage.parts.find(p => p.isp)?.isp || 320;
                stage.deltaV = isp * g0 * Math.log((stageFuelMass + accMass) / accMass);
                this.totalDeltaV += stage.deltaV;
            } else {
                stage.deltaV = 0;
            }
        }
    },
    
    launch(startX, startY, parentBody) {
        this.x = startX;
        this.y = startY + parentBody.radius + 50;
        this.vx = parentBody.vx;
        this.vy = parentBody.vy - Physics.calculateOrbitalVelocity(parentBody, 50);
        this.angle = -Math.PI / 2;
        this.throttle = 0;
        this.currentStage = this.stages.length - 1;
        this.fuel = this.maxFuel;
        this.landed = false;
        this.landedOn = null;
        this.crashed = false;
        
        const stage = this.stages[this.currentStage];
        stage.fuelRemaining = stage.totalFuel;
    },
    
    stage() {
        if (this.currentStage > 0) {
            this.currentStage--;
            const stage = this.stages[this.currentStage];
            stage.fuelRemaining = stage.totalFuel;
            
            const separationDv = 5;
            this.vx += Math.cos(this.angle) * separationDv * 0.1;
            this.vy += Math.sin(this.angle) * separationDv * 0.1;
            
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
        
        if (this.throttle > 0 && stage.hasEngine && stage.fuelRemaining > 0) {
            const fuelConsumption = stage.totalThrust / 1000;
            const availableFuel = Math.min(fuelConsumption * dt * this.throttle, stage.fuelRemaining);
            stage.fuelRemaining -= availableFuel;
            this.fuel -= availableFuel;
            
            this.currentThrust = stage.totalThrust * this.throttle;
            
            const thrustX = Math.cos(this.angle) * this.currentThrust;
            const thrustY = Math.sin(this.angle) * this.currentThrust;
            
            const accel = Physics.getGravitationalAcceleration(this.x, this.y, Planets.getAllBodies());
            
            this.vx += (thrustX / this.totalMass + accel.x) * dt;
            this.vy += (thrustY / this.totalMass + accel.y) * dt;
        } else {
            this.currentThrust = 0;
            const accel = Physics.getGravitationalAcceleration(this.x, this.y, Planets.getAllBodies());
            this.vx += accel.x * dt;
            this.vy += accel.y * dt;
        }
        
        if (this.rcsEnabled) {
            const rcsThrust = 2 * 0.1;
            if (Input.keys['a'] || Input.keys['ArrowLeft']) {
                this.vx -= Math.cos(this.angle - Math.PI/2) * rcsThrust * dt;
                this.vy -= Math.sin(this.angle - Math.PI/2) * rcsThrust * dt;
            }
            if (Input.keys['d'] || Input.keys['ArrowRight']) {
                this.vx += Math.cos(this.angle - Math.PI/2) * rcsThrust * dt;
                this.vy += Math.sin(this.angle - Math.PI/2) * rcsThrust * dt;
            }
        }
        
        if (Input.keys['q']) {
            this.angle -= 2 * dt;
        }
        if (Input.keys['e']) {
            this.angle += 2 * dt;
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        this.velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (this.altitude <= 0) {
            if (this.velocity < 50 || stage.hasParachute) {
                this.landed = true;
                this.landedOn = parent;
                this.y = parent.y + dist - parent.radius - 10;
                this.vx = 0;
                this.vy = 0;
            } else {
                this.crashed = true;
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
        const massRatio = stage.totalMass / (stage.totalMass - stage.fuelRemaining / 100);
        const isp = stage.parts.find(p => p.isp)?.isp || 320;
        const stageDeltaV = isp * g0 * Math.log(massRatio);
        
        const twr = stage.totalThrust / (this.totalMass * 9.81);
        
        return {
            current: this.currentStage,
            total: this.stages.length,
            fuelRemaining: stage.fuelRemaining,
            totalFuel: stage.totalFuel,
            thrust: stage.totalThrust,
            twr: twr,
            deltaV: stageDeltaV,
            hasEngine: stage.hasEngine,
            hasDecoupler: stage.hasDecoupler,
            hasParachute: stage.hasParachute
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

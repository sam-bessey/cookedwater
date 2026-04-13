const Planets = {
    bodies: [],
    scale: 1,
    timeScale: 1,
    terrains: {},
    
    atmosphereData: {
        sun: {
            height: 0,
            scaleHeight: 0,
            density: 0,
            hasRealAtmosphere: false
        },
        mercury: {
            height: 0,
            scaleHeight: 0,
            density: 0,
            hasRealAtmosphere: false
        },
        venus: {
            height: 250000,
            scaleHeight: 15900,
            density: 65,
            hasRealAtmosphere: true
        },
        earth: {
            height: 100000,
            scaleHeight: 8500,
            density: 1.225,
            hasRealAtmosphere: true
        },
        moon: {
            height: 0,
            scaleHeight: 0,
            density: 0,
            hasRealAtmosphere: false
        },
        mars: {
            height: 80000,
            scaleHeight: 11000,
            density: 0.020,
            hasRealAtmosphere: true
        },
        jupiter: {
            height: 100000,
            scaleHeight: 27000,
            density: 0.16,
            hasRealAtmosphere: true
        },
        saturn: {
            height: 60000,
            scaleHeight: 29500,
            density: 0.19,
            hasRealAtmosphere: true
        },
        uranus: {
            height: 50000,
            scaleHeight: 22000,
            density: 0.42,
            hasRealAtmosphere: true
        },
        neptune: {
            height: 50000,
            scaleHeight: 20500,
            density: 0.71,
            hasRealAtmosphere: true
        },
        pluto: {
            height: 0,
            scaleHeight: 0,
            density: 0,
            hasRealAtmosphere: false
        }
    },
    
    colors: {
        sun: '#ffff00',
        mercury: '#888888',
        venus: '#ffaa44',
        earth: '#4488ff',
        moon: '#aaaaaa',
        mars: '#ff4422',
        jupiter: '#ffaa66',
        saturn: '#ffdd88',
        uranus: '#44ffff',
        neptune: '#4444ff',
        pluto: '#cccccc'
    },
    
    init() {
        this.createSolarSystem();
    },
    
    createSolarSystem() {
        this.bodies = [
            {
                id: 'sun',
                name: 'Sun',
                mass: 1.989e30,
                radius: 69634000000,
                color: '#ffff00',
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                atmosphere: null,
                surfaceGravity: 274,
                isStationary: true,
                orbitRadius: 0,
                hasTerrain: false,
                rotationPeriod: 25 * 86400
            },
            {
                id: 'mercury',
                name: 'Mercury',
                mass: 3.285e23,
                radius: 2439700000,
                color: '#888888',
                x: 57900000000,
                y: 0,
                vx: 0,
                vy: 47400,
                parent: 'sun',
                orbitRadius: 57900000000,
                orbitSpeed: 0.0008,
                orbitAngle: 0,
                eccentricity: 0.205,
                atmosphere: null,
                surfaceGravity: 3.7,
                hasTerrain: true,
                rotationPeriod: 58.6 * 86400
            },
            {
                id: 'venus',
                name: 'Venus',
                mass: 4.867e24,
                radius: 6051800000,
                color: '#ffaa44',
                x: 108200000000,
                y: 0,
                vx: 0,
                vy: 35000,
                parent: 'sun',
                orbitRadius: 108200000000,
                orbitSpeed: 0.0006,
                orbitAngle: Math.PI * 0.4,
                eccentricity: 0.007,
                atmosphere: this.atmosphereData.venus,
                surfaceGravity: 8.87,
                hasTerrain: true,
                rotationPeriod: -243 * 86400
            },
            {
                id: 'earth',
                name: 'Earth',
                mass: 5.972e24,
                radius: 6371000000,
                color: '#4488ff',
                x: 149600000000,
                y: 0,
                vx: 0,
                vy: 29800,
                parent: 'sun',
                orbitRadius: 149600000000,
                orbitSpeed: 0.0005,
                orbitAngle: Math.PI * 0.7,
                eccentricity: 0.017,
                atmosphere: this.atmosphereData.earth,
                surfaceGravity: 9.81,
                hasTerrain: true,
                rotationPeriod: 86164,
                moons: [{
                    id: 'moon',
                    name: 'Moon',
                    mass: 7.342e22,
                    radius: 1737000000,
                    color: '#aaaaaa',
                    x: 149600000000 + 38440000000,
                    y: 0,
                    vx: 0,
                    vy: 29800 + 1022,
                    parent: 'earth',
                    orbitRadius: 38440000000,
                    orbitSpeed: 0.002,
                    orbitAngle: 0,
                    eccentricity: 0.055,
                    atmosphere: null,
                    surfaceGravity: 1.62,
                    hasTerrain: true,
                    rotationPeriod: 27.3 * 86400
                }]
            },
            {
                id: 'mars',
                name: 'Mars',
                mass: 6.39e23,
                radius: 3389000000,
                color: '#ff4422',
                x: 227900000000,
                y: 0,
                vx: 0,
                vy: 24100,
                parent: 'sun',
                orbitRadius: 227900000000,
                orbitSpeed: 0.0004,
                orbitAngle: Math.PI * 1.2,
                eccentricity: 0.093,
                atmosphere: this.atmosphereData.mars,
                surfaceGravity: 3.71,
                hasTerrain: true,
                rotationPeriod: 88775
            },
            {
                id: 'jupiter',
                name: 'Jupiter',
                mass: 1.898e27,
                radius: 69911000000,
                color: '#ffaa66',
                x: 778600000000,
                y: 0,
                vx: 0,
                vy: 13100,
                parent: 'sun',
                orbitRadius: 778600000000,
                orbitSpeed: 0.0002,
                orbitAngle: Math.PI * 0.3,
                eccentricity: 0.049,
                atmosphere: this.atmosphereData.jupiter,
                surfaceGravity: 24.79,
                hasTerrain: false,
                rotationPeriod: 35543
            },
            {
                id: 'saturn',
                name: 'Saturn',
                mass: 5.683e26,
                radius: 58232000000,
                color: '#ffdd88',
                x: 1434000000000,
                y: 0,
                vx: 0,
                vy: 9690,
                parent: 'sun',
                orbitRadius: 1434000000000,
                orbitSpeed: 0.00015,
                orbitAngle: Math.PI * 1.5,
                eccentricity: 0.056,
                atmosphere: this.atmosphereData.saturn,
                surfaceGravity: 10.44,
                hasTerrain: false,
                rotationPeriod: 38361,
                hasRings: true,
                ringInner: 74500000000,
                ringOuter: 140220000000
            },
            {
                id: 'uranus',
                name: 'Uranus',
                mass: 8.681e25,
                radius: 25362000000,
                color: '#44ffff',
                x: 2871000000000,
                y: 0,
                vx: 0,
                vy: 6810,
                parent: 'sun',
                orbitRadius: 2871000000000,
                orbitSpeed: 0.0001,
                orbitAngle: Math.PI * 0.9,
                eccentricity: 0.046,
                atmosphere: this.atmosphereData.uranus,
                surfaceGravity: 8.87,
                hasTerrain: false,
                rotationPeriod: -30687
            },
            {
                id: 'neptune',
                name: 'Neptune',
                mass: 1.024e26,
                radius: 24622000000,
                color: '#4444ff',
                x: 4495000000000,
                y: 0,
                vx: 0,
                vy: 5430,
                parent: 'sun',
                orbitRadius: 4495000000000,
                orbitSpeed: 0.00008,
                orbitAngle: Math.PI * 0.1,
                eccentricity: 0.010,
                atmosphere: this.atmosphereData.neptune,
                surfaceGravity: 11.15,
                hasTerrain: false,
                rotationPeriod: 57327
            },
            {
                id: 'pluto',
                name: 'Pluto',
                mass: 1.303e22,
                radius: 1188000000,
                color: '#cccccc',
                x: 5906000000000,
                y: 0,
                vx: 0,
                vy: 4670,
                parent: 'sun',
                orbitRadius: 5906000000000,
                orbitSpeed: 0.00006,
                orbitAngle: Math.PI * 1.8,
                eccentricity: 0.248,
                atmosphere: null,
                surfaceGravity: 0.62,
                hasTerrain: true,
                rotationPeriod: -6.4 * 86400
            }
        ];
        
        this.calculateOrbitalVelocities();
    },
    
    calculateOrbitalVelocities() {
        for (const body of this.bodies) {
            if (body.orbitRadius && body.parent === 'sun') {
                const orbitalSpeed = Math.sqrt(Physics.G * 1.989e30 / body.orbitRadius);
                body.vx = 0;
                body.vy = body.vy || orbitalSpeed;
            }
        }
    },
    
    update(dt) {
        const scaledDt = dt * this.timeScale;
        
        for (const body of this.bodies) {
            if (!body.isStationary && body.orbitRadius && body.parent === 'sun') {
                const angle = Math.atan2(body.y, body.x);
                const orbitalSpeed = body.vy || Math.sqrt(Physics.G * 1.989e30 / body.orbitRadius);
                
                body.orbitAngle = Math.atan2(body.y, body.x);
                body.orbitAngle += (orbitalSpeed / body.orbitRadius) * scaledDt;
                
                body.x = Math.cos(body.orbitAngle) * body.orbitRadius;
                body.y = Math.sin(body.orbitAngle) * body.orbitRadius;
                
                body.vx = -Math.sin(body.orbitAngle) * orbitalSpeed;
                body.vy = Math.cos(body.orbitAngle) * orbitalSpeed;
            }
        }
        
        for (const body of this.bodies) {
            if (body.moons) {
                const parent = this.getBody(body.id);
                if (parent) {
                    for (const moon of body.moons) {
                        moon.orbitAngle = Math.atan2(moon.x - parent.x, moon.y - parent.y);
                        moon.orbitAngle += (moon.orbitSpeed || 0.002) * scaledDt;
                        
                        const orbitalSpeed = 1022;
                        moon.x = parent.x + Math.cos(moon.orbitAngle) * moon.orbitRadius;
                        moon.y = parent.y + Math.sin(moon.orbitAngle) * moon.orbitRadius;
                        
                        moon.vx = parent.vx - Math.sin(moon.orbitAngle) * orbitalSpeed;
                        moon.vy = parent.vy + Math.cos(moon.orbitAngle) * orbitalSpeed;
                    }
                }
            }
        }
    },
    
    getBody(id) {
        for (const body of this.bodies) {
            if (body.id === id) return body;
            if (body.moons) {
                for (const moon of body.moons) {
                    if (moon.id === id) return moon;
                }
            }
        }
        return null;
    },
    
    getAllBodies() {
        const all = [...this.bodies];
        for (const body of this.bodies) {
            if (body.moons) {
                all.push(...body.moons);
            }
        }
        return all;
    },
    
    getNearestBody(x, y) {
        let nearest = null;
        let minDist = Infinity;
        
        for (const body of this.getAllBodies()) {
            const dx = body.x - x;
            const dy = body.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < minDist) {
                minDist = dist;
                nearest = body;
            }
        }
        
        return { body: nearest, distance: minDist };
    },
    
    getBodyAtPosition(x, y) {
        for (const body of this.getAllBodies()) {
            const dx = body.x - x;
            const dy = body.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < body.radius) {
                return body;
            }
        }
        return null;
    },
    
    getAtmosphereInfo(body) {
        if (!body || !body.atmosphere) return null;
        
        return {
            height: body.atmosphere.height || 0,
            density: body.atmosphere.density || 0,
            scaleHeight: body.atmosphere.scaleHeight || 8500
        };
    },
    
    isInAtmosphere(x, y, body) {
        if (!body || !body.atmosphere) return false;
        
        const dx = x - body.x;
        const dy = y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        return dist < body.radius + body.atmosphere.height;
    },
    
    getGravityAt(x, y) {
        return Physics.getGravitationalAcceleration(x, y, this.getAllBodies());
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Planets;
}

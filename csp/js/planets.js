const Planets = {
    bodies: [],
    scale: 1,
    timeScale: 1,
    
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
                mass: 1000,
                radius: 70,
                color: '#ffff00',
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                atmosphere: { color: 'rgba(255, 200, 50, 0.3)', height: 50 },
                surfaceGravity: 274,
                isStationary: true
            },
            {
                id: 'mercury',
                name: 'Mercury',
                mass: 1.2,
                radius: 5,
                color: '#888888',
                x: 200,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 200,
                orbitSpeed: 0.0008,
                orbitAngle: 0,
                atmosphere: null,
                surfaceGravity: 3.7,
                hasMoons: false
            },
            {
                id: 'venus',
                name: 'Venus',
                mass: 8.0,
                radius: 9,
                color: '#ffaa44',
                x: 320,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 320,
                orbitSpeed: 0.0006,
                orbitAngle: Math.PI * 0.4,
                atmosphere: { color: 'rgba(255, 150, 50, 0.5)', height: 30 },
                surfaceGravity: 8.87,
                hasMoons: false
            },
            {
                id: 'earth',
                name: 'Earth',
                mass: 10,
                radius: 10,
                color: '#4488ff',
                x: 480,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 480,
                orbitSpeed: 0.0005,
                orbitAngle: Math.PI * 0.7,
                atmosphere: { color: 'rgba(100, 150, 255, 0.4)', height: 20 },
                surfaceGravity: 9.81,
                hasMoons: true,
                moons: [{
                    id: 'moon',
                    name: 'Moon',
                    mass: 0.3,
                    radius: 4,
                    color: '#aaaaaa',
                    x: 480 + 35,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    parent: null,
                    orbitRadius: 35,
                    orbitSpeed: 0.01,
                    orbitAngle: 0,
                    atmosphere: null,
                    surfaceGravity: 1.62,
                    parentBody: 'earth'
                }]
            },
            {
                id: 'mars',
                name: 'Mars',
                mass: 3.5,
                radius: 7,
                color: '#ff4422',
                x: 680,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 680,
                orbitSpeed: 0.0004,
                orbitAngle: Math.PI * 1.2,
                atmosphere: { color: 'rgba(255, 100, 50, 0.3)', height: 15 },
                surfaceGravity: 3.71,
                hasMoons: false
            },
            {
                id: 'jupiter',
                name: 'Jupiter',
                mass: 250,
                radius: 35,
                color: '#ffaa66',
                x: 1100,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 1100,
                orbitSpeed: 0.0002,
                orbitAngle: Math.PI * 0.3,
                atmosphere: { color: 'rgba(255, 200, 100, 0.4)', height: 40 },
                surfaceGravity: 24.79,
                hasMoons: false
            },
            {
                id: 'saturn',
                name: 'Saturn',
                mass: 100,
                radius: 28,
                color: '#ffdd88',
                x: 1500,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 1500,
                orbitSpeed: 0.00015,
                orbitAngle: Math.PI * 1.5,
                atmosphere: { color: 'rgba(255, 240, 150, 0.4)', height: 35 },
                surfaceGravity: 10.44,
                hasMoons: false,
                hasRings: true,
                ringColor: 'rgba(200, 180, 100, 0.5)'
            },
            {
                id: 'uranus',
                name: 'Uranus',
                mass: 40,
                radius: 15,
                color: '#44ffff',
                x: 2000,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 2000,
                orbitSpeed: 0.0001,
                orbitAngle: Math.PI * 0.9,
                atmosphere: { color: 'rgba(100, 255, 255, 0.3)', height: 20 },
                surfaceGravity: 8.87,
                hasMoons: false
            },
            {
                id: 'neptune',
                name: 'Neptune',
                mass: 45,
                radius: 14,
                color: '#4444ff',
                x: 2500,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 2500,
                orbitSpeed: 0.00008,
                orbitAngle: Math.PI * 0.1,
                atmosphere: { color: 'rgba(50, 50, 255, 0.4)', height: 20 },
                surfaceGravity: 11.15,
                hasMoons: false
            },
            {
                id: 'pluto',
                name: 'Pluto',
                mass: 0.1,
                radius: 3,
                color: '#cccccc',
                x: 3000,
                y: 0,
                vx: 0,
                vy: 0,
                parent: null,
                orbitRadius: 3000,
                orbitSpeed: 0.00006,
                orbitAngle: Math.PI * 1.8,
                atmosphere: null,
                surfaceGravity: 0.62,
                hasMoons: false
            }
        ];
        
        this.setupOrbits();
    },
    
    setupOrbits() {
        for (const body of this.bodies) {
            if (body.orbitRadius) {
                const angle = body.orbitAngle;
                body.x = Math.cos(angle) * body.orbitRadius;
                body.y = Math.sin(angle) * body.orbitRadius;
                
                const orbitalSpeed = body.orbitSpeed * 100;
                body.vx = -Math.sin(angle) * orbitalSpeed;
                body.vy = Math.cos(angle) * orbitalSpeed;
            }
        }
        
        for (const body of this.bodies) {
            if (body.moons) {
                for (const moon of body.moons) {
                    const parent = this.getBody(body.parentBody);
                    if (parent) {
                        const angle = moon.orbitAngle;
                        moon.x = parent.x + Math.cos(angle) * moon.orbitRadius;
                        moon.y = parent.y + Math.sin(angle) * moon.orbitRadius;
                        
                        const orbitalSpeed = moon.orbitSpeed * 50;
                        moon.vx = parent.vx - Math.sin(angle) * orbitalSpeed;
                        moon.vy = parent.vy + Math.cos(angle) * orbitalSpeed;
                    }
                }
            }
        }
    },
    
    update(dt) {
        const scaledDt = dt * this.timeScale;
        
        for (const body of this.bodies) {
            if (!body.isStationary && body.orbitRadius) {
                body.orbitAngle += body.orbitSpeed * scaledDt;
                body.x = Math.cos(body.orbitAngle) * body.orbitRadius;
                body.y = Math.sin(body.orbitAngle) * body.orbitRadius;
            }
        }
        
        for (const body of this.bodies) {
            if (body.moons) {
                const parent = this.getBody(body.parentBody);
                if (parent) {
                    for (const moon of body.moons) {
                        moon.orbitAngle += moon.orbitSpeed * scaledDt;
                        moon.x = parent.x + Math.cos(moon.orbitAngle) * moon.orbitRadius;
                        moon.y = parent.y + Math.sin(moon.orbitAngle) * moon.orbitRadius;
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
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Planets;
}

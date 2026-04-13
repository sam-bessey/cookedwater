const Physics = {
    G: 6.674e-3,
    
    updateOrbit(body, dt) {
        if (body.parent) {
            const dx = body.x - body.parent.x;
            const dy = body.y - body.parent.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            const force = (this.G * body.parent.mass) / distSq;
            
            body.vx -= (force * dx / dist) * dt;
            body.vy -= (force * dy / dist) * dt;
            
            body.x += body.vx * dt;
            body.y += body.vy * dt;
        }
    },
    
    calculateOrbitalVelocity(parent, altitude) {
        const r = parent.radius + altitude;
        return Math.sqrt(this.G * parent.mass / r);
    },
    
    calculateEscapeVelocity(parent, altitude) {
        return this.calculateOrbitalVelocity(parent, altitude) * Math.sqrt(2);
    },
    
    getOrbitalElements(body, parent) {
        const dx = body.x - parent.x;
        const dy = body.y - parent.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        const v = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
        
        const mu = this.G * parent.mass;
        
        const specificEnergy = 0.5 * v * v - mu / r;
        
        const h = dx * body.vy - dy * body.vx;
        const e = Math.sqrt(1 + 2 * specificEnergy * h * h / (mu * mu));
        
        const specificAngularMomentum = h;
        
        let periapsis = (h * h / mu) / (1 + e) - parent.radius;
        let apoapsis = (h * h / mu) / (1 - e) - parent.radius;
        
        if (apoapsis < 0) apoapsis = Infinity;
        if (periapsis < 0) periapsis = Infinity;
        
        return {
            semiMajorAxis: (periapsis + apoapsis) / 2,
            eccentricity: e,
            periapsis: Math.max(0, periapsis),
            apoapsis: Math.max(0, apoapsis),
            altitude: r - parent.radius,
            velocity: v,
            specificEnergy,
            angularMomentum: specificAngularMomentum
        };
    },
    
    getGravitationalAcceleration(x, y, bodies) {
        let ax = 0, ay = 0;
        
        for (const body of bodies) {
            if (body.mass === 0) continue;
            
            const dx = body.x - x;
            const dy = body.y - y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            if (dist > body.radius) {
                const force = this.G * body.mass / distSq;
                ax += (force * dx / dist);
                ay += (force * dy / dist);
            }
        }
        
        return { x: ax, y: ay };
    },
    
    checkCollision(body, target) {
        const dx = body.x - target.x;
        const dy = body.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < body.radius + target.radius;
    },
    
    calculateDeltaV(fuelMass, isp, dryMass) {
        const g0 = 9.81;
        return isp * g0 * Math.log((fuelMass + dryMass) / dryMass);
    },
    
    calculateTWR(thrust, mass, gravity) {
        return thrust / (mass * gravity);
    },
    
    HohmannTransfer(from, to, targetOrbit) {
        const r1 = from.radius + from.altitude;
        const r2 = targetOrbit.radius + to.altitude;
        
        const v1 = Math.sqrt(this.G * from.mass / r1);
        const v2 = Math.sqrt(this.G * from.mass / r2);
        
        const transferVelocity = Math.sqrt(this.G * from.mass * (2 / r1 - 1 / ((r1 + r2) / 2)));
        const dv1 = transferVelocity - v1;
        const dv2 = Math.sqrt(this.G * to.mass / r2) - (v2 - (v1 - dv1) * (r1 / r2));
        
        return { dv1, dv2, transferAngle: Math.PI };
    },
    
    gravityTurn(altitude, velocity, targetApogee, gravity) {
        const progress = Math.min(1, altitude / (targetApogee * 0.7));
        return 90 * (1 - progress * 0.7);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Physics;
}

const Physics = {
    G: 6.674e-11,
    
    getAtmosphericDensity(altitude, body) {
        if (!body || !body.atmosphere || altitude < 0) return 0;
        
        const scaleHeight = body.atmosphere.scaleHeight || 8500;
        const seaLevelDensity = body.atmosphere.density || 1.225;
        
        if (altitude > body.atmosphere.height) return 0;
        
        return seaLevelDensity * Math.exp(-altitude / scaleHeight);
    },
    
    calculateDrag(velocity, density, crossSection, dragCoeff) {
        return 0.5 * density * velocity * velocity * crossSection * dragCoeff;
    },
    
    calculateHeat(velocity, density) {
        const heatFactor = 1.0e-7;
        return heatFactor * velocity * velocity * density;
    },
    
    getGravitationalAcceleration(x, y, bodies) {
        let ax = 0, ay = 0;
        
        for (const body of bodies) {
            if (body.mass === 0) continue;
            
            const dx = body.x - x;
            const dy = body.y - y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            if (dist > 0) {
                const force = (this.G * body.mass) / distSq;
                ax += (force * dx / dist);
                ay += (force * dy / dist);
            }
        }
        
        return { x: ax, y: ay };
    },
    
    getAllGravitationalSources(x, y, bodies) {
        const sources = [];
        
        for (const body of bodies) {
            if (body.mass === 0) continue;
            
            const dx = body.x - x;
            const dy = body.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            sources.push({
                body: body,
                distance: dist,
                acceleration: (this.G * body.mass) / (dist * dist)
            });
        }
        
        return sources.sort((a, b) => a.distance - b.distance);
    },
    
    checkTerrainCollision(x, y, terrain) {
        if (!terrain || terrain.length === 0) return false;
        
        const angle = Math.atan2(y, x);
        const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        
        const resolution = terrain.length;
        const index = Math.floor((normalizedAngle / (Math.PI * 2)) * resolution);
        const point = terrain[index] || terrain[0];
        
        if (!point) return false;
        
        const dist = Math.sqrt(x * x + y * y);
        return dist <= point.radius;
    },
    
    checkLanding(velocity, angle, groundAngle, maxTouchdownVelocity, hasLandingGear) {
        const angleDiff = Math.abs(((angle - groundAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        
        if (angleDiff > Math.PI / 6) {
            return { result: 'tipped', message: 'Rocket tipped over!' };
        }
        
        const safeVelocity = hasLandingGear ? 10 : 3;
        
        if (velocity > safeVelocity) {
            return { result: 'crash', message: 'Touchdown velocity too high!' };
        }
        
        return { result: 'landed', message: 'Landed safely!' };
    },
    
    predictTrajectory(startX, startY, startVX, startVY, bodies, steps, dt, rocketThrust, rocketAngle, rocketMass) {
        const points = [];
        let x = startX, y = startY, vx = startVX, vy = startVY;
        
        for (let i = 0; i < steps; i++) {
            points.push({ x, y });
            
            const accel = this.getGravitationalAcceleration(x, y, bodies);
            
            if (rocketThrust > 0 && rocketMass > 0) {
                vx += (rocketThrust * Math.cos(rocketAngle) / rocketMass + accel.x) * dt;
                vy += (rocketThrust * Math.sin(rocketAngle) / rocketMass + accel.y) * dt;
            } else {
                vx += accel.x * dt;
                vy += accel.y * dt;
            }
            
            x += vx * dt;
            y += vy * dt;
            
            const nearest = Planets.getNearestBody(x, y);
            if (nearest.body && nearest.distance < nearest.body.radius) {
                points.push({ x, y, collided: true, body: nearest.body.id });
                break;
            }
        }
        
        return points;
    },
    
    calculateOrbitalVelocity(parent, altitude) {
        const r = parent.radius + altitude;
        return Math.sqrt(this.G * parent.mass / r);
    },
    
    calculateEscapeVelocity(parent, altitude) {
        return this.calculateOrbitalVelocity(parent, altitude) * Math.sqrt(2);
    },
    
    getOrbitalElements(body, parent) {
        if (!body || !parent) return null;
        
        const dx = body.x - parent.x;
        const dy = body.y - parent.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        const v = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
        
        if (r === 0) return null;
        
        const mu = this.G * parent.mass;
        
        const vradial = (body.vx * dx + body.vy * dy) / r;
        const vtangential = Math.sqrt(v * v - vradial * vradial);
        
        const specificEnergy = 0.5 * v * v - mu / r;
        const h = r * vtangential;
        
        const e2 = Math.max(0, 1 + 2 * specificEnergy * h * h / (mu * mu));
        const eCalc = Math.sqrt(e2);
        
        let periapsis = (h * h / mu) / (1 + eCalc) - parent.radius;
        let apoapsis = (h * h / mu) / (1 - eCalc) - parent.radius;
        
        if (apoapsis < 0) apoapsis = Infinity;
        if (periapsis < 0) periapsis = Infinity;
        
        const meanMotion = Math.sqrt(mu / Math.pow((periapsis + apoapsis) / 2 + parent.radius, 3));
        const period = meanMotion > 0 ? 2 * Math.PI / meanMotion : Infinity;
        
        return {
            semiMajorAxis: (periapsis + apoapsis) / 2,
            eccentricity: eCalc,
            periapsis: Math.max(0, periapsis),
            apoapsis: Math.max(0, apoapsis),
            altitude: r - parent.radius,
            velocity: v,
            period: period,
            inclination: 0
        };
    },
    
    checkCollision(body, target) {
        const dx = body.x - target.x;
        const dy = body.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < body.radius + target.radius;
    },
    
    calculateDeltaV(fuelMass, isp, dryMass) {
        const g0 = 9.81;
        if (fuelMass <= 0 || dryMass <= 0) return 0;
        return isp * g0 * Math.log((fuelMass + dryMass) / dryMass);
    },
    
    calculateTWR(thrust, mass, gravity) {
        if (mass <= 0 || gravity <= 0) return 0;
        return thrust / (mass * gravity);
    },
    
    HohmannTransfer(from, to, targetAltitude) {
        const r1 = from.radius + from.altitude;
        const r2 = to.radius + targetAltitude;
        
        if (r1 <= 0 || r2 <= 0) return { dv1: 0, dv2: 0, transferTime: 0 };
        
        const v1 = Math.sqrt(this.G * from.mass / r1);
        const v2 = Math.sqrt(this.G * to.mass / r2);
        
        const transferVelocity = Math.sqrt(this.G * from.mass * (2 / r1 - 1 / ((r1 + r2) / 2)));
        const dv1 = transferVelocity - v1;
        
        const vTransferArrival = Math.sqrt(this.G * to.mass * (2 / r2 - 1 / ((r1 + r2) / 2)));
        const dv2 = v2 - vTransferArrival;
        
        const transferTime = Math.PI * Math.sqrt(Math.pow((r1 + r2) / 2, 3) / (this.G * to.mass));
        
        return { dv1, dv2, transferTime };
    },
    
    gravityTurn(altitude, velocity, targetApogee, gravity) {
        const progress = Math.min(1, altitude / (targetApogee * 0.7));
        return 90 * (1 - progress * 0.7);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Physics;
}

const Game = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    
    state: 'menu',
    
    camera: {
        x: 0,
        y: 0,
        zoom: 1,
        targetZoom: 1,
        following: null,
        offsetX: 0,
        offsetY: 0
    },
    
    timeScale: 1,
    maxTimeWarp: 100,
    
    lastTime: 0,
    deltaTime: 0,
    
    missionComplete: false,
    visitedBodies: ['earth'],
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'game-canvas';
        document.getElementById('game-container').insertBefore(
            this.canvas,
            document.getElementById('ui-overlay')
        );
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        
        Input.init();
        UI.init();
        Planets.init();
        Rocket.init();
        
        this.load();
        
        this.lastTime = performance.now();
        this.gameLoop();
    },
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    
    newGame() {
        Planets.init();
        Rocket.init();
        
        const earth = Planets.getBody('earth');
        if (earth) {
            Rocket.launch(earth.x, earth.y, earth);
        }
        
        this.camera.x = Rocket.x;
        this.camera.y = Rocket.y;
        this.camera.zoom = 5;
        this.camera.targetZoom = 5;
        
        this.visitedBodies = ['earth'];
        this.missionComplete = false;
        this.timeScale = 1;
        
        UI.showGame();
        UI.showMessage('LAUNCH SUCCESSFUL!', 3000);
        
        this.state = 'flight';
    },
    
    launch() {
        if (Rocket.stages.length === 0 || !Rocket.hasPart('commandModule')) {
            UI.showMessage('Build a rocket with Command Module first!', 3000);
            return;
        }
        
        const earth = Planets.getBody('earth');
        if (earth) {
            Rocket.launch(earth.x, earth.y, earth);
        }
        
        this.camera.x = Rocket.x;
        this.camera.y = Rocket.y;
        this.camera.zoom = 5;
        this.camera.targetZoom = 5;
        
        UI.showGame();
        UI.showMessage('LAUNCH SUCCESSFUL!', 3000);
        
        this.state = 'flight';
    },
    
    save() {
        const saveData = {
            rocket: Rocket.toJSON(),
            camera: this.camera,
            visitedBodies: this.visitedBodies,
            missionComplete: this.missionComplete
        };
        localStorage.setItem('csp_save', JSON.stringify(saveData));
    },
    
    load() {
        const saved = localStorage.getItem('csp_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Rocket.fromJSON(data.rocket);
                this.camera = data.camera;
                this.visitedBodies = data.visitedBodies || ['earth'];
                this.missionComplete = data.missionComplete || false;
                
                if (Rocket.x !== 0 || Rocket.y !== 0) {
                    UI.showGame();
                    this.state = 'flight';
                    UI.showMessage('Game Loaded', 2000);
                }
            } catch (e) {
                console.error('Failed to load save:', e);
            }
        }
    },
    
    handleInput() {
        if (this.state !== 'flight') return;
        
        if (Input.keys['escape']) {
            UI.showMenu();
            this.state = 'menu';
            this.save();
            return;
        }
        
        if (Input.isJustPressed('1')) {
            UI.viewMode = 1;
        }
        if (Input.isJustPressed('2')) {
            UI.viewMode = 2;
        }
        if (Input.isJustPressed('3')) {
            UI.viewMode = 3;
        }
        
        if (Input.keys['w'] || Input.keys['arrowup']) {
            Rocket.throttle = Math.min(1, Rocket.throttle + 0.02);
        }
        if (Input.keys['s'] || Input.keys['arrowdown']) {
            Rocket.throttle = Math.max(0, Rocket.throttle - 0.02);
        }
        
        if (Input.keys['a'] || Input.keys['arrowleft']) {
            Rocket.angle -= 2 * this.deltaTime;
        }
        if (Input.keys['d'] || Input.keys['arrowright']) {
            Rocket.angle += 2 * this.deltaTime;
        }
        
        if (Input.isJustPressed(' ')) {
            if (Rocket.stage()) {
                UI.showMessage('STAGE SEPARATED', 2000);
            }
        }
        
        if (Input.isJustPressed('r')) {
            Rocket.rcsEnabled = !Rocket.rcsEnabled;
            UI.showMessage(Rocket.rcsEnabled ? 'RCS ON' : 'RCS OFF', 1000);
        }
        
        if (Input.isJustPressed('t')) {
            if (this.timeScale === 1) this.timeScale = 10;
            else if (this.timeScale === 10) this.timeScale = 100;
            else this.timeScale = 1;
            
            UI.showTimeWarp(this.timeScale);
        }
        
        if (Input.isJustPressed('m')) {
            UI.toggleOrbitInfo();
        }
        
        if (Input.scrollDelta > 0) {
            this.camera.targetZoom = Math.max(0.5, this.camera.targetZoom - 0.5);
        }
        if (Input.scrollDelta < 0) {
            this.camera.targetZoom = Math.min(20, this.camera.targetZoom + 0.5);
        }
        
        if (Input.isJustPressed('p')) {
            this.save();
            UI.showMessage('Game Saved', 2000);
        }
    },
    
    update(dt) {
        Planets.timeScale = this.timeScale;
        Planets.update(dt);
        
        if (this.state === 'flight' && !Rocket.crashed) {
            Rocket.update(dt * this.timeScale, Planets.getAllBodies());
            
            const nearest = Planets.getNearestBody(Rocket.x, Rocket.y);
            
            if (nearest.body && !this.visitedBodies.includes(nearest.body.id)) {
                if (Rocket.altitude < 500 || Rocket.landed) {
                    this.visitedBodies.push(nearest.body.id);
                    UI.showMessage(`Discovered: ${nearest.body.name}!`, 3000);
                }
            }
            
            if (Rocket.crashed) {
                UI.showMessage('CRASH! Press ESC for menu', 5000);
            }
            
            if (Rocket.landed) {
                const currentOrbit = Rocket.getOrbitInfo();
                if (currentOrbit && currentOrbit.apoapsis < 100 && currentOrbit.periapsis < 100) {
                    if (!this.missionComplete) {
                        this.missionComplete = true;
                        UI.showMessage('MISSION COMPLETE! You achieved stable orbit!', 5000);
                    }
                }
            }
            
            this.updateCamera(dt);
            
            UI.updateHUD(Rocket, nearest.body);
        }
    },
    
    updateCamera(dt) {
        switch (UI.viewMode) {
            case 1:
                this.camera.following = { x: Rocket.x, y: Rocket.y };
                this.camera.zoom = 5;
                break;
            case 2:
                const nearest = Planets.getNearestBody(Rocket.x, Rocket.y);
                if (nearest.body) {
                    this.camera.following = { x: nearest.body.x, y: nearest.body.y };
                }
                this.camera.zoom = 0.5;
                break;
            case 3:
                this.camera.following = { x: Rocket.x, y: Rocket.y };
                this.camera.zoom = this.camera.targetZoom;
                break;
        }
        
        if (this.camera.following) {
            this.camera.x += (this.camera.following.x - this.camera.x) * 0.1;
            this.camera.y += (this.camera.following.y - this.camera.y) * 0.1;
        }
    },
    
    render() {
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.save();
        
        if (UI.viewMode === 1) {
            const horizon = this.height * 0.7;
            this.renderSideView(horizon);
        } else if (UI.viewMode === 2) {
            this.renderOrbitalView();
        } else {
            const horizon = this.height * 0.6;
            this.renderZoomedSideView(horizon);
        }
        
        this.ctx.restore();
    },
    
    renderSideView(horizon) {
        const earth = Planets.getBody('earth');
        if (!earth) return;
        
        const rocketScreenX = this.width / 2;
        const rocketScreenY = horizon - 100;
        
        const rocketDx = Rocket.x - earth.x;
        const rocketDy = Rocket.y - earth.y;
        const rocketAngle = Math.atan2(Rocket.vy, Rocket.vx);
        
        this.ctx.fillStyle = '#112233';
        this.ctx.fillRect(0, 0, this.width, horizon);
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, horizon);
        gradient.addColorStop(0, '#000011');
        gradient.addColorStop(0.5, '#112233');
        gradient.addColorStop(1, '#223344');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, horizon);
        
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * horizon * 0.7,
                size: Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        
        for (const star of stars) {
            const twinkle = Math.sin(performance.now() / 1000 + star.twinkle) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        const earthGradient = this.ctx.createRadialGradient(
            this.width / 2, horizon + 200, 0,
            this.width / 2, horizon + 200, 400
        );
        earthGradient.addColorStop(0, '#4488ff');
        earthGradient.addColorStop(0.3, '#3366cc');
        earthGradient.addColorStop(0.7, '#224488');
        earthGradient.addColorStop(1, '#112244');
        
        this.ctx.fillStyle = earthGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, horizon + 300, 300, 0, Math.PI * 2);
        this.ctx.fill();
        
        if (Rocket.altitude < 500) {
            const atmosphereHeight = 20;
            const atmGradient = this.ctx.createLinearGradient(0, horizon - 10, 0, horizon + 10);
            atmGradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
            atmGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.5)');
            atmGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
            this.ctx.fillStyle = atmGradient;
            this.ctx.beginPath();
            this.ctx.arc(this.width / 2, horizon + 300, 300 + atmosphereHeight, Math.PI, 0);
            this.ctx.fill();
        }
        
        const rocketWorldX = earth.x + rocketDx * 0.1;
        const rocketWorldY = earth.y - (Rocket.altitude / 50) * 10;
        
        this.ctx.save();
        this.ctx.translate(rocketScreenX, rocketScreenY);
        this.ctx.rotate(Rocket.angle + Math.PI / 2);
        
        this.drawRocketShape(this.ctx, 30);
        
        if (Rocket.throttle > 0) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.beginPath();
            const flameLength = 20 + Math.random() * 15 * Rocket.throttle;
            this.ctx.moveTo(-8, 30);
            this.ctx.lineTo(0, 30 + flameLength);
            this.ctx.lineTo(8, 30);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.fillStyle = '#ff6600';
            this.ctx.beginPath();
            this.ctx.moveTo(-5, 30);
            this.ctx.lineTo(0, 30 + flameLength * 0.7);
            this.ctx.lineTo(5, 30);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        const altitude = Math.round(Rocket.altitude);
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`ALT: ${altitude}m`, 20, this.height - 80);
        this.ctx.fillText(`VEL: ${Math.round(Rocket.velocity)} m/s`, 20, this.height - 60);
        
        if (Rocket.altitude < 100) {
            const height = horizon - (Rocket.altitude / 50) * 10 - 100;
            if (height > horizon - 300) {
                this.ctx.fillStyle = '#00ff88';
                this.ctx.font = '12px monospace';
                this.ctx.fillText('GROUND INCOMING!', rocketScreenX - 60, height);
            }
        }
    },
    
    renderZoomedSideView(horizon) {
        const nearest = Planets.getNearestBody(Rocket.x, Rocket.y);
        if (!nearest.body) return;
        
        const body = nearest.body;
        
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.width, horizon);
        
        for (let i = 0; i < 50; i++) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(Math.random() * this.width, Math.random() * horizon * 0.8, Math.random() * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        const viewRange = 1000 / this.camera.zoom;
        const scale = 200 / viewRange;
        
        const bodyScreenX = this.width / 2 - (Rocket.x - body.x) * scale;
        const bodyScreenY = horizon + 200;
        const bodyRadius = body.radius * scale;
        
        const bodyGradient = this.ctx.createRadialGradient(
            bodyScreenX, bodyScreenY - bodyRadius * 0.3, 0,
            bodyScreenX, bodyScreenY, bodyRadius
        );
        bodyGradient.addColorStop(0, body.color);
        bodyGradient.addColorStop(1, this.darkenColor(body.color, 0.5));
        
        this.ctx.fillStyle = bodyGradient;
        this.ctx.beginPath();
        this.ctx.arc(bodyScreenX, bodyScreenY, bodyRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        if (body.atmosphere) {
            const atmGradient = this.ctx.createRadialGradient(
                bodyScreenX, bodyScreenY, bodyRadius,
                bodyScreenX, bodyScreenY, bodyRadius + body.atmosphere.height * scale
            );
            atmGradient.addColorStop(0, body.atmosphere.color);
            atmGradient.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = atmGradient;
            this.ctx.beginPath();
            this.ctx.arc(bodyScreenX, bodyScreenY, bodyRadius + body.atmosphere.height * scale, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        const rocketDx = (Rocket.x - body.x) * scale;
        const rocketDy = -(Rocket.y - body.y - body.radius - Rocket.altitude) * scale * 0.5;
        const rocketScreenX = this.width / 2 + rocketDx;
        const rocketScreenY = horizon - 150 + rocketDy;
        
        this.ctx.save();
        this.ctx.translate(rocketScreenX, rocketScreenY);
        this.ctx.rotate(Rocket.angle + Math.PI / 2);
        this.drawRocketShape(this.ctx, 20);
        
        if (Rocket.throttle > 0) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.beginPath();
            this.ctx.moveTo(-5, 20);
            this.ctx.lineTo(0, 20 + 15 * Rocket.throttle);
            this.ctx.lineTo(5, 20);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
    },
    
    renderOrbitalView() {
        const offsetX = this.width / 2 - this.camera.x;
        const offsetY = this.height / 2 - this.camera.y;
        const scale = 1 * this.camera.zoom;
        
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        for (let i = 0; i < 200; i++) {
            const x = (Math.sin(i * 1234.5) * 5000 + 5000) * scale + offsetX;
            const y = (Math.cos(i * 5678.9) * 5000 + 5000) * scale + offsetY;
            if (x > 0 && x < this.width && y > 0 && y < this.height) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        for (const body of Planets.bodies) {
            if (body.orbitRadius) {
                this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(
                    body.orbitRadius * scale + offsetX,
                    body.orbitRadius * scale + offsetY,
                    body.orbitRadius * scale,
                    0, Math.PI * 2
                );
                this.ctx.stroke();
            }
            
            const screenX = body.x * scale + offsetX;
            const screenY = body.y * scale + offsetY;
            
            if (screenX < -100 || screenX > this.width + 100 || 
                screenY < -100 || screenY > this.height + 100) continue;
            
            const bodyRadius = Math.max(3, body.radius * scale);
            
            if (body.id === 'sun') {
                const glow = this.ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, bodyRadius * 3);
                glow.addColorStop(0, 'rgba(255, 255, 100, 0.5)');
                glow.addColorStop(1, 'rgba(255, 200, 50, 0)');
                this.ctx.fillStyle = glow;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, bodyRadius * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.fillStyle = body.color;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, bodyRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (body.id === 'saturn' && body.hasRings) {
                this.ctx.strokeStyle = body.ringColor;
                this.ctx.lineWidth = bodyRadius * 0.3;
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY, bodyRadius * 2, bodyRadius * 0.5, Math.PI * 0.1, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            if (body.atmosphere) {
                this.ctx.strokeStyle = body.atmosphere.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, bodyRadius + 3, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            this.ctx.fillStyle = '#00ff88';
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(body.name, screenX, screenY + bodyRadius + 15);
        }
        
        if (Rocket.moons) {
            for (const moon of Rocket.moons) {
                const screenX = moon.x * scale + offsetX;
                const screenY = moon.y * scale + offsetY;
                
                this.ctx.fillStyle = moon.color;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, Math.max(2, moon.radius * scale), 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        const rocketScreenX = Rocket.x * scale + offsetX;
        const rocketScreenY = Rocket.y * scale + offsetY;
        
        this.ctx.save();
        this.ctx.translate(rocketScreenX, rocketScreenY);
        this.ctx.rotate(Rocket.angle);
        
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -8);
        this.ctx.lineTo(-5, 8);
        this.ctx.lineTo(5, 8);
        this.ctx.closePath();
        this.ctx.stroke();
        
        if (Rocket.throttle > 0) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.beginPath();
            this.ctx.moveTo(-3, 8);
            this.ctx.lineTo(0, 8 + 10 * Rocket.throttle);
            this.ctx.lineTo(3, 8);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        const orbit = Rocket.getOrbitInfo();
        if (orbit) {
            const nearestOrbit = Planets.getNearestBody(Rocket.x, Rocket.y);
            if (nearestOrbit.body) {
                this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
                this.ctx.setLineDash([5, 5]);
                this.ctx.beginPath();
                
                const steps = 100;
                for (let i = 0; i <= steps; i++) {
                    const angle = (i / steps) * Math.PI * 2;
                    const r = nearestOrbit.body.radius + orbit.periapsis + (orbit.apoapsis - orbit.periapsis) * 
                              (1 + Math.cos(angle)) / 2;
                    const px = (nearestOrbit.body.x + Math.cos(angle) * r) * scale + offsetX;
                    const py = (nearestOrbit.body.y + Math.sin(angle) * r) * scale + offsetY;
                    
                    if (i === 0) this.ctx.moveTo(px, py);
                    else this.ctx.lineTo(px, py);
                }
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }
    },
    
    drawRocketShape(ctx, size) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size * 0.5, size * 0.3);
        ctx.lineTo(-size * 0.3, size * 0.5);
        ctx.lineTo(size * 0.3, size * 0.5);
        ctx.lineTo(size * 0.5, size * 0.3);
        ctx.closePath();
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, -size * 0.3, size * 0.25, 0, Math.PI * 2);
        ctx.stroke();
    },
    
    darkenColor(hex, factor) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
    },
    
    gameLoop(currentTime = 0) {
        this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        this.handleInput();
        this.update(this.deltaTime);
        this.render();
        
        Input.clearJustPressed();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}

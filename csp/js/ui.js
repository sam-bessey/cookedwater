const PartRenderer = {
    colors: {
        capsule: { fill: '#e8e8e8', stroke: '#00ff88', accent: '#4488ff' },
        fuel: { fill: '#ffaa44', stroke: '#ff6600', accent: '#ffcc00' },
        engine: { fill: '#555555', stroke: '#ff4444', accent: '#ffaa00' },
        utility: { fill: '#444466', stroke: '#00ff88', accent: '#44aaff' },
        thermal: { fill: '#333333', stroke: '#ff6600', accent: '#ffaa00' },
        landing: { fill: '#666666', stroke: '#00ff88', accent: '#aaaaaa' }
    },
    
    drawPart(ctx, part, x, y, scale = 1, isHovered = false, isDragging = false) {
        const cat = part.category || 'utility';
        const colors = this.colors[cat] || this.colors.utility;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        if (isHovered || isDragging) {
            ctx.globalAlpha = 0.7;
        }
        
        switch (part.id) {
            case 'commandModule':
                this.drawCommandModule(ctx, part, colors);
                break;
            case 'smallTank':
            case 'largeTank':
                this.drawFuelTank(ctx, part, colors);
                break;
            case 'smallEngine':
            case 'largeEngine':
                this.drawEngine(ctx, part, colors);
                break;
            case 'ionEngine':
                this.drawIonEngine(ctx, part, colors);
                break;
            case 'decoupler':
                this.drawDecoupler(ctx, part, colors);
                break;
            case 'rcsThrusters':
                this.drawRCS(ctx, part, colors);
                break;
            case 'parachute':
                this.drawParachute(ctx, part, colors);
                break;
            case 'heatShield':
                this.drawHeatShield(ctx, part, colors);
                break;
            case 'landerLeg':
                this.drawLanderLeg(ctx, part, colors);
                break;
            case 'solarPanels':
                this.drawSolarPanels(ctx, part, colors);
                break;
            case 'battery':
                this.drawBattery(ctx, part, colors);
                break;
            default:
                this.drawGenericPart(ctx, part, colors);
        }
        
        ctx.restore();
    },
    
    drawCommandModule(ctx, part, colors) {
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors.fill;
        
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.bezierCurveTo(20, -20, 20, 10, 15, 20);
        ctx.lineTo(-15, 20);
        ctx.bezierCurveTo(-20, 10, -20, -20, 0, -25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.ellipse(0, 5, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-15, 20);
        ctx.lineTo(-12, 28);
        ctx.lineTo(12, 28);
        ctx.lineTo(15, 20);
        ctx.stroke();
    },
    
    drawFuelTank(ctx, part, colors) {
        const isLarge = part.id === 'largeTank';
        const width = isLarge ? 30 : 18;
        const height = isLarge ? 50 : 30;
        
        const gradient = ctx.createLinearGradient(-width/2, 0, width/2, 0);
        gradient.addColorStop(0, '#333');
        gradient.addColorStop(0.3, colors.fill);
        gradient.addColorStop(0.7, colors.fill);
        gradient.addColorStop(1, '#333');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(-width/2, -height/2, width, height, 3);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = colors.accent;
        ctx.fillRect(-width/2 + 3, -height/2 + 5, width - 6, (height - 10) * 0.7);
        
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-width/2, -height/4);
        ctx.lineTo(width/2, -height/4);
        ctx.moveTo(-width/2, height/4);
        ctx.lineTo(width/2, height/4);
        ctx.stroke();
        
        ctx.fillStyle = colors.stroke;
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LOX', 0, 5);
        ctx.fillText('FUEL', 0, 15);
    },
    
    drawEngine(ctx, part, colors) {
        const isLarge = part.id === 'largeEngine';
        const nozzleWidth = isLarge ? 25 : 15;
        const bodyWidth = isLarge ? 18 : 10;
        const height = isLarge ? 35 : 22;
        
        ctx.fillStyle = '#444';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(-bodyWidth/2, -height/2, bodyWidth, height * 0.6, 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(-nozzleWidth/2, height/2 - 5);
        ctx.lineTo(-bodyWidth/2, height/6);
        ctx.lineTo(bodyWidth/2, height/6);
        ctx.lineTo(nozzleWidth/2, height/2 - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        const innerGradient = ctx.createRadialGradient(0, height/2 - 2, 0, 0, height/2 - 2, nozzleWidth/3);
        innerGradient.addColorStop(0, '#111');
        innerGradient.addColorStop(1, '#333');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.ellipse(0, height/2 - 3, nozzleWidth/3, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        if (isLarge) {
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * bodyWidth/2, -height/3);
                ctx.lineTo(Math.cos(angle) * nozzleWidth/2, height/3);
                ctx.stroke();
            }
        }
    },
    
    drawIonEngine(ctx, part, colors) {
        ctx.fillStyle = '#334';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(-8, -15, 16, 20, 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#446';
        ctx.beginPath();
        ctx.ellipse(0, 5, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-6, 18);
        ctx.moveTo(10, 10);
        ctx.lineTo(6, 18);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.strokeStyle = '#88ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, -22);
        ctx.moveTo(-3, -15);
        ctx.lineTo(0, -22);
        ctx.moveTo(3, -15);
        ctx.lineTo(0, -22);
        ctx.stroke();
    },
    
    drawDecoupler(ctx, part, colors) {
        ctx.fillStyle = '#555';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        const gradient = ctx.createLinearGradient(0, -10, 0, 10);
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#444');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(-15, -8);
        ctx.lineTo(-12, 8);
        ctx.lineTo(12, 8);
        ctx.lineTo(15, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(-8, 0, 3, 0, Math.PI * 2);
        ctx.arc(8, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawRCS(ctx, part, colors) {
        ctx.fillStyle = '#444';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.roundRect(-6, -8, 12, 16, 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = colors.accent;
        const thrusterOffsets = [[-4, -6], [4, -6], [-4, 6], [4, 6]];
        for (const [ox, oy] of thrusterOffsets) {
            ctx.beginPath();
            ctx.arc(ox, oy, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawParachute(ctx, part, colors) {
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors.fill;
        
        ctx.beginPath();
        ctx.arc(0, -5, 18, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-18, -5);
        ctx.quadraticCurveTo(-10, -20, 0, -20);
        ctx.quadraticCurveTo(10, -20, 18, -5);
        ctx.stroke();
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const x = -15 + i * 7.5;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x * 0.8, 12);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawHeatShield(ctx, part, colors) {
        ctx.fillStyle = '#222';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.quadraticCurveTo(-20, 20, 0, 25);
        ctx.quadraticCurveTo(20, 20, 20, 0);
        ctx.lineTo(15, 0);
        ctx.quadraticCurveTo(15, 15, 0, 18);
        ctx.quadraticCurveTo(-15, 15, -15, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI;
            ctx.beginPath();
            ctx.moveTo(-15 + Math.cos(angle) * 3, Math.sin(angle) * 3);
            ctx.lineTo(15 - Math.cos(angle) * 3, Math.sin(angle) * 3);
            ctx.stroke();
        }
    },
    
    drawLanderLeg(ctx, part, colors) {
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(-8, -20);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-20, 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(8, -20);
        ctx.lineTo(12, 0);
        ctx.lineTo(20, 15);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(-20, 15, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(20, 15, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawSolarPanels(ctx, part, colors) {
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1;
        
        ctx.fillStyle = '#222';
        ctx.fillRect(-20, -10, 40, 6);
        ctx.strokeRect(-20, -10, 40, 6);
        
        ctx.fillStyle = '#113366';
        ctx.fillRect(-18, -8, 8, 4);
        ctx.fillRect(-8, -8, 8, 4);
        ctx.fillRect(2, -8, 8, 4);
        
        ctx.strokeStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.stroke();
    },
    
    drawBattery(ctx, part, colors) {
        ctx.fillStyle = '#444';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(-8, -12, 16, 24, 2);
        ctx.fill();
        ctx.stroke();
        
        const chargeGradient = ctx.createLinearGradient(-6, -10, -6, 10);
        chargeGradient.addColorStop(0, '#4f4');
        chargeGradient.addColorStop(1, '#242');
        ctx.fillStyle = chargeGradient;
        ctx.fillRect(-6, -10, 12, 20);
        
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-4, -12);
        ctx.lineTo(-4, -15);
        ctx.moveTo(4, -12);
        ctx.lineTo(4, -15);
        ctx.stroke();
    },
    
    drawGenericPart(ctx, part, colors) {
        ctx.fillStyle = colors.fill;
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(-10, -10, 20, 20, 3);
        ctx.fill();
        ctx.stroke();
    },
    
    getPartDimensions(part) {
        switch (part.id) {
            case 'commandModule': return { width: 40, height: 50 };
            case 'smallTank': return { width: 25, height: 35 };
            case 'largeTank': return { width: 40, height: 60 };
            case 'smallEngine': return { width: 25, height: 30 };
            case 'largeEngine': return { width: 40, height: 45 };
            case 'ionEngine': return { width: 20, height: 30 };
            case 'decoupler': return { width: 35, height: 20 };
            case 'rcsThrusters': return { width: 20, height: 20 };
            case 'parachute': return { width: 45, height: 30 };
            case 'heatShield': return { width: 45, height: 30 };
            case 'landerLeg': return { width: 45, height: 40 };
            case 'solarPanels': return { width: 50, height: 20 };
            case 'battery': return { width: 20, height: 30 };
            default: return { width: 30, height: 30 };
        }
    }
};

const UI = {
    currentScreen: 'menu',
    viewMode: 1,
    timeWarp: 1,
    showOrbitInfo: true,
    showNavball: false,
    message: '',
    messageTimeout: null,
    
    builderCanvas: null,
    builderCtx: null,
    selectedPart: null,
    draggedPart: null,
    mousePos: { x: 0, y: 0 },
    rocketParts: [],
    snapPoints: [],
    
    init() {
        this.createMenuScreen();
        this.createHUDScreen();
        this.createVABScreen();
    },
    
    createMenuScreen() {
        const menu = document.createElement('div');
        menu.id = 'menu-screen';
        menu.innerHTML = `
            <h1>COOKED SPACE PROGRAM</h1>
            <h2>A 2D Orbital Simulator</h2>
            <button class="menu-btn" id="btn-new-game">NEW GAME</button>
            <button class="menu-btn" id="btn-continue">CONTINUE</button>
            <button class="menu-btn" id="btn-rocket-builder">ROCKET BUILDER</button>
        `;
        document.getElementById('ui-overlay').appendChild(menu);
        
        document.getElementById('btn-new-game').onclick = () => Game.newGame();
        document.getElementById('btn-continue').onclick = () => Game.load();
        document.getElementById('btn-rocket-builder').onclick = () => this.showVAB();
    },
    
    createHUDScreen() {
        const hud = document.createElement('div');
        hud.id = 'hud';
        hud.className = 'panel';
        hud.innerHTML = `
            <div class="hud-row">
                <span class="hud-label">ALT</span>
                <span class="hud-value" id="hud-alt">0</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">VEL</span>
                <span class="hud-value" id="hud-vel">0</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">PROgrade</span>
                <span class="hud-value" id="hud-prograde">0</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">THROTTLE</span>
                <span class="hud-value" id="hud-throttle">0%</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">FUEL</span>
                <span class="hud-value" id="hud-fuel">100%</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">STAGE</span>
                <span class="hud-value" id="hud-stage">0/0</span>
            </div>
            <div class="hud-row heat-row" style="display: none;">
                <span class="hud-label">HEAT</span>
                <span class="hud-value" id="hud-heat">0%</span>
            </div>
        `;
        document.getElementById('ui-overlay').appendChild(hud);
        
        const hudTop = document.createElement('div');
        hudTop.id = 'hud-top';
        hudTop.className = 'panel';
        hudTop.innerHTML = `
            <div class="hud-row">
                <span class="hud-label">BODY</span>
                <span class="hud-value" id="hud-body">Earth</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">APO</span>
                <span class="hud-value" id="hud-apo">0</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">PERI</span>
                <span class="hud-value" id="hud-peri">0</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">PERIOD</span>
                <span class="hud-value" id="hud-period">0s</span>
            </div>
        `;
        document.getElementById('ui-overlay').appendChild(hudTop);
        
        const controls = document.createElement('div');
        controls.id = 'controls-panel';
        controls.className = 'panel';
        controls.innerHTML = `
            [W/S] Throttle [A/D] Rotate<br>
            [Q/E] Fine Rotate [R] RCS<br>
            [SPACE] Stage [1-3] View<br>
            [T] Time Warp [M] Map<br>
            [F] Trajectory [N] Navball<br>
            [G] Gear [ESC] Menu
        `;
        document.getElementById('ui-overlay').appendChild(controls);
        
        const timeWarp = document.createElement('div');
        timeWarp.id = 'time-warp';
        document.getElementById('ui-overlay').appendChild(timeWarp);
        
        const message = document.createElement('div');
        message.id = 'message';
        document.getElementById('ui-overlay').appendChild(message);
        
        const navball = document.createElement('div');
        navball.id = 'navball-display';
        navball.className = 'panel';
        navball.innerHTML = `
            <div class="navball-inner">
                <div class="navball-marker prograde">PRO</div>
                <div class="navball-marker retrograde">RET</div>
                <div class="navball-marker radial-out">RAD+</div>
                <div class="navball-marker radial-in">RAD-</div>
                <div class="navball-center"></div>
            </div>
        `;
        document.getElementById('ui-overlay').appendChild(navball);
    },
    
    createVABScreen() {
        const vab = document.createElement('div');
        vab.id = 'vab-screen';
        vab.innerHTML = `
            <div id="parts-panel">
                <h3>PARTS</h3>
                <div id="parts-list"></div>
            </div>
            <div id="rocket-builder-area">
                <canvas id="builder-canvas" width="300" height="700"></canvas>
                <div id="builder-help">Click a part, then click on rocket to place<br>Right-click part to remove</div>
            </div>
            <div id="stats-panel">
                <h3>STATS</h3>
                <div id="rocket-stats"></div>
                <h3>STAGES</h3>
                <div id="stage-list"></div>
                <div style="margin-top: 20px;">
                    <button class="menu-btn" id="btn-launch">LAUNCH</button>
                    <button class="menu-btn" id="btn-back">BACK</button>
                    <button class="menu-btn" id="btn-clear" style="margin-top: 10px; font-size: 12px; padding: 8px 20px;">CLEAR ALL</button>
                </div>
            </div>
        `;
        document.getElementById('ui-overlay').appendChild(vab);
        
        this.builderCanvas = document.getElementById('builder-canvas');
        this.builderCtx = this.builderCanvas.getContext('2d');
        
        this.builderCanvas.addEventListener('mousedown', (e) => this.handleBuilderClick(e));
        this.builderCanvas.addEventListener('mousemove', (e) => this.handleBuilderMove(e));
        this.builderCanvas.addEventListener('contextmenu', (e) => this.handleBuilderRightClick(e));
        
        this.populatePartsList();
        this.updateVABStats();
    },
    
    populatePartsList() {
        const partsList = document.getElementById('parts-list');
        if (!partsList) return;
        
        partsList.innerHTML = '';
        
        const categories = {
            capsule: 'Capsules',
            fuel: 'Fuel Tanks',
            engine: 'Engines',
            utility: 'Utility',
            thermal: 'Thermal',
            landing: 'Landing'
        };
        
        for (const [cat, name] of Object.entries(categories)) {
            const catDiv = document.createElement('div');
            catDiv.innerHTML = `<h4>${name}</h4>`;
            
            for (const part of Object.values(RocketParts)) {
                if (part.category === cat) {
                    const partDiv = document.createElement('div');
                    partDiv.className = 'part-item';
                    partDiv.dataset.partId = part.id;
                    partDiv.innerHTML = `
                        <div class="part-name">${part.name}</div>
                        <div class="part-stats">
                            Mass: ${(part.mass / 1000).toFixed(1)}t<br>
                            ${part.thrust > 0 ? `Thrust: ${(part.thrust / 1000).toFixed(0)}kN` : ''}
                            ${part.fuel > 0 ? `Fuel: ${part.fuel}kg` : ''}
                            ${part.heatShield > 0 ? `Heat: ${part.heatShield}` : ''}
                        </div>
                    `;
                    partDiv.onclick = () => {
                        this.selectedPart = part.id;
                        this.updateBuilderHelp(`Selected: ${part.name} - Click on rocket to place`);
                    };
                    catDiv.appendChild(partDiv);
                }
            }
            
            partsList.appendChild(catDiv);
        }
    },
    
    updateBuilderHelp(text) {
        const help = document.getElementById('builder-help');
        if (help) {
            help.textContent = text || 'Click a part, then click on rocket to place\\nRight-click part to remove';
        }
    },
    
    handleBuilderClick(e) {
        const rect = this.builderCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.selectedPart) {
            const snapInfo = this.findNearestSnapPoint(x, y);
            if (snapInfo) {
                if (this.addPartAtPosition(this.selectedPart, snapInfo.stage, snapInfo.point)) {
                    this.selectedPart = null;
                    this.updateBuilderHelp('Part placed! Select another part or launch');
                    this.drawRocketBuilder();
                    this.updateVABStats();
                }
            }
        }
    },
    
    handleBuilderRightClick(e) {
        e.preventDefault();
        const rect = this.builderCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const partToRemove = this.findPartAtPosition(x, y);
        if (partToRemove) {
            this.removePartAtPosition(partToRemove.stage, partToRemove.index);
            this.drawRocketBuilder();
            this.updateVABStats();
        }
    },
    
    handleBuilderMove(e) {
        const rect = this.builderCanvas.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
        
        this.drawRocketBuilder();
        
        if (this.selectedPart) {
            const partDef = RocketParts[this.selectedPart];
            if (partDef) {
                PartRenderer.drawPart(this.builderCtx, partDef, this.mousePos.x, this.mousePos.y, 1, true);
                
                const snapInfo = this.findNearestSnapPoint(this.mousePos.x, this.mousePos.y);
                if (snapInfo) {
                    this.builderCtx.strokeStyle = '#00ff88';
                    this.builderCtx.lineWidth = 2;
                    this.builderCtx.setLineDash([5, 5]);
                    this.builderCtx.beginPath();
                    this.builderCtx.arc(snapInfo.point.x, snapInfo.point.y, 10, 0, Math.PI * 2);
                    this.builderCtx.stroke();
                    this.builderCtx.setLineDash([]);
                }
            }
        }
    },
    
    findNearestSnapPoint(x, y) {
        if (this.rocketParts.length === 0) {
            const centerX = this.builderCanvas.width / 2;
            return { stage: 0, point: { x: centerX, y: this.builderCanvas.height - 60 } };
        }
        
        let nearest = null;
        let minDist = 30;
        
        for (let si = 0; si < this.rocketParts.length; si++) {
            const stage = this.rocketParts[si];
            for (let pi = 0; pi < stage.length; pi++) {
                const part = stage[pi];
                
                this.builderCtx.save();
                this.builderCtx.translate(part.x, part.y);
                const dims = PartRenderer.getPartDimensions(part);
                this.builderCtx.restore();
                
                const bottomPoint = { x: part.x, y: part.y + dims.height / 2 };
                const dist = Math.sqrt((x - bottomPoint.x) ** 2 + (y - bottomPoint.y) ** 2);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = { stage: si, point: bottomPoint };
                }
            }
        }
        
        if (nearest) return nearest;
        
        const lastStage = this.rocketParts[this.rocketParts.length - 1];
        if (lastStage && lastStage.length > 0) {
            const lastPart = lastStage[lastStage.length - 1];
            const dims = PartRenderer.getPartDimensions(lastPart);
            const topPoint = { x: lastPart.x, y: lastPart.y - dims.height / 2 };
            const dist = Math.sqrt((x - topPoint.x) ** 2 + (y - topPoint.y) ** 2);
            if (dist < 50) {
                return { stage: this.rocketParts.length - 1, point: topPoint };
            }
        }
        
        return null;
    },
    
    findPartAtPosition(x, y) {
        for (let si = 0; si < this.rocketParts.length; si++) {
            const stage = this.rocketParts[si];
            for (let pi = 0; pi < stage.length; pi++) {
                const part = stage[pi];
                const dims = PartRenderer.getPartDimensions(part);
                if (Math.abs(x - part.x) < dims.width / 2 && Math.abs(y - part.y) < dims.height / 2) {
                    return { stage: si, index: pi };
                }
            }
        }
        return null;
    },
    
    addPartAtPosition(partId, stageIndex, point) {
        const partDef = RocketParts[partId];
        if (!partDef) return false;
        
        if (partId === 'commandModule' && this.hasPartInBuilder('commandModule')) {
            this.updateBuilderHelp('Can only have one Command Module!');
            return false;
        }
        
        while (this.rocketParts.length <= stageIndex) {
            this.rocketParts.push([]);
        }
        
        this.rocketParts[stageIndex].push({
            ...partDef,
            uid: Date.now() + Math.random(),
            x: point.x,
            y: point.y
        });
        
        return true;
    },
    
    removePartAtPosition(stageIndex, partIndex) {
        if (this.rocketParts[stageIndex] && this.rocketParts[stageIndex][partIndex]) {
            this.rocketParts[stageIndex].splice(partIndex, 1);
            if (this.rocketParts[stageIndex].length === 0) {
                this.rocketParts.splice(stageIndex, 1);
            }
            return true;
        }
        return false;
    },
    
    hasPartInBuilder(partId) {
        for (const stage of this.rocketParts) {
            if (stage.some(p => p.id === partId)) return true;
        }
        return false;
    },
    
    drawRocketBuilder() {
        const ctx = this.builderCtx;
        const canvas = this.builderCanvas;
        
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        ctx.lineWidth = 1;
        const centerX = canvas.width / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
        
        for (let si = 0; si < this.rocketParts.length; si++) {
            const stage = this.rocketParts[si];
            for (let pi = 0; pi < stage.length; pi++) {
                const part = stage[pi];
                PartRenderer.drawPart(ctx, part, part.x, part.y, 1);
            }
            
            if (si < this.rocketParts.length - 1) {
                const lastPart = stage[stage.length - 1];
                if (lastPart) {
                    const dims = PartRenderer.getPartDimensions(lastPart);
                    ctx.strokeStyle = '#ff4444';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(lastPart.x - 20, lastPart.y + dims.height / 2 + 5);
                    ctx.lineTo(lastPart.x + 20, lastPart.y + dims.height / 2 + 5);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }
        
        if (this.rocketParts.length === 0) {
            ctx.fillStyle = '#00aa66';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Start building - select a part from the left', centerX, canvas.height - 100);
        }
    },
    
    updateVABStats() {
        const statsDiv = document.getElementById('rocket-stats');
        if (!statsDiv) return;
        
        this.syncRocketToBuilder();
        
        const twr = Rocket.totalMass > 0 ? Rocket.totalThrust / (Rocket.totalMass * 9.81) : 0;
        
        statsDiv.innerHTML = `
            <div class="orbit-info">
                <div><span class="label">Total Mass:</span> <span class="value">${(Rocket.totalMass / 1000).toFixed(2)}t</span></div>
                <div><span class="label">Total Fuel:</span> <span class="value">${Rocket.totalFuel}kg</span></div>
                <div><span class="label">Total Thrust:</span> <span class="value">${(Rocket.totalThrust / 1000).toFixed(0)}kN</span></div>
                <div><span class="label">TWR:</span> <span class="value">${twr.toFixed(2)}</span></div>
                <div><span class="label">Delta-V:</span> <span class="value">${Rocket.totalDeltaV.toFixed(0)} m/s</span></div>
            </div>
        `;
        
        const stageList = document.getElementById('stage-list');
        if (!stageList) return;
        
        stageList.innerHTML = '';
        
        Rocket.stages.forEach((stage, i) => {
            const stageDiv = document.createElement('div');
            stageDiv.className = 'stage-item';
            stageDiv.innerHTML = `
                <strong>Stage ${i + 1}</strong>
                <div style="font-size: 12px; color: #00aa66;">
                    Mass: ${(stage.totalMass / 1000).toFixed(2)}t<br>
                    Fuel: ${stage.totalFuel}kg | Thrust: ${(stage.totalThrust / 1000).toFixed(0)}kN<br>
                    ${stage.hasEngine ? '✓ Engine' : ''}
                    ${stage.hasDecoupler ? '✓ Decoupler' : ''}
                    ${stage.hasParachute ? '✓ Parachute' : ''}
                    ${stage.hasLandingGear ? '✓ Landing Gear' : ''}
                    ${stage.hasHeatShield ? '✓ Heat Shield' : ''}
                </div>
                <button class="menu-btn" style="padding: 5px 10px; font-size: 12px; margin-top: 5px;"
                    onclick="UI.clearStage(${i})">
                    CLEAR STAGE
                </button>
            `;
            stageList.appendChild(stageDiv);
        });
        
        document.getElementById('btn-launch').onclick = () => {
            if (Rocket.stages.length === 0 || !Rocket.hasPart('commandModule')) {
                this.updateBuilderHelp('Need Command Module to launch!');
                return;
            }
            Game.launch();
        };
        document.getElementById('btn-back').onclick = () => this.showMenu();
        document.getElementById('btn-clear').onclick = () => this.clearAllParts();
    },
    
    clearStage(stageIndex) {
        if (this.rocketParts[stageIndex]) {
            this.rocketParts[stageIndex] = [];
            if (this.rocketParts[stageIndex].length === 0) {
                this.rocketParts.splice(stageIndex, 1);
            }
            this.drawRocketBuilder();
            this.updateVABStats();
        }
    },
    
    clearAllParts() {
        this.rocketParts = [];
        this.selectedPart = null;
        this.drawRocketBuilder();
        this.updateVABStats();
        this.updateBuilderHelp('Rocket cleared! Start building');
    },
    
    syncRocketToBuilder() {
        Rocket.reset();
        
        for (let si = 0; si < this.rocketParts.length; si++) {
            const stage = this.rocketParts[si];
            if (si > 0) {
                Rocket.addDecouplerAsNewStage();
            }
            
            for (const part of stage) {
                Rocket.addPart(part.id, si);
            }
        }
        
        Rocket.recalculate();
    },
    
    showMenu() {
        this.currentScreen = 'menu';
        this.selectedPart = null;
        this.rocketParts = [];
        document.getElementById('menu-screen').classList.remove('hidden');
        document.getElementById('vab-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'none';
        document.getElementById('hud-top').style.display = 'none';
        document.getElementById('controls-panel').style.display = 'none';
        document.getElementById('navball-display').style.display = 'none';
    },
    
    showVAB() {
        this.currentScreen = 'vab';
        this.rocketParts = [];
        this.selectedPart = null;
        
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('vab-screen').style.display = 'flex';
        document.getElementById('hud').style.display = 'none';
        document.getElementById('hud-top').style.display = 'none';
        document.getElementById('controls-panel').style.display = 'none';
        
        this.updateVABStats();
        this.drawRocketBuilder();
    },
    
    showGame() {
        this.currentScreen = 'game';
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('vab-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
        document.getElementById('hud-top').style.display = 'block';
        document.getElementById('controls-panel').style.display = 'block';
    },
    
    showMessage(text, duration = 3000) {
        const msgEl = document.getElementById('message');
        msgEl.textContent = text;
        msgEl.classList.add('visible');
        
        if (this.messageTimeout) clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            msgEl.classList.remove('visible');
        }, duration);
    },
    
    showTimeWarp(rate) {
        const twEl = document.getElementById('time-warp');
        if (rate > 1) {
            twEl.textContent = `TIME WARP ${rate}x`;
            twEl.classList.add('visible');
        } else {
            twEl.classList.remove('visible');
        }
    },
    
    toggleNavball() {
        this.showNavball = !this.showNavball;
        document.getElementById('navball-display').style.display = this.showNavball ? 'block' : 'none';
    },
    
    updateHUD(rocket, nearestBody, game) {
        if (this.currentScreen !== 'game') return;
        
        const altKm = rocket.altitude > 0 ? (rocket.altitude / 1000).toFixed(1) : '0';
        document.getElementById('hud-alt').textContent = altKm + ' km';
        
        const velEl = document.getElementById('hud-vel');
        velEl.textContent = Math.round(rocket.velocity).toLocaleString() + ' m/s';
        velEl.className = 'hud-value' + (rocket.velocity > 5000 ? ' danger' : rocket.velocity > 2000 ? ' warning' : '');
        
        const prograde = Math.atan2(rocket.vy, rocket.vx) * 180 / Math.PI;
        document.getElementById('hud-prograde').textContent = Math.round(prograde) + '°';
        
        const throttleEl = document.getElementById('hud-throttle');
        throttleEl.textContent = Math.round(rocket.throttle * 100) + '%';
        
        const fuelPercent = rocket.maxFuel > 0 ? (rocket.fuel / rocket.maxFuel * 100) : 0;
        const fuelEl = document.getElementById('hud-fuel');
        fuelEl.textContent = Math.round(fuelPercent) + '%';
        fuelEl.className = 'hud-value' + (fuelPercent < 10 ? ' danger' : fuelPercent < 25 ? ' warning' : '');
        
        const stageInfo = rocket.getStageInfo();
        if (stageInfo) {
            document.getElementById('hud-stage').textContent = `${stageInfo.current + 1}/${stageInfo.total}`;
        }
        
        const heatRow = document.querySelector('.heat-row');
        if (rocket.heat > 0) {
            heatRow.style.display = 'flex';
            const heatEl = document.getElementById('hud-heat');
            const heatPercent = (rocket.heat / rocket.maxHeat * 100).toFixed(0);
            heatEl.textContent = heatPercent + '%';
            heatEl.className = 'hud-value' + (heatPercent > 75 ? ' danger' : heatPercent > 50 ? ' warning' : '');
        } else {
            heatRow.style.display = 'none';
        }
        
        if (nearestBody) {
            document.getElementById('hud-body').textContent = nearestBody.name;
            
            const orbit = rocket.getOrbitInfo();
            if (orbit) {
                document.getElementById('hud-apo').textContent = (orbit.apoapsis / 1000).toFixed(1) + ' km';
                document.getElementById('hud-peri').textContent = (orbit.periapsis / 1000).toFixed(1) + ' km';
                
                if (orbit.period && orbit.period < Infinity) {
                    const periodMin = orbit.period / 60;
                    document.getElementById('hud-period').textContent = periodMin > 60 ? (periodMin / 60).toFixed(1) + ' hr' : periodMin.toFixed(0) + ' min';
                } else {
                    document.getElementById('hud-period').textContent = '--';
                }
            }
        }
        
        this.updateNavballMarkers(rocket);
    },
    
    updateNavballMarkers(rocket) {
        if (!this.showNavball) return;
        
        const progradeAngle = Math.atan2(rocket.vy, rocket.vx);
        const rocketAngle = rocket.angle;
        const angleOffset = progradeAngle - rocketAngle + Math.PI / 2;
        
        const prograde = document.querySelector('.navball-marker.prograde');
        const retrograde = document.querySelector('.navball-marker.retrograde');
        const radialOut = document.querySelector('.navball-marker.radial-out');
        const radialIn = document.querySelector('.navball-marker.radial-in');
        
        const radius = 35;
        
        if (prograde) {
            const angle = Math.PI / 2 - angleOffset;
            prograde.style.left = (50 + Math.cos(angle) * radius) + 'px';
            prograde.style.top = (50 + Math.sin(angle) * radius) + 'px';
        }
        if (retrograde) {
            const angle = Math.PI / 2 - angleOffset + Math.PI;
            retrograde.style.left = (50 + Math.cos(angle) * radius) + 'px';
            retrograde.style.top = (50 + Math.sin(angle) * radius) + 'px';
        }
        if (radialOut) {
            const angle = Math.PI / 2 - angleOffset + Math.PI / 2;
            radialOut.style.left = (50 + Math.cos(angle) * radius) + 'px';
            radialOut.style.top = (50 + Math.sin(angle) * radius) + 'px';
        }
        if (radialIn) {
            const angle = Math.PI / 2 - angleOffset - Math.PI / 2;
            radialIn.style.left = (50 + Math.cos(angle) * radius) + 'px';
            radialIn.style.top = (50 + Math.sin(angle) * radius) + 'px';
        }
    },
    
    toggleOrbitInfo() {
        this.showOrbitInfo = !this.showOrbitInfo;
        document.getElementById('hud-top').style.display = this.showOrbitInfo ? 'block' : 'none';
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}

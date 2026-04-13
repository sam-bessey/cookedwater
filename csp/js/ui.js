const UI = {
    currentScreen: 'menu',
    viewMode: 1,
    timeWarp: 1,
    showOrbitInfo: true,
    message: '',
    messageTimeout: null,
    
    elements: {},
    
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
            [ESC] Menu
        `;
        document.getElementById('ui-overlay').appendChild(controls);
        
        const timeWarp = document.createElement('div');
        timeWarp.id = 'time-warp';
        document.getElementById('ui-overlay').appendChild(timeWarp);
        
        const message = document.createElement('div');
        message.id = 'message';
        document.getElementById('ui-overlay').appendChild(message);
    },
    
    createVABScreen() {
        const vab = document.createElement('div');
        vab.id = 'vab-screen';
        vab.innerHTML = `
            <div id="parts-panel">
                <h3>PARTS</h3>
                <div id="parts-list"></div>
            </div>
            <div id="rocket-preview">
                <canvas id="rocket-canvas" width="200" height="600"></canvas>
            </div>
            <div id="stats-panel">
                <h3>STATS</h3>
                <div id="rocket-stats"></div>
                <h3>STAGES</h3>
                <div id="stage-list"></div>
                <div style="margin-top: 20px;">
                    <button class="menu-btn" id="btn-launch">LAUNCH</button>
                    <button class="menu-btn" id="btn-back">BACK</button>
                </div>
            </div>
        `;
        document.getElementById('ui-overlay').appendChild(vab);
        
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
            utility: 'Utility'
        };
        
        for (const [cat, name] of Object.entries(categories)) {
            const catDiv = document.createElement('div');
            catDiv.innerHTML = `<h4>${name}</h4>`;
            
            for (const part of Object.values(RocketParts)) {
                if (part.category === cat) {
                    const partDiv = document.createElement('div');
                    partDiv.className = 'part-item';
                    partDiv.innerHTML = `
                        <div class="part-name">${part.icon} ${part.name}</div>
                        <div class="part-stats">
                            Mass: ${part.mass}t | ${part.description}<br>
                            ${part.thrust > 0 ? `Thrust: ${part.thrust}` : ''}
                            ${part.fuel > 0 ? `Fuel: ${part.fuel}` : ''}
                        </div>
                    `;
                    partDiv.onclick = () => {
                        if (Rocket.addPart(part.id)) {
                            this.updateVABStats();
                            this.drawRocketPreview();
                        }
                    };
                    catDiv.appendChild(partDiv);
                }
            }
            
            partsList.appendChild(catDiv);
        }
    },
    
    updateVABStats() {
        const statsDiv = document.getElementById('rocket-stats');
        if (!statsDiv) return;
        
        Rocket.recalculate();
        
        statsDiv.innerHTML = `
            <div class="orbit-info">
                <div><span class="label">Total Mass:</span> <span class="value">${Rocket.totalMass.toFixed(2)}t</span></div>
                <div><span class="label">Total Fuel:</span> <span class="value">${Rocket.totalFuel}</span></div>
                <div><span class="label">Total Thrust:</span> <span class="value">${Rocket.totalThrust}</span></div>
                <div><span class="label">TWR:</span> <span class="value">${(Rocket.totalThrust / (Rocket.totalMass * 9.81)).toFixed(2)}</span></div>
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
                    Parts: ${stage.parts.length}<br>
                    Fuel: ${stage.totalFuel} | Thrust: ${stage.totalThrust}<br>
                    ${stage.hasEngine ? '✓ Engine' : ''}
                    ${stage.hasDecoupler ? '✓ Decoupler' : ''}
                    ${stage.hasParachute ? '✓ Parachute' : ''}
                </div>
                <button class="menu-btn" style="padding: 5px 10px; font-size: 12px; margin-top: 5px;"
                    onclick="Rocket.removePart(Rocket.stages[${i}].parts.slice(-1)[0]?.uid, ${i}); UI.updateVABStats(); UI.drawRocketPreview();">
                    REMOVE LAST
                </button>
            `;
            stageList.appendChild(stageDiv);
        });
        
        document.getElementById('btn-launch').onclick = () => Game.launch();
        document.getElementById('btn-back').onclick = () => this.showMenu();
    },
    
    drawRocketPreview() {
        const canvas = document.getElementById('rocket-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        let y = canvas.height - 50;
        
        for (let i = 0; i < Rocket.stages.length; i++) {
            const stage = Rocket.stages[i];
            let stageHeight = 30 + stage.parts.length * 15;
            
            ctx.fillStyle = '#00ff88';
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX - 20, y);
            ctx.lineTo(centerX - 15, y - stageHeight);
            ctx.lineTo(centerX + 15, y - stageHeight);
            ctx.lineTo(centerX + 20, y);
            ctx.closePath();
            ctx.stroke();
            
            for (const part of stage.parts) {
                ctx.fillStyle = '#00aa66';
                ctx.font = '12px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(part.icon, centerX, y - stageHeight + 25);
                stageHeight -= 15;
            }
            
            if (i < Rocket.stages.length - 1) {
                ctx.strokeStyle = '#ff4444';
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(centerX - 25, y);
                ctx.lineTo(centerX + 25, y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            y -= stageHeight + 10;
        }
        
        if (Rocket.hasPart('commandModule')) {
            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.arc(centerX, y - 20, 15, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    
    showMenu() {
        this.currentScreen = 'menu';
        document.getElementById('menu-screen').classList.remove('hidden');
        document.getElementById('vab-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'none';
        document.getElementById('hud-top').style.display = 'none';
        document.getElementById('controls-panel').style.display = 'none';
    },
    
    showVAB() {
        this.currentScreen = 'vab';
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('vab-screen').style.display = 'flex';
        document.getElementById('hud').style.display = 'none';
        document.getElementById('hud-top').style.display = 'none';
        document.getElementById('controls-panel').style.display = 'none';
        
        Rocket.reset();
        this.updateVABStats();
        this.drawRocketPreview();
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
    
    updateHUD(rocket, nearestBody) {
        if (this.currentScreen !== 'game') return;
        
        document.getElementById('hud-alt').textContent = Math.round(rocket.altitude).toLocaleString();
        
        const velEl = document.getElementById('hud-vel');
        velEl.textContent = Math.round(rocket.velocity).toLocaleString();
        velEl.className = 'hud-value' + (rocket.velocity > 1000 ? ' danger' : rocket.velocity > 500 ? ' warning' : '');
        
        const prograde = Math.atan2(rocket.vy, rocket.vx) * 180 / Math.PI;
        document.getElementById('hud-prograde').textContent = Math.round(prograde) + '°';
        
        const throttleEl = document.getElementById('hud-throttle');
        throttleEl.textContent = Math.round(rocket.throttle * 100) + '%';
        throttleEl.className = 'hud-value' + (rocket.throttle > 0 ? '' : '');
        
        const fuelPercent = Rocket.fuel > 0 ? (Rocket.fuel / Rocket.maxFuel * 100) : 0;
        const fuelEl = document.getElementById('hud-fuel');
        fuelEl.textContent = Math.round(fuelPercent) + '%';
        fuelEl.className = 'hud-value' + (fuelPercent < 10 ? ' danger' : fuelPercent < 25 ? ' warning' : '');
        
        const stageInfo = Rocket.getStageInfo();
        if (stageInfo) {
            document.getElementById('hud-stage').textContent = `${stageInfo.current + 1}/${stageInfo.total}`;
        }
        
        if (nearestBody) {
            document.getElementById('hud-body').textContent = nearestBody.name;
            
            const orbit = rocket.getOrbitInfo();
            if (orbit) {
                document.getElementById('hud-apo').textContent = Math.round(orbit.apoapsis).toLocaleString();
                document.getElementById('hud-peri').textContent = Math.round(orbit.periapsis).toLocaleString();
                
                const period = 2 * Math.PI * Math.sqrt(Math.pow((orbit.apoapsis + orbit.periapsis) / 2 + nearestBody.radius, 3) / (Physics.G * nearestBody.mass));
                document.getElementById('hud-period').textContent = Math.round(period) + 's';
            }
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

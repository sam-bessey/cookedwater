const Input = {
    keys: {},
    mouse: { x: 0, y: 0, down: false },
    justPressed: {},
    scrollDelta: 0,
    
    init() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (!this.keys[key]) {
                this.justPressed[key] = true;
            }
            this.keys[key] = true;
            
            if (['w', 'a', 's', 'd', ' ', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
        });
        
        window.addEventListener('mouseup', (e) => {
            this.mouse.down = false;
        });
        
        window.addEventListener('wheel', (e) => {
            this.scrollDelta = e.deltaY;
        });
    },
    
    isJustPressed(key) {
        return this.justPressed[key.toLowerCase()] || false;
    },
    
    clearJustPressed() {
        this.justPressed = {};
        this.scrollDelta = 0;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Input;
}

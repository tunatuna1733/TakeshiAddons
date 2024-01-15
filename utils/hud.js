export class Hud {
    /**
     * Class for text hud.
     * @param {string} name 
     * @param {string} defaultText 
     * @param {HudManager} hudManager 
     * @param {any} data 
     */
    constructor(name, defaultText, hudManager, data) {
        this.name = name;
        this.defaultText = defaultText;
        this.hudManager = hudManager;
        this.data = data;
        this.currentText = new Text(defaultText).setShadow(true);
        this.editBox = new Rectangle(0x9696964d, 0, 0, 0, 0);
        register('dragged', (dx, dy) => {
            if (!this.hudManager.isEditing) return;
            if (hudManager.selectedHudName === this.name) {
                const [current_x, current_y] = this.getCoords();
                this.setCoords(current_x + dx, current_y + dy);
            }
        });
        register('scrolled', (x, y, d) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                const scale = this.getScale();
                if (d === 1 && scale < 10)
                    this.setScale(scale + 0.1);
                else if (scale > 0.5)
                    this.setScale(scale - 0.1);
            }
        });
        register('renderOverlay', () => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const scale = this.getScale();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            this.editBox.setX(current_x - 3).setY(current_y - 3).setWidth(width + 3).setHeight(height + 3).draw();
            this.currentText.setX(current_x).setY(current_y).setScale(scale).draw();
        });
        register('clicked', (x, y, b, isDown) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                if (isDown && hudManager.selectedHudName === '') {
                    hudManager.selectHud(this.name);
                } else {
                    hudManager.unselectHud();
                }
            }
            if (!isDown) {
                hudManager.unselectHud();
            }
        });
    }

    /**
     * Get hud coords.
     * @returns 
     */
    getCoords = () => {
        const x = this.data[this.name].x;
        const y = this.data[this.name].y;
        const width = Renderer.screen.getWidth();
        const height = Renderer.screen.getHeight();
        return [width * x, height * y];
    }

    /**
     * Set hud coords.
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    setCoords = (x, y) => {
        const width = Renderer.screen.getWidth();
        const height = Renderer.screen.getHeight();
        this.data[this.name].x = x / width;
        this.data[this.name].y = y / height;
        this.data.save();
        return;
    }

    /**
     * Set hud scale.
     * @returns {number} scale
     */
    getScale = () => {
        const scale = this.data[this.name].scale;
        return scale;
    }

    /**
     * Get hud scale.
     * @param {number} scale 
     * @returns 
     */
    setScale = (scale) => {
        this.data[this.name].scale = scale;
        this.data.save();
        return;
    }

    /**
     * Draw hud.
     * @param {string} text 
     * @param {boolean} skyblockOnly
     */
    draw = (text, skyblockOnly = true) => {
        if (!this.hudManager.isEditing) {
            if (skyblockOnly) {
                if (Server.getIP().includes('hypixel') && ChatLib.removeFormatting(Scoreboard.getTitle()).includes('SKYBLOCK')) {
                    const [x, y] = this.getCoords();
                    const scale = this.getScale();
                    this.currentText.setString(text).setX(x).setY(y).setScale(scale).draw();
                }
            } else {
                const [x, y] = this.getCoords();
                const scale = this.getScale();
                this.currentText.setString(text).setX(x).setY(y).setScale(scale).draw();
            }
        }
    }
}

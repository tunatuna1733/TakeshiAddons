export class ArmorHud {
    constructor(name, hudManager, data) {
        this.name = name;
        this.hudManager = hudManager;
        this.data = data;
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
            const scale = this.getScale();
            const width = 16 * scale;
            const height = 16 * 4 * scale;
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
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
            const width = 16 * scale;
            const height = 16 * 4 * scale;
            this.editBox.setX(current_x - 3).setY(current_y - 3).setWidth(width + 3).setHeight(height + 3).draw();
        });
        register('clicked', (x, y, b, isDown) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const scale = this.getScale();
            const width = 16 * scale;
            const height = 16 * 4 * scale;
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                if (isDown && hudManager.selectedHudName === '') {
                    hudManager.selectHud(this.name);
                } else {
                    hudManager.unselectHud();
                }
            }
        });
    }

    getCoords = () => {
        const x = this.data[this.name].x;
        const y = this.data[this.name].y;
        const width = Renderer.screen.getWidth();
        const height = Renderer.screen.getHeight();
        return [width * x, height * y];
    }

    setCoords = (x, y) => {
        const width = Renderer.screen.getWidth();
        const height = Renderer.screen.getHeight();
        this.data[this.name].x = x / width;
        this.data[this.name].y = y / height;
        this.data.save();
        return;
    }

    getScale = () => {
        const scale = this.data[this.name].scale;
        return scale;
    }

    setScale = (scale) => {
        this.data[this.name].scale = scale;
        this.data.save();
        return;
    }

    draw = (helmet, chestplate, leggings, boots) => {
        if (!this.hudManager.isEditing) {
            const [x, y] = this.getCoords();
            const scale = this.getScale();
            helmet?.draw(x, y, scale);
            chestplate?.draw(x, y + 16 * scale, scale);
            leggings?.draw(x, y + 16 * scale * 2, scale);
            boots?.draw(x, y + 16 * scale * 3, scale);
        }
    }
}

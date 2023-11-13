import { setRegisters } from "./register";

class HudManager {
    constructor() {
        this.gui = new Gui();
        this.isEditing = false;
        this.selectedHudName = '';
        this.gui.registerClosed(() => {
            this.isEditing = false;
            setRegisters();
        });
    }

    openGui = () => {
        this.gui.open();
        this.isEditing = true;
    }

    selectHud = (name) => {
        this.selectedHudName = name;
    }

    unselectHud = () => {
        this.selectedHudName = '';
    }
}

export default new HudManager();
import { BooleanProperty } from "../property";

export class BooleanComponent {
    /**
     * 
     * @param {number} width 
     * @param {BooleanProperty} property 
     */
    constructor(width, property) {
        this.width = width;
        this.property = property;
        this.nameWidth = width * 0.7;
    }
}
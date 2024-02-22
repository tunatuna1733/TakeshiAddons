import { Property } from "../property";

export class BaseComponent {
    /**
     * 
     * @param {number} width 
     * @param {Property} property 
     */
    constructor(width, property) {
        this.width = width;
        this.property = property;
    }


}
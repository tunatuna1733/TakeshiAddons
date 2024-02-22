import {
    ValueOutOfRangeError
} from './exception';
const Color = Java.type('java.awt.Color');

export class Property {
    /**
     * Base Class for properties
     * @param {any} propertyData 
     */
    constructor(propertyData) {
        this.propertyData = propertyData;
        this.attributes = this.propertyData.attributesExt;
        this.type = this.attributes.type.toString();
        this.name = this.attributes.name;
        this.description = this.attributes.description;
        this.category = this.attributes.category;
        this.subcategory = this.attributes.subcategory;
        this.hasDependents = this.propertyData.hasDependents;
        this.dependsOn = this.propertyData.dependsOn;
    }

    get name() {
        return this.name;
    }

    get description() {
        return this.description;
    }

    get category() {
        return this.category;
    }

    get subcategory() {
        return this.subcategory;
    }

    get hasDependents() {
        return this.hasDependents;
    }

    get dependsOn() {
        return this.dependsOn;
    }
}

export class BooleanProperty extends Property {
    constructor(propertyData) {
        super(propertyData);
    }

    /**
     * @returns {boolean}
     */
    get value() {
        return propertyData.getAsBoolean();
    }

    /**
     * Toggle value.
     */
    toggle = () => {
        this.propertyData.setValue(!this.propertyData.getAsBoolean());
    }
}

export class StringProperty extends Property {
    constructor(propertyData) {
        super(propertyData);
        this.placeholder = this.attributes.placeholder;
    }

    /**
     * @returns {string}
     */
    get value() {
        return propertyData.getValue();
    }

    /**
     * Set value.
     * @param {string} val 
     */
    set value(val) {
        this.propertyData.setValue(val);
    }
}

export class ColorProperty extends Property {
    constructor(propertyData) {
        super(propertyData);
        this.allowAlpha = this.attributes.allowAlpha;
    }

    /**
     * @returns {Color}
     */
    get value() {
        return propertyData.getValue();
    }

    /**
     * @param {Color} color 
     */
    set value(color) {
        this.propertyData.setValue(color);
    }
}

export class SelectorProperty extends Property {
    constructor(propertyData) {
        super(propertyData);
        this.options = this.attributes.options;
    }

    /**
     * @returns {number}
     */
    get value() {
        return propertyData.getValue();
    }

    /**
     * @returns {string[]}
     */
    get options() {
        return this.options;
    }

    get selectedOption() {
        return this.options[this.value];
    }

    /**
     * @param {number} num 
     */
    set value(num) {
        this.propertyData.setValue(num);
    }
}

export class SliderProperty extends Property {
    constructor(propertyData) {
        super(propertyData);
        this.min = this.attributes.min;
        this.max = this.attributes.max;
    }

    /**
     * @returns {number}
     */
    get value() {
        return propertyData.getValue();
    }

    /**
     * @param {number} num 
     */
    set value(num) {
        if (num > this.max || num < this.min) throw new ValueOutOfRangeError();
        this.propertyData.setValue(num);
    }
}

export class ButtonProperty extends Property {
    constructor(propertyData) {
        super(propertyData);
        this.placeholder = this.attributes.placeholder;
    }

}
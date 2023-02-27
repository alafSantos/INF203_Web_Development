"use strict";

export class Std {
    /**
     * 
     * @param {*} lastName 
     * @param {*} firstName 
     * @param {*} id 
     */
    constructor(lastName, firstName, id) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    /**
     * 
     * @returns a string of characters built from the properties of the object
     */
    toString() {
        return "student: " +
            this.lastName.toString() + ", " +
            this.firstName.toString() + ", " +
            this.id.toString();
    }
}

/**
 * class ForeignStud extending Std that also allows to give a nationality to a student, 
 * so the arguments of the constructor are lastName, firstName, id and nationality.
 */
export class ForeignStud extends Std {

    /**
     * 
     * @param {*} lastName 
     * @param {*} firstName 
     * @param {*} id 
     * @param {*} nationality 
     */
    constructor(lastName, firstName, id, nationality) {
        super(lastName, firstName, id);
        this.nationality = nationality;
    }

    /**
     * 
     * @returns a string of characters built from the properties of the object
     */
    toString() {
        return super.toString() + ", " + this.nationality.toString();
    }

}
"use strict";

export class Std {
    /**
     * 
     * @param {*} lastName 
     * @param {*} firstName 
     * @param {*} id 
     */
    constructor(lastName, firstName, id){
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    toString(){
        return "student: " + 
            this.lastName.toString() + ", " +
            this.firstName.toString() + ", " +
            this.id.toString();
    }
}

export class ForeignStud extends Std {

    constructor(lastName, firstName, id, nationality){
        super(lastName, firstName, id);
        this.nationality = nationality;
    }

    toString(){
        return super.toString() + ", " + this.nationality.toString();
    }

}
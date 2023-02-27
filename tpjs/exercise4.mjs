"use strict";

import { Std, ForeignStud } from "./exercise3.mjs";

export class Promotion {
    constructor() {
        this.students = [];
    }

    /**
     * adds a student to the promotion
     * @param {*} student 
     */
    add(student) {
        this.students.push(student);
    }

    /**
     * 
     * @returns the number of students in the promotion
     */
    size() {
        return this.students.length;
    }

    /**
     * 
     * @param {*} i 
     * @returns the i-th Std in the promotion in the order where it was added
     */
    get(i) {
        return this.students[i - 1];
    }

    /**
     * prints all students to the console, one per line
     * @returns the printed string
     */
    print() {
        let result = "";
        for (const student of this.students)
            result += student.print() + '\n';
        return result;
    }

    /**
     * serializes the promotion to JSON, 
     * in other words transforms a promotion object in a string of characters
     */
    write() {
        return JSON.stringify(this.students);
    }

    /**
     * it reads a JSON object and rebuilds a promotion
     * @param {*} str 
     */
    read(str) {
        this.students = [];
        for (const student of JSON.parse(str)) {
            if (student instanceof ForeignStud)
                this.students.push(Object.assign(new Std(), student));
            else
                this.students.push(Object.assign(new ForeignStud(), student));
        }
    }

    /**
     * it writes a promotion to a text file as a JSON object
     * @param {*} fileName 
     */
    saveToFile(fileName) {
        fs.writeFile(fileName, this.write(), function (err) {
            if (err)
                console.error(err);
            else
                console.log("File written successfully\n");
        });
    }

    /**
     * it recreates a promotion from what has been saved to a file
     * @param {*} fileName 
     */
    readFromFile(fileName) {
        var that = this;
        fs.readFile(fileName, function (err, buf) {
            if (err)
                console.error(err);
            else
                that.read(buf.toString());
        });
    }

}
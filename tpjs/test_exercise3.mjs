"use strict";

import {Std, ForeignStud} from "./exercise3.mjs";

var student = new Std("Dupond", "John", 1835);
console.log(student.toString());

var student2 = new ForeignStud("Doe", "John", "432", "American");
console.log(student2.toString());
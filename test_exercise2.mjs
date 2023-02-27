"use strict";

import {wcount} from "./exercise2.mjs";
import {WrdLst} from "./exercise2.mjs";

console.log(wcount("fish bowl fish bowl fish"))

let objt = new WrdLst("D B C C C B B B A A A D D");
console.log(objt.getWords());
console.log(objt.maxCountWord());
console.log(objt.minCountWord());

"use strict";

import {wcount} from "./exercise2.mjs";
import {WrdLst} from "./exercise2.mjs"

// console.log(wcount("fish bowl fish bowl fish"))

let objt = new WrdLst("D B C B B A A A D D D");
console.log(objt.maxCountWord());
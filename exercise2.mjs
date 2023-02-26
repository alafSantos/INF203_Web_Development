"use strict";

function numProps(obj) {
    let counter = 0;
    for (var c in obj)
        counter++;

    return counter;
}

export function wcount(str) {
    let word = str.toString().split(" ");
    let output = {};
    for (let i = 0; i < word.length; i++) {
        if (word[i] in output)
            continue;

        let counter = 0;
        for (let j = 0; j < word.length; j++) {
            if (word[j] == word[i])
                counter++;
        }
        output[word[i]] = counter;
    }
    return output;
}

export class WrdLst {
    constructor(str) {
        this.str = str;
    }

    getWords() {
        let str_temp = [];
        let words = this.str.toString().split(" ");
        for (let j = 0; j < words.length; j++) {
            str_temp.push(words[j]);
        }
        return str_temp.sort();
    }

    maxCountWord() {

        let words = wcount(this.str);
        let str_temp = [];
        let previous_value = 0;

        for (const property in words) {
            if (words[property] > previous_value && previous_value != 0) {
                str_temp[previous_value] = property;
                previous_value = words[property];
            }
            else if (words[property] === previous_value) {
                str_temp.push(property);
            }
            else if (previous_value == 0) {
                previous_value = words[property];
                str_temp.push(property);
            }
        }
        return str_temp.sort()[0];
    }

    minCountWord() {

    }

    getCount(word) {

    }

    applyWordFunc(f) {

    }
}

"use strict";

/**
 * For each word within a string, counts the number of occurrences of this word in this string
 * @param {*} str 
 * @returns an object whose properties are the words and the values of these properties are the occurrence numbers
 */
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
    /**
     * a constructor which takes as input a string and that returns a WrdLst object
     * @param {*} txt 
     */
    constructor(txt) {
        this.strs = txt;
        this.str_aux = this.strs.split(" ");
        this.words = this.str_aux.sort().filter((value, index) => this.str_aux.indexOf(value) === index);
    }

    /**
     * 
     * @returns an array of words present in the original text,
     * lexicographically sorted and without duplicates
     */
    getWords() {
        let str_temp = [];
        for (let j = 0; j < this.words.length; j++) {
            if (this.words[j] in this.words)
                continue;
            str_temp.push(this.words[j]);
        }
        return str_temp;
    }

    /**
     * 
     * @returns the word with the most occurrences, 
     * and if there are several words with the same number of occurences, 
     * returns the first of them in the lexicographically sorted list from getWords()
     */
    maxCountWord() {
        let words = wcount(this.strs);
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

    /**
     * 
     * @returns the word with the least number of occurrences, 
     * and if there are several words with the same number of occurences, 
     * returns the first of them in the lexicographically sorted list from getWords()
     */
    minCountWord() {
        let counter = Infinity;
        let result = null;
        for (let word of this.words) {
            const valueHere = this.getCount(word);
            if (valueHere < counter) {
                counter = valueHere;
                result = word;
            }
        }
        return result;
    }

    /**
     * 
     * @param {*} word 
     * @returns the number of occurrences for a given word. 
     */
    getCount(str) {
        let wordCounter = [];

        this.strs.split(" ").forEach(word => {
            wordCounter[word] = (wordCounter[word] || 0) + 1;
        });

        if (wordCounter[str] > 0)
            return wordCounter[str];
        else
            return 0;
    }

    /**
     * method to apply any function to each word in 
     * lexicographic order and to return an array of results
     * */
    applyWordFunc(f) {
        return this.words.map(f);
    }
}

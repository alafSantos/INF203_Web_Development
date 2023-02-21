"use strict";

export function wcount(str){
    let word = str.split(" ");
    let output = {};
    for(let i = 0; i < word.length; i++){
        if(word[i] in output)
            continue;
            
        let counter = 0;
        for(let j = 0; j < word.length; j++){
            if(word[j] == word[i])
                counter++;
        }
        output[word[i]] = counter;
    }
    return output;
}

export class WrdLst{
    constructor(str){
        this.str = str;
    }

    getWords(){

    }

    maxCountWord(){

    }

    minCountWord(){

    }

    getCount(word){

    }

    applyWordFunc(f){
        
    }
}
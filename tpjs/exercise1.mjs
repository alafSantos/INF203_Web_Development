"use strict";

// non recursive
export function fibonaIt(n) {
    if(n === 0){
        return 0;
    }
    else if(n < 2){
        return 1;
    }
    else{
        let sum = 0, previous = 0, now = 1;
        for(let i = 0; i < n - 1; i++){
            sum = previous + now;
            previous = now;
            now = sum;
        }
        return sum;
    }
}

// programmed recursively
export function fibRec(n) {
    if(n === 0){
        return 0;
    }
    else if(n < 2){
        return 1;
    }
    else{
        return fibRec(n - 1) + fibRec(n - 2);
    }
}

// use a loop
export function fibo_arr(t) {
    let temp = [];
    for(let i = 0; i < t.length; i++){
        temp[i] = fibRec(t[i]);
    }
    return temp;
}

// use of map
export function fibMap(t) {
    return t.map(x => fibRec(x));
}
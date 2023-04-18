"use strict";

function show(){
    let xhr = new XMLHttpRequest();
    let text = "../../" + "show"; // url_.toString();
    xhr.open("GET", text);
    xhr.onload = function(){
        let div = document.getElementById("MAINSHOW");
        div.textContent = this.response;
    }
    xhr.send();
}
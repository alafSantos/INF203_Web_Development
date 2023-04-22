"use strict";

function show() {
    let xhr = new XMLHttpRequest();
    let text = "../../Show";
    xhr.open("GET", text);
    xhr.onload = function () {
        let div = document.getElementById("MAINSHOW");
        div.innerHTML = "";
        div.textContent = this.response;
    }
    xhr.send();
}

function makeVisible(ID) {
    let element = document.getElementById(ID);
    element.style.visibility = "visible";
}

function show_add() {
    makeVisible("SENDADD");
    makeVisible("titleTF");
    makeVisible("colorTF");
    makeVisible("valueTF");
}

function show_remove() {
    makeVisible("DOREM");
    makeVisible("indexTF");
}

function getValue(ID) {
    let element = document.getElementById(ID);
    return element.value;
}

function simpleGET(request){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', request);
    xmlhttp.send();
    document.getElementById("MAINSHOW").innerHTML = "";
}

function sendAdd() {
    let request = "../../add?title=" + getValue("titleTF") + "&value=" + getValue("valueTF") + "&color=" + getValue("colorTF");
    simpleGET(request);
}

function remove() {
    let request = "../../remove?index=" + (new Number(getValue("indexTF"))).toString();
    simpleGET(request);
}

function clear() {
    let request = '../../clear';
    simpleGET(request);
}

function clear() {
    let request = '../../restore';
    simpleGET(request);
}


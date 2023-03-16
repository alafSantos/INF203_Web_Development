"use strict";

var slides;
var index = 0;

function loadSlides() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'slides.json');

    xhr.onload = function () {
        slides = JSON.parse(this.responseText);
    }
    xhr.send();
}

function play() {
    if (index == slides.slides.size) {
        index = 0;
    }

    let div = document.getElementById("TOP");
    let frame = document.createElement("iframe");

    frame.src = slides.slides[index].url;
    div.appendChild(frame);
    setTimeout(play(), 1000 * slides.slides[index++].time);
}

loadSlides();
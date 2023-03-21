"use strict";

var slides;
var index = 0;
var time_previous = 0;

function loadSlides() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'slides.json');

    xhr.onload = function () {
        slides = JSON.parse(this.responseText);
    }
    xhr.send();
}

loadSlides();

function play() {
    if (index == slides.slides.length) {
        index = 0;
        return;
    }

    let time_now = slides.slides[index].time;

    let div = document.getElementById("TOP");

    // empty the div
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    let frame = document.createElement("iframe");
    frame.style.width = "100%";
    frame.style.height = "500px";
    frame.style.overflow = "auto";

    frame.src = slides.slides[index++].url;
    div.appendChild(frame);


    let delta = time_now - time_previous;
    if (!delta) {
        delta = 2;
    }

    time_previous = time_now;
    setTimeout(play, 1000 * delta);
}

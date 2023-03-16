"use strict";

var slides;
var index = 0;
var pauseFlag = false;

function loadSlides() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'slides.json');

    xhr.onload = function () {
        slides = JSON.parse(this.responseText);
    }
    xhr.send();
}

function play() {
    if (!pauseFlag) {
        if (index == slides.slides.size) {
            index = 0;
        }

        let div = document.getElementById("TOP");
        let frame = document.createElement("iframe");

        frame.src = slides.slides[index].url;
        div.appendChild(frame);
        setTimeout(play(), 1000 * slides.slides[index++].time);
    }
}

function pause() {
    pauseFlag = !pauseFlag;
}

function next() {
    pauseFlag = false;
    if (index == slides.slides.size) {
        index = 0;
    }
    else {
        index++;
    }
    play();
}

function previous() {
    pauseFlag = false;
    if (index == 0) {
        index = slides.slides.size;
    }
    else {
        index--;
    }
    play();
}

loadSlides();
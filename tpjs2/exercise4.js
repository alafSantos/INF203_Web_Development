"use strict";

var slides;
var index = 0;
var pauseFlag = false;

function loadSlides() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'slides.json');

    xhr.onload = function () {
        slides = JSON.parse(this.responseText);
        console.log("slides:", slides)
    }
    xhr.send();
}

loadSlides();

function play() {
    if (index == slides.slides.length) {
        index = 0;
        console.log("slides ", slides.slides.length);
    }

    if(slides.slides[index].url.length == 0){
        console.log("index ", index);
        index++;
        return;
    }

    let div = document.getElementById("TOP");
    
    // empty the div
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }

    let frame = document.createElement("iframe");
    frame.style.width = "100%";
    frame.style.height = "500px";
    frame.style.overflow = "auto";

    frame.src = slides.slides[index++].url;
    div.appendChild(frame);
    setTimeout(play, 1000 * slides.slides[index].time);
}

function pause() {
    pauseFlag = !pauseFlag;
    console.log("pause state", pause);
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

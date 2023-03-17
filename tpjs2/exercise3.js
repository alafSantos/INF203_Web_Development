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

loadSlides();

function play() {
    if (index == slides.slides.length) {
        index = 0;
    }

    if(slides.slides[index].url.length == 0){
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

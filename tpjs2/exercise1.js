"use strict";

function loadDoc() {
    let textarea = document.getElementById("ta");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "text.txt");
    xhr.onload = function () {
        textarea.value = this.responseText;
    }
    xhr.send();
}

function loadDoc2() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "text.txt");
    xhr.onload = function () {
        const text = this.responseText.split("<br/>");
        const div = document.getElementById("ta2");

        for (let i = 0; i < text.length; i++) {
            let color = "#";
            let hex = "0123456789ABCDEF";

            for (let i = 0; i < 6; i++) {
                let index = Math.floor(Math.random() * 16);
                color += hex[index];
            }

            let p = document.createElement("p");
            p.style.color = color;
            p.textContent = text[i];
            div.appendChild(p);
        }
    }
    xhr.send();
}

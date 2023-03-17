"use strict";

function send() {
    let xhr = new XMLHttpRequest();
    let text = "chat.php?phrase=" + document.getElementById("textedit").value;
    xhr.open("GET", text);
    xhr.onload = function () { }
    xhr.send();
}

function loop() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "chatlog.txt");
    xhr.onload = function () {
        let div = document.getElementById("ta");

        // empty the div
        while(div.firstChild) {
            div.removeChild(div.firstChild);
        }

        let text = this.responseText.split("\n");
        console.log(text)
        const numberOfMessages = 10;
        const len = text.length - 1;

        for (let i = len; i >= len - numberOfMessages; i--) {
            let p = document.createElement('p');
            p.textContent = text[i];
            div.appendChild(p);
        }
    }
    xhr.send();
    setTimeout(loop, 1000);
}

loop();
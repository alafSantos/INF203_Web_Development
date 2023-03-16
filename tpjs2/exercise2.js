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
        div.innerHTML = "";
        let text = this.responseText.split('\n').pop();

        const numberOfMessages = 10;
        const len = text.length;

        for (let i = len; i > len - numberOfMessages; i--) {
            let p = document.createElement('p');
            let textnode = document.createTextNode(text[i]);
            p.appendChild(textnode);
            div.appendChild(p);
        }
    }
    xhr.send();
    setTimeout(loop(), 1000);
}

loop();
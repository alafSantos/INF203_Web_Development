function loadDoc() {
    let ta = document.getElementById("ta");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "text.txt");
    xhr.onload = function () {
        ta.value = this.responseText;
    }
    xhr.send();
}

function loadDoc2() {
    var obj = document.createElement("p");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "text.txt");
    xhr.onload = function () {
        obj.textContent = this.responseText;
        var div = document.getElementById("ta2");
        div.appendChild(obj);
    }
    xhr.send();
}
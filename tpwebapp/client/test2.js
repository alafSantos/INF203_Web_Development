"use strict";

// const local = "http://localhost:8000";
const local = "../..";

function show() {
    let xhr = new XMLHttpRequest();
    let text = `${local}/Show`;
    xhr.open("GET", text);
    xhr.onload = function () {
        let div = document.getElementById("MAINSHOW");
        div.innerHTML = "";
        div.textContent = this.responseText;
    }
    xhr.send();
}

function showPieChart() {
    let xhr = new XMLHttpRequest();
    let text = `${local}/Chart`;
    xhr.open("GET", text);
    xhr.onload = function () {
        let div = document.getElementById("MAINSHOW");
        div.innerHTML = this.responseText;
    }
    xhr.send();
}

function showLocalPieChart() {
    function calculateCoordinates(anglePercent) {
        return [Math.cos(2 * Math.PI * anglePercent), Math.sin(2 * Math.PI * anglePercent)];
    }

    const chartContainer = document.getElementById("MAINSHOW");
    chartContainer.innerHTML = "";

    const request = new XMLHttpRequest();
    request.open("GET", `${local}/Show`);

    request.onload = function () {
        const sliceData = JSON.parse(request.responseText);
        const chartSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        chartSVG.setAttribute("viewBox", "-1 -1 2 2");
        chartSVG.setAttribute("width", 480);

        let totalValue = 0;
        for (let data of sliceData) {
            totalValue += parseFloat(data.value);
        }

        let cummulativeValue = 0;
        if (sliceData.length) {
            for (let slice of sliceData) {
                const percentValue = parseFloat(slice.value) / totalValue;
                const [xStart, yStart] = calculateCoordinates(cummulativeValue);
                cummulativeValue += percentValue;
                const [xEnd, yEnd] = calculateCoordinates(cummulativeValue);

                let largeArcFlag = percentValue > 0.5 ? 1 : 0;
                if (percentValue > 0.5) {
                    largeArcFlag = 1;
                }

                const pathData = [
                    `M ${xStart} ${yStart}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${xEnd} ${yEnd}`,
                    `L 0 0`,
                ].join(" ");

                const slicePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                slicePath.setAttribute("d", pathData);
                slicePath.setAttribute("fill", slice.color);
                chartSVG.appendChild(slicePath);
            }
        }
        chartContainer.appendChild(chartSVG);
    };
    request.send();
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

function simpleGET(request) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', request);
    xmlhttp.send();
    document.getElementById("MAINSHOW").innerHTML = "";
}

function sendAdd() {
    let request = `${local}/add?title=${getValue("titleTF")}&value=${getValue("valueTF")}&color=${getValue("colorTF")}`;
    simpleGET(request);
}

function removing() {
    let request = `${local}/remove?index=${(new Number(getValue("indexTF"))).toString()}`;
    simpleGET(request);
}

function cleaning() {
    let request = `${local}/clear`;
    simpleGET(request);
}

function restoring() {
    let request = `${local}/restore`;
    simpleGET(request);
}


"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import { extname, join } from "node:path";
import { createReadStream, statSync } from "node:fs";
import fs from 'fs';

const port = argv[2] || 8000;

function createPage(message) {
  const html =
    `<!DOCTYPE html>
    <html lang="en">
    <head></head>
        <body>
          ${message}
        </body>
      </html>
    `;
  return html;
}

// process requests
function webserver(request, response) {
  const { url, method } = request;
  const params = new URL(url, `http://localhost:${port}`).searchParams;
  const database_name = "storage.json";

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // process GET requests to /files
  if (method === "GET" && (url.startsWith("/files") || url.startsWith("/Show"))) {
    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".mjs": "application/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".json": "application/json",
      ".svg": "image/svg+xml",
    };

    if (url.includes("..")) {
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.writeHead(403);
      response.end("Forbidden URL.");
    }
    else {
      const show = url.startsWith("/Show");

      if (show) {
        if (!fs.existsSync(database_name)) {
          response.writeHeader(404);
          response.end()
          return;
        }
      }
      
      // remove "/files/" prefix from URL
      let path = url.slice(7);
      // construct file path
      let filePath = show ? database_name : join(".", path);

      try {
        // check if file exists and is a file (not a directory)
        let fileStats = statSync(filePath);

        if (fileStats.isFile()) {
          // get file extension to determine MIME type
          let fileExt = show ? null : extname(filePath);
          let mimeType = show ? mimeTypes[".json"] : mimeTypes[fileExt];

          // set response headers
          response.setHeader("Content-Type", mimeType);
          response.writeHead(200);
          if (show || fileExt == ".json") {
            response.end(JSON.stringify(JSON.parse(fs.readFileSync(filePath, 'utf8'))));
          }
          else {
            // stream file contents to response
            let fileStream = createReadStream(filePath);
            fileStream.pipe(response);
          }
          return;
        }
      } catch (error) {
        // file doesn't exist or isn't a file
        console.error(error);
      }
    }
    // return 404 error if file not found or isn't a file
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.writeHead(404);
    response.end("File not found or is a directory.");
  }
  // process GET requests to /add
  else if (method === "GET" && url.startsWith("/add")) {
    var json = JSON.parse(fs.readFileSync(database_name, 'utf8'));
    let jsonObj = {
      title: unescape(params.get("title")),
      color: unescape(params.get("color")),
      value: parseInt(unescape(params.get("value")))
    };
    json.push(jsonObj);
    let json_str = JSON.stringify(json);
    fs.writeFileSync(database_name, json_str);
    response.writeHeader(200);
    response.end(json_str);
  }
  // process GET requests to /remove
  else if (method === "GET" && url.startsWith("/remove")) {
    let json = JSON.parse(fs.readFileSync(database_name, 'utf8'));
    json.splice(unescape(params.get("index")), 1);
    let json_str = JSON.stringify(json);
    fs.writeFileSync(database_name, json_str);
    response.writeHeader(200);
    response.end(json_str);
  }
  // process GET requests to /clear
  else if (method === "GET" && url == "/clear") {
    fs.writeFileSync(database_name, `[{"title": "empty", "color": "red", "value": 1}]`);
    let json = JSON.parse(fs.readFileSync(database_name, 'utf8'));
    let json_str = JSON.stringify(json);
    response.writeHeader(200)
    response.end(json_str);
  }
  // process GET requests to /restore
  else if (method === "GET" && url == "/restore") {
    let newJSON = `[{"title": "foo", "color": "red", "value": 20}, {"title": "bar", "color": "ivory", "value": 100}, {"title": "empty", "color": "red", "value": 1}]`;
    fs.writeFileSync(database_name, newJSON);
    let json = JSON.parse(fs.readFileSync(database_name, 'utf8'));
    let json_str = JSON.stringify(json);
    response.writeHeader(200);
    response.end(json_str);
  }
  // process GET requests to /Chart
  else if (method === "GET" && url == "/Chart") {
    function calculateCoordinates(percentValue) {
      const xValue = Math.cos(2 * Math.PI * percentValue);
      const yValue = Math.sin(2 * Math.PI * percentValue);
      return [xValue, yValue];
    }

    const sliceData = JSON.parse(fs.readFileSync("storage.json"));
    let svgString = '<svg id="piechart" viewBox="-1 -1 2 2" height=500 width=500>';
    let totalValue = 0;

    for (let slice of sliceData) {
      totalValue += Number(slice.amount);
    }

    let cumulativeValue = 0;
    for (let slice of sliceData) {
      let percentValue = slice.amount / totalValue;
      let [xStart, yStart] = calculateCoordinates(cumulativeValue);
      cumulativeValue += percentValue;
      let [xEnd, yEnd] = calculateCoordinates(cumulativeValue);

      let largeArcFlagValue = percentValue > .5 ? 1 : 0;
      let pathDataString = [
        `M ${xStart} ${yStart}`,
        `A 1 1 0 ${largeArcFlagValue} 1 ${xEnd} ${yEnd}`,
        `L 0 0`,
      ].join(' ');

      svgString += `<path d="${pathDataString}" fill="${slice.color}"></path>`;
    }
    svgString += '</svg>';
    response.writeHeader(200, { "Content-Type": "image/svg+xml" });
    response.write(svgString);
    response.end("SVG sent");
  }
  // process GET requests to /end
  else if (method === "GET" && url == "/stop") {
    // generate HTML response
    let message = "The server will stop now.";
    const html = createPage(message);

    // send response 
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.writeHead(200);
    response.end(html);
    process.exit(0);
  }
  // anything else
  else {
    // generate HTML response
    let message = "Server works.";
    const html = createPage(message);

    // send response 
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.writeHead(200);
    response.end(html);
  }
}

// server instanciation
const server = createServer(webserver);

// server starting
server.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on port ${port}`);
  }
});

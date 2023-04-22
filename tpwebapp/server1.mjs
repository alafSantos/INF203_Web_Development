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

  // response.setHeader('Access-Control-Allow-Origin', '*');
  // response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
      console.log("url", url)
      const show = url.startsWith("/Show");

      if (show) {
        if (!fs.existsSync("storage.json")) {
          response.writeHeader(404);
          response.end()
        }
        return;
      }

      // remove "/files/" prefix from URL
      let path = url.slice(7);
      // construct file path
      let filePath = show ? "storage.json" : join(".", path);

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
    var json = JSON.parse(fs.readFileSync("storage.json", 'utf8'));
    let jsonObj = {
      title: unescape(params.get("title")),
      color: unescape(params.get("color")),
      value: parseInt(unescape(params.get("value")))
    };
    json.push(jsonObj);
    fs.writeFileSync("storage.json", JSON.stringify(json));
    response.writeHeader(200);
    response.end(JSON.stringify(json));
  }
  // process GET requests to /remove
  else if (method === "GET" && url == "/remove") {

  }
  // process GET requests to /Chart
  else if (method === "GET" && url == "/chart") {

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

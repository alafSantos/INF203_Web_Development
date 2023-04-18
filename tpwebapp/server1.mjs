"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import { extname, join } from "node:path";
import { createReadStream, statSync } from "node:fs";

const users = new Set();

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

  // process GET requests to /files
  if (method === "GET" && url.startsWith("/files")) {
    if (url.includes("..")) {
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.writeHead(403);
      response.end("Forbidden URL.");
    }
    else {
      const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
      };

      // remove "/files/" prefix from URL
      let path = url.slice(7);
      // construct file path
      let filePath = join(".", path);

      try {
        // check if file exists and is a file (not a directory)
        let fileStats = statSync(filePath);
        if (fileStats.isFile()) {
          // get file extension to determine MIME type
          let fileExt = extname(filePath);
          let mimeType = mimeTypes[fileExt];

          // set response headers
          response.setHeader("Content-Type", mimeType);
          response.setHeader("Content-Length", fileStats.size);

          // stream file contents to response
          let fileStream = createReadStream(filePath);
          fileStream.pipe(response);

          return;
        }
      } catch (error) {
        // file doesn't exist or isn't a file
        console.error(error);
      }
      // return 404 error if file not found or isn't a file
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.writeHead(404);
      response.end("File not found or is a directory.");
    }
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
let port = argv[2] || 8000;
server.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on port ${port}`);
  }
});

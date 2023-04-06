"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import { readFile } from "node:fs";
import { parse, unescape } from "node:querystring";

const users = new Set();

// process requests
function webserver(request, response) {
    const { url, method } = request;

    // process GET requests to /bonjour
    if (method === "GET" && url.startsWith("/bonjour")) {
        const query = url.split("?")[1];
        const { visiteur } = parse(query);
        const visitorName = unescape(visiteur);

        // generate HTML response
        const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bonjour</title>
        </head>
        <body>
          <h1>Bonjour ${visitorName}!</h1>
        </body>
      </html>
    `;

        // send response
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html);
    }
    // process GET requests to /bonsoir
    else if (method === "GET" && url.startsWith("/bonsoir")) {
        const query = url.split("?")[1];
        const { nom } = parse(query);
        const userName = unescape(nom);

        // add user to set
        users.add(userName);

        // generate list of users
        let userList = Array.from(users).join(", ");
        if (userList.length === 0) {
            userList = "none";
        }

        // generate HTML response
        const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bonsoir</title>
        </head>
        <body>
          <h1>Bonsoir ${userName}!</h1>
          <p>the following users have already visited this page: ${userList}.</p>
        </body>
      </html>
    `;

        // send response
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html);
    }
    // serve files
    else if (method === "GET" && url.startsWith("/files")) {
        const fileName = url.slice(7);
        const filePath = `./${fileName}`;

        // prevent serving files from parent directories
        if (fileName.includes("..")) {
            response.statusCode = 404;
            response.end();
            return;
        }

        // read file
        readFile(filePath, (err, data) => {
            if (err) {
                response.statusCode = 404;
                response.end();
                return;
            }

            // set MIME type based on file extension
            let mimeType = "";
            if (fileName.endsWith(".html")) {
                mimeType = "text/html";
            } else if (fileName.endsWith(".css")) {
                mimeType = "text/css";
            } else if (fileName.endsWith(".js")) {
                mimeType = "application/javascript";
            } else if (fileName.endsWith(".png")) {
                mimeType = "image/png";
            }

            // send response
            response.setHeader("Content-Type", mimeType);
            response.end(data);
        });
    }
    // handle other requests
    else if (url == "/end") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    } else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server works.</body></html>");
    }
}

// server instanciation
const server = createServer(webserver);

// server starting
let port = argv[2] || 8000;
server.listen(port, (err) => { if (err) console.error(err); });
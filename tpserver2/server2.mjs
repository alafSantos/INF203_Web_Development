"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import morgan from "morgan";
import pkg from "express";
import fs from 'fs';

const app = pkg();
app.use(morgan('tiny'));

const port = argv[2] || 8000;
let dbData = {};

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
    function loadDB() {
        try {
            const rawData = fs.readFileSync('db.json');
            dbData = JSON.parse(rawData);
            console.log('db.json loaded');
        } catch (err) {
            console.error(`Failed to load db.json: ${err}`);
        }
    }
    const { url, method } = request;
    const params = new URL(url, `http://localhost:${port}`).searchParams;
    morgan(url);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // process GET requests to /reload
    if (method === "GET" && url == "/reload") {
        loadDB();
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.writeHead(200);
        response.end("db.json reloaded");
    }
    // process GET requests to /exit
    else if (method === "GET" && url == "/exit") {
        // generate HTML response
        let message = "The server will stop now.";
        const html = createPage(message);

        // send response 
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.writeHead(200);
        response.end(html);
        process.exit(0);
    }
    else if (method == "GET" && url == "/papers") {
        loadDB();
        let number = dbData.length + "";
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.writeHead(200);
        response.end(number);
    }
    else if (method == "GET" && url.startsWith("/byauthor")) {
        const authorName = url.slice(11); // remove '/byauthor/'
        loadDB();
        const count = dbData.filter(paper => paper.authors.some(author => author.toLowerCase().includes(authorName.toLowerCase()))).length + "";
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.writeHead(200);
        response.end(count);

    }
    // anything else
    else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Hi</body></html>");
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
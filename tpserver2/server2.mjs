"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import morgan from "morgan";
import pkg from "express";
import express from 'express';
import fs from 'fs';

const app = pkg();
app.use(morgan('tiny')); // logging
app.use(express.json()); // express middleware

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
    const database_name = "db.json";
    function loadDB() {
        try {
            const rawData = fs.readFileSync(database_name);
            dbData = JSON.parse(rawData);
        } catch (err) {
            console.error(`Failed to load db.json: ${err}`);
        }
    }
    const { url, method } = request;
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
        loadDB();
        const authorName = url.slice(11); // remove '/byauthor/'
        const count = dbData.filter(paper => paper.authors.some(author => author.toLowerCase().includes(authorName.toLowerCase()))).length + "";
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.writeHead(200);
        response.end(count);

    }
    else if (method == "GET" && url.startsWith("/descriptors")) {
        loadDB();
        const authorName = url.slice(13); // remove '/descriptors/'
        const papers = dbData.filter(paper => paper.authors.some(author => author.toLowerCase().includes(authorName.toLowerCase())));
        const descriptors = papers.map(paper => {
            return {
                key: paper.key,
                title: paper.title,
                journal: paper.journal,
                year: paper.year,
                month: paper.month,
                keywords: paper.keywords,
                lang: paper.lang,
                authors: paper.authors,
                category: paper.category,
                state: paper.state,
                dept: paper.dept,
                group: paper.group
            };
        });
        const json = JSON.stringify(descriptors);
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.writeHead(200);
        response.end(json);

    }
    else if (method == "GET" && url.startsWith("/titlelist")) {
        loadDB();
        const authorName = url.slice(11).toLowerCase(); // remove '/titlelist/' and convert to lowercase
        const papers = dbData.filter(paper => paper.authors.some(author => author.toLowerCase().includes(authorName)));
        const titles = papers.map(paper => paper.title);
        const json = JSON.stringify(titles);
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.writeHead(200);
        response.end(json);
    }
    else if (method == "GET" && url.startsWith("/publication")) {
        loadDB();
        const key = url.slice(13); // remove '/publication/'
        const publication = dbData.find(paper => paper.key === key);

        if (publication) {
            const descriptor = {
                key: publication.key,
                title: publication.title,
                journal: publication.journal,
                year: publication.year,
                month: publication.month,
                keywords: publication.keywords,
                lang: publication.lang,
                authors: publication.authors,
                category: publication.category,
                state: publication.state,
                dept: publication.dept,
                group: publication.group
            };

            const json = JSON.stringify(descriptor);
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.writeHead(200);
            response.end(json);

        } else {
            // if publication not found, send a 404 error response
            response.writeHead(404);
            response.end("Publication not found");
        }
    }
    else if (method == "DELETE" && url.startsWith("/publication")) {
        loadDB();
        const key = url.slice(13); // remove '/publication/'
        const publication = dbData.findIndex(paper => paper.key === key);

        if (publication >= 0) {
            dbData.splice(publication, 1);
            let json_str = JSON.stringify(dbData);
            fs.writeFileSync(database_name, json_str);
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.writeHeader(200);
            response.end(json_str);

        } else {
            // if publication not found, send a 404 error response
            response.writeHead(404);
            response.end("Publication not found");
        }
    }
    else if (method == "POST" && url == "/publication") {
        loadDB();

        const body = { "key": "imaginary", "title": "fun", "journal": "pifpoche", "year": "1960", "authors": ["dufourd"] };
        dbData.push(body);

        let json_str = JSON.stringify(dbData);
        fs.writeFileSync(database_name, json_str);
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.writeHeader(200);
        response.end(json_str);
    }
    else if (method == "PUT" && url.startsWith("/publication")) {
        loadDB();

        dbData.splice(dbData.findIndex(entry => entry.key === "imaginary"), 1);
        const body = { "key": "imaginary", "title": "morefun", "journal": "tintin", "year": "1960", "authors": ["dufourd"] };
        dbData.push(body);

        let json_str = JSON.stringify(dbData);
        fs.writeFileSync(database_name, json_str);
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.writeHeader(200);
        response.end(json_str);
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
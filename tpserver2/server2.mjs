"use strict";

import { argv } from "node:process";
import morgan from "morgan";
import express from "express";
import fs from 'fs';

let dbData = {};
const database_name = "db.json";
const port = argv[2] || 8000;
const app = express();

app.use(morgan('tiny')); // logging
app.use(express.json()); // express middleware

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

function loadDB() {
    try {
        const rawData = fs.readFileSync(database_name);
        dbData = JSON.parse(rawData);
    } catch (err) {
        console.error(`Failed to load db.json: ${err}`);
    }
}

// process GET requests to /exit
app.get('/exit', function (req, response) {
    // generate HTML response
    let message = "The server will stop now.";
    const html = createPage(message);

    // send response 
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.writeHead(200);
    response.end(html);
    process.exit(0);
});

//process GET requests to /reload
app.get('/reload', (req, response) => {
    loadDB();
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.writeHead(200);
    response.end("db.json reloaded");
});

// process GET requests to /papers
app.get('/papers', (req, response) => {
    loadDB();
    let number = dbData.length + "";
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.writeHead(200);
    response.end(number);
});

// process GET requests to /byauthor
app.get('/byauthor/:name', (req, response) => {
    loadDB();
    const authorName = req.params.name; // remove '/byauthor/'
    const count = dbData.filter(paper => paper.authors.some(author => author.toLowerCase().includes(authorName.toLowerCase()))).length + "";
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.writeHead(200);
    response.end(count);
});

// process GET requests to /descriptors
app.get('/descriptors/:name', (req, response) => {
    loadDB();
    const authorName = req.params.name;
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
})

// process GET requests to /titlelist
app.get('/titlelist/:name', (req, response) => {
    loadDB();
    const authorName = req.params.name.toLowerCase();
    const papers = dbData.filter(paper => paper.authors.some(author => author.toLowerCase().includes(authorName)));
    const titles = papers.map(paper => paper.title);
    const json = JSON.stringify(titles);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.writeHead(200);
    response.end(json);
})

// process GET requests to /publication
app.get('/publication/:key', (req, response) => {
    loadDB();
    const key = req.params.key;
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
})

// process DELETE requests to /publication
app.delete('/publication/:key', (req, response) => {
    loadDB();
    const key = req.params.key;
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
})

// process POST requests to /publication
app.post('/publication', (req, response) => {
    let descriptor_to_add = req.body;

    if (Object.keys(descriptor_to_add).length !== 0) {
        dbData.push(descriptor_to_add);
        let json_str = JSON.stringify(dbData);
        fs.writeFileSync(database_name, json_str);
        response.send("Object added");
    }
    else {
        response.status(403).send("Object already exist");
    }
})

// process PUT requests to /publication
app.put('/publication/:key', (req, res) => {
    let key = req.params.key;
    let new_descriptor = req.body;

    let descriptor_to_modify_couple = { "descriptor": {}, "index": -1 };

    dbData.forEach((obj, index) => {
        if (obj.key == key) {
            descriptor_to_modify_couple = { "descriptor": obj, "index": index };
        }
    });

    let descriptor_to_modify = descriptor_to_modify_couple.descriptor

    if (Object.keys(descriptor_to_modify).length !== 0) {
        let new_descriptor_keys = Object.keys(new_descriptor)

        new_descriptor_keys.forEach(prop => {
            if (descriptor_to_modify.hasOwnProperty(prop) && req.body.hasOwnProperty(prop)) {
                descriptor_to_modify[prop] = new_descriptor[prop]
            }
        });
        let json_str = JSON.stringify(dbData);
        fs.writeFileSync(database_name, json_str);

        res.send("Object modified successfully!")
    }
    else {
        res.status(500).send("Internal server error");
    }
})

// anything else
app.get('/', (req, response) => {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("<!doctype html><html><body>Hi</body></html>");
});

// server starting
app.listen(port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running on port ${port}`);
    }
});
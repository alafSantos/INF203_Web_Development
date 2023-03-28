"use strict";

import { createServer } from "http";
import { argv } from 'node:process';

// process requests
function webserver(request, response) {
    console.log(request.url);

    response.setHeader("Content-Type", "text/html; charset=utf-8");
    if (request.url == "/end") {
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    }
    else {
        response.end("<!doctype html><html><body>Server works.</body></html>");
    }
}

// server instanciation
const server = createServer(webserver);

// server starting
let port = argv[2];
server.listen(port, (err) => { });
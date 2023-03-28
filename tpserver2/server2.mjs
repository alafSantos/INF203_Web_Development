"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import morgan from "morgan";
import pkg  from "express";

const app = pkg();
app.use(morgan('tiny'));

// process requests
function webserver(request, response) {
    let url = request.url;
    morgan(url);

    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("<!doctype html><html><body>Hi</body></html>");
}

// server instanciation
const server = createServer(webserver);

// server starting
let port = argv[2];
server.listen(port, (err) => { });
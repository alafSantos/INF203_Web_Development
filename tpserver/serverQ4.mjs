"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import { readFile } from "node:fs";
import { join } from "node:path";
import { parse } from "node:querystring";

// process requests
function webserver(request, response) {
    let url = request.url;

    if (url.startsWith("/bonjour")) {
        let params = parse(url.substring(url.indexOf("?") + 1));
        let visitor = params.visiteur;
        let html = `<!doctype html><html><body>bonjour ${unescape(visitor)}</body></html>`;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html);
    } else if (url.startsWith("/files")) {
        let filepath = join(".", url.replace("/files/", ""));
        if (!filepath.startsWith(".") && !filepath.includes("..")) {
            readFile(filepath, (err, data) => {
                if (err) {
                    response.statusCode = 404;
                    response.end();
                } else {
                    let extension = filepath.split(".").pop();
                    let contentType = "";
                    switch (extension) {
                        case "html":
                            contentType = "text/html; charset=utf-8";
                            break;
                        case "css":
                            contentType = "text/css; charset=utf-8";
                            break;
                        case "js":
                            contentType = "text/javascript; charset=utf-8";
                            break;
                        case "png":
                            contentType = "image/png";
                            break;
                        case "jpg":
                        case "jpeg":
                            contentType = "image/jpeg";
                            break;
                        case "gif":
                            contentType = "image/gif";
                            break;
                        default:
                            contentType = "application/octet-stream";
                    }
                    response.setHeader("Content-Type", contentType);
                    response.end(data);
                }
            });
        } else {
            response.statusCode = 403;
            response.end();
        }
    } else if (url == "/end") {
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

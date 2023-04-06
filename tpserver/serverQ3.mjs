"use strict";

import { createServer } from "http";
import { argv } from "node:process";
import { createReadStream, statSync } from "node:fs";
import { extname, join } from "node:path";

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
};

function webserver(request, response) {
    let url = request.url;

    if (url.startsWith("/files/") && !url.includes("..")) {
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
                let mimeType = mimeTypes[fileExt] || "application/octet-stream";

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
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("File not found or is a directory.");
    } else if (url == "/end") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    } else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server works.</body></html>");
    }
}

const server = createServer(webserver);

let port = argv[2] || 8000;
server.listen(port, (err) => { if (err) console.error(err); });

import http from "node:http";

const host = "localhost";
const port = 8000;

// question 1.1
// function requestListener(_request, response) {
//   response.writeHead(200);
//   response.end("<html><h1>My first server!<h1></html>");
// }


// question 1.2
// function requestListener(_request, response) {
        //  response.setHeader("Content-Type", "application/json");
        //  response.end(JSON.stringify({ message: "I'm OK" }));
// }


// question 1.3
import fs from "node:fs/promises";
import internal from "node:stream";

// function requestListener(_request, response) {
//   fs.readFile("index.html", "utf8")
    // .then((contents) => {
    //   response.setHeader("Content-Type", "text/html");
    //   response.writeHead(200);
    //   return response.end(contents);
    // })
    // .catch((error) => {
        // console.error(error);
        // response.writeHead(500);
        // return response.end("internal server Error");
    // });
// }


// question 1.4
//async function requestListener(_request, response) {
  // try {
    // const contents = await fs.readFile("index.html", "utf8");
    // response.setHeader("Content-Type", "text/html");
    // response.writeHead(200);
    // response.end(contents);
  // } catch (error) {
    // console.error(error);
    // response.writeHead(500); // Set HTTP status code to 500 (Internal Server Error)
    // response.end("Internal Server Error");
  // }
// }

// question 1.8(gestion manuelle des routes)
let nb = 1;
let valeur_random = [];

async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    try {
        const contents = await fs.readFile("index.html", "utf8");
        switch (request.url.split("/")[1]) {
            case "index.html":
                response.writeHead(200);
                return response.end(contents);
            case "":
                response.writeHead(200);
                return response.end(contents);
            case "random.html":
                for (let i=0;i<nb;i++){
                    valeur_random.push(Math.floor(100 * Math.random()));
                }
                response.writeHead(200);
                return response.end(`<html><p>${valeur_random}</p></html>`);
            case "random":
                response.writeHead(200);
                nb = request.url.split("/")[2];
                return response.end(`<html><p>${nb}</p></html>`);
            default:
                response.writeHead(404);
                return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
    }
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

console.log("NODE_ENV =", process.env.NODE_ENV);

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
async function requestListener(_request, response) {
  try {
    const contents = await fs.readFile("index.html", "utf8");
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    response.end(contents);
  } catch (error) {
    console.error(error);
    response.writeHead(500); // Set HTTP status code to 500 (Internal Server Error)
    response.end("Internal Server Error");
  }
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
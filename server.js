/*multiple variable declarations*/
const http = require("http"),
  fs = require("fs"),
  url = require("url");

//server creation with http module
http.createServer((request, response) => {
  let addr = request.url,
    /*q stores the parsed URL*/
    q = url.parse(addr, true),
    filePath = "";

  /*appendfile method of the fs module to add arguments */
  fs.appendFile("log.txt", "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n", (err) => {
    if (err) {                              /*\n for a line break*/
      console.log(err);
    } else {
      console.log("Added to log.");
    }
  });
  /*if-else to check the exact pathname of the URL*/
  if (q.pathname.includes("documentation")) {
    filePath = (__dirname + "/documentation.html");
  } else {
    filePath = "index.html";
  }

  /*grab the appropriate file from the server*/
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(data);
    response.end();

  });

}).listen(8080);
console.log("My test server is running on Port 8080.");
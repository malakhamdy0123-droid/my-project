const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/home") {
    res.end(JSON.stringify({
      message: "Welcome to Home Page"
    }));
  }

  else if (req.method === "GET" && req.url === "/user") {
    res.end(JSON.stringify({
      name: "Malak",
      message: "This is the User Page"
    }));
  }

  
  else if (req.method === "GET" && req.url === "/products") {  res.end(JSON.stringify({
      products: ["Laptop", "Phone", "Headphones"]
    }));
  }
else if (req.method === "POST" && req.url === "/data") {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const data = JSON.parse(body);

    res.end(JSON.stringify({
      message: "Data received and stored successfully",
      data: data
    }));
  
});
}
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({
      message: "Route Not Found"
    }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});



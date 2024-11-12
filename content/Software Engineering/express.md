---
title: Express.js
created: 2024-11-09
tags:
  - completed
publish: true
---
Express.js is a widely-used web application framework for [[nodejs|Node.js]], designed for building web applications and APIs. It simplifies the process of server-side development by providing a robust set of features that streamline routing, middleware integration, and templating.

## Example

```js
const express = require("express");
const app = express();
const port = 3000;

// basic route for the homepage
app.get("/", (req, res) => {
	res.send("Welcome to the User API!");
});

// routing parameters
app.get("/api/users/:id", (req, res) => {
	const userId = parseInt(req.params.id);
	res.send("Using routing parameters !");
});

// query strings
app.get("/api/users/search", (req, res) => {
	const { q } = req.query;
	res.send("Using query strings !");
});

app.get("*", (req, res) => {
	res.send("Page not found !")
});

// start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
```
---
title: EJS
created: 2024-11-12
tags:
  - completed
publish: true
---
The Embedded JavaScript (EJS) is a widely used template engine in web development. It enables developers to generate dynamic HTML content by embedding JavaScript code within HTML templates.

## Example usage

1. Install dependencies

```bash
npm i ejs express
```

2. Set up Express application

```js
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// serving static assets
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
	res.render("index", { message: "Hello, World!" });
});

// start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
```

3. Create an EJS Template (`views/index.ejs`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>EJS Example</title>
	<link rel="stylesheet" href="/css/app.css">
	<script src="/js/jquery.js"></script>
	<script src="/js/bootstrap.min.js"></script>
</head>
<body>
	<h1><%= message %></h1>
	<% if(message.length > 20) { %>
		<h2>Subtitle</h2>
	<% } %>
</body>
</html>
```

## Partials example

1. Create an EJS Template file (`views/partials/header.ejs`)
2. Include the partial on the main template

```html
<%- include("partials/header") %>
```
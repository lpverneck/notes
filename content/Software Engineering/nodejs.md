---
title: Node.js
created: 2024-11-09
tags:
  - completed
publish: true
---
Node.js is a [[javascript|JavaScript]] runtime used to execute code without a web browser. The node environment lets developers create web apps, servers, scripts and command line tools.

## Working with module export

```js title="File: math.js"
const add = (x, y) => x + y;
const multiply = (x, y) => x * y;
const PI = 3.14;

exports.add = add;
exports.multiply = multiply;
exports.PI = PI;
```

```js title="File: app.js"
// requiring a script
const { PI, multiply } = require("./math");

console.log(PI);

// requiring a folder is the same, but need an index.js file inside it
// requiring a package just use the package name as argument
```

## NPM

The __NPM__ (Node Package Manager) is the standard package manager for Node.js.

```bash
# initialize a node package
npm init

# install package
npm i <package_name>

# install dependencies from package.json file
npm i
```
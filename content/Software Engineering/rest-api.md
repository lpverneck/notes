---
title: REST API
created: 2024-11-12
tags:
  - completed
publish: true
---
__REST__ (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication model and uses standard HTTP methods to perform operations on resources.

__RESTful routes__ are essentially the endpoints defined in a __REST API__, allowing clients to interact with server resources. Each route typically combines a URL with an HTTP verb (such as `GET`, `POST`, `PUT`, `DELETE`) to specify the action to be performed. These routes correspond to __CRUD__ (Create, Read, Update, Delete) operations, which are fundamental to interacting with resources in a RESTful manner.

## RESTful routes example

```text
--------------------------------------------------------------------------
NAME        PATH             VERB        PURPOSE
--------------------------------------------------------------------------
Index      /cars             GET        Display all cars
New        /cars/new         GET        Form to create a new car
Create     /cars             POST       Creates a new car on the server
Show       /cars/{id}        GET        Details for one specific car
Edit       /cars/{id}/edit   GET        Form to edit one specific car
Update     /cars/{id}        PATCH      Updates specific car on the server
Destroy    /cars/{id}        DELETE     Deletes specific car on the server
--------------------------------------------------------------------------
```

## Back-end API implementation example

```js title="index.js"
const express = require("express");
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

app.use(methodOverride("_method"));

// serving static assets
app.use(express.static(path.join(__dirname, "/public")));

// middleware for parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up EJS engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// initializig mocked cars database
let car_db = [
    {
        id: uuid(),
        model: "Kicks",
        year: 2024,
        brand: "Nissan",
    },
    {
        id: uuid(),
        model: "Opala",
        year: 1979,
        brand: "Chevrolet",
    },
    {
        id: uuid(),
        model: "Fusca",
        year: 1993,
        brand: "Volkswagen",
    },
    {
        id: uuid(),
        model: "Marea",
        year: 2002,
        brand: "Fiat",
    },
    {
        id: uuid(),
        model: "Del Rey",
        year: 1986,
        brand: "Ford",
    },
];

// set up REST API (using cars as resource)
// 1. Index route
app.get("/cars", (req, res) => {
    res.render("cars/index", { cars: car_db });
});

// 2. New route
app.get("/cars/new", (req, res) => {
    res.render("cars/new");
});

// 3. Create route
app.post("/cars", (req, res) => {
    const { model, year, brand } = req.body;
    car_db.push({ model, year, brand, id: uuid() });
    res.redirect("/cars");
});

// 4. Show route
app.get("/cars/:id", (req, res) => {
    const { id } = req.params;
    const car = car_db.find(c => c.id === id);
    res.render("cars/show", { car });
});

// 5. Edit route
app.get("/cars/:id/edit", (req, res) => {
    const { id } = req.params;
    const car = car_db.find(c => c.id === id);
    res.render("cars/edit", { car });
});

// 6. Update route
app.patch("/cars/:id", (req, res) => {
    const { id } = req.params;
    const car = car_db.find(c => c.id === id);
    const newModel = req.body.model;
    const newBrand = req.body.brand;
    const newYear = req.body.year;
    car.model = newModel;
    car.brand = newBrand;
    car.year = newYear;
    res.redirect("/cars");
});

// 7. Destroy route
app.delete("/cars/:id", (req, res) => {
    const { id } = req.params;
    car_db = car_db.filter(c => c.id !== id);
    res.redirect("/cars");
});

// start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
```
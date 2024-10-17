# JavaScript

:track_next:

!!! info "Running JS from Script"
    1. Create a Javascript file **example.js**
    2. Add in the final body section on **index.html** file the line: `<script src="example.js"></script>`

## Basics

:track_next:

## Document Object Model (DOM)

The Document Object Model is a programming interface that represents the structure of HTML and XML documents in a hierarchical tree format. Each element in the document is represented as a node, allowing for dynamic manipulation of the document's content, structure, and style through programming languages, primarily JavaScript.

```js title="Selecting" linenums="1"
const item = document.getElementByID(id);
const item = document.getElementsByTagName("img"); // return a HTMLCollection
const item = document.getElementsByClassName("className"); // return a HTMLCollection

document.querySelector("h1"); // select only the first object
document.querySelector("#red"); // select only the first object
document.querySelector(".square"); // select only the first object
document.querySelectorAll("something"); // select all objects
```

```js title="Manipulate" linenums="1"
document.querySelector("p").innerText; // represents the rendered text content
document.querySelector("p").textContent; // represents the text content
document.querySelector("p").innerHTML; // gets or sets the HTML or XML markup contained within the element

// Attributes
document.querySelector("a").href;
document.querySelector("a").getAttribute("id");
document.querySelector("a").setAttribute("href", "https://www.google.com");

// Not the best option for change style !
window.getComputedStyle(h1).fontSize;

// Class List
document.querySelector("h2").classList.add("class_name_1");
document.querySelector("h2").classList.add("class_name_2");
document.querySelector("h2").classList.remove("class_name");
document.querySelector("h2").classList.toggle("class_name"); // turn ON and OFF a class

// Traversing Parent / Child / Sibling
selectedObject.parentElement;
selectedObject.children; // lists the children
selectedObject.previousSibling;
selectedObject.nextSibling;
selectedObject.previousElementSibling;
selectedObject.nextElementSibling;

// Create and remove elements
const newH3 = document.createElement("h3");
newH3.innerText = "New text !";
document.body.appendChild(newH3);
p.append("New text");
p.prepend(newElement);
element.insertAdjacentElement(position, element); // afterend, beforebegin
element.after(element);
parentElement.removeChild(childElement);
element.remove();
```

```js title="Events" linenums="1"
const btn = document.querySelector("#btn-v1");
btn.onclick = function () {
    console.log("You clicked me !");
};

// Using event listener
const btn = document.querySelector("#btn-v1");
btn.addEventListener("click", () => {
    console.log("You clicked me !");
    this.style.color = "red"; // the keyword THIS refers to the element triggered by the event, in this case 'btn'
});

// Event Object
input.addEventListener("keyup", (evt) => {
    console.log("Up !");
    console.log(evt.key);
    console.log(evt.code);
});

// Prevent default behavior for forms
const form = document.querySelector("#formID");
form.addEventListener("submit", function (e) {
    console.log("Submitted !");
    e.preventDefault();
});

// Input and change events
input.addEventListener("input", function (e) {
    // "change"
    console.log("Input changed !");
});

// Event bubbling
e.stopPropagation();

// Event Delegation
containerObj.addEventListener("click", function (e) {
    e.target.remove();
});
```

## Async

```js title="Using callbacks functions" linenums="1"
const mockedRequestCallback = (url, success, failure) => {
    const delay = Math.floor(Math.random() * 4500) + 500;
    setTimeout(() => {
        if (delay > 4000) {
            failure("Connection timeout !");
        } else {
            success(`Here is the data from ${url}`);
        }
    }, delay);
};
```

```js title="Using promises" linenums="1"
const mockedRequestPromise = (url) => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 4500) + 500;
        setTimeout(() => {
            if (delay > 4000) {
                reject("Connection timeout !");
            } else {
                resolve(`Here is the data from ${url}`);
            }
        }, delay);
    });
};

const request = mockedRequestPromise("myapi.com/inference");
request
    .then(() => {
        console.log("Request success ! (resolve)");
    })
    .catch(() => {
        console.log("Request failure ! (reject)");
    });
```

```js title="Multiple requests using promise" linenums="1"
mockedRequestPromise("myapi.com/inference/v1")
    .then((data) => {
        console.log("Request success ! (resolve) - v1");
        console.log(data);
        return mockedRequestPromise("myapi.com/inference/v2");
    })
    .then((data) => {
        console.log("Request success ! (resolve) - v2");
        console.log(data);
        return mockedRequestPromise("myapi.com/inference/v3");
    })
    .then((data) => {
        console.log("Request success ! (resolve) - v3");
        console.log(data);
    })
    .catch((err) => {
        console.log("A request failed !");
        console.log(err);
    });
```

-   **Async keyword:** The async functions always return a promise. If the function returns a value, the promise will be resolved with that value. If the function throws an exception, the promise will be rejected.
-   **Await keyword:** This keyword can only be used inside of functions declared with async. This feature will pause the execution of the function, waiting for a promise to be resolved.

```js title="Async keyword" linenums="1"
const login = async (user, pass) => {
    if (!user || !pass) throw "Missing Credentials !";
    if (pass === "123456") return "Welcome !";
    throw "Invalid Password !";
};

login("foobar", "123456")
    .then((msg) => {
        console.log("Logged In !");
        console.log(msg);
    })
    .catch((err) => {
        console.log("Error !");
        console.log(err);
    });
```

```js title="Await keyword" linenums="1"
async function makeTwoApiRequest() {
    try {
        let data1 = await mockedRequestPromise("myapi.com/inference/v1");
        console.log(data1);
        let data2 = await mockedRequestPromise("myapi.com/inference/v2");
        console.log(data2);
    } catch (err) {
        console.log("Error !");
        console.log(err);
    }
}
```

## Requesting APIs

```js title="API Request Using Fetch" linenums="1"
fetch("https://myapi.com/endpoint/1/")
    .then((res) => {
        console.log("Resolved !", res);
        return res.json();
    })
    .then((data) => {
        console.log("Json Done", data);
    })
    .catch((e) => {
        console.log("Error !", e);
    });

const callAPI = async () => {
    try {
        const res = await fetch("https://myapi.com/endpoint/1/");
        const data = await res.json();
        console.log(data);
    } catch (e) {
        console.log("Error !", e);
    }
};

callAPI();
```

```js title="API Request Using Axios" linenums="1"
axios
    .get("https://myapi.com/endpoint/1/")
    .then((res) => {
        console.log("Response:", res);
    })
    .catch((e) => {
        console.log("Error !", e);
    });

const callAPI = async () => {
    try {
        const res = await axios.get("https://myapi.com/endpoint/1/");
        console.log(res.data);
    } catch (e) {
        console.log("Error !");
    }
};

callAPI();
```

```js title="API Request Using Axios With Headers" linenums="1"
const callAPI = async () => {
    try {
        const config = { headers: { "application/json" } }
        const res = await axios.get("https://myapi.com/endpoint/1/", config);
        console.log(res.data);
    } catch (e) {
        console.log("Error !");
    }
};

callAPI()
```

## Prototypes, Classes and OOP

```js title="Class Example" linenums="1"
// Defining the class
class Vehicle {
    constructor(type, color, brand, year) {
        this.type = type;
        this.color = color;
        this.brand = brand;
        this.year = year;
    }

    start() {
        // const { t, c, b, y } = this;
        return "Vehicle started !";
    }

    stop() {
        return "Vehicle stopped !";
    }
}

// Creating instances of the Vehicle class
const vehicle1 = new Vehicle("car", "red", "Ford", 2015);
const vehicle2 = new Vehicle("motorbike", "blue", "Honda", 2018);

// Using methods on the instances
console.log(vehicle1.start());
console.log(vehicle2.pickUpPassengers());
```

```js title="Class Inheritance" linenums="1"
class Car extends Vehicle {
    constructor(color, brand, year, doors) {
        super("car", color, brand, year); // call the parent constructor
        this.doors = doors; // additional property specific to Car
    }

    new_method() {
        return null;
    }
}

// Creating an instance of the Car class
const myCar = new Car("red", "Toyota", 2020, 4);

// Using methods from both the Vehicle and Car classes
console.log(myCar.start());
console.log(myCar.new_method());
console.log(myCar.stop());
```

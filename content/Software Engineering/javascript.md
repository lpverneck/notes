---
title: JavaScript
created: 2024-10-26
tags:
  - active
publish: true
---
## Basics

### Data Types

- Number
- String
- Boolean
- NaN (Number)
- Null
- Undefined

```javascript
typeof NaN; // number

typeof true; // boolean
typeof false; // boolean

let someName = value;
const someName = value;
var someName = value;

let firstName = "Lucas";
firstName.length;
firstName.indexOf("c"); // 2
firstName.indexOf("as"); // 3
firstName.indexOf("z"); // -1
firstName.slice(2, 4); // cas
firstName.replace("a", "@"); // Luc@s

// Template Literals
`I counted ${3 + 4} sheeps`; // "I counted 7 sheeps"
```

```javascript
// Comparisons Operators
>
<
>=
<=
==
!=
=== // strict equality
!== // strict non-equality

// Logical Operators
&& // and
|| // or
! // not

// IF Statements
if (rating === 3) {
    console.log("OK! rating = 3");
}
else if (rating === 2) {
    console.log("OK! rating = 2");
}
else if (rating === 1) {
    console.log("OK! rating = 1");
}
else {
    console.log("Invalid Value !")
}

// Switch Statement
const day = 2;
switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    default:
        consolge.log("Else Like");
}
```

```javascript
// Print to console, alerts and prompt
console.log("Hello World !");
alert("Hi there !");
prompt("Please enter a number:"); // string format -> needs parseInt(variable)
```

>[!info] Running JS from Script
>1. Create a Javascript file **example.js**
>2. Add in the final body section on **index.html** file the line: `<script src="example.js"></script>`

### Arrays

```javascript
let my_array = [];
let my_collection = [12, 15.3, true, null, "hello", NaN, undefined];

let my_array = ["rad", "yellow", "blue"];
my_array[0] = "red";

// add element to the end
my_array.push("orange");
// remove element from the end
my_array.pop();
// remove element from start
my_array.shift();
// add element to start
my_array.unshift("orange");

// concat
oneArray.concat(twoArray);

// includes
my_array.includes("something"); // true or false

// indexOf
my_array.indexOf("something"); // element index or -1

// reverse
my_array.reverse();

// slice
my_array.slice(3, 8); // return index 3 to 7

// splice
my_array(1, 0, "new_element");

// sort
my_array.sort();
```

### Object Literals

```javascript
const person = {
    firstName: "Lucas",
    lastName: "Silva",
    age: 28,
    hobbys: ["guitar", "hiking"],
    exams: {
        midterm: 95,
        final: 80,
    },
};

person["firstName"]; // return Lucas
person.firstName; // return Lucas

person["firstName"] = "James";
person.firstName = "James";

person.favNumber = 7;
person["favNumber"] = 7;
```

### Loops

```javascript
// For Loop
for (let i = 1; i <= 10; i++) {
    console.log(i);
}

// While Loop
let count = 0;
while (count < 10) {
    count++;
    console.log(count);
    // break;
}

// For ... Of
const myList = ["Item A", "Item B", "Item C"];

for (let item of myList) {
    console.log(item);
}

// For ... In
for (let item in myDictObj) {
    console.log(item);
}
```

### Functions

```javascript
function funcName(parameterA, parameterB) {
    // do something
    return something;
}

let response = funcName(argumentA, argumentB);

// Function Expressions
const add = function (x, y) {
    return x + y;
};

add(2, 3); // 5

// Function Scope

// Higher Order Function

// Defining Methods
const myMath = {
    PI: 3.14159,
    square: function (num) {
        return num * num;
    },
    cube: function (num) {
        return num ** 3;
    },
    // New syntax
    square_new(num) {
        return num * num;
    },
};

myMath.PI; // 3.14159
myMath.cube(2); // 8

// This -> keyword used to access other properties on the same object
const person = {
    first: "James",
    last: "Bond",
    fullName() {
        return `${this.first} ${this.last}`;
    },
};

person.fullName(); // "James Bond"

// Try / Catch
try {
    hello.toUpperCase();
} catch (e) {
    console.log(e);
    console.log("Error !");
}
```

### Callbacks and Array Methods

```javascript
// .forEach()
const numbers = [1, 2, 3, 4, 5];

function powerElement(element) {
    console.log(element ** 2);
}
numbers.forEach(powerElement);

// .map()
// [2, 4, 6, 8, 10]
let double = numbers.map(function (num) {
    return num * 2;
});

// setTimeout()
setTimeout(() => {
    console.log("Waiting ...");
}, 3000);

// setInterval()
const id = setInterval(() => {
    console.log(Math.random());
}, 3000);

// clearInterval()
clearInterval(id);

// Filter
// [1, 2]
numbers.filter((n) => {
    return n < 3;
});

// .some()
const exams = [80, 90, 50, 52, 60, 100];
exams.some((score) => score >= 75); // true

// .every()
exams.every((score) => score >= 75); // false

// .reduce()
const nums = [3, 5, 7, 9, 11];
nums.reduce((total, currentValue) => {
    return total + currentValue;
}); // 35

// 120
[2, 4, 6, 8].reduce((total, currentValue) => total + currentValue, 100);
```

### Arrow Functions

```javascript
// Arrow functions behave differently with the keyword 'this' when used on an object method
// Example of arrow function
const sum = (x, y) => {
    return x + y;
};

// Alternative 1 (function expression)
const sum = function (x, y) {
    return x + y;
};

// Alternative 2
function sum(x, y) {
    return x + y;
}

// Implicit returns
const rollDie = () => Math.floor(Math.random() * 6) + 1;

const add = (a, b) => a + b;
```

### Newer Features

```javascript
// Default Parameters
function multiply(a, b = 1) {
    return a * b;
}

// Spread
Math.max(1, 2, 5); // 5
const nums = [1, 2, 3, 4, 5];
Math.min(...nums); // 1

// Spread with Array literals
const newNums = [...nums, ...nums]; // [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];

// Spread with objects
const feline = { legs: 4, family: "Felidae" };
let newAnimal = { ...feline, color: "gray" };

// Rest Parameters
function sum(...nums) {
    console.log(nums);
}
sum(1, 2, 3); // [1, 2, 3]

// Destructuring Array
const scores = [20, 10, 8, 5, 4, 3];
const [gold, silver, bronze, ...everyone] = scores;
gold; // 20
silver; // 10
bronze; // 8
everyone; // [5, 4, 3]

// Destructuring Object
const user = {
    email: "something@gmail.com",
    city: "Juiz de Fora",
    bio: "random text",
};
const { email, city, bio } = user;
const { bio: description } = user;
const { bio, name = "N/A" } = user;

// Destructuring Parameters
function fullName({ firstName, lastName }) {
    return `${firstName} ${lastName}`;
}
```

## Document Object Model (DOM)

The Document Object Model is a programming interface that represents the structure of HTML and XML documents in a hierarchical tree format. Each element in the document is represented as a node, allowing for dynamic manipulation of the document's content, structure, and style through programming languages, primarily JavaScript.

```js title="Selecting"
const item = document.getElementByID(id);
const item = document.getElementsByTagName("img"); // return a HTMLCollection
const item = document.getElementsByClassName("className"); // return a HTMLCollection

document.querySelector("h1"); // select only the first object
document.querySelector("#red"); // select only the first object
document.querySelector(".square"); // select only the first object
document.querySelectorAll("something"); // select all objects
```

```js title="Manipulate"
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

```js title="Events"
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

```js title="Using callbacks functions"
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

```js title="Using promises"
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

```js title="Multiple requests using promise"
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

```js title="Async keyword"
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

```js title="Await keyword"
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

```js title="API Request Using Fetch"
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

```js title="API Request Using Axios"
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

```js title="API Request Using Axios With Headers"
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

```js title="Class Example"
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

```js title="Class Inheritance"
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
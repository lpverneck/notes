# JavaScript

:track_next:

!!! info "Running JS from Script"
    1. Create a Javascript file **example.js**
    2. Add in the final body section on **index.html** file the line: `<script src="example.js"></script>`

## Basics

:track_next:

## Document Object Model (DOM)

:track_next:

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

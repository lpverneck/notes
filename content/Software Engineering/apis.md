---
title: API's
created: 2024-10-26
tags:
  - completed
publish: true
---
**A**pplication **P**rogramming **I**nterface, is a set of rules and protocols that enables different software applications to communicate with one another. It acts as an intermediary, allowing applications to exchange data, features, and functionalities without needing to understand the underlying code or architecture of each other.

## HTTP Verbs

Also known as HTTP methods, are fundamental components of the Hypertext Transfer Protocol (HTTP) used to specify the desired action to be performed on a resource.

- `GET`: Retrieve data from a specified resource.
- `POST`: Submit data to create a new resource or trigger an action.
- `PUT`: Update or replace an existing resource at a specified URL.
- `PATCH`: Apply partial modifications to an existing resource.
- `DELETE`: Remove a specified resource.
- `HEAD`: Retrieve only the headers of a resource without the body.
- `OPTIONS`: Describe the communication options for the target resource, including supported methods.
- `CONNECT`: Establish a tunnel to the server identified by the target resource (often for secure connections).
- `TRACE`: Perform a diagnostic loop-back test along the path to the target resource.


## HTTP Status Codes

HTTP status codes are three-digit responses from a server indicating the outcome of a client's request. They are crucial for understanding how web communication functions and diagnosing issues. These codes are categorized into five main classes, each represented by the first digit of the code.

### 1xx: Informational

These codes indicate that the server has received the request and is continuing to process it.

- __100 Continue__: The initial part of the request has been received.
- __101 Switching Protocols__: The server is changing protocols as requested by the client.

### 2xx: Success

This category signifies that the request was successfully received, understood, and accepted.

- __200 OK__: The request was successful, and the server returned the requested data.
- __201 Created:__ A new resource has been created as a result of the request.
- __204 No Content__: The request was successful, but there is no content to return.

### 3xx: Redirection

These codes indicate that further action is needed to complete the request.

- __301 Moved Permanently__: The requested resource has been permanently moved to a new URL.
- __302 Found__: The resource is temporarily located at a different URL.
- __304 Not Modified:__ Indicates that the resource has not changed since the last request.

### 4xx: Client Error

This category indicates that there was an error with the client's request.

- __400 Bad Request__: The server could not understand the request due to malformed syntax.
- __401 Unauthorized__: The client must authenticate itself to get the requested response.
- __404 Not Found__: The server cannot find the requested resource.

### 5xx: Server Error

These codes indicate that the server failed to fulfill a valid request.

- __500 Internal Server Error__: A generic error indicating an unexpected condition on the server.
- __503 Service Unavailable__: The server is currently unable to handle requests due to temporary overload or maintenance.

## Query Strings

A query string is a part of a URL that sends additional information to a web server. It begins with a question mark `?` and consists of key-value pairs separated by ampersands `&`.

Example URL: `https://myapi.com/page?key1=:value&key2=:value`

## HTTP Headers

HTTP headers are also a key-value pairs sent with HTTP requests and responses that provide essential metadata about the communication. They help define aspects such as content type, caching behavior, and authentication details.
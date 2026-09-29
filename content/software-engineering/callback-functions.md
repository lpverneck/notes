---
title: Callback functions
created at: 2024-01-20
modified at: 2024-01-20
status: Completed
tags:
  - swe
publish: true
---

Callback functions are the functions **passed as argument** to other functions. The functions that receive a callback are called **higher-order functions**. This kind of function are essential for managing asynchronous operations and event handling.

## Example

```python
# callback function
def s3_log(microservice):
    return f"The S3 {microservice} has been running !"


# callback function
def lambda_log(microservice):
    return f"The Lambda {microservice} has been running !"


# higher-order function
def generate_log(microservice, callback_func):
    log_message = callback_func(microservice)
    return log_message
```

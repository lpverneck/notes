---
title: Callback Functions
created: 2024-01-20
tags:
  - completed
publish: true
---
Callback functions are the functions passed as argument to other functions. The functions that receive a callback are called higher-order functions. These kind of function are essential for managing asynchronous operations and event handling.

```python
# callback function
def s3_log(microservice):
	return f"The S3 {microservice} has N objects !"

# callback function
def lambda_log(microservice):
	return f"The Lambda {microservice} has N invocations !"

# higher-order function
def generate_log(microservice, callback_func):
	log_message = callback_func(microservice)
	return log_message
```
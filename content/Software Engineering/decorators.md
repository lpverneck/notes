---
title: Decorators
created: 2024-01-20
tags:
  - completed
publish: true
---
A Python decorator is a design pattern that allows modify an existing function or method behavior without altering their actual code. Essentially, it's a function that receives another function as argument an return a new function that enhances or modifies the original function's behavior.

To define a decorator function just add the `@decorator_name` syntax above the target function. This syntax is called syntactic sugar.

## Example 1

```python
def custom_decorator(func):
	def wrapper():
		print("Do something BEFORE the function call !")
		func()
		print("Do something AFTER the function call !")
	return wrapper


@custom_decorator
def hello_world():
	print("Hello World !")


hello_world()
```

	Do something BEFORE the function call !
	Hello World !
    Do something AFTER the function call !

## Example 2

```python
import time


def timer(func):
	def wrapper(*args, **kwargs):
		s_time = time.time()
		res = func(*args, **kwargs)
		e_time = time.time()
		delta = e_time - s_time
		print(f"Function {func.__name__} took {delta} seconds to run.")
		return res
	return wrapper


@timer
def cummulative_sum_to_n(n):
	add = 0
	for num in range(n):
		add = add + num
	return add


print(cummulative_sum_to_n(5000))
```

	Function cummulative_sum_to_n took 0.001065969467163086 seconds to run.
	49995000
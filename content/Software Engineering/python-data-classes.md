---
title: Python Data Classes
created: 2025-07-09
tags:
  - completed
publish: true
---
Python data classes are a powerful tool for creating clean, concise, and maintainable classes that ==primarily store data==, while reducing the need for repetitive code. They are defined using the `@dataclass` decorator from the built-in `dataclasses` module. When you use this decorator, Python automatically generates special methods for your class, such as `__init__()`, `__repr__()`, and `__eq__()`, based on the class attributes you define.

## Basic Example

```python
# with dataclass
import uuid
from dataclasses import dataclass, field


def generate_id():
	return str(uuid.uuid4())

@dataclass(order=True, frozen=True)
class Car:
	_sort_index: int = field(init=False, repr=False)
	model: str
	brand: str
	year: int
	_car_id: str = field(init=False, default_factory=generate_id)
	engine_hp: str = "120hp"

	def __post_init__(self):
		# self.sort_index = self.year
		object.__setattr__(self, "_sort_index", self.year)


car1 = Car("Uno", "Fiat", 2010)
car2 = Car("Kicks", "Nissan", 2024)

print(car1)
print(car2 >= car1) # True
```

```python
# Extra Arguments

# 1. Keyword only 
# 2. Match args
# 3. Slots

@dataclass(kw_only=True, match_args=True, slots=True)
```
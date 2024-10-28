---
title: Object-Oriented Programming (OOP)
created: 2024-01-16
tags:
  - completed
publish: true
---
Object-oriented programming (OOP) is a computer programming model that organizes software design around data, or objects, rather than functions and logic. An object can be defined as a data field that has unique attributes and behavior.

## Main Concepts

- Encapsulation
- Abstraction
- Inheritance
- Polymorphism

## Other Concepts

- **Attributes:** there is instance and class categories
- **Methods:** functions defined inside the class
	- **Class Methods:** This should do something that has a relationship with the class, but usually, those are used to manipulate different structures of data to instantiate objects, like we have done with CSV.
	- **Static Methods:** Don't have the self parameter reference. This should do something that has a relationship with the class, but not something that must be unique per instance.
- **Objects:** are the instances of a class
- **Private Attributes:** attributes that can't be accessed directly _( __name )_
- **Private Methods:** methods that can't be accessed directly _( __method() )_
- **Abstract Classes:** a kind of class template, blocks the creation of an instance of the class
- **Abstract Methods:** a method that has a declaration but does not have an implementation
- **Getters:** used to retrieve some attribute
- **Setters:** used to set new value to some attribute
- **Magic Methods:** a.k.a dunder methods
- **Magic Attributes**

## Basic Example

```python
class Item:
    pass


new_item = Item()
new_item.name = "Computer"  # creating an attribute for the instance
```

## Complete Example

```python
import csv


class Item:
    # class attributes
    pay_rate = 0.6
    all = []

    # constructor method
    def __init__(self, name: str, price: float, qty: int = 0):
        # data validation
        assert price >= 0, "Price have a invalid value !"
        assert qty >= 0, "Qty have a invalid value !"

        # assignments - instance attributes
        self.name = name
        self.price = price
        self.qty = qty

        # actions to execute
        Item.all.append(self)

    # method example 1
    def calculate_total_price(self):
        return self.price * self.qty

    # method example 2
    def apply_discount(self):
        self.price = self.price * self.pay_rate  # Item.pay_rate

    # class method
    @classmethod
    def instantiate_from_csv(cls):
        with open("data.csv", "r") as f:
            reader = csv.DictReader(f)
            items = list(reader)

        for item in items:
            Item(
                name=item.get("name"),
                price=float(item.get("price")),
                qty=int(item.get("qty")),
            )

    # static method
    @staticmethod
    def check_integer(num):
        if isinstance(num, float):
            return num.is_integer()
        elif isinstance(num, int):
            return True
        else:
            return False

    # defining the object representation
    def __repr__(self):
        return f"{self.__class__.__name__}('{self.name}', {self.price}, {self.qty})"


new_item_a = Item("Car", 1500, 2)
new_item_b = Item("PC", 2000, 1)
new_item_c = Item("GPU", 5000, 3)

print(Item.all)

Item.instantiate_from_csv()
Item.check_integer(7)
```

## Inheritance Example

```python
class Computer(Item):
    def __init__(self, name: str, price: float, qty: int = 0, brokens=0):
        super().__init__(name, price, qty)

        assert brokens >= 0, "Brokens items have a invalid value !"

        self.brokens = brokens
```

## Using Getters and Setters Example

```python
class Item:
    # class attributes
    pay_rate = 0.6
    all = []

    # constructor method
    def __init__(self, name: str, price: float, qty: int = 0):
        # data validation
        assert price >= 0, "Price have a invalid value !"
        assert qty >= 0, "Qty have a invalid value !"

        # assignments - instance attributes
        self.__name = name
        self.price = price
        self.qty = qty

        # actions to execute
        Item.all.append(self)

    # method example 1
    def calculate_total_price(self):
        return self.price * self.qty

    # method example 2
    def apply_discount(self):
        self.price = self.price * self.pay_rate  # Item.pay_rate

    # class method
    @classmethod
    def instantiate_from_csv(cls):
        with open("data.csv", "r") as f:
            reader = csv.DictReader(f)
            items = list(reader)

        for item in items:
            Item(
                name=item.get("name"),
                price=float(item.get("price")),
                qty=int(item.get("qty")),
            )

    # static method
    @staticmethod
    def check_integer(num):
        if isinstance(num, float):
            return num.is_integer()
        elif isinstance(num, int):
            return True
        else:
            return False

    # defining the object representation
    def __repr__(self):
        return f"{self.__class__.__name__}('{self.name}', {self.price}, {self.qty})"

    # property decorator - read-only attribute - Getters
    @property
    def name(self):
        return self.__name

    # property decorator - allow to set a new value - Setters
    @name.setter
    def name(self, value):
        self.__name = value
```

## Abstract Class and Methods Examples

```python
from abc import ABC, abstractmethod


class Vehicle(ABC):
    @abstractmethod
    def go(self):
        pass


class Car(Vehicle):
    def go(self):
        print("Riding a car !")
```

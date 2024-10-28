---
title: Tests
created: 2024-01-16
tags:
  - completed
publish: true
---
Tests are a way for us to ensure that something works as intended.

## Types of Tests

- **Unit tests:** tests on individual components that each have a **single responsibility** (ex. a function).
- **Integration tests:** tests on the combined functionality of individual components (ex. data processing).
- **System tests:** tests on the design of a system for expected outputs given inputs (ex. training, inference, etc.).
- **Acceptance tests:** tests to verify that requirements have been met, usually referred to as User Acceptance Testing (UAT).
- **Regression tests:** tests based on errors we've seen before to ensure new changes don't reintroduce them.

## Framework For Tests

- **Arrange:** set up the different inputs to test on.
- **Act:** apply the inputs on the component we want to test.
- **Assert:** confirm that we received the expected output.

## What to test?

- **Inputs:** data types, format, length, edge cases (min/max, small/large, etc.)
- **Outputs:** data types, formats, exceptions, intermediary and final outputs

## Best Practices

- **Atomic:** when creating functions and classes, we need to ensure that they have a single responsibility so that we can easily test them. If not, we'll need to split them into more granular components.
- **Compose:** when we create new components, we want to compose tests to validate their functionality. It's a great way to ensure reliability and catch errors early on.
- **Reuse:** we should maintain central repositories where core functionality is tested at the source and reused across many projects. This significantly reduces testing efforts for each new project's code base.
- **Regression:** we want to account for new errors we come across with a regression test so we can ensure we don't reintroduce the same errors in the future.
- **Coverage:** we want to ensure 100% coverage for our codebase. This doesn't mean writing a test for every single line of code but rather accounting for every single line.
- **Automate:** in the event we forget to run our tests before committing to a repository, we want to auto run tests when we make changes to our codebase.

## Test Driven Development (TDD)

1. Red
2. Green
3. Refactor

## Implementation

### Project Structure

```
tests/
├── code/
│   ├── ...
│   └── ...
├── data/
│   ├── ...
│   └── ...
└── models/
│   ├── ...
│   └── ...
```

```
# pyproject.toml

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
```

```bash
python3 -m pytest                                          # all tests
python3 -m pytest tests/code                               # tests under a directory
python3 -m pytest tests/code/test_predict.py               # tests for a single file
python3 -m pytest tests/code/test_predict.py::test_decode  # tests for a single function
```

### Coverage

We can use the Coverage library to track and visualize how much of our codebase our tests account for.

```bash
python3 -m pytest tests/code --cov project_folder --cov-report html --disable-warnings

coverage run -m pytest -v

coverage report -m # view the generated report from terminal

coverage html
```

Exclusions: Excusing lines by adding this comment `# pragma: no cover, <MESSAGE>`

```python
if results_fp:  # pragma: no cover, saving results
    utils.save_dict(d, results_fp)
```

Excluding files by specifying them in our `pyproject.toml` configuration.

```
# pyproject.toml

[tool.coverage.run]
omit=["project/evaluate.py", "project/serve.py"]
```

### Parametrize

Pytest has the `@pytest.mark.parametrize`decorator which allows us to represent our inputs and outputs as parameters.

```python
@pytest.mark.parametrize(
    "text, sw, clean_text",
    [
        ("hi", [], "hi"),
        ("hi you", ["you"], "hi"),
        ("hi yous", ["you"], "hi yous"),
    ],
)
def test_clean_text(text, sw, clean_text):
    assert data.clean_text(text=text, stopwords=sw) == clean_text
```

### Fixtures

==MISSING==

### Markers

We can execute our tests at various levels of granularity (all tests, script, function, etc.) but we can create custom granularity by using **markers**.

```python
@pytest.mark.skipif(
    not torch.cuda.is_available(),
    reason="Full training tests require a GPU."
)
def test_training():
    pass


@pytest.mark.training
def test_train_model(dataset_loc):
    pass
```

```bash
pytest -m "training"      #  runs all tests marked with `training`
pytest -m "not training"  #  runs all tests besides those marked with `training`
```

> The proper way to use markers is to explicitly list the ones we've created in our `pyproject.toml` file.

```
# pyproject.toml

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
addopts = "--strict-markers --disable-pytest-warnings"
markers = [
    "training: tests that involve training",
]
```

### Examples

```python
# functions.py

import os
from random import randint


class ItemDatabase:
    def __init__(self) -> None:
        pass

    def get(self, item: str) -> float:
        pass


def calculate_average(numbers):
    if not numbers:
        raise ValueError("The list cannot be empty.")
    total = sum(numbers)
    return total / len(numbers)


def reverse_string(s):
    return s[::-1]


def find_max_subarray_sum(arr):
    if not arr:
        return 0
    current_sum = max_sum = arr[0]
    for num in arr[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum


def attack_damage(modifier):
    roll = randint(1, 8)
    return modifier + roll


def sum_names():
    name_a = os.environ.get("name1")
    name_b = os.environ.get("name2")
    print(name_a + " and " + name_b)
    return None


def print_something_is_awesome(something):
    print(f"{something} is awesome !")
```

```python
import pytest
from unittest import mock
from functions import (
    calculate_average,
    reverse_string,
    find_max_subarray_sum,
    ItemDatabase,
    attack_damage,
    sum_names,
    print_something_is_awesome,
)

# Fixture feature

# @pytest.fixture
# def cart():
#     ...
#     return ShoppingCart(5)


# def test_can_add_item_to_cart(cart):
#     cart.add("apple")
#     ...


def test_calculate_average_one():
    assert calculate_average(numbers=[1, 2, 3]) == 2


def test_calculate_average_two():
    assert calculate_average(numbers=[1, 2, 9]) == 4


def test_find_max_subarray_sum_one():
    assert find_max_subarray_sum(arr=[1, 2, 3]) == 6


def test_find_max_subarray_sum_two():
    assert find_max_subarray_sum(arr=None) == 0


def test_reverse_string_raise_error():
    with pytest.raises(TypeError):
        reverse_string(s=5)


def test_item_database():
    item_db = ItemDatabase()
    item_db.get = mock.Mock(return_value=[10, 5])
    assert sum(item_db.get(item="apple")) == 15


@mock.patch("functions.randint", return_value=5, autospec=True)
def test_attack_damage(mock_randint):
    assert attack_damage(1) == 6
    mock_randint.assert_called_once_with(1, 8)


@mock.patch.dict("functions.os.environ", {"name1": "Mary", "name2": "John"})
def test_sum_names():
    assert sum_names() is None


@mock.patch("builtins.print", autospec=True)
def test_print_something_is_awesome(mock_print):
    print_something_is_awesome("Juice")
    mock_print.assert_called_with("Juice is awesome !")
```

---
title: Code Documentation
created: 2024-01-16
tags:
  - completed
publish: true
---
Code documentation improves code quality, enhances collaboration, and simplifies the development and maintenance processes. It's a valuable practice for any software development project.

## Components

- **Comments:** short descriptions that contains the 'why' a piece of code exists.
- **Docstrings:** descriptions for functions and classes that describe overall utility, arguments and returns.
- **Annotations:** also know as *type hints*, is the specification of a function's inputs and outputs data types.
- **Docs:** usually a webpage that summarizes all the functions, classes, workflows and examples.

### Docstrings

```python
def calculate_statistics(data, threshold=0.5):
    """
    Calculates statistics based on the provided data.

    Args:
        data (list): A list of numeric values.
        threshold (float, optional): A threshold value for filtering data. Default is 0.5.

    Returns:
        tuple: A tuple containing the following statistics:
            - count (int): The number of values in the data.
            - mean (float): The mean value of the data.
            - above_threshold (list): A list of values above the threshold.
            - below_threshold (list): A list of values below or equal to the threshold.

    Raises:
        ValueError: If the data is an empty list.
        TypeError: If the data contains non-numeric values.

    Examples:
        >>> calculate_statistics([0.2, 0.4, 0.6, 0.8])
        (4, 0.5, [0.6, 0.8], [0.2, 0.4])
        >>> calculate_statistics([1, 2, 3, 4, 5], threshold=3.5)
        (5, 3.0, [4, 5], [1, 2, 3])
    """
    if not data:
        raise ValueError("The data list cannot be empty.")

    if not all(isinstance(value, (int, float)) for value in data):
        raise TypeError("The data list must contain only numeric values.")

    count = len(data)
    mean = sum(data) / count
    above_threshold = [value for value in data if value > threshold]
    below_threshold = [value for value in data if value <= threshold]

    return count, mean, above_threshold, below_threshold
```

### Annotations

```python
from typing import Union, List, Tuple, Optional


# Type annotations
name: str = "John"
age: int = 25
height: float = 1.82

# Variable annotations
weight: float  # type: float
numbers = []
stats = {}


# Function annotations
# Example 1
def calculate_mean(grades: list[float]) -> float:
    """Calculates the mean of a grades list."""
    total = sum(grades)
    mean = total / len(grades)
    return mean


# Example 2
def process_data(
    data: Union[List[int], Tuple[float, float]]
) -> Union[List[int], float]:
    """Processes the data based on its type and returns a modified version."""
    if isinstance(data, list) and all(isinstance(x, int) for x in data):
        # Process the list of integers
        return [x * 2 for x in data]
    elif (
        isinstance(data, tuple)
        and len(data) == 2
        and all(isinstance(x, float) for x in data)
    ):
        # Process the tuple of floats
        return data[0] + data[1]
    else:
        # Invalid data format, return None
        return None


# Example 3
def divide(a: float, b: float) -> Optional[float]:
    """Divides two numbers and returns the result, or None if division is not
    possible."""
    if b != 0:
        return a / b
    else:
        return None
```

### Docs

Once your project have a nice documented structure using the features above, it's possible to generate a HTML page for your documentation automatically. For this check the [Sphinx](https://www.sphinx-doc.org/en/master/) or the [MkDocs](https://www.mkdocs.org/) libraries.
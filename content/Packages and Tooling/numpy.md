---
title: Numpy
created: 2024-02-24
tags:
  - completed
publish: true
---
## Why is Numpy Faster Than Lists ?

- Less bytes of memory (Fixed Type)
- No type checking when iterating through objects
- Contiguous memory
    - SIMD vector processing
    - Effective cache utilization

## Basics


```python
import numpy as np
```


```python
# set seed for reproducibility
np.random.seed(seed=42)
```


```python
# Scalar - 0D Tensor - a single value
x = np.array(7)
print("x: ", x)
print("x ndim: ", x.ndim)  # number of dimensions
print("x shape:", x.shape)  # dimensions
print("x size: ", x.size)  # size of elements
print("x dtype: ", x.dtype)  # data type
print("x itemsize: ", x.itemsize)  # length of one array element in bytes
print(
    "x nbytes: ", x.nbytes
)  # total bytes consumed by the elements of the array
```

    x:  7
    x ndim:  0
    x shape: ()
    x size:  1
    x dtype:  int64
    x itemsize:  8
    x nbytes:  8



```python
# Vector - 1D Tensor - row or column of values
x = np.array([1.5, 2.5, 3.5, 5.0])
print("x: ", x)
print("x ndim: ", x.ndim)
print("x shape:", x.shape)
print("x size: ", x.size)
print("x dtype: ", x.dtype)
print("x itemsize: ", x.itemsize)
print("x nbytes: ", x.nbytes)
```

    x:  [1.5 2.5 3.5 5. ]
    x ndim:  1
    x shape: (4,)
    x size:  4
    x dtype:  float64
    x itemsize:  8
    x nbytes:  32



```python
# Matrix - 2D Tensor - array (rows and columns) of values
x = np.array([[1, 2], [3, 4]])
print("x:\n", x)
print("x ndim: ", x.ndim)
print("x shape:", x.shape)
print("x size: ", x.size)
print("x dtype: ", x.dtype)
print("x itemsize: ", x.itemsize)
print("x nbytes: ", x.nbytes)
```

    x:
     [[1 2]
     [3 4]]
    x ndim:  2
    x shape: (2, 2)
    x size:  4
    x dtype:  int64
    x itemsize:  8
    x nbytes:  32



```python
# 3D Tensor
x = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
print("x:\n", x)
print("x ndim: ", x.ndim)
print("x shape:", x.shape)
print("x size: ", x.size)
print("x dtype: ", x.dtype)
print("x itemsize: ", x.itemsize)
print("x nbytes: ", x.nbytes)
```

    x:
     [[[1 2]
      [3 4]]

     [[5 6]
      [7 8]]]
    x ndim:  3
    x shape: (2, 2, 2)
    x size:  8
    x dtype:  int64
    x itemsize:  8
    x nbytes:  64



```python
# Functions to create tensors
print("np.zeros((3, 3)):\n", np.zeros((3, 3)))
print("np.ones((3, 3)):\n", np.ones((3, 3)))
print("np.identity((3, 3)):\n", np.identity(3))
print("np.eye((3)):\n", np.eye((3)))  # identity matrix
print("np.random.random((3, 3)):\n", np.random.random((3, 3)))
print("np.random.random_sample((3, 3)):\n", np.random.random_sample((3, 3)))
print("np.random.rand(4, 2):\n", np.random.rand(4, 2))
print(
    "np.random.randint(1, 6, size=(3, 3)):\n",
    np.random.randint(1, 6, size=(3, 3)),
)
print(
    "np.full(shape=(4, 4), fill_value=100):\n",
    np.full(shape=(4, 4), fill_value=100),
)

# Repeat array
my_array = np.array([[1, 2, 3]])
print("np.repeat(my_array, 5, axis=0):\n", np.repeat(my_array, 5, axis=0))
```

    np.zeros((3, 3)):
     [[0. 0. 0.]
     [0. 0. 0.]
     [0. 0. 0.]]
    np.ones((3, 3)):
     [[1. 1. 1.]
     [1. 1. 1.]
     [1. 1. 1.]]
    np.identity((3, 3)):
     [[1. 0. 0.]
     [0. 1. 0.]
     [0. 0. 1.]]
    np.eye((3)):
     [[1. 0. 0.]
     [0. 1. 0.]
     [0. 0. 1.]]
    np.random.random((3, 3)):
     [[0.37454012 0.95071431 0.73199394]
     [0.59865848 0.15601864 0.15599452]
     [0.05808361 0.86617615 0.60111501]]
    np.random.random_sample((3, 3)):
     [[0.70807258 0.02058449 0.96990985]
     [0.83244264 0.21233911 0.18182497]
     [0.18340451 0.30424224 0.52475643]]
    np.random.rand(4, 2):
     [[0.43194502 0.29122914]
     [0.61185289 0.13949386]
     [0.29214465 0.36636184]
     [0.45606998 0.78517596]]
    np.random.randint(1, 6, size=(3, 3)):
     [[3 4 4]
     [1 3 5]
     [3 5 1]]
    np.full(shape=(4, 4), fill_value=100):
     [[100 100 100 100]
     [100 100 100 100]
     [100 100 100 100]
     [100 100 100 100]]
    np.repeat(my_array, 5, axis=0):
     [[1 2 3]
     [1 2 3]
     [1 2 3]
     [1 2 3]
     [1 2 3]]


## Copying Arrays


```python
a = np.array([1.5, 2.5, 3.5])
b = a
b[0] = 100
print(b)
print(a)
```

    [100.    2.5   3.5]
    [100.    2.5   3.5]



```python
a = np.array([1.5, 2.5, 3.5])
b = a.copy()  # use copy()
b[0] = 100
print(b)
print(a)
```

    [100.    2.5   3.5]
    [1.5 2.5 3.5]


## Indexing


```python
x = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
print("x:\n", x)
print("x[0, 2]: ", x[0, 2])
x[0, 2] = 99
print("x:\n", x)
```

    x:
     [[ 1  2  3  4]
     [ 5  6  7  8]
     [ 9 10 11 12]]
    x[0, 2]:  3
    x:
     [[ 1  2 99  4]
     [ 5  6  7  8]
     [ 9 10 11 12]]



```python
# Slicing
x = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
print(x)
print("x column 1: ", x[:, 1])
print("x row 0: ", x[0, :])
print("x rows 0,1 & cols 1,2: \n", x[0:2, 1:3])
```

    [[ 1  2  3  4]
     [ 5  6  7  8]
     [ 9 10 11 12]]
    x column 1:  [ 2  6 10]
    x row 0:  [1 2 3 4]
    x rows 0,1 & cols 1,2:
     [[2 3]
     [6 7]]



```python
# Integer array indexing
print(x)
rows_to_get = np.array([0, 1, 2])
print("rows_to_get: ", rows_to_get)
cols_to_get = np.array([0, 2, 1])
print("cols_to_get: ", cols_to_get)
# Combine sequences above to get values to get
print("indexed values: ", x[rows_to_get, cols_to_get])
```

    [[ 1  2  3  4]
     [ 5  6  7  8]
     [ 9 10 11 12]]
    rows_to_get:  [0 1 2]
    cols_to_get:  [0 2 1]
    indexed values:  [ 1  7 10]



```python
# Boolean array indexing
x = np.array([[1, 2], [3, 4], [5, 6]])
print("x:\n", x)
print("x > 2:\n", x > 2)
print("x[x > 2]:\n", x[x > 2])
```

    x:
     [[1 2]
     [3 4]
     [5 6]]
    x > 2:
     [[False False]
     [ True  True]
     [ True  True]]
    x[x > 2]:
     [3 4 5 6]


## Arithmetic


```python
# Basic math
x = np.array([[5, 5], [5, 5]], dtype=np.float64)
y = np.array([[5, 5], [5, 5]], dtype=np.float64)
print("x + y:\n", np.add(x, y))  # or x + y
print("x - y:\n", np.subtract(x, y))  # or x - y
print("x * y:\n", np.multiply(x, y))  # or x * y
print("x / y:\n", np.divide(x, y))  # or x / y
print("xˆ3:\n", x**3)
print("x * 3:\n", x * 3)
```

    x + y:
     [[10. 10.]
     [10. 10.]]
    x - y:
     [[0. 0.]
     [0. 0.]]
    x * y:
     [[25. 25.]
     [25. 25.]]
    x / y:
     [[1. 1.]
     [1. 1.]]
    xˆ3:
     [[125. 125.]
     [125. 125.]]
    x * 3:
     [[15. 15.]
     [15. 15.]]


## Linear Algebra

### Dot Product


```python
a = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float64)
b = np.array([[7, 8], [9, 10], [11, 12]], dtype=np.float64)
c = a.dot(b)
print(f"{a.shape} · {b.shape} = {c.shape}")
print(c)
print("or using np.matmul(a, b):\n", np.matmul(a, b))
```

    (2, 3) · (3, 2) = (2, 2)
    [[ 58.  64.]
     [139. 154.]]
    or using np.matmul(a, b):
     [[ 58.  64.]
     [139. 154.]]


### Axis Operations


```python
# Sum across a dimension
x = np.array([[1, 2], [3, 4]])
print(x)
print("sum all: ", np.sum(x))  # adds all elements
print("sum axis=0: ", np.sum(x, axis=0))  # sum across rows
print("sum axis=1: ", np.sum(x, axis=1))  # sum across columns
```

    [[1 2]
     [3 4]]
    sum all:  10
    sum axis=0:  [4 6]
    sum axis=1:  [3 7]



```python
# Min / max
x = np.array([[1, 2, 3], [4, 5, 6]])
print("min: ", x.min())
print("max: ", x.max())
print("min axis=0: ", x.min(axis=0))
print("min axis=1: ", x.min(axis=1))
```

    min:  1
    max:  6
    min axis=0:  [1 2 3]
    min axis=1:  [1 4]


### Broadcast


```python
x = np.array([7, 27])  # vector
y = np.array(3)  # scalar
z = x + y
print("z:\n", z)
```

    z:
     [10 30]


### Transpose


```python
x = np.array([[1, 2, 3], [4, 5, 6]])
print("x:\n", x)
print("x.shape: ", x.shape)
y = np.transpose(x, (1, 0))  # flip dimensions at index 0 and 1
print("y:\n", y)
print("y.shape: ", y.shape)
```

    x:
     [[1 2 3]
     [4 5 6]]
    x.shape:  (2, 3)
    y:
     [[1 4]
     [2 5]
     [3 6]]
    y.shape:  (3, 2)


### Reshape


```python
x = np.array([[1, 2, 3, 4, 5, 6]])
print(x)
print("x.shape: ", x.shape)
y = np.reshape(x, (2, 3))
print("y: \n", y)
print("y.shape: ", y.shape)
z = np.reshape(x, (2, -1))
print("z: \n", z)
print("z.shape: ", z.shape)
```

    [[1 2 3 4 5 6]]
    x.shape:  (1, 6)
    y:
     [[1 2 3]
     [4 5 6]]
    y.shape:  (2, 3)
    z:
     [[1 2 3]
     [4 5 6]]
    z.shape:  (2, 3)


### Joining


```python
x = np.random.random((2, 3))
print(x)
print(x.shape)
```

    [[0.06505159 0.94888554 0.96563203]
     [0.80839735 0.30461377 0.09767211]]
    (2, 3)



```python
# Concatenation
y = np.concatenate([x, x], axis=0)  # concat on a specified axis
print(y)
print(y.shape)
```

    [[0.06505159 0.94888554 0.96563203]
     [0.80839735 0.30461377 0.09767211]
     [0.06505159 0.94888554 0.96563203]
     [0.80839735 0.30461377 0.09767211]]
    (4, 3)



```python
# Stacking
z = np.stack([x, x], axis=0)  # stack on new axis
print(z)
print(z.shape)
```

    [[[0.06505159 0.94888554 0.96563203]
      [0.80839735 0.30461377 0.09767211]]

     [[0.06505159 0.94888554 0.96563203]
      [0.80839735 0.30461377 0.09767211]]]
    (2, 2, 3)


### Expanding / Reducing


```python
# Adding dimensions
x = np.array([[1, 2, 3], [4, 5, 6]])
print("x:\n", x)
print("x.shape: ", x.shape)
y = np.expand_dims(x, 1)  # expand dim 1
print("y: \n", y)
print("y.shape: ", y.shape)  # notice extra set of brackets are added
```

    x:
     [[1 2 3]
     [4 5 6]]
    x.shape:  (2, 3)
    y:
     [[[1 2 3]]

     [[4 5 6]]]
    y.shape:  (2, 1, 3)



```python
# Removing dimensions
x = np.array([[[1, 2, 3]], [[4, 5, 6]]])
print("x:\n", x)
print("x.shape: ", x.shape)
y = np.squeeze(x, 1)  # squeeze dim 1
print("y: \n", y)
print("y.shape: ", y.shape)  # notice extra set of brackets are gone
```

    x:
     [[[1 2 3]]

     [[4 5 6]]]
    x.shape:  (2, 1, 3)
    y:
     [[1 2 3]
     [4 5 6]]
    y.shape:  (2, 3)

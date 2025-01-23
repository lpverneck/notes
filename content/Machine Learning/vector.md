---
title: Vector
created: 2025-01-18
tags:
  - completed
publish: true
---
## Vector

- Arrow in a hyperplane
- Magnitude (size)
- Direction

$$\vec{v} = [v_{1} \quad v_{2} \quad v_{3} \quad ... \quad v_{n}]$$
$$\vec{u} = [u_{1} \quad u_{2} \quad u_{3} \quad ... \quad u_{n}]$$

## Norm

The vector norm is a way to measure it's magnitude.

### L1-Norm

Also known as Manhattan distance or Taxicab norm.

$$\|\vec{v}\|_1 = \sum_{i=1}^n |v_i|$$

### L2-Norm

Is the most popular norm, also known as the Euclidean distance (norm). It is the shortest distance to go from one point to another.

$$\|\vec{v}\|_2 = \sqrt{\sum_{i=1}^n v_i^2}$$

## Vector/Matrix Operations

### Sum

$$
\vec{v} + \vec{u} = \begin{bmatrix} v_1+u_1 & v_2+u_2 & \cdots & v_n+u_n \end{bmatrix}
$$

### Difference

$$
\vec{v} - \vec{u} = \begin{bmatrix} v_1-u_1 & v_2-u_2 & \cdots & v_n-u_n \end{bmatrix}
$$

### Multiply by a scalar

$$
\lambda\vec{v}= \begin{bmatrix} \lambda v_1 & \lambda v_2 & \cdots & \lambda v_n \end{bmatrix}
$$

### Multiply vector vs matrix

The number of matrix's columns must be equal to the vector row's number. 

$$
\begin{bmatrix}  
1 & 1 & 1\\  
1 & 2 & 1\\
1 & 1 & 2\\
\end{bmatrix}_{3 \times \mathbf{3}}
.
\begin{bmatrix}  
a\\  
b\\
c\\
\end{bmatrix}_{\mathbf{3} \times 1}
=
\begin{bmatrix}  
10\\  
15\\
12\\
\end{bmatrix}_{3 \times 1}
$$

### Vector and matrix transpose

pass

### Dot Product

pass
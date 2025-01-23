---
title: Vector
created: 2025-01-18
tags:
  - completed
publish: true
---
## Characteristics

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

## Vector and Matrix Operations

### Vector Sum

$$
\vec{v} + \vec{u} = \begin{bmatrix} v_1+u_1 & v_2+u_2 & \cdots & v_n+u_n \end{bmatrix}
$$

### Vector Difference

$$
\vec{v} - \vec{u} = \begin{bmatrix} v_1-u_1 & v_2-u_2 & \cdots & v_n-u_n \end{bmatrix}
$$

### Multiply Vector by a Scalar

$$
\lambda\vec{v}= \begin{bmatrix} \lambda v_1 & \lambda v_2 & \cdots & \lambda v_n \end{bmatrix}
$$

### Multiply Vector vs Matrix

The number of matrix's columns $(3)$ must be equal to the vector row's number $(3)$.

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

### Vector and Matrix Transpose

The transpose is an operation that flips a matrix or vector over its main diagonal, switching its rows and columns. The transpose converts an $m\times n$ matrix into an $n\times m$ matrix.

For a vector $\vec{v}$ and a matrix $\mathbf{A}$:

$$
\vec{v} = \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix}
\quad\quad
\mathbf{A} = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}
$$

The respective transposes are:

$$
\vec{v}^\intercal = \begin{bmatrix} v_1 & v_2 & \cdots & v_n \end{bmatrix}
\quad\quad
\mathbf{A}^\intercal = \begin{bmatrix} a_{11} & a_{21} & \cdots & a_{m1} \\ a_{12} & a_{22} & \cdots & a_{m2} \\ \vdots & \vdots & \ddots & \vdots \\ a_{1n} & a_{2n} & \cdots & a_{mn} \end{bmatrix}
$$

### Dot Product

Also known as inner product, this operation gives an intuition about the projections between the two vectors.

Given the two vectors:

$$
\mathbf{a} = \begin{bmatrix} a_1 \\ a_2 \\ \vdots \\ a_n \end{bmatrix} \quad \text{and} \quad \mathbf{b} = \begin{bmatrix} b_1 \\ b_2 \\ \vdots \\ b_n \end{bmatrix} 
$$

The dot product is given by:

$$
\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^n a_i b_i = a_1b_1 + a_2b_2 + \cdots + a_nb_n
$$

The dot product also can be structured as a matrix multiplication:

$$
\mathbf{a} \cdot \mathbf{b} = \mathbf{a}^\intercal \mathbf{b} = \begin{bmatrix} a_1 & a_2 & \cdots & a_n \end{bmatrix} \begin{bmatrix} b_1 \\ b_2 \\ \vdots \\ b_n \end{bmatrix} = a_1b_1 + a_2b_2 + \cdots + a_nb_n
$$

- $\mathbf{a} \cdot \mathbf{b} > 0$ : Positive projection
- $\mathbf{a} \cdot \mathbf{b} = 0$ : Ortogonal vectors
- $\mathbf{a} \cdot \mathbf{b} < 0$ : Negative projection
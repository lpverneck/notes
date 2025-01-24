---
title: Matrix
created: 2025-01-14
tags:
  - completed
publish: true
---
## Motivation

On a traditional supervised machine learning problem using structured and tabular data, often we have to create a model based on a previous dataset. The model must learn and then map the independent variables (features) $x$ into a dependent variable (target) $y$. This problem can be represented as a system of linear equations as shown below:

$$ 
\begin{cases}  
w_{1} x_{1}^{(1)} + w_{2} x_{2}^{(1)} + w_{3} x_{3}^{(1)} + ... + w_{n} x_{n}^{(1)} + b = y^{(1)}\\  
w_{1} x_{1}^{(2)} + w_{2} x_{2}^{(2)} + w_{3} x_{3}^{(2)} + ... + w_{n} x_{n}^{(2)} + b = y^{(2)}\\
w_{1} x_{1}^{(3)} + w_{2} x_{2}^{(3)} + w_{3} x_{3}^{(3)} + ... + w_{n} x_{n}^{(3)} + b = y^{(3)}\\
\quad\quad\quad\quad\quad\quad\quad\quad\quad\quad\quad\quad\vdots\\
w_{1} x_{1}^{(m)} + w_{2} x_{2}^{(m)} + w_{3} x_{3}^{(m)} + ... + w_{n} x_{n}^{(m)} + b = y^{(m)}
\end{cases}
$$

Solve the system of linear equations for $[w_{1}, w_{2}, w_{3}, ..., w_{n}, b]$.

$$
\begin{bmatrix}
w_{1} & w_{2} & w_{3} & ... & w_{n}
\end{bmatrix}
\quad
\begin{bmatrix}  
x_{1}^{(1)} & x_{2}^{(1)} & x_{3}^{(1)} & ... & x_{n}^{(1)}\\  
x_{1}^{(2)} & x_{2}^{(2)} & x_{3}^{(2)} & ... & x_{n}^{(2)}\\
x_{1}^{(3)} & x_{2}^{(3)} & x_{3}^{(3)} & ... & x_{n}^{(3)}\\
\vdots & \vdots & \vdots & \ddots & \vdots\\
x_{1}^{(m)} & x_{2}^{(m)} & x_{3}^{(m)} & ... & x_{n}^{(m)}\\
\end{bmatrix}
\quad
\begin{bmatrix}
y^{(1)} & y^{(2)} & y^{(3)} & ... & y^{(n)}
\end{bmatrix}
$$

$$
\vec{w}\quad\cdot\quad X \quad + \quad b \quad = \quad \vec{\hat{y}}
$$

## System Types

- $(I)$ Complete - Non-Singular (Unique Solution)
- $(II)$ Redundant - Singular (Infinite Solutions)
- $(III)$ Contradictory - Singular (No Solution)

![[Pasted image 20250115084112.png]]

## Linear Dependence and Independence

$$
\begin{bmatrix}  
1 & 1 & 1\\  
1 & 1 & 2\\
1 & 1 & 3\\
\end{bmatrix}
\rightarrow
(R1 + R3) \div 2 = R2 \rightarrow [1\quad1\quad   2]\quad(Linear\quad Dependent)
$$

## Determinant

If the $Det(A) \not= 0$, then the matrix $A$ is **non-singular**. Also, the determinant can be interpreted geometrically as the area or volume of a [[linear-transformation|linear transformation]] basis.

$$
A = \begin{bmatrix}  
1 & 2 & 3\\  
4 & 5 & 6\\
7 & 8 & 10\\
\end{bmatrix}
$$
$$
Det(A) = (1\cdot5\cdot10 + 2\cdot6\cdot7+3\cdot4\cdot8)\\
-\\
(3\cdot5\cdot7 + 6\cdot8\cdot1 + 10\cdot4\cdot2) = -3
$$

### Determinant of a Product

$$
det(\mathbf{AB}) = det(\mathbf{A}) \cdot det(\mathbf{B})
$$

### Determinant of Inverse

$$
det(\mathbf{A}^{-1}) = \frac{1}{det(\mathbf{A})}
$$

### Determinant of Identity

$$
det(\mathbf{I}) = 1
$$

## Elementary Row Operations (EROs)

- Switch rows
- Multiply row by a (non-zero) scalar
- Add a row to another row

## Row Echelon Form (REF)

- Zero rows are at the bottom
- Each row has a **pivot** (leftmost non-zero entry)
- Every **pivot** is to the right of the pivots on the rows above
- Rank of the matrix is the number of pivots

$$
\begin{bmatrix}  
\textbf{3} & * & * & * & *\\  
0 & 0 & \textbf{1} & * & *\\
0 & 0 & 0 &\textbf{-4} & *\\
0 & 0 & 0 &\textbf{0} & 0\\
0 & 0 & 0 &0 & \textbf{0}
\end{bmatrix}
$$

## Reduced Row Echelon Form (RREF)

- The matrix must be in row echelon form
- Each pivot is a $1$
- Any number above the pivot has to be $0$
- Rank of the matrix is the number of pivots

$$
\begin{bmatrix}  
\textbf{1} & * & 0 & 0 & *\\  
0 & 0 & \textbf{1} & 0 & *\\
0 & 0 & 0 &\textbf{1} & *\\
0 & 0 & 0 &\textbf{0} & 0\\
0 & 0 & 0 &0 & \textbf{0}
\end{bmatrix}
$$

## Rank

The rank of a matrix can be seen as a measure of the information amount present on a system. It can be interpreted as the number of linear independent equations that make up a system.

If a matrix $A$ have a **full rank**, it means the rank is equal to the matrix order ($Rank(A)=n$ for $A_{n \times n}$), then the system is non-singular.

The rank of a matrix can be calculated based on the number of **pivots** in the row echelon form.

$$
M = \begin{bmatrix}  
\textbf{1} & 2 & 3\\  
0 & \textbf{1} & 7\\
0 & 0 &\textbf{1}
\end{bmatrix}
$$
$$Rank(M) = 3$$

## Gaussian Elimination Algorithm

Is a method for row reduction and so for solving linear systems.

1. Create the augmented matrix
2. Get the matrix into reduced row echelon form
3. Complete back substitution
4. Stop if you encounter a row of zeros (singular system)

### Augmented Matrix

$$
\begin{cases}  
2a - b + c = 1 \\  
2a + 2b + 4c = -2 \\  
4a + b = -1  
\end{cases}  
$$
$$
\begin{bmatrix}  
2 & -1 & 1 & 1\\  
2 & 2 & 4 & -2\\
4 & 1 & 0 & -1\\
\end{bmatrix}
$$

## Matrix Inverse

Analogous to a number multiplicative inverse, a square $m \times m$ matrix $\mathbf{A}$ is invertible (also non-singular) if there exists an $m \times m$ square matrix $\mathbf{A}^{-1}$ such that:

$$
\mathbf{A}\mathbf{A}^{-1} = \mathbf{A}^{-1}\mathbf{A} = \mathbf{I}_m
$$

where $\mathbf{I}_m$ denotes the $m \times m$ identity matrix.

- A matrix is invertible only if $Det(\mathbf{A}) \neq 0$.

## Identity Matrix

The identity matrix of size $m$ is the $m \times m$ square matrix with ones on the main diagonal and zeros elsewhere. Analogous to multiplying a number by $1$, the multiplied object remains the same.

$$
\mathbf{I}\mathbf{A} = \mathbf{A}\mathbf{I} = \mathbf{A}
$$

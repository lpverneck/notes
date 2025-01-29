---
title: Eigenvalues and Eigenvectors
created: 2025-01-24
tags:
  - completed
publish: true
---
## Eigenbasis

Is a specific [[linear-transformation|basis]] of a vector space in which every vector is an **eigenvector** of a given linear transformation. The eigenvectors provides the direction of a stretch on the transformation space while the **eigenvalues** gives the magnitude of this stretch.

## Calculating Eigenvalues and Eigenvectors

- $v_1$ and $v_2$ are the eigenvectors
- $\lambda_1$ and $\lambda_2$ are the eigenvalues

$$
\mathbf{A}v_1 = \lambda_1v_1
$$
$$
\mathbf{A}v_2 = \lambda_2v_2
$$

- $\mathbf{A}v = \lambda v$ for each eigenvector / eigenvalue
- Eigenvectors: direction of stretch
- Eigenvalues: how much stretch
- Eigenbasis: the set of a matrix’s eigenvectors, can be arranged as a matrix with one eigenvector in each column
- Save work and characterize a transformation

### Finding Eigenvalues

If $\lambda$ is an eigenvalue, for infinitely many $(x, y)$:

$$
\begin{bmatrix}  
2 & 1\\  
0 & 3
\end{bmatrix}
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
=
\begin{bmatrix}  
\lambda & 0\\  
0 & \lambda
\end{bmatrix}
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
$$

$$
\begin{bmatrix}  
2-\lambda & 1\\  
0 & 3-\lambda
\end{bmatrix}
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
=
\begin{bmatrix}  
0\\  
0
\end{bmatrix}
$$

Has infinitely many solutions.

$$
det\begin{bmatrix}  
2-\lambda & 1\\  
0 & 3-\lambda
\end{bmatrix}
= 0
$$

Characteristic polynomial:

$$
(2-\lambda)(3-\lambda)-1\cdot0 = 0
$$

$\lambda = 2$ and $\lambda = 3$.

General formula:

$$
\boxed{det(\mathbf{A} - \lambda \mathbf{I}) = 0}
$$

### Finding Eigenvectors

Solve the equations:

$$
\begin{bmatrix}  
2 & 1\\  
0 & 3
\end{bmatrix}
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
=
2
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
$$

$$
\begin{bmatrix}  
2 & 1\\  
0 & 3
\end{bmatrix}
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
=
3
\cdot
\begin{bmatrix}  
x\\  
y
\end{bmatrix}
$$

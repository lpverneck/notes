---
title: Linear Transformation (LT)
created: 2025-01-23
tags:
  - completed
publish: true
---
## Matrices as Linear Transformation (LT)

Matrices can be used to map a vector from a space to another one, acting like a factor for changing coordinates (LT).

![[Pasted image 20250123181808.png]]

Also, given some mapped vectors is possible to obtain the matrix $\mathbf{M}$ responsible by the linear transformation:

$$
\mathbf{M} = \begin{bmatrix}  
? & ?\\  
? & ?
\end{bmatrix}
$$

$$
\mathbf{M}
\cdot
\begin{bmatrix}  
0\\  
1
\end{bmatrix}
=
\begin{bmatrix}  
2\\  
3
\end{bmatrix}
$$

$$
\mathbf{M}
\cdot
\begin{bmatrix}  
1\\  
0
\end{bmatrix}
=
\begin{bmatrix}  
3\\  
-1
\end{bmatrix}
$$

$$
\mathbf{M} = 
\begin{bmatrix}  
3 & 2\\  
-1 & 3
\end{bmatrix}
$$

## Matrix vs Matrix Multiplication

The multiplication of one matrix by another one can be interpreted as a combined two consecutive linear transformations. In the expression below the linear transformation $\mathbf{A}$ occurs after the first LT $\mathbf{B}$.

$$
\mathbf{A}_{2 \times \mathbf{3}}\cdot\mathbf{B}_{\mathbf{3} \times 4} = \mathbf{C}_{2 \times 4}
$$

## Singularity and Rank of LT

- The singular LT basis only covers a small piece of the plane (line or a point).
- The dimension of the basis is equal to the LT rank.
- The determinant can be seen as the area or volume of the LT basis.

## Bases

A basis is a vector set that satisfies the two conditions:

- They are linear independently
- The set spans a vector space

> [!warning] Attention
> Not all sets of $N$ vectors are a basis for $N$-dimensional space.

![[CleanShot 2025-01-24 at 06.41.57.png]]

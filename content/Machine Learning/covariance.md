---
title: Covariance
created: 2025-01-24
tags:
  - completed
publish: true
---
The covariance helps to measure how two variables varies with respect to one another. It measures the direction of the relationship between two variables.

$$
COV(x,y) = \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\mu(x))(y_i-\mu(y))
$$

![[Pasted image 20250129183242.png]]

## Covariance Matrix

![[Pasted image 20250129183838.png]]

$$
C = \begin{bmatrix}  
COV(x,x) & COV(x,y)\\  
COV(y,x) & COV(y,y) \\
\end{bmatrix}
=
\begin{bmatrix}  
VAR(x) & COV(x,y)\\  
COV(y,x) & VAR(y) \\
\end{bmatrix}
$$

$$
\mathbf{A} = \begin{bmatrix}  
x_1 & y_1\\  
x_2 & y_2 \\
\vdots & \vdots \\
x_n & y_n
\end{bmatrix}
\quad\quad
\mathbf{\mu} =
\begin{bmatrix}  
\mu_x & \mu_y\\  
\mu_x & \mu_y \\
\vdots & \vdots \\
\mu_x & \mu_y
\end{bmatrix}
$$

$$
\boxed{C=\frac{1}{n-1}(\mathbf{A} - \mathbf{\mu})^T(\mathbf{A} - \mathbf{\mu})}
$$

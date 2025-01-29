---
title: Principal Component Analysis (PCA)
created: 2025-01-24
tags:
  - completed
publish: true
---
Is a technique commonly used in [[machine-learning|machine learning]] for data complexity reduction. Based on the concept of [[algebra-projections|projections]], the goal is to reduce the number of total variables used in the analysis.

- Leads to smaller datasets while minimizing information loss.
- Turn data easier to be visualized.

The main idea here is to project the data into the directions with most variance. Combining the concepts of [[eigenvalues-eigenvectors|eigenvalues and eigenvectors]], [[algebra-projections|projections]] and [[covariance|covariance matrix]] is possible to find these directions. The covariance matrix $C$ characterizes the spread of the data, it's eigenvectors tells the direction in which the matrix can be viewed as just a straight stretching and the largest eigenvalue tells which stretching is greatest.

> [!note] Note
> Larger the eigenvalue larger the variance when projecting data.

## Mathematical Formulation

1. Given a dataset matrix $\mathbf{X}_{n \times m}$ where $n$ is the number of observations and $m$ is the number of variables (features).
2. Center the data, calculating $\mathbf{X} - \mathbf{\mu}$
3. Calculate the [[covariance|covariance matrix]]
$$C=\frac{1}{n-1}(\mathbf{X} - \mathbf{\mu})^T(\mathbf{X} - \mathbf{\mu})$$
4. Calculate the [[eigenvalues-eigenvectors|eigenvalues and eigenvectors]] for the matrix $C$ and sort them from largest to smallest.
5. Create the projection matrix:
$$
V = \begin{bmatrix}  
\frac{\vec{v_1}}{\|\vec{v_1}\|_2} & \frac{\vec{v_2}}{\|\vec{v_2}\|_2}\\
\end{bmatrix}
$$
6. Project centered data
$$\mathbf{X_{PCA}} = (\mathbf{X} - \mathbf{\mu})\mathbf{V}$$

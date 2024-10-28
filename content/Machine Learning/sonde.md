---
title: Self-Organizing Novelty Detector (SONDE)
created: 2024-10-25
tags:
  - active
publish: true
---
It operates by incrementally learning patterns and identifying unexpected events in dynamic environments. Is a unsupervised and adaptative method with a algorithmic complexity $O(n^2)$.

Based on two strategies:

- GWR: Grow When Required
- SOM: Self-Organizing Maps

Main parameters:

- $\alpha$: Changes the cluster centroid
- $\sigma$: Controls the Gaussian spread
- $\beta$: Sigma adaptation for each specific cluster

In the context of [[markov-chains|Markov Chains]] each cluster defined by a Gaussian represents one possible state on the chain.


```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from ucimlrepo import fetch_ucirepo
```


```python
data = np.array(
    [
        [5, 5],
        [5.2, 4.8],
        [4.7, 5.3],
        [10, 10],
        [10.2, 9.8],
        [9.7, 10.3],
        [5, 5],
    ]
)
data
```




    array([[ 5. ,  5. ],
           [ 5.2,  4.8],
           [ 4.7,  5.3],
           [10. , 10. ],
           [10.2,  9.8],
           [ 9.7, 10.3],
           [ 5. ,  5. ]])




```python
def get_closest_gaussian(example, centroids, sigma, threshold=1e-3):
    """Find the closest Gaussian cluster from the example point. If no clusters
    have been created the function return -1."""
    # check if there is no centroids
    if centroids.size == 0:
        return -1

    euclidian_distance = np.apply_along_axis(
        lambda center: (np.sum((center - example) ** 2)) ** (1 / 2),
        1,
        centroids,
    )
    activation = np.exp(-(euclidian_distance**2) / (2 * sigma**2))
    idx = activation.argmax()

    # manages the sensitivity for new clusters creation
    if activation[idx] < threshold:
        return -1
    return idx


def estimate_markov_chain_entropy_rate(adj_mat: np.array) -> float:
    """Calculates the Shannon entropy for a Markov Chain given your
    adjacency matrix representation."""
    return -1 * np.sum(adj_mat * np.log2(adj_mat))


def sonde(X, alpha=0.01, sigma=1, eps=1e-7, delta=0.01, verbose=True):
    d = X.shape[1]
    centroids = np.empty((0, d))
    old_pos = -1
    curr_pos = -1
    markov = None
    old_H = -1
    curr_H = -1
    H = []
    delta_H = []

    for point in X:
        example = point.reshape(1, d)
        curr_pos = get_closest_gaussian(example, centroids, sigma)

        if curr_pos == -1:
            # create a new Gaussian
            if centroids.size == 0:
                centroids = np.concatenate((centroids, example), axis=0)
                curr_pos = 0
                markov = np.array([[eps]])
            else:
                centroids = np.concatenate((centroids, example), axis=0)
                curr_pos = centroids.shape[0] - 1

            if centroids.shape[0] > 1:
                markov = np.pad(
                    markov,
                    ((0, 1), (0, 1)),
                    mode="constant",
                    constant_values=eps,
                )
        else:
            # adapt an existing Gaussian
            centroids[curr_pos, :] = (1 - alpha) * centroids[
                curr_pos, :
            ] + alpha * example

        if old_pos != -1:
            markov[old_pos, curr_pos] = markov[old_pos, curr_pos] + delta
            if verbose:
                print(f"Moved from state ( {old_pos} ) to ( {curr_pos} )")

        # normalize the adjacency matrix
        for i in range(markov.shape[0]):
            markov[i] = markov[i, :] / sum(markov[i, :])

        # calculate the entropy
        curr_H = estimate_markov_chain_entropy_rate(markov)
        H.append(curr_H)

        # calculate the entropy difference
        if old_H != -1:
            delta_H.append(curr_H - old_H)

        if verbose:
            print(f"Markov Adjacency Matrix:\n{markov}")
            print("-" * 50)

        old_pos = curr_pos
        old_H = curr_H

    return delta_H, H, centroids, markov
```


```python
dH, H, centroids, markov = sonde(X=data, verbose=True)
```

    Markov Adjacency Matrix:
    [[1.]]
    --------------------------------------------------
    Moved from state ( 0 ) to ( 0 )
    Markov Adjacency Matrix:
    [[1.]]
    --------------------------------------------------
    Moved from state ( 0 ) to ( 0 )
    Markov Adjacency Matrix:
    [[1.]]
    --------------------------------------------------
    Moved from state ( 0 ) to ( 1 )
    Markov Adjacency Matrix:
    [[0.99009891 0.00990109]
     [0.5        0.5       ]]
    --------------------------------------------------
    Moved from state ( 1 ) to ( 1 )
    Markov Adjacency Matrix:
    [[0.99009891 0.00990109]
     [0.4950495  0.5049505 ]]
    --------------------------------------------------
    Moved from state ( 1 ) to ( 1 )
    Markov Adjacency Matrix:
    [[0.99009891 0.00990109]
     [0.49014802 0.50985198]]
    --------------------------------------------------
    Moved from state ( 1 ) to ( 0 )
    Markov Adjacency Matrix:
    [[0.99009891 0.00990109]
     [0.49519606 0.50480394]]
    --------------------------------------------------



```python
centroids
```




    array([[ 4.9989902,  5.0010098],
           [ 9.99898  , 10.00102  ]])




```python
# plt.plot(dH);
```


```python
# fetch dataset
# iris = fetch_ucirepo(id=53)

# data (as pandas dataframes)
# X = iris.data.features
# y = iris.data.targets
```


```python
# dH, H, centroids, markov = sonde(X=X.sample(frac=1).values, verbose=False)
```

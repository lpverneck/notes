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

In the context of __Markov Chains__ each cluster defined by a Gaussian represents one possible state on the chain.


```python
import numpy as np
import pandas as pd
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
    if centroids.size == 0:
        return -1

    euclidian_distance = np.apply_along_axis(
        lambda center: (np.sum((center - example) ** 2)) ** (1 / 2),
        1,
        centroids,
    )
    activation = np.exp(-(euclidian_distance**2) / (2 * sigma**2))
    idx = activation.argmax()
    if activation[idx] < threshold:
        return -1
    return idx


def sonde(X, alpha=0.01, sigma=1):
    d = X.shape[1]
    centroids = np.empty((0, d))
    old_pos = -1
    curr_post = -1
    markov = None

    for point in X:
        example = point.reshape(1, d)
        curr_post = get_closest_gaussian(example, centroids, sigma)
        # print(idx)
        if curr_post == -1:
            # create a new Gaussian
            if centroids.size == 0:
                centroids = np.concatenate((centroids, example), axis=0)
                curr_post = 0
            else:
                centroids = np.concatenate((centroids, example), axis=0)
                curr_post = centroids.shape[0] - 1
                # if curr_post
            # markov = pass
        else:
            # adapt an existing Gaussian
            centroids[curr_post, :] = (1 - alpha) * centroids[
                curr_post, :
            ] + alpha * example

        if old_pos != -1:
            print(f"Move from position ( {old_pos} ) to ( {curr_post} )")

        old_pos = curr_post

    print("-" * 50)
    print(f"Centroids:\n\n{centroids}")
```


```python
sonde(X=data)
```

    Move from position ( 0 ) to ( 0 )
    Move from position ( 0 ) to ( 0 )
    Move from position ( 0 ) to ( 1 )
    Move from position ( 1 ) to ( 1 )
    Move from position ( 1 ) to ( 1 )
    Move from position ( 1 ) to ( 0 )
    --------------------------------------------------
    Centroids:

    [[ 4.9989902  5.0010098]
     [ 9.99898   10.00102  ]]

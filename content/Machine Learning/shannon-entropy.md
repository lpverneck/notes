---
title: Shannon Entropy
tags:
  - completed
publish: true
---
The Shannon entropy is a statistical quantifier extensively used for the characterization of complex systems. It can be interpreted as:

- __Measure of Uncertainty:__ It quantifies the unpredictability of information content. Higher entropy indicates greater uncertainty or variability in the outcomes of a random variable.
- __Information Content:__ It represents the average number of bits needed to encode messages from a source. A source with uniform probability distribution (where all outcomes are equally likely) has maximum entropy, while a deterministic source (where one outcome is certain) has zero entropy.

$$H(s) = -\sum_{i=1} P_i \log_2 P_i$$

When observed over time, the entropy is frequently used for anomalies detection. Expressive variations in the entropy $H(s)$ levels of a system can indicate a significant change in the system itself.
$$\Delta H(s) = H(s)_{t+1} - H(s)_{t}$$


```python
import math
import numpy as np
import pandas as pd
from typing import Tuple
```


```python
def message_entropy(msg: str, base: int = 2) -> Tuple:
    """Calculates the Shannon entropy of a string message."""
    add = 0
    symbols = {}
    n = len(msg)
    chars = set(list(msg))
    for char in chars:
        proba = msg.count(char) / n
        add += proba * math.log(proba, base)
        symbols[char] = proba
    return add * -1, symbols
```


```python
h, symbols = message_entropy(msg="successful", base=2)
print(f"Entropy: {h:.4f}\nSymbols: {symbols}")
```

    Entropy: 2.4464
    Symbols: {'u': 0.2, 'f': 0.1, 'l': 0.1, 's': 0.3, 'c': 0.2, 'e': 0.1}



```python
h, symbols = message_entropy(msg="successful", base=6)
print(f"Entropy: {h:.4f}\nSymbols: {symbols}")
```

    Entropy: 0.9464
    Symbols: {'u': 0.2, 'f': 0.1, 'l': 0.1, 's': 0.3, 'c': 0.2, 'e': 0.1}



```python
h, symbols = message_entropy(msg="HELLO", base=2)
print(f"Entropy: {h:.4f}\nSymbols: {symbols}")
```

    Entropy: 1.9219
    Symbols: {'E': 0.2, 'O': 0.2, 'L': 0.4, 'H': 0.2}


- 1.92 (~ 2) bits needed for encode each symbol in the message.

| Symbol | Code |
|--------|------|
| H      | 00   |
| E      | 01   |
| L      | 10   |
| O      | 11   |

## Entropy Rate of a Markov Chain


```python
adj_mat_A = np.array([[0, 1, 0], [0.25, 0.5, 0.25], [0.5, 0.5, 0]])
pd.DataFrame(
    adj_mat_A,
    index=["(Origin) State 1", "(Origin) State 2", "(Origin) State 3"],
    columns=["State 1", "State 2", "State 3"],
)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State 1</th>
      <th>State 2</th>
      <th>State 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>(Origin) State 1</th>
      <td>0.00</td>
      <td>1.0</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>(Origin) State 2</th>
      <td>0.25</td>
      <td>0.5</td>
      <td>0.25</td>
    </tr>
    <tr>
      <th>(Origin) State 3</th>
      <td>0.50</td>
      <td>0.5</td>
      <td>0.00</td>
    </tr>
  </tbody>
</table>
</div>




```python
# changing the system's probabilities
adj_mat_B = np.array([[0, 1, 0], [0.05, 0.9, 0.05], [0.05, 0.95, 0]])
pd.DataFrame(
    adj_mat_B,
    index=["(Origin) State 1", "(Origin) State 2", "(Origin) State 3"],
    columns=["State 1", "State 2", "State 3"],
)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State 1</th>
      <th>State 2</th>
      <th>State 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>(Origin) State 1</th>
      <td>0.00</td>
      <td>1.00</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>(Origin) State 2</th>
      <td>0.05</td>
      <td>0.90</td>
      <td>0.05</td>
    </tr>
    <tr>
      <th>(Origin) State 3</th>
      <td>0.05</td>
      <td>0.95</td>
      <td>0.00</td>
    </tr>
  </tbody>
</table>
</div>




```python
# adding a new state
adj_mat_C = np.array(
    [[0, 1, 0, 0], [0.025, 0.8, 0.025, 0.15], [0.05, 0.95, 0, 0], [0, 0, 0, 0]]
)
pd.DataFrame(
    adj_mat_C,
    index=[
        "(Origin) State 1",
        "(Origin) State 2",
        "(Origin) State 3",
        "(Origin) State 4",
    ],
    columns=["State 1", "State 2", "State 3", "State 4"],
)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State 1</th>
      <th>State 2</th>
      <th>State 3</th>
      <th>State 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>(Origin) State 1</th>
      <td>0.000</td>
      <td>1.00</td>
      <td>0.000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>(Origin) State 2</th>
      <td>0.025</td>
      <td>0.80</td>
      <td>0.025</td>
      <td>0.15</td>
    </tr>
    <tr>
      <th>(Origin) State 3</th>
      <td>0.050</td>
      <td>0.95</td>
      <td>0.000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>(Origin) State 4</th>
      <td>0.000</td>
      <td>0.00</td>
      <td>0.000</td>
      <td>0.00</td>
    </tr>
  </tbody>
</table>
</div>




```python
def estimate_markov_chain_entropy_rate(adj_mat: np.array) -> float:
    """Calculates the Shannon entropy for a Markov Chain given your
    adjacency matrix representation."""
    m = adj_mat + 1e-10
    m_norm = np.apply_along_axis(
        arr=m, func1d=lambda row: row / sum(row), axis=1
    )
    return -1 * np.sum(m_norm * np.log2(m_norm))
```


```python
estimate_markov_chain_entropy_rate(adj_mat_A)
```




    2.5000000103485926




```python
estimate_markov_chain_entropy_rate(adj_mat_B)
```




    0.8553925621663911




```python
estimate_markov_chain_entropy_rate(adj_mat_C)
```




    3.2205806955477687



There are two possibilities for changes in a system represented by Markov chains:

- Without new states creation - __Temporal entropy variation__
- With new states creation - __Spatial entropy variation__ (have a greater impact on entropy variation)

This strategy can be used to monitor concept drift in both the __pre-modeling__ and __post-modeling__ phases by detecting changes in a model's response.

## Spatial Entropy

Moreover, as proposed by Von Neumann, the Shannon entropy can be used to describe the spatial etropy and thus serving as a criterion for choosing spaces.

Using normalized eigenvalues from Principal Component Analysis (PCA) as probabilities to estimate the entropy of a data space involves several key steps. This technique leverages the relationship between eigenvalues, variance, and information content in datasets.

The spatial entropy value provides insight into the complexity or disorder within the dataset. A higher entropy indicates a more complex structure with less predictability, while lower entropy suggests a more ordered and predictable structure.

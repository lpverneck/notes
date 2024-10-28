---
title: Markov Chains
created: 2024-10-28
tags:
  - active
publish: true
---
### Properties

- Memoryless: the future state depends only on the current state, not the steps before.
$$P(X_{n+1}=x|X_n=x_n)$$
- The sum of the weights of the outgoing arrows from any state is equal to 1.
- Stationary distribution: after a simulation of random walk, it's the probability of occurrence of each state.
- Adjacent Matrix or Transition Matrix:
$$A = \begin{array}{c|ccc} & S_1 & S_2 & S_3 \\ \hline S_1 & 0.1 & 0.6 & 0.3 \\ S_2 & 0.4 & 0.2 & 0.4 \\ S_3 & 0.5 & 0.5 & 0.0 \end{array}$$
- Getting the stationary distribution:
$$\pi_0 = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}$$
$$\pi A=\pi$$
- Similar to:
$$A\upsilon = \lambda\upsilon$$
$$\pi[1]+\pi[2]+\pi[3]=1$$
- Transient state: when there is no way to come back to this state.
- Recurrent state: when it's possible to return to the state.
- Reducible (chain with transient states) and Irreducible chain (chain with only recurrent states).
- Communication classes: are sub-divisions of the the chain.

### N-step Transition Matrix

Given a Markov Chain, what is the probability of reaching a state $j$ from state $i$ after exactly $n$ steps ?
$$P_{ij}(n)$$
$$P_{ij}(1)=A_{ij}$$
$$P_{ij}(2)=A^2_{ij}$$
$$P_{ij}(n)=A^n_{ij}$$
### Chapman-Kolmogorov Theorem

$$P_{ij}(n)=\sum_{k}P_{ik}(r)\times P_{kj}(n-r)$$
- Markov chains key components:
$$MC = \{States, Transitions\}$$

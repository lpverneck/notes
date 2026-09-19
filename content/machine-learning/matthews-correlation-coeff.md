---
title: Matthews correlation coefficient (MCC)
created at: 2026-09-18
modified at: 2026-09-18
tags:
  - completed
publish: true
---

It's an efficient way to calculate the performance of models on **binary classification problems**. It measures the correlation between the predicted classification output values and the expected ones.

The values range from $-1$ up to $+1$:

- $+1$: perfect prediction
- $0$: no better than random guessing
- $-1$: total disagreement between the actual and predicted values

It's very robust to imbalanced-class datasets. Different from the [[f1-score|F1-score]] the MCC metric takes into account the **negative class** too.

MCC is calculated using all four [[confusion-matrix|confusion-matrix]] elements: True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN):

$$
MCC = \frac{(TP \times TN) - (FP \times FN)}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}
$$

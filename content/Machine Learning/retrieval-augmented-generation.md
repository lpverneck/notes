---
title: Retrieval Augmented Generation (RAG)
created: 2025-03-12
tags:
  - completed
publish: true
---
Retrieval Augmented Generation (RAG) is a way to enhance a specific context comprehension by a Large Language Model (LLM). This approach combines a database information retrieval with LLMs reasoning capabilities.

## RAG Pipeline

```mermaid
flowchart TD
A[Query] -->B(Embeddings)
C[Documents] -->D(Split into chunks)
E[Web Pages] -->D(Split into chunks)
D -->F(Embeddings)
F -->|Store| G(Vector DB)
B -->|Search| G
G --> |Top-K| H(Context)
A --> I(Prompt Template)
H --> I(Prompt Template)
I --> J(LLM)
J --> K[Answer]
```

## Embedding Vectors

## Cosine Similarity Score

$$S_c(A, B) :=cos(\theta) = \frac{\mathbf{A}\cdot\mathbf{B}}{\|\mathbf{A}\|\cdot\|\mathbf{B}\|}$$

## Vector Databases

## Hierarchical Navigable Small Worlds (HNSW)

Trade precision for speed.


---
title: "VERA: Validation and Enhancement for Retrieval Augmented systems"
created: 2025-02-01
tags:
  - completed
publish: true
---
Paper: https://arxiv.org/pdf/2409.15364v1

VERA is a framework that contributes to validation and also enhancement of retrieval augmented systems powered by large language models (LLM). The method proposes a way to measure the relevance both for the retrieved information and the LLM final response.

These are the three metrics inferred from the framework:

- Retrieved context relevance
- Response relevance
- Response adherence

## VERA Framework

```mermaid

flowchart LR
A(User) -->|Query| B{VERA}
E(Retrieved Context) -->|RAG| B{VERA}
B{VERA} --> F(Enhanced Context)
F(Enhanced Context) --> G(LLM)
G(LLM) --> |Response| B{VERA}
B{VERA} --> C(Final Answer)
```

Similar to [[factual-correctness|Factual Correctness]] for estimate the LLM response relevance and adherence this paper uses a strategy of breakdown the complete response into smaller statements.
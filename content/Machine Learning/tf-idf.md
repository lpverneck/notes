---
title: Term Frequency-Inverse Document Frequency (TF-IDF)
created: 2025-03-28
tags:
  - completed
publish: true
---
Term Frequency-Inverse Document Frequency (TF-IDF) measures how important a word is to a document considering the document context (collection of documents also called corpus). Is a method to vectorize a non-structured text data into structured tabular data.

TF-IDF plays a important role in tasks such as text mining, information retrieval ([[retrieval-augmented-generation|RAG]]) and document classification.

## Term Frequency (TF)

Measures the frequency of a term $T$ within a document $D$.

- $Freq \quad T(D)$: number of times that a term $T$ appears in a document $D$.
- $Total\quad Terms(D)$: number of total terms in a document $D$.

$$
TF(T,D) = \frac{Freq \quad T(D)}{Total\quad Terms(D)}
$$

## Inverse Document Frequency (IDF)

Measures the rarity of a term across the corpus $C$. This part aims to penalize words that are common across all documents within collection.

- $N$: total number of documents in the collection $C$.
- $Doc\quad Freq(T)$: number of documents where $T$ is present.

$$
IDF(T,C) = ln(\frac{N}{Doc\quad Freq(T)})
$$

$$
IDF(T,C) = ln(\frac{N}{Doc\quad Freq(T)}) + 1
$$

### Smooth IDF

The smooth IDF weights by adding one to document frequencies, as if an extra document was seen containing every term in the collection exactly once. This approach prevents zero divisions.

$$
IDF(T,C) = ln(\frac{N + 1}{Doc\quad Freq(T) + 1}) + 1
$$

## Combining TF-IDF

Multiplying TF and IDF gives the TF-IDF score of a word in a document. The higher the score, the more relevant that word is in that particular document.

$$
TF-IDF(T,D,C) = TF(T,D) \times IDF(T, C)
$$
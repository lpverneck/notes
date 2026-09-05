---
title: Lorem Ipsum Showcase
description: Página de teste com diversos recursos de Markdown para validar tipografia, cores e componentes do tema.
tags:
  - showcase
  - typography
---

# Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**, sed do eiusmod _tempor incididunt_ ut labore et dolore magna aliqua. Ut enim ad minim veniam, ~~quis nostrud exercitation~~ ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in `reprehenderit` in voluptate velit esse cillum dolore.

==Este trecho está destacado (highlight) para testar a cor de `textHighlight`.==

> [!note] Nota rápida
> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

> [!warning] Atenção
> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Listas

Lista não ordenada, com aninhamento:

- Lorem ipsum dolor sit amet
  - Consectetur adipiscing elit
  - Sed do eiusmod tempor incididunt
- Ut enim ad minim veniam
- Quis nostrud exercitation ullamco

Lista ordenada:

1. Duis aute irure dolor in reprehenderit
2. Excepteur sint occaecat cupidatat
3. Non proident sunt in culpa qui officia

Lista de tarefas:

- [x] Configurar fonte Inter no corpo do texto
- [x] Configurar fonte Fira Code nos blocos de código
- [ ] Revisar paleta de cores light/dark
- [ ] Validar responsividade mobile

## Citação

> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
>
> — Autor Desconhecido

## Tabela

| Recurso            | Plugin                                  | Status |
| ------------------ | --------------------------------------- | :----: |
| Tipografia         | `@quartz-community/quartz-fonts`        |   ✅   |
| Realce de código   | `@quartz-community/syntax-highlighting` |   ✅   |
| Tabela de conteúdo | `@quartz-community/table-of-contents`   |   ✅   |
| LaTeX              | `@quartz-community/latex`               |   ✅   |

## Código

Bloco de código em Python, para validar a fonte monoespaçada:

```python
# Storing different data types
name = "Alice"          # String (text)
age = 25                 # Integer (whole number)
height = 5.6             # Float (decimal number)
is_student = True        # Boolean (True/False)

# Displaying variables using an f-string
print(f"{name} is {age} years old.")
```

Bloco de código em TypeScript, com ligaduras (`=>`, `!==`, `>=`):

```typescript
interface Note {
  title: string
  tags: string[]
}

const isPublished = (note: Note): boolean => {
  return note.tags.length >= 1 && note.title !== ""
}
```

E também código inline como `const x = 42` no meio de uma frase lorem ipsum nascetur ridiculus mus.

## Matemática

A fórmula de Euler, inline: $e^{i\pi} + 1 = 0$.

E em bloco:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## Links e referências

Lorem ipsum com um [link externo](https://quartz.jzhao.xyz/) e uma nota de rodapé[^1].

---

Nulla facilisi. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis.

[^1]: Esta é uma nota de rodapé de teste, gerada via sintaxe GFM.


## Notebook

[micrograd.ipynb](notebooks/nn/micrograd.ipynb)

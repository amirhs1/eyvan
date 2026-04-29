---
layout: post
title: Technical and Academic Writing
subtitle: Code, equations, tables, and citations in practice
tags: [technical-writing, academic-writing, code, math, research]
math: true
image: "assets/images/posts/25.png"
description: A realistic technical article demonstrating code, math, tables, footnotes, and citation styles.
toc: true
---

## Introduction

This post demonstrates how technical and academic content can be structured in a clean, readable format. It combines code, mathematical notation, tables, and citation styles into a single cohesive document.

---

## Code Example

```python
def simulate_system(n):
    results = []
    for i in range(n):
        results.append(i ** 2)
    return results

print(simulate_system(5))
```

---

## Mathematical Explanation

Inline math: $E = mc^2$

Display math:

$$
f(x) = \alpha x^2 + \beta x + \gamma
$$

---

## Data Tables

### Simple Table

| Variable | Description |
|----------|-------------|
| $x$      | Input value |
| $f(x)$   | Output      |

### Table with Caption

<table>
<caption>Sample Results Table</caption>
<thead>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>2</td>
<td>4</td>
</tr>
</tbody>
</table>

---

## Footnotes

This is an example of a footnote reference[^1].

[^1]: This is a sample footnote explaining additional context.

---

## Citation Examples

### API

Smith, J. A. (2024). Modeling uncertainty in small systems. *Journal of Applied Methods, 12*(3), 44–58.

### APS

J. A. Smith, Journal of Applied Methods **12**, 44 (2024).

### IEEE

[1] J. A. Smith, “Modeling uncertainty in small systems,” *Journal of Applied Methods*, vol. 12, no. 3, pp. 44–58, 2024.

---

## References

[1] J. A. Smith, “Modeling uncertainty in small systems,” *Journal of Applied Methods*, 2024.

---

## Reproducibility Note

All code snippets are minimal examples. For reproducibility, consider sharing full scripts or notebooks.

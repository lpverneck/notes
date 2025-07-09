---
title: JSONL
created: 2025-07-09
tags:
  - completed
publish: true
---
JSONL (JSON Lines), also called 'newline-delimited JSON', is a text-based data format where each line in a file is a valid [[json|JSON]] object. One JSONL file consist of multiple JSON objects, each written on its own line and separated by newline characters. 

It's line-based structure makes it ideal for applications where incremental processing, scalability, and resilience are important.

## Key Characteristics

- **Line-by-line structure**: each line is an independent JSON object.
- **Efficient processing**: allows to process large datasets one record at a time, without loading the entire file into memory.
- **Easy to append**: new data can be added simply by appending a new line.
- **Ideal for streaming**: well-suited for applications that generate or process data continuously, such as logs or sensor data.
- **File extension**: `.jsonl`

## Example

```jsonl
{"name": "Alice", "age": 28, "city": "New York"}
{"name": "Bob", "age": 35, "city": "San Francisco"}
{"name": "Charlie", "age": 42, "city": "Chicago"}
```

## Handling with Code

```python
import json


# Reading a '.jsonl' file
with open("data.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        record = json.loads(line)
        print(record)  # each record is a Python dict


# Writing to a '.jsonl' file
records = [
    {"name": "Alice", "age": 28, "city": "New York"},
    {"name": "Bob", "age": 35, "city": "San Francisco"},
    {"name": "Charlie", "age": 42, "city": "Chicago"}
]

with open("output.jsonl", "w", encoding="utf-8") as f:
    for record in records:
        f.write(json.dumps(record) + "\n")


# Appending to a '.jsonl' file
new_record = {"name": "Lucas", "age": 31, "city": "Paris"}

with open("output.jsonl", "a", encoding="utf-8") as f:
    f.write(json.dumps(new_record) + "\n")
```
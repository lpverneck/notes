---
title: Python-dotenv
created at: 2024-10-24
modified at: 2024-10-24
tags:
  - completed
  - tools
publish: true
---

The [python-dotenv](https://github.com/theskumar/python-dotenv) library reads key-value pairs from a `.env` file and creates new [[environment-variables|environment variables]] from them.

## Usage example

```python
from pathlib import Path
from dotenv import load_dotenv, find_dotenv


_ = load_dotenv(Path.cwd() / "conf" / "local" / ".env")

# OR

_ = load_dotenv(find_dotenv())
```

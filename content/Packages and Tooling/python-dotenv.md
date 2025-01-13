---
title: Dotenv
created: 2024-10-24
tags:
  - completed
publish: true
---
The python-dotenv library reads key-value pairs from a `.env` file and create new [[environment-variables|environment variables]] from them.

```python title="Usage"
from pathlib import Path
from dotenv import load_dotenv, find_dotenv


_ = load_dotenv(Path.cwd() / "conf" / "local" / ".env")

# OR

_ = load_dotenv(find_dotenv())
```
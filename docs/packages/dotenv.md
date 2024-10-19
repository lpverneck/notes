```py
from pathlib import Path
from dotenv import load_dotenv, find_dotenv


_ = load_dotenv(Path.cwd() / "conf" / "local" / ".env")
# OR
_ = load_dotenv(find_dotenv())
```

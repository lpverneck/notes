---
title: Logging
created: 2024-01-16
tags:
  - completed
publish: true
---
Logging is the process of tracking and recording key events that occur in our applications.

## Components

- **Logger:** entity responsible for emit the log messages from the application.
- **Handler:** entity responsible for send log records to a specific location.
- **Formatter:** entity responsible for format and style the log records.

## Priority Levels

```python
import logging
import sys

# Creates the logger
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

# Logging levels (from lowest to highest priority)
logging.debug("Your message for debugging the code.")
logging.info("Messages for informative purpose.")
logging.warning("There is something to be aware of.")
logging.error("Something went wrong.")
logging.critical("Something went very very wrong.")
```

>On line 5 the class parameter `level` sets the baseline level.

## Basic Usage Example

```python
# utils/logging_utils.py
import logging


def get_logger(name: str = None) -> logging.Logger:
	logger = logging.getLogger(name)
	if not logger.handlers:
		handler = logging.StreamHandler()
		formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
		handler.setFormatter(formatter)
		logger.addHandler(handler)
		logget.setlevel(logging.INFO)
	return logger
```

```python
# main.py
from utils.logging_utils import get_logger


logger = get_logger(__name__)

logger.info(f"This is a log: {some_variable}")
```

## Setup

### 1. Log Location

```python
# project_name/config.py

import sys
import logging
import logging.config
from pathlib import Path

LOGS_DIR = Path(BASE_DIR, "logs")
LOGS_DIR.mkdir(parents=True, exist_ok=True)
```

### 2. Define Formatters

```python
# project_name/config.py

logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "minimal": {"format": "%(message)s"},
        "detailed": {
            "format": "%(levelname)s %(asctime)s [%(name)s:%(filename)s:%(funcName)s:%(lineno)d]\n%(message)s\n"
        },
    },
```

### 3. Define Handlers

```python
# project_name/config.py

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "formatter": "minimal",
            "level": logging.DEBUG,
        },
        "info": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": Path(LOGS_DIR, "info.log"),
            "maxBytes": 10485760,  # 1 MB
            "backupCount": 10,
            "formatter": "detailed",
            "level": logging.INFO,
        },
        "error": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": Path(LOGS_DIR, "error.log"),
            "maxBytes": 10485760,  # 1 MB
            "backupCount": 10,
            "formatter": "detailed",
            "level": logging.ERROR,
        },
    },
    "root": {
        "handlers": ["console", "info", "error"],
        "level": logging.INFO,
        "propagate": True,
    },
}
```

### 4. Load Config

```python
# project_name/config.py

# Logger
logging.config.dictConfig(logging_config)
logger = logging.getLogger()

# Using loaded logger
logger.debug("Example message here.")
logger.info("Example message here.")
logger.warning("Example message here.")
logger.error("Example message here.")
logger.critical("Example message here.")
```

### 5. Usage

```python
# project_name/app.py

from config import logger

for epoch in epochs:
    logger.info("Epoch completed !")
```

## References

There are different ways to configure your project's logs, using python scripts or configuration files. Examples below. For more advanced use cases see the [documentation](https://docs.python.org/3/library/logging.html) or the well curated [cookbook](https://docs.python.org/3/howto/logging-cookbook.html).

### Dictionary Setup

```python
# project_name/config.py

import sys
import logging
import logging.config


logging_config = {
  "version": 1,
  "disable_existing_loggers": False,
  "formatters": {
    "default": {
      "format": "%(levelname)s %(asctime)s [%(name)s:%(filename)s:%(funcName)s:%(lineno)d] >> %(message)s",
      "datefmt": "%Y-%m-%d %H:%M:%S",
    },
  },
  "handlers": {
    "default": {
      "class": "logging.StreamHandler",
      "stream": sys.stdout,
      "formatter": "default",
      "level": logging.CRITICAL,
    },
    "file_save": {
      "class": "logging.handlers.RotatingFileHandler",
      "filename": "debug.log",
      "maxBytes": 10485760,  # 1 MB
      "backupCount": 3,
      "formatter": "default",
      "level": logging.ERROR,
    },
  },
  "root": {
    "handlers": ["default", "file_save"],
    "level": logging.DEBUG,
    "propagate": True,
  },
}

logging.config.dictConfig(logging_config)
logger = logging.getLogger()
```

### Configuration File

`logging.config` file:

```config
[formatters]
keys=minimal,detailed

[formatter_minimal]
format=%(message)s

[formatter_detailed]
format=
%(levelname)s %(asctime)s [%(name)s:%(filename)s:%(funcName)s:%(lineno)d]
%(message)s

[handlers]
keys=console,info,error

[handler_console]
class=StreamHandler
level=DEBUG
formatter=minimal
args=(sys.stdout,)

[handler_info]
class=handlers.RotatingFileHandler
level=INFO
formatter=detailed
backupCount=10
maxBytes=10485760
args=("logs/info.log",)

[handler_error]
class=handlers.RotatingFileHandler
level=ERROR
formatter=detailed
backupCount=10
maxBytes=10485760
args=("logs/error.log",)

[loggers]
keys=root

[logger_root]
level=INFO
handlers=console,info,error
```

`file.py` script:

```python
import logging
import logging.config
from rich.logging import RichHandler

# Use config file to initialize logger
logging.config.fileConfig(Path(CONFIG_DIR, "logging.config"))
logger = logging.getLogger()
logger.handlers[0] = RichHandler(markup=True)  # set rich handler
```

### Python Script

```python
import logging
from rich.logging import RichHandler

# Get root logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# Create handlers
console_handler = RichHandler(markup=True)
console_handler.setLevel(logging.DEBUG)
info_handler = logging.handlers.RotatingFileHandler(
  filename=Path(LOGS_DIR, "info.log"),
  maxBytes=10485760,  # 1 MB
  backupCount=10,
)
info_handler.setLevel(logging.INFO)
error_handler = logging.handlers.RotatingFileHandler(
  filename=Path(LOGS_DIR, "error.log"),
  maxBytes=10485760,  # 1 MB
  backupCount=10,
)
error_handler.setLevel(logging.ERROR)

# Create formatters
minimal_formatter = logging.Formatter(fmt="%(message)s")
detailed_formatter = logging.Formatter(
  fmt="%(levelname)s %(asctime)s [%(name)s:%(filename)s:%(funcName)s:%(lineno)d]\n%(message)s\n"
)

# Hook it all up
console_handler.setFormatter(fmt=minimal_formatter)
info_handler.setFormatter(fmt=detailed_formatter)
error_handler.setFormatter(fmt=detailed_formatter)
logger.addHandler(hdlr=console_handler)
logger.addHandler(hdlr=info_handler)
logger.addHandler(hdlr=error_handler)
```

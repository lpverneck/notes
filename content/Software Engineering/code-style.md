---
title: Code Style
created: 2024-01-16
tags:
  - completed
publish: true
---
One of the easiest ways to make code more readable is to follow consistent style and formatting conventions.

## Most Important Aspects

- **Consistency:** follow the same standard.
- **Automation:** formatting should be effortless after the initial configuration.

## Tools

### Black

- A code formatter that (mostly) adheres to PEP8 convention.
- [Documentation](https://black.readthedocs.io/en/stable/#)

**Configuration:**

```python
# pyproject.toml

[tool.black]
line-length = 120
include = '\.pyi?$'
exclude = '''
/(
      .eggs         # exclude a few common directories in the
    | .git          # root of the project
    | .hg
    | .mypy_cache
    | .tox
    | venv
    | _build
    | buck-out
    | build
    | dist
  )/
'''
```

### iSort

- Sorts and formats import statements inside Python scripts.
- [Documentation](https://pycqa.github.io/isort/)

**Configuration:**

```python
# pyproject.toml

[tool.isort]
profile = "black"
line_length = 79
multi_line_output = 3
include_trailing_comma = true
virtual_env = "venv"
```

### Flake8

- A code linter with stylistic conventions that adhere to PEP8 convention.
- [Documentation](https://flake8.pycqa.org/en/latest/)

**Configuration:**

```python
# pyproject.toml

[tool.flake8]
exclude = "venv"
ignore = ["E501", "W503", "E226"]
# E501: Line too long
# W503: Line break occurred before binary operator
# E226: Missing white space around arithmetic operator
```

>Using `NOQA: <error-code>` on a line, we're specifying flake8 to do *NO* Quality Assurance for that particular error on this line.

### Usage

```bash
black .
flake8
isort .
```

### Makefile

Automatically run these three lines using the Makefile. This can be used to define a set of commands that can be executed with a single command.

```bash
# Makefile
SHELL = /bin/bash

# Styling
.PHONY: style
style:
    black .
    flake8
    python3 -m isort .
    pyupgrade

# Cleaning
.PHONY: clean
clean: style
    find . -type f -name "*.DS_Store" -ls -delete
    find . | grep -E "(__pycache__|\.pyc|\.pyo)" | xargs rm -rf
    find . | grep -E ".pytest_cache" | xargs rm -rf
    find . | grep -E ".ipynb_checkpoints" | xargs rm -rf
    rm -rf .coverage*
```

## Pre-Commit Framework

Using the pre-commit git hooks to ensure that certain rules are followed or specific actions are executed successfully and if any of them fail, the commit will be aborted.

### Install

```bash
pip install pre-commit
pre-commit install
```

### Configuration

```bash
# simple config

pre-commit sample-config > .pre-commit-config.yaml
cat .pre-commit-config.yaml
```

- Built-in Hooks

```yaml
# .pre-commit-config.yaml

...
-   id: check-added-large-files
    args: ['--maxkb=1000']
    exclude: "notebooks"
...
```

- Exclude Key

```yaml
# .pre-commit-config.yaml

...
-   id: check-yaml
    exclude: "mkdocs.yml"
...
```

- Custom Hooks

```yaml
# .pre-commit-config.yaml

...
-   repo: https://github.com/psf/black
    rev: 20.8b1
    hooks:
    -   id: black
        args: []
        files: .
...
```

- Local Hooks

```yaml
# .pre-commit-config.yaml

...
-   repo: local
    hooks:
    -   id: clean
        name: clean
        entry: make
        args: ["clean"]
        language: system
        pass_filenames: false
```

### Running

```bash
# Run
pre-commit run --all-files  # run all hooks on all files
pre-commit run <HOOK_ID> --all-files # run one hook on all files
pre-commit run --files <PATH_TO_FILE>  # run all hooks on a file
pre-commit run <HOOK_ID> --files <PATH_TO_FILE> # run one hook on a file
```

### Skip Hooks

```bash
# Commit without hooks
git commit -m <MESSAGE> --no-verify
```

### Update

```bash
# Autoupdate
pre-commit autoupdate
```
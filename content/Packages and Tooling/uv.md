---
title: UV
created: 2025-04-23
tags:
  - completed
publish: true
---
[UV](https://docs.astral.sh/uv/) is a really fast Python package and project manager just like [[poetry|Poetry]], but better.

## Installation

```bash
brew install uv
```

> [!note] Note
> Is a good recommendation to [enable shell autocompletion](https://docs.astral.sh/uv/getting-started/installation/#shell-autocompletion) for UV commands.

## Useful Commands

| Command                                        | Category   | Description                                                                                               |
| ---------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `uv init <project_name> --app --lib --package` | Project    | Creates a new Python project with specified structure (application, library, or package)                  |
| `uv add <package_name>`                        | Project    | Adds a package to pyproject.toml, updates uv.lock, and syncs your environment                             |
| `uv add --dev <package_name>`                  | Project    | Adds a development dependency to pyproject.toml and syncs your environment                                |
| `uv remove <package_name>`                     | Project    | Removes the package from pyproject.toml, uv.lock, and syncs your environment                              |
| `uv sync`                                      | Project    | Creates/updates virtual environment, builds dependency list, writes to uv.lock, and installs dependencies |
| `uv lock`                                      | Project    | Generates or updates the uv.lock file with resolved dependencies                                          |
| `uv lock --upgrade package <package_name>`     | Project    | Upgrades a specific package in your uv.lock file according to version constraints                         |
| `uv tree`                                      | Project    | Displays the dependency tree for the current environment                                                  |
| `uv python list`                               | Python Env | Shows available and installed Python versions                                                             |
| `uv python find <python_version>`              | Python Env | Locates a specific Python version on your system                                                          |
| `uv python install <python_version>`           | Python Env | Installs a specific Python version                                                                        |
| `uv python uninstall <python_version>`         | Python Env | Uninstalls a specific Python version                                                                      |
| `uv venv --python <python_version>`            | Python Env | Creates a virtual environment with the specified Python version                                           |
| `uv python pin <python_version>`               | Python Env | Pins a specific Python version for your project                                                           |
| `uv run main.py`                               | Run        | Runs a Python script in the appropriate environment                                                       |
| `uvx ruff <command>`                           | Tools      | Runs the Ruff linter/formatter with specified command (shorthand for uv tool run)                         |
| `uv tool run ruff <command>`                   | Tools      | Runs the Ruff linter/formatter with specified command                                                     |
| `uv tool dir`                                  | Tools      | Shows the directory where tools are installed                                                             |
| `uv tool list`                                 | Tools      | Displays all installed tools                                                                              |
| `uv tool update-shell`                         | Tools      | Updates shell configuration for tool access                                                               |
| `uv tool install <tool_name>`                  | Tools      | Installs a Python tool globally                                                                           |
| `uv tool uninstall <tools_name>`               | Tools      | Uninstalls a previously installed Python tool                                                             |
| `uv tool upgrade <tool_name>`                  | Tools      | Upgrades an installed Python tool to the latest version                                                   |
| `uv build`                                     | Project    | Builds a Python package distribution                                                                      |
| `uv publish`                                   | Project    | Publishes a Python package to PyPI                                                                        |
| `uv self update`                               | uv         | Updates uv itself to the latest version                                                                   |

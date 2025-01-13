---
title: Poetry
created: 2024-10-26
tags:
  - completed
publish: true
---
Poetry is a powerful tool for dependency management and packaging in Python projects. It offers a comprehensive solution for managing project dependencies, virtual environments, and package distribution.

## Useful Commands

| Command                                 | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| `poetry new <project_name>`             | Create a new project                               |
| `poetry init`                           | Initialize a Poetry project on the current folder  |
| `poetry shell`                          | Activate virtual environment                       |
| `poetry add <package_name>`             | Add a dependency                                   |
| `poetry add <package_name> --group dev` | Add a development dependency                       |
| `poetry remove <package_name>`          | Remove a dependency                                |
| `poetry show -tree`                     | Show dependency tree                               |
| `poetry update`                         | Update dependencies                                |
| `poetry install` `--only main`          | Install dependencies                               |
| `poetry env list`                       | List all Poetry virtual environments               |
| `poetry env info`                       | Get information about currently active environment |
| `poetry env remove <env_name>`          | Delete virtual environment                         |
| `poetry build`                          | Builds the project into a distributable format     |
| `poetry publish`                        | Publish the project                                |
| `exit`                                  | Close the current active environment               |

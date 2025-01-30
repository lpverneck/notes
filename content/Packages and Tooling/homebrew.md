---
title: Homebrew
created: 2025-01-30
tags:
  - completed
publish: true
---
## What is ?

Homebrew is a package management system for macOS, it simplifies software installation. The tool install the packages to their own directory and then symlinks their files into `/opt/hombebrew` directory.

## Useful Commands

| Command                                         | Description                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `brew install --cask <package>`                 | Install a package                                                                     |
| `brew update`                                   | Updates Homebrew and its packages (brew and cask)                                     |
| `brew upgrade <package>`                        | Upgrades installed packages to their latest versions or all packages                  |
| `brew info <package>`                           | List versions, caveats, etc                                                           |
| `brew outdated`                                 | Lists packages that are outdated                                                      |
| `brew doctor`                                   | Checks for potential issues and provides suggestions for fixing them                  |
| `brew cleanup <package>`                        | Removes old versions of installed packages                                            |
| `brew list`                                     | List installed packages                                                               |
| `brew list —-cask`                              | List installed applications                                                           |
| `brew uninstall <package>`                      | Remove/Uninstall a package                                                            |
| `brew leaves`                                   | Lists all installed formulae that are not dependencies of any other installed formula |
| `brew leaves \| xargs brew desc --eval-all`     | Lists and describes top-level packages (those not installed as dependencies)          |
| `brew ls --casks \| xargs brew desc --eval-all` | This command lists and describes all installed casks                                  |

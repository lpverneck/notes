---
title: Git
created at: 2026-09-21
modified at: 2026-09-21
tags:
  - active
publish: true
---

Git is a version control system that allows you to organize and keep a record of your code. It's an essential tool with a wide range of features, commands, and use cases.

## Useful commands

### `git stash`

Creates a backup of all modified files in your project.

| Command                                   | Description                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `git stash` or `git stash push`           | Saves the modified files into a temporary branch and restores the actual branch to the last commit point.                             |
| `git stash push -m "<message>"`           | Creates the stash, adding a descriptive note.                                                                                         |
| `git stash -u`                            | Includes the untracked files in the stash.                                                                                            |
| `git stash list`                          | Shows all stored stashes (most recent stash has index _stash@{0}_).                                                                   |
| `git stash pop`                           | Applies the last stash changes on the present branch and drops it from the list (accepts index).                                      |
| `git stash apply`                         | Applies the last stash changes to the present branch, but it doesn't remove the stash item from the list (accepts index).             |
| `git stash show [-p]`                     | Shows a summary of the modified files from the most recent stash (`-p` shows the entire diff).                                        |
| `git stash drop`                          | Drops the most recent stash from the list (accepts index).                                                                            |
| `git stash clear`                         | Removes all the stashes from the list.                                                                                                |
| `git stash branch <branchname> [<stash>]` | Creates a new branch from the original commit point, applies the changes from the stash into it, and removes the stash from the list. |

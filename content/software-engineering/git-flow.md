---
title: Git flow
created at: 2026-09-21
modified at: 2026-09-26
status: Active
tags:
  - tools
  - swe
publish: true
---

Git is a version control system that allows you to organize and keep a record of your code. It's an essential tool with a wide range of features, commands, and use cases.

It's a widely used tool, but barely understood.

A detailed video series about Git can be found at this [YouTube playlist](https://www.youtube.com/watch?v=_H8_IU1G8G0&list=PLwvDm4VfkdpiALKk34l9mUS2f4mdJPvXq).

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

## Tags and releases

Tags and releases are Git/GitHub features that are related to software versioning strategy e.g. [Semantic Versioning](https://semver.org/).

You can tag any commit. Probably there is a command for this. You can provide a tag name and an optional message too. Is common to use the software version just like `v1.0.0`.

It's a good practice to create a commit to flag a change at the software version. When the changed version is a public release, you can use this flagged commit to generate a **release** by using a tag marker.

> [!example]
> **Semantic Versioning Pattern**: MAJOR.MINOR.PATCH (BUILD)
>
> - Commit 1: Software version change to 0.0.1 (1) [TAG]
> - Commit 2: Add new feature
> - Commit 3: Software version change to 1.0.0 (2) [TAG] [RELEASE]

So in the example above, the Commit 3 represents the software first public version. In this case, we have some kind of release-marked commit. To create a GitHub release, you need to reference the code snapshot using a tag. You can do this process directly into the GitHub. PS: you can provide a release note too and there is an option to create a pre-release.

> [!tip]
> You can `git checkout` a tag just like a branch, or even create a new branch from a tag `git checkout -b <new_branch_name> <tag_name>`.

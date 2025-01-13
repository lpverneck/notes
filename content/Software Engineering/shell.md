---
title: Shell
created: 2024-10-26
tags:
  - active
publish: true
---
## Useful Commands

| Command                                           | Description                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| `pwd`                                             | Show present working directory                                    |
| `cd <dir_name>`                                   | Change directory                                                  |
| `ls`                                              | List directory                                                    |
| `mkdir <dir_name>`                                | Make a directory                                                  |
| `touch <file_name>`                               | Create a new file *                                               |
| `rm <file_name>`                                  | Delete file                                                       |
| `rm -rf <dir_name>`                               | Delete no empty directory                                         |
| `rmdir <dir_name>`                                | Delete only empty directory                                       |
| `man <command>`                                   | Manual page for a command                                         |
| `echo <"text"> or <file_name>`                    | Outputs the strings that are passed to it as arguments            |
| `cat <file_name>`                                 | Show file contents                                                |
| `cp`                                              | Copy file                                                         |
| `mv`                                              | Move or rename file                                               |
| `diff <file_name_1> <file_name_2>`                | Generates output describing the differences between the two files |
| `chmod`                                           | Changes file permission                                           |
| `grep` `grep -r <keyword>` `ls \| grep <keyword>` | Global ReGex Print                                                |
> [!tip] Tip
> For most commands, is possible get more details about it using use the `--help` flag. 

## Running Multiple Commands in One Line

- `;` always run the next command.
- `&&` only run the next command when the first succeeds.
- `||` only run the next command when the first fails.

```bash
# cmd_1; cmd_2
cd <folder_name>; ls

# cmd_1 && cmd_2
cd <folder_name> && ls

# cmd_1 || cmd_2
cd <folder_name> || ls
```
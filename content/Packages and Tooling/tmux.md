---
title: Tmux
created: 2024-10-26
tags:
  - completed
publish: true
---
Tmux, short for terminal multiplexer, is a powerful tool used primarily in Unix-like operating systems. It allows users to manage multiple terminal sessions within a single window, enhancing productivity and multitasking capabilities.

## Main Commands

```bash
# start new session
tmux
tmux new -s <session_name>

# list active sessions
tmux ls

# attach to existing session
tmux attach
tmux attach -t <session_name>

# kill session
tmux kill-session -t <session_name>
tmux rename-session -t 0 <session_name>

# command mode
# rename-window <window_name>
# rename-session <session_name>
```

## Main Shortcuts

The shortcuts described here are slight different from the default ones. They are based on my personal Tmux [configuration file](https://github.com/lpverneck/.dotfiles/blob/main/dot_tmux.conf).

| Shortcut           | Description                      |
| ------------------ | -------------------------------- |
| `CTRL` + `A` `D`   | Detach session                   |
| `CTRL` + `A` `S`   | List active sessions and windows |
| `CTRL` + `A` `C`   | Create new window                |
| `CTRL` + `A` `N`   | Move to next window              |
| `CTRL` + `A` `<1>` | Move to specific window          |
| `CTRL` + `A` `\|`  | Split pane vertical              |
| `CTRL` + `A` `-`   | Split pane horizontal            |
| `CTRL` + `A` `H`   | Move around panes (Left)         |
| `CTRL` + `A` `J`   | Move around panes (Down)         |
| `CTRL` + `A` `K`   | Move around panes (Up)           |
| `CTRL` + `A` `L`   | Move around panes (Right)        |
| `CTRL` + `A` `,`   | Command mode                     |

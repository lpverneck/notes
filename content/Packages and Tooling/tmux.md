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

- Detach session: `CTRL` + `A` `D`
- List active sessions and windows: `CTRL` + `A` `S`
-   Create new window: `CTRL` + `A` `C`
-   Move to next window: `CTRL` + `A` `N`
-   Move to specific window: `CTRL` + `A` `<1>`
-   Split pane vertical: `CTRL` + `A` `|`
-   Split pane horizontal: `CTRL` + `A` `-`
-   Move around panes:
	- Left: `CTRL` + `A` `H`
	- Down: `CTRL` + `A` `J`
	- Up: `CTRL` + `A` `K`
	- Right: `CTRL` + `A` `L`
-   Command mode: `CTRL` + `A` `,`
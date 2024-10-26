Tmux, short for terminal multiplexer, is a powerful tool used primarily in Unix-like operating systems. It allows users to manage multiple terminal sessions within a single window, enhancing productivity and multitasking capabilities.

## Main Commands

```bash linenums="1"
# start new session
tmux
tmux new -s <session_name>

# list active sessions
tmux ls

# attach to existing session
tmux attach
tmux attach -t 0

# kill session
tmux kill-session -t <session_name>
tmux rename-session -t 0 <session_name>

# also in command mode
# rename-window <window_name>
# rename-session <session_name>
```

## Main Default Shortcuts

-   List active sessions: ++ctrl+b++ ++s++
-   Create new Window: ++ctrl+b++ ++c++
-   Move to next window: ++ctrl+b++ ++n++
-   Move to specific Window [1]: ++ctrl+b++ ++1++
-   Split pane vertical: ++ctrl+b++ ++5++
-   Split pane horizontal: ++ctrl+b++ ++dblquote++
-   Move around panes: ++ctrl+b++ ++left++ ++down++ ++up++ ++right++
-   Command mode: ++ctrl+b++ ++colon++
-   Detach session: ++ctrl+b++ ++d++

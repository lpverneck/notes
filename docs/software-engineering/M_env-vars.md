Environment variables are dynamic, user-definable values that can influence the behavior of running processes on a computer. They serve as a means to configure applications without altering the underlying code, enabling flexibility and adaptability in software development. Basically is a `KEY=VALUE` pair.

There are two types of environment variables:

- Regular environment variables
- System environment variables (can be __user__ specific or __public__)

## PATH Variable

The `PATH` environment variable is a list of directories that the operating system searches to find executable files when you enter a command.

- On Unix-like systems, directories are separated by colons (`:`)
- On Windows, they are separated by semicolons (`;`)
- Order matters, the system checks directories from left to right, executing the first match it finds

## Interacting via Python

```py linenums="1"
import os


# retrieve a variable
value = os.environ["VARIABLE_NAME"]  # raises KeyError if not found
value = os.environ.get("VARIABLE_NAME", "default_value")  # returns "default_value" if not found

# set or modify environment variables
os.environ["NEW_VARIABLE"] = "value"
```

Alternatively, for local development, it’s common to store environment variables in a `.env` file. This file contains key-value pairs and can be loaded into the application using the `python-dotenv` library.

## Code Snippets

=== "Linux / Mac OS"

    ```bash linenums="1"
    # create new environment variable
    export MY_VAR=1

    # show environment variable value
    echo $MY_VAR
    printenv MY_VAR

    # show all environment variables
    printenv

    # adding new path to PATH variable
    export PATH=$PATH:/path/to/directory
    ```

=== "Windows OS"

    ```bash linenums="1"
    # create new environment variable
    set MY_VAR=1

    # show environment variable value
    echo %MY_VAR%

    # show all environment variables
    set

    # adding new path to PATH variable
    set PATH=%PATH%;C:\path\to\directory
    ```

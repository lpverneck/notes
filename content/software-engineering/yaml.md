---
title: YAML
created at: 2024-01-16
modified at: 2024-01-16
status: Completed
tags:
  - swe
publish: true
---

YAML stands for 'YAML Ain't Markup Language' and is a data serialization language, widely used to write configuration files.

The configuration files can have two different possible extensions: `.yml` or `.yaml`

## Example file

```yaml
# Comments can be inserted using '#'
# Different Boolean options: true, false, yes, no, on, off

# Key-value pair
access_enable: yes

# Object (Dict)
microservice:
	app: user-authentication
	port: 9000
	version: 1.7

# List
users:
	- user001
	- user002
	- user003

# List of objects
microservices:
  - app: user-authentication
    port: 9000
    version: 1.7
    deployed: true
  - app: shopping-cart
    port: 8080
    version: 1.2
    deployed: off

# Multi-line strings
data:
	multiLineString: |
	    SELECT name, last_name, grade, age
	    FROM students
	    WHERE age > 18
	    ORDER BY last_name ASC;
	sameLineLongString: >
	    this is a single
	    line, but for better
	    read experience we can
	    breakdown the string
```

## Other features

- Is possible to use `$VARIABLE_NAME` to access [[environment-variables|environment variables]]
- YAML has placeholder features
- The `---` can be used to separate YAML configurations in the same file

## Handling with code

### Python

```python
import yaml


def load_config(file_path):
    with open(file_path, "r") as file:
        config = yaml.safe_load(file)
    return config
```

---
title: JSON
created: 2024-10-25
tags:
  - completed
publish: true
---
JSON stands for Java Script Object Notation and is a lightweight format for storing and transporting data.

## JSON Data Types

- string
- number
- boolean
- null
- array
- object

## Example

```json
{
    "name": "Lucas",
    "age": 30,
    "athlete": true,
    "city": null,
    "hobbies": ["Cycling", "Running"],
    "distances": [
        {
            "name": "10K",
            "status": "Success"
        },
        {
            "name": "21K",
            "status": "Success"
        }
    ]
}
```

## Handling with Code

```python title="python"
import json


# loading json from string format
data = json.loads(json_object_string)

# saving json to string
data = json.dumps(object_dict, indent=4, sort_keys=True)

# loading json from file
with open("file.json") as f:
    data = json.load(f)

# saving json to a file
with open("file.json", "w") as f:
    json.dump(object_dict, f, indent=4, sort_keys=True)
```

```js title="JavaScript"
// loading json from string format
const data = JSON.parse(json_object_string)

// saving json to string
const data = JSON.stringify(object)
```

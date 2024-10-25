JSON stands for Java Script Object Notation and is a lightweight format for storing and transporting data.

## JSON Data Types

- string
- number
- boolean
- null
- array
- object

## Example

```json linenums="1"
{
    "name": "Lucas",
    "age": 30,
    "active": true,
    "city": null,
    "hobbies": ["Swimming", "Running"],
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

=== "Python"

    ```py linenums="1"
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

=== "JavaScript"

    ```js linenums="1"
    // loading json from string format
    const data = JSON.parse(json_object_string)

    // saving json to string
    const data = JSON.stringify(object)
    ```

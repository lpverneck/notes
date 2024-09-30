# JavaScript basics

_status_: #active
_tag_: #snippet #javascript

---

### Basic Types

-   Number
-   NaN
-   Booleans
-   [ P E M D A S ]
-   camelCase
-   Variables
-   String
-   Null (null)
-   Undefined
-   Math Object

```javascript linenums="1" hl_lines="3 4"
typeof NaN; // number

typeof true; // boolean
typeof false; // boolean

let someName = value;
const someName = value;
var someName = value;

let firstName = "Lucas";
firstName.length;
firstName.indexOf("c"); // 2
firstName.indexOf("as"); // 3
firstName.indexOf("z"); // -1
firstName.slice(2, 4); // cas
firstName.replace("a", "@"); // Luc@s

// Template Literals
`I counted ${3 + 4} sheeps`; // "I counted 7 sheeps"
```

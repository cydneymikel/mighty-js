# mighty-js
A dependency free Node.js module for easily transforming objects and coercing types using chaining and dot notation.

Github contributors welcome!

### Usage
---

#### mighty()

**Arguments:** <br />
- object (*Object*): The object to perform transformations on
- options (*Object*): optional clone ({ clone: true }) <br />
        * Default is { clone: false }. The original object will be mutated. <br />

**Returns:** <br />
- (Object): Returns the instance to chain additional mighty-js functions.  Calling methods on this object will continue to return the instance until `.result` is called.  Using `.result` will return the transformed object. <br />

```javascript

const mighty = require('mighty-js')

const ranger = {
    _id: '4',
    name: 'Kim Hart',
    ranger: 'Pink',
    transforms: 'pterodactyl dinozord',
    city: 'Angel Grove',
    state: 'California'
}

// obj is mutated
mighty(ranger)

// obj is preserved and a new object will be returned
const newRanger = mighty(ranger, { clone: true })

```

---
#### morph
Transforms keys while maintaining the original value.  The target key will be deleted from the object if it is empty after the transform is complete.
<br />

**Arguments:**
- str1 (*String*): The target key to transform
- str2 (*String*): The destination name of the key

**Returns:**
- (*Object*): Returns the instance to chain additional mighty-js functions. Using `.result` will return the transformed object.

```javascript
const mighty = require('mighty-js')

const ranger = {
        _id: '4',
        name: 'Kim Hart',
        ranger: 'Pink',
        transforms: 'pterodactyl dinozord',
        city: 'Angel Grove',
        state: 'California'
    }

    mighty(ranger)
        .morph('transforms', 'zord')
        .morph('city', 'location.city')
        .morph('state', 'location.state')
        .result

// returns
// {
//    _id: '4',
//    name: 'Kim Hart',
//    ranger: 'Pink',
//    zord: 'pterodactyl dinozord',
//    location: {
//       city: 'Angel Grove',
//       state: 'California'
//    }
// }

```
---
#### combine
Combines keys while maintaining the original value.  The target key will be deleted from the object if it is empty after the transform is complete.
<br />

**Arguments:**
- str1 (*Array*): Array of keys to combine into the destination key
- str2 (*String*): The destination name of the key

**Returns:**
- (*Object*): Returns the instance to chain additional mighty-js functions. Using `.result` will return the transformed object.

```javascript
const mighty = require('mighty-js')

const ranger = {
    _id: '4',
    first: 'Kim',
    last: 'Hart',
    ranger: 'Pink',
    transforms: 'pterodactyl dinozord',
    location: {
        city: 'Angel Grove',
        state: 'California'
    },
    coordinates: ['34.0522 N', '118.2437 W'],
    zip: 94115
}

    mighty(ranger)
        .combine(['zip', 'location', 'coordinates'], 'hometown')
        .result

// returns
// {
//     _id: '4',
//     first: 'Kim',
//     last: 'Hart',
//     ranger: 'Pink',
//     transforms: 'pterodactyl dinozord',
//     hometown: {
//         zip: 94115,
//         city: 'Angel Grove',
//         state: 'California',
//         coordinates: ['34.0522 N', '118.2437 W']
//     }
// }

```
---

#### coerce
Coerces a value to the specified type.

**Arguments:**
- str1 (*String*): The target key to transform
- str2 (*String*): The type to coerce to (number or string)

**Returns:**
- (*Object*): Returns the instance to chain additional mighty-js functions. Using `.result` will return the transformed object.

```javascript
const mighty = require('mighty-js')

const ranger = {
    _id: '4',
    name: 'Kim Hart',
    ranger: 'Pink',
    transforms: 'pterodactyl dinozord',
    city: 'Angel Grove',
    state: 'California'
}

    mighty(obj)
        .morph('_id', 'id')
        .coerce('id', 'number')
        .result

// returns
// {
//    id: 4,    // this is now a number instead of string
//    name: 'Kim Hart',
//    ranger: 'Pink',
//    zord: 'pterodactyl dinozord',
//    city: 'Angel Grove',
//    state: 'California'
// }

```

sass-unused
===========

[![Build Status](https://travis-ci.org/robertknight/sass-unused.png?branch=master)](https://travis-ci.org/robertknight/sass-unused)

A utility for finding unused variables, mixins and functions in a collection of
SASS files.

## Usage

### Command Line

```sh
npm install -g sass-unused
sass-unused 'src/**/*.scss'
```

This will parse all SASS files in 'src' and print a list of identifiers of
variables, functions and mixins which are declared but not referenced
elsewhere.

### Library

```js
var { findUnused } = require('sass-unused')

// "unused" is an object with keys for different types of SASS item
// (variable, mixin, function etc.) listing unused items of that type.
const unused = findUnused('src/**/*.scss');
console.log('unused items', unused);
```

## Caveats

This tool is quite dumb in that it assumes that all variables, functions and mixins
live in the same namespace and can be identified uniquely via their
identifiers. As a result, this tool may fail to report some unused identifiers.

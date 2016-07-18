sass-unused
===========

[![Build Status](https://travis-ci.org/robertknight/sass-unused.png?branch=master)](https://travis-ci.org/robertknight/sass-unused)

A utility for finding unused variables, mixins and functions in a collection of
SASS files, built on the
[gonzales-pe](https://github.com/tonyganch/gonzales-pe) parser.

## Usage

### Command Line

```
npm install -g sass-unused
sass-unused 'src/**/*.scss'
```

This will parse all SASS files in 'src' and print a list of identifiers of
variables, functions and mixins which are declared but not referenced
elsewhere.

### Library

```
var sassUnused = require('sass-unused')

sassUnused.findUnused('src/**/*.scss')
  .forEach(ident => console.log(ident))
```

## Caveats

This tool is quite dumb, it assumes that all variables, functions and mixins
live in the same namespace and can be identified uniquely via their
identifiers.

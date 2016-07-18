sass-unused
===========

A utility for finding unused variables in a collection of SASS files, built on the [gonzales-pe](https://github.com/tonyganch/gonzales-pe) parser.

## Usage

### Command Line

```
npm install -g sass-unused
sass-unused 'src/**/*.scss'
```

This will parse all SASS files in 'src' and print a list of variables which are
declared but not referenced elsewhere.

### Library

```
var sassUnused = require('sass-unused')

sassUnused.findUnusedVars('src/**/*.scss')
  .forEach(ident => console.log(ident))
```

## Caveats

This tool is quite dumb, it assumes that all variables live in the same
namespace and can be identified uniquely via their identifiers.

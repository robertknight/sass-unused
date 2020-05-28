# Change Log

## [0.4.0] - 2020-05-28

 * Support SASS files that use SASS modules (`@use`). In order to do this,
   the parser was changed from gonzales-pe to postcss-scss.

   SASS module support is crude: The tool only checks whether an identifier
   that is found declared in one place is referenced somewhere else. It does
   not consider which modules the identifier was declared and used in.

## [0.3.0] - 2018-02-06

 * Update SASS parser to fix issue with parsing interpolation

## [0.2.0] - 2016-07-18

 * Initial support for finding unused functions and mixins

## [0.1.0] - 2016-07-18

 * Initial release

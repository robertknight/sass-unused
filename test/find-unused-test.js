'use strict';

const values = require('lodash.values');
const flatten = require('lodash.flatten');
const { assert } = require('chai');

const { findUnused } = require('..');

describe('findUnused', () => {
  function test(sass, expectedUnused) {
    const resolve = _ => sass;

    let result = findUnused(['test.scss'], resolve);
    result = flatten(values(result));
    result = result.map(variable => variable.name);

    assert.deepEqual(result, expectedUnused);
  }

  it('should return unused variables', () => {
    test(`
$unused: red;
    `, ['unused']);
  });

  it('should not return used variables', () => {
    test(`
$used: red;
.foo { color: $used; }`, []);
  });

  it('should return unused mixins', () => {
    test(`@mixin unused { }`, ['unused']);
  });

  it('should not return used mixins', () => {
    test(`@mixin used {}; .foo { @include used; }`, []);
  });

  it('should return unused functions', () => {
    test(`@function foo();`, ['foo']);
  });

  it('should not return used functions', () => {
    test(`@function foo(); .bar { color: foo(); }`, []);
  });
  
  it('should parse interpolation', () => {
    test(`@mixin color($sel: ".color") { #{$sel}-1 { color: red; } }`, ['color']);
  });
});

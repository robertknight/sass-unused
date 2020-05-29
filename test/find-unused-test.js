"use strict";

const { assert } = require("chai");

const { findUnused } = require("..");

describe("findUnused", () => {
  function test(sass, expectedUnused) {
    const resolve = (_) => sass;
    const { vars, mixins, functions } = findUnused(["test.scss"], resolve);
    const unused = [...vars, ...mixins, ...functions];
    assert.deepEqual(unused, expectedUnused);
  }

  it("should return unused variables", () => {
    test(
      `
$unused: red;
    `,
      ["$unused"]
    );
  });

  it("should not return used variables", () => {
    test(
      `
$used: red;
.foo { color: $used; }`,
      []
    );
  });

  it("should return unused mixins", () => {
    test(`@mixin unused { }`, ["unused"]);
  });

  it("should not return used mixins", () => {
    test(`@mixin used {}; .foo { @include used; }`, []);
  });

  it("should return unused functions", () => {
    test(`@function foo();`, ["foo"]);
  });

  it("should not return used functions", () => {
    test(`@function foo(); .bar { color: foo(); }`, []);
  });

  it("should find uses in interpolated rule selectors", () => {
    test(`@mixin color($sel: ".color") { #{$sel}-1 { color: red; } }`, [
      "color",
    ]);
  });

  it("should find uses in interpolated property names", () => {
    test(`$foo: a-foo; $bar: a-bar; .selector { #{$foo}: white }`, ["$bar"]);
  });

  it("should find uses in interpolated at-rule names", () => {
    test(`$anim: foo; $bar: baz; @keyframes #{$anim}-bar {}`, ["$bar"]);
  });

  it("should parse files using SASS modules", () => {
    // nb. This tool currently doesn't check where a variable came from, it
    // just looks at whether an identifier name is referenced.
    test(
      `
@use "../variables" as vars;

$a-color: red;
$b-color: white;

.foo {
  color: vars.$a-color;
}
`,
      ["$b-color"]
    );
  });
});

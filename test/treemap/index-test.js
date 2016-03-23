var tape = require("tape"),
    d3_hierarchy = require("../../"),
    round = require("./round"),
    simple = require("../data/simple2");

tape("treemap() has the expected defaults", function(test) {
  var t = d3_hierarchy.treemap();
  test.equal(t.value()({value: 42}), 42);
  test.ok(t.sort()({value: 1}, {value: 2}) > 0);
  test.ok(t.sort()({value: 2}, {value: 1}) < 0);
  test.equal(t.sort()({value: 1}, {value: 1}), 0);
  test.equal(t.tile(), d3_hierarchy.treemapSquarify);
  test.deepEqual(t.size(), [1, 1]);
  test.deepEqual(t.round(), false);
  test.end();
});

tape("treemap.round(round) observes the specified rounding", function(test) {
  var h = d3_hierarchy.hierarchyTopDown(),
      t = d3_hierarchy.treemap().size([600, 400]).round(true),
      root = t(h(simple)),
      nodes = root.descendants().map(round);
  test.deepEqual(t.round(), true);
  test.deepEqual(nodes, [
    {x0:   0, x1: 600, y0:   0, y1: 400},
    {x0:   0, x1: 300, y0:   0, y1: 200},
    {x0:   0, x1: 300, y0: 200, y1: 400},
    {x0: 300, x1: 471, y0:   0, y1: 233},
    {x0: 471, x1: 600, y0:   0, y1: 233},
    {x0: 300, x1: 540, y0: 233, y1: 317},
    {x0: 300, x1: 540, y0: 317, y1: 400},
    {x0: 540, x1: 600, y0: 233, y1: 400}
  ]);
  test.end();
});

tape("treemap.round(round) coerces the specified round to boolean", function(test) {
  var t = d3_hierarchy.treemap().round("yes");
  test.strictEqual(t.round(), true);
  test.end();
});

tape("treemap.size(size) observes the specified size", function(test) {
  var h = d3_hierarchy.hierarchyTopDown(),
      t = d3_hierarchy.treemap().size([6, 4]),
      root = t(h(simple)),
      nodes = root.descendants().map(round);
  test.deepEqual(t.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.size(size) coerces the specified size to numbers", function(test) {
  var t = d3_hierarchy.treemap().size(["6", {valueOf: function() { return 4; }}]);
  test.strictEqual(t.size()[0], 6);
  test.strictEqual(t.size()[1], 4);
  test.end();
});

tape("treemap.size(size) makes defensive copies", function(test) {
  var size = [6, 4],
      h = d3_hierarchy.hierarchyTopDown(),
      t = d3_hierarchy.treemap().size(size),
      root = (size[1] = 100, t(h(simple))),
      nodes = root.descendants().map(round);
  test.deepEqual(t.size(), [6, 4]);
  t.size()[1] = 100;
  test.deepEqual(t.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.tile(tile) observes the specified tile function", function(test) {
  var h = d3_hierarchy.hierarchyTopDown(),
      t = d3_hierarchy.treemap().size([6, 4]).tile(d3_hierarchy.treemapSlice),
      root = t(h(simple)),
      nodes = root.descendants().map(round);
  test.equal(t.tile(), d3_hierarchy.treemapSlice);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 1.00},
    {x0: 0.00, x1: 6.00, y0: 1.00, y1: 2.00},
    {x0: 0.00, x1: 6.00, y0: 2.00, y1: 2.67},
    {x0: 0.00, x1: 6.00, y0: 2.67, y1: 3.17},
    {x0: 0.00, x1: 6.00, y0: 3.17, y1: 3.50},
    {x0: 0.00, x1: 6.00, y0: 3.50, y1: 3.83},
    {x0: 0.00, x1: 6.00, y0: 3.83, y1: 4.00}
  ]);
  test.end();
});

import roundNode from "../treemap/round";
import treemapDice from "../treemap/dice";
import {optional, defaultValue, defaultSort} from "../hierarchy/accessors";

function depth(node) {
  var depth = node.depth;
  node.eachBefore(function(node) {
    if (node.depth > depth) {
      depth = node.depth;
    }
  });
  return depth;
}

export default function() {
  var value = defaultValue,
      sort = defaultSort,
      dx = 1,
      dy = 1,
      padding = 0,
      round = false;

  function partition(root) {
    if (value) root.revalue(value);
    if (sort) root.sort(sort);
    var n = depth(root) + 1;
    root.x0 =
    root.y0 = padding;
    root.x1 = dx;
    root.y1 = dy / n;
    root.eachBefore(positionNode(dy, n));
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(dy, n) {
    return function(node) {
      if (node.children) {
        treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
      }
      var x0 = node.x0,
          y0 = node.y0,
          x1 = node.x1 - padding,
          y1 = node.y1 - padding;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  partition.value = function(x) {
    return arguments.length ? (value = optional(x), partition) : value;
  };

  partition.sort = function(x) {
    return arguments.length ? (sort = optional(x), partition) : sort;
  };

  partition.round = function(x) {
    return arguments.length ? (round = !!x, partition) : round;
  };

  partition.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
  };

  partition.padding = function(x) {
    return arguments.length ? (padding = +x, partition) : padding;
  };

  return partition;
}

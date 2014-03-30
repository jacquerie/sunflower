// Set up SVG for D3.
var width = 570,
    height = 550;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

var SEED_RADIUS = 5;

// Let F_n be the nth Fibonacci number. We can prove by
// induction that \sum_{i=1}^{n}{F_i} = F_{n+2} - 1. Then
// we choose 376 = F_14 - 1 = \sum{i=1}^{12}{F_i}, because
// the outer rim of a sunflower usually has F_12 = 144 seeds.
// See: http://www.proofwiki.org/wiki/Sum_of_Sequence_of_Fibonacci_Numbers
var NUM_SEEDS = 376;

// See: http://en.wikipedia.org/wiki/Golden_angle
var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Returns { r: radius, phi: angle } using Vogel's formulas.
// See: http://algorithmicbotany.org/papers/abop/abop-ch4.pdf
function placeSeed (n, alpha) {
  var   C = 7.5,
        r = C * Math.sqrt(n),
      phi = n * alpha;

  return { r: r * Math.cos(phi), phi: r * Math.sin(phi) };
}

// d3.range(start, end) returns the elements from start to end - 1.
// We add back one to have NUM_SEEDS seeds.
var seeds = d3.range(1, NUM_SEEDS + 1).map(function (n) {
  return placeSeed(n, GOLDEN_ANGLE);
});

svg.selectAll("circle")
    .data(seeds)
  .enter().append("circle")
    .attr("cx", function(d) { return width / 2 + d.r; })
    .attr("cy", function(d) { return height / 2 + d.phi; })
    .attr("r", SEED_RADIUS);


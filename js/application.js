// Set up SVG for D3.
var margins = { left: 35, right: 35 },
    width = 570,
    height = 550;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

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

function restart (alpha) {
  var SEED_RADIUS = 5;

  // d3.range(start, end) returns the elements from start to end - 1.
  // We add back one to have NUM_SEEDS seeds.
  var seeds = d3.range(0, NUM_SEEDS + 1).map(function (n) {
    return placeSeed(n, alpha);
  });

  svg.selectAll(".seed")
      .remove();

  svg.selectAll("circle")
      .data(seeds)
    .enter().append("circle")
      .attr("class", "seed")
      .attr("cx", function(d) { return width / 2 + d.r; })
      .attr("cy", function(d) { return height / 2 + d.phi; })
      .attr("r", SEED_RADIUS)
}

var x = d3.scale.linear()
    .domain([0, 180])
    .range([margins.left, width - margins.right])
    .clamp(true);

var brush = d3.svg.brush()
    .x(x)
    .extent([0,0])
    .on("brush", brushed);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (5 * height) / 6 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function (d) { return d + "°"; })
      .tickSize(0)
      .tickPadding(12))
    .select(".domain")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + (5 * height) / 6 + ")")
    .attr("r", 10);

slider.call(brush.event)
   .call(brush.extent([137.5, 137.5]))
   .call(brush.event);

function brushed () {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) {
    value = x.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("cx", x(value));
  restart(2 * (value / 360) * Math.PI);
}

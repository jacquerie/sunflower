// Set up SVG for D3.
var margins = { left: 35, right: 35 },
    width = 570,
    height = 427.5;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

// Set up slider.
var x = d3.scale.linear()
    .domain([137, 138])
    .range([margins.left, width - margins.right])
    .clamp(true);

var brush = d3.svg.brush()
    .x(x)
    .extent([0,0])
    .on("brush", brushed);

function brushed () {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) {
    value = x.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("cx", x(value));
  drawSunflower(2 * (value / 360) * Math.PI);
}

// We choose 714 = 21 * 34 because we expect to see 34 spirals in
// one direction and 21 in the opposite, so we choose a number that
// is divisible by both.
var NUM_SEEDS = 714;

// See: http://en.wikipedia.org/wiki/Golden_angle
var GOLDEN_ANGLE = 180 * (3 - Math.sqrt(5));

// Returns { r: radius, phi: angle } using Vogel's formulas.
// See: http://algorithmicbotany.org/papers/abop/abop-ch4.pdf
function placeSeed (n, alpha) {
  var   C = 5,
        r = C * Math.sqrt(n),
      phi = n * alpha;

  return { r: r * Math.cos(phi), phi: r * Math.sin(phi) };
}

function drawSunflower (alpha) {
  var SEED_RADIUS = 2.5;

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
      .attr("cy", function(d) { return 5 * height / 12 + d.phi; })
      .attr("r", SEED_RADIUS);
}

// Draw the axis.
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (10 * height) / 12 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function (d) { return d + "°"; })
      .tickSize(0)
      .tickPadding(12))
    .select(".domain")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "halo");

// Draw the slider.
var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

// Fix the appearance of the slider.
slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

// Draw the handle.
var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + (10 * height) / 12 + ")")
    .attr("r", 10);

// App starts here.
slider.call(brush.event)
   .call(brush.extent([GOLDEN_ANGLE, GOLDEN_ANGLE]))
   .call(brush.event);

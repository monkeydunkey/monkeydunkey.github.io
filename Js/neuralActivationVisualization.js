
function sigmoid(X, w, b){

  var data = []
  for (var k = X[0]; k < X[1]; k++) {
      data.push({date: 0.1 * k, close: 1 / ( 1+ Math.exp(-1 * (0.1 * k * w + b) ))});
  }
  return data
}
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 10, bottom: 30, left: 30},
    width = 250,
    height = 200,
    hiddenLayerWidth = 150,
    x = d3.scale.linear().rangeRound([0, width]),
    y = d3.scale.linear().rangeRound([height, 0]),
    xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5),
    yAxis = d3.svg.axis().scale(y).orient("left").ticks(5),
    data = sigmoid([-100, 100], 2, 12),
    circleRadius = 20,
    neurons = 3
    valueline = d3.svg.line().x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d.close); });

// Need to define the structure here using bootstrap
var actSvg = d3.select("#activationOutput")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) { return d.close; })]);

// Add the valueline path.
actSvg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));

// Add the X Axis
actSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
actSvg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Lets now add the circles for the neurons
neuSvg = d3.select("#neurons")
    .append("svg")
        .attr("width", hiddenLayerWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (((hiddenLayerWidth + margin.left + margin.right)/2)-2*circleRadius) + ",0)" )

var jsonCircles = [
   { "x_axis": 30, "y_axis": 30, "radius": circleRadius, "color" : "green" },
   { "x_axis": 30, "y_axis": 80, "radius": circleRadius, "color" : "green"},
   { "x_axis": 30, "y_axis": 130, "radius": circleRadius, "color" : "green"}];

var circles = neuSvg.selectAll("circle")
                          .data(jsonCircles)
                          .enter()
                          .append("circle");

var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function(d) { return d.color; });
// ** Update data section (Called from the onclick)
function updateData(e) {
      var data = sigmoid([-100, 100], 2, parseInt(e));
    	// Scale the range of the data again
    	x.domain(d3.extent(data, function(d) { return d.date; }));
	    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
        svg.select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

}

function updateNeuron(addRemove){
    var y_axis = jsonCircles[jsonCircles.length -1].y_axis + 50
    if (addRemove == true){
        neurons += 1
        jsonCircles.push({ "x_axis": 30, "y_axis": y_axis,
                           "radius": circleRadius, "color" : "green" })
    } else {
      neurons -= 1
      jsonCircles.pop()
    }

    var circles = d3.select("#neurons g").selectAll("circle")
                    .data(jsonCircles)
    circles.enter()
           .append("circle")
           .attr("cx", function (d) { return d.x_axis; })
           .attr("cy", function (d) { return d.y_axis; })
           .attr("r", function (d) { return d.radius; })
           .style("fill", function(d) { return d.color; });
    circles.exit().remove()
}

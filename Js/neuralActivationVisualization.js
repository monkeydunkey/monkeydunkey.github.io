
function add(a, b) {
    return a + b;
}

function inverse(a){
  return 1/a;
}
function sigmoid(X, w, b, wOut, bOut){

   range = [[]],
      multiRange = new Array(),
      data = [],
      biasOut = [],
      biasSum = bOut.reduce(add, 0),
      biasIn = [];
  for (var k = X[0]; k < X[1]; k++) {
      range[0].push(0.1 * k)
      biasOut.push(biasSum)
      biasIn.push(b)
  }
  //Stacking the ranges together to generate the input matrix
  //for (var k = 0; k < w.length; k++) {
  //  multiRange[k] = range
  //}
  console.log(w)
  console.log(math.multiply(math.transpose(math.matrix(range)), math.matrix([w])).size())
   biasMat = math.matrix(biasIn),
      dataTemp = math.add(1, math.exp(math.multiply(-1, math.add(math.multiply(math.transpose(math.matrix(range)), math.matrix([w])), biasMat))))
  dataTemp = math.add(math.multiply(math.matrix(wOut), math.transpose(dataTemp)), biasOut)
  //Time to create the data in the required format
  dataTemp = dataTemp.toArray().map(inverse)
   ind = 0
  for (var k = X[0]; k < X[1]; k++){
      data.push({date: 0.1 * k, close: dataTemp[ind]});
      ind += 1
  }
  return data
}
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 10, bottom: 30, left: 30},
    width = 250,
    height = 200,
    hiddenLayerWidth = 75,
    x = d3.scale.linear().rangeRound([0, width]),
    y = d3.scale.linear().rangeRound([height, 0]),
    xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5),
    yAxis = d3.svg.axis().scale(y).orient("left").ticks(5),
    data = sigmoid([-100, 100], [2, 2, 2], [12, 12, 12], [2, 2, 2], [12, 12, 12]),
    circleRadius = 20,
    neurons = 3
    valueline = d3.svg.line().x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d.close); }),
    jsonCircle = [
       { "x_axis": 30, "y_axis": 30, "radius": circleRadius, "color" : "green" }
    ];

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
function drawNeurons(id){
  var numNeurons = 0,
      divHeight = height - 30;
      layerWidth = hiddenLayerWidth
  switch(id){
    case "#neurons":
      numNeurons = 3
      layerWidth += (margin.left + margin.right)
      break
    case "#inputLayer":
    case "#outputLayer":
      numNeurons = 1
      divHeight += 60
      layerWidth = (layerWidth/2) + ((margin.left + margin.right) / 4)
    default:
      numNeurons = 1
  }
  var neuSvg = d3.select(id)
      .append("svg")
          .attr("width", layerWidth)
          .attr("height", divHeight + margin.top + margin.bottom)
      .append("g");
      //.attr("transform", "translate(" + (((hiddenLayerWidth + margin.left + margin.right)/2)-2*circleRadius) + ",0)" )

  //

  divHeight += margin.top + margin.bottom
  var svgWidth = layerWidth
      jsonCircles = [],
      stepSize = parseInt(divHeight / numNeurons),
      y_axis = stepSize / 2,
      circleRadiusLocal = y_axis;
  for (var i = 0; i < numNeurons; i++){
    jsonCircles.push({ "x_axis": svgWidth/2, "y_axis": y_axis,
                       "radius": Math.min(circleRadius, circleRadiusLocal),
                       "color" : "#7413E8",
                       "opacity": 0.35})
    y_axis += parseInt(divHeight / (numNeurons))
  }

  var circles = neuSvg.selectAll("circle")
                            .data(jsonCircles)
                            .enter()
                            .append("circle");

  var circleAttributes = circles
                         .attr("cx", function (d) { return d.x_axis; })
                         .attr("cy", function (d) { return d.y_axis; })
                         .attr("r", function (d) { return d.radius; })
                         .style("fill", function(d) { return d.color;})
                         .style("opacity", function(d) { return d.opacity; });

  if (id === "#neurons"){
      circles.each(function(d) {
        // attribute
        var cy = parseFloat(this.getAttribute('cy')),
            radius = parseFloat(this.getAttribute('r'));

        // **** Weights ****
        var foreignObject = neuSvg.append('foreignObject')
          .attr({
            'x': 0,
            'y': cy - (radius)
          })
        // div
        var div = foreignObject.append('xhtml:div')
          .html('<input data-inw=2 class="weightInput" type="text" value="2" onChange=updateWeight(this)> ')

        // **** baises ****
        var foreignObject = d3.select("#neurons g").append('foreignObject')
          .attr({
            'x': 0,
            'y': cy + radius/4
          });
        // div
        var div = foreignObject.append('xhtml:div')
          .html('<input data-inb=12 class="biasInput" type="text" value="12" onChange=updateBias(this)>')

        // **** Out Weights ****
        var foreignObject = neuSvg.append('foreignObject')
          .attr({
            'x': layerWidth - margin.left,
            'y': cy - (radius)
          })
        // div
        var div = foreignObject.append('xhtml:div')
          .html('<input data-inwo=2 class="weightInput" type="text" value="2" onChange=updateWeight(this)> ')

        // ****Out baises ****
        var foreignObject = neuSvg.append('foreignObject')
          .attr({
            'x': layerWidth - margin.left,
            'y': cy + radius/4
          });
        // div
        var div = foreignObject.append('xhtml:div')
          .html('<input data-inbo=12 class="biasInput" type="text" value="12" onChange=updateBias(this)>')
      })
  }
}

// ** Update data section (Called from the onclick)
function updateData() {
      var weights = $("#neurons svg foreignObject input").map(function() {
                    return $(this).data("inw");
                    }).get(),
          bias = $("#neurons svg foreignObject input").map(function() {
                        return $(this).data("inb");
                        }).get(),
          weightsOut = $("#neurons svg foreignObject input").map(function() {
                        return $(this).data("inwo");
                        }).get(),
          biasOut = $("#neurons svg foreignObject input").map(function() {
                            return $(this).data("inbo");
                            }).get(),
          range = [-100, 100],
          data = sigmoid([-100, 100], weights, bias, weightsOut, biasOut);
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
    var jsonCircles = [],
        divHeight = $("#neurons svg")[0].scrollHeight,
        svgWidth = $("#neurons svg")[0].scrollWidth,
        numNeurons = addRemove ? 1 + $("#neurons svg circle").length : $("#neurons svg circle").length - 1,
        stepSize = parseInt(divHeight / numNeurons),
        y_axis = stepSize / 2,
        circleRadiusLocal = y_axis;
    //Adding some more space to handle more neurons
    if (numNeurons > 5){
      $("#neurons svg").attr("height", divHeight + 60)
      divHeight += 60
    }

    for (var i = 0; i < numNeurons; i++){
      jsonCircles.push({ "x_axis": parseInt(svgWidth/2), "y_axis": y_axis,
                     "radius": Math.min(circleRadius, circleRadiusLocal),
                     "color" : "#7413E8",
                     "opacity": 0.35})
      y_axis += parseInt(divHeight / (numNeurons))
    }
    d3.selectAll("#neurons g circle").remove()
    d3.selectAll("#neurons g foreignObject").remove()
    var circles = d3.select("#neurons g").selectAll("circle")
                    .data(jsonCircles)
    circles.enter()
           .append("circle")
           .attr("cx", function (d) { return d.x_axis; })
           .attr("cy", function (d) { return d.y_axis; })
           .attr("r", function (d) { return d.radius; })
           .style("fill", function(d) { return d.color; })
           .style("opacity", function(d) { return d.opacity; });
    //circles.exit().remove()
    //
    circles.each(function(d) {

      // attribute
      var cy = parseFloat(this.getAttribute('cy')),
          radius = parseFloat(this.getAttribute('r'));

      // **** wights ****
      var foreignObject = d3.select("#neurons g").append('foreignObject')
        .attr({
          'x': 0,
          'y': cy - (radius)
        });

      // div
      var div = foreignObject.append('xhtml:div')
        .html('<input data-inw=2 class="weightInput" type="text" value="2" onChange=updateWeight(this)> ')

      // **** baises ****
      var foreignObject = d3.select("#neurons g").append('foreignObject')
        .attr({
          'x': 0,
          'y': cy + radius/4
        });
      // div
      var div = foreignObject.append('xhtml:div')
        .html('<input data-inb=12 class="biasInput" type="text" value="12" onChange=updateBias(this)>')

     // **** Out Weights ****
     var foreignObject = d3.select("#neurons g").append('foreignObject')
       .attr({
         'x': svgWidth - margin.left,
         'y': cy - (radius)
       })
     // div
     var div = foreignObject.append('xhtml:div')
       .html('<input data-inwo=2 class="weightInput" type="text" value="2" onChange=updateWeight(this)> ')

     // ****Out baises ****
     var foreignObject = d3.select("#neurons g").append('foreignObject')
       .attr({
         'x': svgWidth - margin.left,
         'y': cy + radius/4
       });
     // div
     var div = foreignObject.append('xhtml:div')
       .html('<input data-inbo=12 class="biasInput" type="text" value="12" onChange=updateBias(this)>')

    })


    //Updating the output
    updateData()
}

function updateBias(item){
  var temp = parseInt($(item)[0].value)
  if ($(item).data("inb")){
      $(item).data("inb", temp)
  } else {
    $(item).data("inbo", temp)
  }
  updateData()
}

function updateWeight(item){
  var temp = parseInt($(item)[0].value)
  if ($(item).data("inw")){
      $(item).data("inw", temp)
  } else {
    $(item).data("inwo", temp)
  }

  updateData()
}

drawNeurons("#neurons")
drawNeurons("#inputLayer")
drawNeurons("#outputLayer")

// You need to create a scatter plot between two of the 
// data variables such as Healthcare vs. Poverty or Smokers vs. Age.

// create a scatter plot that represents each state with circle elements

// pull in the data from data.csv by using the d3.csv function

// Create and situate your axes and labels to the left and bottom of the chart

// Set SVG height and width
var svgWidth = 960;
var svgHeight = 500;

// Create margins
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Set height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
    d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis] - 1),
    d3.max(healthData, d => d[chosenYAxis]+1)
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
    // .attr("cy", d => newYScale(d[chosenYAxis]));

  return xcirclesGroup;
}

// function used for updating circles group with a transition to
// new circles
function renderYCircles(ycirclesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
    // .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderXText(circlesGroup, newXScale, chosenXAxis){

  circlesGroup.transition()
  .duration(1000)
  .attr("dx", d => newXScale(d[chosenXAxis]));

return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYAxis){

  circlesGroup.transition()
  .duration(1000)
  .attr("dx", d => newYScale(d[chosenYAxis]));

return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "In Poverty (%):";
  }
  // else if (chosenXAxis === "income"){
  //   label = "Household Income (Median)";
  // }
  else {
    xlabel = "Age (Median)"
  }

  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([80, -60])
  //   .html(function (d) {
  //     return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
  //   });

  //   circlesGroup.call(toolTip);

  //   circlesGroup.on("mouseover", function (data) {
  //     toolTip.show(data);
  //   })
  //     // onmouseout event
  //     .on("mouseout", function (data) {
  //       toolTip.hide(data);
  //     });

  //   return circlesGroup;
  // }

  // function updateToolTip(chosenYAxis, circlesGroup) {

  var ylabel;

  if (chosenYAxis === "obesity") {
    ylabel = "Obesity (%):";
  }
  // else if (chosenXAxis === "income"){
  //   label = "Household Income (Median)";
  // }
  else {
    ylabel = "Smokes (%):";
  }

  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([50, -75])
  //   .html(function (d) {
  //     return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br> ${ylabel} ${[chosenYAxis]}`);
  //   });

  // circlesGroup.call(toolTip);


  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (healthData, err) {
  if (err) throw err;
  // console.log(healthData)
  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.obesity = +data.obesity
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function
  // var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(healthData, d => d.obesity)])
    // .range([height, 0]);
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  // var circlesGroup = chartGroup.selectAll("g circle")
  //   .data(healthData)
  //   .enter()
  //   .append("g");

  var circlesxy = chartGroup.append("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("stroke", "black")
    .attr("fill", "blue")
    .attr("opacity", "0.75");


  // Add abbr to circles
  var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]));
    // .classed("stateText", true);


  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    // var incomeLabel = labelsGroup.append("text")
    // .attr("x", 0)
    // .attr("y", 40)
    // .attr("value", "income") // value to grab for event listener
    // .classed("inactive", true)
    // .text("Household Income (Median)");

  // Create group for two y-axis labels  
    var ylabelsGroup = chartGroup.append("g")
    // .attr("transform", `translate(${width}, ${height})`);

    var obesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 30)
      .attr("x", 0 - (height-170))
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obesity (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 60)
      .attr("x", 0 - (height-170))
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

  // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Obese (%)");



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        chosenXAxis = value;
        // chosenYAxis = value;
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);
        // yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // yAxis = renderAxes(yLinearScale, xAxis);

        // updates circles with new x values
        circlesxy = renderXCircles(circlesxy, xLinearScale, chosenXAxis);
        // updates circles with new y values
        // circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

        // circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          // incomeLabel
          //   .classed("active", false)
          //   .classed("inactive", true);
        }
        // else (chosenXAxis === "age") {
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          // incomeLabel
          //   .classed("active", false)
          //   .classed("inactive", true);
        }
        // else {
        //   incomeLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        //     incomeLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        // }
      }
    });
  ylabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        // chosenXAxis = value;
        chosenYAxis = value;
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        // xLinearScale = xScale(healthData, chosenXAxis);
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        // xAxis = renderAxes(xLinearScale, xAxis);

        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesxy = renderYCircles(circlesxy, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(circlesGroup, chosenYAxis, chosenXAxis);

        // circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        // else (chosenXAxis === "age") {
        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        // else {
        //   incomeLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        //     incomeLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        // }
      }
    });
  }).catch(function (error) {
  console.log(error);
});
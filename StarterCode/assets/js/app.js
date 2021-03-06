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

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty (%):";
  }
  // else if (chosenXAxis === "income"){
  //   label = "Household Income (Median)";
  // }
  else {
    label = "Age (Median)"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, -60])
    .html(function (d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (healthData, err) {
  if (err) throw err;
  // console.log(healthData)
  // parse data
  healthData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.obesity = +data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 12)
    .attr("color", "blue")
    .attr("opacity", "1")
    .classed("stateCircle", true);

    chartGroup.append("g").selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .attr("color", "white")
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .text(d=>d.abbr)
    .classed("stateText", true);

  // // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

   // append x axis
  labelsGroup.append("text")
  // .attr("transform", "rotate(-90)")
  .attr("y", 0)
  .attr("x", 0)
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Poverty (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity (%)");

}).catch(function (error) {
  console.log(error);
});
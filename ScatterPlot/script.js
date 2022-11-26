let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

function main() {
  //setting
  const width = 800;
  const height = 500;
  const padding = 50;
  const legendHeight = 100;
  const legendWidth = 200;
  const timeSpecifier = "%M:%S";
  const yearSpecifier = "%Y";
  const parsedTime = dataset.map(d => d3.timeParse(timeSpecifier)(d["Time"]));
  const parsedYear = dataset.map(d => d3.timeParse(yearSpecifier)(d["Year"]));

  //dynamic scale
  const yScale = d3
    .scaleTime()
    .domain(d3.extent(parsedTime).reverse())
    .range([height - padding, padding]);
  const xScale = d3
    .scaleTime()
    .domain([new Date(1992, 1, 1), new Date(2016, 1, 1)])
    .range([padding, width - padding]);

  //graph
  const svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //tooltip
  const tooltip = d3
    .select(".graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  //axes
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d => d3.timeFormat(timeSpecifier)(d));
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d => d3.timeFormat(yearSpecifier)(d));
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  //legends: credit - https://www.d3-graph-gallery.com/graph/custom_legend.html#cat3
  const legendSvg = d3.select("#legendSVG");
  const legendKey = ["No doping allegations", "Riders with doping allegations"];
  const legendColor = d3
    .scaleOrdinal()
    .domain(legendKey)
    .range(["orange", "lightblue"]);

  // Add one dot in the legend for each name.
  const size = 15;
  legendSvg
    .selectAll("dots")
    .data(legendKey)
    .enter()
    .append("rect")
    .attr("x", 10)
    .attr("y", (d, i) => 10 + i * (size + 5)) //10 is where the first dot appears. 20 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", d => legendColor(d))
    .style("stroke", "black");
  // Add one dot in the legend for each name.

  legendSvg
    .selectAll("labels")
    .data(legendKey)
    .enter()
    .append("text")
    .attr("x", 10 + size * 1.2)
    .attr("y", (d, i) => 10 + i * (size + 5) + size / 2) //10 is where the first dot appears. 20 is the distance between dots
    .style("fill", "black")
    .text(d => d)
    .style("alignment-baseline", "middle");

  //dots
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => parsedYear[i])
    .attr("data-yvalue", (d, i) => parsedTime[i])
    .style("fill", d => (d["Doping"] ? "lightblue" : "orange"))
    .attr("cx", (d, i) => xScale(parsedYear[i]))
    .attr("cy", (d, i) => yScale(parsedTime[i])) //y for the dot
    //tooltip
    .attr("r", "5")
    .on("mouseover", (d, i) => {
      tooltip.transition().duration(200).style("opacity", 0.85);
      tooltip
        .html(
          `${d["Name"]}, ${d["Nationality"]}
<br>Year: ${d["Year"]}
<br>Time: ${d["Time"]}
<br>${d["Doping"]}
`
        )
        .attr("data-year", parsedYear[i])
        .style("left", xScale(parsedYear[i]) + "px")
        .style("top", yScale(parsedTime[i]) - 50 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(200).style("opacity", 0);
    });
}

req.open("GET", url, true);
req.onload = () => {
  dataset = JSON.parse(req.responseText);
  main();
};
req.send();

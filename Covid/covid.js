let url = "https://api.covidtracking.com/v1/states/current.json";
let req = new XMLHttpRequest();

let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {
  heightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, item => {
        return item[1];
      }),
    ])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length])
    .range([padding, width - padding]);

  xAxisScale = d3
    .scaleLinear()
    .domain([0, values.length])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, item => {
        return item[1];
      }),
    ])
    .range([height - padding, padding]);
};

let drawBars = () => {
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto");

  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / values.length)
    .attr("data-state", item => {
      return item[0];
    })
    .attr("data-deaths", item => {
      return item[1];
    })
    .attr("height", item => {
      return heightScale(item[1]);
    })
    .attr("x", (item, index) => {
      return xScale(index);
    })
    .attr("y", item => {
      return height - padding - heightScale(item[1]);
    })
    .on("mouseover", item => {
      tooltip.transition().style("visibility", "visible");

      tooltip.text(item[0]);

      document.querySelector("#tooltip").setAttribute("data-state", item[0]);
    })
    .on("mouseout", item => {
      tooltip.transition().style("visibility", "hidden");
    });
};

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")

    .attr("transform", "translate(" + padding + ", 0)");
};
req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.map(val => {
    return [val["state"], parseInt(val["death"])];
  });

  values = values.filter(
    item =>
      item[0] != "AS" &&
      item[0] != "DC" &&
      item[0] != "GU" &&
      item[0] != "MP" &&
      item[0] != "PR" &&
      item[0] != "VI"
  );
  values = values.sort((a, b) => a[1] - b[1]);

  console.log(values);
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
};
req.send();

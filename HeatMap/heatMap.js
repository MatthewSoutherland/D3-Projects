const req = new XMLHttpRequest();
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  dataset = data.monthlyVariance;
  main();
};
req.send();

const width = 1000;
const height = 600;
const padding = 60;

function main() {
  dataset = dataset.map(i => Object.values(i));
  // [0] = year, [1] = month number, [2] = variance
  const y = "%Y";
  const parsedYear = dataset.map(d => d3.timeParse(y)(d[0]));
  let svg = d3.select("svg").attr("width", width).attr("height", height);

  const xScale = d3
    .scaleTime()
    .domain([new Date(1753, 1, 1), new Date(2015, 1, 1)])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 11])
    .range([height - padding, padding]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d => d3.timeFormat(y)(d));

  let yAxis = d3
    .axisLeft(yScale)
    .tickFormat(
      (d, i) =>
        [
          "January",
          "Febuary",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][i]
    );

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

  let tooltip = d3
    .select("#col")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "8px");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("width", 5)
    .attr("data-year", item => {
      return item[0];
    })
    .attr("data-month", item => {
      return item[1] - 1;
    })
    .attr("data-temp", item => item[2])
    .attr("height", (height - padding * 2) / 12)
    .attr("x", (d, i) => xScale(parsedYear[i]))
    .attr("y", d => yScale(d[1]))
    .style("cursor", "pointer")
    .style("border", "1px solid black")
    .style("fill", d => {
      if (d[2] < -2) {
        color = "blue";
      } else if (d[2] < -1 && d[2] >= -2) {
        color = "lightblue";
      } else if (d[2] >= -1 && d[2] <= 1) {
        color = "green";
      } else if (d[2] > 1 && d[2] <= 2) {
        color = "orange";
      } else {
        color = "red";
      }
      return color;
    })

    .on("mouseover", function () {
      return tooltip
        .style("top", event.pageY - 100 + "px")
        .style("left", event.pageX - 50 + "px")
        .style("visibility", "visible")
        .attr("fill", "#ffffff")
        .attr("data-year", d3.select(this).attr("data-year"))
        .html(
          `<p>Year: ${d3.select(this).attr("data-year")} </p><p>Variance: ${d3
            .select(this)
            .attr("data-temp")}`
        );
    })
    .on("mouseout", () => {
      return tooltip.style("visibility", "hidden");
    });

  // select the svg area
  var SVG = d3.select("#legend");

  // create a list of keys
  var keys = ["Hot", "Warm", "normal", "cool", "cold"];

  // Usually you have a color scale in your chart already
  var color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(["red", "orange", "green", "lightblue", "blue"]);

  // Add one dot in the legend for each name.
  var size = 10;
  SVG.selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", 10)
    .attr("y", function (d, i) {
      return 10 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      return color(d);
    });

  // Add one dot in the legend for each name.
  SVG.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 12 + size * 1.2)
    .attr("y", function (d, i) {
      return 10 + i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}

const switcher = document.getElementById("auto-dark");

switcher.addEventListener("click", function () {
  document.body.classList.toggle("light-theme");
  document.body.classList.toggle("dark-theme");

  const className = document.body.className;
  if (className == "light-theme") {
    this.textContent = "Dark";
  } else {
    this.textContent = "Light";
  }
});

// project 1 bar chart
(function () {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  const w = $("#chart").width();
  const h = 300;
  const xPadding = 40;
  const yPadding = 20;

  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.send();
  req.onload = () => {
    json = JSON.parse(req.responseText);
    const dataset = json.data;

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, d => new Date(d[0])),
        d3.max(dataset, d => new Date(d[0])),
      ])
      .range([xPadding, w]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h - yPadding, yPadding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", w / dataset.length)
      .attr("height", d => h - yScale(d[1]) - yPadding)
      .attr("fill", "#c94c4c")
      .attr("onmouseover", "tooltip(this)")
      .attr("onmouseout", "$('#tooltip').hide()");

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (h - yPadding) + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + xPadding + ", 0)")
      .call(yAxis);
  };
})();

function tooltip(e) {
  const elem = $(e);
  const gdp = elem.attr("data-gdp");
  const date = elem.attr("data-date");
  const left = parseInt(elem.attr("x")) + 50;

  $("#tooltip").show().attr("data-date", date).css("left", `${left}px`);

  $(".tooltip-date").text(date);
  $(".tooltip-gdp").text(`GDP: \$${gdp} billions`);
}

// project 2 bar chart
const projectName = "bar-chart";

// coded by @AlphaDev01, Twitter

var width = 800,
  height = 400,
  barWidth = width / 275;

var tooltip = d3
  .select(".visHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3
  .select(".visHolder")
  .append("div")
  .attr("class", "overlay")
  .style("opacity", 0);

var svgContainer = d3
  .select(".visHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60);

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then(data => {
    svgContainer
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -200)
      .attr("y", 80)
      .text("Gross Domestic Product");

    svgContainer
      .append("text")
      .attr("x", width / 2 + 120)
      .attr("y", height + 50)
      .text("More Information: https://github.com/aftab515")
      .attr("class", "info");

    var years = data.data.map(function (item) {
      var quarter;
      var temp = item[0].substring(5, 7);

      if (temp === "01") {
        quarter = "Q1";
      } else if (temp === "04") {
        quarter = "Q2";
      } else if (temp === "07") {
        quarter = "Q3";
      } else if (temp === "10") {
        quarter = "Q4";
      }

      return item[0].substring(0, 4) + " " + quarter;
    });

    var yearsDate = data.data.map(function (item) {
      return new Date(item[0]);
    });

    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    var xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

    var xAxis = d3.axisBottom().scale(xScale);

    svgContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60, 400)");

    var GDP = data.data.map(function (item) {
      return item[1];
    });

    var scaledGDP = [];

    var gdpMax = d3.max(GDP);

    var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

    scaledGDP = GDP.map(function (item) {
      return linearScale(item);
    });

    var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

    var yAxis = d3.axisLeft(yAxisScale);

    svgContainer
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60, 0)");

    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("data-date", function (d, i) {
        return data.data[i][0];
      })
      .attr("data-gdp", function (d, i) {
        return data.data[i][1];
      })
      .attr("class", "bar")
      .attr("x", function (d, i) {
        return xScale(yearsDate[i]);
      })
      .attr("y", function (d) {
        return height - d;
      })
      .attr("width", barWidth)
      .attr("height", function (d) {
        return d;
      })
      .attr("index", (d, i) => i)
      .style("fill", "#33adff")
      .attr("transform", "translate(60, 0)")
      .on("mouseover", function (event, d) {
        // d or datum is the height of the
        // current rect
        var i = this.getAttribute("index");

        overlay
          .transition()
          .duration(0)
          .style("height", d + "px")
          .style("width", barWidth + "px")
          .style("opacity", 0.9)
          .style("left", i * barWidth + 0 + "px")
          .style("top", height - d + "px")
          .style("transform", "translateX(60px)");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            years[i] +
              "<br>" +
              "$" +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
              " Billion"
          )
          .attr("data-date", data.data[i][0])
          .style("left", i * barWidth + 30 + "px")
          .style("top", height - 100 + "px")
          .style("transform", "translateX(60px)");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
        overlay.transition().duration(200).style("opacity", 0);
      });
  })
  .catch(e => console.log(e));

// project 3 scatter plot
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

// project 4 scatter plot
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

document.addEventListener("DOMContentLoaded", function () {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send();
  request.onload = () => {
    const data = JSON.parse(request.responseText);
    console.log(data);

    const height = 400;
    const width = 800;

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("id", "scatter-plot")
      .attr("viewBox", `0 0 ${width + 100} ${height + 100}`);

    let tooltip = svg.append("text").attr("id", "tooltip").style("opacity", 0);

    // Find domain for x-axis
    const years = data.map(d => d.Year);
    const minYear = d3.min(years) - 1;
    const maxYear = d3.max(years) + 1;

    // Create x-axis scale
    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([0, width]);

    // Create x-axis
    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickFormat(d => d.toString())
      .ticks(12)
      .tickSizeOuter(0);

    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(50,450)")
      .style("font-size", "16px");

    // parse times into mins and seconds
    // create new date object for each time
    // using parsed minutes and seconds.
    const times = data.map(d => {
      let time = d.Time.split(":");
      return new Date(0, 0, 0, 0, time[0], time[1]);
    });

    const minTime = new Date(0, 0, 0, 0, 36, 30);
    const maxTime = new Date(0, 0, 0, 0, 40, 0);

    // Create y-axis scale
    const yScale = d3.scaleTime().domain([minTime, maxTime]).range([height, 0]);

    // Create y-axis
    const yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat(d3.timeFormat("%M:%S"))
      .tickSizeOuter(0);

    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(50, 50)")
      .style("font-size", "16px");

    // plot points

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("cx", (d, i) => xScale(years[i]) + 50)
      .attr("cy", (d, i) => yScale(times[i]) + 50)
      .attr("class", "dot")
      .attr("data-xvalue", (d, i) => years[i])
      .attr("data-yvalue", (d, i) => times[i])
      .attr("index", (d, i) => i)
      .attr("fill", d => {
        if (d.Doping != "") return "#708090";
        return "#ffffff";
      })
      .on("mouseover", event => {
        let i = event.target.attributes.index.value;
        console.log(years[i].toString());

        tooltip
          .attr("x", xScale(years[i]) - 25)
          .attr("y", yScale(times[i]) + 75)
          .text(`${data[i].Name} (${data[i].Nationality})`)
          .attr("fill", "#ffffff")
          .attr("data-year", years[i].toString());

        tooltip.style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // TODO: Add Legend
    svg
      .append("rect")
      .attr("width", 200)
      .attr("height", 90)
      .attr("id", "legend")
      .attr("transform", "translate(650,320)")
      .style("fill", "#3d5a80");

    svg
      .append("circle")
      .attr("r", 6)
      .attr("transform", "translate(675,345)")
      .style("fill", "#ffffff");

    svg
      .append("circle")
      .attr("r", 6)
      .attr("transform", "translate(675,385)")
      .style("fill", "#708090");

    svg
      .append("text")
      .attr("transform", "translate(685,350)")
      .style("fill", "#ffffff")
      .text("Not Doping")
      .style("font-size", "16px");

    svg
      .append("text")
      .attr("transform", "translate(685,390)")
      .style("fill", "#ffffff")
      .text("Doping")
      .style("font-size", "16px");
  };
});


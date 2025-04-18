const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const width = 900;
const height = 500;
const padding = 60;

const svg = d3.select("#chart");

fetch(url)
  .then(res => res.json())
  .then(data => {
    const dataset = data.data;

    const xScale = d3.scaleTime()
      .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height - padding, padding]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Tooltip
    const tooltip = d3.select("#tooltip");

    // Bars
    const barWidth = (width - 2 * padding) / dataset.length;

    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", barWidth)
      .attr("height", d => height - padding - yScale(d[1]))
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .attr("data-date", d[0])
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px")
          .html(`Date: ${d[0]}<br>GDP: $${d[1].toFixed(1)} Billion`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });
  });

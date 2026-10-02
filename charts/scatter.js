function renderScatterChart(rows) {
  const mount = document.querySelector("#scatter-chart");
  if (!mount) return;

  const points = rows.filter(
    (row) => Number.isFinite(row.energy_consumpt) && Number.isFinite(row.star2),
  );
  if (points.length === 0) return;

  const width = mount.clientWidth;
  const height = mount.clientHeight;
  if (width === 0 || height === 0) return;

  const margin = { top: 14, right: 18, bottom: 44, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xExtent = d3.extent(points, (row) => row.energy_consumpt);
  const yExtent = d3.extent(points, (row) => row.star2);

  const x = d3.scaleLinear().domain(xExtent).nice().range([0, plotWidth]);
  const y = d3
    .scaleLinear()
    .domain([Math.min(0, yExtent[0]), yExtent[1]])
    .nice()
    .range([plotHeight, 0]);

  const svg = d3
    .select(mount)
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr("role", "img")
    .attr("aria-label", "Scatter plot of TV energy consumption and star rating");

  const plot = svg
    .selectAll("g.plot")
    .data([null])
    .join("g")
    .attr("class", "plot")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  plot
    .selectAll("g.y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).ticks(5).tickSize(-plotWidth));

  plot
    .selectAll("g.x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${plotHeight})`)
    .call(d3.axisBottom(x).ticks(6));

  plot
    .selectAll("circle.point")
    .data(points)
    .join("circle")
    .attr("class", "point")
    .attr("cx", (row) => x(row.energy_consumpt))
    .attr("cy", (row) => y(row.star2))
    .attr("r", 3.5)
    .attr("fill", "#d56845")
    .attr("fill-opacity", 0.62)
    .append("title")
    .text(
      (row) =>
        `${row.energy_consumpt} kWh/year, ${row.star2} star rating (${row.brand})`,
    );

  plot
    .selectAll("text.x-label")
    .data([null])
    .join("text")
    .attr("class", "x-label")
    .attr("x", plotWidth / 2)
    .attr("y", plotHeight + 38)
    .attr("text-anchor", "middle")
    .text("Energy consumption (kWh/year)");

  plot
    .selectAll("text.y-label")
    .data([null])
    .join("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -plotHeight / 2)
    .attr("y", -43)
    .attr("text-anchor", "middle")
    .text("Star rating");

  plot.selectAll(".domain").attr("stroke", "#98aaa0");
  plot.selectAll(".tick line").attr("stroke", "#e5ece7");
  plot.selectAll(".tick text").attr("fill", "#687a73").attr("font-size", 10);
  plot.selectAll(".x-label, .y-label").attr("fill", "#52665d").attr("font-size", 11);
}

window.chartDataPromise.then((datasets) => {
  if (!datasets) return;

  const mount = document.querySelector("#scatter-chart");
  if (!mount) return;

  renderScatterChart(datasets.tvEnergy);
  new ResizeObserver(() => renderScatterChart(datasets.tvEnergy)).observe(mount);
});

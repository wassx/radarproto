let margin = {top: 100, right: 100, bottom: 100, left: 100},
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);



let color = d3.scaleLinear().domain([0, 1])
  .range(["rgba(0,0,0,0)", "rgba(0,0,0,1)"]);

let radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};


//Call function to draw the Radar chart
RadarChart(".radarChart", radarChartOptions);


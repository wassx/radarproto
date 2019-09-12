
/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var margin = {top: 100, right: 100, bottom: 100, left: 100},
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////

var data = [
  [
    {axis:"CPU",value:0.22},
    {axis:"Mem",value:0.28},
    {axis:"Availability",value:0.29},
    {axis:"Disk space",value:0.17},
  ],
  [
    {axis:"CPU",value:0.81},
    {axis:"Mem",value:0.4},
    {axis:"Availability",value:0.6},
    {axis:"Disk space",value:0.24},
  ],
  [
    {axis:"CPU",value:0.12},
    {axis:"Mem",value:0.78},
    {axis:"Availability",value:0.69},
    {axis:"Disk space",value:0.14},
  ]
];
//////////////////////////////////////////////////////////////
//////////////////// Draw the Chart //////////////////////////
//////////////////////////////////////////////////////////////

var color = d3.scale.ordinal()
  .range(["#EDC951","#CC333F","#00A0B0"]);

var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};
//Call function to draw the Radar chart
RadarChart(".radarChart", data, radarChartOptions);

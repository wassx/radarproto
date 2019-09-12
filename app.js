let margin = {top: 100, right: 100, bottom: 100, left: 100},
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

function createRandomData(count) {

  function randn_bm() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
  }

  let data = [];
  let counter = (!count) ? 3 : count;

  for (let i = 0; i < counter; i++) {

    data.push(
      [
        {axis: "CPU", value: randn_bm()},
        {axis: "Mem", value: randn_bm()},
        {axis: "Availability", value: randn_bm()},
        {axis: "Disk space", value: randn_bm()},
      ]
    );

  }
  return data;

}

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


let randomData = createRandomData(30);

//Call function to draw the Radar chart
RadarChart(".radarChart", randomData, radarChartOptions);

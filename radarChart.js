function RadarChart(id, data, options) {
  let cfg = {
    w: 600,				//Width of the circle
    h: 600,				//Height of the circle
    margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
    levels: 0,				//How many levels or inner circles should there be drawn
    maxValue: 0, 			//What is the value that the biggest circle will represent
    labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
    opacityArea: 0.0, 	//The opacity of the area of the blob
    dotRadius: 4, 			//The size of the colored circles of each blog
    opacityCircles: 0, 	//The opacity of the circles of each blob
    strokeWidth: 0.5, 		//The width of the stroke around each blob
    roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.interpolateGreys //Color function
  };

  //Put all of the options into a variable called cfg
  if ('undefined' !== typeof options) {
    for (let i in options) {
      if ('undefined' !== typeof options[i]) {
        cfg[i] = options[i];
      }
    }
  }

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  let maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) {
    return d3.max(i.map(function (o) {
      return o.value;
    }))
  }));

  let allAxis = (data[0].map(function (i, j) {
      return i.axis
    })),	//Names of each axis
    total = allAxis.length,					//The number of different axes
    radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
    Format = d3.format('%'),			 	//Percentage formatting
    angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

  //Scale for the radius
  let rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  //Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();

  //Initiate the radar chart SVG
  let svg = d3.select(id).append("svg")
    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("class", "radar" + id);
  //Append a g element
  let g = svg.append("g")
    .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

  svg.append("g").append("circle").attr("class", "zeroPoint")
    .attr("r", 8)
    .attr("cx", cfg.w / 2 + cfg.margin.left)
    .attr("cy", cfg.h / 2 + cfg.margin.top)
    .style("fill", "#c8c8c8")
    .style("fill-opacity", 1);

  //Filter for the outside glow
  let filter = g.append('defs').append('filter').attr('id', 'glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');


  //Wrapper for the grid & axes
  let axisGrid = g.append("g").attr("class", "axisWrapper");

  //Create the straight lines radiating outward from the center
  let axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 4);
    })
    .attr("y2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 4);
    })
    .attr("class", "line")
    .style("stroke", "#c8c8c8")
    .style("stroke-dasharray", ("3, 3"))
    .style("stroke-width", "1px");

  //Append the labels at each axis
  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 4);
    })
    .attr("y", function (d, i) {
      return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 4);
    })
    .text(function (d) {
      return d
    })
    .call(wrap, cfg.wrapWidth);

  let radarLine = d3.radialLine()
    .curve(d3.curveCardinalClosed)
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return angleSlice * i + Math.PI / 4;
    });

  //Create a wrapper for the blobs
  let blobWrapper = g.selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  //Append the circles
  blobWrapper.selectAll(".radarCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", function (d, i) {
      return d.timestamp < data.length - 1 ? cfg.dotRadius : 6;
    })
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", function (d, i, j) {
      return d.timestamp < data.length - 1 ? "#ffffff" : "#D82A94";
    })
    .style("fill-opacity", function(d, i) {
      return d.timestamp < data.length - 1 ? "0.2" : "1.0";
    })
    .style("opacity", 1);


  blobWrapper.selectAll(".radarCircle").transition()
    .delay(function (d, i) {
      return d.timestamp * 20;
    })
    .duration(350)
    .ease(d3.easeQuadOut)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 4);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 4);
    }).end().then(() => {
    blobWrapper.select(function (d, i) {
      return i >= data.length - 1 ? this : null;
    }).append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) {
        console.log(d);
          return radarLine(d);
      })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", "#D82A94")
      .style("fill", "none")
      .style("filter", "url(#glow)");
  });


  //Wrapper for the invisible circles on top
  let blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d;
    })
    .enter().append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 4);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 4);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function (d, i) {
      newX = parseFloat(d3.select(this).attr('cx')) - 10;
      newY = parseFloat(d3.select(this).attr('cy')) - 10;

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(Format(d.value))
        .transition().duration(200)
        .style('opacity', 1);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200)
        .style("opacity", 0);
    });

  //Set up the small tooltip for when you hover over a circle
  let tooltip = g.append("text")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  function wrap(text, width) {
    text.each(function () {
      let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }//wrap

}//RadarChart

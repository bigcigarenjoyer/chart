const margin = {top: 70, right: 20, bottom: 60, left: 70},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .append("svg")
    .attr("width", 1250)
    .attr("height", 600)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

const fetchText=async (url)=> {
        const response=await fetch(url);
        return await response.text()
}

;
const csvUrl="https://raw.githubusercontent.com/bigcigarenjoyer/chart/main/chart.csv"

fetchText(csvUrl).then(text=> {
                const data=d3.csvParse(text);

var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", `translate(0,${height})`);

x.domain(data.map(d => d.episode));
xAxis.call(d3.axisBottom(x));

 
// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 1000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));


// Bars
svg.selectAll("bar")
  .data(data)
  .enter().append("rect")
  .attr("class","bar")
  .attr("x", function(d) { return x(d.episode); })
  .attr("y", function(d) { return y(d.score); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.score); })
  .attr("fill", "#98DF8AFF");


var yR = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.reward; })])
      .domain([0,60])
      .range([ height, 0 ]);


svg.append("g")				
        .attr("class", "y axis")	
        .attr("transform", "translate(" + width + " ,0)")		
        .call(d3.axisRight(yR));



var line = d3.line()
        .x(function(d) { return x(d.episode) + 17 })
        .y(function(d) { return yR(d.reward) })


    // Add the line
svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "green")
       .attr("stroke-width", 2.5)
       .attr("d", line);

svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", "circleBasicTooltip")
        .attr("cx", function (d) { return x(d.episode) + 17 } )
        .attr("cy", function (d) { return yR(d.reward)})
        .attr("r", 4)
        .style("fill", "black");


svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", 220)
    .attr("y", 310)
    .text("Episodes")
    .style("font-size","1rem");
    

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("dy", "-45")
    .attr("x", -110)
    .attr("transform", "rotate(-90)")
    .text("Score")
    .style("font-size","1rem");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", 'start')
    .attr("dy", "-31rem")
    .attr("x", 100)
    .attr("transform", "rotate(-270)")
    .text("Reward")
    .style("font-size","1rem");

})
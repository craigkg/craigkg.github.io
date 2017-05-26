<script type="text/javascript">
			
// set the graph dimensions
var margin = {top: 30, right: 20, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

// parse the date & time
var parseDate = d3.time.format("%d-%b-%y").parse;
var formatTime = d3.time.format("%e %B");

// set the x- and y-ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .ticks(7);
var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .ticks(8);

// define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

// define datacontainer div
var div = d3.select("body").append("div")	
    .attr("class", "datacontainer")				
    .style("opacity", 0);

// add svg to the DOM
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.csv("{{ include.content }}", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    // scale the range of the x- and y-data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // draw the valueline
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // draw the scatterplot points and bind the mouseover events
    svg.selectAll("dot")	
        .data(data)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return x(d.date); })		 
        .attr("cy", function(d) { return y(d.value); })		
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", 1);		
            div	.html("The value on " + formatTime(d.date) + " was " + d.value + ".")	
                .style("left", "20px")		
                .style("top", "640 px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    // draw the coordinate axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});			
		
		</script>		

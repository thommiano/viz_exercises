
//-----------//
// Resources //
//-----------//
// DC.js documentation: https://dc-js.github.io/dc.js/docs/stock.html
// Confused about cross-filter? Check out this tutorial! http://www.codeproject.com/Articles/693841/Making-Dashboards-with-Dc-js-Part-Using-Crossfil
// EXCELLENT guide to learning d3: http://chimera.labs.oreilly.com/books/1230000000345/pr01.html

//-------------------//
// Make some charts! //
//-------------------//

d3.csv("../data/experiment_long.csv", function(data) {

	dataset = data;

	console.log(dataset); // In your browser use the dev tools to see the output of the dataset. If you see it, then you know you're accessing it

	// Apply crossfilter
	var ndx = crossfilter(dataset)

	// Select dimension
	var expDim = ndx.dimension(function(d) {return d.experiment;});
	// Select how to group what you return from the previous dimension
	var expGroup = expDim.group().reduceSum(function(d) {return d.results;});

	// Create a row chart object, and assign it to a class that can be called in an HTML div
	var expChart = dc.rowChart("#exp_chart");

	// Build the chart
	expChart
		.width(600).height(275) // Charting dimensions of the svg
		.dimension(expDim) // Column of data being selected
		.group(expGroup) // How to group the data being returned
		.ordinalColors(["#D25539", '#7086C4']) // Bad hack. Figure out how to assign color globally
		.xAxis().ticks(10).tickFormat(d3.format("d"))
		.tickSubdivide(0);
	
	// Repeat the above methodology for creating new charts.

	var compDim = ndx.dimension(function(d) {return d.composition;});
	var compGroup = compDim.group().reduceSum(function(d) {return d.results;});

	var compChart = dc.rowChart("#comp_chart");
	compChart
		.width(600).height(275)
		.dimension(compDim)
		.group(compGroup)
		.ordinalColors(['#7086C4',"#D25539"])
		.xAxis().ticks(10).tickFormat(d3.format("d"))
		.tickSubdivide(0);

	var resultDim = ndx.dimension(function(d) {return d.results;});
	var resultGroup = resultDim.group().reduceSum(function(d) {return d.results;})

	// Note: the naming below of 'type' is entirely arbitrary, and a better name could be used

	var typeDimension = ndx.dimension(function (d) {return d.results;});
	var typeGroup = typeDimension.group().reduceCount(function (d) {return d.results;});
	
	// What's the maximum value that we're selecting on?
	var typeMax = typeGroup.top(1)[0].value;
	console.log(typeMax); // Prints the value in the console

	// var keyMax = typeDimension.top(1)[0].key;
	// console.log(keyMax)

	var barChart = dc.barChart("#bar_chart");
	barChart
	    .width(innerWidth-150)
	    .height(300)
	    .margins({top: 50, right: 50, bottom: 50, left: 50}) 
	    .x(d3.scale.linear().domain([0,300])) // This should be adjusted
	    .y(d3.scale.linear().domain([0,typeMax])) 
	    .colors(['#BA902C'])
	    .brushOn(false)
	    .dimension(typeDimension)
	    .yAxisLabel("This is the Y Axis!")
	    .centerBar(false)
	    .gap(1) // Pixels between rects
	    .elasticY(true)
	    .elasticX(true)
	    .title(function (d) {return Math.floor(d.key) + ": " + d.value ;})
	    .group(typeGroup);

	dc.renderAll(); // Render all of the charts created above. Without this the charts will not show up.

});

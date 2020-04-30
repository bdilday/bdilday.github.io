
var doAnimate = 1;
var vbose=0;
var width = 800,
    height = 600;
var dx = 300;
var dy = 100;
var mnyear = 1776;
var mxyear = 2015;
var animateInterval = 300 // milliseconds

var nyear = 20.0;
var smallCircle = 4.0;
var bigCircle = 6.0;
var myDuration = 250;

var startOpacity = 0.8;
var landEndOpacity = 0.8;

function parseData(data) {
    var adata = [];

    for (i=0 ; i<data.length ; i++ ) {

	p = [360.0-data[i]["lon"],data[i]["lat"]];
	if (vbose>=1) {
	    console.log(p);
	}
	pr = projection(p);
	if (vbose>=1) {
	    console.log(pr);
	}
	data[i]["cx"] = pr[0];
	data[i]["cy"] = pr[1];

	data[i]["startyear"] = parseInt(data[i]["startyear"], 10);
	data[i]["endyear"] = parseInt(data[i]["endyear"], 10);

	adata.push(data[i]);
    }
    return adata;
    
};


/**
var projection = d3.geo.orthographic()
    .scale(500)
    .translate([width / 2, height / 2])
    .rotate([110, -30])
    .clipAngle(90);
**/


var projection = d3.geo.stereographic()
    .scale(800)
    .translate([width / 2, height / 2])
    .rotate([100, -40])
    .clipAngle(90);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");


/********************************************************/
d3.json("dollop_timeline.json", function(error, us) {
    
    if (error) return console.error(error);

    if (vbose>=2) {
	console.log(us);
    }


    svg.selectAll("text")
	.data([mnyear])
	.enter()
	.append("text")
	.attr("id", "year-label")
	.attr("x", 375)
	.attr("y", 145)
	.text(function(d) { 
	    if (vbose>=1) {
		console.log(["text", d]);
	    }
	    return d;
	})
	.style("font-family", "sans-serif")
	.style("font-size", "20px")
        .style("fill", "#555")
    ;
    
    function bubbleLabel(d) {
	return d.description;
    }

    var bubbleTip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d) {
//	    console.log(['btip-d', d]);
	    var hstr = "";
	    hstr += "<p>" ;
	    hstr += bubbleLabel(d);
	    hstr += "<img width=\"200\" height=\"140\" src=\"imgs/ep" + d.dep + ".png" + "\"></img>"
	    hstr += "</p>";
	    return hstr;
	});
    
    g.call(bubbleTip);

    var land = g.selectAll("path")
	.data(topojson.feature(us, us.objects.us_40).features)
	.enter()
	.append("path")
	.attr("class", "land")
	.attr("d", path)
        .style("fill", function(d) {
	    if (vbose>=1) {
		console.log(["fill", d, mnyear, d.properties["year"]<=mnyear ? "white" : "#555"]);
	    }
	    return d.properties["year"]<=mnyear ? "#555" : "white" ;
//	    return "white";
	})
	.style("opacity", startOpacity)
    ;

    
    g.append("path")
	.datum(topojson.mesh(us, us.objects.us_40, function(a, b) 
			     { 
				 return a !== b; 
			     }
			    ))
	.attr("class", "border")
	.attr("d", path)
	.style("opacity", startOpacity);

    

    var grid = d3.geo.graticule();
    g.append("path")
        .datum(d3.geo.graticule())
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "#000000")
        .style("stroke-width", "0.5px")
	.style("opacity", 0.1);

    var color = d3.scale.category20();

    /********************************************************/
    d3.csv("data/the_dollop.csv", function(error, data) {

	adata = parseData(data);

//	console.log(["data", adata]);


	g.selectAll("text")
	    .data(adata)
	    .enter()
	    .append("text")
	    .attr("id","descriptions")
	    .text(function(d) {
		if (vbose>=1) {
		    console.log(["maketext", d]);
		}
		return d.name;
	    })
	    .attr("x", function(d) { return d.cx; } ) 
	    .attr("y", function(d) { return d.cy; } ) 
	    .style("opacity", 1)
	    .style("font-size", "8 px")
	    .style("text-align", "center")
	    .style("text-anchor", "middle")
	    .attr("fill", "#000")
	    .on("mouseover", bubbleTip.show)
	    .on("mouseout", bubbleTip.hide)
	;
	
	g.selectAll("circle")
	    .data(adata)
	    .enter()
	    .append("circle")
	    .attr("id", "circles")
	    .attr("cx", function(d) { return d.cx; } ) 
	    .attr("cy", function(d) { return d.cy; } ) 
	    .attr("r", smallCircle)
	    .style("opacity", 0.2)
	    .style("fill", "#4682B4")
	    .on("mouseover", bubbleTip.show)
	    .on("mouseout", bubbleTip.hide)
	;

    })




/**
**/
   
    var ic = 0;

    if (doAnimate>0) {
	setInterval(function () {
	    thisyear = ic + mnyear
	    if (vbose>=2) {
		console.log(["ic", ic, thisyear]);
	    }
	    g.selectAll(".land")
		.transition()
		.duration(800)
		.style("fill", function(d) {
		    var y = d.properties["year"];
		    return y<thisyear+20 ? "#555" : "none";
		})
		.style("opacity", function(d) {
		    var y = d.properties["year"];
		    var op = (y-thisyear)*(-1.0/nyear) + 1 ;
		    if (op>landEndOpacity) {
			op = landEndOpacity;
		    }
		    if (op<startOpacity) {
			op=startOpacity;
		    }
		    
		    return op;
		    
		});
	    
	    g.selectAll("text#descriptions")
		.transition()
		.duration(myDuration)
		.style("opacity", function(d) {
		    return (thisyear>=d.startyear) ?
			(thisyear<=d.endyear) ? 
			1 : 0 : 0;
		})
		.style("font-size", function(d) {
		    return (thisyear>=d.startyear) ?
			(thisyear<=d.endyear) ? 
			"24 px" : "2 px" : "2 px";
		})

	    ;

	    g.selectAll("circle#circles")
		.transition()
		.duration(myDuration)

		.attr("r", function(d) {
		    return (thisyear>=d.startyear) ?
			(thisyear<=d.endyear) ? 
			bigCircle : smallCircle : smallCircle; 
		    })
		.style("opacity", function(d) {
		    return (thisyear>=d.startyear) ?
			(thisyear<=d.endyear) ? 
			0.9 : 0.3 : 0.3 ;
		})
	    ;
	    
	    svg.selectAll("text#year-label")
		.text(thisyear)
	    ;
	    

	    ic += 1;
	    ic = ic % (mxyear+1-mnyear);
	}, animateInterval)
    };


	
})

/**
**/
var zoom = d3.behavior.zoom()
    .on("zoom",function() {

	if (vbose>=2) {
	    console.log(["zoom", d3.event]);
	}

        g.attr("transform",
	       "translate(" + 
	       d3.event.translate.join(",") +
	       ")scale(" +
	       d3.event.scale+
	       ")"
	      );



/**
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 
**/

  });

svg.call(zoom)


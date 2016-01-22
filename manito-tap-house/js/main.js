
var startRadius = 10.0;
var projName = "mercatorXX";

var vbose = 1;
var thisPub = "mth";
var pub_pos = {};
pub_pos["mth"] = {"lon" : 117.401386, "lat" : 47.627244} ;
var blah;

var dataByStyle = {};
var dataByBrewery = {};

//var style2idx = {}

var earthRadius = 3959.0; 
var deg2rad = 3.14159265359/180.0;

var width = 800,
    height = 600;
var dx = 300;
var dy = 100;

var beerToId = {};
var beerStyleToDisplayString = {};

var gpath = d3.geo.path()
    .projection(null);

/****************************/

var usCenter = [360.0-98.5, 30.0];


if (projName === "mercator") {
    var projection = d3.geo.mercator()
	.center([120, 50 ])
	.scale(200)
	.rotate([-180,0]);

} else {

    var projection = d3.geo.orthographic()
	.scale(500)
	.translate([width / 2, height / 2])
	.rotate([pub_pos["mth"]["lon"], -pub_pos["mth"]["lat"]])
    //    .rotate([122, -47])
	.clipAngle(90);
}



var path = d3.geo.path()
    .projection(projection);

var brew_radius = d3.scale.linear()
    .domain([0, 100])
    .range([2, 8]);

var style_radius = d3.scale.linear()
    .domain([0, 100])
    .range([2, 10]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var lam = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var psi = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

/**
	svg.on("mousemove", function() {
	    var p = d3.mouse(this);
	    projection.rotate([lam(p[0]), psi(p[1])]);
	    svg.selectAll("path").attr("d", path);
	});
**/	


var chart = svg.append('g');
/**
    .classed('chart', true)
    .attr('transform', 'translate(80, -60)');
**/

/***************************/
var toggleStuff = (function(){
    var currentWeight = "normal";
    var currentSelected = "false";
    var currentActive = true;
    var newOpacity = 1;

    return function(){
        currentWeight = currentWeight == "normal" ? "bold" : "normal";
        currentSelected = !currentSelected;
	currentActive = currentSelected;
	newOpacity = currentSelected ? 1 : 0 ;
        d3.select(this).style("font-weight", currentWeight);
        d3.select(this).classed("selected", currentSelected);
//	console.log(["id is ", d3.select(this), " d is ", d]);

	
	var sty = (d3.select(this)[0][0].id).replace("menu-", "geoarc-");

	console.log(["id is ", d3.select(this), sty
		    ]);

	var idx = "#" + sty;
	d3.selectAll(idx)
	    .style("opacity", function(d) {
		console.log(["select", idx, d]);
		return newOpacity;
	    })

    }

})();


/***************************/
var toggleBubble = (function(){

    return function(){
        d3.select(this).style("font-weight", currentWeight);


    }

})();


/***************************/
function updateStyleLists() {
    ;
}

/***************************/
function geodesicDistance(pos1, pos2) {

    l1 = pos1[0]*deg2rad;
    d1 = pos1[1]*deg2rad;
    l2 = pos2[0]*deg2rad;
    d2 = pos2[1]*deg2rad;
    
    return earthRadius*Math.acos(Math.cos(d1)*Math.cos(d2)*Math.cos(l1-l2) + Math.sin(d1)*Math.sin(d2));

}

/***************************/
function parseData(data) {
    var adata = [];
    var bstyles = [];
    var tmp = {};
    var p, pr;
    var idx;
    var kbs;

    for (i=0 ; i<data.length ; i++ ) {
	if(data[i]) {

	    if ( !(data[i].abv)) {
		continue;
	    }

	    if (vbose>=1) {
		console.log(["parse", i, data[i]]);
	    }

	    bs = data[i]["menu_beer_style"];
	    kbs = bs.replace(/ +/g, '');

	    kbs = kbs.replace(/\//g, '');

	    if (vbose>=1) {
		console.log(["kbs-fill", kbs]);
		}

	    br = data[i]["brewery"];

	    beerStyleToDisplayString[kbs] = bs;

	    if ( !(kbs in tmp)) {
		tmp[kbs] = 1;
		bstyles.push(kbs);
		if (vbose>=1) {
		    console.log(["bstyles-fill", bstyles]);
		}
		dataByStyle[kbs] = [];
	    }

	    if ( !(br in dataByBrewery)) {
		dataByBrewery[br] = [];
	    }
	    
	    dataByStyle[kbs].push(data[i]);
	    dataByBrewery[br].push(data[i]);

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
	    data[i]["kbs"] = kbs;

	    adata.push(data[i]);
	    
	    var pos1 = [pub_pos[thisPub]["lon"], pub_pos[thisPub]["lat"]];
	    var pos2 = [data[i]["lon"], data[i]["lat"]];

	    data[i]["geodesicDistance"] = geodesicDistance(pos1, pos2);
	}
    }
    bstyles.sort();
    return [adata, bstyles];

}


/***************************************************/
/***************************************************/
function main() {
d3.json("us_mth.json", function(error, us) {
//d3.json("data/world-110m.json", function(error, us) {

    if (error) return console.error(error);

    function bubbleLabel(d) {
	var fmt = d3.format(".1f")
	var str = "";
	var dbb = dataByBrewery[d.brewery]; 
	
	console.log(["bubbleLabel", d, dbb]);
	str += 	"<div id=\"bubblehead\">" 
	str += "<p><strong>" 
	    + d.brewery + "</p>";
	str += "</div>";	

	str += 	"<div id=\"bubblemiles\">" 
	    + "<p>( " + fmt(d.geodesicDistance) + " miles) " 
	    + "</p>";
	for (i=0; i<dbb.length; i++) {
	    str += "<div id=\"bubblelab\"><p><span>" 
	    str += dbb[i].beer 
	    str += " ( " + dbb[i].beer_style + " " + fmt(dbb[i].abv) + " ABV )";
	    str += "</span></p>" + "\n"
	    str += "</div>";
	}

	return str;
    };
    

    function makeMenuLabelText(d) {
	var fmt = d3.format(".1f")
	var str = "";
	var dbb = dataByStyle[d]; 
	if (vbose>=2) {
	    console.log(["menuLabel", dataByStyle, d, dbb]);
	}
	str += 	"<div id=\"menuhead\">" 
	str += "<p><strong>" + beerStyleToDisplayString[d] + "</strong></p>"
	str += "</div>";

	for (i=0; i<dbb.length; i++) {
	    str += "<div id=\"menulab\"><p><span>" 
	    str += dbb[i].brewery + " " + dbb[i].beer + " ( " + fmt(dbb[i].abv) + " ABV )";
	    str += "</span></p>" + "\n"
	    str += "</div>";
	}

	return str;
    }

    function menuLabel(d) {
	if (vbose>=1) {
	    console.log(["menuLabel", d, beerStyleToDisplayString[d]]);
	}
 
	var str = makeMenuTextLabel(d); 
	return str;
    };
    


    var bubbleTip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
	    console.log(["tip", d]);
	    return bubbleLabel(d);
	})
    
    chart.call(bubbleTip);

    var menuTip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
	    console.log(["tip", d]);
	    return menuLabel(d);
	})
    
    chart.call(menuTip);

    if (vbose>=2) {
	console.log(us);
    }

    chart.append("path")
	.datum(topojson.feature(us, us.objects.us_40))
	.attr("class", "land")
	.attr("d", path);
    
    chart.append("path")
	.datum(topojson.mesh(us, us.objects.us_40, function(a, b) { return a !== b; }))
	.attr("class", "border border--state")
	.attr("d", path);

    chart.append("text")
	.attr({'id': 'brewLabel', 'x': 60, 'y': 60})
	.style({'font-size': '40px', 'fill': '#ddd'});
    

    var p = [360.0-pub_pos[thisPub]["lon"], pub_pos[thisPub]["lat"]];
    var pr = projection(p)
    
    chart.append("g")
	.attr("class","home-bubble")
	.append("circle")
	.attr("cx", pr[0])
	.attr("cy", pr[1])
	.attr("r", 3)
	.attr("color", d3.rgb(1, 0.2, 0.2))
	.on("mouseover", function(d) {
	    d3.select('svg #brewLabel')
		.text("Manito Tap House")
		.transition()
		.duration(500)
		.style('fill', '#555')
		.style('opacity', 1)
		.style('font-size', "18px")
		.style('font-weight', "bold")
		.style('fill', "blue")
		.attr('x', pr[0])
		.attr('y', pr[1])
	})
	.on('mouseout', function(d) {
	    d3.select('svg g.chart #XXXbrewLabel')
		.transition()
		.duration(1500)
		.style('opacity', 0);
	})
    ;    


    d3.csv("data/beers.csv", function(error, data) {
	if (error) return console.error(error);
	
	
	console.log(["data", data]);
	var ans = parseData(data);
	var data = ans[0];
	var bstyles = ans[1];

	if (vbose>=1) {
	    for (kbs in bstyles) {
		console.log(["kbs", kbs]);
	    }
	}

	// define a style-to-color mapping
	var styleColors = d3.scale.category20c();
//	var styleColors = d3.scale.category10();


	console.log(["dataNest", dataByBrewery, dataByStyle]);
	console.log(["bubbleTip", bubbleTip]);


	chart.append("g")
	    .attr("class", "bubble")
	    .selectAll("circle")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("id",function(d) {
		if (vbose>=1) {
		    console.log("bubble-" + d.brewery); 
		}
		return "bubble-" + d.brewery})
	    .attr("cx", function(d) { return d.cx;})
	    .attr("cy", function(d) { return d.cy;})
	    .attr("r", function(d) { return brew_radius(d.brewery_rating); })
	    .attr("fill", function(d) { return "black" ;})
	    .attr("opacity", 0.8)
	    .on("mouseover", bubbleTip.show)
	    .on("mouseout", bubbleTip.hide)
	;


	console.log(["nowdata", data]);


	p = [360.0-pub_pos[thisPub]["lon"],pub_pos[thisPub]["lat"]];
	pr = projection(p);
	pub_pos[thisPub]["cx"] = pr[0];
	pub_pos[thisPub]["cy"] = pr[1];

	chart.append("g")
	    .attr("class", "geoarc")
	    .selectAll("path")
	    .data(data)
	    .enter()
	    .append("path")
	    .attr("id", function(d) {
//		console.log("geoarc-" + d.menu_beer_style); 
		return "geoarc-" + d.kbs;
	    })
	    .datum(function(d, i) {
		if (vbose>=1) {
		    console.log(["arcs", i, d.brewery, 360.0-d.lon, d.lat]);
		}

/**
		return {type: "LineString", coordinates:
			[
			    [360.0-pub_pos[thisPub]["lon"],pub_pos[thisPub]["lat"]]
			    ,[360.0-d.lon,1.0*d.lat]
			]
		      }
**/
		var idx = bstyles.indexOf(d.menu_beer_style);
		var dr = brew_radius(d.brewery_rating);

		var f_dy = d3.scale.linear()
		    .domain([0, bstyles.length])
		    .range([-dr, dr]);

		if (vbose>=1) {
		    console.log(["bs", bstyles, d.menu_beer_style, idx, dr]);
		}
		// a linear function that goes from -dr to +dr.


		return {type: "LineString", coordinates:
			[
			    [pub_pos[thisPub]["cx"],pub_pos[thisPub]["cy"]]
			    ,[d.cx, d.cy+f_dy(idx)]
			]
		      };

	    })
	    .attr("fill", function(d) { 
		return "black" ;
	    })
	    .style("stroke", "black")
	    .attr("d", gpath)
	;



	var onstyles = {"All": 1};

	d3.select('#s-menu-l')
	    .selectAll('li')
	    .data(["All"].concat(bstyles))
	    .enter()
	    .append('p')
	    .attr("id",function(d) {
		if (vbose>=1) {
		    console.log("menu-" + d.replace(/ +/g, ''));
		}
		return "menu-" + d.replace(/ +/g, '');
	    })
	    .text(function(d) {return beerStyleToDisplayString[d];}
		 )
	    .classed("selected", function(d) {
		console.log([d, d in onstyles]) ; return (d in onstyles); }
		    )
	;


	var geoarcs = chart.selectAll(".geoarc")
	    .selectAll("path")
	    .data(data)
	    .style("stroke", function(d, i) { 
		if (vbose>=1) {
		    console.log(["blah", d]); 
		    console.log(["style", d.kbs, bstyles, bstyles.indexOf(d.kbs)]);
		}
		return styleColors(bstyles.indexOf(d.kbs));
	    })


	    .style("stroke-width", function(d, i) { 
		return 2 ;
	    })
;

//	    .attr("d", path);


	var grid = d3.geo.graticule();
	chart.append("path")
            .datum(d3.geo.graticule())
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "#000000")
            .style("stroke-width", "0.5px")
	    .style("opacity", 0.1);

	var div = d3.select("body").append("div")   
	    .attr("class", "menutooltip")               
	    .style("opacity", 0);

	d3.select("#s-menu-l")
	    .selectAll("p")
	    .attr("color", "black")
	    .style("font-size", "14px")
//	    .style("font-weight", "bold")
	    .style("text-align", "right")
	    .on("click", toggleStuff)
	    .on("mouseover", function(d) {      
		console.log(["mouseover", d, d3.event.pageX, d3.event.pageY]);
		var h = (dataByStyle[d]).length;
		var tag = "#geoarc-" + d;
		if (vbose>=1) {
		    console.log(["mouseover-h", h, d, "tag", tag]);
		}

		div.style("height", function(d) {
		    console.log(["set height to", h*20 + 20 + "px"]);
		    return h*20 + 40 + "px";
		})
		    .transition()        
                    .duration(400)      
                    .style("opacity", .9);
		console.log(makeMenuLabelText(d));
		div.html(makeMenuLabelText(d))  
                    .style("left", (d3.event.pageX + 20) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");	    
		chart.selectAll(tag)
		    .style("stroke-width", 20);
		
            })         
            .on("mouseout", function(d) {       
		var tag = "#geoarc-" + d;
		div.transition()        
                    .duration(800)      
                    .style("opacity", 0);   
		d3.selectAll(tag)
		    .style("stroke-width", 2);

	    })
//menuTip.show)
//menuTip.hide)
	;


	d3.select("svg")
	    .selectAll("circle")
	    .attr("fill",d3.rgb(50,150,250));


    })





});
    

    
var zoom = d3.behavior.zoom()
	.on("zoom",function() {
	    console.log(["zoom", d3.event]);
	    
            chart.attr("transform",
		       "translate(" + 
		       d3.event.translate.join(",") +
		       ")scale(" +
		       d3.event.scale+
		       ")"
		      );
/**	    
            chart.selectAll("path")  
		.attr("d", path.projection(projection)); 

            geoarcs.selectAll("path")  
		.attr("d", path.projection(projection)); 

**/

	    chart.selectAll(".bubble")
		.selectAll("circle")
		.attr("r", function(d) { 
		    return brew_radius(d.brewery_rating)/Math.sqrt(d3.event.scale); 
		})

	    chart.selectAll(".geoarc")
		.selectAll("path")
		.attr("stroke-width", function(d) { 
		    console.log(["zoom geo", d]);
		    return 10;
		})

	});
    
    svg.call(zoom);    



}

/***********************
 ***********************/	
main();


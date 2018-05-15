/**
 * Created by bdilday on 5/14/18.
 */


var svg = d3.select("body")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 1000);


var width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 20, right: 30, bottom: 30, left: 40};

var contour = {
    offset_x: 780,
    offset_y: 80,
    width: 275,
    height: 275,
    bandwidth: 8,
    cellSize: 4
};

var scatter = {
    width: 650, height: 650
};

scatter.x = d3.scaleLinear()
    .domain([0, 100])
    .rangeRound([margin.left, scatter.width - margin.right]);

scatter.y = d3.scaleLinear()
    .domain([100, 0])
    .rangeRound([margin.left, scatter.width - margin.right]);

contour.x = d3.scaleLinear()
    .domain([0, 120])
    .rangeRound([margin.left, contour.width - margin.right]);

contour.y = d3.scaleLinear()
    .domain([-50, 90])
    .rangeRound([contour.height - margin.bottom, margin.top]);

var color = d3.scaleSequential(d3.interpolateYlGnBu)
    .domain([0, 0.02]); // Points per square pixel.


d3.json("la_ls_20180513.json", function(error, in_data) {
    if (error) throw error;

    var data = in_data.launch_data;

    var ndata = {};

//    console.log(in_data);

    function update_contour(id) {
        var cdata = d3.contourDensity()
            .x(function (d) {
                return contour.x(d.launch_speed);
            })
            .y(function (d) {
                return contour.y(d.launch_angle);
            })
            .size([width, height])
            .bandwidth(contour.bandwidth)
            .cellSize(contour.cellSize)
            (data[id]);

  //      console.log("update! ", cdata, cdata.length);
        //var g = contour_graph.data(cdata);
       // g.exit().remove();

        var g = d3.selectAll(".cpath").data(cdata);
        //console.log(g);

/*
        g.exit()
            .attr("fill", "none");
*/

//        g.attr("fill", "none").attr("stroke", "none");

//        g.exit().remove();


        g.enter().append("path").attr("class", "cpath")
            .attr("stroke", "black")
            .attr("fill", function (d) {
                return color(d.value);
            })
            .attr("d", d3.geoPath());

        g.attr("class", "cpath")
            .attr("d", d3.geoPath())
            .attr("fill", function (d) {
                return color(d.value);
            })



        g.exit().remove();

/*
        g = contour_graph.data(cdata);

        g.enter().append("path")
            .attr("fill", function (d) {
                return color(d.value);
            })
            .attr("d", d3.geoPath());
*/


    }


    var cdata = d3.contourDensity()
        .x(function (d) {
            return contour.x(d.launch_speed);
        })
        .y(function (d) {
            return contour.y(d.launch_angle);
        })
        .size([width, height])
        .bandwidth(contour.bandwidth)
        .cellSize(contour.cellSize)
        (data['134181']);

//    console.log(cdata);

    var biglabel = svg.append("text")
            .attr("id", "biglabel")
        .attr("x", contour.offset_x + margin.left)
        .attr("y", contour.offset_y + margin.top - 20)
        .text("---")
        .attr("font-family", "sans-serif")
        .attr('font-size', "28px")
    ;


    function mouseover(d) {
        //console.log(d.data);
        update_contour(d.data.batter);
        biglabel.text(d.data.player_name);
    }

    function mouseout(d) {
    //    console.log(d);
    }

    var voronoi = d3.voronoi()
        .x(function(d) { return scatter.x(d.x1); })
        .y(function(d) { return scatter.y(d.x2); })
        .extent([[0, 0], [margin.left + scatter.width, margin.top + scatter.height]]);


    svg.selectAll(".playerlabel")
        .data(in_data.batters)
        .enter()
        .append('text')
        .attr("class", "playerlabel")
        .attr("x", function(d) {
            return scatter.x(d.x1);
        })
        .attr("y", function(d) {
            return scatter.y(d.x2);
        })
        .text(function(d) {
            return d.player_name;
        })
        .attr("font-family", "sans-serif")
        .attr('font-size', "8px")
        .attr("pointer-events", "none")
    ;


    var polygon = svg.append("g")
            .attr("class", "polygons")
            .selectAll("path")
            .data(voronoi.polygons(in_data.batters))
            .enter().append("path")
            .attr("d", function(d) {
                return d ? "M" + d.join("L") + "Z" : null;
   //         return "M" + d.join("L") + "Z" ;
                 })
                 .attr("fill", "none")
            .attr("pointer-events", "all")
            .style("alpha", 0)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        ;




    svg.append("g")
        .attr("transform", "translate(0," + (scatter.height + margin.top - margin.bottom) + ")")
        .call(d3.axisBottom(scatter.x).ticks(null, ".1f"))
        .select(".tick:last-of-type text")
        .select(function() { return this.parentNode.appendChild(this.cloneNode()); })
        .attr("y", -3)
        .attr("dy", null)
        .attr("font-weight", "bold")
        .text("x1");

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(scatter.y).ticks(null, ".1s"))
        .select(".tick:last-of-type text")
        .select(function() { return this.parentNode.appendChild(this.cloneNode()); })
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("x2");


    svg.append("g")
        .attr("transform", "translate(" + (contour.offset_x + margin.left) + "," + (contour.offset_y + contour.height + margin.top) + ")")
        .call(d3.axisBottom(contour.x).ticks(null, ".1f"))
        .select(".tick:last-of-type text")
        .select(function() { return this.parentNode.appendChild(this.cloneNode()); })
        .attr("y", -3)
        .attr("dy", null)
        .attr("font-weight", "bold")
        .text("launch speed");

    svg.append("g")
        .attr("transform", "translate(" + (margin.left + contour.offset_x) + "," + contour.offset_y + ")")
        .call(d3.axisLeft(contour.y).ticks(null, ".1s"))
        .select(".tick:last-of-type text")
        .select(function() { return this.parentNode.appendChild(this.cloneNode()); })
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("launch angle");



    svg.selectAll("circle")
        .data(in_data.batters)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return scatter.x(d.x1);
        })
        .attr("cy", function(d) {
            return scatter.y(d.x2);
        })
        .attr("r", 1)
    ;


    //svg.insert("g", "g")

    var contour_graph = svg.append("g")
            .attr("class", "thecontours")
        .attr("transform", "translate(" + contour.offset_x + "," + contour.offset_y + ")")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(cdata)
        ;

    contour_graph.enter()
        .append("path")
        .attr("class", "cpath")
        .attr("fill", function (d) {
           // console.log(d.value);
            return color(d.value);
        })
        .attr("d", d3.geoPath());


});

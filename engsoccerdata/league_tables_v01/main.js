
var unhighlighted_stroke_width = 1;
var highlighted_stroke_width = 1;

var margin = {top: 80, right: 20, bottom: 30, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

var stroke_color = {0: '#6baed6', 1: '#fd8d3c' };
var stroke_color_highlight = {0: '#6baed6', 1: '#fd8d3c' };

var lines = {};

var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0])
    ;

var yaxis = d3.svg.axis()
    .orient("left")
    .scale(y);


var maxyear = 35783;
var x = d3.scale.linear()
        .rangeRound([0, width-200])
        .domain([0, maxyear]);

var xaxis = d3.svg.axis()
    .orient('bottom')
    .scale(x);

var mouseout = function (d) {
    highlight_off(d);
};

var mouseover = function (d) {
    highlight_on(d);
    setLabel(d);
};

var setLabel = function (d) {
    svg.selectAll(".line-text1")
        .text(full_names[d.k]);
    ;
};

function highlight_on(d) {
    lines[d.k]
        .transition()
        .duration(50)
        .style("stroke-opacity", 1)
        .style('opacity', 1)
        .style('visibility', 'visible')
        .style("stroke-width", highlighted_stroke_width)
        .style("stroke", 'black')
    ;
}

function highlight_off(d) {
    lines[d.k]
        .transition()
        .duration(50)
        .style("stroke-opacity", 0.05)
        .style('visibility', 'hidden')
        .style("stroke-width", unhighlighted_stroke_width)
        .style("stroke", 'black')
    ;
}

var interpolate_type = 'linear';
var line = d3.svg.line()
    .x(function(d) {
//        console.log('line x ', d.x, x(d.x));
        return x(d.x);
    })
    .y(function(d) {
//        console.log('line y ', d.y, x(d.y));
        return y(d.y);
    })
    .interpolate(interpolate_type);

/****************************************/
d3.json('englandFB.json', function(data) {


    var make_path = function(teamid) {

        var t = _.map(data[teamid], function(d, i) {
            return {
                y: 96 - d.iy,
                x: d.ix,
                tx: x(d.ix),
                ty: y(d.iy)};
        });


        lines[teamid] = svg.append("path")
            .attr("d", line(t))
            .attr("stroke", function () {
                return 'black';
            })
            .attr("stroke-width", unhighlighted_stroke_width)
            .style('opacity', 0.05)
            .style('visibility', 'hidden')
            .attr("fill", "none")
            .attr('id', function () {
                return 'path-' + teamid;
            })
            .attr("class", "player-path " + teamid)
            .on("mouseover", function (d) {
                mouseover({k: teamid});
            })
            .on("mouseout", function (d) {
                mouseout({k: teamid});
            });

    };


    _.forEach(data, function(v, k) {
        //  console.log('make_path for ', k);
        make_path(k);
    });



    var cur = [];
    _.forEach(data, function(v, k) {
        //console.log('cur', d)
         cur.push(k);
    });

    cur = _.uniq(cur);
    cur.sort();

    svg.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0,' + y(100) + ')')
        .call(xaxis)
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text('time')
        .attr('transform', 'translate(-40, 20)')
    ;

    var player_anchor_offset = 0;
    svg.append("text")
        .attr("class", "line-text1")
        .attr("x", width-0.5*width)
        .attr("y", player_anchor_offset)
        .attr("font-size", 14)
        .attr('text-anchor', 'middle')
        .style('visibility', 'hidden')
        .text("BLAHBLAHBLAH")
    ;

    var cl = cur.length/2;

    var buf = 12;
    svg.selectAll('.player-hook')
        .data(cur)
        .enter()
        .append('text')
        .attr('class', 'player-hook')
        .attr('id', function(d) {
            return 'player-hook-' + d;
        })
        .attr('x', function(d, i) {
            return  width - 100 + 90 * Math.floor(i/cl);
        })
        .attr('y', function(d, i) {
            return player_anchor_offset + buf*( i%cl + 1);
        })
        .attr("font-size", 10)
        .text(function(d, i) {
            return d;
        })
        .attr('text-anchor', 'end')
        .on("mouseover", function (d) {
            d3.select(this)
                .style('font-size', 14)
                .style('font-weight', 'bold')
                .style('fill', stroke_color[1]);
            mouseover({k: d});
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style('font-size', 10)
                .style('font-weight', 'normal')
                .style('fill', 'black');

            mouseout({k: d});
        })
        .attr('cursor', 'pointer')
    ;

});


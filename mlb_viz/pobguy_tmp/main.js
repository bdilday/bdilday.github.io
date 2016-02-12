/**
 * Created by bdilday on 2/11/16.
 */

var margin = {top: 100, right: 10, bottom: 100, left: 300},
    width = 1100 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0])
    .domain([0,1]);

var ynav = d3.scale.linear()
    .rangeRound([height, 0])
;

var ynavboxes = d3.scale.ordinal()
        .rangeRoundBands([height, 0])
    ;

var xaxis = d3.svg.axis()
    .orient("bottom")
    .scale(x);

var yaxis = d3.svg.axis()
    .orient("left")
    .scale(y);

var ynavaxis = d3.svg.axis()
    .orient("left")
    .scale(ynav);


var interpolate_type = 'linear';
var line = d3.svg.line()
    .x(function(d) {
        return x(d.x);
    })
    .y(function(d) {
        return y(d.y);
    })
    .interpolate(interpolate_type);

d3.json("pobguy.json", function(error, data) {
    console.log(data);

    var lines = {}
    var xd = [9999, -9999];
    var yd = [9999, -9999];

    var all_iys = _.uniq(
        _.map(data, function(d) {
            if (d.x > xd[1]) {
                xd[1] = d.x;
            }
            if (d.x < xd[0]) {
                xd[0] = d.x;
            }

            if (d.y > yd[1]) {
                yd[1] = d.y;
            }
            if (d.y < xd[0]) {
                yd[0] = d.y;
            }

            return parseInt(d.iy);
        })
    );

    var all_ixs = _.uniq(
        _.map(data, function(d) {
            return d.ix;
        })
    );

    console.log('all_iys', all_iys);
    console.log('min', _.min(all_iys));
    console.log('min', _.max(all_iys));
    console.log('ynav dom', [_.min(all_iys), _.max(all_iys)]);

    ynavboxes.domain(all_iys);
    x.domain(xd);
    ynav.domain(yd);

    var make_line = function(iy) {
        var t = [];
        _.forEach(data, function (d) {
            if (d.iy === iy) {
                var x = d.x;
                t.push({'x': d.x, 'y': d.v});
            }
        });


        return svg.append('path')
            .attr('d', line(t))
            .attr("stroke", function () {
                return 'black';
            })
            .attr("stroke-width", 2)
            .style('opacity', 0.1)
            .attr("fill", "none")
        ;

    }

    var make_lines = function() {
        _.forEach(all_iys, function(iy) {
            lines[iy] = make_line(iy);
        })
    };

    svg.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0,' + height + ')')
        .call(xaxis)
        .append("text")
        .style("text-anchor", "middle")
        .text('Carry [ft]')
        .attr('x', 20)
        .attr('y', 20)
    ;

    svg.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0,' + 0 + ')')
        .call(yaxis)
        .append("text")
        .style("text-anchor", "middle")
        .text('Batting Avg.')
        .attr('x', -50)
        .attr('y', 20)
        .attr('transform', 'rotate(-90)')
    ;

    svg.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(' + -100 + ',' + 0 + ')')
        .call(ynavaxis)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", -50)
        .text('Hang Time [s]')
    ;

    var rect_mouse_in = function(d) {
        console.log('mouse in', d);

        lines[d]
            .attr('stroke-width', 15)
            .attr('opacity', 1)
        ;

        lines[d+1]
            .attr('stroke-width', 15)
            .attr('opacity', 1)
            .attr('stroke', 'blue')
        ;

        lines[d-1]
            .attr('stroke-width', 15)
            .attr('opacity', 1)
            .attr('stroke', 'red')
        ;

    }

    var rect_mouse_out = function(d) {

        lines[d]
            .attr('stroke-width', 2)
            .attr('opacity', 0.1)
            .attr('stroke', 'black')
        ;

        lines[d+1]
            .attr('stroke-width', 2)
            .attr('opacity', 0.1)
            .attr('stroke', 'black')
        ;

        lines[d-1]
            .attr('stroke-width', 2)
            .attr('opacity', 0.1)
            .attr('stroke', 'black')
        ;

    }

    var make_nav = function () {
        var dy = height/all_iys.length;
        _.forEach(all_iys, function(iy) {
            svg.append('rect')
                .attr('width', 40)
                .attr('height', dy)
                .attr('x', -97)
                .attr('y', function() {
                    console.log('iy', iy, ynavboxes(iy));
                    return ynavboxes(iy);
                })
                .attr('id', 'rect-' + iy.toString())
                .attr('fill', 'black')
                .attr('opacity', 0.3)
                .on('mouseover', function() {
                    rect_mouse_in(iy);
                })
                .on('mouseout', function() {
                    rect_mouse_out(iy);
                })
            ;
        });
    };

    make_lines();
    make_nav();

});
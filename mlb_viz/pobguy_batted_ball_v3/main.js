/**
 * Created by bdilday on 2/11/16.
 */

    var resting_opacity = 0.05;
    var batted_ball_duration = 400;
var feetPerPixel = 2;
var nav_square_sz = 5;
var nav_square_buffer = 0;

var field_scale = d3.scale.linear()
        .range([0, 127*feetPerPixel])
        .domain([0, 127])
    ;

var margin = {top: 100, right: 10, bottom: 100, left: 300},
    width = 1400 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

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

var nav_width = 300;
var nav_height = 300;

var ynav = d3.scale.linear()
    .rangeRound([nav_height, 0])
;

var ynavboxes = d3.scale.ordinal()
        .rangeRoundBands([nav_height, 0])
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

// daytime,ExitSpeed,VExitAngle,HExitAngle,Carry,Bearing,HangTime,rho,hand,outcome,slg,LW,
var number_of_bins = {'VExitAngle': 20, 'HangTime': 20, 'ExitSpeed': 20};
var hs = _.mapValues(number_of_bins, function(v, k) {
    return d3.scale.linear()
        .range([0, v+1])
    ;
});


d3.csv("batted-balls-2009.csv", function(error, data) {

    var angleToRadian = Math.PI/180.0;
    console.log(angleToRadian);
    _.forEach(data, function(d) {
        d.HExitAngleInRadians = parseFloat(d.HExitAngle)*angleToRadian;
        d.BearingInRadians = parseFloat(d.Bearing)*angleToRadian;
        d.Carry = parseFloat(d.Carry);
    });
    console.log(data);

    var domains = {};
    var arrs = {};
    _.forIn(number_of_bins, function(v, k) {
        arrs[k] = [];
        _.forEach(data, function(d) {
            arrs[k].push(parseFloat(d[k]));
        });
    });
    console.log('arrs', arrs);



    _.forIn(number_of_bins, function(v, k) {
        domains[k] = d3.extent(arrs[k]);
        hs[k].domain(domains[k]);
    })
    console.log('domains', domains);

    var make_base = function(idx, g) {

        var xlocs_feet = [127/2, 127, 127/2, 0];
        var ylocs_feet = [127, 127/2, 0, 127/2];

        console.log(xlocs_feet[idx], ylocs_feet[idx], field_scale(xlocs_feet[idx]), field_scale(ylocs_feet[idx]));

        var base_sz = 8*feetPerPixel;
        g.append('rect')
            .attr('class', 'base')
            .attr('id', 'base'+ idx.toString())
            .attr('x', field_scale(xlocs_feet[idx]))
            .attr('y', field_scale(ylocs_feet[idx]))
            .attr('height', base_sz)
            .attr('width', base_sz)
            .attr('transform', function() {
                var sx = (field_scale(xlocs_feet[idx]) + 0.5*base_sz).toString();
                var sy = (field_scale(ylocs_feet[idx]) + 0.5*base_sz).toString();
                return 'rotate(45 ' + sx + ' ' + sy + ')';
            })
        ;
    };

    var make_bases = function() {
        var sx = 200;
        var sy = 450;
        var field = svg.append('g')
            .attr('id', 'field')
            .attr('transform', 'translate(' + sx + ',' + sy + ')')
        ;
        _.forEach([0, 1, 2, 3], function(idx) {
            make_base(idx, field);
        });

        return field;
    };

    var field = make_bases();


    var datumToSelector = function(d, keys, vals) {
        var s = '';
        _.forEach(_.range(keys.length), function(i) {
            s += '.' + keys[i] + '-' + vals[i];
        })
        console.log('d2s', s);
        return s;
    };

    var ball_mouseover = function(d) {
        var keys = ['HangTime', 'ExitSpeed'];
        var vals = _.map(keys, function(k) {
            console.log(k, d, d[k], hs[k](+d[k]));
            return parseInt(hs[k](parseFloat(d[k])));
        });

        var s = '.navrect' + datumToSelector(d, keys, vals);

        console.log('navrect select', s, keys, vals);
        d3.selectAll(s)
            .transition()
            .duration(batted_ball_duration)
            .style('fill', 'steelblue')
            .style('opacity', 1)
        ;

    };

    var ball_mouseout = function(d) {
        var keys = ['HangTime', 'ExitSpeed'];
        var vals = _.map(keys, function(k) {
            console.log(k, d, d[k], hs[k](+d[k]));
            return parseInt(hs[k](parseFloat(d[k])));
        });

        var s = '.navrect' + datumToSelector(d, keys, vals);
        d3.selectAll(s)
            .transition()
            .duration(batted_ball_duration)
            .style('fill', 'white')
            .style('opacity', 0.2)
        ;

    };

    var make_batted_balls = function(g) {
        var batted_balls = g.append('g')
            .attr('transform', function() {
                var sx = field_scale(127/2);
                var sy = field_scale(127);
                return 'translate(' + sx + ',' + sy + ')';
            })
            .attr('id', 'battedballs');

        batted_balls.selectAll('.battedball')
            .data(data)
            .enter()
            .append('circle')
            .attr('opacity', resting_opacity)
            .attr('cx', function(d, i) {
              //  console.log('x', d, d.Carry*Math.cos(d.HExitAngleInRadians)*feetPerPixel);
                return d.Carry*Math.sin(d.HExitAngleInRadians)*feetPerPixel;
            })
            .attr('cy', function(d, i) {
            //    console.log('y', d, -d.Carry*Math.sin(d.HExitAngleInRadians)*feetPerPixel);
                return -d.Carry*Math.cos(d.HExitAngleInRadians)*feetPerPixel;
            })
            .attr('r', 2)
            .attr('class', function(d, i) {
                //console.log('hist', d, h(d.Carry), parseInt(h(d.Carry)));
                var s = 'battedball ';
                _.forIn(number_of_bins, function(v, k) {
                    s += ' ' + k + '-' + parseInt(hs[k](d[k]));
                });
                return s ;
            })
            .on('mouseover', function(d) {
                ball_mouseover(d);
                $(this).attr('r', 10).attr('opacity', 1);
            })
            .on('mouseout', function(d) {
                ball_mouseout(d);
                $(this).attr('r', 2).attr('opacity', resting_opacity);

            })

        ;
    };


    var nav_rect_mouseover = function(kx, idx_x, ky, idx_y) {
        console.log('nav_rect mouseover!');

        var selector_string = '.battedball';
        selector_string += '.' + kx + '-' + idx_x + '';
        selector_string += '.' + ky + '-' + idx_y + '';

        console.log('selector_string', selector_string);

        d3.selectAll(selector_string)
            .transition()
            .duration(batted_ball_duration)
            .attr('r', 10)
            .style('opacity', 1)
            .style('fill', function(d) {
                console.log(d);
                return d.slg > 0 ? 'steelblue' : 'red';
            })
            ;

        selector_string = '.battedball';
        selector_string += '.' + kx + '-' + (idx_x-1).toString() + '';
        selector_string += '.' + ky + '-' + (idx_y-1).toString() + '';

        console.log('selector_string', selector_string);

        d3.selectAll(selector_string)
            .transition()
            .duration(batted_ball_duration)
            .attr('r', 6)
            .style('opacity', 0.8)
            .style('fill', function(d) {
                console.log(d);
                return d.slg > 0 ? 'steelblue' : 'red';
            })
        ;

        selector_string = '.battedball';
        selector_string += '.' + kx + '-' + (idx_x+1).toString() + '';
        selector_string += '.' + ky + '-' + (idx_y+1).toString() + '';

        console.log('selector_string', selector_string);

        d3.selectAll(selector_string)
            .transition()
            .duration(batted_ball_duration)
            .attr('r', 6)
            .style('opacity', 0.8)
            .style('fill', function(d) {
                console.log(d);
                return d.slg > 0 ? 'steelblue' : 'red';
            })
        ;

    };

    var nav_rect_mouseout = function(kx, idx_x, ky, idx_y) {
        console.log('nav_rect mouseout!');

        var selector_string = '.battedball';
        selector_string += '.' + kx + '-' + idx_x + '';
        selector_string += '.' + ky + '-' + idx_y + '';

        console.log('selector_string', selector_string);

        d3.selectAll(selector_string)
            .transition()
            .duration(batted_ball_duration)
            .attr('r', 2)
            .style('opacity', 0.2)
            .style('fill', function(d) {
                return 'grey';
            })
        ;

        selector_string = '.battedball';
        selector_string += '.' + kx + '-' + (idx_x-1).toString() + '';
        selector_string += '.' + ky + '-' + (idx_y-1).toString() + '';

        console.log('selector_string', selector_string);

        d3.selectAll(selector_string)
            .transition()
            .duration(batted_ball_duration)
            .attr('r', 2)
            .style('opacity', 0.2)
            .style('fill', function(d) {
                return 'grey';
            })
        ;

        selector_string = '.battedball';
        selector_string += '.' + kx + '-' + (idx_x+1).toString() + '';
        selector_string += '.' + ky + '-' + (idx_y+1).toString() + '';

        console.log('selector_string', selector_string);

        d3.selectAll(selector_string)
            .transition()
            .duration(batted_ball_duration)
            .attr('r', 2)
            .style('opacity', 0.2)
            .style('fill', function(d) {
                return 'grey';
            })
        ;

    };


    var make_nav_square = function(nav_matrix, kx, ky) {

        console.log('make_nav_square');
        var idx_array = [];
        console.log(kx, _.range(number_of_bins[kx]));

        _.forEach(_.range(number_of_bins[kx]), function (idx_x) {
            _.forEach(_.range(number_of_bins[ky]), function(idx_y) {

                nav_matrix.append('rect')
                    .attr('class', function() {
                        var s = 'navrect ';
                        s += kx + '-' + idx_x + ' ';
                        s += ky + '-' + idx_y + ' ' ;
                        return s;
                    })
                    .style('fill', 'white')
                    .style('stroke', 'black')
                    .attr('width', nav_square_sz)
                    .attr('height', nav_square_sz)
                    .attr('x', function() {
                        return idx_x * (nav_square_sz + nav_square_buffer);
                    })
                    .attr('y', function() {
                        return idx_y * (nav_square_sz + nav_square_buffer);
                    })
                    .attr('opacity', 0.2)
                    .on('mouseover', function() {
                        console.log('nav_square', kx, idx_x, ky, idx_y);
                        nav_rect_mouseover(kx, idx_x, ky, idx_y);
                        $(this).attr('fill', 'steelblue').attr('opacity', 1);
                    })
                    .on('mouseout', function() {
                        nav_rect_mouseout(kx, idx_x, ky, idx_y);
                        $(this).attr('fill', 'white').attr('opacity', 0.2);
                    })
                ;

                nav_matrix.append('g')
                    .attr('transform', 'translate(25, -5)')
                    .append('text')
                    .attr('class', 'nav_label nav-label-y')
                    .attr('font-size', 10)
                    .attr('text-anchor', 'middle')
                    .text(kx);

                nav_matrix.append('g')
                    .attr('transform', 'translate(-5, 25) rotate(-90)')
                    .append('text')
                    .attr('class', 'nav_label nav-label-y')
                    .attr('font-size', 10)
                    .attr('text-anchor', 'middle')
                    .text(ky);


            });
        });


    };

    var make_nav_matrix = function(sx, sy) {

        var nav_matrix = svg.append('g')
            .attr('transform', 'translate(' + sx +',' + sy + ')');
        return nav_matrix;


    }

    make_batted_balls(field);


    var nv = {};
    var nav_x_initial = 900;
    var nav_y_initial = 20;

    var ks = [];
    _.forIn(number_of_bins, function(v, k) {
        ks.push(k);
    });

    var kx
    var ky;

    for (var i=0; i<ks.length; i++ ){
        for (var j=i+1; j<ks.length; j++) {
            kx = ks[i];
            ky = ks[j];
            var k = kx + '_' + ky;
            var dx = i*(nav_square_sz+nav_square_buffer)*number_of_bins[kx];
            var dy = j*(nav_square_sz+nav_square_buffer)*number_of_bins[ky];

            nv[k] = make_nav_matrix(nav_x_initial + dx, nav_y_initial + dy);
            make_nav_square(nv[k], kx, ky);

        }
    }

});
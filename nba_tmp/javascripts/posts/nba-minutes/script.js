

color = d3.scale.threshold()
    .domain([-12, -6, 0, 1, 7, 13])
    .range(["#b35806","#f1a340","#fee0b6","rgba(255,255,255,1)","#d8daeb","#998ec3","#542788"].reverse())

var graph = d3.select('#graph')
    .append('div')
    .style({'margin-bottom': '30px', 'margin-top': '-30px'})
    ;

var svg = graph.append('svg')
    .attr('width', 1000)
    .attr('height', 800)
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + 25 + ')');

var bar_scale_x = d3.scale.ordinal()
    .rangeRoundBands([0, 300], 0.5);
;

var bar_y_max = 500
var bar_scale_y = d3.scale.linear()
        .range([0, bar_y_max])
    ;

var max_dif = 40;
var all_teams = [];
var overall_record = [];

d3.json('/javascripts/posts/nba-minutes/updated_data.json', function(data) {

    var total = data.total;
    var tmp = [];

    console.log('total', total['48,0']);
    _.forIn(total['48,0'] ,function (v, k) {
       if ( k != 'all') {
           console.log('all_', k, v)
           all_teams.push({team: k, w: v.w, l: v.l});
           tmp.push(k);
       } else {
           //all_teams.push({team: k, w: v.w, l: v.l});

       }
    });

    bar_scale_x
        .domain(tmp);

    bar_scale_y.domain([0, 40]);
    console.log('all_teams', all_teams);

    total_array = [];
    _.forIn(total, function(value, key) {
        total_array.push({key: key, value: value});
    })


    console.log('total', total);
    console.log('total_array', total_array);

    var bar_chart = svg.append('g')
        .attr('transform', 'translate(' + 600 + ' ' + 135 + ')');

    var init_barchart = function(all_teams) {
        var buffer = 25;

        bar_chart.selectAll('.team-bar-win')
            .data(all_teams)
            .enter()
            .append('rect')
            .attr('class', 'team-bar-win')
            .attr('width', 8)
            .attr('height', function(d) {
                return bar_scale_y(d.w);
            })
            .attr('x', function(d) {
                return bar_scale_x(d.team);
            })
            .attr('y', function(d) {
                return 200-bar_scale_y(d.w);
            })
            .attr('fill', '#2171b5')
            .style('opacity', 1)
        ;

        bar_chart.selectAll('.team-bar-loss')
            .data(all_teams)
            .enter()
            .append('rect')
            .attr('class', 'team-bar-loss')
            .attr('width', 8)
            .attr('height', function(d) {
                return bar_scale_y(d.l);
            })
            .attr('x', function(d) {
                return bar_scale_x(d.team);
            })
            .attr('y', function(d) {
                return 200 + buffer;
            })
            .attr('fill', '#2171b5')
        ;


        bar_chart.selectAll('.team-bar-label')
            .data(all_teams)
            .enter()
            .append('text')

            .attr('class', 'team-bar-label')

            .text(function(d) {
                console.log('text', d, d.team, bar_scale_x(d.team), 200+buffer);
                return d.team;
            })

            .attr('x', function(d) {
                return bar_scale_x(d.team) + 8;
            })
            .attr('y', function(d) {
                return 200 + 0.5*buffer;
            })
            .attr('fill', '#2171b5')

            .attr('font-size', 8)
            .attr('transform', function(d, i) {
                return 'rotate(' + (-90).toString() + ' ' + (bar_scale_x(d.team)+8).toString() + ' ' + (200 + 0.5*buffer).toString() + ')';
            })
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('font-family', 'sans-serif')
            .attr('text-anchor', 'middle')
            .attr('cursor', 'pointer')
        ;
    }


    var grid = svg.append('g')
        .attr('transform', 'translate(' + -20 + ' ' + 350 + ')');

    var grid_x = d3.scale.linear()
        .range([0, 600])
        .domain([48, 0])
        ;

    var grid_y = d3.scale.linear()
        .range([300, -300])
        .domain([-40, 40])
        ;

    var init_grid = function(all_teams) {

        var all_min = _.range(48);
        var all_dif = _.range(-40, 40);
        var arr = []
        _.forEach(all_min, function(min) {
            _.forEach(all_dif, function(dif) {
                arr.push({min: min, dif: dif});
            })
        });


        var grid_zero_line = d3.svg.line()
            .x(function(d) {
                return grid_x(d.x);
            })
            .y(function(d) {
                return grid_y(d.y);
            })
            ;

        var grid_rect_sz = 8;
        grid.selectAll('.team-mindif')
            .data(arr)
            .enter()
            .append('rect')
            .attr('class', 'team-mindif')
            .attr('width', grid_rect_sz+4)
            .attr('height', function(d) {
                return grid_rect_sz;
            })
            .attr('x', function(d) {
                return grid_x(d.min);
            })
            .attr('y', function(d) {
                return grid_y(d.dif);
            })
            .attr('id', function(d) {
                return d.min.toString() + ',' + d.dif.toString();
            })
            .attr('fill', '#2171b5')
            .attr('stroke', 'black')
            .attr('stroke-opacity', 0.1)
            .attr('fill-opacity', 0)
            .on('mouseover', function(d) {
                update_bar_chart(d);
            })
            .on('mouseout', function(d) {
                update_bar_chart({'min': 48, 'dif': 0});
            })

        ;

        var grid_zero_data = [{x: 49, y: 0},{x: -2, y:0}];

        grid.append('path')
            .attr('d', grid_zero_line(grid_zero_data))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
        ;
    }

    var bar_label = bar_chart.append('text')
        .text('blah')
            .attr('x', -40)
            .attr('y', -80)
    ;

    var update_bar_chart = function(datum) {
        console.log('datum', datum);
        var k = datum.min.toString() + ',' + datum.dif.toString();

        var dur = 500;
        bar_label.text(k);

        bar_chart.selectAll('.team-bar-win')
            .transition()
            .duration(dur)
            .attr('height', function(d) {
                var w = total[k].hasOwnProperty([d.team]) ? total[k][d.team].w : 0;
                return bar_scale_y(w);
            })
            .attr('y', function(d) {
                var w = total[k].hasOwnProperty([d.team]) ? total[k][d.team].w : 0;
                return 200-bar_scale_y(w);
            })
            .style('opacity', 1)
        ;

        bar_chart.selectAll('.team-bar-loss')
            .transition()
            .duration(dur)
            .attr('height', function(d) {
                var w = total[k].hasOwnProperty([d.team]) ? total[k][d.team].l : 0;
                return bar_scale_y(w);
            })
            .attr('y', function(d) {
                var w = total[k].hasOwnProperty([d.team]) ? total[k][d.team].l : 0;
                return 200+buffer;
            })
            .style('opacity', 1)
        ;

    }


    init_barchart(all_teams);
    init_grid(all_teams);

})

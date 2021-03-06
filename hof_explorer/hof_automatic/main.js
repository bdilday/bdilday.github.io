/**
 * Created by bdilday on 12/29/15.
 */

//    var $ = require('jquery');

    var shade_of_orange = '#f16913';
var margin = {
    top: 40, right:10, left:10, bottom: 0
};
var height = 1700;
var width = 1400;

var selected_player = '';

var player_label = d3.select('body')
        .append('div')
        .attr('id', 'player-label')
        .attr('class', 'player-label-class')
        .text('---')
;

var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    ;

var x = d3.scale.linear()
        .range([0,width])
    ;
var y = d3.scale.linear()
    .range([0, height])
;

var line = d3.svg.line()
        .interpolate('linear')
        .x(function(d) {
            return x(+d.idx+0.4);
        })
        .y(function(d) {
            return y(d.rank);
        })
    ;

/*******************************/
d3.csv('hof_automatic_150.csv', function(data) {

//console.log('data', data);

    var xmin = 1;
    var ymin = 1;
    var xmax = _.max(_.map(data, function(d) {
        return parseInt(d.idx);
    }));
    var ymax = _.max(_.map(data, function(d) {
        return parseInt(d.rank);
    }));

  //  console.log('max', xmax, ymax);

    x.domain([xmin, xmax]);
    y.domain([ymin, ymax]);

    var byPlayer = d3.nest()
        .key(function(d) {
            return d.player;
        })
        .entries(data)
        ;

    //console.log('byPlayer', byPlayer);

    var player_lines = {};
    var do_line = function(player_data) {
        //console.log('pl data', player_data);

        var k = player_data.key.replace(/\s+/g, '');
        player_lines[k] =
            svg.append('path')
            .attr('class', function() {
                return 'pl-line pl-line-' + k; // +
            })
            .attr('id', function() {
                return 'pl-line-' + k; // +
            })
            .attr('d', line(player_data.values)
        )
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
        ;
    };

    byPlayer.forEach(function(d) {
        do_line(d);
    })

    var mouseover = function(d) {
        //console.log('mouseover', d, '.pl-line-' + d.player);

        var k = d.player.replace(/\s+/g, '');

        player_lines[k]
            .transition()
            .duration(200)
            .attr('stroke-width', function () {
                 return 5;
            })
            .attr('stroke', shade_of_orange)
        ;

        var sel = d3.selectAll('rect.rect-'+ d.player);
        //console.log('sel', sel);
        d3.selectAll('rect.rect-'+ k)
            .attr('fill', function(d) {
                return shade_of_orange;
            })
        ;
        player_label.text(d.player);

    };

    var mouseout = function (d) {
        //console.log('mouseout', d);
        var k = d.player.replace(/\s+/g, '');

        if ( k !== selected_player) {
            player_lines[k]
                .transition()
                .duration(200)
                .attr('stroke-width', function () {
                    return 1;
                })
                .attr('stroke', 'black')
            ;

            d3.selectAll('rect.rect-' + k)
                .attr('fill', function (d) {
                    return +d.rank <= 5 * d.idx ? '#0570b0' : '#9ecae1';
                })
            ;
        }

        player_label.text('---');

    };

    var handle_click = function(d) {

        var k = d.player.replace(/\s+/g, '');
        var oldk = '';
        if (selected_player === k) {
            oldk = selected_player;
            selected_player = '';
        } else {
            oldk = selected_player;
            selected_player = k;
        }

        console.log('click', d, oldk, selected_player);

        mouseover({player: selected_player});
        mouseout({player: oldk});


    };

    svg.selectAll('.player-box')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d) {
            return 'translate('  + x(d.idx) + ',' + y(d.rank) + ')';
        })
        .append('rect')
        .attr('class', function(d) {
          return 'rect-' + d.player.replace(/\s+/g,'');
        })
        .attr('width', 40)
        .attr('height', 10)
        .attr('fill', function(d) {
            return +d.rank <= 5*d.idx ? '#0570b0' : '#9ecae1';
        })
        .attr('opacity', 1)
        .attr('cursor', 'pointer')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', handle_click)
    ;

    svg.selectAll('.player-text')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d) {
            return 'translate('  + x(d.idx) + ',' + y(d.rank) + ')';
        })
        .append('text')

        .attr('class', 'textu')
        .text(function(d) {
            //console.log(d);
            return d.player; // + ' ' + d.war;
        })
        .attr('font-size', 5)
        .attr('stroke', '#fff5f0')
        .attr('stroke-width', 0.5)
        .attr('y', 7)
        .attr('x', 2)
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 100)
        .attr('text-anchor', 'left')
        .attr('cursor', 'pointer')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', handle_click)
    ;


});
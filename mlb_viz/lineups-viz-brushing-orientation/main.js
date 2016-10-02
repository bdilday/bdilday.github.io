


var bar_color = '#045a8d';
var bright_orange = '#fd8d3c';

var margin = {top: 60, right: 80, bottom: 20, left: 100};

var cell_width = 60;
var cell_height = 50;
var cell_rows = 10;
var cell_columns = 10;
var cell_vertical_buffer = 0;
var cell_horizontal_buffer = 0;

var brush_xoff = 625;
var brush_yoff = 0;

var brush_height = 600;
var brush_width = 50;

var year_label_xoff = 550;
var year_label_yoff = 200;

var year_label_xoff_f1 = 685;
var year_label_xoff_f2 = 685;

var year_label_yoff_f1 = 10;
var year_label_yoff_f2 = 505;

var MIN_YEAR = 1913;
var MAX_YEAR = 2014;


var width = cell_columns*cell_width - margin.left - margin.right;

var width = 1200;
var height = cell_rows*cell_height - margin.top - margin.bottom;

var beta_scale = d3.scale.linear()
    .range([MIN_YEAR, MAX_YEAR])
    .domain([-50, 50]);

var diff_yscale = d3.scale.linear()
        .range([-cell_height/2, +cell_height/2])
        .domain([-0.2,0.2])
    ;

var cell_yscale = d3.scale.linear()
        .range([0, cell_height])
        .domain([0,0.5])
    ;

var cell_xscale = d3.scale.ordinal()
    .rangeRoundBands([0, cell_width], 0.1)
    .domain(_.range(1, 9+1));

var cell_xaxis = d3.svg.axis()
    .orient("bottom")
    .scale(cell_xscale);

var cell_yaxis = d3.svg.axis()
    .orient("left")
    .scale(cell_yscale);

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom + 100)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;


var position_string = {
    1: 'P',
    2: 'C',
    3: '1B',
    4: '2B',
    5: '3B',
    6: 'SS',
    7: 'LF',
    8: 'CF',
    9: 'RF',
    10: 'DH'
};


var data_delta;

d3.json('lineups.json', function(data) {

//    console.log('data', data);

    var era_list = ['all', '1913-1919',
        '1920-1940', '1946-1967',
        '1973-1992', '1993-2002', '2006-2014'];



    function make_brush() {

        var brush_cell_height = parseInt(brush_height/(MAX_YEAR - MIN_YEAR + 1));
        _.forEach(_.range(MIN_YEAR, MAX_YEAR), function(year, year_counter) {
            var child_svg = svg.append('g')
                .attr('transform', function() {
                    var s = 'translate(' ;
                    s += brush_xoff;
                    s += ',';
                    s += brush_yoff;
                    s += ')';
                    return s
                })
                .attr('class', 'brusher');

            child_svg.append('rect')
                .attr('height', brush_cell_height)
                .attr('width', brush_width)
                .attr('fill', bar_color)
                .style('opacity', 0.5)
                .attr('stroke-width', 1)
                .attr('stroke', 'black')
                .attr('cursor', 'pointer')
                .attr('x', 0)
                .attr('y', function() {
                    return year_counter * brush_cell_height;
                })
                .on('mouseover', function() {
                    update_row(year);
                    d3.select(this).attr('fill', bright_orange);
                })
                .on('mouseout', function() {
                    d3.select(this).attr('fill', bar_color);
                })
            ;
        });
    }


    function make_row(data, idx_y, doup, bc, yscale) {

        var bc = bc || bar_color;
        var yscale = yscale || cell_yscale;
        var this_data = {};
        _.forEach(_.range(1, 10+1), function(position_idx) {
            this_data[position_idx] = [];
        });

        _.forEach(data, function(d) {
            var position_idx = d.position_idx;
            this_data[position_idx].push(d);
        });

        _.forEach(_.range(1, 10+1), function(position_idx) {
            //  console.log(yr, position_idx, this_data[position_idx]);
            var obj = {
                data: this_data[position_idx],
                position_idx: position_idx,
                idx_y: idx_y,
                bc: bc,
                yscale: yscale
            };
            if (doup) {
                update_cell(obj);
            } else {
                make_cell(obj)
            }
        })

    }

    function update_cell(obj) {

        var data = obj.data;
        var idx_y = obj.idx_y;

        var yscale = obj.yscale || cell_yscale;
        var c = -yscale(0) + yscale(yscale.domain()[1]);
        var k = 'rect-' + idx_y.toString() + '-' + obj.position_idx.toString();

        svg.selectAll('.' + k)
            .data(data)
            .transition()
            .duration(10)
            .attr('height', function(d) {
                //console.log(d, cell_yscale(d.value));
                var v = yscale(d.value);
                // scale goes to 0.5, but a few values are >0.5.
                // clamp these at 0.5
                if (v<0) {
                    v = -v;
                }

                if (v>c) {
                    v = c;
                }
                return v;
            })
            .attr('y', function(d) {
                var v = yscale(d.value);
                // scale goes to 0.5, but a few values are >0.5.
                // clamp these at 0.5
                if (v>c) {
                    v = c;
                }
                if (v<0) {
                    v = 0;
                }

                return c - v ;

            })
            ;
    }

    function make_cell(obj) {

        var data = obj.data;
        var idx_x = obj.position_idx-1;
        var idx_y = obj.idx_y;

        var yscale = obj.yscale || cell_yscale;

        var bc = obj.bc || bar_color;

        var c = -yscale(0) + yscale(yscale.domain()[1]);

        var child_svg = svg.append('g')
            .attr('transform', function() {

                var dx = (cell_width + cell_horizontal_buffer)*idx_x;
                var dy = (cell_height + cell_vertical_buffer)*idx_y;

                var s = 'translate (';
                s += dx.toString();
                s += ',';
                s += dy.toString();
                s += ')';
                return s;
            });

        var k = 'rect-' + idx_y.toString() + '-' + obj.position_idx.toString();

        var e = child_svg.selectAll('.' + k)
            .data([]);

        //e.exit().remove();
        //e = child_svg.selectAll('.' + k)
        //    .data(data);

        var rect_width = cell_xscale(2) - cell_xscale(1);
        child_svg.selectAll('.' + k)
        .data(data)
            .enter().append('rect')
            .attr('class', k)
            .attr('width', rect_width)
            .attr('height', function(d) {
                //console.log(d, cell_yscale(d.value));
                var v = yscale(d.value);
                // scale goes to 0.5, but a few values are >0.5.
                // clamp these at 0.5
                if (v<0) {
                    v = -v;
                }
                if (v>c) {
                    v = c;
                }
                return v;
            })
            .attr('x', function(d) {
                return cell_xscale(d.lineup_idx);
            })
            .attr('y', function(d) {
                var v = yscale(d.value);
                // scale goes to 0.5, but a few values are >0.5.
                // clamp these at 0.5
                if (v>c) {
                    v = c;
                }
                if (v<0) {
                    v = 0;
                }
                return c - v ;
            })
            .attr('fill', bc)
            .style('opacity', 0.5)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('cursor', 'pointer')
            .on('mouseover', function() {
                //set_game_text(d);
            });

        child_svg.append('rect')
            .attr('width', cell_width)
            .attr('height', cell_height)
            .style('fill', 'none')
            .style('stroke', '#332222')
        ;

        if (obj.position_idx === 1) {
            child_svg.append('text')
                .text(obj.label)
                .style('font-size', 10)
                .attr('text-anchor', 'middle')
                .attr('transform', function () {
                    var dx = -10;
                    var dy = parseInt(0.5 * cell_height);
                    var s = 'translate(' + dx + ',' + dy + ')';
                    s += ' rotate(-90, -10, ' + dy + ')' ;

                    return 'rotate(-90, -5, ' + dy + ')';
                })
                .attr('x', -5)
                .attr('y', parseInt(.5*cell_height))
            ;
        }

        if (idx_y === 0) {
            child_svg.append('text')
                .attr('x', parseInt(0.5* cell_width))
                .attr('y', -4)
                .attr('text-anchor', 'middle')
                .text(position_string[obj.position_idx])
                .style('font-size', 10)
        }
    }

    function update_row(year) {
        //console.log('mouseover!', year);
        make_row(data[year], 1, true);
        make_row(data_delta[year], 2, true, 'red', diff_yscale);
        update_year_label(year);
    }


    var lookup_table = {};
    data['all'].forEach(function(d) {
        var k = d.position_idx.toString() + '-' + d.lineup_idx.toString();
        lookup_table[k] = d.value;
    })

    data_delta = {};
    _.forEach(_.range(MIN_YEAR, MAX_YEAR), function(year) {
        data_delta[year] = [];
        _.forEach(data[year], function(d) {
            var k = d.position_idx.toString() + '-' + d.lineup_idx.toString();
            var tmp = {lineup_idx: d.lineup_idx, position_idx: d.position_idx, value: d.value-lookup_table[k]};
            data_delta[year].push(tmp);
        })
    });

    function update_year_label(year) {
        svg.select('.year-label')
            .text(year);
    }

    function make_year_label() {
        svg.append('text')
            .attr('x', year_label_xoff)
            .attr('y', year_label_yoff)
            .style('font-size', 20)
            .text('1913')
            .attr('class', 'year-label')
        ;
    }

    function make_year_fixed_labels() {

        svg.append('text')
            .attr('x', year_label_xoff_f1)
            .attr('y', year_label_yoff_f1)
            .style('font-size', 14)
            .text('1913')
        ;

        svg.append('text')
            .attr('x', year_label_xoff_f2)
            .attr('y', year_label_yoff_f2)
            .style('font-size', 14)
            .text('2014')
        ;
    }

    function make_orientation_labels() {

        svg.append('text')
            .attr('x', 100)
            .attr('y', 200)
            .style('font-size', 14)
            .text('alpha')
            .attr('class', 'alpha-label')
        ;

        svg.append('text')
            .attr('x', 100)
            .attr('y', 250)
            .style('font-size', 14)
            .text('beta')
            .attr('class', 'beta-label')
        ;

        svg.append('text')
            .attr('x', 140)
            .attr('y', 300)
            .style('font-size', 14)
            .text('gamma')
            .attr('class', 'gamma-label')
        ;
    }

    make_orientation_labels();

    make_year_label();
    make_year_fixed_labels();
    make_row(data['all'], 0, false);
    make_row(data[1913], 1, false);
    make_row(data_delta[1913], 2, false, 'red', diff_yscale);

    make_brush();

    function handleOrientation(event) {
        var alpha = event.alpha;
        var beta = event.beta;  // In degree in the range [-180,180]
        var gamma = event.gamma; // In degree in the range [-90,90]

        if (typeof beta === typeof undefined || beta === null) {
            return ;
        }

        var sign = z > 0  ? +1 : -1;
        var absval = Math.abs(z);

        if (absval > 50) {
            absval = 50;
        }

        var argval = sign * (90 - absval);
        var this_year = parseInt(beta_scale(argval));
        update_row(this_year);
        d3.select('.alpha-label').text('ALPHA: ' + parseInt(alpha));
        d3.select('.beta-label').text('BETA: ' + parseInt(beta));
        d3.select('.gamma-label').text('GAMMA: ' + parseInt(gamma));
    }


    window.addEventListener('deviceorientation', handleOrientation);
    //window.addEventListener('devicemotion', handleOrientation);

});
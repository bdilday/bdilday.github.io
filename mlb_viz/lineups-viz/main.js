

var bar_color = '#045a8d';
var margin = {top: 60, right: 80, bottom: 20, left: 100};

var cell_width = 60;
var cell_height = 50;
var cell_rows = 104;
var cell_columns = 10;
var cell_vertical_buffer = 0;
var cell_horizontal_buffer = 0;

var width = cell_columns*cell_width - margin.left - margin.right;
var height = cell_rows*cell_height - margin.top - margin.bottom;

var cell_yscale = d3.scale.linear()
        .range([cell_height, 0])
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


var MIN_YEAR = 1913;
d3.json('lineups.json', function(data) {

    console.log('data', data);

    _.forOwn(data, function(v, k) {
        if (k !== 'all' && parseInt(k)<MIN_YEAR) {
            MIN_YEAR = parseInt(k);
        }
    });


    function make_cell(obj) {
        var data = obj.data;
        var year = obj.year;
        var idx_x = obj.position_idx-1;

        var idx_y;
        if (year !== 'all') {
            idx_y = obj.year - MIN_YEAR + 1;
        } else {
            idx_y = 0;
        }

        var child_svg = svg.append('g')
            .attr('transform', function() {

                var dx = (cell_width + cell_horizontal_buffer)*idx_x;
                var dy = (cell_height + cell_vertical_buffer)*idx_y;

                //var tmp = dx;
                //dx = dy;
                //dy = tmp;

                var s = 'translate (';
                s += dx.toString();
                s += ',';
                s += dy.toString();
                s += ')';
                return s;
            });

        var k = 'rect-' + obj.year.toString() + '-' + obj.position_idx.toString();

        var e = child_svg.selectAll('.' + k)
            .data(data)
            .enter();

        var rect_width = cell_xscale(2) - cell_xscale(1);
        e.append('rect')
            .attr('class', k)
            .attr('width', rect_width)
            .attr('height', function(d) {
                //console.log(d, cell_yscale(d.value));
                var v = cell_yscale(d.value);
                // scale goes to 0.5, but a few values are >0.5.
                // clamp these at 0.5
                if (v<0) {
                    v = 0;
                }
                return cell_height - v;
            })
            .attr('x', function(d) {
                return cell_xscale(d.lineup_idx);
            })
            .attr('y', function(d) {
                var v = cell_yscale(d.value);
                // scale goes to 0.5, but a few values are >0.5.
                // clamp these at 0.5
                if (v<0) {
                    v = 0;
                }
                return v;
            })
            .attr('fill', bar_color)
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
                .text(obj.year)
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

        if (obj.year === 'all') {
            child_svg.append('text')
                .attr('x', parseInt(0.5* cell_width))
                .attr('y', -4)
                .attr('text-anchor', 'middle')
                .text(position_string[obj.position_idx])
                .style('font-size', 10)
        }
    }

    function update_cell() {
        ;
    }

    yr = 'all';
    var this_data = {};
    _.forEach(_.range(1, 10+1), function(position_idx) {
        this_data[position_idx] = [];
    });

    _.forEach(data[yr], function(d) {
        var position_idx = d.position_idx;
        this_data[position_idx].push(d);
    });

    _.forEach(_.range(1, 10+1), function(position_idx) {
        //console.log(yr, position_idx, this_data[position_idx]);
        var obj = {year: yr, data: this_data[position_idx], position_idx: position_idx};
        make_cell(obj);
    });

    var yr1 = 1913;
    var yr2 = 2015;
    _.forEach(_.range(yr1, yr2), function(yr) {
        this_data = {};
        _.forEach(_.range(1, 10+1), function(position_idx) {
            this_data[position_idx] = [];
        });

        _.forEach(data[yr], function(d) {
            var position_idx = d.position_idx;
            this_data[position_idx].push(d);
        });

        _.forEach(_.range(1, 10+1), function(position_idx) {
          //  console.log(yr, position_idx, this_data[position_idx]);
            var obj = {year: yr, data: this_data[position_idx], position_idx: position_idx};
            make_cell(obj);
        })
    });

});
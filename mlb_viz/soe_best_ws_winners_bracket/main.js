/**
 * Created by bdilday on 9/18/16.
 */

var bright_orange = '#fd8d3c';

var custom_list = [{'teamid': 'NYA', 'yearid': 1961}];
var listx = -40;
var listy = -0;
var list_dy = 40;
var list_font = 10;

var position_label_fontsize = 11;

var main_title_x = 90;
var main_title_y = -30;

var stats_table_xoff = 1000;
var stats_table_yoff = 425;
var boxplot_xoff = 535;
var boxplot_yoff = 230;

var ra_rs_xoff = 600;
var ra_rs_yoff = 0;

var war_scatter_xoff = 600;
var war_scatter_yoff = 425;

var ra_rs_circle_r_highlight_on = 10;
var ra_rs_circle_r_highlight_off = 2;
var ra_rs_circle_duration = 500;

var war_scatter_font_size = 10;

var position_labels = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];


var seed_list = [
    {idx: 1, teamid: 'NYA', yearid: 1998, w: 114},
    {idx: 2, teamid: 'NYA', yearid: 1961, w: 109},
    {idx: 3, teamid: 'BAL', yearid: 1970, w: 108},
    {idx: 4, teamid: 'CIN', yearid: 1975, w: 108},
    {idx: 5, teamid: 'NYN', yearid: 1986, w: 108},
    {idx: 6, teamid: 'NYA', yearid: 1953, w: 99},
    {idx: 7, teamid: 'DET', yearid: 1984, w: 104},
    {idx: 8, teamid: 'BRO', yearid: 1955, w: 98},
    {idx: 9, teamid: 'NYA', yearid: 1950, w: 98},
    {idx: 10, teamid: 'NYA', yearid: 1951, w: 98},
    {idx: 11, teamid: 'NYA', yearid: 2009, w: 103},
    {idx: 12, teamid: 'DET', yearid: 1968, w: 103},
    {idx: 13, teamid: 'NY1', yearid: 1954, w: 97},
    {idx: 14, teamid: 'NYA', yearid: 1949, w: 97},
    {idx: 15, teamid: 'NYA', yearid: 1956, w: 97},
    {idx: 16, teamid: 'NYA', yearid: 1947, w: 97},
    {idx: 17, teamid: 'CIN', yearid: 1976, w: 102},
    {idx: 18, teamid: 'CLE', yearid: 1948, w: 97},
    {idx: 19, teamid: 'SLN', yearid: 1967, w: 101},
    {idx: 20, teamid: 'NYN', yearid: 1969, w: 100},
    {idx: 21, teamid: 'NYA', yearid: 1977, w: 100},
    {idx: 22, teamid: 'NYA', yearid: 1978, w: 100},
    {idx: 23, teamid: 'NYA', yearid: 1952, w: 95},
    {idx: 24, teamid: 'ATL', yearid: 1995, w: 90},
    {idx: 25, teamid: 'PIT', yearid: 1960, w: 95},
    {idx: 26, teamid: 'CHA', yearid: 2005, w: 99},
    {idx: 27, teamid: 'OAK', yearid: 1989, w: 99},
    {idx: 28, teamid: 'LAN', yearid: 1963, w: 99},
    {idx: 29, teamid: 'ANA', yearid: 2002, w: 99},
    {idx: 30, teamid: 'ML1', yearid: 1957, w: 95},
    {idx: 31, teamid: 'NYA', yearid: 1999, w: 98},
    {idx: 32, teamid: 'BAL', yearid: 1983, w: 98},
    {idx: 33, teamid: 'PIT', yearid: 1979, w: 98},
    {idx: 34, teamid: 'BOS', yearid: 2004, w: 98},
    {idx: 35, teamid: 'OAK', yearid: 1972, w: 93},
    {idx: 36, teamid: 'BAL', yearid: 1966, w: 97},
    {idx: 37, teamid: 'BOS', yearid: 2013, w: 97},
    {idx: 38, teamid: 'PIT', yearid: 1971, w: 97},
    {idx: 39, teamid: 'LAN', yearid: 1965, w: 97},
    {idx: 40, teamid: 'BOS', yearid: 2007, w: 96},
    {idx: 41, teamid: 'TOR', yearid: 1992, w: 96},
    {idx: 42, teamid: 'NYA', yearid: 1962, w: 96},
    {idx: 43, teamid: 'NYA', yearid: 1958, w: 92},
    {idx: 44, teamid: 'KCA', yearid: 2015, w: 95},
    {idx: 45, teamid: 'TOR', yearid: 1993, w: 95},
    {idx: 46, teamid: 'MIN', yearid: 1991, w: 95},
    {idx: 47, teamid: 'LAN', yearid: 1988, w: 94},
    {idx: 48, teamid: 'SFN', yearid: 2012, w: 94},
    {idx: 49, teamid: 'OAK', yearid: 1973, w: 94},
    {idx: 50, teamid: 'LAN', yearid: 1981, w: 63},
    {idx: 51, teamid: 'SLN', yearid: 1964, w: 93},
    {idx: 52, teamid: 'PHI', yearid: 2008, w: 92},
    {idx: 53, teamid: 'SFN', yearid: 2010, w: 92},
    {idx: 54, teamid: 'NYA', yearid: 1996, w: 92},
    {idx: 55, teamid: 'OAK', yearid: 1974, w: 90},
    {idx: 56, teamid: 'ARI', yearid: 2001, w: 92},
    {idx: 57, teamid: 'SLN', yearid: 1982, w: 92},
    {idx: 58, teamid: 'FLO', yearid: 1997, w: 92},
    {idx: 59, teamid: 'LAN', yearid: 1959, w: 88},
    {idx: 60, teamid: 'CIN', yearid: 1990, w: 91},
    {idx: 61, teamid: 'FLO', yearid: 2003, w: 91},
    {idx: 62, teamid: 'MIN', yearid: 1987, w: 85},
    {idx: 63, teamid: 'NYA', yearid: 2000, w: 87},
    {idx: 64, teamid: 'SFN', yearid: 2014, w: 88}

    //{idx: 62, teamid: 'PHI', yearid: 1980, w: 91},
    //{idx: 63, teamid: 'KCA', yearid: 1985, w: 91},
    //{idx: 64, teamid: 'SLN', yearid: 2011, w: 90},
    //{idx: 68, teamid: 'SLN', yearid: 2006, w: 83}
];

var custom_list = seed_list;

var xbuff = 0.1;

var margin = {top: 60, right: 80, bottom: 20, left: 100},
    width = 1500 - margin.left - margin.right,
    height = 1600 - margin.top - margin.bottom;

var whisker_stroke_width = 2;
var cell_height = 140;
var cell_width = 32;
var cell_buffer = 12;

var bracket_width = 56;
var bracket_buffer = 12;
var bracket_y_buffer = 36;

var user_stroke_width = 3;

var BOXPLOT_FILL = '#4292c6';

BOXPLOT_FILL = '#d9d9d9';
BOXPLOT_FILL = '#6baed6';
BOXPLOT_FILL = '#f9f9f9';
var HIGH_SEED = 1;
var LOW_SEED = 0;
var color_map = {};

color_map[HIGH_SEED] = 'steelblue';
//color_map[LOW_SEED] =  '#4d4d4d';
color_map[LOW_SEED] =  bright_orange;

var batting_stat_names = ['h', 'xb', 'hr', 'bavg', 'obp', 'slg'];

var stat_yscales = {};

batting_stat_names.forEach(function(name) {
   stat_yscales[name] = d3.scale.linear()
       .range([cell_height, 0])
       ;
});

var y = d3.scale.linear()
        .range([cell_height, 0])
        .domain([0,1])
    ;

var x = d3.scale.linear()
    .range([0, cell_width])
    .domain([0, 1]);

var ra_rs_size = 180;
var ra_rs_xscale = d3.scale.linear()
    .range([0, ra_rs_size])
    .domain([0.875, 1.4])

var ra_rs_yscale = d3.scale.linear()
    .range([0, ra_rs_size])
    .domain([1.1, 0.7])

var ra_rs_xaxis = d3.svg.axis()
    .orient("bottom")
    .scale(ra_rs_xscale);

var ra_rs_yaxis = d3.svg.axis()
    .orient("left")
    .scale(ra_rs_yscale);

var war_scatter_size = 240;
var war_scatter_xscale = d3.scale.linear()
    .range([0, war_scatter_size])
    .domain([-2, 10])

var war_scatter_yscale = d3.scale.linear()
    .range([0, war_scatter_size])
    .domain([10, -2])

var war_scatter_xaxis = d3.svg.axis()
    .orient("bottom")
    .scale(war_scatter_xscale);

var war_scatter_yaxis = d3.svg.axis()
    .orient("left")
    .scale(war_scatter_yscale);

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom + 100)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

var high_seed_x = 800;
var high_seed_y = -30 + 10;
svg.append('text')
    .attr('class', 'matchup-label high-seed-label')
    .attr('x', high_seed_x)
    .attr('y', high_seed_y)
    .text('high seed')
;
var low_seed_x = 800;
var low_seed_y = -10 + 10;
svg.append('text')
    .attr('class', 'matchup-label low-seed-label')
    .attr('x', low_seed_x)
    .attr('y', low_seed_y)
    .text('low seed')
;


svg.append('a')
    .attr('href', 'http://www.sportsonearth.com/article/201543974/mlb-world-series-world-series-champions')
    .append('text')
    .attr('class', 'main-label')
    .attr('x', main_title_x)
    .attr('y', main_title_y)
    .text('Sports on Earth - WS Winner bracket')
;


var interpolate_type = 'linear';

var line = d3.svg.line()
    .x(function(d) {
        return x(d.x);
    })
    .y(function(d) {
        return y(d.y);
    })
    .interpolate(interpolate_type);

var line_identity = d3.svg.line()
    .x(function(d) {
        return d.x;
    })
    .y(function(d) {
        return d.y;
    })
    .interpolate(interpolate_type);


function highlight_circle_on(d) {
    var k = '.circle-' + datum_to_key(d);
    d3.selectAll(k)
        .transition()
        .duration(ra_rs_circle_duration)
        .attr('r', ra_rs_circle_r_highlight_on)
        .style('fill', color_map[d.highlow])
    ;
};

function highlight_circle_off(d) {
    var k = '.circle-' + datum_to_key(d);
    d3.selectAll(k)
        .transition()
        .duration(ra_rs_circle_duration)
        .attr('r', ra_rs_circle_r_highlight_off)
        .style('fill', '#332222')
    ;
};

var mouseout = function (d) {
    console.log('mouseout', d);
    highlight_off(d);
    highlight_circle_off(d);
};

var mouseover = function (d) {
    console.log('mouseover', d);
    highlight_on(d);
    highlight_circle_on(d);

};


function datum_to_key(d) {
    return d.teamid + '-' + d.yearid;
}

function highlight_on(d) {
    console.log('mouse k', d, datum_to_key(d))
    var a = svg.selectAll('.' + datum_to_key(d))
            .transition()
            .duration(200)
            .style('stroke', color_map[d.highlow])
            .style('opacity', 1)
            .style('display', 'block')

        ;
//    console.log('a', a);
}

function highlight_off(d) {
    var key = datum_to_key(d);
    svg.selectAll('.' + key)
        .transition()
        .duration(200)
        .style('opacity', 0)
        .style('display', 'none')
    ;

}

var game_array = [];
var game_map = {};
var teams_data = {};
var war_scatter_svg;
var stats_table_svg;

/*********************************************************/
d3.json('soe_ws_bracket.json', function(data) {
    console.log('data', data);

    teams_data = {};
    data['teams'].forEach(function(d) {
        var k = datum_to_key(d);
        teams_data[k] = d;
    });

    var stats_data = {};

    data['stats'].forEach(function(d) {
        stats_data[d.stat_name] = d;
    });


    batting_stat_names.forEach(function(name) {
        stat_yscales[name].domain([0, 1.002 * stats_data[name].max]);
    });


    var setLabel = function (d) {
        console.log('set lab', d, teams_data[datum_to_key(d)]);
        var team_name = teams_data[datum_to_key(d)].team_name;
        var sel = d.highlow === 1 ? '.high-seed-label' : '.low-seed-label';
        svg.selectAll(sel)
            .transition()
            .duration(200)
            .text('(' + d.seed + ') ' + team_name + ' ' + d.yearid)
            .style('font-size', 16)
            .style('fill', color_map[d.highlow])
        ;
    };

    function set_stat_value_text(d, stat_name) {

        var k = datum_to_key(d);
        var sel = d.highlow === 1 ? '.text-high-value-' : '.text-low-value-';

        batting_stat_names.forEach(function(stat_name) {
            //console.log(d, stat_name, d[stat_name]);
            d3.select(sel + stat_name)
                .text(teams_data[k][stat_name])
                .style('fill', function() {
                    return color_map[d.highlow];
                })

            ;
        });

    }

    function game_datum_to_key(d) {
        var s = '';
        s += d.idx;
        s += '-';
        s += d.highlow;
        return s;
    }

    function get_other_seed_from_matchup(d) {
        var other_seed = d.highlow === 1 ? 0 : 1;
        var v = game_map[game_datum_to_key({idx: d.idx, highlow: other_seed})];
        console.log('other seed', d, v);
        return v;
    }

    function make_bracket() {

        console.log('custom_list', custom_list);

        _.forOwn(data.games, function(d) {

            var v = {
                idx: d.idx,
                tier: d.tier,
                seed: d.high_seed,
                teamid: custom_list[d.high_seed-1].teamid,
                yearid: custom_list[d.high_seed-1].yearid,
                highlow: HIGH_SEED
            };
            game_array.push(v);
            game_map[game_datum_to_key(v)] = v;
            v = {
                idx: d.idx,
                tier: d.tier,
                seed: d.low_seed,
                teamid: custom_list[d.low_seed-1].teamid,
                yearid: custom_list[d.low_seed-1].yearid,
                highlow: LOW_SEED
            };
            game_array.push(v);
            game_map[game_datum_to_key(v)] = v;
        });

        var s = svg.selectAll('.customlist')
            .data(game_array);

        s.enter()
            .append('text')
            .attr('class', 'customlist')
            .attr('cursor', 'pointer')
            .attr('x', function(d, i) {
                var ixy = idx_to_ixy(d);
                var ix = ixy.ix;
                return listx + (ix-1)*(bracket_width + bracket_buffer);
            })
            .attr('y', function(d, i) {
                var ixy = idx_to_ixy(d);
                var iy = d.highlow === LOW_SEED ? ixy.iy + 0.35 : ixy.iy;
                return listy + (iy-1)*(bracket_y_buffer);
            })
            .attr('font-size', list_font)
            .on('mouseover', function(d) {
                clear_war_scatter();

                mouseover(d);
                set_stat_value_text(d);
                setLabel(d);
                update_table(d);

                var v = get_other_seed_from_matchup(d);
                mouseover(v);
                set_stat_value_text(v);
                setLabel(v);
                update_table(v);

                make_war_scatter([d, v]);

            })
            .on('mouseout', function(d) {
                clear_war_scatter();
                mouseout(d);

                var v = get_other_seed_from_matchup(d);
                mouseout(v);
                //clear_war_scatter(d);
            })
            .text(function(d) {
                return '(' + d.seed + ') ' + d.teamid + ' ' + d.yearid;
            });

        s.exit().remove();
    }


    console.log('teams_data', teams_data);

    console.log('stats_data', stats_data);


        var idx_to_ixy = function(d) {

            var start_x = 1;
            var start_y = 1;
            var delta_x, delta_y;

            var round_number;
            if (d.idx<=32) {
                round_number = 1;
            } else if (d.idx<=32+16) {
                round_number = 2;
            } else if (d.idx<=32+16+8) {
                round_number = 3;
            } else if (d.idx<=32+16+8+4) {
                round_number = 4;
            } else if (d.idx<=32+16+8+4+2) {
                round_number = 5;
            }

            
            if (d.tier === 1 || d.tier === 4) {
                start_x = 0;
                delta_x = round_number;
            } else {
                start_x = 9;
                delta_x = -round_number;
            }

            function round_tier_to_ystart(round_number, tier) {
                var start_y = 1;
                if (round_number === 2) {
                    start_y += 0.5;
                } else if (round_number === 3) {
                    start_y += 2;
                } else if (round_number === 4) {
                    start_y += 4
                }
                if (tier===1 || tier===2) {
                    start_y += 8;
                }
                return start_y;
            }

            start_y = round_tier_to_ystart(round_number, d.tier);


            if (round_number==1) {
                delta_y = (d.idx-1) % 8
                delta_y *= 1;
            } else if (round_number==2) {
                delta_y = (d.idx-33) % 4
                delta_y *= 2;
            } else if (round_number==3) {
                delta_y = (d.idx-49) % 2
                delta_y *= 4;
            } else if (round_number==4) {
                delta_y = (d.idx-56) % 1
                delta_y *= 16;
            }


            var ix = start_x + delta_x;
            var iy = start_y + delta_y;
          //  console.log(d, d.tier, start_x, delta_x, ix, start_y, delta_y, iy);

            return {ix: ix, iy: iy};
        };

        var make_boxplot = function(d, idx) {

            var child_svg = svg.append('g')
                .attr('transform', function() {
                    var ix = idx;
                    var iy = 0;

                    var dx = ix * (cell_width + cell_buffer) + boxplot_xoff;
                    var dy = iy * (cell_height + cell_buffer) + boxplot_yoff;
                    return 'translate('
                        + dx.toString()
                        + ','
                        + dy.toString() + ')';
                })
                ;

            var wl = d.whisker_low90;
            var wh = d.whisker_high90;
            var wmax = d.max;

            console.log('wl wh wmax', wl, wh, wmax);

            // bounding box
            child_svg.append('rect')
                .attr('width', function() {
                    return x(1);
                })
                .attr('height', function() {
                    return y(0);
                })
                .attr('fill', 'white')
                .style('opacity', 0.5)
                .attr('stroke-width', 1)
                .attr('stroke', 'black')
                .attr('cursor', 'pointer')
                .on('mouseover', function() {
                    //set_game_text(d);
                });

            y.domain([0, 1.1 * wmax]);

            // first draw the whiskers,
            var silly_data = [
                {x: 0.5, y: wl},
                {x: 0.5, y: wh}
            ];

            var endcap_high = [
                {x: xbuff, y: wh},
                {x: 1-xbuff, y: wh}
            ];

            var endcap_low = [
                {x: xbuff, y: wl},
                {x: 1-xbuff, y: wl}
            ];

            _.forEach([silly_data, endcap_high, endcap_low], function(datum) {
                child_svg.append('path')
                    .attr("d", line(datum))
                    .attr("stroke", function () {
                        return 'black';
                    })
                    .attr("stroke-width", whisker_stroke_width)
                    .style('opacity', 1)
                    .attr("fill", "none")
                ;

            });

            // now draw the box, lol
            child_svg.append('rect')
                .attr('width', function() {
                    return x(1-2*xbuff);
                })
                .attr('height', function() {
                    return y(d.quartile_low) - y(d.quartile_high);
                })
                .attr('x', function() {
                    return x(xbuff);
                })
                .attr('y', function() {
                    return y(d.quartile_high);
                })
                .attr('fill', BOXPLOT_FILL)
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('cursor', 'pointer')
                .on('mouseover', null )//set_game_text(d))
            ;

            datum = [
                {x: xbuff, y: d.median},
                {x: 1-xbuff, y: d.median}
            ];

            child_svg.append('path')
                .attr("d", line(datum))
                .attr("stroke", function () {
                    return 'black';
                })
                .attr("stroke-width", 1)
                .style('opacity', 1)
                .attr("fill", "none")
            ;

            var text_x = 0.5;
            child_svg.append('text')
                .text(function() {
                    return d.stat_name
                })
                .attr('font-size', 10)
                .attr('text-anchor', 'middle')
                .attr('opacity', function() {
                    return 0.8;
                })
                .attr('x', function() {
                    return x(text_x);
                })
                .attr('y', function() {
                    return y(0) - 5;
                })
                .attr('class', 'text-'+idx.toString())
                //.attr('transform', function() {
                //    var s = 'rotate(-90,'
                //    s += x(text_x).toString() ;
                //    s += ',';
                //    s += y(0).toString();
                //    s += ')';
                //    return s;
                //})

            var bs = batting_stat_names[idx-1];

            // stat value - low seed
            child_svg.append('text')
                .text('low')
                .attr('font-size', 10)
                .attr('text-anchor', 'middle')
                .attr('opacity', function() {
                    return 0.8;
                })
                .attr('x', function() {
                    return x(text_x);
                })
                .attr('y', function() {
                    return y(0) + 12;
                })
                .attr('class', 'text-low-value-'+bs)
            ;

            // stat value - high seed
            child_svg.append('text')
                .text(batting_stat_names[idx])
                .attr('font-size', 10)
                .attr('text-anchor', 'middle')
                .attr('opacity', function() {
                    return 0.8;
                })
                .attr('x', function() {
                    return x(text_x);
                })
                .attr('y', function() {
                    return y(0) - 5 - cell_height;
                })
                .attr('class', 'text-high-value-'+bs)
            ;

        };



    function set_team_year(d, stat_name) {

//            console.log('d stat_name', d, stat_name);

            var idx = batting_stat_names.indexOf(stat_name) + 1;
            var key = d.teamid + '-' + d.yearid;

//        games
            var datum = [
                {x: xbuff, y: d[stat_name]},
                {x: 1- xbuff, y: d[stat_name]}
            ];

            var child_svg = svg.append('g')
                .attr('transform', function() {

                    var ix = idx;
                    var iy = 0;

                    var dx = ix * (cell_width + cell_buffer) + boxplot_xoff;
                    var dy = iy * (cell_height + cell_buffer) + boxplot_yoff;
                    return 'translate('
                        + dx.toString()
                        + ','
                        + dy.toString() + ')';
                });

            y.domain(stat_yscales[stat_name].domain());

//            console.log('datum', datum);
// label
            child_svg.append('path')
                .attr("d", line(datum))
                .attr("stroke", function () {
                    return '#332222';
                })
                // # bd0026
                .attr("stroke-width", user_stroke_width)
                .style('opacity', 1)
                .style('display', 'none')
                .attr("fill", "none")
                .attr('class', function() {
                    //console.log('set key', key);
                    return key;
                })
            ;
        };


    function update_table(d) {

        var k = datum_to_key(d);
        var player_data = _.map(_.range(2, 10), function(idx) {
            console.log('idx', idx);
            return {'player_stats': teams_data[k]['fld' + idx.toString()]};
        });

        position_labels.forEach(function(lab, idx) {
            var sel = d.highlow === 1 ? '.positionLabelHigh' : '.positionLabelLow';
            sel += '-' + lab;

            stats_table_svg.selectAll(sel)
                .text(function() {
                    var datum = teams_data[k];
                    var j = 'fld' + (idx + 2).toString();
                    console.log('positionLabel', k, datum, j);
                    var s = datum[j].player_name;
                    var bavg = datum[j].bavg.toFixed(3);
                    var obp = datum[j].obp.toFixed(3);
                    var slg = datum[j].slg.toFixed(3);
                    if (d.highlow === 0) {
                        s = bavg + ' / ' + obp + ' / ' + slg + ' ' + s;
                    } else {
                        s = s + ' ' + bavg + ' / ' + obp + ' / ' + slg + ' ' ;
                    }

                return s;
                })
                .style('fill', function() {
                    return color_map[d.highlow];
                })
            ;

        });


    }

    function init_table() {
        stats_table_svg = svg.append('g')
            .attr('transform', function() {
                var dx = stats_table_xoff;
                var dy = stats_table_yoff;
                return 'translate('
                    + dx.toString()
                    + ','
                    + dy.toString() + ')';
            });


        stats_table_svg.selectAll('.positionLabel')
            .data(position_labels)
            .enter()
            .append('text')
            .style('font-size', position_label_fontsize)
            .style('font-weight', 'bold')
            .attr('class', 'positionLabel')
            .text(function(d, i) {
                console.log('positionLabel', d);
                return d;
            })
            .attr('text-anchor', 'middle')
            .attr('y', function(d, i) {
                return i*20;
            });

        var dx = 25;
        stats_table_svg.selectAll('.positionLabelHigh')
            .data(position_labels)
            .enter()
            .append('text')
            .style('font-size', position_label_fontsize)
            .style('font-weight', 'bold')
            .attr('class', function(d) {
                return 'positionLabelHigh positionLabelHigh-' + d;
            })
            .text(function(d, i) {
                return d + 'home';
            })
            .attr('x', function(d, i) {
                return -dx;
            })
            .attr('text-anchor', 'end')
            .attr('y', function(d, i) {
                return i*20;
            });

        stats_table_svg.selectAll('.positionLabelLow')
            .data(position_labels)
            .enter()
            .append('text')
            .style('font-size', position_label_fontsize)
            .style('font-weight', 'bold')
            .attr('class', function(d) {
                return 'positionLabelLow positionLabelLow-' + d;
            })
            .text(function(d, i) {
                return d + 'low';
            })
            .attr('x', function(d, i) {
                return dx;
            })
            .attr('text-anchor', 'start')
            .attr('y', function(d, i) {
                return i*20;
            });


    }

    function init_war_scatter() {
        war_scatter_svg = svg.append('g')
            .attr('transform', function() {
                var dx = war_scatter_xoff;
                var dy = war_scatter_yoff;
                return 'translate('
                    + dx.toString()
                    + ','
                    + dy.toString() + ')';
            });

        war_scatter_svg.append("g")
            .attr("class", "axis")
            .call(war_scatter_yaxis)
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -11)
            .text('WAR (def)')
            .attr('transform', 'translate(-12,' + 0 + ')')

        war_scatter_svg.append("g")
            .attr('transform', 'translate(0,' + war_scatter_size + ')')
            .attr("class", "axis")
            .call(war_scatter_xaxis)
            .selectAll("text")
            .attr('transform', 'rotate(-30)')
        ;
        war_scatter_svg.append("g")
            .attr('class', 'axis')
            .append("text")
            .style("text-anchor", "middle")
            .attr("x", war_scatter_size)
            .attr("y", war_scatter_size - 10)
            .text('WAR (off)')
        ;


    }

    function clear_war_scatter(d) {
        var e = war_scatter_svg.selectAll('.war-scatter-points')
            .data([])
            .exit();
        e.remove();
    }

    function make_war_scatter(array_of_ds) {

        if (! array_of_ds.hasOwnProperty('length')) {
            array_of_ds = [array_of_ds];
        }

        var ks = _.map(array_of_ds, function(d) {
            return datum_to_key(d);
        });

        var this_data = [];

        ks.forEach(function(k, i) {
            //console.log('make_war_scatter', teams_data[k]);
            var d = array_of_ds[i];
            _.forEach(_.range(0, 12), function(idx) {
                this_data.push(
                    {
                        name: teams_data[k]['top_name' + idx],
                        war: teams_data[k]['top_war' + idx],
                        war_off: teams_data[k]['top_war_off' + idx],
                        war_def: teams_data[k]['top_war_def' + idx],
                        highlow: d.highlow
                    }
                );
            })
        });

        var e = war_scatter_svg.selectAll('.war-scatter-points')
            .data(this_data)
            .enter();

        var g = e.append('g')
            .attr('class', function(d) {
                //console.log('set key', key);
                return 'war-scatter-points war-scatter-points-' + datum_to_key(d);
            })
                ;

        g.append('text')
            .text(function(d) {
                return d.name;
            })
            .style("text-anchor", "middle")
            .style('font-face', 'sans-serif')
            .style('font-size', war_scatter_font_size)
            .attr('x', function(d) {
                //console.log('rs_plus', d.rs_plus, ra_rs_xscale(d.rs_plus));
                return war_scatter_xscale(d.war_off)
            })
            .attr('y', function(d) {
                //console.log('ra_plus', d.ra_plus, ra_rs_yscale(d.ra_plus));
                return war_scatter_yscale(d.war_def)
            })
            .style('stroke', function(d) {
                return color_map[d.highlow];
            })
            .attr("stroke-width", 0.5)
            .style('opacity', 1)
            ;
    g.append('circle')
            .attr('cx', function(d) {
                return war_scatter_xscale(d.war_off)
            })
            .attr('cy', function(d) {
                return war_scatter_yscale(d.war_def)
            })
            .attr('r', 1)
            .style('fill', '#332222')
        ;

    }


    function make_ra_rs() {

        console.log('make_ra_rs', data['teams']);

        var child_svg = svg.append('g')
            .attr('transform', function() {
                var dx = ra_rs_xoff;
                var dy = ra_rs_yoff;
                return 'translate('
                    + dx.toString()
                    + ','
                    + dy.toString() + ')';
            })
            .style('position', 'fixed');

        child_svg.append("g")
            .attr("class", "axis")
            .call(ra_rs_yaxis)
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -11)
            .text('RA+')
            .attr('transform', 'translate(-12,' + 0 + ')')

        child_svg.append("g")
            .attr('transform', 'translate(0,' + ra_rs_size + ')')
            .attr("class", "axis")
            .call(ra_rs_xaxis)
            .selectAll("text")
            .attr('transform', 'rotate(-30)')
        ;

        child_svg.append("g")
            .attr('class', 'axis')
            .append("text")
            .style("text-anchor", "middle")
            .attr("x", ra_rs_size)
            .attr("y", ra_rs_size - 10)
            .text('RS+')
        ;


        var ra_rs_guide_stroke_width = 1;
        var ra_rs_guide_stroke_color = '#222233';

        var silly_data = [{x: ra_rs_xscale(1), y: 0}, {x: ra_rs_xscale(1), y: ra_rs_size}];
        child_svg.append('path')
            .attr("d", line_identity(silly_data))
            .attr("stroke", function () {
                return ra_rs_guide_stroke_color;
            })
            .attr("stroke-width", ra_rs_guide_stroke_width)
            .style('opacity', 1)
            .attr("fill", "none")
        ;

        var silly_data = [{x: 0, y: ra_rs_yscale(1)}, {x: ra_rs_size, y: ra_rs_yscale(1)}];
        child_svg.append('path')
            .attr("d", line_identity(silly_data))
            .attr("stroke", function () {
                return ra_rs_guide_stroke_color;
            })
            .attr("stroke-width", ra_rs_guide_stroke_width)
            .style('opacity', 1)
            .attr("fill", "none")
        ;



        child_svg.selectAll('circle')
            .data(data.teams)
            .enter()
            .append('circle')
            .attr("stroke", function () {
                return 'red';
            })
            // # bd0026
            .attr('cx', function(d) {
                //console.log('rs_plus', d.rs_plus, ra_rs_xscale(d.rs_plus));
                return ra_rs_xscale(d.rs_plus)
            })
            .attr('cy', function(d) {
                //console.log('ra_plus', d.ra_plus, ra_rs_yscale(d.ra_plus));
                return ra_rs_yscale(d.ra_plus)
            })
            .attr('r', ra_rs_circle_r_highlight_off)
            .style('fill', '#332222')
            .attr("stroke-width", 0)
            .style('opacity', 1)
            .attr('class', function(d) {
                //console.log('set key', key);
                return 'circle-' + datum_to_key(d);
            })
        ;

    }

    init_table();
    init_war_scatter();
    make_ra_rs();
    make_bracket();

    batting_stat_names.forEach(function(name, idx) {
        make_boxplot(stats_data[name], idx+1);

    });

    batting_stat_names.forEach(function(stat_name) {
        _.forOwn(teams_data, function (v, k) {
            set_team_year(v, stat_name);
        });
    });

});
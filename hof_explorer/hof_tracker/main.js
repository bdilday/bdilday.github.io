

var player_font_size = 10;
var font_multiplier = 1.25;

var voter_columns = 2;
var player_rows = 3;

var text_duration = 800;

var left_buffer = 200;
var top_buffer = 40;

var margin = {top: 40, right: 30, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var main_width = width - (left_buffer-margin.left-margin.right);
var main_height = height - (top_buffer-margin.top-margin.bottom);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

var vcol = d3.scale.ordinal()
    .rangeRoundBands([0,left_buffer], 0.1)
    .domain(_.range(voter_columns));

var prow = d3.scale.ordinal()
    .rangeRoundBands([0, top_buffer], 0.1)
    .domain(_.range(player_rows));

var x = d3.scale.ordinal()
    .rangeRoundBands([left_buffer, width], 0.1);

var y = d3.scale.ordinal()
    .rangeRoundBands([top_buffer, height], 0.1);

var pl_to_idx = {};
var vt_to_idx = {};
var all_players = [];
var all_voters = [];

var set_player_locations = function()
{
    svg.selectAll('.text-player')
        .data(all_players)
        .enter()
        .append('text')
        .attr('class', 'text-player')
        .attr('id', function (d) {
            return 'text-player-' + d
        })
        .attr('font-size', player_font_size)
        .attr('x', function (d, i) {
            return x(pl_to_idx[d].i);
        })
        .attr('y', function (d) {
            return margin.top + prow(pl_to_idx[d].i % player_rows);
        })
        .text(function (d, i) {
            return d;
        })
        .attr('cursor', 'pointer')
        .on('mouseover', function (d) {
            d3.select(this)
                .attr('fill', 'steelblue')
                .attr('font-size', font_multiplier*player_font_size);
            mouseover_player(d);
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .attr('fill', 'black')
                .attr('font-size', player_font_size);
            mouseout_player(d);
        })
    ;
};

var set_voter_locations = function() {
    svg.selectAll('.text-voter')
        .data(all_voters)
        .enter()
        .append('text')
        .attr('class', 'text-voter')
        .attr('id', function (d) {
            return 'text-voter-' + d;
        })
        .attr('font-size', player_font_size)
        .attr('x', function(d, i) {
            return vcol(i % voter_columns);

        })
        .attr('y', function (d, i) {
            return y(Math.floor(vt_to_idx[d].i/voter_columns)*voter_columns);
        })
        .text(function (d, i) {
            return d;
        })
        .attr('cursor', 'pointer')
        .on('mouseover', function (d) {
            d3.select(this)
                .attr('fill', 'steelblue')
                .attr('font-size', font_multiplier*player_font_size);
            mouseover_voter(d);
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .attr('fill', 'black')
                .attr('font-size', player_font_size);
            mouseout_voter(d);
        })
    ;
};


var line = d3.svg.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .interpolate('linear')
    ;


var x0 = d3.scale.linear()
    .rangeRound([left_buffer, left_buffer + 0.5*main_width], 0.1)
    .domain([0, 1]);

var inset_columns = 5;
var inset_rows = 80;

var dx0 = d3.scale.linear()
    .rangeRound([0, 0.5*main_width - 50])
    .domain([0, inset_columns]);

var dy0 = d3.scale.linear()
        .rangeRound([0, 0.5*main_height])
        .domain([0, inset_rows]);

var y0 = d3.scale.linear()
    .rangeRound([margin.top + top_buffer, top_buffer + 0.5*main_height], 0.1)
    .domain([1, 0]);

var mouseover_voter = function(k) {

    var tmp_map = {};
    var idx = [[0,0],[0,0]];
    _.forEach(all_players, function(d) {
        var t = pl_to_idx[d][k];
        tmp_map[d] = idx[t.old][t.new];
        idx[t.old][t.new] += 1;
    });

    svg.selectAll('.text-player')
        .transition()
        .duration(text_duration)
        .attr('x', function(d) {
            var t = pl_to_idx[d][k];
            var nx = x0(t.old);
            var tmp = tmp_map[d] % inset_columns;
            return nx + dx0 (tmp);
        })
        .attr('y', function(d) {
            var t = pl_to_idx[d][k];
            var tmp = Math.floor(tmp_map[d]/inset_columns)*inset_columns;
            var ny = y0(t.new);
            return ny + dy0 (tmp);
        })
    ;
};

var mouseover_player = function(k) {
    var tmp_map = {};
    var idx = [[0,0],[0,0]];
    _.forEach(all_voters, function(d) {
        var t = vt_to_idx[d][k];
        tmp_map[d] = idx[t.old][t.new];
        idx[t.old][t.new] += 1;
    });

    svg.selectAll('.text-voter')
        .transition()
        .duration(text_duration)
        .attr('x', function(d) {
            var t = vt_to_idx[d][k];
            var nx = x0(t.old);
            var tmp = tmp_map[d] % inset_columns;
            idx[t.old][t.new] += 1;
            return nx + dx0 (tmp);
        })
        .attr('y', function(d) {
            var t = vt_to_idx[d][k];
            var tmp = Math.floor(tmp_map[d]/inset_columns)*inset_columns;
            var ny = y0(t.new);
            return ny + dy0 (tmp);
        })
    ;
}

var mouseout_voter = function(k) {
    svg.selectAll('.text-player')
        .transition()
        .duration(text_duration)
        .attr('x', function (d, i) {
            return x(pl_to_idx[d].i);
        })
        .attr('y', function (d) {
            return margin.top + prow(pl_to_idx[d].i % player_rows);
        })
    ;
};

var mouseout_player = function(k) {
    svg.selectAll('.text-voter')
        .transition()
        .duration(text_duration)
        .attr('x', function(d, i) {
            return vcol(i % voter_columns);

        })
        .attr('y', function (d, i) {
            return y(Math.floor(vt_to_idx[d].i/voter_columns)*voter_columns);
        })
    ;
}

/*******************************************/
d3.csv('hft_change.csv', function(data) {
    //console.log('data', data);

    var ydom = [];
    var xdom = [];

    var by_player = d3.nest()
            .key(function (d) {
                return d.pl;
            })
            .entries(data)
        ;

    //console.log('by_player', by_player);
    _.forEach(by_player, function(d, i) {
        all_players.push(d.key);
        pl_to_idx[d.key] = {};
        pl_to_idx[d.key]['i'] = i;
        _.forEach(d.values, function(value) {
            pl_to_idx[d.key][value.vt] = value;
        });
        xdom.push(i);
    });


    var by_voter = d3.nest()
            .key(function (d) {
                return d.vt;
            })
            .entries(data)
        ;

    _.forEach(by_voter, function(d, i) {
        all_voters.push(d.key)
        vt_to_idx[d.key] = {};
        vt_to_idx[d.key]['i'] = i;
        _.forEach(d.values, function(value) {
            vt_to_idx[d.key][value.pl] = value;
        });
        ydom.push(i);
    });

    y.domain(ydom);
    x.domain(xdom);

    set_voter_locations();
    set_player_locations();

    var xaxis_data = [
        {x: left_buffer, y: top_buffer + 0.5*(height-top_buffer)},
        {x: width, y: top_buffer + 0.5*(height-top_buffer)}
    ];

    var yaxis_data = [
        {x: left_buffer + 0.5*(width-left_buffer), y: top_buffer + player_rows*player_font_size},
        {x: left_buffer + 0.5*(width-left_buffer), y: height + player_rows*player_font_size}
    ];

    svg.append('path')
        .attr('d', line(xaxis_data))
        .attr('class', 'axis-path')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
    ;

    svg.append('path')
        .attr('d', line(yaxis_data))
        .attr('class', 'axis-path')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
    ;

    var labels = [
        {s: 'never',
            x: left_buffer + 0.5*main_width - 45,
            y: top_buffer + 0.5*main_height - 20,
            anchor: 'end'},

        {s: 'always',
            x: left_buffer + 0.5*main_width- 35,
            y: top_buffer + 0.5*main_height - 45,
            anchor: 'start'},

        {s: 'gained',
            x: left_buffer + 0.5*main_width - 45,
            y: top_buffer + 0.5*main_height - 45,
            anchor: 'end'},


        {s: 'lost',
            x: left_buffer + 0.5*main_width - 35,
            y: top_buffer + 0.5*main_height - 20,
            anchor: 'start'}

    ];


    svg.selectAll('.quad-label')
        .data(labels)
        .enter()
        .append('text')
        .attr('class', 'quad-label')
        .attr('x', function(d) {
            return d.x;
        })
        .attr('y', function(d) {
           return d.y;
        })
        .attr('text-anchor', function(d) {
            return d.anchor;
        })
        .text(function(d) {
            return d.s;
        })
        .attr('font-weight', 'bold')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        ;
})

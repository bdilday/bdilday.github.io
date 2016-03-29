

var top10 = [
    'mallorqui'
    ,'hack-a-bracket'
    ,'jeremyjames'
    ,'method-2-the-madness'
    ,'bayz'
    ,'vince0'
    ,'nthustatistic'
    ,'adamgilfix'
    ,'justdukeit'
    ,'luckyguesser'
    ,'napomatic'
    ,'lavarez'
    ,'magic'
    ,'glicko'
    ,'oneshiningmgf'
    ,'fivethirtyeight'
];


var custom_list = _.map(top10, function(d) {
    return d;
});

var listx = 1400;
var listy = 120;
var list_dy = 20;
var list_font = 16;
var xbuff = 0.1;

var margin = {top: 60, right: 80, bottom: 20, left: 100},
    width = 1500 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

var whisker_stroke_width = 2;
var cell_height = 200;
var cell_width = 16;
var cell_buffer = 6;
var user_stroke_width = 1;

var max_penalty = 2.5
var y = d3.scale.linear()
        .range([cell_height, 0])
        .domain([max_penalty, 0])
    ;

var ydum = d3.scale.linear()
        .range([0, cell_height])
        .domain([max_penalty, 0])
    ;

var yAxis = d3.svg.axis()
    .scale(ydum)
    .orient("left")
;


var x = d3.scale.linear()
    .range([0, cell_width])
    .domain([0, 1]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 100)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;


var mouseout = function (d) {
    highlight_off(d);
    setLabel({user: '--'});
};

var mouseover = function (d) {
    highlight_on(d);
    setLabel(d);
};

var setLabel = function (d) {
    //console.log('set lab', d);

    svg.selectAll('#label')
        .transition()
        .duration(200)
        .text(d.user.toString());
};

var setGameLabel = function (d) {
    //console.log('set lab', d);

    svg.selectAll('#game-text')
        .transition()
        .duration(200)
        .text(d.game_name.toString());
};


var current_selection = 'XXX';

var reset_custom_list = function() {
    custom_list = _.map(top10, function (d) {
        return d;
    });

    update_custom_list();
};

var update_custom_list = function() {

    console.log('custom_list', custom_list);

    var s = svg.selectAll('.customlist')
        .data(custom_list);

    s.enter()
        .append('text')
        .attr('class', 'customlist')
        .attr('cursor', 'pointer')
        .attr('x', listx)
        .attr('y', function(d, i) {
            return listy + (i+1)*list_dy
        })
        .attr('font-size', list_font)
        .on('mouseover', function(d) {
            mouseover({user: d})
        })
        .on('mouseout', function(d) {
            mouseout({user: d})
        })
        .text(function(d) {
            console.log('text list', d);
            return d;
        });

    s.exit().remove();
};

var changeHandler = function(event, ui) {
    mouseout(current_selection);
    //console.log('select!', event, ui);
    d = {user: ui.item.value}
    //console.log('change handler d');
    current_selection = d;
    mouseover(d);
    custom_list.push(d.user);

    update_custom_list();

};

var setTags = function(availableTags) {
    $("#tags").autocomplete({
        source : availableTags,
        select : changeHandler
    })

};

var interpolate_type = 'linear';
var line = d3.svg.line()
    .x(function(d) {
        return x(d.x);
    })
    .y(function(d) {
        return y(d.y);
    })
    .interpolate(interpolate_type);

var set_game_text = function(d) {

        svg.selectAll('#game-text')
            .transition()
            .duration(200)
            .text(d.game_name.toString());

        svg.selectAll('.' + d.gameidx)
            .transition()
            .duration(200)
            .attr('opacity', 1)
};

var user_map = {};
var games;
var users;

var child_svg;

var game_metric = function(d) {

    var p = d.pred;
    p = p < 1e-6 ? 1e-6 : p;
    p = p > 1-1e-6 ? 1-1e-6 : p;

    var m = Math.log(games[d.game].median);
    var dv = Math.log(p) - m;
    dv  = dv < -max_penalty ? -max_penalty : dv;
    dv = dv > max_penalty ? max_penalty : dv;
    return dv;
};

var set_user = function(u) {

    var data = _.map(user_map[u.user], function(d) {
        //console.log({game: d.game, entry: d.entry, pred: d.pred, vy: game_metric(d)});
        return {game: d.game, entry: d.entry, pred: d.pred, vy: game_metric(d)};
    });

//    console.log('set_user', data);
    var yoff = cell_height;

    child_svg = svg.selectAll('rect.bar-g')
        .data(data, function(d) {
            return d.game*1000 + '-' + d.entry;
        });

  //  console.log('child', child_svg);

    child_svg
        .on('mouseover', function(d) {
            //console.log('mouse!', u);
            setLabel(u);
            setGameLabel(games[d.game])
        })
        .transition()
        .duration(1000)
        .attr('y', function(d) {
            return yoff - y(Math.abs(d.vy)) ;//+ y(games[d.game].median);
        })
        .attr('height', function(d) {
            //console.log('d height', d, d.vy, y(Math.abs(d.vy)));
;            return y(Math.abs(d.vy));
        })
        .attr('fill', function(d) {
            return d.vy > 0 ? '#2171b5' : '#7f2704';
        })
    ;

    child_svg
        .enter()
        .append('rect')
        .attr('class', 'bar-g')
        .attr('transform', function(d, i) {

            var ix = d.game;
            var iy = d.entry+1;

            var dx = ix * (cell_width + cell_buffer);
            var dy = iy * (cell_height + cell_buffer) - yoff;

//            console.log('d', d, ix, iy, dx, dy);

            return 'translate('
                + dx.toString()
                + ','
                + dy.toString() + ')';
        })
        .attr("stroke", '#525252')
        // # bd0026

        .attr("stroke-width", user_stroke_width)
        .style('opacity', 1)
        .attr("fill", "#525252")
        //.attr('class', function() {
        //    return u.user;
        //})
        .attr('cursor', 'pointer')
        .on('mouseover', function() {
          //  console.log('mouse!', u);
            setLabel(u)
        })
        .attr('fill', function(d) {
            return d.vy > 0 ? '#2171b5' : '#7f2704';
        })

        .transition()
        .duration(1000)

        .attr('y', function(d) {
            return yoff - y(Math.abs(d.vy)) ;//+ y(games[d.game].median);
        })
        .attr('width', function() {
            return cell_width;
        })
        .attr('height', function(d) {
            //console.log('d med', d, games[d.game].median)
            return y(Math.abs(d.vy));
        })
    ;

    child_svg.exit()
        .transition()
        .duration(300)
        .attr('height', 0)
        .remove();
};


function highlight_on(d) {

    set_user(d);

    k = d.user ;
    ////console.log('mouse k', d, k, '.'+k)
    //var a = svg.selectAll('.' + k)
    //        .transition()
    //        .duration(200)
    //        .style('opacity', 1)
    //        .style('display', 'block')
    //    ;

//    console.log('a', a);
}

function highlight_off(d) {

    //k = d.user ;
    //svg.selectAll('.game-bar')
    //    .transition()
    //    .duration(200)
    //    .style('opacity', 0.0)
    //    .style('display', 'none')
    //    .attr('height', 0)
    ;
}


/****************************************/
d3.json('boxplot_all.json', function(indata) {

    games = indata['games']
    users = indata['users'];

    _.forEach(users, function(d) {
        if (! user_map.hasOwnProperty(d.user)) {
            user_map[d.user] = [];
        };
        user_map[d.user].push({game: d.game, entry: d.entry, pred: d.pred});
    });

    //console.log('games', games, games[8]);
    //console.log('users', users);
    //console.log('user_map', user_map);

    var prob_keys = [];
    var min_max = {};

    var listOfUsers = _.unique(_.map(users, function(u) {
        return u.user;
    }));

    setTags(listOfUsers);

    //_.forEach(users, function(u) {
    //    set_user(u);
    //});

    $("#tags").on( "ui-autocomplete", function(event,ui) {
        // post value to console for validation
        mouseover({user: $(this).val()});
    });

    svg.append('text')
        .attr('x', 300)
        .attr('y', 50)
        .text('highlighted user')
        .attr('font-size', 36)
        .attr('font-weight', 'bold')
        .attr('id', 'label')
    ;

    svg.append('text')
        .attr('x', 600)
        .attr('y', 50)
        .text('highlighted game')
        .attr('font-size', 36)
        .attr('font-weight', 'bold')
        .attr('id', 'game-text')
        .attr('fill', 'cornflowerblue')
        .attr('font-weight', 'bold')
    ;


    svg.append('text')
        .attr('x', 100)
        .attr('y', 30)
        .attr('font-size', list_font+2)
        .text('better than median')
        .attr('fill', '#2171b5')
    ;

    svg.append('text')
        .attr('x', 100)
        .attr('y', 50)
        .attr('font-size', list_font+2)
        .text('worse than median')
        .attr('fill', '#7f2704')
    ;

    var make_xlabels = function() {

    var yoff = cell_height;
    var iy = 4.5;

    svg.selectAll('.xtext')
        .data(games)
        .enter()
        .append('text')
        .attr('x', function (d, i) {
            var ix = i + 0.5;
            var dx = ix * (cell_width + cell_buffer);
            return dx;
        })
        .attr('y', function () {
            var dy = iy * (cell_height + cell_buffer) - yoff;
            return dy;
        })
        .attr('transform', function(d, i) {
            var ix = i + 0.5 ;
            var dx = ix * (cell_width + cell_buffer);
            var dy = iy * (cell_height + cell_buffer) - yoff;
            s = 'rotate(-90,';
            s += dx;
            s += ','
            s += dy;
            s += ')';
            return s;
        })
        .attr('text-anchor', 'middle')
        .text(function (d, i) {
            return games[i].game_name
        })
    ;
};

    var padding = -5;
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",210)")
        .call(yAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",415)")
        .text('kdkd')
        .call(yAxis);

    svg.append('text')
        .text('logloss v. median')
        .attr('x', -40)
        .attr('y', 410)
        .attr('font-size', 20)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90, -40, 410)')
    ;
    make_xlabels();
    update_custom_list();

    svg.append('text')
        .attr('cursor', 'pointer')
        .attr('x', listx)
        .attr('y', function(d, i) {
            return listy + (i-1)*list_dy
        })
        .attr('font-size', list_font)
        .on('click', reset_custom_list)
        .text('reset list')
        .attr('font-weight', 'bold')
    ;

});


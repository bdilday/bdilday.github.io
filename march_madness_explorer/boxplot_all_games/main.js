

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
    ,'jared-cross'
    ,'net-prophet'
    ,'oneshiningmgf'
    ,'fivethirtyeight'
    ,'vegas'
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
    height = 1600 - margin.top - margin.bottom;

var whisker_stroke_width = 2;
var cell_height = 200;
var cell_width = 32;
var cell_buffer = 8;
var user_stroke_width = 5;

var y = d3.scale.linear()
        .range([cell_height, 0])
        .domain([0,1])
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

function highlight_on(d) {

    k = d.user ;
    //console.log('mouse k', d, k, '.'+k)
    var a = svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .style('opacity', 1)
            .style('display', 'block')

        ;

//    console.log('a', a);
}

function highlight_off(d) {

    k = d.user ;
    svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .style('opacity', 0.0)
        .style('display', 'none')

    ;

}

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


var current_selection = 'XXX';

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
}
/****************************************/
d3.json('boxplot_all.json', function(indata) {

    var games = indata['games']
    var users = indata['users'];

    //console.log('games', games);
    //console.log('users', users);

    var idx_to_ixy = function(idx) {

        if (idx<32) {
            ix = idx;
            iy = 1;
        } else if(idx<48) {
            ix = 2*(idx-32) + 0.5;
            iy = 2;
        } else if(idx<56) {
            ix = 4*(idx-48) + 1.5;
            iy = 3;
        } else if(idx<60) {
            ix = 8*(idx-56) + 3.5;
            iy = 4;
        } else if(idx<62) {
            ix = 16*(idx-60) + 7.5;
            iy = 5;
        } else {
            ix = 32*(idx-62) + 15.5;
            iy = 6;
        }

        return {ix: ix, iy: iy};
    }
    var make_boxplot = function(d, idx) {

        var child_svg = svg.append('g')
            .attr('transform', function() {
                var ixy = idx_to_ixy(idx);
                var ix = ixy.ix;
                var iy = ixy.iy;

        var yoff = 100;
                var dx = ix * (cell_width + cell_buffer);
                var dy = iy * (cell_height + cell_buffer) - yoff;
                return 'translate('
                    + dx.toString()
                    + ','
                    + dy.toString() + ')';
            });

        //var wl = d.whisker_low;
        //var wh = d.whisker_high;
        //
        var wl = d.whisker_low90;
        var wh = d.whisker_high90;

        //var wl = d.whisker_low95;
        //var wh = d.whisker_high95;

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
                set_game_text(d);
            });


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
            .attr('fill', '#4292c6')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('cursor', 'pointer')
            .on('mouseover', set_game_text(d))
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

        var text_x = -0.2;
        child_svg.append('text')
            .text(function() {
                return d.game_name
            })
            .attr('font-size', 14)
            .attr('text-anchor', 'middle')
            .attr('opacity', function() {
                return idx>=32 ? 0.8 : 0;
            })
            .attr('x', function() {
                return x(text_x);
            })
            .attr('y', function() {
                return y(0.5);
            })
            .attr('class', 'text-'+idx.toString())
            .attr('transform', function() {
                var s = 'rotate(-90,'
                s += x(text_x).toString() ;
                s += ',';
                s += y(0.5).toString();
                s += ')';
                return s;
            })

    };

    _.forEach(games, function(d, i) {
        make_boxplot(d, i);
    })

    var prob_keys = [];
    var min_max = {};

    var listOfUsers = _.unique(_.map(users, function(u) {
        return u.user;
    }));

    setTags(listOfUsers);


    var set_user = function(d) {

//        console.log('e', d);
        idx = d.game;

//        games
        var datum = [
            {x: xbuff, y: d.pred},
            {x: 1- xbuff, y: d.pred}
        ];

        var child_svg = svg.append('g')
            .attr('transform', function() {

                var ixy = idx_to_ixy(idx);
                var ix = ixy.ix;
                var iy = ixy.iy;

        var yoff = 100;
                var dx = ix * (cell_width + cell_buffer);
                var dy = iy * (cell_height + cell_buffer) - yoff;
                return 'translate('
                    + dx.toString()
                    + ','
                    + dy.toString() + ')';

            });

        child_svg.append('path')
            .attr("d", line(datum))
            .attr("stroke", function () {
                return d.entry == 1 ? '#f16913' : '#525252' ;
            })
            // # bd0026
            .attr("stroke-width", user_stroke_width)
            .style('opacity', 0)
            .style('display', 'none')
            .attr("fill", "none")
            .attr('class', function() {
                return d.user;
            })
        ;

    };


    _.forEach(users, function(u) {
        set_user(u);
    });

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


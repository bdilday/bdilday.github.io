
// https://bl.ocks.org/mbostock/4061502


var top10 = [
    'mallorqui'
    ,'method-2-the-madness'
    ,'lavarez'
    ,'hack-a-bracket'
    ,'jeremyjames'
    ,'bayz'
    ,'nthustatistic'
    ,'magic'
    ,'glicko'
    ,'adamgilfix'
    ,'oneshiningmgf'
];

var xbuff = 0.1;

var margin = {top: 60, right: 80, bottom: 20, left: 100},
    width = 1400 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

var whisker_stroke_width = 2;
var cell_height = 400;
var cell_width = 100;
var cell_buffer = 20;
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
    console.log('set lab', d);

    svg.selectAll('#label')
        .transition()
        .duration(200)
        .text(d.user.toString());
};

function highlight_on(d) {

    k = d.user ;
    console.log('mouse k', d, k)
    var a = svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .style('opacity', 1)
        ;

    console.log('a', a);
}

function highlight_off(d) {

    k = d.user ;
    svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .attr('r', 2)
        .style('opacity', 0.0)
    ;

}

var current_selection = 'XXX';

var changeHandler = function(event, ui) {
    mouseout(current_selection);
    console.log('select!', event, ui);
    d = {user: ui.item.value}
    console.log('change handler d');
    current_selection = d;
    mouseover(d);
};

var setTags = function(availableTags) {
    $("#tags").autocomplete({
        source : availableTags,
        select : changeHandler
    })

//    $("#tags").data("ui-autocomplete")._trigger("change")

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

/****************************************/
d3.json('boxplot_rd3.json', function(indata) {

    var games = indata['games']
    var users = indata['users'];

    var make_boxplot = function(d, idx) {

        var child_svg = svg.append('g')
            .attr('transform', function() {
                var dx = idx * (cell_width + cell_buffer);
                return 'translate(' + dx.toString() + ',100)';
            });

        //var wl = d.whisker_low;
        //var wh = d.whisker_high;
        //
        var wl = d.whisker_low90;
        var wh = d.whisker_high90;

        //var wl = d.whisker_low95;
        //var wh = d.whisker_high95;

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

        // bounding box
        child_svg.append('rect')
            .attr('width', function() {
                return x(1);
            })
            .attr('height', function() {
                return y(0);
            })
            .attr('fill', 'none')
            .style('opacity', 1)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')

        ;

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
            .attr('fill', 'cornflowerblue')
        ;

        var text_x = -0.05;

        child_svg.append('text')
            .text(function() {
                return d.game_name
            })
            .attr('font-size', 16)
            .attr('text-anchor', 'middle')
            .attr('x', function() {
                return x(text_x);
            })
            .attr('y', function() {
                return y(0.5);
            })
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

    var listOfUsers = _.keysIn(users);

    setTags(listOfUsers);

    var ng = 8;
    var set_user = function(d) {

        _.forEach(users[d], function(e, isol) {

            _.forEach(_.range(ng), function(idx) {

                v = 'pca' + (idx+1).toString();
                var datum = [
                    {x: xbuff, y: e[v]},
                    {x: 1- xbuff, y: e[v]}
                ];

                var child_svg = svg.append('g')
                    .attr('transform', function() {
                        var dx = idx * (cell_width + cell_buffer);
                        return 'translate(' + dx.toString() + ',100)';
                    });

                child_svg.append('path')
                    .attr("d", line(datum))
                    .attr("stroke", function () {
                        return isol==0 ? 'red' : 'blue' ;
                    })
                    .attr("stroke-width", user_stroke_width)
                    .style('opacity', 0)
                    .attr("fill", "none")
                    .attr('class', function() {
                        return e.user;
                    })
                ;

            });

        });

    };

    _.forEach(listOfUsers, function(u) {
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
        .attr('x', 1000)
        .attr('y', 160)
        .attr('font-size', 20)
        .attr('cursor', 'pointer')
        .text('top 10')
        .attr('font-weight', 'bold')
    ;


    _.forEach(top10,function(name, i) {
        svg.append('text')
            .attr('x', 1000)
            .attr('y', 200 + i*20)
            .attr('font-size', 20)
            .attr('cursor', 'pointer')
            .text(name)
            .on('mouseover', function() {
                mouseover({user: name})
            })
            .on('mouseout', function() {
                mouseout({user: name})
            })
        ;
    });

});


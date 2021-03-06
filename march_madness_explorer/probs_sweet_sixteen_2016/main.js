

var unhighlighted_stroke_width = 0.5;
var highlighted_stroke_width = 5;

var current_selection = '';

var cell_sz = 200;
var ncell = 7;

var margin = {top: 60, right: 80, bottom: 20, left: 20},
    width = ncell*cell_sz - margin.left - margin.right,
    height = ncell*cell_sz - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 100)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

svg.append('text')
    .attr('id', 'label')
    .attr('x', 20)
    .attr('y', 620)
    .attr('text-anchor', 'start')
    .text('HIGHLIGHTED USER')
    .style('position', 'fixed')
    .style('font-size', 28)

;

var stroke_color = {1: '#6baed6', 2: '#fd8d3c' };

var yscales = {}

var y = d3.scale.linear()
        .range([height, 0])
    ;

var yaxis = d3.svg.axis()
    .orient("left")
    .scale(y);

var xscales = {};

var x = d3.scale.linear()
        .range([0, width]);

var xaxis = d3.svg.axis()
    .orient('bottom')
    .scale(x);

var voronoi = d3.geom.voronoi()
    .x(function (d) {
        //console.log('voronoi x', d, x(d.x));
        return x(d.x);
    })
    .y(function (d) {
        //console.log('voronoi y', d, y(d.y));
        return y(d.y);
    })
;
    //.clipExtent([[-margin.left, -margin.top],
    //    [width + margin.right, height + margin.bottom]]);


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
    svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .attr('r', 10)
        .attr('fill', function(d) {
            return d.entry == 1 ? 'red' : 'steelblue';
        })
        .attr('opacity', 1)
    ;

}

function highlight_off(d) {

    k = d.user ;
    svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .attr('r', 2)
        .attr('fill', 'black')
        .attr('opacity', 0.2)
    ;

}

var ncomp = 16;


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

/****************************************/
d3.json('prob_rd3_2016.json', function(indata) {
    var data = indata['data'];
    var games = indata['games'];

    console.log(data);
    var prob_keys = [];
    var min_max = {};
    _.forEach(_.range(ncomp), function(i) {
        k = 'prob' + (i+1).toString();
        min_max[k] = {min: 999, max: -999};
        prob_keys.push(k);
    });

    var listOfUsers = _.unique(_.map(data, function(d) {
        return d.user;
    }));

    setTags(listOfUsers);



    $("#tags").on( "ui-autocomplete", function(event,ui) {
        // post value to console for validation
        mouseover({user: $(this).val()});
    });

    var compute_min_max = function(data) {
        _.forEach(data, function(d) {
            _.forEach(prob_keys, function(k) {
                //      console.log(d, k, d[k]);
                min_max[k]['min'] = d[k] < min_max[k]['min'] ? d[k] : min_max[k]['min'];
                min_max[k]['max'] = d[k] > min_max[k]['max'] ? d[k] : min_max[k]['max'];

            });
        });
    };
    compute_min_max(data);
    console.log(min_max);

    _.forEach(prob_keys, function(k, i) {
        console.log('prob_keys', k, i);
        xscales[k] = d3.scale.linear().range([0, cell_sz]);
        yscales[k] = d3.scale.linear().range([cell_sz, 0]);

        xscales[k].domain([-0.02, 1.02]);
        yscales[k].domain([-0.02, 1.02]);
    });


    var make_cell = function(irow, icol) {
        var kx = 'prob' + (icol + 1).toString();
        var ky = 'prob' + (irow + 1).toString();
        var class_name = 'circle' + '-' + kx + '-' + ky;
        var xoffset = (icol - 1) * cell_sz;
        var yoffset = irow * cell_sz;

        svg.selectAll('.' + class_name)
            .data(data)
            .enter()
            .append('circle')
            .attr('class', function (d) {
                return class_name + ' ' + d.user + ' ' + d.user + '-' + d.entry
            })
            .attr('cx', function (d) {
                return xscales[kx](d[kx]) + xoffset;
            })
            .attr('cy', function (d) {
                return yscales[ky](d[ky]) + yoffset;
            })
            .attr('r', 2)
            .attr('fill', 'black')
            .attr('opacity', 0.2)
            .on('mouseover', function (d, i) {
                mouseover(d);
            })
            .on('mouseout', function (d, i) {
                mouseout(d);
            })

        svg.append('rect')
            .attr('x', xoffset)
            .attr('y', yoffset)
            .attr('width', cell_sz)
            .attr('height', cell_sz)
            .attr('fill', 'None')
            .attr('stroke', 'black')
        ;

        if ( (irow === icol-1) ) {

            svg.append('text')
                .attr('x', xoffset)
                .attr('y', yoffset + cell_sz / 2)
                .attr('transform', 'rotate(-90,'
                + xoffset.toString() + ','
                + (yoffset + cell_sz / 2).toString() + ')')
                .text(games[ky])
                .attr('text-anchor', 'middle')
            ;
        };

        if (irow==0) {
            svg.append('text')
                .attr('x', xoffset + cell_sz / 2)
                .attr('y', yoffset)
                .attr('transform', 'rotate(0,'
                + (xoffset + cell_sz / 2).toString() + ','
                + (yoffset).toString() + ')')
                .text(games[kx])
                .attr('text-anchor', 'middle')
            ;
        }

    }


    for(irow=0; irow<=ncell; irow++) {
        for(icol=irow+1; icol<=ncell; icol++) {
            make_cell(irow, icol);
        };
    };

    var mapped_data = [];
    _.forEach(data, function(d) {
        _.forEach(prob_keys, function (ky, icol) {
            _.forEach(prob_keys, function (kx, irow) {

                var xoffset = (icol - 1) * cell_sz;
                var yoffset = irow * cell_sz;
                var tx = xscales[kx](d[kx]) + xoffset;
                var ty = yscales[ky](d[ky]) + yoffset;
                mapped_data.push({x: tx, y: ty, k: d.user, n: d.entry});
            });
        });
    });

    //var nested_data =
    //    _.map(
    //        d3.nest()
    //            .key(function (d) {
    //                var k = d.y.toFixed(3) + ',' + d.x;
    //             //   console.log('k', k);
    //                return k;
    //            })
    //            .rollup(function (v) {
    //                return v[0];
    //            })
    //            .entries(mapped_data), function(d) {
    //      return d.values;
    //        }
    //    );


    //var vdata = voronoi(nested_data);
    //
    //var vpaths = svg.selectAll("path")
    //    .data(vdata)
    //    .enter()
    //    .append("path")
    //    .attr("d", function (d, i) {
    //        //console.log('d', d, i);
    //            return "M" + d.join("L") + "Z";
    //    })
    //    .datum(function (d) {
    //        return d.point;
    //    })
    //    .style("stroke", "black")
    //    .style("stroke-width", 0.5)
    //    .style("opacity", 0.5)
    //    .style("fill", "white")
    //    .on("mouseover", function (d) {
    //          //  console.log('mouseover d', d);
    //            mouseover(d);
    //    })
    //    .on("mouseout", function (d) {
    //            mouseout(d);
    //    })
    //;




});


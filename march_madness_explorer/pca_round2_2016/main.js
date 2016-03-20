

var unhighlighted_stroke_width = 0.5;
var highlighted_stroke_width = 5;


var cell_sz = 200;
var ncell = 7;

var margin = {top: 20, right: 80, bottom: 20, left: 20},
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
    .attr('x', 100)
    .attr('y', 700)
    .text('blah')

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

    k = d.user + '-' + d.entry;
    console.log('mouse k', d, k)
    svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .attr('r', 10)
        .attr('fill', 'red')
        //.attrr
    ;

}

function highlight_off(d) {

    k = d.user + '-' + d.entry;
    svg.selectAll('.' + k)
        .transition()
        .duration(200)
        .attr('r', 2)
        .attr('fill', 'grey')
    ;

}

var ncomp = 16;

/****************************************/
d3.json('pca_rd2_2016.json', function(data) {

    console.log(data);
    var pca_keys = [];
    var min_max = {};
    _.forEach(_.range(ncomp), function(i) {
        k = 'pca' + (i+1).toString();
        min_max[k] = {min: 999, max: -999};
        pca_keys.push(k);
    });

    var compute_min_max = function(data) {
        _.forEach(data, function(d) {
            _.forEach(pca_keys, function(k) {
                //      console.log(d, k, d[k]);
                min_max[k]['min'] = d[k] < min_max[k]['min'] ? d[k] : min_max[k]['min'];
                min_max[k]['max'] = d[k] > min_max[k]['max'] ? d[k] : min_max[k]['max'];

            });
        });
    };
    compute_min_max(data);
    console.log(min_max);

    _.forEach(pca_keys, function(k, i) {
        console.log('pca_keys', k, i);
        xscales[k] = d3.scale.linear().range([0, cell_sz]);
        yscales[k] = d3.scale.linear().range([cell_sz, 0]);

        xscales[k].domain([min_max[k]['min'], min_max[k]['max']]);
        yscales[k].domain([min_max[k]['min'], min_max[k]['max']]);
    });


    var make_cell = function(irow, icol) {
        var kx = 'pca' + (irow+1).toString();
        var ky = 'pca' + (icol+1).toString();
        var class_name = 'circle' + '-' + kx + '-' + ky;
        var xoffset = (icol-1)*cell_sz;
        var yoffset = irow*cell_sz;

        svg.selectAll('.' + class_name)
            .data(data)
            .enter()
            .append('circle')
            .attr('class', function(d) {
                return class_name + ' ' + d.user + '-' + d.entry
            })
            .attr('cx', function(d) {
                return xscales[kx](d[kx]) + xoffset;
            })
            .attr('cy', function(d) {
                return yscales[ky](d[ky]) + yoffset;
            })
            .attr('r', 2)
            .on('mouseover', function(d, i) {
                mouseover(d);
            })
            .on('mouseout', function(d, i) {
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

    }


    for(irow=0; irow<=ncell; irow++) {
        for(icol=irow+1; icol<=ncell; icol++) {
            make_cell(irow, icol);
        };
    };

    var mapped_data = [];
    _.forEach(data, function(d) {
        _.forEach(pca_keys, function (ky, icol) {
            _.forEach(pca_keys, function (kx, irow) {

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


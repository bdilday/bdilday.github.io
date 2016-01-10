/**
 * Created by bdilday on 12/29/15.
 */

//    var $ = require('jquery');

var margin = {
    top: 80, right:100, left:100, bottom: 0
};
var height = 1200;
var width = 800;

var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
;

var x = d3.scale.linear()
    .range([0,200])
    .domain([0,100])
    ;

d3.json('concentric_circle_war.json', function(data) {
    console.log(data);

    function addCircle(container, radius, x, y, alpha) {
        var group = container.append("g")
            .attr("class", "circle-container")
            .attr("transform", "translate(" + x + ", " + y + ")");

        function rotate(alpha) {
            group.transition()
                .duration(1000000)
                .ease("linear")
                .attrTween("transform", function (d, i, a) {
                    return function (t) {
                        var rotation = t * 36000 * alpha;
                        return "translate(" + x + ", " + y + ") rotate(" + String(rotation) + ")";
                    };
                })
            //             .each("end", rotate(r));
        };
        rotate(alpha);

        group.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", radius)
            .style("fill", "none")
            .style("stroke", "steelblue")
            .style('opacity', 0);

        group.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", radius)
            .attr("y2", 0)
            .style("stroke", "steelblue");

        group.append
        return group;
    }

    var x_buffer = 100;
    var y_buffer = 100;

    var d = data[0];
    var i = 1;

    var ncol = 16;

    var addPlayer = function(d, i) {

        var c1 = addCircle(svg, d.nyear, (i%ncol)*x_buffer, parseInt(i/ncol)*y_buffer, d.war/d.nyear); // centered
        var c2 = addCircle(c1, 14, d.nyear, 0, d.w7/7); // offset by 1st circle's radius
        var c3 = addCircle(c2, 6, 14, 0, d.w3/3); // offset by 2nd circle's radius
    }

    _.forEach(_.range(200), function(i) {
        addPlayer(data[i], i);
    })

})
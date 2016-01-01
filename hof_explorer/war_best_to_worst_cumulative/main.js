var median_multiplier = 0;

var full_names = {};

var unhighlighted_stroke_width = 0.5;
var highlighted_stroke_width = 5;
var maxyear = 27;
var margin = {top: 80, right: 20, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

var stroke_color = {0: '#6baed6', 1: '#fd8d3c'};
var stroke_color_highlight = {0: '#6baed6', 1: '#fd8d3c'};

var lines = {};

var median_values = {};

var ydom = median_multiplier === 1 ? [-10, 10] : [-5, 18];
var y = d3.scale.linear()
        .domain(ydom)
        .range([height, 0])
    ;

var yaxis = d3.svg.axis()
    .orient("left")
    .scale(y);

var ydom_cum = median_multiplier === 1 ? [-10, 10] : [-5, 200];
var ycum = d3.scale.linear()
    .range([height, 0])
    .domain(ydom_cum);

var yaxis_cum = d3.svg.axis()
    .orient("left")
    .scale(ycum);

var x = d3.scale.ordinal()
        .rangeRoundBands([0, width, 1])
        .domain(_.map(_.range(maxyear+2), function (d) {
            return d + 1;
        })
    )
    ;

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

var rx = {};

var setLabel = function (d) {
    svg.selectAll(".line-text1")
        .text(full_names[d.k]);
    ;
};

function highlight_on(d) {

    lines[d.k]
        .transition()
        .duration(50)
        .style("stroke-opacity", 1)
        .style("stroke-width", highlighted_stroke_width)
        .style("stroke", stroke_color[d.c])
    ;
}

function highlight_off(d) {
    lines[d.k]
        .transition()
        .duration(50)
        .style("stroke-opacity", 1)
        .style("stroke-width", unhighlighted_stroke_width)
        .style("stroke", stroke_color[d.c])
    ;
}

var interpolate_type = 'linear';
var line = d3.svg.line()
    .x(function (d) {
        return x(d.x);
    })
    .y(function (d) {
        return y(d.y);
    })
    .interpolate(interpolate_type);


//var update_graph(state) {
//    ;
//}


var players = [];
var ndata = {};
var ndata_cum = {};

var rerender = function(state) {

    var nd_copy = state === 'cum' ? ndata_cum : ndata;


    lines[playerid]
        .transition()
        .duration(500)
        .attr('d', line(t))
        .style('opacity', 1);

    ;

}


/**********************************/
var main = function(state) {

    if (state === 'cum') {
        y = ycum;
    }


    /******************************************/
      d3.csv('combined.csv', function (data) {

          players = _.uniq(data, function (d) {
              return d.playerid;
          });


          var iscurrent = {};
          _.forEach(players, function (d) {
              ndata[d.playerid] = [];
              ndata_cum[d.playerid] = [];
          });

          full_names = {};
          _.forEach(data, function (d, i) {

              ndata[d.playerid].push(+d.war);
              var cur = 0.0;
              _.forEach(ndata[d.playerid], function (e) {
                  cur += d3.max([parseFloat(e), 0]);
              });

              ndata_cum[d.playerid].push(cur);
              // ndata[d.playerid].push(+d.war);

              full_names[d.playerid] = d.namefull;
              iscurrent[d.playerid] = d.current_candidate;
          });

          var nd_copy = state === 'cum' ? ndata_cum : ndata;

              _.forEach(nd_copy, function (v, k) {
                  var len = v.length;
                  var last = v[v.length-1];
                  _.forEach(_.range(maxyear - len), function () {
                      if (state === 'cum') {
                          v.push(last);
                      } else {
                          v.push(-1);
                      }
                  })
              })
              ;


          console.log('nd_copy', nd_copy);
          maxyear = 0;
          _.forEach(nd_copy, function (v, k) {
              var i = v.length;
              maxyear = Math.max(i, maxyear);
          })

          var min_max = {};
          var idata = {};
          _.forEach(_.range(maxyear), function (i) {
              idata[i] = [];
              return min_max[i] = {min: 9999, max: -9999};
          });

          var compute_min_max = function (nd_copy) {

              _.forEach(nd_copy, function (v, k) {

                  _.forEach(nd_copy[k], function (d, i) {


                      if (+iscurrent[k] === 0) {

                          var d_no_0 = d3.max([d, 0]);

//                    idata[i].push(d);

                          idata[i].push(d_no_0);

                          if (d < min_max[i]['min']) {
                              min_max[i]['min'] = d;
                          }
                          if (d > min_max[i]['max']) {
                              min_max[i]['max'] = d;
                          }
                      }

                  });
              });
          };
          compute_min_max(nd_copy);

          _.forEach(_.range(maxyear), function (i) {
              idata[i].sort(function (a, b) {
                  return a - b;
              });

              median_values[i] = {
                  lower: d3.quantile(idata[i], 0.25),
                  median: d3.median(idata[i]),
                  upper: d3.quantile(idata[i], 0.75)
              };

          });

          _.forEach(median_values, function (v, k) {
              console.log(k, v.lower, v.median, v.upper);
          });

          console.log('medians', median_values);

          _.forEach(min_max, function (v, k) {
              rx[k] = d3.scale.linear()
                  .range([height, 0])
                  .domain([v['min'], v['max']])
          });

          var data_points = [];
          var s = _.sum(median_values, function (d) {
              return d.median > 0 ? d.median : 0;
          });
          console.log('s', s);

          var mapped_data = [];
          _.forEach(nd_copy, function (v, k) {
              _.forEach(nd_copy[k], function (d, i) {
                  mapped_data.push(
                      {
                          y: d - median_multiplier * median_values[i].median,
                          x: i + 1,
                          k: k,
                          v: v
                      });
              });
          });

          svg.selectAll('.median-box')
              .data(_.map(median_values, function (v, k) {
                  return v;
              }))
              .enter()
              .append('rect')
              .attr('class', 'median-box')
              .attr('width', function (d, i) {
                  console.log('box w', x(2), x(1), x(2) - x(1));
                  return x(2) - x(1);
              })
              .attr('height', function (d, i) {
                  console.log('box h', d.upper, d.lower, y(d.upper - d.lower));
                  return y(d.lower) - y(d.upper);
              })
              .attr('transform', function (d, i) {
                  var dx = x(i + 1) - 0.5 * (x(2) - x(1));
                  var dy = y(d.upper);
                  var t = 'translate(' + dx + ',' + dy + ')';
                  console.log('box transform', dx, dy,
                      d.lower, y(d.lower), d.upper, y(d.upper), height, t);
                  return t;
              })
              .attr('fill', 'white')
              .attr('stroke', 'black')
              .attr('stroke-width', 2)
              .attr('opacity', 0.5)
          ;

          var nested_data =
              _.map(
                  d3.nest()
                      .key(function (d) {
                          var k = d.y.toFixed(3) + ',' + d.x;
                          //   console.log('k', k);
                          return k;
                      })
                      .rollup(function (v) {
                          return v[0];
                      })
                      .entries(mapped_data), function (d) {
                      return d.values;
                  }
              );


          var vdata = voronoi(nested_data);

          var vpaths = svg.selectAll("path")
                  .data(vdata)
                  .enter()
                  .append("path")
                  .attr("d", function (d, i) {
                      //console.log('d', d, i);
                      return "M" + d.join("L") + "Z";
                  })
                  .datum(function (d) {
                      return d.point;
                  })
                  .style("stroke", "black")
                  .style("stroke-width", 0)
                  .style("opacity", 0)
                  .style("fill", "white")
                  .on("mouseover", function (d) {
                      //  console.log('mouseover d', d);
                      mouseover(d);
                  })
                  .on("mouseout", function (d) {
                      mouseout(d);
                  })
              ;


          var make_path = function (playerid) {

              var t0 = _.map(nd_copy[playerid], function (d, i) {
                  //return {x: d, y: i+1};
                  return {y: 0, x: i + 1};
              });

              var t = _.map(nd_copy[playerid], function (d, i) {
                  //return {x: d, y: i+1};
                  return {
                      y: d - median_multiplier * median_values[i].median,
                      x: i + 1
                  };
              });


              //console.log('t', t);
              lines[playerid] = svg.append("path")
                  .attr("d", line(t0))
                  .attr("stroke", function () {
                      return stroke_color[iscurrent[playerid]];
                  })
                  .attr("stroke-width", unhighlighted_stroke_width)
                  .style('opacity', 1)
                  .attr("fill", "none")
                  .attr('id', function () {
                      return 'path-' + playerid;
                  })
                  .attr("class", "player-path " + playerid)
                  .on("mouseover", function (d) {
                      mouseover({k: playerid, c: iscurrent[playerid]});
                  })
                  .on("mouseout", function (d) {
                      mouseout({k: playerid, c: iscurrent[playerid]});
                  });

              lines[playerid]
                  .transition()
                  .duration(500)
                  .attr('d', line(t))
                  .style('opacity', 1);

              ;

          };


          _.forEach(nd_copy, function (v, k) {
              //  console.log('make_path for ', k);
              make_path(k);
          });


          var median_line = _.map(median_values, function (d, i) {
              return {x: +i + 1, y: d.median * (1 - median_multiplier)};
          });


          svg.append("path")
              .attr("d", line(median_line))
              .attr("stroke", function () {
                  return "black"; //bat_hue(k);
              })
              .attr("stroke-width", "1.5")
              .attr("fill", "none")
          ;


          var cur = [];
          _.forEach(data, function (d, i) {
              //console.log('cur', d)
              if (+d.current_candidate === 1) {
                  cur.push(d.playerid);
              }
          });

          cur = _.uniq(cur);

          console.log('cur', cur);

          if (state === 'cum') {
              svg.append("g")
                  .attr("class", "axis")
                  .call(yaxis_cum)
                  .append("text")
                  .style("text-anchor", "middle")
                  .attr("y", -9)
                  .text('WAR')
                  .attr('transform', 'translate(0,' + 0 + ')')
              ;
          } else {
              svg.append("g")
                  .attr("class", "axis")
                  .call(yaxis)
                  .append("text")
                  .style("text-anchor", "middle")
                  .attr("y", -9)
                  .text('WAR')
                  .attr('transform', 'translate(0,' + 0 + ')')
              ;
          }

          svg.append("g")
              .attr("class", "axis")
              .attr('transform', 'translate(0,' + y(0) + ')')
              .call(xaxis)
              .append("text")
              .style("text-anchor", "middle")
              .attr("y", -9)
              .text('Nth')
              .attr('transform', 'translate(-40, 20)')
          ;

          var player_anchor_offset = 0;
          svg.append("text")
              .attr("class", "line-text1")
              .attr("x", width - 0.5 * width)
              .attr("y", player_anchor_offset)
              .attr("font-size", 14)
              .attr('text-anchor', 'middle')
              .text("BLAHBLAHBLAH")
          ;

          var buf = 12;
          svg.selectAll('.player-hook')
              .data(cur)
              .enter()
              .append('text')
              .attr('class', 'player-hook')
              .attr('id', function (d) {
                  return 'player-hook-' + d;
              })
              .attr('x', width - 10)
              .attr('y', function (d, i) {
                  return player_anchor_offset + buf * (i + 1);
              })
              .attr("font-size", 10)
              .text(function (d, i) {
                  return full_names[d];
              })
              .attr('text-anchor', 'end')
              .on("mouseover", function (d) {
                  d3.select(this)
                      .style('font-size', 14)
                      .style('font-weight', 'bold')
                      .style('fill', stroke_color[1]);
                  mouseover({k: d, c: 1});
              })
              .on("mouseout", function (d) {
                  d3.select(this)
                      .style('font-size', 10)
                      .style('font-weight', 'normal')
                      .style('fill', 'black');

                  mouseout({k: d, c: 1});
              })
              .attr('cursor', 'pointer')
          ;

          //svg.append('text')
          //    .attr('state', 'state-option')
          //    .attr('id', 'state-1')
          //    .attr('x', state_option_x)
          //    .attr('y', 10)
          //    .attr('font-size', state_option_font_size)
          //    .attr('font-weight', 'bold')
          //    .text('year-to-year')
          //    .attr('cursor', 'pointer')
          //    .on('click', function() {
          //        console.log('click!');
          //        option_click(d3.select('#state-1'), d3.select('#state-2'));
          //        main('X');
          //    })
          //;
          //
          //svg.append('text')
          //    .attr('state', 'state-option')
          //    .attr('id', 'state-2')
          //    .attr('x', state_option_x)
          //    .attr('y', 25)
          //    .attr('font-size', state_option_font_size)
          //    .attr('font-weight', 'normal')
          //    .text('cummulative')
          //    .attr('cursor', 'pointer')
          //    .on('click', function() {
          //        option_click(d3.select('#state-2'), d3.select('#state-1'));
          //        main('cum');
          //    })
          //;

      });

};


var state = 'cum';

main(state);
var margin = { top: 20, right: 20, bottom: 150, left: 40 };
var width = 1000 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var bar_graph_svg_height = 400 - margin.top - margin.bottom;

var options = {
  nodeWidth: 15,
  nodePadding: 4,
  sinksRight: true,
  iterations: 10
};

var draw = function(element, data_path) {
  d3.json(data_path).then(function(graph) {
    var cluster_pred_mean = graph.cl_pred_mean || {};
    var feature_names = graph.feature_names || [];
    var cluster_prototypes = graph.clusters;
    var number_variables = cluster_prototypes["0_1"].length;
    console.log(number_variables);

    var ymin = 99999,
      ymax = -99999;
    for (cl_key in cluster_prototypes) {
      for (cl_datum_key in cluster_prototypes[cl_key]) {
        cl_datum = cluster_prototypes[cl_key][cl_datum_key];
        //                    console.log(cl_datum);
        ymin = Math.min(ymin, cl_datum.var_value);
        ymax = Math.max(ymax, cl_datum.var_value);
      }
      console.log();
    }

    console.log("ys", ymin, ymax);

    console.log("data", graph);
    console.log("element", element);

    function handleMouseover(d) {
      console.log(d.name);
      console.log(cluster_prototypes[d.name]);

      svg1
        .selectAll(".bars")
        .data(cluster_prototypes[d.name])
        .transition()
        .attr("y", function(d) {
          console.log("y", d.var_value, bars_y_scale(d.var_value));
          return bars_y_scale(Math.max(d.var_value, 0));
        })
        .attr("height", function(d) {
          // console.log("height", d.var_value, height, bars_y_scale(d.var_value), height - bars_y_scale(d.var_value))
          return Math.abs(bars_y_scale(d.var_value) - bars_y_scale(0));
        })
        .style("fill", "steelblue");

      var pred_mean = cluster_pred_mean["cl_" + d.name];
      svg1
        .select("#themean")
        .transition()
        .text(d.name + ": " + pred_mean.toFixed(4).toString());
    }

    var bar_graph_width = Math.round(0.6 * width);

    var x_domain = [...Array(number_variables).keys()];
    console.log(x_domain);

    var bars_x_scale = d3
      .scaleBand()
      .rangeRound([0, bar_graph_width])
      .domain(x_domain)
      .padding(0.1);

    var bars_y_scale = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([ymin, ymax]);
    var svg1 = d3
      .select(element)
      .append("svg")
      .attr("width", bar_graph_width + margin.left + margin.right)
      .attr("height", bar_graph_svg_height + margin.top)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg1
      .append("text")
      .attr("id", "themean")
      .attr("x", 20)
      .attr("y", 15)
      .text("PLACEHOLDER");

    var bar_graph = svg1
      .append("g")
      .selectAll(".bars")
      .data(cluster_prototypes["0_1"])
      .enter()
      .append("rect")
      .attr("class", "bars")
      .attr("x", function(d) {
        return bars_x_scale(d.var_idx);
      })
      .attr("y", function(d) {
        return bars_y_scale(Math.max(d.var_value, 0));
      })
      .attr("height", function(d) {
        return Math.abs(bars_y_scale(d.var_value) - bars_y_scale(0));
      })
      .attr("width", bars_x_scale.bandwidth())
      .style("fill", "red");

    svg1
      .append("g")
      .attr("transform", "translate(0," + bars_y_scale(0) + ")")
      .call(
        d3.axisBottom(bars_x_scale).tickFormat(function(d, i) {
          return feature_names[i];
        })
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg1.append("g").call(d3.axisLeft(bars_y_scale));

    var svg = d3
      .select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sankey_fn = d3.sankey;
    var sankey = sankey_fn()
      .nodeWidth(options.nodeWidth)
      .nodePadding(options.nodePadding)
      .size([width, height]);

    var path = sankey.link();

    var links = graph.links;
    var nodes = graph.nodes;

    sankey
      .nodes(nodes)
      .links(links)
      .layout(options.iterations);

    var link = svg
      .append("g")
      .selectAll(".link")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke", function(d) {
        return (d.color = "steelblue");
        //color(d.name.replace(/ .*/, ""));
      })
      .style("stroke-width", function(d) {
        return Math.max(1, d.dy);
      })
      .sort(function(a, b) {
        return b.dy - a.dy;
      });

    link.append("title").text(function(d) {
      return "title";
      //d.source.name + " → " +
      //  d.target.name + "\n" + format(d.value);
    });

    var node = svg
      .append("g")
      .selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(
        d3
          .drag()
          .subject(function(d) {
            return d;
          })
          .on("start", function() {
            this.parentNode.appendChild(this);
          })
          .on("drag", dragmove)
      );

    function get_color(d) {
      var key = "cl_" + d.name;
      var col = d3.interpolateInferno(cluster_pred_mean[key] || 0);
      return col;
    }

    node
      .append("rect")
      .attr("height", function(d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
        return (d.color = get_color(d)); //"steelblue";
      })
      .on("mouseover", handleMouseover)
      .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function(d) {
        return; //d.name + "\n" + format(d.value);
      });

    node
      .append("text")
      .attr("x", -6)
      .attr("y", function(d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) {
        return d.name;
      })
      .filter(function(d) {
        return d.x < width / 2;
      })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    function dragmove(d) {
      d3.select(this).attr(
        "transform",
        "translate(" +
          d.x +
          "," +
          (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
          ")"
      );
      sankey.relayout();
      link.attr("d", path);
    }

    function init_exemplars(exemplar_key) {
      var ex_data = graph.exemplars[exemplar_key];
      
      console.log(ex_data);
      console.log(ex_data.length);
      var table = d3.select("#container").append("table");
      var header = table.append("thead").append("tr");
      header
        .selectAll("th")
        .data(ex_data[0])
        .enter()
        .append("th")
        .text(function(d) {
          return d;
        });

      var tablebody = table.append("tbody");
      
    //   rows = tablebody
    //     .selectAll("tr")
    //     .data(myArray)
    //     .enter()
    //     .append("tr");
    //   // We built the rows using the nested array - now each row has its own array.
    //   cells = rows
    //     .selectAll("td")
    //     // each row has data associated; we get it and enter it for the cells.
    //     .data(function(d) {
    //       console.log(d);
    //       return d;
    //     })
    //     .enter()
    //     .append("td")
    //     .text(function(d) {
    //       return d;
    //     });
    }

  //  init_exemplars("0_1");
  });
};

var el = "div#container";
draw(el, "cluster_graph_exemplars_winequality.json");

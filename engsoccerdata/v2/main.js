

d3.json('englandFB.json', function(ndata) {

    var k = 'AFC Bournemouth';
    var data = _.map(ndata[k].slice(0, 10), function(d) {
        return {'y': d.iy, 'x': d.ix};
    });

    console.log('data', data);

// we scale the height of our bars using d3's linear scale
    var hscale = d3.scale.linear()
        .domain([0,100])
        .range([0, 3]);

    var xscale = d3.scale.linear()
        .domain([0, 10000])
        .range([10, 100])
        ;
// we select the scene object just like an svg
var scene = d3.select("a-scene");

// we use d3's enter/update/exit pattern to draw and bind our dom elements
var bars = scene.selectAll("a-box.bar").data(data);
bars.enter().append("a-box").classed("bar", true);

// we set attributes on our cubes to determine how they are rendered
bars.attr({
    position: function(d,i) {
        // cubes are positioned by their center so we
        // offset for their height
        var y = 2 + hscale(d.y)/2;
        var x = 0;//xscale(d.x);
        var z = -10;//xscale(d.x);
        return x + " " + y + " " + z
    },
    rotation: function(d,i) {
        var x = 0;
        var z = 0;
        var y = 20;
        return x + " " + y + " " + z
    },
    width: function(d) { return 0.5},
    depth: function(d) { return 0.9},
    height: function(d) { return hscale(d.y)},
    opacity: function(d,i) { return 0.6 },
    //metalness: function(d,i) { return i/data.length}
})
    .on("click", function(d,i) {
        console.log("click", i,d)
    })
    .on("mouseenter", function(d,i) {
        // this event gets fired continuously as long as the cursor
        // is over the element. we only want trigger our animation the first time
        if(this.hovering) return;
        console.log("hover", i,d)
        this.hovering = true;
        d3.select(this).transition().duration(1000)
            .attr({
                metalness: 0.5,
                width: 2
            })
    })
    .on("mouseleave", function(d,i) {
        console.log("leave",i,d)
        this.hovering = false;
        d3.select(this).transition()
            .attr({
                metalness: 0,
                width: 0.5
            })
    })

});
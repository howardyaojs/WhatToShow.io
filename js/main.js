
function transitionToRadialTree() {

    var nodes = radialtree.nodes(root), // recalculate layout
        links = radialtree.links(nodes);
    
    vis.transition().duration(duration)
        .attr("transform", "translate(" + (width/2) + "," +
                                          (height/2) + ")");
        // set appropriate translation (origin in middle of svg)
    
    vis.selectAll(".link").data(links)
        .transition()
        .duration(duration)
//        .style("stroke", "#fc8d62")
        .attr("d", radialDiagonal); //get the new radial path

    vis.selectAll(".node").data(nodes)
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        });
    
   vis.selectAll("circle")
        .transition()
        .duration(duration)
//        .style("stroke", "#984ea3")
    ;
    
};

function transitionToTree() {
    
    var nodes = tree.nodes(root), //recalculate layout
        links = tree.links(nodes);

    vis.transition().duration(duration)
        .attr("transform", "translate(30,0)");
        
    vis.selectAll(".link").data(links)
        .transition()
        .duration(duration)
//        .style("stroke", "#e78ac3")
        .attr("d", diagonal); // get the new tree path

   vis.selectAll(".node").data(nodes)
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });
    
    vis.selectAll("circle")
        .transition()
        .duration(duration)
//        .style("stroke", "#377eb8")
    ;
    
    vis.selectAll(".Rotated").data(nodes)
       .transition()
       .duration(duration)
       .attr("transform", "rotate(0)translate(0)");
    
//    vis.selectAll("g.node text").data(nodes)
//       .transition()
//       .duration(duration)
//       .attr("fill", function(d){return color(d.name);});
    
    

};

var diameter = 900;

var 
//    margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = diameter,
    height = diameter;

var w = 900,
    h = 900,
    rx = w / 2,
    ry = h / 2,
    m0,
    rotate = 0;
    
var i = 0,
    duration = 350,
    root;

var color = d3.scale.ordinal()
  .domain(["1", "2", "3","4", "5", "6","10"])
  .range(["#4B7E75", "#FFBB7E" , "#549972","#FCAAA8", "#A3C8B3" , "#F27052","#EDEDED"]);

var radialtree = d3.layout.tree()
    .size([360, diameter / 2 -100])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var tree = d3.layout.tree()
    .size([height +100, width - 160]);

var radialDiagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var diagonal = d3.svg.diagonal()
    .projection(function (d) {
    return [d.y, d.x];
});

//var zoomListener = d3.behavior.zoom()
//  .scaleExtent([0.1, 3])
//  .on("zoom", zoomHandler);

var svg = d3.select("body").append("svg")
    .attr("width", width + 100)
    .attr("height", height + 200)
//  .append("g")
//    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")")
;

var vis = svg.append("svg:svg")
    .attr("width", width+100)
    .attr("height", height+200)
  .append("svg:g")
    .attr("transform", "translate(" + rx + "," + ry + ")");

//vis.append("svg:path")
//    .attr("class", "arc")
//    .attr("d", d3.svg.arc().innerRadius(ry - 120).outerRadius(ry).startAngle(0).endAngle(2 * Math.PI))
//    .on("mousedown", mousedown);

//root = pubs;
//

//
////root.children.forEach(collapse); // start with all children collapsed
//update(root);

d3.json('data/data.json', function(error,treeData){
    root = treeData;
//    root.x0 = height / 2;
//    root.y0 = 0;
   

root.x0 = height / 2;
root.y0 = 0;
update(root);

function update(source) {


  // Compute the new tree layout.
  var nodes = radialtree.nodes(root),
      links = radialtree.links(nodes);

  // Normalize for fixed-depth.
//  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); })
  ;

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("name", function(d){return d.name;})
//      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
     .attr("name",function(d){return d.name;})
//      .attr("r", 1e-6)
//      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
      .attr("r", function(d){
        if(d.group == "10"){
        return 2/(d.level*d.level)*5; 
      }else{
        return 8/(d.level*d.level)*5;}
      })
      .style("fill",function(d){return d._children ? "#fff" : color(d.group)  ; })
      .style("stroke", function(d){return color(d.group); });

  nodeEnter.append("text")
      .attr("class", function(d){return d.x <180 ? "NoRotate" : "Rotated";})
      .attr("x", function(d){
            if(d.level == 1){return 45;}else{return 10;}
            })
      .attr("dy", function(d){
            if( (d.level == 4 || (d.level == 3 && d.group == "3" )) || (d.level == 4 || (d.level == 3 && d.group == "5" )) ){
            return "0.35em";
            }else if(d.level == 1){return "0.15em"; }else
            {return "1.35em"; }
            })
      .attr("text-anchor", "start")
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(0)translate(0)"; })
      .text(function(d) { return d.name.split(" ")[0]; })
      .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});
    
    nodeEnter.append("text")
      .attr("class", function(d){return d.x <180 ? "NoRotate" : "Rotated";})
      .attr("x", function(d){
            if(d.level == 1){return 45;}else{return 10;}
            })
      .attr("dy", function(d){
            if( (d.level == 4 || (d.level == 3 && d.group == "3" )) || (d.level == 4 || (d.level == 3 && d.group == "5" )) ){
            return "0.35em";
            }else if(d.level == 1){return "1.15em"; }else
            {return "2.35em"; }
            })
      .attr("text-anchor", "start")
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(0)translate(0)"; })
      .text(function(d) { return d.name.split(" ")[1]; })
      .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});
    
    nodeEnter.append("text")
      .attr("class", function(d){return d.x <180 ? "NoRotate" : "Rotated";})
      .attr("x", 10)
      .attr("dy", function(d){
            if(d.level != 4){
            return "3.35em";
            }else{return "0.35em"; }
            })
      .attr("text-anchor", "start")
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(0)translate(0)"; })
      .text(function(d) { return d.name.split(" ")[2]; })
      .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

  nodeUpdate.select("circle")
      .attr("r", function(d){
      if(d.group == "10"){
        return 6/(d.level*d.level)*5; 
      }else{
        return 8/(d.level*d.level)*5; 
      }})
      .style("fill", function(d) { return d._children ? "#fff" : color(d.group)  ; });
  

  nodeUpdate.selectAll("g.node text")
//      .style("opacity", function(d){
//        if(d.name !="Strength"){return 1;}else{return 0;}
//      })
      .style("opacity",1)
      .attr("transform", function(d) { 
      if(d.level != 1){
//        return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length +70)  + ")"; 
//      }else{
          return d.x < 180 ? "translate(0)" : "rotate(0)translate(0)";
      }else{return "rotate(180)translate(-85)"; }
    })
//        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});

  // TODO: appropriate transform
  var nodeExit = node.exit().transition()
      .duration(duration)
//      .attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", function(d){return 8/(d.level*d.level)*5; });

  nodeExit.selectAll("text")
      .attr("transform", function(d) { 
    //      if(d.dy != "2.35em"){
    //        return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length +70)  + ")"; 
    //      }else{
              return d.x < 180 ? "translate(0)" : "rotate(0)translate(0)";
    //      }
        })
      .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(links, function(d) { return 4/d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("name",function(d){return d.target.name;})
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return radialDiagonal({source: o, target: o});
      })
  .style("stroke", function(d){return color(d.target.group);});

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", radialDiagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return radialDiagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  } 
  
  update(d);
}

// Collapse nodes
function collapse(d) {
  if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}



function zoomHandler() {
//  vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
//zoomListener(vis);

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

function mouse(e) {
  return [e.pageX - rx, e.pageY - ry];
}

function mousedown() {
//  m0 = mouse(d3.event);
//  d3.event.preventDefault();
}

function mousemove() {
//  if (m0) {
//    var m1 = mouse(d3.event),
//        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI,
//        tx = "translate3d(0," + (ry - rx) + "px,0)rotate3d(0,0,0," + dm + "deg)translate3d(0," + (rx - ry) + "px,0)";
//    svg
//        .style("-moz-transform", tx)
//        .style("-ms-transform", tx)
//        .style("-webkit-transform", tx);
//  }
}

function mouseup() {
//  if (m0) {
//    var m1 = mouse(d3.event),
//        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI,
//        tx = "rotate3d(0,0,0,0deg)";
//
//    rotate += dm;
//    if (rotate > 360) rotate -= 360;
//    else if (rotate < 0) rotate += 360;
//    m0 = null;
//
//    svg
//        .style("-moz-transform", tx)
//        .style("-ms-transform", tx)
//        .style("-webkit-transform", tx);
//
//    vis
//        .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
//      .selectAll("g.node text")
//        .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -85; })
////        .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
//        .attr("transform", function(d) { 
////        if(d.level != 1){
//        return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; 
////    }
////        else {return "rotate(180)translate(35)"; }
//        });
//  }
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}



$("#tree").click(function(){
      transitionToTree();   
      
})
$("#radialtree").click(function(){
      transitionToRadialTree();   
})

});









var margin = {top: 20, right: 30, bottom: 20, left: 40},
    width = 1560 - margin.right - margin.left,
    height = 760 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var color = d3.scale.ordinal()
  .domain([1, 2, 3, 4, 5 ])
  // .range(["#37597B", "#6C5C7B" , "#BF6D85","#F47482", "#37597b","#BDBDBD"]);
  .range(["#581845","#900C3F","#C70029","#FF5733","#FFC300","#d3d3d3"]);

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/data_backup.json", function(error, data) {
  if (error) throw error;

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;

  update(root);
});

//d3.select(self.frameElement).style("height", "1200px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 270; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", function(d){
        if(d.group == "10"){
        return 2/(d.level*d.level)*5; 
      }else{
        return 8/(d.level*d.level)*5;}
      })
      .style("fill",function(d){ 
      if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ){
            return "#BDBDBD";
      }else{
      return d._children ? "#fff" : color(d.level)  ; 
      }
     })
      .style("stroke", function(d){
        if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ){
            return "#BDBDBD";
      }else{
      return d._children ? "#fff" : color(d.level)  ; 
      }
     });

  nodeText = nodeEnter.append("text")
      .attr("x", function(d) {
            if(d.level == 1 ){
              return 45;
            }else if(d.level == 2){
              return 20
            }else{
              return d.children || d._children ? 10 : 30;
            }
            })
//      .attr("dy", function(d){
//                    if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats"  ){
//                    return "0.35em";
//                    }else if(d.name == "Professional Development" || d.name == "Information Dissemination"){return d.children || d._children ?  "1.5em" : "0em"; }else 
//                    {return d.children || d._children ? "-1.5em" : "0em"; }
//                    })
       .attr("dy","0.3em")
       .style("fill", function(d){ 
//      if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ){
//            return "#BDBDBD";
//            }else
//            {
                return color(d.level); 
//            }
            })
//      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .attr("text-anchor", "start")
      .text(function(d) { return d.name; })
      .style("font-weight", function(d) {return d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ? "" : "bold";})
      .style("font-size", function(d){return 12 + 4/d.level*3 +"px";});

  nodeEnter.append("image")
      .attr("xlink:href", function (d) {
        if(d.children || d._children) {
         return ; 
        }else{
          return "https://cdn2.iconfinder.com/data/icons/bitsies/128/Info-128.png"; 
        }
      })
      .attr("width", "14px")
      .attr("height", "14px")
      .attr("x", "10px")
      // .attr("x", function (d) {
      //    return d.name.length/1.5  + "em"; 
      // })
      .attr("y", "-10px")
      .on("mouseenter", function (d) {
        if(d.group == 10){
         d3.select(this)
           .transition()
           .attr("xlink:href", function (d) {
              return d.img; 
           })
           .attr("height","450px")
           .attr("width","450px")
        }else{
         d3.select(this)
           .transition()
           .attr("xlink:href", function (d) {
              return d.img; 
           })
           .attr("height","150px")
           .attr("width","150px");
        }
      })
      .on("mouseleave", function (d) {
         d3.select(this)
           .transition()
           .attr("xlink:href", function (d) {
              if(d.children || d._children) {
               return ; 
              }else{
                return "https://cdn2.iconfinder.com/data/icons/bitsies/128/Info-128.png"; 
              }
            })
           .attr("height","14px")
           .attr("width","14px");
      });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", function(d){
      if(d.group == "10"){
        return 6/(d.level*d.level)*5; 
      }else{
        return 8/(d.level*d.level)*5; 
      }})
      .style("fill", function(d) { return d._children ? "#fff" : color(d.level)  ; });

  nodeUpdate.select("text")
//          .attr("dy", function(d){
//                    if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats"  ){
//                    return "0.35em";
//                    }else if(d.name == "Professional Development" || d.name == "Information Sedimentation"){return d.children || d._children ?  "1.5em" : "0em"; }else 
//                    {return d.children || d._children ? "-1.5em" : "0em"; }
//                    })
//        .attr("dy","0em")
       .style("fill", function(d){ 
      if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ){
            return "BDBDBD";
            }else
            {return color(d.level); }
            })
//      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";})
  ;

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", function(d){return 8/(d.level*d.level)*5; });

  nodeExit.select("text")
//          .attr("dy", function(d){
//                    if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats"  ){
//                    return "0.35em";
//                    }else if(d.name == "Professional Development" || d.name == "Information Sedimentation"){return d.children || d._children ?  "1.5em" : "0em"; }else 
//                    {return d.children || d._children ? "-1.5em" : "0em"; }
//                    })
       .style("fill", function(d){ 
      if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ){
            return "#BDBDBD";
            }else
            {return color(d.level); }
            })
//      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";})
  ;

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
      .style("stroke", function(d){
        if( d.name == "Strengths" || d.name == "Weaknesses" || d.name == "Opportunities" || d.name == "Threats" ){
            return "#BDBDBD";
        }
      })
      .style("opacity", 0.7)
      .style("z-index",-100);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
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


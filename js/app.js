var app = angular.module('App',[]);

app.controller('mainController',['$scope','$http', function($scope,$http){
    $http.get('data/data.json').success(function(response){
        $scope.data = response;
        render();
    });
    
    var render = function(){
        var width = 1000,
            height = 1000;
        var diameter = 800;
        var duration = 1000,
            rx = width/2,
            ry = height/2,
            m0,
            rotate = 0,
            i = 0;

        $scope.transitionToRadialTree = function() {

            var nodes = radialTree.nodes(root), // recalculate layout
                links = radialTree.links(nodes);

            svg.transition().duration(duration)
                .attr("transform", "translate(" + (width/2) + "," +
                                                  (height/2) + ")");
                // set appropriate translation (origin in middle of svg)

            link.data(links)
                .transition()
                .duration(duration)
//                .style("stroke", "#fc8d62")
                .attr("d", radialDiagonal); //get the new radial path

            node.data(nodes)
                .transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });

            node.select("circle")
                .transition()
                .duration(duration)
//                .style("stroke", "#984ea3")
            ;

        };


        $scope.transitionToTree = function() {

            var nodes = tree.nodes(root), //recalculate layout
                links = tree.links(nodes);

            svg.transition().duration(duration)
                .attr("transform", "translate(40,0)");

            link.data(links)
                .transition()
                .duration(duration)
//                .style("stroke", "#e78ac3")
                .attr("d", diagonal); // get the new tree path

            node.data(nodes)
                .transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            node.select("circle")
                .transition()
                .duration(duration)
//                .style("stroke", "#377eb8")
            ;

        };

        var tree = d3.layout.tree()
            .size([height, width - 160]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
            return [d.y, d.x];
        });

        var radialTree = d3.layout.tree()
            .size([360, diameter / 2 ])
            .separation(function(a, b) {
                return (a.parent == b.parent ? 1 : 2) / a.depth;
            });

        var radialDiagonal = d3.svg.diagonal.radial()
            .projection(function(d) {
                return [d.y, d.x / 180 * Math.PI];
            });
        
        var color = d3.scale.ordinal()
                      .domain(["1", "2", "3","4", "5", "6","10"])
                      .range(["#4B7E75", "#FFBB7E" , "#549972","#FCAAA8", "#A3C8B3" , "#F27052","#EDEDED"]);
        
         var root = $scope.data;

      $scope.update = function(source){
        var svg = d3.select("#chart1").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + rx + "," + ry + ")");
           
         var nodes = radialTree.nodes(root),
             links = radialTree.links(nodes);
        
            var node = svg.selectAll("g.node")
                          .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
            var nodeEnter = node.enter().append("g")
                                .attr("class", "node")
                                .attr("name", function(d){return d.name;})
                        //      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
                                .on("click", click);
        
                 nodeEnter.append("circle")
                             .attr("name",function(d){return d.name;})
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
                              .attr("x", 10)
                              .attr("dy", "1.35em")
                              .attr("text-anchor", "start")
                              .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-85)"; })
                              .text(function(d) { return d.name ; })
                              .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
                              .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});
        
                    var nodeUpdate = node.transition()
                                          .duration(duration)
                                          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

                        nodeUpdate.select("circle")
                                          .attr("r", function(d){
                                          if(d.group == "10"){
                                            return 2/(d.level*d.level)*5; 
                                          }else{
                                            return 8/(d.level*d.level)*5; 
                                          }})
                                          .style("fill", function(d) { return d._children ? "#fff" : color(d.group)  ; });
        
                      
                      nodeUpdate.selectAll("g.node text")
                                  .style("opacity",1)
                                  .attr("transform", function(d) { 
                                  if(d.level != 1){
                                      return d.x < 180 ? "translate(0)" : "rotate(180)translate(-85)";
                                  }else{return "rotate(180)translate(-85)"; }
                                })
                                  .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
                                  .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});
        
        
                   var nodeExit = node.exit().transition()
                                          .duration(duration)
                                          .remove();

                           nodeExit.select("circle")
                                      .attr("r", function(d){return 8/(d.level*d.level)*5; });

                           nodeExit.selectAll("text")
                                      .attr("transform", function(d) { 
                                              return d.x < 180 ? "translate(0)" : "rotate(180)translate(-85)";
                                        })
                                      .style("fill", function(d){ if(d.group != "10") {return color(d.group)} else {return "black"}; })
                                      .style("font-size", function(d){return 10 + 4/d.level*2 +"px";});
        
        
                    var link = svg.selectAll("path.link")
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
      
      $scope.update($scope.data);
      
              function click(d) {
                  if (d.children) {
                    d._children = d.children;
                    d.children = null;
                  } else {
                    d.children = d._children;
                    d._children = null;
                  } 

                  $scope.update(d);
                }

        // Collapse nodes
            function collapse(d) {
              if (d.children) {
                  d._children = d.children;
                  d._children.forEach(collapse);
                  d.children = null;
                }
            }
      

/////////////////////////////////////////////////////////////////////////////////


    
    };
}]);
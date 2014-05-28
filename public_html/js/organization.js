/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var loadOrganizationData = function() {
    dataForRect = []; 
    processedData = {"types":{"Fiduciary": [], "C-Level": [],"OperationalDelivery": [], "Facilities": [], "highly": []},  
                    "project":[], "connection": [], "notes": [], "relations": [] };
    
     var w = 1200, h = 700;
     var textHeight = 20;
    d3.json("/data/data.json", function(error, json) {
        if(error)
            return console.warn("Error: " + error );
        
        organizationData = json;
        
        drawGraph();
    });
    
    var drawGraph = function() {
       
        svg = d3.select("#mainDiv")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h);
        
        processData();
        createDataArray();
        console.log(dataForRect);
        
        drawRectangles();
        drawNames();
        drawLegend();
        drawRelations();
    };
    
    var drawRelations = function() {
        var lineGroup = svg.append("svg:g")
                .attr("id", "lines");
        
        for(i in processedData.relations) {
            var rel = processedData.relations[i];
            var oursID = replaceSpace(rel.Us);
            var theirsID = replaceSpace(rel.Them);
            var ours = d3.select("#"+oursID);
            var theirs = d3.select("#"+theirsID);
            var oursPoint = {x:0, y:0};
            var oursData = d3.select("#"+oursID).data()[0];
            var theirsData = d3.select("#"+theirsID).data()[0];
            oursPoint.x = toInt(oursData.x) + toInt($("#"+oursID).width());
            oursPoint.y = toInt(oursData.y) + textHeight * (toInt(ours.attr("index"))+2) - textHeight/4;
           
            console.log(oursPoint);
            var theirsPoint = {x:0, y:0};
            theirsPoint.x = toInt(theirsData.x);
            theirsPoint.y = toInt(theirsData.y) + textHeight * (toInt(theirs.attr("index"))+2) - textHeight/4;

           
            
            var line = lineGroup.append("line")
                    .attr("x1", oursPoint.x)
                    .attr("y1", oursPoint.y)
                    .attr("x2", theirsPoint.x)
                    .attr("y2", theirsPoint.y)
                    .attr("style", "stroke-width:1;stroke:black;");
            if(rel.Strength === "Strong") {
                line.attr("stroke-dasharray", "5, 5");
            }
                    
           
        }
        
        var fudiciaryBottomPoint = middleBottomPoint("Fiduciary");
        var cLevelTopPoint = middleTopPoint("C-Level");
        lineGroup.append("line")
                    .attr("x1", fudiciaryBottomPoint.x)
                    .attr("y1", fudiciaryBottomPoint.y)
                    .attr("x2", cLevelTopPoint.x)
                    .attr("y2", cLevelTopPoint.y)
                    .attr("style", "stroke-width:1;stroke:black;");
            
        var cLevelBottomPoint = middleBottomPoint("C-Level");
        var facTopPoint = middleTopPoint("Facilities");
        lineGroup.append("line")
                    .attr("x1", cLevelBottomPoint.x)
                    .attr("y1", cLevelBottomPoint.y)
                    .attr("x2", facTopPoint.x)
                    .attr("y2", facTopPoint.y)
                    .attr("style", "stroke-width:1;stroke:black;");
            
        var highlyPoint = middleRightPoint("highly");
        var operationalPoint = middleLeftPoint("OperationalDelivery");
        lineGroup.append("line")
                    .attr("x1", highlyPoint.x)
                    .attr("y1", highlyPoint.y)
                    .attr("x2", operationalPoint.x)
                    .attr("y2", operationalPoint.y)
                    .attr("style", "stroke-width:1;stroke:black;");
    };
    
    var middleBottomPoint = function(id) {
        var rect = d3.select("#"+id).select("rect");
        
        return {x: toInt(rect.attr("x")) + toInt(rect.attr("width")/2), y: toInt(rect.attr("y")) + toInt(rect.attr("height"))};
    };
    
    var middleTopPoint = function(id) {
        var rect = d3.select("#"+id).select("rect");
        return {x: toInt(rect.attr("x")) + toInt(rect.attr("width")/2), y: toInt(rect.attr("y"))};
    };
    
    var middleRightPoint = function(id) {
        var rect = d3.select("#"+id).select("rect");
        return {x: toInt(rect.attr("x")) + toInt(rect.attr("width")), y: toInt(rect.attr("y")) + toInt(rect.attr("height"))/2};
    };
    
    var middleLeftPoint = function(id) {
        var rect = d3.select("#"+id).select("rect");
        return {x: toInt(rect.attr("x")), y: toInt(rect.attr("y")) + toInt(rect.attr("height"))/2};
    };
    
    var toInt = function(input) {
      return parseInt(input);  
    };
    
    var drawLegend = function() {
        var legend = d3.select("#legend");
        var legendRect = legend.select("rect");
        var legendText = legend.select("text");
        legendText.append("tspan")
                .text("\tDecision Maker")
                .attr("class", "DecisionMaker personname")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        legendText.append("tspan")
                .text("\tA person with decision making")
                .attr("class", "personname");
        legendText.append("tspan")
                .text("\tpower who can advance your goals")
                .attr("class", "personname")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        legendText.append("tspan")
                .text("\t")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        
        legendText.append("tspan")
                .text("\tNavigator")
                .attr("class", "Navigator personname")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        legendText.append("tspan")
                .text("\tA person who can guide you through")
                .attr("class", "personname");
        legendText.append("tspan")
                .text("\tthe organization.")
                .attr("class", "personname")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        legendText.append("tspan")
                .text("\t")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        
        legendText.append("tspan")
                .text("\tChampion")
                .attr("class", "Champion personname")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        legendText.append("tspan")
                .text("\tA person with leadership level influence")
                .attr("class", "personname");
        legendText.append("tspan")
                .text("\twho wants you to win.")
                .attr("class", "personname")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
        legendText.append("tspan")
                .text("\t")
                .attr("x", legendRect.attr("x"))
                .attr("dy", textHeight)
                .attr("text-anchor", "start");
                
    };
    
    var processData = function() {
      var people = organizationData.People;
      for(var index in people) {
          var thisPerson = people[index];
          var type = replaceSpace(thisPerson.Type);
          processedData.types[type].push(thisPerson);
      }  
      
      processedData.project = organizationData.Partners.slice(0);
      processedData.notes = organizationData.Notes;
      
      var ourNames = [];
      var relations = organizationData.Relationships;
      processedData.relations = relations;
      for(var i in relations) {
          var thisRel = relations[i];
          if(ourNames.indexOf(thisRel.Us) === -1) {
              ourNames.push(thisRel.Us);
          }
      }
      processedData.connection = ourNames;
    };
    
    var drawNames = function() {
        for(var key in processedData.types) {
            var arr = processedData.types[key];
            if(arr.length > 0) {
                  var rect = d3.select("#"+key).select("rect");
                  var startingX = rect.attr("x");
                  for(var eachIndex in arr) {
                      var thisName = arr[eachIndex];
                      var thisId = replaceSpace(thisName.Name);
                      var additionalClass = "";
                      if(thisName.Role === "Champion" ) {
                          additionalClass = " Champion";
                      } else if(thisName.Role === "Decision Maker") {
                          additionalClass = " DecisionMaker";;
                      } else if(thisName.Role === "Navigator") {
                          additionalClass = " Navigator";
                      }
                      d3.select("#"+key)
                          .select("text")
                          .append("tspan")
                          .text("\t" + thisName.Name+ ", " + thisName.Title)
                          .attr("dy", textHeight)
                          .attr("x",startingX)
                          .attr("id", thisId)
                          .attr("text-anchor", "start")
                          .attr("class", "personname"+additionalClass)
                          .attr("index", eachIndex);
                      
                  }
                  
            }
        }
        
        var connection = d3.select("#connection");
        var connText = connection.select("text");
        var connRect = connection.select("rect");
        for(var ourIndex in processedData.connection) {
            var ourPerson = processedData.connection[ourIndex];
            var thisPersonId = replaceSpace(ourPerson);
            connText.append("tspan")
                .text("\t" + ourPerson)
                .attr("dy", textHeight)
                .attr("x",connRect.attr("x"))
                .attr("id", thisPersonId)
                .attr("text-anchor", "start")
                .attr("class", "personname")
                .attr("index", ourIndex);
        }
         
          var initX = d3.select("#project").select("text").attr("x");
          d3.select("#project text")
                  .append("tspan")
                  .text("Project Participants")
                  .attr("dy", textHeight)
                  .attr("x",initX);
          
          var rectX = d3.select("#project").select("rect").attr("x");
          var project = d3.select("#project text");
          for(key in processedData.project) {
              var thisPartner = processedData.project[key];
              project.append("tspan")
                      .text("\t" + thisPartner)
                      .attr("dy", textHeight)
                      .attr("x", rectX)
                      .attr("id", replaceSpace(thisPartner))
                      .attr("text-anchor", "start")
                      .attr("class", "personname");
              ;
          }
          
          var notesRectangle = d3.select("#notes").select("rect").attr("x");
          var notesLines = processedData.notes.split("</p><p>");
          var notesNode = d3.select("#notes text");
          for(eachIndex in notesLines) {
              var thisNote = notesLines[eachIndex];
              thisNote = thisNote.replace(/<\/?p>/g, "");
              notesNode.append("tspan")
                    .text("\t" + thisNote)
                    .attr("dy", textHeight)
                    .attr("x", notesRectangle)
                    .attr("text-anchor", "start")
                    .attr("class", "personname");
          }
//          d3.select("#notes text").append("tspan")
//                  .text("\t");
    };
    
    var replaceSpace = function(input) {
        input = input.replace("'", "");
        return input.replace(/\s+/g, '');
    };
    
    var drawRectangles = function() {
       
        
        var groups = svg.selectAll("g")
                .data(dataForRect)
                .enter()
                .append("g")
                .attr("id", function(d, index) {return d.id});
        
        groups.append("rect")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("rx", 20)
            .attr("ry", 20)
            .attr("fill", "white")
            .attr("stroke", "black");
    
        groups.append("text")
            .attr("width", function(d) { return d.width; })
            .attr("height", textHeight)
            .attr("x", function(d) { return (d.width)/2 + d.x; })
            .attr("y", function(d) { return d.y + 20; })
            .attr("text-anchor", "middle")
            .attr("class", "heading")
            .append("tspan")
            .text(function(d) {return d.name; });
        
    };
    
    var createDataArray = function() {
        var initialX = 10;
        var initialY = 20;
        var smallBoxWidth = 0.2 * w;
        var smallBoxHeight = 1/7 * h;
        var bigBoxWidth = 0.4 * w;
        var gapBetweenBoxes = (1/30) * w;
       
        
        //Project Delivery 0
        makeDataObject("Project Delivery Partners", "project" , initialX, initialY, smallBoxWidth * 1.6 , smallBoxHeight );
        
        //Fudiciary 1
        var projectDeliveryRight = getRightCordinateForRect(0);
        makeDataObject("Fiduciary", "Fiduciary" , projectDeliveryRight.x + gapBetweenBoxes, projectDeliveryRight.y, bigBoxWidth, smallBoxHeight);
        
        //C-Level 2
        var fudiciaryBottomLeft =  getBottomLeftCordinateForRect(1);
        makeDataObject("C-Level", "C-Level" , fudiciaryBottomLeft.x, fudiciaryBottomLeft.y + gapBetweenBoxes, bigBoxWidth, smallBoxHeight);
        
        //Highly Integrated 3
        var cLevelBottomLeft = getBottomLeftCordinateForRect(2);
        makeDataObject("Highly Integrated", "highly" , initialX + gapBetweenBoxes, cLevelBottomLeft.y + gapBetweenBoxes, bigBoxWidth, smallBoxHeight);
        
        //Operational Delivery 4
        var highlyTopLeft = getRightCordinateForRect(3);
        makeDataObject("Operational Delivery", "OperationalDelivery", highlyTopLeft.x + gapBetweenBoxes * 2, highlyTopLeft.y, bigBoxWidth, smallBoxHeight);
        
        //Our Connections 5
        var highlyBottomLeft = getBottomLeftCordinateForRect(3);
        makeDataObject("Our Connections", "connection",  initialX, highlyBottomLeft.y + gapBetweenBoxes, smallBoxWidth, smallBoxHeight);
        
        //Notes 6
        var fudiciaryTopRight =  getRightCordinateForRect(1); 
        makeDataObject("Notes","notes" , fudiciaryTopRight.x + gapBetweenBoxes, fudiciaryTopRight.y, smallBoxWidth, smallBoxHeight*2 + gapBetweenBoxes); 
      
        //Facilities 7
        var ourTopRight = getRightCordinateForRect(5);
        makeDataObject("Facilities", "Facilities", ourTopRight.x + gapBetweenBoxes, ourTopRight.y, bigBoxWidth, smallBoxHeight);
        
        //Legend
        var facilitiesTopRight = getRightCordinateForRect(7);
        makeDataObject("Legend", "legend" , facilitiesTopRight.x + gapBetweenBoxes, facilitiesTopRight.y, smallBoxWidth * 1.5, smallBoxHeight * 2);
    };
    
    function getRightCordinateForRect(index) {
        var thisPoint = dataForRect[index];
        return {x: thisPoint.x + thisPoint.width, y: thisPoint.y};
    }
    
    function getBottomLeftCordinateForRect(index) {
        var thisPoint = dataForRect[index];
        return {x: thisPoint.x, y: thisPoint.y + thisPoint.height};
    }
    
    function makeDataObject(name,id,  x, y, width, height) {
        var object = {};
        object.x = x;
        object.y = y;
        object.width = width;
        object.height = height;
        object.id = id;
        object.name = name;
        dataForRect.push(object);
    }
};
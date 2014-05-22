/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var loadOrganizationData = function() {
    var dataForRect = []; 
    processedData = {"types":{"Fiduciary": [], "C-Level": [],"OperationalDelivery": [], "Facilities": [], "highly": []},  
                    "project":[], "connection": [], "notes": [] };
    var svg;
     var w = 1200, h = 700;
     var textHeight = 20;
    d3.json("http://connectionplanner.apiary-mock.com/orgchart/1", function(error, json) {
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
        
    };
    
    var processData = function() {
      var people = organizationData.People;
      for(index in people) {
          var thisPerson = people[index];
          var type = thisPerson.Type.replace(/\s+/g, '');
          processedData.types[type].push(thisPerson);
      }  
      
      processedData.project = organizationData.Partners.slice(0);
    };
    
    var drawNames = function() {
        var key;
        for(key in processedData.types) {
            var arr = processedData.types[key];
            if(arr.length > 0) {
                  var rect = d3.select("#"+key).select("rect");
                  var startingX = rect.attr("x");
                  var startingY = rect.attr("y") + textHeight * 2;
                  for(eachIndex in arr) {
                      var thisName = arr[eachIndex];
                      var thisId = thisName.Name.replace(/\s+/g, '');
                      d3.select("#"+key)
                          .select("text")
                          .append("tspan")
                          .text("\t" + thisName.Name+ ", " + thisName.Title)
                          .attr("dy", textHeight)
                          .attr("x",startingX)
                          .attr("id", thisId)
                          .attr("text-anchor", "start")
                          .attr("class", "personname");
                  }
                  
            }
        }
        
//        var 
//        for(key in processedData.Partners) {
//            var thisPartner = processedData.Partners[key];
//            
//        }
    };
    
    var drawRectangles = function() {
      for(index in dataForRect)  {
          var eachRect = dataForRect[index];
          
          var group = svg.append("svg:g")
                  .attr("id", eachRect.id);
          
          group.append("rect")
                  .attr("width", eachRect.width)
                  .attr("height", eachRect.height)
                  .attr("x", eachRect.x)
                  .attr("y", eachRect.y)
                  .attr("rx", 20)
                  .attr("ry", 20)
                  .attr("fill", "white")
                  .attr("stroke", "black");
          
          group.append("text")
                  .attr("width", eachRect.width)
                  .attr("height", textHeight)
                  .attr("x", (eachRect.width)/2 + eachRect.x)
                  .attr("y", eachRect.y + 20)
                  .attr("text-anchor", "middle")
                  .attr("class", "heading")
                  .append("tspan")
                  .text(eachRect.name);
      } 
    };
    
    var createDataArray = function() {
        var initialX = 10;
        var initialY = 20;
        var smallBoxWidth = 0.2 * w;
        var smallBoxHeight = 1/7 * h;
        var bigBoxWidth = 0.4 * w;
        var gapBetweenBoxes = (1/30) * w;
       
        
        //Project Delivery 0
        makeDataObject("Project Delivery Partners", "project" , initialX, initialY, smallBoxWidth , smallBoxHeight );
        
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
        makeDataObject("Legend", "legend" , facilitiesTopRight.x + gapBetweenBoxes, facilitiesTopRight.y, smallBoxWidth, smallBoxHeight * 2);
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
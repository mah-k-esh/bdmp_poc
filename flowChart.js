var graph;

function main(flowChartJSON){

	console.log("makekaka");
	console.log(flowChartJSON);
	flowChartJSON[flowChartJSON.length] = {"name":"end","child":[]};
	console.log("makekaka");

	flowChartJSON = {
		"Approve_PO": ["What is the process to check before approval?:test", "Who does this task?:test"],
		"Create_PO":["How the PO was completed?:Automated", "Who will approve the PO?:test", "Who will prepare the PO?:test"],
		"Send_PO":["How do you send PO?:Mail", "Who send the PO to Vendor?:test"]
	};


	//construct the data//

	//construct the data//

	console.log("MAKE:  ");
	console.log(flowChartJSON);
	console.log("MAKE: ");
	// Checks if the browser is supported
	container = document.getElementById("flowChartSVG");
	$("#textData").css("display","none");
	$("#flowChart").css("display","block");
	$(".nextQuestion").css("display","none");
	$(".questionGroup").css("display","none");
	

	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is not supported.
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else
	{
		/// Disables the built-in context menu
		//mxEvent.disableContextMenu(container);
		
		// Creates the graph inside the given container
		graph = createGraph(container);


		// Enables rubberband selection
		new mxRubberband(graph);
		


		//////////makesh collapse //////////

		/////////makesh collapase /////////




		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		var parent = graph.getDefaultParent();
						
		// Adds cells to the model in a single step
		graph.getModel().beginUpdate();

		//Adding the start and end node



		try
		{
			//Draw Vertex//
			// for(var obj in flowChartJSON){
			// 	//  if( flowChartJSON.hasOwnProperty(obj) ) {
			// 		var datalist = flowChartJSON[obj];
			// 			var v3 = graph.insertVertex(parent, null, obj , ((vertextCount*150)+((vertextCount-1)*50)) , 135, 120, 80);
						
			// 			graph.insertVertex(parent, null, obj , ((vertextCount*150)+((vertextCount-1)*50)) , vertextCount*135, 120, 80);



			// 		// }
			// 		vertexArray.push(v3);
			// 		vertextCount++;
					
			// }
			//Draw Vertex//

			//Draw edge//
			// for(intr = 2; intr < vertexArray.length; intr++){
			// 	if(intr == 2){
			// 		var e1 = graph.insertEdge(parent, null, '', vertexArray[0], vertexArray[2]);
			// 		continue;
			// 	}
			// 	if(intr == vertexArray.length-1){
			// 		var e1 = graph.insertEdge(parent, null, '', vertexArray[vertexArray.length-1], vertexArray[1]);
			// 	}
			// 	var e1 = graph.insertEdge(parent, null, '', vertexArray[intr-1], vertexArray[intr]);
			// }
			//Draw edge//

		}
		finally
		{
			// Updates the display
			graph.getModel().endUpdate();
		}
	}
};



function mainNew(data){


	// data[data.length] = {"name":"end","child":[]};

	var container = document.getElementById("flowChartSVG");
	$("#textData").css("display","none");
	$("#flowChart").css("display","block");
	$(".nextQuestion").css("display","none");
	$(".questionGroup").css("display","none");

    //var container = document.getElementById("flowchart");

    if(graph != null){
        graph.destroy();
    }

	graph = createGraph(container);

    globalX=1,globalY=1;

    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    
    nodesForEdge = [];

    function recursiveNode(nodeArray,depth){

        for(node in nodeArray){
            //draw the node
            console.log(nodeArray[node]["hide"]+" -- -- --"+nodeArray[node]["name"]);
            if(nodeArray[node]["hide"] == undefined){
				console.log(nodeArray[node].name+"-- ("+globalX+" : "+depth+")");
				
				var t_width=180,t_height=50;
				var v_width = 180,v_height=50;
				nodeStyle = "";
				if(nodeArray[node].name == "start" || nodeArray[node].name == "end"){
					nodeStyle = "shape=ellipse;"
					v_width = v_height; 
				}

                v1 = graph.insertVertex(parent, nodeArray[node].name, nodeArray[node].name, globalX*t_width*1.5, depth*t_height*2, v_width, v_height,nodeStyle);

				//TEST//
				//graph.updateCellSize(v1);
				//TEST//

                nodeArray[node].node = v1;


                if(nodeArray[node].child.length > 0){
                    //it has child

                    ////add controls////
                    var imageExpandCollapse = new mxImage('/images/collapse.png', 10, 10);;

                    if(nodeArray[node]["collapse"]){
                        imageExpandCollapse = new mxImage('/images/expand.png', 10, 10);
                        console.log("inside expand ");
                    }

                    var overlay = new mxCellOverlay(imageExpandCollapse, 'expand-collapse');
                    overlay.cursor = 'hand';
                    overlay.align = mxConstants.ALIGN_CENTER;
                    const node_final = nodeArray[node];
                    overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
                        {
                            console.log("its being clicked "+sender);
                            console.log(node_final);

                            //update the data//
                            if(node_final.collapse){
                                node_final.collapse = undefined;
                            }else{
                                node_final.collapse = true;
                            }
                            

                            for(i=0;i<node_final.child.length;i++){

                                if(node_final.child[i].hide){
                                    node_final.child[i].hide = undefined;
                                }else{
                                    node_final.child[i].hide = true;
                                }
                                

                            }

                            mainNew(data);
                            //update the data//

                        }));
                        
                    graph.addCellOverlay(v1, overlay);
                    ////add controls////
                }

                recursiveNode(nodeArray[node].child,depth+1);
                globalX++;   
            }

        }
        //reset the Y
        //globalY=0;
        depth = globalY;
    }

    recursiveNode(data,globalY);


    queue = [];
    queue[queue.length] = data;
    while(queue.length != 0){
        curNode = queue.pop();
        //console.log("array is: "+curNode.toString());
        for(i=0;i<curNode.length;i++){
            if(i+1 < curNode.length){
                from = curNode[i];
                to = curNode[i+1];

                console.log(curNode[i]["name"]+" -- "+curNode[i+1]["name"]);
                graph.insertEdge(parent, null, '', curNode[i]["node"], curNode[i+1]["node"]);
            }
            
            if(curNode[i].child.length != 0){
                console.log(curNode[i]["name"]+" --- "+curNode[i].child[0]["name"]);
                queue[queue.length] = curNode[i].child;
                graph.insertEdge(parent, null, '', curNode[i]["node"], curNode[i].child[0]["node"]);
            }
            
        }
    }

    graph.getModel().endUpdate();

}


function createGraph(container)
	{
		var graph = new mxGraph(container);
		graph.setTooltips(true);
		graph.setEnabled(false);
		
		// Disables folding
		graph.isCellFoldable = function(cell, collapse)
		{
			return false;
		};

		// Creates the stylesheet for the process display
		var style = graph.getStylesheet().getDefaultVertexStyle();
		style[mxConstants.STYLE_FONTSIZE] = 11;
		style[mxConstants.STYLE_FONTCOLOR] = 'black';
		style[mxConstants.STYLE_STROKECOLOR] = '#808080';
		style[mxConstants.STYLE_FILLCOLOR] = 'white';
		style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
		style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
		style[mxConstants.STYLE_ROUNDED] = true;
		style[mxConstants.STYLE_SHADOW] = true;
		style[mxConstants.STYLE_FONTSTYLE] = 1;

		
		
						
		style = [];
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
		style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
		style[mxConstants.STYLE_STROKECOLOR] = '#a0a0a0';
		style[mxConstants.STYLE_FONTCOLOR] = '#606060';
		style[mxConstants.STYLE_FILLCOLOR] = '#E0E0DF';
		style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
		style[mxConstants.STYLE_STARTSIZE] = 30;
		style[mxConstants.STYLE_ROUNDED] = false;
		style[mxConstants.STYLE_FONTSIZE] = 12;
		style[mxConstants.STYLE_FONTSTYLE] = 0;
		style[mxConstants.STYLE_HORIZONTAL] = false;
		// To improve text quality for vertical labels in some old IE versions...
		style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#efefef';

		graph.getStylesheet().putCellStyle('swimlane', style);
		
		style = [];
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
		style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
		style[mxConstants.STYLE_STROKECOLOR] = '#91BCC0';
		style[mxConstants.STYLE_FONTCOLOR] = 'gray';
		style[mxConstants.STYLE_FILLCOLOR] = '#91BCC0';
		style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
		style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
		style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
		style[mxConstants.STYLE_FONTSIZE] = 16;
		graph.getStylesheet().putCellStyle('step', style);
		
		style = [];
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
		style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
		style[mxConstants.STYLE_FONTCOLOR] = 'gray';
		style[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
		style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
		style[mxConstants.STYLE_STROKECOLOR] = '#A0C88F';
		style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
		style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
		style[mxConstants.STYLE_FONTSIZE] = 16;
		style[mxConstants.STYLE_SPACING] = 10;
		style[mxConstants.STYLE_OVERFLOW] = "hidden";
		graph.getStylesheet().putCellStyle('start', style);
		
		style = mxUtils.clone(style);
		style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
		style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
		graph.getStylesheet().putCellStyle('end', style);
		
		return graph;
	};

//main({});
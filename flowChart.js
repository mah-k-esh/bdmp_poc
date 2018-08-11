var graph;
var outln;

var configNames = {
	"Approve_PO": "Approve Process",
	"Create_PO": "Create Process",
	"Send_PO": "Send Process"
};

var configLanes = {
	"start": "Process Manager",
	"end": "Process Manager",
	"Approve_PO": "Process Co-ordinator",
	"Create_PO": "Process Manager",
	"Send_PO": "Process Manager"
};

var configSwimLanesStyle = {

};

var configVertexStyle= {
	"Approve_PO": ";fillColor=#629fed66",
	"Create_PO": ";fillColor=#c6da5652",
	"Send_PO": ";fillColor=#c716b238"	
};

function zoomIn(){
	graph.zoomIn();
}

function zoomOut(){
	graph.zoomOut();
}

function zoomFit(){
	// $("#flowChartSVG").css("width",$("#flowChartScroll").css("width"));
	// $("#flowChartSVG").css("height",$("#flowChartScroll").css("height"));
	graph.fit();
}


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
	
	if(outln != null){
		$("#outline").html("");
	}

	graph = createGraph(container);

    globalX=1,globalY=1;

    var parent = graph.getDefaultParent();
	graph.getModel().beginUpdate();
	

	//swimlanes//
	graph.insertVertex(parent, "process", "Process", 0,0, 500, 500,'shape=swimlane;');

	//graph.insertVertex(graph.getModel().cells["process"], "others", "others", 0,0, 250, 250,'shape=swimlane;');

	for(var iter=0;iter < data.length;iter++){

		if(graph.getModel().cells[configLanes[data[iter].name]] == undefined ){

			//if(data[iter].name != "start" && data[iter].name != "end"){
				graph.insertVertex(graph.getModel().cells["process"], configLanes[data[iter].name], configLanes[data[iter].name], 0,0, 250, 250,'shape=swimlane;');
				console.log("DEBUG: "+configLanes[data[iter].name]);
			//}
		}

	}

    //graph.insertVertex(graph.getModel().cells["firstSwim"], "secondSwim", "Process Coordinator", 0,0, 250, 250,'shape=swimlane;');
    //graph.insertVertex(graph.getModel().cells["firstSwim"], "thirdSwim", "Process Manager", 0,100, 250, 250,'shape=swimlane;');
	//swimlanes//

    nodesForEdge = [];

    function recursiveNode(nodeArray,depth){

        for(node in nodeArray){
            //draw the node
			console.log(nodeArray[node]["ques"]+" -- -- --"+nodeArray[node]["ans"]);
			

			//update swimlane text//
			//graph.getModel().cells["firstSwim"].value = "makesh kumar"
			// if(nodeArray[node]["ques"] != null && nodeArray[node]["ques"] != undefined && nodeArray[node]["ques"].startsWith("Who")){
			// 	console.log("This is happendning");
			// 	graph.getModel().cells[nodeArray[node]["lane"]].value = nodeArray[node]["ans"];
			// }
			//update swimlane text//

            if(nodeArray[node]["hide"] == undefined){
				console.log(nodeArray[node].name+"-- ("+globalX+" : "+depth+")");
				
				var t_width=180,t_height=50;
				var v_width = 180,v_height=50;
				nodeStyle = "process";
				if(nodeArray[node].name == "start"){
					nodeStyle = "state"
					v_width = v_height; 
				}else if(nodeArray[node].name == "end"){
					nodeStyle = "end"
					v_width = v_height; 
				}


				// if(nodeArray[node].name == "start" || nodeArray[node].name == "end"){
				// 	v1 = graph.insertVertex(parent, nodeArray[node].name, "", globalX*t_width*1.5, depth*t_height*2, v_width, v_height,nodeStyle);
				// }else{
					
					//swimlaneT = [graph.getModel().cells["secondSwim"],graph.getModel().cells["thirdSwim"]];


					//if(nodeArray[node].lane == "Approve_PO"){

						vertexName = (configNames[nodeArray[node].name] == undefined)?nodeArray[node].name : configNames[nodeArray[node].name];
						vertexStyle = (configVertexStyle[nodeArray[node].lane] == undefined) ? "": configVertexStyle[nodeArray[node].lane];
						v1 = graph.insertVertex(graph.getModel().cells[configLanes[nodeArray[node].lane]], nodeArray[node].name, vertexName, globalX*t_width*1.5, depth*t_height*2, v_width, v_height,nodeStyle+vertexStyle);					
					//}else{
					//	v1 = graph.insertVertex(swimlaneT[0], nodeArray[node].name, nodeArray[node].name, globalX*t_width*1.5, depth*t_height*2, v_width, v_height,nodeStyle);					
					//}
					
				// }
                

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

		var config = mxUtils.load(
			'https://jgraph.github.io/mxgraph/javascript/examples/editors/config/keyhandler-commons.xml').
				getDocumentElement();
		var editor = new mxEditor(config);
		editor.setGraphContainer(container);
		graph = editor.graph;
		var model = graph.getModel();
	

		// Auto-resizes the container
		graph.border = 80;
		graph.getView().translate = new mxPoint(graph.border/2, graph.border/2);
		graph.setResizeContainer(true);
		graph.graphHandler.setRemoveCellsFromParent(false);

		var outline = document.getElementById("outline");
		outln = new mxOutline(graph, outline);

		    //style test//
				// Changes the default vertex style in-place
				var style = graph.getStylesheet().getDefaultVertexStyle();
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
				style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
				style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
				style[mxConstants.STYLE_FONTSIZE] = 11;
				style[mxConstants.STYLE_STARTSIZE] = 22;
				style[mxConstants.STYLE_HORIZONTAL] = false;
				style[mxConstants.STYLE_FONTCOLOR] = 'black';
				style[mxConstants.STYLE_STROKECOLOR] = 'black';
				delete style[mxConstants.STYLE_FILLCOLOR];

				style = mxUtils.clone(style);
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
				style[mxConstants.STYLE_FONTSIZE] = 10;
				style[mxConstants.STYLE_ROUNDED] = true;
				style[mxConstants.STYLE_HORIZONTAL] = true;
				style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
				delete style[mxConstants.STYLE_STARTSIZE];
				style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
				graph.getStylesheet().putCellStyle('process', style);
				
				style = mxUtils.clone(style);
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
				style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
				delete style[mxConstants.STYLE_ROUNDED];
				graph.getStylesheet().putCellStyle('state', style);


				style = mxUtils.clone(style);
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_DOUBLE_ELLIPSE;
				style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
				//style[mxConstants.STYLE_SPACING_TOP] = 28;
				//style[mxConstants.STYLE_FONTSIZE] = 14;
				//style[mxConstants.STYLE_FONTSTYLE] = 1;
				//delete style[mxConstants.STYLE_SPACING_RIGHT];
				graph.getStylesheet().putCellStyle('end', style);
												
				style = mxUtils.clone(style);
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
				style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
				style[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
				style[mxConstants.STYLE_SPACING_TOP] = 40;
				style[mxConstants.STYLE_SPACING_RIGHT] = 64;
				graph.getStylesheet().putCellStyle('condition', style);
								

				
				style = graph.getStylesheet().getDefaultEdgeStyle();
				style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
				style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
				style[mxConstants.STYLE_ROUNDED] = true;
				style[mxConstants.STYLE_FONTCOLOR] = 'black';
				style[mxConstants.STYLE_STROKECOLOR] = 'black';
				
				style = mxUtils.clone(style);
				style[mxConstants.STYLE_DASHED] = true;
				style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
				style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
				graph.getStylesheet().putCellStyle('crossover', style);
						
				// Installs double click on middle control point and
				// changes style of edges between empty and this value
				graph.alternateEdgeStyle = 'elbow=vertical';

    //style test//


    //other confifgs///
				// Adds automatic layout and various switches if the
				// graph is enabled
				if (graph.isEnabled())
				{
					// Allows new connections but no dangling edges
					graph.setConnectable(true);
					graph.setAllowDanglingEdges(false);
					
					// End-states are no valid sources
					var previousIsValidSource = graph.isValidSource;
					
					graph.isValidSource = function(cell)
					{
						if (previousIsValidSource.apply(this, arguments))
						{
							var style = this.getModel().getStyle(cell);
							
							return style == null || !(style == 'end' || style.indexOf('end') == 0);
						}

						return false;
					};
					
					// Start-states are no valid targets, we do not
					// perform a call to the superclass function because
					// this would call isValidSource
					// Note: All states are start states in
					// the example below, so we use the state
					// style below
					graph.isValidTarget = function(cell)
					{
						var style = this.getModel().getStyle(cell);
						
						return !this.getModel().isEdge(cell) && !this.isSwimlane(cell) &&
							(style == null || !(style == 'state' || style.indexOf('state') == 0));
					};
					
					// Allows dropping cells into new lanes and
					// lanes into new pools, but disallows dropping
					// cells on edges to split edges
					graph.setDropEnabled(true);
					graph.setSplitEnabled(false);
					
					// Returns true for valid drop operations
					graph.isValidDropTarget = function(target, cells, evt)
					{
						if (this.isSplitEnabled() && this.isSplitTarget(target, cells, evt))
						{
							return true;
						}
						
						var model = this.getModel();
						var lane = false;
						var pool = false;
						var cell = false;
						
						// Checks if any lanes or pools are selected
						for (var i = 0; i < cells.length; i++)
						{
							var tmp = model.getParent(cells[i]);
							lane = lane || this.isPool(tmp);
							pool = pool || this.isPool(cells[i]);
							
							cell = cell || !(lane || pool);
						}
						
						return !pool && cell != lane && ((lane && this.isPool(target)) ||
							(cell && this.isPool(model.getParent(target))));
					};
					
					// Adds new method for identifying a pool
					graph.isPool = function(cell)
					{
						var model = this.getModel();
						var parent = model.getParent(cell);
					
						return parent != null && model.getParent(parent) == model.getRoot();
					};
					
					// Changes swimlane orientation while collapsed
					graph.model.getStyle = function(cell)
					{
						var style = mxGraphModel.prototype.getStyle.apply(this, arguments);
					
						if (graph.isCellCollapsed(cell))
						{
							if (style != null)
							{
								style += ';';
							}
							else
							{
								style = '';
							}
							
							style += 'horizontal=1;align=left;spacingLeft=14;';
						}
						
						return style;
					};

					// Keeps widths on collapse/expand					
					var foldingHandler = function(sender, evt)
					{
						var cells = evt.getProperty('cells');
						
						for (var i = 0; i < cells.length; i++)
						{
							var geo = graph.model.getGeometry(cells[i]);

							if (geo.alternateBounds != null)
							{
								geo.width = geo.alternateBounds.width;
							}
						}
					};

					graph.addListener(mxEvent.FOLD_CELLS, foldingHandler);
				}
				
				// Applies size changes to siblings and parents
				new mxSwimlaneManager(graph);

				// Creates a stack depending on the orientation of the swimlane
				var layout = new mxStackLayout(graph, false);
				
				// Makes sure all children fit into the parent swimlane
				layout.resizeParent = true;
							
				// Applies the size to children if parent size changes
				layout.fill = true;

				// Only update the size of swimlanes
				layout.isVertexIgnored = function(vertex)
				{
					return !graph.isSwimlane(vertex);
				}
				
				// Keeps the lanes and pools stacked
				var layoutMgr = new mxLayoutManager(graph);

				layoutMgr.getLayout = function(cell)
				{
					if (!model.isEdge(cell) && graph.getModel().getChildCount(cell) > 0 &&
						(model.getParent(cell) == model.getRoot() || graph.isPool(cell)))
					{
						layout.fill = graph.isPool(cell);
						
						return layout;
					}
					
					return null;
				};

	//other configs///
	
/*
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
*/		
		
		return graph;
	};

//main({});
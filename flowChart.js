function main(flowChartJSON)
		{
			console.log(flowChartJSON);
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
				mxEvent.disableContextMenu(container);
				
				// Creates the graph inside the given container
				var graph = createGraph(container);

				// Enables rubberband selection
				new mxRubberband(graph);
				
				// Gets the default parent for inserting new cells. This
				// is normally the first child of the root (ie. layer 0).
				var parent = graph.getDefaultParent();
								
				// Adds cells to the model in a single step
				graph.getModel().beginUpdate();

				//Adding the start and end node

				//Start node
				var v1 = graph.insertVertex(parent, null, '', 0, 150, 50, 50,'shape=ellipse;');

				//End node
				var v2 = graph.insertVertex(parent, null, '', 775, 150, 50, 50,'shape=ellipse;');

				var vertexArray = [];
				vertexArray.push(v1);
				vertexArray.push(v2);
				var vertextCount = 1;

				try
				{
					//Draw Vertex
					for(var obj in flowChartJSON){
						 if( flowChartJSON.hasOwnProperty(obj) ) {
						 	var datalist = flowChartJSON[obj];
						 	var v3 = graph.insertVertex(parent, null, obj , ((vertextCount*150)+((vertextCount-1)*50)) , 135, 120, 80);
							}
							vertexArray.push(v3);
							vertextCount++;
						 
					}

					//Draw edge
					for(intr = 2; intr < vertexArray.length; intr++){
						if(intr == 2){
							var e1 = graph.insertEdge(parent, null, '', vertexArray[0], vertexArray[2]);
							continue;
						}
						if(intr == vertexArray.length-1){
							var e1 = graph.insertEdge(parent, null, '', vertexArray[vertexArray.length-1], vertexArray[1]);
						}
						var e1 = graph.insertEdge(parent, null, '', vertexArray[intr-1], vertexArray[intr]);
					}

				}
				finally
				{
					// Updates the display
					graph.getModel().endUpdate();
				}
			}
};


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
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
			style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
			style[mxConstants.STYLE_FONTCOLOR] = 'gray';
			style[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
			style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
			style[mxConstants.STYLE_STROKECOLOR] = '#A0C88F';
			style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
			style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
			style[mxConstants.STYLE_FONTSIZE] = 16;
			graph.getStylesheet().putCellStyle('start', style);
			
			style = mxUtils.clone(style);
			style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
			style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
			graph.getStylesheet().putCellStyle('end', style);
			
			return graph;
		};
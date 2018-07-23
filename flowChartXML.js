function main(flowChartJSON)
		{
			console.log(flowChartJSON);
			// Checks if the browser is supported
			container = document.getElementById("flowChartSVG");
			if (!mxClient.isBrowserSupported())
			{
				// Displays an error message if the browser is not supported.
				mxUtils.error('Browser is not supported!', 200, false);
			}
			else
			{
				// Disables the built-in context menu
				//mxEvent.disableContextMenu(container);
				
				// Creates the graph inside the given container
				//var graph = new mxGraph(container);
				// Enables rubberband selection
				//new mxRubberband(graph);
				
				// Gets the default parent for inserting new cells. This
				// is normally the first child of the root (ie. layer 0).
				//var parent = graph.getDefaultParent();
								
				// Adds cells to the model in a single step


				mxConstants.SHADOWCOLOR = '#e0e0e0';
				
				// Creates the graph inside the given container
				var graph = createGraph(container);


				//construct XML

				//Adding the start node
				xmlData  = '<?xml version="1.0" encoding="UTF-8"?><mxGraphModel><root><mxCell id="0" /><mxCell id="1" parent="0" /><mxCell id="2" value="" style="start" vertex="1" parent="0"><mxGeometry x="0" y="150" width="50" height="50" as="geometry" /></mxCell>' + 
				'<mxCell id="6" value="" style="end" vertex="1" parent="0"><mxGeometry x="570" y="150" width="50" height="50" as="geometry" /></mxCell>';

				var edgeArray = [];
				var edgeId = 3;
				var vertextCount = 1;

				//Draw Vertex
				for(var obj in flowChartJSON){
					 if( flowChartJSON.hasOwnProperty(obj) ) {
					 	var datalist = flowChartJSON[obj];
					 	//<mxCell id="AuthorizeClaim" value="Authorize&#xA;Claim" vertex="1" parent="3">
        					//<mxGeometry x="90" y="80" width="100" height="40" as="geometry" />
      					//</mxCell>
      					xmlData = xmlData + '<mxCell id="'+obj+'" value="'+obj+'" vertex="1" parent="0">'+
      					 '<mxGeometry x="'+ ((vertextCount*150)+((vertextCount-1)*50)) +'" y="140" width="120" height="80" as="geometry" /></mxCell>';
      					 vertextCount++;
      					 edgeArray.push(obj) ;

					 }
				}

				//Draw Edge
				for(edgeCount = 0; edgeCount < edgeArray.length ; edgeCount ++ ){
					//Start node edge
					if(edgeCount == 0){
						xmlData = xmlData + '<mxCell id="'+edgeId+'" value="" edge="1" parent="0" source="2" target="'+edgeArray[edgeCount]+'"><mxGeometry relative="1" as="geometry" /></mxCell>';
						edgeId++;
						continue;
					}
					//Edge to last node
					if(edgeCount == edgeArray.length-1){
						xmlData = xmlData + '<mxCell id="'+edgeId+'" value="" edge="1" parent="0" source="'+edgeArray[edgeCount]+'" target="6"><mxGeometry relative="1" as="geometry" /></mxCell>';
						edgeId++;
					}
					xmlData = xmlData + '<mxCell id="'+edgeId+'" value="" edge="1" parent="0" source="'+edgeArray[edgeCount-1]+'" target="'+edgeArray[edgeCount]+'"><mxGeometry relative="1" as="geometry" /></mxCell>';
					edgeId++;
				}

				

				//Adding the root node
				xmlData = xmlData + '</root></mxGraphModel>';
				console.log("XMLData: " + xmlData);

				var doc = mxUtils.parseXml(xmlData);
				var codec = new mxCodec(doc);
				codec.decode(doc.documentElement, graph.getModel());
				/**graph.getModel().beginUpdate();
				try
				{
					var v1 = graph.insertVertex(parent, null, 'Hello', 20, 20, 80, 30);
					function(parent, id, value,
	x, y, width, height, style, relative)
					var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
					var e1 = graph.insertEdge(parent, null, '', v1, v2);
				}
				finally
				{
					// Updates the display
					graph.getModel().endUpdate();
				}*/
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
			
			style = graph.getStylesheet().getDefaultEdgeStyle();
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			style[mxConstants.STYLE_STROKECOLOR] = '#808080';
			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_SHADOW] = true;
							
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
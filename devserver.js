var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
var Request = require("request");
var q = require('q');

var port = 8000;
var app = express();
var compiler = webpack(config);

var JM = require('json-mapper');

app.use(express.static(process.cwd()));

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/questions', function (req, res) {
	res.sendFile(path.join(__dirname, 'questions.html'));
});

app.get('/demo', function (req, res) {
	res.sendFile(path.join(__dirname, 'questions-new.html'));
});

function getDialogFlowResponse(query){

	var deferred = q.defer();

	//need to be dynamic
	var sessionId = 12345;

	console.log("query: "+query);

	//make rest call here//

	const options = {  
		url: "https://api.dialogflow.com/v1/query?v=20150910&lang=en&query="+query+"&sessionId="+sessionId,
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
			'Authorization':'Bearer 25ad043a2ed341ed957be3af682cca33'
		}
	};

	Request.get(options, (error, response,body) => {

		if(error) {
			console.log("something wrong. "+JOSN.stringify(error));
			deferred.reject(error);
		}else{
			console.log("Yay it worked. "+JSON.stringify(response)+"--"+JSON.stringify(body));
			deferred.resolve(body);
		}
	});
	//make rest call here//
	console.log("it is returning ");

	return deferred.promise;
}



function generateChart(intentAction){

	var nodeInit = [];
	var mapping = [];
	var mapOfNodes = {};

	var chartString = "";

	for(i=0;i<intentAction.length;i++){
		
		var sp = intentAction[i].replace(new RegExp('-no','g'), '(no)').replace(new RegExp('-yes','g'), '(yes)').replace(new RegExp('\\.','g'),'->');
		console.log(sp);
		
		mapping.push(sp);

		var splited = intentAction[i].split(".");
		for(j=0;j<splited.length;j++){

			var regSplited = splited[j].replace(new RegExp('-no','g'), '').replace(new RegExp('-yes','g'), '');

			if(mapOfNodes[regSplited] == undefined){
				mapOfNodes[regSplited] = "1";
				
				var type = "";

				if(regSplited.trim() == "start"){
					type = "start";
				}else if(regSplited.trim() == "end"){
					type = "end";
				}else if(splited[j].indexOf("-no") != -1 || splited[j].indexOf("-yes") != -1){
					type = "condition";
				}else{
					type="operation";
				}

				nodeInit.push(regSplited+'=>'+type+': '+regSplited);
			}
		}
	}

	for(i=0;i<nodeInit.length;i++){
		chartString += nodeInit[i]+"\n"
	}

	for(i=0;i<mapping.length;i++){
		chartString += mapping[i]+"\n";
	}

	return chartString;
}




app.get("/generateFlowChart",function(req,res){

	var sessionId = Math.round(Math.random()*97676567549845769849);
	var intentId = req.query.intentId;
	var fullResposne = req.query.full;

	console.log("INTENT id: "+intentId);

	if(req.query.sessionId != undefined && req.query.sessionId != ''){
		sessionId = req.query.sessionId;
	}

	const options = {  
		url: "https://api.dialogflow.com/v1/intents/"+intentId+"?v=20150910&lang=en&sessionId="+sessionId,
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization':'Bearer 2194da80332b44a587121f69166d186f'//its developer fingerprint
		}
	};

	Request.get(options, (error, response,body) => {

		//find the nodes

		if(error){

		}else{

			console.log("Yay it worked. "+JSON.stringify(response)+"--"+JSON.stringify(body));

			var converter = JM.makeConverter({
				"start": function(input){
					input = JSON.parse(input);
					if(input.responses != undefined){

						return input.responses[0].action;//take only the first one
					}
					return;
				},
				"intentAction": function(input){
					input = JSON.parse(input);
					var intents=[];
					if(input.followUpIntents != undefined){
						var t = input.followUpIntents;
						for(i=0;i<t.length;i++){
							var item = t[i];
							if(item.responses != undefined ){
								var s = item.responses;
								for(j=0;j<s.length;j++){
								
									if(s[j].action != undefined && s[j].action != ''){
										intents.push(s[j].action);
									}	
								}
							}
						}
					}
					return intents;
				}
			});


			var result = converter(body);
			
			result.chart = generateChart(result.intentAction);

			if(fullResposne!=undefined && fullResposne != ""){
				result = body;
			}

			res.send(result);

		}
		//add the flow
	});

});

app.get("/dialogFlow2",function(req,res){

	//need to be dynamic
	var sessionId = Math.round(Math.random()*97676567549845769849);
	var fullResposne = req.query.full;

	if(req.query.sessionId != undefined && req.query.sessionId != ''){
		sessionId = req.query.sessionId;
	}

	var query = req.query.q;

	console.log("query: "+query);

	//make rest call here//

	const options = {  
		url: "https://api.dialogflow.com/v1/query?v=20150910&lang=en&query="+query+"&sessionId="+sessionId,
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
			'Authorization':'Bearer 1b01bfb7ef104679a5d698b9f782a6ef'
		}
	};

	Request.get(options, (error, response,body) => {

		if(error) {
			console.log("something wrong. "+JOSN.stringify(error));

			res.send(error);
		}else{
			console.log("Yay it worked. "+JSON.stringify(response)+"--"+JSON.stringify(body));

			var converter = JM.makeConverter({
				"next": function(input){
					
					console.log(typeof(input)+" MAKE: "+JSON.stringify(input));
					input = JSON.parse(input);
					if(input.result != undefined && input.result.fulfillment != undefined && input.result.fulfillment.messages != undefined){
						var t = input.result.fulfillment.messages;
						console.log("debug");
						for(i=0;i<t.length;i++){
							if(t[i].payload != undefined){
								console.log("AT last it works" + t[i].payload);
								return t[i].payload.next;
							}
						}
					}
					return {};
				},
				"context": function(input){
					input = JSON.parse(input);
					if(input.result != undefined && input.result.contexts != undefined){

						var contextArray=[];
						var t = input.result.contexts;

						for(i=0;i<t.length;i++){
							contextArray.push(t[i].name);
						}

						return contextArray;
					}
					return [];
				},
				"sessionId": function(input){
					input = JSON.parse(input);
					if(input.sessionId != undefined){
						return input.sessionId;
					}
					return "";
				},
				"action": function(input){
					input = JSON.parse(input);

					if(input.result != undefined && input.result.action != undefined){
						return input.result.action;
					}
					return "";
				}
				//add meta and session id later
			});

			var result = converter(body);
			
			if(fullResposne!=undefined && fullResposne != ""){
				result = body;
			}

			res.send(result);
		}
	});
	//make rest call here//

});


app.get("/dialogFlow3",function(req,res){

	//need to be dynamic
	var sessionId = Math.round(Math.random()*97676567549845769849);
	var fullResposne = req.query.full;

	if(req.query.sessionId != undefined && req.query.sessionId != ''){
		sessionId = req.query.sessionId;
	}

	var query = req.query.q;

	console.log("query: "+query);

	//make rest call here//

	const options = {  
		url: "https://api.dialogflow.com/v1/query?v=2015091088&lang=en&query="+query+"&sessionId="+sessionId,
		method: 'GET',
		headers: {
			'Authorization' : 'Bearer 1b01bfb7ef104679a5d698b9f782a6ef'
		}
	};

	Request.get(options, (error, response,body) => {

		if(error) {
			console.log("something wrong. "+JOSN.stringify(error));

			res.send(error);
		}else{
			console.log("Yay it worked. "+JSON.stringify(response)+"--"+JSON.stringify(body));

			var converter = JM.makeConverter({
				"next": function(input){
					
					console.log(typeof(input)+" MAKE: "+JSON.stringify(input));
					input = JSON.parse(input);
					if(input.result != undefined && input.result.fulfillment != undefined && input.result.fulfillment.messages != undefined){
						var t = input.result.fulfillment.messages;
						console.log("debug");
						for(i=0;i<t.length;i++){
							if(t[i].payload != undefined){
								console.log("AT last it works" + t[i].payload);
								return t[i].payload.next;
							}
						}
					}
					return {};
				},
				"context": function(input){
					input = JSON.parse(input);
					if(input.result != undefined && input.result.contexts != undefined){

						var contextArray=[];
						var t = input.result.contexts;

						for(i=0;i<t.length;i++){
							contextArray.push(t[i].name);
						}

						return contextArray;
					}
					return [];
				},
				"sessionId": function(input){
					input = JSON.parse(input);
					if(input.sessionId != undefined){
						return input.sessionId;
					}
					return "";
				},
				"action": function(input){
					input = JSON.parse(input);

					if(input.result != undefined && input.result.action != undefined){
						return input.result.action;
					}
					return "";
				}
				//add meta and session id later
			});

			var result = converter(body);
			
			if(fullResposne!=undefined && fullResposne != ""){
				result = body;
			}

			res.send(result);
		}
	});
	//make rest call here//

});

app.get('/dialogFlow',function(req,res){

	var response = getDialogFlowResponse(req.query.q);

	console.log("the resposne is : "+response);
	res.send(response);

});

app.listen(port, '0.0.0.0', function (err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://0.0.0.0:%s', port);
});

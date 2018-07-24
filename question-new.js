var data = {};

var init = {"query": "start tax process","contexts":"","flowchart_data" : {},"context_type" : ""};

var currentType = "";

var sessionId = Math.round(Math.random()*97676567549845769849);

function fetchQuestion(query){
 
    //console.log("fetchQuestion");

}

function nextQuestion(){
    
    //console.log("nextQuestion");
    
    if(currentType == "input_yes_no"){

    }else if(currentType == "input_multi"){
        
        var fav = [];
        $.each($("#controls .input_multi .options input[name='answer']:checked"), function(){            
            fav.push($(this).val());
        });

        init.query = fav.toString();

        initialize();

    }else if(currentType == "input_radio"){
        var query = $("#controls .input_radio .options input").val();
        init.query = query;

        initialize();

    }else if(currentType == "input_small"){

        var query = $("#controls .input_small .options input").val();
        init.query = query;

        initialize();

    }else if(currentType == "input_big"){

        var query = $("#controls .input_big .options textarea").val().trim();
        init.query = query;

        initialize();

    }else if(currentType == "input_dropdown"){

        var query = $("#controls .input_dropdown .options select :selected").text();
        init.query = query;

        initialize();

    }else if(currentType=="next"){

    }

    //Construct JSON for Flowchat
    // var ques = $("#controls .question #questionText").html() ;
    // var quesAns = ques + ":" +  init.query;
    // var contextType = init.context_type ;

    // console.log("isValid: check"+ init.isValid);

    // if(init.isValid){
    //     if(init.flowchart_data.hasOwnProperty(contextType)){
    //         init.flowchart_data[contextType].push(quesAns);
    //     }
    //     else{
    //         init.flowchart_data[contextType] = [quesAns];
    //     }
    // }

}

function prevQuestion(){
    
    //console.log("previousQuesiton");

}

function initialize(){

    var queryString = "q="+init.query+"&sessionId="+sessionId;
    if (init.contexts != "") { 
        queryString = queryString + init.contexts;
    }
    
    if(init.query != "")
    $.ajax({url: "http://bdmp-poc.herokuapp.com/dialogflow2?"+queryString, 
            success: function(result){

                var queOptions = ["input_yes_no","input_multi","input_radio","input_small","input_big","input_dropdown","next"];

                //console.log("Data: "+JSON.stringify(result));

                //console.log("type is: "+result.next.type);
                //console.log("question is: "+result.next.question);
                //console.log("context is: "+result.context);
                //console.log("context type is: "+result.next.context_type);
                //console.log("context desc is: "+result.next.context_desc);


                if(result.next.type =='' || result.next.type == undefined ){
                    //console.log("im returing");
                    //clear the text field
                    try{
                        //clear the input
                        $("#controls .options input").val("");
                    }catch(err){
                        //console.log("clear input error occurs");
                    }
                    init.isValid = false;
                    return false;   //query is invalid so stop proceeding further
                }

                var ques = $("#controls .question #questionText").html() ;
                var quesAns = ques + ":" +  init.query;
                var contextType = init.context_type ;
            
                //console.log("isValid: check"+ init.isValid);            
                
                if(contextType != ""){
                    if(init.flowchart_data.hasOwnProperty(contextType)){
                        init.flowchart_data[contextType].push(quesAns);
                    }
                    else{
                        init.flowchart_data[contextType] = [quesAns];
                    }
                }


                //console.log("DEBUG: heal the world");

                var selected = result.next.context_desc;
                $(".questionTag").each(function(index){
                    //console.log($(this).attr("name")+"--"+$(this).attr("class"));
                    if($(this).attr("name") == selected){
                        $(this).attr("class",$(this).attr("class")+" questionTagSelected");
                    }else{
                        $(this).attr("class","questionTag");
                    }
                })

                if(result.next.type == "end"){
                    // Clear the entire DOM and say 
                    $("#flowChartSVG").html('');
                    $("#flowChartSVG").css('overflow:hidden;position:relative;width:600px;height:300px;cursor:default;');
                    main(init.flowchart_data);
                }
                
                else{
                var contextArr = result.context;
                var contextType = result.next.context_type;
                var contextDesc = result.next.context_desc;

                init.query = "";
                init.contexts = "";
                init.context_type = contextType;


                for(itr=0; itr<contextArr.length; itr++){
                    init.contexts = init.contexts + "&contexts=" + contextArr[itr];
                }


                //make everthing else none
                currentType = result.next.type;

                //put type alone visible
                for(i=0;i<queOptions.length;i++){
                    if(queOptions[i] == result.next.type){
                        $("#controls ."+queOptions[i]).css("display","block");
                    }else{
                        $("#controls ."+queOptions[i]).css("display","none");
                    }
                }

                
                //update the flow chart///
                
                //update the flow chart///

                $("#controls .question #questionText").html(result.next.question);


                //you need to maintain the context as well

                //generate the options accordingly
                var ansOptions = result.next.options;


                var input_dom_select = "";

                //$("#testButton").remove();
                if(result.next.type == "input_yes_no"){

                }else if(result.next.type == "input_multi"){

                    // input_dom_select = $("#controls .input_multi .options");
                    $("#controls .input_multi .options").html('');
                    
                    for(i=0;i<ansOptions.length;i++){
                       
                        var t_checkbox = '<div>'+
                            '<input class="w3-check" name="answer" type="checkbox" value="'+ansOptions[i]+'"/> '+
                            '<label>'+ansOptions[i]+'</label>'+
                        '</div>';

                        $("#controls .input_multi .options").append(t_checkbox);
                     }


                }else if(result.next.type == "input_radio"){
                    
                    // input_dom_select = $("#controls .input_radio");
                    $("#controls .input_radio .options").html('');
                    
                    for(i=0;i<ansOptions.length;i++){
                        var t_radio = '<div>'+
                            '<input class="w3-radio" name="answer" type="radio" value="'+ansOptions[i]+'"/> '+
                            '<label>'+ansOptions[i]+'</label>'+
                        '</div>';
                        $("#controls .input_radio .options").append(t_radio);
                     } 

                }else if(result.next.type == "input_small"){
                    

                    // input_dom_select = $("#controls .input_small");
                    $("#controls .input_small .options input").val("")


                }else if(result.next.type == "input_big"){

                }else if(result.next.type == "input_dropdown"){
                    
                    $("#controls .input_dropdown .options select").html('');
                    
                    for(i=0;i<ansOptions.length;i++){
                        $("#controls .input_dropdown .options select").append('<option value="'+i+'">'+ansOptions[i]+'</option>');
                     }   


                }else if(result.next.type == "next"){

                }else{

                }
                
                //input_dom_select = 
                $("#controls .nextQuestion").css("display","block");
                //input_dom_select.append('<div class="nextQuestion"><button onclick="nextQuestion()" id="testButton" >Next</button></div>');


            }
                //$("#controls ."+result.next.type+" .options").html(result.next.options);
                return true;

            }
    });

}
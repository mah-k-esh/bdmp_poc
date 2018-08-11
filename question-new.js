var data = {};

var init = {"query": "start tax process","context":"","flowchart_data" : [{"name":"start","lane":"start","child":[]}],"context_type" : "","tempData":{}};

var currentType = "";

var sessionId = Math.round(Math.random()*97676567549845769849);

function fetchQuestion(query){
 
    console.log("fetchQuestion");

}

function nextQuestion(){
    
    console.log("nextQuestion");
    
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
    var ques = $("#controls .question #questionText").html() ;
    var ans = init.query;
    var quesAns = ques + ":\n" +  init.query;
    var contextType = init.context_type ;


    var node = {
        "name": contextType,
        "child": [],
        "lane": contextType,
        "collapse": true,
        "ques": ques,
        "ans": ans
    };


    if(init.tempData[contextType] != null || init.tempData[contextType] != undefined){
        
        var childNode = {
            "name": quesAns,
            "child": [],
            "lane": contextType,
            "collapse": true,
            "hide": true,
            "ques": ques,
            "ans": ans
        };

        //here im adding each node as child of previous node
        var trav = init.tempData[contextType];

        while(trav["child"].length != 0){
            trav = trav["child"][0];
        }

        trav["child"][trav["child"].length] = childNode;
    }
    else{
        init.flowchart_data[init.flowchart_data.length] = node;
        init.tempData[contextType] = node;
    }

    console.log(init.flowchart_data);

}

function prevQuestion(){
    
    console.log("previousQuesiton");

}

function initialize(){

    var queryString = "q="+init.query+"&sessionId="+sessionId;
    if (init.context != "") { 
        queryString = queryString + init.context;
    }
    

    $.ajax({url: "https://bdmp-poc.herokuapp.com/dialogflow2?"+queryString, 
            success: function(result){

                //main(init.flowchart_data);
                var queOptions = ["input_yes_no","input_multi","input_radio","input_small","input_big","input_dropdown","next"];

                console.log("Data: "+JSON.stringify(result));

                console.log("type is: "+result.next.type);
                console.log("question is: "+result.next.question);
                console.log("context is: "+result.context);
                console.log("context type is: "+result.next.context_type);
                console.log("context desc is: "+result.next.context_desc);


                var selected = result.next.context_desc;
                $(".questionTag").each(function(index){
                    console.log($(this).attr("name")+"--"+$(this).attr("class"));
                    if($(this).attr("name") == selected){
                        $(this).attr("class",$(this).attr("class")+" questionTagSelected");
                    }else{
                        $(this).attr("class","questionTag");
                    }
                })

                if(result.next.question == ""){
                    // Clear the entire DOM and say 
                    $("#flowChartSVG").html('');
                    $("#flowChartSVG").css('overflow:hidden;position:relative;width:600px;height:300px;cursor:default;');

                    init.flowchart_data[init.flowchart_data.length] = {"name":"end","lane":"end","child":[]};

                    mainNew(init.flowchart_data);
                }
                
                else{
                var contextArr = result.context;
                var contextType = result.next.context_type;
                var contextDesc = result.next.context_desc;

                init.query = "";
                init.context = "";
                init.context_type = contextType;


                for(itr=0; itr<contextArr.length; itr++){
                    init.context = init.context + "&context=" + contextArr[itr];
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

            }
    });

}

$(document).ready(function () {
    $("#overlay1").fadeIn();
    $("#overlay3").fadeIn();
    $("#overlay4").fadeIn();
    $("#overlay2").fadeIn();      
    $(document).keypress(function (e) {
        $("#overlay2").fadeIn();
        $("#overlay1").fadeIn();
        $("#overlay3").fadeIn();
        $("#overlay4").fadeIn();       
        var userInput = e.target.value;
        if (e.keyCode == 32) {
            commonPrevScreen();
        }
        if (e.keyCode == 13) {
            commonNextScreen();
        }
    });
});
function commonPrevScreen()
{
    var socket = io();
    var data = localStorage.getItem('screenData');
    data = JSON.parse(data);
    if (localStorage.getItem('screenOne') == 'true') {
        localStorage.setItem("screenOne", "true");
        localStorage.setItem("screenThree", "false");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenTwo", "false");
        //return;
    }
    else if (localStorage.getItem('screenTwo') == 'true') {
        localStorage.setItem("screenTwo", "false");
        localStorage.setItem("screenOne", "true");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenThree", "false");

        $("#screen22").focusout();
        $("#screen22").css({ "background-color": "red", "color": "white" })
    }
    else if (localStorage.getItem('screenThree') == 'true') {
        localStorage.setItem("screenTwo", "true");
        localStorage.setItem("screenOne", "false");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenThree", "false");
        $("#screen33").focusout();
        $("#screen33").css({ "background-color": "red", "color": "white" })
    }
    else if (localStorage.getItem('screenFour') == 'true') {
        localStorage.setItem("screenTwo", "false");
        localStorage.setItem("screenOne", "false");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenThree", "true");
        $("#screen44").focusout();
        $("#screen44").css({ "background-color": "red", "color": "white" })
    }
    socket.emit("getPrevScreen", data);
}
function commonNextScreen()
{
    var socket = io();
    var data = localStorage.getItem('screenData');   
    data = JSON.parse(data);
    $("#overlay2").fadeIn();
    $("#overlay1").fadeIn();
    $("#overlay3").fadeIn();
    $("#overlay4").fadeIn();
    if (localStorage.getItem('screenOne') == 'true') {
        localStorage.setItem("screenOne", "false");
        localStorage.setItem("screenThree", "false");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenTwo", "true");
        $("#screen1").focusout();
        $("#screen1").css({ "background-color": "red", "color": "white" });               
    }
    else if (localStorage.getItem('screenTwo') == 'true') {
        localStorage.setItem("screenTwo", "false");
        localStorage.setItem("screenOne", "false");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenThree", "true");
        $("#screen2").focusout();
        $("#screen2").css({ "background-color": "red", "color": "white" });               
    }
    else if (localStorage.getItem('screenThree') == 'true') {
        localStorage.setItem("screenTwo", "false");
        localStorage.setItem("screenOne", "false");
        localStorage.setItem("screenFour", "true");
        localStorage.setItem("screenThree", "false");
        $("#screen3").focusout();
        $("#screen3").css({ "background-color": "red", "color": "white" });               
    }
    else if (localStorage.getItem('screenFour') == 'true') {
        localStorage.setItem("screenTwo", "false");
        localStorage.setItem("screenOne", "false");
        localStorage.setItem("screenFour", "false");
        localStorage.setItem("screenThree", "false");
        $("#screen4").focusout();
        $("#screen4").css({ "background-color": "red", "color": "white" });
    }
    $("#overlay2").fadeIn();
    $("#overlay1").fadeIn();
    $("#overlay3").fadeIn();
    $("#overlay4").fadeIn();
    socket.emit("getNextScreen", data);

}
function nextOrder(currentOrder) {
    var nextOrderDetail = [];   
    if (currentOrder == '1') {
        nextOrderDetail = new Array('54672', 'The Works','19309', 'Pepperoni');       
    } else if (currentOrder == '2') {
        nextOrderDetail = new Array('38297', 'Custom','54672', 'The Works');       
    } else if (currentOrder == '3') {
        nextOrderDetail = new Array('19309', 'Pepperoni','38297', 'Custom');        
    }
    return nextOrderDetail;
}


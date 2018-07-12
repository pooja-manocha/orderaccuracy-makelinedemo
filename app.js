var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var aw = require('await-fs');
var path = require('path');
var express = require('express');
var server = express();
var router = express.Router();
var dns = require('dns');
var Myo = require("myo");
var pizzaOrder = require("./order");
var imagePath = 'http://localhost:3001/images/';
var leapjs      = require('leapjs');
var leapController  = new leapjs.Controller({enableGestures: true});

var nextOrder = 0;
var imageUrl;
//var ngrok = require('ngrok');
var myo = false;
var resultIp;
var stepCount = 0;
var screenCount = stepCount + 1;
var screenName = '';

app.set('view engine', 'ejs');

// App config

var projectRootPath = path.resolve(__dirname);
var newpprjectpath = path.join(projectRootPath, "assets");
server.use('/', express.static(newpprjectpath + '/'));
server.listen(3001);
var linkUrl = [];

dns.lookup('LP-13MNF72', (err, result) => {

    var projectStaticUrl = 'http://' + result + ':3001';
    fs.readdir(newpprjectpath, function (err, data) {

        if (err) {
            return console.log(err);
        }
        data.forEach(element => {
            let object = {
                fileUrl: projectStaticUrl + '/' + element,
                fileName: element
            }
            linkUrl.push(object);
        });
        return linkUrl;
    });
})


var socketArr = [];
var orderLength = Object.keys(pizzaOrder.orders).length;


app.get('/admin', function (req, res) {
    // initSocket();
    res.render('pages/admin');
});
app.get('/restartScreen', function (req, res) {
    // startUp();
    res.render('pages/restartScreen');
});

app.get('/screen1', function (req, res) {
    startUp();
    res.render('pages/screen1');
});

app.get('/screen2', function (req, res) {
    startUp();
    res.render('pages/screen2');
});

app.get('/screen3', function (req, res) {
    startUp();
    res.render('pages/screen3');
});

app.get('/screen4', function (req, res) {
    startUp();
    res.render('pages/screen4');
});

app.get('/', function (req, res) {
    res.send('Please hit the url with screen1, screen2, screen3, screen4');
});

app.get('/endpoint', function(req, res){

    if(req.query.id === 'p1')
    {
        nextOrder = 0;
    }else if(req.query.id === 'p2'){
        nextOrder = 1;
    }else if(req.query.id === 'p3')
    {
        nextOrder = 2;
    }
    displayOrder();
	
});

leapController.on('connect', function() {
    console.log("Successfully connected.");
  });
  
  leapController.on('deviceConnected', function() {
    console.log("A Leap device has been connected.");
  });
  
  leapController.on('deviceDisconnected', function() {
    console.log("A Leap device has been disconnected.");
  });

  leapController.on('deviceFrame', function(frame) {
    // loop through available gestures
    for(var i = 0; i < frame.gestures.length; i++){
      var gesture = frame.gestures[i];
      var type    = gesture.type;          
  
      switch( type ){
  
        case "circle":
          if (gesture.state == "stop") {
            console.log('circle');
          }
          break;
  
        case "swipe":
          if (gesture.state == "stop") {
            console.log('swipe');
            //getNextOrder();
          }
          break;
  
        case "screenTap":
          if (gesture.state == "stop") {
            console.log('screenTap');
          }
          break;
  
        case "keyTap":
          if (gesture.state == "stop") {
            console.log('keyTap');
          }
          break;
  
        }
      }
  });

  leapController.on('deviceFrame', function(frame) {
    var numberOfFingers = frame.fingers.length;
    console.log(numberOfFingers);
  });
  
  leapController.connect();


io.on('connection', function (socket) {
    socket.on('getNextScreen', function (data) {
        getNextOrder(data);
    });
});

function getNextOrder(data) {


    var imageUrl = []
    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId-1)].images[(data.screenName)][0])
    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId-1)].images[(data.screenName)][1])
    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId-1)].images[(data.screenName)][2])
    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId-1)].images[(data.screenName)][3])
    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId-1)].images[(data.screenName)][4])
    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId-1)].images[(data.screenName)][5])
    var imageRotationTimer =  pizzaOrder.orders[(data.orderId-1)].stepTime[(data.screenName)];
   // var pizzaTime= pizzaOrder.orders[(data.orderId-1)].pizzaTime;
    console.log("data pizza time--------->", data.pizzaTime);
    io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen"+ (data.screenName) , screenName: (data.screenName+1), imageUrl: imageUrl,  orderId: data.orderId,imagePath:imagePath,imageRotationTimer:imageRotationTimer,orderName: data.orderName, pizzaTime: data.pizzaTime });
}


// myo code start 
Myo.on('connected', function(){  
    console.log("Myo successfully connected. Data: ");
    myMyo = this;
    addEvents(myMyo);
});

var addEvents = function(myo){  
    myo.on('fist', function(){
        console.log('fist for ', this);
    })
}
// myo code end 

//fist, fingers_spread, wave_in, wave_out, double_tap
var pose_name = 'wave_out';
Myo.on("pose", function (pose_name) {
    switch (pose_name) {
        case "wave_in":
        case "wave_out":
            console.log("You are waving!");
            getNextOrder(pose_name); 
            break;
    }
});

function startUp() {

    io.on('connection', function (socket) {

        if (nextOrder > orderLength - 1) {
            stepCount = 0;
            nextOrder = 0;
        }


        var clients = io.sockets.clients();

    
        socketArr = Object.values(Object.keys(io.sockets.sockets));

        

        socket.on('end', function () {
            console.log('end---------------->>>>>>>>>>>');
        });

        socket.on('error', function () {
            console.log('error-------->>>>>>>>>>>>>>>>>');
        });

    });
}
function displayOrder(){
   
    stepCount = 0;
    screenCount = stepCount + 1;
    var imageUrl = []
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][0])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][1])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][2])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][3])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][4])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][5])
    var imageRotationTimer =  pizzaOrder.orders[nextOrder].stepTime[stepCount];
    var pizzaTime = pizzaOrder.orders[nextOrder].pizzaTime;

    var ordername= pizzaOrder.orders[nextOrder].name;
    console.log("Order name --->", ordername);
   
    for (var i = 0; i <= 3; i++) {      
        io.sockets.to(socketArr[i]).emit('broadcast', {});
    }
    io.sockets.to(socketArr[0]).emit('broadcast', { id: "screen"+ screenCount , screenName: screenCount, imageUrl: imageUrl, stepCount: stepCount, orderId: pizzaOrder.orders[nextOrder].orderId,imagePath:imagePath,imageRotationTimer:imageRotationTimer,orderName: ordername, pizzaTime:pizzaTime });
}
http.listen(3000, function () {
    console.log('listening on *:3000');
});

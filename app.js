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
var pizzaOrder = require("./order");
var imagePath = 'http://localhost:3001/images/';
var nextOrder = 0;
var imageUrl;
var myo = false;
var resultIp;
var stepCount = 0;
var screenCount = stepCount + 1;
var screenName = '';
var currentStep = { "screen": 0, "subScreen": 0 };
//instantiate logger
var logger = require('./config/logger');
app.set('view engine', 'ejs');
//instantiate Myo 
var  Myo  =  require('myo');
//setup the path for client side static assets
var projectRootPath = path.resolve(__dirname);
var newpprjectpath = path.join(projectRootPath, "assets");
server.use('/', express.static(newpprjectpath + '/'));
server.listen(3001);
var linkUrl = [];
var socketArr = [];
var orderLength = Object.keys(pizzaOrder.orders).length;
//start the socket server and keep it running in listening mode
startUp();

dns.lookup('LP-13MNF72', (err, result) => {
    var projectStaticUrl = 'http://' + result + ':3001';
    fs.readdir(newpprjectpath, function (err, data) {
        if (err) {
           return logger.info("Read Directory Error : " + err);
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
//setting up of routes
app.get('/admin', function (req, res) {
    res.render('pages/admin');
});

app.get('/screen1', function (req, res) {
    res.render('pages/screen1');
});

app.get('/screen2', function (req, res) {
    res.render('pages/screen2');
});

app.get('/screen3', function (req, res) {
    res.render('pages/screen3');
});

app.get('/screen4', function (req, res) {
    res.render('pages/screen4');
});

app.get('/', function (req, res) {
    res.send('Please hit the url with screen1, screen2, screen3, screen4');
});
//listen for socket events for moving to next & previous screen
   io.sockets.on('connection', function (socket) {
         socket.on('getNextScreen', function (data) {
             //move the next screen logic
            getNextOrder(data);
        });
        socket.on('getPrevScreen', function (data) {
            //move to previous screen logic
            getPrevOrder(data);
        });
        socket.on('initStartup', function (data) {            
            if (data.id === 'p1') {
                nextOrder = 0;
        
            } else if (data.id === 'p2') {
                nextOrder = 1;
        
            } else if (data.id === 'p3') {
                nextOrder = 2;
        
            }
            //display order first screen
            displayOrder();
        });
   });

function getNextOrder(data) {
    //setting up of data property to keep the screens fadeIn by default before event
    for(var i=0;i<=socketArr.length;i++){
        io.sockets.to(socketArr[i]).emit('broadcast', {isFedIn: true});
    }
    logger.info("getNextOrder function called ");
    var imageUrl = []
    //checking for data rotation on screens
    if (data.isRotation) {  
        //if data rotation true- setup the subscreen information in data object and send it back to client      
        var scr = "screen" + (data.screenName);
        subScreen = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['numberOfSubScreen'];
        //if data subscreen is less than the total no of subscreens 
            if(data.currentSubScreen < subScreen){
                currentSubScreen = (data.currentSubScreen + 1);
                isRotation = data.isRotation;
                subScreen = data.subScreen;
                subScreens = pizzaOrder.orders[(data.orderId - 1)].subScreens;
                for (let i = data.currentSubScreen; i <= data.currentSubScreen ; i++) {
                    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName-1)][i])
                }
                var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
                var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
                io.sockets.to(socketArr[(data.screenName-1)]).emit('broadcast', { id: "screen" + (data.screenName), screenName: (data.screenName), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, pizzaOrder: pizzaOrder.orders, subScreens:subScreens , subScreen:subScreen, isRotation:  isRotation,currentSubScreen:currentSubScreen});
            }else{
                //if data subscreen is not less than total no of subscreens and screen is not 4
                if(data.screenName<4)
                {
                    imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][0]);               
                    var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
                    var ordername = pizzaOrder.orders[(data.orderId - 1)].name;  
                    var scr = "screen" + (data.screenName+1);   
                    subScreen = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['numberOfSubScreen'];
                    isRotation = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['isRotation'];
                    if(isRotation){
                        currentSubScreen =1;
                    }else{
                        currentSubScreen =0;
                    }
                    io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen" + (data.screenName+1), screenName: (data.screenName + 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.orderId - 1)].subScreens, subScreen:subScreen, isRotation: isRotation ,currentSubScreen:currentSubScreen });
               
                }
                }
    } else {
        if(data.screenName<4)
        {
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][0])       
        var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
        var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
        var scr = "screen" + (data.screenName+1);
        subScreen = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['numberOfSubScreen'];
        isRotation = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['isRotation'];
        if(isRotation){
            currentSubScreen =1;
        }else{
            currentSubScreen =0;
        }
        io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen" + (data.screenName+1), screenName: (data.screenName + 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.orderId - 1)].subScreens, subScreen:subScreen, isRotation: isRotation ,currentSubScreen:currentSubScreen });
    }
    }
}

//get the previous screen data 
function getPrevOrder(data) {
    //code to fadeIn all the screens bydefault
    for(var i=0;i<=socketArr.length;i++){
        io.sockets.to(socketArr[i]).emit('broadcast', {isFedIn: true});
    }
    logger.info("getPrevOrder function called ");
    var imageUrl = []
    if (data.isRotation) {
        var scr = "screen" + (data.screenName);
        subScreen = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['numberOfSubScreen'];
        if(data.currentSubScreen <= subScreen && data.currentSubScreen >1  ){
            currentSubScreen = (data.currentSubScreen - 1);
            isRotation = data.isRotation;
            subScreen = data.subScreen;
            subScreens = pizzaOrder.orders[(data.orderId - 1)].subScreens;
            for (let i = (currentSubScreen); i <= currentSubScreen; i++) {
                imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName-1)][i-1])
            }
            var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
            var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
            io.sockets.to(socketArr[(data.screenName-1)]).emit('broadcast', { id: "screen" + (data.screenName), screenName: (data.screenName), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, pizzaOrder: pizzaOrder.orders, subScreens:subScreens , subScreen:subScreen, isRotation:  isRotation,currentSubScreen:currentSubScreen});
        }else{
            var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
            var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
            var scr = "screen" + (data.screenName-1);
            subScreen = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['numberOfSubScreen'];
            isRotation = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['isRotation'];
            if(isRotation){
                currentSubScreen =subScreen;
                imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName-2)][(subScreen-1)]);
            }else{
                currentSubScreen =0;
                imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName-2)][(subScreen)]);
            }
            io.sockets.to(socketArr[(data.screenName-2)]).emit('broadcast', { id: "screen" + (data.screenName-1), screenName: (data.screenName - 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.orderId - 1)].subScreens, subScreen:subScreen, isRotation: isRotation ,currentSubScreen:currentSubScreen });
        }
    } else {
        if((data.screenName-1)>0)
        {
        var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
        var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
        var scr = "screen" + (data.screenName-1);
        subScreen = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['numberOfSubScreen'];
        isRotation = pizzaOrder.orders[(data.orderId - 1)].subScreens[scr]['isRotation'];
        if(isRotation){
            currentSubScreen =subScreen;
            imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName-2)][(subScreen-1)]);
        }else{
            imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName-2)][0]);
            currentSubScreen =0;
        }
        io.sockets.to(socketArr[(data.screenName-2)]).emit('broadcast', { id: "screen" + (data.screenName-1), screenName: (data.screenName - 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.orderId - 1)].subScreens, subScreen:subScreen, isRotation: isRotation ,currentSubScreen:currentSubScreen });
    }
}
}
//MYO sensor connection code
//Myo.connect('com.stolksdorf.myAwesomeApp', require('ws'));
Myo.on('fist',  function () {
        this.vibrate();
});

// myo code start
Myo.on('connected', function () {
    myMyo = this;
    addEvents(myMyo);    
    logger.info("Myo connection started ");
});

var addEvents = function (myo) {
    myo.on('fist', function () {
    })
}
//startup code to start the socket server and keep it in listening mode
function startUp() {
    io.on('connection', function (socket) {
        io.sockets.setMaxListeners(Infinity);
        if (nextOrder > orderLength - 1) {
            stepCount = 0;
            nextOrder = 0;
        }
        var clients = io.sockets.clients();       
        socketArr = Object.values(Object.keys(io.sockets.sockets));    

        socket.on('disconnect', function () {            
        });
        socket.on('error', function () {
            
        });
    });
}
//code to display the requested order first screen
function displayOrder() {
    logger.info("displayOrder function called to show first screen data");    
    stepCount = 0;
    screenCount = stepCount + 1;
    var imageUrl = []
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][0])
    var imageRotationTimer = pizzaOrder.orders[nextOrder].stepTime[stepCount];
    var pizzaTime = pizzaOrder.orders[nextOrder].pizzaTime;

    var ordername = pizzaOrder.orders[nextOrder].name;
    for (var i = 0; i <= socketArr.length; i++) {
        io.sockets.to(socketArr[i]).emit('broadcast', {});
    }
    for(var i=1;i<=socketArr.length;i++){
        io.sockets.to(socketArr[i]).emit('broadcast', {isFedIn: true});
    } 
    if(pizzaOrder.orders[nextOrder].subScreens.screen1.isRotation){
        var currentSubScreen = 1;
    }else{
        var currentSubScreen = 0;
    } 
    io.sockets.to(socketArr[0]).emit('broadcast', { id: "screen" + screenCount, screenName: screenCount, imageUrl: imageUrl, stepCount: stepCount, orderId: pizzaOrder.orders[nextOrder].orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[nextOrder].subScreens,isRotation:pizzaOrder.orders[nextOrder].subScreens.screen1.isRotation,subScreen:pizzaOrder.orders[nextOrder].subScreens.screen1.numberOfSubScreen,currentSubScreen:currentSubScreen});
    
}
//keeping the server running in port 3000
http.listen(3000, function () {
    logger.info("server listening on port 3000");
    console.log('server listening on port 3000');
});

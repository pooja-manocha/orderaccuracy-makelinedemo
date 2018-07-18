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
var leapjs = require('leapjs');
var leapController = new leapjs.Controller({ enableGestures: true });
var nextOrder = 0;
var imageUrl;
var myo = false;
var resultIp;
var stepCount = 0;
var screenCount = stepCount + 1;
var screenName = '';
var currentStep = { "screen": 0, "subScreen": 0 };
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
  
    res.render('pages/admin');
});
app.get('/restartScreen', function (req, res) {
   
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

app.get('/endpoint', function (req, res) {

    if (req.query.id === 'p1') {
        nextOrder = 0;
        this.currentStep = { "screen": 0, "subScreen": 0 };
        setCurrentStep(nextOrder);
    } else if (req.query.id === 'p2') {
        nextOrder = 1;
        this.currentStep = { "screen": 0, "subScreen": 0 };
        setCurrentStep(nextOrder);
    } else if (req.query.id === 'p3') {
        nextOrder = 2;
        this.currentStep = { "screen": 0, "subScreen": 0 };
        setCurrentStep(nextOrder);
    }
    displayOrder();

});

leapController.on('connect', function () {
    console.log("Successfully connected.");
});

leapController.on('deviceConnected', function () {
    console.log("A Leap device has been connected.");
});

leapController.on('deviceDisconnected', function () {
    console.log("A Leap device has been disconnected.");
});

leapController.on('deviceFrame', function (frame) {
    // loop through available gestures
    for (var i = 0; i < frame.gestures.length; i++) {
        var gesture = frame.gestures[i];
        var type = gesture.type;

        switch (type) {

            case "circle":
                if (gesture.state == "stop") {
                    console.log('circle');
                }
                break;

            case "swipe":
                if (gesture.state == "stop") {
                    console.log('swipe');
                   
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

leapController.on('deviceFrame', function (frame) {
    var numberOfFingers = frame.fingers.length;
    console.log(numberOfFingers);
});

leapController.connect();


io.on('connection', function (socket) {
    socket.on('getNextScreen', function (data) {
        getNextOrder(data);
    });
    socket.on('getPrevScreen', function (data) {
        getPrevOrder(data);
    });
});


function getNextOrder(data) {

    // console.log("data.subScreen--",data.subScreen);
    // console.log("data.orderId--",data.orderId);
    // console.log("data.screenName--",data.screenName);
    // console.log("data.orderName--",data.orderName);
    // // console.log("pizzaOrder--",pizzaOrder.orders);
    // console.log("subScreen--",data.subScreen);
    // console.log("isRotation--",data.isRotation);
    var imageUrl = []
    if (data.isRotation) {

        for (let i = data.subScreen * 6; i < (data.subScreen * 6) + 6; i++) {
            imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][i])
        }

        var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
        var ordername = pizzaOrder.orders[(data.orderId - 1)].name;

        io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen" + (data.screenName), screenName: (data.screenName), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.orderId - 1)].subScreens, subScreen: data.subScreen, isRotation: data.isRotation});

    } else {

        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][0])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][1])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][2])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][3])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][4])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][5])
        var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
        var ordername = pizzaOrder.orders[(data.orderId - 1)].name;

        io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen" + (data.screenName), screenName: (data.screenName + 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.orderId - 1)].subScreens, subScreen: 0, isRotation: pizzaOrder.orders[(data.orderId - 1)].subScreens[("screen" + data.screenName)].isRotation });

    }

}


function getPrevOrder(data) {

    console.log("data.subScreen--",data.subScreen);
    console.log("data.orderId--",data.orderId);
    console.log("data.screenName--",data.screenName);
    console.log("data.orderName--",data.orderName);
    // console.log("pizzaOrder--",pizzaOrder.orders);
    console.log("subScreen--",data.subScreen);
    console.log("isRotation--",data.isRotation);

    var imageUrl = []
    if (data.isRotation) {
        for (let i = 0; i < (data.subScreen * 6); i++) {
            imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName)][i])
        }

        var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName)];
        var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
        io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen" + (data.screenName), screenName: (data.screenName + 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[(data.screenName)].subScreens });

    } else {

        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName - 2)][0])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName - 2)][1])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName - 2)][2])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName - 2)][3])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName - 2)][4])
        imageUrl.push(imagePath + pizzaOrder.orders[(data.orderId - 1)].images[(data.screenName - 2)][5])
        var imageRotationTimer = pizzaOrder.orders[(data.orderId - 1)].stepTime[(data.screenName - 2)];
        var ordername = pizzaOrder.orders[(data.orderId - 1)].name;
        io.sockets.to(socketArr[(data.screenName - 2)]).emit('broadcast', { id: "screen" + (data.screenName - 1), screenName: (data.screenName - 1), imageUrl: imageUrl, orderId: data.orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: data.orderName, pizzaTime: data.pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders });
    }
}

// myo code start 
Myo.on('connected', function () {
    console.log("Myo successfully connected. Data: ");
    myMyo = this;
    addEvents(myMyo);
});

var addEvents = function (myo) {
    myo.on('fist', function () {
        console.log('fist for ', this);
    })
}
// myo code end 

//fist, fingers_spread, wave_in, wave_out, double_tap
// var pose_name = 'wave_out';
Myo.on("pose", function (pose_name) {
    switch (pose_name) {
        case "wave_in":
            getOrderByMyo(pose_name)
            break;
        case "wave_out":
            getOrderByMyo(pose_name);
            break;
    }
});
function getOrderByMyo(poseName) {
    if (poseName == "wave_in") {
        setCurrentStep(nextOrder);
        prepareDataForMyo();


    }
    else if (poseName == "wave_out") {
        setCurrentStepForWaveOut(nextOrder);
        prepareDataForMyo();
    }
    else {
        console.log("wrong pose");
    }
}
function prepareDataForMyo() {
    var orderId = pizzaOrder.orders[nextOrder].id;
    var imageRotationTimer = pizzaOrder.orders[nextOrder].stepTime[(this.currentStep.screen - 1)];
    var orderName = pizzaOrder.orders[nextOrder].name;
    var ordername = pizzaOrder.orders[nextOrder].name;
    var pizzaTime = pizzaOrder.orders[nextOrder].pizzaTime;
    var scr = "screen" + this.currentStep.screen;
    var subScreens = pizzaOrder.orders[nextOrder].subScreens.scr.numberOfSubScreen;
    var isRoation = pizzaOrder.orders[nextOrder].subScreens.scr.isRotation
    var imageUrl = []
    if (isRoation) {
        for (let i = this.currentStep.screen * 6; i < (this.currentStep.screen * 6) + 6; i++) {
            imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[(this.currentStep.screen-1)][i])
        }
    } else {
        for (let i = 0; i < 6; i++) {
            imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[(this.currentStep.screen-1)][i])
        }
    }
    io.sockets.to(socketArr[data.screenName]).emit('broadcast', { id: "screen" + this.currentStep.screen, screenName: this.currentStep.screen , imageUrl: imageUrl, orderId: orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: orderName, pizzaTime: pizzaTime, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: subScreens, subScreen: this.currentStep.subScreen, isRotation: isRoation });
}

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
function displayOrder() {
    // console.log("pizzaOrder JSON------------",pizzaOrder.orders);

    stepCount = 0;
    screenCount = stepCount + 1;
    var imageUrl = []
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][0])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][1])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][2])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][3])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][4])
    imageUrl.push(imagePath + pizzaOrder.orders[nextOrder].images[stepCount][5])
    var imageRotationTimer = pizzaOrder.orders[nextOrder].stepTime[stepCount];
    var pizzaTime = pizzaOrder.orders[nextOrder].pizzaTime;

    var ordername = pizzaOrder.orders[nextOrder].name;
    if (socketArr.length > 4) {
        socketArr.shift();
    }



    for (var i = 0; i <= socketArr.length; i++) {
        io.sockets.to(socketArr[i]).emit('broadcast', {});

    }

    console.log("from display order --- data.screenName--------screen" + screenCount);
    io.sockets.to(socketArr[0]).emit('broadcast', { id: "screen" + screenCount, screenName: screenCount, imageUrl: imageUrl, stepCount: stepCount, orderId: pizzaOrder.orders[nextOrder].orderId, imagePath: imagePath, imageRotationTimer: imageRotationTimer, orderName: ordername, pizzaOrder: pizzaOrder.orders, subScreens: pizzaOrder.orders[nextOrder].subScreens });


}

function setCurrentStep(orderIndex) {
    if (this.currentStep.screen == 0) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.isRotation == true) {
            this.currentStep = { "screen": 1, "subScreen": 1 }
        } else {
            this.currentStep = { "screen": 1, "subScreen": 0 }
        }
    }
    if (this.currentStep.screen == 1) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.numberOfSubScreen > this.currentStep.subScreen) {
                this.currentStep = { "screen": 1, "subScreen": (this.currentStep.subScreen + 1) }
            } else {
                if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.isRotation == true) {
                    this.currentStep = { "screen": 2, "subScreen": 1 }
                } else {
                    this.currentStep = { "screen": 2, "subScreen": 0 }
                }
            }
        } else {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.isRotation == true) {
                this.currentStep = { "screen": 2, "subScreen": 1 }
            } else {
                this.currentStep = { "screen": 2, "subScreen": 0 }
            }
        }
    }
    if (this.currentStep.screen == 2) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.numberOfSubScreen > this.currentStep.subScreen) {
                this.currentStep = { "screen": 2, "subScreen": (this.currentStep.subScreen + 1) }
            } else {
                if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.isRotation == true) {
                    this.currentStep = { "screen": 3, "subScreen": 1 }
                } else {
                    this.currentStep = { "screen": 3, "subScreen": 0 }
                }
            }
        } else {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.isRotation == true) {
                this.currentStep = { "screen": 3, "subScreen": 1 }
            } else {
                this.currentStep = { "screen": 3, "subScreen": 0 }
            }
        }
    }
    if (this.currentStep.screen == 3) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.numberOfSubScreen > this.currentStep.subScreen) {
                this.currentStep = { "screen": 3, "subScreen": (this.currentStep.subScreen + 1) }
            } else {
                if (pizzaOrder.orders[orderIndex]['subScreens'].screen4.isRotation == true) {
                    this.currentStep = { "screen": 4, "subScreen": 1 }
                } else {
                    this.currentStep = { "screen": 4, "subScreen": 0 }
                }
            }
        } else {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen4.isRotation == true) {
                this.currentStep = { "screen": 4, "subScreen": 1 }
            } else {
                this.currentStep = { "screen": 4, "subScreen": 0 }
            }
        }
    }
    if (this.currentStep.screen == 4) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen4.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen4.numberOfSubScreen > this.currentStep.subScreen) {
                this.currentStep = { "screen": 4, "subScreen": (this.currentStep.subScreen + 1) }
            } else {
                console.log("no further move");
            }
        }
    }
}

function setCurrentStepForWaveOut() {
    if (this.currentStep.screen == 1) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.numberOfSubScreen <= this.currentStep.subScreen) {
                if (this.currentStep.subScreen == 1) {
                    this.currentStep = { "screen": 1, "subScreen": 1 }
                } else {
                    this.currentStep = { "screen": 1, "subScreen": (this.currentStep.subScreen - 1) }
                }
            } else {
                console.log("no privious screen");
            }
        } else {
            this.currentStep = { "screen": 1, "subScreen": 0 }
        }
    }
    if (this.currentStep.screen == 2) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.numberOfSubScreen <= this.currentStep.subScreen) {
                if (this.currentStep.subScreen == 1) {
                    if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.isRotation == true) {
                        this.currentStep = { "screen": 1, "subScreen": 1 }
                    } else {
                        this.currentStep = { "screen": 1, "subScreen": 0 }
                    }
                } else {
                    this.currentStep = { "screen": 2, "subScreen": (this.currentStep.subScreen - 1) }
                }
            }
        } else {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen1.isRotation == true) {
                this.currentStep = { "screen": 1, "subScreen": 1 }
            } else {
                this.currentStep = { "screen": 1, "subScreen": 0 }
            }
        }
    }
    if (this.currentStep.screen == 3) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.numberOfSubScreen <= this.currentStep.subScreen) {
                if (this.currentStep.subScreen == 1) {
                    if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.isRotation == true) {
                        this.currentStep = { "screen": 2, "subScreen": 1 }
                    } else {
                        this.currentStep = { "screen": 2, "subScreen": 0 }
                    }
                } else {
                    this.currentStep = { "screen": 3, "subScreen": (this.currentStep.subScreen - 1) }
                }
            }
        } else {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen2.isRotation == true) {
                this.currentStep = { "screen": 2, "subScreen": 1 }
            } else {
                this.currentStep = { "screen": 2, "subScreen": 0 }
            }
        }
    }
    if (this.currentStep.screen == 4) {
        if (pizzaOrder.orders[orderIndex]['subScreens'].screen4.isRotation == true) {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen4.numberOfSubScreen <= this.currentStep.subScreen) {
                if (this.currentStep.subScreen == 1) {
                    if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.isRotation == true) {
                        this.currentStep = { "screen": 3, "subScreen": 1 }
                    } else {
                        this.currentStep = { "screen": 3, "subScreen": 0 }
                    }
                } else {
                    this.currentStep = { "screen": 4, "subScreen": (this.currentStep.subScreen - 1) }
                }
            }
        } else {
            if (pizzaOrder.orders[orderIndex]['subScreens'].screen3.isRotation == true) {
                this.currentStep = { "screen": 3, "subScreen": 1 }
            } else {
                this.currentStep = { "screen": 3, "subScreen": 0 }
            }
        }
    }
}
http.listen(3000, function () {
    console.log('listening on *:3000');
});

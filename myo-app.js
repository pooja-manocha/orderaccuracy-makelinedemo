var Myo = require("myo");  

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
//fist, fingers_spread, wave_in, wave_out, double_tap
var pose_name = 'wave_out';
Myo.on("pose", function (pose_name) {
    switch (pose_name) {
        case "wave_in":
        case "wave_out":
            console.log("You are waving!");
            getNextOrder();
            break;
    }
});
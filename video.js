let videofeed;
let posenet;
let poses = [];
let started = false;
var audio = document.getElementById("audioElement");

//P5.js  setup() to setup the canvas for the web camera video streaming

//create the canvas using createCanvas() and provided the dimensions

function setup() {
    //creating a canvas using createCanvas() and giving the dimensions

    const canvas = createCanvas(500, 500);
    canvas.parent("video");

    videofeed = createCapture(VIDEO);
    videofeed.size(width, height);
    console.log("setup");
    //Machine actually start and perform  function and computations
    posenet = ml5.poseNet(videofeed);

    posenet.on("pose", function(results) {
        poses = results;
    });

    videofeed.hide();
    noLoop();
}

// Creating the canvas where the videofeed displayed  after the setup() function
function draw() {
    if (started) {
        image(videofeed, 0, 0, width, height);
        calEyes();
    }
}

//Start the functionality and toggle the button from start to stop
function start() {
    select("#startstop").html("stop");
    document.getElementById("startstop").addEventListener("click", stop);
    started = true;
    loop();
}

//stop the functionality and toggle the button from stop to start
function stop() {
    select("#startstop").html("start");
    document.getElementById("startstop").addEventListener("click", start);
    removeblur();
    started = false;
    noLoop();
}
//Define the keypoints used for posenet you want to capture like eyes or any body parts

var rightEye,
    leftEye,
    defaultRightEyePosition = [],
    defaultLeftEyePosition = [];

//Calculate the default positions of the elements  or keypoints
function calEyes() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            rightEye = pose.keypoints[2].position;
            leftEye = pose.keypoints[1].position;

            // keypoints are the points representing the different joints on the body recognized by posenet
            while (defaultRightEyePosition.length < 1) {
                defaultRightEyePosition.push(rightEye.y);
            }

            while (defaultLeftEyePosition.length < 1) {
                defaultLeftEyePosition.push(leftEye.y);
            }

            // if the current position of the body is too far from the original position blur function is called
            if (Math.abs(rightEye.y - defaultRightEyePosition[0]) > 20) {
                blur();
            }
            if (Math.abs(rightEye.y - defaultRightEyePosition[0]) < 20) {
                removeblur();
            }
        }
    }
}

//Define blur() function to blur the background and add audio effect
function blur() {
    document.body.style.filter = "blur(5px)";
    document.body.style.transition = "1s";
    var audio = document.getElementById("audioElement");
    console.log("change");
    audio.play();
}

//Define removeblur() function to remove the blur effect
function removeblur() {
    document.body.style.filter = "blur(0px)";
    var audio = document.getElementById("audioElement");

    audio.pause();
}
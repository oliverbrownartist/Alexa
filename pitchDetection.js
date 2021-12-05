// the structure and syntax of this code is adapted from the "Pitch Detection" example in the ML5 reference
// URL: https://learn.ml5js.org/#/reference/pitch-detection
// URL: https://editor.p5js.org/ml5/sketches/H8iUid_ADl
// credit also to Daniel Schiffman and Coding Train
// URL: https://www.youtube.com/watch?v=F1OkDTUkKFo

let audioContext;
// let mic;
let newMic;
let pitch;
let gotFreq;

// function setup() {
//   noCanvas();
//   audioContext = getAudioContext();
//   mic = new p5.AudioIn();
//   mic.start(startPitch);
// }

function newPitchDetection() {
  audioContext = getAudioContext();
  newMic = new p5.AudioIn();
  newMic.start(startPitch);
}

function startPitch() {
  console.log('pitch detection started');
  // pitch = ml5.pitchDetection('./crepe/', audioContext , mic.stream, modelLoaded);
  pitch = ml5.pitchDetection('./crepe/', audioContext , newMic.stream, modelLoaded);

}

function modelLoaded() {
//   select('#status').html('Model Loaded');
  console.log('pitch detection model loaded');
  getPitch();
}

function getPitch(){
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      // select('#result').html(frequency);
      // console.log(frequency);
      gotFreq = frequency;
      console.log(gotFreq);
      testPitch(gotFreq);
    } else {
      // select('#result').html('No pitch detected');
    }
    getPitch();
  })
}

function testPitch(){
    if ((targetPitch-5) <= gotFreq && gotFreq <= (targetPitch+5)){
        console.log(`Detected note = ${gotFreq}`);
        nextNote();
    }
}


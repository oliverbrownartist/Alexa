
function preload(){ // preload video/media/audio files and create DOM elements
    vid_earplug = createVideo(['assets/Alexa_earsore.mp4']); // load "earsore" video element
    vid_earplug.hide();  // disable video visibility
    vid_overdub = createVideo(['assets/Alexa_overdub.mp4']); // load "overdub" video element
    vid_overdub.hide(); // disable video visibility
    vid_binnings = createVideo(['assets/Alexa_binnings.mp4']); // load "binnings" video element (for ad #2)
    vid_binnings.hide(); // disable video visibility
    vid_brewzos = createVideo(['assets/Alexa_brewzos.mp4']); // load "brewzos" video element (for ad #3)
    vid_brewzos.hide(); // disable video visibility
    vid_academy = createVideo(['assets/Alexa_academy.mp4']) // load "academy" video element (for ad #4)
    vid_academy.hide(); // disable video visibility

    bassClef = loadImage('assets/bassClef.png'); // load bass clef image element
    trebleClef = loadImage('assets/trebleClef.png'); // load treble clef image element
    staveBrace = loadImage('assets/staveBrace.png'); // load stave brace image element
    sharp = loadImage('assets/sharp.png'); // load sharp (#) image element
    flat = loadImage('assets/flat.png'); // load flat (b) image element
    qStemUp = loadImage('assets/QuaverStem_Upright.png'); // load upwards quaver stem image element
    qStemDown = loadImage('assets/QuaverStem_Down.png'); // load downwards quaver image element

    trill = createAudio(['assets/trill.wav']); // create "level up" audio element
    barChange = createAudio(['assets/barChange.wav']); // load "new bar" audio element
    celloSuite = createAudio(['assets/celloSuite.wav']); // load audio element for the final event

    tempo_20 = loadImage('assets/tempo_20.png');
    tempo_30 = loadImage('assets/tempo_30.png');
    tempo_45 = loadImage('assets/tempo_45.png');
    tempo_58 = loadImage('assets/tempo_58.png');
    tempo_77 = loadImage('assets/tempo_77.png');
    tempo_83 = loadImage('assets/tempo_83.png');
    tempo_92 = loadImage('assets/tempo_92.png');
    tempo_101 = loadImage('assets/tempo_101.png');
}


// initialise global variables
let cnv, vid_earplug, vid_overdub, vid_binnings, vid_academy, vid_brewzos, bStart, splitString, notehead, vertSpace, targetPitch, staveRange, accRange, pitchIndex, LLParam, nStaveIndex, staveIndexConstraint; // define unassigned labels
let nextEvent = 0; // initialise nextEvent as zero
let eventIndex = 0; // helps run through event/function array as a manual override
const fundFreq = 65.41; // define the fundamental frequency for all notes (not used in this version since pitch detection temporarily disabled)
let barNotes = []; // initialise empty array to be filled every time a bar is created
let barProgress = 0; // set the initial progress through each bar to zero
let openStringNotes = [0, 4, 8, 12];
let nameString = "Nick";

//-------------------------------------------------------------------------------------------------------
//                        SETUP()
//-------------------------------------------------------------------------------------------------------
function setup(){ // called once at the start of the program
    
    cnv = createCanvas(1500,700); // create the p5 canvas with WxH dimensions
    cnv.position(windowWidth/2-750, windowHeight/2-350);
    vertSpace = (height-400)/10; // define the height of various elements within the canvas based on the height of the canvas
    colorMode(HSB, 360, 100, 100, 100); // change colour mode to hue-saturation-brightness with custom parameter scales
}

//-------------------------------------------------------------------------------------------------------
//                        OTHER FUNCTIONS
//-------------------------------------------------------------------------------------------------------

// credit: James Hibbard (https://www.sitepoint.com/delay-sleep-pause-wait/)
function sleep(ms) { // take arg in milliseconds
  return new Promise(resolve => setTimeout(resolve, ms)); // delay program until defined time has elapsed
}

function keyPressed(){
    if (key === 's'){ // if designated "START" key pressed
        event0(); // begin first event (i.e. start piece)
    }
    else if (key === 'q'){
        functionArray[eventIndex+1](); // manual override, progress to the next event
    }
    else if (key === 'p'){
        nextNote(); // manual override, progress to the next note
    }
}

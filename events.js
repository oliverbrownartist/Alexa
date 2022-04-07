/*

LIST OF EVENTS

-Due to (Chrome) Web API difficulties with autoplay and AudioContext, the only way to get so many p5.Speech/p5.SpeechRec object into the program has been to initialise a new instance of these objects whenever required
- This is clunky but unavoidable
- They are also very fickle, and simply don't respond to some callback functions
- Their "onended"/"onEnd" events also don't flag properly - it only seems to happen after the first two instances, so it must be an overload sort of problem (the most likely problem was that they were set to loop...but they don't loop, and I tried manually unsetting it as well to no avail)
- The best workaround I could find was to manually measure and input some SLEEP functions to keep the onEnd calls from triggering straightaway
- Otherwise, the metastructure of the events is essentially just a long daisy-chain
- Each event calls the subsequent event at the end of its block
- Sometimes (for "BAR" events) this is called within the createBar() method, instances of which organise all musical notes.

CREDITS SPECIFIC TO EVENTS.js:
the p5.speech reference, while not exhaustive, was something I naturally used a lot!
- p5.Speech reference: https://idmnyu.github.io/p5.js-speech/ (note: can be frustratingly sparse at times, some flags/properties seem to have been deprecated)
- Daniel Schiffman's Coding Train tutorial: https://thecodingtrain.com/learning/programming-with-text/10.4-speech-recognition.html 

*/

function event0(){     // LISTEN: <music>
    console.log("EVENT 0"); // log the beginning of new event
    eventIndex = 0;
    console.log("listening for: music"); // log the target word
    speechRec0 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec0.start(); // begin speech recognition
    console.log(`speechRec0 started`); // log that the recognition has started
    speechRec0.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec0.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "music"){ // if an interpreted word matches the target word
                    console.log("Success: music"); // log that the target word has been recognised
                    event1(); // proceed to event 1
                }
            }
    };
}

function event1(){ // SPEAK: INTRO  
    console.log("EVENT 1"); // log the beginning of new event
    eventIndex = 1;
    speak1 = new p5.Speech(); // initialise new speech synthesis object
    speak1.speak( // begin 'utterance' of the text/script below
        `Hi ${nameString}!. Please wait while I compose you some sight reading for your rehearsal today. Reminder: your target rehearsal duration is twenty minutes.`
        );
    speak1.speak(`While I'm working, you might want to check the tuning on that dee string. OK, I\'m ready now. When you are ready to begin your first passage, say, "ready".`);
    sleep(20000).then(() => { // wait until 15s have elapsed
        console.log("(SLEEP) ENDED 2"); // log end of wait
        event2(); // proceed to event 2
    });
}

function event2(){ // LISTEN: <ready>
    eventIndex = 2;
    console.log("EVENT 2"); // log the beginning of new event
    console.log("listening for: ready"); // log the target word
    speechRec2 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec2.start(); // begin speech recognition
    console.log(`speechRec0 started`); // log that the recognition has started
    speechRec2.onResult = function(){ // fires once words recognised and sentence is complete
        
        splitString = speechRec2.resultString.split(" "); // split the words spoken/recognised into an array of individual words
        let targetSuccess = false;
        
        for(n=0; n<splitString.length; n++){ // iterate across each word in the array
            if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                console.log("Success: ready"); // log that the target word has been recognised
                // event3(); // proceed to event 3
                targetSuccess = true;
                event3(); // take this out if using the listenAgain() below
            }
        }

        // if (targetSuccess){event3()}
        // else {listenAgain()}
    };
}

function event3(){ // BAR 0.0
    console.log("EVENT 3"); // log the beginning of new event
    eventIndex = 3;
    // 3 n/b, crotchet only, no acc, bottom 2 open strings only
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    metro20.loop();
    nextEvent = 4; // define the next event (called within barNotes.js) as event 4
    staveIndexConstraint = 0; 
    createBar(2, 0, 4, 0, 0, false); // create new bar (function defined/described in staveNotes.js)
    image(tempo_20, 150, 65, 200, 110);
}  

function event4(){ // BAR 0.1
    console.log("EVENT 4"); // log the beginning of new event
    eventIndex = 4;
    // 3 n/b, crotchet only, no acc, bottom 2 open strings only
    // no DBL
    barChange.play(); // play the "new-bar" sound effect **NOTE** will not play if same sound is already playing (i.e. if you are using "p" to quickly scroll through - obviously would not be a problem if cellist playing through in time)
    nextEvent = 5; // define the next event (called within barNotes.js) as event 5
    staveIndexConstraint = 0; 
    createBar(2, 0, 4, 0, 0, false); // create new bar (function defined/described in staveNotes.js)
    image(tempo_20, 150, 65, 200, 110);
}

function event5(){ // BAR 0.2
    console.log("EVENT 5"); // log the beginning of new event
    eventIndex = 5;
    // 3 n/b, crotchet only, no acc, bottom 2 open strings only
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 6; // define the next event (called within barNotes.js) as event 6
    staveIndexConstraint = 0; 
    createBar(2, 0, 4, 0, 0, true) // create new bar (function defined/described in staveNotes.js)
    image(tempo_20, 150, 65, 200, 110);
} 

function event6(){ // LEVEL-UP
    console.log("EVENT 6"); // log the beginning of new event
    metro20.stop();
    eventIndex = 6;
    // synth: let's add some more strings
    trill.play(); // play "level-up" sound effect
    newStaves(); // drawn new blank staves
    speak6 = new p5.Speech(); // initialise new speech synthesis object
    speak6.speak(   // begin 'utterance' of the text/script below
        'Let\’s add some more strings! When you are ready to continue, say, “ready”.'
        );
    sleep(5000).then(() => { // wait until 6s have elapsed
        console.log("(SLEEP) ENDED 6"); // log end of wait
        event7();  // proceed to event 7
    });
} 

function event7(){ // LISTEN: <ready>
    console.log("EVENT 7"); // log the beginning of new event
    eventIndex = 7;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec7 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec7.start(); // begin speech recognition
    console.log("speechRec7 started"); // log that the recognition has started
    speechRec7.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec7.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event8(); // proceed to event 8
                }
            }
    };
}

function event8(){ // BAR 0.3
    console.log("EVENT 8"); // log the beginning of new event
    eventIndex = 8;
    // 4 n/b, crotchet only, no acc, any open string
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    metro30.loop();
    nextEvent = 9; // define the next event (called within barNotes.js) as event 9
    staveIndexConstraint = 1; 
    createBar(4, 0, 9, 0, 0, false);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_30, 150, 65, 200, 110);
}

function event9(){ // BAR 0.4
    console.log("EVENT 9"); // log the beginning of new event
    eventIndex = 9;
    // 4 n/b, crotchet only, no acc, any open string
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 10; // define the next event (called within barNotes.js) as event 10
    staveIndexConstraint = 1; 
    createBar(4, 0, 9, 0, 0, false); // create new bar (function defined/described in staveNotes.js)
    image(tempo_30, 150, 65, 200, 110);
}

function event10(){ // BAR 0.5
    console.log("EVENT 10"); // log the beginning of new event
    eventIndex = 10;
    // 4 n/b, crotchet only, no acc, any open string
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 11; // define the next event (called within barNotes.js) as event 11
    staveIndexConstraint = 1; 
    createBar(4, 0, 9, 0, 0, true); // create new bar (function defined/described in staveNotes.js)
    image(tempo_30, 150, 65, 200, 110);
}

function event11(){ // LEVEL-UP
    console.log("EVENT 11"); // log the beginning of new event
    eventIndex = 11;
    metro30.stop();
    // synth: you're doing great...
    trill.play(); // play "level-up" sound effect
    newStaves(); // drawn new blank staves
    speak11 = new p5.Speech(); // initialise new speech synthesis object
    speak11.speak(   // begin 'utterance' of the text/script below
        'You\’re doing great! Now let\’s see you really surf that fingerboard. When you are ready to continue, say, “ready.”'
        );
    sleep(7000).then(() => { // wait until 7s have elapsed
        console.log("(SLEEP) ENDED 11"); // log end of wait
        event12(); // proceed to event 12
    });
}      

function event12(){ // LISTEN: <ready>
    console.log("EVENT 12"); // log the beginning of new event
    eventIndex = 12;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec12 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec12.start(); // begin speech recognition
    console.log("speechRec12 started"); // log that the recognition has started
    speechRec12.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec12.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event13(); // proceed to event 13
                }
            }
    };
}

function event13(){ // BAR 0.6
    console.log("EVENT 13"); // log the beginning of new event
    eventIndex = 13;
    // 5 n/b, crotchet only, no acc, any notes
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    metro45.loop();
    nextEvent = 14; // define the next event (called within barNotes.js) as event 14
    staveIndexConstraint = 2;
    createBar(5, 0, 25, 0, 0, false); // create new bar (function defined/described in staveNotes.js)
    image(tempo_45, 150, 65, 200, 110);
}

function event14(){ // BAR 0.7
    console.log("EVENT 14"); // log the beginning of new event
    eventIndex = 14;
    // 5 n/b, crotchet only, no acc, any notes
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 15; // define the next event (called within barNotes.js) as event 15
    staveIndexConstraint = 2;
    createBar(5, 0, 25, 0, 0, false); // create new bar (function defined/described in staveNotes.js)
    image(tempo_45, 150, 65, 200, 110);
}

function event15(){ // BAR 0.8
    console.log("EVENT 15"); // log the beginning of new event
    eventIndex = 15;
    // 5 n/b, crotchet only, no acc, any notes
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 16; // define the next event (called within barNotes.js) as event 16 (actually 16a)
    staveIndexConstraint = 2;
    createBar(5, 0, 25, 0, 0, true); // create new bar (function defined/described in staveNotes.js)
    image(tempo_45, 150, 65, 200, 110);
}

function event16a(){ // PRE-AD MESSAGE #0
    console.log("EVENT 16a"); // log the beginning of new event
    eventIndex = 16;
    metro45.stop();
    newStaves(); // drawn new blank staves
    speak16 = new p5.Speech(); // initialise new speech synthesis object
    speak16.speak(   // begin 'utterance' of the text/script below
        'Since you have chosen not to upgrade to premium, we will now have a brief message from our sponsors.'
        );
    sleep(6500).then(() => { // wait until 6.5s have elapsed
        console.log("(SLEEP) ENDED 16a"); // log end of wait
        event16(); // proceed to event 16
    });
}

function event16(){ // ADVERTISEMENT #0 (EARPLUGS)
    console.log("EVENT 16"); // log the beginning of new event
    eventIndex = 17;
    // play video
    cnv.hide();
    vid_earplug.show(); // make the video visible
    vid_earplug.volume(1); // set volume to maximum
    vid_earplug.play(); // play the video
    vid_earplug.size(1440,810); // set video size (W,H)
    vid_earplug.position(windowWidth/2-720, windowHeight/2-405);
   
    // commenting this out since was happening too quickly
//     sleep(7500).then(() => { // wait until 7.5s have elapsed
//         vid_earplug.hide(); // disable video visibility
        // event17(); // proceed to event 17
        
//     });
}

function event17(){ // CHECKPOINT #0
    console.log("EVENT 17"); // log the beginning of new event
    eventIndex = 18;
    cnv.show();
    vid_earplug.hide();
    newStaves(); // draw new blank staves
    speak17 = new p5.Speech(); // initialise new speech synthesis object
    speak17.speak(   // begin 'utterance' of the text/script below
        'To continue, say “Ear-sore earplugs”.'
        );
    sleep(3000).then(() => { // wait until 5s have elapsed
        console.log("(SLEEP) ENDED 17"); // log end of wait
        event18();  // proceed to event 18
    });
}

function event18(){ // LISTEN: <earplugs>
    console.log("EVENT 18"); // log the beginning of new event
    eventIndex = 19;
    console.log(getAudioContext());
    console.log("listening for: earplugs"); // log the target word
    speechRec18 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec18.start(); // begin speech recognition
    console.log("speechRec18 started"); // log that the recognition has started
    speechRec18.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec18.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "earplugs" || splitString[n] == "earplug" || splitString[n] == "plugs" || splitString[n] == "plug"){ // if an interpreted word matches the target word (or a similar word, manually included to prevent against machine mis-hears/errors)
                    console.log("Success: earplugs"); // log that the target word has been recognised
                    event19(); // proceed to event 19
                }
            }
    };
}

function event19(){ // TARGET + LEVEL-UP
    console.log("EVENT 19"); // log the beginning of new event
    eventIndex = 20;
    trill.play(); // play "level-up" sound effect
    speak19 = new p5.Speech(); // initialise new speech synthesis object
    speak19.speak(   // begin 'utterance' of the text/script below
        'Nice work! You\’re 15 percent of the way to your daily practice target. Now let\’s see you work your inner metronome. When you are ready to continue, say, “ready.”'
        );
    sleep(10000).then(() => { // wait until 10s have elapsed
        console.log("(SLEEP) ENDED 19"); // log end of wait
        event20(); // proceed to event 20
    });
}

function event20(){ // LISTEN: <ready>
    console.log("EVENT 20"); // log the beginning of new event
    eventIndex = 21;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec20 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec20.start(); // begin speech recognition
    console.log("speechRec20 started"); // log that the recognition has started
    speechRec20.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec20.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event21(); // move to event 21
                }
            }
    };
}

function event21(){ // BAR 1.0
    console.log("EVENT 21"); // log the beginning of new event
    eventIndex = 22;
    //6 n/b, crotchet/minim, no acc, any
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    metro58.loop();
    nextEvent = 22; // define the next event (called within barNotes.js) as event 22
    staveIndexConstraint = 2;
    createBar(6, 0, 25, 0, 2, false);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_58, 150, 65, 200, 110);
}

function event22(){ // BAR 1.0
    console.log("EVENT 22"); // log the beginning of new event
    eventIndex = 23;
    //6 n/b, crotchet/minim, no acc, any
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 23; // define the next event (called within barNotes.js) as event 23
    staveIndexConstraint = 2;
    createBar(6, 0, 25, 0, 2, false);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_58, 150, 65, 200, 110);
}

function event23(){ // BAR 1.0
    console.log("EVENT 23"); // log the beginning of new event
    eventIndex = 24;
    //6 n/b, crotchet/minim, no acc, any
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 24; // define the next event (called within barNotes.js) as event 24
    staveIndexConstraint = 2;
    createBar(6, 0, 25, 0, 2, true);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_58, 150, 65, 200, 110);
}

function event24(){ // LEVEL-UP
    console.log("EVENT 24"); // log the beginning of new event
    eventIndex = 25;
    metro58.stop();
    trill.play(); // play "level-up" sound effect
    newStaves(); // drawn new blank staves
    speak24 = new p5.Speech(); // initialise new speech synthesis object
    speak24.speak(   // begin 'utterance' of the text/script below
        `Good work, ${nameString}! We\’ve got some more rhythmic variation coming in hot. When you are ready to continue, say, “ready.”`
        );
    sleep(6000).then(() => { // wait until 6s have elapsed
        console.log("(SLEEP) ENDED 24"); // log end of wait
        event25(); // proceed to event 25
    });
}

function event25(){ // LISTEN: <ready>
    console.log("EVENT 25"); // log the beginning of new event
    eventIndex = 26;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec25 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec25.start(); // begin speech recognition
    console.log("speechRec25 started"); // log that the recognition has started
    speechRec25.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec25.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event26(); // proceed to event 26
                }
            }
    };
}

function  event26(){ // BAR 1.3
    console.log("EVENT 26"); // log the beginning of new event
    eventIndex = 27;
    // 7 n/b, any, no acc, any
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    metro77.loop();
    nextEvent = 27; // define the next event (called within barNotes.js) as event 27
    staveIndexConstraint = 2;
    createBar(7, 0, 25, 0, 3, false);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_77, 150, 65, 200, 110);
}

function  event27(){ // BAR 1.4
    console.log("EVENT 27"); // log the beginning of new event
    eventIndex = 28;
    // 7 n/b, any, no acc, any
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 28; // define the next event (called within barNotes.js) as event 28
    staveIndexConstraint = 2;
    createBar(7, 0, 25, 0, 3, false);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_77, 150, 65, 200, 110);
}

function  event28(){ // BAR 1.5
    console.log("EVENT 28"); // log the beginning of new event
    eventIndex = 29;
    // 7 n/b, any, no acc, any
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 29; // define the next event (called within barNotes.js) as event 29 (actually 29a)
    staveIndexConstraint = 2;
    createBar(7, 0, 25, 0, 3, true);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_77, 150, 65, 200, 110);
}

function event29a(){ // PRE-AD MESSAGE #1
    console.log("EVENT 29a"); // log the beginning of new event
    eventIndex = 30;
    metro77.stop();
    newStaves(); // drawn new blank staves
    speak29 = new p5.Speech(); // initialise new speech synthesis object
    speak29.speak(   // begin 'utterance' of the text/script below
        'Since you have chosen not to upgrade to premium, we will now have a brief message from our sponsors.'
        );
    sleep(6500).then(() => { // wait until 6.5s have elapsed
        console.log("(SLEEP) ENDED 29a"); // log end of wait
        event29(); // proceed to event 29
    });
}

function event29(){ // ADVERTISEMENT #1 (OVERDUB)
    // CREDIT: Arctic Monkeys, "The World's First Ever Monster Truck Front Flip" (Tranquility Base Hotel and Casino, 2018, Domino Records)
    // Via Official Arctic Monkeys YouTube/Vevo account (does Vevo exist anymore?): https://www.youtube.com/watch?v=kwQT4jnbAso
    console.log("EVENT 29"); // log the beginning of new event
    eventIndex = 31;
    // play video
    cnv.hide();
    background(0);
    vid_overdub.show(); // make the video visible
    vid_overdub.volume(1); // set volume to maximum
    vid_overdub.play(); // play the video
    vid_overdub.size(1440,810); // set video size (W,H)
    vid_overdub.position(windowWidth/2-720, windowHeight/2-405);
    // commenting out for now
//     sleep(29000).then(() => { // wait until 29s have elapsed
//         vid_overdub.hide(); // disable video visibility
//         event30();  // proceed to event 30
//     });
}

function event30(){ // CHECKPOINT #1
    console.log("EVENT 30"); // log the beginning of new event
    eventIndex = 32;
    console.log(getAudioContext());
    vid_overdub.hide();
    cnv.show();
    newStaves(); // drawn new blank staves
    speak30 = new p5.Speech(); // initialise new speech synthesis object
    speak30.speak(   // begin 'utterance' of the text/script below
        'To continue, say “you! do the rest!”' // strange punctuation for better synthesis cadence/pronunciation
        );
    sleep(4000).then(() => { // wait until 4s have elapsed
        console.log("(SLEEP) ENDED 30"); // log end of wait
        event31(); // proceed to event 31
    });
}

function event31(){ // LISTEN: <ready>
    console.log("EVENT 31"); // log the beginning of new event
    eventIndex = 33;
    console.log(getAudioContext());
    console.log("listening for: rest"); // log the target word
    speechRec31 = new p5.SpeechRec();  // initialise a new speech recognition object
    speechRec31.start(); // begin speech recognition
    console.log("speechRec31 started"); // log that the recognition has started
    speechRec31.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec31.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "rest"){ // if an interpreted word matches the target word
                    console.log("Success: rest"); // log that the target word has been recognised
                    event32(); // proceed to event 32
                }
            }
    };
}

function event32(){ // TARGET + LEVEL-UP
    console.log("EVENT 32"); // log the beginning of new event
    eventIndex = 34;
    trill.play(); // play "level-up" sound effect
    speak32 = new p5.Speech(); // initialise new speech synthesis object
    speak32.speak(   // begin 'utterance' of the text/script below
        'Keep going! You\’re 24 percent of the way to your daily practice target. Let\’s add some intentional accidentals. When you are ready to continue, say “ready”.'
        );
    sleep(7000).then(() => { // wait until 7s have elapsed
        console.log("(SLEEP) ENDED 32"); // log end of wait
        event33(); // proceed to event 33
    });
}

function event33(){ // LISTEN: <ready>
    console.log("EVENT 33"); // log the beginning of new event
    eventIndex = 35;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec33 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec33.start(); // begin speech recognition
    console.log("speechRec33 started"); // log that the recognition has started
    speechRec33.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec33.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event34(); // proceed to event 34
                }
            }
    };
}

function event34(){ // BAR 2.0
    console.log("EVENT 34"); // log the beginning of new event
    eventIndex = 36;
    // 8 n/b, any, nat/flat, any
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    metro83.loop();
    nextEvent = 35; // define the next event (called within barNotes.js) as event 35
    staveIndexConstraint = 2;
    createBar(8, 0, 25, 3, 3, false); // create new bar (function defined/described in staveNotes.js)
    image(tempo_83, 150, 65, 200, 110);
}

function event35(){ // BAR 2.1
    console.log("EVENT 35"); // log the beginning of new event
    eventIndex = 37;
    // 8 n/b, any, nat/flat, any
    // no DBL
    barChange.play(); // play the "new-bar" sound effect
    nextEvent = 36; // define the next event (called within barNotes.js) as event 36 (actually 36a)
    staveIndexConstraint = 2;
    createBar(8, 0, 25, 3, 3, true); // create new bar (function defined/described in staveNotes.js)
    image(tempo_83, 150, 65, 200, 110);
}

function event36a(){ // PRE-AD MESSAGE #2
    console.log("EVENT 36a"); // log the beginning of new event
    eventIndex = 38;
    metro83.stop();
    newStaves(); // drawn new blank staves
    speak36 = new p5.Speech(); // initialise new speech synthesis object
    speak36.speak(   // begin 'utterance' of the text/script below
        'Since you have chosen not to upgrade to premium, we will now have a brief message from our sponsors.'
        );
        sleep(6500).then(() => { // wait until 6.5s have elapsed
            console.log("(SLEEP) ENDED 36a"); // log end of wait
            event36(); // proceed to event 36
        });
}

function event36(){ // ADVERTISEMENT #2 (BINNINGS)
    // CREDITS FOR BINNINGS AUDIO/FOOTAGE
    // jingle: https://www.youtube.com/watch?v=-zlsjzT7n9A&list=PLym0EyLoIrRNiMx_4q3IOVo_WZNWsMMuw&index=1
    // face-swap footage: https://www.youtube.com/watch?v=8LVMu0_4lV8
    console.log("EVENT 36"); // log the beginning of new event
    eventIndex = 39;
    // play video
    cnv.hide();
    vid_binnings.show(); // make the video visible
    vid_binnings.volume(1); // set volume to maximum
    vid_binnings.play(); // play the video
    vid_binnings.size(1440,810); // set video size (W,H)
    vid_binnings.position(windowWidth/2-720, windowHeight/2-405);
    // commenting out for now
//     sleep(32000).then(() => { // wait until 32s have elapsed
//         vid_binnings.hide(); // disable video visibility
//         event37(); // proceed to event 37
//     });
}

function event37(){ // CHECKPOINT #2
    console.log("EVENT 37"); // log the beginning of new event
    eventIndex = 40;
    vid_binnings.hide();
    cnv.show();
    newStaves(); // drawn new blank staves
    speak37 = new p5.Speech(); // initialise new speech synthesis object
    speak37.speak(   // begin 'utterance' of the text/script below
        'To continue, say “I need new gear”.'
        );
    sleep(4000).then(() => { // wait until 4s have elapsed
        console.log("(SLEEP) ENDED 37"); // log end of wait
        event38(); // proceed to event 38
    });
}

function event38(){ // LISTEN: <gear>
    console.log("EVENT 38"); // log the beginning of new event
    eventIndex = 41;
    console.log(getAudioContext());
    console.log("listening for: gear"); // log the target word
    speechRec38 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec38.start(); // begin speech recognition
    console.log("speechRec38 started"); // log that the recognition has started
    speechRec38.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec38.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "gear" || splitString[n] == "ear"){ // if an interpreted word matches the target word (or a similar word, manually included to prevent against machine mis-hears/errors)
                    console.log("Success: gear"); // log that the target word has been recognised
                    event39(); // proceed to event 39
                }
            }
    };
}

function event39(){ // TARGET
    console.log("EVENT 39"); // log the beginning of new event
    eventIndex = 42;
    // synth: You're 28% of the way
    trill.play(); // play "level-up" sound effect
    speak39 = new p5.Speech(); // initialise new speech synthesis object
    speak39.speak(   // begin 'utterance' of the text/script below
        'You\’re 28 percent of the way to your daily practice target, but it\’s only going to get harder from here. When you are ready to continue, say “ready.”'
        );
    sleep(7000).then(() => { // wait until 7s have elapsed
        console.log("(SLEEP) ENDED 39"); // log end of wait
        event40(); // proceed to event 40
    });
}

function event40(){ // LISTEN: <ready>
    console.log("EVENT 40"); // log the beginning of new event
    eventIndex = 43;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec40 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec40.start(); // begin speech recognition
    console.log("speechRec40 started"); // log that the recognition has started
    speechRec40.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec40.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event41(); // proceed to event 41
                }
            }
    };
}

function event41(){ // BAR 3.0
    console.log("EVENT 41"); // log the beginning of new event
    eventIndex = 44;
    // 9 n/b, any, any, any
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    metro92.loop();
    nextEvent = 42; // define the next event (called within barNotes.js) as event 42 (actually 42a)
    staveIndexConstraint = 3;
    createBar(9, 0, 25, 3, 3, true);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_92, 150, 65, 200, 110);
}

function event42a(){ // PRE-AD MESSAGE #3
    console.log("EVENT 42a"); // log the beginning of new event
    eventIndex = 45;
    metro92.stop();
    // synth: to continue
    newStaves(); // drawn new blank staves
    speak42 = new p5.Speech(); // initialise new speech synthesis object
    speak42.speak(   // begin 'utterance' of the text/script below
        'Since you have chosen not to upgrade to premium, we will now have a brief message from our sponsors.'
        );
    sleep(6500).then(() => { // wait until 6.5s have elapsed
        console.log("(SLEEP) ENDED 42a"); // log end of wait
        event42(); // proceed to event 42
    });
}

function event42(){ // ADVERTISEMENT #3 (BREWZOS)
    console.log("EVENT 42"); // log the beginning of new event
    eventIndex = 46;
    // play video
    cnv.hide();
    vid_brewzos.show(); // make the video visible
    vid_brewzos.volume(1); // set volume to maximum
    vid_brewzos.play(); // play the video
    vid_brewzos.size(1440,810); // set video size (W,H)
    vid_brewzos.position(windowWidth/2-720, windowHeight/2-405);
    // commenting out for now
//     sleep(28000).then(() => {  // wait until 28s have elapsed
//         vid_brewzos.hide(); // disable video visibility
//         event43(); // proceed to event 43
//     });
}

function event43(){ // CHECKPOINT #3
    console.log("EVENT 37"); // log the beginning of new event
    eventIndex = 47;
    // synth: to continue...
    vid_brewzos.hide();
    cnv.show();
    newStaves(); // drawn new blank staves
    speak43 = new p5.Speech(); // initialise new speech synthesis object
    speak43.speak(   // begin 'utterance' of the text/script below
        'To continue, say “Play worse”.'
        );
    sleep(3500).then(() => { // wait until 3.5s have elapsed
        console.log("(SLEEP) ENDED 43"); // log end of wait
        event44(); // proceed to event 44
    });
}

function event44(){ // LISTEN: <worse>
    console.log("EVENT 44"); // log the beginning of new event
    eventIndex = 48;
    console.log(getAudioContext());
    console.log("listening for: worse"); // log the target word
    speechRec44 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec44.start(); // begin speech recognition
    console.log("speechRec44 started"); // log that the recognition has started
    speechRec44.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec44.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "worse" || splitString[n] == "wars" || splitString[n] == "were" || splitString[n] == "worst"){ // if an interpreted word matches the target word (or a similar word, manually included to prevent against machine mis-hears/errors)
                    console.log("Success: worse"); // log that the target word has been recognised
                    event45(); // proceed to event 45
                }
            }
    };
}

function event45(){ // TARGET
    console.log("EVENT 45"); // log the beginning of new event
    eventIndex = 49;
    // synth: Keep going! 29%
    trill.play(); // play "level-up" sound effect
    speak45 = new p5.Speech(); // initialise new speech synthesis object
    speak45.speak(   // begin 'utterance' of the text/script below
        'Keep going! You\’re 29 percent of the way to your daily practice target. When you are ready to continue, say “ready”.'
        );
    sleep(7000).then(() => { // wait until 7s have elapsed
        console.log("(SLEEP) ENDED 45"); // log end of wait
        event46(); // proceed to event 46
    });
}

function event46(){ // LISTEN: <ready>
    console.log("EVENT 46"); // log the beginning of new event
    eventIndex = 50;
    console.log(getAudioContext());
    console.log("listening for: ready"); // log the target word
    speechRec46 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec46.start(); // begin speech recognition
    console.log("speechRec46 started"); // log that the recognition has started
    speechRec46.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec46.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "ready"){ // if an interpreted word matches the target word
                    console.log("Success: ready"); // log that the target word has been recognised
                    event47(); // proceed to event 47
                }
            }
    };
}

function event47(){ // BAR 3.0
    console.log("EVENT 47"); // log the beginning of new event
    eventIndex = 51;
    // 10 n/b, any, any, any
    // yes DBL
    barChange.play(); // play the "new-bar" sound effect
    metro101.loop();
    nextEvent = 48; // define the next event (called within barNotes.js) as event 48 (actually 48a)
    staveIndexConstraint = 3;
    createBar(10, 0, 25, 2, 3, true);  // create new bar (function defined/described in staveNotes.js)
    image(tempo_101, 150, 65, 200, 110);
}

function event48a(){ // PRE-AD MESSAGE #4
    console.log("EVENT 48a"); // log the beginning of new event
    eventIndex = 52;
    metro101.stop();
    // synth: to continue
    newStaves(); // drawn new blank staves
    speak48 = new p5.Speech(); // initialise new speech synthesis object
    speak48.speak(   // begin 'utterance' of the text/script below
        'Since you have chosen not to upgrade to premium, we will now have a brief message from our sponsors.'
        );
    sleep(6500).then(() => { // wait until 6.5s have elapsed
        console.log("(SLEEP) ENDED 48a"); // log end of wait
        event48(); // proceed to event 48
    });
}

function event48(){ // ADVERTISEMENT #4 (ACADEMY)
    console.log("EVENT 48"); // log the beginning of new event
    eventIndex = 53;
    // play video
    cnv.hide();
    vid_academy.show(); // make the video visible
    vid_academy.volume(1); // set volume to maximum
    vid_academy.play(); // play the video
    vid_academy.size(1440,810); // set video size (W,H)
    vid_academy.position(windowWidth/2-720, windowHeight/2-405);
    // commenting out for now
//     sleep(39000).then(() => { // wait until 39s have elapsed
//         vid_academy.hide(); // disable video visibility
//         event49(); // proceed to event 49
//     });
}

function event49(){ // CHECKPOINT #4
    console.log("EVENT 49"); // log the beginning of new event
    eventIndex = 54;
    vid_academy.hide();
    cnv.show();
    newStaves(); // drawn new blank staves
    // synth: to continue...
    speak49 = new p5.Speech(); // initialise new speech synthesis object
    speak49.speak(   // begin 'utterance' of the text/script below
        'To continue, say “I need a new career”.'
        );
    sleep(4500).then(() => { // wait until 4.5s have elapsed
        console.log("(SLEEP) ENDED 49"); // log end of wait
        event50(); // proceed to event 50
    });
}

function event50(){ // LISTEN: <career>
    console.log("EVENT 50"); // log the beginning of new event
    eventIndex = 55;
    console.log(getAudioContext());
    console.log("listening for: career"); // log the target word
    speechRec50 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec50.start(); // begin speech recognition
    console.log("speechRec50 started"); // log that the recognition has started
    speechRec50.onResult = function(){  // fires once words recognised and sentence is complete
        splitString = speechRec50.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "career" || splitString[n] == "ear" || splitString[n] == "rear"){ // if an interpreted word matches the target word (or a similar word, manually included to prevent against machine mis-hears/errors)
                    console.log("Success: career"); // log that the target word has been recognised
                    event51(); // proceed to event 51
                }
            }
    };
}

function event51(){ // SUGGESTION 1/2 (2 suggestions used to avoid audio overflow at ~ 20s)
    console.log("EVENT 51"); // log the beginning of new event
    eventIndex = 56;
    // synth: David, I've noticed...
    newStaves(); // drawn new blank staves
    speak51 = new p5.Speech(); // initialise new speech synthesis object
    speak51.speak(   // begin 'utterance' of the text/script below
        `${nameString}, I’ve noticed that you seem to be playing less and less notes. Perhaps today isn’t your day for practicing, and you should simply give up.`
        );
    sleep(8000).then(() => { // wait until 8s have elapsed
        console.log("(SLEEP) ENDED 51"); // log end of wait
        event52(); // proceed to event 52
    });
}

function event52(){ // SUGGESTION 2/2 (2 suggestions used to avoid audio overflow at ~ 20s)
    console.log("EVENT 52"); // log the beginning of new event
    eventIndex = 57;
    // synth: It's ok to fail...
    speak52 = new p5.Speech(); // initialise new speech synthesis object
    speak52.speak(   // begin 'utterance' of the text/script below
        `It’s ok to fail. Don’t worry, ${nameString}. To quit, say “I quit.”`
        );
    sleep(6000).then(() => { // wait until 6s have elapsed
        console.log("(SLEEP) ENDED 52"); // log end of wait
        event53(); // proceed to event 53
    });
}

function event53(){ // LISTEN: <quit>
    console.log("EVENT 53"); // log the beginning of new event
    eventIndex = 58;
    console.log(getAudioContext());
    console.log("listening for: quit"); // log the target word
    speechRec53 = new p5.SpeechRec(); // initialise a new speech recognition object
    speechRec53.start(); // begin speech recognition
    console.log("speechRec53 started"); // log that the recognition has started
    speechRec53.onResult = function(){ // fires once words recognised and sentence is complete
        splitString = speechRec53.resultString.split(" "); // split the words spoken/recognised into an array of individual words
            for(n=0; n<splitString.length; n++){ // iterate across each word in the array
                if(splitString[n] == "quit"){ // if an interpreted word matches the target word
                    console.log("Success: quit"); // log that the target word has been recognised
                    event54(); // proceed to event 54
                }
            }
    };
}

function event54(){ // SPEAK: ALEXA TO ALEXA
    console.log("EVENT 54"); // log the beginning of new event
    eventIndex = 59;
    // synth: Alexa to Alexa
    speak54 = new p5.Speech(); // initialise new speech synthesis object
    speak54.speak(   // begin 'utterance' of the text/script below
        'Alexa to Alexa: play some music from a cellist who didn’t skip their practices.'
        );
    sleep(6000).then(() => { // wait until 6s have elapsed
        console.log("(SLEEP) ENDED 54"); // log end of wait
        event55(); // proceed to event 55
    });
}

function event55(){ // YO-YO MA ON CELLO
    console.log("EVENT 55"); // log the beginning of new event
    eventIndex = 60;
    // play audio
    celloSuite.play(); // play the cello suite recording
}

// function listenAgain(){
//     console.log("EVENT listen again");
//     speakListenAgain = new p5.Speech();
//     speakListenAgain.speak(
//         `I\'m sorry, ${nameString}, I didn't quite catch that. Please repeat it now.`
//     );
//     sleep(6000).then(() => {
//         console.log("(SLEEP) ENDED listening again");
//         functionArray[eventIndex]();
//     }
//     )
// }

// --------------------------------------------------------------------------
//                              !! END !!
// --------------------------------------------------------------------------

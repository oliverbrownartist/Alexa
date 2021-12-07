/* THIS FILE DEFINES MOST OF THE FUNCTIONALITY FOR staveNotes.js
OTHER FILES USED:
- noteMap.js
IT INCLUDES ALL THE FUNCTIONS FOR DRAWING NEW STAVES, NOTES AND ANIMATIONS (GREEN/YELLOW)

--------------------------------------------------------------------------------------------------------

ABBREVIATIONS/LABELS USED IN NOTE PARAMETERS:

<notePop> = NOTE POPULATION = The number of notes in the bar
<xIndex> = X INDEX = Position of note in progression of bar (i.e. left to right)

<staveIndex> = STAVE INDEX = Vertical position of note on grand (10-line) stave
    *NOTE:
    - does NOT correspond linearly to pitchIndex or tonal increments, since Western notation uses a non-linear symbolic mapping of pitch to height
    - (i.e. consider how a standard piano/keyboard layout is asymmetrical with respect to the semitonal octave)
<stemDir> = STEM DIRECTION = Whether the stem of a note points up or down (based on vertical stave position) 
<staveRangeMin> = STAVE RANGE MINIMUM = The minimum staveIndex value any note in a bar can take
<staveRangeMax> = STAVE RANGE MAXIMUM = The maximum staveIndex value any note in a bar can take
<LLParam> = LEGER LINE PARAMETER = How many (if any) leger lines a note needs based on its staveIndex/vertical stave position

<pitchIndex> = PITCH INDEX = The ascending (semitone increments) value of the pitch of a key 
    *NOTE:
    - a pitch index can correspond to several different staveIndex/acc pairs due to the semitonal layout of the piano - see "noteMap.js" for full list
    - the pitches have NOT been mapped to/aligned with standard MIDI mapping because it was complicated enough already (plus I'm not using MIDI...)
<fundFreq> = FUNDAMENTAL FREQUENCY [Hz] = The pitch of the cello's lowest open string (C2), using which all other frequencies can be calculated
<targetPitch> = TARGET PITCH = The pitch index represented in frequency [Hz] (calculated in calcPitch() below)

<acc> = ACCIDENTAL = Whether the note is natural (no accidental, usually the white keys on a piano), sharp (#, raised), or flat (b, lowered)
<accRange> = ACCIDENTAL RANGE = subsets of the set of all possible accidentals, used to restrict notes to only natural pitches at the beginning of the piece, gradually introducing sharps/flats

<dur> = DURATION = The note's rhythmic value (restricted to crotchets/quarter-notes (default), quavers/eighth-notes, and minims/half-notes)
<durRange> = DURATION RANGE = value which restricts the set of all possible durations so that initially only crotchets can be selected; quavers and minims gradually incorporated

<fill> = (NOTEHEAD) FILL = Whether the notehead is opaque (i.e. crotchets, quavers) or hollow (minims)

<x> = X-COORDINATE = The x-position of the centre of the notehead (closely related to xIndex)
<y> = Y-COORDINATE = The y-position of the centre of the notehead (closely related to staveIndex)

*/



//---------------- NOTE/STAVE FUNCTIONS -------------------------
// defined here in the order they are called in staveNotes.js (except for the Note class which is defined first)

// -------- NOTE CLASS --------------
// don't need stemDir or legerLines since these can be derived in separate functions from staveIndex

class Note{ // define Note class
    constructor(nXIndex, nStaveIndex, nStemDir, nAcc, nPitchIndex, nTargetPitch, nDur, nFill, nX, nY){ // Note constructor function
        // assign passed-in variables to local variables
        this.nXIndex = nXIndex; 
        this.staveIndex = nStaveIndex;
        this.nStemDir = nStemDir;
        this.nAcc = nAcc;
        this.pitchIndex = nPitchIndex;
        this.targetPitch = nTargetPitch;
        this.nDur = nDur;
        this.nFill = nFill;
        this.nX = nX;
        this.nY = nY;
    }
}

// ------- STAVE/BAR FUNCTIONS --------

// create new blank grand stave (with clefs and barlines)
function newStaves(){
    
    background(0, 0, 100, 100); // draw new background to cover previous staves

    // draw 10 (horizontal) stave lines
    stroke(0); // set line colour to black
    strokeWeight(3); // set stroke weight to 3px
    for(let z=0; z<=10; z++){ // iterate across integers from 0-11
        if(z != 5){ // to excluse space b/w staves 
        line(75,200+z*vertSpace,width-75,200+z*vertSpace); // draw an equidistant (w.r.t. other stave lines) horizontal stave line
        }
    }
    // draw (vertical) barlines
    line(74, 200, 74, 200+10*vertSpace); // barline at left-hand end
    line(width-74, 200, width-74, 200+10*vertSpace); // barline at right-hand end (obscured by double bar lines in final bars of each block)

    // bar "accessories"
    image(staveBrace, 30, 200, 40, 10*vertSpace); // include stave brace
    image(trebleClef, 80, 180, 75, 6*vertSpace); // include treble clef
    image(bassClef, 80, 200+6*vertSpace, 100, 3.5*vertSpace); // include bass clef
}
// create new array of Note objects and define all parameters
function newBar(nb_notePop, nb_staveRangeMin, nb_staveRangeMax, nb_accRange, nb_durRange, nb_DBL = false){
    
    // calculate the horizontal separation of notes across the bar
    if (nb_DBL){
        noteSep = (width - 370) / nb_notePop; // to account for the width added/reduced by the double bar line (since shifts end-of-bar left)
    }
    else{
        noteSep = (width - 300) / nb_notePop; // function of both the available space and the number of notes to be fitted in
    }

    for(let i=0; i<nb_notePop; i++){ // iterate across the number of notes required to populate the bar
        
        let nb_newNote; // define a label for some new note
        

        /// calculating the stave index
        if (staveIndexConstraint == 0){
            if (i == 0){
                nStaveIndex = openStringNotes[floor(random(2))];
            }
            else{
                if (barNotes[i-1].staveIndex == 0){
                    nStaveIndex = 4;
                }
                else {
                    nStaveIndex = 0;
                }
            }
        }

        else if (staveIndexConstraint == 1){
            nStaveIndex = openStringNotes[floor(random(4))];
            if (i>0){
                while (nStaveIndex == barNotes[i-1].staveIndex){
                    return nStaveIndex = openStringNotes[floor(random(4))];
                }
            }
        }

        else if (staveIndexConstraint == 2){
            nStaveIndex = floor(random(nb_staveRangeMin, nb_staveRangeMax)); // define the stave index of a new note as some random value within the constraints of the stave index range
            if (i>0){
                while (nStaveIndex == barNotes[i-1].staveIndex){
                    return nStaveIndex = floor(random(nb_staveRangeMin, nb_staveRangeMax));
                }
            }

        }

        else if (staveIndexConstraint == 3){
            nStaveIndex = floor(random(nb_staveRangeMin, nb_staveRangeMax));
            if (i>0){
                while(abs(nStaveIndex - barNotes[i-1].staveIndex) < 8){
                    nStaveIndex = floor(random(nb_staveRangeMin, nb_staveRangeMax));
                }
            }            
        }


        // let nPitchIndex = noteMap.get(nStaveIndex); // convert the stave index of a note to its pitch index (will be updated based on accidental quality)
        let nPitchIndex = noteArray[nStaveIndex];

        nb_newNote = new Note(  // create a new note object
            i, // nXIndex = horizontal index
            nStaveIndex, // nStaveIndex = stave index
            calcStemDir(nStaveIndex), // nStemDir = stem direction
            calcAcc(nStaveIndex, nb_accRange), // nAcc = accidental quality
            // updatePitchIndex(nPitchIndex), // nPitchIndex = pitch index
            nPitchIndex,
            calcPitch(nPitchIndex, nAcc), // nTargetPitch = target pitch [Hz]
            floor(random(nb_durRange)), // nDur = duration
            [0,0,0,100], // nFill = notehead fill
            300 + i*noteSep, // nX = notehead x-position
            200+((-nStaveIndex/2)+12)*vertSpace, // nY = notehead y-position
        )

        // update pitchIndex
        if (nb_newNote.nAcc == 1){ // if the note is flat
            nb_newNote.pitchIndex --; // decrease the pitchIndex by one semitone
            nb_newNote.targetPitch = calcPitch(nb_newNote.pitchIndex, nb_newNote.nAcc); // recalculate the target pitch
        }
        else if (nb_newNote.nAcc == 2){ // if the note is sharp
            nb_newNote.pitchIndex ++; // increase the pitchIndex by one semitone
            nb_newNote.targetPitch = calcPitch(nb_newNote.pitchIndex, nb_newNote.nAcc); // recalculate the target pitch
        }

        barNotes[i] = nb_newNote; // append the new note to the barNotes array (contains all notes in the given bar)
    }
    console.log(barNotes); // log the array containing all notes (and their parameters)
    doubleBar(nb_DBL); // check if the bar is the final bar in the block: if yes, draw in the double barlines (see doubleBar() below)
}
// draw a double bar line at the end of the bar if needed
function doubleBar(db_DBL){
    if (db_DBL == true){ // if a bar is the final bar in its block
        strokeCap(SQUARE); // flat/square ends of the line (noticeable since line is thick)
        line(width-85, 200, width-85, 200+10*vertSpace); // regular barline but translated left
        strokeWeight(10); // set line thickness to 10px
        line(width-74, 200, width-74, 200+10*vertSpace); // thick barline at right-hand end
    }
}

// -------- NOTE FUNCTIONS ---------

// draw the Note objects with the relevant notehead, accidentals, and stem
function drawNote(dn_nX, dn_nY, dn_nFill, dn_stemDir, dn_nDur, dn_acc, dn_LLParam){
    push(); // create local region for translations/graphic operations, while remembering global settings

    stroke(0); // set colour to black
    strokeCap(SQUARE); // square/flat ends of lines
    strokeWeight(4); // set line thickness to 4px
    translate(dn_nX,dn_nY); // translate origin to centre of notehead
    rotate(5*PI/6); // rotate for asymmetrical/angled view of ellipse

    // CIRCLE-BEHIND PROGRESS OPTION
    if (dn_nFill[2] != 0){ // i.e. note is green/yellow
        dn_nFill[3] = 70;
        ellipseMode(CENTER);
        fill(dn_nFill);
        noStroke();
        ellipse(0,0,65,45);
    }
    
    if (dn_nDur > 0){ // check if the note is either a crotchet or quaver
        fill(0, 0, 0, 100); // USING TO CHECK CIRCLE-BEHIND PROGRESS OPTION
        // fill(dn_nFill); // if so, fill the notehead green/yellow
    }
    else{ // if the note is a minim
        if (dn_nFill[2] == 0){ // i.e. if the note is not the current note or the one just played, but is a minim
            noFill(); // leave the notehead transparent 
        } 
        else{   // if the note is the current note or has just been played, and is a minim
            noFill(); // USING TO CHECK CIRCLE-BEHIND PROGRESS OPTION
            // dn_nFill[3] = 22; // reset the note alpha (i.e. the 3rd=last index of colour)
            // fill(dn_nFill); // fill the notehead either green or yellow accordingly
        }      
    }
    stroke(0,0,0,100);
    ellipse(0,0,40,25); // draw ellipse = notehead

    rotate(-5*PI/6); // return to standard orientation, but still translated to origin@notehead
    if (dn_stemDir){ // check stem direction (a function of the note's position in the stave)
        line(19, -6, 19, -120); // stem-up
        if(dn_nDur == 2){ // check if the note is a quaver
            image(qStemUp, 18, -120, 33, 140); // include upward-pointing quaver tail
        }
    }
    else{ // if the note's stem points downwards
        line(-19, 6, -19, 120); //stem-down
        if(dn_nDur == 2){ // check if the note is a quaver
            image(qStemDown, -21, -19, 33, 140) // include downward-pointing quaver tail
        }
    }

    // include any relevant accidentals
    // NOTE: dn_acc values take: 0 = natural; 1 = flat; 2 = sharp
    // if note is natural (dn_acc == 0), no accidental shown (i.e. not Viennese school, each note taken individually and naturals omitted)
    if (dn_acc == 1){ // check if note is flat
        image(flat, -55, -50, 28, 70); // include flat symbol
    }
    else if (dn_acc == 2){ // check if note is sharp
        image(sharp, -55, -30, 30, 60); // include sharp symbol
    }
    pop(); // return to global settings

    legerLines(barNotes[dn_LLParam].staveIndex, barNotes[dn_LLParam].nX); // if notes sit outside staves, include leger lines
    // XX KNOWN ISSUE: leger lines "draw over" the green of an already-completed note
}

// determine if a note is natural, sharp or flat
function calcAcc(ca_staveIndex, ca_accRange){ // takes in the stave index and accidental range as arguments
    if (ca_staveIndex == 0){ // check if the note is the lowest note on the cello (C2) - can't be flattened (since no lower notes allowed)
        if (ca_accRange > 1){ // check if the note is allowed to have an accidental
            let lowCAcc = [0,2];
            return nAcc = lowCAcc[(floor(random(2)))]; // generate a random non-flat accidental (i.e. natural or sharp)
        }
        else { // if note is only allowed to be natural
            return nAcc = 0; // assign natural accidental quality
        }
    }
    else if(ca_staveIndex == 25){ // check if note is the highest possible cello note (this varies between cellistss/cellos, but for argument's sake here it is taken to be the upper limit and therefore is not allowed to be sharpened)
        if (ca_accRange > 1){ // check if the note is allowed to have an accidental
            return nAcc = floor(random(0,2)) // generate a random non-sharp accidental (i.e. natural or flat)
        }
        else {
            return nAcc = 0; // assign natural accidental quality
        }
    }
    else { // all other notes
        return nAcc = floor(random(0, ca_accRange)) // generate random accidental as constrained by the accidental range
    }
}

// determine whether a note's stem should point up or down
// as a rule of thumb, a note's stem points into the note's stave - so a note in the lower half of a stave has an upwards-pointing stem, and a note in the upper half of a stave has a downwards-pointing stem
function calcStemDir(csd_staveIndex){
    if (csd_staveIndex >= 0 && csd_staveIndex <= 8){ // below-bass C to bass D (i.e. lower half of bass stave)
        nStemDir = true; // upwards stem direction
    }
    else if (csd_staveIndex >= 9 && csd_staveIndex <= 13){ // bass E - above-bass B (i.e. upper half of bass stave)
        nStemDir = false; // downwards stem direction
    }
    else if (csd_staveIndex >= 14 && csd_staveIndex <= 20){ // middle C - treble B (i.e. lower half of treble stave)
        nStemDir = true; // upwards stem direction
    }
    else if (csd_staveIndex >= 21 && csd_staveIndex <= 25){ // treble C - above-treble G (i.e. upper half of treble stave)
        nStemDir = false; // downwards stem direction
    }
    return nStemDir; // return the boolean value
}

// draws leger line(s) if needed
function legerLines(ll_staveIndex, ll_nX){ // take the stave index and x-position of a note as arguments

    strokeWeight(4); // set line thickness to 4px (same as stave lines)
    
    if (ll_staveIndex == 0){ // 2 low leger lines
        line(ll_nX-30, 200+11*vertSpace, ll_nX+30, 200+11*vertSpace); // LL1
        line(ll_nX-30, 200+12*vertSpace, ll_nX+30, 200+12*vertSpace); // LL2
    }
    else if (ll_staveIndex >= 1 && ll_staveIndex <= 2){ // 1 low leger line
        line(ll_nX-30, 200+11*vertSpace, ll_nX+30, 200+11*vertSpace); // LL1
    }
    else if (ll_staveIndex == 14){ // 1 middle leger line
        line(ll_nX-30, 200+5*vertSpace, ll_nX+30, 200+5*vertSpace); // LL1
    }
}

// calculate the target pitch for a given note+accidental 
function calcPitch(cp_pitchIndex){ // take the pitch index as argument
    targetPitch = fundFreq * (2**(cp_pitchIndex/12)); // calculate the pitch frequency using the algorithm on which western semitonal tuning is based
    return targetPitch; // return the frequency value
}

//----------- BAR PROGRESS FUNCTIONS ----------

// highlights current note green, moves to next note and highlight new nextNote yellow
// if the bar is completed (recall: each individual bar is an event), progresses to the next event (maybe a bar, maybe not) in the piece
function nextNote(){
    if(barProgress == barNotes.length - 1){ // check if the bar is finished
        
        metro20.stop();
        metro30.stop();
        metro45.stop();
        metro58.stop();
        metro77.stop();
        metro83.stop();
        metro92.stop();
        metro101.stop();
        
        barProgress = 0; // reset the progress through the bar

        // note: I tried using something more like passing a function label in here instead of calling each case separately, but given the difficulties with p5.Speech/SpeechRec objects contained in events, it wouldn't let me :(
        switch(nextEvent){ // take in an integer identifying the next event to take place
            case 4:
                event4(); // proceed to event 4
                break;
            case 5:
                event5(); // proceed to event 5
                break;
            case 6:
                event6(); // proceed to event 6
                break;
            case 9:
                event9(); // proceed to event 9
                break;
            case 10:
                event10(); // proceed to event 10
                break;
            case 11:
                event11(); // proceed to event 11
                break;
            case 14:
                event14(); // proceed to event 14
                break;
            case 15:
                event15(); // proceed to event 15
                break;
            case 16: // "16" used instead of "16a" to avoid passing strings into the switch statement
                event16a(); // proceed to event 16a
                break;
            case 22:
                event22(); // proceed to event 22
                break;
            case 23:
                event23(); // proceed to event 23
                break;
            case 24:
                event24(); // proceed to event 24
                break;
            case 27:
                event27(); // proceed to event 27
                break;
            case 28:
                event28(); // proceed to event 28
                break;
            case 29: // "29" used instead of "29a" to avoid passing strings into the switch statement
                event29a(); // proceed to event 29a
                break;
            case 35:
                event35(); // proceed to event 35
                break;
            case 36: // "36" used instead of "36a" to avoid passing strings into the switch statement
                event36a(); // proceed to event 36a
                break;
            case 42: // "42" used instead of "42a" to avoid passing strings into the switch statement
                event42a(); // proceed to event 42a
                break;
            case 48: // "48" used instead of "48a" to avoid passing strings into the switch statement
                event48a(); // proceed to event 48a
                break;
        }

    }
    
    else if(barProgress<barNotes.length){ // if the bar is incomplete

        if (eventIndex == 51){
            metro101.stop();
            newStaves();
            event48a();
        }
        

        else { // colour the notehead of the note just played green
            drawNote(barNotes[barProgress].nX, barNotes[barProgress].nY, [107, 100, 79, 100], barNotes[barProgress].nStemDir, barNotes[barProgress].nDur, barNotes[barProgress].nAcc, barProgress);
            if(barProgress+1<barNotes.length){ // check if the bar has more notes to come
                // colour the notehead of the next note to be played yellow
                drawNote(barNotes[barProgress+1].nX, barNotes[barProgress+1].nY, [47, 100, 100, 100], barNotes[barProgress+1].nStemDir, barNotes[barProgress+1].nDur, barNotes[barProgress+1].nAcc, barProgress);
                }

                targetPitch =  barNotes[barProgress+1].targetPitch;
                newPitchDetection();
        
            barProgress ++; // increment the progress through the bar

        }

        
    }
}

// MAIN FILE FOR STAVE/NOTES META-FUNCTION
// OTHER FILES USED:
// - barNotes.js
// - noteMap.js

// create a new bar taking parameters (see glossary of abbreviations at the top of barNotes.js)
function createBar(cb_notePop, cb_staveRangeMin, cb_staveRangeMax, cb_accRange, cb_durRange, cb_DBL){

    background(0, 0, 100, 100); // re-draw background to cover up previous bar

    // draw in new empty grand stave (two five-line staves + clefs (treble/bass) + barlines)
    newStaves(); // see newStaves() def in barNotes.js

    // create a new array of notes (see glossary of abbreviations at the top of barNotes.js)
    newBar(cb_notePop, cb_staveRangeMin, cb_staveRangeMax, cb_accRange, cb_durRange, cb_DBL); // see newBar() def in barNotes.js

    // draw each note in the bar with its correct position/attributes
    for (j = 0; j < barNotes.length; j++){ // iterate over notes in the bar
        drawNote(barNotes[j].nX, barNotes[j].nY, barNotes[j].nFill, barNotes[j].nStemDir, barNotes[j].nDur, barNotes[j].nAcc, j); // see drawNote() def in barNotes.js
    }

    drawNote(barNotes[0].nX, barNotes[0].nY, [47, 100, 100, 100], barNotes[0].nStemDir, barNotes[0].nDur, barNotes[0].nAcc, barProgress);
    targetPitch =  barNotes[0].targetPitch;
    newPitchDetection();
}
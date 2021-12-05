COMPOSED BY OLIVER BROWN 2021
COMMISSIONED FOR DOTS+LOOPS, MEANJIN/BRISBANE (AUS)
TO PREMIERE AT THE NONSTOP FESTIVAL (MEANJIN), DECEMBER 2021
PLEASE FEEL FREE TO DISTRIBUTE FOR EDUCATIONAL/CREATIVE PURPOSES
I CAN'T IMAGINE HOW YOU'D POSSIBLY MAKE MONEY OUT OF IT, BUT IF YOU DO (!?): (A) PLEASE ASK FIRST AND (B) LET ME KNOW HOW TO GET IN ON THAT


THIS DOCUMENT INCLUDES:
- CONTEXT FOR THE WORK
- HOW TO PLAY THE WORK (WITH OR WITHOUT A CELLO ON HAND)
- GENERAL CREDITS (some other specific credits listed in Events.js)

CONTEXT FOR THE WORK

- For programme notes and to watch a demo performance please navigate to: https://www.oliverbrownartist.com/alexa

- This piece is a music composition written for solo cello & electronics
- It will be premiered at the Nonstop Festival in Meanjin in December 2021.

------------------------------------------------------------------------------------

HOW TO PLAY THE WORK (WITH OR WITHOUT A CELLO ON HAND):

KEY POINTS
1. USE CHROME (other browsers at your own risk; I have not run the program on anything else)
2. IF UNSURE, USE HEADPHONES (reasons why explained in excrutiating detail below)
3. TO BEGIN, PRESS "S" AND SAY, "Alexa, write me some music."
4. Follow Alexa's prompts to speak throughout the work
5. IF AN EVENT FAILS, OR YOUR SPEECH IS NOT DETECTED, PRESS "Q" TO MOVE TO THE NEXT EVENT
6. IF PITCH-DETECTION FAILS, PRESS "P" TO MOVE BETWEEN NOTES (pressing for the last note will trigger the next event)
7. If all else fails, get yourself a beverage of your choosing and email oliverbrownartist@gmail.com
 
THE AFOREMENTIONED EXCRUTIATING DETAIL
- I have had some enormous difficulties getting p5.Speech (speech synthesis) and p5.SpeechRec (speech recognition) objects to work in the current version of Chrome's Audio/Web API (this is a well-documented issue online, but there are few useful or neat solutions)
- The workaround has involved me basically creating a big fat list of 60 "event" functions 
- Each represents sequential steps/events/moments in the piece
- They are daisy-chained together
- I originally had a much more elegant switch statement set up, with similar events/cases abstracted/encapsulated
- This simply refused to work with the p5.Speech access/autoplay difficulties
- Ultimately I had to create a whole new separate instance of p5.Speech/p5.SpeechRec every time synthesis or recognition is indicated
- The events are listed sequentially in events.js

- One of the most difficult aspects of p5.Speech/SpeechRec not working properly is that the onEnd/onended flags are not firing correctly, so sometimes the next event was occurring before the speech synthesis was finished
- This is a problem because speech recognition often follows instances of synthesis
- In the case of overlap, the recognition is auto-completed by hearing and recognising the instructions as the cellist's verbal response!!
- As a workaround, I have introduced a "SLEEP" function which essentially just delays the call for the next event by the approximate duration of the synthesis
- BUT to be on the safe side I RECOMMEND USING HEADPHONES to avoid any overlaps I've miscalculated (so speech recog can't hear the synthesis)

- If for some reason you do not state a key-word before the SpeechRec object elapses, or else it does not understand your speech, follow these steps:
    - check if the little red microphone symbol on the page tab is blinking - if it's blinking, it's still listening, so say it again!
    - check your internet connection; neither synthesis nor recognition will work without internet connection (they are Google-derived APIs)
    - (don't worry, none of the data gets copied to google)
    - check that you have allowed permission to use the microphone (and to autoplay, if possible)
    - open the Chrome Developer console, take note of the current event (in format "EVENT ##")
    - when you restart the program, you can type "event##();" into the console and press enter, and it will begin anew from that point (one benefit of the daisy-chain structure).

------------------------------------------------------------------------------------------

GENERAL CREDITS:

- General CDS2521 resources (course offered by the Monash University School of Art, Design & Architecture, convened by Jon-Erik Andreassen)
- Daniel Schiffman, Coding Train (various tutorials): https://thecodingtrain.com/ or https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw
- Aaron Wyatt (my Composition supervisor at Monash)
- Connor D'Netto (my Composition mentor at Dots+Loops)
- Tristan Cliff (commiserating with my frustrations in JS)
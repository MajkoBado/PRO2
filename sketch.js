// variables for handpose detection, video-camera, time info, interval between updates
let handpose;
let video;
let hands = [];
let lastUpdateTime = 0;
const updateInterval = 2000; 

//setup function runs only on beggining
function setup () 
{
  createCanvas (640, 480); 
  video = createCapture(VIDEO); // Capture video from the webcam
  video.hide (); 

  handpose = ml5.handpose (video, modelReady); // Initialize hand pose model
  handpose.on("predict", results => { // Event after hand pose is detected
    hands = results ; 
    checkWave (); // Check for a waving gesture
  });
}

// callback function in console when hand pose is detected
function modelReady ()
{
  console.log (" Model is ready!");
} 

// Function checking for wave gesture on camera
function checkWave ()
{
  const currentTime = new Date().getTime(); //This got me current time in miliseconds for updating between gestures. value is set in the beggining of code (updateInterval)
  if (currentTime - lastUpdateTime < updateInterval) 
  {
    return; // This ensures that it wont be updated too frequently, saying if the time since last update is less then 2sec, function returns back to beggining 
  }

  let waveDetected = false;// set to no waving gesture detected
  for (let i = 0; i < hands.length; i++)// Loop for detecting hand, only 1 can be detected, no multiple hands
  { 
    const hand = hands[i] ;
    const thumbTip = hand.annotations.thumb[3][0];// X coordinates of tip and base of thumb
    const thumbBase = hand.annotations.thumb[0][0];
    let handIsOpen = true;

    for (const finger of ['indexFinger', 'middleFinger', 'ringFinger', 'pinky']) {//this checks every finger if is open
      const fingertipY = hand.annotations[finger][3][1];
      const knuckleY = hand.annotations[finger][0][1]; //get Y coordinates of fingertip and knuckle for every single finger
      if (fingertipY >= knuckleY) {//this tells that if fingertip is below or at the knuckle, hand is closed
        handIsOpen = false ; 
        break;
      }
    }
//this checks if thumb tip is right from thumb base, if yes hand is open
    if (thumbTip > thumbBase && handIsOpen)
    { 
      waveDetected = true; // If hand is open it detects wave gesture
      break; //exit loop if waving is detected
    }
  } // this connects elements used in html with js
  const backgroundImage = document.getElementById('backgroundImage');
  const interactionImage = document.getElementById('interactionImage');
  const backgroundText = document.getElementById('backgroundText');
  const interactionText = document.getElementById('interactionText');
  const leftFrog = document.getElementById('leftFrog');
  const rightFrog = document.getElementById('rightFrog');
  // this sets visibility when wave is detected for text img and gif
  backgroundImage.style.display = waveDetected ? 'none' : 'block';
  interactionImage.style.display = waveDetected ? 'block' : 'none';
  backgroundText.style.display = waveDetected ? 'none' : 'block';
  interactionText.style.display = waveDetected ? 'block' : 'none';
  leftFrog.style.display=waveDetected? 'inline-block' : 'none';
  rightFrog.style.display=waveDetected?'inline-block' : 'none';
  interactionText.innerText= waveDetected? 'Countdown till Summer' : 'Wave at me';

  lastUpdateTime = currentTime;

}
// Function which gets current time and update it every seccond
function currentTime()
{

  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
let session = "AM";

if(hh > 12) // toggle between AM PM after 12
{
  session = "PM";
}

hh = (hh < 10) ? "0" + hh : hh;
mm = (mm < 10) ? "0" + mm : mm;
ss = (ss < 10) ? "0" + ss : ss;
 
let time = hh + ":" + mm + ":" + ss + " " + session;

document.getElementById("clock").innerText = time; 
var t = setTimeout(function(){ currentTime() }, 1000); // update every second
}

currentTime();
function countdownToSummer() 
{
  // Get current date
  let currentDate = new Date();

  // Define the date of the summer (June 20)
  let nextSummer = new Date(currentDate.getFullYear(), 5, 20); // Setted date for start of summer 20th June

  // If the current date is after June 20th, set the next summer to next year
  if (currentDate > nextSummer) {
    nextSummer.setFullYear(nextSummer.getFullYear() + 1);
  }

  // Calculate the difference in milliseconds between the current date and the next summer
  let difference = nextSummer.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  let daysUntilSummer = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return daysUntilSummer;
}

// Function to update the countdown text
function updateCountdownText() 
{
  // Get the countdown text element
  const countdownText = document.getElementById('interactionText');

  // Get exact number of days till june 20th
  const daysUntilSummer = countdownToSummer();

  // Update the text of how many days till summer
  countdownText.innerText = `Countdown till Summer: ${daysUntilSummer} days`;
}

// call function update countdown
updateCountdownText();

// Interval which updates counting till summer every 2 seconds
setInterval(updateCountdownText, 2000);
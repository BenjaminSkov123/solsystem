function togglePopup(body) {
  var popupId = body + "-popup";
  var popup = document.getElementById(popupId);
  var overlay = document.getElementById("overlay");
  
  // Toggle display of pop-up and overlay
  if (popup.style.display === "none") {
      popup.style.display = "block";
      overlay.style.display = "block";
  } else {
      popup.style.display = "none";
      overlay.style.display = "none";
  }
}


// Function to stop any currently playing audio
function stopAllAudio() {
  var audioElements = document.querySelectorAll('audio');
  audioElements.forEach(function(audio) {
    audio.pause();
    audio.currentTime = 0;
  });
}

// Function to shuffle an array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

var lastPlayedId = ''; // ID of the last played audio

function playRandomSound() {
  // Stop any currently playing audio
  stopAllAudio();

  // Get all audio elements
  var audioElements = document.querySelectorAll('audio');

  // Create an array to store shuffled audio elements
  var shuffledAudioElements = shuffleArray(Array.from(audioElements));

  // Select a random audio element that is different from the last played one
  var selectedAudio;
  do {
    selectedAudio = shuffledAudioElements[Math.floor(Math.random() * shuffledAudioElements.length)];
  } while (selectedAudio.id === lastPlayedId);

  // Play the selected audio
  selectedAudio.play();

  // Update the lastPlayedId
  lastPlayedId = selectedAudio.id;
}
  

document.addEventListener('DOMContentLoaded', function() {
  var video = document.getElementById('video');
  var playButton = document.getElementById('play-button');

  // Hide the play button and start playing the video when clicked
  playButton.addEventListener('click', function() {
    video.play();
    playButton.style.display = 'none';
  });

  // Redirect to another page when the video ends
  video.addEventListener('ended', function() {
    window.location.href = 'index1.html';
  });
});



"use strict";

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight,
    
  hue = 217,
  stars = [],
  count = 0,
  maxStars = 1400;

// Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
// Cache gradient
var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
var half = canvas2.width/2,
    gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

// End cache

function random(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }
  
  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x,y) {
  var max = Math.max(x,y),
      diameter = Math.round(Math.sqrt(max*max + max*max));
  return diameter/2;
}

var Star = function() {

  this.orbitRadius = random(maxOrbit(w,h));
  this.radius = random(60, this.orbitRadius) / 12;
  this.orbitX = w / 2;
  this.orbitY = h / 2;
  this.timePassed = random(0, maxStars);
  this.speed = random(this.orbitRadius) / 50000;
  this.alpha = random(2, 10) / 10;

  count++;
  stars[count] = this;
}

Star.prototype.draw = function() {
  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
      y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
      twinkle = random(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.05;
  }

  ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (var i = 0; i < maxStars; i++) {
  new Star();
}

function animation() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
    ctx.fillRect(0, 0, w, h)
  
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 1, l = stars.length; i < l; i++) {
    stars[i].draw();
  };  
  
  window.requestAnimationFrame(animation);
}

animation();


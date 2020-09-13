const video  = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx    = canvas.getContext('2d');
const strip  = document.querySelector('.strip');
const snap   = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => console.error(`Oh Nooo!!!`, err));
}

function paintToCanvas() {
  // 1. Set canvas dimensions to be the same 'video'
  const width  = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // 2. Take image from webcam and put on canvas on a set interval
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    //pixels = redEffects(pixels);
    //pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 50);
}

function takePhoto() {
  // play the sound
  //snap.currentTime = 0;
  //snap.play();
  // TODO sound file will not play

  // take data out of canvas
  const data = canvas.toDataURL('image/jpeg');
  console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffects(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

// TODO: Green screen function doesnt work
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
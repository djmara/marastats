let bgVideo;
let glitchedImg;

function preload() {
  // Load the video
  bgVideo = createVideo("liftcup_4.mp4");
}

function setup() {
  createCanvas(1920, 1080);  // Or smaller for testing

  // Setup video
  bgVideo.volume(0);
  bgVideo.loop();
  bgVideo.hide();

  // Force autoplay for modern browsers
  bgVideo.elt.autoplay = true;
  bgVideo.elt.muted = true;
  bgVideo.elt.setAttribute('playsinline', '');
}

function draw() {
  background(0);

  // Draw the video frame
  image(bgVideo, width / 2, height / 2, width, height);

  // Glitch effect when mouse is pressed
  if (mouseIsPressed) {
    glitchImage();
    image(glitchedImg, width / 2, height / 2, width, height);
  }
}

function glitchImage() {
  // Get current frame of video
  glitchedImg = bgVideo.get();

  let bands = 20;
  let speed = dist(mouseX, mouseY, pmouseX, pmouseY);

  for (let i = 0; i < bands; i++) {
    let y = int(random(glitchedImg.height));
    let h = int(random(5, 15));
    let offset = int(map(speed, 0, 50, -100, 100));
    offset += int(random(-20, 20));

    glitchedImg.copy(glitchedImg, 0, y, glitchedImg.width, h, offset, y, glitchedImg.width, h);
  }
}


let bgVideo;
let glitchedImg;

function preload() {
  bgVideo = createVideo("liftcup_4.mp4");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  bgVideo.volume(0);
  bgVideo.loop();
  bgVideo.hide();

  bgVideo.elt.autoplay = true;
  bgVideo.elt.muted = true;
  bgVideo.elt.setAttribute('playsinline', '');

  imageMode(CENTER);  // important for centering the video
}

function draw() {
  background(0);

  image(bgVideo, width / 2, height / 2, width, height);

  if (mouseIsPressed) {
    glitchImage();
    image(glitchedImg, width / 2, height / 2, width, height);
  }
}

function glitchImage() {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

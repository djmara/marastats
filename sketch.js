let bgVideo;
let glitchedImg;

let stats = [
  "Matches: 7",
  "Most World Cup Fouls Won: 53",
  "Shots on Target: 13",
  "Total Shots: 30",
  "Chances Created: 27",
  "Goals: 5",
  "Assists: 5",
  "Minutes: 630",
  "Key passes: 27",
  "Dribbles: 53",
  "Goal of the Century"
];

let typedStats = new Array(stats.length);
let statStartFrames = new Array(stats.length);
let charDelay = 2;

let lastMouseX, lastMouseY;
let wasHovering = false;
let videoEnded = false;

let originX, originY;
let noiseTimeX = 0;
let noiseTimeY = 1000;

function preload() {
  bgVideo = createVideo("liftcup_4.mp4");
}

function setup() {
  createCanvas(1920, 1080);
  
  bgVideo.loop();
  bgVideo.volume(0);
  bgVideo.hide(); // Hide default HTML video element
  
  textFont("Courier");
  textSize(14);
  textAlign(CENTER, CENTER);
  
  for (let i = 0; i < stats.length; i++) {
    typedStats[i] = "";
    statStartFrames[i] = frameCount;
  }
}

function draw() {
  background(0);

  // Floating origin
  originX = map(noise(noiseTimeX), 0, 1, width * 0.2, width * 0.8);
  originY = map(noise(noiseTimeY), 0, 1, height * 0.2, height * 0.8);
  noiseTimeX += 0.003;
  noiseTimeY += 0.003;
  
  // Draw video frame
  image(bgVideo, width / 2, height / 2, width, height);
  
  let isHovering = mouseOverVideo();
  
  // Reset typing on hover enter or move
  if (isHovering && (!wasHovering || mouseX !== lastMouseX || mouseY !== lastMouseY)) {
    for (let i = 0; i < stats.length; i++) {
      typedStats[i] = "";
      statStartFrames[i] = frameCount;
    }
  }
  
  if (isHovering) {
    glitchImage();
    image(glitchedImg, width / 2, height / 2, width, height);
    drawDynamicStatLines();
  }
  
  wasHovering = isHovering;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  
  // Restart video if needed (in p5.js loop() usually handles this)
  if (bgVideo.elt.currentTime >= bgVideo.elt.duration && !videoEnded) {
    bgVideo.time(0);
    bgVideo.play();
    videoEnded = true;
  } else if (bgVideo.elt.currentTime < bgVideo.elt.duration) {
    videoEnded = false;
  }
}

function drawDynamicStatLines() {
  let spacing = 140;
  let waveAmplitude = 80;
  let waveFrequency = 0.015;
  let startX = mouseX - ((stats.length - 1) * spacing) / 2;
  
  for (let i = 0; i < stats.length; i++) {
    let fullStat = stats[i].toUpperCase();
    let charsToShow = min((frameCount - statStartFrames[i]) / charDelay, fullStat.length);
    let typed = fullStat.substring(0, charsToShow);
    
    if (charsToShow < fullStat.length && (floor(frameCount / 20) % 2 === 0)) {
      typed += "_";
    }
    
    typedStats[i] = typed;
    
    textSize(14);
    let padding = 20;
    let tw = textWidth(typed);
    let th = textAscent() + textDescent();
    
    let x = startX + i * spacing;
    let y = mouseY + sin(x * waveFrequency + frameCount * 0.01) * waveAmplitude;
    
    let statPos = createVector(x, y);
    
    // Line from origin to edge of box
    let halfBoxW = (tw + padding) / 2.0;
    let halfBoxH = (th + padding) / 2.0;
    let dx = statPos.x - originX;
    let dy = statPos.y - originY;
    let absDx = abs(dx);
    let absDy = abs(dy);
    let scale = min(halfBoxW / absDx, halfBoxH / absDy);
    let edgeX = statPos.x - dx * scale;
    let edgeY = statPos.y - dy * scale;
    
    stroke(255, 150);
    line(originX, originY, edgeX, edgeY);
    
    // Draw box
    rectMode(CENTER);
    noFill();
    stroke(255);
    rect(statPos.x, statPos.y, tw + padding, th + padding);
    
    // Draw text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text(typedStats[i], statPos.x, statPos.y);
  }
}

function mouseOverVideo() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function glitchImage() {
  glitchedImg = bgVideo.get();
  
  let bands = 30;
  let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
  
  for (let i = 0; i < bands; i++) {
    let y = int(random(glitchedImg.height));
    let h = int(random(2, 10));
    let offset = int(map(speed, 0, 50, -100, 100));
    offset += int(random(-20, 20));
    
    glitchedImg.copy(glitchedImg, 0, y, glitchedImg.width, h, offset, y, glitchedImg.width, h);
  }
}

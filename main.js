let fire1 = [];
let fire2 = [];

function setup() {
  createCanvas(1440, 700).id('fire').position(0, 155);
  
  for (let i = 0; i < width * height; i += 1) {
    fire1[i] = 0;
    fire2[i] = 0;
  }
}

function draw() {
  clear(); // Use clear() instead of background('FFFFFF');
  
  for (let i = 0; i < width; i += 1) {
    fire1[width * (height - 1) + i] = floor(random(0, 500));
    // add some kind of sparkles to make it more interesting
    // can also make the fire much "heavier" by increasing 255
    if (frameCount % 2 == 0) {
      let sy = height / 2;
      let ny = floor(random(0, sy));
      fire1[width * (height - ny) + i] = floor(random(0, 350)) * (1 - ny / sy);
    }
  }
  
  for (let i = 0; i < width; i += 1) {
    fire2[width * (height - 1) + i] = floor(random(0, 500));
    // add some kind of sparkles to make it more interesting
    // can also make the fire much "heavier" by increasing 255
    if (frameCount % 2 == 0) {
      let sy = height / 2;
      let ny = floor(random(0, sy));
      fire2[width * (height - ny) + i] = floor(random(0, 350)) * (1 - ny / sy);
    }   
  }
  
  updateFire(fire1);

  // Update Fire 2
  updateFire(fire2);

  // Display Fire 1
  displayFire(fire1);

  // Display Fire 2
  displayFire(fire2, height - 3030);
}
  
  
function updateFire(fire) {
  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let index0 = x + y * width;
      let index1 = (x - 1 + width) % width + ((y + 1) % height) * width;
      let index2 = (x % width) + ((y + 1) % height) * width;
      let index3 = (x + 1) % width + ((y + 1) % height) * width;
      let index4 = (x % width) + ((y + 2) % height) * width;

      let f1 = fire[index1];
      let f2 = fire[index2];
      let f3 = fire[index3];
      let f4 = fire[index4];
      fire[index0] = ((f1 + f2 + f3 + f4) * 15) / 61;
    }
  }
}
  
function displayFire(fire, offsetY = 0) {
  loadPixels();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let i = x + y * width;
      let col = fire[i];
      let ii = (x + (y + offsetY) * width) * 4;
      
      if (fire === fire2) {
        let rx = width - 1 - x;
        let ry = height - 1 - (y + offsetY);
        ii = (rx + ry * width) * 4;
      }
      
      pixels[ii + 0] = 255; // Red channel
      pixels[ii + 1] = 255 - col * 0.75; // Green channel
      pixels[ii + 2] = 255 - col; // Blue channel
      pixels[ii + 3] = 255; // Alpha channel (fully opaque)
    }
  }
  updatePixels();
}

class Experience {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "car-canvas"; // Set your desired ID here
    this.container.appendChild(this.canvas);
    
    this.context = this.canvas.getContext("2d");

    const fps = 60;
    this.fpsInterval = 1000 / fps;
    this.then = Date.now();

    this.point = { x: 0, y: 0 };
    this.distPoint = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.positions = [];
    this.cars = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.setupCars();
    this.resize();
    this.bind();

    this.loop();
  }

setupCars() {
  for (let i = 1; i <= 7; i++) {
    this.cars.push(this.createCar(i));
  }

  // Shuffle the cars array
  this.cars = this.shuffleArray(this.cars);

  this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
}

// Helper function to shuffle an array
shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



createCar(i) {
  let y = this.getRandomNumber(0, this.canvas.height);

  let car = {
    front: this.loadImage(`cars/carfront${i}.png`),
    back: this.loadImage(`cars/carback${i}.png`),
    x: 0,
    y: 0,
    speed: 0, // Initial speed set to zero
    initialWidth: 270, // Initial width set to 250
    finalWidth: 250,
    currentWidth: 270, // Current width for transition
    isHovered: false,
  };

  // Set a delay for every car to start moving, excluding the first car
  const delay = i * 600 ;
  setTimeout(() => {
    if (i % 2 === 0) {
      car.x = this.getRandomNumber(0, 1438);
      car.y = y;
      car.speed = this.getRandomNumber(5, 8) * -1; // Start moving with a random speed

      // Set shadow properties
      this.context.shadowColor = 'rgba(255, 100, 0, 1)';
      this.context.shadowBlur = 40;
    } else {
      car.x = this.getRandomNumber(0, 1438);
      car.y = y * 2.25;
      car.speed = this.getRandomNumber(5, 10);
    }
  }, delay);
  return car;
  
}


  loadImage(path) {
    const img = new Image();
    img.src = path;
    return img;
  }

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  bind() {
    window.addEventListener("resize", this.resize.bind(this), false);
    this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("scroll", this.onScroll.bind(this)); // Add scroll event listener
  }

  onScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Check if the scroll position is greater than or equal to 80vh
    if (scrollPosition >= 0.5 * window.innerHeight) {
      // Update the car images to carback images
      this.cars.forEach((car) => {
        car.front.src = car.back.src;
      });
    }
  }

  drawCircles() {
    const ctx = this.context;

    // Every frame of animation, store the mouse position
    this.positions.push({ x: this.mouseX, y: this.mouseY });

    if (this.positions.length > 15) {
      this.positions.shift();
    }

    for (let i = 0; i < this.positions.length; i++) {
      const { x, y } = this.positions[i];
      ctx.beginPath();
      ctx.ellipse(x + i*random(-2,2), y + i*random(5,7), i * 8, i * 3, 0, 0, Math.PI * 2);

      // Generate a random color within the orange-to-red spectrum
      const randomColor = this.getRandomColor();
      ctx.strokeStyle = randomColor;
      ctx.lineWidth = 3;

      // Apply a shadow-like effect using the filter property
      ctx.filter = 'blur(20px)';
      ctx.stroke();

      ctx.closePath();
      ctx.filter = 'none'; // Reset the filter

  //     const textDiv = document.getElementById('text');
  // for (let i = 0; i < this.positions.length; i++) {
  //   const { x, y } = this.positions[i];
  //   const circle = document.createElement('div');
  //   circle.className = 'circle';
  //   circle.style.left = `${x}px`;
  //   circle.style.top = `${y}px`;
  //   circle.style.width = `${i * 8}px`;
  //   circle.style.height = `${i * 3}px`;
  //   circle.style.borderColor = this.getRandomColor();
  //   circle.style.boxShadow = '0 0 20px rgba(255, 100, 0, 1)';
  //   circle.style.position = 'absolute';
  //   circle.style.borderRadius = '50%';
  //   textDiv.appendChild(circle);
  //   }
  }
  }

  getRandomColor() {
    const minRed = 200;
    const maxRed = 255;
    const minGreen = 0;
    const maxGreen = 180;
    const blue = 0;

    const randomRed = Math.floor(Math.random() * (maxRed - minRed + 1) + minRed);
    const randomGreen = Math.floor(Math.random() * (maxGreen - minGreen + 1) + minGreen);

    return `rgba(${randomRed}, ${randomGreen}, ${blue}, 1)`;
  }

  render() {
    this.clear();
    this.context.save();
    this.drawCircles();
    // Draw cars
    this.drawCars();
  
    this.context.restore();
  
    // Update position based on mouse movement
    this.pos.x += (this.point.x - this.pos.x) * 0.35;
    this.pos.y += (this.point.y - this.pos.y) * 0.35;
  
    this.context.save();
  
    // Draw the empty ellipse with red stroke
    this.context.beginPath();
    this.context.ellipse(
      this.pos.x,
      this.pos.y,
      this.canvas.height * 0.39,
      this.canvas.height * 0.39,
      0,
      0,
      Math.PI * 2
    );

      this.context.strokeStyle = "rgba(255,100,0,1)";
      this.context.lineWidth = 4;

      // Apply a shadow-like effect using the filter property
      this.context.filter = 'blur(12px)';
      this.context.stroke();

      this.context.closePath();
      this.context.filter = 'none'; // Reset the filter
  
    // Draw the original arc
    this.context.beginPath();
    this.context.arc(
      this.pos.x,
      this.pos.y,
      this.canvas.height * 0.38,
      0,
      Math.PI * 2,
      true
    );
  
    this.context.clip();
    this.context.strokeStyle = "rgba(255,100,0,1)";
    this.context.lineWidth = 1.5;

    this.context.closePath();
  
    this.context.shadowColor = 'rgba(255,100,0,1)';
    this.context.shadowBlur = 30; 
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    
  
    // Draw the duplicate arc
    this.context.drawImage(
      this.canvas,
      -this.canvas.width * 0.65 + (this.canvas.width - this.canvas.width * 2.3) * (this.distPoint.x * 1),
      -this.canvas.height * 0.65 + (this.canvas.height - this.canvas.height * 2.3) * (this.distPoint.y * 1),
      this.canvas.width * 2.3,
      this.canvas.height * 2.3
    );

    this.context.stroke();
  
    this.context.shadowColor = 'transparent';
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
  
    this.context.restore();
  }
  

  drawCars() {
    const ctx = this.context;
  
    for (let i = 0; i < this.cars.length; i++) {
      let car = this.cars[i];
  
      // Check if the car is still in the initial position (not started moving)
      if (car.x === 0 && car.y === 0) {
        continue; // Skip this iteration, the car hasn't started moving yet
      }
  
      if (
        this.mouseX > car.x &&
        this.mouseX < car.x + car.currentWidth &&
        this.mouseY > car.y &&
        this.mouseY <
          car.y + (car.front.height * (car.currentWidth / car.front.width))
      ) {
        car.isHovered = true;
      } else {
        car.isHovered = false;
  
        // Introduce a delay of 1 second before the car starts moving
        if (!car.startTime) {
          car.startTime = Date.now();
        }
  
        const elapsedTime = Date.now() - car.startTime;
        if (elapsedTime < 1000) {
          continue; // Skip this iteration, the car is still in the delay phase
        }
  
        car.x += car.speed;
  
        if (
          (car.speed > 0 && car.x > this.canvas.width) ||
          (car.speed < 0 && car.x + car.currentWidth < 0)
        ) {
          // Reposition the car within the canvas with a new random Y position
          car.x = car.speed > 0 ? 0 - car.currentWidth : this.canvas.width;
          car.y = this.getRandomNumber(0, this.canvas.height);
          car.startTime = null; // Reset the start time for the next iteration
        }
      }
  
      // Transition the width from initialWidth to finalWidth over time
   // Add a property to track transition progress
car.transitionProgress = 0; // 0 means the start of the transition

// ...

if (car.currentWidth > car.finalWidth) {
  car.currentWidth -= 2; // Adjust the transition speed as needed

  // Update transition progress using cubic ease-out function
  car.transitionProgress = 1 - Math.pow(1 - (car.currentWidth - car.finalWidth) / (car.initialWidth - car.finalWidth), 3);

  // Set shadow properties with eased alpha
  car.shadowAlpha = car.transitionProgress;
  this.context.shadowColor = `rgba(255, 100, 0, ${car.shadowAlpha})`;
  this.context.shadowBlur = 40;
} else {
  // Reset transition progress when not fading
  car.transitionProgress = 0;

  // Reset shadow properties
  this.context.shadowColor = 'transparent';
  this.context.shadowBlur = 0;

  // Reset shadow alpha when not fading
  car.shadowAlpha = 1.0;
}

      ctx.save();
      if (car.isHovered) {
        ctx.drawImage(
          car.back,
          car.x,
          car.y,
          car.currentWidth,
          car.back.height * (car.currentWidth / car.back.width)
        );
      } else {
        ctx.drawImage(
          car.front,
          car.x,
          car.y,
          car.currentWidth,
          car.front.height * (car.currentWidth / car.front.width)
        );
      }
      ctx.restore();
    }
  }
  onMouseMove(ev) {
    var rect = this.canvas.getBoundingClientRect();
    this.point = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top,
    };

    this.distPoint = {
      x: (this.point.x - this.canvas.width * 0.5) / this.canvas.width,
      y: (this.point.y - this.canvas.height * 0.5) / this.canvas.height,
    };

    this.mouseX = this.point.x;
    this.mouseY = this.point.y;
  }

  onTouchMove(ev) {
    var rect = this.canvas.getBoundingClientRect();
    this.point = {
      x: ev.touches[0].clientX - rect.left,
      y: ev.touches[0].clientY - rect.top,
    };

    this.distPoint = {
      x: (this.point.x - this.canvas.width * 0.5) / this.canvas.width,
      y: (this.point.y - this.canvas.height * 0.5) / this.canvas.height,
    };
  }

  loop() {
    this.raf = window.requestAnimationFrame(this.loop.bind(this));

    const now = Date.now();
    const delta = now - this.then;

    if (delta > this.fpsInterval) {
      this.render();
      this.then = now;
    }
  }

  resize() {
    this.canvas.width = 1438;
    this.canvas.height = 408;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

const experience = new Experience(document.getElementById('main'));
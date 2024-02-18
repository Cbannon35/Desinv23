let serial; // the Serial object
let serialOptions = { baudRate: 115200  };
let queue = []

let xPos = -1;
let yPos = -1;

const WIDTH = 511;
const HEIGHT = 400;

function setup() {
    buildEtchASketch();
    pixelDensity(1); // Ensure each pixel is one unit in the canvas
    loadPixels(); // Load the pixel array for manipulation
    // Setup Web Serial using serial.js
    serial = new Serial();
    serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);

    // If we have previously approved ports, attempt to connect with them
    // serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);
    background(50);
    // Add in a lil <p> element to provide messages. This is optional
    pHtmlMsg = createP("Uncomment me for debugging!");

    let buttonConnect = createButton("Connect");

    buttonConnect.mousePressed(() => {
        if (serial.isOpen()) {
            serial.close();
        }
        serial.connectAndOpen(null, serialOptions);
    });

    // Add a button to clear the canvas 
    let clearButton = createButton("Clear");
    clearButton.mousePressed(() => {
        background(50);
        xPos = -1;
        yPos = -1;
    });
    let randomLineButton = createButton("Random Line");
    randomLineButton.mousePressed(() => {
        let x1 = random(WIDTH);
        let y1 = random(HEIGHT);
        let x2 = random(WIDTH);
        let y2 = random(HEIGHT);
        drawLine(x1, y1, x2, y2);
    });
    
}

function draw() {
  
    while(queue.length > 0){
    // Grab the least recent value of queue (first in first out)
    // JavaScript is not multithreaded, so we need not lock the queue
    // before reading/modifying.
    let val = queue.shift();
    new_xPos = val[0];
    new_yPos = val[1];

    drawLine(xPos, yPos, new_xPos, new_yPos);
    xPos = new_xPos;
    yPos = new_yPos;

    // Color in each pixel from the last position to the new position
    // with the color black
    }
}

function onSerialDataReceived(eventSender, newData) {
    pHtmlMsg.html("onSerialDataReceived: " + newData);

    let data = newData.split(',')
    new_xPos = parseInt(data[0]);
    new_yPos = parseInt(data[1]);

    /* Initialize the position if it is the first time */
    if (xPos == -1 || yPos == -1) {
        xPos = new_xPos;
        yPos = new_yPos;
        return;
    }

    if (new_xPos != xPos || new_yPos != yPos) {
        newPos = [new_xPos, new_yPos]
        queue.push(newPos);
    }
}


function drawLine(x1, y1, x2, y2) {
  let dx = abs(x2 - x1);
  let dy = abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (x1 !== x2 || y1 !== y2) {
    setPixel(x1, y1);
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
  setPixel(x2, y2); // Ensure the last pixel is drawn
}

function setPixel(x, y) {
  stroke(255);
  point(x, y);
}

buildEtchASketch = () => {
    let etchASketch = createElement('div');
    etchASketch.id('etchASketch');
    etchASketch.style('background-color', 'red');
    etchASketch.style('width', '680px');
    etchASketch.style('border', '2px solid black');
    etchASketch.style('border-radius', '10px');
    // etchASketch.style('pointer-events', 'none'); // Make the border element not interactable
    
    let header = createElement('div');
    header.id('header');
    header.style('height', '70px');
    header.style('display', 'flex');
    header.style('justify-content', 'center');
    header.parent(etchASketch);

    let h1 = createElement('h1', 'Etch-a-Sketch');
    h1.style('color', 'gold');
    h1.parent(header);

    let canvasContainer = createElement('div');
    canvasContainer.id('canvasContainer');
    canvasContainer.style('display', 'flex');
    canvasContainer.style('justify-content', 'center');
    canvasContainer.style('align-items', 'center');

    let left = createElement('div');
    left.id('left');
    left.style('width', '80px');
    left.style('height', '100%');
    left.parent(canvasContainer);

    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent(canvasContainer);

    let right = createElement('div');
    right.id('right');
    right.style('width', '80px');
    right.style('height', '100%');
    right.parent(canvasContainer);

    // Set canvas parent to the container div

    canvasContainer.parent(etchASketch);

    let footer = createElement('div');
    footer.id('footer');
    footer.style('height', '70px');
    footer.style('padding', '0 20px')
    footer.style('display', 'flex');
    footer.style('justify-content', 'space-between');
    footer.parent(etchASketch);

    for (let i = 0; i < 2; i++) {
        let circle = createElement('div');
        circle.style('width', '50px');
        circle.style('height', '50px');
        circle.style('background-color', 'white');
        circle.style('border-radius', '50%');
        circle.parent(footer);
    }
    
}
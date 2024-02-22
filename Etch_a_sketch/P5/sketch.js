const MAX_ANALOG_INPUT = 1023;
const WIDTH = 511;
const HEIGHT = 400;
const BACKGROUND_COLOR = 235;

let serial; // the Serial object
let serialOptions = { baudRate: 115200  };
let queue = []

let xPos = -1;
let yPos = -1;

function setup() {
    buildEtchASketch();
    // Pixel drawing configuration
    pixelDensity(1);
    loadPixels();
    noSmooth();
    strokeWeight(2);
    // Setup Web Serial using serial.js
    serial = new Serial();
    serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);

    // If we have previously approved ports, attempt to connect with them
    // serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);
    background(BACKGROUND_COLOR);

    // Add in a lil <p> element to provide messages. This is optional
    // pHtmlMsg = createP("Uncomment me for debugging!");

    /* Buttons */
    let buttonConnect = createButton("Connect");
    buttonConnect.mousePressed(() => {
        if (serial.isOpen()) {
            serial.close();
            console.log(serial.getSignals())
        }
        serial.connectAndOpen(null, serialOptions);
    });
    let clearButton = createButton("Clear");
    clearButton.mousePressed(() => {
        console.log("Clearing the canvas")
        background(BACKGROUND_COLOR);
        xPos = -1;
        yPos = -1;
    });
    let randomLineButton = createButton("Random Line");
    randomLineButton.mousePressed(() => {
        console.log("Drawing a random line");
        let x1 = Math.floor(random(WIDTH));
        let y1 = Math.floor(random(HEIGHT));
        let x2 = Math.floor(random(WIDTH));
        let y2 = Math.floor(random(HEIGHT));
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
    }
}

function onSerialDataReceived(eventSender, newData) {
    // for debugging on the screen
    // pHtmlMsg.html("onSerialDataReceived: " + newData);
    let data = newData.split(',')
    new_xPos = parseInt(data[0]);
    new_yPos = parseInt(data[1]);

    /* map the values from the arduino to the canvas */
    new_xPos = map(new_xPos, 0, MAX_ANALOG_INPUT, 0, WIDTH);
    new_yPos = map(new_yPos, 0, MAX_ANALOG_INPUT, 0, HEIGHT);
    /* round to nearest int */
    new_xPos = Math.round(new_xPos);
    new_yPos = Math.round(new_yPos);

    /* Initialize the position if it is the first time */
    if (xPos == -1 || yPos == -1) {
        xPos = new_xPos;
        yPos = new_yPos;
        return;
    }

    /* Add the new position to the queue to be drawn */
    if (new_xPos != xPos || new_yPos != yPos) {
        newPos = [new_xPos, new_yPos]
        queue.push(newPos);
    }
}

/* Bresenham's line algorithm, thanks chatGPT */
function drawLine(x1, y1, x2, y2) {
    // console.log("Drawing line from (" + x1 + ", " + y1 + ") to (" + x2 + ", " + y2 + ")");
    let dx = abs(x2 - x1);
    let dy = abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (x1 !== x2 || y1 !== y2) {
        // console.log("Drawing pixel at (" + x1 + ", " + y1 + ")");
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
    // console.log("Drawing pixel at (" + x2 + ", " + y2 + ")");
    setPixel(x2, y2); // Ensure the last pixel is drawn
    // updatePixels();
}

function setPixel(x, y) {
  stroke(0);
  point(x, y);
}

/* Create the etch-a-sketch */
buildEtchASketch = () => {
    let etchASketch = createElement('div');
    etchASketch.id('etchASketch');
    etchASketch.style('background-color', 'red');
    etchASketch.style('width', '680px');
    etchASketch.style('border', '2px solid black');
    etchASketch.style('border-radius', '10px');
    
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
var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");


// JUST COMMENTED TO TEST WITHOUT ARDUINO
// var SerialPort = require("serialport");
// const parsers = SerialPort.parsers;
// const parser = new parsers.Readline({
//   delimiter: "\r\n",
// });

// var port = new SerialPort("COM5", {
//   baudRate: 9600,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });

// port.pipe(parser);
// TILL THIS 

var latestData = ""; // Buffer to store the latest data

var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

var io = require("socket.io").listen(app);
io.on("connection", function (socket) {
  console.log("Node is listening to port");
});




// Define temperature thresholds for each segment (lower and upper bounds)
// Adjust these based on requirements
const thresholds = [
  { lower: 20, upper: 26 }, // Segment 1 thresholds
  { lower: 24, upper: 35 }, // Segment 2 thresholds
  { lower: 30, upper: 45 }, // Segment 3 thresholds
  { lower: 40, upper: 55 }, // Segment 4 thresholds
  { lower: 50, upper: 70 }, // Segment 5 thresholds
];

let elapsedTime = 0;       // Track the elapsed time in seconds
let segmentIndex = 0;      // Track the current segment
const segmentDuration = 120; // Each segment duration is 2 minutes (120 seconds)

// Listen to data from the serial port and store the latest value 

// JUST COMMENTED TO TEST WITHOUT ARDUINO
// parser.on("data", function (data) {
//   console.log("Received data from port: " + data);
//   latestData = data; // Update the buffer with the latest sensor data
// });

// Emit the latest data every 2 seconds
// setInterval(function () {
//   if (latestData) {
//     io.emit("data", latestData);
//   }
// }, 2000); // 2000ms interval (2 seconds)


setInterval(function () {

  // to check without arduino 
  const simulatedData = (Math.random() * 30 + 20).toFixed(2); // Range: 20-80
  console.log("Simulated data: " + simulatedData);
  latestData = simulatedData; // Update latest data with simulated value

  // till this

  elapsedTime += 2; // Increment elapsed time by 2 seconds

  const sensorValue = parseFloat(latestData);

  // Real-time threshold check for the current segment
  const currentThreshold = thresholds[segmentIndex];
  if (sensorValue < currentThreshold.lower || sensorValue > currentThreshold.upper) {
    console.log(`Real-time Error Detected! Value: ${sensorValue} (Out of range: ${currentThreshold.lower}-${currentThreshold.upper}) at ${new Date().toLocaleString()}`);
    io.emit("error", { time: new Date().toLocaleString(), value: sensorValue });
  }

  // Segment check every 2 minutes
  // if (elapsedTime >= segmentDuration * (segmentIndex + 1)) {
  //   if (sensorValue < currentThreshold.lower || sensorValue > currentThreshold.upper) {
  //     console.log(`Segment Error! Segment ${segmentIndex + 1}, Value: ${sensorValue} (Out of range: ${currentThreshold.lower}-${currentThreshold.upper}) at ${new Date().toLocaleString()}`);
  //     io.emit("segmentError", { segment: segmentIndex + 1, time: new Date().toLocaleString(), value: sensorValue });
  //   }

  //   // Move to the next segment if not the last one
  //   if (segmentIndex < thresholds.length - 1) {
  //     segmentIndex++;
  //   }
  // }

  if (elapsedTime >= segmentDuration * (segmentIndex + 1) && segmentIndex < thresholds.length - 1) {
    segmentIndex++;
  }
  if (latestData) {
    io.emit("data", latestData);
  }
}, 2000); // Interval set to 2 seconds 


app.listen(3000);



// so i have some approach like every product will have x time for completely mafacturing it . so  divide the total x time into k division , and for each division we will set threshold if the product passes threshold for any of division then we can say the product has an error
// now i have confusion how to set value of k bec total time to make product can very from small time to large time
// help me out in that

// Define the total manufacturing time and each segment duration.
// Add the threshold values for each segment.
// Implement logic to check if the temperature is within bounds for each segment.
// Add error handling and message notification if a temperature falls outside the set thresholds.
var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");

var SerialPort = require("serialport");
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: "\r\n",
});

var port = new SerialPort("COM5", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

var latestData = ""; // Buffer to store the latest data

var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

var io = require("socket.io").listen(app);
io.on("connection", function (socket) {
  console.log("Node is listening to port");
});


// Listen to data from the serial port and store the latest value
parser.on("data", function (data) {
  console.log("Received data from port: " + data);
  latestData = data; // Update the buffer with the latest sensor data
});

// Emit the latest data every 2 seconds
setInterval(function () {
  if (latestData) {
    io.emit("data", latestData);
  }
}, 2000); // 2000ms interval (2 seconds)

app.listen(3000);



// so i have some approach like every product will have x time for completely mafacturing it . so  divide the total x time into k division , and for each division we will set threshold if the product passes threshold for any of division then we can say the product has an error
// now i have confusion how to set value of k bec total time to make product can very from small time to large time
// help me out in that


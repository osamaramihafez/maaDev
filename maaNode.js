// This is the node file, this is where are all of the http requests are handled
// and where the database is accessed
var port = 3001;

const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const checkout = require('./routes/checkout');
const member = require('./routes/member');
const program = require('./routes/program');
const soccer = require('./routes/soccer');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // This line was added to support the square payments?
//app.use('/', express.static('index.html'));
app.use(express.static('public'))
app.use(checkout);
app.use(member);
app.use(soccer);


// This sets the options for https so that it finds the ssl certificates
//var privateKey = fs.readFileSync('./ssl/key.pem');
//var certificate = fs.readFileSync('./ssl/cert.pem');
//const httpsOptions = {
  //cert: certificate,
  //key: privateKey
//}

//var httpsServer = https.createServer(httpsOptions, app).listen(port, () => {
//  console.log("Serving on https");
//});

app.listen(port)

function isFunction(functionToCheck) {
  // This is just a helper function that checks if any "callback" functions actually exist

  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

const fs = require('fs');
const soap = require('soap');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = 3000;

const app = express();

// Use morgan to log all requests; 'combined' is Apache combined log output
app.use(morgan('combined'));

// Use body-parser to parse JSON body
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));

// Define SOAP service operations
const service = {
	MultiplicationService: {
		MultiplicationPort: {
			multiply: function (args) {
				console.log('Multiply function called with params:', args);
				const result = args.x * args.y;
				return { result };
			}
		}
	}
};

// Read the WSDL file
const wsdl = fs.readFileSync('service.wsdl', 'utf8');

// SOAP service at route '/wsdl'
app.use((req, res, next) => {
	console.log('---------wsdl');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	next();
	// res.header('Content-Type', 'application/xml');
	// res.send(wsdl);
});

// SOAP listener
app.listen(port, () => {
	soap.listen(app, '/multiply', service, wsdl);
	console.log(`SOAP server running at http://localhost:${port}`);
});

// // Set up the SOAP server as a route in your Express application
// app.use('/multiply', function (req, res, next) {
// 	// rawBody is used by the soap module to access the raw SOAP XML
// 	req.rawBody = ''; // Initialize rawBody to capture the stream
// 	req.setEncoding('utf8');
// 	req.on('data', function (chunk) {
// 		req.rawBody += chunk;
// 	});
// 	req.on('end', function () {
// 		// The raw SOAP XML is fully captured
// 		soap.listen(app, '/multiply', service, wsdl, function (err, server) {
// 			// SOAP request is now processed
// 			if (err) next(err);
// 		})(req, res, next);
// 	});
// });

// // Start the server
// const server = app.listen(3000, function () {
// 	console.log('Server is listening on port 3000');
// });

const soap = require('soap');
const url = 'http://localhost:3000/multiply?wsdl';

const args = { x: 10, y: 20 };

soap.createClient(url, function(err, client) {
	if (err) throw err;
	client.multiply(args, function(err, result) {
		if (err) throw err;
		console.log(result);
	});
});

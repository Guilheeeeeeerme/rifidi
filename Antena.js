const net = require('net');

module.exports = function (port, host, callback) {
	//Create a TCP socket to read data from datalogger
	var socket = net.createConnection(port, host);
	var detected = false;

	socket.on('error', function (error) {
		console.log('Error Connecting');
	});

	socket.on('connect', function (connect) {

		console.log('Connection established', port, host);

		socket.setEncoding('ascii');

	});

	socket.on('data', function (data) {

		if (data.indexOf('Username') > 0) {
			socket.write('alien\n');
		} else if (data.indexOf('Password') > 0) {
			socket.write('password\n');
		} else {

			if (data.indexOf('Tag:') > 0) {
				detected = true;
				data = data.replace(/\n/g, '');
				data = data.substring(data.indexOf('Tag:') + 4);
				data = data.substring(0, data.indexOf('Alien'));
				data = data.split(',');
				callback(data);
			} else {
				if (detected == true) {
					callback(null);
				}
				detected = false;
			}
			socket.write('t\n');


		}


		// console.log(data);

		// socket.write("password".charCodeAt(0) + "\n");
		// io.sockets.emit('livedata', { livedata: data });        //This is where data is being sent to html file 

	});

	socket.on('end', function () {
		console.log('Socket closing...');
	});
};
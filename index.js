'use strict';

var Antena = require('./Antena.js');
var db = require('./db.js');
const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

let tags = [];
let hastags = {};
let howIsThere = {};
let lastThere = null;

Antena(20000, '127.0.0.1', entradaCallback);
Antena(20001, '127.0.0.1', saidaCallback);

app.use(express.static('www'));

// Emit welcome message on connection
io.sockets.on('connection', onConnection);

server.listen(3000);

refresh();

function refresh() {
	reload(() => {
		send();
	});
}

function onConnection (socket) {
	send();
	socket.on('onUpdate', onUpdate);
	socket.on('onRemove', onRemove);
}

function onRemove(tag) {
	db.remove(tag.id).then(() => {
		reload(() => {
			io.sockets.emit('onServerUpdate', tags);
		});
	});
}

function onUpdate (tags) {
	const promises = [];
	// id:"3014 D854 394B 4B64 B4AE 1710"
	// is_product:true
	// removed:true
	// value:60

	for(const tag of tags){
		promises.push(db.update(tag.id, tag.is_product, tag.value));
	}

	Promise.all(promises).then(() => {
		reload(() => {
			io.sockets.emit('onServerUpdate', tags);
		});
	});
}

function send(){
	io.sockets.emit('onChange', tags);
}

function reload(callback){
	tags = [];
	hastags = {};
	db.list().then((_tags) => {
		tags = _tags.map(t => {
			hastags[t.id] = 1;
			return t;
		});
		callback && callback();
	});
}

function entradaCallback(data) {
	try {
		io.sockets.emit('highlight', data[0]);
		if( hastags[data[0]] != 1 ) {
			hastags[data[0]] = 1;
			db.insert(data[0], false, 0).then(refresh);
		}
	} catch (error) {
		// console.log(error);
	}
}

function saidaCallback(data) {
	try {
		io.sockets.emit('highlight2', data[0]);
		if( hastags[data[0]] == 1 ) {
			var tag = null;

			for(tag of tags){
				if(data[0] == tag.id)
					break;
			}

			if(tag) {
				if(lastThere && tag.is_product) {
					howIsThere[lastThere][tag.id] = tag;
				} else {
					lastThere = tag.id;
					howIsThere[lastThere] = {};
				}
			}

			const onCheckout = [];

			for(var id in howIsThere) {
				let count = 0;
				let value = 0;
				let prods = [];

				for(var prod in howIsThere[id]) {
					count ++;
					value += howIsThere[id][prod].value;
					prods.push(howIsThere[id][prod]);
				}

				onCheckout.push({
					ppl: id, 
					value,
					count,
					prods
				});

			}

			io.sockets.emit('onCheckout', onCheckout);
		
		} else {
			entradaCallback(data);
		}
	} catch (error) {
		// console.log(error);
	}
}
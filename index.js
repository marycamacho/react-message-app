
;
(function () {
	"use strict";

	var PORT = 3000;

	var fs = require('fs');
	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var expressSession = require('express-session');
	var assert = require('assert');
	var config = require('./config.js');
	var app = express();

	/*MiddleWare*/

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(expressSession({
		secret: config.secret,
		resave: true,
		saveUninitialized: true
	}));

	//mongodb

	//lets require/import the mongodb native drivers.
	var mongodb = require('mongodb');

	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
	var MongoClient = mongodb.MongoClient;

	// Connection URL. This is where your mongodb server is running.
	var url = 'mongodb://localhost:27017/messaging-db';

	//Opens Monggo client (this works fine unless we need db before login -- how would we do this differently?)
	var dbConnection = null;
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		dbConnection = db;
	});

	//used to read messages from internal json file (not mongo)
	var messageFile = __dirname + '/data/messages.json';
	var messages;
	function readMessages(callback) {
		fs.readFile(messageFile, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			messages = JSON.parse(data);
			console.log(messages);
			//callback();
		});
	}
	readMessages();
	


	/*Routes*/

	//root

	app.get("/", function (req, res) {
		if (!req.session.username) {
			res.redirect("/login");
			return;
		}
		res.sendFile(__dirname + '/public/index.html');
	});

	//messages

	app.get("/messages", function (req, res) {
		if (!req.session.username) {
			res.send("[]");
			return;
		}
		res.send(JSON.stringify(messages));
	});


	app.post("/messages", function (req, res) {
		if (!req.session.username) {
			res.send("error: no logged in user");
			return;
		}
		if (!req.body.newMessage) {
			res.send("error: no message in input");
			return;
		}
		messages.push({"username": req.session.username, "message": req.body.newMessage});
		res.send("success-message posted");

	});

	//signup page
		app.get("/signup", function (req, res) {
		return true
	});

	app.post("/signup", function (req, res) {
		return executeDispatchesInOrderStopAtTrue;
	});

	//*login routes and functions

	app.post("/login", function (req, res) {
		if (req.body.username && req.body.password) {
			dbConnection.collection('users').find({"username": req.body.username })
				.toArray(function(err, matchingUsers) {
					assert.equal(err, null);
					if (matchingUsers != null && matchingUsers.length == 1) {
						console.dir(matchingUsers);
						if (matchingUsers[0].password === req.body.password) {
							req.session.username = req.body.username;
							res.redirect("/");
							console.log("user found");
						} else {
							res.redirect("/login");
							console.log("bad password");
						}
					} else {
						res.redirect("/login");
						console.log("no matching user");
					}
				});
		}
	});

	app.get("/login", function (req, res) {
		res.sendFile(__dirname + '/public/login.html');
	});

	/*Always put last because it is sequential*/

	app.use(express.static('public'));

	app.use(function (req, res, next) {
		res.status(404);
		res.send("File not found");
	});

	app.listen(PORT, function () {
		console.log("server started on port " + PORT);
	});

}());









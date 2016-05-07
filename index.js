/*
;(function(){
	"use strict";
	
	var PORT = 3000;
	
	var fs = require('fs');
	
	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var expressSession = require('express-session');
	
	var app = express();
	

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	app.use(cookieParser());
	var  config = require('./config.js');
	app.use(expressSession({
		secret: config.secret,
		resave: true,
		saveUninitialized: true
	}));

	app.get("/", function(req, res) {
		if(!req.session.username) {
			res.redirect("/login");
			return;
		}
		res.sendFile(__dirname + "/public/index.html");
	});


	var messages = ["This is a message", "This is a second message"];

	//
	app.get ("/messages", function(req, res){
		if(!req.session.username) {
			res.send("[]");
			return;
		}
		res.send(JSON.stringify(messages));
	});

	app.post ("/messages", function(req, res) {
		if(!req.session.username) {
			res.send("login error");
			return;
		}

		if(!req.body.newMessage) {
			res.send("error");

		} else {
			messages.push(req.body.newMessage);
			res.send("success");
		}
	});

	var secret = "this is a secret";

	app.get("/login", function(req, res) {
		res.sendFile(__dirname +'/public/login.html' );
	});

	// put this elsewhere and hook extend this so it is more secure (in config.js) and allows multiple people not hardcoded in the end
	function logInUser(username, password) {
		if (username == "mary" && password == "password") {
			//stuff the username into the session as a variable
			return true;
		}
		return false;
	}

	app.post("/login", function(req, res){
		if(req.body.username && req.body.password) {
			if (logInUser (req.body.username, req.body.password)){
				req.session.username = req.body.username;
				res.redirect("/");
				return;
			}
		}
		res.redirect("/login");
	});

	app.use(express.static('public'));

	app.use(function(req, res, next) {
		res.status(404);
		res.send("File not found");
	});

	app.listen(PORT, function() {
		console.log("server started on port " + PORT);
	});

}());
*/

;
(function () {
	"use strict";

	var PORT = 3000;

	var fs = require('fs');

	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var expressSession = require('express-session');
	var fs = require('fs');

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

	//the following is used to bring data into app
	var userFile = __dirname + '/data/users.json';
	var parsedUserData;

	fs.readFile(userFile, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		parsedUserData = JSON.parse(data);


	});

	var messages = ["This is a message", "This is another message"];

	/*Routes*/

	app.get("/", function (req, res) {
		if (!req.session.username) {
			res.redirect("/login");
			return;
		}
		res.sendFile(__dirname + '/public/index.html');
	});

	app.get("/messages", function (req, res) {
		if (!req.session.username) {
			res.send("[]");
			return;
		}
		res.send(JSON.stringify(messages));
	});


	app.post("/messages", function (req, res) {
		if (!req.session.username) {
			res.send("error");
			return;
		}
		if (!req.body.newMessage) {
			res.send("error");
			return;
		}
		messages.push(req.body.newMessage);
		res.send("success");
	});

	//*login routes and functions

	function logInUser(username, password) {
		//Need to identify incoming data and then loop through or compare to parsed data looking match
		var foundUser = parsedUserData.find(function(user){

			if (user.username === username) {
				console.log(user);
				return true
			}
			return false
		});
		if (foundUser) {
			console.log("success!");
			return foundUser.password === password
		} else if (username == "guest" && password == "guest") {
			console.log("success!");
			return true;
		}
		return false;
	}

	app.get("/login", function (req, res) {
		res.sendFile(__dirname + '/public/login.html');
	});

	app.post("/login", function (req, res) {
		if (req.body.username && req.body.password) {
			if (logInUser(req.body.username, req.body.password)) {
				req.session.username = req.body.username;
				res.redirect("/");
				return
			}
		}
		res.redirect("/login");
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









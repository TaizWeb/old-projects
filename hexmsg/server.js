// Dependencies
const http = require('http'),
	express = require('express'),
	crypto = require('crypto'),
	socketio = require('socket.io');

// Server Setup
//const ipAddress = "192.168.2.10";
let port = process.env.PORT || 8000; // Using Heroku's port if available, if not, use 8000
const App = express();
const Server = http.createServer(App);
const io = socketio(Server);
App.set('views', './views');
App.use(express.static('public'));

class Bot {
	constructor() { // Initializing data about the server available to the bot
		this.onlineCount = 0;
	}

	getOnlineCount() {
		return this.onlineCount;
	}

	setOnlineCount(online) {
		this.onlineCount = online;
	}

	compute(user, data) { // The "brain" of the bot; this figures out what command is being used and the proper message to send back
		data = data.split(" ");
		switch (data[0]) {
			case "/help":
				io.to(user.id).emit("bot_message", {"html":`<div class='message from bot'><p>Current commands:<br/>/online - Shows the amount of people currently connected</p></div>`});
				break;

			case "/online":
				io.to(user.id).emit("bot_message", {"html":`<div class='message from bot'><p>There are currently ${this.getOnlineCount() - 1} other users online.</p></div>`});
				break;

			default:
				console.log("Error, command not found.");
				break;
		}
	}
}

class Client { // The Client class
	constructor(client) {
		this.id = client.id; // The id assigned by the websocket, used to send messages to a specific client rather than the whole server
		this.ip = client.request.connection.remoteAddress; // Getting the user's IP
		let hash = crypto.createHmac('sha256', this.ip)
			.update(process.env.hashingSecret)
			.digest('hex'); // Hashing the ip to make a random string of characters in base16
		this.color = "#" + hash.slice(0, 6); // Using the hash of characters to make a hexadecimal color
		this.uniqueid = "user_" + hash.slice(0, 6); // Making an id for the users to track which messages are theirs
	}
}

let bot = new Bot();

// Sockets
io.on('connection', (client) => {
	let currentClient = new Client(client); // Making an instance of the Client class
	io.to(currentClient.id).emit('startup', {userid: currentClient.uniqueid}); // Sending the client it's css code and userid on join
	bot.setOnlineCount(bot.getOnlineCount() + 1);

	client.on('message', (data) => {
		if (data.length < 1000 && data.length >= 1) { // Ensuring that messages aren't too long for the server to handle
			data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Escaping html characters to prevent xss and other nasty things
			if (data.length > 2 && data[0] == "/" && data[1] != " ") bot.compute(currentClient, data);
			else io.sockets.emit('broadcast', {"text": data, "clientid": currentClient.uniqueid, "color": currentClient.color}); // Sending the html to the client
		} else {
			io.to(currentClient.id).emit('client_error', "Messages need to be between 1 - 1000 characters!"); // Throwing an error if the message is over 1000 characters
		}
	});

	client.on('disconnect', () => {
		bot.setOnlineCount(bot.getOnlineCount() - 1);
	});

});

// Routes
App.get('/', (req, res) => {
	res.sendFile(__dirname + "/views/socket.html");
});

// Server Listener
Server.listen(port, () => {
	console.log("Server is running...");
});

// Ping the Dyno to keep it from sleeping
setInterval(() => {
	let currentTime = new Date();
	if (currentTime.getHours() >= 6) http.get("http://hexmsg.herokuapp.com");
}, 300000);

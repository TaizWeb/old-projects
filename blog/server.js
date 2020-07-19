// Middlewares
const http = require('http'),
	fs = require('fs'),
	express = require('express'),
	bodyParser = require('body-parser'),
	helmet = require('helmet'),
	ejs = require('ejs'),
	pg = require('pg'),
	cookieParser = require('cookie-parser'),
	nodemailer = require('nodemailer'),
	compression = require('compression');

// Setting environment variables
const address = 'localhost';
var port = process.env.PORT || 8000;
function ascii2html(ascii) {
	// Returns html-safe code from ascii
	return ascii.replace(/\'/g, "&apos;").replace(/\"/g, "&quot;").replace(/\`/g, "&#96;");
}
function html2ascii(html) {
	// Returns ascii from html-safe code
	return html.replace(/&#96;/g, "\`").replace(/&quot;/g, "\"").replace(/&apos;/g, "\'");
}
function convertLinkFormat(str) {
	// Returns strings safe for use in URLs
	str = html2ascii(str);
	var validCharacter;
	var tempStr = str.toLowerCase().split("");
	var allowedCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'];
	for (var i = 0; i <= tempStr.length; i++) {
		// For every character in the string
		validCharacter = false;
		for (var j = 0; j <= allowedCharacters.length; j++) {
			// Comparing it against every character in the allowedCharacters array
			if (tempStr[i] == " ") tempStr[i] = "-";
			if (tempStr[i] == allowedCharacters[j]) validCharacter = true;
		}
		if (!validCharacter) tempStr[i] = "";
	}
	var alteredStr = "";
	for (var i = 0; i <= tempStr.length; i++) {
		if (tempStr[i] != null) alteredStr += tempStr[i];
	}
	return alteredStr;
}

// App Setup
const App = express();
App.set('views', './views');
App.use(express.static('public'));
App.use(cookieParser());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(bodyParser.json());
App.use(helmet());
App.use(compression());
App.set('view engine', 'ejs');

// The landing page for getting to various sections of the site
App.get('/', (req, res) => {
	res.redirect('/blog');
	//res.send("This portion of the site is currently under maitenence, enjoy my <a href='/blog'>blog</a> while you wait!");
});

// The main blog page for viewing posts
App.get('/blog', (req, res) => {
	// const client = new pg.Client(process.env.databaseLink + "?ssl=true");
	// var data = [];
	// client.connect(err => {
	// 	var query = client.query(`SELECT *
	// 		FROM blog
	// 		ORDER BY date DESC;`);
	// 	query.on('row', row => {
	// 		// Executed every time the server sends a row
	// 		row.body = row.body.slice(0, 400);
	// 		const tempDate = row.date.toString().split(" ");
	// 		row.date = `${ tempDate[1] } ${ tempDate[2] }, ${ tempDate[3] }`;
	// 		data.push(row);
	// 	});
	// 	query.on('end', () => {
	// 		// Executed once the query is complete
	// 		client.end();
	// 		res.render('blog', { data });
	// 	});
	// });
	res.sendFile(__dirname + '/views/blog.html');
});

// A fall-back for if a user visits the page without a specified post
App.get('/blog/post/', (req, res) => {
	res.redirect('/blog');
});

// A template page for the posts
App.get('/blog/post/*', (req, res) => {
	// var data;
	// const urlData = req.url.split("/"); // Picking apart the URL data to see which post is being requested
	// const client = new pg.Client(process.env.databaseLink + "?ssl=true");
	// client.connect(err => {
	// 	var query = client.query(`SELECT * FROM blog WHERE post_link='${ urlData[3] }';`); // Checking if the requested post exists
	// 	query.on('row', row => {
	// 		// Executed whenever the database sends a row
	// 		data = JSON.stringify(row);
	// 	});
	// 	query.on('end', () => {
	// 		// Executed once the query is complete
	// 		client.end();
	// 		if (data == null) res.redirect("/404");
	// 		else res.render("post", JSON.parse(data)); // Sending data to the view
	// 	});
	// });
	res.sendFile(__dirname + '/views/post.html');
});

// The page where users will end up when their request is invalid
App.get('/404', (req, res) => {
	const punArray = ["A friend of mine tried to annoy me with bird puns, but I soon realized that toucan play at that game.", "Have you ever tried to eat a clock? It's very time consuming.", "Police were called to a daycare where a three-year-old was resisting a rest.", "I couldn't quite remember how to throw a boomerang, but eventually it came back to me.", "Simba was walking too slow, so I told him to Mufasa.", "Why is Peter Pan always flying? He neverlands! I love this joke because it never grows old.", "Jokes with punch lines can be painfully funny.", "A man died today when a pile of books fell on him. He only had his shelf to blame.", "What do you call a dinosaur with an extensive vocabulary? A Thesaurus.", "What happens when four children lock themselves in a wardrobe? That's narnia business..", "Why was Cinderella thrown off the basketball team? She ran away from the ball.", "My first job was working in an orange juice factory, but I got canned: couldn't concentrate.", "I wanna make a joke about sodium, but Na..", "Did you hear about the Italian chef with a terminal illness? He pastaway.", "An expensive laxative will give you a run for your money.", "I never understood odorless chemicals, they never make scents.", "Never trust an atom, they make up everything!", "When two vegetarians are arguing, is it still considered beef?", "I stayed up all night to see where the sun went. Then it dawned on me.", "When life gives you melons, you're probably dyslexic.", "I make apocalypse jokes like there's no tomorrow.", "No matter how hard you push the envelope it will still be stationery.", "What tea do hockey players drink? Penaltea!", "Did you hear about the guy who got hit in the head with a can of soda? He was lucky it was a soft drink.", "I was trying to make a pun about escaping quicksand but I'm stuck.", "The rotation of the earth really makes my day!"];
	res.render("404", { "pun": punArray[Math.floor(Math.random() * punArray.length)] });
});

// To ensure only admins have access to the database
App.get('/signin', (req, res) => {
	//if (req.cookies['password'] == process.env.adminPassword)
	// Make post request to target containing cookie password
	const target = req.query.target; // Finding out where to redirect to after signing in
	res.render("signin", { "target": target });
});

// The page where new posts are created and added to the database
App.get('/blog/new', (req, res) => {
	res.redirect('/signin?target=blog/new');
});

// Sending the data from the previous GET request to the database
App.post('/blog/new', (req, res) => {
	// Ensuring only authorized users can view the page
	if (req.body.username == process.env.adminUsername && req.body.password == process.env.adminPassword) res.render("blog_new", {});else res.redirect('/signin?target=blog/new');
});

App.post('/blog/new_handler', (req, res) => {
	console.log("Sanitizing Data...");
	const date = new Date();
	var currentDate = `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() - 2000 }`;
	var postTitle = ascii2html(req.body.post_title);
	var postBody = ascii2html(req.body.post_body);
	var postLink = convertLinkFormat(postTitle);
	if (postTitle.length < 256 && postTitle.length > 0 && postBody.length < 10000 && postBody.length > 0) {
		console.log("Data Sanitation Complete.");
		const client = new pg.Client(process.env.databaseLink + "?ssl=true");
		console.log("Connecting to the database...");
		client.connect(err => {
			// Executed whenever the database sends a row
			console.log("Connection success, querying in progress...");
			var query = client.query(`INSERT INTO blog(title,date,body,post_link)
				VALUES('${ postTitle }','${ currentDate }','${ postBody }','${ postLink }');`);
			query.on('end', () => {
				// Executed once the query is complete
				client.end();
				console.log("Query complete, Connection terminated.");
				res.redirect('/blog');
			});
		});
	} else {
		console.log("Error: post_title or post_body exceeded character limit");
		res.render('blog_new', { error: "Error: post_title or post_body exceeded character limit" });
	}
});

App.get('/blog/edit', (req, res) => {
	res.redirect('/signin?target=blog/edit');
});

// The page where the posts can be viewed/managed
App.post('/blog/edit', (req, res) => {
	if (req.body.username == process.env.adminUsername && req.body.password == process.env.adminPassword) {
		var postsArray = [];
		var client = new pg.Client(process.env.databaseLink + "?ssl=true");
		console.log("Connecting to the database...");
		client.connect(err => {
			console.log("Connection success, querying in progress...");
			var query = client.query(`SELECT * FROM blog ORDER BY date`);
			query.on('row', row => {
				row.title = ascii2html(row.title);
				row.body = ascii2html(row.body);
				postsArray.push(row);
			});
			query.on('end', () => {
				// Once the query is complete, the client will close
				res.cookie('password', req.body.password);
				client.end();
				console.log("Query complete, Connection terminated.");
				res.render("blog_edit", { "postsArray": postsArray });
			});
		});
		// Implement below when the server goes public
	} else {
		console.log(`Bad password, expected ${ process.env.adminUsername }, got ${ req.body.username }, expected ${ process.env.adminPassword }, got ${ req.body.password }.`);
		res.redirect('/signin?target=blog/edit');
	}
});

// Sending the data to the database from the GET request
App.post('/blog/edit_handler', (req, res) => {
	invalidRequest = false;
	req.body.post_link = convertLinkFormat(req.body.post_name);
	switch (req.body.submit) {
		case 'Edit':
			res.redirect('/blog/edit_post?post_link=' + req.body.post_link);
			break;
		case 'View':
			res.redirect('/blog/post/' + req.body.post_link);
			break;
		case 'Remove':
			var client = new pg.Client(process.env.databaseLink + "?ssl=true");
			console.log("Connecting to the database...");
			client.connect(err => {
				console.log("Connection success, querying in progress...");
				var query = client.query("DELETE FROM blog WHERE title='" + req.body.post_name + "';");
				query.on('end', () => {
					// Executed once the query is complete
					client.end();
					console.log("Query complete, Connection terminated.");
					res.redirect('/blog/edit');
				});
			});
			break;
		default:
			console.log("Error: Invalid Request");
			invalidRequest = true;
			res.redirect('/blog/edit');
			break;
	}
});

// The place where post can be edited individually
App.get('/blog/edit_post', (req, res) => {
	// Use the query string to get db data then send it into a form
	if (req.query.post_link != null) {
		// Ensuring the query variable exists in the request
		var postData;
		const queryString = `SELECT * FROM blog WHERE post_link='${ req.query.post_link }';`;
		var client = new pg.Client(process.env.databaseLink + "?ssl=true");
		console.log("Connecting to the database...");
		client.connect(err => {
			console.log("Connection success, querying in progress...");
			var query = client.query(queryString);
			query.on('row', row => {
				postData = row;
			});
			query.on('end', () => {
				// Once the query is complete, the client will close
				client.end();
				console.log("Query complete, Connection terminated.");
				if (typeof postData == 'undefined') {
					console.log("Database has no records for such post!");
					res.redirect('/blog/edit');
				} else {
					res.render('edit_post', { "postData": postData });
				}
			});
		});
	} else {
		res.redirect('/blog/edit');
	}
});

App.post('/blog/edit_post?*', (req, res) => {
	var client = new pg.Client(process.env.databaseLink + "?ssl=true");
	console.log("Connecting to the database...");
	client.connect(err => {
		console.log("Connection success, querying in progress...");
		// Updating the title and body to the data sent
		var query = client.query(`
			UPDATE blog
			SET title='${ ascii2html(req.body.post_title) }',body='${ ascii2html(req.body.post_body) }'
			WHERE title='${ req.query.old_title }';
		`);
		query.on('end', () => {
			// Once the query is complete, the client will close
			client.end();
			console.log("Query complete, Connection terminated.");
		});
	});
	res.redirect('/blog/edit');
});

App.get('/blog/subscribe?*', (req, res) => {
	var data = [];
	if (req.query.action != null && req.query.email != null && req.query.code != null) {
		console.log(req.query.code);
		// Connect to db and ensure the email/code match
		var client = new pg.Client(process.env.databaseLink + "?ssl=true");
		console.log("Connecting to the database...");
		client.connect(err => {
			console.log("Connection success, querying in progress...");
			// Updating the title and body to the data sent (email, code)
			var query = client.query(`
				SELECT *
				FROM subscribers
				WHERE email='${ convertLinkFormat(req.query.email) }'
				AND code='978243';
			`);
			query.on('row', row => {
				data.push(row);
				console.log(JSON.stringify(row));
			});
			query.on('end', () => {
				// Once the query is complete, the client will close
				client.end();
				console.log("Query complete, Connection terminated.");
				res.send("Received data: " + data);
			});
		});
	} else {
		res.redirect('/blog');
	}
});

App.post('/blog/subscribe', (req, res) => {
	var confirmationCode = Math.floor(Math.random() * 1000000);
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.email,
			pass: process.env.emailpass
		}
	});
	const mailOptions = {
		from: '"TaizNet" <' + process.env.email + '>',
		to: req.body.email,
		subject: 'Please confirm your email address',
		text: 'Copy this link into your browser to confirm your subscription: ',
		html: `Copy the link below into your browser to confirm your subscription or click <a href="http://taiznet.herokuapp.com/blog/subscribe?action=confirm&code=${ confirmationCode }">here</a><br/>http://taiznet.herokuapp.com/blog/subscribe?action=confirm&email=${ convertLinkFormat(process.env.email) }&code=${ confirmationCode }`
	};
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) console.log(err);
		console.log(`Message ${ info.messageId } sent: ${ info.response }`);
	});
	var client = new pg.Client(process.env.databaseLink + "?ssl=true");
	console.log("Connecting to the database...");
	client.connect(err => {
		console.log("Connection success, querying in progress...");
		// Updating the title and body to the data sent (email, code)
		var query = client.query(`
			INSERT INTO subscribers
			VALUES ('${ req.body.email }', '${ confirmationCode }');
		`);
		query.on('row', row => {
			console.log(JSON.stringify(row));
		});
		query.on('end', () => {
			// Once the query is complete, the client will close
			client.end();
			console.log("Query complete, Connection terminated.");
		});
	});
	res.render('subscribe', { "email": req.body.email });
});

// API
App.get('/api', (req, res) => {
	var postData;
	console.log("API call in progress...");
	if (typeof req.query.target == 'undefined') {
		res.send('{"err":"target not defined! Please see API docs!"}');
	} else {
		switch (req.query.target) {
			case 'blog':
				if (typeof req.query.post_link == 'undefined') {
					var client = new pg.Client(process.env.databaseLink + "?ssl=true");
					let posts = [];
					console.log("Connecting to database...");
					client.connect(err => {
						console.log("Connection success, querying in progress");
						let query = client.query(`SELECT * FROM blog LIMIT 5`);

						query.on('row', row => {
							posts.push(row);
							console.log("Posts pushed!")
						});

						query.on('end', () => {
							client.end();
							console.log("Query complete, Connection terminated.");
							let results = {};
							//console.log(posts)
							results.data = posts;
							res.send(JSON.stringify(results));
						});

					});
				} else {
					var client = new pg.Client(process.env.databaseLink + "?ssl=true");
					console.log("Connecting to the database...");
					client.connect(err => {
						console.log("Connection success, querying in progress...");
						var query = client.query(`SELECT * FROM blog WHERE post_link='${ req.query.post_link }';`);

						query.on('row', row => {
							postData = row;
						});

						query.on('end', () => {
							// Once the query is complete, the client will close
							client.end();
							console.log("Query complete, Connection terminated.");
							if (typeof postData == 'undefined') {
								res.send('{"err":"Post does not exist!"}');
							} else {
								// Solution: Decode the html-safe characters on the client-side
								res.send(JSON.stringify(postData));
							}
						});

					});
				}
				break;
			default:
				res.send('{"err":"Unknown target! Please see API docs!"}');
				break;
		}
	}
	console.log("API call complete");
});

// If the client's GET request matches none of the available ones, it'll end up here
App.get('/*', (req, res) => {
	res.redirect("/404");
});

// Server Launch
App.listen(port, () => {
	console.log(`App running on ${address}:${port}`);
});

// Make the server ping itself every 5 minutes to prevent Dyno sleep
setInterval(() => {
	let currentTime = new Date();
	if (currentTime.getHours() >= 6) http.get("http://taiznet.herokuapp.com"); // Allowing the app to sleep between 00:00 - 06:00
}, 300000);

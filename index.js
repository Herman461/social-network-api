const express = require('express');
const fs = require('fs');
const jsonParser = express.json();
const app = express();
const PORT = process.env.PORT ?? 4000;

const filePath = "users.json";

const url = 'mongodb+srv://Herman:lera09072013@cluster0.ibwb5.mongodb.net/usersdb';

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });


const cors = require('cors');
app.use(cors()) // Use this after the variable declaration

let dbClient;


mongoClient.connect((err, client) => {
	if (err) return console.log(err);

	dbClient = client;
	app.locals.collection = client.db('usersdb').collection('users');

	app.listen(PORT, () => {
		console.log(`Server has been started on port ${PORT}`);
	});
});


app.get('/api/users', (req, res) => {
	const collection = req.app.locals.collection;
	collection.find({}).toArray((err, users) => {

			if (err) return console.log(err);
			const data = {
				items: users,
				resultCode: 0
			}
			res.send(data);
	});
});

app.put('/api/follow/:id', jsonParser, (req, res) => {
	const id = +req.params.id;
	const followed = req.body.followed;
	const collection = req.app.locals.collection;

	collection.findOneAndUpdate({ _id: id }, { $set: { followed } }, 
	{ returnOriginal: false }, (err, result) => {
		if (err) console.log(err);

		const user = result.value;
		const data = {
			user,
			resultCode: 0
		}

		res.send(data);
	});
});

app.get('/api/auth/me', (req, res) => {
	const collection = req.app.locals.collection;

	collection.findOne({ name: "Герман" }, (err, user) => {
		if (err) console.log(err);

		const data = {
			user,
			resultCode: 0
		}
		res.send(data);
	});
});

app.get('/api/profile/:id', (req, res) => {
	const id = +req.params.id;
	const collection = req.app.locals.collection;

	collection.findOne({ _id: id }, (err, profile) => {
		if (err) return console.log(err);
		const data = {
			profile,
			resultCode: 0
		}
		res.send(data);
	});
});

process.on('SIGINT', () => {
	dbClient.close();
	process.exit();
});




// app.get('/api/users', (req, res) => {
// 	let data = fs.readFileSync(filePath, 'utf8');
// 	let users = JSON.parse(data);
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.send(users); 
// });
// app.use(function(req, res, next){
//   req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
//   next()
// })
// app.put('/api/users', jsonParser, (req, res) => {
// 	if (!req.body) return res.sendStatus(400);
// 	const id = req.body.id;
// 	const followed = req.body.followed;

// 	let data = fs.readFileSync(filePath, 'utf8');
// 	let users = JSON.parse(data);
// 	let user;

// 	for (let i = 0; i < users.items.length; i++) {
// 		if (users.items[i].id == id) {
// 			user = users.items[i];
// 			break;
// 		}
// 	}
// 	if (user) {
// 		user.followed = followed;

// 		users.resultCode = 0;
// 		data = JSON.stringify(users);
// 		fs.writeFileSync(filePath, data);

// 		res.send({
// 			user,
// 			resultCode: 0
// 		});
// 	} else {
// 		users.resultCode = 1;


// 		res.status(404).send({
// 			user,
// 			resultCode: 1
// 		});
// 	}

// })
// app.listen(PORT, () => {
// 	console.log(`Server has been started on port ${PORT}`);
// });




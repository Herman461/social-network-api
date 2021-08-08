const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcryptjs');
const UserModel = require('./models/User');
const jsonParser = express.json();
const app = express();
const PORT = process.env.PORT ?? 4000;
const mongoURI = 'mongodb+srv://Herman:lera09072013@cluster0.ibwb5.mongodb.net/usersdb';

const store = new MongoDBStore({
	uri: mongoURI,
	collection: 'sessions'
})


const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(mongoURI, { useUnifiedTopology: true });


const cors = require('cors');

app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: "key that will sing cookie",
	resave: false,
	saveUninitialized: false,
	store: store,
	cookie: {maxAge: 24 * 60 * 60 * 1000}
}))

app.use(cors({
    origin: 'http://localhost:3000',
    preflightContinue: false,
    credentials: true 
}));

mongoose.connect(mongoURI, {
	useCreateIndex: true,
	useUnifiedTopology: true,
	useNewUrlParser: true
}).then(res => console.log('MongoDB Connected'))

app.get('/api/users', async (req, res) => {
	const users = await UserModel.find({});
	const data = {
		items: users,
		resultCode: 0
	};
	res.send(data);
});

app.get('/api/follow/:id', async (req, res) => {
	// const { followed } = req.body;
	const id = +req.params.id;
	
	const user = await UserModel.findById(id)
    user.followers._id = id;
    await user.save();
  		// .then((user) => {
   	// 		res.send({ user });
  		// })
  		// .catch(e => res.status(400).send(e));
	
	// await UserModel.findOneAndUpdate({ _id: id }, { $set: { followed } }, 
	// 	{ returnOriginal: false }, (err, result) => {
	// 		if (err) console.log(err);
	// 		user = result.value;
	// 		res.send(data);
	// 	});
	// const data = {
	// 	user,
	// 	resultCode: 0
	// }
});

app.put('/api/profile/status', jsonParser, async (req, res) => {
	
	const { status } = req.body;

	await UserModel.findOneAndUpdate({ id: req.session.userId }, 
		{ $set: { status }}, { returnOriginal: false, useFindAndModify: false })
		


	const data = {
		status,
		resultCode: 0
	}
	res.send(data);
})



app.get('/api/auth/me', async (req, res) => {

	const user = await UserModel.findOne({ id: req.session.userId });

	if (!user) {
		return res.send({ resultCode: 1, message: "You are not authorized" });
	}
	return res.send({ user, resultCode: 0});
});


app.post('/api/auth/login', jsonParser, async (req, res) => {
	const { username, password } = req.body;

	const user = await UserModel.findOne({ username });
	const message = 'The username or password is incorrect. Please try again';

	if (!user) {
		return res.send({ resultCode: 1, message });
	}

	const isMatch = await bcrypt.compare(password, user.password);
	
	if (!isMatch) {
		return res.send({ resultCode: 1, message });
	}

	req.session.userId = user.id;

	res.send({
		resultCode: 0,
		user
	});
});

app.post('/api/auth/login/validUsername', jsonParser, async (req, res) => {
	const { username } = req.body;

	const user = await UserModel.findOne({ username });
	if (user) {
		return res.send({ message: 'Username already in use. Please choose another.' });
	}

	res.send({ message: "" });
});

app.post('/api/auth/login/validPassword', jsonParser, async (req, res) => {
	const { password } = req.body;

	const user = await UserModel.findOne({ password });
	if (user) {
		return res.send({ message: 'Username already in use. Please choose another.' });
	}

	res.send({ message: "" });
});


app.delete('/api/auth/login', async (req, res) => {
	req.session.destroy();
	res.send({
		resultCode: 0
	})
});



app.post('/api/register', jsonParser, async (req, res) => {
	const { username, password } = req.body;

	let user = await UserModel.findOne({ username });

	if (user) {
		return res.send({ resultCode: 1, message: "User with this username already exists", data: {} });
	}
	

	const hashedPsw = await bcrypt.hash(password, 12);

	user = new UserModel({
		username,
		password: hashedPsw
	});
	await user.save();

	req.session.userId = user.id;

	res.send({
		resultCode: 0,
		user
	})
});



app.get('/api/profile', async(req, res) => {
	

	const user = await UserModel.findOne({ id: req.session.userId });

	if (!user) {
		return res.send({ resultCode: 1, message: "User is not authorized" })
	}
	const data = {
		message: "",
		resultCode: 0,
		profile: {
			id: user.id,
			username: user.username,
			ava: user.ava,
			status: user.status
		}
	}
	res.send(data)
});

app.listen(PORT, () => {
	console.log(`Server has been started on port ${PORT}`);
})
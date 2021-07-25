const express = require('express');
const fs = require('fs');
const jsonParser = express.json();
const app = express();
const PORT = process.env.PORT ?? 4000;

const filePath = "users.json";

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration

app.get('/api/users', (req, res) => {
	let data = fs.readFileSync(filePath, 'utf8');
	let users = JSON.parse(data);
	res.header("Access-Control-Allow-Origin", "*");
	res.send(users); 
});
app.use(function(req, res, next){
  req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
  next()
})
app.put('/api/users', jsonParser, (req, res) => {
	if (!req.body) return res.sendStatus(400);
	const id = req.body.id;
	const followed = req.body.followed;

	let data = fs.readFileSync(filePath, 'utf8');
	let users = JSON.parse(data);
	let user;

	for (let i = 0; i < users.items.length; i++) {
		if (users.items[i].id == id) {
			user = users.items[i];
			break;
		}
	}
	if (user) {
		user.followed = followed;

		users.resultCode = 0;
		data = JSON.stringify(users);
		fs.writeFileSync(filePath, data);

		res.send({
			user,
			resultCode: 0
		});
	} else {
		users.resultCode = 1;


		res.status(404).send({
			user,
			resultCode: 1
		});
	}

})
app.listen(PORT, () => {
	console.log(`Server has been started on port ${PORT}`);
});




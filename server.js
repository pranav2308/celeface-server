const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

var knex = require('knex')

const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'face_recognition_db'
  }
});



const dummyDatabase = {
	users : [
		{
			id : "1",
			name : "Pranav",
			email : "pranav08@terpmail.umd.edu",
			password : "banana",
			entries : 0,
			joinDate : new Date()  
		},
		{
			id : "2",
			name : "John",
			email : "johnwick@terpmail.umd.edu",
			password : "dog",
			entries : 0,
			joinDate : new Date()  
		}
	]
}

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.send(dummyDatabase.users);
})

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;

	for( user of dummyDatabase.users){
		if( user.email === email ){
			res.status(400).json("User with same email already exists. You can try signing-in or choose another email for registration");
			return;
		}
	}
	const id = (dummyDatabase.users.length + 1).toString();
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash){
			dummyDatabase.users.push({
				id : id,
				name : name,
				email : email,
				password : hash,
				entries : 0,
				joinDate : new Date() 
			});
			const lastRegisteredUser = dummyDatabase.users[dummyDatabase.users.length - 1];
			const userData = {
				id : lastRegisteredUser.id,
				name : lastRegisteredUser.name,
				email : lastRegisteredUser.email,
				entries : lastRegisteredUser.entries,
				joinDate : lastRegisteredUser.joinDate
			};
			res.status(200).json(userData);
		})
	})
	
	
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	let foundUser = false;
	for (user of dummyDatabase.users){
		if(user.email === email && bcrypt.compareSync(password, user.password)){
			const userData = {
				id : user.id,
				name : user.name,
				email : user.email,
				entries : user.entries,
				joinDate : user.joinDate
			}
			res.status(200).json(userData);
			foundUser = true;
			break;
		}
	}
	if(!foundUser){
		res.status(400).json("Unable to sign-in. Please check your email and password");
	}
})


// app.post('/signin', (req, res) => {
// 	const { email, password } = req.body;
// 	let foundUser = false;
// 	for (user of dummyDatabase.users){
// 		if(user.email === email && user.password === password){
// 			const userData = {
// 				id : user.id,
// 				name : user.name,
// 				email : user.email,
// 				entries : user.entries,
// 				joinDate : user.joinDate
// 			}
// 			res.status(200).json(userData);
// 			foundUser = true;
// 			break;
// 		}
// 	}
// 	if(!foundUser){
// 		res.status(400).json("Unable to sign-in. Please check your email and password");
// 	}
// })



app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let foundUser = false;
	for (user of dummyDatabase.users ){
		if(user.id === id){
			foundUser = true;
			res.status(200).json(user);
			break;
		}
	}
	if(!foundUser){
		res.status(400).json("Sorry! No such user exists");
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let foundUser = false;
	for (user of dummyDatabase.users ){
		if(user.id === id){
			foundUser = true;
			user.entries += 1;
			res.status(200).json(user.entries);
			break;
		}
	}
	if(!foundUser){
		res.status(400).json("Sorry! No such user exists");
	}

})

app.use(function(req, res){
	res.status(404).send("Page not found!");
});


app.listen(3000, () => {console.log('Listening to request on port 3000!')});
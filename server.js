const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const dummyDatabase = {
	users : [
		{
			id : 1,
			name : "Pranav",
			email : "pranav08@terpmail.umd.edu",
			password : "banana",
			entries : 0,
			joinDate : new Date()  
		},
		{
			id : 2,
			name : "John",
			email : "johnwick@terpmail.umd.edu",
			password : "dog",
			entries : 0,
			joinDate : new Date()  
		}
	]
}

app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.send(dummyDatabase.users);
})

app.post('/register', (req, res) => {
	const { name, email, password, reTypePassword } = req.body;
	if( password !== reTypePassword ){
		res.status(400).json("Your password and re-typed password does not match. Please register again");
		return;
	}

	for( user of dummyDatabase.users){
		if( user.email === email ){
			res.status(400).json("User with same email already exists. You can try signing-in or choose another email for registration");
			return;
		}
	}
	const id = dummyDatabase.users.length + 1;
	dummyDatabase.users.push({
		id : id,
		name : name,
		email : email,
		password : password,
		entries : 0,
		joinDate : new Date() 
	})
	res.status(200).json("you have been successfully registered!");
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	let foundUser = false;
	for (user of dummyDatabase.users){
		if(user.email === email && user.password === password){
			res.status(200).json("you have successfully signed in!");
			foundUser = true;
			break;
		}

	}
	if(!foundUser){
		res.status(400).json("Unable to sign-in. Please check your email and password");
	}
})

app.listen(3000, () => {console.log('Listening to request on port 3000!')});
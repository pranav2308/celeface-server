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
    password : 'pranav2308',
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
});

// app.post('/register', (req, res) => {
// 	const { name, email, password } = req.body;

// 	for( user of dummyDatabase.users){
// 		if( user.email === email ){
// 			res.status(400).json("User with same email already exists. You can try signing-in or choose another email for registration");
// 			return;
// 		}
// 	}
// 	const id = (dummyDatabase.users.length + 1).toString();
// 	bcrypt.genSalt(10, function(err, salt) {
// 		bcrypt.hash(password, salt, function(err, hash){
// 			dummyDatabase.users.push({
// 				id : id,
// 				name : name,
// 				email : email,
// 				password : hash,
// 				entries : 0,
// 				joinDate : new Date() 
// 			});
// 			const lastRegisteredUser = dummyDatabase.users[dummyDatabase.users.length - 1];
// 			const userData = {
// 				id : lastRegisteredUser.id,
// 				name : lastRegisteredUser.name,
// 				email : lastRegisteredUser.email,
// 				entries : lastRegisteredUser.entries,
// 				joinDate : lastRegisteredUser.joinDate
// 			};
// 			res.status(200).json(userData);
// 		})
// 	})
// })

// addUserData = (trx) => {
// 	return trx('login').insert({email : email, hash : hash})
// 	.then(() => {
// 		return trx('users').returning('*').insert({name : name, email : email, joindate : new Date()});
// 	})
// }

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;

	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(password, salt, function(err, hash) {
			database.transaction(function(trx){
				return trx('login').insert({email : email, hash : hash})
						.then(() => {
							return trx('users').returning('*').insert({name : name, email : email, joindate : new Date()});
						});
			})
			.then(user => res.status(200).json(user[0]))//respond to the front end with user data
			.catch(error => {
				if(parseInt(error.code) === 23505){
					res.status(409).json("User with same email already exists. You can try signing-in or choose another email for registration");
				}
				else{
					res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`);
				}
			});  
    	});
	});
});

// app.post('/signin', (req, res) => {
// 	const { email, password } = req.body;
// 	let foundUser = false;
// 	for (user of dummyDatabase.users){
// 		if(user.email === email && bcrypt.compareSync(password, user.password)){
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
// });


app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	database('login').where({email : email}).select('hash')
	.then(data => {
		if(data.length){
			bcrypt.compare(password, data[0].hash, function(err, match){
				if(match){
					database('users').where({email : email}).select('*')
					.then(user => res.status(200).json(user[0]))
					.catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));
				}
				else{
					res.status(401).json("Unable to sign-in. Please check your password");
				}
			});	
		}
		else{
			res.status(401).json("Unable to sign-in. Please check your email");
		}
				
	}).catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));
})


app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	database('users').where({id : id}).select('*')
	.then(user => {
		if(user.length){
			res.status(200).json(user[0])
		}
		else{
			res.status(406).json("User with this id does not exist!");
		}
	}).catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));

	// let foundUser = false;
	// for (user of dummyDatabase.users ){
	// 	if(user.id === id){
	// 		foundUser = true;
	// 		res.status(200).json(user);
	// 		break;
	// 	}
	// }
	// if(!foundUser){
	// 	res.status(400).json("Sorry! No such user exists");
	// }
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	database('users').where('id', '=', id).increment('entries', 1)
	.returning('entries')
	.then(entries => {
		if(entries.length){
			res.status(200).json(entries[0]);
		}
		else{
			res.status(406).json("User with this id does not exist!");
		}
	}).catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));

	// let foundUser = false;
	// for (user of dummyDatabase.users ){
	// 	if(user.id === id){
	// 		foundUser = true;
	// 		user.entries += 1;
	// 		res.status(200).json(user.entries);
	// 		break;
	// 	}
	// }
	// if(!foundUser){
	// 	res.status(400).json("Sorry! No such user exists");
	// }

});

app.use(function(req, res){
	res.status(404).send("Page not found!");
});


app.listen(3000, () => {console.log('Listening to request on port 3000!')});
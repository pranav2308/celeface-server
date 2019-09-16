
const isNameValid = (name) => {
	return (Boolean(name.length));
} 

const isEmailValid = (email) => {
	let re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  	return re.test(email);
}

const isPasswordValid = (password) => {
	let re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
	return re.test(password);
}

const isValidRegistrationForm = (firstName, lastName, email, password) => {
	if(isNameValid(firstName) && isNameValid(lastName) && isEmailValid(email) && isPasswordValid(password)){
		return true;
	}
	return false;
}



const registerNewUser = (bcrypt, database) => (req, res) => {
		
	const { firstName, lastName, email, password, country } = req.body;
	if(isValidRegistrationForm(firstName, lastName, email, password)){
		bcrypt.genSalt(10, function(err, salt) {
	    	bcrypt.hash(password, salt, function(err, hash) {
				database.transaction(function(trx){
					return trx('users').insert({firstname : firstName, lastname : lastName, email : email, country : country, joindate : new Date()})
							.then(() => {
								return trx('login').insert({email : email, hash : hash});
							});
				})
				.then(() => {
					return database('users').where({email : email}).select('*');
				})
				.then(user => {
					if(user.length){
						res.status(200).json(user[0]);	
					}
					else{
						//This case should not happen as transaction was successfull.
						res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`); 
					}
				})//respond to the front end with user data
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
	}
	else{
		res.status(406).json("Invalid Credentials");
	}
	
}


module.exports = registerNewUser;
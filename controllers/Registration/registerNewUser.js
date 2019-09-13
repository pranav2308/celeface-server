const registerNewUser = (bcrypt, database) => (req, res) => {
		
	const { firstName, lastName, email, password, country } = req.body;
	
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


module.exports = registerNewUser;
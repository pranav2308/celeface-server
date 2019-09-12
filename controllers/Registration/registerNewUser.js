const registerNewUser = (bcrypt, database) => (req, res) => {
		
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
}



module.exports = registerNewUser;
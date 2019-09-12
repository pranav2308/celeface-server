const signInUser = (bcrypt, database) => (req, res) => {
	
	const { email, password } = req.body;
	
	database('login').where({email : email}).select('hash')
	.then(data => {
		if(data.length){
			bcrypt.compare(password, data[0].hash, function(err, match){
				if(match){
					database('users').where({email : email}).select('*')
					.then(user => {
						if(user.length){
							res.status(200).json(user[0]);
						}
						else{ //This case shouldn't arise since transaction would not let any data inconsistency. 
							res.status(400).json(`Oops! Something went wrong. Unable to fetch the user data`);		
						}
					})
					.catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));
				}
				else{
					res.status(401).json("Unable to sign-in. Please check your email and password");
				}
			});
		}
		else{
			res.status(401).json("Unable to sign-in. Please check your email and password");
		}	
	}).catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));
}


module.exports = signInUser;
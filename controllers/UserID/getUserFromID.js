const getUserFromID = (database) => (req, res) => {
	
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
}

module.exports = getUserFromID;
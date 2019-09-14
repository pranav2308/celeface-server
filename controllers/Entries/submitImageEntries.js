const submitImageEntries = (database) => (req, res) => {
	
	const { id, imageUrl, email } = req.body;
	
	database.transaction(function(trx){
		return trx('image_data').insert({email : email, image_link : imageUrl, submission_date : new Date()})
				.then(() => {
					return trx('users').where('id', '=', id).increment('entries', 1).returning('entries');
				})
	})
	.then(entries => {
		if(entries.length){
			res.status(200).json(entries[0]);
		}
		else{
			res.status(406).json("User with this id does not exist!");
		}
	}).catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));
}


module.exports = submitImageEntries;
const incrementImageEntries = (database) => (req, res) => {
	
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
}


module.exports = incrementImageEntries;
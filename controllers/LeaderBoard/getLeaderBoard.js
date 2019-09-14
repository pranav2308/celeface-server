const getLeaderBoard = (database) => (req, res) => {
	database.select('firstname', 'lastname', 'country', 'entries').from('users').orderBy('entries', 'desc').limit(10)
	.then(data => {
		res.status(200).json(data);
	}).catch(error => res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`));
}

module.exports = getLeaderBoard;
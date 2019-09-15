const Clarifai = require('clarifai');
const app = new Clarifai.App({
 	apiKey: 'c3fc1f30ca4844d4a8b43f29578e586e'
});


detectCelebrity = () => (req, res) => {

	const { imageUrl } = req.body;
	
	app.models.predict("e466caa0619f444ab97497640cefc4dc", imageUrl)
	.then(apiResponse => {
		if(apiResponse.status.code === 10000){
			res.status(200).json(apiResponse);
		}
		else{
			res.status(500).json("Oops! something has gone bad with Clarifai API request!");
		}
	})
	.catch(error => {
		res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`);	
	})
}


module.exports = detectCelebrity;
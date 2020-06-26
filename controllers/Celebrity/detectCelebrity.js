const Clarifai = require('clarifai');
const app = new Clarifai.App({
 	apiKey: 'c3fc1f30ca4844d4a8b43f29578e586e'
});


detectCelebrity = () => (req, res) => {
	/*
	* Detect the celebrity from the imageUrl
	* If the response code is 10000 -> response is ok then send the response.
	* Else return error resoponse. 
	*/
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
		if(error.message === "Request failed with status code 400"){
			res.status(406).json("Image url does not redirect to image");
		}
		else{
			res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`);	
		}
	})	
}


module.exports = detectCelebrity;
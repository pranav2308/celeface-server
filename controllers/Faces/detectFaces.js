const Clarifai = require('clarifai');
const app = new Clarifai.App({
 	apiKey: 'c3fc1f30ca4844d4a8b43f29578e586e'
});


const detectFaces = () => (req, res) =>{
	const { imageUrl } = req.body;

	app.models.predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
	.then(clarifaiResponse => {
		if(clarifaiResponse.status.code === 10000){
			res.status(200).json(clarifaiResponse);
		}
		else{
			res.status(500).json("Oops! something has gone bad with Clarifai API request!");
		}
	}).catch(error => {
		if(error.status === 400){
			res.status(406).json("Image url does not redirect to image");
		}
		else{
			res.status(400).json(`Oops! Something went wrong. You have been struck with ${error}`);	
		}
	})
}


module.exports = detectFaces;
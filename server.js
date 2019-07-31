const express = require('express');

const app = express();


app.get('/', (req, res) => {
	res.send("Responding to test request");
})

app.listen(3000, () => {console.log('Listening to request on port 3000!')});
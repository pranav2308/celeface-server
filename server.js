const express = require('express');
const app = express();

const registerNewUser = require('./controllers/Registration/registerNewUser');
const signInUser = require('./controllers/SignIn/signInUser');
const getUserFromID = require('./controllers/userID/getUserFromID');
const incrementImageEntries = require('./controllers/Entries/incrementImageentries');
const detectFaces = require('./controllers/Faces/detectFaces');

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

var knex = require('knex')

const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'pranav2308',
    database : 'face_recognition_db'
  }
});

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
	//res.send(dummyDatabase.users);
});

app.post('/register', registerNewUser(bcrypt, database));

app.post('/signin', signInUser(bcrypt, database));

app.get('/profile/:id', getUserFromID(database));

app.put('/image', incrementImageEntries(database));

app.post('/faces', detectFaces());

app.use(function(req, res){
	res.status(404).send("Page not found!");
});

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {console.log('Listening to request on port 3000!')});
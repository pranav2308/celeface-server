const express = require('express');
const app = express();

const registerNewUser = require('./controllers/Registration/registerNewUser.js');
const signInUser = require('./controllers/SignIn/signInUser.js');
const getUserFromID = require('./controllers/UserID/getUserFromID.js');
const submitImageEntries = require('./controllers/Entries/submitImageEntries.js');
const detectFaces = require('./controllers/Faces/detectFaces.js');
const detectCelebrity = require('./controllers/Celebrity/detectCelebrity.js');
const getLeaderBoard = require('./controllers/LeaderBoard/getLeaderBoard.js');
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
    database : 'CeleFaceDatabase'
  }
});

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.send("Successful deployment!");
});

app.post('/register', registerNewUser(bcrypt, database));

app.post('/signin', signInUser(bcrypt, database));

app.get('/profile/:id', getUserFromID(database));

app.put('/image', submitImageEntries(database));

app.post('/faces', detectFaces());

app.post('/celebrity', detectCelebrity());

app.get('/leaderboard', getLeaderBoard(database));

app.use(function(req, res){
	res.status(404).send("Page not found!");
});

app.listen( process.env.PORT || 3000, () => {console.log(`Listening to request on port ${process.env.PORT}!`)});
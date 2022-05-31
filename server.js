const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const app = express();
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
  },
});
app.use(express.json());
app.use(cors());
const register = require('./controllers/register');
const { handleProfile } = require('./controllers/profile');
const { handleImage } = require('./controllers/image');
const signin = require('./controllers/signin');
const imageUrl = require('./controllers/imageUrl');

app.post('/imageurl', (req, res) => {
  imageUrl.handleImageUrl(req, res);
});

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', (req, res) => {
  signin.handleSignIn(db, bcrypt)(req, res);
});

app.post('/register', (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get('/profile/:id', () => {
  handleProfile;
});

app.put('/image', () => {
  handleImage;
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running in port ${process.env.PORT}`);
});

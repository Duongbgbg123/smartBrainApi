const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex({
  client: 'pg',
  connection: {
    // host: '127.0.0.1',
    // port: 5432,
    // user: 'postgres',
    // password: 'test',
    // database: 'smart-brain',
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
});
app.use(express.json());
app.use(cors());
const register = require('./controllers/register');
const { handleProfile } = require('./controllers/profile');
const image = require('./controllers/image');
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

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running in port ${process.env.PORT}`);
});

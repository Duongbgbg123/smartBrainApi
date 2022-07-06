const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const app = express();
const morgan = require('morgan');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI,
  // {

  //   // connectionString: process.env.DATABASE_URL,
  //   // ssl: true,
  //   // ssl: {
  //   //   rejectUnauthorized: false,
  //   // },
  // },
});

// const whitelist = ['http://localhost:3001'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const signin = require('./controllers/signin');
const imageUrl = require('./controllers/imageUrl');
const auth = require('./controllers/authorization');
app.post('/imageurl', (req, res) => {
  imageUrl.handleImageUrl(req, res);
});

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', (req, res) =>
  signin.signinAuthentication(db, bcrypt)(req, res)
);

app.post('/register', (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfile(req, res, db);
});
app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3000, () => {
  console.log(`server is running in port 3000`);
});

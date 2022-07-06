const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days' });
};
const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const handleRegister = (req, res, db, bcrypt) => {
  const { email, password, name } = req.body;
  const hash = bcrypt.hashSync(password);
  if (!email || !password || !name) {
    return res.status(400).json('unable to register');
  }
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        // console.log(loginEmail);
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            console.log(user[0]);
            return user[0].email && user[0].id
              ? createSession(user[0])
              : Promise.reject(user[0]);
          })
          .then((session) => res.json(session))
          .catch((err) => res.status(400).json(err));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token, user };
    })
    .catch(console.log);
};

module.exports = {
  handleRegister: handleRegister,
};

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
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
};

module.exports = {
  handleRegister: handleRegister,
};

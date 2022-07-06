const handleProfile = (req, res, db) => {
  const { id } = req.params;

  db.select('*')

    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('not found');
      }
    });

  // if (found) {
  //   return res.json(compareId);
  // } else {
  //   return res.json('not found');
  // }
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, pet, age } = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name, pet, age })
    .then((resp) => {
      if (resp) {
        res.json('success');
      } else {
        res.status(400).json('Unable to update');
      }
    })
    .catch((err) => res.status(400).json('error updating user'));
};

module.exports = {
  handleProfile,
  handleProfileUpdate,
};

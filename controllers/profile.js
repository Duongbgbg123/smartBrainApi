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

module.exports = {
  handleProfile,
};

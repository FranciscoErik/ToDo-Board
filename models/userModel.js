const db = require('../database/db');

const findUserByEmail = (email, cb) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], cb);
};

const createUser = (name, email, hashedPassword, cb) => {
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
    cb(err, this ? this.lastID : null);
  });
};

const findUserById = (id, cb) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], cb);
};

module.exports = { findUserByEmail, createUser, findUserById }; 
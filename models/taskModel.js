const db = require('../database/db');

const getTasksByUser = (userId, cb) => {
  db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], cb);
};

const createTask = (title, description, status, userId, cb) => {
  db.run('INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)', [title, description, status, userId], function(err) {
    cb(err, this ? this.lastID : null);
  });
};

const updateTask = (id, title, description, status, userId, cb) => {
  db.run('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?', [title, description, status, id, userId], function(err) {
    cb(err, this ? this.changes : null);
  });
};

const deleteTask = (id, userId, cb) => {
  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId], function(err) {
    cb(err, this ? this.changes : null);
  });
};

const getTaskById = (id, userId, cb) => {
  db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], cb);
};

module.exports = { getTasksByUser, createTask, updateTask, deleteTask, getTaskById }; 
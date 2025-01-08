// filepath: src/models/userModel.js
const mysql = require('mysql2');
const config = require('../../config');

const connection = mysql.createConnection(config.db);

const User = {
  create: (user, callback) => {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.execute(query, [user.username, user.email, user.password], callback);
  },
  findByEmailOrUsername: (identifier, callback) => {
    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    connection.execute(query, [identifier, identifier], callback);
  },
  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.execute(query, [username], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.execute(query, [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },
  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.execute(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },
  // Add more methods as needed
};

module.exports = User;
const Pool = require('pg').Pool;
const { body, validationResult } = require('express-validator');

const pool = new Pool({
  user: 'learning',
  host: 'localhost',
  database: 'ecommerce_portfolio',
  password: 'learning',
  port: 5432,
});

// reqs to users
// get all users
const getUsers = (req, response) => {
  pool.query(
    'SELECT * FROM users ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// get user by id
const getUserById = (req, response) => {
  const id = parseInt(req.params.id);
  
  pool.query(
    `SELECT * FROM users WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};


const checkUsername = (usernameQuery, response, next) => {
  // const usernameQuery = req;
  pool.query(
    `SELECT * FROM users WHERE username = '${usernameQuery}'`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// get user by username
const getUserByUsername = (req, response) => {
  const username = req.params.username;
  pool.query(
    `SELECT * FROM users WHERE username = '${username}'`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// create user
const createUser = [
  // Validate and sanitize fields.
  body('name', 'Must provide a name, max length 50 characters.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body('email_address', 'Must provide an email address.')
    .trim()
    .isLength({ min: 1, max: 90 })
    .escape(),
  body('shipping_address', 'Must provide a shipping address.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body('username', 'Must provide a username.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  // process request after sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.name;
    const email_address = req.body.email_address;
    const shipping_address = req.body.shipping_address;
    const username = req.body.username;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      pool.query(
        `
      INSERT INTO users (name, email_address, shipping_address, username) 
      VALUES ('${name}', '${email_address}', '${shipping_address}', '${username}')`
      );
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`User ${name} created!`);
  },
];

// update user
const updateUser = [
  // Validate and sanitize fields.
  body('name', 'Name must be 1 - 50 characters.')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body(
    'email_address',
    'Must provide an email address, max 90 characters.'
  )
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 90 })
    .escape(),
  body(
    'shipping_address',
    'Must provide a shipping address, max 50 characters.'
  )
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body('username', 'Must provide a username, max 50 characters.')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  // process request after sanitization
  (req, res, next) => {
    const id = parseInt(req.params.id);
    const errors = validationResult(req);

    const name = req.body.name;
    const email_address = req.body.email_address || null;
    const shipping_address = req.body.shipping_address || null;
    const username = req.body.username || null;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      if (name) {
        pool.query(`
        UPDATE users 
            SET name = '${name}' 
            WHERE id = ${id}`);
      }
      if (email_address)
        pool.query(`
        UPDATE users 
        SET email_address = '${email_address}' 
        WHERE id = ${id}`);
      if (shipping_address) {
        pool.query(`
        UPDATE users 
        SET shipping_address = '${shipping_address}' 
        WHERE id = ${id}`);
      }
      if (username) {
        pool.query(
          `UPDATE users 
        SET username = '${username}' 
        WHERE id = ${id}`
        );
      }
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`User updated!`);
  },
];

// delete user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    `DELETE FROM users WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User deleted.`);
    }
  );
};

// export queries
module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  checkUsername,
  createUser,
  updateUser,
  deleteUser,
};

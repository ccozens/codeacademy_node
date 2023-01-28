const Pool = require('pg').Pool;
const { body, validationResult } = require('express-validator');

const pool = new Pool({
  user: 'learning',
  host: 'localhost',
  database: 'ecommerce_portfolio',
  password: 'learning',
  port: 5432,
});

// reqs to cart

const getCartById = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  pool.query(
    `SELECT * FROM cart WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.rowCount === 0) {
        const err = new Error(`Cart ID: ${id} not found.`);
        err.status = 404;
        return next(err);
      }
      res.status(200).json(results.rows);
    }
  );
};

const createCart = [
  // Validate and sanitize fields.
  body('product_id', 'Required.').isNumeric().trim().escape(),
  body('user_id', 'User ID required.').isNumeric().trim().escape(),
  body('quantity', 'Must provide a quantity.')
    .trim()
    .isNumeric()
    .escape(),
  body('date', 'Must provide the date.').trim().isISO8601().toDate(),
  // process request after sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
    const date = req.body.date;
    const user_id = req.body.user_id;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      pool.query(`
      INSERT INTO cart (product_id, quantity, date, user_id)
          VALUES (${product_id}, ${quantity}, '${date}', '${user_id}'`);
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Cart created!`);
  },
];

const addProductToCart = [
  // Validate and sanitize fields.
  body('product_id', 'Required.').isNumeric().trim().escape(),
  body('user_id', 'User ID required.').isNumeric().trim().escape(),
  body('quantity', 'Must provide a quantity.')
    .trim()
    .isNumeric()
    .escape(),
  body('date', 'Must provide the date.').trim().isISO8601().toDate(),
  // process request after sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
    const date = req.body.date;
    const user_id = req.body.user_id;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      pool.query(`
    INSERT INTO cart (product_id, quantity, date, user_id)
        VALUES (${product_id}, ${quantity}, '${date}', '${user_id}'`);
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Cart created!`);
  },
];

const updateProductInCart = [
  // Validate and sanitize fields.
  body('product_id', 'Product ID is required.')
    .isNumeric()
    .trim()
    .escape(),
  body('user_id', 'User ID is required.').isNumeric().trim().escape(),
  body('quantity', 'Must provide a quantity.')
    .trim()
    .isNumeric()
    .escape(),
  body('date', 'Must provide the date.').trim().isISO8601().toDate(),
  // process request after sanitization
  (req, res, next) => {
    const id = parseInt(req.params.id);
    const errors = validationResult(req);

    const product_id = req.body.product_id;
    const user_id = req.body.user_id;
    const quantity = req.body.quantity;

    if (errors.isEmpty()) {
      // if true (ie no errors), allow update of product_id or quantity only
      if (product_id) {
        pool.query(`
      UPDATE cart 
          SET product_id = '${product_id}' 
          WHERE id = ${id}`);
      }
      if (quantity)
        pool.query(`
      UPDATE cart 
      SET quantity = '${quantity}' 
      WHERE id = ${id}`);
      // user_id is a required field for order update but cannot be updated
      if (user_id !== id) {
        res.status400.send(
          'The User ID that creted the cart cannot be updated.'
        );
      }
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Cart updated!`);
  },
];

const deleteCart = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    `DELETE FROM cart WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send('Cart deleted');
    }
  );
};

const createOrderFromCart = [
  // Validate and sanitize fields.
  body('product_id', 'Required.').isNumeric().trim().escape(),
  body('user_id', 'User ID required.').isNumeric().trim().escape(),
  body('quantity', 'Must provide a quantity.')
    .trim()
    .isNumeric()
    .escape(),
  body('date', 'Must provide the date.').trim().isISO8601().toDate(),
  // process request after sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
    const date = req.body.date;
    const user_id = req.body.user_id;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new order
      pool.query(`
      INSERT INTO orders (product_id, quantity, date, user_id)
          VALUES (${product_id}, ${quantity}, '${date}', '${user_id}'`);
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Cart checked out!`);
  },
];

const checkoutCart = (req) => {
  createOrderFromCart(req);
  deleteCart(req);}

// export queries
module.exports = {
  getCartById,
  createCart,
  addProductToCart,
  updateProductInCart,
  deleteCart,
  checkoutCart
};

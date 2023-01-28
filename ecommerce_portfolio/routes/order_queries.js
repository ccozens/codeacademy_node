const Pool = require('pg').Pool;
const { body, validationResult } = require('express-validator');

const pool = new Pool({
  user: 'learning',
  host: 'localhost',
  database: 'ecommerce_portfolio',
  password: 'learning',
  port: 5432,
});

// reqs to orders

const getOrders = (req, response) => {
  pool.query(
    'SELECT * FROM orders ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getOrderById = (req, res, next) => {
  const id = req.params.id;
  pool.query(
    `SELECT * FROM orders WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.rowCount === 0) {
        const err = new Error(`Order ID: ${id} not found.`);
        err.status = 404;
        return next(err);
      }
      // add more specific error to list order IDs available?
      res.status(200).json(results.rows);
    }
  );
};

const createOrder = [
  // Validate and sanitize fields.
  body('product_id', 'Required.').isNumeric().trim().escape(),
  body('quantity', 'Must provide a quantity.')
    .trim()
    .isNumeric()
    .escape(),
  body('date', 'Must provide the date.').trim().isISO8601().toDate(),
  body('user_id', 'User ID required.').isNumeric().trim().escape(),
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
      INSERT INTO orders (product_id, quantity, date, user_id)
          VALUES (${product_id}, ${quantity}, '${date}', '${user_id}'`);
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Order created!`);
  },
];

const updateOrder = [
  // Validate and sanitize fields.
  body('product_id', 'Product ID is required.').isNumeric().trim().escape(),
  body('quantity', 'Must provide a quantity.')
  .trim()
  .isNumeric()
  .escape(),
  body('date', 'Must provide the date.').trim().isISO8601().toDate(),
  body('user_id', 'User ID is required.').isNumeric().trim().escape(),
  // process request after sanitization
  (req, res, next) => {
    const id = parseInt(req.params.id);
    const errors = validationResult(req);

    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
    const date = req.body.date;
    const user_id = req.body.user_id;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      if (product_id) {
        pool.query(`
        UPDATE orders 
            SET product_id = '${product_id}' 
            WHERE id = ${id}`);
      }
      if (quantity)
        pool.query(`
        UPDATE orders 
        SET quantity = '${quantity}' 
        WHERE id = ${id}`);
      if (date) {
        pool.query(`
        UPDATE orders 
        SET date = '${date}' 
        WHERE id = ${id}`);
      }
      // user_id is a required field for order update but cannot be updated
      if (user_id !== id) {
        res.status400.send('The User ID an order was placed under cannot be updated.')
      }
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Order updated!`);
  },
];

const deleteOrder = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    `DELETE FROM orders WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send('Order deleted');
    }
  );
};

// export queries
module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};

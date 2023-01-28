const Pool = require('pg').Pool;
const { body, validationResult } = require('express-validator');

const pool = new Pool({
  user: 'learning',
  host: 'localhost',
  database: 'ecommerce_portfolio',
  password: 'learning',
  port: 5432,
});

// reqs to products
const getProducts = (req, response) => {
  pool.query(
    'SELECT * FROM products ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getProductById = (req, res, next) => {
  const id = parseInt(req.params.id);
  pool.query(
    `SELECT * FROM products WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.rowCount === 0) {
        const err = new Error(`Product ID: ${id} not found.`);
        err.status = 404;
        return next(err);
      }
      res.status(200).json(results.rows);
    }
  );
};

const createProduct = [
  // Validate and sanitize fields.
  body('name', 'Must provide a name, max length 50 characters.')
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape(),
  body('description', 'Optional text descritpion.')
    .optional()
    .trim()
    .escape(),
  body('cost', 'Must provide the cost.').trim().isNumeric(),
  // process request after sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.name;
    const description = req.body.description || null;
    const cost = req.body.cost;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      pool.query(`
        INSERT INTO products (name, description, cost)
            VALUES (${name}, ${description}, '${cost}'`);
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Product ${name} created!`);
  },
];

const updateProduct = [
  // Validate and sanitize fields.
  body('name', 'Name must be 1 - 50 characters.')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape(),
  body('description', 'Optional text descritpion.')
    .optional()
    .trim()
    .escape(),
  body('cost', 'Cost must be numeric.').optional().trim().isNumeric(),
  // process request after sanitization
  (req, res, next) => {
    const id = parseInt(req.params.id);
    const errors = validationResult(req);

    const name = req.body.name || null;
    const description = req.body.description || null;
    const cost = req.body.cost || null;

    if (errors.isEmpty()) {
      // if true (ie no errors), send data to db to create new user
      if (product_id) {
        pool.query(`
        UPDATE products 
            SET name = '${name}' 
            WHERE id = ${id}`);
      }
      if (quantity)
        pool.query(`
        UPDATE products 
        SET description = '${description}' 
        WHERE id = ${id}`);
      if (shipping_address) {
        pool.query(`
        UPDATE products 
        SET cost = '${cost}' 
        WHERE id = ${id}`);
      }
    }
    if (!errors.isEmpty()) {
      // if false (ie, errors present), return 500 error
      res.status(500).send(errors);
    }
    res.status(201).send(`Order updated!`);
  },
];

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    `DELETE FROM products WHERE ID = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send('Product deleted');
    }
  );
};

// export queries
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

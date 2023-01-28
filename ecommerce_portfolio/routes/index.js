const express = require('express');
const app = express();
const router = express.Router();

// import queries functions
const userQueries = require('./user_queries')
const orderQueries = require('./order_queries');
const productQueries = require('./product_queries');
const cartQueries = require('./cart_queries');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const store = new session.MemoryStore();

// passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    resave: false,
    saveUninitalized: false,
    store,
  })
);

passport.use(
  new LocalStrategy(function (username, password, done) {
    userQueries.checkUsername(username, function (err, user) {
      // If there's an error in db lookup,
      // return err callback function
      if (err) return done(err); // If user not found, // return null and false in callback

      if (!user) return done(null, false); // If user found, but password not valid, // return err and false in callback

      if (user.password != password) return done(null, false); // If user found and password valid, // return the user object in callback

      return done(null, user);
    });
  })
);

// serialize users to store sessions
passport.serializeUser((user, done) => {
  // pass user object and call done on success
  done(null, user.id); // call done with err(null) and user(user.id)
});

// deserialize
passport.deserializeUser((id, done) => {
  // Look up user id in database.
  userQueries.getUserById(id, function (err, user) {
    if (err) return done(err);
    done(null, user);
  });
});

// logging in
router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/loginFail' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// implement dashboard - in this case, get user info on login
router.get('/profile', userQueries.getUserByUsername);

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});



/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'ecommerce profile' });
});

// logged in home
router.get('/profile', (req, res, next) =>  {
  res.render('profile', { title: 'A treat for logging in' });
});

router.get('/loginSuccess', (req, res, next) => {
  res.render('login', { title: 'All good here boss'});
});

// loginRedirect
router.get('/loginFail', (req, res, next) =>  {
  res.render('login', { title: 'Not working yet!' });
});


/**
 * @swagger
 * definitions:
 *   Orders:
 *     properties:
 *       id:
 *         type: integer
 *       product_id:
 *         type: integer
 *       quantity:
 *         type: integer
 *       date:
 *         type: date
 *       user_id:
 *         type: integer
 *   Products:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       cost:
 *         type: money
 *   Users:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       email_address:
 *         type: string
 *       shipping_address:
 *         type: string
 *       username:
 *         type: string
 *   Cart:
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       product_id:
 *         type: integer
 *       quantity:
 *         type: integer
 *       date:
 *         type: date
 
 */


// actual routes
/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all orders
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Returns JSON list of all orders
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single orders
 *         schema:
 *           $ref: '#/definitions/Orders'
 */
router.get('/orders', orderQueries.getOrders);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - orders
 *     description: Returns a single order by user ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: order ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/Orders'
 */
router.get('/orders/:id', orderQueries.getOrderById);
/**
 * @swagger
 * /orders/{username}:
 *   post:
 *     tags:
 *       - orders
 *     description: Creates a new order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order
 *         description: order object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Order successfully created
 *         schema:
 *           $ref: '#/definitions/Orders'
 */
router.post('/orders/', orderQueries.createOrder);
/**
 * @swagger
 * /orders/:id:
 *   put:
 *     tags:
 *       - orders
 *     description: Updates order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order
 *         description: order object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Order updated
 *         schema:
 *           $ref: '#/definitions/Orders'
 */
router.put('/orders/:id', orderQueries.updateOrder);
/**
 * @swagger
 * /orders/:id:
 *   delete:
 *     tags:
 *       - orders
 *     description: Deletes specified order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order ID
 *         description: order ID required
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Order successfully deleted
 *         schema:
 *           $ref: '#/definitions/Orders'
 */
router.delete('/orders/:id', orderQueries.deleteOrder);

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - products
 *     description: Returns all products
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Returns JSON list of all products
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: All products returned
 *         schema:
 *           $ref: '#/definitions/Products'
 */
router.get('/products', productQueries.getProducts);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - products
 *     description: Returns a single product by product ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: products's ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/Products'
 */
router.get('/products/:id', productQueries.getProductById);
/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - products
 *     description: Creates a new product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: product object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Product successfully created
 *         schema:
 *           $ref: '#/definitions/Products'
 */
router.post('/products/', productQueries.createProduct);
/**
 * @swagger
 * /products/:id:
 *   put:
 *     tags:
 *       - products
 *     description: Creates a new product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: product object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Product updated
 *         schema:
 *           $ref: '#/definitions/Products'
 */
router.put('/products/:id', productQueries.updateProduct);
/**
 * @swagger
 * /products/:id:
 *   delete:
 *     tags:
 *       - products
 *     description: Deletes specified product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product ID
 *         description: product ID required
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *         schema:
 *           $ref: '#/definitions/Products'
 */
router.delete('/products/:id', productQueries.deleteProduct);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Returns JSON list of all users
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: All users returned
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.get('/users', userQueries.getUsers);
/**
 * @swagger
 * /users/:username:
 *   get:
 *     tags:
 *       - users
 *     description: Returns a single user by username
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: userusername
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.get('/users/:username', userQueries.getUserByUsername);
/**
 * @swagger
 * /users/:username:
 *   get:
 *     tags:
 *       - users
 *     description: Returns a single user by user ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user's ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.get('/users/:id', userQueries.getUserById);
/**
 * @swagger
 * /users/:id:
 *   post:
 *     tags:
 *       - users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: User successfully created
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.post('/users/', userQueries.createUser);
/**
 * @swagger
 * /users/:
 *   put:
 *     tags:
 *       - users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: User updated
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.put('/users/:id', userQueries.updateUser);
/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     tags:
 *       - users
 *     description: Deletes specified user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: username required
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.delete('/users/:id', userQueries.deleteUser);

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     tags:
 *       - cart
 *     description: Returns a single cart by cart ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: cart ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single cart
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.get('/cart/:id', cartQueries.getCartById);
/**
 * @swagger
 * /cart/{username}:
 *   post:
 *     tags:
 *       - cart
 *     description: Creates a new cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cart
 *         description: cart object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Cart successfully created
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.post('/cart', cartQueries.createCart);
/**
 * @swagger
 * /cart/{username}:
 *   post:
 *     tags:
 *       - cart
 *     description: Creates a new item in cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: product object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Product successfully added
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.post('/cart/:id', cartQueries.addProductToCart);
/**
 * @swagger
 * /cart/:id:
 *   put:
 *     tags:
 *       - cart
 *     description: Updates cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Product
 *         description: product object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Product in cart updated
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.put('/cart/:id', cartQueries.updateProductInCart);
/**
 * @swagger
 * /cart/:id/checkout:
 *   put:
 *     tags:
 *       - cart
 *     description: Checks out cart by creating new order from cart and deleting cart.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Cart
 *         description: cart object
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Order successfully created
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.post('/cart/:id/checkout', cartQueries.checkoutCart);
/**
 * @swagger
 * /cart/:id:
 *   delete:
 *     tags:
 *       - cart
 *     description: Deletes specified cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cart ID
 *         description: cart ID required
 *         in: path
 *         required: true
 *         type: varchar
 *     responses:
 *       200:
 *         description: Cart successfully deleted
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.delete('/cart/:id', cartQueries.deleteCart);

module.exports = router;

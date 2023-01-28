/* const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const store = new session.MemoryStore();
const userQueries = require('./user_queries');
// const router = require('./index');

// passport authentication setup
router.use(passport.initialize());
router.use(passport.session());

router.use(
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
    userQueries.getUserByUsername(username, function (err, user) {
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
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('profile');
  }
);

// implement dashboard - in this case, get user info on login
router.get('/profile', userQueries.getUserByUsername);

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
 */
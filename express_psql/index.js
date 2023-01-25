// setup
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000;
// import queries functions
const db = require('./queries');


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/* // demo GET request on root return some json as test
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
}); */

// actual routes
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// set port to listen
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });
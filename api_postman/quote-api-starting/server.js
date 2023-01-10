const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

// set server to listen on PORT variable
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

// set GET /api/quotes/random
app.get('/api/quotes/:random', (req, res, next) => {
  res.send(getRandomElement(quotes));
});

// set GET quotes route (return all quotes)
// app.get('/api/quotes', (req, res, next) => {
//   res.send(quotes);
// });

// return all quotes for specific person, empty array if none, all quotes if no name
app.get('/api/quotes', (req, res, next) => {
  const queryPerson = req.query.person;
  if (queryPerson) {
  let result = [];
  for (item of quotes) {
    if (item.person === queryPerson) {
      result.push(item)
    }
  };
  result.length > 0 ? res.send(result) : res.send([])
}
else
  {res.send(quotes)};
});

// POST route to add new quote
app.post('/api/quotes', (req, res, next) => {
  const quoteObj = req.query;
  console.log(quoteObj);
  if (quoteObj.quote && quoteObj.person) {
  quotes.push(quoteObj);
  res.status(201).send((quotes[quotes.length-1]));
  }
  else {res.status(400).send('Quote not properly formatted')};

})

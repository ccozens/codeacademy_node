const express = require('express');
const ideaRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const data = require('./db');

// checking logic
ideaRouter.use('/:ideaId', (req, res, next) => {
  // check for idea
  const requestedidea = data.getFromDatabaseById(
    'ideas',
    req.params.ideaId
  );
  // if not found
  if (!requestedidea) {
    return res.status(404).send('idea not found');
  } // if found, attach to request as req.idea
  else {
    req.idea = requestedidea;
  }
  next();
});

const validate = (req, res, next) => {
  // check types
  if (
    typeof req.body.name === 'string' &&
    typeof req.body.description === 'string' &&
    typeof req.body.numWeeks === 'number' &&
    typeof req.body.weeklyRevenue === 'number'
  ) {
    // new object for checked inputs
    req.valid = req.body;
    next();
  } else {
    return res.status(404).send('Input not valid');
  }
};

// routes
ideaRouter.get('/', (req, res, next) => {
  res.send(data.getAllFromDatabase('ideas'));
});

ideaRouter.get('/:ideaId', (req, res, next) => {
  res.send(req.idea);
});

ideaRouter.post('/', validate, checkMillionDollarIdea, (req, res, next) => {
  data.addToDatabase('ideas', req.valid); // add new idea to ideas database
  const wholeDB = data.getAllFromDatabase('ideas');
  const newEntrant = wholeDB[wholeDB.length - 1];
  res.status(201).send(newEntrant);
});

ideaRouter.put('/:ideaId', validate, (req, res, next) => {
  data.updateInstanceInDatabase('ideas', req.valid);
  const updatedEntry = data.getFromDatabaseById(
    'ideas',
    req.params.ideaId
  );
  res.send(updatedEntry);
});

ideaRouter.delete('/:ideaId', (req, res, next) => {
  data.deleteFromDatabasebyId('ideas', req.idea.id);
  res.status(204).send();
});

// export
module.exports = ideaRouter;
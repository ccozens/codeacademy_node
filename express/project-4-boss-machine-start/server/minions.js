const express = require('express');
const minionRouter = express.Router();

const data = require('./db');
const utils = require('./utils');

// checking logic
minionRouter.use('/:minionId', (req, res, next) => {
  // check for minion
  const requestedMinion = data.getFromDatabaseById(
    'minions',
    req.params.minionId
  );
  // if not found
  if (!requestedMinion) {
    return res.status(404).send('Minion not found');
  } // if found, attach to request as req.minion
  else {
    req.minion = requestedMinion;
  }
  next();
});


// minion routes 
minionRouter.get('/', (req, res, next) => {
  res.send(utils.minionDb);
});

minionRouter.get('/:minionId', (req, res, next) => {
  res.send(req.minion);
});

minionRouter.post('/', utils.validateMinion, (req, res, next) => {
  data.addToDatabase('minions', req.validMinion); // add new minion to minions database;
  const newEntrant = utils.minionDb[utils.minionDb.length - 1];
  res.status(201).send(newEntrant);
});

minionRouter.put('/:minionId', utils.validateMinion, (req, res, next) => {
  data.updateInstanceInDatabase('minions', req.validMinion);
  const updatedEntry = data.getFromDatabaseById('minions',req.params.minionId);
  res.send(updatedEntry);
});

minionRouter.delete('/:minionId', (req, res, next) => {
  data.deleteFromDatabasebyId('minions', req.minion.id);
  res.status(204).send();
});

// work routes

minionRouter.get('/:minionId/work', (req, res, next) => {
  // get work
  const minionWork = [];
  utils.workDb.forEach(item => {(item.minionId === req.params.minionId) ? minionWork.push(item) : null });
  // return speific minion's work
   if (minionWork.length > 0)
   {res.status(200).send(minionWork)}
   else {
    return res.status(400).send('No work for minion')
   };
})

minionRouter.put('/:minionId/work/:workId', utils.validateWork, (req, res, next) => {
  // update entry
  data.updateInstanceInDatabase('work', req.validWork);
  // send updated entry
    const updatedEntry = utils.workDb.find(item => item.id === req.body.id);
    res.send(updatedEntry);
  })


minionRouter.post('/:minionId/work/', (req, res, next) => {
  const newWork = req.body;
  newWork.minionId = req.params.minionId;
  data.addToDatabase('work', newWork); // add new work
  res.status(201).send(newWork);
});

minionRouter.delete('/:minionId/work/:workId', (req, res, next) => {
  data.deleteFromDatabasebyId('work', req.params.workId);
  res.status(204).send();
});

// export
module.exports = minionRouter;
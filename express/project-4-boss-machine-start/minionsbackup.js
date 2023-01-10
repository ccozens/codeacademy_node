/*

const express = require('express');
const minionRouter = express.Router();

const data = require('./db');


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

const validate = (req, res, next) => {
  // check types
  if (
    typeof req.body.name === 'string' &&
    typeof req.body.title === 'string' &&
    typeof req.body.salary === 'number' &&
    typeof req.body.weaknesses === 'string'
  ) {
    // new object for checked inputs
    req.valid = req.body;
    next();
  } else {
    return res.status(404).send('Input not valid');
  }
};

// routes 
minionRouter.get('/', (req, res, next) => {
  res.send(data.getAllFromDatabase('minions'));
});

minionRouter.get('/:minionId', (req, res, next) => {
  res.send(req.minion);
});

minionRouter.post('/', validate, (req, res, next) => {
  data.addToDatabase('minions', req.valid); // add new minion to minions database
  const wholeDB = data.getAllFromDatabase('minions');
  const newEntrant = wholeDB[wholeDB.length - 1];
  res.status(201).send(newEntrant);
});

minionRouter.put('/:minionId', validate, (req, res, next) => {
  data.updateInstanceInDatabase('minions', req.valid);
  const updatedEntry = data.getFromDatabaseById(
    'minions',
    req.params.minionId
  );
  res.send(updatedEntry);
});

minionRouter.delete('/:minionId', (req, res, next) => {
  data.deleteFromDatabasebyId('minions', req.minion.id);
  res.status(204).send();
});

//

minionRouter.get('/:minionId/work', (req, res, next) => {
  // get work
  const workDb = data.getAllFromDatabase('work');
  const minionWork = [];
  workDb.forEach(item => {(item.minionId === req.params.minionId) ? minionWork.push(item) : null });
  // return speific minion's work
   if (minionWork.length > 0)
   {res.status(200).send(minionWork)}
   else {
    return res.status(400).send('No work for minion')
   };
})

minionRouter.put('/:minionId/work/:workId', (req, res, next) => {
  if (
    typeof req.body.id === 'string' &&
    typeof req.body.title === 'string' &&
    typeof req.body.description === 'string' &&
    typeof req.body.hours === 'number' &&
    typeof req.body.minionId === 'string'
  ) {
    // new object for checked inputs
    req.validWork = req.body;
  } else {
    return res.status(400).send('Input not valid');
  }
  // update entry
  const workUpdate = req.validWork;
  data.updateInstanceInDatabase('work', workUpdate);
  // send updated entry
  const workDb = data.getAllFromDatabase('work');
    
    const updatedEntry = workDb.find(item => item.id === req.body.id);
    res.send(updatedEntry);
  })


minionRouter.post('/:minionId/work/', (req, res, next) => {
  const newWork = req.body;
  newWork.minionId = req.params.minionId;
  data.addToDatabase('work', newWork); // add new work
  res.status(201).send(newWork);
});

minionRouter.delete('/:minionId/work/:workId', (req, res, next) => {
  console.log(`req.params.workId ${req.params.workId}`)
  data.deleteFromDatabasebyId('work', req.params.workId);
  res.status(204).send();
});

// export
module.exports = minionRouter;


*/
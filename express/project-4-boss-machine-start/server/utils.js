const data = require('./db');

const validateMinion = (req, res, next) => {
    // check types
    if (
      typeof req.body.name === 'string' &&
      typeof req.body.title === 'string' &&
      typeof req.body.salary === 'number' &&
      typeof req.body.weaknesses === 'string'
    ) {
      // new object for checked inputs
      req.validMinion = req.body;
      next();
    } else {
      return res.status(404).send('Input not valid');
    }
  };
  
  const validateWork = (req, res, next) => {
    // check types
    if (
      typeof req.body.id === 'string' &&
      typeof req.body.title === 'string' &&
      typeof req.body.description === 'string' &&
      typeof req.body.hours === 'number' &&
      typeof req.body.minionId === 'string'
    ) {
      // new object for checked inputs
      req.validWork = req.body;
      next();
    } else {
      return res.status(400).send('Input not valid');
    }
  };

  const minionDb = data.getAllFromDatabase('minions');
  const workDb = data.getAllFromDatabase('work');

  module.exports = {
    validateMinion,
    validateWork,
    minionDb,
    workDb
  }
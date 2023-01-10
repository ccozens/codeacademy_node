const express = require('express');
const meetingRouter = express.Router();

const data = require('./db');
const minionRouter = require('./minions');

// checking logic
meetingRouter.use('/:meetingId', (req, res, next) => {
  // check for meeting
  const requestedmeeting = data.getFromDatabaseById(
    'meetings',
    req.params.meetingId
  );
  // if not found
  if (!requestedmeeting) {
    res.status(404).send('meeting not found');
  } // if found, attach to request as req.meeting
  else {
    req.meeting = requestedmeeting;
  }
  next();
});

const validate = (req, res, next) => {
  // check types
  if (
    typeof req.body.time === 'string' &&
    typeof req.body.date === 'string' &&
    typeof req.body.day === 'string' &&
    typeof req.body.note === 'string'
  ) {
    // new object for checked inputs
    req.valid = req.body;
    next();
  } else {
    console.log(typeof req.body.time === 'string' &&
    typeof req.body.date === 'string' &&
    typeof req.body.day === 'string' &&
    typeof req.body.note === 'string');
    return res.status(404).send('Input not valid');
  }
};

// routes
meetingRouter.get('/', (req, res, next) => {
  res.send(data.getAllFromDatabase('meetings'));
});

meetingRouter.get('/:meetingId', (req, res, next) => {
  res.send(req.meeting);
});

meetingRouter.post('/', (req, res, next) => {
    const newMeeting = data.createMeeting();
  data.addToDatabase('meetings', newMeeting); // add new meeting to meetings database
  const wholeDB = data.getAllFromDatabase('meetings');
  const newEntrant = wholeDB[wholeDB.length - 1];
  res.status(201).send(newMeeting);
});

meetingRouter.put('/:meetingId', validate, (req, res, next) => {
  data.updateInstanceInDatabase('meetings', req.valid);
  const updatedEntry = data.getFromDatabaseById(
    'meetings',
    req.params.meetingId
  );
  res.send(updatedEntry);
});

meetingRouter.delete('/', (req, res, next) => {
  data.deleteAllFromDatabase('meetings');
  res.status(204).send();
});



// export
module.exports = meetingRouter;

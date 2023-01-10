const express = require('express');
const apiRouter = express.Router();
const minionRouter = require('./minions');
const ideaRouter = require('./ideas')
const meetingRouter = require('./meetings')

apiRouter.use('/minions', minionRouter);
apiRouter.use('/ideas', ideaRouter);
apiRouter.use('/meetings', meetingRouter);

module.exports = apiRouter;


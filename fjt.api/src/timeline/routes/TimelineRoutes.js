const router = require('express').Router(); // eslint-disable-line
const Timeline = require('../controllers/TimelineController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .get(Timeline.retrieveTimelineDetails)
        .post(Timeline.createTimeline);

    app.use(
        '/api/v1/timeline',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
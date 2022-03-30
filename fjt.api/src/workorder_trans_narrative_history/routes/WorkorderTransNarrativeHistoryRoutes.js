const router = require('express').Router(); // eslint-disable-line
const WorkorderTransNarrativeHistory = require('../controllers/WorkorderTransNarrativeHistoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(WorkorderTransNarrativeHistory.createNarrativeHistory);

    router.route('/retriveNarrativeHistoryList')
        .post(WorkorderTransNarrativeHistory.retriveNarrativeHistoryList);

    router.route('/:id')
        .get(WorkorderTransNarrativeHistory.retriveNarrativeHistory)
        .put(WorkorderTransNarrativeHistory.updateNarrativeHistory);

    router.route('/deleteNarrativeHistory')
        .post(WorkorderTransNarrativeHistory.deleteNarrativeHistory);

    app.use(
        '/api/v1/workordernarrativehistory',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
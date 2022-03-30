const router = require('express').Router(); // eslint-disable-line
const TaskConfirmation = require('../controllers/TaskConfirmationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getTaskConfirmationlist')
        .get(TaskConfirmation.getTaskConfirmationlist);

    app.use(
        '/api/v1/taskconfirmation',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    /* app.get('/api/v1/getTaskConfirmationlist',
        validateToken,
 
        jwtErrorHandler,
        populateUser,
        TaskConfirmation.getTaskConfirmationlist
    ); */
};

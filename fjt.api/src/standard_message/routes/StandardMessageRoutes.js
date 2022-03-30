const router = require('express').Router(); // eslint-disable-line
const StandardMessage = require('../controllers/StandardMessageController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retriveStandardMessageList')
        .post(StandardMessage.retriveStandardMessageList);

    router.route('/')
        .get(StandardMessage.retriveStandardMessage)
        .post(StandardMessage.createStandardMessage);

    router.route('/:id')
        .get(StandardMessage.retriveStandardMessage)
        .put(StandardMessage.updateStandardMessage);

    router.route('/deleteStandardMessage')
        .post(StandardMessage.deleteStandardMessage);

    router.route('/checkUniqueMessage')
        .post(StandardMessage.checkUniqueMessage);

    app.use(
        '/api/v1/standardmessage',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

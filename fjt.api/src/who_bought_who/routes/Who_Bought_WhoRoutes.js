const router = require('express').Router(); // eslint-disable-line
const WhoBoughtWho = require('../controllers/Who_Bought_WhoController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // added at top so route('/') do not get called first
    router.route('/retriveWhoBoughtWho')
        .get(WhoBoughtWho.retriveWhoBoughtWho);

    router.route('/retriveWhoBoughtWhoList')
        .post(WhoBoughtWho.retriveWhoBoughtWhoList);

    router.route('/getMfgBuyToList')
        .get(WhoBoughtWho.getMfgBuyToList);

    router.route('/saveWhoBoughtWho')
        .post(WhoBoughtWho.saveWhoBoughtWho);

    router.route('/getAcquisitionDetails')
        .post(WhoBoughtWho.getAcquisitionDetails);

    app.use(
        '/api/v1/whoBoughtWho',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

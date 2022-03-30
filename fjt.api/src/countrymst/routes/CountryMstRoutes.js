const router = require('express').Router(); // eslint-disable-line
const countrymst = require('../controllers/CountryMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    router.route('/getAllCountry')
        .get(countrymst.getAllCountry);

    router.route('/')
        .get(countrymst.retriveCountry)
        .post(countrymst.createCountry);

    router.route('/retriveCountryList')
        .post(countrymst.retriveCountryList);

    router.route('/:countryId')
        .get(countrymst.retriveCountry)
        .put(countrymst.updateCountry);

    router.route('/deleteCountry')
        .post(countrymst.deleteCountry);

    router.route('/checkNameUnique')
        .post(countrymst.checkNameUnique);

    router.route('/updateCountryDisplayOrder')
        .post(countrymst.updateCountryDisplayOrder);

    router.route('/checkUniqueCountryAlias')
        .post(countrymst.checkUniqueCountryAlias);

    app.use(
        '/api/v1/countrymst',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

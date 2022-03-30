 const router = require('express').Router(); // eslint-disable-line
const standardClass = require('../controllers/StandardClassController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(standardClass.createStandardClass);

    router.route('/:id')
        .get(standardClass.retriveStandardClass)
        .put(standardClass.updateStandardClass);

    router.route('/deleteStandardClass')
        .post(standardClass.deleteStandardClass);

    router.route('/checkDuplicateCategory')
        .post(standardClass.checkDuplicateCategory);

    router.route('/standardtreeviewData/:id')
        .get(standardClass.standardtreeviewData);

    router.route('/getStandardClassListByStandardId/:id')
        .get(standardClass.getStandardClassListByStandardId);

    router.route('/retriveStandardClassList')
        .post(standardClass.retriveStandardClassList);


    app.use(
        '/api/v1/standardClass',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};


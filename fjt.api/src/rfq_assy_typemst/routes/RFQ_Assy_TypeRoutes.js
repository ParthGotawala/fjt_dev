const router = require('express').Router(); // eslint-disable-line
const AssyTypesController = require('../controllers/RFQ_Assy_TypeMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveAssyType')
        .post(AssyTypesController.createassyType);

    router.route('/findSameAssyType')
        .post(AssyTypesController.findSameAssyType);

    router.route('/getAssyTypeList')
        .get(AssyTypesController.getAssyTypeList);

    router.route('/deleteAssyType')
        .post(AssyTypesController.deleteAssyType);

    router.route('/retriveAssyTypeList')
        .post(AssyTypesController.retriveAssyTypeList);

    router.route('/retriveAssyType/:id')
        .get(AssyTypesController.retriveAssyType);

    router.route('/updateAssyTypeDisplayOrder')
        .post(AssyTypesController.updateAssyTypeDisplayOrder);

    app.use('/api/v1/assyType',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};

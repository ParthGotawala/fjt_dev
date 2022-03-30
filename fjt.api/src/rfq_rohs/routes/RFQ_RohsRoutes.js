const router = require('express').Router(); // eslint-disable-line
const RFQRohsController = require('../controllers/Rfq_RohsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveRohs')
        .post(RFQRohsController.createRohs);

    router.route('/updateRohs/:id')
        .put(RFQRohsController.updateRohs);

    router.route('/getRohsList')
        .get(RFQRohsController.getRohsList);

    router.route('/getRohsCategoryList')
        .get(RFQRohsController.getRohsCategoryList);

    router.route('/deleteRohs')
        .post(RFQRohsController.deleteRohs);

    router.route('/retriveRohs')
        .get(RFQRohsController.retriveRohs);

    router.route('/retriveRohsList')
        .post(RFQRohsController.retriveRohsList);

    // router.route('/retriveRohs/:id')
    // .get(RFQRohsController.retriveRohs);

    router.route('/retrieveParentRoHS')
        .get(RFQRohsController.retrieveParentRoHS);

    router.route('/checkDuplicateRoHS')
        .post(RFQRohsController.checkDuplicateRoHS);

    router.route('/checkUniqueRoHSAlias')
        .post(RFQRohsController.checkUniqueRoHSAlias);

    router.route('/getRoHSList')
        .get(RFQRohsController.getRoHSList);

    router.route('/updateRoHSDisplayOrder')
        .post(RFQRohsController.updateRoHSDisplayOrder);

    app.use('/api/v1/rfqRohs',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};

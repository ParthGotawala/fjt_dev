const router = require('express').Router();

const UtilityController = require('../controllers/UtilityController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const ComponentController = require('../../component/controllers/ComponentController');
const MfgController = require('../../mfgcode/controllers/MfgCodeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getCustomerList')
        .get(MfgController.getManufacturer);

    router.route('/updatePendingDataInElastic')
        .get(UtilityController.updatePendingDataInElastic);
    router.route('/generateUMIDCofCDocument')
        .get(UtilityController.generateUMIDCofCDocument);
    router.route('/updateComponentDocumentPath')
        .get(UtilityController.updateComponentDocumentPath);
    router.route('/updateOldWONumberFolderWithNewFolderNumber')
        .get(UtilityController.updateOldWONumberFolderWithNewFolderNumber);

    router.route('/updateUsersWithUserID')
        .post(UtilityController.updateUsersWithUserID);

    router.route('/retrieveComponentList')
        .post(UtilityController.retrieveComponentList);
    router.route('/retriveMfgCodeList')
        .post(MfgController.retriveMfgCodeList);
    router.route('/getComponentMFGAliasPIDProdPNSearch')
        .post(ComponentController.getComponentMFGAliasPIDProdPNSearch);
    router.route('/generateJSONofEntity')
        .get(EnterpriseSearchController.generateJSONofEntity);

    // router.route('/readJsonAndConvertToArray')
    //         .get(UtilityController.readJsonAndConvertToArray);

    //router.route('/testLockTransaction')
    //    .get(UtilityController.testLockTransaction);
    app.use(
        '/api/v1/utility',
        //  verifyJwt({
        //      secret: config.jwt.secret
        //  }),
        //  jwtErrorHandler,
        //  populateUser,
        router
    );
};
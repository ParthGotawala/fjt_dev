const router = require('express').Router(); // eslint-disable-line
const FeatureUserMapping = require('../controllers/FeatureUserMappingController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/:id')
        .get(FeatureUserMapping.getUserFeatureRight)
        .put(FeatureUserMapping.updateUserFeatureRight);

    router.route('/verifyUserForRestrictWithPermissionFeature')
        .post(FeatureUserMapping.verifyUserForRestrictWithPermissionFeature);

    router.route('/retrieveEmployeeListForFeatureRights')
        .post(FeatureUserMapping.retrieveEmployeeListForFeatureRights);    

    router.route('/updateMulitpleUserFeatureRight')
        .post(FeatureUserMapping.updateMulitpleUserFeatureRight);
    
    app.use(
        '/api/v1/featureUserMapping',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
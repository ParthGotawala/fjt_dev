const router = require('express').Router();

const FeatureRoleMapping = require('../controllers/FeatureRoleMappingController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/:id')
        .get(FeatureRoleMapping.getRoleFeatureRight)
        .put(FeatureRoleMapping.updateRoleFeatureRight);

    app.use(
        '/api/v1/featureRoleMapping',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
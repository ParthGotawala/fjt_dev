const router = require('express').Router(); // eslint-disable-line
const ChartRawdataCategoryAccessRoleController = require('../controllers/Chart_Rawdata_Category_Access_RoleController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getAccessRoleByChartRawDataCategory')
        .post(ChartRawdataCategoryAccessRoleController.getAccessRoleByChartRawDataCategory);

    app.use(
        '/api/v1/chartrawdatacategoryaccessrole',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

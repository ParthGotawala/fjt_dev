const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationDataelementRole = require('../controllers/Workorder_Operation_Dataelement_RoleController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/saveWorkorderOperationDataelement_Role')
    .post(WorkorderOperationDataelementRole.saveWorkorderOperationDataelement_Role);

  router.route('/getRolesListBywoOpDataelementWise/:woOpDataElementID')
    .get(WorkorderOperationDataelementRole.getRolesListBywoOpDataelementWise);

  router.route('/getwoOpDataelementListRoleWise/:roleID')
    .get(WorkorderOperationDataelementRole.getwoOpDataelementListRoleWise);

  router.route('/deleteWoOpdataElmentRoles')
    .post(WorkorderOperationDataelementRole.deleteWoOpdataElmentRoles);

  router.route('/getAllwoOpDataElementRoleData')
    .get(WorkorderOperationDataelementRole.getAllwoOpDataElementRoleData);

  app.use(
    '/api/v1/workorder_operation_dataelement_role',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
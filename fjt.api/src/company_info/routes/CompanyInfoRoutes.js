const router = require('express').Router(); // eslint-disable-line
const CompanyInfoController = require('../controllers/CompanyInfoController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')


module.exports = (app) => {
  router.route('/getCompanyInfo')
    .get(CompanyInfoController.getCompanyInfo);

  router.route('/updateComapnyInfo/:id')
    .put(CompanyInfoController.updateCompany);

  router.route('/checkEmailUnique')
    .post(CompanyInfoController.checkEmailUnique);

  router.route('/checkCompanyNameUnique')
    .post(CompanyInfoController.checkCompanyNameUnique);

  router.route('/getCompanyAddress/:id')
    .get(CompanyInfoController.getCompanyAddress);

    router.route('/getCompanyContactPersons/:personId')
        .get(CompanyInfoController.getCompanyContactPersons);
    router.route('/updateCompanyPreferences')
        .post(CompanyInfoController.updateCompanyPreferences);

  app.use(
    '/api/v1/company_info',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};
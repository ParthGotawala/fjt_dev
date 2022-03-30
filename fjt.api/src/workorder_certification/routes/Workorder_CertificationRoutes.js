const router = require('express').Router(); // eslint-disable-line
const WorkorderCertification = require('../controllers/Workorder_CertificationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/createWorkorder_CertificateList')
    .post(WorkorderCertification.createWorkorder_CertificateList);

  router.route('/getWorkorderAllStandardList')
    .post(WorkorderCertification.getWorkorderAllStandardList);

  app.use(
    '/api/v1/workorder_certification',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};

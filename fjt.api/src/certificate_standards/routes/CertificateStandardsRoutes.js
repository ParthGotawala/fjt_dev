const router = require('express').Router(); // eslint-disable-line
const certificatestandards = require('../controllers/CertificateStandardsController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {

    router.route('/retriveCertificateStandardsList')
        .post(certificatestandards.retriveCertificateStandardsList);

    router.route('/createCertificateStandard')
        .post(certificatestandards.createCertificateStandard);

    router.route('/retriveCertificateStandards/:id/:isPermanentDelete?')
        .get(certificatestandards.retriveCertificateStandards);

    router.route('/updateCertificateStandard/:id/:isPermanentDelete?')
        .put(certificatestandards.updateCertificateStandard);


    router.route('/deleteCertificateStandard')
        .post(certificatestandards.deleteCertificateStandard);

    router.route('/treeviewData/:id')
        .get(certificatestandards.treeviewData);

    router.route('/getCertificateStandardList')
        .post(certificatestandards.getCertificateStandardList);

    router.route('/getCertificateStandard')
        .post(certificatestandards.getCertificateStandard);

    router.route('/checkDuplicateStandard')
        .post(certificatestandards.checkDuplicateStandard);

    router.route('/checkDuplicateStandardCode')
        .post(certificatestandards.checkDuplicateStandardCode);

    router.route('/getCertificateStandardRole')
        .get(certificatestandards.getCertificateStandardRole);

    router.route('/createCertificateStandardImage')
        .post(certificatestandards.createCertificateStandardImage);

    router.route('/deleteCertificateStandardImage')
        .post(certificatestandards.deleteCertificateStandardImage);

    app.use(
        '/api/v1/certificatestandards',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

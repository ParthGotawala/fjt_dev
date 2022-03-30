const router = require('express').Router();

const aggrementTemplate = require('../controllers/AgreementTemplateController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    /* Comments By - BT (23-02-2021) - Move below apis on identityserver. */
    // router.route('/getAgreementTypes')
    //     .get(aggrementTemplate.getAgreementTypes);
    // router.route('/retriveAgreementByTypeId/:agreementTypeID')
    //     .get(aggrementTemplate.retriveAgreementByTypeId);
    // router.route('/publishAgreementTemplate')
    //     .post(aggrementTemplate.publishAgreementTemplate);
    // router.route('/:agreementID')
    //     .put(aggrementTemplate.updateAgreement);
    // router.route('/')
    //     .post(aggrementTemplate.createAgreement);
    // router.route('/retriveAgreementByTypeId/:agreementTypeID')
    //     .get(aggrementTemplate.retriveAgreementByTypeId);
    // router.route('/getAgreementTypes')
    //     .get(aggrementTemplate.getAgreementTypes);
    //router.route('/retriveAgreement/:agreementTypeID')
    //    .get(aggrementTemplate.retrivePublishedAgreementById);
    // router.route('/retriveAgreementList')
    //     .post(aggrementTemplate.retriveAgreementList);
    // router.route('/retriveArchieveVersionDetails')
    //     .post(aggrementTemplate.retriveArchieveVersionDetails);
    // router.route('/getAgreementDetails/:agreementTypeID')
    //     .get(aggrementTemplate.getAgreementDetails);
    // router.route('/getAgreedUserList')
    //     .post(aggrementTemplate.getAgreedUserList);
    // router.route('/retriveUserSignUpAgreementList')
    //     .post(aggrementTemplate.retriveUserSignUpAgreementList);
    router.route('/getAgreementTemplateDetails')
        .post(aggrementTemplate.getAgreementTemplateDetails);
    // router.route('/saveAgreementType')
    //     .post(aggrementTemplate.saveAgreementType);
    // router.route('/checkDuplicateAgreementType')
    //     .post(aggrementTemplate.checkDuplicateAgreementType);

    app.use(
        '/api/v1/agreement',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};


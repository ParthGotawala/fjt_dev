const router = require('express').Router(); // eslint-disable-line
const masterTemplate = require('../controllers/MasterTemplateController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict

    router.route('/getMasterTemplateList')
        .get(masterTemplate.getMasterTemplateList);

    router.route('/getMasterTemplateOperationList/:id')
        .get(masterTemplate.getMasterTemplateOperationList);

    router.route('/deleteOperation_MasterTemplateList')
        .delete(masterTemplate.deleteOperation_MasterTemplateList);

    router.route('/')
        .post(masterTemplate.createMasterTemplate);

    router.route('/retriveMasterTemplateList')
        .post(masterTemplate.retriveMasterTemplateList);

    router.route('/:id')
        .get(masterTemplate.retriveMasterTemplate)
        .put(masterTemplate.updateMasterTemplate);

    router.route('/deleteMasterTemplate')
        .post(masterTemplate.deleteMasterTemplate);

    router.route('/retrieveOperationMasterTemplate/:id')
        .get(masterTemplate.retrieveOperationMasterTemplate);

    router.route('/createOperation_MasterTemplateList')
        .post(masterTemplate.createOperation_MasterTemplateList);

    router.route('/copyMasterTemplate')
        .post(masterTemplate.copyMasterTemplate);

    router.route('/checkDublicateMasterTemplate')
        .post(masterTemplate.checkDublicateMasterTemplate);

    router.route('/saveMasterTemplateStatus')
        .post(masterTemplate.saveMasterTemplateStatus);

    router.route('/getMasterTemplateListByTemplateStatus')
        .post(masterTemplate.getMasterTemplateListByTemplateStatus);

    app.use(
        '/api/v1/mastertemplate',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

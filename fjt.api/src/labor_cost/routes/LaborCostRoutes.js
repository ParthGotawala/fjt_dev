const router = require('express').Router(); // eslint-disable-line
const LaborCostController = require('../controllers/LaborCostController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/checkUniqueTemplateName')
        .post(LaborCostController.checkUniqueTemplateName);
    router.route('/getLabourCostTemplateList')
        .post(LaborCostController.getLabourCostTemplateList);
    router.route('/retriveLaborCostTemplate/:id')
        .get(LaborCostController.retriveLaborCostTemplate);
    router.route('/saveLaborCostDetails/')
        .post(LaborCostController.saveLaborCostDetails);
    router.route('/downloadLaborCostTemplate/:module')
        .get(LaborCostController.downloadLaborCostTemplate);
    router.route('/ExportLaborCostDetailTemplate/:module/:id')
        .get(LaborCostController.ExportLaborCostDetailTemplate);
    router.route('/deleteLaborCostTemplate')
        .post(LaborCostController.deleteLaborCostTemplate);
    router.route('/getTemplateDetails/:pPriceType')
        .get(LaborCostController.getTemplateDetails);
    router.route('/getLaborTemplateWisePriceDetail/:laborTemplateID')
        .get(LaborCostController.getLaborTemplateWisePriceDetail);
    router.route('/getLaborCostTemplateMstNumber')
        .post(LaborCostController.getLaborCostTemplateMstNumber);

    app.use('/api/v1/laborCostTemplate',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
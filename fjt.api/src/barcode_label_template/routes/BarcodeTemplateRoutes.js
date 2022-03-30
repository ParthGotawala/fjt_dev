const router = require('express').Router();

const BarcodeTemplateController = require('../controllers/BarcodeTemplateController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(BarcodeTemplateController.saveBarcodeLabelTemplate);

    router.route('/retrieveBarcodeLabelTemplateList')
        .post(BarcodeTemplateController.retrieveBarcodeLabelTemplateList);

    router.route('/:id')
        .get(BarcodeTemplateController.getBarcodeLabelTemplateByID)
        .put(BarcodeTemplateController.saveBarcodeLabelTemplate);

    router.route('/deleteBarcodeLabelTemplateDelimiter')
        .post(BarcodeTemplateController.deleteBarcodeLabelTemplateDelimiter);

    app.get('/api/v1/barcode_label_template/getDataElementFields',
        validateToken,

        jwtErrorHandler,
        populateUser,
        BarcodeTemplateController.getDataElementFields);

    router.route('/deleteBarcodeLabelTemplate')
        .post(BarcodeTemplateController.deleteBarcodeLabelTemplate);

    app.use(
        '/api/v1/barcode_label_template',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
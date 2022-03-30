const router = require('express').Router();

const RfqBomHeaderComponentConfigurationController = require('../controllers/Rfq_Bom_Header_Component_ConfigurationController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getRfqAdditionalColumnList/:id')
        .get(RfqBomHeaderComponentConfigurationController.getRfqAdditionalColumnList);

    router.route('/saveRfqAdditionalColumnList')
        .post(RfqBomHeaderComponentConfigurationController.saveRfqAdditionalColumnList);

    app.use(
        '/api/v1/rfqbomheadercomponentconfiguration',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
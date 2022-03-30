const router = require('express').Router();

const RfqAssyBOM = require('../controllers/Rfq_Assy_BOMController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getAssyBOMList')
        .get(RfqAssyBOM.getAssyBOMList);

    app.use('/api/v1/rfqAssyBOM',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};

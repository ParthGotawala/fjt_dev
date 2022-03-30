const router = require('express').Router();

const UnitDetailFormulaController = require('../controllers/UnitDetailFormulaController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveUnitDetailFormula')
        .post(UnitDetailFormulaController.createUnitDetailFormula);

    router.route('/deleteUnitDetailMeasurement')
        .post(UnitDetailFormulaController.removeUnitDetailFormula);

    router.route('/retriveUnitDetailFormula')
        .get(UnitDetailFormulaController.retriveUnitDetailFormula);

    router.route('/retriveUnitDetailFormula/:id')
        .get(UnitDetailFormulaController.retriveUnitDetailFormula);


    app.use('/api/v1/unit_detail_formula',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};

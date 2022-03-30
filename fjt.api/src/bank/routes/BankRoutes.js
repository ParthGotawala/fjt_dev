const router = require('express').Router();

const BankController = require('../controllers/BankController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveBankList')
        .post(BankController.retrieveBankList);

    router.route('/checkBankUnique')
        .post(BankController.checkBankUnique);

    router.route('/saveBank')
        .post(BankController.saveBank);

    router.route('/deleteBank')
        .post(BankController.deleteBank);

    router.route('/getBankList')
        .post(BankController.getBankList);

    router.route('/getBankByID/:id')
        .get(BankController.getBankByID);

    app.use(
        '/api/v1/bank',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
const router = require('express').Router();
const acctAcctMstController = require('../controllers/AcctAcctMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
        router.route('/getChartOfAccountsList')
            .post(acctAcctMstController.getChartOfAccountsList);
        router.route('/getChartOfAccountById/:id')
            .get(acctAcctMstController.getChartOfAccountById);
        router.route('/getChartOfAccountBySearch')
            .post(acctAcctMstController.getChartOfAccountBySearch);
        router.route('/saveChartOfAccount')
            .post(acctAcctMstController.saveChartOfAccount);
        router.route('/deleteChartOfAccount')
            .post(acctAcctMstController.deleteChartOfAccount);
        router.route('/checkDuplicateChartOfAccountFormField')
            .post(acctAcctMstController.checkDuplicateChartOfAccountFormField);

    app.use(
        '/api/v1/acctacctmst',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
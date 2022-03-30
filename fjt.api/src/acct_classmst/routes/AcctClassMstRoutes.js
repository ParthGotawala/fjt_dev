const router = require('express').Router();
const AcctClassMstController = require('../controllers/AcctClassMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
        router.route('/getAccountTypeList')
            .post(AcctClassMstController.getAccountTypeList);
        router.route('/getAllAccountTypeList')
            .get(AcctClassMstController.getAllAccountTypeList);
        router.route('/getAccountTypeBySearch')
            .post(AcctClassMstController.getAccountTypeBySearch);
        router.route('/getAccountTypeById/:id')
            .get(AcctClassMstController.getAccountTypeById);
        router.route('/saveAccountType')
            .post(AcctClassMstController.saveAccountType);
        router.route('/deleteAccountType')
            .post(AcctClassMstController.deleteAccountType);
        router.route('/checkDuplicateAccountTypeFormField')
            .post(AcctClassMstController.checkDuplicateAccountTypeFormField);

    app.use(
        '/api/v1/acctclassmst',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
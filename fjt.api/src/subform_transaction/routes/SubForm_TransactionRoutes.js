const router = require('express').Router(); // eslint-disable-line
const subFormTransaction = require('../controllers/SubForm_TransactionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getSubformTransactionDetail')
        .post(subFormTransaction.getSubformTransactionDetail);

    app.use('/api/v1/subForm_transaction',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

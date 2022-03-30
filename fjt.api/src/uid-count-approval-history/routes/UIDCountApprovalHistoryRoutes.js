const router = require('express').Router();
const UIDCountApprovalHistoryController = require('../controllers/UIDCountApprovalHistoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getCountApprovalHistoryList')
        .post(UIDCountApprovalHistoryController.getCountApprovalHistoryList);

    app.use(
        '/api/v1/countapprovalhistory',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
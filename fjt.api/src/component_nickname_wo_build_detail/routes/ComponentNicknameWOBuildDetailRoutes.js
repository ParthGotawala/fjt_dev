const router = require('express').Router();
const compNicknameWOBuildDetail = require('../controllers/ComponentNicknameWOBuildDetailController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getCompNicknameWObuildSummaryInfo')
        .post(compNicknameWOBuildDetail.getCompNicknameWObuildSummaryInfo);

    router.route('/getWOBuildDetailInfoByByAssyNickName')
        .post(compNicknameWOBuildDetail.getWOBuildDetailInfoByByAssyNickName);

    router.route('/getLastWOBuildDetByCompNickname')
        .post(compNicknameWOBuildDetail.getLastWOBuildDetByCompNickname);

    app.use(
        '/api/v1/compNicknameWOBuildDet',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};


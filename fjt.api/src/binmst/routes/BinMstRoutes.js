const router = require('express').Router();

const BinMstController = require('../controllers/BinMstController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getAllBin')
        .get(BinMstController.getAllBin);

    router.route('/getAllNickNameOfAssembly')
        .get(BinMstController.getAllNickNameOfAssembly);

    router.route('/createBin')
        .post(BinMstController.createBin);

    router.route('/retriveBinList')
        .post(BinMstController.retriveBinList);

    router.route('/deleteBin')
        .post(BinMstController.deleteBin);

    router.route('/getBinCountList')
        .post(BinMstController.getBinCountList);

    router.route('/getAllWarehouse')
        .get(BinMstController.getAllWarehouse);

    router.route('/getHistory')
        .post(BinMstController.getBinHistory);

    router.route('/updateBin')
        .post(BinMstController.updateBin);

    router.route('/retriveBin/:id')
        .get(BinMstController.retriveBin);

    router.route('/downloadBinTemplate')
        .post(BinMstController.downloadBinTemplate);

    router.route('/importBin')
        .post(BinMstController.importBin);

    router.route('/checkBinStatusWithUMID')
        .post(BinMstController.checkBinStatusWithUMID);

    router.route('/getBinDetailByName')
        .post(BinMstController.getBinDetailByName);

    router.route('/getWarehouseAndTransferBin')
        .post(BinMstController.getWarehouseAndTransferBin);

    app.use(
        '/api/v1/binmst',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
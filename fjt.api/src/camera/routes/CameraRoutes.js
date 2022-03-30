const router = require('express').Router();

const CameraController = require('../controllers/CameraController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');


module.exports = (app) => {
    router.route('/retrieveCameraList')
        .post(CameraController.retrieveCameraList);

    router.route('/getCameraDetailsById/:id')
        .get(CameraController.getCameraDetailsById);

    router.route('/saveCameraDetails')
        .post(CameraController.saveCameraDetails);

    router.route('/checkDuplicateCameraDetails')
        .post(CameraController.checkDuplicateCameraDetails);

    router.route('/deleteCameraDetails')
        .post(CameraController.deleteCameraDetails);

    router.route('/retriveCameraById/:id')
        .get(CameraController.retriveCameraById);

    router.route('/retriveCameraGroup')
        .get(CameraController.retriveCameraGroup);

    router.route('/retriveCameraByGroup')
        .get(CameraController.retriveCameraByGroup);

    router.route('/getPicturesInQueue')
        .post(CameraController.getPicturesInQueue);

    app.use('/api/v1/camera',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};
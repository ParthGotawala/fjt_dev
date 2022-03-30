const router = require('express').Router(); // eslint-disable-line
const woTransPackagingDet = require('../controllers/Workorder_Trans_PackagingDetController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');


module.exports = (app) => {
    router.route('/')
        .post(woTransPackagingDet.createFinalProductSerial)
        .get(woTransPackagingDet.retriveWoTranspackaging);

    router.route('/deleteWoTranspackaging')
        .post(woTransPackagingDet.deleteWoTranspackaging);

    app.use(
        '/api/v1/woTransPackagingDet',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
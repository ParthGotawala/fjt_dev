const router = require('express').Router(); // eslint-disable-line
const shipped = require('../controllers/ShippedAssemblyController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .get(shipped.retrieveShippedAssembly)
        .post(shipped.createShippedAssembly);

    router.route('/:id')
        .get(shipped.retrieveShippedAssembly)
        // .delete(shipped.deleteShippedAssembly)
        .put(shipped.updateShippedAssembly);

    router.route('/getWorkorderList')
        .post(shipped.getWorkorderList);

    router.route('/deleteShippedAssembly')
        .post(shipped.deleteShippedAssembly);

    router.route('/getExportControlledAssyPartOfWO')
        .post(shipped.getExportControlledAssyPartOfWO);

    app.use(
        '/api/v1/shipped',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};

const router = require('express').Router(); // eslint-disable-line
const JobTypesController = require('../controllers/JobTypesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/saveJobType')
        .post(JobTypesController.createJobType);

    router.route('/findSameJobType')
        .post(JobTypesController.findSameJobType);

    router.route('/getJobTypeList')
        .get(JobTypesController.getJobTypeList);

    router.route('/deleteJobType')
        .post(JobTypesController.deleteJobType);

    router.route('/retriveJobTypeList')
        .post(JobTypesController.retriveJobTypeList);

    router.route('/retriveJobType')
        .get(JobTypesController.retriveJobType);

    app.use('/api/v1/job_type',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);
};

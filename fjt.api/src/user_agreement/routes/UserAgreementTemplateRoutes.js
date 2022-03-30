const router = require('express').Router(); // eslint-disable-line
const useraggrementTemplate = require('../controllers/UserAgreementTemplateController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // router.route('/')
    //     .post(useraggrementTemplate.createUserAgreement);

    // app.use(
    //     '/api/v1/useragreement',
    //     validateToken,

    //     jwtErrorHandler,
    //     populateUser,
    //     router
    // );

    // app.use(
    //     '/api/v1/checkUserAgreement/:id',
    //     validateToken,

    //     jwtErrorHandler,
    //     populateUser,
    //     useraggrementTemplate.checkUserAgrrementByID
    // );
};


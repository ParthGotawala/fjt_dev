const router = require('express').Router(); // eslint-disable-line
const supplierAttributeTemplate = require('../controllers/SupplierAttributeTemplateController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveSupplierAttributeList')
        .post(supplierAttributeTemplate.retrieveSupplierAttributeList);

    router.route('/checkSupplierAttributeTemplateUnique')
        .post(supplierAttributeTemplate.checkSupplierAttributeTemplateUniqueUI);

    router.route('/saveSupplierAttributeTemplate')
        .post(supplierAttributeTemplate.saveSupplierAttributeTemplate);

    router.route('/deleteSupplierAttributeTemplate')
        .post(supplierAttributeTemplate.deleteSupplierAttributeTemplate);

    router.route('/getSupplierList')
        .get(supplierAttributeTemplate.getSupplierList);

    router.route('/getSupplierAttributeTemplateByID/:id')
        .get(supplierAttributeTemplate.getSupplierAttributeTemplateByID);

    app.use(
        '/api/v1/supplierAttributeTemplate',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
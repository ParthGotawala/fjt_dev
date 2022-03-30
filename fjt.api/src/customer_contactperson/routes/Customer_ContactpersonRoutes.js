const router = require('express').Router(); // eslint-disable-line

const customer_contactperson = require('../controllers/Customer_ContactpersonController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')


module.exports = (app) => {
    router.route('/retrieveContactPersonList')
        .post(customer_contactperson.retrieveContactPersonList);

    router.route('/')
        .post(customer_contactperson.createCustomerContactPerson);

    router.route('/:personId')
        .put(customer_contactperson.updateCustomerContactPerson)
    //.get(customer_contactperson.getContactPersons);
    router.route('/deleteCustomerContactPerson')
        .post(customer_contactperson.deleteCustomerContactPerson);

    router.route('/getCustomerContactPersonList')
        .post(customer_contactperson.getCustomerContactPersonList);

    router.route('/setCustContactPersonDefault')
        .post(customer_contactperson.setCustContactPersonDefault);

    router.route('/getCustomerContactPersons')
        .post(customer_contactperson.getContactPersons);

    router.route('/retrieveEmployeeContactpersonList')
        .post(customer_contactperson.retrieveEmployeeContactpersonList);

    router.route('/getContactPersonList')
        .post(customer_contactperson.getContactPersonList);

    router.route('/getContactPersonById/:id')
        .get(customer_contactperson.getContactPersonById);

    router.route('/managePrimaryContactPersons')
        .post(customer_contactperson.managePrimaryContactPersons);

    app.use(
        '/api/v1/customer_contactperson',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );


};

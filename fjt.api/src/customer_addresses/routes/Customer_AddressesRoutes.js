const router = require('express').Router(); // eslint-disable-line
const customerAddress = require('../controllers/Customer_AddressesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');


module.exports = (app) => {
    router.route('/customerAddressList')
        .post(customerAddress.retriveCustomerAddressList);

    router.route('/saveCustomerAddresses')
        .post(customerAddress.saveCustomerAddresses);

    router.route('/getAddressForSupplierPayment')
        .get(customerAddress.getAddressForSupplierPayment);

    router.route('/:id')
        .get(customerAddress.getcustomerAddress);

    router.route('/updateCustomerAddresses')
        .put(customerAddress.updateCustomerAddresses);

    router.route('/deleteCustomerAddresses')
        .post(customerAddress.deleteCustomerAddresses);

    router.route('/setCustomerAddressesDefault')
        .put(customerAddress.setCustomerAddressesDefault);

    router.route('/setDefaultContactPersonForCustAddr')
        .post(customerAddress.setDefaultContactPersonForCustAddr);
        
    app.use(
        '/api/v1/customer_addresses',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
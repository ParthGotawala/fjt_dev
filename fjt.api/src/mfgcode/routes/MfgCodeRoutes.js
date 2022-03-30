const router = require('express').Router(); // eslint-disable-line
const routerForCustomer = require('express').Router(); // eslint-disable-line
const routerForSupplier = require('express').Router(); // eslint-disable-line
// eslint-disable-line
const MfgCode = require('../controllers/MfgCodeController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
// const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getAcessLeval')
        .get(MfgCode.getAcessLeval);

    router.route('/retriveMfgCodeList')
        .post(MfgCode.retriveMfgCodeList);

    router.route('/getMfgcodeList')
        .get(MfgCode.getMfgcodeList);

    router.route('/deleteMfgCode')
        .post(MfgCode.deleteMfgCode);

    // router.route('/retriveMfgCode')
    //     .post(MfgCode.retriveMfgCode);

    router.route('/retriveMfgCode')
        .post(MfgCode.retriveMfgCode);
    router.route('/getMappedManufacturerList/:mfgCodeAliasID')
        .get(MfgCode.getMappedManufacturerList);

    router.route('/checkMFGAliasRemovable')
        .post(MfgCode.checkMFGAliasRemovable);

    router.route('/checkUniqueMFGAlias')
        .post(MfgCode.checkUniqueMFGAlias);

    router.route('/allManufacturer/getAllManufacturers')
        .post(MfgCode.getAllManufacturers);

    router.route('/allManufacturer/getAllManufacturerWithFormattedCodeList')
        .get(MfgCode.getAllManufacturerWithFormattedCodeList);

    router.route('/getManufacturerList')
        .get(MfgCode.getManufacturer);

    router.route('/saveManufacturer')
        .post(MfgCode.saveManufacturer);

    router.route('/exportSampleMFGTemplate')
        .post(MfgCode.exportSampleMFGTemplate);

    router.route('/saveMappedManufacturer')
        .post(MfgCode.saveMappedManufacturer);

    router.route('/importFormatTwoManufacturerDetails')
        .post(MfgCode.importFormatTwoManufacturerDetails);

    router.route('/importFormatOneManufacturerDetails')
        .post(MfgCode.importFormatOneManufacturerDetails);

    router.route('/removeMFRDetails')
        .post(MfgCode.removeMFRDetails);

    router.route('/removeImportMFG')
        .post(MfgCode.removeImportMFG);

    router.route('/importFormatOneCustomerDetails')
        .post(MfgCode.importMFGExcelDetails);

    router.route('/validateCustomerDetails')
        .post(MfgCode.validateImportMFGDetails);

    router.route('/getVerificationManufacturerList')
        .get(MfgCode.getVerificationManufacturerList);

    router.route('/VerifyManufacturer')
        .post(MfgCode.VerifyManufacturer);

    router.route('/UpdateVerificationManufacturer')
        .post(MfgCode.UpdateVerificationManufacturer);

    router.route('/importCPNDetails')
        .post(MfgCode.importCPNDetails);

    router.route('/exportCPNDetails')
        .post(MfgCode.exportCPNDetails);

    router.route('/updateDisplayOrder')
        .post(MfgCode.updateDisplayOrder);

    router.route('/retriveWhereUsedMFGList')
        .post(MfgCode.retriveWhereUsedMFGList);
    router.route('/getAllCustomerComment')
        .post(MfgCode.getAllCustomerComment);
    router.route('/addCustomerComment')
        .post(MfgCode.addCustomerComment);
    router.route('/deleteCustomerComment')
        .post(MfgCode.deleteCustomerComment);
    router.route('/getCustomerCommentsById')
        .post(MfgCode.getCustomerCommentsById);
    router.route('/getCustomerCommentsCount')
        .get(MfgCode.getCustomerCommentsCount);


    app.use('/api/v1/mfgcode',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router);


    // /* ************* Customer apis ********************/
    routerForCustomer.route('/retriveCustomerList')
        .post(MfgCode.retriveMfgCodeList);

    routerForCustomer.route('/getCustomerDetails')
        .post(MfgCode.retriveMfgCode);

    routerForCustomer.route('/saveCustomer')
        .post(MfgCode.saveManufacturer);

    // routerForCustomer.route('/saveCustomerBillingTerms')
    //     .post(MfgCode.saveCustomerBillingTerms);

    routerForCustomer.route('/getCustomerList')
        .get(MfgCode.getManufacturer);

    routerForCustomer.route('/getCustomerByEmployeeID')
        .get(MfgCode.getCustomerByEmployeeID);

    routerForCustomer.route('/checkDuplicateMFGName')
        .post(MfgCode.checkDuplicateMFGName);

    routerForCustomer.route('/checkDuplicateMFGCode')
        .post(MfgCode.checkDuplicateMFGCode);

    routerForCustomer.route('/deleteCustomer')
        .post(MfgCode.deleteMfgCode);

    routerForCustomer.route('/getComponentCustAliasRevByCustId')
        .post(MfgCode.getComponentCustAliasRevByCustId);

    routerForCustomer.route('/getComponentCustAliasRevPNByCustId')
        .post(MfgCode.getComponentCustAliasRevPNByCustId);

    routerForCustomer.route('/getAssumblyListFromCPN/:id')
        .get(MfgCode.getAssumblyListFromCPN);

    routerForCustomer.route('/saveCustMFGPN')
        .post(MfgCode.saveCustMFGPN);

    routerForCustomer.route('/checkCPNUIDStock')
        .post(MfgCode.checkCPNUIDStock);

    routerForCustomer.route('/removeMPNMapping')
        .post(MfgCode.removeMPNMapping);

    routerForCustomer.route('/getAVLPartDetailByCPNID')
        .post(MfgCode.getAVLPartDetailByCPNID);

    routerForCustomer.route('/getManufacturerAssignCount/:mfrID')
        .get(MfgCode.getManufacturerAssignCount);

    routerForCustomer.route('/updateComponentStatusToObsolete/:mfrID')
        .get(MfgCode.updateComponentStatusToObsolete);

    routerForCustomer.route('/getCustomerAssemblyStock')
        .get(MfgCode.getCustomerAssemblyStock);

    routerForCustomer.route('/CheckAnyCustomPartSupplierMFRMapping')
        .post(MfgCode.CheckAnyCustomPartSupplierMFRMapping);

    app.use(
        '/api/v1/customers',
        validateToken,

        jwtErrorHandler,
        populateUser,
        routerForCustomer
    );

    /* ************* Supplier apis ********************/
    routerForSupplier.route('/getSupplierList')
        .get(MfgCode.getManufacturer);

    routerForSupplier.route('/getSupplierScanDocumentSetting/:id')
        .get(MfgCode.getSupplierScanDocumentSetting);

    routerForSupplier.route('/retrieveCustomComponentNotAddedList')
        .post(MfgCode.retrieveCustomComponentNotAddedList);

    routerForSupplier.route('/retrieveCustomComponentAddedList')
        .post(MfgCode.retrieveCustomComponentAddedList);

    // routerForSupplier.route('/saveRemitToDetails')
    //     .post(MfgCode.saveRemitToDetails);
    routerForSupplier.route('/getCustomerMappingList')
        .post(MfgCode.getCustomerMappingList);
    routerForSupplier.route('/getStandardbySupplier')
        .post(MfgCode.getStandardbySupplier);
    routerForSupplier.route('/saveStandards')
        .post(MfgCode.saveStandards);

    app.use(
        '/api/v1/supplier',
        validateToken,

        jwtErrorHandler,
        populateUser,
        routerForSupplier
    );
};
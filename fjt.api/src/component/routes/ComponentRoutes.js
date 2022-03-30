const router = require('express').Router();
const routerWithoutTocken = require('express').Router();

const component = require('../controllers/ComponentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken')

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getcomponentPackagingaliaslist')
        .post(component.getcomponentPackagingaliaslist);

    router.route('/checkPartUsedAsPackagingAlias/:id')
        .get(component.checkPartUsedAsPackagingAlias);

    router.route('/checkPartUsedAsAlternatePart/:id')
        .get(component.checkPartUsedAsAlternatePart);

    router.route('/checkPartUsedAsRoHSAlternatePart/:id')
        .get(component.checkPartUsedAsRoHSAlternatePart);

    router.route('/retrieveComponentWithPackagaingAlias')
        .post(component.retrieveComponentWithPackagaingAlias);

    router.route('/getComponentMFGAliasSearch')
        .post(component.getComponentMFGAliasSearch);

    router.route('/getComponentMFGAliasPartsSearch')
        .post(component.getComponentMFGAliasPartsSearch);

    router.route('/getComponentMFGAliasPIDProdPNSearch')
        .post(component.getComponentMFGAliasPIDProdPNSearch);

    router.route('/retrieveComponentHeaderCountDetail')
        .post(component.retrieveComponentHeaderCountDetail);

    router.route('/getComponentPidCodeSearch')
        .post(component.getComponentPidCodeSearch);

    router.route('/getWhereUseComponent')
        .post(component.getWhereUseComponent);

    router.route('/getWhereUseComponentOther')
        .post(component.getWhereUseComponentOther);

    router.route('/getComponentAssyProgramList')
        .post(component.getComponentAssyProgramList);

    router.route('/getComponentList/:isGoodPart')
        .get(component.getComponentList);

    router.route('/getComponentDriveToolsList/:id')
        .get(component.getComponentDriveToolsList);

    router.route('/getDriveToolListByComponentId')
        .post(component.getDriveToolListByComponentId);

    router.route('/getComponenProcessMaterialList/:id')
        .get(component.getComponenProcessMaterialList);

    router.route('/getCustomerAlias/:id')
        .get(component.getCustomerAlias);

    router.route('/getComponentAliasGroup')
        .post(component.getComponentAliasGroup);

    router.route('/getComponentPackagingAliasGroup/:id')
        .get(component.getComponentPackagingAliasGroup);

    router.route('/getComponentAlternetAliasGroup')
        .post(component.getComponentAlternetAliasGroup);

    router.route('/getComponentByMfgType')
        .post(component.getComponentByMfgType);

    router.route('/getComponentDetailByMfg/:id')
        .get(component.getComponentDetailByMfg);

    router.route('/getComponentByID/:id')
        .get(component.getComponentByID);

    router.route('/getComponentPIDCode')
        .get(component.getComponentPIDCode);

    router.route('/getPricingHistroy')
        .get(component.getPricingHistroy);

    router.route('/exportSampleFilterTemplate')
        .post(component.exportSampleFilterTemplate);

    router.route('/copyPartDetail')
        .post(component.copyPartDetail);

    router.route('/createAssemblyRevision')
        .post(component.createAssemblyRevision);

    router.route('/getComponentExternalValues')
        .post(component.getComponentExternalValues);

    router.route('/getPartUsageDetail')
        .get(component.getPartUsageDetail);

    router.route('/getComponentMFGPIDCodeAliasSearch')
        .post(component.getComponentMFGPIDCodeAliasSearch);

    router.route('/')
        .post(component.createComponent);
    router.route('/validateDuplicatePIDCode')
        .post(component.validateDuplicatePIDCode);
    router.route('/validateDuplicateMFRPN')
        .post(component.validateDuplicateMFRPN);
    router.route('/getNoneMountComponent')
        .post(component.getNoneMountComponent);

    router.route('/saveNoneMountComponent')
        .post(component.saveNoneMountComponent);

    router.route('/createComponentDriveTools')
        .post(component.createComponentDriveTools);

    router.route('/createPackagingAlias')
        .post(component.createPackagingAlias);
    router.route('/addBulkPackagingAlias')
        .post(component.addBulkPackagingAlias);

    router.route('/createAlternetAlias')
        .post(component.createAlternetAlias);

    router.route('/createComponentProcessMaterial')
        .post(component.createComponentProcessMaterial);

    router.route('/deleteDriveToolComponent')
        .post(component.deleteDriveToolComponent);

    router.route('/deleteComponentPackagingAlias')
        .post(component.deleteComponentPackagingAlias);

    router.route('/deleteComponentAlternetAlias')
        .post(component.deleteComponentAlternetAlias);

    router.route('/deleteComponentProcessMaterial')
        .post(component.deleteComponentProcessMaterial);

    router.route('/getNoneTypeComponent')
        .get(component.getNoneTypeComponent);

    router.route('/getComponentStatusList')
        .get(component.getComponentStatusList);

    router.route('/getrefreshComponent')
        .get(component.getrefreshComponent);

    router.route('/getComponentHistory')
        .post(component.getComponentHistory);

    router.route('/getComponentTemperatureSensitiveDataList')
        .post(component.getComponentTemperatureSensitiveDataList);

    router.route('/getComponentTemperatureSensitiveDataByID/:id')
        .get(component.getComponentTemperatureSensitiveDataByID);

    router.route('/:id')
        .get(component.retrieveComponent)
        .put(component.updateComponent);

    router.route('/validationOnUpdatePart')
        .post(component.validationOnUpdatePart);

    router.route('/retrieveComponentList')
        .post(component.retrieveComponentList);

    router.route('/deleteComponent')
        .post(component.deleteComponent);

    router.route('/getComponentGoodBadPartGroup')
        .post(component.getComponentGoodBadPartGroup);

    router.route('/getComponentGoodBadPartList')
        .post(component.getComponentGoodBadPartList);

    router.route('/getComponentAlternetAliasByID/:id')
        .get(component.getComponentAlternetAliasByID);

    router.route('/getComponentROHSAlternetAliasByID/:id')
        .get(component.getComponentROHSAlternetAliasByID);

    router.route('/getComponentProcessMaterialGroupByCompomentID/:id')
        .get(component.getComponentProcessMaterialGroupByCompomentID);

    router.route('/saveApiVerificationResult')
        .post(component.saveApiVerificationResult);
    router.route('/updateComponentStatus')
        .post(component.updateComponentStatus);

    router.route('/getAssemblyPIDList')
        .post(component.getAssemblyPIDList);

    router.route('/getComponentDetailByMfgPN')
        .post(component.getComponentDetailByMfgPN);

    router.route('/getComponentOtherPartList/:id')
        .get(component.getComponentOtherPartList);

    router.route('/createComponentOtherPart')
        .post(component.createComponentOtherPart);

    router.route('/deleteComponentOtherPart')
        .post(component.deleteComponentOtherPart);

    router.route('/getFunctionaltestingEquipmentList/:id')
        .get(component.getFunctionaltestingEquipmentList);

    router.route('/createFunctionalTestingEquipment')
        .post(component.createFunctionalTestingEquipment);

    router.route('/deleteFunctionalTestingEquipment')
        .post(component.deleteFunctionalTestingEquipment);

    router.route('/getComponentFunctionalTestingEquipmentSearch')
        .post(component.getComponentFunctionalTestingEquipmentSearch);

    router.route('/getFunctionalTypePartList/:id')
        .get(component.getFunctionalTypePartList);

    router.route('/saveFunctionalTypePart')
        .post(component.saveFunctionalTypePart);

    router.route('/deleteFunctionalTypePart')
        .post(component.deleteFunctionalTypePart);

    router.route('/getMountingTypePartList/:id')
        .get(component.getMountingTypePartList);

    router.route('/getOddelyRefDesList/:id')
        .get(component.getOddelyRefDesList);

    router.route('/saveMountingTypePart')
        .post(component.saveMountingTypePart);

    router.route('/saveOddlyNamedRefDes')
        .post(component.saveOddlyNamedRefDes);

    router.route('/deleteMountingTypePart')
        .post(component.deleteMountingTypePart);

    router.route('/getComponentInternalVersion/:id')
        .get(component.getComponentInternalVersion);

    router.route('/getComponentGoodPart/:id')
        .get(component.getComponentGoodPart);

    router.route('/getComponentPackgingParts')
        .post(component.getComponentPackgingParts);

    router.route('/getAlternetPartList')
        .post(component.getAlternetPartList);

    router.route('/getProcessMaterialPartGridList')
        .post(component.getProcessMaterialPartGridList);

    router.route('/getComponentCPNList')
        .post(component.getComponentCPNList);

    router.route('/getFunctionaltestingEquipmentGridList')
        .post(component.getFunctionaltestingEquipmentGridList);

    router.route('/getPossibleAlternetPartList')
        .post(component.getPossibleAlternetPartList);

    router.route('/getComponentBasicDetails')
        .post(component.getComponentBasicDetails);

    router.route('/createComponentImage')
        .post(component.createComponentImage);

    router.route('/createComponentImageUrls')
        .post(component.createComponentImageUrls);

    router.route('/getComponentImages/:id')
        .get(component.getComponentImages);

    router.route('/deleteComponentImages')
        .post(component.deleteComponentImages);

    router.route('/updateComponentDefaultImage')
        .post(component.updateComponentDefaultImage);

    router.route('/getComponentDataSheetUrls/:id')
        .get(component.getComponentDataSheetUrls);

    router.route('/getComponentAlternatePnValidations')
        .post(component.getComponentAlternatePnValidations);
    router.route('/checkAlternateAliasValidations')
        .post(component.checkAlternateAliasValidations);

    router.route('/getAssemblyComponentDetailById/:id')
        .get(component.getAssemblyComponentDetailById);

    router.route('/getStockStatus/:id')
        .get(component.getStockStatus);

    router.route('/getComponentBuyDetail/:id')
        .get(component.getComponentBuyDetail);

    router.route('/createComponentTemperatureSensitiveData')
        .post(component.createComponentTemperatureSensitiveData);

    router.route('/updateComponentTemperatureSensitiveData')
        .post(component.updateComponentTemperatureSensitiveData);

    router.route('/deleteComponentTemperatureSensitiveData')
        .post(component.deleteComponentTemperatureSensitiveData);

    router.route('/getComponentKitAllocationDetail/:id')
        .get(component.getComponentKitAllocationDetail);

    router.route('/getComponentPackagingAliasByID/:id')
        .get(component.getComponentPackagingAliasByID);

    router.route('/getAllocatedKitByPart')
        .post(component.getAllocatedKitByPart);

    router.route('/getComponentListForPartStat')
        .post(component.getComponentListForPartStat);

    router.route('/getPartPriceBreakDetails')
        .post(component.getPartPriceBreakDetails);

    router.route('/getAssemblySalesPriceDetails')
        .post(component.getAssemblySalesPriceDetails);

    router.route('/getPartDynamicAttributeDetails')
        .post(component.getPartDynamicAttributeDetails);

    router.route('/getAssyWiseAllProgramingComponent')
        .post(component.getAssyWiseAllProgramingComponent);

    router.route('/getComponentMaxTemperatureData/:id')
        .get(component.getComponentMaxTemperatureData);

    router.route('/getComponentCPNAliasSearch')
        .post(component.getComponentCPNAliasSearch);

    router.route('/getExternalFunctionalAndMountingTypeValueList')
        .post(component.getExternalFunctionalAndMountingTypeValueList);

    router.route('/getAssemblyRevisionList')
        .post(component.getAssemblyRevisionList);

    router.route('/updateComponentAttributes')
        .post(component.updateComponentAttributes);

    router.route('/createComponentAcceptableShippingCountry')
        .post(component.createComponentAcceptableShippingCountry);

    router.route('/deleteComponentAcceptableShippingCountry')
        .post(component.deleteComponentAcceptableShippingCountry);

    router.route('/retriveComponentAcceptableShippingCountryList/:id')
        .get(component.retriveComponentAcceptableShippingCountryList);

    router.route('/getComponentActivityStartTime')
        .post(component.getComponentActivityStartTime);

    router.route('/getAllAssemblyBySearch')
        .post(component.getAllAssemblyBySearch);

    router.route('/getAllAssyFilterList')
        .post(component.getAllAssyFilterList);

    router.route('/getAllAssyListWitoutSOCreated')
        .post(component.getAllAssyListWitoutSOCreated);

    router.route('/updateMFGPPIDCodeOfComponent')
        .post(component.updateMFGPPIDCodeOfComponent);

    router.route('/retrieveSupplierNotAddedList')
        .post(component.retrieveSupplierNotAddedList);

    router.route('/retrieveSupplierAddedList')
        .post(component.retrieveSupplierAddedList);

    router.route('/retriveComponentApprovedSupplier')
        .post(component.retriveComponentApprovedSupplier);

    router.route('/checkComponentApprovedSupplierUnique')
        .post(component.checkComponentApprovedSupplierUnique);

    router.route('/saveComponentApprovedSupplier')
        .post(component.saveComponentApprovedSupplier);

    router.route('/saveComponentApprovedSupplierPriority')
        .post(component.saveComponentApprovedSupplierPriority);

    router.route('/deleteComponentApprovedSupplier')
        .post(component.deleteComponentApprovedSupplier);

    router.route('/getAllNickNameFilterList')
        .post(component.getAllNickNameFilterList);
    router.route('/getComponentDetailByPN')
        .post(component.getComponentDetailByPN);

    router.route('/uploadComponentDataSheets')
        .post(component.uploadComponentDataSheets);

    router.route('/getComponentMFGAliasSearchPurchaseOrder')
        .post(component.getComponentMFGAliasSearchPurchaseOrder);

    router.route('/getProgressiveFilters')
        .post(component.getProgressiveFilters);

    router.route('/getNoneProgressiveFilters')
        .post(component.getNoneProgressiveFilters);
    router.route('/getCommentsSize/:id')
        .get(component.getCommentsSize);
    router.route('/getComponentPartStatus')
        .post(component.getComponentPartStatus);

    router.route('/getComponentKitScrappedQty')
        .post(component.getComponentKitScrappedQty);

    router.route('/importComponentDetail')
        .post(component.importComponentDetail);

    router.route('/getVerificationMPNList')
        .post(component.getVerificationMPNList);

    router.route('/stopImportPartVerification')
        .post(component.stopImportPartVerification);

    router.route('/getUserImportTransctionId')
        .post(component.getUserImportTransctionId);

    router.route('/removeImportMPNMappDet')
        .post(component.removeImportMPNMappDet);

    router.route('/reVerifyMPNImport')
        .post(component.reVerifyMPNImport);


    app.use(
        '/api/v1/component',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    app.use(
        '/api/v1/componentapi',
        routerWithoutTocken
    );

    routerWithoutTocken.route('/getPricingAndUpdateComponentDetails')
        .post(component.getPricingAndUpdateComponentDetails);
};
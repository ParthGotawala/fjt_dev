(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ManualPricePopupController', ManualPricePopupController);

  /** @ngInject */
  function ManualPricePopupController($mdDialog, $q, CORE, RFQTRANSACTION,
    data, PartCostingFactory, BaseService, DialogFactory, ManageMFGCodePopupFactory, SalesOrderFactory, USER) {

    const vm = this;
    vm.parentData = data.parentScope;
    vm.parentLineData = data.selectedLine;
    vm.iscustomComponent = data.iscustomPartNumber;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.PricingTurnTime = RFQTRANSACTION.PRICING_TURN_TYPE;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CustomReeling = RFQTRANSACTION.CUSTOM_STATUS;
    vm.Rohs = RFQTRANSACTION.CUSTOM_STATUS;
    vm.Ncnr = RFQTRANSACTION.CUSTOM_STATUS;
    vm.Supplier = CORE.COMPONENT_MFG_TYPE.SUPPLIER;
    let rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.cancel = (form) => {
      var ischange = BaseService.checkFormDirty(form);
      if (ischange || (vm.ischange)) {
        let data = {
          form: vm.manualpriceform
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    //check form
    vm.checkFormDirty = () => {
      return BaseService.checkFormDirty(vm.manualpriceform);
    }

    vm.pricing = {
      Multiplier: 1,
      MinimumBuy: 1
    };
    //get distributor list
    function getMfgSearch() {
      return ManageMFGCodePopupFactory.getMfgcodeList().query({ type: CORE.MFG_TYPE.DIST }).$promise.then((mfgcodes) => {
        vm.mfgCodeDetail = mfgcodes.data;
        return mfgcodes.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    let getUnitList = () => {
      return SalesOrderFactory.getUnitList().query().$promise.then((unitlist) => {
        vm.UnitList = unitlist.data;
        return unitlist.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //get detail of selected price
    let getPriceDetail = () => {
      let pricingObj = {
        consolidateID: vm.parentData.id,
        IsDeleted: false,
        _id: vm.parentLineData._id,
        isPurchaseApi: false
      };
      vm.cgBusyLoading = PartCostingFactory.retrievePricing().query({ pricingObj: pricingObj }).$promise.then((pricing) => {
        vm.pricingDet = pricing.data.pricing[0];
        vm.pricing = {
          Multiplier: vm.pricingDet.Multiplier,
          MinimumBuy: vm.pricingDet.MinimumBuy,
          RoHS: vm.pricingDet.RoHS,
          PIDCode: vm.pricingDet.PIDCode,
          MfgDescription: vm.pricingDet.mfgPNDescription,
          CurrentStockQty: vm.pricingDet.OrgInStock,
          LeadTime: vm.pricingDet.APILeadTime ? parseFloat(vm.pricingDet.APILeadTime) : null,
          additionalValueFee: vm.pricingDet.AdditionalValueFee
        };
        vm.suppliername = vm.pricingDet.SupplierName;
        vm.isEdit = true;
        if (vm.autoCompleteReeling)
          vm.autoCompleteReeling.keyColumnId = vm.pricingDet.Reeling;
        if (vm.autoCompleteNcNR)
          vm.autoCompleteNcNR.keyColumnId = vm.pricingDet.NCNR;
        if (vm.autoCompletePackage && vm.packagingAll)
          vm.autoCompletePackage.keyColumnId = vm.pricingDet.packageID;
        if (vm.autoCompletepartNumber && vm.partNumberList)
          vm.autoCompletepartNumber.keyColumnId = vm.pricingDet.PartNumberId;
        if (vm.autoCompleteMFG && vm.mfgCodeDetail)
          vm.autoCompleteMFG.keyColumnId = vm.pricingDet.mfgCodeID;
        if (vm.autoCompletedistCode && vm.mfgCodeDetail)
          vm.autoCompletedistCode.keyColumnId = vm.pricingDet.SupplierID;

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //check button color validation
    const checkValidationMessage = () => {
      _.map(vm.qtyBreakList, (item) => {
        item.isInvalidUnitPrice = false;
        item.isInvalidExtPrice = false;
      });
      _.each(vm.qtyBreakList, (item) => {
        //check qty unit price is higher or not
        const objQty = _.find(vm.qtyBreakList, (qtyBreak) => qtyBreak.price && item.price && qtyBreak.qty && parseInt(qtyBreak.qty) > parseInt(item.qty) && parseFloat(qtyBreak.price) > parseFloat(item.price));
        if (objQty) {
          item.isInvalidUnitPrice = true;
        }
        const objExt = _.find(vm.qtyBreakList, (qtyBreak) => qtyBreak.ext && item.ext && qtyBreak.qty && parseInt(qtyBreak.qty) < parseInt(item.qty) && parseFloat(qtyBreak.ext) > parseFloat(item.ext));
        if (objExt) {
          item.isInvalidExtPrice = true;
        }
      });
    };
    //get price break
    function callbackFunction() {
      var pricingObj = {
        componentID: [vm.parentLineData.PartNumberId],
        UpdatedTimeStamp: vm.parentLineData.UpdatedTimeStamp,
        Packaging: vm.parentLineData.Packaging,
        Type: vm.parentLineData.SourceOfPrice,
        qtySupplierID: vm.parentLineData._id,
        supplierID: vm.parentLineData.SupplierID
      };
      vm.cgBusyLoading = PartCostingFactory.retrievePriceBreak().query({ pricingObj: pricingObj }).$promise.then((qtyBreak) => {
        if (qtyBreak && qtyBreak.data) {
          var qtyBreakList = _.sortBy(qtyBreak.data.qtyBreak, (o) => { return o.qty; });
          _.each(qtyBreakList, (item) => {
            item.ext = (parseInt(item.qty) * parseFloat(item.price)).toFixed(_amountFilterDecimal);
            item.price = (parseFloat(item.price)).toFixed(_unitPriceFilterDecimal);
            item.isDisable = false;
          });
          vm.qtyBreakList = qtyBreakList;
          vm.addnewRecord();
          checkValidationMessage();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get alternate part number list
    function getLineItemParts() {
      return PartCostingFactory.getAlternatePartList().query({ consolidateID: vm.parentData.id, pisPurchaseApi: false }).$promise.then((lineitems) => {
        var mfgList = [];
        vm.pnDetailList = [];
        // if part is non rohs and not approved then no need to do manual price
        lineitems.data.alternateParts = _.filter(lineitems.data.alternateParts, (alternate) => { return ((alternate.RoHSStatusID == RFQTRANSACTION.NON_RoHS && alternate.customerApproval !== 'P') || alternate.RoHSStatusID != RFQTRANSACTION.NON_RoHS) });
        // if part have any tbd then no price
        lineitems.data.alternateParts = _.filter(lineitems.data.alternateParts, (alternate) => { return (alternate.RoHSStatusID != RFQTRANSACTION.TBD && alternate.partStatus != RFQTRANSACTION.TBD && alternate.functionalCategoryID != RFQTRANSACTION.TBD && alternate.mountingtypeID != RFQTRANSACTION.TBD) });
        _.each(lineitems.data.alternateParts, (mfg) => {
          if (!_.find(mfgList, (item) => item.id == mfg.mfgCodeID)) {
            const obj = {
              mfgName: mfg.mfgName,
              mfgCode: mfg.mfgCode,
              name: BaseService.getMfgCodeNameFormat(mfg.mfgCode, mfg.mfgName),
              id: mfg.mfgCodeID
            };
            mfgList.push(obj);
          }
          //check if part is restricted then no need to add manual price for same.
          if (!_.find(vm.parentData.restrictedParts, (restrict) => restrict.mfgPNID == mfg.mfgPNID)) {//&& restrict.consolidateID == vm.parentData.id 
            if (!_.find(vm.pnDetailList, (pn) => pn.mfgCodeID == mfg.mfgCodeID && pn.mfgPNID == mfg.mfgPNID)) {
              vm.pnDetailList.push(mfg);
            }
          }
        });
        vm.mfgCodeList = mfgList;
        vm.partNumberList = [];
        return lineitems.data.alternateParts;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    const getpackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingAll = packaging.data;
        return packaging.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    var autocompletePromise = [getMfgSearch(), getLineItemParts(), getpackaging(), getUnitList()];
    if (vm.parentLineData && vm.parentLineData._id) {
      autocompletePromise.push(getPriceDetail());
      autocompletePromise.push(callbackFunction());
    }
    //go to part master
    vm.goToPartMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.autoCompletepartNumber.keyColumnId);
    };
    //on select method of part number for manufacturer select
    const getComponentMfg = (item) => {
      if (item) {
        vm.pricing.ManufacturerName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
        vm.pricing.MfgDescription = item.mfgPNDescription;
        vm.pricing.RoHS = item.name;
        vm.pricing.Status = item.gencCategoryName;
        vm.pricing.package = item.partPackage;
        vm.pricing.rohsIcon = stringFormat('{0}{1}', rohsImagePath, item.rohsIcon);
        vm.pricing.PIDCode = item.PIDCode;
        vm.pricing.mfgPN = item.mfgPN;
        vm.pricing.noOfPosition = item.noOfPosition;
        vm.pricing.noOfRows = item.noOfRows;
        vm.pricing.uom = item.uom;
        vm.pricing.isPackaging = item.isPackaging;
        vm.pricing.packageQty = item.unit;
        vm.pricing.roIcon = item.rohsIcon;
        vm.pricing.mountingtypeID = item.mountingtypeID;
        vm.pricing.functionalCategoryID = item.functionalCategoryID;
        vm.pricing.mountingtypeName = item.mountName;
        vm.pricing.functionalCategoryName = item.partTypeName;
        vm.pricing.imageURL = item.imageURL;
        vm.pricing.documentPath = item.documentPath;
        vm.pricing.unitName = item.unitName;
        vm.pricing.PackageSPQQty = item.packageQty;
        vm.pricing.connecterTypeID = item.connecterTypeID;
        vm.pricing.custAssyPN = item.custAssyPN;
        vm.pricing.isCustom = item.isCustom;
        bindHeaderData();
      }
      else {
        vm.pricing.ManufacturerName = null;
        vm.pricing.rohs = null;
        vm.pricing.RoHS = null;
        vm.pricing.Status = null;
        vm.pricing.package = null;
        vm.pricing.rohsIcon = null;
        vm.pricing.PIDCode = null;
        vm.pricing.mfgPN = null;
        vm.pricing.noOfPosition = null;
        vm.pricing.noOfRows = null;
        vm.pricing.uom = null;
        vm.pricing.packageQty = null;
        vm.pricing.isPackaging = null;
        vm.pricing.roIcon = null;
        vm.pricing.mountingtypeID = null;
        vm.pricing.functionalCategoryID = null;
        vm.pricing.mountingtypeName = null;
        vm.pricing.functionalCategoryName = null;
        vm.pricing.imageURL = null;
        vm.pricing.documentPath = null;
        vm.pricing.unitName = null;
        vm.pricing.PackageSPQQty = null;
        vm.pricing.connecterTypeID = null;
        vm.pricing.custAssyPN = null;
        vm.pricing.isCustom = null;
        vm.headerdata = [];
      }
    };
    //on select method of mfg
    const getComponent = (item) => {
      if (item) {
        vm.partNumberList = _.filter(vm.pnDetailList, (partNumber) => partNumber.mfgCodeID == item.id);
      }
      else {
        vm.partNumberList = [];
        vm.autoCompletepartNumber.keyColumnId = null;
      }
    };
    //get disty code
    const getDistyCode = (item) => {
      if (item) {
        vm.suppliername = item.mfgName;
        vm.authorizeType = item.authorizeType;
      }
      else {
        vm.suppliername = null;
        vm.authorizeType = null;
      }
    };
    vm.selectedItems = [];
    if (!vm.parentLineData) {
      const qtyBreakList = [];
      _.each(vm.parentData.quantityTotals, (reqQty) => {
        var objQty = {
          qty: reqQty.requestQty,
          price: null,
          ext: null,
          isDisable: false,
          leadTime: 0
        };
        qtyBreakList.push(objQty);
      });
      if (qtyBreakList.length === 1) {
        qtyBreakList[0].isDisable = true;
      }
      vm.qtyBreakList = _.sortBy(qtyBreakList, (o) => o.qty);
    }
    const initDefaultAutoComplete = () => {
      vm.autoCompleteReeling = {
        columnName: 'Name',
        keyColumnName: 'Name',
        keyColumnId: null,
        inputName: 'Custom Reeling',
        placeholderName: 'Custom Reeling',
        isRequired: false,
        isAddnew: false
      },
        vm.autoCompleteNcNR = {
          columnName: 'Name',
          keyColumnName: 'Name',
          keyColumnId: null,
          inputName: 'NCNR',
          placeholderName: 'NCNR',
          isRequired: false,
          isAddnew: false
        };
    };
    initDefaultAutoComplete();
    const initAutoComplete = () => {
      vm.autoCompletedistCode = {
        columnName: 'mfgCodeName',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        isRequired: true,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        callbackFn: getMfgSearch,
        onSelectCallbackFn: getDistyCode
      };
      vm.autoCompletepartNumber = {
        columnName: 'mfgPN',
        keyColumnName: 'mfgPNID',
        keyColumnId: null,
        inputName: 'MFGPN',
        placeholderName: 'MFG PN',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getComponentMfg
      };
      vm.autoCompleteMFG = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'MFG',
        placeholderName: 'MFG',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getComponent
      };
      vm.autoCompletePackage = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
        keyColumnId: null,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.packaging_type
        },
        inputName: 'Packaging',
        placeholderName: 'Packaging',
        isRequired: false,
        isAddnew: true,
        callbackFn: getpackaging
      };
    };
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
      if (vm.isEdit && vm.autoCompleteMFG && !vm.autoCompleteMFG.keyColumnId) {
        if (vm.autoCompleteMFG && vm.mfgCodeDetail) {
          vm.autoCompleteMFG.keyColumnId = vm.pricingDet.mfgCodeID;
        }
      }
      if (vm.isEdit && vm.autoCompletePackage && !vm.autoCompletePackage.keyColumnId) {
        if (vm.autoCompletePackage && vm.packagingAll) {
          vm.autoCompletePackage.keyColumnId = vm.pricingDet.packageID;
        }
      }
      if (vm.isEdit && vm.autoCompletedistCode && !vm.autoCompletedistCode.keyColumnId) {
        if (vm.autoCompletedistCode && vm.mfgCodeDetail) {
          vm.autoCompletedistCode.keyColumnId = vm.pricingDet.SupplierID;
        }
      }
      if (vm.isEdit && vm.autoCompletepartNumber && !vm.autoCompletepartNumber.keyColumnId) {
        if (vm.autoCompletepartNumber && vm.partNumberList) {
          vm.autoCompletepartNumber.keyColumnId = vm.pricingDet.PartNumberId;
        }
      }
    });
    let isopen = false;

    vm.extPrice = (item, isext) => {
      if (isopen) {
        return;
      }
      if (item.price == 0) {
        item.price = null;
      }
      if (item && item.qty) {
        vm.setInvalidForm();
        if (!vm.iscustomComponent && (_.filter(vm.qtyBreakList, (qbreak) => qbreak.qty == item.qty)).length > 1) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QTY_ALREADY_EXIST);
          messageContent.message = stringFormat(messageContent.message, item.qty);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            item.qty = null;
          });
          return;
        }
        item.invalidleadTime = false;
        if (vm.iscustomComponent && (item.ext || item.price) && (_.filter(vm.qtyBreakList, (qbreak) => qbreak.qty == item.qty && qbreak.leadTime == item.leadTime)).length > 1) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QTY_ALREADY_EXIST_WITH_LEADTIME);
          messageContent.message = stringFormat(messageContent.message, item.qty);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          item.invalidleadTime = true;
          isopen = true;
          DialogFactory.messageAlertDialog(model, callback);
          return;
        }
        else if ((item.ext && !item.price) || (item.ext && isext)) {
          if (typeof item.ext === 'string' && item.ext.charAt(0) === '.') {
            item.ext = stringFormat('0{0}', item.ext);
          }
          if (parseFloat(item.ext) > parseFloat(RFQTRANSACTION.EXTMaxValue)) {
            item.ext = RFQTRANSACTION.EXTMaxValue;
          }
          item.price = stringFormat('{0}', parseFloat((item.ext / item.qty)).toFixed(_unitPriceFilterDecimal));
          item.ext = parseFloat(item.ext).toFixed(_amountFilterDecimal);
        }
        if (item.price) {
          if (typeof item.price === 'string' && item.price.charAt(0) === '.') {
            item.price = stringFormat('0{0}', item.price);
          }
          if (parseFloat(item.price) > parseFloat(RFQTRANSACTION.UnitMaxValue)) {
            item.price = RFQTRANSACTION.UnitMaxValue;
          }
          item.ext = stringFormat('{0}', parseFloat((item.qty * item.price)).toFixed(_amountFilterDecimal));
          item.price = parseFloat(item.price).toFixed(_unitPriceFilterDecimal);
        }
        else {
          item.ext = '';
        }
        if (item.leadTime) {
          if (typeof item.leadTime === 'string' && item.leadTime.charAt(0) === '.') {
            item.leadTime = stringFormat('0{0}', item.leadTime);
          }
        }
        if (!vm.checkDetails()) {
          vm.addnewRecord();
        }
      }
      vm.invalid = false;
      checkValidationMessage();
    };
    function callback() {
      isopen = false;
      _.each(vm.qtyBreakList, (item, index) => {
        if (item.invalidunit) {
          item.price = null;
          item.ext = null;
          const objUnit = document.getElementById('unit' + index);
          if (objUnit) {
            objUnit.focus();
          }
        }
        else if (item.invalidext) {
          item.price = null;
          item.ext = null;
          const objExt = document.getElementById('ext' + index);
          if (objExt) {
            objExt.focus();
          }
        }
        else if (item.invalidleadTime) {
          item.leadTime = null;
          const objExt = document.getElementById('leadtime' + index);
          if (objExt) {
            objExt.focus();
          }
        }
      });
    }


    // check detail fill or not
    vm.checkAddDetails = () => {
      var list = _.filter(vm.qtyBreakList, (item) => { return (item.qty && !item.ext) || (!item.qty && item.ext) });
      if (list.length > 0) {
        return true;
      }
      else {
        list = _.filter(vm.qtyBreakList, (item) => { return !item.qty && !item.ext });
        return list.length > 1 ? true : false;
      }
    };

    // check detail fill or not
    vm.checkDetails = () => _.find(vm.qtyBreakList, (item) => !item.qty || !item.price);
    //add new record
    vm.addnewRecord = () => {
      if (vm.qtyBreakList.length === 1) {
        vm.qtyBreakList[0].isDisable = false;
      }
      const obj = {
        qty: null,
        price: null,
        ext: null,
        isDisable: false
      };
      vm.qtyBreakList.push(obj);
    };
    //remove record
    vm.removeRow = (item) => {
      var index = vm.qtyBreakList.indexOf(item);
      if (vm.qtyBreakList.length > 1) {
        vm.qtyBreakList.splice(index, 1);
        if (vm.qtyBreakList.length === 1) {
          vm.qtyBreakList[0].isDisable = true;
        }
        else {
          _.each(vm.qtyBreakList, (remove) => {
            remove.isDisable = false;
          });
        }
        vm.setInvalidForm();
      }
      vm.invalid = false;
    };
    //save manual price for selected part number
    vm.saveManualPrice = () => {
      if (vm.manualpriceform.$invalid || vm.checkAddDetails()) { return false;}
      if (BaseService.focusRequiredField(vm.manualpriceform)) {
        return;
      }
      if (vm.manualpriceform.$invalid || vm.checkAddDetails()) {
        BaseService.focusRequiredField(vm.manualpriceform);
        return;
      }
      else if ((_.filter(vm.qtyBreakList, (breakPrice) => { return breakPrice.qty && breakPrice.price })).length == 0) {
        return;
      }
      if (vm.iscustomComponent) {
        const autocompletePromise = [getnonQuoteQtyItems()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          if (responses) {
            vm.pricingsetting = responses[0].priceSetting;
            saveUpdate();
          }
        });
      }
      else {
        saveUpdate();
      }
    };
    //call update method
    const saveUpdate = () => {
      if (vm.parentLineData && vm.parentLineData._id) {
        updatePrice();
      }
      else {
        savePrice();
      }
    };
    //save manual price create time
    function savePrice() {
      var pkg = _.find(vm.packagingAll, (packg) => { return packg.id == vm.autoCompletePackage.keyColumnId });
      vm.qtyBreakList = _.filter(vm.qtyBreakList, (breakPrice) => { return breakPrice.qty && breakPrice.price });
      if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
        vm.parentData.uomID = RFQTRANSACTION.DEFAULT_ID.PINUOM; //pin uom default
      }
      const bomUom = _.find(vm.UnitList, (uom) => uom.id == vm.parentData.uomID);
      const compUom = _.find(vm.UnitList, (uom) => uom.id == vm.pricing.uom);
      let stock = vm.pricing.CurrentStockQty;
      if (bomUom && compUom) {
        stock = stock * (vm.pricing.packageQty ? vm.pricing.packageQty : 1);
        const fromBasedUnitValues = (compUom.baseUnitConvertValue);
        const toBasedUnitValues = bomUom.baseUnitConvertValue;
        const ConvertFromValueIntoBasedValue = (stock / fromBasedUnitValues);
        stock = ConvertFromValueIntoBasedValue * toBasedUnitValues;
      }
      if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
        stock = stock * (vm.pricing.noOfPosition);
      }
      const pricingObject = {
        ConsolidateID: vm.parentData.id,
        MinimumBuy: vm.pricing.MinimumBuy,
        Active: true,
        PartNumberId: vm.autoCompletepartNumber.keyColumnId,
        ProductUrl: null,
        SupplierPN: null,
        Packaging: pkg ? pkg.name : null,
        SourceOfPrice: RFQTRANSACTION.PART_COSTING.Manual,
        Authorized_Reseller: true,
        ManufacturerPartNumber: vm.pricing.mfgPN,
        APILeadTime: vm.pricing.LeadTime,
        Multiplier: vm.pricing.Multiplier,
        ManufacturerName: vm.pricing.ManufacturerName,
        SupplierName: vm.suppliername,
        PurchaseUom: compUom ? compUom.abbreviation : null,
        OrgInStock: vm.pricing.CurrentStockQty,
        NCNR: vm.autoCompleteNcNR.keyColumnId,
        RoHS: vm.pricing.RoHS,
        rohsIcon: vm.pricing.roIcon,
        MountingTypeID: vm.pricing.mountingtypeID,
        FunctionalTypeID: vm.pricing.functionalCategoryID,
        MountingType: vm.pricing.mountingtypeName,
        FunctionalType: vm.pricing.functionalCategoryName,
        Reeling: vm.autoCompleteReeling.keyColumnId,
        CurrencyName: RFQTRANSACTION.PART_COSTING.USD,
        PartStatus: vm.pricing.Status,
        LTBDate: null,
        IsDeleted: false,
        PIDCode: vm.pricing.PIDCode,
        PriceType: 'Standard',
        rfqAssyID: vm.parentData.rfqAssyID,
        ApiNoOfPosition: vm.pricing.noOfPosition,
        NoOfPosition: vm.parentData.numOfPosition,
        noOfRows: vm.pricing.noOfRows,
        partPackage: vm.pricing.package,
        isPackaging: vm.pricing.isPackaging ? true : false,
        mfgPNDescription: vm.pricing.MfgDescription,
        mfgCodeID: vm.autoCompleteMFG.keyColumnId,
        packageID: vm.autoCompletePackage.keyColumnId,
        SupplierID: vm.autoCompletedistCode.keyColumnId,
        OtherStock: stock,
        PartAbbrivation: compUom ? compUom.abbreviation : null,
        BOMAbbrivation: bomUom ? bomUom.abbreviation : null,
        packageQty: vm.pricing.packageQty,
        PackageSPQQty: vm.pricing.PackageSPQQty,
        bomUnitID: vm.parentData.uomID,
        componentUnitID: vm.pricing.uom,
        qpa: vm.parentData.qpa ? vm.parentData.qpa : 0,
        connectorTypeID: vm.pricing.connecterTypeID,
        AuthorizeSupplier: vm.authorizeType,
        isPurchaseApi: false,
        AdditionalValueFee: vm.pricing.additionalValueFee ? vm.pricing.additionalValueFee : 0,
        isCustom: vm.iscustomComponent,
        custAssyPN: vm.pricing.custAssyPN
      };
      const priceBreakList = [];
      const assyPrice = [];
      _.each(vm.qtyBreakList, (priceBreaks) => {
        if (priceBreaks.qty && priceBreaks.price) {
          const breakprice = {
            componentID: vm.autoCompletepartNumber.keyColumnId,
            mfgPN: vm.pricing.mfgPN,
            supplier: vm.suppliername,
            price: parseFloat(priceBreaks.price),
            qty: parseInt(priceBreaks.qty),
            Packaging: pkg ? pkg.name : null,
            leadTime: priceBreaks.leadTime ? parseFloat(priceBreaks.leadTime) : 0,
            isCustomPrice: false,
            Type: RFQTRANSACTION.PART_COSTING.Manual,
            packagingID: pkg ? pkg.id : null,
            supplierPN: null,
            supplierID: vm.autoCompletedistCode.keyColumnId
          };
          priceBreakList.push(breakprice);
        }
      });
      _.each(vm.parentData.quantityTotals, (assyQty) => {
        var price;
        var unitPrice;
        var leadTime;
        var requestQty = assyQty.requestQty * (vm.parentData.qpa ? vm.parentData.qpa : 0);
        if (bomUom && compUom) { //changed code for each

          var fromBasedUnitValues = (bomUom.baseUnitConvertValue) * (vm.pricing.packageQty ? vm.pricing.packageQty : 1);
          var toBasedUnitValues = compUom.baseUnitConvertValue;
          var ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
          requestQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
        }
        if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
          vm.parentData.numOfPosition = vm.parentData.numOfPosition ? vm.parentData.numOfPosition : 1;
          requestQty = requestQty * (vm.parentData.numOfPosition);
          var noOfPositionDiff = parseFloat((vm.pricing.noOfPosition) - ((vm.pricing.noOfPosition) % (vm.parentData.numOfPosition)));
          if (noOfPositionDiff == 0) {
            return;
          }
          requestQty = requestQty / noOfPositionDiff;
        }
        var ordQty = Math.max((Math.ceil((requestQty) / vm.pricing.Multiplier) * vm.pricing.Multiplier), vm.pricing.MinimumBuy);
        var ActualQty = ordQty;
        var ActualPrice = 0;
        let priceBreakDetail;
        if (vm.iscustomComponent) {
          let settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
          let setting = _.find(vm.pricingsetting, (set) => { return set.requestQty == assyQty.requestQty && set.settingType == settingType });
          if (setting && setting.isLeadTime) {
            let consolidateList = _.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty == ordQty && consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1) });
            if (consolidateList.length == 0) {
              let pricelst = _.orderBy(_.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty < ordQty && consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1) }), ["qty", "price"], ["ASC", "ASC"]);
              if (pricelst.length > 0) {
                priceBreakDetail = pricelst[pricelst.length - 1];
              }
              else {
                pricelst = _.orderBy(_.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty < ordQty }), ["qty", "price"], ["ASC", "ASC"]);
                if (pricelst.length > 0) {
                  priceBreakDetail = pricelst[pricelst.length - 1];
                } else {
                  priceBreakDetail = _.orderBy(vm.qtyBreakList, ["qty", "price"], ["ASC", "ASC"])[0];
                }
              }
            } else {
              priceBreakDetail = _.minBy(consolidateList, 'price');
            }
          }
          else {
            let consolidateList = _.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty == ordQty });
            if (consolidateList.length == 0) {
              let pricelst = _.orderBy(_.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty < ordQty }), ["qty", "price"], ["ASC", "ASC"]);
              if (pricelst.length > 0) {
                priceBreakDetail = pricelst[pricelst.length - 1];
              } else {
                priceBreakDetail = _.orderBy(vm.qtyBreakList, ["qty", "price"], ["ASC", "ASC"])[0];
              }

            } else {
              priceBreakDetail = _.minBy(consolidateList, 'price');
            }
          }
        } else {
          priceBreakDetail = _.find(vm.qtyBreakList, (qtyBreak) => { return qtyBreak.qty == ordQty });
        }
        if (priceBreakDetail) {
          unitPrice = parseFloat(priceBreakDetail.price);
          price = parseFloat((priceBreakDetail.price * ordQty).toFixed(_unitPriceFilterDecimal));
          leadTime = priceBreakDetail.leadTime ? parseFloat(priceBreakDetail.leadTime) : 0;
        }
        else {
          let priceList = _.sortBy(_.filter(vm.qtyBreakList, (qtyBreak) => qtyBreak.qty < ordQty), (o) => o.qty);
          if (priceList.length === 0) {
            priceList = _.sortBy(vm.qtyBreakList, (qtyBreak) => qtyBreak.qty);
          }
          unitPrice = parseFloat(priceList[priceList.length - 1].price);
          price = parseFloat((priceList[priceList.length - 1].price * ordQty).toFixed(_unitPriceFilterDecimal));
          leadTime = parseFloat(priceList[priceList.length - 1].leadTime);
        }
        ActualPrice = unitPrice;
        if (compUom && bomUom) {
          unitPrice = (unitPrice * (compUom.baseUnitConvertValue ? compUom.baseUnitConvertValue : 1)) / ((vm.pricing.packageQty ? vm.pricing.packageQty : 1) * (bomUom.baseUnitConvertValue ? bomUom.baseUnitConvertValue : 1));
          const toBasedUnitValues = (bomUom.baseUnitConvertValue) * (vm.pricing.packageQty ? vm.pricing.packageQty : 1);
          const fromBasedUnitValues = compUom.baseUnitConvertValue;
          const ConvertFromValueIntoBasedValue = (ordQty / fromBasedUnitValues);
          ordQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
          //require quantity for price
          // ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
          requestQty = parseInt(assyQty.requestQty * (vm.parentData.qpa ? vm.parentData.qpa : 0));
        }
        if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
          ordQty = ordQty * (vm.pricing.noOfPosition);
          unitPrice = unitPrice / (vm.pricing.noOfPosition);
          requestQty = requestQty * (vm.parentData.numOfPosition);
        }
        if (pricingObject.AdditionalValueFee) {
          //Add value for additional value
          const additionalValue = parseFloat(pricingObject.AdditionalValueFee) / parseInt(ordQty);
          unitPrice = unitPrice + additionalValue;
          ActualPrice = ActualPrice + additionalValue;
        }
        const assyQtyObj = {
          RfqAssyQtyId: assyQty.qtyID,
          isDeleted: false,
          ConsolidateID: vm.parentData.id,
          CurrentQty: assyQty.requestQty,
          OrderQty: parseInt(ordQty),
          leadTime: leadTime,
          PricePerPart: unitPrice,
          TotalDollar: parseFloat((parseFloat(unitPrice) * parseFloat(ordQty)).toFixed(6)),
          RequireQty: requestQty,
          ActualPrice: ActualPrice,
          ActualQty: ActualQty
        };
        assyPrice.push(assyQtyObj);
      });
      const manualPriceObj = {
        pricingObject: pricingObject,
        priceBreakList: priceBreakList,
        assyPrice: assyPrice
      };
      vm.cgBusyLoading = PartCostingFactory.saveManualPrice().query({ objManualPrice: manualPriceObj }).$promise.then((manualprice) => {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(manualprice);
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //save updated price
    function updatePrice() {
      var pkg = _.find(vm.packagingAll, (packg) => packg.id == vm.autoCompletePackage.keyColumnId);
      if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
        vm.parentData.uomID = RFQTRANSACTION.DEFAULT_ID.PINUOM; //pin uom default
      }
      const bomUom = _.find(vm.UnitList, (uom) => uom.id == vm.parentData.uomID);
      const compUom = _.find(vm.UnitList, (uom) => uom.id == vm.pricing.uom);
      let stock = vm.pricing.CurrentStockQty;
      if (bomUom && compUom) {
        stock = stock * (vm.pricing.packageQty ? vm.pricing.packageQty : 1);
        const fromBasedUnitValues = (compUom.baseUnitConvertValue);
        const toBasedUnitValues = bomUom.baseUnitConvertValue;
        const ConvertFromValueIntoBasedValue = (stock / fromBasedUnitValues);
        stock = ConvertFromValueIntoBasedValue * toBasedUnitValues;
      }
      if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
        stock = stock * (vm.pricing.noOfPosition);
      }
      const pricingObject = {
        ConsolidateID: vm.parentData.id,
        MinimumBuy: vm.pricing.MinimumBuy,
        Active: true,
        PartNumberId: vm.autoCompletepartNumber.keyColumnId,
        SupplierPN: null,
        SourceOfPrice: RFQTRANSACTION.PART_COSTING.Manual,
        Packaging: pkg ? pkg.name : null,
        Authorized_Reseller: true,
        ManufacturerPartNumber: vm.pricing.mfgPN,
        APILeadTime: vm.pricing.LeadTime,
        Multiplier: vm.pricing.Multiplier,
        ProductUrl: vm.pricing.ProductUrl,
        ManufacturerName: vm.pricing.ManufacturerName,
        SupplierName: vm.suppliername,
        PurchaseUom: compUom ? compUom.abbreviation : null,
        OrgInStock: vm.pricing.CurrentStockQty,
        NCNR: vm.autoCompleteNcNR.keyColumnId,
        RoHS: vm.pricing.RoHS,
        rohsIcon: vm.pricing.roIcon,
        MountingTypeID: vm.pricing.mountingtypeID,
        FunctionalTypeID: vm.pricing.functionalCategoryID,
        MountingType: vm.pricing.mountingtypeName,
        FunctionalType: vm.pricing.functionalCategoryName,
        Reeling: vm.autoCompleteReeling.keyColumnId,
        CurrencyName: RFQTRANSACTION.PART_COSTING.USD,
        PartStatus: vm.pricing.Status,
        LTBDate: null,
        IsDeleted: false,
        PIDCode: vm.pricing.PIDCode,
        PriceType: 'Standard',
        rfqAssyID: vm.parentData.rfqAssyID,
        ApiNoOfPosition: vm.pricing.noOfPosition,
        NoOfPosition: vm.parentData.numOfPosition,
        noOfRows: vm.pricing.noOfRows,
        partPackage: vm.pricing.package,
        isPackaging: vm.pricing.isPackaging ? true : false,
        mfgPNDescription: vm.pricing.MfgDescription,
        mfgCodeID: vm.autoCompleteMFG.keyColumnId,
        packageID: vm.autoCompletePackage.keyColumnId,
        _id: vm.parentLineData._id,
        SupplierID: vm.autoCompletedistCode.keyColumnId,
        OtherStock: stock,
        PartAbbrivation: compUom ? compUom.abbreviation : null,
        BOMAbbrivation: bomUom ? bomUom.abbreviation : null,
        packageQty: vm.pricing.packageQty,
        PackageSPQQty: vm.pricing.PackageSPQQty,
        bomUnitID: vm.parentData.uomID,
        componentUnitID: vm.pricing.uom,
        qpa: vm.parentData.qpa ? vm.parentData.qpa : 0,
        connectorTypeID: vm.pricing.connecterTypeID,
        AuthorizeSupplier: vm.authorizeType,
        isPurchaseApi: false,
        AdditionalValueFee: vm.pricing.additionalValueFee ? vm.pricing.additionalValueFee : 0,
        isCustom: vm.iscustomComponent,
        custAssyPN: vm.pricing.custAssyPN
      };
      const priceBreakList = [];
      const assyPrice = [];
      vm.qtyBreakList = _.filter(vm.qtyBreakList, (breakPrice) => breakPrice.qty && breakPrice.price);
      _.each(vm.qtyBreakList, (priceBreaks) => {
        if (priceBreaks.qty && priceBreaks.price) {
          const breakprice = {
            componentID: vm.autoCompletepartNumber.keyColumnId,
            mfgPN: vm.pricing.mfgPN,
            supplier: vm.suppliername,
            price: parseFloat(priceBreaks.price),
            qty: parseInt(priceBreaks.qty),
            Packaging: pkg ? pkg.name : null,
            isCustomPrice: false,
            leadTime: priceBreaks.leadTime ? parseFloat(priceBreaks.leadTime) : 0,
            Type: RFQTRANSACTION.PART_COSTING.Manual,
            _id: priceBreaks._id,
            qtySupplierID: vm.parentLineData._id,
            packagingID: pkg ? pkg.id : null,
            supplierPN: null,
            supplierID: vm.autoCompletedistCode.keyColumnId
          };
          priceBreakList.push(breakprice);
        }
      });
      _.each(vm.parentData.quantityTotals, (assyQty) => {
        var unitPrice;
        var leadTime;
        var price;
        var requestQty = assyQty.requestQty * (vm.parentData.qpa ? vm.parentData.qpa : 0);
        if (bomUom && compUom) { //change code for each

          const fromBasedUnitValues = (bomUom.baseUnitConvertValue) * (vm.pricing.packageQty ? vm.pricing.packageQty : 1);
          const toBasedUnitValues = compUom.baseUnitConvertValue;
          const ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
          requestQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
        }
        if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
          vm.parentData.numOfPosition = vm.parentData.numOfPosition ? vm.parentData.numOfPosition : 1;
          requestQty = requestQty * (vm.parentData.numOfPosition);
          const noOfPositionDiff = parseFloat((vm.pricing.noOfPosition) - ((vm.pricing.noOfPosition) % (vm.parentData.numOfPosition)));
          if (noOfPositionDiff == 0) {
            return;
          }
          requestQty = requestQty / noOfPositionDiff;
        }
        var ordQty = Math.max((Math.ceil((requestQty) / vm.pricing.Multiplier) * vm.pricing.Multiplier), vm.pricing.MinimumBuy);
        var ActualQty = ordQty;
        let priceBreakDetail;
        if (vm.iscustomComponent) {
          let settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
          let setting = _.find(vm.pricingsetting, (set) => { return set.requestQty == assyQty.requestQty && set.settingType == settingType });
          if (setting && setting.isLeadTime) {
            let consolidateList = _.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty == ordQty });
            if (consolidateList.length == 0) {
              let pricelst = _.orderBy(_.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty < ordQty && consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1) }), ["qty", "price"], ["ASC", "ASC"]);
              if (pricelst.length > 0) {
                priceBreakDetail = pricelst[pricelst.length - 1];
              }
              else {
                pricelst = _.orderBy(_.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty < ordQty }), ["qty", "price"], ["ASC", "ASC"]);
                if (pricelst.length > 0) {
                  priceBreakDetail = pricelst[pricelst.length - 1];
                } else {
                  priceBreakDetail = _.orderBy(vm.qtyBreakList, ["qty", "price"], ["ASC", "ASC"])[0];
                }
              }
            } else {
              let actualConsolidateList = angular.copy(consolidateList);
              consolidateList = _.filter(consolidateList, (consolidate) => { return consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1) });
              if (consolidateList.length == 0) {
                consolidateList = actualConsolidateList;
              }
              priceBreakDetail = _.minBy(consolidateList, 'price');
            }
          }
          else {
            let consolidateList = _.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty == ordQty });
            if (consolidateList.length == 0) {
              let pricelst = _.orderBy(_.filter(vm.qtyBreakList, (consolidate) => { return consolidate.qty < ordQty }), ["qty", "price"], ["ASC", "ASC"]);
              if (pricelst.length > 0) {
                priceBreakDetail = pricelst[pricelst.length - 1];
              } else {
                priceBreakDetail = _.orderBy(vm.qtyBreakList, ["qty", "price"], ["ASC", "ASC"])[0];
              }
            } else {
              priceBreakDetail = _.minBy(consolidateList, 'price');
            }
          }
        } else {
          priceBreakDetail = _.find(vm.qtyBreakList, (qtyBreak) => { return qtyBreak.qty == ordQty });
        }
        if (priceBreakDetail) {
          unitPrice = parseFloat(priceBreakDetail.price);
          price = parseFloat((priceBreakDetail.price * ordQty).toFixed(_unitPriceFilterDecimal));
          leadTime = priceBreakDetail.leadTime ? parseFloat(priceBreakDetail.leadTime) : 0;
        }
        else {
          let priceList = _.sortBy(_.filter(vm.qtyBreakList, (qtyBreak) => qtyBreak.qty < ordQty), (o) => o.qty);
          if (priceList.length === 0) {
            priceList = _.sortBy(vm.qtyBreakList, (qtyBreak) => qtyBreak.qty);
          }
          unitPrice = parseFloat(priceList[priceList.length - 1].price);
          price = parseFloat((priceList[priceList.length - 1].price * ordQty).toFixed(_unitPriceFilterDecimal));
          leadTime = parseFloat(priceList[priceList.length - 1].leadTime);
        }
        var ActualPrice = unitPrice;
        var objPrice = _.find(vm.parentLineData.assemblyQtyBreak, (pbreak) => { return pbreak.RfqAssyQtyId == assyQty.qtyID });
        if (compUom && bomUom) {
          unitPrice = (unitPrice * (compUom.baseUnitConvertValue ? compUom.baseUnitConvertValue : 1)) / ((vm.pricing.packageQty ? vm.pricing.packageQty : 1) * (bomUom.baseUnitConvertValue ? bomUom.baseUnitConvertValue : 1));
          var toBasedUnitValues = (bomUom.baseUnitConvertValue) * (vm.pricing.packageQty ? vm.pricing.packageQty : 1);
          var fromBasedUnitValues = compUom.baseUnitConvertValue;
          var ConvertFromValueIntoBasedValue = (ordQty / fromBasedUnitValues);
          ordQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) == 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
          requestQty = parseInt(assyQty.requestQty * (vm.parentData.qpa ? vm.parentData.qpa : 0));
        }
        if (vm.pricing.noOfPosition && vm.pricing.connecterTypeID == RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
          ordQty = ordQty * (vm.pricing.noOfPosition);
          unitPrice = unitPrice / (vm.pricing.noOfPosition);
          requestQty = requestQty * (vm.parentData.numOfPosition);
        }
        if (pricingObject.AdditionalValueFee) {
          //Add value for additional value
          const additionalValue = parseFloat(pricingObject.AdditionalValueFee) / parseInt(ordQty);
          unitPrice = unitPrice + additionalValue;
          ActualPrice = ActualPrice + additionalValue;
        }
        const assyQtyObj = {
          RfqAssyQtyId: assyQty.qtyID,
          isDeleted: false,
          ConsolidateID: vm.parentData.id,
          CurrentQty: assyQty.requestQty,
          OrderQty: parseInt(ordQty),
          PricePerPart: unitPrice,
          leadTime: leadTime,
          TotalDollar: parseFloat((parseFloat(unitPrice) * parseFloat(ordQty)).toFixed(_unitPriceFilterDecimal)),
          _id: objPrice ? objPrice._id : null,
          qtySupplierID: vm.parentLineData._id,
          RequireQty: requestQty,
          ActualPrice: ActualPrice,
          ActualQty: ActualQty
        };
        assyPrice.push(assyQtyObj);
      });
      const manualPriceObj = {
        pricingObject: pricingObject,
        priceBreakList: priceBreakList,
        assyPrice: assyPrice
      };
      vm.cgBusyLoading = PartCostingFactory.updateManualPrice().query({ objManualPrice: manualPriceObj }).$promise.then((manualprice) => {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(manualprice);
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //let
    //link to go supplier list page
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //link to go for manufacturer master list page
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };
    //link to go for mounting type list
    vm.goToMountingList = () => {
      BaseService.goToMountingTypeList();
    };
    //link to go for functional type list
    vm.goToFunctionalList = () => {
      BaseService.goToFunctionalTypeList();
    };
    //get image url for component
    vm.displayCurrentImage = () => {
      if (!vm.pricing.imageURL) {
        return CORE.NO_IMAGE_COMPONENT;
      }
      else if (!vm.pricing.imageURL.startsWith('http://') && !vm.pricing.imageURL.startsWith('https://')) {
        return BaseService.getPartMasterImageURL(vm.pricing.documentPath, vm.pricing.imageURL);
      }
      else {
        return vm.pricing.imageURL;
      }
    };

    // go to packaging type list
    vm.goToPackagingList = () => {
      BaseService.goToPackaging();
    };

    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.MFG.PID,
        value: vm.pricing.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.pricing.rohsIcon,
          imgDetail: vm.pricing.RoHS
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.pricing.mfgPN
      }, {
        label: vm.LabelConstant.PartAttribute.MountingType,
        value: vm.pricing.mountingtypeName,
        displayOrder: 1,
        labelLinkFn: vm.goToMountingList,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.LabelConstant.PartAttribute.FunctionalType,
        value: vm.pricing.functionalCategoryName,
        displayOrder: 1,
        labelLinkFn: vm.goToFunctionalList,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      },
        {
          label: vm.LabelConstant.PartAttribute.Package,
          value: vm.pricing.package,
          displayOrder: 1,
          labelLinkFn: null,
          valueLinkFn: null,
          valueLinkFnParams: null,
          isCopy: false,
          copyParams: null,
          imgParms: null
        }, {
        label: vm.LabelConstant.PartAttribute.Unit,
        value: stringFormat('{0} {1}', vm.pricing.packageQty, vm.pricing.unitName),
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      });
    }
    vm.setInvalidForm = () => {
      vm.manualpriceform.$dirty = true;
      vm.manualpriceform.min.$dirty = true;
    };


    //get not quoted line items and price settings
    function getnonQuoteQtyItems() {
      return PartCostingFactory.getnonQuotedQty().query({ rfqAssyID: vm.parentData.rfqAssyID, isPurchaseApi: false }).$promise.then((list) => {
        if (list && list.data) {
          return list.data;
        }
        return list.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.manualpriceform);
    });
  }
})();

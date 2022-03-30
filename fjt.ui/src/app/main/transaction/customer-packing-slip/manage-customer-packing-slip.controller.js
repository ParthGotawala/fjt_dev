(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('ManageCustomerPackingSlipController', ManageCustomerPackingSlipController);

  /** @ngInject */
  function ManageCustomerPackingSlipController($scope, $filter, $q, TRANSACTION, $state, DialogFactory, CustomerFactory, $stateParams, USER, CORE, GenericCategoryFactory, BaseService, CustomerPackingSlipFactory, ManageMFGCodePopupFactory, $timeout, MasterFactory, FOBFactory, WorkorderFactory, EmployeeFactory, ComponentFactory, SalesOrderFactory, ReceivingMaterialFactory, WorkorderTransactionUMIDFactory, SupplierInvoiceFactory) {
    const vm = this;
    vm.todayDate = new Date();
    vm.LabelConstant = CORE.LabelConstant;
    vm.custPackingSlipID = parseInt($stateParams.id);
    vm.salesOrderID = parseInt($stateParams.sdetid);
    vm.soDetId = $state.params.sodid ? parseInt($state.params.sodid) : null;
    vm.soReleaseId = $state.params.sorelid ? parseInt($state.params.sorelid) : null;
    vm.lineMaterialType = $state.params.lType ? parseInt($state.params.lType) : null;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.ReceivingMatirialTab = CORE.ReceivingMatirialTab;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.packingSlipDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.poDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.soDate] = false;
    const maxAddressLength = CORE.maxAddressLength;
    vm.categoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.customerPackingSlipType = angular.copy(CORE.CUSTOMER_PACKING_SLIP_TYPE);
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DefaultDateTimeFormat = _dateTimeFullTimeDisplayFormat;
    vm.loginUser = BaseService.loginUser;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.shippedStatus = CORE.CustomerPackingSlipSubStatusID.Shipped;
    vm.BlanketPOOptions = TRANSACTION.BLANKETPOOPTIONDET;
    vm.customerslip = {
      packingSlipType: vm.customerPackingSlipType[0].id,
      subStatus: CORE.CustomerPackingSlipSubStatusID.Draft,
      status: CORE.CustomerPackingSlipStatusID.Draft,
      packingSlipDate: vm.todayDate,
      customerPackingSlipTrackNumber: []
    };
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.setfocus = true;
    vm.packingSlipType = vm.customerPackingSlipType[0].id;
    vm.partCategoryConst = angular.copy(CORE.PartCategory);
    vm.isViewAssembly = true;
    vm.CustomerPackingSlipStatusIDConst = CORE.CustomerPackingSlipStatusID;
    vm.CustomerPackingSlipDetGridQtyCount = {
      shipmentQtyCount: 0,
      totalExtendedPrice: 0
    };
    vm.customerPackingSlipShipping = {
      materialType: true
    };
    vm.selectedMaterialType = true;
    vm.EmptyMesssageUMID = TRANSACTION.TRANSACTION_EMPTYSTATE.RECEIVINGMATERIAL;
    vm.showUnitPriceField = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToAddUnitPriceAtCustomerPackingSlip);
    vm.salesCommissionFrom = TRANSACTION.SalesCommissionFrom;
    vm.isStatusChange = false;
    vm.isPOPackingSlip = (vm.packingSlipType === vm.customerPackingSlipType[0].id) ? true : false;
    vm.checkCopyStatus = () => { vm.copystatus = false; };
    vm.copyTrackinNumber = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };
    vm.viewWOProfile = true; //to  view detail record
    vm.recordView = false;
    vm.salesShipping = {};
    vm.otherChargeTypeList = TRANSACTION.OtherChargeTypeList;
    vm.otherChargeType = TRANSACTION.OtherChargeType;
    vm.moveToNextOtherChgType = true;
    vm.selectedOtherCharges = (vm.packingSlipType === vm.customerPackingSlipType[0].id) ? vm.otherChargeType.PO : null;
    vm.billToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.shipToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);

    vm.billToContactActionBtn = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.shipToContactActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToContactActionBtn = angular.copy(CORE.ContactPersonViewActionBtn);

    vm.custPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.custPersonViewActionBtnDet.Delete.isVisible = false;

    vm.billToActionBtn.SetDefault.isVisible = false;
    vm.shipToActionBtn.SetDefault.isVisible = false;
    vm.intermediateToActionBtn.SetDefault.isVisible = false;


    //vm.columnMPN = 'mfgPN';
    //vm.columnMPNwithLine = 'mfgPnwihLineId';
    // enable disable address action button
    const disableAddrActionButton = (disableFlag) => {
      vm.billToActionBtn.AddNew.isDisable = disableFlag;
      vm.billToActionBtn.Update.isDisable = disableFlag;
      vm.billToActionBtn.Delete.isDisable = disableFlag;
      vm.billToActionBtn.ApplyNew.isDisable = disableFlag;

      vm.shipToActionBtn.AddNew.isDisable = disableFlag;
      vm.shipToActionBtn.Update.isDisable = disableFlag;
      vm.shipToActionBtn.Delete.isDisable = disableFlag;
      vm.shipToActionBtn.ApplyNew.isDisable = disableFlag;

      vm.intermediateToActionBtn.AddNew.isDisable = disableFlag;
      vm.intermediateToActionBtn.Update.isDisable = disableFlag;
      vm.intermediateToActionBtn.Delete.isDisable = disableFlag;
      vm.intermediateToActionBtn.ApplyNew.isDisable = disableFlag;

      vm.billToContactActionBtn.AddNew.isDisable = disableFlag;
      vm.billToContactActionBtn.Update.isDisable = disableFlag;
      vm.billToContactActionBtn.Delete.isDisable = disableFlag;
      vm.billToContactActionBtn.ApplyNew.isDisable = disableFlag;

      vm.shipToContactActionBtn.AddNew.isDisable = disableFlag;
      vm.shipToContactActionBtn.Update.isDisable = disableFlag;
      vm.shipToContactActionBtn.Delete.isDisable = disableFlag;
      vm.shipToContactActionBtn.ApplyNew.isDisable = disableFlag;

      vm.intermediateToContactActionBtn.AddNew.isDisable = disableFlag;
      vm.intermediateToContactActionBtn.Update.isDisable = disableFlag;
      vm.intermediateToContactActionBtn.Delete.isDisable = disableFlag;
      vm.intermediateToContactActionBtn.ApplyNew.isDisable = disableFlag;

      vm.custPersonViewActionBtnDet.AddNew.isDisable = disableFlag;
      vm.custPersonViewActionBtnDet.Update.isDisable = disableFlag;
      vm.custPersonViewActionBtnDet.Delete.isDisable = disableFlag;
      vm.custPersonViewActionBtnDet.ApplyNew.isDisable = disableFlag;
    };

    // set other detail of shipping address
    vm.shipToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.customerslip.customerID,
      addressType: 'S',
      addressBlockTitle: vm.LabelConstant.Address.ShippingAddress,
      companyName: '',
      refTransID: '',
      refTableName: 'mfgcodemst',
      alreadySelectedPersonId: ''
    };

    // set other detail of billing address
    vm.billToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.customerslip.customerID,
      addressType: 'B',
      addressBlockTitle: vm.LabelConstant.Address.BillingAddress,
      companyName: '',
      refTransID: '',
      refTableName: 'mfgcodemst',
      alreadySelectedPersonId: ''
    };

    // set other detail of mark for address
    vm.intermediateToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.customerslip.customerID,
      addressType: CORE.AddressType.IntermediateAddress,
      addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
      companyName: '',
      refTransID: '',
      refTableName: 'mfgcodemst',
      alreadySelectedPersonId: ''
    };

    // set other detail of contact person
    vm.ContactPersonOtherDet = {
      customerId: vm.customerslip.customerID,
      refTransID: vm.customerslip.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: (vm.contactpersondetail && vm.contactpersondetail.personId) || null,
      showContPersonEmptyState: false,
      companyName: vm.companyName,
      selectedContactPerson: vm.contactpersondetail || null,
      mfgType: CORE.MFG_TYPE.CUSTOMER
    };

    vm.isConfirmationOpenAtUMIDList = false;

    // to reset re-set Tracking Number Object
    const resetCustPackingSlipTrackingNumberObj = () => {
      vm.trackingNumberDet = {
        trackNumber: null
      };
      if (vm.frmCustomerPackingSlip && vm.frmCustomerPackingSlip.trackingNumber) {
        vm.frmCustomerPackingSlip.trackingNumber.$setValidity('duplicate', true);
      }
    };
    resetCustPackingSlipTrackingNumberObj();

    // set radio group
    vm.RadioGroup = {
      lineType: {
        array: angular.copy(TRANSACTION.TypeOfUpdateMaterial),
        checkDisable: () => (!vm.custPackingSlipID) || vm.isSlipInStatusNotAllowedToChangeMajorInfo,
        onChange: () => vm.changeMaterialCharge()
      },
      umidType: {
        array: angular.copy(TRANSACTION.ComponentStockType),
        checkDisable: () => (!vm.custPackingSlipID) || vm.isSlipInStatusNotAllowedToChangeMajorInfo || (vm.recordUpdate || false) || vm.recordView,
        onChange: () => vm.changeUMIDStockType()
      },
      otherChargeType: {
        array: angular.copy(TRANSACTION.OtherChargeTypeList),
        checkDisable: () => (!vm.custPackingSlipID) || vm.isSlipInStatusNotAllowedToChangeMajorInfo,
        onChange: () => vm.changeOtherChargesType()
      }
    };

    // check date vallidation
    vm.checkDateValidation = (type) => {
      const poDate = vm.customerslip.poDate ? new Date($filter('date')(vm.customerslip.poDate, vm.DefaultDateFormat)) : vm.frmCustomerPackingSlip.poDate.$viewValue ? new Date($filter('date')(vm.frmCustomerPackingSlip.poDate.$viewValue, vm.DefaultDateFormat)) : null;
      const packingSlipDate = vm.customerslip.packingSlipDate ? new Date($filter('date')(vm.customerslip.packingSlipDate, vm.DefaultDateFormat)) : vm.frmCustomerPackingSlip.packingSlipDate.$viewValue ? new Date($filter('date')(vm.frmCustomerPackingSlip.packingSlipDate.$viewValue, vm.DefaultDateFormat)) : null;
      const soDate = vm.customerslip.soDate ? new Date($filter('date')(vm.customerslip.soDate, vm.DefaultDateFormat)) : vm.frmCustomerPackingSlip.soDate.$viewValue ? new Date($filter('date')(vm.frmCustomerPackingSlip.soDate.$viewValue, vm.DefaultDateFormat)) : null;

      if (vm.frmCustomerPackingSlip) {
        if (vm.frmCustomerPackingSlip.poDate && vm.frmCustomerPackingSlip.soDate && poDate && soDate) {
          if (type === 3 && poDate <= soDate) {
            vm.customerslip.soDate = soDate;
            vm.frmCustomerPackingSlip.soDate.$setValidity('minvalue', true);
          }
          if (type === 2 && poDate <= soDate) {
            vm.customerslip.poDate = poDate;
            vm.frmCustomerPackingSlip.poDate.$setValidity('maxvalue', true);
          }
        }
        if (vm.frmCustomerPackingSlip.packingSlipDate && vm.frmCustomerPackingSlip.soDate && packingSlipDate && soDate) {
          if (type === 2 && soDate <= packingSlipDate) {
            vm.customerslip.packingSlipDate = packingSlipDate;
            vm.frmCustomerPackingSlip.packingSlipDate.$setValidity('minvalue', true);
          }
          if (type === 1 && soDate <= packingSlipDate) {
            vm.customerslip.soDate = soDate;
            vm.frmCustomerPackingSlip.soDate.$setValidity('maxvalue', true);
          }
        }
      }
    };

    const initdateoption = () => {
      vm.poDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        maxDate: vm.customerslip.soDate ? vm.customerslip.soDate : vm.customerslip.packingSlipDate
      };
      vm.soDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        maxDate: vm.customerslip.packingSlipDate,
        minDate: vm.customerslip.poDate
      };
      vm.packingDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        minDate: vm.customerslip.soDate
      };
    };
    initdateoption();

    //selected Salesorder Detail
    const selectSOPONumber = (item) => {
      if (item) {
        if (!parseInt(item.status) && !vm.custPackingSlipID) {
          vm.setfocusSO = false;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGSLIP_SO_STATUS_ALERT);
          messageContent.message = stringFormat(messageContent.message, item['SO#']);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            vm.autoCompletePendingSOPO.keyColumnId = null;
            $scope.$broadcast(vm.autoCompletePendingSOPO.inputName, null);
            vm.setfocusSO = true;
            return;
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (item.isRmaPO && !vm.customerslip.id) {
          vm.setfocusSO = false;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PS_CREATION_FOR_RMA_PO_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, item['PO#']);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
            multiple: true
          };
          DialogFactory.messageConfirmDialog(model).then(() => {
            setSOPODetailAfterConfirmation(item);
          }, () => {
            vm.autoCompletePendingSOPO.keyColumnId = null;
            $scope.$broadcast(vm.autoCompletePendingSOPO.inputName, null);
            vm.setfocusSO = true;
            return;
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          setSOPODetailAfterConfirmation(item);
        }
      } else {
        vm.isSOPublished = false;
        vm.isedit = false;
        vm.isLegacyPO = false;
        vm.isRMAPO = false;
        if (vm.custPackingSlipID) {
          vm.customerslip = {
            packingSlipType: vm.customerslip.packingSlipType,
            subStatus: vm.customerslip.subStatus,
            status: vm.customerslip.status,
            packingSlipDate: vm.todayDate,
            packingSlipNumber: vm.customerslip.packingSlipNumber,
            customerPackingSlipTrackNumber: []
          };
          vm.packingSlipType = vm.customerslip.packingSlipType;
          initdateoption();
        } else {
          vm.customerslip = {
            packingSlipType: vm.customerPackingSlipType[0].id,
            status: CORE.DisplayStatus.Draft.ID,
            packingSlipDate: vm.todayDate,
            packingSlipNumber: vm.customerslip.packingSlipNumber,
            customerPackingSlipTrackNumber: []
          };
          initdateoption();
        }
        if (vm.autoCompleteTerm) {
          vm.autoCompleteTerm.keyColumnId = null;
          vm.autoCompleteShipping.keyColumnId = null;
          vm.autoCompleteCarriers.keyColumnId = null;
          vm.autoCompleteFOB.keyColumnId = null;
          vm.autoCompleteSalesCommosssionTo.keyColumnId = null;
        }
        resetAddressOBject(false);
        vm.contactpersondetail = null;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.customerName = null;
          $scope.$parent.vm.customerID = null;
          $scope.$parent.vm.soNumber = null;
          $scope.$parent.vm.soID = null;
          $scope.$parent.vm.poNumber = null;
        }
      }
    };

    const setSOPODetailAfterConfirmation = (item) => {
      vm.isSOPublished = item.status;
      vm.isLegacyPO = item.isLegacyPO;
      vm.isRMAPO = item.isRmaPO;
      vm.isBlanketPO = item.isBlanketPO ? true : false;
      vm.blanketPOOption = item.blanketPOOption;
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.customerName = item.customerName;
        $scope.$parent.vm.customerID = item.customerID;
        $scope.$parent.vm.soNumber = item['SO#'];
        $scope.$parent.vm.soID = item.ID;
        $scope.$parent.vm.poNumber = item['PO#'];
        $scope.$parent.vm.isLegacyPO = vm.isLegacyPO;
        $scope.$parent.vm.isRMAPO = vm.isRMAPO;
      }
      if (!vm.isedit) {
        vm.customerslip.customer = item.customerName;
        vm.customerslip.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
        vm.customerslip.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
        vm.customerslip.soNumber = item['SO#'];
        vm.customerslip.poNumber = item['PO#'];
        vm.customerslip.sorevision = item.revision;
        vm.customerslip.termsID = item.termsID;
        vm.customerslip.shippingMethodId = item.shippingMethodID;
        vm.customerslip.carrierID = item.carrierID;
        vm.customerslip.carrierAccountNumber = item.carrierAccountNumber;
        vm.customerslip.freeOnBoardId = item.freeOnBoardId;
        vm.customerslip.packingSlipComment = item.shippingcomment;
        vm.customerslip.customerID = item.customerID;
        vm.customerslip.contactPersonId = item.contactPersonID;
        vm.customerslip.intermediateShipmentId = item.intermediateShipmentId;
        vm.customerslip.shipToId = item.shippingAddressID;
        vm.customerslip.mfgName = item.mfgName;
        vm.customerslip.refSalesOrderID = item.ID;
        vm.customerslip.salesCommissionTo = item.salesCommissionTo;
        vm.customerslip.billToId = item.billingAddressID;
        vm.customerslip.headerComment = item.internalComment;
        vm.customerslip.poRevision = item.poRevision;
        vm.customerslip.billingContactPersonID = item.billingContactPersonID;
        vm.customerslip.shippingContactPersonID = item.shippingContactPersonID;
        vm.customerslip.intermediateContactPersonID = item.intermediateContactPersonID;
        vm.shipToOtherDet.customerId = item.customerID;
        vm.shipToOtherDet.refTransID = item.customerID;
        vm.shipToOtherDet.alreadySelectedAddressID = item.shippingAddressID;
        vm.billToOtherDet.customerId = item.customerID;
        vm.billToOtherDet.refTransID = item.customerID;
        vm.billToOtherDet.alreadySelectedAddressID = item.billingAddressID;
        vm.intermediateToOtherDet.customerId = item.customerID;
        vm.intermediateToOtherDet.refTransID = item.customerID;
        vm.ContactPersonOtherDet.customerId = item.customerID;
        vm.ContactPersonOtherDet.refTransID = item.customerID;
        vm.ContactPersonOtherDet.alreadySelectedPersonId = item.contactPersonId;
        initdateoption();
      }
      else {
        vm.customerslip.pendingSOPOACData = item.pendingSOPO;
      }
      const autocompleteCustomerPromise = [getShippingList(), getCarrierList(), getCustomerContactPersonList(), getCustomerAddress(vm.customerslip.customerID), getFOBList(), getSalesCommissionEmployeeListbyCustomer(), getTermsList()];
      vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
        if (!vm.autoCompleteShipping) {
          autoCompleteSelectCust();
          vm.autoCompleteFOB.keyColumnId = vm.customerslip.freeOnBoardId;
        } else {
          vm.autoCompleteTerm.keyColumnId = vm.customerslip.termsID;
          vm.autoCompleteShipping.keyColumnId = vm.customerslip.shippingMethodId;
          vm.autoCompleteFOB.keyColumnId = vm.customerslip.freeOnBoardId;
          vm.autoCompleteCarriers.keyColumnId = vm.customerslip.carrierID;
          vm.autoCompleteSalesCommosssionTo.keyColumnId = vm.customerslip.salesCommissionTo;
          // commonShippingMethodConfirm(false);
        }
        if (vm.salesOrderID !== 0 && vm.custPackingSlipID === 0) {
          vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
        }
        if (!vm.customerslip.id) {
          setFocus('packingSlipDate');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Get Term list
    const getTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(vm.categoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.customerslip && vm.customerslip.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get list of FOB
    const getFOBList = () =>
      FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
        if (fob && fob.data) {
          vm.FOBList = fob.data;
          return $q.resolve(vm.FOBList);
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });

    const autoCompleteSelectFOB = () => {
      vm.autoCompleteFOB = {
        columnName: 'name',
        controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.customerslip ? (vm.customerslip.freeOnBoardId ? vm.customerslip.freeOnBoardId : null) : null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
    };

    const autocompleteFOBCustomerPromise = [getFOBList()];
    vm.cgBusyLoading = $q.all(autocompleteFOBCustomerPromise).then(() => {
      autoCompleteSelectFOB();
    }).catch((error) => BaseService.getErrorLog(error));


    //get pending shipping list
    const getShippingListForOtherCharges = () => CustomerPackingSlipFactory.getSOPendingShippingListForOtherCharges().query({
      salesOrderID: vm.customerslip.refSalesOrderID || vm.salesOrderID
    }).$promise.then((res) => {
      if (res && res.data) {
        // const SOPartDetForOtherCharges = _.first(res.data);
        _.each(res.data, (det) => {
          det.id = det.partID;
          // det.partIDwithLineID = stringFormat('{0}{1}', det.partID, det.lineID);
        });
        vm.ChargeList = angular.copy(res.data);
        // vm.ChargeList = _.sortBy(vm.ChargeList, (det) => det.lineID);
        if (vm.soDetId && vm.autocompleteOtherCharges) {
          vm.autocompleteOtherCharges.keyColumnId = vm.soDetId;
        }
        if (vm.moveToNextOtherChgType && vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && (!vm.customerPackingSlipShipping.id) && ((!vm.ChargeList) || vm.ChargeList.length === 0)) {
          vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.MISC;
          vm.selectedOtherCharges = vm.otherChargeType.MISC;
          getotherTypecomponent();
        }
        // setShippingDeail(SOPartDetForOtherCharges);
        return $q.resolve(vm.pendingShippingList);
      }
    }).catch((error) => BaseService.getErrorLog(error));


    //other part type component
    const getotherTypecomponent = () => {
      if (vm.customerslip.packingSlipType !== vm.customerPackingSlipType[0].id || (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && vm.customerPackingSlipShipping.otherChargeType === vm.otherChargeType.MISC)) {
        vm.cgBusyLoading = SalesOrderFactory.getOtherPartTypeComponentDetails().query().$promise.then((charges) => {
          if (charges && charges.data) {
            //_.each(charges.data, (det) => {
            //  det.partIDwithLineID = det.id;
            //});
            vm.ChargeList = angular.copy(charges.data);
            vm.customerPackingSlipShipping.isShipForOtherCharges = true;
            vm.customerPackingSlipShipping.isShipForAssembly = false;
            //if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
            //  vm.customerPackingSlipShipping.isShipForOtherCharges = true;
            //  vm.customerPackingSlipShipping.isShipForAssembly = false;
            //  getShippingListForOtherCharges();
            //}
            return $q.resolve(vm.OtherPartTypeComponents);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.customerPackingSlipShipping.isShipForOtherCharges = true;
        vm.customerPackingSlipShipping.isShipForAssembly = false;
        getShippingListForOtherCharges();
        return $q.resolve(true);
      }
    };

    const selectOtherChargesAfterConfirmation = (item) => {
      // in case of MISC packing Slip / Packing Slip with extra other charges lineID will be null
      const objLineItem = _.find(vm.sourceData, (line) => item.id === parseInt(line.partId) && item.lineID === line.lineID);
      if (objLineItem) {
        vm.autocompleteOtherCharges.keyColumnId = objLineItem.partId;
        vm.customerPackingSlipShipping.mfgPN = item.mfgPN;
        vm.customerPackingSlipShipping.partId = objLineItem.partId;
        vm.customerPackingSlipShipping.poQty = objLineItem.poQty;
        vm.customerPackingSlipShipping.rohsIcon = objLineItem.rohsIcon;
        vm.customerPackingSlipShipping.rohsName = objLineItem.rohsName;
        vm.customerPackingSlipShipping.shipQty = parseInt(objLineItem.shipQty);
        vm.customerPackingSlipShipping.shippedQty = parseInt(objLineItem.shippedQty);
        vm.customerPackingSlipShipping.unitPrice = parseFloat(objLineItem.unitPrice);
        vm.customerPackingSlipShipping.packingSlipSerialNumber = objLineItem.packingSlipSerialNumber;
        vm.customerPackingSlipShipping.reflineID = objLineItem.lineID;
        vm.customerPackingSlipShipping.soLineID = objLineItem.lineID;
        vm.customerPackingSlipShipping.PIDCode = objLineItem.PIDCode;
        vm.customerPackingSlipShipping.assyDescription = objLineItem.assyDescription;
        vm.customerPackingSlipShipping.mfgName = objLineItem.mfgName;
        vm.customerPackingSlipShipping.mfgcodeID = objLineItem.mfgcodeid;
        vm.customerPackingSlipShipping.custPOLineID = objLineItem.custPOLineID;
        // vm.customerPackingSlipShipping.lineID = objLineItem.lineID;
        vm.customerPackingSlipShipping.refSalesorderDetid = objLineItem.refSalesorderDetid;
        vm.customerPackingSlipShipping.shippingNotes = objLineItem.shippingNotes;
        vm.customerPackingSlipShipping.internalComment = objLineItem.internalComment;
        vm.customerPackingSlipShipping.remainingQty = objLineItem.remainingQty;
        vm.customerPackingSlipShipping.id = objLineItem.id;
        vm.customerPackingSlipShipping.quoteFrom = objLineItem.quoteFrom;
        vm.customerPackingSlipShipping.refBlanketPONumber = objLineItem.refBlanketPONumber;
        vm.customerPackingSlipShipping.isFromSO = objLineItem.isFromSO;
        vm.recordUpdate = true;
        //vm.changePrice();
      } else {
        vm.recordUpdate = false;
        // vm.autocompleteOtherCharges.keyColumnId = item.id;
        vm.customerPackingSlipShipping.partId = item.id;
        vm.customerPackingSlipShipping.PIDCode = item.pidcode;
        vm.customerPackingSlipShipping.assyDescription = item.partDescription || item.mfgPNDescription;
        vm.customerPackingSlipShipping.isCustom = item.isCustom;
        vm.customerPackingSlipShipping.rohsIcon = item.rohsIcon;// stringFormat('{0}{1}', vm.rohsImagePath,
        vm.customerPackingSlipShipping.rohsName = item.rohsName;
        vm.customerPackingSlipShipping.partType = CORE.PartType.Other;
        vm.customerPackingSlipShipping.mfgPN = item.mfgPN;
        vm.customerPackingSlipShipping.partCategory = item.category;
        // vm.customerPackingSlipShipping.mfgName = stringFormat('({0}) {1}', item.mfgCode, item.mfgName);
        vm.customerPackingSlipShipping.mfgName = item.mfgName;
        vm.customerPackingSlipShipping.mfgcodeID = item.mfgcodeid || item.mfgcodeID;
        vm.customerPackingSlipShipping.shipQty = 0;
        vm.customerPackingSlipShipping.custPOLineID = item.custPOLineNumber;
        vm.customerPackingSlipShipping.reflineID = item.lineID;
        vm.customerPackingSlipShipping.soLineID = item.lineID;
        vm.customerPackingSlipShipping.refSalesorderDetid = item.sDetId;
        vm.customerPackingSlipShipping.poQty = item.qty || 0;
        vm.customerPackingSlipShipping.shippingNotes = item.remark;
        vm.customerPackingSlipShipping.internalComment = item.internalcomment;
        vm.customerPackingSlipShipping.quoteFrom = vm.salesCommissionFrom.NA.id;
        vm.customerPackingSlipShipping.unitPrice = parseFloat(item.price);
        vm.customerPackingSlipShipping.refBlanketPONumber = item.poNumber;
        vm.customerPackingSlipShipping.remainingQty = vm.customerPackingSlipShipping.poQty - ((vm.customerPackingSlipShipping.shipQty + (vm.shippTotal || 0)) > vm.customerPackingSlipShipping.poQty ? vm.customerPackingSlipShipping.poQty : vm.customerPackingSlipShipping.shipQty + (vm.shippTotal || 0));
        if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
          vm.getPartPriceBreakDetails(item.id).then(() => {
            vm.changeOtherPartQty();
          });
        }
        vm.customerPackingSlipShipping.isFromSO = item.lineID ? 1 : 0;
        //const maxLine = _.maxBy(vm.sourceData, (charges) => parseInt(charges.packingSlipSerialNumber));
        //if (maxLine) {
        //  if (parseInt(maxLine.packingSlipSerialNumber) >= CORE.InvoiceOtherChargeStartNumber) {
        //    vm.customerPackingSlipShipping.packingSlipSerialNumber = parseInt(maxLine.packingSlipSerialNumber) + 1;
        //  } else {
        //    vm.customerPackingSlipShipping.packingSlipSerialNumber = CORE.InvoiceOtherChargeStartNumber + 1;
        //  }
        //} else {
        //  vm.customerPackingSlipShipping.packingSlipSerialNumber = CORE.InvoiceOtherChargeStartNumber + 1;
        //}
      }
    };

    //on select of other charges autocomplete set details
    const getSelectedOtherCharge = (item) => {
      if (item) {
        if (item.partStatus === CORE.PartStatusList.InActiveInternal && !(vm.recordUpdate || vm.recordView)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              selectOtherChargesAfterConfirmation(item);
            }
          }, () => {
            vm.customerPackingSlipShipping.partType = vm.customerPackingSlipShipping.partId = vm.customerPackingSlipShipping.isCustom = vm.customerPackingSlipShipping.rohsIcon = vm.customerPackingSlipShipping.mfgcodeID = vm.customerPackingSlipShipping.rohsText = vm.customerPackingSlipShipping.mfgPN = vm.customerPackingSlipShipping.mfgName = null;
            vm.PartPriceBreakDetailsData = [];
            // vm.autoFrequency.keyColumnId = null;
            vm.customerPackingSlipShipping.unitPrice = null;
            vm.customerPackingSlipShipping.packingSlipSerialNumber = null;
            vm.customerPackingSlipShipping.id = null;
            const materialType = vm.customerPackingSlipShipping.materialType;
            vm.customerPackingSlipShipping = {
              materialType: materialType
            };
            vm.selectedMaterialType = materialType;
            setFocusByName(vm.autocompleteOtherCharges.inputName);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          selectOtherChargesAfterConfirmation(item);
        }
        //selectOtherChargesAfterConfirmation(item);
        setFocus('custPOLineID');
      }
      else {
        vm.customerPackingSlipShipping.partType = vm.customerPackingSlipShipping.partId = vm.customerPackingSlipShipping.isCustom = vm.customerPackingSlipShipping.rohsIcon = vm.customerPackingSlipShipping.mfgcodeID = vm.customerPackingSlipShipping.rohsText = vm.customerPackingSlipShipping.mfgPN = vm.customerPackingSlipShipping.mfgName = null;
        vm.PartPriceBreakDetailsData = [];
        // vm.autoFrequency.keyColumnId = null;
        vm.customerPackingSlipShipping.unitPrice = null;
        vm.customerPackingSlipShipping.packingSlipSerialNumber = null;
        vm.customerPackingSlipShipping.id = null;
        const materialType = vm.customerPackingSlipShipping.materialType;
        vm.customerPackingSlipShipping = {
          materialType: materialType
        };
        if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
          vm.customerPackingSlipShipping.otherChargeType = vm.selectedOtherCharges || vm.otherChargeType.PO;
        }
        vm.selectedMaterialType = materialType;
        //vm.resetShippingDetail();
      }
    };


    // get quote qty turn time
    function getQtyTurnTime() {
      if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        return getrfqQuoteQtyTurnTimeList();
      } else
        if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
          return vm.getAssemblySalesPriceDetails(vm.autocompleteAssy.keyColumnId);
        }
    };
    //get selected turn time
    function getSelectedturnTime(item) {
      vm.customerPackingSlipShipping.refRFQQtyTurnTimeID = item ? item.id : null;
      vm.customerPackingSlipShipping.qtyTurnTime = item ? item.qtyTurnTime : null;
      if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length && item && item.id) {
        const selectedTurnTime = _.find(vm.quoteQtyTurnTimeDetails, (a) => a.id === item.id);
        if (selectedTurnTime) {
          vm.autocompleteQtyTurnTime.keyColumnId = item.id;
          $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, selectedTurnTime);
          if (!vm.customerPackingSlipShipping.unitPrice && !vm.recordUpdate) {
            vm.customerPackingSlipShipping.unitPrice = item.unitPrice;
            //vm.changePrice();
            //vm.getSalesCommissionDetailsOnPriceChange();
          }
        }
        if (!vm.customerPackingSlipShipping.id) {
          vm.customerPackingSlipShipping.unitPrice = item && item.unitPrice ? item.unitPrice : null;
          // vm.changeQty(null, vm.qtyType.POQTY, unitPrice);
          // vm.getSalesCommissionDetailsOnPriceChange();
        }
      }
      if (!item && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.id && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
        getQtyTurnTimeByAssyId(vm.customerPackingSlipShipping.partId);
      }
    };

    function onChangeTurnTime(item) {
      $timeout(() => {
        if (vm.isQtyTurnTime_No_OptionSelected) {
          vm.isQtyTurnTime_No_OptionSelected = false;
          return;
        }
        if ((vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.salesCommissionList && vm.customerPackingSlipShipping.salesCommissionList.length > 0) &&
          ((vm.customerPackingSlipShipping.isCommissionDataEdited && item && vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== item.id) ||
            (vm.customerPackingSlipShipping.id > 0 && (!item || (vm.customerPackingSlipShipping.salesCommissionList.length > 0 &&
              vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== vm.customerPackingSlipShipping.refRFQQtyTurnTimeID))))) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime);
        }
        else {
          getSelectedturnTime(item);
        }
      });
    };

    // get quote group details
    const getrfqQuoteGroupList = (id) => SalesOrderFactory.getQuoteGroupDetailsfromPartID().query({ partID: id || vm.customerPackingSlipShipping.partId }).$promise.then((response) => {
      if (response && response.data) {
        vm.quoteGroupDetails = response.data;
      }
      if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1 && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
        vm.customerPackingSlipShipping.refRFQGroupID = vm.quoteGroupDetails[0].rfqrefID;
      } else if (vm.autoCompleteQuoteGroup && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.refRFQGroupID) {
        vm.autoCompleteQuoteGroup.keyColumnId = angular.copy(vm.customerPackingSlipShipping.refRFQGroupID);
      }
      return vm.quoteGroupDetails;
    }).catch((error) => BaseService.getErrorLog(error));

    const onSelectCallbackQuoteGroup = (item) => {
      if ((vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.salesCommissionList && vm.customerPackingSlipShipping.salesCommissionList.length > 0) && ((vm.customerPackingSlipShipping.isCommissionDataEdited && item && vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== item.rfqrefID) ||
        (vm.customerPackingSlipShipping.id > 0 && (!item || (vm.customerPackingSlipShipping.salesCommissionList.length > 0 && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId !== vm.customerPackingSlipShipping.refRFQGroupID))))) {
        changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteGroup);
      }
      else {
        getSelectedquoteGroup(item);
      }
    };

    const selectAssyCallBack = (item) => {
      vm.customerPackingSlipShipping.rohsIcon = item.rohsIcon;
      vm.customerPackingSlipShipping.rohsName = item.rohsName;
      vm.customerPackingSlipShipping.assyID = item.PIDCode;
      vm.customerPackingSlipShipping.PIDCode = item.PIDCode;
      vm.customerPackingSlipShipping.assyNumber = item.mfgPN;
      vm.customerPackingSlipShipping.mfgName = item.mfgName;
      vm.customerPackingSlipShipping.mfgcodeID = item.mfgcodeID;
      if (!vm.customerPackingSlipShipping.id) {
        vm.customerPackingSlipShipping.assyDescription = vm.customerPackingSlipShipping.assyDescription ? vm.customerPackingSlipShipping.assyDescription : item.description;
        vm.customerPackingSlipShipping.standrads = vm.customerPackingSlipShipping.standrads ? vm.customerPackingSlipShipping.standrads : item.standards;
        getShippingCommentList(item.id);
        getPartInternalCommentList(item.id);
      }
      vm.customerPackingSlipShipping.uom = item.unitName;
      vm.customerPackingSlipShipping.nickName = item.nickName;
      vm.customerPackingSlipShipping.partId = item.id;
      vm.customerPackingSlipShipping.isCustom = item.iscustom;
      vm.customerPackingSlipShipping.isCPN = item.isCPN;
      vm.customerPackingSlipShipping.custAssyPN = item.custAssyPN;
      vm.customerPackingSlipShipping.partType = item.partType;
      vm.customerPackingSlipShipping.partCategory = item.category;
      vm.setShippingDetails();
      getAssyQtyPeningShipDeatils(item.id);
      vm.customerPackingSlipShipping.isShipForAssembly = item.partType === vm.partCategoryConst.SubAssembly;
      vm.customerPackingSlipShipping.isComponent = item.partType === vm.partCategoryConst.Component;
      vm.customerPackingSlipShipping.mfgType = item.mfgType;
      if (!(vm.recordUpdate || vm.recordView) && vm.customerPackingSlipShipping.isComponent) {
        vm.customerPackingSlipShipping.componentStockType = false;
        vm.getPartPriceBreakDetails(item.id).then(() => {
          vm.changeOtherPartQty();
        });
      }
      if (vm.customerPackingSlipShipping.partCategory === CORE.PartCategory.SubAssembly) {
        vm.customerPackingSlipShipping.partTypeText = CORE.PartCategoryName.Assembly;
      } else if (vm.customerPackingSlipShipping.partCategory === CORE.PartCategory.Component) {
        vm.customerPackingSlipShipping.partTypeText = CORE.PartCategoryName.Component;
      }
      if (!vm.customerPackingSlipShipping.isCustom & (!(vm.recordUpdate || vm.recordView))) {
        vm.customerPackingSlipShipping.componentStockType = true;
      }
      if (vm.customerPackingSlipShipping.componentStockType && vm.customerPackingSlipShipping.isComponent) {
        getComponentUMIDList();
      }
      if (!vm.customerPackingSlipShipping.id) {
        vm.customerPackingSlipShipping.quoteFrom = 3;
        //if ((vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly) && vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
        //  vm.customerPackingSlipShipping.quoteFrom = 2;
        //  getQtyTurnTimeByAssyId(vm.customerPackingSlipShipping.partId);
        //} else {
        //  vm.customerPackingSlipShipping.quoteFrom = 3;
        //}
      }
      if (vm.customerPackingSlipShipping.isShipForAssembly) {
        // get assembly stock details with adjustment
        getAssemblyStockStatusList(vm.customerPackingSlipShipping.partId);
      }
      if (!vm.autocompleteMfgPN.keyColumnId) {
        const searchObj = {
          partID: item.id,
          searchText: null
        };
        return getcomponentMfgPNList(searchObj);
      }
      vm.isFocus = true;
      //$timeout(() => {
      //  setFocus('description');
      //});
    };

    // get company code
    const getCompanyCode = () => vm.cgBusyLoading = SupplierInvoiceFactory.companyConfigurationCheck().query({}).$promise.then((response) => {
      if (response && response.data) {
        vm.companyCode = response.data.id;
      }
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));
    getCompanyCode();

    const initAutoComplete = () => {
      vm.autoCompletePendingSOPO = {
        columnName: 'pendingSOPO',
        keyColumnName: 'ID',
        keyColumnId: vm.customerslip.refSalesOrderID ? vm.customerslip.refSalesOrderID : null,
        inputName: 'Select Order (Cust Code) SO PO',
        placeholderName: 'Select Order (Cust Code) SO PO',
        isRequired: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            salesorderID: obj.ID
          };
          return getSalesOrderMstList(searchObj);
        },
        onSelectCallbackFn: selectSOPONumber,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query
          };
          return getSalesOrderMstList(searchObj);
        }
      };
      vm.autoCompletecustomer = {
        columnName: 'mfgCodeName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id,
            isCustomer: true
          };
          return getCustomerSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.customerName = item.mfgCodeName;
              $scope.$parent.vm.customerID = item.id;
            }
            if (vm.customerslip.customerID !== item.id) {
              vm.customerslip.headerComment = item.comments;
            }
            vm.customerslip.customer = item.mfgCode;
            vm.customerslip.customerID = item.id;
            vm.customerslip.mfgName = item.mfgName;
            vm.iscompany = item.isCompany;
            vm.shipToOtherDet.customerId = item.id;
            vm.shipToOtherDet.refTransID = item.id;
            vm.shipToOtherDet.companyNameWithCode = item.mfgName;
            vm.billToOtherDet.customerId = item.id;
            vm.billToOtherDet.refTransID = item.id;
            vm.billToOtherDet.companyNameWithCode = item.mfgName;
            vm.intermediateToOtherDet.customerId = item.id;
            vm.intermediateToOtherDet.refTransID = item.id;
            vm.ContactPersonOtherDet.customerId = item.id;
            vm.ContactPersonOtherDet.refTransID = item.id;
            vm.ContactPersonOtherDet.companyName = item.mfgName;
            const autocompleteCustomerPromise = [getShippingList(), getCarrierList(), getCustomerContactPersonList(), getCustomerAddress(vm.customerslip.customerID), getFOBList(), getSalesCommissionEmployeeListbyCustomer(), getTermsList()];
            vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
              if (!vm.autoCompleteShipping) {
                autoCompleteSelectCust();
              }
              if (!vm.customerslip.id) {
                vm.customerslip.headerComment = item.comments;
                vm.autoCompleteTerm.keyColumnId = item.paymentTermsID;
                vm.autoCompleteShipping.keyColumnId = item.shippingMethodID;
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
                vm.customerslip.carrierAccountNumber = item.carrierAccount;
                vm.autoCompleteFOB.keyColumnId = item.freeOnBoardId;
                vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo;
                commonShippingMethodConfirm(false);
                setFocus('packingSlipDate');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            if (vm.autoCompleteTerm) {
              vm.autoCompleteTerm.keyColumnId = null;
            }
            if (vm.autoCompleteShipping) {
              vm.autoCompleteShipping.keyColumnId = null;
            }
            if (vm.autoCompleteSalesCommosssionTo) {
              vm.autoCompleteSalesCommosssionTo.keyColumnId = null;
            }
            if (vm.autoCompleteFOB) {
              vm.autoCompleteFOB.keyColumnId = null;
            }
            vm.customerslip.customerID = null;
            vm.customerslip.customer = null;
            vm.customerslip.mfgName = null;
            vm.iscompany = false;
            vm.customerslip.salesCommissionTo = null;
            vm.customerslip.termsID = null;
            vm.customerslip.shippingMethodId = null;
            vm.customerslip.freeOnBoardId = null;
            vm.contactpersondetail = null;
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.customerName = null;
              $scope.$parent.vm.customerID = null;
            }
            resetAddressOBject(true);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecustomer.inputName,
            isCustomer: true
          };
          return getCustomerSearch(searchObj);
        }
      };
      vm.autocompleteAssy = {
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Assembly',
        placeholderName: 'AssyNumber',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          //category: CORE.PartCategory.SubAssembly,
          customerID: vm.customerslip ? vm.customerslip.customerID : null
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            partID: obj.id,
            searchText: null
          };
          return getcomponentAssemblyList(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.rfqOnly) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
              messageContent.message = stringFormat(messageContent.message, item.PIDCode);
              const obj = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(obj).then(() => {
                vm.customerPackingSlipShipping = {
                  materialType: true
                };
                vm.selectedMaterialType = true;
                resetPackingSlipDetForm();
                vm.pendingShipQtyList = [];
                if (vm.autocompleteMfgPN && vm.autocompleteMfgPN.keyColumnId) {
                  $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
                }
                if (vm.autocompleteAssy && vm.autocompleteAssy.keyColumnId) {
                  vm.autocompleteAssy.keyColumnId = null;
                  $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
                }
              });
            } else {
              if (item.partStatus === CORE.PartStatusList.InActiveInternal && !(vm.recordUpdate || vm.recordView)) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, item.mfgPN);
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    selectAssyCallBack(item);
                    setFocus('description');
                  }
                }, () => {
                  vm.customerPackingSlipShipping = {
                    materialType: true
                  };
                  vm.selectedMaterialType = true;
                  resetPackingSlipDetForm();
                  vm.pendingShipQtyList = [];
                  if (vm.autocompleteAssy && vm.autocompleteAssy.keyColumnId) {
                    vm.autocompleteAssy.keyColumnId = null;
                    $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
                  }
                  if (vm.autocompleteMfgPN && vm.autocompleteMfgPN.keyColumnId) {
                    $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
                  }
                  vm.isFocus = true;
                  setFocusByName(vm.autocompleteAssy.inputName);
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                selectAssyCallBack(item);
              }
              // selectAssyCallBack(item);
            }
          } else {
            vm.customerPackingSlipShipping = {
              materialType: true
            };
            vm.selectedMaterialType = true;
            resetPackingSlipDetForm();
            vm.pendingShipQtyList = [];
            if (vm.autocompleteMfgPN.keyColumnId) {
              $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
            }
            setFocusByName(vm.autocompleteAssy.inputName);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            partID: null,
            searchText: query
          };
          return getcomponentAssemblyList(searchObj);
        }
      };
      vm.autocompleteMfgPN = {
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        columnName: 'combinemfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'MFRPN',
        placeholderName: 'MFRPN',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          customerID: vm.customerslip ? vm.customerslip.customerID : null
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            partID: obj.id,
            searchText: null
          };
          return getcomponentMfgPNList(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item && !vm.autocompleteAssy.keyColumnId) {
            const searchObj = {
              partID: item.id,
              searchText: null
            };
            return getcomponentAssemblyList(searchObj);
          }
          else if (!item && vm.autocompleteAssy.keyColumnId) {
            $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            partID: null,
            searchText: query
          };
          return getcomponentMfgPNList(searchObj);
        }
      };
      vm.autocompleteOtherCharges = {
        columnName: 'otherMPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: vm.customerPackingSlipShipping.otherChargeType === vm.otherChargeType.PO ? (vm.soDetId ? 'sDetId' : 'lineID') : 'id',
        keyColumnId: null,
        inputName: 'Other Charges',
        placeholderName: 'Other Charges',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other,
          customerID: vm.companyCode ? vm.companyCode : null
        },
        isRequired: true,
        isAddnew: false,
        callbackFn: getotherTypecomponent,
        onSelectCallbackFn: getSelectedOtherCharge
      };

      vm.autocompleteQtyTurnTime = {
        columnName: 'qtyTurnTime',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Quote Qty Turn Time',
        isRequired: false,
        isAddnew: false,
        callbackFn: getQtyTurnTime,
        onSelectCallbackFn: onChangeTurnTime
      };

      vm.autoCompleteQuoteGroup = {
        columnName: 'rfqrefID',
        keyColumnName: 'rfqrefID',
        keyColumnId: null,
        inputName: 'QuoteGroup',
        isRequired: false,
        isAddnew: false,
        callbackFn: getrfqQuoteGroupList,
        onSelectCallbackFn: onSelectCallbackQuoteGroup
      };
    };

    // set ship qty and shipping detail
    vm.setShippingDetails = () => {
      vm.customerPackingSlipShipping.shippedQty = _.sumBy(vm.customerslip.customerPackingSlipDet, (o) => { if (o.partId === vm.customerPackingSlipShipping.partId && vm.customerPackingSlipShipping.custPOLineID === o.custPOLineID) { return o.shippedQty; } }) || 0;
      vm.customerPackingSlipShipping.shipQty = _.sumBy(vm.customerslip.customerPackingSlipDet, (o) => { if (o.partId === vm.customerPackingSlipShipping.partId && vm.customerPackingSlipShipping.custPOLineID === o.custPOLineID) { return o.shipQty; } }) || 0;
      vm.shippedQty = angular.copy(vm.customerPackingSlipShipping.shipQty);
    };

    //get pending salesorder list
    // eslint-disable-next-line arrow-body-style
    const getSalesOrderMstList = (searchObj) => CustomerPackingSlipFactory.getPendingSalsorderDetails().query(searchObj).$promise.then((res) => {
      if (res && res.data) {
        vm.pendingSoPoList = res.data;
        if (searchObj.salesorderID || searchObj.salesorderID === 0) {
          $timeout(() => {
            if (vm.autoCompletePendingSOPO && vm.autoCompletePendingSOPO.inputName) {
              $scope.$broadcast(vm.autoCompletePendingSOPO.inputName, res.data[0]);
            }
          });
        }
        return $q.resolve(vm.pendingSoPoList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // vm.customerPackingSlipShipping = {};
    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: vm.custPackingSlipID, transType: 'P' }).$promise.then((res) => {
        if (res && res.data) {
          vm.isedit = true;
          vm.customerslip = res.data;
          if (vm.autoCompleteFOB) {
            vm.autoCompleteFOB.keyColumnId = vm.customerslip.freeOnBoardId;
          }
          if (vm.autocompleteAssy && vm.autocompleteAssy.addData) {
            vm.autocompleteAssy.addData.customerID = vm.customerslip.customerID;
          }
          vm.Copycustomerslip = angular.copy(res.data);
          vm.customerslip.mfgName = vm.customerslip.mfgCodeMst.mfgName;
          vm.customerslip.customer = BaseService.getMfgCodeNameFormat(vm.customerslip.mfgCodeMst.mfgCode, vm.customerslip.mfgName);
          // stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.customerslip.mfgCodeMst.mfgCode, vm.customerslip.mfgName);
          vm.customerslip.customerNameWithCode = BaseService.getMfgCodeNameFormat(vm.customerslip.mfgCodeMst.mfgCode, vm.customerslip.mfgName);
          // stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.customerslip.mfgCodeMst.mfgCode, vm.customerslip.mfgName);
          vm.customerslip.customerNameOnly = vm.customerslip.mfgName;
          vm.packingSlipType = vm.customerslip.packingSlipType;
          vm.customerslip.poDate = BaseService.getUIFormatedDate(vm.customerslip.poDate, vm.DefaultDateFormat);
          vm.customerslip.soDate = BaseService.getUIFormatedDate(vm.customerslip.soDate, vm.DefaultDateFormat);
          vm.customerslip.packingSlipDate = BaseService.getUIFormatedDate(vm.customerslip.packingSlipDate, vm.DefaultDateFormat);
          vm.customerslip.lockedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.customerslip.lockedAt, vm.DefaultDateTimeFormat);
          vm.customerslip.updatedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.customerslip.updatedAt, vm.DefaultDateTimeFormat);
          vm.customerslip.createdAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.customerslip.createdAt, vm.DefaultDateTimeFormat);
          vm.isSlipStatusPublished = vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft;
          vm.isSlipInStatusNotAllowedToChangeMajorInfo = (vm.customerslip.refCustInvoiceID || vm.customerslip.status || (vm.customerslip.isLocked && (!vm.loginUser.isUserSuperAdmin))) ? true : false;
          disableAddrActionButton(vm.isSlipInStatusNotAllowedToChangeMajorInfo);

          vm.isPOPackingSlip = (vm.packingSlipType === vm.customerPackingSlipType[0].id) ? true : false;
          if (vm.customerslip && vm.customerslip.customerInvoiceDet) {
            if (vm.customerslip.customerInvoiceDet.subStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT ||
              vm.customerslip.customerInvoiceDet.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED ||
              vm.customerslip.customerInvoiceDet.subStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED) {
              vm.customerslip.paymentStatusCode = 'NI';
            } else if ((vm.customerslip.customerInvoiceDet.subStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED ||
              vm.customerslip.customerInvoiceDet.subStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED) && vm.customerslip.customerInvoiceDet.paymentStatus === 'PE') {
              vm.customerslip.paymentStatusCode = 'WP';
            } else if (vm.customerslip.customerInvoiceDet.paymentStatus === 'PR' || vm.customerslip.customerInvoiceDet.paymentStatus === 'RE') {
              vm.customerslip.paymentStatusCode = vm.customerslip.customerInvoiceDet.paymentStatus;
            }
            vm.customerslip.paymentStatusObj = _.find(CORE.Customer_Payment_Status, (item) => item.Code === vm.customerslip.paymentStatusCode);
          } else {
            vm.customerslip.paymentStatusObj = _.find(CORE.Customer_Payment_Status, (item) => item.Code === 'PEN');
          }
          vm.shipToOtherDet.customerId = vm.customerslip.customerID;
          vm.shipToOtherDet.refTransID = vm.customerslip.customerID;
          vm.shipToOtherDet.companyNameWithCode = vm.customerslip.customer;
          vm.billToOtherDet.customerId = vm.customerslip.customerID;
          vm.billToOtherDet.refTransID = vm.customerslip.customerID;
          vm.billToOtherDet.companyNameWithCode = vm.customerslip.customer;
          vm.intermediateToOtherDet.customerId = vm.customerslip.customerID;
          vm.intermediateToOtherDet.refTransID = vm.customerslip.customerID;
          vm.intermediateToOtherDet.companyNameWithCode = vm.customerslip.customer;
          vm.ContactPersonOtherDet.customerId = vm.customerslip.customerID;
          vm.ContactPersonOtherDet.refTransID = vm.customerslip.customerID;
          vm.ContactPersonOtherDet.companyName = vm.customerslip.customer;
          vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.customerslip.contactPersonId;
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.status = vm.customerslip.status;
            $scope.$parent.vm.subStatus = vm.customerslip.subStatus;
            $scope.$parent.vm.isSlipStatusPublished = vm.isSlipStatusPublished;
            //$scope.$parent.vm.label = vm.customerslip.status ? CORE.OPSTATUSLABLEDRAFT : CORE.OPSTATUSLABLEPUBLISH;
            $scope.$parent.vm.packingId = vm.customerslip.id;
            if ($scope.$parent.vm.autoCompletePackingSlip) {
              $scope.$parent.vm.autoCompletePackingSlip.keyColumnId = res.data.id;
            }
            $scope.$parent.vm.refCustInvoiceID = vm.customerslip.refCustInvoiceID;
            $scope.$parent.vm.invoiceNumber = vm.customerslip.customerInvoiceDet ? vm.customerslip.customerInvoiceDet.invoiceNumber : null;
            $scope.$parent.vm.tabList[1].isDisabled = false;
            $scope.$parent.vm.tabList[2].isDisabled = false;
            $scope.$parent.vm.isLocked = vm.customerslip.isLocked;
            const lockByName = vm.customerslip.lockEmployees && vm.customerslip.lockEmployees.employee ? vm.customerslip.lockEmployees.employee : null;
            $scope.$parent.vm.lockedBy = lockByName ? stringFormat('({0}) {1} {2}', lockByName.initialName, lockByName.firstName, lockByName.lastName) : null;
            $scope.$parent.vm.lockedAt = vm.customerslip.lockedAt;
            $scope.$parent.vm.packingSlip = vm.customerslip.packingSlipNumber;
            $scope.$parent.vm.custCode = vm.customerslip && vm.customerslip.mfgCodeMst ? vm.customerslip.mfgCodeMst.mfgCode : null;
            $scope.$parent.vm.packingSlipVersion = vm.customerslip.revision;
            $scope.$parent.vm.paymentStatusObj = vm.customerslip.paymentStatusObj;
            $scope.$parent.vm.packingSlipType = vm.customerslip.packingSlipType;
            $scope.$parent.vm.packingSlipTypeText = parseInt(vm.customerslip.packingSlipType) === 2 ? vm.customerPackingSlipType[0].name : vm.customerPackingSlipType[1].name;
            $scope.$parent.vm.poType = vm.customerslip.poType;
          }
          if (vm.soDetId && vm.lineMaterialType) {
            vm.customerPackingSlipShipping.materialType = (vm.lineMaterialType === 1 ? true : false);
          } else {
            vm.customerPackingSlipShipping.materialType = true;
          }
          getotherTypecomponent();
          vm.loadSourceData();
          vm.loadData();
          vm.isFocus = false;
          if (vm.customerPackingSlipType[0].id === vm.customerslip.packingSlipType) {
            getSalesOrderMstList({ salesorderID: vm.customerslip.refSalesOrderID }).then(() => {
              getPendingCustomerSalesDetails();
            });
          } else {
            getCustomerSearch({ mfgcodeID: vm.customerslip.customerID });
            $scope.$parent.vm.soNumber = vm.customerslip.soNumber;
            $scope.$parent.vm.poNumber = vm.customerslip.poNumber;
          }
          vm.isFocus = true;
          _.each(vm.customerslip.customerPackingSlipTrackNumber, (item, index) => {
            item.tempID = (index + 1);
          });        
          // vm.isDisableForChangePackingSlipShipAddrMethod = (vm.packingSlipType === CORE.CUSTOMER_PACKING_SLIP_TYPE[0].id) && vm.customerslip.customerPackingSlipDet && vm.customerslip.customerPackingSlipDet.length > 0;
          return $q.resolve(vm.customerslip);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //check for edit option
    // initAutoComplete();

    // getotherTypecomponent();
    if (vm.custPackingSlipID) {
      getCustomerPackingSlipDetail();
      if (vm.soDetId) {
        vm.customerPackingSlipShipping.materialType = (vm.lineMaterialType === 1 ? true : false);
      }
    }

    // to fill header section when only sales order id passed in add mode
    if (vm.salesOrderID !== 0 && vm.custPackingSlipID === 0) {
      vm.autoCompletePendingSOPO.keyColumnId = vm.salesOrderID;
      vm.autoCompletePendingSOPO.callbackFn({ ID: vm.salesOrderID });
      //      vm.frmCustomerPackingSlip.$dirty = true;
    }

    //get customer assembly and all component/other part details
    const getcomponentAssemblyList = (searchObj) => {
      searchObj.customerID = (vm.iscompany ? null : vm.customerslip.customerID);
      return CustomerPackingSlipFactory.getAssyCompListForCustomerPackingSlipMISC().query(searchObj).$promise.
        then((respAssemblyComp) => {
          if (respAssemblyComp && respAssemblyComp.data) {
            if (searchObj.partID) {
              $timeout(() => {
                if (vm.autocompleteAssy && vm.autocompleteAssy.inputName) {
                  $scope.$broadcast(vm.autocompleteAssy.inputName, respAssemblyComp.data[0]);
                }
              });
            }
            return respAssemblyComp.data;
          }
          else {
            return [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    //get customer mfgpn and all component/other part details
    const getcomponentMfgPNList = (searchObj) => {
      searchObj.customerID = (vm.iscompany ? null : vm.customerslip.customerID);
      return CustomerPackingSlipFactory.getAssyCompListForCustomerPackingSlipMISC().query(searchObj).$promise.
        then((respAssemblyComp) => {
          if (respAssemblyComp && respAssemblyComp.data) {
            if (searchObj.partID) {
              $timeout(() => {
                if (vm.autocompleteMfgPN && vm.autocompleteMfgPN.inputName) {
                  $scope.$broadcast(vm.autocompleteMfgPN.inputName, respAssemblyComp.data[0]);
                }
              });
            }
            return respAssemblyComp.data;
          }
          else {
            return [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    //get shipping address
    vm.getShippingAddress = () => {
      if (vm.ShippingAddress) {
        let shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress);
        if (shippingAddress) {
          shippingAddress = shippingAddress.replace(/\r/g, '<br/>');
        }
        return shippingAddress;
      } else { return ''; }
    };

    //set shipping address for SO assembly shipping line level
    const setShippingAddressForSOAssyReleaseLineLevel = (id, personId) => {
      const shippingAddressDet = _.find(vm.ShippingAddressList, (item) => item.id === id);
      const shippingContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === personId);
      if (shippingAddressDet) {
        vm.customerPackingSlipShipping.shippingAddressObj = angular.copy(shippingAddressDet);
        vm.customerPackingSlipShipping.shippingContactPersonObj = angular.copy(shippingContactPerson);
        vm.customerPackingSlipShipping.shippingFullAddress = BaseService.generateAddressFormateToStoreInDB(shippingAddressDet);
        vm.customerPackingSlipShipping.shippingContactPerson = BaseService.generateContactPersonDetFormat(shippingContactPerson);
        if (vm.customerPackingSlipShipping.shippingFullAddress) {
          vm.customerPackingSlipShipping.shippingFullAddress = vm.customerPackingSlipShipping.shippingFullAddress.replace(/\r/g, '<br/>');
          vm.salesShipping.shippingFullAddress = angular.copy(vm.customerPackingSlipShipping.shippingFullAddress);
        }
        if (vm.customerPackingSlipShipping.shippingContactPerson) {
          vm.customerPackingSlipShipping.shippingContactPerson = vm.customerPackingSlipShipping.shippingContactPerson.replace(/\r/g, '<br/>');
          vm.salesShipping.shippingContactPerson = angular.copy(vm.customerPackingSlipShipping.shippingContactPerson);
        }
      }
    };

    //Set Packing slip details
    vm.onChangePackingSlipDate = () => {
      initdateoption();
      vm.checkDateValidation(1);
    };
    //Set So date
    vm.onChangeSODate = () => {
      initdateoption();
      vm.checkDateValidation(2);
    };

    //set PO date
    vm.onChangePODate = () => {
      initdateoption();
      vm.checkDateValidation(3);
    };
    //go to customer list page
    vm.goToCustomerType = () => {
      BaseService.goToCustomerList();
    };
    // Go To RFQ Update page
    vm.goToRFQUpdate = (id, assyID) => {
      BaseService.goToRFQUpdate(id, assyID);
    };
    //go to rfq list page
    vm.goToRfqListPage = () => {
      BaseService.goToRFQList();
      return;
    };
    // go to carrier list page
    vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();

    //autocomplete details
    const autoCompleteSelectCust = () => {
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customerslip ? (vm.customerslip.shippingMethodId ? vm.customerslip.shippingMethodId : null) : null,
        inputName: vm.categoryTypeObjList.ShippingType.Name,
        placeholderName: vm.categoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: vm.categoryTypeObjList.ShippingType.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.salesShipping.shippingMethod = item.gencCategoryDisplayName;
          }
          else {
            vm.salesShipping.shippingMethod = null;
          }
          if (item && vm.autoCompleteCarriers &&
            (!vm.customerslip.id || (vm.Copycustomerslip && vm.customerslip.shipToId === vm.Copycustomerslip.shipToId)) &&
            (vm.customerslip.shippingMethodId !== item.gencCategoryID || vm.autoCompleteShipping.shippingMethodId !== item.gencCategoryID)) {
            if (vm.customerslip.shippingMethodId && vm.customerslip.shippingMethodId !== item.gencCategoryID) {
              const model = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
                vm.customerslip.carrierAccountNumber = null;
              }, () => {
                vm.autoCompleteShipping.keyColumnId = vm.customerslip.shippingMethodId;
                vm.autoCompleteCarriers.keyColumnId = vm.customerslip.carrierID;
                vm.customerslip.carrierAccountNumber = angular.copy(vm.Copycustomerslip.carrierAccountNumber);
              });
            } else {
              if (vm.customerslip.id && vm.Copycustomerslip.shippingMethodId !== item.gencCategoryID) {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              } else if (!vm.customerslip.id && vm.customerslip.shippingMethodId !== item.gencCategoryID) {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              }
              // vm.autoCompleteCarriers.keyColumnId = item.carrierID;
            }
          } else if (!item) {
            vm.customerslip.carrierAccountNumber = null;
            vm.autoCompleteCarriers.keyColumnId = null;
          }
        }
      };
      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: vm.customerslip && vm.customerslip.salesCommissionTo ? vm.customerslip.salesCommissionTo : null,
        inputName: 'Sales Commission To',
        placeholderName: 'Sales Commission To',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getSalesCommissionEmployeeListbyCustomer
      };
      vm.autoCompleteTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customerslip ? (vm.customerslip.termsID ? vm.customerslip.termsID : null) : null,
        inputName: vm.categoryTypeObjList.Terms.Name,
        placeholderName: vm.categoryTypeObjList.Terms.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.paymentTerm,
          headerTitle: vm.categoryTypeObjList.Terms.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getTermsList
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customerslip ? (vm.customerslip.carrierID ? vm.customerslip.carrierID : null) : null,
        inputName: vm.categoryTypeObjList.Carriers.Title,
        placeholderName: vm.categoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: vm.categoryTypeObjList.Carriers.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCarrierList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.salesShipping.carrier = item.gencCategoryDisplayName;
          }
          else {
            vm.salesShipping.carrier = null;
          }
        }
      };
    };

    //autocomplete detail for sales order (Part Auto Complete)
    const autoCompleteShippingDetail = () => {
      vm.autoCompletePackingSlipSalesOrderDetails = {
        columnName: 'soDets',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Select AssyID',
        placeholderName: 'Select AssyID',
        isRequired: true,
        isAddnew: false,
        callbackFn: getPendingCustomerSalesDetails,
        onSelectCallbackFn: selectSalesOrderDetails
      };
    };

    //autocomplete detail for sales order shipping details(Release Line Auto Complete)
    const autocompleteSalesShippingDetail = () => {
      vm.autoCompletePackingSlipShipping = {
        columnName: 'shipping',
        keyColumnName: 'shippingID',
        keyColumnId: null,
        inputName: 'Release Line#',
        placeholderName: 'Release Line#',
        isRequired: true,
        isAddnew: false,
        callbackFn: getsalesOrderPendingShippingList,
        onSelectCallbackFn: selectShippingDetails
      };
      if (vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.shippingId) {
        vm.pendingShippingList = _.clone(vm.allpendingShippingList);
        vm.autoCompletePackingSlipShipping.keyColumnId = vm.customerPackingSlipShipping ? vm.customerPackingSlipShipping.shippingId : null;
      }
      //else if (vm.soReleaseId) {
      //  vm.autoCompletePackingSlipShipping.keyColumnId = vm.soReleaseId;
      //}
    };

    //get pending shipping list
    // eslint-disable-next-line prefer-const
    const getsalesOrderPendingShippingList = () => CustomerPackingSlipFactory.getPendingSalesShippingDetails().query({ salesorderID: vm.salesDetID, packingSlipID: vm.customerslip.id, packingslipDetID: vm.customerPackingSlipShipping.id || null }).$promise.then((res) => {
      if (res && res.data) {
        vm.allpendingShippingList = _.clone(res.data.shippingsalesorderList);
        vm.allOtherCharges = _.clone(res.data.otherCharges);
        vm.pendingShippingList = _.clone(vm.allpendingShippingList);
        if (!vm.autoCompletePackingSlipShipping) {
          autocompleteSalesShippingDetail();
        }
        if (vm.autoCompletePackingSlipShipping) {
          // vm.pendingShippingList = _.clone(vm.allpendingShippingList);
          vm.autoCompletePackingSlipShipping.keyColumnId = vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.shippingId ? vm.customerPackingSlipShipping.shippingId : vm.soReleaseId;
        }
        return $q.resolve(vm.pendingShippingList);
      }
    }).catch((error) => BaseService.getErrorLog(error));


    //get pending salesorder detail list
    // eslint-disable-next-line prefer-const
    const getPendingCustomerSalesDetails = () => CustomerPackingSlipFactory.getPendingCustomerSalesDetails().query({ salesorderID: vm.customerslip.refSalesOrderID, packingSlipID: vm.customerslip.id }).$promise.then((res) => {
      if (res && res.data) {
        vm.allpendingShippingDetailList = _.clone(res.data);
        vm.pendingShippingDetailList = _.clone(_.filter(res.data, (shipped) => !shipped.isShipped));
        if (!vm.autoCompletePackingSlipSalesOrderDetails) {
          autoCompleteShippingDetail();
        }
        if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && (!vm.pendingShippingDetailList || vm.pendingShippingDetailList.length === 0)) {
          vm.customerPackingSlipShipping.materialType = false;
          vm.customerPackingSlipShipping.otherChargeType = vm.customerPackingSlipShipping.otherChargeType || vm.otherChargeType.PO;
          if (!vm.ChargeList || vm.ChargeList.length === 0) {
            getShippingListForOtherCharges();
          }
        }
        if (vm.soDetId && vm.customerPackingSlipShipping.materialType && vm.autoCompletePackingSlipSalesOrderDetails) {
          vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = vm.soDetId;
        }
        return $q.resolve(vm.pendingShippingDetailList);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer detail
    */
    const getShippingList = () => {
      // const GencCategoryType = [];
      // GencCategoryType.push();
      const listObj = {
        GencCategoryType: [vm.categoryTypeObjList.ShippingType.Name],
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingTypeList = shipping.data;
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // get carrier list
    const getCarrierList = () => {
      const listObj = {
        GencCategoryType: [vm.categoryTypeObjList.Carriers.Name],
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierList = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.carrierList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //go to fob
    vm.goToFOBList = () => { BaseService.goToFOB(); };

    //select shipping details
    const selectSalesOrderDetails = (item) => {
      if (item) {
        if (item.rfqOnly) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            vm.salesDetID = null;
            if (vm.autoCompletePackingSlipSalesOrderDetails) {
              vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = null;
            }
            vm.pendingShippingList = [];
            vm.allpendingShippingList = [];
            vm.customerPackingSlipShipping = {
              materialType: true
            };
            vm.selectedMaterialType = true;
            vm.customerPackingSlipShippingCopy = null;
            resetPackingSlipDetForm();
          });
        } else {
          if (item.partStatus === CORE.PartStatusList.InActiveInternal && !(vm.recordUpdate || vm.recordView)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, item.mfgPN);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                selectSalesOrderDetailAfterConfirmation(item);
              }
            }, () => {
              if (vm.autoCompletePackingSlipShipping) {
                vm.autoCompletePackingSlipShipping.keyColumnId = null;
              }
              vm.pendingShippingList = [];
              vm.allpendingShippingList = [];
              vm.customerPackingSlipShipping = {
                materialType: true
              };
              vm.selectedMaterialType = true;
              vm.customerPackingSlipShippingCopy = null;
              resetPackingSlipDetForm();
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            selectSalesOrderDetailAfterConfirmation(item);
          }
        }
      } else {
        vm.salesDetID = null;
        if (vm.autoCompletePackingSlipShipping) {
          vm.autoCompletePackingSlipShipping.keyColumnId = null;
        }
        vm.pendingShippingList = [];
        vm.allpendingShippingList = [];
        vm.customerPackingSlipShipping = {
          materialType: true
        };
        vm.selectedMaterialType = true;
        vm.customerPackingSlipShippingCopy = null;
        resetPackingSlipDetForm();
      }
    };

    const selectSalesOrderDetailAfterConfirmation = (item) => {
      vm.salesDetID = item.id;
      vm.customerPackingSlipShipping.partId = item.partID;
      vm.customerPackingSlipShipping.assyID = item.PIDCode;
      vm.customerPackingSlipShipping.assyNumber = item.mfgPN;
      vm.customerPackingSlipShipping.mfgName = item.mfgName;
      vm.customerPackingSlipShipping.nickName = item.nickName;
      vm.customerPackingSlipShipping.mfgcodeID = item.mfgcodeID;
      vm.customerPackingSlipShipping.uom = item.unitMeaser;
      vm.customerPackingSlipShipping.rohsIcon = item.rohsIcon;
      vm.customerPackingSlipShipping.rohsName = item.rohsName;
      vm.customerPackingSlipShipping.isCustom = item.iscustom;
      vm.customerPackingSlipShipping.partCategory = item.partCategory;
      vm.customerPackingSlipShipping.custAssyPN = item.custAssyPN;
      if (vm.customerPackingSlipShipping.partCategory === CORE.PartCategory.SubAssembly) {
        vm.customerPackingSlipShipping.partTypeText = CORE.PartCategoryName.Assembly;
      } else if (vm.customerPackingSlipShipping.partCategory === CORE.PartCategory.Component) {
        vm.customerPackingSlipShipping.partTypeText = CORE.PartCategoryName.Component;
      }
      // here part description and standard no taken because packing slip  line may exists for  release , so we show record in update mode.
      if (item.partType === 4) {
        vm.customerPackingSlipShipping.isShipForOtherCharges = true;
        vm.customerPackingSlipShipping.isShipForAssembly = false;        
        getShippingListForOtherCharges();
      } else {
        vm.customerPackingSlipShipping.isShipForOtherCharges = false;
        getsalesOrderPendingShippingList();
        if (item.partCategory === vm.partCategoryConst.SubAssembly) {
          vm.customerPackingSlipShipping.isShipForAssembly = true;
        } else if (item.partCategory === vm.partCategoryConst.Component) {
          vm.customerPackingSlipShipping.isComponent = true;
        }
        if (!(vm.recordUpdate || vm.recordView) && vm.customerPackingSlipShipping.isComponent) {
          vm.customerPackingSlipShipping.componentStockType = false;
        }
      }
    };

    const selectShippingDetails = (item) => {
      if (item) {
        if (item.rfqOnly) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            vm.customerPackingSlipShipping = {
              materialType: true
            };
            vm.selectedMaterialType = true;
            resetPackingSlipDetForm();
            vm.pendingShipQtyList = [];
            //if (vm.autocompleteMfgPN.keyColumnId) {
            //  $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
            //}
          });
        } else {
          vm.isFocus = false;
          const minBy = _.minBy(vm.pendingShippingList, 'releaseNumber');
          if (minBy && minBy.releaseNumber !== item.releaseNumber && !vm.customerPackingSlipShippingCopy) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIP_DETAIL_CONFIRMATION_ALERT);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) { setShippingDeail(item); setFocus('description'); }
            }, () => {
              vm.autoCompletePackingSlipShipping.keyColumnId = null;
              vm.isFocus = true;
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            setShippingDeail(item);
          }
        }
      } else {
        let customerPackingSlipShippingOld = {
          isShipForOtherCharges: angular.copy(vm.customerPackingSlipShipping.isShipForOtherCharges),
          isShipForAssembly: angular.copy(vm.customerPackingSlipShipping.isShipForAssembly),
          materialType: angular.copy(vm.customerPackingSlipShipping.materialType),
          partId: angular.copy(vm.customerPackingSlipShipping.partID),
          assyID: angular.copy(vm.customerPackingSlipShipping.assyID),
          assyNumber: angular.copy(vm.customerPackingSlipShipping.assyNumber),
          mfgName: angular.copy(vm.customerPackingSlipShipping.mfgName),
          nickName: angular.copy(vm.customerPackingSlipShipping.nickName),
          mfgcodeID: angular.copy(vm.customerPackingSlipShipping.mfgcodeID),
          uom: angular.copy(vm.customerPackingSlipShipping.unitMeaser),
          rohsIcon: angular.copy(vm.customerPackingSlipShipping.rohsIcon),
          rohsName: angular.copy(vm.customerPackingSlipShipping.rohsName),
          isCustom: angular.copy(vm.customerPackingSlipShipping.iscustom),
          partCategory: angular.copy(vm.customerPackingSlipShipping.partCategory),
          partTypeText: angular.copy(vm.customerPackingSlipShipping.partTypeText)
        };
        vm.customerPackingSlipShipping = angular.copy(customerPackingSlipShippingOld);
        vm.selectedMaterialType = customerPackingSlipShippingOld.materialType || true;
        customerPackingSlipShippingOld = {};
        /// resetPackingSlipDetForm();
      }
    };

    // setShippingDeail
    const setShippingDeail = (item) => {
      const objData = _.find(vm.sourceData, (source) => source.shippingId === item.shippingID);

      vm.quoteGroupDetails = [];
      vm.customerPackingSlipShipping.shippingQty = item.qty;
      if (!objData) {
        vm.customerPackingSlipShipping.shippingMethodID = item.shippingMethodID;
        vm.customerPackingSlipShipping.shippingMethodText = item.shippingMethodText;
        vm.customerPackingSlipShipping.shippingAddressID = item.shippingAddressID;
        vm.customerPackingSlipShipping.shippingContactPersonID = item.shippingContactPersonID;
        vm.customerPackingSlipShipping.carrierID = item.carrierID;
        vm.customerPackingSlipShipping.carrierText = item.carrierText;
        vm.customerPackingSlipShipping.carrierAccountNumber = item.carrierAccountNumber;
      }
      if (objData) {
        vm.customerPackingSlipShipping.shippingMethodID = vm.customerslip.shippingMethodId;
        vm.customerPackingSlipShipping.shippingMethodText = vm.salesShipping.shippingMethod || '';
        vm.customerPackingSlipShipping.shippingAddressID = vm.customerslip.shipToId || null;
        vm.customerPackingSlipShipping.shippingFullAddress = vm.salesShipping.shippingFullAddress || '';
        vm.customerPackingSlipShipping.shippingContactPersonID = vm.customerslip.shippingContactPersonID || null;
        vm.customerPackingSlipShipping.shippingContactPerson = vm.salesShipping.shippingContactPerson || '';
        vm.customerPackingSlipShipping.carrierID = vm.customerslip.carrierID || null;
        vm.customerPackingSlipShipping.carrierText = vm.salesShipping.carrier || '';
        vm.customerPackingSlipShipping.carrierAccountNumber = vm.customerslip.carrierAccountNumber;
      }
      setShippingAddressForSOAssyReleaseLineLevel(vm.customerPackingSlipShipping.shippingAddressID, vm.customerPackingSlipShipping.shippingContactPersonID);
      vm.customerPackingSlipShipping.shipToOtherDet = {
        showAddressEmptyState: false,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        customerId: vm.customerslip.customerID,
        addressType: 'S',
        addressBlockTitle: vm.LabelConstant.COMMON.ShippingAddress,
        refTransID: vm.customerslip.customerID,
        refTableName: 'mfgcodemst'
      };
      vm.customerPackingSlipShipping.uom = item.unitMeaser;
      vm.customerPackingSlipShipping.shippingBuild = item.releaseNumber;
      vm.customerPackingSlipShipping.reflineID = item.lineID;
      vm.customerPackingSlipShipping.soLineID = item.lineID;
      vm.customerPackingSlipShipping.isFromSO = item.lineID ? 1 : 0;
      vm.customerPackingSlipShipping.releaseNote = item.releaseNotes;
      vm.customerPackingSlipShipping.poreleaseLineOrderQty = item.qty;
      vm.customerPackingSlipShipping.quoteFrom = item.quoteFrom;
      vm.customerPackingSlipShipping.quoteNumber = item.quoteNumber;
      vm.customerPackingSlipShipping.refAssyQtyTurnTimeID = item.refAssyQtyTurnTimeID;
      vm.customerPackingSlipShipping.assyQtyTurnTimeText = item.assyQtyTurnTimeText;
      vm.customerPackingSlipShipping.refRFQGroupID = item.refRFQGroupID;
      vm.customerPackingSlipShipping.refRFQQtyTurnTimeID = item.refRFQQtyTurnTimeID;
      vm.customerPackingSlipShipping.originalPOQty = item.originalPOQty;
      vm.customerPackingSlipShipping.releaseNotes = item.releaseNotes;
      if (objData) {
        vm.customerPackingSlipShipping.internalComment = objData.internalComment;
        vm.customerPackingSlipShipping.assyDescription = objData.assyDescription;
        vm.customerPackingSlipShipping.shippingNotes = objData.shippingNotes;
        vm.customerPackingSlipShipping.unitPrice = objData.unitPrice;
        vm.customerPackingSlipShipping.standrads = objData.standrads;
        vm.customerPackingSlipShipping.refSalesorderDetid = item.sDetId;
        vm.customerPackingSlipShipping.partId = item.partID;
        vm.customerPackingSlipShipping.custAssyPN = item.custAssyPN;
        vm.customerPackingSlipShipping.poQty = item.poQty;
        vm.customerPackingSlipShipping.nickName = item.nickName;
        vm.customerPackingSlipShipping.custAssyPN = item.custAssyPN;
        vm.customerPackingSlipShipping.shippingId = item.shippingID;
        vm.customerPackingSlipShipping.shipQty = objData.shipQty;
        vm.customerPackingSlipShipping.quoteFrom = objData.quoteFrom;
        vm.customerPackingSlipShipping.quoteNumber = objData.quoteNumber;
        vm.customerPackingSlipShipping.refAssyQtyTurnTimeID = objData.refAssyQtyTurnTimeID;
        vm.customerPackingSlipShipping.assyQtyTurnTimeText = objData.assyQtyTurnTimeText;
        vm.customerPackingSlipShipping.refRFQGroupID = objData.refRFQGroupID;
        vm.customerPackingSlipShipping.refRFQQtyTurnTimeID = objData.refRFQQtyTurnTimeID;
        vm.customerPackingSlipShipping.refBlanketPONumber = objData.refBlanketPONumber;
        vm.customerPackingSlipShipping.poReleaseNumber = objData.poReleaseNumber;
        vm.customerPackingSlipShipping.releaseNotes = objData.releaseNotes;
        vm.customerPackingSlipShipping.componentStockType = objData.componentStockType;
      }
      if (!vm.customerPackingSlipShipping.id) {
        vm.customerPackingSlipShipping.refBlanketPONumber = item.poNumber;
        vm.customerPackingSlipShipping.poReleaseNumber = item.poReleaseNumber;
        vm.customerPackingSlipShipping.refSalesorderDetid = item.sDetId;
        vm.customerPackingSlipShipping.standrads = vm.customerPackingSlipShipping.standrads ? vm.customerPackingSlipShipping.standrads : item.standards;
        vm.customerPackingSlipShipping.partId = item.partID;
        vm.customerPackingSlipShipping.unitPrice = vm.customerPackingSlipShipping.unitPrice ? vm.customerPackingSlipShipping.unitPrice : item.price;
        vm.customerPackingSlipShipping.custPOLineID = item.custPOLineNumber;
        vm.customerPackingSlipShipping.poQty = item.poQty;
        vm.customerPackingSlipShipping.nickName = item.nickName;
        vm.customerPackingSlipShipping.custAssyPN = item.custAssyPN;
        vm.customerPackingSlipShipping.shippingId = item.shippingID;
        //vm.customerPackingSlipShipping.assyDescription = item.mfgpndescription;
        vm.customerPackingSlipShipping.assyDescription = vm.customerPackingSlipShipping.assyDescription ? vm.customerPackingSlipShipping.assyDescription : item.partDescription;
        vm.customerPackingSlipShipping.shippingNotes = vm.customerPackingSlipShipping.shippingNotes ? vm.customerPackingSlipShipping.shippingNotes : item.remark;
        vm.customerPackingSlipShipping.internalComment = vm.customerPackingSlipShipping.internalComment ? vm.customerPackingSlipShipping.internalComment : item.internalComment;
        if (!vm.customerPackingSlipShipping.shippingNotes) {
          getShippingCommentList(item.partID);
        }
        if (!vm.customerPackingSlipShipping.internalComment) {
          getPartInternalCommentList(item.id);
        }
        // while PS from SO need to allow to change group details / quote details
        if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.customerPackingSlipShipping.partId && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
          getrfqQuoteGroupList(vm.customerPackingSlipShipping.partId);
        }
        if ((vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
          getQtyTurnTimeByAssyId(vm.customerPackingSlipShipping.partId);
        }
      }
      vm.customerPackingSlipShipping.partType = item.partType;
      vm.customerPackingSlipShipping.isComponent = vm.customerPackingSlipShipping.partType === vm.partCategoryConst.Component;
      vm.customerPackingSlipShipping.mfgType = item.mfgType;
      if (!vm.customerPackingSlipShipping.componentStockType && !vm.customerPackingSlipShipping.id && vm.customerPackingSlipShipping.isComponent) {
        vm.customerPackingSlipShipping.componentStockType = false;
      }
      if (!objData && !vm.customerPackingSlipShipping.isCustom && (!(vm.recordUpdate || vm.recordView))) {
        vm.customerPackingSlipShipping.componentStockType = true;
      }
      if (objData) {
        getShippedAssemblyList(objData.id, objData.shippingId).then(() => {
          if (vm.customerPackingSlipShipping.isComponent && vm.customerPackingSlipShipping.componentStockType) {
            getComponentUMIDList();
          }
        });
      } else {
        getComponentUMIDList();
      }
      //const objShip = _.find(vm.sourceData, (sData) => sData.refSalesorderDetid === item.sDetId && sData.shippingId === item.shippingID);
      //if (objShip && !vm.customerPackingSlipShipping.id) {
      //  vm.customerPackingSlipShipping.assyDescription = objShip.assyDescription;
      //}
      /* if new detail record then shipping method and address from sales order po shipping line level (for PO type packing slip)
       * if already added packing slip detail then add and method is same as packing slip data * */

      vm.customerPackingSlipShipping.partCategory = item.partCategory;
      if (vm.customerPackingSlipShipping.partCategory === CORE.PartCategory.SubAssembly) {
        vm.customerPackingSlipShipping.partTypeText = CORE.PartCategoryName.Assembly;
      } else if (vm.customerPackingSlipShipping.partCategory === CORE.PartCategory.Component) {
        vm.customerPackingSlipShipping.partTypeText = CORE.PartCategoryName.Component;
      }
      if (vm.customerPackingSlipShipping.isShipForOtherCharges) {
        if (!vm.customerPackingSlipShipping.id) {
          vm.customerPackingSlipShipping.shipQty = item.poQty || 0;
          vm.customerPackingSlipShipping.poQty = item.poQty || 0;
        }
        // Get Shipped Packing slip Details (other than current packing slip)
        vm.pendingShipQtyList = [];
        getAlreadyShippedQty(item.partID, item.sDetId, item.shippingID);
      } else {
        //if (objData && !vm.customerPackingSlipShipping.id) {
        //  // Get Already Shipped Assembly list from current packing slip
        //  // getShippedAssemblyList(objData.id, objData.shippingId).then(() => {
        //  getAssyQtyPeningShipDeatils(item.partID);
        //  // });
        //} else {
        getAssyQtyPeningShipDeatils(item.partID);
        // }
        // Get Shipped Packing slip Details (other than current packing slip)
        getAlreadyShippedQty(item.partID, item.sDetId, item.shippingID);
        // get assembly stock details with adjustment
        getAssemblyStockStatusList(vm.customerPackingSlipShipping.partId);
      }
      $timeout(() => {
        setFocus('description');
      });
    };

    function resetPackingSlipDetForm() {
      vm.isFocus = false;
      if (vm.customerPackingSlipDetForm) {
        vm.customerPackingSlipDetForm.$setPristine();
        vm.customerPackingSlipDetForm.$setUntouched();
        vm.customerPackingSlipDetForm.$invalid = false;
        vm.customerPackingSlipDetForm.$valid = true;
        vm.isFocus = true;
      }
      vm.pendingShipQtyList = [];
      vm.customerPackingSlipShipping = {
        materialType: true
      };
      vm.selectedMaterialType = true;
    }

    /** Redirect to UOM page */
    vm.goToUomList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };

    /** Redirect to part master page */
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };
    /** Redirect to part master page */
    vm.goToWorkOrder = (id) => {
      BaseService.goToWorkorderDetails(id);
    };
    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer contact person detailvm.customerslip.customerID
     */
    // eslint-disable-next-line arrow-body-style
    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: vm.customerslip.customerID,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        if (!vm.ContactPersonList || vm.ContactPersonList.length === 0) {
          vm.ContactPersonOtherDet.showContPersonEmptyState = true;
        } else {
          vm.ContactPersonOtherDet.showContPersonEmptyState = false;
        }
        customerContactPersonDetail(vm.customerslip.contactPersonId);
        return $q.resolve(vm.ContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //contact person details
    const customerContactPersonDetail = (id) => {
      if (id) {
        vm.contactpersondetail = _.find(vm.ContactPersonList, (item) => item.personId === id);
        vm.contactPersonID = vm.contactpersondetail ? vm.contactpersondetail.personId : null;
        vm.customerslip.contactPersonId = vm.contactPersonID;
        vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.customerslip.contactPersonId;
      }
      else {
        const defaultContPerosn = _.find(vm.ContactPersonList, (contPerson) => contPerson.isDefault);
        vm.contactpersondetail = defaultContPerosn ? defaultContPerosn : vm.ContactPersonList[0];
        vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.contactpersondetail.personId;
      }
    };
    //edit contact person details
    vm.EditPerson = (ev, personDetils) => {
      if (personDetils) {
        vm.contactPersonID = vm.contactpersondetail ? vm.contactpersondetail.personId : null;
        const CustomerContactPersonPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(CustomerContactPersonPromise).then(() => {
          customerContactPersonDetail(vm.contactpersondetail.personId);
          // Static code to enable save button
          vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // open select contact person  list
    vm.selectContactPerson = (ev, contactpersondetail) => {
      if (contactpersondetail) {
        const CustomerContactPersonPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(CustomerContactPersonPromise).then(() => {
          customerContactPersonDetail(contactpersondetail.personId);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //add edit intermediate address contact person
    vm.addEditInterAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      addressType = 'I';
      vm.addEditAddressContactPersonCallBack(ev, callBackData, addressType);
    };

    //add edit address contact person
    vm.addEditAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      if (callBackData) {
        if (addressType === CORE.AddressType.BillingAddress) {
          vm.customerslip.billingContactPersonID = callBackData.personId;
          vm.customerslip.billingContactPerson = null;
        } else if (addressType === CORE.AddressType.IntermediateAddress) {
          vm.customerslip.intermediateContactPersonID = callBackData.personId;
          vm.customerslip.intermediateContactPerson = null;
        } else {
          vm.customerslip.shippingContactPersonID = callBackData.personId;
          vm.customerslip.shippingContactPerson = null;
        }
        const CustomerContactPersonPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(CustomerContactPersonPromise).then(() => {
          if (addressType === CORE.AddressType.BillingAddress) {
            vm.BillingAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackData);
            vm.customerslip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
          } else if (addressType === CORE.AddressType.IntermediateAddress) {
            vm.IntermediateAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackData);
            vm.customerslip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
          } else {
            vm.ShippingAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackData);
            vm.customerslip.shippingContactPerson = null;
          }
          // Static code to enable save button
          vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // open  intermediate select contact person  list
    vm.selectInterAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      addressType = 'I';
      vm.selectAddressContactPersonCallBack(ev, callBackData, addressType);
    };

    // open select contact person  list
    vm.selectAddressContactPersonCallBack = (ev, callBackData, addressType) => {
      if (callBackData) {
        if (addressType === CORE.AddressType.BillingAddress) {
          vm.BillingAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.BillingAddress.contactPerson;
          vm.customerslip.billingContactPersonID = callBackData.personId;
          vm.billToOtherDet.alreadySelectedPersonId = callBackData.personId;
          if (!vm.customerslip.billingContactPerson || vm.customerslip.billingContactPersonID !== vm.Copycustomerslip.billingContactPersonID) {
            vm.customerslip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
          }
        } else if (addressType === CORE.AddressType.ShippingAddress) {
          vm.ShippingAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.ShippingAddress.contactPerson;
          vm.customerslip.shippingContactPersonID = callBackData.personId;
          vm.shipToOtherDet.alreadySelectedPersonId = callBackData.personId;
          if (!vm.customerslip.shippingContactPerson || vm.customerslip.shippingContactPersonID !== vm.Copycustomerslip.shippingContactPersonID) {
            vm.customerslip.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.ShippingAddressContactPerson);
          }
        } else if (addressType === CORE.AddressType.IntermediateAddress) {
          vm.IntermediateAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.IntermediateAddress.contactPerson;
          vm.customerslip.intermediateContactPersonID = callBackData.personId;
          vm.intermediateToOtherDet.alreadySelectedPersonId = callBackData.personId;
          if (!vm.customerslip.intermediateContactPerson || vm.customerslip.intermediateContactPersonID !== vm.Copycustomerslip.intermediateContactPersonID) {
            vm.customerslip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
          }
        }
        // Static code to enable save button
        vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
      }
    };

    // delete intermediate contact person call back
    vm.deleteInterAddrContanctPersonCallBack = (ev, callBackData) => {
      callBackData.addressType = 'I';
      vm.deleteAddrContanctPersonCallBack(ev, callBackData);
    };

    // delete contact person call back
    vm.deleteAddrContanctPersonCallBack = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      if (callBackData.addressType === CORE.AddressType.BillingAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.BillingAddress);
      } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      } else {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.ShippingAddress);
      }
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callBackData.addressType === CORE.AddressType.BillingAddress) {
            vm.BillingAddressContactPerson = null;
            vm.customerslip.billingContactPerson = null;
            vm.customerslip.billingContactPersonID = null;
            vm.customerslip.billingContactPersonObj = null;
          } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.IntermediateAddressContactPerson = null;
            vm.customerslip.intermediateContactPerson = null;
            vm.customerslip.intermediateContactPersonID = null;
            vm.customerslip.intermediateContactPersonObj = null;
          } else {
            vm.ShippingAddressContactPerson = null;
            vm.customerslip.shippingContactPerson = null;
            vm.customerslip.shippingContactPersonID = null;
            vm.customerslip.shippingContactPersonObj = null;
          }
          vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer address
     */
    // eslint-disable-next-line arrow-body-style
    const getCustomerAddress = (id, addressType) => CustomerFactory.customerAddressList().query({
      customerId: id || vm.customerslip.customerID,
      addressType: [CORE.AddressType.ShippingAddress, CORE.AddressType.BillingAddress, CORE.AddressType.IntermediateAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      vm.ContactAddress = customeraddress.data;
      vm.ShippingAddressList = _.filter(vm.ContactAddress, (item) => item.addressType === 'S');
      vm.BillingAddressList = _.filter(vm.ContactAddress, (item) => item.addressType === 'B');
      vm.intermediateAddressList = _.filter(vm.ContactAddress, (item) => item.addressType === CORE.AddressType.IntermediateAddress);
      if ((!vm.ShippingAddressList) || (vm.ShippingAddressList && vm.ShippingAddressList.length === 0)) {
        vm.shipToOtherDet.showAddressEmptyState = true;
      } else {
        vm.shipToOtherDet.showAddressEmptyState = false;
      }
      if ((!vm.BillingAddressList) || (vm.BillingAddressList && vm.BillingAddressList.length === 0)) {
        vm.billToOtherDet.showAddressEmptyState = true;
      } else {
        vm.billToOtherDet.showAddressEmptyState = false;
      }
      if ((!vm.intermediateAddressList) || (vm.intermediateAddressList && vm.intermediateAddressList.length === 0)) {
        vm.intermediateToOtherDet.showAddressEmptyState = true;
      } else {
        vm.intermediateToOtherDet.showAddressEmptyState = false;
      }
      if (id && addressType) {
        if (addressType === CORE.AddressType.BillingAddress) {
          billingAddressDetail(vm.customerslip.billToId, vm.customerslip.billingContactPersonID);
        }
        if (addressType === CORE.AddressType.ShippingAddress) {
          shippingAddressDetail(vm.customerslip.shipToId, vm.customerslip.shippingContactPersonID);
        }
        if (addressType === CORE.AddressType.IntermediateAddress) {
          IntermediateAddressDetail(vm.customerslip.intermediateShipmentId, vm.customerslip.intermediateContactPersonID);
        }
      }
      if (id && !addressType) {
        billingAddressDetail(vm.customerslip.billToId, vm.customerslip.billingContactPersonID);
        shippingAddressDetail(vm.customerslip.shipToId, vm.customerslip.shippingContactPersonID);
        IntermediateAddressDetail(vm.customerslip.intermediateShipmentId, vm.customerslip.intermediateContactPersonID);
      }
      return $q.resolve(vm.ContactAddress);
    }).catch((error) => BaseService.getErrorLog(error));

    // common error code
    const checkErrorDetail = (address, type) => {
      if (!isopenpopup && address && address.replace(/<br\/>/g, '\r').length > maxAddressLength) {
        isopenpopup = true;
        const messageConstant = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADDRESS_MAX_LENGTH_VALIDATION);
        messageConstant.message = stringFormat(messageConstant.message, type, maxAddressLength, address.replace(/<br\/>/g, '\r').length);
        const obj = {
          multiple: true,
          messageContent: messageConstant
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          isopenpopup = false;
        });
        return 1;
      }
      return 0;
    };

    //shipping address
    const shippingAddressDetail = (id, contactPersonId) => {
      if (id) {
        vm.shipToOtherDet.alreadySelectedAddressID = id;
        vm.ShippingAddress = _.find(vm.ShippingAddressList, (item) => item.id === id);
        if (vm.ShippingAddress && ((vm.customerslip.id && (vm.Copycustomerslip.shippingContactPersonID || vm.Copycustomerslip.shipToId !== vm.customerslip.shipToId)) || !vm.customerslip.id)) {
          vm.ShippingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.ShippingAddress.contactPerson;
          vm.customerslip.shippingContactPersonID = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
          vm.shipToOtherDet.alreadySelectedPersonId = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
        }
        if (!vm.ShippingAddress) {
          const shipplingaddress = _.find(vm.ShippingAddressList, (item) => item.isDefault === true);
          vm.ShippingAddress = shipplingaddress ? shipplingaddress : vm.ShippingAddressList[0];
        }
        vm.customerslip.shippingAddressObj = vm.ShippingAddress;
        vm.customerslip.shippingContactPersonObj = vm.ShippingAddressContactPerson;

        if (!vm.customerslip.shippingAddress) {
          vm.customerslip.shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress);
        }
        if (!vm.customerslip.shippingContactPerson || (vm.Copycustomerslip && vm.customerslip.shippingContactPersonID !== vm.Copycustomerslip.shippingContactPersonID)) {
          vm.customerslip.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.ShippingAddressContactPerson);
        }
        if (checkErrorDetail(vm.customerslip.shippingAddress, vm.LabelConstant.Address.ShippingAddress)) {
          vm.customerslip.shippingAddress = null;
          vm.customerslip.shipToId = null;
          vm.ShippingAddress = null;
          vm.customerslip.shippingAddressObj = null;
        }
        if ((vm.Copycustomerslip && vm.Copycustomerslip.shipToId !== vm.customerslip.shipToId) && (vm.customerslip.carrierID || vm.customerslip.carrierAccountNumber || vm.customerslip.shippingMethodID) && (vm.ShippingAddress.carrierAccountNumber || vm.ShippingAddress.carrierID || vm.ShippingAddress.shippingMethodID)) {
          commonShippingMethodConfirm(true);
        }
      } else if (!vm.custPackingSlipID) {
        const shippingaddress = _.find(vm.ShippingAddressList, (item) => item.isDefault === true);
        vm.ShippingAddress = shippingaddress ? shippingaddress : vm.ShippingAddressList[0];
        if (vm.ShippingAddress) {
          vm.customerslip.shipToId = vm.ShippingAddress.id;
          vm.ShippingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.ShippingAddress.contactPerson;
          vm.customerslip.shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress);
          if (checkErrorDetail(vm.customerslip.shippingAddress, vm.LabelConstant.Address.ShippingAddress)) {
            vm.customerslip.shippingAddress = null;
            vm.customerslip.shipToId = null;
            vm.ShippingAddress = null;
            vm.customerslip.shippingAddressObj = null;
          }
        }
        vm.shipToOtherDet.alreadySelectedAddressID = vm.ShippingAddress ? vm.ShippingAddress.id : null;
        vm.shipToOtherDet.alreadySelectedPersonId = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
        vm.customerslip.shippingAddressObj = vm.ShippingAddress;
        vm.customerslip.shippingContactPersonObj = vm.ShippingAddressContactPerson;
        vm.customerslip.shippingContactPersonID = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
        if (!vm.customerslip.shippingContactPerson) {
          vm.customerslip.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.ShippingAddressContactPerson);
        }
      }
    };

    //billling Address
    let isopenpopup = false;
    const billingAddressDetail = (id, contactPersonId) => {
      if (id) {
        vm.billToOtherDet.alreadySelectedAddressID = id;
        vm.BillingAddress = _.find(vm.BillingAddressList, (item) => item.id === id);
        if (vm.BillingAddress && ((vm.customerslip.id && (vm.Copycustomerslip.billingContactPersonID || vm.Copycustomerslip.billToId !== vm.customerslip.billToId)) || !vm.customerslip.id)) {
          vm.BillingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.BillingAddress.contactPerson;
          vm.customerslip.billingContactPersonID = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
          vm.billToOtherDet.alreadySelectedPersonId = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
        }
        if (!vm.BillingAddress) {
          const billingaddress = _.find(vm.BillingAddressList, (item) => item.isDefault === true);
          vm.BillingAddress = billingaddress ? billingaddress : vm.BillingAddressList[0];
        }
        vm.customerslip.billingAddressObj = vm.BillingAddress;
        vm.customerslip.billingContactPersonObj = vm.BillingAddressContactPerson;

        if (!vm.customerslip.billingAddress) {
          vm.customerslip.billingAddress = BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress);
        }
        if (!vm.customerslip.billingContactPerson || (vm.Copycustomerslip && vm.customerslip.billingContactPersonID !== vm.Copycustomerslip.billingContactPersonID)) {
          vm.customerslip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
        }
        if (checkErrorDetail(vm.customerslip.billingAddress, vm.LabelConstant.Address.BillingAddress)) {
          vm.customerslip.billingAddress = null;
          vm.customerslip.billToId = null;
          vm.BillingAddress = null;
          vm.customerslip.billingAddressObj = null;
        };
      } else if (!vm.custPackingSlipID) {
        const billingaddress = _.find(vm.BillingAddressList, (item) => item.isDefault === true);
        vm.BillingAddress = billingaddress ? billingaddress : vm.BillingAddressList[0];
        if (vm.BillingAddress) {
          vm.customerslip.billToId = vm.BillingAddress.id;
          vm.BillingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.BillingAddress.contactPerson;
          vm.customerslip.billingAddress = BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress);
          if (checkErrorDetail(vm.customerslip.billingAddress, vm.LabelConstant.Address.BillingAddress)) {
            vm.customerslip.billingAddress = null;
            vm.customerslip.billToId = null;
            vm.BillingAddress = null;
            vm.customerslip.billingAddressObj = null;
          }
          vm.billToOtherDet.alreadySelectedAddressID = vm.BillingAddress ? vm.BillingAddress.id : null;
          vm.billToOtherDet.alreadySelectedPersonId = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
        }
        vm.customerslip.billingAddressObj = vm.BillingAddress;
        vm.customerslip.billingContactPersonObj = vm.BillingAddressContactPerson;
        vm.customerslip.billingContactPersonID = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
        if (!vm.customerslip.billingContactPerson) {
          vm.customerslip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
        }
      }
    };

    //intermediate address
    const IntermediateAddressDetail = (id, contactPersonId) => {
      if (id) {
        vm.intermediateToOtherDet.alreadySelectedAddressID = id;
        vm.IntermediateAddress = _.find(vm.intermediateAddressList, (item) => item.id === id);
        // vm.IntermediateAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.IntermediateAddress.contactPerson;
        if (vm.IntermediateAddress && ((vm.customerslip.id && (vm.Copycustomerslip.intermediateContactPersonID || vm.Copycustomerslip.intermediateShipmentId !== vm.customerslip.intermediateShipmentId)) || !vm.customerslip.id)) {
          vm.IntermediateAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.IntermediateAddress.contactPerson;
          vm.customerslip.intermediateContactPersonID = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
          vm.intermediateToOtherDet.alreadySelectedPersonId = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
        }
        if (!vm.IntermediateAddress) {
          vm.IntermediateAddress = null;
          vm.IntermediateAddressContactPerson = null;
          vm.customerslip.intermediateContactPersonID = null;
          vm.intermediateToOtherDet.alreadySelectedPersonId = null;
        }
        vm.customerslip.intermediateAddressObj = vm.IntermediateAddress;
        vm.customerslip.intermediateContactPersonObj = vm.IntermediateAddressContactPerson;
        if (!vm.customerslip.intermediateAddress) {
          vm.customerslip.intermediateAddress = BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress);
        }
        if (!vm.customerslip.intermediateContactPerson || (vm.Copycustomerslip && vm.customerslip.intermediateContactPersonID !== vm.Copycustomerslip.intermediateContactPersonID)) {
          vm.customerslip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
        }
        if (checkErrorDetail(vm.customerslip.intermediateAddress, vm.LabelConstant.Address.MarkForAddress)) {
          vm.customerslip.intermediateAddress = null;
          vm.customerslip.intermediateShipmentId = null;
          vm.IntermediateAddress = null;
          vm.customerslip.intermediateAddressObj = null;
        };
      } else if (!vm.custPackingSlipID) {
        if (vm.ShippingAddress && vm.ShippingAddress.defaultIntermediateAddressID) {
          // mark for address
          const defaultMarkForAddrDet = _.find(vm.intermediateAddressList, (addrItem) => addrItem.id === vm.ShippingAddress.defaultIntermediateAddressID);
          vm.IntermediateAddress = defaultMarkForAddrDet;
          if (vm.IntermediateAddress) {
            vm.customerslip.intermediateShipmentId = vm.IntermediateAddress.id;
            vm.IntermediateAddressContactPerson =  _.find(vm.ContactPersonList, (item) => item.personId === vm.ShippingAddress.defaultIntermediateContactPersonID) || null;
            vm.customerslip.intermediateAddress = BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress);
            if (checkErrorDetail(vm.customerslip.intermediateAddress, vm.LabelConstant.Address.MarkForAddress)) {
              vm.IntermediateAddress = null;
              vm.customerslip.intermediateAddress = null;
              vm.customerslip.intermediateShipmentId = null;
              vm.customerslip.intermediateAddressObj = null;
            }
          }
          vm.intermediateToOtherDet.alreadySelectedAddressID = vm.IntermediateAddress ? vm.IntermediateAddress.id : null;
          vm.intermediateToOtherDet.alreadySelectedPersonId = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
          vm.customerslip.intermediateAddressObj = vm.IntermediateAddress;
          vm.customerslip.intermediateContactPersonObj = vm.IntermediateAddressContactPerson;
          vm.customerslip.intermediateContactPersonID = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
          if (!vm.customerslip.intermediateContactPerson) {
            vm.customerslip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
          }
        }
      }
    };

    // open select intermediate Addresses popup
    vm.selectInterAddressCallBack = (ev, callBackAddress) => {
      //callBackAddress.addressType = 'I';
      vm.selectAddressCallBack(ev, callBackAddress);
    };

    // open select Addresses popup
    vm.selectAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        if (callBackAddress.addressType === CORE.AddressType.BillingAddress) {
          vm.customerslip.billToId = callBackAddress.id;
          vm.customerslip.billingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (!_.find(vm.BillingAddressList, (item) => item.id === callBackAddress.id)) {
            vm.BillingAddressList.push(callBackAddress);
          }
          billingAddressDetail(callBackAddress.id, vm.customerslip.billingContactPersonID);
        } else if (callBackAddress.addressType === CORE.AddressType.ShippingAddress) {
          vm.customerslip.shipToId = callBackAddress.id;
          vm.customerslip.shippingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (!_.find(vm.ShippingAddressList, (item) => item.id === callBackAddress.id)) {
            vm.ShippingAddressList.push(callBackAddress);
          }
          shippingAddressDetail(callBackAddress.id, vm.customerslip.shippingContactPersonID);
          if (!vm.customerslip.id) {
            commonShippingMethodConfirm(false);
            IntermediateAddressDetail(null, null); // to set intermediate address based on shipping address
          }
        } else if (callBackAddress.addressType === CORE.AddressType.IntermediateAddress) {
          vm.customerslip.intermediateShipmentId = callBackAddress.id;
          vm.customerslip.intermediateContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (!_.find(vm.intermediateAddressList, (item) => item.id === callBackAddress.id)) {
            vm.intermediateAddressList.push(callBackAddress);
          }
          IntermediateAddressDetail(callBackAddress.id, vm.customerslip.intermediateContactPersonID);
        }
        // Static code to enable save button
        vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
      }
      setFocus('packingSlipComment');
    };

    // open intermediate addEdit Addresses popup
    vm.addEditInterAddressCallBack = (ev, callBackAddress) => {
      //callBackAddress.addressType = 'I';
      vm.addEditAddressCallBack(ev, callBackAddress);
    };

    // open addEdit Addresses popup
    vm.addEditAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        if (callBackAddress.addressType === CORE.AddressType.BillingAddress) {
          vm.customerslip.billToId = callBackAddress.id;
          vm.customerslip.billingContactPersonID = callBackAddress && callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.customerslip.billingAddress = null;
        } else if (callBackAddress.addressType === CORE.AddressType.IntermediateAddress) {
          vm.customerslip.intermediateShipmentId = callBackAddress.id;
          vm.customerslip.intermediateContactPersonID = callBackAddress && callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.customerslip.intermediateAddress = null;
        }
        else {
          vm.customerslip.shipToId = callBackAddress.id;
          vm.customerslip.shippingContactPersonID = callBackAddress && callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          vm.customerslip.shippingAddress = null;
        }
        const addressPromise = [getCustomerContactPersonList(), getCustomerAddress(vm.customerslip.customerID)];
        vm.cgBusyLoading = $q.all(addressPromise).then(() => {
          if (callBackAddress) {
            // Static code to enable save button
            vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // delete intermediate Addresses popup
    vm.deleteInterAddressCallBack = (ev, callBackAddress) => {
      //callBackAddress.addressType = 'I';
      vm.deleteAddressCallBack(ev, callBackAddress);
    };

    vm.deleteAddressCallBack = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      if (callBackData.addressType === CORE.AddressType.BillingAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.BillingAddress);
      } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      } else {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.ShippingAddress);
      }
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callBackData.addressType === CORE.AddressType.BillingAddress) {
            vm.BillingAddress = null;
            vm.BillingAddressContactPerson = null;
            vm.customerslip.billToId = null;
            vm.customerslip.billingAddressObj = null;
            vm.customerslip.billingContactPersonID = null;
            vm.customerslip.billingContactPersonObj = null;
            vm.billToOtherDet.alreadySelectedAddressID = null;
          } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.InternmediateAddress = null;
            vm.IntermediateAddressContactPerson = null;
            vm.customerslip.intermediateShipmentId = null;
            vm.customerslip.intermediateAddress = null;
            vm.customerslip.intermediateAddressObj = null;
            vm.customerslip.intermediateContactPerson = null;
            vm.customerslip.intermediateContactPersonID = null;
            vm.customerslip.intermediateContactPersonObj = null;
            vm.intermediateToOtherDet.alreadySelectedAddressID = null;
          } else {
            vm.ShippingAddress = null;
            vm.ShippingAddressContactPerson = null;
            vm.customerslip.shipToId = null;
            vm.customerslip.shippingAddress = null;
            vm.customerslip.shippingAddressObj = null;
            vm.customerslip.shippingContactPerson = null;
            vm.customerslip.shippingContactPersonID = null;
            vm.customerslip.shippingContactPersonObj = null;
            vm.shipToOtherDet.alreadySelectedAddressID = null;
          }
          vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    //get max length validations
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //call back function
    const focusoncallback = () => {
      vm.isFocus = true;
      vm.customerslip.status = CORE.CustomerPackingSlipStatusID.Draft;
      vm.customerslip.subStatus = CORE.CustomerPackingSlipSubStatusID.Draft;
    };

    //save customer packing slip detail
    vm.saveCustomerPackingSlip = () => {
      if (BaseService.focusRequiredField(vm.frmCustomerPackingSlip)) {
        if (vm.custPackingSlipID) {
          vm.customerslip.status = vm.Copycustomerslip.status;
          vm.customerslip.subStatus = vm.Copycustomerslip.subStatus;
        } else {
          vm.customerslip.status = CORE.CustomerPackingSlipStatusID.Draft;
          vm.customerslip.subStatus = CORE.CustomerPackingSlipSubStatusID.Draft;
        }
        return;
      }
      if (vm.trackingNumberDet.trackNumber) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRACKING_NUM_ENTERED_NOT_ADDED);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            // added to check PO/SO against MISC packing slip
            checkMiscPackingSlipForSOPONumber();
          }
        }, () => {
          vm.isFormDirtyManual = false;
          setFocus('trackingNumber');
          return;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        checkMiscPackingSlipForSOPONumber();
        //if (vm.custPackingSlipID) {
        //  checkinvoice();
        //} else {
        //  customerPackingSlipInvoiceCheck();
        //}
      }
    };

    const customerPackingSlipInvoiceCheck = () => {
      if (!vm.customerslip.shipToId || (!vm.customerslip.shippingContactPersonID && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        if (!vm.customerslip.shipToId) {
          messageContent.message = stringFormat(messageContent.message, 'ShipTo Address');
        } else if (!vm.customerslip.shippingContactPersonID && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft) {
          messageContent.message = stringFormat(messageContent.message, 'ShipTo Contact Person');
        }
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
        vm.isFormDirtyManual = false;
        return;
      }
      if (vm.sourceData.length === 0 && (vm.customerslip.subStatus ? vm.customerslip.subStatus : CORE.CustomerPackingSlipSubStatusID.Draft) !== CORE.CustomerPackingSlipSubStatusID.Draft) {
        const obj = {
          multiple: true,
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKING_STATUS_CHANGE)
        };
        DialogFactory.messageAlertDialog(obj, focusoncallback);
        vm.isFormDirtyManual = false;
        return;
      }
      if (vm.custPackingSlipID && vm.sourceData && vm.sourceData.length > 0) {
        const dataArray = _.map(vm.sourceData, _.iteratee('partId'));
        const bomPromise = [validateAssemblyByAssyID(dataArray)];
        vm.cgBusyLoading = $q.all(bomPromise).then((resData) => {
          resData = _.first(resData);
          if (resData.errorObjList && resData.errorObjList.length > 0) {
            const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
            if (errorMessage) {
              const obj = {
                multiple: true,
                title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                textContent: errorMessage
              };
              DialogFactory.alertDialog(obj);
              return;
            }
            const errorMsg = _.find(resData.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
            if (errorMsg) {
              const assyInvalidShippingList = [];
              _.each(resData.exportControlPartList, (partItem) => {
                let objAssy = {};
                objAssy = _.assign(partItem);
                const assyDets = _.find(vm.sourceData, (soDet) => soDet.partId === partItem.partID);
                if (assyDets) {
                  objAssy.PIDCode = assyDets.PIDCode;
                  objAssy.partID = assyDets.partId;
                  objAssy.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, assyDets.rohsIcon);
                  objAssy.rohsText = assyDets.rohsName;
                  objAssy.mfgPN = assyDets.mfgPN;
                  objAssy.nickName = assyDets.nickName;
                  objAssy.description = assyDets.description;
                  objAssy.isCustom = assyDets.isCustom;
                  if (assyDets.partType === vm.partCategoryConst.Component) {
                    if (assyDets.isCustom) {
                      objAssy.partTypeText = 'Custom Part';
                    } else {
                      objAssy.partTypeText = 'Off-the-shelf Part';
                    }
                  }
                  if (assyDets.isCPN) {
                    objAssy.partTypeText = 'CPN Part';
                  }
                  if (assyDets.partType === vm.partCategoryConst.SubAssembly) {
                    objAssy.partTypeText = 'Assembly';
                  }
                  objAssy.componentStandardList = assyDets.componentStandardList;
                }
                assyInvalidShippingList.push(objAssy);
              });
              if (assyInvalidShippingList.length > 0) {
                vm.customerslip.status = CORE.CustomerPackingSlipStatusID.Draft;
                vm.customerslip.subStatus = CORE.CustomerPackingSlipSubStatusID.Draft;
                const data = {
                  assyList: assyInvalidShippingList,
                  CustomerPackingSlipNumber: vm.customerslip.packingSlipNumber,
                  errorMessage: errorMsg.errorText,
                  salesOrderNumber: vm.customerslip.soNumber,
                  revision: vm.customerslip.sorevision,
                  countryName: vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress.countryMst.countryName,
                  customerPackingID: vm.customerslip.id,
                  salesOrderID: vm.customerslip.refSalesOrderID,
                  iscustompacking: true,
                  transType: 'P'
                };
                DialogFactory.dialogService(
                  CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                  CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                  event,
                  data).then(() => {
                    if (!vm.customerslip.intermediateAddress && !vm.customerslip.intermediateShipmentId && vm.Copycustomerslip.intermediateShipmentId) {
                      vm.customerslip.intermediateAddress = vm.Copycustomerslip.intermediateAddress.replace(/\r/g, '<br/>');
                      vm.customerslip.intermediateShipmentId = vm.Copycustomerslip.intermediateShipmentId;
                    }
                  }, () => {
                    if (!vm.customerslip.intermediateAddress && !vm.customerslip.intermediateShipmentId && vm.Copycustomerslip.intermediateShipmentId) {
                      vm.customerslip.intermediateAddress = vm.Copycustomerslip.intermediateAddress.replace(/\r/g, '<br/>');
                      vm.customerslip.intermediateShipmentId = vm.Copycustomerslip.intermediateShipmentId;
                    }
                  }, (err) => BaseService.getErrorLog(err));
              } else {
                customerPackingSlipUpdate();
              }
            }
          } else {
            customerPackingSlipUpdate();
          }
        });
      } else if ((vm.custPackingSlipID && vm.Copycustomerslip.subStatus !== vm.customerslip.subStatus)) {
        customerPackingSlipUpdate();
      }
      else { confirmRevisionAndSaveHeader(false); }
    };
    //check invoice number generated or not
    const checkinvoice = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.checkGeneratedInvoiceNumber().query({ id: vm.custPackingSlipID }).$promise.then((res) => {
        if (res && res.data) {
          if (res.data.refCustInvoiceID && vm.customerslip.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVOICE_ALREADY_CREATED);
            messageContent.message = stringFormat(messageContent.message, vm.customerslip.packingSlipNumber);
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
              vm.isFormDirtyManual = false;
              vm.frmCustomerPackingSlip.$setPristine();
              getCustomerPackingSlipDetail();
            });
            return;
          } else {
            // customerPackingSlipUpdate();
            customerPackingSlipInvoiceCheck();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const customerPackingSlipUpdate = () => {
      if (!vm.customerslip.shippingAddress) {
        const obj = {
          multiple: true,
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKING_SHIP_ALERT)
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      }
      if (parseInt(vm.Copycustomerslip.subStatus) !== parseInt(vm.customerslip.subStatus)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CP_STATUS_CHANGE);
        messageContent.message = stringFormat(messageContent.message, BaseService.getCustomerPackingSlipStatus(vm.Copycustomerslip.subStatus), BaseService.getCustomerPackingSlipStatus(vm.customerslip.subStatus));
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.isStatusChange = true;
            confirmRevisionAndSaveHeader(false);
          }
        }, () => {
          vm.customerslip.status = vm.Copycustomerslip.status;
          vm.customerslip.subStatus = vm.Copycustomerslip.subStatus;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        confirmRevisionAndSaveHeader(false);
      }
    };
    // check bill of material added for sales order assembly or not
    const validateAssemblyByAssyID = (dataArray, isAssy) => {
      const checkShippingAssyList = [];
      if (!isAssy) {
        _.each(vm.sourceData, (item) => {
          const shippingCountryDetObj = {};
          shippingCountryDetObj.partID = item ? item.partId : null;
          shippingCountryDetObj.countryID = vm.IntermediateAddress && vm.IntermediateAddress.countryID ? vm.IntermediateAddress.countryID : vm.ShippingAddress && vm.ShippingAddress.countryID ? vm.ShippingAddress.countryID : 0;
          shippingCountryDetObj.countryName = vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress && vm.ShippingAddress.countryMst ? vm.ShippingAddress.countryMst.countryName : '';
          shippingCountryDetObj.qty = item ? item.shipQty : 0;
          shippingCountryDetObj.lineID = 0;
          checkShippingAssyList.push(shippingCountryDetObj);
        });
      } else {
        const shippingCountryDetObj = {};
        shippingCountryDetObj.partID = vm.customerPackingSlipShipping.partId;
        shippingCountryDetObj.countryID = vm.IntermediateAddress && vm.IntermediateAddress.countryID ? vm.IntermediateAddress.countryID : vm.ShippingAddress && vm.ShippingAddress.countryID ? vm.ShippingAddress.countryID : 0;
        shippingCountryDetObj.countryName = vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress && vm.ShippingAddress.countryMst ? vm.ShippingAddress.countryMst.countryName : '';
        shippingCountryDetObj.qty = vm.customerPackingSlipShipping.shipQty - (vm.shippTotal ? vm.shippTotal : 0);
        shippingCountryDetObj.lineID = 0;
        checkShippingAssyList.push(shippingCountryDetObj);
      };
      const objCheckBOM = {
        partIDs: dataArray,
        shippingAddressID: vm.IntermediateAddress && vm.IntermediateAddress.id ? vm.IntermediateAddress.id : vm.ShippingAddress ? vm.ShippingAddress.id : null,
        isFromSalesOrder: true,
        checkShippingAssyList: checkShippingAssyList,
        transType: 'P'
      };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //save customer shipping master detail
    const saveMasterShipDetail = () => {
      const isAlreadyPublished = vm.Copycustomerslip && vm.Copycustomerslip.subStatus !== vm.customerslip.subStatus && vm.Copycustomerslip.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft && (!vm.customerslip.isAlreadyPublished) ? true : vm.customerslip.isAlreadyPublished;
      const isAskForVersionConfirmation = vm.customerslip.isAlreadyPublished && vm.customerslip.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft && !vm.isStatusChange ? true : false;
      let shippingContactPerson;
      let billingContactPerson;
      let interContactPerson;
      if (!vm.customerslip.id) {
        shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.customerslip.shippingContactPersonObj);
        billingContactPerson = BaseService.generateContactPersonDetFormat(vm.customerslip.billingContactPersonObj);
        interContactPerson = BaseService.generateContactPersonDetFormat(vm.customerslip.intermediateContactPersonObj);
      } else {
        if (vm.customerslip.shippingContactPersonID && vm.customerslip.shippingContactPersonID !== vm.Copycustomerslip.shippingContactPersonID) {
          shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.customerslip.shippingContactPersonObj);
        } else {
          shippingContactPerson = vm.customerslip.shippingContactPersonID ? vm.Copycustomerslip.shippingContactPerson : null;
        }
        if (vm.customerslip.billingContactPersonID && vm.customerslip.billingContactPersonID !== vm.Copycustomerslip.billingContactPersonID) {
          billingContactPerson = BaseService.generateContactPersonDetFormat(vm.customerslip.shippingContactPersonObj);
        } else {
          billingContactPerson = vm.customerslip.billingContactPersonID ? vm.Copycustomerslip.billingContactPerson : null;
        }
        if (vm.customerslip.intermediateContactPersonID && vm.customerslip.intermediateContactPersonID !== vm.Copycustomerslip.intermediateContactPersonID) {
          interContactPerson = BaseService.generateContactPersonDetFormat(vm.customerslip.shippingContactPersonObj);
        } else {
          interContactPerson = vm.customerslip.intermediateContactPersonID ? vm.Copycustomerslip.intermediateContactPerson : null;
        }
      }
      const objCustomerPacking = {
        id: vm.customerslip.id,
        customerID: vm.customerslip.customerID,
        packingSlipType: vm.customerslip.packingSlipType,
        transType: CORE.TRANSACTION_TYPE.PACKINGSLIP,
        status: vm.customerslip.status,
        subStatus: vm.customerslip.subStatus,
        refSalesOrderID: vm.customerslip.refSalesOrderID,
        poNumber: vm.customerslip.poNumber,
        poDate: BaseService.getAPIFormatedDate(vm.customerslip.poDate),
        soNumber: vm.customerslip.soNumber,
        soDate: BaseService.getAPIFormatedDate(vm.customerslip.soDate),
        packingSlipNumber: vm.customerslip.packingSlipNumber,
        packingSlipDate: BaseService.getAPIFormatedDate(vm.customerslip.packingSlipDate),
        shippingMethodId: vm.autoCompleteShipping.keyColumnId,
        freeOnBoardId: vm.autoCompleteFOB.keyColumnId,
        shipToId: vm.customerslip.shipToId,
        contactPersonId: vm.customerslip.contactPersonId,
        packingSlipComment: vm.customerslip.packingSlipComment,
        sorevision: vm.customerslip.sorevision,
        intermediateShipmentId: vm.customerslip.intermediateShipmentId,
        packingSlipStatus: TRANSACTION.PackingSlipStatus.WAITINGFORINVOICE,
        billToId: vm.customerslip.billToId,
        salesCommissionTo: vm.autoCompleteSalesCommosssionTo.keyColumnId,
        termsID: vm.autoCompleteTerm.keyColumnId,
        trackingNumberList: vm.customerslip.customerPackingSlipTrackNumber,
        removeTrackingNumberIds: vm.customerslip.removeCustomerPackingSlipTrackNumberIds,
        billingAddress: (!vm.customerslip.id) ? BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress) : (vm.customerslip.billToId && vm.customerslip.billToId !== vm.Copycustomerslip.billToId ? (BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress) || null) : vm.Copycustomerslip.billingAddress),
        shippingAddress: (!vm.customerslip.id) ? BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress) : (vm.customerslip.shipToId && vm.customerslip.shipToId !== vm.Copycustomerslip.shipToId ? (BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress) || null) : vm.Copycustomerslip.shippingAddress),
        intermediateAddress: (!vm.customerslip.id) ? BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress) : vm.customerslip.intermediateShipmentId && vm.customerslip.intermediateShipmentId !== vm.Copycustomerslip.intermediateShipmentId ? BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress) || null : vm.Copycustomerslip.intermediateAddress,
        headerComment: vm.customerslip.headerComment,
        refInvoiceId: vm.customerslip.refCustInvoiceID,
        removeInvoiceTrackingNumbers: vm.customerslip.removeCustomerInvTrackNumbers,
        revision: vm.customerslip.revision || '0',
        isAlreadyPublished: isAlreadyPublished,
        poRevision: vm.customerslip.poRevision,
        isAskForVersionConfirmation: isAskForVersionConfirmation, // flag only set when changes done in draft mode(second time)
        carrierID: vm.autoCompleteCarriers ? vm.autoCompleteCarriers.keyColumnId : null,
        carrierAccountNumber: vm.customerslip.carrierAccountNumber,
        billingContactPersonID: vm.customerslip.billingContactPersonID,
        shippingContactPersonID: vm.customerslip.shippingContactPersonID,
        intermediateContactPersonID: vm.customerslip.intermediateContactPersonID,
        billingContactPerson: billingContactPerson,
        shippingContactPerson: shippingContactPerson,
        intermediateContactPerson: interContactPerson
      };
      if (checkErrorDetail(vm.customerslip.billingAddress, vm.LabelConstant.Address.BillingAddress)) {
        vm.customerslip.billingAddress = null;
        vm.customerslip.billToId = null;
        vm.BillingAddress = null;
        return;
      } else if (checkErrorDetail(vm.customerslip.shippingAddress, vm.LabelConstant.Address.ShippingAddress)) {
        vm.customerslip.shippingAddress = null;
        vm.customerslip.shipToId = null;
        vm.ShippingAddress = null;
        return;
      } else if (checkErrorDetail(vm.customerslip.intermediateAddress, vm.LabelConstant.Address.MarkForAddress)) {
        vm.customerslip.intermediateAddress = null;
        vm.customerslip.intermediateShipmentId = null;
        vm.IntermediateAddress = null;
        return;
      };
      if (objCustomerPacking.billingAddress) {
        objCustomerPacking.billingAddress = objCustomerPacking.billingAddress.replace(/<br\/>/g, '\r');
      }
      if (objCustomerPacking.shippingAddress) {
        objCustomerPacking.shippingAddress = objCustomerPacking.shippingAddress.replace(/<br\/>/g, '\r');
      }
      if (objCustomerPacking.intermediateAddress) {
        objCustomerPacking.intermediateAddress = objCustomerPacking.intermediateAddress.replace(/<br\/>/g, '\r');
      }
      if (!vm.customerslip.id) {
        vm.cgBusyLoading = CustomerPackingSlipFactory.saveCustomerPackingSlip().query(objCustomerPacking).$promise.then((res) => {
          resetCustPackingSlipTrackingNumberObj();
          if (res.data) {
            if (vm.frmCustomerPackingSlip) {
              vm.frmCustomerPackingSlip.$setPristine();
            }
            $scope.$parent.vm.packingId = res.data.id;
            $scope.$parent.vm.salesOrderID = res.data.refSalesOrderID;
            $scope.$emit('CustomerPackingAutocomplete');
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, { id: res.data.id, sdetid: (res.data.refSalesOrderID || 0) }, {}, { reload: true });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.cgBusyLoading = CustomerPackingSlipFactory.updateCustomerPackingSlip().query(objCustomerPacking).$promise.then((res) => {
          resetCustPackingSlipTrackingNumberObj();
          if (res.data) {
            vm.frmCustomerPackingSlip.$setPristine();
            vm.isStatusChange = false;
            getCustomerPackingSlipDetail();
            if (vm.customerslip.status === CORE.CustomerPackingSlipStatusID.Published) {
              vm.resetShippingDetail();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    /**
     * Get Customer list
     */
    const getCustomerSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((customers) => {
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(() => {
          if (vm.autoCompletecustomer && vm.autoCompletecustomer.inputName) {
            $scope.$broadcast(vm.autoCompletecustomer.inputName, customers.data[0]);
          }
        });
      }
      return customers.data;
    }).catch((error) => BaseService.getErrorLog(error));


    //check packing slip type detail
    vm.changeSlipDetail = (type) => {
      if (vm.autoCompletePendingSOPO.keyColumnId || vm.autoCompletecustomer.keyColumnId) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGTYPE_CONFIRMATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customerslip = {
              packingSlipType: type,
              status: CORE.DisplayStatus.Draft.ID,
              packingSlipDate: vm.todayDate,
              packingSlipNumber: vm.customerslip.packingSlipNumber,
              customerPackingSlipTrackNumber: []
            };
            vm.setfocus = false;
            if (vm.autoCompleteShipping) {
              vm.autoCompleteTerm.keyColumnId = null;
              vm.autoCompleteShipping.keyColumnId = null;
              vm.autoCompleteFOB.keyColumnId = null;
              vm.autoCompleteSalesCommosssionTo.keyColumnId = null;
              vm.shippTotal = 0;
            }
            vm.autoCompletePendingSOPO.keyColumnId = null;
            vm.autoCompletecustomer.keyColumnId = null;
            vm.BillingAddress = null;
            vm.ShippingAddress = null;
            vm.IntermediateAddress = null;
            vm.contactpersondetail = null;
            vm.shippTotal = 0;
            vm.shipToOtherDet.customerId = null;
            vm.shipToOtherDet.refTransID = null;
            vm.shipToOtherDet.alreadySelectedAddressID = null;
            vm.billToOtherDet.customerId = null;
            vm.billToOtherDet.refTransID = null;
            vm.billToOtherDet.alreadySelectedAddressID = null;
            vm.intermediateToOtherDet.customerId = null;
            vm.intermediateToOtherDet.refTransID = null;
            vm.ContactPersonOtherDet.customerId = null;
            vm.ContactPersonOtherDet.refTransID = null;
            vm.ContactPersonOtherDet.alreadySelectedPersonId = null;
            vm.ContactPersonOtherDet.selectedContactPerson = null;
            vm.frmCustomerPackingSlip.$setPristine();
            vm.frmCustomerPackingSlip.$invalid = false;
            vm.frmCustomerPackingSlip.$setUntouched();
            vm.frmCustomerPackingSlip.$valid = true;
            vm.setfocus = true;
            initdateoption();
          }
        }, () => {
          vm.packingSlipType = CORE.CUSTOMER_PACKING_SLIP_TYPE[0].id === type ? CORE.CUSTOMER_PACKING_SLIP_TYPE[1].id : CORE.CUSTOMER_PACKING_SLIP_TYPE[0].id;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.customerslip.packingSlipType = type;
        if (vm.autoCompleteShipping) {
          vm.autoCompleteTerm.keyColumnId = null;
          vm.autoCompleteShipping.keyColumnId = null;
          vm.autoCompleteFOB.keyColumnId = null;
          vm.shippTotal = 0;
          vm.autoCompleteSalesCommosssionTo.keyColumnId = null;
        }
        initdateoption();
      }
      vm.isPOPackingSlip = (vm.packingSlipType === vm.customerPackingSlipType[0].id) ? true : false;
    };

    //change shipment qty
    vm.changeShipmentQty = (isFromShipQty) => {
      vm.customerPackingSlipShipping.shipQty = vm.customerPackingSlipShipping.shipQty || 0;
      vm.customerPackingSlipShipping.poQty = vm.customerPackingSlipShipping.poQty || 0;
      //vm.customerPackingSlipShipping.remainingQty = vm.customerPackingSlipShipping.poQty - (vm.customerPackingSlipShipping.shipQty > vm.customerPackingSlipShipping.poQty ? vm.customerPackingSlipShipping.poQty : vm.customerPackingSlipShipping.shipQty);
      vm.customerPackingSlipShipping.remainingQty = vm.customerPackingSlipShipping.poQty - ((vm.customerPackingSlipShipping.shipQty + (vm.shippTotal || 0)) > vm.customerPackingSlipShipping.poQty ? vm.customerPackingSlipShipping.poQty : vm.customerPackingSlipShipping.shipQty + (vm.shippTotal || 0));
      vm.customerPackingSlipShipping.releaselineRemainingQty = vm.customerPackingSlipShipping.poreleaseLineOrderQty - vm.customerPackingSlipShipping.shipQty - vm.shippReleaseLineTotal;
      if (vm.customerPackingSlipShipping.releaselineRemainingQty < 0) {
        vm.customerPackingSlipShipping.releaselineRemainingQty = 0;
      }
      if ((vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && !vm.customerPackingSlipShipping.isShipForOtherCharges) ||
        (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && vm.customerPackingSlipShipping.isShipForAssembly) ||
        (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && !vm.customerPackingSlipShipping.isComponent)) {
        //vm.customerPackingSlipShipping.shippedQty = vm.customerPackingSlipShipping.shipQty;
        vm.customerPackingSlipShipping.shippedQty = vm.customerPackingSlipShipping.poQty - vm.customerPackingSlipShipping.remainingQty;
      }
      if (((vm.customerPackingSlipShipping.isComponent && !vm.customerPackingSlipShipping.isCustom) || (!vm.customerPackingSlipShipping.materialType)) && vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
        // vm.getPartPriceBreakDetails(item.id).then(() => {
        vm.changeOtherPartQty();
        // });
      }
      if ((!isFromShipQty) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id && vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
        setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
      }
      if ((!vm.recordUpdate) && (!isFromShipQty) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
        if (vm.autoCompleteQuoteGroup.keyColumnId && vm.autocompleteAssy.keyColumnId) {
          setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
        }
      }
      if (isFromShipQty) {
        vm.calculateExtendedPrice();
      }
    };

    const checkCustomerPackingSlipDetails = (ev, requiredDet) => {
      const bomPromise = [validateAssemblyByAssyID([vm.customerPackingSlipShipping.partId], true)];
      vm.cgBusyLoading = $q.all(bomPromise).then((resData) => {
        resData = _.first(resData);
        if (resData.errorObjList && resData.errorObjList.length > 0) {
          const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
          if (errorMessage) {
            const obj = {
              multiple: true,
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: errorMessage
            };
            DialogFactory.alertDialog(obj);
            return;
          }
          const errorMsg = _.find(resData.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
          if (errorMsg) {
            const assyInvalidShippingList = [];
            _.each(resData.exportControlPartList, (partItem) => {
              let objAssy = {};
              objAssy = _.assign(partItem);
              if (partItem.partID === vm.customerPackingSlipShipping.partId) {
                objAssy.PIDCode = vm.customerPackingSlipShipping.assyID;
                objAssy.partID = vm.customerPackingSlipShipping.partId;
                objAssy.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, vm.customerPackingSlipShipping.rohsIcon);
                objAssy.rohsText = vm.customerPackingSlipShipping.rohsName;
                objAssy.mfgPN = vm.customerPackingSlipShipping.assyNumber;
                objAssy.nickName = vm.customerPackingSlipShipping.nickName;
                objAssy.description = vm.customerPackingSlipShipping.assyDescription;
                objAssy.isCustom = vm.customerPackingSlipShipping.isCustom;
                if (vm.customerPackingSlipShipping.isComponent) {
                  if (vm.customerPackingSlipShipping.isCustom) {
                    objAssy.partTypeText = 'Custom Part';
                  } else {
                    objAssy.partTypeText = 'Off-the-shelf Part';
                  }
                }
                if (vm.customerPackingSlipShipping.isCPN) {
                  objAssy.partTypeText = 'CPN Part';
                }
                if (vm.customerPackingSlipShipping.partType === vm.partCategoryConst.SubAssembly) {
                  objAssy.partTypeText = 'Assembly';
                }
                objAssy.componentStandardList = vm.customerPackingSlipShipping.standrads;
              }
              assyInvalidShippingList.push(objAssy);
            });
            if (assyInvalidShippingList.length > 0) {
              vm.customerslip.status = CORE.CustomerPackingSlipStatusID.Draft;
              const data = {
                assyList: assyInvalidShippingList,
                CustomerPackingSlipNumber: vm.customerslip.packingSlipNumber,
                errorMessage: errorMsg.errorText,
                salesOrderNumber: vm.customerslip.soNumber,
                revision: vm.customerslip.sorevision,
                countryName: vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress.countryMst.countryName,
                salesOrderID: vm.customerslip.refSalesOrderID,
                iscustompacking: true,
                transType: 'P'
              };
              DialogFactory.dialogService(
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                event,
                data).then(() => {
                }, () => {
                }, (err) => BaseService.getErrorLog(err));
            } else {
              confirmRevisionAndSaveHeader(true, ev, requiredDet);
            }
          }
        } else {
          confirmRevisionAndSaveHeader(true, ev, requiredDet);
        }
      });
    };
    //save customer packing slip details
    vm.saveCustomPackingSlipDetails = (ev, requiredDet) => {
      if (!vm.customerPackingSlipShipping.shipQty) {
        const obj = {
          multiple: true,
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKING_SLIP_REQUIRED_VALIDATION)
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && vm.customerPackingSlipShipping.isShipForOtherCharges) {
            setFocus('shipQty');
          } else if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && vm.customerPackingSlipShipping.isComponent) {
            if (vm.customerPackingSlipShipping.componentStockType) {
              setFocus('ComponentShippingQty0');
            } else {
              setFocus('shipQty');
            }
          } else if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && (vm.customerPackingSlipShipping.isShipForAssembly || vm.customerPackingSlipShipping.isComponent)) {
            if (vm.customerPackingSlipShipping.isShipForAssembly) {
              setFocus('ShippingQty' + (vm.pendingShipQtyList.length - 1));
            } else if (vm.customerPackingSlipShipping.componentStockType) {
              setFocus('ComponentShippingQty0');
            } else {
              setFocus('shipQty');
            }
          } else if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && !vm.customerPackingSlipShipping.materialType) {
            setFocus('shipQty');
          }
        });
        return;
      }

      if (BaseService.focusRequiredField(vm.customerPackingSlipDetForm)) {
        return;
      }
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && vm.isBlanketPO && vm.blanketPOOption === TRANSACTION.BLANKETPOOPTIONDET.USEBPOANDRELEASE && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.partType !== CORE.PartType.Other) {
        const objPORelease = _.find(vm.sourceData, (sData) => sData.poReleaseNumber !== vm.customerPackingSlipShipping.poReleaseNumber && sData.partType !== CORE.PartType.Other);
        if (objPORelease && vm.sourceData.length > 0 && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.poReleaseNumber) {
          isopenpopup = true;
          vm.isFocus = false;
          const messageConstant = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PO_RELEASE_NUMBER_MISMATCH_ERROR);
          messageConstant.message = stringFormat(messageConstant.message, objPORelease.poReleaseNumber || '');
          const obj = {
            multiple: true,
            messageContent: messageConstant
          };
          return DialogFactory.messageAlertDialog(obj).then(() => {
            isopenpopup = false;
            vm.isFocus = true;
          });
        }
      }
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id &&
        ((vm.customerPackingSlipShipping.shippingMethodID && vm.customerPackingSlipShipping.shippingMethodID !== vm.customerslip.shippingMethodId)
          || (vm.customerPackingSlipShipping.shippingAddressID && vm.customerPackingSlipShipping.shippingAddressID !== vm.customerslip.shipToId)
          || (vm.customerPackingSlipShipping.carrierID && vm.customerPackingSlipShipping.carrierID !== vm.customerslip.carrierID)
          || (vm.customerPackingSlipShipping.carrierAccountNumber && vm.customerPackingSlipShipping.carrierID !== vm.customerslip.carrierID))) {
        vm.isFocus = false;
        const data = {
          confirmationMsg: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION.message,
          packingSlipShipAddress: vm.customerslip.shippingAddress.replace(/<br\/>/g, '\r'),
          // poAssyReleaseLineAddress: vm.customerPackingSlipShipping.shippingFullAddress ? vm.customerPackingSlipShipping.shippingFullAddress.replace(/<br\/>/g, '\r') : null,
          packingSlipShippingMethod: vm.salesShipping.shippingMethod,
          // poAssyReleaseLineShippingMethod: vm.customerPackingSlipShipping.shippingMethodText,
          customerID: vm.customerslip.customerID,
          packingSlipNumber: vm.customerslip.packingSlipNumber,
          soNumber: vm.customerslip.soNumber,
          poNumber: vm.customerslip.poNumber,
          partId: vm.customerPackingSlipShipping.partId,
          assyID: vm.customerPackingSlipShipping.assyID,
          rohsIcon: vm.customerPackingSlipShipping.rohsIcon,
          rohsName: vm.customerPackingSlipShipping.rohsName,
          assyNumber: vm.customerPackingSlipShipping.assyNumber,
          custAssyPN: vm.customerPackingSlipShipping.custAssyPN,
          refSalesOrderID: vm.customerslip.refSalesOrderID || null,
          isAnyPackingSlipDetAvailable: vm.sourceData && vm.sourceData.length > 0,
          packingSlipCarrier: vm.salesShipping.carrier,
          // poAssyReleaseLineCarrier: vm.customerPackingSlipShipping.carrierText,
          soDetId: vm.customerPackingSlipShipping.refSalesorderDetid,
          soRelLineId: vm.customerPackingSlipShipping.shippingId,
          cpsShipToId: vm.customerslip.shipToId,
          cpsShipContactPersonId: vm.customerslip.shippingContactPersonID,
          cpsShippingMethodId: vm.customerslip.shippingMethodId,
          cpsCarrierId: vm.customerslip.carrierID,
          cpsCarrierAccountNumber: vm.customerslip.carrierAccountNumber
        };
        DialogFactory.dialogService(
          TRANSACTION.CUST_PACKING_SLIP_ADDR_CONFM_MODAL_CONTROLLER,
          TRANSACTION.CUST_PACKING_SLIP_ADDR_CONFM_MODAL_VIEW,
          ev,
          data).then((resp) => {
            if (resp && !resp.continueExisting) {
              vm.customerPackingSlipShipping.shipToId = resp.shipToId ? resp.shipToId : (resp.shippingAddressObj ? resp.shippingAddressObj.id : vm.customerPackingSlipShipping.shippingAddressID);
              vm.customerPackingSlipShipping.shippingAddressID = resp.shipToId ? resp.shipToId : (resp.shippingAddressObj ? resp.shippingAddressObj.id : vm.customerPackingSlipShipping.shippingAddressID);;
              vm.customerPackingSlipShipping.shippingAddressObj = resp.shippingAddressObj;
              vm.customerPackingSlipShipping.shippingContactPersonID = resp.shippingContactPersonID ? resp.shippingContactPersonID : (resp.shippingContactPersonObj ? resp.shippingContactPersonObj.personId : vm.customerPackingSlipShipping.shippingContactPersonID);
              vm.customerPackingSlipShipping.shippingContactPersonObj = resp.shippingContactPersonObj;
              vm.customerPackingSlipShipping.shippingMethodID = resp.shippingMethodId;
              vm.customerPackingSlipShipping.carrierID = resp.carrierID;
              vm.customerPackingSlipShipping.carrierAccountNumber = resp.carrierAccountNumber;
              vm.customerPackingSlipShipping.isSetPackingSlipAddrMethodAsPerShipDet = true;
            } else {
              vm.customerPackingSlipShipping.isSetPackingSlipAddrMethodAsPerShipDet = false;
            }

            // If off-the-shelf part selected and  shipping with non-inventory item  then take confirmation as on 01/06/21
            if (vm.customerPackingSlipShipping.isComponent && (!vm.customerPackingSlipShipping.isCustom || !vm.customerPackingSlipShipping.isCPN) && (!vm.customerPackingSlipShipping.componentStockType)) {
              const messageConent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_COMPONENT_WITHOUT_INVENTORY_CONFIRMATION);
              const model = {
                messageContent: messageConent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                checkCustomerPackingSlipDetails(ev, requiredDet);
              }, () => { // response - no
              });
            } else {
              checkCustomerPackingSlipDetails(ev, requiredDet);
            }
          }, () => {
            vm.isFocus = true;
          }).catch((error) => BaseService.getErrorLog(error));
      } else {
        // If off-the-shelf part selected and  shipping with non-inventory item  then take confirmation as on 01/06/21
        if (vm.customerPackingSlipShipping.isComponent && (!(vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN)) && (!vm.customerPackingSlipShipping.componentStockType)) {
          const messageConent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_COMPONENT_WITHOUT_INVENTORY_CONFIRMATION);
          const model = {
            messageContent: messageConent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(model).then(() => {
            checkCustomerPackingSlipDetails(ev, requiredDet);
          }, () => {
            setFocus('componentStockType');
            return;
          });
        } else {
          checkCustomerPackingSlipDetails(ev, requiredDet);
        }
      }
    };
    const saveCustomerPackingSlipDetails = (ev, requiredDet) => {
      // const maxline = _.maxBy(vm.sourceData, (o) => parseInt(o.lineID));
      const isAskForVersionConfirmation = vm.customerslip.isAlreadyPublished && vm.customerslip.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft && !vm.isStatusChange ? true : false;
      vm.customerPackingSlipShipping.extendedPrice = parseInt(vm.customerPackingSlipShipping.shipQty) * parseFloat((vm.customerPackingSlipShipping.unitPrice || 0));

      _.each(vm.sourceData, (det) => {
        if (det.id === vm.customerPackingSlipShipping.id) {
          det.shipQty = vm.customerPackingSlipShipping.shipQty;
          det.unitPrice = vm.customerPackingSlipShipping.unitPrice;
        }
      });
      let totalPackingSlipAmount = _.sumBy(vm.sourceData, (det) => parseFloat(det.extendedPrice));
      if (!vm.customerPackingSlipShipping.id) {
        totalPackingSlipAmount = totalPackingSlipAmount + parseFloat(vm.customerPackingSlipShipping.extendedPrice);
      }
      let qtyTurnTimeText = vm.customerPackingSlipShipping.assyQtyTurnTimeText;
      if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
        qtyTurnTimeText = vm.customerPackingSlipShipping.qtyTurnTime;
      } else if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        qtyTurnTimeText = vm.customerPackingSlipShipping.qtyTurnTime;
      } else {
        qtyTurnTimeText = null;
      }
      if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.NA.id) {
        vm.customerPackingSlipShipping.quoteNumber = null;
        vm.customerPackingSlipShipping.refAssyQtyTurnTimeID = null;
        vm.customerPackingSlipShipping.refRFQGroupID = null;
      }
      // }
      const objCustomerPacking = {
        id: vm.customerPackingSlipShipping.id,
        refCustPackingSlipID: vm.custPackingSlipID,
        refSalesorderDetid: vm.customerPackingSlipShipping.refSalesorderDetid,
        partId: vm.customerPackingSlipShipping.partId,
        custPOLineID: vm.customerPackingSlipShipping.custPOLineID,
        poQty: vm.customerPackingSlipShipping.poQty,
        //shipQty: vm.customerPackingSlipShipping.shipQty - (vm.shippTotal ? vm.shippTotal : 0),
        shipQty: vm.customerPackingSlipShipping.shipQty,
        remainingQty: vm.customerPackingSlipShipping.remainingQty,
        //shippedQty: vm.customerPackingSlipShipping.shippedQty - (vm.shippTotal ? vm.shippTotal : 0),
        shippedQty: vm.customerPackingSlipShipping.shippedQty,
        unitPrice: (!vm.isPOPackingSlip) ? vm.customerPackingSlipShipping.unitPrice : (!vm.customerPackingSlipShipping.isFromSO ? vm.customerPackingSlipShipping.unitPrice : null),
        shippingNotes: vm.customerPackingSlipShipping.shippingNotes,
        shippingId: vm.customerPackingSlipShipping.shippingId,
        packingSlipType: vm.customerslip.packingSlipType,
        shippedAssemblyList: angular.copy((!vm.customerPackingSlipShipping.isComponent) ? vm.pendingShipQtyList || [] : []),
        customerID: vm.customerslip.customerID,
        reflineID: vm.customerPackingSlipShipping.reflineID, /// For MISC packing slip so linewill be manual || (maxline ? maxline.lineID + 1 : 1),
        assyDescription: vm.customerPackingSlipShipping.assyDescription,
        lineIDSequenceNum: vm.customerPackingSlipShipping.lineIDSequenceNum,
        isShipForAssembly: vm.customerPackingSlipShipping.isShipForAssembly || false,
        isSetPackingSlipAddrMethodAsPerShipDet: vm.customerPackingSlipShipping.isSetPackingSlipAddrMethodAsPerShipDet || false,
        shippingMethodID: vm.customerPackingSlipShipping.shippingMethodID ? vm.customerPackingSlipShipping.shippingMethodID : vm.customerslip.shippingMethodID,
        shippingAddressID: vm.customerPackingSlipShipping.shippingAddressID || null,
        shippingAddress: vm.customerPackingSlipShipping.shippingAddressID ? BaseService.generateAddressFormateToStoreInDB(vm.customerPackingSlipShipping.shippingAddressObj) : vm.customerslip.shippingAddress,
        shippingContactPerson: vm.customerPackingSlipShipping.shippingContactPersonID ? BaseService.generateContactPersonDetFormat(vm.customerPackingSlipShipping.shippingContactPersonObj) : vm.customerslip.shippingContactPersonObj,
        shippingContactPersonID: vm.customerPackingSlipShipping.shippingContactPersonID ? vm.customerPackingSlipShipping.shippingContactPersonID : vm.customerslip.shippingContactPersonID,
        carrierID: vm.customerPackingSlipShipping.carrierID ? vm.customerPackingSlipShipping.carrierID : vm.customerslip.carrierID,
        carrierAccountNumber: vm.customerPackingSlipShipping.carrierAccountNumber ? vm.customerPackingSlipShipping.carrierAccountNumber : vm.customerslip.carrierAccountNumber,
        toBinIDOfEmptyBin: CORE.SystemGenratedWarehouseBin.bin.EmptyBin.id,
        transTypeForUMID: CORE.UMID_History.Trasaction_Type.UMID_Bin_TransferWithChangeCount,
        actionPerformedForUMIDZeroOut: stringFormat('{0} ({1})', CORE.UMID_History.Action_Performed.UMIDCountMaterial, CORE.TransferStockType.ZeroOut),
        actionPerformedForUMIDConsumed: stringFormat('{0} ({1})', CORE.UMID_History.Action_Performed.UMIDCountMaterial, CORE.TransferStockType.Consumed),
        actionPerformedForUMIDAdjust: stringFormat('{0} ({1}: {2} Count)', CORE.UMID_History.Action_Performed.UMIDCountMaterial, CORE.TransferStockType.Adjust, CORE.AdjustMaterialType.AddAppendCount),
        isConfirmationTakenForDeallocateUMID: requiredDet && requiredDet.isConfirmationTakenForDeallocateUMID || false,
        internalComment: vm.customerPackingSlipShipping.internalComment,
        poReleaseNumber: vm.customerPackingSlipShipping.poReleaseNumber,
        refBlanketPONumber: vm.customerPackingSlipShipping.refBlanketPONumber,
        standrads: vm.customerPackingSlipShipping.standrads,
        componentStockType: vm.customerPackingSlipShipping.isComponent ? (vm.customerPackingSlipShipping.componentStockType || false) : null,
        shippedComponentList: angular.copy(vm.componentUMIDList || []),
        extendedPrice: (!vm.isPOPackingSlip) ? vm.customerPackingSlipShipping.extendedPrice : (!vm.customerPackingSlipShipping.isFromSO ? vm.customerPackingSlipShipping.extendedPrice : null),
        packingSlipTotalAmount: totalPackingSlipAmount,
        quoteNumber: (!vm.isPOPackingSlip) ? vm.customerPackingSlipShipping.quoteNumber : null,
        quoteFrom: (!vm.isPOPackingSlip) ? vm.customerPackingSlipShipping.quoteFrom : (!vm.customerPackingSlipShipping.isFromSO ? vm.customerPackingSlipShipping.quoteFrom : null),
        refAssyQtyTurnTimeID: (!vm.isPOPackingSlip) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id ? (vm.customerPackingSlipShipping.refRFQQtyTurnTimeID ? vm.customerPackingSlipShipping.refRFQQtyTurnTimeID : vm.customerPackingSlipShipping.refAssyQtyTurnTimeID) : null,
        assyQtyTurnTimeText: (!vm.isPOPackingSlip) ? qtyTurnTimeText : null,
        refRFQGroupID: (!vm.isPOPackingSlip) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id ? vm.customerPackingSlipShipping.refRFQGroupID : null,
        refRFQQtyTurnTimeID: (!vm.isPOPackingSlip) && (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) ? vm.customerPackingSlipShipping.refRFQQtyTurnTimeID : null,
        revision: vm.customerslip.revision,
        isAskForVersionConfirmation: isAskForVersionConfirmation,
        releaseNotes: vm.customerPackingSlipShipping.releaseNotes
      };

      // when PO type packing slip with shipping other charges then shipped as same as ship
      if ((vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && vm.customerPackingSlipShipping.isShipForOtherCharges) ||
        (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && !vm.customerPackingSlipShipping.isShipForAssembly)) {
        objCustomerPacking.shipQty = vm.customerPackingSlipShipping.shipQty;
        objCustomerPacking.shippedQty = vm.customerPackingSlipShipping.shipQty;
      }
      vm.otherChargesDetailList = [];
      let otherCharges = _.filter(vm.allOtherCharges, (oCharge) => oCharge.refSODetID === objCustomerPacking.refSalesorderDetid);
      let otherLineCharges = _.filter(vm.allOtherCharges, (oCharge) => oCharge.refSOReleaseLineID === objCustomerPacking.shippingId);
      otherCharges = _.sortBy(otherCharges, ['custPOLineNumber']);
      otherLineCharges = _.sortBy(otherLineCharges, ['custPOLineNumber']);
      if (otherCharges.length > 0) {
        _.each(otherCharges, (item) => {
          const maxLineID = _.maxBy(vm.sourceData, (o) => parseInt(o.lineIDSequenceNum));
          if (item.frequency === CORE.OtherPartFrequency[0].id && (item.frequencyType === CORE.OtherPartFrequencyType[1].id || (item.frequencyType === CORE.OtherPartFrequencyType[0].id && (!(vm.shippedQtyList && vm.shippedQtyList.packingSlipShipping.length > 0 && vm.shippedQtyList.packingSlipShipping[0].shipQty))))) {
            const objFrequency = _.find(vm.sourceData, (sData) => sData.lineID === item.lineID && sData.refCustPackingSlipDetID === vm.customerPackingSlipShipping.id);
            if (!objFrequency) {
              item.isadd = true;
              item.slineID = vm.otherChargesDetailList.length ? vm.otherChargesDetailList[vm.otherChargesDetailList.length - 1].slineID + 1 : (maxLineID ? parseInt(maxLineID.lineIDSequenceNum) + (vm.customerPackingSlipShipping.id ? 1 : 2) : 2);
              //if (!vm.customerPackingSlipShipping.id) {
              //  item.slineID = item.slineID + 1;
              //}
              item.mfgPNDescription = item.partDescription || item.mfgPNDescription;
              vm.otherChargesDetailList.push(item);
            }
          } else if (item.frequency === CORE.OtherPartFrequency[2].id && (vm.customerPackingSlipShipping.shippingQty - ((vm.shippedQtyList && vm.shippedQtyList.packingSlipShipping.length > 0 && vm.shippedQtyList.packingSlipShipping[0].shipQty ? vm.shippedQtyList.packingSlipShipping[0].shipQty : 0) + objCustomerPacking.shipQty)) < 1) {
            const objFrequency = _.find(vm.sourceData, (sData) => sData.lineID === item.lineID);
            if (!objFrequency) {
              item.isadd = true;
              item.mfgPNDescription = item.partDescription || item.mfgPNDescription;
              item.slineID = vm.otherChargesDetailList.length ? vm.otherChargesDetailList[vm.otherChargesDetailList.length - 1].slineID + 1 : (maxLineID ? parseInt(maxLineID.lineIDSequenceNum) + (vm.customerPackingSlipShipping.id ? 1 : 2) : 2);
              vm.otherChargesDetailList.push(item);
            }
          } else if (item.frequency === CORE.OtherPartFrequency[2].id && (vm.customerPackingSlipShipping.shippingQty - objCustomerPacking.shipQty) > 1) {
            const objFrequency = _.find(vm.sourceData, (sData) => sData.lineID === item.lineID);
            if (objFrequency) {
              item.isadd = false;
              item.SelectedPIDCode = vm.customerPackingSlipShipping.PIDCode;
              item.SelectedrohsIcon = vm.customerPackingSlipShipping.rohsIcon;
              item.SelectedrohsText = vm.customerPackingSlipShipping.rohsName;
              item.SelectedpartID = vm.customerPackingSlipShipping.partId;
              item.PIDCode = item.pidcode;
              item.custPOLineID = item.custPOLineNumber;
              item.partId = item.partID;
              item.mfgpndescription = item.partDescription || item.mfgPNDescription;
              vm.otherChargesDetailList.push(item);
            }
          }
        });
        _.each(otherLineCharges, (item) => {
          const maxLineID = _.maxBy(vm.sourceData, (o) => parseInt(o.lineIDSequenceNum));
          if (item.frequency === CORE.OtherPartFrequency[1].id && ((!(vm.shippedQtyList && vm.shippedQtyList.packingSlipShipping.length > 0 && vm.shippedQtyList.packingSlipShipping[0].shipQty)))) {
            const objFrequency = _.find(vm.sourceData, (sData) => sData.lineID === item.lineID);
            if (!objFrequency) {
              item.isadd = true;
              item.mfgPNDescription = item.partDescription || item.mfgPNDescription;
              item.slineID = vm.otherChargesDetailList.length ? vm.otherChargesDetailList[vm.otherChargesDetailList.length - 1].slineID + 1 : (maxLineID ? parseInt(maxLineID.lineIDSequenceNum) + (vm.customerPackingSlipShipping.id ? 1 : 2) : 2);
              vm.otherChargesDetailList.push(item);
            }
          }
        });
      }
      if (vm.otherChargesDetailList.length > 0) {
        const data = {
          assyList: vm.otherChargesDetailList,
          assyID: vm.customerPackingSlipShipping.assyID,
          qty: objCustomerPacking.poQty,
          custPOLineID: objCustomerPacking.custPOLineID,
          rohsIcon: vm.customerPackingSlipShipping.rohsIcon,
          rohsName: vm.customerPackingSlipShipping.rohsName,
          mfgPN: vm.customerPackingSlipShipping.assyNumber || vm.customerPackingSlipShipping.mfgPN,
          partID: vm.customerPackingSlipShipping.partId,
          partType: vm.customerPackingSlipShipping.partType,
          soNumber: vm.customerslip.soNumber,
          poNumber: vm.customerslip.poNumber,
          salesOrderID: vm.customerslip.refSalesOrderID,
          isDelete: _.find(vm.otherChargesDetailList, (otherCharge) => !otherCharge.isadd) ? true : false,
          releaseNumber: vm.customerPackingSlipShipping.shippingBuild
        };
        DialogFactory.dialogService(
          CORE.VIEW_OTHER_CHARGE_SODETAIL_MODAL_CONTROLLER,
          CORE.VIEW_OTHER_CHARGE_SODETAIL_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (data) => {
            if (data) {
              let otherChargesList = [];
              _.each(vm.otherChargesDetailList, (item) => {
                const objOtherCharges = {
                  id: null,
                  refCustPackingSlipID: vm.custPackingSlipID,
                  refSalesorderDetid: item.sDetId,
                  partId: item.partID,
                  custPOLineID: item.custPOLineNumber,
                  poQty: item.poQty,
                  shipQty: item.poQty,
                  remainingQty: 0,
                  shippedQty: item.poQty,
                  unitPrice: item.price,
                  reflineID: item.lineID, /// For MISC packing slip so linewill be manual || (maxline ? maxline.lineID + 1 : 1),
                  assyDescription: item.mfgPNDescription,
                  standrads: item.standards,
                  extendedPrice: parseFloat((item.poQty * item.price).toFixed(2)),
                  shippingNotes: item.releaseNotes,
                  internalComment: item.internalcomment,
                  quoteFrom: 3,
                  refAssyQtyTurnTimeID: null,
                  quoteNumber: null,
                  isadd: item.isadd,
                  lineID: item.slineID
                };
                otherChargesList.push(objOtherCharges);
              });
              otherChargesList = _.sortBy(otherChargesList, ['lineID', 'custPOLineID']);
              objCustomerPacking.otherChargesList = otherChargesList;
              checkOtherCharges(objCustomerPacking, ev);
            }
          }, (err) => BaseService.getErrorLog(err));
      } else {
        checkOtherCharges(objCustomerPacking, ev);
      }
    };
    // confirmation for packing slip
    const checkOtherCharges = (objCustomerPacking, ev) => {
      const materialType = vm.customerPackingSlipShipping.materialType;
      vm.cgBusyLoading = CustomerPackingSlipFactory.saveCustomerPackingSlipShippingDeatils().query(objCustomerPacking).$promise.then((res) => {
        if (res) {
          vm.isFocus = false;
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.resetShippingDetail();
            vm.customerPackingSlipShipping.materialType = materialType;
            getCustomerPackingSlipDetail();
            vm.pendingShipQtyList = [];
            vm.alreadyShippedAssyList = [];
            vm.pendingShippingDetailList = [];
            vm.allpendingShippingDetailList = [];
            vm.allpendingShippingList = [];
            vm.pendingShippingList = [];
            vm.customerPackingSlipShippingCopy = null;
            vm.componentUMIDList = [];
            vm.recordUpdate = false;
            if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && vm.customerPackingSlipShipping.remainingQty === 0) {
              getPendingCustomerSalesDetails();
            }
          }
          else if (res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data && ((res.errors.data.notAvailableQtyShipList && res.errors.data.notAvailableQtyShipList.length > 0)
            || (res.errors.data.UMIDKitConfmRequireShipList && res.errors.data.UMIDKitConfmRequireShipList.length > 0))) {
            vm.customerslip.revision = vm.customerslip.revision && parseInt(vm.customerslip.revision || 0) > 0 ? parseInt(vm.customerslip.revision || 0) - 1 : 0;
            vm.customerslip.isRevisionUpdated = false;
            const data = {
              notAvailableQtyShipList: res.errors.data.notAvailableQtyShipList || [],
              UMIDKitConfmRequireShipList: res.errors.data.UMIDKitConfmRequireShipList || [],
              customerID: vm.customerslip.customerID,
              packingSlipNumber: vm.customerslip.packingSlipNumber,
              soNumber: vm.customerslip.soNumber,
              poNumber: vm.customerslip.poNumber,
              partId: vm.customerPackingSlipShipping.partId,
              assyID: vm.customerPackingSlipShipping.assyID,
              rohsIcon: vm.customerPackingSlipShipping.rohsIcon,
              rohsName: vm.customerPackingSlipShipping.rohsName,
              assyNumber: vm.customerPackingSlipShipping.assyNumber,
              refSalesOrderID: vm.customerslip.refSalesOrderID || null,
              componentStockType: vm.customerPackingSlipShipping.componentStockType || null
            };
            DialogFactory.dialogService(
              TRANSACTION.CUST_PACKING_SLIP_QTY_KIT_CHANGE_CONFM_MODAL_CONTROLLER,
              TRANSACTION.CUST_PACKING_SLIP_QTY_KIT_CHANGE_CONFM_MODAL_VIEW,
              ev,
              data).then((resp) => {
                if (resp) {
                  const requiredDet = {
                    isConfirmationTakenForDeallocateUMID: true
                  };
                  vm.saveCustomPackingSlipDetails(ev, requiredDet);
                }
                else {
                  vm.refreshShipment(vm.customerPackingSlipShipping.partId);
                }
              }, () => {
                vm.refreshShipment(vm.customerPackingSlipShipping.partId);
              }).catch((error) => BaseService.getErrorLog(error));
          }
          $timeout(() => {
            vm.isFocus = true;
          }, 1000);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.isUpdatable = true;
    //Unit Price Column
    const unitPriceColumn = {
      field: 'unitPrice',
      width: '100',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>',
      displayName: 'Unit Price ($)'
    };
    const extendedPriceColumn = {
      field: 'extendedPrice',
      width: '120',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
      displayName: 'Ext. Price ($)',
      footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer margin-top-8 text-right" layout-align="center center">{{grid.appScope.$parent.vm.CustomerPackingSlipDetGridQtyCount.totalExtendedPrice | amount}}</div>'
    };
    /** Column definition for material grid */
    vm.loadSourceData = () => {
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '120',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: 'lineIDSequenceNum',
          width: 70,
          displayName: 'PS Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          enableFiltering: false
        },
        {
          field: 'soLineId',
          width: 70,
          displayName: 'SO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          enableFiltering: false
        },
        {
          field: 'custPOLineID',
          width: 120,
          displayName: 'Cust PO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD }}</div>'
        },
        {
          field: 'releaseNumber',
          width: 90,
          displayName: 'Release Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          enableFiltering: false
        },
        {
          field: 'poReleaseNumber',
          width: 150,
          displayName: 'PO Release#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD }}</div>',
          enableFiltering: false
        },
        //{
        //  field: 'lineID',
        //  width: 120,
        //  displayName: 'SO Line#',
        //  cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>'
        //},
        {
          field: 'mfgName',
          displayName: vm.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeid);$event.preventDefault();">{{row.entity.mfgName}}</a>\
                            <copy-text label="\'MFR\'" text="row.entity.mfgName" ng-if="row.entity.mfgName"></copy-text></div>',
          width: '300'
        },
        {
          field: 'mfgPN',
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partId" \
                            component-id="row.entity.partId" \
                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgPN" \
                            is-copy="true" \
                            is-custom-part="row.entity.iscustom"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            cust-part-number="row.entity.custAssyPN"\
                            ></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'PIDCode',
          displayName: vm.LabelConstant.SalesOrder.AssyIDPID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partId" \
                            component-id="row.entity.partId" \
                            label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.AssyIDPID" \
                            value="row.entity.PIDCode" \
                            is-copy="true" \
                            is-custom-part="row.entity.iscustom"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            cust-part-number="row.entity.custAssyPN"\
                            is-search-findchip="false"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'nickName',
          width: '150',
          displayName: 'Nickname',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
        },
        {
          field: 'assyDescription',
          width: '300',
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}<md-tooltip md-direction="top" ng-if="row.entity.assyDescription">{{COL_FIELD}}</md-tooltip></div>'
        },
        {
          field: 'standrads',
          width: 250,
          displayName: 'Applicable Standards',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'poQty',
          width: 120,
          displayName: 'Original PO Line Order Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'remainingQty',
          width: '100',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          displayName: 'Open PO Line Qty',
          footerCellTemplate: '<div layout="row" layout-align="end center" class="ui-grid-cell-contents summary-footer padding-right-0-imp">Total: </div>'
        },
        {
          field: 'releaseLineQty',
          width: 120,
          displayName: 'Original PO Release Line Order Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'shipQty',
          width: '100',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          displayName: 'Shipment Qty',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer margin-top-8 text-right" layout-align="center center">{{grid.appScope.$parent.vm.CustomerPackingSlipDetGridQtyCount.shipmentQtyCount}}</div>'
        },
        {
          field: 'unitMeaser',
          width: '120',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'quoteFromText',
          displayName: 'Quote From',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 150,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: 200
        },
        {
          field: 'refRFQGroupID',
          displayName: 'Quote Group',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 90,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'quoteNumber',
          displayName: 'Quote#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-center"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 120,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'qtyTurnTime',
          displayName: 'Quote Qty Turn Time',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{row.entity.assyQtyTurnTimeText}}</div>',
          width: 200,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'shippingNotes',
          width: '120',
          displayName: 'Line Shipping Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shippingNotes && row.entity.shippingNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showShippingComment(row.entity, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: false
        },
        {
          field: 'internalComment',
          width: '120',
          displayName: 'Line Internal Notes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap blue">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalComment && row.entity.internalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showInternalComment(row.entity, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: false
        },
        {
          field: 'releaseNotes',
          width: '120',
          displayName: vm.LabelConstant.SalesOrder.ReleaseNote,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releaseNotes && row.entity.releaseNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showReleaseNotes(row.entity, $event, \'Release Notes\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: false
        },
        {
          field: 'shippedFromWONumbers',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          displayName: 'Shipped From Work Orders'
        },
        {
          field: 'shippedFromUMIDs',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          displayName: 'Shipped From UMIDs'
        },
        {
          field: 'shippedQty',
          width: '110',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          displayName: 'Shipped To Date'
        },
        {
          field: 'refBlanketPONumber',
          width: 150,
          displayName: 'Ref. Blanket PO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD }}</div>',
          enableFiltering: false
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        }, {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
        }, {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
        }, {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        }, {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BY
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
        }
      ];

      if (vm.showUnitPriceField) {
        vm.sourceHeader.splice(15, 0, unitPriceColumn);
        vm.sourceHeader.splice(16, 0, extendedPriceColumn);
      }
    };


    //show shipping comments
    vm.showShippingComment = (row, ev) => {
      const headerData = [{
        label: 'Cust PO Line#',
        value: row.custPOLineID,
        displayOrder: 1
      },
      {
        label: vm.LabelConstant.Assembly.PIDCode + '/' + vm.LabelConstant.MFG.PID,
        value: row.PIDCode,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToPartList();
        },
        valueLinkFn: () => {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.partId, USER.PartMasterTabs.Detail.Name);
        },
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + row.rohsIcon,
          imgDetail: row.rohsText
        }
      }];
      const PopupData = {
        title: 'Line Shipping Comments',
        description: row.shippingNotes,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        PopupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // show internal comments
    vm.showInternalComment = (row, ev) => {
      const headerData = [{
        label: 'Cust PO Line#',
        value: row.custPOLineID,
        displayOrder: 1
      },
      {
        label: vm.LabelConstant.Assembly.PIDCode + '/' + vm.LabelConstant.MFG.PID,
        value: row.PIDCode,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToPartList();
        },
        valueLinkFn: () => {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.partId, USER.PartMasterTabs.Detail.Name);
        },
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + row.rohsIcon,
          imgDetail: row.rohsText
        }
      }];
      const PopupData = {
        title: 'Line Internal Notes',
        description: row.internalComment,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        PopupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // show internal comments
    vm.showReleaseNotes = (row, ev) => {
      const headerData = [{
        label: 'Cust PO Line#',
        value: row.custPOLineID,
        displayOrder: 1
      },
      {
        label: vm.LabelConstant.Assembly.PIDCode + '/' + vm.LabelConstant.MFG.PID,
        value: row.PIDCode,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToPartList();
        },
        valueLinkFn: () => {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.partId, USER.PartMasterTabs.Detail.Name);
        },
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + row.rohsIcon,
          imgDetail: row.rohsText
        }
      }];
      const PopupData = {
        title: vm.LabelConstant.SalesOrder.ReleaseNote,
        description: row.releaseNotes,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        PopupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };


    /** Paging detail for material grid */
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        prefCustPackingSlipID: vm.custPackingSlipID
      };
    };
    initPageInfo();
    /** Grid options for material grid */
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: true,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'CustomerPackingSlipShippingMaterial.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[44].PageName
    };

    //bind source disabled details
    const bindGridDetails = (sourceData) => {
      _.map(sourceData, (data) => {
        data.isDisabledUpdate = vm.customerslip.refCustInvoiceID || vm.customerslip.status;
        data.isDisabledDelete = vm.customerslip.refCustInvoiceID || vm.customerslip.status || data.refCustPackingSlipDetID;
        data.systemGenerated = vm.customerslip.refCustInvoiceID || vm.customerslip.status;
        data.isDisabledAddInvoice = data.partType !== vm.partCategoryConst.SubAssembly;
      });
    };

    function setDataAfterGetAPICall(customerpacking, isGetDataDown) {
      if (customerpacking && customerpacking.data.packingSlipShipping) {
        bindGridDetails(customerpacking.data.packingSlipShipping);
        if (!isGetDataDown) {
          vm.sourceData = customerpacking.data.packingSlipShipping;
          vm.currentdata = vm.sourceData.length;
        }
        else if (customerpacking.data.packingSlipShipping.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(customerpacking.data.packingSlipShipping);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // display qty count in footer
        vm.CustomerPackingSlipDetGridQtyCount.shipmentQtyCount = _.sumBy(vm.sourceData, (o) => parseInt(o.shipQty));
        vm.CustomerPackingSlipDetGridQtyCount.totalExtendedPrice = _.sumBy(vm.sourceData, (o) => parseFloat(o.extendedPrice));
        // vm.isDisableForChangePackingSlipShipAddrMethod = (vm.packingSlipType === CORE.CUSTOMER_PACKING_SLIP_TYPE[0].id) && vm.sourceData && vm.sourceData.length > 0;

        // must set after new data comes
        vm.totalSourceDataCount = customerpacking.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    /* retrieve packing slip material list*/
    vm.loadData = () => {
      if (vm.custPackingSlipID > 0) {
        if (vm.pagingInfo.SortColumns.length === 0) {
          //vm.pagingInfo.SortColumns = [];
          vm.pagingInfo.prefCustPackingSlipID = vm.custPackingSlipID;
        }
        vm.removeMaterialList = [];
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = CustomerPackingSlipFactory.getCustomerPackingShippingDetail().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.sourceData = [];
        vm.totalSourceDataCount = 0;
        vm.isNoDataFound = true;
        vm.emptyState = null;
        $timeout(() => {
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }
    };

    //bind
    /** Method call for infinite scroll of material grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CustomerPackingSlipFactory.getCustomerPackingShippingDetail().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //update records for customer packing slip shippings
    vm.updateRecord = (row) => {
      if (vm.customerslip.refCustInvoiceID || vm.customerslip.status) { return; }
      if (row.entity.id > 0) {
        if ((vm.customerPackingSlipShippingCopy && row.entity.id !== vm.customerPackingSlipShippingCopy.id) || !vm.customerPackingSlipShippingCopy) {
          row.entity.reflineID = row.entity.lineID;
          row.entity.soLineID = row.entity.isFromSO ? row.entity.lineID : null;
          vm.customerPackingSlipShippingCopy = angular.copy(row.entity);
          vm.customerPackingSlipShipping = angular.copy(row.entity);

          vm.customerPackingSlipShipping.isComponent = vm.customerPackingSlipShipping.partType === vm.partCategoryConst.Component;
          vm.recordUpdate = true;
          vm.recordView = false;
          if (vm.customerPackingSlipShipping.materialType) {
            getShippedAssemblyList(vm.customerPackingSlipShipping.id, vm.customerPackingSlipShipping.shippingId || '');
          } else {
            if (vm.salesOrderID && vm.customerPackingSlipShipping.soLineID) {
              vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.PO;
              getShippingListForOtherCharges();
            } else {
              vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.MISC;
              getotherTypecomponent();
            }
            vm.customerPackingSlipShipping.isShipForOtherCharges = true;
            vm.autocompleteOtherCharges.keyColumnId = vm.customerPackingSlipShipping.partId;
          }
          let autoCompletePromise = [];
          if ((vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
            autoCompletePromise = [getQtyTurnTimeByAssyId(vm.customerPackingSlipShipping.partId)];
          }
          if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
            if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
              vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
              vm.customerPackingSlipShipping.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
            }
            if (vm.customerPackingSlipShipping.partId) {
              autoCompletePromise = [getrfqQuoteQtyTurnTimeList(vm.customerPackingSlipShipping.refRFQGroupID, (vm.customerPackingSlipShipping.partId))];
            }
          }
          vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
            if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.customerPackingSlipShipping.partId) {
              getrfqQuoteGroupList(vm.customerPackingSlipShipping.partId);
            }
          });
          if (vm.customerPackingSlipType[0].id === vm.customerslip.packingSlipType) {
            //selectSalesOrderDetails(null);
            vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = null;
            vm.pendingShippingDetailList = _.clone(vm.allpendingShippingDetailList);
            vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = vm.customerPackingSlipShipping.refSalesorderDetid;
            if (vm.autoCompletePackingSlipShipping) {
              // vm.autoCompletePackingSlipShipping.keyColumnId = vm.customerPackingSlipShipping.shippingId;
              $timeout(() => {
                $scope.$broadcast(vm.autoCompletePackingSlipShipping.inputName, vm.customerPackingSlipShipping.shippingId);
              }, 0);
            }
            // vm.autoCompletePackingSlipShipping.keyColumnId = vm.customerPackingSlipShipping.shippingId;
            $timeout(() => {
              setFocus('description');
            }, 0);
          } else {
            //vm.autocompleteAssy.keyColumnId = vm.customerPackingSlipShipping.partId;
            if (vm.customerPackingSlipShipping.materialType) {
              const searchObj = {
                partID: vm.customerPackingSlipShipping.partId,
                searchText: null
              };
              getcomponentAssemblyList(searchObj);
              getComponentUMIDList();
            } else {
              vm.autocompleteOtherCharges.keyColumnId = vm.customerPackingSlipShipping.partId;
            }
            setFocus('description');
          }
        }
      }
    };
    vm.alreadyShippedAssyList = [];
    //reset shipping detail
    vm.resetShippingDetail = () => {
      vm.recordUpdate = false;
      vm.recordView = false;
      vm.soDetId = null;
      vm.soReleaseId = null;
      if (vm.autoCompletePackingSlipShipping) {
        vm.autoCompletePackingSlipShipping.keyColumnId = null;
      }
      if (vm.autoCompletePackingSlipSalesOrderDetails) {
        vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = null;
      }
      if (vm.autocompleteAssy) {
        vm.autocompleteAssy.keyColumnId = null;
        $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
      };
      if (vm.autocompleteMfgPN) {
        vm.autocompleteMfgPN.keyColumnId = null;
        $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
      };
      if (vm.autocompleteOtherCharges) {
        vm.autocompleteOtherCharges.keyColumnId = null;
      }
      if (vm.autocompleteQtyTurnTime) {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
      }
      if (vm.autoCompleteQuoteGroup) {
        vm.autoCompleteQuoteGroup.keyColumnId = null;
      }
      vm.customerPackingSlipShippingCopy = null;
      vm.pendingShipQtyList = [];
      vm.alreadyShippedAssyList = [];
      vm.quoteGroupDetails = [];
      vm.ChargeList = [];
      vm.moveToNextOtherChgType = true;
      //vm.pendingShippingDetailList = [];
      //vm.allpendingShippingDetailList = [];
      //vm.allpendingShippingList = [];
      vm.customerPackingSlipShipping = {
        materialType: true
      };
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
        getotherTypecomponent();
      }
      vm.selectedMaterialType = true;
      vm.pendingShippingList = [];
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
        getPendingCustomerSalesDetails();
      }
      $timeout(() => {
        vm.customerPackingSlipDetForm.$setPristine();
        vm.customerPackingSlipDetForm.$dirty = false;
      }, 1000);
    };
    vm.query = {
      order: ''
    };
    vm.EmptyMesssage = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_SHIPASSY);
    vm.pendingShipQtyList = [];
    //get assy qty to ship detail based on part number
    const getAssyQtyPeningShipDeatils = (id) => CustomerPackingSlipFactory.getCustomerPackingSlipTransferQty().query({ partID: id }).$promise.then((res) => {
      if (res && res.data) {
        vm.pendingShipQtyList = res.data;
        _.each(vm.pendingShipQtyList, (pendingship) => {
          pendingship.availableStockQty = parseInt(pendingship.actualAvalilableQty);
          let objShip = null;
          if (pendingship.stockType === CORE.ASSY_STOCK_TYPE.UMIDStock) {
            //pendingship.actualAvalilableQty = pendingship.availableQty;
            objShip = _.find(vm.alreadyShippedAssyList, (shipAssy) => shipAssy.woNumber === pendingship.woNumber
              && shipAssy.refsidid === pendingship.refsidid);
          }
          else {
            objShip = _.find(vm.alreadyShippedAssyList, (shipAssy) => shipAssy.woNumber === pendingship.woNumber
              && shipAssy.stockType !== CORE.ASSY_STOCK_TYPE.UMIDStock);
          }
          if (objShip) {
            pendingship.availableQty = parseInt(pendingship.availableQty);
            pendingship.actualAvalilableQty += objShip.opStock;
            pendingship.selectedQty = objShip.opStock ? objShip.opStock : null;
            pendingship.selectedActualQty = objShip.opStock;
          }
        });
        _.each(vm.alreadyShippedAssyList, (alreadyship) => {
          let objShip = null;
          if (alreadyship.stockType === CORE.ASSY_STOCK_TYPE.UMIDStock) {
            objShip = _.find(vm.pendingShipQtyList, (pending) => pending.woNumber === alreadyship.woNumber
              && pending.refsidid === alreadyship.refsidid);
          }
          else {
            objShip = _.find(vm.pendingShipQtyList, (pending) => pending.woNumber === alreadyship.woNumber
              && pending.stockType !== CORE.ASSY_STOCK_TYPE.UMIDStock);
          }
          //need to understand logic, fixing temporary for hotfix - VS 06/01/2021
          if (!objShip) {
            // as all qty shipped and from sp get shippedQty as available so STATIC CODE
            alreadyship.availableQty = 0;
            vm.pendingShipQtyList.push(alreadyship);
          }
        });
        // }
        vm.pendingShipQtyList = _.clone(_.orderBy(vm.pendingShipQtyList, ['woNumber'], ['ASC']));
        vm.EmptyMesssage.MESSAGE = angular.copy(stringFormat(angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_SHIPASSY.MESSAGE), vm.customerPackingSlipShipping.assyID));
        return $q.resolve(vm.pendingShipQtyList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //get sum of ready to ship qty
    vm.sumOfReadyToshipQty = () => _.sumBy(vm.pendingShipQtyList, (o) => parseInt(o.opStock));

    //get sum of available qty
    vm.sumOfAvailableQty = () => _.sumBy(vm.pendingShipQtyList, (o) => parseInt(o.availableQty || 0));
    // get sum of actual available
    vm.sumOfAvailableStockQty = () => _.sumBy(vm.pendingShipQtyList, (o) => parseInt(o.availableStockQty || 0));
    // get sum of shipment qty
    vm.sumOfSelectedQty = () => _.sumBy(vm.pendingShipQtyList, (o) => parseInt(o.selectedQty || 0));

    vm.setScrollClass = 'gridScrollHeight_CustomerPackingSlipDetails';

    // Get Shipped Packing slip Details (other than current packing slip)
    const getAlreadyShippedQty = (partID, salesOrderDetID, shippingId) => CustomerPackingSlipFactory.getShippedPackingslipDetails().query({ salesOrderDetID: salesOrderDetID, partID: partID, packingSlipID: vm.customerslip.id, shippingId: shippingId }).$promise.then((res) => {
      if (res && res.data) {
        const sumForTotal = _.sumBy(_.filter(vm.sourceData, (sum) => sum.refSalesorderDetid === salesOrderDetID && sum.partId === partID && sum.shippingId !== shippingId), (o) => parseInt(o.shipQty));
        vm.shippedQtyList = res.data;
        vm.shippTotal = (vm.shippedQtyList.packingSlipShipping[0].shipQty || 0);
        vm.shippReleaseLineTotal = vm.shippedQtyList.salesShippingQty[0].shippedQty || 0;
        //vm.customerPackingSlipShipping.shippedQty = (_.sumBy(vm.customerslip.customerPackingSlipDet, (o) => { if (o.refSalesorderDetid === salesOrderDetID) { return o.shippedQty; } }) || 0) + vm.shippTotal;
        vm.customerPackingSlipShipping.shippedQty = (_.sumBy(vm.customerslip.customerPackingSlipDet, (o) => { if (o.refSalesorderDetid === salesOrderDetID) { return o.shipQty; } }) || 0) + vm.shippTotal;
        vm.shippedQty = angular.copy(vm.customerPackingSlipShipping.shippedQty);
        //vm.customerPackingSlipShipping.shipQty = angular.copy(vm.customerPackingSlipShipping.shippedQty);
        vm.customerPackingSlipShipping.shipQty = (_.sumBy(vm.customerslip.customerPackingSlipDet, (o) => { if (o.refSalesorderDetid === salesOrderDetID && o.shippingId === shippingId) { return o.shipQty; } }) || 0);
        vm.customerPackingSlipShipping.remainingQty = (vm.customerPackingSlipShipping.shippedQty > vm.customerPackingSlipShipping.poQty) ? 0 : vm.customerPackingSlipShipping.poQty - vm.customerPackingSlipShipping.shippedQty;
        vm.customerPackingSlipShipping.releaselineRemainingQty = vm.customerPackingSlipShipping.poreleaseLineOrderQty - vm.customerPackingSlipShipping.shipQty - vm.shippReleaseLineTotal;
        if (vm.customerPackingSlipShipping.releaselineRemainingQty < 0) {
          vm.customerPackingSlipShipping.releaselineRemainingQty = 0;
        }
        vm.shippTotal = (vm.shippTotal) + (sumForTotal || 0);
        return $q.resolve(vm.shippedQtyList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /* delete customer packing slip*/
    vm.deleteRecord = (customerPackingSlip) => {
      if (vm.customerslip.refCustInvoiceID || vm.customerslip.status) { return; }
      let selectedIDs = [];
      let refCustomerPackingIDs = [];
      if (customerPackingSlip) {
        if (customerPackingSlip.id) {
          selectedIDs.push(customerPackingSlip.id);
        }
        refCustomerPackingIDs.push(customerPackingSlip.refCustPackingSlipID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = (_.filter(vm.selectedRows, (detID) => detID.id)).map((item) => item.id);
          refCustomerPackingIDs = vm.selectedRows.map((item) => item.refCustPackingSlipID);
        }
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Customer Packing Slip Detail', (selectedIDs.length + (refCustomerPackingIDs.length - selectedIDs.length)));
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      const objIDs = {
        id: selectedIDs,
        CustomerPackingSlipID: refCustomerPackingIDs,
        CountList: false,
        toBinIDOfEmptyBin: CORE.SystemGenratedWarehouseBin.bin.EmptyBin.id,
        transTypeForUMID: CORE.UMID_History.Trasaction_Type.UMID_Bin_TransferWithChangeCount,
        actionPerformedForUMIDAdjust: stringFormat('{0} ({1}: {2} Count)', CORE.UMID_History.Action_Performed.UMIDCountMaterial, CORE.TransferStockType.Adjust, CORE.AdjustMaterialType.AddAppendCount),
        packingSlipId: vm.customerslip.id,
        revision: vm.customerslip.revision
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          //const statusList = CORE.CustomerPackingSlipStatus;
          //const statusName = _.filter(statusList, (item) => item.ID === vm.customerslip.subStatus).map((item) => item.Name);
          if (vm.customerslip.id && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, 'Customer Packing Slip');
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yesRev) => {
              if (yesRev) {
                vm.customerslip.revision = parseInt(vm.customerslip.revision || 0) + 1;
                objIDs.revision = vm.customerslip.revision;
                checkDeleteConfirmation(objIDs);
              }
            }, () => {
              checkDeleteConfirmation(objIDs);
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            checkDeleteConfirmation(objIDs);
          }
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };
    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //check confirmation validation
    const checkDeleteConfirmation = (objIDs) => {
      const packingSlipDetList = [];
      _.each(objIDs.id, (packingSlipDetID) => {
        const objPackingSlip = _.filter(vm.sourceData, (item) => item.refCustPackingSlipDetID === packingSlipDetID);
        if (objPackingSlip.length > 0) {
          const objPackingSlipDet = _.find(vm.sourceData, (item) => item.id === packingSlipDetID);
          if (objPackingSlipDet) {
            _.each(objPackingSlip, (objPackingSlip) => {
              objPackingSlip.SelectedPIDCode = objPackingSlipDet.PIDCode;
              objPackingSlip.SelectedrohsIcon = objPackingSlipDet.rohsIcon;
              objPackingSlip.SelectedrohsText = objPackingSlipDet.rohsName;
              objPackingSlip.SelectedpartID = objPackingSlipDet.partId;
              objPackingSlip.mfgpndescription = angular.copy(objPackingSlip.assyDescription);
              packingSlipDetList.push(objPackingSlip);
            });
          }
        }
      });
      if (packingSlipDetList.length > 0) {
        const data = {
          assyList: packingSlipDetList,
          isDelete: true,
          soNumber: vm.customerslip.soNumber,
          poNumber: vm.customerslip.poNumber,
          salesOrderID: vm.customerslip.refSalesOrderID
        };
        DialogFactory.dialogService(
          CORE.VIEW_OTHER_CHARGE_SODETAIL_MODAL_CONTROLLER,
          CORE.VIEW_OTHER_CHARGE_SODETAIL_MODAL_VIEW,
          null,
          data).then(() => {
          }, (data) => {
            if (data) {
              deleteRecordAfterRevison(objIDs);
            }
          }, (err) => BaseService.getErrorLog(err));
      } else {
        deleteRecordAfterRevison(objIDs);
      }
    };

    const deleteRecordAfterRevison = (objIDs) => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.deleteCustomerPackingSlipDetail().query({ objIDs: objIDs }).$promise.then((data) => {
        if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
          const datas = {
            TotalCount: data.data.transactionDetails[0].TotalCount,
            pageName: CORE.PageName.customerPackingSlip
          };
          BaseService.deleteAlertMessageWithHistory(datas, (ev) => {
            const IDs = {
              id: selectedIDs,
              CustomerPackingSlipID: refCustomerPackingIDs,
              CountList: true
            };
            return CustomerPackingSlipFactory.deleteCustomerPackingSlipDetail().query({
              objIDs: IDs
            }).$promise.then((res) => {
              let data = {};
              data = res.data;
              data.pageTitle = vm.customerslip.packingSlipNumber;
              data.PageName = CORE.PageName.customerPackingSlip;
              data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length + (refCustomerPackingIDs.length - selectedIDs.length), ' Selected');
              data.id = selectedIDs;
              if (res.data) {
                DialogFactory.dialogService(
                  USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                  USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                  ev,
                  data).then(() => 1, () => 1);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          });
        } else {
          vm.loadData();
          getCustomerPackingSlipDetail();
          vm.resetShippingDetail();
          resetPackingSlipDetForm();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //check shipment qty
    vm.addShipmentQty = (item) => {
      item.selectedQty = item.selectedQty ? item.selectedQty : null;
      item.selectedActualQty = 0;
      if (vm.customerPackingSlipShipping.id) {
        vm.customerPackingSlipShippingCopy.shipQty -= (item.selectedActualQty || 0);
      }
      if ((item.selectedQty ? item.selectedQty : 0) <= item.actualAvalilableQty) {
        vm.customerPackingSlipShipping.shipQty = (_.sumBy(vm.pendingShipQtyList, (o) => (o.selectedQty ? o.selectedQty : 0))) || 0;
        item.availableQty = parseInt(item.actualAvalilableQty - (item.selectedQty ? item.selectedQty : 0));
        vm.changeShipmentQty(true);
        vm.customerPackingSlipDetForm.$$controls[0].$setDirty();
        vm.customerPackingSlipDetForm.$invalid = false;
        vm.customerPackingSlipDetForm.$valid = true;
      } else {
        vm.customerPackingSlipDetForm.$invalid = true;
        vm.customerPackingSlipDetForm.$valid = false;
      }
    };
    // go to comment page
    vm.gotoComment = (ev, item) => {
      const objIndex = vm.pendingShipQtyList.indexOf(item);
      if (objIndex === vm.pendingShipQtyList.length - 1 && ev && ev.keyCode === 9) {
        setFocus('internalComment');
      }
    };
    //refresh shipment
    vm.refreshShipment = (partID) => {
      getAssyQtyPeningShipDeatils(vm.customerPackingSlipShipping.partId || partID, true);
      getAssemblyStockStatusList(vm.customerPackingSlipShipping.partId || partID);
    };

    //chaneg status
    vm.changePackingSlipStatus = (item) => {
      vm.customerslip.subStatus = item.ID;
      vm.customerslip.status = item.ParentID;
      if (vm.Copycustomerslip && vm.Copycustomerslip.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft && vm.sourceData && vm.sourceData.length === 0) {
        vm.isFocus = false;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGSLIP_PUBLISH_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, BaseService.getCustomerPackingSlipStatus(vm.customerslip.subStatus));
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          vm.isFocus = true;
          vm.customerslip.status = vm.Copycustomerslip.status;
          vm.customerslip.subStatus = vm.Copycustomerslip.subStatus;
        });
        return;
      } else if (!vm.customerslip.shipToId || (!vm.customerslip.shippingContactPersonID && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        if (!vm.customerslip.shipToId) {
          messageContent.message = stringFormat(messageContent.message, 'ShipTo Address');
        } else if (!vm.customerslip.shippingContactPersonID && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft) {
          messageContent.message = stringFormat(messageContent.message, 'ShipTo Contact Person');
        }
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          vm.isFocus = true;
          vm.customerslip.status = vm.Copycustomerslip.status;
          vm.customerslip.subStatus = vm.Copycustomerslip.subStatus;
        });
        return;
      }
      else if (vm.customerslip.id && (vm.customerslip.refCustInvoiceID && vm.customerslip.subStatus === vm.shippedStatus) &&
        (!vm.customerslip.customerPackingSlipTrackNumber || vm.customerslip.customerPackingSlipTrackNumber.length === 0)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_FIELD_REQUIRED_FOR_FURTHER_PROCESSING);
        messageContent.message = stringFormat(messageContent.message, 'Tracking number');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('trackingNumber');
          vm.customerslip.subStatus = vm.Copycustomerslip.subStatus;
          vm.customerslip.status = vm.Copycustomerslip.status;
        });
        return;
      }
      else {
        vm.isFormDirtyManual = false;
        if (!vm.frmCustomerPackingSlip.$dirty) {
          vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
          vm.isFormDirtyManual = true;
        }
        vm.saveCustomerPackingSlip();
      }
    };
    //go to sales order
    vm.goToSalesorder = () => {
      BaseService.goToSalesOrderList();
      return;
    };

    // Get Already Shipped Assembly list from current packing slip
    const getShippedAssemblyList = (id, shippingId) => CustomerPackingSlipFactory.getShippedAssemblyList().query({ refCustPackingSlipDetID: id, shippingId: shippingId || 0 }).$promise.then((res) => {
      if (res && res.data) {
        vm.alreadyShippedAssyList = res.data.PackingSlipShipDetail;
        return $q.resolve(vm.alreadyShippedAssyList);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    //go to employee page list
    vm.employeelist = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };

    // get sales Commission to employee list
    const getSalesCommissionEmployeeListbyCustomer = () => EmployeeFactory.getEmployeeListByCustomer().query({ customerID: vm.customerslip.customerID, salesCommissionToID: vm.customerslip.salesCommissionTo }).$promise.then((employees) => {
      if (employees && employees.data) {
        vm.SalesCommissionEmployeeList = angular.copy(employees.data);
        _.each(vm.SalesCommissionEmployeeList, (item) => {
          if (item.profileImg) {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        return $q.resolve(vm.SalesCommissionEmployeeList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // open stock adjustment popup to add new adjustment
    vm.addStockAdjustment = (ev, woAssyShipDet) => {
      if (!woAssyShipDet) {
        return;
      }
      const popUpData = {
        popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
        pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          isAddDataFromCustomerPackingSlipPage: true,
          customerPackingSlipDet: {
            partID: woAssyShipDet.partID,
            PIDCode: woAssyShipDet.assyID,
            woNumber: woAssyShipDet.woNumber
          }
        };

        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW,
          ev,
          data).then((resposne) => {
            if (resposne) {
              vm.refreshShipment(vm.customerPackingSlipShipping.partId);
              // get assembly stock details with adjustment
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    // open initial stock
    vm.addOpeningBalance = (ev) => {
      const popUpData = {
        popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE],
        pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          isAddDataFromCustomerPackingSlipPage: true,
          customerPackingSlipDet: {
            partID: vm.customerPackingSlipShipping.partId
          }
        };

        DialogFactory.dialogService(
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.refreshShipment(vm.customerPackingSlipShipping.partId);
            getAssemblyStockStatusList(vm.customerPackingSlipShipping.partId);
            if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
              $timeout(() => {
                setFocus('ShippingQty0');
              }, 1000);
            } else {
              setFocus('custPOLineID');
            }
          }, () => { // close pop up
            vm.refreshShipment(vm.customerPackingSlipShipping.partId);
            getAssemblyStockStatusList(vm.customerPackingSlipShipping.partId);
            if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
              $timeout(() => {
                setFocus('ShippingQty0');
              }, 1000);
            } else {
              setFocus('custPOLineID');
            }
          });
      }
    };

    // to open/show assembly stock details pop up (from remaining qty to ship table)
    vm.ViewAssemblyStockDetails = (packingLineSlipData, event) => {
      const data = {
        entity: {
          partId: packingLineSlipData.partId,
          rohsIcon: packingLineSlipData.rohsIcon,
          rohsName: packingLineSlipData.rohsName,
          mfgPN: packingLineSlipData.assyNumber,
          PIDCode: packingLineSlipData.assyID || packingLineSlipData.PIDCode
        }
      };
      vm.ViewAssemblyStockStatus(data, event);
    };

    // to open/show assembly stock details pop up (from shipped qty grid)
    vm.ViewAssemblyStockStatus = (rowData, event) => {
      const data = {
        partID: rowData.entity.partId,
        rohsIcon: vm.rohsImagePath + rowData.entity.rohsIcon,
        rohsName: rowData.entity.rohsName,
        mfgPN: rowData.entity.mfgPN,
        PIDCode: rowData.entity.PIDCode
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
          vm.refreshShipment(rowData.entity.partId);
          setFocus('custPOLineID');
        }, (err) => BaseService.getErrorLog(err));
    };

    //get ready stock qty details
    const getAssemblyStockStatusList = (assyID) => {
      const listObj = {
        assyID: assyID
      };
      vm.cgBusyLoading = WorkorderFactory.getAssemblyStockDetailsByAssyID().query({
        listObj: listObj
      }).$promise.then((assemblyDetails) => {
        vm.customerPackingSlipShipping.readyToShipQtyWithStockAdjustment = 0;
        if (assemblyDetails && assemblyDetails.data && assemblyDetails.data.woAssemblyDetails) {
          vm.customerPackingSlipShipping.readyToShipQtyWithStockAdjustment = (_.sumBy(assemblyDetails.data.woAssemblyDetails, (o) => o.readytoShipQty) || 0)
            + (_.sumBy(assemblyDetails.data.woAssemblyDetails, (o) => o.stockAdjustmentQty) || 0);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Set/Remove duplicate validation if track number is duplicate */
    vm.checkUniqueTrackNumber = () => {
      const checkDuplicate = _.find(vm.customerslip.customerPackingSlipTrackNumber, (obj) => obj.tempID !== vm.trackingNumberDet.tempID && obj.trackNumber === vm.trackingNumberDet.trackNumber);
      if (checkDuplicate) {
        $scope.$applyAsync(() => {
          vm.frmCustomerPackingSlip.trackingNumber.$setValidity('duplicate', false);
        });
        return false;
      }
      vm.frmCustomerPackingSlip.trackingNumber.$setValidity('duplicate', true);
      return true;
    };

    /** Add/Update track number */
    vm.addTrackingNumberToList = (event) => {
      let trackControl;
      if (event.keyCode === 13) {
        vm.isDisableTrackNumber = true;
        $timeout(() => {
          if (!vm.trackingNumberDet.trackNumber || !vm.trackingNumberDet.trackNumber.trim()) {
            vm.isDisableTrackNumber = false;
            setFocus('trackingNumber');
            return;
          }
          vm.isDisableTrackNumber = false;
          if (vm.checkUniqueTrackNumber()) {
            const customerslip = _.find(vm.customerslip.customerPackingSlipTrackNumber, (obj) => obj.tempID === vm.trackingNumberDet.tempID);
            if (customerslip) {
              customerslip.oldTrackNumber = customerslip.trackNumber;
              customerslip.trackNumber = vm.trackingNumberDet.trackNumber;
              customerslip.isRequiredToUpdate = true;
              vm.customerslip.trackingNumberChanged = true;
              trackControl = _.find(vm.frmCustomerPackingSlip.$$controls, (ctrl) => ctrl.$name === 'trackNumberChanged');
              trackControl.$setDirty();
            } else {
              vm.customerslip.customerPackingSlipTrackNumber.push({
                trackNumber: vm.trackingNumberDet.trackNumber,
                refCustPackingSlipID: vm.custPackingSlipID || null,
                tempID: (vm.customerslip.customerPackingSlipTrackNumber.length + 1),
                isNewFromPacingSlip: true // case when tracking number added from packing slip also add in invoice
              });
              vm.customerslip.trackingNumberChanged = true;
              trackControl = _.find(vm.frmCustomerPackingSlip.$$controls, (ctrl) => ctrl.$name === 'trackNumberChanged');
              trackControl.$setDirty();
            }
            resetCustPackingSlipTrackingNumberObj();
            setFocus('trackingNumber');
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, 'Tracking# ' + vm.trackingNumberDet.trackNumber);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              resetCustPackingSlipTrackingNumberObj();
              setFocus('trackingNumber');
            });
          }
          // }
        });
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(event);
      }
    };

    /** Remove track number from list */
    vm.removeTrackNumber = (item, index) => {
      let trackControl;
      if (vm.customerslip && vm.customerslip.refCustInvoiceID && vm.customerslip.subStatus === vm.shippedStatus) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVOICE_ALREADY_CREATED);
        messageContent.message = stringFormat(messageContent.message, vm.customerslip.packingSlipNumber);
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          resetCustPackingSlipTrackingNumberObj();
          vm.frmCustomerPackingSlip.$setPristine();
          getCustomerPackingSlipDetail();
        });
        return;
      } else {
        vm.customerslip.removeCustomerPackingSlipTrackNumberIds = vm.customerslip.removeCustomerPackingSlipTrackNumberIds || [];
        vm.customerslip.removeCustomerInvTrackNumbers = vm.customerslip.removeCustomerInvTrackNumbers || [];
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Customer Packing Slip Tracking#', '');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.frmCustomerPackingSlip.$setDirty(true);
              vm.customerslip.trackingNumberChanged = true;
              trackControl = _.find(vm.frmCustomerPackingSlip.$$controls, (ctrl) => ctrl.$name === 'trackNumberChanged');
              trackControl.$setDirty();
              //trackControl = _.find(vm.frmCustomerPackingSlip.$$controls, (ctrl) => ctrl.$name === 'trackingNumber');
              //trackControl.$setDirty();
              if (item.id > 0) {
                vm.customerslip.removeCustomerPackingSlipTrackNumberIds.push(item.id);
                vm.customerslip.removeCustomerInvTrackNumbers.push(item.trackNumber);
              }
              vm.customerslip.customerPackingSlipTrackNumber.splice(index, 1);
              const numberIndex = _.findIndex(vm.customerslip.customerPackingSlipTrackNumber, (obj) => obj.trackNumber === item.trackNumber);
              $timeout(() => {
                if (numberIndex === -1) {
                  vm.frmCustomerPackingSlip.trackingNumber.$setValidity('duplicate', true);
                }
              });
              //vm.isAddTrackDisable = _.filter(vm.customerslip.customerPackingSlipTrackNumber, (obj) => !obj.trackNumber).length > 0;
              _.each(vm.customerslip.customerPackingSlipTrackNumber, (item, index) => {
                item.tempID = (index + 1);
              });
              setFocus('trackingNumber');
            }
          }, () => {
            setFocus('trackingNumber');
          }).catch((error) => BaseService.getErrorLog(error));
        }
        //vm.isAddTrackDisable = _.filter(vm.customerslip.customerPackingSlipTrackNumber, (obj) => !obj.trackNumber).length > 0;
      }
    };

    /** Edit track number */
    vm.editTrackingNumber = (item) => {
      if (vm.customerslip && vm.customerslip.refCustInvoiceID && vm.customerslip.subStatus === vm.shippedStatus) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVOICE_ALREADY_CREATED);
        messageContent.message = stringFormat(messageContent.message, vm.customerslip.packingSlipNumber);
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          resetCustPackingSlipTrackingNumberObj();
          vm.frmCustomerPackingSlip.$setPristine();
          getCustomerPackingSlipDetail();
        });
        return;
      } else {
        vm.trackingNumberDet = angular.copy(item);
        setFocus('trackingNumber');
      }
    };

    //remove selected address
    vm.removeAddress = (addressType) => {
      if (addressType === CORE.AddressType.IntermediateAddress) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.InternmediateAddress);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.IntermediateAddress = null;
            vm.customerslip.intermediateAddress = null;
            vm.customerslip.intermediateShipmentId = null;
            // Static code to enable save button
            vm.frmCustomerPackingSlip.$$controls[0].$setDirty();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to reset current tracking number
    vm.resetCustPackingSlipTrackingNumer = () => {
      resetCustPackingSlipTrackingNumberObj();
    };

    //go to customer contact person list page
    vm.goToCustContactPersonList = () => {
      BaseService.goToCustomerContactPersonList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.customerslip.customerID);
    };

    //go to customer billing address list page
    vm.goToCustBillingAddressList = () => {
      BaseService.goToCustomerBillingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.customerslip.customerID);
    };

    //go to customer shipping address list page
    vm.goToCustShippingAddressList = () => {
      BaseService.goToCustomerShippingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.customerslip.customerID);
    };

    //go to Shipping Method - generic category list page
    vm.goToShippingMethodList = () => {
      BaseService.goToGenericCategoryShippingTypeList();
    };

    //go to work order list page
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
    };

    // go to assembly list
    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
    };

    // go to assembly list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    // go to bin list
    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    // go to warehouse list
    vm.goToWarehouseList = () => {
      BaseService.goToWHList();
    };

    // go to manage sales order page
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.customerslip.refSalesOrderID);
    };

    // go to manage sales order page
    vm.goToManageCustomer = () => {
      BaseService.goToCustomer(vm.customerslip.customerID);
    };

    // go part details page
    vm.goToManagePartDetails = () => {
      BaseService.goToComponentDetailTab(null, vm.customerPackingSlipShipping.partId);
    };

    // go to UMID list page
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    // go to UMID list page
    vm.goToUMIDDetails = (refsidid) => BaseService.goToUMIDDetail(refsidid);

    vm.goPaymentTermList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_TERMS_STATE);
    };

    // Go to sales price matrix tab on part master
    vm.goToComponentSalesPriceMatrixTab = (partId) => {
      BaseService.goToComponentSalesPriceMatrixTab(partId);
    };

    //set customer packing slip navigation
    vm.setNavigatePointer = (ev) => {
      $timeout(() => {
        if (!vm.isopenpop && ev && ev.keyCode === 9) {
          // in case of tab jump to  shipping qty in case of shift tab jump to  custom po line
          if (!ev.shiftKey) {
            if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && vm.customerPackingSlipShipping.materialType && (vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly)) {
              if (vm.showUnitPriceField) {
                setFocus(vm.autocompleteQtyTurnTime.inputName);
              } else {
                if (vm.customerPackingSlipShipping.isComponent && vm.customerPackingSlipShipping.componentStockType) {
                  setFocus('ComponentShippingQty0');
                } else {
                  setFocus('ShippingQty0');
                }
              }
            } else if (vm.showUnitPriceField && vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
              if (vm.customerPackingSlipShipping.isComponent) {
                setFocus('componentStockType');
              } else {
                setFocus('unitPrice');
              }
            } else if (vm.customerPackingSlipShipping.materialType && vm.customerPackingSlipShipping.isComponent) {
              if (vm.customerPackingSlipShipping.componentStockType) {
                setFocus('ComponentShippingQty0');
              }
            } else {
              if (vm.pendingShipQtyList && vm.pendingShipQtyList.length > 0) {
                setFocus('ShippingQty0');
              } else {
                setFocus('btnAddPartBalance');
              }
            }
          } else {
            if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && vm.customerPackingSlipShipping.materialType && (vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly)) {
              setFocus('quoteNumber');
            } else {
              setFocus('lineID');
            }
          }
        };
      }, 100);
    };
    vm.setNavigateFromUnitPrice = (ev) => {
      $timeout(() => {
        if (!vm.isopenpop && ev && ev.keyCode === 9) {
          // in case of tab jump to  shipping qty in case of shift tab jump to  custom po line
          if (!ev.shiftKey) {
            if (vm.customerPackingSlipShipping.materialType && vm.customerPackingSlipShipping.isComponent) {
              if (vm.customerPackingSlipShipping.componentStockType) {
                setFocus('ComponentShippingQty0');
              }
            } else {
              if (vm.pendingShipQtyList && vm.pendingShipQtyList.length > 0) {
                setFocus('ShippingQty0');
              } else {
                setFocus('btnAddPartBalance');
              }
            }
          } else {
            if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && vm.customerPackingSlipShipping.materialType && (vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly)) {
              setFocus(vm.autocompleteQtyTurnTime.inputName);
            } else {
              setFocus('componentStockType');
            }
          }
        }
      }, 100);
    };
    vm.setMiscNavigator = () => {
      if (vm.customerPackingSlipShipping.isShipForAssembly) {
        $timeout(() => {
          if (!vm.isopenpop) {
            setFocus('ShippingQty0');
          };
        }, 100);
      }
      else {
        setFocus('custPOLineID');
      }
    };
    // go to ship comments
    vm.goToShippingComments = (e) => {
      if (e && e.keyCode === 9) {
        if (e.shiftKey) {
          setFocus('poQty');
        } else {
          setFocus('internalComment');
        }
      }
    };
    //set focus on save button
    vm.setFocusOnButton = (ev) => {
      if (ev && ev.keyCode === 9) {
        if (ev.shiftKey) {
          setFocus('internalComment');
        } else {
          setFocus('btnAddDet');
        }
      }
    };
    //get component shipping comments detail details
    const getShippingCommentList = (id) => {
      if (id) {
        vm.cgBusyLoading = ComponentFactory.getPartMasterCommentsByPartId().query({
          partId: id,
          category: 'S'
        }).$promise.then((purchaseInspection) => {
          if (purchaseInspection && !vm.customerPackingSlipShipping.shippingNotes) {
            vm.customerPackingSlipShipping.shippingNotes = _.map(_.map(_.filter(purchaseInspection.data || [], (data) => data.inspectionmst && data.inspectionmst.requiementType === 'C' ? data.inspectionmst : null), (item) => item.inspectionmst), 'requirement').join('\r');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //get component part comments
    const getPartInternalCommentList = (id) => {
      if (id) {
        vm.cgBusyLoading = ComponentFactory.getPartMasterInternalCommentsByPartId().query({
          partId: id
        }).$promise.then((purchaseInspection) => {
          if (purchaseInspection && !vm.customerPackingSlipShipping.internalComment) {
            vm.customerPackingSlipShipping.internalComment = _.map(purchaseInspection.data, 'comment').join('\r');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //check unique customer po line
    vm.checkCustomerPOLine = () => {
      const checkUnique = _.find(vm.sourceData, (item) => item.custPOLineID === vm.customerPackingSlipShipping.custPOLineID && vm.customerPackingSlipShipping.id !== item.id);
      vm.checkUniqueSOLineNumber(CORE.SOLINENUMBERTYPE.CUSTPOLINE, checkUnique);
    };
    //check unique SO line
    vm.checkSOLine = (e) => {
      if (e && e.keyCode === 9) {
        const checkUnique = _.find(vm.sourceData, (item) => item.lineID === vm.customerPackingSlipShipping.reflineID && vm.customerPackingSlipShipping.id !== item.id);
        // in case of SO CPS check CustPOLine# entered in SO then its should not repeated in manual.
        return $q.all([vm.checkUniqueSOLineNumber(CORE.SOLINENUMBERTYPE.SOLINENUM, checkUnique)]).then((res) => {
          if (res) {
            if (e.shiftKey) {
              setFocus('custPOLineID');
            } else if (!e.shiftKey && vm.showUnitPriceField && vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && vm.customerPackingSlipShipping.materialType) {
              if (vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly) {
                setFocus('quoteNumber');
              } else {
                setFocus('poQty');
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.changeMaterialCharge = () => {
      const materialType = vm.customerPackingSlipShipping.materialType;
      if ((vm.autocompleteMfgPN && vm.autocompleteMfgPN.keyColumnId) ||
        (vm.autoCompletePackingSlipSalesOrderDetails && vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId) ||
        (vm.autocompleteAssy && vm.autocompleteAssy.keyColumnId) ||
        (vm.autocompleteOtherCharges && vm.autocompleteOtherCharges.keyColumnId)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGTYPE_CONFIRMATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customerPackingSlipShipping = {
              materialType: materialType
            };
            if (!vm.customerPackingSlipShipping.materialType) {
              vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.PO;
              vm.selectedOtherCharges = vm.otherChargeType.PO;
            }
            vm.selectedMaterialType = materialType;
            if (vm.autoCompletePackingSlipSalesOrderDetails) {
              vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = null;
            }
            vm.autocompleteMfgPN.keyColumnId = null;
            if (vm.customerPackingSlipShipping.materialType) {
              vm.customerPackingSlipShipping.isShipForOtherCharges = false;
            } else {
              vm.customerPackingSlipShipping.isShipForOtherCharges = true;
            }
            if (vm.autoCompletePackingSlipShipping) {
              vm.autoCompletePackingSlipShipping.keyColumnId = null;
            }
            if (vm.autocompleteAssy) {
              vm.autocompleteAssy.keyColumnId = null;
              $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
            };
            if (vm.autocompleteOtherCharges) {
              vm.autocompleteOtherCharges.keyColumnId = null;
            }
            vm.customerPackingSlipShippingCopy = null;
            vm.pendingShipQtyList = [];
            vm.componentUMIDList = [];
            vm.alreadyShippedAssyList = [];
            vm.recordUpdate = false;
            $timeout(() => {
              if (!vm.customerPackingSlipShipping.materialType) {
                setFocusByName(vm.autocompleteOtherCharges.inputName);
              } else {
                setFocusByName(vm.autocompleteAssy.inputName);
              }
            });
            // vm.resetShippingDetail();
            if (vm.customerPackingSlipDetForm) {
              vm.customerPackingSlipDetForm.$setPristine();
              vm.customerPackingSlipDetForm.$setUntouched();
            }
          }
        }, () => {
          vm.customerPackingSlipShipping.materialType = vm.selectedMaterialType;
          if (!vm.customerPackingSlipShipping.materialType) {
            vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.PO;
            vm.selectedOtherCharges = vm.otherChargeType.PO;
          }
          if (vm.customerPackingSlipShipping.materialType) {
            if (vm.customerslip.packingSlipType !== vm.customerPackingSlipType[0].id) {
              if (vm.autocompleteAssy) {
                const searchObj = {
                  partID: vm.customerPackingSlipShipping.partId,
                  searchText: null
                };
                getcomponentAssemblyList(searchObj);
                getcomponentMfgPNList(searchObj);
              }
            } else {
              vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = vm.customerPackingSlipShipping.refSalesorderDetid;
            }
          } else {
            vm.autocompleteOtherCharges.keyColumnId = vm.customerPackingSlipShipping.partId;
          }
          $timeout(() => {
            if (!vm.customerPackingSlipShipping.materialType) {
              setFocusByName(vm.autocompleteOtherCharges.inputName);
            } else {
              setFocusByName(vm.autocompleteAssy.inputName);
            }
          });
        });
      } else {
        vm.selectedMaterialType = vm.customerPackingSlipShipping.materialType;
        if (!vm.customerPackingSlipShipping.materialType) {
          if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
            vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.PO;
            vm.selectedOtherCharges = vm.otherChargeType.PO;
          }
          vm.componentUMIDList = [];
          vm.pendingShipQtyList = [];
        }
        $timeout(() => {
          if (!vm.customerPackingSlipShipping.materialType) {
            setFocusByName(vm.autocompleteOtherCharges.inputName);
          } else {
            setFocusByName(vm.autocompleteAssy.inputName);
          }
        });
      }
    };
    //
    vm.setComponentStockFocus = (e) => {
      if (e && e.keyCode === 9) {
        if (vm.customerPackingSlipShipping.componentStockType) {
          if (!e.shiftKey) {
            if (vm.showUnitPriceField && vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id) {
              // in case of po/so packing slip  unit price is disabled.
              setFocus('ComponentShippingQty0');
            } else if (vm.showUnitPriceField && vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id) {
              setFocus('unitPrice');
            } else {
              setFocus('ComponentShippingQty0');
            }
          }
        }
      }
    };
    // get price break detail for component
    vm.getPartPriceBreakDetails = (id) => ComponentFactory.getPartPriceBreakDetails().query({ id: id }).$promise.then((res) => {
      if (res && res.data) {
        vm.PartPriceBreakDetailsData = res.data;
        if (vm.customerPackingSlipDetForm.shipQty && !vm.customerPackingSlipShipping.reflineID) {
          const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.customerPackingSlipShipping.poQty);
          if (priceBreak) {
            vm.customerPackingSlipDetForm.unitPrice = priceBreak.unitPrice;
          } else {
            const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.customerPackingSlipShipping.poQty), (o) => o.priceBreak);
            if (priceList.length > 0) {
              vm.customerPackingSlipShipping.unitPrice = priceList[priceList.length - 1].unitPrice;
            }
          }
          // vm.changePrice();
        }
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //change qty for other charges
    vm.changeOtherPartQty = () => {
      // auto select price from part master
      if (vm.customerPackingSlipShipping.poQty && vm.PartPriceBreakDetailsData && !vm.recordUpdate) {
        const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.customerPackingSlipShipping.poQty);
        if (priceBreak) {
          vm.customerPackingSlipShipping.unitPrice = priceBreak.unitPrice;
        } else {
          const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.customerPackingSlipShipping.poQty), (o) => o.priceBreak);
          if (priceList.length > 0) {
            vm.customerPackingSlipShipping.unitPrice = priceList[priceList.length - 1].unitPrice;
          }
        }
        // vm.changePrice();
      }
    };

    //set so po number
    vm.setSOPODeail = (nextElement) => {
      $scope.$parent.vm.soNumber = vm.customerslip.soNumber;
      $scope.$parent.vm.poNumber = vm.customerslip.poNumber;
      checkMiscPackingSlipForSOPONumberOnBlur(nextElement);
    };
    // go to manufacturer detail page
    vm.goToManufacturerDetail = () => {
      BaseService.goToManufacturer(vm.customerPackingSlipShipping.mfgcodeID);
    };
    // go to manufacturer list page
    vm.gotoManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    // go to rohs list page
    vm.gotoRohsList = () => {
      BaseService.goToRohsList();
    };
    //goto standard list page
    vm.gotoPartStandardList = () => {
      BaseService.goToPartStandardTab(CORE.MFG_TYPE.MFG, vm.customerPackingSlipShipping.partId);
    };
    // go to standrad list
    vm.gotoStandardList = () => {
      BaseService.goToStandardList();
    };

    // go to manufacturer
    vm.goToManufacturer = (id) => {
      BaseService.goToManufacturer(id);
    };
    // Initial Stock Redirection Button
    vm.goToAssemblyOpeningBalanceDetails = (id) => {
      BaseService.goToAssemblyOpeningBalanceDetails(id);
      return false;
    };
    // go  to Part master umid list
    vm.goToComponentUMIDList = (partId, mfgType) => {
      BaseService.goToComponentUMIDList(partId, mfgType);
    };

    //select UMID stock
    vm.changeUMIDStockType = () => {
      if (vm.customerPackingSlipShipping.componentStockType) {
        vm.customerPackingSlipDetForm.shipQty.$setValidity('min', true);
        vm.customerPackingSlipShipping.shipQty = 0;
        getComponentUMIDList();
      } else {
        vm.componentUMIDList = [];
      }
    };

    const getComponentUMIDList = () => {
      const obj = {
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        isInStock: true,
        partId: vm.customerPackingSlipShipping.partId ? vm.customerPackingSlipShipping.partId : vm.customerPackingSlipShipping.partID,
        expiredDay: 0,
        packingSlipDetId: vm.customerPackingSlipShipping.id
      };
      vm.cgBusyLoading = CustomerPackingSlipFactory.getUMIDListForCustomerPackingSlip().query(obj).$promise.then((resUmidList) => {
        if (resUmidList && resUmidList.data && resUmidList.data.component) {
          const umidList = angular.copy(resUmidList.data.component);
          _.each(umidList, (det) => {
            det.actualPkgUnit = det.pkgUnit;
            det.expiryDate = BaseService.getUIFormatedDate(det.expiryDate, vm.DefaultDateFormat);
            const obj = _.filter(vm.alreadyShippedAssyList, (shipped) => shipped.refsidid === det.id);
            if (obj && obj.length > 0) {
              det.selectedQty = obj[0].selectedQty ? obj[0].selectedQty : null;
              det.actualPkgUnit = parseInt(det.actualPkgUnit || 0) + parseInt(obj[0].selectedQty || 0);
              det.selectedActualQty = obj[0].selectedQty;
              det.expireDaysLeftBeforeShipment = obj[0].expireDaysLeftBeforeShipment;
              det.isNearByExpiry = obj[0].isNearByExpiry;
            }
            det.expireDaysLeftBeforeShipment = det.expireDaysLeftBeforeShipment ? det.expireDaysLeftBeforeShipment : det.expireDaysLeftBeforeShipmentFromKey;
          });
          vm.componentUMIDList = _.filter(umidList, (item) => !item.expiredStatus || (item.expiredStatus && item.selectedQty > 0));
        }
      });
    };

    // Open Count Material Pop-up
    vm.countMaterial = (row) => {
      var data = {
        uid: row.uid,
        updateStock: true
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then((res) => {
          if (res) {
            getComponentUMIDList();
          }
        }, (transfer) => {
          if (transfer) {
            getComponentUMIDList();
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    //check shipment qty
    vm.checkComponentUMIDShipQty = (elementIndex, detItem) => {
      let messageContent;
      // remove for case : selected qty from  2  UMIDs. now in update remove qty from 1 UMID then
      // detItem.selectedQty will be null  so  no proper shipQty recalculated
      //if (detItem.pkgUnit !== detItem.actualPkgUnit && (!detItem.selectedQty)) {
      //  detItem.pkgUnit = parseFloat(detItem.actualPkgUnit);
      //}
      if ((detItem.pkgUnit !== detItem.actualPkgUnit || detItem.selectedQty > 0)) {
        detItem.selectedQty = detItem.selectedQty ? parseFloat(detItem.selectedQty) : null;
        detItem.selectedActualQty = 0;
        if (detItem.refcompid !== vm.customerPackingSlipShipping.partId && (!detItem.isEachUOM)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PACKAGING_ALIAS_AVL_PART_UMID_RESTRICATED);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            detItem.selectedQty = null;
            setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex));
          });
          return;
        } else if (detItem.isReservedStock === true) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.RESERVE_UMID_CANNOT_BE_CONSUMED);
          messageContent.message = stringFormat(messageContent.message, 'Ship', detItem.uid, detItem.reservedForCustomer);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            detItem.selectedQty = null;
            setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex));
          });
          return;
        }
        vm.cgBusyLoading = WorkorderTransactionUMIDFactory.getUMIDFeederStatus().query({ refSidId: detItem.id }).$promise.then((res) => {
          if (res && res.data > 0) {
            vm.isConfirmationOpenAtUMIDList = true;
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UMID_ALREADY_FEEDER);
            messageContent.message = stringFormat(messageContent.message, detItem.uid);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              detItem.selectedQty = null;
              setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex));
              vm.isConfirmationOpenAtUMIDList = false;
              return;
            });
          } else if (detItem.selectedQty > 0 && detItem.expiredStatus) {
            vm.isConfirmationOpenAtUMIDList = true;
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIP_EXPIRED_UMID);
            messageContent.message = stringFormat(messageContent.message, detItem.uid, detItem.expiryDate);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(model).then(() => {
              vm.isConfirmationOpenAtUMIDList = false;
              checkAndUpdateShipment(elementIndex, detItem);
            }, () => {
              vm.isConfirmationOpenAtUMIDList = false;
              detItem.selectedQty = null;
              setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex));
              return;
            });
          } else if (detItem.isNearByExpiry > 0 && detItem.selectedQty > 0 && !detItem.expiredStatus) {
            vm.isConfirmationOpenAtUMIDList = true;
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIP_NEARBY_EXPIRE_UMID);
            messageContent.message = stringFormat(messageContent.message, detItem.uid, detItem.expiryDate);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(model).then(() => {
              vm.isConfirmationOpenAtUMIDList = false;
              checkAndUpdateShipment(elementIndex, detItem);
            }, () => {
              vm.isConfirmationOpenAtUMIDList = false;
              detItem.selectedQty = null;
              if (elementIndex === vm.componentUMIDList.length - 1) {
                setFocus('internalComment');
              } else {
                setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex + 1));
              }
              return;
            });
          } else {
            checkAndUpdateShipment(elementIndex, detItem);
          }
        });
      }
    };

    const checkAndUpdateShipment = (elementIndex, detItem) => {
      if (vm.customerPackingSlipShipping.id) {
        vm.customerPackingSlipShippingCopy.shipQty -= parseFloat(detItem.selectedActualQty || 0);
      }
      if ((detItem.selectedQty ? detItem.selectedQty : 0) <= detItem.actualPkgUnit) {
        vm.customerPackingSlipShipping.shipQty = (_.sumBy(vm.componentUMIDList, (o) => parseFloat(o.selectedQty ? o.selectedQty : 0))) || 0;
        detItem.pkgUnit = parseFloat(detItem.actualPkgUnit) - parseFloat(detItem.selectedQty || 0);
        vm.changeShipmentQty(true);
        vm.customerPackingSlipDetForm.$$controls[0].$setDirty();
        vm.customerPackingSlipDetForm.$invalid = false;
        vm.customerPackingSlipDetForm.$valid = true;
      } else {
        vm.customerPackingSlipDetForm.$invalid = true;
        vm.customerPackingSlipDetForm.$valid = false;
      }
      //setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex + 1));
      if (elementIndex === vm.componentUMIDList.length - 1) {
        setFocus('internalComment');
      } else {
        setFocus(stringFormat('{0}{1}', 'ComponentShippingQty', elementIndex + 1));
      }
    };

    // go to comment field
    vm.gotoCommentForUMIDStock = (ev, item) => {
      const objIndex = vm.componentUMIDList.indexOf(item);
      if (objIndex === vm.componentUMIDList.length - 1 && ev && ev.keyCode === 9) {
        setFocus('internalComment');
      }
    };

    //refresh umid list
    vm.refreshUMIDList = () => {
      if (vm.customerPackingSlipShipping.componentStockType) {
        getComponentUMIDList();
      } else {
        vm.componentUMIDList = [];
      }
    };

    function setQtyTurnTimeValue(data) {
      const quoteQtyTurnData = data;
      // let unitPrice = null;
      vm.quoteQtyTurnTimeDetails = [];
      if (quoteQtyTurnData && quoteQtyTurnData.length > 0 && vm.customerPackingSlipShipping.poQty) {
        //====
        let filterdList = _.sortBy(_.filter(quoteQtyTurnData, (qtyBreak) => qtyBreak.priceBreak <= vm.customerPackingSlipShipping.poQty), (o) => o.priceBreak);
        if (filterdList && filterdList.length > 0) {
          const matchedPriceBreak = filterdList[filterdList.length - 1].priceBreak;
          filterdList = _.filter(quoteQtyTurnData, (a) => a.priceBreak === matchedPriceBreak);
        }
        else {
          const sortedTurnTimeData = _.sortBy(quoteQtyTurnData, (o) => o.priceBreak);
          filterdList = _.filter(quoteQtyTurnData, (a) => a.priceBreak === sortedTurnTimeData[0].priceBreak);
        }
        vm.quoteQtyTurnTimeDetails = (filterdList && filterdList.length > 0) ? filterdList : [];
        //====
      }
      if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length === 1 && vm.autocompleteQtyTurnTime) {
        vm.autocompleteQtyTurnTime.keyColumnId = vm.quoteQtyTurnTimeDetails[0].id;
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, vm.quoteQtyTurnTimeDetails[0].qtyTurnTime);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', vm.quoteQtyTurnTimeDetails[0].qtyTurnTime);
        // unitPrice = vm.quoteQtyTurnTimeDetails[0].unitPrice;
      } else if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length > 1 && vm.autocompleteQtyTurnTime) {
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, null);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
      } else if (!vm.customerPackingSlipShipping || !vm.customerPackingSlipShipping.id) {
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, null);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
      }
      // vm.changeQty(null, vm.qtyType.POQTY, unitPrice);
    };
    //Change of QuoteFrom
    vm.onChangeQuoteFrom = (id, isQuoteFrom) => {
      // in case of PO/SO packing slip on changing Quote from reseting Qty Turn time not auto fill autoComplete
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && isQuoteFrom) {
        vm.customerPackingSlipShipping.refAssyQtyTurnTimeID = null;
        vm.customerPackingSlipShipping.refRFQQtyTurnTimeID = null;
      }
      vm.changeSalesCommissionFromPartOrRFQ(id);
    };

    //change quote from radio button
    function changeConfirmation(changeType) {
      if (vm.isReset) {
        return;
      }

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_COMMISSION_RESET_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, changeType.value);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (!vm.customerPackingSlipShipping.salesCommissionDeltedIds) {
            vm.customerPackingSlipShipping.salesCommissionDeltedIds = [];
          }
          /*maintain delted ids only for saved rows, no need to maintain deleted ids for newly added rows*/
          if (vm.customerPackingSlipShipping.id > 0) {
            _.map(vm.customerPackingSlipShipping.salesCommissionList, (dataRow) => {
              /*maintain saved commission row ids, no need to maintain for unsaved rows*/
              if (dataRow.id > 0) {
                vm.customerPackingSlipShipping.salesCommissionDeltedIds.push({ id: dataRow.id, refSalesorderdetID: dataRow.refSalesorderdetID });
              }
            });
          }

          vm.customerPackingSlipShipping.isCommissionDataEdited = false;
          vm.customerPackingSlipShipping.salesCommissionList = [];
          //vm.getSalesCommissionDetailsOnPriceChange();

          switch (changeType.id) {
            case TRANSACTION.OnChangeCommissionType.assyId.id:
              vm.customerPackingSlipShipping.price = null;
              vm.customerPackingSlipShipping.qty = null;
              setAssymblyDetails();
              setFocusByName(vm.autocompleteAssy.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.quoteFrom.id:
              vm.customerPackingSlipShipping.price = null;
              vm.customerPackingSlipShipping.qty = null;
              setFocusByName('quoteFrom');
              break;
            case TRANSACTION.OnChangeCommissionType.quoteGroup.id:
              vm.autocompleteQtyTurnTime.keyColumnId = null;
              vm.customerPackingSlipShipping.quoteNumber = null;
              vm.customerPackingSlipShipping.price = null;
              vm.changePrice();
              // setFocusByName(vm.autoCompleteQuoteGroup.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.poQty.id:
              setFocusByName('qty');
              break;
            case TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime.id:
              vm.customerPackingSlipShipping.price = null;
              vm.changePrice();
              setFocusByName(vm.autocompleteQtyTurnTime.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.price.id:
              vm.changePrice();
              vm.getSalesCommissionDetailsOnPriceChange();
              setFocusByName('isSkipKitCreation');
              break;
          }
        }
      }, () => {
        switch (changeType.id) {
          case TRANSACTION.OnChangeCommissionType.assyId.id:
            vm.isAssyChange_No_OptionSelected = true;
            vm.autocompleteAssy.keyColumnId = vm.customerPackingSlipShippingCopy.partID;
            setFocusByName(vm.autocompleteAssy.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.quoteFrom.id:
            vm.customerPackingSlipShipping.quoteFrom = vm.customerPackingSlipShippingCopy.quoteFrom;
            setFocusByName('quoteFrom');
            break;
          //case TRANSACTION.OnChangeCommissionType.quoteGroup.id:
          //  // vm.autoCompleteQuoteGroup.keyColumnId = vm.customerPackingSlipShipping.refRFQGroupID;
          //  // setFocusByName(vm.autoCompleteQuoteGroup.inputName);
          //  break;
          case TRANSACTION.OnChangeCommissionType.poQty.id:
            vm.customerPackingSlipShipping.poQty = vm.customerPackingSlipShippingCopy.poQty;
            setFocusByName('poQty');
            break;
          case TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime.id:
            vm.isQtyTurnTime_No_OptionSelected = true;
            vm.autocompleteQtyTurnTime.keyColumnId = vm.customerPackingSlipShipping.refRFQQtyTurnTimeID;
            setFocusByName(vm.autocompleteQtyTurnTime.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.price.id:
            vm.customerPackingSlipShipping.price = vm.customerPackingSlipShippingCopy.price ? parseFloat(vm.customerPackingSlipShippingCopy.price) : 0;
            setFocusByName('price');
            break;
        }
      });
    };

    //get sales price from part master
    vm.getAssemblySalesPriceDetails = (id) => ComponentFactory.getAssemblySalesPriceDetails().query({ id: id }).$promise.then((res) => {
      vm.AssemblySalesPriceDetailsList = [];
      if (res && res.data) {
        vm.AssemblySalesPriceDetailsList = res.data;
        // vm.changeQty(null, vm.qtyType.POQTY);
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //get sum of available qty
    vm.sumOfCountQty = () => _.sumBy(vm.componentUMIDList, (o) => parseInt(o.pkgUnit));

    function getQtyTurnTimeByAssyId(id, lineId) {
      if (id || vm.autocompleteAssy.keyColumnId) {
        vm.cgBusyLoading = SalesOrderFactory.getQtyandTurnTimeDetailByAssyId().query({
          partID: id || vm.autocompleteAssy.keyColumnId,
          lineId: lineId || null
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            if (response.data.length > 0) {
              vm.customerPackingSlipShipping.quoteNumber = _.first(response.data).rfqNumber;
            }
            vm.quoteQtyTurnTimeList = response.data;
            setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
            //setFocusByName(vm.autocompleteQtyTurnTime.inputName);
            setFocus('fromPartMaster');
          }
          if (vm.autocompleteQtyTurnTime && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.refRFQQtyTurnTimeID) {
            vm.autocompleteQtyTurnTime.keyColumnId = vm.customerPackingSlipShipping.refRFQQtyTurnTimeID;
          }
          if (vm.autocompleteQtyTurnTime && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.refAssyQtyTurnTimeID) {
            vm.autocompleteQtyTurnTime.keyColumnId = vm.customerPackingSlipShipping.refAssyQtyTurnTimeID;
          }
          return vm.quoteQtyTurnTimeDetails;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    vm.changeSalesCommissionFromPartOrRFQ = (id) => {
      vm.autocompleteQtyTurnTime.keyColumnId = null;
      vm.customerPackingSlipShipping.quoteNumber = null;
      switch (vm.customerPackingSlipShipping.quoteFrom) {
        case vm.salesCommissionFrom.FromPartMaster.id:
        case vm.salesCommissionFrom.NA.id:
          {
            if (vm.customerPackingSlipShipping.partId) {
              if (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId) {
                vm.autoCompleteQuoteGroup.keyColumnId = null;
                $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
                $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
              }
              if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                getQtyTurnTimeByAssyId(vm.customerPackingSlipShipping.partId || vm.autocompleteAssy.keyColumnId);
              }
              vm.customerPackingSlipShipping.unitPrice = null;
            }
            vm.customerPackingSlipShipping.refRFQGroupID = null;
          }
          break;
        case vm.salesCommissionFrom.FromRFQ.id:
          {
            if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
              vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
              vm.customerPackingSlipShipping.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
            }
            else if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && (id || vm.customerPackingSlipShipping.partId)) {
              getrfqQuoteGroupList(id || vm.customerPackingSlipShipping.partId);
            }
            if (vm.autoCompleteQuoteGroup.keyColumnId && (id || vm.customerPackingSlipShipping.partId)) {
              getrfqQuoteQtyTurnTimeList(vm.autoCompleteQuoteGroup.keyColumnId, (id || vm.customerPackingSlipShipping.partId));
            }
          }
          break;
      };
      //if (vm.customerPackingSlipShipping.quoteFrom !== vm.salesCommissionFrom.NA.id) {
      //  vm.changeQty(event, vm.qtyType.POQTY);
      //}
    };

    // get details of selected quote group
    const getSelectedquoteGroup = (item) => {
      vm.customerPackingSlipShipping.refRFQGroupID = item ? item.rfqrefID : null;
      vm.customerPackingSlipShipping.quoteNumber = item && item.quoteNumber ? item.quoteNumber : null;
      vm.customerPackingSlipShipping.rfqAssyID = item && item.rfqAssyID ? item.rfqAssyID : null;
      if (item) {
        getrfqQuoteQtyTurnTimeList(item.rfqrefID, item.partID);
        // vm.changeSalesCommissionFromPartOrRFQ
      } else {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
        vm.customerPackingSlipShipping.refRFQGroupID = null;
      }
    };

    const getrfqQuoteQtyTurnTimeList = (groupId, partID) => {
      const detailObj = { partID: partID || vm.autocompleteAssy.keyColumnId, rfqQuoteGroupID: groupId || vm.autoCompleteQuoteGroup.keyColumnId };
      if (detailObj.partID && detailObj.rfqQuoteGroupID) {
        return SalesOrderFactory.getRfqQtyandTurnTimeDetail().query(detailObj).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            vm.quoteQtyTurnTimeList = response.data;
            setQtyTurnTimeValue(response.data);
          }
          if (vm.autocompleteQtyTurnTime && vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.refRFQQtyTurnTimeID) {
            vm.autocompleteQtyTurnTime.keyColumnId = vm.customerPackingSlipShipping.refRFQQtyTurnTimeID;
          }
          return vm.quoteQtyTurnTimeDetails;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return [];
      }
    };

    // get latest description
    vm.getLatestPartDescription = () => {
      //in all if's else do nothing, keep description as it is
      if (vm.customerPackingSlipShipping && vm.customerPackingSlipShipping.partId) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.GET_LATEST_PART_DESCRIPTION_CONFIRMATION);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: vm.customerPackingSlipShipping.partId }).$promise.then((response) => {
              vm.customerPackingSlipShipping.assyDescription = response.data.mfgPNDescription;
              vm.customerPackingSlipDetForm.$$controls[0].$setDirty();
              setFocus('description');
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // no case do nothing
          setFocus('description');
        });
      } else {
        setFocus('description');
      }
    };

    ////get sum of available qty
    //vm.sumOfAvailableQty = () => _.sumBy(vm.componentUMIDList, (o) => parseInt(o.pkgQty));
    // go to UMID page
    vm.goToAddUMID = () => BaseService.goToUMIDDetail();

    //IN MISC Type if user select SO,PO which already Created in Sales order page then we need to give warning message
    const checkMiscPackingSlipForSOPONumber = () => {
      const obj = {
        poNumber: vm.customerslip.poNumber,
        soNumber: vm.customerslip.soNumber,
        customerID: vm.customerslip.customerID
      };
      let messageContent;
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && ((!vm.customerslip.id) || (vm.Copycustomerslip && (vm.Copycustomerslip.poNumber !== vm.customerslip.poNumber || vm.Copycustomerslip.soNumber !== vm.customerslip.soNumber)))) {
        vm.cgBusyLoading = CustomerPackingSlipFactory.checkMiscPackingSlipForSOPONumber().query(obj).$promise.then((resCheck) => {
          // here failed means matchin PO/SO entry exists in sales order
          if (resCheck && resCheck.status === CORE.ApiResponseTypeStatus.FAILED && resCheck.errors.data) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MISC_PACKINGSLIP_SO_ALREADY_EXISTS_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, stringFormat('{0} {1} {2}', vm.customerslip.soNumber ? vm.customerslip.soNumber : '', vm.customerslip.soNumber && vm.customerslip.poNumber ? ' or ' : '', vm.customerslip.poNumber ? vm.customerslip.poNumber : ''), 'Customer Packing Slip');
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(model).then(() => {
              // Continue save
              if (vm.custPackingSlipID) {
                checkinvoice();
              } else {
                customerPackingSlipInvoiceCheck();
              }
            }, () => {
              vm.customerslip.poNumber = null;
              vm.customerslip.soNumber = null;
              vm.customerslip.soRevision = null;
              vm.isFormDirtyManual = false;
              setFocus('poNumber');
            });
          } else {
            if (vm.custPackingSlipID) {
              checkinvoice();
            } else {
              customerPackingSlipInvoiceCheck();
            }
          }
        }).catch((err) => BaseService.getErrorLog(err));
      } else {
        if (vm.custPackingSlipID) {
          checkinvoice();
        } else {
          customerPackingSlipInvoiceCheck();
        }
      }
    };

    // added to  take confirmation at header
    const confirmRevisionAndSaveHeader = (isFromPackingSlipDetail, ev, requiredDet) => {
      // refer following document for version confirmation
      // hs://docs.google.com/spreadsheets/d/1reHJK7FsGR7oWUbVDQaLg-nDx8hLMLL8lfFRTCwt7HY/edit#gid=526413267
      const trackControl = _.find(vm.frmCustomerPackingSlip.$$controls, (ctrl) => ctrl.$name === 'trackingNumber');
      trackControl.$dirty = false;
      const onlyTrackingNumberChanged = !(BaseService.checkFormDirtyExceptParticularControl(vm.frmCustomerPackingSlip, 'trackNumberChanged'));
      let continueWithConfirmation = false;
      // form dirty and save changes only no status change && status  is other than draft
      if (((vm.frmCustomerPackingSlip.$dirty && !vm.isStatusChange) || isFromPackingSlipDetail) && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft) {
        if (isFromPackingSlipDetail) {
          continueWithConfirmation = true;
        } else if (onlyTrackingNumberChanged) {
          continueWithConfirmation = false;
        } else {
          continueWithConfirmation = true;
        }
        //if (!onlyTrackingNumberChanged) {
        //  continueWithConfirmation = true;
        //} else {
        //  continueWithConfirmation = false;
        //}
      } else if (vm.isStatusChange && (isFromPackingSlipDetail || (!vm.isFormDirtyManual && vm.frmCustomerPackingSlip.$dirty))) {
        // status change with form data changes
        if (!onlyTrackingNumberChanged) {
          continueWithConfirmation = true;
        } else {
          continueWithConfirmation = false;
        }
      } else if (vm.isStatusChange && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft && vm.customerslip.isAlreadyPublished && vm.customerslip.isAskForVersionConfirmation) {
        // if status is changed from draft (second time) and changes done in draft mode.
        continueWithConfirmation = true;
      } else {
        continueWithConfirmation = false;
      }
      if (vm.customerslip.id && continueWithConfirmation) {
        const newRevision = (parseInt(vm.customerslip.revision || 0) + 1) < 10 ? stringFormat('0{0}', (parseInt(vm.customerslip.revision || 0) + 1)) : (parseInt(vm.customerslip.revision || 0) + 1).toString();
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, 'Customer Packing Slip', vm.customerslip.revision, newRevision);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customerslip.revision = parseInt(vm.customerslip.revision || 0) + 1;
            vm.customerslip.isRevisionUpdated = true;
            if (isFromPackingSlipDetail) {
              saveCustomerPackingSlipDetails(ev, requiredDet);
            } else {
              saveMasterShipDetail();
            }
          }
        }, () => {
          vm.customerslip.isRevisionUpdated = false;
          if (isFromPackingSlipDetail) {
            saveCustomerPackingSlipDetails(ev, requiredDet);
          } else {
            saveMasterShipDetail();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.customerslip.isRevisionUpdated = false;
        if (isFromPackingSlipDetail) {
          saveCustomerPackingSlipDetails(ev, requiredDet);
        } else {
          saveMasterShipDetail();
        }
      }
    };
    // set navigation on standard text box for  PO/SO case
    vm.setNavigationFromStandards = (ev) => {
      if (ev && ev.keyCode === 9 && vm.isPOPackingSlip) {
        // in case of tab jump to  shipping qty in case of shift tab jump to  custom po line
        if (!ev.shiftKey) {
          // in case of component we allow to change inventory option
          if (vm.customerPackingSlipShipping.materialType && vm.customerPackingSlipShipping.isComponent) {
            setFocus('componentStockType');
          } else {
            if (vm.pendingShipQtyList && vm.pendingShipQtyList.length > 0) {
              setFocus('ShippingQty0');
            } else {
              setFocus('btnAddPartBalance');
            }
          }
        }
      }
    };

    //In MISC Type if user select SO,PO which already Created in Sales order page then we need to give warning message
    const checkMiscPackingSlipForSOPONumberOnBlur = (nextElement) => {
      const obj = {
        poNumber: vm.customerslip.poNumber,
        soNumber: vm.customerslip.soNumber,
        customerID: vm.customerslip.customerID
      };
      let messageContent;
      if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[1].id && vm.customerslip.customerID && ((!vm.customerslip.id) || (vm.Copycustomerslip && (vm.Copycustomerslip.poNumber !== vm.customerslip.poNumber || vm.Copycustomerslip.soNumber !== vm.customerslip.soNumber)))) {
        vm.cgBusyLoading = CustomerPackingSlipFactory.checkMiscPackingSlipForSOPONumber().query(obj).$promise.then((resCheck) => {
          // here failed means matchin PO/SO entry exists in sales order
          if (resCheck && resCheck.status === CORE.ApiResponseTypeStatus.FAILED && resCheck.errors.data) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MISC_PACKINGSLIP_SO_ALREADY_EXISTS_WARNING);
            messageContent.message = stringFormat(messageContent.message, stringFormat('{0} {1} {2}', vm.customerslip.soNumber ? vm.customerslip.soNumber : '', vm.customerslip.soNumber && vm.customerslip.poNumber ? ' or ' : '', vm.customerslip.poNumber ? vm.customerslip.poNumber : ''), 'Customer Packing Slip');
            const model = {
              messageContent: messageContent,
              mutliple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              //vm.customerslip.poNumber = null;
              //vm.customerslip.soNumber = null;
              //vm.customerslip.soRevision = null;
              // setFocus('poNumber');
              setFocus(nextElement);
            });
          }
        }).catch((err) => BaseService.getErrorLog(err));
      }
    };

    vm.calculateExtendedPrice = () => {
      vm.customerPackingSlipShipping.extendedPrice = parseInt(vm.customerPackingSlipShipping.shipQty) * parseFloat((vm.customerPackingSlipShipping.unitPrice || 0));
    };

    // common confirmation detail
    const commonShippingMethodConfirm = (askConfirmation) => {
      if (askConfirmation) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_ADDR_CONFIRM_ALERT);
        messageContent.message = stringFormat(messageContent.message, 'Packing Slip');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customerslip.carrierAccountNumber = vm.ShippingAddress ? (vm.ShippingAddress.carrierAccount || vm.customerslip.carrierAccountNumber) : (vm.customerslip.carrierAccountNumber || null);
            vm.autoCompleteCarriers.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId) : (vm.autoCompleteCarriers.keyColumnId || null);
            vm.autoCompleteShipping.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
          }
        }, () => {
        });
      } else {
        vm.customerslip.carrierAccountNumber = vm.ShippingAddress ? (vm.ShippingAddress.carrierAccount || vm.customerslip.carrierAccountNumber) : (vm.customerslip.carrierAccountNumber || null);
        vm.autoCompleteCarriers.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId) : (vm.autoCompleteCarriers.keyColumnId || null);
        vm.autoCompleteShipping.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
      }
    };

    // Show selected detail record in view mode only
    vm.viewRecordProfile = (row) => {
      if (row.entity.id > 0) {
        if ((vm.customerPackingSlipShippingCopy && row.entity.id !== vm.customerPackingSlipShippingCopy.id) || !vm.customerPackingSlipShippingCopy) {
          row.entity.reflineID = row.entity.lineID;
          row.entity.soLineID = row.entity.isFromSO ? row.entity.lineID : null;
          vm.customerPackingSlipShippingCopy = angular.copy(row.entity);
          vm.customerPackingSlipShipping = angular.copy(row.entity);
          vm.customerPackingSlipShipping.isComponent = vm.customerPackingSlipShipping.partType === vm.partCategoryConst.Component;
          vm.customerPackingSlipShipping.assyID = row.entity.PIDCode;
          vm.customerPackingSlipShipping.assyNumber = row.entity.mfgPN;
          if (vm.customerPackingSlipShipping.materialType) {
            getShippedAssemblyList(vm.customerPackingSlipShipping.id, vm.customerPackingSlipShipping.shippingId || '');
          } else {
            if (vm.salesOrderID && vm.customerPackingSlipShipping.soLineID) {
              vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.PO;
              vm.selectedOtherCharges = vm.otherChargeType.PO;
              getShippingListForOtherCharges();
            } else if (vm.salesOrderID && !vm.customerPackingSlipShipping.soLineID) {
              vm.customerPackingSlipShipping.otherChargeType = vm.otherChargeType.MISC;
              vm.selectedOtherCharges = vm.otherChargeType.MISC;
              getotherTypecomponent();
            }
            vm.customerPackingSlipShipping.isShipForOtherCharges = true;
            vm.autocompleteOtherCharges.keyColumnId = vm.customerPackingSlipShipping.partId;
          }
          let autoCompletePromise = [];
          if ((vm.customerPackingSlipShipping.isCustom || vm.customerPackingSlipShipping.isCPN || vm.customerPackingSlipShipping.isShipForAssembly) && vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
            autoCompletePromise = [getQtyTurnTimeByAssyId(vm.customerPackingSlipShipping.partId)];
          }
          if (vm.customerPackingSlipShipping.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
            if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
              vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
              vm.customerPackingSlipShipping.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
            }
            if (vm.customerPackingSlipShipping.partId) {
              autoCompletePromise = [getrfqQuoteQtyTurnTimeList(vm.customerPackingSlipShipping.refRFQGroupID, (vm.customerPackingSlipShipping.partId))];
            }
          }
          vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
            if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.customerPackingSlipShipping.partId) {
              getrfqQuoteGroupList(vm.customerPackingSlipShipping.partId);
            }
          });
          if (vm.customerPackingSlipType[0].id === vm.customerslip.packingSlipType) {
            //selectSalesOrderDetails(null);
            vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = null;
            vm.pendingShippingDetailList = _.clone(vm.allpendingShippingDetailList);
            vm.autoCompletePackingSlipSalesOrderDetails.keyColumnId = vm.customerPackingSlipShipping.refSalesorderDetid;
            if (vm.autoCompletePackingSlipShipping) {
              // vm.autoCompletePackingSlipShipping.keyColumnId = vm.customerPackingSlipShipping.shippingId;
              $timeout(() => {
                $scope.$broadcast(vm.autoCompletePackingSlipShipping.inputName, vm.customerPackingSlipShipping.shippingId);
              }, 0);
            }
            // vm.autoCompletePackingSlipShipping.keyColumnId = vm.customerPackingSlipShipping.shippingId;
            $timeout(() => {
              setFocus('btnResetDet');
            }, 0);
          } else {
            //vm.autocompleteAssy.keyColumnId = vm.customerPackingSlipShipping.partId;
            if (vm.customerPackingSlipShipping.materialType) {
              const searchObj = {
                partID: vm.customerPackingSlipShipping.partId,
                searchText: null
              };
              getcomponentAssemblyList(searchObj);
              getComponentUMIDList();
            } else {
              vm.autocompleteOtherCharges.keyColumnId = vm.customerPackingSlipShipping.partId;
            }
            setFocus('btnResetDet');
          }
          vm.recordUpdate = false;
          vm.recordView = true;
        }
      }
    };
    //Go To Personal Page
    vm.goToManagePersonal = (employeeId) => {
      BaseService.goToManagePersonnel(employeeId);
    };

    //open log for customer packing slip
    vm.opencustomerpackingSlipChangesHistoryAuditLog = (row, ev) => {
      const data = {
        customerPackingId: vm.customerslip.id,
        customerPackingDetID: null,
        packingSlipNumber: vm.customerslip.packingSlipNumber,
        refSalesOrderID: vm.customerslip.refSalesOrderID,
        transType: CORE.TRANSACTION_TYPE.PACKINGSLIP
      };
      DialogFactory.dialogService(
        CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_CONTROLLER,
        CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
    };

    // show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: CORE.LabelConstant.CustomerPackingSlip.PageName,
        legendList: CORE.LegendList.CustomerPackingSlipList
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
          //sucess section
        }, (error) => BaseService.getErrorLog(error));
    };

    const resetAddressOBject = (resetCPSModel) => {
      if (resetCPSModel) {
        vm.customerslip.billingAddress = null;
        vm.customerslip.shippingAddress = null;
        vm.customerslip.intermediateAddress = null;
        vm.customerslip.billToId = null;
        vm.customerslip.shipToId = null;
        vm.customerslip.intermediateShipmentId = null;
        vm.customerslip.billingAddressObj = null;
        vm.customerslip.shippingAddressObj = null;
        vm.customerslip.intermediateAddressObj = null;
        vm.customerslip.billingContactPersonObj = null;
        vm.customerslip.shippingContactPersonObj = null;
        vm.customerslip.intermediateContactPersonObj = null;
        vm.customerslip.billingContactPersonID = null;
        vm.customerslip.shippingContactPersonID = null;
        vm.customerslip.intermediateContactPersonID = null;
        vm.customerslip.intermediateContactPerson = null;
      }
      vm.IntermediateAddress = null;
      vm.ShippingAddress = null;
      vm.BillingAddress = null;
      vm.BillingAddressContactPerson = null;
      vm.ShippingAddressContactPerson = null;
      vm.IntermediateAddressContactPerson = null;
      vm.shipToOtherDet.customerId = null;
      vm.shipToOtherDet.refTransID = null;
      vm.shipToOtherDet.alreadySelectedAddressID = null;
      vm.billToOtherDet.customerId = null;
      vm.billToOtherDet.refTransID = null;
      vm.billToOtherDet.alreadySelectedAddressID = null;
      vm.intermediateToOtherDet.customerId = null;
      vm.intermediateToOtherDet.refTransID = null;
      vm.ContactPersonOtherDet.customerId = null;
      vm.ContactPersonOtherDet.refTransID = null;
      vm.ContactPersonOtherDet.alreadySelectedPersonId = null;
      vm.ContactPersonOtherDet.selectedContactPerson = null;
    };

    // refresh call back for Address
    vm.refreshAddressCallBack = (ev, addressOtherDet) => {
      getCustomerAddress(vm.customerslip.customerID, addressOtherDet.addressType);
    };

    //check  unique cust po line#/so line# incase of PO/SO CPS and extra other charges.
    vm.checkUniqueSOLineNumber = (lineType, checkUnique) => {
      let lineTypeText, checkValue;
      const obj = {
        soID: vm.customerslip.refSalesOrderID
      };
      if (lineType === CORE.SOLINENUMBERTYPE.CUSTPOLINE) {
        obj.custPOLineNumber = vm.customerPackingSlipShipping.custPOLineID;
        lineTypeText = vm.LabelConstant.SalesOrder.POLineID;
        checkValue = obj.custPOLineNumber;
      } else {
        obj.lineID = vm.customerPackingSlipShipping.reflineID;
        lineTypeText = vm.LabelConstant.SalesOrder.LineID;
        checkValue = obj.lineID;
      }
      if (obj.custPOLineNumber || obj.lineID) {
        if (checkUnique) {
          vm.isopenpop = true;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, lineTypeText);
          const obj = {
            multiple: true,
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj).then((yes) => {
            if (yes) {
              vm.isopenpop = false;
              if (lineType === CORE.SOLINENUMBERTYPE.CUSTPOLINE) {
                vm.customerPackingSlipShipping.custPOLineID = null;
                setFocus('custPOLineID');
              } else {
                vm.customerPackingSlipShipping.reflineID = null;
                setFocus('lineID');
              }
              return $q.resolve(false);
            }
          }).catch(() => BaseService.getErrorLog(error));
        } else if (vm.customerslip.packingSlipType === vm.customerPackingSlipType[0].id && !vm.customerPackingSlipShipping.soLineID && (vm.customerPackingSlipShipping.reflineID || vm.customerPackingSlipShipping.custPOLineID)) {
          // in case of SO CPS check CustPOLine# entered in SO then its should not repeated in manual.
          return CustomerPackingSlipFactory.checkUniqueSOLineNumber().query(obj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data.isDuplicate) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CUSTPOLINE_SOLINE_DUPLICATE);
              messageContent.message = stringFormat(messageContent.message, lineTypeText, checkValue, res.errors.data.data.componentAssembly.mfgPN, vm.customerslip.soNumber);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                if (lineType === CORE.SOLINENUMBERTYPE.CUSTPOLINE) {
                  vm.customerPackingSlipShipping.custPOLineID = null;
                  setFocus('custPOLineID');
                } else {
                  vm.customerPackingSlipShipping.reflineID = null;
                  setFocus('lineID');
                }
                return $q.resolve(false);
              });
            } else {
              return $q.resolve(true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      } else {
        return $q.resolve(true);
      }
    };

    //Other charges Type in case of PO/SO CPS
    vm.changeOtherChargesType = () => {
      vm.moveToNextOtherChgType = false;
      const otherChargeType = angular.copy(vm.customerPackingSlipShipping.otherChargeType);
      vm.customerPackingSlipShipping.isShipForOtherCharges = true;
      if (vm.autocompleteOtherCharges && vm.autocompleteOtherCharges.keyColumnId) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGTYPE_CONFIRMATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customerPackingSlipShipping.otherChargeType = angular.copy(otherChargeType);
            if (vm.autocompleteOtherCharges) {
              vm.autocompleteOtherCharges.keyColumnId = null;
            }
            vm.customerPackingSlipShippingCopy = null;
            vm.selectedOtherCharges = angular.copy(otherChargeType);
            vm.recordUpdate = false;
            // vm.resetShippingDetail();
            if (vm.customerPackingSlipDetForm) {
              vm.customerPackingSlipDetForm.$setPristine();
              vm.customerPackingSlipDetForm.$setUntouched();
            }
            vm.ChargeList = [];
            getotherTypecomponent();

            $timeout(() => { // this timeout put here to give autocomplete time to re-set as per condition
              setFocusByName(vm.autocompleteOtherCharges.inputName);
            }, 600);
            // setFocus('otherChargeType');
          }
        }, () => {
          vm.customerPackingSlipShipping.otherChargeType = vm.selectedOtherCharges;
          vm.autocompleteOtherCharges.keyColumnId = vm.customerPackingSlipShipping.partId;
          vm.ChargeList = [];
          getotherTypecomponent();
          $timeout(() => { // this timeout put here to give autocomplete time to re-set as per condition
            setFocusByName(vm.autocompleteOtherCharges.inputName);
          }, 600);
          // setFocus('otherChargeType');
        });
      } else {
        vm.selectedOtherCharges = angular.copy(otherChargeType);
        vm.ChargeList = [];
        getotherTypecomponent();
        $timeout(() => { // this timeout put here to give autocomplete time to re-set as per condition
          setFocusByName(vm.autocompleteOtherCharges.inputName);
        }, 600);
        // setFocus('otherChargeType');
      }
      if (vm.customerPackingSlipShipping.otherChargeType === vm.otherChargeType.PO) {
        vm.customerPackingSlipShipping.isFromSO = true;
        vm.autocompleteOtherCharges.isAddnew = false;
        // vm.autocompleteOtherCharges.columnName = vm.columnMPNwithLine;
        $scope.$broadcast(vm.autocompleteOtherCharges.inputName + 'ResetAutoComplete');
      } else {
        vm.customerPackingSlipShipping.isFromSO = false;
        vm.autocompleteOtherCharges.isAddnew = true;
        // vm.autocompleteOtherCharges.columnName = vm.columnMPN;
        $scope.$broadcast(vm.autocompleteOtherCharges.inputName + 'ResetAutoComplete');
      }
    };

    //page load then it will add forms in page forms
    angular.element(() => {
      BaseService.currentPageForms = [vm.frmCustomerPackingSlip, vm.customerPackingSlipDetForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.frmCustomerPackingSlip = vm.frmCustomerPackingSlip;
        $scope.$parent.vm.customerPackingSlipDetForm = vm.customerPackingSlipDetForm;
        $scope.$parent.vm.saveCustomerPackingSlip = vm.saveCustomerPackingSlip;
        $scope.$parent.vm.status = vm.customerslip.status;
        $scope.$parent.vm.subStatus = vm.customerslip.subStatus;
        $scope.$parent.vm.changePackingSlipStatus = vm.changePackingSlipStatus;
        $scope.$parent.vm.activeTab = 0;
        $scope.$parent.vm.packingSlip = vm.customerslip.packingSlipNumber;
        $scope.$parent.vm.custCode = vm.customerslip && vm.customerslip.mfgCodeMst ? vm.customerslip.mfgCodeMst.mfgCode : null;
        $scope.$parent.vm.packingSlipVersion = vm.customerslip.revision;
        $scope.$parent.vm.opencustomerpackingSlipChangesHistoryAuditLog = vm.opencustomerpackingSlipChangesHistoryAuditLog;
        $scope.$parent.vm.packingSlipType = vm.customerslip.packingSlipType;
        $scope.$parent.vm.poType = vm.customerslip.poType;
        $scope.$parent.vm.packingSlipTypeText = parseInt(vm.customerslip.packingSlipType) === 2 ? vm.customerPackingSlipType[0].name : vm.customerPackingSlipType[1].name;
      }
    });
  }
})();

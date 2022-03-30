(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('ManageCustomerInvoiceController', ManageCustomerInvoiceController);

  /** @ngInject */
  function ManageCustomerInvoiceController($scope, $q, $state, DialogFactory, CustomerFactory, $stateParams, USER, CORE, BaseService,
    CustomerPackingSlipFactory, $timeout, GenericCategoryFactory, TRANSACTION, $filter, ManageMFGCodePopupFactory, FOBFactory,
    EmployeeFactory, ComponentFactory, SalesOrderFactory, SupplierInvoiceFactory, WorkorderFactory) {
    const vm = this;
    // let oldDtlExtPrice;
    const maxAddressLength = CORE.maxAddressLength;
    vm.transType = $state.params.transType;
    vm.todayDate = new Date();
    vm.LabelConstant = CORE.LabelConstant;
    vm.custInvoiceID = parseInt($stateParams.id);
    vm.packingSlipNumber = $state.params.packingSlipNumber;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.MESSAGE_CONSTANT_GLOBAL_AGREED_REFUND = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL;
    vm.loginUser = BaseService.loginUser;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.invoiceDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.packingSlipDate] = false;
    vm.customerPackingSlipType = angular.copy(CORE.CUSTOMER_PACKING_SLIP_TYPE);
    vm.invPackingSlipType = angular.copy(CORE.CUST_PACKINGSLIP_TYPE);
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.invoiceTypeTransaction = CORE.TRANSACTION_TYPE.INVOICE;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.DefaultDateTimeFormat = _dateTimeFullTimeDisplayFormat;
    vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.CustCreditNoteSubStatusConst = CORE.CUSTCRNOTE_SUBSTATUS;
    vm.partTypes = CORE.PartType;
    vm.categoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.salesShipping = {};

    vm.packingSlip = {
      status: CORE.CUSTINVOICE_STATUS.DRAFT,
      subStatus: (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT,
      invoiceType: true,
      packingSlipNumber: vm.packingSlipNumber,
      customerInvTrackNumber: []
    };
    vm.partCategoryConst = angular.copy(CORE.PartCategory);
    vm.isDisableInvEntry = false;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.salesCommissionFrom = TRANSACTION.SalesCommissionFrom;
    vm.invoiceDetail = {
      materialType: true,
      quoteFrom: vm.salesCommissionFrom.FromPartMaster.id
    };
    vm.OldDetailId = null;
    if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
      vm.isCreditNote = true;
      vm.packingSlip.packingSlipType = vm.invPackingSlipType.CR_NOTE;
    } else {
      vm.isCreditNote = false;
    }
    vm.isInvoiceDetailChanged = false;
    vm.transactionType = CORE.TRANSACTION_TYPE;
    vm.isDisableHeaderZeroValue = false;
    vm.checkCopyStatus = () => { vm.copystatus = false; };
    vm.copyTrackinNumber = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };
    if (vm.custInvoiceID) {
      setFocus('materialType');
    } else {
      if (vm.isCreditNote) {
        setFocus('creditMemoDate');
      } else {
        setFocus('InvoiceType');
      }
    }
    vm.ConfirmingZeroValueHeaderLable = stringFormat(vm.LabelConstant.CustomerPackingSlip.ConfirmingZeroValueHeader, vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Invoice' : 'Credit Memo');
    vm.isStatusChange = false;
    vm.recordView = false;

    vm.billToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.shipToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToActionBtn = angular.copy(CORE.CustAddressViewActionBtn);

    vm.billToContactActionBtn = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.shipToContactActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.intermediateToContactActionBtn = angular.copy(CORE.ContactPersonViewActionBtn);

    vm.intermediateToActionBtn.SetDefault.isVisible = false;
    vm.billToActionBtn.SetDefault.isVisible = false;
    vm.shipToActionBtn.SetDefault.isVisible = false;

    vm.custPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.custPersonViewActionBtnDet.Delete.isVisible = false;

    const disableBillAddrActionButton = (disableFlag) => {
      vm.billToActionBtn.AddNew.isDisable = disableFlag;
      vm.billToActionBtn.Update.isDisable = disableFlag;
      vm.billToActionBtn.Delete.isDisable = disableFlag;
      vm.billToActionBtn.ApplyNew.isDisable = disableFlag;

      vm.billToContactActionBtn.AddNew.isDisable = disableFlag;
      vm.billToContactActionBtn.Update.isDisable = disableFlag;
      vm.billToContactActionBtn.Delete.isDisable = disableFlag;
      vm.billToContactActionBtn.ApplyNew.isDisable = disableFlag;
    };
    const disableShipAddrActionButton = (disableFlag) => {
      vm.shipToActionBtn.AddNew.isDisable = disableFlag;
      vm.shipToActionBtn.Update.isDisable = disableFlag;
      vm.shipToActionBtn.Delete.isDisable = disableFlag;
      vm.shipToActionBtn.ApplyNew.isDisable = disableFlag;

      vm.intermediateToActionBtn.AddNew.isDisable = disableFlag;
      vm.intermediateToActionBtn.Update.isDisable = disableFlag;
      vm.intermediateToActionBtn.Delete.isDisable = disableFlag;
      vm.intermediateToActionBtn.ApplyNew.isDisable = disableFlag;

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

    vm.shipToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.packingSlip.customerID,
      addressType: 'S',
      addressBlockTitle: vm.LabelConstant.Address.ShippingAddress,
      companyName: '',
      refTransID: '',
      refTableName: 'mfgcodemst',
      alreadySelectedPersonId: ''
    };
    vm.billToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.packingSlip.customerID,
      addressType: 'B',
      addressBlockTitle: vm.LabelConstant.Address.BillingAddress,
      companyName: '',
      refTransID: '',
      refTableName: 'mfgcodemst',
      alreadySelectedPersonId: ''
    };
    vm.intermediateToOtherDet = {
      showAddressEmptyState: false,
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      customerId: vm.packingSlip.customerID,
      addressType: CORE.AddressType.IntermediateAddress,
      addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
      companyName: '',
      refTransID: '',
      refTableName: 'mfgcodemst',
      alreadySelectedPersonId: ''
    };

    vm.ContactPersonOtherDet = {
      customerId: vm.packingSlip ? vm.packingSlip.customerID : null,
      refTransID: vm.packingSlip ? vm.packingSlip.customerID : null,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: (vm.contactpersondetail && vm.contactpersondetail.personId) || null,
      showContPersonEmptyState: false,
      companyName: vm.packingSlip.customerName,
      selectedContactPerson: vm.contactpersondetail || null,
      mfgType: CORE.MFG_TYPE.CUSTOMER
    };


    const focusonField = (id) => {
      const objFocus = document.getElementById(id);
      if (objFocus) {
        $timeout(() => {
          objFocus.focus();
        }, true);
      }
    };
    vm.RadioGroup = {
      type: {
        array: angular.copy(TRANSACTION.TypeOfUpdateMaterial),
        checkDisable: () => (!vm.custInvoiceID) || vm.isDisableInvEntry,
        onChange: () => vm.changeInvoiceCharge()
      }
    };

    const getCompanyCode = () => vm.cgBusyLoading = SupplierInvoiceFactory.companyConfigurationCheck().query({}).$promise.then((response) => {
      if (response && response.data) {
        vm.companyCode = response.data.id;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const initdateoption = () => {
      vm.poDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        maxDate: vm.packingSlip.packingSlipDate ? vm.packingSlip.packingSlipDate : vm.packingSlip.invoiceDate
      };
      vm.invoiceDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        maxDate: vm.isCreditNote ? (vm.packingSlip.refDebitMemoDate || vm.packingSlip.creditMemoDate) : null,
        minDate: vm.packingSlip.packingSlipDate ? vm.packingSlip.packingSlipDate : vm.packingSlip.podate
      };
      vm.packingSlipDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        minDate: vm.packingSlip.poDate,
        maxDate: vm.packingSlip.invoiceDate
      };
      vm.creditMemoDateOption = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        minDate: vm.packingSlip.refDebitMemoDate ? vm.packingSlip.refDebitMemoDate : vm.packingSlip.invoiceDate,
        maxDate: vm.todayDate
      };
      vm.refDebitMemoDateOption = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        minDate: vm.packingSlip.invoiceDate ? vm.packingSlip.invoiceDate : vm.packingSlip.poDate,
        maxDate: vm.packingSlip.creditMemoDate
      };
    };
    // to reset re-set Tracking Number Object
    vm.resetCustInvTrackingNumberObj = () => {
      vm.isDisableTrackNumber = false;
      vm.trackingNumberDet = {
        trackNumber: null
      };
      if (vm.frmCustomerInvoice) {
        vm.frmCustomerInvoice.trackingNumber.$setValidity('duplicate', true);
        vm.frmCustomerInvoice.trackingNumber.$setValidity('maxlength', true);
      }
    };
    vm.resetCustInvTrackingNumberObj();

    vm.radioButtonHeaderGroup = {
      invoiceType: {
        array: TRANSACTION.CustomerInvRadioGroup.invoiceType,
        checkDisable: () => vm.custInvoiceID || vm.isDisableInvEntry,
        onChange: () => {
          // on change
          const oldInvoiceType = vm.packingSlip.invoiceType;
          //console.log(vm.packingSlip.invoiceType);
          //console.log(oldInvoiceType);
          if (vm.packingSlip.packingSlipNumber || vm.packingSlip.customerID) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGTYPE_CONFIRMATION);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.resetPackingSlip();
                vm.packingSlip.invoiceType = oldInvoiceType;
              } else {
                vm.packingSlip.invoiceType = !oldInvoiceType;
              }
              if (vm.packingSlip.invoiceType === false || vm.isCreditNote) {
                vm.isDisableForRegInv = false;
              } else {
                vm.isDisableForRegInv = true;
              }
              disableShipAddrActionButton(vm.isDisableForRegInv);
            });
          }
          initAutoComplete();
        }
      }
    };
    initdateoption();
    getCompanyCode();
    //autocomplete on customer selection based
    const autoCompleteSelectCust = () => {
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.packingSlip ? (vm.packingSlip.shippingMethodId ? vm.packingSlip.shippingMethodId : null) : null,
        inputName: vm.categoryTypeObjList.ShippingType.Name,
        placeholderName: vm.categoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: vm.categoryTypeObjList.ShippingType.Title
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.salesShipping.shippingMethod = item.gencCategoryDisplayName;
          }
          else {
            vm.salesShipping.shippingMethod = null;
          }
          if (item && vm.autoCompleteCarriers && (!vm.packingSlip.id || (vm.CopyPackingslip && vm.packingSlip.shipToId === vm.CopyPackingslip.shipToId)) &&
            (vm.packingSlip.shippingMethodId !== item.gencCategoryID || vm.autoCompleteShipping.shippingMethodId !== item.gencCategoryID)) {
            if (vm.packingSlip.shippingMethodId && vm.packingSlip.shippingMethodId !== item.gencCategoryID) {
              const model = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              }, () => {
                vm.autoCompleteShipping.keyColumnId = vm.packingSlip.shippingMethodId;
                vm.autoCompleteCarriers.keyColumnId = vm.packingSlip.carrierID;
                vm.packingSlip.carrierAccountNumber = angular.copy(vm.CopyPackingslip.carrierAccountNumber);
              });
            } else {
              if (vm.packingSlip.id && vm.CopyPackingslip.shippingMethodId !== item.gencCategoryID) {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              }
              if (!vm.packingSlip.id && vm.packingSlip.shippingMethodId !== item.gencCategoryID) {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              }
            }
          } else if (!item) {
            vm.packingSlip.carrierAccountNumber = null;
            vm.autoCompleteCarriers.keyColumnId = null;
          }
        }
      };
      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: vm.packingSlip && vm.packingSlip.salesCommissionTo ? vm.packingSlip.salesCommissionTo : null,
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
        keyColumnId: vm.packingSlip ? (vm.packingSlip.termsId ? vm.packingSlip.termsId : null) : null,
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
      vm.autoCompleteFOB = {
        columnName: 'name',
        controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.packingSlip ? (vm.packingSlip.freeOnBoardId ? vm.packingSlip.freeOnBoardId : null) : null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.packingSlip && vm.packingSlip.carrierID ? vm.packingSlip.carrierID : null,
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

    ////get all charge list details
    //const getAllGenericCategoryByCategoryType = () => {
    //  const GencCategoryType = [];
    //  GencCategoryType.push(CORE.CategoryType.ChargesType.Name);
    //  const listObj = {
    //    GencCategoryType: GencCategoryType
    //  };
    //  return GenericCategoryFactory.getSelectedGenericCategoryList().query({
    //    listObj: listObj
    //  }).$promise.then((genericCategories) => {
    //    const GenericCategoryAllData = genericCategories.data;
    //    //get charge list
    //    vm.ChargeList = _.filter(GenericCategoryAllData, (item) => item.categoryType === CORE.CategoryType.ChargesType.Name && item.isActive === true);
    //    return $q.resolve(vm.ChargeList);
    //  }).catch((error) => BaseService.getErrorLog(error));
    //};

    //get customer mfgpn and all component/other part details
    const getcomponentMfgPNList = (searchObj) => {
      searchObj.customerID = (vm.iscompany ? null : vm.packingSlip.customerID);
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

    //other part type component
    const getotherTypecomponent = () => SalesOrderFactory.getOtherPartTypeComponentDetails().query().$promise.then((charges) => {
      if (charges && charges.data) {
        vm.ChargeList = angular.copy(charges.data);
        return $q.resolve(vm.OtherPartTypeComponents);
      }
    }).catch((error) => BaseService.getErrorLog(error));

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
            resetOtherChargeSelection();
            setFocusByName(vm.autocompleteOtherCharges.inputName);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          selectOtherChargesAfterConfirmation(item);
        }
        //setFocus('unitPrice');
      }
      else {
        resetOtherChargeSelection();
        setFocusByName(vm.autocompleteOtherCharges.inputName);
      }
    };

    // on remove selection  or confirm with "no" for inactive part
    const resetOtherChargeSelection = () => {
      vm.invoiceDetail.partType = vm.invoiceDetail.partId = vm.invoiceDetail.isCustom = vm.invoiceDetail.rohsIcon = vm.invoiceDetail.mfgcodeID = vm.invoiceDetail.rohsText = vm.invoiceDetail.mfgPN = vm.invoiceDetail.mfgName = null;
      vm.PartPriceBreakDetailsData = [];
      vm.invoiceDetail.unitPrice = null;
      vm.invoiceDetail.packingSlipSerialNumber = null;
      vm.invoiceDetail.id = null;
      vm.resetInvoiceDetail();
      // setFocus('materialType');
    };

    // set other charges detail  after taking confirmation for incorrect part status
    const selectOtherChargesAfterConfirmation = (item) => {
      const objLineItem = _.find(vm.sourceData, (line) => item.id === parseInt(line.partId) && vm.invoiceDetail.packingSlipSerialNumber === line.packingSlipSerialNumber);
      if (objLineItem) {
        vm.invoiceDetail.partId = objLineItem.partId;
        vm.invoiceDetail.rohsIcon = objLineItem.rohsIcon;
        vm.invoiceDetail.rohsName = objLineItem.rohsName;
        vm.invoiceDetail.shipQty = parseInt(objLineItem.shipQty);
        vm.invoiceDetail.unitPrice = parseFloat(objLineItem.unitPrice);
        vm.invoiceDetail.packingSlipSerialNumber = objLineItem.packingSlipSerialNumber;
        vm.invoiceDetail.lineID = objLineItem.lineID;
        vm.invoiceDetail.PIDCode = objLineItem.PIDCode;
        vm.invoiceDetail.assyDescription = objLineItem.assyDescription;
        vm.invoiceDetail.mfgName = objLineItem.mfgName;
        vm.invoiceDetail.mfgcodeID = objLineItem.mfgcodeid;
        vm.invoiceDetail.isFromPackingSlip = objLineItem.isFromPackingSlip;
        vm.invoiceDetail.id = objLineItem.id;
        vm.invoiceDetail.quoteFrom = objLineItem.quoteFrom;
        vm.recordUpdate = true;
        //vm.changePrice();
      } else {
        vm.recordUpdate = false;
        vm.invoiceDetail.partId = item.id;
        vm.invoiceDetail.PIDCode = item.pidcode;
        vm.invoiceDetail.assyDescription = item.mfgPNDescription;
        vm.invoiceDetail.isCustom = item.isCustom;
        vm.invoiceDetail.rohsIcon = item.rohsIcon;// stringFormat('{0}{1}', vm.rohsImagePath,
        vm.invoiceDetail.rohsName = item.rohsName;
        vm.invoiceDetail.partType = CORE.PartType.Other;
        vm.invoiceDetail.mfgPN = item.mfgPN;
        vm.invoiceDetail.partCategory = item.category;
        vm.invoiceDetail.mfgName = stringFormat('({0}) {1}', item.mfgCode, item.mfgName);
        vm.invoiceDetail.mfgcodeID = item.mfgcodeid;
        vm.invoiceDetail.shipQty = 1;
        vm.invoiceDetail.isFromPackingSlip = item.isFromPackingSlip;
        if (!vm.isCreditNote) {
          vm.getPartPriceBreakDetails(item.id).then(() => {
            vm.changeOtherPartQty();
          });
        }
        const maxLine = _.maxBy(vm.sourceData, (charges) => parseInt(charges.packingSlipSerialNumber));
        if (maxLine) {
          if (parseInt(maxLine.packingSlipSerialNumber) >= CORE.InvoiceOtherChargeStartNumber) {
            vm.invoiceDetail.packingSlipSerialNumber = parseInt(maxLine.packingSlipSerialNumber) + 1;
          } else {
            vm.invoiceDetail.packingSlipSerialNumber = CORE.InvoiceOtherChargeStartNumber + 1;
          }
        } else {
          vm.invoiceDetail.packingSlipSerialNumber = CORE.InvoiceOtherChargeStartNumber + 1;
        }
        vm.invoiceDetail.quoteFrom = vm.salesCommissionFrom.NA.id;
      }
    };

    const getQtyTurnTime = () => {
      if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        return getrfqQuoteQtyTurnTimeList();
      }
      else if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
        return vm.getAssemblySalesPriceDetails(vm.autocompleteAssy.keyColumnId);
      }
    };
    //If select quotes from part master and packing slip or po/so to invoice then we allow to change RFQ details in invoice section
    vm.getAssemblySalesPriceDetails = (id) => ComponentFactory.getAssemblySalesPriceDetails().query({ id: id }).$promise.then((res) => {
      vm.AssemblySalesPriceDetailsList = [];
      if (res && res.data) {
        vm.AssemblySalesPriceDetailsList = res.data;
        // vm.changeQty(null, vm.qtyType.POQTY);
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));
    const setQtyTurnTimeValue = (data) => {
      const quoteQtyTurnData = data;
      // let unitPrice = null;
      vm.quoteQtyTurnTimeDetails = [];
      if (quoteQtyTurnData && quoteQtyTurnData.length > 0 && vm.invoiceDetail.shipQty) {
        //====
        let filterdList = _.sortBy(_.filter(quoteQtyTurnData, (qtyBreak) => qtyBreak.priceBreak <= vm.invoiceDetail.shipQty), (o) => o.priceBreak);
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
        // $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, vm.quoteQtyTurnTimeDetails[0].qtyTurnTime);
        // $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', vm.quoteQtyTurnTimeDetails[0].qtyTurnTime);
        // unitPrice = vm.quoteQtyTurnTimeDetails[0].unitPrice;
      } else if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length > 1 && vm.autocompleteQtyTurnTime) {
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, null);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
      } else if (!vm.invoiceDetail || !vm.invoiceDetail.id) {
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, null);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
      }
      // vm.changeQty(null, vm.qtyType.POQTY, unitPrice);
    };

    const onChangeTurnTime = (item) => {
      $timeout(() => {
        if (vm.isQtyTurnTime_No_OptionSelected) {
          vm.isQtyTurnTime_No_OptionSelected = false;
          return;
        }
        //if (item) {
        if ((vm.invoiceDetail && vm.invoiceDetail.salesCommissionList && vm.invoiceDetail.salesCommissionList.length > 0) &&
          ((vm.invoiceDetail.isCommissionDataEdited && item && vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== item.id) ||
            (vm.invoiceDetail.id > 0 && (!item || (vm.invoiceDetail.salesCommissionList.length > 0 && vm.autocompleteQtyTurnTime))))) {
          if ((vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id && vm.autocompleteQtyTurnTime.keyColumnId && vm.autocompleteQtyTurnTime.keyColumnId !== vm.invoiceDetail.refAssyQtyTurnTimeID) ||
            (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && vm.autocompleteQtyTurnTime.keyColumnId && vm.autocompleteQtyTurnTime.keyColumnId !== vm.invoiceDetail.refRFQQtyTurnTimeID)) {
            changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime);
          }
        }
        else {
          getSelectedturnTime(item);
        }
        //  }
      });
    };
    // get quote group details
    const getrfqQuoteGroupList = (id) => SalesOrderFactory.getQuoteGroupDetailsfromPartID().query({ partID: id || vm.invoiceDetail.partId }).$promise.then((response) => {
      if (response && response.data) {
        vm.quoteGroupDetails = response.data;
      }
      if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1 && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
      } else if (vm.autoCompleteQuoteGroup && vm.invoiceDetail && vm.invoiceDetail.refRFQGroupID) {
        vm.autoCompleteQuoteGroup.keyColumnId = angular.copy(vm.invoiceDetail.refRFQGroupID);
      }
      return vm.quoteGroupDetails;
    }).catch((error) => BaseService.getErrorLog(error));

    const onSelectCallbackQuoteGroup = (item) => {
      if ((vm.invoiceDetail && vm.invoiceDetail.salesCommissionList && vm.invoiceDetail.salesCommissionList.length > 0) && ((vm.invoiceDetail.isCommissionDataEdited && item && vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== item.rfqrefID) ||
        (vm.invoiceDetail.id > 0 && (!item || (vm.invoiceDetail.salesCommissionList.length > 0 && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId !== vm.invoiceDetail.refRFQGroupID))))) {
        changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteGroup);
      }
      else {
        if (!vm.invoiceDetail.id && item && item.quoteValidTillDate && (new Date(item.quoteValidTillDate)).setHours(0, 0, 0, 0) < (new Date(BaseService.getCurrentDate())).setHours(0, 0, 0, 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.QUOTE_EXPIRE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, item.quoteNumber, BaseService.getUIFormatedDate(item.quoteValidTillDate, vm.DefaultDateFormat));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              getSelectedquoteGroup(item);
            }
          }, () => {
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
            vm.autoCompleteQuoteGroup.keyColumnId = null;
            setFocus('qty');
          });
        } else {
          getSelectedquoteGroup(item);
        }
      }
    };

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      vm.autoCompleteCustomer = {
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
            //vm.packingSlip.customer = item.mfgCode;
            if (vm.packingSlip.customerID !== item.id) {
              vm.packingSlip.headerComment = item.comments;
            }
            vm.packingSlip.customerID = item.id;
            vm.packingSlip.customerName = item.mfgName;
            vm.packingSlip.customerNamewithCode = item.mfgCode; // stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.packingSlip.mfgCodeMst.mfgCode, vm.packingSlip.mfgName);
            $scope.$parent.vm.packingSlipMainObj.customerId = vm.packingSlip.customerID ? vm.packingSlip.customerID : null;
            $scope.$parent.vm.packingSlipMainObj.customerName = item.mfgCodeName ? item.mfgCodeName : null;

            vm.shipToOtherDet.customerId = item.id;
            vm.shipToOtherDet.refTransID = item.id;
            vm.billToOtherDet.customerId = item.id;
            vm.billToOtherDet.refTransID = item.id;
            vm.intermediateToOtherDet.customerId = item.id;
            vm.intermediateToOtherDet.refTransID = item.id;
            vm.ContactPersonOtherDet.customerId = item.id;
            vm.ContactPersonOtherDet.refTransID = item.id;
            vm.ContactPersonOtherDet.companyName = item.mfgName;
            // vm.iscompany = item.isCompany;
            const autocompleteCustomerPromise = [getCustomerContactPersonList(), getCarrierList(), getCustomerAddress(vm.packingSlip.customerID), getFOBList(), getSalesCommissionEmployeeListbyCustomer(), getTermsList(), getShippingList()];
            vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
              if (!vm.autoCompleteShipping) {
                autoCompleteSelectCust();
              }
              if (!vm.packingSlip.id) {
                vm.packingSlip.headerComment = vm.packingSlip.headerComment || item.comments;
                vm.autoCompleteTerm.keyColumnId = item.paymentTermsID;
                vm.autoCompleteShipping.keyColumnId = item.shippingMethodID;
                vm.autoCompleteFOB.keyColumnId = item.freeOnBoardId;
                vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo;
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
                vm.packingSlip.carrierAccountNumber = item.carrierAccount;
                commonShippingMethodConfirm(false);
                focusonField('poNumber');
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
            if (vm.autoCompleteCarriers) {
              vm.autoCompleteCarriers.keyColumnId = null;
            }
            vm.packingSlip.customerID = null;
            vm.packingSlip.customerName = null;
            // vm.packingSlip.mfgName = null;
            // vm.iscompany = false;
            vm.packingSlip.salesCommissionTo = null;
            vm.packingSlip.termsID = null;
            vm.packingSlip.shippingMethodId = null;
            vm.packingSlip.freeOnBoardId = null;
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.packingSlipMainObj.customerId = null;
              $scope.$parent.vm.packingSlipMainObj.customerName = null;
            }
            vm.contactpersondetail = null;
            resetAddressOBject(true);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteCustomer.inputName,
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
          customerID: vm.packingSlip ? vm.packingSlip.customerID : null
        },
        isRequired: (!vm.isDisableInvEntry) || vm.invoiceDetail.materialtype || (vm.packingSlip.invoiceType && vm.isCreditNote),
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            partID: obj.id,
            searchText: null
          };
          return getcomponentAssemblyList(searchObj);
        },
        onSelectCallbackFn: setcomponentAssemblyList,
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
          customerID: vm.packingSlip ? vm.packingSlip.customerID : null
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
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Other Charges',
        placeholderName: 'Other Charges',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other,
          customerID: vm.companyCode ? vm.companyCode : null
        },
        isRequired: true,
        isAddnew: true,
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

    //get customer packing slip detail
    const getCustomerInvoiceDetail = () => {
      let sumOtherCharges = 0;
      vm.sourceData = [];
      vm.cgBusyLoading = CustomerPackingSlipFactory.getCustomerInvoiceDetailByID().query({
        id: vm.custInvoiceID,
        transType: vm.transType
      }).$promise.then((res) => {
        if (res && res.data && res.data.PackingSlipDetail && res.data.PackingSlipDetail.length > 0) {
          vm.packingSlip = _.first(res.data.PackingSlipDetail);
          vm.CopyPackingslip = angular.copy(vm.packingSlip);
          vm.packingSlip.poDate = BaseService.getUIFormatedDate(vm.packingSlip.poDate, vm.DefaultDateFormat);
          vm.packingSlip.invoiceDate = BaseService.getUIFormatedDate(vm.packingSlip.invoiceDate, vm.DefaultDateFormat);
          vm.packingSlip.packingSlipDate = BaseService.getUIFormatedDate(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat);
          vm.packingSlip.creditMemoDate = BaseService.getUIFormatedDate(vm.packingSlip.creditMemoDate, vm.DefaultDateFormat);
          vm.packingSlip.refDebitMemoDate = BaseService.getUIFormatedDate(vm.packingSlip.refDebitMemoDate, vm.DefaultDateFormat);
          vm.packingSlip.refPackingSlipId = vm.packingSlip.packingSlipID;
          vm.packingSlip.isZeroValue = vm.packingSlip.isZeroValue > 0 ? true : false;
          vm.packingSlip.isMarkForRefund = vm.packingSlip.isMarkForRefund > 0 ? true : false;
          vm.packingSlip.agreedRefundAmtDisplay = vm.packingSlip.isMarkForRefund ? vm.packingSlip.agreedRefundAmt : null;
          vm.packingSlip.leftOverCMAmtToBeRefunded = parseFloat(((vm.packingSlip.agreedRefundAmt || 0) - (vm.packingSlip.totRefundIssuedAgainstCreditMemo || 0)).toFixed(2));
          vm.packingSlip.sumOfAppliedCMRefundedAmt = parseFloat(((vm.packingSlip.receivedAmount || 0) + (vm.packingSlip.totRefundIssuedAgainstCreditMemo || 0)).toFixed(2));
          vm.ContactPersonOtherDet.customerId = vm.packingSlip.customerID;
          vm.ContactPersonOtherDet.refTransID = vm.packingSlip.customerID;
          vm.ContactPersonOtherDet.companyName = vm.packingSlip.customerName;
          vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.packingSlip.contactPersonId;

          if (vm.packingSlip.packingSlipType !== vm.invPackingSlipType.MISC_INV) {
            vm.packingSlip.invoiceType = true;
          } else {
            vm.packingSlip.invoiceType = false;
          }
          if (vm.packingSlip && !vm.isCreditNote) {
            vm.packingSlip.paymentStatusObj = _.find(CORE.Customer_Payment_Status, (item) => item.Code === (vm.packingSlip.paymentStatusCode || ''));
          } else {
            vm.packingSlip.paymentStatusObj = _.find(TRANSACTION.ApplyCustomerCreditMemoStatusText, (item) => item.Code === (vm.packingSlip.paymentStatus || 'PE'));
          }
          vm.shipToOtherDet.customerId = vm.packingSlip.customerID;
          vm.shipToOtherDet.refTransID = vm.packingSlip.customerID;
          vm.shipToOtherDet.companyNameWithCode = vm.packingSlip.customerName;
          vm.billToOtherDet.customerId = vm.packingSlip.customerID;
          vm.billToOtherDet.refTransID = vm.packingSlip.customerID;
          vm.billToOtherDet.companyNameWithCode = vm.packingSlip.customerName;
          vm.intermediateToOtherDet.customerId = vm.packingSlip.customerID;
          vm.intermediateToOtherDet.refTransID = vm.packingSlip.customerID;
          vm.intermediateToOtherDet.companyNameWithCode = vm.packingSlip.customerName;
          if ($scope.$parent && $scope.$parent.vm) {
            //Show packing slip number on header
            $scope.$parent.vm.packingSlipMainObj.packingSlipNumber = vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : null;
            $scope.$parent.vm.packingSlipMainObj.packingSlipTypeText = vm.packingSlip.packingSlipTypeText ? vm.packingSlip.packingSlipTypeText : null;
            $scope.$parent.vm.packingSlipMainObj.invoiceTypeText = vm.packingSlip.invoiceTypeText ? vm.packingSlip.invoiceTypeText : null;
            $scope.$parent.vm.packingSlipMainObj.packingSlipID = vm.packingSlip.packingSlipID ? vm.packingSlip.packingSlipID : null;
            $scope.$parent.vm.packingSlipMainObj.isLocked = vm.packingSlip.isLocked;
            $scope.$parent.vm.packingSlipMainObj.packingSlipType = vm.packingSlip.packingSlipType ? vm.packingSlip.packingSlipType : null;
            $scope.$parent.vm.packingSlipMainObj.lockedAt = vm.packingSlip.lockedAt;
            $scope.$parent.vm.packingSlipMainObj.lockedBy = vm.packingSlip.lockedBy;
            $scope.$parent.vm.packingSlipMainObj.refSalesOrderId = vm.packingSlip.refSalesOrderId;
            $scope.$parent.vm.packingSlipMainObj.customerId = vm.packingSlip.customerID ? vm.packingSlip.customerID : null;
            $scope.$parent.vm.packingSlipMainObj.customerName = vm.packingSlip.customerName ? vm.packingSlip.customerName : null;
            $scope.$parent.vm.packingSlipMainObj.poNumber = vm.packingSlip.poNumber ? vm.packingSlip.poNumber : null;
            $scope.$parent.vm.packingSlipMainObj.revision = vm.packingSlip.revision;
            $scope.$parent.vm.packingSlipMainObj.packingSlipSubStatus = vm.packingSlip.packingSlipSubStatus ? vm.packingSlip.packingSlipSubStatus : null;
            $scope.$parent.vm.packingSlipMainObj.materialStatus = vm.packingSlip.materialStatus ? vm.packingSlip.materialStatus : null;
            $scope.$parent.vm.packingSlipNumber = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? vm.packingSlip.invoiceNumber : vm.packingSlip.creditMemoNumber;
            $scope.$parent.vm.custCode = vm.packingSlip.customerCodeOnly ? vm.packingSlip.customerCodeOnly : '';
            $scope.$parent.vm.paymentStatusObj = vm.packingSlip.paymentStatusObj;
            $scope.$parent.vm.packingSlipMainObj.refundStatus = vm.packingSlip.refundStatus;
            $scope.$parent.vm.packingSlipMainObj.creditMemoRefundStatusText = vm.packingSlip.creditMemoRefundStatusText;
            $scope.$parent.vm.packingSlipMainObj.poType = vm.packingSlip.poType;
          }
          _.map(res.data.PackingSlipDet, (data) => {
            //if (data.refChargesTypeID) {
            //  data.mfgpn = null;
            //}
            data.OtherDetList = [];
            data.removeOtherChargesIds = [];
            sumOtherCharges = 0;
            if (res.data.OtherDet && res.data.OtherDet.length > 0) {
              _.map(res.data.OtherDet, (otherData) => {
                if (data.id === otherData.refCustomerPackingSlipDetID) {
                  data.OtherDetList.push(otherData);
                  sumOtherCharges = parseFloat(sumOtherCharges + parseFloat(otherData.price * otherData.qty));
                }
              });
              data.lineOtherCharges = sumOtherCharges;
              data.totalExtPrice = parseFloat(data.extendedPrice) + parseFloat(data.lineOtherCharges);
            }
          });

          // set commission attribute detail line wise
          _.each(res.data.PackingSlipDet, (data) => {
            if (res.data.commissionList && res.data.commissionList.length > 0) {
              data.salesCommissionList = _.filter(res.data.commissionList, (det) => det.refCustPackingSlipDetID === data.id);
              _.each(data.salesCommissionList, (commission) => {
                commission.childSalesCommissionList = _.filter(res.data.childCommissionList, (det) => det.refcustInvoiceCommissionID === commission.id);
                commission.qty = commission.poQty;
                commission.fieldName = commission.commissionCalculateFrom === TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.ID ? TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.FIELDNAME : commission.commissionCalculateFrom === TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID ? TRANSACTION.SO_COMMISSION_ATTR.RFQ.FIELDNAME : TRANSACTION.SO_COMMISSION_ATTR.MISC.FIELDNAME;
                commission.typeName = commission.type === TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.ID ? TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.COMMISSIONCALCULATEDFROM : commission.type === TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID ? TRANSACTION.SO_COMMISSION_ATTR.RFQ.COMMISSIONCALCULATEDFROM : TRANSACTION.SO_COMMISSION_ATTR.MISC.COMMISSIONCALCULATEDFROM;
              });
            }
          });
          if (vm.packingSlip.status === CORE.CUSTINVOICE_STATUS.PUBLISHED || vm.packingSlip.isLocked || vm.packingSlip.paymentStatus !== 'PE') {
            vm.isDisableInvEntry = true;
          } else {
            vm.isDisableInvEntry = false;
          }
          if (vm.packingSlip.invoiceType === false || vm.isCreditNote) {
            vm.isDisableForRegInv = false;
          } else {
            vm.isDisableForRegInv = true;
          }
          disableBillAddrActionButton(vm.isDisableInvEntry);
          disableShipAddrActionButton(vm.isDisableInvEntry || vm.isDisableForRegInv);

          $scope.$parent.vm.packingSlipMainObj.isDisableInvEntry = vm.isDisableInvEntry;
          vm.packingSlip.customerInvTrackNumber = res.data.trackingDetail ? res.data.trackingDetail : [];
          _.each(vm.packingSlip.customerInvTrackNumber, (item, index) => {
            item.tempID = (index + 1);
          });
          const salesOrderLineDetIds = [];
          vm.packingSlip.isDiscoutnAdded = false;
          _.each(res.data.PackingSlipDet, (data) => {
            data.packingSlipType = vm.packingSlip.packingSlipType;
            if ((vm.packingSlip.packingSlipType === vm.invPackingSlipType.MISC_PS || vm.packingSlip.packingSlipType === vm.invPackingSlipType.MISC_INV)) {
              data.isDisableOtherCharges = false;
            } else {
              if (_.find(salesOrderLineDetIds, (soDet) => soDet === data.refSalesorderDetid) || vm.packingSlip.packingSlipType !== vm.invPackingSlipType.SO_PS) {
                data.isDisableOtherCharges = true;
              }
            }
            if (vm.packingSlip.status === CORE.CUSTINVOICE_STATUS.PUBLISHED || vm.packingSlip.paymentStatus !== 'PE' || vm.packingSlip.isLocked) {
              data.isDisabledUpdate = true;
              data.isDisabledDelete = true;
            }
            if (vm.packingSlip.invoiceType && !vm.isCreditNote) {
              //data.isDisabledUpdate = true;
              data.isDisabledDelete = true;
            }
            // PO/SO Invoice - Allow to delete line added at Invoice not from packing slip
            if (!vm.packingSlip.isLocked && vm.packingSlip.paymentStatus === 'PE' && vm.packingSlip.status !== CORE.CUSTINVOICE_STATUS.PUBLISHED && vm.packingSlip.packingSlipType === vm.invPackingSlipType.SO_PS && (!data.isFromPackingSlip)) {
              data.isDisabledDelete = false;
            }
            // in case of Packing Slip Invoice and "Corrected & Invoiced" status , we will not allow to any delete detail record
            // confirmed on 01/02/2021 with Vaibhav Shah
            if (vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED && (!vm.isCreditNote) && (vm.packingSlip.packingSlipType === vm.invPackingSlipType.MISC_PS || vm.packingSlip.packingSlipType === vm.invPackingSlipType.SO_PS)) {
              data.isDisabledDelete = true;
            }
            salesOrderLineDetIds.push(data.refSalesorderDetid);
            if ((data.extendedPrice || 0) === 0 && (!data.isZeroValue)) {
              vm.packingSlip.isZeroValueLineWithoutFlagCnt = parseInt(vm.packingSlip.isZeroValueLineWithoutFlagCnt || 0) + 1;
            } else if (data.extendedPrice < 0) {
              vm.packingSlip.isDiscoutnAdded = true;
            } else if (data.extendedPrice === 0 && data.isZeroValue) {
              vm.packingSlip.isZeroValueLineWithFlagCnt = parseInt(vm.packingSlip.isZeroValueLineWithFlagCnt || 0) + 1;
            }
          });
          vm.sourceData = angular.copy(res.data.PackingSlipDet);
          vm.packingSlipDetail = angular.copy(res.data.PackingSlipDet);
          vm.salesFilterDet = angular.copy(_.filter(res.data.PackingSlipDet, (sDet) => sDet.partType !== vm.partTypes.Other));
          _.each(vm.salesFilterDet, (soDet) => {
            soDet.assyIDPID = soDet.custPOLineID ? stringFormat('{0} | {1}', soDet.custPOLineID, soDet.PIDCode) : soDet.PIDCode;
          });
          initdateoption();
          const autocompleteCustomerPromise = [getCustomerContactPersonList(), getotherTypecomponent(), getShippingList(), getCarrierList()];
          vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
            initAutoComplete();
            if (vm.isCreditNote && !vm.autoCompleteShipping) {
              autoCompleteSelectCust();
            }
            const searchObj = {
              mfgcodeID: vm.packingSlip.customerID,
              isCustomer: true
            };
            //if (vm.isCreditNote) {
            //  vm.autoCompleteShipping.keyColumnId = vm.packingSlip.shippingMethodId;
            //  vm.autoCompleteCarriers.keyColumnId = vm.packingSlip.carrierID;
            //}
            getCustomerSearch(searchObj);
            getCustomerAddress(vm.packingSlip.customerID);
            //if (vm.packingSlipDetail.length > 0) {
            vm.loadData();
            //setGrid();
            commonField();
            if (vm.invoiceDetailForm) {
              vm.invoiceDetailForm.$setPristine();
              vm.invoiceDetailForm.$setUntouched();
            }
            if (!vm.packingSlip.invoiceType && vm.autoCompleteCustomer) {
              vm.autoCompleteCustomer.keyColumnId = vm.packingSlip.customerID;
            }
            // if header zero value set from SP then make form dirty
            if (vm.frmCustomerInvoice.headerinternalComment.$error && vm.packingSlip.isZeroValue && (!vm.packingSlip.headerComment)) {
              vm.frmCustomerInvoice.$setDirty();
            }
            // if discuount added in detail then  only allow to set zero flag at header
            // if dicount and other zero value line without flag added then  also  not allowed
            if (vm.packingSlip.isDiscoutnAdded && vm.packingSlip.totalExtendedPrice === 0) {
              if (vm.packingSlip.isZeroValueLineWithoutFlagCnt) {
                vm.isDisableHeaderZeroValue = true;
              } else {
                vm.isDisableHeaderZeroValue = false;
              }
            } else {
              if (vm.packingSlip.isZeroValueLineWithoutFlagCnt) {
                vm.isDisableHeaderZeroValue = true;
              } else if (vm.packingSlip.isZeroValueLineWithFlagCnt === vm.sourceData.length) {
                vm.isDisableHeaderZeroValue = true;
              } else {
                vm.isDisableHeaderZeroValue = false;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.status = vm.packingSlip.status;
            $scope.$parent.vm.subStatus = vm.packingSlip.subStatus;
            $scope.$parent.vm.packingId = vm.custInvoiceID;
            if ($scope.$parent.vm.autoCompletePackingSlip) {
              $scope.$parent.vm.autoCompletePackingSlip.keyColumnId = vm.custInvoiceID;
            }
            // $scope.$parent.vm.label = vm.packingSlip.status ? CORE.OPSTATUSLABLEDRAFTED : CORE.OPSTATUSLABLELOCK;
            $scope.$parent.vm.tabList[1].isDisabled = false;
            if (!vm.isCreditNote) {
              $scope.$parent.vm.tabList[2].isDisabled = false;
              if (vm.packingSlip.packingSlipType !== vm.invPackingSlipType.MISC_INV) {
                $scope.$parent.vm.tabList[3].isDisabled = false;
              }
            }
            $scope.$parent.vm.packingSlipMainObj.isDisableInvEntry = vm.isDisableInvEntry || false;
          }
          return $q.resolve(vm.packingSlip);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // get price break detail for component
    vm.getPartPriceBreakDetails = (id) => ComponentFactory.getPartPriceBreakDetails().query({ id: id }).$promise.then((res) => {
      if (res && res.data) {
        vm.PartPriceBreakDetailsData = res.data;
        if (vm.invoiceDetail.shipQty && (!vm.invoiceDetail.lineID || (vm.packingSlip.invoiceType && !vm.isCreditNote && !vm.invoiceDetail.unitPrice))) {
          const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.invoiceDetail.shipQty);
          if (priceBreak) {
            vm.invoiceDetail.unitPrice = priceBreak.unitPrice;
          } else {
            const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.invoiceDetail.shipQty), (o) => o.priceBreak);
            if (priceList.length > 0) {
              vm.invoiceDetail.unitPrice = priceList[priceList.length - 1].unitPrice;
            }
          }
          // vm.changePrice();
        }
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //vm.changePrice = () => {
    //  if (vm.invoiceDetail && (vm.invoiceDetail.qty || vm.invoiceDetail.qty === 0) && (vm.invoiceDetail.price || vm.invoiceDetail.price === 0)) {
    //    vm.invoiceDetail.extPrice = multipleUnitValue(vm.invoiceDetail.qty, vm.invoiceDetail.price);
    //  } else {
    //    vm.invoiceDetail.extPrice = null;
    //  }
    //};

    //change qty for other charges
    vm.changeOtherPartQty = () => {
      // auto select price from part master
      if (vm.invoiceDetail.shipQty && vm.PartPriceBreakDetailsData && !vm.recordUpdate) {
        const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.invoiceDetail.shipQty);
        if (priceBreak) {
          vm.invoiceDetail.unitPrice = priceBreak.unitPrice;
        } else {
          const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.invoiceDetail.shipQty), (o) => o.priceBreak);
          if (priceList.length > 0) {
            vm.invoiceDetail.unitPrice = priceList[priceList.length - 1].unitPrice;
          }
        }
        // vm.changePrice();
      }
    };

    //common field set
    const commonField = () => {
      vm.RadioGroup.type.array[0].isDisabled = false;
      vm.RadioGroup.type.array[1].isDisabled = false;
    };
    //check for edit option
    if (vm.custInvoiceID) {
      getCustomerInvoiceDetail();
    }

    //on change invoice date
    vm.onChangeInvoiceDate = () => {
      if (!vm.isCreditNote) {
        vm.packingSlip.packingSlipDate = vm.packingSlip.invoiceDate;
      }
      initdateoption();
      vm.checkDateValidation();
    };

    //on change packinslip date
    vm.onChangePackingSlipDate = () => {
      initdateoption();
      vm.checkDateValidation();
    };
    //on change PO date
    vm.onChangePODate = () => {
      initdateoption();
      vm.checkDateValidation();
    };
    //on change Credit Note date
    vm.onChangeCreditMemoDate = () => {
      initdateoption();
      vm.checkDateValidation();
    };
    //on change Debit Note date
    vm.onChangeDebitMemoDate = () => {
      initdateoption();
      vm.checkDateValidation();
    };
    // go
    // go to manufacturer
    vm.goToManufacturer = (id) => {
      BaseService.goToManufacturer(id);
    };
    //go to customer list page
    vm.goToCustomerType = () => {
      BaseService.goToCustomerList();
    };
    //go to shipping method
    vm.goShippingMethodList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE);
    };
    //go to terms list
    vm.goToTermsList = () => {
      BaseService.goToGenericCategoryTermsList();
    };
    //go to manage customer
    vm.goToManageCustomer = () => {
      BaseService.goToCustomer(vm.packingSlip.customerID);
    };
    //go to customer billing address list page
    vm.goToCustBillingAddressList = () => {
      BaseService.goToCustomerBillingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.packingSlip.customerID);
    };
    //go to customer shipping address list page
    vm.goToCustShippingAddressList = () => {
      BaseService.goToCustomerShippingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.packingSlip.customerID);
    };
    // Go to customer sales order manage page
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.packingSlip.refSalesOrderId);
    };
    //go to FOB List
    vm.goToFOBList = () => {
      BaseService.goToFOB();
    };
    //go to employee page list
    vm.goToEmployeeList = () => {
      BaseService.goToPersonnelList();
    };
    // go part details page
    vm.goToManagePartDetails = () => {
      BaseService.goToComponentDetailTab(null, vm.invoiceDetail.partId);
    };
    // go part list page
    vm.goToMFGPartList = () => {
      BaseService.goToPartList();
    };
    // go to generic category charge list
    vm.goToGenericCategoryChargeTypeList = () => {
      BaseService.goToGenericCategoryChargeTypeList();
    };
    //go to sales order
    vm.goToSalesorder = () => {
      BaseService.goToSalesOrderList();
      return;
    };
    // go to customer packing slip list
    vm.goToCustomerPackingSlipList = () => {
      BaseService.goToCustomerInvoicePackingSlipList();
    };
    //go to customer contact person list page
    vm.goToCustContactPersonList = () => {
      BaseService.goToCustomerContactPersonList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.packingSlip.customerID);
    };
    // Go to customer invoice list
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };

    // go to manufacturer list page
    vm.gotoManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    // go to manufacturer detail page
    vm.goToManufacturerDetail = () => {
      BaseService.goToManufacturer(vm.invoiceDetail.mfgcodeID);
    };
    // Go to sales price matrix tab on part master
    vm.goToComponentSalesPriceMatrixTab = (partId) => {
      BaseService.goToComponentSalesPriceMatrixTab(partId);
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
    //Go To Personal Page
    vm.goToManagePersonal = (employeeId) => {
      BaseService.goToManagePersonnel(employeeId);
    };
    vm.setFocusById = (id) => {
      setFocus(id);
    };
    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer contact person detail
     */
    // eslint-disable-next-line arrow-body-style
    const getCustomerContactPersonList = () => {
      return CustomerFactory.getCustomerContactPersons().query({
        refTransID: vm.packingSlip.customerID,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((contactperson) => {
        if (contactperson && contactperson.data) {
          vm.ContactPersonList = contactperson.data;
          if (!vm.ContactPersonList || vm.ContactPersonList.length === 0) {
            vm.ContactPersonOtherDet.showContPersonEmptyState = true;
          } else {
            vm.ContactPersonOtherDet.showContPersonEmptyState = false;
          }
          customerContactPersonDetail(vm.packingSlip.contactPersonId);
          return $q.resolve(vm.ContactPersonList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //contact person details
    const customerContactPersonDetail = (id) => {
      if (id) {
        vm.contactpersondetail = _.find(vm.ContactPersonList, (item) => item.personId === id);
        vm.contactPersonID = vm.contactpersondetail ? vm.contactpersondetail.personId : null;
        vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.contactPersonID;
      } else {
        const defaultContPerosn = _.find(vm.ContactPersonList, (contPerson) => contPerson.isDefault);
        vm.contactpersondetail = defaultContPerosn ? defaultContPerosn : vm.ContactPersonList[0];
        vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.contactpersondetail.personId;
      }
      if (vm.contactpersondetail) {
        vm.packingSlip.contactPersonId = vm.contactpersondetail.personId;
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
          vm.frmCustomerInvoice.$$controls[0].$setDirty();
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
        vm.frmCustomerInvoice.$$controls[0].$setDirty();
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
          vm.packingSlip.billingContactPersonID = callBackData.personId;
          vm.packingSlip.billingContactPerson = null;
        } else if (addressType === CORE.AddressType.IntermediateAddress) {
          vm.packingSlip.intermediateContactPersonID = callBackData.personId;
          vm.packingSlip.intermediateContactPerson = null;
        } else {
          vm.packingSlip.shippingContactPersonID = callBackData.personId;
          vm.packingSlip.shippingContactPerson = null;
        }
        const CustomerContactPersonPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(CustomerContactPersonPromise).then(() => {
          if (addressType === CORE.AddressType.BillingAddress) {
            vm.BillingAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackData);
            vm.packingSlip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
          } else if (addressType === CORE.AddressType.IntermediateAddress) {
            vm.IntermediateAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackData);
            vm.packingSlip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
          } else {
            vm.ShippingAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackData);
            vm.packingSlip.shippingContactPerson = null;
          }
          // Static code to enable save button
          vm.frmCustomerInvoice.$$controls[0].$setDirty();
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
          vm.packingSlip.billingContactPersonID = callBackData.personId;
          vm.billToOtherDet.alreadySelectedPersonId = callBackData.personId;
          if (!vm.packingSlip.billingContactPerson || vm.packingSlip.billingContactPersonID !== vm.CopyPackingslip.billingContactPersonID) {
            vm.packingSlip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
          }
        } else if (addressType === CORE.AddressType.ShippingAddress) {
          vm.ShippingAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.ShippingAddress.contactPerson;
          vm.packingSlip.shippingContactPersonID = callBackData.personId;
          vm.shipToOtherDet.alreadySelectedPersonId = callBackData.personId;
          if (!vm.packingSlip.shippingContactPerson || vm.packingSlip.shippingContactPersonID !== vm.CopyPackingslip.shippingContactPersonID) {
            vm.packingSlip.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.ShippingAddressContactPerson);
          }
        } else if (addressType === CORE.AddressType.IntermediateAddress) {
          vm.IntermediateAddressContactPerson = callBackData ? _.find(vm.ContactPersonList, (item) => item.personId === callBackData.personId) : vm.IntermediateAddress.contactPerson;
          vm.packingSlip.intermediateContactPersonID = callBackData.personId;
          vm.intermediateToOtherDet.alreadySelectedPersonId = callBackData.personId;
          if (!vm.packingSlip.intermediateContactPerson || vm.packingSlip.intermediateContactPersonID !== vm.CopyPackingslip.intermediateContactPersonID) {
            vm.packingSlip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
          }
        }
        // Static code to enable save button
        vm.frmCustomerInvoice.$$controls[0].$setDirty();
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
            vm.packingSlip.billingContactPerson = null;
            vm.packingSlip.billingContactPersonID = null;
            vm.packingSlip.billingContactPersonObj = null;
          } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.IntermediateAddressContactPerson = null;
            vm.packingSlip.intermediateContactPerson = null;
            vm.packingSlip.intermediateContactPersonID = null;
            vm.packingSlip.intermediateContactPersonObj = null;
          } else {
            vm.ShippingAddressContactPerson = null;
            vm.packingSlip.shippingContactPerson = null;
            vm.packingSlip.shippingContactPersonID = null;
            vm.packingSlip.shippingContactPersonObj = null;
          }
          vm.frmCustomerInvoice.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };



    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer address
     */
    // eslint-disable-next-line arrow-body-style
    const getCustomerAddress = (id, addressType) => CustomerFactory.customerAddressList().query({
      customerId: id || vm.packingSlip.customerID,
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
          billingAddressDetail(vm.packingSlip.billToId, vm.packingSlip.billingContactPersonID);
        }
        if (addressType === CORE.AddressType.ShippingAddress) {
          shippingAddressDetail(vm.packingSlip.shipToId, vm.packingSlip.shippingContactPersonID);
        }
        if (addressType === CORE.AddressType.IntermediateAddress) {
          IntermediateAddressDetail(vm.packingSlip.intermediateShipmentId, vm.packingSlip.intermediateContactPersonID);
        }
      }
      if (id && !addressType) {
        billingAddressDetail(vm.packingSlip.billToId, vm.packingSlip.billingContactPersonID);
        shippingAddressDetail(vm.packingSlip.shipToId, vm.packingSlip.shippingContactPersonID);
        IntermediateAddressDetail(vm.packingSlip.intermediateShipmentId, vm.packingSlip.intermediateContactPersonID);
      }
      return $q.resolve(vm.ContactAddress);
    }).catch((error) => BaseService.getErrorLog(error));

    // shipping address
    const shippingAddressDetail = (id, contactPersonId) => {
      if (id) {
        vm.shipToOtherDet.alreadySelectedAddressID = id;
        vm.ShippingAddress = _.find(vm.ShippingAddressList, (item) => item.id === id);
        if (vm.ShippingAddress && ((vm.packingSlip.id && (vm.CopyPackingslip.shippingContactPersonID || vm.CopyPackingslip.shipToId !== vm.packingSlip.shipToId)) || !vm.packingSlip.id)) {
          vm.ShippingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.ShippingAddress.contactPerson;
          vm.packingSlip.shippingContactPersonID = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
          vm.shipToOtherDet.alreadySelectedPersonId = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
        }
        if (!vm.ShippingAddress) {
          const shipplingaddress = _.find(vm.ShippingAddressList, (item) => item.isDefault === true);
          vm.ShippingAddress = shipplingaddress ? shipplingaddress : vm.ShippingAddressList[0];
        }
        vm.packingSlip.shippingAddressObj = vm.ShippingAddress;
        vm.packingSlip.shippingContactPersonObj = vm.ShippingAddressContactPerson;

        if (!vm.packingSlip.shippingAddress) {
          vm.packingSlip.shipToId = vm.ShippingAddress.id;
          vm.packingSlip.shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress);
        }
        if (!vm.packingSlip.shippingContactPerson || (vm.CopyPackingslip && vm.packingSlip.shippingContactPersonID !== vm.CopyPackingslip.shippingContactPersonID)) {
          vm.packingSlip.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.ShippingAddressContactPerson);
        }
        if ((vm.CopyPackingslip && vm.CopyPackingslip.shipToId !== vm.packingSlip.shipToId) && (vm.packingSlip.carrierID || vm.packingSlip.carrierAccountNumber || vm.packingSlip.shippingMethodID) && (vm.ShippingAddress.carrierAccountNumber || vm.ShippingAddress.carrierID || vm.ShippingAddress.shippingMethodID)) {
          commonShippingMethodConfirm(true);
        }
        if (checkErrorDetail(vm.packingSlip.shippingAddress, vm.LabelConstant.Address.ShippingAddress)) {
          vm.packingSlip.shippingAddress = null;
          vm.packingSlip.shipToId = null;
          vm.ShippingAddress = null;
          vm.packingSlip.shippingAddressObj = null;
        };
      } else {
        const shippingaddress = _.find(vm.ShippingAddressList, (item) => item.isDefault === true);
        vm.ShippingAddress = shippingaddress ? shippingaddress : vm.ShippingAddressList[0];
        if (vm.ShippingAddress) {
          vm.packingSlip.shipToId = vm.ShippingAddress.id;
          vm.ShippingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.ShippingAddress.contactPerson;
          vm.packingSlip.shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress);
          if (checkErrorDetail(vm.packingSlip.shippingAddress, vm.LabelConstant.Address.ShippingAddress)) {
            vm.packingSlip.shippingAddress = null;
            vm.packingSlip.shipToId = null;
            vm.ShippingAddress = null;
            vm.packingSlip.shippingAddressObj = null;
          };
          vm.shipToOtherDet.alreadySelectedAddressID = vm.ShippingAddress ? vm.ShippingAddress.id : null;
          vm.shipToOtherDet.alreadySelectedPersonId = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
        }
        vm.packingSlip.shippingAddressObj = vm.ShippingAddress;
        vm.packingSlip.shippingContactPersonObj = vm.ShippingAddressContactPerson;
        vm.packingSlip.shippingContactPersonID = vm.ShippingAddressContactPerson ? vm.ShippingAddressContactPerson.personId : null;
        if (!vm.packingSlip.shippingContactPerson) {
          vm.packingSlip.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.ShippingAddressContactPerson);
        }
      }
    };

    // billling Address
    const billingAddressDetail = (id, contactPersonId) => {
      if (id) {
        vm.billToOtherDet.alreadySelectedAddressID = id;
        vm.BillingAddress = _.find(vm.BillingAddressList, (item) => item.id === id);
        if (vm.BillingAddress && ((vm.packingSlip.id && (vm.CopyPackingslip.billingContactPersonID || vm.CopyPackingslip.billToId !== vm.packingSlip.billToId)) || !vm.packingSlip.id)) {
          if (contactPersonId) {
            vm.BillingAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId);
          } else if (vm.packingSlip.invoiceType && vm.packingSlipOrgData && vm.packingSlipOrgData.billToId !== vm.packingSlip.billToId) {
            vm.BillingAddressContactPerson = vm.BillingAddress.contactPerson;
          } else {
            vm.BillingAddressContactPerson = null;
          }
          // vm.BillingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : (!vm.packingSlip.invoiceType ? vm.BillingAddress.contactPerson : null);
          vm.packingSlip.billingContactPersonID = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
          vm.billToOtherDet.alreadySelectedPersonId = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
        }
        if (!vm.BillingAddress) {
          const billingaddress = _.find(vm.BillingAddressList, (item) => item.isDefault === true);
          vm.BillingAddress = billingaddress ? billingaddress : vm.BillingAddressList[0];
        }
        vm.packingSlip.billingAddressObj = vm.BillingAddress;
        vm.packingSlip.billingContactPersonObj = vm.BillingAddressContactPerson;

        if (!vm.packingSlip.billingAddress) {
          vm.packingSlip.billingAddress = BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress);
          vm.packingSlip.billToId = vm.BillingAddress.id;
        }
        if (!vm.packingSlip.billingContactPerson || (vm.CopyPackingslip && vm.packingSlip.billingContactPersonID !== vm.CopyPackingslip.billingContactPersonID)) {
          vm.packingSlip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
        }
        if (checkErrorDetail(vm.packingSlip.billingAddress, vm.LabelConstant.Address.BillingAddress)) {
          vm.packingSlip.billingAddress = null;
          vm.packingSlip.billToId = null;
          vm.BillingAddress = null;
          vm.packingSlip.billingAddressObj = null;
        };
      } else {
        const billingaddress = _.find(vm.BillingAddressList, (item) => item.isDefault === true);
        vm.BillingAddress = billingaddress ? billingaddress : vm.BillingAddressList[0];
        if (vm.BillingAddress) {
          vm.packingSlip.billToId = vm.BillingAddress.id;
          vm.BillingAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.BillingAddress.contactPerson;
          vm.packingSlip.billingAddress = BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress);
          if (checkErrorDetail(vm.packingSlip.billingAddress, vm.LabelConstant.Address.BillingAddress)) {
            vm.packingSlip.billingAddress = null;
            vm.packingSlip.billToId = null;
            vm.BillingAddress = null;
            vm.packingSlip.billingAddressObj = null;
          }
          vm.billToOtherDet.alreadySelectedAddressID = vm.BillingAddress.id;
          vm.billToOtherDet.alreadySelectedPersonId = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
        }
        vm.packingSlip.billingAddressObj = vm.BillingAddress;
        vm.packingSlip.billingContactPersonObj = vm.BillingAddressContactPerson;
        vm.packingSlip.billingContactPersonID = vm.BillingAddressContactPerson ? vm.BillingAddressContactPerson.personId : null;
        if (!vm.packingSlip.billingContactPerson) {
          vm.packingSlip.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.BillingAddressContactPerson);
        }
      }
    };

    //intermediate address
    const IntermediateAddressDetail = (id, contactPersonId) => {
      if (id) {
        vm.intermediateToOtherDet.alreadySelectedAddressID = id;
        vm.IntermediateAddress = _.find(vm.intermediateAddressList, (item) => item.id === id);
        if (vm.IntermediateAddress && ((vm.packingSlip.id && (vm.CopyPackingslip.intermediateContactPersonID || vm.CopyPackingslip.intermediateShipmentId !== vm.packingSlip.intermediateShipmentId)) || !vm.packingSlip.id)) {
          vm.IntermediateAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.IntermediateAddress.contactPerson;
          vm.packingSlip.intermediateContactPersonID = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
          vm.intermediateToOtherDet.alreadySelectedPersonId = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
        }
        // vm.IntermediateAddressContactPerson = contactPersonId ? _.find(vm.ContactPersonList, (item) => item.personId === contactPersonId) : vm.IntermediateAddress.contactPerson;
        if (!vm.IntermediateAddress) {
          vm.IntermediateAddress = null;
          vm.IntermediateAddressContactPerson = null;
          vm.packingSlip.intermediateContactPersonID = null;
          vm.intermediateToOtherDet.alreadySelectedPersonId = null;
        }
        vm.packingSlip.intermediateAddressObj = vm.IntermediateAddress;
        vm.packingSlip.intermediateContactPersonObj = vm.IntermediateAddressContactPerson;
        if (!vm.packingSlip.intermediateAddress) {
          vm.packingSlip.intermediateAddress = BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress);
        }
        if (!vm.packingSlip.intermediateContactPerson || (vm.CopyPackingslip && vm.packingSlip.intermediateContactPersonID !== vm.CopyPackingslip.intermediateContactPersonID)) {
          vm.packingSlip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
        }
        if (checkErrorDetail(vm.packingSlip.intermediateAddress, vm.LabelConstant.Address.MarkForAddress)) {
          vm.packingSlip.intermediateAddress = null;
          vm.packingSlip.intermediateShipmentId = null;
          vm.IntermediateAddress = null;
          vm.packingSlip.intermediateAddressObj = null;
        };
      } else if (!vm.custInvoiceID) {
        if (vm.ShippingAddress && vm.ShippingAddress.defaultIntermediateAddressID) {
          // mark for address
          const defaultMarkForAddrDet = _.find(vm.intermediateAddressList, (addrItem) => addrItem.id === vm.ShippingAddress.defaultIntermediateAddressID);
          vm.IntermediateAddress = defaultMarkForAddrDet;
          if (vm.IntermediateAddress) {
            vm.packingSlip.intermediateShipmentId = vm.IntermediateAddress.id;
            vm.IntermediateAddressContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === vm.ShippingAddress.defaultIntermediateContactPersonID);
            vm.packingSlip.intermediateAddress = BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress);
            if (checkErrorDetail(vm.packingSlip.intermediateAddress, vm.LabelConstant.Address.MarkForAddress)) {
              vm.IntermediateAddress = null;
              vm.packingSlip.intermediateAddress = null;
              vm.packingSlip.intermediateShipmentId = null;
              vm.packingSlip.intermediateAddressObj = null;
            }
          }
          vm.intermediateToOtherDet.alreadySelectedAddressID = vm.IntermediateAddress ? vm.IntermediateAddress.id : null;
          vm.intermediateToOtherDet.alreadySelectedPersonId = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
          vm.packingSlip.intermediateAddressObj = vm.IntermediateAddress;
          vm.packingSlip.intermediateContactPersonObj = vm.IntermediateAddressContactPerson;
          vm.packingSlip.intermediateContactPersonID = vm.IntermediateAddressContactPerson ? vm.IntermediateAddressContactPerson.personId : null;
          if (!vm.packingSlip.intermediateContactPerson) {
            vm.packingSlip.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.IntermediateAddressContactPerson);
          }
        }
      }
    };

    vm.selectInterAddressCallBack = (ev, callBackAddress) => {
      //callBackAddress.addressType = 'I';
      vm.selectAddressCallBack(ev, callBackAddress);
    };

    // open select Addresses popup
    vm.selectAddressCallBack = (ev, callBackAddress) => {
      if (callBackAddress) {
        if (callBackAddress.addressType === CORE.AddressType.BillingAddress) {
          vm.packingSlip.billToId = callBackAddress.id;
          vm.packingSlip.billingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (!_.find(vm.BillingAddressList, (item) => item.id === callBackAddress.id)) {
            vm.BillingAddressList.push(callBackAddress);
          }
          billingAddressDetail(callBackAddress.id, vm.packingSlip.billingContactPersonID);
        } else if (callBackAddress.addressType === CORE.AddressType.ShippingAddress) {
          if (!vm.packingSlip.id && vm.packingSlip.shipToId !== callBackAddress.id) {
            commonShippingMethodConfirm(true);
          }
          vm.packingSlip.shipToId = callBackAddress.id;
          vm.packingSlip.shippingContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (!_.find(vm.ShippingAddressList, (item) => item.id === callBackAddress.id)) {
            vm.ShippingAddressList.push(callBackAddress);
          }
          shippingAddressDetail(callBackAddress.id, vm.packingSlip.shippingContactPersonID);
          if (!vm.packingSlip.id) {
            IntermediateAddressDetail(null, null); // to set intermediate address based on shipping address
          }
          /*if (!vm.packingSlip.id && vm.packingSlip.shipToId === callBackAddress.id) {
            commonShippingMethodConfirm(false);
          }*/
        } else if (callBackAddress.addressType === CORE.AddressType.IntermediateAddress) {
          vm.packingSlip.intermediateShipmentId = callBackAddress.id;
          vm.packingSlip.intermediateContactPersonID = callBackAddress.contactPerson ? callBackAddress.contactPerson.personId : null;
          if (!_.find(vm.intermediateAddressList, (item) => item.id === callBackAddress.id)) {
            vm.intermediateAddressList.push(callBackAddress);
          }
          IntermediateAddressDetail(callBackAddress.id, vm.packingSlip.intermediateContactPersonID);
        }
        // Static code to enable save button
        vm.frmCustomerInvoice.$$controls[0].$setDirty();
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
          vm.packingSlip.billToId = callBackAddress.id;
          vm.packingSlip.billingAddress = null;
        } else if (callBackAddress.addressType === CORE.AddressType.IntermediateAddress) {
          vm.packingSlip.intermediateShipmentId = callBackAddress.id;
          vm.packingSlip.intermediateAddress = null;
        }
        else {
          vm.packingSlip.shipToId = callBackAddress.id;
          vm.packingSlip.shippingAddress = null;
        }
        const addressPromise = [getCustomerContactPersonList(), getCustomerAddress(vm.packingSlip.customerId)];
        vm.cgBusyLoading = $q.all(addressPromise).then(() => {
          if (callBackAddress) {
            // Static code to enable save button
            vm.frmCustomerInvoice.$$controls[0].$setDirty();
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
            vm.packingSlip.billToId = null;
            vm.packingSlip.billingAddressObj = null;
            vm.packingSlip.billingContactPersonID = null;
            vm.packingSlip.billingContactPersonObj = null;
            vm.billToOtherDet.alreadySelectedAddressID = null;
          } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.InternmediateAddress = null;
            vm.IntermediateAddressContactPerson = null;
            vm.packingSlip.intermediateShipmentId = null;
            vm.packingSlip.intermediateAddress = null;
            vm.packingSlip.intermediateAddressObj = null;
            vm.packingSlip.intermediateContactPerson = null;
            vm.packingSlip.intermediateContactPersonID = null;
            vm.packingSlip.intermediateContactPersonObj = null;
            vm.intermediateToOtherDet.alreadySelectedAddressID = null;
          } else {
            vm.ShippingAddress = null;
            vm.ShippingAddressContactPerson = null;
            vm.packingSlip.shipToId = null;
            vm.packingSlip.shippingAddress = null;
            vm.packingSlip.shippingAddressObj = null;
            vm.packingSlip.shippingContactPerson = null;
            vm.packingSlip.shippingContactPersonID = null;
            vm.packingSlip.shippingContactPersonObj = null;
            vm.shipToOtherDet.alreadySelectedAddressID = null;
          }
          vm.frmCustomerInvoice.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    //get max length validations
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // get price footer detail
    vm.getPriceFooterTotal = () => {
      const display = 'Total:';
      return display;
    };
    const isZeroValueColumn = {
      field: 'isZeroValueConverted',
      displayName: vm.LabelConstant.CustomerPackingSlip.ConfirmingZeroValueLine,
      width: 120,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  ng-class="{\'label-box label-warning\':!row.entity.isZeroValue,\
                        \'label-box label-success\':row.entity.isZeroValue }"> \
                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      enableSorting: true,
      enableFiltering: true,
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: CORE.MasterTemplateDropdown
      }
    };
    // vm.isUpdatable = true;
    const loadSourceHeader = () => {
      vm.sourceHeader = [
        {
          field: 'isadd',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '150',
          cellTemplate: '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="grid.appScope.$parent.vm.isDisable">' +
            '<md-icon role="img" md-font-icon="icon-pencil"></md-icon>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-class="{\'opecity-5\':row.entity.isDisabledUpdate === true}" ng-disabled="row.entity.isDisabledUpdate" ng-click="grid.appScope.$parent.vm.updateRecord(row)">' +
            '<md-icon role="img" md-font-icon="icon-pencil"></md-icon><md-tooltip md-direction="top">Update</md-tooltip>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-class="{\'opecity-5\':row.entity.isDisabledView === true}" ng-disabled="row.entity.isDisabledView" ng-click="grid.appScope.$parent.vm.viewRecordProfile(row)">' +
            '<md-icon role="img" md-font-icon="icon-eye"></md-icon><md-tooltip md-direction="top">View</md-tooltip>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="!grid.appScope.$parent.vm.isCreditNote"  ng-class="{\'opecity-3\': row.entity.quoteFrom == grid.appScope.$parent.vm.salesCommissionFrom.NA.id || row.entity.partType == grid.appScope.$parent.vm.partTypes.Other}" ng-click="grid.appScope.$parent.vm.goToSalesCommission(row.entity,$event)" ng-disabled="row.entity.quoteFrom == grid.appScope.$parent.vm.salesCommissionFrom.NA.id || row.entity.partType == grid.appScope.$parent.vm.partTypes.Other">' +
            '<md-icon role="img" md-font-icon="icons-sales-commission"></md-icon><md-tooltip md-direction="top">Sales Commission</md-tooltip>' +
            '</md-button>' +
            '<md-button  ng-class="{\'other-charges-icon-color\':row.entity.OtherDetList.length>0 , \'item-disabled\': row.entity.isDisableOtherCharges}"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn"' +
            'ng-disabled="row.entity.isDisableOtherCharges" ng-click="grid.appScope.$parent.vm.viewOtherCharges(row, $event)" ' +
            'ng-if="!vm.isCreditNote">' +
            '<md-icon role="img" md-font-icon="icons-other-charges"></md-icon><md-tooltip md-direction="top">View Other Charges</md-tooltip>' +
            '</md-button>' +
            '<md-button ng-class="{\'opecity-5\':(grid.appScope.$parent.vm.isCreditNote || row.entity.quoteFrom == grid.appScope.$parent.vm.salesCommissionFrom.NA.id || row.entity.partType == grid.appScope.$parent.vm.partTypes.Other)}"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="!grid.appScope.$parent.vm.isCreditNote" ng-disabled="(grid.appScope.$parent.vm.isCreditNote || row.entity.quoteFrom == grid.appScope.$parent.vm.salesCommissionFrom.NA.id || row.entity.partType == grid.appScope.$parent.vm.partTypes.Other)" ng-click="grid.appScope.$parent.vm.exportSalesCommission(row, $event)">' +
            '<md-icon role="img" md-font-icon="icon-export"></md-icon><md-tooltip md-direction="top">Export Sales Commission</md-tooltip>' +
            '</md-button>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          maxWidth: '140'
        },
        {
          field: 'lineID',
          width: 75,
          displayName: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'INV Line#' : 'CM Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          enableFiltering: false
        },
        {
          field: 'packingLineID',
          width: 65,
          displayName: 'PS Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          enableFiltering: false,
          visible: false
        },
        {
          field: 'packingSlipSerialNumber',
          width: 100,
          displayName: 'SO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          visible: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false
        },
        {
          field: 'custPOLineID',
          width: 140,
          displayName: 'Cust PO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          visible: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false
        },
        {
          field: 'releaseNumber',
          width: 100,
          displayName: 'Release Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          visible: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false
        },
        {
          field: 'mfgName',
          displayName: vm.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeID);$event.preventDefault();">{{row.entity.mfgName}}</a>\
                            <copy-text label="\'MFR\'" text="row.entity.mfgName" ng-if="row.entity.mfgName"></copy-text></div>',
          width: '300'
        },
        {
          field: 'mfgpn',
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partId" \
                            component-id="row.entity.partId" \
                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgpn" \
                            is-copy="true" \
                            is-custom-part="true"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
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
                            is-custom-part="true "\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            is-search-findchip="false"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        //{
        //  field: 'othercharge',
        //  width: '150',
        //  displayName: 'Other Charges',
        //  cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        //  footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getPriceFooterTotal()}}</div>'
        //},
        {
          field: 'assyDescription',
          width: '150',
          displayName: 'Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.assyDescription && row.entity.assyDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showAssyDescription(row, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer">Total: </div>'
        },
        {
          field: 'shipQty',
          width: 90,
          displayName: 'Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getQtySum("shipQty")}}</div>'
        },
        {
          field: 'unitPrice',
          width: '140',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | unitPrice}}</div>',
          displayName: 'Unit Price ($)'
          //footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("unitPrice")}}</div>'
        },
        {
          field: 'extendedPrice',
          width: '140',
          displayName: 'Ext. Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("extendedPrice")}}</div>'
        },
        {
          field: 'lineOtherCharges',
          width: '140',
          displayName: 'Total Other Charges Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("lineOtherCharges")}}</div>'
        },
        {
          field: 'totalExtPrice',
          width: '150',
          displayName: 'Total Ext. Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("totalExtPrice")}}</div>'
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
          width: '140',
          displayName: 'Line Shipping Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shippingNotes && row.entity.shippingNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showShippingComments(row, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'internalComment',
          width: '130',
          displayName: 'Line Internal Notes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap blue">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalComment && row.entity.internalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showInternalNotes(row, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'releaseNotes',
          width: '130',
          displayName: vm.LabelConstant.CustomerPackingSlip.ReleaseNotes,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releaseNotes && row.entity.releaseNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showReleaseNotes(row, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
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
        },
        {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BY
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
        }
      ];
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        vm.sourceHeader.splice(19, 0, isZeroValueColumn);
      }
    };
    loadSourceHeader();
    /** Column definition for material grid */


    /** Paging detail for material grid */
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [
          ['packingSlipSerialNumber', 'ASC']
        ],
        SearchColumns: [],
        prefCustPackingSlipID: vm.custInvoiceID
      };
    };
    initPageInfo();
    // const setGrid = () => {
    /** Grid options for material grid */
    vm.gridOptions = {
      showColumnFooter: true,
      enableRowHeaderSelection: (vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED || vm.packingSlip.isLocked || vm.isDisableForRegInv) ? false : true,
      enableFullRowSelection: false,
      enableRowSelection: (vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED || vm.packingSlip.isLocked || vm.isDisableForRegInv) ? false : true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableExpandableRowHeader: true,
      expandableRowTemplate: TRANSACTION.TRANSACTION_CUSTOMERINVOICE_OTHERCHARGES_EXPANDABLEJS,
      expandableRowHeight: 235,
      expandableRowScope: $scope,
      exporterCsvFilename: 'CustomerInvoiceDetail.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[36].PageName,
      hideMultiDeleteButton: false
    };

    vm.sourceData = [];
    /* retrieve invoice material list*/
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length > 0) {
        const column = [];
        const sortBy = [];
        _.each(vm.pagingInfo.SortColumns, (item) => {
          column.push(item[0]);
          sortBy.push(item[1]);
        });
        //if () {
        //  vm.gridOptions.enableRowSelection = false;
        //  vm.gridOptions.enableRowHeaderSelection = false;
        //} else {
        //  vm.gridOptions.enableRowSelection = true;
        //  vm.gridOptions.enableRowHeaderSelection = true;
        //}
        vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
        vm.sortData = _.clone(vm.sourceData);
      } else {
        vm.sourceData = vm.sortData;
      }
      vm.gridOptions.hideMultiDeleteButton = _.find(vm.sourceData, 'isDisabledDelete') ? true : false;
      if (vm.pagingInfo.SearchColumns.length > 0) {
        if (vm.search) {
          vm.emptyState = null;
          vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
        }
        if (!vm.search) {
          vm.sourceDataCopy = _.clone(vm.sourceData);
        }
        vm.search = true;
        _.each(vm.pagingInfo.SearchColumns, (item) => {
          vm.sourceData = $filter('filter')(vm.sourceData, {
            [item.ColumnName]: item.SearchString
          });
        });
        if (vm.sourceData.length === 0) {
          vm.emptyState = 0;
        }
      } else {
        vm.emptyState = null;
        if (vm.search) {
          vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
          vm.search = false;
        }
      }
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      detailOfCharges();
      $timeout(() => {
        // vm.gridOptions.clearSelectedRows();
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.sourceDataClone = angular.copy(vm.sourceData);
        vm.resetSourceGrid();
        if (vm.isCreditNote) {
          vm.gridOptions.enableRowSelection = true;
          vm.gridOptions.enableRowHeaderSelection = true;
        } else if (vm.isDisableForRegInv) {
          vm.gridOptions.enableRowSelection = false;
          vm.gridOptions.enableRowHeaderSelection = false;
        }
        if (vm.packingSlip.status === CORE.CUSTINVOICE_STATUS.PUBLISHED || vm.packingSlip.isLocked) {
          vm.gridOptions.enableRowSelection = false;
          vm.gridOptions.enableRowHeaderSelection = false;
        }
        vm.expandableJS();
        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    };
    // };

    //reset shipping detail
    vm.resetShippingDetail = () => {
      vm.autoCompletePackingSlipShipping.keyColumnId = null;
      vm.autocompleteAssy.keyColumnId = null;
    };
    vm.setScrollClass = 'gridScrollHeight_CustomerPackingSlipDetails';


    vm.getPSDetail = (ev, isEnter) => {
      if (isEnter) {
        if (ev.keyCode === 13) {
          if (vm.packingSlip.invoiceType && vm.copyPackingSlipNumber !== vm.packingSlip.packingSlipNumber) {
            vm.getPackingSlipDetailByPackingSlipNumber();
          }
          if (vm.packingSlip.packingSlipNumber && vm.packingSlip.invoiceType) {
            focusonField('trackingNumber');
          }
        }
      }
      if (!vm.packingSlip.invoiceType) {
        $scope.$parent.vm.packingSlipMainObj.packingSlipNumber = vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : null;
        $scope.$parent.vm.packingSlipMainObj.packingSlipTypeText = vm.packingSlip.packingSlipTypeText ? vm.packingSlip.packingSlipTypeText : null;
      }
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(ev);
    };
    //reset packing slip details
    vm.resetPackingSlip = () => {
      vm.isGetPSDetail = false;
      vm.recordUpdate = false;
      vm.copyPackingSlipNumber = null;
      vm.packingSlip = {
        status: CORE.CUSTINVOICE_STATUS.DRAFT,
        subStatus: (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT,
        invoiceType: true,
        customerInvTrackNumber: []
      };
      if (vm.autoCompleteShipping) {
        vm.autoCompleteShipping.keyColumnId = null;
      }
      if (vm.autoCompleteCarriers) {
        vm.autoCompleteCarriers.keyColumnId = null;
      }
      vm.contactpersondetail = null;
      vm.packingSlipOrgData = null;
      resetAddressOBject(false);
      $scope.$parent.vm.packingSlipMainObj.packingSlipNumber = null;
      $scope.$parent.vm.packingSlipMainObj.packingSlipTypeText = null;
      $scope.$parent.vm.packingSlipMainObj.customerId = null;
      $scope.$parent.vm.packingSlipMainObj.customerName = null;
      $scope.$parent.vm.packingSlipMainObj.poNumber = null;
      vm.sourceData = [];
      if (vm.frmCustomerInvoice) {
        vm.frmCustomerInvoice.$setPristine();
        vm.frmCustomerInvoice.$setUntouched();
      }
      focusonField('customerpackingSlipNumber');
    };

    // get customer list
    const getCustomerSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((customers) => {
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(() => {
          if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
            $scope.$broadcast(vm.autoCompleteCustomer.inputName, customers.data[0]);
          }
        });
      }
      return customers.data;
    }).catch((error) => BaseService.getErrorLog(error));

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

    //Get Shipping Method List
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(vm.categoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
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

    // get sales Commission to employee list
    const getSalesCommissionEmployeeListbyCustomer = () => EmployeeFactory.getEmployeeListByCustomer().query({ customerID: vm.packingSlip.customerID, salesCommissionToID: vm.packingSlip.salesCommissionTo }).$promise.then((employees) => {
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

    // Get Term list
    const getTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(vm.categoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.packingSlip && vm.packingSlip.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get customer assembly and all component/other part details
    const getcomponentAssemblyList = (searchObj) => {
      searchObj.customerID = (vm.iscompany ? null : vm.packingSlip.customerID);
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

    // select component in detail section
    const setcomponentAssemblyList = (item) => {
      if (item) {
        if (item.rfqOnly) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            // item = null;
            vm.resetInvoiceDetail();
            if (vm.autocompleteMfgPN.keyColumnId) {
              $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
            }
            setFocusByName(vm.autocompleteAssy.inputName);
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
                selectAssyCallBackAfterConfirmation(item);
                setFocus('description');
              }
            }, () => {
              vm.resetInvoiceDetail();
              if (vm.autocompleteMfgPN.keyColumnId) {
                $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
              }
              setFocusByName(vm.autocompleteAssy.inputName);
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            selectAssyCallBackAfterConfirmation(item);
          }
          // focusonField('slipLine');
        }
      } else {
        // vm.invoiceDetail = {};
        vm.resetInvoiceDetail();
        if (vm.autocompleteMfgPN.keyColumnId) {
          $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
        }
        setFocusByName(vm.autocompleteAssy.inputName);
        // vm.pendingShipQtyList = [];
      }
    };
    //set assebly after confirmation for invalid part status
    const selectAssyCallBackAfterConfirmation = (item) => {
      vm.invoiceDetail.rohsIcon = item.rohsIcon;
      vm.invoiceDetail.rohsName = item.rohsName;
      vm.invoiceDetail.assyID = item.PIDCode;
      vm.invoiceDetail.assyNumber = item.mfgPN;
      vm.invoiceDetail.mfgName = item.mfgName;
      if (!vm.invoiceDetail.id) {
        getShippingCommentList(item.id);
        getPartInternalCommentList(item.id);
      }
      vm.invoiceDetail.uom = item.unitName;
      vm.invoiceDetail.nickName = item.nickName;
      vm.invoiceDetail.partId = item.id;
      vm.invoiceDetail.partType = item.partType;
      vm.invoiceDetail.isCustom = item.iscustom;
      vm.invoiceDetail.isCPN = item.isCPN;
      vm.invoiceDetail.componentStandardList = item.componentStandardList;
      vm.invoiceDetail.isComponent = item.partType === vm.partCategoryConst.Component;
      vm.invoiceDetail.isMISCAssemblyType = item.partType === vm.partCategoryConst.SubAssembly;
      if (!vm.invoiceDetail.id && !vm.isCreditNote) {
        // for  misc invoice on add line set NA as default for "Quote From" as discussed with VS on 12/04/2021
        if ((vm.invoiceDetail.isCPN || vm.invoiceDetail.isMISCAssemblyType || vm.invoiceDetail.isCustom) && vm.invoiceType) {
          vm.invoiceDetail.quoteFrom = 2;
          getQtyTurnTimeByAssyId(vm.invoiceDetail.partId);
        } else {
          vm.invoiceDetail.quoteFrom = 3;
        }
      }
      if
        (vm.OldDetailId !== vm.invoiceDetail.id) {
        if (!vm.isCreditNote && ((vm.invoiceDetail && vm.invoiceDetail.salesCommissionList && vm.invoiceDetail.salesCommissionList.length > 0) && ((vm.invoiceDetail.isCommissionDataEdited && item && vm.autocompleteAssy && vm.invoiceDetail.partID !== item.id) ||
          (vm.invoiceDetail.id > 0 && (!item || (vm.invoiceDetail.salesCommissionList.length > 0 &&
            vm.autocompleteAssy && vm.invoiceDetail.partId !== vm.invoiceDetailCopy.partId)))))) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.assyId);
        }
        if (!(vm.recordUpdate || vm.recordView)) {
          vm.invoiceDetail.assyDescription = item.description;
          if (!vm.isCreditNote) {
            vm.invoiceDetail.unitPrice = null;
            vm.getPartPriceBreakDetails(item.id).then(() => {
              vm.changeOtherPartQty();
            });
          }
        }
        const searchObj = {
          partID: item.id,
          searchText: null
        };
        return getcomponentMfgPNList(searchObj);
      }
    };

    //get component shipping comments detail details
    const getShippingCommentList = (id) => {
      if (id) {
        vm.cgBusyLoading = ComponentFactory.getPartMasterCommentsByPartId().query({
          partId: id,
          category: 'S'
        }).$promise.then((purchaseInspection) => {
          if (purchaseInspection) {
            vm.invoiceDetail.shippingNotes = _.map(_.map(_.filter(purchaseInspection.data || [], (data) => data.inspectionmst && data.inspectionmst.requiementType === 'C' ? data.inspectionmst : null), (item) => item.inspectionmst), 'requirement').join('\r');
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
          if (purchaseInspection) {
            vm.invoiceDetail.internalComment = _.map(purchaseInspection.data, 'comment').join('\r');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    if (vm.isCreditNote) {
      initAutoComplete();
    }
    //get packingslip detail from packing slip number
    vm.getPackingSlipDetailByPackingSlipNumber = () => {
      let sumOtherCharges = 0;
      if (vm.packingSlip && vm.packingSlip.packingSlipNumber) {
        vm.cgBusyLoading = CustomerPackingSlipFactory.getCustomerPackingSlipDetailByPackingSlipNumber().query({
          packingSlipNumber: vm.packingSlip.packingSlipNumber
        }).$promise.then((response) => {
          if (response && response.data) {
            if (response.data.IsSuccess) {
              vm.copyPackingSlipNumber = angular.copy(vm.packingSlip.packingSlipNumber);
              const objPackingSlip = _.first(response.data.PackingSlipDetail);
              vm.packingSlip = objPackingSlip;
              vm.packingSlipOrgData = angular.copy(objPackingSlip);
              vm.packingSlip.status = CORE.CUSTINVOICE_STATUS.DRAFT;
              vm.packingSlip.subStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT;
              vm.packingSlip.packingSlipDate = objPackingSlip.packingSlipDate ? BaseService.getUIFormatedDate(objPackingSlip.packingSlipDate, vm.DefaultDateFormat) : '';
              vm.packingSlip.poDate = objPackingSlip.poDate ? BaseService.getUIFormatedDate(objPackingSlip.poDate, vm.DefaultDateFormat) : '';
              vm.packingSlip.refPackingSlipId = vm.packingSlip.packingSlipID;
              vm.packingSlip.invoiceNumber = vm.packingSlip.packingSlipNumber.toString().replace(CORE.PrefixForGeneratePackingSlip.CustomerPackingSlip, CORE.PrefixForGeneratePackingSlip.invoiceNumberSlip);
              vm.packingSlip.invoiceDate = objPackingSlip.packingSlipDate ? BaseService.getUIFormatedDate(objPackingSlip.packingSlipDate, vm.DefaultDateFormat) : '';
              vm.packingSlip.customerID = objPackingSlip.customerID;
              vm.packingSlip.customerNamewithCode = objPackingSlip.customerName;
              vm.packingSlip.customerInvTrackNumber = vm.packingSlip.customerInvTrackNumber ? vm.packingSlip.customerInvTrackNumber : response.data.trackingDetail;
              vm.packingSlip.invoiceType = true;
              vm.isDisableForRegInv = true;

              disableShipAddrActionButton(vm.isDisableInvEntry || vm.isDisableForRegInv);

              vm.shipToOtherDet.customerId = vm.packingSlip.customerID;
              vm.shipToOtherDet.refTransID = vm.packingSlip.customerID;
              vm.billToOtherDet.customerId = vm.packingSlip.customerID;
              vm.billToOtherDet.refTransID = vm.packingSlip.customerID;
              vm.intermediateToOtherDet.customerId = vm.packingSlip.customerID;
              vm.intermediateToOtherDet.refTransID = vm.packingSlip.customerID;
              vm.ContactPersonOtherDet.customerId = vm.packingSlip.customerID;
              vm.ContactPersonOtherDet.refTransID = vm.packingSlip.customerID;
              vm.ContactPersonOtherDet.alreadySelectedPersonId = vm.packingSlip.contactPersonId;
              const soDetList = [];
              _.map(response.data.PackingSlipDet, (data) => {
                sumOtherCharges = 0;
                data.isDisabledUpdate = true;
                data.isDisabledDelete = true;
                data.systemGenerated = true;
                data.OtherDetList = [];
                data.removeOtherChargesIds = [];
                response.data.OtherDet = _.uniqBy(response.data.OtherDet, (otherDet) => [otherDet.refSalesorderDetid, otherDet.partID].join());
                if (response.data.OtherDet && response.data.OtherDet.length > 0 && !_.find(soDetList, (soDet) => soDet === data.refSalesorderDetid)) {
                  _.map(response.data.OtherDet, (otherData) => {
                    if (data.refSalesorderDetid === otherData.refSalesorderDetid) {
                      const objEvery = _.find(response.data.lineOtherChrg, (freqChrg) => freqChrg.partId === data.partId && freqChrg.shippingId === data.shippingId);
                      if (!(otherData.frequency === CORE.OtherPartFrequency[0].id && otherData.frequencyType === CORE.OtherPartFrequencyType[0].id && objEvery)) {
                        data.OtherDetList.push(otherData);
                        sumOtherCharges = sumOtherCharges + (otherData.price * otherData.qty);
                        soDetList.push(otherData.refSalesorderDetid);
                      }
                    }
                  });
                  data.lineOtherCharges = sumOtherCharges;
                  data.totalExtPrice = data.extPrice + data.lineOtherCharges;
                }
                if (!vm.custInvoiceID) {
                  data.isDisableOtherCharges = true;
                  data.isDisabledView = true;
                }
              });
              $scope.$parent.vm.packingSlipMainObj.packingSlipNumber = vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : null;
              $scope.$parent.vm.packingSlipMainObj.packingSlipID = vm.packingSlip.packingSlipID ? vm.packingSlip.packingSlipID : null;
              $scope.$parent.vm.packingSlipMainObj.packingSlipTypeText = vm.packingSlip.packingSlipTypeText ? vm.packingSlip.packingSlipTypeText : null;
              $scope.$parent.vm.packingSlipMainObj.customerId = vm.packingSlip.customerID ? vm.packingSlip.customerID : null;
              $scope.$parent.vm.packingSlipMainObj.customerName = vm.packingSlip.customerName ? vm.packingSlip.customerName : null;
              $scope.$parent.vm.packingSlipMainObj.poNumber = vm.packingSlip.poNumber ? vm.packingSlip.poNumber : null;
              $scope.$parent.vm.packingSlipMainObj.refSalesOrderId = vm.packingSlip.refSalesOrderId ? vm.packingSlip.refSalesOrderId : null;
              vm.sourceData = angular.copy(response.data.PackingSlipDet);
              vm.packingSlipDetail = angular.copy(response.data.PackingSlipDet);
              vm.isGetPSDetail = true;
              initdateoption();
              const autocompleteCustomerPromise = [getCustomerContactPersonList()];
              vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
                initAutoComplete();
                getCustomerAddress(vm.packingSlip.customerID);
                vm.loadData();
                //setGrid();
              }).catch((error) => BaseService.getErrorLog(error));
              focusonField('headerComment');
            } else if (!response.data.IsSuccess) {
              alertScanPackingSlip(response.data.Error);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //let alert detail for scan rack
    const alertScanPackingSlip = (errorText) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INCOMIG_VALIDATION);
      messageContent.message = errorText;
      const model = {
        messageContent: messageContent,
        multiple: false
      };
      return DialogFactory.messageAlertDialog(model).then((yes) => {
        if (yes) {
          vm.packingSlip.packingSlipNumber = null;
          vm.resetPackingSlip();
          focusonField('customerpackingSlipNumber');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //detail of charges
    const detailOfCharges = () => {
      // vm.packingSlip.totalOtherChargies = parseFloat(_.sumBy(_.filter(vm.sourceData, (source) => source.partType === CORE.PartType.Other), (data) => ((data.unitPrice ? parseFloat(data.unitPrice) : 0) * (data.shipQty ? parseInt(data.shipQty) : 0)))).toFixed(_amountFilterDecimal);
      //vm.packingSlip.totalExtendedPrice = parseFloat(parseFloat(_.sumBy(_.filter(vm.sourceData, (source) => source.partType !== CORE.PartType.Other), (data) => ((data.unitPrice ? parseFloat(data.unitPrice) : 0) * (data.shipQty ? parseInt(data.shipQty) : 0)))).toFixed(_amountFilterDecimal));
      vm.packingSlip.totalExtendedPrice = parseFloat(parseFloat(_.sumBy(vm.sourceData, (data) => ((data.unitPrice ? parseFloat(data.unitPrice) : 0) * (data.shipQty ? parseInt(data.shipQty) : 0)))).toFixed(_amountFilterDecimal));
      vm.packingSlip.totalOtherPrice = parseFloat(_.sumBy(vm.sourceData, (data) => ((data.lineOtherCharges ? parseFloat(data.lineOtherCharges) : 0)))).toFixed(_amountFilterDecimal);
      if (vm.isCreditNote) {
        vm.packingSlip.totalExtendedPrice = vm.packingSlip.totalExtendedPrice * (-1);
        // vm.packingSlip.totalOtherChargies = vm.packingSlip.totalOtherChargies * (-1);
        vm.packingSlip.totalOtherPrice = vm.packingSlip.totalOtherPrice * (-1);
      }
      //vm.packingSlip.totalOtherChargiesDisply = vm.packingSlip.totalOtherChargies ? $filter('amount')(vm.packingSlip.totalOtherChargies) : 0;
      vm.packingSlip.sumExtendedPriceDisplay = vm.packingSlip.totalExtendedPrice ? $filter('amount')(vm.packingSlip.totalExtendedPrice) : 0;
      vm.packingSlip.sumOtherPriceDisplay = vm.packingSlip.totalOtherPrice ? $filter('amount')(vm.packingSlip.totalOtherPrice) : 0;
      vm.packingSlip.totalExtendedPrice = (vm.packingSlip.totalExtendedPrice || vm.packingSlip.totalOtherPrice) ? (parseFloat(vm.packingSlip.totalExtendedPrice) + parseFloat(vm.packingSlip.totalOtherPrice)) : 0;
      vm.packingSlip.totalExtendedPriceDisplay = $filter('amount')(vm.packingSlip.totalExtendedPrice);
      vm.packingSlip.receivedAmountDisplay = $filter('amount')(vm.packingSlip.receivedAmount);
      if (vm.isCreditNote) {
        vm.packingSlip.balanceAmount = parseFloat(parseFloat(parseFloat(vm.packingSlip.totalExtendedPrice) + parseFloat(vm.packingSlip.receivedAmount || 0)).toFixed(_amountFilterDecimal));
        vm.totalRefundAmt = vm.packingSlip.balanceAmount * (-1);
      } else {
        vm.packingSlip.balanceAmount = parseFloat(parseFloat(parseFloat(vm.packingSlip.totalExtendedPrice) - parseFloat(vm.packingSlip.receivedAmount || 0)).toFixed(_amountFilterDecimal));
      }
      vm.packingSlip.balanceAmountDisplay = $filter('amount')(vm.packingSlip.balanceAmount);
      vm.packingSlip.remainingCMAmtInclAmtToBeRefunded = parseFloat(((vm.packingSlip.totalExtendedPrice || 0) + (vm.packingSlip.sumOfAppliedCMRefundedAmt || 0)).toFixed(2));
    };

    //save customer packing slip detail
    vm.saveCustomerInvoice = (newStatus) => {
      const oldStatus = vm.packingSlip.subStatus;
      // console.log('grid data cnt : ' + vm.sourceData.length);
      if (BaseService.focusRequiredField(vm.frmCustomerInvoice)) {
        if (!vm.custInvoiceID) {
          vm.packingSlip.status = CORE.CUSTINVOICE_STATUS.DRAFT;
          vm.packingSlip.subStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT;
        }
        return;
      } else {
        if (vm.custInvoiceID && (newStatus || newStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT) && newStatus !== oldStatus) {
          if ((!vm.isCreditNote) && (
            (oldStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED && (newStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED || newStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT)) ||
            (oldStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED && (newStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED || newStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT || newStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED)) ||
            (oldStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED)
          )) {
            // After invoice changed to Shiped-NotInvoiced/Invoiced/Corrected&Invoiced then no reverse status  allowed
            // But After invoice is in published then  can change to draft
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CORRECTEDINVOICED_STATUS_CANNOT_CHANGED);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            if (vm.frmCustomerInvoice) {
              vm.frmCustomerInvoice.$setPristine();
            }
            return;
          } else if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE && (vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED) && vm.packingSlip.paymentStatus !== 'PE') {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAYMENT_RECEIVED_AGAINST_INVOICE);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            if (vm.isFormDirtyManual) {
              vm.frmCustomerInvoice.$setPristine();
              vm.isFormDirtyManual = false;
            }
            return;
          } else if (vm.isCreditNote && vm.packingSlip.subStatus === CORE.CUSTCRNOTE_SUBSTATUS.PUBLISHED && vm.packingSlip.paymentStatus !== CORE.InvoicePaymentStatus.Pending) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_ALLOWED_TO_CHANGE_CUST_CREDIT_MEMO_AS_PAID);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            if (vm.isFormDirtyManual) {
              vm.frmCustomerInvoice.$setPristine();
              vm.isFormDirtyManual = false;
            }
            return;
          } else if (vm.isCreditNote && newStatus === CORE.CUSTCRNOTE_SUBSTATUS.PUBLISHED && !vm.packingSlip.totalExtendedPrice) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TOT_AMT_NOT_ALLOWED_ZERO_FOR_CUST_CREDIT_MEMO);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            if (vm.isFormDirtyManual) {
              vm.frmCustomerInvoice.$setPristine();
              vm.isFormDirtyManual = false;
            }
            return;
          } else if (newStatus !== oldStatus && vm.sourceData.length === 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PUBLISH_WITHOUT_DETAILS);
            if (vm.isCreditNote) {
              messageContent.message = stringFormat(messageContent.message, 'Credit Memo', 'Publish');
            } else {
              if (newStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED) {
                messageContent.message = stringFormat(messageContent.message, 'Customer Invoice', 'change to \'Corrected & Invoiced\'');
              } else if (newStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED) {
                messageContent.message = stringFormat(messageContent.message, 'Customer Invoice', 'change to \'Invoiced\'');
              } else if (newStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED) {
                messageContent.message = stringFormat(messageContent.message, 'Customer Invoice', 'change to \'Published\'');
              } else if (newStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED) {
                messageContent.message = stringFormat(messageContent.message, 'Customer Invoice', 'change to \'Shipped - Not Invoiced\'');
              }
            }
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            if (vm.isFormDirtyManual) {
              vm.frmCustomerInvoice.$setPristine();
              vm.isFormDirtyManual = false;
            }
            return;
          } else if (!vm.packingSlip.shipToId || !vm.packingSlip.billToId
            || (!vm.packingSlip.billingContactPersonID && newStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT)
            || (!vm.packingSlip.shippingContactPersonID && newStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
            if (!vm.packingSlip.shipToId) {
              messageContent.message = stringFormat(messageContent.message, 'ShipTo Address');
            } else if (!vm.packingSlip.billToId) {
              messageContent.message = stringFormat(messageContent.message, 'BillTo Address');
            } else if (!vm.packingSlip.billingContactPersonID && newStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
              messageContent.message = stringFormat(messageContent.message, 'BillTo Contact Person');
            } else if (!vm.packingSlip.shippingContactPersonID && newStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
              messageContent.message = stringFormat(messageContent.message, 'ShipTo Contact Person');
            }
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj).then(() => setFocus('saveBtn'));
            return;
          } else if ((newStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED || newStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED || newStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED)
            && (vm.packingSlip.packingSlipType === vm.invPackingSlipType.MISC_PS || vm.packingSlip.packingSlipType === vm.invPackingSlipType.SO_PS)
            && vm.packingSlip.packingSlipSubStatus !== CORE.CustomerPackingSlipSubStatusID.Shipped) {
            const statusList = vm.isCreditNote ? CORE.Customer_CrMemo_SubStatus : CORE.Customer_Invoice_SubStatus;
            const newStatusName = _.filter(statusList, (item) => item.ID === newStatus).map((item) => item.Name);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PACKINGSLIP_STATUS_NOT_SHIPPED);
            messageContent.message = stringFormat(messageContent.message, newStatusName);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            if (vm.isFormDirtyManual) {
              vm.frmCustomerInvoice.$setPristine();
              vm.isFormDirtyManual = false;
            }
            return;
          } else {
            // Check  for country validation for MISC invoice and only for  status  other than ShipedNotInvoiced(New : Draft)
            if (!vm.packingSlip.invoiceType && !vm.isCreditNote && newStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
              const promise = [checkInvoiceCountryValidation(null, true)];
              vm.cgBusyLoading = $q.all(promise).then((res) => {
                // if validated continue else show pop up
                if (res && res[0]) {
                  confirmAndSaveInvoiceStatus(oldStatus, newStatus);
                } else {
                  if (vm.frmCustomerInvoice) {
                    vm.frmCustomerInvoice.$setPristine();
                  }
                  return;
                }
              });
            } else {
              confirmAndSaveInvoiceStatus(oldStatus, newStatus);
            }
          }
        } else {
          if ((vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED) && vm.packingSlip.paymentStatus !== 'PE' && !vm.isCreditNote) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAYMENT_RECEIVED_AGAINST_INVOICE);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            return;
          }
          if (!vm.packingSlip.shipToId || !vm.packingSlip.billToId
            || (!vm.packingSlip.billingContactPersonID && vm.packingSlip.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT)
            || (!vm.packingSlip.shippingContactPersonID && vm.packingSlip.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
            if (!vm.packingSlip.shipToId) {
              messageContent.message = stringFormat(messageContent.message, 'ShipTo Address');
            } else if (!vm.packingSlip.billToId) {
              messageContent.message = stringFormat(messageContent.message, 'BillTo Address');
            } else if (!vm.packingSlip.billingContactPersonID && vm.packingSlip.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
              messageContent.message = stringFormat(messageContent.message, 'BillTo Contact Person');
            } else if (!vm.packingSlip.shippingContactPersonID && vm.packingSlip.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
              messageContent.message = stringFormat(messageContent.message, 'ShipTo Contact Person');
            }
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj).then(() => setFocus('saveBtn'));
            return;
          }
          if (!vm.packingSlip.invoiceType && !vm.isCreditNote && vm.custInvoiceID && vm.sourceData && vm.sourceData.length > 0) {
            const promise = [checkInvoiceCountryValidation(null, true)];
            vm.cgBusyLoading = $q.all(promise).then((res) => {
              // if validated continue else show pop up
              if (res && res[0]) {
                saveCutomerInvoiceHeaderDetails();
              } else {
                //if (vm.frmCustomerInvoice) {
                //  vm.frmCustomerInvoice.$setPristine();
                //}
                return;
              }
            });
          } else if (!vm.packingSlip.invoiceType && !vm.isCreditNote && !vm.custInvoiceID && vm.packingSlip.poNumber) {
            const obj = {
              poNumber: vm.packingSlip.poNumber,
              soNumber: null,
              customerID: vm.packingSlip.customerID
            };
            vm.cgBusyLoading = CustomerPackingSlipFactory.checkMiscPackingSlipForSOPONumber().query(obj).$promise.then((resCheck) => {
              // here failed means matchin PO/SO entry exists in sales order
              if (resCheck && resCheck.status === CORE.ApiResponseTypeStatus.FAILED && resCheck.errors.data) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MISC_PACKINGSLIP_SO_ALREADY_EXISTS_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, vm.packingSlip.poNumber ? vm.packingSlip.poNumber : '', 'Customer Invoice');
                const model = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(model).then(() => {
                  // Continue save
                  saveCutomerInvoiceHeaderDetails();
                }, () => {
                  vm.packingSlip.poNumber = null;
                  vm.packingSlip.soNumber = null;
                  vm.packingSlip.soRevision = null;
                  setFocus('poNumber');
                });
              } else {
                // Continue save
                saveCutomerInvoiceHeaderDetails();
              }
            }).catch((err) => BaseService.getErrorLog(err));
          } else {
            saveCutomerInvoiceHeaderDetails();
          }
        }
      }
    };
    // confirm and save invoice status
    const confirmAndSaveInvoiceStatus = (oldStatus, newStatus) => {
      const statusList = vm.isCreditNote ? CORE.Customer_CrMemo_SubStatus : CORE.Customer_Invoice_SubStatus;
      const oldStatusName = _.filter(statusList, (item) => item.ID === oldStatus).map((item) => item.Name);
      const newStatusName = _.filter(statusList, (item) => item.ID === newStatus).map((item) => item.Name);
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_STATUS_CHANGE);
      messageContent.message = stringFormat(messageContent.message, oldStatusName, newStatusName, vm.isCreditNote ? 'Credit Memo' : 'Invoice');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isStatusChange = true;
          vm.packingSlip.status = newStatus;
          vm.packingSlip.subStatus = newStatus;
          confirmRevisionAndSave(false, null);
        }
      }, () => {
        vm.isStatusChange = false;
        vm.packingSlip.status = oldStatus;
        vm.packingSlip.subStatus = oldStatus;
        if (vm.isFormDirtyManual) {
          vm.frmCustomerInvoice.$setPristine();
          vm.isFormDirtyManual = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // save header detail after country validation
    const saveCutomerInvoiceHeaderDetails = () => {
      // if  tracking# entered but not added show confirmation message
      if (vm.trackingNumberDet.trackNumber) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TRACKING_NUM_ENTERED_NOT_ADDED);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            confirmRevisionAndSave(false, null);
          }
        }, () => {
          setFocus('trackingNumber');
          // return;
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (vm.isCreditNote && vm.packingSlip.refDebitMemoNumber) {
        const promise = [vm.checkUniqueRefDebitMemoNumber()];
        vm.cgBusyLoading = $q.all(promise).then((res) => {
          if (res && res[0]) {
            confirmRevisionAndSave(false, null);
          } else {
            vm.packingSlip.refDebitMemoNumber = '';
            setFocusByName('refDebitMemoNumber');
          }
          //else {
          //  saveMasterShipDetail();
          //}
        });
      } else {
        confirmRevisionAndSave(false, null);
      }
    };

    const confirmRevisionAndSave = (isFromDetail, objPackingDet) => {
      // here for  Invoice & CM Draft status id is different
      const checkForStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT;
      // refer following document for version confirmation
      // hs://docs.google.com/spreadsheets/d/1reHJK7FsGR7oWUbVDQaLg-nDx8hLMLL8lfFRTCwt7HY/edit#gid=526413267
      let onlyTrackingNumberChanged = false;
      let continueWithConfirmation = false;
      const trackControl = _.find(vm.frmCustomerInvoice.$$controls, (ctrl) => ctrl.$name === 'trackingNumber');
      if (trackControl) {
        trackControl.$dirty = false;
      }
      if (!vm.isCreditNote) {
        onlyTrackingNumberChanged = !(BaseService.checkFormDirtyExceptParticularControl(vm.frmCustomerInvoice, 'trackNumberChanged'));
      }
      const newRevision = (parseInt(vm.packingSlip.revision || 0) + 1) < 10 ? stringFormat('0{0}', (parseInt(vm.packingSlip.revision || 0) + 1)) : (parseInt(vm.packingSlip.revision || 0) + 1).toString();
      // form dirty and save changes only no status change && status  is other than draft
      if (((vm.frmCustomerInvoice.$dirty && !vm.isStatusChange) || isFromDetail) && vm.packingSlip.subStatus !== checkForStatus) {
        if (isFromDetail) {
          continueWithConfirmation = true;
        } else if (onlyTrackingNumberChanged) {
          continueWithConfirmation = false;
        } else {
          continueWithConfirmation = true;
        }
      } else if (vm.isStatusChange && (isFromDetail || (!vm.isFormDirtyManual && vm.frmCustomerInvoice.$dirty))) {
        // status change with form data changes
        if (!onlyTrackingNumberChanged) {
          continueWithConfirmation = true;
        } else {
          continueWithConfirmation = false;
        }
      } else if (vm.isStatusChange && vm.packingSlip.subStatus !== checkForStatus && vm.packingSlip.isAlreadyPublished && vm.packingSlip.isAskForVersionConfirmation) {
        // if status is changed from draft (second time) and changes done in draft mode.
        continueWithConfirmation = true;
      } else {
        continueWithConfirmation = false;
      }
      if (vm.custInvoiceID && continueWithConfirmation) {
        //  (vm.frmCustomerInvoice.$dirty || vm.isInvoiceDetailChanged) && vm.packingSlip.subStatus !== checkForStatus && vm.packingSlip.isAlreadyPublished
        const pageName = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? 'Customer Invoice' : 'Customer Credit Memo';
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, pageName, vm.packingSlip.revision, newRevision);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.packingSlip.revision = parseInt(vm.packingSlip.revision || 0) + 1;
            if (isFromDetail) {
              if (objPackingDet) { objPackingDet.revision = vm.packingSlip.revision; }
              saveCustomerInvoiceDetail(objPackingDet);
            } else {
              saveMasterShipDetail();
            }
          }
        }, () => {
          if (isFromDetail) {
            saveCustomerInvoiceDetail(objPackingDet);
          } else {
            saveMasterShipDetail();
          }
          // return;
        }).catch((error) => BaseService.getErrorLog(error));
      } else { // if only status change then no confirmation
        if (isFromDetail) {
          saveCustomerInvoiceDetail(objPackingDet);
        } else {
          saveMasterShipDetail();
        }
      }
    };

    const saveMasterShipDetail = () => {
      let packingSlipType;
      let otherDetails = _.flatten(_.map(vm.packingSlipDetail, (item) => item.OtherDetList));
      otherDetails = _.uniqBy(otherDetails, (otherDet) => [otherDet.refSalesorderDetid, otherDet.partID].join());
      let otherChargesDeleteIds;
      if (vm.packingSlip.packingSlipType === vm.invPackingSlipType.MISC_INV || vm.packingSlip.packingSlipType === vm.invPackingSlipType.MISC_PS || vm.isCreditNote) {
        otherDetails = _.flatten(_.map(vm.sourceData, (item) => item.OtherDetList));
        otherChargesDeleteIds = _.flatten(_.map(vm.sourceData, (item) => item.removeOtherChargesIds));
      }
      if ((!vm.isCreditNote) && (vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.CORRECTEDINVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT)) {
        vm.packingSlip.status = CORE.CUSTINVOICE_STATUS.DRAFT;
      } else if ((!vm.isCreditNote) && vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.INVOICED || vm.packingSlip.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED) {
        vm.packingSlip.status = CORE.CUSTINVOICE_STATUS.PUBLISHED;
      }
      if (vm.isCreditNote && vm.packingSlip.subStatus === CORE.CUSTCRNOTE_SUBSTATUS.DRAFT) {
        vm.packingSlip.status = CORE.CUSTCRNOTE_STATUS.DRAFT;
      } else if (vm.isCreditNote && vm.packingSlip.subStatus === CORE.CUSTCRNOTE_SUBSTATUS.PUBLISHED) {
        vm.packingSlip.status = CORE.CUSTCRNOTE_STATUS.PUBLISHED;
      }
      if (vm.isCreditNote) {
        packingSlipType = vm.invPackingSlipType.CR_NOTE;
      } else {
        if (vm.packingSlip.invoiceType) {
          packingSlipType = vm.packingSlip.packingSlipType;
        } else {
          packingSlipType = vm.invPackingSlipType.MISC_INV;
        }
      }
      vm.packingSlip.totalExtendedPrice = parseFloat(parseFloat(vm.packingSlip.totalExtendedPrice || 0).toFixed(_amountFilterDecimal));
      const draftStatusId = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT;
      const isAlreadyPublished = vm.CopyPackingslip && vm.CopyPackingslip.subStatus !== vm.packingSlip.subStatus && vm.CopyPackingslip.subStatus === draftStatusId && (!vm.packingSlip.isAlreadyPublished) ? true : vm.packingSlip.isAlreadyPublished;
      const isAskForVersionConfirmation = vm.packingSlip.isAlreadyPublished && vm.packingSlip.subStatus === draftStatusId && !vm.isStatusChange ? true : false;
      let shippingContactPerson;
      let billingContactPerson;
      let interContactPerson;
      if (!vm.packingSlip.id) {
        shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.packingSlip.shippingContactPersonObj);
        billingContactPerson = BaseService.generateContactPersonDetFormat(vm.packingSlip.billingContactPersonObj);
        interContactPerson = BaseService.generateContactPersonDetFormat(vm.packingSlip.intermediateContactPersonObj);
      } else {
        if (vm.packingSlip.shippingContactPersonID && vm.packingSlip.shippingContactPersonID !== vm.CopyPackingslip.shippingContactPersonID) {
          shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.packingSlip.shippingContactPersonObj);
        } else {
          shippingContactPerson = vm.packingSlip.shippingContactPersonID ? vm.CopyPackingslip.shippingContactPerson : null;
        }
        if (vm.packingSlip.billingContactPersonID && vm.packingSlip.billingContactPersonID !== vm.CopyPackingslip.billingContactPersonID) {
          billingContactPerson = BaseService.generateContactPersonDetFormat(vm.packingSlip.billingContactPersonObj);
        } else {
          billingContactPerson = vm.packingSlip.billingContactPersonID ? vm.CopyPackingslip.billingContactPerson : null;
        }
        if (vm.packingSlip.intermediateContactPersonID && vm.packingSlip.intermediateContactPersonID !== vm.CopyPackingslip.intermediateContactPersonID) {
          interContactPerson = BaseService.generateContactPersonDetFormat(vm.packingSlip.intermediateContactPersonObj);
        } else {
          interContactPerson = vm.packingSlip.intermediateContactPersonID ? vm.CopyPackingslip.intermediateContactPerson : null;
        }
      }

      const objCustomerInvoice = {
        transType: vm.transType,
        invoiceType: vm.packingSlip.invoiceType ? 'I' : 'T',
        invoiceID: vm.custInvoiceID,
        packingSlipID: vm.packingSlip.refPackingSlipId,
        customerID: vm.packingSlip.customerID,
        packingSlipType: packingSlipType,
        status: vm.packingSlip.status,
        subStatus: vm.packingSlip.subStatus,
        refSalesOrderID: vm.packingSlip.refSalesOrderId,
        poNumber: vm.packingSlip.poNumber,
        poDate: BaseService.getAPIFormatedDate(vm.packingSlip.poDate),
        soNumber: vm.packingSlip.soNumber,
        soDate: BaseService.getAPIFormatedDate(vm.packingSlip.soDate),
        sorevision: vm.packingSlip.sorevision,
        packingSlipNumber: vm.packingSlip.packingSlipNumber,
        packingSlipDate: BaseService.getAPIFormatedDate(vm.packingSlip.packingSlipDate),
        creditMemoNumber: vm.packingSlip.creditMemoNumber,
        creditMemoDate: BaseService.getAPIFormatedDate(vm.packingSlip.creditMemoDate),
        refDebitMemoNumber: vm.packingSlip.refDebitMemoNumber,
        refDebitMemoDate: BaseService.getAPIFormatedDate(vm.packingSlip.refDebitMemoDate),
        invoiceNumber: vm.packingSlip.invoiceNumber,
        invoiceDate: BaseService.getAPIFormatedDate(vm.packingSlip.invoiceDate),
        shippingMethodID: vm.autoCompleteShipping && vm.autoCompleteShipping.keyColumnId ? vm.autoCompleteShipping.keyColumnId : vm.packingSlip.shippingMethodId,
        headerComment: vm.packingSlip.headerComment,
        packingSlipComment: vm.packingSlip.packingSlipComment,
        totalAmount: vm.packingSlip.totalExtendedPrice ? vm.packingSlip.totalExtendedPrice : 0,
        billingAddress: (!vm.packingSlip.id) ? BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress) : (vm.packingSlip.billToId && vm.packingSlip.billToId !== vm.CopyPackingslip.billToId ? (BaseService.generateAddressFormateToStoreInDB(vm.BillingAddress) || null) : vm.CopyPackingslip.billingAddress),
        shippingAddress: (!vm.packingSlip.id) ? BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress) : (vm.packingSlip.shipToId && vm.packingSlip.shipToId !== vm.CopyPackingslip.shipToId ? (BaseService.generateAddressFormateToStoreInDB(vm.ShippingAddress) || null) : vm.CopyPackingslip.shippingAddress),
        intermediateAddress: (!vm.packingSlip.id) ? BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress) : vm.packingSlip.intermediateShipmentId && vm.packingSlip.intermediateShipmentId !== vm.CopyPackingslip.intermediateShipmentId ? BaseService.generateAddressFormateToStoreInDB(vm.IntermediateAddress) || null : vm.CopyPackingslip.intermediateAddress,
        billToId: vm.packingSlip.billToId ? vm.packingSlip.billToId : null,
        shipToId: vm.packingSlip.shipToId ? vm.packingSlip.shipToId : null,
        intermediateShipmentId: vm.packingSlip.intermediateShipmentId ? vm.packingSlip.intermediateShipmentId : null,
        freeOnBoardId: vm.autoCompleteFOB && vm.autoCompleteFOB.keyColumnId ? vm.autoCompleteFOB.keyColumnId : vm.packingSlip.freeOnBoardId,
        termsId: vm.autoCompleteTerm && vm.autoCompleteTerm.keyColumnId ? vm.autoCompleteTerm.keyColumnId : vm.packingSlip.termsId,
        salesCommissionTo: vm.autoCompleteSalesCommosssionTo && vm.autoCompleteSalesCommosssionTo.keyColumnId ? vm.autoCompleteSalesCommosssionTo.keyColumnId : vm.packingSlip.salesCommissionTo,
        contactPersonId: vm.packingSlip.contactPersonId ? vm.packingSlip.contactPersonId : null,
        trackingNumberList: vm.packingSlip.customerInvTrackNumber,
        removeTrackingNumberIds: vm.packingSlip.removeCustomerInvTrackNumberIds,
        removeInvoiceTrackingNumbers: vm.packingSlip.removeCustomerInvTrackNumbers,
        rmaNumber: vm.packingSlip.rmaNumber,
        otherChargeDetail: otherDetails,
        removeOtherChargesIds: otherChargesDeleteIds,
        revision: vm.packingSlip.revision,
        isZeroValue: vm.packingSlip.isZeroValue,
        isAlreadyPublished: isAlreadyPublished,
        poRevision: vm.packingSlip.poRevision,
        isMarkForRefund: (vm.isCreditNote && vm.packingSlip.subStatus === vm.CustCreditNoteSubStatusConst.PUBLISHED) ? (vm.packingSlip.isMarkForRefund || false) : false,
        agreedRefundAmt: (vm.isCreditNote && vm.packingSlip.subStatus === vm.CustCreditNoteSubStatusConst.PUBLISHED) ? (vm.packingSlip.agreedRefundAmtDisplay || null) : null,
        isAskForVersionConfirmation: isAskForVersionConfirmation,
        refundStatus: null,
        carrierID: vm.autoCompleteCarriers ? vm.autoCompleteCarriers.keyColumnId : vm.packingSlip.carrierID,
        carrierAccountNumber: vm.packingSlip.carrierAccountNumber,
        billingContactPersonID: vm.packingSlip.billingContactPersonID,
        shippingContactPersonID: vm.packingSlip.shippingContactPersonID,
        intermediateContactPersonID: vm.packingSlip.intermediateContactPersonID,
        billingContactPerson: billingContactPerson,
        shippingContactPerson: shippingContactPerson,
        intermediateContactPerson: interContactPerson
      };

      // credit memo refund status in add case
      if (!vm.custInvoiceID && vm.isCreditNote) {
        objCustomerInvoice.refundStatus = objCustomerInvoice.isMarkForRefund ? TRANSACTION.CustomerCreditMemoRefundStatusText.PendingRefund.Code : TRANSACTION.CustomerCreditMemoRefundStatusText.NotApplicable.Code;
      }

      if (checkErrorDetail(vm.packingSlip.shippingAddress, vm.LabelConstant.Address.ShippingAddress)) {
        vm.packingSlip.shippingAddress = null;
        vm.packingSlip.shipToId = null;
        vm.ShippingAddress = null;
        return;
      } else if (checkErrorDetail(vm.packingSlip.billingAddress, vm.LabelConstant.Address.BillingAddress)) {
        vm.packingSlip.billingAddress = null;
        vm.packingSlip.billToId = null;
        vm.BillingAddress = null;
        return;
      } else if (checkErrorDetail(vm.packingSlip.intermediateAddress, vm.LabelConstant.Address.MarkForAddress)) {
        vm.packingSlip.intermediateShipmentId = null;
        vm.packingSlip.intermediateAddress = null;
        vm.IntermediateAddress = null;
        return;
      };
      if (objCustomerInvoice.billingAddress) {
        objCustomerInvoice.billingAddress = objCustomerInvoice.billingAddress.replace(/<br\/>/g, '\r');
      }
      if (objCustomerInvoice.shippingAddress) {
        objCustomerInvoice.shippingAddress = objCustomerInvoice.shippingAddress.replace(/<br\/>/g, '\r');
      }
      if (objCustomerInvoice.intermediateAddress) {
        objCustomerInvoice.intermediateAddress = objCustomerInvoice.intermediateAddress.replace(/<br\/>/g, '\r');
      }
      vm.cgBusyLoading = CustomerPackingSlipFactory.saveCustomerInvoiceMasterDetail().query(objCustomerInvoice).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.length > 0) {
          vm.isStatusChange = false;
          if (!vm.custInvoiceID) {
            if (vm.frmCustomerInvoice) {
              vm.frmCustomerInvoice.$setPristine();
            }
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.packingId = res.data[0][0].invoiceID;
            }
            $scope.$emit('CustomerPackingAutocomplete');
            if (vm.isCreditNote) {
              $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, { transType: vm.transType, id: res.data[0][0].invoiceID }, { reload: true });
            } else {
              $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { transType: vm.transType, id: res.data[0][0].invoiceID }, { reload: true });
            }
            $timeout(() => {
              setFocus('materialType');
            });
          } else {
            vm.frmCustomerInvoice.$setPristine();
            getCustomerInvoiceDetail();
          }
          vm.isFormDirtyManual = false;
        } else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data) {
          if (res.errors.data.isAgreedRefundAmtLessThanTotIssued) {
            // when Agreed Refund Amount Less Than Total Issued Amout >> error as not allowed
            vm.packingSlip.totRefundIssuedAgainstCreditMemo = res.errors.data.totRefundIssuedAgainstCreditMemo;
            /* ng-changed called vm.refundAmtChanged() as we changed agreedRefundAmtDisplay modal value , if model value same then need to call */
            //displayErrorMsgForAgreedRefundLessThanTotIssued(res.errors.data.totRefundIssuedAgainstCreditMemo);
            if (vm.packingSlip.totRefundIssuedAgainstCreditMemo === res.errors.data.totRefundIssuedAgainstCreditMemo) {
              displayErrorMsgForAgreedRefundLessThanTotIssued(res.errors.data.totRefundIssuedAgainstCreditMemo);
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //change history
    vm.changeInvoiceCharge = () => {
      vm.invoiceDetail = {
        materialType: vm.invoiceDetail.materialType,
        quoteFrom: vm.salesCommissionFrom.FromPartMaster.id
      };
      vm.isFocus = false;
      vm.autocompleteOtherCharges.keyColumnId = null;
      vm.autocompleteAssy.keyColumnId = null;
      vm.autocompleteMfgPN.keyColumnId = null;
      if (vm.invoiceDetailForm) {
        vm.invoiceDetailForm.$setPristine();
        vm.invoiceDetailForm.$setUntouched();
      }
      //if (vm.invoiceDetail.materialType) {
      //  setFocus('slipLine');
      //} else {
      //  vm.isFocus = true;
      //}
    };

    vm.checkPackingLine = () => {
      // invoice type condition added just to validate packing slip number in case of regular invoice only
      let alertMessage = false;
      if (vm.invoiceDetail && vm.invoiceDetail.packingSlipSerialNumber) {
        const checkPackingLine = _.find(vm.sourceData, (data) => parseFloat(data.packingSlipSerialNumber) === parseFloat(vm.invoiceDetail.packingSlipSerialNumber));
        let messageContent;
        if (checkPackingLine) {
          vm.OldDetailId = vm.invoiceDetail.id; // added to check  same line is loaded or not
          if (vm.OldDetailId !== checkPackingLine.id) {
            if (vm.OldDetailId) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_PACKINGTYPE_CONFIRMATION);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  checkPackingLine.isZeroValue = checkPackingLine.isZeroValue > 0 ? true : false;
                  vm.invoiceDetail = _.clone(checkPackingLine);
                  vm.invoiceDetailCopy = angular.copy(checkPackingLine);
                  vm.recordUpdate = true;
                  if (checkPackingLine.partType === CORE.PartType.Other) {
                    vm.invoiceDetail.materialType = false;
                    vm.autocompleteOtherCharges.keyColumnId = vm.invoiceDetail.partId;
                  } else {
                    if (vm.OldDetailId !== vm.invoiceDetail.id) {
                      const searchObj = {
                        partID: vm.invoiceDetail.partId,
                        searchText: null
                      };
                      getcomponentAssemblyList(searchObj);
                      $scope.$broadcast(vm.autocompleteAssy.inputName + 'partID', vm.invoiceDetail.partId);
                    } else {
                      setFocus('unitPrice');
                    }
                    if (!vm.isCreditNote) {
                      if (vm.autocompleteQtyTurnTime) {
                        vm.autocompleteQtyTurnTime.keyColumnId = null;
                      }
                      if (vm.autoCompleteQuoteGroup) {
                        vm.autoCompleteQuoteGroup.keyColumnId = null;
                      }
                      let autoCompletePromise = [];
                      if ((vm.invoiceDetail.isCustom || vm.invoiceDetail.isCPN || vm.invoiceDetail.isMISCAssemblyType) && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                        autoCompletePromise = [getQtyTurnTimeByAssyId(vm.invoiceDetail.partId)];
                      }
                      if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
                        if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
                          vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
                          vm.invoiceDetail.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
                        }
                        if (vm.invoiceDetail.partId) {
                          autoCompletePromise = [getrfqQuoteQtyTurnTimeList(vm.invoiceDetail.refRFQGroupID, (vm.invoiceDetail.partId))];
                        }
                      } else if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.FromRFQ.id) {
                        if (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId) {
                          vm.autoCompleteQuoteGroup.keyColumnId = null;
                          $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
                          $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
                        }
                        vm.invoiceDetail.refRFQGroupID = null;
                      }
                      vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
                        vm.quoteGroupDetails = [];
                        if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.invoiceDetail.partId) {
                          getrfqQuoteGroupList(vm.invoiceDetail.partId);
                        }
                      });
                    }
                  }
                }
              }, () => {
                setFocus('slipLine');
                // vm.invoiceDetail.packingSlipSerialNumber = OldRefLineId;
              });
            } else {
              checkPackingLine.isZeroValue = checkPackingLine.isZeroValue > 0 ? true : false;
              vm.invoiceDetail = _.clone(checkPackingLine);
              vm.invoiceDetailCopy = angular.copy(checkPackingLine);
              vm.recordUpdate = true;
              if (checkPackingLine.partType === CORE.PartType.Other) {
                vm.invoiceDetail.materialType = false;
                vm.autocompleteOtherCharges.keyColumnId = vm.invoiceDetail.partId;
              } else {
                // vm.autocompleteAssy.keyColumnId !== vm.invoiceDetail.partId
                if (vm.OldDetailId !== vm.invoiceDetail.id) {
                  const searchObj = {
                    partID: vm.invoiceDetail.partId,
                    searchText: null
                  };
                  getcomponentAssemblyList(searchObj);
                  $scope.$broadcast(vm.autocompleteAssy.inputName + 'partID', vm.invoiceDetail.partId);
                } else {
                  setFocus('unitPrice');
                }
                if (!vm.isCreditNote) {
                  if (vm.autocompleteQtyTurnTime) {
                    vm.autocompleteQtyTurnTime.keyColumnId = null;
                  }
                  let autoCompletePromise = [];
                  if ((vm.invoiceDetail.isCustom || vm.invoiceDetail.isCPN || vm.invoiceDetail.isMISCAssemblyType) && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                    autoCompletePromise = [getQtyTurnTimeByAssyId(vm.invoiceDetail.partId)];
                  }
                  if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
                    if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
                      vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
                      vm.invoiceDetail.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
                    }
                    if (vm.invoiceDetail.partId) {
                      autoCompletePromise = [getrfqQuoteQtyTurnTimeList(vm.invoiceDetail.refRFQGroupID, vm.invoiceDetail.partId)];
                    }
                  }
                  vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
                    if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.invoiceDetail.partId) {
                      getrfqQuoteGroupList(vm.invoiceDetail.partId);
                    }
                  });
                }
              }
            }
          }
        } else {
          if (vm.packingSlip.invoiceType && (!vm.isCreditNote)) {
            if (vm.invoiceDetail.materialType && !vm.invoiceDetail.id) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_NOTFOUND);
              messageContent.message = stringFormat(messageContent.message, vm.invoiceDetail.packingSlipSerialNumber);
              alertMessage = true;
            } else if (vm.invoiceDetail.id && vm.invoiceDetail.isFromPackingSlip) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_CANNOTUPDATE);
              alertMessage = true;
            }
          }
        }
        //else if ((!checkPackingLine) && vm.packingSlip.invoiceType && (!vm.isCreditNote) && vm.invoiceDetail.materialType && vm.invoiceDetail.id && vm.custInvoiceID) {
        //  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_CANNOTUPDATE);
        //} else if (!checkPackingLine && (vm.recordUpdate || !vm.invoiceDetail.id) && (!vm.isCreditNote) && vm.custInvoiceID) {
        //  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_NOTFOUND);
        //}
        if (messageContent && alertMessage) {
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel).then((yes) => {
            if (yes) {
              // setFocus('slipLine');
              return false;
            }
          }, () => { }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.calculateExtendedPrice();
          return true;
        }
      }
    };
    //reset invoice details
    vm.resetInvoiceDetail = () => {
      if (vm.autocompleteAssy && vm.autocompleteAssy.keyColumnId) {
        vm.autocompleteAssy.keyColumnId = null;
        $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
      }
      if (vm.autocompleteMfgPN) {
        vm.autocompleteMfgPN.keyColumnId = null;
        $scope.$broadcast(vm.autocompleteMfgPN.inputName + 'searchText', null);
      }
      if (vm.autocompleteOtherCharges) {
        vm.autocompleteOtherCharges.keyColumnId = null;
      }
      if (vm.autocompleteQtyTurnTime) {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
      }
      if (vm.autoCompleteQuoteGroup) {
        vm.autoCompleteQuoteGroup.keyColumnId = null;
        // $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
        $timeout(() => {
          $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
        });
      }
      vm.quoteGroupDetails = [];
      vm.quoteQtyTurnTimeDetails = [];
      vm.OldDetailId = null;
      commonField();
      vm.recordUpdate = false;
      vm.recordView = false;
      vm.invoiceDetail = {
        materialType: vm.invoiceDetail.materialType,
        quoteFrom: vm.salesCommissionFrom.FromPartMaster.id
      };
      //vm.invoiceDetail.shipQty = null;
      //vm.invoiceDetail.extendedPrice = null;
      // vm.autoCompleteChargeType.keyColumnId = null;
      if (vm.invoiceDetailForm) {
        $timeout(() => {
          vm.invoiceDetailForm.$setPristine();
          vm.invoiceDetailForm.$setUntouched();
        });
      }
      // focusonField('materialType');
    };

    //calculate price based on selected details
    vm.calculateExtendedPrice = (isFromUnitPrice) => {
      if (!vm.recordUpdate && !vm.isCreditNote && (vm.invoiceDetail.unitPrice === null || vm.invoiceDetail.oldShipQty !== vm.invoiceDetail.shipQty) && (vm.invoiceDetail.isComponent || !vm.invoiceDetail.materialType) && !vm.invoiceDetail.isCustom) {
        vm.invoiceDetail.oldShipQty = vm.invoiceDetail.shipQty;
        vm.changeOtherPartQty();
      }
      //on change unit price/qty if commission already added  confirm to  reset
      if (vm.recordUpdate && (!vm.isCreditNote) && (vm.invoiceDetail && vm.invoiceDetail.salesCommissionList && vm.invoiceDetail.salesCommissionList.length > 0) &&
        (vm.invoiceDetail.isCommissionDataEdited || vm.invoiceDetail.id > 0)) {
        if (isFromUnitPrice && parseFloat(vm.invoiceDetail.unitPrice) !== parseFloat(vm.invoiceDetailCopy.unitPrice)) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.price);
        } else if (parseInt(vm.invoiceDetail.shipQty) !== parseInt(vm.invoiceDetailCopy.shipQty)) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.shipQty);
        }
      } else {
        // only for MISC invoice allow for both case
        if (!vm.recordUpdate && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
          if ((!vm.invoiceDetail.id && vm.invoiceDetail.oldShipQty !== vm.invoiceDetail.shipQty) ||
            !vm.invoiceDetail.unitPrice) {
            setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
            vm.invoiceDetail.oldShipQty = vm.invoiceDetail.shipQty;
          }
        }
        // update record and change qty only
        if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id && !isFromUnitPrice) {
          if (vm.invoiceDetail.id && (vm.invoiceDetail.shipQty !== vm.invoiceDetailCopy.shipQty || vm.recordUpdate)) {
            getQtyTurnTimeByAssyId(vm.invoiceDetail.partId);
          }
        }
        if ((vm.invoiceDetail.id || (vm.invoiceDetailCopy && vm.invoiceDetail.shipQty !== vm.invoiceDetailCopy.shipQty)) && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
          if (vm.autoCompleteQuoteGroup.keyColumnId && vm.autocompleteAssy.keyColumnId) {
            setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
          }
        }
        // && vm.invoiceDetail.shipQty !== vm.invoiceDetailCopy.shipQty
        if (isFromUnitPrice && vm.invoiceDetail.id && (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id || vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id)) {
          vm.getSalesCommissionDetailsOnPriceChange();
        }
        // change default price while adding new part
        if (isFromUnitPrice && (!vm.invoiceDetail.id) && vm.invoiceDetail.oldUnitPrice !== vm.invoiceDetail.unitPrice && (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id || vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id)) {
          vm.getSalesCommissionDetailsOnPriceChange();
          vm.invoiceDetail.oldUnitPrice = vm.invoiceDetail.unitPrice;
        }
      }

      // for other charges and off-the-shelf part put qty default  1  other wise user entry
      if (vm.packingSlip.invoiceType && (!vm.invoiceDetail.materialType) && (!vm.isCreditNote)) {
        if (!vm.invoiceDetail.shipQty) {
          vm.invoiceDetail.shipQty = 1;
        }
        // vm.invoiceDetail.extendedPrice = parseFloat(((vm.invoiceDetail.shipQty || 0) * (vm.invoiceDetail.unitPrice || 0)).toFixed(2));
      } else if (!vm.packingSlip.invoiceType) {
        if (!vm.invoiceDetail.shipQty && !(vm.invoiceDetail.isCPN || vm.invoiceDetail.isCustom || vm.invoiceDetail.isMISCAssemblyType)) {
          vm.invoiceDetail.shipQty = 1;
        }
        // vm.invoiceDetail.extendedPrice = parseFloat(((vm.invoiceDetail.shipQty || 0) * (vm.invoiceDetail.unitPrice || 0)).toFixed(2));
      }
      if (vm.invoiceDetail.unitPrice && vm.invoiceDetail.unitPrice > 0) {
        vm.invoiceDetail.isZeroValue = false;
      }
      vm.invoiceDetail.extendedPrice = parseFloat(parseFloat(((vm.invoiceDetail.shipQty || 0) * (vm.invoiceDetail.unitPrice || 0)).toFixed(2)));
      if (vm.isCreditNote) {
        if (!vm.invoiceDetail.shipQty) {
          vm.invoiceDetail.shipQty = 1;
          vm.invoiceDetail.extendedPrice = parseFloat(((vm.invoiceDetail.shipQty || 0) * (vm.invoiceDetail.unitPrice || 0)));
        }
        if (vm.invoiceDetail.extendedPrice > 0) {
          vm.invoiceDetail.extendedPrice = vm.invoiceDetail.extendedPrice * (-1);
        }
      }
    };

    vm.changeMarkForRefund = () => {
      if (!vm.packingSlip.isMarkForRefund) {
        vm.packingSlip.agreedRefundAmtDisplay = null;
      }
    };

    vm.refundAmtChanged = () => {
      if (vm.packingSlip.isMarkForRefund === true && vm.totalRefundAmt) {
        if (vm.totalRefundAmt > 0 && (vm.packingSlip.agreedRefundAmtDisplay <= vm.totalRefundAmt)) {
          vm.packingSlip.agreedRefundAmt = parseFloat(vm.packingSlip.agreedRefundAmtDisplay.toFixed(2));
        }
      }
      if ((vm.frmCustomerInvoice.agreedRefundAmt.$viewValue || 0) < (vm.packingSlip.totRefundIssuedAgainstCreditMemo || 0)) {
        displayErrorMsgForAgreedRefundLessThanTotIssued(vm.packingSlip.totRefundIssuedAgainstCreditMemo);
      }
    };

    //save customer invoice sub details
    vm.updatePackingDetail = () => {
      // calculate isAskForVersionConfirmation value while change in detail in draft mode (second time).
      const draftStatusId = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT;
      const isAskForVersionConfirmation = vm.packingSlip.isAlreadyPublished && vm.packingSlip.subStatus === draftStatusId && !vm.isStatusChange ? true : false;

      if (BaseService.focusRequiredField(vm.invoiceDetailForm)) {
        return;
      }
      if (vm.packingSlip.invoiceType && vm.invoiceDetail.materialType && !vm.recordUpdate && !vm.isCreditNote) {
        return;
      }
      let isAddDtl = false;
      if (!vm.invoiceDetail.id) {
        isAddDtl = true;
      } else {
        const checkPackingLine = _.find(vm.sourceData, (data) => parseFloat(data.packingSlipSerialNumber) === parseFloat(vm.invoiceDetail.packingSlipSerialNumber) && parseFloat(data.releaseNumber || 0) === (vm.invoiceDetail.releaseNumber || 0));
        let messageContent;
        // so line# allowed to  set blank for MISC packingslip invoice  & MISC Invoice case
        if (!checkPackingLine && vm.packingSlip.invoiceType && (!vm.isCreditNote)) {
          if (vm.invoiceDetail.materialType && !vm.invoiceDetail.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_NOTFOUND);
            messageContent.message = stringFormat(messageContent.message, vm.invoiceDetail.packingSlipSerialNumber);
          } else if (vm.invoiceDetail.id && vm.invoiceDetail.isFromPackingSlip) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_CANNOTUPDATE);
          }
        } else if (checkPackingLine && vm.packingSlip.invoiceType && checkPackingLine.id !== vm.invoiceDetail.id && vm.invoiceDetail.materialType && !vm.isCreditNote && vm.invoiceDetail.isFromPackingSlip) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUSTOMER_INVOICE_POLINE_CANNOTUPDATE);
        }
        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
      }
      // validate RFQ only parts
      if (vm.invoiceDetail.partId && vm.invoiceDetail.rfqOnly) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
        messageContent.message = stringFormat(messageContent.message, item.PIDCode);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      }
      _.each(vm.sourceData, (detItem) => {
        if (detItem.id === vm.invoiceDetail.id) {
          detItem.shipQty = vm.invoiceDetail.shipQty;
          detItem.unitPrice = vm.invoiceDetail.unitPrice;
        }
      });
      // before save if extended price is  0 then re-calculate price
      if (!vm.invoiceDetail.extendedPrice) {
        vm.invoiceDetail.extendedPrice = parseFloat(parseFloat(((vm.invoiceDetail.shipQty || 0) * (vm.invoiceDetail.unitPrice || 0)).toFixed(2)));
      }
      detailOfCharges();
      if (vm.isCreditNote && vm.packingSlip.totalExtendedPrice < 0) {
        vm.packingSlip.totalExtendedPrice = parseFloat(vm.packingSlip.totalExtendedPrice) * (-1);
      }
      if (isAddDtl) {
        vm.packingSlip.totalExtendedPrice = parseFloat(vm.packingSlip.totalExtendedPrice) + (parseInt(vm.invoiceDetail.shipQty ? vm.invoiceDetail.shipQty : 0) * parseFloat(vm.invoiceDetail.unitPrice));
      }
      if (vm.isCreditNote && vm.invoiceDetail.extendedPrice > 0) {
        vm.invoiceDetail.extendedPrice = parseFloat(vm.invoiceDetail.extendedPrice) * (-1);
      }
      if (vm.isCreditNote && vm.packingSlip.totalExtendedPrice > 0) {
        vm.packingSlip.totalExtendedPrice = parseFloat(vm.packingSlip.totalExtendedPrice) * (-1);
      }
      vm.packingSlip.totalExtendedPrice = parseFloat(vm.packingSlip.totalExtendedPrice).toFixed(_amountFilterDecimal);
      // incase of invoice, discount line should not be more than total of all other parts already added.
      if (vm.packingSlip.totalExtendedPrice < 0 && !vm.isCreditNote) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.DISCOUNT_NOT_MORE_THAN_INVOICE_TOTAL);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.sourceData = angular.copy(vm.sourceDataClone);
          vm.gridOptions.data = vm.sourceData;
          detailOfCharges();
        });
        return;
      }
      let qtyTurnTimeText;
      // let quoteFromText;
      if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
        // quoteFromText = vm.salesCommissionFrom.FromPartMaster.value;
        qtyTurnTimeText = vm.invoiceDetail.qtyTurnTime;
      } else if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        // quoteFromText = vm.salesCommissionFrom.FromRFQ.value;
        qtyTurnTimeText = vm.invoiceDetail.qtyTurnTime;
      } else {
        qtyTurnTimeText = null;
      }
      if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.NA.id) {
        vm.invoiceDetail.quoteNumber = null;
        vm.invoiceDetail.refAssyQtyTurnTimeID = null;
        vm.invoiceDetail.refRFQGroupID = null;
      }
      if (vm.invoiceDetail.id) {
        _.each(vm.invoiceDetail.salesCommissionList, (det) => {
          if (det.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID && vm.invoiceDetail.unitPrice !== det.unitPrice) {
            det.unitPrice = vm.invoiceDetail.unitPrice;
            det.commissionValue = roundUpNum((((100 / (100 + parseFloat(det.commissionPercentage))) * det.unitPrice) * parseFloat(det.commissionPercentage) / 100), _unitPriceFilterDecimal);
          }
          if (det.refCustPackingSlipDetID <= 0 || !det.refCustPackingSlipDetID) {
            det.refCustPackingSlipDetID = vm.invoiceDetail.id;
          }
        });
      }
      const objpackingslipDet = {
        transType: vm.transType,
        reflineID: vm.invoiceDetail.packingSlipSerialNumber,
        custPOLineID: vm.invoiceDetail.custPOLineID,
        // refChargesTypeID: vm.autocompleteOtherCharges.keyColumnId,
        shipQty: vm.invoiceDetail.shipQty || 1,
        unitPrice: vm.invoiceDetail.unitPrice,
        extendedPrice: vm.invoiceDetail.extendedPrice,
        refCustPackingSlipID: vm.custInvoiceID,
        id: vm.invoiceDetail.id,
        poQty: vm.invoiceDetail.shipQty,
        remainingQty: 0,
        shippedQty: vm.invoiceDetail.shipQty,
        invoiceId: vm.custInvoiceID,
        totalAmount: vm.packingSlip.totalExtendedPrice,
        assyDescription: vm.invoiceDetail.assyDescription || '-',
        partId: vm.invoiceDetail.partId,
        internalComment: vm.invoiceDetail.internalComment,
        shippingNotes: vm.invoiceDetail.shippingNotes,
        quoteNumber: vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.NA.id ? null : vm.invoiceDetail.quoteNumber,
        quoteFrom: vm.isCreditNote ? vm.salesCommissionFrom.NA.id : vm.invoiceDetail.quoteFrom,
        refRFQGroupID: vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id ? vm.invoiceDetail.refRFQGroupID : null,
        refAssyQtyTurnTimeID: vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id ? (vm.invoiceDetail.refRFQQtyTurnTimeID ? vm.invoiceDetail.refRFQQtyTurnTimeID : vm.invoiceDetail.refAssyQtyTurnTimeID) : null,
        assyQtyTurnTimeText: qtyTurnTimeText,
        refRFQQtyTurnTimeID: (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) ? vm.invoiceDetail.refRFQQtyTurnTimeID : null,
        salesCommissionList: vm.invoiceDetail.salesCommissionList || [],
        deletedComissionIds: vm.invoiceDetail.deletedComissionIds,
        isZeroValue: vm.invoiceDetail.isZeroValue || false,
        revision: vm.packingSlip.revision,
        isAskForVersionConfirmation: isAskForVersionConfirmation,
        releaseNotes: vm.invoiceDetail.releaseNotes
      };
      vm.isInvoiceDetailChanged = true;
      // Check  for country validation for MISC invoice and only for  status  other than ShipedNotInvoiced(New : Draft)
      if (!vm.packingSlip.invoiceType && !vm.isCreditNote && vm.packingSlip.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
        const promise = [checkInvoiceCountryValidation(null, false)];
        vm.cgBusyLoading = $q.all(promise).then((res) => {
          if (res && res[0]) {
            confirmRevisionAndSave(true, objpackingslipDet);
          } else {
            return;
          }
        });
      } else {
        confirmRevisionAndSave(true, objpackingslipDet);
      }
    };
    // saveCustomerInvoiceDetail(objpackingslipDet);
    const saveCustomerInvoiceDetail = (objPackingSlipDet) => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.saveCustomerInvoiceSubDetail().query(objPackingSlipDet).$promise.then(() => {
        vm.sourceData = [];
        vm.isInvoiceDetailChanged = false;
        vm.OldDetailId = null;
        getCustomerInvoiceDetail();
        vm.resetInvoiceDetail();
        setFocus('materialType');
      }).catch((error) => BaseService.getErrorLog(error));
    };


    //update record for packing slip
    vm.updateRecord = (row) => {
      if (vm.packingSlip.status === CORE.CUSTINVOICE_STATUS.PUBLISHED) {
        vm.recordUpdate = false;
        return false;
      }
      if (!row.entity.isDisabledUpdate) {
        vm.OldDetailId = vm.invoiceDetail.id;
        vm.invoiceDetail = _.clone(row.entity);
        vm.invoiceDetail.isZeroValue = vm.invoiceDetail.isZeroValue > 0 ? true : false;
        vm.invoiceDetailCopy = _.clone(vm.invoiceDetail);
        if (row.entity.partType === CORE.PartType.Other) {
          vm.autocompleteOtherCharges.keyColumnId = row.entity.partId;
        } else {
          const searchObj = {
            partID: row.entity.partId,
            searchText: null
          };
          getcomponentAssemblyList(searchObj);
        }
        let autoCompletePromise = [];
        if ((vm.invoiceDetail.isCustom || vm.invoiceDetail.isCPN || vm.invoiceDetail.isMISCAssemblyType) && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
          autoCompletePromise = [getQtyTurnTimeByAssyId(vm.invoiceDetail.partId)];
        }
        if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
          if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
            vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
            vm.invoiceDetail.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
          }
          if (vm.invoiceDetail.partId) {
            autoCompletePromise = [getrfqQuoteQtyTurnTimeList(vm.invoiceDetail.refRFQGroupID, (vm.invoiceDetail.partId))];
          }
        } else if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.FromRFQ.id) {
          if (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId) {
            vm.autoCompleteQuoteGroup.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
          }
          vm.invoiceDetail.refRFQGroupID = null;
        }
        vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
          //if (!vm.invoiceDetail.salesCommissionList || vm.invoiceDetail.salesCommissionList.length === 0) {
          //  vm.getSalesCommissionDetailsOnPriceChange();
          //}
          vm.quoteGroupDetails = [];
          if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.invoiceDetail.partId && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
            getrfqQuoteGroupList(vm.invoiceDetail.partId);
          }
        });
        vm.recordUpdate = true;
        // get price based on qty for case of  PS based invoice as it will be update case for line
        if (vm.packingSlip.invoiceType && !vm.isCreditNote && vm.invoiceDetail.unitPrice === null) {
          vm.getPartPriceBreakDetails(vm.invoiceDetail.partId);
        }
        $timeout(() => {
          vm.calculateExtendedPrice();
          setFocus('description');
        });
      }
    };
    /*
     * Author :  Charmi Patel
     * Purpose : ui grid expandable to show other charges details
     */
    vm.expandableJS = () => {
      if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
        vm.gridOptions.gridApi.expandable.on.rowExpandedStateChanged($scope, (row) => {
          $scope.parentrow = row.entity;
          if (row.isExpanded) {
            vm.subGridpagingInfo = {
              Page: CORE.UIGrid.Page(),
              SortColumns: [],
              SearchColumns: []
            };

            vm.subGridgridOptions = {
              showColumnFooter: false,
              enableRowHeaderSelection: false,
              enableFullRowSelection: true,
              enableRowSelection: false,
              multiSelect: false,
              filterOptions: vm.subGridpagingInfo.SearchColumns,
              enableCellEdit: false,
              enablePaging: false,
              enableExpandableRowHeader: false,
              enableGridMenu: false,
              enableCellEditOnFocus: true,
              appScopeProvider: $scope,
              enableCellSelection: true,
              allowCellFocus: true
            };

            vm.subGridsourceHeader = [
              {
                field: '#',
                width: 50,
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
                enableFiltering: false,
                enableSorting: false
              },
              {
                field: 'mfgPN',
                displayName: 'Other Charges',
                cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID"\
                            component-id="row.entity.partID" \
                            label="grid.appScope.vm.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgPN" \
                            is-copy="true" \
                            is-custom-part="true "\
                            rohs-icon="grid.appScope.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            ></common-pid-code-label-link></div>',
                width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
                allowCellFocus: false
              },
              {
                field: 'qty',
                headerCellTemplate: '<div class="ui-grid-cell-contents text-left">Qty</div>',
                width: '100',
                type: 'number',
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | numberWithoutDecimal}}</div>'
              },
              {
                field: 'price',
                width: '140',
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>',
                displayName: 'Unit Price ($)'
              },
              {
                field: 'extOtherPrice',
                width: '140',
                displayName: 'Ext. Price ($)',
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>'
              },
              {
                field: 'frequencyName',
                width: '120',
                displayName: 'Charge Frequency',
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-left">{{COL_FIELD}}</div>'
              }
            ];
            vm.subGridgridOptions.columnDefs = vm.subGridsourceHeader;
            vm.subGridgridOptions.data = row.entity.OtherDetList;
            vm.isValidChildData = true;
            vm.subGridgridOptions.onRegisterApi = function (gridApi) {
              vm.gridApi = gridApi;
            };
            row.entity.subGridOptions = vm.subGridgridOptions;
          }
        });
      }
    };

    //qty sum
    vm.getQtySum = (columnName) => {
      const sum = _.sumBy(vm.sourceData, (data) => data[columnName]);
      return $filter('numberWithoutDecimal')(sum);
    };
    //get total price
    vm.getFooterTotal = (columnName) => {
      let sum = _.sumBy(vm.sourceData, (data) => parseFloat(data[columnName] || 0));
      sum = $filter('amount')(sum);
      return sum;
    };

    //update status
    vm.changeInvoiceStatus = (item) => {
      // vm.packingSlip.status = item.ID;
      vm.isFormDirtyManual = false;
      if (!vm.frmCustomerInvoice.$dirty) {
        vm.frmCustomerInvoice.$$controls[0].$setDirty();
        vm.isFormDirtyManual = true;
      }
      if (vm.packingSlip.subStatus !== item.ID) {
        vm.saveCustomerInvoice(item.ID);
      } else {
        if (vm.isFormDirtyManual) {
          vm.frmCustomerInvoice.$setPristine();
          vm.isFormDirtyManual = false;
        }
      }
    };
    // check date vallidation
    vm.checkDateValidation = () => {
      const poDate = vm.packingSlip.poDate ? new Date($filter('date')(vm.packingSlip.poDate, vm.DefaultDateFormat)) : vm.frmCustomerInvoice.poDate.$viewValue ? new Date($filter('date')(vm.frmCustomerInvoice.poDate.$viewValue, vm.DefaultDateFormat)) : null;
      let packingSlipDate;
      let creditMemoDate;
      let debitMemoDate;
      if (vm.frmCustomerInvoice.packingSlipDate) {
        packingSlipDate = vm.packingSlip.packingSlipDate ? new Date($filter('date')(vm.packingSlip.packingSlipDate, vm.DefaultDateFormat)) : vm.frmCustomerInvoice.packingSlipDate.$viewValue ? new Date($filter('date')(vm.frmCustomerInvoice.packingSlipDate.$viewValue, vm.DefaultDateFormat)) : null;
      }
      const invoiceDate = vm.packingSlip.invoiceDate ? new Date($filter('date')(vm.packingSlip.invoiceDate, vm.DefaultDateFormat)) : vm.frmCustomerInvoice.invoiceDate.$viewValue ? new Date($filter('date')(vm.frmCustomerInvoice.invoiceDate.$viewValue, vm.DefaultDateFormat)) : null;
      if (vm.frmCustomerInvoice.creditMemoDate) {
        creditMemoDate = vm.packingSlip.creditMemoDate ? new Date($filter('date')(vm.packingSlip.creditMemoDate, vm.DefaultDateFormat)) : vm.frmCustomerInvoice.creditMemoDate.$viewValue ? new Date($filter('date')(vm.frmCustomerInvoice.creditMemoDate.$viewValue, vm.DefaultDateFormat)) : null;
      }
      if (vm.frmCustomerInvoice.refDebitMemoDate) {
        debitMemoDate = vm.packingSlip.debitMemoDate ? new Date($filter('date')(vm.packingSlip.debitMemoDate, vm.DefaultDateFormat)) : vm.frmCustomerInvoice.refDebitMemoDate.$viewValue ? new Date($filter('date')(vm.frmCustomerInvoice.refDebitMemoDate.$viewValue, vm.DefaultDateFormat)) : null;
      }
      /*
      date: type
      podate 1
      psdate 2
      invdate 3
      crdate 4
      dbdate 5 */

      if (vm.frmCustomerInvoice) {
        if (poDate && packingSlipDate && poDate <= packingSlipDate) {
          vm.frmCustomerInvoice.packingSlipDate.$setValidity('minvalue', true);
          vm.frmCustomerInvoice.poDate.$setValidity('maxvalue', true);
        }
        if (packingSlipDate && invoiceDate && invoiceDate >= packingSlipDate && vm.packingSlip.invoiceType) {
          vm.frmCustomerInvoice.invoiceDate.$setValidity('minvalue', true);
          vm.frmCustomerInvoice.packingSlipDate.$setValidity('maxvalue', true);
        }
        if (poDate && invoiceDate && invoiceDate >= poDate && (!vm.packingSlip.invoiceType)) {
          vm.frmCustomerInvoice.invoiceDate.$setValidity('minvalue', true);
          vm.frmCustomerInvoice.poDate.$setValidity('maxvalue', true);
        }
        if (debitMemoDate) {
          if (debitMemoDate && invoiceDate && debitMemoDate >= invoiceDate) {
            vm.frmCustomerInvoice.refDebitMemoDate.$setValidity('minvalue', true);
            vm.frmCustomerInvoice.invoiceDate.$setValidity('maxvalue', true);
          }
        } else {
          if (creditMemoDate && invoiceDate && creditMemoDate >= invoiceDate) {
            vm.frmCustomerInvoice.creditMemoDate.$setValidity('minvalue', true);
            vm.frmCustomerInvoice.invoiceDate.$setValidity('maxvalue', true);
          }
        }
        if (creditMemoDate && debitMemoDate && creditMemoDate >= debitMemoDate) {
          vm.frmCustomerInvoice.creditMemoDate.$setValidity('minvalue', true);
          vm.frmCustomerInvoice.refDebitMemoDate.$setValidity('maxvalue', true);
        }
      }
    };

    /* delete customer invoice detail*/
    vm.deleteRecord = (customerinvoice) => {
      let selectedIDs = [];
      if (customerinvoice) {
        if (customerinvoice.id) {
          selectedIDs.push(customerinvoice.id);
        }
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = (_.filter(vm.selectedRows, (detID) => detID.id)).map((item) => item.id);
        }
      }

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, vm.isCreditNote ? 'Credit Memo Detail' : 'Invoice Detail', (selectedIDs.length));
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      const objIDs = {
        id: selectedIDs,
        CountList: false,
        CustomerPackingSlipID: vm.custInvoiceID,
        isInvoice: true,
        transType: vm.transType,
        revision: vm.packingSlip.revision,
        invoiceId: vm.packingSlip.id
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          //const statusList = vm.isCreditNote ? CORE.Customer_CrMemo_SubStatus : CORE.Customer_Invoice_SubStatus;
          const checkForStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT);
          //const statusName = _.filter(statusList, (item) => item.ID === vm.packingSlip.subStatus).map((item) => item.Name);
          const pageName = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Customer Invoice' : 'Customer Credit Memo';
          const newRevision = (parseInt(vm.packingSlip.revision || 0) + 1) < 10 ? stringFormat('0{0}', (parseInt(vm.packingSlip.revision || 0) + 1)) : (parseInt(vm.packingSlip.revision || 0) + 1).toString();
          if (vm.custInvoiceID && vm.packingSlip.subStatus !== checkForStatus) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, pageName, vm.packingSlip.revision, newRevision);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.packingSlip.revision = parseInt(vm.packingSlip.revision || 0) + 1;
                objIDs.revision = vm.packingSlip.revision;
                deleteRecordAfterRevison(objIDs);
              }
            }, () => {
              deleteRecordAfterRevison(objIDs);
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            deleteRecordAfterRevison(objIDs);
          }
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };
    /* delete multiple data called from directive of ui-grid*/

    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    const deleteRecordAfterRevison = (objIDs) => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.deleteCustomerInvoiceDetail().query({
        objIDs: objIDs
      }).$promise.then((data) => {
        if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
          const datas = {
            TotalCount: data.data.transactionDetails[0].TotalCount,
            pageName: CORE.PageName.customerPackingSlip
          };
          BaseService.deleteAlertMessageWithHistory(datas, (ev) => {
            const IDs = {
              id: selectedIDs,
              CountList: true,
              CustomerPackingSlipID: [],
              isInvoice: true,
              revision: vm.packingSlip.revision,
              invoiceId: vm.packingSlip.id
            };
            return CustomerPackingSlipFactory.deleteCustomerInvoiceDetail().query({
              objIDs: IDs
            }).$promise.then((res) => {
              let data = {};
              data = res.data;
              data.pageTitle = vm.packingSlip.packingSlipNumber;
              data.PageName = CORE.PageName.customerPackingSlip;
              data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
              data.id = selectedIDs;
              if (res.data) {
                DialogFactory.dialogService(
                  USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                  USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                  ev,
                  data).then(() => { }, () => { });
              }
            }).catch((error) => BaseService.getErrorLog(error));
          });
        } else {
          getCustomerInvoiceDetail();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // add tracking number
    vm.addTrackingNumberToList = (event) => {
      if (event.keyCode === 13) {
        vm.isDisableTrackNumber = true;
        $timeout(() => {
          if (!vm.trackingNumberDet.trackNumber || !vm.trackingNumberDet.trackNumber.trim()) {
            vm.isDisableTrackNumber = false;
            setFocus('trackingNumber');
            return;
          }
          if (vm.checkUniqueTrackNumber()) {
            let trackControl;
            vm.isDisableTrackNumber = false;
            const customerInvoice = _.find(vm.packingSlip.customerInvTrackNumber, (obj) => (vm.trackingNumberDet.tempID && obj.tempID === vm.trackingNumberDet.tempID));
            if (customerInvoice) {
              customerInvoice.oldTrackNumber = customerInvoice.trackNumber;
              customerInvoice.trackNumber = vm.trackingNumberDet.trackNumber;
              customerInvoice.isRequiredToUpdate = true;
              vm.packingSlip.trackingNumberChanged = true;
              trackControl = _.find(vm.frmCustomerInvoice.$$controls, (ctrl) => ctrl.$name === 'trackNumberChanged');
              trackControl.$setDirty();
            } else {
              vm.packingSlip.customerInvTrackNumber.push({
                trackNumber: vm.trackingNumberDet.trackNumber,
                refCustPackingSlipID: vm.custPackingSlipID || null,
                tempID: (vm.packingSlip.customerInvTrackNumber.length + 1),
                isNewFromInv: true // case when tracking number added from invoice also add in packing slip for first time saving invoice
              });
              vm.packingSlip.trackingNumberChanged = true;
              trackControl = _.find(vm.frmCustomerInvoice.$$controls, (ctrl) => ctrl.$name === 'trackNumberChanged');
              trackControl.$setDirty();
            }
            vm.resetCustInvTrackingNumberObj();
            setFocus('trackingNumber');
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, 'Tracking# ' + vm.trackingNumberDet.trackNumber);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.isDisableTrackNumber = false;
              vm.resetCustInvTrackingNumberObj();
              setFocus('trackingNumber');
            });
          }
        });
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(event);
      }
    };

    /** Remove track number from list */
    vm.removeTrackNumber = (item, index) => {
      vm.packingSlip.removeCustomerInvTrackNumberIds = vm.packingSlip.removeCustomerInvTrackNumberIds || [];
      vm.packingSlip.removeCustomerInvTrackNumbers = vm.packingSlip.removeCustomerInvTrackNumbers || [];
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Customer Invoice Tracking#', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.frmCustomerInvoice.$setDirty(true);
            vm.packingSlip.trackingNumberChanged = true;
            const trackControl = _.find(vm.frmCustomerInvoice.$$controls, (ctrl) => ctrl.$name === 'trackNumberChanged');
            trackControl.$setDirty();
            if (item.id > 0) {
              vm.packingSlip.removeCustomerInvTrackNumberIds.push(item.id);
              vm.packingSlip.removeCustomerInvTrackNumbers.push(item.trackNumber);
            }

            vm.packingSlip.customerInvTrackNumber.splice(index, 1);
            const numberIndex = _.findIndex(vm.packingSlip.customerInvTrackNumber, (obj) => obj.trackNumber === item.trackNumber);
            $timeout(() => {
              if (numberIndex === -1) {
                vm.frmCustomerInvoice.trackingNumber.$setValidity('duplicate', true);
              }
            });
            _.each(vm.packingSlip.customerInvTrackNumber, (item, index) => {
              item.tempID = (index + 1);
            });
            setFocus('trackingNumber');
          }
        }, () => {
          setFocus('trackingNumber');
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /** Edit track number */
    vm.editTrackingNumber = (item) => {
      if (vm.packingSlip && vm.packingSlip.refCustInvoiceID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVOICE_ALREADY_CREATED);
        messageContent.message = stringFormat(messageContent.message, vm.packingSlip.packingSlipNumber);
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          vm.resetCustInvTrackingNumberObj();
          vm.frmCustomerInvoice.$setPristine();
          getCustomerInvoiceDetail();
        });
        return;
      } else {
        vm.trackingNumberDet = angular.copy(item);
        focusonField('trackingNumber');
      }
    };

    /** Set/Remove duplicate validation if track number is duplicate */
    vm.checkUniqueTrackNumber = () => {
      const checkDuplicate = _.find(vm.packingSlip.customerInvTrackNumber, (obj) => obj.tempID !== vm.trackingNumberDet.tempID && obj.trackNumber === vm.trackingNumberDet.trackNumber);
      if (checkDuplicate) {
        //$scope.$applyAsync(() => {
        //  vm.frmCustomerInvoice.trackingNumber.$setValidity('duplicate', false);
        //});
        return false;
      }
      vm.frmCustomerInvoice.trackingNumber.$setValidity('duplicate', true);
      return true;
    };
    // get line level other charges after save
    const getLineLevelOtherChargesByDetailId = (detId) => CustomerPackingSlipFactory.getCustomerOtherExpenseByDetailId().query({ detId }).$promise.then((resData) => {
      vm.expandableJS();
      return $q.resolve(resData.data.otherDetail);
    });


    //open sales order other charges
    vm.viewOtherCharges = (row, ev) => {
      // let objEntity;
      row.entity.SalesOtherDetail = row.entity.OtherDetList;
      const objEntity = _.clone(row.entity);
      objEntity.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, row.entity.rohsIcon);
      objEntity.isDisable = (vm.isDisableInvEntry);
      objEntity.isFromCustInv = true;
      objEntity.invoiceType = !vm.packingSlip.invoiceType;
      objEntity.salesFilterDet = [...vm.salesFilterDet];
      objEntity.salesOtherFilterDet = [];
      objEntity.sourceData = [...vm.sourceData];
      DialogFactory.dialogService(
        CORE.SALESORDER_OTHER_EXPENSE_MODAL_CONTROLLER,
        CORE.SALESORDER_OTHER_EXPENSE_MODAL_VIEW,
        ev,
        objEntity).then(() => {
        }, (data) => {
          if (data && data.isDirty) {
            const otherChargeTotal = (_.sumBy(data.otherDetails, (o) => (parseInt(o.qty || 0) * parseFloat(o.price || 0))) || 0);
            _.each(data.otherDetails, (dtl) => {
              dtl.extOtherPrice = dtl.extPrice;
              dtl.reflineID = row.entity.packingSlipSerialNumber;
            });
            // get deleted Ids
            if (data.otherDetails && row.entity.OtherDetList && data.otherDetails.length < row.entity.OtherDetList.length) {
              _.each(row.entity.OtherDetList, (rowItem) => {
                if (!_.find(data.otherDetails, (item) => item.id === rowItem.id)) {
                  row.entity.removeOtherChargesIds.push(rowItem);
                }
              });
            }
            _.each(data.otherDetails, (item) => {
              item.refCustomerPackingSlipDetID = row.entity.id;
            });
            row.entity.OtherDetList = data.otherDetails || [];
            row.entity.lineOtherCharges = otherChargeTotal.toFixed(2);
            row.entity.totalExtPrice = row.entity.extendedPrice + otherChargeTotal;
            if (vm.subGridgridOptions && vm.subGridgridOptions.data) {
              vm.subGridgridOptions.data = row.entity.OtherDetList;
            }
            // if (vm.packingSlip.packingSlipType === 3 || vm.packingSlip.packingSlipType === 1 || vm.isCreditNote) {
            const otherDetails = row.entity.OtherDetList; // _.flatten(_.map(vm.sourceData, (item) => item.OtherDetList));
            const otherChargesDeleteIds = row.entity.removeOtherChargesIds; // _.flatten(_.map(vm.sourceData, (item) => item.removeOtherChargesIds));
            // }
            const detailData = [{
              detId: row.entity.id,
              reflineID: row.entity.packingSlipSerialNumber,
              refSalesorderDetId: row.entity.refSalesorderDetid
            }];
            detailOfCharges();
            const objCustomerInvoice = {
              detailData: detailData,
              otherChargeDetail: otherDetails,
              removeOtherChargesIds: otherChargesDeleteIds,
              invoiceId: vm.packingSlip.id,
              totalAmount: vm.packingSlip.totalExtendedPrice,
              revision: vm.packingSlip.revision
            };
            const checkForStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT);
            const newRevision = (parseInt(vm.packingSlip.revision || 0) + 1) < 10 ? stringFormat('0{0}', (parseInt(vm.packingSlip.revision || 0) + 1)) : (parseInt(vm.packingSlip.revision || 0) + 1).toString();
            if (vm.custInvoiceID && vm.packingSlip.subStatus !== checkForStatus) {
              const pageName = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Customer Invoice' : 'Customer Credit Memo';
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, pageName, vm.packingSlip.revision, newRevision);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.packingSlip.revision = parseInt(vm.packingSlip.revision || 0) + 1;
                  objCustomerInvoice.revision = vm.packingSlip.revision;
                  saveOtherCharges(row, objCustomerInvoice);
                }
              }, () => {
                saveOtherCharges(row, objCustomerInvoice);
                // return;
              }).catch((error) => BaseService.getErrorLog(error));
            } else { // if only status change then no confirmation
              saveOtherCharges(row, objCustomerInvoice);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    // save other charges after revision confirmation
    const saveOtherCharges = (row, objCustomerInvoice) => {
      // calculate isAskForVersionConfirmation value while change in detail in draft mode (second time).
      const draftStatusId = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT;
      const isAskForVersionConfirmation = vm.packingSlip.isAlreadyPublished && vm.packingSlip.subStatus === draftStatusId && !vm.isStatusChange ? true : false;
      objCustomerInvoice.isAskForVersionConfirmation = isAskForVersionConfirmation;
      vm.packingSlip.isAskForVersionConfirmation = isAskForVersionConfirmation;
      vm.cgBusyLoading = CustomerPackingSlipFactory.saveOtherChargesDetailInInvoiceDetail().query(objCustomerInvoice).$promise.then((resSave) => {
        detailOfCharges();
        $q.all([getLineLevelOtherChargesByDetailId(row.entity.id)]).then((resData) => {
          row.entity.OtherDetList = resData[0];
        });
        if (resSave) {
          vm.packingSlip.revision = resSave.data[0];
        }
        vm.isInvoiceDetailChanged = true;
      });
    };


    /* to display shipping comments */
    vm.showShippingComments = (row, ev) => {
      const popupData = {
        title: 'Line Shipping Comments',
        description: row.entity.shippingNotes
      };
      showDescription(popupData, ev);
    };

    const showDescription = (popupData, ev) => {
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* to display internal notes */
    vm.showInternalNotes = (row, ev) => {
      const popupData = {
        title: 'Line Internal Notes',
        description: row.entity.internalComment
      };
      showDescription(popupData, ev);
    };

    /* to display Release notes */
    vm.showReleaseNotes = (row, ev) => {
      const popupData = {
        title: vm.LabelConstant.CustomerPackingSlip.ReleaseNotes,
        description: row.entity.releaseNotes
      };
      showDescription(popupData, ev);
    };

    vm.showAssyDescription = (row, ev) => {
      const popupData = {
        title: 'Description',
        description: row.entity.assyDescription
      };
      showDescription(popupData, ev);
    };

    vm.checkUniqueCreditMemoNumber = () => {
      if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE && vm.packingSlip.creditMemoNumber) {
        vm.cgBusyLoading = CustomerPackingSlipFactory.checkUniqueCreditMemoNumber().query({ creditMemoNumber: vm.packingSlip.creditMemoNumber }).$promise.then((res) => {
          if (res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                vm.packingSlip.creditMemoNumber = '';
                setFocusByName('creditMemoNumber');
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // common error code
    let isopenpopup = false;
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

    //check unique customer po line
    vm.checkCustomerPOLine = () => {
      const checkUnique = _.find(vm.sourceData, (item) => item.custPOLineID === vm.invoiceDetail.custPOLineID && vm.invoiceDetail.id !== item.id);
      if (checkUnique) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'Cust PO Line#');
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            // vm.isopenpop = false;
            vm.invoiceDetail.custPOLineID = null;
            setFocus('custPOLine');
          }
        }).catch(() => BaseService.getErrorLog(error));
      }
    };
    // check  for unique ref. debit memo number in case of credit memo
    vm.checkUniqueRefDebitMemoNumber = () => CustomerPackingSlipFactory.checkUniqueRefDebitMemoNumber().query({ refDebitMemoNumber: vm.packingSlip.refDebitMemoNumber, id: vm.packingSlip.id, customerId: vm.packingSlip.customerID }).$promise.then((res) => {
      if (res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_REF_DEBIT_NUM_UNIQUE_PER_CUSTOMER);
        messageContent.message = stringFormat(messageContent.message, vm.packingSlip.refDebitMemoNumber, vm.packingSlip.customerName);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          setFocusByName('refDebitMemoNumber');
        });
        return $q.resolve(false);
        //});
      } else {
        return $q.resolve(true);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //get selected turn time
    const getSelectedturnTime = (item) => {
      vm.invoiceDetail.refRFQQtyTurnTimeID = item ? item.id : null;
      vm.invoiceDetail.qtyTurnTime = item ? item.qtyTurnTime : null;
      if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length && item && item.id) {
        const selectedTurnTime = _.find(vm.quoteQtyTurnTimeDetails, (a) => a.id === item.id);
        if (selectedTurnTime) {
          vm.autocompleteQtyTurnTime.keyColumnId = item.id;
          $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, selectedTurnTime);
          if (!vm.invoiceDetail.unitPrice) {
            vm.invoiceDetail.unitPrice = item.unitPrice;
            //vm.changePrice();
            vm.getSalesCommissionDetailsOnPriceChange();
          }
        }
        if (!vm.invoiceDetail.id) {
          vm.invoiceDetail.unitPrice = item && item.unitPrice ? item.unitPrice : null;
          // vm.changeQty(null, vm.qtyType.POQTY, unitPrice);
          vm.getSalesCommissionDetailsOnPriceChange();
        }
      }
      //if (!item && vm.invoiceDetail && vm.invoiceDetail.id && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
      //  getQtyTurnTimeByAssyId(vm.invoiceDetail.partId);
      //}
    };

    const getQtyTurnTimeByAssyId = (id, lineId) => {
      if (id || vm.autocompleteAssy.keyColumnId) {
        vm.cgBusyLoading = SalesOrderFactory.getQtyandTurnTimeDetailByAssyId().query({
          partID: id || vm.autocompleteAssy.keyColumnId,
          lineId: lineId || null
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            if (response.data.length > 0) {
              vm.quoteQtyTurnTimeDetails = [];
              if (_.first(response.data).quoteValidTillDate && !vm.invoiceDetail.id && (new Date(_.first(response.data).quoteValidTillDate).setHours(0, 0, 0, 0)) < new Date(BaseService.getCurrentDate()).setHours(0, 0, 0, 0)) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.QUOTE_EXPIRE_VALIDATION);
                messageContent.message = stringFormat(messageContent.message, _.first(response.data).rfqNumber, BaseService.getUIFormatedDate(_.first(response.data).quoteValidTillDate, vm.DefaultDateFormat));
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                return DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    commonQuoteConfirmation(response);
                  }
                }, () => {
                  setFocus('fromPartMaster');
                });
              }
              else {
                commonQuoteConfirmation(response);
              }
            } else {
              commonQuoteConfirmation(response);
            }
          }
          return vm.quoteQtyTurnTimeDetails;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // common details
    const commonQuoteConfirmation = (response) => {
      vm.invoiceDetail.quoteNumber = _.first(response.data).rfqNumber;
      vm.quoteQtyTurnTimeList = response.data;
      setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
      //setFocusByName(vm.autocompleteQtyTurnTime.inputName);
      setFocus('shipQty');
      if (vm.autocompleteQtyTurnTime && vm.invoiceDetail && vm.invoiceDetail.refRFQQtyTurnTimeID) {
        vm.autocompleteQtyTurnTime.keyColumnId = vm.invoiceDetail.refRFQQtyTurnTimeID;
      }
    };
    //Change of QuoteFrom
    vm.onChangeQuoteFrom = (id) => {
      // first if will be used in case sales comission need to  be implemented
      //vm.invoiceDetail.unitPrice = null;
      //vm.invoiceDetail.shipQty = null;
      //vm.autoCompleteQuoteGroup.keyColumnId = null;
      if ((vm.invoiceDetail && vm.invoiceDetail.salesCommissionList && vm.invoiceDetail.salesCommissionList.length > 0) &&
        (vm.invoiceDetail.isCommissionDataEdited ||
          (vm.invoiceDetail.id > 0 && vm.invoiceDetail.salesCommissionList.length > 0))) {
        changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteFrom);
      }
      else {
        if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.NA.id && !vm.invoiceType) {
          vm.invoiceDetail.shipQty = null;
        }
        vm.changeSalesCommissionFromPartOrRFQ(id);
      }
    };

    vm.changeSalesCommissionFromPartOrRFQ = (id) => {
      vm.autocompleteQtyTurnTime.keyColumnId = null;
      vm.invoiceDetail.quoteNumber = null;
      switch (vm.invoiceDetail.quoteFrom) {
        case vm.salesCommissionFrom.FromPartMaster.id:
        case vm.salesCommissionFrom.NA.id:
          {
            if (id || vm.invoiceDetail.partId) {
              //$scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
              //$scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
              if (vm.autoCompleteQuoteGroup) {
                // vm.autoCompleteQuoteGroup.keyColumnId = null;
                $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
                $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
              }
              if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                getQtyTurnTimeByAssyId(id || vm.autocompleteAssy.keyColumnId);
              }
            }
            vm.invoiceDetail.refRFQGroupID = null;
          }
          break;
        case vm.salesCommissionFrom.FromRFQ.id:
          {
            if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
              vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
              vm.invoiceDetail.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
            }
            else if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && (id || vm.autocompleteAssy.keyColumnId)) {
              getrfqQuoteGroupList(id || vm.autocompleteAssy.keyColumnId);
            }
            if (vm.autoCompleteQuoteGroup.keyColumnId && (id || vm.autocompleteAssy.keyColumnId)) {
              getrfqQuoteQtyTurnTimeList(vm.autoCompleteQuoteGroup.keyColumnId, (id || vm.autocompleteAssy.keyColumnId));
            }
          }
          break;
      };
      //if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.NA.id) {
      //  vm.changeQty(event, vm.qtyType.POQTY);
      //}
    };

    // check export control country validation
    const validateAssemblyByAssyID = (dataArray, checkAllDetail) => {
      const checkShippingAssyList = [];
      if (checkAllDetail) {
        _.each(vm.sourceData, (item) => {
          const shippingCountryDetObj = {};
          shippingCountryDetObj.partID = item ? item.partId : null;
          shippingCountryDetObj.countryID = vm.IntermediateAddress && vm.IntermediateAddress.countryID ? vm.IntermediateAddress.countryID : vm.ShippingAddress && vm.ShippingAddress.countryID ? vm.ShippingAddress.countryID : 0;
          shippingCountryDetObj.countryName = vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress && vm.ShippingAddress.countryMst ? vm.ShippingAddress.countryMst.countryName : '';
          shippingCountryDetObj.qty = item ? item.shipQty : 0;
          shippingCountryDetObj.lineID = 0;
          dataArray.push(item.partId);
          checkShippingAssyList.push(shippingCountryDetObj);
        });
      } else {
        const shippingCountryDetObj = {};
        shippingCountryDetObj.partID = vm.invoiceDetail.partId;
        shippingCountryDetObj.countryID = vm.IntermediateAddress && vm.IntermediateAddress.countryID ? vm.IntermediateAddress.countryID : vm.ShippingAddress && vm.ShippingAddress.countryID ? vm.ShippingAddress.countryID : 0;
        shippingCountryDetObj.countryName = vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress && vm.ShippingAddress.countryMst ? vm.ShippingAddress.countryMst.countryName : '';
        shippingCountryDetObj.qty = vm.invoiceDetail.shipQty - (vm.shippTotal ? vm.shippTotal : 0);
        shippingCountryDetObj.lineID = 0;
        checkShippingAssyList.push(shippingCountryDetObj);
      };
      const objCheckBOM = {
        partIDs: dataArray,
        shippingAddressID: vm.IntermediateAddress && vm.IntermediateAddress.id ? vm.IntermediateAddress.id : vm.ShippingAddress ? vm.ShippingAddress.id : null,
        isFromSalesOrder: true,
        checkShippingAssyList: checkShippingAssyList,
        transType: 'I'
      };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkInvoiceCountryValidation = (ev, checkAllDetail) => {
      let promise;
      if (checkAllDetail) {
        promise = [validateAssemblyByAssyID([], checkAllDetail)];
      } else {
        promise = [validateAssemblyByAssyID([vm.invoiceDetail.partId], checkAllDetail)];
      }
      return $q.all(promise).then((resData) => {
        resData = _.first(resData);
        if (resData.errorObjList && resData.errorObjList.length > 0) {
          //const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
          //if (errorMessage) {
          //  const obj = {
          //    multiple: true,
          //    title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          //    textContent: errorMessage
          //  };
          //  DialogFactory.alertDialog(obj);
          //  return $q.resolve(false);
          //}
          const errorMsg = _.find(resData.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
          if (errorMsg) {
            const assyInvalidShippingList = [];
            _.each(resData.exportControlPartList, (partItem) => {
              let objAssy = {};
              const detItem = _.find(vm.sourceData, (item) => item.partId === partItem.partID);
              objAssy = _.assign(partItem);
              if (detItem) {
                objAssy.PIDCode = detItem.PIDCode;
                objAssy.partID = detItem.partId;
                objAssy.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, detItem.rohsIcon);
                objAssy.rohsText = detItem.rohsName;
                objAssy.mfgPN = detItem.mfgpn;
                objAssy.nickName = detItem.nickName;
                objAssy.description = detItem.assyDescription;
                objAssy.isCustom = detItem.isCustom;
                objAssy.lineID = detItem.packingSlipSerialNumber;
                if (detItem.partType === vm.partCategoryConst.Component) {
                  if (detItem.isCustom) {
                    objAssy.partTypeText = 'Custom Part';
                  } else {
                    objAssy.partTypeText = 'Off-the-shelf Part';
                  }
                }
                if (detItem.isCPN) {
                  objAssy.partTypeText = 'CPN Part';
                }
                if (detItem.partType === vm.partCategoryConst.SubAssembly) {
                  objAssy.partTypeText = 'Assembly';
                }
                objAssy.componentStandardList = detItem.componentStandardList;
              } else {
                objAssy.PIDCode = vm.invoiceDetail.assyID;
                objAssy.partID = vm.invoiceDetail.partId;
                objAssy.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, vm.invoiceDetail.rohsIcon);
                objAssy.rohsText = vm.invoiceDetail.rohsName;
                objAssy.mfgPN = vm.invoiceDetail.assyNumber;
                objAssy.nickName = vm.invoiceDetail.nickName;
                objAssy.description = vm.invoiceDetail.assyDescription;
                objAssy.isCustom = vm.invoiceDetail.isCustom;
                objAssy.lineID = vm.invoiceDetail.packingSlipSerialNumber;
                if (vm.invoiceDetail.partType === vm.partCategoryConst.Component) {
                  if (vm.invoiceDetail.isCustom) {
                    objAssy.partTypeText = 'Custom Part';
                  } else {
                    objAssy.partTypeText = 'Off-the-shelf Part';
                  }
                }
                if (vm.invoiceDetail.isCPN) {
                  objAssy.partTypeText = 'CPN Part';
                }
                if (vm.invoiceDetail.partType === vm.partCategoryConst.SubAssembly) {
                  objAssy.partTypeText = 'Assembly';
                }
                objAssy.componentStandardList = vm.invoiceDetail.componentStandardList;
              }
              assyInvalidShippingList.push(objAssy);
            });
            if (assyInvalidShippingList.length > 0) {
              // vm.packingSlip.status = CORE.CustomerPackingSlipStatusID.Draft;
              const data = {
                assyList: assyInvalidShippingList,
                CustomerPackingSlipNumber: vm.packingSlip.packingSlipNumber,
                errorMessage: errorMsg.errorText,
                invoiceNumber: vm.packingSlip.invoiceNumber,
                invoiceId: vm.custInvoiceID,
                revision: null,
                countryName: vm.IntermediateAddress && vm.IntermediateAddress.countryMst && vm.IntermediateAddress.countryMst.countryName ? vm.IntermediateAddress.countryMst.countryName : vm.ShippingAddress.countryMst.countryName,
                transType: 'I'
              };
              DialogFactory.dialogService(
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                event,
                data).then(() => {
                }, () => {
                }, (err) => BaseService.getErrorLog(err));
              return $q.resolve(false);
            } else {
              return $q.resolve(true);
              // saveCustomerPackingSlipDetails(ev, requiredDet);
            }
          }
        } else {
          return $q.resolve(true);
          // saveCustomerPackingSlipDetails(ev, requiredDet);
        }
      });
    };


    // get details of selected quote group
    const getSelectedquoteGroup = (item) => {
      vm.invoiceDetail.refRFQGroupID = item ? item.rfqrefID : null;
      vm.invoiceDetail.quoteNumber = item && item.quoteNumber ? item.quoteNumber : null;
      vm.invoiceDetail.rfqAssyID = item && item.rfqAssyID ? item.rfqAssyID : null;
      if (item) {
        getrfqQuoteQtyTurnTimeList(item.rfqrefID, item.partID);
        // vm.changeSalesCommissionFromPartOrRFQ
      } else {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
        vm.invoiceDetail.refRFQGroupID = null;
      }
    };

    const changeConfirmation = (changeType) => {
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
          if (!vm.invoiceDetail.deletedComissionIds) {
            vm.invoiceDetail.deletedComissionIds = [];
          }
          /*maintain delted ids only for saved rows, no need to maintain deleted ids for newly added rows*/
          if (vm.invoiceDetail.id > 0) {
            _.map(vm.invoiceDetail.salesCommissionList, (dataRow) => {
              /*maintain saved commission row ids, no need to maintain for unsaved rows*/
              if (dataRow.id > 0) {
                vm.invoiceDetail.deletedComissionIds.push(dataRow.id);
                // { id: dataRow.id, refSalesorderdetID: dataRow.refSalesorderdetID });
              }
            });
          }

          vm.invoiceDetail.isCommissionDataEdited = false;
          vm.invoiceDetail.salesCommissionList = [];
          // vm.getSalesCommissionDetailsOnPriceChange();

          switch (changeType.id) {
            case TRANSACTION.OnChangeCommissionType.assyId.id:
              vm.invoiceDetail.unitPrice = null;
              vm.invoiceDetail.shipQty = null;
              setAssymblyDetails();
              setFocusByName(vm.autocompleteAssy.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.quoteFrom.id:
              vm.invoiceDetail.unitPrice = null;
              vm.invoiceDetail.shipQty = null;
              vm.invoiceDetail.extendedPrice = null;
              // vm.invoiceDetail.refRFQGroupID = null;
              if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.NA.id) {
                vm.invoiceDetail.quoteNumber = null;
              }
              if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.FromPartMaster.id) {
                if (vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId) {
                  vm.autocompleteQtyTurnTime.keyColumnId = null;
                  $timeout(() => {
                    $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
                  });
                }
              }
              if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.FromRFQ.id) {
                if (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId) {
                  vm.autoCompleteQuoteGroup.keyColumnId = null;
                  $timeout(() => {
                    $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
                  });
                  //$scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
                }
              }
              if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                getQtyTurnTimeByAssyId(vm.autocompleteAssy.keyColumnId);
              }
              if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.invoiceDetail.partId && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
                getrfqQuoteGroupList(vm.invoiceDetail.partId);
              }
              setFocusByName('quoteFrom');
              break;
            case TRANSACTION.OnChangeCommissionType.quoteGroup.id:
              vm.autocompleteQtyTurnTime.keyColumnId = null;
              vm.invoiceDetail.quoteNumber = null;
              vm.invoiceDetail.unitPrice = null;
              vm.invoiceDetail.extendedPrice = null;
              // vm.changePrice();
              setFocusByName(vm.autoCompleteQuoteGroup.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.shipQty.id:
              //vm.invoiceDetail.shipQty = vm.invoiceDetailCopy && vm.invoiceDetailCopy.shipqty ? vm.invoiceDetailCopy.shipqty : vm.invoiceDetail.shipQty;
              setFocusByName('shipQty');
              break;
            case TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime.id:
              // below line commented case : MISC PS invoice,  open record in update change turn time value , it will null unit price
              vm.invoiceDetail.unitPrice = null;
              setFocusByName(vm.autocompleteQtyTurnTime.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.price.id:
              // vm.changePrice();
              vm.getSalesCommissionDetailsOnPriceChange();
              setFocusByName('isSkipKitCreation');
              break;
          }
        }
      }, () => {
        switch (changeType.id) {
          case TRANSACTION.OnChangeCommissionType.assyId.id:
            vm.isAssyChange_No_OptionSelected = true;
            vm.autocompleteAssy.keyColumnId = vm.invoiceDetailCopy.partID;
            getcomponentAssemblyList({
              partID: vm.invoiceDetailCopy.partID
            });
            setFocusByName(vm.autocompleteAssy.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.quoteFrom.id:
            vm.invoiceDetail.quoteFrom = vm.invoiceDetailCopy.quoteFrom;
            vm.invoiceDetail.quoteNumber = vm.invoiceDetailCopy.quoteNumber;
            vm.invoiceDetail.refRFQGroupID = vm.invoiceDetailCopy.refRFQGroupID;
            setFocusByName('quoteFrom');
            break;
          case TRANSACTION.OnChangeCommissionType.quoteGroup.id:
            vm.autoCompleteQuoteGroup.keyColumnId = vm.invoiceDetail.refRFQGroupID;
            setFocusByName(vm.autoCompleteQuoteGroup.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.shipQty.id:
            vm.invoiceDetail.shipQty = vm.invoiceDetailCopy && vm.invoiceDetailCopy.shipQty ? vm.invoiceDetailCopy.shipQty : vm.invoiceDetail.shipQty;
            setFocusByName('shipQty');
            break;
          case TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime.id:
            vm.isQtyTurnTime_No_OptionSelected = true;
            vm.autocompleteQtyTurnTime.keyColumnId = vm.invoiceDetailCopy.refRFQQtyTurnTimeID;
            setFocusByName(vm.autocompleteQtyTurnTime.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.price.id:
            vm.invoiceDetail.price = vm.invoiceDetailCopy.price ? parseFloat(vm.invoiceDetailCopy.price) : 0;
            setFocusByName('price');
            break;
        }
      });
    };
    // Check  for unique Quote# in case fromRFQ and Quote# added manualy
    vm.checkRFQQuoteNumberUnique = () => {
      if (vm.invoiceDetail.quoteNumber && !vm.autoCompleteQuoteGroup.keyColumnId) {
        SalesOrderFactory.checkRFQQuoteNumberUnique().query({ quoteNumber: vm.invoiceDetail.quoteNumber }).$promise.then((response) => {
          if (response && response.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Quote#');
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.invoiceDetail.quoteNumber = null;
                setFocus('quoteNumber');
              }
            }).catch(() => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //open popup to view and update sales commission
    vm.goToSalesCommission = (row, event, isGetNewCommission) => {
      const invoiceSalesCommTo = _.find(vm.SalesCommissionEmployeeList, (item) => item.id === vm.autoCompleteSalesCommosssionTo.keyColumnId);
      _.map(row.salesCommissionList, (d) => {
        if (d.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
          d.unitPrice = parseFloat(row.unitPrice || d.unitPrice);
          d.commissionValue = roundUpNum((((100 / (100 + parseFloat(d.commissionPercentage))) * d.unitPrice) * parseFloat(d.commissionPercentage) / 100), _unitPriceFilterDecimal);
        }
        d.extendedCommissionValue = multipleUnitValue(d.commissionValue, row.shipQty, _amountFilterDecimal);
        d.extendedQuotedCommissionValue = multipleUnitValue(d.quoted_commissionValue, d.quotedQty, _amountFilterDecimal);
        d.qty = row.shipQty;
        d.fieldName = d.commissionCalculateFrom === TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.ID ? TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.FIELDNAME : d.commissionCalculateFrom === TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID ? TRANSACTION.SO_COMMISSION_ATTR.RFQ.FIELDNAME : TRANSACTION.SO_COMMISSION_ATTR.MISC.FIELDNAME;
        d.typeName = d.type === TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.ID ? TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.COMMISSIONCALCULATEDFROM : d.type === TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID ? TRANSACTION.SO_COMMISSION_ATTR.RFQ.COMMISSIONCALCULATEDFROM : TRANSACTION.SO_COMMISSION_ATTR.MISC.COMMISSIONCALCULATEDFROM;
      });
      //let qtyTurnTimeText;
      //if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
      //  // quoteFromText = vm.salesCommissionFrom.FromPartMaster.value;
      //  qtyTurnTimeText = vm.invoiceDetail.qtyTurnTime;
      //} else if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
      //  // quoteFromText = vm.salesCommissionFrom.FromRFQ.value;
      //  qtyTurnTimeText = vm.invoiceDetail.qtyTurnTime;
      //}
      const dataObj = {
        refDetId: isGetNewCommission ? null : row.id,
        qty: row.shipQty,
        partID: row.partId,
        invoiceNumber: vm.packingSlip.invoiceNumber,
        rohsIcon: vm.rohsImagePath + row.rohsIcon,
        rohsComplientConvertedValue: row.rohsName,
        mfgPN: row.mfgpn,
        PIDCode: row.PIDCode,
        salesCommissionTo: invoiceSalesCommTo ? invoiceSalesCommTo.id : vm.packingSlip.salesCommissionTo,
        salesCommissionToName: invoiceSalesCommTo ? invoiceSalesCommTo.name : vm.packingSlip.salesCommName,
        quoteGroup: row.refRFQGroupID,
        quoteTurnTime: row.assyQtyTurnTimeText,
        salesCommissionList: row.salesCommissionList ? angular.copy(row.salesCommissionList) : [],
        transType: vm.transType,
        refId: vm.packingSlip.id,
        isAssembly: vm.invoiceDetail.isMISCAssemblyType,
        poNumber: vm.packingSlip.poNumber,
        soId: vm.packingSlip.refSalesOrderId,
        isDisableSalesComm: vm.isDisableInvEntry || vm.recordView,
        revision: vm.packingSlip.revision,
        subStatus: vm.packingSlip.subStatus,
        quoteNumber: row.quoteNumber,
        rfqAssyID: row.salesCommissionList && row.salesCommissionList.length > 0 ? row.salesCommissionList[0].rfqAssyID : null
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_SALES_MASTER_COMMISSION_CONTROLLER,
        TRANSACTION.TRANSACTION_SALES_MASTER_COMMISSION_VIEW,
        event,
        dataObj).then(() => {
        }, (data) => {
          if (data) {
            if (data.isSaved) {
              // vm.addNewParentRow(_.clone(row), true);
              // const rowIndex = _.findIndex(vm.sourceData, (det) => det.id === row.refId).index;
              // vm.sourceData.splice(rowIndex, 1);
              // vm.sourceData.splice(rowIndex, 0, row);
              const filter = _.find(data.data, (commn) => commn.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID);
              if (filter) {
                row.unitPrice = parseFloat(filter.unitPrice);
                row.extendedPrice = multipleUnitValue(row.shipQty, row.unitPrice);
              }
              _.each(data.data, (item) => {
                item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
                if (item.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
                  item.extendedQuotedCommissionValue = multipleUnitValue(item.quoted_commissionValue, row.quotedQty, _amountFilterDecimal);
                  item.extendedCommissionValue = multipleUnitValue(item.commissionValue, row.shipQty, _amountFilterDecimal);
                  item.quoted_commissionPercentageDisplay = parseFloat(item.quoted_commissionPercentage).toFixed(_amountFilterDecimal);
                  item.quoted_commissionValueDisplay = $filter('unitPrice')(item.quoted_commissionValue);
                  item.extendedQuotedCommissionValueDisplay = $filter('amount')(item.extendedQuotedCommissionValue);
                  item.quoted_unitPriceDisplay = $filter('amount')(item.quoted_unitPrice);
                }
              });
              row.salesCommissionList = data && data.data ? data.data : [];
              vm.packingSlip.revision = data.revision;
            }
            else {
              const filter = _.find(data.salesCommissionList, (commn) => commn.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID);
              if (filter) {
                row.unitPrice = parseFloat(filter.unitPrice);
                row.extendedPrice = multipleUnitValue(row.shipQty, row.unitPrice);
              }
              row.isCommissionDataEdited = true;
              vm.isInvoiceDetailChanged = true;
              row.salesCommissionList = data.salesCommissionList;
              if (!row.deletedComissionIds) {
                row.deletedComissionIds = [];
              }
              row.deletedComissionIds = row.deletedComissionIds.concat(data.salesCommissionDeltedIds);
              vm.invoiceDetailCopy = _.clone(row);
              vm.packingSlip.revision = data.revision;
              vm.invoiceDetailForm.$setDirty();
              setFocusByName('btnSalesCommisson');
            }
          }
          else {
            setFocusByName('btnSalesCommisson');
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    const getrfqQuoteQtyTurnTimeList = (groupId, partID) => {
      const detailObj = { partID: partID || vm.autocompleteAssy.keyColumnId, rfqQuoteGroupID: groupId || vm.autoCompleteQuoteGroup.keyColumnId };
      if (detailObj.partID && detailObj.rfqQuoteGroupID) {
        return SalesOrderFactory.getRfqQtyandTurnTimeDetail().query(detailObj).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            vm.quoteQtyTurnTimeList = response.data;
            setQtyTurnTimeValue(response.data);
          }
          if (vm.autocompleteQtyTurnTime && vm.invoiceDetail && vm.invoiceDetail.refRFQQtyTurnTimeID) {
            vm.autocompleteQtyTurnTime.keyColumnId = vm.invoiceDetail.refRFQQtyTurnTimeID;
          }
          return vm.quoteQtyTurnTimeDetails;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return [];
      }
    };
    // get sales commission details
    vm.getSalesCommissionDetailsOnPriceChange = () => {
      if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.NA.id &&
        vm.invoiceDetail.partId && vm.invoiceDetail.shipQty &&
        vm.autocompleteQtyTurnTime.keyColumnId && vm.invoiceDetail.unitPrice) {
        vm.invoiceDetail.oldUnitPrice = vm.invoiceDetail.unitPrice; // this will be is used  while adding new part  user change auto fetched price
        const obj = {
          salesDetId: null,
          partID: vm.invoiceDetail.partId,
          quoteFrom: vm.invoiceDetail.quoteFrom,
          quoteGroupId: vm.invoiceDetail.refRFQGroupID || null,
          quoteNumber: vm.invoiceDetail.quoteNumber || null,
          poQty: vm.invoiceDetail.shipQty || null,
          turnTimeID: vm.autocompleteQtyTurnTime.keyColumnId || null,
          price: vm.invoiceDetail.unitPrice || null,
          transType: vm.transType,
          refCustPackingSlipDetId: (!vm.invoiceDetail.id) ? null : ((vm.invoiceDetail.unitPrice !== vm.invoiceDetailCopy.unitPrice || vm.invoiceDetail.quoteFrom !== vm.invoiceDetailCopy.quoteFrom) ? null : vm.invoiceDetail.id) //vm.packingSlip.invoiceType ? null : (vm.invoiceDetail.id || null)
        };
        vm.cgBusyLoading = SalesOrderFactory.getSalesCommissionDetails().query(obj).$promise.then((sales) => {
          if (sales && sales.data) {
            if (vm.salesCommissionFrom.FromRFQ.id === vm.invoiceDetail.quoteFrom) {
              let sumCommission = _.sumBy((sales.data), (o) => parseFloat(o.commissionValue));
              if (sumCommission > (vm.invoiceDetail.unitPrice / 2)) {
                sumCommission = (vm.invoiceDetail.unitPrice / 2);
              }
              const commissionPercentage = roundUpNum(((parseFloat(vm.invoiceDetail.unitPrice.toFixed(2)) - (parseFloat(vm.invoiceDetail.unitPrice.toFixed(2)) - sumCommission)) * 100 / (parseFloat(vm.invoiceDetail.unitPrice.toFixed(2)) - sumCommission)), _amountFilterDecimal);
              const qtyObj = _.find(vm.quoteQtyTurnTimeDetails, (quoteQty) => quoteQty.id === vm.autocompleteQtyTurnTime.keyColumnId);
              const sumActualCommission = parseFloat(sumCommission.toFixed(_unitPriceFilterDecimal));
              const objSummary = {
                unitPrice: parseFloat(vm.invoiceDetail.unitPrice.toFixed(2)) || null,
                quoted_unitPrice: parseFloat(vm.invoiceDetail.unitPrice.toFixed(2)) || null,
                refComponentSalesPriceBreakID: null,
                commissionPercentage: +(Math.round(commissionPercentage + 'e+2') + 'e-2'),
                commissionValue: sumActualCommission,
                extendedCommissionValue: parseFloat((vm.invoiceDetail.shipQty * sumCommission).toFixed(2)),
                quoted_commissionPercentage: +(Math.round(commissionPercentage + 'e+2') + 'e-2'),
                quoted_commissionValue: sumActualCommission,
                quotedQty: qtyObj ? qtyObj.priceBreak : vm.invoiceDetail.shipQty,
                extendedQuotedCommissionValue: qtyObj ? parseFloat((qtyObj.priceBreak * sumCommission).toFixed(2)) : 0,
                partID: vm.invoiceDetail.partId,
                salesCommissionNotes: 'All',
                qty: vm.invoiceDetail.shipQty || null,
                fieldName: TRANSACTION.SO_COMMISSION_ATTR.RFQ.FIELDNAME,
                commissionCalculateFrom: TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID,
                typeName: TRANSACTION.SO_COMMISSION_ATTR.RFQ.COMMISSIONCALCULATEDFROM,
                type: TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID,
                rfqAssyID: sales.data.length > 0 ? sales.data[0].rfqAssyID : null
              };
              objSummary.childSalesCommissionList = sales.data;
              vm.invoiceDetail.salesCommissionList = [objSummary];
            } else {
              _.each(sales.data, (item) => {
                item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
                item.quoted_commissionPercentageDisplay = parseFloat(item.quoted_commissionPercentage).toFixed(_amountFilterDecimal);
                item.quoted_commissionValueDisplay = $filter('unitPrice')(item.quoted_commissionValue);
                item.extendedQuotedCommissionValueDisplay = $filter('amount')(item.extendedQuotedCommissionValue);
                item.quoted_unitPriceDisplay = $filter('amount')(item.quoted_unitPrice);
              });
              vm.invoiceDetail.salesCommissionList = sales.data;
            }
          }
          else {
            vm.invoiceDetail.salesCommissionList = [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // get latest description
    vm.getLatestPartDescription = () => {
      //in all if's else do nothing, keep description as it is
      if (vm.invoiceDetail && vm.invoiceDetail.partId) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.GET_LATEST_PART_DESCRIPTION_CONFIRMATION);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: vm.invoiceDetail.partId }).$promise.then((response) => {
              vm.invoiceDetail.assyDescription = response.data.mfgPNDescription;
              vm.invoiceDetailForm.$$controls[0].$setDirty();
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

    //change zero value flag
    vm.changeZeroValueFlag = () => {
      if (vm.invoiceDetail.isZeroValue) {
        vm.invoiceDetail.unitPrice = 0;
        vm.invoiceDetail.extendedPrice = 0;
      } else {
        vm.invoiceDetail.extendedPrice = multipleUnitValue(vm.invoiceDetail.shipQty, vm.invoiceDetail.unitPrice);
      }
    };


    //IN MISC Type if user select SO,PO which already Created in Sales order page then we need to give warning message
    vm.checkMiscPackingSlipForSOPONumberOnBlur = (nextElement) => {
      const obj = {
        poNumber: vm.packingSlip.poNumber,
        soNumber: null,
        customerID: vm.packingSlip.customerID
      };
      let messageContent;
      if (!vm.packingSlip.invoiceType && !vm.isCreditNote && vm.packingSlip.customerID && ((!vm.packingSlip.id) || (vm.CopyPackingslip && vm.CopyPackingslip !== vm.CopyPackingslip.poNumber))) {
        vm.cgBusyLoading = CustomerPackingSlipFactory.checkMiscPackingSlipForSOPONumber().query(obj).$promise.then((resCheck) => {
          // here failed means matchin PO/SO entry exists in sales order
          if (resCheck && resCheck.status === CORE.ApiResponseTypeStatus.FAILED && resCheck.errors.data) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MISC_PACKINGSLIP_SO_ALREADY_EXISTS_WARNING);
            messageContent.message = stringFormat(messageContent.message, vm.packingSlip.poNumber ? vm.packingSlip.poNumber : '', 'Customer Invoice');
            const model = {
              messageContent: messageContent,
              mutliple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              //vm.packingSlip.poNumber = null;
              //vm.packingSlip.soNumber = null;
              //vm.packingSlip.soRevision = null;
              // setFocus('poNumber');
              setFocus(nextElement);
            });
          }
        }).catch((err) => BaseService.getErrorLog(err));
      }
    };
    // view detail record
    vm.viewRecordProfile = (row) => {
      if (row && row.entity) {
        vm.OldDetailId = vm.invoiceDetail.id;
        vm.invoiceDetail = _.clone(row.entity);
        vm.invoiceDetail.isZeroValue = vm.invoiceDetail.isZeroValue > 0 ? true : false;
        vm.invoiceDetailCopy = _.clone(vm.invoiceDetail);
        if (row.entity.partType === CORE.PartType.Other) {
          vm.autocompleteOtherCharges.keyColumnId = row.entity.partId;
        } else {
          const searchObj = {
            partID: row.entity.partId,
            searchText: null
          };
          getcomponentAssemblyList(searchObj);
        }
        let autoCompletePromise = [];
        if ((vm.invoiceDetail.isCustom || vm.invoiceDetail.isCPN || vm.invoiceDetail.isMISCAssemblyType) && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
          autoCompletePromise = [getQtyTurnTimeByAssyId(vm.invoiceDetail.partId)];
        }
        if (vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
          if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
            vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
            vm.invoiceDetail.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
          }
          if (vm.invoiceDetail.partId) {
            autoCompletePromise = [getrfqQuoteQtyTurnTimeList(vm.invoiceDetail.refRFQGroupID, (vm.invoiceDetail.partId))];
          }
        } else if (vm.invoiceDetail.quoteFrom !== vm.salesCommissionFrom.FromRFQ.id) {
          if (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId) {
            vm.autoCompleteQuoteGroup.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
          }
          vm.invoiceDetail.refRFQGroupID = null;
        }
        vm.cgBusyLoading = $q.all(autoCompletePromise).then(() => {
          vm.quoteGroupDetails = [];
          if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && vm.invoiceDetail.partId && vm.invoiceDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
            getrfqQuoteGroupList(vm.invoiceDetail.partId);
          }
        });
        // get price based on qty for case of  PS based invoice as it will be update case for line
        if (vm.packingSlip.invoiceType && !vm.isCreditNote && vm.invoiceDetail.unitPrice === null) {
          vm.getPartPriceBreakDetails(vm.invoiceDetail.partId);
        }
        $timeout(() => {
          vm.calculateExtendedPrice();
          setFocus('resetDetail');
        });
        vm.recordUpdate = false;
        vm.recordView = true;
      }
    };

    /* Show Payment Details */
    vm.showPaymentTransactions = () => {
      const data = vm.packingSlip;
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        if (vm.packingSlip && vm.packingSlip.id) {
          data.refPaymentMode = null; // null means all type of payment need to show >> Payment, Applied CM and Applied WOFF
          data.isCustPaymentEntity = true;
          data.totalExtendedAmount = vm.packingSlip.totalExtendedPrice;
          data.receivedAmount = vm.packingSlip.receivedAmount;
          data.balanceAmount = vm.packingSlip.balanceAmount;
          data.mfgCodeID = vm.packingSlip.customerID;
        }
        DialogFactory.dialogService(
          TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER,
          TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW,
          event,
          data
        ).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
        BaseService.goToApplyCustCreditMemoToPayment(vm.packingSlip.id, vm.packingSlip.custPaymentMstID);
      }
    };

    //open log for customer packing slip
    vm.opencustomerpackingSlipChangesHistoryAuditLog = (ev) => {
      const data = {
        customerPackingId: vm.packingSlip.id
      };
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        data.invoiceNumber = vm.packingSlip.invoiceNumber;
        data.refSalesOrderID = vm.packingSlip.refSalesOrderID;
        data.transType = vm.transType;
      } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
        data.invoiceNumber = null;
        data.refSalesOrderID = null;
        data.transType = vm.transType;
        data.creditMemoNumber = vm.packingSlip.creditMemoNumber;
      }
      DialogFactory.dialogService(
        CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_CONTROLLER,
        CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
    };

    // when Agreed Refund Amount Less Than Total Issued Amout >> error as not allowed
    const displayErrorMsgForAgreedRefundLessThanTotIssued = (totRefundIssuedAgainstCreditMemo) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.AGREED_REFUND_NOT_LESS_THAN_TOT_REFUNDED_AMT);
      messageContent.message = stringFormat(messageContent.message, totRefundIssuedAgainstCreditMemo, (vm.frmCustomerInvoice.agreedRefundAmt.$viewValue || 0));
      const model = {
        messageContent: messageContent
      };
      return DialogFactory.messageAlertDialog(model).then(() => {
        if (!vm.packingSlip.isMarkForRefund) {
          vm.packingSlip.isMarkForRefund = true;
        }
        vm.packingSlip.agreedRefundAmtDisplay = vm.packingSlip.totRefundIssuedAgainstCreditMemo;
        setFocusByName('agreedRefundAmt');
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };
    // export sales commission details
    vm.exportSalesCommission = (row) => {
      if (row && row.entity) {
        BaseService.exportSalesCommissionDetail(vm.custInvoiceID, row.entity.id, false, vm.packingSlip.invoiceNumber, row.entity.lineID);
      }
    };

    //add new customer Refund
    vm.addCustomerRefund = () => {
      BaseService.goToCustomerRefundDetail(0);
    };

    /* to go at customer refund list page */
    vm.goToCustomerRefundList = () => {
      BaseService.goToCustomerRefundList();
    };

    /* display refunded amount popup to display all refunded transaction against current payment */
    vm.showTotRefundIssueDetAgainstPayment = (isShowAllTransWhereCreditUsed) => {
      const data = {
        id: vm.custInvoiceID,
        mfgCodeID: vm.packingSlip.customerID,
        paymentCMNumber: vm.packingSlip.creditMemoNumber,
        customerName: vm.packingSlip.customerName,
        totalPaymentAmount: vm.packingSlip.totalExtendedPrice,
        totalRefundIssuedAmount: vm.packingSlip.totRefundIssuedAgainstCreditMemo,
        agreedRefundAmount: vm.packingSlip.agreedRefundAmt,
        refGencTransModeID: CORE.GenericTransModeName.RefundPayableCMRefund.id,
        isDisplayAllTransWhereCreditUsed: isShowAllTransWhereCreditUsed,
        sumAppliedCMRefundedAmount: vm.packingSlip.sumOfAppliedCMRefundedAmt
      };

      DialogFactory.dialogService(
        TRANSACTION.CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_CONTROLLER,
        TRANSACTION.CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_VIEW,
        event,
        data
      ).then(() => {
      }, () => {
      }, (err) => BaseService.getErrorLog(err));
    };

    // to move at refund list page with filter data
    vm.addCustomerRefundWithFilter = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, {
        id: 0,
        transModeID: CORE.GenericTransModeName.RefundPayableCMRefund.id,
        custID: vm.packingSlip.customerID,
        CMID: vm.packingSlip.id
      });
    };

    // common confirmation detail
    const commonShippingMethodConfirm = (askConfirmation) => {
      if (askConfirmation) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_ADDR_CONFIRM_ALERT);
        messageContent.message = stringFormat(messageContent.message, vm.isCreditNote ? 'Credit Memo' : 'Invoice');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.packingSlip.carrierAccountNumber = vm.ShippingAddress ? (vm.ShippingAddress.carrierAccount || vm.packingSlip.carrierAccountNumber) : (vm.packingSlip.carrierAccountNumber || null);
            vm.autoCompleteCarriers.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId) : (vm.autoCompleteCarriers.keyColumnId || null);
            vm.autoCompleteShipping.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
          }
        }, () => {
        });
      } else {
        vm.packingSlip.carrierAccountNumber = vm.ShippingAddress ? (vm.ShippingAddress.carrierAccount || vm.packingSlip.carrierAccountNumber) : (vm.packingSlip.carrierAccountNumber || null);
        vm.autoCompleteCarriers.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId) : (vm.autoCompleteCarriers.keyColumnId || null);
        vm.autoCompleteShipping.keyColumnId = vm.ShippingAddress ? (vm.ShippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId) : (vm.autoCompleteShipping.keyColumnId || null);
      }
    };

    // go to carrier list page
    vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();

    const resetAddressOBject = (resetInvoiceModel) => {
      if (resetInvoiceModel) {
        vm.packingSlip.billingAddress = null;
        vm.packingSlip.shippingAddress = null;
        vm.packingSlip.intermediateAddress = null;
        vm.packingSlip.shipToId = null;
        vm.packingSlip.billToId = null;
        vm.packingSlip.intermediateShipmentId = null;

        vm.packingSlip.billingAddressObj = null;
        vm.packingSlip.shippingAddressObj = null;
        vm.packingSlip.intermediateAddressObj = null;
        vm.packingSlip.billingContactPersonObj = null;
        vm.packingSlip.shippingContactPersonObj = null;
        vm.packingSlip.intermediateContactPersonObj = null;
        vm.packingSlip.billingContactPersonID = null;
        vm.packingSlip.shippingContactPersonID = null;
        vm.packingSlip.intermediateContactPersonID = null;
        vm.packingSlip.intermediateContactPerson = null;
      }
      vm.shipToOtherDet.customerId = null;
      vm.shipToOtherDet.refTransID = null;
      vm.shipToOtherDet.alreadySelectedAddressID = null;
      vm.IntermediateAddress = null;
      vm.ShippingAddress = null;
      vm.BillingAddress = null;
      vm.BillingAddressContactPerson = null;
      vm.ShippingAddressContactPerson = null;
      vm.IntermediateAddressContactPerson = null;
      vm.billToOtherDet.customerId = null;
      vm.billToOtherDet.refTransID = null;
      vm.billToOtherDet.alreadySelectedAddressID = null;
      vm.intermediateToOtherDet.customerId = null;
      vm.intermediateToOtherDet.refTransID = null;
      vm.ContactPersonOtherDet.customerId = null;
      vm.ContactPersonOtherDet.refTransID = null;
      vm.ContactPersonOtherDet.alreadySelectedPersonId = null;
    };

    vm.refreshAddressCallBack = (ev, addressOtherDet) => {
      getCustomerAddress(vm.packingSlip.customerID, addressOtherDet.addressType);
    };

    //page load then it will add forms in page forms
    angular.element(() => {
      BaseService.currentPageForms = [vm.frmCustomerInvoice, vm.invoiceDetailForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.frmCustomerInvoice = vm.frmCustomerInvoice;
        $scope.$parent.vm.invoiceDetailForm = vm.invoiceDetailForm;
        $scope.$parent.vm.saveCustomerInvoice = vm.saveCustomerInvoice;
        $scope.$parent.vm.status = vm.packingSlip.status;
        $scope.$parent.vm.subStatus = vm.packingSlip.subStatus;
        $scope.$parent.vm.label = vm.packingSlip.status ? CORE.OPSTATUSLABLEDRAFTED : CORE.OPSTATUSLABLELOCK;
        $scope.$parent.vm.changePackingSlipStatus = vm.changeInvoiceStatus;
        $scope.$parent.vm.packingSlipMainObj.packingSlipNumber = vm.packingSlip.packingSlipNumber ? vm.packingSlip.packingSlipNumber : null;
        $scope.$parent.vm.packingSlipMainObj.packingSlipID = vm.packingSlip.packingSlipID ? vm.packingSlip.packingSlipID : null;
        $scope.$parent.vm.packingSlipMainObj.isLocked = vm.packingSlip.isLocked;
        $scope.$parent.vm.packingSlipMainObj.isDisableInvEntry = vm.isDisableInvEntry || false;
        $scope.$parent.vm.packingSlipMainObj.packingSlipType = vm.packingSlip.packingSlipType ? vm.packingSlip.packingSlipType : null;
        $scope.$parent.vm.packingSlipMainObj.packingSlipTypeText = vm.packingSlip.packingSlipTypeText ? vm.packingSlip.packingSlipTypeText : null;
        $scope.$parent.vm.packingSlipMainObj.invoiceTypeText = vm.packingSlip.invoiceTypeText ? vm.packingSlip.invoiceTypeText : null;
        $scope.$parent.vm.packingSlipMainObj.lockedAt = vm.packingSlip.lockedAt;
        $scope.$parent.vm.packingSlipMainObj.lockedBy = vm.packingSlip.lockedBy;
        $scope.$parent.vm.packingSlipMainObj.refSalesOrderId = vm.packingSlip.refSalesOrderId;
        $scope.$parent.vm.packingSlipMainObj.revision = vm.packingSlip.revision;
        $scope.$parent.vm.packingSlipNumber = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? vm.packingSlip.invoiceNumber : vm.packingSlip.creditMemoNumber;
        $scope.$parent.vm.opencustomerpackingSlipChangesHistoryAuditLog = vm.opencustomerpackingSlipChangesHistoryAuditLog;
        // $scope.$parent.vm.custCode = vm.packingSlip.mfgCodeMst ? vm.packingSlip.mfgCodeMst.mfgCode : null;
      }
      //if packing slip detail already passed
      if (vm.packingSlipNumber && !vm.custInvoiceID && !vm.isCreditNote) {
        vm.getPackingSlipDetailByPackingSlipNumber();
        vm.frmCustomerInvoice.$$controls[0].$setDirty();
      };
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SalesOrderNewFuturePOPopupController', SalesOrderNewFuturePOPopupController);

  function SalesOrderNewFuturePOPopupController($mdDialog, CORE,
    BaseService, data, SalesOrderFactory, TRANSACTION, $q, MasterFactory, USER, EmployeeFactory, GenericCategoryFactory, FOBFactory, CustomerFactory, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.data = angular.copy(data);
    vm.LabelConstant = CORE.LabelConstant;
    vm.subAssy = CORE.PartCategory.SubAssembly;
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.todayDate = new Date();
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.maxLengthForDescription = _maxLengthForDescription;
    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
    vm.messageCompareMessage = stringFormat(messageContent.message, 'PO Revision Date', 'PO Date');
    vm.pomessageCompareMessage = stringFormat('PO Revision Date cannot be greater than Today Date');
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.poDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.soDate] = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.salesorder = {
      revision: '00',
      soDate: vm.todayDate,
      poDate: vm.todayDate,
      status: 0
    };
    vm.soDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.poDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.poRevisionDateOptions = {
      minDate: vm.salesorder.poDate,
      maxDate: vm.todayDate,
      appendToBody: true
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.data.partID);
    };

    // go to sales order master
    vm.goToSalesOrderMaster = (id) => {
      BaseService.goToManageSalesOrder(id || vm.data.salesOrderID);
    };

    // go to sales order list page
    vm.goTosalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    vm.queryAssemblyList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.data.partType === vm.subAssy ? CORE.LabelConstant.Assembly.PIDCode : CORE.LabelConstant.MFG.PID,
      value: vm.data.PIDCode,
      displayOrder: 4,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartMaster,
      isCopy: true,
      isCopyAheadLabel: true,
      isAssy: vm.data.partType === vm.subAssy,
      imgParms: {
        imgPath: vm.data.rohsIcon,
        imgDetail: vm.data.rohsName
      },
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.data.partType === vm.subAssy ? vm.LabelConstant.Assembly.MFGPN : vm.LabelConstant.MFG.MFGPN,
      copyAheadValue: vm.data.mfgPN
    }, {
      label: 'PO Line#',
      value: vm.data.custPOLineNumber,
      displayOrder: 5
    },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.data.soNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 1
      },
      {
        label: vm.LabelConstant.SalesOrder.Revision,
        value: vm.data.revision,
        displayOrder: 2
      },
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.data.poNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 3
      });
    if (vm.data.blanketPOOption) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.BlanketPO,
        value: 'Yes',
        displayOrder: 6
      });
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.BlanketPOOption,
        value: vm.BlanketPODetails.USEBLANKETPO === vm.data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[0].value : vm.BlanketPODetails.LINKBLANKETPO === vm.data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[1].value : TRANSACTION.BLANKETPOOPTION[2].value,
        displayOrder: 6
      });
    }
    if (vm.data.isLegacyPO) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.LegacyPo,
        value: 'Yes',
        displayOrder: 8
      });
    }
    if (vm.data.isRmaPO) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.RMAPo,
        value: 'Yes',
        displayOrder: 8
      });
    }
    vm.cancel = (isyes) => {
      const isdirty = BaseService.checkFormDirty(vm.frmSalesOrderPopupDetails, null);
      if (isdirty) {
        const data = {
          form: vm.frmSalesOrderPopupDetails
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(isyes);
      }
    };

    vm.goToPartMaster = (partID) => {
      BaseService.goToComponentDetailTab(null, partID);
      return false;
    };

    //Set purchase order date in onchange
    vm.onChangesoDate = (soDate) => {
      if (vm.salesorder.soDate) {
        vm.poDateOptions = {
          maxDate: soDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
        vm.checkDateValidation(true);
      }
    };
    // check date validation
    vm.checkDateValidation = (isSODate) => {
      const poDate = vm.salesorder.poDate ? new Date($filter('date')(vm.salesorder.poDate, vm.DefaultDateFormat)) : vm.frmSalesOrderPopupDetails.poDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderPopupDetails.poDate.$viewValue, vm.DefaultDateFormat)) : null;
      const soDate = vm.salesorder.soDate ? new Date($filter('date')(vm.salesorder.soDate, vm.DefaultDateFormat)) : vm.frmSalesOrderPopupDetails.soDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderPopupDetails.soDate.$viewValue, vm.DefaultDateFormat)) : null;
      if (vm.frmSalesOrderPopupDetails) {
        if (vm.frmSalesOrderPopupDetails.poDate && vm.frmSalesOrderPopupDetails.soDate && poDate && soDate) {
          if (isSODate && poDate <= soDate) {
            vm.salesorder.poDate = poDate;
            vm.frmSalesOrderPopupDetails.poDate.$setValidity('maxvalue', true);
          }
          if (!isSODate && poDate <= soDate) {
            vm.salesorder.soDate = soDate;
            vm.frmSalesOrderPopupDetails.soDate.$setValidity('minvalue', true);
          }
        }
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //Set sales order date in onchange min value
    vm.onChangePoDate = (poDate) => {
      if (vm.salesorder.poDate) {
        vm.soDateOptions = {
          maxDate: vm.todayDate,
          minDate: poDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
        vm.poRevisionDateOptions = {
          minDate: vm.salesorder.poDate,
          maxDate: vm.todayDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
      }
      vm.checkDateValidation();
      vm.checkPODateValidation();
    };

    // check PO date validation
    vm.checkPODateValidation = () => {
      const poDate = vm.salesorder.poDate ? new Date($filter('date')(vm.salesorder.poDate, _dateDisplayFormat)) : vm.frmSalesOrderPopupDetails.poDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderPopupDetails.poDate.$viewValue, _dateDisplayFormat)) : null;
      const poRevDate = vm.salesorder.poRevisionDate ? new Date($filter('date')(vm.salesorder.poRevisionDate, _dateDisplayFormat)) : vm.frmSalesOrderPopupDetails.poRevisionDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderPopupDetails.poRevisionDate.$viewValue, _dateDisplayFormat)) : null;
      if (vm.frmSalesOrderPopupDetails) {
        if (vm.frmSalesOrderPopupDetails.poDate && vm.frmSalesOrderPopupDetails.poRevisionDate && poDate && poRevDate) {
          if (poRevDate < poDate) {
            vm.salesorder.poRevisionDate = poRevDate;
            vm.frmSalesOrderPopupDetails.poRevisionDate.$setValidity('minvalue', false);
          }
          if (poRevDate >= poDate) {
            vm.salesorder.poRevisionDate = poRevDate;
            vm.frmSalesOrderPopupDetails.poRevisionDate.$setValidity('minvalue', true);
          }
        }
      }
    };
    /*
      * Author :  Champak Chaudhary
      * Purpose : Get customer detail
    */
    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));
    /*
      * Author :  Champak Chaudhary
      * Purpose : Get Terms detail
     */
    const getTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer detail
    */
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: false
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
    /*
* Author :  Champak Chaudhary
* Purpose : Get carrier detail
*/
    const getCarrierList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
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
    //Get list of FOB
    const getFOBList = () => FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
      if (fob && fob.data) {
        vm.FOBList = fob.data;
        return $q.resolve(vm.FOBList);
      }
    }).catch((error) => {
      BaseService.getErrorLog(error);
    });
    // bind auto complete
    const autocompletePromise = [getCustomerList(), getTermsList(), getShippingList(), getCarrierList(), getFOBList()];// , getFOBList(), getCarrierList()
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'mfgCodeName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.data.customerID,
        inputName: 'Customer',
        placeholderName: 'Customer',
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getcustomerdetail
      };
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: CategoryTypeObjList.ShippingType.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCarrierList
      };
      vm.autoCompleteTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.Terms.Name,
        placeholderName: CategoryTypeObjList.Terms.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.paymentTerm,
          headerTitle: CategoryTypeObjList.Terms.Title
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
        keyColumnId: null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
    };

    const getcustomerdetail = (item) => {
      if (item) {
        vm.salesorder.salesCommissionTo = item.salesCommissionTo;
        vm.salesorder.internalComment = item.comments;
        vm.customerCodeName = item.mfgCode;
        const autocompleteCustomerPromise = [getSalesCommissionEmployeeListbyCustomer(),
        generateSOComment(item.id)];
        vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
          vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo;
        }).catch((error) => BaseService.getErrorLog(error));
        vm.salesorder.freeOnBoardId = item.freeOnBoardId;
        vm.salesorder.carrierAccountNumber = item.carrierAccount;
        if (vm.autoCompleteFOB) {
          vm.autoCompleteFOB.keyColumnId = vm.salesorder.freeOnBoardId;
        }
        if (vm.autoCompleteShipping) {
          vm.autoCompleteShipping.keyColumnId = item.shippingMethodID;
        }
        if (vm.autoCompleteCarriers) {
          vm.autoCompleteCarriers.keyColumnId = item.carrierID;
        }
        if (vm.autoCompleteTerm) {
          vm.autoCompleteTerm.keyColumnId = item.paymentTermsID;
        }
      } else {
        vm.salesorder.salesCommissionTo = null;
        vm.salesorder.freeOnBoardId = null;
        vm.salesorder.internalComment = null;
        vm.salesorder.shippingComment = null;
        vm.salesorder.carrierAccountNumber = null;
        if (vm.autoCompleteSalesCommosssionTo) {
          vm.autoCompleteSalesCommosssionTo.keyColumnId = null;
        }
        if (vm.autoCompleteFOB) {
          vm.autoCompleteFOB.keyColumnId = null;
        }
        if (vm.autoCompleteShipping) {
          vm.autoCompleteShipping.keyColumnId = null;
        }
        if (vm.autoCompleteCarriers) {
          vm.autoCompleteCarriers.keyColumnId = null;
        }
        if (vm.autoCompleteTerm) {
          vm.autoCompleteTerm.keyColumnId = null;
        }
      }
    };
    // initialize auto complete for customer,employee
    const initSalesCommissionAutoComplete = () => {
      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: null,
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
    };

    // get sales Commission to employee list
    const getSalesCommissionEmployeeListbyCustomer = () => EmployeeFactory.getEmployeeListByCustomer().query({ customerID: vm.autoCompleteCustomer.keyColumnId, salesCommissionToID: vm.salesorder.salesCommissionTo }).$promise.then((employees) => {
      if (employees && employees.data) {
        vm.SalesCommissionEmployeeList = angular.copy(employees.data);
        if (!vm.autoCompleteSalesCommosssionTo) {
          initSalesCommissionAutoComplete();
        };
        return $q.resolve(vm.SalesCommissionEmployeeList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const generateSOComment = (id) => {
      CustomerFactory.getCustomerCommentsById().query({ mfgCodeId: id }).$promise.then((res) => {
        if (res.data && res.data.fetchedCustomerComment) {
          vm.salesorder.shippingComment = res.data.fetchedCustomerComment;
        }
        else {
          vm.salesorder.shippingComment = '';
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // go to carrier list page
    vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();
    vm.goToCustomerType = () => {
      BaseService.goToCustomerList();
    };

    vm.goPaymentTermList = () => {
      BaseService.goToGenericCategoryTermsList();
    };
    vm.goShippingMethodList = () => {
      BaseService.goToGenericCategoryShippingTypeList();
    };
    //go to employee page list
    vm.employeelist = () => {
      BaseService.goToPersonnelList();
    };
    //go to fob
    vm.goToFOBList = () => BaseService.goToFOB();

    // save sales order detail
    vm.addSalesOrderDetail = () => {
      vm.isbuttondisabled = true;
      if (BaseService.focusRequiredField(vm.frmSalesOrderPopupDetails)) {
        vm.isbuttondisabled = false;
      } else {
        vm.checkUniqueCustomerPONumber().then((response) => {
          if (response) {
            saveFinalSalesOrderDetail();
          }
        });
      }
    };
    let isopen = false;
    // check unique po# cusromer wise
    vm.checkUniqueCustomerPONumber = () => {
      if (!vm.salesorder.poNumber || !vm.autoCompleteCustomer) { return; }
      if (!isopen) {
        const objCustomer = {
          id: null,
          customerID: vm.autoCompleteCustomer.keyColumnId,
          poNumber: vm.salesorder.poNumber
        };
        return SalesOrderFactory.checkUniquePOWithCustomer().query(objCustomer).$promise.then((salesOrder) => {
          if (salesOrder && salesOrder.data) {
            isopen = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PO_ALREADY_EXIST_CUSTOMER);
            messageContent.message = stringFormat(messageContent.message, vm.salesorder.poNumber, vm.customerCodeName, salesOrder.data.salesOrderNumber);
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.salesorder.poNumber = null;
              isopen = false;
              setFocus('ponumber');
            });
            return false;
          } else {
            return true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const saveFinalSalesOrderDetail = () => {
      vm.contactPersonID = null;
      vm.salesorder.isSOrevision = false;
      const salesorderInfo = {
        salesOrderNumber: vm.salesorder.salesOrderNumber || '',
        poNumber: vm.salesorder.poNumber,
        poDate: BaseService.getAPIFormatedDate(vm.salesorder.poDate),
        customerID: vm.autoCompleteCustomer.keyColumnId,
        contactPersonID: vm.contactPersonID,
        billingAddressID: vm.BillingAddress ? vm.BillingAddress.id : null,
        shippingAddressID: vm.ShippingAddress ? vm.ShippingAddress.id : null,
        shippingMethodID: vm.autoCompleteShipping.keyColumnId,
        carrierID: vm.autoCompleteCarriers.keyColumnId,
        carrierAccountNumber: vm.salesorder.carrierAccountNumber,
        isAddnew: !parseInt(vm.salesorder.status) === 1 ? true : false,
        revision: vm.salesorder.revision,
        shippingComment: vm.salesorder.shippingComment,
        status: vm.salesorder.status,
        termsID: vm.autoCompleteTerm.keyColumnId,
        soDateValue: vm.salesorder.soDate,
        soDate: BaseService.getAPIFormatedDate(vm.salesorder.soDate),
        SalesDet: [],    // salesdetaillist,
        revisionChangeNote: vm.salesorder.revisionChangeNote,
        salesCommissionTo: vm.autoCompleteSalesCommosssionTo.keyColumnId,
        freeOnBoardId: vm.autoCompleteFOB.keyColumnId,
        intermediateShipmentId: vm.salesorder.intermediateShipmentId,
        internalComment: vm.salesorder.internalComment,
        serialNumber: vm.salesorder.serialNumber,
        isBlanketPO: vm.salesorder.isBlanketPO,
        linkToBlanketPO: vm.salesorder.linkToBlanketPO,
        blanketPOOption: null,
        isLegacyPO: vm.salesorder.isLegacyPO,
        poRevision: vm.salesorder.poRevision,
        isSOrevision: vm.salesorder.isSOrevision,
        isRmaPO: vm.salesorder.isRmaPO,
        originalPODate: BaseService.getAPIFormatedDate(vm.salesorder.originalPODate),
        poRevisionDate: BaseService.getAPIFormatedDate(vm.salesorder.poRevisionDate),
        isAlreadyPublished: vm.salesorder.isAlreadyPublished || (parseInt(vm.salesorder.status || 0)),
        isAskForVersionConfirmation: vm.salesorder.isAskForVersionConfirmation,
        rmaNumber: vm.salesorder.rmaNumber,
        isDebitedByCustomer: vm.salesorder.isDebitedByCustomer || 0,
        orgPONumber: vm.salesorder.orgPONumber,
        orgSalesOrderID: vm.salesorder.orgSalesOrderID,
        isReworkRequired: vm.salesorder.isReworkRequired || 0,
        reworkPONumber: vm.salesorder.reworkPONumber
      };
      vm.cgBusyLoading = SalesOrderFactory.salesorder().save(salesorderInfo).$promise.then((res) => {
        vm.isbuttondisabled = false;
        if (res && res.data && res.data.id) {
          vm.salesorder.id = res.data.id;
          BaseService.goToManageSalesOrder(vm.salesorder.id, null, vm.data.soID, vm.data.partID);
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.salesorder.id);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.frmSalesOrderPopupDetails);
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrderCopyOptionController', SalesOrderCopyOptionController);

  /** @ngInject */
  function SalesOrderCopyOptionController($mdDialog, $filter, CORE, data, BaseService, SalesOrderFactory, $q, USER, TRANSACTION, DialogFactory) {
    const vm = this;
    const soID = data.salesID;
    const companyName = data.companyName;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.COPY_SO_NOTES = CORE.SO_COPY_NOTES;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.IsPickerOpen = {};
    vm.todayDate = new Date();
    vm.loginUser = BaseService.loginUser;
    vm.IsPickerOpen[vm.DATE_PICKER.poDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.soDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.poRevisionDate] = false;
    vm.LabelConstant = CORE.LabelConstant;
    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
    vm.messageCompareMessage = stringFormat(messageContent.message, 'PO Revision Date', 'PO Date');
    vm.pomessageCompareMessage = stringFormat('PO Revision Date cannot be greater than Today Date');
    vm.poDateOptions = {
      appendToBody: true,
      maxDate: vm.todayDate,
      checkoutTimeOpenFlag: false
    };
    vm.soDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true,
      checkoutTimeOpenFlag: false
    };
    vm.soModel = {
      isPartRequirements: true,
      poDate: moment(BaseService.getCurrentDate()).format(CORE.MOMENT_DATE_FORMAT),
      soDate: moment(BaseService.getCurrentDate()).format(CORE.MOMENT_DATE_FORMAT)
    };
    vm.poRevisionDateOptions = {
      minDate: vm.soModel.poDate,
      maxDate: vm.todayDate,
      appendToBody: true,
      checkoutTimeOpenFlag: false
    };
    vm.cancel = () => {
      const isdirty = BaseService.checkFormDirty(vm.CopySalesOrderForm) || vm.soModel.poDate || vm.soModel.soDate;
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };
    // go to purchase order list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };
    // go to purchase order detail page
    vm.goToSalesOrder = () => {
      BaseService.goToManageSalesOrder(soID);
    };
    // go to supplier list page
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    // go to manage supplier page
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.salesOrder.customerID);
    };
    // bind header detail
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.salesOrder.salesOrderNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToSalesOrder
      }, {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.salesOrder.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToSalesOrder
      }, {
        label: vm.LabelConstant.SalesOrder.Revision,
        value: vm.salesOrder.revision,
        displayOrder: 3
      },
        {
          label: vm.LabelConstant.SalesOrder.Customer,
          value: companyName || null,
          displayOrder: 3,
          labelLinkFn: vm.goToCustomerList,
          valueLinkFn: vm.goToCustomer
        }, {
        label: vm.LabelConstant.SalesOrder.SOPostingStatus,
        value: data.status,
        displayOrder: 4
      });
    }

    // save and create duplicate po
    vm.createDuplicateSalesOrder = () => {
      if (BaseService.focusRequiredField(vm.CopySalesOrderForm, true)) {
        return;
      }
      if (data.IsUserAwareOfPartStatus) {
        vm.saveDuplicateSalesOrder();
      } else {
        vm.cgBusyLoading = SalesOrderFactory.checkPartStatusOfSalesOrder().query({ id: soID }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (res.data) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CONTAINST_INACTIVE_PART);
              messageContent.message = stringFormat(messageContent.message, redirectToSOAnchorTag(soID, data.soNumber));
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.saveDuplicateSalesOrder();
                }
              }, () => $mdDialog.cancel()
              ).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.saveDuplicateSalesOrder();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.saveDuplicateSalesOrder = () => {
      const objDuplicateSO = {
        id: soID,
        employeeID: vm.loginUser.employee.id,
        poDate: moment(vm.soModel.poDate).format('YYYY-MM-DD'),
        soDate: moment(vm.soModel.soDate).format('YYYY-MM-DD'),
        poNumber: vm.soModel.poNumber,
        poRevision: vm.soModel.poRevision,
        poRevisionDate: vm.soModel.poRevisionDate? moment(vm.soModel.poRevisionDate).format('YYYY-MM-DD') : null,
        pisKeepPO: vm.soModel.isPartRequirements
      };
      vm.cgBusyLoading = SalesOrderFactory.copySalesOrderDetail().query(objDuplicateSO).$promise.then((res) => {
        if (res && res.data) {
          if (vm.CopySalesOrderForm) {
            vm.CopySalesOrderForm.$setPristine();
          }
          $mdDialog.cancel(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // get purchase Order detail by ID
    const getSalesOrderDetailByID = () => SalesOrderFactory.retriveSalesOrderByID().query({ id: soID }).$promise.then((res) => {
      if (res && res.data) {
        vm.salesOrder = res.data;
        bindHeaderData();
      }
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getSalesOrderAssyList = () => SalesOrderFactory.getCopySalesOrderAssyMismatch().query({ id: soID }).$promise.then((res) => {
      if (res && res.data) {
        vm.salesOrderAssyList = res.data;
      }
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));
    // get Part Requirement detail from part master
    const getSalesOrderPartDescriptionDetailBySOID = () => SalesOrderFactory.getDuplicateSalesOrderCommentsList().query({ id: soID }).$promise.then((res) => {
      if (res && res.data) {
        vm.salesOrderPartShipping = res.data.partshippingComments;
        vm.salesOrderPartComments = res.data.partinternalComments;
        vm.salesOrderPartDescription = res.data.partDescription;
      }
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));
    const partDescriptionPromise = [getSalesOrderDetailByID(), getSalesOrderPartDescriptionDetailBySOID(), getSalesOrderAssyList()];
    vm.cgBusyLoading = $q.all(partDescriptionPromise).then(() => {
      vm.partDescriptions = [];
      _.each(vm.salesOrder.salesOrderDet, (poRequirement) => {
        // check part shipping comment details matched or not
        const partComments = _.map(_.filter(vm.salesOrderPartShipping, (partComments) => partComments.partID === poRequirement.partID), 'requirement').join('\r');
        if ((partComments && poRequirement.remark && partComments.toLowerCase() !== poRequirement.remark.toLowerCase()) || (!partComments && poRequirement.remark) || (partComments && !poRequirement.remark)) {
          const isexists = _.find(vm.partDescriptions, (parts) => parts.partID === poRequirement.partID);
          if (!(isexists)) {
            vm.partDescriptions.push(poRequirement);
          }
        }
        // check part internal comment details matched or not
        const partInternalComments = _.map(_.filter(vm.salesOrderPartComments, (partComments) => partComments.partID === poRequirement.partID), 'comment').join('\r');
        if ((partInternalComments && poRequirement.internalComment && partInternalComments.toLowerCase() !== poRequirement.internalComment.toLowerCase()) || (!partInternalComments && poRequirement.internalComment) || (partInternalComments && !poRequirement.internalComment)) {
          const isexists = _.find(vm.partDescriptions, (parts) => parts.partID === poRequirement.partID);
          if (!(isexists)) {
            vm.partDescriptions.push(poRequirement);
          }
        }
        // check part description comment
        const partDescription = _.find(vm.salesOrderPartDescription, (partdescr) => partdescr.id === poRequirement.partID);
        if ((partDescription && partDescription.mfgPNDescription.toLowerCase() !== poRequirement.partDescription.toLowerCase()) || (!partDescription && partDescription.mfgPNDescription) || (partDescription && !partDescription.mfgPNDescription)) {
          const isexists = _.find(vm.partDescriptions, (parts) => parts.partID === poRequirement.partID);
          if (!(isexists)) {
            vm.partDescriptions.push(poRequirement);
          }
        }
      });
    }).catch((error) => BaseService.getErrorLog(error));

    const redirectToSOAnchorTag = (soID, soNumber) => {
      const redirectToSOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_DETAIL_ROUTE.replace(':id', soID);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToSOUrl, soNumber);
    };
    // check max length
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // let isopen = false;

    // check unique po# cusromer wise
    //vm.checkUniqueCustomerPONumber = () => {
    //  if (!vm.soModel.poNumber || !vm.salesOrder.customerID) { return; }
    //  if (!isopen) {
    //    const objCustomer = {
    //      id: null,
    //      customerID: vm.salesOrder.customerID,
    //      poNumber: vm.soModel.poNumber
    //    };
    //    return SalesOrderFactory.checkUniquePOWithCustomer().query(objCustomer).$promise.then((salesOrder) => {
    //      if (salesOrder && salesOrder.data) {
    //        isopen = true;
    //        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PO_ALREADY_EXIST_CUSTOMER);
    //        messageContent.message = stringFormat(messageContent.message, vm.soModel.poNumber, stringFormat('({0}){1}', vm.salesOrder.customers.mfgCode, vm.salesOrder.customers.mfgName), salesOrder.data.salesOrderNumber);
    //        const model = {
    //          multiple: true,
    //          messageContent: messageContent
    //        };
    //        DialogFactory.messageAlertDialog(model).then(() => {
    //          vm.soModel.poNumber = null;
    //          setFocus('poNumberDet');
    //          isopen = false;
    //        });
    //        return false;
    //      } else {
    //        return true;
    //      }
    //    }).catch((error) => BaseService.getErrorLog(error));
    //  }
    //};

    //Set sales order date in onchange min value
    vm.onChangePoDate = (poDate) => {
      if (vm.soModel.poDate) {
        vm.soDateOptions = {
          maxDate: vm.todayDate,
          minDate: poDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
        vm.poRevisionDateOptions = {
          minDate: vm.soModel.poDate,
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
      const poDate = vm.soModel.poDate ? new Date($filter('date')(vm.soModel.poDate, _dateDisplayFormat)) : vm.CopySalesOrderForm.poDate.$viewValue ? new Date($filter('date')(vm.CopySalesOrderForm.poDate.$viewValue, _dateDisplayFormat)) : null;
      const poRevDate = vm.soModel.poRevisionDate ? new Date($filter('date')(vm.soModel.poRevisionDate, _dateDisplayFormat)) : vm.CopySalesOrderForm.poRevisionDate.$viewValue ? new Date($filter('date')(vm.CopySalesOrderForm.poRevisionDate.$viewValue, _dateDisplayFormat)) : null;
      if (vm.CopySalesOrderForm) {
        if (vm.CopySalesOrderForm.poDate && vm.CopySalesOrderForm.poRevisionDate && poDate && poRevDate) {
          if (poRevDate < poDate) {
            vm.soModel.poRevisionDate = poRevDate;
            vm.CopySalesOrderForm.poRevisionDate.$setValidity('minvalue', false);
          }
          if (poRevDate >= poDate) {
            vm.soModel.poRevisionDate = poRevDate;
            vm.CopySalesOrderForm.poRevisionDate.$setValidity('minvalue', true);
          }
        }
      }
    };
    //Set purchase order date in onchange
    vm.onChangesoDate = (soDate) => {
      if (vm.soModel.soDate) {
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
      const poDate = vm.soModel.poDate ? new Date($filter('date')(vm.soModel.poDate, _dateDisplayFormat)) : vm.CopySalesOrderForm.poDate.$viewValue ? new Date($filter('date')(vm.CopySalesOrderForm.poDate.$viewValue, _dateDisplayFormat)) : null;
      const soDate = vm.soModel.soDate ? new Date($filter('date')(vm.soModel.soDate, _dateDisplayFormat)) : vm.CopySalesOrderForm.soDate.$viewValue ? new Date($filter('date')(vm.CopySalesOrderForm.soDate.$viewValue, _dateDisplayFormat)) : null;
      if (vm.CopySalesOrderForm) {
        if (vm.CopySalesOrderForm.poDate && vm.CopySalesOrderForm.soDate && poDate && soDate) {
          if (isSODate && poDate <= soDate) {
            vm.soModel.poDate = poDate;
            vm.CopySalesOrderForm.poDate.$setValidity('maxvalue', true);
          }
          if (!isSODate && poDate <= soDate) {
            vm.soModel.soDate = soDate;
            vm.CopySalesOrderForm.soDate.$setValidity('minvalue', true);
          }
        }
      }
    };
    //page load then it will add forms in page forms
    angular.element(() => {
      BaseService.currentPageForms = [vm.CopySalesOrderForm];
    });
  }
})();

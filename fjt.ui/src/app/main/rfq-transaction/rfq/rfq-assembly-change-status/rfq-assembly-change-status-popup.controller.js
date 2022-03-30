(function () {
  'use strict';
  angular
    .module('app.rfqtransaction')
    .controller('AssemblyQuoteStatusChangePopupController', AssemblyQuoteStatusChangePopupController);
  /** @ngInject */
  function AssemblyQuoteStatusChangePopupController($state, $window, $log, $sce, RFQSettingFactory, $filter, $rootScope, $mdDialog, $scope, $timeout, CORE, USER, BOMFactory, RFQTRANSACTION, data, BaseService, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.taToolbar = CORE.Toolbar;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const rfqAssyID = data.rfqAssyID;
    vm.Customer = data.Customer;
    vm.customerID = data.customerID;
    vm.PIDcode = data.PIDCode;
    vm.labelConstant = CORE.LabelConstant;
    vm.mfgPN = data.mfgPN;
    vm.partID = data.partID;
    vm.rohsIcon = data.rohsIcon;
    vm.rohsName = data.rohsName;
    vm.QuoteGroup = data.quoteGroup;
    vm.quoteProcess = data.quoteProgress;
    vm.assyList = data.assyList;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.rfqAssystatus = RFQTRANSACTION.RFQ_ASSY_STATUS;
    vm.QuoteStatus = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS;
    vm.quoteProgressGridHeaderDropdown = CORE.RFQQuoteProgressGridHeaderDropdown;
    vm.rfqSubmittedStatus = _.find(vm.quoteProgressGridHeaderDropdown, { id: 'Submitted' }).value;
    vm.rfqCompletedStatus = _.find(vm.quoteProgressGridHeaderDropdown, { id: 'Completed' }).value;
    vm.Reason_Type = CORE.Reason_Type;
    vm.isHideDelete = true;
    vm.isAssyAssyQuoteHistory = true;

    vm.assemblyStatusModel = {
      rfqAssyID: rfqAssyID,
      status: vm.rfqAssystatus.WON.VALUE,
      reason: data.reason,
      winPrice: data.winPrice,
      winQuantity: data.winQuantity,
      isActivityStart: data.isActivityStart
    };

    if (vm.rfqSubmittedStatus !== vm.quoteProcess && vm.rfqCompletedStatus !== vm.quoteProcess) {
      vm.assemblyStatusModel.status = vm.rfqAssystatus.CANCEL.VALUE;
      vm.allowCancel = true;
    } else {
      vm.allowCancel = false;
    }
    if (vm.assyList && vm.assyList.length > 0) {
      vm.allowCancel = false;
      vm.assemblyStatusModel.rfqAssyID = _.map(vm.assyList, 'rfqAssyID');
    }
    function getRFQReasonList() {
      return RFQSettingFactory.getReasonList().query({ reason_type: 1 }).$promise.then((reason) => {
        //RFQSettingFactory.getReasonList().query({ reasonCategory: 1 }).$promise.then((reason) => {
        vm.ReasonList = reason.data;
        initAutoComplete();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // initialize auto-complete for reason
    let initAutoComplete = () => {
      vm.autoCompleteReason = {
        columnName: 'reasonCategory',
        controllerName: USER.ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_REASON_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.assemblyStatusModel ? (vm.assemblyStatusModel.resonID ? vm.assemblyStatusModel.resonID : null) : null,
        inputName: 'Reason',
        placeholderName: 'Reason',
        isRequired: true,
        isAddnew: true,
        addData: { reasonId: vm.Reason_Type.RFQ.id },
        callbackFn: getRFQReasonList
      };
    };

    // to open Quote additional requirement pop up
    vm.OpenReasonTemplateList = (form) => {
      var obj = {};
      obj.isRFQ = true;
      DialogFactory.dialogService(
        RFQTRANSACTION.REASON_SELECT_POPUP_CONTROLLER,
        RFQTRANSACTION.REASON_SELECT_POPUP_VIEW,
        null,
        obj).then(() => {
        }, (data) => {
          if (data) {
            var string1 = "<ul><li>";
            var string2 = "</li><li>";
            var string3 = "</li></ul>";
            let req = vm.assemblyStatusModel.reason ? vm.assemblyStatusModel.reason.replace(string3, '') : null;
            data = data ? data.replace(string1, '') : null;
            let str = (req ? req + string2 : string1) + data;
            vm.assemblyStatusModel.reason = str;
            form.$setDirty();
          }
        },
          (err) => {
          });
    }

    vm.goToReasonList = () => {
      BaseService.openInNew(USER.ADMIN_RFQ_REASON_STATE, {})
    }

    vm.save = () => {
      if (vm.QuoteStatusForm.$invalid) {
        BaseService.focusRequiredField(vm.QuoteStatusForm);
        return;
      }
      vm.assemblyStatusModel.quoteFinalStatus = RFQTRANSACTION.RFQ_ASSY_QUOTE_STATUS.COMPLETED.VALUE;

      vm.cgBusyLoading = BOMFactory.changeAssyStatus().save(vm.assemblyStatusModel).$promise.then((response) => {
        BaseService.currentPagePopupForm = [];
        $mdDialog.hide();
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    vm.ViewAssyList = () => {
      DialogFactory.dialogService(
        RFQTRANSACTION.VIEW_ASSEMBLY_STATUS_CHANGE_POPUP_CONTROLLER,
        RFQTRANSACTION.VIEW_ASSEMBLY_STATUS_CHANGE_POPUP_VIEW,
        null,
        vm.assyList).then(() => {
        }, (cancel) => {

        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.partID);
      return false;
    }
    //go to assy list 
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    }
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.customerID);
      return false;
    }
    //redirect to customer list 
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    }

    vm.goToRFQ = () => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: vm.QuoteGroup, rfqAssyId: rfqAssyID });
      return false;
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.labelConstant.Assembly.QuoteGroup,
      value: vm.QuoteGroup,
      displayOrder: 1,
      labelLinkFn: null,
      valueLinkFn: vm.goToRFQ,
      valueLinkFnParams: null,
      isCopy: false,
      copyParams: null,
      imgParms: null
    }, {
      label: vm.labelConstant.Customer.Customer,
      value: vm.Customer,
      displayOrder: 1,
      labelLinkFn: vm.goToCustomerList,
      valueLinkFn: vm.goToCustomer,
      valueLinkFnParams: null,
      isCopy: false,
      copyParams: null,
      imgParms: null
    }, {
      label: vm.labelConstant.Assembly.ID,
      value: vm.PIDcode,
      displayOrder: 1,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: null,
      isCopy: true,
      isCopyAheadLabel: false,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.rohsIcon,
        imgDetail: vm.rohsName
      }
    }, {
      label: vm.labelConstant.Assembly.MFGPN,
      value: vm.mfgPN,
      displayOrder: 1,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: null,
      isCopy: true,
      isCopyAheadLabel: false,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.rohsIcon,
        imgDetail: vm.rohsName
      }
    });

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.QuoteStatusForm);
      if (isdirty) {
        let data = {
          form: vm.QuoteStatusForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.QuoteStatusForm];
    })


  }
})();

(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ManageOddlyNamedRefDesController', ManageOddlyNamedRefDesController);

  /** @ngInject */
  function ManageOddlyNamedRefDesController($mdDialog, $scope, $timeout, ComponentFactory, CORE, USER, RFQTRANSACTION, data, BaseService, DialogFactory) {
    const vm = this;
    vm.dataList = [];
    vm.selectedDataList = [];
    vm.oldSelectedValues = [];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE;
    vm.labelConstant = CORE.LabelConstant;
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.cid = data.partID;
    vm.AssyDetail = data;
    vm.SearchEmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM_ERROR_LEGEND;
    vm.OdlyNameEmptyMsg = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.ODDLY_NAME;

    vm.component = {
      id: vm.cid,
      removeOddelyRefDesIds: [],
      removeOddelyRefDes: []
    };
    // Get Oddely ref Des list
    vm.getOddelyRefDesList = () => ComponentFactory.getOddelyRefDesList().query({ id: vm.cid }).$promise.then((resOddRefDes) => {
      if (resOddRefDes && resOddRefDes.data) {
        vm.component.oddelyRefDesList = resOddRefDes.data;
        _.each(vm.component.oddelyRefDesList, (item, index) => {
          item.tempID = (index + 1);
        });
        vm.searchOddlyRefdes(true);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.getOddelyRefDesList();
    /** Set/Remove duplicate validation if RefDes is duplicate */
    vm.checkUniqueOddelyRefDes = () => {
      const checkDuplicate = _.find(vm.component.oddelyRefDesList, (obj) => obj.tempID !== vm.OddelyRefDesDet.tempID && obj.refDes === vm.OddelyRefDesDet.refDes);
      if (checkDuplicate) {
        $scope.$applyAsync(() => {
          vm.OddlyNamedRefDesForm.oddlyRefDes.$setValidity('duplicate', false);
        });
        return false;
      }
      vm.OddlyNamedRefDesForm.oddlyRefDes.$setValidity('duplicate', true);
      return true;
    };
    /** Add/Update Oddely RefDes */
    vm.addOddelyRefDesToList = (event) => {
      let RefDesControl;
      if (event.keyCode === 13) {
        vm.isDisableRefDes = true;
        $timeout(() => {
          if (!vm.OddelyRefDesDet.refDes || !vm.OddelyRefDesDet.refDes.trim()) {
            vm.isDisableRefDes = false;
            setFocus('oddlyRefDes');
            return;
          }
          vm.isDisableRefDes = false;
          if (vm.checkUniqueOddelyRefDes()) {
            const componentRefDes = _.find(vm.component.oddelyRefDesList, (obj) => obj.tempID === vm.OddelyRefDesDet.tempID);
            if (componentRefDes) {
              componentRefDes.oldrefDes = componentRefDes.refDes;
              if (componentRefDes.refDes !== vm.OddelyRefDesDet.refDes.replace(/,/g, '')) {
                componentRefDes.isEdited = true;
              }
              componentRefDes.refDes = vm.OddelyRefDesDet.refDes.replace(/,/g, '');
              componentRefDes.isRequiredToUpdate = true;
              vm.component.refDesChanged = true;
              RefDesControl = _.find(vm.OddlyNamedRefDesForm.$$controls, (ctrl) => ctrl.$name === 'oddlyRefDesChanged');
              RefDesControl.$setDirty();
            } else {
              vm.component.oddelyRefDesList.push({
                refDes: vm.OddelyRefDesDet.refDes.replace(/,/g, ''),
                refComponentID: vm.cid,
                tempID: (vm.component.oddelyRefDesList.length + 1)
              });
              vm.component.refDesChanged = true;
              RefDesControl = _.find(vm.OddlyNamedRefDesForm.$$controls, (ctrl) => ctrl.$name === 'oddlyRefDesChanged');
              RefDesControl.$setDirty();
            }
            resetOddelyRefDesObj();
            setFocus('oddlyRefDes');
            vm.searchOddlyRefdes(true);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, 'Oddly Named RefDes ' + vm.OddelyRefDesDet.refDes);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              resetOddelyRefDesObj();
              setFocus('oddlyRefDes');
            });
          }
          // }
        });
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(event);
      }
    };

    /** Remove RefDes from list */
    vm.removeRefDesItem = (item, index) => {
      let RefDesControl;
      vm.component.removeOddelyRefDesIds = vm.component.removeOddelyRefDesIds || [];
      vm.component.removeOddelyRefDes = vm.component.removeOddelyRefDes || [];
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Oddly Named RefDes', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.OddlyNamedRefDesForm.$setDirty(true);
            vm.component.refDesChanged = true;
            RefDesControl = _.find(vm.OddlyNamedRefDesForm.$$controls, (ctrl) => ctrl.$name === 'oddlyRefDesChanged');
            RefDesControl.$setDirty();
            if (item.id > 0) {
              vm.component.removeOddelyRefDesIds.push(item.id);
              vm.component.removeOddelyRefDes.push(item.refDes);
            }
            vm.component.oddelyRefDesList.splice(vm.component.oddelyRefDesList.indexOf(item), 1);
            const numberIndex = _.findIndex(vm.component.oddelyRefDesList, (obj) => obj.refDes === item.refDes);
            $timeout(() => {
              if (numberIndex === -1) {
                vm.OddlyNamedRefDesForm.oddlyRefDes.$setValidity('duplicate', true);
              }
            });
            //vm.isAddTrackDisable = _.filter(vm.component.oddelyRefDesList, (obj) => !obj.refDes).length > 0;
            _.each(vm.component.oddelyRefDesList, (item, index) => {
              item.tempID = (index + 1);
            });
            setFocus('oddlyRefDes');
            vm.searchOddlyRefdes(false);
          }
        }, () => {
          setFocus('oddlyRefDes');
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //vm.isAddTrackDisable = _.filter(vm.component.oddelyRefDesList, (obj) => !obj.refDes).length > 0;
    };
    // for search Oddly RefDes
    vm.searchOddlyRefdes = (isReset) => {
      if (isReset) {
        vm.searchText = null;
        vm.component.oddelyRefDesListSearch = vm.component.oddelyRefDesList;
      }
      else {
        vm.component.oddelyRefDesListSearch = _.filter(vm.component.oddelyRefDesList, (x) => x.refDes.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1);
      }
    };

    /** Edit RefDes */
    vm.editrefDesItem = (item) => {
      vm.OddelyRefDesDet = angular.copy(item);
      setFocus('oddlyRefDes');
    };
    vm.checkCopyStatus = () => { vm.copystatus = false; };
    vm.copyrefDesItem = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };
    // to reset current Ref des
    vm.resetOddelyRefDes = () => {
      resetOddelyRefDesObj();
    };
    // to reset re-set Ref des Object
    const resetOddelyRefDesObj = () => {
      vm.OddelyRefDesDet = {
        refDes: null
      };
      if (vm.OddlyNamedRefDesForm) {
        vm.OddlyNamedRefDesForm.oddlyRefDes.$setValidity('duplicate', true);
      }
    };
    resetOddelyRefDesObj();


    //go to manage part number
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.AssyDetail.partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
      BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.AssyDetail.customerID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // close pop up
    vm.cancel = () => {
      const isdirty = vm.OddlyNamedRefDesForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.OddlyNamedRefDesForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        vm.OddlyNamedRefDesForm.$setPristine();
        $mdDialog.cancel();
      }
    };
    if (data) {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.labelConstant.Customer.Customer,
        value: vm.AssyDetail.customerNameWithCode,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Assembly.ID,
        value: vm.AssyDetail.assyID,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.AssyDetail.rohsIcon,
          imgDetail: vm.AssyDetail.rohsName
        }
      }, {
        label: vm.labelConstant.Assembly.MFGPN,
        value: vm.AssyDetail.assyPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.AssyDetail.rohsIcon,
          imgDetail: vm.AssyDetail.rohsName
        }
      });
    }
    // send selected list array back to parent controller
    vm.save = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.OddlyNamedRefDesForm, vm.isFormDirty)) {// || !msWizard.currentStepForm().$dirty) {
        vm.saveDisable = false;
        return;
      }
      vm.cgBusyLoading = ComponentFactory.saveOddlyNamedRefDes().query({ componentObj: vm.component }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          $mdDialog.hide(true);
        }
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };
  }
})();

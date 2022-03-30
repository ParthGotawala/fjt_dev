(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('ChangeCompanyOwnershipController', ChangeCompanyOwnershipController);

  /** @ngInject */
  function ChangeCompanyOwnershipController(data, $scope, $mdDialog, CORE, CompanyProfileFactory, BaseService, DialogFactory, ManageMFGCodePopupFactory, ManufacturerFactory, USER) {
    const vm = this;
    const MFG_TYPE = CORE.MFG_TYPE.MFG;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.customerTypeConst = CORE.CUSTOMER_TYPE;
    vm.EmailPattern = CORE.EmailPattern;
    vm.headerdata = [];
    vm.toCompany = data.toCompany;
    vm.emailList = [];

    /* go to manufacturer detail page */
    vm.goToManufacturerDetails = () => {
      BaseService.goToManufacturer(vm.currentCompanyID);
      return false;
    };

    const getCustomerSearch = (searchObj, isData) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
      if (mfgcodes && mfgcodes.data) {
        _.remove(mfgcodes.data, (item) => item.id === vm.currentCompanyID);
        if (isData && vm.autoCompleteToCompany && vm.autoCompleteToCompany.inputName) {
          $scope.$broadcast(vm.autoCompleteToCompany.inputName, mfgcodes.data[0]);
        }
        return mfgcodes.data;
      } else {
        return [];
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      /*Auto-complete for Search Customer/Supplier */
      vm.autoCompleteToCompany = {
        columnName: 'mfgCodeName',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: vm.customerTypeConst.MANUFACTURER,
        placeholderName: vm.customerTypeConst.MANUFACTURER,
        isRequired: true,
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.emailList = item.email ? item.email.split(',').map((item) => item.trim()) : [];
            vm.email = (vm.emailList.length > 0) ? vm.emailList[0] : null;
            vm.id = item.id;
            vm.mfgName = item.mfgName;
            vm.mfgCode = item.mfgCode;
          } else {
            vm.email = null;
            vm.emailList = [];
            vm.id = null;
            vm.mfgName = null;
            vm.mfgCode = null;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: MFG_TYPE,
            searchInActive: false
          };
          return getCustomerSearch(searchObj, false);
        }
      };
    };
    const getCompanyInfo = () => {
      vm.cgBusyLoading = CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
        if (company && company.data) {
          vm.currentCompanyID = company.data.mfgCodeId;
          vm.currentCompany = stringFormat(vm.CORE_MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, company.data.MfgCodeMst.mfgCode, company.data.name);
          vm.headerdata.push({
            value: vm.currentCompany,
            label: 'Current Company',
            displayOrder: (vm.headerdata.length + 1),
            valueLinkFn: vm.goToManufacturerDetails
          });
          initAutoComplete();
          /* find and set company name and email selected from parent page */
          if (data) {
            const searchObj = {
              mfgcodeID: data.id,
              type: MFG_TYPE,
              searchInActive: false
            };
            getCustomerSearch(searchObj, true);
          };
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get current company name
    getCompanyInfo();

    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.ChangeCompanyOwnershipForm);
      if (isDirty) {
        const data = {
          form: vm.ChangeCompanyOwnershipForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel('cancel');
      }
    };

    vm.saveOwnership = () => {
      vm.isSubmit = true;
      vm.ChangeCompanyOwnershipForm.$dirty = true;
      if (BaseService.focusRequiredField(vm.ChangeCompanyOwnershipForm)) {
        vm.isSubmit = false;
        return;
      } else {
        vm.confirmationPopUp();
      }
      vm.isSubmit = false;
    };

    /* show confirmation popup on change ownership button event */
    vm.confirmationPopUp = (ev) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.CHANGE_COMPANY_OWNERSHIP);
      messageContent.message = stringFormat(messageContent.message, vm.mfgName);
      const model = {
        messageContent: messageContent,
        btnText: vm.CORE_MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: vm.CORE_MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(model).then((yes) => {
        if (yes) {
          // ask for password verfication-popup
          DialogFactory.dialogService(
            CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
            CORE.MANAGE_PASSWORD_POPUP_VIEW,
            ev, {
            isValidate: true
          }).then((data) => {
            if (data) {
              // save data after password verified
              saveCustomerCompanyDetails();
            }
          }, () => { // cancel
          }, (err) => BaseService.getErrorLog(err));
        }
      }, () => { // Cancel
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* save customer detail */
    const saveCustomerCompanyDetails = () => {
      const customerInfo = {
        id: vm.id,
        isCompany: true,
        fromPageRequest: MFG_TYPE,
        mfgName: vm.mfgName,
        mfgCode: vm.mfgCode ? (vm.mfgCode).toUpperCase() : null,
        mfgType: MFG_TYPE,
        companyEmail: vm.email,
        email: vm.emailList.length === 0 ? vm.email : vm.emailList.join(', '),
        isFromChangeCompanyOwnership: true
      };
      vm.cgBusyLoading = ManufacturerFactory.managecustomer().save(customerInfo).$promise.then((res) => {
        // close popup after setting isCompany true
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.ChangeCompanyOwnershipForm.$setPristine();
          $mdDialog.hide(false, { closeAll: true });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // check for dirty form
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    // on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.ChangeCompanyOwnershipForm);
    });

    // close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();

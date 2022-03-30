(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('EmailReportSettingPopupController', EmailReportSettingPopupController);

  /** @ngInject */
  function EmailReportSettingPopupController($q, $scope, $timeout, $mdDialog, data, USER, CORE, BaseService, MasterFactory, ReportMasterFactory, CustomerFactory, DialogFactory) {
    var vm = this;
    vm.emailReportScheduleType = CORE.EmailReportScheduleType;
    const monthlyEmailReportSetting = _.find(vm.emailReportScheduleType, (item) => item.Name === 'Monthly');
    vm.deletedPersons = [];
    vm.selectedCustomerId = null;
    vm.refTableName = CORE.TABLE_NAME.MFG_CODE_MST; // Customer Table Name.
    if (data) {
      vm.cid = data.id || null;
      vm.pCustomerID = data.customerID || null;
      vm.selectedCustomerId = vm.pCustomerID || null;
      vm.pReportID = data.reportID || null;
      vm.companyName = data.companyName || null;
    }

    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: vm.selectedCustomerId,
      refTableName: vm.refTableName
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        vm.ContactPersonList = _.each(vm.ContactPersonList, (item) => {
          item.personFullName = item.personFullName + (item.primaryEmail ? (' [ ' + item.primaryEmail + ' ]') : '');
        });
        return contactperson.data;
      }
      return null;
    }).catch((error) => BaseService.getErrorLog(error));

    const autoCompletePersonName = {
      controllerName: USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
      columnName: 'personFullName',
      keyColumnName: 'personId',
      keyColumnId: null,
      inputName: 'personFullName',
      placeholderName: 'Recipient Name',
      isRequired: true,
      isAddnew: true,
      addData: {
        refTransID: vm.selectedCustomerId,
        companyName: vm.companyName,
        refTableName: vm.refTableName,
        mfgType: CORE.MFG_TYPE.MFG,
        isFromMasterpage: true
      },
      callbackFn: getCustomerContactPersonList,
      onSelectCallbackFn: getPersonDetails
    };

    function duplicateEmailValidation(item, data) {
      var duplicateCheck = _.filter(vm.emailReportSetting.EmailAddressDetail, (email) => {
        return email.refEmailID == item.personId;
      })
      if (duplicateCheck.length > 1) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.EMAIL_DUPLICATE_RECIPIENT);
        var alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel).then((yes) => {
          data.autoCompletePersonName.keyColumnId = null;
          vm.AddEmailReportSettingForm.$setDirty;
        });
      }
    }

    function getPersonDetails(item, data) {
      if (item) {
        data.refEmailID = item.personId;
        duplicateEmailValidation(item, data);
      }
      else {
        data.refEmailID = null;
      }
    }
    function getPersonMinId() {
      var minId = -1;
      if (vm.emailReportSetting &&
        vm.emailReportSetting.EmailAddressDetail &&
        vm.emailReportSetting.EmailAddressDetail.length > 0) {
        var item = _.min(_.sortBy(vm.emailReportSetting.EmailAddressDetail, 'id'), 'id');
        if (item && item.id <= 0) {
          minId = item.id - 1;
          if (minId == 0)
            minId = -1;
        }
      }
      return minId;
    }
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.removePerson = (data) => {
      var person = _.find(vm.emailReportSetting.EmailAddressDetail, (item) => {
        return item.id == data.id;
      })
      if (person) {
        vm.emailReportSetting.EmailAddressDetail.splice(vm.emailReportSetting.EmailAddressDetail.indexOf(person), 1);
        if (person.id > 0) {
          vm.deletedPersons.push(angular.copy(person));
        }
      }
      vm.AddEmailReportSettingForm.$setDirty(true);
    }
    vm.addPerson = () => {
      let person = {
        id: getPersonMinId(),
        refID: (data.id ? data.id : null),
        refEmailID: null,
        autoCompletePersonName: angular.copy(autoCompletePersonName)
      };

      vm.emailReportSetting.EmailAddressDetail.push(person);
      vm.AddEmailReportSettingForm.$setDirty(true);
    }

    /* Part Type dropdown fill up */
    function getReportNameList() {
      return ReportMasterFactory.getReportNameList().query().$promise.then((res) => {
        vm.reportNameList = res.data;
        return $q.resolve(vm.reportNameList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getCustomerList() {
      return MasterFactory.getCustomerList().query().$promise.then((customer) => {
        if (customer && customer.data) {
          _.each(customer.data, function (item) {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.CustomerList = customer.data;
        }
        return $q.resolve(vm.CustomerList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getReportSettingById(id) {
      if (id) {
        vm.pagingInfo = {
          id: id
        };
        return ReportMasterFactory.getCustomerReportList().query(vm.pagingInfo).$promise.then((response) => {
          vm.EmailSettings = response.data;
          if (vm.EmailSettings) {
            var emailDetail = vm.EmailSettings.EmailAddressDetail
            if (emailDetail && emailDetail.length > 0) {
              _.each(emailDetail, (item) => {
                item.autoCompletePersonName = angular.copy(autoCompletePersonName);
                item.autoCompletePersonName.keyColumnId = item.refEmailID;
              });
            }
            else {
              emailDetail = [{
                id: getPersonMinId(),
                refID: null,
                refEmailID: null,
                autoCompletePersonName: angular.copy(autoCompletePersonName)
              }]
            }

            vm.emailReportSetting = {
              id: vm.cid,
              reportID: vm.EmailSettings.reportID,
              customerID: vm.EmailSettings.customerID,
              schedule: vm.EmailSettings.schedule,
              IsActive: vm.EmailSettings.IsActive,
              EmailAddressDetail: emailDetail
            };
          }
          return $q.resolve(vm.EmailSettings);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.emailReportSetting = {
          id: null,
          reportID: vm.pReportID,
          customerID: vm.pCustomerID,
          schedule: monthlyEmailReportSetting.id,//"Monthly"
          IsActive: true,
          EmailAddressDetail: [{
            id: getPersonMinId(),
            refID: null,
            refEmailID: null,
            autoCompletePersonName: angular.copy(autoCompletePersonName)
          }]
        };
      }
    }

    var autocompletePromise = [getReportNameList(), getCustomerList(), getReportSettingById(vm.cid)];

    let getReportDetail = (item) => {
      if (item) {
        vm.emailReportSetting.reportID = item ? item.id : null;
      }
      else {
        vm.emailReportSetting.reportID = null;
      }
    }
    let getCustomerDetail = (item) => {
      if (item) {
        vm.emailReportSetting.customerID = item ? item.id : null;
        vm.selectedCustomerId = item.id;
        autoCompletePersonName.addData.customerId = item.id;
        getCustomerContactPersonList();
      }
      else {
        vm.ContactPersonList = [];
        vm.selectedCustomerId = null;
        vm.emailReportSetting.customerID = null;
      }
    }
    let getScheduleDetail = (item) => {
      if (item) {
        vm.emailReportSetting.schedule = item ? item.id : null;
      }
      else {
        vm.emailReportSetting.schedule = null;
      }
    }

    let initAutoComplete = () => {
      vm.autoCompleteReportName = {
        columnName: 'reportName',
        keyColumnName: 'id',
        keyColumnId: (vm.emailReportSetting.reportID ? vm.emailReportSetting.reportID : null),
        inputName: 'reportName',
        placeholderName: 'Report Name',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getReportDetail
      };
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.pCustomerID ? parseInt(vm.pCustomerID) : null,//(vm.emailReportSetting.customerID ? vm.emailReportSetting.customerID : null),
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: false,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getCustomerDetail
      };
      vm.autoCompleteScheduleType = {
        columnName: 'Name',
        keyColumnName: 'id',
        keyColumnId: (vm.emailReportSetting.schedule ? vm.emailReportSetting.schedule : null),
        inputName: 'shedule',
        placeholderName: 'Schedule',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getScheduleDetail
      };
    }

    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      $timeout(() => {
        initAutoComplete();
      });
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });
    /*Used to Save record*/
    vm.save = () => {
      if (vm.AddEmailReportSettingForm.$invalid) {
        BaseService.focusRequiredField(vm.AddEmailReportSettingForm);
        return;
      }
      var emailScheduleObj = {};
      emailScheduleObj.reportID = vm.emailReportSetting.reportID;
      emailScheduleObj.entity = null;
      emailScheduleObj.customerID = vm.emailReportSetting.customerID;
      emailScheduleObj.schedule = vm.emailReportSetting.schedule;
      emailScheduleObj.IsActive = vm.emailReportSetting.IsActive;

      var addedPersons = [];
      var tempData = _.filter(vm.emailReportSetting.EmailAddressDetail, function (data) { return data.id < 0; });
      if (tempData) {
        addedPersons = angular.copy(tempData);
      }

      emailScheduleObj.addedPersons = addedPersons;
      emailScheduleObj.deletedPersons = vm.deletedPersons;
      if (!vm.cid) {
        vm.cgBusyLoading = ReportMasterFactory.saveCustomerReport().query({ emailScheduleObj: emailScheduleObj }).$promise.then((response) => {
          if (response && response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        emailScheduleObj.id = vm.cid;
        vm.cgBusyLoading = ReportMasterFactory.updateCustomerReport().query({ emailScheduleObj: emailScheduleObj }).$promise.then((response) => {
          if (response && response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };
    /*Used to close pop-up*/
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddEmailReportSettingForm);
      if (isdirty) {
        let data = {
          form: vm.AddEmailReportSettingForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    /*on load submit form*/
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddEmailReportSettingForm);
    });
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

  }
})();

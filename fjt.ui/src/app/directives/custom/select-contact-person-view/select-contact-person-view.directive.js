(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('selectContactPersonView', selectContactPersonView);

  /** @ngInject */
  function selectContactPersonView(USER, CustomerFactory, CORE) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        contactPersonData: '<',
        selectContactPersonCallBack: '&'
      },
      templateUrl: 'app/directives/custom/select-contact-person-view/select-contact-person-view.html',
      controller: selectContactPersonViewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */
    function selectContactPersonViewCtrl($scope, BaseService, DialogFactory, ContactPersonFactory) {
      const vm = this;
      vm.popupParamData = angular.copy($scope.contactPersonData);
      vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
      vm.emptyMsgForContact = USER.ADMIN_EMPTYSTATE.CUSTOMER_CONTACTPERSON;
      vm.companyName = vm.popupParamData ? (vm.popupParamData.companyName ? vm.popupParamData.companyName : null) : null;
      vm.mfgType = vm.popupParamData ? (vm.popupParamData.mfgType ? vm.popupParamData.mfgType : null) : null;
      vm.custPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
      vm.custPersonViewActionBtnDet.SetPrimary.isVisible = (vm.popupParamData && vm.popupParamData.isFromContactTab) ? true : false;
      if (vm.custPersonViewActionBtnDet.SetPrimary.isVisible) {
        vm.custPersonViewActionBtnDet.SetPrimary.isDisable = !(BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateContactPerson));
      }
      vm.custPersonViewActionBtnDet.Update.isVisible = vm.custPersonViewActionBtnDet.Duplicate.isVisible = true;
      if (vm.popupParamData && vm.popupParamData.isMasterPage) {
        vm.custPersonViewActionBtnDet.AddNew.isVisible = vm.custPersonViewActionBtnDet.ApplyNew.isVisible = vm.custPersonViewActionBtnDet.Refresh.isVisible = false;
      } else {
        vm.custPersonViewActionBtnDet.ApplyNew.isVisible = vm.custPersonViewActionBtnDet.AddNew.isVisible = false;
      }
      vm.selectedDefaultContactPerson = vm.popupParamData.selectedContactPerson ? angular.copy(vm.popupParamData.selectedContactPerson) : null;
      vm.alreadySelectedContactPersonID = vm.popupParamData && vm.popupParamData.isMasterPage ? null : vm.selectedDefaultContactPerson && vm.popupParamData.alreadySelectedPersonId || 0;
      if (vm.selectedDefaultContactPerson) {
        vm.selectedDefaultContactPerson.defaultSelected = true;
      }
      vm.ContactPersonList = [];
      vm.isAddNewAddress = false;
      vm.contactPersonModel = {};
      vm.title = vm.popupParamData.isMasterPage ? 'Contacts' : 'Contact Person';

      vm.viewContactPersonOtherDet = {
        customerId: vm.popupParamData.refTransID,
        refTransID: vm.popupParamData.refTransID,
        refTableName: vm.popupParamData.refTableName,
        alreadySelectedPersonId: vm.popupParamData.alreadySelectedPersonId || null,
        showContPersonEmptyState: false,
        companyName: vm.companyName,
        isMasterPage: vm.popupParamData.isMasterPage,
        mfgType: vm.mfgType
      };

      const getCustomerContactPersonList = (isAddNew) => {
        vm.cgBusyLoading = CustomerFactory.getCustomerContactPersons().query({
          refTransID: vm.popupParamData.refTransID,
          refTableName: vm.popupParamData.refTableName,
          activePerson: !vm.isInactiveperson ? true : false,
          isOnlyPrimaryPerson: vm.isOnlyPrimaryPerson
        }).$promise.then((contactperson) => {
          vm.ContactPersonList = contactperson.data;
          /* Managed Sort logic on API side. */
          // if (vm.popupParamData && vm.popupParamData.isMasterPage) {
          // vm.ContactPersonList = (_.sortBy(vm.ContactPersonList, ['isDefault', 'fullName'])).reverse();
          // } else {
          // const defaultIDObj = _.find(vm.ContactPersonList, (item) => item.personId === vm.alreadySelectedContactPersonID);
          // if (defaultIDObj) {
          //   defaultIDObj.selectedRecordInMaster = true;
          // }
          // vm.ContactPersonList = _.sortBy(vm.ContactPersonList,
          //   [(o) => o.selectedRecordInMaster]);
          // }
          vm.allContactPersonList = [];
          vm.ContactPersonList.forEach((contactPerson) => {
            const custPersonViewActionBtnDet = angular.copy(vm.custPersonViewActionBtnDet);
            custPersonViewActionBtnDet.SetDefault.isVisible = true;
            custPersonViewActionBtnDet.SetDefault.isDisable = (vm.ContactPersonList.filter((item) => item.isActive)).length > 1 ? false : contactPerson.isDefault;
            const objContactPerson = {
              contactPerson: contactPerson,
              viewContactPersonOtherDet: {
                customerId: vm.popupParamData.refTransID,
                refTransID: vm.popupParamData.refTransID,
                refTableName: vm.popupParamData.refTableName,
                alreadySelectedPersonId: (contactPerson && contactPerson.personId) || null,
                showContPersonEmptyState: false,
                companyName: vm.companyName,
                isMaster: vm.popupParamData && vm.popupParamData.isMasterPage ? true : false,
                mfgType: vm.mfgType
              },
              custPersonViewActionBtnDet: custPersonViewActionBtnDet
            };
            vm.allContactPersonList.push(objContactPerson);
          });
          if (isAddNew) {
            const selectedContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === vm.alreadySelectedContactPersonID);
            $scope.selectContactPersonCallBack()(selectedContactPerson);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      getCustomerContactPersonList();

      vm.setDefaultPerson = (ev, callbackFn) => {
        if (callbackFn) {
          vm.setDefaultContactPerson(callbackFn);
        }
      };
      vm.setPrimaryPerson = (ev, contPersonMst) => {
        if (contPersonMst) {
          const personIds = [contPersonMst.personId];
          vm.cgBusyLoading = ContactPersonFactory.managePrimaryContactPersons().query({
            personIds: personIds,
            refTransID: vm.popupParamData.refTransID || null,
            refTableName: vm.popupParamData.refTableName || null,
            isPrimary: !contPersonMst.isPrimary
          }).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              getCustomerContactPersonList();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      vm.selectDefaultPerson = (ev, callbackfn) => {
        if (callbackfn) {
          vm.alreadySelectedContactPersonID = callbackfn.personId;
          const selectedContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === vm.alreadySelectedContactPersonID);
          $scope.selectContactPersonCallBack()(selectedContactPerson);
        }
      };
      // To set contact person as default one
      vm.setDefaultContactPerson = (contPersonMst) => {
        const defaultContactPersonDet = {
          personId: contPersonMst.personId,
          refTransID: vm.popupParamData.refTransID,
          refTableName: vm.popupParamData.refTableName,
          isDefault: !contPersonMst.isDefault
        };
        vm.cgBusyLoading = CustomerFactory.setCustContactPersonDefault().query(defaultContactPersonDet).$promise.then((resp) => {
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            getCustomerContactPersonList();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getContactPersonList = () => {
        getCustomerContactPersonList();
      };

      // remove contact person
      vm.removePerson = (ev, callBackPerson) => {
        vm.deleteContactPersonInfo(callBackPerson, ev);
      };
      /* delete customer contact person */
      vm.deleteContactPersonInfo = (contactPerson) => {
        if (!contactPerson || !contactPerson.personId) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const selectedIDs = [contactPerson.personId];
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Contact person', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ContactPersonFactory.deleteCustomerContactPerson().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res) {
                if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: 'Contact person'
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return ContactPersonFactory.deleteCustomerContactPerson().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = contactPerson ? contactPerson.personFullName : null;
                      data.PageName = 'Contact person';
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                } else {
                  if (vm.alreadySelectedContactPersonID === contactPerson.personId && (vm.popupParamData && !vm.popupParamData.isMasterPage)) {
                    vm.alreadySelectedContactPersonID = vm.popupParamData && vm.selectedDefaultContactPerson && vm.popupParamData.alreadySelectedPersonId ? vm.popupParamData.alreadySelectedPersonId : 0;
                    vm.selectedDefaultContactPerson = vm.popupParamData && vm.popupParamData.selectedContactPerson ? angular.copy(vm.popupParamData.selectedContactPerson) : null;
                    $scope.selectContactPersonCallBack()(vm.selectedDefaultContactPerson);
                  }
                  getCustomerContactPersonList();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // select contact person
      vm.duplicatePerson = () => {
        getCustomerContactPersonList();
      };
      // Open add/edit contact persopn popup
      vm.addEditContactPerson = (ev) => {
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
        if (BaseService.checkRightToAccessPopUp(popUpData)) {
          const data = {};
          data.companyName = vm.companyName;
          data.refTransID = vm.popupParamData.refTransID;
          data.refTableName = vm.popupParamData.refTableName;
          data.isFromMasterpage = vm.popupParamData && vm.popupParamData.isMasterPage ? true : false;
          data.mfgType = vm.mfgType,
            DialogFactory.dialogService(
              USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
              USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
              ev,
              data).then(() => {
              }, (savedContactPersonDet) => {
                if (savedContactPersonDet) {
                  if (vm.popupParamData && !vm.popupParamData.isMasterPage) {
                    vm.alreadySelectedContactPersonID = savedContactPersonDet.personId;
                    $scope.selectContactPersonCallBack()(savedContactPersonDet);
                  }
                  getCustomerContactPersonList(vm.popupParamData && vm.popupParamData.isMasterPage ? false : true);
                }
              });
        }
      };

      // open addEdit contact person popup
      vm.addEditContactPersonCallBack = (ev, callBackContactPerson) => {
        if (callBackContactPerson) {
          let objContactPerson = _.find(vm.ContactPersonList, (item) => item.personId === callBackContactPerson.personId);
          const objcopyContactPerson = _.find(vm.allContactPersonList, (item) => item.contactPerson.personId === callBackContactPerson.personId);
          if (objContactPerson) {
            objContactPerson = callBackContactPerson;
            if (objContactPerson.personId === vm.alreadySelectedContactPersonID) {
              $scope.selectContactPersonCallBack()(objContactPerson);
            }
          }
          if (objcopyContactPerson) {
            objcopyContactPerson.contactPerson = callBackContactPerson;
          }
          getCustomerContactPersonList(vm.popupParamData && vm.popupParamData.isMasterPage ? false : true);
        }
      };
    }
  }
})();

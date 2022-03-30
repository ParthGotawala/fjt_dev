(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('CustPartNumberPopupController', CustPartNumberPopupController);

  /** @ngInject */

  function CustPartNumberPopupController(CORE, ComponentFactory, ManufacturerFactory, data, $mdDialog, BaseService, $q,
    $timeout, DialogFactory, $scope, USER) {
    if (!data || !data.cpn) {
      $mdDialog.cancel();
      return;
    }

    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.cpn = data.cpn;
    vm.Revision = data.Revision;
    vm.componentlist = data.componentIdList;
    vm.addedPartListFromAutoComplete = [];
    vm.MfgLabelConstant = CORE.LabelConstant.MFG;

    vm.headerdata = [
      { label: vm.MfgLabelConstant.CPN, value: vm.cpn, displayOrder: 1 },
      { label: 'Rev', value: vm.Revision, displayOrder: 2 }
    ];

    //get alias for auto-complete-search
    function getAliasSearch(searchObj) {
      return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
        if (componentAlias && componentAlias.data.data) {
          componentAlias.data.data = _.reject(componentAlias.data.data, (item) => {
            var component = _.filter(vm.componentlist, (obj) => obj === item.id);
            if (component.length > 0) {
              return true;
            }
            else {
              const addComponent = _.find(vm.addedPartListFromAutoComplete, (objAddedMFGItem) => objAddedMFGItem.id === item.id);
              if (addComponent) {
                return true;
              }
            }
          });

          if (searchObj.id) {
            $timeout(() => {
              $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
            });
          }
        }
        return componentAlias.data.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* when selected mapping mfg from auto complete */
    function addSelectedMappingMFGPart(selectedItem) {
      if (selectedItem) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ALTERNATE_PART_CPN_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, selectedItem.mfgPN);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.autoCompleteComponentAlias.isRequired = false;
            const existsItem = _.find(vm.addedPartListFromAutoComplete, (item) => item.id === selectedItem.id);
            if (!existsItem) {
              vm.addedPartListFromAutoComplete.push(selectedItem);
            }
            vm.autoCompleteComponentAlias.keyColumnId = null;
            $timeout(() => {
              $scope.$broadcast(vm.autoCompleteComponentAlias.inputName, null);
            });
          }
        }, () => {
          vm.autoCompleteComponentAlias.keyColumnId = null;
          vm.AddCPNrevisionForm.$setDirty(true);
          $timeout(() => {
            $scope.$broadcast(vm.autoCompleteComponentAlias.inputName, null);
          });
        });
      }
    };

    /* remove mapping mfg from added list */
    vm.removeSelectedMappingMFGPart = (selectedItem) => {
      _.remove(vm.addedPartListFromAutoComplete, (item) => item.id === selectedItem.id);
    };

    vm.autoCompleteComponentAlias = {
      columnName: 'mfgPN',
      keyColumnName: 'id',
      controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
      viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
      keyColumnId: null,
      inputName: vm.MfgLabelConstant.MFGPN,
      placeholderName: vm.MfgLabelConstant.MFGPN,
      //isRequired: vm.addedPartListFromAutoComplete.length > 0 ? true : false,
      isRequired: true,
      isAddnew: true,
      addData: {
        mfgType: CORE.MFG_TYPE.MFG,
        popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
        pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
      },
      callbackFn: function (obj) {
        const searchObj = {
          id: obj.id,
          mfgType: CORE.MFG_TYPE.MFG,
          inputName: vm.autoCompleteComponentAlias.inputName,
          categoryID: CORE.PartCategory.Component
        };
        return getAliasSearch(searchObj);
      },
      onSelectCallbackFn: addSelectedMappingMFGPart,
      onSearchFn: function (query) {
        const searchObj = {
          mfgType: CORE.MFG_TYPE.MFG,
          isGoodPart: CORE.PartCorrectList.CorrectPart,
          query: query,
          inputName: vm.autoCompleteComponentAlias.inputName,
          categoryID: CORE.PartCategory.Component
        };
        return getAliasSearch(searchObj);
      }
    };

    vm.addUpdaterevisionPN = () => {
      //!vm.AddCPNrevisionForm.$valid || !vm.checkFormDirty(vm.AddCPNrevisionForm) || vm.addedPartListFromAutoComplete.length == 0
      if (vm.addedPartListFromAutoComplete.length === 0) {
        vm.autoCompleteComponentAlias.isRequired = true;
        BaseService.focusRequiredField(vm.AddCPNrevisionForm);
        return;
      }
      vm.cgBusyLoading = ManufacturerFactory.getAssumblyListFromCPN().query({ id: data.refCPNPartID }).$promise.then((response) => {
        if (response && response.data && response.data.length > 0) {
          const AssemblyList = _.map(response.data, 'PIDCode').join(',');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ALTERNATE_PART_CONFIRMATION_BOM_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, AssemblyList);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.saveCPN();
            }
          }, () => {
          });
        }
        else {
          vm.saveCPN();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.saveCPN = () => {
      var custRevisionPnModel = {
        refCPNPartID: data.refCPNPartID,
        customerID: data.customerID,
        refComponentIDs: _.map(vm.addedPartListFromAutoComplete, 'id')
      };
      vm.cgBusyLoading = ManufacturerFactory.saveCustMFGPN().save(custRevisionPnModel).$promise.then((res) => {
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm.pop();
          DialogFactory.closeDialogPopup();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*Used close to pop-up*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddCPNrevisionForm);
      if (isdirty) {
        const data = {
          form: vm.AddCPNrevisionForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.goToComponentList = () => {
        BaseService.goToPartList();
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddCPNrevisionForm);
    });
  }
})();

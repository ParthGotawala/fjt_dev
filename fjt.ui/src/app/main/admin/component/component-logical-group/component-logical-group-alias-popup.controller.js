(function () {
  'use strict';
  angular
    .module('app.admin.componentLogicalGroup')
    .controller('ComponentLogicalGroupAliasController', ComponentLogicalGroupAliasController);
  /** @ngInject */
  function ComponentLogicalGroupAliasController($mdDialog, $q, DialogFactory, ComponentLogicalGroupFactory, data, CORE, USER, BaseService, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.tableName = CORE.TABLE_NAME;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_LOGICAL_GROUP_EMPTY;
    vm.isSaveDisable = true;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    var loginUser = BaseService.loginUser;
    vm.title = data.name;
    vm.isAddDelete = false;
    vm.genericAliasModel = {
      logicalgroupID: data.id,
      alias: [],
    }
    vm.alias = data.aliasText;
    vm.autoCompleteAlias = null;

    vm.headerdata = [];
    //vm.headerdata.push({
    //  label: 'Name',
    //  value: vm.title,
    //  displayOrder: 1
    //});

    /* mountingType drop-down fill up */
    let mountingType = (insertedDataFromPopup) => {
      //let mountingTypeData = {
      //    logicalgroupID: data.id
      //}
      //getComponentGenericAlias(mountingTypeData);
      return ComponentLogicalGroupFactory.retrieveMountingTypesNotAddedInGroup().save().$promise.then((res) => {
        vm.tableAliasList = res.data;
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let pageInit = () => {
      var autocompletePromise = [mountingType(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        initAutoComplete();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    pageInit();

    let initAutoComplete = () => {
      if (!vm.autoCompleteAlias) {
        vm.autoCompleteAlias = {
          columnName: 'name',
          keyColumnName: 'id',
          controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Mounting Type',
          placeholderName: 'Mounting Type',
          isRequired: true,
          isAddnew: true,
          callbackFn: mountingType,
          onSelectCallbackFn: getmountingType
        }
      }
    }
    let getmountingType = (item) => {
      if (item) {
        vm.genericAliasModel.refId = item.id;
        vm.genericAliasModel.id = item.id;
        vm.genericAliasModel.name = item.name;
        vm.genericAliasModel.logicalgroupID = data.id;
        vm.isAddDelete = true;
      }
      else {
        vm.isSaveDisable = true;
      }
    }
    vm.updateAliasList = ($event, genericAliasForm) => {
      vm.isSaveDisable = false;
      vm.isAddDelete = true;
      var aliasObj = _.find(vm.genericAliasModel.alias, (item) => { return item.name == vm.genericAliasModel.name; });
      if (aliasObj) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_ALREADY_ADDED);
        messageContent.message = stringFormat(messageContent.message, vm.genericAliasModel.name);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.autoCompleteAlias.keyColumnId = null;
        vm.genericAliasForm.$setPristine();
        vm.genericAliasForm.$setUntouched();
      }
      else {
        vm.genericAliasModel.alias.unshift({
          rfqMountingTypeID: vm.genericAliasModel.id,
          name: vm.genericAliasModel.name,
          logicalgroupID: vm.genericAliasModel.logicalgroupID,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        });
        vm.autoCompleteAlias.keyColumnId = null;
        vm.genericAliasForm.$setPristine();
        vm.genericAliasForm.$setUntouched();
      }
    }
    vm.removeAliasFromList = ($event, $index) => {
      vm.genericAliasModel.alias.splice($index, 1);
      vm.checkDirty = true;
      vm.isSaveDisable = false;
      vm.isAddDelete = true;
      vm.genericAliasForm.$dirty = true;
    }
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.genericAliasForm);
      if (isdirty || vm.checkDirty) {
        let data = {
          form: vm.genericAliasForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.saveGenricAlias = () => {
      //if (BaseService.focusRequiredField(vm.genericAliasForm) || !vm.isAddDelete ){
      //  return;
      //}
      if (!vm.isAddDelete) {
        BaseService.focusRequiredField(vm.genericAliasForm);
        return;
      }
      if (vm.autoCompleteAlias.keyColumnId) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.MOUNTING_TYPE_PENDING_ADD);        
        var model = {
          messageContent : messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes)
            saveGenericAlias();
        }, () => {
        });
      }
      else {
        if (vm.isAddDelete) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DELETE_ALIAS_CONFIRM_MESSAGE);          
          var model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(model).then((yes) => {
            if (yes)
              saveGenericAlias();
          }, () => {
          });
        }
      }
    }
    function getComponentGenericAlias() {
      let mountingTypeData = {
        logicalgroupID: data.id
      }
      return ComponentLogicalGroupFactory.getLogicalGroupAlias().query(mountingTypeData).$promise.then((res) => {
        if (res && res.data) {
          vm.genericAliasModel.alias = res.data;
          _.map(vm.genericAliasModel.alias, (data) => {
            data.name = data.rfqMountingType.name;
            data.id = data.rfqMountingType.id;
            data.logicalgroupID = data.logicalgroupID;
            data.createdAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(data.createdAt, vm.DefaultDateFormat),
              data.fullName = BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
          });
        }
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      })
    }
    function saveGenericAlias() {
      vm.cgBusyLoading = ComponentLogicalGroupFactory.saveLogicalGroupAlias().save(vm.genericAliasModel).$promise.then((res) => {
        if (res.status == CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
          if (res.data.status == "alias") {
            var alias = res.data.data;
            var html = '<ul>';
            alias.forEach((x) => {
              html += '<li>' + x.alias + '</li>';
            });
            html += '</ul>';
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMPONENT_ALIAS_EXISTS);
            messageContent.message = stringFormat(messageContent.message, html);
            let obj = {
              messageContent: messageContent,
              multiple: true,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT
            };
            DialogFactory.messageAlertDialog(obj);
          }
          else {
            BaseService.currentPagePopupForm.pop();
            DialogFactory.hideDialogPopup(res.data);
          }
        }
        else if (res.status == CORE.ApiResponseTypeStatus.EMPTY) {
          vm.isAddDelete = false;
          let refreshAliasPromise = [pageInit()];
          vm.cgBusyLoading = $q.all(refreshAliasPromise).then((responses) => {
            vm.genericAliasForm.$setPristine();
            vm.genericAliasForm.$setUntouched();
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      })
    }
    //redirect to Mounting type master
    vm.goToMountingTypeList = () => {
      BaseService.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
    }
    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.genericAliasForm);
    });
  }
})();

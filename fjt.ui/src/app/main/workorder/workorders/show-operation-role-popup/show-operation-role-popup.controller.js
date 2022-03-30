(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowOperationRolePopUpController', ShowOperationRolePopUpController);

  function ShowOperationRolePopUpController($mdDialog, $scope, data, CORE, DialogFactory, WorkorderOperationFactory, BaseService, NotificationSocketFactory, WORKORDER, RoleFactory, $filter) {
    const vm = this;
    vm.roleList = [];
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_OPERATION_ROLES;
    let _RoleList = [];
    vm.isAll = false;
    vm.woOpDataElementID = data ? data.woOpDataElementID : null;
    vm.woStatus = data ? data.woStatus : null;
    vm.woOPID = data ? data.woOPID : null;
    vm.isWOUnderTermination = data ? data.isWOUnderTermination : false;
    let role;
    vm.selectedRoleList = [];

    vm.radioButtonGroup = {
      isSelectAllRole: {
        array: WORKORDER.WorkOrderRadioGroup.isSelectAllRole,
        onChange: () => {
          vm.selectedRoles();
        },
        checkDisable: () => {
          return vm.isWOUnderTermination;
        }
      }
    }

    vm.selectedRoles = () => {
      if (vm.isAll) {
        vm.selectedRoleList = [];
        var activeroleArr = _.filter(vm.roleList, function (data) {
          if (data.isActive)
            return data
        })
        vm.roleList = activeroleArr;
        _.each(activeroleArr, (role) => {
          role.isChecked = false;
        });
      }
    }

    //get all role data.
    function getAllRolesList() {
      vm.cgBusyLoading = RoleFactory.rolePermission().query().$promise.then((role) => {
        _RoleList = vm.roleList = role.data;
        getRolesListBywoOpDataelementWise();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getAllRolesList();

    //get role data workorder oepration dataelement wise.
    function getRolesListBywoOpDataelementWise() {
      vm.cgBusyLoading = WorkorderOperationFactory.getRolesListBywoOpDataelementWise().query({ woOpDataElementID: vm.woOpDataElementID }).$promise.then((roleData) => {
        if (roleData && roleData.data) {
          role = roleData.data;
        }
        vm.roleList.forEach((item) => {
          const selectedRole = role.find((r) => r.roleID === item.id);
          if (selectedRole) {
            item.isChecked = true;
            vm.selectedRoleList.push(item);
          }

        });
        let RoleselesctedData = _.filter(vm.roleList, function (data) {
          if ((data.isActive) || data.isChecked && !data.isActive) {
            return data;
          }
        });
        if (RoleselesctedData.length > 0) {
          vm.roleList = RoleselesctedData;
        }
        const isSelected = vm.roleList.find((r) => r.isChecked == true);
        if (!isSelected) {
          vm.isAll = true;
          vm.selectedRoles()
        }
      }).catch((err) => {
        return BaseService.getErrorLog(err);
      });
    }

    //Search text
    vm.SearchRole = (list, searchText) => {
      if (!searchText) {
        vm.SearchRoleText = null;
        vm.roleList = _RoleList;
        //vm.FilterOperation = true;
        return;
      }
      vm.roleList = $filter('filter')(_RoleList, { name: searchText });
      vm.FilterRoleList = vm.roleList.length > 0;
    }

    //if checkbox check/uncheck
    vm.AddToSelectedRole = (role) => {
      vm.selectedRoleList = $filter('filter')(_RoleList, { isChecked: true });
      if (vm.roleList.length == vm.selectedRoleList.length || vm.selectedRoleList.length == 0) {
        vm.isAll = true;
        vm.selectedRoles();
      }
    }

    function openWOOPRevisionPopup(callbackFn, event) {
      var model = {
        woOPID: vm.woOPID
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_CONTROLLER,
        WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_VIEW,
        event,
        model).then((versionModel) => {
          if (versionModel.opVersion && versionModel.woVersion) {
          }
          callbackFn(versionModel);
        }, (error) => {
          callbackFn();
        });
    }
    vm.ModifyPageAdded = (event) => {
      if (vm.woStatus == CORE.WOSTATUS.PUBLISHED) {
        openWOOPRevisionPopup(function (versionModel) {
          // Added for close revision dialog popup
          if (versionModel && versionModel.isCancelled) {
            vm.saveDisable = false;
            return;
          }
          if (versionModel) {
            saveRoles(versionModel);
          }
        }, event);
      }
      else {
        saveRoles();
      }
    }

    function sendNotification(versionModel) {
      if (versionModel) {
        versionModel.employeeID = loginUserDetails.employee.id;
        versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE;
        NotificationSocketFactory.sendNotification().save(versionModel).$promise.then((response) => {
          /* empty */
        }).catch((error) => {
          vm.saveDisable = false;
        });
      }
    }
    //Save role data workorder oepration dataelement wise.
    vm.save = (event) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.operationRoleForm, false)) {
        vm.saveDisable = false;
        return;
      }

      //show validation message no data selected
      if (!vm.isAll && vm.selectedRoleList.length == 0) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "role");
        let alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        vm.saveDisable = false;
        return;
      }

      vm.ModifyPageAdded(event);
    }

    //save role data workorder oepration dataelement wise function.
    function saveRoles(versionModel) {
      let _objList = {};
      _objList.woOpDataElementID = vm.woOpDataElementID;
      _objList.roleList = vm.selectedRoleList;
      _objList.woOPID = vm.woOPID;
      _objList.woNumber = data.woNumber;
      _objList.opName = data.opName;

      vm.cgBusyLoading = WorkorderOperationFactory.saveWorkorderOperationDataelement_Role().save({ listObj: _objList }).$promise.then((roleData) => {
        vm.roleData = roleData.data;
        if (vm.roleData && vm.roleData.length > 0 || roleData.status == "SUCCESS") {
          cancelDialog();
          sendNotification(versionModel);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
      });
    }

    vm.setFocus = (text) => {
      let someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    }

    function cancelDialog() {
      $mdDialog.cancel();
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.operationRoleForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        cancelDialog();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }


  }
})();

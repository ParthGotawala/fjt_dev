(function () {
  'use strict';

  angular.module('app.admin.pageright')
    .controller('pageRightController', pageRightController);

  /** @ngInject */
  function pageRightController($rootScope, $timeout, $q, USER, CORE, DialogFactory, RoleFactory, PageRightFactory, BaseService, $scope) {
    var vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.roles = [];
    vm.userList = [];
    vm.type = false;
    vm.settingtype = false;
    vm.id = null;
    vm.permissions = [];
    vm.pagepermision = [];
    vm.EmptyMessage = USER.ADMIN_EMPTYSTATE.PAGE_RIGHT;
    vm.roleID = null;
    vm.uid = null;
    vm.activeType = false;
    vm.shortcutType = false;
    vm.isChangeData = true;
    vm.mainList = [];
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.pageName = USER.ADMIN_PAGERIGHT_LABEL;
    vm.pageRole = USER.ADMIN_PAGERIGHT_ROLE_LABEL;
    vm.pageUser = USER.ADMIN_PAGERIGHT_USER_LABEL;
    vm.isRightChange = false;
    //vm.isHBChange = false;
    vm.isFeatureChange = false;
    vm.isStandardChange = false;
    vm.isRoleChange = false;
    vm.isDbViewDataSourceChange = false;
    vm.seletedValue = null;
    $rootScope.pageTitle = 'Page Rights';



    // Get Roles
    const getRoles = () => RoleFactory.rolePermission().query().$promise.then((d) => {
      vm.roles = d.data;
      return vm.roles;
    }).catch((error) => BaseService.getErrorLog(error));

    //Get user list
    const getUserList = () => PageRightFactory.getUserList().query().$promise.then((d) => {
      vm.userList = d.data;
      return vm.userList;
    }).catch((error) => BaseService.getErrorLog(error));

    //redirect to role page
    vm.AssignToRole = () => {
      BaseService.openInNew(USER.ADMIN_USER_ROLE_STATE, {});
    };

    //redirect to user page
    vm.AssignToUser = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };
    //Auto complete for roles and user
    const autocompletePromise = [getRoles(), getUserList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    });
    const initAutoComplete = () => {
      vm.autoCompleteRoles = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.id ? vm.id : null,
        inputName: 'Roles',
        placeholderName: 'Role',
        isRequired: true,
        isAddnew: false,
        callbackFn: getRoles,
        onSelectCallbackFn: vm.bindPermision
      };
      vm.autoCompleteUser = {
        columnName: 'username',
        keyColumnName: 'id',
        keyColumnId: vm.id ? vm.id : null,
        inputName: 'Users',
        placeholderName: 'User',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUserList,
        onSelectCallbackFn: vm.bindPermision
      };
    };

    //bind role or user selected permision
    vm.bindPermision = (item) => {
      if (item) {
        vm.selectedID = item ? item.id : null;
        //vm.seletedValue = item.name;
        if (!vm.settingtype) {
          //Bind Role permision
          vm.roleID = vm.selectedID;
        }
        else {
          vm.uid = vm.selectedID;
          vm.identityUserId = item ? item.IdentityUserId : null;// need to change
          vm.employeeName = item.firstName + ' ' + item.lastName;
          vm.employeeId = item ? item.employeeID : null;
        }
      } else {
        if (vm.isRoleChange || vm.isRightChange || vm.isFeatureChange || vm.isStandardChange || vm.isDbViewDataSourceChange) {
          if (!vm.settingtype) {
            $timeout(() => {
              vm.autoCompleteRoles.keyColumnId = vm.roleID;
            }, true);
          } else {
            $timeout(() => {
              vm.autoCompleteUser.keyColumnId = vm.uid;
            }, true);
          }
          vm.disableAutocomplete = true;

          //angular.element('md-autocomplete-wrap input[type="search"]').val(vm.seletedValue);
          return showWithoutSavingAlertOfClearType();
        } else {
          vm.roleID = null;
          vm.uid = null;
          vm.employeeId = null;
        }
      }
    };

    //Change Switch
    vm.changetype = () => {
      if (vm.isRoleChange || vm.isRightChange || vm.isFeatureChange || vm.isStandardChange || vm.isDbViewDataSourceChange) {
        return showWithoutSavingAlert();
      } else {
        vm.type = vm.settingtype;
        vm.selectedID = vm.roleID = vm.uid = null;
        vm.isChangeData = true;
        vm.pageList = [];
        // vm.getPageList();

        vm.autoCompleteRoles.keyColumnId = null;
        vm.autoCompleteUser.keyColumnId = null;
      }
      vm.pagerightForm.$setPristine();
    };

    //Save Permision
    vm.savePermision = () => {
      vm.pagerightForm.$dirty = false;
      vm.pagerightForm.$setPristine();
      // if (!vm.isChangeData) {

      if (BaseService.focusRequiredField(vm.pagerightForm, vm.isRightChange || vm.isFeatureChange || vm.isStandardChange || vm.isDbViewDataSourceChange)) {
        return;
      }
      if (!vm.settingtype) {
        //Save page permision to role
        $scope.$broadcast('SaveRoleFeature');
        //$scope.$broadcast('AssignPagePermisionToRole');
        vm.pagerightForm.$dirty = false;
        //vm.AssignPagePermisionToRole();
      } else {
        //save user page permision
        //$scope.$broadcast('AssignPagePermissionToUser');
        $scope.$broadcast('SaveRoleRight');
        vm.pagerightForm.$dirty = false;
        //vm.AssignPagePermissionToUser();
      }
      // }
    };

    /* Show save alert popup when performing switch change*/
    const showWithoutSavingAlert = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.type = vm.settingtype;
          vm.isRightChange = false;
          //vm.isHBChange = false;
          vm.isFeatureChange = false;
          vm.isRoleChange = false;
          vm.isStandardChange = false;
          vm.isDbViewDataSourceChange = false;
          vm.selectedID = vm.roleID = vm.uid = null;
          vm.isChangeData = true;
          vm.pageList = [];
          vm.autoCompleteRoles.keyColumnId = null;
          vm.autoCompleteUser.keyColumnId = null;
          return true;
        }
      }, () => {
        vm.settingtype = !vm.settingtype;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Show save alert popup when performing switch change*/
    const showWithoutSavingAlertOfClearType = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isRightChange = false;
          //vm.isHBChange = false;
          vm.isFeatureChange = false;
          vm.isRoleChange = false;
          vm.isStandardChange = false;
          vm.isDbViewDataSourceChange = false;
          vm.roleID = null;
          vm.uid = null;
          vm.employeeId = null;
          vm.autoCompleteRoles.keyColumnId = null;
          vm.autoCompleteUser.keyColumnId = null;
          vm.disableAutocomplete = false;
          return true;
        }
      }, () => {
        vm.disableAutocomplete = false;
        if (!vm.settingtype) {
          vm.autoCompleteRoles.keyColumnId = vm.roleID;
        } else {
          vm.autoCompleteUser.keyColumnId = vm.uid;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();

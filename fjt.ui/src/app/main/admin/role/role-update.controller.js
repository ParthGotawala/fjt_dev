(function () {
  'use strict';

  angular
    .module('app.admin.role')
    .controller('RoleUpdateController', RoleUpdateController);


  /** @ngInject */
  function RoleUpdateController($q, $state, $stateParams, USER, CORE, BaseService,
    RoleFactory, PageDetailFactory, RolePagePermisionFactory, DialogFactory, $timeout, $filter, $scope, $mdDialog) {
    const vm = this;
    let _pageList;
    var oldRoleName = "";
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.currentPage = 'vm.roleForm';
    vm.activeType = false;
    vm.shortcutType = false;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.SuperAdminName = CORE.Role.SuperAdmin;
    vm.IsSystemGenerated = false;
    vm.isRightChange = false;
    vm.isFeatureChange = false;
    vm.isStandardChange = false;
    vm.isDbViewDataSourceChange = false;
    vm.permissions = [];
    vm.permissionGroup = {};
    vm.otherPermissions = [];
    vm.rolePageDetail = {};
    vm.pagepermision = [];
    vm.pageName = USER.ADMIN_USER_ROLE_LABEL;
    vm.role = { isActive: true };
    vm.roleId = $stateParams.id ? parseInt($stateParams.id) : 0;

    function init() {
      if (vm.roleId && vm.roleId != 0) {
        vm.isEdit = true;
        vm.GetRoleByID();
      } else {
        vm.isEdit = false;
      }
      if (vm.roleId) {
        vm.isUpdatePagePermison = true
      }
      else {
        vm.isUpdatePagePermison = false
      }
    }

    /* key type template*/
    vm.goBack = () => {
      if (vm.roleForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      }
      else {
        $state.go(USER.ADMIN_USER_ROLE_STATE);
      }
    }

    let selectRole = (item) => {
      if (item) {
        $state.go(USER.ADMIN_USER_ROLE_UPDATE_STATE, { id: item.id });
        $timeout(() => {
          vm.autoCompleteRole.keyColumnId = null;
        }, true);
      }
    }

    let getRoleSearch = (searchObj) => {
      return RoleFactory.rolePermission().query(searchObj).$promise.then((response) => {
        if (response && response.data) {
          vm.roles = _.sortBy(response.data, 'accessLevel');
          return vm.roles;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /*Auto-complete for Search Role */
    vm.autoCompleteRole = {
      columnName: 'name',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Role',
      placeholderName: 'Role',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectRole,
      onSearchFn: function (query) {
        let searchobj = {
          searchquery: query
        }
        return getRoleSearch(searchobj);
      }
    }


    function showWithoutSavingAlertforBackButton() {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      }
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          $state.go(USER.ADMIN_USER_ROLE_STATE);
        }
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* retrieve employee*/
    vm.GetRoleByID = () => {
      vm.cgBusyLoading = RoleFactory.role().query({ id: vm.roleId }).$promise.then((data) => {
        if (data && data.data) {
          vm.role = data.data.role;
          vm.IsSystemGenerated = vm.role.systemGenerated;
          if (vm.roleId && vm.roleForm) {
            BaseService.checkFormValid(vm.roleForm, false);
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    //Call initial Method
    init();

    let getSelectedPermissions = (permissions) => {
      let result = [];
      return permissions.filter((permission) => permission.isChecked).map((permission) => permission.id);
    }

    //redirect on page rights form role page
    vm.AssignToRole = () => {
      BaseService.openInNew(USER.ADMIN_PAGERIGHT_STATE, {})
    }

    //Assign page permision To role
    vm.AssignPagePermissionToRole = () => {
      // Used to focus on first error filed of form
      // if (!vm.roleForm.$dirty && (!vm.isRightChange && !vm.isFeatureChange && !vm.isStandardChange && !vm.isDbViewDataSourceChange) && vm.roleId) {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.roleForm, (vm.isRightChange || vm.isFeatureChange || vm.isStandardChange || vm.isDbViewDataSourceChange))) {
        vm.saveDisable = false;
        return;
      }
      //if (vm.roleForm.$dirty || (vm.isRightChange || vm.isFeatureChange || vm.isStandardChange || vm.isDbViewDataSourceChange)) {
      //scope.$broadcast('AssignPagePermisionToRole');
      $scope.$broadcast('SaveRoleFeature');
      $timeout(() => {
        vm.saveDisable = false;
      })
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.roleForm];
    });
    var savedRoleRight = $scope.$on("savedRoleRight", function (evt, data) {
      if (data) {
        vm.saveDisable = false;
        vm.roleForm.$setPristine();
        vm.isRightChange = vm.isFeatureChange = vm.isStandardChange = vm.isDbViewDataSourceChange = false;
      }
    })
    var setrole = $scope.$on("setroleFrom", function (evt, data) {
      vm.saveDisable = false;
      if (vm.roleId == data) {
        vm.roleForm.$setPristine();
      } else {
        vm.roleForm.$setPristine();
        $state.go(USER.ADMIN_USER_ROLE_UPDATE_STATE, { id: data });
      }
    })

    var setRolePermission = $scope.$on("setrolepermissionFrom", function (evt, data) {
      if (vm.roleId == data) {
        vm.roleForm.$setPristine();
      }
      else {
        vm.roleForm.$setPristine();
        $state.go(USER.ADMIN_USER_ROLE_UPDATE_STATE, { id: data });
      }
      vm.saveDisable = false;
    })

    // destory on event on controller destroy
    $scope.$on('$destroy', function () {
      setrole();
      BaseService.currentPageForms = [];
      $mdDialog.hide(false, { closeAll: true });
    });

    vm.setAll = (permissions, status) => {
      permissions.forEach((permission) => {
        permission.isChecked = status;
      });
    };

    //Called when select any permissions
    vm.permissionSelected = (permissions, key) => {
      const checked = permissions.filter((permission) => permission.isChecked);
      if (checked.length === permissions.length) {
        vm.permissionGroup[key] = true;
      } else {
        vm.permissionGroup[key] = false;
      }
    };

    vm.pagepermissionSelected = (permissions, key) => {
      permissions.isChecked = true;
      permissions.isChange = true;
      let ActiveCount = _.filter(vm.pageList, (page) => {
        return !page.isActive;
      });
      vm.activeType = ActiveCount.length > 0 ? false : true;
      let totalRO = _.filter(vm.pageList, (page) => {
        return !page.RO;
      });
      vm.ROType = totalRO.length > 0 ? false : true;
      let totalRW = _.filter(vm.pageList, (page) => {
        return !page.RW;
      });
      vm.RWType = totalRW.length > 0 ? false : true;
      let totalShortcut = _.filter(vm.pageList, (page) => {
        return !page.isShortcut;
      });
      vm.shortcutType = totalShortcut.length > 0 ? false : true;

    }

    vm.CheckStepAndAction = (msWizard) => {
      if (msWizard.selectedIndex == 0) {
        if (vm.isEdit !== true)
          vm.addRole(msWizard);
        if (vm.isEdit === true)
          vm.updateRole(msWizard, vm.role.id)
        vm.ischangePage = false;
      }
    }

    vm.LoadPreviousStep = (msWizard) => {
      if (msWizard.selectedIndex == 1) {
        msWizard.previousStep();
      }
    }

    vm.onTabChanges = (TabName, msWizard) => {
      vm.ischangePage = false;
    }

    vm.SearchPage = (list, searchText) => {
      if (!searchText) {
        vm.SearchPageText = null;
        vm.pageList = _pageList;
        return;
      }
      vm.pageList = $filter('filter')(_pageList, { pageName: searchText });

    }

    //Function call on standard blur event and check standard name exist and ask for confirmation
    vm.checkDuplicateRoleName = () => {
      if (oldRoleName != vm.role.name) {
        if (vm.roleForm && vm.roleForm.roleName.$dirty && vm.role.name) {
          vm.cgBusyLoading = RoleFactory.checkDuplicateRoleName().query({
            id: vm.role.id,
            name: vm.role.name,
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldRoleName = angular.copy(vm.role.name);
            if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateRoleName) {
              displayRoleNameUniqueMessage();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
    }

    /* display standard name unique confirmation message */
    let displayRoleNameUniqueMessage = () => {
      oldRoleName = '';
      vm.role.name = null;

      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, "Role name");
      let obj = {
        messageContent: messageContent,
      };
      DialogFactory.messageAlertDialog(obj).then((okResp) => {
        let roleNameEle = angular.element(document.querySelector('#roleName'));
        roleNameEle.focus();
      });
    }

    vm.checkFormDirty = (msWizardform) => {
      let result = BaseService.checkFormDirty(msWizardform, null);
      return result;
    }

    vm.addRole = () => {
      $state.go(USER.ADMIN_USER_ROLE_UPDATE_STATE, { id: null });
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();


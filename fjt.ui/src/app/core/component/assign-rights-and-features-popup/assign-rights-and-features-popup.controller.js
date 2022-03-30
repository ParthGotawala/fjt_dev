(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AssignRightsAndFeaturesPopupController', AssignRightsAndFeaturesPopupController);
    /** @ngInject */
    function AssignRightsAndFeaturesPopupController(
      AssignRightsandFeturesFactory,
      RoleFactory, $mdDialog, data, BaseService,
      CONFIGURATION, CORE, USER, EntityFactory, $timeout, RolePagePermisionFactory, $scope, uiSortableMultiSelectionMethods, $state, $filter, $q, DialogFactory) {
        const vm = this;
        vm.roles = [];
        vm.EmptyMesssageUsers = CONFIGURATION.CONFIGURATION_EMPTYSTATE.ASSIGNUSERS;
        const loginUserDetails = BaseService.loginUser;
        const empID = loginUserDetails.employee.id;
        vm.selectedlist = data.selectedFeatureOrPage;
        vm.selectedPageOrFeature = data.selectedPageOrFeature;
        vm.currentRole = data.selectedCurrentRole;
        vm.isActionSelected = data.isActionSelected;
        vm.constantAssignRightsAndFeatures = CORE.AssignRightsAndFeatures;
        vm.title = data.titleForPopupHeader;
        vm.selectedCriteria = data.selectedCriteria;
        let _userAddedList = [];
        let _userNoAddedList = [];
        vm.isRoleWisedGetUsers = false;
        vm.SearchNoAddedListUser = null;
        vm.SearchNoAddedListUser = null;
        vm.isContainMasterUser = false;
        vm.isActionPerformedAny = false;
        // vm.debounceConstant = CORE.Debounce;
        // vm.saveDisable = false;

      if(vm.isActionSelected === vm.constantAssignRightsAndFeatures.VIEW){
        vm.RoleVal = null;
      }else{
        vm.RoleVal = 0;
      }
      // Get Roles
      vm.getRoles = () => RoleFactory.rolePermission().query().$promise.then((role) => {
        role.data.push({
          id: -1,
          name: 'All'
        });
        vm.roles = role.data;
        // initAutoComplete();
        return vm.roles;
      }).catch((error) => BaseService.getErrorLog(error));

    // //bind role or user selected permision
    vm.bindPermision = (role) => {
      vm.isRoleWisedGetUsers = false;
        if (role && role.id) {
          vm.RoleVal = role.id;
        }else{
          vm.RoleVal = 0;
        }
        getAllUsers();
    };

    //initialize auto complete.
    const init = () => {
      vm.autoCompleteRoles = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.id ? vm.id : null,
        inputName: 'Roles',
        placeholderName: 'Role',
        isRequired: true,
        isAddnew: false,
        callbackFn: vm.getRoles,
        onSelectCallbackFn: vm.bindPermision
      };
    };

    /* get all employees to add/remove from access widget */
    const getAllUsers = () => {
      vm.SearchAddedListUser = null;
      vm.SearchNoAddedListUser = null;

      // Get assigned employee list based on selected Criteria page or feature
      let promise1 = [];
      if(vm.isActionSelected === vm.constantAssignRightsAndFeatures.EDIT || vm.isActionSelected === vm.constantAssignRightsAndFeatures.VIEW) {
          if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.PERMISSIONS){
            if(vm.selectedPageOrFeature.pageOrFeatureId) {
              promise1 = AssignRightsandFeturesFactory.retrieveEmployeeListForRights().query({
                pageId: vm.selectedPageOrFeature.pageOrFeatureId,
                selectedRole: vm.RoleVal
              }).$promise.then((res) => {
                return res;
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }else if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.FEATURES){
            if(vm.selectedPageOrFeature.pageOrFeatureId){
              promise1 = AssignRightsandFeturesFactory.retrieveEmployeeListForFeatureRights().query({
                featureId: vm.selectedPageOrFeature.pageOrFeatureId,
                selectedRole: vm.RoleVal
              }).$promise.then((res) => {
                return res;
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
      }

      // Get employee list based on condition if role selected get role wised otherwised get all employees
      let promise2 = [];
      if(vm.RoleVal && vm.RoleVal !== 0){
        promise2 = AssignRightsandFeturesFactory.retrieveEmployeeListForRights().query({
          selectedRole: vm.RoleVal
        }).$promise.then((res) => {
          return res;
        }).catch((error) => BaseService.getErrorLog(error));
      }else{
        promise2 = AssignRightsandFeturesFactory.retrieveEmployeeListForRights().query().$promise.then((res) => {
          return res;
        }).catch((error) => BaseService.getErrorLog(error));
      }


      // Call for get reponse of above 2 methods in sequence and set assign users to vm.userAddedList
      // or not assigned employees to vm.userNoAddedList conditionally
      $q.all([promise1, promise2]).then((result) => {
        _userAddedList = vm.userAddedList = [];
        _userNoAddedList = vm.userNoAddedList = [];
        if(result && result[0] && result[0].data){
          const res = result[0];
          if(res.data){
            _.remove(res.data, (item) => item.id === loginUserDetails.employee.id);
            if(res.data.length > 0){
              vm.userAddedList = res.data;
              reorderList();
              _userAddedList = angular.copy(vm.userAddedList);
            }
          }
        }
        if(result && result[1] && result[1].data){
          const res = result[1];
          if(res.data){
            _.remove(res.data, (item) => item.id === loginUserDetails.employee.id);
            if(res.data.length === 0 && (result[0].length === 0 || result[0].data.length === 0)){
              vm.isRoleWisedGetUsers = true;
            }
            if(res.data.length > 0){
              vm.userNoAddedList = res.data;
              if(result[0].data){
                _.each(result[0].data, (assignedUsers) => {
                  _.remove(res.data, (item) => item.id === assignedUsers.id);
                }, vm.userNoAddedList);
              }
              reorderList();
              _userNoAddedList = angular.copy(vm.userNoAddedList);
              if (_userNoAddedList.length === 0 && _userAddedList.length === 0) {
                vm.isContainMasterUser = false;
              }
              else {
                vm.isContainMasterUser = true;
              }
              setSelectableListItem();
              if(vm.SelectUser){
                $timeout(() => {
                  vm.SelectUser.$setPristine();
                  vm.SelectUser.$dirty = false;
                });
              }
            }
          }
        }
      });
    };

    // Refresh to get employees
    vm.refreshDataUser = () => {
      vm.isHideSearchButtonUser = false;
      getAllUsers();
    };

    if (empID) {
      vm.getRoles();
      init();
      getAllUsers();
    } else {
      vm.cancel();
    }

    // Add new employee
    vm.addDataEmployee = (data, ev) => {
      var data = {};
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
          USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
          ev,
          data).then(() => { // empty
          }, (data) => {
            if (data) {
              vm.refreshDataUser();
            }
          },
          () => { //error
          });
      }
    };

    // Ordering list of employees
    const reorderList = () => {
      _userAddedList = _.sortBy(_userAddedList, 'firstName');
      _userNoAddedList = _.sortBy(_userNoAddedList, 'firstName');
      vm.userAddedList = _.sortBy(vm.userAddedList, 'firstName');
      vm.userNoAddedList = _.sortBy(vm.userNoAddedList, 'firstName');
    };

    // $scope.selectedUserListNoAdded = [];
    // $scope.selectedUserListAdded = [];
    //#region sortable option common for all list
    $scope.sortableOptionsUser = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow, :input',
      placeholder: 'beingDragged',
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: () => { //empty
      },
      sort: () => { //empty
      },
      handle: ':not(input)',
      stop: (e, ui) => {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded !== DestinationDivAdded) {
            if (SourceDivAdded === false && DestinationDivAdded === true) {
              if ($scope.selectedUserListNoAdded.length === 0) {
                $scope.selectedUserListNoAdded.push(sourceModel);
              }
              // vm.ModifyPageAddedUser('Add');
              vm.updateAddedUser('Add');
              return;
            }
            else if (SourceDivAdded === true && DestinationDivAdded === false) {
              if ($scope.selectedUserListAdded.length === 0) {
                $scope.selectedUserListAdded.push(sourceModel);
              }
              // vm.ModifyPageAddedUser('Remove');
              vm.updateAddedUser('Remove');
              return;
            }
          }
        }
      },
      connectWith: '.items-container'
    });

    //#region reset value of selected element
    const ResetSelectedUser = () => {
      $scope.selectedUserListNoAdded = [];
      $scope.selectedUserListAdded = [];
      $scope.selectAnyNoAddedUser = false;
      $scope.selectAnyAddedUser = false;
    };
    //#endregion

    //#region check for selected employee
    const checkSelectAllFlagUser = () => {
      $scope.selectAnyNoAddedUser = $scope.selectedUserListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAddedUser = $scope.selectedUserListAdded.length > 0 ? true : false;
    };
    //#endregion

    //#region unselect all element list
    const UnSelectAllUser = () => {
      angular.element('[ui-sortable]#userNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#userAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedUser();
    };
    //#endregion

    //#region unselect single element list
    const UnSelectUser = (unSelectFrom) => {
      if (unSelectFrom === 'NoAdded') {
        angular.element('[ui-sortable]#userNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#userAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedUser();
    };
    //#endregion

    //#region  set item selectable
    const SetUserSelectable = () => {
      angular.element('[ui-sortable]#userAddedList').on('ui-sortable-selectionschanged', function () {
        UnSelectUser('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedUserListAdded = _.map(selectedItemIndexes, function (i) {
          return vm.userAddedList[i];
        });
        checkSelectAllFlagUser();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#userNoAddedList').on('ui-sortable-selectionschanged', function () {
        UnSelectUser('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedUserListNoAdded = _.map(selectedItemIndexes, function (i) {
          return vm.userNoAddedList[i];
        });
        checkSelectAllFlagUser();
        $scope.$applyAsync();
      });
    };

    const setSelectableListItem = () => {
      $timeout(() => {
        SetUserSelectable();
      }, _configSelectListTimeout);
    };
    //#endregion

    //#region for destroy selection
    const DestroyUserSelection = () => {
      angular.element('[ui-sortable]#userNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#userAddedList').off('ui-sortable-selectionschanged');
    };

    const DestroyAllSelectionUser = () => {
      DestroyUserSelection();
    };
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', () => {
      DestroyAllSelectionUser();
    });
    //#endregion

    //Used this function to search employee for assign list or not assigned list
    vm.SearchUser = (searchText, RoleVal, IsAdded) => {
      UnSelectAllUser();
      if (!searchText) {
        if (IsAdded) {
          vm.SearchNoAddedListUser = null;
          vm.isHideSearchButtonUser = false;
          vm.userAddedList = _userAddedList;
          vm.FilterUserAdded = true;
        } else {
          vm.SearchNoAddedListUser = null;
          vm.isHideSearchButtonUser = false;
          vm.FilterUserNotAdded = true;
          vm.userNoAddedList = _userNoAddedList;
          }
        return;
      }
      else {
        if (IsAdded) {
          vm.isHideSearchButtonaddedUser = true;
        }
        else {
          vm.isHideSearchButtonUser = true;
        }
      }
      if (IsAdded) {
        vm.userAddedList = searchText ? ($filter('filter')(_userAddedList, { firstName: searchText })) : _userAddedList;
        vm.FilterUserAdded = vm.userAddedList.length > 0;
      }
      else {
        vm.userNoAddedList = searchText ? ($filter('filter')(_userNoAddedList, { firstName: searchText })) : _userNoAddedList;
        vm.FilterUserNotAdded = vm.userNoAddedList.length > 0;
      }
    };

    // Function is used for assign/Unassign Invidiual Multiple Selected or ALL
    vm.updateAddedUser = (addType, event) => {
      if (event) {
        event.preventDefault();
      }
      if(vm.RoleVal === 0){
        if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.PERMISSIONS){
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SELECTROLE_ASSIGN_TO_PAGERIGHT);
          const model = {
              messageContent: messageContent,
              multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }else{
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SELECTROLE_ASSIGN_TO_FEATURERIGHT);
          const model = {
              messageContent: messageContent,
              multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
      }else{
          // Invidiual Selected Multiple Selected Assign
          if (addType === 'Add') {
                _.each($scope.selectedUserListNoAdded, (item) => {
                  const added = _.find(_userAddedList, (element) => item.id === element.id);
                  if (!added) {
                    _userAddedList.push(item);
                  }
                });
                _.each($scope.selectedUserListNoAdded, (item) => {
                  _userNoAddedList = _.without(_userNoAddedList,
                    _.find(_userNoAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                setEntityUserDragDropDetails();
                vm.isActionPerformedAny = true;
                vm.assignRightPageOrFeature('Add');
                UnSelectAllUser();
          }
          // Invidiual Selected Multiple Selected Not Assign
          else if (addType === 'Remove') {
                _.each($scope.selectedUserListAdded, (item) => {
                  const added = _.find(_userNoAddedList, (element) => item.id === element.id);
                  if (!added) {
                    if (item) {
                      _userNoAddedList.push(item);
                    }
                  }
                });
                _.each($scope.selectedUserListAdded, (item) => {
                  _userAddedList = _.without(_userAddedList,
                    _.find(_userAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                setEntityUserDragDropDetails();
                vm.isActionPerformedAny = true;
                vm.assignRightPageOrFeature('Remove');
                UnSelectAllUser();
          }
          // Selected ALL Employee For Assign
          else if (addType === 'AddAll') {
                _.each(vm.userNoAddedList, (item) => {
                  const added = _.find(_userAddedList, (element) => item.id === element.id);
                  if (!added) {
                    _userAddedList.push(item);
                  }
                });
                _.each(_userAddedList, (item) => {
                  _userNoAddedList = _.without(_userNoAddedList,
                    _.find(_userNoAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                setEntityUserDragDropDetails();
                vm.isActionPerformedAny = true;
                vm.assignRightPageOrFeature('AddAll');
                UnSelectAllUser();
          }
          // Selected ALL Employee For Not Assign
          else if (addType === 'RemoveAll') {
                _.each(vm.userAddedList, (item) => {
                  const added = _.find(_userNoAddedList, (element) => item.id === element.id);
                  if (!added) {
                    _userNoAddedList.push(item);
                  }
                });
                _.each(_userNoAddedList, (item) => {
                  _userAddedList = _.without(_userAddedList,
                    _.find(_userAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                //Filter only Active Employee from _userNoAddedList once Remove All employee
                setEntityUserDragDropDetails();
                vm.isActionPerformedAny = true;
                vm.assignRightPageOrFeature('RemoveAll');
                UnSelectAllUser();
          }
      }
    };

    //Drag and drop functionality
    const setEntityUserDragDropDetails = () => {
      vm.SearchNoAddedListUser = null;
      vm.SearchNoAddedListUser = null;
      vm.isHideSearchButtonUser = false;
      vm.isHideSearchButtonUser = false;
      vm.userAddedList = _userAddedList;
      vm.userNoAddedList = _userNoAddedList;
      vm.FilterUserAdded = vm.userAddedList.length > 0;
      vm.FilterUserNotAdded = vm.userNoAddedList.length > 0;
      vm.FilterUserAdded = vm.userAddedList.length > 0;
      vm.FilterUserNotAdded = vm.userNoAddedList.length > 0;
      reorderList();
    };
    vm.removeAppliedFilter = (item) => {
      if (item) {
        let messageContent = {};
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.PAGE_WILL_BE_REMOVE);
        if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.FEATURES){
          messageContent =  angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.FEATURE_WILL_BE_REMOVE);
        }
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
        };
        DialogFactory.messageConfirmDialog(model).then(() => {
          if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.PERMISSIONS){
            _.remove(vm.selectedlist, (remove) => remove.pageID === item.pageID);
            $form.$setDirty();
          }else{
            _.remove(vm.selectedlist, (remove) => remove.featureID === item.featureID);
            $form.$setDirty();
          }
          if(vm.selectedlist.length === 0 || vm.selectedlist.length < 0){
            vm.cancel();
          }
        }, () => {
          // setFocus('initialPkgQty');
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // cancel function used to ask if any changes done or leave
    vm.cancel = () => {
      let isdirty = BaseService.checkFormDirty(vm.SelectUser);
      if(vm.isActionPerformedAny === true){
        isdirty = true;
      }else {
        isdirty = false;
      }
      if (isdirty) {
        const data = {
          form: vm.SelectUser
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        const data = {
          form: vm.SelectUser
        };
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
    };
    //close function direclty close popup and with passing data
    vm.close = (action) => {
      const data = {
        form: vm.SelectUser
      };
      if(action === 'ok'){
        $mdDialog.cancel(data);
      }else{
        $mdDialog.cancel();
      }
    };

    //Selected Employee set focus
    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    //When remove rights for employee
    vm.removeFeatureOrPage = ($chip) => {
      var idx = vm.selectedlist.indexOf($chip);
      if (idx > -1) {
        vm.selectedlist.splice(idx, 1);
      }
    };


    // Function used for call api for give rights for page or feature and used for remove rights
    vm.assignRightPageOrFeature = (addType) => {
      // vm.saveDisable = true;
      // if (BaseService.focusRequiredField(vm.SelectUser, false)) {
      //   vm.saveDisable = false;
      //   return;
      // }
      if (vm.SelectUser.$valid) {
        if(vm.RoleVal === 0) {
          if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.PERMISSIONS){
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SELECTROLE_ASSIGN_TO_PAGERIGHT);
            const model = {
                messageContent: messageContent,
                multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }else{
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SELECTROLE_ASSIGN_TO_FEATURERIGHT);
            const model = {
                messageContent: messageContent,
                multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
        }else{
          //Condition for give rights for page or feature
          if(addType === 'Add' || addType === 'AddAll'){
            if (vm.userAddedList && vm.userAddedList.length > 0) {
                vm.userIds = [];
                if(addType === 'AddAll'){
                  _.filter(vm.userAddedList, (ele) => {
                    vm.userIds.push(ele.userID);
                  });
                }else{
                  _.filter($scope.selectedUserListNoAdded , (ele) => {
                    vm.userIds.push(ele.userID);
                  });
                }

                const data = {
                  userIds: vm.userIds,
                  createdBy: loginUserDetails.userid,
                  selectedRole: vm.RoleVal,
                  permissionRights: addType,
                  createdByRoleId: loginUserDetails.defaultLoginRoleID
                };
                //Condition added for if selected page or feature
                if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.PERMISSIONS){
                  const pages = [];
                  _.each(vm.selectedlist, (pagePermison) => {
                      pages.push(pagePermison.pageID);
                  });
                  data.selectedpages = pages;
                  if (data && data.userIds && data.selectedpages) {
                    AssignRightsandFeturesFactory.mulitpleUserPagePermision().query(data).$promise.then((res) => {
                      // vm.saveDisable = false;
                      vm.SelectUser.$setPristine();
                      if(res && res.status) {
                          if(res.status === CORE.ApiResponseTypeStatus.SUCCESS){
                            // Send notification or relogin
                            // if (vm.loginUser && vm.loginUser.userid === vm.userId) {
                            //   showInformationForReLoginOfCurrentUser();
                            // } else {
                              showInformationForSendNotificationOfOtherUser();
                            // }
                            return res;
                          }
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                }else if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.FEATURES){
                  const features = [];
                  _.each(vm.selectedlist, (featurePermison) => {
                      features.push(featurePermison.featureID);
                  });
                  data.selectedfeatures = features;
                  if (data && data.userIds && data.selectedfeatures) {
                    AssignRightsandFeturesFactory.mulitpleUserFeaturesPermision().query(data).$promise.then((res) => {
                      // vm.saveDisable = false;
                      vm.SelectUser.$setPristine();
                      if(res && res.status) {
                          if(res.status === CORE.ApiResponseTypeStatus.SUCCESS){
                            showInformationForSendNotificationOfOtherUser();
                            return res;
                          }
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                }
            }
          }
          //Condition for remove rights for page or feature
          if(addType === 'Remove' || addType === 'RemoveAll'){
            if (vm.userNoAddedList && vm.userNoAddedList.length > 0) {
              vm.userIds = [];
              if(addType === 'RemoveAll'){
                _.filter(vm.userNoAddedList, (ele) => {
                  vm.userIds.push(ele.userID);
                });
              }else{
                _.filter($scope.selectedUserListAdded , (ele) => {
                  vm.userIds.push(ele.userID);
                });
              }

              const data = {
                userIds: vm.userIds,
                createdBy: loginUserDetails.userid,
                selectedRole: vm.RoleVal,
                permissionRights: addType,
                createdByRoleId: loginUserDetails.defaultLoginRoleID
              };

              //Condition added for if selected page or feature
              if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.PERMISSIONS){
                const pages = [];
                _.each(vm.selectedlist, (pagePermison) => {
                    pages.push(pagePermison.pageID);
                });
                data.selectedpages = pages;
                if (data && data.userIds && data.selectedpages) {
                  // CALL API for page rights
                  AssignRightsandFeturesFactory.mulitpleUserPagePermision().query(data).$promise.then((res) => {
                    // vm.saveDisable = false;
                    vm.SelectUser.$setPristine();
                    if(res && res.status) {
                        if(res.status === CORE.ApiResponseTypeStatus.SUCCESS){
                          return res;
                        }
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }else if(vm.selectedCriteria === vm.constantAssignRightsAndFeatures.FEATURES){
                const features = [];
                  _.each(vm.selectedlist, (featurePermison) => {
                      features.push(featurePermison.featureID);
                  });
                data.selectedfeatures = features;
                if (data && data.userIds && data.selectedfeatures) {
                  // CALL API for feature rights
                  AssignRightsandFeturesFactory.mulitpleUserFeaturesPermision().query(data).$promise.then((res) => {
                    // vm.saveDisable = false;
                    vm.SelectUser.$setPristine();
                    if(res && res.status) {
                        if(res.status === CORE.ApiResponseTypeStatus.SUCCESS){
                          return res;
                        }
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }
          }
          }
        }
      }
    };

    /* to move at employee update page */
    vm.goToUpdateEmployee = (employeeID) => {
      BaseService.goToManagePersonnel(employeeID);
    };
    /* to move at role page */
    vm.goToAddRole = () => {
      BaseService.goToRoleAddUpdate();
    };

    // Function of show information popup for logout of current user after save
    const showInformationForReLoginOfCurrentUser = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_LOGOUT);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.logoutWithOperationConfirmation(vm);
        }
      }, () => {        
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Function of show information popup for send notification of other user after save
    const showInformationForSendNotificationOfOtherUser = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_SEND_NOTIFICATION);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_SEND_NOTIFICATION,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          sendNotificationAllActiveSession();
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Function for send notification when user change the other user role-right-permiddion
    const sendNotificationAllActiveSession = () => {
      RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.userIds, isSelectMultipleUser: true }).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
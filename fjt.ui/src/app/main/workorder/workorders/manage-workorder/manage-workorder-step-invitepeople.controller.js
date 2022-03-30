(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderInvitePeopleController', ManageWorkorderInvitePeopleController);

  /** @ngInject */
  function ManageWorkorderInvitePeopleController($scope, $timeout,
    CORE, WORKORDER, socketConnectionService, DialogFactory,
    BaseService, EmployeeFactory, MasterFactory, WorkorderFactory, $q, USER) {
    // Don't Remove this code
    // Don't add any code before this
    if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
      $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
      return;
    }
    const loginUserDetails = BaseService.loginUser.employee;
    $scope.vm = $scope.$parent.$parent.vm;
    $scope.ownerReviewList = [];
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'woStatusForm';
    const vm = $scope.vm;
    vm.invitedOwner = [];
    vm.changeRequestComeFrom = WORKORDER.AccessFrom.WorkOrderInvitePeoplePage;
    // add code after this only
    // Don't Remove this code
    //get co owner employee list

    const woInvitePeopleState = WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_STATE;
    const WoStatusConst = angular.copy(CORE.WoStatus);
    vm.WoSubStatusConst = angular.copy(CORE.WOSTATUS);
    vm.LabelConstant = CORE.LabelConstant;
    const woStatusDet = _.find(WoStatusConst, (item) => item.ID == vm.workorder.woStatus);

    const getCoOwnerlist = () => WorkorderFactory.getCoOwnerEmpList().query({ woID: $scope.$parent.$parent.vm.workorder.woID }).$promise.then((response) => {
      if (response && response.data) {
        vm.coOwnerList = response.data;
        return response;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //get workorder author detail
    const getWorkorderAuthor = () => MasterFactory.getWorkorderAuthor().query({ woID: $scope.$parent.$parent.vm.workorder.woID }).$promise.then((response) => {
      if (response && response.data) {
        vm.woAuthorID = response.data.employeeID;
        return response;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /* Employee dropdown fill up */
    const getemployeeList = () => EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: false }).$promise.then((employees) => {
      vm.EmployeeList = employees.data;
      return vm.EmployeeList;
    }).catch((error) => BaseService.getErrorLog(error));

    const commonList = () => {
      var cgPromise = [getemployeeList(), getCoOwnerlist(), getWorkorderAuthor()];
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        $scope.ownerReviewList = [];
        responses[0] = _.filter(vm.EmployeeList, (auth) => auth.id !== vm.woAuthorID);
        vm.employeeList = angular.copy(responses[0]);
        _.each(vm.employeeList, (item) => {
          let deptName = '';
          let gencCategoryName = '';
          if (item.deptName) {
            deptName = ' (' + item.deptName + ')';
          }
          if (item.gencCategoryName) {
            gencCategoryName = ' ' + item.gencCategoryName;
          }
          item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
          item.empFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName);
          if (item.profileImg && item.profileImg !== 'null') {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        vm.employeeList = vm.employeeList.filter((x) => x.isActive);
        _.each(vm.coOwnerList, (emp) => {
          const _emp = _.find(vm.employeeList, (objEmp) => emp.employeeID === objEmp.id);
          if (_emp) {
            _emp.coOwnerID = emp.coOwnerID;
            $scope.ownerReviewList.push(_emp);
            vm.employeeList = _.filter(vm.employeeList, (itm) => itm.id !== _emp.id);
          }
        });
        vm.invitedOwner = angular.copy($scope.ownerReviewList);
        $timeout(() => {
          vm.isChange = false;
          vm.saveClick = false;
        }, true);
      });
    };

    // Restrict changes into all fields if work order status is 'under termination'
    vm.isWOTerminationToStopChange = (vm.workorder.woStatus === CORE.WOSTATUS.UNDER_TERMINATION || vm.workorder.woStatus === CORE.WOSTATUS.TERMINATED);
    commonList();
    vm.InviteEmployee = () => {
      vm.ShowInviteTab = true;
      vm.ShowInviteEmployee = false;
      vm.woDetails = {
        woID: vm.workorder.woID,
        woNumber: vm.workorder.woNumber,
        woVersion: vm.workorder.woVersion,
        woRevReqID: vm.workorderReqForReview ? vm.workorderReqForReview.woRevReqID : null,
        woRevRequestType: CORE.WorkorderReviewType.InitalDraft,
        woStatus: vm.workorder.woStatus,
        woSubStatus: vm.workorder.woSubStatus
      };
      $timeout(() => {
        vm.ShowInviteEmployee = true;
      });
    };
    vm.InviteEmployee();

    //save button call in inviteuser page
    vm.InviteEmployeeForReview = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      vm.saveDisable = true;
      if (!vm.isinviteSaveBtnDisable && !vm.isCoownerSaveBtnDisable && vm.woStatusForm) {
        // case when user write only ks in invite user and not select any user from list
        vm.woStatusForm.$setPristine();
        vm.woStatusForm.$setUntouched();
      }

      if (BaseService.focusRequiredField(vm.woStatusForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.isWOTerminationToStopChange) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_ALLOWED_FOR_WOSTATUS);
        messageContent.message = stringFormat(messageContent.message, woStatusDet.Name);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
        vm.saveDisable = false;
        return;
      }

      if (vm.isChange) {
        vm.isChange = false;
        vm.saveClick = true;
        const saveOwner = {
          woID: $scope.$parent.$parent.vm.workorder.woID,
          employeeID: loginUserDetails.id,
          coOwnerList: $scope.ownerReviewList,
          woAuthorID: vm.woAuthorID,
          woInviteReqRevEmpPageRoute: woInvitePeopleState
        };
        WorkorderFactory.saveCoOwnerEmployeeDetail().query({ objCoOwner: saveOwner }).$promise.then(() => {
          commonList();
          $scope.$broadcast('saveInvitePeople');
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        $scope.$broadcast('saveInvitePeople');
      }
    };

    // to refresh whole data
    vm.refreshReviewGroupMembers = () => {
      const isdirty = vm.checkFormDirty(vm.woStatusForm, null) || vm.woStatusForm.$dirty;
      if (isdirty) {
        const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_APPLY_REFRESH_ALERT);
        const obj = {
          messageContent: messgaeContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((respOfConfirm) => {
          if (respOfConfirm) {
            refreshReviewMembersDet();
            vm.woStatusForm.$setPristine();
            vm.woStatusForm.$setUntouched();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        refreshReviewMembersDet();
      }
    };

    // to refresh all details of co-owner and review members
    const refreshReviewMembersDet = () => {
      vm.ShowInviteEmployee = false;
      $timeout(() => {
        vm.ShowInviteEmployee = true;
        vm.isChange = false;
        commonList();
        const woRevReqDet = {
          woRevReqID: null
        };
        $scope.$emit('woRevCommentChangeReqEnable', woRevReqDet);
      }, true);
    };

    //search owner
    vm.querySearchOwner = (criteria) => criteria ? vm.employeeList.filter(createFilterFor(criteria)) : [];

    /**
   * Create filter function for a query string
   */
    const createFilterFor = (query) => {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return (angular.lowercase(contact.name).indexOf(lowercaseQuery) !== -1);
      };
    };

    // on change of value in model of md-chip
    $scope.$watch('ownerReviewList', (newVal, oldVal) => {
      if (newVal != oldVal) {
        if (newVal.length >= oldVal.length) {
          _.each(newVal, (emp) => {
            _.each(oldVal, (oldEmp) => {
              if (oldEmp.id == emp.id) {
                vm.isChange = true;
              }
            });
            _.remove(vm.employeeList, (empDet) => empDet.id === emp.id);
            if (vm.isChange || ($scope.ownerReviewList.length !== vm.invitedOwner.length)) {
              vm.isChange = true;
            }
          });
        } else {
          _.each(oldVal, (emp) => {
            const foundEmp = _.find($scope.ownerReviewList, (empDet) => empDet.id === emp.id);
            if (!foundEmp) {
              //check active emp
              if (emp.isActive) {
                if (!_.find(vm.employeeList, (empData) => empData.id === emp.id)) {
                  vm.employeeList.push(emp);
                }
                if (vm.invitedOwner.length > 0) {
                  vm.isChange = true;
                }
                if (vm.invitedOwner.length === 0 && $scope.ownerReviewList.length === 0) {
                  vm.isChange = false;
                }
              }
            }
          });
        }
      }
      if (vm.saveClick) {
        vm.isChange = false;
        vm.saveClick = false;
      }
    }, true);

    $scope.$watch('vm.isChange', () => {
      $scope.$emit('saveButtonOwnerEnable', vm.isChange);
    }, true);

    // [S] Socket
    function connectSocket() {
      socketConnectionService.on('message:receive', notificationReceiveListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener('message:receive', notificationReceiveListener);
    }

    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.WO_REVIEW.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.WO_REVIEW_CO_OWNER.TYPE: {
          vm.refreshReviewGroupMembers();
          break;
        }
      }
    }

    // Assign Current Forms to service
    angular.element(() => {
      BaseService.currentPageForms = [vm.woStatusForm];
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    $scope.$on('$destroy', () => {
      removeSocketListener();
    });
  };
})();

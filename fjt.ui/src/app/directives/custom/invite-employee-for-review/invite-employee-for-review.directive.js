(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('inviteEmployeeForReview', inviteEmployeeForReview);

  /** @ngInject */
  function inviteEmployeeForReview(CORE, USER, $state, BaseService, EmployeeFactory, WorkorderFactory, $q, MasterFactory,
    TRAVELER, DialogFactory, WORKORDER, WorkorderReviewFactory) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        employeeReviewList: '=',
        woDetails: '=',
        isManualSave: '@',
        isDisabled: '=',
        currActiveForm: '=',
        isCoowner: '=?',
        changeRequestComeFrom: '='
      },
      templateUrl: 'app/directives/custom/invite-employee-for-review/invite-employee-for-review.html',
      controller: inviteEmployeeForReviewCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */
    function inviteEmployeeForReviewCtrl($scope) {
      const vm = this;
      vm.WoSubStatusConst = angular.copy(CORE.WOSTATUS);
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      //$scope.woStatusForm = $scope.currActiveForm;
      vm.filterSelected = true;
      $scope.employeeReviewList = [];
      const loginUserDetails = BaseService.loginUser.employee;
      vm.todayDate = new Date();
      let woAuthorID = null;
      vm.invitedEmp = [];
      vm.isChange = false;
      /*  Date format default for datetime */
      vm.DateformatMask = CORE.DateTimeFormat_PICKER;
      vm.WorkorderReviewType = CORE.WorkorderReviewType;
      const loginUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, loginUserDetails.initialName, loginUserDetails.firstName, loginUserDetails.lastName);
      vm.isRequiredToChkInviteValidation = $scope.changeRequestComeFrom == WORKORDER.AccessFrom.TravelerChangeRequestPage ? false : true;
      const woInvitePeopleState = WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_STATE;
      vm.LabelConstant = CORE.LabelConstant;
      vm.isDisableToAccess = $scope.isDisabled;

      /* Employee dropdown fill up */
      const getemployeeList = () => EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: false }).$promise.then((employees) => {
        vm.EmployeeList = employees.data;
        return vm.EmployeeList;
      }).catch((error) => BaseService.getErrorLog(error));

      // Get invite list workorder review
      const getInvitedEmployeeList = () => {
        if ($scope.woDetails.woRevReqID) {
          return WorkorderFactory.getInvitedEmployeeForWorkorderReview().query({
            woRevReqID: $scope.woDetails.woRevReqID
          }).$promise.then((invitedEmp) => invitedEmp.data).catch((error) => BaseService.getErrorLog(error));
        } else {
          // from work order page when one user added initial drat and other user click refresh button
          if ($scope.changeRequestComeFrom != WORKORDER.AccessFrom.TravelerChangeRequestPage) {
            return WorkorderReviewFactory.getInitialDraftWOReviewReq().save({
              woID: $scope.woDetails.woID,
              requestType: CORE.WorkorderReviewType.InitalDraft
            }).$promise.then((invitedEmp) => invitedEmp.data).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };

      //get co owner employee list
      const getCoOwnerlist = () =>
        WorkorderFactory.getCoOwnerEmpList().query({ woID: $scope.woDetails.woID }).$promise.then((response) => {
          if (response && response.data) {
            vm.coOwnerList = response.data;
            if (_.find(vm.coOwnerList, (access) => access.employeeID == loginUserDetails.id)) {
              vm.isaccess = true;
            }
            return response;
          }
        }).catch((error) => BaseService.getErrorLog(error));

      const getWorkorderAuthor = () => MasterFactory.getWorkorderAuthor().query({ woID: $scope.woDetails.woID }).$promise.then((response) => {
        if (response && response.data) {
          woAuthorID = response.data.employeeID;
          if (loginUserDetails.id == woAuthorID) {
            vm.isaccess = true;
          }
          return response;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const cgPromise = [getemployeeList(), getInvitedEmployeeList(), getWorkorderAuthor()];
      if ($scope.isCoowner) {
        cgPromise.push(getCoOwnerlist());
      }
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        responses[0] = _.filter(vm.EmployeeList, (auth) => auth.id !== vm.woAuthorID);
        vm.employeeList = angular.copy(responses[0]);
        const woReqRevReview = responses[1];
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
          if (woReqRevReview) {
            item.woRevReqID = woReqRevReview.woRevReqID;
          }
          item.isCompulsory = false;
        });
        _.each(woReqRevReview && woReqRevReview.workorderReqRevInvitedEmp, (emp) => {
          const _emp = _.find(vm.employeeList, (objEmp) => emp.employeeID === objEmp.id);
          if (_emp) {
            _emp.timeLine = emp.timeLine ? new Date(emp.timeLine) : null;
            _emp.isCompulsory = emp.isCompulsory;
            _emp.woRevReqInvitedID = emp.woRevReqInvitedID;
            _emp.woRevReqID = emp.woRevReqID;
            _emp.dateTimeOptions = {
              minDate: emp.woRevReqInvitedID ? '' : vm.todayDate,
              appendToBody: true
            };
            $scope.employeeReviewList.push(_emp);
          }
        });

        //filter Employee as it must be Active employee
        vm.employeeList = vm.employeeList.filter((x) => x.isActive);
        vm.invitedEmp = angular.copy($scope.employeeReviewList);
        if (!$scope.isCoowner) {
          if (_.find(woReqRevReview && woReqRevReview.workorderReqRevInvitedEmp, (access) => access.employeeID === loginUserDetails.id)) {
            vm.isaccess = true;
          }
        }
        vm.isChange = false;
      });


      // remove employee from list
      vm.removeEmployeeFromInviteList = function (inviteEmployee) {
        // stop access if wo status in TERMINATED or COMPLETED or VOID
        if (vm.isDisableToAccess) {
          return;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Personnel', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            // Remove from return list
            _.remove($scope.employeeReviewList, (emp) => emp.id === inviteEmployee.id);
            vm.isChange = true;
            setRestCurrFormDirtyManual();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // on change of value in model of md-chip
      $scope.$watch('employeeReviewList', (newVal, oldVal) => {
        if (newVal != oldVal) {
          if (newVal.length >= oldVal.length) {
            _.each(newVal, (emp) => {
              _.each(oldVal, (oldEmp) => {
                if (oldEmp.id == emp.id) {
                  if (oldEmp.timeLine != emp.timeLine || oldEmp.isCompulsory != emp.isCompulsory) {
                    vm.isChange = true;
                  }
                }
              });
              _.remove(vm.employeeList, (empDet) => empDet.id === emp.id);
              if (vm.isChange || ($scope.employeeReviewList.length !== vm.invitedEmp.length)) {
                vm.isChange = true;
              }
            });
          } else {
            _.each(oldVal, (emp) => {
              var foundEmp = _.find($scope.employeeReviewList, (empDet) => empDet.id === emp.id);
              if (!foundEmp) {
                //check active emp
                if (emp.isActive) {
                  vm.employeeList.push(emp);
                  if (vm.invitedEmp.length > 0) {
                    vm.isChange = true;
                  }
                  if (vm.invitedEmp.length === 0 && $scope.employeeReviewList.length === 0) {
                    vm.isChange = false;
                  }
                }
              }
            });
          }
          vm.employeeList = _.sortBy(vm.employeeList, 'firstName');
        }
      }, true);

      $scope.$watch('vm.isChange', () => {
        $scope.$emit('saveButtonEnable', vm.isChange);
      }, true);

      /**
       * Create filter function for a query string
       */
      const createFilterFor = (query) => {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(contact) {
          return (angular.lowercase(contact.name).indexOf(lowercaseQuery) !== -1);
        };
      };

      /**
      * Search for employees; use a random delay to simulate a remote call
      */
      vm.querySearch = (criteria) => {
        if ($scope.woDetails.isOnlyInviteMembersActionFromRevComment) {
          return criteria ? vm.employeeList.filter(createFilterFor(criteria)) : [];
        }
        else {
          return criteria ? (vm.employeeList.filter((x) => x.id !== loginUserDetails.id)).filter(createFilterFor(criteria)) : [];
        }
      };

      /*  invite employee for review */
      vm.InviteEmployeeForReview = () => {
        const inviteEmpList = [];
        //list of employee which are invited
        _.each($scope.employeeReviewList, (emp) => {
          const objEmp = {};
          objEmp.woRevReqInvitedID = emp.woRevReqInvitedID ? emp.woRevReqInvitedID : null;
          objEmp.woRevReqID = emp.woRevReqID;
          objEmp.woID = $scope.woDetails.woID;
          objEmp.departmentID = emp.employeeDepartment ? emp.employeeDepartment.departmentID : null;
          objEmp.employeeID = emp.id;
          objEmp.timeLine = emp.timeLine;
          objEmp.isCompulsory = emp.isCompulsory ? emp.isCompulsory : false;
          objEmp.dateTimeOptions = {
            minDate: emp.woRevReqInvitedID ? '' : vm.todayDate,
            appendToBody: true
          };
          inviteEmpList.push(objEmp);
        });
        if (woAuthorID) {
          const woAuthorObj = _.find(inviteEmpList, (item) => item.employeeID === woAuthorID);
          if (!woAuthorObj) {
            const objEmp = {};
            objEmp.woRevReqInvitedID = null;
            objEmp.woRevReqID = $scope.woDetails.woRevReqID;
            objEmp.woID = $scope.woDetails.woID;
            objEmp.departmentID = null;
            objEmp.employeeID = woAuthorID;
            objEmp.timeLine = null;
            objEmp.isCompulsory = false;
            inviteEmpList.push(objEmp);
          }
        }
        if (vm.isChange) {
          const objInviteEmp = {
            woRevReqID: $scope.woDetails.woRevReqID,
            woID: $scope.woDetails.woID,
            reqGenEmployeeID: loginUserDetails.id,
            //woAuthorID: loginUserDetails.id,
            woAuthorID: woAuthorID,
            requestType: $scope.woDetails.woRevRequestType,
            threadTitle: stringFormat(TRAVELER.INITIAL_DRAFT_REVIEW_MESSAGE, $scope.woDetails.woNumber, $scope.woDetails.woVersion, loginUserFullName),
            description: 'Initial Draft',
            accRejStatus: 'P',
            workorderReqRevInvitedEmp: inviteEmpList,
            woNumber: $scope.woDetails.woNumber,
            woInviteReqRevEmpPageRoute: woInvitePeopleState
          };
          vm.cgBusyLoading = WorkorderFactory.inviteEmployeeForWorkorderReview().save(objInviteEmp).$promise.then((response) => {
            if (response && response.data) {
              if (response.data.data) {
                $scope.woDetails.woRevReqID = response.data.data.woRevReqID;
                const woRevReqDet = {
                  woRevReqID: response.data.data.woRevReqID
                };
                $scope.$emit('woRevCommentChangeReqEnable', woRevReqDet);
              }
              vm.invitedEmp = angular.copy($scope.employeeReviewList);
              if ($scope.isCoowner) {
                getCoOwnerlist();
              }
              vm.isChange = false;
              setRestCurrFormDirtyManual();

              // when req come from invite new members only - (review comment invite section)
              if ($scope.woDetails.isOnlyInviteMembersActionFromRevComment && $scope.woDetails.woRevRequestType == CORE.WorkorderReviewType.InitalDraft) {
                const data = {
                  isSuccess: true
                };
                $scope.$emit('InviteEmpSavedDoneFromInviteMembersSection', data);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if ($scope.isCoowner) {
            getCoOwnerlist();
          }
          setRestCurrFormDirtyManual();
        }
      };

      /* called for max date validation */
      vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);

      /* called for min date validation */
      vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

      const setRestCurrFormDirtyManual = () => {
        if (vm.isChange) {
          $scope.currActiveForm.$setDirty();
        }
        else {
          $scope.currActiveForm.$setPristine();
          $scope.currActiveForm.$setUntouched();
        }
      };

      //save invite employee
      const invitePeople = $scope.$on('saveInvitePeople', () => {
        vm.InviteEmployeeForReview();
      });
    }
  }
})();

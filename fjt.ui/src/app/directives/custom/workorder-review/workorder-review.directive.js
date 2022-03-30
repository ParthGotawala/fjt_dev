(function () {
  'use strict';

  angular
    .module('app.core').directive('workorderReview', workorderReview);

  /** @ngInject */
  function workorderReview($q, $timeout, $mdSidenav, CORE, BaseService, WorkorderReviewFactory, WORKORDER, DialogFactory, socketConnectionService,
    WorkorderFactory, TRAVELER) { // eslint-disable-line func-names
    return {
      restrict: 'E',
      scope: {
        woId: '=',
        woRevReqId: '=?',
        opId: '=?',
        woNumber: '=?',
        woReviewOtherDetails: '=?',
        isDisableAllFunctionality: '=?'
      },
      templateUrl: 'app/directives/custom/workorder-review/workorder-review.html',
      controllerAs: 'vm',
      controller: ['$scope', function ($scope) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.isAddComment = true;
        // Get login user employee details
        vm.loginEmpID = BaseService.loginUser.employee.id;
        // Array to bind review autocomplete
        vm.reviewChangesList = [];
        // Current selected review
        vm.selectedReviewChange = null;
        // Array of comments
        vm.workorderReviewList = [];
        vm.woRequestForReview = null;
        //let loginUserDetails = BaseService.loginUser;
        $scope.splitPaneProperties = {};
        vm.isDisableAddComment = false;
        vm.LabelConstant = CORE.LabelConstant;
        vm.isDisableToAccess = $scope.isDisableAllFunctionality ? $scope.isDisableAllFunctionality : false;

        vm.filterOptions = [
          { id: null, name: 'All' },
          { id: CORE.WorkorderReviewStatus.Pending, name: 'Pending' },
          { id: CORE.WorkorderReviewStatus.Accepted, name: 'Approved' },
          { id: CORE.WorkorderReviewStatus.Rejected, name: 'Declined' }
        ];
        vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
        vm.sortByOptions = ['Reviewer', 'Date'];

        // For binding reviewer dropdown
        vm.reviewerOptions = [];
        vm.coOwnerList = [];

        // Selected filters
        vm.selectedStatus = null;
        vm.selectedSortBy = 'Date';
        vm.selectedReviewer = null;
        vm.selectedSortByOrder = 'D';
        vm.woAuthorID = null;

        vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_REVIEW_CHANGE;
        vm.EmptyMesssageEmpty = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_REVIEW_EMPTY;
        vm.EmptyMesssageNotFound = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_REVIEW_NOT_FOUND;
        vm.EmptyMesssageForChangeReqSelection = WORKORDER.WORKORDER_EMPTYSTATE.REQ_REV_SELECTION;
        vm.taToolbar = CORE.Toolbar;

        vm.pagination = {
          pageIndex: 0,
          recordPerPage: 10
        };

        //get co owner employee list
        const getCoOwnerlist = () => WorkorderFactory.getCoOwnerEmpList().query({ woID: $scope.woId }).$promise.then((response) => {
          if (response && response.data) {
            vm.coOwnerList = response.data;
            return response;
          }
        }).catch((error) => BaseService.getErrorLog(error));

        getCoOwnerlist();



        const getWorkorderRevReqComments = (woRevReqId) => {
          var promise = null;
          $scope.woRevReqId = woRevReqId || $scope.woRevReqId;
          const model = {
            woRevReqID: $scope.woRevReqId,
            pageIndex: ++vm.pagination.pageIndex,
            recordPerPage: vm.pagination.recordPerPage,
            status: vm.selectedStatus,
            sortBy: vm.selectedSortBy,
            sortByOrder: vm.selectedSortByOrder,
            reviewBy: vm.selectedReviewer
          };

          // Show loaded only if first time record fetch
          if (vm.pagination.pageIndex === 1) {
            vm.workorderReviewList = [];
          }
          promise = WorkorderReviewFactory.getWorkorderRevReqComments().save(model).$promise;
          //} else {
          //  promise = WorkorderReviewFactory.getWorkorderRevReqComments().save(model).$promise;
          //}

          return promise.then((response) => {
            if (response && response.data) {
              response.data.forEach((x) => {
                x.icon = x.firstName[0].toUpperCase() + x.lastName[0].toUpperCase();
                x.empFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, x.initialName, x.firstName, x.lastName);
                if (x.initialNameOfARByUser) {
                  x.empFullNameOfAcceptRejectBy = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, x.initialNameOfARByUser, x.firstNameOfARByUser, x.lastNameOfARByUser);
                }
              });

              vm.workorderReviewList = vm.workorderReviewList.concat(response.data);
              // newly added comments are directly pushed into an array, so into pagination we may get duplicate records
              // so eliminate duplicate records
              vm.workorderReviewList = _.uniqBy(vm.workorderReviewList, 'woRevReqcommID');
              if (vm.woRequestForReview) {  // for adding original request description into list
                mergeOriginalReqToReviewList();
              }
              if (vm.reviewform) {
                vm.reviewform.$setPristine();
              }
              return vm.workorderReviewList;
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        };

        // Get list of all review requests for bind autocomplete
        const getWORevReqForReviewList = () => {
          vm.isDataLoaded = false;
          return vm.cgBusyLoading = WorkorderReviewFactory.getWORevReqForReviewList().query({ woID: $scope.woId, empID: vm.loginEmpID }).$promise.then((response) => {
            vm.isDataLoaded = true;
            if (response && response.data) {
              vm.reviewChangesList = response.data;
              if ($scope.opId) {
                vm.reviewChangesList = vm.reviewChangesList.filter((x) => x.opID === $scope.opId);
              }

              vm.selectedReviewChange = _.find(vm.reviewChangesList, (x) => x.woRevReqID === $scope.woRevReqId);

              /* to set default selected Review change if no any found */
              if (!vm.selectedReviewChange && vm.reviewChangesList.length > 0) {
                vm.selectedReviewChange = vm.reviewChangesList[0];
              }

              if (!vm.autoCompleteReviewChanges) {
                initReviewChangesAutoComplete();
              }

              return vm.reviewChangesList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };

        const getReqRevInvitedEmpList = (woRevReqID) => {
          WorkorderReviewFactory.getReqRevInvitedEmpList().query({ woRevReqID: woRevReqID }).$promise.then((response) => {
            vm.reviewerOptions = [];
            vm.reviewerOptions = [{ id: null, name: 'All' }];
            // add co-owner as group members
            if (vm.coOwnerList && vm.coOwnerList.length > 0) {
              _.each(vm.coOwnerList, (coOwnerItem) => {
                vm.reviewerOptions.push({
                  id: coOwnerItem.employeeID,
                  name: stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, coOwnerItem.employee.initialName, coOwnerItem.employee.firstName, coOwnerItem.employee.lastName),
                  invitedUserType: TRAVELER.INVITE_USER_TYPE.CoOwner
                });
              });
            }
            if (response && response.data) {
              response.data.forEach((item) => {
                const isUserExistsInReviewerList = _.some(vm.reviewerOptions, (rewEmpItem) => rewEmpItem.id === item.employeeID);
                if (!isUserExistsInReviewerList) {
                  vm.reviewerOptions.push({
                    id: item.employeeID,
                    name: stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.employee.initialName, item.employee.firstName, item.employee.lastName),
                    invitedUserType: item.employeeID === vm.woAuthorID ? TRAVELER.INVITE_USER_TYPE.Owner : TRAVELER.INVITE_USER_TYPE.InviteUser
                  });
                }
              });
            }
            // get unique emp (liked invited user and also co-owner then display one)
            vm.reviewerOptions = _.uniqBy(vm.reviewerOptions, 'id');
          }).catch((error) => BaseService.getErrorLog(error));
        };

        const getWORequestForReviewByID = (woRevReqID) => {
          vm.woRequestForReview = null;
          vm.woAuthorID = null;
          return WorkorderReviewFactory.getWORequestForReviewByID().query({ woRevReqID: woRevReqID }).$promise.then((response) => {
            if (response && response.data) {
              vm.woRequestForReview = response.data;
              vm.woAuthorID = vm.woRequestForReview.woAuthorID;
              vm.woRequestForReview.reqGenEmployee.icon = vm.woRequestForReview.reqGenEmployee.firstName[0].toUpperCase() + vm.woRequestForReview.reqGenEmployee.lastName[0].toUpperCase();
              vm.woRequestForReview.reqGenEmployee.fullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.woRequestForReview.reqGenEmployee.initialName, vm.woRequestForReview.reqGenEmployee.firstName, vm.woRequestForReview.reqGenEmployee.lastName);
              if (vm.woRequestForReview.accRejEmployee) {
                vm.woRequestForReview.accRejEmployee.fullNameOfAcceptRejectBy = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.woRequestForReview.accRejEmployee.initialName, vm.woRequestForReview.accRejEmployee.firstName, vm.woRequestForReview.accRejEmployee.lastName);
              }
              if (vm.woRequestForReview.accRejStatus !== CORE.WorkorderReviewStatus.Pending) {
                //$scope.commentCancelClicked();
                vm.comment = null;
                vm.isDisableAddComment = true;
              }
            }
            return vm.woRequestForReview;
          }).catch((error) => BaseService.getErrorLog(error));
        };

        const getDisplayReqReviewComment = (selectedReqForReview) => {
          vm.isDisableAddComment = false;
          vm.isGroupMemberOpen = false;
          if (selectedReqForReview && selectedReqForReview.woRevReqID) {
            $scope.changeReviewRequest(selectedReqForReview);
            vm.isAddComment = true;
          }
          else {
            vm.isAddComment = false;
            vm.isShowFilterBox = false;
            vm.isRevReqDescDisp = false;
            vm.selectedReviewChange = null;
            vm.workorderReviewList = [];
          }
        };

        getWORevReqForReviewList();

        // Bind data to review request autocomplete
        const initReviewChangesAutoComplete = () => {
          vm.autoCompleteReviewChanges = {
            columnName: 'threadTitle',
            controllerName: null,
            viewTemplateURL: null,
            keyColumnName: 'woRevReqID',
            keyColumnId: vm.selectedReviewChange ? vm.selectedReviewChange.woRevReqID : null,
            inputName: 'Requests',
            placeholderName: 'Requests',
            isRequired: false,
            isAddnew: false,
            callbackFn: getWORevReqForReviewList,
            onSelectCallbackFn: getDisplayReqReviewComment
          };
        };

        // merge original change request to review list and display original change request at last on list
        const mergeOriginalReqToReviewList = () => {
          const isOriginalReqExistsInList = _.some(vm.workorderReviewList, (item) => item.woRevReqID === vm.woRequestForReview.woRevReqID && !item.woRevReqcommID);
          if (isOriginalReqExistsInList) {
            // remove original comment as we have implemented paging and original req need to display at end
            _.remove(vm.workorderReviewList, (item) => item.woRevReqID === vm.woRequestForReview.woRevReqID && !item.woRevReqcommID);
          }
          const _objReqOriginalCmt = {
            woRevReqID: vm.woRequestForReview.woRevReqID,
            icon: vm.woRequestForReview.reqGenEmployee.icon,
            empFullName: vm.woRequestForReview.reqGenEmployee.fullName,
            commentDate: vm.woRequestForReview.createdAt,
            description: vm.woRequestForReview.description
          };
          vm.workorderReviewList.push(_objReqOriginalCmt);
        };


        vm.getWorkorderRevReqComments = getWorkorderRevReqComments;
        vm.getReqRevInvitedEmpList = getReqRevInvitedEmpList;
        vm.getWORequestForReviewByID = getWORequestForReviewByID;
        vm.mergeOriginalReqToReviewList = mergeOriginalReqToReviewList;

        // to receive messge from socket io connection
        const connectSocket = () => {
          socketConnectionService.on('message:receive', notificationReceiveListener);
        };
        connectSocket();

        socketConnectionService.on('reconnect', () => {
          connectSocket();
        });

        const removeSocketListener = () => {
          socketConnectionService.removeListener('message:receive', notificationReceiveListener);
        };

        function notificationReceiveListener(message) {
          notificationReceive(message);
        }

        // on notification message receive, called below one common function
        function notificationReceive(message) {
          switch (message.event) {
            case CORE.NOTIFICATION_MESSAGETYPE.WO_REVIEW_COMMENT.TYPE:
              if (message.data && message.data.woRevReqID && vm.selectedReviewChange && vm.selectedReviewChange.woRevReqID === message.data.woRevReqID) {
                vm.comment = null;
                vm.pagination.pageIndex = 0;
                vm.getWorkorderRevReqComments(message.data.woRevReqID);
                if (vm.reviewform) {
                  vm.reviewform.$setPristine();
                }
              }
              break;
          }
        }

        $scope.$on('$destroy', () => {
          // Remove socket listeners
          removeSocketListener();
        });

        vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);
        // POC Points- need to check for issue of button enable in case of remove text from angular
        //$scope.$applyAsync();


        //open popup to invite new employee
        vm.openInviteMembersPopup = (ev) => {
          if (vm.woRequestForReview.woRevReqID) {
            WorkorderFactory.getDefaultWORevReqForReview().query({
              woID: $scope.woId, woRevReqID: vm.woRequestForReview.woRevReqID, empID: vm.loginEmpID
            }).$promise.then((response) => {
              if (response && response.data) {
                const data = {
                  woRevReqID: vm.woRequestForReview.woRevReqID,
                  woAuthorID: vm.woAuthorID,
                  woRevRequestType: vm.woRequestForReview.requestType,
                  woID: $scope.woId,
                  woNumber: $scope.woNumber,
                  woVersion: $scope.woReviewOtherDetails.woVersion,
                  woOPID: vm.selectedReviewChange.woOPID,
                  opID: vm.selectedReviewChange.opID,
                  opName: $scope.woReviewOtherDetails.opName,
                  changeRequestComeFrom: vm.woRequestForReview.requestType === CORE.WorkorderReviewType.InitalDraft ? WORKORDER.AccessFrom.WorkOrderInvitePeoplePage : WORKORDER.AccessFrom.TravelerChangeRequestPage,
                  isCoOwner: vm.woRequestForReview.requestType === CORE.WorkorderReviewType.InitalDraft ? true : false,
                  isOnlyInviteMembersActionFromRevComment: true,
                  threadTitle: vm.woRequestForReview.threadTitle,
                  description: vm.woRequestForReview.description,
                  changeType: vm.woRequestForReview.changeType,
                  requestType: vm.woRequestForReview.requestType
                };
                DialogFactory.dialogService(
                  WORKORDER.WO_INVITE_EMP_FOR_REVIEW_REQ_MODAL_CONTROLLER,
                  WORKORDER.WO_INVITE_EMP_FOR_REVIEW_REQ_MODAL_VIEW,
                  ev,
                  data).then(() => { //Success Section
                  }, (obj) => {
                    if (obj) {
                      if (obj.isRefreshInvitedMemberListReq) {
                        getReqRevInvitedEmpList(vm.selectedReviewChange.woRevReqID);
                      }
                      else if (obj.isRefreshAllReq) {
                        refreshWORevReqForReviewListManual();
                      }
                    }
                    else {
                      getReqRevInvitedEmpList(vm.selectedReviewChange.woRevReqID);
                    }
                  });
              }
              else {
                // if not allowed to access then display message and refresh
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_AUTHORIZED_INVITED_EMP);
                const errModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(errModel);
                refreshWORevReqForReviewListManual();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        /*Used to check max length*/
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        const refreshWORevReqForReviewListManual = () => {
          vm.reviewChangesList = [];
          vm.workorderReviewList = [];
          vm.selectedReviewChange = null;
          vm.woRequestForReview = null;
          vm.reviewerOptions = [];
          vm.autoCompleteReviewChanges = null;
          getWORevReqForReviewList();
        };

        $(document).mouseup((e) => {
          // to close/hide Review Group Members div while click on out side div
          if (e.target.id !== 'id_ReviewGroupMembersLabel' && e.target.id !== 'id_ReviewGroupMembersRepeatData'
            && e.target.id !== 'id_ReviewGroupMembersSingleData' && vm.isGroupMemberOpen && e.target.id !== 'id_ReviewGroupMembersExpandIcon') {
            vm.isGroupMemberOpen = false;
          }
        });
      }],

      link: function (scope, elem, attr) {
        var vm = scope.vm;
        const userMoveToSection = {
          ClosePopup: 'close',
          FilterOrder: 'filter_order',
          RevReqDescription: 'rev_req_description'
        };

        scope.closeSidenav = function () {
          if (BaseService.checkFormDirty(vm.reviewform, null)) {
            showWithoutSavingAlert(userMoveToSection.ClosePopup);
          }
          else {
            $mdSidenav('workorder-review').close();
          }
        };

        const showWithoutSavingAlert = (userMoveAt) => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              switch (userMoveAt) {
                case userMoveToSection.ClosePopup:
                  $mdSidenav('workorder-review').close();
                  break;
                case userMoveToSection.FilterOrder:
                  resetReqRevCommentForm();
                  showFilterOrderSection();
                  break;
                case userMoveToSection.RevReqDescription:
                  resetReqRevCommentForm();
                  showRevReqDescSection();
                  break;
                default:
                  break;
              }
            }
          }, (error) => BaseService.getErrorLog(error));
        };

        const resetReqRevCommentForm = () => {
          vm.comment = null;
          if (vm.reviewform) {
            vm.reviewform.$setPristine();
          }
        };

        scope.showAddComment = () => {
          vm.isAddComment = !vm.isAddComment;
          vm.isShowFilterBox = false;
          vm.isRevReqDescDisp = false;

          if (vm.isAddComment) {
            // focus on text area
            $timeout(() => {
              angular.element('text-angular[name=txtComment]').find('*[id*=taText]').focus();
            }, 200);
          }
        };

        scope.saveComment = () => {
          vm.saveDisable = true;
          // case when write comment so form dirty and then clear all comment from editor
          if (!vm.comment && vm.reviewform && vm.reviewform.$dirty) {
            vm.reviewform.$setPristine();
            vm.reviewform.$setUntouched();
          }
          if (BaseService.focusRequiredField(vm.reviewform, false)) {
            vm.saveDisable = false;
            return;
          }

          const model = {
            woRevReqID: scope.woRevReqId,
            woID: scope.woId,
            commentemployeeID: vm.loginEmpID,
            description: vm.comment,
            woNumber: scope.woNumber
          };
          vm.cgBusyLoading = WorkorderReviewFactory.saveWorkorderRevReqComments().save(model).$promise.then((response) => {
            if (response && response.data) {
              //vm.isAddComment = false;
              vm.comment = null;

              // Get updated record and push on top of an array
              vm.pagination.pageIndex = 0;
              vm.getWorkorderRevReqComments(scope.woRevReqId);
              vm.reviewform.$setPristine();
              vm.saveDisable = false;
              //var record = response.data.data;
              //if (record) {
              //  record.icon = record.firstName[0].toUpperCase() + record.lastName[0].toUpperCase()
              //  vm.workorderReviewList.splice(0, 0, record);
              //}
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        };

        scope.showRevReqDesc = () => {
          if (BaseService.checkFormDirty(vm.reviewform, null)) {
            showWithoutSavingAlert(userMoveToSection.RevReqDescription);
          }
          else {
            showRevReqDescSection();
          }
        };

        // view request description section
        const showRevReqDescSection = () => {
          vm.isRevReqDescDisp = true;
          vm.isAddComment = false;
          vm.isShowFilterBox = false;
        };

        //scope.commentCancelClicked = () => {
        //  vm.isAddComment = false;
        //  scope.comment = null;
        //};

        //scope.revCancelClicked = () => {
        //  vm.isRevReqDescDisp = false;
        //};

        scope.revApprove = () => {
          accRejReview(CORE.WorkorderReviewStatus.Accepted);
        };

        scope.revReject = () => {
          accRejReview(CORE.WorkorderReviewStatus.Rejected);
        };

        scope.approve = (item) => {
          accRejComment(item, CORE.WorkorderReviewStatus.Accepted);
        };

        scope.reject = (item) => {
          accRejComment(item, CORE.WorkorderReviewStatus.Rejected);
        };

        function accRejComment(item, status) {
          var model = {
            woRevReqcommID: item.woRevReqcommID,
            woID: scope.woId,
            accRejStatus: status,
            accRejBy: vm.loginEmpID,
            woRevReqID: scope.woRevReqId,
            woNumber: scope.woNumber,
            woAuthorEmpID: vm.woAuthorID
          };
          vm.cgBusyLoading = WorkorderReviewFactory.setWORevReqCommentStatus().save(model).$promise.then((response) => {
            if (response && response.data) {
              item.accRejStatus = model.accRejStatus;
              item.accRejBy = model.accRejBy;
              item.accRejDate = new Date(response.data.data.accRejDate);
              const accRejByUserDet = _.find(vm.reviewerOptions, (allReviewerItem) => allReviewerItem.id === item.accRejBy);
              if (accRejByUserDet) {
                item['empFullNameOfAcceptRejectBy'] = accRejByUserDet.name;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }

        function accRejReview(status) {
          var model = {
            woRevReqID: vm.woRequestForReview.woRevReqID,
            accRejStatus: status,
            accRejBy: vm.loginEmpID,
            woID: scope.woId,
            woNumber: scope.woNumber,
            woAuthorID: vm.woAuthorID
          };
          vm.cgBusyLoading = WorkorderReviewFactory.setWORevReqStatus().save(model).$promise.then((response) => {
            if (response && response.data) {
              if (response.data.count) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_CHANGEREQ_STATUS);
                const errModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(errModel);
                return;
              }
              else {
                vm.woRequestForReview.accRejStatus = model.accRejStatus;
                vm.woRequestForReview.accRejBy = model.accRejBy;
                vm.woRequestForReview.accRejDate = new Date(response.data.data.accRejDate);
                const accRejByUserDet = _.find(vm.reviewerOptions, (allReviewerItem) => allReviewerItem.id === vm.woRequestForReview.accRejBy);
                if (accRejByUserDet) {
                  vm.woRequestForReview['accRejEmployee'] = {
                    fullNameOfAcceptRejectBy: accRejByUserDet.name
                  };
                }
                if (vm.selectedReviewChange && vm.selectedReviewChange.woRevReqID) {
                  vm.getWORequestForReviewByID(vm.selectedReviewChange.woRevReqID);
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }

        //scope.changeRequest = () => {
        //    vm.isEditChangeLog = true;
        //}

        //scope.discardChangeRequest = () => {
        //    vm.isEditChangeLog = false;
        //    vm.autoCompleteReviewChanges.keyColumnId = vm.selectedReviewChange.woRevReqID;
        //}



        // When user changes review request autocomplete
        scope.changeReviewRequest = (selectedReqForReview) => {
          vm.selectedReviewChange = _.find(vm.reviewChangesList, (item) => item.woRevReqID === selectedReqForReview.woRevReqID);

          if (vm.selectedReviewChange) {
            //vm.isEditChangeLog = false;
            vm.selectedReviewer = null;
            vm.pagination.pageIndex = 0;
            //vm.getWorkorderRevReqComments(vm.selectedReviewChange.woRevReqID);
            //vm.getWORequestForReviewByID(vm.selectedReviewChange.woRevReqID);

            const revReqCommentsPromise = [vm.getWorkorderRevReqComments(vm.selectedReviewChange.woRevReqID), vm.getWORequestForReviewByID(vm.selectedReviewChange.woRevReqID)];
            vm.cgBusyLoading = $q.all(revReqCommentsPromise).then(() => {
              if (vm.woRequestForReview) {
                vm.isUserHasAcceptRejRights = vm.loginEmpID === vm.woAuthorID || _.some(vm.coOwnerList, (coOwnerEmpItem) => coOwnerEmpItem.employeeID === vm.loginEmpID);
                vm.getReqRevInvitedEmpList(vm.selectedReviewChange.woRevReqID);
                vm.mergeOriginalReqToReviewList();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        scope.showFilterBox = () => {
          if (BaseService.checkFormDirty(vm.reviewform, null)) {
            showWithoutSavingAlert(userMoveToSection.FilterOrder);
          }
          else {
            showFilterOrderSection();
          }
        };

        // view filter section
        const showFilterOrderSection = () => {
          vm.isShowFilterBox = true;
          vm.isAddComment = false;
          vm.isRevReqDescDisp = false;
        };

        scope.applyFilter = () => {
          vm.pagination.pageIndex = 0;
          vm.isShowFilterBox = false;
          vm.comment = null;
          vm.getWorkorderRevReqComments();
          vm.isAddComment = true;
        };
      }
    };
  }
})();

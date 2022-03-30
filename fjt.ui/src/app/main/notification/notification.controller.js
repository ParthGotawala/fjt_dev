(function () {
  'use strict';

  angular
    .module('app.notification')
    .controller('NotificationController', NotificationController);

  /** @ngInject */
  function NotificationController(BaseService, $scope, NotificationDirFactory, CORE, USER, $mdDialog, WorkorderOperationFactory,
    NotificationSocketFactory, socketConnectionService, $timeout, $rootScope, $filter, $sce, MasterFactory, GenericCategoryFactory,
    EmployeeFactory, ComponentFactory) {

    const vm = this;
    vm.loginUserDetails = BaseService.loginUser;
    vm.isDisplayForAllUser = false;
    let notificationPageTitleFormat = "Notification - {0}";
    vm.constNotificationTreeFolders = angular.copy(CORE.NotificationTreeTabs);
    vm.constNotificationTreeFolderList = _.values(vm.constNotificationTreeFolders);
    vm.currentSelectedTreeItemID = vm.constNotificationTreeFolders.Inbox.id;  // default Inbox selected
    $rootScope.pageTitle = stringFormat(notificationPageTitleFormat, vm.constNotificationTreeFolders.Inbox.title);
    vm.urlPrefix = CORE.URL_PREFIX;
    vm.notificationRequestStatus = CORE.NotificationRequestStatus;
    vm.notificationSubType = CORE.NotificationSubType;
    vm.EmptyMesssage = CORE.EMPTYSTATE.NOTIFICATION;
    vm.CommonEmptyMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
    };
    vm.limit = 300;
    vm.workOrderList = [];
    vm.workOrderOperationList = [];
    vm.notificationCategoryList = [];
    vm.notiSenderReceiverList = [];
    vm.filterNoti = {};
    vm.ShowNotiFilterDiv = true;
    vm.notiContainSearchNote = CORE.MESSAGE_CONSTANT.NOTIFICATION.CONTAIN_SEARCH_NOTE;
    vm.operationMasterList = [];

    /* ******************* get list of all notifications that user received ***************/
    vm.pagingInfo = {
      pageIndex: CORE.UIGrid.Page(),
      recordPerPage: CORE.UIGrid.ItemsPerPage(),
      sortBy: null,
      receiverID: vm.loginUserDetails.employee.id,
      senderID: vm.loginUserDetails.employee.id,
      isDisplayAllUserNotification: vm.loginUserDetails.isUserSuperAdmin && vm.isDisplayForAllUser,
      //searchText: null
    };

    let getInboxNotificationList = () => {
      let loadNotiPromise = null;
      if (vm.pagingInfo.pageIndex == 1) { // Show loaded only if first time record fetch
        vm.notificationList = [];
        loadNotiPromise = NotificationDirFactory.getEmployeeWiseInboxNotificationList().save(vm.pagingInfo).$promise;
      }
      else {
        loadNotiPromise = NotificationDirFactory.getEmployeeWiseInboxNotificationList().save(vm.pagingInfo).$promise;
      }

      vm.cgBusyLoading = loadNotiPromise.then((response) => {
        if (response && response.data) {
          vm.notificationList = response.data.allNotifications;
          vm.totalNotificationList = response.data.Count;
          setTotalNotificationCountInTree(vm.constNotificationTreeFolders.Inbox.id, response.data.totCountOfUnreadNotifications);

          _.each(vm.notificationList, (notiItem) => {
            // convert db datetime to like gmail date time display
            notiItem.notificationDateAsMail = convertDateTimeFormatLikeGmail($filter, notiItem.convertedNotificationDate);

            // set notification redirection url 
            if (notiItem.redirectUrl) {
              notiItem.redirectUrl = notiItem.redirectUrl.replace(/{receiverID}/g, notiItem.receiverID);
            }

            // set notification sender profile icon and tooltip 
            let deptName = "";
            let gencCategoryName = "";
            if (notiItem.deptName) {
              deptName = " (" + notiItem.deptName + ")";
            }
            if (notiItem.gencCategoryName) {
              gencCategoryName = " " + notiItem.gencCategoryName;
            }
            notiItem.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, notiItem.initialName, notiItem.firstName, notiItem.lastName) + deptName + gencCategoryName;
            if (notiItem.profileImg) {
              notiItem.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + notiItem.profileImg;
            }
            else {
              notiItem.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }

            notiItem.isHaltWoOpNoti = notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.PO_STOP.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.KIT_ALLOCATION_STOP.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.KIT_RELEASE_STOP.TYPE;

            // receiver details in case of admin user with view all user notification selection
            if (vm.loginUserDetails.isUserSuperAdmin && vm.isDisplayForAllUser) {
              let deptNameForReceiver = "";
              let gencCategoryNameForReceiver = "";
              if (notiItem.deptNameOfRecv) {
                deptNameForReceiver = " (" + notiItem.deptNameOfRecv + ")";
              }
              if (notiItem.gencCategoryNameOfRecv) {
                gencCategoryNameForReceiver = " " + notiItem.gencCategoryNameOfRecv;
              }
              notiItem.fullNameForReceiver = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, notiItem.initialNameOfRecv, notiItem.firstNameOfRecv, notiItem.lastNameOfRecv) + deptNameForReceiver + gencCategoryNameForReceiver;
              if (notiItem.profileImgOfRecv) {
                notiItem.ProfilePicForReceiver = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + notiItem.profileImgOfRecv;
              }
              else {
                notiItem.ProfilePicForReceiver = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            }
          });

          let totalOfToCount = vm.pagingInfo.pageIndex * vm.pagingInfo.recordPerPage;
          vm.totalDisplayText = (((vm.pagingInfo.pageIndex - 1) * vm.pagingInfo.recordPerPage) + 1) + " - " + (totalOfToCount < vm.totalNotificationList ? totalOfToCount : vm.totalNotificationList) + " of " + (vm.totalNotificationList);
          vm.isDisableNextBtn = totalOfToCount < vm.totalNotificationList ? false : true;
          vm.isDisablePrevBtn = vm.pagingInfo.pageIndex == 1;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getInboxNotificationList();

    /* set total notification count to display in tree */
    let setTotalNotificationCountInTree = (folderID, totalNotiCount) => {
      let selectedTreeItem = _.find(vm.constNotificationTreeFolderList, (treeItem) => {
        return treeItem.id == folderID;
      });
      if (selectedTreeItem) {
        selectedTreeItem.totalNotifications = totalNotiCount;
      }
    }

    /***************** SOCKET call/receive for update inbox notification count ******************/
    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on('notification:receive', notificationReceiveListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      var obj = _.find(vm.notificationList, (x) => { return x.id == message.id; });
      if (!obj) {
        // if inbox is loaded then only push new record other wise it display in sent box item as common variable
        if (vm.currentSelectedTreeItemID == vm.constNotificationTreeFolders.Inbox.id && !vm.isNotiFilterApplied) {

          // convert db datetime to like gmail date time display
          message.notificationDateAsMail = convertDateTimeFormatLikeGmail($filter, message.convertedNotificationDate);

          if (message.redirectUrl) {
            message.redirectUrl = message.redirectUrl.replace(/{receiverID}/g, message.receiverID);
          }

          message.isHaltWoOpNoti = message.messageType == CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE ||
            message.messageType == CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE ||
            message.messageType == CORE.NOTIFICATION_MESSAGETYPE.PO_STOP.TYPE ||
            message.messageType == CORE.NOTIFICATION_MESSAGETYPE.KIT_ALLOCATION_STOP.TYPE ||
            message.messageType == CORE.NOTIFICATION_MESSAGETYPE.KIT_RELEASE_STOP.TYPE;

          let deptName = "";
          let gencCategoryName = "";
          if (message.deptName) {
            deptName = " (" + message.deptName + ")";
          }
          if (message.gencCategoryName) {
            gencCategoryName = " " + message.gencCategoryName;
          }
          message.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, message.initialName, message.firstName, message.lastName) + deptName + gencCategoryName;
          if (message.profileImg) {
            message.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + message.profileImg;
          }
          else {
            message.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }

          // receiver details in case of admin user with view all user notification selection
          if (vm.loginUserDetails.isUserSuperAdmin && vm.isDisplayForAllUser) {
            let deptNameForReceiver = "";
            let gencCategoryNameForReceiver = "";
            if (message.deptNameOfRecv) {
              deptNameForReceiver = " (" + message.deptNameOfRecv + ")";
            }
            if (message.gencCategoryNameOfRecv) {
              gencCategoryNameForReceiver = " " + message.gencCategoryNameOfRecv;
            }
            message.fullNameForReceiver = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, message.initialNameOfRecv, message.firstNameOfRecv, message.lastNameOfRecv) + deptNameForReceiver + gencCategoryNameForReceiver;
            if (message.profileImgOfRecv) {
              message.ProfilePicForReceiver = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + message.profileImgOfRecv;
            }
            else {
              message.ProfilePicForReceiver = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
          }

          vm.notificationList.unshift(message);
          vm.totalNotificationList = ++vm.totalNotificationList;
          let totalOfToCount = vm.pagingInfo.pageIndex * vm.pagingInfo.recordPerPage;
          vm.totalDisplayText = (((vm.pagingInfo.pageIndex - 1) * vm.pagingInfo.recordPerPage) + 1) + " - " + (totalOfToCount < vm.totalNotificationList ? totalOfToCount : vm.totalNotificationList) + " of " + (vm.totalNotificationList);
          vm.isDisableNextBtn = totalOfToCount < vm.totalNotificationList ? false : true;
          vm.isDisablePrevBtn = vm.pagingInfo.pageIndex == 1;
        }
        let selectedTreeItem = _.find(vm.constNotificationTreeFolderList, (treeItem) => {
          return treeItem.id == vm.constNotificationTreeFolders.Inbox.id;
        });
        if (selectedTreeItem) {
          selectedTreeItem.totalNotifications = ++selectedTreeItem.totalNotifications;
        }
      }
    }

    function removeSocketListener() {
      socketConnectionService.removeListener('notification:receive', notificationReceiveListener);
    }

    $scope.$on('$destroy', function () {
      // Remove socket listeners
      removeSocketListener();
    });

    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

    /***************************** Calling tree tabs and get data *********************/

    /* on click of tree folder (inbox/send) load data */
    vm.loadTreeFolderDetails = (folderID) => {
      if (folderID) {
        setFolderTreeItemSelected(folderID);
        resetAllData();
        resetAllFilterModelData();
        //vm.filterNoti.searchNotificationText = null;
        folderwiseSwitchDetails(folderID);
      }
    }

    let setFolderTreeItemSelected = (folderID) => {
      _.each(vm.constNotificationTreeFolderList, (treeItem) => {
        treeItem.isSelected = treeItem.id == folderID;
      })
    }
    setFolderTreeItemSelected(vm.currentSelectedTreeItemID); // default Inbox selected

    let folderwiseSwitchDetails = (folderID) => {
      switch (folderID) {
        case vm.constNotificationTreeFolders.Inbox.id:
          vm.currentSelectedTreeItemID = vm.constNotificationTreeFolders.Inbox.id;
          $rootScope.pageTitle = stringFormat(notificationPageTitleFormat, vm.constNotificationTreeFolders.Inbox.title);
          getInboxNotificationList();
          break;
        case vm.constNotificationTreeFolders.SendBox.id:
          vm.currentSelectedTreeItemID = vm.constNotificationTreeFolders.SendBox.id;
          $rootScope.pageTitle = stringFormat(notificationPageTitleFormat, vm.constNotificationTreeFolders.SendBox.title);
          getSendboxNotificationList();
          break;
        default:
          break;
      }
    }

    /* on click of prev/next, get all other notifications */
    vm.getPrevNextOfNotifications = (isNextBtnClicked) => {
      vm.pagingInfo.pageIndex = isNextBtnClicked ? ++vm.pagingInfo.pageIndex : --vm.pagingInfo.pageIndex;
      folderwiseSwitchDetails(vm.currentSelectedTreeItemID);
    }

    /* super admin user can all notification. for that select type */
    vm.loadDataBySelectedUserType = () => {
      vm.loadTreeFolderDetails(vm.currentSelectedTreeItemID);
    }

    /* to clear all basic details for getting new data */
    let resetAllData = () => {
      vm.totalDisplayText = '';
      vm.isDisableNextBtn = false;
      vm.isDisablePrevBtn = false;
      vm.pagingInfo.pageIndex = CORE.UIGrid.Page();
      vm.pagingInfo.isDisplayAllUserNotification = vm.isDisplayForAllUser;
      vm.pagingInfo.searchText = null;
      vm.pagingInfo.notificationCategoryIDForFilter = null;
      vm.pagingInfo.woIDForFilter = null;
      vm.pagingInfo.woOPIDForFilter = null;
      vm.pagingInfo.opIDForFilter = null;
      vm.pagingInfo.notiSenderIDForFilter = null;
      vm.pagingInfo.notiReceiverIDForFilter = null;
      vm.pagingInfo.fromDateRangeForFilter = null;
      vm.pagingInfo.toDateRangeForFilter = null;
      vm.pagingInfo.assyIDForFilter = null;
      vm.pagingInfo.searchNickNameText = null;
      vm.notificationList = [];
      //vm.isAllNotiSelected = false;
    }

    // reset all filters
    let resetAllFilterModelData = () => {
      vm.autoCompleteNotificationCategory.keyColumnId = null;
      vm.filterNoti.fromDate = null;
      vm.filterNoti.toDate = null;
      vm.autoCompleteSearchAssy.keyColumnId = null;
      vm.filterNoti.searchNickNameText = null;
      vm.autoCompleteWO.keyColumnId = null;
      vm.autoCompleteWOOP.keyColumnId = null;
      vm.autoCompleteNotiSenderReceiver.keyColumnId = null;
      vm.isNotiFilterApplied = false;
      vm.filterNoti.searchNotificationText = null;
      $scope.$broadcast(vm.autoCompleteNotificationCategory.inputName + "searchText", null);
      $scope.$broadcast(vm.autoCompleteNotiSenderReceiver.inputName + "searchText", null);
      $scope.$broadcast(vm.autoCompleteSearchAssy.inputName + "searchText", null);
      $scope.$broadcast(vm.autoCompleteWO.inputName + "searchText", null);
      $scope.$broadcast(vm.autoCompleteWOOP.inputName + "searchText", null);
    }

    vm.acceptNotification = (notificationObj) => {
      let model = {
        notificationID: notificationObj.notificationID,
        receiverID: notificationObj.receiverID,
        requestStatus: CORE.NotificationRequestStatus.Accepted
      };
      NotificationSocketFactory.ackNotification().save(model).$promise.then((response) => {
        if (response && response.data) {
          notificationObj.requestStatus = vm.notificationRequestStatus.Accepted;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*********************  General functionality for notification ************************/

    /* to search from notifications */
    vm.searchFromNotification = () => {
      if (vm.notiListForm.$invalid) {
        if (BaseService.focusRequiredField(vm.notiListForm)) {
          return;
        }
      }

      resetAllData();
      // apply filter if any
      vm.pagingInfo.searchText = vm.filterNoti.searchNotificationText || null;
      vm.pagingInfo.notificationCategoryIDForFilter = vm.autoCompleteNotificationCategory.keyColumnId || null;
      vm.pagingInfo.woIDForFilter = vm.autoCompleteWO.keyColumnId || null;
      if (vm.autoCompleteWOOP.keyColumnId) {
        if (vm.autoCompleteWO.keyColumnId) {
          //vm.pagingInfo.opIDForFilter = null;
          vm.pagingInfo.woOPIDForFilter = vm.autoCompleteWOOP.keyColumnId;
        }
        else {
          vm.pagingInfo.opIDForFilter = vm.autoCompleteWOOP.keyColumnId;
          //vm.pagingInfo.woOPIDForFilter = null;
        }
      }
      //else {
      //  vm.pagingInfo.opIDForFilter = null;
      //  vm.pagingInfo.woOPIDForFilter = null;
      //}

      if (vm.autoCompleteNotiSenderReceiver.keyColumnId) {
        if (vm.currentSelectedTreeItemID == vm.constNotificationTreeFolders.Inbox.id) {
          vm.pagingInfo.notiSenderIDForFilter = vm.autoCompleteNotiSenderReceiver.keyColumnId;
        }
        else {
          vm.pagingInfo.notiReceiverIDForFilter = vm.autoCompleteNotiSenderReceiver.keyColumnId;
        }
      }
      //else {
      //  vm.pagingInfo.notiSenderIDForFilter = null;
      //  vm.pagingInfo.notiReceiverIDForFilter = null;
      //}

      if (vm.filterNoti.fromDate && vm.filterNoti.toDate) {
        vm.pagingInfo.fromDateRangeForFilter = $filter('date')(new Date(vm.filterNoti.fromDate), CORE.MySql_Store_Date_Format);
        vm.pagingInfo.toDateRangeForFilter = $filter('date')(new Date(vm.filterNoti.toDate), CORE.MySql_Store_Date_Format);
      }
      //else {
      //  vm.pagingInfo.fromDateRangeForFilter = null;
      //  vm.pagingInfo.toDateRangeForFilter = null;
      //}
      if (vm.autoCompleteSearchAssy.keyColumnId) {
        vm.pagingInfo.assyIDForFilter = vm.autoCompleteSearchAssy.keyColumnId;
      }
      vm.pagingInfo.searchNickNameText = vm.filterNoti.searchNickNameText || null;

      folderwiseSwitchDetails(vm.currentSelectedTreeItemID);
      vm.isNotiFilterApplied = true;
    }

    vm.isDisableClearAllFilterBtn = () => {
      return (vm.filterNoti.searchNotificationText || vm.autoCompleteNotificationCategory.keyColumnId
        || vm.autoCompleteWO.keyColumnId || vm.autoCompleteWOOP.keyColumnId || vm.autoCompleteNotiSenderReceiver.keyColumnId
        || vm.filterNoti.fromDate || vm.filterNoti.toDate || vm.autoCompleteSearchAssy.keyColumnId
        || vm.filterNoti.searchNickNameText) ? false : true;
    }

    // to reset all filters
    vm.clearAllFilters = () => {
      if (vm.notiListForm) {
        vm.notiListForm.$setPristine();
        vm.notiListForm.$setUntouched();
      }
      vm.loadTreeFolderDetails(vm.currentSelectedTreeItemID);
    }


    /* when user click on notification then mark it as read OR set manually read/unread */
    vm.markNotificationAsReadUnread = (notificationObj, isReadNotification) => {

      ///* to move at detail page */
      //vm.currentSelectedTreeItemDetID = vm.currentSelectedTreeItemID;
      //vm.currentSelectedTreeItemID = 0;
      //vm.currNotificationDet = notificationObj;

      if (vm.isDisplayForAllUser || (vm.currentSelectedTreeItemID != vm.constNotificationTreeFolders.Inbox.id)) {
        return;
      }
      let selectedNotiIDs = [];
      let selectedNotificationList = [];
      if (notificationObj) {
        // if already in read/unread mode then no need to update
        if ((isReadNotification && notificationObj.isRead) || (!isReadNotification && !notificationObj.isRead)) {
          return;
        }
        selectedNotiIDs.push(notificationObj.id);
      }
      //else {
      //selectedNotificationList = _.filter(vm.notificationList, (notiItem) => {
      //    return notiItem.isSelected;
      //});
      //if (selectedNotificationList.length == 0) {
      //    return;
      //}

      //// if already in read mode then no need to update
      //if (isReadNotification) {
      //    if (_.every(selectedNotificationList, (notiItem) => { return notiItem.isRead })) {
      //        return;
      //    }
      //    else {
      //        selectedNotiIDs = (_.filter(selectedNotificationList, (notiItem) => {
      //            return notiItem.isRead == false;
      //        })).map((item) => item.id);
      //    }
      //}
      //else {// if already in unread mode then no need to update
      //    if (!isReadNotification && _.every(selectedNotificationList, (notiItem) => { return notiItem.isRead == false })) {
      //        return;
      //    }
      //    else {
      //        selectedNotiIDs = (_.filter(selectedNotificationList, (notiItem) => {
      //            return notiItem.isRead == true;
      //        })).map((item) => item.id);
      //    }
      //}
      //}

      let updateNotiObj = {
        isRead: isReadNotification,
        notificationdetMasterIDs: selectedNotiIDs,
        isRequiredReturnMessage: notificationObj ? false : true
      }
      vm.cgBusyLoading = NotificationDirFactory.updateNotificationAsReadUnread().save(updateNotiObj).$promise.then((response) => {
        if (response && response.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          //$rootScope.$broadcast('updateNotificationCountOnHeader', null);

          let selectedTreeItem = _.find(vm.constNotificationTreeFolderList, (treeItem) => {
            return treeItem.id == vm.constNotificationTreeFolders.Inbox.id;
          });

          if (notificationObj) {
            notificationObj.isRead = isReadNotification;
            if (selectedTreeItem) { // update inbox notification count on read/unread
              selectedTreeItem.totalNotifications = isReadNotification ? --selectedTreeItem.totalNotifications : ++selectedTreeItem.totalNotifications;
            }
          }
          //else {
          //    if (selectedNotificationList.length > 0) {
          //        _.each(selectedNotificationList, (notiItem) => {
          //            notiItem.isRead = isReadNotification;
          //        });
          //        if (selectedTreeItem) { // update inbox notification count on read/unread
          //            selectedTreeItem.totalNotifications = isReadNotification ? (selectedTreeItem.totalNotifications - selectedNotiIDs.length)
          //                                                                    : (selectedTreeItem.totalNotifications + selectedNotiIDs.length);
          //        }
          //    }
          //}
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // list redirection methods
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
    };

    // move at - if wo selected then woop list other wise operation list page
    vm.goToWorkOrderOperationList = () => {
      if (vm.autoCompleteWO.keyColumnId) {
          BaseService.goToWorkorderOperations(vm.autoCompleteWO.keyColumnId);
      }
      else {
        BaseService.goToOperationList();
      }
    }

    vm.goToNotificationCategoryList = () => {
      BaseService.goToGenericCategoryNotificationCategoryList();
    }

    vm.goToEmployeeList = () => {
        BaseService.goToPersonnelList();
    }

    vm.goToComponentList = () => {
        BaseService.goToPartList();
    }

    /* ******************* get list of all notifications that user send to other : sent box ***************/

    let getSendboxNotificationList = () => {
      let loadNotiPromise = null;
      if (vm.pagingInfo.pageIndex == 1) {
        vm.notificationList = [];
        loadNotiPromise = NotificationDirFactory.getEmployeeWiseSendboxNotificationList().save(vm.pagingInfo).$promise;
      }
      else {
        loadNotiPromise = NotificationDirFactory.getEmployeeWiseSendboxNotificationList().save(vm.pagingInfo).$promise;
      }

      vm.cgBusyLoading = loadNotiPromise.then((response) => {
        if (response && response.data) {
          vm.notificationList = response.data.allNotifications;
          vm.totalNotificationList = response.data.Count;

          // convert db datetime to like gmail date time display
          _.each(vm.notificationList, (notiItem) => {
            notiItem.allReceiversText = notiItem.messageSubType == vm.notificationSubType.A ? stringFormat(CORE.Notification_All_Receiver_Link_Text, notiItem.ackRecCount, notiItem.pendingRecCount)
              : "Details";
            notiItem.notificationDateAsMail = convertDateTimeFormatLikeGmail($filter, notiItem.convertedNotificationDate);
            notiItem.isHaltWoOpNoti = notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.PO_STOP.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.KIT_ALLOCATION_STOP.TYPE ||
              notiItem.messageType == CORE.NOTIFICATION_MESSAGETYPE.KIT_RELEASE_STOP.TYPE;

            // Sender details in case of admin user with view all user notification selection
            if (vm.loginUserDetails.isUserSuperAdmin && vm.isDisplayForAllUser) {
              let deptNameForSender = "";
              let gencCategoryNameForSender = "";
              if (notiItem.deptNameOfSender) {
                deptNameForSender = " (" + notiItem.deptNameOfSender + ")";
              }
              if (notiItem.gencCategoryNameOfSender) {
                gencCategoryNameForSender = " " + notiItem.gencCategoryNameOfSender;
              }
              notiItem.fullNameForSender = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, notiItem.initialNameOfSender, notiItem.firstNameOfSender, notiItem.lastNameOfSender) + deptNameForSender + gencCategoryNameForSender;
              if (notiItem.profileImgOfSender) {
                notiItem.ProfilePicForSender = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + notiItem.profileImgOfSender;
              }
              else {
                notiItem.ProfilePicForSender = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            }
          })

          let totalOfToCount = vm.pagingInfo.pageIndex * vm.pagingInfo.recordPerPage;
          vm.totalDisplayText = (((vm.pagingInfo.pageIndex - 1) * vm.pagingInfo.recordPerPage) + 1) + " - " + (totalOfToCount < vm.totalNotificationList ? totalOfToCount : vm.totalNotificationList) + " of " + (vm.totalNotificationList);
          vm.isDisableNextBtn = totalOfToCount < vm.totalNotificationList ? false : true;
          vm.isDisablePrevBtn = vm.pagingInfo.pageIndex == 1;


        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* to display all receivers (which ones that receive particular notifications) */
    vm.viewReceivers = (notificationObj) => {
      if (notificationObj.isDisplayReceiverList) {
        notificationObj.allReceiversOfSenderNotification = [];
        notificationObj.isDisplayReceiverList = false;
        return;
      }

      if (notificationObj && notificationObj.id) {
        let notiObj = {
          notificationID: notificationObj.id
        }
        NotificationDirFactory.getAllReceiversOfSenderNotification().save(notiObj).$promise.then((response) => {
          if (response && response.data && response.data.allReceivers) {
            notificationObj["allReceiversOfSenderNotification"] = [];
            notificationObj.allReceiversOfSenderNotification = response.data.allReceivers;
            _.each(notificationObj.allReceiversOfSenderNotification, (empItem) => {
              let deptName = "";
              let gencCategoryName = "";
              if (empItem.deptName) {
                deptName = " (" + empItem.deptName + ")";
              }
              if (empItem.gencCategoryName) {
                gencCategoryName = " " + empItem.gencCategoryName;
              }
              empItem.empNameFullDet = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, empItem.initialName, empItem.firstName, empItem.lastName) + deptName + gencCategoryName;
              if (empItem.profileImg) {
                empItem.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + empItem.profileImg;
              }
              else {
                empItem.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            });
            notificationObj.isDisplayReceiverList = true;
            if (notificationObj.messageSubType == vm.notificationSubType.A) {
              let ackRecvCount = _.filter(notificationObj.allReceiversOfSenderNotification, (item) => { return item.requestStatus == CORE.NotificationRequestStatus.Accepted }).length;
              let penRecvCount = _.filter(notificationObj.allReceiversOfSenderNotification, (item) => { return item.requestStatus == CORE.NotificationRequestStatus.Pending }).length;

              notificationObj.allReceiversText = stringFormat(CORE.Notification_All_Receiver_Link_Text, ackRecvCount, penRecvCount);
            } else {
              notificationObj.allReceiversText = "Details";
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    /* refresh all receivers list from particular sender */
    vm.refreshAllReceiversForSendbox = (notificationObj) => {
      notificationObj.allReceiversOfSenderNotification = [];
      notificationObj.isDisplayReceiverList = false;
      vm.viewReceivers(notificationObj);
    }

    vm.sanitizeHtml = (htmlText) => {
      return htmlText ? $sce.trustAsHtml(htmlText) : '';
    }


    /*********************** General filter data grt/set methods ************************/



    //  Get Work Order list
    function getAllWorkOrderDetail() {
      return MasterFactory.getAllWorkOrderDetail().query().$promise.then((response) => {
        if (response && response.data) {
          vm.workOrderList = response.data;
        }
        return vm.workOrderList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getAllWorkOrderDetail();

    /* get GenericCategory list - notification category */
    let getAllGenericCategoryByCategoryType = () => {
      return GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
        categoryType: CORE.CategoryType.NotificationCategory.Name
      }).$promise.then((response) => {
        vm.notificationCategoryList = [];
        if (response && response.data) {
          vm.notificationCategoryList = response.data;
        }
        return vm.notificationCategoryList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getAllGenericCategoryByCategoryType();

    // get work order operation list by selected work order
    let getWorkOrderOperationList = (woID) => {
      if (woID || vm.autoCompleteWO.keyColumnId) {
        return WorkorderOperationFactory.retriveOPListbyWoID().query({
          woID: woID || vm.autoCompleteWO.keyColumnId
        }).$promise.then((response) => {
          if (response && response.data) {
            _.each(response.data, (item) => {
              item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
            });
            vm.workOrderOperationList = response.data;
          }
          return vm.workOrderOperationList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    // get employee List
    let getEmployeeList = () => {
      return EmployeeFactory.employeeList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.notiSenderReceiverList = response.data;
          _.each(vm.notiSenderReceiverList, (item) => {
            item.fullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName);
            if (item.profileImg && item.profileImg != null) {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
            }
            else {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
          });
        }
        return vm.notiSenderReceiverList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getEmployeeList();

    // get Operation master List
    let getOperationMasterList = () => {
      return MasterFactory.getAllOperationDetail().query().$promise.then((response) => {
        vm.operationMasterList = response.data;
        _.each(vm.operationMasterList, (opItem) => {
          opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
        })
        return vm.operationMasterList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getOperationMasterList();

    // on selection of work order
    let onSelectCallbackFnOfAutoCompleteWO = (selectedWOItem) => {
      vm.workOrderOperationList = [];
      if (selectedWOItem && selectedWOItem.woID) {
        vm.autoCompleteWOOP.keyColumnName = 'woOPID'; // as we conditionally use woOPID and opID
        vm.autoCompleteWOOP.callbackFn = getWorkOrderOperationList;
        getWorkOrderOperationList(selectedWOItem.woID);
      }
      else {
        vm.autoCompleteWOOP.keyColumnName = 'opID';  // as we conditionally use woOPID and opID
        vm.autoCompleteWOOP.callbackFn = getOperationMasterList;
        vm.autoCompleteWOOP.keyColumnId = null;
      }
    }

    // get all assembly list
    let getPartSearch = (searchObj) => {
      return ComponentFactory.getAllAssemblyBySearch().save({
        listObj: searchObj
      }).$promise.then((partList) => {
        if (partList && partList.data.data) {
          vm.partSearchList = partList.data.data;
        }
        else {
          vm.partSearchList = [];
        }
        return vm.partSearchList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.autoCompleteWO = {
      columnName: 'woNumber',
      controllerName: null,
      viewTemplateURL: null,
      keyColumnName: 'woID',
      keyColumnId: null,
      inputName: 'Work Order#',
      placeholderName: CORE.LabelConstant.Workorder.WO,
      isRequired: false,
      isDisabled: false,
      isAddnew: false,
      callbackFn: getAllWorkOrderDetail,
      onSelectCallbackFn: onSelectCallbackFnOfAutoCompleteWO
    }

    vm.autoCompleteWOOP = {
      columnName: 'opFullName',
      controllerName: null,
      viewTemplateURL: null,
      keyColumnName: vm.autoCompleteWO.keyColumnId ? 'woOPID' : 'opID',
      keyColumnId: null,
      inputName: 'Work Order Operation',
      placeholderName: CORE.LabelConstant.Operation.PageName,
      isRequired: false,
      isDisabled: false,
      isAddnew: false,
      callbackFn: vm.autoCompleteWO.keyColumnId ? getWorkOrderOperationList : getOperationMasterList,
      onSelectCallbackFn: null
    }

    vm.autoCompleteNotificationCategory = {
      columnName: 'gencCategoryName',
      keyColumnName: 'gencCategoryID',
      keyColumnId: null,
      inputName: CORE.CategoryType.NotificationCategory.Name,
      placeholderName: CORE.CategoryType.NotificationCategory.Title,
      addData: { headerTitle: CORE.CategoryType.NotificationCategory.Title },
      isRequired: false,
      isAddnew: false,
      callbackFn: getAllGenericCategoryByCategoryType,
      onSelectCallbackFn: null
    }

    vm.autoCompleteNotiSenderReceiver = {
      columnName: 'fullName',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Personnel',
      placeholderName: 'Personnel',
      isRequired: false,
      isAddnew: false,
      callbackFn: getEmployeeList
    };

    vm.autoCompleteSearchAssy = {
      columnName: 'mfgPNWithMfgCode',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'SearchPart',
      placeholderName: "Type here to search assembly",
      isRequired: false,
      isAddnew: false,
      callbackFn: (obj) => {
        //let searchObj = {
        //  id: obj.id,
        //}
        //return getPartSearch(searchObj);
      },
      isAddnew: false,
      onSelectCallbackFn: (partDetail) => {
      },
      onSearchFn: (query) => {
        let searchObj = {
          query: query,
        }
        return getPartSearch(searchObj);
      }
    }

    vm.fromDateChanged = () => {
      if (vm.filterNoti.toDate && vm.filterNoti.fromDate) {
        if ((new Date(vm.filterNoti.fromDate)).setHours(0, 0, 0, 0) > (new Date(vm.filterNoti.toDate)).setHours(0, 0, 0, 0)) {
          vm.filterNoti.toDate = null;
        }
        vm.fromDateOptions = {
          fromDateOpenFlag: false
        };
      }
    }

    vm.toDateChanged = () => {
      if (vm.filterNoti.toDate && vm.filterNoti.fromDate) {
        if ((new Date(vm.filterNoti.fromDate)).setHours(0, 0, 0, 0) > (new Date(vm.filterNoti.toDate)).setHours(0, 0, 0, 0)) {
          vm.filterNoti.fromDate = null;
        }
        vm.toDateOptions = {
          toDateOpenFlag: false
        };
      }
    }

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide('', { closeAll: true });
      if ($rootScope) {
        $rootScope.pageTitle = '';
      }
    });
  }
})();

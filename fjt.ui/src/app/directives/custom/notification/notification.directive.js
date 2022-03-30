(function () {
  'use strict';

  angular
    .module('app.core').directive('notification', notification);

  /** @ngInject */
  function notification($q, $timeout, $filter, CORE, BaseService, DialogFactory, NotificationDirFactory, NotificationSocketFactory, socketConnectionService) { // eslint-disable-line func-names
    return {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'app/directives/custom/notification/notification.html',
      controllerAs: 'vm',
      controller: ['$scope', function ($scope) {
        const vm = this;
        if (!BaseService.loginUser) {
          console.log("logout from notification");
          BaseService.logout();
          return;
        }
        // Get login user employee details
        vm.loginEmpID = BaseService.loginUser.employee.id;
        //vm.notificationSubType = CORE.NotificationSubType;
        //vm.notificationRequestStatus = CORE.NotificationRequestStatus;

        vm.count = 0;
        //vm.notificationList = [];
        //vm.isNotFound = null;
        //vm.urlPrefix = CORE.URL_PREFIX;

        //vm.EmptyMesssage = CORE.EMPTYSTATE.NOTIFICATION;
        //vm.dateTimeDisplayFormat = _dateTimeDisplayFormat
        //vm.pagination = {
        //  pageIndex: 0,
        //  recordPerPage: 10,
        //  sortBy: null,
        //  receiverID: vm.loginEmpID
        //};

        //vm.getNotificationList = getNotificationList;

        function getNotificationCount() {
          NotificationDirFactory.getNotificationCount().query({ receiverID: vm.loginEmpID }).$promise.then((response) => {
            if (response && response.data) {
              vm.count = response.data;
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }

        //function getNotificationList() {
        //    var model = {
        //        pageIndex: ++vm.pagination.pageIndex,
        //        recordPerPage: vm.pagination.recordPerPage,
        //        sortBy: vm.pagination.sortBy,
        //        receiverID: vm.loginEmpID
        //    };

        //    // Show loaded only if first time record fetch
        //    var promise = null;
        //    if (vm.pagination.pageIndex == 1) {
        //        vm.notificationList = [];
        //        vm.isNotFound = null;
        //        vm.cgBusyLoading = promise = NotificationDirFactory.getNotificationList().save(model).$promise;
        //    }
        //    else
        //        promise = NotificationDirFactory.getNotificationList().save(model).$promise;

        //    promise.then((response) => {
        //        if (response && response.data) {
        //            response.data.forEach((x) => {
        //                if (x.redirectUrl) {
        //                    x.redirectUrl = x.redirectUrl.replace(/{receiverID}/g, x.receiverID);
        //                }
        //                x.icon = x.firstName[0].toUpperCase() + x.lastName[0].toUpperCase()
        //            });

        //            vm.notificationList = vm.notificationList.concat(response.data);

        //            // eliminate duplicate records
        //            vm.notificationList = _.uniqBy(vm.notificationList, 'id');

        //            if (!vm.notificationList.length)
        //                vm.isNotFound = true;
        //        }
        //    }).catch((error) => {
        //        return BaseService.getErrorLog(error);
        //    });
        //}

        getNotificationCount();
        //getNotificationList();

        //// called from notification controller to decrease read notification count
        //let updateNotificationCountOnHeader = $scope.$on('updateNotificationCountOnHeader', function (obj) {
        //  vm.count = --vm.count;
        //});

        // [S] Socket Listeners
        function connectSocket() {
          //console.info("Socket on: notification:receive");
          socketConnectionService.on('notification:receive', notificationReceiveListener);
          socketConnectionService.on('message:receive', socketCallReceiveListener);
        }
        connectSocket();

        socketConnectionService.on('reconnect', () => {
          connectSocket();
        });

        function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

        function notificationReceive(message) {
          //var obj = _.find(vm.notificationList, (x) => { return x.id == message.id; });
          //if (!obj) {
          //    message.icon = message.firstName[0].toUpperCase() + message.lastName[0].toUpperCase();
          //    if (message.redirectUrl) {
          //        message.redirectUrl = message.redirectUrl.replace(/{receiverID}/g, message.receiverID);
          //    }
          //    vm.notificationList.unshift(message);
          //    vm.count++;
          //    vm.isNotFound = null;
          //}
          getNotificationCount();
        }

        function removeSocketListener() {
          socketConnectionService.removeListener('notification:receive', notificationReceiveListener);
          socketConnectionService.removeListener('message:receive', socketCallReceiveListener);
        }
        $scope.$on('$destroy', function () {
          //updateNotificationCountOnHeader();
          removeSocketListener();
        });

        socketConnectionService.on('disconnect', function () {
          removeSocketListener();
        });
                
        function socketCallReceiveListener(message) {
          socketCallReceive(message);
        }

        // on notification message receive, called below one common function
        function socketCallReceive(message) {
          if (message && message.event) {
            switch (message.event) {
              case CORE.Socket_IO_Events.CommonNotification.ANY_NOTIFICATION_READ:
                getNotificationCount();
                break;
            }
          }
        }


      }],
      link: function (scope, elem, attr) {
        var vm = scope.vm;

        scope.accept = function (notification) {
          //var model = {
          //  notificationID: notification.notificationID,
          //  receiverID: notification.receiverID,
          //  requestStatus: CORE.NotificationRequestStatus.Accepted
          //};
          //NotificationSocketFactory.ackNotification().save(model).$promise.then((response) => {
          //  if (response && response.data) {
          //    notification.requestStatus = vm.notificationRequestStatus.Accepted;
          //  }
          //}).catch((error) => {
          //  /* empty */
          //});
        }

        scope.$on('$mdMenuOpen', function (ev, element) {
          if (element.attr('id') == 'noti-menu') {
            //clearNotificationCount();
            BaseService.goToNotificationList();
          }
        });

        scope.$on('$mdMenuClose', function (ev, element) {
          //if (element.attr('id') == 'noti-menu') {
          //  vm.notificationList.forEach((x) => { x.isRead = true; });
          //}
        });

        //function clearNotificationCount() {
        //    var model = {
        //        receiverID: vm.loginEmpID
        //    };
        //    NotificationDirFactory.clearNotificationCount().save(model).$promise.then((response) => {
        //        vm.count = 0;
        //    });
        //}
      }
    }
  }
})();

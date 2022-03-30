(function () {
  'use strict';

  angular
    .module('fuse')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $rootScope, $timeout, socketConnectionService, ChatFactory, CORE, CHAT, BaseService, DialogFactory) {
    // Data
    // Remove the splash screen
    $scope.$on('$viewContentAnimationEnded', function (event) {
      if (event.targetScope.$id === $scope.$id) {
        $rootScope.$broadcast('msSplashScreen::remove');
      }
    });

    function connectSocket() {
      socketConnectionService.on('receive:message', receiveMessage);
      socketConnectionService.on('message:receive', notificationReceiveListener);
    }

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    let userObj = BaseService.loginUser;
    if (userObj) {

      // [S] Socket
      socketConnectionService.connect();

      //console.info("Socket emit: user:new");
      socketConnectionService.emit('user:new', userObj);
      connectSocket();
    }

    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.CHAT_MESSAGE.TYPE: {
          var data = message.data;
          if (data.senderID != userObj.userid && data.receiverID == userObj.userid) {
            var model = {
              title: stringFormat("Message from {0} {1}", data.firstName, data.lastName),
              textContent: message.data.message,
              multiple: true
            };

            DialogFactory.alertDialog(model);
          }
        }
      }
    }

    function removeSocketListener() {
      socketConnectionService.removeListener('receive:message', receiveMessage);
      socketConnectionService.removeListener('message:receive', notificationReceiveListener);
    }
    // Remove socket listeners
    $scope.$on('$destroy', function () {
      removeSocketListener();
    });

    // Remove listeners
    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

    function receiveMessage(message) {
      if (message.senderID != userObj.userid && !ChatFactory.isChatOpen) {
        if (ChatFactory.chatMessageCount != undefined && ChatFactory.chatMessageCount != null) {
          ChatFactory.chatMessageCount++;
        } else {
          ChatFactory.chatMessageCount = 0;
          ChatFactory.chatMessageCount++;
        }

        if (message.groupID) {
          updateGroupMessageReadStatus(message.groupID, false);
        }
      }
    }

    function updateGroupMessageReadStatus(groupID, isRead) {
      var model = {
        groupID: groupID,
        participantID: userObj.userid,
        isRead: isRead
      };

      ChatFactory.updateGroupMessageReadStatus().save(model).$promise.then((response) => { }).catch((err) => { });
    }
  }
})();

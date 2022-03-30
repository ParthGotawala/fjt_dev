(function () {
    'use strict';
    // directive created on ms-navigation-item attribute of side navigation bar
    /** @ngInject */
    angular.module('app.core').directive('chat', function (ChatFactory, $timeout, DialogFactory, CHAT, BaseService) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/custom/chat/chat.html',
            scope: {},
            link: function (scope, $element, attrs) {

                scope.openChatPopup = openChatPopup;
                // Open chat popup
                function openChatPopup(event) {
                    var data = {
                        workAreaID: null
                    };

                    DialogFactory.dialogService(
                        CHAT.CHAT_CONTROLLER,
                        CHAT.CHAT_VIEW,
                        event,
                        data).then((result) => {
                        }, () =>{
                        }, (error) => {
                            return BaseService.getErrorLog(error);
                        });
                }

                function getTotalUnreadMessageCount() {                    
                    var sender = BaseService.loginUser;
                    if (sender && sender.userid) {
                        return ChatFactory.getTotalUnreadMessageCount().query({ senderID: sender.userid }).$promise.then((response) => {
                            if (response && response.data > 0) {
                                ChatFactory.chatMessageCount = response.data;
                            }
                        }).catch((err) => {
                            ChatFactory.chatMessageCount = 0;
                        });
                    }
                }
                getTotalUnreadMessageCount();

                scope.$watch(function () { return ChatFactory.chatMessageCount; }, function (newVal, oldVal) {
                    scope.count = newVal || 0;
                });
            }
        }
    });
})();

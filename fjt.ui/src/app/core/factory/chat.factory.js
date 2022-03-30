(function () {
  'use strict';

  angular
    .module('app.workorder').factory('ChatFactory', ChatFactory);

  /** @ngInject */
  function ChatFactory($resource, CORE) {
    return {
      chatMessageCount: 0,    // chat menu item counter
      isChatOpen: false,  // if chat popup is open or not
      getContactList: () => $resource(CORE.API_URL + 'chat/getContactList/:senderId/:workAreaID', {
        senderId: '@_senderId',
        workAreaID: '@_workAreaID'
      },
        {
          query: {
            isArray: false,
            method: 'GET',
          }
        }),
      getChatDetail: () => $resource(CORE.API_URL + 'chat/getChatDetail/:senderId/:receiverId/:recordPerPage/:pageIndex', {
        senderId: '@_senderId',
        receiverId: '@_receiverId'
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),
      sendMessage: () => $resource(CORE.API_URL + 'chat/sendMessage', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
        }
      }),
      sendGroupMessage: () => $resource(CORE.API_URL + 'chat/sendGroupMessage', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
        }
      }),
      createGroup: () => $resource(CORE.API_URL + 'chat/createGroup', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getGroupChatLogDetail: () => $resource(CORE.API_URL + 'chat/getGroupChatLogDetail/:groupID/:senderID/:recordPerPage/:pageIndex', {
        groupID: '@_groupID',
        senderID: '@_senderID'
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),
      getGroupDetails: () => $resource(CORE.API_URL + 'chat/getGroupDetails/:groupID', {
        groupID: '@_groupID'
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),
      createGroupParticipant: () => $resource(CORE.API_URL + 'chat/createGroupParticipant', {
      }, {
        query: {
          isArray: true,
          method: 'POST'
        }
      }),
      changeGroupName: () => $resource(CORE.API_URL + 'chat/changeGroupName', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteGroupParticipant: () => $resource(CORE.API_URL + 'chat/deleteGroupParticipant', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getStandardMessage: () => $resource(CORE.API_URL + 'chat/getStandardMessage/:workAreaID', {
        groupID: '@_workAreaID'
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),
      setUserStatus: () => $resource(CORE.API_URL + 'chat/setUserStatus', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
        }
      }),
      updateReceiverMessageReadStatus: () => $resource(CORE.API_URL + 'chat/updateReceiverMessageReadStatus', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
        }
      }),
      updateGroupMessageReadStatus: () => $resource(CORE.API_URL + 'chat/updateGroupMessageReadStatus', {
      }, {
        query: {
          isArray: false,
          method: 'POST',
        }
      }),
      getTotalUnreadMessageCount: () => $resource(CORE.API_URL + 'chat/getTotalUnreadMessageCount/:senderID', {
        senderID: '@_senderID'
      }, {
        query: {
          isArray: false,
          method: 'GET',
        }
      }),
      getSerchChatMessage: () => $resource(CORE.API_URL + 'chat/getSerchChatMessage', {},
        {
          query: {
            isArray: false,
            method: 'GET',
          }
        }),
      getReceiverSearchChatMessage: () => $resource(CORE.API_URL + 'chat/getReceiverSearchChatMessage', {},
        {
          query: {
            isArray: false,
            method: 'GET',
          }
        }),
    }
  }
})();

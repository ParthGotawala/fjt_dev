(function () {
  'use strict';
  /** @ngInject */
  var CHAT = {
    REMARKFLAG: {
      NEW_MESSAGE: 'M',
      SPECIAL_MESSAGE: 'S'
    },
    CHAT_EMPTYSTATE: {
      TEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No messages are defined yet!'
      },
      CHAT_SEARCH: {
        IMAGEURL: 'assets/images/emptystate/chat search.png',
        EMPTY_MESSAGE: 'Please search something.',
        SEARCH_EMPTY_MESSAGE: 'No Result found for'
      }
    },
    CHAT_VIEW: 'app/main/traveler/travelers/chat/chat.html',
    CHAT_CONTROLLER: 'ChatController',
    RECORD_PER_PAGE: 10,
    USER_STATUS: {
      ONLINE: 'O',
      AWAY: 'A',
      DONOTDISTURB: 'D',
      OFFLINE: 'F'
    },
    CHAT_SEARCH_OPTION: {
      ALL: 'A',
      CONTACT: 'C',
      GROUP: 'G',
      MESSAGE: 'M'
    }
  };
  angular
    .module('app.traveler.travelers')
    .constant('CHAT', CHAT);
})();

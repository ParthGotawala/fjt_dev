(function () {
  'use strict';

  angular.module('app.traveler.travelers').controller('ChatController', ChatController);

  /** @ngInject */
  function ChatController($scope, $timeout, $filter, $q, $mdSidenav, $mdDialog, data, socketConnectionService, ChatFactory, EmployeeFactory, CHAT, DialogFactory, CORE, USER, BaseService, MasterFactory, TRAVELER) {
    var vm = this;

    var woID = data.woID;
    var opID = data.opID;
    vm.workAreaID = data.workAreaID;
    let workOrderOperation = null;
    vm.isFromTraveler = (vm.workAreaID || woID || opID) ? true : false;
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.sender = BaseService.loginUser;
    // current selected contact object
    vm.receiver = null;
    let isFirstTime = true;
    // list to maintain selected group member before creating new group
    vm.selectedContactForGroup = [];
    // list to display member to add into group
    vm.contactListForGroup = [];
    // list for all contancts
    vm.contactList = [];
    // button text for add contacts into group popup

    vm.chatSearch = data && data.chatsearch ? data.chatsearch : '';
    let contactlistCopy = [];

    // If high priority message then display message as popup to user
    vm.isHighPriorityMsg = false;

    vm.btnGroupText = 'Create Group';
    vm.remarkFlag = CHAT.REMARKFLAG;
    vm.EmptyMesssage = CHAT.CHAT_EMPTYSTATE.TEMPLATE;
    vm.ChatSearchEmptyMesssage = CHAT.CHAT_EMPTYSTATE.CHAT_SEARCH;
    vm.chatSearchOption = CHAT.CHAT_SEARCH_OPTION;
    if (vm.isFromTraveler && vm.workAreaID) {
      vm.currentTab = vm.chatSearchOption.CONTACT;
      vm.tabIndex = 1;
    } else if (data && data.chatsearch) {
      vm.currentTab = vm.chatSearchOption.MESSAGE;
      vm.tabIndex = 3;
    } else {
      vm.currentTab = vm.chatSearchOption.CONTACT;
      vm.tabIndex = 0;
    }
    vm.WorkArea = CORE.CategoryType.WorkArea;
    vm.CategoryType = angular.copy(_.find(CORE.Category_Type, x => x.categoryTypeID == vm.WorkArea.ID));
    // selected Responsibilities id
    // standard message list based on Responsibilities
    vm.standardMessageList = [];

    vm.userStatus = CHAT.USER_STATUS;
    vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;

    ChatFactory.isChatOpen = true;
    // get Employee responsibilityList
    const getResponsibilitywiseEmployeeList = () => EmployeeFactory.getResponsibilityWiseEmployeeList().query({
      gencCategoryType: vm.WorkArea.Name
    }).$promise.then((res) => {
      if (res && res.data) {
        vm.ResponsibilityList = res.data;
        if (isFirstTime) {
          initResponsibilityAutocomplete();
        }
        if (vm.workAreaID) {
          vm.currentTab = vm.chatSearchOption.CONTACT;
          vm.onTabChanges(vm.currentTab);
        }
      }
      return $q.resolve(res);
    }).catch((error) => BaseService.getErrorLog(error));


    function getResponsibilityContactList(item) {
      if (item) {
        vm.workAreaID = item.gencCategoryID;
        if (vm.currentTab !== vm.chatSearchOption.CONTACT || isFirstTime) {
          isFirstTime = false;
        }
        vm.onTabChanges(vm.currentTab);
      } else {
        vm.workAreaID = null;
        vm.onTabChanges(vm.currentTab);
      }
    }

    const initResponsibilityAutocomplete = () => {
      vm.autoCompleteWorkAreaDetail = {
        columnName: 'gencCategoryName',
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.workAreaID,
        inputName: vm.WorkArea.Name,
        placeholderName: CORE.CategoryType.WorkArea.Title,
        isAddnew: false,
        callbackFn: getResponsibilitywiseEmployeeList,
        onSelectCallbackFn: getResponsibilityContactList
      };
    };

    let pagination = {
      pageIndex: 1,
      recordPerPage: CHAT.RECORD_PER_PAGE
    };
    // close chat popup on Esc key press.
    $(document).keyup((e) => {
      if (e.keyCode === 27) {
        vm.closeChat();
      }
    });
    // for responsive screen
    vm.toggleSidenav = (sidenavId) => {
      $mdSidenav(sidenavId).toggle();
    };

    vm.searchGroupContacts = (criteria) => $filter('filter')(vm.contactListForGroup, { name: criteria });

    // get workorder and operation details only of woID and opID passed (from traveler page)
    if (woID && opID) {
      getWorkorderOperationDetails();
    }

    const getContactList = (isbindlist) => {
      ChatFactory.getContactList().query({ senderId: vm.sender.userid, workAreaID: vm.workAreaID || 0 }).$promise.then((response) => {
        vm.contactList = [];
        let contactList = [];
        (response.data).forEach((item) => {
          if (item.id) {
            if (item.id !== vm.sender.userid) {
              if (item.firstname || item.lastname) {
                item.name = `${item.firstname} ${item.lastname}`;
                item.namechar = (item.firstname[0] + item.lastname[0]).toUpperCase();
                if (item.profilePic) {
                  item.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profilePic;
                }
                else {
                  item.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }
              }
              contactList.push(item);
            }
            else {
              vm.sender.name = `${item.firstname} ${item.lastname}`;
              vm.sender.firstname = item.firstname;
              vm.sender.namechar = (item.firstname[0] + item.lastname[0]).toUpperCase();
              vm.sender.onlineStatus = item.onlineStatus;
              if (item.profilePic) {
                vm.sender.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profilePic;
              }
              else {
                vm.sender.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            }
          }
          else if (item.groupID) {
            item.name = item.groupName;
            contactList.push(item);
          }
        });

        if (vm.receiver && !isbindlist) {
          let receiverObj = null;
          if (vm.receiver.groupID) {
            receiverObj = _.find(contactList, (objContact) => objContact.groupID == vm.receiver.groupID);
          } else {
            receiverObj = _.find(contactList, (objContact) => objContact.id == vm.receiver.id);
          }
          if (receiverObj) {
            vm.getChatDetail(receiverObj, false);
          }
        }
        if (vm.isFromTraveler && isFirstTime) {
          getResponsibilitywiseEmployeeList();
        }
        contactlistCopy = angular.copy(contactList);

        if (vm.currentTab === vm.chatSearchOption.CONTACT) {
          vm.contactList = _.filter(contactList, (item) => !item.groupID);
        } else if (vm.currentTab === vm.chatSearchOption.GROUP) {
          vm.contactList = _.filter(contactList, (item) => item.groupID);
        } else if (vm.currentTab === vm.chatSearchOption.ALL) {
          vm.contactList = contactList;
        } else if (vm.currentTab === vm.chatSearchOption.MESSAGE) {
          vm.contactList = [];
        }

        if (vm.currentTab !== vm.chatSearchOption.GROUP && (!vm.chatSearch)) {
          vm.contactListForGroup = angular.copy(_.filter(contactlistCopy, (x) => { return !x.groupID; }));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getParticipantChatDetail = (participant) => {
      const objParticipant = _.find(vm.contactList, (item) => item.id == participant.participantID);

      vm.getChatDetail(objParticipant);
    };
    // also called from directive 'scrollEnd' when div scroll ends
    vm.getChatDetail = (receiver, isSearch, msgobj) => {
      if (receiver && isSearch == false) {
        vm.isFindMessage = isSearch;
        if (!isSearch) {
          vm.searchMessage = null;
          vm.selectedCount = 0;
          vm.totalResult = 0;
        }
      }
      if (vm.receiver && receiver && vm.receiver.groupID != receiver.groupID && vm.receiver.id != receiver.id) {
        vm.EditMessaage = null;
      }
      // when called from directive on scroll end we do not get receiver into parameter
      vm.receiver = receiver || vm.receiver;

      if (!receiver) {
        angular.element('#chat-content').stop();
      }

      // on contact select set message count to zero
      vm.receiver.messageCount = 0;

      //// chat textarea content blank
      //vm.replyMessage = null;
      // reset contact list for add to group members
      vm.resetChat();
      // if group title editor is open then close it
      vm.cancelEditGroupNameClicked();
      // remove chat contents
      if (!msgobj) {
        pagination = {
          // if receiver is null then it is called from scroll directive so increase pageIndex by 1
          // if receiver is exists then it is called from contact click so pageIndex = 1
          pageIndex: receiver ? 1 : pagination.pageIndex + 1,
          recordPerPage: CHAT.RECORD_PER_PAGE
        };
      } else {
        pagination = {
          pageIndex: 1,
          recordPerPage: msgobj.chatOrder > CHAT.RECORD_PER_PAGE ? msgobj.chatOrder : CHAT.RECORD_PER_PAGE
        };
      }

      if (vm.receiver.groupID) {
        ChatFactory.getGroupDetails().query({ groupID: vm.receiver.groupID }).$promise.then((response) => {
          if (response.data) {
            vm.receiver.groupParticipantDetails = response.data.groupParticipantDetails;
            const member = _.find(vm.receiver.groupParticipantDetails, (x) => { return x.participantID == vm.sender.userid; });
            if (member) {
              vm.isAdmin = member.isAdmin === true;
              vm.isUserInGroup = true;
            }
            else {
              vm.isUserInGroup = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));

        ChatFactory.getGroupChatLogDetail().query({ groupID: vm.receiver.groupID, senderID: vm.sender.userid, pageIndex: pagination.pageIndex, recordPerPage: pagination.recordPerPage }).$promise.then((response) => {
          if (receiver) {
            vm.chat = response.data;
            vm.chat.forEach((x) => {
              x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
              if (x.profilePic) {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
              }
              else {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            });

            updateGroupMessageReadStatus(vm.receiver.groupID, true).then(() => {
              getTotalUnreadMessageCount();
            });

            // if called from contact click then scroll to bottom of chat section
            scrollToBottomOfChat();
          }
          else {
            if (vm.chat.length > 0) {
              let lastElem = null;

              response.data.forEach((x) => {
                x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
                if (x.profilePic) {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
                }
                else {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }
              });
              if (msgobj) {
                vm.chat = response.data;
              } else {
                vm.chat = (response.data).concat(vm.chat);
              }

              vm.chat = _.uniqBy(vm.chat, 'groupChatID');

              if (response.data.length) {
                $timeout(() => {
                  if (msgobj) {
                    lastElem = angular.element('#chat_' + msgobj.chatid);
                  } else {
                    lastElem = angular.element('#chat_' + vm.chat[0].groupChatID);
                  }
                  const chatContent = angular.element('#chat-content');
                  if (chatContent[0]) {
                    chatContent.animate({
                      scrollTop: lastElem.offset().top - (lastElem.height() * 3)
                    }, 0);
                  }
                }, 0);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        ChatFactory.getChatDetail().query({ senderId: vm.sender.userid, receiverId: vm.receiver.id, pageIndex: pagination.pageIndex, recordPerPage: pagination.recordPerPage }).$promise.then((response) => {
          if (receiver) {
            vm.chat = response.data;
            vm.chat.forEach((x) => {
              x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
              if (x.profilePic) {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
              }
              else {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            });
            updateReceiverMessageReadStatus(vm.receiver.id).then(() => {
              getTotalUnreadMessageCount();
            });

            // if called from contact click then scroll to bottom of chat section
            scrollToBottomOfChat();
          }
          else {
            if (vm.chat.length > 0) {
              var lastElem = null;

              response.data.forEach((x) => {
                x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
                if (x.profilePic) {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
                }
                else {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }
              });
              if (msgobj) {
                vm.chat = response.data;
              } else {
                vm.chat = (response.data).concat(vm.chat);
              }
              vm.chat = _.uniqBy(vm.chat, 'chatID');

              if (response.data.length) {
                $timeout(() => {
                  if (msgobj) {
                    lastElem = angular.element('#chat_' + msgobj.chatid);
                  } else {
                    lastElem = angular.element('#chat_' + vm.chat[0].chatID);
                  }
                  var chatContent = angular.element('#chat-content');
                  if (chatContent[0]) {
                    chatContent.animate({
                      scrollTop: lastElem.offset().top - (lastElem.height() * 2)
                    }, 0);
                  }
                }, 0);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      initClick();
    };


    //also called from directive 'scrollEnd' when div scroll ends
    vm.getMsgChatDetail = (msg) => {
      // when called from directive on scroll end we do not get receiver into parameter
      vm.msg = msg || vm.msg;
      if (vm.isFindMessage) {
        vm.searchMessage = null;
        vm.selectedCount = 0;
        vm.totalResult = 0;
        vm.isFindMessage = false;
      }
      let isSelectedChat = null;
      if (!msg) {
        angular.element('#chat-content').stop();
      } else {
        vm.chat = [];
      }

      // chat textarea content blank
      vm.replyMessage = null;

      pagination = {
        pageIndex: msg ? 1 : pagination.pageIndex + 1,
        recordPerPage: CHAT.RECORD_PER_PAGE
      };

      if (vm.msg.groupID) {
        ChatFactory.getGroupDetails().query({ groupID: vm.msg.groupID }).$promise.then((response) => {
          if (response.data) {
            vm.receiver = _.find(contactlistCopy, (objContact) => objContact.groupID == vm.msg.groupID);
            vm.receiver.groupParticipantDetails = response.data.groupParticipantDetails;
            const member = _.find(vm.receiver.groupParticipantDetails, (x) => { return x.participantID == vm.sender.userid; });
            if (member) {
              vm.isAdmin = member.isAdmin === true;
              vm.isUserInGroup = true;
            }
            else {
              vm.isUserInGroup = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));

        ChatFactory.getGroupChatLogDetail().query({ groupID: vm.msg.groupID, senderID: vm.sender.userid, pageIndex: pagination.pageIndex, recordPerPage: pagination.recordPerPage }).$promise.then((response) => {
          if (msg) {
            vm.chat = response.data;
            vm.chat.forEach((x) => {
              x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
              if (x.profilePic) {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
              }
              else {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            });
            if (vm.currentTab == vm.chatSearchOption.MESSAGE) {
              isSelectedChat = _.find(vm.chat, (objChat) => objChat.groupChatID == msg.chatid);
              if (!isSelectedChat) {
                vm.getMsgChatDetail();
              }
            }
          }
          else {
            if (vm.chat.length > 0) {
              let lastElem = null;

              response.data.forEach((x) => {
                x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
                if (x.profilePic) {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
                }
                else {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }
              });
              vm.chat = (response.data).concat(vm.chat);
              vm.chat = _.uniqBy(vm.chat, 'groupChatID');
              if (vm.currentTab == vm.chatSearchOption.MESSAGE) {
                isSelectedChat = _.find(vm.chat, (objChat) => objChat.groupChatID == vm.msg.chatid);
                if (!isSelectedChat) {
                  vm.getMsgChatDetail();
                }
              }
              if (isSelectedChat) {
                $timeout(() => {
                  if (vm.msg) {
                    lastElem = angular.element('#chat_' + vm.msg.chatid);
                  } else {
                    lastElem = angular.element('#chat_' + vm.chat[0].groupChatID);
                  }
                  const chatContent = angular.element('#chat-content');
                  if (chatContent[0]) {
                    chatContent.animate({
                      scrollTop: lastElem.offset().top - (lastElem.height() * 3)
                    }, 0);
                  }
                }, 0);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        ChatFactory.getChatDetail().query({ senderId: vm.sender.userid, receiverId: vm.sender.userid == vm.msg.senderID ? vm.msg.receiverID : vm.msg.senderID, pageIndex: pagination.pageIndex, recordPerPage: pagination.recordPerPage }).$promise.then((response) => {
          if (msg) {
            vm.receiver = _.find(contactlistCopy, (objContact) => objContact.id == (vm.sender.userid == vm.msg.senderID ? vm.msg.receiverID : vm.msg.senderID));
            vm.chat = response.data;
            vm.chat.forEach((x) => {
              x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
              if (x.profilePic) {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
              }
              else {
                x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }
            });
            if (vm.currentTab == vm.chatSearchOption.MESSAGE) {
              isSelectedChat = _.find(vm.chat, (objChat) => objChat.chatID == msg.chatid);
              if (!isSelectedChat) {
                vm.getMsgChatDetail();
              }
            }
          }
          else {
            if (vm.chat.length > 0) {
              let lastElem = angular.element('#chat_' + vm.chat[0].chatID);
              response.data.forEach((x) => {
                x.namechar = (x.firstName[0] + x.lastName[0]).toUpperCase();
                if (x.profilePic) {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + x.profilePic;
                }
                else {
                  x.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }
              });
              vm.chat = (response.data).concat(vm.chat);
              vm.chat = _.uniqBy(vm.chat, 'chatID');
              if (vm.currentTab == vm.chatSearchOption.MESSAGE) {
                isSelectedChat = _.find(vm.chat, objChat => objChat.chatID == vm.msg.chatid);
                if (!isSelectedChat) {
                  vm.getMsgChatDetail();
                }
              }
              if (isSelectedChat) {
                $timeout(() => {
                  if (vm.msg) {
                    lastElem = angular.element('#chat_' + vm.msg.chatid);
                  } else {
                    lastElem = angular.element('#chat_' + vm.chat[0].chatID);
                  }
                  const chatContent = angular.element('#chat-content');
                  if (chatContent[0]) {
                    chatContent.animate({
                      scrollTop: lastElem.offset().top - (lastElem.height() * 2)
                    }, 0);
                  }
                }, 0);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      initClick();
    };

    vm.sendMessage = () => {
      if ((vm.replyMessage || '').trim() === '') {
        resetReplyTextarea();
        return;
      }

      let messageText = vm.replyMessage;
      if (!vm.EditMessaage && workOrderOperation) {
        messageText = stringFormat(TRAVELER.WORKORDER_CHAT_MESSAGE,
          workOrderOperation.workorder.mfgPN,
          workOrderOperation.workorder.nickName ? '[' + workOrderOperation.workorder.nickName + ']' : '',
          workOrderOperation.salesOrderData.woSONumberList, workOrderOperation.salesOrderData.woSOPONumberList,
          workOrderOperation.workorder.woNumber, workOrderOperation.workorder.woVersion,
          convertToThreeDecimal(workOrderOperation.operation.opNumber), workOrderOperation.operation.opVersion, messageText);
      }
      if (vm.EditMessaage) {
        const objMessage = vm.EditMessaage.message.split('</b><br/>');
        if (_.isArray(objMessage) && objMessage.length == 2) {
          messageText = objMessage[0] + '</b><br/>' + vm.replyMessage;
        }
      }

      if (vm.receiver.groupID) {
        const message = {
          senderID: vm.sender.userid,
          groupID: vm.receiver.groupID,
          message: messageText,
          remarkFlag: vm.remarkFlag.NEW_MESSAGE,
          isHighPriorityMsg: vm.isHighPriorityMsg
        };
        if (vm.EditMessaage) {
          message.groupChatID = vm.EditMessaage.groupChatID;
        }

        ChatFactory.sendGroupMessage().save(message).$promise.then((response) => {
          if (response && response.data && response.data[0]) {
            const chatObj = response.data[0];
            chatObj.namechar = (chatObj.firstName[0] + chatObj.lastName[0]).toUpperCase();
            chatObj.profilePic = vm.sender.profilePic;
            // Add the message to the chat
            //console.info("Socket emit: send:group_message");
            socketConnectionService.emit('send:group_message', chatObj);
            if (vm.EditMessaage) {
              const msg = _.find(vm.chat, (objChat) => {
                return objChat.groupChatID == vm.EditMessaage.groupChatID;
              });
              if (msg) {
                msg.message = message.message;
              }
            } else {
              vm.chat.push(chatObj);
              // Scroll to the new message
              scrollToBottomOfChat();
            }

            // Reset the reply textarea
            resetReplyTextarea();

            // disable priority message
            vm.isHighPriorityMsg = false;
            vm.EditMessaage = null;
            getContactList(true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else { //Group chat code
        // Message
        const message = {
          senderID: vm.sender.userid,
          receiverID: vm.receiver.id,
          message: messageText,
          isRead: false,
          isHighPriorityMsg: vm.isHighPriorityMsg
        };
        if (vm.EditMessaage) {
          message.chatID = vm.EditMessaage.chatID;
        }
        ChatFactory.sendMessage().save(message).$promise.then((response) => {
          if (response && response.data && response.data[0]) {
            const chatObj = response.data[0];
            chatObj.namechar = (chatObj.firstName[0] + chatObj.lastName[0]).toUpperCase();
            chatObj.profilePic = vm.sender.profilePic;
            // Add the message to the chat
            //console.info("Socket emit: send:message");
            socketConnectionService.emit('send:message', chatObj);
            if (vm.EditMessaage) {
              const msg = _.find(vm.chat, (objChat) => {
                return objChat.chatID == vm.EditMessaage.chatID;
              });
              if (msg) {
                msg.message = message.message;
              }
            } else {
              vm.chat.push(chatObj);
              // Scroll to the new message
              scrollToBottomOfChat();
            }

            vm.EditMessaage = null;
            // Reset the reply textarea
            resetReplyTextarea();

            // disable priority message
            vm.isHighPriorityMsg = false;
            getContactList(true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
    };

    const resetReplyTextarea = () => {
      vm.replyMessage = '';
      vm.textareaGrow = false;
    };

    // [S] Socket Listeners
    // Common function for connect socket listener
    function connectSocket() {
      socketConnectionService.on('receive:message', updateChatListener);
      socketConnectionService.on('create:group', addIntoGroupListener);
      socketConnectionService.on('change:group_name', changeGroupNameBySocketListener);
      socketConnectionService.on('remove:group_member', removeMemberFromGroupListener);
      socketConnectionService.on(CORE.Socket_IO_Events.User.User_Status, changeUserStatusListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function updateChatListener(message) { $timeout(updateChat(message)); }
    function addIntoGroupListener(message) { $timeout(addIntoGroup(message)); }
    function changeGroupNameBySocketListener(message) { $timeout(changeGroupNameBySocket(message)); }
    function removeMemberFromGroupListener(message) { $timeout(removeMemberFromGroup(message)); }
    function changeUserStatusListener(message) { $timeout(changeUserStatus(message)); }

    function updateChat(message) {
      if (message.groupID) {
        if (vm.receiver && message.groupID == vm.receiver.groupID) {
          const objmsg = _.find(vm.chat, (objchatmsg) => objchatmsg.groupChatID == message.groupChatID);
          if (objmsg) {
            objmsg.message = message.message;
          } else {
            vm.chat.push(message);
          }

          updateGroupMessageReadStatus(message.groupID, true);
          $timeout(() => {
            var chatContent = angular.element('#chat-content');
            if (chatContent[0]) {
              const scrollTop = chatContent.scrollTop();
              if (chatContent[0].scrollHeight - scrollTop <= 561) {
                chatContent.animate({
                  scrollTop: chatContent[0].scrollHeight
                }, 0);
              }
            }
          }, 0);
        }
        else {
          const group = _.find(vm.contactList, (item) => {
            return item.groupID === message.groupID;
          });

          if (group) {
            //  if (!group.messageCount)
            //    group.messageCount = 0;
            //  group.messageCount++;

            updateGroupMessageReadStatus(message.groupID, false);
          }
        }
      } else {
        getContactList();
      }
    };

    function addIntoGroup(message) {
      var group = _.find(vm.contactList, { groupID: message.groupID });
      if (group) {
        group = message;
      } else {
        vm.contactList.unshift(message);
      }

      if (vm.receiver && vm.receiver.groupID == message.groupID) {
        vm.receiver.groupParticipantDetails = message.groupParticipantDetails;
        vm.isUserInGroup = _.find(vm.receiver.groupParticipantDetails, (x) => { return x.participantID == vm.sender.userid; }) != null;
      }
      getContactList();
    }
    function changeGroupNameBySocket(message) {
      if (vm.receiver && vm.receiver.groupID == message.groupID) {
        vm.receiver.name = message.groupName;
      }

      const group = _.find(vm.contactList, { groupID: message.groupID });
      if (group) {
        group.name = message.groupName;
      }
      getContactList();
    }
    function removeMemberFromGroup(message) {
      if (vm.receiver && vm.receiver.groupID == message.groupID) {
        _.remove(vm.receiver.groupParticipantDetails, (item) => { return item.participantID == message.participantID; });
        if (vm.sender.userid == message.participantID) {
          // if user is between editing group then cancel edit
          vm.cancelEditGroupNameClicked();
          vm.isUserInGroup = false;
        }
      }
      getContactList();
    }
    function changeUserStatus(message) {
      if (message.userID == vm.sender.userid) {
        vm.sender.onlineStatus = message.onlineStatus;
      }
      else {
        const sender = _.find(vm.contactList, (item) => {
          return item.id === message.userID;
        });

        if (sender) {
          sender.onlineStatus = message.onlineStatus;
        }
      }
      getContactList();
    }
    // [E] Socket Listeners

    vm.createGroup = () => {
      if (vm.receiver.groupID) {
        vm.saveBtnDisableFlag = true;

        const selectedMembers = vm.selectedContactForGroup.map((x) => {
          return {
            participantID: x.id,
            participantAddedBy: vm.sender.userid,
            groupID: vm.receiver.groupID
          };
        });

        vm.cgBusyLoading = ChatFactory.createGroupParticipant().save(selectedMembers).$promise.then((response) => {
          if (response && response.data) {
            response.data.name = response.data.groupName;
            //console.info("Socket emit: create:group");
            socketConnectionService.emit('create:group', response.data);

            let sender = '';
            const participants = [];
            let text = '';
            response.data.groupParticipantDetails.forEach((x) => {
              if (x.user) {
                if (x.user.id == vm.sender.userid) {
                  sender = stringFormat('<b>{0} {1}</b>', x.user.firstName, x.user.lastName);
                }
                else {
                  const newMember = _.find(selectedMembers, (y) => { return y.participantID == x.user.id; });
                  if (newMember) {
                    participants.push(stringFormat('<b>{0} {1}</b>', x.user.firstName, x.user.lastName));
                  }
                }
              }
            });
            text = sender + ' added ' + participants.join(', ');

            const message = {
              senderID: vm.sender.userid,
              groupID: vm.receiver.groupID,
              message: text,
              remarkFlag: vm.remarkFlag.SPECIAL_MESSAGE
            };

            vm.cgBusyLoading = ChatFactory.sendGroupMessage().save(message).$promise.then((response) => {
              if (response && response.data && response.data[0]) {
                const chatObj = response.data[0];
                // Add the message to the chat
                socketConnectionService.emit('send:group_message', chatObj);

                // Reset the reply textarea
                resetReplyTextarea();

                // Scroll to the new message
                scrollToBottomOfChat();
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          }
          vm.resetChat();
          vm.saveBtnDisableFlag = false;
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        let groupName = vm.receiver.name + ', ' + vm.selectedContactForGroup.map((x) => { return x.name; }).join(', ');

        if (groupName.length > 255) {
          groupName = groupName.substring(0, 252) + '...';
        }
        let selectedMembers = [];
        selectedMembers.push({
          participantID: vm.sender.userid,
          participantAddedBy: vm.sender.userid
        });
        selectedMembers.push({
          participantID: vm.receiver.id,
          participantAddedBy: vm.sender.userid
        });

        selectedMembers = selectedMembers.concat(vm.selectedContactForGroup.map((x) => {
          return {
            participantID: x.id,
            participantAddedBy: vm.sender.userid
          };
        }));

        const model = {
          groupName: groupName,
          groupParticipantDetails: selectedMembers
        };
        vm.cgBusyLoading = ChatFactory.createGroup().save(model).$promise.then((response) => {
          if (response.data) {
            response.data.name = response.data.groupName;
            const groupData = response.data;
            vm.contactList.unshift(groupData);
            //console.info("Socket emit: create:group");
            socketConnectionService.emit('create:group', groupData);

            let sender = '';
            const participants = [];
            let text = '';
            groupData.groupParticipantDetails.forEach((x) => {
              if (x.user) {
                if (x.user.id == vm.sender.userid) {
                  sender = stringFormat('<b>{0} {1}</b>', x.user.firstName, x.user.lastName);
                }
                else {
                  participants.push(stringFormat('<b>{0} {1}</b>', x.user.firstName, x.user.lastName));
                }
              }
            });
            text = sender + ' added ' + participants.join(', ');

            const message = {
              senderID: vm.sender.userid,
              groupID: groupData.groupID,
              message: text,
              remarkFlag: vm.remarkFlag.SPECIAL_MESSAGE
            };

            vm.cgBusyLoading = ChatFactory.sendGroupMessage().save(message).$promise.then((response) => {
              if (response && response.data && response.data[0]) {
                const chatObj = response.data[0];
                // Add the message to the chat
                //console.info("Socket emit: send:group_message");
                socketConnectionService.emit('send:group_message', chatObj);

                // Reset the reply textarea
                resetReplyTextarea();

                // Scroll to the new message
                scrollToBottomOfChat();
                vm.getChatDetail(groupData, false);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          vm.resetChat();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.addToGroup = (contact) => {
      // add contact into select group member list
      vm.selectedContactForGroup.push(contact);
      // remove contact add to group list
      _.remove(vm.contactListForGroup, contact);
    };

    vm.showGroup = () => {
      if (vm.showContact) {
        vm.resetChat();
      }
      else if (vm.receiver.groupID) {
        vm.isOpenTemplate = false;
        vm.showContact = true;
        const alreadyAdded = [];
        vm.contactListForGroup.forEach((x) => {
          vm.receiver.groupParticipantDetails.forEach((y) => {
            if (x.id == y.participantID) {
              alreadyAdded.push(x);
            }
          });
        });

        alreadyAdded.forEach((x) => {
          _.remove(vm.contactListForGroup, x);
        });
        vm.btnGroupText = 'Add';
      }
      else {
        vm.isOpenTemplate = false;
        vm.showContact = true;
      }
    };

    vm.resetChat = () => {
      vm.showContact = false;
      vm.isGroupMemberOpen = false;
      vm.isOpenTemplate = false;
      vm.isAdmin = false;
      vm.isUserInGroup = false;

      if (vm.receiver.groupID) {
        const member = _.find(vm.receiver.groupParticipantDetails, (x) => { return x.participantID == vm.sender.userid; });
        if (member) {
          vm.isAdmin = member.isAdmin == true;
          vm.isUserInGroup = true;
        }
        else {
          vm.isUserInGroup = false;
        }
      }

      vm.selectedContactForGroup = [];
      vm.contactListForGroup = angular.copy(_.filter(contactlistCopy, (x) => { return !x.groupID && x.id !== vm.receiver.id; }));
      vm.btnGroupText = 'Create Group';
    };

    vm.groupContactSelected = (item) => {
      vm.selectedContactForGroup.push(item);
    };

    vm.closeChat = () => {
      vm.receiver = null;
      $mdDialog.cancel();
    };

    vm.changeGroupName = () => {
      if (vm.newGroupName) {
        if (vm.newGroupName === vm.receiver.name) {
          vm.cancelEditGroupNameClicked();
          return;
        }

        const model = {
          groupID: vm.receiver.groupID,
          groupName: vm.newGroupName
        };
        vm.cgBusyLoading = ChatFactory.changeGroupName().save(model).$promise.then((response) => {
          if (response.data) {
            response.data.name = response.data.groupName;
            //console.info("Socket emit: change:group_name");
            socketConnectionService.emit('change:group_name', model);
          }
          vm.receiver.name = vm.newGroupName;
          vm.cancelEditGroupNameClicked();

          const message = {
            senderID: vm.sender.userid,
            groupID: vm.receiver.groupID,
            message: stringFormat('<b>{0}</b> has renamed this conversation to "{1}"', vm.sender.name, vm.receiver.name),
            remarkFlag: vm.remarkFlag.SPECIAL_MESSAGE
          };

          vm.cgBusyLoading = ChatFactory.sendGroupMessage().save(message).$promise.then((response) => {
            if (response && response.data && response.data[0]) {
              const chatObj = response.data[0];
              // Add the message to the chat
              //console.info("Socket emit: send:group_name");
              socketConnectionService.emit('send:group_message', chatObj);

              // Reset the reply textarea
              resetReplyTextarea();

              // Scroll to the new message
              scrollToBottomOfChat();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }).catch((error) => BaseService.getErrorLog(error));
      };
    };

    vm.editGroupNameClicked = () => {
      vm.isEditGroupName = true;
      vm.isFindMessage = false;
      vm.searchMessage = null;
      vm.selectedCount = 0;
      vm.totalResult = 0;
      vm.showContact = false;
      vm.newGroupName = vm.receiver.name;
      window.setTimeout(() => {
        const elem = $('#txtGroupName');
        elem.focus().select();
      });
    };

    vm.cancelEditGroupNameClicked = () => {
      vm.isEditGroupName = false;
      vm.newGroupName = null;
    };

    vm.removeMemberFromGroup = (item) => {
      const obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Member'),
        textContent: '',
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          const model = {
            groupParticipantID: item.groupParticipantID,
            participantID: item.participantID,
            participantRemovedBy: vm.sender.userid,
            groupID: vm.receiver.groupID
          };
          vm.cgBusyLoading = ChatFactory.deleteGroupParticipant().save(model).$promise.then((response) => {
            if (response) {
              const message = {
                senderID: vm.sender.userid,
                groupID: model.groupID,
                message: stringFormat('<b>{0}</b> removed <b>{1} {2}</b> from this conversation.', vm.sender.name, item.user.firstName, item.user.lastName),
                remarkFlag: vm.remarkFlag.SPECIAL_MESSAGE
              };

              vm.cgBusyLoading = ChatFactory.sendGroupMessage().save(message).$promise.then((response) => {
                if (response && response.data && response.data[0]) {
                  const chatObj = response.data[0];
                  // Add the message to the chat
                  //console.info("Socket emit: send:group_message");
                  socketConnectionService.emit('send:group_message', chatObj);
                  //console.info("Socket emit: remove:group_member");
                  socketConnectionService.emit('remove:group_member', model);
                  // Reset the reply textarea
                  resetReplyTextarea();

                  // Scroll to the new message
                  scrollToBottomOfChat();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get selected template count
    vm.getSelectedTemplateCount = () => {
      return _.filter(vm.standardMessageList, (x) => { return x.isChecked == true; }).length;
    };

    vm.addTemplates = () => {
      var selectedTemplates = _.filter(vm.standardMessageList, (x) => { return x.isChecked == true; }).map((x) => {
        return x.standardMessageTxt;
      });

      if (selectedTemplates.length) {
        vm.replyMessage = (vm.replyMessage ? (vm.replyMessage + '\n') : '') + selectedTemplates.join('\n');
      }
      vm.isOpenTemplate = false;
    };

    vm.OpenTemplateList = () => {
      if (vm.isOpenTemplate) {
        vm.isOpenTemplate = false;
        return;
      }
      else {
        vm.showContact = false;
        ChatFactory.getStandardMessage().query({ workAreaID: data.workAreaID }).$promise.then((response) => {
          if (response.data) {
            vm.standardMessageList = response.data;
            vm.isOpenTemplate = true;
            if (vm.standardMessageList.length === 0) {
              vm.isNoDataFound = true;
            } else {
              vm.isNoDataFound = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.messageKeyPress = ($event) => {
      if ($event.keyCode == 13) {
        const shiftPressed = $event.shiftKey;
        if (shiftPressed) {
          $timeout(() => { vm.replyMessage += '\n'; });
        } else {
          vm.sendMessage();
        }
      }
      else if ($event.keyCode == 10 && $event.ctrlKey) {
        $timeout(() => { vm.replyMessage += '\n'; });
      }
    };

    vm.setUserStatus = (status) => {
      if (status == vm.sender.onlineStatus) {
        return;
      }

      const model = {
        userID: vm.sender.userid,
        onlineStatus: status,
        isFromChat: true
      };

      ChatFactory.setUserStatus().save(model).$promise.then((response) => {
        if (response.data) {
          vm.sender.onlineStatus = status;
          //console.info("Socket emit: user:status");
          socketConnectionService.emit(CORE.Socket_IO_Events.User.User_Status, model);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.searchChat = () => {
      if (vm.currentTab != vm.chatSearchOption.CONTACT && vm.isFromTraveler) {
        vm.autoCompleteWorkAreaDetail.keyColumnId = null;
      }
      $('.highlightedChatText').removeClass('highlightedChatText');
      vm.onTabChanges(vm.currentTab);
    };

    vm.onTabChanges = (type) => {
      vm.currentTab = type;
      if (type == vm.chatSearchOption.ALL) {
        vm.messageSearchList = [];
        getContactList();
      } else if (type == vm.chatSearchOption.CONTACT) {
        vm.messageSearchList = [];
        getContactList();
      } else if (type == vm.chatSearchOption.MESSAGE) {
        vm.contactList = [];
        if (vm.chatSearch && vm.autoCompleteWorkAreaDetail) {
          vm.autoCompleteWorkAreaDetail.keyColumnId = null;
        }
        if ((Array.isArray(contactlistCopy) && contactlistCopy.length === 0)) {
          getContactList();
        }
        getSerchChatMessage(vm.chatSearch);
      } else if (type == vm.chatSearchOption.GROUP) {
        vm.messageSearchList = [];
        getContactList();
      }
    };

    function getSerchChatMessage(searchtext) {
      ChatFactory.getSerchChatMessage().query({ searchText: searchtext || null, senderID: vm.sender.userid }).$promise.then((response) => {
        if (response && response.data) {
          vm.messageSearchList = response.data;
          _.each(vm.messageSearchList, (msgobj) => {
            if (msgobj.profilePic) {
              msgobj.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + msgobj.profilePic;
            }
            else {
              msgobj.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
          });
        }
        return vm.messageSearchList;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.clearSearch = () => {
      vm.isFindMessage = false;
      vm.searchMessage = null;
      vm.totalResult = vm.selectedCount = 0;
      $('.highlightedChatText').removeClass('highlightedChatText');
    };
    vm.searchChatMessage = (receiver) => {
      vm.chatSearch = '';
      $('.highlightedChatText').removeClass('highlightedChatText');
      getSerchChatMessage(vm.chatSearch);
      getReceiverSearchChatMessage(receiver);
    };
    function getReceiverSearchChatMessage(receiver) {
      ChatFactory.getReceiverSearchChatMessage().query({ searchText: vm.searchMessage || null, senderID: vm.sender.userid, receiverID: receiver.id || null, groupID: receiver.groupID || null }).$promise.then((response) => {
        if (response && response.data) {
          vm.receiverMessageSearchList = response.data;
          vm.selectedCount = 0;
          vm.totalResult = vm.receiverMessageSearchList.length;
          vm.goUpNext();
        }
        return vm.receiverMessageSearchList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.goUpNext = () => {
      if (vm.totalResult > vm.selectedCount) {
        vm.selectedCount += 1;
        const objmsg = vm.receiverMessageSearchList[vm.selectedCount - 1];
        vm.getChatDetail(null, true, objmsg);
      }
    };
    vm.goDownNext = () => {
      if (vm.selectedCount > 1) {
        vm.selectedCount -= 1;
        const objmsg = vm.receiverMessageSearchList[vm.selectedCount - 1];
        vm.getChatDetail(null, true, objmsg);
      };
    };

    vm.editchat = (chatMessage) => {
      const objMessage = chatMessage.message.split('</b><br/>');
      if (_.isArray(objMessage) && objMessage.length == 2) {
        vm.replyMessage = objMessage[1];
      } else {
        vm.replyMessage = chatMessage.message;
      }
      vm.EditMessaage = chatMessage;
    };
    vm.leaveGroup = () => {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.CHAT_GROUP_LEAVE,
        textContent: '',
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      var member = _.find(vm.receiver.groupParticipantDetails, (item) => {
        return item.participantID == vm.sender.userid;
      });
      if (member) {
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            const model = {
              groupParticipantID: member.groupParticipantID,
              participantID: member.participantID,
              participantRemovedBy: member.participantID,
              groupID: vm.receiver.groupID
            };
            vm.cgBusyLoading = ChatFactory.deleteGroupParticipant().save(model).$promise.then((response) => {
              if (response) {
                const message = {
                  senderID: vm.sender.userid,
                  groupID: model.groupID,
                  message: stringFormat('<b>{0} {1}</b> has left', member.user.firstName, member.user.lastName),
                  remarkFlag: vm.remarkFlag.SPECIAL_MESSAGE
                };

                vm.cgBusyLoading = ChatFactory.sendGroupMessage().save(message).$promise.then((response) => {
                  if (response && response.data && response.data[0]) {
                    const chatObj = response.data[0];
                    // Add the message to the chat
                    //console.info("Socket emit: send:group_message");
                    socketConnectionService.emit('send:group_message', chatObj);
                    //console.info("Socket emit: remove:group_member");
                    socketConnectionService.emit('remove:group_member', model);
                    // Reset the reply textarea
                    resetReplyTextarea();

                    // Scroll to the new message
                    scrollToBottomOfChat();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((err) => {
              console.info(err);
            });
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const scrollToBottomOfChat = () => {
      $timeout(() => {
        var chatContent = angular.element('#chat-content');
        if (chatContent[0]) {
          chatContent.animate({
            scrollTop: chatContent[0].scrollHeight
          }, 0);
        }
      }, 0);
    };

    function getWorkorderOperationDetails() {
      MasterFactory.getWorkorderOperationDetails().query({ woID: woID, opID: opID }).$promise.then((response) => {
        if (response && response.data) {
          // update child table data to workorder obj
          if (response.data.workorder.componentAssembly) {
            response.data.workorder.mfgPN = response.data.workorder.componentAssembly.mfgPN;
            response.data.workorder.nickName = response.data.workorder.componentAssembly.nickName;
          }

          const woSONumberList = [];
          const woSOPONumberList = [];
          if (response.data.workorder && response.data.workorder.WoSalesOrderDetails && response.data.workorder.WoSalesOrderDetails.length > 0) {
            _.each(response.data.workorder.WoSalesOrderDetails, (woSODetItem) => {
              woSONumberList.push(woSODetItem.SalesOrderDetails.salesOrderMst.salesOrderNumber);
              woSOPONumberList.push(woSODetItem.SalesOrderDetails.salesOrderMst.poNumber);
            });
          }

          workOrderOperation = {
            workorder: {
              woNumber: response.data.workorder.woNumber,
              woVersion: response.data.workorder.woVersion,
              nickName: response.data.workorder.nickName,
              mfgPN: response.data.workorder.mfgPN
            },
            operation: {
              opNumber: response.data.opNumber,
              opVersion: response.data.opVersion
            },
            salesOrderData: {
              woSONumberList: woSONumberList.toString(),
              woSOPONumberList: woSOPONumberList.toString()
            }
          };
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getTotalUnreadMessageCount() {
      return ChatFactory.getTotalUnreadMessageCount().query({ senderID: vm.sender.userid }).$promise.then((response) => {
        ChatFactory.chatMessageCount = response.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function updateGroupMessageReadStatus(groupID, isRead) {
      var model = {
        groupID: groupID,
        participantID: vm.sender.userid,
        isRead: isRead
      };

      return ChatFactory.updateGroupMessageReadStatus().save(model).$promise.then((response) => {
        if (!isRead) {
          getContactList();
        }
        return response;
      }).catch((err) => {
        BaseService.getErrorLog(err);
        return null;
      });
    }

    function updateReceiverMessageReadStatus(senderID) {
      var model = {
        senderID: senderID,
        receiverID: vm.sender.userid
      };
      return ChatFactory.updateReceiverMessageReadStatus().save(model).$promise.then((response) => {
        return response;
      }).catch((err) => {
        BaseService.getErrorLog(err);
        return null;
      });
    }

    vm.htmlToPlaintext = (text) => {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
    // common function for remove socket listener
    function removeSocketListener() {
      socketConnectionService.removeListener('receive:message', updateChatListener);
      socketConnectionService.removeListener('create:group', addIntoGroupListener);
      socketConnectionService.removeListener('change:group_name', changeGroupNameBySocketListener);
      socketConnectionService.removeListener('remove:group_member', removeMemberFromGroupListener);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.User.User_Status, changeUserStatusListener);
    }

    $scope.$on('$destroy', () => {
      ChatFactory.isChatOpen = false;
      $mdDialog.hide(false, { closeAll: true });
      // Remove socket listeners
      removeSocketListener();
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    // init click
    const initClick = () => {
      $(document).off('mouseup.following');
      $(document).on('mouseup.following', (e) => {
        var container = $('#chat-list-box');
        // If the target of the click isn't the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          vm.isOpenTemplate = false;
        }
      });
    };

    $scope.$on('$destroy', () => {
      $(document).off('mouseup.following');
    });
  }
})();

(function () {
  angular.module('app.workorder.workorders').filter('participantdisplay', () => {
    return function (groupParticipantDetails, userID) {
      var count = 0;
      if (groupParticipantDetails && groupParticipantDetails.length) {
        groupParticipantDetails.forEach((x) => {
          if (x.participantID != userID) {
            count++;
          }
        });
      }

      if (count > 1) {
        return count + ' Members';
      } else {
        return count + ' Member';
      }
    };
  });
})();

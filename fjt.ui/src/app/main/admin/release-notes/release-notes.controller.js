(function () {
  'use strict';

  angular.module('app.admin.releasenotes')
    .controller('ReleaseNotesController', ReleaseNotesController);

  /** @ngInject */
  function ReleaseNotesController($filter, $scope, ReleaseNoteFactory, BaseService, CORE, USER, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.RELEASENOTES;
    vm.isUserAdmin = BaseService.loginUser.isUserSuperAdmin || false;
    const initReleaseNote = () => {
      vm.releaseNotes = ReleaseNoteFactory.releaseNote().query().$promise.then((releaseNotes) => {
        if (releaseNotes && releaseNotes.data && releaseNotes.data.length > 0) {
          vm.isNoDataFound = false;
          vm.releaseNote = angular.copy(releaseNotes.data);
          _.map(vm.releaseNote, (data) => {
            data.displayReleasedDate = BaseService.getUIFormatedDate(data.releasedDate, CORE.DateFormatArray[17].format);
          });
          const firstRleleaseDetail = _.head(vm.releaseNote);
          if (firstRleleaseDetail) {
            vm.retriveData(firstRleleaseDetail);
          }
        } else {
          vm.isNoDataFound = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    initReleaseNote();
    vm.retriveData = (data) => {
      if (data && data.Id) {
        vm.releaseNotes = ReleaseNoteFactory.releaseNotesDetail().query({ Id: data.Id }).$promise.then((releaseNotes) => {
          if (releaseNotes && releaseNotes.data) {
            vm.isNoDataFound = false;
            vm.releaseNotesDetail = angular.copy(releaseNotes.data);
            _.map(vm.releaseNote, (data) => data.isSelected = false);
            vm.currentNote = _.find(vm.releaseNote, (data) => data.Id === vm.releaseNotesDetail.Id);
            if (vm.currentNote) {
              vm.currentNote.isSelected = true;
            };
            vm.releaseNotesDetail.displayReleasedDate = BaseService.getUIFormatedDate(vm.releaseNotesDetail.releasedDate, CORE.DateFormatArray[17].format);
            vm.releaseNoteList = angular.copy(releaseNotes.data.ReleaseNoteDetail);
          } else {
            vm.isNoDataFound = true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.isNoDataFound = true;
      }
    };

    //open popup for add edit new release
    vm.addEditRecord = (data, ev) => {
      const objdata = angular.copy(data);

      DialogFactory.dialogService(
        CORE.MANAGE_RELEASE_POPUP_CONTROLLER,
        CORE.MANAGE_RELEASE_POPUP_VIEW,
        ev,
        objdata).
        then(() => {
        }, () => {
          initReleaseNote();
        }, (error) => BaseService.getErrorLog(error));
    };

    //open popup for add edit new release
    vm.addEditReleaseNotes = (data, ev) => {
      const objdata = {
        notes: data && data.notes || null,
        id: data && data.Id || null,
        releasedID: (data && data.releasedId) ? data.releasedId : vm.currentNote.Id,
        version: vm.currentNote.version,
        releasedDate: vm.currentNote.releasedDate
      };

      DialogFactory.dialogService(
        CORE.MANAGE_RELEASE_NOTE_POPUP_CONTROLLER,
        CORE.MANAGE_RELEASE_NOTE_POPUP_VIEW,
        ev,
        objdata).
        then(() => {
        }, () => {
          initReleaseNote();
        }, (error) => BaseService.getErrorLog(error));
    };

    //copy release notes
    vm.copyReleaseNotes = (data, index) => {
      const idSelector = data ? '#release-notes_' + index : '#release-notes';
      const copiedReleasedNote = angular.element(document.querySelector(idSelector))[0].innerText;
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copiedReleasedNote).select();
      document.execCommand('copy');
      $temp.remove();
    };

    //delete release notes
    vm.deleteReleaseNotesDetails = (data) => {
      if (data && data.Id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Release Notes', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objID = {
          id: data && data.Id,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = ReleaseNoteFactory.deleteReleaseNotesDetails().query({ objID: objID }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                let resData = {};
                resData = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.releaseNotes
                };
                BaseService.deleteAlertMessageWithHistory(resData, (ev) => {
                  const IDs = {
                    id: data.Id,
                    CountList: true
                  };
                  return ReleaseNoteFactory.deleteReleaseNotesDetails().query({
                    objID: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.PageName = CORE.PageName.releaseNotes;
                    data.selectedIDs = stringFormat('{0}{1}', 1, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              }
              else {
                initReleaseNote();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Release Notes');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    //delete release notes
    vm.deleteRecord = (data) => {
      if (data && data.Id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Release Notes', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objID = {
          id: data.Id,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = ReleaseNoteFactory.deleteReleaseDetails().query({ objID: objID }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                let resData = {};
                resData = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.releaseNotes
                };
                BaseService.deleteAlertMessageWithHistory(resData, (ev) => {
                  const IDs = {
                    id: data.Id,
                    CountList: true
                  };
                  return ReleaseNoteFactory.deleteReleaseDetails().query({
                    objID: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.PageName = CORE.PageName.releaseNotes;
                    data.selectedIDs = stringFormat('{0}{1}', 1, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              }
              else {
                initReleaseNote();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Release Notes');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
  }
}
)();

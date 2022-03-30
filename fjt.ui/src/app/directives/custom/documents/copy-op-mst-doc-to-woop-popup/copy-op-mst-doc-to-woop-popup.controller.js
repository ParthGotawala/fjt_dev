(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CopyOpMstDocToWOOpPopupController', CopyOpMstDocToWOOpPopupController);

  /** @ngInject */
  function CopyOpMstDocToWOOpPopupController($mdDialog, data, CORE, BaseService, WorkorderFactory, DialogFactory, TRAVELER) {

    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.opMstDetails = data;
    vm.debounceConstant = CORE.Debounce;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;

    // Search Criteria
    vm.queryWOOp = {
      order: '',
      search: '',
    };

    /* get all active work order list to copy op master doc/folder to wo op */
    let getWorkOrderListToCopyOpDoc = () => {
      vm.allActiveWorkorderList = [];
      let opDetails = {
        opID: vm.opMstDetails.opID,
        woOPIDs: null
      }
      vm.cgBusyLoading = WorkorderFactory.getAllActiveWorkorderForCopyFolderDoc().save(opDetails).$promise.then((resp) => {
        if (resp && resp.data && resp.data.workorderlist && resp.data.workorderlist.length > 0) {
          vm.allActiveWorkorderList = resp.data.workorderlist;
          _.each(vm.allActiveWorkorderList, (woItem) => {
            woItem.workorderOperation = _.first(woItem.workorderOperation);
            woItem.woStatusText = BaseService.getWoStatus(woItem.woStatus);
            woItem.woStatusClassName = BaseService.getWoStatusClassName(woItem.woStatus);
            woItem.requiredToChangeVersion = false;
            woItem.workorderOperation.WOOpToVersion = getChar.increment(woItem.workorderOperation.opVersion);
            woItem.woToVersion = getChar.increment(woItem.woVersion);
            woItem.broadcastMessage = woItem.broadcastMessageCopy = stringFormat(TRAVELER.WORKORDER_OPERATION_REVISION_MESSAGE, convertToThreeDecimal(woItem.workorderOperation.opNumber), woItem.workorderOperation.opVersion, woItem.woNumber, woItem.woVersion);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getWorkOrderListToCopyOpDoc();

    vm.selectAllWOToCopyDocFolder = () => {
      _.each(vm.allActiveWorkorderList, (woItem) => {
        woItem.isselectWOForCopyDocFolder = vm.isSelectAllWOToCopyDocFolder;
      })
      vm.isAnyDocFolderSelected = vm.isSelectAllWOToCopyDocFolder;
    }

    /* Used to save op master doc folder to selected work order */
    vm.saveFolderDocToWO = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.copyOpMstDocToWOOpForm)) {
        vm.saveDisable = false;
        return;
      }

      let selectedAllWOForCopyDocFolder = _.filter(vm.allActiveWorkorderList, (woItem) => {
        return woItem.isselectWOForCopyDocFolder
      })
      if (!selectedAllWOForCopyDocFolder.length) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "work order");
        let alertModel = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(alertModel);
        vm.saveDisable = false;
        return;
      }

      let woListForCopy = [];
      _.each(selectedAllWOForCopyDocFolder, (woItem) => {
        let _obj = {
          woID: woItem.woID,
          woNumber: woItem.woNumber,
          woFromVersion: woItem.woVersion,
          woToVersion: woItem.woToVersion,
          woOPID: woItem.workorderOperation.woOPID,
          opName: woItem.workorderOperation.opName,
          WOOpFromVersion: woItem.workorderOperation.opVersion,
          WOOpToVersion: woItem.workorderOperation.WOOpToVersion,
          requiredToChangeVersion: woItem.requiredToChangeVersion,
          broadcastMessage: woItem.broadcastMessage
        };
        woListForCopy.push(_obj);
      });

      let woOPDet = {
        opID: vm.opMstDetails.opID,
        selectedFolderIDsToCopy: vm.opMstDetails.selectedFolderIDsToCopy || null,
        selectedFileIDsToCopy: vm.opMstDetails.selectedFileIDsToCopy || null,
        woListForCopyDocFolder: woListForCopy,
        parentFolderIDOfSelected: vm.opMstDetails.parentFolderIDOfSelected
      }

      vm.cgBusyLoading = WorkorderFactory.copyAllFolderDocToActiveWorkorder().save(woOPDet).$promise.then((resp) => {
        vm.saveDisable = false;
        if (resp && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          let isContainDuplicateFiles = resp.data && resp.data.duplicateFileList && resp.data.duplicateFileList.length > 0;
          let isContainDeletedFolderListAtSource = resp.data && resp.data.deletedFolderListAtSource && resp.data.deletedFolderListAtSource.length > 0;
          let isContainDeletedFileListAtSource = resp.data && resp.data.deletedFileListAtSource && resp.data.deletedFileListAtSource.length > 0;

          if (isContainDuplicateFiles || isContainDeletedFolderListAtSource || isContainDeletedFileListAtSource) {
            if (isContainDuplicateFiles) {
              vm.saveDisable = true;
              vm.copyOpMstDocToWOOpForm.$setPristine();
              vm.copyOpMstDocToWOOpForm.$setUntouched();
              let woDet = null;
              let allDuplicateFiles = resp.data.duplicateFileList;
              _.each(allDuplicateFiles, (docItem) => {
                if (!woDet || woDet.workorderOperation.woOPID != docItem.refTransIDOfWOOP) {
                  woDet = _.find(vm.allActiveWorkorderList, (woItem) => {
                    return woItem.workorderOperation.woOPID == docItem.refTransIDOfWOOP
                  });
                }
                if (woDet) {
                  docItem.woID = woDet.woID;
                  docItem.woNumber = woDet.woNumber;
                }
              });

              let data = {
                opID: vm.opMstDetails.opID,
                parentFolderIDOfSelected: vm.opMstDetails.parentFolderIDOfSelected,
                duplicateFileList: allDuplicateFiles,
              }

              DialogFactory.dialogService(
                CORE.COPY_CONFIRM_WOOP_DUPLICATE_DOC_MODAL_CONTROLLER,
                CORE.COPY_CONFIRM_WOOP_DUPLICATE_DOC_MODAL_VIEW,
                event,
                data).then((respOfDuplicateFileCopy) => {
                  closeDialog(true);
                }, (cancel) => {
                  closeDialog(true);
                }, (err) => {
                  closeDialog(false);
                });
            }
            if (isContainDeletedFolderListAtSource || isContainDeletedFileListAtSource) {
              let fileNotAvailableMsg = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NOT_FIND_FOLDER_FILE_AT_SOURCE);
              fileNotAvailableMsg.message = stringFormat(fileNotAvailableMsg.message, "folder(s)/file(s)");

              vm.printHtmlContent = '<br><br><b>' + fileNotAvailableMsg.message + '</b><br><br>' + ' \
                                    <p> <md-table-container flex="100"> \
                                      <table md-table class="md-data-table" ng-model="'+ vm.selectedItems + '"> \
                                          <thead md-head> \
                                              <tr md-row> \
                                                  <th width="10%" md-column>#</th> \
                                                  <th width="75%" md-column>Name</th> \
                                                  <th width="15%" md-column>Type</th> \
                                              </tr> \
                                          </thead> \
                                          <tbody class="custom-scroll" md-body> \ ';
              // deleted folders from source
              _.each(resp.data.deletedFolderListAtSource, function (folderItem, index) {
                vm.printHtmlContent += '<tr md-row> \ ' +
                  '<td width="10%" md-cell>' + (index + 1) + '</td>  ' +
                  '<td width="75%" md-cell>' + folderItem.gencFolderName + ' </td>  ' +
                  '<td width = "15%" md - cell >' + 'Folder' + '</td>' +
                  '</tr > ';
              });
              // deleted files from source
              _.each(resp.data.deletedFileListAtSource, function (fileItem, index) {
                vm.printHtmlContent += '<tr md-row> \ ' +
                  '<td width="10%" md-cell>' + (index + 1 + (resp.data.deletedFolderListAtSource.length)) + '</td>  ' +
                  '<td width="75%" md-cell>' + fileItem.gencOriginalName + ' </td>  ' +
                  '<td width = "15%" md - cell >' + 'File' + '</td>' +
                  '</tr > ';
              });

              vm.printHtmlContent += ' </tbody> \
                                             </table> \
                                             </md-table-container>';

              var model = {
                title: "Invalid Folder(s)/File(s) To Copy",
                textContent: vm.printHtmlContent,
              };
              DialogFactory.alertDialog(model);

            }
          }
          else {
            closeDialog(true);
          }
        }

      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    // to close current dialog
    let closeDialog = (isRefreshFolderDocList) => {
      BaseService.currentPagePopupForm.pop();
      $mdDialog.hide(isRefreshFolderDocList);
    }

    /*Used to check form dirty*/
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    /*Used to close pop-up*/
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.copyOpMstDocToWOOpForm);
      if (isdirty) {
        let data = {
          form: vm.copyOpMstDocToWOOpForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        closeDialog(false);
      }
    };

    /* to refresh active work order list */
    vm.refreshWorkOrderListToCopyOpDoc = () => {
      let isdirty = vm.checkFormDirty(vm.copyOpMstDocToWOOpForm);
      if (isdirty) {
        var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_APPLY_REFRESH_ALERT);
        let obj = {
          messageContent: messgaeContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((respOfConfirm) => {
          if (respOfConfirm) {
            vm.isSelectAllWOToCopyDocFolder = false;
            getWorkOrderListToCopyOpDoc();
            vm.copyOpMstDocToWOOpForm.$setPristine();
            vm.copyOpMstDocToWOOpForm.$setUntouched();
          }
        }, (cancel) => {

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.isSelectAllWOToCopyDocFolder = false;
        getWorkOrderListToCopyOpDoc();
      }
    }

    //redirect to work order details
    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    }


    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.copyOpMstDocToWOOpForm);
    });
  }
})();

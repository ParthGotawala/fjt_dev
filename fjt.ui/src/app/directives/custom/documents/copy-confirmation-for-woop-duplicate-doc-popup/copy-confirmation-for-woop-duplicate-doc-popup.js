(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('CopyConfirmationForWOOPDuplicateDocPopUpController', CopyConfirmationForWOOPDuplicateDocPopUpController);

  function CopyConfirmationForWOOPDuplicateDocPopUpController($mdDialog, CORE, BaseService, data, WorkorderFactory, TRAVELER, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.data = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    let duplicateFileCopyActionConst = angular.copy(CORE.DuplicateFileCopyAction);
    let duplicateFileCopyActionList = _.values(duplicateFileCopyActionConst);
    vm.debounceConstant = CORE.Debounce;
    let woListForCopy = [];
    vm.copyActionModel = {};
    let isDocPermanentDelete = CORE.IsPermanentDelete;

    vm.RadioGroup = {
      copyConfirmationConst: {
        array: duplicateFileCopyActionList
      }
    }

    vm.queryDuplicateDoc = {
      order: '',
      searchTxt: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };

    /* get all active work order list to copy op master doc/folder to wo op and to change version */
    let getWorkOrderListToCopyOpDoc = () => {
      vm.allActiveWorkorderList = [];
      let opDetails = {
        opID: null,
        woOPIDs: _.map(vm.data.duplicateFileList, 'refTransIDOfWOOP')
      }
      vm.cgBusyLoading = WorkorderFactory.getAllActiveWorkorderForCopyFolderDoc().save(opDetails).$promise.then((resp) => {
        if (resp && resp.data && resp.data.workorderlist && resp.data.workorderlist.length > 0) {
          _.each(resp.data.workorderlist, (woItem) => {
            woItem.workorderOperation = _.first(woItem.workorderOperation);
            let _obj = {
              woID: woItem.woID,
              woNumber: woItem.woNumber,
              woFromVersion: woItem.woVersion,
              woToVersion: getChar.increment(woItem.woVersion),
              woOPID: woItem.workorderOperation.woOPID,
              opName: woItem.workorderOperation.opName,
              WOOpFromVersion: woItem.workorderOperation.opVersion,
              WOOpToVersion: getChar.increment(woItem.workorderOperation.opVersion),
              requiredToChangeVersion: true,
              broadcastMessage: stringFormat(TRAVELER.WORKORDER_OPERATION_REVISION_MESSAGE, convertToThreeDecimal(woItem.workorderOperation.opNumber), woItem.workorderOperation.opVersion, woItem.woNumber, woItem.woVersion)
            };
            woListForCopy.push(_obj);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    if (vm.data.duplicateFileList && vm.data.duplicateFileList.length > 0) {
      getWorkOrderListToCopyOpDoc();
    }


    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.data.woID);
      return false;
    }

    vm.headerdata = [];
    //vm.headerdata.push({
    //  label: vm.LabelConstant.Operation.OP,
    //  value: vm.data.opNumber,
    //  displayOrder: 1
    //});

    vm.duplicateDocumentList = angular.copy(vm.data.duplicateFileList) || [];

    // search From Duplicate Document list
    vm.searchFromDuplicateDoc = () => {
      if (vm.queryDuplicateDoc.searchTxt) {
        let searchTxt = angular.copy(vm.queryDuplicateDoc.searchTxt).toLowerCase();
        vm.duplicateDocumentList = _.filter(vm.data.duplicateFileList, (docDet) => {
          return (docDet.gencOriginalName.toLowerCase().indexOf(searchTxt) != -1)
            || (docDet.woNumber.indexOf(searchTxt) != -1)
            ;
        });
      }
      else {
        vm.duplicateDocumentList = angular.copy(vm.data.duplicateFileList);
      }
    }

    // apply changes whatever option selected
    vm.apply = () => {

      vm.saveDisable = true;
      if (!vm.copyActionModel.copyAction) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "option");
        let alertModel = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(alertModel);
        vm.saveDisable = false;
        return;
      }

      if (BaseService.focusRequiredField(vm.duplicateFileCopyActionForm)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.copyActionModel.copyAction == duplicateFileCopyActionConst.Skip_File.Value) {
        vm.saveDisable = false;
        closeDialog();
        return;
      }

      let duplicateFileDet = {
        opID: vm.data.opID,
        duplicateFileList: vm.data.duplicateFileList,
        duplicateFileCopyActionConst: vm.copyActionModel.copyAction,
        woListForCopyDocFolder: woListForCopy,
        isPermanentDelete: isDocPermanentDelete
      }

      vm.cgBusyLoading = WorkorderFactory.copyAllDuplicateDocToWOOPBasedOnConfirmation().save(duplicateFileDet).$promise.then((resp) => {
        vm.saveDisable = false;
        if (resp && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          if (resp && resp.data && resp.data.notExistsFileListAtSource && resp.data.notExistsFileListAtSource.length > 0) {
            vm.isNotExistsFilesFoundAtSource = true;
            vm.saveDisable = true;
            _.each(resp.data.notExistsFileListAtSource, (invalidFileItem) => {
              let dupFileListToSetInvalid = _.filter(vm.data.duplicateFileList, (dupFileItem) => {
                return dupFileItem.gencFileID == invalidFileItem.gencFileID;
              })
              if (dupFileListToSetInvalid && dupFileListToSetInvalid.length > 0) {
                let fileNotAvailableMsg = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NOT_FIND_FOLDER_FILE_AT_SOURCE);
                fileNotAvailableMsg.message = stringFormat(fileNotAvailableMsg.message, "this file");
                _.each(dupFileListToSetInvalid, (fileItem) => {
                  fileItem.isFileNotExistsAtSource = true;
                  //fileItem.reasonForNotCopy = "Could not find this file at source place";
                  fileItem.reasonForNotCopy = fileNotAvailableMsg.message;
                })
              }
            });
            vm.queryDuplicateDoc.searchTxt = null;
            vm.searchFromDuplicateDoc();
            vm.duplicateFileCopyActionForm.$setPristine();
            vm.duplicateFileCopyActionForm.$setUntouched();
          }
          else {
            closeDialog();
          }
        }
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });

    }

    /*Used to check form dirty*/
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.duplicateFileCopyActionForm);
      if (isdirty) {
        let data = {
          form: vm.duplicateFileCopyActionForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        closeDialog();
      }
    };

    // to close current dialog
    let closeDialog = () => {
      BaseService.currentPagePopupForm.pop();
      $mdDialog.cancel();
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('MoveDuplicateDocConfirmationPopupController', MoveDuplicateDocConfirmationPopupController);

  function MoveDuplicateDocConfirmationPopupController($mdDialog, CORE, BaseService, data, GenericFolderFactory, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.data = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    let duplicateFileMoveActionConst = angular.copy(CORE.DuplicateFileCopyAction);
    let duplicateFileMoveActionList = _.values(duplicateFileMoveActionConst);
    vm.debounceConstant = CORE.Debounce;
    vm.moveActionModel = {};
    let isDocPermanentDelete = CORE.IsPermanentDelete;

    vm.RadioGroup = {
      moveConfirmationConst: {
        array: duplicateFileMoveActionList
      }
    }

    vm.queryDuplicateDoc = {
      order: '',
      searchTxt: '',
      limit: 5,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };

    vm.duplicateDocumentList = angular.copy(vm.data.duplicateFileList) || [];

    // apply changes whatever option selected
    vm.apply = () => {

      vm.saveDisable = true;
      if (!vm.moveActionModel.copyAction) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "option");
        let alertModel = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(alertModel);
        vm.saveDisable = false;
        return;
      }

      if (BaseService.focusRequiredField(vm.duplicateFileMoveActionForm)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.moveActionModel.copyAction == duplicateFileMoveActionConst.Skip_File.Value) {
        vm.saveDisable = false;
        closeDialog();
        return;
      }

      let duplicateFileDet = {
        opID: vm.data.opID,
        duplicateFileList: vm.data.duplicateFileList,
        duplicateFileMoveActionConst: vm.moveActionModel.copyAction,
        isPermanentDelete: isDocPermanentDelete
      }

      vm.cgBusyLoading = GenericFolderFactory.moveAllDuplicateDocToDestinationBasedOnConfirmation().save(duplicateFileDet).$promise.then((resp) => {
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
            vm.duplicateFileMoveActionForm.$setPristine();
            vm.duplicateFileMoveActionForm.$setUntouched();
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
          form: vm.duplicateFileMoveActionForm
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

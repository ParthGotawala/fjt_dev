(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('MoveFileFolderPopupController', MoveFileFolderPopupController);

  /** @ngInject */
  function MoveFileFolderPopupController($mdDialog, data, CORE, GenericFolderFactory, $scope, BaseService, DialogFactory) {
    const vm = this;
    vm.filefolderData = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.doumentClass = "move-folder-doc-tree-view";
    let selectedFolderID = null;

    //vm.headerdata = [
    //  { label: vm.filefolderModel.name, value: vm.filefolderModel.gencFileFolderName, displayOrder: 1 }
    //]

    //vm.filefolderModel.genericFolderIds = [];
    //if (vm.filefolderModel.gencFolderID) {
    //  vm.filefolderModel.genericFolderIds.push(vm.filefolderModel.gencFolderID);
    //}
    //if (vm.filefolderModel.refParentId) {
    //  vm.filefolderModel.genericFolderIds.push(vm.filefolderModel.refParentId);
    //}
    //if (vm.filefolderModel.children && vm.filefolderModel.children.length > 0) {
    //  _.map(vm.filefolderModel.children, function (data) {
    //    vm.filefolderModel.genericFolderIds.push(parseInt(data));
    //  });
    //}
    //if (vm.filefolderModel.isFolder) {
    //  vm.filefolderModel.name = "Folder";
    //}
    //else {
    //  vm.filefolderModel.name = "Document";
    //}

    //let setFolderData = (selectedItem) => {
    //  if (selectedItem) {
    //    vm.filefolderModel.toMoveFolderRoleId = selectedItem.roleId;
    //  }
    //}

    ///*Used to check form dirty*/
    //vm.checkFormDirty = (form, columnName) => {
    //  let checkDirty = BaseService.checkFormDirty(form, columnName);
    //  return !vm.checkDirty ? checkDirty : vm.checkDirty;
    //};

    //// AutoComplete for Chart Tyep list
    //vm.autoCompleteFolders = {
    //  columnName: 'gencFolderFullName',
    //  keyColumnName: 'gencFolderID',
    //  keyColumnId: 'gencFolderID',
    //  inputName: 'Folder Name',
    //  placeholderName: 'Folder Name',
    //  isRequired: true,
    //  isAddnew: false,
    //  callbackFn: getAllFolderList,
    //  onSelectCallbackFn: setFolderData
    //}

    // [S] Getting Folder list 
    function getAllFolderList(gencFolderID) {

      if (vm.filefolderData.accessLevel && vm.filefolderData.refTransID && vm.filefolderData.gencFileOwnerType) {
        vm.cgBusyLoading = GenericFolderFactory.genericFolderList().save({
          refTransID: vm.filefolderData.refTransID,
          entityId: vm.filefolderData.entityID,
          gencFileOwnerType: vm.filefolderData.gencFileOwnerType,
          accessLevel: vm.filefolderData.accessLevel,
          isTraveler: vm.filefolderData.isTraveler ? true : false
        }).$promise.then((res) => {
          vm.folderList = [];
          vm.isSelected = true;

          if (res && res.data) {
            // Default Root parent folder for 
            // used "base_" as a prefix as if ReftypeID value = gencFolderID value then folder will be displayed on top
            vm.folderList.push({
              "id": "base_" + vm.filefolderData.ReftypeID, "parent": "#", "text": "Root "
            });

            _.each(res.data, (item) => {

              let model = {
                id: item.gencFolderID,
                //totalInnerFileFolder: (parseInt(item.totalInnerFileFolder || 0) > 0 ? ' (' + item.totalInnerFileFolder + ')' : ''),
                //totalInnerFileFolder: 0,
                //text: item.gencFolderName + (parseInt(item.totalInnerFileFolder || 0) > 0 ? ' (' + item.totalInnerFileFolder + ')' : ''),
                text: item.gencFolderName,
                tooltip: item.gencFolderName,// + (parseInt(item.totalInnerFileFolder || 0) > 0 ? ' (' + item.totalInnerFileFolder + ')' : ''),
                name: item.gencFolderName,
                isSelected: true,
                type: "folder",
                contextMenuButton: '',
                gencFileOwnerType: item.gencFileOwnerType,
                roleId: item.roleId,
                isProtected: vm.filefolderData.isProtected,
                roleAccessLevel: item.accessLevel,
                parent: item.folderParentID ? item.folderParentID : "base_" + vm.filefolderData.ReftypeID,
                isParent: item.folderParentID ? false : true
              };
              vm.folderList.push(model);
            });
            // if added new folder and new added folder is available - gencFolderID
            if (gencFolderID) {
              selectedFolderID = gencFolderID;
              getSelectedDestinationFolderDet();
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //return GenericFolderFactory.getFolderList().save(vm.filefolderModel).$promise.then((response) => {
      //  if (response && response.data) {
      //    vm.folderList = response.data;
      //    _.each(vm.folderList, (item) => {
      //      if (item.refParentId) {
      //        let gencFolderFullNameStr = null;
      //        gencFolderFullNameStr = item.gencFolderName;
      //        item.gencFolderFullName = setFullFolderPath(gencFolderFullNameStr, item.refParentId);
      //      }
      //      else {
      //        item.gencFolderFullName = item.gencFolderName;
      //      }
      //    })
      //  }
      //  else {
      //    vm.folderList = [];
      //  }
      //  return vm.folderList;
      //}).catch((error) => {
      //  return BaseService.getErrorLog(error);
      //});
    }
    // [E] Getting Folder list
    getAllFolderList();

    //let setFullFolderPath = (gencFolderFullNameStr, refParentId) => {
    //  let parentFolderDet = _.find(vm.folderList, (item) => {
    //    return item.gencFolderID == refParentId;
    //  })
    //  if (parentFolderDet) {
    //    gencFolderFullNameStr = parentFolderDet.gencFolderName + "\\" + gencFolderFullNameStr;
    //    if (parentFolderDet.refParentId) {
    //      return setFullFolderPath(gencFolderFullNameStr, parentFolderDet.refParentId);
    //    }
    //    else {
    //      return gencFolderFullNameStr;
    //    }
    //  }
    //  else {
    //    if (vm.filefolderModel.parentFolderOfSelectedFileFolder &&
    //      vm.filefolderModel.parentFolderOfSelectedFileFolder.gencFolderID == refParentId) {
    //      return gencFolderFullNameStr = vm.filefolderModel.parentFolderOfSelectedFileFolder.gencFolderName + "\\" + gencFolderFullNameStr;
    //    }
    //    else {
    //      return gencFolderFullNameStr;
    //    }
    //  }
    //}

    // after data comes tree loaded
    vm.onTreeLoaded = (folderDetail, callbackFn) => {
      //if nothing selected than select default will call and get object of default
      if (folderDetail && folderDetail.id) {
        selectedFolderID = folderDetail.id;
        $("." + vm.doumentClass).jstree('deselect_all', true);
        $("." + vm.doumentClass).jstree('select_node', selectedFolderID);
        getSelectedDestinationFolderDet();
      }
    };

    // to display selected destination folder 
    let getSelectedDestinationFolderDet = () => {
      vm.selectedFolderDet = _.find(vm.folderList, (item) => {
        return item.id == selectedFolderID
      });
    }

    // when any folder selected
    vm.selectedFolder = (folderDetail) => {
      selectedFolderID = (folderDetail && typeof (folderDetail) === "object") ? folderDetail.id : selectedFolderID;
      getSelectedDestinationFolderDet();
    }

    /*Used to move folder*/
    vm.moveFolder = () => {

      if (!selectedFolderID || (vm.filefolderData.selectedSourceFolderIDs.length == 0 && vm.filefolderData.selectedSourceFileIDs.length == 0) || !vm.filefolderData.refParentId
        || !vm.selectedFolderDet || !vm.selectedFolderDet.roleId) {
        return;
      }

      if (vm.filefolderData.refParentId == selectedFolderID) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DESTINATION_SAME_AS_SOURCE_MOVE);
        let alertModel = {
          messageContent: messageContent,
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }
      //let isDestinationIsSameAsSourceFolder = _.some(vm.filefolderData.selectedSourceFolderIDs, (item) => {
      //  return item == selectedFolderID;
      //})
      //if (isDestinationIsSameAsSourceFolder) {
      //  displayDestinationSameAsSourceError();
      //  return;
      //}
      //else {
      //  let isDestinationIsSameAsSourceFile = _.some(vm.filefolderData.selectedSourceFileIDs, (item) => {
      //    return item == selectedFolderID;
      //  })
      //  if (isDestinationIsSameAsSourceFile) {
      //    displayDestinationSameAsSourceError();
      //    return;
      //  }
      //}


      var updateModel = {
        sourceGencFolderIDsToMove: vm.filefolderData.selectedSourceFolderIDs,
        sourceGencFileIDsToMove: vm.filefolderData.selectedSourceFileIDs,
        destinationGencFolderIDInMove: selectedFolderID,
        parentFolderIDOfSelected: vm.filefolderData.refParentId,
        //gencFolderID: vm.filefolderData.gencFolderID,
        //refParentId: vm.autoCompleteFolders.keyColumnId,
        //isFolder: vm.filefolderData.isFolder,
        entityID: vm.filefolderData.entityID,
        refTransID: vm.filefolderData.refTransID,
        gencFileOwnerType: vm.filefolderData.gencFileOwnerType,
        roleId: vm.selectedFolderDet.roleId
      }

      //if (updateModel.isFolder) {
      //  updateModel.gencFolderID = vm.filefolderData.gencFolderID;
      //}
      //else {
      //  updateModel.gencFileID = vm.filefolderData.gencFileID;
      //}

      GenericFolderFactory.moveFileFolder().save(updateModel).$promise.then((resp) => {
        if (resp && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          let isContainDuplicateFiles = resp.data && resp.data.duplicateFileList && resp.data.duplicateFileList.length > 0;
          let isContainDeletedFolderListAtSource = resp.data && resp.data.deletedFolderListAtSource && resp.data.deletedFolderListAtSource.length > 0;
          let isContainDeletedFileListAtSource = resp.data && resp.data.deletedFileListAtSource && resp.data.deletedFileListAtSource.length > 0;

          if (isContainDuplicateFiles || isContainDeletedFolderListAtSource || isContainDeletedFileListAtSource) {
            if (isContainDuplicateFiles) {
              let data = {
                refTransID: vm.filefolderData.refTransID,
                parentFolderIDOfSelected: vm.filefolderData.refTransID.parentFolderIDOfSelected,
                duplicateFileList: resp.data.duplicateFileList,
              }

              DialogFactory.dialogService(
                CORE.MOVE_DUPLICATE_DOC_CONFIRM_MODAL_CONTROLLER,
                CORE.MOVE_DUPLICATE_DOC_CONFIRM_MODAL_VIEW,
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
                                                  <th width="15%" md-column class="p-5">Type</th> \
                                              </tr> \
                                          </thead> \
                                          <tbody class="custom-scroll" md-body> \ ';
              // deleted folders from source
              _.each(resp.data.deletedFolderListAtSource, function (folderItem, index) {
                vm.printHtmlContent += '<tr md-row> \ ' +
                  '<td width="10%" md-cell>' + (index + 1) + '</td>  ' +
                  '<td width="75%" md-cell>' + folderItem.gencFolderName + ' </td>  ' +
                  '<td width="15%" md-cell class="p-5">' + 'Folder' + '</td>' +
                  '</tr > ';
              });
              // deleted files from source
              _.each(resp.data.deletedFileListAtSource, function (fileItem, index) {
                vm.printHtmlContent += '<tr md-row> \ ' +
                  '<td width="10%" md-cell>' + (index + 1 + (resp.data.deletedFolderListAtSource.length)) + '</td>  ' +
                  '<td width="75%" md-cell>' + fileItem.gencOriginalName + ' </td>  ' +
                  '<td width = "15%" md-cell class="p-5">' + 'File' + '</td>' +
                  '</tr > ';
              });

              vm.printHtmlContent += ' </tbody> \
                                             </table> \
                                             </md-table-container>';

              var model = {
                title: "Invalid Folder(s)/File(s) To Move",
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
        return BaseService.getErrorLog(error);
      });
    }

    //let displayDestinationSameAsSourceError = () => {
    //  let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
    //  messageContent.message = stringFormat(messageContent.message, "work order");
    //  let alertModel = {
    //    messageContent: messageContent,
    //  };
    //  DialogFactory.messageAlertDialog(alertModel);
    //}

    // to close current dialog
    let closeDialog = (isRefreshFolderDocList) => {
      BaseService.currentPagePopupForm.pop();
      $mdDialog.hide(isRefreshFolderDocList);
    }

    /*Used to close pop-up*/
    vm.cancel = () => {
      $mdDialog.cancel();
      //let isdirty = vm.checkFormDirty(vm.folderForm);
      //if (isdirty) {
      //  let data = {
      //    form: vm.folderForm
      //  }
      //  BaseService.showWithoutSavingAlertForPopUp(data);
      //} else {
      //  BaseService.currentPagePopupForm.pop();
      //  DialogFactory.closeDialogPopup();
      //}
    };

    /* create new folder manually on button of "NEW FOLDER" */
    vm.createNewFolder = () => {
      if (vm.selectedFolderDet && vm.selectedFolderDet.roleId) {
        let selected = $("." + vm.doumentClass).jstree('get_selected', (true));
        if (selected) {
          $scope.$broadcast('createNewFolderManually', selected);
        }
      }
    }

    /* Start End Create Folder*/
    vm.folderCreated = (item, callbackFn, event) => {
      if (!event) {
        event = angular.element.Event('click');
        angular.element('body').trigger(event);
      }
      var model = {
        gencFolderName: item.name,
        refTransID: vm.filefolderData.ReftypeID,
        entityID: vm.filefolderData.entityID,
        refParentId: item.parentId,
        roleId: item.roleId,
        gencFileOwnerType: vm.filefolderData.gencFileOwnerType
      }
      DialogFactory.dialogService(
        CORE.FOLDER_ADD_MODAL_CONTROLLER,
        CORE.FOLDER_ADD_MODAL_VIEW,
        event,
        model).then((folderDetail) => {
          callbackFn(folderDetail);
          //vm.FolderFileList.push({
          //  id: folderDetail.gencFolderID,
          //  isParent: false,
          //  isSelected: false,
          //  name: folderDetail.gencFolderName,
          //  parent: folderDetail.refParentId,
          //  selected: false,
          //  text: folderDetail.gencFolderName,
          //  type: "folder",
          //  roleId: folderDetail.roleId
          //});
          getAllFolderList(folderDetail.gencFolderID);
        }, (err) => {
          callbackFn(null);     // Remove temp generated folder from file manager list
        });
    }


    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.folderForm);
    });
  }
})();

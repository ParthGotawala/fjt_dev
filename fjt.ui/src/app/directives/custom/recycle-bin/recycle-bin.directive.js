(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('recycleBin', recycleBin);

  /** @ngInject */
  function recycleBin() {
    var directive = {
      restrict: 'E',
      scope: {
        refTransId: '=?',
        entity: '=?',
        roleId: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/recycle-bin/recycle-bin.html',
      controller: recyclebinCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of recycle bin
    *
    * @param
    */
    function recyclebinCtrl($scope, CORE, USER, BaseService, GenericFolderFactory, DialogFactory, $rootScope, RoleFactory) {
      var vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.refTransID = $scope.refTransId;
      vm.Entity = $scope.entity;
      vm.roleId = $scope.roleId;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.RECYCLE_EMPTY;
      vm.gencFileOwnerType = angular.isArray(vm.Entity) ? vm.Entity[0] : vm.Entity;
      vm.recycleBinList = [];
      vm.selectedFileFolder = [];
      vm.SearchEmptyMessage = USER.ADMIN_EMPTYSTATE.DOCUMENT_SEARCH_EMPTY;
      const loginUserDetails = BaseService.loginUser;
      vm.isUserSuperAdmin = loginUserDetails.isUserSuperAdmin;
      vm.isEnablePermanentDeleteFeature = false;
      vm.isEnableRestoreDocument = false;

      const getAllRights = () => {
        vm.isEnablePermanentDeleteFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToPermanentDeleteDocument);
        vm.isEnableRestoreDocument = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToRestoreDocument);
      };
      const getRoleByID = () => {
        if (vm.roleId) {
          const roleObj = {
            id: vm.roleId
          };
          vm.cgBusyLoading = RoleFactory.getRolesById().query(roleObj).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.data) {
              vm.role = response.data.data;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      getAllRights();
      getRoleByID();

      // Search Criteria
      vm.queryDocument = {
        order: '',
        documentSearch: ''
      };

      vm.backToDocument = () => {
        $rootScope.$broadcast('manageResponseRecycleDirectiveCall');
      };

      vm.backToRoot = () => {
        if (vm.roleId) {
          const docObj = {
            roleId: vm.roleId
          };
          vm.cgBusyLoading = GenericFolderFactory.getGoToRootFolderID().query(docObj).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.data) {
              $scope.$parent.vm.selectedRecycleFolder = response.data.data.gencFolderID;
              $rootScope.$broadcast('manageGoToRoot');
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.backToDocument();
        }
      };

      /* Select/UnSelect All Folder/File Record  */
      vm.selectAll = () => {
        vm.selectedFileFolder = [];
        vm.recycleBinList.forEach((item) => {
          item.isSelected = vm.isSelectAll ? vm.isSelectAll : false;
          if (vm.isSelectAll) {
            const deleteObj = {
              isFolder: item.isFolder,
              refId: item.refId,
              id: item.id
            };
            if (item.isSelected) {
              vm.selectedFileFolder.push(deleteObj);
            }
          }
        });
      };

      /* Manage 'Select All' Checkbox on Select/UnSelect Folder/File*/
      vm.SelectFolderFile = (detail) => {
        var isAllSelected = vm.recycleBinList.some((item) => item.isSelected === false);
        vm.isSelectAll = isAllSelected ? false : true;
        if (detail.isSelected) {
          const deleteObj = {
            isFolder: detail.isFolder,
            refId: detail.refId,
            id: detail.id
          };
          vm.selectedFileFolder.push(deleteObj);
        }
        else {
          const deleteObjIndex = vm.selectedFileFolder.findIndex((x) => x.id === detail.id);
          if (deleteObjIndex > -1) { vm.selectedFileFolder.splice(deleteObjIndex, 1); }
        }
      };

      vm.searchDocument = (item) => {
        vm.recycleBinList = [];
        if (item) {
          const searchTxt = angular.copy(item).toLowerCase();
          const fileList = _.filter(vm.DocumentList, (doc) =>
            (doc.name.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.originalLocation.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.type.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.recycledBy.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.fileSize.toString().toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.recycledOn.toLowerCase().indexOf(searchTxt) !== -1)
          );
          vm.recycleBinList = vm.recycleBinList.concat(fileList);
        }
        else {
          vm.recycleBinList = vm.recycleBinList.concat(vm.DocumentList);
        }
      };

      // Clear Search results
      vm.ClearSearch = () => {
        vm.queryDocument.documentSearch = '';
        vm.recycleBinList = [];
        vm.recycleBinList = vm.recycleBinList.concat(vm.DocumentList);
      };

      // delete Files/Folders
      vm.deleteFileFolder = (detail, label) => {
        const removeDocObj = {
          IDs: (!detail) ? vm.selectedFileFolder.map((a) => a.id) : detail.id,
          label: label
        };
        vm.cgBusyLoading = GenericFolderFactory.deleteGenericRecycleBinDetails().query(removeDocObj).$promise.then(() => {
          vm.getRecycleBinListByRefTransID();
        });
        vm.isSelectAll = false;
      };

      // Restore File or Folder
      vm.restoreDocument = (detail) => {
        if (vm.isReadOnly) {
          return;
        }
        if (!vm.isEnableRestoreDocument) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
          messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToRestoreDocument);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else {
          const restoreDocObj = {
            refId: detail && detail.refId ? detail.refId : null,
            name: detail && detail.name ? detail.name : null,
            isFolder: detail && detail.isFolder,
            id: detail && detail.id,
            originalLocation: detail && detail.originalLocation ? detail.originalLocation : null
          };
          vm.cgBusyLoading = GenericFolderFactory.restoreGenericRecycleBin().query(restoreDocObj).$promise.then((response) => {
            if (response) {
              vm.getRecycleBinListByRefTransID();
            }
          });
        }
      };

      // multiple delete Files/Folders
      vm.DeleteMultipleRows = () => {
        if (!vm.selectedFileFolder.length) {
          return;
        }
        vm.confirmOnDeleteFileFolder();
      };

      vm.permenantDeleteDocument = (detail) => {
        if (vm.isReadOnly) {
          return;
        }
        vm.confirmOnDeleteFileFolder(detail);
      };


      // Confirmation for delete
      vm.confirmOnDeleteFileFolder = (detail) => {
        if (!vm.isEnablePermanentDeleteFeature) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
          messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToPermanentDeleteDocument);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else {
          let label, messageContent;

          if (detail && typeof (detail) === 'object') {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PERMENANT_DELETE_CONFIRM_MESSAGE);
            label = detail.isFolder ? 'folder' : 'file';
            messageContent.message = stringFormat(messageContent.message, label);
          } else if (vm.selectedFileFolder && vm.selectedFileFolder.length > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MULTIPLE_PERMENANT_DELETE_CONFIRM_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, vm.selectedFileFolder.length);
          }

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.deleteFileFolder(detail, label);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // get Recycle bin list
      vm.getRecycleBinListByRefTransID = () => {
        vm.recycleData = {
          refTransID: vm.refTransID,
          gencFileOwnerType: vm.gencFileOwnerType,
          roleId: vm.roleId
        };
        if (vm.recycleData) {
          vm.cgBusyLoading = GenericFolderFactory.getRecycleBinListByRefTransID().query(vm.recycleData).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.RecycleBinList && response.data.RecycleBinList.length > 0) {
              vm.recycleBinList = response.data.RecycleBinList;
              _.map(vm.recycleBinList, (item) => {
                item.isSelected = false;
                item.isFolder = item.isFolder === 1 ? true : false;
                if (!item.isFolder) {
                  let path = CORE.DISPLAY_DOCUMENT_ICON.OTHER;
                  item.documentPath = `${_configWebUrl}${item.genFilePath}`;
                  item.displaySize = isNaN(item.fileSize) === true ? item.fileSize : formatNumber(Math.round(Number(((item.fileSize / 1024) < 1 ? 1 : (item.fileSize / 1024)))));
                  item.sizeTooltip = isNaN(item.fileSize) === true ? item.fileSize : formatNumber(Number(((item.fileSize / (1024 * 1024))).toFixed(1))) + ' MB' + ' (' + formatNumber(item.fileSize) + ' bytes)';
                  const gencFileType = item.type;
                  if (gencFileType.indexOf('/pdf') !== -1) {
                    item.isPDF = true;
                  }
                  if (gencFileType.indexOf('image/') !== -1) {
                    item.documentIcon = item.documentPath;
                    item.isImage = true;
                  } else {
                    item.isImage = false;
                    const ext = (/[.]/.exec(item.name)) ? /[^.]+$/.exec(item.name)[0] : null;
                    if (CORE.DOCUMENT_TYPE.indexOf(ext) !== -1) {
                      path = CORE.DISPLAY_DOCUMENT_ICON[ext.toUpperCase()];
                    }
                    item.documentIcon = path;
                  }

                  item.isVideoTypeFile = (gencFileType.indexOf('video/') !== -1);
                  item.isAudioTypeFile = (gencFileType.indexOf('audio/') !== -1);
                }
              });
              vm.DocumentList = vm.recycleBinList;
              vm.isNoDocumentFound = true;
            } else {
              vm.isNoDocumentFound = false;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.isNoDocumentFound = false;
        }
      };
      vm.getRecycleBinListByRefTransID();
    }
  }
})();

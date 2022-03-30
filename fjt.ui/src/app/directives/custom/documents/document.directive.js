(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('documents', documents);

  /** @ngInject */
  function documents($mdSidenav, $log, $sce, $timeout, $filter, $rootScope, $mdDialog, Upload, WORKORDER,
    GenericFileFactory, DialogFactory, BaseService, NotificationFactory,
    CORE, USER, NotificationSocketFactory, MasterFactory, GenericFolderFactory, $q, GenericCategoryFactory, ManufacturerFactory, SettingsFactory, CONFIGURATION) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '=?',
        refTransId: '=?',
        isTitle: '=?',
        isPreview: '=',
        isProfile: '=?',
        isProtected: '=?',
        isReadOnly: '=?',
        isDefault: '=?',
        isWorkstation: '=?',
        isTraveler: '=?',
        isMerge: '=?',
        docInsideFolderName: '=?'  /* create folder that passed here and put all doc inside it */,
        isHideDisplayTree: '=?',
        isShowPicture: '=?',
        isCapture: '=?',
        isVerifiedLabel: '=?',
        isViewOnly: '=?',
        extraEntityList: '=?',
        //extraEntity: '=?',
        //extraRefTransIds: '=?',
        fileGroupByIds: '=?',
        docOpenType: '=?',  //In  part document tab  , docOpenType : 0-normal rout , 1-to open operator folder , 2- to upload image
        isDisableAllFunctionality: '=?'
      },
      templateUrl: 'app/directives/custom/documents/document.html',
      controller: documentsctrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function documentsctrl($scope) {
      var vm = this;
      // for sending notification on change of any document
      var workorderDetails = null;
      var woOPEntityName = 'workorder_operation';
      var woEntityName = 'workorder';
      vm.searchText = '';
      $scope.loaderVisible = undefined;
      const loginUserDetails = BaseService.loginUser;
      vm.Entity = $scope.entity;
      vm.extraEntityList = $scope.extraEntityList;
      vm.isUserSuperAdmin = loginUserDetails.isUserSuperAdmin;
      //vm.extraEntity = $scope.extraEntity;
      //vm.extraRefTransIds = $scope.extraRefTransIds;
      vm.fileGroupByIds = $scope.fileGroupByIds;
      vm.isTraveler = $scope.isTraveler;
      const allEventAction = CORE.TIMLINE.eventAction;
      let eventAction = null;
      vm.isDisableUploadDocumentBtn = false;
      vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      const IsPermanentDelete = CORE.IsPermanentDelete;
      $scope.image = {
        isEdit: false
      };
      $scope.lastUndoImg = null;
      vm.doumentClass = 'document-tree-view';
      vm.isHideDisplayTree = $scope.isHideDisplayTree ? true : false;
      $scope.cWidth = 500;
      $scope.cHeight = 300;
      vm.isProtected = $scope.isProtected;
      vm.isReadOnly = $scope.isReadOnly ? true : false;
      vm.isCapture = $scope.isCapture;
      vm.isProfile = $scope.isProfile;
      vm.title = $scope.isTitle;
      vm.docOpenType = $scope.docOpenType;
      vm.sideName = 'right' + vm.Entity;
      vm.isdefault = $scope.isDefault;
      $scope.icon = 'assets/images/etc/other.png';
      vm.isView = false;
      vm.isEdit = false;
      vm.ispicture = false;
      vm.isRecycleddirectiveCall = false;
      vm.isShowPicture = $scope.isShowPicture;
      const Documentsize = _configDocumentSize;//CORE.DocumentSize;
      vm.isFileUploadComplete = false; // used this flag to avoid reopening of updload side for docOpenType =2
      vm.isDisableDocType = false;  //used for only sample picture upload
      vm.FILE_PREVIEW_NOT_AVAILABLE = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_PREVIEW_NOT_AVAILABLE;
      vm.emptyStateForRootFolderSelected = CORE.EMPTYSTATE.SELECT_ANY_FOLDER_FOR_DOC_ACTION;
      // to disable all functionality from access
      vm.isDisableToAccess = $scope.isDisableAllFunctionality ? $scope.isDisableAllFunctionality : false;
      $scope.isReadOnly = $scope.isReadOnly ? $scope.isReadOnly : vm.isDisableToAccess;  // to hide all folder action menus on :  (...) button
      vm.isRecycle = false;
      vm.recycleCount = 0;
      vm.isEnablePermanentDeleteFeature = false;
      vm.isEnableTakePictureViaIPFeature = false;
      vm.selectedRecycleFolder = null;
      // manage recycle flag and maintain directives objects
      vm.manageRecycleBin = () => {
        vm.isRecycleddirectiveCall = true;
      };

      const getAllRights = () => {
        vm.isEnablePermanentDeleteFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToPermanentDeleteDocument);
        vm.isEnableTakePictureViaIPFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToTakePictureViaIP);
      };
      getAllRights();

      $rootScope.$on('manageResponseRecycleDirectiveCall', () => {
        vm.refreshDocument();
        vm.isRecycleddirectiveCall = false;
      });

      $rootScope.$on('manageGoToRoot', () => {
        selectedFolderID = vm.selectedRecycleFolder ? vm.selectedRecycleFolder : selectedFolderID;
        vm.refreshDocument();
        vm.isRecycleddirectiveCall = false;
        vm.selectedRecycleFolder = null;
      });
      vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
      // -------------------------- [S] - Restricted Files Extension -------------------------------------------
      const FileAllow = CORE.FileTypeList;
      vm.FileGroup = [];
      // vm.FileTypeList = _.map(FileAllow, 'extension').join(',');
      if (Array.isArray(FileAllow)) {
        vm.AllowFileExtenstion = _.map(FileAllow, 'extension').join(', ').replace(/[.]/g, '');
      }
      function retriveConfigureFileTypeList() {
        vm.cgBusyLoading = SettingsFactory.retriveConfigureFileType().query().$promise.then((response) => {
          vm.FileTypeList = [];
          if (response && response.data && response.data.length > 0) {
            vm.FileTypeList = _.map(response.data, (item) => item ? '!' + item.fileExtension : item).join(',');
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };
      retriveConfigureFileTypeList();
      // -------------------------- [E] - Restricted Files Extension -------------------------------------------

      vm.file = {};
      vm.refTransID = $scope.refTransId;
      vm.allentity = CORE.AllEntityIDS;
      vm.isopenSidebar = false;
      $scope.isredo = false;
      $scope.disableDIV = true;
      vm.isNoDocumentFound = false;
      vm.isDisableDeleteButtonUserWise = false;
      vm.selectedFileFolder = [];

      //let roleDetail = _.minBy(loginUserDetails.roles, 'accessLevel');
      const entityName = angular.isArray(vm.Entity) ? vm.Entity[0] : vm.Entity;
      let ReftypeID = angular.isArray(vm.Entity) ? vm.refTransID[0] : vm.refTransID;

      const EntityData = _.find(vm.allentity, (entity) => entity.Name === entityName);
      let extraEntityListString = null;
      if (vm.extraEntityList && vm.extraEntityList.length > 0) {
        _.map(vm.extraEntityList, (data) => {
          data.entityId = data.entityId ? data.entityId : '';
          data.entityName = data.entityName ? data.entityName : '';
          data.refTransId = data.refTransId ? data.refTransId : 0;
          data.fileGroupBy = data.fileGroupBy ? data.fileGroupBy : '';
        });
        extraEntityListString = JSON.stringify(vm.extraEntityList);
      }

      //vm.extraEntityDetails = _.filter(vm.allentity, (allEntity) => _.find(vm.extraEntity, (extraEntity) => allEntity.Name === extraEntity));
      //vm.extraEntityIds = _.map(_.filter(vm.extraEntityDetails, (data) => {
      //  if (data.ID) {
      //    return data;
      //  }
      //}), 'ID');

      vm.entityID = (vm.isWorkstation && vm.isWorkstation === true) ? null : EntityData.ID;
      vm.FileFolder = CORE.FILE_FOLDER;
      if (vm.Entity === vm.allentity.Equipment_Task.Name) {
        vm.setDetault = false;
      }
      else {
        vm.setDetault = true;
      }

      vm.isView = vm.ispicture = vm.isEdit = $scope.isImageFile = vm.isAudioFile = vm.isVideoFile = vm.isPDFFile = false;
      vm.documentType = CORE.DocumentType.Document;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DOCUMENT_DRAG_UPLOAD;
      vm.RecycleEmptyMesssage = USER.ADMIN_EMPTYSTATE.RECYCLE_EMPTY;
      vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, vm.documentType);
      vm.EmptyMesssage.NO_ANY_DOC_MESSAGE = stringFormat(vm.EmptyMesssage.NO_ANY_DOC_MESSAGE, vm.documentType);
      vm.SearchEmptyMessage = USER.ADMIN_EMPTYSTATE.DOCUMENT_SEARCH_EMPTY;
      vm.genericFile = {};
      vm.vidpath = null;
      vm.DocumentList = vm.rightSideFolderList = [];
      vm.docTags = [];
      // In Preview we Give provision for view Next/Previous
      vm.previewIndex = {
        nextIndex: null,
        previousIndex: null
      };

      let selectedFolderID = null;

      $scope.operations = vm.allentity.Operation.Name;
      $scope.workorderOperation = vm.allentity.Workorder_operation.Name;
      let isWOHeaderDetailsAlreadyUpdated = false;
      let defaultLoginRoleDetOfUser = null;
      if (loginUserDetails) {
        defaultLoginRoleDetOfUser = _.find(loginUserDetails.roles, (roleItem) => roleItem.id === loginUserDetails.defaultLoginRoleID);
      }
      vm.isWorkstation = $scope.isWorkstation;
      vm.EmptyStateForEmpCertiRestriction = USER.ADMIN_EMPTYSTATE.DOC_VIEW_RESTRICTION_BY_EMP_CERTI;

      // Search Criteria
      vm.queryDocument = {
        order: '',
        documentSearch: ''
      };

      vm.searchDocument = (item) => {
        vm.folderDocumentList = [];
        if (item) {
          const searchTxt = angular.copy(item).toLowerCase();
          if (!vm.isHideDisplayTree) {
            const folderList = _.filter(vm.rightSideFolderList, (folder) =>
              (folder.name.toLowerCase().indexOf(searchTxt) !== -1)
              || (folder.type.toLowerCase().indexOf(searchTxt) !== -1)
              || (folder.modifiedBy.toLowerCase().indexOf(searchTxt) !== -1)
              || (folder.modifiedOn.toLowerCase().indexOf(searchTxt) !== -1)
            );
            vm.folderDocumentList = vm.folderDocumentList.concat(folderList);
          }
          const fileList = _.filter(vm.DocumentList, (doc) =>
            (doc.name.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.type.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.modifiedBy.toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.size.toString().toLowerCase().indexOf(searchTxt) !== -1)
            || (doc.fileGroupName ? (doc.fileGroupName.toString().toLowerCase().indexOf(searchTxt) !== -1) : false)
            || (doc.modifiedOn.toLowerCase().indexOf(searchTxt) !== -1)
          );
          vm.folderDocumentList = vm.folderDocumentList.concat(fileList);
        }
        else {
          vm.folderDocumentList = vm.folderDocumentList.concat(vm.rightSideFolderList);
          vm.folderDocumentList = vm.folderDocumentList.concat(vm.DocumentList);
        }
        if (vm.folderDocumentList.length > 0) {
          vm.selectFile();
        }
      };
      vm.ClearSearch = () => {
        vm.queryDocument.documentSearch = '';
        vm.folderDocumentList = [];
        vm.folderDocumentList = vm.folderDocumentList.concat(vm.rightSideFolderList);
        vm.folderDocumentList = vm.folderDocumentList.concat(vm.DocumentList);
        if (vm.folderDocumentList.length > 0) {
          vm.selectFile();
        }
      };

      $rootScope.$on('refreshDocuments', () => {
        vm.refreshDocument();
      });

      vm.refreshDocument = () => {
        pageInitAndValidateForDoc();
        //vm.getDocuments();
      };
      // Restrict changes into all fields if work order status is 'under termination'
      vm.isWOUnderTermination = false;

      // Get Access for delete File on base on User Role
      const getAccessLavel = () => {
        ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS }).$promise.then((response) => {
          if (response && response.data) {
            const accessLevelDetail = {
            };
            accessLevelDetail.accessRole = response.data.name;
            accessLevelDetail.accessLevel = response.data.accessLevel;
            const currentUserRole = _.find(loginUserDetails.roles, (data) => data.id === loginUserDetails.defaultLoginRoleID);
            if (currentUserRole && currentUserRole.accessLevel <= accessLevelDetail.accessLevel) {
              vm.isDisableDeleteButtonUserWise = false;
            } else {
              vm.isDisableDeleteButtonUserWise = true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // Retrive Access Level when we hide Tree-View
      if (vm.isHideDisplayTree) {
        getAccessLavel();
      }

      // Get Documents for Particular Entity
      vm.getDocuments = (gencFolderID) => {
        vm.queryDocument = {
          order: '',
          documentSearch: ''
        };
        vm.selectedFileFolder = [];
        vm.isSelectAll = false;
        if (vm.isHideDisplayTree) {
          vm.selectedFolder();
        }
        else {
          if (defaultLoginRoleDetOfUser) {
            vm.list = true;
            vm.cgBusyLoading = GenericFolderFactory.genericFolderList().save({
              refTransID: ReftypeID,
              entityId: vm.entityID,
              gencFileOwnerType: entityName,
              accessLevel: defaultLoginRoleDetOfUser.accessLevel,
              isTraveler: $scope.isTraveler ? true : false
            }).$promise.then((res) => {
              vm.DocumentList = [];
              vm.FolderFileList = [];

              vm.isSelected = true;
              // Default Root parent folder for
              // used "base_" as a prefix as if ReftypeID value = gencFolderID value then folder will be displayed on top
              vm.FolderFileList.push({
                'id': 'base_' + ReftypeID, 'parent': '#', 'text': 'Root '
              });

              _.each(res.data, (item) => {
                // if doc open type is 1, select operator by default
                if (vm.docOpenType === 1 || vm.docOpenType === 2) {
                  if (item.gencFolderName === 'Operator') {
                    vm.isSelected = true;
                  }
                  else {
                    vm.isSelected = false;
                  }
                }
                else {
                  vm.isSelected = true;
                }

                const contextMenuButton = $scope.isTraveler || vm.isReadOnly ? '' :
                  ' <span name=\'contextButton\'><md-icon md-font-icon=\'icon-dots-vertical\' class=\'uigrid-icon margin-0 ng-scope md-default-theme md-font material-icons icon-dots-vertical\'></md-icon></span>';
                const model = {
                  id: item.gencFolderID,
                  totalInnerFileFolder: (parseInt(item.totalInnerFileFolder || 0) > 0 ? ' (' + item.totalInnerFileFolder + ')' : ''),
                  text: item.gencFolderName + (parseInt(item.totalInnerFileFolder || 0) > 0 ? ' (' + item.totalInnerFileFolder + ')' : '') + contextMenuButton,
                  tooltip: item.gencFolderName + ((!item.entityID && !item.gencFileOwnerType && item.accessLevel) ? ('<br /> Access level: ' + item.accessLevel) : ''),// + (parseInt(item.totalInnerFileFolder || 0) > 0 ? ' (' + item.totalInnerFileFolder + ')' : ''),
                  name: item.gencFolderName,
                  isSelected: vm.isSelected,
                  type: 'folder',
                  contextMenuButton: contextMenuButton,
                  gencFileOwnerType: item.gencFileOwnerType,
                  roleId: item.roleId,
                  isProtected: vm.isProtected,
                  isReadOnly: vm.isReadOnly,
                  roleAccessLevel: item.accessLevel
                  //refCopyGencFileOwnerType: item.refCopyGencFileOwnerType
                };
                vm.isSelected = false;
                model.parent = item.folderParentID ? item.folderParentID : 'base_' + ReftypeID;
                model.isParent = item.folderParentID ? false : true;
                vm.FolderFileList.push(model);
              });

              selectedFolderID = gencFolderID ? gencFolderID : null;
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ASSIGN_ATLEAST_ONE_ROLE);
            DialogFactory.messageAlertDialog({
              messageContent: messageContent,
              multiple: true
            });
          }
        }
      };

      function getWorkorderByWoOPID(woOPID) {
        MasterFactory.getWorkorderByWoOPID().query({ woOPID: woOPID }).$promise.then((response) => {
          if (response && response.data) {
            workorderDetails = response.data;
            vm.getDocuments();
            setFlagBasedOnWODetails(workorderDetails);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      function getWorkorderByID(woID) {
        MasterFactory.getWODetails().query({ woID: woID }).$promise.then((response) => {
          if (response && response.data) {
            workorderDetails = response.data;
            vm.getDocuments();
            setFlagBasedOnWODetails(workorderDetails);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // once get wo details , set flag based on work order status
      const setFlagBasedOnWODetails = (workorderDetails) => {
        vm.isWOUnderTermination = (workorderDetails.woStatus === CORE.WOSTATUS.UNDER_TERMINATION || workorderDetails.woStatus === CORE.WOSTATUS.TERMINATED);
        // vm.isDisableToAccess set as common flag name in doc dir any one can use this flag to disable things
        vm.isDisableToAccess = (workorderDetails.woStatus === CORE.WOSTATUS.TERMINATED || workorderDetails.woStatus === CORE.WOSTATUS.COMPLETED || workorderDetails.woStatus === CORE.WOSTATUS.VOID);
        $scope.isReadOnly = $scope.isReadOnly ? $scope.isReadOnly : vm.isDisableToAccess;  // to hide all folder action menus on :  (...) button
      };

      /* check employee has all certification to access document */
      const checkStandardValidationForAccessDoc = () => {
        let woID, woOPID, partID = null;
        if (vm.Entity === woOPEntityName) {
          woOPID = vm.refTransID;
        }
        else if (vm.Entity === woEntityName) {
          woID = vm.refTransID;
        }
        else if (vm.Entity === CORE.Entity.ComponentAsPart) {
          partID = vm.refTransID;
        }
        else {
          return;
        }
        return MasterFactory.checkEmpHasValidStandardsForDoc().save({
          woID: woID,
          woOPID: woOPID,
          partID: partID,
          employeeID: loginUserDetails.employee.id
        }).$promise.then((response) => response)
          .catch((error) => BaseService.getErrorLog(error));
      };


      //Remove Document
      vm.removeDocument = (index) => {
        $scope.IsRemove = true;
        vm.genericDocument.splice(index, 1);
        $timeout(() => {
          $scope.IsRemove = false;
          $scope.$applyAsync();
        }, 0);
      };
      //Check Selected Document or Paste Document Name
      vm.documentFiles = (files, invalidFiles) => {
        if (Array.isArray(invalidFiles) && invalidFiles.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALLOW_FILE_TO_UPLOAD);
          const restrictedExtension = _.map(invalidFiles, (item) => item ? item.name.match(new RegExp('[^.]+$')) : item).join(',');
          messageContent.message = stringFormat(messageContent.message, restrictedExtension, `<a target='blank' href='${WebsiteBaseUrl}/#!${CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_ROUTE}'>Click here</a>`);

          // messageContent.message = stringFormat(messageContent.message, vm.AllowFileExtenstion);
          if (Array.isArray(files) && files.length > 0) {
            const totalLength = invalidFiles.length + files.length;
            const selectedFilesMsg = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECTED_VALID_FILE.message, files.length, totalLength);
            messageContent.message = selectedFilesMsg + '<br />' + messageContent.message;
          }
          else {
            messageContent.message = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UPLOAD_UNSUPPORTED_FILE.message + '<br />' + messageContent.message;
          }
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
        setSelectedDocuments(files);
      };

      //Take picture
      $scope.takePicture = (event) => {
        if (isDisabledToAccessFunctionality()) {
          return;
        }
        vm.isEdit = true;
        vm.isView = false;
        vm.ispicture = true;
        DialogFactory.dialogService(
          CORE.CAMERA_CAPTURE.CONTROLLER,
          CORE.CAMERA_CAPTURE.VIEW,
          event,
          null).then((res) => {
            if (res === false) {
              return;
            }
            $scope.image.src = res.croppedImage;
            $scope.image.name = `${new Date().getTime()}.png`;
            $scope.image.isEdit = true;
            $scope.isImageFile = true;
            $timeout(() => {
              Init();
            }, _configTimeout);
            vm.opensidebar();
            manualSetFormDirty();
          }, (err) => BaseService.getErrorLog(err));
      };

      //Take picture via IP
      $scope.takePictureViaIp = (event) => {
        if (isDisabledToAccessFunctionality()) {
          return;
        }
        vm.isEdit = true;
        vm.isView = false;
        vm.ispicture = true;
        DialogFactory.dialogService(
          CORE.IP_CAMERA_CAPTURE.CONTROLLER,
          CORE.IP_CAMERA_CAPTURE.VIEW,
          event,
          null).then((res) => {
            if (res === false) {
              return;
            }
            $scope.image.src = res;
            $scope.image.name = `${new Date().getTime()}.png`;
            $scope.image.isEdit = true;
            $scope.isImageFile = true;
            $timeout(() => {
              Init();
            }, _configTimeout);
            vm.opensidebar();
            manualSetFormDirty();
          }, (err) => BaseService.getErrorLog(err));
      };
      //Toggle Rigth side preview
      vm.toggleRightPreviewDoc = () => {
        vm.fileGroupBy = null;
        setSidebarOpen();
      };

      //Toggle Rigth side preview
      vm.back = () => {
        $scope.isPreview = false;
      };

      //upload document
      vm.uploadFiles = (event) => {
        vm.searchText = '';
        if (vm.isDisableUploadDocumentBtn || vm.saveDisable || vm.isDisableToAccess) {
          return;
        }
        vm.saveDisable = true;
        if (BaseService.focusRequiredField(vm.documentForm)) {
          vm.saveDisable = false;
          return;
        }

        vm.genericDocument = _.filter(vm.genericDocument, (obj) => !obj.isProcessed);
        if (vm.genericDocument && vm.genericDocument.length > 0) {
          const uploadFileObj = {
            filenames: _.map(vm.genericDocument, 'name'),
            refParentId: selectedFolderID || null,
            refTransID: vm.refTransID,
            entityID: vm.entityID || null,
            gencFileOwnerType: entityName
          };

          vm.cgBusyLoading = GenericFileFactory.checkDuplicateGenericFiles().save({ uploadFileObj }).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.isHideDisplayTree) {
                uploadGenericDocument(ReftypeID, entityName);
              }
              // Display workorder operation revision popup
              else if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED) {
                if (entityName === woOPEntityName) {
                  isWOHeaderDetailsAlreadyUpdated = false;
                  vm.saveDisable = false;
                  openWOOPRevisionPopup(ReftypeID, (versionModel) => {
                    // Added for close revision dialog popup
                    if (versionModel && versionModel.isCancelled) {
                      return;
                    }
                    uploadGenericDocument(ReftypeID, entityName, versionModel);
                  }, event);
                }
                else if (entityName === woEntityName) {
                  isWOHeaderDetailsAlreadyUpdated = false;
                  vm.saveDisable = false;
                  openWORevisionPopup(ReftypeID, (versionModel) => {
                    // Added for close revision dialog popup
                    if (versionModel && versionModel.isCancelled) {
                      return;
                    }
                    uploadGenericDocument(ReftypeID, entityName, versionModel);
                  }, event);
                }
                else {
                  uploadGenericDocument(ReftypeID, entityName);
                }
              }
              else {
                uploadGenericDocument(ReftypeID, entityName);
              }

              if (vm.docOpenType === 2) {
                vm.isFileUploadComplete = true;
              }
            }
            else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data) {
              vm.saveDisable = false;
              if (res.errors.data.isDuplicateDocument) {
                const duplicateFiles = res.errors.data.duplicateFileList;
                vm.getDocuments(selectedFolderID);
                _.each(duplicateFiles, (docItem) => {
                  docItem.name = docItem.gencOriginalName;
                });
                const requiredDet = {
                  duplicateFilesList: duplicateFiles
                };
                displayDuplicateFileListForUpload(requiredDet);
              }
            } else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY) {
              vm.saveDisable = false;
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_DOCUMENT);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          vm.saveDisable = false;
        }
      };

      $scope.$watch('loaderVisible', (newValue) => {
        if (newValue) {
          vm.timeoutWatch = $timeout(() => {
            /*max time to show infinite loader*/
          }, _configMaxTimeout);
          $scope.$parent.vm.cgBusyLoading = vm.timeoutWatch;
        }
        else {
          if (vm.timeoutWatch) {
            $timeout.cancel(vm.timeoutWatch);
          }
        }
      });

      function generateResuambleObject(versionModel) {
        var resumableObj = new Resumable({
          target: `${CORE.API_URL}genericFileList/uploaChunkGenericFiles`,
          chunkSize: _chunkSizeInMB * 1024 * 1024,
          simultaneousUploads: 1,
          testChunks: false,
          throttleProgressCallbacks: 1,
          headers: {
            Authorization: `Bearer ${loginUserDetails.token}`
          }
        });
        var uploadedFileCount = 0;
        if (!resumableObj.support) {
          $('.resumable-error').show();
        } else {
          // Show a place for dropping/selecting files
          $('.resumable-drop').show();
          //r.assignDrop($('.resumable-drop')[0]);
          //r.assignBrowse($('.resumable-browse')[0]);

          // Handle file add event
          resumableObj.on('fileAdded', (file) => {
            // Show progress pabr
            $('.resumable-progress, .resumable-list').show();
            // Show pause, hide resume
            $('.resumable-progress .progress-resume-link').hide();
            $('.resumable-progress .progress-pause-link').show();
            // Add the file to the list
            $('.resumable-list').append('<li class="resumable-file-' + file.uniqueIdentifier + '">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-name').html(file.fileName);
            // Actually start the upload
            resumableObj.upload();
          });
          resumableObj.on('pause', () => {
            // Show resume, hide pause
            $('.resumable-progress .progress-resume-link').show();
            $('.resumable-progress .progress-pause-link').hide();
          });
          resumableObj.on('complete', () => {
            // Hide pause/resume when the upload has completed
            $scope.loaderVisible = false;
            BaseService.currentPageFlagForm = [];
            vm.isDisableUploadDocumentBtn = false;
            vm.saveDisable = false;
            vm.genericDocument = [];
            vm.imageDet = null;
            vm.documentDescription = null;
            vm.documentName = null;
            vm.isShared = true;
            vm.documentForm.$setPristine();
            vm.closePreviewSidenav('Close');
            vm.getDocuments(selectedFolderID);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DOCUMENT_UPLOADED);
            const message = stringFormat(messageContent.message, uploadedFileCount);
            NotificationFactory.success(message);
            /* refresh work order header conditionally */
            if (!vm.isHideDisplayTree && workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED &&
              !isWOHeaderDetailsAlreadyUpdated && ((entityName === woEntityName && versionModel && versionModel.woVersion)
                || (entityName === woOPEntityName && versionModel && versionModel.opVersion))) {
              refreshWorkOrderHeaderDetails();
            }
            $('.resumable-list').empty();
            $('.resumable-progress').hide();
          });
          resumableObj.on('fileSuccess', (file, message) => {
            // Reflect that the file upload has completed
            var statusDetail = '';
            try {
              statusDetail = JSON.parse(message);
            }
            catch (e) {
              statusDetail = true;
            }
            if (typeof (statusDetail) === 'object' && statusDetail.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (Array.isArray(vm.genericDocument)) {
                const fileIndex = vm.genericDocument.findIndex((a) => a === file);
                uploadedFileCount = uploadedFileCount + 1;
                if (fileIndex !== -1) {
                  vm.removeDocument(fileIndex);
                }
              }
              else if ($scope.isImageFile === true) {
                uploadedFileCount += 1;
              }
            }
            //else if (typeof (statusDetail) === "object" && statusDetail.status == CORE.ApiResponseTypeStatus.FAILED) {
            //  if (statusDetail.errors && statusDetail.errors.data && statusDetail.errors.data.isDuplicateDocument) {
            //   // currently we not able to handle properly chunk file in between error response
            //  }
            //}
          });
          resumableObj.on('fileError', (file, message) => {
            vm.isDisableUploadDocumentBtn = false;
            vm.saveDisable = false;
            let statusDetail = '';
            try {
              statusDetail = JSON.parse(message);
            }
            catch (e) {
              statusDetail = true;
            }
            if (typeof (statusDetail) === 'object' && statusDetail.status === CORE.ApiResponseTypeStatus.FAILED && typeof (statusDetail.errors) === 'object') {
              const errorDetail = statusDetail.errors;
              const model = {
                messageContent: errorDetail.messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
          });
          resumableObj.on('fileProgress', (file) => {
            // Handle progress for both the file and the overall upload
            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html(Math.floor(file.progress() * 100) + '%');
            $('.progress-bar').css({ width: Math.floor(resumableObj.progress() * 100) + '%' });
          });
          resumableObj.on('cancel', () => {
            //
          });
          resumableObj.on('uploadStart', () => {
            // Show pause, hide resume
          });
        }
        return resumableObj;
      }
      function uploadGenericDocument(ReftypeID, entityName, versionModel) {
        vm.isDisableUploadDocumentBtn = true;
        vm.saveDisable = true;
        const resumableObj = generateResuambleObject(versionModel);
        $scope.loaderVisible = true;
        BaseService.currentPageFlagForm = [true];
        vm.genericDocument.forEach((file, index) => {
          var documentDetail = {
            'description': vm.documentDescription,
            'refTransID': ReftypeID,
            'entityID': vm.entityID,
            'gencFileOwnerType': entityName,
            //'originalname': file.name,
            // 'isShared': vm.isShared,
            'isShared': true,
            'fileGroupBy': vm.fileGroupBy,
            'refParentId': selectedFolderID,
            //'fileSize': file.size,
            'docInsideFolderName': $scope.docInsideFolderName,
            'tags': vm.docTags.length > 0 ? vm.docTags.join(',') : null
            //'mimetype': file.type
          };
          if (vm.isHideDisplayTree) {
            documentDetail['refParentId'] = null;
            delete documentDetail['docInsideFolderName'];   // As When we hide Treeview we not pass this parameter
          }

          resumableObj.opts.query = {
            documentDetail: JSON.stringify(documentDetail)
          };
          //r.files.push(files);
          resumableObj.addFile(file);

          //vm.cgBusyDocLoading = GenericFileFactory.uploadGenericFiles(documentDetail, file).then((response) => {
          //  vm.genericDocument = [];
          //  vm.imageDet = null;
          //  vm.documentDescription = null;
          //  vm.documentName = null;
          //  vm.isShared = true;
          //  vm.closePreviewSidenav('Close');
          //  vm.getDocuments(selectedFolderID);

          //  /* refresh work order header conditionally */
          //  if (!vm.isHideDisplayTree && workorderDetails && workorderDetails.woStatus == CORE.WOSTATUS.PUBLISHED &&
          //    !isWOHeaderDetailsAlreadyUpdated && ((entityName == woEntityName && versionModel.woVersion)
          //      || (entityName == woOPEntityName && versionModel.opVersion))) {
          //    refreshWorkOrderHeaderDetails();
          //  }
          //}).catch((error) => {
          //  return BaseService.getErrorLog(error);
          //});
          if (index === (vm.genericDocument.length - 1)) {
            vm.closePreviewSidenav('Close');
            vm.isDisableUploadDocumentBtn = false;
            vm.saveDisable = false;
          }
        });

        // Send notification of change to all users
        if (!vm.isHideDisplayTree) {
          sendNotification(versionModel);
        }
      }

      vm.DeleteMultipleRows = () => {
        if (vm.isReadOnly || !vm.selectedFileFolder.length || vm.isDisableToAccess) {
          return;
        }
        confirmOnDeleteFileFolder();
      };

      vm.DownloadMultipleFilesInZip = () => {
        if (!vm.selectedFileFolder.length) {
          return;
        }
        const downloadDocObj = {
          eventAction: allEventAction.GENERICFILE_DOWNLOAD,
          entity: $scope.entity,
          refTransId: $scope.refTransId,
          selectedFileFolderIds: vm.selectedFileFolder.map((a) => a.id)
        };
        vm.cgBusyLoading = GenericFileFactory.downloadDocumentsAsZip(downloadDocObj).then((response) => {
          var model = {
            messageContent: '',
            multiple: true
          };
          if (response.status === 404) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 403) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 401) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
            DialogFactory.messageAlertDialog(model);
          }
          else {
            const blob = new Blob([response.data], {
              type: 'application/zip'
            });
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = (currentDate.getDate()).toString().padStart(2, '0');
            const hours = (currentDate.getHours()).toString().padStart(2, '0');
            const minutes = (currentDate.getMinutes()).toString().padStart(2, '0');
            const seconds = (currentDate.getSeconds()).toString().padStart(2, '0');
            const time = stringFormat('{0}{1}{2}', hours, minutes, seconds);
            const fileName = stringFormat('download-{0}{1}{2}-{3}', month, day, year, time);
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Take confirmation on delete folder/file when Workorder/opertion 'Publish'  */
      function confirmOnDeleteFileFolder(detail, folderCallbackFn, isGetConfirmationBasedOnFeature) {
        if (!isGetConfirmationBasedOnFeature) {
          let messageContent, label;
          if (detail && typeof (detail) === 'object') {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.RECYCLE_CONFIRM_MESSAGE);
            label = detail.isFolder ? 'folder' : 'file';
            messageContent.message = stringFormat(messageContent.message, label);
          } else if (vm.selectedFileFolder && vm.selectedFileFolder.length > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MULTIPLE_RECYCLE_CONFIRM_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, vm.selectedFileFolder.length);
          }

          const buttonsList = [{ name: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT },
          { name: CORE.MESSAGE_CONSTANT.MOVE_TO_RECYCLE_BUTTON_TEXT },
          { name: CORE.MESSAGE_CONSTANT.DELETE_PERMANENT_BUTTON_TEXT, isDisabled: !vm.isEnablePermanentDeleteFeature, isFeatureClass: true }];

          const data = {
            messageContent: messageContent,
            buttonsList: buttonsList,
            buttonIndexForFocus: 0
          };

          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then(() => {
              if (folderCallbackFn && typeof (folderCallbackFn) === 'function') {
                folderCallbackFn(null);
              }
              vm.isRecycle = false;
            }, (response) => {
              if (response === buttonsList[1].name) {
                vm.isRecycle = true;
                confirmOnDeleteFileFolder(detail, folderCallbackFn, true);
              } else if (response === buttonsList[2].name) {
                vm.isRecycle = false;
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
                  confirmOnDeleteFileFolder(detail, folderCallbackFn, true);
                }
              }
            }).catch((error) => {
              if (folderCallbackFn && typeof (folderCallbackFn) === 'function') {
                folderCallbackFn(null);
              }
              vm.isRecycle = false;
              return BaseService.getErrorLog(error);
            });
        } else {
          let entityName = vm.Entity;
          let ReftypeID = vm.refTransID;
          if (angular.isArray(vm.Entity)) {
            entityName = vm.Entity[0];
            ReftypeID = vm.refTransID[0];
          }

          // Display workorder operation revision popup
          if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED) {
            if (entityName === woOPEntityName) {
              isWOHeaderDetailsAlreadyUpdated = false;
              openWOOPRevisionPopup(ReftypeID, (versionModel) => {
                // Added for close revision dialog popup
                if (versionModel && versionModel.isCancelled) {
                  return;
                }
                deleteFolderFile(detail, folderCallbackFn, versionModel);
              }, event);
            }
            else if (entityName === woEntityName) {
              isWOHeaderDetailsAlreadyUpdated = false;
              openWORevisionPopup(ReftypeID, (versionModel) => {
                // Added for close revision dialog popup
                if (versionModel && versionModel.isCancelled) {
                  return;
                }
                deleteFolderFile(detail, folderCallbackFn, versionModel);
              }, event);
            }
            else {
              deleteFolderFile(detail, folderCallbackFn);
            }
          }
          else {
            deleteFolderFile(detail, folderCallbackFn);
          }
        }
      }

      //delete document
      vm.deleteDocument = (detail, folderCallbackFn) => {
        if (vm.DisableDeleteButton(detail)) {
          return;
        }
        confirmOnDeleteFileFolder(detail, folderCallbackFn, false);
      };

      /* Delete File/Folder  */
      function deleteFolderFile(detail, folderCallbackFn, versionModel) {
        const removeDocObj = {
          gencFolderIDs: (!detail) ? vm.selectedFileFolder.filter((x) => x.isFolder === true).map((a) => a.id) :
            ((typeof (detail) === 'object') && detail.isFolder) ? detail.gencFolderID : null,
          gencFileIDs: (!detail) ? vm.selectedFileFolder.filter((x) => x.isFolder === false).map((a) => a.id) :
            ((typeof (detail) === 'object') && detail.isFolder) ? null : detail.gencFileID,
          fileOwnerType: entityName,
          docInsideFolderName: $scope.docInsideFolderName,
          isPermanentDelete: IsPermanentDelete,
          isRecycle: vm.isRecycle,
          roleId: vm.selectedFolderFileRoleId
        };
        if (vm.isHideDisplayTree) {
          delete removeDocObj['docInsideFolderName'];   // As When we hide Treeview we not pass this parameter
        }
        vm.cgBusyLoading = GenericFolderFactory.removeFileFolder().save(removeDocObj).$promise.then(() => {
          if (folderCallbackFn && typeof (folderCallbackFn) === 'function') {
            folderCallbackFn(detail);
          }
          else {
            // Delete folder from right side section update left side tree-view section with delete folder
            const selected = $('.' + vm.doumentClass).jstree('get_selected', (true));
            $('.' + vm.doumentClass).jstree('delete_node', selected);
          }
          vm.employeeDcoumentList.$setPristine();
          let parentID = selectedFolderID;
          parentID = ((typeof (detail) === 'object') && detail.isFolder) ? (detail.id ? detail.parent : detail.refParentId) : parentID;
          vm.getDocuments(parentID);
          /* refresh work order header conditionally */
          if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED &&
            !isWOHeaderDetailsAlreadyUpdated && ((entityName === woEntityName && versionModel.woVersion)
              || (entityName === woOPEntityName && versionModel.opVersion))) {
            refreshWorkOrderHeaderDetails();
          }
          // Send notification of change to all users
          if (!vm.isHideDisplayTree) {
            sendNotification(versionModel);
          }
        }).catch((error) => {
          if (folderCallbackFn && typeof (folderCallbackFn) === 'function') {
            folderCallbackFn(null);
          }
          return BaseService.getErrorLog(error);
        });
      }

      /* Start Delete Folder */
      vm.deleteFolder = (folderDetail, callbackFn) => {
        if (vm.DisableDeleteFolderButton(folderDetail)) {
          return;
        }
        folderDetail.isFolder = true;
        folderDetail.gencFolderID = folderDetail.gencFolderID ? folderDetail.gencFolderID : folderDetail.id;
        confirmOnDeleteFileFolder(folderDetail, callbackFn, false);
      };
      /* End Delete Folder */

      //Update Document
      vm.upload = () => {
        if (vm.saveDisable || vm.isDisableToAccess) {
          return;
        }
        vm.saveDisable = true;
        if (BaseService.focusRequiredField(vm.documentForm)) {
          vm.saveDisable = false;
          return;
        }

        if ($scope.ImageHisory.undo.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.APPLY_DOCUMENT_CHANGES_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            $scope.finish();
            $timeout(() => {
              saveUpdatedFile();
            });
          }, () => {
            vm.saveDisable = false;
            $scope.clear();
            $timeout(() => {
              saveUpdatedFile();
            });
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          saveUpdatedFile();
        };
      };

      function saveUpdatedFile() {
        let finaldataURL = null;
        var file = [];
        if ($scope.isImageFile) {
          finaldataURL = myCanvas.toDataURL();
          $scope.image.src = finaldataURL;
          $scope.imageResult = Upload.dataUrltoBlob(finaldataURL, $scope.image.name);
          $scope.imageResult.name = $scope.image.name;
        }
        selectedFolderID = vm.isHideDisplayTree ? null : selectedFolderID;

        if (vm.EditDocumentId) {
          let entityName = vm.Entity;
          let ReftypeID = vm.refTransID;
          if (angular.isArray(vm.Entity)) {
            entityName = vm.Entity;
            ReftypeID = vm.refTransID;
          }

          // Display workorder operation revision popup
          if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED) {
            if (entityName === woOPEntityName) {
              isWOHeaderDetailsAlreadyUpdated = false;
              vm.saveDisable = false;
              openWOOPRevisionPopup(ReftypeID, (versionModel) => {
                // Added for close revision dialog popup
                if (versionModel && versionModel.isCancelled) {
                  return;
                }
                updateGenericFiles(versionModel);
              }, event);
            }
            else if (entityName === woEntityName) {
              isWOHeaderDetailsAlreadyUpdated = false;
              vm.saveDisable = false;
              openWORevisionPopup(ReftypeID, (versionModel) => {
                // Added for close revision dialog popup
                if (versionModel && versionModel.isCancelled) {
                  return;
                }
                updateGenericFiles(versionModel);
              }, event);
            }
            else {
              updateGenericFiles();
            }
          }
          else {
            updateGenericFiles();
          }
        } else {
          if (Array.isArray(vm.Entity)) {
            vm.Entity = vm.Entity[0];
          }
          if (Array.isArray(vm.refTransID)) {
            vm.refTransID = vm.refTransID[0];
          }
          const documentDetail = {
            'description': vm.documentDescription,
            'refTransID': vm.refTransID,
            'entityID': vm.entityID,
            'gencFileOwnerType': vm.Entity,
            'originalname': file.name,
            // 'isShared': vm.isShared,
            'isShared': true,
            'fileGroupBy': vm.fileGroupBy,
            'refParentId': selectedFolderID,
            'fileSize': $scope.imageResult.size,
            'docInsideFolderName': $scope.docInsideFolderName,
            'tags': vm.docTags.length > 0 ? vm.docTags.join(',') : null
          };
          if (vm.isHideDisplayTree) {
            delete documentDetail['docInsideFolderName'];
          }
          vm.isDisableUploadDocumentBtn = true;
          vm.saveDisable = true;
          const resumableObj = generateResuambleObject();
          $scope.loaderVisible = true;
          BaseService.currentPageFlagForm = [true];

          resumableObj.opts.query = {
            documentDetail: JSON.stringify(documentDetail)
          };
          //r.files.push(files);
          resumableObj.addFile($scope.imageResult);
          //vm.cgBusyLoading = GenericFileFactory.uploadGenericFiles(documentDetail, $scope.imageResult).then((response) => {
          //  vm.getDocuments(selectedFolderID);
          //  vm.genericDocument = [];
          //  vm.imageDet = null;
          //  vm.documentDescription = null;
          //  vm.documentName = null;
          //  vm.isShared = true;
          //  vm.isEdit = false;
          //  vm.closePreviewSidenav('Close');
          //}).catch((error) => {
          //  return BaseService.getErrorLog(error);
          //});
        }
      }

      function updateGenericFiles(versionModel) {
        selectedFolderID = vm.isHideDisplayTree ? null : selectedFolderID;
        if (Array.isArray(vm.Entity)) {
          vm.Entity = vm.Entity[0];
        }
        if (Array.isArray(vm.refTransID)) {
          vm.refTransID = vm.refTransID[0];
        }
        const documentDetail = {
          'gencFileID': vm.EditDocumentId,
          'description': vm.documentDescription,
          'refTransID': vm.refTransID,
          'entityID': vm.entityID,
          'gencFileOwnerType': vm.Entity,
          'originalname': $scope.image.name,
          // 'isShared': vm.isShared,
          'isShared': true,
          'fileGroupBy': vm.fileGroupBy,
          'refParentId': selectedFolderID,
          'fileSize': $scope.imageResult.size,
          'docInsideFolderName': $scope.docInsideFolderName,
          'tags': vm.docTags.length > 0 ? vm.docTags.join(',') : null
        };
        if (vm.isHideDisplayTree) {
          delete documentDetail['docInsideFolderName'];
        }

        let updateDocDataPromise = null;
        if ($scope.isImageFile) {
          updateDocDataPromise = GenericFileFactory.updateGenericFiles(documentDetail, $scope.imageResult);
        }
        else {
          updateDocDataPromise = GenericFileFactory.updateGenericFileDetails().save({ documentDetail: documentDetail }).$promise;
        }
        vm.cgBusyDocLoading = updateDocDataPromise.then(() => {
          vm.getDocuments(selectedFolderID);
          vm.saveDisable = false;
          vm.isEdit = false;
          vm.closePreviewSidenav('Close');
          /* refresh work order header conditionally */
          if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED &&
            !isWOHeaderDetailsAlreadyUpdated && ((entityName === woEntityName && versionModel && versionModel.woVersion)
              || (entityName === woOPEntityName && versionModel && versionModel.opVersion))) {
            refreshWorkOrderHeaderDetails();
          }

          // Send notification of change to all users
          if (!vm.isHideDisplayTree) {
            sendNotification(versionModel);
          }
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }

      $scope.image = {
        isEdit: false
      };
      $scope.isImageFile = false;
      $scope.shape = {
        rectangle: false,
        line: false,
        pencil: false,
        circle: false,
        arrow: false,
        text: false
      };
      $scope.action = {
        undo: false, redo: false
      };
      let img = new Image;
      $scope.ImageHisory = {
        undo: [],
        redo: []
      };
      let $canvas, ctx, myCanvas, offsetX, offsetY, mouseX, mouseY;
      //Canvas configuration
      const Init = () => {
        $scope.ImageHisory.undo = [];
        $scope.ImageHisory.redo = [];

        vm.iszoom = false;

        //Replaced old element with new same element and removed all events of it.
        const old_element = document.getElementById('my_canvas_id');
        if (old_element) {
          const new_element = old_element.cloneNode(true);
          old_element.parentNode.replaceChild(new_element, old_element);
          //Replaced old element with new same element and removed all events of it.

          $canvas = angular.element('#my_canvas_id');

          myCanvas = $canvas[0];
          ctx = myCanvas.getContext('2d');

          // style the context
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 3;
          const canvasDIV = document.getElementById('image-main-canvas');
          canvasDIV.style.borderColor = 'black';
          canvasDIV.style.borderStyle = 'solid';
          canvasDIV.style.borderWidth = '3px';
          // calculate where the canvas is on the window
          // (used to help calculate mouseX/mouseY)
          const canvasOffset = $canvas.offset();
          offsetX = canvasOffset.left;
          offsetY = canvasOffset.top;
          // listen for mouse events
          $canvas.mousedown((e) => {
            handleMouseDown(e);
          });
          $canvas.mousemove((e) => {
            handleMouseMove(e);
          });
          $canvas.mouseup((e) => {
            handleMouseUp(e);
          });
          $canvas.mouseout((e) => {
            handleMouseOut(e);
          });
          //assign image after select new
          img = new Image;
          img.onload = () => {
            ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height); // Or at whatever offset you like
            //ctx.drawImage(img, 0, 0, myCanvas.width, img.height);

            $scope.tiImageSrc = myCanvas.toDataURL();
          };
          img.src = $scope.image.src;
        }
      };

      // this flage is true when the user is dragging the mouse
      let isDown = false;
      // these vars will hold the starting mouse position
      let startX;
      let startY;

      const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // save the starting x/y of the rectangle
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);

        if ($scope.shape.pencil) {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
        }
        else if ($scope.shape.text) {
          removeTextEditor();
          if (angular.element('#canvasTextEditor').length === 0) {
            //let textLeft = startX > 200 ? 195 : (startX < 5 ? 5 : startX);
            //let textTop = startY > 240 ? 240 : (startY < 10 ? 10 : startY);

            //set dynamic x and y position of selected textArea
            const textLeft = startX ? startX + 100 > $scope.cWidth ? (startX - ((startX + 100) - $scope.cWidth)) : startX : startX;
            const textTop = startY ? startY + 50 > $scope.cHeight ? (startY - ((startY + 50) - $scope.cHeight)) : startY : startY;
            //let textLeft = startX ;
            //let textTop = startY;
            const textAreaWidth = 100;
            const textAreaHeight = 50;
            $scope.x = startX;
            $scope.y = startY;
            //let textAreaWidth =startX ? ((   $scope.cWidth - startX) < 90) ? ( $scope.cWidth - startX):100:100;
            //let textAreaHeight = startX ? (( $scope.cHeight - startY) < 40) ? ( $scope.cHeight - startY) : 50 : 50;
            const textArea = '<div id=\'canvasTextEditor\' style=\'position:absolute;top:' + textTop + 'px;left:' + textLeft + 'px;z-index:10;\'><textarea id=\'canvasTextArea\' style=\'width:' + textAreaWidth + 'px;height:' + textAreaHeight + 'px;\'></textarea>';
            angular.element('#image-main-canvas').append(textArea);
            $timeout(() => {
              angular.element('#canvasTextArea').focus();
            });
            manualSetFormDirty();
          }
        }

        // set a flag indicating the drag has begun
        isDown = true;
      };

      const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isDown) {
          updateImage();
        }
        // the drag is over, clear the dragging flag
        isDown = false;
      };

      const handleMouseOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener('click', (e) => {
          //if any editing process is continue and mouse relese outside the canvas then update image else return.
          if (vm.isEdit && isDown && e.currentTarget.nodeName !== '#CANVAS') {
            updateImage();
            // the drag is over, clear the dragging flag
            isDown = false;
          } else {
            return;
          }
        });
      };

      const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // if we're not dragging, just return
        if (!isDown) {
          return;
        }

        // get the current mouse position
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // Put your mousemove stuff here

        if ($scope.shape.rectangle) {
          // clear the canvas
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
          // calculate the rectangle width/height based
          // on starting vs current mouse position
          const width = mouseX - startX;
          const height = mouseY - startY;

          // draw a new rect from the start position
          // to the current mouse position
          ctx.strokeRect(startX, startY, width, height);
        }
        else if ($scope.shape.line) {
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
        else if ($scope.shape.pencil) {
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
        else if ($scope.shape.arrow) {
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
          const headlen = 10;   // length of head in pixels
          const angle = Math.atan2(mouseY - startY, mouseX - startX);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(mouseX, mouseY);
          ctx.lineTo(mouseX - headlen * Math.cos(angle - Math.PI / 6), mouseY - headlen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(mouseX - headlen * Math.cos(angle + Math.PI / 6), mouseY - headlen * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
      };

      function updateImage() {
        const textDet = angular.element('#canvasTextArea');
        if ($scope.shape.rectangle || $scope.shape.line || $scope.shape.pencil || $scope.shape.circle || $scope.shape.arrow || ($scope.shape.text && textDet.val() && textDet.val().trim())) {
          $scope.action.undo = false;
          $scope.action.redo = false;
          const dataURL = myCanvas.toDataURL();
          img.src = dataURL;
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
          if ($scope.ImageHisory.undo.length === 11) {
            $scope.ImageHisory.undo.splice(0, 1);
            $scope.lastUndoImg = _.first($scope.ImageHisory.undo);
          }

          $scope.ImageHisory.undo.push(img.src);
          $scope.ImageHisory.undo = _.uniq($scope.ImageHisory.undo);
          $scope.$applyAsync();
          //console.log($scope.ImageHisory.undo.length);
          manualSetFormDirty();
        }
      }

      vm.getDocumentTypes = function () {
        vm.SearchAddedListLocation = null;
        vm.SearchNoAddedListLocation = null;
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.DocumentType.Name);
        const listObj = {
          GencCategoryType: GencCategoryType,
          isActive: false
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.FileGroup = res.data;
            addInActiveDocumentTypeOnEdit();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getDocumentTypes();

      // In Edit case fetch 'FileGroupby' is isActive or not As we display Active Document Type only
      function addInActiveDocumentTypeOnEdit() {
        if (vm.fileGroupBy && vm.fileGroupName) {
          const isExistType = vm.FileGroup.some((file) => file.gencCategoryID === Number(vm.fileGroupBy));
          if (!isExistType) {
            if (Array.isArray(vm.FileGroup)) {
              const documentType = {
                gencCategoryID: vm.fileGroupBy,
                gencCategoryName: vm.fileGroupName,
                isActive: false
              };
              vm.FileGroup.push(documentType);
            }
          }
        }
      }

      //Edit document
      vm.editDocument = ($index, options, detail) => {
        vm.searchText = '';
        if (detail && vm.DisableUpdateButton(detail)) {
          return;
        }
        // $scope.disableDIV = false;
        vm.isEdit = true;
        vm.isView = vm.ispicture = vm.isVideoFile = vm.isAudioFile = false;
        vm.isopenSidebar = true;
        const doc = vm.folderDocumentList[$index];
        $scope.image.src = null;
        vm.documentDetail = doc;
        // e.preventDefault();
        //e.stopPropagation();

        if (doc) {
          vm.docTags = doc.tags ? doc.tags.split(',') : [];
          vm.docTagReadOnly = false;
          vm.EditDocumentId = doc.gencFileID;
          vm.documentDescription = doc.gencFileDescriptiongencFileID;
          // vm.isShared = doc.isShared == '1' ? true : false;
          vm.isShared = true;

          vm.fileGroupBy = doc.fileGroupBy;
          vm.fileGroupName = doc.fileGroupName;

          addInActiveDocumentTypeOnEdit();

          vm.documentName = doc.gencOriginalName;
          $scope.image.name = doc.gencOriginalName;
          if (doc.gencFileType.indexOf('image/') !== -1) {
            $scope.isImageFile = true;
            if (doc.gencFileOwnerType && (doc.gencFileOwnerType === vm.allentity.Workorder.Name
              || doc.gencFileOwnerType === vm.allentity.Workorder_operation.Name
              || doc.gencFileOwnerType === vm.allentity.ECORequest.Name
              || doc.gencFileOwnerType === vm.allentity.SalesOrder.Name
              || doc.gencFileOwnerType === vm.allentity.Component_sid_stock.Name)) {
              eventAction = allEventAction.GENERICFILE_EDIT;
            }

            const downloadDocObj = {
              gencFileID: doc.gencFileID,
              eventAction: eventAction,
              docInsideFolderName: $scope.docInsideFolderName
            };
            if (vm.isHideDisplayTree) {
              delete downloadDocObj['docInsideFolderName'];
            }
            vm.cgBusyLoading = GenericFileFactory.downloadDocument(downloadDocObj).then((response) => {
              var model = {
                messageContent: '',
                multiple: true
              };
              if (response.status === 404) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
                DialogFactory.messageAlertDialog(model);
              } else if (response.status === 403) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
                DialogFactory.messageAlertDialog(model);
              } else if (response.status === 401) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
                DialogFactory.messageAlertDialog(model);
              }
              else {
                const blob = new Blob([response.data], {
                  type: doc.gencFileType
                });
                const reader = new window.FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  $timeout(() => {
                    $scope.image.src = reader.result;
                    $scope.image.isEdit = true;
                    resetImageFromZoom();
                    $timeout(() => {
                      vm.cgBusyLoading = Init();
                    }, _configTimeout);
                  });
                };

                const isOpenSidebar = options && (typeof (options) === 'object') ? options.isOpenSidebar : true;
                if (isOpenSidebar) { vm.opensidebar(); }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            $scope.image = {
              isEdit: false
            };
            $scope.imageResult = doc;
            $scope.isImageFile = false;
            const isOpenSidebar = options && (typeof (options) === 'object') ? options.isOpenSidebar : true;
            if (isOpenSidebar) { vm.opensidebar(); }
          }

          getNextImgIndex($index, $scope);
          getPreviousImgIndex($index, $scope);
        }
      };
      //set shared document
      vm.SetShared = (doc) => {
        vm.cgBusyLoading = GenericFileFactory.setAsShared().query({ gencFileID: doc.gencFileID }).$promise.then(() => {
          vm.getDocuments();
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //Download Document
      vm.downloadDocument = (doc) => {
        if (doc.gencFileOwnerType && (doc.gencFileOwnerType === vm.allentity.Workorder.Name
          || doc.gencFileOwnerType === vm.allentity.Workorder_operation.Name
          || doc.gencFileOwnerType === vm.allentity.ECORequest.Name
          || doc.gencFileOwnerType === vm.allentity.SalesOrder.Name
          || doc.gencFileOwnerType === vm.allentity.Component_sid_stock.Name)) {
          eventAction = allEventAction.GENERICFILE_DOWNLOAD;
        }

        const downloadDocObj = {
          gencFileID: doc.gencFileID,
          eventAction: eventAction,
          docInsideFolderName: $scope.docInsideFolderName
        };
        if (vm.isHideDisplayTree) {
          delete downloadDocObj['docInsideFolderName'];
        }
        vm.cgBusyLoading = GenericFileFactory.downloadDocument(downloadDocObj).then((response) => {
          var model = {
            messageContent: '',
            multiple: true
          };
          if (response.status === 404) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 403) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 401) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
            DialogFactory.messageAlertDialog(model);
          }
          else {
            const blob = new Blob([response.data], {
              type: doc.gencFileType
            });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, doc.gencOriginalName);
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', doc.gencOriginalName);
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //View/Preview Document
      vm.viewDocument = ($index, options) => {
        vm.isView = true;
        vm.isEdit = vm.ispicture = vm.isVideoFile = $scope.isImageFile = vm.isAudioFile = vm.isPDFFile = false;
        const doc = vm.folderDocumentList[$index];
        vm.fileGroupBy = doc.fileGroupBy;
        vm.documentDetail = doc;
        vm.isopenSidebar = true;
        if (doc) {
          //doc.documentPath = `${_configWebUrl}${USER.GENERICFILE_BASE_PATH}${doc.gencFileOwnerType}/${doc.gencFileName}`;
          vm.docTags = doc.tags ? doc.tags.split(',') : [];
          vm.docTagReadOnly = true;
          vm.documentDescription = doc.gencFileDescriptiongencFileID;
          vm.documentName = doc.gencOriginalName;
          $scope.image.name = doc.gencOriginalName;
          if (doc.gencFileOwnerType && (doc.gencFileOwnerType === vm.allentity.Workorder.Name
            || doc.gencFileOwnerType === vm.allentity.Workorder_operation.Name
            || doc.gencFileOwnerType === vm.allentity.ECORequest.Name
            || doc.gencFileOwnerType === vm.allentity.SalesOrder.Name
            || doc.gencFileOwnerType === vm.allentity.Component_sid_stock.Name)) {
            eventAction = allEventAction.GENERICFILE_PREVIEW;
          }

          if (doc.gencFileType.indexOf('image/') !== -1) {
            $scope.isImageFile = true;

            const downloadDocObj = {
              gencFileID: doc.gencFileID,
              eventAction: eventAction,
              docInsideFolderName: $scope.docInsideFolderName
            };
            if (vm.isHideDisplayTree) {
              delete downloadDocObj['docInsideFolderName'];
            }
            vm.cgBusyLoading = GenericFileFactory.downloadDocument(downloadDocObj).then((response) => {
              var model = {
                messageContent: '',
                multiple: true
              };
              if (response.status === 404) {
                $scope.image.src = null;
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
                DialogFactory.messageAlertDialog(model);
                getNextImgIndex($index, $scope);
                getPreviousImgIndex($index, $scope);
              } else if (response.status === 403) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
                DialogFactory.messageAlertDialog(model);
              } else if (response.status === 401) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
                DialogFactory.messageAlertDialog(model);
              }
              else {
                //let blob = new Blob([response.data], { type: item.gencFileType });
                //item.url = URL.createObjectURL(blob);
                const blob = new Blob([response.data], {
                  type: doc.gencFileType
                });
                //vm.url = URL.createObjectURL(blob);
                const reader = new window.FileReader();
                reader.readAsDataURL(blob);
                $scope.image.src = null;
                reader.onloadend = () => {
                  $timeout(() => {
                    $scope.image.src = reader.result;
                    $scope.image.isEdit = true;
                    $timeout(() => {
                      //if (!vm.captureImageViewer) {
                      //  vm.captureImageViewer = ImageViewer('#captureImg', {
                      //    snapView: false
                      //  });
                      //}
                      vm.captureImageViewer = ImageViewer('#captureImg', {
                        snapView: false
                      });

                      $('.md-sidenav-right').find('.iv-container').addClass('cm-iv-image-wrap');
                      vm.captureImageViewer.refresh();
                    });
                    //$timeout(() => {
                    //    Init();
                    //}, _configTimeout);
                  });
                };
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else if (doc.gencFileType.indexOf('video/') !== -1) {
            vm.isVideoFile = true;
            //var source = video.multiSource();
            //source.addSource('mp4', doc.documentPath);
            //source.addSource('ogg', doc.documentPath);
            //source.save();
            //if ($scope.docInsideFolderName && (doc.gencFileOwnerType == vm.allentity.Workorder.Name
            //  || doc.gencFileOwnerType == vm.allentity.Workorder_operation.Name)) {
            //  doc.documentPath = `${_configWebUrl}${USER.GENERICFILE_BASE_PATH}${doc.gencFileOwnerType}/${$scope.docInsideFolderName}/${doc.gencFileName
            //    }`;
            //}
            vm.vidpath = doc.documentPath;
          }
          else if (doc.gencFileType.indexOf('audio/') !== -1) {
            vm.isAudioFile = true;
            if ($scope.docInsideFolderName && (doc.gencFileOwnerType === vm.allentity.Workorder.Name
              || doc.gencFileOwnerType === vm.allentity.Workorder_operation.Name)) {
              doc.documentPath = `${_configWebUrl}${USER.GENERICFILE_BASE_PATH}${doc.gencFileOwnerType}/${$scope.docInsideFolderName}/${doc.gencFileName
                }`;
            }
            vm.audioFile = doc.documentPath;
          }
          else if (doc.gencFileType.indexOf('/pdf') !== -1) {
            vm.isPDFFile = true;
            $scope.image = {
              isEdit: false
            };
            $scope.imageResult = doc;
            doc.url = doc.documentIcon;
            const downloadDocObj = {
              gencFileID: doc.gencFileID
            };
            vm.cgBusyLoading = GenericFileFactory.downloadDocument(downloadDocObj).then((response) => {
              var model = {
                messageContent: '',
                multiple: true
              };
              if (response.status === 404) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
                DialogFactory.messageAlertDialog(model);
              } else if (response.status === 403) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
                DialogFactory.messageAlertDialog(model);
              } else if (response.status === 401) {
                model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
                DialogFactory.messageAlertDialog(model);
              }
              else {
                vm.file = doc;
                vm.file.arrayData = response.data;
                const url = `${vm.file.documentPath}`;
                vm.file.docURL = $sce.trustAsResourceUrl(url);
                BaseService.setBrowserTabTitleManually(); // to set browser tab title manually
              }
            }).catch((error) => BaseService.getErrorLog(error));

            if (!vm.isHideDisplayTree && eventAction) {
              GenericFileFactory.addTimelineLogForViewGenericFileOtherThanImage(doc.gencFileID, eventAction).then(() => {
                // Block of Success Section
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
          getNextImgIndex($index, $scope);
          getPreviousImgIndex($index, $scope);
        }

        const isOpenSidebar = options && (typeof (options) === 'object') ? options.isOpenSidebar : true;
        if (isOpenSidebar) {
          vm.opensidebar();
        }
      };

      vm.zoomIn = (viewer) => {
        if (vm[viewer]) {
          const zoomValue = vm[viewer].zoomValue + 50;
          vm[viewer].zoom(zoomValue);
        }
      };

      vm.zoomOut = (viewer) => {
        if (vm[viewer]) {
          const zoomValue = vm[viewer].zoomValue - 50;
          vm[viewer].zoom(zoomValue);
        }
      };

      vm.resetCaptureImage = () => {
        if (vm.captureImageViewer) {
          vm.captureImageViewer.refresh();
        }
      };

      // -------------------- [S] - Section for view/edit 'Next/Previous' Image -----------------------------
      vm.viewNextPreviousImage = (index) => {
        if (vm.isEdit) {
          viewNextPreviousImgInEdit(index);
        }
        else {
          vm.viewDocument(index, { isOpenSidebar: false });
        }
      };

      function viewNextPreviousImgInEdit(index) {
        const obj = {
          isChangeImage: true,
          index: index
        };

        var isdirty = vm.checkFormDirty(vm.documentForm);
        if (isdirty || $scope.ImageHisory.undo.length > 0) {
          showWithoutSavingAlertForPopUp(obj);
        } else {
          img.src = null;
          myCanvas = document.getElementById('my_canvas_id');
          if (myCanvas) {
            ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          }
          vm.editDocument(index, { isOpenSidebar: false }, null);
        }
      }

      function getNextImgIndex(currentIndex) {
        var index = currentIndex + 1;
        var currentDoc = vm.folderDocumentList[index];
        if (!currentDoc) {
          vm.previewIndex.nextIndex = null;
        }
        else {
          if (!currentDoc.isFolder) {
            vm.previewIndex.nextIndex = index;
          }
          else {
            vm.previewIndex.nextIndex = getNextImgIndex(index);
          }
        }
        return vm.previewIndex.nextIndex;
      }
      function getPreviousImgIndex(currentIndex) {
        var index = currentIndex - 1;
        var currentDoc = vm.folderDocumentList[index];
        if (!currentDoc) {
          vm.previewIndex.previousIndex = null;
        }
        else {
          if (!currentDoc.isFolder) {
            vm.previewIndex.previousIndex = index;
          }
          else {
            vm.previewIndex.previousIndex = getPreviousImgIndex(index);
          }
        }
        return vm.previewIndex.previousIndex;
      }
      // -------------------- [E] - Section for view/edit 'Next/Previous' Image -----------------------------

      vm.opensidebar = () => {
        //$scope.disableDIV = false;
        //vm.fileGroupBy = null;
        /* Only for picture station when open pop-up of upload file then set z-index picture station screen - Ritul */
        if (vm.isopenSidebar) {
          const findPictureStationId = document.getElementById('PictureStationController');
          if (findPictureStationId) {
            const pictureStationDiv = document.getElementsByClassName('cm-bill-to-tab-split-pane-height');
            if (pictureStationDiv && pictureStationDiv.length > 0) {
              pictureStationDiv[0].setAttribute('style', 'z-index: 99;');
            }
          } else {
            const pictureStationDiv = document.getElementsByClassName('cm-bill-to-tab-split-pane-height');
            if (pictureStationDiv && pictureStationDiv.length > 0) {
              pictureStationDiv[0].setAttribute('style', 'z-index: 0;');
            }
          }
        }
        /* End */
        $mdSidenav(vm.sideName)
          .toggle()
          .then(() => {
            vm.saveDisable = false;
            $scope.disableDIV = $mdSidenav(vm.sideName).isOpen() ? false : true;
            $log.debug('toggle ' + vm.sideName + ' is done');

            BaseService.currentPageForms = [vm.documentForm];
            // if any file added then set form dirty
            if (vm.documentForm && vm.documentForm.genericFiles) {
              vm.documentForm.$setDirty();
              vm.documentForm.genericFiles.$setDirty();
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
      };
      vm.checkFormDirty = (form, columnName) => {
        const checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      };
      $rootScope.$on('genericDoc', () => {
        vm.genericDocument = [];
      });
      //Close Sidenav
      vm.closePreviewSidenav = (data) => {
        const obj = {
          path: vm.vidpath = vm.audioFile = null,
          div: $scope.disableDIV = true,
          sideBar: vm.isopenSidebar = false,
          genericDoc: vm.genericDocument,
          sideName: vm.sideName,
          form: vm.documentForm
        };
        let isdirty = false;
        if (!data && !vm.isEdit) {
          isdirty = vm.checkFormDirty(vm.documentForm);
          if (isdirty) {
            showWithoutSavingAlertForPopUp(obj);
          } else {
            vm.beforeClose();
          }
        } else {
          if (vm.isEdit) {
            isdirty = vm.checkFormDirty(vm.documentForm);
            if (isdirty || $scope.ImageHisory.undo.length > 0) {
              showWithoutSavingAlertForPopUp(obj);
            } else {
              $scope.clear();
              img.src = null;
              $scope.image.src = null;
              myCanvas = document.getElementById('my_canvas_id');
              if (myCanvas) {
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
              }
              vm.beforeClose();
            }
          } else {
            vm.beforeClose();
          }
        }
      };

      vm.beforeClose = () => {
        vm.vidpath = vm.audioFile = null;
        $scope.disableDIV = true;
        vm.isopenSidebar = false;
        vm.genericDocument = [];
        vm.documentForm.$setPristine();
        vm.isAudioFile = vm.isVideoFile = vm.isPDFFile = false;
        vm.docTagReadOnly = false;
        vm.docTags = [];
        $mdSidenav(vm.sideName).close()
          .then(() => {
            $log.debug('close RIGHT is done');
            if (!vm.isopenSidebar) {
              /* Only for picture station when close pop-up of upload file then z-index of remove of picture station screen - Ritul */
              const findPictureStationId = document.getElementById('PictureStationController');
              if (findPictureStationId) {
                const pictureStationDiv = document.getElementsByClassName('cm-bill-to-tab-split-pane-height');
                if (pictureStationDiv && pictureStationDiv.length > 0) {
                  pictureStationDiv[0].setAttribute('style', 'z-index: 0;');
                }
              } else {
                const pictureStationDiv = document.getElementsByClassName('cm-bill-to-tab-split-pane-height');
                if (pictureStationDiv && pictureStationDiv.length > 0) {
                  pictureStationDiv[0].setAttribute('style', 'z-index: 0;');
                }
              }
              /* End */
            }
          });
      };

      vm.isOpenRight = function () {
        return $mdSidenav(vm.sideName).isOpen();
      };

      $scope.cropImage = () => {
        isDown = false;
        resetImageFromZoom();
        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        let finaldataURL = myCanvas.toDataURL();
        if ($scope.ImageHisory.undo.length === 0) {
          finaldataURL = $scope.image.src;
        }
        if (!event) {
          event = angular.element.Event('click');
          angular.element('body').trigger(event);
        }
        const file = Upload.dataUrltoBlob(finaldataURL, $scope.image.name);
        if (file) {
          DialogFactory.dialogService(
            USER.IMAGE_CROP_CONTROLLER,
            USER.IMAGE_CROP_VIEW,
            event,
            file).then((res) => {
              img = new Image;
              img.onload = () => {
                ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
              };
              img.src = res.croppedImage;
              //add cropped image in ImageHisory.undo array
              if ($scope.ImageHisory.undo.length === 11) {
                $scope.ImageHisory.undo.splice(0, 1);
                $scope.lastUndoImg = _.first($scope.ImageHisory.undo);
              }
              $scope.ImageHisory.undo.push(img.src);
              $scope.ImageHisory.undo = _.uniq($scope.ImageHisory.undo);
              $scope.$applyAsync();
              manualSetFormDirty();
            }, () => {
              // Error Block
            });
        }
      };

      $scope.drawRectangle = () => {
        resetImageFromZoom();

        $scope.shape.pencil = false;
        $scope.shape.line = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        $scope.shape.text = false;
        $scope.shape.rectangle = true;
      };

      $scope.drawLine = () => {
        resetImageFromZoom();

        $scope.shape.rectangle = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        $scope.shape.text = false;
        $scope.shape.line = true;
      };

      $scope.drawPencil = () => {
        resetImageFromZoom();

        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        $scope.shape.text = false;
        $scope.shape.pencil = true;
      };

      $scope.drawCircle = () => {
        resetImageFromZoom();

        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        $scope.shape.text = false;
        $scope.shape.circle = true;
      };

      $scope.drawArrow = () => {
        resetImageFromZoom();

        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        removeTextEditor();
        $scope.shape.text = false;
        $scope.shape.arrow = true;
      };

      $scope.drawText = () => {
        resetImageFromZoom();

        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        $scope.shape.text = true;
      };
      $scope.finish = () => {
        resetImageFromZoom();
        isDown = false;

        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        const finaldataURL = myCanvas.toDataURL();
        $scope.image.src = finaldataURL;
        $scope.image.isEdit = false;
        //console.log(myCanvas.toDataURL());
        $scope.imageResult = Upload.dataUrltoBlob(finaldataURL, $scope.image.name);
        $scope.ImageHisory.undo = [];
        $scope.ImageHisory.redo = [];
        $scope.imageResult.name = $scope.image.name;
      };

      $scope.undo = () => {
        //if (!$scope.action.undo) {
        //    var redo = $scope.ImageHisory.undo.pop();
        //    $scope.ImageHisory.redo.push(redo);
        //}
        resetImageFromZoom();

        $scope.action.redo = false;
        $scope.action.undo = true;
        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        removeTextEditor();
        const dataURL = $scope.ImageHisory.undo.pop();
        if (dataURL === undefined) {
          img.src = $scope.lastUndoImg ? $scope.lastUndoImg : $scope.image.src;
          $scope.ImageHisory.redo.push(dataURL);
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
        }
        else {
          let src = null;
          $scope.ImageHisory.redo.push(dataURL);
          if ($scope.ImageHisory.undo.length === 1 && $scope.lastUndoImg) {
            src = _.last($scope.ImageHisory.undo);
            $scope.ImageHisory.redo.push($scope.ImageHisory.undo.pop());
          } else {
            src = _.last($scope.ImageHisory.undo);
          }
          img.src = src ? src : $scope.image.src;
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
        }
        manualSetFormDirty();
      };
      //vm.previewDocuments = () => {
      //    vm.isopenSidebar = false;
      //}

      $scope.redo = () => {
        //if (!$scope.action.redo) {
        //    var undo = $scope.ImageHisory.redo.pop();
        //    $scope.ImageHisory.undo.push(undo);
        //}
        resetImageFromZoom();

        $scope.action.redo = true;
        $scope.action.undo = false;
        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;

        removeTextEditor();
        let dataURL = $scope.ImageHisory.redo.pop();
        if (dataURL) {
          $scope.ImageHisory.undo.push(dataURL);
          if (_.isEqual(dataURL, $scope.lastUndoImg)) {
            dataURL = $scope.ImageHisory.redo.pop();
            $scope.ImageHisory.undo.push(dataURL);
          }
          img.src = dataURL;
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
        } else {
          img.src = $scope.image.src;
          $scope.ImageHisory.undo.push(img.src);
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
        }
        manualSetFormDirty();
      };

      $scope.clear = () => {
        $scope.shape.rectangle = false;
        $scope.shape.line = false;
        $scope.shape.pencil = false;
        $scope.shape.circle = false;
        $scope.shape.arrow = false;
        resetImageFromZoom();
        removeTextEditor();
        if ($scope.tiImageSrc) {
          img.src = $scope.tiImageSrc;
          $scope.tiImageSrc = null;
        } else {
          img.src = $scope.image.src;
        }
        if (myCanvas) {
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
          ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
        }
        // to clear all not applied changes
        _.each($scope.ImageHisory.undo, () => {
          $scope.undo();
        });
        $scope.ImageHisory.undo = [];
        $scope.ImageHisory.redo = [];
      };

      // Reset Canvas on Move from "Zoom" functionality to Other operation
      function resetImageFromZoom() {
        if (vm.iszoom) {
          $('.iv-container').removeClass('cm-iv-image-wrap');
          vm.iszoom = false;
          $timeout(() => {
            Init();
          });
        }
      }

      const removeTextEditor = () => {
        const textAreaOppup = angular.element('#canvasTextEditor');
        if (textAreaOppup.length > 0) {
          const textDet = angular.element('#canvasTextArea');
          if (textDet.val() && textDet.val().trim()) {
            ctx.font = '15px Comic Sans MS';
            ctx.fillStyle = 'red';
            const fontSize = '15';
            //wrapText(ctx,textDet.val(),$scope.x,60,25);

            //convert no of lines in textarea contents
            const lines = fragmentText(textDet.val(), textAreaOppup.position().left);
            lines.forEach((line, i) => {
              ctx.fillText(line, textAreaOppup.position().left, (textAreaOppup.position().top + ((i + 1) * parseInt(fontSize, 0))));
              //  ctx.fillText(line, textAreaOppup.position().left, (textAreaOppup.position().top + 10));
            });
            updateImage();
          }
          textAreaOppup.remove();
        }
      };

      //convert textarea content into num of lines
      function fragmentText(text, maxWidth) {
        var words = text.split(' '),
          lines = [],
          line = '';
        //if (ctx.measureText(text).width < maxWidth) {
        //    return [text];
        //}
        while (words.length > 0) {
          while (ctx.measureText(words[0]).width >= maxWidth) {
            const tmp = words[0];
            words[0] = tmp.slice(0, -1);
            if (words.length > 1) {
              words[1] = tmp.slice(-1) + words[1];
            } else {
              words.push(tmp.slice(-1));
            }
          }
          if (ctx.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + ' ';
          } else {
            lines.push(line);
            line = '';
          }
          if (words.length === 0) {
            lines.push(line);
          }
        }
        return lines;
      }

      //vm.checkSidebar = () => {
      //    vm.isopenSidebar = vm.isopenSidebar ? false : vm.isopenSidebar;
      //}
      //functionality for zoom
      $scope.showEvent = 'show';
      $scope.hideEvent = 'hide';
      $scope.cropper = {
      };
      $scope.cropperProxy = 'cropper.first';
      $scope.options = {
        maximize: true,
        aspectRatio: 2 / 1,
        crop: false
      };
      $scope.zoom = () => {
        if (!vm.iszoom) {
          if ($scope.ImageHisory.undo.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.APPLY_DOCUMENT_CHANGES_ALERT_BODY_MESSAGE_ON_ZOOM);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then(() => {
              $scope.finish();
              $timeout(() => {
                zoomImage();
              });
            }, () => {
              $timeout(() => {
                zoomImage();
              });
            });
          } else {
            zoomImage();
          };;
        }
      };
      function zoomImage() {
        const finaldataURL = myCanvas.toDataURL();
        $scope.imageResult = Upload.dataUrltoBlob(finaldataURL, $scope.image.name);

        vm.iszoom = true;
        $timeout(() => {
          //if (!vm.captureImageViewer) {
          //  vm.captureImageViewer = ImageViewer('#captureImg', {
          //    snapView: false
          //  });
          //}
          vm.captureImageViewer = ImageViewer('#captureImg', {
            snapView: false
          });
          $('.md-sidenav-right').find('.iv-container').addClass('cm-iv-image-wrap');
          vm.captureImageViewer.refresh();
        });
      }
      vm.isImage = (file) => {
        const filename = file.name;
        const ext = filename.split('.').pop();
        $scope.fileObj = _.find(FileAllow, (file) => file.extension === '.' + ext);
        if (file.type.indexOf('image') > -1) {
          return true;
        }
        else {
          if (!$scope.fileObj) {
            file.icon = $scope.icon;
          }
          else {
            file.icon = $scope.fileObj.icon;
          }
          return false;
        }
      };

      // [S] Notification methods
      function sendNotification(versionModel) {
        if (versionModel) {
          let entityName = vm.Entity;
          if (angular.isArray(vm.Entity)) {
            entityName = vm.Entity[0];
            ReftypeID = vm.refTransID[0];
          }

          versionModel.employeeID = loginUserDetails.employee.id;
          if (entityName === woOPEntityName) {
            versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE;
          }
          else if (entityName === woEntityName) {
            versionModel.messageType = CORE.NOTIFICATION_MESSAGETYPE.WO_VERSION_CHANGE.TYPE;
          }

          NotificationSocketFactory.sendNotification().save(versionModel).$promise.then(() => {
            /* Success Section */
          }).catch(() => {
            /* Error Section  */
          });
        }
      }

      function openWOOPRevisionPopup(ReftypeID, callbackFn, event) {
        var model = {
          woOPID: ReftypeID
        };
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_CONTROLLER,
          WORKORDER.WORKORDER_OPERATION_REVISION_POPUP_VIEW,
          event,
          model).then((versionModel) => {
            callbackFn(versionModel);
          }, () => {
            callbackFn();
          });
      }

      function openWORevisionPopup(ReftypeID, callbackFn, event) {
        var model = {
          woID: ReftypeID
        };
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_REVISION_POPUP_CONTROLLER,
          WORKORDER.WORKORDER_REVISION_POPUP_VIEW,
          event,
          model).then((versionModel) => {
            callbackFn(versionModel);
          }, () => {
            callbackFn();
          });
      }
      // [E] Notification methods

      /* Start End Create Folder*/
      vm.folderCreated = (item, callbackFn, event) => {
        if (!event) {
          event = angular.element.Event('click');
          angular.element('body').trigger(event);
        }
        const model = {
          gencFolderName: item.name,
          refTransID: ReftypeID,
          entityID: vm.entityID,
          refParentId: item.parentId,
          roleId: item.roleId,
          gencFileOwnerType: entityName
        };
        DialogFactory.dialogService(
          CORE.FOLDER_ADD_MODAL_CONTROLLER,
          CORE.FOLDER_ADD_MODAL_VIEW,
          event,
          model).then((folderDetail) => {
            callbackFn(folderDetail);
            vm.FolderFileList.push({
              id: folderDetail.gencFolderID,
              isParent: false,
              isSelected: false,
              name: folderDetail.gencFolderName,
              parent: folderDetail.refParentId,
              selected: false,
              text: folderDetail.gencFolderName,
              type: 'folder',
              roleId: folderDetail.roleId
            });
            vm.getDocuments(folderDetail.gencFolderID);
          }, () => {
            callbackFn(null);     // Remove temp generated folder from file manager list
          });
      };
      /* End Create Folder*/

      /* Start Get Folder/Document List Base On Selected Folder || On Page where not display tree view we have to fetch all record by Entity*/
      vm.selectedFolder = (folderDetail) => {
        vm.selectedFileFolder = [];
        vm.isSelectAll = false;
        vm.selectedFolderFileRoleId = (folderDetail && typeof (folderDetail) === 'object') ? folderDetail.roleId : null;
        const parameterModel = {
          refParentId: selectedFolderID,
          refTransID: ReftypeID, // Single value
          entityId: vm.entityID, // Single value
          gencFileOwnerType: entityName,
          isTraveler: $scope.isTraveler ? true : false,
          fileGroupByIds: vm.fileGroupByIds ? (vm.fileGroupByIds.length > 0 ? vm.fileGroupByIds : null) : null,
          extraEntityListString: extraEntityListString || null,
          accessLevel: defaultLoginRoleDetOfUser.accessLevel
          //extraEntity: vm.extraEntity ? (vm.extraEntity.length > 0 ? vm.extraEntity : null) : null,
          //extraRefTransIds: vm.extraRefTransIds ? (vm.extraRefTransIds.length > 0 ? vm.extraRefTransIds : null) : null,
          //extraEntityIds: vm.extraEntityIds ? vm.extraEntityIds : null
        };
        let isHasFetchRecord = ((folderDetail && typeof (folderDetail) === 'object') && folderDetail.parent !== '#') ? true : false;
        vm.isMainRootFolderSelected = !isHasFetchRecord;
        if (vm.isHideDisplayTree) {
          parameterModel.refParentId = null;
          parameterModel.isTraveler = false;
          isHasFetchRecord = true;
          vm.isMainRootFolderSelected = false;
        }
        if (isHasFetchRecord) {
          const recycleData = {
            refTransID: ReftypeID,
            gencFileOwnerType: entityName,
            roleId: vm.selectedFolderFileRoleId
          };
          vm.cgBusyLoading = GenericFolderFactory.getRecycleBinListByRefTransID().query(recycleData).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.RecycleBinList && response.data.RecycleBinList.length >= 0) {
              vm.recycleCount = response.data.RecycleBinList.length;
            }
          }).catch((error) => BaseService.getErrorLog(error));
          selectedFolderID = (folderDetail && typeof (folderDetail) === 'object') ? folderDetail.id : selectedFolderID;
          vm.cgBusyLoading = GenericFolderFactory.retriveFolderListById().save(parameterModel).$promise.then((response) => {
            if (!vm.isHideDisplayTree) {
              setDocAccessRightsForRole(folderDetail.roleAccessLevel);
            }
            vm.rightSideFolderList = [];
            vm.folderDocumentList = [];
            vm.DocumentList = [];
            vm.isNoDocumentFound = true;
            if (response && response.data && Array.isArray(response.data.fileList) && response.data.fileList.length > 0) {
              _.each(response.data.fileList, (item) => {
                if (item.gencFolderID) {
                  let isExistNode = false;
                  if (vm.rightSideFolderList.length > 0) {
                    isExistNode = _.some(vm.rightSideFolderList, (folder) => folder.gencFolderID === item.gencFolderID);
                  }
                  if (!isExistNode) {
                    const folderModel = {
                      gencFolderID: item.gencFolderID,
                      gencFolderName: item.gencFolderName,
                      gencFileOwnerType: item.gencFileOwnerType,
                      refParentId: item.folderParentID,
                      refTransID: item.refTransID,
                      entityID: item.entityID,
                      modifiedBy: item.folderModifiedBy,
                      modifiedOn: item.folderCreatedAt,
                      refCopyGencFileOwnerType: item.refCopyGencFileOwnerType,
                      name: item.gencFolderName,
                      type: vm.FileFolder.FOLDER,
                      size: null,
                      isFolder: true,
                      isSelected: false,
                      roleId: item.roleId
                    };
                    folderModel.isDisableRenameFolder = vm.DisableRenameFolderButton(folderModel);
                    folderModel.isDisableMoveFileFolder = vm.DisableMoveFolderButton(folderModel);

                    if (folderModel && folderModel.modifiedOn) {
                      folderModel.modifiedOn = $filter('date')(new Date(folderModel.modifiedOn), vm.dateTimeDisplayFormat);
                    }
                    vm.rightSideFolderList.push(folderModel);
                    vm.folderDocumentList.push(folderModel);
                  }
                }
                if (item.gencFileID) {
                  let path = CORE.DISPLAY_DOCUMENT_ICON.OTHER;
                  //if ($scope.docInsideFolderName && (item.fileOwnerType == vm.allentity.Workorder.Name
                  //  || item.fileOwnerType == vm.allentity.Workorder_operation.Name)) {
                  //  item.documentPath = `${_configWebUrl}${USER.GENERICFILE_BASE_PATH}${item.fileOwnerType}/${$scope.docInsideFolderName}/${item.gencFileName}`;
                  //}
                  //else {
                  //item.documentPath = `${_configWebUrl}${USER.GENERICFILE_BASE_PATH}${item.fileOwnerType}/${item.gencFileName}`;
                  item.documentPath = `${_configWebUrl}${item.genFilePath}`;
                  //}

                  let tags = [];
                  if (item.tags) {
                    tags = item.tags.split(',');
                  }
                  const tagDetail = { displayTag: tags.slice(0, 3), extraTags: tags.slice(3, tags.length).join(', ').trim() || null };

                  const docModel = {
                    gencFileID: item.gencFileID,
                    gencFileName: item.gencFileName,
                    gencOriginalName: item.gencOriginalName,
                    gencFileDescriptiongencFileID: item.gencFileDescription,
                    gencFileExtension: item.gencFileExtension,
                    gencFileType: item.gencFileType,
                    tags: item.tags,
                    tagDetail: tagDetail,
                    isDefault: item.isDefault === 0 ? false : true,
                    refTransID: item.fileTransID,
                    entityID: item.fileEntityID,
                    gencFileOwnerType: item.fileOwnerType,
                    //isShared: item.isShared,
                    isShared: true,
                    fileGroupBy: item.fileGroupBy,
                    fileGroupName: item.fileGroupName,
                    refParentId: item.fileParentID,
                    modifiedBy: item.fileModifiedBy,
                    modifiedOn: item.fileCreatedAt,
                    isImage: item.isImage,
                    //isAllrights: true,
                    fileSize: item.fileSize,
                    isDisable: item.isDisable === '0' ? false : true,
                    disableBy: item.disableBy,
                    disableOn: item.disableOn,
                    refCopyGencFileOwnerType: item.refCopyGencFileOwnerType,
                    name: item.gencOriginalName,
                    type: item.gencFileType,
                    size: isNaN(item.fileSize) === true ? item.fileSize : Math.round(Number((item.fileSize / 1024))),
                    displaySize: isNaN(item.fileSize) === true ? item.fileSize : formatNumber(Math.round(Number(((item.fileSize / 1024) < 1 ? 1 : (item.fileSize / 1024))))),
                    sizeTooltip: isNaN(item.fileSize) === true ? item.fileSize : formatNumber(Number(((item.fileSize / (1024 * 1024))).toFixed(1))) + ' MB' + ' (' + formatNumber(item.fileSize) + ' bytes)',
                    isFolder: false,
                    isSelected: false,
                    documentPath: item.documentPath,
                    roleId: item.roleId
                  };
                  if (docModel.gencFileType.indexOf('/pdf') !== -1) {
                    docModel.isPDF = true;
                  }
                  if (docModel.gencFileType.indexOf('image/') !== -1) {
                    docModel.documentIcon = item.documentPath;
                    docModel.isImage = true;
                  } else {
                    docModel.isImage = false;
                    const ext = (/[.]/.exec(item.gencOriginalName)) ? /[^.]+$/.exec(item.gencOriginalName)[0] : null;
                    if (CORE.DOCUMENT_TYPE.indexOf(ext) !== -1) {
                      path = CORE.DISPLAY_DOCUMENT_ICON[ext.toUpperCase()];
                    }
                    docModel.documentIcon = path;
                  }

                  docModel.isVideoTypeFile = (docModel.gencFileType.indexOf('video/') !== -1);
                  docModel.isAudioTypeFile = (docModel.gencFileType.indexOf('audio/') !== -1);

                  if (docModel && docModel.modifiedOn) {
                    docModel.modifiedOn = $filter('date')(new Date(docModel.modifiedOn), vm.dateTimeDisplayFormat);
                  }
                  vm.DocumentList.push(docModel);
                  vm.folderDocumentList.push(docModel);
                }
              });
            }
            if (vm.folderDocumentList.length === 0) {
              vm.isNoDocumentFound = false;
              vm.emptyState = null;
            }
            // if (vm.isHideDisplayTree) {
            if (response && response.data && Array.isArray(response.data.totalFileCount) && response.data.totalFileCount.length > 0) {
              $scope.$emit('documentCount', response.data.totalFileCount[0]);
            } else {
              $scope.$emit('documentCount', vm.DocumentList.length);
            }
            // }
            if (vm.DocumentList && vm.DocumentList.length > 0) {
              vm.isNoDocumentFound = true;
              if (vm.isShowPicture) {
                vm.selectFile();
              }
            } else {
              vm.selectFile();
            }
            openUploadSideBar();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      /* End Get Folder/Document List Base On Selected Folder */

      /* Start Rename Folder */
      vm.folderRename = (item, callback) => {
        var model = {
          gencFolderName: item.Name,
          gencFolderID: item.id,
          gencFileOwnerType: item.gencFileOwnerType,
          refParentId: item.parent,
          refTransID: ReftypeID
        };
        vm.cgBusyLoading = GenericFolderFactory.renameFolder().save(model).$promise.then((res) => {
          callback(item, typeof (res) === 'object' ? res.errors : res);
          vm.refreshDocument();
        }).catch((error) => BaseService.getErrorLog(error));
      };
      /* End Rename Folder */

      /* Start Rename Folder From List View */
      vm.renameFolder = (folderId, detail) => {
        if (vm.DisableRenameFolderButton(detail)) {
          return;
        }
        selectedFolderID = folderId;
        //var selectedFolder = $("." + vm.doumentClass).jstree('get_selected');   // Getting selected folder
        $('.' + vm.doumentClass).jstree('edit', selectedFolderID);                // Set Folder into edit mode into left side treeview section
      };
      /* End Rename Folder From List View */

      vm.onTreeLoaded = (folderDetail) => {
        //if nothing selected than select default will call and get object of default
        if (!selectedFolderID && folderDetail && folderDetail.id) {
          selectedFolderID = folderDetail.id;
        }

        // this is local selectedFolderID instance while - delete, create, move, rename
        if (selectedFolderID && selectedFolderID > 0) {
          $('.' + vm.doumentClass).jstree('deselect_all', true);
          $('.' + vm.doumentClass).jstree('select_node', selectedFolderID);
        } else {
          const selectedFolder = $('.' + vm.doumentClass).jstree('get_selected');
          if (selectedFolder.length > 0) {
            selectedFolderID = selectedFolder[0];
          } else {
            selectedFolderID = null;
          }
        }
      };

      /* Start Move Document/Folder to Other*/
      vm.moveFolderFile = (detail, isFolder, event) => {
        if (isFolder) {
          if (vm.DisableMoveFolderButton(detail)) {
            return;
          }
        }
        else {
          if (vm.DisableMoveDocumentButton(detail)) {
            return;
          }
        }

        if (!event) {
          event = angular.element.Event('click');
          angular.element('body').trigger(event);
        }
        let folderId = null;
        const model = {
          refTransID: ReftypeID,
          entityID: vm.entityID,
          accessLevel: defaultLoginRoleDetOfUser.accessLevel,
          gencFileOwnerType: entityName,
          //isFolder: isFolder,
          isProtected: vm.isProtected,
          ReftypeID: ReftypeID,
          selectedSourceFolderIDs: [],
          selectedSourceFileIDs: [],
          refParentId: null,
          isAllowedToAddNewFolder: (vm.isProtected || vm.isWOUnderTermination) ? false : true
        };
        if (detail) {  // single single move
          if (isFolder) {
            folderId = detail.id ? detail.id : detail.gencFolderID;
            const folderParentId = detail.id ? detail.parent : detail.refParentId;

            //model.gencFolderID = folderId;
            model.refParentId = folderParentId;
            //model.children = detail.children;
            model.gencFileFolderName = detail.gencFolderName;
            model.selectedSourceFolderIDs = [folderId];
            model.selectedSourceFileIDs = [];
          }
          else {
            model.refParentId = detail.refParentId;
            //model.gencFileID = detail.gencFileID;
            //model.gencFileFolderName = detail.gencOriginalName;
            model.selectedSourceFolderIDs = [];
            model.selectedSourceFileIDs = [detail.gencFileID];
          }
        }
        else { // multiple move
          const selectedFolders = vm.selectedFileFolder.filter((x) => x.isFolder === true);
          const selectedFiles = vm.selectedFileFolder.filter((x) => x.isFolder === false);
          if (selectedFolders && selectedFolders.length > 0) {
            model.selectedSourceFolderIDs = _.map(selectedFolders, 'id');
            const selectedFolderDet = _.find(vm.folderDocumentList, (item) => item.gencFolderID === selectedFolders[0].id);
            if (selectedFolderDet) {
              model.refParentId = selectedFolderDet.refParentId;
            }
            else {
              return;
            }
          }
          if (selectedFiles && selectedFiles.length > 0) {
            model.selectedSourceFileIDs = _.map(selectedFiles, 'id');
            const selectedFileDet = _.find(vm.folderDocumentList, (item) => item.gencFileID === selectedFiles[0].id);
            if (selectedFileDet) {
              model.refParentId = selectedFileDet.refParentId;
            }
            else {
              return;
            }
          }
        }

        //if (model.refParentId) { // to set for full path define in folder move auto complete
        //  let parentFolderOfSelectedFileFolder = _.find(vm.FolderFileList, (item) => {
        //    return item.id == model.refParentId;
        //  });
        //  if (parentFolderOfSelectedFileFolder) {
        //    model.parentFolderOfSelectedFileFolder = {
        //      gencFolderID: parentFolderOfSelectedFileFolder.id,
        //      gencFolderName: parentFolderOfSelectedFileFolder.name,
        //    }
        //  }
        //}

        DialogFactory.dialogService(
          CORE.MOVE_FILE_FOLDER_MODAL_CONTROLLER,
          CORE.MOVE_FILE_FOLDER_MODAL_VIEW,
          event,
          model).then((resp) => {
            //if (detail.isFolder) {
            //  var folder = _.find(vm.FolderFileList, function (item) {
            //    return item.id == model.gencFolderID
            //  });
            //  folder.parent = detail.refParentId;
            //  $scope.$broadcast('source', vm.FolderFileList);
            //}
            if (resp) {
              vm.getDocuments(folderId);
            }
          }, () => {
            //$('.fjt-jstree').jstree('deselect_all', true);
            //$('.fjt-jstree').jstree('select_node', model.refParentId);
          });
      };
      /* End Move Document/Folder to Other*/

      // move selected folder/files
      vm.moveMultipleFolderFile = () => {
        if (vm.isReadOnly || !vm.selectedFileFolder.length || vm.isDisableToAccess) {
          return;
        }
        vm.moveFolderFile(null, null, null);
      };

      vm.fileTypeChange = () => {
        vm.documentForm.rbFileType.$setDirty(true);
      };
      vm.changeShared = () => {
        vm.documentForm.isShared.$setDirty(true);
      };

      // on select folder select menu from tree
      vm.selectFolder = (folder) => {
        if (folder) {
          selectedFolderID = parseInt(folder.gencFolderID);

          $('.' + vm.doumentClass).jstree('deselect_all', true);
          // get details of files and folder inside selected
          $('.' + vm.doumentClass).jstree('select_node', folder.gencFolderID);
        }
      };
      $scope.$on('roleIdFromPictureStation', (evt, data) => {
        const selectedFolderDetail = _.find(vm.FolderFileList, (item) => item.roleId === data);
        if (selectedFolderDetail && selectedFolderDetail.id) {
          vm.selectFolder({ gencFolderID: selectedFolderDetail.id });
        }
      });

      //select row for document and show default image in capture
      vm.selectFile = (file, $index) => {
        vm.selected = file ? file : vm.folderDocumentList[vm.folderDocumentList.length - 1];
        if (vm.isShowPicture) {
          const currentIndex = Number.isInteger($index) ? $index : (vm.folderDocumentList.length - 1);
          const detailObj = {
            fileDetail: vm.selected,
            nextImageIndex: getNextImgIndex(currentIndex, $scope),
            previousImageIndex: getPreviousImgIndex(currentIndex, $scope)
          };
          $scope.$emit('documentSelect', detailObj);
        } else {
          $scope.$emit('documentSelect', null);
        }
      };

      $scope.$on('viewNextPreviousImage', (event, data) => {
        if (Number.isInteger(data)) {
          const fileDetail = vm.folderDocumentList[data];
          if (fileDetail) {
            vm.selectFile(fileDetail, data);
          }
        }
      });

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      /* refresh work order header */
      const refreshWorkOrderHeaderDetails = () => {
        isWOHeaderDetailsAlreadyUpdated = true;
        $timeout(() => {
          $scope.$emit('refreshWorkOrderHeaderDetails', null);
        }, _configBreadCrumbTimeout);
      };

      /* Refresh Document type */
      vm.refreshDoctype = () => {
        vm.searchText = '';
        vm.getDocumentTypes();
      };

      /* open and set documents to sidebar from drag area */
      vm.opensidebarAndSetDocuments = (files, invalidFiles) => {
        if (isDisabledToAccessFunctionality() || $scope.IsRemove) {
          return;
        }
        vm.searchText = '';
        vm.fileGroupBy = null;
        if (Array.isArray(invalidFiles) && invalidFiles.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALLOW_FILE_TO_UPLOAD);
          const restrictedExtension = _.map(invalidFiles, (item) => item ? item.name.match(new RegExp('[^.]+$')) : item).join(',');
          messageContent.message = stringFormat(messageContent.message, restrictedExtension, `<a class='cursor-pointer md-default-theme' ng-click='dynamicAlertPopupFunction()'>Click here</a>`);

          if (Array.isArray(files) && files.length > 0) {
            const totalLength = invalidFiles.length + files.length;
            const selectedFilesMsg = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECTED_VALID_FILE.message, files.length, totalLength);
            messageContent.message = selectedFilesMsg + '<br />' + messageContent.message;
          }
          else {
            messageContent.message = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UPLOAD_UNSUPPORTED_FILE.message + '<br />' + messageContent.message;
          }

          const model = {
            messageContent: messageContent,
            openFileRestrictExtensionPopup: vm.openFileRestrictExtensionPopup
          };
          BaseService.dynamicAlertPopup(model);
        }
        if (vm.isProtected || vm.isWOUnderTermination) {
          return false;
        }
        setSelectedDocuments(files);
        if (files.length > 0 && !$mdSidenav(vm.sideName).isOpen()) {
          setSidebarOpen();
        }
      };

      vm.openFileRestrictExtensionPopup = (ev) => {
        DialogFactory.dialogService(
          USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_CONTROLLER,
          USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_VIEW,
          ev,
          null).then(() => { // empty block
          }, (err) => BaseService.getErrorLog(err));
      };

      /* set all selected document to drag-drop display area */
      const setSelectedDocuments = (file) => {
        //if (file.length > 0) {
        //  if (file[0].size > parseInt(Documentsize)) {
        //    var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DocumentSizeError_NotAllowed);
        //    var model = {
        //      messageContent: messageContent,
        //      multiple: true
        //    };
        //    DialogFactory.messageAlertDialog(model);
        //    return;
        //  }
        //}
        var messageContent;
        _.each(file, (objFile, index) => {
          if (!messageContent) {
            if (objFile.size > parseInt(Documentsize)) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DocumentSizeError_NotAllowed);
              messageContent.message = stringFormat(messageContent.message, formatBytes(Documentsize));
            }
            else if (objFile.name === CORE.Copy_Image_Name) {
              file[index] = new File([objFile], `${new Date().getTime()}.png`, {
                type: CORE.Copy_Image_Extension
              });
            }
          }
        });

        if (messageContent) {
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

        const requiredDet = {
          duplicateFilesList: []
        };
        _.each(file, (objFile) => {
          if (objFile.type === 'image/tiff') {
            const reader = new FileReader();
            reader.onload = function () {
              var arrayBuffer = this.result;
              try {
                const tiff = new Tiff({ buffer: arrayBuffer });
                const canvas = tiff.toCanvas();
                const finaldataURL = canvas.toDataURL();
                const blob = Upload.dataUrltoBlob(finaldataURL, objFile.name);
                const convertedFile = new File([blob], objFile.name, { type: objFile.type, lastModified: objFile.lastModifiedDate });
                setDocument([convertedFile], requiredDet);
              }
              catch (err) {
                console.log(err);
                setDocument([objFile], requiredDet);
              }
            };
            reader.readAsArrayBuffer(objFile);
          }
          else {
            setDocument([objFile], requiredDet);
          }
        });

        // display duplicate document message if any
        if (requiredDet && requiredDet.duplicateFilesList.length > 0) {
          displayDuplicateFileListForUpload(requiredDet);
        }
      };

      // display duplicate document message
      const displayDuplicateFileListForUpload = (requiredDet) => {
        const fileName = _.union(_.map(requiredDet.duplicateFilesList, 'name'));
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DOCUMENT_ALREADY_ADDED);
        messageContent.message = stringFormat(messageContent.message, '<b>' + fileName.join(', ') + '</b>');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      };

      function setDocument(file, requiredDet) {
        vm.genericDocument = vm.genericDocument || [];
        // const existsFiles = _.intersectionBy(vm.files, file, 'name');
        const existsFiles = _.intersectionBy(vm.DocumentList || [], file, 'name');
        const recentExistsFiles = _.intersectionBy(vm.genericDocument, file, 'name');

        const fileName = _.union(_.map(existsFiles, 'name'), _.map(recentExistsFiles, 'name'));
        if (existsFiles.length > 0 || recentExistsFiles.length > 0) {
          _.each(existsFiles, (fileItem) => {
            requiredDet.duplicateFilesList.push(fileItem);
          });
          _.each(recentExistsFiles, (fileItem) => {
            requiredDet.duplicateFilesList.push(fileItem);
          });
        }

        file.forEach((objFile) => {
          if (_.indexOf(fileName, objFile.name) === -1) {
            objFile.progressPercentage = 0;
            vm.genericDocument.push(objFile);
          }
        });
        if (vm.genericDocument.length === 0) {
          vm.documentForm.rbFileType.$setDirty(true);
        }
        else if (vm.documentForm && vm.documentForm.genericFiles) {
          vm.documentForm.genericFiles.$setValidity('pattern', true);
        }
      }
      /* sidebar open */
      const setSidebarOpen = () => {
        if (!vm.isHideDisplayTree && !selectedFolderID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECET_FOLDER);
          DialogFactory.messageAlertDialog({
            messageContent: messageContent,
            multiple: true
          });
          return;
        }
        vm.isClickedPreview = true;
        vm.isView = vm.ispicture = vm.isEdit = $scope.isImageFile = vm.isAudioFile = vm.isVideoFile = vm.isPDFFile = false;
        vm.isEdit = false;
        vm.imageDet = null;
        vm.documentDescription = null;
        vm.documentName = null;
        vm.isShared = true;
        vm.genericFile.documentFiles = null;
        vm.isopenSidebar = true;
        $scope.disableDIV = false;
        vm.file.docURL = null;
        if (vm.docOpenType === 2) {
          const data = _.find(vm.FileGroup, (item) => item.gencCategoryName === CORE.FileGroup.Sample);
          vm.fileGroupBy = data.gencCategoryID;
        }
        vm.opensidebar();
      };

      /* alert popup added here instead of using common for using cancel button click */
      const showWithoutSavingAlertForPopUp = (data) => {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          if (data) {
            if (data.isRevisionPopup) {
              const model = {
                isCancelled: true
              };
              $mdDialog.hide(model);
            } else if (data.isChangeImage) {
              img.src = null;
              myCanvas = document.getElementById('my_canvas_id');
              if (myCanvas) {
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
              }
              //vm.beforeClose();
              vm.editDocument(data.index, { isOpenSidebar: false }, null);
            }
            else {
              //if it is document
              $mdSidenav(data.sideName).close()
                .then(() => {
                  $log.debug('close RIGHT is done');
                  if (!vm.isopenSidebar) {
                    /* Only for picture station when close pop-up of upload file then z-index of remove of picture station screen - Ritul */
                    const findPictureStationId = document.getElementById('PictureStationController');
                    if (findPictureStationId) {
                      const pictureStationDiv = document.getElementsByClassName('cm-bill-to-tab-split-pane-height');
                      if (pictureStationDiv && pictureStationDiv.length > 0) {
                        pictureStationDiv[0].setAttribute('style', 'z-index: 0;');
                      }
                    } else {
                      const pictureStationDiv = document.getElementsByClassName('cm-bill-to-tab-split-pane-height');
                      if (pictureStationDiv && pictureStationDiv.length > 0) {
                        pictureStationDiv[0].setAttribute('style', 'z-index: 0;');
                      }
                    }
                  }
                  /* End */
                  data.form.$setPristine();
                  data.form.$setUntouched();
                  $rootScope.$emit('genericDoc', data.genericDoc);
                });
            }
            if (vm.docOpenType === 2) { vm.isFileUploadComplete = true; }
          } else {
            $mdDialog.cancel();
          }
        }, () => {
          $scope.disableDIV = false;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const setDocAccessRightsForRole = (roleAccessLevelOfSelectedFolder) => {
        vm.isEditDocAllowed = vm.isDeleteDocAllowed = defaultLoginRoleDetOfUser ? (defaultLoginRoleDetOfUser.accessLevel <= roleAccessLevelOfSelectedFolder) : false;
        vm.isDisableDocActionAllowed = vm.isEditDocAllowed;
      };

      /* to disable document from access temporary */
      vm.disableDocument = (doc, event) => {
        if (vm.IsDisableDocumentButton()) {
          return;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ENABLE_DISABLE_DOCUMENT);
        messageContent.message = stringFormat(messageContent.message, doc.isDisable ? 'enable' : 'disable', doc.gencOriginalName);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            let entityName = vm.Entity;
            let ReftypeID = vm.refTransID;
            if (angular.isArray(vm.Entity)) {
              entityName = vm.Entity[0];
              ReftypeID = vm.refTransID[0];
            }

            // Display workorder operation revision popup
            if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED) {
              if (entityName === woOPEntityName) {
                isWOHeaderDetailsAlreadyUpdated = false;
                openWOOPRevisionPopup(ReftypeID, (versionModel) => {
                  // Added for close revision dialog popup
                  if (versionModel && versionModel.isCancelled) {
                    return;
                  }
                  enableDisableDocument(doc, versionModel);
                }, event);
              }
              else if (entityName === woEntityName) {
                isWOHeaderDetailsAlreadyUpdated = false;
                openWORevisionPopup(ReftypeID, (versionModel) => {
                  // Added for close revision dialog popup
                  if (versionModel && versionModel.isCancelled) {
                    return;
                  }
                  enableDisableDocument(doc, versionModel);
                }, event);
              }
              else {
                enableDisableDocument(doc);
              }
            }
            else {
              enableDisableDocument(doc);
            }
          }
        }, () => {
          // Success Block
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to disable document api call */
      function enableDisableDocument(doc, versionModel) {
        const enableDisableDocObj = {
          gencFileID: doc.gencFileID,
          oldValueOfIsDisable: doc.isDisable
        };
        vm.cgBusyLoading = GenericFileFactory.enableDisableGenericFile().save({
          enableDisableDocDet: enableDisableDocObj
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            const refParentId = vm.isHideDisplayTree ? null : doc.refParentId;
            vm.getDocuments(refParentId);

            /* refresh work order header conditionally */
            if (workorderDetails && workorderDetails.woStatus === CORE.WOSTATUS.PUBLISHED &&
              !isWOHeaderDetailsAlreadyUpdated && ((entityName === woEntityName && versionModel.woVersion)
                || (entityName === woOPEntityName && versionModel.opVersion))) {
              refreshWorkOrderHeaderDetails();
            }
            // Send notification of change to all users
            if (vm.isHideDisplayTree) {
              sendNotification(versionModel);
            }
          }
        }, (error) => BaseService.getErrorLog(error));
      }

      /* create new folder manually on button of "NEW FOLDER" */
      vm.createNewFolder = () => {
        if (isDisabledToAccessFunctionality()) {
          return;
        }
        const selected = $('.' + vm.doumentClass).jstree('get_selected', (true));
        if (selected) {
          $scope.$broadcast('createNewFolderManually', selected);
        }
      };

      /* add employee certification  */
      vm.addEmployeeCertification = () => {
        BaseService.goToManagePersonnel(loginUserDetails.employee.id);
      };
      vm.goToDocumentTypesList = () => {
        const CategoryTypeObjList = angular.copy(CORE.CategoryType);

        BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_DOCUMENTTYPE_STATE, {
          categoryTypeID: CategoryTypeObjList.DocumentType.ID
        });
      };

      /* add Document Type */
      vm.addDocumentType = (item, ev) => {
        if (vm.isReadOnly || vm.isDisableDocType || vm.isDisableToAccess) {
          return;
        }
        const popUpData = {
          popupAccessRoutingState: [USER.ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.DocumentType.Title)
        };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          const data = {
            Id: CORE.CategoryType.DocumentType.ID,
            gencCategoryName: CORE.CategoryType.DocumentType.Name,
            headerTitle: CORE.CategoryType.DocumentType.Title,
            Title: CORE.CategoryType.DocumentType.Title,
            IsHideActiveDeActiveFields: true,
            gencCategoryID: item && item.gencCategoryID ? item.gencCategoryID : null
          };
          DialogFactory.dialogService(
            USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
            USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
            ev,
            data).then(() => (data) => {
              if (data) {
                vm.getDocumentTypes();
              }
            }, () => {
              // Error Section
            });
        }
      };
      //Open side bar set variable here before opening side bar
      const openUploadSideBar = () => {
        if (vm.docOpenType === 2 && !vm.isFileUploadComplete) {
          vm.isDisableDocType = true;
          vm.isView = false;
          vm.isEdit = false;
          const data = _.find(vm.FileGroup, (item) => item.gencCategoryName === CORE.FileGroup.Sample);
          vm.fileGroupBy = data.gencCategoryID;
          setSidebarOpen();
        }
      };

      const pageInitAndValidateForDoc = () => {
        if (vm.Entity && vm.refTransID) {
          if (vm.isHideDisplayTree) {
            vm.selectedFolder();
          }
          else if (vm.Entity === woOPEntityName || vm.Entity === woEntityName || vm.Entity === CORE.Entity.ComponentAsPart) {
            const docDisplayValidationPromise = [];
            if (!loginUserDetails.isUserSuperAdmin) {
              docDisplayValidationPromise.push(checkStandardValidationForAccessDoc());
            }
            vm.cgBusyLoading = $q.all(docDisplayValidationPromise).then((responses) => {
              if (loginUserDetails.isUserSuperAdmin || (responses && responses.length > 0)) {
                if (loginUserDetails.isUserSuperAdmin || (responses[0] && responses[0].data && responses[0].data.isEmpHasValidStd)) {
                  vm.isRestrictWODocAsNotValidEmpStd = false;
                  if (vm.Entity === woOPEntityName) {
                    getWorkorderByWoOPID(vm.refTransID);
                  }
                  else if (vm.Entity === woEntityName) {
                    getWorkorderByID(vm.refTransID);
                  } else {
                    vm.getDocuments();
                  }
                }
                else {
                  vm.isRestrictWODocAsNotValidEmpStd = true;
                }
              }
            });
          } else if (selectedFolderID) {
            vm.getDocuments(selectedFolderID);
          } else {
            vm.getDocuments();
          }
        }
      };
      pageInitAndValidateForDoc();

      // ----------------------------- [S] - Disable Event for Grid Button ----------------------------
      vm.DisableDocumentButton = () => ((vm.isProtected ? true : (vm.isHideDisplayTree) ? false : (vm.isWOUnderTermination) ||
        (!vm.isDisableDocActionAllowed)));

      vm.DisableUpdateButton = (detail) => (vm.isReadOnly || (((vm.isWOUnderTermination || vm.isProtected || vm.isDisableToAccess) ||
        ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
        || (!vm.isEditDocAllowed)) && (!vm.isHideDisplayTree)));

      vm.DisableDeleteButton = (detail) => (vm.isReadOnly || (vm.isHideDisplayTree && vm.isDisableDeleteButtonUserWise) || ((!vm.isHideDisplayTree) &&
        ((vm.isWOUnderTermination || vm.isProtected || vm.isDisableToAccess) ||
          ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
          || (!vm.isDeleteDocAllowed))));

      vm.DisableDocSelectionChkbox = (detail) => (vm.isHideDisplayTree && vm.isDisableDeleteButtonUserWise) || ((!vm.isHideDisplayTree) && ((vm.isWOUnderTermination || vm.isProtected) ||
        ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
        || (!vm.isDeleteDocAllowed)));

      vm.DisableMoveDocumentButton = (detail) => (vm.isReadOnly || (vm.isProtected ? true : ((vm.isWOUnderTermination || vm.isProtected
        || vm.isDisableToAccess)
        || ($scope.isMerge && detail && detail.gencFileOwnerType === vm.allentity.Component.Name)
        || (!vm.isEditDocAllowed))));

      vm.DisableRenameFolderButton = (detail) => ((vm.isReadOnly || vm.isWOUnderTermination || vm.isProtected || vm.isDisableToAccess) || ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
        || (!vm.isEditDocAllowed));

      vm.DisableMoveFolderButton = (detail) => (vm.isReadOnly || vm.isWOUnderTermination || vm.isProtected || vm.isDisableToAccess || ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
        || (!vm.isEditDocAllowed));

      vm.DisableDeleteFolderButton = (detail) => ((vm.isReadOnly || vm.isWOUnderTermination || vm.isProtected || vm.isDisableToAccess)
        || ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
        || (!vm.isDeleteDocAllowed));

      vm.DisableFolderSelectionChkbox = (detail) => ((vm.isReadOnly || vm.isWOUnderTermination || vm.isProtected) || ($scope.isMerge && (detail.gencFileOwnerType === vm.allentity.Operation.Name || detail.gencFileOwnerType === vm.allentity.Component.Name))
        || (!vm.isDeleteDocAllowed));

      vm.IsDisableDocumentButton = () => vm.isReadOnly || vm.isDisableToAccess;

      // ----------------------------- [E] - Disable Event for Grid Button ----------------------------

      /* Show Description*/
      vm.showDescription = (object, ev) => {
        const obj = {
          title: 'Document',
          description: object.gencFileDescriptiongencFileID,
          name: object.name
        };
        const data = obj;
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      };

      ///* called when individual check box selected to copy doc folder to active wo op */
      //vm.checkAnyDocFolderSelectedForCopy = () => {
      //    vm.isAnyDocFolderSelected = _.some(vm.folderDocumentList, (item) => {
      //        return item.isCopyToActiveWOOp;
      //    });
      //}

      ///* called when copy all check box selected to copy all doc folder to active wo op */
      //vm.selectAllDocFolderToCopy = () => {
      //    _.each(vm.folderDocumentList, (folderDocItem) => {
      //        folderDocItem.isCopyToActiveWOOp = vm.isCopyAllToActiveWOOp;
      //    })
      //    vm.isAnyDocFolderSelected = vm.isCopyAllToActiveWOOp;
      //}

      /* copy all selected document/folder to active work order operation */
      vm.openWoListPopupToCopyOpDocFolder = (event) => {
        if (vm.isReadOnly || !vm.selectedFileFolder.length || vm.isDisableToAccess) {
          return;
        }
        if (vm.Entity === vm.allentity.Operation.Name && vm.refTransID && vm.selectedFileFolder.length) {
          const selectedFolderList = _.filter(vm.selectedFileFolder, (item) => item.isFolder);
          const selectedFileList = _.filter(vm.selectedFileFolder, (item) => !item.isFolder);
          const data = {
            opID: vm.refTransID,
            selectedFolderIDsToCopy: selectedFolderList && selectedFolderList.length > 0 ? _.map(selectedFolderList, 'id') : null,
            selectedFileIDsToCopy: selectedFileList && selectedFileList.length > 0 ? _.map(selectedFileList, 'id') : null,
            parentFolderIDOfSelected: selectedFolderID
          };
          DialogFactory.dialogService(
            CORE.COPY_OPMST_DOC_TO_WOOP_MODAL_CONTROLLER,
            CORE.COPY_OPMST_DOC_TO_WOOP_MODAL_VIEW,
            event,
            data).then((respOfDuplicateFileCopy) => {
              if (respOfDuplicateFileCopy) {
                vm.refreshDocument();
              }
            }, () => {
              // Error Section
            });
        }
      };

      /* Select/UnSelect All Folder/File Record  */
      vm.selectAll = () => {
        vm.selectedFileFolder = [];
        vm.folderDocumentList.forEach((item) => {
          item.isSelected = vm.isSelectAll ? ((item.isFolder) ? (!vm.DisableFolderSelectionChkbox(item)) : (!vm.DisableDocSelectionChkbox(item))) : false;
          if (vm.isSelectAll) {
            const deleteObj = {
              isFolder: item.isFolder,
              id: item.isFolder ? item.gencFolderID : item.gencFileID,
              roleId: item.roleId
            };
            if (item.isSelected) {
              vm.selectedFileFolder.push(deleteObj);
            }
          }
        });
      };
      vm.gotoDocumentType = () => {
        BaseService.goToGenericCategoryDocumentTypeList();
      };
      /* Manage 'Select All' Checkbox on Select/UnSelect Folder/File*/
      vm.SelectFolderFile = (detail) => {
        var isAllSelected = vm.folderDocumentList.some((item) => item.isSelected === false);
        vm.isSelectAll = isAllSelected ? false : true;
        if (detail.isSelected) {
          const deleteObj = {
            isFolder: detail.isFolder,
            id: detail.isFolder ? detail.gencFolderID : detail.gencFileID
          };
          vm.selectedFileFolder.push(deleteObj);
        }
        else {
          const deleteObjIndex = vm.selectedFileFolder.findIndex((x) => x.id === (detail.isFolder ? detail.gencFolderID : detail.gencFileID));
          if (deleteObjIndex > -1) { vm.selectedFileFolder.splice(deleteObjIndex, 1); }
        }
      };

      // check any action button disable to perform
      const isDisabledToAccessFunctionality = () => {
        if (vm.isReadOnly || vm.isProtected || vm.isDisableToAccess) {
          return true;
        }
        else {
          switch (vm.Entity) {
            case vm.allentity.Workorder.Name:
              if (vm.isWOUnderTermination) {
                return true;
              }
              break;
            default:
              return false;
          }
        }
      };

      // STATIC CODE - to set form dirty in case of canvas image has any change
      const manualSetFormDirty = () => {
        if (vm.documentForm && vm.documentForm.$$controls && vm.documentForm.$$controls.length > 0) {
          vm.documentForm.$$controls[0].$dirty = true;
          vm.documentForm.$setDirty();
        }
      };

      angular.element(() => {
        BaseService.currentPageForms = [vm.documentForm];
      });
    }
  }
})();


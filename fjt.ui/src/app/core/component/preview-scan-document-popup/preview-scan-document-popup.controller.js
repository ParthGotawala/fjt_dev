(function () {
  'use strict';

  angular
    .module('app.transaction.packingSlip')
    .controller('PreviewScanDocumentController', PreviewScanDocumentController);

  /** @ngInject */
  function PreviewScanDocumentController($mdSidenav, $scope, $mdDialog, $sce, $timeout, $q, data, Upload, CORE, PackingSlipFactory, DialogFactory, BaseService, GenericFileFactory, MasterFactory, USER, GenericCategoryFactory) {
    const vm = this;
    vm.scanDocumentRefDet = angular.copy(data);               //Reference details from parent scope
    vm.ScanDocumentSize = CORE.ScanDocumentSize;              //Document size list from constant file
    vm.ScanDocumentColor = CORE.ScanDocumentColor;            //Color settings from constant file
    vm.ScanDocumentResolution = CORE.ScanDocumentResolution;  //Resolution list from constant file
    vm.ScanDocumentSide = CORE.ScanDocumentSide;
    vm.ScanConnectionType = CORE.ScanConnectionType;
    vm.ScanSideTooltipMessage = CORE.SCAN_SIDE_TOOLTIP_MESSAGE_FOR_SCANNER;
    let openFrom = $scope.$parent.state && $scope.$parent.state.params && $scope.$parent.state.params.slipType ? $scope.$parent.state.params.slipType : null;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isShowSideNav = false;
    vm.btn = { isRetry: false };

    let loginUserDetails = BaseService.loginUser;

    vm.HideShowSideNav = () => {
      $mdSidenav('scanDocumentSetting').toggle();
      // added for custom apply z-index
      vm.isShowSideNav = !vm.isShowSideNav;
    };

    $timeout(() => {
      vm.HideShowSideNav();
    });

    /** Get scanner configuration from local storage */
    var sannerConfigDetail = localStorage.getItem('sannerConfigDetail');
    if (sannerConfigDetail) {
      vm.scanDetails = JSON.parse(sannerConfigDetail);
    }

    /** If scanner configuration not found in local storage then set default value */
    if (!vm.scanDetails) {
      vm.scanDetails = {
        ipAddress: null,
        nodename: null,
        usbModelName: null,
        skipBlankPage: true,
        skipBlankPageLevel: 1,
        size: _.first(vm.ScanDocumentSize).type,
        color: _.find(vm.ScanDocumentColor, { type: 'Color24bit' }).type,
        resolution: _.find(vm.ScanDocumentResolution, { type: 'reso1200dpi' }).type,
        scanSide: vm.ScanDocumentSide.D.name,
        connectionType: vm.ScanConnectionType.Usb,
        scanDocument: false
      };
    }

    /** Initialize auto-complete */
    let initAutoComplete = () => {
      /** Auto-complete for scanner */
      vm.autoCompleteScanner = {
        columnName: 'displayName',
        controllerName: USER.SCANNER_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.SCANNER_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'scanner',
        placeholderName: 'Scanner',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SCANNER_STATE],
          pageNameAccessLabel: CORE.PageName.scanner
        },
        callbackFn: getScannerList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.scanDetails.ipAddress = item.ipAddress;
            vm.scanDetails.nodename = item.nodename;
            vm.scanDetails.usbModelName = item.usbModelName;
            vm.scanDetails.scanDocument = false;
            vm.startScan();
          }
          else {
            vm.scanDetails.ipAddress = null;
            vm.scanDetails.nodename = null;
            vm.scanDetails.usbModelName = null;
          }
        },
      };

      /** Auto-complete for document type */
      vm.autoCompleteDocumentType = {
        columnName: 'gencCategoryName',
        keyColumnName: 'gencCategoryID',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnId: vm.documentTypeSelectionID ? vm.documentTypeSelectionID : null,
        inputName: CORE.CategoryType.DocumentType.Title,
        addData: {
          headerTitle: CORE.CategoryType.DocumentType.Title,
          popupAccessRoutingState: [USER.ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.CategoryType.DocumentType.ManageTitle
        },
        placeholderName: CORE.CategoryType.DocumentType.Title,
        isRequired: true,
        isAddnew: true,
        callbackFn: getDocumentTypeList,
        onSelectCallbackFn: () => {
        }
      };
    };

    /**function invoke when change connection type */
    vm.changeConnectionType = () => {
      var selectedScannerId = vm.autoCompleteScanner.keyColumnId;
      vm.autoCompleteScanner.keyColumnId = null;
      $timeout(() => {
        vm.configureScannerList();
        initAutoComplete();
        var objScanner = _.find(vm.connectionWiseScannerList, { id: selectedScannerId });
        if (objScanner) {
          vm.autoCompleteScanner.keyColumnId = objScanner.id;
        }
        else if (!vm.scanning.viewer) {
          vm.scanning = { processing: false, status: CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.DefaultMessage, scanFileName: null };
          vm.btn = { isRetry: false };
        }
      });
    };

    /** Generate scanner list based on connection type */
    vm.configureScannerList = () => {
      vm.connectionWiseScannerList = _.filter(vm.scannerList, (item) => {
        if (vm.scanDetails.connectionType == vm.ScanConnectionType.Usb) {
          return item.usbModelName;
        }
        else {
          return item.ipAddress || item.nodename;
        }
      });

      _.each(vm.connectionWiseScannerList, (item) => {
        if (vm.scanDetails.connectionType == vm.ScanConnectionType.Usb) {
          item.displayName = item.usbModelName;
        }
        else {
          item.displayName = item.nodename;
          if (item.ipAddress) {
            item.displayName = `${(item.displayName ? `${item.displayName} ` : '')}(${item.ipAddress})`;
          }
        }

        if (item.location) {
          item.displayName = `${item.displayName} [${item.location}]`;
        }
      });
    }

    /** Get scanner list */
    let getScannerList = () => {
      return MasterFactory.getActiveScanner().query().$promise.then((response) => {
        if (response && response.data) {
          vm.scannerList = response.data;
        }
        vm.configureScannerList();
        return $q.resolve(vm.scannerList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };


    /** Get document type list */
    let getDocumentTypeList = () => {
      vm.documentTypeList = [];
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({
        listObj: {
          GencCategoryType: [CORE.CategoryType.DocumentType.Name],
          isActive: false
        }
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.documentTypeList = response.data;
          let documentTypeSelection;
          if (openFrom === CORE.PackingslipDocumentTab || openFrom === CORE.packingSlipReceiptType.P.key || openFrom === CORE.LabelConstant.PACKING_SLIP.PackingSlip) {
            documentTypeSelection = _.find(response.data, (item) => item.gencCategoryName === CORE.FileGroup.PackingSlipWithCOFC);
          } else if (openFrom === CORE.PackingSlipInvoiceTabName) {
            documentTypeSelection = _.find(response.data, (item) => item.gencCategoryName === CORE.FileGroup.SupplierInvoice);
          }
          if (documentTypeSelection) {
            vm.documentTypeSelectionID = documentTypeSelection.gencCategoryID ? documentTypeSelection.gencCategoryID : null;
          }
        }
        return $q.resolve(vm.documentTypeList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /** Get auto-complete detail*/
    let getAutoCompleteData = () => {
      var autocompletePromise = [getScannerList(), getDocumentTypeList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        initAutoComplete();

        var objScanner = _.find(vm.connectionWiseScannerList, (item) => {
          if (vm.scanDetails.connectionType == vm.ScanConnectionType.Usb) {
            return item.usbModelName == vm.scanDetails.usbModelName;
          }
          else if (vm.scanDetails.ipAddress) {
            return item.ipAddress == vm.scanDetails.ipAddress;
          }
          else {
            return item.nodename == vm.scanDetails.nodename;
          };
        });
        if (objScanner) {
          vm.autoCompleteScanner.keyColumnId = objScanner.id;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /** Get supplier setting to scan document on one side or both side */
    function getSupplierScanDocumentSetting() {
      if (vm.scanDocumentRefDet.mfgCodeID) {
        MasterFactory.getSupplierScanDocumentSetting().query({ id: vm.scanDocumentRefDet.mfgCodeID }).$promise.then((response) => {
          if (response.data && response.data.scanDocumentSide) {
            vm.scanDetails.scanSide = vm.ScanDocumentSide[response.data.scanDocumentSide].name;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    function active() {
      getAutoCompleteData();
      getSupplierScanDocumentSetting();
    }

    active();

    vm.scanning = { processing: false, status: CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.DefaultMessage, scanFileName: null };

    /**
     * Get document stream to display scanned document
     * @param {any} filename
     */
    function getDocument(filename) {
      vm.cgBusyLoading = PackingSlipFactory.getScanDocument({ FileName: filename }).then((response) => {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: '',
          multiple: true
        };
        if (response.status == 404) {
          model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound;
          DialogFactory.alertDialog(model);
        } else if (response.status == 403) {
          model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied;
          DialogFactory.alertDialog(model);
        } else if (response.status == 401) {
          model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized;
          DialogFactory.alertDialog(model);
        }
        else {
          vm.scanning.fileData = response.data;
          vm.scanning.viewer = true;
          vm.scanning.scanFileName = filename;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /** Scan document on scan button */
    vm.scanDocument = () => {
      vm.scanDetails.scanDocument = true;
      vm.startScan();
    };

    /**Invokes while checking connection for selected scanner and while scanning document */
    vm.startScan = () => {
      localStorage.setItem('sannerConfigDetail', JSON.stringify(vm.scanDetails));
      vm.scanning.viewer = false;
      vm.scanning.scanFileName = null;
      vm.scanning.scanDocPath = null;
      vm.scanning.processing = true;
      vm.scanning.status = vm.scanDetails.scanDocument ? CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.StartScanning : CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.CheckingScannerAvailability;
      let scanDetail = angular.copy(vm.scanDetails);
      scanDetail.refTransID = vm.scanDocumentRefDet.id;
      //console.log('Start Time: ', new Date());
      PackingSlipFactory.scanDocument().query(scanDetail).$promise.then((response) => {
        //console.log('End Time: ', new Date());
        vm.btn = {
          isRetry: false,
          tryAgain: false,
          scanAgain: false,
          scan: false
        };
        if (response.data) {
          if (!response.data.Error) {
            if (response.data.FileName) {
              //console.log('File name : ', response.data.FileName);
              vm.scanning.scanFileName = response.data.FileName;
              vm.scanning.scanDocPath = $sce.trustAsResourceUrl(`${ScanDocumentStorageURL}${vm.scanning.scanFileName}#view=Fit&toolbar=1&statusbar=1&navpanes=1`);
              getDocument(vm.scanning.scanFileName);
              vm.HideShowSideNav();
            }
            else {
              vm.scanning.status = CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ConnectionSucessful;
            }
          }
          else {
            var status = CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ERROR_CODE[response.data.Error] || response.data.Error;
            vm.scanning.status = status;
          }

          vm.btn.isRetry = response.data.isRetry;
        }
        else {
          vm.scanning.status = CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ConnectionSucessful;
        }
        vm.scanning.processing = false;
        if (!vm.scanning.scanDocPath && !vm.isShowSideNav) {
          vm.HideShowSideNav();
        }

        if (!vm.btn.isRetry) {
          if ([CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ERROR_CODE.NotFoundDevice, CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ERROR_CODE.InvalidArgument, CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ERROR_CODE.NoDeviceResponse].indexOf(vm.scanning.status) != -1) {
            vm.btn.tryAgain = true;
          } else if (vm.scanning.status == CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.ConnectionSucessful) {
            vm.btn.scan = true;
          } else if ([CORE.MESSAGE_CONSTANT.SCAN_DOCUMENT.OtherFailure].indexOf(vm.scanning.status) != -1) {
            vm.btn.isRetry = true;
          }
          else {
            vm.btn.scanAgain = true;
          }
        }

      }).catch((error) => {
        vm.scanning.processing = false;
        return BaseService.getErrorLog(error);
      });
    };

    //vm.scanDocPath = $sce.trustAsResourceUrl(`${ScanDocumentStorageURL}${data.FileName}#view=Fit&toolbar=1&statusbar=1&navpanes=1`);

    /** Close modal pop-up */
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /** Confirmation to discard document */
    vm.discardDocument = () => {
      let obj = {
        title: "Discard Document",
        textContent: "Are you sure you want to discard scanned document?",
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          removeDocument(false);
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /** Delete scanned document from garbage storage */
    function removeDocument(rescan) {
      vm.cgBusyLoading = PackingSlipFactory.discardScanDocument().query({ fileName: vm.scanning.scanFileName }).$promise.then((response) => {
        if (rescan) {
          vm.startScan();
        }
        else {
          $mdDialog.hide();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //[S] Dharam: 04/07/2020 File Upload in chanks
    $scope.$watch('loaderVisible', function (newValue) {
      if (newValue) {
        $scope.timeoutWatch = $timeout(function () {
          /*max time to show infinite loader*/
        }, _configMaxTimeout);
        vm.cgBusyLoading = $scope.timeoutWatch;
      }
      else {
        if ($scope.timeoutWatch) {
          $timeout.cancel($scope.timeoutWatch);
        }
      }
    });

    var r = new Resumable({
      target: `${CORE.API_URL}genericFileList/uploaChunkGenericFiles`,
      chunkSize: _chunkSizeInMB * 1024 * 1024,
      simultaneousUploads: 1,
      testChunks: false,
      throttleProgressCallbacks: 1,
      headers: {
        Authorization: `Bearer ${loginUserDetails.token}`
      },
    });

    if (!r.support) {
      $('.resumable-error').show();
    } else {
      // Show a place for dropping/selecting files
      $('.resumable-drop').show();
      //r.assignDrop($('.resumable-drop')[0]);
      //r.assignBrowse($('.resumable-browse')[0]);

      // Handle file add event
      r.on('fileAdded', function (file) {
        // Show progress pabr
        $('.resumable-progress, .resumable-list').show();
        // Show pause, hide resume
        $('.resumable-progress .progress-resume-link').hide();
        $('.resumable-progress .progress-pause-link').show();
        // Add the file to the list
        $('.resumable-list').append('<li class="resumable-file-' + file.uniqueIdentifier + '">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
        $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-name').html(file.fileName);
        // Actually start the upload
        r.upload();
      });
      r.on('pause', function () {
        // Show resume, hide pause
        $('.resumable-progress .progress-resume-link').show();
        $('.resumable-progress .progress-pause-link').hide();
      });
      r.on('complete', function (file, message) {
        // Hide pause/resume when the upload has completed
        $scope.loaderVisible = false;
        BaseService.currentPageFlagForm = [];
        $('.resumable-list').empty();
        $('.resumable-progress').hide();
      });
      r.on('fileSuccess', function (file, message) {
        $mdDialog.hide({ saveDocument: true });
      });
      r.on('fileError', function (file, message) {
        var statusDetail = "";
        try {
          statusDetail = JSON.parse(message);
        }
        catch (e) {
          statusDetail = true;
        }
        if (typeof (statusDetail) === "object" && statusDetail.status == CORE.ApiResponseTypeStatus.FAILED && typeof (statusDetail.errors) === "object") {
          var errorDetail = statusDetail.errors;
          var model = {
            messageContent: errorDetail.messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      });
      r.on('fileProgress', function (file) {
        // Handle progress for both the file and the overall upload
        $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html(Math.floor(file.progress() * 100) + '%');
        $('.progress-bar').css({ width: Math.floor(r.progress() * 100) + '%' });
      });
      r.on('cancel', function () {
      });
      r.on('uploadStart', function () {
        // Show pause, hide resume
      });
    }

    //[E] Dharam: 04/07/2020 File Upload in chanks

    /** Save document against packing slip */
    vm.saveDocument = () => {
      if (vm.scanDocumentForm.$invalid) {
        if (!vm.isShowSideNav) {
          vm.HideShowSideNav();
        }
        $timeout(() => { BaseService.focusRequiredField(vm.scanDocumentForm); }, 1000);
        return;
      }

      vm.cgBusyLoading = PackingSlipFactory.getScanDocument({ FileName: vm.scanning.scanFileName }).then((response) => {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: '',
          multiple: true
        };
        if (response.status == 404) {
          model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound;
          DialogFactory.alertDialog(model);
        } else if (response.status == 403) {
          model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied;
          DialogFactory.alertDialog(model);
        } else if (response.status == 401) {
          model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized;
          DialogFactory.alertDialog(model);
        }
        else {
          let blob = new Blob([response.data], { type: "application/pdf" });
          blob.lastModifiedDate = new Date();
          blob.name = vm.scanning.scanFileName;
          const entityObj = _.find(CORE.AllEntityIDS, (data) => data.Name === vm.scanDocumentRefDet.gencFileOwnerType);
          const documentDetail = {
            description: null,
            refTransID: vm.scanDocumentRefDet.id,
            entityID: entityObj ? entityObj.ID : null,
            gencFileOwnerType: vm.scanDocumentRefDet.gencFileOwnerType,
            originalname: vm.scanning.scanFileName,
            isShared: true,
            fileGroupBy: vm.autoCompleteDocumentType.keyColumnId,
            refParentId: null,
            fileSize: blob.size
          };

          $scope.loaderVisible = true;
          BaseService.currentPageFlagForm = [true];
          r.opts.query = {
            documentDetail: JSON.stringify(documentDetail)
          };

          //r.files.push(files);
          r.addFile(blob);

          //vm.cgBusyLoading = GenericFileFactory.uploadGenericFiles(documentDetail, blob).then((response) => {
          //  $mdDialog.hide({ saveDocument: true });
          //}).catch((error) => {
          //  return BaseService.getErrorLog(error);
          //});
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /** Confirmation to discard and rescan document */
    vm.rescan = () => {
      let obj = {
        title: "Rescan",
        textContent: "Are you sure you want to discard this document and rescan?",
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          removeDocument(true);
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    // go to Scanner master
    vm.goToScannerList = () => {
      BaseService.openInNew(USER.ADMIN_SCANNER_STATE);
    };

    vm.goToDocumentTypeList = () => {
      BaseService.goToGenericCategoryDocumentTypeList();
    };

    vm.retryCheckConnection = () => {
      vm.scanDetails.scanDocument = false;
      vm.startScan();
    };
  }
})();

(function () {
  'use strict';

  angular.module('app.core').controller('CameraCaptureZoomInOutPopupController', CameraCaptureZoomInOutPopupController);

  function CameraCaptureZoomInOutPopupController(data, $sce, $stateParams, $state, $timeout, DialogFactory, $scope, $window, USER, Upload,
    GenericFileFactory, CORE, ReceivingMaterialFactory, BaseService, TRANSACTION, MasterFactory) { // eslint-disable-line func-names
    const vm = this;
    vm.isViewOnly = data.isViewOnly || false;
    vm.isSelectView = false;
    vm.CORE = CORE;
    vm.image = null;
    vm.resultImage = {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.EntityName = 'component_sid_stock';
    vm.verificationType = CORE.VerificationType;
    vm.verificationStatus = CORE.VerificationStatus;
    vm.verification = {
      verificationType: vm.verificationType.UIDandMfgPNLabel
    };
    vm.patOpts = { x: 0, y: 0, w: 100, h: 100 };
    vm.cstID = $stateParams.id;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.RECEIVINGMATERIALPOPUP;
    vm.FILE_PREVIEW_NOT_AVAILABLE = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_PREVIEW_NOT_AVAILABLE;
    vm.showstatus = false;
    vm.showPassword = false;
    vm.isDisableUMID = false;
    vm.isLoadDocument = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.headerdata = [];
    vm.active = active;
    if (data) {
      vm.active();
    }
    let selectedMFRId = null;
    let selectedBarcodeId = null;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;

    // In Preview we Give provision for view Next/Previous
    vm.previewIndex = {
      nextIndex: null,
      previousIndex: null
    };

    function active() {
      vm.Entity = data.entity;
      vm.image = data;
      vm.Title = data.Title;
      vm.PageType = data.PageType;
      vm.ID = data.ID;
      vm.cstID = data.ID;
      vm.UMID = data.UMID;
      if (vm.UMID) {
        vm.verification.uid = vm.UMID;
        vm.isDisableUMID = true;
        $timeout(() => {
          setFocus('txtscanmfglabel');
        }, true);
      }
    }

    vm.cancel = () => {
      DialogFactory.closeDialogPopup();
    };

    vm.scanLabel = (e) => {
      $timeout(() => { scanLabel(e); }, true);

      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    const scanLabel = (e) => {
      if (e.keyCode === 13) {
        if (vm.verification.uid && (vm.verification.scanMFGPNLabel || vm.verification.scanPID || vm.verification.scanCPN || vm.verification.scanUID || vm.verification.scanMFGPN)) {
          vm.verifyBarcodeLabel(e);
        } else if (vm.verification.uid) {
          if (vm.verification.verificationType === vm.verificationType.UIDandMfgPNLabel) {
            setFocus('txtscanmfglabel');
          } else if (vm.verification.verificationType === vm.verificationType.UIDtoPID) {
            setFocus('txtscanpid');
          } else if (vm.verification.verificationType === vm.verificationType.UIDtoCPN) {
            setFocus('txtscancpn');
          } else if (vm.verification.verificationType === vm.verificationType.UIDtoUID) {
            setFocus('txtscanuid');
          }
          else if (vm.verification.verificationType === vm.verificationType.UIDtoMfgPN) {
            setFocus('txtscanmfg');
          }
        } else if (!vm.verification.uid) {
          setFocus('txtuid');
        }
      }
    };

    //verify label with database selected
    vm.verifyBarcodeLabel = (event) => {
      vm.verification.scanMFGPNLabel = vm.verification.verificationType === vm.verificationType.UIDandMfgPNLabel ? vm.verification.scanMFGPNLabel : null;
      vm.verification.scanPID = vm.verification.verificationType === vm.verificationType.UIDtoPID ? vm.verification.scanPID : null;
      vm.verification.scanCPN = vm.verification.verificationType === vm.verificationType.UIDtoCPN ? vm.verification.scanCPN : null;
      vm.verification.scanUID = vm.verification.verificationType === vm.verificationType.UIDtoUID ? vm.verification.scanUID : null;
      vm.verification.scanMFGPN = vm.verification.verificationType === vm.verificationType.UIDtoMfgPN ? vm.verification.scanMFGPN : null;
      vm.verification.mfgId = selectedMFRId;
      vm.verification.barcodeId = selectedBarcodeId;
      vm.isLoadDocument = false;
      vm.cgBusyLoading = ReceivingMaterialFactory.getVerifiedLabel().query({ objComponentStock: vm.verification }).$promise.then((res) => {
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.UIDVerificationDet = res && res.data && res.data.verifyResult ? res.data.verifyResult[0] : {};
          vm.UIDVerificationDet.mfgCodeName = stringFormat('({0}) {1}', vm.UIDVerificationDet.mfgCode, vm.UIDVerificationDet.mfgName);
          setRoHSDetails();
          vm.UIDVerificationDet.imageURL = BaseService.getPartMasterImageURL(vm.UIDVerificationDet.documentPath ? vm.UIDVerificationDet.documentPath : null, vm.UIDVerificationDet.imageURL ? vm.UIDVerificationDet.imageURL : null);
          vm.headerdata = [];
          vm.headerdata.push({
            label: vm.LabelConstant.TransferStock.UMID,
            value: vm.UIDVerificationDet.scanString1,
            displayOrder: 1,
            labelLinkFn: vm.goToUMIDList,
            valueLinkFn: vm.goToUMIDDetail,
            isCopy: true
          }, {
            label: vm.LabelConstant.MFG.PID,
            value: vm.UIDVerificationDet.PIDCode,
            displayOrder: 1,
            labelLinkFn: vm.goToPartList,
            valueLinkFn: vm.goToPartDetail,
            isCopy: true,
            isCopyAheadLabel: true,
            imgParms: {
              imgPath: vm.UIDVerificationDet.rohsIcon !== null ? vm.UIDVerificationDet.rohsIcon : null,
              imgDetail: vm.UIDVerificationDet.rohsName
            },
            isCopyAheadOtherThanValue: true,
            copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
            copyAheadValue: vm.UIDVerificationDet.mfgPN
          });
          vm.labelVerify = res && res.data && res.data.labelResult ? res.data.labelResult[0] : {};
          selectedMFRId = null;
          selectedBarcodeId = null;
          if (vm.UIDVerificationDet.status === vm.verificationStatus.Verified) {
            localStorage.removeItem('UnlockVerificationDetail');
            if ($state.current.name === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
              if (vm.PageType === TRANSACTION.VerifyPictureType.TakePicture) {
                vm.cstID = vm.UIDVerificationDet.compStockID;
              }
              else if (vm.PageType === TRANSACTION.VerifyPictureType.TransferLabel) {
                vm.cstID = vm.ID;
              }
            } else {
              if (vm.PageType === TRANSACTION.VerifyPictureType.TakePicture) {
                vm.cstID = vm.UIDVerificationDet.compStockID;
              }
              else {
                vm.cstID = $stateParams.id;
              }
            }
            vm.verification.packingSlipNumber = vm.UIDVerificationDet.packingSlipNumber;
            vm.verification.packingSlipSupplierCode = vm.UIDVerificationDet.packingSlipSupplierCode;
            vm.verification.cOfCValue = vm.UIDVerificationDet.cOfCValue;
            vm.verifiedLabel = true;
            vm.takePicture();
          }
          else if (vm.UIDVerificationDet.status === vm.verificationStatus.Unverified && ['5', '9'].indexOf(vm.labelVerify.IsSuccess) !== -1) {
            if (vm.labelVerify.IsSuccess === '5') {
              selectPartPopup(vm.labelVerify.MFGPart);
            }
            else if (vm.labelVerify.IsSuccess === '9') {
              selectBarcodePopup(vm.labelVerify.MFGPart);
            }
          }
          else {
            localStorage.setItem('UnlockVerificationDetail', JSON.stringify(vm.UIDVerificationDet));

            DialogFactory.dialogService(
              CORE.UID_VERIFICATION_FAILED_MODAL_CONTROLLER,
              CORE.UID_VERIFICATION_FAILED_MODAL_VIEW,
              event,
              vm.UIDVerificationDet).then((verificationDet) => {
                if (verificationDet) {
                  vm.UIDVerificationDet = null;
                  vm.resetModel();
                  localStorage.removeItem('UnlockVerificationDetail');
                }
              }, (err) => BaseService.getErrorLog(err));
          }
        }
        vm.isLoadDocument = true;
      }).catch((error) => {
        vm.isLoadDocument = true;
        return BaseService.getErrorLog(error);
      });
    };

    const selectPartPopup = (mfgPart) => {
      const obj = {
        mfgPart: mfgPart,
        supplierName: null
      };
      DialogFactory.dialogService(
        TRANSACTION.SELECT_PART_MODAL_CONTROLLER,
        TRANSACTION.SELECT_PART_MODAL_VIEW,
        event,
        obj).then(() => {
        }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultiplePart');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectBarcodePopup = (mfgPart) => {
      const data = mfgPart;
      DialogFactory.dialogService(
        TRANSACTION.SELECT_BARCODE_MODAL_CONTROLLER,
        TRANSACTION.SELECT_BARCODE_MODAL_VIEW,
        null,
        data).then(() => {
        }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultipleBarcode');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const popUpForMultipleListed = (selectItem, selectType) => {
      if (selectItem) {
        selectedMFRId = selectType === 'MultiplePart' && selectItem ? selectItem.id : 0;
        selectedBarcodeId = selectType === 'MultipleBarcode' && selectItem ? selectItem.id : null;
        vm.verifyBarcodeLabel(null);
      }
    };

    $scope.$on('documentSelect', (data) => {
      if (data && data.fileDetail) {
        vm.previewIndex.nextIndex = data.nextImageIndex;
        vm.previewIndex.previousIndex = data.previousImageIndex;
        vm.isSelectView = true;
        vm.documentDetail = data.fileDetail;
        vm.isImageFile = false;
        vm.isVideoFile = vm.isPDFFile = vm.isAudioFile = false;
        vm.documentPath = null;
        if (data.fileDetail.gencFileType.indexOf('/pdf') !== -1) {
          vm.isPDFFile = true;
          vm.documentPath = $sce.trustAsResourceUrl(data.fileDetail.documentPath);
          vm.selectedImageViewer = null;
        }
        else if (data.fileDetail.gencFileType.indexOf('image/') !== -1) {
          vm.isImageFile = true;
          $timeout(() => {
            if (vm.selectedImageViewer) {
              vm.selectedImageViewer.load(vm.imageIcon, vm.imageIcon);
              vm.selectedImageViewer.refresh();
            }
            else {
              vm.selectedImageViewer = ImageViewer('#documentSelectImg', { snapView: false });
            }
          }, 1000);
        }
        else if ((data.fileDetail.gencFileType.indexOf('audio/') !== -1)) {
          vm.isAudioFile = true;
          vm.selectedImageViewer = null;
        }
        else if ((data.fileDetail.gencFileType.indexOf('video/') !== -1)) {
          vm.isVideoFile = true;
          vm.selectedImageViewer = null;
        }
        vm.imageIcon = data.fileDetail.documentIcon;
      }
      else {
        vm.isSelectView = false;
        vm.documentPath = null;
      }
    });

    vm.previousImage = (index) => {
      $scope.$broadcast('viewNextPreviousImage', index);
    };
    vm.nextImage = (index) => {
      $scope.$broadcast('viewNextPreviousImage', index);
    };

    vm.resetSelectedImage = () => {
      if (vm.selectedImageViewer) {
        vm.selectedImageViewer.refresh();
      }
    };

    vm.copyText = (copyText) => {
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copyText).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showstatus = true;
    };

    vm.checkStatus = () => {
      vm.showstatus = false;
    };

    getRoHSList();
    function getRoHSList() {
      return MasterFactory.getRohsList().query().$promise.then((requirement) => {
        vm.RohsList = requirement.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function setRoHSDetails() {
      if (vm.UIDVerificationDet) {
        const rohsDetails = _.find(vm.RohsList, {
          id: vm.UIDVerificationDet.RoHSStatusID
        });
        if (rohsDetails) {
          vm.UIDVerificationDet.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + rohsDetails.rohsIcon;
          vm.UIDVerificationDet.rohsName = rohsDetails.name;
        }
      }
    };

    vm.chnageVerificationOption = () => {
      vm.resetModel();
    };

    vm.resetModel = () => {
      //vm.verification.uid = null;
      vm.verification.scanMFGPNLabel = null;
      vm.verification.scanPID = null;
      vm.verification.scanCPN = null;
      vm.verification.scanUID = null;
      vm.verification.scanMFGPN = null;
      setFocus('txtuid');
      if (vm.UMID) {
        vm.verification.uid = vm.UMID;
        vm.isDisableUMID = true;
        $timeout(() => {
          if (vm.verification.verificationType === vm.verificationType.UIDandMfgPNLabel) {
            setFocus('txtscanmfglabel');
          } else if (vm.verification.verificationType === vm.verificationType.UIDtoPID) {
            setFocus('txtscanpid');
          } else if (vm.verification.verificationType === vm.verificationType.UIDtoCPN) {
            setFocus('txtscancpn');
          } else if (vm.verification.verificationType === vm.verificationType.UIDtoUID) {
            setFocus('txtscanuid');
          }
          else if (vm.verification.verificationType === vm.verificationType.UIDtoMfgPN) {
            setFocus('txtscanmfg');
          }
        }, true);
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

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /** Redirect to manufacturer page */
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.UIDVerificationDet.mfgcodeID);
    };

    /** Redirect to part master page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToPartDetail = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.UIDVerificationDet.refcompid, USER.PartMasterTabs.Detail.Name);
    };

    vm.goToCofC = (id) => {
      BaseService.goToCofC(id);
    };

    vm.goToDocumentType = () => {
      BaseService.goToGenericCategoryDocumentTypeList();
    };

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    /** Redirect to manage umid page */
    vm.goToUMIDDetail = () => {
      BaseService.goToUMIDDetail(vm.cstID);
    };

    //go to mounting type list page
    vm.goToMountingTypeList = () => {
      BaseService.goToMountingTypeList();
    };

    //go to package case list page
    vm.goToPackageCaseTypeList = () => {
      BaseService.goToPackageCaseTypeList();
    };
    /** this pop-up will open once label verified and from take picture button */
    vm.takePicture = function () {
      DialogFactory.dialogService(
        CORE.IP_WEBCAM_CAPTURE_MODAL_CONTROLLER,
        CORE.IP_WEBCAM_CAPTURE_MODAL_VIEW,
        event,
        {
          cstID: vm.cstID,
          verification: vm.verification
        }).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();

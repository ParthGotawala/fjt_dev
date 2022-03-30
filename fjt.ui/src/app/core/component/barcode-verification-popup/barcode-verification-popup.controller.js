(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('BarcodeVerificationPopupController', BarcodeVerificationPopupController);

  /** @ngInject */
  function BarcodeVerificationPopupController($scope, Upload, $q, GenericFileFactory, $timeout, $stateParams, $mdDialog, data, CORE, TRANSACTION, DialogFactory, BaseService, ReceivingMaterialFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    var loginUser = BaseService.loginUser;
    vm.LabelVerification = {};
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddMfgCodeForm);
      if (isdirty || vm.checkDirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };
    vm.TRANSACTION = TRANSACTION;
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    //verify label with database selected 
    vm.verifyBarcodeLabel = () => {
      vm.cgBusyLoading = ReceivingMaterialFactory.getVerifiedLabel().query({ objComponentStock: vm.verification }).$promise.then((res) => {
        if (res && res.data) {
          vm.verifiedLabel = true;
        }
        else {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: TRANSACTION.BARCODE_LABEL_NOT_VERIFIED,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Take picture
    vm.takePicture = (event) => {
      vm.event = event;
      DialogFactory.dialogService(
        CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
        CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
        vm.event,
        null).then((res) => {
          if (res === false) {
            return;
          }
          var data = {
            path: res.croppedImage,
            name: `${new Date().getTime()}.png`,
            entity: CORE.AllEntityIDS.Component_sid_stock,
            refTransID: $stateParams.id
          };
          //vm.zoomInOutImage(vm.event, data);
        }, (err) => BaseService.getErrorLog(err));
    };

    //open popup to set image and zoomin/zoomout
    vm.zoomInOutImage = (event, data) => {
      DialogFactory.dialogService(
        CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
        CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
        event,
        data).then((res) => {
          if (res.isContinue) {
            checkBarcodeLabelPicture();
          }
          else {
            $mdDialog.cancel();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    //check barcode images for continous
    function checkBarcodeLabelPicture() {
      vm.takePicture(vm.event);
    }

    let toDataURL = (url, callback) => {
      try {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function () {
          var fileReader = new FileReader();
          fileReader.onloadend = function () {
            callback(fileReader.result);
          };
          fileReader.readAsDataURL(httpRequest.response);
        };
        httpRequest.open('GET', url);
        httpRequest.responseType = 'blob';
        httpRequest.send();
      }
      catch (exception) {
        // handle this block: take care by Fenil
      }
    };
    vm.scanfromURL = () => {
      toDataURL('http://192.168.0.28:8080/photoaf.jpg', (dataUrl) => {
        if (dataUrl) {
          var data = {
            path: dataUrl,
            name: `${new Date().getTime()}.png`,
            entity: CORE.AllEntityIDS.Component_sid_stock,
            refTransID: $stateParams.id
          };
          vm.image = data;
          vm.saveImage();
        }
        // console.log('Result in string:', dataUrl);
      });
    };
    vm.saveImage = () => {
      vm.FileGroup = CORE.FileGroup;
      $scope.imageResult = Upload.dataUrltoBlob(vm.image.path, vm.image.name);
      $scope.imageResult.name = vm.image.name;
      var documentDetail = {
        'description': '',
        'refTransID': vm.image.refTransID,
        'entityID': CORE.AllEntityIDS.Component_sid_stock.ID,
        'gencFileOwnerType': CORE.AllEntityIDS.Component_sid_stock.Name,
        'originalname': vm.image.name,
        'isShared': true,
        'fileGroupBy': vm.FileGroup.Other,
        //'refParentId': parentId,
        'fileSize': $scope.imageResult.size
      };

      //This method is not modified because it is not in use
      vm.cgBusyLoading = GenericFileFactory.uploadGenericFiles(documentDetail, $scope.imageResult).then((response) => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();

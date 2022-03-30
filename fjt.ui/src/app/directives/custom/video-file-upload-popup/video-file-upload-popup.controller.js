(function () {
  'use strict';

  angular.module('app.core').controller('VideoFileUploadController', VideoFileUploadController);

  function VideoFileUploadController(data, DialogFactory, $sce, BaseService, $scope, $timeout, CORE, USER, RFQTRANSACTION, $mdDialog) {
    const vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DOCUMENT_DRAG_UPLOAD;
    vm.ispicture = false;
    vm.documentType = CORE.DocumentType.Video;
    vm.genericDocument = [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let Documentsize = _configDocumentSize;//CORE.DocumentSize;
    let FileAllow = CORE.FileTypeList;
    vm.FileGroup = CORE.FileGroup;
    vm.DateTimeFormat = _dateDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    var _dummyEvent = null;
    FileAllow = _.filter(FileAllow, (obj) => {
      return obj.mimetype.contains('video/');
    })
    vm.FileTypeList = _.map(FileAllow, 'extension').join(', ');
    vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, vm.documentType);
    vm.EmptyMesssage.NO_ANY_DOC_MESSAGE = stringFormat(vm.EmptyMesssage.NO_ANY_DOC_MESSAGE, vm.documentType);
    vm.EmptyMesssage.DOCUMENT_ALLOW_FORMAT_MSG = stringFormat(vm.EmptyMesssage.DOCUMENT_ALLOW_FORMAT_MSG, vm.FileTypeList);

    vm.save = (ev) => {
      $mdDialog.hide(vm.genericDocument);
    };


    //Check Selected Document 
    vm.documentFiles = (file, ev) => {
      var messageContent;
      _.each(file, (objFile, index) => {
        if (!messageContent) {
          if (objFile.size > parseInt(Documentsize)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DocumentSizeError_NotAllowed);
            messageContent.message = stringFormat(messageContent.message, formatBytes(Documentsize));
          }
          else if (!_.find(FileAllow, (extObj) => { return extObj.mimetype == objFile.type })) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DOCUMENT_VIDEO_ALLOW_FORMAT_MSG);
            messageContent.message = stringFormat(messageContent.message, vm.FileTypeList);
          }
          else if (objFile.name == CORE.Copy_Image_Name) {
            file[index] = new File([objFile], `${new Date().getTime()}.png`, { type: CORE.Copy_Image_Extension });
          }
        }
      });

      if (messageContent) {
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      vm.genericDocument = vm.genericDocument || [];
      const existsFiles = _.intersectionBy(vm.files, file, 'name');
      const recentExistsFiles = _.intersectionBy(vm.genericDocument, file, 'name');

      let fileName = _.union(_.map(existsFiles, 'name'), _.map(recentExistsFiles, 'name'));
      if (existsFiles.length > 0 || recentExistsFiles.length > 0) {
        let msg = vm.documentType + ` '` + fileName.join(', ') + `'` + ' already added.';
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: msg,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      }

      if (file) {
        file.forEach((objFile) => {
          if (_.indexOf(fileName, objFile.name) == -1) {
            objFile.progressPercentage = 0;
            vm.genericDocument.push(objFile);
          }
        });
        if (file.length > 0) {
          vm.VideoUploadForm.$setDirty();
        }
      }
    };

    vm.isImage = (file) => {
      let filename = file.name;
      let ext = filename.split('.').pop();
      $scope.fileObj = _.find(FileAllow, (file) => {
        return file.extension.toLowerCase() == '.' + ext.toLowerCase();
      });
      if (file.type.indexOf("image") > -1) {
        return true;
      }
      else {
        if (!$scope.fileObj) {
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DOCUMENT_VIDEO_ALLOW_FORMAT_MSG);
          messageContent.message = stringFormat(messageContent.message, vm.FileTypeList);

          var model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        } else
          file.icon = $scope.fileObj.icon;

        return false;
      }
    }


    //Remove Document
    vm.removeDocument = (index) => {
      $scope.IsRemove = true;
      vm.genericDocument.splice(index, 1);
      $timeout(() => {
        $scope.IsRemove = false;
        $scope.$applyAsync();
      }, 0);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    function showWrongFileAlert() {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: RFQTRANSACTION.BOM.AVL_DATA_NOT_MATCH,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        multiple: true
      };
      DialogFactory.alertDialog(obj).then((yes) => {

      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }



  }
})();

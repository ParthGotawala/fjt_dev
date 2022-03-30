(function () {
  'use strict';

  angular
    .module('app.admin.equipment')
    .controller('ManageEquipmentTaskPopupController', ManageEquipmentTaskPopupController);

  /** @ngInject */
  function ManageEquipmentTaskPopupController($mdDialog, data, CORE, $scope, $timeout, EquipmentTaskFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.isSubmit = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let FileAllow = CORE.FileTypeList;
    vm.FileTypeList = _.map(FileAllow, 'extension').join(',');
    if (Array.isArray(FileAllow)) {
      vm.AllowFileExtenstion = _.map(FileAllow, 'extension').join(", ").replace(/[.]/g, '');
    }
    let Maintenance_Schedule_RepeatType = CORE.Maintenance_Schedule_RepeatType;

    let gencFileOwnerType = CORE.AllEntityIDS.Equipment_Task.Name;
    let eqpID = data.eqpID;
    vm.equipmentTask = {};
    vm.equipmentTask = data.eqpTask ? data.eqpTask : vm.equipmentTask;
    let roleDetail = _.minBy(BaseService.loginUser.roles, 'accessLevel');
    vm.refTransID = data.eqpTaskID;
    vm.Equipment_Task = gencFileOwnerType;
    vm.repeatsTypeSchedule = {
      Daily: false,
      Weekly: false,
      Monthly: false,
      Quarterly: false,
      SemiAnnual: false,
      Annual: false
    };


    if (vm.equipmentTask) {
      active();
    }

    function active() {
      vm.refTransID = vm.equipmentTask && vm.equipmentTask.eqpTaskID ? vm.equipmentTask.eqpTaskID : vm.refTransID;
      _.each(vm.equipmentTask.equipmentTaskSchedule, (taskScheduleItem) => {
        var obj = _.find(Maintenance_Schedule_RepeatType, (item) => {
          return taskScheduleItem.repeatsType == item.value
        });
        if (obj) {
          vm.repeatsTypeSchedule[obj.Name] = true;
        }
      });
    }

    /* display file name and file */
    vm.documentFiles = (file, invalidFiles, $event) => {

      if (Array.isArray(invalidFiles) && invalidFiles.length > 0) {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALLOW_FILE_TO_UPLOAD);
        messageContent.message = stringFormat(messageContent.message, vm.AllowFileExtenstion);
        if (Array.isArray(file) && file.length > 0) {
          var totalLength = invalidFiles.length + file.length;
          var selectedFilesMsg = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECTED_VALID_FILE.message, file.length, totalLength);
          messageContent.message = selectedFilesMsg + "<br />" + messageContent.message;
        }
        else {
          messageContent.message = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UPLOAD_UNSUPPORTED_FILE.message + "<br />" + messageContent.message;
        }
        var model = {
          messageContent: messageContent,
          multiple: false
        };
        DialogFactory.messageAlertDialog(model);
      } else {
        _.each(file, (objFile, index) => {
          if (objFile.name == 'image.png') {
            file[index] = new File([objFile], `${new Date().getTime()}.png`, { type: 'image/png' });
          }
        });
        vm.equipmentTaskDocument = vm.equipmentTaskDocument || [];
        const existsFiles = _.intersectionBy(vm.files, file, 'name');
        const recentExistsFiles = _.intersectionBy(vm.equipmentTaskDocument, file, 'name');

        let fileName = _.union(_.map(existsFiles, 'name'), _.map(recentExistsFiles, 'name'));
        if (existsFiles.length > 0 || recentExistsFiles.length > 0) {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: `Document '${fileName.join(', ')}' already added.`,
            multiple: true
          }
          DialogFactory.alertDialog(model);
        }

        file.forEach((objFile) => {
          if (_.indexOf(fileName, objFile.name) == -1) {
            objFile.progressPercentage = 0;
            vm.equipmentTaskDocument.push(objFile);
          }
        });
      }
    };

    vm.isImage = (file) => {
      let filename = file.name;
      let ext = filename.split('.').pop();
      let fileObj = _.find(FileAllow, (file) => {
        return file.extension == '.' + ext;
      });
      if (file.type.indexOf("image") > -1) {
        return true;
      }
      else {
        file.icon = fileObj.icon;
        return false;
      }
    }

    /* To remove document from drag document area */
    vm.removeDocument = (index) => {
      $scope.IsRemove = true;
      vm.equipmentTaskDocument.splice(index, 1);
      $timeout(() => {
        $scope.IsRemove = false;
        $scope.$applyAsync();
      }, 0);
    };


    /*on click of save button for manage-task*/
    vm.saveequipment_managetask = () => {
      vm.isSubmit = false;
      if (vm.equipment_managetaskForm.$invalid) {
        vm.isSubmit = true;
        BaseService.focusRequiredField(vm.equipment_managetaskForm);
        return;
      }
      let repeatsType = [];
      _.each(vm.repeatsTypeSchedule, (repeatTypeItem, key) => {
        var obj = _.find(Maintenance_Schedule_RepeatType, (item) => {
          return key == item.Name && repeatTypeItem == true
        });
        if (obj) {
          repeatsType.push(obj.value);
        }
      });
      let equipmentTaskInfo = {
        taskDetail: vm.equipmentTask.taskDetail,
        repeatsTypeList: repeatsType,
        gencFileOwnerType: gencFileOwnerType,
        eqpID: eqpID,
        roleID: roleDetail.id
      }

      if (vm.equipmentTask && vm.equipmentTask.eqpTaskID) {
        vm.cgBusyLoading = EquipmentTaskFactory.equipmentTask().update({
          id: vm.equipmentTask.eqpTaskID,
        }, equipmentTaskInfo).$promise.then(() => {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(true);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = EquipmentTaskFactory.saveEquipmentTask({
          equipmentTaskInfo
        }, vm.equipmentTaskDocument).then((res) => {
          if (res && res.data && res.data.data) {
            vm.equipment_managetaskForm.$setPristine();
            vm.equipmentTask = res.data.data;
            active();
          }
          else {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.cancel(true);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.equipment_managetaskForm);
      if (isdirty) {
        let data = {
          form: vm.equipment_managetaskForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(true);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.equipment_managetaskForm);
    });
  }

})();

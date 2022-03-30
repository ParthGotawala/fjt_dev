(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ReleasePopupController', ReleasePopupController);

  /* @ngInject */
  function ReleasePopupController(data, $mdDialog, $filter, DialogFactory, CORE, BaseService, ReleaseNoteFactory) {
    var vm = this;
    vm.todayDate = new Date();
    vm.ReleaseVersionPattern = CORE.ReleaseVersionPattern;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.releasedDate] = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.release = {
      id: data && (data.Id || data.Id === 0) ? data.Id : null,
      releasedDate: data && data.releasedDate ? BaseService.getUIFormatedDate(data.releasedDate, vm.DefaultDateFormat) : null,
      version: data && data.version || null
    };
    vm.dateChangeFlag = false;
    vm.releasedDateOptions = {
      appendToBody: true,
      checkoutTimeOpenFlag: false,
      maxDate: vm.todayDate,
      releaseDateOpenFlag: false
    };

    //Save Release details
    vm.saveRelease = (isSaveNotes) => {
      if (BaseService.focusRequiredField(vm.releaseForm, true)) {
        return;
      }
      const displayReleasedDate = $filter('date')(vm.release.releasedDate, vm.DefaultDateFormat);
      vm.release.releasedDate = BaseService.getAPIFormatedDate(vm.release.releasedDate);
      vm.cgBusyLoading = ReleaseNoteFactory.saveReleaseDetails().save(vm.release).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && !isSaveNotes) {
          $mdDialog.cancel(response.data);
        } else if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && isSaveNotes) {
          response.data.releasedDate = displayReleasedDate;
          vm.saveReleaseNotes(response.data);
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data) {
          const result = response.errors.data;
          if (result.ErrorCode === 1) {
            duplicateMessage(true);
          } else if (result.ErrorCode === 2) {
            duplicateMessage(false);
          } else if (result.ErrorCode === 3) {
            duplicateMessage(false, true, result.status);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Save Release Details and Notes
    vm.saveReleaseNotes = (data) => {
      const objdata = {
        releasedID: data && data.Id || vm.release.id,
        version: data && data.version || vm.release.version,
        releasedDate: data && data.releasedDate ? data.releasedDate : vm.release.releasedDate
      };
      DialogFactory.dialogService(
        CORE.MANAGE_RELEASE_NOTE_POPUP_CONTROLLER,
        CORE.MANAGE_RELEASE_NOTE_POPUP_VIEW,
        null,
        objdata).
        then(() => {
        }, (data) => {
          $mdDialog.cancel(data);
        }, (error) => BaseService.getErrorLog(error));
    };

    //check ipAddress and node name unique validation
    vm.releaseNotesValidation = (isVersion) => {
      if (!vm.dateChangeFlag && (vm.release.releasedDate || vm.release.version)) {
        const query = {
          id: vm.release.id,
          version: vm.release.version,
          releasedDate: vm.release.releasedDate ? BaseService.getAPIFormatedDate(vm.release.releasedDate) : null
        };
        vm.dateChangeFlag = true;
        vm.cgBusyLoading = ReleaseNoteFactory.releaseNotesValidation().query(query).$promise.then((response) => {
          if (response && response.data && response.data[0] && response.data[0].ErrorCode !== 0) {
            const result = response.data[0];
            if ([1, 2].indexOf(result.ErrorCode) !== -1) {
              duplicateMessage(isVersion);
            } else if (result.ErrorCode === 3) {
              duplicateMessage(isVersion, true, result.status); //parameter 1. is version column , is invalid release date, invalid date version data
            }
          }
          vm.dateChangeFlag = false;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const duplicateMessage = (isVersion, isInvalid, invalidData) => {
      let messageContent;
      if (isInvalid) {
        const versions = invalidData.split('@@@'); // Split data because in SP concated data
        const firstVersion = parseInt(versions[0].split('.').join(''));
        const lastVersion = parseInt(versions[1].split('.').join(''));
        const currentVersion = parseInt(vm.release.version.split('.').join(''));
        if (currentVersion >= firstVersion && currentVersion <= lastVersion) { // if version is between two version and date invalid
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RELEASE_DATE_BETWEEN_INVALID);
          messageContent.message = stringFormat(messageContent.message, versions[0], versions[1]);
        } else if (lastVersion < currentVersion) { //  if version is less then last version
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RELEASE_DATE_LESS_THAN_INVALID);
          messageContent.message = stringFormat(messageContent.message, isNaN(firstVersion) ? versions[1] : versions[0]); // isNaN logic when there is no older version
        } else {  // if version is greater then last version
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RELEASE_DATE_GREATER_THAN_INVALID); // isNaN logic when there is no newer version
          messageContent.message = stringFormat(messageContent.message, isNaN(lastVersion) ? versions[0] : versions[1]);
        }
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, isVersion ? 'Version' : 'Release Date');
      }
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model).then(() => {
        const column = isVersion && !isInvalid ? 'version' : 'releasedDate';
        vm.release[column] = null;
        setFocusByName(column);
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = vm.releaseForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.releaseForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };
  };
})();

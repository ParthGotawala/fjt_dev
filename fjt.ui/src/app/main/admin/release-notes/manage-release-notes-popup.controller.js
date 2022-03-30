(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ReleaseNotePopupController', ReleaseNotePopupController);

  /* @ngInject */
  function ReleaseNotePopupController(data, $mdDialog, $filter, CORE, BaseService, ReleaseNoteFactory) {
    var vm = this;
    vm.data = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.headerdata = [];
    vm.DefaultDateFormat = _dateDisplayFormat;

    if (vm.data) {
      vm.releaseNotes = {
        releasedID: vm.data.releasedID || null,
        notes: vm.data.notes || null,
        id: vm.data.id || null
      };

      vm.headerdata.push({
        value: vm.data.version,
        label: 'Version',
        displayOrder: 1
      }, {
        value: BaseService.getUIFormatedDate(vm.data.releasedDate, vm.DefaultDateFormat),
        label: 'Release Date',
        displayOrder: 2
      });
    }
    //Save Release Notes
    vm.saveReleaseNotes = () => {
      if (BaseService.focusRequiredField(vm.releaseNoteForm, true)) {
        return;
      }
      const releaseNotesData = {
        notes: vm.releaseNotes.notes || null,
        id: vm.releaseNotes.id || null,
        releasedID: vm.releaseNotes.releasedID
      };
      vm.cgBusyLoading = ReleaseNoteFactory.saveReleaseNotesDetails().save(releaseNotesData).$promise.then((res) => {
        if (res.data) {
          $mdDialog.cancel(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

    /* called for max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      vm.entertext = vm.htmlToPlaintext(enterTextLength);
      return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
    };

    vm.cancel = () => {
      const isdirty = vm.releaseNoteForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.releaseNoteForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };
  };
})();

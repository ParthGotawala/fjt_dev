(function () {
  'use restrict';

  angular.module('app.core')
    .controller('HelpBlogNotesController', HelpBlogNotesController);

  /* @ngInject */
  function HelpBlogNotesController(data, $mdDialog, CORE, BaseService, HelpBlogFactory, DialogFactory, $timeout) {
    var vm = this;
    vm.data = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.displayInputStep = _amountInputStep;
    vm.headerdata = [];
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;

    vm.pageInit = (data) => {
      vm.helpBlogNote = {
        description: data ? data.description : null,
        id: data ? data.id : null,
        isSystemGenerated: data ? data.isSystemGenerated : false,
        displayOrder: data ? data.displayOrder : null,
        sectionTitle: data ? data.title : null
      };
      if (vm.helpBlogNoteForm) {
        $timeout(() => {
          vm.helpBlogNoteForm.$setPristine();
          vm.helpBlogNoteForm.$setUntouched();
        });
      }
    };

    /* go To Specific Menu */
    const goToMenu = (param) => {
      const isPage = _.find(BaseService.loginUserPageList, (data) => data.PageID === parseInt(param.pageID));
      if (isPage) {
        if (isPage.PageDetails) { BaseService.openInNew(isPage.PageDetails.pageRoute); }
      }
    };

    if (vm.data) {
      vm.headerdata.push({
        value: vm.data.menuName,
        label: 'Menu',
        displayOrder: 1,
        valueLinkFn: goToMenu,
        valueLinkFnParams: { pageID:vm.data.pageID }
      },
        {
          value: vm.data.pageTitle,
          label: 'Title',
          displayOrder: 2
        });
      vm.pageInit(vm.data);
      vm.helpBlogId = data && data.helpBlogId ? data.helpBlogId : null;
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.tempData = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.helpBlogNoteForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.helpBlogNoteForm);
        if (isdirty) {
          const data = {
            form: vm.helpBlogNoteForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.tempData);
      }
      setFocusByName('displayOrder');
    };

    // retrive help blog detail notes after save
    vm.retriveData = (buttonCategory, id) => {
      if (id) {
        vm.helpblogDetails = HelpBlogFactory.getHelpBlogDetailById().query({ id: id }).$promise.then((response) => {
          if (response && response.data) {
            vm.saveAndProceed(buttonCategory, response.data);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //Save Help Blog Notes
    vm.saveBlognotes = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.helpBlogNoteForm)) {
        if (vm.helpBlogNote.id && !vm.checkFormDirty(vm.helpBlogNoteForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.tempData);
        }
        return;
      }
      const blogNotesData = {
        helpBlogId: vm.helpBlogId || null,
        description: vm.helpBlogNote ? vm.helpBlogNote.description : null,
        title: vm.helpBlogNote ? vm.helpBlogNote.sectionTitle : null,
        id: vm.helpBlogNote ? vm.helpBlogNote.id : null,
        isSystemGenerated: vm.helpBlogNote ? vm.helpBlogNote.isSystemGenerated : false,
        displayOrder: vm.helpBlogNote ? vm.helpBlogNote.displayOrder : null
      };

      vm.cgBusyLoading = HelpBlogFactory.saveHelpBlogNotes().save(blogNotesData).$promise.then((res) => {
        if (res.data) {
          if (blogNotesData.id) {
            vm.retriveData(buttonCategory, blogNotesData.id);
          } else {
            vm.saveAndProceed(buttonCategory, res.data);
          }
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
      const isdirty = vm.helpBlogNoteForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.helpBlogNoteForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.helpBlogNoteForm];
    });
  };
})();

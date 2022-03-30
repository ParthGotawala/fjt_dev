(function () {
  'use strict';

  angular
    .module('app.configuration.managetemplate')
    .controller('ManageAgreementEmailTemplateController', ManageAgreementEmailTemplateController);

  /** @ngInject */
  function ManageAgreementEmailTemplateController($stateParams, AgreementFactory, BaseService, CORE, DialogFactory, CONFIGURATION, $state, textAngularManager) {
    var vm = this;
    vm.isEdit = false;
    vm.isUpdatable = true;
    vm.isView = false;
    vm.selectedAgreementTypeId = 0;
    vm.selectedAgreementId = 0;
    vm.manageAgreement = [];
    vm.isUnpublish = false;
    vm.id = $stateParams.agreementTypeID;
    vm.taToolbar = CORE.Toolbar;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.templateType = $stateParams.templateType;
    vm.templateTypeAllConst = CONFIGURATION.Agreement_Template_Type;
    vm.loginUser = BaseService.loginUser;
    vm.userName = vm.loginUser.employee.initialName;
    vm.userRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
    vm.roleName = vm.userRole.name;

    // Get Agreement Type and Last Published details
    vm.getAgreementDetails = (agreementTypeID) => {
      vm.cgBusyLoading = AgreementFactory.getAgreementDetails().query({ agreementTypeID: agreementTypeID }).$promise.then((template) => {
        if (template && template.data && template.data.data && template.data.data.length > 0) {
          vm.AgreementDetails = template.data.data[0];
          vm.DraftVersion = vm.AgreementDetails.draftversion;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Retrieve Agreement/Email Template Details
    function templateDetails(agreementTypeID) {
      vm.getAgreementDetails(vm.id);
      vm.isEdit = true;
      vm.cgBusyLoading = AgreementFactory.getAgreementTemplate().query({ agreementTypeID: agreementTypeID }).$promise.then((template) => {
        vm.agreementTypes = template.data;
        vm.VersonHistory = _.sortBy(vm.agreementTypes, 'version').reverse();
        if (vm.VersonHistory.length > 0) {
          const currentTemplate = vm.VersonHistory[0];
          vm.VersionModel = currentTemplate.version;
          vm.currentTemplatePublishedStatus = currentTemplate.isPublished;
          vm.manageAgreement = currentTemplate;
          vm.selectedVersionContent = currentTemplate.agreementContent;
          vm.selectedAgreementId = vm.manageAgreement.agreementID;
          vm.manageAgreement.SystemVariable = [];
          if (currentTemplate.system_variables !== null && currentTemplate.system_variables !== '') {
            vm.manageAgreement.SystemVariable = currentTemplate.system_variables.split(',');
          }
          else {
            vm.manageAgreement.SystemVariable[0] = CORE.DefaultSystemVariable;
          }
          vm.currentStatus = vm.currentTemplatePublishedStatus ? CONFIGURATION.HEADER_INFORMATION.PUBLISHED : CONFIGURATION.HEADER_INFORMATION.DRAFT;
          //if any unpublished version exist then disable save as new template btn when selecting any version from dropdown
          if (!vm.currentTemplatePublishedStatus) {
            vm.isShowPublishDate = false;
            vm.isUnpublish = true;
            vm.PublishbtnDisplay = true;
            vm.isEditable = true;
          } else {
            vm.isShowPublishDate = true;
            vm.isUnpublish = false;
            vm.PublishbtnDisplay = false;
            vm.isEditable = false;
          }
          /* here converted companyLogoHtmlTag to image logo (path) */
          vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage)) : vm.manageAgreement.agreementContent;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (vm.id !== 0) {
      templateDetails(vm.id);
    }

    vm.addVariable = function (variable) {
      var editor = textAngularManager.retrieveEditor('agreementContentEditor').scope;
      editor.displayElements.text.trigger('focus');
      editor.wrapSelection('insertHTML', variable);
    };

    vm.checkFormDirty = (form) => {
      const checkDirty = BaseService.checkFormDirty(form, null);
      return checkDirty;
    };

    vm.BackToTemplateList = () => {
      if (vm.checkFormDirty(vm.ManageAgreementForm)) {
        showWithoutSavingAlertforBackButton();
      }
      else {
        vm.close();
      }
    };

    // Render Template based on selected version
    vm.LoadAgreementTemplateData = (version) => {
      vm.selectedVersionContent = version.agreementContent;
      if (version.isPublished === true) {
        vm.isversiondisble = true;
      }
      vm.manageAgreement = version;
      vm.isShowPublishDate = vm.manageAgreement.isPublished;
      /* here converted companyLogoHtmlTag to image logo (path) */
      vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage)) : vm.manageAgreement.agreementContent;
      vm.manageAgreement.SystemVariable = [];
      if (version.system_variables !== null && version.system_variables !== '') {
        vm.manageAgreement.SystemVariable = version.system_variables.split(',');
      }
      else {
        vm.manageAgreement.SystemVariable[0] = CORE.DefaultSystemVariable;
      }
      BaseService.currentPageForms = [];
      vm.ManageAgreementForm.$setPristine();
      vm.ManageAgreementForm.$setUntouched();
    };

    // Confirmation on version changed in case of Form dirty
    vm.confirmationOnVersionChanged = (oldVersion, version) => {
      if (vm.checkFormDirty(vm.ManageAgreementForm)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_VERSION_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const oldVersionDetails = vm.agreementTypes.find((x) => x.version === oldVersion);
            if (oldVersionDetails) {
              oldVersionDetails.agreementContent = vm.selectedVersionContent;
            }
            vm.LoadAgreementTemplateData(version);
            vm.VersionModel = version.version;
          }
        }, () => {
          vm.VersionModel = oldVersion;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.LoadAgreementTemplateData(version);
      }
    };

    vm.close = () => {
      vm.isEdit = false;
      BaseService.currentPageForms = [];
      vm.selectedAgreementTypeId = 0;
      if ($stateParams.templateType === CONFIGURATION.Agreement_Template_Type.EMAIL) {
        $state.go(CONFIGURATION.CONFIGURATION_EMAIL_TEMPLATE_STATE);
      } else if ($stateParams.templateType === CONFIGURATION.Agreement_Template_Type.AGREEMENT) {
        $state.go(CONFIGURATION.CONFIGURATION_AGREEMENT_STATE);
      }
    };

    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.close();
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    vm.SaveNewTemplate = () => {
      if (vm.ManageAgreementForm.$invalid) {
        BaseService.focusRequiredField(vm.ManageAgreementForm);
        return;
      }
      /* for converting content like &lt; &gt to < > */
      vm.manageAgreement.agreementContent = angular.element('<textarea />').html(vm.manageAgreement.agreementContent).text();

      vm.manageAgreement.version = parseInt(vm.AgreementDetails.LastPublishversion) + 1;
      vm.manageAgreement.isPublished = false;
      vm.manageAgreement.system_variables = vm.manageAgreement.SystemVariable.join(',');
      /* here converted back fjt logo (path) to companyLogoHtmlTag */
      vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(WebsiteBaseUrl + CompanyLogoImage, CORE.Template_System_Variables.companyLogoHtmlTag)) : vm.manageAgreement.agreementContent;
      vm.cgBusyLoading = AgreementFactory.Agreement().save(vm.manageAgreement).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPageForms = [];
          vm.ManageAgreementForm.$setPristine();
          vm.ManageAgreementForm.$setUntouched();
          templateDetails(vm.id);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Check Form confirmation in case of dirty state
    vm.getConfirmationForPublish = () => {
      if (vm.checkFormDirty(vm.ManageAgreementForm)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_PUBLISHED_TEMPLATE_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.openPublishPopup();
          }
        }, (error) => BaseService.getErrorLog(error));
      } else {
        vm.openPublishPopup();
      }
    };

    // Publish Agreement/Email Template
    vm.openPublishPopup = () => {
      const AgreementTypeID = Number(vm.id);
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISH_TEMPLATE_CONFIRM);

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.pageParameter = { agreementTypeID: AgreementTypeID, userName: vm.userName, userRoleName: vm.roleName };
          vm.cgBusyLoading = AgreementFactory.PublishAgreementTemplate().save(vm.pageParameter).$promise.then(() => {
              templateDetails(vm.id);
              BaseService.currentPageForms = [];
              vm.ManageAgreementForm.$setPristine();
              vm.ManageAgreementForm.$setUntouched();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.UpdateTemplate = () => {
      if (vm.ManageAgreementForm.$invalid) {
        BaseService.focusRequiredField(vm.ManageAgreementForm);
        return;
      }
      /* for converting content like &lt; &gt to < > */
      vm.manageAgreement.agreementContent = angular.element('<textarea />').html(vm.manageAgreement.agreementContent).text();
      vm.manageAgreement.version = parseInt(vm.AgreementDetails.LastPublishversion) + 1;
      vm.manageAgreement.isPublished = false;
      vm.manageAgreement.system_variables = vm.manageAgreement.SystemVariable.join(',');
      /* here converted back fjt logo (path) to companyLogoHtmlTag */
      vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(WebsiteBaseUrl + CompanyLogoImage, CORE.Template_System_Variables.companyLogoHtmlTag)) : vm.manageAgreement.agreementContent;
      vm.cgBusyLoading = AgreementFactory.Agreement().update({ agreementID: vm.selectedAgreementId }, vm.manageAgreement).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPageForms = [];
          vm.ManageAgreementForm.$setPristine();
          vm.ManageAgreementForm.$setUntouched();
          templateDetails(vm.id);
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.ManageAgreementForm];
    });
  }
})();

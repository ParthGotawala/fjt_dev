(function () {
  'use strict';

  angular
    .module('app.configuration.managetemplate')
    .controller('AgreementTemplateController', AgreementTemplateController);

  /** @ngInject */
  function AgreementTemplateController($mdDialog, $timeout, $state, $stateParams,
    CORE, USER, CONFIGURATION, AgreementFactory, DialogFactory, textAngularManager, BaseService, $filter, $scope) {
    const vm = this;
    vm.isEdit = false;
    vm.isUpdatable = true;
    vm.isView = false;
    vm.selectedAgreementTypeId = 0;
    vm.selectedAgreementId = 0;
    vm.manageAgreement = [];
    vm.isUnpublish = false;
    vm.EmptySearchMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.EMPTY_SEARCH_MESSAGE;
    vm.taToolbar = CORE.Toolbar;
    vm.dateFormat = _dateTimeFullTimeDisplayFormat;
    vm.templateType = $stateParams.templateType;
    vm.emailType = CONFIGURATION.Agreement_Template_Type.EMAIL;
    let aggrementTypesClone = [];
    vm.isClearCloseicon = true;
    vm.isHideSearchButton = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.templateTypeAllConst = CONFIGURATION.Agreement_Template_Type;
    vm.loginUser = BaseService.loginUser;
    vm.userName = vm.loginUser.employee.initialName;
    vm.userRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
    vm.roleName = vm.userRole.name;

    //let manageAgreementCopy = {};
    switch (vm.templateType) {
      case CONFIGURATION.Agreement_Template_Type.AGREEMENT:
        vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.AGREEMENT;
        break;
      case CONFIGURATION.Agreement_Template_Type.EMAIL:
        vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.MAIL_TEMPLATE;
        break;
    }

    vm.GetPreview = (preViewMessageBody, id) => {
      vm.isView = true;
      vm.selectedAgreementTypeId = id;
      vm.TemplateData = preViewMessageBody ? preViewMessageBody : "<p></p>";
      /* here converted  companyLogoHtmlTag to fjt logo (path)*/
      vm.TemplateData = vm.TemplateData.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage);
      _.each(vm.agreementTypes, (item) => {
        item.isactive = false;
        if (item.agreementTypeID === id) {
          item.isactive = true;
        }
      });
    };

    //Get list of Agreement Type
    const templateData = () => {
      vm.cgBusyLoading = AgreementFactory.getAgreementTypes().query({ templateType: vm.templateType }).$promise.then((template) => {
        vm.agreementTypes = template.data;
        vm.agreementTypes.forEach((item) => {
          item.agreements = _.sortBy(item.agreements, (Childitem) => { if (Childitem.version === 0) { return Infinity; } else { return Childitem.version; } }).reverse();
          /* here converted companyLogoHtmlTag to fjt logo (path) */
          item.PreViewMessageBody = item.agreements.length > 0 ? item.agreements[0].agreementContent.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage) : "<p></p>";
          const objmessage = _.find(item.agreements, (data) => data.version === 0);
          item.PublishbtnDisplay = objmessage !== null ? true : false;
          item.isactive = false;
        });
        aggrementTypesClone = angular.copy(vm.agreementTypes);
        if (vm.issave) {
          vm.GetPreview(vm.MessageBody, vm.AgreementTypeID);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    templateData();

    // Get Template data base on selected Agreement Type
    vm.GenrateAgreementBreadCrumVersion = (id, isPublishBtnDisplay) => {
      vm.isEdit = true;
      vm.cgBusyLoading = AgreementFactory.getAgreementTemplate({ agreementTypeID: id }).query().$promise.then((template) => {
        vm.VersonHistory = _.sortBy(template.data, (item) => { if (item.version === 0) { return Infinity; } else { return item.version; } }).reverse();
        _.find(vm.VersonHistory, (item) => {
          if (item.version === 0) {
            return vm.isEditable = true;
          }
          else {
            return vm.isEditable = false;
          }
        });
        var totRec = vm.VersonHistory.length;
        vm.isUnpublish = vm.manageAgreement.version === 0 ? true : false;
        if (totRec > 0) {
          var currentTemplate = vm.VersonHistory[0];
          vm.VersionModel = currentTemplate.version;
          vm.manageAgreement = currentTemplate;
          vm.selectedAgreementId = vm.manageAgreement.agreementID;
          vm.manageAgreement.SystemVariable = [];
          if (currentTemplate.system_variables !== null && currentTemplate.system_variables!== '') {
            vm.manageAgreement.SystemVariable = currentTemplate.system_variables.split(',');
          }
          else {
            vm.manageAgreement.SystemVariable[0] = CORE.DefaultSystemVariable;
          }

          //if any unpublished version exist then disable save as new template btn when selecting any version from dropdown
          vm.isUnpublish = vm.VersionModel === 0 ? true : false;
          vm.isPublishBtnDisplay = isPublishBtnDisplay;
          if (!isPublishBtnDisplay && vm.VersionModel !== 0) {
            vm.PublishbtnDisplay = false;
          }
          /* here converted companyLogoHtmlTag to image logo (path) */
          vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage)) : vm.manageAgreement.agreementContent;

          //manageAgreementCopy.agreementContent = angular.copy(vm.manageAgreement.agreementContent);
          //vm.checkDirtyObject = {
          //    columnName: ["agreementContent"],
          //    oldModelName: manageAgreementCopy,
          //    newModelName: vm.manageAgreement
          //}
        }
        vm.isPublishBtnDisplay = isPublishBtnDisplay;
      }).catch((error) => BaseService.getErrorLog(error));
      //Set as current form when page loaded
      BaseService.currentPageForms = [vm.ManageAgreementForm];
    };

    vm.LoadAgreementTemplateData = (version, isPublishbtnDisplay) => {
      if (isPublishbtnDisplay) {
        vm.isUnpublish = true;
        vm.PublishbtnDisplay = true;
      }
      if (version.isPublished === true) {
        vm.isversiondisble = true;
      }
      vm.manageAgreement = version;
      vm.isUnpublish = vm.manageAgreement.version === 0 ? true : false;
      vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(CORE.Template_System_Variables.companyLogoHtmlTag, WebsiteBaseUrl + CompanyLogoImage)) : vm.manageAgreement.agreementContent;
      vm.manageAgreement.SystemVariable = [];
      if (vm.manageAgreement.system_variables !== null && vm.manageAgreement.system_variables !== '') {
        vm.manageAgreement.SystemVariable = vm.manageAgreement.system_variables.split(',');
      }
      else {
        vm.manageAgreement.SystemVariable[0] = CORE.DefaultSystemVariable;
      }
    };

    vm.close = () => {
      vm.isEdit = false;
      vm.selectedAgreementTypeId = 0;
      BaseService.currentPagePopupForm = [];
    };

    vm.SaveNewTemplate = () => {
      if (vm.ManageAgreementForm.$invalid) {
        BaseService.focusRequiredField(vm.ManageAgreementForm);
        return;
      }
      /* for converting content like &lt; &gt to < > */
      vm.manageAgreement.agreementContent = angular.element('<textarea />').html(vm.manageAgreement.agreementContent).text();
      vm.manageAgreement.version = 0;
      vm.manageAgreement.isPublished = false;
      vm.manageAgreement.system_variables = vm.manageAgreement.SystemVariable.join(",");
      /* here converted back fjt logo (path) to companyLogoHtmlTag */
      vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(WebsiteBaseUrl + CompanyLogoImage, CORE.Template_System_Variables.companyLogoHtmlTag)) : vm.manageAgreement.agreementContent;
      vm.cgBusyLoading = AgreementFactory.Agreement().save(vm.manageAgreement).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPageForms = [];
          vm.close();
          templateData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.UpdateTemplate = () => {
      if (vm.ManageAgreementForm.$invalid) {
        BaseService.focusRequiredField(vm.ManageAgreementForm);
        return;
      }
      /* for converting content like &lt; &gt to < > */
      vm.manageAgreement.agreementContent = angular.element('<textarea />').html(vm.manageAgreement.agreementContent).text();
      vm.manageAgreement.isPublished = false;
      vm.manageAgreement.system_variables = vm.manageAgreement.SystemVariable.join(",");
      /* here converted back fjt logo (path) to companyLogoHtmlTag */
      vm.manageAgreement.agreementContent = vm.manageAgreement.agreementContent ? (vm.manageAgreement.agreementContent.replace(WebsiteBaseUrl + CompanyLogoImage, CORE.Template_System_Variables.companyLogoHtmlTag)) : vm.manageAgreement.agreementContent;
      vm.cgBusyLoading = AgreementFactory.Agreement().update({ agreementID: vm.selectedAgreementId }, vm.manageAgreement).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPageForms = [];
          vm.close();
          templateData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.PublishConfirmation = function (Messagebody, AgreementTypeID) {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISH_TEMPLATE_CONFIRM);

      let obj = {
        //title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        //textContent: CORE.MESSAGE_CONSTANT.TEMPLATEPUBLISHALERT,
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.pageParameter = { agreementTypeID: AgreementTypeID, userName: vm.userName, userRoleName: vm.roleName };
          vm.cgBusyLoading = AgreementFactory.PublishAgreementTemplate().save(vm.pageParameter).$promise.then((response) => {
            vm.close();
            templateData();
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.addVariable = function (variable) {
      var editor = textAngularManager.retrieveEditor('agreementContentEditor').scope;
      editor.displayElements.text.trigger('focus');
      editor.wrapSelection("insertHTML", variable);
    };

    vm.SearchPart = (searchText) => {
      if (!searchText) {
        vm.searchTextAgreementType = null;
        return;
      }
    };

    vm.SearchTemplate = (operationType, searchText) => {
      if (operationType === 'Search') {
        if (vm.searchTextAgreementType && vm.searchTextAgreementType.length > 0) {
          vm.isClearCloseicon = false;
          vm.isHideSearchButton = true;
          vm.agreementTypes = $filter('filter')(aggrementTypesClone, { agreementType: vm.searchTextAgreementType });
        }
        else {
          vm.isHideSearchButton = false;
          vm.isClearCloseicon = true;
          vm.agreementTypes = angular.copy(aggrementTypesClone);
        }
      }
      else if (operationType === 'RemoveSearch') {
        // vm.searchTextAgreementType = null;
        vm.agreementTypes = angular.copy(aggrementTypesClone);
      }
    };

    vm.BackToTemplateList = () => {
      if (vm.checkFormDirty(vm.ManageAgreementForm)) {
        showWithoutSavingAlertforBackButton();
      }
      else {
        vm.close();
      }
    };

    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        //title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        //textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes)
          vm.close();
      }, (error) =>  BaseService.getErrorLog(error));
    }

    vm.checkFormDirty = (form) => {
      const checkDirty = BaseService.checkFormDirty(form, null);
      return checkDirty;
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //close popup on page destroy
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();

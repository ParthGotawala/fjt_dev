(function () {
  'use strict';

  angular
    .module('app.admin.labeltemplates')
    .directive('addEditLabelTemplate', AddEditLabelTemplate);

  /** @ngInject */
  function AddEditLabelTemplate($state, USER, CORE, $stateParams, LabelTemplatesFactory, BaseService, ReceivingMaterialFactory, DialogFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        id: '=?'
      },
      templateUrl: 'app/directives/custom/addeditlabeltemplate/add-edit-labeltemplates.html',
      controller: AddEditLabelTemplateCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function AddEditLabelTemplateCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      //vm.isSucess = false;
      vm.manageLabelTemplate = {
        isActive: true,
        isVerified: false,
        defaultLabelTemplate: null
      };
      vm.RadioGroup = {
        isActive: {
          array: CORE.ActiveRadioGroup
        }
      };
      vm.id = $stateParams.id ? $stateParams.id : null;
      vm.dataelementList = CORE.LABELTEMPLATE_DEFAULTLABELTYPE;

      vm.RetriveLabelTemplate = () => {
        vm.cgBusyLoading = LabelTemplatesFactory.labeltemplates().query({ id: vm.id }).$promise.then((res) => {
          if (res && res.data && res.data.labeltemplates) {
            vm.manageLabelTemplate = res.data.labeltemplates;
            vm.oldTemplateName = vm.manageLabelTemplate.Name;
          }
        });
      };

      // If Update case then retrieve data
      if (vm.id) {
        vm.RetriveLabelTemplate();
      }

      angular.element(() => {
        $scope.$parent.vm.addEditLabelTemplatesForm = vm.addEditLabelTemplatesForm;
        BaseService.currentPageForms = [vm.addEditLabelTemplatesForm];
      });

      vm.SaveLabelTemplate = () => {
        const Object = {
          id: vm.id,
          Name: vm.manageLabelTemplate.Name,
          isActive: vm.manageLabelTemplate.isActive,
          isVerified: vm.manageLabelTemplate.isVerified,
          defaultLabelTemplate: vm.manageLabelTemplate.defaultLabelTemplate,
          isListPage: false
        };
        if (vm.id) {
          vm.cgBusyLoading = LabelTemplatesFactory.updateLabelTemplate().query({
            listObj: Object
          }).$promise.then((res) => {
            if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.manageLabelTemplate.defaultLabelTemplate !== 'Select') {
                const defaultLabelTemplate = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { ID: vm.manageLabelTemplate.defaultLabelTemplate });
                if (defaultLabelTemplate && defaultLabelTemplate.name === 'UMID') {
                  BaseService.setPrintStorage('PrintFormateOfUMID', Object);
                } else if (defaultLabelTemplate && defaultLabelTemplate.name === 'Search Material') {
                  BaseService.setPrintStorage('PrintFormateOfSearchMaterial', Object);
                }
              }
              vm.addEditLabelTemplatesForm.$setPristine();
            }
          }).catch((err) => BaseService.getErrorLog(err));
        }
        else {
          vm.cgBusyLoading = LabelTemplatesFactory.createLabelTemplate().query({
            listObj: Object
          }).$promise.then((res) => {
            if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.manageLabelTemplate.defaultLabelTemplate !== 'Select') {
                const defaultLabelTemplate = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { ID: vm.manageLabelTemplate.defaultLabelTemplate });
                if (defaultLabelTemplate && defaultLabelTemplate.name === 'UMID') {
                  BaseService.setPrintStorage('PrintFormateOfUMID', Object);
                } else if (defaultLabelTemplate && defaultLabelTemplate.name === 'Search Material') {
                  BaseService.setPrintStorage('PrintFormateOfSearchMaterial', Object);
                }
              }
              vm.addEditLabelTemplatesForm.$setPristine();
              if (res.data.response && res.data.response.id) {
                $state.go(USER.ADMIN_MANAGELABELTEMPLATES_STATE, {
                  id: res.data.response.id
                });
              }
            } else if (res && res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.addEditLabelTemplatesForm);
                });
              }
            }
          }).catch((err) => BaseService.getErrorLog(err));
        };
      };

      //verify Label Templates
      vm.verifyLabelTemplate = (PrinterFormatName) => {
        vm.PrinterFormatName = PrinterFormatName;
        const printObj = {
          'ServiceName': PrinterFormatName,
          'reqName': 'Web Service',
          'PrinterName': ''
        };

        vm.cgBusyLoading = ReceivingMaterialFactory.verifyLabelTemplate().query({ verifyObj: printObj }).$promise.then((res) => {
          if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            let messageObj = '';
            if (res.data.data && res.data.data.StatusCode &&
              res.data.data.StatusCode === CORE.API_RESPONSE_CODE.PAGE_NOT_FOUND) {
              vm.manageLabelTemplate.isVerified = false;
              vm.manageLabelTemplate.defaultLabelTemplate = null;
              messageObj = res.data.messageContent ? res.data.messageContent : undefined;
              vm.addEditLabelTemplatesForm.$setDirty();
            }
            else if (res.data.data && res.data.data.StatusCode &&
              res.data.data.StatusCode === CORE.API_RESPONSE_CODE.BAD_REQUEST) {
              messageObj = res.data.messageContent ? res.data.messageContent : undefined;
            }
            else {
              vm.manageLabelTemplate.isVerified = true;
              vm.addEditLabelTemplatesForm.$setDirty();
              messageObj = angular.copy(res.userMessage);
            }
            const obj = {
              messageContent: messageObj
            };
            DialogFactory.messageAlertDialog(obj);
          }
          else {
            vm.manageLabelTemplate.isVerified = false;
            vm.manageLabelTemplate.defaultLabelTemplate = null;
            vm.addEditLabelTemplatesForm.$setDirty();
          }
        }).catch((err) => BaseService.getErrorLog(err));
      };

      vm.verifyChangedFormatName = () => {
        if (vm.id && vm.oldTemplateName) {
          if (vm.oldTemplateName !== vm.manageLabelTemplate.Name) {
            vm.manageLabelTemplate.isVerified = false;
          }
        }
      };

      vm.changeActiveStatus = () => {
        if (!vm.manageLabelTemplate.isActive) {
          vm.manageLabelTemplate.defaultLabelTemplate = null;
        }
      };

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      $scope.$on('saveLabelTemplate', () => {
        vm.SaveLabelTemplate();
      });
    }
  }
})();

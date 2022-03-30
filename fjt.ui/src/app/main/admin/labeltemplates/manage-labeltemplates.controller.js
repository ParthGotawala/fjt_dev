(function () {
  'use strict';

  angular
    .module('app.admin.labeltemplates')
    .controller('ManageLabelTemplatesController', ManageLabelTemplatesController);
  /** @ngInject */
  function ManageLabelTemplatesController($state, $scope, $stateParams, USER, CORE, LabelTemplatesFactory, DialogFactory, BaseService, ReceivingMaterialFactory) {
    const vm = this;
    vm.id = $stateParams.id ? $stateParams.id : null;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    vm.saveBtnFlag = false;//setting only false then why created variable?
    vm.showconfiguration = false;
    vm.titleName = '';
    vm.manageLabelTemplates = {
      isActive: true
    };
    vm.labelSearchList = [];

    vm.goBack = (msWizard) => {
      if (vm.addEditLabelTemplatesForm.$dirty) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else {
        $state.go(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {
        });
      }
    };
    //Add Record
    vm.addrecord = () => {
      $state.go(USER.ADMIN_MANAGELABELTEMPLATES_STATE, { id: null });
    };

    function showWithoutSavingAlertforBackButton(msWizard) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (msWizard) {
            msWizard.currentStepForm().$setPristine();
          }
          $state.go(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {
          });
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    vm.RetriveLabelTemplate = () => {
      vm.cgBusyLoading = LabelTemplatesFactory.labeltemplates().query({ id: vm.id }).$promise.then((res) => {
        if (res && res.data && res.data.labeltemplates) {
          vm.manageLabelTemplates.labelName = res.data.labeltemplates.Name;
          vm.titleName = ' : ' + res.data.labeltemplates.Name;
        }
      });
    };

    // If Update case then retrieve data
    if (vm.id) {
      vm.RetriveLabelTemplate();
    }

    vm.SaveLabelTemplate = () => {
      if (BaseService.focusRequiredField(vm.addEditLabelTemplatesForm)) {
        return;
      }
      if (vm.addEditLabelTemplatesForm.$dirty) {
        $scope.$broadcast('saveLabelTemplate');
      }
    };

    vm.updateBartenderConfiguration = () => {
      if (BaseService.focusRequiredField(vm.managesBarTenderForm)) {
        return;
      }
      if (vm.managesBarTenderForm.$dirty && vm.managesBarTenderForm.$valid) {
        if (vm.manageLabelTemplates.BartenderServer && vm.manageLabelTemplates.BartenderServerPort) {
          const updateObject = {
            BartenderServer: vm.manageLabelTemplates.BartenderServer,
            BartenderServerPort: vm.manageLabelTemplates.BartenderServerPort
          };
          vm.cgBusyLoading = ReceivingMaterialFactory.saveBartenderServerDetails().query({
            updateObj: updateObject
          }).$promise.then((res) => {
            if (res && res.data) {
              vm.showconfiguration = false;
              if (vm.managesBarTenderForm) {
                vm.managesBarTenderForm.$setPristine();
              }
            }
          }).catch((err) => BaseService.getErrorLog(err));
        }
      }
    };

    //reset bartender server and port keys
    vm.resetBartenderConfiguration = () => {
      vm.cgBusyLoading = ReceivingMaterialFactory.getBartenderServerDetails().query().$promise.then((res) => {
        if (res && res.data) {
          const host = _.find(res.data, { key: 'BartenderServer' });
          const port = _.find(res.data, { key: 'BartenderServerPort' });
          vm.manageLabelTemplates.BartenderServer = host ? host.values : null;
          vm.manageLabelTemplates.BartenderServerPort = port ? port.values : null;
          vm.managesBarTenderForm.$setPristine();
        }
      }).catch((err) => BaseService.getErrorLog(err));
    };

    vm.autoCompleteLabelTemplate = {
      columnName: 'Name',
      keyColumnName: 'id',
      keyColumnId: 'id',
      inputName: 'LabelTemplate',
      placeholderName: 'Type here to search part',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: (data) => {
        if (data) {
          $state.go(USER.ADMIN_MANAGELABELTEMPLATES_STATE, { id: data.id });
        }
      },
      onSearchFn: function (query) {
        const searchobj = {
          searchText: query,
          SortColumns: [],
          page: 0
        };
        return getLabelTemplateSearch(searchobj);
      }
    };

    function getLabelTemplateSearch(searchObj) {
      return LabelTemplatesFactory.retriveLabelTemplatesList().query(searchObj).$promise.then((res) => {
        if (res && res.data) {
          vm.labelSearchList = res.data.labeltemplates;
        }
        else {
          vm.labelSearchList = [];
        }
        return vm.labelSearchList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.configureBartender = () => {
      vm.showconfiguration = true;
    };
    vm.closeConfiguration = () => {
      vm.showconfiguration = false;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    angular.element(() => {
      vm.resetBartenderConfiguration();
    });
  }
})();

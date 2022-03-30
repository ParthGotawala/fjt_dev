(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('companyProfilePreference', companyProfilePreference);

  /** @ngInject */
  function companyProfilePreference(BaseService, CompanyProfileFactory, CORE) {
    var directive = {
      restrict: 'E',
      scope: {
      },
      replace: true,
      templateUrl: 'app/directives/custom/company-profile-preference/company-profile-preference.html',
      controller: companyProfilePreferenceCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function companyProfilePreferenceCtrl($scope) {
      var vm = this;
      vm.turnTimeList = CORE.TURN_TIME_LIST;

      const getCompanyInfo = () => {
        vm.cgBusyLoading = CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
          if (company && company.data) {
            vm.companyProfile = angular.copy(company.data);
            initAutoComplete();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      getCompanyInfo();
      // auto complete detail for unit of time
      const initAutoComplete = () => {
        vm.autoCompleteTurnTime = {
          columnName: 'Type',
          keyColumnName: 'Value',
          keyColumnId: vm.companyProfile.unitOfTime,
          inputName: 'Turn Type',
          placeholderName: 'Turn Type',
          isRequired: true,
          isAddnew: false
        };
      };
      // update comapny details
      vm.updateCompanyInfo = () => {
        vm.saveBtnDisableFlag = true;
        if (BaseService.focusRequiredField(vm.companyPreferenceTabForm)) {
          vm.saveBtnDisableFlag = false;
          return;
        }
        vm.cgBusyLoading = CompanyProfileFactory.updateCompanyPreferences().query({ id: vm.companyProfile.id, unitOfTime: vm.autoCompleteTurnTime.keyColumnId }).$promise.then(() => {
          vm.saveBtnDisableFlag = false;
          vm.companyPreferenceTabForm.$setPristine();
          vm.companyPreferenceTabForm.$setUntouched();
        }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
          vm.saveBtnDisableFlag = false;
        });
      };

      $scope.$on('updatecompanyProfileDetails', () => {
        vm.updateCompanyInfo();
      });
    };
  }
})();

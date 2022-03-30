(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('DescriptionPopupController', DescriptionPopupController);

  /** @ngInject */
  function DescriptionPopupController($mdDialog, data, CONFIGURATION, $filter) {
    const vm = this;
    vm.data = data;
    vm.copyStrDescription = data && data.description ? angular.copy(data.description).replace(/\<br \/\>/g, '\n') : null;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.headerdata = [];
    if (vm.data.isArchieveVersion) {
      vm.LastPublishDate = $filter('date')(new Date(vm.data.lastPublishedDate), vm.DefaultDateFormat);
      vm.headerdata.push({
        value: vm.data.latestVersion,
        label: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_VERSION,
        displayOrder: 1
      }, {
        value: vm.LastPublishDate,
        label: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_DATE,
        displayOrder: 2
      });
    } else if (vm.data.label === 'Log Type') {
      vm.headerdata.push({
        label: vm.data.label,
        value: vm.data.name,
        displayOrder: 1
      });
      vm.headerdata.push({
        label: vm.data.label2,
        value: $filter('date')(new Date(vm.data.logTime), vm.DefaultDateTimeFormat),
        displayOrder: 2
      });
    } else if (data.headerData) {
      vm.headerdata = data.headerData;
    } else {
      vm.headerdata.push({
        label: data.label,
        value: data.name,
          displayOrder: 1,
          isCopy: data.isCopy ? true : false
      });
    }
  }
})();

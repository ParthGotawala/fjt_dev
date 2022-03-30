(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('taskListSectionView', taskListSectionView);

  /** @ngInject */
  function taskListSectionView(CORE, $state, BaseService, $compile, DialogFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        item: '=',
        onClickSelect: '&',
        msWizard: '=?',
        isFromTraveler: '=?'
      },
      link: function (scope, element, attrs) {
        scope.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;
        scope.LabelConstant = CORE.LabelConstant;
        // scope.item.activated = false;

        // var loadingIndicator = $compile(
        //'    <md-progress-circular class="md-accent" md-diameter="40"></md-progress-circular>'
        // )(scope);
        // element.addClass('hide');
        // element.after(loadingIndicator);

        //scope.$watch(attrs.showWhenLoaded, function (result) {
        //    if (result === true) {
        //        loadingIndicator.remove();
        //        element.removeClass('hide');
        //    } else {
        //        element.addClass('hide');
        //        element.after(loadingIndicator);
        //    }
        //});

        /* set item active on click  */
        scope.setItemActive = (itemParams, msWizardParams) => {
          scope.onClickSelect(itemParams, msWizardParams);
        };

        // Workorder
        scope.goToWorkorderList = (data) => {
          BaseService.goToWorkorderList();
          return false;
        };
        scope.goToWorkorderDetails = (data) => {
          BaseService.goToWorkorderDetails(data.woID);
          return false;
        };

        // Assembly
        scope.goToAssemblyList = (data) => {
            BaseService.goToPartList();
          return false;
        };

        scope.goToAssemblyDetails = (data) => {
            BaseService.goToComponentDetailTab(null, data.partID);
          return false;
        };

        // Operation/Traveler
        scope.goToOperationList = (data) => {
          BaseService.goToOperationList(data.woID);
          return false;
        };

        scope.goToTravelerOperationDetails = (data) => {
          BaseService.goToTravelerOperationDetails(data.woOPID, data.employeeID, data.woOPID);
          return false;
        };

        //open popup to show available rack list page
        scope.openAvailableRack = (item) => {
          const data = angular.copy(item);
          DialogFactory.dialogService(
            CORE.SHOW_AVAILABLE_RACK_MODAL_CONTROLLER,
            CORE.SHOW_AVAILABLE_RACK_MODAL_VIEW,
            event,
            data).then(() => {
            }, (err) => BaseService.getErrorLog(err));
        };
        //setTimeout(() => {
        //    scope.item.activated = true;
        //}, 1000)
      },
      templateUrl: 'app/directives/custom/task-list-section-view/task-list-section-view.html'
    };
    return directive;
  }
})();

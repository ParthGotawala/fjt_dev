(function () {
  'use strict';

  angular
    .module('app.reports.dynamicreports')
    .controller('DynamicReportsController', DynamicReportsController);

  /** @ngInject */
  function DynamicReportsController($scope, DYNAMIC_REPORTS, CORE, REPORTS, BaseService, DialogFactory, ReportMasterFactory, $mdDialog, $timeout, $location, $state, $stateParams) {
    const vm = this;
    // vm.isUpdatable = true;
    vm.reportData = null;
    vm.isUpdatable = true;
    vm.isDesignReport = true;
    vm.isViewReport = false;
    vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.REPORT_SETTING;
    vm.DefaultDateFormat = _dateDisplayFormat;
    //vm.gridConfig = CORE.gridConfig;
    //vm.LabelConstant = CORE.LabelConstant;
    //vm.PartCategory = CORE.PartCategory;
    //vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    //vm.REPORT_FILTER_FIELD_OPTIONS = REPORTS.REPORT_FILTER_FIELD_OPTIONS;
    vm.stateParamsDet = {
      keywords: $stateParams.keywords
    };
    vm.isDisableAddReport = vm.stateParamsDet && vm.stateParamsDet.keywords === CORE.TEMPLATE_REPORTS_KEYWORD;

    vm.selectedPartList = [];

    vm.generatereport = (isDownload, ev, isCSVDownload) => {
      var reportDetail = {
        isDownload: isDownload,
        ev: ev,
        isCSVDownload: isCSVDownload
      };
      $scope.$broadcast("generateReportCall", reportDetail);
    };
    vm.clearFilter = () => {
      $scope.$broadcast("clearFilterCall");
    };

    /* add.edit report name*/
    vm.addEditRecord = (data, ev) => {
      ReportMasterFactory.checkApplicationStatus().query().$promise.then((res) => {
        if (res) {
          DialogFactory.dialogService(
            DYNAMIC_REPORTS.DYNAMIC_REPORTS_ADD_UPDATE_MODAL_CONTROLLER,
            DYNAMIC_REPORTS.DYNAMIC_REPORTS_ADD_UPDATE_MODAL_VIEW,
            ev,
            data).then((response) => {
              if (response) {
                const reportInfo = {
                  reportId: response.id
                };
                startActivity(reportInfo, response);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* update report name*/
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    function startActivity(reportInfo, reportDetail) {
      vm.cgBusyLoading = ReportMasterFactory.startActivity().save(reportInfo).$promise.then((activityResponse) => {
        if (activityResponse && activityResponse.status === CORE.ApiResponseTypeStatus.SUCCESS && activityResponse.data) {
          BaseService.redirectToDesigner(reportDetail.fileName);
        }
        $scope.$broadcast('refreshUIGridList');
      }).catch((error) => {
        vm.clickCancel = false;
        BaseService.getErrorLog(error);
      });
    }

    //// Redirect to Designer Report Page
    //vm.designReport = (row, ev) => {
    //  let reportInfo = {
    //    refReportId: row.entity.id
    //  }
    //  startActivity(row.entity);
    //};

    // Redirect to View Report
    //vm.viewReport = (row, ev) => {
    //  var reportId = btoa(row.entity.fileName);
    //  BaseService.goToDynamicReportViewer(reportId);
    //};

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });

    angular.element(() => {
      vm.enableAddReportFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToAddReport);
    });
  }

})();

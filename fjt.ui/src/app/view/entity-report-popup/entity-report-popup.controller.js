(function () {
  'use strict';

  angular
    .module('app.reports.dynamicreports')
    .controller('ViewEntityReportPopupController', ViewEntityReportPopupController);

  /** @ngInject */
  function ViewEntityReportPopupController($mdDialog, $scope, data, CORE, NotificationFactory, DialogFactory, ReportMasterFactory, DYNAMIC_REPORTS, REPORTS, BaseService, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.loginUser = BaseService.loginUser;
    vm.userId = vm.loginUser.userid;
    vm.roleId = vm.loginUser.defaultLoginRoleID;
    vm.CORE_REPORT_CATEGORY = CORE.REPORT_CATEGORY;
    vm.getReportStatusClassName = (status) => BaseService.getReportStatusClassName(status);
    vm.reportModel = {};
    vm.reportList = [];
    vm.headerdata = [];
    if (data) {
      vm.parameterValueJson = data.parameterValueJson;
      vm.entityId = data.entityId;
      vm.entityName = data.entityName;
      vm.reportName = data.reportName;
      vm.headerdata = data.headerdata;
    }

    // bindAutoCompleteSearchReport();
    function resetReportList() {
      const searchObj = {
        entityId: vm.entityId
      };
      getReportSearch(searchObj);
    }
    resetReportList();

    function getReportSearch(searchObj) {
      return ReportMasterFactory.getReportListByEntity().query({ listObj: searchObj }).$promise.then((response) => {
        if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && Array.isArray(response.data) && response.data.length >= 1) {
          vm.entityReportList = vm.reportList.concat(response.data);
          let defaultReport = null;
          if (vm.selectedReportId) {
            defaultReport = _.find(vm.entityReportList, (item) => item.id === vm.selectedReportId);
          }
          else {
            defaultReport = _.find(vm.entityReportList, (item) => item.isDefaultReport === true);
          }
          if (defaultReport) {
            $timeout(() => {
              vm.selectedReport = defaultReport;
              vm.selectedReportId = defaultReport.id;;
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.copyUpdateReport = (reportDet, isCopyAction, ev) => {
      let data = {};
      if (reportDet) {
        data = {
          isDisableRadioBtn: true,
          selectedCloneReportId: reportDet.id
        };
        reportDet.isSystemGeneratedReport = reportDet.reportGenerationType === CORE.REPORT_CATEGORY.SYSTEM_GENERATED_REPORT; // false
      } else {
        reportDet = {
          isTransactionReport: true,
          entityId: vm.entityId
        };
      }
      ReportMasterFactory.checkApplicationStatus().query().$promise.then((res) => {
        if (res) {
          DialogFactory.dialogService(
            DYNAMIC_REPORTS.DYNAMIC_REPORTS_ADD_UPDATE_MODAL_CONTROLLER,
            DYNAMIC_REPORTS.DYNAMIC_REPORTS_ADD_UPDATE_MODAL_VIEW,
            ev,
            isCopyAction ? data : reportDet).then((response) => {
              if (response) {
                vm.selectedReportId = response.id;
                resetReportList();

                if (isCopyAction) {
                  const reportInfo = {
                    reportId: response.id
                  };
                  startActivity(reportInfo, response);
                }
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.designReport = (reportDet) => {
      const reportInfo = {
        reportId: reportDet.id
      };
      const reportDetail = {
        fileName: reportDet.fileName
      };
      startActivity(reportInfo, reportDetail);
    };

    vm.selectReport = () => {
      vm.selectedReport = _.find(vm.entityReportList, (item) => (item.id === vm.selectedReportId));
    };

    vm.deleteReport = (reportDet) => {
      let selectedIDs = [];
      selectedIDs.push(reportDet.id);
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Report', '');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      const objIDs = {
        id: selectedIDs,
        CountList: false
      };
      DialogFactory.messageConfirmDialog(obj).then((resposne) => {
        if (resposne) {
          vm.cgBusyLoading = ReportMasterFactory.deleteReports().query({ objIDs: objIDs }).$promise.then((data) => {
            if (data && data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.selectedReportId = vm.selectedReportId === reportDet.id ? null : vm.selectedReportId;
              resetReportList();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function startActivity(reportInfo, reportDetail) {
      vm.cgBusyLoading = ReportMasterFactory.startActivity().save(reportInfo).$promise.then((activityResponse) => {
        if (activityResponse && activityResponse.status === CORE.ApiResponseTypeStatus.SUCCESS && activityResponse.data) {
          BaseService.redirectToDesigner(reportDetail.fileName);
        }
      }).catch((error) => {
        vm.clickCancel = false;
        BaseService.getErrorLog(error);
      });
    }

    vm.previewReport = (isDownload) => {
      const reportInfo = {
        id: vm.selectedReport.id,
        parameterValueJson: vm.parameterValueJson,
        reportName: vm.reportName,
        createdBy: vm.userId.toString(),
        updatedBy: vm.userId.toString(),
        createByRoleId: vm.roleId,
        updateByRoleId: vm.roleId
      };

      viewReport(reportInfo, isDownload);
    };

    function viewReport(reportFilterDetails, isDownload) {
      vm.cgBusyLoading = ReportMasterFactory.saveReportViewerParameter(reportFilterDetails).then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (isDownload) {
            vm.cgBusyLoading = ReportMasterFactory.downloadReport({ ParameterGuid: response.data }).then((downloadReportRes) => {
              $mdDialog.hide();
              BaseService.downloadReportFromReportingTool(downloadReportRes, reportFilterDetails.reportName, true);
            });
          }
          else {
            $mdDialog.hide();
            BaseService.redirectToViewer(response.data);
          }
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    angular.element(() => {
      vm.enableAddReportFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToAddReport);
      vm.enableDesignReportFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowDesignReport);
      setFocus('previewReport');
    });
  }
})();

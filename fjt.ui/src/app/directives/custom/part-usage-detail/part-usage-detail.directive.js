(function () {
  'use strict';
  angular.module('app.core').directive('partUsageDetail', partUsageDetail);

  /** @ngInject */
  function partUsageDetail(BaseService, CORE, DialogFactory, ComponentFactory, USER) {
    let directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '='
      },
      templateUrl: 'app/directives/custom/part-usage-detail/part-usage-detail.html',
      controller: PartUsageDetailController,
      controllerAs: 'vm',
      link: function (scope, element, attrs) {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Part Usage detail
    * @param
    */
    function PartUsageDetailController($scope, $filter, $timeout, USER, WIDGET, REPORTS, CORE, DialogFactory, ReportMasterFactory, BaseService, ComponentFactory) {
      const vm = this;
      vm.partid = $scope.partId;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.toDate = new Date();
      vm.fromDate = new Date();
      vm.fromDate.setDate(vm.fromDate.getDate() - 180);
      vm.EmptyMesssage = REPORTS.REPORTS_EMPTYSTATE.PART_USAGE_REPORT;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.fromDateChanged = () => {
        if (vm.toDate && vm.fromDate) {
          if (vm.fromDate > vm.toDate) {
            vm.toDate = null;
          }
          vm.fromDateOptions = {
            fromDateOpenFlag: false
          };
        }
      }

      vm.toDateChanged = () => {
        if (vm.toDate && vm.fromDate) {
          if (vm.toDate < vm.fromDate) {
            vm.fromDate = null;
          }
          vm.toDateOptions = {
            toDateOpenFlag: false
          };
        }
      }

      vm.getpartUsageDetails = () => {
        vm.cgBusyLoading = ComponentFactory.getPartUsageDetail().query({
          partID: vm.partid,
          fromDate: $filter('date')(new Date(vm.fromDate), CORE.MySql_Store_Date_Format),
          toDate: $filter('date')(new Date(vm.toDate), CORE.MySql_Store_Date_Format)
        }).$promise.then((response) => {
          if (response && response.data) {
            vm.partusageDetail = response.data.partUsageDetail;
            vm.assyWiseUsageDetail = response.data.AssyWiseUsageDetail;
            vm.monthWiseUsageDetail = response.data.MonthWiseUsageDetail;
            var monthUsageObj = {
              title: "Month Wise Usage",
              xAxisName: "Month",
              yAxisName: "Usage Quantity",
              seriesdata: "UsageQuantity,WithPackagingUsageQty",
              seriesTitle: "Usage Quantity,Usage Qty With Packaging Alias",
              seriesColor: "#00ff00,#9B870C",
              xAxisVal: 'usageMonthYear',
              yAxisVal: 'UsageQuantity',
            }
            var assyUsageObj = {
              title: "Assembly Wise Usage",
              xAxisName: "Assy ID",
              yAxisName: "Usage Quantity",
              seriesdata: "UsageQuantity,WithPackagingUsageQty",
              seriesTitle: "Usage Quantity,Usage Qty With Packaging Alias",
              seriesColor: "#00ff00,#9B870C",
              xAxisVal: 'assyID',
              yAxisVal: 'UsageQuantity',
            }
            vm.assywiseUsagechartObj = {
              chartData: vm.assyWiseUsageDetail,
              chartSetting: assyUsageObj,
              chartType: WIDGET.CHART_NAME.PIE
            }
            vm.MonthwiseUsagechartObj = {
              chartData: vm.monthWiseUsageDetail,
              chartSetting: monthUsageObj,
              chartType: WIDGET.CHART_NAME.LINE
            }
            if (response.data.partDetail.length == 1) {
              let partDetail = response.data.partDetail[0];
              $scope.$parent.vm.headerdata = [{
                label: vm.LabelConstant.MFG.MFG,
                value: partDetail.MFR,
                displayOrder: 1,
                labelLinkFn: $scope.$parent.vm.goToManufacturerList,
                valueLinkFn: $scope.$parent.vm.goToManufacturer,
                valueLinkFnParams: partDetail.mfgcodeID,
                isCopy: false,
              }, {
                label: vm.LabelConstant.MFG.PID,
                value: partDetail.PIDCode,
                displayOrder: 1,
                labelLinkFn: $scope.$parent.vm.goToPartList,
                valueLinkFn: $scope.$parent.vm.goToComponentDetail,
                valueLinkFnParams: partDetail.id,
                isCopy: true,
                isCopyAheadLabel: true,
                isAssy: true,
                imgParms: {
                  imgPath: vm.rohsImagePath + partDetail.RohsIcon,
                  imgDetail: partDetail.rohsName
                },
                isCopyAheadOtherThanValue: true,
                copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
                copyAheadValue: partDetail.mfgPN
              }];
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      vm.getpartUsageDetails();

      vm.GenerateReport = (isDownload) => {
        let paramobj = {
          partID: vm.partid,
          todate: vm.toDate ? $filter('date')(new Date(vm.toDate), CORE.MySql_Store_Date_Format) : null,
          fromdate: vm.fromDate ? $filter('date')(new Date(vm.fromDate), CORE.MySql_Store_Date_Format) : null,
          reportAPI: "Part/generatePartUsageReport",
          reportName: "Part Usage"
        }
        vm.cgBusyLoading = ReportMasterFactory.generateReport(paramobj).then((response) => {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: '',
            multiple: true
          };
          if (response.status == 404) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound;
            DialogFactory.alertDialog(model);
          } else if (response.status == 204) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NoContent;
            DialogFactory.alertDialog(model);
          } else if (response.status == 403) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied;
            DialogFactory.alertDialog(model);
          } else if (response.status == 401) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized;
            DialogFactory.alertDialog(model);
          } else if (response.status == -1) {
            model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.ServiceUnavailable;
            DialogFactory.alertDialog(model);
          } else {
            let blob = new Blob([response.data], {
              type: 'application/pdf'
            });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, paramobj.reportName + '.pdf')
            } else {
              let link = document.createElement("a");
              if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                if (isDownload) {
                  link.setAttribute("download", paramobj.reportName + '.pdf');
                } else {
                  link.setAttribute("target", "_blank");
                }
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
              }
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
  }
})();

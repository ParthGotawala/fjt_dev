(function () {
  'use strict';

  angular.module('app.transaction.packingSlip')
    .controller('PackingSlipController', PackingSlipController);

  /** @ngInject */
  function PackingSlipController($state, $timeout, BaseService, PackingSlipFactory, DialogFactory, CORE, TRANSACTION) {
    const vm = this;
    vm.transactionReceiptType = angular.copy(TRANSACTION.PackingSlipInvoiceTabName);

      vm.addPackingSlip = () => BaseService.goToManagePackingSlipDetail();

    vm.supplierPerformanceReport = (isDownload) => {
      let currentDate = new Date();
      let currentDateForFromDate = new Date();
      let lastYearDate = new Date(currentDateForFromDate.setFullYear(currentDateForFromDate.getFullYear() - 1));
      let paramobj = {
        fromDate: BaseService.getAPIFormatedDate(lastYearDate),
        toDate: BaseService.getAPIFormatedDate(currentDate),
        loginUserEmployeeID: BaseService.loginUser.employee.id
      }
      vm.cgBusyLoading = PackingSlipFactory.downloadSupplierPerformanceReport(paramobj).then((response) => {
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
            navigator.msSaveOrOpenBlob(blob, 'SupplierPerformance.pdf')
          } else {
            let link = document.createElement("a");
            if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              if (isDownload) {
                link.setAttribute("download", 'SupplierPerformance.pdf');
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
})();

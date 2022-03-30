(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('rfqAssemblyQuoteStatus', rfqAssemblyQuoteStatus);

    /** @ngInject */
    function rfqAssemblyQuoteStatus(BaseService, PRICING, RFQTRANSACTION) {
        let directive = {
            restrict: 'E',
            replace: true,
            scope: {
                rowData: '=',
            },
            templateUrl: 'app/directives/custom/rfq-assembly-quote-status/rfq-assembly-quote-status.html',
            controller: rfqAssemblyQuoteStatusCtrl,
            controllerAs: 'vm',
            link: function (scope, element, attrs) {
                scope.$watch('rowData',  (newValue) =>{
                    var statusConst = RFQTRANSACTION.RFQ_QUOTE_STATUS;
                    var quotestatus = newValue.QuoteStatus ? newValue.QuoteStatus.split(',') : null;
                    var status = {};
                    if (quotestatus) {
                      _.each(quotestatus, (item) => {
                        var obj = item.split(':');
                        status[obj[0]] = obj[1];
                      });
                    } else {
                        status[statusConst.STATUS_TYPE.BOM] = statusConst.STATUS.NONE;
                        status[statusConst.STATUS_TYPE.LABOR] = statusConst.STATUS.NONE;
                        status[statusConst.STATUS_TYPE.MATERIAL_COSTING] = statusConst.STATUS.NONE;
                        status[statusConst.STATUS_TYPE.SUMMARY] = statusConst.STATUS.NONE;
                        status[statusConst.STATUS_TYPE.CUSTOM_PART_COSTING] = statusConst.STATUS.NONE;
                    }
                    scope.rowData = newValue;
                    scope.statusType = statusConst;
                    scope.quotestatus = status;
                    scope.color = 'color:white !important';
                });
            }
        };
        return directive;


        /** @ngInject */
        /**
        * Controller for view data of alternative details
        *
        * @param
        */
        function rfqAssemblyQuoteStatusCtrl($scope, $state, $element, $attrs, $filter, RFQTRANSACTION, CORE, DialogFactory, BaseService) {
            let vm = this;
            vm.quotePageType = RFQTRANSACTION.QUOTE_PAGE_TYPE;
            //copy part number on click
          vm.goTOBOM = (rowData, page) => {
            if (page === 'BOM') {
              BaseService.openInNew(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: rowData.rfqAssyID, partId: rowData.partID });
              // $state.go(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, { id: rowData.rfqAssyID, partId: rowData.partID });
            } else if (page === 'Pricing') {
              if (rowData.isReadyForPricing) {
                BaseService.openInNew(RFQTRANSACTION.RFQ_PART_COSTING_STATE, { id: rowData.rfqAssyID });
                //$state.go(RFQTRANSACTION.RFQ_PART_COSTING_STATE, { id: rowData.rfqAssyID });
              }
              else {
                const alertModel = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: 'Coming soon...'
                };
                DialogFactory.alertDialog(alertModel);
              }
            } else if (page === 'Summary') {
              if (rowData.isReadyForPricing && rowData.isSummaryComplete) {
                BaseService.openInNew(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: rowData.rfqAssyID, quoteSubmittedID: rowData.lastQuoteID, pageType: vm.quotePageType.QUOTE.Name });
                //$state.go(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: rowData.rfqAssyID, quoteSubmittedID: rowData.lastQuoteID, pageType: vm.quotePageType.QUOTE.Name }, { reload: true });
              }
              else if (rowData.isReadyForPricing) {
                BaseService.openInNew(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: rowData.rfqAssyID });
                //$state.go(RFQTRANSACTION.RFQ_SUMMARY_STATE, { id: rowData.rfqAssyID });
              } else {
                const alertModel = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: 'Coming soon...'
                };
                DialogFactory.alertDialog(alertModel);
              }
            } else {
              if (rowData.isReadyForPricing) {
                BaseService.openInNew(RFQTRANSACTION.RFQ_LABOR_STATE, { id: rowData.rfqAssyID, partId: rowData.partID });
                // $state.go(RFQTRANSACTION.RFQ_LABOR_STATE, { id: rowData.rfqAssyID, partId: rowData.partID });
              }
              else {
                const alertModel = {
                  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
                  textContent: 'Coming soon...'
                };
                DialogFactory.alertDialog(alertModel);
              }
            }
          };
        }
    }
})();

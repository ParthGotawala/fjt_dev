(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('KitFeasibilityPopUpController', KitFeasibilityPopUpController);

  /** @ngInject */
  function KitFeasibilityPopUpController($mdDialog, $filter, $state, DialogFactory, BaseService, USER, CORE, data, KitAllocationFactory, $timeout, RFQTRANSACTION, TRANSACTION) {
    const vm = this;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.feasibilityDetail = data || {};
    vm.feasibilityDetail.inputQty = vm.feasibilityDetail.inputQty || (vm.feasibilityDetail.salesOrderDetail && vm.feasibilityDetail.salesOrderDetail.SubKitQty ? vm.feasibilityDetail.salesOrderDetail.SubKitQty : vm.feasibilityDetail.salesOrderDetail.kitQty);
    vm.LabelConstant = CORE.LabelConstant;
    vm.CheckBuildFeasibility = CORE.LabelConstant.KitAllocation.CheckBuildFeasibility;
    vm.buildFeasibility = CORE.LabelConstant.KitAllocation.BuildFeasibility;
    vm.calculateBtnFlag = false;
    vm.calculatedKitQty = 0;
    vm.currentState = $state.current.name;

    vm.query = {
      order: ''
    };
    vm.feasibilityList = [];

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.feasibilityDetail.salesOrderDetail.soId);
      return false;
    };

    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.feasibilityDetail.assyID);
      return false;
    };

    vm.goToAssy = () => {
      BaseService.goToPartList();
      return false;
    };

    vm.updatekitmrpqty = () => {
      if (vm.feasibilityDetail && (vm.feasibilityDetail.refSalesOrderDetID && vm.feasibilityDetail.assyID)) {
        const obj = {
          salesOrderDetail: vm.feasibilityDetail.refSalesOrderDetID,
          mainAssyId: null,
          subAssyId: vm.feasibilityDetail.assyID
        };
        DialogFactory.dialogService(
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_CONTROLLER,
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_VIEW,
          null,
          obj).then(() => {
          }, (data) => {
            if (data && (vm.currentState !== TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE && vm.currentState !== TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE)) {
              $mdDialog.cancel(data);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.headerdata = [
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.feasibilityDetail.salesOrderDetail.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        isCopy: true
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.feasibilityDetail.salesOrderDetail.soNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder,
        isCopy: true
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.feasibilityDetail.salesOrderDetail.assyPIDCode || vm.feasibilityDetail.salesOrderDetail.assyName,
        displayOrder: 3,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.feasibilityDetail.salesOrderDetail.rohsIcon,
          imgDetail: vm.feasibilityDetail.salesOrderDetail.rohs
        }
      },
      {
        label: 'Kit Qty',
        value: $filter('numberWithoutDecimal')(vm.feasibilityDetail.salesOrderDetail.kitQty),
        displayOrder: 4
      }];

    if (vm.feasibilityDetail.salesOrderDetail.SubKitQty) {
      vm.headerdata.push({
        label: 'Sub Assy Kit Qty',
        value: $filter('numberWithoutDecimal')(vm.feasibilityDetail.salesOrderDetail.SubKitQty),
        displayOrder: 5
      });
    }

    /** Get kit feasibility based on allocated stock */
    vm.getKitFeasibilityDetail = () => {
      vm.calculateBtnFlag = true;
      if (!vm.feasibilityDetail.inputQty) {
        return;
      }

      vm.cgBusyLoading = KitAllocationFactory.getKitFeasibility().query(vm.feasibilityDetail).$promise.then((response) => {
        if (response.data) {
          vm.calculateBtnFlag = false;
          vm.feasibilityList = response.data;
          vm.formKitFeasibility.$setPristine();
          vm.totalShortageLine = _.sumBy(vm.feasibilityList, 'shortageLine');
          vm.anyCalculatedShortegeLine = _.some(vm.feasibilityList, (data) => parseInt(data.shortageForInputQty) > 0);
          if (vm.totalShortageLine > 0) {
            vm.renderShortageLineReport();
          }

          vm.calculatedKitQty = vm.feasibilityDetail.inputQty;
        }
      }).catch((error) => {
        vm.calculateBtnFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.getKitFeasibilityDetail();

    /** Render shortage line report based on feasibility detail */
    vm.renderShortageLineReport = () => {
      $timeout(() => {
        var reportData = _.map(vm.feasibilityList, (item) => ({ name: item.connecterType ? stringFormat('{0}({1})', item.mountingType, item.connecterType) : item.mountingType, y: item.shortageLine }));
        Highcharts.chart('feasibility-chart', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Shortage Line(s)'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }

          },
          legend: {
            enabled: true,
            layout: 'horizontal',
            //align: 'bottom',
            //width: 200,
            //verticalAlign: 'middle',
            useHTML: true,
            labelFormatter: function () {
              return '<div>' + this.name + ' (' + this.y + ')</div>';
            }
          },
          series: [{
            name: 'Shortage Line',
            colorByPoint: true,
            data: reportData
          }],
          credits: {
            enabled: false
          }
        });
      });
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    angular.element(() => {
      setFocus('inputQty');
    });

    vm.AssyAtGlance = () => {
      const obj = {
        partID: (vm.feasibilityDetail.assyID || vm.feasibilityDetail.salesOrderDetail.partId)
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        null,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.goToKitAllocation = (item) => {
      if (item) {
        BaseService.goToKitList(vm.feasibilityDetail.salesOrderDetail.SalesOrderDetailId || 0, vm.feasibilityDetail.isConsolidated ? 0 : vm.feasibilityDetail.assyID, item.mountingTypeID);
      }
    };

    vm.kitAllocationFeasibility = (rowData) => {
      vm.feasibilityDetail.salesOrderDetail.feasibilityKitQty = vm.feasibilityDetail.inputQty;
      const obj = {
        salesOrderDetail: vm.feasibilityDetail,
        feasibilityLineDetail: rowData
      };
      DialogFactory.dialogService(
        TRANSACTION.KIT_ALLOCATION_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_ALLOCATION_FEASIBILITY_POPUP_VIEW,
        null,
        obj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();

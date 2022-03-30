(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderProfileController', WorkorderProfileController);

  /** @ngInject */
  function WorkorderProfileController($scope, $state, $stateParams, $timeout, WorkorderFactory, CORE, $mdDialog, DialogFactory, USER, Upload, PathService, DepartmentFactory, $filter, $window, DataElementTransactionValueFactory, OperationFactory, BaseService, OPERATION, WORKORDER, MasterFactory) {
    const vm = this;
    vm.woID = $stateParams.woID;
    let woSalesOrderPONumber = [];
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.InputeFieldKeys = CORE.InputeFieldKeys;
    vm.CustomerECO = angular.copy(CORE.workOrderECORequestType.CustomerECO).toUpperCase();
    vm.FCAECO = angular.copy(CORE.workOrderECORequestType.FCAECO).toUpperCase();
    vm.RoHSLeadFreeText = CORE.RoHSLeadFreeText;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.tranwiseDataelementList = [];
    vm.allLabelConstant = CORE.LabelConstant;
    getRoHSList();

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    };

    // get RoHS List
    function getRoHSList() {
      MasterFactory.getRohsList().query().$promise.then((requirement) => {
        vm.RohsList = (requirement && requirement.data) ? requirement.data : null;
        init();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function init() {
      if (vm.woID) {
        vm.cgBusyLoading = WorkorderFactory.getWorkorder_profile().query({ woID: vm.woID }).$promise.then((workorderProfile) => {
          vm.workorder = (workorderProfile && workorderProfile.data) ? angular.copy(workorderProfile.data) : null;
          vm.workorder.workorderProfile.workorderTransHoldUnhold = _.first(vm.workorder.workorderProfile.workorderTransHoldUnhold);
          if (vm.workorder.workorderProfile.workorderTransHoldUnhold) {
            vm.workorder.workorderProfile.workorderTransHoldUnhold.woHoldBy = vm.workorder.workorderProfile.workorderTransHoldUnhold.holdEmployees.initialName;
            vm.workorder.workorderProfile.workorderTransHoldUnhold.woStartDate = $filter('date')(vm.workorder.workorderProfile.workorderTransHoldUnhold.startDate, vm.DateTimeFormat);
          }
          vm.workorder.workorderProfile.statusClassName = BaseService.getWoStatusClassName(vm.workorder.workorderProfile.woSubStatus);
          vm.workorder.workorderProfile.statusTxt = BaseService.getWoStatus(vm.workorder.workorderProfile.woSubStatus);
          if (vm.workorder.sampleInfo && vm.workorder.sampleInfo.length > 0) {
            vm.workorder.sampleInfo[0].genFiles = CORE.WEB_URL + vm.workorder.sampleInfo[0].genFilePath;
          }
          // start - get poNumber and poQty from Work Order Sales Order Details
          if (vm.workorder.workorderProfile.WoSalesOrderDetails) {
            vm.workorder.workorderProfile.TotalPOQty = _.sumBy(vm.workorder.workorderProfile.WoSalesOrderDetails, (item) => item.poQty);
          }
          if (vm.workorder.workorderProfile.WoSalesOrderDetails) {
            _.each(vm.workorder.workorderProfile.WoSalesOrderDetails, (item) => {
              woSalesOrderPONumber.push(item.refPONumber);
            });
          }
          woSalesOrderPONumber = _.uniqBy(woSalesOrderPONumber);
          if (woSalesOrderPONumber.length > 0) {
            vm.workorder.workorderProfile.woSalesOrderPONumber = '' + woSalesOrderPONumber + '';
          } else {
            vm.workorder.workorderProfile.woSalesOrderPONumber = [];
          }
          // end - get poNumber and poQty from Work Order Sales Order Details

          //Check for No Clean Data
          vm.NoCleanOpData = _.map(_.orderBy(_.filter(vm.workorder.workorderProfile.workorderOperation, (opData) => opData.isNoClean === true), ['opNumber'], ['asc']), (obj) => convertToThreeDecimal(obj.opNumber));
          if (vm.NoCleanOpData.length > 0) {
            vm.NoCleanOpData = _.orderBy(vm.NoCleanOpData, ['opNumber'], ['asc']);
            vm.NoCleanOpData = '[ ' + vm.NoCleanOpData + ' ]';
          }
          //check for water soluble data
          vm.WatersolubleOpData = _.map(_.orderBy(_.filter(vm.workorder.workorderProfile.workorderOperation, (opData) => opData.isWaterSoluble === true), ['opNumber'], ['asc']), (obj) => convertToThreeDecimal(obj.opNumber));

          if (vm.WatersolubleOpData.length > 0) {
            vm.WatersolubleOpData = '[ ' + vm.WatersolubleOpData + ' ]';
          }

          //retrieve certificate standard and its selected Class
          vm.certificateStandards = [];
          vm.data = [];
          let priority = null;
          _.each(vm.workorder.workorderProfile.workorderCertification, (certificate) => {
            if (priority == null) {
              priority = certificate.certificateStandards.priority;
              vm.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
              vm.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
            }
            else {
              if (priority > certificate.certificateStandards.priority) {
                priority = certificate.certificateStandards.priority;
                vm.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
                vm.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
              }
            }
          });
          vm.SelectedRoHS = _.find(vm.RohsList, { id: vm.workorder.workorderProfile.RoHSStatusID });
          if (vm.SelectedRoHS) {
            vm.RoHSLeadFreeText = vm.SelectedRoHS.name;
            vm.RoHSLeadFreeIcon = vm.rohsImagePath + vm.SelectedRoHS.rohsIcon;
          }

          // get all work order operations list with Stock quantity and Scrap quantity
          const operationInfo = vm.workorder.operationInfo;
          const productionInfo = vm.workorder.productionInfo;
          //// get all employee wise production details
          //let productionInfo = _.reject(vm.workorder.productionInfo,
          //    function (o) {
          //        return !o.passQty;
          //    });

          // get workorder operation production details as per woOPID
          _.each(vm.workorder.workorderProfile.workorderOperation, (itemData) => {
            _.each(itemData.workorderOperationEquipment, (itemEqp) => {
              itemEqp.ShowEmptyState = false;
            });
            itemData.ShowEmptyState = false;
            // get operation stop reason
            itemData.workorderTransOperationHoldUnhold = _.first(itemData.workorderTransOperationHoldUnhold);
            if (itemData.workorderTransOperationHoldUnhold) {
              itemData.workorderTransOperationHoldUnhold.opHoldBy = itemData.workorderTransOperationHoldUnhold.holdEmployees.initialName;
              itemData.workorderTransOperationHoldUnhold.opStartDate = $filter('date')(itemData.workorderTransOperationHoldUnhold.startDate, vm.DateTimeFormat);
            }

            const CompQtylist = [];
            const opData = _.find(operationInfo, (opData) => opData.woOPID == itemData.woOPID);
            itemData.ReadyStock = opData ? opData.StockQty + opData.scrapQty : '-';
            itemData.scrapQty = opData ? opData.scrapQty : '-';
            itemData.totalActualTime = 0;
            //if operation is team operation
            if (itemData.isTeamOperation) {
              const qtyObj = _.filter(productionInfo, (prod) => prod.woOPID == itemData.woOPID);
              //Grouping data as emp initialName
              const groupingData = _.groupBy(qtyObj, (d) => d.initialName);

              _.each(groupingData, (item, idx) => {
                const passQty = _(item).groupBy('initialName').map((objs) => ({ 'passQty': _.sumBy(objs, 'passQty') })).value();
                const totalQty = _(item).groupBy('initialName').map((objs) => ({ 'totalQty': _.sumBy(objs, 'totalQty') })).value();
                const scrapQty = _(item).groupBy('initialName').map((objs) => ({ 'scrapQty': _.sumBy(objs, 'scrapQty') })).value();
                const productionTimeInSec = _(item).groupBy('initialName').map((objs) => ({ 'productionTimeInSec': _.sumBy(objs, 'productionTimeInSec') })).value();
                CompQtylist.push({
                  'empName': idx,
                  'passQty': passQty[0].passQty ? parseFloat(passQty[0].passQty).toFixed(2) : 0,
                  'totalQty': totalQty[0].totalQty ? parseFloat(totalQty[0].totalQty).toFixed(2) : 0,
                  'scrapQty': scrapQty[0].scrapQty ? parseFloat(scrapQty[0].scrapQty).toFixed(2) : 0,
                  'productionTimeInSec': productionTimeInSec[0].productionTimeInSec ? secondsToTime(productionTimeInSec[0].productionTimeInSec, true) : 0,
                  'perQty': (productionTimeInSec[0].productionTimeInSec && passQty[0].passQty) ? secondsToTime((productionTimeInSec[0].productionTimeInSec / passQty[0].passQty), true) : secondsToTime(0, true)
                });
                //CompQtylist.push({ 'empName': idx, 'passQty': passQty[0].passQty, 'CheckoutTime': checkoutDate ? moment(checkoutDate).format(dateformate) : null })
                itemData.totalActualTime += productionTimeInSec[0].productionTimeInSec ? productionTimeInSec[0].productionTimeInSec : 0;
              });
              itemData.CompletedQtyData = CompQtylist.length > 0 ? CompQtylist : [];
            } else {
              //if single emp operation get all transaction production details
              const qtyObjArr = _.filter(productionInfo, (prod) => prod.woOPID == itemData.woOPID);

              _.each(qtyObjArr, (qtyObj) => {
                //let empName = qtyObj.firstName + ' ' + qtyObj.lastName[0] + '.';
                CompQtylist.push({
                  'empName': qtyObj.initialName,
                  'passQty': qtyObj.passQty ? parseFloat(qtyObj.passQty) : 0,
                  'totalQty': qtyObj.totalQty ? parseFloat(qtyObj.totalQty) : 0,
                  'scrapQty': qtyObj.scrapQty ? parseFloat(qtyObj.scrapQty) : 0,
                  'productionTimeInSec': secondsToTime(qtyObj.productionTimeInSec, true),
                  'perQty': (qtyObj.productionTimeInSec && qtyObj.passQty) ? secondsToTime(((qtyObj.productionTimeInSec) / qtyObj.passQty), true) : secondsToTime(0, true)
                });
                //CompQtylist.push({ 'empName': qtyObj.initialName, 'passQty': qtyObj.passQty, 'CheckoutTime': qtyObj.checkoutTime ? moment(qtyObj.checkoutTime).format(dateformate) : null });
                itemData.totalActualTime += qtyObj.productionTimeInSec ? qtyObj.productionTimeInSec : 0;
              });
              itemData.CompletedQtyData = CompQtylist.length > 0 ? CompQtylist : [];
            }
            itemData.totalActualTime = secondsToTime(itemData.totalActualTime, true);
            itemData.isNoCleanName = itemData.isNoClean === true ? vm.allLabelConstant.Operation.NoClean : '';
            itemData.isWaterSolubleName = itemData.isWaterSoluble === true ? vm.allLabelConstant.Operation.WaterSoluble : '';
            itemData.isFluxNotApplicableName = itemData.isFluxNotApplicable === true ? vm.allLabelConstant.COMMON.NotApplicable : '';
            itemData.isRequireMachineVerificationValue = CORE.KeywordWithNA[itemData.isRequireMachineVerification];
            itemData.doNotReqApprovalForScanValue = CORE.KeywordWithNA[itemData.doNotReqApprovalForScan];
            itemData.refDesigList = _.map(itemData.workorderOperationRefDesigs, ((det) => det.refDesig)).join(',');            
          });
          vm.workorder.workorderProfile.workorderOperation = _.sortBy(vm.workorder.workorderProfile.workorderOperation, 'opNumber');
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
    vm.goBack = () => $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);

    vm.printProfile = (printSectionId) => {
      var innerContents = document.getElementById(printSectionId).innerHTML;
      var popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document.write('\
                <html>\
                    <head>\
                        <style>\
                            @page {\
                                size: A4;\
                                margin: 0;\
                             }\
                         </style>\
                      </head>\
                 <body onload="window.print()">' + innerContents + '\
              </html>');
      popupWinindow.document.close();
    };
  }
})();

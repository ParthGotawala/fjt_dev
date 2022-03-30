(function () {
  'use strict';

  angular.module('app.traveler.travelers').directive('operationReprocessQty', OperationReprocessQtyController);
  /** @ngInject */
  function OperationReprocessQtyController($mdSidenav, DialogFactory) { // eslint-disable-line func-names
    return {
      restrict: 'E',
      scope: {
        opReprocessQtyData: '='
      },
      templateUrl: 'app/main/traveler/travelers/operation-reprocess-quantity/operation-reprocess-quantity.html',
      controllerAs: 'vm',
      controller: operationReprocessQtyCtrl
    };
    return directive;

    function operationReprocessQtyCtrl($scope, $q, TRAVELER, CORE, BaseService, WORKORDER, $timeout,
      WorkorderSerialMstFactory, WorkorderTransProductionFactory, WorkorderGenerateSerialFactory, WorkorderTransSerialFactory) {
      const vm = this;
      let employeeID = BaseService.loginUser.employee.id;
      let woID = $scope.opReprocessQtyData.woID;
      let woOPID = $scope.opReprocessQtyData.woOPID;
      let opID = $scope.opReprocessQtyData.opID;
      let woTransID = $scope.opReprocessQtyData.woTransID;
      let woNumber = $scope.opReprocessQtyData.woNumber;
      vm.buildQty = $scope.opReprocessQtyData.buildQty;
      vm.opName = $scope.opReprocessQtyData.opName;
      vm.isOperationTrackBySerialNo = $scope.opReprocessQtyData.isOperationTrackBySerialNo;
      vm.isTrackBySerialNo = $scope.opReprocessQtyData.isTrackBySerialNo;
      vm.selectedValue = "SerialNumber";
      vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
      vm.isRework = $scope.opReprocessQtyData.isRework;
      let prodStatus = CORE.productStatus;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SERIALS_MORETHAN_BUILD_QTY_MSG = WORKORDER.SERIALS_MORETHAN_BUILD_QTY_MSG;
      vm.reprocessQtyModel = {};
      vm.isHideDelete = true;
      vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.REPROCESS_QTY_HISTORY;
      vm.debounceConstant = CORE.Debounce;
      vm.isDisableReprocessed = false;

      /**************** without operation track by serial# *************/
      if (!vm.isOperationTrackBySerialNo && !vm.isTrackBySerialNo) {

        vm.addReprocessQty = () => {

          if (!vm.reprocessQtyModel.reprocessQty) {
            return;
          }

          if ((vm.reprocessQtyModel.reprocessQty + (vm.totalAddedReprocessQty || 0)) > vm.buildQty) {
            var model = {
              title: vm.SERIALS_MORETHAN_BUILD_QTY_MSG,
              multiple: true
            };
            DialogFactory.alertDialog(model);
            return;
          }

          let opTransObj = {
            woID: woID,
            woOPID: woOPID,
            opID: opID,
            employeeID: employeeID,
            woTransID: woTransID,
            buildQty: vm.buildQty,
            reprocessQty: vm.reprocessQtyModel.reprocessQty,
            isTeamOperation: $scope.opReprocessQtyData.isTeamOperation
          }
          vm.cgBusyLoading = WorkorderTransProductionFactory.saveReprocessQtyForOperation().save(opTransObj).$promise.then((res) => {
            if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.reprocessQtyModel.reprocessQty = null;
              vm.reprocessQtyWithoutSerialForm.$setPristine();
              vm.reprocessQtyWithoutSerialForm.$setUntouched();
              getProductionData();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }

        /* *************** Production List section   ************************/
        vm.ProductionList = [];
        vm.ispagination = true;
        vm.selectedItems = [];
        vm.query = {
          order: '',
          search: '',
          limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
          page: 1,
          isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };
        vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;

        let getProductionData = () => {
          let objs = {
            woTransID: woTransID
          }
          vm.cgBusyLoading = WorkorderTransProductionFactory.retrieveWorkorderTransactionDetails().query({ operationObj: objs }).$promise.then((productionData) => {
            let productionListData = productionData.data;
            vm.ProductionList = _.filter(productionListData, (item) => {
              return item.reprocessQty;
            });

            vm.ProductionList = _(vm.ProductionList).groupBy('employeeID').map((objs, key) => ({
              'employeeID': key,
              'reprocessQty': _.sumBy(objs, 'reprocessQty'),
              'createdAt': objs[0].createdAt,
              'fullName': objs[0].employee.firstName + ' ' + objs[0].employee.lastName,
              'initialName': objs[0].employee.firstName + ' ' + objs[0].employee.initialName
            })).value();

            let loginEmpProcessStock = _.find(vm.ProductionList, (item) => {
              return item.employeeID == employeeID;
            });
            //vm.addedReprocessQtyByEmp = loginEmpProcessStock ? loginEmpProcessStock.reprocessQty : 0;
            vm.totalAddedReprocessQty = _.sum(_.map(vm.ProductionList, 'reprocessQty'));
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        getProductionData();
        /******************** END of Production List section **************************/
      }
      /*************** End of without operation track by serial# *************/

      /************************ Operation track by serial# *****************/
      //get Work Order Serial# by WoID
      if (vm.isOperationTrackBySerialNo || vm.isTrackBySerialNo) {
        let getAllWorkorderSerialsByWoID = () => {
          return WorkorderSerialMstFactory.getAllWorkorderSerialsByWoID().query({ woID: woID }).$promise
            .then((res) => {
              vm.workorderSerialsList = res.data.workorderSerialsList;
              return $q.resolve(vm.workorderSerialsList);
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
        }

        // auto complete for serial# and product status
        let initAutoCompleteForWorkorderSerials = () => {
          vm.autoCompleteWorkorderFromSerialsDetail = {
            columnName: 'SerialNo',
            keyColumnName: 'ID',
            keyColumnId: null,
            inputName: 'WorkorderFromSerials',
            placeholderName: vm.selectedValue == vm.WOSerialNoFilterType.SerialNumber ? 'Serial#' : 'From Serial#',
            isRequired: true,
            isAddnew: false,
            callbackFn: getAllWorkorderSerialsByWoID
          };

          vm.autoCompleteWorkorderToSerialsDetail = {
            columnName: 'SerialNo',
            keyColumnName: 'ID',
            keyColumnId: null,
            inputName: 'WorkorderToSerials',
            placeholderName: 'To Serial#',
            isRequired: false,
            isAddnew: false,
            callbackFn: getAllWorkorderSerialsByWoID
          };
        }

        let autocompleteTrackBySerialPromise = [];
        autocompleteTrackBySerialPromise = [getAllWorkorderSerialsByWoID()];
        vm.cgBusyLoading = $q.all(autocompleteTrackBySerialPromise).then((responses) => {
          initAutoCompleteForWorkorderSerials();
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });

        var filterCategoryOfProdStatus = {
          ColumnDataType: 'Number',
          ColumnName: 'prodStatus',
          SearchString: CORE.statusText.Reprocessed
        }

        let initPageInfo = () => {
          vm.pagingInfo = {
            Page: CORE.UIGrid.Page(),
            SortColumns: [['serialNo', 'ASC']],
            SearchColumns: [],
            woTransID: woTransID
          };
        }

        initPageInfo();

        vm.gridOptions = {
          showColumnFooter: false,
          enableRowHeaderSelection: false,
          enableFullRowSelection: false,
          enableRowSelection: false,
          multiSelect: false,
          filterOptions: vm.pagingInfo.SearchColumns,
          exporterMenuCsv: true,
          exporterCsvFilename: 'Work Order Transaction Serial#.csv',
        };

        vm.sourceHeader = [
          //{
          //    field: 'Action',
          //    cellClass: 'gridCellColor',
          //    displayName: 'Action',
          //    width: '120',
          //    cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
          //    enableFiltering: false,
          //    enableSorting: false,
          //    exporterSuppressExport: true,
          //    pinnedLeft: true
          //},
          {
            field: '#',
            width: '70',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false,
          },
          {
            field: 'serialNo',
            displayName: 'Serial#',
            width: 180,

          }, {
            field: 'empFullName',
            displayName: 'Name',
            width: 180,
            enableFiltering: false,
            enableSorting: false
          }
          //, {
          //    field: 'prodstatus',
          //    displayName: 'Product Status',
          //    width: 180,
          //    enableFiltering: false,
          //    enableSorting: false
          //}
        ];

        /* retrieve work order transaction serials list */
        vm.loadData = () => {
          vm.pagingInfo.SearchColumns.push(filterCategoryOfProdStatus);
          vm.cgBusyLoading = WorkorderGenerateSerialFactory.retriveWoTransSerialno().query(vm.pagingInfo).$promise.then((workorderSerials) => {
            vm.sourceData = workorderSerials.data.workorderSerialsList;
            _.each(vm.sourceData, (serialdata) => {
              let selectedProdStatus = _.find(prodStatus, (item) => {
                return item.id == serialdata.prodStatus;
              });
              if (selectedProdStatus) {
                serialdata.prodstatus = selectedProdStatus.status;
              }
            });
            vm.totalSourceDataCount = workorderSerials.data.Count;

            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            vm.gridOptions.clearSelectedRows();
            if (vm.totalSourceDataCount == 0) {
              if (vm.pagingInfo.SearchColumns.length > 1 || !_.isEmpty(vm.SearchMode)) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              }
              else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
            }
            else {
              vm.isNoDataFound = false;
              vm.emptyState = null;
            }
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }

        //call once scroll down on grid
        vm.getDataDown = () => {
          vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
          vm.cgBusyLoading = WorkorderGenerateSerialFactory.generateSerial().query(vm.pagingInfo).$promise.then((workorderSerials) => {
            vm.sourceData = vm.sourceData.concat(workorderSerials.data.workorderSerialsList);
            _.each(vm.sourceData, (data) => {
              let selectedProdStatus = _.find(prodStatus, (item) => {
                return item.id == data.prodStatus;
              });
              if (selectedProdStatus) {
                data.prodstatus = selectedProdStatus.status;
              }
            })
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            $timeout(() => {
              vm.resetSourceGrid();
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
            });
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        };

        let generateSerial = (str, len) => {
          var s = '', c = '0', len = len - str.length;
          while (s.length < len)
            s += c;
          return s + str;
        }

        //add serial# based on selection
        vm.AddReprocessSerials = () => {
          if (vm.reprocessQtyWithSerialForm && vm.reprocessQtyWithSerialForm.$invalid) {
            BaseService.focusRequiredField(vm.reprocessQtyWithSerialForm);
            return;
          }
          let PreSuffixArray = [];
          let woSerialsMatchingList = [];
          //if selected value is serial#
          if (vm.selectedValue == vm.WOSerialNoFilterType.SerialNumber) {
            if (vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId) {
              woSerialsMatchingList = vm.workorderSerialsList.filter(function (obj) {
                return vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId == obj.ID;;
              });
            }
            else {
              return enterProperDetailToFilter();
            }
          }
          //if selected value is range
          else if (vm.selectedValue == vm.WOSerialNoFilterType.Range) {
            if (vm.autoCompleteWorkorderToSerialsDetail.keyColumnId) {
              let prefix = vm.workorderSerialsList[0].prefix ? vm.workorderSerialsList[0].prefix : "";
              let suffix = vm.workorderSerialsList[0].suffix ? vm.workorderSerialsList[0].suffix : "";

              let startSerialDetail = vm.workorderSerialsList.find(a => a.ID == vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId);
              let endSerialDetail = vm.workorderSerialsList.find(a => a.ID == vm.autoCompleteWorkorderToSerialsDetail.keyColumnId);

              let startFromNum = startSerialDetail ? startSerialDetail.serialIntVal : 0;
              let endToNum = endSerialDetail ? endSerialDetail.serialIntVal : 0;

              if (parseInt(startFromNum) > parseInt(endToNum)) {
                var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TO_SERIAL_NOT_VALID);
                var model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return;
              }

              for (var i = startFromNum; i <= endToNum; i++) {
                let serialno = prefix + generateSerial((startFromNum++) + '', vm.workorderSerialsList[0].noofDigit) + suffix;
                PreSuffixArray.push(serialno);
              }
              woSerialsMatchingList = vm.workorderSerialsList.filter(function (obj) {
                return PreSuffixArray.indexOf(obj.SerialNo) != -1;
              });
            }
            else {
              return enterProperDetailToFilter();
            }
          }
          //if selected value is serial# with Qty
          else if (vm.selectedValue == vm.WOSerialNoFilterType.FromQty) {
            if (vm.Qty) {
              let prefix = vm.workorderSerialsList[0].prefix ? vm.workorderSerialsList[0].prefix : "";
              let suffix = vm.workorderSerialsList[0].suffix ? vm.workorderSerialsList[0].suffix : "";

              var serialDetail = vm.workorderSerialsList.find(a => a.ID == vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId);
              if (serialDetail) {
                let startFromNum = serialDetail.serialIntVal;
                for (var i = 1; i <= vm.Qty; i++) {
                  let serialno = prefix + generateSerial((startFromNum++) + '', vm.workorderSerialsList[0].noofDigit) + suffix;
                  PreSuffixArray.push(serialno);
                }
                woSerialsMatchingList = vm.workorderSerialsList.filter(function (obj) {
                  return PreSuffixArray.indexOf(obj.SerialNo) != -1;
                });
              }
            }
            else {
              return enterProperDetailToFilter();
            }
          }
          if (woSerialsMatchingList.length > 0) {
            // Added validation to allow to add total valid quantity
            if (woSerialsMatchingList.length > vm.buildQty) {
              var model = {
                title: TRAVELER.INVALID_REPROCESS_QTY,
                multiple: true
              };
              DialogFactory.alertDialog(model);
              return;
            }

            let woTransObj = {};
            woTransObj.woTransID = woTransID;
            woTransObj.woID = woID;
            woTransObj.opID = opID;
            woTransObj.employeeID = employeeID;
            woTransObj.prodStatus = CORE.statusText.Reprocessed;
            woTransObj.woTransSerialNoList = _.map(woSerialsMatchingList, 'SerialNo');
            woTransObj.reprocessQuantityProdStatus = CORE.statusText.Reprocessed; // ReprocessQuantity ProductStatus
            woTransObj.scrapQuantityProdStatus = CORE.statusText.Scraped; // ScrapQuantity Product Status

            let workorderSerialmstList = []
            _.each(woSerialsMatchingList, (item) => {
              let _obj = {};
              _obj.ID = item.ID;
              _obj.curropID = opID;
              _obj.currStatus = CORE.statusText.Reprocessed;
              _obj.SerialNo = item.SerialNo;
              _obj.createdBy = item.createdBy;
              workorderSerialmstList.push(_obj);
            });
            woTransObj.workorderSerialmstList = workorderSerialmstList;
            woTransObj.woNumber = woNumber;
            woTransObj.opName = vm.opName;
            woTransObj.woOPID = woOPID;
            woTransObj.isTeamOperation = $scope.opReprocessQtyData.isTeamOperation;
            vm.isDisableReprocessed = true;
            vm.cgBusyLoading = WorkorderGenerateSerialFactory.generateSerial().save(woTransObj).$promise.then((res) => {
              vm.isDisableReprocessed = false;
              if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.reprocessQtyWithSerialForm.$setPristine();
                if (!vm.gridOptions.enablePaging) {
                  initPageInfo();
                }
                vm.loadData();
              }
            }).catch((error) => {
              vm.isDisableReprocessed = false;
              return BaseService.getErrorLog(error);
            });
          };
        }

        let enterProperDetailToFilter = () => {
          var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADD_PROPER_DETAILS_TO_FILTER_FIRSTPICE_SERIALS);
          var model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

        /* delete serial# */
        vm.deleteRecord = (serialInfo) => {
          if (serialInfo) {
            let obj = {
              title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'SerialNo'),
              textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, 1, 'serialNo'),
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.confirmDiolog(obj).then((yes) => {
              if (yes) {
                WorkorderTransSerialFactory.deleteWoTransSerialNo().delete({
                  woTransSerialID: serialInfo.woTransSerialID,
                }).$promise.then((res) => {
                  if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    vm.gridOptions.clearSelectedRows();
                  }
                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });
              }

            }, (cancel) => {
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
          else {
            //show validation message no data selected
            let alertModel = {
              title: USER.USER_ERROR_LABEL,
              textContent: stringFormat(USER.SELECT_ONE_LABEL, "serial#")
            };
            DialogFactory.alertDialog(alertModel);
          }
        };

        vm.changeselectedSerialFilterValue = () => {
          vm.autoCompleteWorkorderFromSerialsDetail.placeholderName = vm.selectedValue == vm.WOSerialNoFilterType.SerialNumber ? 'Serial#' : 'From Serial#';
          vm.autoCompleteWorkorderToSerialsDetail.isRequired = vm.selectedValue == vm.WOSerialNoFilterType.Range ? true : false;
          vm.isRequiredSerialQtyFilter = vm.selectedValue == vm.WOSerialNoFilterType.FromQty ? true : false;
          vm.reprocessQtyWithSerialForm.rbSerialNumber.$setDirty();
        }

      }

      /************************ END of Operation track by serial# *****************/
      vm.checkFormDirty = (form) => {
        let checkDirty = BaseService.checkFormDirty(form);
        return checkDirty;
      }
      $scope.closeSidenav = function () {
        let currentActiveForm = (vm.isOperationTrackBySerialNo || vm.isTrackBySerialNo) ? vm.reprocessQtyWithSerialForm : vm.reprocessQtyWithoutSerialForm;
        let isdirty = vm.checkFormDirty(currentActiveForm);
        if (isdirty) {
          let data = {
            form: currentActiveForm,
            sideName: 'operation-reprocess-qty'
          }
          BaseService.showWithoutSavingAlertForPopUp(data);
        } else {
          BaseService.currentPagePopupForm = [];
          $mdSidenav('operation-reprocess-qty').close();
        }
      }

    }
  }
})();

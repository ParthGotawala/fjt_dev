(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SerialNumberPopupController', SerialNumberPopupController);

  /** @ngInject */
  function SerialNumberPopupController($q, $scope, $mdDialog, DialogFactory, WORKORDER, TRAVELER, $timeout, CORE, USER,
    WorkorderSerialMstFactory, data, WorkorderGenerateSerialFactory, WorkorderTransSerialFactory, BaseService,
    WorkorderTransProductionFactory) {
    const vm = this;
    vm.data = angular.copy(data);
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'Serial# Transaction History';
    vm.woNumber = data.woNumber;
    vm.IsCheckInOperation = data.isCheckInOperation;
    vm.isSetup = data.isSetup;
    vm.isHideDelete = !(vm.IsCheckInOperation && !vm.isSetup);
    vm.operationFullName = data.operationFullName;
    vm.isIssueQty = data.isIssueQty;
    vm.issueQty = data.issueQty ? data.issueQty : 0;
    vm.isRework = data.isRework;
    vm.selectedValue = 'SerialNumber';
    vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.statusTextValueConst = CORE.statusTextValue;
    vm.zeroAvailableQtyNote = vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ZERO_AVAILABLE_QTY_SERIAL_NOTE.message;

    vm.isParallelOperation = data.isParallelOperation;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_SERIAL;
    vm.prodStatus = CORE.productStatus;
    vm.statusText = CORE.statusText;
    vm.productStatusFilter = CORE.productStatusFilter;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.headerdata = [];
    //obj for pass in to directive
    vm.transactiondataObj = {
      woID: data.woID,
      opID: data.opID,
      woOPID: data.woOPID,
      woTransID: null,
      employeeID: data.checkInEmployeeID,
      qtyControl: data.qtyControl,
      isIssueQty: data.isIssueQty,
      issueQty: data ? data.issueQty : null,
      woNumber: data.woNumber,
      woVersion: data.woVersion,
      isRework: data.isRework,
      isParallelOperation: data.isParallelOperation,
      opName: data.opName,
      isCheckInOperation: false,
      operationFullName: data.operationFullName,
      isSetup: (data) ? data.isSetup : false,
      PIDCode: data.PIDCode,
      partID: data.partID,
      rohsIcon: data.rohsIcon,
      rohsName: data.rohsName
    };

    vm.selectedProdStatus = _.find(vm.prodStatus, (item) => item.status === 'Passed Qty');
    vm.workorder_trans_model = {
      woTransID: data.woTransID,
      woID: data.woID,
      opID: data.opID,
      employeeid: data.employeeID,
      serialNo: null,
      prodstatus: 1
    };
    vm.serialNo_Model = {
      from_SerialNo: null,
      to_serialNo: null
    };
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '80',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'serialNo',
        displayName: vm.SerialTypeLabel.MFRSerial.Label,
        width: 500

      }, {
        field: 'productSerialNO',
        displayName: vm.SerialTypeLabel.FinalSerial.Label,
        width: 500
      }, {
        field: 'prodstatus',
        displayName: 'OP Status of ' + vm.SerialTypeLabel.MFRSerial.Label,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.productStatusFilter
        },
        ColumnDataType: 'StringEquals',
        width: 200
      }, {
        field: 'ScannedByEmpFullName',
        displayName: 'Scanned By',
        width: 180
      }, {
        field: 'createdAt',
        displayName: 'Scanned On',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['woTransSerialID', 'DESC']],
        SearchColumns: [],
        woTransID: data.woTransID,
        woID: data.woID,
        opID: data.opID
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Work Order Transaction Serial#.csv'
    };
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.readyStockData.woID);
      return false;
    };
    vm.goToWorkorderOperations = () => {
      BaseService.goToWorkorderOperations(data.woID);
      return false;
    };
    vm.goToWorkorderOperationDetails = () => {
      BaseService.goToWorkorderOperationDetails(data.woOPID);
      return false;
    };
    // get stock data
    const getStock = () => {
      const objs = {
        opID: data.opID,
        woID: data.woID,
        woOPID: data.woOPID
      };
      vm.cgBusyLoading = WorkorderTransProductionFactory.retrieveWorkorderTransReadyStock().query({ operationObj: objs }).$promise.then((stockData) => {
        if (stockData.data) {
          if (stockData.data.stockInfo.length > 0) {
            stockData.data.stockInfo = _.first(stockData.data.stockInfo);
            vm.readyStockData = stockData.data.stockInfo;
            vm.readyStockData.totalValidQty = vm.readyStockData.returnPending;
          }
          // overwrite valid quantity and return quantity in case of quantity from last pre programming operation
          if (stockData.data.readyPCBComponentDet) {
            if (data.woOPID === stockData.data.readyPCBComponentDet.refStkWOOPID && stockData.data.readyPCBComponentDet.readyForPCB < vm.readyStockData.returnPending) {
              vm.readyStockData.totalValidQty = vm.readyStockData.returnPending = stockData.data.readyPCBComponentDet.readyForPCB;
            }
          }
          vm.headerdata = [
            {
              label: CORE.LabelConstant.Traveler.AvailableQty, value: vm.readyStockData.returnPending, displayOrder: (vm.headerdata.length + 1)
            },
            { label: CORE.LabelConstant.Traveler.CumulativeCompletedQty, value: vm.readyStockData.ReadyStock, displayOrder: (vm.headerdata.length + 1) },
            {
              value: data.PIDCode,
              label: CORE.LabelConstant.Assembly.ID,
              displayOrder: (vm.headerdata.length + 1),
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToPartDetails,
              isCopy: true,
              imgParms: {
                imgPath: data.rohsIcon,
                imgDetail: data.rohsName
              }
            },
            {
              label: CORE.LabelConstant.Workorder.WO, value: vm.woNumber, displayOrder: (vm.headerdata.length + 1), labelLinkFn: vm.goToWorkorderList,
              valueLinkFn: vm.goToWorkorderDetails
            }, {
              label: CORE.LabelConstant.Operation.OP,
              value: data.operationFullName,
              displayOrder: (vm.headerdata.length + 1),
              labelLinkFn: vm.goToWorkorderOperations,
              valueLinkFn: vm.goToWorkorderOperationDetails
            }
          ];
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getStock();

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.workorderSerialsList) {
        if (!isGetDataDown) {
          vm.sourceData = response.data.workorderSerialsList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.workorderSerialsList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.workorderSerialsList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        _.each(vm.sourceData, (data) => {
          vm.selectedProdStatus = _.find(vm.prodStatus, (item) => item.id === data.prodStatus);
          if (vm.selectedProdStatus) {
            data.prodstatus = vm.selectedProdStatus.status;
          }
        });

        // must set after new data comes
        vm.totalSourceDataCount = response.data.Count;
        vm.totalSourceDataCountOfInProcessingSerial = response.data.CountOfInProcessingSerial;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
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
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    };

    /* retrieve work order transaction serials list */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WorkorderGenerateSerialFactory.retriveWoTransSerialno().query(vm.pagingInfo).$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.data) {
          setDataAfterGetAPICall(workorderSerials, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //call once scroll down on grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderGenerateSerialFactory.retriveWoTransSerialno().query(vm.pagingInfo).$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.data) {
          setDataAfterGetAPICall(workorderSerials, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get Work Order Serial# by WoID
    const getAllWorkorderSerialsByWoID = () => WorkorderSerialMstFactory.getAllWorkorderSerialsByWoID().query({ woID: data.woID }).$promise
      .then((res) => {
        vm.workorderSerialsList = res.data.workorderSerialsList;
        return $q.resolve(vm.workorderSerialsList);
      }).catch((error) => BaseService.getErrorLog(error));

    const getTransPrevOpPassedSerials = () => {
      const objWoTransCurrOp = {
        woID: vm.workorder_trans_model.woID,
        woOPID: data.woOPID
      };

      return WorkorderTransSerialFactory.getTransPrevOpPassedSerials().query({ objWoTransCurrOp: objWoTransCurrOp }).$promise.then((workorderSerials) => $q.resolve(workorderSerials.data.TransPrevOpPassedSerialsList)).catch((error) => BaseService.getErrorLog(error));
    };

    const autocompletePromise = [getAllWorkorderSerialsByWoID()];
    if (vm.isRework) {
      autocompletePromise.push(getTransPrevOpPassedSerials());
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      if (vm.isRework) {
        const transPrevOpPassedSerialsList = responses[1];
        if (transPrevOpPassedSerialsList && transPrevOpPassedSerialsList.length && vm.workorderSerialsList && vm.workorderSerialsList.length > 0) {
          vm.workorderSerialsList = vm.workorderSerialsList.filter((o1) => !transPrevOpPassedSerialsList.some((o2) => o1.SerialNo === o2.serialNo));
        }
      }
      initAutoCompleteForWorkorderSerials();
    }).catch((error) => BaseService.getErrorLog(error));
    // auto complete for serial# and product status
    const initAutoCompleteForWorkorderSerials = () => {
      vm.autoCompleteWorkorderFromSerialsDetail = {
        columnName: 'SerialNo',
        keyColumnName: 'ID',
        keyColumnId: vm.serialNo_Model.from_SerialNo ? vm.serialNo_Model.from_SerialNo : null,
        inputName: 'WorkorderFromSerials',
        placeholderName: vm.selectedValue === vm.WOSerialNoFilterType.SerialNumber ? 'Serial#' : 'From Serial#',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllWorkorderSerialsByWoID
      };

      vm.autoCompleteWorkorderToSerialsDetail = {
        columnName: 'SerialNo',
        keyColumnName: 'ID',
        keyColumnId: vm.serialNo_Model.to_serialNo ? vm.serialNo_Model.to_serialNo : null,
        inputName: 'WorkorderToSerials',
        placeholderName: 'To Serial#',
        isRequired: false,
        isAddnew: false,
        callbackFn: getAllWorkorderSerialsByWoID
      };
    };
    //generate serial#
    const generateSerial = (str, len) => {
      var s = '', c = '0';
      len = len - str.length;
      while (s.length < len) {
        s += c;
      }
      return s + str;
    };

    //add serial# based on selection
    vm.AddSerialNo = (qtyStatus) => {
      if (!vm.IsCheckInOperation || vm.isSetup) {
        let textMessage;
        if (!vm.IsCheckInOperation) {
          textMessage = stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_NOT_STARTED, vm.operationFullName);
        }
        else if (vm.isSetup) {
          textMessage = CORE.MESSAGE_CONSTANT.NOT_ALLOW_IN_SETUP_ACTIVITY;
        }
        const model = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: textMessage,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      if (vm.productionStockForm && vm.productionStockForm.$invalid) {
        BaseService.focusRequiredField(vm.productionStockForm);
        return;
      }
      const PreSuffixArray = [];
      let woSerialsMatchingList = [];
      //if selected value is serial#
      if (vm.selectedValue === vm.WOSerialNoFilterType.SerialNumber) {
        if (vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId) {
          woSerialsMatchingList = vm.workorderSerialsList.filter((obj) => vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId === obj.ID);
        }
        else {
          return enterProperDetailToFilter();
        }
      }
      //if selected value is range
      else if (vm.selectedValue === vm.WOSerialNoFilterType.Range) {
        if (vm.autoCompleteWorkorderToSerialsDetail.keyColumnId) {
          //let PreSuffix = vm.workorderSerialsList[0].PrefixorSuffix ? (vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId.split('_')[0]) : (vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId.split('_')[1]);

          const prefix = vm.workorderSerialsList[0].prefix ? vm.workorderSerialsList[0].prefix : '';
          const suffix = vm.workorderSerialsList[0].suffix ? vm.workorderSerialsList[0].suffix : '';

          const startSerialDetail = vm.workorderSerialsList.find((a) => a.ID === vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId);
          const endSerialDetail = vm.workorderSerialsList.find((a) => a.ID === vm.autoCompleteWorkorderToSerialsDetail.keyColumnId);

          let startFromNum = startSerialDetail ? startSerialDetail.serialIntVal : 0;
          const endToNum = endSerialDetail ? endSerialDetail.serialIntVal : 0;

          if (parseInt(startFromNum) > parseInt(endToNum)) {
            //show validation message no data selected
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.TO_SERIAL_NOT_VALID);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          for (let i = startFromNum; i <= endToNum; i++) {
            const serialno = prefix + generateSerial((startFromNum++) + '', vm.workorderSerialsList[0].noofDigit) + suffix;
            PreSuffixArray.push(serialno);
          }

          woSerialsMatchingList = vm.workorderSerialsList.filter((obj) => PreSuffixArray.indexOf(obj.SerialNo) !== -1);
        }
        else {
          return enterProperDetailToFilter();
        }
      }
      //if selected value is serial# with Qty
      else if (vm.selectedValue === vm.WOSerialNoFilterType.FromQty) {
        if (vm.Qty) {
          //let PreSuffix = vm.workorderSerialsList[0].PrefixorSuffix ? (vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId.split('_')[0]) : (vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId.split('_')[1]);
          const prefix = vm.workorderSerialsList[0].prefix ? vm.workorderSerialsList[0].prefix : '';
          const suffix = vm.workorderSerialsList[0].suffix ? vm.workorderSerialsList[0].suffix : '';

          const serialDetail = vm.workorderSerialsList.find((a) => a.ID === vm.autoCompleteWorkorderFromSerialsDetail.keyColumnId);
          if (serialDetail) {
            let startFromNum = serialDetail.serialIntVal;
            for (let i = 1; i <= vm.Qty; i++) {
              const serialno = prefix + generateSerial((startFromNum++) + '', vm.workorderSerialsList[0].noofDigit) + suffix;
              PreSuffixArray.push(serialno);
            }
            woSerialsMatchingList = vm.workorderSerialsList.filter((obj) => PreSuffixArray.indexOf(obj.SerialNo) !== -1);
          }
        }
        else {
          return enterProperDetailToFilter();
        }
      }
      if (woSerialsMatchingList.length > 0) {
        // Added validation to allow to add total valid quantity
        //if (((vm.totalSourceDataCount - vm.CountOfAlreadyAddedReprocessedQty || 0) + woSerialsMatchingList.length)
        if (((vm.totalSourceDataCountOfInProcessingSerial) + woSerialsMatchingList.length)
          > (vm.readyStockData ? vm.readyStockData.totalValidQty : 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_MORE_THAN_ISSUEQTY);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }

        const woTransObj = {};
        woTransObj.woTransID = data.woTransID;
        woTransObj.woID = data.woID;
        woTransObj.opID = data.opID;
        woTransObj.employeeID = data.employeeID;
        woTransObj.prodStatus = qtyStatus;
        woTransObj.woTransSerialNoList = _.map(woSerialsMatchingList, 'SerialNo');
        woTransObj.reprocessQuantityProdStatus = (_.find(vm.prodStatus, { 'id': '2' })).id; // ReprocessQuantity ProductStatus
        woTransObj.scrapQuantityProdStatus = vm.prodStatus[3].id; // ScrapQuantity Product Status

        const workorderSerialmstList = [];
        const selectedworkorderSerialNoList = [];
        _.each(woSerialsMatchingList, (item) => {
          const serialNoobj = {};
          const _obj = {};
          _obj.ID = serialNoobj.ID = item.ID;
          _obj.curropID = data.opID;
          _obj.currwoOPID = data.woOPID;
          _obj.currStatus = qtyStatus;
          _obj.SerialNo = serialNoobj.SerialNo = item.SerialNo;
          _obj.createdBy = item.createdBy;
          workorderSerialmstList.push(_obj);
          selectedworkorderSerialNoList.push(serialNoobj);
        });
        woTransObj.workorderSerialmstList = workorderSerialmstList;
        woTransObj.selectedworkorderSerialNoList = selectedworkorderSerialNoList;
        woTransObj.woNumber = data.woNumber;
        woTransObj.opName = data.opName;
        woTransObj.woOPID = data.woOPID;

        vm.cgBusyLoading = WorkorderGenerateSerialFactory.generateSerial().save(woTransObj).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.productionStockForm.$setPristine();
            if (!vm.gridOptions.enablePaging) {
              initPageInfo();
            }
            vm.loadData();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
    };

    vm.passSerialNumber = (qtyStatus) => {
      vm.curentAction = qtyStatus;
      $scope.$broadcast('getSelectedSerialNumberList');
    };

    vm.clearSection = () => {
      $scope.$broadcast('clearSeaction');
    };

    vm.getPassedSerialNumber = (selectionMethid, serialNumberList) => {
      if (vm.curentAction) {
        if (serialNumberList && serialNumberList.length) {
          if (((vm.totalSourceDataCountOfInProcessingSerial) + serialNumberList.length)
            > (vm.readyStockData ? vm.readyStockData.totalValidQty : 0)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_MORE_THAN_ISSUEQTY);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }

          const woTransObj = {};
          woTransObj.woTransID = data.woTransID;
          woTransObj.woID = data.woID;
          woTransObj.opID = data.opID;
          woTransObj.employeeID = data.employeeID;
          woTransObj.prodStatus = vm.curentAction;
          woTransObj.woTransSerialNoList = _.map(serialNumberList, 'SerialNo');
          woTransObj.reprocessQuantityProdStatus = (_.find(vm.prodStatus, { 'id': '2' })).id; // ReprocessQuantity ProductStatus
          woTransObj.scrapQuantityProdStatus = vm.prodStatus[3].id; // ScrapQuantity Product Status

          const workorderSerialmstList = [];
          const selectedworkorderSerialNoList = [];
          _.each(serialNumberList, (item) => {
            const serialNoobj = {};
            const _obj = {};
            _obj.ID = serialNoobj.ID = item.ID;
            _obj.curropID = data.opID;
            _obj.currwoOPID = data.woOPID;
            _obj.currStatus = vm.curentAction;
            _obj.SerialNo = serialNoobj.SerialNo = item.SerialNo;
            _obj.createdBy = item.createdBy;
            workorderSerialmstList.push(_obj);
            selectedworkorderSerialNoList.push(serialNoobj);
          });
          woTransObj.workorderSerialmstList = workorderSerialmstList;
          woTransObj.selectedworkorderSerialNoList = selectedworkorderSerialNoList;
          woTransObj.woNumber = data.woNumber;
          woTransObj.opName = data.opName;
          woTransObj.woOPID = data.woOPID;

          vm.cgBusyLoading = WorkorderGenerateSerialFactory.generateSerial().save(woTransObj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.productionStockForm.$setPristine();
              if (Array.isArray(res.data) && res.data.length > 0) {
                DialogFactory.dialogService(
                  CORE.WORKORDER_SERIAL_NO_STATUS_LIST_MODAL_CONTROLLER,
                  CORE.WORKORDER_SERIAL_NO_STATUS_LIST_LIST_MODAL_VIEW,
                  event,
                  res.data).then(() => {
                  }, () => {
                    setFocusByName('scanSerialNumber');
                  }, (err) => BaseService.getErrorLog(err));
              }
              if (!vm.gridOptions.enablePaging) {
                initPageInfo();
              }
              if (vm.gridOptions) {
                vm.gridOptions.gridApi.grid.clearAllFilters();
              }
              vm.loadData();
            }
            $scope.$broadcast('emptySerialSelection');
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    const enterProperDetailToFilter = () => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADD_PROPER_DETAILS_TO_FILTER_FIRSTPICE_SERIALS);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
      return;
    };

    vm.changeselectedSerialFilterValue = () => {
      vm.autoCompleteWorkorderFromSerialsDetail.placeholderName = vm.selectedValue === vm.WOSerialNoFilterType.SerialNumber ? 'Serial#' : 'From Serial#';
      vm.autoCompleteWorkorderToSerialsDetail.isRequired = vm.selectedValue === vm.WOSerialNoFilterType.Range ? true : false;
      vm.isRequiredSerialQtyFilter = vm.selectedValue === vm.WOSerialNoFilterType.FromQty ? true : false;
      vm.serialNumberSelectionForm.rbSerialNumber.$setDirty();
    };

    /* delete serial# */
    vm.deleteRecord = (serialInfo) => {
      if (serialInfo) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Serial#', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((response) => {
          if (response) {
            WorkorderTransSerialFactory.deleteWoTransSerialNo().delete({
              woTransSerialID: serialInfo.woTransSerialID
            }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'serial#')
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    /*dismiss popup*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.productionStockForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel(null);
      }
    };
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };


    // View serial# Transaction history
    vm.UMIDHistory = (rowData, ev) => {
      var dataObj = {
        serialNoid: rowData.refwoSerialNoID,
        serialNo: rowData.serialNo,
        opID: data.opID,
        woID: data.woID,
        woOPID: data.woOPID,
        woNumber: data.woNumber,
        woVersion: data.woVersion,
        opName: data.opName,
        operationFullName: data.operationFullName
      };
      DialogFactory.dialogService(
        TRAVELER.SERIAL_NUMBER_TRANS_HISTORY_CONTROLLER,
        TRAVELER.SERIAL_NUMBER_TRANS_HISTORY_VIEW,
        ev,
        dataObj).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
  }
})();

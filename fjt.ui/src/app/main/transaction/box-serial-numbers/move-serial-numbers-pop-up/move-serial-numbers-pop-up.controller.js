(function () {
  'use strict';

  angular
    .module('app.transaction.boxserialnumbers')
    .controller('MoveSerialNumbersController', MoveSerialNumbersController);

  /** @ngInject */
  function MoveSerialNumbersController(data, $timeout, $q, USER, $scope, $mdDialog, CORE, BoxSerialNumbersFactory, DialogFactory, BaseService, $rootScope) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.boxSerialNoPackagingStatus = CORE.BoxSerialNoPackagingStatus;
    vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
    vm.WorkorderSerialNumberSelectionType = CORE.WorkorderSerialNumberSelectionType;
    vm.selectedValue = vm.WOSerialNoFilterType.SerialNumber;
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.statusText = CORE.statusTextValue;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.prodStatus = CORE.productStatus;
    vm.headerdata = [];
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.boxSerialModel = {
      fromBoxSRId: data && data.id ? data.id : null,
      fromBoxSRUniqueId: data && data.uniqueID ? data.uniqueID : null,
      fromAssyId: data && data.assyID ? data.assyID : null,
      availableQty: data && data.qtyPerBox ? data.qtyPerBox : 0,
      uniqueID: data && data.uniqueID ? data.uniqueID : null,
      isAllowToScanSRNo: data ? Boolean(parseInt((data.isTrackBySerialNo))) : false,
      woNumber: data && data.woNumber ? data.woNumber : null,
      woID: data && data.woID ? data.woID : null

    };
    vm.uomListForWeight = [];
    vm.poundUOMmDetail = {};
    vm.poNumberList = [];
    vm.availableQty = 0;

    vm.scanBoxSerialNumber = (isScanFromSR, e) => {
      scanBoxSerialNumberDetail(isScanFromSR, e);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };
    vm.goToPackagingBoxSerialList = () => {
      BaseService.goToPackagingBoxSerialList();
    };

    // redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    // redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.boxSerialModel.woID);
      return false;
    };

    // go to manage part number
    vm.goToPackagingBoxSerialList = () => {
      BaseService.goToPackagingBoxSerialList();
    };

    // go to manage assembly
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.boxSerialModel.assyID);
      return false;
    };

    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    // Configure Chips for Assembly Detail
    const addAssyHeaderData = (assyDetail) => {
      const assyHeaderObj = {
        label: CORE.LabelConstant.Assembly.ID,
        value: assyDetail.PIDCode ? assyDetail.PIDCode : assyDetail.assyCode,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: assyDetail ? vm.rohsImagePath + assyDetail.assyRohsIcon : null,
          imgDetail: assyDetail ? assyDetail.assyRohsName : null
        },
        isAssyHeader: true
      };

      const assyHeaderIndex = vm.headerdata.findIndex((item) => item.isAssyHeader === true);
      if (assyHeaderIndex !== -1) {
        vm.headerdata[assyHeaderIndex] = assyHeaderObj;
      } else {
        vm.headerdata.push(assyHeaderObj);
      }
    };

    // Configure Chips for Work Order Detail
    const addWOHeaderData = (woDetail) => {
      const woHeaderObj = {
        label: CORE.LabelConstant.Workorder.WO,
        value: woDetail.woNumber,
        displayOrder: 1,
        isWOHeader: true
      };

      if (woDetail && woDetail.woID && !isNaN(woDetail.woID)) {
        woHeaderObj.labelLinkFn = vm.goToWorkorderList;
        woHeaderObj.valueLinkFn = vm.goToWorkorderDetails;
      }
      const woHeaderIndex = vm.headerdata.findIndex((item) => item.isWOHeader === true);
      if (woHeaderIndex !== -1) {
        vm.headerdata[woHeaderIndex] = woHeaderObj;
      } else {
        vm.headerdata.push(woHeaderObj);
      }
    };
    addAssyHeaderData(data);
    addWOHeaderData(data);


    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.boxSerialNoForm);
      if (isDirty) {
        const data = {
          form: vm.boxSerialNoForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(null);
      }
    };
    // ------------------------------------ [S] - Scan Serial Number ------------------------------------
    vm.sourceHeader = [
      {
        field: '#',
        width: '60',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'SerialNo',
        displayName: vm.SerialTypeLabel.MFRSerial.Label,
        width: 200,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'finalSerialNo',
        displayName: vm.SerialTypeLabel.FinalSerial.Label,
        width: 200,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      },
      {
        field: 'employeeName',
        displayName: 'Scanned By',
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      }, {
        field: 'createdAtvalue',
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
        SearchColumns: [],
        SortColumns: [['createdAtvalue', 'desc'], ['SerialNo', 'desc']],
        woTransID: data && data.woTransID ? data.woTransID : null,
        woID: data && data.woID ? data.woID : null,
        opID: data && data.opID ? data.opID : null
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns
    };
    /* retrieve work order transaction serials list */
    vm.loadData = () => {
      vm.pagingInfo.boxSerialId = vm.boxSerialModel.toBoxSRId;
      vm.cgBusyLoading = BoxSerialNumbersFactory.ScanBoxSerialNo(vm.pagingInfo).query().$promise.then((workorderSerials) => {
        setGridOptionsAfterGetData(workorderSerials.data, false);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Set Grid Option after data get */
    const setGridOptionsAfterGetData = (serialData, isGetDataDown) => {
      _.each(serialData.serialList, (data) => {
        vm.selectedProdStatus = _.find(vm.prodStatus, (item) => item.id === data.prodStatus);
        if (vm.selectedProdStatus) {
          data.prodstatus = vm.selectedProdStatus.status;
        }
      });
      if (!isGetDataDown) {
        vm.sourceData = serialData.serialList;
        vm.currentdata = vm.sourceData.length;
      }
      else if (serialData.serialList.length > 0) {
        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(serialData.serialList);
        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
      }

      vm.totalSourceDataCount = serialData.Count;

      if (!vm.gridOptions.enablePaging) {
        vm.currentdata = vm.sourceData.length;
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
    };

    /* delete request list */
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Scan Serial#', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = BoxSerialNumbersFactory.deleteTransBoxSerialNo().query({ objIDs: objIDs }).$promise
              .then((res) => {
                if (res) {
                  $rootScope.$broadcast(USER.RefreshBoxSRNoUIGridList);
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }).catch((error) => BaseService.getErrorLog(error));
          }
        })
          .catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //call once scroll down on grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BoxSerialNumbersFactory.ScanBoxSerialNo(vm.pagingInfo).query({}).$promise.then((workorderSerials) => {
        setGridOptionsAfterGetData(workorderSerials.data, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Clear To Box Serial Filter */
    vm.clearToFilter = () => {
      vm.IsScanedToSNo = false;
      vm.boxSerialModel.toBoxSRUniqueId = null;
      vm.boxSerialModel.toBoxSRId = null;
    };

    /* Clear From Box Serial Filter */
    vm.clearFromFilter = () => {
      vm.IsScanedFromSNo = false;
      vm.boxSerialModel.fromBoxSRUniqueId = null;
      vm.boxSerialModel.fromBoxSRId = null;
      vm.boxSerialModel.toBoxSRUniqueId = null;
      vm.boxSerialModel.toBoxSRId = null;
    };

    /* Change Serial number scan option value  */
    vm.changeselectedSerialFilterValue = () => {
      vm.ToSerialNumber = null;
      vm.serialNumber = null;
      vm.Qty = null;
      vm.fromSerialNoDetail = null;
      vm.inValidToSerialNo = false;
      vm.inValidFormSerialNo = false;
      vm.toSerialNoDetail = null;
      if (vm.selectedValue === vm.WOSerialNoFilterType.Range) {
        vm.selectedRangeValue = vm.WorkorderSerialNumberSelectionType.RangeType.Range;
      }
      vm.scanBoxSerialNoForm.$setUntouched();
      vm.scanBoxSerialNoForm.$setPristine();
    };

    /* Change Range Serial scan option value  */
    vm.changeselectedRangeSerialFilterValue = () => {
      vm.ToSerialNumber = null;
      vm.serialNumberQty = null;
      vm.serialNumber = null;
      vm.Qty = null;
      vm.fromSerialNoDetail = null;
      vm.toSerialNoDetail = null;
      vm.inValidToSerialNo = false;
      vm.inValidFormSerialNo = false;
      vm.isRequiredSerialQtyFilter = (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) ? true : false;
      vm.scanBoxSerialNoForm.$setUntouched();
      vm.scanBoxSerialNoForm.$setPristine();
    };

    /* Scan Box Serial number detail  */
    const scanBoxSerialNumberDetail = (isFromSerialNumber, e) => {
      if ((e.keyCode === 13)) {
        if (isFromSerialNumber) {
          vm.inValidToBoxSerialNo = false;
          vm.moveBoxSerialNoForm.fromBoxSRUniqueId.$setValidity('isInValidFromSerialNo', true);
          vm.boxSerialModel.fromBoxSRId = null;
        } else {
          vm.moveBoxSerialNoForm.toBoxSRUniqueId.$setValidity('isInValidToSerialNo', true);
          vm.boxSerialModel.toBoxSRId = null;
        }

        const woInfo = {
          uniqueID: isFromSerialNumber ? vm.boxSerialModel.fromBoxSRUniqueId : vm.boxSerialModel.toBoxSRUniqueId,
          assyId: isFromSerialNumber ? null : vm.boxSerialModel.fromAssyId,
          woNumber: isFromSerialNumber ? null : vm.boxSerialModel.woNumber
        };
        vm.cgBusyLoading = BoxSerialNumbersFactory.getBoxDetailByBoxID().query(woInfo).$promise.then((response) => {
          if (response && response.data) {
            if ((isFromSerialNumber && vm.boxSerialModel.toBoxSRId === response.data.id) || (!isFromSerialNumber && vm.boxSerialModel.fromBoxSRId === response.data.id)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CANNOT_MOVE_SAME_BOX_SERIAL_NO);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  if (isFromSerialNumber) {
                    vm.moveBoxSerialNoForm.fromBoxSRUniqueId.$setValidity('isInValidFromSerialNo', false);
                    setFocusByName('fromBoxSRUniqueId');
                  } else {
                    setFocusByName('toBoxSRUniqueId');
                    vm.inValidToBoxSerialNo = true;

                    vm.moveBoxSerialNoForm.toBoxSRUniqueId.$setValidity('isInValidToSerialNo', false);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else if (isFromSerialNumber) {
              vm.headerdata = [];
              vm.boxSerialModel.fromBoxSRId = response.data.id;
              // vm.boxSerialModel.fromBoxSRUniqueId = response.data.uniqueID;
              vm.boxSerialModel.fromAssyId = response.data.assyID;
              vm.boxSerialModel.availableQty = response.data.qtyPerBox;
              vm.boxSerialModel.woNumber = response.data.woNumber;
              vm.boxSerialModel.isAllowToScanSRNo = Boolean(parseInt((response.data.isTrackBySerialNo)));
              vm.boxSerialModel.woID = response.data.woID;
              const woDet = {
                woID: vm.boxSerialModel.woID,
                woNumber: vm.boxSerialModel.woNumber
              };
              addWOHeaderData(woDet);
              addAssyHeaderData(response.data);
              // vm.IsScanedFromSNo = true;
            } else {
              vm.boxSerialModel.toBoxSRId = response.data.id;
              // vm.boxSerialModel.toBoxSRUniqueId = response.data.uniqueID;
              vm.boxSerialModel.toAssyId = response.data.assyID;
              vm.boxSerialModel.fromWoNumber = response.data.woNumber;
              vm.boxSerialModel.isAllowToScanSRNo = Boolean(parseInt((response.data.isTrackBySerialNo)));
              vm.inValidToBoxSerialNo = false;
              if (vm.boxSerialModel.isAllowToScanSRNo) {
                $timeout(() => {
                  setFocusByName('scanSerialNumber');
                }, true);
              } else {
                setFocus('qtyPerBox');
              }
            }
          } else if (response && response.alretCallbackFn) {
            response.alretCallbackFn.then((yes) => {
              if (yes) {
                if (isFromSerialNumber) {
                  vm.moveBoxSerialNoForm.fromBoxSRUniqueId.$setValidity('isInValidFromSerialNo', false);
                  setFocusByName('fromBoxSRUniqueId');
                } else {
                  setFocusByName('toBoxSRUniqueId');
                  vm.inValidToBoxSerialNo = true;

                  vm.moveBoxSerialNoForm.toBoxSRUniqueId.$setValidity('isInValidToSerialNo', false);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    vm.scanQtydetail = () => {
      if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange
        && vm.fromSerialNoDetail) {
        vm.getSelectedSerialNumberList();
      }
    };

    /* Fetch Box Serial number detail on scan detail*/
    vm.scanSerialNumberDetail = (SerialNo, field, e) => {
      if (SerialNo) {
        $timeout(() => {
          scanSerialNumber(SerialNo, field, e);
        }, true);
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(e);
      }
    };

    /* Fetch Box Serial number detail on scan detail*/
    const scanSerialNumber = (SerialNo, field, e) => {
      let messageContent;
      if ((e.keyCode === 13)) {
        if (field === 'scanToSerialNumber') {
          vm.inValidToSerialNo = false;
        } else {
          vm.inValidFormSerialNo = false;
        }
        const woInfo = { woID: vm.boxSerialModel.woID, fromBoxSRId: vm.boxSerialModel.fromBoxSRId, serialNo: SerialNo };
        vm.cgBusyLoading = BoxSerialNumbersFactory.getScanBoxSerialNumberDetails().query(woInfo).$promise.then((response) => {
          if (response && response.data) {
            if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
              if (field === 'scanSerialNumber') {
                vm.fromSerialNoDetail = response.data;
                setFocusByName('scanToSerialNumber');
              } else {
                vm.toSerialNoDetail = response.data;
                vm.getSelectedSerialNumberList();
              }
            } else if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
              if (field === 'scanSerialNumberforQty') {
                vm.fromSerialNoDetail = response.data;
                setFocusByName('Qty');
              }
            } else if (vm.selectedValue === vm.WOSerialNoFilterType.SerialNumber) {
              vm.fromSerialNoDetail = response.data;
              vm.getSelectedSerialNumberList();
            }
          } else {
            if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
              if (field === 'scanSerialNumber') {
                vm.fromSerialNoDetail = null;
                vm.inValidFormSerialNo = true;
                setFocusByName('scanSerialNumber');
              } else {
                vm.toSerialNoDetail = null;
                vm.inValidToSerialNo = true;
                setFocusByName('scanToSerialNumber');
              }
            } else if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
              if (field === 'scanSerialNumberforQty') {
                vm.fromSerialNoDetail = null;
                vm.inValidFormSerialNo = true;
                setFocusByName('scanSerialNumberQty');
              }
            } else if (vm.selectedValue === vm.WOSerialNoFilterType.SerialNumber) {
              vm.fromSerialNoDetail = null;
              vm.inValidFormSerialNo = true;
              setFocusByName('scanSerialNumber');
            }
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                if (field === 'scanSerialNumber') {
                  vm.serialNumber = null;
                  setFocusByName('scanSerialNumber');
                } else if (field === 'scanToSerialNumber') {
                  vm.ToSerialNumber = null;
                  setFocusByName('scanSerialNumber');
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Get Passed Serial Number Detail on scan serial number detail */
    vm.getPassedSerialNumber = (isBulkCase) => {
      if (BaseService.focusRequiredField(vm.moveBoxSerialNoForm)) {
        vm.isSubmit = false;
        return;
      }
      if (!vm.boxSerialModel.fromBoxSRId || !vm.boxSerialModel.toBoxSRId) {
        enterProperBoxSRNoDetailToFilter();
      } else {
        if (isBulkCase) {
          generateBoxSerialno(isBulkCase);
        }
        else {
          if (BaseService.focusRequiredField(vm.scanBoxSerialNoForm)) {
            vm.isSubmit = false;
            return;
          }
          if (vm.woSerialNoList && vm.woSerialNoList.length) {
            if (((vm.totalSourceDataCountOfInProcessingSerial) + vm.woSerialNoList.length)
              > (vm.readyStockData ? vm.readyStockData.totalValidQty : 0)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_MORE_THAN_ISSUEQTY);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return;
            }

            if (vm.selectedValue === vm.WOSerialNoFilterType.SerialNumber) {
              generateBoxSerialno();
            } else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_SERIAL_QTY_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, vm.serialNoRangeDet.fromSerialNo, vm.serialNoRangeDet.toSerialNo, vm.serialNoRangeDet.availableQtyToScan);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then(() => {
                generateBoxSerialno();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }
      }
    };

    /* Validation message on enter valid serial number */
    const enterProperBoxSRNoDetailToFilter = () => {
      const pendingBoxScan = vm.boxSerialModel.fromBoxSRId ? 'To' : 'From';
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_BOX_SERIAL_NUMBER_TO_FOR_MOVE);
      messageContent.message = stringFormat(messageContent.message, pendingBoxScan);
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
      return;
    };

    /* Validation message on enter valid serial number */
    const enterProperDetailToFilter = () => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ADD_PROPER_DETAILS_TO_FILTER_FIRSTPICE_SERIALS);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
      return;
    };

    const generateBoxSerialno = (isBalkCase) => {
      const loginUserDetails = BaseService.loginUser;

      const moveSRNoObj = {};
      moveSRNoObj.fromBoxSRId = vm.boxSerialModel.fromBoxSRId;
      moveSRNoObj.toBoxSRId = vm.boxSerialModel.toBoxSRId;
      moveSRNoObj.woID = vm.boxSerialModel.woID;
      moveSRNoObj.employeeID = loginUserDetails.employee.id;
      if (!isBalkCase) {
        moveSRNoObj.woTransSerialNoList = _.map(vm.woSerialNoList, 'SerialNo');
      }
      moveSRNoObj.qty = vm.boxSerialModel.qtyPerBox;

      vm.cgBusyLoading = BoxSerialNumbersFactory.moveBoxSerialno().save(moveSRNoObj).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          $rootScope.$broadcast(USER.RefreshBoxSRNoUIGridList);
          vm.scanBoxSerialNoForm.$setPristine();
          if (Array.isArray(res.data) && res.data.length > 0) {
            DialogFactory.dialogService(
              CORE.WORKORDER_SERIAL_NO_STATUS_LIST_MODAL_CONTROLLER,
              CORE.WORKORDER_SERIAL_NO_STATUS_LIST_LIST_MODAL_VIEW,
              event,
              res.data).then(() => {
              }, () => {
                setFocusByName('scanSerialNumber');
              }, (err) => BaseService.getErrorLog(err));
          } else {
            vm.resetScanNumber();
            $rootScope.$broadcast(USER.RefreshBoxSRNoUIGridList);
            setFocusByName('scanSerialNumber');
          }
          if (vm.boxSerialModel.isAllowToScanSRNo) {
            if (!vm.gridOptions.enablePaging) {
              initPageInfo();
            }
            if (vm.gridOptions) {
              vm.gridOptions.gridApi.grid.clearAllFilters();
            }
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          } else {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.status);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Reset scan serial number */
    vm.resetScanNumber = () => {
      vm.ToSerialNumber = null;
      vm.serialNumberQty = null;
      vm.serialNumber = null;
      vm.Qty = null;
      vm.fromSerialNoDetail = null;
      vm.toSerialNoDetail = null;
      vm.inValidToSerialNo = false;
      vm.inValidFormSerialNo = false;
      vm.scanBoxSerialNoForm.$setUntouched();
      vm.scanBoxSerialNoForm.$setPristine();
    };

    /* Get Selected Serial number list */
    vm.getSelectedSerialNumberList = (isBalkCase) => {
      if (isBalkCase) {
        vm.getPassedSerialNumber(isBalkCase);
      } else {
        if (vm.selectedValue !== vm.WOSerialNoFilterType.SerialNumber) {
          if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
            if (vm.fromSerialNoDetail && vm.toSerialNoDetail) {
              const startFromNum = vm.fromSerialNoDetail.serialIntVal;
              const endToNum = vm.toSerialNoDetail.serialIntVal;

              if (parseInt(startFromNum) > parseInt(endToNum)) {
                //show validation message no data selected
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return;
              } else {
                getSerialNoListByRangeQty();
              }
            } else {
              enterProperDetailToFilter();
            }
          } else if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
            if (!vm.fromSerialNoDetail || !vm.Qty) {
              enterProperDetailToFilter();
            } else {
              getSerialNoListByRangeQty();
            }
          }
        } else {
          if (!vm.fromSerialNoDetail) {
            enterProperDetailToFilter();
          } else {
            vm.woSerialNoList = [];
            vm.woSerialNoList = [vm.fromSerialNoDetail];
            vm.getPassedSerialNumber();
          }
        }
      }
    };

    /* Call back method on get validate and retrieve serial number list*/
    function getSerialNoListByRangeQty() {
      const QueryObj = {
        woID: vm.boxSerialModel.woID,
        fromSerialNo: vm.fromSerialNoDetail.SerialNo,
        toSerialNo: vm.toSerialNoDetail ? vm.toSerialNoDetail.SerialNo : null,
        Qty: vm.Qty,
        selectionType: vm.selectedRangeValue
      };
      vm.cgBusyLoading = BoxSerialNumbersFactory.getValidateBoxSerialNumberDetailsList().query(QueryObj).$promise.then((response) => {
        if (response && response.data) {
          const woSerialNoList = response.data.woSerialNoList;
          //if selected value is range

          if (woSerialNoList.length > 0) {
            const passedQty = woSerialNoList.filter((item) => item.currStatus === vm.statusText.Passed.Value).length;
            vm.serialNoRangeDet = {
              fromSerialNo: woSerialNoList[0].SerialNo,
              toSerialNo: woSerialNoList[woSerialNoList.length - 1].SerialNo,
              availableQtyToScan: passedQty
            };

            vm.woSerialNoList = woSerialNoList;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // ------------------------------------ [S] - Serial Number ------------------------------------

    // check for dirty form
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    // on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.boxSerialNoForm);
    });

    // close popup on page destroy
    $scope.$on('$destroy', () => {
      //$mdDialog.hide(false, { closeAll: true });
    });
  }
})();

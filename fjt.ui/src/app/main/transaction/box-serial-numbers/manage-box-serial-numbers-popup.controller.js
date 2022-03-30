(function () {
  'use strict';

  angular
    .module('app.transaction.boxserialnumbers')
    .controller('ManageBoxSerialNumbersController', ManageBoxSerialNumbersController);

  /** @ngInject */
  function ManageBoxSerialNumbersController(data, $timeout, $scope, $mdDialog, CORE, USER, TRANSACTION, BoxSerialNumbersFactory, ReceivingMaterialFactory, UnitFactory, ComponentFactory, BaseService, DialogFactory, $rootScope) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridBoxScanSerialNumbers = CORE.gridConfig.gridBoxScanSerialNumbers;
    vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
    vm.WorkorderSerialNumberSelectionType = CORE.WorkorderSerialNumberSelectionType;
    vm.selectedValue = vm.WOSerialNoFilterType.SerialNumber;
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.statusText = CORE.statusTextValue;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SCAN_BOX_SERIAL;
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.scanSerialNoHistory = true;
    vm.PartCategory = CORE.PartCategory;

    vm.boxSerialModel = {
      id: (data && data.data && data.data.id) ? data.data.id : null,
      uniqueID: padStringFormat('0', 10, '0'),
      assyStockID: data && data.travelDetail ? data.travelDetail.assyStockID : null,
      partID: null,
      woNumber: null,
      openingStock: null,
      serialNo: null,
      openingdate: null,
      type: null,
      qtyPerBox: 0,
      isAssybleConfiugre: (data && data.travelDetail && data.travelDetail.woID) ? !isNaN(data.travelDetail.woID) : false,
      isTrackBySerialNo: (data && data.travelDetail && data.travelDetail.isTrackbySerialNo) ? data.travelDetail.isTrackbySerialNo : false,
      woID: (data && data.travelDetail && data.travelDetail.woID) ? data.travelDetail.woID : null
    };
    vm.uomListForWeight = [];
    vm.poundUOMmDetail = {};
    vm.poNumberList = [];
    vm.availableQty = 0;
    vm.headerdata = [{
      label: CORE.LabelConstant.Traveler.AvailableQty, value: vm.availableQty, displayOrder: 3
    }];

    const pacakingStatus = angular.copy(CORE.BoxSerialNoPackagingStatus);
    vm.boxSerialNoPackagingStatus = vm.boxSerialModel.id ? pacakingStatus : pacakingStatus.filter((item) => item.value === 'Not Packed to ship' || item.value === 'Packed to Ship');
    vm.boxSerialModel.status = !(data && data.data && data.data.id) ? vm.boxSerialNoPackagingStatus[1].id : null;

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

    // go to manage warehouse
    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    // go to manage bin master
    vm.goToBinList = () => {
      BaseService.goToBinList();
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


    // to retrieve box serial number data by id (in case of update)
    const getBoxSerialDetail = () => {
      if (vm.boxSerialModel.id) {
        vm.cgBusyLoading = BoxSerialNumbersFactory.RetriveBoxSerialNoById().query({ id: vm.boxSerialModel.id }).$promise.then((boxSerialNumber) => {
          if (boxSerialNumber && boxSerialNumber.data) {
            vm.boxSerialModel = boxSerialNumber.data;
            vm.boxSerialModel.isTrackBySerialNo = Boolean(parseInt((vm.boxSerialModel.isTrackBySerialNo)));
            vm.boxSerialModel.woID = vm.boxSerialModel.woID ? vm.boxSerialModel.woID : ((data && data.travelDetail && data.travelDetail.woID) ? data.travelDetail.woID : null);
            vm.boxSerialModel.woTransID = data && data.travelDetail ? data.travelDetail.woTransID : null;
            vm.boxSerialModel.alreadyAddedBoxQty = vm.boxSerialModel.qtyPerBox;
            vm.boxSerialModel.isAssybleConfiugre = vm.boxSerialModel.woID ? true : false;

            const loginUserDetails = BaseService.loginUser;
            vm.boxSerialModel.employeeId = data && data.travelDetail ? data.travelDetail.employeeId : (loginUserDetails.employee ? loginUserDetails.employee.id : null);

            vm.boxSerialModel.boxSerialId = vm.boxSerialModel.id;
            vm.boxSerialModel.woNumber = vm.boxSerialModel.woNumber ? vm.boxSerialModel.woNumber : data.travelDetail.woNumber;

            if (vm.boxSerialModel && vm.boxSerialModel.partID) {
              vm.binName = vm.boxSerialModel.binName;
              vm.warehouse = vm.boxSerialModel.warehouseName;
              vm.availableQty = vm.boxSerialModel.availableQty;
              vm.headerdata[0].value = vm.boxSerialModel.id ? (vm.boxSerialModel.qtyPerBox + (vm.availableQty)) : (vm.availableQty);

              vm.boxSerialModel.mfgPNDescription = vm.boxSerialModel.assyCompMfgPNDescription;
              vm.assyList = [{
                id: vm.boxSerialModel.assyID,
                PIDCode: vm.boxSerialModel.assyCompPIDCode,
                packagingWeight: vm.boxSerialModel.assyCompPackagingWeight,
                packagingWeightUom: vm.boxSerialModel.assyCompPackagingWeightUom,
                mfgPNDescription: vm.boxSerialModel.assyCompMfgPNDescription,
                rohsIcon: vm.boxSerialModel.assyRohsIcon,
                rohsName: vm.boxSerialModel.assyRohsName
              }];
              $timeout(() => {
                $scope.$broadcast(vm.autoCompleteAssy.inputName, vm.assyList[0]);
              });

              vm.partList = [{
                id: vm.boxSerialModel.partID,
                PIDCode: vm.boxSerialModel.partPIDCode,
                packagingWeight: vm.boxSerialModel.partPackagingWeight,
                packagingWeightUom: vm.boxSerialModel.partPackagingWeightUom
              }];
              $timeout(() => {
                $scope.$broadcast(vm.autoCompletePackagingMateriaPart.inputName, vm.partList[0]);
              });

              vm.woList = [{
                woID: vm.boxSerialModel.woID ? vm.boxSerialModel.woID : vm.boxSerialModel.woNumber,
                woNumber: vm.boxSerialModel.woNumber,
                availableQty: vm.availableQty,
                assyStockID: vm.boxSerialModel.assyStockID ? vm.boxSerialModel.assyStockID : null,
                isTrackBySerialNo: vm.boxSerialModel.isTrackBySerialNo,
                datecode: vm.boxSerialModel.datecode ? vm.boxSerialModel.datecode : null
              }];
              $timeout(() => {
                $scope.$broadcast(vm.autoCompleteWO.inputName, vm.woList[0]);
              });
              if (vm.boxSerialModel.soDetID) {
                vm.autoCompletePONumber.isRequired = true;
                vm.poNumberList = [{ id: vm.boxSerialModel.soDetID, poNumber: vm.boxSerialModel.poNumber }];
                $timeout(() => {
                  vm.autoCompletePONumber.keyColumnId = vm.boxSerialModel.soDetID;
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // get all assembly list
    const getPartSearch = (searchObj, isAutoSelect) =>
      BoxSerialNumbersFactory.getAllAssemblyBySearch().save({ listObj: searchObj }).$promise
        .then((assyIDList) => {
          if (assyIDList && assyIDList.data) {
            vm.assyList = assyIDList.data;
            if (isAutoSelect) {
              if (vm.autoCompleteAssy && vm.autoCompleteAssy.inputName) {
                $scope.$broadcast(vm.autoCompleteAssy.inputName, vm.assyList[0]);
              }
            }
          }
          else {
            vm.assyList = [];
          }
          return vm.assyList;
        }).catch((error) => BaseService.getErrorLog(error));

    // get all WO list
    const getWOSearch = (searchObj, isAutoSelect) => {
      if (vm.boxSerialModel.assyID) {
        return BoxSerialNumbersFactory.getAllWorkOrderBySearch().save({ listObj: searchObj, partID: vm.boxSerialModel.assyID, boxSerialID: vm.boxSerialModel.id }).$promise
          .then((WOList) => {
            if (WOList && WOList.data.length > 0) {
              vm.woList = WOList.data;
              if (isAutoSelect) {
                if (vm.autoCompleteWO && vm.autoCompleteWO.inputName) {
                  $scope.$broadcast(vm.autoCompleteWO.inputName, vm.woList[0]);
                }
              }
            }
            else {
              vm.woList = [];
            }
            return vm.woList;
          }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        return [];
      }
    };

    // get all assembly list
    const getPackagingMaterialPartSearch = (searchObj, isAutoSelect) =>
      BoxSerialNumbersFactory.getAllPackagingMaterialPartBySearch().save({ listObj: searchObj }).$promise
        .then((partIDList) => {
          if (partIDList && partIDList.data) {
            vm.partList = partIDList.data;
            if (isAutoSelect) {
              if (vm.autoCompletePackagingMateriaPart && vm.autoCompletePackagingMateriaPart.inputName) {
                $scope.$broadcast(vm.autoCompletePackagingMateriaPart.inputName, vm.partList[0]);
              }
            }
          }
          else {
            vm.partList = [];
          }
          return vm.partList;
        }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      // for assyID (partID)
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: (vm.boxSerialModel && vm.boxSerialModel.assyID) ? vm.boxSerialModel.assyID : null,
        inputName: 'SearchAssy',
        placeholderName: 'Type here to search assembly',
        isRequired: true,
        isAddnew: true,
        onSelectCallbackFn: function (item) {
          if (!item) {
            vm.woList = [];
            $timeout(() => {
              $scope.$broadcast(vm.autoCompleteWO.inputName, null);
            });
            vm.poNumberList = [];
            $timeout(() => {
              $scope.$broadcast(vm.autoCompletePONumber.inputName, null);
            });
            vm.boxSerialModel.assyID = null;
            vm.binName = null;
            vm.departmentName = null;
            vm.warehouse = null;
            vm.boxSerialModel.binID = null;
            vm.boxSerialModel.whID = null;
            vm.boxSerialModel.mfgPNDescription = null;
            vm.boxSerialModel.boxWeight = null;
          }
          else {
            vm.boxSerialModel.assyID = item.id;
            vm.boxSerialModel.mfgPNDescription = item.mfgPNDescription;
            getWarehouseDetail(item.PIDCode);
            const uomDetail = vm.uomListForWeight.find((unit) => unit.id === item.packagingWeightUom);
            vm.assyUomDetail = uomDetail;
            vm.assyPackagingWeight = item.packagingWeight;
            caclulateWeight();
            addAssyHeaderData(item);
          }
        },
        callbackFn: function (obj) {
          const searchObj = {
            query: obj.PIDCode
          };
          return getPartSearch(searchObj, true);
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getPartSearch(searchObj, false);
        },
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        }
      };

      // for woNumber
      vm.autoCompleteWO = {
        columnName: 'woNumber',
        keyColumnName: 'woID',
        keyColumnId: (vm.boxSerialModel && vm.boxSerialModel.woID) ? vm.boxSerialModel.woID : null,
        inputName: 'SearchWO',
        placeholderName: 'Type here to search WO#',
        isRequired: true,
        onSelectCallbackFn: (item) => {
          if (!item) {
            vm.poNumberList = [];
            vm.autoCompletePONumber.isRequired = false;
            vm.autoCompletePONumber.keyColumnId = null;
            vm.availableQty = 0;
            vm.headerdata[0].value = 0;
            vm.boxSerialModel.qtyPerBox = 0;
          } else {
            vm.headerdata[0].value = vm.boxSerialModel.id ? (vm.boxSerialModel.qtyPerBox + (item.availableQty)) : (item.availableQty);
            vm.availableQty = item.availableQty;
            vm.boxSerialModel.woNumber = item ? item.woNumber : null;
            vm.boxSerialModel.woID = item && !isNaN(item.woID) ? item.woID : null;
            vm.boxSerialModel.isTravelar = item && !isNaN(item.woID) ? true : false;
            vm.boxSerialModel.assyStockID = item && item.assyStockID ? item.assyStockID : null;
            vm.autoCompletePONumber.isRequired = vm.boxSerialModel.woID ? true : false;
            vm.boxSerialModel.isTrackBySerialNo = item.isTrackBySerialNo;
            vm.boxSerialModel.datecode = item.datecode;
            if (vm.boxSerialModel.woID && vm.poNumberList.length === 0) {
              getAllPONumberByWoID(vm.boxSerialModel.woID);
            }
            addWOHeaderData(item);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query,
            partID: vm.boxSerialModel.partID
          };
          return getWOSearch(searchObj, false);
        }
      };

      // for Packaging Material part List
      vm.autoCompletePackagingMateriaPart = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: (vm.boxSerialModel && vm.boxSerialModel.partID) ? vm.boxSerialModel.partID : null,
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        inputName: 'SearchPackagingMaterial',
        placeholderName: 'Type here to search part',
        isRequired: true,
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            query: obj.mfgPN
          };
          return getPackagingMaterialPartSearch(searchObj, true);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.boxSerialModel.partID = item.id;
            const uomDetail = vm.uomListForWeight.find((unit) => unit.id === item.packagingWeightUom);
            vm.partUomDetail = uomDetail;
            vm.partPackagingWeight = item.packagingWeight;
            caclulateWeight();
          } else {
            vm.boxSerialModel.partID = null;
            $scope.$broadcast(vm.autoCompletePackagingMateriaPart.inputName, null);
          }
        },
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getPackagingMaterialPartSearch(searchObj, false);
        }
      };
      vm.autoCompletePONumber = {
        columnName: 'poNumber',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'PONumber',
        placeholderName: 'PO Number',
        isRequired: false,
        isAddnew: false,
        callbackFn: getAllPONumberByWoID,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.boxSerialModel.soDetID = item.id;
          } else {
            vm.boxSerialModel.soDetID = null;
          }
        }
      };
    };

    // Configure Chips for Assembly Detail
    const addAssyHeaderData = (assyDetail) => {
      const assyHeaderObj = {
        label: CORE.LabelConstant.Assembly.ID,
        value: assyDetail.PIDCode,
        displayOrder: 2,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: assyDetail ? vm.rohsImagePath + assyDetail.rohsIcon : null,
          imgDetail: assyDetail ? assyDetail.rohsName : null
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

    //get warehouse details for selected assy
    const getWarehouseDetail = (name) => {
      const obj = {
        name: name
      };
      vm.cgBusyLoading = ReceivingMaterialFactory.match_Warehouse_Bin().query(obj).$promise.then((res) => {
        if (res && res.data) {
          const warehouseDet = res.data;
          vm.binName = warehouseDet.Name;
          vm.warehouse = warehouseDet.warehousemst ? warehouseDet.warehousemst.Name : '';
          vm.boxSerialModel.binID = warehouseDet.id;
          vm.boxSerialModel.whID = warehouseDet.WarehouseID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get all assembly list
    function getAllPONumberByWoID(woID) {
      if (woID) {
        BoxSerialNumbersFactory.getAllPONumberByWoID().save({ woID: woID }).$promise
          .then((poIDList) => {
            if (poIDList && poIDList.data) {
              vm.poNumberList = poIDList.data;
              $timeout(() => {
                if (vm.autoCompletePONumber && vm.autoCompletePONumber.inputName) {
                  $scope.$broadcast(vm.autoCompletePONumber.inputName, poIDList.data[0]);
                }
              });
            }
            else {
              vm.poNumberList = [];
            }
            return vm.poNumberList;
          }).catch((error) => BaseService.getErrorLog(error));
      }
      return [];
    }

    // ------------------------------------ [S] - Unit Conversation -------------------------------------------
    const getUomClassList = () => UnitFactory.getMeasurementTypeList().query().$promise.then((res) => {
      if (res && res.data) {
        const weightId = _.find(res.data, (item) => item.name === 'Weight');
        ComponentFactory.getUOMsList().query({
          measurementTypeID: weightId ? weightId.id : null
        }).$promise.then((res) => {
          vm.uomListForWeight = res && res.data ? res.data : [];
          vm.poundUOMmDetail = vm.uomListForWeight.find((unit) => unit.unitName === 'Pound');
          if (data && data.data && data.data.id) {
            getBoxSerialDetail();
          } else if (data && data.travelDetail && data.travelDetail.pidCode) {
            $timeout(() => {
              const search = { query: data.travelDetail.pidCode };
              getPartSearch(search, true);
              vm.boxSerialModel.assyID = data.travelDetail.assyID;
              const woSearch = {
                woID: data.travelDetail.assyStockID ? data.travelDetail.woNumber : data.travelDetail.woID,
                woNumber: data.travelDetail.woNumber, availableQty: 0,
                assyStockID: data.travelDetail.assyStockID,
                isTrackBySerialNo: data.travelDetail.isTrackbySerialNo,
                datecode: data.travelDetail.datecode
              };
              $scope.$broadcast(vm.autoCompleteWO.inputName, woSearch);
              getAvailableQtyByStockIdOrWoID(data.travelDetail.assyStockID, (data.travelDetail.assyStockID ? null : data.travelDetail.woID));
            });
          }
          const loginUserDetails = BaseService.loginUser;
          vm.boxSerialModel.employeeId = data && data.travelDetail ? data.travelDetail.employeeId : (loginUserDetails.employee ? loginUserDetails.employee.id : null);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }).catch((error) => BaseService.getErrorLog(error));
    getUomClassList();

    function getAvailableQtyByStockIdOrWoID(assyStockId, woID) {
      const reqObj = { assyStockID: assyStockId, woID: woID };
      vm.cgBusyLoading = BoxSerialNumbersFactory.getAvailableQtyByStockIdOrWoID(reqObj).query().$promise.then((availableQtyDet) => {
        if (availableQtyDet && availableQtyDet.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.availableQty = availableQtyDet.data;
          vm.headerdata[0].value = vm.boxSerialModel.id ? (vm.boxSerialModel.qtyPerBox + (vm.availableQty)) : (vm.availableQty);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getUnitConversion(fromUnit, toUnit, value) {
      if (fromUnit === toUnit) {
        return Number(value.toFixed(3));
      }
      if (fromUnit && toUnit) {
        const fromBasedUnitValues = fromUnit.baseUnitConvertValue;
        const toBasedUnitValues = toUnit.baseUnitConvertValue;
        const ConvertFromValueIntoBasedValue = (value / fromBasedUnitValues);
        let result = ConvertFromValueIntoBasedValue * toBasedUnitValues;
        if (isNaN(result)) {
          result = 0;
        }
        return Number(result.toFixed(3));
      }
      return 0;
    }

    vm.changeQtyPerBox = () => {
      const value = Number(vm.boxSerialModel.qtyPerBox);
      if (!vm.boxSerialModel.qtyPerBox || isNaN(value) || !vm.assyUomDetail) {
        return;
      };

      caclulateWeight();
    };
    const caclulateWeight = () => {
      const assyWeight = getUnitConversion(vm.assyUomDetail, vm.poundUOMmDetail, vm.assyPackagingWeight);
      const partWeight = getUnitConversion(vm.partUomDetail, vm.poundUOMmDetail, vm.partPackagingWeight);
      vm.boxSerialModel.assyWeight = `${Number(assyWeight.toFixed(3))} ${vm.poundUOMmDetail.abbreviation}`;
      vm.boxSerialModel.partWeight = `${Number(partWeight.toFixed(3))} ${vm.poundUOMmDetail.abbreviation}`;
      vm.boxSerialModel.totalBoxWeight = `${Number(((vm.boxSerialModel.qtyPerBox * assyWeight) + partWeight).toFixed(3))} ${vm.poundUOMmDetail.abbreviation}`;
    };
    // ------------------------------------ [E] - Unit Conversation -------------------------------------------

    initAutoComplete();

    /*Used to Save records*/
    vm.addUpdateBoxSerialNumber = (isSaveAndClose) => {
      vm.isSubmit = true;
      if (BaseService.focusRequiredField(vm.boxSerialNoForm)) {
        vm.isSubmit = false;
        return;
      }

      const boxSerialNoInfo = {
        id: vm.boxSerialModel.id,
        woID: vm.boxSerialModel.woID,
        assyStockID: vm.boxSerialModel.assyStockID,
        uniqueID: vm.boxSerialModel.uniqueID,
        partID: vm.boxSerialModel.partID,
        soDetID: vm.boxSerialModel.soDetID,
        assyID: vm.boxSerialModel.assyID,
        woTransID: vm.boxSerialModel.woTransID,
        qtyPerBox: vm.boxSerialModel.qtyPerBox,
        boxWeight: vm.boxSerialModel.boxWeight,
        boxWeightUOM: vm.boxSerialModel.boxWeightUOM,
        status: vm.boxSerialModel.status,
        binID: vm.boxSerialModel.binID,
        whID: vm.boxSerialModel.whID,
        datecode: vm.boxSerialModel.datecode,
        woNumber: vm.boxSerialModel.woNumber,
        remark: vm.boxSerialModel.remark
      };

      // code to add
      vm.cgBusyLoading = BoxSerialNumbersFactory.BoxSerialNo().save(boxSerialNoInfo).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (isSaveAndClose) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.status);
          }
          $rootScope.$broadcast(USER.RefreshBoxSRNoUIGridList);
          vm.boxSerialModel.id = res.data && res.data.boxId ? res.data.boxId : vm.boxSerialModel.id;
          vm.boxSerialNoForm.$setUntouched();
          vm.boxSerialNoForm.$setPristine();
          getBoxSerialDetail();
        }
        else {
          vm.availableQty = res && res.errors && res.errors.data ? res.errors.data.availableQty : vm.availableQty;
          /*Set focus on first enabled field after user click Ok button*/
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.boxSerialNoForm);
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
      vm.isSubmit = false;
    };

    //hyper-link go for list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

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
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: '60',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'SerialNo',
      displayName: vm.SerialTypeLabel.MFRSerial.Label,
      width: 400,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'finalSerialNo',
      displayName: vm.SerialTypeLabel.FinalSerial.Label,
      width: 400,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
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
      vm.pagingInfo.boxSerialId = vm.boxSerialModel.id;
      vm.cgBusyLoading = BoxSerialNumbersFactory.ScanBoxSerialNo(vm.pagingInfo).query().$promise.then((workorderSerials) => {
        vm.sourceData = workorderSerials.data.serialList;
        vm.totalSourceDataCount = workorderSerials.data.Count;
        setGridOptionsAfterGetData();
      }).catch((error) => BaseService.getErrorLog(error));
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
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.MFG.SerialNo, selectedIDs.length);
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
                  getBoxSerialDetail();
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

    // call once scroll down on grid
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BoxSerialNumbersFactory.ScanBoxSerialNo(vm.pagingInfo).query({}).$promise.then((workorderSerials) => {
        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workorderSerials.data.serialList);
        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        //vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // View list of Scan SR# History
    vm.openScanSerialNoHistory = (row, ev) => {
      const data = row && row.entity ? { serialID: row.entity.serialID } : null;
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_HISTORY_POPUP_CONTROLLER,
        TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    // Change Scan Serial# Filter value
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

    // Change Range Scan Serial# Filter value
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
    vm.scanSerialNumberDetail = (SerialNo, field, e) => {
      if (SerialNo) {
        scanSerialNumber(SerialNo, field, e);
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(e);
      }
    };

    vm.scanQtydetail = () => {
      if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange
        && vm.fromSerialNoDetail) {
        vm.getSelectedSerialNumberList();
      }
    };

    /* Fetch Serial number detail on scan detail*/
    const scanSerialNumber = (SerialNo, field, e) => {
      let messageContent;
      if ((e.keyCode === 13)) {
        if (field === 'scanToSerialNumber') {
          vm.inValidToSerialNo = false;
        } else {
          vm.inValidFormSerialNo = false;
        }
        const woInfo = { woID: vm.boxSerialModel.woID, serialNo: SerialNo };
        vm.cgBusyLoading = BoxSerialNumbersFactory.getValidateBoxSerialNumberDetails().query(woInfo).$promise.then((response) => {
          if (response && response.data) {
            const isAllowFinalSerialMapping = response.data.isAllowFinalSerialMapping;
            if (isAllowFinalSerialMapping && !response.data.ProductSerialNo) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SERIAL_NUMBER_MAPPING_REQUIRED);
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
                    setFocusByName('scanToSerialNumber');
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              switch (response.data.currStatus) {
                case vm.statusText.Passed.Value:
                  response.data.currentStautstext = vm.statusText.Passed.Text;
                  break;
                case vm.statusText.Reprocessed.Value:
                  response.data.currentStautstext = vm.statusText.Reprocessed.Text;
                  break;
                case vm.statusText.DefectObserved.Value:
                  response.data.currentStautstext = vm.statusText.DefectObserved.Text;
                  break;
                case vm.statusText.Scraped.Value:
                  response.data.currentStautstext = vm.statusText.Scraped.Text;
                  break;
                case vm.statusText.ReworkRequired.Value:
                  response.data.currentStautstext = vm.statusText.ReworkRequired.Text;
                  break;
                case vm.statusText.BoardWithMissingParts.Value:
                  response.data.currentStautstext = vm.statusText.BoardWithMissingParts.Text;
                  break;
                case vm.statusText.Bypassed.Value:
                  response.data.currentStautstext = vm.statusText.Bypassed.Text;
                  break;
                default:
                  response.data.currentStautstext = 'Idle';
              }

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
                  setFocusByName('scanToSerialNumber');
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Set Grid Option after data get */
    const setGridOptionsAfterGetData = () => {
      if (!vm.gridOptions.enablePaging) {
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.resetScroll();
      }
      vm.gridOptions.clearSelectedRows();
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
        vm.resetSourceGrid();
        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    };

    /* Get Passed Serial Number Detail on scan serial number detail */
    vm.getPassedSerialNumber = () => {
      if (BaseService.focusRequiredField(vm.scanBoxSerialNoForm)) {
        return;
      }
      if (vm.woSerialNoList && vm.woSerialNoList.length) {
        //if (((vm.totalSourceDataCountOfInProcessingSerial - vm.CountOfAlreadyAddedReprocessedQty || 0) + serialNumberList.length)
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
    };

    const generateBoxSerialno = () => {
      const woTransObj = {};
      woTransObj.woTransID = vm.boxSerialModel.woTransID;
      woTransObj.woID = vm.boxSerialModel.woID;
      woTransObj.employeeID = vm.boxSerialModel.employeeId;
      woTransObj.boxSerialId = vm.boxSerialModel.id;
      woTransObj.woTransSerialNoList = _.map(vm.woSerialNoList, 'SerialNo');
      woTransObj.woNumber = vm.boxSerialModel.woNumber;

      vm.cgBusyLoading = BoxSerialNumbersFactory.generateBoxSerialno().save(woTransObj).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.scanBoxSerialNoForm.$setPristine();
          $rootScope.$broadcast(USER.RefreshBoxSRNoUIGridList);
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
            setFocusByName('scanSerialNumber');
          }
          if (!vm.gridOptions.enablePaging) {
            initPageInfo();
          }
          if (vm.gridOptions) {
            vm.gridOptions.gridApi.grid.clearAllFilters();
          }
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          getBoxSerialDetail();
        }
        $scope.$broadcast('emptySerialSelection');
      }).catch((error) => BaseService.getErrorLog(error));
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
    vm.getSelectedSerialNumberList = () => {
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
      vm.woSerialNoList = [];
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
            //if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
            //  //getPassedSerialNumber(woSerialNoList);
            //}
            ////if selected value is serial# with Qty
            //else if (vm.selectedRangeValue === vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
            //  //getPassedSerialNumber(woSerialNoList);
            //}
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


(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('ManageSalesOrderController', ManageSalesOrderController);

  /** @ngInject */
  function ManageSalesOrderController($state, $mdDialog, $q, $stateParams, $filter, $timeout, TRANSACTION, $scope, CORE, USER, BaseService,
    CustomerFactory, GenericCategoryFactory, SalesOrderFactory, DialogFactory, MasterFactory, WorkorderFactory,
    uiGridGroupingConstants, EmployeeFactory, FOBFactory, ComponentFactory, CustomerPackingSlipFactory, CONFIGURATION, socketConnectionService) {
    const vm = this;
    vm.id = parseInt($stateParams.sID);
    vm.gridConfig = CORE.gridConfig;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.IsEdit = false;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.DateRevisionDisplayFormat = _dateRevisionDisplayFormat;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.poDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.soDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.originalPODate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.poRevisionDate] = false;
    vm.quoteQtyTurnTimeList = [];
    vm.IsemptyState = false;
    vm.updateFlag = false;
    vm.recoredDisabled = false;
    vm.IsValidateQty = true;
    vm.Isvalidateshipdate = true;
    vm.oldStatuspublish = false;
    vm.isOpen = false;
    vm.newStatuspublish = false;
    vm.PartCategory = CORE.PartCategory;
    vm.partTypes = CORE.PartType;
    vm.revisionTodayDate = new Date();
    vm.qtyType = TRANSACTION.QTYTYE;
    vm.salesCommissionFrom = TRANSACTION.SalesCommissionFrom;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.HaltResumePopUp = CORE.HaltResumePopUp;
    vm.haltImagePath = vm.HaltResumePopUp.stopImagePath;
    vm.resumeImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, vm.HaltResumePopUp.resumeFileName);
    vm.OtherPartFrequency = angular.copy(CORE.OtherPartFrequency);
    vm.FrequencyTypeList = angular.copy(CORE.FREQUENCY_TYPE);
    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DATE_COMPARE_VALIDATION);
    vm.messageCompareMessage = stringFormat(messageContent.message, 'PO Revision Date', 'PO Date');
    vm.pomessageCompareMessage = stringFormat('PO Revision Date cannot be greater than Today Date');
    vm.BlanketPOOptions = TRANSACTION.BLANKETPOOPTION;
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.BPOMoreThanPO = stringFormat(messageContent.message, 'Blanket PO Start Date', 'PO Date');
    vm.BPOMoreThanPMDD = stringFormat(messageContent.message, 'Blanket PO Start Date', 'Purchased Material Dock Date');
    vm.BPOEndMoreThanPO = stringFormat(messageContent.message, 'Blanket PO End Date', 'PO Date');
    vm.BPOEndMoreThanPMDD = stringFormat(messageContent.message, 'Blanket PO End Date', 'Purchased Material Dock Date');
    vm.BPOEndMoreThanBPSD = stringFormat(messageContent.message, 'Blanket PO End Date', 'Blanket PO Start Date');
    vm.custPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.custPersonViewActionBtnDet.Delete.isVisible = false;
    vm.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.custShipAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contShipPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.custMarkAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contMarkPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.selectedPreviousCustomer = null;
    vm.salesorder = {
      revision: '00',
      isAddnew: false
    };
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isChanged = false;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_ASSEMBLY;
    vm.isOpenMaterialTentativeDocDate = true;
    vm.todayDate = new Date();
    vm.LabelConstant = CORE.LabelConstant;
    vm.isOtherExpense = true;
    vm.poDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.soDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.rmaOrgPODetailList = [];
    vm.isSkipBlurOnOrgPONumber = true;
    vm.setFocusShippingMethod = false;
    vm.currentSODetIndex = null;
    vm.navDirection = CORE.NAVIGATION_DIRECTION;

    //go to fob
    vm.goToFOBList = () => BaseService.goToFOB();

    const GridOption = TRANSACTION.SALESORDER;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    //Get details of site map crumb
    $timeout(() => {
      vm.crumbs = BaseService.getCrumbs();
    }, _configBreadCrumbTimeout);


    /*
    * Author :  Champak Chaudhary
    * Purpose : Get assembly detail for selected customer
    */
    const getcomponentAssemblyList = (searchObj) => {
      searchObj.customerID = ($scope.ParentNme.isCompany ? null : vm.autoCompleteCustomer.keyColumnId);
      return CustomerPackingSlipFactory.getAssyCompListForCustomerPackingSlipMISC().query(searchObj).$promise.
        then((respAssemblyComp) => {
          if (respAssemblyComp && respAssemblyComp.data) {
            if (searchObj.partID) {
              $timeout(() => {
                if (vm.autocompleteAssy && vm.autocompleteAssy.inputName) {
                  $scope.$broadcast(vm.autocompleteAssy.inputName, respAssemblyComp.data[0]);
                }
              });
            }
            vm.rmaOrgPODetailList = respAssemblyComp.data;
            return respAssemblyComp.data;
          }
          else {
            return [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
    * Author :  Champak Chaudhary
    * Purpose : Get quote group details
    */
    function getrfqQuoteGroupList(id) {
      return SalesOrderFactory.getQuoteGroupDetailsfromPartID().query({ partID: id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId }).$promise.then((response) => {
        if (response && response.data) {
          vm.quoteGroupDetails = response.data;

          /*if (vm.autoCompleteQuoteGroup && vm.salesDetail && vm.salesDetail.refRFQGroupID) {
            //const selectedQuote = _.find(vm.quoteGroupDetails, (item) = item.)

            vm.autoCompleteQuoteGroup.keyColumnId = angular.copy(vm.salesDetail.refRFQGroupID);
          }*/
        }
        if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1 && vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
          vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
        } else if (vm.autoCompleteQuoteGroup && vm.salesDetail && vm.salesDetail.refRFQGroupID) {
          vm.autoCompleteQuoteGroup.keyColumnId = angular.copy(vm.salesDetail.refRFQGroupID);
        }
        return vm.quoteGroupDetails;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function setQtyTurnTimeValue(data) {
      const quoteQtyTurnData = data;
      let unitPrice = null;
      vm.quoteQtyTurnTimeDetails = [];
      if (!vm.salesDetail.qty) {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
      }
      let filterdList = [];
      if (!(vm.salesDetail.qty && vm.salesDetailCopy.qty && parseInt(vm.salesDetail.qty) === parseInt(vm.salesDetailCopy.qty))) {
        vm.salesDetail.refRFQQtyTurnTimeID = null;
      }
      if (vm.salesDetail.refRFQQtyTurnTimeID && quoteQtyTurnData && quoteQtyTurnData.length > 0) {
        filterdList = _.sortBy(_.filter(quoteQtyTurnData, (qtyBreak) => qtyBreak.id === vm.salesDetail.refRFQQtyTurnTimeID), (o) => o.priceBreak);
      } else if (quoteQtyTurnData && quoteQtyTurnData.length > 0 && vm.salesDetail.qty) {
        filterdList = _.sortBy(_.filter(quoteQtyTurnData, (qtyBreak) => qtyBreak.priceBreak <= vm.salesDetail.qty), (o) => o.priceBreak);
      }
      if (quoteQtyTurnData && quoteQtyTurnData.length > 0) {
        if (filterdList && filterdList.length > 0) {
          const matchedPriceBreak = filterdList[filterdList.length - 1].priceBreak;
          filterdList = _.filter(quoteQtyTurnData, (a) => a.priceBreak === matchedPriceBreak);
        } else if (vm.salesDetail.qty) {
          const sortedTurnTimeData = _.sortBy(quoteQtyTurnData, (o) => o.priceBreak);
          filterdList = _.filter(quoteQtyTurnData, (a) => a.priceBreak === sortedTurnTimeData[0].priceBreak);
        }

        vm.quoteQtyTurnTimeDetails = (filterdList && filterdList.length > 0) ? filterdList : [];
        //====
      }
      if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length === 1 && vm.autocompleteQtyTurnTime) {
        vm.autocompleteQtyTurnTime.keyColumnId = vm.quoteQtyTurnTimeDetails[0].id;
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, vm.quoteQtyTurnTimeDetails[0].qtyTurnTime);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', vm.quoteQtyTurnTimeDetails[0].qtyTurnTime);
        unitPrice = vm.quoteQtyTurnTimeDetails[0].unitPrice;
        vm.salesDetail.refRFQQtyTurnTimeID = (!vm.salesDetail.refRFQQtyTurnTimeID) ? vm.quoteQtyTurnTimeDetails[0].id : vm.salesDetail.refRFQQtyTurnTimeID;
      } else if (!vm.salesDetail || !vm.salesDetail.id) {
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, null);
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
      }
      vm.changeQty(null, vm.qtyType.POQTY, unitPrice);
    }

    function getQtyTurnTime() {
      if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        return getrfqQuoteQtyTurnTimeList();
      } else if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
        return vm.getAssemblySalesPriceDetails(vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId);
      }
    }

    /*
    * Author :  Champak Chaudhary
    * Purpose : Get quote qty turn time  details
    */
    function getrfqQuoteQtyTurnTimeList(groupId, partID) {
      const detailObj = { partID: partID || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId, rfqQuoteGroupID: groupId || vm.autoCompleteQuoteGroup.keyColumnId };
      if (detailObj.partID && detailObj.rfqQuoteGroupID) {
        return SalesOrderFactory.getRfqQtyandTurnTimeDetail().query(detailObj).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            vm.quoteQtyTurnTimeList = response.data;
            setQtyTurnTimeValue(response.data);
          }
          if (vm.autocompleteQtyTurnTime && vm.salesDetail && vm.salesDetail.refRFQQtyTurnTimeID) {
            vm.autocompleteQtyTurnTime.keyColumnId = vm.salesDetail.refRFQQtyTurnTimeID;
          }
          return vm.quoteQtyTurnTimeDetails;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return [];
      }
    }

    function getQtyTurnTimeByAssyId(id, lineId) {
      if (id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId) {
        vm.cgBusyLoading = SalesOrderFactory.getQtyandTurnTimeDetailByAssyId().query({
          partID: id || vm.autocompleteAssy.keyColumnId,
          lineId: lineId || null
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            if (response.data.length > 0) {
              vm.quoteQtyTurnTimeDetails = [];
              if (_.first(response.data).quoteValidTillDate && !vm.salesDetail.id && (new Date(_.first(response.data).quoteValidTillDate).setHours(0, 0, 0, 0)) < new Date(BaseService.getCurrentDate()).setHours(0, 0, 0, 0)) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.QUOTE_EXPIRE_VALIDATION);
                messageContent.message = stringFormat(messageContent.message, (response.data.length > 0) ? _.first(response.data).rfqNumber : '', BaseService.getUIFormatedDate(_.first(response.data).quoteValidTillDate, vm.DefaultDateFormat));
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                return DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    commonQuoteConfirmation(response);
                  }
                }, () => {
                  setFocus('qty');
                });
              }
              else {
                commonQuoteConfirmation(response);
              }
            } else {
              commonQuoteConfirmation(response);
            }
          }
          return $q.resolve(response.data);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    // common details
    const commonQuoteConfirmation = (response) => {
      vm.salesDetail.quoteNumber = (response.data.length > 0) ? _.first(response.data).rfqNumber : '';
      vm.quoteQtyTurnTimeList = response.data;
      setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
      //setFocusByName(vm.autocompleteQtyTurnTime.inputName);
      setFocus('fromPartMaster');
      if (vm.autocompleteQtyTurnTime && vm.salesDetail && vm.salesDetail.refRFQQtyTurnTimeID) {
        vm.autocompleteQtyTurnTime.keyColumnId = vm.salesDetail.refRFQQtyTurnTimeID;
      }
      if (!vm.salesDetail.qty) {
        setFocus('qty');
      }
    };

    vm.getSalesStatus = (statusID) => BaseService.getWoStatus(statusID);

    if (!vm.id) {
      vm.salesorder.status = vm.DisplayStatus.Draft.ID;
      if (parseInt(vm.salesorder.status) === 0) {
        vm.label = CORE.OPSTATUSLABLEPUBLISH;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.label = vm.label;
        }
      }
    }
    //get status of sales order
    const getSalesorderstatus = (soid) => SalesOrderFactory.getSalesOrderStatus().query({ id: soid }).$promise.then((salesorder) => {
      if (salesorder && salesorder.data) {
        vm.usedWorkOrderList = salesorder.data.sowoList;
        vm.shippedAssembly = salesorder.data.soShipList;
        if (vm.shippedAssembly && vm.salesFilterDet && vm.salesFilterDet.length > 0 && vm.shippedAssembly.length === vm.salesFilterDet.length) {
          vm.isDisable = true;
        } else { vm.isDisable = false; }
        if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.COMPLETED || vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.CANCELED) {
          vm.isDisable = true;
        } else { vm.isDisable = false; }
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.isDisable = vm.isDisable;
          $scope.$parent.vm.salesOrderWorkStatus = vm.salesOrderWorkStatus;
        }
      }
      return salesorder;
    }).catch((error) => BaseService.getErrorLog(error));

    const getSalesOrderHeaderWorkingStatus = () => {
      vm.cgBusyLoading = SalesOrderFactory.getSalesOrderHeaderWorkingStatus().query({ id: vm.id }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.salesOrderWorkStatus = res.data.SOWorkingStatus[0];
          $scope.$parent.vm.salesOrderWorkStatus = vm.salesOrderWorkStatus;
          if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.INPROGRESS) {
            $scope.$parent.vm.salesOrderWorkStatusText = CORE.SalesOrderDetStatusText.INPROGRESS;
          } else if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.CANCELED) {
            $scope.$parent.vm.salesOrderWorkStatusText = CORE.SalesOrderDetStatusText.CANCELED;
          } else {
            $scope.$parent.vm.salesOrderWorkStatusText = CORE.SalesOrderDetStatusText.COMPLETED;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getSalesOrderHeaderWorkingStatus();
    /* retrieve sales order detail Details*/
    vm.salesOrderDetails = (soid) => {
      vm.cgBusyLoading = SalesOrderFactory.salesorder().query({
        id: soid,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((salesorder) => {
        if (salesorder && salesorder.data) {
          vm.isChanged = false;
          if (vm.frmSalesOrderDetails && vm.frmSalesOrderDetails.$dirty) {
            vm.frmSalesOrderDetails.$dirty = false;
          }
          vm.salesorderCopy = _.clone(salesorder.data);
          if (vm.id) {
            vm.poDateOptions = {
              maxDate: vm.salesorderCopy.soDate,
              appendToBody: true,
              checkoutTimeOpenFlag: false
            };
            vm.soDateOptions = {
              maxDate: vm.todayDate,
              minDate: vm.salesorderCopy.poDate,
              appendToBody: true,
              checkoutTimeOpenFlag: false
            };
            vm.poRevisionDateOptions = {
              minDate: vm.salesorderCopy.poDate,
              maxDate: vm.todayDate,
              appendToBody: true,
              checkoutTimeOpenFlag: false
            };
          }
          if (parseInt(vm.salesorderCopy.status) === 1) {
            vm.label = CORE.OPSTATUSLABLEDRAFT;
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.label = vm.label;
            }
          }
          else if (parseInt(vm.salesorderCopy.status) === 0) {
            vm.label = CORE.OPSTATUSLABLEPUBLISH;
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.label = vm.label;
            }
          }
          else {
            vm.label = '';
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.label = vm.label;
            }
          }
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.sourceData = vm.salesorderCopy.salesOrderDet;
            $scope.$parent.vm.revision = vm.salesorderCopy.revision;
          }
          vm.getSalesStatus(vm.salesorderCopy.status);
          vm.salesorder = _.clone(salesorder.data);
          vm.salesorder.isInitialStockAdded = (vm.salesorder && vm.salesorder.InitialStockMst && vm.salesorder.InitialStockMst.length > 0);
          vm.salesorder.poDate = BaseService.getUIFormatedDate(vm.salesorder.poDate, vm.DefaultDateFormat);
          vm.salesorder.originalPODate = BaseService.getUIFormatedDate(vm.salesorder.originalPODate, vm.DefaultDateFormat);
          vm.salesorder.poRevisionDate = BaseService.getUIFormatedDate(vm.salesorder.poRevisionDate, vm.DefaultDateFormat);
          vm.salesorder.soDate = BaseService.getUIFormatedDate(vm.salesorder.soDate, vm.DefaultDateFormat);
          vm.salesorder.status = parseInt(vm.salesorder.status);
          vm.isChanged = false;
          vm.checkDirtyObject = {
            oldModelName: vm.salesorderCopy,
            newModelName: vm.salesorder
          };
          //vm.salesFilterDet = _.filter(vm.saleDet, { partType: !vm.partTypes.Other });
          if (vm.IsEdit) {
            const autocompletePromise = [getCustomerList(), getShippingList(), getTermsList(), getSalesorderstatus(soid), getFOBList(), getCarrierList(), getSalesOrderDetail()];
            vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
              initAutoComplete();
              if (vm.salesorder.orgSalesOrderID) {
                getCustomerSalesOrderDetail({ custID: vm.salesorder.customerID, currSOId: vm.salesorder.id, searchPO: null, orgSOId: vm.salesorder.orgSalesOrderID });
              } else if (vm.salesorder.orgPONumber) {
                vm.autoCompleteOrgPO.searchText = vm.salesorder.orgPONumber;
                $timeout(() => {
                  if (vm.autoCompleteOrgPO && vm.autoCompleteOrgPO.inputName) {
                    $scope.$broadcast(vm.autoCompleteOrgPO.inputName, vm.salesorder.orgPONumber);
                  }
                });
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            vm.IsEdit = true;
            vm.autoCompleteCustomer.keyColumnId = vm.salesorder.customerID;
            vm.autoCompleteSalesCommosssionTo.keyColumnId = vm.salesorder.salesCommissionTo;
            vm.autoCompleteShipping.keyColumnId = vm.salesorder.shippingMethodID;
            vm.autoCompleteCarriers.keyColumnId = vm.salesorder.carrierID;
            resetSalesOrderDetForm();
          }
          // hold unhold list logic set
          const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
          vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
            vm.holdunHoldList = response[1].data;
            vm.salesOrderDetailByID(response[0]);
          }).catch((error) => BaseService.getErrorLog(error));

          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.salesOrderID = parseInt(soid);
            $scope.$parent.vm.status = vm.salesorder.status;
            $scope.$emit('SalesOrderAutocomplete', { soID: soid });
            getSalesOrderHeaderWorkingStatus();
            vm.checkHeaderDetail();
          }
          vm.promisedShipDateOptions = {
            appendToBody: true,
            minDate: vm.salesorder.poDate
          };
          vm.requestedDockDateOptions = {
            appendToBody: true,
            minDate: vm.salesorder.poDate
          };
          vm.requestedShipDateOptions = {
            appendToBody: true,
            minDate: vm.salesorder.poDate
          };
          vm.blanketPOEndDateOptions = {
            appendToBody: true,
            minDate: vm.salesorder.poDate
          };
          vm.requestedBPOStartDateOptions = {
            appendToBody: true,
            minDate: vm.salesorder.poDate
          };
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // retrieve hold unhold details
    vm.getHoldUnholdDetail = () => SalesOrderFactory.getsalesOrderHoldUnhold().query({ id: vm.id }).$promise.then((salesorderholdUnhold) => salesorderholdUnhold).catch((error) => BaseService.getErrorLog(error));
    /* retrieve sales order detail Details*/
    vm.salesOrderDetailsByID = () => SalesOrderFactory.retrieveSalesOrderDetail().query({ id: vm.id }).$promise.then((salesorder) => salesorder).catch((error) => BaseService.getErrorLog(error));
    vm.salesOrderDetailByID = (salesorder, soDetID, isExpand) => {
      if (salesorder && salesorder.data) {
        vm.selsOrderDatacopy = _.clone(salesorder.data);
        vm.saleDet = [];
        let innerindex = 0;
        _.each(vm.selsOrderDatacopy, (salesdata) => {
          const otherChargeTotal = (_.sumBy(salesdata.salesOrderOtherExpenseDetails, (o) => (o.qty * o.price)) || 0);

          const salesOrderDetStatusConvertedValue = salesdata.isCancle ? CORE.SalesOrderDetStatusText.CANCELED : salesdata.salesOrderDetStatus === CORE.SalesOrderDetStatus.COMPLETED ? CORE.SalesOrderDetStatusText.COMPLETED : CORE.SalesOrderDetStatusText.INPROGRESS;
          let qtyTurnTimeText = '';
          let quoteFromText = vm.salesCommissionFrom.NA.value;
          if (salesdata.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && salesdata.componentAssembly.partType !== CORE.PartType.Other) {
            quoteFromText = vm.salesCommissionFrom.FromRFQ.value;
            qtyTurnTimeText = salesdata.rfqAssyQuantityTurnTime ? stringFormat('({0}) {1} {2}',
              salesdata.rfqAssyQuantityTurnTime.rfqAssyQuantity.requestQty,
              salesdata.rfqAssyQuantityTurnTime.turnTime,
              (salesdata.rfqAssyQuantityTurnTime.unitOfTime === CORE.QUOTE_ATTRIBUTE.BUSINESS_DAY.VALUE
                ? CORE.QUOTE_ATTRIBUTE.BUSINESS_DAY.TYPE
                : (salesdata.rfqAssyQuantityTurnTime.unitOfTime === CORE.QUOTE_ATTRIBUTE.WEEK_DAY.VALUE
                  ? CORE.QUOTE_ATTRIBUTE.WEEK_DAY.TYPE
                  : CORE.QUOTE_ATTRIBUTE.WEEK.TYPE
                ))) : '';
          }
          else if (salesdata.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id && salesdata.componentAssembly.partType !== CORE.PartType.Other) {
            quoteFromText = vm.salesCommissionFrom.FromPartMaster.value;
            qtyTurnTimeText = salesdata.assyQtyTurnTimeText ? stringFormat('({0}) {1} {2}',
              salesdata.ComponentPriceBreakDetails.priceBreak,
              salesdata.ComponentPriceBreakDetails.turnTime,
              (salesdata.ComponentPriceBreakDetails.unitOfTime === CORE.QUOTE_ATTRIBUTE.BUSINESS_DAY.VALUE
                ? CORE.QUOTE_ATTRIBUTE.BUSINESS_DAY.TYPE
                : (salesdata.ComponentPriceBreakDetails.unitOfTime === CORE.QUOTE_ATTRIBUTE.WEEK_DAY.VALUE
                  ? CORE.QUOTE_ATTRIBUTE.WEEK_DAY.TYPE
                  : CORE.QUOTE_ATTRIBUTE.WEEK.TYPE
                ))) : '';
          }

          if (salesdata && salesdata.salesorderdetCommissionAttributeMstDet) {
            _.each(salesdata.salesorderdetCommissionAttributeMstDet, (item) => {
              item.qty = item.poQty;
              item.childSalesCommissionList = item.commissionSalesorderdetCommissionAttribute;
              item.fieldName = item.commissionCalculateFrom === TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.ID ? TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.FIELDNAME : item.commissionCalculateFrom === TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID ? TRANSACTION.SO_COMMISSION_ATTR.RFQ.FIELDNAME : TRANSACTION.SO_COMMISSION_ATTR.MISC.FIELDNAME;
              item.typeName = item.type === TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.ID ? TRANSACTION.SO_COMMISSION_ATTR.PARTMASTER.COMMISSIONCALCULATEDFROM : item.type === TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID ? TRANSACTION.SO_COMMISSION_ATTR.RFQ.COMMISSIONCALCULATEDFROM : TRANSACTION.SO_COMMISSION_ATTR.MISC.COMMISSIONCALCULATEDFROM;
            });
          }
          //const holdUnHold = _.last(_.filter(vm.holdunHoldList, (hdlObj) => hdlObj.refTransid === salesdata.id));
          const holdUnHold = _.findLast(vm.holdunHoldList, (hdlObj) => hdlObj.refTransid === salesdata.id);
          const frequncy = _.find(vm.OtherPartFrequency, (freq) => freq.id === salesdata.frequency);
          const frequencyType = _.find(vm.FrequencyTypeList, (freq) => freq.id === salesdata.frequencyType);
          const selectAssy = _.find(vm.selsOrderDatacopy, (sObj) => sObj.id === salesdata.refSODetID);
          let totalLineShipQty = _.sumBy(_.filter(salesdata.customerPackingSlipDet, (cpd) => cpd.customerPackingSlip && cpd.customerPackingSlip.transType === 'P'), (packingSlip) => parseFloat(packingSlip.shipQty || 0));
          if (salesdata.salesOrderBlanketPODet && salesdata.salesOrderBlanketPODet.length > 0) {
            totalLineShipQty = 0;
            _.each(salesdata.salesOrderBlanketPODet, (soBPO) => {
              totalLineShipQty = totalLineShipQty + _.sumBy(_.filter(soBPO.customerPackingSlipDet, (cpd) => cpd.customerPackingSlip && cpd.customerPackingSlip.transType === 'P'), (packingSlip) => parseFloat(packingSlip.shipQty || 0));
            });
          };
          const obj = {
            partID: salesdata.partID,
            PIDCode: salesdata.partID ? salesdata.componentAssembly.PIDCode : null,
            salesAssy: selectAssy ? stringFormat('{0} | {1}', selectAssy.partID ? selectAssy.componentAssembly.PIDCode : null, selectAssy.custPOLineNumber) : null,
            nickName: salesdata.partID ? salesdata.componentAssembly.nickName : null,
            description: salesdata.partID ? salesdata.componentAssembly.mfgPNDescription : null,
            mfgPN: salesdata.partID ? salesdata.componentAssembly.mfgPN : null,
            isCustom: salesdata.partID ? salesdata.componentAssembly.isCustom : null,
            copyrohsIcon: salesdata.componentAssembly.rfq_rohsmst.rohsIcon,
            rohsIcon: stringFormat('{0}{1}', vm.rohsImagePath, salesdata.componentAssembly.rfq_rohsmst.rohsIcon),
            rohsText: salesdata.componentAssembly.rfq_rohsmst.name,
            unitName: salesdata.UOMs ? salesdata.UOMs.unitName : null,
            uom: salesdata.uom,
            extPrice: (salesdata.qty * salesdata.price),
            totalextPrice: (salesdata.qty * salesdata.price) + otherChargeTotal,
            lineID: salesdata.lineID,
            tentativeBuild: salesdata.tentativeBuild,
            isadd: false,
            remove: false,
            id: salesdata.id,
            price: salesdata.price ? parseFloat(salesdata.price).toFixed(5) : 0,
            mrpQty: salesdata.mrpQty,
            kitQty: salesdata.kitQty,
            SalesDetail: [],
            SalesOtherDetail: salesdata.salesOrderOtherExpenseDetails || [],
            shippingQty: salesdata.shippingQty,
            materialTentitiveDocDate: salesdata.materialTentitiveDocDate ? BaseService.getUIFormatedDate(salesdata.materialTentitiveDocDate, vm.DefaultDateFormat) : null,
            prcNumberofWeek: salesdata.prcNumberofWeek,
            isHotJob: salesdata.isHotJob,
            isHotJobValue: salesdata.isHotJob ? 'Yes' : 'No',
            materialDueDate: salesdata.materialDueDate ? BaseService.getUIFormatedDate(salesdata.materialDueDate, vm.DefaultDateFormat) : null,
            remark: salesdata.remark,
            internalComment: salesdata.internalComment,
            qty: salesdata.qty,
            otherCharges: otherChargeTotal.toFixed(2),
            cancleReason: salesdata.cancleReason,
            kitNumber: salesdata.kitNumber,
            isCancle: salesdata.isCancle,
            isdisable: false,
            salesCommissionTo: salesdata.salesCommissionTo,
            salesCommissionName: salesdata.employees && salesdata.employees.fullName ? salesdata.employees.fullName : '',
            refRFQGroupID: salesdata.refRFQGroupID,
            //refRFQQtyTurnTimeID: salesdata.refRFQQtyTurnTimeID,
            refRFQQtyTurnTimeID: (salesdata.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) ? salesdata.refRFQQtyTurnTimeID : salesdata.refAssyQtyTurnTimeID,
            workOrders: _.map(salesdata.SalesOrderDetails, 'WoSalesOrderDetails.woNumber').join(),
            SalesOrderDetails: salesdata.SalesOrderDetails,
            quoteFromText: quoteFromText,
            qtyTurnTime: qtyTurnTimeText,
            custPOLineNumber: salesdata.custPOLineNumber,
            partCategory: salesdata.partCategory,
            frequency: salesdata.frequency,
            frequencyType: salesdata.frequencyType,
            refSODetID: salesdata.refSODetID,
            refSOReleaseLineID: salesdata.refSOReleaseLineID,
            frequencyName: frequncy ? frequncy.name : '',
            frequencyTypeName: frequencyType ? frequencyType.type : '',
            salesOrderDetStatus: salesdata.salesOrderDetStatus,
            salesOrderDetStatusConvertedValue: salesOrderDetStatusConvertedValue,
            completeStatusReason: salesdata.completeStatusReason,
            isSkipKitCreationOld: salesdata.isSkipKitCreation,
            isSkipKitCreation: salesdata.isSkipKitCreation,
            partDescription: salesdata.partDescription,
            quoteNumber: salesdata.quoteNumber,
            quoteFrom: salesdata.quoteFrom,
            assyQtyTurnTimeText: salesdata.assyQtyTurnTimeText,
            mfrName: salesdata.componentAssembly.mfgCodemst.mfgCodeName,
            mfrID: salesdata.componentAssembly.mfgCodemst.id,
            partType: salesdata.componentAssembly.partType,
            salesCommissionList: salesdata.salesorderdetCommissionAttributeMstDet,
            modifyDate: salesdata.updatedAt,
            soModifiedBy: salesdata.updatedbyValue,
            updatedbyRole: salesdata.updatedbyRole,
            createdDate: salesdata.createdAtValue,
            soCreatedBy: salesdata.createdBy,
            createdbyRole: salesdata.createdbyRole,
            isCustomerConsign: salesdata.isCustomerConsign,
            isDisabledDelete: vm.isDisable || salesdata.isCancle,
            reasonPO: holdUnHold ? holdUnHold.reasonPO : null,
            haltStatusPO: (holdUnHold && holdUnHold.status === vm.HaltResumePopUp.HaltStatus) ? vm.HaltResumePopUp.HaltStatus : null,
            salesOrderHaltImage: (!holdUnHold || (holdUnHold && holdUnHold.status !== vm.HaltResumePopUp.HaltStatus)) ? vm.haltImagePath : vm.resumeImagePath,
            salesOrderHalt: (!holdUnHold || (holdUnHold && holdUnHold.status !== vm.HaltResumePopUp.HaltStatus)) ? vm.HaltResumePopUp.HaltSalesOrder : vm.HaltResumePopUp.ResumeSalesOrder,
            originalPOQty: salesdata.originalPOQty,
            refSalesOrderID: vm.id,
            refBlanketPOID: salesdata.refBlanketPOID,
            refBlanketPONumber: salesdata.salesOrderBlanketPO && salesdata.salesOrderBlanketPO.salesOrderMst ? salesdata.salesOrderBlanketPO.salesOrderMst.poNumber : null,
            refBlanketSONumber: salesdata.salesOrderBlanketPO && salesdata.salesOrderBlanketPO.salesOrderMst ? salesdata.salesOrderBlanketPO.salesOrderMst.salesOrderNumber : null,
            refBlanketPOSOID: salesdata.salesOrderBlanketPO && salesdata.salesOrderBlanketPO.salesOrderMst ? salesdata.salesOrderBlanketPO.salesOrderMst.id : null,
            InitialStock: salesdata.InitialStock,
            releaseLevelComment: salesdata.releaseLevelComment,
            custOrgPOLineNumber: salesdata.custOrgPOLineNumber,
            isAlreadyConfirmQty: true,
            requestedBPOStartDate: salesdata.requestedBPOStartDate ? BaseService.getUIFormatedDate(salesdata.requestedBPOStartDate, vm.DefaultDateFormat) : null,
            blanketPOEndDate: salesdata.blanketPOEndDate ? BaseService.getUIFormatedDate(salesdata.blanketPOEndDate, vm.DefaultDateFormat) : null,
            isBlanketPOMapped: salesdata.salesOrderBlanketPODet && salesdata.salesOrderBlanketPODet.length
          };
          _.each(salesdata.salesShippingDet, (sales) => {
            let totalShipQty = _.sumBy(_.filter(sales.customerPackingSlipDet, (cpd) => cpd.customerPackingSlip && cpd.customerPackingSlip.transType === 'P'), (packingSlip) => parseFloat(packingSlip.shipQty || 0));
            if (salesdata.salesOrderBlanketPODet && salesdata.salesOrderBlanketPODet.length > 0) {
              totalShipQty = 0;
              _.each(salesdata.salesOrderBlanketPODet, (soBPO) => {
                _.each(soBPO.customerPackingSlipDet, (custDet) => {
                  if (custDet.shippingId === sales.refShippingLineID && custDet.customerPackingSlip && custDet.customerPackingSlip.transType === 'P') {
                    totalShipQty = totalShipQty + parseInt(custDet.shipQty || 0);
                  }
                });
              });
            };
            const detailObj = {
              description: sales.description,
              promisedShipDate: BaseService.getUIFormatedDate(sales.promisedShipDate, vm.DefaultDateFormat),
              shippingDate: BaseService.getUIFormatedDate(sales.shippingDate, vm.DefaultDateFormat),
              carrierID: sales.carrierID,
              carrierName: sales.carrierSalesOrder && sales.carrierSalesOrder.gencCategoryName ? stringFormat('({0}) {1}', sales.carrierSalesOrder.gencCategoryCode, sales.carrierSalesOrder.gencCategoryName) : '',
              carrierAccountNumber: sales.carrierAccountNumber,
              customerReleaseLine: sales.customerReleaseLine,
              requestedDockDate: BaseService.getUIFormatedDate(sales.requestedDockDate, vm.DefaultDateFormat),
              qty: sales.qty,
              shippedQty: totalShipQty,
              openQty: sales.qty - totalShipQty > 0 ? sales.qty - totalShipQty : 0,
              shipping_index: innerindex,
              gencCategoryCode: sales.shippingMethodSalesOrder ? stringFormat('({0}) {1}', sales.shippingMethodSalesOrder.gencCategoryCode, sales.shippingMethodSalesOrder.gencCategoryName) : null,
              FullAddress: sales.customerSalesShippingAddress ? stringFormat('{0},{1},{2},{3}-{4}', sales.customerSalesShippingAddress.street1, sales.customerSalesShippingAddress.city, sales.customerSalesShippingAddress.state, sales.customerSalesShippingAddress.countryMst.countryName, sales.customerSalesShippingAddress.postcode) : null,
              releaseNotes: sales.releaseNotes,
              shippingID: sales.shippingID,
              isadd: false,
              remove: false,
              isdisable: false,
              parent: obj,
              isCancle: obj.isCancle,
              releaseNumber: sales.releaseNumber ? sales.releaseNumber : innerindex + 1,
              modifyDate: sales.updatedAt,
              soModifiedBy: sales.updatedbyValue,
              updatedbyRole: sales.updatedbyRole,
              createdDate: sales.createdAtValue,
              soCreatedBy: sales.createdBy,
              createdbyRole: sales.createdbyRole,
              revisedRequestedDockDate: BaseService.getUIFormatedDate(sales.revisedRequestedDockDate, vm.DefaultDateFormat),
              revisedRequestedShipDate: BaseService.getUIFormatedDate(sales.revisedRequestedShipDate, vm.DefaultDateFormat),
              revisedRequestedPromisedDate: BaseService.getUIFormatedDate(sales.revisedRequestedPromisedDate, vm.DefaultDateFormat),
              isAgreeToShip: sales.isAgreeToShip,
              poReleaseNumber: sales.poReleaseNumber,
              refShippingLineID: sales.refShippingLineID
            };
            obj.SalesDetail.push(detailObj);
            innerindex = innerindex + 1;
          });
          if (obj.partType === vm.partTypes.Other) {
            obj.shippedQty = totalLineShipQty;
            obj.openQty = obj.qty - totalLineShipQty > 0 ? obj.qty - totalLineShipQty : 0;
          } else {
            obj.shippedQty = _.sumBy(obj.SalesDetail, (o) => o.shippedQty);
            obj.openQty = obj.qty - obj.shippedQty > 0 ? obj.qty - obj.shippedQty : 0;
          }
          if (selectAssy) {
            const salesRelease = _.find(selectAssy.salesShippingDet, (sObj) => sObj.shippingID === salesdata.refSOReleaseLineID);
            if (salesRelease) {
              obj.salesRelease = stringFormat('{0} | {1} | {2}', salesRelease.releaseNumber, salesRelease.qty, $filter('date')(salesRelease.requestedDockDate || salesRelease.shippingDate, vm.DefaultDateFormat));
            }
          }
          vm.saleDet.push(obj);
          if (salesdata.SalesOrderDetails.length > 0) {
            vm.isStatusUsed = true;
          }
        });
        vm.salesOrderDetail = _.clone(salesorder.data);
        vm.salesFilterDet = angular.copy(_.filter(vm.saleDet, (sDet) => sDet.partType !== vm.partTypes.Other));
        vm.salesOtherFilterDet = angular.copy(_.filter(vm.saleDet, (sDet) => sDet.partType === vm.partTypes.Other));
        _.each(vm.salesFilterDet, (soDet) => {
          soDet.assyIDPID = stringFormat('{0} | {1} | {2}', soDet.custPOLineNumber, soDet.PIDCode, soDet.mfgPN);
        });
        if (!vm.IsEdit) {
          vm.IsEdit = true;
          // resetSalesOrderDetForm();
        }
        if (vm.shippedAssembly && vm.salesOrderDetail.length > 0 && vm.shippedAssembly.length === vm.salesOrderDetail.length) {
          vm.isDisable = true;
        }
        if (!vm.loadData) {
          grid();
        } else {
          vm.sourceData = _.clone(_.orderBy(vm.saleDet, ['lineID'], ['ASC']));
          vm.getSalesOrderPriceDetails();
          $timeout(() => {
            vm.totalSourceDataCount = vm.sourceData.length;
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.data = vm.sourceData;
            vm.gridOptions.totalItems = vm.sourceData.length;
            vm.gridOptions.currentItem = vm.sourceData.length;
            initPageInfo();
            //resetSalesOrderDetForm();
          }, true);
        }
        if (soDetID && vm.salesorder.blanketPOOption !== vm.BlanketPODetails.LINKBLANKETPO) {
          const objShip = _.find(vm.sourceData, (sData) => sData.id === soDetID);
          if (objShip && !isExpand) {
            vm.openReleaseLinePopup(objShip);
          } else if (objShip && isExpand) {
            if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              const colindex = vm.sourceData.indexOf(objShip);
              $timeout(() => {
                vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[colindex]);
              }, 1000);
            }
          }
        }
        //if (popUpType === 'OTHERCHARGE' && vm.currentSODetIndex) {
        //  const obj = vm.sourceData[vm.currentSODetIndex];
        //  console.log(obj);
        //  vm.EditSalesMasterDetail(obj, true);
        //}
      }
    };
    vm.getSoStatus = (statusID) => BaseService.getOpStatus(statusID);
    // update sales order status details
    const updateSalesOrderStatusLabel = (statusID) => {
      vm.salesorder.status = statusID;
      if (vm.salesorder.status === 0 || vm.salesorder.status === '0') {
        vm.isDisable = false;
        vm.label = CORE.OPSTATUSLABLEPUBLISH;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.label = vm.label;
        }
      }
      else if (vm.salesorder.status === 1 || vm.salesorder.status === '1') {
        //vm.isDisable = true;
        vm.label = CORE.OPSTATUSLABLEDRAFT;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.label = vm.label;
        }
      }
      else {
        vm.label = '';
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.label = vm.label;
        }
      }
    };

    //On change sales order status
    vm.changeSalesStatus = (statusID, oldStatusID, event) => {
      if (parseInt(oldStatusID) && !parseInt(statusID)) {
        vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ soId: vm.id }).$promise.then((salesorder) => {
          if (salesorder && salesorder.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (salesorder.data && salesorder.data.soReleaseStatus && salesorder.data.soReleaseStatus[0].transCnt > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_UPDATE_RESTRICTED_AFTER_PACKINGSLIP);
              messageContent.message = stringFormat(messageContent.message, vm.salesorder.salesOrderNumber, 'SO status');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (salesorder && salesorder.data && salesorder.data.soBlanketPOStatus && salesorder.data.soBlanketPOStatus.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_UPDATE_RESTRICTED_AFTER_BLANKETPO);
              messageContent.message = stringFormat(messageContent.message, vm.salesorder.salesOrderNumber);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              changeSalesOrderStatus(statusID, oldStatusID, event);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        changeSalesOrderStatus(statusID, oldStatusID, event);
      }
    };

    // sales order status update
    const changeSalesOrderStatus = (statusID, oldStatusID, event) => {
      vm.isfalse = false;
      vm.checkValidation(true);
      if (parseInt(statusID) !== parseInt(oldStatusID) && !vm.ischeckValidation) {
        if (vm.frmSalesOrderDetails.$invalid || vm.isfalse) {
          const obj = {
            multiple: true,
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_STATUS_CHANGE)
          };
          DialogFactory.messageAlertDialog(obj);
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_STATUS_CHANGE);
          messageContent.message = stringFormat(messageContent.message, vm.getSoStatus(oldStatusID), vm.getSoStatus(statusID));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.isChanged = true;
              vm.oldStatuspublish = false;
              // && vm.salesorder.isAddnew
              // Call when sales order Draft To Publish mode
              if (parseInt(oldStatusID) === 0 && parseInt(statusID) === 1) {
                checkSalesOrderPublishValidation(event, statusID);
              }
              else {
                // Call when sales order Publish To Draft mode
                updateSalesOrderStatusLabel(statusID);
                vm.saveSalesOrder();
              }
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };
    const checkSalesOrderPublishValidation = (event, statusID, isAlreadyPublish) => {
      vm.oldStatuspublish = true;
      const dataArray = _.map(vm.sourceData, _.iteratee('partID'));
      const bomPromise = [validateAssemblyByAssyID(dataArray)];
      if (vm.salesorder.isRmaPO !== vm.salesorderCopy.isRmaPO ||
        vm.salesorder.isLegacyPO !== vm.salesorderCopy.isLegacyPO ||
        vm.salesorder.rmaNumber !== vm.salesorderCopy.rmaNumber ||
        vm.salesorder.isDebitedByCustomer !== vm.salesorderCopy.isDebitedByCustomer ||
        vm.salesorder.orgPONumber !== vm.salesorderCopy.orgPONumber ||
        vm.salesorder.isReworkRequired !== vm.salesorderCopy.isReworkRequired ||
        vm.salesorder.reworkPONumber !== vm.salesorderCopy.reworkPONumber) {
        bomPromise.push(checkSalesOrderFutherTransaction());
      }
      vm.cgBusyLoading = $q.all(bomPromise).then((resData) => {
        const validResp = _.first(resData);
        // resData = _.first(resData);
        if (resData && resData.length > 1 && !resData[1]) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_UPDATE_RESTRICTED_AFTER_PACKINGSLIP);
          if (vm.salesorder.isLegacyPO !== vm.salesorderCopy.isLegacyPO) {
            messageContent.message = stringFormat(messageContent.message, vm.salesorder.salesOrderNumber, 'Legacy PO');
          } else {
            messageContent.message = stringFormat(messageContent.message, vm.salesorder.salesOrderNumber, 'RMA Details');
          }
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            if (vm.salesorder.isRmaPO !== vm.salesorderCopy.isRmaPO) {
              vm.salesorder.isRmaPO = vm.salesorderCopy.isRmaPO;
              setFocus('isRmaPO');
            }
            if (vm.salesorder.isLegacyPO !== vm.salesorderCopy.isLegacyPO) {
              vm.salesorder.isLegacyPO = vm.salesorderCopy.isLegacyPO;
              setFocus('isLegacyPO');
            }
            if (vm.salesorder.rmaNumber !== vm.salesorderCopy.rmaNumber) {
              vm.salesorder.rmaNumber = vm.salesorderCopy.rmaNumber;
              setFocus('rmaNumber');
            }
            if (vm.salesorder.isDebitedByCustomer !== vm.salesorderCopy.isDebitedByCustomer) {
              vm.salesorder.isDebitedByCustomer = vm.salesorderCopy.isDebitedByCustomer;
              setFocus('isDebitedByCustomer');
            }
            if (vm.salesorder.orgPONumber !== vm.salesorderCopy.orgPONumber) {
              vm.salesorder.poNumber = vm.salesorderCopy.orgPONumber;
              vm.autoCompleteOrgPO.keyColumnId = vm.salesorderCopy.orgSalesOrderID;
              $scope.$broadcast(vm.autoCompleteOrgPO.inputName + 'searchText', vm.salesorderCopy.orgPONumber);
              vm.salesorder.orgPONumber = vm.salesorderCopy.orgPONumber;
              vm.salesorder.orgSalesOrderID = vm.salesorderCopy.orgSalesOrderID;
              setFocusByName(vm.autoCompleteOrgPO.inputName);
            }
            if (vm.salesorder.isReworkRequired !== vm.salesorderCopy.isReworkRequired) {
              vm.salesorder.isReworkRequired = vm.salesorderCopy.isReworkRequired;
              setFocus('isReworkRequired');
            }
            if (vm.salesorder.reworkPONumber !== vm.salesorderCopy.reworkPONumber) {
              vm.salesorder.reworkPONumber = vm.salesorderCopy.reworkPONumber;
              setFocus('reworkPONumber');
            }
          }).catch((error) => BaseService.getErrorLog(error));
          return;
        } else if (validResp.errorObjList && validResp.errorObjList.length > 0) {
          const errorMessage = _.map(validResp.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
          if (errorMessage) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_STATUS_CHANGE);
            messageContent.message = errorMessage;
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj);
            return;
          }
          const errorMsg = _.find(validResp.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
          if (errorMsg) {
            const assyInvalidShippingList = [];
            _.each(validResp.exportControlPartList, (partItem) => {
              let objAssy = {};
              objAssy = _.assign(partItem);
              const assyDets = _.find(vm.sourceData, (soDet) => soDet.partID === partItem.partID);
              if (assyDets) {
                objAssy.PIDCode = assyDets.PIDCode;
                objAssy.partID = assyDets.partID;
                objAssy.rohsIcon = assyDets.rohsIcon;
                objAssy.rohsText = assyDets.rohsText;
                objAssy.mfgPN = assyDets.mfgPN;
                objAssy.nickName = assyDets.nickName;
                objAssy.description = assyDets.description;
                objAssy.isCustom = assyDets.isCustom;
              }
              assyInvalidShippingList.push(objAssy);
            });
            if (assyInvalidShippingList.length > 0) {
              vm.salesorder.status = vm.id ? angular.copy(vm.salesorderCopy.status) : vm.salesorder.status;
              const data = {
                assyList: assyInvalidShippingList,
                salesOrderNumber: vm.salesorder.salesOrderNumber,
                revision: vm.salesorder.revision,
                errorMessage: errorMsg.errorText,
                countryName: vm.intermediateAddress && vm.intermediateAddress.countryMst ? vm.intermediateAddress.countryMst.countryName : vm.shippingAddress.countryMst.countryName
              };
              DialogFactory.dialogService(
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                event,
                data).then(() => {
                }, () => {
                }, (err) => BaseService.getErrorLog(err));
            }
          }
        } else {
          const nonBOMList = _.differenceBy(vm.sourceData, validResp.salesOrderPartList, 'partID');
          const assynonBOMList = [];
          _.each(nonBOMList, (bomItem) => {
            if (bomItem.partCategory === vm.PartCategory.SubAssembly) {
              const objAssy = {};
              objAssy.PIDCode = bomItem.PIDCode;
              objAssy.partID = bomItem.partID;
              objAssy.rohsIcon = bomItem.rohsIcon;
              objAssy.rohsText = bomItem.rohsText;
              objAssy.mfgPN = bomItem.mfgPN;
              objAssy.nickName = bomItem.nickName;
              objAssy.description = bomItem.description;
              objAssy.isCustom = bomItem.isCustom;
              assynonBOMList.push(objAssy);
            }
          });
          if (assynonBOMList.length > 0) {
            vm.salesorder.status = vm.id ? angular.copy(vm.salesorderCopy.status) : vm.salesorder.status;
            const data = {
              assyList: assynonBOMList,
              assyBOMValidation: true,
              salesOrderNumber: vm.salesorder.salesOrderNumber,
              revision: vm.salesorder.revision
            };
            DialogFactory.dialogService(
              CORE.VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_CONTROLLER,
              CORE.VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_VIEW,
              event,
              data).then(() => {
              }, () => {
              }, (err) => BaseService.getErrorLog(err));
          } else {
            let copySourceData = _.filter(vm.sourceData, (assy) => assy.partCategory === vm.PartCategory.SubAssembly && !assy.isSkipKitCreation);
            if (isAlreadyPublish) {
              copySourceData = _.filter(copySourceData, (copyAssy) => !copyAssy.id);
            }
            const assyList = _.map(copySourceData, (data) => ({
              id: data.id || null,
              partID: data.partID
            }));
            vm.cgBusyLoading = SalesOrderFactory.getKitPlannedDetailOfSaleOrderAssy().save({ assyList: assyList }).$promise.then((responseData) => {
              if (responseData && responseData.data) {
                //const copySourceData = _.clone(vm.sourceData);
                _.map(responseData.data, (data) => {
                  _.remove(copySourceData, (item) => {
                    if (item.partID === data.refAssyId) {
                      return item;
                    }
                  });
                });

                if (copySourceData && copySourceData.length > 0) {
                  const PIDString = _.map(_.uniqBy(copySourceData, 'partID'), 'PIDCode').join(',');
                  if (PIDString) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PLANN_NOT_CREATED);
                    messageContent.message = stringFormat(messageContent.message, PIDString);
                    const obj = {
                      messageContent: messageContent,
                      btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                      canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    DialogFactory.messageConfirmDialog(obj).then((yes) => {
                      if (yes) {
                        updateSalesOrderStatusLabel(statusID);
                        vm.saveSalesOrder();
                      }
                    }, () => {
                      vm.oldStatuspublish = false;
                      vm.isChanged = false;
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                } else {
                  updateSalesOrderStatusLabel(statusID);
                  vm.saveSalesOrder();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      });
    };

    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer detail
    */
    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      // Added by Vaibhav - For display company name with customer code
      if (customer && customer.data) {
        _.each(customer.data, (item) => {
          item.mfgactualName = item.mfgName;
          item.mfgName = angular.copy(item.mfgCodeName);
        });
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));


    /*
    * Author :  Champak Chaudhary
    * Purpose : Get customer detail
    */
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingTypeList = shipping.data;
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
 * Author :  Champak Chaudhary
 * Purpose : Get carrier detail
 */
    const getCarrierList = () => {
      const GencCategoryType = [CategoryTypeObjList.Carriers.Name];
      // GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierList = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.carrierList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*
   * Author :  Champak Chaudhary
   * Purpose : Get Terms detail
   */
    const getTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get list of FOB
    const getFOBList = () => FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
      if (fob && fob.data) {
        vm.FOBList = fob.data;
        return $q.resolve(vm.FOBList);
      }
    }).catch((error) => {
      BaseService.getErrorLog(error);
    });

    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer contact person detail
     */
    const getCustomerContactPersonList = () => CustomerFactory.getCustomerContactPersons().query({
      refTransID: $scope.ParentNme.id,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.ContactPersonList = contactperson.data;
        if (vm.id && vm.salesorder.billingContactPersonID) {
          const selectedContPersonDet = _.find(vm.ContactPersonList, (contItem) => contItem.personId === vm.salesorder.billingContactPersonID);
          if (selectedContPersonDet) {
            vm.selectedContactPerson = selectedContPersonDet;
            if (vm.viewCustAddrOtherDet) {
              vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
            }
          }
        }
        if (vm.id && vm.salesorder.shippingContactPersonID) {
          const selectedShipContPersonDet = _.find(vm.ContactPersonList, (contItem) => contItem.personId === vm.salesorder.shippingContactPersonID);
          if (selectedShipContPersonDet) {
            vm.selectedShipContactPerson = selectedShipContPersonDet;
            if (vm.viewShipCustAddrOtherDet) {
              vm.viewShipCustAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
            }
          }
        }
        if (vm.id && vm.salesorder.intermediateContactPersonID) {
          const selectedMarkContPersonDet = _.find(vm.ContactPersonList, (contItem) => contItem.personId === vm.salesorder.intermediateContactPersonID);
          if (selectedMarkContPersonDet) {
            vm.selectedMarkContactPerson = selectedMarkContPersonDet;
            if (vm.viewMarkCustAddrOtherDet) {
              vm.viewMarkCustAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkContactPerson.personId;
            }
          }
        }
        vm.contPersonViewActionBtnDet.Update.isDisable = vm.contPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.selectedContactPerson) ? false : true;
        vm.contShipPersonViewActionBtnDet.Update.isDisable = vm.contShipPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.selectedShipContactPerson) ? false : true;
        vm.contMarkPersonViewActionBtnDet.Update.isDisable = (!vm.isDisable && vm.selectedMarkContactPerson) ? false : true;
        vm.contPersonViewActionBtnDet.ApplyNew.isDisable = vm.contShipPersonViewActionBtnDet.ApplyNew.isDisable = vm.contMarkPersonViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
        vm.contMarkPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.selectedMarkContactPerson) ? false : true;
        customerContactPersonDetail(vm.salesorder.contactPersonID);
        return $q.resolve(vm.ContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const customerContactPersonDetail = (id) => {
      if (id) {
        vm.contactpersondetail = _.find(vm.ContactPersonList, (item) => item.personId === id);
        vm.contactPersonID = vm.contactpersondetail ? vm.contactpersondetail.personId : null;
      }
      else {
        const defaultContPerosn = _.find(vm.ContactPersonList, (contPerson) => contPerson.isDefault);
        vm.contactpersondetail = defaultContPerosn ? defaultContPerosn : vm.ContactPersonList[0];
      }
      if (vm.custPersonViewActionBtnDet) {
        vm.custPersonViewActionBtnDet.Update.isDisable = (!vm.isDisable && vm.contactpersondetail) ? false : true;
        vm.custPersonViewActionBtnDet.AddNew.isDisable = vm.custPersonViewActionBtnDet.ApplyNew.isDisable = (vm.isDisable) ? true : false;
      }
    };
    const billingAddressDetail = (id) => {
      if (id) {
        vm.billingAddress = _.find(vm.billingAddressList, (item) => item.id === id);
        if (!vm.billingAddress) {
          const billingaddress = _.find(vm.billingAddressList, (item) => item.isDefault);
          vm.billingAddress = billingaddress ? billingaddress : vm.billingAddressList[0];
        }
      } else if (!vm.salesorder.id) {
        const billingaddress = _.find(vm.billingAddressList, (item) => item.isDefault);
        vm.billingAddress = billingaddress ? billingaddress : vm.billingAddressList[0];
      }
    };

    const shippingAddressDetail = (id) => {
      if (id) {
        vm.shippingAddress = _.find(vm.ShippingAddressList, (item) => item.id === id);
        if (!vm.shippingAddress) {
          const shipplingaddress = _.find(vm.ShippingAddressList, (item) => item.isDefault);
          vm.shippingAddress = shipplingaddress ? shipplingaddress : vm.ShippingAddressList[0];
        }
      } else if (!vm.salesorder.id) {
        const shipplingaddress = _.find(vm.ShippingAddressList, (item) => item.isDefault);
        vm.shippingAddress = shipplingaddress ? shipplingaddress : vm.ShippingAddressList[0];
      }
    };

    const IntermediateAddressDetail = (id) => {
      if (id) {
        vm.intermediateAddress = _.find(vm.intermediateAddressList, (item) => item.id === id);
        if (!vm.intermediateAddress) {
          vm.intermediateAddress = null;
        }
      }
      else {
        vm.intermediateAddress = null;
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer address
     */
    const getCustomerAddress = (id) => CustomerFactory.customerAddressList().query({
      customerId: id || vm.autoCompleteCustomer.keyColumnId,
      addressType: [CORE.AddressType.ShippingAddress, CORE.AddressType.BillingAddress, CORE.AddressType.IntermediateAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((customeraddress) => {
      vm.billingAddressList = _.filter(customeraddress.data, (item) => item.addressType === 'B');
      vm.ShippingAddressList = _.filter(customeraddress.data, (item) => item.addressType === 'S');
      vm.intermediateAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.IntermediateAddress);
      if (!vm.id) {
        // bill to address
        const defaultBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.isDefault);
        if (defaultBillToAddrDet) {
          setBillToAddrContDetForApplied(defaultBillToAddrDet);
        }
        // ship to address
        const defaultShipToAddrDet = _.find(vm.ShippingAddressList, (addrItem) => addrItem.isDefault);
        if (defaultShipToAddrDet) {
          setShipToAddrContDetForApplied(defaultShipToAddrDet);
          // mark for address
          if (vm.shippingAddress.defaultIntermediateAddressID) {
            const defaultMarkForAddrDet = _.find(vm.intermediateAddressList, (addrItem) => addrItem.id === vm.shippingAddress.defaultIntermediateAddressID);
            if (defaultMarkForAddrDet) {
              setMarkToAddrContDetForApplied(defaultMarkForAddrDet, true);
            }
          }
        }
      } else {
        // bill to address
        const selectedBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.id === vm.salesorder.billingAddressID);
        if (selectedBillToAddrDet) {
          vm.billingAddress = selectedBillToAddrDet;
          if (vm.viewCustAddrOtherDet) {
            vm.viewCustAddrOtherDet.alreadySelectedAddressID = selectedBillToAddrDet.id;
          }
        }
        // ship to address
        const selectedShipToAddrDet = _.find(vm.ShippingAddressList, (addrItem) => addrItem.id === vm.salesorder.shippingAddressID);
        if (selectedShipToAddrDet) {
          vm.shippingAddress = selectedShipToAddrDet;
          if (vm.viewShipCustAddrOtherDet) {
            vm.viewShipCustAddrOtherDet.alreadySelectedAddressID = selectedShipToAddrDet.id;
          }
          //if ((vm.salesorderCopy.shippingAddressID !== vm.salesorder.shippingAddressID) && (vm.salesorder.carrierID || vm.salesorder.carrierAccountNumber || vm.salesorder.shippingMethodID) && (vm.shippingAddress.carrierAccount || vm.shippingAddress.carrierID || vm.shippingAddress.shippingMethodID)) {
          //  commoncarrierConfirm();
          //}
        }
        // mark for address
        const selectedMarkToAddrDet = _.find(vm.intermediateAddressList, (addrItem) => addrItem.id === vm.salesorder.intermediateShipmentId);
        if (selectedMarkToAddrDet) {
          vm.intermediateAddress = selectedMarkToAddrDet;
          if (vm.viewMarkCustAddrOtherDet) {
            vm.viewMarkCustAddrOtherDet.alreadySelectedAddressID = selectedMarkToAddrDet.id;
          }
        }
      }
      vm.custAddrViewActionBtnDet.AddNew.isDisable = vm.contPersonViewActionBtnDet.AddNew.isDisable = vm.custShipAddrViewActionBtnDet.AddNew.isDisable = vm.contShipPersonViewActionBtnDet.AddNew.isDisable = vm.custMarkAddrViewActionBtnDet.AddNew.isDisable = vm.contMarkPersonViewActionBtnDet.AddNew.isDisable = vm.isDisable;
      vm.custAddrViewActionBtnDet.ApplyNew.isDisable = vm.custShipAddrViewActionBtnDet.ApplyNew.isDisable = vm.custMarkAddrViewActionBtnDet.ApplyNew.isDisable = (!vm.isDisable) ? false : true;
      vm.custAddrViewActionBtnDet.Update.isDisable = vm.custAddrViewActionBtnDet.Delete.isDisable = (vm.billingAddress && !vm.isDisable) ? false : true;
      vm.custShipAddrViewActionBtnDet.Update.isDisable = vm.custShipAddrViewActionBtnDet.Delete.isDisable = (vm.shippingAddress && !vm.isDisable) ? false : true;
      vm.custMarkAddrViewActionBtnDet.Update.isDisable = vm.custMarkAddrViewActionBtnDet.Delete.isDisable = (vm.intermediateAddress && !vm.isDisable) ? false : true;
      return $q.resolve(vm.billingAddressList);
    }).catch((error) => BaseService.getErrorLog(error));

    const setBillToAddrContDetForApplied = (newApplyAddrDet) => {
      vm.salesorder.billingAddressID = newApplyAddrDet.id;
      if (newApplyAddrDet.contactPerson) {
        vm.salesorder.billingContactPersonID = newApplyAddrDet.contactPerson.personId;
        vm.salesorder.billingContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
        vm.selectedContactPerson = angular.copy(newApplyAddrDet.contactPerson);
        if (vm.viewCustAddrOtherDet) {
          vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
          vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.billingAddressID;
        }
      } else {
        vm.salesorder.billingContactPersonID = null;
        vm.salesorder.billingContactPerson = null;
        vm.selectedContactPerson = null;
        if (vm.viewCustAddrOtherDet) {
          vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.billingAddressID;
        }
      }
      vm.billingAddress = newApplyAddrDet;
      vm.custAddrViewActionBtnDet.Update.isDisable = vm.custAddrViewActionBtnDet.Delete.isDisable = (vm.billingAddress && !vm.isDisable) ? false : true;
      vm.custAddrViewActionBtnDet.ApplyNew.isDisable = vm.custAddrViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
      vm.contPersonViewActionBtnDet.Update.isDisable = vm.contPersonViewActionBtnDet.Delete.isDisable = (vm.selectedContactPerson && !vm.isDisable) ? false : true;
      vm.contPersonViewActionBtnDet.ApplyNew.isDisable = vm.contPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
    };
    // set ship to address
    const setShipToAddrContDetForApplied = (newApplyAddrDet) => {
      vm.salesorder.shippingAddressID = newApplyAddrDet.id;
      if (newApplyAddrDet.contactPerson) {
        vm.salesorder.shippingContactPersonID = newApplyAddrDet.contactPerson.personId;
        vm.salesorder.shippingContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
        vm.selectedShipContactPerson = angular.copy(newApplyAddrDet.contactPerson);
        if (vm.viewShipCustAddrOtherDet) {
          vm.viewShipCustAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
          vm.viewShipCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.shippingAddressID;
        }
      } else {
        vm.salesorder.shippingContactPersonID = null;
        vm.salesorder.shippingContactPerson = null;
        vm.selectedShipContactPerson = null;
        if (vm.viewShipCustAddrOtherDet) {
          vm.viewShipCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.shippingAddressID;
        }
      }
      vm.shippingAddress = newApplyAddrDet;
      if (((vm.id && vm.salesorderCopy.shippingAddressID !== vm.salesorder.shippingAddressID) || (!vm.id)) && (vm.salesorder.carrierID || vm.salesorder.carrierAccountNumber || vm.salesorder.shippingMethodID) && (vm.shippingAddress.carrierAccount || vm.shippingAddress.carrierID || vm.shippingAddress.shippingMethodID)) {
        if ((!vm.id && vm.selectedPreviousCustomer) || (vm.id)) {
          commoncarrierConfirm();
        } else {
          vm.selectedPreviousCustomer = vm.customerCodeName || null;
          vm.salesorder.carrierAccountNumber = vm.shippingAddress.carrierAccount || vm.salesorder.carrierAccountNumber;
          vm.autoCompleteCarriers.keyColumnId = vm.shippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId;
          vm.autoCompleteShipping.keyColumnId = vm.shippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId;
        }
      } else if ((vm.shippingAddress.carrierAccount !== vm.salesorder.carrierAccountNumber) || (vm.shippingAddress.carrierID !== vm.shippingAddress.carrierID) || (vm.shippingAddress.shippingMethodID !== vm.shippingAddress.shippingMethodID)) {
        vm.salesorder.carrierAccountNumber = vm.shippingAddress.carrierAccount || vm.salesorder.carrierAccountNumber;
        vm.autoCompleteCarriers.keyColumnId = vm.shippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId;
        vm.autoCompleteShipping.keyColumnId = vm.shippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId;
      }
      vm.custShipAddrViewActionBtnDet.Update.isDisable = vm.custShipAddrViewActionBtnDet.Delete.isDisable = (vm.shippingAddress && !vm.isDisable) ? false : true;
      vm.custShipAddrViewActionBtnDet.ApplyNew.isDisable = vm.custShipAddrViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
      vm.contShipPersonViewActionBtnDet.Update.isDisable = vm.contShipPersonViewActionBtnDet.Delete.isDisable = (vm.selectedShipContactPerson && !vm.isDisable) ? false : true;
      vm.contShipPersonViewActionBtnDet.ApplyNew.isDisable = vm.contShipPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
    };
    // set mark for to address
    const setMarkToAddrContDetForApplied = (newApplyAddrDet, isApplyFromShipAddr) => {
      vm.salesorder.intermediateShipmentId = newApplyAddrDet.id;
      if (!vm.id && isApplyFromShipAddr) {
        if (vm.shippingAddress.defaultIntermediateContactPersonID) {
          vm.salesorder.intermediateContactPersonID = vm.shippingAddress.defaultIntermediateContactPersonID;
          vm.salesorder.intermediateContactPerson = BaseService.generateContactPersonDetFormat(vm.shippingAddress.defaultIntmdContactPerson);
          vm.selectedMarkContactPerson = angular.copy(vm.shippingAddress.defaultIntmdContactPerson);
          if (vm.viewMarkCustAddrOtherDet) {
            vm.viewMarkCustAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkContactPerson.personId;
            vm.viewMarkCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.intermediateShipmentId;
          }
        } else {
          vm.salesorder.intermediateContactPersonID = null;
          vm.salesorder.intermediateContactPerson = null;
          vm.selectedMarkContactPerson = null;
          if (vm.viewMarkCustAddrOtherDet) {
            vm.viewMarkCustAddrOtherDet.alreadySelectedPersonId = null;
            vm.viewMarkCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.intermediateShipmentId;
          }
        }
      } else {
        if (newApplyAddrDet.contactPerson) {
          vm.salesorder.intermediateContactPersonID = newApplyAddrDet.contactPerson.personId;
          vm.salesorder.intermediateContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
          vm.selectedMarkContactPerson = angular.copy(newApplyAddrDet.contactPerson);
          if (vm.viewMarkCustAddrOtherDet) {
            vm.viewMarkCustAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkContactPerson.personId;
            vm.viewMarkCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.intermediateShipmentId;
          }
        } else {
          vm.salesorder.intermediateContactPersonID = null;
          vm.salesorder.intermediateContactPerson = null;
          vm.selectedMarkContactPerson = null;
          if (vm.viewMarkCustAddrOtherDet) {
            vm.viewMarkCustAddrOtherDet.alreadySelectedPersonId = null;
            vm.viewMarkCustAddrOtherDet.alreadySelectedAddressID = vm.salesorder.intermediateShipmentId;
          }
        }
      }
      vm.intermediateAddress = newApplyAddrDet;
      vm.custMarkAddrViewActionBtnDet.Update.isDisable = vm.custMarkAddrViewActionBtnDet.Delete.isDisable = (vm.intermediateAddress && !vm.isDisable) ? false : true;
      vm.custMarkAddrViewActionBtnDet.ApplyNew.isDisable = vm.custMarkAddrViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
      vm.contMarkPersonViewActionBtnDet.Update.isDisable = vm.contMarkPersonViewActionBtnDet.Delete.isDisable = (vm.selectedMarkContactPerson && !vm.isDisable) ? false : true;
      vm.contMarkPersonViewActionBtnDet.ApplyNew.isDisable = vm.contMarkPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
    };

    // common confirmation detail
    const commoncarrierConfirm = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SHIPPING_ADDR_CONFIRM_ALERT);
      messageContent.message = stringFormat(messageContent.message, 'Sales Order');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isshippingAddressChange = true;
          vm.salesorder.carrierAccountNumber = vm.shippingAddress.carrierAccount || vm.salesorder.carrierAccountNumber;
          vm.autoCompleteCarriers.keyColumnId = vm.shippingAddress.carrierID || vm.autoCompleteCarriers.keyColumnId;
          vm.autoCompleteShipping.keyColumnId = vm.shippingAddress.shippingMethodID || vm.autoCompleteShipping.keyColumnId;
        }
      }, () => {
      });
    };

    const generateSOComment = (id) => {
      CustomerFactory.getCustomerCommentsById().query({ mfgCodeId: id }).$promise.then((res) => {
        if (res.data && res.data.fetchedCustomerComment) {
          vm.salesorder.shippingComment = res.data.fetchedCustomerComment;
        }
        else {
          vm.salesorder.shippingComment = '';
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const getCustomerDetailsByID = (id) => {
      if (!vm.id) {
        vm.autoCompleteShipping.keyColumnId = null;
        vm.autoCompleteCarriers.keyColumnId = null;
        vm.autoCompleteTerm.keyColumnId = null;
        vm.salesorder.shippingComment = '';
        vm.salesorder.carrierAccountNumber = '';
        generateSOComment(id);
        _.each(vm.CustomerList, (item) => {
          if (item && item.id === id) {
            vm.autoCompleteShipping.keyColumnId = item.shippingMethodID;
            vm.autoCompleteCarriers.keyColumnId = item.carrierID;
            vm.autoCompleteTerm.keyColumnId = item.paymentTermsID;
            vm.salesorder.carrierAccountNumber = item.carrierAccount;
          }
        });
        vm.isOpen = false;
      }
    };

    // Get Sales order list for OrignialPO# auto complete
    const getCustomerSalesOrderDetail = (searchObj) => SalesOrderFactory.getCustomerSalesOrderDetail().query(searchObj).$promise.then((res) => {
      if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        if (searchObj.orgSOId && res.data.soList && res.data.soList.length > 0) {
          vm.isSkipBlurOnOrgPONumber = true;
          $timeout(() => {
            if (vm.autoCompleteOrgPO && vm.autoCompleteOrgPO.inputName) {
              $scope.$broadcast(vm.autoCompleteOrgPO.inputName, res.data.soList[0]);
              vm.salesorder.orgPONumber = res.data.soList[0].PONumber;
            }
          });
        }
        if (res.data && res.data.soList && res.data.soList.length === 0) {
          vm.isSkipBlurOnOrgPONumber = false;
        }
        return res.data.soList;
      } else {
        return false;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.setOriginalPOData = (item) => {
      vm.isSkipBlurOnOrgPONumber = true;
      if (item) {
        vm.salesorder.orgPONumber = item.PONumber;
        vm.salesorder.orgSalesOrderID = item.soId;
      } else {
        vm.salesorder.orgPONumber = angular.copy(vm.autoCompleteOrgPO.searchText);
        vm.salesorder.orgSalesOrderID = null;
      }
      if (vm.salesorder.orgPONumber && (vm.salesorder.orgPONumber !== vm.salesorder.poNumber) && !vm.salesorder.reworkPONumber) {
        return $q.all([confirmationForPONumberReplacement(vm.salesorder.poNumber, vm.salesorder.orgPONumber, vm.salesorder.orgSalesOrderID ? true : false)]).then((res) => {
          if (res && res.length > 0 && res[0].replacePO) {
            // set original PO header details
            vm.salesorder.poNumber = vm.salesorder.orgPONumber;
            if (item) {
              vm.autoCompleteShipping.keyColumnId = item.shippingMethodID ? item.shippingMethodID : null;
              vm.autoCompleteCarriers.keyColumnId = item.carrierID ? item.carrierID : null;
              vm.autoCompleteTerm.keyColumnId = item.termsID ? item.termsID : null;
              vm.autoCompleteFOB.keyColumnId = item.freeOnBoardId ? item.freeOnBoardId : null;
              vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo ? item.salesCommissionTo : null;
              vm.salesorder.carrierAccountNumber = item.carrierAccount ? item.carrierAccount : null;
              billingAddressDetail(item.billingAddressID);
              shippingAddressDetail(item.shippingAddressID);
              IntermediateAddressDetail(item.intermediateShipmentId);
              vm.salesorder.internalComment = item.internalComment;
              vm.salesorder.shippingComment = item.shippingComment;
            }
            if ($scope.$parent && $scope.$parent.vm) { $scope.$parent.vm.poNumber = vm.salesorder.poNumber; }

            setFocus('isReworkRequired');
          } else {
            if (vm.autoCompleteOrgPO && vm.autoCompleteOrgPO.inputName) {
              vm.autoCompleteOrgPO.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteOrgPO.inputName + 'searchText', null);
            }
            vm.salesorder.orgPONumber = null;
            setFocusByName(vm.autoCompleteOrgPO.inputName);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    if ($stateParams.sID > 0) {
      vm.IsEdit = true;
      vm.salesOrderDetails($stateParams.sID);
    }
    else {
      vm.salesorder.poDate = new Date();
      vm.salesorder.soDate = new Date();
      vm.poDateOptions = {
        maxDate: vm.salesorder.soDate,
        appendToBody: true,
        checkoutTimeOpenFlag: false
      };
      vm.poRevisionDateOptions = {
        minDate: vm.salesorder.poDate,
        maxDate: vm.todayDate,
        appendToBody: true,
        checkoutTimeOpenFlag: false
      };
      vm.soDateOptions = {
        maxDate: vm.todayDate,
        minDate: vm.salesorder.poDate,
        appendToBody: true,
        checkoutTimeOpenFlag: false
      };
      vm.salesorder.status = 0;
      const autocompletePromise = [getCustomerList(), getShippingList(), getTermsList(), getFOBList(), getCarrierList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const initAutoComplete = () => {
      //let selectedACSOItem = null;
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.salesorder ? (vm.salesorder.customerID ? vm.salesorder.customerID : null) : null,
        inputName: 'Customer',
        placeholderName: 'Customer',
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getcustomerdetail
      };
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.salesorder ? (vm.salesorder.shippingMethodID ? vm.salesorder.shippingMethodID : null) : null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: CategoryTypeObjList.ShippingType.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.setFocusShippingMethod = false;
            if (vm.autoCompleteCarriers && vm.salesorder.id && item.gencCategoryID !== vm.salesorderCopy.shippingMethodID && (vm.salesorder.carrierID !== item.carrierID || vm.autoCompleteCarriers.keyColumnId !== item.carrierID)) {
              if ((vm.salesorder.carrierID && (vm.salesorder.carrierID !== item.carrierID || vm.salesorder.carrierAccountNumber)) && !vm.isshippingAddressChange) {
                commonShippingMethodChangeConfirmation(item);
              } else if (!vm.isshippingAddressChange) {
                vm.autoCompleteCarriers.keyColumnId = item.carrierID;
              }
            } else if (!vm.salesorder.id) {
              vm.autoCompleteCarriers.keyColumnId = item.carrierID;
            }
            if (vm.isshippingAddressChange) {
              vm.isshippingAddressChange = false;
            }
          } else if (!item) {
            vm.salesorder.carrierAccountNumber = null;
            vm.autoCompleteCarriers.keyColumnId = null;
            vm.setFocusShippingMethod = true;
          }
        }
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.salesorder ? (vm.salesorder.carrierID ? vm.salesorder.carrierID : null) : null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCarrierList
      };
      vm.autoCompleteTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.salesorder ? (vm.salesorder.termsID ? vm.salesorder.termsID : null) : null,
        inputName: CategoryTypeObjList.Terms.Name,
        placeholderName: CategoryTypeObjList.Terms.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.paymentTerm,
          headerTitle: CategoryTypeObjList.Terms.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getTermsList
      };

      vm.autoCompleteFOB = {
        columnName: 'name',
        controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.salesorder ? (vm.salesorder.freeOnBoardId ? vm.salesorder.freeOnBoardId : null) : null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
      vm.autoFrequency = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Frequency',
        placeholderName: 'Charge Frequency',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id && item.id === 2 && !vm.salesDetail.refSOReleaseLineID) {
              vm.autoCompleteReleaseLine.keyColumnId = vm.assyReleaseLineList.length > 0 ? vm.assyReleaseLineList[0].shippingID : null;
            }
            if (vm.salesDetail.refSOReleaseLineID && item.id === 2) {
              vm.autoCompleteReleaseLine.keyColumnId = vm.salesDetail.refSOReleaseLineID;
            }
          }
          else {
            vm.autoCompleteReleaseLine.keyColumnId = null;
          }
        }
      };
      vm.autoFrequencyType = {
        columnName: 'type',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Frequency Type',
        placeholderName: 'Frequency Type',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: () => {
        }
      };
      vm.autoCompleteBlanketPOOption = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: vm.salesorder && vm.salesorder.blanketPOOption ? vm.salesorder.blanketPOOption : null,
        inputName: 'Blanket PO Option',
        placeholderName: 'Blanket PO Option',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item && vm.salesorder.isBlanketPO && (item.id === vm.BlanketPODetails.LINKBLANKETPO) && !parseInt(vm.salesorder.status)) {
            let mappedDet = [];
            const alreadyMapped = _.map(vm.sourceData, 'SalesDetail');
            _.each(alreadyMapped, (mappItem) => {
              mappedDet = mappedDet.concat(...mappItem);
            });
            if (mappedDet.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKET_PO_FUTURE_PO_OPTION_SELECT_ALERT);
              messageContent.message = stringFormat(messageContent.message, vm.salesorder.poNumber);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
                vm.isbpoFocus = false;
                vm.autoCompleteBlanketPOOption.keyColumnId = null;
                $timeout(() => {
                  vm.isbpoFocus = true;
                }, 1000);
              });
            }
          }
        }
      };
      vm.autoCompleteOrgPO = {
        columnName: 'PONumber',
        keyColumnName: 'soId',
        keyColumnId: null,
        inputName: 'SearchOrgPO',
        placeholderName: 'Type here to search PO#/SO#',
        isRequired: false,
        isAddnew: false,
        isUppercaseSearchText: true,
        searchText: '',
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.setOriginalPOData(item);
          } else {
            vm.isSkipBlurOnOrgPONumber = false;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            custID: vm.salesorder.customerID || (vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null),
            currSOId: vm.salesorder.id,
            searchPO: query,
            orgSOId: vm.salesorder.orgSalesOrderID
          };
          return getCustomerSalesOrderDetail(searchObj);
        },
        callbackFnForClearSearchText: () => {
          vm.salesorder.orgPONumber = angular.copy(vm.autoCompleteOrgPO.searchText);
          vm.salesorder.orgSalesOrderID = null;
        }
        // blurEventFn: vm.changeOrgPONumber
      };

      vm.autoCompleteSearchDetail = {
        columnName: 'soDetSearchText',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'soDetSearchText',
        placeholderName: 'Search SO Detail',
        isRequired: false,
        isAddnew: false,
        callbackFn: getSalesOrderDetail,
        onSelectCallbackFn: setSalesOrderDetail
      };
    };
    //open edit Contact person pop-up
    vm.EditPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setMainContPersonDetAfterApply(callBackContactPerson);
      }
    };

    // on refresh assembly deails
    vm.refreshAssemblyDetails = () => {
      getcustomerdetail($scope.ParentNme);
    };
    /*
     * Author :  Champak Chaudhary
    * Purpose : get customer details
    */

    const getcustomerdetail = (item) => {
      if (item) {
        const lastIndex = _.last(vm.sourceData);
        vm.customerCodeName = item.mfgCode;
        $scope.$parent.vm.customerName = item.mfgName;
        $scope.$parent.vm.customerID = item.id;
        if (lastIndex && (lastIndex.PIDCode && !vm.id)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGING_CUSTOMER);
          const objs = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(objs).then((yes) => {
            if (yes) {
              vm.isOpen = false;
              $scope.ParentNme = item;
              vm.salesorder.salesCommissionTo = item.salesCommissionTo;
              vm.salesorder.internalComment = vm.id ? vm.salesorder.internalComment : (vm.salesorder.internalComment || item.comments);
              const autocompleteCustomerPromise = [getCustomerContactPersonList(), getCustomerAddress(item.id), getCustomerDetailsByID(item.id), getSalesCommissionEmployeeListbyCustomer(item.id), getFOBList(), getotherTypecomponent()];
              vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
                setOtherDetForCustAddrDir(item.id);
                setShipOtherDetForCustAddrDir(item.id);
                setMarkOtherDetForCustAddrDir(item.id);
                setOtherDetForMainContactPerson(item.id);
                if (!vm.autocompleteAssy) {
                  initSalesDetails();
                } else if (!vm.id) {
                  vm.autoCompleteSalesDetCommosssionTo.keyColumnId = item.salesCommissionTo;
                  vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo;
                }
                vm.salesorder.freeOnBoardId = vm.salesorder && vm.salesorder.id ? vm.salesorder.freeOnBoardId : item.freeOnBoardId;
                if (vm.autoCompleteFOB) {
                  vm.autoCompleteFOB.keyColumnId = vm.salesorder.freeOnBoardId;
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            vm.autoCompleteCustomer.keyColumnId = null;
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          $scope.ParentNme = item;
          if (!vm.id) {
            vm.salesorder.salesCommissionTo = item.salesCommissionTo;
          }
          vm.salesorder.internalComment = vm.id ? vm.salesorder.internalComment : (vm.salesorder.internalComment || item.comments);
          const autocompleteCustomerPromise = [getCustomerContactPersonList(), getCustomerAddress(item.id), getCustomerDetailsByID(item.id), getSalesCommissionEmployeeListbyCustomer(item.id), getFOBList(), getotherTypecomponent()];
          if (vm.salesorder.isRmaPO) {
            const searchObj = {
              partID: null,
              searchText: null,
              pisFromSO: true,
              refSoID: vm.salesorder.isRmaPO ? vm.salesorder.orgSalesOrderID : null
            };
            autocompleteCustomerPromise.push(getcomponentAssemblyList(searchObj));
          }
          vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
            setOtherDetForCustAddrDir(item.id);
            setShipOtherDetForCustAddrDir(item.id);
            setMarkOtherDetForCustAddrDir(item.id);
            setOtherDetForMainContactPerson(item.id);
            if (!vm.autocompleteAssy) {
              initSalesDetails();
            } else if (!vm.id) {
              vm.autoCompleteSalesDetCommosssionTo.keyColumnId = item.salesCommissionTo;
              vm.autoCompleteSalesCommosssionTo.keyColumnId = item.salesCommissionTo;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        vm.salesorder.freeOnBoardId = vm.salesorder && vm.salesorder.id ? vm.salesorder.freeOnBoardId : item.freeOnBoardId;
        if (vm.autoCompleteFOB) {
          vm.autoCompleteFOB.keyColumnId = vm.salesorder.freeOnBoardId;
        }
      } else {
        vm.selectedPreviousCustomer = Object.assign(vm.customerCodeName || null);
        $scope.ParentNme = null;
        vm.customerName = null;
        vm.customerCodeName = null;
        vm.salesorder.carrierAccountNumber = null;
        vm.salesorder.salesCommissionTo = null;
        vm.salesorder.freeOnBoardId = null;
        vm.salesorder.internalComment = null;
        vm.salesorder.shippingComment = null;
        vm.selectedPreviousCustomer = null;
        if (vm.autoCompleteCarriers) {
          vm.autoCompleteCarriers.keyColumnId = null;
        }
        if (vm.autoCompleteShipping) {
          vm.autoCompleteShipping.keyColumnId = null;
        }
        if (vm.autoCompleteSalesCommosssionTo) {
          vm.autoCompleteSalesCommosssionTo.keyColumnId = null;
        }
        if (vm.autoCompleteSalesDetCommosssionTo) {
          vm.autoCompleteSalesDetCommosssionTo.keyColumnId = null;
        }
        if (vm.autoCompleteFOB) {
          vm.autoCompleteFOB.keyColumnId = null;
        }
        resetAddressesDet();
      }
    };
    vm.salesDetail = { isLine: 1 };

    const getSelectedAssy = (item) => {
      if (item) {
        vm.assyReleaseLineList = _.clone(_.filter(item.SalesDetail, (sDetail) => !sDetail.isTBD));
        vm.salesDetail.materialTentitiveDocDate = item.materialTentitiveDocDate;
        _.each(vm.assyReleaseLineList, (assyLine) => {
          assyLine.releaseLineQty = stringFormat('{0} | {1} | {2}', assyLine.releaseNumber, assyLine.qty, assyLine.requestedDockDate || assyLine.shippingDate);
        });
        if (!vm.autoCompleteReleaseLine) {
          autoCompleteReleaseLine();
        }
        if (!vm.salesDetail.refSOReleaseLineID && vm.autoFrequency.keyColumnId === 2) {
          vm.autoCompleteReleaseLine.keyColumnId = vm.assyReleaseLineList.length > 0 ? vm.assyReleaseLineList[0].shippingID : null;
        };
        if (vm.salesDetail.refSOReleaseLineID) {
          vm.autoCompleteReleaseLine.keyColumnId = vm.salesDetail.refSOReleaseLineID;
        }
        vm.selectedPartNumber = item.mfgPN;
        vm.selectedAssy = item.PIDCode;
        vm.partID = item.partID;
        vm.rohsIcon = item.rohsIcon;
        vm.rohsName = item.rohsText;
      }
      else {
        vm.autoCompleteReleaseLine.keyColumnId = null;
        vm.assyReleaseLineList = [];
        vm.selectedPartNumber = vm.selectedAssy = vm.partID = vm.rohsIcon = vm.rohsName = null;
      }
    };

    const resetAddressesDet = () => {
      vm.salesorder.shippingAddressID = null;
      vm.salesorder.billingAddressID = null;
      vm.salesorder.intermediateShipmentId = null;
      vm.salesorder.billingAddress = null;
      vm.salesorder.shippingAddress = null;
      vm.salesorder.intermediateAddress = null;

      vm.salesorder.billingContactPersonID = null;
      vm.salesorder.shippingContactPersonID = null;
      vm.salesorder.intermediateContactPersonID = null;
      vm.salesorder.billingContactPerson = null;
      vm.salesorder.shippingContactPerson = null;
      vm.salesorder.intermediateContactPerson = null;

      vm.billingAddress = null;
      vm.shippingAddress = null;
      vm.intermediateAddress = null;
      vm.selectedContactPerson = null;
      vm.selectedShipContactPerson = null;
      vm.selectedMarkContactPerson = null;

      vm.viewCustAddrOtherDet = null;
      vm.viewShipCustAddrOtherDet = null;
      vm.viewMarkCustAddrOtherDet = null;
    };

    //auto complete assembly
    function initSalesDetails() {
      vm.autocompleteAssy = {
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        columnName: 'combinemfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Assembly',
        placeholderName: 'AssyNumber',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            partID: obj.id,
            searchText: null,
            pisFromSO: true,
            refSoID: vm.salesorder.isRmaPO ? vm.salesorder.orgSalesOrderID : null
          };
          return getcomponentAssemblyList(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item && item.rfqOnly) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
            messageContent.message = stringFormat(messageContent.message, item.PIDCode);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
              if (vm.autocompleteAssy && vm.autocompleteAssy.keyColumnId) {
                $scope.$broadcast(vm.autocompleteAssy.inputName, null);
                $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
              }
            });
          }
          else if (!item && vm.salesorder.isBlanketPO && vm.salesorder.blanketPOOption === 2 && !vm.isReset) {
            vm.getusedBlanketPODetails().then(() => {
              if (vm.bomAssignedQtyList && vm.bomAssignedQtyList.length > 0 && vm.salesDetail.mfgPN) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKET_PO_MAPP_REMOVE_ALERT_MSG);
                messageContent.message = stringFormat(messageContent.message, vm.salesDetail.mfgPN, vm.salesDetail.custPOLineNumber, _.map(_.uniqBy(vm.bomAssignedQtyList, 'poNumber'), 'poNumber').join(', '));
                const model = {
                  multiple: true,
                  messageContent: messageContent
                };
                return DialogFactory.messageAlertDialog(model).then(() => {
                  vm.autocompleteAssy.keyColumnId = vm.salesDetail.partID;
                  const searchObj = {
                    partID: vm.salesDetail.partID
                  };
                  getcomponentAssemblyList(searchObj);
                });
              } else { commonAssySelectAssy(item); }
            });
          }
          else {
            commonAssySelectAssy(item);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            partID: null,
            searchText: query,
            pisFromSO: true
          };
          return getcomponentAssemblyList(searchObj);
        }
      };
      // common select option for assyID
      const commonAssySelectAssy = (item) => {
        if ((vm.salesDetail && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) && ((vm.salesDetail.isCommissionDataEdited && item && vm.autocompleteAssy && vm.salesDetail.partID !== item.id) ||
          (vm.salesDetail.id > 0 && (!item || (vm.salesDetail.salesCommissionList.length > 0 &&
            vm.autocompleteAssy && vm.autocompleteAssy.keyColumnId !== vm.salesDetail.partID))))) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.assyId);
        } else {
          if (!vm.isAssyChange_No_OptionSelected) {
            getSelectedAssyDetail(item);
          }
          vm.isAssyChange_No_OptionSelected = false;
        }
        if (item) {
          setFocus('qty');
        }
      };
      vm.autoCompleteSalesShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.ShippingType.Title,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: { headerTitle: CategoryTypeObjList.ShippingType.Title, isSalesOrder: true, saleName: CategoryTypeObjList.ShippingType.Name },
        isRequired: false,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: getSelectedSalesShipping
      };

      vm.autoCompleteSalesAddress = {
        columnName: 'FullAddress',
        controllerName: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: vm.LabelConstant.Address.ShippingAddress,
        placeholderName: vm.LabelConstant.Address.ShippingAddress,
        addData: { addressType: 'S', companyNameWithCode: $scope.ParentNme ? $scope.ParentNme.mfgName : null, companyName: $scope.ParentNme ? $scope.ParentNme.mfgactualName : null, customerId: vm.salesorder.customerID ? vm.salesorder.customerID : vm.autoCompleteCustomer.keyColumnId },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCustomerAddress,
        onSelectCallbackFn: getSelectedSalesAddress
      };

      vm.autocompleteQtyTurnTime = {
        columnName: 'qtyTurnTime',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Quote Qty Turn Time',
        isRequired: false,
        isAddnew: false,
        callbackFn: getQtyTurnTime,
        onSelectCallbackFn: onChangeTurnTime
      };

      vm.autoCompleteSalesDetCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: vm.salesorder && vm.salesorder.salesCommissionTo ? vm.salesorder.salesCommissionTo : null,
        inputName: 'Sales Commission To',
        placeholderName: 'Sales Commission To',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getSalesCommissionEmployeeListbyCustomer,
        onSelectCallbackFn: getSelectedSalesCommissionPerson
      };

      vm.autocompleteOtherCharges = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Other Charges',
        placeholderName: 'Other Charges',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other,
          customerID: null
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getotherTypecomponent,
        onSelectCallbackFn: getSelectedOtherCharge
      };

      vm.autocompleteSelectAssyID = {
        columnName: 'assyIDPID',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Select Assy ID/PID',
        placeholderName: 'PO Line#/PID/MPN',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: getSelectedAssy
      };

      vm.autoCompleteOrgPODetail = {
        columnName: 'combinemfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'orgPODetail',
        placeholderName: 'Org. PO Line Detail',
        isRequired: vm.salesorder.isRmaPO,
        isAddnew: false,
        isUppercaseSearchText: true,
        onSelectCallbackFn: (item) => {
          if (item && item.rfqOnly) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
            messageContent.message = stringFormat(messageContent.message, item.PIDCode);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
              if (vm.autocompleteAssy && vm.autoCompleteOrgPODetail.keyColumnId) {
                $scope.$broadcast(vm.autoCompleteOrgPODetail.inputName, null);
                $scope.$broadcast(vm.autoCompleteOrgPODetail.inputName + 'searchText', null);
              }
            });
          }
          else if ((vm.salesDetail && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) && ((vm.salesDetail.isCommissionDataEdited && item && vm.autocompleteAssy && vm.salesDetail.partID !== item.id) ||
            (vm.salesDetail.id > 0 && (!item || (vm.salesDetail.salesCommissionList.length > 0 &&
              vm.autocompleteAssy && vm.autoCompleteOrgPODetail.keyColumnId !== vm.salesDetail.partID))))) {
            changeConfirmation(TRANSACTION.OnChangeCommissionType.assyId);
          }
          else {
            if (!vm.isAssyChange_No_OptionSelected) {
              getSelectedAssyDetail(item);
            }
            vm.isAssyChange_No_OptionSelected = false;
          }
          if (item) {
            setFocus('qty');
          }
        }
        //onSearchFn: (query) => {
        //  const searchObj = {
        //    id: vm.salesorder.id
        //  };
        //  return getOrginalCustPOLineNumber(searchObj);
        //}
        //callbackFnForClearSearchText: () => {
        //  vm.salesDetail.custOrgPOLineNumber = angular.copy(vm.autoCompleteOrgPOLine.searchText);
        //}
      };

      initAutoCompleteQuoteGroup();
    };

    // auto complete release line
    const autoCompleteReleaseLine = () => {
      vm.autoCompleteReleaseLine = {
        columnName: 'releaseLineQty',
        keyColumnName: 'shippingID',
        keyColumnId: null,
        inputName: 'Release Line#',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.salesDetail.isAgreeToShip = item.isAgreeToShip;
            vm.salesDetail.requestedDockDate = item.isAgreeToShip ? item.revisedRequestedDockDate : item.requestedDockDate;
            vm.salesDetail.promisedShipDate = item.isAgreeToShip ? item.revisedRequestedPromisedDate : item.promisedShipDate;
            vm.salesDetail.requestedShipDate = item.isAgreeToShip ? item.revisedRequestedShipDate : item.requestedShipDate;
          }
          else {
            vm.salesDetail.isAgreeToShip = false;
            vm.salesDetail.requestedDockDate = null;
            vm.salesDetail.promisedShipDate = null;
            vm.salesDetail.requestedShipDate = null;
          }
        }
      };
    };

    const initAutoCompleteQuoteGroup = () => {
      vm.autoCompleteQuoteGroup = {
        columnName: 'rfqrefID',
        keyColumnName: 'rfqrefID',
        keyColumnId: null,
        inputName: 'QuoteGroup',
        isRequired: false,
        isAddnew: false,
        callbackFn: getrfqQuoteGroupList,
        onSelectCallbackFn: onSelectCallbackQuoteGroup
      };
    };

    function getSelectedSalesShipping(item) {
      if (item) {
        vm.salesDetailRelease.gencCategoryCode = item.gencCategoryCode;
      }
      else {
        vm.salesDetailRelease.gencCategoryCode = null;
      }
    }
    function getSelectedSalesAddress(item) {
      if (item) {
        vm.salesDetailRelease.FullAddress = item.FullAddress;
      }
      else {
        vm.salesDetailRelease.FullAddress = null;
      }
    }
    //on select of other charges autocomplete set details
    const getSelectedOtherCharge = (item) => {
      vm.salesDetail.quoteFrom = vm.salesCommissionFrom.NA.id;
      if (item) {
        vm.salesDetail.partID = vm.salesDetail.partID ? vm.salesDetail.partID : item.id;
        vm.salesDetail.PIDCode = item.pidcode;
        vm.salesDetail.partDescription = vm.salesDetail.partDescription ? vm.salesDetail.partDescription : item.mfgPNDescription;
        vm.salesDetail.isCustom = item.isCustom;
        vm.salesDetail.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
        vm.salesDetail.rohsName = item.rohsName;
        vm.salesDetail.partType = CORE.PartType.Other;
        vm.salesDetail.mfgPN = vm.salesDetail.mfgPN ? vm.salesDetail.mfgPN : item.mfgPN;
        vm.salesDetail.partCategory = vm.salesDetail.partCategory ? vm.salesDetail.partCategory : item.category;
        vm.salesDetail.mfrName = item.mfgCodeName;
        vm.salesDetail.mfrID = item.mfgcodeid;
        vm.autoFrequency.keyColumnId = vm.salesDetail.frequency ? vm.salesDetail.frequency : item.frequency;
        vm.autoFrequencyType.keyColumnId = vm.salesDetail.frequencyType || item.frequencyType;
        if (!vm.updateOther) {
          vm.salesDetail.qty = 1;
        }
        vm.getPartPriceBreakDetails(item.id).then(() => {
          vm.changeOtherPartQty();
        });
        if (!vm.salesDetail.lineID) {
          const maxLine = _.maxBy(vm.sourceData, (charges) => parseInt(charges.lineID));
          if (maxLine) {
            if (parseInt(maxLine.lineID) >= TRANSACTION.DEFAULT_OTHER_LINE) {
              vm.salesDetail.lineID = parseInt(maxLine.lineID) + 1;
            } else {
              vm.salesDetail.lineID = TRANSACTION.DEFAULT_OTHER_LINE;
            }
          } else {
            vm.salesDetail.lineID = TRANSACTION.DEFAULT_OTHER_LINE;
          }
        }
        setFocus('partDescription');
        vm.getpendingBlanketPOList();
      }
      else {
        vm.updateOther = false;
        vm.salesDetail.partType = vm.salesDetail.partDescription = vm.salesDetail.partID = vm.salesDetail.isCustom = vm.salesDetail.rohsIcon = vm.salesDetail.mfrID = vm.salesDetail.rohsText = vm.salesDetail.mfgPN = vm.salesDetail.mfrName = null;
        vm.PartPriceBreakDetailsData = [];
        vm.autoFrequency.keyColumnId = null;
        vm.autoFrequencyType.keyColumnId = null;
        resetSalesOrderDetForm();
      }
    };

    function setAssymblyDetails(item) {
      vm.salesDetail.partDescription = vm.salesDetail && vm.salesDetail.lineID && vm.salesDetail.partDescription ? vm.salesDetail.partDescription : (item ? item.description : null);
      vm.salesDetail.nickName = item ? item.nickName : null;
      vm.salesDetail.rohsIcon = item ? stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon) : null;
      vm.salesDetail.rohsText = item ? item.rohsName : null;
      vm.salesDetail.PIDCode = item ? item.PIDCode : null;
      vm.salesDetail.mfgPN = item ? item.mfgPN : null;
      vm.salesDetail.unitName = item ? item.unitName : null;
      vm.salesDetail.uom = item ? item.unitID : null;
      vm.salesDetail.partID = item ? item.id : null;
      vm.salesDetail.isCustom = item ? item.iscustom : null;
      vm.salesDetail.partCategory = item ? item.category : null;
      if (!vm.salesDetail.isCustom) {
        vm.salesDetail.quoteFrom = vm.salesCommissionFrom.NA.id;
      } else if (vm.salesDetail.partCategory === vm.PartCategory.Component && vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        vm.salesDetail.quoteFrom = vm.salesCommissionFrom.FromPartMaster.id;
      }
      vm.salesDetail.rohsIcon = item ? stringFormat('{0}{1}{2}', _configWebUrl, USER.ROHS_BASE_PATH, item.rohsIcon) : null;
      vm.salesDetail.rohsName = item ? item.rohsName : null;
      vm.salesDetail.mfrName = item ? item.mfgName : null;
      vm.salesDetail.mfrID = item ? item.mfgcodeID : null;
      vm.salesDetail.partType = item ? item.partType : null;
      vm.salesDetail.custOrgPOLineNumber = item ? ((!vm.salesDetail.id) ? item.custPOLineNumber : vm.salesDetail.custOrgPOLineNumber) : null;
      if (item && !item.isCustom && !vm.salesDetail.lineID) {
        vm.getPartPriceBreakDetails(item.id).then(() => {
          vm.changeOtherPartQty();
        });
      }
    }

    //details of assy
    function getSelectedAssyDetail(item) {
      if ((vm.kitReleaseList && vm.kitReleaseList.length > 0) && (item && item.id !== vm.salesDetail.partID)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_RELEASE_DONE_FOR_SALES_ORDER);
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.autocompleteAssy.keyColumnId = vm.salesDetail.partID;
            const searchObj = {
              partID: vm.salesDetail.partID
            };
            getcomponentAssemblyList(searchObj);
          }
        }).catch(() => BaseService.getErrorLog(error));
      } else {
        setAssymblyDetails(item);
        if (vm.salesDetail.partCategory === vm.PartCategory.Component) {
          vm.salesDetail.isSkipKitCreation = true;
          vm.ChangeSkipKitCreation();
        }
        if (item) {
          vm.salesDetail.shippingQty = vm.salesDetail.shippingQty ? vm.salesDetail.shippingQty : 1;
          vm.salesDetail.tentativeBuild = vm.salesDetail.tentativeBuild ? vm.salesDetail.tentativeBuild : 1;
          getrfqQuoteGroupList(item.id);
          vm.getPartPriceBreakDetails(item.id);
          vm.getAssemblySalesPriceDetails(item.id);
          getAssemblyStockStatusList(item.id);
          vm.changeSalesCommissionFromPartOrRFQ(item.id);
          if (!vm.salesDetail.remark) {
            getShippingCommentList(item.id);
          }
          if (!vm.salesDetail.internalComment) {
            getPartInternalCommentList(item.id);
          }
          vm.getpendingBlanketPOList();
          vm.getusedBlanketPODetails();
        }
        else {
          vm.autoCompleteQuoteGroup.keyColumnId = null;
          vm.salesDetail.refRFQGroupID = null;
          vm.autoCompleteSalesDetCommosssionTo.keyColumnId = null;
          vm.PartPriceBreakDetailsData = [];
          vm.salesDetail.readyToShip = null;
          vm.salesDetail.remark = null;
          vm.salesDetail.internalComment = null;
          $stateParams.blanketPOID = null;
          $stateParams.partID = null;
          $timeout(() => {
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
            $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
          });
          vm.pendingBlanketPOAssyList = [];
          vm.usedQty = null;
        }
      }
    }
    vm.getPartPriceBreakDetails = (id) => ComponentFactory.getPartPriceBreakDetails().query({ id: id }).$promise.then((res) => {
      if (res && res.data) {
        vm.PartPriceBreakDetailsData = res.data;
        if (vm.salesDetail.qty && !vm.salesDetail.lineID) {
          const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.salesDetail.qty);
          if (priceBreak) {
            vm.salesDetail.price = priceBreak.unitPrice;
          } else {
            const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.salesDetail.qty), (o) => o.priceBreak);
            if (priceList.length > 0) {
              vm.salesDetail.price = priceList[priceList.length - 1].unitPrice;
            }
          }
          vm.changePrice();
        }
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.getAssemblySalesPriceDetails = (id) => ComponentFactory.getAssemblySalesPriceDetails().query({ id: id }).$promise.then((res) => {
      vm.AssemblySalesPriceDetailsList = [];
      if (res && res.data) {
        vm.AssemblySalesPriceDetailsList = res.data;
        vm.changeQty(null, vm.qtyType.POQTY);
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //get ready stock qty details
    const getAssemblyStockStatusList = (id) => {
      const listObj = {
        assyID: id,
        woID: null
      };
      vm.cgBusyLoading = WorkorderFactory.getAssemblyStockDetailsByAssyID().query({
        listObj: listObj
      }).$promise.then((assemblyDetails) => {
        if (assemblyDetails && assemblyDetails.data) {
          vm.salesDetail.readyToShip = (_.sumBy(assemblyDetails.data.woAssemblyDetails, (o) => o.readytoShipQty) + _.sumBy(assemblyDetails.data.woAssemblyDetails, (o) => o.stockAdjustmentQty));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function onSelectCallbackQuoteGroup(item) {
      /*if (!item || (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId !== item.rfqrefID) ||
        (vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId !== vm.salesDetail.refRFQGroupID))*/ {
        if ((vm.salesDetail && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) && ((vm.salesDetail.isCommissionDataEdited && item && vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== item.rfqrefID) ||
          (vm.salesDetail.id > 0 && (!item || (vm.salesDetail.salesCommissionList.length > 0 &&
            vm.autoCompleteQuoteGroup && vm.autoCompleteQuoteGroup.keyColumnId !== vm.salesDetail.refRFQGroupID))))) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteGroup);
        }
        else {
          if (!vm.salesDetail.id && item && item.quoteValidTillDate && (new Date(item.quoteValidTillDate)).setHours(0, 0, 0, 0) < (new Date(BaseService.getCurrentDate())).setHours(0, 0, 0, 0)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.QUOTE_EXPIRE_VALIDATION);
            messageContent.message = stringFormat(messageContent.message, item.quoteNumber, BaseService.getUIFormatedDate(item.quoteValidTillDate, vm.DefaultDateFormat));
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                getSelectedquoteGroup(item);
              }
            }, () => {
              $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
              vm.autoCompleteQuoteGroup.keyColumnId = null;
              setFocus('qty');
            });
          } else {
            getSelectedquoteGroup(item);
          }
        }
      }
    };
    // get details of selected quote group
    function getSelectedquoteGroup(item) {
      vm.salesDetail.refRFQGroupID = item ? item.rfqrefID : null;
      vm.salesDetail.quoteNumber = item && item.quoteNumber ? item.quoteNumber : null;
      vm.salesDetail.rfqAssyID = item && item.rfqAssyID ? item.rfqAssyID : null;
      if (vm.salesDetail.isBPO) { return; }
      if (item) {
        getrfqQuoteQtyTurnTimeList(item.rfqrefID, item.partID);
        // vm.changeSalesCommissionFromPartOrRFQ
      } else {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
        vm.salesDetail.refRFQGroupID = null;
      }
    }

    function onChangeTurnTime(item) {
      $timeout(() => {
        if (vm.isQtyTurnTime_No_OptionSelected) {
          vm.isQtyTurnTime_No_OptionSelected = false;
          return;
        }
        if ((vm.salesDetail && vm.salesDetailCopy && (vm.autocompleteQtyTurnTime.keyColumnId || vm.salesDetail.refRFQQtyTurnTimeID) !== vm.salesDetailCopy.refRFQQtyTurnTimeID && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) &&
          ((vm.salesDetail.isCommis && sionDataEdited && item && vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== item.id) ||
            (vm.salesDetail.id > 0 && (!item || (vm.salesDetail.salesCommissionList.length > 0 &&
              vm.autocompleteQtyTurnTime && vm.autocompleteQtyTurnTime.keyColumnId !== vm.salesDetail.refRFQQtyTurnTimeID))))) {
          changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime);
        }
        else {
          getSelectedturnTime(item);
        }
      });
    }

    vm.onChangeSORevision = () => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.revision = vm.salesorder.revision;
      }
    };

    //get selected turn time
    function getSelectedturnTime(item) {
      if (item && item.id === vm.salesDetail.refRFQQtyTurnTimeID) { return; }
      vm.salesDetail.refRFQQtyTurnTimeID = item ? item.id : null;
      vm.salesDetail.qtyTurnTime = item ? item.qtyTurnTime : null;
      if (vm.quoteQtyTurnTimeDetails && vm.quoteQtyTurnTimeDetails.length && item && item.id) {
        const selectedTurnTime = _.find(vm.quoteQtyTurnTimeDetails, (a) => a.id === item.id);
        if (selectedTurnTime) {
          vm.autocompleteQtyTurnTime.keyColumnId = item.id;
          // $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName, selectedTurnTime);
          if (!vm.salesDetail.price) {
            vm.salesDetail.price = item.unitPrice;
            vm.changePrice();
            vm.getSalesCommissionDetailsOnPriceChange();
          }
        }
        if (!vm.salesDetail.id && !vm.salesDetail.isBPO) {
          const unitPrice = item && item.unitPrice ? item.unitPrice : null;
          vm.changeQty(null, vm.qtyType.POQTY, unitPrice);
          vm.getSalesCommissionDetailsOnPriceChange();
        }
      }
      if (!item && vm.salesDetail && vm.salesDetail.id && vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id && !vm.salesDetail.isBPO) {
        getQtyTurnTimeByAssyId(vm.salesDetail.partID, vm.salesDetail.id);
      }
    }

    //get selected sale commission person
    function getSelectedSalesCommissionPerson(item) {
      vm.salesDetail.salesCommissionName = item ? item.name : null;
      vm.salesDetail.salesCommissionTo = item ? item.id : null;
    }
    /*
     * Author :  Champak Chaudhary
     * Purpose : Save sales order detail
     */
    //check Validation in save button
    vm.checkValidation = (ispublish) => {
      vm.ischeckValidation = false;
      vm.isfalse = false;
      let row_index = 0;
      if (vm.sourceData && (vm.sourceData.length === 0 || (_.filter(vm.sourceData, (fAssy) => !fAssy.isTBD)).length === 0) && ispublish) {
        vm.isfalse = true;
        vm.ischeckValidation = true;
        const obj = {
          multiple: true,
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_STATUS_CHANGE)
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      }
      _.each(vm.sourceData, (item) => {
        vm.expandindex = 0;
        _.each(item.SalesDetail, (data) => {
          var objAddress = _.find(vm.ShippingAddressList, (address) => address.FullAddress === data.FullAddress);
          var objShippingType = _.find(vm.ShippingTypeList, (type) => type.gencCategoryCode === data.gencCategoryCode);
          data.shippingAddressID = objAddress ? objAddress.id : null;
          data.countryID = objAddress ? objAddress.countryID : null;
          if (objAddress && objAddress.countryMst) {
            data.countryName = objAddress.countryMst ? objAddress.countryMst.countryName : '';
          }
          data.shippingMethodID = objShippingType ? objShippingType.gencCategoryID : null;
          vm.expandindex = vm.expandindex + 1;
        });
        if (vm.isfalse) {
          return false;
        }
        row_index = row_index + 1;
      });
    };
    vm.saveSalesOrder = () => {
      if (!isopen) {
        if (vm.salesorder.isRmaPO) {
          checkAddress();
        } else {
          vm.checkUniqueCustomerPONumber().then((response) => {
            if (response) {
              checkAddress();
            }
          });
        }
      } else {
        saveSalesOrderConfirmDetail();
      }
    };



    // check address before save
    const checkAddress = () => {
      if (!isopen && parseInt(vm.salesorder.status)) {
        if (!vm.salesorder.shippingAddressID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          messageContent.message = stringFormat(messageContent.message, CORE.LabelConstant.COMMON.ShippingAddress);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.salesorder.status = Object.assign(vm.salesorderCopy.status);
          });
        } else if (vm.salesorder.shippingAddressID && !vm.salesorder.shippingContactPersonID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          messageContent.message = stringFormat(messageContent.message, CORE.LabelConstant.COMMON.ShippingAddressContactPerson);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.salesorder.status = Object.assign(vm.salesorderCopy.status);
          });
        } else if (vm.salesorder.billingAddressID && !vm.salesorder.billingContactPersonID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          messageContent.message = stringFormat(messageContent.message, CORE.LabelConstant.COMMON.BillingAddressContactPerson);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.salesorder.status = Object.assign(vm.salesorderCopy.status);
          });
        } else if (vm.salesorder.intermediateShipmentId && !vm.salesorder.intermediateContactPersonID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          messageContent.message = stringFormat(messageContent.message, CORE.LabelConstant.COMMON.MarkForContactPerson);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => {
            vm.salesorder.status = Object.assign(vm.salesorderCopy.status);
          });
        } else {
          saveSalesOrderConfirmDetail();
        }
      }
      else {
        saveSalesOrderConfirmDetail();
      }
    };

    // save sales order detail
    const saveSalesOrderConfirmDetail = (objSoDet, event, type) => {
      if (parseInt(vm.salesorder.status) && vm.salesorder.isAlreadyPublished && ((parseInt(vm.salesorder.status) === parseInt(vm.salesorderCopy.status)) ||
        (vm.salesorder.poNumber !== vm.salesorderCopy.poNumber ||
          vm.salesorder.poDate !== BaseService.getUIFormatedDate(vm.salesorderCopy.poDate, vm.DefaultDateFormat) ||
          vm.contactPersonID !== vm.salesorderCopy.contactPersonID ||
          vm.salesorder.billingAddressID !== vm.salesorderCopy.billingAddressID ||
          vm.salesorder.billingContactPersonID !== vm.salesorderCopy.billingContactPersonID ||
          vm.salesorder.shippingContactPersonID !== vm.salesorderCopy.shippingContactPersonID ||
          vm.salesorder.intermediateContactPersonID !== vm.salesorderCopy.intermediateContactPersonID ||
          vm.salesorder.shippingAddressID !== vm.salesorderCopy.shippingAddressID ||
          vm.autoCompleteShipping.keyColumnId !== vm.salesorderCopy.shippingMethodID ||
          vm.salesorder.shippingComment !== vm.salesorderCopy.shippingComment ||
          vm.salesorder.internalComment !== vm.salesorderCopy.internalComment ||
          vm.autoCompleteTerm.keyColumnId !== vm.salesorderCopy.termsID ||
          vm.salesorder.revisionChangeNote !== vm.salesorderCopy.revisionChangeNote ||
          vm.autoCompleteSalesCommosssionTo.keyColumnId !== vm.salesorderCopy.salesCommissionTo ||
          vm.autoCompleteFOB.keyColumnId !== vm.salesorderCopy.freeOnBoardId ||
          vm.salesorder.intermediateShipmentId !== vm.salesorderCopy.intermediateShipmentId ||
          vm.autoCompleteCarriers.keyColumnId !== vm.salesorderCopy.carrierID ||
          vm.salesorder.carrierAccountNumber !== vm.salesorderCopy.carrierAccountNumber ||
          vm.salesorder.poRevision !== vm.salesorderCopy.poRevision))) {
        vm.salesorder.isAskForVersionConfirmation = true;
      }
      const newRevision = (parseInt(vm.salesorder.revision || 0) + 1) < 10 ? stringFormat('0{0}', (parseInt(vm.salesorder.revision || 0) + 1)) : (parseInt(vm.salesorder.revision || 0) + 1).toString();
      if (vm.salesorder.isAlreadyPublished && vm.salesorder.isAskForVersionConfirmation && parseInt(vm.salesorder.status)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, 'Sales Order', vm.salesorder.revision, newRevision);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.salesorder.isSOrevision = true;
            if (objSoDet && !type) {
              saveSODetailValidation(objSoDet, event);
            } else if (!type) {
              saveFinalSalesOrderDetail();
            } else if (type === CORE.SO_CALL.OTHER_CHRG) {
              saveOtherChargesRevisionUpdate(objSoDet);
            } else if (type === CORE.SO_CALL.REMOVE_SODET) {
              removeSalesOrderDetailUpdateVersionConfirmation(objSoDet);
            } else if (type === CORE.SO_CALL.REMOVE_LINEDET) {
              releaseLineSOVersionUpgradeConfirmation(objSoDet);
            }
          }
        }, () => {
          vm.salesorder.isSOrevision = false;
          if (objSoDet && !type) {
            saveSODetailValidation(objSoDet, event);
          } else if (!type) {
            saveFinalSalesOrderDetail();
          } else if (type === CORE.SO_CALL.OTHER_CHRG) {
            saveOtherChargesRevisionUpdate(objSoDet);
          } else if (type === CORE.SO_CALL.REMOVE_SODET) {
            removeSalesOrderDetailUpdateVersionConfirmation(objSoDet);
          } else if (type === CORE.SO_CALL.REMOVE_LINEDET) {
            releaseLineSOVersionUpgradeConfirmation(objSoDet);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.salesorder.isSOrevision = false;
        if (objSoDet && !type) {
          saveSODetailValidation(objSoDet, event);
        } else if (!type) {
          saveFinalSalesOrderDetail();
        } else if (type === CORE.SO_CALL.OTHER_CHRG) {
          saveOtherChargesRevisionUpdate(objSoDet);
        } else if (type === CORE.SO_CALL.REMOVE_SODET) {
          removeSalesOrderDetailUpdateVersionConfirmation(objSoDet);
        } else if (type === CORE.SO_CALL.REMOVE_LINEDET) {
          releaseLineSOVersionUpgradeConfirmation(objSoDet);
        }
      }
    };

    const saveFinalSalesOrderDetail = () => {
      vm.contactPersonID = vm.contactpersondetail ? vm.contactpersondetail.personId : null;
      if (parseInt(vm.salesorder.status)) {
        vm.salesorder.isAskForVersionConfirmation = false;
      } else if (!parseInt(vm.salesorder.status) && vm.salesorder.isAlreadyPublished &&
        (vm.salesorder.poNumber !== vm.salesorderCopy.poNumber ||
          vm.salesorder.poDate !== BaseService.getUIFormatedDate(vm.salesorderCopy.poDate, vm.DefaultDateFormat) ||
          vm.contactPersonID !== vm.salesorderCopy.contactPersonID ||
          vm.salesorder.billingAddressID !== vm.salesorderCopy.billingAddressID ||
          vm.salesorder.shippingAddressID !== vm.salesorderCopy.shippingAddressID ||
          vm.autoCompleteShipping.keyColumnId !== vm.salesorderCopy.shippingMethodID ||
          vm.salesorder.shippingComment !== vm.salesorderCopy.shippingComment ||
          vm.salesorder.internalComment !== vm.salesorderCopy.internalComment ||
          vm.autoCompleteTerm.keyColumnId !== vm.salesorderCopy.termsID ||
          vm.salesorder.revisionChangeNote !== vm.salesorderCopy.revisionChangeNote ||
          vm.autoCompleteSalesCommosssionTo.keyColumnId !== vm.salesorderCopy.salesCommissionTo ||
          vm.autoCompleteFOB.keyColumnId !== vm.salesorderCopy.freeOnBoardId ||
          vm.salesorder.intermediateShipmentId !== vm.salesorderCopy.intermediateShipmentId ||
          vm.autoCompleteCarriers.keyColumnId !== vm.salesorderCopy.carrierID ||
          vm.salesorder.carrierAccountNumber !== vm.salesorderCopy.carrierAccountNumber ||
          vm.salesorder.poRevision !== vm.salesorderCopy.poRevision)) {
        vm.salesorder.isAskForVersionConfirmation = true;
      }
      const salesorderInfo = {
        salesOrderNumber: vm.salesorder.salesOrderNumber ? vm.salesorder.salesOrderNumber : '',
        poNumber: vm.salesorder.poNumber,
        poDate: BaseService.getAPIFormatedDate(vm.salesorder.poDate),
        customerID: vm.autoCompleteCustomer.keyColumnId,
        contactPersonID: vm.contactPersonID,
        billingAddressID: vm.billingAddress ? vm.billingAddress.id : null,
        shippingAddressID: vm.shippingAddress ? vm.shippingAddress.id : null,
        shippingMethodID: vm.autoCompleteShipping.keyColumnId,
        carrierID: vm.autoCompleteCarriers.keyColumnId,
        carrierAccountNumber: vm.salesorder.carrierAccountNumber,
        isAddnew: !parseInt(vm.salesorder.status) === 1 ? true : false,
        revision: vm.salesorder.revision,
        shippingComment: vm.salesorder.shippingComment,
        status: vm.salesorder.status,
        termsID: vm.autoCompleteTerm.keyColumnId,
        soDateValue: vm.salesorder.soDate,
        soDate: BaseService.getAPIFormatedDate(vm.salesorder.soDate),
        SalesDet: [],    // salesdetaillist,
        revisionChangeNote: vm.salesorder.revisionChangeNote,
        salesCommissionTo: vm.autoCompleteSalesCommosssionTo.keyColumnId,
        freeOnBoardId: vm.autoCompleteFOB.keyColumnId,
        intermediateShipmentId: vm.salesorder.intermediateShipmentId,
        internalComment: vm.salesorder.internalComment,
        serialNumber: vm.salesorder.serialNumber,
        isBlanketPO: vm.salesorder.isBlanketPO,
        linkToBlanketPO: vm.salesorder.linkToBlanketPO,
        blanketPOOption: vm.autoCompleteBlanketPOOption.keyColumnId,
        isLegacyPO: vm.salesorder.isLegacyPO,
        poRevision: vm.salesorder.poRevision,
        isSOrevision: vm.salesorder.isSOrevision,
        isRmaPO: vm.salesorder.isRmaPO,
        originalPODate: BaseService.getAPIFormatedDate(vm.salesorder.originalPODate),
        poRevisionDate: BaseService.getAPIFormatedDate(vm.salesorder.poRevisionDate),
        isAlreadyPublished: vm.salesorder.isAlreadyPublished || (parseInt(vm.salesorder.status || 0)),
        isAskForVersionConfirmation: vm.salesorder.isAskForVersionConfirmation,
        rmaNumber: vm.salesorder.rmaNumber,
        isDebitedByCustomer: vm.salesorder.isDebitedByCustomer || 0,
        orgPONumber: vm.salesorder.orgPONumber,
        orgSalesOrderID: vm.salesorder.orgSalesOrderID,
        isReworkRequired: vm.salesorder.isReworkRequired || 0,
        reworkPONumber: vm.salesorder.reworkPONumber,
        billingContactPerson: BaseService.generateContactPersonDetFormat(vm.selectedContactPerson),
        billingContactPersonID: vm.salesorder.billingContactPersonID,
        billingAddress: BaseService.generateAddressFormateToStoreInDB(vm.billingAddress),
        shippingContactPerson: BaseService.generateContactPersonDetFormat(vm.selectedShipContactPerson),
        shippingContactPersonID: vm.salesorder.shippingContactPersonID,
        shippingAddress: BaseService.generateAddressFormateToStoreInDB(vm.shippingAddress),
        intermediateContactPerson: BaseService.generateContactPersonDetFormat(vm.selectedMarkContactPerson),
        intermediateContactPersonID: vm.salesorder.intermediateContactPersonID,
        intermediateAddress: BaseService.generateAddressFormateToStoreInDB(vm.intermediateAddress)
      };
      if (vm.salesorder.id) {
        updateSalesOrder(salesorderInfo);
      }
      else {
        vm.cgBusyLoading = SalesOrderFactory.salesorder().save(salesorderInfo).$promise.then((res) => {
          if (res && res.data && res.data.id) {
            vm.isOpen = false;
            //vm.resetDetail(true);
            vm.salesorder.id = res.data.id;
            vm.id = res.data.id;
            vm.autoCompleteCustomer.keyColumnId = null;
            if (vm.frmSalesOrderDetails) {
              vm.frmSalesOrderDetails.$setPristine();
            }
            if (vm.salesOrderDetForm) {
              vm.salesOrderDetForm.$setPristine();
            }
            vm.salesOrderDetails(vm.id);
            if ($scope.$parent) {
              $scope.$parent.vm.salesOrderID = vm.id;
            }
            $scope.$emit('SalesOrderAutocomplete');
            $state.go(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, {
              sID: vm.id
            }, {}, { reload: true });
            vm.isFocus = false;
            $timeout(() => {
              vm.isFocus = true;
            });
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    const updateSalesOrder = (salesorderInfo) => {
      vm.cgBusyLoading = SalesOrderFactory.salesorder().update({
        id: vm.salesorder.id
      }, salesorderInfo).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.skiptKitError) { // For parallel entry confirmation of skiptkit
          const kitAllocationConfirmation = response.errors.data.skipKitConfirmationAndError;
          const confirmation = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REMOVE_KIT_ALLOCATION_SAVE_CONFIRMATION),
            skipKitList: kitAllocationConfirmation,
            isConfirmation: true
          };
          DialogFactory.dialogService(
            CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_CONTROLLER,
            CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_VIEW,
            event,
            confirmation).then(() => {
              vm.saveDisable = false;
            }, (data) => {
              if (data) {
                _.each(salesorderInfo.saleDet, (item) => {
                  if (item.isSkipKitCreation) {
                    item.kitRemoveConfirmation = true;
                  }
                });
                updateSalesOrder(salesorderInfo);
              }
            }, (error) => BaseService.getErrorLog(error));
        }
        else if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.kitHaveWorkorderOrRelease && response.errors.data.kitHaveWorkorderOrRelease.length > 0) {
          const listOfPID = _.map(response.errors.data.kitHaveWorkorderOrRelease, (data) => _.find(response.errors.data.salesdetail, (item) => item.id === data));
          const pidString = _.map(listOfPID, (data) => data.componentAssembly.PIDCode).join(', ');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_REMOVE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, pidString, _.map(listOfPID, 'lineID').join(', '));
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model);
        }
        else {
          vm.isOpen = false;
          if (vm.frmSalesOrderDetails) {
            vm.frmSalesOrderDetails.$setPristine();
          }
          if (vm.salesOrderDetForm) {
            vm.salesOrderDetForm.$setPristine();
          }
          vm.autoCompleteCustomer.keyColumnId = null;
          vm.pagingInfo = null;
          vm.isFocus = false;
          vm.isChanged = false;
          vm.resetDetail(true);
          vm.IsEdit = false;
          vm.salesOrderDetails(vm.id);
          vm.saveDisable = false;
          vm.isFocus = true;
        }
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    // open addEdit Addresses popup
    vm.addEditAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.billingAddress = callBackAddress;
        vm.salesorder.billingAddressID = vm.billingAddress.id;
        setBillToAddrContDetForApplied(callBackAddress);
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };
    // open addEdit Addresses popup
    vm.addEditShipAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.shippingAddress = callBackAddress;
        vm.salesorder.shippingAddressID = vm.shippingAddress.id;
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
        setShipToAddrContDetForApplied(callBackAddress);
      }
    };
    // open addEdit Addresses popup
    vm.addEditMarkAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.intermediateAddress = callBackAddress;
        vm.salesorder.intermediateShipmentId = vm.intermediateAddress.id;
        setMarkToAddrContDetForApplied(callBackAddress, false);
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };
    // open select contact person  list
    vm.selectMainContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setMainContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // set contact person details in current scope modal
    const setMainContPersonDetAfterApply = (callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.contactpersondetail = callBackContactPerson;
        vm.viewCustMainContactOtherDet.alreadySelectedPersonId = vm.contactpersondetail.personId;
        vm.viewCustMainContactOtherDet.selectedContactPerson = vm.contactpersondetail;
        vm.salesorder.contactPersonID = vm.contactpersondetail.personId;
        vm.custPersonViewActionBtnDet.Update.isDisable = vm.custPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.contactpersondetail) ? false : true;
        vm.custPersonViewActionBtnDet.ApplyNew.isDisable = vm.custPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
        // Static code to enable save button
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };
    // open select contact person  list
    vm.selectContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // open select contact person  list
    vm.selectShipContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setShipContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // open select contact person  list
    vm.selectMarkContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setMarkContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // open addEdit Addresses popup
    vm.selectAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        setBillToAddrContDetForApplied(callBackAddress);
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };

    // open addEdit Addresses popup
    vm.selectShipToAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        setShipToAddrContDetForApplied(callBackAddress);
        if (!vm.id && vm.shippingAddress && vm.shippingAddress.defaultIntermediateAddressID) {
          // mark for address
          const defaultMarkForAddrDet = _.find(vm.intermediateAddressList, (addrItem) => addrItem.id === vm.shippingAddress.defaultIntermediateAddressID);
          if (defaultMarkForAddrDet) {
            setMarkToAddrContDetForApplied(defaultMarkForAddrDet, true);
          }
        }
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };

    // open addEdit Addresses popup
    vm.selectMarkToAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        setMarkToAddrContDetForApplied(callBackAddress, false);
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };

    // Open add/edit contact persopn popup
    vm.addEditContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // Open add/edit contact persopn popup
    vm.addEditShipContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setShipContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // Open add/edit contact persopn popup
    vm.addEditMarkContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setMarkContPersonDetAfterApply(callBackContactPerson);
      }
    };
    // set contact person details in current scope modal
    const setContPersonDetAfterApply = (callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedContactPerson = callBackContactPerson;
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
        vm.salesorder.billingContactPersonID = vm.selectedContactPerson.personId;
        vm.salesorder.billingContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
        vm.contPersonViewActionBtnDet.Update.isDisable = vm.contPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.selectedContactPerson) ? false : true;
        vm.contPersonViewActionBtnDet.ApplyNew.isDisable = vm.contPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
        // Static code to enable save button
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };
    // set contact person details in current scope modal
    const setShipContPersonDetAfterApply = (callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedShipContactPerson = callBackContactPerson;
        vm.viewShipCustAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
        vm.salesorder.shippingContactPersonID = vm.selectedShipContactPerson.personId;
        vm.salesorder.shippingContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
        vm.contShipPersonViewActionBtnDet.Update.isDisable = vm.contShipPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.selectedShipContactPerson) ? false : true;
        vm.contShipPersonViewActionBtnDet.ApplyNew.isDisable = vm.contShipPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
        // Static code to enable save button
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };
    // set contact person details in current scope modal
    const setMarkContPersonDetAfterApply = (callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedMarkContactPerson = callBackContactPerson;
        vm.viewMarkCustAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkContactPerson.personId;
        vm.salesorder.intermediateContactPersonID = vm.selectedMarkContactPerson.personId;
        vm.salesorder.intermediateContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
        vm.contMarkPersonViewActionBtnDet.Update.isDisable = vm.contMarkPersonViewActionBtnDet.Delete.isDisable = (!vm.isDisable && vm.selectedMarkContactPerson) ? false : true;
        vm.contMarkPersonViewActionBtnDet.ApplyNew.isDisable = vm.contShipPersonViewActionBtnDet.AddNew.isDisable = (!vm.isDisable) ? false : true;
        // Static code to enable save button
        vm.frmSalesOrderDetails.$$controls[0].$setDirty();
      }
    };
    /*
     * Author :  Champak Chaudhary
     * Purpose : Ui grid for parent
     */
    vm.isHideDelete = true;
    vm.isSalesDelete = true;

    vm.getFooterTotal = (isother) => {
      let sum;
      if (isother) {
        sum = (_.sumBy(vm.sourceData, (data) => data.totalextPrice)) || 0;
      } else {
        sum = _.sumBy(vm.sourceData, (data) => data.extPrice);
      }
      sum = $filter('currency')(sum);
      return sum;
    };
    // get price footer detail
    vm.getPriceFooterTotal = () => {
      const display = stringFormat('Total:');
      return display;
    };
    vm.CheckStepAndAction = (isSave, event) => {
      if (isSave) {
        vm.saveDisable = true;
        if (BaseService.focusRequiredField(vm.frmSalesOrderDetails)) {
          vm.saveDisable = false;
          return;
        }
      }
      let ischanged = _.clone(vm.isChanged);
      if (!vm.isChanged) {
        ischanged = BaseService.checkFormDirty(vm.frmSalesOrderDetails, vm.checkDirtyObject);
        if (!ischanged) {
          ischanged = BaseService.checkFormDirty(vm.salesOrderDetForm, null);
        }
      }
      showWithoutSavingAlertforNextPrevious(isSave, ischanged, event);
    };
    /* Show save alert popup when performing next and previous*/
    function showWithoutSavingAlertforNextPrevious(isSave, isChanged, event) {
      if (isSave) {
        if (parseInt(vm.salesorder.status)) {
          vm.checkValidation(true);
          if (!vm.ischeckValidation) {
            checkSalesOrderPublishValidation(event, vm.salesorder.status, true);
          }
        } else {
          vm.saveSalesOrder(true);
          vm.frmSalesOrderDetails.$setPristine();
        }
      }
      else {
        if (isChanged) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_RECORD,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.frmSalesOrderDetails.$setPristine();
              vm.salesOrderDetails($stateParams.sID);
              vm.sourceData = vm.selsOrderDatacopy;
              vm.loadData(vm.pagingInfo);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    }
    //change to edit mode on click
    vm.salesDetailRelease = {};

    function initPageInfo() {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['lineID', 'ASC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[6].PageName
      };
    };

    function grid() {
      initPageInfo();
      vm.gridOptions = {
        showColumnFooter: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enablePaging: false,
        enableExpandableRowHeader: true,
        expandableRowTemplate: TRANSACTION.TRANSACTION_EXPANDABLEJS,
        expandableRowHeight: 235,
        expandableRowScope: $scope,
        enableCellEditOnFocus: false,
        enableColumnMenus: false,
        exporterCsvFilename: 'Sales Order Detail.csv',
        exporterMenuCsv: true,
        exporterSuppressColumns: ['isadd', 'remove']
      };
      vm.sourceData = [];
      if (!vm.IsEdit) {
        vm.gridOptions.data = vm.sourceData;
      }
      else if (vm.IsEdit && vm.saleDet && vm.saleDet.length > 0) {
        vm.sourceData = _.clone(vm.saleDet);
      }
      if (vm.sourceData.length > 0) {
        vm.sourceData[vm.sourceData.length - 1].isadd = true;
        vm.sourceData[vm.sourceData.length - 1].remove = true;
      }
      vm.sortData = [];
      vm.sourceDataCopy = [];
      vm.loadData = (pagingInfo) => {
        if (pagingInfo.isReset) {
          const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
          vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
            vm.holdunHoldList = response[1].data;
            vm.salesOrderDetailByID(response[0]);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (vm.sourceData) {
            vm.sourceData = _.orderBy(vm.sourceData, ['lineID'], ['ASC']);
          }
          if (pagingInfo.SortColumns.length > 0) {
            const column = [];
            const sortBy = [];
            _.each(pagingInfo.SortColumns, (item) => {
              column.push(item[0]);
              sortBy.push(item[1]);
            });
            vm.sourceData = _.orderBy(vm.sourceData, column, _.uniq(sortBy));
            vm.sortData = _.clone(vm.sourceData);
          }
          else {
            vm.sourceData = vm.sortData;
          }
          if (pagingInfo.SearchColumns.length > 0) {
            if (vm.search) {
              vm.emptyState = null;
              vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
            }
            if (!vm.search) {
              vm.sourceDataCopy = _.clone(vm.sourceData);
            }
            vm.search = true;
            _.each(pagingInfo.SearchColumns, (item) => {
              vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
            });
            if (vm.sourceData.length === 0) {
              vm.emptyState = 0;
            }
          }
          else {
            vm.emptyState = null;
            if (vm.search) {
              vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
              vm.search = false;
            }
          }
          vm.totalSourceDataCount = vm.sourceData.length;
          vm.currentdata = vm.totalSourceDataCount;
          vm.selsOrderDatacopy = _.clone(vm.sourceData);
          $timeout(() => {
            vm.resetSourceGrid();
            vm.getSalesOrderPriceDetails(); // to show detail of total cost in header section
            $timeout(() => {
              vm.expandableJS();
              if (vm.gridOptions && vm.gridOptions.gridApi) {
                if ($stateParams.partID) {
                  const searchObj = {
                    partID: parseInt($stateParams.partID),
                    searchText: null,
                    pisFromSO: true,
                    refSoID: null
                  };
                  getcomponentAssemblyList(searchObj);
                }
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }, _configTimeout);
          }, true);
        }
      };
      vm.sourceHeader = [
        {
          field: 'isadd',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '380',
          cellTemplate: '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="grid.appScope.$parent.vm.isDisable || row.entity.isCancle">' +
            '<md-icon role="img" md-font-icon="icon-pencil"></md-icon>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="!grid.appScope.$parent.vm.isDisable && !row.entity.isCancle" ng-click="grid.appScope.$parent.vm.EditSalesMasterDetail(row.entity)">' +
            '<md-icon role="img" md-font-icon="icon-pencil"></md-icon><md-tooltip md-direction="top">Update</md-tooltip>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn"  ng-click="grid.appScope.$parent.vm.EditSalesMasterDetail(row.entity,true)">' +
            '<md-icon role="img" md-font-icon="icon-eye"></md-icon><md-tooltip md-direction="top">View</md-tooltip>' +
            '</md-button>' +
            '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="row.entity.isSkipKitCreation||row.entity.isCancle || !row.entity.id || row.entity.partCategory!==grid.appScope.$parent.vm.PartCategory.SubAssembly">' +
            '<md-icon role="img" md-font-icon="icons-plan-kit"></md-icon>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="row.entity.id && row.entity.partCategory===grid.appScope.$parent.vm.PartCategory.SubAssembly && !row.entity.isSkipKitCreation && !row.entity.isCancle"  ng-click="grid.appScope.$parent.vm.goToShipPlanDetails(row.entity)">' +
            '<md-icon role="img" md-font-icon="icons-plan-kit"></md-icon><md-tooltip md-direction="top">Plan Kit</md-tooltip>' +
            '</md-button>' +
            '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="!row.entity.id || row.entity.quoteFrom === grid.appScope.$parent.vm.salesCommissionFrom.NA.id || row.entity.partType===grid.appScope.$parent.vm.partTypes.Other || row.entity.isCancle">' +
            '<md-icon role="img" md-font-icon="icons-sales-commission"></md-icon>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="row.entity.id && row.entity.quoteFrom !== grid.appScope.$parent.vm.salesCommissionFrom.NA.id && row.entity.partType!==grid.appScope.$parent.vm.partTypes.Other && !row.entity.isCancle" ng-click="grid.appScope.$parent.vm.goToSalesCommission(row.entity,$event)">' +
            '<md-icon role="img" md-font-icon="icons-sales-commission"></md-icon><md-tooltip md-direction="top">Sales Commission</md-tooltip>' +
            '</md-button>' +
            '<md-button ng-disabled="grid.appScope.$parent.vm.isDisabledAddInvoice"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="row.entity.partType===grid.appScope.$parent.vm.partTypes.SubAssembly"  ng-click="grid.appScope.$parent.vm.ViewAssemblyStockStatus(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="icons-view-assembly-stock"></md-icon><md-tooltip md-direction="top">View Assembly Stock Details</md-tooltip>' +
            '</md-button>' +
            '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="row.entity.partType!==grid.appScope.$parent.vm.partTypes.SubAssembly">' +
            '<md-icon role="img" md-font-icon="icons-view-assembly-stock"></md-icon>' +
            '</md-button>' +
            '<md-button ng-disabled="row.entity.refSODetID" ng-style="(row.entity.refSODetID) && {\'opacity\':\'0.3\',\'cursor\': \'not-allowed\'}"  ng-class="{\'other-charges-icon-color\':row.entity.SalesOtherDetail.length>0 && row.entity.salesOrderDetStatus !==2,\'icon-border-lightblue\':grid.appScope.$parent.vm.checkInlineOtherCharges(row.entity)}"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-click="grid.appScope.$parent.vm.gotoSalesOrderOtherCharges(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="t-icons-other-charges"></md-icon><md-tooltip md-direction="top">View Other Charges</md-tooltip>' +
            '</md-button>' +
            '<md-button ng-class="{\'release-line-bg\':row.entity.SalesDetail.length>1 || grid.appScope.$parent.vm.checkSumAndColor(row.entity),\'light-green-background-color\':row.entity.salesOrderDetStatus === 2}"   class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="row.entity.partType!==grid.appScope.$parent.vm.partTypes.Other && !row.entity.isCancle" ng-click="grid.appScope.$parent.vm.openReleaseLinePopup(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="icons-release-line"></md-icon><md-tooltip md-direction="top">Release Detail</md-tooltip>' +
            '</md-button>' +
            '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="row.entity.partType===grid.appScope.$parent.vm.partTypes.Other || row.entity.isCancle">' +
            '<md-icon role="img" md-font-icon="icons-release-line"></md-icon>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="grid.appScope.$parent.vm.salesorder.status && row.entity.partType!==grid.appScope.$parent.vm.partTypes.Other && !row.entity.isCancle" ng-click="grid.appScope.$parent.vm.haltResumeSalesOrder(row.entity, $event)">' +
            '<img role="img"  ng-src="{{row.entity.salesOrderHaltImage}}" /><md-tooltip md-direction="top">{{row.entity.salesOrderHalt}}</md-tooltip>' +
            '</md-button>' +
            '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="row.entity.partType===grid.appScope.$parent.vm.partTypes.Other || row.entity.isCancle || !grid.appScope.$parent.vm.salesorder.status">' +
            '<img role="img"  ng-src="{{row.entity.salesOrderHaltImage}}" />' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="row.entity.partType!==grid.appScope.$parent.vm.partTypes.Other && !row.entity.isCancle" ng-click="grid.appScope.$parent.vm.haltResumeHistoryList(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="icons-halt-resume-history"></md-icon><md-tooltip md-direction="top">Halt/Resume History</md-tooltip>' +
            '</md-button>' +
            '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-if="row.entity.partType===grid.appScope.$parent.vm.partTypes.Other || row.entity.isCancle">' +
            '<md-icon role="img" md-font-icon="icons-halt-resume-history"></md-icon>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-style="!(row.entity.id && row.entity.quoteFrom !== grid.appScope.$parent.vm.salesCommissionFrom.NA.id && row.entity.partType!==grid.appScope.$parent.vm.partTypes.Other) && {\'opacity\':\'0.3\',\'cursor\': \'not-allowed\'}" ng-disabled="!(row.entity.id && row.entity.quoteFrom !== grid.appScope.$parent.vm.salesCommissionFrom.NA.id && row.entity.partType!==grid.appScope.$parent.vm.partTypes.Other)" ng-click="grid.appScope.$parent.vm.exportSalesCommission(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="t-icons-sales-commission export-icon"></md-icon><md-tooltip md-direction="top">Export Sales Commission</md-tooltip>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-class="{\'release-line-bg\':row.entity.isBlanketPOMapped }" ng-style="(grid.appScope.$parent.vm.BlanketPODetails.LINKBLANKETPO !== grid.appScope.$parent.vm.salesorder.blanketPOOption || grid.appScope.$parent.vm.salesorder.status==0) && {\'opacity\':\'0.3\',\'cursor\': \'not-allowed\'}" ng-disabled="(grid.appScope.$parent.vm.BlanketPODetails.LINKBLANKETPO !== grid.appScope.$parent.vm.salesorder.blanketPOOption || grid.appScope.$parent.vm.salesorder.status==0)" ng-click="grid.appScope.$parent.vm.openLinkedBlanketPO(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="t-icons-link-future-po"></md-icon><md-tooltip md-direction="top">Linked PO(s)</md-tooltip>' +
            '</md-button>' +
            '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-style="(grid.appScope.$parent.vm.BlanketPODetails.LINKBLANKETPO !== grid.appScope.$parent.vm.salesorder.blanketPOOption || grid.appScope.$parent.vm.salesorder.status==0) && {\'opacity\':\'0.3\',\'cursor\': \'not-allowed\'}" ng-disabled="(grid.appScope.$parent.vm.BlanketPODetails.LINKBLANKETPO !== grid.appScope.$parent.vm.salesorder.blanketPOOption || grid.appScope.$parent.vm.salesorder.status==0)" ng-click="grid.appScope.$parent.vm.addNewBlanketPO(row.entity, $event)">' +
            '<md-icon role="img" md-font-icon="t-icons-future-po add-icon"></md-icon><md-tooltip md-direction="top">Add PO</md-tooltip>' +
            '</md-button>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          maxWidth: '420'
        },
        {
          field: 'lineID',
          displayName: 'SO Line#',
          width: '95',
          cellTemplate: '<div class="ui-grid-cell-contents text-right" ng-disabled="row.entity.isdisable"><span><b>{{COL_FIELD}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          maxWidth: '95'
        },
        {
          field: 'custPOLineNumber',
          displayName: 'PO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents text-right">{{COL_FIELD}}<md-icon ng-if="row.entity.refSODetID" md-font-icon="icon-link-variant"class="s18 margin-bottom-2 color-lightblue"></md-icon><span ng-if="row.entity.refSODetID" class="label-box label-warning ph-4 line-height-12"><span ng-click="grid.appScope.$parent.vm.openOtherCharges(row.entity.refSODetID,$event)" class="underline cursor-pointer">{{grid.appScope.$parent.vm.getCustPONumber(row.entity.refSODetID)}}</a></span></div>',
          width: 110,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'custOrgPOLineNumber',
          displayName: 'Orig. PO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: 110,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'mfrName',
          displayName: vm.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToManufacturerDetail(row.entity.mfrID);$event.preventDefault();">{{row.entity.mfrName}}</a>\
                            <copy-text label="\'MFR\'" text="row.entity.mfrName" ng-if="row.entity.mfrName"></copy-text></div>',
          width: '300',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '350'
        },
        {
          field: 'mfgPN',
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}"  title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">\
                                            <common-pid-code-label-link  ng-if="row.entity.PIDCode" component-id="row.entity.partID"\
                                                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                                            value="COL_FIELD"\
                                                            is-assembly="(row.entity.partType==grid.appScope.$parent.vm.partTypes.Other || row.entity.isCustom ?true:false)"\
                                                            is-custom-part="(row.entity.partType==grid.appScope.$parent.vm.partTypes.Other || row.entity.isCustom ?true:false)" \
                                                            rohs-icon="row.entity.rohsIcon"\
                                                            is-copy="row.entity.partID ? true : false"\
                                                            rohs-status="row.entity.rohsText"\
                                                            ></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'PIDCode',
          displayName: 'Assy ID/PID',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}"  ng-disabled="row.entity.isdisable || row.entity.isCancle">\
            <common-pid-code-label-link  ng-if= "row.entity.PIDCode" component-id="row.entity.partID"\
      label="\'Assy ID/ PID\'"\
      value="COL_FIELD"\
      is-assembly="true"\
      is-custom-part="row.entity.isCustom" \
      rohs-icon="row.entity.rohsIcon"\
      is-copy="row.entity.partID ? true : false"\
      rohs-status="row.entity.rohsText"></common-pid-code-label-link >\
    </div > ',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
          maxWidth: '350',
          cellTooltip: true,
          validators: { required: true }
        },
        {
          field: 'nickName',
          displayName: 'Nickname',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'partDescription',
          displayName: 'Part Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD}}\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
          width: '250',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'unitName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD}}</div>',
          width: '80',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '100'
        },
        {
          field: 'isHotJobValue',
          displayName: 'Rush Job',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isHotJob == true, \
                                                            \'label-warning\':row.entity.isHotJob == false}"> \
                                                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.KeywordStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          width: 100
        },
        {
          field: 'originalPOQty',
          displayName: 'Orig. PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '90',
          type: 'number',
          maxWidth: '150',
          visible: vm.salesorder.isLegacyPO
        },
        {
          field: 'qty',
          displayName: vm.salesorder.isLegacyPO ? 'Open PO Qty' : 'PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '90',
          type: 'number',
          validators: { required: true },
          maxWidth: '150'
        },
        {
          field: 'price',
          displayName: 'Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>',
          width: '100',
          maxWidth: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getPriceFooterTotal()}}</div>'
        },
        {
          field: 'extPrice',
          displayName: 'Ext. Price ($)',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD | numberWithoutDecimal}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotal()}}</div>',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          width: '150',
          maxWidth: '175'
        },
        {
          field: 'otherCharges',
          displayName: 'Total Other Charges Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{(COL_FIELD || 0) | amount }}</div>',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          width: '120',
          maxWidth: '175'
        },
        {
          field: 'totalextPrice',
          displayName: 'Total Ext. Price ($)',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD | numberWithoutDecimal}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotal(true)}}</div>',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          width: '150',
          maxWidth: '175'
        },
        {
          field: 'mrpQty',
          displayName: 'MRP Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '70',
          type: 'number',
          maxWidth: '150',
          validators: { required: true }
        },
        {
          field: 'kitQty',
          displayName: 'Kit Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '80',
          type: 'number',
          maxWidth: '150',
          validators: { required: true }
        },
        {
          field: 'shippedQty',
          headerCellTemplate: '<div class="ui-grid-cell-contents text-left">Shipped Qty</div>',
          width: '100',
          type: 'number',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}"><span ng-class="{\'underline cursor-pointer\':row.entity.shippedQty && !row.entity.refShippingLineID} " ng-click="row.entity.shippedQty && !row.entity.refShippingLineID?grid.appScope.$parent.vm.openBifurcationQtyPopup(row.entity,$event):null">{{COL_FIELD | numberWithoutDecimal}}</span></div>'
        },
        {
          field: 'openQty',
          headerCellTemplate: '<div class="ui-grid-cell-contents text-left">Open Qty</div>',
          width: '100',
          type: 'number',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | numberWithoutDecimal}}</div>'
        },
        {
          field: 'materialTentitiveDocDate',
          displayName: 'Customer Consigned Material Promised Dock Date',
          width: '150',
          type: 'date',
          enableFiltering: false,
          maxWidth: '350',
          enableSorting: false,
          cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
          validators: { compareDate: '' },
          editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker datepicker-options="grid.appScope.$parent.vm.datePickerValueoptions" entity-details="row.entity" field-details="col.colDef.field"  ng-class="\'colt\' + col.uid"></div></form></div>',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-disabled="row.entity.isCancle" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}"  title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.$parent.vm.DefaultDateFormat }}</div>'
        },
        {
          field: 'prcNumberofWeek',
          displayName: 'Build Weeks',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-disabled="row.entity.isCancle">{{COL_FIELD}}</div>',
          width: '70',
          maxWidth: '180'
        },
        {
          field: 'materialDueDate',
          displayName: 'Purchased Material Dock Date',
          width: '120',
          type: 'date',
          enableFiltering: false,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  ng-disabled="row.entity.isCancle" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker datepicker-options="grid.appScope.$parent.vm.datePickerValueoptions" entity-details="row.entity" field-details="col.colDef.field" ng-class="\'colt\' + col.uid"></div></form></div>',
          enableSorting: false,
          cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
          validators: { compareDate: '' },
          maxWidth: '225'
        },
        {
          field: 'requestedBPOStartDate',
          displayName: 'Requested Blanket PO Start Date',
          width: '130',
          type: 'date',
          enableFiltering: false,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableSorting: false,
          maxWidth: '250'
        },
        {
          field: 'blanketPOEndDate',
          displayName: 'Blanket PO End Date',
          width: '110',
          type: 'date',
          enableFiltering: false,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableSorting: false,
          maxWidth: '250'
        },
        {
          field: 'remark',
          displayName: 'Line Shipping Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.remark && row.entity.remark !== \'-\'" ng-click="grid.appScope.$parent.vm.showRemark(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          editableCellTemplate: '<div class="grid-edit-input"><form name="inputForm"><input type="text" ng-model="row.entity.remark"  maxlength="255"   ui-grid-editor  style="width:100%;text-align:left;border:none;margin-left:-10px"/></form></div>',
          width: '175',
          enableFiltering: false,
          maxWidth: '250'
        },
        {
          field: 'internalComment',
          displayName: 'Line Internal Notes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap blue">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalComment && row.entity.internalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showInternalComment(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '175',
          enableFiltering: false,
          maxWidth: '250'
        },
        {
          field: 'tentativeBuild',
          displayName: 'Tentative # of Builds',
          type: 'number',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{(COL_FIELD || 1) | numberWithoutDecimal}}</div>',
          width: '90',
          enableFiltering: false,
          enableSorting: false,
          validators: { required: true },
          maxWidth: '210'
        },
        {
          field: 'shippingQty',
          displayName: 'Total Releases',
          type: 'number',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{(COL_FIELD || 1) | numberWithoutDecimal}}</div>',
          width: '80',
          enableFiltering: false,
          enableSorting: false,
          validators: { required: true },
          maxWidth: '160'
        },
        {
          field: 'cancleReason',
          displayName: 'Cancellation Reason',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '175',
          enableCellEdit: false
        },
        {
          field: 'workOrders',
          displayName: 'WO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important"><span ng-repeat="workorder in row.entity.SalesOrderDetails"><a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.gotoWorkOrder(workorder);" tabindex="-1">{{workorder.WoSalesOrderDetails.woNumber}}</a>{{row.entity.SalesOrderDetails[row.entity.SalesOrderDetails.length-1]===workorder?\'\':\' , \'}}</span></div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'isSkipKitCreation',
          displayName: vm.LabelConstant.SalesOrder.DoNotCreateKit,
          cellTemplate: '<div class="ui-grid-cell-contents text-center"><md-checkbox ng-model="row.entity.isSkipKitCreation" ng-disabled="true"/></div>',
          width: 170,
          enableCellEdit: false,
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false,
          maxWidth: '300'
        },
        {
          field: 'kitNumber',
          displayName: 'Kit Number',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.kitNumber">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goTokitList(row.entity);$event.preventDefault();">{{row.entity.kitNumber}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.kitNumber">\
                                        {{row.entity.kitNumber}}\
                                    </span>\
                       <copy-text label="\'Kit Number\'" text="row.entity.kitNumber" ng-if="row.entity.kitNumber"></copy-text></div>',
          width: 200,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'salesCommissionName',
          displayName: 'Sales Commission To',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 200,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'quoteFromText',
          displayName: 'Quote From',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: 200
        },
        {
          field: 'refRFQGroupID',
          displayName: 'Quote Group',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 90,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'quoteNumber',
          displayName: 'Quote#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-center"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 120,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'qtyTurnTime',
          displayName: 'Quote Qty Turn Time',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 200,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'salesOrderDetStatusConvertedValue',
          displayName: 'Status',
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '<span class="label-box" ng-class="{\'label-warning\':!row.entity.isCancle && row.entity.salesOrderDetStatus === 1, \'label-success\':!row.entity.isCancle && row.entity.salesOrderDetStatus === 2 ,\'label-danger\' :row.entity.isCancle }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '<span class="ml-5">'
            + '<img class="wo-stop-image wo-stop-image-margin" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonPO}}</md-tooltip>'
            + '</span>'
            + '</div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'completeStatusReason',
          displayName: 'Reason for Completed Status',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'salesAssy',
          displayName: 'Selected Assy ID/PID',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'salesRelease',
          displayName: 'Release Line#',
          width: '180',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'frequencyName',
          displayName: 'Charge Frequency',
          width: '110',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'frequencyTypeName',
          displayName: 'Charge Frequency Type',
          width: '110',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'releaseLevelComment',
          displayName: 'Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releaseLevelComment && row.entity.releaseLevelComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showReleaseLevelComment(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '175',
          enableFiltering: false,
          maxWidth: '250'
        },
        {
          field: 'refBlanketPONumber',
          displayName: 'Ref. Blanket PO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.refBlanketPONumber">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrder(row.entity.refBlanketPOSOID);$event.preventDefault();">{{row.entity.refBlanketPONumber}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.refBlanketPONumber">\
                                        {{row.entity.refBlanketPONumber}}\
                                    </span>\
                       <copy-text label="\'Ref. Blanket PO#\'" text="row.entity.refBlanketPONumber" ng-if="row.entity.refBlanketPONumber"></copy-text></div>',
          width: 200,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'modifyDate',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        }, {
          field: 'soModifiedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
        }, {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
        }, {
          field: 'createdDate',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        },
        {
          field: 'soCreatedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BY
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
        },
        {
          field: 'remove',
          cellClass: 'layout-align-center-center',
          displayName: 'Delete',
          width: '120',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          exporterSuppressExport: true,
          maxWidth: '130'
        }
      ];
      resetSalesOrderDetForm();
    }

    // check sum and color for the release line
    vm.checkSumAndColor = (objRelease) => {
      const sumTotal = _.sumBy((objRelease.SalesDetail), (o) => parseInt(o.qty));
      if (objRelease.SalesDetail.length > 0 && objRelease.qty > sumTotal) {
        return true;
      }
      return false;
    };
    // get cust po number
    vm.getCustPONumber = (id) => {
      const objData = _.find(vm.sourceData, (item) => item.id === id);
      if (objData) {
        return objData.custPOLineNumber;
      }
      return '';
    };
    // check inline other charges
    vm.checkInlineOtherCharges = (objOther) => {
      const other = _.find(vm.sourceData, (item) => item.refSODetID === objOther.id);
      if (other) {
        return true;
      }
      return false;
    };
    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectStatus);
      } else {
        _.map(vm.sourceData, unselectStatus);
      }
    };
    const selectStatus = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectStatus = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setPartStatusRemove = (row) => {
      const totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };
    //open assy stock popup
    vm.openAssyStock = (ev) => {
      if (vm.salesDetail) {
        const data = vm.salesDetail;
        vm.ViewAssemblyStockStatus(data, ev);
      }
    };
    const saveMasterSalesDetail = (ev) => {
      vm.checkCustomerPOLine();
      if (!vm.iscustPO) {
        if (vm.salesorder.linkToBlanketPO && !vm.blanketPOSDetID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKETPO_NOT_MAPPED_WITH_FPO);
          messageContent.message = stringFormat(messageContent.message, vm.salesDetail.custPOLineNumber, vm.salesorder.poNumber);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(model).then(() => { setFocus('qty'); vm.isSaveButtonDisable = false; });
        } else {
          checkBlanketPOAssign(ev);
        }
      } else { vm.isSaveButtonDisable = false; }
    };
    // Check for BPO assigned or not for link to blanket PO
    const checkBlanketPOAssign = (ev) => {
      vm.checkDirty = true;
      vm.copySalesDetail = null;
      vm.copysalesDetailRelease = null;
      vm.addNewParentRow(_.clone(vm.salesDetail), false, ev);
    };

    vm.goToKitDetail = (data) => {
      BaseService.goToKitDetail(data.id);
    };

    vm.addSalesDetail = (btnCategory, ev) => {
      vm.isReset = false;
      vm.isSaveButtonDisable = true;
      vm.detailSaveBtnCategory = btnCategory;
      if (BaseService.focusRequiredField(vm.salesOrderDetForm)) {
        vm.isSaveButtonDisable = false;
        if (vm.detailSaveBtnCategory === vm.navDirection.NEW) {
          vm.resetDetail(false, true);
        } else if (vm.detailSaveBtnCategory !== vm.navDirection.CURR) {
          vm.navigateDetailRecords(vm.detailSaveBtnCategory, false);
        }
        if (vm.salesDetail.id) {
          setFocus('btnAddCurrDet');
        } else {
          setFocusByName(vm.autocompleteAssy.inputName);
        }
        return;
      }
      if (vm.salesDetail && vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id && (!vm.salesDetail.refRFQQtyTurnTimeID)) {
        $scope.$broadcast(vm.autocompleteQtyTurnTime.inputName + 'searchText', null);
        vm.isSaveButtonDisable = false;
        return;
      }
      if (vm.salesDetail.isLine === 1 && vm.salesDetail.id && vm.salesDetail.isSkipKitCreation) {
        const query = {
          id: vm.salesDetail.id,
          isSkipKitCreation: true
        };
        const dynamicURL = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_KIT_ALLOCATION_ROUTE.replace(':id', '{0}').replace(':partId', '{1}').replace(':mountingTypeId', '{2}');
        const kitDetailURL = stringFormat(dynamicURL, vm.salesDetail.id, vm.salesDetail.partID, '');
        vm.cgBusyLoading = SalesOrderFactory.salesOrderDetailSkipKitValidation().query(query).$promise.then((response) => {
          if (response && response.data && response.data.KitReleaseCount && response.data.KitReleaseCount.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REMOVE_KIT_NOT_ALLOW_FOR_RELEASED_KIT);
            messageContent.message = stringFormat(messageContent.message, stringFormat(`<a href='{0}' target='_blank' class='cm-text-decoration underline cursor-pointer'>${vm.salesDetail.kitNumber}</a>`, kitDetailURL));
            const model = {
              messageContent: messageContent,
              multiple: false
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.salesDetail.isSkipKitCreation = false;
              vm.isSaveButtonDisable = false;
              setFocus('isSkipKitCreation');
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (response && response.data && response.data.allocationCount && response.data.allocationCount.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REMOVE_KIT_ALLOCATION_UPDATE_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, stringFormat(`<a href='{0}' target='_blank' class='cm-text-decoration underline cursor-pointer'>${vm.salesDetail.kitNumber}</a>`, kitDetailURL));
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
              multiple: true
            };
            DialogFactory.messageConfirmDialog(model).then(() => {
              vm.salesDetail.kitRemoveConfirmation = true;
              addSalesOrderDetails(ev);
            }, () => {
              vm.salesDetail.kitRemoveConfirmation = false;
              vm.salesDetail.isSkipKitCreation = false;
              vm.isSaveButtonDisable = false;
              setFocus('isSkipKitCreation');
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            addSalesOrderDetails(ev);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        addSalesOrderDetails(ev);
      }
    };

    const checkKitPlanningValidation = (isUpdateKitMrp) => {
      const saveObj = {
        id: vm.salesDetail.id,
        mrpQty: vm.salesDetail.mrpQty,
        poQty: vm.salesDetail.qty,
        kitQty: vm.salesDetail.kitQty,
        partID: vm.salesDetail.partID,
        PIDCode: vm.salesDetail.PIDCode,
        kiNumber: vm.salesDetail.kitNumber,
        isUpdateKitMrp: isUpdateKitMrp || false,
        fromPageName: CORE.PageName.sales_order
      };
      return SalesOrderFactory.updateKitMrpQty().query(saveObj).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (response.data) {
            const errorResData = response.data;
            if (response.data.messageTypeCode === 1) {
              const model = {
                messageContent: errorResData.messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  setFocus('kitQty');
                  return false;
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (response.data.messageTypeCode === 2) {
              const model = {
                messageContent: errorResData.messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              return DialogFactory.messageConfirmDialog(model).then(() => {
                checkKitPlanningValidation(true);
                return true;
              }, () => {
                setFocus(vm.salesDetail.kitQtyOld !== vm.salesDetail.kitQty ? 'kitQty' : 'qty');
                return false;
              }).catch((error) => BaseService.getErrorLog(error));
            }
          } else {
            return true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const manageSalesOrderDetails = (ev) => {
      vm.salesDetail.tentativeBuild = vm.salesDetail.tentativeBuild ? vm.salesDetail.tentativeBuild : vm.salesDetail.shippingQty;
      vm.salesDetail.salesOrderDetStatusConvertedValue = CORE.SalesOrderDetStatusText.INPROGRESS;
      vm.salesDetail.salesOrderDetStatus = CORE.SalesOrderDetStatus.INPROGRESS;
      const obj = _.find(vm.sourceData, (item) => (parseFloat(item.price) === parseFloat(vm.salesDetail.price) && parseInt(item.lineID) !== parseInt(vm.salesDetail.lineID))
        && (item.PIDCode === vm.salesDetail.PIDCode && parseInt(item.lineID) !== parseInt(vm.salesDetail.lineID))
        && (parseInt(item.qty) === parseInt(vm.salesDetail.qty) && parseInt(item.lineID) !== parseInt(vm.salesDetail.lineID))
        && (item.custPOLineNumber === vm.salesDetail.custPOLineNumber && parseInt(item.lineID) !== parseInt(vm.salesDetail.lineID))
      );
      if (obj) {
        vm.isSaveButtonDisable = false;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_ASSEMBLY_RECORD);
        messageContent.message = stringFormat(messageContent.message, vm.salesDetail.PIDCode);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else {
        if (vm.salesDetail.id && vm.totalReleaseQty > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.KITQTY_VALIDATION_SO);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          vm.isSaveButtonDisable = false;
          DialogFactory.messageAlertDialog(model);
          return;
        } else if (((vm.salesDetail.requestedDockDate || vm.salesDetail.requestedShipDate) && !vm.salesDetail.promisedShipDate) || (vm.salesDetail.promisedShipDate && !vm.salesDetail.requestedShipDate && !vm.salesDetail.requestedDockDate)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_FIELD_REQUIRED_FOR_FURTHER_PROCESSING);
          messageContent.message = stringFormat(messageContent.message, !vm.salesDetail.promisedShipDate ? stringFormat('Promised Ship Date{0}', vm.salesDetail.isAgreeToShip ? ' (Revised)' : '') : stringFormat('Either Requested Dock Date{0} or Requested Ship Date{0}', vm.salesDetail.isAgreeToShip ? ' (Revised)' : ''));
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          vm.isSaveButtonDisable = false;
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              setFocus(!vm.salesDetail.promisedShipDate ? 'promisedShipDate' : 'requestedDockDate');
            }
          }).catch(() => BaseService.getErrorLog(error));
        } else if ((!vm.salesDetail.id && vm.salesDetail.materialTentitiveDocDate && (vm.salesDetail.requestedDockDate || vm.salesDetail.requestedShipDate) && vm.salesDetail.promisedShipDate) ||
          (vm.salesDetail.id && vm.salesDetail.materialTentitiveDocDate && vm.copySalesDetail && (vm.copySalesDetail.materialTentitiveDocDate !== vm.salesDetail.materialTentitiveDocDate || vm.copySalesDetail.requestedDockDate !== vm.salesDetail.requestedDockDate ||
            vm.copySalesDetail.requestedShipDate !== vm.salesDetail.requestedShipDate || vm.copySalesDetail.promisedShipDate !== vm.salesDetail.promisedShipDate))) {
          if (vm.salesDetail.requestedDockDate && new Date(vm.salesDetail.materialTentitiveDocDate) > new Date(vm.salesDetail.requestedDockDate)) {
            vm.requestedDockDate = true;
          }
          if (vm.salesDetail.requestedShipDate && new Date(vm.salesDetail.materialTentitiveDocDate) > new Date(vm.salesDetail.requestedShipDate)) {
            vm.shipDate = true;
          }
          if (new Date(vm.salesDetail.materialTentitiveDocDate) > new Date(vm.salesDetail.promisedShipDate)) {
            vm.promisedshipDate = true;
          }
          if (vm.promisedshipDate || vm.shipDate || vm.requestedDockDate) {
            let mesage = vm.LabelConstant.SalesOrder.RequestedShipDate;
            if (vm.promisedshipDate && vm.shipDate && vm.requestedDockDate) {
              mesage = stringFormat('{0},{1} and {2}', vm.LabelConstant.SalesOrder.RequestedDockDate, vm.LabelConstant.SalesOrder.RequestedShipDate, vm.LabelConstant.SalesOrder.PromisedShipDate);
            } else if (vm.promisedshipDate && vm.shipDate) {
              mesage = stringFormat('{0} and {1}', vm.LabelConstant.SalesOrder.RequestedShipDate, vm.LabelConstant.SalesOrder.PromisedShipDate);
            } else if (vm.requestedDockDate && vm.promisedshipDate) {
              mesage = stringFormat('{0} and {1}', vm.LabelConstant.SalesOrder.RequestedDockDate, vm.LabelConstant.SalesOrder.PromisedShipDate);
            } else if (vm.requestedDockDate && vm.shipDate) {
              mesage = stringFormat('{0} and {1}', vm.LabelConstant.SalesOrder.RequestedDockDate, vm.LabelConstant.SalesOrder.RequestedShipDate);
            } else if (vm.requestedDockDate) {
              mesage = vm.LabelConstant.SalesOrder.RequestedDockDate;
            } else if (vm.promisedshipDate) {
              mesage = vm.LabelConstant.SalesOrder.PromisedShipDate;
            }
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
            messageContent.message = stringFormat(messageContent.message, mesage);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.promisedshipDate = false; vm.shipDate = false; vm.requestedDockDate = false;
                saveMasterSalesDetail(ev);
              }
            }, () => { setFocus('ccmDate'); vm.requestedDockDate = false; vm.promisedshipDate = false; vm.shipDate = false; vm.isSaveButtonDisable = false; }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.promisedshipDate = false; vm.shipDate = false; vm.requestedDockDate = false;
            saveMasterSalesDetail(ev);
          }
        } else if (vm.salesDetail.shippingQty > 1 && vm.salesDetail.materialTentitiveDocDate && vm.copySalesDetail && vm.copySalesDetail.materialTentitiveDocDate !== vm.salesDetail.materialTentitiveDocDate) {
          const maxShipDate = _.minBy(vm.salesDetail.SalesDetail, (o) => (new Date(o.shippingDate)));
          const maxDeliveryDate = _.maxBy(vm.salesDetail.SalesDetail, (o) => (new Date(o.promisedShipDate)));
          if (maxShipDate && maxDeliveryDate) {
            if (new Date(vm.salesDetail.materialTentitiveDocDate) > new Date(maxShipDate.promisedShipDate)) { vm.promisedshipDate = true; }
            if (new Date(vm.salesDetail.materialTentitiveDocDate) > new Date(maxDeliveryDate.shippingDate)) { vm.shipDate = true; }
            if (vm.promisedshipDate || vm.shipDate) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CCMPDD_DATE_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, (vm.promisedshipDate && vm.shipDate) ? 'Requested Ship Date and Promised Ship Date' : vm.promisedshipDate ? 'Promised Ship Date' : 'Ship Date');
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.promisedshipDate = false; vm.shipDate = false;
                  saveMasterSalesDetail(ev);
                }
              }, () => { setFocus('ccmDate'); vm.promisedshipDate = false; vm.shipDate = false; vm.isSaveButtonDisable = false; }).catch((error) => BaseService.getErrorLog(error));
            } else {
              saveMasterSalesDetail(ev);
            }
          } else {
            saveMasterSalesDetail(ev);
          }
        }
        else {
          saveMasterSalesDetail(ev);
        }
      }
    };

    const addSalesOrderDetails = (ev) => {
      vm.salesDetail.isHotJob = vm.salesDetail.isHotJob | false;
      vm.salesDetail.isHotJobValue = vm.salesDetail.isHotJob ? 'Yes' : 'No';
      vm.salesDetail.quoteFromText = vm.salesCommissionFrom.NA.value;
      if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
        vm.salesDetail.quoteFromText = vm.salesCommissionFrom.FromPartMaster.value;
      }
      else if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) {
        vm.salesDetail.quoteFromText = vm.salesCommissionFrom.FromRFQ.value;
      }

      if (vm.salesDetail.isLine === 1) {
        if (vm.salesDetail.id && !vm.salesDetail.isSkipKitCreation && !vm.salesDetail.isSkipKitCreationOld && (vm.salesDetail.qtyOld !== vm.salesDetail.qty || vm.salesDetail.kitQtyOld !== vm.salesDetail.kitQty)) {
          checkKitPlanningValidation().then((response) => {
            if (response) {
              manageSalesOrderDetails(ev);
            } else {
              vm.isSaveButtonDisable = false;
            }
          });
        } else {
          manageSalesOrderDetails(ev);
        }
      }
      else if (vm.salesDetail.isLine === 3) {
        vm.checkCustomerPOLine();
        if (!vm.iscustPO) {
          //if (vm.salesorder.linkToBlanketPO && !vm.blanketPOSDetID) {
          //  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKETPO_NOT_MAPPED_WITH_FPO);
          //  messageContent.message = stringFormat(messageContent.message, vm.salesDetail.custPOLineNumber, vm.salesorder.poNumber);
          //  const model = {
          //    multiple: true,
          //    messageContent: messageContent
          //  };
          //  return DialogFactory.messageAlertDialog(model).then(() => { setFocus('qty'); });
          //} else {
          checkBlanketPOAssignOtherChargs(ev);
          //}
        } else { vm.isSaveButtonDisable = false; }
      }
    };
    // Check for BPO assigned or not for link to blanket PO for other charges
    const checkBlanketPOAssignOtherChargs = (ev) => {
      vm.checkDirty = true;
      vm.salesDetail.partID = vm.autocompleteOtherCharges.keyColumnId;
      vm.salesDetail.totalextPrice = vm.salesDetail.extPrice;
      vm.salesDetail.otherCharges = 0;
      vm.addNewOtherRow(_.clone(vm.salesDetail), ev);
    };
    vm.resetDetail = (isnotsetFocus, isreset) => {
      vm.isReset = true;
      vm.isFocus = false;
      vm.ccmpdd = null;
      vm.IsEditReleaseLine = false;
      vm.salesDetail.requestedBPOStartDate = null;
      vm.salesDetail.blanketPOEndDate = null;
      vm.salesDetDisable = false;
      $stateParams.blanketPOID = null;
      $stateParams.partID = null;
      if (vm.blanketPOAutocomplete) {
        vm.blanketPOAutocomplete.keyColumnId = null;
      }
      if (vm.salesorder.isRmaPO && vm.salesorder.orgSalesOrderID) {
        const searchObj = {
          partID: null,
          searchText: null,
          pisFromSO: true,
          refSoID: vm.salesorder.orgSalesOrderID ? vm.salesorder.orgSalesOrderID : null
        };
        getcomponentAssemblyList(searchObj);
      }
      if (vm.salesDetail.isLine === 1) {
        $scope.$broadcast(vm.autocompleteAssy.inputName, null);
        $scope.$broadcast(vm.autocompleteAssy.inputName + 'searchText', null);
        $scope.$broadcast(vm.autoCompleteOrgPODetail.inputName, null);
        $scope.$broadcast(vm.autoCompleteOrgPODetail.inputName + 'searchText', null);

        vm.autocompleteQtyTurnTime.keyColumnId = null;
        vm.autoCompleteSalesDetCommosssionTo.keyColumnId = vm.autoCompleteSalesCommosssionTo.keyColumnId;
        $timeout(() => {
          $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
          $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
        });
      } else if (vm.salesDetail.isLine === 3) {
        vm.salesDetail = { isLine: vm.salesDetail.isLine };
        vm.autocompleteOtherCharges.keyColumnId = null;
        if (vm.autoCompleteReleaseLine) {
          vm.autoCompleteReleaseLine.keyColumnId = null;
        }
        vm.autocompleteSelectAssyID.keyColumnId = null;
        vm.updateOther = false;
        vm.isFocus = false;
      }
      if (vm.autoCompleteSearchDetail && vm.autoCompleteSearchDetail.keyColumnId) {
        vm.autoCompleteSearchDetail.keyColumnId = null;
      }
      vm.currentSODetIndex = null;
      vm.detailSaveBtnCategory = null;
      vm.blanketPOSDetID = null;
      if (isreset) {
        vm.salesDetailRelease = {};
      }
      $timeout(() => {
        resetSalesOrderDetForm();
        vm.isReset = false;
        if (!isnotsetFocus) {
          setFocus('isActive');
        }
      });
    };

    function resetSalesOrderDetForm() {
      if (vm.salesOrderDetForm) {
        const maxObj = _.maxBy(vm.sourceData, (item) => parseInt(item.custPOLineNumber));
        vm.salesDetail = { isLine: vm.salesDetail.isLine, quoteFrom: vm.salesCommissionFrom.FromPartMaster.id, custPOLineNumber: maxObj && !isNaN(maxObj.custPOLineNumber) ? parseInt(maxObj.custPOLineNumber) + 1 : 1 };
        vm.salesDetailCopy = _.clone(vm.salesDetail);
        if (vm.salesOrderDetForm && vm.salesOrderDetForm.shippingDate && vm.salesOrderDetForm.shippingDate.$error && vm.salesOrderDetForm.shippingDate.$error.required) {
          vm.salesOrderDetForm.shippingDate.$error = {};
        }
        if (vm.salesOrderDetForm && vm.salesOrderDetForm.promisedShipDate && vm.salesOrderDetForm.promisedShipDate.$error && vm.salesOrderDetForm.promisedShipDate.$error.required) {
          vm.salesOrderDetForm.promisedShipDate.$error = {};
        }
        vm.salesOrderDetForm.$setPristine();
        vm.salesOrderDetForm.$setUntouched();
        vm.salesOrderDetForm.$invalid = false;
        vm.salesOrderDetForm.$valid = true;
        vm.copyisDisable = false;
        vm.poNumber = null;
        vm.assignedQty = null;
        vm.salesOrderNumber = null;
        vm.totalQty = null;
        vm.availableQty = null;
      }
    }

    const changeQtyCommonFunc = (ev, qtyType) => {
      const data = {};
      let ismrpQtymoreorless = false;
      let iskitQtymoreorless = false;
      data.POvsMRPQtyTolerancePer = vm.POvsMRPQtyTolerancePer;
      data.listAssabelyDetail = vm.salesDetail;
      data.salesOrderNumber = vm.salesorder.salesOrderNumber;
      data.revision = vm.salesorder.revision;
      vm.salesDetail.kitQty = (vm.salesDetail.kitQty === null || vm.salesDetail.kitQty === undefined) ? vm.salesDetail.mrpQty : vm.salesDetail.kitQty;
      //here check formula for po qty more then and less than 25%
      //vm.POvsMRPQtyTolerancePer system configuration variable
      const toleranceQtypercentage = parseFloat(vm.salesDetail.qty) * vm.POvsMRPQtyTolerancePer / 100;
      const toleranceQtymore = toleranceQtypercentage + parseFloat(vm.salesDetail.qty);
      const toleranceQtyless = parseFloat(vm.salesDetail.qty) - toleranceQtypercentage;
      if (qtyType !== vm.qtyType.KITQTY && ((parseFloat(vm.salesDetail.mrpQty) > toleranceQtymore || parseFloat(vm.salesDetail.mrpQty) < toleranceQtyless) && (parseInt(vm.copyMarpQty) !== parseInt(vm.salesDetail.mrpQty)))) {
        ismrpQtymoreorless = true;
      } else if (qtyType !== vm.qtyType.MRPQTY && ((parseFloat(vm.salesDetail.kitQty) > toleranceQtymore || parseFloat(vm.salesDetail.kitQty) < toleranceQtyless) && parseInt(vm.copykitQty) !== parseInt(vm.salesDetail.kitQty))) {
        iskitQtymoreorless = true;
      }
      if (ismrpQtymoreorless || iskitQtymoreorless) {
        vm.isopen = true;
        vm.copyQty = angular.copy(vm.salesDetail.qty);
        if (ismrpQtymoreorless) {
          vm.copyMarpQty = angular.copy(vm.salesDetail.mrpQty);
        }
        if (iskitQtymoreorless) {
          vm.copykitQty = angular.copy(vm.salesDetail.kitQty);
        }
        data.iskitQty = iskitQtymoreorless;
        DialogFactory.dialogService(
          CORE.TOLERANCE_QTY_CONFIRMATION_MODAL_CONTROLLER,
          CORE.TOLERANCE_QTY_CONFIRMATION_MODAL_VIEW,
          ev,
          data).then((data) => {
            vm.isopen = false;
            if (!data) {
              if (ismrpQtymoreorless) {
                vm.salesDetail.kitQty = null;
                vm.salesDetail.mrpQty = null;
              } else {
                vm.salesDetail.kitQty = null;
              }
              if (qtyType === vm.qtyType.POQTY) {
                setFocus('qty');
              }
            } else {
              if (qtyType === vm.qtyType.MRPQTY) {
                setFocus('kitQty');
              }
              if (qtyType === vm.qtyType.KITQTY) {
                setFocus('ccmDate');
              }
            }
          }, (err) => BaseService.getErrorLog(err));
      } else {
        vm.copyMarpQty = null;
        vm.copykitQty = null;
        if (qtyType === vm.qtyType.MRPQTY) {
          setFocus('kitQty');
        }
      }
    };
    // change custom price
    vm.changeQtyCustomPrice = () => {
      if (!vm.salesDetail.isCustom && !vm.salesDetail.lineID) {
        vm.changeOtherPartQty();
      }
    };
    vm.changeQty = (ev, qtyType, unitPrice) => {
      if (!vm.isopen && vm.salesDetail.id && vm.salesDetail.qtyOld !== vm.salesDetail.qty && ((qtyType === vm.qtyType.POQTY && vm.salesDetail.qty) || (qtyType === vm.qtyType.MRPQTY && vm.salesDetail.mrpQty && vm.salesDetail.qty) || (qtyType === vm.qtyType.KITQTY && vm.salesDetail.kitQty && vm.salesDetail.qty))) {
        if (qtyType === vm.qtyType.POQTY) {
          if (vm.salesDetStatus && (vm.salesDetStatus.vQtyRelease > vm.salesDetail.qty || vm.salesDetStatus.vQtyWprkorder > vm.salesDetail.qty || vm.salesDetail.qty < vm.salesShippedStatus.shippedqty)) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_WORKORDER_QTY_VALIDATION);
            messageContent.message = stringFormat(messageContent.message, vm.salesDetStatus.vQtyWprkorder, vm.copySalesDetail ? vm.copySalesDetail.workOrders : '');
            if (vm.salesDetStatus.vQtyRelease > vm.salesDetStatus.vQtyWprkorder) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_PLANKIT_QTY_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, vm.copySalesDetail.PIDCode, vm.salesDetStatus.vQtyRelease);
            } else if (vm.salesDetail.qty < vm.salesShippedStatus.shippedqty) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_RELEASE_LINE_QTY_ERROR_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, vm.salesShippedStatus.shippedqty);
            }
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.salesDetail.qty = vm.copySalesDetail.qty;
                setFocus('qty');
              }
            }).catch(() => BaseService.getErrorLog(error));
          }
        } else if (!vm.salesDetail.isSkipKitCreation) { changeQtyCommonFunc(ev, qtyType); }
      } else if (vm.salesDetail.qtyOld !== vm.salesDetail.qty && !vm.salesDetail.isSkipKitCreation && !vm.isopen && ((qtyType === vm.qtyType.POQTY && vm.salesDetail.qty) || (qtyType === vm.qtyType.MRPQTY && vm.salesDetail.mrpQty && vm.salesDetail.qty) || (qtyType === vm.qtyType.KITQTY && vm.salesDetail.kitQty && vm.salesDetail.qty))) {
        changeQtyCommonFunc(ev, qtyType);
      }
      // auto select price from part master
      if (qtyType === vm.qtyType.POQTY && !vm.salesDetail.lineID && vm.salesDetail.qty) {
        vm.salesDetail.price = unitPrice;
      }
      vm.changePrice();
    };

    vm.onChangePrice = () => {
      if ((vm.salesDetail && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) && (
        (vm.salesDetail.isCommissionDataEdited || vm.salesDetail.id > 0) &&
        parseFloat(vm.salesDetail.price) !== parseFloat(vm.salesDetailCopy.price))) {
        changeConfirmation(TRANSACTION.OnChangeCommissionType.price);
      }
      else if (parseFloat(vm.salesDetail.price) !== parseFloat(vm.salesDetailCopy.price) || (!vm.salesDetail || !vm.salesDetail.salesCommissionList || !vm.salesDetail.salesCommissionList.length)) {
        vm.changePrice();
        vm.getSalesCommissionDetailsOnPriceChange();
      }
    };

    vm.changePrice = () => {
      if (vm.salesDetail && (vm.salesDetail.qty || vm.salesDetail.qty === 0) && (vm.salesDetail.price || vm.salesDetail.price === 0)) {
        vm.salesDetail.extPrice = multipleUnitValue(vm.salesDetail.qty, vm.salesDetail.price);
      } else {
        vm.salesDetail.extPrice = null;
      }
    };

    vm.getSalesCommissionDetailsOnPriceChange = () => {
      if (vm.salesDetail.quoteFrom !== vm.salesCommissionFrom.NA.id &&
        vm.salesDetail.partID &&
        vm.salesDetail.qty &&
        vm.autocompleteQtyTurnTime.keyColumnId &&
        vm.salesDetail.price) {
        vm.cgBusyLoading = SalesOrderFactory.getSalesCommissionDetails().query({
          salesDetId: null,
          partID: vm.salesDetail.partID,
          quoteFrom: vm.salesDetail.quoteFrom,
          quoteGroupId: vm.salesDetail.refRFQGroupID || null,
          quoteNumber: vm.salesDetail.quoteNumber || null,
          poQty: vm.salesDetail.qty || null,
          turnTimeID: vm.autocompleteQtyTurnTime.keyColumnId || null,
          price: vm.salesDetail.price || null
        }).$promise.then((sales) => {
          if (sales && sales.data) {
            if (vm.salesCommissionFrom.FromRFQ.id === vm.salesDetail.quoteFrom) {
              let sumCommission = _.sumBy((sales.data), (o) => parseFloat(o.commissionValue));
              if (sumCommission > (vm.salesDetail.price / 2)) {
                sumCommission = (vm.salesDetail.price / 2);
              }
              const commissionPercentage = roundUpNum(((parseFloat(vm.salesDetail.price.toFixed(2)) - (parseFloat(vm.salesDetail.price.toFixed(2)) - sumCommission)) * 100 / (parseFloat(vm.salesDetail.price.toFixed(2)) - sumCommission)), _amountFilterDecimal);
              const qtyObj = _.find(vm.quoteQtyTurnTimeDetails, (quoteQty) => quoteQty.id === vm.autocompleteQtyTurnTime.keyColumnId);
              const sumActualCommission = parseFloat(sumCommission.toFixed(_unitPriceFilterDecimal));
              const objSummary = {
                unitPrice: parseFloat(vm.salesDetail.price.toFixed(2)) || null,
                quoted_unitPrice: parseFloat(vm.salesDetail.price.toFixed(2)) || null,
                refComponentSalesPriceBreakID: null,
                commissionPercentage: +(Math.round(commissionPercentage + 'e+2') + 'e-2'),
                commissionValue: sumActualCommission,
                extendedCommissionValue: parseFloat((vm.salesDetail.qty * sumCommission).toFixed(2)),
                quoted_commissionPercentage: +(Math.round(commissionPercentage + 'e+2') + 'e-2'),
                quoted_commissionValue: sumActualCommission,
                quotedQty: qtyObj.priceBreak,
                extendedQuotedCommissionValue: parseFloat((qtyObj.priceBreak * sumCommission).toFixed(2)),
                partID: vm.salesDetail.partID,
                salesCommissionNotes: 'All',
                qty: vm.salesDetail.qty || null,
                fieldName: TRANSACTION.SO_COMMISSION_ATTR.RFQ.FIELDNAME,
                commissionCalculateFrom: TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID,
                typeName: TRANSACTION.SO_COMMISSION_ATTR.RFQ.COMMISSIONCALCULATEDFROM,
                type: TRANSACTION.SO_COMMISSION_ATTR.RFQ.ID,
                rfqAssyID: sales.data.length > 0 ? sales.data[0].rfqAssyID : null
              };
              objSummary.childSalesCommissionList = sales.data;
              vm.salesDetail.salesCommissionList = [objSummary];
            }
            else {
              _.each(sales.data, (item) => {
                item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
                item.quoted_commissionPercentageDisplay = parseFloat(item.quoted_commissionPercentage).toFixed(_amountFilterDecimal);
                item.quoted_commissionValueDisplay = $filter('unitPrice')(item.quoted_commissionValue);
                item.extendedQuotedCommissionValueDisplay = $filter('amount')(item.extendedQuotedCommissionValue);
                item.quoted_unitPriceDisplay = $filter('amount')(item.quoted_unitPrice);
              });
              vm.salesDetail.salesCommissionList = sales.data;
            }
          }
          else {
            vm.salesDetail.salesCommissionList = [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //change qty for other charges
    vm.changeOtherPartQty = () => {
      // auto select price from part master
      if (vm.salesDetail.qty && vm.PartPriceBreakDetailsData && !vm.updateOther) {
        const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.salesDetail.qty);
        if (priceBreak) {
          vm.salesDetail.price = priceBreak.unitPrice;
        } else {
          const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.salesDetail.qty), (o) => o.priceBreak);
          if (priceList.length > 0) {
            vm.salesDetail.price = priceList[priceList.length - 1].unitPrice;
          }
        }
        vm.changePrice();
      }
    };
    function callbackFunctionLine() {
      setFocus('lineID');
      vm.isOpen = false;
    }
    vm.checkLineID = () => {
      if (vm.isOpen) {
        return;
      }
      if (vm.salesDetailRelease.lineID) {
        const objLineItem = _.find(vm.sourceData, (line) => parseInt(line.lineID) === parseInt(vm.salesDetailRelease.lineID) && line.partType !== vm.partTypes.Other);
        if (objLineItem) {
          if (vm.salesDetailRelease.shipping_index || vm.salesDetailRelease.shipping_index === 0 || (!vm.salesDetailRelease.shipping_index && parseInt(objLineItem.shippingQty) !== parseInt(objLineItem.SalesDetail ? objLineItem.SalesDetail.length : 1))) {
            vm.salesDetailRelease.poqty = objLineItem.qty;
            vm.salesDetailRelease.shippingQty = objLineItem.shippingQty;
            vm.salesDetailRelease.salesdescription = objLineItem.partDescription;
            vm.salesDetailRelease.nickName = objLineItem.nickName;
            vm.salesDetailRelease.PIDCode = objLineItem.PIDCode;
            vm.salesDetailRelease.partID = objLineItem.partID;
            vm.salesDetailRelease.isCustom = objLineItem.isCustom;
            vm.salesDetailRelease.mfgpn = objLineItem.mfgpn;
            vm.salesDetailRelease.rohsIcon = objLineItem.rohsIcon;
            vm.salesDetailRelease.rohsName = objLineItem.rohsText;
            vm.ccmpdd = objLineItem.materialTentitiveDocDate ? objLineItem.materialTentitiveDocDate : null;
            vm.salesDetailRelease.release = vm.salesDetailRelease.release ? vm.salesDetailRelease.release : (objLineItem.SalesDetail ? objLineItem.SalesDetail.length + 1 : 1);
            if (!objLineItem.id && !vm.IsEditReleaseLine) {
              const sumQty = _.sumBy((objLineItem.SalesDetail ? objLineItem.SalesDetail : []), (o) => parseInt(o.qty));
              vm.salesDetailRelease.qty = (vm.salesDetailRelease.poqty - sumQty) > 0 ? (vm.salesDetailRelease.poqty - sumQty) : 0;
            }
            const indexSource = _.indexOf(vm.sourceData, objLineItem);
            if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[indexSource]);
            }
          }
        }
        else {
          const model = {
            multiple: true
          };
          if (_.find(vm.sourceData, { lineID: vm.salesDetailRelease.lineID, partType: !vm.partTypes.Other })) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_RELEASELINE);
          } else {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_LINEID);
          }
          vm.salesDetailRelease.lineID = null;
          vm.salesDetailRelease.poqty = null;
          vm.salesDetailRelease.shippingQty = null;
          vm.salesDetailRelease.salesdescription = null;
          vm.salesDetailRelease.nickName = vm.salesDetailRelease.PIDCode = vm.salesDetailRelease.partID = vm.salesDetailRelease.isCustom =
            vm.salesDetailRelease.mfgpn = vm.salesDetailRelease.rohsIcon = vm.salesDetailRelease.rohsName = null;
          vm.ccmpdd = null;
          vm.salesDetailRelease.release = vm.salesDetailRelease.release ? vm.salesDetailRelease.release : 1;
          vm.isOpen = true;
          DialogFactory.messageAlertDialog(model, callbackFunctionLine);
        }
      }
    };

    vm.changeSalesDetail = () => {
      vm.resetDetail(false);
    };
    // on click of edit of line detail header
    vm.EditCurrentRecord = () => {
      if (vm.salesDetail && vm.salesDetail.id) {
        if (vm.salesOrderDetForm.$dirty && !vm.copyisDisable) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_RECORD,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          return DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const obj = _.find(vm.sourceData, (det) => det.lineID === vm.salesDetail.lineID);
              vm.copyisDisable = !vm.copyisDisable;
              if (obj.partType !== vm.partTypes.Other) {
                if (obj.id && !vm.copyisDisable) {
                  cellEditable(obj, false, false, vm.copyisDisable).then((cellresponse) => {
                    if (cellresponse) {
                      vm.EditSalesMasterDetail(obj, vm.copyisDisable);
                    } else {
                      vm.copyisDisable = !vm.copyisDisable;
                    }
                  });
                } else {
                  vm.EditSalesMasterDetail(obj, vm.copyisDisable);
                }
              } else {
                if (soDet.refSalesOrderID) {
                  cellEditable(obj, true, false, !vm.copyisDisable).then((respones) => {
                    if (respones) {
                      commonOtherCharges(obj);
                    }
                  });
                } else {
                  commonOtherCharges(obj);
                }
              }
            }
          }, () => {
            setFocus('custPOLineNumber');
          }).catch((err) => BaseService.getErrorLog(err));
        } else {
          const obj = _.find(vm.sourceData, (det) => det.lineID === vm.salesDetail.lineID);
          vm.copyisDisable = !vm.copyisDisable;
          if (obj.partType !== vm.partTypes.Other) {
            if (obj.id && !vm.copyisDisable) {
              cellEditable(obj, false, false, vm.copyisDisable).then((cellresponse) => {
                if (cellresponse) {
                  vm.EditSalesMasterDetail(obj, vm.copyisDisable);
                } else { vm.copyisDisable = !vm.copyisDisable; }
              });
            } else {
              vm.EditSalesMasterDetail(obj, vm.copyisDisable);
            }
          } else {
            if (obj.refSalesOrderID) {
              cellEditable(obj, true, false, vm.copyisDisable).then((respones) => {
                if (respones) {
                  commonOtherCharges(obj);
                }
              });
            } else {
              commonOtherCharges(obj);
            }
          }
        }
      } else {
        return;
      }
    };
    //edit sales order master detail
    vm.EditSalesMasterDetail = (salesrow, isView) => {
      const soDet = salesrow;
      vm.copyisDisable = angular.copy(isView);
      if (!vm.currentSODetIndex) {
        vm.currentSODetIndex = _.findIndex(vm.sourceData, (det) => det.id === salesrow.id);
      }
      if (soDet.lineID === vm.salesDetail.lineID && (!isView)) {
        if (soDet.partType === vm.partTypes.Other) {
          commonOtherCharges(soDet);
        }
        return;
      }
      vm.isReset = false;
      vm.salesDetailCopy = _.clone(soDet);
      if (soDet.partType !== vm.partTypes.Other) {
        if (soDet.id) {
          cellEditable(soDet, false, false, isView).then((cellresponse) => {
            if (cellresponse || isView) {
              let autocompletePromise = [];
              if (soDet.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && soDet.refRFQGroupID) {
                autocompletePromise = [getrfqQuoteQtyTurnTimeList(soDet.refRFQGroupID, soDet.partID)];
              }
              else if (soDet.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                autocompletePromise.push(getQtyTurnTimeByAssyId(soDet.partID, soDet.id));
              }
              vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
                checkParentUpdateRecord(soDet);
                $timeout(() => {
                  getAutoCompleteValueFromData();
                  const selectedItem = {
                    id: soDet.refRFQQtyTurnTimeID,
                    qtyTurnTime: soDet.qtyTurnTime
                  };
                  getSelectedturnTime(selectedItem);
                }, 0);
                $timeout(() => {
                  vm.salesOrderDetForm.$setPristine();
                  vm.salesOrderDetForm.$setUntouched();
                  vm.salesOrderDetForm.$invalid = false;
                  vm.salesOrderDetForm.$valid = true;
                }, 0);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          });
        } else {
          checkParentUpdateRecord(soDet);
        }
      } else {
        if (soDet.refSalesOrderID) {
          cellEditable(soDet, false, false, isView).then((respones) => {
            if (respones || isView) {
              commonOtherCharges(soDet);
            }
          });
        } else {
          commonOtherCharges(soDet);
        }
      }
    };

    // call common other charges function
    const commonOtherCharges = (salesrow) => {
      vm.updateOther = true;
      if (vm.autoCompleteReleaseLine) {
        vm.autoCompleteReleaseLine.keyColumnId = null;
      }
      vm.salesDetail = _.clone(salesrow);
      vm.salesDetail.price = salesrow.price ? parseFloat(salesrow.price) : 0;
      vm.salesDetail.extPrice = parseFloat(parseFloat(vm.salesDetail.price).toFixed(5));
      vm.autocompleteOtherCharges.keyColumnId = vm.salesDetail.partID;
      vm.autocompleteSelectAssyID.keyColumnId = vm.salesDetail.refSODetID;
      vm.salesDetail.isLine = 3;
      setFocus('otherqty');
    };
    function getAutoCompleteValueFromData() {
      if (vm.salesDetail) {
        if (vm.autoCompleteQuoteGroup && vm.salesDetail.refRFQGroupID) {
          getrfqQuoteGroupList(vm.salesDetail.partID);
        }
      }
    }

    vm.EditSalesChildDetail = (row, ev) => {
      if (row.entity.shippingID) {
        cellEditable(row.entity).then((cellresponse) => {
          if (cellresponse) {
            vm.openReleaseLinePopup(row.entity.parent, ev);
          }
        });
      } else {
        vm.openReleaseLinePopup(row.entity.parent, ev);
      }
    };

    function checkParentUpdateRecord(salesrow) {
      if (salesrow.id) {
        getKitReleaseListBySalesOrderId([salesrow.id]).then((response) => {
          vm.kitReleaseList = response;
        });
      }
      vm.salesDetail = _.clone(salesrow);
      vm.salesDetail.isSkipKitCreationOld = angular.copy(vm.salesDetail.isSkipKitCreation);
      vm.salesDetail.qtyOld = angular.copy(vm.salesDetail.qty);
      vm.salesDetail.kitQtyOld = angular.copy(vm.salesDetail.kitQty);
      vm.salesDetail.price = parseFloat(salesrow.price);
      if (vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length === 1 && !(vm.salesorder.isBlanketPO && vm.salesorder.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO)) {
        vm.salesDetail.isAgreeToShip = vm.salesDetail.SalesDetail[0].isAgreeToShip;
        vm.salesDetail.requestedDockDate = vm.salesDetail.isAgreeToShip ? vm.salesDetail.SalesDetail[0].revisedRequestedDockDate : vm.salesDetail.SalesDetail[0].requestedDockDate;
        vm.salesDetail.requestedShipDate = vm.salesDetail.isAgreeToShip ? vm.salesDetail.SalesDetail[0].revisedRequestedShipDate : vm.salesDetail.SalesDetail[0].shippingDate;
        vm.salesDetail.promisedShipDate = vm.salesDetail.isAgreeToShip ? vm.salesDetail.SalesDetail[0].revisedRequestedPromisedDate : vm.salesDetail.SalesDetail[0].promisedShipDate;
      }
      if (vm.salesorder.isRmaPO && vm.salesorder.orgSalesOrderID) {
        vm.autoCompleteOrgPODetail.keyColumnId = vm.salesDetail.partID;
        getcomponentAssemblyList({
          partID: vm.salesDetail.partID,
          refSoID: vm.salesorder.orgSalesOrderID
        });
      } else {
        vm.autocompleteAssy.keyColumnId = vm.salesDetail.partID;
        getcomponentAssemblyList({
          partID: vm.salesDetail.partID
        });
      }
      vm.salesDetail.extPrice = parseFloat(parseFloat(salesrow.extPrice).toFixed(5));
      vm.autoCompleteSalesDetCommosssionTo.keyColumnId = vm.salesDetail.salesCommissionTo;
      //vm.autoCompleteQuoteGroup.keyColumnId = vm.salesDetail.refRFQGroupID;
      //vm.autocompleteQtyTurnTime.keyColumnId = vm.salesDetail.refRFQQtyTurnTimeID;
      vm.salesDetail.isLine = 1;
      vm.salesDetailRelease = {};
      if (salesrow.id) {
        getTotalReleaseQty(salesrow.id);
      }
      vm.copySalesDetail = _.clone(salesrow);
      vm.copysalesDetailRelease = _.clone(vm.salesDetailRelease);
      setFocus('qty');
    };
    /** Redirect to part master page */
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    /** Redirect to UOM page */
    vm.goToUomList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };
    vm.getDataDown = () => {
    };

    vm.goToShipPlanDetails = (row) => {
      var data = {
        salesOrderDetailId: row.id,
        qty: row.qty,
        partID: row.partID,
        poNumber: vm.salesorder.poNumber,
        salesOrderNumber: vm.salesorder.salesOrderNumber,
        rohsIcon: row.rohsIcon,
        rohsComplientConvertedValue: row.rohsText,
        mfgPN: row.mfgPN,
        PIDCode: row.PIDCode,
        PODate: BaseService.getUIFormatedDate(vm.salesorder.poDate, vm.DefaultDateFormat),
        kitQty: row.kitQty,
        soId: vm.id,
        version: vm.salesorder.revision,
        blanketPOOption: vm.salesorder.blanketPOOption,
        isLegacyPO: vm.salesorder.isLegacyPO,
        isRmaPO: vm.salesorder.isRmaPO
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_CONTROLLER,
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    //open popup to view and update sales commission
    vm.goToSalesCommission = (row, event) => {
      const salesDetail = _.find(vm.SalesCommissionEmployeeList, (item) => item.id === vm.autoCompleteSalesCommosssionTo.keyColumnId);
      _.map(row.salesCommissionList, (d) => {
        if (d.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
          d.unitPrice = parseFloat(row.price || d.unitPrice);
          d.commissionValue = roundUpNum((((100 / (100 + parseFloat(d.commissionPercentage))) * d.unitPrice) * parseFloat(d.commissionPercentage) / 100), _unitPriceFilterDecimal);
        }
        d.extendedCommissionValue = multipleUnitValue(d.commissionValue, row.qty, _amountFilterDecimal);
        d.extendedQuotedCommissionValue = multipleUnitValue(d.quoted_commissionValue, d.quotedQty, _amountFilterDecimal);
      });
      const dataObj = {
        salesOrderDisable: row.salesOrderDetStatus,
        salesOrderDetailId: row.id,
        qty: row.qty,
        partID: row.partID,
        poNumber: vm.salesorder.poNumber,
        salesOrderNumber: vm.salesorder.salesOrderNumber,
        rohsIcon: row.rohsIcon,
        rohsComplientConvertedValue: row.rohsText,
        mfgPN: row.mfgPN,
        PIDCode: row.PIDCode,
        PODate: BaseService.getUIFormatedDate(vm.salesorder.poDate, vm.DefaultDateFormat),
        soId: vm.id,
        salesCommissionTo: vm.autoCompleteSalesCommosssionTo.keyColumnId || row.salesCommissionTo,
        salesCommissionToName: salesDetail ? salesDetail.name : row.salesCommissionName,
        quoteGroup: row.refRFQGroupID,
        quoteTurnTime: row.qtyTurnTime,
        rfqAssyID: row.salesCommissionList && row.salesCommissionList.length > 0 ? row.salesCommissionList[0].rfqAssyID : null,
        salesCommissionList: row.salesCommissionList ? angular.copy(row.salesCommissionList) : {},
        quoteNumber: row.quoteNumber,
        isLegacyPO: vm.salesorder.isLegacyPO,
        version: vm.salesorder.revision,
        blanketPOOption: vm.salesorder.blanketPOOption,
        isRmaPO: vm.salesorder.isRmaPO
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_SALES_MASTER_COMMISSION_CONTROLLER,
        TRANSACTION.TRANSACTION_SALES_MASTER_COMMISSION_VIEW,
        event,
        dataObj).then(() => {
        }, (data) => {
          if (data) {
            if (data.isSaved) {
              row.salesCommissionList = data.salesCommissionList;
              if (!row.salesCommissionDeltedIds) {
                row.salesCommissionDeltedIds = [];
              }
              row.salesCommissionDeltedIds = row.salesCommissionDeltedIds.concat(data.salesCommissionDeltedIds);
              const filter = _.find(data.salesCommissionList, (commn) => commn.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID);
              if (filter) {
                row.price = parseFloat(filter.unitPrice);
                row.extPrice = multipleUnitValue(row.qty, row.price);
              }
              vm.addNewParentRow(_.clone(row), true, event);
            }
            else {
              row.isCommissionDataEdited = true;
              row.salesCommissionList = data.salesCommissionList;
              const filter = _.find(data.salesCommissionList, (commn) => commn.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID);
              if (filter) {
                row.price = parseFloat(filter.unitPrice);
                row.extPrice = multipleUnitValue(row.qty, row.price);
              }
              if (!row.salesCommissionDeltedIds) {
                row.salesCommissionDeltedIds = [];
              }
              row.salesCommissionDeltedIds = row.salesCommissionDeltedIds.concat(data.salesCommissionDeltedIds);
              vm.salesDetailCopy = _.clone(row);
              vm.salesOrderDetForm.$setDirty();
              setFocusByName('btnSalesCommisson');
            }
          }
          else {
            setFocusByName('btnSalesCommisson');
          }
        }, (error) => BaseService.getErrorLog(error));
    };
    /*
     * Author :  Champak Chaudhary
     * Purpose : ui grid expandable
     */
    vm.expandableJS = () => {
      if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
        vm.gridOptions.gridApi.expandable.on.rowExpandedStateChanged($scope, (row) => {
          if (row.isExpanded) {
            vm.subGridpagingInfo = {
              Page: CORE.UIGrid.Page(),
              SortColumns: [],
              SearchColumns: []
            };

            vm.subGridgridOptions = {
              showColumnFooter: false,
              enableRowHeaderSelection: false,
              enableFullRowSelection: true,
              enableRowSelection: false,
              multiSelect: false,
              filterOptions: vm.subGridpagingInfo.SearchColumns,
              enableCellEdit: false,
              enablePaging: false,
              enableExpandableRowHeader: false,
              enableGridMenu: false,
              enableCellEditOnFocus: true,
              appScopeProvider: $scope,
              enableCellSelection: true,
              allowCellFocus: true,
              rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-so-releaseline-grid-background-color\': row.entity.isTBD }" role="gridcell" ui-grid-cell="">',
              hideMultiDeleteButton: true
            };

            vm.subGridsourceHeader = [
              {
                field: 'isadd',
                cellClass: 'layout-align-center-center',
                displayName: 'Action',
                width: '120',
                cellTemplate: '<md-button  style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn"  ng-if="grid.appScope.vm.isDisable || grid.appScope.vm.salesorder.blanketPOOption==grid.appScope.vm.BlanketPODetails.LINKBLANKETPO">' +
                  '<md-icon role="img" md-font-icon="icon-pencil"></md-icon>' +
                  '</md-button>' +
                  '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="!grid.appScope.vm.isDisable && grid.appScope.vm.salesorder.blanketPOOption!=grid.appScope.vm.BlanketPODetails.LINKBLANKETPO" ng-click="grid.appScope.vm.EditSalesChildDetail(row,$event)">' +
                  '<md-icon role="img" md-font-icon="icon-pencil"></md-icon><md-tooltip md-direction="top">Edit</md-tooltip>' +
                  '</md-button>' +
                  '<md-button style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="row.entity.isTBD || !row.entity.shippingID" >' +
                  '<md-icon role="img" md-font-icon="icons-so-change-history"></md-icon>' +
                  '</md-button>' +
                  '<md-button ng-if="!row.entity.isTBD && row.entity.shippingID"  class="md-primary grid-button md-icon-button bdrbtn"   ng-click="grid.appScope.vm.openReleaseLineHistory(row.entity,$event)">' +
                  '<md-icon role="img" md-font-icon="icons-so-change-history"></md-icon><md-tooltip md-direction="top">Release Line Detail Change History</md-tooltip>' +
                  '</md-button>' +
                  '<md-button style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="grid.appScope.vm.isDisable || row.entity.isTBD || row.entity.parent.isCancle || (grid.appScope.vm.salesorder.blanketPOOption==grid.appScope.vm.BlanketPODetails.LINKBLANKETPO)" >' +
                  '<md-icon role="img" md-font-icon="icon-trash"></md-icon>' +
                  '</md-button>' +
                  '<md-button ng-if="!grid.appScope.vm.isDisable && !row.entity.isTBD && !row.entity.parent.isCancle && !(grid.appScope.vm.salesorder.blanketPOOption==grid.appScope.vm.BlanketPODetails.LINKBLANKETPO)"  class="md-primary grid-button md-icon-button bdrbtn"   ng-click="grid.appScope.removeRow(row)">' +
                  '<md-icon role="img" md-font-icon="icon-trash"></md-icon><md-tooltip md-direction="top">Delete</md-tooltip>' +
                  '</md-button>',
                enableFiltering: false,
                enableSorting: false,
                enableCellEdit: false
              },
              {
                field: 'releaseNumber',
                width: '180',
                displayName: 'FCA Release#',
                cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{COL_FIELD}}</b></span></div>',
                enableFiltering: false,
                enableSorting: false,
                enableCellEdit: false
              },
              {
                field: 'customerReleaseLine',
                width: '100',
                displayName: 'Cust Release#',
                cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{COL_FIELD}}</b></span></div>',
                enableFiltering: false,
                enableSorting: false,
                enableCellEdit: false
              },
              {
                field: 'qty',
                headerCellTemplate: '<div class="ui-grid-cell-contents text-left">Qty</div>',
                width: '100',
                type: 'number',
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | numberWithoutDecimal}}</div>'
              },
              {
                field: 'poReleaseNumber',
                width: '130',
                displayName: 'PO Release#',
                cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{COL_FIELD}}</b></span></div>',
                enableFiltering: false,
                enableSorting: false,
                enableCellEdit: false
              },
              {
                field: 'requestedDockDate',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Requested Dock Date (Orig.)</div>',
                width: '130',
                type: 'date',
                cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>',
                editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker datepicker-options="grid.appScope.vm.datePickerValueoptions" entity-details="row.entity" field-details="col.colDef.field" ng-class="\'colt\' + col.uid"></div></form></div>'
              },
              {
                field: 'shippingDate',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Requested Ship Date (Orig.)</div>',
                width: '130',
                type: 'date',
                cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>',
                editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker datepicker-options="grid.appScope.vm.datePickerValueoptions" entity-details="row.entity" field-details="col.colDef.field" ng-class="\'colt\' + col.uid"></div></form></div>'
              },
              {
                field: 'promisedShipDate',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Promised Ship Date (Orig.)</div>',
                width: '130',
                type: 'date',
                cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>',
                editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker datepicker-options="grid.appScope.vm.datePickerValueoptions" entity-details="row.entity" field-details="col.colDef.field" ng-class="\'colt\' + col.uid"></div></form></div>'
              },
              {
                field: 'isAgreeToShip',
                displayName: 'Agreed To Ship',
                cellTemplate: '<div class="ui-grid-cell-contents text-center"><md-checkbox ng-model="row.entity.isAgreeToShip" ng-disabled="true"/></div>',
                width: 130,
                enableCellEdit: false,
                enableFiltering: false,
                enableSorting: false,
                allowCellFocus: false,
                maxWidth: '150'
              },
              {
                field: 'revisedRequestedDockDate',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Requested Dock Date (Revised)</div>',
                width: '130',
                type: 'date',
                cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>'
              },
              {
                field: 'revisedRequestedShipDate',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Requested Ship Date (Revised)</div>',
                width: '130',
                type: 'date',
                cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>'
              },
              {
                field: 'revisedRequestedPromisedDate',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Promised Ship Date (Revised)</div>',
                width: '130',
                type: 'date',
                cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>'
              },
              {
                field: 'shippedQty',
                headerCellTemplate: '<div class="ui-grid-cell-contents text-left">Shipped Qty</div>',
                width: '100',
                type: 'number',
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}"><span ng-class="{\'underline cursor-pointer\':row.entity.shippedQty && row.entity.shippingID} " ng-click="row.entity.shippedQty && row.entity.shippingID?grid.appScope.vm.openReleaseBifurcationQtyPopup(row.entity,$event):null">{{COL_FIELD | numberWithoutDecimal}}</span></div>'
              },
              {
                field: 'openQty',
                headerCellTemplate: '<div class="ui-grid-cell-contents text-left">Open Qty</div>',
                width: '100',
                type: 'number',
                validators: { required: true },
                cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | numberWithoutDecimal}}</div>'
              },
              {
                field: 'releaseNotes',
                displayName: 'Release Notes',
                cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
                  '<span class="cursor-pointer bom-header-wrap">{{COL_FIELD}}</span> &nbsp;' +
                  '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releaseNotes && row.entity.releaseNotes !== \'-\'" ng-click="grid.appScope.vm.showReleaseNotePopUp(row.entity, $event)">' +
                  '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
                  '<md-tooltip>View</md-tooltip>' +
                  '</button>' +
                  '</div>',
                width: '220'
              },
              {
                field: 'description',
                displayName: 'Additional Notes',
                cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
                  '<span class="cursor-pointer bom-header-wrap">{{COL_FIELD}}</span> &nbsp;' +
                  '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.vm.showAdditionalNotePopUp(row.entity, $event)">' +
                  '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
                  '<md-tooltip>View</md-tooltip>' +
                  '</button>' +
                  '</div>',
                width: '220'
              },
              {
                field: 'FullAddress',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Shipping Address</div>',
                cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
                  '<span class="cursor-pointer bom-header-wrap">{{COL_FIELD}}</span> &nbsp;' +
                  '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.FullAddress && row.entity.FullAddress !== \'-\'" ng-click="grid.appScope.vm.showDescriptionPopUp(row.entity, $event)">' +
                  '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
                  '<md-tooltip>View</md-tooltip>' +
                  '</button>' +
                  '</div>',
                width: '300'
              },
              {
                field: 'gencCategoryCode',
                width: '130',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Shipping Method</div>',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
              },
              {
                field: 'carrierName',
                width: '130',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Carrier</div>',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
              },
              {
                field: 'carrierAccountNumber',
                width: '130',
                headerCellTemplate: '<div class="ui-grid-cell-contents">Carrier Account#</div>',
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
              },
              {
                field: 'modifyDate',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: 150,
                type: 'datetime',
                enableFiltering: false,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
              }, {
                field: 'soModifiedBy',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: 130,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
              }, {
                field: 'updatedbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: 140,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
              }, {
                field: 'createdDate',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: 150,
                type: 'datetime',
                enableFiltering: false,
                visible: CORE.UIGrid.VISIBLE_CREATED_AT
              },
              {
                field: 'soCreatedBy',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
                width: 130,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                enableSorting: true,
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_CREATED_BY
              },
              {
                field: 'createdbyRole',
                displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
                cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
                width: 140,
                type: 'StringEquals',
                enableFiltering: true,
                visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
              }
            ];
            // Add default pending detail for total pending and sum
            row.entity.SalesDetail = _.filter(row.entity.SalesDetail, (soentity) => (!soentity.isTBD));
            const totalPlanned = (_.sumBy(row.entity.SalesDetail, (o) => (o.qty)) || 0);
            const totalShipped = (_.sumBy(row.entity.SalesDetail, (o) => (o.shippedQty)) || 0);
            const totalOpened = (_.sumBy(row.entity.SalesDetail, (o) => (o.openQty)) || 0);
            const pendingQty = row.entity.qty - totalPlanned;
            const objPlanned = {
              releaseNumber: 'TBD',
              qty: pendingQty < 0 ? 0 : pendingQty,
              isTBD: true,
              parent: row.entity,
              openQty: pendingQty < 0 ? 0 : pendingQty
            };
            // po qty row
            const objPOQty = {
              releaseNumber: vm.salesorder.isLegacyPO ? 'Total Open PO Qty' : 'Total PO Qty',
              qty: row.entity.qty,
              isTBD: true,
              parent: row.entity,
              shippedQty: totalShipped,
              openQty: row.entity.qty - totalShipped
            };
            // total release line qty
            const objTotalreleaseQty = {
              releaseNumber: 'Scheduled Release Qty',
              qty: totalPlanned,
              isTBD: true,
              parent: row.entity,
              shippedQty: totalShipped,
              openQty: totalOpened
            };
            vm.subGridgridOptions.columnDefs = vm.subGridsourceHeader;
            vm.subGridgridOptions.data = _.orderBy(row.entity.SalesDetail, ['releaseNumber'], ['ASC']);

            if (row.entity.partType !== vm.partTypes.Other) {
              vm.subGridgridOptions.data.push(objPlanned);
              vm.subGridgridOptions.data.push(objTotalreleaseQty);
              vm.subGridgridOptions.data.push(objPOQty);
            }
            vm.subGridgridOptions.onRegisterApi = function (gridApi) {
              vm.gridApi = gridApi;
              $timeout(() => {
                if (!vm.isfalse) {
                  if (!vm.id) {
                    vm.gridApi.cellNav.scrollToFocus(row.entity.subGridOptions.data[0], row.entity.subGridOptions.columnDefs[GridOption.SUBQTY]);
                  }
                }
                else {
                  vm.gridApi.cellNav.scrollToFocus(row.entity.subGridOptions.data[vm.expandindex ? vm.expandindex : 0], row.entity.subGridOptions.columnDefs[vm.expandColumn ? vm.expandColumn : GridOption.SUBQTY]);
                  vm.isfalse = false;
                }
              }, true);
            };
            row.entity.subGridOptions = vm.subGridgridOptions;
          }
        });
      }
    };
    const cellEditable = (row, isOther, isremove, isView) => {
      if (vm.id && (row.id || (row.parent && row.parent.id))) {
        return SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ id: (row.id || (row.parent && row.parent.id)), releaseLineID: (row.parent && row.parent.id ? row.shippingID : null) }).$promise.then((salesDet) => {
          if (salesDet && salesDet.data && !isView) {
            vm.salesDetStatus = _.head(salesDet.data.soReleaseStatus);
            vm.salesShippedStatus = salesDet.data.soShipStatus.length > 0 ? _.head(salesDet.data.soShipStatus) : null;
            vm.soBlanketPOStatus = salesDet.data.soBlanketPOStatus;
            if (vm.salesDetStatus.vQtyRelease || vm.salesDetStatus.vQtyWprkorder) {
              vm.salesDetDisable = true;
            } else { vm.salesDetDisable = false; }
            if (vm.salesShippedStatus && !isOther && vm.salesShippedStatus.shippedqty >= (row.qty || (row.parent && row.parent.qty))) {
              const messageContent = row.id ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_ASSYID_SHIP_VALIDATION) : isremove ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SHIPPING_DET_REMOVE_VALIDATION) : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SHIPPING_RELEASE_NOT_UPDATE);
              if (row.id) {
                messageContent.message = stringFormat(messageContent.message, (row.PIDCode || (row.parent && row.parent.PIDCode)), (row.mfgPN || (row.parent && row.parent.mfgPN)), vm.salesShippedStatus.packingSlipNumber || '');
              } else {
                messageContent.message = stringFormat(messageContent.message, row.releaseNumber, vm.salesShippedStatus.packingSlipNumber || '');
              }
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  return false;
                }
              }).catch(() => BaseService.getErrorLog(error));
            } else {
              return true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.salesDetStatus = null;
        vm.salesDetDisable = false;
        return true;
      }
    };

    const cellMultiEditable = (row) => {
      if (vm.id && (row)) {
        return SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ id: row, releaseLineID: null }).$promise.then((salesDet) => {
          if (salesDet && salesDet.data) {
            vm.salesDetStatus = _.head(salesDet.data.soReleaseStatus);
            vm.salesShippedStatus = salesDet.data.soShipStatus.length > 0 ? _.head(salesDet.data.soShipStatus) : null;
            if (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty) {
              return false;
            } else {
              return true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.salesDetStatus = null;
        vm.salesDetDisable = false;
        return true;
      }
    };
    //Add new row in expandable ui grid
    vm.addNewRow = (row) => {
      var objLineItem = _.find(vm.sourceData, (line) => parseInt(row.lineID) === parseInt(line.lineID));
      var indexSource = _.indexOf(vm.sourceData, objLineItem);
      if (objLineItem) {
        if (!objLineItem.SalesDetail) {
          objLineItem.SalesDetail = [];
        }
        let obj = _.find(objLineItem.SalesDetail, (item) => item.shipping_index === row.shipping_index);
        if (obj) {
          const index = _.indexOf(objLineItem.SalesDetail, obj);
          obj = row;
          objLineItem.SalesDetail.splice(index, 1);
          objLineItem.SalesDetail.splice(index, 0, obj);
        } else {
          const maxobj = _.maxBy(objLineItem.SalesDetail, (item) => item.shipping_index);
          row.parent = objLineItem;
          row.shippingID = 0;
          row.shipping_index = maxobj ? maxobj.shipping_index + 1 : 0;
          row.releaseNumber = maxobj ? maxobj.releaseNumber + 1 : 1;
          objLineItem.SalesDetail.push(row);
        }
        if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
          vm.gridOptions.gridApi.expandable.collapseAllRows();
          vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[indexSource]);
        }
      }
      vm.getSalesOrderPriceDetails();
    };
    //add new item other part details
    vm.addNewOtherRow = (row) => {
      var objLineItem = _.find(vm.sourceData, (line) => parseInt(row.partID) === parseInt(line.partID) && row.lineID === line.lineID);
      if (objLineItem) {
        objLineItem.qty = row.qty;
        objLineItem.price = row.price;
        objLineItem.extPrice = row.extPrice;
        objLineItem.frequency = row.frequency;
        objLineItem.partDescription = row.partDescription;
        objLineItem.custPOLineNumber = row.custPOLineNumber;
        objLineItem.remark = row.remark;
        objLineItem.internalComment = row.internalComment;
        const otherChargeTotal = (_.sumBy(objLineItem.SalesOtherDetail, (o) => (o.qty * o.price)) || 0);
        objLineItem.totalextPrice = (objLineItem.qty * objLineItem.price) + otherChargeTotal;
        objLineItem.frequencyName = row.frequencyName;
        saveDetailSODetails(objLineItem);
      } else {
        saveDetailSODetails(row);
      }
      vm.getSalesOrderPriceDetails();
    };
    //Remove row from expandable ui grid
    $scope.removeRow = (row) => {
      cellEditable(row.entity, false, true).then((cellresponse) => {
        if (cellresponse) {
          if (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SHIPPING_DET_REMOVE_VALIDATION);
            messageContent.message = stringFormat(messageContent.message, row.entity.releaseNumber, vm.salesShippedStatus.packingSlipNumber || '');
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
            }).catch(() => BaseService.getErrorLog(error));
          } else if (vm.usedWorkOrderList) {
            const shipping = _.find(vm.usedWorkOrderList, (item) => item.shippingID === row.entity.shippingID);
            if (shipping) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PRODUCTION_STARTED_NOT_ALLOW_ANY_CHANGE);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return false;
            }
            else {
              vm.isChanged = true;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, 'Shipping', 1);
              const objs = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              const obj = _.find(row.grid.options.data, (item) => item.shipping_index === row.entity.shipping_index);
              DialogFactory.messageConfirmDialog(objs).then((yes) => {
                if (yes) {
                  if (obj) {
                    saveSalesOrderConfirmDetail(row, null, CORE.SO_CALL.REMOVE_LINEDET);
                  }
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }
      });
    };
    // remove release line related version upgrade
    const releaseLineSOVersionUpgradeConfirmation = (row) => {
      // remove shipping detail from API
      if (parseInt(vm.salesorder.status)) {
        vm.salesorder.isAskForVersionConfirmation = false;
      }
      const objShip = {
        id: row.entity.shippingID,
        isSOrevision: vm.salesorder.isSOrevision,
        isAskForVersionConfirmation: vm.salesorder.isAskForVersionConfirmation,
        soID: vm.id
      };
      return SalesOrderFactory.removeSalesOrderReleaseLineDetail().query(objShip).$promise.then(() => {
        const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
        vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
          vm.holdunHoldList = response[1].data;
          vm.salesOrderDetailByID(response[0], row.entity.parent.id, true);
          if (objShip.isSOrevision) {
            vm.salesOrderDetails(vm.id);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //Add new row in parent ui grid
    vm.addNewParentRow = (obj, callFromAddPopup, ev) => {
      let objSalesMaster = _.find(vm.sourceData, (sales) => parseInt(sales.lineID) === parseInt(obj.lineID));
      // const copyobjSalesMaster = _.clone(objSalesMaster);
      if (objSalesMaster) {
        objSalesMaster = obj;
        const otherChargeTotal = (_.sumBy(objSalesMaster.SalesOtherDetail, (o) => (o.qty * o.price)) || 0);
        objSalesMaster.totalextPrice = (objSalesMaster.qty * objSalesMaster.price) + otherChargeTotal;
        if (objSalesMaster.salesCommissionList) {
          _.each(objSalesMaster.salesCommissionList, (item) => {
            if (item.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
              item.unitPrice = parseFloat(objSalesMaster.price);
              item.commissionValue = roundUpNum((((100 / (100 + parseFloat(item.commissionPercentage))) * item.unitPrice) * parseFloat(item.commissionPercentage) / 100), _unitPriceFilterDecimal);
            }
          });
        }
        if (callFromAddPopup && vm.sourceData) {
          const currentRow = _.find(vm.sourceData, (sales) => parseInt(sales.lineID) === parseInt(obj.lineID));
          if (currentRow && currentRow.salesorderdetCommissionAttributeMstDet) {
            _.each(currentRow.salesorderdetCommissionAttributeMstDet, (item) => {
              item.qty = objSalesMaster.qty;
              item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
              item.quoted_commissionPercentageDisplay = parseFloat(item.quoted_commissionPercentage).toFixed(_amountFilterDecimal);
              item.quoted_commissionValueDisplay = $filter('unitPrice')(item.quoted_commissionValue);
              item.extendedQuotedCommissionValueDisplay = $filter('amount')(item.extendedQuotedCommissionValue);
              item.quoted_unitPriceDisplay = $filter('amount')(item.quoted_unitPrice);
            });

            objSalesMaster.salesCommissionList = currentRow.salesorderdetCommissionAttributeMstDet;
          }
        }
      }
      else if (vm.id && vm.sourceData) {
        const maxDBobj = _.maxBy(vm.sourceData, (item) => item.lineID);
        const maxClientobj = _.maxBy(vm.sourceData, (item) => item.lineID);
        const maxobj = maxDBobj && maxDBobj.lineID > (maxClientobj ? maxClientobj.lineID : 1) ? maxDBobj : maxClientobj;
        obj.lineID = maxobj ? maxobj.lineID + 1 : 1;
        obj.otherCharges = 0;
        const otherChargeTotal = (_.sumBy(obj.SalesOtherDetail, (o) => (o.qty * o.price)) || 0);
        obj.totalextPrice = (obj.qty * obj.price) + otherChargeTotal;
      }
      //vm.resetDetail(false, true);
      saveDetailSODetails(obj, ev);
    };
    // save Detail level So details
    const saveDetailSODetails = (objSoDetail, ev) => {
      //check assembly and revision were same or not
      const isAssemblyDuplicate = _.find(vm.sourceData, (duplicate) => duplicate.lineID !== objSoDetail.lineID && duplicate.PIDCode === objSoDetail.PIDCode
        && (parseFloat(duplicate.price) === parseFloat(objSoDetail.price) && parseInt(duplicate.qty) === parseInt(objSoDetail.qty)) && !objSoDetail.id);
      if (isAssemblyDuplicate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_SAMEPART_CONFIRMATION_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, isAssemblyDuplicate.PIDCode, isAssemblyDuplicate.lineID);
        const objs = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(objs).then((yes) => {
          if (yes) {
            if (parseFloat(vm.salesorder.status) && objSoDetail.partType !== vm.partTypes.Other) {
              checkSalesOrderDetailPublishValidation(ev, objSoDetail);
            } else {
              saveSalesOrderDetailValidation(objSoDetail, ev);
            }
          }
        }, () => {
          vm.isSaveButtonDisable = false;
          setFocus('qty');
        }).catch((error) => BaseService.getErrorLog(error));
        return false;
      } else {
        if (parseFloat(vm.salesorder.status) && objSoDetail.partType !== vm.partTypes.Other) {
          checkSalesOrderDetailPublishValidation(ev, objSoDetail);
        } else {
          saveSalesOrderDetailValidation(objSoDetail, ev);
        }
      }
    };
    // check for version upgrade
    // save sales order detail with validation
    const checkDetailConfirmationSO = (obj, event) => {
      saveSalesOrderConfirmDetail(obj, event);
    };

    const saveSODetailValidation = (obj, event) => {
      obj.isSOrevision = vm.salesorder.isSOrevision;
      obj.isAskForVersionConfirmation = vm.salesorder.isAskForVersionConfirmation;
      vm.cgBusyLoading = SalesOrderFactory.createUpdateSalesOrderDetails().query(obj).$promise.then((response) => {
        vm.saveDisable = false;
        if (response && response.data && !obj.id) {
          if ((vm.salesDetail.requestedDockDate || vm.salesDetail.requestedShipDate) && vm.salesDetail.promisedShipDate && vm.salesDetail.partType !== vm.partTypes.Other) {
            const releaseLineList = [];
            const objReleaseLineDet = {
              shippingDate: BaseService.getAPIFormatedDate(vm.salesDetail.requestedShipDate),
              promisedShipDate: BaseService.getAPIFormatedDate(vm.salesDetail.promisedShipDate),
              requestedDockDate: BaseService.getAPIFormatedDate(vm.salesDetail.requestedDockDate),
              carrierID: null,
              shippingAddressID: null,
              shippingContactPersonID: null,
              shippingMethodID: null,
              releaseNotes: null,
              shippingID: null,
              customerReleaseLine: 1,
              qty: vm.salesDetail.qty,
              description: null,
              releaseNumber: 1,
              carrierAccountNumber: null,
              sDetID: response.data.id,
              poReleaseNumber: vm.autoCompleteBlanketPOOption.keyColumnId === vm.BlanketPODetails.USEBPOANDRELEASE ? stringFormat('{0}-{1}', vm.salesorder.poNumber, 1) : null
            };
            releaseLineList.push(objReleaseLineDet);
            const objReleaseLine = {
              id: response.data.id,
              SODetail: releaseLineList,
              blanketPOID: vm.blanketPOSDetID,
              isFromDetail: true,
              isSOrevision: vm.salesorder.isSOrevision,
              soID: vm.id,
              isAskForVersionConfirmation: vm.salesorder.isAskForVersionConfirmation
            };
            vm.cgBusyLoading = SalesOrderFactory.saveSalesOrderLineDetail().query(objReleaseLine).$promise.then(() => {
              vm.isSaveButtonDisable = false;
              // vm.resetDetail(false, true);
              const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
              vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((responses) => {
                vm.holdunHoldList = responses[1].data;
                vm.salesOrderDetailByID(responses[0]);
                if (vm.detailSaveBtnCategory === vm.navDirection.NEW) {
                  vm.resetDetail(false, true);
                } else {
                  vm.navigateDetailRecords(vm.detailSaveBtnCategory, false);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.isSaveButtonDisable = false;
            const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
            vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((responses) => {
              vm.holdunHoldList = responses[1].data;
              vm.salesOrderDetailByID(responses[0], obj.partType !== vm.partTypes.Other ? response.data.id : null);
              if (vm.detailSaveBtnCategory === vm.navDirection.NEW) {
                vm.resetDetail(false, true);
              } else {
                vm.navigateDetailRecords(vm.detailSaveBtnCategory, false);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
        else if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.skiptKitError) { // For parallel entry confirmation of skiptkit
          const kitAllocationConfirmation = response.errors.data.skipKitConfirmationAndError;
          const confirmation = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REMOVE_KIT_ALLOCATION_SAVE_CONFIRMATION),
            skipKitList: kitAllocationConfirmation,
            isConfirmation: true
          };
          DialogFactory.dialogService(
            CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_CONTROLLER,
            CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_VIEW,
            event,
            confirmation).then(() => {
              vm.saveDisable = false;
            }, (data) => {
              if (data) {
                if (obj.id && obj.isSkipKitCreation) {
                  obj.kitRemoveConfirmation = true;
                }
                checkDetailConfirmationSO(obj);
              } else { vm.isSaveButtonDisable = false; }
            }, (error) => BaseService.getErrorLog(error));
        }
        else if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.kitHaveWorkorderOrRelease && response.errors.data.kitHaveWorkorderOrRelease.length > 0) {
          const listOfPID = _.map(response.errors.data.kitHaveWorkorderOrRelease, (data) => _.find(response.errors.data.salesdetail, (item) => item.id === data));
          const pidString = _.map(listOfPID, (data) => data.componentAssembly.PIDCode).join(', ');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_REMOVE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, pidString, _.map(listOfPID, 'lineID').join(', '));
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          vm.isSaveButtonDisable = false;
          return DialogFactory.messageAlertDialog(model);
        }
        else if (!(response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.err)) {
          vm.isSaveButtonDisable = false;
          if (obj.isRemoveReleaseLine) {
            let totalQtySUM = _.sumBy(_.filter(vm.salesDetail.SalesDetail, (solist) => !solist.isTBD), (qtySum) => qtySum.qty);
            let salesDetList = _.filter(vm.salesDetail.SalesDetail, (sDet) => !sDet.isTBD && !sDet.shippedQty);
            const salesAllDetList = _.filter(vm.salesDetail.SalesDetail, (sDet) => !sDet.isTBD);
            salesDetList = _.sortBy(salesDetList, ['releaseNumber']).reverse();
            _.each(salesDetList, (sDetail) => {
              if (totalQtySUM > vm.salesDetail.qty) {
                const index = vm.salesDetail.SalesDetail.indexOf(sDetail);
                if (index > -1) {
                  vm.salesDetail.SalesDetail.splice(index, 1);
                  totalQtySUM = totalQtySUM - sDetail.qty;
                }
              }
            });
            const releaseLineList = [];
            _.each(vm.salesDetail.SalesDetail, (plann) => {
              if (!plann.isTBD) {
                const objReleaseLineDet = {
                  shippingDate: BaseService.getAPIFormatedDate(plann.shippingDate),
                  promisedShipDate: BaseService.getAPIFormatedDate(plann.promisedShipDate),
                  requestedDockDate: BaseService.getAPIFormatedDate(plann.requestedDockDate),
                  carrierID: plann.carrierID || null,
                  shippingAddressID: plann.shippingAddressID || null,
                  shippingContactPersonID: plann.shippingContactPersonID || null,
                  shippingMethodID: plann.shippingMethodID || null,
                  releaseNotes: plann.releaseNotes || null,
                  shippingID: plann.shippingID,
                  customerReleaseLine: plann.customerReleaseLine,
                  qty: salesAllDetList.length === 1 ? vm.salesDetail.qty : plann.qty,
                  description: plann.description,
                  releaseNumber: plann.releaseNumber,
                  carrierAccountNumber: plann.carrierAccountNumber,
                  sDetID: vm.salesDetail.id,
                  poReleaseNumber: plann.poReleaseNumber
                };
                releaseLineList.push(objReleaseLineDet);
              }
            });
            const objReleaseLine = {
              id: vm.salesDetail.id,
              SODetail: releaseLineList,
              blanketPOID: vm.blanketPOSDetID,
              isFromDetail: true
            };
            vm.cgBusyLoading = SalesOrderFactory.saveSalesOrderLineDetail().query(objReleaseLine).$promise.then(() => {
              vm.isOpen = false;
              // vm.resetDetail(false, true);
              const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
              vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
                vm.holdunHoldList = response[1].data;
                vm.salesOrderDetailByID(response[0]);
                if (vm.detailSaveBtnCategory === vm.navDirection.NEW) {
                  vm.resetDetail(false, true);
                } else {
                  vm.navigateDetailRecords(vm.detailSaveBtnCategory, false);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }).catch((error) => BaseService.getErrorLog(error));
          } else if ((vm.salesDetail.requestedDockDate || vm.salesDetail.requestedShipDate) && vm.salesDetail.promisedShipDate && vm.salesDetail.partType !== vm.partTypes.Other) {
            const releaseLineList = [];
            const objReleaseLineDet = {
              shippingDate: vm.salesDetail.isAgreeToShip ? BaseService.getAPIFormatedDate(vm.salesDetail.SalesDetail[0].requestedShipDate) : BaseService.getAPIFormatedDate(vm.salesDetail.requestedShipDate),
              promisedShipDate: vm.salesDetail.isAgreeToShip ? BaseService.getAPIFormatedDate(vm.salesDetail.SalesDetail[0].promisedShipDate) : BaseService.getAPIFormatedDate(vm.salesDetail.promisedShipDate),
              requestedDockDate: vm.salesDetail.isAgreeToShip ? BaseService.getAPIFormatedDate(vm.salesDetail.SalesDetail[0].requestedDockDate) : BaseService.getAPIFormatedDate(vm.salesDetail.requestedDockDate),
              revisedRequestedDockDate: vm.salesDetail.isAgreeToShip ? BaseService.getAPIFormatedDate(vm.salesDetail.requestedDockDate) : BaseService.getAPIFormatedDate(vm.salesDetail.SalesDetail ? vm.salesDetail.SalesDetail[0].requestedDockDate : null),
              revisedRequestedShipDate: vm.salesDetail.isAgreeToShip ? BaseService.getAPIFormatedDate(vm.salesDetail.revisedRequestedShipDate) : BaseService.getAPIFormatedDate(vm.salesDetail.SalesDetail ? vm.salesDetail.SalesDetail[0].revisedRequestedShipDate : null),
              revisedRequestedPromisedDate: vm.salesDetail.isAgreeToShip ? BaseService.getAPIFormatedDate(vm.salesDetail.revisedRequestedPromisedDate) : BaseService.getAPIFormatedDate(vm.salesDetail.SalesDetail ? vm.salesDetail.SalesDetail[0].revisedRequestedPromisedDate : null),
              carrierID: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].carrierID || null : null,
              shippingAddressID: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].shippingAddressID : null,
              shippingContactPersonID: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].shippingContactPersonID : null,
              shippingMethodID: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].shippingMethodID : null,
              releaseNotes: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].releaseNotes : null,
              shippingID: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].shippingID : null,
              customerReleaseLine: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].customerReleaseLine : null,
              qty: vm.salesDetail.qty,
              description: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].description : null,
              releaseNumber: 1,
              carrierAccountNumber: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].carrierAccountNumber : null,
              sDetID: vm.salesDetail.id,
              isAgreeToShip: vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].isAgreeToShip : false,
              poReleaseNumber: vm.autoCompleteBlanketPOOption.keyColumnId === vm.BlanketPODetails.USEBPOANDRELEASE ? stringFormat('{0}-{1}', vm.salesorder.poNumber, vm.salesDetail.SalesDetail && vm.salesDetail.SalesDetail.length > 0 ? vm.salesDetail.SalesDetail[0].customerReleaseLine : null) : null
            };
            if (!objReleaseLineDet.revisedRequestedDockDate && !objReleaseLineDet.revisedRequestedShipDate && !objReleaseLineDet.revisedRequestedPromisedDate) {
              objReleaseLineDet.isAgreeToShip = false;
            }
            releaseLineList.push(objReleaseLineDet);

            const objReleaseLine = {
              id: vm.salesDetail.id,
              SODetail: releaseLineList,
              blanketPOID: vm.blanketPOSDetID,
              isFromDetail: true
            };
            vm.cgBusyLoading = SalesOrderFactory.saveSalesOrderLineDetail().query(objReleaseLine).$promise.then(() => {
              vm.isOpen = false;
              // vm.resetDetail(false, true);
              const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
              vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
                vm.holdunHoldList = response[1].data;
                vm.salesOrderDetailByID(response[0]);
                if (vm.detailSaveBtnCategory === vm.navDirection.NEW) {
                  vm.resetDetail(false, true);
                } else {
                  vm.navigateDetailRecords(vm.detailSaveBtnCategory, false);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.isOpen = false;
            // vm.resetDetail(false, true);
            const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
            vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
              vm.holdunHoldList = response[1].data;
              vm.salesOrderDetailByID(response[0]);
              if (vm.detailSaveBtnCategory === vm.navDirection.NEW) {
                vm.resetDetail(false, true);
              } else {
                vm.navigateDetailRecords(vm.detailSaveBtnCategory, false);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
        if (obj.isSOrevision && !(response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.err)) {
          vm.salesOrderDetails(vm.id);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // save order detail
    const saveSalesOrderDetailValidation = (objSoDetail, ev) => {
      const newlyAddedCommission = [];
      const updatedCommission = [];
      const deletedComissionIds = (objSoDetail && objSoDetail.salesCommissionDeltedIds) ? objSoDetail.salesCommissionDeltedIds : [];

      _.each(objSoDetail.salesCommissionList, (row) => {
        if (row.id > 0) {
          updatedCommission.push(row);
        }
        else {
          newlyAddedCommission.push(row);
        }
      });
      const obj = {
        refSalesOrderID: vm.id,
        lineID: objSoDetail.lineID,
        id: objSoDetail.id ? objSoDetail.id : 0,
        qty: objSoDetail.qty,
        price: objSoDetail.price,
        mrpQty: objSoDetail.mrpQty,
        kitQty: objSoDetail.kitQty || 0,
        materialTentitiveDocDate: BaseService.getAPIFormatedDate(objSoDetail.materialTentitiveDocDate),
        prcNumberofWeek: objSoDetail.prcNumberofWeek,
        isHotJob: objSoDetail.isHotJob,
        isHotJobValue: objSoDetail.isHotJob ? 'Yes' : 'No',
        materialDueDate: BaseService.getAPIFormatedDate(objSoDetail.materialDueDate),
        requestedBPOStartDate: BaseService.getAPIFormatedDate(objSoDetail.requestedBPOStartDate),
        blanketPOEndDate: BaseService.getAPIFormatedDate(objSoDetail.blanketPOEndDate),
        partID: objSoDetail.partID,
        uom: objSoDetail.uom,
        tentativeBuild: objSoDetail.tentativeBuild,
        shippingQty: objSoDetail.shippingQty ? objSoDetail.shippingQty : (objSoDetail.partType !== vm.partTypes.Other ? objSoDetail.SalesDetail.length : 1),
        remark: objSoDetail.remark,
        internalComment: objSoDetail.internalComment,
        refRFQGroupID: (objSoDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) ? objSoDetail.refRFQGroupID : null,
        quoteFrom: objSoDetail.quoteFrom,
        refRFQQtyTurnTimeID: (objSoDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id) ? objSoDetail.refRFQQtyTurnTimeID : null,
        refAssyQtyTurnTimeID: (objSoDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) ? (objSoDetail.refRFQQtyTurnTimeID ? objSoDetail.refRFQQtyTurnTimeID : vm.autocompleteQtyTurnTime.keyColumnId) : null,
        assyQtyTurnTimeText: (objSoDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) ? objSoDetail.qtyTurnTime : null,
        salesCommissionTo: objSoDetail.salesCommissionTo,
        custPOLineNumber: objSoDetail.custPOLineNumber,
        partCategory: objSoDetail.partCategory,
        partType: objSoDetail.partType,
        frequency: objSoDetail.partType === vm.partTypes.Other && vm.autocompleteSelectAssyID.keyColumnId ? vm.autoFrequency.keyColumnId : null,
        frequencyType: objSoDetail.partType === vm.partTypes.Other && vm.autocompleteSelectAssyID.keyColumnId ? vm.autoFrequencyType.keyColumnId : null,
        refBlanketPOID: vm.blanketPOSDetID || null,
        refSODetID: objSoDetail.partType === vm.partTypes.Other ? vm.autocompleteSelectAssyID.keyColumnId : null,
        refSOReleaseLineID: vm.autoCompleteReleaseLine ? vm.autoCompleteReleaseLine.keyColumnId : null,
        PIDCode: objSoDetail.PIDCode,
        kitNumber: objSoDetail.kitNumber,
        kitRemoveConfirmation: objSoDetail.kitRemoveConfirmation,
        isSkipKitCreationOld: objSoDetail.isSkipKitCreationOld,
        isSkipKitCreation: objSoDetail.isSkipKitCreation,
        partDescription: objSoDetail.partDescription,
        quoteNumber: objSoDetail.quoteNumber,
        mfgPN: objSoDetail.mfgPN,
        rohsIcon: objSoDetail.rohsIcon,
        rohsText: objSoDetail.rohsText,
        isCustom: objSoDetail.isCustom,
        newlyAddedCommission: newlyAddedCommission,
        updatedCommission: updatedCommission,
        deletedComissionIds: deletedComissionIds,
        isCustomerConsign: objSoDetail.isCustomerConsign,
        originalPOQty: objSoDetail.originalPOQty,
        custOrgPOLineNumber: objSoDetail.custOrgPOLineNumber
      };
      if (obj.id) {
        const totalQtySUM = _.sumBy(_.filter(objSoDetail.SalesDetail, (solist) => !solist.isTBD), (qtySum) => qtySum.qty);
        const totalLineItems = _.filter(objSoDetail.SalesDetail, (solist) => !solist.isTBD);
        if (totalQtySUM > objSoDetail.qty && totalLineItems.length > 1) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PO_QTY_RELEASE_QTY_NOT_MATCH_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, objSoDetail.qtyOld, objSoDetail.qty);
          const objs = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(objs).then((yes) => {
            if (yes) {
              obj.isRemoveReleaseLine = true;
              checkTotalSumForPOQty(obj, ev);
            }
          }, () => {
            vm.salesDetail.qty = vm.salesDetail.qtyOld;
            setFocus('qty');
            vm.isSaveButtonDisable = false;
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          checkDetailConfirmationSO(obj, ev);
        }
      } else {
        checkDetailConfirmationSO(obj, ev);
      }
    };
    // check sum mismatch or not
    const checkTotalSumForPOQty = (obj, ev) => {
      if (!obj.isSkipKitCreationOld && obj.isSkipKitCreation) {
        const query = {
          id: [obj.id],
          isSkipKitCreation: true
        };
        vm.cgBusyLoading = SalesOrderFactory.salesOrderDetailSkipKitValidation().query(query).$promise.then((response) => {
          if (response && response.data && response.data.KitReleaseCount && response.data.KitReleaseCount.length > 0) { // If kit release is done for sales detail
            const releasedKitList = _.filter([obj], (item) => _.map(response.data.KitReleaseCount, 'salesOrderDetID').includes(item.id)); //Filter released kit data
            const confirmation = {
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REMOVE_KIT_NOT_ALLOW_FOR_RELEASED_KIT_SAVE),
              skipKitList: releasedKitList,
              isConfirmation: false
            };
            DialogFactory.dialogService(
              CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_CONTROLLER, // Error popup in table format
              CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_VIEW,
              ev,
              confirmation).then(() => {
                setFocusByName(vm.autocompleteAssy.inputName);
              }, () => {
                setFocusByName(vm.autocompleteAssy.inputName);
              }, (error) => BaseService.getErrorLog(error));
          }
          else {
            const confirmation = {
              messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.REMOVE_KIT_ALLOCATION_SAVE_CONFIRMATION),
              skipKitList: [obj],
              isConfirmation: true
            };
            DialogFactory.dialogService(
              CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_CONTROLLER, // Confirmation popup in table format
              CORE.SALESORDER_SKIPKIT_CONFIRMATION_ERROR_VIEW,
              ev,
              confirmation).then(() => {
                vm.saveDisable = false;
              }, (data) => {
                if (data) {
                  if (obj.id && obj.isSkipKitCreation) {
                    obj.kitRemoveConfirmation = true;
                  }
                  checkDetailConfirmationSO(obj, ev);
                }
              }, (error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      } else {
        checkDetailConfirmationSO(obj, ev);
      }
    };
    const checkSalesOrderDetailPublishValidation = (event, objSoDetail) => {
      vm.oldStatuspublish = true;
      objSoDetail = _.clone(objSoDetail);
      const sourceData = [objSoDetail];
      const dataArray = _.map(sourceData, _.iteratee('partID'));
      const bomPromise = [validateAssemblyByAssyIDForSODetail(dataArray, objSoDetail)];
      vm.cgBusyLoading = $q.all(bomPromise).then((resData) => {
        resData = _.first(resData);
        if (resData.errorObjList && resData.errorObjList.length > 0) {
          const errorMessage = _.map(resData.errorObjList, (obj) => { if (obj.isAlert) { return obj.errorText; } }).join('<br/>');
          if (errorMessage) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_STATUS_CHANGE);
            messageContent.message = errorMessage;
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            vm.isSaveButtonDisable = false;
            DialogFactory.messageAlertDialog(obj);
            return;
          }
          const errorMsg = _.find(resData.errorObjList, (obj) => obj.isMessage && obj.isShippingAddressError);
          if (errorMsg) {
            vm.isSaveButtonDisable = false;
            const assyInvalidShippingList = [];
            _.each(resData.exportControlPartList, (partItem) => {
              let objAssy = {};
              objAssy = _.assign(partItem);
              const assyDets = _.find(sourceData, (soDet) => soDet.partID === partItem.partID);
              if (assyDets) {
                objAssy.PIDCode = assyDets.PIDCode;
                objAssy.partID = assyDets.partID;
                objAssy.rohsIcon = assyDets.rohsIcon;
                objAssy.rohsText = assyDets.rohsText;
                objAssy.mfgPN = assyDets.mfgPN;
                objAssy.nickName = assyDets.nickName;
                objAssy.description = assyDets.description;
                objAssy.isCustom = assyDets.isCustom;
              }
              assyInvalidShippingList.push(objAssy);
            });
            if (assyInvalidShippingList.length > 0) {
              vm.salesorder.status = vm.id ? angular.copy(vm.salesorderCopy.status) : vm.salesorder.status;
              const data = {
                assyList: assyInvalidShippingList,
                salesOrderNumber: vm.salesorder.salesOrderNumber,
                revision: vm.salesorder.revision,
                errorMessage: errorMsg.errorText,
                countryName: vm.intermediateAddress && vm.intermediateAddress.countryMst ? vm.intermediateAddress.countryMst.countryName : vm.shippingAddress.countryMst.countryName
              };
              DialogFactory.dialogService(
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER,
                CORE.VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW,
                event,
                data).then(() => {
                }, () => {
                }, (err) => BaseService.getErrorLog(err));
            }
          }
        } else {
          const nonBOMList = _.differenceBy(sourceData, resData.salesOrderPartList, 'partID');
          const assynonBOMList = [];
          _.each(nonBOMList, (bomItem) => {
            if (bomItem.partCategory === vm.PartCategory.SubAssembly) {
              const objAssy = {};
              objAssy.PIDCode = bomItem.PIDCode;
              objAssy.partID = bomItem.partID;
              objAssy.rohsIcon = bomItem.rohsIcon;
              objAssy.rohsText = bomItem.rohsText;
              objAssy.mfgPN = bomItem.mfgPN;
              objAssy.nickName = bomItem.nickName;
              objAssy.description = bomItem.description;
              objAssy.isCustom = bomItem.isCustom;
              assynonBOMList.push(objAssy);
            }
          });
          if (assynonBOMList.length > 0) {
            vm.isSaveButtonDisable = false;
            vm.salesorder.status = vm.id ? angular.copy(vm.salesorderCopy.status) : vm.salesorder.status;
            const data = {
              assyList: assynonBOMList,
              assyBOMValidation: true,
              salesOrderNumber: vm.salesorder.salesOrderNumber,
              revision: vm.salesorder.revision
            };
            DialogFactory.dialogService(
              CORE.VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_CONTROLLER,
              CORE.VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_VIEW,
              event,
              data).then(() => {
              }, () => {
              }, (err) => BaseService.getErrorLog(err));
          } else {
            const copySourceData = _.filter(sourceData, (assy) => assy.partCategory === vm.PartCategory.SubAssembly && !assy.isSkipKitCreation);
            const assyList = _.map(copySourceData, (data) => ({
              id: data.id || null,
              partID: data.partID
            }));
            vm.cgBusyLoading = SalesOrderFactory.getKitPlannedDetailOfSaleOrderAssy().save({ assyList: assyList }).$promise.then((responseData) => {
              if (responseData && responseData.data) {
                _.map(responseData.data, (data) => {
                  _.remove(copySourceData, (item) => {
                    if (item.partID === data.refAssyId) {
                      return item;
                    }
                  });
                });
                if (copySourceData && copySourceData.length > 0 && !objSoDetail.id) {
                  const PIDString = _.map(_.uniqBy(copySourceData, 'partID'), 'PIDCode').join(',');
                  if (PIDString) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PLANN_NOT_CREATED);
                    messageContent.message = stringFormat(messageContent.message, PIDString);
                    const obj = {
                      messageContent: messageContent,
                      btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                      canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    DialogFactory.messageConfirmDialog(obj).then((yes) => {
                      if (yes) {
                        saveSalesOrderDetailValidation(objSoDetail, event);
                      }
                    }, () => {
                      vm.isSaveButtonDisable = false;
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                } else {
                  saveSalesOrderDetailValidation(objSoDetail, event);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      });
    };
    // check bill of material added for sales order assembly or not
    const validateAssemblyByAssyIDForSODetail = (dataArray, objSoDetail) => {
      const checkShippingAssyList = [];
      _.each(objSoDetail.SalesDetail, (data) => {
        const shippingCountryDetObj = {};
        shippingCountryDetObj.partID = objSoDetail.partID;
        shippingCountryDetObj.countryID = vm.intermediateAddress && vm.intermediateAddress.countryID ? vm.intermediateAddress.countryID : data.countryID ? data.countryID : 0;
        shippingCountryDetObj.countryName = vm.intermediateAddress && vm.intermediateAddress.countryMst && vm.intermediateAddress.countryMst.countryName ? vm.intermediateAddress.countryMst.countryName : data.countryName ? data.countryName : vm.shippingAddress && vm.shippingAddress.countryMst ? vm.shippingAddress.countryMst.countryName : '';
        shippingCountryDetObj.qty = data.qty ? data.qty : 0;
        shippingCountryDetObj.lineID = objSoDetail.lineID ? objSoDetail.lineID : 0;
        checkShippingAssyList.push(shippingCountryDetObj);
      });
      if (checkShippingAssyList.length === 0) {
        const shippingCountryDetObj = {};
        shippingCountryDetObj.partID = objSoDetail.partID;
        shippingCountryDetObj.countryID = vm.intermediateAddress && vm.intermediateAddress.countryID ? vm.intermediateAddress.countryID : vm.shippingAddress && vm.shippingAddress.countryID ? vm.shippingAddress.countryID : 0;
        shippingCountryDetObj.countryName = vm.intermediateAddress && vm.intermediateAddress.countryMst && vm.intermediateAddress.countryMst.countryName ? vm.intermediateAddress.countryMst.countryName : vm.shippingAddress && vm.shippingAddress.countryMst ? vm.shippingAddress.countryMst.countryName : '';
        shippingCountryDetObj.qty = objSoDetail.qty ? objSoDetail.qty : 0;
        shippingCountryDetObj.lineID = objSoDetail.lineID ? objSoDetail.lineID : 0;
        checkShippingAssyList.push(shippingCountryDetObj);
      }
      const objCheckBOM = { partIDs: dataArray, shippingAddressID: vm.intermediateAddress && vm.intermediateAddress.id ? vm.intermediateAddress.id : vm.shippingAddress ? vm.shippingAddress.id : null, isFromSalesOrder: true, checkShippingAssyList: checkShippingAssyList };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //Remove row from parent ui grid
    vm.deleteRecord = (row) => {
      let det;
      if (row.entity) {
        det = angular.copy(row.entity);
      } else {
        det = angular.copy(row);
      }
      if (det && det.isCancle) { return; }
      if (det && det.id) {
        cellEditable(det, false, true).then((cellresponse) => {
          if (cellresponse) {
            if ((vm.salesDetStatus && (vm.salesDetStatus.vQtyRelease || vm.salesDetStatus.vQtyWprkorder)) || (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty)) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_REMOVE_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, det.PIDCode, det.lineID);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
              }).catch(() => BaseService.getErrorLog(error));
            }
            else {
              if (vm.soBlanketPOStatus && vm.soBlanketPOStatus.length > 0) {
                // aleart message
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_BLANKET_PO_REMOVE_ALERT);
                messageContent.message = stringFormat(messageContent.message, det.custPOLineNumber, vm.salesorder.poNumber, _.map(_.uniqBy(vm.soBlanketPOStatus, 'poNumber'), 'poNumber').join());
                const model = {
                  multiple: true,
                  messageContent: messageContent
                };
                return DialogFactory.messageAlertDialog(model).then(() => {
                }).catch(() => BaseService.getErrorLog(error));
              } else {
                removesalesorderMasterDetail(det);
              }
            }
          }
        });
      }
      else if (vm.selectedRowsList.length > 0) {
        vm.selectedRows = _.filter(vm.selectedRowsList, (Item) => Item.id);
        const selectedIDs = vm.selectedRows.map((soDet) => soDet.id);
        if (selectedIDs.length > 0) {
          cellMultiEditable(selectedIDs).then((cellresponse) => {
            if (!cellresponse) {
              const pidCodes = vm.selectedRows.map((soDet) => soDet.PIDCode).join(',');
              const lineIDs = vm.selectedRows.map((soDet) => soDet.lineID).join(',');
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_REMOVE_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, pidCodes, lineIDs);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
              }).catch(() => BaseService.getErrorLog(error));
            } else {
              vm.cgBusyLoading = getKitReleaseListBySalesOrderId(selectedIDs).then((response) => {
                vm.kitReleaseList = response;
                if (vm.kitReleaseList && vm.kitReleaseList.length > 0) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_RELEASE_DONE_FOR_SALES_ORDER);
                  const model = {
                    messageContent: messageContent,
                    multiple: false
                  };
                  return DialogFactory.messageAlertDialog(model);
                }
                else {
                  if ((vm.usedWorkOrderList && vm.usedWorkOrderList.length > 0) || (parseInt(vm.salesorder.status) === 0)) {
                    const assabelyDetail = _.intersectBy(_.map(vm.usedWorkOrderList, 'id'), selectedIDs);
                    if (assabelyDetail.length > 0) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PRODUCTION_STARTED_NOT_ALLOW_ANY_CHANGE);
                      const model = {
                        messageContent: messageContent,
                        multiple: true
                      };
                      DialogFactory.messageAlertDialog(model);
                      return false;
                    }
                    else {
                      removeSalesorderDetail(vm.selectedRowsList);
                    }
                  } else {
                    removeSalesorderDetail(vm.selectedRowsList);
                  }
                }
              });
            }
          });
        } else {
          removeSalesorderDetail(vm.selectedRowsList);
        }
      } else {
        removeSalesorderDetail([row]);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //removesalesorderDetail
    const removesalesorderMasterDetail = (row) => {
      if (row && row.InitialStock && row.InitialStock.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_NOT_DELETED_INITIAL_STOCK_CREATED);
        messageContent.message = stringFormat(messageContent.message, row.PIDCode + '| ' + row.lineID);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      vm.cgBusyLoading = getKitReleaseListBySalesOrderId([row.id]).then((response) => {
        vm.kitReleaseList = response;
        if (vm.kitReleaseList && vm.kitReleaseList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_RELEASE_DONE_FOR_SALES_ORDER);
          const model = {
            messageContent: messageContent,
            multiple: false
          };
          return DialogFactory.messageAlertDialog(model);
        }
        else {
          if ((vm.usedWorkOrderList && vm.usedWorkOrderList.length > 0) || (parseInt(vm.salesorder.status) === 0)) {
            const assabelyDetail = _.find(vm.usedWorkOrderList, (item) => item.id === row.id);
            if (assabelyDetail) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PRODUCTION_STARTED_NOT_ALLOW_ANY_CHANGE);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              return false;
            }
            else {
              removeSalesOrderRestrictDetail([row]);
            }
          } else {
            removeSalesOrderRestrictDetail([row]);
          }
        }
      });
    };
    // restrict user to remove delete option
    const removeSalesOrderRestrictDetail = (soDetailList) => {
      let isExist = false;
      let lineItem;
      const custPOLine = [];
      _.each(soDetailList, (item) => {
        const alreadyExist = _.find(vm.sourceData, (soData) => soData.refSODetID === item.id);
        if (alreadyExist) {
          isExist = true;
          lineItem = item.custPOLineNumber;
          custPOLine.push(alreadyExist.custPOLineNumber);
        }
      });
      if (isExist) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.RESTRICT_REMOVE_SO_OTHER_CHARGE);
        messageContent.message = stringFormat(messageContent.message, lineItem, custPOLine.map((soDet) => soDet));
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else {
        removeSalesorderDetail(soDetailList);
      }
    };
    //common remove code
    const removeSalesorderDetail = (row) => {
      if (row.length === vm.sourceData.length && parseInt(vm.salesorder.status)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_LINE_ALERT_MSG);
        messageContent.message = stringFormat(messageContent.message, vm.sourceData[0].custPOLineNumber);
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
      } else {
        let messageContent;
        if (_.find(row, (item) => item.isSkipKitCreation || item.partType === CORE.PartType.Other)) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CONFIRMATION_DELETE_SALES_ORDER_DETAIL);
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CONFIRMATION_DELETE_SALES_ORDER_DETAIL_WITH_KIT);
        }
        messageContent.message = stringFormat(messageContent.message, _.map(row, (item) => item.custPOLineNumber).join(','));
        const totalOtherParts = _.filter(row, (item) => item.partCategory === vm.PartCategory.SubAssembly);
        if (totalOtherParts === row.length) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Sales order details', row.length);
        }
        const objs = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(objs).then((yes) => {
          if (yes) {
            saveSalesOrderConfirmDetail(row, null, CORE.SO_CALL.REMOVE_SODET);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // remove sales order based on update version
    const removeSalesOrderDetailUpdateVersionConfirmation = (row) => {
      const selectedIDs = row.map((soDet) => soDet.id);
      const selectedBPOIdDs = row.map((soDet) => soDet.refBlanketPOID);
      const objSO = {
        id: selectedIDs,
        isSOrevision: vm.salesorder.isSOrevision,
        isAskForVersionConfirmation: vm.salesorder.isAskForVersionConfirmation,
        soID: vm.id,
        blanketPOID: selectedBPOIdDs[0]
      };
      return SalesOrderFactory.removeSalesOrderDetail().query(objSO).$promise.then(() => {
        const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
        vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
          vm.holdunHoldList = response[1].data;
          vm.salesOrderDetailByID(response[0]);
          if (objSO.isSOrevision) {
            vm.salesOrderDetails(vm.id);
          }
          vm.navigateDetailRecords(vm.navDirection.NEXT, true);
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get total release qty
    function getTotalReleaseQty(SalesOrderDetID) {
      SalesOrderFactory.getKitReleasedQty().query({ PSalesOrderDetID: SalesOrderDetID }).$promise.then((kit) => {
        if (kit && kit.data && kit.data.length > 0) {
          vm.totalReleaseQty = kit.data[0].ReleasedkitQty;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }


    vm.goToCustomerType = () => {
      BaseService.goToCustomerList();
    };

    vm.goPaymentTermList = () => {
      BaseService.goToGenericCategoryTermsList();
    };
    vm.goShippingMethodList = () => {
      BaseService.goToGenericCategoryShippingTypeList();
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //set shipping date
    vm.shippingDateOptions = {
      appendToBody: true,
      shippingDateOpenFlag: false
    };
    vm.onChangeshippingDate = () => {
      if (vm.salesDetailRelease.shippingDate) {
        vm.shippingDateOptions = {
          appendToBody: true,
          shippingDateOpenFlag: false
        };
      }
      vm.salesOrderDetForm.$dirty = true;
    };
    //Set customer consign material dock date

    vm.ccmDateOptions = {
      appendToBody: true
    };
    vm.onChangerequestedDockDate = () => {
      vm.requestedDockDateOptions = {
        appendToBody: true,
        minDate: vm.salesorder.poDate,
        requestedDockDateOpenFlag: false
      };
    };
    vm.onChangepromisedShipDate = () => {
      vm.promisedShipDateOptions = {
        appendToBody: true,
        minDate: vm.salesorder.poDate,
        promisedShipDateOpenFlag: false
      };
    };
    vm.onChangerequestedShipDate = () => {
      vm.requestedShipDateOptions = {
        appendToBody: true,
        minDate: vm.salesorder.poDate,
        requestedShipDateOpenFlag: false
      };
    };
    vm.onChangeblanketPOEndDate = () => {
      vm.blanketPOEndDateOptions = {
        appendToBody: true,
        minDate: vm.salesDetail.requestedBPOStartDate || vm.salesDetail.materialDueDate || vm.salesorder.poDate,
        blanketPOEndDateOpenFlag: false
      };
    };
    vm.onChangerequestedBPOStartDate = () => {
      vm.requestedBPOStartDateOptions = {
        appendToBody: true,
        minDate: vm.salesDetail.materialDueDate || vm.salesorder.poDate,
        requestedBPOStartDateOpenFlag: false
      };
    };
    vm.onChangeccmDate = () => {
      if (vm.salesDetail.materialTentitiveDocDate) {
        vm.ccmDateOptions = {
          appendToBody: true,
          ccmDateOpenFlag: false,
          minDate: vm.salesorder.poDate
        };
      }
      vm.salesOrderDetForm.$dirty = true;
    };

    //Set purchased material dock date
    vm.pmDateOptions = {
      appendToBody: true
    };
    vm.onChangepmDate = () => {
      if (vm.salesDetail.materialDueDate) {
        vm.pmDateOptions = {
          appendToBody: true,
          pmDateOpenFlag: false
        };
        vm.requestedBPOStartDateOptions = {
          appendToBody: true,
          minDate: vm.salesDetail.materialDueDate || vm.salesorder.poDate
        };
        vm.blanketPOEndDateOptions = {
          appendToBody: true,
          minDate: vm.salesDetail.requestedBPOStartDate || vm.salesDetail.materialDueDate || vm.salesorder.poDate
        };
      }
      vm.salesOrderDetForm.$dirty = true;
    };
    // check date validation
    vm.checkDateValidation = (isSODate) => {
      const poDate = vm.salesorder.poDate ? new Date($filter('date')(vm.salesorder.poDate, vm.DefaultDateFormat)) : vm.frmSalesOrderDetails.poDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderDetails.poDate.$viewValue, vm.DefaultDateFormat)) : null;
      const soDate = vm.salesorder.soDate ? new Date($filter('date')(vm.salesorder.soDate, vm.DefaultDateFormat)) : vm.frmSalesOrderDetails.soDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderDetails.soDate.$viewValue, vm.DefaultDateFormat)) : null;
      if (vm.frmSalesOrderDetails) {
        if (vm.frmSalesOrderDetails.poDate && vm.frmSalesOrderDetails.soDate && poDate && soDate) {
          if (isSODate && poDate <= soDate) {
            vm.salesorder.poDate = poDate;
            vm.frmSalesOrderDetails.poDate.$setValidity('maxvalue', true);
          }
          if (!isSODate && poDate <= soDate) {
            vm.salesorder.soDate = soDate;
            vm.frmSalesOrderDetails.soDate.$setValidity('minvalue', true);
          }
        }
      }
    };
    // check PO date validation
    vm.checkPODateValidation = () => {
      const poDate = vm.salesorder.poDate ? new Date($filter('date')(vm.salesorder.poDate, _dateDisplayFormat)) : vm.frmSalesOrderDetails.poDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderDetails.poDate.$viewValue, _dateDisplayFormat)) : null;
      const poRevDate = vm.salesorder.poRevisionDate ? new Date($filter('date')(vm.salesorder.poRevisionDate, _dateDisplayFormat)) : vm.frmSalesOrderDetails.poRevisionDate.$viewValue ? new Date($filter('date')(vm.frmSalesOrderDetails.poRevisionDate.$viewValue, _dateDisplayFormat)) : null;
      if (vm.frmSalesOrderDetails) {
        if (vm.frmSalesOrderDetails.poDate && vm.frmSalesOrderDetails.poRevisionDate && poDate && poRevDate) {
          if (poRevDate < poDate) {
            vm.salesorder.poRevisionDate = poRevDate;
            vm.frmSalesOrderDetails.poRevisionDate.$setValidity('minvalue', false);
          }
          if (poRevDate >= poDate) {
            vm.salesorder.poRevisionDate = poRevDate;
            vm.frmSalesOrderDetails.poRevisionDate.$setValidity('minvalue', true);
          }
        }
      }
    };
    //Set purchase order date in onchange
    vm.onChangesoDate = (soDate) => {
      if (vm.salesorder.soDate) {
        vm.poDateOptions = {
          maxDate: soDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
        vm.checkDateValidation(true);
      }
    };
    //Set sales order date in onchange min value
    vm.onChangePoDate = (poDate) => {
      if (vm.salesorder.poDate) {
        vm.soDateOptions = {
          maxDate: vm.todayDate,
          minDate: poDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
        vm.poRevisionDateOptions = {
          minDate: vm.salesorder.poDate,
          maxDate: vm.todayDate,
          appendToBody: true,
          checkoutTimeOpenFlag: false
        };
      }
      vm.checkDateValidation();
      vm.checkPODateValidation();
    };


    angular.element(() => {
      resetSalesOrderDetForm();
      BaseService.currentPageForms = [vm.frmSalesOrderDetails, vm.salesOrderDetForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.frmSalesOrder = vm.frmSalesOrderDetails;
        $scope.$parent.vm.salesOrderDetForm = vm.salesOrderDetForm;
        $scope.$parent.vm.status = vm.salesorder.status;
        $scope.$parent.vm.saveSalesOrder = vm.CheckStepAndAction;
        $scope.$parent.vm.changeSalesStatus = vm.changeSalesStatus;
        $scope.$parent.vm.activeTab = 0;
        $scope.$parent.vm.checkPartStatusOfSalesOrder = vm.checkPartStatusOfSalesOrder;
        $scope.$parent.vm.redirectToSOAnchorTag = redirectToSOAnchorTag;
        vm.checkHeaderDetail();
      }
      if (vm.id) {
        vm.isFocus = false;
        $timeout(() => {
          vm.isFocus = true;
        });
      }
    });

    vm.ViewAssemblyStockStatus = (row, event) => {
      const data = row;
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    // check bill of material added for sales order assembly or not
    const validateAssemblyByAssyID = (dataArray) => {
      const checkShippingAssyList = [];
      _.each(vm.sourceData, (item) => {
        if (item.partType !== vm.partTypes.Other) {
          _.each(item.SalesDetail, (data) => {
            const shippingCountryDetObj = {};
            shippingCountryDetObj.partID = item.partID;
            shippingCountryDetObj.countryID = vm.intermediateAddress && vm.intermediateAddress.countryID ? vm.intermediateAddress.countryID : data.countryID ? data.countryID : 0;
            shippingCountryDetObj.countryName = vm.intermediateAddress && vm.intermediateAddress.countryMst && vm.intermediateAddress.countryMst.countryName ? vm.intermediateAddress.countryMst.countryName : data.countryName ? data.countryName : vm.shippingAddress && vm.shippingAddress.countryMst ? vm.shippingAddress.countryMst.countryName : '';
            shippingCountryDetObj.qty = data.qty ? data.qty : 0;
            shippingCountryDetObj.lineID = item.lineID ? item.lineID : 0;
            checkShippingAssyList.push(shippingCountryDetObj);
          });
        }
      });
      const objCheckBOM = { partIDs: dataArray, shippingAddressID: vm.intermediateAddress && vm.intermediateAddress.id ? vm.intermediateAddress.id : vm.shippingAddress ? vm.shippingAddress.id : null, isFromSalesOrder: true, checkShippingAssyList: checkShippingAssyList };
      return WorkorderFactory.validateAssemblyByAssyID().update({ obj: objCheckBOM }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //go to component bill of material tab
    vm.goToComponentBOM = (partID) => {
      BaseService.goToComponentBOM(partID);
      return false;
    };

    const getKitReleaseListBySalesOrderId = (id) => SalesOrderFactory.getKitReleaseListBySalesOrderId().query({ id: id }).$promise.then((response) => {
      if (response.data) {
        const releaseKit = response.data.ReleaseList;
        return releaseKit;
      }
    }).catch((error) => BaseService.getErrorLog(error));


    //go to employee page list
    vm.employeelist = () => {
      BaseService.goToPersonnelList();
    };
    // initialize auto complete for customer,employee
    const initSalesCommissionAutoComplete = () => {
      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: vm.salesorder && vm.salesorder.salesCommissionTo ? vm.salesorder.salesCommissionTo : null,
        inputName: 'Sales Commission To',
        placeholderName: 'Sales Commission To',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getSalesCommissionEmployeeListbyCustomer
      };
    };

    // get sales Commission to employee list
    const getSalesCommissionEmployeeListbyCustomer = () => EmployeeFactory.getEmployeeListByCustomer().query({ customerID: vm.autoCompleteCustomer.keyColumnId, salesCommissionToID: vm.salesorder.salesCommissionTo }).$promise.then((employees) => {
      if (employees && employees.data) {
        vm.SalesCommissionEmployeeList = angular.copy(employees.data);
        _.each(vm.SalesCommissionEmployeeList, (item) => {
          if (item.profileImg) {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        if (!vm.autoCompleteSalesCommosssionTo) {
          initSalesCommissionAutoComplete();
        };
        return $q.resolve(vm.SalesCommissionEmployeeList);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    //other part type component
    const getotherTypecomponent = () => SalesOrderFactory.getOtherPartTypeComponentDetails().query().$promise.then((charges) => {
      if (charges && charges.data) {
        vm.OtherPartTypeComponents = angular.copy(charges.data);
        return $q.resolve(vm.OtherPartTypeComponents);
      }
    }).catch((error) => BaseService.getErrorLog(error));


    //go to rfq list page
    vm.rfqListPage = () => {
      BaseService.goToRFQList();
      return;
    };
    vm.openOtherCharges = (id, ev) => {
      const objSO = _.find(vm.sourceData, (item) => item.id === id);
      if (objSO) {
        vm.gotoSalesOrderOtherCharges(objSO, ev);
      }
    };
    //open popup for salesorder other charges
    vm.gotoSalesOrderOtherCharges = (row, ev) => {
      if (vm.id && row.id) {
        cellEditable(row, true).then((cellresponse) => {
          openSalesOrderOtherCharges(row, ev, cellresponse);
        });
      } else {
        openSalesOrderOtherCharges(row, ev, true);
      }
    };
    //open sales order other charges
    const openSalesOrderOtherCharges = (row, ev, cellresponse) => {
      const objEntity = _.clone(row);
      objEntity.soNumber = vm.salesorder.salesOrderNumber;
      objEntity.soID = vm.id;
      objEntity.poNumber = vm.salesorder.poNumber;
      objEntity.version = vm.salesorder.revision;
      objEntity.blanketPOOption = vm.salesorder.blanketPOOption;
      objEntity.isLegacyPO = vm.salesorder.isLegacyPO;
      objEntity.isRmaPO = vm.salesorder.isRmaPO;
      objEntity.isDisable = (!cellresponse || vm.isDisable || objEntity.isCancle);
      objEntity.salesFilterDet = [...vm.salesFilterDet];
      objEntity.salesOtherFilterDet = _.filter(vm.salesOtherFilterDet, (item) => item.refSODetID === objEntity.id);
      objEntity.sourceData = [...vm.sourceData];
      DialogFactory.dialogService(
        CORE.SALESORDER_OTHER_EXPENSE_MODAL_CONTROLLER,
        CORE.SALESORDER_OTHER_EXPENSE_MODAL_VIEW,
        ev,
        objEntity).then(() => {
        }, (data) => {
          if (data && data.isDirty) {
            if (parseInt(vm.salesorder.status) && vm.bomAssignedQtyList && vm.bomAssignedQtyList.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKET_PO_CHANGE_STRICT_VALIDATION_ALERT);
              let poNumbers = '';
              _.each(vm.bomAssignedQtyList, (bomAssign) => {
                poNumbers = stringFormat('{0},{0}', poNumbers, redirectToSOAnchorTag(bomAssign.id, bomAssign.poNumber));
              });
              poNumbers = poNumbers.substring(1);
              messageContent.message = stringFormat(messageContent.message, redirectToSOAnchorTag(vm.id, vm.salesorder.poNumber), poNumbers);
              const obj = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(obj).then(() => {
                vm.rowEntityID = row.id;
                saveSalesOrderConfirmDetail(data, ev, CORE.SO_CALL.OTHER_CHRG);
              });
            } else {
              vm.rowEntityID = row.id;
              saveSalesOrderConfirmDetail(data, ev, CORE.SO_CALL.OTHER_CHRG);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    // save and update revision after change
    const saveOtherChargesRevisionUpdate = (data) => {
      let maxID = 0;
      _.each(data.otherDetails, (soDetailItem) => {
        if (soDetailItem.isSoLevelOtherCharges && !soDetailItem.id) {
          const maxLine = _.maxBy(vm.sourceData, (charges) => parseInt(charges.lineID));
          if (maxLine) {
            soDetailItem.lineID = parseInt(maxLine.lineID) + 1 + maxID;
            maxID++;
          }
        };
      });
      if (parseInt(vm.salesorder.status)) {
        vm.salesorder.isAskForVersionConfirmation = false;
      }
      const objOtherCharges = {
        id: vm.rowEntityID,
        otherChargesList: data.otherDetails,
        isSOrevision: vm.salesorder.isSOrevision,
        isAskForVersionConfirmation: vm.salesorder.isAskForVersionConfirmation,
        soID: vm.id
      };
      SalesOrderFactory.saveSalesOrderOtherCharges().query(objOtherCharges).$promise.then(() => {
        const autocompleteSOPromise = [vm.salesOrderDetails(vm.id), vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
        vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
          vm.holdunHoldList = response[2].data;
          vm.salesOrderDetailByID(response[1]);
          const obj = vm.sourceData[vm.currentSODetIndex];
          vm.EditSalesMasterDetail(obj, true);
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //change release line
    vm.changeReleaseLine = () => {
      if (vm.salesDetail.shippingQty !== 1 && !vm.salesDetail.lineID && vm.salesDetailRelease) {
        vm.salesDetailRelease.shippingDate = null;
        vm.salesDetailRelease.promisedShipDate = null;
      }
    };

    //go to workorder page
    vm.gotoWorkOrder = (row) => {
      if (row) {
        BaseService.goToWorkorderDetails(row.WoSalesOrderDetails.woID);
      }
    };

    vm.goToComponentDetailTab = (id) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, id, USER.PartMasterTabs.Detail.Name);
    };

    vm.goToRFQUpdate = (id, assyID) => {
      BaseService.goToRFQUpdate(id, assyID);
    };
    vm.goToComponentSalesPriceMatrixTab = (partId) => {
      BaseService.goToComponentSalesPriceMatrixTab(partId);
    };

    //check unique customer po line
    vm.checkCustomerPOLine = (otherLine) => {
      vm.iscustPO = false;
      const checkUnique = _.find(vm.sourceData, (item) => item.lineID !== vm.salesDetail.lineID && item.custPOLineNumber === vm.salesDetail.custPOLineNumber);
      if (checkUnique) {
        vm.iscustPO = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'PO Line#');
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.iscustPO = false;
            vm.salesDetail.custPOLineNumber = null;
            setFocus(otherLine ? 'custPOLineNumberOtherCharges' : 'custPOLineNumber');
          }
        }).catch(() => BaseService.getErrorLog(error));
      }
    };

    vm.checkRFQQuoteNumberUnique = () => {
      if (vm.salesDetail.quoteNumber && !vm.autoCompleteQuoteGroup.keyColumnId) {
        SalesOrderFactory.checkRFQQuoteNumberUnique().query({ quoteNumber: vm.salesDetail.quoteNumber }).$promise.then((response) => {
          if (response && response.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Quote#');
            const obj = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (yes) {
                vm.salesDetail.quoteNumber = null;
                setFocus('quoteNumber');
              }
            }).catch(() => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.ChangeSkipKitCreation = () => {
      if (vm.salesDetail.isSkipKitCreation) {
        vm.salesDetail.mrpQty = vm.salesDetail.kitQty = 0;
      }
    };
    vm.removeMarkAddress = (ev, callBackData) => {
      if (callBackData) {
        callBackData.addressType = CORE.AddressType.IntermediateAddress;
        vm.removeAddress(ev, callBackData);
      }
    };
    // call back to refresh details
    vm.refreshAddress = (ev, callBackData) => {
      const autocompleteCustomerPromise = [getCustomerAddress(vm.autoCompleteCustomer.keyColumnId)];
      vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
        if (callBackData.addressType === CORE.AddressType.BillingAddress) {
          setOtherDetForCustAddrDir(vm.autoCompleteCustomer.keyColumnId);
        } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
          setMarkOtherDetForCustAddrDir(vm.autoCompleteCustomer.keyColumnId);
        } else {
          setShipOtherDetForCustAddrDir(vm.autoCompleteCustomer.keyColumnId);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // delete contact person call back
    vm.removeAddress = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      if (callBackData.addressType === CORE.AddressType.BillingAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.BillingAddress);
      } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      } else {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.ShippingAddress);
      }
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callBackData.addressType === CORE.AddressType.BillingAddress) {
            vm.billingAddress = null;
            vm.salesorder.billingAddressID = null;
            vm.selectedContactPerson = null;
            vm.salesorder.billingContactPerson = null;
            vm.salesorder.billingContactPersonID = null;
            vm.custAddrViewActionBtnDet.Delete.isDisable = vm.custAddrViewActionBtnDet.Update.isDisable = true;
            vm.contPersonViewActionBtnDet.Delete.isDisable = vm.contPersonViewActionBtnDet.Update.isDisable = true;
          } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.intermediateAddress = null;
            vm.salesorder.intermediateShipmentId = null;
            vm.selectedMarkContactPerson = null;
            vm.salesorder.intermediateContactPerson = null;
            vm.salesorder.intermediateContactPersonID = null;
            vm.custMarkAddrViewActionBtnDet.Delete.isDisable = vm.custMarkAddrViewActionBtnDet.Update.isDisable = true;
            vm.contMarkPersonViewActionBtnDet.Delete.isDisable = vm.contMarkPersonViewActionBtnDet.Update.isDisable = true;
          } else {
            vm.shippingAddress = null;
            vm.salesorder.shippingAddressID = null;
            vm.selectedShipContactPerson = null;
            vm.salesorder.shippingContactPerson = null;
            vm.salesorder.shippingContactPersonID = null;
            vm.custShipAddrViewActionBtnDet.Delete.isDisable = vm.custShipAddrViewActionBtnDet.Update.isDisable = true;
            vm.contShipPersonViewActionBtnDet.Delete.isDisable = vm.contShipPersonViewActionBtnDet.Update.isDisable = true;
          }
          vm.frmSalesOrderDetails.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };
    // delete contact person call back
    vm.deleteAddrContanctPersonCallBack = (ev, callBackData) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      if (callBackData.addressType === CORE.AddressType.BillingAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.BillingAddress);
      } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      } else {
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.ShippingAddress);
      }
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callBackData.addressType === CORE.AddressType.BillingAddress) {
            vm.selectedContactPerson = null;
            vm.salesorder.billingContactPerson = null;
            vm.salesorder.billingContactPersonID = null;
            vm.contPersonViewActionBtnDet.Delete.isDisable = vm.contPersonViewActionBtnDet.Update.isDisable = true;
          } else if (callBackData.addressType === CORE.AddressType.IntermediateAddress) {
            vm.selectedMarkContactPerson = null;
            vm.salesorder.intermediateContactPerson = null;
            vm.salesorder.intermediateContactPersonID = null;
            vm.contMarkPersonViewActionBtnDet.Delete.isDisable = vm.contMarkPersonViewActionBtnDet.Update.isDisable = true;
          } else {
            vm.selectedShipContactPerson = null;
            vm.salesorder.shippingContactPerson = null;
            vm.salesorder.shippingContactPersonID = null;
            vm.contShipPersonViewActionBtnDet.Delete.isDisable = vm.contShipPersonViewActionBtnDet.Update.isDisable = true;
          }
          vm.frmSalesOrderDetails.$$controls[0].$setDirty();
        }
      }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };
    //remove selected contact person
    vm.removeMarkContactPerson = (ev, callBackData) => {
      if (callBackData) {
        callBackData.addressType = CORE.AddressType.IntermediateAddress;
        vm.deleteAddrContanctPersonCallBack(ev, callBackData);
      }
    };

    vm.showRemark = (row, ev) => {
      const headerData = [{
        label: 'SO Line#',
        value: row.lineID,
        displayOrder: 1
      },
      {
        label: 'Assy ID/PID',
        value: row.PIDCode,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToPartList();
        },
        valueLinkFn: () => {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.partID, USER.PartMasterTabs.Detail.Name);
        },
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: row.rohsIcon,
          imgDetail: row.rohsText
        }
      }];
      const PopupData = {
        title: 'Line Shipping Comments',
        description: row.remark,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        PopupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.showReleaseLevelComment = () => {
      const headerData = [{
        label: 'SO Line#',
        value: row.lineID,
        displayOrder: 1
      },
      {
        label: 'Assy ID/PID',
        value: row.PIDCode,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToPartList();
        },
        valueLinkFn: () => {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.partID, USER.PartMasterTabs.Detail.Name);
        },
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: row.rohsIcon,
          imgDetail: row.rohsText
        }
      }];
      const PopupData = {
        title: 'Comments',
        description: row.releaseLevelComment,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        PopupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.onChangeQuoteFrom = (id, event, isChange) => {
      if ((vm.salesDetail && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) &&
        (vm.salesDetail.isCommissionDataEdited ||
          (vm.salesDetail.id > 0 && vm.salesDetail.salesCommissionList.length > 0))) {
        changeConfirmation(TRANSACTION.OnChangeCommissionType.quoteFrom);
      }
      else {
        vm.changeSalesCommissionFromPartOrRFQ(id, event, isChange);
      }
    };

    vm.changeSalesCommissionFromPartOrRFQ = (id, event, isChange) => {
      vm.salesDetail.quoteNumber = null;
      switch (vm.salesDetail.quoteFrom) {
        case vm.salesCommissionFrom.FromPartMaster.id: {
          if (isChange) {
            vm.salesDetail.extPrice = null;
            vm.salesDetail.price = null;
            vm.autocompleteQtyTurnTime.keyColumnId = null;
          }
          getQtyTurnTimeByAssyId(id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId);
          break;
        }
        case vm.salesCommissionFrom.NA.id:
          {
            if (isChange) {
              vm.salesDetail.extPrice = null;
              vm.salesDetail.price = null;
              vm.autocompleteQtyTurnTime.keyColumnId = null;
            }
            if (id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId) {
              vm.autoCompleteQuoteGroup.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName, null);
              $scope.$broadcast(vm.autoCompleteQuoteGroup.inputName + 'searchText', null);
            }
            if (!vm.salesDetail.id) { vm.salesDetail.salesCommissionList = []; }
          }
          break;
        case vm.salesCommissionFrom.FromRFQ.id:
          {
            if (isChange) {
              vm.salesDetail.extPrice = null;
              vm.salesDetail.price = null;
              vm.autocompleteQtyTurnTime.keyColumnId = null;
            }
            if (vm.quoteGroupDetails && vm.quoteGroupDetails.length === 1) {
              vm.autoCompleteQuoteGroup.keyColumnId = vm.quoteGroupDetails[0].rfqrefID;
              vm.salesDetail.quoteNumber = vm.quoteGroupDetails[0].quoteNumber;
            }
            else if ((!vm.quoteGroupDetails || vm.quoteGroupDetails.length === 0) && (id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId)) {
              getrfqQuoteGroupList(id || vm.autocompleteAssy.keyColumnId);
            }
            if (vm.autoCompleteQuoteGroup.keyColumnId && (id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId)) {
              getrfqQuoteQtyTurnTimeList(vm.autoCompleteQuoteGroup.keyColumnId, (id || vm.autocompleteAssy.keyColumnId));
            }
          }
          break;
      };
      if (vm.salesDetail.quoteFrom !== vm.salesCommissionFrom.NA.id) {
        vm.changeQty(event, vm.qtyType.POQTY);
      }
    };

    vm.onChangePOQty = (id, ev) => {
      if (!vm.salesorder.isBlanketPO && vm.blanketPOSDetID) {
        if (vm.availableQty && vm.salesDetail.qty > vm.availableQty && !isopen && !vm.salesDetail.isAlreadyConfirmQty) {
          isopen = true;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_QTY_MORE_VALIDATION);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            setFocus('qty');
            return;
          });
        } else {
          checkedQty(id, ev);
        }
      } else { checkedQty(id, ev); }
    };

    // check blanket PO Qty greater to blanket po or not
    const checkedQty = (id, ev) => {
      if (vm.salesorder.isBlanketPO && vm.usedQty && (vm.salesDetailCopy && vm.salesDetailCopy.qty !== vm.salesDetail.qty) && vm.salesDetail.qty < vm.usedQty) {
        vm.blanketPOAssy(ev, true);
      }
      if ((vm.salesShippedStatus && vm.salesShippedStatus.shippedqty > vm.salesDetail.qty) || (vm.salesDetStatus && (vm.salesDetStatus.vQtyRelease > vm.salesDetail.qty || vm.salesDetStatus.vQtyWprkorder > vm.salesDetail.qty))) {
        vm.changeQty(null, vm.qtyType.POQTY);
      }
      else if ((vm.salesDetail.id && vm.salesDetail.qtyOld !== vm.salesDetail.qty) && (vm.salesDetail && vm.salesDetail.salesCommissionList && vm.salesDetail.salesCommissionList.length > 0) && (vm.salesDetail.isCommissionDataEdited || (vm.salesDetail.id > 0 && vm.salesDetail.salesCommissionList.length > 0))) {
        changeConfirmation(TRANSACTION.OnChangeCommissionType.poQty);
      }
      else if (vm.salesDetail && vm.salesDetail.qtyOld !== vm.salesDetail.qty) {
        vm.changePOQty(id);
      } else if (!vm.salesDetail.qty) {
        vm.autocompleteQtyTurnTime.keyColumnId = null;
        vm.salesDetail.price = null;
        vm.salesDetail.extPrice = null;
        vm.quoteQtyTurnTimeDetails = [];
      }
    };

    vm.changePOQty = (id) => {
      if (vm.salesDetailCopy && vm.salesDetail && vm.salesDetailCopy.qty === vm.salesDetail.qty) { return; }
      vm.autocompleteQtyTurnTime.keyColumnId = null;
      vm.quoteQtyTurnTimeDetails = [];
      switch (vm.salesDetail.quoteFrom) {
        case vm.salesCommissionFrom.FromPartMaster.id:
        case vm.salesCommissionFrom.NA.id:
          {
            if (id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId) {
              if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
                if (!vm.quoteQtyTurnTimeList || vm.quoteQtyTurnTimeList.length === 0 && !vm.salesDetail.isBPO) {
                  const promise = [getQtyTurnTimeByAssyId(id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId, vm.salesDetail.id)];
                  vm.cgBusyLoading = $q.all(promise).then((response) => {
                    vm.getSalesCommissionDetailsOnPriceChange();
                  });
                } else {
                  setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
                }
              }
            }
          }
          break;
        case vm.salesCommissionFrom.FromRFQ.id:
          {
            if (vm.autoCompleteQuoteGroup.keyColumnId && (id || vm.autocompleteAssy.keyColumnId || vm.autoCompleteOrgPODetail.keyColumnId)) {
              setQtyTurnTimeValue(vm.quoteQtyTurnTimeList);
            }
          }
          break;
      };
    };

    //show internal comments
    vm.showInternalComment = (row, ev) => {
      const headerData = [{
        label: 'SO Line#',
        value: row.lineID,
        displayOrder: 1
      },
      {
        label: 'Assy ID/PID',
        value: row.PIDCode,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToPartList();
        },
        valueLinkFn: () => {
          BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, row.partID, USER.PartMasterTabs.Detail.Name);
        },
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: row.rohsIcon,
          imgDetail: row.rohsText
        }
      }];
      const PopupData = {
        title: 'Line Internal Notes',
        description: row.internalComment,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        PopupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //go to customer contact person list page
    vm.goToCustContactPersonList = () => {
      BaseService.goToCustomerContactPersonList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.autoCompleteCustomer.keyColumnId);
    };
    //go to customer billing address list page
    vm.goToCustBillingAddressList = () => {
      BaseService.goToCustomerBillingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.autoCompleteCustomer.keyColumnId);
    };
    //go to customer shipping address list page
    vm.goToCustShippingAddressList = () => {
      BaseService.goToCustomerShippingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.autoCompleteCustomer.keyColumnId);
    };
    //get component shipping comments detail details
    const getShippingCommentList = (id) => {
      if (id) {
        vm.cgBusyLoading = ComponentFactory.getPartMasterCommentsByPartId().query({
          partId: id,
          category: 'S'
        }).$promise.then((purchaseInspection) => {
          if (purchaseInspection && !vm.salesDetail.remark) {
            vm.salesDetail.remark = _.map(_.map(_.filter(purchaseInspection.data || [], (data) => data.inspectionmst && data.inspectionmst.requiementType === 'C' ? data.inspectionmst : null), (item) => item.inspectionmst), 'requirement').join('\r');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function changeConfirmation(changeType) {
      if (vm.isReset) {
        return;
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_COMMISSION_RESET_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, changeType.value);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (!vm.salesDetail.salesCommissionDeltedIds) {
            vm.salesDetail.salesCommissionDeltedIds = [];
          }
          /*maintain delted ids only for saved rows, no need to maintain deleted ids for newly added rows*/
          if (vm.salesDetail.id > 0) {
            _.map(vm.salesDetail.salesCommissionList, (dataRow) => {
              /*maintain saved commission row ids, no need to maintain for unsaved rows*/
              if (dataRow.id > 0) {
                vm.salesDetail.salesCommissionDeltedIds.push({ id: dataRow.id, refSalesorderdetID: dataRow.refSalesorderdetID });
              }
            });
          }

          vm.salesDetail.isCommissionDataEdited = false;
          vm.salesDetail.salesCommissionList = [];
          //vm.getSalesCommissionDetailsOnPriceChange();
          switch (changeType.id) {
            case TRANSACTION.OnChangeCommissionType.assyId.id:
              vm.salesDetail.price = null;
              vm.salesDetail.qty = null;
              vm.salesDetail.extPrice = null;
              vm.autocompleteQtyTurnTime.keyColumnId = null;
              setAssymblyDetails();
              setFocusByName(vm.autocompleteAssy.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.quoteFrom.id:
              vm.salesDetail.price = null;
              vm.salesDetail.qty = null;
              vm.salesDetail.extPrice = null;
              vm.autocompleteQtyTurnTime.keyColumnId = null;
              if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.NA.id) {
                vm.salesDetail.quoteNumber = null;
              }
              setFocusByName('quoteFrom');
              break;
            case TRANSACTION.OnChangeCommissionType.quoteGroup.id:
              vm.autocompleteQtyTurnTime.keyColumnId = null;
              vm.salesDetail.quoteNumber = null;
              vm.salesDetail.price = null;
              vm.salesDetail.extPrice = null;
              vm.changePrice();
              setFocusByName(vm.autoCompleteQuoteGroup.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.poQty.id:
              setFocusByName('qty');
              break;
            case TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime.id:
              vm.salesDetail.price = null;
              vm.changePrice();
              setFocusByName(vm.autocompleteQtyTurnTime.inputName);
              break;
            case TRANSACTION.OnChangeCommissionType.price.id:
              vm.changePrice();
              vm.getSalesCommissionDetailsOnPriceChange();
              setFocusByName('isSkipKitCreation');
              break;
          }
        }
      }, () => {
        switch (changeType.id) {
          case TRANSACTION.OnChangeCommissionType.assyId.id:
            vm.isAssyChange_No_OptionSelected = true;
            if (!vm.salesorder.isRmaPO) {
              vm.autocompleteAssy.keyColumnId = vm.salesDetailCopy.partID;
            } else {
              vm.autoCompleteOrgPODetail.keyColumnId = vm.salesDetailCopy.partID;
            }
            getcomponentAssemblyList({
              partID: vm.salesDetailCopy.partID
            });
            setFocusByName(vm.autocompleteAssy.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.quoteFrom.id:
            vm.salesDetail.quoteFrom = vm.salesDetailCopy.quoteFrom;
            setFocusByName('quoteFrom');
            break;
          case TRANSACTION.OnChangeCommissionType.quoteGroup.id:
            vm.autoCompleteQuoteGroup.keyColumnId = vm.salesDetail.refRFQGroupID;
            setFocusByName(vm.autoCompleteQuoteGroup.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.poQty.id:
            vm.salesDetail.qty = vm.salesDetailCopy.qty;
            setFocusByName('qty');
            break;
          case TRANSACTION.OnChangeCommissionType.quoteQtyTurnTime.id:
            vm.isQtyTurnTime_No_OptionSelected = true;
            vm.autocompleteQtyTurnTime.keyColumnId = vm.salesDetailCopy.refRFQQtyTurnTimeID;
            setFocusByName(vm.autocompleteQtyTurnTime.inputName);
            break;
          case TRANSACTION.OnChangeCommissionType.price.id:
            vm.salesDetail.price = vm.salesDetailCopy.price ? parseFloat(vm.salesDetailCopy.price) : 0;
            setFocusByName('price');
            break;
        }
      });
    }

    // go to manufacturer detail page
    vm.goToManufacturerDetail = (id) => {
      BaseService.goToManufacturer(id);
    };
    // go to manufacturer list page
    vm.gotoManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    //get component part comments
    const getPartInternalCommentList = (id) => {
      if (id) {
        vm.cgBusyLoading = ComponentFactory.getPartMasterInternalCommentsByPartId().query({
          partId: id
        }).$promise.then((purchaseInspection) => {
          if (purchaseInspection && !vm.salesDetail.internalComment) {
            vm.salesDetail.internalComment = _.map(purchaseInspection.data, 'comment').join('\r');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    let isopen = false;
    // check unique po# cusromer wise
    vm.checkUniqueCustomerPONumber = () => {
      if (!vm.salesorder.poNumber || !vm.autoCompleteCustomer) { return; }
      if (vm.salesorder.isRmaPO) {
        return true;
      }
      if (vm.salesorder.isInitialStockAdded && vm.salesorder.poNumber !== vm.salesorderCopy.poNumber) {
        const assyList = vm.salesorder && vm.salesorder.InitialStockMst ? _.map(_.map(vm.salesorder.InitialStockMst, (item) => item.componentAssembly), (det) => det.PIDCode).join(',') : [];
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_PO_NOT_UPDATED_INITIAL_STOCK_CREATED);
        messageContent.message = stringFormat(messageContent.message, 'PO#', assyList);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.salesorder.poNumber = angular.copy(vm.salesorderCopy.poNumber);
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.poNumber = vm.salesorder.poNumber;
          }
          return;
        });
      }
      if (!isopen) {
        const objCustomer = {
          id: vm.id ? parseInt(vm.id) : null,
          customerID: vm.autoCompleteCustomer.keyColumnId,
          poNumber: vm.salesorder.poNumber
        };
        return SalesOrderFactory.checkUniquePOWithCustomer().query(objCustomer).$promise.then((salesOrder) => {
          if (salesOrder && salesOrder.data) {
            isopen = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PO_ALREADY_EXIST_CUSTOMER);
            messageContent.message = stringFormat(messageContent.message, vm.salesorder.poNumber, vm.customerCodeName, salesOrder.data.salesOrderNumber);
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.salesorder.poNumber = null;
              if ($scope.$parent && $scope.$parent.vm) {
                $scope.$parent.vm.poNumber = vm.salesorder.poNumber;
              }
              setFocus('poNumber');
              isopen = false;
            });
            return false;
          } else {
            if ($scope.$parent && $scope.$parent.vm) { $scope.$parent.vm.poNumber = vm.salesorder.poNumber; } return true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // get total line level price detail
    vm.getSalesOrderPriceDetails = () => {
      const lineTotal = _.sumBy(vm.sourceData, (data) => data.extPrice);
      vm.totalLineChargeDisplay = $filter('amount')(lineTotal);

      // total line misc charges
      let totalCharges = 0;
      _.each(vm.sourceData, (service) => {
        totalCharges += _.sumBy(service.SalesOtherDetail, (data) => ((data.qty || 0) * (data.price || 0)));
      });
      vm.totalLineMiscChargesDisplay = $filter('amount')(totalCharges);

      // total order misc charges
      //const orderMiscTotal = _.sumBy(_.filter(vm.sourceData, (type) => type.partType === CORE.PartType.Other), (data) => data.extPrice);
      //vm.totalordermiscDisplay = $filter('amount')(orderMiscTotal);

      //order total
      const extPrice = lineTotal + totalCharges;
      vm.totalExtendedPriceDisplay = $filter('amount')(extPrice);
    };
    // go to carrier list page
    vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();
    vm.goTokitList = (item) => {
      BaseService.goToKitList(item.id, item.partID);
    };
    // open release line popup
    vm.openReleaseLinePopup = (row, ev) => {
      const data = {
        rowDetail: _.clone(row),
        customerID: vm.autoCompleteCustomer.keyColumnId,
        soID: vm.id,
        soNumber: vm.salesorder.salesOrderNumber,
        soDate: vm.salesorder.soDate,
        poDate: vm.salesorder.poDate,
        isDisable: vm.isDisable || vm.salesorder.blanketPOOption === vm.BlanketPODetails.LINKBLANKETPO,
        poNumber: vm.salesorder.poNumber,
        companyNameWithCode: $scope.ParentNme ? $scope.ParentNme.mfgName : null,
        companyName: $scope.ParentNme ? $scope.ParentNme.mfgactualName : null,
        isLegacyPO: vm.salesorder.isLegacyPO,
        status: vm.salesorder.status,
        oldstatus: vm.salesorderCopy.status,
        version: vm.salesorder.revision,
        blanketPOOption: vm.salesorder.blanketPOOption,
        isRmaPO: vm.salesorder.isRmaPO
      };
      DialogFactory.dialogService(
        CORE.SO_RELEASE_LINE_MODAL_CONTROLLER,
        CORE.SO_RELEASE_LINE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (response) => {
          const autocompleteSOPromise = [vm.salesOrderDetails(vm.id), vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
          vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((responses) => {
            vm.holdunHoldList = responses[2].data;
            vm.salesOrderDetailByID(responses[1], response ? row.id : null, response ? true : false);
            if (vm.currentSODetIndex != null && vm.currentSODetIndex >= 0) {
              const obj = vm.sourceData[vm.currentSODetIndex];
              vm.EditSalesMasterDetail(obj, true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, (err) => BaseService.getErrorLog(err));
    };
    // show additional notes
    vm.showAdditionalNotePopUp = (object, ev) => {
      const description = object && object.description ? angular.copy(object.description).replace(/\r/g, '<br/>').replace(/\n/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.ReleaseNumber,
          value: object.releaseNumber,
          displayOrder: 1
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.AdditionalNote,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    // show release Notes
    vm.showReleaseNotePopUp = (object, ev) => {
      const description = object && object.releaseNotes ? angular.copy(object.releaseNotes).replace(/\r/g, '<br/>').replace(/\n/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.ReleaseNumber,
          value: object.releaseNumber,
          displayOrder: 1
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.ReleaseNote,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    //show description for detail
    vm.showDescriptionPopUp = (object, ev) => {
      const description = object && object.FullAddress ? angular.copy(object.FullAddress).replace(/\r/g, '<br/>').replace(/\n/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.ReleaseNumber,
          value: object.releaseNumber,
          displayOrder: 1
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.ShippingAddress,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    const openCommonDescriptionPopup = (ev, data) => {
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    // data key so
    const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
      if (dataKey) {
        vm.dataKey = dataKey.data;
        _.each(vm.dataKey, (item) => {
          if (item.key === CONFIGURATION.SETTING.POvsMRPQtyTolerancePer) {
            vm.POvsMRPQtyTolerancePer = item.values;
            return vm.POvsMRPQtyTolerancePer;
          }
        });
      }
    }).catch((error) => BaseService.getErrorLog(error));

    getDataKey();

    vm.checkHeaderDetail = () => {
      $scope.$parent.vm.soDate = vm.salesorder.soDate;
      $scope.$parent.vm.poDate = vm.salesorder.poDate;
    };
    // go to sales price matrix
    vm.goToSalesPriceMatrix = (id) => {
      if (id && (vm.salesDetail.partCategory !== CORE.PartCategory.Component || vm.salesDetail.isCustom)) {
        BaseService.goToComponentSalesPriceMatrixTab(id);
      } else if (id) {
        BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, id);
      }
    };
    // go to nevigate save button
    vm.setNavigationFromDOCreate = (ev) => {
      if (ev && ev.keyCode === 9) {
        // in case of tab jump to  requested dock date
        if (!ev.shiftKey) {
          setFocus('requestedDockDate');
        }
      }
    };
    // go to nevigate save button
    vm.setNavigationFromPromisedDate = (ev) => {
      if (ev && ev.keyCode === 9) {
        // in case of tab jump to  requested dock date
        if (!ev.shiftKey) {
          setFocus('btnAddCurrDet');
        }
      }
    };
    vm.setNavigationFromShipDate = (ev) => {
      if (ev && ev.keyCode === 9 && !vm.salesDetail.promisedShipDate) {
        // in case of tab jump to  requested dock date
        if (!ev.shiftKey) {
          setFocus('promisedShipDate');
        }
      }
    };
    // go to requested ship date
    vm.setNavigationFromDockDate = (ev) => {
      if (ev && ev.keyCode === 9 && !vm.salesDetail.requestedDockDate) {
        // in case of tab jump to  ship date
        if (!ev.shiftKey) {
          setFocus('requestedShipDate');
        }
      }
    };
    // hold unhold sales order detail
    vm.haltResumeSalesOrder = (row, ev) => {
      const rowData = row;
      if (rowData) {
        const haltResumeObj = {
          salesOrderid: vm.id,
          refTransId: rowData.id,
          isHalt: rowData.haltStatusPO ? (rowData.haltStatusPO === vm.HaltResumePopUp.HaltStatus ? false : true) : true,
          module: vm.HaltResumePopUp.refTypePO,
          refType: vm.HaltResumePopUp.refTypePO,
          poNumber: vm.salesorder.poNumber,
          soNumber: vm.salesorder.salesOrderNumber,
          assyName: rowData.PIDCode,
          rohsIcon: rowData.copyrohsIcon,
          rohs: rowData.rohsText,
          soId: vm.id,
          assyID: rowData.partID
        };
        DialogFactory.dialogService(
          CORE.HALT_RESUME_CONTROLLER,
          CORE.HALT_RESUME_VIEW,
          ev,
          haltResumeObj).then(() => {
          }, (data) => {
            if (data) {
              // hold unhold list logic set
              const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
              vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
                if (vm.autoCompleteSearchDetail) {
                  vm.autoCompleteSearchDetail.keyColumnId = null;
                }
                vm.holdunHoldList = response[1].data;
                vm.salesOrderDetailByID(response[0], rowData.id, true);
                if (vm.currentSODetIndex != null && vm.currentSODetIndex >= 0) {
                  const obj = vm.sourceData[vm.currentSODetIndex];
                  vm.EditSalesMasterDetail(obj, vm.copyisDisable);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, (error) => BaseService.getErrorLog(error));
      }
    };
    // open halt resume history
    vm.haltResumeHistoryList = (row, ev) => {
      const rowData = row;
      const data = {
        refTransId: rowData.id,
        poNumber: vm.salesorder.poNumber,
        soNumber: vm.salesorder.salesOrderNumber,
        assyName: rowData.PIDCode,
        rohsIcon: rowData.copyrohsIcon,
        rohs: rowData.rohsText,
        soId: vm.id,
        assyID: rowData.partID
      };
      DialogFactory.dialogService(
        CORE.HALT_RESUME_HISTORY_CONTROLLER,
        CORE.HALT_RESUME_HISTORY_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    // go to user master
    vm.goToUserDetail = (id) => {
      BaseService.goToManagePersonnel(id);
    };

    // export sales commission details
    vm.exportSalesCommission = (row) => {
      if (row) {
        BaseService.exportSalesCommissionDetail(vm.id, row.id, true, vm.salesorder.salesOrderNumber, row.lineID);
      }
    };

    // get promised ship date
    vm.getPromisedDate = () => {
      if (vm.salesDetail.requestedDockDate) {
        const dockdate = BaseService.getAPIFormatedDate(vm.salesDetail.requestedDockDate);
        SalesOrderFactory.getSOPromisedShipDateFromDockDate().query({ dockDate: dockdate }).$promise.then((response) => {
          if (response && response.data) {
            if (response.data[0].vPromisedShipDate && (new Date(vm.salesorder.poDate)).setHours(0, 0, 0, 0) > (new Date(response.data[0].vPromisedShipDate)).setHours(0, 0, 0, 0)) {
              vm.salesDetail.promisedShipDate = vm.salesorder.poDate;
            } else {
              vm.salesDetail.promisedShipDate = response.data[0].vPromisedShipDate;
            }
            setFocus('promisedShipDate');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // set promised date from ship date
    vm.getPromisedDateFromShipDate = () => {
      vm.salesDetail.promisedShipDate = vm.salesDetail.requestedShipDate ? vm.salesDetail.requestedShipDate : vm.salesDetail.promisedShipDate;
    };

    // open release line history details
    vm.openReleaseLineHistory = (item, ev) => {
      var data = {
        Tablename: 'SALESSHIPINGMST',
        RefTransID: item.shippingID
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    // get blanket PO list
    vm.getpendingBlanketPOList = () => {
      if (vm.autoCompleteCustomer.keyColumnId && vm.salesDetail.partID && !vm.salesorder.isBlanketPO) {
        SalesOrderFactory.getBlanketPOAssyList().query({ customerID: vm.autoCompleteCustomer.keyColumnId, partID: vm.salesDetail.partID, blanketPOID: vm.salesDetail.refBlanketPOID }).$promise.then((response) => {
          if (response && response.data) {
            vm.pendingBlanketPOAssyList = response.data;
            if (vm.pendingBlanketPOAssyList.length > 0 && !vm.salesDetail.id) {
              vm.openBlanketPODetails();
            } else if (vm.salesDetail.id && vm.salesDetail.refBlanketPOID) {
              SetBlanketPODetail(vm.salesDetail.refBlanketPOID);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // get blanket PO list
    vm.getusedBlanketPODetails = () => {
      if (vm.salesDetail.id && vm.salesorder.isBlanketPO) {
        return SalesOrderFactory.getBlanketPOUsedQtyForAssy().query({ id: vm.salesDetail.id }).$promise.then((response) => {
          if (response && response.data) {
            vm.bomAssignedQtyList = response.data;
            return vm.usedQty = _.sumBy(vm.bomAssignedQtyList, (o) => (o.qty));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    // open blanket PO details
    vm.openBlanketPODetails = (ev) => {
      const data = {
        blanketPOID: vm.salesorder.isBlanketPO ? vm.salesDetail.id : vm.blanketPOSDetID || ($stateParams.blanketPOID ? parseInt($stateParams.blanketPOID) : null),
        partID: vm.salesDetail.partID,
        custPOLineNumber: vm.salesDetail.custPOLineNumber,
        rohsIcon: vm.salesDetail.rohsIcon,
        rohsName: vm.salesDetail.rohsName,
        mfgPN: vm.salesDetail.mfgPN,
        mfr: vm.salesDetail.mfrName,
        mfrID: vm.salesDetail.mfrID,
        partType: vm.salesDetail.partType,
        PIDCode: vm.salesDetail.PIDCode,
        soNumber: vm.salesorder.salesOrderNumber,
        poNumber: vm.salesorder.poNumber,
        salesOrderID: vm.salesorder.id,
        customerID: vm.autoCompleteCustomer.keyColumnId,
        soDate: vm.salesorder.soDate,
        poDate: vm.salesorder.poDate,
        revision: vm.salesorder.revision,
        soBlanketPOID: $stateParams.blanketPOID,
        porevision: vm.salesorder.poRevision
      };
      DialogFactory.dialogService(
        TRANSACTION.SALESORDER_BPO_MODAL_CONTROLLER,
        TRANSACTION.SALESORDER_BPO_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (response) => {
          if (response) {
            SetBlanketPODetail(response, ev, true);
          }
          if ($stateParams.blanketPOID) {
            $state.transitionTo(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, { sID: vm.id }, { location: true, inherit: false, notify: false });
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    // clear blanket po details
    vm.clearBlanketPODetails = (ev) => {
      if (vm.salesDetail.id) {
        const objSales = _.clone(vm.salesDetail);
        cellEditable(objSales, false, false).then((cellresponse) => {
          if (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty && cellresponse) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_REMOVE_BLANKET_PO_ERROR);
            messageContent.message = stringFormat(messageContent.message, vm.poNumber, vm.salesDetail.custPOLineNumber, vm.salesShippedStatus.packingSlipNumber || '');
            const model = {
              multiple: true,
              messageContent: messageContent
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
            }).catch(() => BaseService.getErrorLog(error));
          } else if (cellresponse) {
            SetBlanketPODetail(null, ev);
            vm.salesOrderDetForm.$dirty = true;
          }
        });
      } else {
        SetBlanketPODetail(null, ev);
        vm.salesOrderDetForm.$dirty = true;
      }
    };
    // select blanket PO details
    const SetBlanketPODetail = (refBlanketPOID, ev, isselect) => {
      const objBlanketPO = _.find(vm.pendingBlanketPOAssyList, (bPO) => bPO.id === refBlanketPOID);
      if (objBlanketPO) {
        vm.availableQty = objBlanketPO.pendingToAssign;
        vm.assignedQty = objBlanketPO.assignPOQty > objBlanketPO.qty ? objBlanketPO.qty : objBlanketPO.assignPOQty;
        vm.totalQty = objBlanketPO.qty;
        vm.blanketPOID = objBlanketPO.soID;
        vm.blanketPOSDetID = objBlanketPO.id;
        vm.salesOrderNumber = objBlanketPO.salesOrderNumber;
        vm.poNumber = objBlanketPO.poNumber;
        setFocus('qty');
        if (!vm.salesDetail.id || isselect) {
          vm.salesDetail.isSkipKitCreation = true;
          vm.salesDetail.qty = vm.availableQty;
          vm.salesDetail.quoteFrom = objBlanketPO.quotefrom;
          vm.salesDetail.refAssyQtyTurnTimeID = objBlanketPO.refAssyQtyTurnTimeID || null;
          vm.salesDetail.refRFQQtyTurnTimeID = objBlanketPO.refRFQQtyTurnTimeID || null;
          vm.salesDetail.isBPO = true;
          vm.salesDetailCopy = _.clone(vm.salesDetail);
          let autocompletePromise = [];
          if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromRFQ.id && objBlanketPO.refRFQGroupID) {
            autocompletePromise = [getrfqQuoteQtyTurnTimeList(objBlanketPO.refRFQGroupID, objBlanketPO.partID)];
          }
          else if (vm.salesDetail.quoteFrom === vm.salesCommissionFrom.FromPartMaster.id) {
            autocompletePromise.push(getQtyTurnTimeByAssyId(objBlanketPO.partID, objBlanketPO.id || null));
          }
          vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
            vm.salesDetail.refRFQGroupID = objBlanketPO.refRFQGroupID;
            vm.salesDetail.quoteNumber = objBlanketPO.quoteNumber;
            vm.salesDetail.price = objBlanketPO.price;
            $timeout(() => {
              getAutoCompleteValueFromData();
              const selectedTurnTime = _.find(vm.quoteQtyTurnTimeDetails, (a) => a.id === (vm.salesDetail.refRFQQtyTurnTimeID || vm.salesDetail.refAssyQtyTurnTimeID));
              if (selectedTurnTime) {
                vm.autocompleteQtyTurnTime.keyColumnId = selectedTurnTime.id;
                vm.changePrice();
              }
              vm.getSalesCommissionDetailsOnPriceChange();
            }, 0);
          }).catch((error) => BaseService.getErrorLog(error));
          vm.ChangeSkipKitCreation();
        } else {
          vm.availableQty = objBlanketPO.pendingToAssign + (vm.salesDetail.qty || 0);
        }
        vm.salesOrderDetForm.$dirty = true;
      } else {
        vm.availableQty = vm.assignedQty = vm.totalQty = vm.blanketPOID = vm.blanketPOSDetID = vm.salesOrderNumber = vm.poNumber = null;
        vm.salesDetail.isBPO = false;
        setFocus('qty');
      }
    };
    // open blanket po assy
    vm.blanketPOAssy = (ev, isAlert, isunlink) => {
      const data = {
        blanketPOID: vm.salesorder.isBlanketPO ? vm.salesDetail.id : vm.blanketPOSDetID,
        partID: vm.salesDetail.partID,
        custPOLineNumber: vm.salesDetail.custPOLineNumber,
        rohsIcon: vm.salesDetail.rohsIcon,
        rohsName: vm.salesDetail.rohsName,
        mfgPN: vm.salesDetail.mfgPN,
        mfr: vm.salesDetail.mfrName,
        mfrID: vm.salesDetail.mfrID,
        partType: vm.salesDetail.partType,
        PIDCode: vm.salesDetail.PIDCode,
        soNumber: vm.salesorder.salesOrderNumber,
        poNumber: vm.salesorder.poNumber,
        soDate: vm.salesorder.soDate,
        poDate: vm.salesorder.poDate,
        revision: vm.salesorder.revision,
        salesOrderID: vm.salesorder.id,
        isAlert: isAlert,
        isBlanketPO: vm.salesorder.isBlanketPO,
        blanketPOOption: vm.salesorder.blanketPOOption,
        isLegacyPO: vm.salesorder.isLegacyPO,
        isRmaPO: vm.salesorder.isRmaPO
      };
      DialogFactory.dialogService(
        CORE.BLANKET_PO_ASSY_MODAL_CONTROLLER,
        CORE.BLANKET_PO_ASSY_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
          if (isAlert) {
            setFocus('qty');
          } else if (isunlink) {
            vm.salesDetail = Object.assign(vm.copySalsDetail);
            const autocompleteSOPromise = [vm.salesOrderDetailsByID(), vm.getHoldUnholdDetail()];
            vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
              vm.holdunHoldList = response[1].data;
              vm.salesOrderDetailByID(response[0]);
              if (vm.salesDetail && vm.salesDetail.id) {
                const obj = _.find(vm.sourceData, (det) => det.id === vm.salesDetail.id);
                vm.EditSalesMasterDetail(obj, true);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // go to sales order page
    vm.goToSalesOrder = (id) => {
      BaseService.goToManageSalesOrder(id);
    };
    // Redirect to sales order page by id
    const redirectToSOAnchorTag = (soid, soNumber) => {
      const redirectToSOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_DETAIL_ROUTE.replace(':sID', soid);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToSOUrl, soNumber);
    };
    // check part status are active for all parts in existing sales order
    vm.checkPartStatusOfSalesOrder = () => SalesOrderFactory.checkPartStatusOfSalesOrder().query({ id: vm.id }).$promise.then((res) => {
      if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.checkCustomerPoRevision = () => {
      if (vm.salesorder.isInitialStockAdded && vm.salesorder.poRevision !== vm.salesorderCopy.poRevision) {
        const assyList = vm.salesorder && vm.salesorder.InitialStockMst ? _.map(_.map(vm.salesorder.InitialStockMst, (item) => item.componentAssembly), (det) => det.PIDCode).join(',') : [];
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_PO_NOT_UPDATED_INITIAL_STOCK_CREATED);
        messageContent.message = stringFormat(messageContent.message, 'PO Revision', assyList);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          vm.salesorder.poRevision = angular.copy(vm.salesorderCopy.poRevision);
          return;
        });
      }
    };

    // open qty bifurcation popup
    vm.openBifurcationQtyPopup = (entity, ev, releaseID) => {
      const data = {
        id: entity.id,
        pidCode: entity.PIDCode,
        releaseID: releaseID,
        partID: entity.partID,
        rohsName: entity.rohsName,
        rohsIcon: entity.rohsIcon,
        soID: vm.id,
        partType: entity.partType,
        poQty: entity.qty,
        shippedQty: entity.shippedQty,
        custPOLineNumber: entity.custPOLineNumber,
        poNumber: vm.salesorder.poNumber,
        soNumber: vm.salesorder.salesOrderNumber,
        customerId: vm.salesorder.customerID,
        customerName: vm.salesorder.customerName
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_SALESORDER_QTY_CONTROLLER,
        TRANSACTION.TRANSACTION_SALESORDER_QTY_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    // open release line popup
    vm.openReleaseBifurcationQtyPopup = (entity, ev) => {
      const data = _.clone(entity.parent);
      data.shippedQty = entity.shippedQty;
      data.qty = entity.qty;
      vm.openBifurcationQtyPopup(data, ev, entity.shippingID);
    };

    // Check Box Group
    vm.checkBoxButtonGroup = {
      isRMAPO: {
        checkDisable: () => vm.isDisable || vm.salesorder.isLegacyPO || vm.salesorder.isBlanketPO,
        onChange: () => {
          // clear data from RMA relavent field if uncheked RMA PO
          if (!vm.salesorder.isRmaPO) {
            vm.salesorder.rmaNumber = null;
            vm.salesorder.isDebitedByCustomer = false;
            vm.salesorder.isReworkRequired = false;
            vm.salesorder.reworkPONumber = null;
            if (vm.autoCompleteOrgPO) {
              vm.autoCompleteOrgPO.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteOrgPO.inputName + 'searchText', null);
            }
          }
        }
      },
      isDebitedByCustomer: {
        checkDisable: () => vm.isDisable || (!vm.salesorder.isRmaPO),
        onChange: () => {
          // clear data from Original PO field if uncheked debited by Customer
          if (!vm.salesorder.isDebitedByCustomer) {
            vm.salesorder.orgPONumber = null;
            vm.salesorder.orgSalesOrderID = null;
            if (vm.autoCompleteOrgPO) {
              vm.autoCompleteOrgPO.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteOrgPO.inputName + 'searchText', null);
            }
          }
        }
      },
      isReworkRequired: {
        checkDisable: () => vm.isDisable || (!vm.salesorder.isRmaPO),
        onChange: () => {
          // clear data from Rework PO field if uncheked rework required
          if (!vm.salesorder.isReworkRequired) {
            vm.salesorder.reworkPONumber = null;
          }
        }
      }
    };

    // Take Confirmation for replacing PO# in SO
    const confirmationForPONumberReplacement = (poNumber, replacePO, updateHeaderData) => {
      let messageContent;
      if (updateHeaderData) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_PONUMBER_REPLACE_CONFIRM_WITH_DETAIL);
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_PONUMBER_REPLACE_CONFIRM);
      }
      messageContent.message = stringFormat(messageContent.message, poNumber, replacePO, vm.salesorder.salesOrderNumber || '');
      const model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      return DialogFactory.messageConfirmDialog(model).then(() => {
        return { replacePO: true };
      }, () => {
        return { replacePO: false };
      });
    };

    // Change Rework PO Number
    vm.changeReworkPONumber = () => {
      if (vm.salesorder.reworkPONumber && vm.salesorder.poNumber !== vm.salesorder.reworkPONumber) {
        return $q.all([confirmationForPONumberReplacement(vm.salesorder.poNumber, vm.salesorder.reworkPONumber)]).then((res) => {
          if (res && res.length > 0 && res[0].replacePO) {
            vm.salesorder.poNumber = vm.salesorder.reworkPONumber;
            if ($scope.$parent && $scope.$parent.vm) { $scope.$parent.vm.poNumber = vm.salesorder.poNumber; }
          } else {
            vm.salesorder.reworkPONumber = null;
          }
          setFocus('reworkPONumber');
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.changeOrgPONumber = () => {
      if (vm.isSkipBlurOnOrgPONumber) {
        return;
      }
      vm.setOriginalPOData();
      vm.isSkipBlurOnOrgPONumber = true;
    };

    const checkSalesOrderFutherTransaction = () => SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ soId: vm.id }).$promise.then((salesorder) => {
      if (salesorder && salesorder.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        if (salesorder.data && salesorder.data.soReleaseStatus && salesorder.data.soReleaseStatus[0].transCnt > 0) {
          return false;
        } else {
          return true;
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.changeBlanketPO = () => {
      const alreadyMapped = _.filter(vm.sourceData, (item) => item.refBlanketPOID);
      if (alreadyMapped.length > 0 && vm.salesorder.isBlanketPO) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKET_PO_FUTURE_PO_SET_ALERT);
        messageContent.message = stringFormat(messageContent.message, vm.salesorder.poNumber, _.map(_.uniqBy(alreadyMapped, 'custPOLineNumber'), 'custPOLineNumber').join(', '));
        const model = {
          multiple: true,
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => { vm.salesorder.isBlanketPO = false; });
      } else {
        if (!vm.salesorder.isBlanketPO) {
          vm.autoCompleteBlanketPOOption.keyColumnId = null;
        }
      }
    };
    // check checkbox for link to blanket po need to check all details mapped or not
    vm.changeLinkToBlankPO = () => {
      const alreadyMapped = _.filter(vm.sourceData, (item) => !item.refBlanketPOID && item.partType !== vm.partTypes.Other);
      if (alreadyMapped.length > 0 && vm.salesorder.linkToBlanketPO) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.LINKTOBPO_ALERT_NOT_MAP_ANYBPO);
        messageContent.message = stringFormat(messageContent.message, _.map(_.uniqBy(alreadyMapped, 'custPOLineNumber'), 'custPOLineNumber').join(', '));
        const model = {
          multiple: true,
          messageContent: messageContent
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          vm.salesorder.linkToBlanketPO = false;
          setFocus('idLinkToBlanketPO');
        });
      } else { vm.salesorder.isLegacyPO = false; }
    };
    //open all linked po(s)
    vm.openLinkedBlanketPO = (item, ev) => {
      const isLine = angular.copy(vm.salesDetail.isLine);
      vm.copySalsDetail = Object.assign(vm.salesDetail);
      vm.salesDetail.isLine = isLine;
      vm.salesDetail.partID = item.partID;
      vm.salesDetail.custPOLineNumber = item.custPOLineNumber;
      vm.salesDetail.rohsIcon = item.rohsIcon;
      vm.salesDetail.rohsName = item.rohsText;
      vm.salesDetail.mfgPN = item.mfgPN;
      vm.salesDetail.mfr = item.mfr;
      vm.salesDetail.mfrID = item.mfrID;
      vm.salesDetail.partType = item.partType;
      vm.salesDetail.PIDCode = item.PIDCode;
      vm.salesDetail.id = item.id;
      vm.blanketPOAssy(ev, false, true);
    };
    // set data for customer address directive
    const setOtherDetForCustAddrDir = (custID) => {
      vm.viewCustAddrOtherDet = {
        customerId: custID || vm.autoCompleteCustomer.keyColumnId,
        addressType: CORE.AddressType.BillingAddress,
        addressBlockTitle: vm.LabelConstant.Address.BillingAddress,
        refTransID: custID || vm.autoCompleteCustomer.keyColumnId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: (vm.billingAddress && vm.billingAddress.id) || null,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        alreadySelectedPersonId: (vm.selectedContactPerson && vm.selectedContactPerson.personId) || null,
        showAddressEmptyState: !(vm.billingAddressList && vm.billingAddressList.length)
      };
      if ($scope.ParentNme && $scope.ParentNme.mfgactualName) {
        vm.viewCustAddrOtherDet.companyName = $scope.ParentNme ? $scope.ParentNme.mfgactualName : null,
          vm.viewCustAddrOtherDet.companyNameWithCode = $scope.ParentNme ? $scope.ParentNme.mfgName : null;
      };
    };

    // set data for customer address directive
    const setOtherDetForMainContactPerson = (custID) => {
      vm.viewCustMainContactOtherDet = {
        customerId: custID || vm.autoCompleteCustomer.keyColumnId,
        refTransID: custID || vm.autoCompleteCustomer.keyColumnId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedPersonId: (vm.contactpersondetail && vm.contactpersondetail.personId) || null,
        showContPersonEmptyState: !(vm.ContactPersonList && vm.ContactPersonList.length),
        companyName: vm.companyName,
        selectedContactPerson: vm.contactpersondetail || null,
        mfgType: CORE.MFG_TYPE.CUSTOMER
      };
      if ($scope.ParentNme && $scope.ParentNme.mfgactualName) {
        vm.viewCustMainContactOtherDet.companyName = $scope.ParentNme ? $scope.ParentNme.mfgactualName : null,
          vm.viewCustMainContactOtherDet.companyNameWithCode = $scope.ParentNme ? $scope.ParentNme.mfgName : null;
      };
    };

    // add new future po from blanket po
    vm.addNewBlanketPO = (row, ev) => {
      vm.salesDetail.id = row.id;
      vm.getusedBlanketPODetails().then(() => {
        const data = {
          soID: row.id,
          partID: row.partID,
          custPOLineNumber: row.custPOLineNumber,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsName,
          mfgPN: row.mfgPN,
          mfr: row.mfrName,
          mfrID: row.mfrID,
          partType: row.partType,
          PIDCode: row.PIDCode,
          soNumber: vm.salesorder.salesOrderNumber,
          poNumber: vm.salesorder.poNumber,
          soDate: vm.salesorder.soDate,
          poDate: vm.salesorder.poDate,
          revision: vm.salesorder.revision,
          salesOrderID: vm.salesorder.id,
          isBlanketPO: vm.salesorder.isBlanketPO,
          blanketPOOption: vm.salesorder.blanketPOOption,
          customerID: vm.autoCompleteCustomer.keyColumnId,
          usedQty: vm.usedQty,
          qty: row.qty,
          isLegacyPO: vm.salesorder.isLegacyPO,
          isRmaPO: vm.salesorder.isRmaPO
        };
        DialogFactory.dialogService(
          CORE.FUTURE_PO_ASSY_NOT_LINK_MODAL_CONTROLLER,
          CORE.FUTURE_PO_ASSY_NOT_LINK_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (response) => {
            if (response) {
              const autocompleteSOPromise = [vm.salesOrderDetailsByID()];
              vm.cgBusyLoading = $q.all(autocompleteSOPromise).then((response) => {
                vm.salesOrderDetailByID(response[0]);
                if (vm.currentSODetIndex != null && vm.currentSODetIndex >= 0) {
                  const obj = vm.sourceData[vm.currentSODetIndex];
                  vm.EditSalesMasterDetail(obj, true);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, (err) => BaseService.getErrorLog(err));
      });
    };
    vm.updateSOData = (dataSO) => {
      const soMst = dataSO ? _.find(dataSO.data, (item) => item === vm.salesorder.id) : null;
      if (soMst) {
        vm.salesorder.isAskForVersionConfirmation = true;
      }
    };
    // set data for customer address directive
    const setShipOtherDetForCustAddrDir = (custID) => {
      vm.viewShipCustAddrOtherDet = {
        customerId: custID || vm.autoCompleteCustomer.keyColumnId,
        addressType: CORE.AddressType.ShippingAddress,
        addressBlockTitle: vm.LabelConstant.Address.ShippingAddress,
        refTransID: custID || vm.autoCompleteCustomer.keyColumnId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: (vm.shippingAddress && vm.shippingAddress.id) || null,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        alreadySelectedPersonId: (vm.selectedShipContactPerson && vm.selectedShipContactPerson.personId) || null,
        showAddressEmptyState: !(vm.ShippingAddressList && vm.ShippingAddressList.length)
      };
      if ($scope.ParentNme && $scope.ParentNme.mfgactualName) {
        vm.viewShipCustAddrOtherDet.companyName = $scope.ParentNme ? $scope.ParentNme.mfgactualName : null,
          vm.viewShipCustAddrOtherDet.companyNameWithCode = $scope.ParentNme ? $scope.ParentNme.mfgName : null;
      };
    };
    // set data for customer address directive
    const setMarkOtherDetForCustAddrDir = (custID) => {
      vm.viewMarkCustAddrOtherDet = {
        customerId: custID || vm.autoCompleteCustomer.keyColumnId,
        addressType: CORE.AddressType.IntermediateAddress,
        addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
        refTransID: custID || vm.autoCompleteCustomer.keyColumnId,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        alreadySelectedAddressID: (vm.intermediateAddress && vm.intermediateAddress.id) || null,
        mfgType: CORE.MFG_TYPE.CUSTOMER,
        showAddressEmptyState: !(vm.intermediateAddressList && vm.intermediateAddressList.length),
        alreadySelectedPersonId: (vm.selectedMarkContactPerson && vm.selectedMarkContactPerson.personId) || null
      };
      if ($scope.ParentNme && $scope.ParentNme.mfgactualName) {
        vm.viewMarkCustAddrOtherDet.companyName = $scope.ParentNme ? $scope.ParentNme.mfgactualName : null,
          vm.viewMarkCustAddrOtherDet.companyNameWithCode = $scope.ParentNme ? $scope.ParentNme.mfgName : null;
      };
    };
    // [S] Socket Listeners
    const connectSocket = () => {
      socketConnectionService.on(CORE.Socket_IO_Events.SalesOrderChange.updateSOVersionConfirmFlag, vm.updateSOData);
    };
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    const removeSocketListener = () => {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.Traveler.updateSOVersionConfirmFlag);
    };

    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    // refresh contact person
    vm.refreshContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        const autocompleteCustomerPromise = [getCustomerContactPersonList()];
        vm.cgBusyLoading = $q.all(autocompleteCustomerPromise).then(() => {
          setOtherDetForMainContactPerson(vm.autoCompleteCustomer.keyColumnId);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // common confirmation detail
    const commonShippingMethodChangeConfirmation = (item) => {
      const model = {
        messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPDATE_SHIPPING_METHOD_CONFIRMATION),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(model).then(() => {
        vm.autoCompleteCarriers.keyColumnId = item.carrierID;
        vm.salesorder.carrierAccountNumber = null;
        setFocus('carrierAccountNumber');
      }, () => {
        vm.autoCompleteCarriers.keyColumnId = vm.salesorder.carrierID;
        vm.autoCompleteShipping.keyColumnId = vm.salesorder.shippingMethodID;
        vm.salesorder.carrierAccountNumber = angular.copy(vm.salesorderCopy.carrierAccountNumber);
        vm.setFocusShippingMethod = true;
      });
    };


    //get detail list
    const getSalesOrderDetail = () => SalesOrderFactory.getSalesOrderDetails().query({ soId: vm.salesorder.id }).$promise.then((resDet) => {
      vm.SODetailList = [];
      if (resDet && resDet.data) {
        _.each(resDet.data, (item) => {
          item.soDetSearchText = stringFormat('{0} | {1} | {2} | {3}', item.custPOLineNumber, item.componentAssembly.PIDCode, item.componentAssembly.mfgPN, item.qty);
        });
        vm.SODetailList = resDet.data;
      }
      return $q.resolve(vm.SODetailList);
    }).catch((error) => BaseService.getErrorLog(error));

    // set sodetail model as per selection from auto complete
    const setSalesOrderDetail = (item) => {
      if (item && vm.salesDetail.id !== item.id) {
        const obj = _.find(vm.sourceData, (det) => det.id === item.id);
        const newCurrIndex = _.findIndex(vm.sourceData, (det) => det.id === item.id);
        vm.currentSODetIndex = (newCurrIndex || newCurrIndex >= 0) ? newCurrIndex : vm.currentSODetIndex;
        if (!vm.copyisDisable && (vm.salesOrderDetForm.$dirty || (!vm.salesDetail.id && vm.salesDetail.partID))) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_RECORD,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          return DialogFactory.messageConfirmDialog(model).then((yes) => {
            if (yes) {
              vm.EditSalesMasterDetail(obj, true);
              vm.salesOrderDetForm.$setPristine();
              vm.salesOrderDetForm.$setUntouched();
              vm.salesOrderDetForm.$invalid = false;
              vm.salesOrderDetForm.$valid = true;
              $timeout(() => {
                if (vm.autoCompleteSearchDetail) {
                  vm.autoCompleteSearchDetail.keyColumnId = null;
                  $scope.$broadcast(vm.autoCompleteSearchDetail.inputName, null);
                  setFocus('btnResetDet');
                }
              }, 500);
            }
          }, () => {
            setFocus('custPOLineNumber');
          }).catch((err) => BaseService.getErrorLog(err));
        } else {
          vm.EditSalesMasterDetail(obj, true);
          vm.salesOrderDetForm.$setPristine();
          vm.salesOrderDetForm.$setUntouched();
          vm.salesOrderDetForm.$invalid = false;
          vm.salesOrderDetForm.$valid = true;
          $timeout(() => {
            if (vm.autoCompleteSearchDetail) {
              vm.autoCompleteSearchDetail.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteSearchDetail.inputName, null);
              setFocus('btnResetDet');
            }
          }, 500);
        }
      } else if (item && vm.salesDetail.id === item.id) {
        $timeout(() => {
          if (vm.autoCompleteSearchDetail) {
            vm.autoCompleteSearchDetail.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSearchDetail.inputName, null);
            setFocus('btnResetDet');
          }
        }, 500);
      }
    };

    vm.navigateDetailRecords = (navDir, checkDirty) => {
      if (navDir === vm.navDirection.CURR) {
        if (vm.currentSODetIndex == null || vm.currentSODetIndex < 0) {
          vm.currentSODetIndex = vm.sourceData && vm.sourceData.length - 1;
        }
      } else if (navDir === vm.navDirection.FIRST) {
        vm.currentSODetIndex = 0;
      } else if (navDir === vm.navDirection.LAST) {
        vm.currentSODetIndex = vm.sourceData && vm.sourceData.length - 1;
      } else if (navDir === vm.navDirection.PREVIOUS) {
        vm.currentSODetIndex = (vm.currentSODetIndex || 0) - 1;
        if (vm.currentSODetIndex < 0) {
          vm.currentSODetIndex = (vm.sourceData && vm.sourceData.length - 1) || 0;
        }
      } else if (navDir === vm.navDirection.NEXT) {
        vm.currentSODetIndex = vm.currentSODetIndex == null ? vm.sourceData && vm.sourceData.length - 1 : vm.currentSODetIndex + 1;
      } else {
        vm.currentSODetIndex = null;
      }
      if (vm.currentSODetIndex != null && vm.currentSODetIndex >= 0) {
        const obj = vm.sourceData && vm.sourceData[vm.currentSODetIndex];
        if (obj) {
          if (checkDirty && vm.salesOrderDetForm.$dirty && !vm.copyisDisable && vm.salesDetail.partID) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_RECORD,
              canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                if (navDir === vm.navDirection.CURR) {
                  vm.EditSalesMasterDetail(obj, false);
                  if (obj.id) {
                    vm.salesOrderDetForm.$setPristine();
                    vm.salesOrderDetForm.$setUntouched();
                    vm.salesOrderDetForm.$invalid = false;
                    vm.salesOrderDetForm.$valid = true;
                  }
                } else {
                  vm.EditSalesMasterDetail(obj, true);
                }
              }
            }, () => {
              setFocus('custPOLineNumber');
            }).catch((err) => BaseService.getErrorLog(err));
          } else {
            if (navDir === vm.navDirection.CURR) {
              vm.EditSalesMasterDetail(obj, false);
              if (obj.id) {
                vm.salesOrderDetForm.$setPristine();
                vm.salesOrderDetForm.$setUntouched();
                vm.salesOrderDetForm.$invalid = false;
                vm.salesOrderDetForm.$valid = true;
              }
            } else {
              vm.EditSalesMasterDetail(obj, true);
            }
          }
        } else {// in case index out of bound of detail grid reset current index
          if (navDir === vm.navDirection.PREVIOUS) {
            vm.currentSODetIndex = (vm.currentSODetIndex || 0) + 1;
          } else if (navDir === vm.navDirection.NEXT) {
            vm.currentSODetIndex = vm.currentSODetIndex == null ? 0 : vm.currentSODetIndex - 1;
          } else {
            vm.currentSODetIndex = null;
          }
        }
        if (!vm.copyisDisable) {
          setFocus('btnAddCurrDet');
        }
      } else if (vm.sourceData && vm.sourceData.length === 0 && (vm.currentSODetIndex == null || vm.currentSODetIndex < 0)) {
        vm.resetDetail(null, true);
      }
    };

    // delete current record
    vm.deleteCurrentRecord = (row) => {
      vm.deleteRecord(row);
      vm.resetDetail(null, true);
    };
  }
})();

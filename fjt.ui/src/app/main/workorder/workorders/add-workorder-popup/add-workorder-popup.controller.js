(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('AddWorkorderController', AddWorkorderController);

  /** @ngInject */
  function AddWorkorderController($state, $q, $mdDialog, $timeout, data, CORE, WorkorderFactory, MasterFactory, WorkorderOperationEmployeeFactory, BaseService,
    USER, WORKORDER, DialogFactory, GenericCategoryConstant, OperationFactory, TRANSACTION, OPERATION, ManageMFGCodePopupFactory, $scope) {
    const vm = this;
    // let woNumberPrefix;
    vm.PartCategory = CORE.PartCategory;
    vm.allLabelConstant = CORE.LabelConstant;
    //vm.WONumberPattern = CORE.WONumberPattern;
    //vm.COPY_ALL_DOCUMENT_WITH_WORKORDER = WORKORDER.COPY_ALL_DOCUMENT_WITH_WORKORDER;
    vm.ADD_WORKORDER_NOTES = WORKORDER.ADD_WORKORDER_NOTES;
    //vm.NOT_COPY_ALL_DOCUMENT_WITH_WORKORDER = WORKORDER.NOT_COPY_ALL_DOCUMENT_WITH_WORKORDER;
    vm.ALLOW_TO_ADD_AS_REQUIRE = WORKORDER.ALLOW_TO_ADD_AS_REQUIRE;
    vm.COPY_DO_DONTS_MASTER = WORKORDER.COPY_DO_DONTS_MASTER;
    vm.FOR_REVISED_WO_BUILDQTY_BASED_ON_TRANSFER = WORKORDER.FOR_REVISED_WO_BUILDQTY_BASED_ON_TRANSFER;
    vm.ADD_WORKORDER_OPTION_NOTES_FROM_SALESORDER = WORKORDER.ADD_WORKORDER_OPTION_NOTES_FROM_SALESORDER;
    vm.ADD_WORKORDER_OPTION_NOTES_FROM_WORKORDER = WORKORDER.ADD_WORKORDER_OPTION_NOTES_FROM_WORKORDER;
    vm.ADD_WORKORDER_OPTION_NOTES_FROM_UNDERTERMIANTE_WORKORDER = WORKORDER.ADD_WORKORDER_OPTION_NOTES_FROM_UNDERTERMIANTE_WORKORDER;
    vm.ADD_WORKORDER_OPTION_NOTES_FROM_NONE = WORKORDER.ADD_WORKORDER_OPTION_NOTES_FROM_NONE;
    vm.COPY_ALL_DOCUMENT_FROM_PART = WORKORDER.COPY_ALL_DOCUMENT_FROM_PART;
    vm.NOT_COPY_DOCUMENT_FROM_WORKORDER = WORKORDER.NOT_COPY_DOCUMENT_FROM_WORKORDER;
    vm.EmptyMesssageSalesOrder = angular.copy(TRANSACTION.TRANSACTION_EMPTYSTATE.ADD_SALESORDER);
    const emptyMessage = vm.EmptyMesssageSalesOrder.MESSAGE;
    vm.copy_All_Doc_From = WORKORDER.COPY_ALL_DOCUMENT_FROM;
    vm.not_copy_any_doc_from = WORKORDER.NOT_COPY_ALL_DOCUMENT_FROM;
    vm.not_copy_restrict_part = WORKORDER.ADD_NEW_WORKORDER_NOTES.NOT_COPY_RESTRICT_PART;
    vm.PartCorrectList = CORE.PartCorrectList;
    vm.CorePartStatusList = CORE.PartStatusList;
    vm.headerdata = [];
    vm.woStatusDetail = CORE.WorkOrderStatus;
    vm.saveBtnDisableFlag = false;
    // get passed data from work order add page
    vm.woData = angular.copy(data);
    const setIsFromSO = ['W', 'S', 'U'];
    vm.addWorkorderModel = {
      isFromSO: setIsFromSO[(vm.woData.isFromList || 0)]
    };
    if (vm.woData.isFromWO) {
      vm.addWorkorderModel.isFromSO = 'S';
    }
    if (vm.addWorkorderModel.isFromSO === 'W') {
      vm.addWorkorderModel.isCopyOPFromRightSection = 'PW';
    }
    const oldIsFromSO = vm.addWorkorderModel.isFromSO;
    vm.SOAssyListCustomerWise = [];
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.woNotesConst = WORKORDER.WONotes;
    let taskConfirmationInfo = null;
    vm.disableLeftSection = false;
    vm.disableRightSection = false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.disableObject = {
      CustomerForWOwithoutSO: false,
      AssemblyForWOwithoutSO: false,
      WOListForWOwithoutSO: false,
      OpFromLeftForWOwithoutSO: false,
      OpFromRightForWOwithoutSO: false,
      OpFromCommon: false,
      SOListForWOwithSO: false,
      CustomerForWOwithSO: false,
      AssemblyForWOwithSO: false,
      CommonOpFrom: false
    };
    vm.showPartitionInTopSection = true;
    // vm.isFromList = vm.woData.isFromList; // 1 - from sales and pending work order list
    // _.each(vm.disableObject)
    // intialize radio button for from SO or WO
    vm.RadioGroup = {
      addWOFrom: {
        array: CORE.AddWOFromRadioGroup
      }
    };
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    // initalize autocomplete for customer
    const initAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'mfgCodeName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: (vm.woData && vm.woData.customerID) ? (vm.woData.customerID) : (vm.addWorkorderModel ? (vm.addWorkorderModel.customerID ? vm.addWorkorderModel.customerID : null) : null),
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: vm.addWorkorderModel.isFromSO === 'S' || vm.addWorkorderModel.isFromSO === 'W' ? true : false,
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id,
            isCustomer: true
          };
          return getCustomerList(searchObj);
        },
        onSelectCallbackFn: getcustomerdetail,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteCustomer.inputName,
            isCustomer: true
          };
          return getCustomerList(searchObj);
        }
      };
      vm.autoCompleteWOList = {
        columnName: 'woNumber',
        keyColumnName: 'woID',
        keyColumnId: null,
        inputName: 'woNumber',
        placeholderName: 'Workorder',
        isRequired: vm.addWorkorderModel.isFromSO === 'W' ? true : false,
        isAddnew: false,
        // callbackFn: getWorkOrderListForCopyWO,
        onSelectCallbackFn: selectWOForCopyWO,
        onSearchFn: function (query) {
          const searchObj = {
            searchWo: query
          };
          return getWorkOrderListForCopyWO(searchObj);
        }
      };
    };

    const initAutoCompleteForSOWO = () => {
      vm.autoCompleteSOList = {
        columnName: 'salescolumn',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'salescolumn',
        placeholderName: 'Sales Order',
        isRequired: false,
        isAddnew: false,
        // callbackFn: getWorkOrderListForCopyWO,
        onSelectCallbackFn: selectSalesOrderForWO,
        onSearchFn: function (query) {
          const searchObj = {
            searchObj: query
          };
          return getSalesOrderListForWO(searchObj);
        }
      };
    };

    // Get Sales order "Workorder for Sales order" option-2
    const getSalesOrderListForWO = (searchObj) => MasterFactory.getSOAssyPartList().query(searchObj).$promise.then((response) => {
      _.map(response.data, (item) => {
        item['originalQty'] = item['qty'];
        item.salescolumn = item.formattedSalesOrder; // stringFormat('{0}, {1}, {2} ({3})', item['salesOrderNumber'], item['PIDCode'], item['originalQty'], item['lineID']);
        item['qty'] = (item.qpaa ? item.qpaa : 1) * item['qty'];
      });
      // following added to  open add work order pop up directly with sales order option
      if (vm.woData.isFromList === 1 && vm.autoCompleteSOList) {
        $scope.$broadcast(vm.autoCompleteSOList.inputName, response.data[0]);
      }
      return response.data;
    }).catch((error) => BaseService.getErrorLog(error));

    // Select Sales order "Workorder for Sales order" option-2
    const selectSalesOrderForWO = (item) => {
      if (item) {
        if (item.initialStockCount > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_SO_NOT_ALLOWED_INITIAL_STOCK_CREATED);
          messageContent.message = stringFormat(messageContent.message, item.salesOrderNumber);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            vm.autoCompleteSOList.keyColumnmID = null;
            return;
          });
        } else if (item.partStatus === CORE.PartStatusList.InActiveInternal && !(vm.recordUpdate || vm.recordView)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              selectSalesOrderForWOAfterConfirmation(item);
            }
          }, () => {
            resetSelectedSalesOrderForWO();
            if (vm.autoCompleteSOList && vm.autoCompleteSOList.keyColumnId) {
              vm.autoCompleteSOList.keyColumnId = null;
              $scope.$broadcast(vm.autoCompleteSOList.inputName + 'searchText', null);
            }
            setFocusByName(vm.autoCompleteSOList.inputName);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          selectSalesOrderForWOAfterConfirmation(item);
        }
      } else {
        resetSelectedSalesOrderForWO();
      }
    };

    //on remove selection  or confirm with "no" for inactive part
    const resetSelectedSalesOrderForWO = () => {
      vm.addWorkorderModel.customerID = null;
      vm.addWorkorderModel.partID = null;
      vm.addWorkorderModel.PIDCode = null;
      vm.addWorkorderModel.customerName = null;
      vm.addWorkorderModel.rohsName = null;
      vm.addWorkorderModel.rohsIcon = null;
      vm.addWorkorderModel.RoHSStatusID = null;
      vm.addWorkorderModel.mfgPN = null;
      vm.addWorkorderModel.description = null;
      vm.addWorkorderModel.nickName = null;
      vm.disableObject.CustomerForWOwithSO = false;
      vm.disableObject.AssemblyForWOwithSO = false;
      vm.SOAssyListCustomerWise = [];
      vm.poAssemblyDetails = null;
      vm.dataFilled = vm.dataFilled > 0 ? vm.dataFilled - 1 : 0;
    };

    // Select Sales order "Workorder for Sales order" option-2 after inactive part stauts confirmation
    const selectSalesOrderForWOAfterConfirmation = (item) => {
      vm.addWorkorderModel.customerID = item.customerID;
      vm.addWorkorderModel.partID = item.partID;
      vm.addWorkorderModel.PIDCode = item.PIDCode;
      vm.addWorkorderModel.customerName = item.mfgFormattedName;
      vm.addWorkorderModel.RoHSStatusID = item.RoHSStatusID;
      vm.addWorkorderModel.rohsName = item.rohsName;
      if (item.rohsIcon && !item.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
        item.rohsIcon = vm.rohsImagePath + item.rohsIcon;
      }
      vm.addWorkorderModel.rohsIcon = item.rohsIcon;
      vm.addWorkorderModel.mfgPN = item.mfgPN;
      vm.addWorkorderModel.description = item.description;
      vm.addWorkorderModel.nickName = item.nickName;
      vm.disableObject.CustomerForWOwithSO = true;
      vm.disableObject.AssemblyForWOwithSO = true;
      vm.dataFilled = (vm.dataFilled || 0) + 1;
      getIdlePOQtyByAssyID();
      getSOAssyList().then(() => {
        vm.SOAssyListCustomerWise[0].isEditClicked = false;
        vm.SOAssyListCustomerWise[0].autoCompleteSOAssy.keyColumnId = item.id;
        addEmptysalesOrder(false);
      });
    };

    // on select callback for WO  after confirming for inactive part status
    const selectWoForCopyWOAfterConfirmation = (item) => {
      vm.addWorkorderModel.fromWoId = item.woID;
      vm.addWorkorderModel.customerID = item.customerID;
      vm.addWorkorderModel.partID = item.partID;
      vm.addWorkorderModel.customerName = item.customer.mfgCodeName;
      vm.addWorkorderModel.PIDCode = item.componentAssembly.PIDCode;
      vm.addWorkorderModel.RoHSStatusID = item.componentAssembly.RoHSStatusID;
      vm.addWorkorderModel.rohsName = item.rohs.name;
      if (!item.rohs.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
        item.rohs.rohsIcon = vm.rohsImagePath + item.rohs.rohsIcon;
      }
      vm.addWorkorderModel.rohsIcon = item.rohs.rohsIcon;
      vm.addWorkorderModel.mfgPN = item.componentAssembly.mfgPN;
      vm.addWorkorderModel.fromWoNumber = item.woNumber;
      //vm.disableAssyAutoComplete = true;
      //vm.disableCustomerAutoComplete = true;
      //vm.disableLeftSectionOpFrom = true;
      vm.disableObject['CustomerForWOwithoutSO'] = true;
      vm.disableObject['AssemblyForWOwithoutSO'] = true;
      vm.disableObject['OpFromLeftForWOwithoutSO'] = true;
      vm.addWorkorderModel.isCopyOPFromRightSection = 'PW';
      vm.addWorkorderModel.isCopyOPFromLeftSection = null;
      resetWO();
      resetMasterTemplate();
      getAllPrevWoListForCustomerAssy();
      vm.dataFilled = (vm.dataFilled || 0) + 1;
    };

    // Select WO  for  From Work Order Option-1
    const selectWOForCopyWO = (item) => {
      if (item) {
        if (item.componentAssembly.partStatus === CORE.PartStatusList.InActiveInternal) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              selectWoForCopyWOAfterConfirmation(item);
              setFocusByName(vm.autoCompleteWOList.inputName);
            }
          }, () => {
            resetSelectedWOForCopyWO();
            setFocusByName(vm.autoCompleteWOList.inputName);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          selectWoForCopyWOAfterConfirmation(item);
        }
      } else {
        resetSelectedWOForCopyWO();
      }
    };

    // on remove selection  or confirm with "no" for inactive part
    const resetSelectedWOForCopyWO = () => {
      vm.addWorkorderModel.fromWoId = null;
      vm.addWorkorderModel.customerID = null;
      vm.addWorkorderModel.partID = null;
      vm.addWorkorderModel.customerName = null;
      vm.addWorkorderModel.PIDCode = null;
      vm.addWorkorderModel.rohsName = null;
      vm.addWorkorderModel.RoHSStatusID = null;
      vm.addWorkorderModel.rohsIcon = null;
      vm.addWorkorderModel.mfgPN = null;
      // vm.addWorkorderModel.customerID = item.customerID;
      vm.addWorkorderModel.fromWoNumber = null;
      vm.disableObject['CustomerForWOwithoutSO'] = false;
      vm.disableObject['AssemblyForWOwithoutSO'] = false;
      vm.disableObject['OpFromLeftForWOwithoutSO'] = false;
      vm.dataFilled = vm.dataFilled > 0 ? vm.dataFilled - 1 : 0;
      vm.woList = [];
      if (vm.autoCompleteWO) {
        vm.autoCompleteWO.keyColumnId = null;
      }
      vm.prevWoListForAssyCustomer = [];
      if (vm.autoCompletePrevWO) {
        vm.autoCompletePrevWO.keyColumnId = null;
      }
    };

    // on select callback for assembly revision for add new and selected item
    const selectSOAssyCallBack = (item, salesItem) => {
      let messageContent;
      if (!item) {
        resetAssembly(salesItem);
      }
      else {
        const inCompleteSalesDetails = _.find(vm.SOAssyListCustomerWise, (salesObj) => salesObj.isEditClicked === true);
        if (inCompleteSalesDetails && inCompleteSalesDetails.autoCompleteSOAssy &&
          inCompleteSalesDetails.autoCompleteSOAssy.keyColumnId > 0 &&
          inCompleteSalesDetails.saleorderDetID !== item.id) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SAVE_DETAILS_FIRST);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return false;
        }
        if (item.id) {
          const salesOrderFound = _.find(vm.SOAssyListCustomerWise, (itemObj) => itemObj.saleorderDetID === item.id);
          if (salesOrderFound && !salesItem.saleorderDetID) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_ALREADY_ADDED_UPDATE_QTY_IN_SAME);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            // remove last record from array
            vm.SOAssyListCustomerWise.pop();
            // add new empty salesorder details
            salesItem.isEditClicked = false;
            const soObj = _.find(vm.SOAssyListCustomerWise, (obj) => obj.saleorderDetID == null);
            if (!soObj) {
              addEmptysalesOrder(true);
            }
            return false;
          } else if (item.initialStockCount > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_SO_NOT_ALLOWED_INITIAL_STOCK_CREATED);
            messageContent.message = stringFormat(messageContent.message, item.salesOrderNumber);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
              // remove last record from array
              vm.SOAssyListCustomerWise.pop();
              // add new empty salesorder details
              salesItem.isEditClicked = false;
              const soObj = _.find(vm.SOAssyListCustomerWise, (obj) => {
                if (obj) {
                  return obj.saleorderDetID == null;
                }
              });
              if (!soObj) {
                addEmptysalesOrder(true);
              }
              //salesItem.isCustomFocus = true;
              // setFocus('filteredSOList0');// stringFormat('{0}{1}', 'filteredSOList', eleIndex));
              return false;
            });
          }
        }
        salesItem.isCustomFocus = false;
        salesItem.saleorderDetID = item.id;
        salesItem.poNumber = item.poNumber;
        salesItem.salesOrderNumber = item.salesOrderNumber;
        salesItem.mfgPN = item.mfgPN;
        salesItem.PIDCode = item.PIDCode;
        salesItem.qpaa = angular.copy(item.qpaa);
        salesItem.oldPOQty = angular.copy(item.qty);
        salesItem.poQty = item.qty;
        salesItem.tempqty = item.qty;
        salesItem.description = item.description;
        salesItem.nickName = item.nickName;
        salesItem.RoHSStatusID = item.RoHSStatusID;
        salesItem.partID = item.partID;
        salesItem.isHotJob = item.isHotJob;
        salesItem.liveVersion = item.liveVersion;
        salesItem.refSalesOrderID = item.refSalesOrderID;
        salesItem.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + item.rohsIcon;
        salesItem.rohsName = item.rohsName;
        vm.setSumPoQty();
        bindWOSODetails(salesItem);
      }
      vm.getRepeatType();
    };

    const bindWOSODetails = (salesItem) => {
      var detailPromise = [];
      //detailPromise.push(getwoMaxNumber());
      vm.getRepeatType();
      if (vm.SOAssyListCustomerWise.length === 1) {
        detailPromise.push(getIdlePOQtyByAssyID());
      }
      vm.cgBusyLoading = $q.all(detailPromise).then(() => {
        _.each(vm.SOAssyListCustomerWise, (item) => {
          if (item.saleorderDetID === salesItem.saleorderDetID) {
            const poDetails = _.filter(vm.poAssemblyDetails, (obj) => item.saleorderDetID === obj.salesOrderDetailID);
            item.totalAssignedPOQty = 0;
            item.totalAssignedScrappedQty = 0;
            if (item && poDetails.length > 0) {
              item.totalAssignedPOQty = (_.sumBy(poDetails, (o) => parseInt(o.woPOQty)));
              item.totalAssignedScrappedQty = (_.sumBy(poDetails, (o) => parseInt(o.woScrapQty)));
              item.actualIdlePOQty = (IfNull(item.oldPOQty, 0) - IfNull(item.totalAssignedPOQty, 0) + IfNull(item.totalAssignedScrappedQty, 0));
              item.idlePOQty = (IfNull(item.oldPOQty, 0) - IfNull(item.totalAssignedPOQty, 0) + IfNull(item.totalAssignedScrappedQty, 0));
              item.poQty = (item.idlePOQty);
              if ((!item.isEditClicked) && vm.autoCompleteSOList && vm.autoCompleteSOList.keyColumnId) {
                item.idlePOQty = item.idlePOQty - item.poQty;
              }
            } else {
              item.actualIdlePOQty = IfNull(item.oldPOQty, 0);
              item.idlePOQty = IfNull(item.oldPOQty, 0);
            }
          }
        });
        vm.setSumPoQty();
      });
    };
    // on select callback for assembly revision for add new and selected item
    const selectAssyCallBack = (item) => {
      if (!item) {
        vm.woAssyList = [];
        vm.SOAssyList = [];
        vm.SOAssyListCustomerWise = [];
        vm.woList = [];
        resetTerminatWO();
        resetAssembly();
        vm.addWorkorderModel.partID = null;
        vm.dataFilled = vm.dataFilled > 0 ? vm.dataFilled - 1 : 0;
      }
      else {
        let messageContent;
        if (item.rfqOnly) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.ASSEMBLY_RFQ_ONLY_ERROR);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            // item = null;
            if (vm.autoCompleteAssy.keyColumnId) {
              $scope.$broadcast(vm.autoCompleteAssy.inputName + 'searchText', null);
            }
          });
        } else {
          if (item.isGoodPart !== vm.PartCorrectList.CorrectPart || item.partStatus === vm.CorePartStatusList.TBD) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.RESTRICTED_INCORRECT_PART);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, () => {
            });
            return;
          } else if (!item.RoHSStatusID || item.RoHSStatusID === -1) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_ROHS_STATUS);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messagealertDialog(model, () => {
            });
            return;
          } else {
            if (item.partStatus === CORE.PartStatusList.InActiveInternal) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, item.PIDCode);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  selectAssyCallBackAfterConfirmation(item);
                  setFocusByName(vm.autoCompleteAssy.inputName);
                }
              }, () => {
                vm.woAssyList = [];
                vm.SOAssyList = [];
                vm.SOAssyListCustomerWise = [];
                vm.woList = [];
                resetTerminatWO();
                resetAssembly();
                vm.addWorkorderModel.partID = null;
                vm.dataFilled = vm.dataFilled > 0 ? vm.dataFilled - 1 : 0;
                if (vm.autoCompleteAssy) {
                  vm.autoCompleteAssy.keyColumnId = null;
                }
                setFocusByName(vm.autoCompleteAssy.inputName);
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              selectAssyCallBackAfterConfirmation(item);
            }
          }
        }
      }
      vm.changeCopyFromTypeLeftSection();
    };
    // select assy after confiming for  inactive part status
    const selectAssyCallBackAfterConfirmation = (item) => {
      vm.addWorkorderModel.partID = item.id;
      //vm.addWorkorderModel.isHotJob = item.isHotJob;
      vm.addWorkorderModel.liveVersion = item.liveVersion;
      vm.addWorkorderModel.PIDCode = item.PIDCode;
      vm.addWorkorderModel.mfgPN = item.mfgPN;
      vm.addWorkorderModel.description = item.description;
      vm.addWorkorderModel.nickName = item.nickName;
      vm.addWorkorderModel.RoHSStatusID = item.RoHSStatusID;
      if (!item.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
        item.rohsIcon = vm.rohsImagePath + item.rohsIcon;
      }
      vm.addWorkorderModel.rohsIcon = item.rohsIcon;
      vm.addWorkorderModel.rohsName = item.rohsName;
      vm.addWorkorderModel.isCustom = item.isCustom; // isCustom Assy/part
      vm.dataFilled = (vm.dataFilled || 0) + 1;
      //getwoMaxNumber();
      vm.getRepeatType();
      if (vm.addWorkorderModel.isFromSO === 'S') {
        getSOAssyList();
      } else if (vm.addWorkorderModel.isFromSO === 'U') {
        getWorkOrderListByAssyID();
      }
    };


    /*
   * Author :  Vaibhav Shah
   * Purpose : Get Sales Order Assembly List
   */
    let soAssyList = [];
    const getSOAssyList = () => {
      soAssyList = [];
      vm.SOAssyList = [];
      return MasterFactory.getSOAssyPartList().query({
        customerID: (vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : 0) || vm.addWorkorderModel.customerID,
        partID: vm.addWorkorderModel.partID,
        subAssyID: ((vm.woData && vm.woData.subAssy) ? vm.woData.subAssy.id : null)
      }).$promise.then((response) => {
        _.map(response.data, (item) => {
          item['originalQty'] = item['qty'];
          item.salescolumn = stringFormat('{0}, {1}, {2} ({3})', item['salesOrderNumber'], item['PIDCode'], item['originalQty'], item['lineID']);
          item['qty'] = (item.qpaa ? item.qpaa : 1) * item['qty'];
        });
        soAssyList = response.data;
        vm.SOAssyList = angular.copy(soAssyList);
        if (vm.SOAssyList && vm.SOAssyList.length > 0) {
          _.each(vm.SOAssyListCustomerWise, (objItem) => {
            objItem.filteredSOList = _.filter(vm.SOAssyList, (salesItem) => salesItem.AssyType === objItem.assyType);
          });
          addEmptysalesOrder(false);
        }
        return vm.SOAssyList;
      }).catch((error) => BaseService.getErrorLog(error));
    };


    // initalize autocomplete for sales order assembly
    // [so#, Assy ID, PO Qty]
    // sales order details autocomplete
    const defaultAutoCompleteSalesOrderNumber = {
      columnName: 'salescolumn',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'soAssy',
      placeholderName: 'soAssy',
      isRequired: false,
      isAddnew: true,
      callbackFn: getSOAssyList,
      onSelectCallbackFn: selectSOAssyCallBack,
      isAddFromRoute: true,
      routeName: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE,
      addData: {
        routeParams: { sID: 0 }
      }
    };

    const defaultsalesOrder = {
      isEditClicked: false,
      qpaa: 0,
      oldPOQty: null,
      poQty: null,
      tempqty: 0,
      autoCompleteSOAssy: {}
    };

    // add an empty sales order details
    function addEmptysalesOrder(setFocus) {
      var emptyObj = angular.copy(defaultsalesOrder);
      const inCompleteSalesDetails = _.find(vm.SOAssyListCustomerWise, (salesItem) => salesItem.isEditClicked === true);
      if (inCompleteSalesDetails) {
        return false;
      }
      emptyObj.autoCompleteSOAssy = angular.copy(defaultAutoCompleteSalesOrderNumber);
      emptyObj.isEditClicked = true;
      emptyObj.assyType = 1;
      if (vm.SOAssyListCustomerWise.length === 0 && vm.woData.isFromWO) {
        // check if same assembly found than select first
        let soObj = _.find(vm.SOAssyList, (soItem) => soItem.id === vm.woData.soDetId && soItem.partID === vm.woData.mainAssy.id);
        if (!soObj) {
          soObj = _.find(vm.SOAssyList, (soItem) => {
            if (vm.woData && vm.woData.mainAssy) {
              return soItem.partID === vm.woData.mainAssy.id;
            }
          });
        }
        if (soObj) {
          emptyObj.assyType = soObj.AssyType;
          emptyObj.saleorderDetID = emptyObj.autoCompleteSOAssy.keyColumnId = soObj.id;
        } else {
          emptyObj.assyType = 1;
          emptyObj.saleorderDetID = emptyObj.autoCompleteSOAssy.keyColumnId = null;
          vm.SOAssyList = [];
        }
        emptyObj.saleorderDetID = soObj ? soObj.id : null;
      }
      //else {
      //  if (vm.woData && vm.woData.salesOrderDetailId) {
      //    emptyObj.assyType = 1;
      //    emptyObj.saleorderDetID = vm.woData.salesOrderDetailId || null;
      //    vm.SOAssyList = [];
      //  }
      //}
      emptyObj.filteredSOList = _.filter(vm.SOAssyList, (salesItem) => salesItem.AssyType === emptyObj.assyType);
      emptyObj.isCustomFocus = setFocus;
      vm.SOAssyListCustomerWise.push(emptyObj);
      vm.setSumPoQty();
    }
    const getAssyList = () => {
      vm.assyList = [];
      const searchObj = {
        customerID: vm.autoCompleteCustomer.keyColumnId,
        assyIds: vm.woData.isFromWO ? vm.woData.subAssy.id : null
      };
      return MasterFactory.getAssyPartList().query(searchObj).$promise.then((response) => {
        vm.assyList = response.data;
        //initAutoCompleteAssy();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // initalize autocomplete for assembly
    const initAutoCompleteAssy = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: (vm.woData && vm.woData.subAssy) ? (vm.woData.subAssy.id) : (vm.addWorkorderModel ? (vm.addWorkorderModel.partID ? vm.addWorkorderModel.partID : null) : null),
        inputName: 'Assembly',
        placeholderName: 'Assy ID',
        isRequired: true,
        isAddnew: true,
        callbackFn: getAssyList,
        onSelectCallbackFn: selectAssyCallBack,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        }
      };
    };
    initAutoCompleteAssy();

    /*
    * Author :  Vaibhav Shah
    * Purpose : Get Customer List
    */
    const getCustomerList = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((customer) => {
      if (customer && customer.data) {
        vm.CustomerList = customer.data;
        if (vm.autoCompleteCustomer && vm.addWorkorderModel.customerID) {
          $scope.$broadcast(vm.autoCompleteCustomer.inputName, customer.data[0]);
        }
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));

    /*
   * Author :  Vaibhav Shah
   * Purpose : Get Assembly List
   */


    const resetAssembly = (salesItem) => {
      if (salesItem) {
        salesItem.saleorderDetID = null;
        salesItem.poNumber = null;
        salesItem.mfgPN = null;
        salesItem.refSalesOrderID = null;
        salesItem.qpaa = null;
        salesItem.oldPOQty = null;
        salesItem.idlePOQty = null;
        salesItem.poQty = null;
        salesItem.tempqty = null;
        salesItem.description = null;
        salesItem.nickName = null;
        salesItem.RoHSStatusID = null;
        salesItem.PIDCode = null;
        salesItem.rohsIcon = null;
        salesItem.rohsName = null;
        salesItem.partID = null;
        salesItem.isHotJob = null;
        salesItem.liveVersion = null;
        taskConfirmationInfo = null;
        if (vm.SOAssyListCustomerWise.length === 1) {
          const soObj = _.find(vm.SOAssyListCustomerWise, (obj) => {
            if (obj) {
              return obj.mfgPN == null;
            }
          });
          if (soObj) {
            resetCommonFields();
          }
        }
      } else {
        vm.addWorkorderModel.mfgPN = null;
        vm.addWorkorderModel.description = null;
        vm.addWorkorderModel.nickName = null;
        vm.addWorkorderModel.RoHSStatusID = null;
        vm.addWorkorderModel.PIDCode = null;
        vm.addWorkorderModel.RoHSStatusID = null;
        vm.addWorkorderModel.rohsIcon = null;
        vm.addWorkorderModel.rohsName = null;
        vm.addWorkorderModel.isCustom = null;  // isCustom Assy/part
        vm.addWorkorderModel.isRepeat = null;
        vm.addWorkorderModel.isNewRevision = null;
        vm.addWorkorderModel.masterTemplateID = null;
        vm.addWorkorderModel.refrenceWOID = null;
        vm.addWorkorderModel.refrenceWoNumber = null;
        vm.addWorkorderModel.woType = null;
        vm.addWorkorderModel.woNumber = null;
        vm.addWorkorderModel.poQty = null;
        taskConfirmationInfo = null;
        resetTerminatWO();
        resetCommonFields();
      }
      vm.addWorkorderModel.isCopyOPFrom = null;
      //vm.changeCopyFromType();
      vm.getRepeatType();
    };

    // get callback function on select of customer
    const getcustomerdetail = (item) => {
      if (item) {
        if (vm.addWorkorderModel.isFromSO === 'S') {
          vm.disableObject.SOListForWOwithSO = true;
        } else if (vm.addWorkorderModel.isFromSO === 'W') {
          vm.disableObject['WOListForWOwithoutSO'] = true;
          vm.disableObject['OpFromRightForWOwithoutSO'] = true;
          vm.addWorkorderModel.isCopyOPFromRightSection = null;
        }
        if (vm.autoCompleteCustomer) {
          vm.autoCompleteCustomer.keyColumnId = item.id;
          vm.addWorkorderModel.customerID = item.id;
          vm.addWorkorderModel.customerName = item.mfgCodeName;
        }
        vm.dataFilled = (vm.dataFilled || 0) + 1;
        getAssyList();
        vm.EmptyMesssageSalesOrder.MESSAGE = stringFormat(emptyMessage, vm.addWorkorderModel.customerName);
      } else {
        if (vm.addWorkorderModel.isFromSO === 'S') {
          vm.disableObject.SOListForWOwithSO = false;
        } else if (vm.addWorkorderModel.isFromSO === 'W') {
          vm.disableObject['WOListForWOwithoutSO'] = false;
          vm.disableObject['OpFromRightForWOwithoutSO'] = false;
        }
        vm.addWorkorderModel.customerID = null;
        vm.addWorkorderModel.partID = null;
        vm.addWorkorderModel.customerName = null;
        if (vm.autoCompleteCustomer) {
          vm.autoCompleteCustomer.keyColumnId = null;
          vm.autoCompleteAssy.keyColumnId = null;
        }
        if (vm.autoCompleteAssy) {
          vm.autoCompleteAssy.keyColumnId = null;
        }
        vm.dataFilled = vm.dataFilled > 0 ? vm.dataFilled - 1 : 0;
        vm.assyList = [];
        vm.SOAssyList = [];
        vm.SOAssyListCustomerWise = [];
        vm.woList = [];
        resetAssembly();
        vm.EmptyMesssageSalesOrder.MESSAGE = stringFormat(emptyMessage, 'Customer');
      }
      vm.changeCopyFromTypeLeftSection();
    };

    // get assembly stock status list
    const getIdlePOQtyByAssyID = () => {
      vm.woAssemblyDetails = null;
      vm.poAssemblyDetails = null;
      const listObj = {
        assyID: (vm.woData && vm.woData.isFromWO && vm.woData.subAssy) ? vm.woData.subAssy.id : vm.addWorkorderModel.partID,
        woID: null
      };
      return WorkorderFactory.getIdlePOQtyByAssyID().query({
        listObj: listObj
      }).$promise.then((assemblyDetails) => {
        vm.poAssemblyDetails = angular.copy(assemblyDetails.data.poAssemblyDetails);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initPopup = () => {
      // on page load bind autocomplete of customer.
      const searchObj = {};
      //if (vm.woData.isFromWO) {
      //  vm.addWorkorderModel.customerID = vm.woData.customerID;
      //  searchObj.mfgcodeID = vm.woData.customerID;
      //  searchObj.isCustomer = true;
      //}
      const autocompletePromise = [getCustomerList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        $timeout(() => {
          initAutoCompleteForSOWO();
          initAutoComplete();
          if (vm.woData.isFromList === 1 && vm.autoCompleteSOList) {
            const searchObj = {
              salesOrderDetId: vm.woData.salesOrderDetailId
            };
            getSalesOrderListForWO(searchObj);
          } else if (vm.woData.isFromList === 2) {
            changeWorkOrderTypeDetails();
          } else if (vm.woData.isFromWO) {
            vm.addWorkorderModel.customerID = vm.woData.customerID;
            searchObj.mfgcodeID = vm.woData.customerID;
            searchObj.isCustomer = true;
            getCustomerList(searchObj);
            setFocus('rightSectionCustomerFromSO');
          } else {
            // setFocus('addWOFrom');
            setFocus('leftSectionCustomerFromWO');
          }
        }, _configSelectListTimeout);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    initPopup();


    const resetCommonFields = () => {
      vm.addWorkorderModel.woNumber = null;
      vm.addWorkorderModel.buildQty = null;
      vm.addWorkorderModel.excessQty = null;
    };

    // change work order type details
    const changeWorkOrderTypeDetails = () => {
      const oldIsFromSO = angular.copy(vm.addWorkorderModel.isFromSO);
      vm.addWorkorderModel = {
        isRevisedWO: false,
        isFromSO: oldIsFromSO
      };
      vm.disableObject.isDisableOpFromCommon = false;
      vm.showPartitionInTopSection = true;
      resetCommonFields();
      if (vm.addWorkorderModel.isFromSO === 'N') {
        // vm.addWorkorderForm.$setPristine();
        vm.disableObject.isDisableOpFromCommon = true;
        vm.addWorkorderModel.isCopyOPFrom = null;
        vm.showPartitionInTopSection = false;
        vm.SOAssyListCustomerWise = [];
        if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId) {
          vm.autoCompleteCustomer.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
        }
        if (vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId) {
          vm.autoCompleteAssy.keyColumnId = null;
          vm.assyList = [];
        }
      }
      else if (vm.addWorkorderModel.isFromSO === 'U') {
        vm.SOAssyListCustomerWise = [];
        vm.addWorkorderModel.isRevisedWO = true;
        getWorkOrderListByAssyID();
        // getcustomerdetail();
        if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId) {
          vm.autoCompleteCustomer.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
        }
        if (vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId) {
          vm.autoCompleteAssy.keyColumnId = null;
          vm.assyList = [];
        }
        vm.showPartitionInTopSection = false;
        // initAutoCompleteAssy();
        vm.SOAssyListCustomerWise = [];
      }
      else {
        vm.SOAssyListCustomerWise = [];
        // clear terminate details on changes
        resetTerminatWO();
        resetTerminatWOOP();
        if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.keyColumnId) {
          vm.autoCompleteCustomer.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName + 'searchText', null);
        }
        if (vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId) {
          vm.autoCompleteAssy.keyColumnId = null;
          vm.assyList = [];
        }
        if (vm.addWorkorderModel.isFromSO === 'W') {
          vm.addWorkorderModel.isCopyOPFromRightSection = 'PW';
          vm.disableObject.CustomerForWOwithoutSO = false;
          vm.disableObject.WOListForWOwithoutSO = false;
        } else if (vm.addWorkorderModel.isFromSO === 'S') {
          vm.disableObject.SOListForWOwithSO = false;
          vm.disableObject.CustomerForWOwithSO = false;
          vm.disableObject.AssemblyForWOwithSO = false;
        }
      }
    };

    const resetOldValues = () => {
      if (vm.addWorkorderModel.isFromSO === 'W') {
        const searchObj = {
          searchWoID: vm.addWorkorderModel.fromWoId
        };
        getWorkOrderListForCopyWO(searchObj);
        if (vm.addWorkorderModel.customerID && vm.autoCompleteCustomer && (!vm.addWorkorderModel.fromWoId)) {
          const searchObj = {
            mfgcodeID: vm.addWorkorderModel.customerID
          };
          getCustomerList(searchObj);
        }
      }
    };

    vm.changeWOFromType = () => {
      if (vm.woData.isFromWO && vm.addWorkorderModel.isFromSO !== 'S') {
        return;
      }
      if (vm.addWorkorderModel.isFromSO === 'S') {
        initAutoCompleteForSOWO();
      }
      if (vm.dataFilled > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGE_WORKORDER_TYPE_CONFIRM);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            vm.dataFilled = 0;
            changeWorkOrderTypeDetails();
          }
          else {
            vm.addWorkorderModel.isFromSO = oldIsFromSO;
            if (vm.addWorkorderModel.customerID && vm.autoCompleteCustomer) {
              const searchObj = {
                mfgcodeID: vm.addWorkorderModel.customerID
              };
              getCustomerList(searchObj);
            }
          }
        }, () => {
          //console.log('line 784');
          //console.log(vm.addWorkorderModel);
          vm.addWorkorderModel.isFromSO = oldIsFromSO;
          resetOldValues();
        }).catch((error) => {
          vm.addWorkorderModel.isFromSO = oldIsFromSO;
          return BaseService.getErrorLog(error);
        });
      } else {
        changeWorkOrderTypeDetails();
      }
    };

    //on edit click of particular sales order item.
    vm.woSalesOrderEditClicked = (salesItem) => {
      salesItem.isEditClicked = true;
      vm.setSumPoQty();
    };

    //delete workorder sales order detail
    vm.deleteWoSalesOrdrDetail = (salesItem, $index) => {
      if (salesItem && salesItem.saleorderDetID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Work Order Sales Order detail', 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            removeFromSOAssyList($index);
          }
          updateSOAssyList();
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      updateSOAssyList();
    };

    // remove from sales order work order list
    const removeFromSOAssyList = (index) => {
      // remove from list
      vm.SOAssyListCustomerWise.splice(index, 1);
      _.each(vm.SOAssyListCustomerWise, { isEditClicked: false });
      const soObj = _.find(vm.SOAssyListCustomerWise, (obj) => {
        if (obj) {
          return obj.mfgPN == null;
        }
      });
      if (!soObj) {
        addEmptysalesOrder(false);
      }
    };

    // update and set po qty
    const updateSOAssyList = () => {
      //check length of list
      if (vm.SOAssyListCustomerWise.length === 1) {
        // check if empty object than reset all array
        const soObj = _.find(vm.SOAssyListCustomerWise, (obj) => {
          if (obj) {
            return obj.mfgPN == null;
          }
        });
        if (soObj) {
          vm.SOAssyList = angular.copy(soAssyList);
          // vm.addWorkorderModel.liveVersion = null;
          // vm.addWorkorderModel.RoHSStatusID = null;
          // vm.addWorkorderModel.PIDCode = null;
          // vm.addWorkorderModel.mfgPN = null;
          // vm.addWorkorderModel.rohsName = null;
          // vm.addWorkorderModel.rohsIcon = null;
        }
      }
      vm.setSumPoQty();
    };

    //save workorder sales order detail
    vm.SaveWoSalesOrdrDetail = (salesItem, currentIndex) => {
      if (!salesItem.autoCompleteSOAssy.keyColumnId) {
        return true;
      }
      if (!salesItem.poQty || !salesItem.poQty < 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CAN_NOT_ADD_SO_IN_WO);
        messageContent.message = stringFormat(messageContent.message, salesItem.salesOrderNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus(stringFormat('{0}{1}', 'poQty', currentIndex));
        });
        return;
      }
      salesItem.isEditClicked = false;
      const soObj = _.find(vm.SOAssyListCustomerWise, (obj) => {
        if (obj) {
          return obj.saleorderDetID == null;
        }
      });
      if (!soObj) {
        addEmptysalesOrder(true);
      }
      salesItem.idlePOQty = IfNull(salesItem.oldPOQty, 0) - IfNull(salesItem.totalAssignedPOQty, 0) - IfNull(salesItem.poQty, 0) + IfNull(salesItem.totalAssignedScrappedQty, 0);
      vm.setSumPoQty();
    };
    //to add new sales order detail.
    vm.addSalesOrderRecord = () => {
      BaseService.goToManageSalesOrder();
    };

    // refresh sales order list
    vm.refreshSalesOrder = () => {
      getSOAssyList();
    };

    vm.getRepeatType = () => {
      vm.headerdata = [];
      // if open popup from WO than display assembly and work order
      if (vm.woData.isFromWO) {
        vm.headerdata.push({
          label: 'Parent ' + vm.allLabelConstant.Assembly.PIDCode,
          value: angular.copy(vm.woData.mainAssy.PIDCode),
          displayOrder: 1,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { partID: vm.woData.mainAssy.id },
          isCopy: true,
          isCopyAheadLabel: false,
          isAssy: true,
          imgParms: {
            imgPath: vm.woData.mainAssy.rohsIcon,
            imgDetail: vm.woData.mainAssy.rohsName
          }
        });
        vm.headerdata.push({
          label: vm.allLabelConstant.Assembly.PIDCode,
          value: angular.copy(vm.woData.subAssy.PIDCode),
          displayOrder: 1,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { partID: vm.woData.subAssy.id },
          isCopy: true,
          isCopyAheadLabel: false,
          isAssy: true,
          imgParms: {
            imgPath: vm.woData.subAssy.rohsIcon,
            imgDetail: vm.woData.subAssy.rohsName
          }
        });
        vm.headerdata.push({
          label: 'Parent ' + vm.allLabelConstant.Workorder.WO,
          value: vm.woData.woNumber + '-' + vm.woData.woVersion,
          labelLinkFn: vm.goToWorkorderList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { woID: vm.woData.woID },
          displayOrder: 2
        });
      }

      //if (vm.addWorkorderModel) {
      //  if (!vm.addWorkorderModel.isRepeat && vm.addWorkorderModel.isNewRevision) {
      //    vm.addWorkorderModel.woType = 1;
      //  } else if (vm.addWorkorderModel.isRepeat && !vm.addWorkorderModel.isNewRevision) {
      //    vm.addWorkorderModel.woType = 2;
      //  } else if (vm.addWorkorderModel.isRepeat && vm.addWorkorderModel.isNewRevision) {
      //    vm.addWorkorderModel.woType = 3;
      //  } else {
      //    vm.addWorkorderModel.woType = 1;
      //  }
      //}
      //if (vm.addWorkorderModel.woType) {
      //  const workOrderType = _.find(CORE.workOrderTypesWithECORequestType, (item) => item.value === vm.addWorkorderModel.woType);
      //  vm.headerdata.push({ label: 'Type', value: workOrderType.requestType, displayOrder: 2 });
      //} else {
      //  vm.headerdata = [];
      //}
    };

    // save work order info
    const SaveWorkorderInfo = () => {
      vm.saveBtnDisableFlag = true;
      //if (!vm.addWorkorderModel.woNumber) {
      //  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_NUMBER_INVALID);
      //  const model = {
      //    messageContent: messageContent,
      //    multiple: true
      //  };
      //  DialogFactory.messageAlertDialog(model, () => {
      //  });
      //  vm.saveBtnDisableFlag = false;
      //  return;
      //}

      // start - create salesorder workorder details
      vm.addWorkorderModel.salesOrderDetails = [];
      _.each(vm.SOAssyListCustomerWise, (salesItem) => {
        if (salesItem.saleorderDetID) {
          const objSO = {};
          objSO.salesOrderDetailID = salesItem.saleorderDetID;
          objSO.partID = salesItem.partID;
          objSO.parentPartID = (vm.autoCompleteAssy && vm.autoCompleteAssy.keyColumnId) ? vm.autoCompleteAssy.keyColumnId : vm.addWorkorderModel.partID;
          objSO.oldPOQty = angular.copy(salesItem.poQty);
          objSO.qpa = salesItem.qpaa;
          objSO.poQty = salesItem.poQty;
          if (!vm.addWorkorderModel.isHotJob && salesItem.isHotJob) {
            vm.addWorkorderModel.isHotJob = salesItem.isHotJob;
          }
          vm.addWorkorderModel.salesOrderDetails.push(objSO);
        }
      });
      // end - create salesorder workorder details

      //if (!vm.addWorkorderModel.isRepeat && vm.addWorkorderModel.isNewRevision) {
      //  vm.addWorkorderModel.woType = 1;
      //} else if (vm.addWorkorderModel.isRepeat && !vm.addWorkorderModel.isNewRevision) {
      //  vm.addWorkorderModel.woType = 2;
      //} else if (vm.addWorkorderModel.isRepeat && vm.addWorkorderModel.isNewRevision) {
      //  vm.addWorkorderModel.woType = 3;
      //} else {
      //  vm.addWorkorderModel.woType = 1;
      //}

      if (vm.addWorkorderModel.isFromSO === 'W') {
        if (vm.addWorkorderModel.isCopyOPFromRightSection) {
          vm.addWorkorderModel.isCopyOPFrom = vm.addWorkorderModel.isCopyOPFromRightSection;
        } else if (vm.addWorkorderModel.isCopyOPFromLeftSection) {
          vm.addWorkorderModel.isCopyOPFrom = vm.addWorkorderModel.isCopyOPFromLeftSection;
        }
      }
      vm.addWorkorderModel.taskConfirmationInfo = taskConfirmationInfo;

      // send parent WO ID in case of add from work order
      if (vm.woData.isFromWO) {
        vm.addWorkorderModel.parentWOID = vm.woData.woID;
        vm.addWorkorderModel.partID = vm.woData.subAssy.id;
      }

      vm.cgBusyLoading = WorkorderFactory.addWorkorder().save(vm.addWorkorderModel).$promise.then((response) => {
        if (response && response.data) {
          BaseService.goToWorkorderDetails(response.data.woID);
          vm.addWorkorderForm.$setPristine();
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide();
        }
        vm.saveBtnDisableFlag = false;
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
      //console.log(vm.addWorkorderModel);
    };

    // save workorder details
    vm.save = (ev) => {
      var woID = vm.addWorkorderModel.terminateWOID;
      var woOPID = vm.addWorkorderModel.terminateWOOPID;
      var messageContent;
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.addWorkorderForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      else if (vm.addWorkorderModel.isFromSO === 'S' && vm.SOAssyListCustomerWise.length <= 1) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SAVE_SALESORDER_DETAILS_FIRST);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model, () => {
          vm.saveBtnDisableFlag = false;
        });
        return;
      }
      if (vm.addWorkorderModel.isFromSO === 'U') {
        const qtyControl = vm.selectedTerminatedWOOP.qtyControl;
        if (!qtyControl) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_TERMINATED_NOT_ALLOW);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, () => {
            vm.saveBtnDisableFlag = false;
          });
          return;
        }
        else if (vm.inspectionProcess || vm.selectedTerminatedWOOP.isRework) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_TERMINATED_OPERATION_NA);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, () => {
          });
          vm.saveBtnDisableFlag = false;
          return;
        }
        else {
          if (vm.isParallelOperation) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_TERMINATED_NA);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, () => {
              vm.saveBtnDisableFlag = false;
            });
            return;
          }
        }
        MasterFactory.getTerminatedOperationDetail().query({ woID: woID }).$promise.then((response) => {
          if (response) {
            if (response.data) {
              let messageContent;
              switch (response.data.status) {
                case 'workorder': {
                  if (response.data.data.woOPID === woOPID) {
                    saveNewWorkOrderDetails(ev);
                  } else {
                    const opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, response.data.data.opName, response.data.data.opNumber);
                    messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_ALREADY_TERMINATED);
                    messageContent.message = stringFormat(messageContent.message, opName);
                    const model = {
                      messageContent: messageContent,
                      multiple: true
                    };
                    DialogFactory.messageAlertDialog(model, () => {
                    });
                  }
                  vm.saveBtnDisableFlag = false;
                  break;
                }
                case 'operation': {
                  let str = '<ul class="padding-left-20">';
                  response.data.data.forEach((x) => {
                    str += stringFormat('<li><b>({1}) {0}</b> by <b>{2}</b></li>', x.opName, convertToThreeDecimal(x.opNumber), x.employee);
                  });
                  str += '</ul>';
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.OPERATION_CHECK_IN_MULTI);
                  messageContent.message = stringFormat(messageContent.message, str);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model, () => {
                    vm.saveBtnDisableFlag = false;
                  });
                  break;
                }
              }
            }
            else {
              saveNewWorkOrderDetails(ev);
            }
          }
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          BaseService.getErrorLog(error);
        });
      } else {
        saveNewWorkOrderDetails(ev);
      }
    };

    const saveNewWorkOrderDetails = (ev) => {
      let messageContent;
      const inCompleteSalesDetails = _.find(vm.SOAssyListCustomerWise, (salesItem) => salesItem.isEditClicked === true);
      if (inCompleteSalesDetails && inCompleteSalesDetails.autoCompleteSOAssy &&
        inCompleteSalesDetails.autoCompleteSOAssy.keyColumnId > 0) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SAVE_SALESORDER_DETAILS_FIRST);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.saveBtnDisableFlag = false;
        return;
      }

      if (vm.addWorkorderModel.poQty && (vm.addWorkorderModel.poQty > vm.addWorkorderModel.buildQty)) {
        if (taskConfirmationInfo == null && vm.addWorkorderModel.poQty > vm.addWorkorderModel.buildQty) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.POQTY_MORE_THAN_BUILDQTY);
          const obj = {
            messageContet: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const dataObj = {
                woID: vm.addWorkorderModel.woID,
                confirmationType: CORE.woQtyApprovalConfirmationTypes.BuildQtyConfirmation,
                title: 'Build Quantity Deviation Approval',
                autoRemark: 'PO Qty: <b>' + vm.addWorkorderModel.poQty + '</b> <br/>\
                            Build Qty Old value: <b>0</b> <br/> \
                            Build Qty New value: <b>' + vm.addWorkorderModel.buildQty + '</b>'
              };

              vm.saveBtnDisableFlag = false;
              DialogFactory.dialogService(
                WORKORDER.WORKORDER_QTY_CONFIRMATION_APPROVAl_CONTROLLER,
                WORKORDER.WORKORDER_QTY_CONFIRMATION_APPROVAl_VIEW,
                ev,
                dataObj).then(() => {
                }, (taskConfirmationDetails) => {
                  if (taskConfirmationDetails) {
                    taskConfirmationInfo = taskConfirmationDetails;
                    SaveWorkorderInfo();
                  }
                  else {
                    return false;
                  }
                }, () => { });
            }
          }, () => {
            vm.saveBtnDisableFlag = false;
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          SaveWorkorderInfo();
        }
      } else {
        SaveWorkorderInfo();
      }
    };

    // on cancel dialog box
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.addWorkorderForm);
      if (isdirty) {
        const alertFormData = {
          form: vm.addWorkorderForm
        };
        BaseService.showWithoutSavingAlertForPopUp(alertFormData);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // check dirty form
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.setSumPoQty = () => {
      vm.addWorkorderModel.poQty = _.sumBy(vm.SOAssyListCustomerWise, (o) => o.poQty);
      vm.checkQty();
    };

    vm.checkBuildExcessQtyValidation = () => {
      if (vm.addWorkorderModel.buildQty) {
        if (vm.addWorkorderModel.poQty === 0 || vm.addWorkorderModel.poQty === null || vm.addWorkorderModel.poQty === undefined) {
          //vm.addWorkorderModel.excessQty = vm.excessQty = vm.addWorkorderModel.buildQty;
        } else {
          if (vm.addWorkorderModel.buildQty >= vm.addWorkorderModel.poQty) {
            if (vm.addWorkorderModel.buildQty !== parseInt(vm.addWorkorderModel.excessQty || 0) + parseInt(vm.addWorkorderModel.poQty)) {
              vm.excessQty = vm.addWorkorderModel.excessQty = parseInt(vm.addWorkorderModel.buildQty) - parseInt(vm.addWorkorderModel.poQty);
            }
          }
          else {
            vm.excessQty = vm.addWorkorderModel.excessQty = 0;
          }
        }
      } else {
        vm.addWorkorderModel.buildQty = parseInt(vm.addWorkorderModel.excessQty || 0) + parseInt(vm.addWorkorderModel.poQty);
      }
      vm.addWorkorderForm.excessQty.$setValidity('invalidexcessQty', true);
    };

    vm.checkQty = () => {
      const dataObj = _.find(vm.SOAssyListCustomerWise, (item) => item.saleorderDetID);
      if (dataObj) {
        if (vm.addWorkorderModel.buildQty && vm.addWorkorderModel.buildQty >= vm.addWorkorderModel.poQty) {
          const minQty = vm.addWorkorderModel.buildQty - vm.addWorkorderModel.poQty;
          const excessQty = vm.addWorkorderModel.excessQty || 0;
          if (excessQty !== minQty) {
            vm.addWorkorderModel.buildQty = parseInt(vm.addWorkorderModel.excessQty || 0) + parseInt(vm.addWorkorderModel.poQty);
            //vm.addWorkorderForm.excessQty.$setValidity("invalidexcessQty", false);
            //return;
          }
        } else {
          vm.addWorkorderModel.buildQty = parseInt(vm.addWorkorderModel.excessQty || 0) + parseInt(vm.addWorkorderModel.poQty);
        }
      }
      vm.addWorkorderForm.excessQty.$setValidity('invalidexcessQty', true);
    };

    // init autocomplete for assy wise workorder for termination
    const initAutoCompleteAssyWO = () => {
      vm.autoCompleteAssyWO = {
        columnName: 'woNumber',
        controllerName: null,
        viewTemplateURL: null,
        keyColumnName: 'woID',
        keyColumnId: null,
        inputName: 'Work Order#',
        placeholderName: CORE.LabelConstant.Workorder.WO,
        isRequired: true,
        isDisabled: false,
        isAddnew: false,
        callbackFn: getWorkOrderListByAssyID,
        onSelectCallbackFn: function (woItem) {
          if (!woItem) {
            vm.addWorkorderModel.fromWoId = null;
            vm.addWorkorderModel.customerID = null;
            vm.addWorkorderModel.partID = null;
            vm.addWorkorderModel.customerName = null;
            vm.addWorkorderModel.PIDCode = null;
            vm.addWorkorderModel.RoHSStatusID = null;
            vm.addWorkorderModel.description = null;
            vm.addWorkorderModel.nickName = null;
            vm.addWorkorderModel.partID = null;
            vm.addWorkorderModel.rohsIcon = null;
            vm.addWorkorderModel.mfgPN = null;
            resetTerminatWOOP();
            resetTerminatWO();
          }
          else {
            vm.selectedTerminatedWO = woItem;
            vm.addWorkorderModel.terminateWOID = woItem.woID;
            vm.addWorkorderModel.terminateWoNumber = woItem.woNumber;
            vm.addWorkorderModel.fromWoId = woItem.woID;
            vm.addWorkorderModel.customerID = woItem.customerID;
            vm.addWorkorderModel.partID = woItem.partID;
            vm.addWorkorderModel.customerName = woItem && woItem.customer ? woItem.customer.mfgCodeName : null;
            vm.addWorkorderModel.PIDCode = woItem && woItem.componentAssembly ? woItem.componentAssembly.PIDCode : null;
            vm.addWorkorderModel.RoHSStatusID = woItem.rohs.id;
            vm.addWorkorderModel.description = woItem && woItem.componentAssembly ? woItem.componentAssembly.mfgPNDescription : null;
            vm.addWorkorderModel.nickName = woItem && woItem.componentAssembly.nickName ? woItem.componentAssembly.nickName : null;
            vm.addWorkorderModel.partID = woItem.partID;
            if (!woItem.rohs.rohsIcon.toString().startsWith(vm.rohsImagePath)) {
              woItem.rohs.rohsIcon = vm.rohsImagePath + woItem.rohs.rohsIcon;
            }
            vm.addWorkorderModel.rohsIcon = woItem.rohs.rohsIcon;
            vm.addWorkorderModel.mfgPN = woItem.componentAssembly.mfgPN;
            // vm.addWorkorderModel.fromWoNumber = woItem.woNumber;
            getAllOperation();
          }
        }
      };
    };

    // get assy wise workorder for termination
    const getWorkOrderListByAssyID = () => {
      vm.woAssyList = [];
      const queryObj = {
        assyID: vm.addWorkorderModel.partID || 0
      };
      // let woStatusDetail = [];
      //_.each(vm.woStatusDetail, (objWostatus) => {
      //  if (objWostatus.Key == '1' || ) {
      //    woStatusDetail.push(objWostatus.Key);
      //  }
      //})
      queryObj.woSubStatus = [CORE.WOSTATUS.PUBLISHED, CORE.WOSTATUS.PUBLISHED_DRAFT];
      return WorkorderFactory.getWorkOrderListByAssyID().query(queryObj).$promise.then((response) => {
        if (response && response.data) {
          vm.woAssyList = response.data;
          initAutoCompleteAssyWO();
          if (vm.autoCompleteAssyWO && vm.woData && vm.woData.woID) {
            vm.autoCompleteAssyWO.keyColumnId = vm.woData.woID;
          }
          return vm.woAssyList;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    const initAutoCompleteWO = () => {
      vm.autoCompleteWO = {
        columnName: 'woNumber',
        controllerName: null,
        viewTemplateURL: null,
        keyColumnName: 'woID',
        keyColumnId: null,
        inputName: 'Work Order#',
        placeholderName: CORE.LabelConstant.Workorder.WO,
        isRequired: true,
        isDisabled: false,
        isAddnew: false,
        callbackFn: getWorkOrderListWithDetail,
        onSelectCallbackFn: function (selectedItem) {
          if (!selectedItem) {
            vm.selectedWO = null;
            vm.addWorkorderModel.refrenceWOID = null;
            vm.addWorkorderModel.refrenceWoNumber = null;
          }
          else {
            vm.selectedWO = selectedItem;
            vm.addWorkorderModel.refrenceWOID = selectedItem.woID;
            vm.addWorkorderModel.refrenceWoNumber = selectedItem.woNumber;
          }
        }
      };
    };

    const initAutoCompletePrevWO = () => {
      vm.autoCompletePrevWO = {
        columnName: 'woNumber',
        controllerName: null,
        viewTemplateURL: null,
        keyColumnName: 'woID',
        keyColumnId: vm.prevWoListForAssyCustomer && vm.prevWoListForAssyCustomer.length > 0 ? vm.prevWoListForAssyCustomer[0].woID : null,
        inputName: 'Work Order#',
        placeholderName: CORE.LabelConstant.Workorder.WO,
        isRequired: true,
        isDisabled: false,
        isAddnew: false,
        callbackFn: getAllPrevWoListForCustomerAssy,
        onSelectCallbackFn: function (selectedItem) {
          if (!selectedItem) {
            //vm.selectedWO = null;
            vm.addWorkorderModel.refrenceWOID = null;
            vm.addWorkorderModel.refrenceWoNumber = null;
          }
          else {
            //vm.selectedWO = selectedItem;
            vm.addWorkorderModel.refrenceWOID = selectedItem.woID;
            vm.addWorkorderModel.refrenceWoNumber = selectedItem.woNumber;
          }
        }
      };
    };

    const getWorkOrderListForCopyWO = (searchObj) => WorkorderFactory.getWorkOrderListWithDetail().query(searchObj).$promise.then((response) => {
      if (response && response.data) {
        if (vm.autoCompleteWOList && vm.addWorkorderModel.isFromSO === 'W' && vm.addWorkorderModel.fromWoId) {
          $scope.$broadcast(vm.autoCompleteWOList.inputName, response.data[0]);
        }
        return response.data;
      } else {
        return false;
      }
    }).catch((error) => { BaseService.getErrorLog(error); });

    const getWorkOrderListWithDetail = () => {
      vm.woList = [];
      return WorkorderFactory.getWorkOrderListWithDetail().query({}).$promise.then((response) => {
        if (response && response.data) {
          vm.woList = response.data;
          initAutoCompleteWO();
          return response.data;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };
    /* get all prev wo list for selected customer assembly */
    const getAllPrevWoListForCustomerAssy = () => {
      vm.prevWoListForAssyCustomer = [];
      if (vm.addWorkorderModel && vm.addWorkorderModel.customerID && vm.addWorkorderModel.partID) {
        return WorkorderFactory.getPrevWoListForCustomerAssy().save({
          customerID: vm.addWorkorderModel.customerID,
          partID: vm.addWorkorderModel.partID
        }).$promise.then((response) => {
          if (response && response.data) {
            vm.prevWoListForAssyCustomer = response.data;
            initAutoCompletePrevWO();
            return vm.prevWoListForAssyCustomer;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
    };


    /*
    * Author :  Vaibhav Shah
    * Purpose : Auto complete of master template data
    */
    const initAutoCompleteMasterTemplate = () => {
      vm.autoCompleteMasterTemplate = {
        columnName: 'masterTemplate',
        //controllerName: OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_CONTROLLER,
        //viewTemplateURL: OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Operation Management',
        placeholderName: 'Operation Management',
        isRequired: true,
        isAddnew: true,
        callbackFn: getMasterTemplates,
        isAddFromRoute: true,
        routeName: OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_STATE,
        addData: {
          routeParams: {
            id: null
          }
        },
        onSelectCallbackFn: function (selectedMasterTemplate) {
          if (selectedMasterTemplate) {
            vm.masterTemplate = selectedMasterTemplate;
            vm.addWorkorderModel.masterTemplateID = selectedMasterTemplate.id;
          }
          else {
            vm.masterTemplate = null;
            vm.addWorkorderModel.masterTemplateID = null;
          }
        }
      };
    };

    const getMasterTemplates = () => {
      vm.MasterTemplateList = [];
      return OperationFactory.getMasterTemplateListByTemplateStatus().save({
        masterTemplateStatus: CORE.DisplayStatus.Published.ID
      }).$promise.then((mastertemplate) => {
        vm.MasterTemplateList = mastertemplate.data;
        initAutoCompleteMasterTemplate();
        return vm.MasterTemplateList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const resetTerminatWOOP = () => {
      vm.selectedTerminatedWOOP = null;
      vm.WorkorderOperationList = [];
      vm.autoCompleteAssyWOOP = null;
      vm.addWorkorderModel.terminateWOOPID = null;
      getWorkOrderListByAssyID();
    };

    const resetTerminatWO = () => {
      vm.selectedTerminatedWO = null;
      vm.woAssyList = [];
      vm.autoCompleteAssyWO = null;
      getWorkOrderListByAssyID();
      vm.addWorkorderModel.terminateWOID = null;
      vm.addWorkorderModel.terminateWoNumber = null;
      resetTerminatWOOP();
    };

    const resetWO = () => {
      vm.selectedWO = null;
      vm.woList = [];
      vm.autoCompleteWO = null;
      vm.addWorkorderModel.refrenceWOID = null;
      vm.addWorkorderModel.refrenceWoNumber = null;
    };

    const resetMasterTemplate = () => {
      vm.masterTemplate = null;
      vm.MasterTemplateList = [];
      vm.autoCompleteMasterTemplate = null;
      vm.addWorkorderModel.masterTemplateID = null;
    };

    /* to reset prev wo auto complete selected details */
    const resetPrevWO = () => {
      vm.prevWoListForAssyCustomer = [];
      vm.autoCompletePrevWO = null;
      vm.addWorkorderModel.refrenceWOID = null;
      vm.addWorkorderModel.refrenceWoNumber = null;
    };

    vm.changeCopyFromTypeRightSection = () => {
      if (vm.addWorkorderModel.isCopyOPFromRightSection === 'W') {
        resetMasterTemplate();
        resetPrevWO();
        getWorkOrderListWithDetail();
      }
      else if (vm.addWorkorderModel.isCopyOPFromRightSection === 'M') {
        resetWO();
        resetPrevWO();
        getMasterTemplates();
      }
      else if (vm.addWorkorderModel.isCopyOPFromRightSection === 'PW') {
        resetWO();
        resetMasterTemplate();
        getAllPrevWoListForCustomerAssy();
      }
      else {
        resetWO();
        resetMasterTemplate();
        resetPrevWO();
      }
    };


    vm.changeCopyFromTypeLeftSection = () => {
      if (vm.addWorkorderModel.isCopyOPFromLeftSection === 'W') {
        resetMasterTemplate();
        resetPrevWO();
        getWorkOrderListWithDetail();
      }
      else if (vm.addWorkorderModel.isCopyOPFromLeftSection === 'M') {
        resetWO();
        resetPrevWO();
        getMasterTemplates();
      }
      else if (vm.addWorkorderModel.isCopyOPFromLeftSection === 'PW') {
        resetWO();
        resetMasterTemplate();
        getAllPrevWoListForCustomerAssy();
      }
      else {
        resetWO();
        resetMasterTemplate();
        resetPrevWO();
      }
    };

    vm.changeCopyFromType = () => {
      if (vm.addWorkorderModel.isCopyOPFrom === 'W') {
        resetMasterTemplate();
        resetPrevWO();
        getWorkOrderListWithDetail();
      }
      else if (vm.addWorkorderModel.isCopyOPFrom === 'M') {
        resetWO();
        resetPrevWO();
        getMasterTemplates();
      }
      else if (vm.addWorkorderModel.isCopyOPFrom === 'PW') {
        resetWO();
        resetMasterTemplate();
        getAllPrevWoListForCustomerAssy();
      }
      else {
        resetWO();
        resetMasterTemplate();
        resetPrevWO();
      }
    };

    //go to assy list
    vm.goToAssemblyList = () => BaseService.goToPartList();

    //go to assy list
    vm.gotoOperationManagementList = () => {
      BaseService.openInNew(OPERATION.OPERATION_MASTER_TEMPLATE_STATE);
      return false;
    };

    //redirect to customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };

    //redirect to sales order master
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    //redirect to work order operation list
    vm.goToOperationList = () => {
      BaseService.goToOperationList(vm.addWorkorderModel.terminateWOID);
      return false;
    };

    //redirect to assembly details
    vm.goToAssemblyDetails = (dataObj) => {
      if (dataObj) {
          BaseService.goToComponentDetailTab(null, dataObj.partID);
        return false;
      }
    };
    //redirect to salesorder details
    vm.goToManageSalesOrder = (dataObj) => {
      if (dataObj) {
        BaseService.goToManageSalesOrder(dataObj.refSalesOrderID);
        return false;
      }
    };
    //go to manage customer
    vm.goToManageCustomer = () => {
      BaseService.goToCustomer(vm.addWorkorderModel.customerID);
    };

    // init autocomplete for assy wise workorder for termination
    const initAutoCompleteWOOperation = () => {
      vm.autoCompleteAssyWOOP = {
        columnName: 'opName',
        keyColumnName: 'woOPID',
        keyColumnId: null,
        inputName: 'WorkorderOperation',
        placeholderName: 'Work Order Operation',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllOperation,
        onSelectCallbackFn: function (opItem) {
          if (!opItem) {
            vm.selectedTerminatedWOOP = null;
            vm.inspectionProcess = false;
            vm.isParallelOperation = false;
            vm.addWorkorderModel.terminateWOOPID = null;
          }
          else {
            vm.selectedTerminatedWOOP = opItem;

            // code for inspection process
            vm.inspectionProcess = false;
            vm.inspectionProcess = (opItem.operationType.gencCategoryName === GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName);

            // code for parallel operation process
            vm.isParallelOperation = false;
            // start - check for parallel operation for work order
            const woClusterList = opItem.workorderOperationCluster;
            if (woClusterList && woClusterList.length) {
              const isParellelOperation = woClusterList[0].clusterWorkorder.isParellelOperation;
              if (isParellelOperation) {
                vm.isParallelOperation = true;
              }
            }
            // end - check for parallel operation for work order
            vm.addWorkorderModel.terminateWOOPID = opItem.woOPID;
          }
        }
      };
    };

    const getAllOperation = () => {
      vm.WorkorderOperationList = [];
      return WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: vm.addWorkorderModel.terminateWOID }).$promise.then((operationlist) => {
        if (operationlist && operationlist.data) {
          operationlist.data = _.sortBy(operationlist.data, 'opNumber');
          _.each(operationlist.data, (item) => {
            item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
            vm.WorkorderOperationList.push(item);
          });
          initAutoCompleteWOOperation();
        }
        return vm.WorkorderOperationList;
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.ViewAssemblyStockStatus = () => {
      const dataObj = vm.addWorkorderModel;
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        dataObj).then(() => {
        }, () => {
        });
    };

    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // bind sub assembly details
    vm.bindAssembly = (salesItem) => {
      const oldSalesItem = _.filter(vm.SOAssyList, (item) => item.id === salesItem.saleorderDetID);
      salesItem.autoCompleteSOAssy.keyColumnId = null;
      salesItem.filteredSOList = _.filter(vm.SOAssyList, (item) => item.AssyType === salesItem.assyType);
      _.each(oldSalesItem, (oldItem) => {
        if (oldItem && oldItem.assyType !== salesItem.assyType) {
          _.remove(vm.SOAssyListCustomerWise, (item) => item.saleorderDetID === salesItem.saleorderDetID);
        }
      });
      if (vm.SOAssyListCustomerWise.length === 0) {
        addEmptysalesOrder(false);
      }
    };

    ///* for wo number validation */
    //vm.checkValidWO = () => {
    //  if (vm.addWorkorderModel.woNumber) {
    //    const newWONumber = vm.addWorkorderModel.woNumber.split('-');
    //    if (woNumberPrefix && woNumberPrefix !== newWONumber[0] && vm.addWorkorderModel.isRepeat) {
    //      const messageContent = vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_WO_SERIES ? vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_WO_SERIES.message : null;
    //      vm.invalidWOSeries = stringFormat(messageContent, woNumberPrefix);
    //      vm.addWorkorderForm.woNumber.$setValidity('invalidWO', false);
    //    } else {
    //      vm.addWorkorderForm.woNumber.$setValidity('invalidWO', true);
    //    }
    //  }
    //};

    // open work order number build history pop up
    vm.viewWONumberBuildHistory = (event) => {
      const data = {
        partID: vm.addWorkorderModel.partID || null,
        assyNickName: vm.addWorkorderModel.nickName || null
      };
      DialogFactory.dialogService(
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER,
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW,
        event,
        data).then(() => { // Success Section
        }, () => { // Cancel Section
        }, (err) => BaseService.getErrorLog(err));
    };

    //on load submit form
    angular.element(() =>
      //check load
      BaseService.currentPagePopupForm.push(vm.addWorkorderForm)
    );
  }
})();

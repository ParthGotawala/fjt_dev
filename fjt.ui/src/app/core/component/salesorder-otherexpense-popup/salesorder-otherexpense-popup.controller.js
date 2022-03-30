(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SalesOrderOtherExpensePopupController', SalesOrderOtherExpensePopupController);

  /** @ngInject */
  function SalesOrderOtherExpensePopupController($mdDialog, $q, CORE, $timeout,
    data, BaseService, DialogFactory, SalesOrderFactory, USER, ComponentFactory, TRANSACTION) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.custPOLineNumber = data.custPOLineNumber = data.custPOLineNumber || data.custPOLineID;
    vm.copySalesDetail = Object.assign(data); // angular.copy(data);
    vm.salesDetail = Object.assign(data); // angular.copy(data);
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.isdirty = false;
    vm.pageName = vm.salesDetail.isfromPO ? 'purchase order' : vm.salesDetail.isFromCustInv ? 'customer invoice' : 'sales order';
    vm.copySalesDetailOther = {};
    //vm.CORE = CORE;
    vm.salesFilterDet = vm.salesDetail.salesFilterDet ? _.clone(vm.salesDetail.salesFilterDet) : [];
    vm.salesOtherFilterDet = vm.salesDetail.salesOtherFilterDet ? [...vm.salesDetail.salesOtherFilterDet] : [];
    vm.sourceData = vm.salesDetail.sourceData ? _.clone(vm.salesDetail.sourceData) : [];
    vm.gridConfig = CORE.gridConfig;
    vm.OtherPartFrequency = _.clone(CORE.OtherPartFrequency);
    vm.FrequencyTypeList = _.clone(CORE.FREQUENCY_TYPE);
    vm.emptySearch = TRANSACTION.TRANSACTION_EMPTYSTATE.SALESORDER_OTHER_EXP;
    vm.cancel = () => {
      let checkDirty = false;
      if (vm.autoFrequency.keyColumnId || vm.autoFrequencyType.keyColumnId || vm.autocompleteOtherCharges.keyColumnId || vm.salesDetailOther.qty || vm.salesDetailOther.price) {
        checkDirty = true;
      }
      if (checkDirty) {
        const data = {
          form: vm.OtherChargesForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        if (!vm.salesDetail.isFromCustInv) {
          BaseService.currentPagePopupForm.pop();
          BaseService.currentPageFlagForm = [];
          const objlist = {
            isDirty: vm.isdirty,
            otherDetails: vm.otherDetails
          };
          $mdDialog.cancel(objlist);
        } else {
          $mdDialog.cancel();
        }
      }
    };
    vm.saveDtl = () => {
      let checkDirty = false;
      if (vm.salesDetail.isFromCustInv) {
        if (vm.autoFrequency.keyColumnId || vm.autoFrequencyType.keyColumnId || vm.autocompleteOtherCharges.keyColumnId || vm.salesDetailOther.qty || vm.salesDetailOther.price) {
          checkDirty = true;
        }
        if (checkDirty) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.DATA_ENTERED_NOT_ADDED);
          messageContent.message = stringFormat(messageContent.message, 'Other Charges');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              BaseService.currentPagePopupForm.pop();
              BaseService.currentPageFlagForm = [];
              const objlist = {
                isDirty: vm.isdirty,
                otherDetails: vm.otherDetails
              };
              $mdDialog.cancel(objlist);
            }
          }, () => {
            setFocus('addBtn');            // return;
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          BaseService.currentPagePopupForm.pop();
          BaseService.currentPageFlagForm = [];
          const objlist = {
            isDirty: vm.isdirty,
            otherDetails: vm.otherDetails
          };
          $mdDialog.cancel(objlist);
        }
      } else {
        $mdDialog.cancel();
      }
    };
    vm.salesDetailOther = { custPOLineNumber: angular.copy(vm.copySalesDetail.custPOLineNumber), lineID: angular.copy(vm.copySalesDetail.lineID) };
    vm.selectedItems = [];
    vm.otherDetails = [];
    const otherDet = () => {
      if (vm.salesDetail && vm.salesDetail.SalesOtherDetail) {
        vm.otherDetails = angular.copy(vm.salesDetail.SalesOtherDetail) || [];
        _.each(vm.salesOtherFilterDet, (item) => {
          const objOtherChrg = {
            frequency: item.frequency,
            frequencyType: item.frequencyType,
            id: item.id,
            lineComment: item.remark,
            lineInternalComment: item.internalComment,
            partID: item.partID,
            price: parseFloat(item.price),
            qty: item.qty,
            refReleaseLineID: item.refSOReleaseLineID,
            refSalesOrderDetID: item.refSODetID,
            isSoLevelOtherCharges: true,
            lineID: item.lineID,
            custPOLineNumber: item.custPOLineNumber,
            partDescription: item.partDescription
          };
          vm.otherDetails.push(objOtherChrg);
        });
      }
    };
    otherDet();
    vm.query = {
      order: '',
      search: '',
      limit: CORE.isPagination,
      page: 1,
      isPagination: CORE.isPagination
    };
    const bindGridDetail = () => {
      _.each(vm.otherDetails, (otherDet) => {
        const otherPart = _.find(vm.OtherPartTypeComponents, (otherPartDet) => otherPartDet.id === otherDet.partID);
        if (otherPart) {
          otherDet.rohsName = otherPart.rohsName;
          otherDet.rohsIcon = otherPart.rohsIcon;
          otherDet.pidcode = otherPart.pidcode;
          otherDet.mfgPN = otherPart.mfgPN;
          otherDet.extPrice = (otherDet.qty * otherDet.price).toFixed(2);
          otherDet.custPOLineNumber = otherDet.custPOLineNumber || vm.salesDetail.custPOLineNumber;
          otherDet.lineID = otherDet.lineID || vm.salesDetail.lineID;
        }
        if (otherDet.frequency) {
          const frequencyObj = _.find(vm.OtherPartFrequency, (frequency) => frequency.id === otherDet.frequency);
          if (frequencyObj) {
            otherDet.frequencyName = frequencyObj.name;
          }
        }
        if (otherDet.frequencyType) {
          const frequencyObj = _.find(vm.FrequencyTypeList, (frequency) => frequency.id === otherDet.frequencyType);
          if (frequencyObj) {
            otherDet.frequencyTypeName = frequencyObj.type;
          }
        }
        if (otherDet.refReleaseLineID) {
          const releaseLineDet = _.find(vm.assyReleaseLineList, (release) => release.shippingID === otherDet.refReleaseLineID);
          if (releaseLineDet) {
            vm.salesDetailOther.releaseLineDet = releaseLineDet.releaseLineQty;
          }
        }
      });
    };
    /* delete salesorder other charges detail*/
    vm.deleteOtherRecord = (salesorderOtherCharge) => {
      if (salesorderOtherCharge) {
        if (salesorderOtherCharge.id && salesorderOtherCharge.isSoLevelOtherCharges) {
          cellEditable(salesorderOtherCharge).then((cellresponse) => {
            if (cellresponse) {
              if ((vm.salesDetStatus && (vm.salesDetStatus.vQtyRelease || vm.salesDetStatus.vQtyWprkorder)) || (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty)) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_REMOVE_VALIDATION);
                messageContent.message = stringFormat(messageContent.message, salesorderOtherCharge.pidcode, salesorderOtherCharge.lineID);
                const model = {
                  multiple: true,
                  messageContent: messageContent
                };
                return DialogFactory.messageAlertDialog(model).then(() => {
                }).catch(() => BaseService.getErrorLog(error));
              }
              else {
                deleteConfirmation(salesorderOtherCharge);
              }
            }
          });
        }
        else {
          deleteConfirmation(salesorderOtherCharge);
        }
      }
      else {
        //show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Other Charges')
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    // delele confirmation message
    const deleteConfirmation = (salesorderOtherCharge) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Other Charges', 1);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const objIndex = vm.otherDetails.indexOf(salesorderOtherCharge);
          vm.otherDetails.splice(objIndex, 1);
          vm.isdirty = true;
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const cellEditable = (row) => {
      if (row.id) {
        return SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ id: (row.id), releaseLineID: null }).$promise.then((salesDet) => {
          if (salesDet && salesDet.data) {
            vm.salesDetStatus = _.head(salesDet.data.soReleaseStatus);
            vm.salesShippedStatus = salesDet.data.soShipStatus.length > 0 ? _.head(salesDet.data.soShipStatus) : null;
            if (vm.salesDetStatus.vQtyRelease || vm.salesDetStatus.vQtyWprkorder) {
              vm.salesDetDisable = true;
            } else { vm.salesDetDisable = false; }
            if (vm.salesShippedStatus && vm.salesShippedStatus.shippedqty >= row.qty) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_ASSYID_SHIP_VALIDATION);
              messageContent.message = stringFormat(messageContent.message, (row.pidcode), vm.salesShippedStatus.packingSlipNumber || '');
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
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.salesDetail.partID);
    };
    bindHeaderData();
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.salesDetail.isfromPO ? vm.LabelConstant.MFG.PID : vm.LabelConstant.SalesOrder.AssyIDPID,
        value: vm.salesDetail.PIDCode,
        displayOrder: 5,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartMaster,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.salesDetail.isfromPO ? stringFormat('{0}{1}', vm.rohsImagePath, vm.salesDetail.rohsIcon) : vm.salesDetail.rohsIcon,
          imgDetail: vm.salesDetail.rohsText
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.salesDetail.mfgPN
      },
        {
          label: vm.salesDetail.isfromPO ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.SalesOrder.AssyNumberMFGPN,
          value: vm.salesDetail.mfgPN,
          displayOrder: 5,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartMaster,
          isCopy: true,
          isAssy: true,
          imgParms: {
            imgPath: vm.salesDetail.isfromPO ? stringFormat('{0}{1}', vm.rohsImagePath, vm.salesDetail.rohsIcon) : vm.salesDetail.rohsIcon,
            imgDetail: vm.salesDetail.rohsText
          }
        },
        {
          label: vm.salesDetail.isfromPO ? 'Internal Ref#' : vm.salesDetail.isFromCustInv ? vm.LabelConstant.CustomerPackingInvoice.InvoiceRef : vm.LabelConstant.SalesOrder.LineID,
          value: vm.salesDetail.isfromPO ? vm.salesDetail.internalRef : vm.salesDetail.lineID,
          displayOrder: 4
        }, {
        label: 'PO Line#',
        value: data.custPOLineNumber,
        displayOrder: 4
      });
    }
    if (vm.salesDetail.soNumber) {
      const soNumber = {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.salesDetail.soNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 2
      };
      vm.headerdata.push(soNumber);
    };
    if (vm.salesDetail.version) {
      const version = {
        label: vm.LabelConstant.SalesOrder.Revision,
        value: vm.salesDetail.version,
        displayOrder: 3
      };
      vm.headerdata.push(version);
    };
    if (vm.salesDetail.poNumber) {
      const poNumber = {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.salesDetail.poNumber,
        isCopy: true,
        labelLinkFn: vm.goTosalesOrderList,
        valueLinkFn: vm.goToSalesOrderMaster,
        displayOrder: 1
      };
      vm.headerdata.push(poNumber);
    };
    if (vm.salesDetail.blanketPOOption) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.BlanketPO,
        value: 'Yes',
        displayOrder: 6
      });
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.BlanketPOOption,
        value: vm.BlanketPODetails.USEBLANKETPO === vm.salesDetail.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[0].value : vm.BlanketPODetails.LINKBLANKETPO === vm.salesDetail.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[1].value : TRANSACTION.BLANKETPOOPTION[2].value,
        displayOrder: 6
      });
    }
    if (vm.salesDetail.isLegacyPO) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.LegacyPo,
        value: 'Yes',
        displayOrder: 6
      });
    }
    if (vm.salesDetail.isRmaPO) {
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.RMAPo,
        value: 'Yes',
        displayOrder: 6
      });
    }
    // go to sales order list page
    vm.goTosalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };
    // go to sales order master
    vm.goToSalesOrderMaster = () => {
      BaseService.goToManageSalesOrder(vm.salesDetail.soID);
    };
    //other part type component
    const getotherTypecomponent = () => SalesOrderFactory.getOtherPartTypeComponentDetails().query().$promise.then((charges) => {
      if (charges && charges.data) {
        vm.OtherPartTypeComponents = angular.copy(charges.data);
        vm.autofocus = true;
        bindGridDetail();
        return $q.resolve(vm.OtherPartTypeComponents);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    getotherTypecomponent();
    //on select of other charges
    const getSelectedOtherCharge = (item) => {
      if (item) {
        if (item.partStatus === CORE.PartStatusList.InActiveInternal && !(vm.recordUpdate || vm.recordView)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, item.PIDCode);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              selectOtherChargesAfterConfirmation(item);
            }
          }, () => {
            vm.updateOther = false;
            vm.salesDetailOther = { custPOLineNumber: vm.salesDetailOther.custPOLineNumber };
            vm.autoFrequency.keyColumnId = null;
            vm.autoFrequencyType.keyColumnId = null;
            vm.PartPriceBreakDetailsData = [];
            if (vm.autocompleteOtherCharges) {
              vm.autocompleteOtherCharges.keyColumnId = null;
            }
            setFocusByName(vm.autocompleteOtherCharges.inputName);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          selectOtherChargesAfterConfirmation(item);
        }
        // setFocus('otherprice');
      }
      else {
        vm.updateOther = false;
        vm.salesDetailOther = { custPOLineNumber: vm.salesDetailOther.custPOLineNumber };
        vm.autoFrequency.keyColumnId = null;
        vm.autoFrequencyType.keyColumnId = null;
        vm.PartPriceBreakDetailsData = [];
      }
    };
    // get selected other charge after confirming for inactive part status
    const selectOtherChargesAfterConfirmation = (item) => {
      let objLineItem;
      if (vm.salesDetailOther.custPOLineNumber === vm.copySalesDetail.custPOLineNumber) {
        if (vm.salesDetailOther.id) {
          objLineItem = _.find(vm.otherDetails, (line) => line.id === vm.salesDetailOther.id);
        } else {
          objLineItem = _.find(vm.otherDetails, (line) => line.partID === item.id && !line.isSoLevelOtherCharges);
        }
      } else {
        objLineItem = _.find(vm.otherDetails, (line) => line.custPOLineNumber === vm.salesDetailOther.custPOLineNumber);
      }
      if (objLineItem) {
        vm.salesDetailOther = angular.copy(objLineItem);
        vm.updateOther = true;
        vm.autoFrequency.keyColumnId = vm.salesDetailOther.frequency;
        vm.autoFrequencyType.keyColumnId = vm.salesDetailOther.frequencyType;
      }
      else {
        vm.updateOther = false;
        vm.salesDetailOther.qty = 1;
        vm.salesDetailOther.rohsName = item.rohsName;
        vm.salesDetailOther.rohsIcon = item.rohsIcon;
        vm.salesDetailOther.pidcode = item.pidcode;
        vm.salesDetailOther.frequency = !vm.salesDetail.isFromCustInv ? item.frequency : null;
        vm.salesDetailOther.partID = item.id;
        vm.salesDetailOther.mfgPN = item.mfgPN;
        vm.salesDetailOther.frequencyType = !vm.salesDetail.isFromCustInv ? item.frequencyType : null;
        vm.salesDetailOther.refSalesOrderID = vm.salesDetail.refSalesOrderID;
        if (!vm.updateOther) {
          vm.autoFrequency.keyColumnId = vm.salesDetailOther.frequency;
          vm.autoFrequencyType.keyColumnId = vm.salesDetailOther.frequencyType;
        }
        vm.salesDetailOther.partDescription = item.mfgPNDescription;
        if (vm.salesDetailOther.frequency) {
          const frequencyObj = _.find(vm.OtherPartFrequency, (frequency) => frequency.id === vm.salesDetailOther.frequency);
          if (frequencyObj) {
            vm.salesDetailOther.frequencyName = frequencyObj.name;
          }
        }
        if (vm.salesDetailOther.frequencyType) {
          const frequencyObj = _.find(vm.FrequencyTypeList, (frequency) => frequency.id === vm.salesDetailOther.frequencyType);
          if (frequencyObj) {
            vm.salesDetailOther.frequencyTypeName = frequencyObj.type;
          }
        }
        if (vm.salesDetailOther.refReleaseLineID) {
          const releaseLineDet = _.find(vm.assyReleaseLineList, (release) => release.shippingID === vm.salesDetailOther.refReleaseLineID);
          if (releaseLineDet) {
            vm.salesDetailOther.releaseLineDet = releaseLineDet.releaseLineQty;
          }
        }
        vm.getPartPriceBreakDetails(item.id).then(() => {
          vm.changeOtherPartQty();
        });
      }
      setFocus('otherprice');
    };

    const initAutocomplete = () => {
      vm.autocompleteOtherCharges = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'OtherCharge',
        placeholderName: 'Other Charge',
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
            if (item.id && item.id === 2 && !vm.salesDetail.refSOReleaseLineID && !vm.salesDetail.isFromCustInv && vm.assyReleaseLineList && vm.assyReleaseLineList.length > 0) {
              vm.autoCompleteReleaseLine.keyColumnId = vm.assyReleaseLineList[0].shippingID;
            }
            if (vm.salesDetailOther.refReleaseLineID && item.id === 2 && !vm.salesDetail.isFromCustInv) {
              vm.autoCompleteReleaseLine.keyColumnId = vm.salesDetailOther.refReleaseLineID;
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
      vm.autocompleteSelectAssyID = {
        columnName: 'assyIDPID',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'PO Line#/Assy ID/PID',
        placeholderName: 'PO Line#/Assy ID/PID',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.assyReleaseLineList = _.clone(_.filter(item.SalesDetail, (sDetail) => !sDetail.isTBD));
            _.each(vm.assyReleaseLineList, (assyLine) => {
              assyLine.releaseLineQty = stringFormat('{0} | {1} | {2}', assyLine.releaseNumber, assyLine.qty, assyLine.requestedDockDate || assyLine.shippingDate);
            });
            if (!vm.autoCompleteReleaseLine) {
              autoCompleteReleaseLine();
            }
            if (!vm.salesDetailOther.refReleaseLineID && vm.autoFrequency.keyColumnId === 2) {
              vm.autoCompleteReleaseLine.keyColumnId = vm.assyReleaseLineList[0].shippingID;
            };
            if (vm.salesDetailOther.refReleaseLineID) {
              vm.autoCompleteReleaseLine.keyColumnId = vm.salesDetailOther.refReleaseLineID;
            }
          }
          else {
            if (vm.autoCompleteReleaseLine) {
              vm.autoCompleteReleaseLine.keyColumnId = null;
            }
            vm.assyReleaseLineList = [];
          }
        }
      };
    };
    initAutocomplete();
    //change qty for other charges
    vm.changeOtherPartQty = () => {
      // auto select price from part master
      if (vm.salesDetailOther.qty && vm.PartPriceBreakDetailsData && !vm.updateOther) {
        const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.salesDetailOther.qty);
        if (priceBreak) {
          vm.salesDetailOther.price = priceBreak.unitPrice;
        } else {
          const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.salesDetailOther.qty), (o) => o.priceBreak);
          if (priceList.length > 0) {
            vm.salesDetailOther.price = priceList[priceList.length - 1].unitPrice;
          }
        }
      }
      vm.changePrice();
    };
    //save other part details
    vm.saveOtherPart = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.OtherChargesForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      vm.salesDetailOther.frequency = vm.autoFrequency.keyColumnId;
      vm.salesDetailOther.frequencyType = vm.autoFrequencyType ? vm.autoFrequencyType.keyColumnId : null;
      vm.salesDetailOther.refReleaseLineID = vm.autoCompleteReleaseLine ? vm.autoCompleteReleaseLine.keyColumnId : null;
      vm.salesDetailOther.refSalesOrderID = vm.salesDetail.refSalesOrderID;
      if (vm.salesDetailOther.frequency) {
        const frequencyObj = _.find(vm.OtherPartFrequency, (frequency) => frequency.id === vm.salesDetailOther.frequency);
        if (frequencyObj) {
          vm.salesDetailOther.frequencyName = frequencyObj.name;
        }
      }
      if (vm.salesDetailOther.frequencyType) {
        const frequencyObj = _.find(vm.FrequencyTypeList, (frequency) => frequency.id === vm.salesDetailOther.frequencyType);
        if (frequencyObj) {
          vm.salesDetailOther.frequencyTypeName = frequencyObj.type;
        }
      }
      if (vm.salesDetailOther.refReleaseLineID) {
        const releaseLineDet = _.find(vm.assyReleaseLineList, (release) => release.shippingID === vm.salesDetailOther.refReleaseLineID);
        if (releaseLineDet) {
          vm.salesDetailOther.releaseLineDet = releaseLineDet.releaseLineQty;
        }
      }
      let objOther;
      if (vm.salesDetailOther.custPOLineNumber === vm.copySalesDetail.custPOLineNumber) {
        vm.salesDetailOther.isSoLevelOtherCharges = false;
        if (vm.salesDetailOther.id) {
          objOther = _.find(vm.otherDetails, (line) => line.id === vm.salesDetailOther.id);
        } else {
          objOther = _.find(vm.otherDetails, (line) => line.partID === vm.salesDetailOther.partID && !line.isSoLevelOtherCharges);
        }
      } else {
        vm.salesDetailOther.isSoLevelOtherCharges = true;
        objOther = _.find(vm.otherDetails, (line) => line.custPOLineNumber === vm.copySalesDetailOther.custPOLineNumber);
      }
      if (objOther) {
        const objPartDetail = _.find(vm.OtherPartTypeComponents, (partDet) => partDet.id === vm.autocompleteOtherCharges.keyColumnId);
        if (objPartDetail) {
          vm.salesDetailOther.rohsName = objPartDetail.rohsName;
          vm.salesDetailOther.rohsIcon = objPartDetail.rohsIcon;
          vm.salesDetailOther.pidcode = objPartDetail.pidcode;
          vm.salesDetailOther.partID = objPartDetail.id;
          vm.salesDetailOther.mfgPN = objPartDetail.mfgPN;
        }
        vm.salesDetailOther.id = objOther.id;
        const objSource = _.find(vm.sourceData, (sData) => sData.custPOLineNumber === vm.copySalesDetailOther.custPOLineNumber);
        if (objSource) {
          objSource.custPOLineNumber = vm.salesDetailOther.custPOLineNumber;
        }
        const index = _.indexOf(vm.otherDetails, objOther);
        vm.otherDetails.splice(index, 1);
        vm.otherDetails.splice(index, 0, vm.salesDetailOther);
      } else {
        vm.otherDetails.push(vm.salesDetailOther);
      }
      vm.isdirty = true;
      resetForm();
    };
    //get part price break details
    vm.getPartPriceBreakDetails = (id) => ComponentFactory.getPartPriceBreakDetails().query({ id: id }).$promise.then((res) => {
      if (res && res.data) {
        vm.PartPriceBreakDetailsData = res.data;
      }
      return res;
    }).catch((error) => BaseService.getErrorLog(error));
    //change price details
    vm.changePrice = () => {
      if (vm.salesDetailOther && (vm.salesDetailOther.qty || vm.salesDetailOther.qty === 0) && (vm.salesDetailOther.price || vm.salesDetailOther.price === 0)) {
        vm.salesDetailOther.extPrice = multipleUnitValue(vm.salesDetailOther.qty, vm.salesDetailOther.price);
      } else if (vm.salesDetailOther) {
        vm.salesDetailOther.extPrice = null;
      }
    };
    const resetForm = () => {
      vm.salesDetailOther = { custPOLineNumber: angular.copy(vm.copySalesDetail.custPOLineNumber), lineID: angular.copy(vm.copySalesDetail.lineID) };
      vm.autoFrequency.keyColumnId = null;
      vm.autoFrequencyType.keyColumnId = null;
      vm.autocompleteOtherCharges.keyColumnId = null;
      vm.saveBtnDisableFlag = false;
      vm.updateOther = false;
      vm.copySalesDetailOther = {};
      if (vm.OtherChargesForm) {
        $timeout(() => {
          vm.OtherChargesForm.$setPristine();
          vm.OtherChargesForm.$setUntouched();
        });
      }
      setFocusByName('OtherCharge');
    };
    //check form dirty or not
    vm.checkFormDirty = () => {
      let checkDirty = false;
      if ((vm.autoFrequency && vm.autoFrequency.keyColumnId) || (vm.autoFrequencyType && vm.autoFrequencyType.keyColumnId) || (vm.autocompleteOtherCharges && vm.autocompleteOtherCharges.keyColumnId) || vm.salesDetailOther.qty || vm.salesDetailOther.price) {
        checkDirty = true;
      }
      return checkDirty;
    };
    //edit other charges
    vm.editOtherCharges = (item) => {
      if (item.id && item.isSoLevelOtherCharges) {
        cellEditable(item).then((response) => {
          if (response) {
            commonOtherCharges(item);
          }
        });
      } else {
        commonOtherCharges(item);
      }
    };
    // common other charges edit option
    const commonOtherCharges = (item) => {
      vm.salesDetailOther = angular.copy(item);
      vm.copySalesDetailOther = angular.copy(item);
      if (vm.autoCompleteReleaseLine) {
        vm.autoCompleteReleaseLine.keyColumnId = null;
      }
      vm.autoFrequency.keyColumnId = vm.salesDetailOther.frequency;
      vm.autoFrequencyType.keyColumnId = vm.salesDetailOther.frequencyType;
      vm.autocompleteOtherCharges.keyColumnId = vm.salesDetailOther.partID;
      vm.updateOther = true;
    };
    //reset other charges detail
    vm.resetCharges = () => {
      vm.isdirty = false;
      vm.otherDetails = angular.copy(vm.salesDetail.SalesOtherDetail);
      otherDet();
      bindGridDetail();
    };
    vm.otherChargesSum = () => (_.sumBy(vm.otherDetails, (o) => parseFloat(o.extPrice))).toFixed(2);

    //clear header line
    vm.clearHeaderLine = () => {
      vm.autocompleteOtherCharges.keyColumnId = null;
      vm.autoFrequency.keyColumnId = null;
      vm.autoFrequencyType.keyColumnId = null;
      vm.copySalesDetailOther = {};
      vm.salesDetailOther = {};
      if (vm.OtherChargesForm) {
        $timeout(() => {
          vm.OtherChargesForm.$setPristine();
          vm.OtherChargesForm.$setUntouched();
        });
      }
      setFocusByName('OtherCharge');
      vm.updateOther = false;
      vm.saveBtnDisableFlag = false;
    };
    //show part description
    vm.showPartDescriptionPopUp = (object, ev) => {
      const description = object && object.lineInternalComment ? angular.copy(object.lineInternalComment).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.PURCHASE_ORDER.OtherCharge,
          value: object.pidcode,
          displayOrder: 1,
          valueLinkFn: () => {
            BaseService.goToComponentDetailTab(null, object.partID);
          }
        }];
      const obj = {
        title: vm.LabelConstant.PURCHASE_ORDER.ShippingComment,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    //show part description
    vm.showCommentsPopUp = (object, ev) => {
      const description = object && object.lineComment ? angular.copy(object.lineComment).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.PURCHASE_ORDER.OtherCharge,
          value: object.pidcode,
          displayOrder: 1,
          valueLinkFn: () => {
            BaseService.goToComponentDetailTab(null, object.partID);
          }
        }];
      const obj = {
        title: vm.LabelConstant.PURCHASE_ORDER.Comments,
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
    //get max length validations
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.setOnOtherCharges = (ev) => {
      // in case of tab jump to  shipping qty in case of shift tab jump to  custom po line
      if (!ev.shiftKey) {
        $timeout(() => {
          vm.autofocus = true;
        });
      }
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

    //check unique customer po line
    vm.checkCustomerPOLine = () => {
      if (vm.copySalesDetail.custPOLineNumber === vm.salesDetailOther.custPOLineNumber || (vm.copySalesDetailOther && vm.salesDetailOther.custPOLineNumber === vm.copySalesDetailOther.custPOLineNumber)) {
        return false;
      }
      vm.iscustPO = false;
      const checkUnique = _.find(vm.sourceData, (item) => item.custPOLineNumber === vm.salesDetailOther.custPOLineNumber);
      const checkUniq = _.find(vm.otherDetails, (item) => item.custPOLineNumber === vm.salesDetailOther.custPOLineNumber && item.id !== vm.salesDetailOther.id);
      if ((checkUnique && checkUnique.custPOLineNumber !== vm.copySalesDetail.custPOLineNumber) || checkUniq) {
        vm.iscustPO = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
        messageContent.message = stringFormat(messageContent.message, 'PO Line#');
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.salesDetailOther.custPOLineNumber = null;
            setFocus('custPOLineNumberOtherCharges');
          }
        }).catch(() => BaseService.getErrorLog(error));
      }
      //else {  As per discuss on 06-12-2021 with VS && DP need to allow edit poNumber
      //  vm.autoFrequency.keyColumnId = null;
      //  vm.autoFrequencyType.keyColumnId = null;
      //  vm.autocompleteOtherCharges.keyColumnId = null;
      //}
    };
    //on load submit form
    angular.element(() => {
      BaseService.currentPageFlagForm = [vm.isdirty];
      // set default assy id
      vm.autocompleteSelectAssyID.keyColumnId = vm.salesDetail.id;
    });
  }
})();

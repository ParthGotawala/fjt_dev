(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('TerminateOperationPopupController', TerminateOperationPopupController);

  /** @ngInject */
  function TerminateOperationPopupController($q, $mdDialog, $filter, USER, CORE, WORKORDER, TRAVELER, DialogFactory, BaseService, data, TerminateOperationPopupFactory, $state, $timeout) {
    const vm = this;

    var woOPID = data.woOPID;
    var woID = data.woID;
    var autoCompleteFromOperationDefault = {
      columnName: 'opName',
      keyColumnName: 'opID',
      keyColumnId: 'opID',
      inputName: 'Operation',
      placeholderName: 'Operation'
    };

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.TERMINATE_WORKORDER;
    vm.taToolbar = CORE.Toolbar;
    vm.LabelConstant = CORE.LabelConstant;

    vm.woOPDetail = {};
    vm.allWorkorderOperationList = [];
    vm.fromWorkorderOperationList = [];
    vm.selectedToWorkorder = {};
    vm.toOperationList = [];
    vm.transferOperationQtyList = [];
    vm.isTransferQty = null;
    vm.fromWOOPID = null;
    vm.comment = null;
    vm.rohsImagePath = stringFormat('{0}{1}', CORE.WEB_URL, USER.ROHS_BASE_PATH);
    vm.headerdata = [];
    // AutoComplete for Work Order list
    vm.autoCompleteToWorkOrder = {
      columnName: 'woNumber',
      keyColumnName: 'woID',
      keyColumnId: null,
      inputName: 'To Work Order',
      placeholderName: 'To Work Order',
      isRequired: true,
      isAddnew: false,
      isDisabled: false,
      onSelectCallbackFn: function (selectedItem) {

        vm.selectedToWorkorder = selectedItem;
        if (vm.selectedToWorkorder && vm.isOperationTrackBySerialNo && !vm.selectedToWorkorder.isOperationTrackBySerialNo) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: TRAVELER.SERIAL_WORKORDER,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          vm.iswoSerialNo = true;
          return;
        }
        else {
          vm.iswoSerialNo = false;
        }

        if (selectedItem) {
          vm.toOperationList = selectedItem.operation;
          // added by vaibhav shah for resolve console error of undefined
          if (vm.transferOperationQtyList[0]) {
            vm.transferOperationQtyList[0].autoCompleteToOperation.keyColumnId = vm.toOperationList[0].opID;
          }
        }
        else {
          vm.toOperationList = [];
          vm.transferOperationQtyList.forEach((x) => {
            x.autoCompleteToOperation.keyColumnId = null;
          });
        }
      }
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.woOPDetail.workorder.partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    var promises = [getWorkorderQtyDetail(), getWorkorderOperationDetail(), getWorkorderTransferDetail()];

    vm.cgBusyLoading = $q.all(promises).then((responses) => {
      var getWorkorderQtyDetailResp = responses[0];
      var getWorkorderOperationDetailResp = responses[1];
      var getWorkorderTransferDetailResp = responses[2];
      vm.autoCompleteToWorkOrder.isDisabled = false;

      vm.allWorkorderOperationList = [];
      vm.transferOperationQtyList = [];
      //redirect to work order list
      vm.goToWorkorderList = () => {
        BaseService.goToWorkorderList();
        return false;
      };
      //redirect to work order details
      vm.goToWorkorderDetailsByWOID = () => {
        BaseService.goToWorkorderDetails(woID);
        return false;
      };

      // to redirect at work order operation list page
      vm.goToWorkorderOperations = () => {
        BaseService.goToWorkorderOperations(woID);
        return false;
      };

      if (getWorkorderQtyDetailResp && getWorkorderOperationDetailResp) {
        // from workorder detail
        vm.woOPDetail = getWorkorderQtyDetailResp.workorder;
        vm.headerdata.push({
          label: CORE.LabelConstant.Workorder.WO, value: vm.woOPDetail.workorder.woNumber, displayOrder: 1, labelLinkFn: vm.goToWorkorderList,
          valueLinkFn: vm.goToWorkorderDetailsByWOID
        },
          { label: CORE.LabelConstant.Workorder.Version, value: vm.woOPDetail.workorder.woVersion, displayOrder: 2 },
          {
            label: CORE.LabelConstant.Assembly.ID,
            value: vm.woOPDetail.workorder.PIDCode,
            labelLinkFn: vm.goToAssyList,
            valueLinkFn: vm.goToAssyMaster,
            isCopy: true,
            isCopyAheadLabel: false,
            isAssy: true,
            imgParms: {
              imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.woOPDetail.workorder.rohs.rohsIcon),
              imgDetail: vm.woOPDetail.workorder.name
            },
            //copyParams: {
            //  ismfgPN: true,
            //  labelMfgPN: CORE.LabelConstant.MFG.MFGPN,
            //  valueMfgPN: vm.woOPDetail.workorder.mfgPN
            //},
            displayOrder: 3
          },
          { label: CORE.LabelConstant.Assembly.NickName, value: vm.woOPDetail.workorder.NickName, displayOrder: 4 },
          {
            label: CORE.LabelConstant.Operation.OP, value: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.woOPDetail.opName, vm.woOPDetail.opNumber), displayOrder: 5,
            labelLinkFn: vm.goToWorkorderOperations, labelLinkFnParams: woID,
            valueLinkFn: vm.goToWorkorderOperationDetails, valueLinkFnParams: woOPID
          });

        // from workorder detail with all operation prod quantity
        var woQtyDetail = $filter('orderBy')(getWorkorderQtyDetailResp.workorderQty, 'opNumber');
        // group all work orders by woID to get work order wise operations
        var woList = _.groupBy(getWorkorderOperationDetailResp, 'woID');

        for (let item in woList) {
          // get all operations under work order
          var woOPList = _.orderBy(woList[item], (x) => x.opNumber);
          // if current breaked work order
          if (woID == item) {
            // bind list of all current breaked operation
            vm.fromWorkorderOperationList = woOPList.map((op) => {
              return {
                opID: op.opID,
                woOPID: op.woOPID,
                opNumber: op.opNumber,
                opName: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber),
                qtyControl: op.qtyControl
              };
            });
          }
          else {
            // list to display to workorder list with operations
            vm.allWorkorderOperationList.push({
              woID: parseInt(item),
              woNumber: woOPList[0].workorder.woNumber,
              isOperationTrackBySerialNo: woOPList[0].workorder.isOperationTrackBySerialNo,
              // only take first operation which is inspection
              operation: [$filter('filter')(woOPList, { qtyControl: true }, true).map((op) => {
                return {
                  woID: op.woID,
                  opID: op.opID,
                  woOPID: op.woOPID,
                  opName: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, op.opName, op.opNumber)
                };
              })[0]]
            });
          }
        }

        // get current terminated operation index
        var termintedOPIndex = _.findIndex(woQtyDetail, (x) => x.woOPID == woOPID);

        // get current breaked and all operation which are after this operation and readyStock is more than 0
        for (let i = termintedOPIndex; i < woQtyDetail.length; i++) {
          var data = woQtyDetail[i];
          vm.autoCompleteToWorkOrder.keyColumnId = data.revisedWOID;
          let msg = WORKORDER.PUBLISHED_WORKORDER_WILL_APPEAR_HERE;
          if (data.revisedWONumber) {
            msg = stringFormat(msg, 'To transfer quantity publish WO# ' + data.revisedWONumber);
          } else {
            msg = stringFormat(msg, '');
          }
          vm.PUBLISHED_WORKORDER_WILL_APPEAR_HERE = msg;
          vm.autoCompleteToWorkOrder.isDisabled = data.revisedWOID ? true : false;
          if (data.readyStock > 0) {
            // if already quantity transfer then disable operation autocomplete
            var fromWOOPObj = _.find(vm.fromWorkorderOperationList, (x) => { return x.qtyControl == true && x.woOPID == data.woOPID; });
            if (fromWOOPObj) {
              var transferDet = _.find(getWorkorderTransferDetailResp, (x) => x.fromWOOPID == data.woOPID);

              let obj = {
                isDisabled: transferDet != null,
                fromOPID: data.opID,
                fromWOOPID: data.woOPID,
                readyStock: data.readyStock,
                fromWOOPName: fromWOOPObj.opName,
                autoCompleteToOperation: angular.copy(autoCompleteFromOperationDefault),
                transferQty: data.readyStock,
                comment: null
              };

              if (transferDet) {
                obj.autoCompleteToOperation.keyColumnId = transferDet.toOPID;
              }

              vm.transferOperationQtyList.push(obj);
            }
          }
        }
        // manually set form dirty
        if (vm.transferOperationQtyList && vm.transferOperationQtyList.length > 0 && vm.frmTerminateOperation
          && vm.frmTerminateOperation.$$controls && vm.frmTerminateOperation.$$controls.length > 0) {
          vm.frmTerminateOperation.$$controls[0].$dirty = true;
          vm.frmTerminateOperation.$setDirty();
          $timeout(() => {
            vm.frmTerminateOperation['transferQty' + 0].$dirty = true;
          }, 0);
        }
      }

      // if quantity already transferred then disable to workorder autocomplete
      if (getWorkorderTransferDetailResp && getWorkorderTransferDetailResp.length) {
        vm.autoCompleteToWorkOrder.keyColumnId = getWorkorderTransferDetailResp[0].toWOID;
        vm.fromWOOPID = getWorkorderTransferDetailResp[0].fromWOOPID;
        vm.comment = getWorkorderTransferDetailResp[0].comment;
        vm.autoCompleteToWorkOrder.isDisabled = true;
      }
      vm.isTransferQty = vm.transferOperationQtyList.length > 0;

    });
    //get selected operation detail from list
    vm.getOpName = (id) => {
      var objOP = _.find(vm.toOperationList, (item) => { return item.opID == id });
      var opName = '';
      if (objOP) {
        opName = objOP.opName;
      }
      return opName;
    };

    //get selected toWOOPID from list
    vm.getWOOPIDFromSelectedOP = (id) => {
      const objOP = _.find(vm.toOperationList, (item) => { return item.opID == id });
      return objOP ? objOP.woOPID : null;
    };



    function getWorkorderQtyDetail() {
      return TerminateOperationPopupFactory.getWorkorderQtyDetail().query({ woID: woID, woOPID: woOPID }).$promise.then((response) => {
        if (response && response.data) {
          vm.isOperationTrackBySerialNo = response.data.workorder.workorder.isOperationTrackBySerialNo;

          // update child table data to workorder obj
          if (response.data.workorder.workorder.componentAssembly) {
            response.data.workorder.workorder.PIDCode = response.data.workorder.workorder.componentAssembly.PIDCode;
            response.data.workorder.workorder.mfgPN = response.data.workorder.workorder.componentAssembly.mfgPN;
            response.data.workorder.workorder.nickName = response.data.workorder.workorder.componentAssembly.nickName;
          }
          return response.data;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    function getWorkorderOperationDetail() {
      return TerminateOperationPopupFactory.getWorkorderOperationDetail().query({ woID: woID }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    function getWorkorderTransferDetail() {
      return TerminateOperationPopupFactory.getWorkorderTransferDetail().query({ woID: woID }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    vm.getWorkorderTransferHistory = function ($event, fromWOOPID) {

      var model = {
        fromWOOPID: fromWOOPID
      };

      DialogFactory.dialogService(
        TRAVELER.TERMINATE_OPERATION_HISTORY_MODAL_CONTROLLER,
        TRAVELER.TERMINATE_OPERATION_HISTORY_MODAL_VIEW,
        $event,
        model).then(() => {
        }, (error) => BaseService.getErrorLog(error));
    };

    // transfer qty to revised work order
    vm.save = () => {
      var obj = [];
      if (BaseService.focusRequiredField(vm.frmTerminateOperation)) {
        return;
      }
      if (vm.frmTerminateOperation.$invalid || vm.iswoSerialNo || vm.isTransferQty == false) {
        return;
      }
      if (vm.transferOperationQtyList == 0) {
        const model = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.SELECT_ONE, 'operation'),
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      vm.transferOperationQtyList.forEach((x) => {
        obj.push({
          fromWOID: woID,
          fromOPID: x.fromOPID,
          fromWOOPID: x.fromWOOPID,
          toWOID: vm.selectedToWorkorder.woID,
          toOPID: x.autoCompleteToOperation.keyColumnId,
          toWOOPID: _.find(vm.toOperationList, (y) => { return y.opID == x.autoCompleteToOperation.keyColumnId; }).woOPID,
          transferQty: x.transferQty,
          description: vm.comment
        });
      });

      const data = {
        terminateWOID: woID,
        terminateWOOPID: woOPID,
        terminateOPNumber: _.find(vm.fromWorkorderOperationList, (x) => { return x.woOPID == woOPID; }).opNumber,
        toWOID: vm.selectedToWorkorder.woID,
        transferOperationList: obj,
        travelerPageRoute: angular.copy(TRAVELER.TRAVELER_MANAGE_STATE)
      };

      TerminateOperationPopupFactory.saveTransferWorkorderDetail().save(data).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
          switch (response.data.status) {
            case 'operation': {
              let str = '<ul class="padding-left-20">';
              response.data.data.forEach((x) => {
                str += stringFormat('<li><b>({1}) {0}</b> by <b>{2}</b></li>', x.opName, convertToThreeDecimal(x.opNumber), x.employee);
              });
              str += '</ul>';

              const model = {
                title: response.data.data.length > 1 ? CORE.MESSAGE_CONSTANT.OPERATION_CHECK_IN_MULTI : CORE.MESSAGE_CONSTANT.OPERATION_CHECK_IN,
                textContent: str,
                multiple: true
              };
              DialogFactory.alertDialog(model);
              break;
            }
            case 'serialcount': {
              const model = {
                title: CORE.MESSAGE_CONSTANT.OPERATION_SERIAL_COUNT_MISMATCH,
                textContent: stringFormat('Transferred <b>{0}</b> quantity but assigned <b>{1}</b> serials.', response.data.data.transferCount, response.data.data.serialCount),
                multiple: true
              };
              DialogFactory.alertDialog(model);
              break;
            }
            case 'transferExists': {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_ALREADY_TRANSFERED);
              messageContent.message = stringFormat(messageContent.message, response.data.data.oldWoId);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              break;
            }
            case 'success': {
              vm.frmTerminateOperation.$setPristine();
              BaseService.currentPagePopupForm.pop();
              $mdDialog.cancel();
              //if (response.data.isFromWOAutoTerminated) {
              //  // when all qty transfered and fromWO set to 'terminated' from 'under termination'
              //  // move to revised work order details page as not allowed to move on traveler with 'terminated'
              //  $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: parseInt(vm.selectedToWorkorder.woID) });
              //}
              break;
            }
            case undefined: {
              break;
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*dismiss popup*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.frmTerminateOperation);
      if (isdirty) {
        const data = {
          form: vm.frmTerminateOperation
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel(null);
        BaseService.currentPagePopupForm.pop();
      }
    };

    /*add form on load*/
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.frmTerminateOperation);
    });

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    vm.goToWorkorderOperationDetails = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
      return false;
    };

  }
})();

(function () {
  'use strict';

  angular.module('app.traveler.travelers').directive('serialNumberSelection', serialNumberSelection);
  /** @ngInject */
  function serialNumberSelection($filter, $q, $timeout, $window, DialogFactory, CORE, TRAVELER, WorkorderSerialMstFactory, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woid: '=',
        woopid: '=?',
        checkInOperation: '=',
        callbackFn: '=',
        onSelectCallbackFn: '=?',
        viewTransactionData: '=?',
        isDisplayTransactionButton: '='
      },
      templateUrl: 'app/main/traveler/travelers/serial-number/serial-number-selection.html',
      controller: serialnumberselectioncrtl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function serialnumberselectioncrtl($scope, $element, $attrs, $timeout) {
      var vm = this;

      vm.woID = $scope.woid;
      vm.IsCheckInOperation = $scope.checkInOperation;
      vm.isDisplayTransactionButton = $scope.isDisplayTransactionButton;
      vm.woopid = $scope.woopid;
      vm.WOSerialNoFilterType = CORE.WorkorderSerialNumberFilterType;
      vm.WorkorderSerialNumberSelectionType = CORE.WorkorderSerialNumberSelectionType;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.statusText = CORE.statusTextValue;
      vm.SerialTypeLabel = CORE.SerialTypeLabel;
      vm.selectedValue = vm.WOSerialNoFilterType.SerialNumber;
      vm.LabelConstant = CORE.LabelConstant;

      vm.changeselectedSerialFilterValue = () => {
        vm.ToSerialNumber = null;
        vm.serialNumber = null;
        vm.Qty = null;
        vm.fromSerialNoDetail = null;
        vm.inValidToSerialNo = false;
        vm.inValidFormSerialNo = false;
        vm.toSerialNoDetail = null;
        if (vm.selectedValue == vm.WOSerialNoFilterType.Range) {
          vm.selectedRangeValue = vm.WorkorderSerialNumberSelectionType.RangeType.Range;
        }
      }
      vm.changeselectedRangeSerialFilterValue = () => {
        vm.ToSerialNumber = null;
        vm.serialNumberQty = null;
        vm.serialNumber = null;
        vm.Qty = null;
        vm.fromSerialNoDetail = null;
        vm.toSerialNoDetail = null;
        vm.inValidToSerialNo = false;
        vm.inValidFormSerialNo = false;
        vm.isRequiredSerialQtyFilter = (vm.selectedValue == vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) ? true : false;
      }


      vm.scanSerialNumberDetail = (SerialNo, field, e) => {
        if (SerialNo) {
          $timeout(function () {
            scanSerialNumber(SerialNo, field, e)
          }, true);
          /** Prevent enter key submit event */
          preventInputEnterKeyEvent(e);
        }
      }

      let scanSerialNumber = (SerialNo, field, e) => {
        let messageContent;
        if ((e.keyCode == 13)) {
          if (field === 'scanToSerialNumber') {
            vm.inValidToSerialNo = false;
          } else {
            vm.inValidFormSerialNo = false;
          }
          vm.cgBusyLoading = WorkorderSerialMstFactory.getValidateSerialNumberDetails().query({ woID: vm.woID, serialNo: SerialNo }).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
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

              if (vm.selectedValue == vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
                if (field === 'scanSerialNumber') {
                  vm.fromSerialNoDetail = response.data;
                  $("input[name~='scanToSerialNumber']").focus();
                } else {
                  vm.toSerialNoDetail = response.data;
                  $("input[name~='scanToSerialNumber']").blur();
                  $("#clearButton").focus();
                }
              } else if (vm.selectedValue == vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
                if (field === 'scanSerialNumberforQty') {
                  vm.fromSerialNoDetail = response.data;
                  $("input[name~='Qty']").focus();
                }
              } else if (vm.selectedValue == vm.WOSerialNoFilterType.SerialNumber) {
                vm.fromSerialNoDetail = response.data;
                $("input[name~='scanSerialNumber']").blur();
                $("#clearButton").focus();
              }
            } else {
              if (vm.selectedValue == vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
                if (field === 'scanSerialNumber') {
                  vm.fromSerialNoDetail = null;
                  vm.inValidFormSerialNo = true;
                  $("input[name~='scanSerialNumber']").focus();
                } else {
                  vm.toSerialNoDetail = null;
                  vm.inValidToSerialNo = true;
                  $("input[name~='scanToSerialNumber']").focus();
                }
              } else if (vm.selectedValue == vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
                if (field === 'scanSerialNumberforQty') {
                  vm.fromSerialNoDetail = null;
                  vm.inValidFormSerialNo = true;
                  $("input[name~='scanSerialNumberQty']").focus();
                }
              } else if (vm.selectedValue == vm.WOSerialNoFilterType.SerialNumber) {
                vm.fromSerialNoDetail = null;
                vm.inValidFormSerialNo = true;
                $("input[name~='scanSerialNumber']").focus();
              }
              if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    if (field === 'scanSerialNumber') {
                      vm.serialNumber = null;
                      setFocus('scanSerialNumber');
                      $("input[name~='scanSerialNumber']").focus();
                    } else if (field === 'scanToSerialNumber') {
                      vm.ToSerialNumber = null;
                      setFocus('scanToSerialNumber');
                      $("input[name~='scanToSerialNumber']").focus();
                    }
                  }
                }).catch((error) => {
                  return BaseService.getErrorLog(error);
                });
              }
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
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

      let getSelectedSerialNumber = $scope.$on('getSelectedSerialNumberList', getSelectedSerialNumberList);
      let emptySerialNoSelection = $scope.$on('emptySerialSelection', emptySerialSelection);
      function emptySerialSelection() {
        vm.ToSerialNumber = null;
        vm.serialNumber = null;
        vm.serialNumberQty = null;
        vm.Qty = null;
        vm.fromSerialNoDetail = null;
        vm.toSerialNoDetail = null;
        $("input[name~='scanSerialNumber']").focus();
      }
      let clearSection = $scope.$on('clearSeaction', clearSelection);

      function clearSelection() {
        vm.ToSerialNumber = null;
        vm.serialNumber = null;
        vm.serialNumberQty = null;
        vm.Qty = null;
        vm.fromSerialNoDetail = null;
        vm.toSerialNoDetail = null;
        $("input[name~='scanSerialNumber']").focus();
        vm.serialNumberSelectionForm.$setPristine();
        vm.serialNumberSelectionForm.$setUntouched();
      }

      function getSelectedSerialNumberList() {
        if (vm.selectedValue != vm.WOSerialNoFilterType.SerialNumber) {
          if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
            if (vm.fromSerialNoDetail && vm.toSerialNoDetail) {
              let startFromNum = vm.fromSerialNoDetail.serialIntVal;
              let endToNum = vm.toSerialNoDetail.serialIntVal;

              if (parseInt(startFromNum) > parseInt(endToNum)) {
                //show validation message no data selected
                var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_VALID_SERIAL_NUMBER);
                var model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return;
              } else {
                sendCallback();
              }
            } else {
              enterProperDetailToFilter();
            }
          } else if (vm.selectedValue === vm.WOSerialNoFilterType.Range && vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
            if (!vm.fromSerialNoDetail || !vm.Qty) {
              enterProperDetailToFilter();
            } else {
              sendCallback();
            }
          }
        } else {
          if (!vm.fromSerialNoDetail) {
            enterProperDetailToFilter();
          } else {
            let woserialNumberList = [vm.fromSerialNoDetail];
            if ($scope.onSelectCallbackFn) {
              $scope.onSelectCallbackFn(vm.selectedValue, woserialNumberList);
            }
          }
        }
      }
      function sendCallback() {
        let QueryObj = {
          woID: vm.woID,
          fromSerialNo: vm.fromSerialNoDetail.SerialNo,
          toSerialNo: vm.toSerialNoDetail ? vm.toSerialNoDetail.SerialNo : null,
          Qty: vm.Qty,
          selectionType: vm.selectedRangeValue
        }
        vm.cgBusyLoading = WorkorderSerialMstFactory.getValidateSerialNumberDetailsList().query(QueryObj).$promise.then((response) => {
          if (response && response.data) {
            let woSerialNoList = response.data.woSerialNoList;

            //if selected value is range

            if (woSerialNoList.length > 0) {
              if (vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.Range) {
                if ($scope.onSelectCallbackFn) {
                  $scope.onSelectCallbackFn(vm.selectedRangeValue, woSerialNoList);
                }
              }
              //if selected value is serial# with Qty
              else if (vm.selectedRangeValue == vm.WorkorderSerialNumberSelectionType.RangeType.QtyRange) {
                if ($scope.onSelectCallbackFn) {
                  $scope.onSelectCallbackFn(vm.selectedRangeValue, woSerialNoList);
                }
              }
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // View Transaction serial#
      vm.viewSerialTransactionHistory = (ev) => {
        let dataObj = $scope.viewTransactionData

        DialogFactory.dialogService(
          TRAVELER.SERIAL_NUMBER_MODEL_CONTROLLER,
          TRAVELER.SERIAL_NUMBER_MODAL_VIEW,
          ev,
          dataObj).then((result) => {
          }
            , (insertedData) => {
            }, (error) => {
              return BaseService.getErrorLog(error);
            });
      }

      /**Used to validate max size*/
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      };
      // destory on event on controller destroy
      $scope.$on('$destroy', getSelectedSerialNumber);
      $scope.$on('$destroy', emptySerialNoSelection);
      $scope.$on('$destroy', clearSection);
    }
  }
})();

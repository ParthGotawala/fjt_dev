(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderOperationRefDesignator', workorderOperationRefDesignator);

  /** @ngInject */
  function workorderOperationRefDesignator() {
    var directive = {
      restrict: 'E',
      scope: {
        woId: '=',
        woOpId: '=',
        opId: '='
      },
      templateUrl: 'app/directives/custom/workorder-operation-ref-designator/workorder-operation-ref-designator.html',
      controller: workorderOperationRefDesignatorCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function workorderOperationRefDesignatorCtrl($scope, BaseService, WorkorderOperationFactory, CORE, DialogFactory, $q, ComponentFactory, TRANSACTION) {
      // var vm = this;
      // Don't Remove this code
      // Don't add any code before this
      $scope.vm = $scope.$parent.$parent.vm;
      const vm = $scope.vm;
      vm.woID = $scope.woId;
      vm.opID = $scope.opId;
      vm.woOPID = $scope.woOpId ? $scope.woOpId : null;
      vm.LabelConstant = CORE.LabelConstant;
      vm.InvalidRefDesMessage = stringFormat(CORE.MESSAGE_CONSTANT.INVALID_DYNAMIC, vm.LabelConstant.BOM.REF_DES);
      vm.checkCopyStatus = () => { vm.copystatus = false; };
      vm.copyRefDesig = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };
      //vm.operation = $scope.$parent.vm.operation;
      vm.operation.refDesigList = [];
      vm.isDisableRefDesigChip = ((!vm.operation.addRefDesig) || vm.isWorkorderOperationPublished || vm.isWOUnderTermination || vm.isWoInSpecificStatusNotAllowedToChange);



      // create check box group
      vm.checkboxButtonGroupRefDesig = {
        addRefDesig: {
          checkDisable: () => (vm.isWorkorderOperationPublished
            || vm.isWOUnderTermination
            || vm.IsProductionComplete || vm.isWoInSpecificStatusNotAllowedToChange),
          onChange: () => {
            const oldValue = (!vm.operation.addRefDesig);
            vm.isDisableRefDesigChip = (!vm.operation.addRefDesig);
            if (!vm.operation.addRefDesig && _.filter(vm.operation.refDesigList, (det) => det.isDeleted === 0 || (!det.isDeleted)).length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.DELETE_ALL_REF_DESG_WO_OPERATION);
              const model = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then((yes) => {
                if (yes) {
                  vm.resetRefDesignatorModel();
                  // vm.frmOperationRefDesig.$setDirty(true);
                  vm.frmOperationDetails.$setDirty(true);// set parent form dirty
                  vm.frmOperationDetails.$$controls[0].$setDirty(true);
                  if (!vm.operation.addRefDesig) {
                    vm.operation.isRequireRefDesWithUMID = false;
                    vm.operation.isStrictlyLimitRefDes = false;
                  }
                  _.each(vm.operation.refDesigList, (det) => {
                    if (det.Id > 0) {
                      det.isDeleted = 1;
                    }
                  });
                }
              }, () => {
                vm.operation.addRefDesig = oldValue;
                vm.isDisableRefDesigChip = (!oldValue);
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (!vm.operation.addRefDesig) {
              vm.operation.isRequireRefDesWithUMID = false;
              vm.operation.isStrictlyLimitRefDes = false;
            }
          }
        },
        isRequireRefDesWithUMID: {
          checkDisable: () => (vm.isWorkorderOperationPublished
            || vm.isWOUnderTermination
            || vm.IsProductionComplete || vm.isWoInSpecificStatusNotAllowedToChange || (!vm.operation.addRefDesig)),
          onChange: () => {
            // const oldValue = (!vm.operation.isRequireRefDesWithUMID);
            // if req refDestwithUMID is set true then bydefault isRequireRefDesWithUMID
            // vm.operation.isPlacementTracking = vm.operation.isRequireRefDesWithUMID ? true : vm.operation.isPlacementTracking;
            if (!vm.operation.isRequireRefDesWithUMID) {
              vm.operation.isPlacementTracking = vm.operationMain.isPlacementTracking;
            } else {
              vm.operation.isPlacementTracking = true;
            }
          }
        },
        isStrictlyLimitRefDes: {
          checkDisable: () => (vm.isWorkorderOperationPublished
            || vm.isWOUnderTermination
            || vm.IsProductionComplete || vm.isWoInSpecificStatusNotAllowedToChange || (!vm.operation.addRefDesig)),
          onChange: () => {
            // const oldValue = (!vm.operation.isStrictlyLimitRefDes);
            // if isStrictlyLimitRefDes is set true then bydefault isRequireRefDesWithUMID
            // vm.operation.isPlacementTracking = vm.operation.isStrictlyLimitRefDes ? true : vm.operation.isPlacementTracking;
            if (!vm.operation.isStrictlyLimitRefDes) {
              vm.operation.isPlacementTracking = vm.operationMain.isPlacementTracking;
            } else {
              vm.operation.isPlacementTracking = true;
            }
          }
        }
      };

      // get list if ref designator
      vm.getAllRefDesignatorByWoID = () => {
        if (vm.woID) {
          return WorkorderOperationFactory.retriveWorkOrderOperaionRefDesigList().query({ woID: vm.woID, woOPID: vm.woOPID }).$promise.then((response) => {
            if (response && response.data) {
              vm.operation.refDesigList = [];
              _.each(response.data, (det, index) => {
                if (det.isDeleted) {
                  det.isDeleted = 1;
                } else {
                  det.isDeleted = 0;
                }
                if (det.opID === vm.opID) {
                  det.tempID = (index + 1);
                  vm.operation.refDesigList.push(det);
                }
              });
              vm.woRefDesigList = response.data;
              //vm.operation.refDesigList = _.filter(response.data, (det) => det.opID === vm.opID);
            }
            return true;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.getAllRefDesignatorByWoID();

      // Get BOM LineItems by Assembly Id
      const getRFQLineItemsByID = () => {
        vm.bomRefDesList = [];
        vm.itemPerBOMLineList = [];
        return WorkorderOperationFactory.getRFQLineItemsByIDWithSubAssembly().query({ id: vm.operation.workorder.partID }).$promise.then((response) => {
          if (response && response.data && response.data.length) {
            _.each(response.data, (item) => {
              vm.bomRefDesList.push(item.refDesig);
            });
            // vm.itemPerBOMLineList = response.data;
            return vm.bomRefDesList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      getRFQLineItemsByID();

      // Get Oddly ref Des list
      const getOddelyRefDesList = () => {
        if (vm.operation.workorder.partID) {
          return ComponentFactory.getOddelyRefDesList().query({ id: vm.operation.workorder.partID }).$promise.then((resOddRefDes) => {
            if (resOddRefDes && resOddRefDes.data) {
              vm.oddelyRefDesList = resOddRefDes.data;
              vm.DisplayOddelyRefDes = _.map(vm.oddelyRefDesList, 'refDes');
              return vm.oddelyRefDesList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      getOddelyRefDesList();

      /** Validate Ref. Desg */
      vm.validateRefDesg = (enteredRefDesig) => {
        if (vm.bomRefDesList && enteredRefDesig.refDesig) {
          const newOpListObj = (vm.operation.refDesigList ? _.filter(vm.operation.refDesigList, (item) => (item.isDeleted === 0) && (enteredRefDesig && enteredRefDesig.Id !== item.Id)) : {});
          const bomList = getDesignatorFromLineItem(vm.bomRefDesList ? vm.bomRefDesList.join(',') : [], vm.DisplayOddelyRefDes);
          const entered_list = getDesignatorFromLineItem(enteredRefDesig.refDesig, vm.DisplayOddelyRefDes);
          // get all ref.designator list already except one being update also  not include deleted ones
          vm.woRefDesigList = _.filter(vm.woRefDesigList, (item) => item.isDeleted === 0);
          const woList = getDesignatorFromLineItem(vm.woRefDesigList ? _.map(vm.woRefDesigList, (item) => (enteredRefDesig && enteredRefDesig.Id !== item.Id && item.isDeleted === 0 ? item.refDesig : null)).join(',') : [], vm.DisplayOddelyRefDes);
          const newOpList = getDesignatorFromLineItem(newOpListObj ? _.map(newOpListObj, (item) => item.refDesig).join(',') : [], vm.DisplayOddelyRefDes); // for newly added and removed list
          const inBOMList = _.intersection(entered_list, bomList);
          const inWOList = _.intersection(entered_list, woList);
          const inNewOpList = _.intersection(entered_list, newOpList);
          const inOddlyRefDes = _.intersection(entered_list, vm.DisplayOddelyRefDes);
          if (inBOMList.length === 0 || inBOMList.length < entered_list.length) { // OR case : bomList: U1,U2  enteredList: U1,U2,U3
            // If not in BOM  then  check against oddly ref des
            if (inOddlyRefDes && inOddlyRefDes.length === 0) {
              $scope.$applyAsync(() => {
                vm.frmOperationRefDesig.refDesigValue.$setValidity('invalidRefDesig', false);
                vm.frmOperationRefDesig.$$controls[0].$setDirty(true);
                vm.isInvalid = true;
              });
              return $q.resolve(false);
            } else {
              vm.frmOperationRefDesig.refDesigValue.$setValidity('invalidRefDesig', true);
              vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
              vm.isInvalid = false;
              vm.isDuplicate = false;
            }
          }
          if (inWOList.length > 0 || inNewOpList.length > 0) {
            $scope.$applyAsync(() => {
              vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', false);
              vm.frmOperationRefDesig.$$controls[0].$setDirty(true);
              vm.isInvalid = false;
              vm.isDuplicate = true;
            });
            return $q.resolve(false);
          } else {
            vm.frmOperationRefDesig.refDesigValue.$setValidity('invalidRefDesig', true);
            vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
            vm.isInvalid = false;
            vm.isDuplicate = false;
            return $q.resolve(true);
          }
        } else {
          vm.frmOperationRefDesig.refDesigValue.$setValidity('invalidRefDesig', true);
          vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
          vm.isInvalid = false;
          vm.isDuplicate = false;
          return $q.resolve(true);
        }
      };

      /** Set/Remove duplicate validation  */
      vm.checkUniqueRefDesig = () => {
        if (vm.operation.refDesigList && vm.operation.refDesigList.length > 0) {
          const checkDuplicate = _.find(vm.operation.refDesigList, (obj) => obj.tempID !== vm.refDesigModel.tempID && obj.refDesig === vm.refDesigModel.refDesig && obj.isDeleted === 0);
          if (checkDuplicate) {
            vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', false);
            vm.isDuplicate = true;
            return $q.resolve(false);
          }
          else {
            vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
            vm.isDuplicate = false;
            return $q.resolve(true);
          }
        } else {
          vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
          vm.isDuplicate = false;
          return $q.resolve(true);
        }
        //$q.all([vm.validateRefDesg(vm.refDesigModel.refDesig)]).then((respValidate) => {
        //  if (checkDuplicate && (!respValidate)) { return $q.resolve(false); }
        //  else {
        //    vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
        //    return $q.resolve(true);
        //  }
        //});
      };

      // add ref designator
      vm.addRefDesigToList = (event) => {
        if (event.keyCode === 13) {
          vm.isDisableRefDesig = true;
          if (!vm.refDesigModel.refDesig || !vm.refDesigModel.refDesig.trim()) {
            vm.isDisableRefDesig = false;
            setFocus('refDesigValue');
            return;
          } else if (vm.refDesigModel.refDesig && vm.refDesigModel.refDesig.indexOf('-') > 0 && (!vm.refDesigModel.Id)
            && (getDesignatorFromLineItem(vm.refDesigModel.refDesig, vm.DisplayOddelyRefDes).length !== vm.refDesigModel.refDesig.split(',').length)) {
            vm.isInvalid = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_OP_REFDES_RANGE_NOT_ALLOWED);
            messageContent.message = stringFormat(messageContent.message, vm.refDesigModel.refDesig);

            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              vm.isDisableRefDesig = false;
              vm.isDuplicate = false;
              vm.isInvalid = false;
              vm.resetRefDesignatorModel();
              setFocus('refDesigValue');
            });
          } else {
            $q.all([vm.checkUniqueRefDesig(), vm.validateRefDesg(vm.refDesigModel)]).then((resData) => {
              if (resData && resData.length > 0 && resData[0] && resData[1]) {
                vm.isDisableRefDesig = false;
                vm.updateRefDes = false;
                const updateRefDesig = _.find(vm.operation.refDesigList, (obj) => (vm.refDesigModel.tempID && obj.tempID === vm.refDesigModel.tempID));
                if (updateRefDesig) {
                  updateRefDesig.refDesig = vm.refDesigModel.refDesig;
                } else {
                  vm.operation.refDesigList.push({
                    refDesig: vm.refDesigModel.refDesig,
                    tempID: (vm.operation.refDesigList.length + 1),
                    Id: null,
                    isDeleted: 0
                  });
                }
                vm.resetRefDesignatorModel();
                setFocus('refDesigValue');
              } else {
                let messageContent;
                if (vm.isInvalid) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_REF_DES);
                  messageContent.message = stringFormat(messageContent.message, vm.refDesigModel.refDesig);
                } else if (vm.isDuplicate) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
                  messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.BOM.REF_DES + ': ' + vm.refDesigModel.refDesig);
                }
                if (messageContent) {
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    vm.isDisableRefDesig = false;
                    vm.isDuplicate = false;
                    vm.isInvalid = false;
                    vm.resetRefDesignatorModel();
                    setFocus('refDesigValue');
                  });
                } else {
                  vm.isDisableRefDesig = false;
                }
              }
            });
            /** Prevent enter key submit event */
            preventInputEnterKeyEvent(event);
          }
        }
      };

      /** Edit ref. designator */
      vm.editRefDesigFromList = (item) => {
        vm.refDesigModel = angular.copy(item);
        vm.updateRefDes = true;
        setFocus('refDesigValue');
      };

      // to reset Ref. Designator Object
      vm.resetRefDesignatorModel = () => {
        vm.updateRefDes = false;
        vm.isDisableRefDesig = false;
        vm.refDesigModel = {
          refDesig: null
        };
        if (vm.frmOperationRefDesig) {
          vm.frmOperationRefDesig.refDesigValue.$setValidity('duplicate', true);
          vm.frmOperationRefDesig.refDesigValue.$setValidity('maxlength', true);
          vm.frmOperationRefDesig.refDesigValue.$setValidity('invalidRefDesig', true);
        }
      };

      /** Remove track number from list */
      vm.removeRefDesigFromList = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.BOM.REF_DES, '');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              // vm.frmOperationRefDesig.$setDirty(true);
              vm.frmOperationDetails.$setDirty(true);// set parent form dirty
              vm.frmOperationDetails.$$controls[0].$setDirty(true);
              item.isDeleted = 1;
              setFocus('refDesigValue');
            }
          }, () => {
            setFocus('refDesigValue');
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // show BOM list to select RefDes
      vm.showBOMLineList = () => {
        const data = {
          displayOddelyRefDes: vm.DisplayOddelyRefDes,
          assyDetails: {
            partID: vm.operation.workorder.partID,
            PIDCode: vm.operation.workorder.PIDCode,
            mfgPN: vm.operation.workorder.componentAssembly.mfgPN,
            rohsName: vm.operation.workorder.rohs.name,
            rohsIcon: vm.operation.workorder.rohs.rohsIcon
          }
        };
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_BOM_LINE_LIST_MODAL_CONTROLLER,
          TRANSACTION.TRANSACTION_BOM_LINE_LIST_MODAL_VIEW,
          event,
          data).then(() => { }, (selectedData) => {
            let selected_list;
            console.log('Start');
            console.log(new Date());
            if (selectedData && selectedData.length > 0) {
              /// following logic add new RefDes selected from list and add only unique refDes
              let entered_list;
              const newOpListObj = (vm.operation.refDesigList ? _.filter(vm.operation.refDesigList, (item) => (item.isDeleted === 0 || (!item.isDeleted)) && (!item.id)) : {});
              const newOpList = getDesignatorFromLineItem(newOpListObj ? _.map(newOpListObj, (item) => item.refDesig).join(',') : [], vm.DisplayOddelyRefDes); // for newly added and removed list

              _.each(selectedData, (item) => {
                if (vm.bomRefDesList && item.refDesig) {
                  selected_list = stringFormat('{0}{1}', item.refDesig, item.dnpDesig ? ',' + item.dnpDesig : '');
                  entered_list = getDesignatorFromLineItem(selected_list, vm.DisplayOddelyRefDes);
                  // get all ref.designator list already except one being update
                  const woList = getDesignatorFromLineItem(vm.woRefDesigList ? _.map(vm.woRefDesigList, (item) => ((!item.isDeleted) || item.isDeleted === 0 ? item.refDesig : null)).join(',') : [], vm.DisplayOddelyRefDes);

                  const inWOList = _.intersection(entered_list, woList);
                  const inNewOpList = _.intersection(entered_list, newOpList);

                  entered_list = inWOList && inWOList.length > 0 ? _.difference(entered_list, woList) : entered_list;
                  entered_list = inNewOpList && inNewOpList.length > 0 ? _.difference(entered_list, newOpList) : entered_list;

                  if (entered_list && entered_list.length > 0) {
                    let obj = _.map(entered_list, (item) => { return { 'key': item.substring(0, (item.match(/\d+$/) ? item.match(/\d+$/).index : 0)), 'value': parseInt(item.substring(item.match(/\d+$/) ? item.match(/\d+$/).index : -1)), 'name': item }; });
                    obj = _.sortBy(obj, 'key', 'value');
                    // filter obj with no numeric value directly to  final chip like 'XY'
                    const finalChip = _.map(_.filter(obj, (i) => !i.value), (item) => item.name);
                    // remove obj with  no numeric value
                    obj = _.filter(obj, (i) => i.value);
                    const prefixGroup = _.groupBy(obj, 'key');
                    let numberSequence, numberRange;
                    _.each(prefixGroup, (det, index) => {
                      numberRange = numberSequence = null;
                      numberSequence = _.map(det, (item) => item.value);
                      numberRange = sequenceToRange(numberSequence, '-');
                      _.each(numberRange, (item, $index) => {
                        if (item.indexOf('-') > 0) {
                          numberRange[$index] = `${index}` + item.substring(0, item.indexOf('-')) + '-' + `${index}` + item.substring(item.indexOf('-') + 1);
                        } else {
                          numberRange[$index] = `${index}` + item;
                        }
                      });
                      finalChip.push(numberRange);
                    });
                    if (finalChip && finalChip.length > 0) {
                      vm.operation.refDesigList.push({
                        refDesig: finalChip.join(','),
                        tempID: (vm.operation.refDesigList.length + 1),
                        Id: null,
                        isDeleted: 0
                      });
                    }
                  }
                  entered_list = null;
                }
              });
            }
            console.log('End');
            console.log(new Date());
          }).catch((err) => BaseService.getErrorLog(err));
      };


      vm.removeAllRefDes = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.DELETE_ALL_REF_DESG_WO_OPERATION);
        // messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.BOM.REF_DES, '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            // vm.frmOperationRefDesig.$setDirty(true);
            vm.frmOperationDetails.$setDirty(true);// set parent form dirty
            vm.frmOperationDetails.$$controls[0].$setDirty(true);
            _.each(vm.operation.refDesigList, (det) => {
              det.isDeleted = 1;
            });
            setFocus('refDesigValue');
          }
        }, () => {
          setFocus('refDesigValue');
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // refresh list after save from parent
      $scope.$on('refreshRefDesgDirectiveList', () => {
        vm.getAllRefDesignatorByWoID();
        vm.isDisableRefDesigChip = ((!vm.operation.addRefDesig) || vm.isWorkorderOperationPublished || vm.isWOUnderTermination || vm.isWoInSpecificStatusNotAllowedToChange);
      });
    }
  }
})();

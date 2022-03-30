(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ManageWorkorderOperationsController', ManageWorkorderOperationsController);

  /** @ngInject */
  function ManageWorkorderOperationsController($scope, $timeout, $state, $mdDialog,
    WORKORDER, CORE, TRAVELER, USER,
    contextMenuService, uiSortableMultiSelectionMethods, BaseService, DialogFactory,
    WorkorderFactory, WorkorderOperationClusterFactory, WorkorderOperationEmployeeFactory,
    WorkorderClusterFactory, GenericCategoryConstant) {
    // Don't Remove this code
    // Don't add any code before this
    if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
      $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
      return;
    }
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'operationDetails';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code


    let loginUserDetails = BaseService.loginUser;
    vm.isdisabled = false;
    vm.SelectAllOp = false;
    vm.SearchSelectedOperationTxt = null;
    vm.previewDocument = false;
    vm.Workorder_operationEntity = vm.ALLEntities.Workorder_operation.Name;
    vm.operation_Entity = vm.ALLEntities.Operation.Name;
    vm.LabelConstant = CORE.LabelConstant;
    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.workorder.woStatus == CORE.WOSTATUS.TERMINATED);


    let showOperationAlert = (message, multiple, title) => {
      var model = {
        title: title ? title : CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: message,
        multiple: true
      };
      DialogFactory.alertDialog(model);
    }

    /*To Upload Work Order Operation Document 
    */
    vm.uploadWorkOrderOperationDocument = (operation, clusterName) => {
      vm.previewDocument = true;
      if (operation) {
        vm.woOPID = operation.woOPID;
      }
      vm.id = vm.woOPID;
      vm.entity = vm.Workorder_operationEntity;
      vm.title = { "clusterName": clusterName, "operation": operation.opName }
    };

    /**
    * Step 3 Select Master Template or Operation
    *
    * @param
    */
    let _SelectedOperationList = [];
    vm.SelectedOperationList = [];
    vm.EmptyMesssageOperation = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;

    // Check for operation is started in production or not.
    vm.checkOperationCompleted = (operation) => {
      var history = _.find(vm.workorder.workorderTransEmpinout, (item) => {
        return item.woOPID == operation.woOPID;
      });
      return history ? true : false;
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Get All cluster list with woID
    */
    vm.workorderClusterList = [];
    vm.clusterSubmenu = [];

    /*Remove Operations from cluster common function while right click menu or drag and drop*/
    let removeOperationFromCluster = (scope, opObj) => {
      let clusterID = [];
      let woOPID = [];
      if (opObj.woClusterID && scope.selectedOperationListAdded.length == 0
        && operationAllowedToDeleteFromCluster(opObj.clusterID, opObj.opID, opObj.woOPID)) {
        clusterID.push(opObj.clusterID);
        woOPID.push(opObj.woOPID)
      }
      else {
        _.map(scope.selectedOperationListAdded, (item) => {
          return clusterID.push(item.clusterID) && woOPID.push(item.woOPID);
        });
        // console.log(woClusterIDsToDelete);
      }
      let woClusterIDsToDelete = {
        clusterID: clusterID,
        woOPID: woOPID
      }

      if (clusterID.length > 0 && woOPID.length > 0) {
        vm.cgBusyLoading = WorkorderOperationClusterFactory.deleteClusterOperationFromWorkOrder().query({ listObj: woClusterIDsToDelete }).$promise.then((res) => {
          if (res && res.data) {
            if (res.data.TotalCount && res.data.TotalCount > 0) {
              BaseService.deleteAlertMessage(res.data);
            } else {
              vm.workorder.isOperationsVerified = false;
              let sentData = {
                isOperationsVerified: false,
                isOperationAvailable: vm.SelectedOperationList && vm.SelectedOperationList.length > 0 ? true : false
              }
              $scope.$emit("operationChanged", sentData);
              vm.SearchSelectedOperationTxt = null;
              vm.SelectAllOp = false;
              vm.GetOperationListByWoID();
            }
          }

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    /*Add/Update Operations to cluster common function while right click menu or drag and drop*/
    let addOperationsFromCluster = (saveObj) => {
      if (saveObj.length > 0 && saveObj[0].woClusterID) {
        vm.cgBusyLoading = WorkorderOperationClusterFactory.workorder_operation_cluster().update({
        }, saveObj).$promise.then((res) => {
          //vm.getWorkorderClusterList();
          vm.workorder.isOperationsVerified = false;
          let sentData = {
            isOperationsVerified: false,
            isOperationAvailable: vm.SelectedOperationList && vm.SelectedOperationList.length > 0 ? true : false
          }
          $scope.$emit("operationChanged", sentData);
          vm.SearchSelectedOperationTxt = null;
          vm.SelectAllOp = false;
          vm.GetOperationListByWoID();
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        let Obj = {
          woID: vm.workorder.woID,
          saveObj: saveObj
        }
        vm.cgBusyLoading = WorkorderOperationClusterFactory.workorder_operation_cluster().save(
          Obj).$promise.then((res) => {
            //vm.getWorkorderClusterList();
            vm.workorder.isOperationsVerified = false;
            let sentData = {
              isOperationsVerified: false,
              isOperationAvailable: vm.SelectedOperationList && vm.SelectedOperationList.length > 0 ? true : false
            }
            $scope.$emit("operationChanged", sentData);
            vm.SearchSelectedOperationTxt = null;
            vm.SelectAllOp = false;
            vm.GetOperationListByWoID();
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
      }
    }

    // Check Selected operation is valid to move in cluster
    let checkSelectedOperationValid = (list, obj, IsClusterItem) => {
      // add in single selected object
      let newList = [];
      if (list.length == 0) {
        let newObj = {
        };
        newObj.woClusterID = IsClusterItem ? (obj.woClusterID ? obj.woClusterID : null) : null;
        newObj.opID = obj.opID;
        newObj.woOPID = obj.woOPID;
        newObj.opName = obj.opName;
        newObj.opNumber = obj.opNumber;
        newObj.displayOrder = obj.displayOrder ? obj.displayOrder : null;
        newObj.isRework = obj.isRework;
        newObj.qtyControl = obj.qtyControl;
        newObj.isIssueQty = obj.isIssueQty;
        newObj.isMoveToStock = obj.isMoveToStock;
        newObj.isPlacementTracking = obj.isPlacementTracking;
        newObj.isTrackBySerialNo = obj.isTrackBySerialNo;
        newObj.isAllowFinalSerialMapping = obj.isAllowFinalSerialMapping;
        newObj.isLoopOperation = obj.isLoopOperation;
        newObj.refLoopWOOPID = obj.refLoopWOOPID;
        newObj.isPreProgrammingComponent = obj.isPreProgrammingComponent;
        newList.push(newObj);
        list = newList;
      }

      // get min. and max. operation number from selected list.
      let minOpNumber = null;
      let maxOpNumber = null;
      let minOpObj = _.minBy(list, function (opn) {
        return opn.opNumber;
      });
      let maxOpObj = _.maxBy(list, function (opn) {
        return opn.opNumber;
      });
      minOpNumber = minOpObj ? (minOpObj.opNumber) : 0;
      maxOpNumber = maxOpObj ? (maxOpObj.opNumber) : 0;

      // copy main operation list and remove selected operation from it
      let op_list = angular.copy(vm.AlloperationList);
      _.each(list, (op) => {
        _.remove(op_list, (o) => {
          return o.opID == op.opID;
        });
      });

      // find in between operation from list
      let findInbetween = _.find(op_list, (objItem) => {
        return objItem.opNumber > minOpNumber && objItem.opNumber < maxOpNumber;
      });
      if (findInbetween) {
        showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SEQU_OPERATION), true);
      }
      else {
        createArrayandAddOperation(list, obj, IsClusterItem);
      }
    }

    // Check Operation is valid or not to move in selected cluster
    let IsValidClusterOperation = (clusterID, currentOPNumber) => {
      //Get cluster details from workorder cluster list
      let objClust = _.find(vm.workorderClusterList, (clust) => {
        return clust.clusterID == clusterID;
      });

      // Get max. and min. operation number
      let clusterOperationList = [];
      let minClusterOpNumber = null;
      let maxClusterOpNumber = null;
      if (objClust)
        clusterOperationList = objClust.workorderOperationCluster;
      if (clusterOperationList.length > 0) {
        clusterOperationList = _.sortBy(clusterOperationList, 'opNumber');
        let minOpClusterNumberObj = _.minBy(clusterOperationList, function (opn) {
          return opn.opNumber;
        });
        let maxOpClusterNumberObj = _.maxBy(clusterOperationList, function (opn) {
          return opn.opNumber;
        });
        minClusterOpNumber = minOpClusterNumberObj ? minOpClusterNumberObj.opNumber : 0;
        maxClusterOpNumber = maxOpClusterNumberObj ? maxOpClusterNumberObj.opNumber : 0;
      }

      // check in operation list for in between operation exists or not
      if (vm.AlloperationList.length > 0) {
        if (minClusterOpNumber && currentOPNumber < minClusterOpNumber) {
          let findOpInBetween = _.find(vm.AlloperationList, (op) => {
            return op.opNumber > currentOPNumber && op.opNumber < minClusterOpNumber;
          });
          if (findOpInBetween) {
            return false;
          }
        }
        else if (maxClusterOpNumber && currentOPNumber > maxClusterOpNumber) {
          let findOpInBetween = _.find(vm.AlloperationList, (op) => {
            return op.opNumber < currentOPNumber && op.opNumber > maxClusterOpNumber;
          });
          if (findOpInBetween) {
            return false;
          }
        }
      }
      return true;
      //return false;
    }

    // create save object to move in cluster
    let createArrayandAddOperation = (list, obj, IsClusterItem) => {
      const objArray = [];
      //let isAnyInvalid = false;
      let errorMsg = [];

      //Get cluster details from workorder cluster list
      let objClust = _.find(vm.workorderClusterList, (clust) => {
        return clust.clusterID == obj.clusterID;
      });


      /********************** start - case 3 - Check Cluster validations *******************************/
      // check if cluster is parallel
      if (vm.workorder.woStatus == CORE.WOSTATUS.PUBLISHED && objClust.isParellelOperation) {
        /************ start - all operation must be same in parallel cluster ********/

        // check for select operation type must be same to process ahead
        let uniqOperationTypeObjList = _.uniqBy(list, 'operationTypeID');
        // if more than one operation type in list than it's not same operation
        if (uniqOperationTypeObjList.length > 1) {
          errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION));
          //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION), true);
          //return false;
        } else {

          // check cluster is parallel and all operation type is same or not
          let resultClusterObjList = _.uniqBy(objClust.workorderOperationCluster, 'operationTypeID');
          // if more than one operation type in cluster operation than it is not same operation
          if (resultClusterObjList.length > 1) {
            errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION));
            //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION), true);
            //return false;
          } else {
            // check with operation type from list and operation of cluster
            let clusterUniqOpObj = _.first(resultClusterObjList);
            let uniqOperationTypeObj = _.first(uniqOperationTypeObjList);
            if (clusterUniqOpObj && uniqOperationTypeObj && clusterUniqOpObj.operationTypeID != uniqOperationTypeObj.operationTypeID) {
              errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION));
              //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION), true);
              //return false;
            }
            if (clusterUniqOpObj && clusterUniqOpObj.workorderOperation && clusterUniqOpObj.workorderOperation.operationType
              && clusterUniqOpObj.workorderOperation.operationType.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
              let maxOpCluster = _.maxBy(objClust.workorderOperationCluster, 'opNumber');
              if (maxOpCluster) {
                let findOPIndex = _.findIndex(vm.AlloperationList, (op) => { return op.opNumber == maxOpCluster.opNumber });
                let nextOpOfParallelInspectionOperationCluster = vm.AlloperationList[findOPIndex + 1];
                if (nextOpOfParallelInspectionOperationCluster) {
                  if (!nextOpOfParallelInspectionOperationCluster.isRework) {
                    errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.FIRST_OPERATION_OF_INSPECTION_PARALLEL_CLUSTER_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, nextOpOfParallelInspectionOperationCluster.opName, nextOpOfParallelInspectionOperationCluster.opNumber)));
                  }
                }
                else {
                  errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.FIRST_OPERATION_OF_INSPECTION_PARALLEL_CLUSTER_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, nextOpOfParallelInspectionOperationCluster.opName, nextOpOfParallelInspectionOperationCluster.opNumber)));
                }
              }
            }
          }
        }
        /************ end - all operation must be same in parallel cluster ********/

        /************ start - if cluster is parallel than it should not have any rework operation ********/
        let findReworkOp = _.find(list, (op) => { return op.isRework == true });
        let findReworkOpInCluster = _.find(objClust.workorderOperationCluster, (op) => { return op.isRework == true });
        if (findReworkOp || findReworkOpInCluster) {
          errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.NOT_ALLOW_REWORK));
          //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.NOT_ALLOW_REWORK), true);
          //return false;
        }
        /************ end - if cluster is parallel than it should not have any rework operation ********/

        /************ start - if cluster is parallel than it should not have any Pre-ProgrammingComponent operation ********/
        let findPreProgrammingOp = _.find(list, (op) => { return op.isPreProgrammingComponent == true });
        let findPreProgrammingOpInCluster = _.find(objClust.workorderOperationCluster, (op) => { return op.isPreProgrammingComponent == true });
        if (findPreProgrammingOp || findPreProgrammingOpInCluster) {
          errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.NOT_ALLOW_PREPROGRAMMING));
          //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.NOT_ALLOW_REWORK), true);
          //return false;
        }
        /************ end - if cluster is parallel than it should not have any Pre-ProgrammingComponent operation ********/
      }
      /********************** end - case 3 - Check Cluster validations *******************************/

      if (errorMsg.length > 0) {
        showOperationAlert(errorMsg.join('<br/>'), true);
        return;
      }

      // check for each selected operation is valid for cluster or not for min and max opnumber allowed to move.
      _.each(list, (item, $index) => {
        //if (vm.AlloperationList.length > 0) {
        //    // get current operation index
        //    let currentIndex = _.findIndex(vm.AlloperationList, function (o) { return o.opNumber == item.opNumber; });
        //    if (currentIndex) {
        //        // get current operation 
        //        let currentObj = vm.AlloperationList[currentIndex];
        //        // get previous operation

        //        // get next operation
        //        let nextObj = vm.AlloperationList[currentIndex + 1];
        //        /******************** start - case 1 - current operation with rework than previous operation must have 'inspection process' ***********/
        //        if (currentObj && currentObj.isRework) {
        //            /*************** start - 1. if current operation is first operation should not be rework type **********************/
        //            if (currentIndex == 0) {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.FIRST_OPERATION_REWORK_INVALID, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /*************** end - 1. if current operation is first operation should not be rework type **********************/

        //            /**************** start - 2. rework operation should not be inspection process ********************************/
        //            if (currentObj.operationType && currentObj.operationType.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.REWORK_IS_INSPECTION_INVALID, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /**************** end - 2. rework operation should not be inspection process ********************************/

        //            /******************** start - 3. rework operation validation for mfg quantity and issue quantity ****************************/
        //            if (!currentObj.qtyControl || !currentObj.isIssueQty) {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.INVALID_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /******************** end - 3. rework operation validation for mfg quantity and issue quantity ****************************/

        //            /********************* start - 4. check rework operation should not be in parallel cluster ***************/
        //            if (objClust && objClust.isParellelOperation) {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.CURRENT_REWORK_NOT_ALLOW, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /********************* end - 4. check rework operation should not be in parallel cluster ***************/

        //            /************** start - 5. check previous operation of rework operation must be inspection or rework only ********/
        //            let previousObj = vm.AlloperationList[currentIndex - 1];
        //            if (previousObj) {
        //                if ((previousObj.operationType) && (previousObj.operationType.gencCategoryName != GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName && !previousObj.isRework)) {
        //                    errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.PREV_OPERATION_INSPECTION_OR_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //                }
        //            } else {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.PREV_OPERATION_INSPECTION_OR_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /************** end - 5. check previous operation of rework operation must be inspection or rework only ********/

        //        }
        //        /******************** end - case 1 - current operation with rework than previous operation must have 'inspection process' ***********/

        //        /******************** start - case 2 - current Operation inspection process **************************/
        //        if (currentObj && currentObj.operationType.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
        //            /************** start - 1. inspection operation should not be rework **************************/
        //            if (currentObj.isRework) {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.REWORK_IS_INSPECTION_INVALID, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /************** end - 1. inspection operation should not be rework **************************/

        //            /****************** start - 2. inspection operation validation for mfg quantity *******************************/
        //            if (!currentObj.qtyControl) {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.INVALID_INSPECTION, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /***************** end - 2. inspection operation validation for mfg quantity ******************************/

        //            /****************** start - 3. check inspection operation next operation must be rework only ***********************/
        //            // check current operation is inspection process than next operation must be rework only if cluster is not parallel
        //            if (nextObj) {
        //                if (nextObj.isRework != true
        //                        && (objClust && !objClust.isParellelOperation)) {
        //                    errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.NEXT_OPERATION_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //                    //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.NEXT_OPERATION_REWORK, currentObj.opName), true);
        //                    //return false;
        //                }
        //            } else {
        //                errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.NEXT_OPERATION_REWORK, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //            }
        //            /***************** end - 3. check inspection operation next operation must be rework only ********************/
        //        }
        //        /******************** end - case 2 - current Operation inspection process **************************/
        //    }
        //}

        //if (IsValidClusterOperation(obj.clusterID, item.opNumber)) {
        createOperationClusterArray(objArray, item.woClusterID, obj.clusterID, item.opID, item.woOPID, $index + 1);
        //}
        //else {
        // check any of operation is invalid than flag set invalid true
        ////errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_MUST_BE_SEQU, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, currentObj.opName, currentObj.opNumber)));
        //if (!isAnyInvalid) {
        //    isAnyInvalid = true;
        //}
        //}
      });

      if (objArray.length > 0) {
        addOperationsFromCluster(objArray);
      }
      //if (isAnyInvalid) {
      //    errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SEQU_OPERATION));
      if (errorMsg.length > 0) {
        showOperationAlert(errorMsg.join('<br/>'), true);
        return;
      }
      //showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SEQU_OPERATION), true);
      //}
    }

    /*createOperationClusterArray*/
    let createOperationClusterArray = (array, woClusterID, clusterID, opID, woOPID, displayOrder) => {
      const _object = {};
      if (woClusterID)
        _object.woClusterID = woClusterID;
      _object.clusterID = clusterID;
      _object.opID = opID;
      _object.woOPID = woOPID;
      _object.woID = vm.workorder.woID;
      if (displayOrder)
        _object.displayOrder = displayOrder;
      array.push(_object);
    }

    /* delete operation from cluster*/
    let DeleteOperationFromCluster = (itemScope) => {
      let obj = {
        title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Selected operation from cluster"),
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "selected operation from cluster"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          if (itemScope.clusterItem) {
            let obj = {};
            obj.clusterID = itemScope.clusterItem.clusterID;
            obj.woClusterID = itemScope.clusterItem.woClusterID;
            obj.opID = itemScope.clusterItem.opID;
            obj.woOPID = itemScope.clusterItem.woOPID;
            removeOperationFromCluster(itemScope, obj);
          } else {
            //Check delete operation from cluster
            let obj = {};
            obj.woClusterID = itemScope.clusterItem.clusterID;
            obj.opID = itemScope.clusterItem.opID;
            obj.woOPID = itemScope.clusterItem.woOPID;
            removeOperationFromCluster(itemScope, null);
          }
          UnSelectAllOperation();
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* On select Cluster menu item and then to move operation to cluster */
    $scope.OnClusterSelectToAddOperation = function (itemScope, selectedClusterItem) {
      let obj = {
        title: USER.DELETE_CONFIRM,
        textContent: stringFormat(WORKORDER.MOVE_OPERATION_TO_CLUSTER_LABEL, selectedClusterItem.clusterName),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          let woOPID;
          if (!itemScope.clusterItem) {
            woOPID = itemScope.$parent.operation.woOPID;
          } else {
            woOPID = itemScope.clusterItem.woOPID;
          }
          var history = _.find(vm.workorder.workorderTransEmpinout, (item) => {
            return item.woOPID == woOPID;
          });
          if (history) {
            showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.MOVE_OPERATION_IN_USE), true);
          } else {
            //If operation from operation list
            if (!itemScope.clusterItem) {
              var obj = {
                clusterID: selectedClusterItem.clusterID,
                opID: itemScope.$parent.operation.opID,
                woOPID: itemScope.$parent.operation.woOPID,
                opName: itemScope.$parent.operation.opName,
                opNumber: itemScope.$parent.operation.opNumber,
                operationTypeID: itemScope.$parent.operation.operationTypeID,
                isRework: itemScope.$parent.operation.isRework,
                qtyControl: itemScope.$parent.operation.qtyControl,
                isIssueQty: itemScope.$parent.operation.isIssueQty,
                isMoveToStock: itemScope.$parent.operation.isMoveToStock,
                isPlacementTracking: itemScope.$parent.operation.isPlacementTracking,
                isTrackBySerialNo: itemScope.$parent.operation.isTrackBySerialNo,
                isAllowFinalSerialMapping: itemScope.$parent.operation.isAllowFinalSerialMapping,
                isLoopOperation: itemScope.$parent.operation.isLoopOperation,
                refLoopWOOPID: itemScope.$parent.operation.refLoopWOOPID,
                isPreProgrammingComponent: itemScope.$parent.operation.isPreProgrammingComponent
              }
              // Check Selected operation is valid to move in cluster
              checkSelectedOperationValid($scope.selectedOperationListNoAdded, obj, false);
            }
            else {
              var obj = {
                woClusterID: itemScope.clusterItem.woClusterID,
                clusterID: selectedClusterItem.clusterID,
                opID: itemScope.clusterItem.opID,
                woOPID: itemScope.clusterItem.woOPID,
                opNumber: itemScope.clusterItem.opNumber,
                opName: itemScope.clusterItem.opName,
                operationTypeID: itemScope.clusterItem.operationTypeID,
                isRework: itemScope.clusterItem.isRework,
                qtyControl: itemScope.clusterItem.qtyControl,
                isIssueQty: itemScope.clusterItem.isIssueQty,
                isMoveToStock: itemScope.clusterItem.isMoveToStock,
                isPlacementTracking: itemScope.clusterItem.isPlacementTracking,
                isTrackBySerialNo: itemScope.clusterItem.isTrackBySerialNo,
                isAllowFinalSerialMapping: itemScope.clusterItem.isAllowFinalSerialMapping,
                isLoopOperation: itemScope.clusterItem.isLoopOperation,
                refLoopWOOPID: itemScope.clusterItem.refLoopWOOPID,
                isPreProgrammingComponent: itemScope.clusterItem.isPreProgrammingComponent
              }
              // Check Selected operation is valid to move in cluster
              checkSelectedOperationValid($scope.selectedOperationListAdded, obj, true);
            }
            UnSelectAllOperation();
          }
        }

      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get work order cluster list
    vm.getWorkorderClusterList = () => {
      vm.workorderClusterList = vm.clusterSubmenu = [];
      vm.cgBusyLoading = WorkorderClusterFactory.retriveClusterListbyWoID().query({ woID: vm.workorder.woID }).$promise.then((clusterList) => {
        vm.workorderClusterList = clusterList.data;
        vm.isClusterHasOperation = false;
        if (vm.workorderClusterList.length > 0) {

          /* set context menu for operation part (div) */
          _.each(vm.workorderClusterList, (item) => {
            if (item && item.workorderOperationCluster && item.workorderOperationCluster.length > 0) {
              item.isdisabled = true;
              vm.isClusterHasOperation = true;
            } else {
              item.isdisabled = false;
            }
            _.each(item.workorderOperationCluster, (clusterItem) => {
              clusterItem.opName = clusterItem.workorderOperation.opName;
              clusterItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, clusterItem.workorderOperation.opName, clusterItem.workorderOperation.opNumber);
              clusterItem.isStopOperation = clusterItem.workorderOperation.isStopOperation;
              clusterItem.operationTypeID = clusterItem.workorderOperation.operationTypeID;
              clusterItem.isRework = clusterItem.workorderOperation.isRework;
              clusterItem.qtyControl = clusterItem.workorderOperation.qtyControl;
              clusterItem.isIssueQty = clusterItem.workorderOperation.isIssueQty;
              clusterItem.isTeamOperation = clusterItem.workorderOperation.isTeamOperation;
              clusterItem.isMoveToStock = clusterItem.workorderOperation.isMoveToStock;
              clusterItem.isTrackBySerialNo = clusterItem.workorderOperation.isTrackBySerialNo;
              clusterItem.isAllowFinalSerialMapping = clusterItem.workorderOperation.isAllowFinalSerialMapping;
              clusterItem.isLoopOperation = clusterItem.workorderOperation.isLoopOperation;
              clusterItem.refLoopWOOPID = clusterItem.workorderOperation.refLoopWOOPID;
              clusterItem.isPlacementTracking = clusterItem.workorderOperation.isPlacementTracking;
              clusterItem.isPreProgrammingComponent = clusterItem.workorderOperation.isPreProgrammingComponent;
              clusterItem.opNumber = clusterItem.workorderOperation.opNumber;
              clusterItem.opStatus = clusterItem.workorderOperation.opStatus;
              clusterItem.woID = clusterItem.workorderOperation.woID;
              clusterItem.workorderTransOperationHoldUnhold = _.first(clusterItem.workorderOperation.workorderTransOperationHoldUnhold);
              clusterItem["opStatusDisplayText"] = BaseService.getOpStatus(clusterItem.workorderOperation.opStatus);
              clusterItem["opStatusCssClass"] = BaseService.getOpStatusClassName(clusterItem.workorderOperation.opStatus);
            });
            item.workorderOperationCluster = _.sortBy(item.workorderOperationCluster, 'opNumber');
            var obj = [item.clusterName, function ($itemScope) {
              $scope.OnClusterSelectToAddOperation($itemScope, item);
            }, item];
            vm.clusterSubmenu.push(obj);

          });
          $scope.menuOptionsForOperation = [
            [contextMenuService.contextMenuItem.AssignOperationToCluster.Label, vm.clusterSubmenu]
          ];
          /* set context menu for cluster part (div) */
          _.each(vm.workorderClusterList, (mainClusterItem) => {
            let workorderClusterListForClusterSubmenu = [];
            let clusterSubmenuItemlist = [];
            workorderClusterListForClusterSubmenu = _.filter(vm.workorderClusterList, function (filteritem) {
              return mainClusterItem.clusterID != filteritem.clusterID;
            });

            if (workorderClusterListForClusterSubmenu.length > 0) {
              _.each(workorderClusterListForClusterSubmenu, (item) => {
                var obj = [item.clusterName, function ($itemScope) {
                  $scope.OnClusterSelectToAddOperation($itemScope, item);
                }, item];
                clusterSubmenuItemlist.push(obj);
              });
              mainClusterItem.clusterSubmenu = clusterSubmenuItemlist;

              mainClusterItem.menuOptionsForCluster = [
                [contextMenuService.contextMenuItem.AssignOperationToCluster.Label, mainClusterItem.clusterSubmenu],
                [contextMenuService.contextMenuItem.DeleteOperationFromCluster.Label,
                function ($itemScope) { DeleteOperationFromCluster($itemScope) }
                ]
              ];
            }
            else {
              mainClusterItem.menuOptionsForCluster = [
                [contextMenuService.contextMenuItem.DeleteOperationFromCluster.Label,
                function ($itemScope) { DeleteOperationFromCluster($itemScope) }
                ]
              ];
            }

          });
        }
        else {
          $scope.menuOptionsForOperation = [];
          $scope.menuOptionsForCluster = [];
        }

        $timeout(() => {
          setOperationClusterSelectable();
        }, _configSelectListTimeout);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //vm.getWorkorderClusterList();

    /*
    * Author :  Vaibhav Shah
    * Purpose : Get All operation list with woID
    */
    vm.GetOperationListByWoID = () => {
      vm.AlloperationList = [];
      _SelectedOperationList = vm.SelectedOperationList = [];
      vm.cgBusyLoading = WorkorderOperationEmployeeFactory.retriveOperationListbyWoID().query({ woID: vm.workorder.woID }).$promise.then((operationlist) => {
        operationlist.data = _.sortBy(operationlist.data, 'opNumber');
        vm.AlloperationList = angular.copy(operationlist.data);
        //operationlist.data = _.remove(operationlist.data, (item) => {
        //  let object = null;
        //  // Incase of detail workorder operation if cluster operation avaibable but in another workorder.
        //  if (item.workorderOperationCluster.length > 0) {
        //    object = _.find(item.workorderOperationCluster, (obj) => {
        //      return obj.clusterWorkorder == null;
        //    });
        //  }

        //  // If found operation cluster without workorder by WOID than show in operation list
        //  if (object)
        //    return object;
        //  else
        //    return item.workorderOperationCluster.length == 0;
        //});
        _.each(operationlist.data, (item) => {
          item["opStatusDisplayText"] = BaseService.getOpStatus(item.opStatus);
          item["opStatusCssClass"] = BaseService.getOpStatusClassName(item.opStatus);
          item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
          item.workorderTransOperationHoldUnhold = _.first(item.workorderTransOperationHoldUnhold);
          if (item.workorderOperationCluster.length > 0) {
            let findParallelCluster = _.find(item.workorderOperationCluster, (objItem) => { return objItem.clusterWorkorder && objItem.clusterWorkorder.isParellelOperation });
            item.parallelClusterOperation = findParallelCluster ? true : false;
          }
          item.fluxTypeList = [];
          item.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          item.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
          vm.SelectedOperationList.push(item);
        });
        vm.SelectedOperationList = _.sortBy(vm.SelectedOperationList, 'opNumber');
        _SelectedOperationList = vm.SelectedOperationList;
        vm.getWorkorderClusterList();
        $timeout(() => {
          SetOperationSelectable();
        }, _configSelectListTimeout);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Onclick of step 3 Select Operation
    */
    vm.getWorkorderOperationList = () => {
      vm.previewDocument = false;
      vm.SearchSelectedOperationTxt = null;
      vm.SelectAllOp = false;
      $timeout(() => {
        vm.GetOperationListByWoID();
      }, _configSelectListTimeout)
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Add operation popup
    */
    vm.AddOperationFromList = (isFromWOOperationList, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let data = {};
      data.isFromWOOperationList = isFromWOOperationList;
      let Selectedlist = [];
      _.each(vm.AlloperationList, (item) => {
        if (item.workorderOperationCluster.length == 0) {
          let obj = {
            'opID': item.opID, 'opName': item.opName, 'opNumber': item.opNumber, 'isRework': item.isRework, 'operationType': item.operationType, 'isParellelOperation': false, 'qtyControl': item.qtyControl, 'isIssueQty': item.isIssueQty, 'isPreProgrammingComponent': item.isPreProgrammingComponent, 'isMoveToStock': item.isMoveToStock, 'isPlacementTracking': item.isPlacementTracking, 'isTrackBySerialNo': item.isTrackBySerialNo, 'isAllowFinalSerialMapping': item.isAllowFinalSerialMapping, 'isLoopOperation': item.isLoopOperation, 'refLoopWOOPID': item.refLoopWOOPID,
            'isFluxNotApplicable': item.isFluxNotApplicable,
            'isNoClean': item.isNoClean,
            'isWaterSoluble': item.isWaterSoluble
          };
          obj.fluxTypeList = [];
          obj.fluxTypeList.push({
            value: item.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          obj.fluxTypeList.push({
            value: item.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          obj.fluxTypeList.push({
            value: item.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
          Selectedlist.push(obj);
        }
      });
      _.each(vm.workorderClusterList, (item) => {
        _.each(item.workorderOperationCluster, (clusterop) => {
          let obj = {
            'opID': clusterop.opID,
            'opName': clusterop.opName,
            'opNumber': clusterop.opNumber,
            'isRework': clusterop.isRework,
            'operationType': clusterop.workorderOperation.operationType,
            'isParellelOperation': item.isParellelOperation,
            'clusterID': clusterop.clusterID,
            'qtyControl': clusterop.workorderOperation.qtyControl,
            'isIssueQty': clusterop.workorderOperation.isIssueQty,
            'isPreProgrammingComponent': clusterop.workorderOperation.isPreProgrammingComponent,
            'isMoveToStock': clusterop.workorderOperation.isMoveToStock,
            'isPlacementTracking': clusterop.workorderOperation.isPlacementTracking,
            'isTrackBySerialNo': clusterop.workorderOperation.isTrackBySerialNo,
            'isAllowFinalSerialMapping': clusterop.workorderOperation.isAllowFinalSerialMapping,
            'isLoopOperation': clusterop.workorderOperation.isLoopOperation,
            'refLoopWOOPID': clusterop.workorderOperation.refLoopWOOPID,
            'isFluxNotApplicable': clusterop.workorderOperation.isFluxNotApplicable,
            'isNoClean': clusterop.workorderOperation.isNoClean,
            'isWaterSoluble': clusterop.workorderOperation.isWaterSoluble,
          };
          obj.fluxTypeList = [];
          obj.fluxTypeList.push({
            value: clusterop.workorderOperation.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          obj.fluxTypeList.push({
            value: clusterop.workorderOperation.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          obj.fluxTypeList.push({
            value: clusterop.workorderOperation.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
          Selectedlist.push(obj);
        });
      });
      data.SelectedOperationList = Selectedlist;
      data.woID = vm.workorder.woID;
      data.maxAllowOperationNumber = vm.getMaximumOpNumber;
      data.woNumber = vm.workorder.woNumber;
      data.refreshWorkOrderHeaderDetails = vm.refreshWorkOrderHeaderDetails;
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOWOPERATION_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOWOPERATION_MODAL_VIEW,
        ev,
        data).then((response) => {
          if (response) {
            var val = response[0];
            var versionModel = response[1];

            if (val) {
              //vm.masterTemplate = val.masterTemplate;
              if (val.masterTemplate && val.masterTemplate.id && (!vm.workorder.masterTemplateID
                || (vm.workorder.masterTemplateID && val.masterTemplate.id != vm.workorder.masterTemplateID))) {
                vm.workorder.masterTemplateID = val.masterTemplate && val.masterTemplate.id ? val.masterTemplate.id : null;
              }
              vm.workorder.isOperationsVerified = false;
              _.each(val.SelectedOperationList, (op) => { op.selected = false; });
              _SelectedOperationList = vm.SelectedOperationList = val.SelectedOperationList;
              let sentData = {
                isOperationsVerified: false,
                isOperationAvailable: vm.SelectedOperationList && vm.SelectedOperationList.length > 0 ? true : false
              }
              $scope.$emit("operationChanged", sentData);
              vm.getWorkorderOperationList();
              $scope.$emit('bindWorkorderTreeViewMain', { woID: vm.workorder.woID });
            }

            // get updated woVersion from model response and update
            if (versionModel && versionModel.woVersion) {
              vm.workorder.woVersion = versionModel.woVersion;
            }
          }
        }, () => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }


    let checkClusterInProduction = (cluster) => {
      //let clusterOPArr = _.map(cluster.workorderOperationCluster, 'woOPID');
      //let transOPArr = _.map(vm.workorder.workorderTransEmpinout, 'woOPID');
      let inTransObj = false;
      if (cluster && cluster.workorderOperationCluster) {
        inTransObj = _.find(vm.workorder.workorderTransEmpinout, (op) => {
          return _.find(cluster.workorderOperationCluster, (operation) => {
            return operation.woOPID == op.woOPID;
          })
        })
      }
      return inTransObj ? true : false;
    }
    /*
    * Author :  Vaibhav Shah
    * Purpose : show popup add cluster in workorder
    */
    vm.AddClusterToWorkorder = (cluster) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let data = {};
      data.woNumber = (vm.workorder.woNumber ? vm.workorder.woNumber.toUpperCase() : "");
      data.woID = vm.workorder.woID;
      data.cluster = cluster;
      data.InProduction = checkClusterInProduction(cluster);
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_OPERATION_CLUSTER_CONTROLLER,
        WORKORDER.WORKORDER_OPERATION_CLUSTER_VIEW,
        event,
        data).then((res) => {
        }, (res) => {
          vm.getWorkorderClusterList();
          vm.refreshWorkOrderHeaderDetails();
          if (res) {
            vm.workorder.isOperationsVerified = false;
            let sentData = {
              isOperationsVerified: false,
              isOperationAvailable: vm.SelectedOperationList && vm.SelectedOperationList.length > 0 ? true : false
            }
            $scope.$emit("operationChanged", sentData);
          }
        }, (error) => {
          return BaseService.getErrorLog(error);
        });
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : Delete cluster from work order
    */
    vm.DeleteClusterFromWorkorder = (clusterDetails) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let selectedIDs = [];
      if (clusterDetails) {
        selectedIDs.push(clusterDetails.clusterID);
      }
      if (selectedIDs.length > 0) {
        let obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Cluster"),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, "Cluster"),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((res) => {
          if (res) {
            vm.cgBusyLoading = WorkorderClusterFactory.workorder_cluster().delete({
              id: selectedIDs,
            }, (res) => {
              if (res && res.data) {
                if (res.data.TotalCount && res.data.TotalCount > 0) {
                  BaseService.deleteAlertMessage(res.data);
                } else {
                  vm.GetOperationListByWoID();
                  vm.refreshWorkOrderHeaderDetails();
                }
              }

            }, (error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    //check for allow operation to delete or not if in sequence
    let operationAllowedToDeleteFromCluster = (clusterID, opID, woOPID) => {
      //Get cluster details from workorder cluster list
      let objClust = _.find(vm.workorderClusterList, (clust) => {
        return clust.clusterID == clusterID;
      });

      // Get max. and min. operation number
      let clusterOperationList = [];
      let minClusterOpNumber = null;
      let maxClusterOpNumber = null;
      let currentOPNumber = 0;
      if (objClust)
        clusterOperationList = objClust.workorderOperationCluster;
      if (clusterOperationList.length > 0) {
        clusterOperationList = _.sortBy(clusterOperationList, 'opNumber');
        let minOpClusterNumberObj = _.minBy(clusterOperationList, function (opn) {
          return opn.opNumber;
        });
        let maxOpClusterNumberObj = _.maxBy(clusterOperationList, function (opn) {
          return opn.opNumber;
        });
        minClusterOpNumber = minOpClusterNumberObj ? minOpClusterNumberObj.opNumber : 0;
        maxClusterOpNumber = maxOpClusterNumberObj ? maxOpClusterNumberObj.opNumber : 0;
      }

      // check in operation list for in between operation exists or not
      if (clusterOperationList.length > 0) {
        let getSelectedOp = _.find(clusterOperationList, (oprtn) => {
          return oprtn.opID == opID && oprtn.woOPID == woOPID;
        });
        currentOPNumber = getSelectedOp ? getSelectedOp.opNumber : 0;
        if (currentOPNumber > minClusterOpNumber && currentOPNumber < maxClusterOpNumber) {
          showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.DELETE_NOT_ALLOW_SEQU_OPERATION), true);
          return false;
        }
      }
      return true;
    }

    // check operation validation while delete
    //let checkOperationValidationWhileDelete = (list) =>{
    //    //_.each(list.woOPID, (op) => {
    //    //    let currentIndex = _.findIndex(vm.AlloperationList, function (o) { return o.woOPID == op.woOPID; });
    //    //    let currentObj = vm.AlloperationList[currentIndex];
    //    //    // check current delete operation is rework operation 
    //    //    // than previous operation type is rework/inspection, 
    //    //    // if rework than previous of it must be rework/inspection, 
    //    //    // if inspection than next of delete operation must be rework only, 
    //    //    // than only allow to delete

    //    //    //if (currentObj && currentObj.isRework) {
    //    //    //}
    //    //    //if (currentObj && currentObj.operationType.gencCategoryName == GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
    //    //    //}

    //    //    //let nextObj = vm.AlloperationList[currentIndex + 1];
    //    //    //let previousObj = vm.AlloperationList[currentIndex - 1];
    //    //});
    //    //return false;
    //}

    /*
     * Author :  Vaibhav Shah
     * Purpose : Delete operation from operation list for work order
     */
    vm.DeleteOperationFromWorkorder = (opID, type, clusterID, operation, event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      if (vm.checkOperationCompleted(operation)) {
        showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.PRODUCTION_STARTED_NOT_ALLOW_TO_CHANGE), true);
        return;
      }
      let title;
      if (clusterID) {
        title = stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_DELETE_CONFIRM, "Operation", " from cluster")
      } else {
        title = stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_DELETE_CONFIRM, "Operation", "");
      }
      let obj = {
        title: title,
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_DETAILS_MESSAGE, "Operation"),
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          let _objList = {};
          _objList.woID = vm.workorder.woID;
          _objList.clusterID = clusterID;
          let opIDs = [];
          let woIDs = [];
          let WoOpIds = [];
          let woOPID;
          if (type == "Multiple") {
            _.each(opID, (item) => {
              opIDs.push(item);
            });
            _.each(operation, (data) => {
              woOPID = data.woOPID;
              WoOpIds.push(woOPID);
            });
          } else {
            if (operation) {
              vm.woOPID = operation.woOPID;
              //else
              //    vm.woOPID = _.first(operation.workorderOperation).woOPID;
              // Check for operation is from cluster
              if (operation.clusterID) {
                // Check for operation allowed to delete from cluster
                if (operationAllowedToDeleteFromCluster(operation.clusterID, opID, vm.woOPID)) {
                  opIDs.push(opID);
                  WoOpIds.push(vm.woOPID);
                }
                else {
                  return false;
                }
              }
              else {
                opIDs.push(opID);
                WoOpIds.push(vm.woOPID);
              }
            }
            else {
              return false;
            }
          }
          _objList.opID = opIDs;
          _objList.woOPID = WoOpIds;
          _objList.isRequiredToRemovedMasterTemplate = (vm.workorder.masterTemplateID && _objList.opID.length == vm.SelectedOperationList.length) ? true : false;
          _objList.isPermanentDelete = angular.copy(CORE.IsPermanentDelete);

          if (vm.workorder.woSubStatus == CORE.WOSTATUS.PUBLISHED) {
            //let resVal = checkOperationValidationWhileDelete(_objList);
            //if (resVal) {
            vm.openWORevisionPopup(function (versionModel) {
              // Added for close revision dialog popup
              if (versionModel && versionModel.isCancelled) {
                return;
              }
              removeOperationFromWorkorder(_objList, opIDs, versionModel);
            }, event);
            //} else {
            //    return false;
            //}
          }
          else {
            removeOperationFromWorkorder(_objList, opIDs);
          }
        }

      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function removeOperationFromWorkorder(_objList, opIDs, versionModel) {
      WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((operation) => {
        if (operation && operation.data) {
          if (operation.data.TotalCount && operation.data.TotalCount > 0) {
            BaseService.deleteAlertMessage(operation.data);
          }
          else {
            if (_objList.isRequiredToRemovedMasterTemplate) {
              vm.workorder.masterTemplateID = null;
            }
            vm.getWorkorderOperationList();
            _.each(opIDs, (op) => {
              _.remove(vm.SelectedOperationList, (o) => { return o.opID == op; });
            });
            _SelectedOperationList = vm.SelectedOperationList;
            vm.SelectAllOp = true;
            vm.SelectAllOperation();

            // Send details change notification using socket.io
            vm.sendNotification(versionModel);
            vm.workorder.isOperationsVerified = false;
            let sentData = {
              isOperationsVerified: false,
              isOperationAvailable: vm.SelectedOperationList && vm.SelectedOperationList.length > 0 ? true : false
            }
            $scope.$emit("operationChanged", sentData);
            $scope.$emit('bindWorkorderTreeViewMain', { woID: vm.workorder.woID });
            if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
              vm.refreshWorkOrderHeaderDetails();
            }
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    $scope.selectedOperationListNoAdded = [];
    $scope.selectedOperationListAdded = [];
    //#region sortable option common for all list
    $scope.sortableOptionOperations = uiSortableMultiSelectionMethods.extendOptions({
      cancel: ".cursor-not-allow",
      placeholder: "beingDragged",
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: (e, ui) => {
      },
      sort: (e, ui) => {
        ui.item.sortable.cancel();
      },
      stop: (e, ui) => {
        let sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          let sourceTarget = ui.item.sortable.source[0];
          let dropTarget = ui.item.sortable.droptarget[0]; // get drop target element

          //Source Cluster
          let _objSourceCluster = sourceTarget.id;
          let _objSourceClusterID = null;
          if (_objSourceCluster.indexOf('_') > -1) {
            _objSourceClusterID = parseInt(_objSourceCluster.split('_')[1]);
          }

          //Target Cluster
          let _objTargetCluster = dropTarget.id;
          let _objTargetClusterID = null;
          if (_objTargetCluster.indexOf('_') > -1) {
            _objTargetClusterID = parseInt(_objTargetCluster.split('_')[1]);
          }

          let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;

          let woClusterID = sourceModel.woClusterID;
          if (_objSourceClusterID != _objTargetClusterID) {
            if (_objTargetClusterID) {
              let dropTargetModelList = ui.item.sortable.droptargetModel;
              _.each(dropTargetModelList, (o, $index) => {
                o.displayOrder = $index + 1;
              });
              let obj = {
                woClusterID: woClusterID,
                clusterID: _objTargetClusterID,
                opID: sourceModel ? sourceModel.opID : null,
                woOPID: sourceModel ? sourceModel.woOPID : null,
                displayOrder: sourceModel ? sourceModel.displayOrder : null,
                opName: sourceModel ? sourceModel.opName : 0,
                opNumber: sourceModel ? sourceModel.opNumber : 0,
                operationTypeID: sourceModel ? sourceModel.operationTypeID : 0,
                isRework: sourceModel ? sourceModel.isRework : 0,
                qtyControl: sourceModel ? sourceModel.qtyControl : 0,
                isIssueQty: sourceModel ? sourceModel.isIssueQty : 0,
                isMoveToStock: sourceModel ? sourceModel.isMoveToStock : 0,
                isPlacementTracking: sourceModel ? sourceModel.isPlacementTracking : 0,
                isTrackBySerialNo: sourceModel ? sourceModel.isTrackBySerialNo : 0,
                isAllowFinalSerialMapping: sourceModel ? sourceModel.isAllowFinalSerialMapping : 0,
                isLoopOperation: sourceModel ? sourceModel.isLoopOperation : 0,
                refLoopWOOPID: sourceModel ? sourceModel.refLoopWOOPID : 0,
                isPreProgrammingComponent: sourceModel ? sourceModel.isPreProgrammingComponent : 0
              }
              if (SourceDivAdded != DestinationDivAdded) {
                // Check Selected operation is valid to move in cluster
                checkSelectedOperationValid($scope.selectedOperationListNoAdded, obj, true);
              }
              else {
                // Check Selected operation is valid to move in cluster
                checkSelectedOperationValid($scope.selectedOperationListAdded, obj, true);
              }
            } else {
              //Check delete operation from cluster
              let obj = {};
              obj.woClusterID = woClusterID;
              obj.opID = sourceModel ? sourceModel.opID : null,
                obj.woOPID = sourceModel ? sourceModel.woOPID : null,
                obj.clusterID = sourceModel ? sourceModel.clusterID : null,
                removeOperationFromCluster($scope, obj);
            }
            UnSelectAllOperation();
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion

    //#region reset value of selected element
    let ResetSelectedOperation = () => {
      $scope.selectedOperationListNoAdded = [];
      $scope.selectedOperationListAdded = [];
      //$scope.selectAnyNoAdded = false;
      //$scope.selectAnyAdded = false;
    }
    //#endregion

    ////#region check for selected operation
    //let checkSelectAllFlag = () => {
    //    $scope.selectAnyNoAdded = $scope.selectedOperationListNoAdded.length > 0 ? true : false;
    //    $scope.selectAnyAdded = $scope.selectedOperationListAdded.length > 0 ? true : false;
    //}
    ////#endregion

    //#region unselect all operation list
    let UnSelectAllOperation = () => {
      angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      _.each(vm.workorderClusterList, (item) => {
        angular.element('[ui-sortable]#operationAddedList_' + item.clusterID + ' .dragsortable').removeClass('ui-sortable-selected');
      });
      ResetSelectedOperation();
    }
    //#endregion

    //#region unselect single operation list
    let UnSelectOperation = (unSelectFrom) => {
      if (unSelectFrom == "NoAdded") {
        angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        //vm.SelectAllOp = false;
      }
      else {
        _.each(vm.workorderClusterList, (item) => {
          angular.element('[ui-sortable]#operationAddedList_' + item.clusterID + ' .dragsortable').removeClass('ui-sortable-selected');
        });
      }
      ResetSelectedOperation();
    }
    //#endregion


    //#region  set item selectable
    let setOperationClusterSelectable = () => {
      _.each(vm.workorderClusterList, (item) => {
        angular.element('[ui-sortable]#operationAddedList_' + item.clusterID).on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectOperation("NoAdded");
          var $this = $(this);
          var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();

          let _objTargetClusterID = null;
          let currentTargetId = e.currentTarget.id;
          if (currentTargetId.indexOf('_') > -1) {
            _objTargetClusterID = parseInt(currentTargetId.split('_')[1]);
          }
          let selectedCluster = _.find(vm.workorderClusterList, (item) => {
            return item.clusterID == _objTargetClusterID;
          });
          if (selectedCluster) {
            $scope.selectedOperationListAdded = _.map(selectedItemIndexes, function (i) {
              return selectedCluster.workorderOperationCluster[i];
            });
          }
          vm.SelectAllOp = false;
          //checkSelectAllFlag();
          $scope.$applyAsync();
        });
      });
    }

    let SetOperationSelectable = () => {
      angular.element('[ui-sortable]#operationNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectOperation("Added");
        var $this = $(this);
        var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedOperationListNoAdded = _.map(selectedItemIndexes, function (i) {
          return vm.SelectedOperationList[i];
        });
        vm.selectedOpList = _.map($scope.selectedOperationListNoAdded, 'opID');
        if (vm.selectedOpList.length == vm.SelectedOperationList.length) {
          vm.SelectAllOp = true;
        } else {
          vm.SelectAllOp = false;
        }
        //checkSelectAllFlag();
        $scope.$applyAsync();
      });
    }
    //#endregion

    //#region for destroy selection
    let DestroyOperationSelection = () => {
      angular.element('[ui-sortable]#operationNoAddedList').off('ui-sortable-selectionschanged');
      _.each(vm.workorderClusterList, (item) => {
        angular.element('[ui-sortable]#operationAddedList_' + item.clusterID).off('ui-sortable-selectionschanged');
      });
    }

    //update on validated from header
    let operationVerified = $scope.$on("operationVerifiedMain", function (evt, data) {
      if (data) {
        vm.workorder.isOperationsVerified = data;
      }
    });

    let DestroyAllSelection = () => {
      DestroyOperationSelection();
    }
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', (e) => {
      DestroyAllSelection();
      operationVerified();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    //#endregion


    /*
    * Author :  Vaibhav Shah
    * Purpose : Search Operation from Selected Operation List
    */
    vm.SearchSelectedOperation = (list, searchText) => {
      if (!searchText) {
        vm.SearchSelectedOperationTxt = null;
        vm.SelectedOperationList = _SelectedOperationList;
        vm.FilterSelectedOperation = true;
        vm.SelectAllOp = false;
        return;
      }

      //vm.SelectedOperationList = $filter('filter')(_SelectedOperationList, { opName: searchText });
      vm.SelectedOperationList = _.filter(_SelectedOperationList, (itemOP) => {
        return itemOP ? itemOP.opFullName.toUpperCase().indexOf(searchText.toUpperCase()) > -1 : false;
      })
      vm.FilterSelectedOperation = vm.SelectedOperationList.length > 0;
    }

    /*
    * Author :  Vaibhav Shah
    * Purpose : Get Selected Operation Count
    */
    //vm.getSelectedOperationCount = () => {
    //    let objList = [];
    //    objList = _.filter(vm.SelectedOperationList, (op) => { return op.selected == true; });
    //    vm.selectedOpList = _.map(objList, 'opID');
    //    return objList.length;
    //}

    /*
    * Author :  Vaibhav Shah
    * Purpose : Select All Operations
    */
    vm.SelectAllOperation = () => {
      vm.SelectAllOp = !vm.SelectAllOp;
      $scope.selectedOperationListNoAdded = vm.selectedOpList = [];
      //if (vm.SelectAllOp) {
      //    _.each(vm.SelectedOperationList, (op) => { op.selected = true; });
      //    _SelectedOperationList = vm.SelectedOperationList;
      //}
      //else {
      //    _.each(vm.SelectedOperationList, (op) => { op.selected = false; });
      //    _SelectedOperationList = vm.SelectedOperationList;
      //}
      UnSelectOperation("Added");
      if (vm.SelectAllOp) {
        angular.element('[ui-sortable]#operationNoAddedList .dragsortable').addClass('ui-sortable-selected');
        $scope.selectedOperationListNoAdded = angular.copy(vm.SelectedOperationList);
        vm.selectedOpList = _.map($scope.selectedOperationListNoAdded, 'opID');
      }
      else {
        angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
    }





    vm.editOperation = (operation) => {
      let woOPID;
      if (operation) {
        woOPID = operation.woOPID;
      }
      $state.go(WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE, { woOPID: woOPID });
    };

    // Don't Remove this code - For Start/Stop Work Order Operation
    ///*Onclick of start workorder operation*/
    vm.toggleWorkorderOperation = (operation, ev) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      let opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, operation.opName, operation.opNumber);
      if (vm.enableToggleOperation) {
        let obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.START_WORKORDER_OPERATION_CONFIRM, opFullName),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        const operationStatus = {
          woOPID: operation.woOPID,
          woID: operation.woID,
          opID: operation.opID,
          woTransOpHoldUnholdId: operation.workorderTransOperationHoldUnhold ? operation.workorderTransOperationHoldUnhold.woTransOpHoldUnholdId : null,
          unHoldEmployeeId: vm.employeeDetails.id,
          holdEmployeeId: vm.employeeDetails.id,
          woNumber: vm.workorder.woNumber,
          opName: operation.opName,
          opNumber: operation.opNumber ? operation.opNumber.toFixed(3) : (0).toFixed(3)
        };

        if (operation.isStopOperation) {
          //operationStatus.isStopOperation = !operation.isStopOperation;
          //DialogFactory.confirmDiolog(obj).then((res) => {
          //    if (res && operation.woOPID) {
          //        vm.cgBusyLoading = WorkorderOperationFactory.stopWOOperation().update({
          //            id: operation.woOPID,
          //        }, operationStatus, (res) => {
          //            operation.workorderTransOperationHoldUnhold = undefined;
          //            operation.isStopOperation = operationStatus.isStopOperation;
          //        }, (error) => {
          //            return BaseService.getErrorLog(error);
          //        });
          //    }
          //}, (cancel) => {
          //}).catch((error) => {
          //    return BaseService.getErrorLog(error);
          //});
        }
        else {
          //operationStatus.isStopOperation = !operation.isStopOperation;
          //DialogFactory.dialogService(
          //                            TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_CONTROLLER,
          //                            TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_VIEW,
          //                            ev,
          //                            operationStatus).then((response) => {
          //                                operation.workorderTransOperationHoldUnhold = response;      // Bind Model with Added history detail of Halt Resume operation
          //                                operation.isStopOperation = operationStatus.isStopOperation;
          //                            }, (err) => {
          //                                return BaseService.getErrorLog(err);
          //                            });
        }
        operationStatus.isStopOperation = !operation.isStopOperation;
        DialogFactory.dialogService(
          TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_CONTROLLER,
          TRAVELER.OPERATION_HOLD_UNHOLD_MODEL_VIEW,
          ev,
          operationStatus).then((response) => {
            operation.workorderTransOperationHoldUnhold = response;      // Bind Model with Added history detail of Halt Resume operation
            operation.isStopOperation = operationStatus.isStopOperation;
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
      else {
        showOperationAlert(stringFormat(CORE.MESSAGE_CONSTANT.OPERATION_STOPPED, convertToThreeDecimal(operation.opNumber)), true);
        return;
      }
    }

    // Don't Remove this code - For Start/Stop Work Order Operation
    $timeout(() => {
      vm.GetOperationListByWoID();
    }, _configSelectListTimeout);

    // check all operation verified or not
    //code removed as verify button moved to  header

    // open Operation Configuration list popup
    vm.GetOperationConfigurationList = (ev) => {
      let obj = {
        woID: vm.workorder.woID,
        woStatus: vm.workorder.woStatus,
        woNumber: vm.workorder.woNumber,
        woVersion: vm.workorder.woVersion
      }
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_OPERATION_CCONFIGURATION_CONTROLLER,
        WORKORDER.WORKORDER_OPERATION_CCONFIGURATION_VIEW,
        ev,
        obj).then((response) => {
        }, (cancel) => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }


    /*Move to work order operation detail page*/
    vm.goToWorkorderOperationDetails = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
    };

    /* Show Description*/
    vm.showDescription = (operation, ev) => {
      const obj = {
        title: 'Operation',
        description: operation.shortDescription,
        name: operation.opFullName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
  };
})();

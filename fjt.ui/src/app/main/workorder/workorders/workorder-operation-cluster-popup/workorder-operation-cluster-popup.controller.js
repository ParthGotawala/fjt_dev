(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkOrderOperationClusterController', WorkOrderOperationClusterController);

  /** @ngInject */
  function WorkOrderOperationClusterController($mdDialog, $filter, data, CORE, WorkorderClusterFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.woNumber = data ? (data.woNumber ? data.woNumber : null) : null;
    vm.woID = data ? (data.woID ? data.woID : null) : null;
    vm.clusterDetails = data ? (data.cluster ? angular.copy(data.cluster) : {}) : {};
    vm.InProduction = data ? (data.InProduction) : false;
    vm.clusterDetails.isParellelOperation = vm.clusterDetails.isParellelOperation ? vm.clusterDetails.isParellelOperation : false;
    let oldClusterName = '';

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    }

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.woNumber, displayOrder: 1,
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      }
    ];


    let showOperationAlert = (message, multiple, title) => {
      var model = {
        title: title ? title : CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: message,
        multiple: true
      };
      DialogFactory.alertDialog(model);
    }

    // On Change of ClusterType
    vm.OnClusterTypeChange = (Value) => {
      let errorMsg = [];
      if (vm.clusterDetails.isParellelOperation) {
        // check cluster is parallel and all operation type in cluster is same or not
        let resultClusterObjList = _.uniqBy(vm.clusterDetails.workorderOperationCluster, 'operationTypeID');
        if (resultClusterObjList.length > 1) {
          errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.ALLOW_ONLY_SAME_OPERATION));
        }

        // check for any operation is rework operation in selected operation
        let findReworkOpInCluster = _.find(vm.clusterDetails.workorderOperationCluster, (op) => { return op.isRework == true });
        if (findReworkOpInCluster) {
          errorMsg.push(stringFormat(CORE.MESSAGE_CONSTANT.CURRENT_REWORK_NOT_ALLOW, operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, cfindReworkOpInCluster.opName, findReworkOpInCluster.opNumber)));
        }
        if (errorMsg.length > 0) {
          showOperationAlert(errorMsg.join('<br/>'), true);
          vm.clusterDetails.isParellelOperation = false;
          return;
        }
      }
    }

    vm.saveClusterDetails = () => {

      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.clusterDetailsForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.clusterDetailsForm.$dirty) {
        const clusterDetailsInfo = {
          clusterID: vm.clusterDetails.clusterID,
          woID: vm.woID,
          clusterName: vm.clusterDetails.clusterName,
          isParellelOperation: vm.clusterDetails.isParellelOperation,
          displayOrder: vm.clusterDetails.displayOrder,
          woNumber: vm.woNumber
        }
        if (vm.clusterDetails.clusterID && vm.woID) {
          vm.cgBusyLoading = WorkorderClusterFactory.workorder_cluster().update({
            id: vm.clusterDetails.clusterID,
          }, clusterDetailsInfo).$promise.then((res) => {
            if (res.data) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.cancel(res.data);
            }
            vm.saveDisable = false;
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else if (!vm.clusterDetails.clusterID && vm.woID) {
          vm.cgBusyLoading = WorkorderClusterFactory.workorder_cluster().save(clusterDetailsInfo).$promise.then((res) => {
            if (res.data && res.data.clusterID) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.cancel();
            }
            vm.saveDisable = false;
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          vm.saveDisable = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel();
        }
      }
      else {
        vm.saveDisable = false;
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // Function call on cluster name blue event and check cluster name exist and ask for confirmation
    vm.checkDuplicateClusterName = () => {
      if (oldClusterName != vm.clusterDetails.clusterName) {
        if (vm.clusterDetailsForm && vm.clusterDetailsForm.clusterName.$dirty && vm.clusterDetails.clusterName) {
          vm.cgBusyLoading = WorkorderClusterFactory.checkDuplicateWOClusterName().save({
            clusterID: vm.clusterDetails.clusterID,
            clusterName: vm.clusterDetails.clusterName,
            woID: vm.woID
          }).$promise.then((res) => {
            oldClusterName = angular.copy(vm.clusterDetails.clusterName);
            if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateClusterName) {
              oldClusterName = '';
              let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
              messageContent.message = stringFormat(messageContent.message, vm.clusterDetails.clusterName);
              let obj = {
                messageContent: messageContent,
              };
              vm.clusterDetails.clusterName = null;
              obj.multiple = true;
              DialogFactory.messageAlertDialog(obj).then((okRes) => {
                setFocusByName("clusterName");
              });
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
    }

    // to check form dirty
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.clusterDetailsForm);
      if (isdirty) {
        let data = {
          form: vm.clusterDetailsForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide();
      }
    };
    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.clusterDetailsForm);
    });
  }

})();

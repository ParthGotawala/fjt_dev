(function () {
  'use strict';

  angular.module('app.core').controller('QuantityConfirmationController', QuantityConfirmationController);
  function QuantityConfirmationController(data, $mdDialog, TaskConfirmationFactory, $filter, CORE, DialogFactory, BaseService) {
    const vm = this;
    vm.EmptyMesssage = CORE.EMPTYSTATE.QTY_CONFIRMATION_LIST;
    vm.ConfirmationType = CORE.woQtyApprovalConfirmationTypes;
    vm.type = data.confirmationType;
    if (vm.type === vm.ConfirmationType.BuildQtyConfirmation) {
      vm.titleText = 'Build Quantity Change History';
    } else if (vm.type === vm.ConfirmationType.WOStatusChangeRequest) {
      vm.titleText = 'Work Order Status Change History';
    } else if (vm.type === vm.ConfirmationType.ReasonChangeRequest) {
      vm.titleText = 'Reason List';
    } else {
      vm.titleText = 'Change Approval Information';
    }

    vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, vm.type == vm.ConfirmationType.ReasonChangeRequest ? "Reason" : "Confirmation");

    vm.close = () => {
      $mdDialog.cancel();
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    }
    //go to assy list 
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    }

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.refId);
      return false;
    }

    vm.headerdata = [
      {
        label: (vm.type === vm.ConfirmationType.ReasonChangeRequest) ? CORE.LabelConstant.MFG.PID : CORE.LabelConstant.Assembly.ID,
        value: data.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: data.rohsIcon,
          imgDetail: data.rohsName
        }
      },
      { label: CORE.LabelConstant.Assembly.NickName, value: data.nickName, displayOrder: 2 },
      { label: CORE.LabelConstant.Workorder.WO, value: data.woNumber, displayOrder: 3, labelLinkFn: vm.goToWorkorderList, valueLinkFn: vm.goToWorkorderDetails },
      { label: CORE.LabelConstant.Workorder.Version, value: data.woVersion, displayOrder: 4 }
    ];
    //  Add header of Feeder# in case of reason list
    if (vm.type === vm.ConfirmationType.ReasonChangeRequest) {
      vm.headerdata.push({ label: CORE.LabelConstant.Traveler.Feeder, value: data.feederLocation, displayOrder: 5 });
    }

    if (data && data.confirmationType && data.refTablename && data.refId) {
      vm.cgBusyLoading = TaskConfirmationFactory.getTaskConfirmationlist(data).query().$promise.then((res) => {
        vm.TaskconfirmationList = res.data.taskconfirmationlist;
        if (vm.TaskconfirmationList.length > 0) {
          // _.each(vm.TaskconfirmationList, (item) => {
          //   item.createdAt = $filter('date')(item.createdAt, _dateTimeFullTimeDisplayFormat)
          // });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    else {
      var model = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: CORE.MESSAGE_CONSTANT.SOMTHING_WRONG,
        multiple: true
      };
      DialogFactory.alertDialog(model);
      $mdDialog.cancel();
    }

    /* Show Description*/
    vm.viewReason = (object, ev) => {
      if (object && object.reason) {
        let obj = {
          title: vm.type == vm.ConfirmationType.ReasonChangeRequest ? 'Reason' : 'Confirmation Approval Reason',
          description: object.reason,
          name: ''
        }
        let data = obj;
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.loadData();
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
      else {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.NO_DETAILS_FOUND,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      }
    }
  }
})();

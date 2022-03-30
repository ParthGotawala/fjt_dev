(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('feederUmidList', feederUmidList);

  /** @ngInject */
  function feederUmidList(CORE, BaseService, DialogFactory, USER, TRANSACTION, ReceivingMaterialFactory, WarehouseBinFactory, socketConnectionService, $rootScope, PRICING, MasterFactory, NotificationFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        filterList: "=",
        sumObj: "=",
        rowField: "=",
        onClickSelect: "&",
        isSearch: "=?",
        isSelectedList: "=",
        isSelected: "=?",
        isAllocateUmid: "=?"
      },
      templateUrl: 'app/directives/custom/feeder-umid-list/feeder-umid-list.html',
      controller: feederUmidLstCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function feederUmidLstCtrl($scope) {
      var vm = this;
      vm.InoAuto = CORE.InoautoCart;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      $scope.clickButton = false;
      vm.isSearch = $scope.isSearch;
      vm.isSelected = $scope.isSelected;
      $scope.LabelConstant = CORE.LabelConstant;
      $scope.loginUser = BaseService.loginUser;
      $scope.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      $scope.filterList = _.orderBy($scope.filterList, ['dateCode'], ['asc']);
      vm.DepartmentType = CORE.ParentWarehouseType;
      $scope.changeCheckbox = () => {
        if (_.find($scope.filterList, (fltr) => { return !fltr.isChecked && fltr.warehouseCart == vm.InoAuto })) {
          vm.isCheckedAll = false;
        }
        else {
          vm.isCheckedAll = true;
        }
      }

      //get row interval detail
      vm.cgBusyLoading = MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [TRANSACTION.AUDITPAGE.SearchRequestTimeout] }).$promise.then((response) => {
        if (response.data) {
          _.each(response.data, (item) => {
            switch (item.key) {
              case TRANSACTION.AUDITPAGE.SearchRequestTimeout:
                vm.timeout = item.values ? parseInt(item.values) : 0;
                break;
            }
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });

      //apply to all checkbox
      $scope.applyAll = (isChecked) => {
        vm.isCheckedAll = isChecked;
        _.map($scope.filterList, updateUMIDList);
      }
      //common select function for different types of directive call
      let commonCallSelect = () => {
        if (vm.isSelected) {
          $scope.applyAll(true);
        } else {
          //need to do default checkbox true for first
          var firstFeeder = _.find($scope.filterList, (item) => { return item.warehouseCart == vm.InoAuto });
          if (firstFeeder) {
            firstFeeder.isChecked = true;
            $scope.changeCheckbox();
          }
        }
      }
      commonCallSelect();
      $scope.$watch('filterList', function (newValue, oldvalue) {
        if (newValue != oldvalue) {
          commonCallSelect();
        }
      });
      vm.allocatedKit = (rowData) => {
        let data = rowData;
        data.refUMIDId = data.id;
        DialogFactory.dialogService(
          TRANSACTION.ALLOCATED_KIT_CONTROLLER,
          TRANSACTION.ALLOCATED_KIT_VIEW,
          event,
          data).then(() => {
          }, (data) => {
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }

      //search by umid api call from here on changeof checkbox
      $scope.searchbyUMID = (ev) => {
        $scope.event = ev;
        var dept = getLocalStorageValue($scope.loginUser.employee.id);
        $scope.selectedList = _.filter($scope.filterList, (fltr) => { return fltr.isChecked });
        if (_.find($scope.selectedList, (selectDept) => { return selectDept.departmentName != dept.department.Name }) && !$scope.isComapnyLevel) {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_MISMATCH,
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.INOAUTO_DEPARTMENT_VALIDATION, dept.department.Name),
            multiple: true
          };
          DialogFactory.alertDialog(model);
          $scope.clickButton = false;
          return;
        } else {
          checkColorAvailibility($scope.isComapnyLevel ? 0 : dept.department.ID);
        }
      }
      //umid search
      function funSearchByUMID(departmentID) {
        $scope.transactionID = getGUID();
        $scope.$emit("transferMaterial", $scope.transactionID);
        var objSearchPartUMID = {
          UIDs: _.map($scope.selectedList, 'uid'),
          PromptIndicator: $scope.promptColorDetails.ledColorValue,
          ledColorID: $scope.promptColorDetails.id,
          Priority: 1,
          TimeOut: vm.timeout ? vm.timeout : $scope.TimeOut,
          UserName: $scope.loginUser.username,
          InquiryOnly: 0,
          departmentID: departmentID ? departmentID : null,
          TransactionID: $scope.transactionID,
          Department: departmentID ? $scope.selectedList[0].departmentName : "*",
          ReelBarCode: null
        };
        WarehouseBinFactory.sendRequestToSearchPartByUMID().query(objSearchPartUMID).$promise.then((response) => {
          if (response.status == "FAILED") {
            $scope.showStatus = false;
            $scope.transactionID = null;
            $scope.$emit("transferMaterial", $scope.transactionID);
            $scope.clickButton = false;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });

      }
      //check color availability to prompt in cart
      function checkColorAvailibility(departmentID) {
        ReceivingMaterialFactory.getPromptIndicatorColor().query({
          pcartMfr: CORE.InoautoCart, prefDepartmentID: departmentID
        }).$promise.then((res) => {
          if (res && res.data) {
            $scope.promptColorDetails = res.data.promptColors[0];
            $scope.TimeOut = res.data.defaultTimeout && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
            funSearchByUMID(departmentID);
          } else {
            var model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: CORE.MESSAGE_CONSTANT.PROMPT_ALREADY_USE,
              multiple: true
            };
            DialogFactory.alertDialog(model);
            $scope.showStatus = false;
            $scope.transactionID = null;
            $scope.$emit("transferMaterial", $scope.transactionID);
            $scope.clickButton = false;
            return;
            //color is not available message prompt
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });

      }
      function connectSocket() {
        socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
        socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
        socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });
      function removeSocketListener() {
        socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      }

      $scope.$on('$destroy', function () {
        cancelRequest();
        removeUMIDStatus();
        removeSocketListener();
      });
      // on disconnect socket
      socketConnectionService.on('disconnect', function () {
        // Remove socket listeners
        removeSocketListener();
      });

      function updateForceDeliverRequest(request) {
        if (request.OriginalTransactionID == $scope.transactionID) {
          var objUMID = _.find($scope.filterList, (umid) => { return umid.uid == request.UID });
          if (objUMID) {
            objUMID.ledColorCssClass = null;
            objUMID.ledColorName = null;
            objUMID.inovexStatus = CORE.InoAuto_Search_Status.InTransit;
            objUMID.isTransit = 'Yes';
          }
        }
      }

      function updateUMIDRequest(response) {
        if ($scope.transactionID == response.response.TransactionID && !$scope.showStatus) {
          var selectedPkg = response.response.ChosenPackages;
          var notFoundedPkg = response.response.UIDNotFound;
          var notAvailablePkg = response.response.UnavailablePackages;
          //add color for selected pkg Department
          _.each(selectedPkg, (item) => {
            var objUMID = _.find($scope.filterList, (umid) => { return umid.uid == item.UID });
            if (objUMID) {
              objUMID.ledColorCssClass = $scope.promptColorDetails.ledColorCssClass;
              objUMID.ledColorName = $scope.promptColorDetails.ledColorName;
            }
          });
          _.map(selectedPkg, funChoosen);
          _.map(notFoundedPkg, funNotFound);
          _.map(notAvailablePkg, funNotAvailable);
          $scope.showStatus = true;
          if (selectedPkg.length == 0) {
            var model = {
              title: CORE.MESSAGE_CONSTANT.ERROR,
              multiple: true
            };
            if (notAvailablePkg.length == 0) {
              model.textContent = CORE.MESSAGE_CONSTANT.INOAUTO_UIDNOTFOUND;
            } else {
              model.textContent = CORE.MESSAGE_CONSTANT.INOAUTO_NOTAVAILABLE;
            }
            DialogFactory.alertDialog(model, commonCancelFunction);
            return;
          }
        }
      }

      function funChoosen(row) {
        var Chosen = _.find($scope.filterList, (Chosen) => { return Chosen.uid == row.UID });
        if (Chosen) {
          Chosen.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
        }
      }
      function funNotFound(row) {
        var notFound = _.find($scope.filterList, (notFound) => { return notFound.uid == row });
        if (notFound) {
          notFound.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
        }
      }
      function funNotAvailable(row) {
        var notAvailable = _.find($scope.filterList, (notAvailable) => { return notAvailable.uid == row.UID });
        if (notAvailable) {
          notAvailable.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
        }
      }

      function cancelRequest(isManualCancel) {
        if ($scope.transactionID) {
          var objTrans = {
            TransactionID: $scope.transactionID,
            ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
            ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
          }
          if (isManualCancel) {
            objTrans.isManualCancel = true;
          }
          WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
            if (isManualCancel) {
              commonCancelFunction();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          commonCancelFunction();
        }
      }
      //cancel Request for search by umid
      $scope.cancelSearch = () => {
        cancelRequest();
      }
      //received details for cancel request
      function updateCancelRequestStatus(req) {
        if (req.transactionID == $scope.transactionID && !$scope.open) {
          cancelRequestAlert(req);
        }
      }
      //cancel request
      function cancelRequestAlert(req) {
        commonCancelFunction();
        $scope.open = true;
        let messageContent = null;
        if (req.code == CORE.INO_AUTO_RESPONSE.SUCCESS) {
          NotificationFactory.success(req.message);
          callbackCancel();
          return;
        }
        else if (req.code == CORE.INO_AUTO_RESPONSE.CANCEL) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_MANUALLY);
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_TIMEOUT);
        }
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model, callbackCancel);
        return;
      }

      function commonCancelFunction() {
        _.map($scope.filterList, funUMIDList);
        $scope.showStatus = false;
        $scope.transactionID = null;
        $scope.$emit("transferMaterial", $scope.transactionID);
        $scope.clickButton = false;
      }
      function callbackCancel() {
        $scope.open = false;
      }
      function funUMIDList(row) {
        row.inovexStatus = null;
        row.ledColorCssClass = null;
        row.ledColorName = null;
      }
      //apply to all checkbox
      $scope.applyAll = (isChecked) => {
        vm.isCheckedAll = isChecked;
        _.map($scope.filterList, updateUMIDList);
      }
      function updateUMIDList(row) {
        if (row.warehouseCart == vm.InoAuto)
          row.isChecked = vm.isCheckedAll;
      }
      // Update UMID Records
      let removeUMIDStatus = $rootScope.$on(PRICING.EventName.RemoveUMIDFrmList, function (name, data) {
        var umidStatus = _.find($scope.filterList, (item) => { return item.uid == data.UID });
        if (umidStatus) {
          umidStatus.binName = data.tolocation;
          umidStatus.warehouseName = data.towarehouse;
          umidStatus.departmentName = data.toparentWarehouse;
          umidStatus.isTransit = '';
          funUMIDList(umidStatus);
        }
      });

      $scope.changeEvent = (button, ev) => {
        if (button) {
          $scope.searchbyUMID(ev);
        } else {
          $scope.cancelSearch(ev);
        }
      }

      $scope.checkPartForSearch = () => {
        if (_.find($scope.filterList, (item) => { return item.isChecked == true })) {
          return false;
        } else return true;
      }

      //add record to smart cart
      vm.addToSmartCart = (item) => {
        $scope.isSelectedList.push(item);
        $scope.filterList = _.filter($scope.filterList, (n) => { return n.uid != item.uid });
      }
      //remove record from smart cart
      vm.RemoveCart = (item) => {
        let obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Selected UMID"),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, '', stringFormat("UMID <b>{0}</b>", item.uid)),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((resposne) => {
          if (resposne) {
            $scope.filterList = _.filter($scope.filterList, (n) => { return n.uid != item.uid });
            $scope.$emit('add-feeder', item);
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //get footer allocation total
      vm.getFooterAllocationTotal = () => {
        let sum = 0;
        sum = _.sumBy($scope.filterList, (data) => {
          if (data.convertedUnit)
            return data.convertedUnit;
          else
            return 0;
        });
        return sum;
      }

      //get footer free units total
      vm.getFooterFreeUnitsTotal = () => {
        const sum = _.sumBy($scope.filterList, (data) => {
          if (data.FreeToShare) {
            return data.FreeToShare;
          } else {
            return 0;
          }
        });
        return sum;
      };

      // go to umid list
      vm.goToUMIDList = () => {
        BaseService.goToUMIDList();
      };
      // go to Manage UMID
      vm.goToUMIDDetail = (id) =>  BaseService.goToUMIDDetail(id);
      
      // go to bin list
      vm.goToBinList = () => {
        BaseService.goToBinList();
      };
      // go to Ware House list
      vm.goToWHList = () => {
        BaseService.goToWHList();
      };
    }
  }
})();

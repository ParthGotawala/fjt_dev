(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('smartCartUser', smartCartUser);

  /** @ngInject */
  function smartCartUser(BaseService, ReceivingMaterialFactory, TRANSACTION, WarehouseBinFactory, CORE, $rootScope, DialogFactory) {
    let directive = {
      restrict: 'E',
      replace: false,
      scope: {
        list: '=',
      },
      templateUrl: 'app/directives/custom/smart-cart-user/smart-cart-user.html',
      controller: smartCartUserCtrl,
      controllerAs: 'vm',
      link: function (scope, element, attrs) {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function smartCartUserCtrl($scope, $element, $attrs, $filter) {
      let vm = this;
      vm.CORE = CORE;
      vm.LabelConstant = CORE.LabelConstant;
      vm.loginUser = BaseService.loginUser;
      vm.isShowUserStatus = _.find(vm.loginUser.featurePageDetail, (item) => { return item.featureName == CORE.ROLE_ACCESS.SmartCartUser });
      vm.inovaxeStatus = CORE.InovaxeStatus;

      vm.offlinesmartcarts = 0;

      //get assign color details
      vm.getAssignColors = () => {
        vm.isProgress = true;
        vm.assignColorDetails = [];
        ReceivingMaterialFactory.getAssignColorToUsers().query({ pcartMfr: CORE.InoautoCart }).$promise.then((res) => {
          if (res && res.data) {
            vm.isProgress = false;
            vm.assignColorDetails = res.data.assignColors;
            vm.status = CORE.InovaxeStatus[2].id;
            if (Array.isArray(res.data.serverStatus) && res.data.serverStatus.length) {
              vm.status = res.data.serverStatus[0].values;
            }
            _.each(vm.assignColorDetails, (item) => {
              item.requestMessage = JSON.parse(item.requestMessage);
              if (item.messageType == CORE.InoAuto_Request_Code.CheckinRequest) {
                item.side = item.requestMessage.TowerSide.length == 2 ? (TRANSACTION.Warehouse_Side.B.value) : (item.requestMessage.TowerSide.length == 1) && item.requestMessage.TowerSide[0].Side == TRANSACTION.Warehouse_Side.L.key ? TRANSACTION.Warehouse_Side.R.value : TRANSACTION.Warehouse_Side.L.value
              }
              vm.startTimer(item);
            });
            vm.colorList = res.data.colorsList;
            if (res.data.unauthorize && res.data.unauthorize.length > 0 && res.data.unauthorize[0].unauthorizeCount > 0) {
              vm.assignColorDetails.push(...res.data.unauthorize);
            }
            vm.offlinesmartcarts = (res.data.offlinesmartcarts && res.data.offlinesmartcarts.length > 0) ? res.data.offlinesmartcarts[0].count : 0;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      /* Start Timer after checkin start */
      vm.startTimer = (data) => {
        data.currentTimerDiff = "";
        data.activityStartTime = ((parseInt(data.requestMessage.TimeOut)) + _configAdditionalTimeout) - data.activityStartTime;
        data.tickActivity = setInterval(() => {
          data.activityStartTime = data.activityStartTime - 1;
          data.currentTimerDiff = secondsToTime(data.activityStartTime, true);
          if (data.activityStartTime == 0) {
            data.activityStartTime = (parseInt(data.requestMessage.TimeOut)) + _configAdditionalTimeout;
            clearInterval(data.tickActivity);
          }
        }, _configSecondTimeout);
      }

      //cancel request for checked in wh on page leave.
      vm.cancelRequest = (item) => {
          var objTrans = {
            TransactionID: item.transactionID,
            ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
            ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message,
            isRemove: item.activityStartTime < 0 ? true : false
          }
          WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
      }

      //go to smart cart page
      vm.gotoSmartCartWarehouseList = () => {
        BaseService.goToSmartCartWHList();
      }

      //go to unauthorize page
      vm.gotoUnauthorizePage = () => {
        BaseService.goToUnauthorizeRequestList();
      }

      //set pick color by user in db
      vm.pickColor = (item) => {
        if (item) {
          if (item.pickUserID && vm.loginUser.userid != item.pickUserID) {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COLOR_PICKED_USER_CONFIRM);
            messageContent.message = stringFormat(messageContent.message, item.ledColorName, item.pickuserName);
            let obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                setPickColorforUser(item);
              }
            }, (cancel) => {
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          } else if (!item.pickUserID) {
            setPickColorforUser(item);
          } else if (item.pickUserID && vm.loginUser.userid == item.pickUserID) {
            setDropColorforUser();
          }
        }
      }
      // call api to drop color for user
      let setDropColorforUser = () => {
        var objTrans = {
          TransactionID: null,
          id: null,
          userID: vm.loginUser.userid,
          userName: null,
          ledColorName: null,
          ledColorCssClass: null,
          searchUserName: null
        }
        WarehouseBinFactory.setDropUserDeatil().query(objTrans).$promise.then(() => {
          $rootScope.$broadcast('setTransactionID', { transactionID: null, isOpen: false });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      // call api to pick color for user
      let setPickColorforUser = (item) => {
        var objTrans = {
          TransactionID: item.transactionID,
          id: item.id,
          userID: vm.loginUser.userid,
          userName: vm.loginUser.username,
          ledColorName: item.ledColorName,
          ledColorCssClass: item.ledColorCssClass,
          searchUserName: item.userName
        }
        WarehouseBinFactory.setPickUserDeatil().query(objTrans).$promise.then(() => {
          $rootScope.$broadcast('setTransactionID', { transactionID: item.transactionID, isOpen: true });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
  }
})();

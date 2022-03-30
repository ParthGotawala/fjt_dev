(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('BOMActivityStartedAssemblyListPopupController', BOMActivityStartedAssemblyListPopupController);

  /** @ngInject */
  function BOMActivityStartedAssemblyListPopupController($scope, $mdDialog, CORE, USER, data, BaseService, DialogFactory, BOMFactory, TRANSACTION) {
    const vm = this;
    vm.partList = data;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.loginUser = BaseService.loginUser;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.actionType = TRANSACTION.StartStopActivityActionType;
    vm.validationMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PART_UPDATE_VALIDATION_DUE_TO_BOM_ACTIVITY_STARTED);

    if (vm.partList && vm.partList.length > 0) {
      _.map(vm.partList, (data) => {
        data.imageURL = BaseService.getPartMasterImageURL(data.documentPath, data.imageURL);
        data.mfgFullName = stringFormat('({0}) {1}', data.mfgCode, data.mfgName);
      });
      startBOMActivityTimer();
    }

    //Start BOM Activity Timer to update running time
    function startBOMActivityTimer() {
      if (vm.bomActivityTimer) {
        clearInterval(vm.bomActivityTimer);
      }
      vm.bomActivityTimer = setInterval(() => {
        _.each(vm.partList, (item) => {
          if (item.isActivityStart) {
            item.activityStartTime = item.activityStartTime + 1;
            item.currentTimerDiff = secondsToTime(item.activityStartTime, true);
          }
          else {
            item.currentTimerDiff = '';
          }
        });
      }, _configSecondTimeout);
    };

    // stop BOM activity
    vm.stopBOMActivity = (row) => {
      if (vm.loginUser.userid === row.activityStartBy || vm.loginUser.isUserSuperAdmin) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_FROM_RFQ_LIST_MESSAGE);
        if (vm.loginUser.userid === row.activityStartBy) {
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5">1</td><td class="border-bottom padding-5">' + row.PIDCode + '</td></tr>';

          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, message);
        }
        if (vm.loginUser.userid !== row.activityStartBy && vm.loginUser.isUserSuperAdmin) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5">1</td><td class="border-bottom padding-5">' + row.PIDCode + '</td><td class="border-bottom padding-5">' + row.activityStartedByUserName + '</td></tr>';
          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, row.activityStartedByUserName, message);
        }
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const dataObj = {
              refTransID: row.id,
              isActivityStart: false,
              transactionType: vm.transactionType[0].id,
              actionType: vm.actionType[0].id
            };
            vm.isStartAndStopRequestFromThisTab = true;
            vm.cgBusyLoading = BOMFactory.startStopBOMActivity().save(dataObj).$promise.then((response) => {
              if (response && response.data) {
                row.isActivityStart = false;
                row.currentTimerDiff = '';
              }
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_DIFFERENT_USER_STOP_MESSAGE
        };

        DialogFactory.messageAlertDialog(alertModel).then(() => {
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // stop BOM activity
    vm.stopSelectedBOMActivity = () => {
      if (!vm.disableMultiStopActivityclick) {
        vm.disableMultiStopActivityclick = true;
        const selectedBOM = _.filter(vm.partList, (x) => x.isChecked);

        const messageContent = angular.copy(selectedBOM.length > 1 ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.MULTI_BOM_ACTIVITY_STOP_FROM_PART_MASTER_MESSAGE : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_FROM_RFQ_LIST_MESSAGE);
        const subMessage = [];
        let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th></tr></thead><tbody>{0}</tbody></table>';
        _.each(selectedBOM, (item, index) => {
          subMessage.push('<tr><td class="border-bottom padding-5">' + (index + 1) + '</td><td class="border-bottom padding-5">' + item.PIDCode + '</td></tr>');
        });
        message = stringFormat(message, subMessage.join(''));
        messageContent.message = stringFormat(messageContent.message, message);

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const dataObj = {
              partIDs: _.map(selectedBOM, 'id'),
              isActivityStart: false
            };
            vm.isStartAndStopRequestFromThisTab = true;
            vm.cgBusyLoading = BOMFactory.stopMultipleBOMActivity().save(dataObj).$promise.then((response) => {
              if (response && response.data) {
                _.each(response.data, (objPart) => {
                  const partsobj = _.find(vm.partList, (x) => x.id === objPart.partID);
                  if (partsobj) {
                    partsobj.isActivityStart = false;
                    partsobj.currentTimerDiff = '';
                    partsobj.isChecked = false;
                  }
                });
              }
              vm.disableMultiStopActivityclick = false;
            }).catch((error) => {
              vm.disableMultiStopActivityclick = false;
              BaseService.getErrorLog(error);
            });
          } else {
            vm.disableMultiStopActivityclick = false;
          }
        }, () => {
          vm.disableMultiStopActivityclick = false;
        }).catch((error) => {
          vm.disableMultiStopActivityclick = false;
          BaseService.getErrorLog(error);
        });
      }
    };

    vm.checkSelectdBOM = () => {
      const selectedBOM = _.filter(vm.partList, (x) => x.isChecked);
      vm.disableMultiStopActivity = true;
      if (selectedBOM.length > 0) {
        vm.disableMultiStopActivity = false;
        return true;
      }
    };

    vm.cancel = () => {
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel();
    };

    vm.continue = () => {
      $mdDialog.hide({ continueSave: true });
    };
    $scope.$on('$destroy', () => {
      if (vm.bomActivityTimer) {
        clearInterval(vm.bomActivityTimer);
      }
    });

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.BOMActivityStartedAssemblyForm];
    });
  }
})();

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('travelerWoOpExpirePart', travelerWoOpExpirePart);

    /** @ngInject */
    function travelerWoOpExpirePart() {
        var directive = {
            restrict: 'E',
            scope: {
                woOpId: '=',
                configurationOptions: '=?'
            },
            templateUrl: 'app/directives/custom/traveler-wo-op-expire-part/traveler-wo-op-expire-part.html',
            controller: travelerWoOpExpirePartCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function travelerWoOpExpirePartCtrl($scope, BaseService, TravelersFactory, CORE, CONFIGURATION, USER, TRAVELER,
                                                $filter, DialogFactory) {
            var vm = this;
            let woOPID = $scope.woOpId;
            vm.dateFormat = _dateDisplayFormat;

            /* Pop-up for view expired and expiring part details (wo op wise)  */
            let retrieveWorkOrderOperationExpirePartDetails = () => {
                let woOPDetails = {
                    woOPID: woOPID,
                    keyNameOfexpireDaysLeft: CONFIGURATION.SETTING.ExpireDaysLeft,
                    showAllParts: $scope.configurationOptions.isCalledFromManualButtonClick ? true : false // show all parts (BOM Kit + WOOP Supplies, Materials and Tools)
                }
                vm.cgBusyLoading = TravelersFactory.getWoOpExpiredExpiringPartDetails().save(woOPDetails).$promise.then((res) => {
                    if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.expirePartList && res.data.expirePartList.length > 0) {
                        let expirePartList = res.data.expirePartList;
                        let rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
                        let currentDate = $filter('date')(new Date(), vm.dateFormat);

                        _.each(expirePartList, (expPartItem) => {
                            expPartItem.displayRohsIcon = rohsImagePath + expPartItem.rohsIcon;
                            let expiryDateOfPart = $filter('date')(expPartItem.expiryDate, vm.dateFormat);
                            if ((new Date(expiryDateOfPart)).setHours(0, 0, 0, 0) <= (new Date(currentDate)).setHours(0, 0, 0, 0)) {
                                expPartItem.currStatus = stringFormat(TRAVELER.PART_EXPIRE.EXPIRED);
                            }
                            else {
                                let dayDiff = date_diff_indays(currentDate, expiryDateOfPart);
                                expPartItem.currStatus = stringFormat(TRAVELER.PART_EXPIRE.EXPIRY_DAY_LEFT, dayDiff);
                            }
                        })

                        let data = {
                            expirePartList: expirePartList,
                            expirePartMessage: TRAVELER.PART_EXPIRE.EXPIRE_PART_DETAILS
                        }
                        //create dummy event for Dialog to follow theme
                        let ev = angular.element.Event('click');

                        DialogFactory.dialogService(
                      TRAVELER.VIEW_EXPIRE_PARTS_MODAL_CONTROLLER,
                      TRAVELER.VIEW_EXPIRE_PARTS_MODAL_VIEW,
                      ev,
                      data).then((data) => {
                      }, (cancel) => {
                      }).catch((error) => {
                          return BaseService.getErrorLog(error);
                      });
                    }
                    else if ($scope.configurationOptions && $scope.configurationOptions.isCalledFromManualButtonClick) {
                        var model = {
                            title: stringFormat(CORE.MESSAGE_CONSTANT.ALERT_HEADER),
                            textContent: TRAVELER.PART_EXPIRE.NO_EXPIRE_PART
                        };
                        DialogFactory.alertDialog(model);
                        return;
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }

            if (woOPID) {
                retrieveWorkOrderOperationExpirePartDetails();
            }


        }
    }
})();

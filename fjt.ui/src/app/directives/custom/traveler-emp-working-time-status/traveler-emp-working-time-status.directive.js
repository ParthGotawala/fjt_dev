(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('travelerEmpWorkingTimeStatus', travelerEmpWorkingTimeStatus);

    /** @ngInject */
    function travelerEmpWorkingTimeStatus() {
        var directive = {
            restrict: 'E',
            scope: {
                woOpId: '=',
                woTransId: '=?'
            },
            templateUrl: 'app/directives/custom/traveler-emp-working-time-status/traveler-emp-working-time-status.html',
            controller: travelerEmpWorkingTimeCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function travelerEmpWorkingTimeCtrl($scope, $timeout, BaseService, WorkorderTransFactory, CORE) {
            var vm = this;
            vm.woOPID = $scope.woOpId;
            let woTransID = $scope.woTransId ? $scope.woTransId : null;
            vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;

            /* get trasveler emp timing status for display check-in time and current spend time */
            let getEmpTimeFlowStatusForTraveler = () => {
                let workorderTransInfo = {
                    woOPID: vm.woOPID,
                    woTransID: woTransID
                }
                vm.cgBusyLoading = WorkorderTransFactory.getTravelerEmpWorkingTimeStatus().save(workorderTransInfo).$promise.then((res) => {
                    if (res && res.data && res.data.timerData) {
                        updateTimerDetails(res.data.timerData, res.data.timerCurrentData);
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }

            if (vm.woOPID) {
                getEmpTimeFlowStatusForTraveler();
            }

            let _setTimeoutProduction;
            /* update timer constantly to show user */
            let updateTimerDetails = (timerData, timerCurrentData) => {
                if (timerData) {
                    vm.timerData = {};
                    vm.timerData = timerData;
                    vm.timerData.EstimTotalProcTimeDisplay = secondsToTime(timerData.EstimTotalProcTime, true);
                    vm.timerData.totalConsumptionDisplay = secondsToTime(timerData.TotalConsumptionTime, true);

                    vm.timerCurrentData = {};
                    if (timerCurrentData) {
                        vm.timerCurrentData = timerCurrentData;
                        // vm.timerCurrentData.EstimTotalProcTimeDisplay = secondsToTime(timerCurrentData.EstimTotalProcTime, true);
                        vm.timerCurrentData.totalConsumptionDisplay = secondsToTime(timerCurrentData.TotalConsumptionTime, true);
                    }
                    vm.stopTimer();
                    vm.startTimer(vm.timerData, vm.timerCurrentData);
                }
            }

            let setTimeoutActivity;
            /* Start Timer after checkin start */
            vm.startTimer = (timerData, timerCurrentData) => {
                vm.currentTimerDiff = "";
                // Set interval time based on employee count per transaction
                vm.tickInterval = timerCurrentData.ActiveEmpCnt;

                // Set interval time based on employee count per employee
                vm.tickIntervalEmployee = timerData.ActiveEmpCnt;

                let tickProduciton = () => {
                    setTimeoutActivity = setInterval(() => {
                        timerData.TotalConsumptionTime = timerData.TotalConsumptionTime + vm.tickIntervalEmployee;
                        timerData.totalConsumptionDisplay = secondsToTime(timerData.TotalConsumptionTime, true);
    
                        timerCurrentData.TotalConsumptionTime = timerCurrentData.TotalConsumptionTime + vm.tickInterval;
                        if (woTransID) {
                            vm.currentTimerDiff = secondsToTime(timerCurrentData.TotalConsumptionTime, true);
                        }
                    }, _configSecondTimeout);
                    // _setTimeoutProduction = $timeout(tickProduciton, _configSecondTimeout);
                }
                // update timer every second
                // _setTimeoutProduction = $timeout(tickProduciton, _configSecondTimeout);
                tickProduciton();
            }

            /* Stop Timer after stop activity */
            vm.stopTimer = () => {
                // $timeout.cancel(_setTimeoutProduction);
                clearInterval(setTimeoutActivity);
            }

        }
    }
})();

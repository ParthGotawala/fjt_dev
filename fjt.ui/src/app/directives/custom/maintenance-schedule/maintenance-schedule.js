(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('maintenanceSchedule', maintenanceSchedule);

    /** @ngInject */
    function maintenanceSchedule(CORE, OPERATION, $state, OperationDataelementFactory, USER, Upload, DialogFactory, $timeout, DataElementTransactionValueFactory, $filter, BaseService) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                taskSchedule: '=?',
                entityId: '=?',
                isData: '='
            },
            templateUrl: 'app/directives/custom/maintenance-schedule/maintenance-schedule.html',
            controller: maintenanceScheduleCtrl,
            controllerAs: 'vm'
        };
        return directive;


        /** @ngInject */
        /**
        * Controller for text-angular define before load directive
        *
        * @param
        */

        function maintenanceScheduleCtrl($scope, $element, $attrs) {
            var vm = this;
            vm.Maintenance_Schedule_RepeatTypeDataValue = CORE.Maintenance_Schedule_RepeatTypeDataValue;
            vm.Maintenance_Schedule_RepeatTypeKey = CORE.Maintenance_Schedule_RepeatTypeKey;
            vm.EquipmentMaintenanceType = CORE.EquipmentMaintenanceType;
            vm.taskSchedule = $scope.taskSchedule;
            vm.EntityIds = CORE.AllEntityIDS;
            vm.EntityId = $scope.entityId;
            if (vm.taskSchedule.length == 0)
                $scope.isData = false;
            /* Open maintenance schedule popup  */
            vm.openSchedulePopup = (ev, repeatsType, itemETS) => {
                if (itemETS.isActive) {
                    let data = {
                        repeatsType: repeatsType,
                        TaskSchedule: itemETS,
                        Iseditable: false
                    }
                    let controller;
                    let view;
                    controller = USER.ADMIN_EQUIPMENT_MAINTENANCESCHEDULE_MODAL_CONTROLLER;
                    view = USER.ADMIN_EQUIPMENT_MAINTENANCESCHEDULE_MODAL_VIEW;
                    DialogFactory.dialogService(
                        controller,
                        view,
                        ev,
                        data).then((val) => {
                        }, (val) => {
                            if (val) {

                            }
                        }, (err) => {
                            return BaseService.getErrorLog(err);
                        });
                }
            }

            /* Open maintenance schedule task document popup  */
            vm.manageScheduleTaskDocument = (eqpTaskID, ev) => {

                let data = {
                    eqpTaskID: eqpTaskID,
                    Isprofile: true,
                }
                let controller;
                let view;
                controller = USER.ADMIN_EQUIPMENT_PREVIEW_TASKDOCUMENTS_MODAL_CONTROLLER;
                view = USER.ADMIN_EQUIPMENT_PREVIEW_TASKDOCUMENTS_MODAL_VIEW;
                DialogFactory.dialogService(
                    controller,
                    view,
                    ev,
                    data).then((val) => {
                    }, (val) => {
                        if (val) {

                        }
                    }, (err) => {
                        return BaseService.getErrorLog(err);
                    });
            }

        }
    }
})();
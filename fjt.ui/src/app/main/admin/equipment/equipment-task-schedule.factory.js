(function () {
    'use strict';

    angular
        .module('app.admin.equipment')
        .factory('EquipmentTaskSchedule', EquipmentTaskSchedule);

    /** @ngInject */
    function EquipmentTaskSchedule($resource, CORE) {
        return {
            equipmentTaskSchedule: (param) =>  $resource(CORE.API_URL + 'equipment_task_schedule/:id', {
                id: '@_id',
            }, {
                update: {
                    method: 'PUT',
                },
            }),
        }
    }
})();
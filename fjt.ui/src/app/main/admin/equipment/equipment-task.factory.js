(function () {
  'use strict';

  angular
    .module('app.admin.equipment')
    .factory('EquipmentTaskFactory', EquipmentTaskFactory);

  /** @ngInject */
  function EquipmentTaskFactory($resource, CORE, $http) {
    return {
      saveEquipmentTask: (transactionDet, FileList) => {
        return $http({
          method: 'POST',
          url: CORE.API_URL + 'equipment_task',
          headers: { 'Content-Type': undefined },
          transformRequest: function (data) {
            var formData = new FormData();
            formData.append("taskDetail", data.taskDetail);
            formData.append("repeatsTypeList", data.repeatsTypeList);
            formData.append("gencFileOwnerType", data.gencFileOwnerType);
            formData.append("eqpID", data.eqpID);
            formData.append("roleID", (data.roleID));

            _.each(data.files, function (obj, index) {
              formData.append(`file[${index}]`, obj);
            });
            return formData;
          },
          data: {
            taskDetail: transactionDet.equipmentTaskInfo.taskDetail,
            repeatsTypeList: transactionDet.equipmentTaskInfo.repeatsTypeList,
            gencFileOwnerType: transactionDet.equipmentTaskInfo.gencFileOwnerType,
            eqpID: transactionDet.equipmentTaskInfo.eqpID,
            roleID: transactionDet.equipmentTaskInfo.roleID,
            files: FileList
          }
        }, (data) => {
          return data.Data;
        }, (e) => {
          return e;
        });
      },

      equipmentTask: (param) => $resource(CORE.API_URL + 'equipment_task/:id/:isPermanentDelete', {
        id: '@_id',
        isPermanentDelete: '@_isPermanentDelete',
      }, {
        update: {
          method: 'PUT',
        },
      }),

      downloadEquipmentTaskDocument: (gencFileID) => $http.get(CORE.API_URL + "downloadEquipmentTaskDocument/" + gencFileID, { responseType: 'arraybuffer' })
        .then((response) => {
          return response;
        }, (error) => {
          return error;
        }),

      removeEquipmentTaskDocument: () => $resource(CORE.API_URL + 'removeEquipmentTaskDocument/:gencFileID', {
        id: '@_gencFileID',
      }, {
        query: {
          isArray: false
        }
      }),

      documentList: () => $resource(CORE.API_URL + 'equipment_task/retriveEquipmentTaskDocumentList', {
        searchObj: '@_searchObj',
      }, {
        query: {
          isArray: false,
          method: 'POST',
        }
      }),
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.admin.unit')
    .factory('UnitFactory', UnitFactory);

  function UnitFactory($resource, CORE) {
    return {
      retriveMeasurementType: () => $resource(CORE.API_URL + 'measurement_type/retriveMeasurementType/:id', {},
        {
          query: {
            isArray: false
          }
        }),
        retriveMeasurementTypeList: () => $resource(CORE.API_URL + 'measurement_type/retriveMeasurementTypeList', {
        }, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      deleteMeasurementType: () => $resource(CORE.API_URL + 'measurement_type/deleteMeasurementType', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      measurementType: () => $resource(CORE.API_URL + 'measurement_type/saveMeasurementType/', {},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),
      getMeasurementTypeList: () => $resource(CORE.API_URL + 'measurement_type/getMeasurementTypeList', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retriveUnitOfMeasurement: () => $resource(CORE.API_URL + 'uoms/retriveUnitOfMeasurement/:id', {},
        {
          query: {
            isArray: false
          }
        }),
        retriveUnitOfMeasurementList: () => $resource(CORE.API_URL + 'uoms/retriveUnitOfMeasurementList', {
        }, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      removeUnitOfMeasurement: () => $resource(CORE.API_URL + 'uoms/removeUnitOfMeasurement', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveUnitDetailFormula: (param) => $resource(CORE.API_URL + 'unit_detail_formula/retriveUnitDetailFormula', {},
        {
          query: {
            isArray: false,
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
              unitID: param && param.UnitID
            }
          }
        }),
      getUnitOfMeasurementList: () => $resource(CORE.API_URL + 'uoms/getUnitOfMeasurementList/:id/:measurementTypeID', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retriveUnitDetailFormulaDetail: () => $resource(CORE.API_URL + 'unit_detail_formula/retriveUnitDetailFormula/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveUnitDetailFormula: () => $resource(CORE.API_URL + 'unit_detail_formula/saveUnitDetailFormula', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteUnitDetailMeasurement: () => $resource(CORE.API_URL + 'unit_detail_formula/deleteUnitDetailMeasurement', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      retriveUnitOfMeasurementDetail: () => $resource(CORE.API_URL + 'uoms/retriveUnitOfMeasurement/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getUOMListByMeasurementID: () => $resource(CORE.API_URL + 'uoms/getUOMListByMeasurementID/:measurementTypeID', {
        measurementTypeID: '@_measurementTypeID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveUnitOfMeasurementDetail: () => $resource(CORE.API_URL + 'uoms/saveUnitOfMeasurement', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkDuplicateUOM: () => $resource(CORE.API_URL + 'uoms/checkDuplicateUOM', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkUniqueUOMAlias: () => $resource(CORE.API_URL + 'uoms/checkUniqueUOMAlias', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();

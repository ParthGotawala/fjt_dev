(function () {
    'use strict';

    angular
        .module('app.transaction.requestforship')
        .factory('RequestForShipFactory', RequestForShipFactory);

    /** @ngInject */
    function RequestForShipFactory($resource, CORE) {
        return {
            getShippingRequest: (param) => $resource(CORE.API_URL + 'shippingrequest/getShippingRequest/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: param ? {
                        page: param && param.Page ? param.Page : 1,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                    } : null
                }
            }),
            saveRequestForShip: () => $resource(CORE.API_URL + 'shippingrequest/saveRequestForShip', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getReadyForShipQtyByWOID: () => $resource(CORE.API_URL + 'shippingrequest/getReadyForShipQtyByWOID/:woID', {
                woID: '@_woID'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            deleteRequestForShip: () => $resource(CORE.API_URL + 'shippingrequest/deleteRequestForShip', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getShippingQtyAndAssyDetailByWOID: (param) => $resource(CORE.API_URL + 'shippingrequest/getShippingQtyAndAssyDetailByWOID', { }, {
              query: {
                method: 'GET',
                isArray: false,
                params: param ? { woid: param.woID } : null
              }
            }),
            getShippingRequestStatus: (param) => $resource(CORE.API_URL + 'shippingrequest/getShippingRequestStatus', {}, {
                query: {
                  method: 'GET',
                  isArray: false,
                  params: { id: param.id  }
                }
            }),
            getShippingRequestByDet: (param) => $resource(CORE.API_URL + 'shippingrequest/getShippingRequestByDet', {}, {
              query: {
                method: 'GET',
                isArray: false,
                params: { id: param.id }
              }
            }),
            getShippingRequestDet: (param) => $resource(CORE.API_URL + 'shippingrequest/getShippingRequestDet', {
            }, {
              query: {
                isArray: false,
                method: 'GET',
                params: param ? {
                  page: param && param.Page ? param.Page : 1,
                  pageSize: CORE.UIGrid.ItemsPerPage(),
                  order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                  search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                } : null
              }
            }),
            getGetShippingReqList: (param) => $resource(CORE.API_URL + 'shippingrequest/getGetShippingReqList', {}, {
              query: {
                method: 'GET',
                isArray: false,                
              }
            })
        }
    }
})();

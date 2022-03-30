(function () {
    'use strict';

    angular
        .module('app.admin.manufacturer')
        .factory('ManufacturerFactory', ManufacturerFactory);

    /** @ngInject */
    function ManufacturerFactory($resource, CORE, $http) {
        return {
            retriveMfgCode: (param) => $resource(CORE.API_URL + 'mfgcode/retriveMfgCode/:id', {},
                {
                    query: {
                        method: 'POST',
                        isArray: false,
                        params: {
                            mfgType: param && param.mfgType ? param.mfgType : null,
                            fromPageRequest: param && param.fromPageRequest ? param.fromPageRequest : null
                        }
                    }
                }),
            retriveMfgCodeList: () => $resource(CORE.API_URL + 'mfgcode/retriveMfgCodeList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            deleteMfgCode: () => $resource(CORE.API_URL + 'mfgcode/deleteMfgCode', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getAcessLeval: () => $resource(CORE.API_URL + 'mfgcode/getAcessLeval', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getAllManufacturers: () => $resource(CORE.API_URL + 'mfgcode/allManufacturer/getAllManufacturers', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getAllManufacturerWithFormattedCodeList: (param) => $resource(CORE.API_URL + 'mfgcode/allManufacturer/getAllManufacturerWithFormattedCodeList', {},
                {
                    query: {
                        isArray: false,
                        params: {
                            mfgType: param.mfgType,
                            isCodeFirst: param.isCodeFirst ? param.isCodeFirst : false,
                            isPricingApi: (param.isPricingApi !== null && param.isPricingApi !== undefined) ? param.isPricingApi : null
                        }
                    }
                }),
            importFormatTwoManufacturerDetails: () => $resource(CORE.API_URL + 'mfgcode/importFormatTwoManufacturerDetails', {
                mfgList: '@_mfgList'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            importFormatOneManufacturerDetails: () => $resource(CORE.API_URL + 'mfgcode/importFormatOneManufacturerDetails', {
                mfgImportedDetail: '@_mfgImportedDetail'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            importFormatOneCustomerDetails: () => $resource(CORE.API_URL + 'mfgcode/importFormatOneCustomerDetails', {
                mfgImportedDetail: '@_mfgImportedDetail',
                isUpdateExistingData: '@_isUpdateExistingData'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            removeImportMFG: () => $resource(CORE.API_URL + 'mfgcode/removeImportMFG', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            removeMFRDetails: () => $resource(CORE.API_URL + 'mfgcode/removeMFRDetails', {
                mfrType: '@_mfrType'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            validateCustomerDetails: () => $resource(CORE.API_URL + 'mfgcode/validateCustomerDetails', {
                mfgImportedDetail: '@_mfgImportedDetail'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getVerificationManufacturerList: (param) => $resource(CORE.API_URL + 'mfgcode/getVerificationManufacturerList', {}, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {
                        type: param && param.type ? param.type : null,
                        isCustOrDisty: param.isCustOrDisty
                    }
                }
            }),
            UpdateVerificationManufacturer: () => $resource(CORE.API_URL + 'mfgcode/UpdateVerificationManufacturer', {
                manufacturers: '@_manufacturers'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            exportSampleMFGTemplate: (mfgObj) => $http.post(CORE.API_URL + 'mfgcode/exportSampleMFGTemplate', { mfgObj }, { responseType: 'arraybuffer' })
                .then((response) =>
                    response
                    , (error) => error),
            updateDisplayOrder: () => $resource(CORE.API_URL + 'mfgcode/updateDisplayOrder', {
                mfgCodeModel: '@_mfgCodeModel'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retriveWhereUsedMFGList: () => $resource(CORE.API_URL + 'mfgcode/retriveWhereUsedMFGList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            /* ***************************** customers related api *******************************/
            customer: (param) => $resource(CORE.API_URL + 'customers/getCustomerDetails', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                    params: {
                        fromPageRequest: param && param.fromPageRequest ? param.fromPageRequest : null,
                        mfgType: param && param.mfgType ? param.mfgType : null
                    }
                },
                update: {
                    method: 'PUT'
                }
            }),
            managecustomer: () => $resource(CORE.API_URL + 'customers/saveCustomer/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            // updateCustomerBillingTerms: () => $resource(CORE.API_URL + 'customers/saveCustomerBillingTerms/', {},
            //     {
            //         update: {
            //             method: 'POST'
            //         }
            //     }),
            checkDuplicateMFGName: () => $resource(CORE.API_URL + 'customers/checkDuplicateMFGName', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateMFGCode: () => $resource(CORE.API_URL + 'customers/checkDuplicateMFGCode', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            deleteCustomer: () => $resource(CORE.API_URL + 'customers/deleteCustomer', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            saveCustMFGPN: () => $resource(CORE.API_URL + 'customers/saveCustMFGPN', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getAssumblyListFromCPN: () => $resource(CORE.API_URL + 'customers/getAssumblyListFromCPN/:id', { id: '@_id' }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            getManufacturerAssignCount: () => $resource(CORE.API_URL + 'customers/getManufacturerAssignCount/:mfrID', { mfrID: '@_mfrID' }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            updateComponentStatusToObsolete: () => $resource(CORE.API_URL + 'customers/updateComponentStatusToObsolete/:mfrID', { mfrID: '@_mfrID' }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            importCPNDetails: () => $resource(CORE.API_URL + 'mfgcode/importCPNDetails', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            exportCPNDetails: () => $resource(CORE.API_URL + 'mfgcode/exportCPNDetails', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            VerifyManufacturer: () => $resource(CORE.API_URL + 'mfgcode/VerifyManufacturer', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retriveCustomerList: () => $resource(CORE.API_URL + 'customers/retriveCustomerList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getCustomerAssemblyStock: (param) => $resource(CORE.API_URL + 'customers/getCustomerAssemblyStock', {}, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {
                        page: param && param.Page ? param.Page : 0,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                        customerId: param && param.customerId ? param.customerId : null
                    }
                }
            }),
            CheckAnyCustomPartSupplierMFRMapping: () => $resource(CORE.API_URL + 'customers/CheckAnyCustomPartSupplierMFRMapping', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            /* ***************************** supplier api *******************************/
            retrieveCustomComponentNotAddedList: () => $resource(CORE.API_URL + 'supplier/retrieveCustomComponentNotAddedList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveCustomComponentAddedList: () => $resource(CORE.API_URL + 'supplier/retrieveCustomComponentAddedList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            // saveRemitToDetails: () => $resource(CORE.API_URL + 'supplier/saveRemitToDetails', {
            // }, {
            //     query: {
            //         method: 'POST',
            //         isArray: false
            //     }
            // }),
            removeMPNMapping: () => $resource(CORE.API_URL + 'customers/removeMPNMapping', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            checkCPNUIDStock: () => $resource(CORE.API_URL + 'customers/checkCPNUIDStock', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getAVLPartDetailByCPNID: () => $resource(CORE.API_URL + 'customers/getAVLPartDetailByCPNID', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getCustomerMappingList: () => $resource(CORE.API_URL + 'supplier/getCustomerMappingList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getStandardbySupplier: () => $resource(CORE.API_URL + 'supplier/getStandardbySupplier', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            saveStandards: () => $resource(CORE.API_URL + 'supplier/saveStandards', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteStandards: () => $resource(CORE.API_URL + 'supplier/deleteStandards', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            })
        };
    }
})();

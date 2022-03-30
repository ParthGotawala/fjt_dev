
(function () {
    'use strict';

    angular
        .module('app.transaction.receivingmaterial')
        .factory('ReceivingMaterialFactory', ['$resource', '$http', 'CORE', ReceivingMaterialFactory]);

    function ReceivingMaterialFactory($resource, $http, CORE) {
        return {
            saveScanLabel: () => $resource(CORE.API_URL + 'componentsidstock/MatchRegexpToString', {
                ScanlblObj: '@_ScanlblObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteComponentSidStock: () => $resource(CORE.API_URL + 'componentsidstock/deleteComponentSidStock', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteComponentSidStockDataElement: () => $resource(CORE.API_URL + 'componentsidstockdataelement/deleteComponentSidStockDataElement', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            updateComponentSidStock: () => $resource(CORE.API_URL + 'componentsidstock/updateComponentSidStock', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            saveComponentSidStock: () => $resource(CORE.API_URL + 'componentsidstock/createComponentSidStock', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getUMIDList: () => $resource(CORE.API_URL + 'componentsidstock/getUMIDList', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),

            getUMIDByID: () => $resource(CORE.API_URL + 'componentsidstock/getUMIDByID/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                },
                update: {
                    method: 'PUT'
                }
            }),

            componentSidStockDataelementValues: () => $resource(CORE.API_URL + 'componentsidstockdataelement/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),

            PrintDocument: () => $resource(CORE.API_URL + 'componentsidstock/PrintDocument', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            verifyLabelTemplate: () => $resource(CORE.API_URL + 'componentsidstock/verifyLabelTemplate', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            printLabelTemplate: () => $resource(CORE.API_URL + 'componentsidstock/printLabelTemplate', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getPriceCategory: () => $resource(CORE.API_URL + 'componentsidstock/getPriceCategory', {
                objMaterial: '@_objMaterial'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getComponentMslDetail: () => $resource(CORE.API_URL + 'componentsidstock/getComponentMslDetail/:id', {
                id: '@_id'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),

            getUIDList: () => $resource(CORE.API_URL + 'componentsidstock/getUIDList/:query', { query: '@_query' },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),

            getVerifiedLabel: () => $resource(CORE.API_URL + 'componentsidstock/getVerifiedLabel', { objComponentStock: '@_objComponentStock' },
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),

            // transferstock: () => $resource(CORE.API_URL + 'componentsidstock/transferstock', { transferLocation: '@_transferLocation', },
            //  {
            //    query: {
            //      isArray: false,
            //      method: 'POST',
            //    }
            //  }),
            getAllBin: (param) => $resource(CORE.API_URL + 'binmst/getAllBin', {},
                {
                    query: {
                        method: 'GET',
                        isArray: false,
                        params: {
                            warehouseID: param && param.warehouseID ? param.warehouseID : null,
                            searchString: param && param.searchString ? param.searchString : null,
                            parentWHID: param && param.parentWHID ? param.parentWHID : null,
                            nickname: param && param.nickname ? param.nickname : null
                        }
                    }
                }),
            getMFGCodeOnCustomer: () => $resource(CORE.API_URL + 'componentsidstock/getMFGCodeOnCustomer/:id', {
                id: '@_id'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            getComponentWithTemplateDelimiter: () => $resource(CORE.API_URL + 'componentsidstock/getComponentWithTemplateDelimiter/:id/:mfgid', {
                id: '@_id',
                mfgid: '@_mfgid'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveUnlockVerificationDetail: () => $resource(CORE.API_URL + 'componentsidstock/saveUnlockVerificationDetail', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            verificationHistory: () => $resource(CORE.API_URL + 'UMID/verificationhistory', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            RemoveFromReserveStock: () => $resource(CORE.API_URL + 'componentsidstock/RemoveFromReserveStock', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            AddInReserveStock: () => $resource(CORE.API_URL + 'componentsidstock/AddInReserveStock', {}, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            get_PO_SO_Assembly_List: () => $resource(CORE.API_URL + 'componentsidstock/get_PO_SO_Assembly_List', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            get_RFQ_BOMPart_List: () => $resource(CORE.API_URL + 'componentsidstock/get_RFQ_BOMPart_List/:id/:sodid', {
                id: '@_id',
                sodid: '@_sodid'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getAllocatedKitByUID: () => $resource(CORE.API_URL + 'componentsidstock/getAllocatedKitByUID', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            get_Component_Sid_ByUID: () => $resource(CORE.API_URL + 'componentsidstock/get_Component_Sid_ByUID/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            match_Warehouse_Bin: () => $resource(CORE.API_URL + 'componentsidstock/match_Warehouse_Bin', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            checkAssemblyHasBom: () => $resource(CORE.API_URL + 'componentsidstock/checkAssemblyHasBom/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),

            get_Multiple_Barcode_List: () => $resource(CORE.API_URL + 'componentsidstock/get_Multiple_Barcode_List/:ids', {
                ids: '@_ids'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            updateTransferDetail: () => $resource(CORE.API_URL + 'componentsidstock/updateTransferDetail', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getSubAssemblyOnAssembly: () => $resource(CORE.API_URL + 'componentsidstock/getSubAssemblyOnAssembly/:id', {
                ids: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getNonUMIDStockList: () => $resource(CORE.API_URL + 'componentsidstock/getNonUMIDStockList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            updateInitialQty: () => $resource(CORE.API_URL + 'componentsidstock/updateInitialQty', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getUMIDDetailByUMID: () => $resource(CORE.API_URL + 'componentsidstock/getUMIDDetailByUMID', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            saveRestrictUMIDDetail: () => $resource(CORE.API_URL + 'componentsidstock/saveRestrictUMIDDetail', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getCostCategoryFromUMID: () => $resource(CORE.API_URL + 'componentsidstock/getCostCategoryFromUMID/:id', { id: '@_id' },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getDateCodeFromUMID: () => $resource(CORE.API_URL + 'componentsidstock/getDateCodeFromUMID/:id', { id: '@_id' },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),

            getPromptIndicatorColor: () => $resource(CORE.API_URL + 'componentsidstock/getPromptIndicatorColor/:pcartMfr/:prefDepartmentID', { pcartMfr: '@_pcartMfr', prefDepartmentID: '@_prefDepartmentID' },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),

            getAssignColorToUsers: () => $resource(CORE.API_URL + 'componentsidstock/getAssignColorToUsers/:pcartMfr', { pcartMfr: '@_pcartMfr' },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),

            getNumberOfPrintsForUMID: () => $resource(CORE.API_URL + 'componentsidstock/getNumberOfPrintsForUMID/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            restrictUMIDHistory: () => $resource(CORE.API_URL + 'componentsidstock/restrictUMIDHistory/:id', { id: '@_id' }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),

            getBOMLineDetailForSameMFRPN: () => $resource(CORE.API_URL + 'componentsidstock/getBOMLineDetailForSameMFRPN', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getGenericCategoryByType: () => $resource(CORE.API_URL + 'componentsidstock/getGenericCategoryByType', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getNonUMIDCount: () => $resource(CORE.API_URL + 'componentsidstock/getNonUMIDCount', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getBartenderServerDetails: () => $resource(CORE.API_URL + 'componentsidstock/getBartenderServerDetails', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            saveBartenderServerDetails: () => $resource(CORE.API_URL + 'componentsidstock/saveBartenderServerDetails', {
                updateObj: '@_updateObj'
            },
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getCofcDocumentDetails: () => $resource(CORE.API_URL + 'componentsidstock/getCofcDocumentDetails', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),

            importUMIDDetail: () => $resource(CORE.API_URL + 'componentsidstock/importUMIDDetail', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),

            getCOFCByBinIdPartId: () => $resource(CORE.API_URL + 'componentsidstock/getCOFCByBinIdPartId', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),

            getDataElementValueOfUMID: () => $resource(CORE.API_URL + 'componentsidstock/getDataElementValueOfUMID', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getPricingDetailForCostCategory: () => $resource(CORE.API_URL + 'componentsidstock/getPricingDetailForCostCategory', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            generateInternalDateCode: () => $resource(CORE.API_URL + 'componentsidstock/generateInternalDateCode', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getUmidTabCount: () => $resource(CORE.API_URL + 'componentsidstock/getUmidTabCount', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getInTransitCheckoutreel: () => $resource(CORE.API_URL + 'componentsidstock/getInTransitCheckoutreel/:transactionID', {
                transactionID: '@_transactionID'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getInTransitUMIDDetail: () => $resource(CORE.API_URL + 'componentsidstock/getInTransitUMIDDetail/:uid', {
                uid: '@_uid'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getDataForPrintLabelTemplate: () => $resource(CORE.API_URL + 'componentsidstock/getDataForPrintLabelTemplate', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getExistingAssemblyWorkorderDetail: () => $resource(CORE.API_URL + 'componentsidstock/getExistingAssemblyWorkorderDetail', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getCountApprovalHistoryList: () => $resource(CORE.API_URL + 'countapprovalhistory/getCountApprovalHistoryList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getSplitUIDList: () => $resource(CORE.API_URL + 'componentsidstock/getSplitUIDList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            createSplitUMID: () => $resource(CORE.API_URL + 'componentsidstock/createSplitUMID', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getUMIDDetailsById: () => $resource(CORE.API_URL + 'componentsidstock/getUMIDDetailsById', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getSameCriteriaUMIDPackingSlipDetails: () => $resource(CORE.API_URL + 'componentsidstock/getSameCriteriaUMIDPackingSlipDetails', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            checkDeleteUIDValidation: () => $resource(CORE.API_URL + 'componentsidstock/checkDeleteUIDValidation', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getDeallocatedUIDList: () => $resource(CORE.API_URL + 'componentsidstock/getDeallocatedUIDList', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getComponentShelfLifeDetailsById: () => $resource(CORE.API_URL + 'componentsidstock/getComponentShelfLifeDetailsById', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getSameCriteriaPackingSlipNonUMIDStock: () => $resource(CORE.API_URL + 'componentsidstock/getSameCriteriaPackingSlipNonUMIDStock', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getUMIDDetailsForManageStock: () => $resource(CORE.API_URL + 'componentsidstock/getUMIDDetailsForManageStock', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            manageIdenticalUMID: () => $resource(CORE.API_URL + 'componentsidstock/manageIdenticalUMID', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            })
            // // Added By Leena for POC - 07/02/2020
            // AddedImagesIntoPDF: () => $http.post(
            //  CORE.API_URL + "workorders/AddedImagesIntoPDF", {},
            //  { responseType: 'arraybuffer' }).then(function (response) {
            //    return response;
            //  }, function (error) {
            //    return error;
            //  })
        };
    }
})();


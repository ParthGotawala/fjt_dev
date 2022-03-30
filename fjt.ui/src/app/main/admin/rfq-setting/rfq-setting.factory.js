(function () {
    'use strict';

    angular
        .module('app.admin.rfqsetting')
        .factory('RFQSettingFactory', RFQSettingFactory);

    /** @ngInject */
    function RFQSettingFactory($resource, CORE, $http) {
        return {
            jobType: () => $resource(CORE.API_URL + 'job_type/saveJobType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            findSameJobType: () => $resource(CORE.API_URL + 'job_type/findSameJobType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),

            retriveJobType: () => $resource(CORE.API_URL + 'job_type/retriveJobType', {},
                {
                    query: {
                        isArray: false
                    }
                }),
            retriveJobTypeList: () => $resource(CORE.API_URL + 'job_type/retriveJobTypeList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getJobTypeList: () => $resource(CORE.API_URL + 'job_type/getJobTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deleteJobType: () => $resource(CORE.API_URL + 'job_type/deleteJobType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            rfqType: () => $resource(CORE.API_URL + 'rfq_type/saveRfqType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            findSameRFQType: () => $resource(CORE.API_URL + 'rfq_type/findSameRFQType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),

            retriveRfqType: () => $resource(CORE.API_URL + 'rfq_type/retriveRfqType', {},
                {
                    query: {
                        isArray: false
                    }
                }),
            retriveRfqTypeList: () => $resource(CORE.API_URL + 'rfq_type/retriveRfqTypeList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getRfqTypeList: () => $resource(CORE.API_URL + 'rfq_type/getRfqTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deleteRfqType: () => $resource(CORE.API_URL + 'rfq_type/deleteRfqType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            reason: () => $resource(CORE.API_URL + 'reason/saveReason/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            retriveReasonList: () => $resource(CORE.API_URL + 'reason/retriveReasonList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retriveReason: () => $resource(CORE.API_URL + 'reason/retriveReason/:id', {
                id: '@_id',
                reason_type: '@_reason_type'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getReasonList: () => $resource(CORE.API_URL + 'reason/getReasonList', {
                reason_type: '@_reason_type'
            },
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getActiveReasonListByReasonType: () => $resource(CORE.API_URL + 'reason/getActiveReasonListByReasonType', {
                listObj: '@_listObj'
            },
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            deleteReason: () => $resource(CORE.API_URL + 'reason/deleteReason', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            additionalRequirement: () => $resource(CORE.API_URL + 'requirement_template/saveRequirement/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),

            retriveAdditionalRequirement: () => $resource(CORE.API_URL + 'requirement_template/retriveRequirement', {},
                {
                    query: {
                        isArray: false
                    }
                }),
            retriveAdditionalRequirementList: () => $resource(CORE.API_URL + 'requirement_template/retriveRequirementList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getAdditionalRequirementList: () => $resource(CORE.API_URL + 'requirement_template/getAllRequirement', {
                category: '@_category'
            },
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            deleteAdditionalRequirement: () => $resource(CORE.API_URL + 'requirement_template/deleteRequirement', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateTemplate: () => $resource(CORE.API_URL + 'requirement_template/checkDuplicateTemplate', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            mountingType: () => $resource(CORE.API_URL + 'rfqmounting/saveMountingType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            retriveMountingTypeList: () => $resource(CORE.API_URL + 'rfqmounting/retriveMountingTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retriveMountingType: () => $resource(CORE.API_URL + 'rfqmounting/retriveMountingType/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getMountingTypeList: () => $resource(CORE.API_URL + 'rfqmounting/getMountingTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deleteMountingType: () => $resource(CORE.API_URL + 'rfqmounting/deleteMountingType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            rohs: () => $resource(CORE.API_URL + 'rfqRohs/saveRohs/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),

            retriveRohs: () => $resource(CORE.API_URL + 'rfqRohs/retriveRohs', {},
                {
                    query: {
                        isArray: false
                    }
                }),

            retriveRohsList: () => $resource(CORE.API_URL + 'rfqRohs/retriveRohsList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getRohsList: () => $resource(CORE.API_URL + 'rfqRohs/getRohsList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getRohsCategoryList: () => $resource(CORE.API_URL + 'rfqRohs/getRohsCategoryList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deleteRohs: () => $resource(CORE.API_URL + 'rfqRohs/deleteRohs', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            partType: () => $resource(CORE.API_URL + 'rfqparttype/savePartType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            retrivePartTypeList: () => $resource(CORE.API_URL + 'rfqparttype/retrivePartTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retrivePartType: () => $resource(CORE.API_URL + 'rfqparttype/retrivePartType/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getPartTypeList: () => $resource(CORE.API_URL + 'rfqparttype/getPartTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deletePartType: () => $resource(CORE.API_URL + 'rfqparttype/deletePartType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retriveErrorCode: () => $resource(CORE.API_URL + 'rfqlineitemerrorcode/retriveErrorCode', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getRFQLineItemssystemVariable: () => $resource(CORE.API_URL + 'rfqlineitemsheaders/getRfqLineitemsHeaders', {
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saverfqlineErrorCode: () => $resource(CORE.API_URL + 'rfqlineitemerrorcode/saverfqlineErrorCode',
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            saverfqlineErrorCodePriority: () => $resource(CORE.API_URL + 'rfqlineitemerrorcode/saverfqlineErrorCodePriority',
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            //keyword region
            retriveKeywordList: () => $resource(CORE.API_URL + 'keywords/retriveKeywordList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retriveKeyword: () => $resource(CORE.API_URL + 'keywords/retriveKeyword/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            keyword: () => $resource(CORE.API_URL + 'keywords/saveKeyword/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            findSameKeyWord: () => $resource(CORE.API_URL + 'keywords/findSameKeyWord/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            deleteKeyword: () => $resource(CORE.API_URL + 'keywords/deleteKeywords', {
                objIDs: '@_objIDs'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            quoteDynamicFields: () => $resource(CORE.API_URL + 'quotedynamicfield/saveQuoteDynamicFields/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            retriveQuoteDynamicFieldsList: () => $resource(CORE.API_URL + 'quotedynamicfield/retriveQuoteDynamicFieldsList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retriveQuoteDynamicFields: () => $resource(CORE.API_URL + 'quotedynamicfield/retriveQuoteDynamicFields/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            retriveQuoteDynamicFieldsListByCostingType: (param) => $resource(CORE.API_URL + 'quotedynamicfield/retriveQuoteDynamicFieldsListByCostingType', {},
                {
                    query: {
                        isArray: false,
                        params: {
                            CostingType: param && param.CostingType ? param.CostingType : null
                        }
                    }
                }),
            retriveRFQQuoteAttributeList: () => $resource(CORE.API_URL + 'quotedynamicfield/retriveRFQQuoteAttributeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deleteQuoteDynamicFields: () => $resource(CORE.API_URL + 'quotedynamicfield/deleteQuoteDynamicFields', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            costCategory: () => $resource(CORE.API_URL + 'costcategory/saveCostCategory/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            retriveCostCategoryList: () => $resource(CORE.API_URL + 'costcategory/retriveCostCategoryList', {},
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            retriveCostCategory: () => $resource(CORE.API_URL + 'costcategory/retriveCostCategory/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),

            deleteCostCategory: () => $resource(CORE.API_URL + 'costcategory/deleteCostCategory', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getCostCateogryList: () => $resource(CORE.API_URL + 'costcategory/getCostCateogryList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            retriveConnecterTypeList: () => $resource(CORE.API_URL + 'rfqconnector/retriveConnecterTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retriveConnecterType: () => $resource(CORE.API_URL + 'rfqconnector/retriveConnecterType/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deleteConnecterType: () => $resource(CORE.API_URL + 'rfqconnector/deleteConnecterType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            connecterType: () => $resource(CORE.API_URL + 'rfqconnector/saveConnecterType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            getFunctionalTypeList: () => $resource(CORE.API_URL + 'rfqparttype/getFunctionalTypeList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getConnectorTypeList: () => $resource(CORE.API_URL + 'rfqconnector/getConnectorTypeList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getMountingList: () => $resource(CORE.API_URL + 'rfqmounting/getMountingList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            updateMountingTypeDisplayOrder: () => $resource(CORE.API_URL + 'rfqmounting/updateMountingTypeDisplayOrder', {
                mountingTypeModel: '@_mountingTypeModel'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateResonCategory: () => $resource(CORE.API_URL + 'reason/checkDuplicateResonCategory', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicatePartType: () => $resource(CORE.API_URL + 'rfqparttype/checkDuplicatePartType', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkUniquePartTypeAlias: () => $resource(CORE.API_URL + 'rfqparttype/checkUniquePartTypeAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkUniqueConnectorTypeAlias: () => $resource(CORE.API_URL + 'rfqconnector/checkUniqueConnectorTypeAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateConnectorType: () => $resource(CORE.API_URL + 'rfqconnector/checkDuplicateConnectorType', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateMountingType: () => $resource(CORE.API_URL + 'rfqmounting/checkDuplicateMountingType', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicateRoHS: () => $resource(CORE.API_URL + 'rfqRohs/checkDuplicateRoHS', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicatePartStatus: () => $resource(CORE.API_URL + 'componentpartstatus/checkDuplicatePartStatus', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getRoHSList: () => $resource(CORE.API_URL + 'rfqRohs/getRoHSList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            checkUniqueRoHSAlias: () => $resource(CORE.API_URL + 'rfqRohs/checkUniqueRoHSAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            updateRoHSDisplayOrder: () => $resource(CORE.API_URL + 'rfqRohs/updateRoHSDisplayOrder', {
                rohsModel: '@_rohsModel'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkUniqueMountingTypeAlias: () => $resource(CORE.API_URL + 'rfqmounting/checkUniqueMountingTypeAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getCommonTypeList: () => $resource(CORE.API_URL + 'rfqconnector/getCommonTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retrivePackagingTypeList: () => $resource(CORE.API_URL + 'componentpackaging/retrivePackagingTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retrivePackagingType: () => $resource(CORE.API_URL + 'componentpackaging/retrivePackagingType/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getPackagingTypeList: () => $resource(CORE.API_URL + 'componentpackaging/getPackagingTypeList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            checkDuplicatePackagingType: () => $resource(CORE.API_URL + 'componentpackaging/checkDuplicatePackagingType', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            packagingType: () => $resource(CORE.API_URL + 'componentpackaging/savePackagingType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            checkUniquePackagingTypeAlias: () => $resource(CORE.API_URL + 'componentpackaging/checkUniquePackagingTypeAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            updatePackagingDisplayOrder: () => $resource(CORE.API_URL + 'componentpackaging/updatePackagingDisplayOrder', {
                packagingModel: '@_packagingModel'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deletePackagingType: () => $resource(CORE.API_URL + 'componentpackaging/deletePackagingType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkUniqueDynamicField: () => $resource(CORE.API_URL + 'quotedynamicfield/checkUniqueDynamicField', { dynamicObj: '@_dynamicObj' },
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            checkUniqueCostCategory: () => $resource(CORE.API_URL + 'costcategory/checkUniqueCostCategory', { categoryObj: '@categoryObj' },
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            getErrorCodeByLogicID: () => $resource(CORE.API_URL + 'rfqlineitemerrorcode/getErrorCodeByLogicID', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrivePartStatusList: () => $resource(CORE.API_URL + 'componentpartstatus/retrivePartStatusList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retrivePartStatus: () => $resource(CORE.API_URL + 'componentpartstatus/retrivePartStatus/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            deletePartStatus: () => $resource(CORE.API_URL + 'componentpartstatus/deletePartStatus', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getPartStatusList: () => $resource(CORE.API_URL + 'componentpartstatus/getPartStatusList', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            checkUniquePartStatusAlias: () => $resource(CORE.API_URL + 'componentpartstatus/checkUniquePartStatusAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            createPartStatus: () => $resource(CORE.API_URL + 'componentpartstatus/createPartStatus/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            getStatusList: () => $resource(CORE.API_URL + 'componentpartstatus/getStatusList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            updatePartStatusDisplayOrder: () => $resource(CORE.API_URL + 'componentpartstatus/updatePartStatusDisplayOrder', {
                partStatusModel: '@_partStatusModel'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getErrorCodeCategory: () => $resource(CORE.API_URL + 'rfqerrorcode/getErrorCodeCategory/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            getErrorCodeCategoryMapping: () => $resource(CORE.API_URL + 'rfqerrorcodecategory/getErrorCodeCategoryMapping/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            saveErrorCodeMapping: () => $resource(CORE.API_URL + 'rfqerrorcodecategory/saveErrorCodeMapping', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            checkUniqueTemplateName: () => $resource(CORE.API_URL + 'laborCostTemplate/checkUniqueTemplateName', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getLabourCostTemplateList: () => $resource(CORE.API_URL + 'laborCostTemplate/getLabourCostTemplateList', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retriveLaborCostTemplate: () => $resource(CORE.API_URL + 'laborCostTemplate/retriveLaborCostTemplate/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            saveLaborCost: () => $resource(CORE.API_URL + 'laborCostTemplate/saveLaborCostDetails', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            downloadLaborCostTemplate: (module) => $http.get(CORE.API_URL + 'laborCostTemplate/downloadLaborCostTemplate/' + module, { responseType: 'arraybuffer' })
                .then((response) =>
                    response,
                    (error) => error),
            ExportLaborCostDetailTemplate: (param) => $http.get(CORE.API_URL + 'laborCostTemplate/ExportLaborCostDetailTemplate/' + param.module + '/' + param.id, { responseType: 'arraybuffer' })
                .then((response) =>
                    response,
                    (error) => error),
            deleteLaborCostTemplates: () => $resource(CORE.API_URL + 'laborCostTemplate/deleteLaborCostTemplate', {
                objIDs: '@_objIDs'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getTemplateDetail: () => $resource(CORE.API_URL + 'laborCostTemplate/getTemplateDetails/:pPriceType', { pPriceType: '@_pPriceType' }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getPackageCaseList: () => $resource(CORE.API_URL + 'packagecase/getPackageCaseList/', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            retrivePackageCaseTypeList: () => $resource(CORE.API_URL + 'packagecase/retrivePackageCaseTypeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retrivePackageCaseType: () => $resource(CORE.API_URL + 'packagecase/retrivePackageCaseType/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            checkDuplicatePackageCaseType: () => $resource(CORE.API_URL + 'packagecase/checkDuplicatePackageCaseType', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkUniquePackageCaseTypeAlias: () => $resource(CORE.API_URL + 'packagecase/checkUniquePackageCaseTypeAlias', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            savePackageCaseType: () => $resource(CORE.API_URL + 'packagecase/savePackageCaseType/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            deletePackageCaseType: () => $resource(CORE.API_URL + 'packagecase/deletePackageCaseType', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrivePartDynamicAttributeList: () => $resource(CORE.API_URL + 'operationalattributes/retrivePartDynamicAttributeList', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            retrivePartDynamicAttribute: () => $resource(CORE.API_URL + 'operationalattributes/retrivePartDynamicAttribute/:id', {
                id: '@_id'
            },
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            createPartDynamicAttribute: () => $resource(CORE.API_URL + 'operationalattributes/createPartDynamicAttribute/', {},
                {
                    query: {
                        isArray: false
                    },
                    update: {
                        method: 'PUT'
                    }
                }),
            deletePartDynamicAttribute: () => $resource(CORE.API_URL + 'operationalattributes/deletePartDynamicAttribute', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            checkDuplicatePartDynamicAttribute: () => $resource(CORE.API_URL + 'operationalattributes/checkDuplicatePartDynamicAttribute', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            updateDynamicAttributeDisplayOrder: () => $resource(CORE.API_URL + 'operationalattributes/updateDynamicAttributeDisplayOrder', {
                dynamicAttributeModel: '@_dynamicAttributeModel'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveParentRoHS: () => $resource(CORE.API_URL + 'rfqRohs/retrieveParentRoHS', {
                id: '@_id'
            },
                {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                }),
            getRoHSPeer: () => $resource(CORE.API_URL + 'rfqRoHSPeer/getRoHSPeer/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveRoHSPeer: () => $resource(CORE.API_URL + 'rfqRoHSPeer/saveRoHSPeer', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
          getLaborCostTemplateMstNumber: () => $resource(CORE.API_URL + 'laborCostTemplate/getLaborCostTemplateMstNumber', {}, {
            query: {
              method: 'POST',
              isArray: false
            }
          })
        };
    }
})();

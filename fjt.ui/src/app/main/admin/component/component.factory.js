(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .factory('ComponentFactory', ComponentFactory);

  /** @ngInject */
  function ComponentFactory($resource, $http, CORE) {
    return {
      getComponentByID: () => $resource(CORE.API_URL + 'component/getComponentByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      component: () => $resource(CORE.API_URL + 'component/:id', {
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
      validationOnUpdatePart: () => $resource(CORE.API_URL + 'component/validationOnUpdatePart', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveComponentList: () => $resource(CORE.API_URL + 'component/retrieveComponentList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWhereUseComponent: () => $resource(CORE.API_URL + 'component/getWhereUseComponent', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getWhereUseComponentOther: () => $resource(CORE.API_URL + 'component/getWhereUseComponentOther/:id', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getComponentAssyProgramList: () => $resource(CORE.API_URL + 'component/getComponentAssyProgramList', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      getDriveToolListByComponentId: () => $resource(CORE.API_URL + 'component/getDriveToolListByComponentId', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

      retrieveComponentEntityDataElements: () => $resource(CORE.API_URL + 'component_dataelement/retrieveComponentEntityDataElements', {
        componentObj: '@_componentObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

      deleteComponentAlias: () => $resource(CORE.API_URL + 'component/deleteComponentAlias', {
        componentAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),


      getComponentMFGAliasSearch: () => $resource(CORE.API_URL + 'component/getComponentMFGAliasSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getComponentMFGAliasPIDProdPNSearch: () => $resource(CORE.API_URL + 'component/getComponentMFGAliasPIDProdPNSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentMFGAliasPartsSearch: () => $resource(CORE.API_URL + 'component/getComponentMFGAliasPartsSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentPidCodeSearch: () => $resource(CORE.API_URL + 'component/getComponentPidCodeSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentSupplierAliasSearch: () => $resource(CORE.API_URL + 'component/getComponentSupplierAliasSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentAliasGroup: () => $resource(CORE.API_URL + 'component/getComponentAliasGroup', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      createPackagingAlias: () => $resource(CORE.API_URL + 'component/createPackagingAlias', {
        componentPackagingAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      addBulkPackagingAlias: () => $resource(CORE.API_URL + 'component/addBulkPackagingAlias', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteComponentPackagingAlias: () => $resource(CORE.API_URL + 'component/deleteComponentPackagingAlias', {
        componentPackagingAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentPackagingAliasGroup: () => $resource(CORE.API_URL + 'component/getComponentPackagingAliasGroup/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      createAlternetAlias: () => $resource(CORE.API_URL + 'component/createAlternetAlias', {
        componentAlternetAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      deleteComponentAlternetAlias: () => $resource(CORE.API_URL + 'component/deleteComponentAlternetAlias', {
        componentAlternetAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentAlternetAliasGroup: () => $resource(CORE.API_URL + 'component/getComponentAlternetAliasGroup', { /*id: '@_id', type: '@_type'*/ }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentList: () => $resource(CORE.API_URL + 'component/getComponentList/:isGoodPart', {
        isGoodPart: '@_isGoodPart'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getComponentDetailByMfg: () => $resource(CORE.API_URL + 'component/getComponentDetailByMfg/:id', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      deleteComponent: () => $resource(CORE.API_URL + 'component/deleteComponent', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentCustAliasRevByCustId: () => $resource(CORE.API_URL + 'customers/getComponentCustAliasRevByCustId', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getComponentCustAliasRevPNByCustId: () => $resource(CORE.API_URL + 'customers/getComponentCustAliasRevPNByCustId', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
          // params: {
          //   page: param && param.Page ? param.Page : 1,
          //   pageSize: CORE.UIGrid.ItemsPerPage(),
          //   order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
          //   search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
          //   ComponentCustAliasRevID: JSON.stringify(param.ComponentCustAliasRevID)
          // }
        }
      }),
      createGoodBadPart: () => $resource(CORE.API_URL + 'component/createGoodBadPart', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentGoodBadPartGroup: () => $resource(CORE.API_URL + 'component/getComponentGoodBadPartGroup', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentGoodBadPartList: () => $resource(CORE.API_URL + 'component/getComponentGoodBadPartList', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      deleteComponentGoodBadPart: () => $resource(CORE.API_URL + 'component/deleteComponentGoodBadPart', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getUOMsList: () => $resource(CORE.API_URL + 'uoms/getUOMsList/:measurementTypeID', {
        measurementTypeID: '@_measurementTypeID'
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
      getPackageCaseTypeList: () => $resource(CORE.API_URL + 'packagecase/getPackageCaseTypeList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getRohsList: () => $resource(CORE.API_URL + 'rfqRohs/getRohsList', {},
        {
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

      getComponentByMfgType: () => $resource(CORE.API_URL + 'component/getComponentByMfgType',
        {
          listObj: '@_listObj'
        },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

      createComponentDriveTools: () => $resource(CORE.API_URL + 'component/createComponentDriveTools',
        {
          componentDriveToolsAlias: '@_componentObj'
        }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getComponentDriveToolsList: () => $resource(CORE.API_URL + 'component/getComponentDriveToolsList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      deleteDriveToolComponent: () => $resource(CORE.API_URL + 'component/deleteDriveToolComponent', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getCustomerAlias: () => $resource(CORE.API_URL + 'component/getCustomerAlias/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getComponentAlternetAliasByID: () => $resource(CORE.API_URL + 'component/getComponentAlternetAliasByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getComponentROHSAlternetAliasByID: () => $resource(CORE.API_URL + 'component/getComponentROHSAlternetAliasByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getComponentPackagingAliasByID: () => $resource(CORE.API_URL + 'component/getComponentPackagingAliasByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveGenericAlias: () => $resource(CORE.API_URL + 'ComponentGenericAlias/saveGenericAlias',
        {
          query: {
            method: 'POST',
            isArray: true
          }
        }),
      getComponentGenericAlias: () => $resource(CORE.API_URL + 'ComponentGenericAlias/getComponentGenericAlias', {},
        {
          query: {
            method: 'GET',
            isArray: false
          }
        }),

      getComponentPIDCode: () => $resource(CORE.API_URL + 'component/getComponentPIDCode', {},
        {
          query: {
            method: 'GET',
            isArray: false
          }
        }),

      updateComponentAlias: () => $resource(CORE.API_URL + 'component/updateComponentAlias', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),

      createComponentProcessMaterial: () => $resource(CORE.API_URL + 'component/createComponentProcessMaterial',
        {
          componentObj: '@_componentObj'
        }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getComponenProcessMaterialList: () => $resource(CORE.API_URL + 'component/getComponenProcessMaterialList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),


      getComponentProcessMaterialGroupByCompomentID: () => $resource(CORE.API_URL + 'component/getComponentProcessMaterialGroupByCompomentID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      deleteComponentProcessMaterial: () => $resource(CORE.API_URL + 'component/deleteComponentProcessMaterial', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveApiVerificationResult: () => $resource(CORE.API_URL + 'component/saveApiVerificationResult', {
        apiVerification: '@_apiVerification'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getPricingHistroy: (param) => $resource(CORE.API_URL + 'component/getPricingHistroy/', {
      }, {
        query: {
          method: 'GET',
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            componentID: param && param.componentID ? param.componentID : null,
            fromDate: param && param.fromDate ? param.fromDate : null,
            toDate: param && param.toDate ? param.toDate : null,
            supplierID: param && param.supplierID ? param.supplierID : null,
            priceFilter: param && param.priceFilter ? param.priceFilter : null,
            isMfg: param && param.isMfg ? param.isMfg : false,
            Type: param.Type
          }
        }
      }),
      getNoneMountComponent: () => $resource(CORE.API_URL + 'component/getNoneMountComponent', {
        components: '@_components'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveNoneMountComponent: () => $resource(CORE.API_URL + 'component/saveNoneMountComponent', {
        componentList: '@_componentList'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      userVerifiedComponent: () => $resource(CORE.API_URL + 'component/userVerifiedComponent', { listObj: '@_listObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getConnecterTypeList: () => $resource(CORE.API_URL + 'rfqconnector/getConnecterTypeList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getComponentStatusList: (param) => $resource(CORE.API_URL + 'component/getComponentStatusList', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && (param.Page || param.Page === 0) ? param.Page : 1,
            pageSize: param && (param.pageSize || param.pageSize === 0) ? param.pageSize : CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),

      getNoneTypeComponent: () => $resource(CORE.API_URL + 'component/getNoneTypeComponent', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      updateComponentStatus: () => $resource(CORE.API_URL + 'component/updateComponentStatus', { componentStatus: '@_componentStatus' },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      getrefreshComponent: () => $resource(CORE.API_URL + 'component/getrefreshComponent', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getcomponentPackagingaliaslist: () => $resource(CORE.API_URL + 'component/getcomponentPackagingaliaslist', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      /*While change in this API please take care same change on part master detail, add part popup and select part popup also*/
      getComponentDetailByMfgPN: () => $resource(CORE.API_URL + 'component/getComponentDetailByMfgPN', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentOtherPartList: () => $resource(CORE.API_URL + 'component/getComponentOtherPartList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      createComponentOtherPart: () => $resource(CORE.API_URL + 'component/createComponentOtherPart', {
        componentAlternetAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteComponentOtherPart: () => $resource(CORE.API_URL + 'component/deleteComponentOtherPart', {
        componentAlternetAlias: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getComponentFunctionalTestingEquipmentList: () => $resource(CORE.API_URL + 'component/getFunctionaltestingEquipmentList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      createComponentFunctionalTestingEquipment: () => $resource(CORE.API_URL + 'component/createFunctionalTestingEquipment', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteComponentFunctionalTestingEquipment: () => $resource(CORE.API_URL + 'component/deleteFunctionalTestingEquipment', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentFunctionalTestingEquipmentSearch: () => $resource(CORE.API_URL + 'component/getComponentFunctionalTestingEquipmentSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getFunctionalTypePartList: () => $resource(CORE.API_URL + 'component/getFunctionalTypePartList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveFunctionalTypePart: () => $resource(CORE.API_URL + 'component/saveFunctionalTypePart', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteFunctionalTypePart: () => $resource(CORE.API_URL + 'component/deleteFunctionalTypePart', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getMountingTypePartList: () => $resource(CORE.API_URL + 'component/getMountingTypePartList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveMountingTypePart: () => $resource(CORE.API_URL + 'component/saveMountingTypePart', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteMountingTypePart: () => $resource(CORE.API_URL + 'component/deleteMountingTypePart', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentAlternetPartList: () => $resource(CORE.API_URL + 'component/getAlternetPartList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getProcessMaterialPartGridList: () => $resource(CORE.API_URL + 'component/getProcessMaterialPartGridList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getFunctionaltestingEquipmentGridList: () => $resource(CORE.API_URL + 'component/getFunctionaltestingEquipmentGridList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getComponentPossibleAlternetPartList: () => $resource(CORE.API_URL + 'component/getPossibleAlternetPartList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getComponentGoodPart: () => $resource(CORE.API_URL + 'component/getComponentGoodPart/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getComponentBasicDetails: () => $resource(CORE.API_URL + 'component/getComponentBasicDetails', {
        componentObj: '@_componentObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      createComponentImage: () => $resource(CORE.API_URL + 'component/createComponentImage', {
        componentImage: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createComponentImageUrls: () => $resource(CORE.API_URL + 'component/createComponentImageUrls', {
        componentImage: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentImages: () => $resource(CORE.API_URL + 'component/getComponentImages/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      deleteComponentImages: () => $resource(CORE.API_URL + 'component/deleteComponentImages', {
        componentImage: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateComponentDefaultImage: () => $resource(CORE.API_URL + 'component/updateComponentDefaultImage', {
        imageDataObj: '@_imageDataObj'
      },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      getComponentAlternatePnValidations: () => $resource(CORE.API_URL + 'component/getComponentAlternatePnValidations', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getStockStatus: () => $resource(CORE.API_URL + 'component/getStockStatus/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getComponentPackgingParts: () => $resource(CORE.API_URL + 'component/getComponentPackgingParts', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getComponentCPNList: () => $resource(CORE.API_URL + 'component/getComponentCPNList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getComponentBuyDetail: () => $resource(CORE.API_URL + 'component/getComponentBuyDetail/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getComponentExternalValues: () => $resource(CORE.API_URL + 'component/getComponentExternalValues', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getComponentTemperatureSensitiveDataList: () => $resource(CORE.API_URL + 'component/getComponentTemperatureSensitiveDataList/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentTemperatureSensitiveDataByID: () => $resource(CORE.API_URL + 'component/getComponentTemperatureSensitiveDataByID/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      createComponentTemperatureSensitiveData: () => $resource(CORE.API_URL + 'component/createComponentTemperatureSensitiveData', {
        tempDataObj: '@_tempDataObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateComponentTemperatureSensitiveData: () => $resource(CORE.API_URL + 'component/updateComponentTemperatureSensitiveData', {
        tempDataObj: '@_tempDataObj'
      },
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      deleteComponentTemperatureSensitiveData: () => $resource(CORE.API_URL + 'component/deleteComponentTemperatureSensitiveData/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkPartUsedAsPackagingAlias: () => $resource(CORE.API_URL + 'component/checkPartUsedAsPackagingAlias/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      checkPartUsedAsAlternatePart: () => $resource(CORE.API_URL + 'component/checkPartUsedAsAlternatePart/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      checkPartUsedAsRoHSAlternatePart: () => $resource(CORE.API_URL + 'component/checkPartUsedAsRoHSAlternatePart/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retrieveComponentWithPackagaingAlias: () => $resource(CORE.API_URL + 'component/retrieveComponentWithPackagaingAlias', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getComponentKitAllocationDetail: () => $resource(CORE.API_URL + 'component/getComponentKitAllocationDetail/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getComponentHistory: () => $resource(CORE.API_URL + 'component/getComponentHistory', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPartDetailFromExternalApi: () => $resource(CORE.API_URL + 'pricingapi/getPartDetailFromExternalApi', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getComponentDataSheetUrls: () => $resource(CORE.API_URL + 'component/getComponentDataSheetUrls/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getAllocatedKitByPart: () => $resource(CORE.API_URL + 'component/getAllocatedKitByPart', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentListForPartStat: (objIDs) => $http.post(CORE.API_URL + 'component/getComponentListForPartStat', {
        objIDs: objIDs
      }, { responseType: 'arraybuffer' }).then((response) => response,
        (error) => error),
      getPartPriceBreakDetails: () => $resource(CORE.API_URL + 'component/getPartPriceBreakDetails', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getAssemblySalesPriceDetails: () => $resource(CORE.API_URL + 'component/getAssemblySalesPriceDetails', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getPartDynamicAttributeDetails: () => $resource(CORE.API_URL + 'component/getPartDynamicAttributeDetails', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updatePartsPriceBreakDetails: () => $resource(CORE.API_URL + 'component/updatePartsPriceBreakDetails', {},
        {
          query: {
            isArray: false,
            method: 'PUT'
          }
        }),
      copyPartDetail: () => $resource(CORE.API_URL + 'component/copyPartDetail', {
        copyPartDetailObj: '@_copyPartDetailObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createAssemblyRevision: () => $resource(CORE.API_URL + 'component/createAssemblyRevision', {
        copyPartDetailObj: '@_copyPartDetailObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentMaxTemperatureData: () => $resource(CORE.API_URL + 'component/getComponentMaxTemperatureData/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getPartUsageDetail: () => $resource(CORE.API_URL + 'component/getPartUsageDetail', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getComponentCPNAliasSearch: () => $resource(CORE.API_URL + 'component/getComponentCPNAliasSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getExternalFunctionalAndMountingTypeValueList: () => $resource(CORE.API_URL + 'component/getExternalFunctionalAndMountingTypeValueList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssemblyRevisionList: () => $resource(CORE.API_URL + 'component/getAssemblyRevisionList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPartDynamicAttributeList: () => $resource(CORE.API_URL + 'operationalattributes/getPartDynamicAttributeList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      deleteComponentAttributeMapping: () => $resource(CORE.API_URL + 'ComponentDynamicAttributeMappingPart/deleteComponentAttributeMapping', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removePartStatus: () => $resource(CORE.API_URL + 'pricingapi/removePartStatus', {

      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentDynamicAttributeMappingPartList: (param) => $resource(CORE.API_URL + 'ComponentDynamicAttributeMappingPart/:id',
        {
          id: '@_id'
        },
        {
          query: {
            isArray: false,
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
            }
          },
          update: {
            method: 'PUT'
          }
        }),
      updateComponentAttributes: () => $resource(CORE.API_URL + 'component/updateComponentAttributes', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createComponentAcceptableShippingCountry: () => $resource(CORE.API_URL + 'component/createComponentAcceptableShippingCountry', {
        objData: '@_objData'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteComponentAcceptableShippingCountry: () => $resource(CORE.API_URL + 'component/deleteComponentAcceptableShippingCountry', {
        objData: '@_objData'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveComponentAcceptableShippingCountryList: (param) => $resource(CORE.API_URL + 'component/retriveComponentAcceptableShippingCountryList/:id', { id: '@_id' },
        {
          query: {
            isArray: false,
            method: 'GET',
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
            }
          }
        }),
      getComponentActivityStartTime: () => $resource(CORE.API_URL + 'component/getComponentActivityStartTime', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllAssemblyBySearch: () => $resource(CORE.API_URL + 'component/getAllAssemblyBySearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllAssyFilterList: () => $resource(CORE.API_URL + 'component/getAllAssyFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllAssyListWitoutSOCreated: () => $resource(CORE.API_URL + 'component/getAllAssyListWitoutSOCreated', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateMFGPPIDCodeOfComponent: () => $resource(CORE.API_URL + 'component/updateMFGPPIDCodeOfComponent', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllPurchaseInspectionRequirement: () => $resource(CORE.API_URL + 'comp_inspect_req_det/getAllPurchaseInspectionRequirement', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deletePurchaseInspectionRequirement: () => $resource(CORE.API_URL + 'comp_inspect_req_det/deletePurchaseInspectionRequirement', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getInspectionDetailBySeach: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/getInspectionDetailBySeach', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getInspectionTemplateBySeach: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/getInspectionTemplateBySeach', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPartRequirementCategoryBySearch: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/getPartRequirementCategoryBySearch', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseRequirementByTemplateId: () => $resource(CORE.API_URL + 'purchaseinspectiontemplate/getPurchaseRequirementByTemplateId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      addPurchaseInspectionRequirement: () => $resource(CORE.API_URL + 'comp_inspect_req_det/addPurchaseInspectionRequirement', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseInspectionRequirementByPartId: () => $resource(CORE.API_URL + 'comp_inspect_req_det/getPurchaseInspectionRequirementByPartId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPartMasterCommentsByPartId: () => $resource(CORE.API_URL + 'comp_inspect_req_det/getPartMasterCommentsByPartId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPartMasterInternalCommentsByPartId: () => $resource(CORE.API_URL + 'comments/getPartMasterInternalCommentsByPartId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkComponentApprovedSupplierUnique: () => $resource(CORE.API_URL + 'component/checkComponentApprovedSupplierUnique', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSupplierNotAddedList: () => $resource(CORE.API_URL + 'component/retrieveSupplierNotAddedList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSupplierAddedList: () => $resource(CORE.API_URL + 'component/retrieveSupplierAddedList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveComponentApprovedSupplier: () => $resource(CORE.API_URL + 'component/retriveComponentApprovedSupplier', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveComponentApprovedSupplier: () => $resource(CORE.API_URL + 'component/saveComponentApprovedSupplier', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveComponentApprovedSupplierPriority: () => $resource(CORE.API_URL + 'component/saveComponentApprovedSupplierPriority', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteComponentApprovedSupplier: () => $resource(CORE.API_URL + 'component/deleteComponentApprovedSupplier', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      stopExternalPartUpdate: () => $resource(CORE.API_URL + 'pricingapi/stopExternalPartUpdate', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllNickNameFilterList: () => $resource(CORE.API_URL + 'component/getAllNickNameFilterList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentDetailByPN: () => $resource(CORE.API_URL + 'component/getComponentDetailByPN', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      uploadComponentDataSheets: () => $resource(CORE.API_URL + 'component/uploadComponentDataSheets', {
        componentImage: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentMFGAliasSearchPurchaseOrder: () => $resource(CORE.API_URL + 'component/getComponentMFGAliasSearchPurchaseOrder', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      exportSampleFilterTemplate: (mfgType) => $http.post(CORE.API_URL + 'component/exportSampleFilterTemplate', { mfgType }, { responseType: 'arraybuffer' })
        .then((response) =>
          response
          , (error) => error),
      retrieveComponentHeaderCountDetail: () => $resource(CORE.API_URL + 'component/retrieveComponentHeaderCountDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      validateDuplicatePIDCode: () => $resource(CORE.API_URL + 'component/validateDuplicatePIDCode',
        {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      validateDuplicateMFRPN: () => $resource(CORE.API_URL + 'component/validateDuplicateMFRPN',
        {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkAlternateAliasValidations: () => $resource(CORE.API_URL + 'component/CheckAlternateAliasValidations', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getProgressiveFilters: () => $resource(CORE.API_URL + 'component/getProgressiveFilters', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getNoneProgressiveFilters: () => $resource(CORE.API_URL + 'component/getNoneProgressiveFilters', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCommentsSize: () => $resource(CORE.API_URL + 'component/getCommentsSize/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getComponentPartStatus: () => $resource(CORE.API_URL + 'component/getComponentPartStatus', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentMFGPIDCodeAliasSearch: () => $resource(CORE.API_URL + 'component/getComponentMFGPIDCodeAliasSearch', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentKitScrappedQty: () => $resource(CORE.API_URL + 'component/getComponentKitScrappedQty', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      getOddelyRefDesList: () => $resource(CORE.API_URL + 'component/getOddelyRefDesList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveOddlyNamedRefDes: () => $resource(CORE.API_URL + 'component/saveOddlyNamedRefDes', {
        componentObj: '@_componentObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      importComponentDetail: () => $resource(CORE.API_URL + 'component/importComponentDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getVerificationMPNList: () => $resource(CORE.API_URL + 'component/getVerificationMPNList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      stopImportPartVerification: () => $resource(CORE.API_URL + 'component/stopImportPartVerification', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUserImportTransctionId: () => $resource(CORE.API_URL + 'component/getUserImportTransctionId', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      removeImportMPNMappDet: () => $resource(CORE.API_URL + 'component/removeImportMPNMappDet', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      reVerifyMPNImport: () => $resource(CORE.API_URL + 'component/reVerifyMPNImport', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();

(function () {
    'use strict';

    angular
        .module('app.admin.customer')
        .factory('CustomerFactory', CustomerFactory);

    /** @ngInject */
    function CustomerFactory($resource, CORE) {
      return {
        customer: (param) => $resource(CORE.API_URL + 'customers/:id/:customerType', {
          username: '@_id'
        }, {
          query: {
            isArray: false,
            method: 'GET',
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

        customerAddressList: () => $resource(CORE.API_URL + 'customer_addresses/customerAddressList', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),


        saveCustomerAddresses: () => $resource(CORE.API_URL + 'customer_addresses/saveCustomerAddresses', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

        saveCustPN: () => $resource(CORE.API_URL + 'customers/saveCustPN', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

        findCustPN: () => $resource(CORE.API_URL + 'customers/findCustPN', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

        //saveCustMFGPN: () =>  $resource(CORE.API_URL + 'customers/saveCustMFGPN', {
        //}, {
        //    query: {
        //        isArray: false,
        //        method: 'POST',
        //    },
        //}),

        saveCustImport: () => $resource(CORE.API_URL + 'customers/saveCustImport',
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),
        saveCustPartNumber: () => $resource(CORE.API_URL + 'customers/saveCustPartNumber',
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),

        //deleteCustPartNumber: () => $resource(CORE.API_URL + 'customers/deleteCustPartNumber', {
        //    objIDs: '@_objIDs',
        //}, {
        //    query: {
        //        method: 'POST',
        //        isArray: false
        //    }
        //}),

        updateCustomerAddresses: () => $resource(CORE.API_URL + 'customer_addresses/updateCustomerAddresses', {
        }, {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),

        customerContactperson: () => $resource(CORE.API_URL + 'customer_contactperson/:personId', {
          personId: '@_personId'
        }, {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),

        setCustomerAddressesDefault: () => $resource(CORE.API_URL + 'customer_addresses/setCustomerAddressesDefault', {
        }, {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),

        getCustomers: () => $resource(CORE.API_URL + 'customers/getCustomers', {},
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),

        getSupllier: () => $resource(CORE.API_URL + 'customers/getSupplier', {},
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),

        // deleteCustomerContactPerson: () => $resource(CORE.API_URL + 'customer_contactperson/deleteCustomerContactPerson', {
        //   objDelete: '@_objDelete'
        // }, {
        //   query: {
        //     method: 'POST',
        //     isArray: false
        //   }
        // }),

        deleteCustomerAddresses: () => $resource(CORE.API_URL + 'customer_addresses/deleteCustomerAddresses', {
          objDelete: '@_objDelete'
        }, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),

        getCustomerContactPersons: () => $resource(CORE.API_URL + 'customer_contactperson/getCustomerContactPersons', { },
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),

        getCustomerAddress: () => $resource(CORE.API_URL + 'customer_addresses/:id', { id: '@_id' },
          {
            query: {
              isArray: false,
              method: 'GET'
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
        getSupplier: () => $resource(CORE.API_URL + 'customers/getSupplier', {},
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),
        checkDuplicateCompanyName: () => $resource(CORE.API_URL + 'customers/checkDuplicateCompanyName', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        //updateCustomerIsActiveStatus: () =>  $resource(CORE.API_URL + 'customers/updateCustomerIsActiveStatus', {
        //}, {
        //    query: {
        //        isArray: false,
        //        method: 'POST',
        //    },
        //}),
        checkDuplicateCustomerCode: () => $resource(CORE.API_URL + 'customers/checkDuplicateCustomerCode', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        getCustomerContactPersonList: () => $resource(CORE.API_URL + 'customer_contactperson/getCustomerContactPersonList', {
        }, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        getAddressForSupplierPayment: () => $resource(CORE.API_URL + 'customer_addresses/getAddressForSupplierPayment', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getAllCustomerComment: () => $resource(CORE.API_URL + 'mfgcode/getAllCustomerComment', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        deleteCustomerComment: () => $resource(CORE.API_URL + 'mfgcode/deleteCustomerComment', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        addCustomerComment: () => $resource(CORE.API_URL + 'mfgcode/addCustomerComment', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        getCustomerCommentsById: () => $resource(CORE.API_URL + 'mfgcode/getCustomerCommentsById', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        getCustomerCommentsCount: () => $resource(CORE.API_URL + 'mfgcode/getCustomerCommentsCount', {}, {
          query: {
            method: 'GET',
            isArray: false
          }
        }),
        setDefaultContactPersonForCustAddr: () => $resource(CORE.API_URL + 'customer_addresses/setDefaultContactPersonForCustAddr', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        setCustContactPersonDefault: () => $resource(CORE.API_URL + 'customer_contactperson/setCustContactPersonDefault', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        })
      };
    }
})();

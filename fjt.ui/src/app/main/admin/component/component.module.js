(function () {
  'use strict';

  angular
    .module('app.admin.component', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider
      .state(USER.ADMIN_COMPONENT_STATE, {
        url: USER.ADMIN_COMPONENT_ROUTE,
        // --- [SHUBHAM - 26/04/2021] - Bug 32840: QA Testing of User Story 32164: Improvement list page of Part (Performance)
        //views: {
        //    'content@app': {
        //        templateUrl: USER.ADMIN_COMPONENT_VIEW,
        //        controller: USER.ADMIN_COMPONENT_CONTROLLER,
        //        controllerAs: CORE.CONTROLLER_AS
        //    }
        //},
        data: {
          autoActivateChild: USER.ADMIN_MFG_COMPONENT_STATE,
          restrictReload: true
        }
      })
      .state(USER.ADMIN_MFG_COMPONENT_STATE, {
        url: USER.ADMIN_MFG_COMPONENT_ROUTE,
        params: {
          mfgType: CORE.MFG_TYPE.MFG.toLowerCase()
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_COMPONENT_VIEW,
            controller: USER.ADMIN_COMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_DIST_COMPONENT_STATE, {
        url: USER.ADMIN_DIST_COMPONENT_ROUTE,
        params: {
          mfgType: CORE.MFG_TYPE.DIST.toLowerCase()
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_COMPONENT_VIEW,
            controller: USER.ADMIN_COMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_ROUTE,
        //views: {
        //  'content@app': {
        //    templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
        //    controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
        //    controllerAs: CORE.CONTROLLER_AS
        //  }
        //}
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_ROUTE,
        //views: {
        //  'content@app': {
        //    templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
        //    controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
        //    controllerAs: CORE.CONTROLLER_AS
        //  }
        //}
      })
      .state(USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Detail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Detail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_PO_LIST_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_PO_LIST_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.POList.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_PO_LIST_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_PO_LIST_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.POList.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_STANDARDS_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_STANDARDS_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Standard.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_STANDARDS_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_STANDARDS_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Standard.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_DOCUMENT_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_DOCUMENT_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Document.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Document.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_DATAFIELDS_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_DATAFIELDS_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.DataFields.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_DATAFIELDS_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_DATAFIELDS_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.DataFields.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_OTHERDETAIL_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_OTHERDETAIL_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.OtherDetail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_OTHERDETAIL_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_OTHERDETAIL_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.OtherDetail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_PRICINGHISTORY_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_PRICINGHISTORY_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.PricingHistory.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_PRICINGHISTORY_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_PRICINGHISTORY_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.PricingHistory.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_SPLRQUOTE_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_SPLRQUOTE_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.SupplierQuote.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_SPLRQUOTE_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_SPLRQUOTE_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.SupplierQuote.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_CUSTOMERLOA_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_CUSTOMERLOA_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.CustomerLOA.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })

      .state(USER.ADMIN_MANAGEDISTCOMPONENT_CUSTOMERLOA_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_CUSTOMERLOA_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.CustomerLOA.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_COMMENTS_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_COMMENTS_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Comments.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_COMMENTS_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_COMMENTS_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.Comments.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_BOM_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.BOM.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_BOM_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_BOM_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.BOM.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_RFQ_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_RFQ_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.RFQ.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_RFQ_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_RFQ_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.RFQ.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_OPENING_STOCK_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_OPENING_STOCK_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.OpeningStock.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.OpeningStock.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_SUPPLIER_API_RESPONSE_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_SUPPLIER_API_RESPONSE_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.SupplierApiResponse.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_SUPPLIER_API_RESPONSE_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_SUPPLIER_API_RESPONSE_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.SupplierApiResponse.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.AssemblySalesPriceMatrix.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_COMPONENT_HISTORY_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_COMPONENT_HISTORY_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.ComponentHistory.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_COMPONENT_HISTORY_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_COMPONENT_HISTORY_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.ComponentHistory.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_KIT_ALLOCATION_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_KIT_ALLOCATION_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.KitAllocation.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_KIT_ALLOCATION_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_KIT_ALLOCATION_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.KitAllocation.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGECOMPONENT_UMID_LIST_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_UMID_LIST_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.UMIDList.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.UMIDList.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_MANAGECOMPONENT_WORKORDER_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_WORKORDER_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.WorkorderList.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEDISTCOMPONENT_WORKORDER_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_WORKORDER_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.WorkorderList.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_MANAGECOMPONENT_DFM_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_DFM_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.DFM.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_MANAGEDISTCOMPONENT_DFM_STATE, {
        url: USER.ADMIN_MANAGEDISTCOMPONENT_DFM_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.DFM.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_STATE, {
        url: USER.ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_TAB_ROUTE,
        params: {
          selectedTab: USER.PartMasterTabs.ApprovedDisapprovedSupplier.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGECOMPONENT_VIEW,
            controller: USER.ADMIN_MANAGECOMPONENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();

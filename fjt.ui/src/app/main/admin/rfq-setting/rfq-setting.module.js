(function () {
    'use strict';

    angular
        .module('app.admin.rfqsetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_JOB_TYPE_STATE, {
            url: USER.ADMIN_JOB_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_JOB_TYPE_VIEW,
                    controller: USER.ADMIN_JOB_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_RFQ_LINEITEMS_ERRORCODE_STATE, {
            url: USER.ADMIN_RFQ_LINEITEMS_ERRORCODE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_RFQ_LINEITEMS_ERRORCODE_VIEW,
                    controller: USER.ADMIN_RFQ_LINEITEMS_ERRORCODE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_RFQ_TYPE_STATE, {
            url: USER.ADMIN_RFQ_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_RFQ_TYPE_VIEW,
                    controller: USER.ADMIN_RFQ_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_REASON_STATE, {
            url: USER.ADMIN_REASON_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_REASON_VIEW,
                    controller: USER.ADMIN_REASON_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            data: {
                autoActivateChild: USER.ADMIN_RFQ_REASON_STATE
            }
        });
        $stateProvider.state(USER.ADMIN_ADDITIONAL_REQUIREMENT_STATE, {
            url: USER.ADMIN_ADDITIONAL_REQUIREMENT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ADDITIONAL_REQUIREMENT_VIEW,
                    controller: USER.ADMIN_ADDITIONAL_REQUIREMENT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_NARRATIVE_MASTER_TEMPLATE_STATE, {
            url: USER.ADMIN_NARRATIVE_MASTER_TEMPLATE_ROUTE,
            params: {
                category: '3'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_NARRATIVE_MASTER_TEMPLATE_VIEW,
                    controller: USER.ADMIN_NARRATIVE_MASTER_TEMPLATE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_MOUNTING_TYPE_STATE, {
            url: USER.ADMIN_MOUNTING_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MOUNTING_TYPE_VIEW,
                    controller: USER.ADMIN_MOUNTING_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_PACKAGE_CASE_TYPE_STATE, {
            url: USER.ADMIN_PACKAGE_CASE_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PACKAGE_CASE_TYPE_VIEW,
                    controller: USER.ADMIN_PACKAGE_CASE_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_CONNECTER_TYPE_STATE, {
            url: USER.ADMIN_CONNECTER_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_CONNECTER_TYPE_VIEW,
                    controller: USER.ADMIN_CONNECTER_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_ROHS_STATE, {
            url: USER.ADMIN_ROHS_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ROHS_VIEW,
                    controller: USER.ADMIN_ROHS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_RFQ_REASON_STATE, {
            url: USER.ADMIN_RFQ_REASON_ROUTE,
            params: {
                reasonId: CORE.Reason_Type.RFQ.id
            },
            views: {
                'rfq': {
                    templateUrl: USER.ADMIN_RFQ_REASON_VIEW,
                    controller: USER.ADMIN_RFQ_REASON_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });


        $stateProvider.state(USER.ADMIN_BOM_REASON_STATE, {
            url: USER.ADMIN_BOM_REASON_ROUTE,
            params: {
                reasonId: CORE.Reason_Type.BOM.id
            },
            views: {
                'billofmaterial': {
                    templateUrl: USER.ADMIN_RFQ_REASON_VIEW,
                    controller: USER.ADMIN_RFQ_REASON_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_INVOICE_APPROVED_REASON_STATE, {
            url: USER.ADMIN_INVOICE_APPROVED_REASON_ROUTE,
            params: {
                reasonId: CORE.Reason_Type.INVOICE_APPROVE.id
            },
            views: {
                'invoiceapprovedreason': {
                    templateUrl: USER.ADMIN_RFQ_REASON_VIEW,
                    controller: USER.ADMIN_RFQ_REASON_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_KIT_RELEASE_COMMENT_STATE, {
            url: USER.ADMIN_KIT_RELEASE_COMMENT_ROUTE,
            params: {
                reasonId: CORE.Reason_Type.KIT_RELEASE_COMMENT.id
            },
            views: {
                'kitreleasecomment': {
                    templateUrl: USER.ADMIN_RFQ_REASON_VIEW,
                    controller: USER.ADMIN_RFQ_REASON_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_PART_TYPE_STATE, {
            url: USER.ADMIN_PART_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PART_TYPE_VIEW,
                    controller: USER.ADMIN_PART_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_KEYWORD_STATE, {
            url: USER.ADMIN_KEYWORD_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_KEYWORD_VIEW,
                    controller: USER.ADMIN_KEYWORD_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_QUOTE_DYNAMIC_FIELDS_STATE, {
            url: USER.ADMIN_QUOTE_DYNAMIC_FIELDS_ROUTE,
            params: {
                type: CORE.ATTRIBUTE_TYPE.RFQ
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_QUOTE_DYNAMIC_FIELDS_VIEW,
                    controller: USER.ADMIN_QUOTE_DYNAMIC_FIELDS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE, {
            url: USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_ROUTE,
            params: {
                type: CORE.ATTRIBUTE_TYPE.SUPPLIER
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_QUOTE_DYNAMIC_FIELDS_VIEW,
                    controller: USER.ADMIN_QUOTE_DYNAMIC_FIELDS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_COST_CATEGORY_STATE, {
            url: USER.ADMIN_COST_CATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_COST_CATEGORY_VIEW,
                    controller: USER.ADMIN_COST_CATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_RFQ_CATEGORY_STATE, {
            url: USER.ADMIN_RFQ_CATEGORY_ROUTE,
            params: {
                categoryType: '2'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ECO_CATEGORY_VIEW,
                    controller: USER.ADMIN_ECO_CATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_RFQ_CATEGORY_VALUES_STATE, {
            url: USER.ADMIN_RFQ_CATEGORY_VALUES_ROUTE,
            params: {
                categoryType: '2'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ECO_CATEGORY_VALUES_VIEW,
                    controller: USER.ADMIN_ECO_CATEGORY_VALUES_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_PACKAGING_TYPE_STATE, {
            url: USER.ADMIN_PACKAGING_TYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PACKAGING_TYPE_VIEW,
                    controller: USER.ADMIN_PACKAGING_TYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_PART_STATUS_STATE, {
            url: USER.ADMIN_PART_STATUS_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PART_STATUS_VIEW,
                    controller: USER.ADMIN_PART_STATUS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_STATE, {
            url: USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_VIEW,
                    controller: USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_LABOR_COST_TEMPLATE_STATE, {
            url: USER.ADMIN_LABOR_COST_TEMPLATE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_LABOR_COST_TEMPLATE_VIEW,
                    controller: USER.ADMIN_LABOR_COST_TEMPLATE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        $stateProvider.state(USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE, {
            url: USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_VIEW,
                    controller: USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }
})();

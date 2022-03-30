(function () {
  'use strict';
  /** @ngInject */
  var REPORTS = {
    FIELD_DATATYPES: {
      TEXT: 'text',
      LONGTEXT: 'longtext',
      DATE: 'date',
      TIME: 'time',
      DATETIME: 'datetime',
      DECIMAL: 'decimal',
      INT: 'int',
      BIGINT: 'bigint'
    },

    ReportOperation: {
      Add: 'Add',
      Update: 'Update'
    },

    REPORT_FILTER_FIELD_OPTIONS: {
      Not_Applicable: 0,
      Optional: 1,
      Mendatory: 2
    },

    PERSONNEL_REPORT_NAME: 'Personnel Burndown Report',

    // Base route
    REPORTS_LABEL: 'Reports',
    REPORTS_ROUTE: '/reports',
    REPORTS_STATE: 'app.reports',
    REPORTS_CONTROLLER: '',
    REPORTS_VIEW: '',

    MIS_REPORT__LABEL: 'MIS',
    MIS_REPORT_ROUTE: '/misreport',
    MIS_REPORT_STATE: 'app.misreportlist',
    MIS_REPORT_CONTROLLER: 'MISReportController',
    MIS_REPORT_VIEW: 'app/main/reports/mis-report/mis-report-list.html',

    REPORT_SETTING_LIST_LABEL: 'Report List',
    REPORT_SETTING_LIST_ROUTE: '/report',
    REPORT_SETTING_LIST_STATE: 'app.reportlist',
    REPORT_SETTING_LIST_CONTROLLER: 'ReportListController',
    REPORT_SETTING_LIST_VIEW: 'app/main/reports/report-setting/report-setting-list.html',

    MANAGE_REPORT_DETAIL_MODAL_VIEW: 'app/main/reports/mis-report/dynamic-report-detail-popup/dynamic-report-detail-popup.html',
    MANAGE_REPORT_DETAIL_MODAL_CONTROLLER: 'DynamicReportDetailPopupController',

    PO_STATUS_REPORT_STATE: 'app.postatusreport',
    PO_STATUS_REPORT_ROUTE: '/postatusreport',
    PO_STATUS_REPORT_CONTROLLER: 'POStatusReportMainController',
    PO_STATUS_REPORT_VIEW: 'app/main/reports/po-status-report/postatus-step-main.html',

    PO_STATUS_CUSTOMER_REPORT_STATE: 'app.postatusreport.customer',
    PO_STATUS_CUSTOMER_REPORT_ROUTE: '/customer/:customerID',
    PO_STATUS_CUSTOMER_REPORT_CONTROLLER: 'POStatusStepCustomerController',
    PO_STATUS_CUSTOMER_REPORT_VIEW: 'app/main/reports/po-status-report/postatus-step-customer.html',

    PO_STATUS_PO_REPORT_STATE: 'app.postatusreport.po',
    PO_STATUS_PO_REPORT_ROUTE: '/po/:customerID/:salesOrderID',
    PO_STATUS_PO_REPORT_CONTROLLER: 'POStatusStepPODetailsController',
    PO_STATUS_PO_REPORT_VIEW: 'app/main/reports/po-status-report/postatus-step-po-details.html',

    PO_STATUS_ASSY_REPORT_STATE: 'app.postatusreport.assembly',
    PO_STATUS_ASSY_REPORT_ROUTE: '/assembly/:customerID/:salesOrderDetID/:partID',
    PO_STATUS_ASSY_REPORT_CONTROLLER: 'POStatusStepAssemblyController',
    PO_STATUS_ASSY_REPORT_VIEW: 'app/main/reports/po-status-report/postatus-step-assembly.html',

    PO_STATUS_WORKORDER_REPORT_STATE: 'app.postatusreport.workorder',
    PO_STATUS_WORKORDER_REPORT_ROUTE: '/workorder/:salesOrderDetID/:woID',
    PO_STATUS_WORKORDER_REPORT_CONTROLLER: 'POStatusStepWorkOrderController',
    PO_STATUS_WORKORDER_REPORT_VIEW: 'app/main/reports/po-status-report/postatus-step-workorder.html',


    WORKORDER_DATAELEMENT_ROUTE: '/wodataelementreport',
    WORKORDER_DATAELEMENT_STATE: 'app.wodataelementreport',
    WORKORDER_DATAELEMENT_CONTROLLER: 'WorkorderDataelementController',
    WORKORDER_DATAELEMENT_VIEW: 'app/main/reports/workorder-dataelement/workorder-dataelement-list.html',

    WORKORDER_NARRATIVE_HISTORY_ROUTE: '/narrativehistory/:woID',
    WORKORDER_NARRATIVE_HISTORY_STATE: 'app.narrativehistory',
    WORKORDER_NARRATIVE_HISTORY_CONTROLLER: 'WorkorderNarrativeHistoryController',
    WORKORDER_NARRATIVE_HISTORY_VIEW: 'app/main/reports/workorder-narrative-history/workorder-narrative-history.html',

    /* View work order trans sub form values popup*/
    VIEW_WO_TRANS_SUBFORM_VALUES_MODAL_VIEW: 'app/main/reports/workorder-dataelement/view-wo-trans-subform-values-popup/view-wo-trans-subform-values-popup.html',
    VIEW_WO_TRANS_SUBFORM_VALUES_MODAL_CONTROLLER: 'ViewWOTransSubFormValuesPopupController',

    /* View work order trans equipment sub form values popup*/
    VIEW_WO_TRANS_EQP_SUBFORM_VALUES_MODAL_VIEW: 'app/main/reports/workorder-dataelement/view-wo-trans-eqp-subform-values-popup/view-wo-trans-eqp-subform-values-popup.html',
    VIEW_WO_TRANS_EQP_SUBFORM_VALUES_MODAL_CONTROLLER: 'ViewWOTransEqpSubFormValuesPopupController',

    TRAN_WISE_WO_DATAELEMENT_ROUTE: '/tranwisewodataelement',
    TRAN_WISE_WO_DATAELEMENT_STATE: 'app.tranwisewodataelement',
    TRAN_WISE_WO_DATAELEMENT_CONTROLLER: 'TranwiseWODataElementMainController',
    TRAN_WISE_WO_DATAELEMENT_ENTITY_VIEW: 'app/main/reports/transaction-wise-wo-dataelement/transaction-wise-wo-dataelement.html',

    MANAGE_MIS_REPORT_EMPLOYEE_CONTROLLER: 'MISReportEmployeePopupController',
    MANAGE_MIS_REPORT_EMPLOYEE_VIEW: 'app/main/reports/mis-report/mis-report-employee-popup/mis-report-employee-popup.html',

    REPORTS_EMPTYSTATE: {
      MIS_COMMON_REPORT: {
        IMAGEURL: 'assets/images/emptystate/mis-reports.png',
        MESSAGE: 'No information available!',
      },
      LOADDETAILS: {
        IMAGEURL: 'assets/images/emptystate/po-status.png',
        MESSAGE: 'No customer selected yet!',
      },
      NoSalesOrder: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No sales order added yet!',
        ADDNEWMESSAGE: 'Click below to add a sales order'
      },
      NoRecordFound: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No details found for {0}',
        OPERATION_MSG: 'No operation details found for {0}'
      },
      OPERATION_DATAELEMENT_REPORT: {
        IMAGEURL: 'assets/images/emptystate/work-order-data-fields.png',
        MESSAGE: 'No information available for operation data fields!',
      },
      EQUIPMENT_DATAELEMENT_REPORT: {
        IMAGEURL: 'assets/images/emptystate/equipment-data.png',
        MESSAGE: 'No information available for equipment data fields!',
      },
      ASSIGNEMPLOYEES: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'No personnel are assigned.',
        ALL_ASSIGNED: 'All personnel are assigned.',
        ADDNEWMESSAGE: 'Click below to add a personnel',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      REPORT_SETTING: {
        IMAGEURL: 'assets/images/emptystate/report.png',
        MESSAGE: 'No reports available!',
        FILTER_IMAGEURL: 'assets/images/emptystate/filter.png',
        FILTER_NOT_AVAILABLE_MESSAGE: 'Filter options not available for selected report.'
      },
      PART_USAGE_REPORT: {
        IMAGEURL: 'assets/images/emptystate/mis-reports.png',
        MESSAGE: 'No details available for applied filter criteria!',
      },
      CUSTOMER_PO_MAIN: {
        IMAGEURL: 'assets/images/emptystate/customer-po-status-report.png',
        MESSAGE: 'Please select customer to view details.',
      }
    },
    Mis_report_default_field_width: '300',

    /* For binding status in ui-grid header filter generic category */
    reportTypeGridHeaderDropdown: [
      { id: null, value: 'All' },
      {
        id: 'Summary', value: 'Summary'
      },
      {
        id: 'Detail', value: 'Detail'
      }],
    reportTypeDropdown: [
      {
        id: 0, value: 'Summary'
      },
      {
        id: 1, value: 'Detail'
      }],
    ReportRadioButtonOption: {
      RadioButtonNoneValue: 0,
      ObsoletePartReportOption: [
        { name: "Include All Alternates and RoHS Replacement Parts", value: 1 },
        { name: "Include Alternates Parts Only", value: 2 },
        { name: "Include RoHS Replacement Parts Only", value: 3 },
        { name: "Exclude Alternates when RoHS Replacement Parts is Available", value: 4 },
      ]
    },
    ReportList: {
      ObsoletePartReport: "Obsolete Part Details Per Assembly"
    }
  };
  angular
    .module('app.reports.misreport')
    .constant('REPORTS', REPORTS);
})();

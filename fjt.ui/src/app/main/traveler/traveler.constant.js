(function () {
  'use strict';
  /** @ngInject */
  var TRAVELER = {

    TRAVELER_LABEL: 'Traveler',
    TRAVELER_ROUTE: '/traveler',
    TRAVELER_STATE: 'app.traveler',
    TRAVELER_CONTROLLER: '',
    TRAVELER_VIEW: '',
    TRAVELER_PAGE_STATE: 'app.task.tasklist',

    TRAVELER_MANAGE_LABEL: 'Traveler',
    TRAVELER_MANAGE_ROUTE: '/travel/:woOPID/:employeeID/:homeOPID',
    TRAVELER_MANAGE_STATE: 'app.task.tasklist.traveler',
    TRAVELER_MANAGE_CONTROLLER: 'ManageTravelerController',
    TRAVELER_MANAGE_VIEW: 'app/main/traveler/travelers/manage-travelers.html',

    TRAVELER_MANAGE_ALL_ROUTE: '/travel/:woOPID',
    TRAVELER_MANAGE_ALL_STATE: 'app.traveler.manage',

    CHECKIN_MODAL_VIEW: 'app/main/traveler/travelers/check-in/check-in-operation-popup.html',
    CHECKIN_MODAL_CONTROLLER: 'CheckInPopupController',

    RESUME_MODAL_VIEW: 'app/main/traveler/travelers/resume-operation-popup/resume-operation-popup.html',
    RESUME_MODAL_CONTROLLER: 'ResumePopupController',

    CHECKOUT_MODAL_VIEW: 'app/main/traveler/travelers/check-out/check-out-operation-popup.html',
    CHECKOUT_MODAL_CONTROLLER: 'CheckOutPopupController',

    PRODUCTION_STOCK_MODAL_VIEW: 'app/main/traveler/travelers/production-stock/production-stock-popup.html',
    PRODUCTION_STOCK_MODAL_CONTROLLER: 'ProductionStockPopupController',

    ADD_PRODUCTION_STOCK_MODAL_VIEW: 'app/main/traveler/travelers/add-production-stock/add-production-stock-popup.html',
    ADD_PRODUCTION_STOCK_MODAL_CONTROLLER: 'AddProductionStockPopupController',

    CHANGE_REQUEST_MODAL_VIEW: 'app/main/traveler/travelers/change-request/change-request-popup.html',
    CHANGE_REQUEST_MODAL_CONTROLLER: 'ChangeRequestPopupController',

    SERIAL_NUMBER_MODAL_VIEW: 'app/main/traveler/travelers/serial-number/serial-number-popup.html',
    SERIAL_NUMBER_MODEL_CONTROLLER: 'SerialNumberPopupController',

    SERIAL_NUMBER_TRANS_HISTORY_VIEW: 'app/main/traveler/travelers/serial-number/serial-number-history/serial-number-history-popup.html',
    SERIAL_NUMBER_TRANS_HISTORY_CONTROLLER: 'SerialNumberTransHistoryPopupController',

    TRAVELER_MODAL_VIEW: 'app/main/traveler/travelers/traveler-history/traveler-history-popup.html',
    TRAVELER_MODAL_CONTROLLER: 'TravelerHistoryPopupController',

    EDIT_TRAVELER_HISTORY_VIEW: 'app/main/traveler/travelers/traveler-history/edit-traveler-history-popup.html',
    EDIT_TRAVELER_HISTORY_CONTROLLER: 'EditTravelerHistoryPopupController',

    OPERATION_HOLD_UNHOLD_MODEL_CONTROLLER: 'OperationHoldUnholdPopUpController',
    OPERATION_HOLD_UNHOLD_MODEL_VIEW: 'app/main/traveler/travelers/operation-hold-unhold-popup/operation-hold-unhold-popup.html',

    WORKORDER_HOLD_UNHOLD_MODEL_CONTROLLER: 'WorkorderHoldUnholdPopUpController',
    WORKORDER_HOLD_UNHOLD_MODEL_VIEW: 'app/main/traveler/travelers/workorder-hold-unhold-popup/workorder-hold-unhold-popup.html',

    PREPROGRAM_COMPONENT_ADD_MODAL_CONTROLLER: 'AddPreprogramComponentPopupController',
    PREPROGRAM_COMPONENT_ADD_MODAL_VIEW: 'app/main/traveler/travelers/preprogram-component/add-preprogram-component-popup.html',

    TERMINATE_OPERATION_MODAL_CONTROLLER: 'TerminateOperationPopupController',
    TERMINATE_OPERATION_MODAL_VIEW: 'app/main/traveler/travelers/terminate-operation-popup/terminate-operation-popup.html',

    TERMINATE_OPERATION_HISTORY_MODAL_CONTROLLER: 'TerminateOperationHistoryPopupController',
    TERMINATE_OPERATION_HISTORY_MODAL_VIEW: 'app/main/traveler/travelers/terminate-operation-history-popup/terminate-operation-history-popup.html',


    BOX_SERIAL_POPUP_CONTROLLER: 'BoxSerialPopupController',
    BOX_SERIAL_POPUP_VIEW: 'app/main/traveler/travelers/box-serials/box-serials-popup.html',

    ADD_NARRATIVE_DETAILS_POPUP_CONTROLLER: 'AddHistoryNarrativePopupController',
    ADD_NARRATIVE_DETAILS_POPUP_VIEW: 'app/view/add-narrative-details-popup/add-narrative-details-popup.html',

    SCAN_FEEDER_COMPONENT_MODAL_CONTROLLER: 'ScanFeederComponentController',
    SCAN_FEEDER_COMPONENT_MODAL_VIEW: 'app/view/scan-feeder-component-popup/scan-feeder-component-popup.html',

    SCAN_UMID_COMPONENT_MODAL_CONTROLLER: 'ScanUMIDComponentPopupController',
    SCAN_UMID_COMPONENT_MODAL_VIEW: 'app/view/scan-umid-component-popup/scan-umid-component-popup.html',

    SCAN_UMID_MISSING_COMPONENT_MODAL_CONTROLLER: 'ScanUMIDMissingComponentPopupController',
    SCAN_UMID_MISSING_COMPONENT_MODAL_VIEW: 'app/view/scan-umid-missing-component-popup/scan-umid-missing-component-popup.html',

    FEEDER_SCAN_FAILED_MODAL_CONTROLLER: 'FeederScanFailedPopupController',
    FEEDER_SCAN_FAILED_MODAL_VIEW: 'app/view/feeder-scan-failed-popup/feeder-scan-failed-popup.html',

    TRAVELER_CHANGE_FEEDER_DETAILS_CONTROLLER: 'FeederChangeHistoryController',
    TRAVELER_CHANGE_FEEDER_DETAILS_VIEW: 'app/view/feeder-change-history-popup/feeder-change-history-popup.html',

    TRAVELER_VERIFICATION_FEEDER_DETAILS_CONTROLLER: 'FeederVerificationHistoryPopupController',
    TRAVELER_VERIFICATION_FEEDER_DETAILS_VIEW: 'app/view/feeder-verification-history-popup/feeder-verification-history-popup.html',

    /*Pop-up for view UMID history*/
    SCAN_UMID_VIEW_HISTORY_MODAL_CONTROLLER: 'ScanUmidViewHistoryController',
    SCAN_UMID_VIEW_HISTORY_MODAL_VIEW: 'app/view/scan-umid-view-history/scan-umid-view-history-popup.html',

    /*Pop-up for view expired and expiring part details (wo op wise) */
    VIEW_EXPIRE_PARTS_MODAL_CONTROLLER: 'ViewExpirePartsPopUpController',
    VIEW_EXPIRE_PARTS_MODAL_VIEW: 'app/main/traveler/travelers/view-expire-parts-popup/view-expire-parts-popup.html',

    /*Pop-up for view active UMID feeder list*/
    UMID_ACTIVE_FEEDER_MODAL_CONTROLLER: 'umidActiveFeederListController',
    UMID_ACTIVE_FEEDER_MODAL_VIEW: 'app/main/traveler/travelers/umid-active-feeder-list-popup/umid-active-feeder-list-popup.html',

    /**
     * CONTROLLERS
     */

    TRAVELER_EMPTYSTATE: {
      DEFECT_CATEGORY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No defect category added yet!'
      },
      DEFECT: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No defects logged yet!'
      },
      ASSEMBLY_STOCK: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'No Production Stock is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a Production Stock'
      },
      INOUT: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No Personnel Start/Stop History!'
      },
      DESIGNATORS: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No designators added yet!'
      },
      COMPONENT_DESIGANATORS: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No parts logged yet!'
      },
      COMPONENT: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No parts added yet!'
      },
      WO_TRANSFER_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No history logged yet!'
      },
      TERMINATE_WORKORDER: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No quantity to transfer!'
      },
      REPROCESS_QTY_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'Reprocess required quantity history not logged yet!'
      },
      WO_NARRATIVE_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder-narrative-history.png',
        MESSAGE: 'No result matching your search criteria!'
      },
      FEEDER_CHANGE_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No feeder change history found!',
      },
      FEEDER_VERIFICATION_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No feeder verification history found!',
      },
      PRE_PROGRAMMING_PART: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No pre-programming parts logged yet!'
      },
    },
    INVITE_USER_TYPE: { InviteUser: 'I', CoOwner: 'C', Owner: 'O' },
    RACK_STATUS: [{ id: 1, value: 'Passed' }, { id: 5, value: 'Rework' }, { id: 4, value: 'Scrapped' }, { id: 4, value: 'Scrapped' }, { id: 3, value: 'Defect Observed' }, { id: 2, value: 'Reprocess Required' }]
  };
  angular
    .module('app.traveler.travelers')
    .constant('TRAVELER', TRAVELER);
})();

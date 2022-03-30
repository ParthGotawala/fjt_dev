(function () {
    'use strict';
    /** @ngInject */
    var CUSTOMFORMS = {

        //CUSTOMFORMS_LABEL: 'CustomForms',
        //CUSTOMFORMS_ROUTE: '/customforms',
        //CUSTOMFORMS_STATE: 'app.customforms',
        //CUSTOMFORMS_CONTROLLER: '',
        //CUSTOMFORMS_VIEW: '',

        CUSTOMFORMS_ENTITY_LABEL: 'Custom Forms Entity',
        CUSTOMFORMS_ENTITY_ROUTE: '/customformsentity',
        CUSTOMFORMS_ENTITY_STATE: 'app.customformsentity',
        CUSTOMFORMS_ENTITY_CONTROLLER: 'CustomFormsEntityMainController',
        CUSTOMFORMS_ENTITY_VIEW: 'app/main/dynamic-master/entity/dynamic-master-entity-step-main.html',

        CUSTOMFORMS_ENTITY_LIST_STATE: 'app.customformsentity.dataelementlist',
        CUSTOMFORMS_ENTITY_LIST_VIEW: 'app/main/dynamic-master/entity/dynamic-master-dataelement-list.html',
        CUSTOMFORMS_ENTITY_LIST_ROUTE: '/dataelementlist/:entityID',
        CUSTOMFORMS_ENTITY_LIST_CONTROLLER: 'CustomFormsDataElementListController',

        CUSTOMFORMS_MANAGE_ENTITY_STATE: 'app.customformsentity.managedataelement',
        CUSTOMFORMS_MANAGE_ENTITY_VIEW: 'app/main/dynamic-master/entity/dynamic-master-manage-dataelement.html',
        CUSTOMFORMS_MANAGE_ENTITY_ROUTE: '/managedataelement/:entityID/:refTransID',
        CUSTOMFORMS_MANAGE_ENTITY_CONTROLLER: 'ManageCustomFormsDataElementController',

        CUSTOMFORMS_ENTITY_HISTORY_STATE: 'app.customformsentity.dataelementhistory',
        CUSTOMFORMS_ENTITY_HISTORY_VIEW: 'app/main/dynamic-master/entity/dynamic-master-dataelement-history-popup.html',
        CUSTOMFORMS_ENTITY_HISTORY_ROUTE: '/dataelementhistory/:entityID',
        CUSTOMFORMS_ENTITY_HISTORY_CONTROLLER: 'CustomFormsDataElementHistoryPopupController',

        /* View sub form values popup*/
        VIEW_SUBFORM_VALUES_MODAL_VIEW: 'app/main/dynamic-master/entity/view-subform-values-popup/view-subform-values-popup.html',
        VIEW_SUBFORM_VALUES_MODAL_CONTROLLER: 'ViewSubFormValuesPopupController',
        

        CUSTOMFORMS_EMPTYSTATE: {
            ENTITY: {
                IMAGEURL: 'assets/images/emptystate/custom-form-empty.png',
                MESSAGE: 'No custom form is listed yet!',
                ADDNEWMESSAGE: 'Click below to add a custom form'
            },
            DATA_ELEMENT: {
                IMAGEURL: 'assets/images/emptystate/manageelement.png',
                MESSAGE: 'No data is listed yet!',
                ADDNEWMESSAGE: 'Click below to add a record'
            },
            HISTORY: {
              IMAGEURL: 'assets/images/emptystate/manageelement.png',
              MESSAGE: 'No history found!'              
            },
        },
    };
    angular
       .module('app.customforms.entity')
       .constant('CUSTOMFORMS', CUSTOMFORMS);
})();

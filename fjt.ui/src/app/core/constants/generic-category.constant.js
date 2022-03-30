(function () {
    'use strict';

    angular.module('app.core').constant('GenericCategoryConstant', {
        OPERATION_TYPE: {
            MANUFACTURING_PROCESS: { gencCategoryName: 'Manufacturing Process', gencCategoryCode: 'MP' },
            INSPECTION_PROCESS: { gencCategoryName: 'Inspection Process', gencCategoryCode: 'IP' },
            SETUP_PROCESS: { gencCategoryName: 'Setup Process', gencCategoryCode: 'SP' },
            PACKING_PROCESS: { gencCategoryName: 'Packing Process', gencCategoryCode: 'PP' },
            LABELING_PROCESS: { gencCategoryName: 'Labeling Process', gencCategoryCode: 'LP' },
        }
    });
})();
(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderCertificationFactory', WorkorderCertificationFactory);

    /** @ngInject */
    function WorkorderCertificationFactory($resource, CORE) {
        return {
            createWorkorder_CertificateList: () => $resource(CORE.API_URL + 'workorder_certification/createWorkorder_CertificateList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getWorkorderAllStandardList: () => $resource(CORE.API_URL + 'workorder_certification/getWorkorderAllStandardList', {
                workorderObj: '@_workorderObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }
})();
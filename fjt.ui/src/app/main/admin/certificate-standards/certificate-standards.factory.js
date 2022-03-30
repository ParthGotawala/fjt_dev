(function () {
    'use strict';

    angular
        .module('app.admin.certificate-standard')
        .factory('CertificateStandardFactory', CertificateStandardFactory);

    /** @ngInject */
    function CertificateStandardFactory($resource, CORE) {
        return {
            retriveCertificateStandardsList: () => $resource(CORE.API_URL + 'certificatestandards/retriveCertificateStandardsList', {
            }, {
              query: {
                method: 'POST',
                isArray: false
              }
            }),

            retriveCertificateStandards: () =>  $resource(CORE.API_URL + 'certificatestandards/retriveCertificateStandards/:id/:isPermanentDelete', {
                id: '@_id',
                isPermanentDelete: '@_isPermanentDelete'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),

            createCertificateStandard: () =>  $resource(CORE.API_URL + 'certificatestandards/createCertificateStandard', {
            }, {
                isArray: false,
                method: 'POST'
            }),

            updateCertificateStandard: () =>  $resource(CORE.API_URL + 'certificatestandards/updateCertificateStandard/:id/:isPermanentDelete', {
                id: '@_id',
                isPermanentDelete: '@_isPermanentDelete'
            }, {
                update: {
                    method: 'PUT'
                }
            }),

            getCertificateStandardList: () => $resource(CORE.API_URL + 'certificatestandards/getCertificateStandardList', {
                workorderObj: '@_workorderObj'
            },
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getCertificateStandard: () => $resource(CORE.API_URL + 'certificatestandards/getCertificateStandard', {},
                {
                    query: {
                        isArray: false,
                        method: 'POST'
                    }
                }),
            getCertificateStandardRole: () => $resource(CORE.API_URL + 'certificatestandards/getCertificateStandardRole', {},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                }),
            standardClass: () =>  $resource(CORE.API_URL + 'standardClass/:id', {
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

            treeviewData: () =>  $resource(CORE.API_URL + 'certificatestandards/treeviewData/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {}
                }
            }),
            deleteCertificateStandard: () => $resource(CORE.API_URL + 'certificatestandards/deleteCertificateStandard', {
                listObj: '@_listObj'
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            checkDuplicateStandard: () => $resource(CORE.API_URL + 'certificatestandards/checkDuplicateStandard', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            checkDuplicateStandardCode: () => $resource(CORE.API_URL + 'certificatestandards/checkDuplicateStandardCode', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteCertificateStandardImage: () => $resource(CORE.API_URL + 'certificatestandards/deleteCertificateStandardImage', {
              imageObj: '@_imageObj'
            }, {
                query: {
                  method: 'POST',
                  isArray: false
                }
              })
        };
    }
})();

(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('exportFeederTemplate', exportFeederTemplate);

  /** @ngInject */
  function exportFeederTemplate($state, $timeout, WorkorderOperationEquipmentFactory, BaseService, CORE, DialogFactory) {
    var directive = {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'app/directives/custom/export-feeder-template/export-feeder-template.html',
      link: function (scope, element, attrs) {
        scope.downloadDocument = (type, event) => {
          let messageContent;
          scope.templateType = { fileType: type };
          scope.cgBusyLoading = WorkorderOperationEquipmentFactory.downloadEquipmentFeederTemplate(scope.templateType.fileType).then((response) => {            
            if (response.status === 404) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
              DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
            } else if (response.status === 403) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
              DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
            } else if (response.status === 401) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
              DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
            }
            else {
              const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
              if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, scope.templateType.fileType + '.xlsx');
              } else {
                const link = document.createElement('a');
                if (link.download !== undefined) {
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  link.setAttribute('download', scope.templateType.fileType + '.xlsx');
                  link.style = 'visibility:hidden';
                  document.body.appendChild(link);
                  $timeout(() => {
                    link.click();
                    document.body.removeChild(link);
                  });
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };
      }
    };
    return directive;
  }
})();




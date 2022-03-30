(function () {
  'use strict';

  angular
    .module('app.transaction.warehousebin')
    .controller('WareHouseBinController', WareHouseBinController);

  /** @ngInject */
  function WareHouseBinController($rootScope, $state, $timeout, BaseService, DialogFactory, TRANSACTION, WarehouseBinFactory, CORE, NotificationFactory, socketConnectionService, $scope, Upload) {
    const vm = this;
    vm.currentState = $state.current.name;
    vm.loginUser = BaseService.loginUser;
    vm.TRANSACTION_WAREHOUSE_LABEL = TRANSACTION.TRANSACTION_WAREHOUSE_LABEL;
    vm.TRANSACTION_BIN_LABEL = TRANSACTION.TRANSACTION_BIN_LABEL;
    vm.isFoundAnyWarehouse = false;
    vm.isFoundAnyBin = false;
    const allowedFileType = 'csv';
    vm.moduleName = CORE.Warehouse_Bin.WAREHOUSE.title;
    vm.binModuleName = CORE.Warehouse_Bin.BIN.title;
    vm.tabList = [];
    vm.tabList = [
      { src: TRANSACTION.TRANSACTION_WAREHOUSE_STATE, title: TRANSACTION.TRANSACTION_WAREHOUSE_LABEL },
      { src: TRANSACTION.TRANSACTION_BIN_STATE, title: TRANSACTION.TRANSACTION_BIN_LABEL }
    ];
    switch (vm.currentState) {
      case TRANSACTION.TRANSACTION_WAREHOUSE_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_WAREHOUSE_LABEL;
        break;
      case TRANSACTION.TRANSACTION_BIN_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_BIN_LABEL;
        break;
    }
    /* add.edit defect category*/
    vm.addEditRecordBin = (data, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER,
        TRANSACTION.TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.addEditRecordWarehouse = (data, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
        TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
        ev,
        data).then(() => {
        }, () => {
        },
          (err) => BaseService.getErrorLog(err));
    };

    /**
     * Send request to check status of all smart cart
     * @param {any} $event
     */
    vm.checkCartStatus = () => {
      $rootScope.$emit('checkCartStatus');
      vm.cgBusyLoading = WarehouseBinFactory.sendRequestToCheckStatusOfAllCarts().query({
        TransactionID: getGUID()
      }).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //send cancel request for all  checked-in wh
    vm.cancelCheckinRequest = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHECKIN_CANCEL_ALL_CONFIRM);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.isresetRequest = true;
        const objTrans = {
          ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
          ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
        };
        WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
      return;
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
    }


    $scope.$on('$destroy', () => {
      removeSocketListener();
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect',()=> {
      removeSocketListener();
    });

    //received details for cancel request to cancel all checkin wh
    function updateCancelRequestStatus(req) {
      if (req.allRequest && vm.isresetRequest) {
        NotificationFactory.success(CORE.MESSAGE_CONSTANT.CANCEL_CHECKIN_SUCCESS);
        vm.isresetRequest = false;
      }
    }

    //Import warehouse data
    vm.documentFiles = (file) => {
      let messageContent;
      if (file.length > 0) {
        let ext = null;
        _.each(file, (item) => {
          ext = (item.name).substr((item.name).lastIndexOf('.') + 1);
        });
        if (!ext || ext !== allowedFileType) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, allowedFileType);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model);
        }
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SURE_TO_IMPORT_GENERICCATEGRY_FILE);
        messageContent.message = stringFormat(messageContent.message, vm.moduleName);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = Upload.upload({
              url: `${CORE.API_URL}warehouse/uploadWarehouseDocuments`,
              method: 'POST',
              data: {
                documents: file,
                categoryType: vm.moduleName
              }
            }).progress((evt) => {
              file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).then((res) => {
              if (!res.data.status) {
                downloadFile(res.data, vm.moduleName);
              }
              $rootScope.$emit('WarehouseEvent');
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const downloadDoc = (response, module) => {
      let messageContent;
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
        downloadFile(response.data, module);
      }
    };

    const downloadFile = (response, module) => {
      const blob = new Blob([response], { type: 'text/csv' });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, module + '.csv');
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', module + '.csv');
          link.style = 'visibility:hidden';
          document.body.appendChild(link);
          $timeout(() => {
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    };

    //Export template of warehouse
    vm.downloadDocument = () => {
      vm.isDownloadDisable = true;
      vm.cgBusyLoading = WarehouseBinFactory.downloadWarehouseTemplate(vm.moduleName).then((response) => {
        downloadDoc(response, vm.moduleName);
        vm.isDownloadDisable = false;
      }).catch((error) => {
        vm.isDownloadDisable = false;
        return BaseService.getErrorLog(error);
      });
    };
    vm.downloadDocumentBin = () => {
      vm.cgBusyLoading = WarehouseBinFactory.downloadBinTemplate().then((response) => {
        downloadDoc(response, vm.binModuleName);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Import Bin data
    vm.documentFilesBin = (file) => {
      let messageContent;
      if (file.length > 0) {
        let ext = null;
        _.each(file, (item) => {
          ext = (item.name).substr((item.name).lastIndexOf('.') + 1);
        });
        if (!ext || ext !== allowedFileType) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, allowedFileType);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model);
        }
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SURE_TO_IMPORT_GENERICCATEGRY_FILE);
        messageContent.message = stringFormat(messageContent.message, vm.binModuleName);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = Upload.upload({
              url: `${CORE.API_URL}binmst/importBin`,
              method: 'POST',
              data: {
                documents: file
              }
            }).progress((evt) => {
              file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).then((res) => {
              if (!res.data.status) {
                downloadFile(res.data, vm.binModuleName);
              }
              $rootScope.$emit('BinEvent');
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.openAuditPage = (ev, item) => {
      const data = {
        rightSideWHLabel: item ? item.entity.rightSideWHLabel : item
      };
      DialogFactory.dialogService(
        CORE.AUDIT_MODAL_CONTROLLER,
        CORE.AUDIT_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        },
          (err) => BaseService.getErrorLog(err));
    };
  }
})();

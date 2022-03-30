(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PrintLabelPopupController', PrintLabelPopupController);

  /** @ngInject */
  function PrintLabelPopupController($q, $mdDialog, $timeout, $scope, data, CORE, USER, BaseService, ReceivingMaterialFactory, LabelTemplatesFactory, UserFactory, TRANSACTION, WORKORDER) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.transaction = TRANSACTION;
    vm.workorder = WORKORDER;
    vm.loginUserID = BaseService.loginUser.userid;
    vm.printlabel = {};
    let selectedRecord = [];
    vm.renderUMIDList = data.renderUMIDList && data.renderUMIDList.length > 0 ? data.renderUMIDList : [];
    if (data.selectedRecord && !data.printSingleRecord) {
      vm.printSingleRecord = false;
      selectedRecord = data.selectedRecord;
    } else {
      vm.printSingleRecord = true;
    }
    if (data) {
      vm.uid = data.uid;
    }
    vm.pageName = data.pageName;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    const PrinterStorageValue = getLocalStorageValue('Printer');
    let defaultLabelTemplateObj = null;
    let defaultLabelTemplateObjForPage = null;
    const InitautoComplete = () => {
      vm.autoCompleteUID = {
        columnName: 'uid',
        keyColumnName: 'uid',
        keyColumnId: null,
        inputName: 'UID',
        placeholderName: 'UID',
        isRequired: true,
        isAddnew: false
      };
      vm.autoCompletePrinter = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.user ? vm.user.printerID : null,
        inputName: CategoryTypeObjList.Printer.Name,
        inputId: 'printer',
        placeholderName: CategoryTypeObjList.Printer.Title,
        addData: { headerTitle: CategoryTypeObjList.Printer.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: (item) => {
          vm.PrintDetail = item;
          BaseService.setPrintStorage('Printer', item);
        }
      };
      vm.autoCompleteLabelTemplate = {
        columnName: 'Name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: CORE.LabelConstant.LabelTemplate.Name,
        placeholderName: CORE.LabelConstant.LabelTemplate.Title,
        isRequired: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: (item) => {
          vm.PrintFormatDetail = item;
          if (vm.pageName === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL) {
            updateLabelTemplate(item);
          }
        }
      };
    };
    if (data) {
      vm.ismenu = false;
      vm.printlabel.noprint = 1;
      if (vm.pageName === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL && vm.printSingleRecord) {
        getNumberOfPrintsForUMID(data.refcompid);
      }

      if (vm.pageName === TRANSACTION.TRANSACTION_WAREHOUSE_LABEL && vm.printSingleRecord) {
        vm.printlabel.warehouse = data.Name;
      }

      if (vm.pageName === TRANSACTION.TRANSACTION_BIN_LABEL && vm.printSingleRecord) {
        vm.printlabel.bin = data.Name;
      }

      if (vm.pageName === TRANSACTION.TRANSACTION_RACK_LABEL && vm.printSingleRecord) {
        vm.printlabel.rack = data.name;
      }

      if (vm.pageName === WORKORDER.WORKORDER_SERIAL_NUMBER_LABEL && vm.printSingleRecord) {
        vm.printlabel.SerialNo = data.SerialNo;
      }
    }
    else {
      vm.ismenu = true;
      getUidSearch();
    }

    $scope.$on('selectUMIDListRow', (event, data) => {
      if (data) {
        selectedRecord = data;
      }
    });

    /* dropdown fill up printer and label template data*/
    const getAutoCompleteData = () => LabelTemplatesFactory.getPrinterAndLabelTemplateData().query().$promise.then((autoCompleteData) => {
      vm.PrinterList = autoCompleteData.data.printer;
      vm.LabelTemplateList = autoCompleteData.data.labeltemplate;
      return $q.resolve(vm.LabelTemplateList);
    }).catch((error) => BaseService.getErrorLog(error));

    const getUserDetail = () => UserFactory.user().query({ id: vm.loginUserID })
      .$promise.then((users) => {
        if (users.data && users.data.user.length > 0) {
          vm.user = users.data.user[0];
        }
        return users.data.user;
      }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [getAutoCompleteData(), getUserDetail()];
    if (vm.ismenu) {
      autocompletePromise.push(getUidSearch());
    }
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      InitautoComplete();
      if (PrinterStorageValue && PrinterStorageValue.Printer) {
        vm.autoCompletePrinter.keyColumnId = PrinterStorageValue.Printer.gencCategoryID;
      }

      defaultLabelTemplateObj = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { name: (vm.pageName === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL ? 'UMID' : vm.pageName) });
      if (defaultLabelTemplateObj) {
        defaultLabelTemplateObjForPage = _.find(vm.LabelTemplateList, { defaultLabelTemplate: defaultLabelTemplateObj.ID });
      }

      if (defaultLabelTemplateObjForPage) {
        vm.autoCompleteLabelTemplate.keyColumnId = defaultLabelTemplateObjForPage.id;
      }
      $timeout(() => {
        vm.PrintLabel.$$controls[0].$setDirty();
      });
    }).catch((error) => BaseService.getErrorLog(error));

    function getUidSearch() {
      return ReceivingMaterialFactory.getUIDList().query({ query: '0' }).$promise.then((uidlist) => {
        if (uidlist && uidlist.data) {
          vm.uidDetail = uidlist.data;
          return uidlist.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getNumberOfPrintsForUMID(pid) {
      vm.cgBusyLoading = ReceivingMaterialFactory.getNumberOfPrintsForUMID().query({ id: pid }).$promise.then((printDetails) => {
        if (printDetails.data) {
          vm.printlabel.uid = vm.uid;
          const mslID = printDetails.data.mslID >= 2 ? 2 : 0;
          const numberOfPrintForUMID = printDetails.data.rfqMountingType.numberOfPrintForUMID ? printDetails.data.rfqMountingType.numberOfPrintForUMID : 1;
          vm.printlabel.noprint = (mslID && numberOfPrintForUMID) ? (mslID > numberOfPrintForUMID ? mslID : numberOfPrintForUMID) : numberOfPrintForUMID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.cancel = () => {
      vm.PrintLabel.$setPristine();
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel();
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.printBarcodeLabel = (printType) => {
      if (BaseService.focusRequiredField(vm.PrintLabel)) {
        return;
      }
      let printObj = {};
      const printList = [];
      if (vm.pageName === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL) {
        if (vm.printSingleRecord) {
          printObj = {
            ServiceName: vm.PrintFormatDetail.Name,
            reqName: 'Web Service',
            PrinterName: vm.PrintDetail.gencCategoryName,
            UID: vm.ismenu ? vm.autoCompleteUID.keyColumnId : vm.printlabel.uid,
            id: data.id,
            noPrint: vm.printlabel.noprint,
            isSucess: true,
            printType: printType
          };
          printList.push(printObj);
        } else {
          _.map(selectedRecord, (data) => {
            printObj = {
              'ServiceName': vm.PrintFormatDetail.Name,
              'reqName': 'Web Service',
              'PrinterName': vm.PrintDetail.gencCategoryName,
              'UID': data.uid,
              'id': data.id,
              'noPrint': vm.printlabel.noprint,
              'isSucess': true,
              'printType': printType
            };
            printList.push(printObj);
          });
        }
      }

      if (vm.pageName === TRANSACTION.TRANSACTION_WAREHOUSE_LABEL) {
        if (vm.printSingleRecord) {
          printObj = {
            ServiceName: vm.PrintFormatDetail.Name,
            reqName: 'Web Service',
            PrinterName: vm.PrintDetail.gencCategoryName,
            warehouseName: vm.printlabel.warehouse,
            noPrint: vm.printlabel.noprint,
            isSucess: true,
            printType: printType
          };
          printList.push(printObj);
        } else {
          _.map(selectedRecord, (data) => {
            printObj = {
              ServiceName: vm.PrintFormatDetail.Name,
              reqName: 'Web Service',
              PrinterName: vm.PrintDetail.gencCategoryName,
              warehouseName: data.Name,
              noPrint: vm.printlabel.noprint,
              isSucess: true,
              printType: printType
            };
            printList.push(printObj);
          });
        }
      }

      if (vm.pageName === TRANSACTION.TRANSACTION_BIN_LABEL) {
        if (vm.printSingleRecord) {
          printObj = {
            ServiceName: vm.PrintFormatDetail.Name,
            reqName: 'Web Service',
            PrinterName: vm.PrintDetail.gencCategoryName,
            binName: vm.printlabel.bin,
            noPrint: vm.printlabel.noprint,
            isSucess: true,
            printType: printType
          };
          printList.push(printObj);
        } else {
          _.map(selectedRecord, (data) => {
            printObj = {
              ServiceName: vm.PrintFormatDetail.Name,
              reqName: 'Web Service',
              PrinterName: vm.PrintDetail.gencCategoryName,
              binName: data.Name,
              noPrint: vm.printlabel.noprint,
              isSucess: true,
              printType: printType
            };
            printList.push(printObj);
          });
        }
      }

      if (vm.pageName === TRANSACTION.TRANSACTION_RACK_LABEL) {
        if (vm.printSingleRecord) {
          printObj = {
            ServiceName: vm.PrintFormatDetail.Name,
            reqName: 'Web Service',
            PrinterName: vm.PrintDetail.gencCategoryName,
            rackName: vm.printlabel.rack,
            noPrint: vm.printlabel.noprint,
            isSucess: true,
            printType: printType
          };
          printList.push(printObj);
        }
        else {
          _.map(selectedRecord, (data) => {
            printObj = {
              ServiceName: vm.PrintFormatDetail.Name,
              reqName: 'Web Service',
              PrinterName: vm.PrintDetail.gencCategoryName,
              rackName: data.name,
              noPrint: vm.printlabel.noprint,
              isSucess: true,
              printType: printType
            };
            printList.push(printObj);
          });
        }
      }

      if (vm.pageName === WORKORDER.WORKORDER_SERIAL_NUMBER_LABEL) {
        if (vm.printSingleRecord) {
          printObj = {
            ServiceName: vm.PrintFormatDetail.Name,
            reqName: 'Web Service',
            PrinterName: vm.PrintDetail.gencCategoryName,
            SerialNo: vm.printlabel.SerialNo,
            noPrint: vm.printlabel.noprint,
            isSucess: true,
            printType: printType,
            dateCode: data.dateCode
          };
          printList.push(printObj);
        }
        else {
          _.map(selectedRecord, (data) => {
            printObj = {
              ServiceName: vm.PrintFormatDetail.Name,
              reqName: 'Web Service',
              PrinterName: vm.PrintDetail.gencCategoryName,
              noPrint: vm.printlabel.noprint,
              isSucess: true,
              printType: printType,
              SerialNo: data.SerialNo,
              dateCode: data.dateCode
            };
            printList.push(printObj);
          });
        }
      }
      vm.PrintLabel.$setPristine();
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel(printList);
    };

    const updateLabelTemplate = (item) => {
      if (item) {
        const updateLableObject = {
          id: item.id,
          Name: item.Name,
          defaultLabelTemplate: defaultLabelTemplateObj.ID,
          isActive: item.isActive,
          isVerified: item.isVerified,
          isListPage: false,
          notShowNotifyMessage: true
        };

        LabelTemplatesFactory.updateLabelTemplate().query({
          listObj: updateLableObject
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.setPrintStorage('PrintFormateOfUMID', updateLableObject);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.goToPrinterList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, {});
    };

    vm.goToPrinterLabelList = () => {
      BaseService.openInNew(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {});
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    vm.goToWarehouseList = () => {
      BaseService.goToWHList();
    };

    vm.goToBinList = () => {
      BaseService.goToBinList();
    };
    vm.goToRackList = () => {
      BaseService.goToRackList();
    };
  }
})();

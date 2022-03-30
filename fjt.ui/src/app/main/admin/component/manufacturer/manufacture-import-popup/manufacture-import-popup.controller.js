(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ManufacturerImportPopupController', ManufacturerImportPopupController);

  /** @ngInject */
  function ManufacturerImportPopupController($mdDialog, $scope, $timeout, CORE, RFQTRANSACTION, data, BaseService, ManufacturerFactory, DialogFactory, hotRegisterer, ImportExportFactory) {
    var vm = this;
    var _mfrHeader = null;
    let _hotRegisterer = null;
    vm.apiVerificationErrorList = [];
    vm.mfgType = CORE.MFG_TYPE;
    vm.LabelConstant = CORE.LabelConstant;
    vm.uploadMappingType = angular.copy(CORE.uploadMappingType);
    vm.mappingType = vm.uploadMappingType.F.Key;
    vm.CommonFieldModel = CORE.CommonMFRImportFieldModel;
    vm.supplierMFRMappingType = CORE.supplierMFRMappingType;
    vm.ScanDocumentSide = CORE.ScanDocumentSide;
    vm.supplierAuthorize = CORE.SUPPLIER_AUTHORIZE_TYPE;
    vm.addressType = CORE.AddressType;
    vm.type = data.type;
    vm.isStatusPopupOpen = data.isStatusPopupOpen ? true : false;
    vm.isChanged = false;
    vm.replaceSalesCommissionTo = false;
    vm.IsManfucaturer = vm.type === vm.mfgType.MFG && !data.isCustOrDisty ? true : false;
    vm.IsCustomer = vm.type === vm.mfgType.MFG && data.isCustOrDisty ? true : false;
    vm.IsDistibuter = vm.type === vm.mfgType.DIST ? true : false;
    vm.fileName = null;
    vm.isfromHandsonTable = false;
    vm.importCustomerType = vm.IsCustomer ? vm.LabelConstant.MFG.Customer : vm.IsManfucaturer ? vm.LabelConstant.MFG.Manufacturer : vm.LabelConstant.MFG.Supplier;
    vm.handsontableMFRModel = [];
    vm.handsontableCustomerModel = [];

    /* Define Module Title/Code Title and Sales Commission detail by Module Flag */
    function defineModuleWiseDetail() {
      if (vm.IsManfucaturer) {
        vm.CodeTitle = vm.LabelConstant.MFG.MFGCode;
        vm.NameTitle = vm.LabelConstant.MFG.MFRName;
        _mfrHeader = CORE.MFG_COLUMN_MAPPING;
      } else if (vm.IsCustomer) {
        vm.CodeTitle = vm.LabelConstant.MFG.CustomerCode;
        vm.NameTitle = vm.LabelConstant.MFG.CustomerName;
        vm.SalesCommossionToTitle = vm.LabelConstant.Customer.SalesCommossionTo;
        _mfrHeader = CORE.CUSTOMER_COLUMN_MAPPING;
      } else if (vm.IsDistibuter) {
        vm.CodeTitle = vm.LabelConstant.MFG.SupplierCode;
        vm.NameTitle = vm.LabelConstant.MFG.SupplierName;
        _mfrHeader = CORE.SUPPLIER_COLUMN_MAPPING;
      }
      vm.handsontableMFRModel = [{ header: vm.CodeTitle, column: vm.CodeTitle }, { header: vm.NameTitle, column: vm.NameTitle }];
      vm.handsontableCustomerModel = [{ header: vm.CodeTitle, column: vm.CodeTitle }, { header: vm.SalesCommossionToTitle, column: vm.SalesCommossionToTitle }, { header: vm.NameTitle, column: vm.NameTitle }];
      vm.uploadMappingType.C2.Value = stringFormat(vm.uploadMappingType.C2.Value, vm.NameTitle);
    }
    defineModuleWiseDetail();

    function resetHandsontableDatails() {
      vm.DefaultColumn = 10;
      vm.headerMapping = [];
      vm.DefaultColumnList = [];
      vm.hansonModel = [[]];
      if (vm.mappingType === vm.uploadMappingType.C2.Key) {
        vm.DefaultColumn = 1;
        vm.DefaultColumnList.push(vm.NameTitle);
      }
      if (vm.DefaultColumn > 1) {
        for (let columnIndex = 0; columnIndex < vm.DefaultColumn; columnIndex++) {
          if (columnIndex === 0) {
            vm.DefaultColumnList.push(vm.CodeTitle);
          } else {
            if (columnIndex === 1 && vm.IsCustomer) {
              vm.DefaultColumnList.push(vm.SalesCommossionToTitle);
            } else {
              vm.DefaultColumnList.push(vm.NameTitle);
            }
          }
        }
      }

      if (vm.mappingType !== vm.uploadMappingType.F.Key) {
        // handsontable settings
        vm.settings = {
          rowHeaders: true,
          colWidths: 150,
          licenseKey: 'non-commercial-and-evaluation',
          colHeaders: vm.DefaultColumnList,
          columns: vm.DefaultColumnList,
          renderAllRows: false,
          minSpareRows: 20,
          minSpareCols: 0,
          maxCols: vm.DefaultColumn,
          fixedColumnsLeft: 0,
          stretchH: 'all',
          contextMenu: false,
          mergeCells: false,
          manualColumnResize: true,
          selectionMode: 'multiple',
          fillHandle: false,
          afterInit: function () {
            window.setTimeout(() => {
              _hotRegisterer = hotRegisterer.getInstance('hot-manufacture');
              if (_hotRegisterer) {
                _hotRegisterer.validateCells();
                _hotRegisterer.selectCell(0, 0);
              }
              setHandsontableHeight();
            });
          },
          afterCreateCol: function (index) {
            if (vm.mappingType === vm.uploadMappingType.C1.Key) {
              if (index === 0) {
                vm.settings.colHeaders[index] = vm.CodeTitle;
              }
              else {
                if (index === 1 && vm.IsCustomer) {
                  vm.settings.colHeaders[index] = vm.SalesCommossionToTitle;
                } else {
                  vm.settings.colHeaders[index] = vm.NameTitle;
                }
              }
            }
            if (vm.mappingType === vm.uploadMappingType.C2.Key && _hotRegisterer) {
              _hotRegisterer.updateSettings({
                hiddenColumns: {
                  columns: [1],
                  indicators: true
                }
              });
            }
          }
        };

        $timeout(() => {
          if (_hotRegisterer) {
            _hotRegisterer.render();
            _hotRegisterer.updateSettings({
              colHeaders: vm.DefaultColumnList,
              columns: vm.DefaultColumnList
            });
            if (vm.mappingType !== vm.uploadMappingType.C2.Key) {
              _hotRegisterer.updateSettings({
                minSpareCols: vm.DefaultColumn
              });
              _hotRegisterer.updateSettings({
                hiddenColumns: {
                  columns: [1],
                  indicators: true
                }
              });
            }
            setHandsontableHeight();
          }
        });
      }

      setHandsontableHeight();
    }
    resetHandsontableDatails();

    /* Add Watch on Scope Value for Make Pop-up state Dirty */
    $scope.$watch('vm.hansonModel', () => {
      if (_hotRegisterer) {
        vm.isfromHandsonTable = true;
        vm.isChanged = true;
        BaseService.currentPageFlagForm = [vm.isChanged];
      } else {
        vm.isfromHandsonTable = false;
      }
    }, true);

    // set handsontable full height to screen
    function setHandsontableHeight() {
      var offset = $('#hot-manufacture-container').offset();
      var docHeight = $(document).height();
      if (!offset) {
        return;
      }

      const handsontableHeight = docHeight - offset.top - 40;
      $('#hot-manufacture-container').height(handsontableHeight).css({
        overflow: 'hidden'
      });
      $('#hot-manufacture-container').width('auto');
      if (vm.DefaultColumn && vm.DefaultColumn < 10) {
        const width = vm.DefaultColumn * 25;
        $('#hot-manufacture-container').width(width + '%').css({
          overflow: 'hidden'
        });
      }
      else if (vm.mappingType === vm.uploadMappingType.C2.Key) {
        $('#hot-manufacture-container').width('auto');
      }
      //$("#hot-manufacture-container").height(handsontableHeight-145);
      $('#hot-manufacture-container .wtHolder').height(handsontableHeight);
      $('#hot-manufacture-container .wtHolder').width('auto');
    }

    /* On Pop-up size resize handsontable */
    $(window).resize(() => {
      handsontableresize();
    });

    /* On Calculate size handsontable */
    function handsontableresize() {
      var offset = $('#hot-manufacture-container').offset();

      if (!offset) {
        return;
      }
      const docHeight = $(document).height();
      const tableHeight = docHeight - offset.top - 40;
      $('#hot-manufacture-container .wtHolder').height(tableHeight);
    };

    /**
     * Select File for import data
     * @param {any} ev - event object of current position of button
     */
    vm.import = (ev) => {
      vm.event = ev;
      vm.headerMapping = [];
      vm.fileName = null;
      angular.element('#fiexcel').trigger('click');
    };

    /* Initialize option of Excel-Reader */
    vm.eroOptions = {
      workstart: function () {
      },
      workend: function () { },
      sheet: function (json, sheetnames, select_sheet_cb, file) {
        var type = file.name.split('.');
        vm.fileName = file.name;
        vm.isfromHandsonTable = false;
        vm.isChanged = true;
        BaseService.currentPageFlagForm = [vm.isChanged];
        if (!json || (Array.isArray(json) && _.isEmpty(json.flat()))) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UPLOAD_BLANK_CSV_EXCEL);
          messageContent.message = stringFormat(messageContent.message, type[type.length - 1]);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
        else if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1]) && json) {
          const data = {
            headers: _mfrHeader,
            excelHeaders: json[0],
            notquote: true,
            headerName: vm.importCustomerType
          };
          DialogFactory.dialogService(
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
            RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
            vm.event,
            data).then((result) => {
              json[0] = result.excelHeaders;
              vm.headerMapping = result.model;
              generateModel(json, result.model, data.excelHeaders, false);
            }, (err) => BaseService.getErrorLog(err));
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
          messageContent.message = stringFormat(messageContent.message, 'csv,xls');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      },
      badfile: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
        messageContent.message = stringFormat(messageContent.message, 'csv,xls');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      pending: function () {
      },
      failed: function () {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
        messageContent.message = stringFormat(messageContent.message, 'csv,xls');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      },
      large: function () {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ERROR,
          textContent: CORE.MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_SIZE_TEXT,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      },
      multiplefile: function () {

      }
    };

    // Create model from array
    function generateModel(uploadedMFR, mfrHeaders, excelHeader, isfromHandsonTable) {
      vm.isfromHandsonTable = isfromHandsonTable;
      vm.mfrmodel = [];
      // loop through excel data and bind into model
      let rowIndex = 1;
      const len = uploadedMFR.length;
      if (vm.isfromHandsonTable) {
        rowIndex = 0;
      }
      for (rowIndex; rowIndex < len; rowIndex++) {
        const item = uploadedMFR[rowIndex];
        const modelRow = {};
        modelRow.alias = [];
        excelHeader.forEach((column, index) => {
          if (!column) {
            return;
          }
          const obj = mfrHeaders.find((x) => x.column && x.column.toUpperCase() === column.toUpperCase());
          if (!obj) {
            return;
          }
          const field = _mfrHeader.find((x) => x.fieldName === obj.header);
          if (!modelRow[field.fieldName]) {
            modelRow[field.fieldName] = item[index] ? item[index] : null;
          } else {
            const nameObj = {
              name: item[index] ? item[index] : null
            };
            modelRow.alias.push(nameObj);
          }
        });
        vm.mfrmodel.push(modelRow);
      };
      //vm.uploadedMFR = vm.isfromHandsonTable ? angular.copy(uploadedMFR) : [];
      vm.uploadedMFR = angular.copy(uploadedMFR);
      vm.mfrHeaders = angular.copy(mfrHeaders);
      vm.excelHeader = angular.copy(excelHeader);
      if (vm.isfromHandsonTable) {
        if (vm.mappingType === vm.uploadMappingType.C2.Key) {
          importFormatTwoManufacturerDetails(vm.mfrmodel);
        }
        else {
          if (vm.IsCustomer || vm.IsDistibuter) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SAVE_MFR_WITH_DEFUALT_VALUE);
            const defaultValue = {
              fieldName: vm.IsCustomer ? 'Customer Type' : 'Authorize Type',
              value: vm.IsCustomer ? CORE.customerTypeDropdown[1].value : vm.supplierAuthorize[0].Value
            };

            messageContent.message = stringFormat(messageContent.message, defaultValue.fieldName, defaultValue.value);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                importFormatOneManufacturerDetails(vm.mfrmodel, vm.uploadedMFR, vm.mfrHeaders, vm.excelHeader);
              }
              else {
                resetForm();
              }
            }, (error) => BaseService.getErrorLog(error));
          } else {
            importFormatOneManufacturerDetails(vm.mfrmodel, vm.uploadedMFR, vm.mfrHeaders, vm.excelHeader);
          }
        }
      }
    }

    /* Save uploaded data to MFR */
    vm.save = () => {
      if (!vm.isfromHandsonTable) {
        checkUploadedData(vm.mfrmodel, vm.uploadedMFR, vm.mfrHeaders, vm.excelHeader);
      } else {
        generateModel(vm.hansonModel, vm.IsCustomer ? vm.handsontableCustomerModel : vm.handsontableMFRModel, vm.settings.colHeaders, true);
      }
    };

    /**
     * Export Error contain record into file and display summary of upload data
     * @param {any} isFormatOne - Is this for Format One/Two
     * @param {any} responseData - response data from API side
     * @param {any} uploadRecCount - Total Count of Uploaded Record
     * @param {any} summaryDet - Summary detail of Upload record
     */
    function exportErrorFileForFormatType(isFormatOne, responseData, uploadRecCount, summaryDet) {
      const exportList = _.filter(responseData, (fStatus) => fStatus.status === CORE.ApiResponseTypeStatus.FAILED);
      const errorMfrList = [];
      _.each(exportList, (errMFr) => {
        var objErrMFR = {};
        if (isFormatOne) {
          objErrMFR[vm.CodeTitle] = errMFr.mfgCode;
          _.each(errMFr.mfgAlias, (alias, index) => {
            objErrMFR[stringFormat('{0}{1}', (vm.NameTitle), index + 1)] = alias;
          });
          if (vm.IsCustomer && errMFr.salesCommissionToName) {
            objErrMFR[vm.CommonFieldModel.salesCommissionToName] = errMFr.salesCommissionToName;
          }
        } else {
          objErrMFR[vm.NameTitle] = errMFr[vm.NameTitle];
        }
        objErrMFR.Error = errMFr.message;
        errorMfrList.push(objErrMFR);
      });
      downloadSheetWithContainError(errorMfrList);
      alertOnUploadInValidRec(summaryDet.fauilerCount, uploadRecCount, summaryDet.newAddedMFGCount, summaryDet.newAddedAliasCount, summaryDet.skipedCount);
    }

    /**
     * Download Excel Sheet with contain error list
     * @param {any} errorMfrList - Record for write into Export Excel File
     */
    function downloadSheetWithContainError(errorMfrList) {
      vm.cgBusyLoading = ImportExportFactory.importFile(errorMfrList).then((res) => {
        if (res.data && errorMfrList.length > 0) {
          exportFileDetail(res, vm.importCustomerType.concat('_error.xls'));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* function to replace valid special character from phone number input */
    const replaceSpecialCharForPhone = (phValue) => {
      if (phValue) {
        const matchedSpecChar = ['*', '-', '.', '(', ')', ' '];
        if (matchedSpecChar.some((word) => phValue.toString().includes(word))) {
          return phValue.replace(/[*-.() ]/g, '');
        }
        else {
          return phValue;
        }
      }
      else {
        return phValue;
      }
    };

    function alertOnUploadInValidRec(errorCount, totalRecCount, newAddedRec, addedAliasCount, skipCount, updatedCount) {
      const recStatusDet = {
        totalRecCount: totalRecCount || 0,
        newAddedRec: newAddedRec || 0,
        skipCount: skipCount || 0,
        errorCount: errorCount || 0,
        addedAliasCount: addedAliasCount || 0,
        updatedCount: updatedCount || 0
      };

      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPLOAD_CSV_EXCEL_SUCCESSFULLY);
      if (recStatusDet.errorCount > 0 && (recStatusDet.newAddedRec > 0 || recStatusDet.skipCount > 0 || recStatusDet.addedAliasCount > 0)) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPLOAD_CSV_EXCEL_PARTIALLY);
        messageContent.message = stringFormat(messageContent.message, vm.importCustomerType, recStatusDet.totalRecCount, recStatusDet.newAddedRec, recStatusDet.skipCount,
          recStatusDet.errorCount, recStatusDet.addedAliasCount, recStatusDet.updatedCount);
      } else if (recStatusDet.errorCount > 0 && recStatusDet.newAddedRec === 0 && recStatusDet.skipCount === 0 && recStatusDet.addedAliasCount === 0) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPLOAD_CSV_EXCEL_WITH_ERROR_RECORD);
        messageContent.message = stringFormat(messageContent.message, vm.importCustomerType, recStatusDet.totalRecCount, recStatusDet.newAddedRec, recStatusDet.skipCount,
          recStatusDet.errorCount, recStatusDet.addedAliasCount, recStatusDet.updatedCount);
      } else {
        messageContent.message = stringFormat(messageContent.message, recStatusDet.totalRecCount, recStatusDet.newAddedRec, recStatusDet.skipCount,
          recStatusDet.errorCount, recStatusDet.addedAliasCount, recStatusDet.updatedCount);
      }

      const alertModel = {
        messageContent: messageContent
      };

      DialogFactory.messageAlertDialog(alertModel);
      resetForm();
    }
    //Reset Form (HandsonTable and File Selection)
    function resetForm() {
      vm.headerMapping = [];
      vm.mfrmodel = [];
      if (_hotRegisterer) {
        _hotRegisterer.clear();
      }
      if (vm.mappingType === vm.uploadMappingType.F.Key) {
        vm.fileName = null;
      }
      $timeout(() => {
        vm.isChanged = false;
        BaseService.currentPageFlagForm = [vm.isChanged];
      });
    }

    /**
     * Import Manufacture/Supplier record for Format Type (2)
     * @param {any} mfrDetListModel - Model of added record from Handsontable in (Format Type 2)
     */
    function importFormatTwoManufacturerDetails(mfrDetListModel) {
      const isEmptyRecord = checkEmptyRecordExists(mfrDetListModel);
      if (isEmptyRecord) {
        return;
      }

      mfrDetListModel = _.filter(mfrDetListModel, (mfr) => mfr[vm.IsManfucaturer ? vm.LabelConstant.MFG.MFRName : vm.IsCustomer ? vm.LabelConstant.MFG.CustomerName : vm.LabelConstant.MFG.SupplierName]); // filter only mfr having name
      //Format 2
      mfrDetListModel = _.uniq(mfrDetListModel);
      if (mfrDetListModel.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NO_RECORD_EXISTS);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      } else {
        const objModel = {
          mfgType: (vm.IsManfucaturer || vm.IsCustomer) ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
          isCustOrDisty: vm.type === vm.mfgType.DIST ? true : vm.IsCustomer,
          mfrmodel: mfrDetListModel
        };
        vm.cgBusyLoading = ManufacturerFactory.importFormatTwoManufacturerDetails().query({ mfgList: objModel }).$promise.then((manufacturer) => {
          if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.FAILED && manufacturer.errors && manufacturer.errors.data) {
            exportErrorFileForFormatType(false, manufacturer.errors.data, modelList.length);
          } else {
            vm.changeMappingType();
            openMFRErrorPopup();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    /**
     * Check current record model is Empty or not
     * @param {any} mfrmodel - MFR uploaded records
     */
    function checkEmptyRecordExists(mfrmodel) {
      if (!mfrmodel || (Array.isArray(mfrmodel) && mfrmodel.length === 0)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NO_RECORD_EXISTS);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return true;
      }
      return false;
    }

    /**
     * Import Manufacture/Supplier record for Format Type (1)
     * @param {any} mfrmodel - MFR uploaded records
     * @param {any} data - Uploaded MFR record
     * @param {any} mfrHeaders - Uploaded record (HandsonTable)header column list
     * @param {any} excelHeader - Uploaded record (HandonTable/Excel) header column list
     */
    function importFormatOneManufacturerDetails(mfrmodel, data, mfrHeaders, excelHeader) {
      const isEmptyRecord = checkEmptyRecordExists(mfrmodel);
      if (isEmptyRecord) {
        return;
      }
      //format 1
      //mapped detail against mfr name
      const mappedHeader = _.find(mfrHeaders, (mapp) => mapp.header === (vm.NameTitle));
      const formatHeder = excelHeader;
      const indexHeaderList = [];
      if (mappedHeader) {
        _.each(formatHeder, (header, index) => {
          if (header === mappedHeader.column || header === (vm.NameTitle)) {
            indexHeaderList.push(index);
          }
        });
      }
      if (indexHeaderList.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_MFR_MAPPING);
        messageContent.message = stringFormat(messageContent.message, vm.NameTitle);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      const mfgAliasList = data;
      let modelList = [];
      let rowAppendIndex = 0;
      if (!vm.isfromHandsonTable) {
        rowAppendIndex = 1;
      }
      _.each(mfrmodel, (model, index) => {
        let modelObject = {};
        const isBlankRecord = Object.values(model).every((detail) => detail === null || (Array.isArray(detail) && detail.length === 0));
        if (!isBlankRecord) {
          if (model[vm.CodeTitle]) {
            modelObject = {
              mfgCode: model[vm.CodeTitle],
              mfgAlias: [],
              mfgType: (vm.IsManfucaturer || vm.IsCustomer) ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
              isCustomer: vm.IsCustomer,
              salesCommissionToName: model[vm.CommonFieldModel.salesCommissionToName],
              isCustOrDisty: vm.IsManfucaturer ? false : true
            };
            if (vm.IsCustomer) {
              modelObject.salesCommissionToName = model[vm.CommonFieldModel.salesCommissionToName];
              modelObject.customerType = CORE.customerTypeDropdown[1].id;
            } else if (vm.IsDistibuter) {
              modelObject.authorizeType = vm.supplierAuthorize[0].id;
            }

            modelObject.message = '';
            _.each(mfgAliasList[index + rowAppendIndex], (alias, aliasIndex) => {
              if (alias && ((_.find(indexHeaderList, (aIndex) => aIndex === aliasIndex))) && (!_.find(modelObject.mfgAlias, (mfgAlias) => mfgAlias === alias))) {
                alias = replaceHiddenSpecialCharacter(alias);
                modelObject.mfgAlias.push(alias);
              }
            });
            if (!modelObject.mfgCode) {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.CodeTitle);
            }
            else if (modelObject.mfgCode && !new RegExp(CORE.restrictSpecialCharatorPattern).test(modelObject.mfgCode)) {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.SPECIAL_CHAR_NOT_ALLOWED, vm.CodeTitle);
            }
            if (modelObject.mfgAlias.length === 0) {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message = stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.NameTitle);
            }
            if (vm.IsCustomer) {
              if (!modelObject.salesCommissionToName) {
                modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
                modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.CommonFieldModel.salesCommissionToName);
              } else if ((modelObject.salesCommissionToName.trim()).length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.SALES_COMMISSION_TO) {
                modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
                modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.salesCommissionToName, modelObject.salesCommissionToName.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.SALES_COMMISSION_TO); //Sales Commission To have grater than 50 character
              }
            }
          } else {
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            modelObject.message = stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.CodeTitle);
          }
          modelList.push(modelObject);
        }
      });
      if (modelList.length > 0) {
        modelList = _.uniqWith(modelList, _.isEqual);
        const mfgDetail = {
          modelList: modelList,
          replaceSalesCommissionTo: vm.replaceSalesCommissionTo
        };
        vm.cgBusyLoading = ManufacturerFactory.importFormatOneManufacturerDetails().query({ mfgImportedDetail: mfgDetail }).$promise.then((manufacturer) => {
          if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.FAILED) {
            exportErrorFileForFormatType(true, manufacturer.errors.data.errorRec, modelList.length, manufacturer.errors.data.summaryDet);
          } else {
            if (manufacturer && manufacturer.data && manufacturer.data.summaryDet && manufacturer.data.summaryDet.newAddedMFGCount !== undefined) {
              alertOnUploadInValidRec(0, modelList.length, manufacturer.data.summaryDet.newAddedMFGCount, manufacturer.data.summaryDet.newAddedAliasCount,
                manufacturer.data.summaryDet.skipedCount);
            }
            $mdDialog.cancel(true);
          }
        });
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NO_RECORD_EXISTS);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }
    }

    /**
     * Import Customer record for Format Type (1) & (Customer/Supplier/Manufacture) File
     * @param {any} mfrDetListModel - MFR Uploaded record
     * @param {any} isUpdateExistingData - Is uploaded record already exist or not
     * @param {any} existingDataList - Already exist record compare to uploaded records
     */
    function importFormatOneCustomerDetails(mfrDetListModel, isUpdateExistingData, existingDataList) {
      vm.cgBusyLoading = ManufacturerFactory.importFormatOneCustomerDetails().query({ mfgImportedDetail: mfrDetListModel, isUpdateExistingData: isUpdateExistingData }).$promise.then((customerresponse) => {
        if (customerresponse && customerresponse.status === CORE.ApiResponseTypeStatus.FAILED) {
          exportErrorFileForFormatType(true, customerresponse.errors.data.errorRec, mfrDetListModel.length, customerresponse.errors.data.summaryDet);
          downloadSheetWithContainError(errorMfrList);
        } else if (!isUpdateExistingData) {
          const errorMfrList = getFormatErrorList(existingDataList, true);
          alertOnUploadInValidRec(0, mfrDetListModel.length, customerresponse.data.summaryDet.newAddedMFGCount, customerresponse.data.summaryDet.newAddedAliasCount,
            customerresponse.data.summaryDet.skipedCount);
          vm.cgBusyLoading = ImportExportFactory.importFile(errorMfrList).then((res) => {
            if (res.data && errorMfrList.length > 0) {
              exportFileDetail(res, vm.importCustomerType.concat('_notupdated_record.xls'));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (customerresponse && customerresponse.data && customerresponse.data.summaryDet && customerresponse.data.summaryDet.newAddedMFGCount !== undefined) {
            alertOnUploadInValidRec(0, mfrDetListModel.length, customerresponse.data.summaryDet.newAddedMFGCount, customerresponse.data.summaryDet.newAddedAliasCount,
              customerresponse.data.summaryDet.skipedCount, customerresponse.data.summaryDet.existingUpdateCount);
          }
        }
        vm.isChanged = false;
        BaseService.currentPageFlagForm = [];
        $mdDialog.cancel(true);
      });
    }

    /**
     * Check uploaded record for Customer/Supplier/Manufacture for Upload type (File) and For Customer (Format 1)
     * @param {any} mfrmodel - MFR uploaded records
     * @param {any} data - Data which pass on current pop-up open
     * @param {any} mfrHeaders - Uploaded record (HandsonTable)header column list
     * @param {any} excelHeader - Uploaded record (HandonTable/Excel) header column list
     */
    function checkUploadedData(mfrmodel, data, mfrHeaders, excelHeader) {
      if (vm.mappingType === vm.uploadMappingType.C2.Key) {
        importFormatTwoManufacturerDetails(mfrmodel);
      } else {
        const isEmptyRecord = checkEmptyRecordExists(mfrmodel);
        if (isEmptyRecord) {
          return;
        }
        const mappedHeader = _.find(mfrHeaders, (mapp) => mapp.header === vm.NameTitle);
        const formatHeder = excelHeader;
        const indexHeaderList = [];
        if (mappedHeader) {
          _.each(formatHeder, (header, index) => {
            if (header === mappedHeader.column || header === vm.NameTitle) {
              indexHeaderList.push(index);
            }
          });
        }
        if (indexHeaderList.length === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_MFR_MAPPING);
          messageContent.message = stringFormat(messageContent.message, vm.NameTitle);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        const mfgAliasList = data;
        let modelList = [];
        vm.wrongData = false;
        let rowAppendIndex = 0;
        if (!vm.isfromHandsonTable) {
          rowAppendIndex = 1;
        }

        _.each(mfrmodel, (model, index) => {
          if (model[vm.CodeTitle]) {
            const modelObject = {
              mfgCode: model[vm.CodeTitle],
              mfgAlias: [model[vm.CodeTitle]],
              mfgType: vm.IsDistibuter ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG,
              isCustOrDisty: vm.type === vm.mfgType.DIST ? true : vm.IsCustomer,
              customerType: vm.IsCustomer ? CORE.customerTypeDropdown[1].id : null,
              salesCommissionToName: model[vm.CommonFieldModel.salesCommissionToName]
            };
            if (vm.mappingType === vm.uploadMappingType.F.Key) {
              modelObject.email = model[vm.CommonFieldModel.email];
              modelObject.website = model[vm.CommonFieldModel.website];
              modelObject.phExtension = model[vm.CommonFieldModel.phExtension];
              modelObject.faxNumber = model[vm.CommonFieldModel.faxNumber];
              modelObject.contact = model[vm.CommonFieldModel.contact];
              modelObject.CountryCode = model[vm.CommonFieldModel.CountryCode];
              modelObject.comments = model[vm.CommonFieldModel.comments];
              modelObject.territory = model[vm.CommonFieldModel.territory];
              modelObject.supplierAuthorizeType = model[vm.CommonFieldModel.AuthorizeType];
              modelObject.ShippingMethod = model[vm.CommonFieldModel.ShippingMethod];
              modelObject.FOB = model[vm.CommonFieldModel.FOB];
              modelObject.supplierScanDocumentSide = model[vm.CommonFieldModel.ScanningSide];
              modelObject.TypeOfSupplier = model[vm.CommonFieldModel.TypeOfSupplier];
              modelObject.requiredOrderQty = model[vm.CommonFieldModel.RequireOrderQtyInPackingSlip];
              modelObject.ShippingAddressSameAsBillingAddress = model[vm.CommonFieldModel.ShippingAddressSameAsBillingAddress];
              modelObject.taxID = model[vm.CommonFieldModel.TaxID];
              modelObject.accountRef = model[vm.CommonFieldModel.AccountRef];
              modelObject.legalName = model[vm.CommonFieldModel.LegalName];
            }

            modelObject.message = '';
            let BillingAddress = {};
            let ShippingAddress = {};
            if (vm.isfromHandsonTable) {
              _.each(mfgAliasList[index + rowAppendIndex], (alias, aliasIndex) => {
                if (alias && ((_.find(indexHeaderList, (aIndex) => aIndex === aliasIndex))) && (!_.find(modelObject.mfgAlias, (mfgAlias) => mfgAlias === alias))) {
                  alias = replaceHiddenSpecialCharacter(alias);
                  modelObject.mfgAlias.push(alias.trim());
                }
              });
            } else {
              modelObject.mfgAlias.push(model[vm.NameTitle].trim());
            }

            if (vm.mappingType === vm.uploadMappingType.F.Key) {
              BillingAddress = {
                addressType: vm.addressType.BillingAddress,
                companyName: model[vm.CommonFieldModel.BillToCompany],
                personName: model[vm.CommonFieldModel.BillToPerson],
                division: model[vm.CommonFieldModel.BillToDepartment],
                email: model[vm.CommonFieldModel.BillToEmail],
                CountryCode: model[vm.CommonFieldModel.BillToCountryCode],
                faxNumber: model[vm.CommonFieldModel.BillToFax],
                contact: model[vm.CommonFieldModel.BillToPhone],
                phExtension: model[vm.CommonFieldModel.BillToExt],
                street1: model[vm.CommonFieldModel.BillToAddressline1],
                street2: model[vm.CommonFieldModel.BillToaddressLine2],
                street3: model[vm.CommonFieldModel.BillToaddressLine3],
                state: model[vm.CommonFieldModel.BillToState],
                CountryName: model[vm.CommonFieldModel.BillToCountry],
                city: model[vm.CommonFieldModel.BillToCity],
                postcode: model[vm.CommonFieldModel.BillToZipCode]
              };
              ShippingAddress = {
                addressType: vm.addressType.ShippingAddress,
                companyName: model[vm.CommonFieldModel.ShippingCompany],
                personName: model[vm.CommonFieldModel.ShippingPerson],
                division: model[vm.CommonFieldModel.ShippingDepartment],
                email: model[vm.CommonFieldModel.ShippingEmail],
                CountryCode: model[vm.CommonFieldModel.ShippingCountryCode],
                faxNumber: model[vm.CommonFieldModel.ShippingFax],
                contact: model[vm.CommonFieldModel.ShippingPhone],
                phExtension: model[vm.CommonFieldModel.ShippingExt],
                street1: model[vm.CommonFieldModel.ShippingAddressline1],
                street2: model[vm.CommonFieldModel.ShippingAddressLine2],
                street3: model[vm.CommonFieldModel.ShippingAddressLine3],
                state: model[vm.CommonFieldModel.ShippingState],
                CountryName: model[vm.CommonFieldModel.ShippingCountry],
                city: model[vm.CommonFieldModel.ShippingCity],
                postcode: model[vm.CommonFieldModel.ShippingZipCode]
              };

              if (modelObject.ShippingAddressSameAsBillingAddress && modelObject.ShippingAddressSameAsBillingAddress.toUpperCase() === 'YES') {
                ShippingAddress.companyName = BillingAddress.companyName;
                ShippingAddress.personName = BillingAddress.personName;
                ShippingAddress.division = BillingAddress.division;
                ShippingAddress.email = BillingAddress.email;
                ShippingAddress.CountryCode = BillingAddress.CountryCode;
                ShippingAddress.faxNumber = BillingAddress.faxNumber;
                ShippingAddress.contact = BillingAddress.contact;
                ShippingAddress.phExtension = BillingAddress.phExtension;
                ShippingAddress.street1 = BillingAddress.street1;
                ShippingAddress.street2 = BillingAddress.street2;
                ShippingAddress.street3 = BillingAddress.street3;
                ShippingAddress.state = BillingAddress.state;
                ShippingAddress.CountryName = BillingAddress.CountryName;
                ShippingAddress.city = BillingAddress.city;
                ShippingAddress.postcode = BillingAddress.postcode;
              }
              modelObject.BillingAddress = BillingAddress;
              modelObject.ShippingAddress = ShippingAddress;
            }
            validateMFRModelData(modelObject, index);
            if (vm.mappingType === vm.uploadMappingType.F.Key) {
              validateAddressData(BillingAddress, modelObject, index);
              validateAddressData(ShippingAddress, modelObject, index);
            }

            if (modelObject.mfgAlias.length > 0) {
              modelList.push(modelObject);
            }
          }
        });
        if (modelList.length > 0 && !vm.wrongData) {
          modelList = _.uniqWith(modelList, _.isEqual);
          // modelList = _.filter(modelList, (item) => item.mfgAlias.length > 0);
          vm.cgBusyLoading = ManufacturerFactory.validateCustomerDetails().query({ mfgImportedDetail: modelList }).$promise.then((customer) => {
            if (customer && customer.status === CORE.ApiResponseTypeStatus.FAILED) {
              const exportList = _.filter(customer.errors.data.errorRec, (fStatus) => fStatus.status === CORE.ApiResponseTypeStatus.FAILED);
              const errorMfrList = getFormatErrorList(exportList);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UPLOAD_DATA_INCORRECT);
              const alertModel = {
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(alertModel);
              downloadSheetWithContainError(errorMfrList);
            }
            else if (customer && customer.status === CORE.ApiResponseTypeStatus.EMPTY) {
              if (customer.errors.data.ExistingData.length > 0) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.IMPORT_CUSTOMER_DETAIL_UPDATE_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, vm.importCustomerType);
                const message = messageContent.message + `<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">#</th><th class="border-bottom padding-5">Code</th><th class="border-bottom padding-5">${vm.importCustomerType}</th></tr></thead><tbody>{0}</tbody></table>`;
                const subMessage = [];
                customer.errors.data.ExistingData.forEach((item) => {
                  subMessage.push('<tr><td class="border-bottom padding-5">' + (customer.errors.data.ExistingData.indexOf(item) + 1) + '</td><td class="border-bottom padding-5">' + item.mfgCode + '</td><td class="border-bottom padding-5">' + item.mfgName + '</td></tr>');
                });

                messageContent.message = stringFormat(message, subMessage.join(''));
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then(() => {
                  importFormatOneCustomerDetails(modelList, true, customer.errors.data.ExistingData);
                }, () => {
                  importFormatOneCustomerDetails(modelList, false, customer.errors.data.ExistingData);
                });
              } else {
                importFormatOneCustomerDetails(modelList, false, []);
              }
            } else {
              $mdDialog.cancel(true);
            }
          });
        } else {
          if (!vm.isfromHandsonTable) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NO_RECORD_EXISTS);
            const alertModel = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(alertModel);
          }
        }
      }
    }

    /**
     * Get Error record with formated recrod contain error record in EXCEL base on passed record
     * @param {any} exportList - Error record
     * @param {any} notUpdated
     */
    function getFormatErrorList(exportList, notUpdated) {
      const errorMfrList = [];
      _.each(exportList, (errMFr) => {
        var objErrMFR = {};
        objErrMFR[vm.CodeTitle] = errMFr.mfgCode;
        _.each(errMFr.mfgAlias, (alias, index) => {
          objErrMFR[stringFormat('{0}{1}', (vm.NameTitle), index > 1 ? index - 1 : '')] = alias;
        });
        if (vm.IsCustomer) {
          objErrMFR[vm.CommonFieldModel.salesCommissionToName] = errMFr.salesCommissionToName;
        }

        if (!vm.isfromHandsonTable) {
          if (vm.IsCustomer) {
            objErrMFR[vm.CommonFieldModel.ShippingMethod] = errMFr.ShippingMethod;
            objErrMFR[vm.CommonFieldModel.territory] = errMFr.territory;
          }
          if (vm.IsCustomer || vm.IsDistibuter) {
            objErrMFR[vm.CommonFieldModel.FOB] = errMFr.FOB;
          }
          if (vm.IsDistibuter) {
            objErrMFR[vm.CommonFieldModel.AuthorizeType] = errMFr.supplierAuthorizeType;
            objErrMFR[vm.CommonFieldModel.ScanningSide] = errMFr.supplierScanDocumentSide;
            objErrMFR[vm.CommonFieldModel.RequireOrderQtyInPackingSlip] = errMFr.requiredOrderQty;
            objErrMFR[vm.CommonFieldModel.TypeOfSupplier] = errMFr.TypeOfSupplier;
            objErrMFR[vm.CommonFieldModel.TaxID] = errMFr.taxID;
            objErrMFR[vm.CommonFieldModel.AccountRef] = errMFr.accountRef;
          }
          objErrMFR[vm.CommonFieldModel.comments] = errMFr.comments;
          objErrMFR[vm.CommonFieldModel.CountryCode] = errMFr.CountryCode;
          objErrMFR[vm.CommonFieldModel.contact] = errMFr.contact;
          objErrMFR[vm.CommonFieldModel.phExtension] = errMFr.phExtension;
          objErrMFR[vm.CommonFieldModel.faxNumber] = errMFr.faxNumber;
          objErrMFR[vm.CommonFieldModel.email] = errMFr.email;
          objErrMFR[vm.CommonFieldModel.website] = errMFr.website;
          if (errMFr.BillingAddres) {
            objErrMFR[vm.CommonFieldModel.BillToCompany] = errMFr.BillingAddress.companyName;
            objErrMFR[vm.CommonFieldModel.BillToPerson] = errMFr.BillingAddress.personName;
            objErrMFR[vm.CommonFieldModel.BillToEmail] = errMFr.BillingAddress.email;
            objErrMFR[vm.CommonFieldModel.BillToDepartment] = errMFr.BillingAddress.division;
            objErrMFR[vm.CommonFieldModel.BillToCountryCode] = errMFr.BillingAddress.CountryCode;
            objErrMFR[vm.CommonFieldModel.BillToPhone] = errMFr.BillingAddress.contact;
            objErrMFR[vm.CommonFieldModel.BillToFax] = errMFr.BillingAddress.faxNumber;
            objErrMFR[vm.CommonFieldModel.BillToExt] = errMFr.BillingAddress.phExtension;
            objErrMFR[vm.CommonFieldModel.BillToAddressline1] = errMFr.BillingAddress.street1;
            objErrMFR[vm.CommonFieldModel.BillToaddressLine2] = errMFr.BillingAddress.street2;
            objErrMFR[vm.CommonFieldModel.BillToaddressLine3] = errMFr.BillingAddress.street3;
            objErrMFR[vm.CommonFieldModel.BillToState] = errMFr.BillingAddress.state;
            objErrMFR[vm.CommonFieldModel.BillToCountry] = errMFr.BillingAddress.CountryName;
            objErrMFR[vm.CommonFieldModel.BillToCity] = errMFr.BillingAddress.city;
            objErrMFR[vm.CommonFieldModel.BillToZipCode] = errMFr.BillingAddress.postcode;
            objErrMFR[vm.CommonFieldModel.ShippingAddressSameAsBillingAddress] = errMFr.ShippingAddressSameAsBillingAddress;
          }
          if (errMFr.ShippingAddress) {
            objErrMFR[vm.CommonFieldModel.ShippingCompany] = errMFr.ShippingAddress.companyName;
            objErrMFR[vm.CommonFieldModel.ShippingPerson] = errMFr.ShippingAddress.personName;
            objErrMFR[vm.CommonFieldModel.ShippingEmail] = errMFr.ShippingAddress.email;
            objErrMFR[vm.CommonFieldModel.ShippingDepartment] = errMFr.ShippingAddress.division;
            objErrMFR[vm.CommonFieldModel.ShippingCountryCode] = errMFr.ShippingAddress.CountryCode;
            objErrMFR[vm.CommonFieldModel.ShippingPhone] = errMFr.ShippingAddress.contact;
            objErrMFR[vm.CommonFieldModel.ShippingFax] = errMFr.ShippingAddress.faxNumber;
            objErrMFR[vm.CommonFieldModel.ShippingExt] = errMFr.ShippingAddress.phExtension;
            objErrMFR[vm.CommonFieldModel.ShippingAddressline1] = errMFr.ShippingAddress.street1;
            objErrMFR[vm.CommonFieldModel.ShippingAddressLine2] = errMFr.ShippingAddress.street2;
            objErrMFR[vm.CommonFieldModel.ShippingAddressLine3] = errMFr.ShippingAddress.street3;
            objErrMFR[vm.CommonFieldModel.ShippingState] = errMFr.ShippingAddress.state;
            objErrMFR[vm.CommonFieldModel.ShippingCountry] = errMFr.ShippingAddress.CountryName;
            objErrMFR[vm.CommonFieldModel.ShippingCity] = errMFr.ShippingAddress.city;
            objErrMFR[vm.CommonFieldModel.ShippingZipCode] = errMFr.ShippingAddress.postcode;
          }
        }
        objErrMFR.Error = errMFr.message;
        if (notUpdated) {
          objErrMFR.Result = 'Not Updated existing record.';
        }
        errorMfrList.push(objErrMFR);
      });

      return errorMfrList;
    }

    function validateMFRModelData(modelObject, index) {
      if (!modelObject.mfgCode) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.CodeTitle);
      } else if (modelObject.mfgCode.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.CUSTOMERCODE) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CodeTitle, modelObject.mfgCode.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.CUSTOMERCODE); //mfg code have grater than 8 character
      }
      if (modelObject.mfgCode && !new RegExp(CORE.restrictSpecialCharatorPattern).test(modelObject.mfgCode)) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.SPECIAL_CHAR_NOT_ALLOWED, vm.CodeTitle);
      }

      const maxMFGNameLength = CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.CUSTOMERNAME;
      const mfrName = modelObject.mfgAlias.length > 1 ? modelObject.mfgAlias[1] : modelObject.mfgAlias[0];
      if (!mfrName) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.NameTitle);
      } else if (mfrName.length > maxMFGNameLength) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.NameTitle, mfrName.length, maxMFGNameLength);
      }
      if (vm.IsCustomer) {
        if (!modelObject.salesCommissionToName) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.CommonFieldModel.salesCommissionToName);
        } else if ((modelObject.salesCommissionToName.trim()).length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.SALES_COMMISSION_TO) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.salesCommissionToName, modelObject.salesCommissionToName.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.SALES_COMMISSION_TO); //Sales Commission To have grater than 50 character
        }
        if (modelObject.territory && modelObject.territory.length > 150 && vm.mappingType === vm.uploadMappingType.F.Key) {
          mfmodelObjectg.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.territory, modelObject.territory.length, 150);
        }
      }

      if (vm.IsDistibuter) {
        if (!modelObject.supplierAuthorizeType) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, vm.CommonFieldModel.AuthorizeType);
        } else {
          if (modelObject.supplierAuthorizeType.trim().toUpperCase() === 'BOTH') {
            modelObject.authorizeType = vm.supplierAuthorize[2].id;
          } else {
            const authorizetype = _.find(vm.supplierAuthorize, (x) => x.Value.toUpperCase() === modelObject.supplierAuthorizeType.trim().toUpperCase());
            if (authorizetype) {
              modelObject.authorizeType = authorizetype.id;
            } else {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.AuthorizeType); //Invalid Authorize type
            }
          }
        }

        if (!modelObject.supplierScanDocumentSide) {
          modelObject.scanDocumentSide = vm.ScanDocumentSide.D.type;
        } else {
          if (modelObject.supplierScanDocumentSide.trim().toUpperCase() === vm.ScanDocumentSide.D.importName.toUpperCase()) {
            modelObject.scanDocumentSide = vm.ScanDocumentSide.D.type;
          } else if (modelObject.supplierScanDocumentSide.trim().toUpperCase() === vm.ScanDocumentSide.S.importName.toUpperCase()) {
            modelObject.scanDocumentSide = vm.ScanDocumentSide.S.type;
          } else {
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.ScanningSide); //Invalid Scanning side
          }
        }

        if (!modelObject.TypeOfSupplier) {
          modelObject.supplierMFRMappingType = vm.supplierMFRMappingType.OffTheShelf.key;
        } else {
          if (modelObject.TypeOfSupplier.trim().toUpperCase() === vm.supplierMFRMappingType.StrictlyCustomComponent.value.toUpperCase()) {
            modelObject.supplierMFRMappingType = vm.supplierMFRMappingType.StrictlyCustomComponent.key;
          } else if (modelObject.TypeOfSupplier.trim().toUpperCase() === vm.supplierMFRMappingType.OffTheShelf.value.toUpperCase()) {
            modelObject.supplierMFRMappingType = vm.supplierMFRMappingType.OffTheShelf.key;
          } else if (modelObject.TypeOfSupplier.trim().toUpperCase() === vm.supplierMFRMappingType.Both.value.toUpperCase()) {
            modelObject.supplierMFRMappingType = vm.supplierMFRMappingType.Both.key;
          } else {
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.TypeOfSupplier); //Invalid Type of supplier
          }
        }

        if (!modelObject.requiredOrderQty) {
          modelObject.isOrderQtyRequiredInPackingSlip = true;
        } else {
          if (modelObject.requiredOrderQty.toUpperCase() === 'YES') {
            modelObject.isOrderQtyRequiredInPackingSlip = true;
          } else if (modelObject.requiredOrderQty.toUpperCase() === 'NO') {
            modelObject.isOrderQtyRequiredInPackingSlip = false;
          } else {
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.RequireOrderQtyInPackingSlip); //Invalid Type of supplier
          }
        }

        if (modelObject.TaxID && (modelObject.TaxID.toString()).length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.TAXID) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.TaxID, modelObject.TaxID.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.TAXID);
        }
        if (modelObject.AccountRef && (modelObject.AccountRef.toString()).length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ACCOUNTREF) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.AccountRef, modelObject.AccountRef.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ACCOUNTREF);
        }
      }

      if (modelObject.comments && modelObject.comments.length > 1000) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.comments, modelObject.comments.length, 1000);
      }

      if (modelObject.contact) {
        const fieldFormattedData = replaceSpecialCharForPhone(modelObject.contact);

        if (modelObject.CountryCode) {
          // check CountryCode is number type
          const countryCodeData = Number(modelObject.CountryCode);
          if (isNaN(countryCodeData)) {
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            modelObject.message += modelObject.CountryCode + ' Country Code must be number. ';
            modelObject.isContryCodeError = true;
          }
        }
        else {
          // set default 1 - US country code if blank value
          modelObject.CountryCode = '1';
        }

        const $newDiv = $('<div class="intel-tel-input-from-import-file-dynamic"><input type="hidden" name="importAllPhoneDiv" type="tel" id="contact_' + index
          + '" value="' + '+' + modelObject.CountryCode + ' ' + fieldFormattedData + '" /></div>');

        angular.element(document).injector().invoke(['$compile', function ($compile) {
          var div = $compile($newDiv);
          var content = div(vm);  //$scope
          $(document.body).append(content);
        }]);

        $('#contact_' + index).intlTelInput();

        const telInput = $('#contact_' + index);
        let iso2CountryShortName = telInput.intlTelInput('getSelectedCountryData').iso2;
        if (iso2CountryShortName) {
          iso2CountryShortName = iso2CountryShortName.toUpperCase();
          const num = telInput.intlTelInput('getNumber', 2);
          const format = intlTelInputUtils.numberFormat.INTERNATIONAL;
          const formatedNumber = intlTelInputUtils.formatNumber(num, iso2CountryShortName, format);
          telInput.intlTelInput('setCountry', iso2CountryShortName);

          if ($.trim(telInput.val())) {
            if (telInput.intlTelInput('isValidNumber')) {
              modelObject.contact = formatedNumber;
              modelObject.contactCountryCode = iso2CountryShortName;
            }
            else {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, modelObject.contact, 'Phone No');
            }
          }
        }
        else {
          // when country code is not valid then display error message
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, modelObject.CountryCode, 'Country Code');
          modelObject.isContryCodeError = true;
        }
        $('div.intel-tel-input-from-import-file-dynamic').remove(); // to remove dynamically generated phone div
      }
      $('div.intel-tel-input-from-import-file-dynamic').remove(); // to remove dynamically generated phone div

      if (modelObject.faxNumber) {
        const fieldFormattedFaxData = replaceSpecialCharForPhone(modelObject.faxNumber);

        if (modelObject.CountryCode) {
          // check CountryCode is number type
          const countryCodeData = Number(modelObject.CountryCode);
          if (isNaN(countryCodeData)) {
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            if (!modelObject.isContryCodeError) {
              modelObject.message += modelObject.CountryCode + ' Country Code must be number. ';
            }
          }
        }
        else {
          // set default 1 - US country code if blank value
          modelObject.CountryCode = '1';
        }

        const $newDiv = $('<div class="intel-tel-input-from-import-file-dynamic"><input type="hidden" name="importAllFaxDiv" type="tel" id="fax_' + index
          + '" value="' + '+' + modelObject.CountryCode + ' ' + fieldFormattedFaxData + '" /></div>');
        angular.element(document).injector().invoke(['$compile', function ($compile) {
          var div = $compile($newDiv);
          var content = div(vm);  //$scope
          $(document.body).append(content);
        }]);

        $('#fax_' + index).intlTelInput();

        const telInput = $('#fax_' + index);
        let iso2CountryShortName = telInput.intlTelInput('getSelectedCountryData').iso2;
        if (iso2CountryShortName) {
          iso2CountryShortName = iso2CountryShortName.toUpperCase();
          const num = telInput.intlTelInput('getNumber', 2);
          const format = intlTelInputUtils.numberFormat.INTERNATIONAL;
          const formatedFaxNumber = intlTelInputUtils.formatNumber(num, iso2CountryShortName, format);
          telInput.intlTelInput('setCountry', iso2CountryShortName);

          if ($.trim(telInput.val())) {
            if (telInput.intlTelInput('isValidNumber')) {
              modelObject.faxNumber = formatedFaxNumber;
              modelObject.faxCountryCode = iso2CountryShortName;
            }
            else {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, modelObject.faxNumber, 'Fax');
            }
          }
        }
        else {
          // when country code is not valid then display error message
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          if (!modelObject.isContryCodeError) {
            modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, modelObject.CountryCode, 'Country Code');
          }
        }
        $('div.intel-tel-input-from-import-file-dynamic').remove(); // to remove dynamically generated phone div
      }
      $('div.intel-tel-input-from-import-file-dynamic').remove(); // to remove dynamically generated phone div

      const phExtension = Number(modelObject.phExtension);
      if (modelObject.phExtension && isNaN(phExtension)) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.phExtension);
      } else if ((modelObject.phExtension && modelObject.phExtension.length > 8) || (modelObject.phExtension && isNaN(phExtension))) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, vm.CommonFieldModel.phExtension, modelObject.phExtension.length, 8);
      }
      if (modelObject.website && !new RegExp(CORE.WebSitePattern).test(modelObject.website)) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.website);
      }
      if (modelObject.email && !new RegExp(CORE.EmailPattern).test(modelObject.email)) {
        modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
        modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, vm.CommonFieldModel.email);
      }

      return modelObject;
    };

    function validateAddressData(Address, modelObject, index) {
      if (Address.companyName || Address.personName || Address.email || Address.division || Address.faxNumber || Address.phExtension || Address.contact || Address.CountryCode ||
        Address.street1 || Address.street2 || Address.city || Address.state || Address.CountryName || Address.postcode) {
        if (!Address.companyName) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingCompany : vm.CommonFieldModel.BillToCompany));
        } else if (Address.companyName && Address.companyName.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_COMPANY_LENGTH) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingCompany : vm.CommonFieldModel.BillToCompany), Address.companyName.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_COMPANY_LENGTH);
        }
        if (!Address.personName) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingPerson : vm.CommonFieldModel.BillToPerson));
        } else if (Address.personName && Address.personName.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_PERSON) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingPerson : vm.CommonFieldModel.BillToPerson), Address.personName.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_PERSON);
        }
        if (Address.email && !new RegExp(CORE.EmailPattern).test(Address.email)) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingEmail : vm.CommonFieldModel.BillToEmail));
        }
        if (!Address.division) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingDepartment : vm.CommonFieldModel.BillToDepartment));
        } else if (Address.division && Address.division.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_DEPARTMENT) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingDepartment : vm.CommonFieldModel.BillToDepartment), Address.division.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_DEPARTMENT);
        }

        const phExtension = Number(Address.phExtension);
        if (Address.phExtension && isNaN(phExtension)) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.FIELD_INVALID_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingExt : vm.CommonFieldModel.BillToExt));
        } else if ((Address.phExtension && Address.phExtension.length > 8) || (Address.phExtension && isNaN(phExtension))) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingExt : vm.CommonFieldModel.BillToExt), Address.phExtension.length, 8);
        }

        if (Address.contact) {
          const fieldFormattedData = replaceSpecialCharForPhone(Address.contact);

          if (Address.CountryCode) {
            // check CountryCode is number type
            const countryCodeData = Number(Address.CountryCode);
            if (isNaN(countryCodeData)) {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              modelObject.message += Address.CountryCode + (Address.addressType === vm.addressType.ShippingAddress ? ' Shipping Country Code must be number. ' : ' Bill To Country Code must be number. ');
              Address.isContryCodeError = true;
            }
          }
          else {
            // set default 1 - US country code if blank value
            Address.CountryCode = '1';
          }

          const $newDiv = $('<div class="intel-tel-input-from-import-file-dynamic"><input type="hidden" name="importAllPhoneDiv" type="tel" id="contact_' + index
            + '" value="' + '+' + Address.CountryCode + ' ' + fieldFormattedData + '" /></div>');

          angular.element(document).injector().invoke(['$compile', function ($compile) {
            var div = $compile($newDiv);
            var content = div(vm);  //$scope
            $(document.body).append(content);
          }]);

          $('#contact_' + index).intlTelInput();

          const telInput = $('#contact_' + index);
          let iso2CountryShortName = telInput.intlTelInput('getSelectedCountryData').iso2;
          if (iso2CountryShortName) {
            iso2CountryShortName = iso2CountryShortName.toUpperCase();
            const num = telInput.intlTelInput('getNumber', 2);
            const format = intlTelInputUtils.numberFormat.INTERNATIONAL;
            const formatedNumber = intlTelInputUtils.formatNumber(num, iso2CountryShortName, format);
            telInput.intlTelInput('setCountry', iso2CountryShortName);

            if ($.trim(telInput.val())) {
              if (telInput.intlTelInput('isValidNumber')) {
                Address.contact = formatedNumber;
                Address.contactCountryCode = iso2CountryShortName;
              }
              else {
                modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
                modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, Address.contact, 'Phone No');
              }
            }
          }
          else {
            // when country code is not valid then display error message
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, Address.CountryCode, 'Country Code');
            Address.isContryCodeError = true;
          }
        }
        $('div.intel-tel-input-from-import-file-dynamic').remove(); // to remove dynamically generated phone div


        if (Address.faxNumber) {
          const fieldFormattedFaxData = replaceSpecialCharForPhone(Address.faxNumber);

          if (Address.CountryCode) {
            // check CountryCode is number type
            const countryCodeData = Number(Address.CountryCode);
            if (isNaN(countryCodeData)) {
              modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
              if (!Address.isContryCodeError) {
                modelObject.message += Address.CountryCode + ' Country Code must be number. ';
              }
            }
          }
          else {
            // set default 1 - US country code if blank value
            Address.CountryCode = '1';
          }

          const $newDiv = $('<div class="intel-tel-input-from-import-file-dynamic"><input type="hidden" name="importAllFaxDiv" type="tel" id="fax_' + index
            + '" value="' + '+' + Address.CountryCode + ' ' + fieldFormattedFaxData + '" /></div>');
          angular.element(document).injector().invoke(['$compile', function ($compile) {
            var div = $compile($newDiv);
            var content = div(vm);  //$scope
            $(document.body).append(content);
          }]);

          $('#fax_' + index).intlTelInput();

          const telInput = $('#fax_' + index);
          let iso2CountryShortName = telInput.intlTelInput('getSelectedCountryData').iso2;
          if (iso2CountryShortName) {
            iso2CountryShortName = iso2CountryShortName.toUpperCase();
            const num = telInput.intlTelInput('getNumber', 2);
            const format = intlTelInputUtils.numberFormat.INTERNATIONAL;
            const formatedFaxNumber = intlTelInputUtils.formatNumber(num, iso2CountryShortName, format);
            telInput.intlTelInput('setCountry', iso2CountryShortName);

            if ($.trim(telInput.val())) {
              if (telInput.intlTelInput('isValidNumber')) {
                Address.faxNumber = formatedFaxNumber;
                Address.faxCountryCode = iso2CountryShortName;
              }
              else {
                modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
                modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, Address.faxNumber, 'Fax');
              }
            }
          }
          else {
            // when country code is not valid then display error message
            modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
            if (!Address.isContryCodeError) {
              modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.INVALID_PHONE_NUMBER, Address.CountryCode, 'Country Code');
            }
          }
          $('div.intel-tel-input-from-import-file-dynamic').remove(); // to remove dynamically generated phone div
        }

        if (!Address.street1) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingAddressline1 : vm.CommonFieldModel.BillToAddressline1));
        } else if (Address.street1 && Address.street1.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_LINE) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingAddressline1 : vm.CommonFieldModel.BillToAddressline1), Address.street1.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_LINE);
        }
        if (Address.street2 && Address.street2.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_LINE) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingAddressLine2 : vm.CommonFieldModel.BillToaddressLine2), Address.street2.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_LINE);
        }
        if (Address.street3 && Address.street3.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_LINE) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingAddressLine3 : vm.CommonFieldModel.BillToaddressLine3), Address.street3.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ADDRESS_LINE);
        }
        if (!Address.CountryName) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingCountry : vm.CommonFieldModel.BillToCountry));
        } else if (Address.CountryName && Address.CountryName.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.COUNTRY) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingCountry : vm.CommonFieldModel.BillToCountry), Address.CountryName.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.COUNTRY);
        }
        if (!Address.city) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingCity : vm.CommonFieldModel.BillToCity));
        } else if (Address.city && Address.city.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.CITY) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingCity : vm.CommonFieldModel.BillToCity), Address.city.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.CITY);
        }
        if (!Address.state) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingState : vm.CommonFieldModel.BillToState));
        } else if (Address.state && Address.state.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.STATE) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingState : vm.CommonFieldModel.BillToState), Address.state.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.STATE);
        }
        if (!Address.postcode) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.REQUIRED_FIELD_MSG, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingZipCode : vm.CommonFieldModel.BillToZipCode));
        } else if (Address.postcode && Address.postcode.length > CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ZIPCODE) {
          modelObject.status = CORE.ApiResponseTypeStatus.FAILED;
          modelObject.message += stringFormat(CORE.CUSTOMER_IMPORT.COMMON_MAXLENGTH_MSG_WITH_FIELD, (Address.addressType === vm.addressType.ShippingAddress ? vm.CommonFieldModel.ShippingZipCode : vm.CommonFieldModel.BillToZipCode), Address.postcode.length, CORE.CUSTOMER_IMPORT.CUSTOMER_MAX_LENGTH.ZIPCODE);
        }
      } else {
        if (Address.addressType === vm.addressType.ShippingAddress) {
          delete modelObject['ShippingAddress'];
        } else {
          delete modelObject['BillingAddress'];
        }
      }
      return modelObject;
    };

    //open derived manufacturer popup
    function openMFRErrorPopup() {
      const data = {
        type: vm.IsDistibuter ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG,
        isCustOrDisty: vm.IsDistibuter ? true : vm.IsCustomer
      };
      $mdDialog.hide(false);
      if (!vm.isStatusPopupOpen) {
        DialogFactory.dialogService(
          CORE.MFR_IMPORT_MAPP_ERROR_MODAL_CONTROLLER,
          CORE.MFR_IMPORT_MAPP_ERROR_MODAL_VIEW,
          vm.event,
          data).then(() => {
          }, (data) => {
            if (data && (data.isDirty || data.isContinue)) {
              if (data.isAnyVerified.length > 0) {
                UpdateVerificationManufacturer(data);
              }
              else {
                commonFunction(data);
              }
            } else {
              getDerivedManufacturerList();
            }
          },
            (err) => BaseService.getErrorLog(err));
      }
    }

    //get derived manufacturer list
    function getDerivedManufacturerList() {
      vm.cgBusyLoading = ManufacturerFactory.getVerificationManufacturerList({
        type: (vm.IsManfucaturer || vm.IsCustomer) ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
        isCustOrDisty: (vm.IsManfucaturer || vm.IsCustomer) ? vm.IsCustomer : true
      }).query().$promise.then((response) => {
        if (response && response.data) {
          vm.apiVerificationErrorCount = (_.filter(_.uniqBy(response.data, 'importMfg'), (error) => !error.isVerified)).length;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //common function
    function commonFunction(data) {
      if (!data.isContinue) {
        $mdDialog.cancel(false);
      }
      else {
        vm.fileName = null;
        angular.element('#fiexcel').trigger('click');
      }
    }
    function UpdateVerificationManufacturer(data) {
      vm.cgBusyLoading = ManufacturerFactory.UpdateVerificationManufacturer().query({ manufacturers: data.isAnyVerified }).$promise.then(() => {
        commonFunction(data);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //export template details
    function exportFileDetail(res, name) {
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
      } else {
        const link = document.createElement('a');
        if (!link.download) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', name);
          link.style = 'visibility:hidden';
          document.body.appendChild(link);
          $timeout(() => {
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    }

    vm.changeMappingType = () => {
      vm.mfrmodel = [];
      if (vm.mappingType !== vm.uploadMappingType.F.Key) {
        vm.isfromHandsonTable = true;
        resetHandsontableDatails();
      }
      $timeout(() => {
        vm.isChanged = false;
        BaseService.currentPageFlagForm = [vm.isChanged];
      });
    };

    vm.cancel = () => {
      if (vm.isChanged) {
        showWithoutSavingAlertforBackButton(true);
      }
      else {
        vm.isChanged = false;
        BaseService.currentPageFlagForm = [];
        $mdDialog.cancel(false);
      }
    };

    function showWithoutSavingAlertforBackButton(isfromCancle, oldValue) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isChanged = false;
          BaseService.currentPageFlagForm = [];
          $mdDialog.cancel(false);
        }
        else if (!isfromCancle) {
          vm.mappingType = oldValue;
        }
      }, (error) => BaseService.getErrorLog(error));
    }
  }
})();

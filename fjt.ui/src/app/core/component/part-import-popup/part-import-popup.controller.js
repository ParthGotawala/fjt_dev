(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PartImportPopupController', PartImportPopupController);

  /** @ngInject */
  function PartImportPopupController($mdDialog, $scope, $timeout, CORE, RFQTRANSACTION, data, BaseService, ComponentFactory, DialogFactory, hotRegisterer) {
    var vm = this;
    var _mfrHeader = null;
    let _hotRegisterer = null;
    vm.mfgType = CORE.MFG_TYPE;
    vm.LabelConstant = CORE.LabelConstant;
    vm.uploadMappingType = angular.copy(CORE.uploadPartMappingType);
    vm.mappingType = vm.uploadMappingType.C1.Key;
    vm.isChanged = false;
    vm.importCustomerType = vm.IsCustomer ? vm.LabelConstant.MFG.Customer : vm.IsManfucaturer ? vm.LabelConstant.MFG.Manufacturer : vm.LabelConstant.MFG.Supplier;
    vm.loginUser = BaseService.loginUser;
    vm.CodeTitle = vm.LabelConstant.MFG.MFG;
    vm.NameTitle = data && data.mfgType === CORE.MFG_TYPE.DIST ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN;
    vm.uploadMappingType.C1.Value = stringFormat(vm.uploadMappingType.C1.Value, vm.LabelConstant.MFG.MFG, vm.NameTitle);
    vm.uploadMappingType.C2.Value = stringFormat(vm.uploadMappingType.C2.Value, vm.NameTitle);
    vm.transactionID = data && data.transactionID ? data.transactionID : getGUID();

    /* Define Module Title/Code Title and Sales Commission detail by Module Flag */
    function defineModuleWiseDetail() {
      _mfrHeader = [
        { fieldName: vm.CodeTitle, isRequired: true },
        { fieldName: vm.NameTitle, isRequired: true }];

      vm.handsontableMPNModel = [{ header: vm.NameTitle, column: vm.NameTitle }];
      vm.handsontableMFRMPNModel = [{ header: vm.CodeTitle, column: vm.CodeTitle }, { header: vm.NameTitle, column: vm.NameTitle }];
      vm.uploadMappingType.C2.Value = stringFormat(vm.uploadMappingType.C2.Value, vm.NameTitle);
    };
    defineModuleWiseDetail();

    vm.getUserImportTransctionId = () => {
      vm.cgBusyLoading = ComponentFactory.getUserImportTransctionId().query({
        userid: vm.loginUser.userid
      }).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.transactionID = resp.data.transactionID ? resp.data.transactionID : getGUID();
        }
      });
    };
    vm.getUserImportTransctionId();

    function resetHandsontableDatails() {
      vm.DefaultColumn = 2;
      vm.headerMapping = [];
      vm.DefaultColumnList = [];
      vm.hansonModel = [[]];
      if (vm.mappingType === vm.uploadMappingType.C2.Key) {
        vm.DefaultColumn = 1;
        vm.DefaultColumnList.push(vm.NameTitle);
      } else {
        vm.DefaultColumnList.push(vm.CodeTitle);
        vm.DefaultColumnList.push(vm.NameTitle);
      }
      // handsontable settings
      vm.settings = {
        rowHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: vm.DefaultColumnList,
        renderAllRows: false,
        minSpareRows: 20,
        autoColumnSize: true,
        minSpareCols: 0,
        maxCols: vm.DefaultColumn,
        fixedColumnsLeft: 0,
        stretchH: 'all',
        height: 300,
        autoWrapRow: true,
        autoWrapCol: true,
        contextMenu: false,
        mergeCells: false,
        manualColumnResize: true,
        selectionMode: 'multiple',
        fillHandle: false,
        columns: vm.DefaultColumnList,
        afterInit: function () {
          window.setTimeout(() => {
            _hotRegisterer = hotRegisterer.getInstance('hot-import-part');
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
            else if (index === 1) {
              vm.settings.colHeaders[index] = vm.NameTitle;
            }
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
          setHandsontableHeight();
        }
      });

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
      var offset = $('#hot-import-part-container').offset();
      var docHeight = $(document).height();
      if (!offset) {
        return;
      }

      const handsontableHeight = docHeight - offset.top - 40;
      $('#hot-import-part-container').height(handsontableHeight).css({
        overflow: 'hidden'
      });
      $('#hot-import-part-container').width('auto');
      if (vm.DefaultColumn && vm.DefaultColumn < 1) {
        const width = vm.DefaultColumn * 25;
        $('#hot-import-part-container').width(width + '%').css({
          overflow: 'hidden'
        });
      }
      else if (vm.mappingType === vm.uploadMappingType.C2.Key) {
        $('#hot-import-part-container').width('auto');
      }
      $('#hot-import-part-container .wtHolder').height(handsontableHeight);
      $('#hot-import-part-container .wtHolder').width('auto');
    }

    /* On Pop-up size resize handsontable */
    $(window).resize(() => {
      handsontableresize();
    });

    /* On Calculate size handsontable */
    function handsontableresize() {
      var offset = $('#hot-import-part-container').offset();

      if (!offset) {
        return;
      }
      const docHeight = $(document).height();
      const tableHeight = docHeight - offset.top - 40;
      $('#hot-import-part-container .wtHolder').height(tableHeight);
    };

    // Create model from array
    function generateModel(uploadedMFR, mfrHeaders, excelHeader) {
      vm.mfrmodel = [];
      // loop through excel data and bind into model
      let rowIndex = 0;
      const len = uploadedMFR.length;
      for (rowIndex; rowIndex < len; rowIndex++) {
        const item = uploadedMFR[rowIndex];
        const modelRow = {};
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
      vm.uploadedMFR = angular.copy(uploadedMFR);
      vm.mfrHeaders = angular.copy(mfrHeaders);
      vm.excelHeader = angular.copy(excelHeader);
      const isEmptyRecord = checkEmptyRecordExists(vm.mfrmodel);
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
      let modelList = [];
      const errorList = [];
      _.each(vm.mfrmodel, (model) => {
        const modelObject = {};
        const isBlankRecord = Object.values(model).every((detail) => detail === null || (Array.isArray(detail) && detail.length === 0));
        if (!isBlankRecord) {
          modelObject.mfgPN = model[vm.NameTitle];
          modelObject.mfgCode = model[vm.CodeTitle];

          modelObject.mfgPN = model[vm.NameTitle];
          if (modelObject.mfgPN && (modelObject.mfgPN.trim()).length > CORE.MAX_MPN_LENGTH) {
            errorList.push(modelObject.mfgPN);
          } else {
            modelList.push(modelObject);
          }
        }
      });
      if (errorList.length > 0 || modelList.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.MAX_LENGTH_MPN_IMPORT);
        messageContent.message = messageContent.message + `<br/><br/><table style="width:100%"><thead><tr><th class="border-bottom padding-5">${vm.NameTitle}</th></tr></thead><tbody>{0}</tbody></table>`;
        if (errorList.length > 0) {
          const subMessage = [];
          _.each(errorList, (item) => {
            subMessage.push(`<tr><td class="border-bottom padding-5">${item}</td></tr>`);
          });
          messageContent.message = stringFormat(messageContent.message, subMessage.join(''));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              modelList = _.uniqWith(modelList, _.isEqual);
              const mpnDet = {
                mfgPnImportedDetail: modelList,
                transactionID: vm.transactionID,
                isAppend: data && data.isAppend ? data.isAppend : false
              };
              vm.cgBusyLoading = ComponentFactory.importComponentDetail().query(mpnDet).$promise.then((manufacturer) => {
                if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.changeMappingType();
                  $mdDialog.cancel(true);
                  openMFRErrorPopup();
                }
              });
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          modelList = _.uniqWith(modelList, _.isEqual);
          const mpnDet = {
            mfgPnImportedDetail: modelList,
            transactionID: vm.transactionID,
            isAppend: data && data.isAppend ? data.isAppend : false
          };
          vm.cgBusyLoading = ComponentFactory.importComponentDetail().query(mpnDet).$promise.then((manufacturer) => {
            if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.changeMappingType();
              $mdDialog.cancel(true);
              openMFRErrorPopup();
            }
          });
        }
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NO_RECORD_EXISTS);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }
    }

    /* Save uploaded data to MFR */
    vm.save = () => {
      generateModel(vm.hansonModel, vm.mappingType === vm.uploadMappingType.C2.Key ? vm.handsontableMPNModel : vm.handsontableMFRMPNModel, vm.settings.colHeaders, true);
    };

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

    //open derived manufacturer popup
    function openMFRErrorPopup() {
      const data = {
        type: vm.IsDistibuter ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG,
        isCustOrDisty: vm.IsDistibuter ? true : vm.IsCustomer
      };
      $mdDialog.cancel();
      DialogFactory.dialogService(
        CORE.COMPONENT_IMPORT_MAPP_ERROR_MODAL_CONTROLLER,
        CORE.COMPONENT_IMPORT_MAPP_ERROR_MODAL_VIEW,
        vm.event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    }
    vm.changeMappingType = () => {
      vm.mfrmodel = [];
      resetHandsontableDatails();
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

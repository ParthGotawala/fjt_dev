(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('ManageLaborCostTemplateController', ManageLaborCostTemplateController);

  /** @ngInject */
  function ManageLaborCostTemplateController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, ComponentFactory, $stateParams, ImportExportFactory, $state, $filter) {
    const vm = this;
    vm.id = $stateParams.id;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.LABOR_COST_DETAILS_EMPTY;
    vm.sourceData = [];
    vm.sourceDataCopy = [];
    vm.isUpdatable = true;
    vm.isLaborCostDetailsUpdate = false;
    const deletedLaborCostDetails = [];
    vm.laborCostDetailsId = null;
    const oldTemplateName = null;
    const fieldMappingObj = angular.copy(CORE.Import_export.LaborCostTemplate);
    const laborCostHeaders = _.values(fieldMappingObj);
    vm.Module = CORE.LABOR_COST.LABOR_COST_PRICE_DETAILS;
    vm.historyactionButtonName = `${CORE.LABOR_COST.LABOR_COST_TEMPLATE} History`;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    /* Set as default Active*/
    vm.laborCost = {
      isActive: true
    };
    /*Used to bind matrix types*/
    vm.priceMatrixTypes = _.values(CORE.PRICE_MATRIX_TYPES);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    /* Go back*/
    vm.goBack = () => {
      if (vm.laborCostForm.$dirty || vm.laborCostDetailsForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      }
      else {
        $state.go(USER.ADMIN_LABOR_COST_TEMPLATE_STATE, {});
      }
    };
    /* Used to show confirmation popup in case of form is dirty*/
    function showWithoutSavingAlertforBackButton(item) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.laborCostForm) {
            vm.laborCostForm.$setPristine();
          }
          if (vm.laborCostDetailsForm) {
            vm.laborCostDetailsForm.$setPristine();
          }
          BaseService.currentPageForms = [];
          if (!item) {
            $state.go(USER.ADMIN_LABOR_COST_TEMPLATE_STATE, {});
          } else {
            vm.id = item.id;
            if (!item.id) {
              if (vm.autoCompleteLaborCostTemplate) { $scope.$broadcast(vm.autoCompleteLaborCostTemplate.inputName, null); }
              vm.laborCostTemplate = null;
            }
            $state.go(USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE, { id: item.id }, {}, { reload: true });
          }
        }
      }, (error) => BaseService.getErrorLog(error));
    }
    /* Used to get mounting type list*/
    const getMountingTypeList = () => ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
      vm.mountingTypeList = res.data;
      if (vm.id) {
        getLaborCostDetailsByTemplateId();
      }
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    getMountingTypeList();

    //let getInsertedData = (insertedDataFromPopup) => {
    //}

    /*Auto complete for mounting type*/
    vm.autoCompleteMountingType = {
      columnName: 'name',
      keyColumnName: 'id',
      controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
      keyColumnId: null,
      inputName: 'Mounting Type',
      placeholderName: 'Mounting Type',
      isRequired: true,
      isAddnew: true,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE],
        pageNameAccessLabel: CORE.PageName.mounting_type
      },
      callbackFn: getMountingTypeList
    };



    /* get labor cost details by Id*/
    const getLaborCostDetailsByTemplateId = () => {
      vm.cgBusyLoading = RFQSettingFactory.retriveLaborCostTemplate().query({ id: vm.id }).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.laborCost = response.data.LaborCostTemplate[0];
          const resLaborCost = response.data.LaborCostTemplateDetail;
          vm.sourceData = resLaborCost;
          _.each(vm.sourceData, (item, index) => {
            item.lineNo = parseInt(index) + 1;
          });
          vm.sourceDataCopy = angular.copy(vm.sourceData);
          vm.isNoDataFound = false;
          vm.totalSourceDataCount = vm.sourceData.length;
          vm.currentdata = vm.sourceData.length;
          vm.copyActive = angular.copy(vm.laborCost.isActive);
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //if (vm.id) {
    //    getLaborCostDetailsByTemplateId();
    //}
    /* Check duplicate*/
    vm.checkUniqueTemplateName = () => {
      const data = {
        name: vm.laborCost.templateName,
        id: vm.id ? vm.id : null
      };
      if (vm.laborCost.templateName && vm.laborCost.templateName != oldTemplateName) {
        vm.cgBusyLoading = RFQSettingFactory.checkUniqueTemplateName().save(data).$promise.then((response) => {
          vm.cgBusyLoading = false;
          if (response && response.status !== CORE.ApiResponseTypeStatus.SUCCESS && response.errors && response.errors.data && response.errors.data.isDuplicateName) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, CORE.LABOR_COST.LABOR_COST_TEMPLATE_NAME);
            const alertModel = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
              if (yes) {
                vm.laborCost.templateName = '';
                setFocus('templateName');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /*Used to check max length*/
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* Init sorce header*/
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
      cellTemplate: '<grid-action-view grid=\'grid\' row=\'row\'></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true
    },
    {
      field: '#',
      width: '70',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'MountingTypeName',
      displayName: 'Mounting Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300'
    },
    {
      field: 'qpa',
      displayName: 'QPA / Line Count',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      width: '120'
      //enableFiltering: false,
      //enableSorting: false,
    },
    {
      field: 'orderedQty',
      displayName: 'Ordered Qty',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      width: '120'
      //enableFiltering: false,
      //enableSorting: false,
    },
    {
      field: 'price',
      displayName: 'Price $',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>',
      width: '120'
      //enableFiltering: false,
      //enableSorting: false,
    }
    ];
    /* Init grid page info*/
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['MountingTypeName', 'ASC']],
        SearchColumns: []
      };
    };

    initPageInfo();
    /* Init grid option*/
    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true
    };

    /* bind labor cost price list*/
    vm.loadData = (pagingInfo) => {
      if (pagingInfo.SortColumns.length > 0) {
        const column = [];
        const sortBy = [];
        _.each(pagingInfo.SortColumns, (item) => {
          column.push(item[0]);
          sortBy.push(item[1]);
        });
        vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
        vm.sortData = _.clone(vm.sourceData);
        vm.totalSourceDataCount = vm.sourceData.length;
      }
      else {
        vm.sourceData = vm.sourceDataCopy;
      }
      if (pagingInfo.SearchColumns.length > 0) {
        if (!vm.search) {
          vm.sourceDataCopy = _.clone(vm.sourceData);
        }
        vm.search = true;
        _.each(pagingInfo.SearchColumns, (item) => {
          vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
        });
        if (vm.sourceData.length === 0) {
          vm.emptyState = 0;
        }
      }
      else {
        vm.emptyState = null;
        if (vm.search) {
          vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
          vm.search = false;
        }
      }
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.sourceData.length;
      if (vm.totalSourceDataCount === 0 && pagingInfo.SearchColumns.length === 0) {
        vm.isNoDataFound = true;
        vm.emptyState = null;
      }
      $timeout(() => {
        vm.resetSourceGrid();
        if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    };

    /*Add row to the labor cost details grid*/
    vm.addRow = () => {
      vm.mountingTypes = _.find(vm.mountingTypeList, (item) => vm.autoCompleteMountingType.keyColumnId == item.id);

      if (vm.laborCostDetailsForm.$invalid || !vm.mountingTypes) {
        BaseService.focusRequiredField(vm.laborCostDetailsForm);
        return;
      }

      let dataModel = {
        mountingTypeID: vm.autoCompleteMountingType.keyColumnId,
        MountingTypeName: vm.mountingTypes.name,
        qpa: vm.laborCostDetails.qpa,
        orderedQty: vm.laborCostDetails.orderedQty ? vm.laborCostDetails.orderedQty : 0,
        price: vm.laborCostDetails.price
      };
      vm.checkdirty = true;
      vm.laborCostForm.$$controls[0].$setDirty();
      vm.sourceData.push(dataModel);
      vm.sourceDataCopy = null;
      vm.sourceDataCopy = angular.copy(vm.sourceData);
      dataModel = [];
      vm.reset();
      vm.isNoDataFound = false;
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.sourceData.length;
      $timeout(() => {
        vm.resetSourceGrid();
        return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
      });
    };
    /*Used to check unique QPA*/
    vm.checkUniqueQPA = () => {
      vm.mountingTypes = _.find(vm.mountingTypeList, (item) => vm.autoCompleteMountingType.keyColumnId == item.id);
      if (vm.mountingTypes) {
        const isExist = _.some(vm.sourceData, (item) => {
          if (vm.laborCostDetails.lineNo) {
            if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value) {
              return vm.laborCostDetails.lineNo != item.lineNo && vm.mountingTypes.id == item.mountingTypeID && item.qpa == vm.laborCostDetails.qpa;
            } else {
              return vm.laborCostDetails.lineNo != item.lineNo && vm.mountingTypes.id == item.mountingTypeID && item.qpa == vm.laborCostDetails.qpa && item.orderedQty == vm.laborCostDetails.orderedQty;
            }
          } else {
            if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value) {
              return vm.mountingTypes.id == item.mountingTypeID && item.qpa == vm.laborCostDetails.qpa;
            } else {
              return vm.mountingTypes.id == item.mountingTypeID && item.qpa == vm.laborCostDetails.qpa && item.orderedQty == vm.laborCostDetails.orderedQty;
            }
          }
        });
        if (isExist && !vm.isValidationpopupOpen) {
          vm.isValidationpopupOpen = true;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value ? CORE.MESSAGE_CONSTANT.LINE_OVERHEAD_QPA_VALIDATION_MESSAGE : CORE.MESSAGE_CONSTANT.QPA_PRICE_MATRIX_QPA_VALIDATION_MESSAGE);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
            if (yes) {
              vm.laborCostDetails.qpa = '';
              vm.laborCostDetails.orderedQty = '';
              setFocus('qpa');
              vm.isValidationpopupOpen = false;
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          return true;
        }
      }
    };
    /*Used to reset form*/
    vm.reset = (resetButtonClick) => {
      //vm.laborCostDetails = null;
      $scope.$applyAsync(() => {
        if (vm.laborCostDetails) {
          vm.laborCostDetails.orderedQty = null;
          vm.laborCostDetails.price = null;
          vm.laborCostDetails.qpa = null;
        }
        if (vm.laborCostDetailsForm) {
          vm.laborCostDetailsForm.$setPristine();
          vm.laborCostDetailsForm.$setUntouched();
        }
      });
      //vm.laborCostDetailsForm.$invalid = false;
      //vm.laborCostDetailsForm.$valid = true;
      if (resetButtonClick) {
        vm.isLaborCostDetailsUpdate = false;
        vm.autoCompleteMountingType.keyColumnId = null;
        $scope.$broadcast(vm.autoCompletemfgCode ? vm.autoCompleteMountingType.inputName : null, null);
      }

      setFocus('qpa');
    };
    /* delete labor cost price details slip material*/
    vm.deleteRecord = (data) => {
      let selectedIDs = [];
      if (data) {
        selectedIDs.push(data.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }
      if (selectedIDs) {
        deletedLaborCostDetail(data, selectedIDs);
      }
    };
    /* delete labor cost price details*/
    function deletedLaborCostDetail(data, selectedIDs) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, CORE.LABOR_COST.LABOR_COST_PRICE_DETAILS, selectedIDs.length);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (data) {
            const index = _.findIndex(vm.sourceData, (obj) => obj.lineNo == data.lineNo);
            deletedLaborCostDetails.push(data);
            if (index !== -1) {
              vm.sourceData.splice(index, 1);
            }
          }
          else {
            _.each(vm.selectedRowsList, (item) => {
              const index = _.findIndex(vm.sourceData, (obj) => obj.lineNo == item.lineNo);
              deletedLaborCostDetails.push(item);
              if (index !== -1) {
                vm.sourceData.splice(index, 1);
              }
            });
          }
          vm.totalSourceDataCount = vm.sourceData.length;
          if (vm.sourceData.length === 0) {
            vm.isNoDataFound = true;
          }
          if (vm.gridOptions) {
            vm.gridOptions.currentItem = vm.totalSourceDataCount;
            vm.gridOptions.totalItems = vm.totalSourceDataCount;
          }
          vm.laborCostForm.$$controls[0].$setDirty();
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /*Save labor cost template and its details*/
    vm.saveLaborCostDetails = () => {
      if (BaseService.focusRequiredField(vm.laborCostForm)) {
        return;
      }
      if (vm.laborCostForm.$invalid || vm.sourceData.length === 0 || vm.laborCost.pricetype === '') {
        BaseService.focusRequiredField(vm.laborCostForm);
        if (vm.laborCost.pricetype) {
          BaseService.focusRequiredField(vm.laborCostDetailsForm);
        }
        return;
      }
      if (vm.copyActive != vm.laborCost.isActive && vm.laborCost.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Active' : 'Inactive', vm.laborCost.isActive ? 'Active' : 'Inactive');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            savelaborTemplete();
          }
        }, () => {
          // empty
        });
      } else {
        savelaborTemplete();
      }
    };
    //save labor templete
    const savelaborTemplete = () => {
      const laborCostData = { laborCostDetails: vm.sourceData, laborCostTemplate: vm.laborCost, deletedLaborCostDetails: deletedLaborCostDetails, laborcostmstID: vm.id ? vm.id : null };
      vm.cgBusyLoading = RFQSettingFactory.saveLaborCost().save(laborCostData).$promise.then((response) => {
        vm.id = response.data.response.id ? response.data.response.id : vm.id;
        vm.laborCost.id = vm.id;

        vm.RadioGroup = {
          isActive: {
            array: CORE.ActiveRadioGroup
          }
        };
        vm.copyActive = angular.copy(vm.laborCost.isActive);
        vm.laborCostForm.$setPristine();
        vm.laborCostDetailsForm.$setPristine();
        vm.checkdirty = false;
        $state.go(USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE, {
          id: vm.id
        }, {}, { reload: true });
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*Used to select labor cost details to update data*/
    vm.updateRecord = (row) => {
      //vm.laborCostDetailsId = _.clone(row.entity.id);
      var objLaborCost = _.clone(row.entity);
      vm.laborCostDetails = objLaborCost;
      vm.isLaborCostDetailsUpdate = true;
      const mountingType = _.find(vm.mountingTypeList, (mountingTypeItem) => mountingTypeItem.id == row.entity.mountingTypeID);
      vm.laborCostDetails.orderedQty = _.clone(row.entity.orderedQty);
      vm.autoCompleteMountingType.keyColumnId = mountingType.id;
    };

    /*Used to select labor cost details to update data*/
    vm.editRow = () => {
      var objLaborCost = _.find(vm.sourceData, (item) => item.lineNo == vm.laborCostDetails.lineNo);
      //objLaborCost.mountingTypeID = vm.autoCompleteMountingType.keyColumnId;
      if (objLaborCost) {
        const index = _.indexOf(vm.sourceData, objLaborCost);
        vm.sourceData.splice(index, 1);
        const obj = _.clone(vm.laborCostDetails);
        vm.mountingTypes = _.find(vm.mountingTypeList, (item) => vm.autoCompleteMountingType.keyColumnId == item.id);
        obj.mountingTypeID = vm.autoCompleteMountingType.keyColumnId;
        obj.MountingTypeName = vm.mountingTypes.name;
        vm.sourceData.splice(index, 0, obj);
        vm.isLaborCostDetailsUpdate = false;
        vm.checkdirty = true;
        vm.laborCostForm.$$controls[0].$setDirty();
        vm.reset();
      }
    };

    vm.downloadDocument = () => {
      vm.cgBusyLoading = RFQSettingFactory.downloadLaborCostTemplate(vm.Module).then((response) => {
        downloadCommonFunction(response);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.ExportLaborCostDetailDocument = () => {
      vm.cgBusyLoading = RFQSettingFactory.ExportLaborCostDetailTemplate({ id: vm.id, module: vm.Module }).then((response) => {
        downloadCommonFunction(response);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // download common function
    const downloadCommonFunction = (response) => {
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
        const blob = new Blob([response.data], { type: 'text/xlsx' });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, vm.Module + '.xlsx');
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', vm.Module + '.xlsx');
            link.style = 'visibility:hidden';
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              document.body.removeChild(link);
            });
          }
        }
      }
    };

    /*Used to import document*/
    vm.importDocument = () => {
      if (vm.laborCost.pricetype) {
        angular.element('#fi-excel').trigger('click');
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.LABOR_SELECT_PRICE_TYPE);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
    };
    /*Called when select file to import*/
    vm.erOptions = {
      workstart: function () {
      },
      workend: function () {
      },
      sheet: function (json, sheetnames, select_sheet_cb) {
        columnMappingPopup(json, sheetnames, select_sheet_cb);
      },
      badfile: function () {
        alertBadFile();
      },
      pending: function () {
        // console.log('Pending');
      },
      failed: function (e) {
        alertUploadFailed(e);
      },
      large: function () {
        alertUploadLarge();
      }
    };

    /*Column Mapping Common function*/
    const columnMappingPopup = (json) => {
      const excelHeaders = CORE.LABOR_COST_HEADER;//["Mounting Type", "QPA", "Ordered Qty", "Price($)"];
      var data = {
        laborCostHeaders: laborCostHeaders,
        excelHeaders: json[0],
        notquote: true
      };
      if (_.isEqual(excelHeaders, data.excelHeaders)) {
        DialogFactory.dialogService(
          USER.FIELD_MAPPING_CONTROLLER,
          USER.FIELD_MAPPING_VIEW,
          vm.event,
          data).then((result) => {
            json[0] = result.excelHeaders;
            generateModelPopup(json, result.model);
          }, (err) => BaseService.getErrorLog(err));
      } else {
        alertBadFile();
      }
    };
    /*alert upload file failed*/
    const alertUploadFailed = (e) => {
      var model = {
        title: CORE.MESSAGE_CONSTANT.ERROR,
        textContent: e.stack,
        multiple: true
      };
      DialogFactory.alertDialog(model);
      // console.log(e, e.stack);
    };

    /*alert large file upload*/
    const alertUploadLarge = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    };
    /*alert for bad file*/
    const alertBadFile = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    };

    /*Create model from array*/
    const generateModelPopup = (uploadedData, dataHeaders) => {
      var laborCostModel = [];
      /*loop through excel data and bind into model*/
      for (let i = 1, len = uploadedData.length; i < len; i++) {
        const item = uploadedData[i];
        const modelRow = {};
        uploadedData[0].forEach((column, index)=> {
          if (column == null) {
            return;
          }
          const obj = dataHeaders.find((x) => x.column && x.column.toUpperCase() == column.name.toUpperCase());
          if (!obj) {
            return;
          }
          const field = laborCostHeaders.find((x) => x.Name == obj.header);
          if (field && !modelRow[field.Name]) {
            modelRow[field.Name] = item[index] ? item[index] : null;
          }
        });
        laborCostModel.push(modelRow);
      };
      checkUploadedLaborCostPopup(laborCostModel);
    };

    let isFileImportInvalid = false;
    /*check for validation for fields after update*/
    let LineNumber = 0;
    function checkUploadedLaborCostPopup(fileData) {
      isFileImportInvalid = false;
      const dataModel = [];
      _.each(fileData, (item, index) => {
        var isDirty = false;
        var remark = '';
        var error = '';
        /*check validation*/
        if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.QPA_PRICE_MATRIX_TEMPLATE.Value) {
          if (item[fieldMappingObj.ORDEREDQTY.Name] && (item[fieldMappingObj.ORDEREDQTY.Name]).toString().length < 9) {
            item[fieldMappingObj.ORDEREDQTY.Name] = parseInt(item[fieldMappingObj.ORDEREDQTY.Name]);
            if (item[fieldMappingObj.ORDEREDQTY.Name] < 0) {
              error = stringFormat('{0},{1}', fieldMappingObj.ORDEREDQTY.Name, CORE.MESSAGE_CONSTANT.INVALID);
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          } else if (item[fieldMappingObj.ORDEREDQTY.Name]) {
            error = stringFormat('{0},{1}', fieldMappingObj.ORDEREDQTY.Name, vm.getMaxLengthValidation(8, item[fieldMappingObj.ORDEREDQTY.Name] ? (item[fieldMappingObj.ORDEREDQTY.Name]).toString().length : 0));
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        }

        if (item[fieldMappingObj.QPA.Name] && (item[fieldMappingObj.QPA.Name]).toString().length < 9) {
          item[fieldMappingObj.QPA.Name] = parseInt(item[fieldMappingObj.QPA.Name]);
          if (item[fieldMappingObj.QPA.Name] <= 0) {
            error = stringFormat('{0},{1}', fieldMappingObj.QPA.Name, CORE.MESSAGE_CONSTANT.INVALID);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        } else if (item[fieldMappingObj.QPA.Name]) {
          error = stringFormat('{0},{1}', fieldMappingObj.QPA.Name, vm.getMaxLengthValidation(8, item[fieldMappingObj.QPA.Name] ? (item[fieldMappingObj.QPA.Name]).toString().length : 0));
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }

        if (item[fieldMappingObj.PRICE.Name] && (item[fieldMappingObj.PRICE.Name]).toString().length < 9) {
          item[fieldMappingObj.PRICE.Name] = parseFloat(item[fieldMappingObj.PRICE.Name]);
          if (item[fieldMappingObj.PRICE.Name] <= 0) {
            error = stringFormat('{0},{1}', fieldMappingObj.PRICE.Name, CORE.MESSAGE_CONSTANT.INVALID);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        } else if (item[fieldMappingObj.PRICE.Name]) {
          error = stringFormat('{0},{1}', fieldMappingObj.PRICE.Name, vm.getMaxLengthValidation(8, item[fieldMappingObj.PRICE.Name] ? (item[fieldMappingObj.PRICE.Name]).toString().length : 0));
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }

        if (item[fieldMappingObj.MountingType.Name]) {
          const mountingType = _.find(vm.mountingTypeList, (dataItem) => item.MountingTypeName == dataItem.name);
          if (!mountingType) {
            error = stringFormat('{0},{1}', fieldMappingObj.MountingType.Name, CORE.MESSAGE_CONSTANT.INVALID);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
          else {
            item.mountingTypeID = mountingType.id;

            /*Used to check unique mounting type and QPA*/
            const isExist = _.some(vm.sourceData, (dataItem) => {
              if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value) {
                return dataItem.mountingTypeID == item.mountingTypeID && dataItem.qpa == item.qpa;
              } else {
                return dataItem.mountingTypeID == item.mountingTypeID && dataItem.qpa == item.qpa && dataItem.orderedQty == item.orderedQty;
              }
            });

            if (isExist) {
              error = stringFormat(CORE.MESSAGE_CONSTANT.MUST_UNIQUE_GLOBAL, vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value ? CORE.MESSAGE_CONSTANT.LINE_OVERHEAD_QPA_VALIDATION_MESSAGE : CORE.MESSAGE_CONSTANT.QPA_PRICE_MATRIX_QPA_VALIDATION_MESSAGE)
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }

          const isDuplicate = _.find(fileData, (dataItem, objIndex) => {
            if (objIndex !== index) {
              if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value) {
                return item.MountingTypeName == dataItem.MountingTypeName && dataItem.qpa == item.qpa;
              } else {
                return item.MountingTypeName == dataItem.MountingTypeName && dataItem.qpa == item.qpa && dataItem.orderedQty == item.orderedQty;
              }
            }
          });
          if (isDuplicate) {
            error = stringFormat(CORE.MESSAGE_CONSTANT.DUPLICATE_ENTRY, vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value ? CORE.MESSAGE_CONSTANT.LINE_OVERHEAD_QPA_VALIDATION_MESSAGE : CORE.MESSAGE_CONSTANT.QPA_PRICE_MATRIX_QPA_VALIDATION_MESSAGE);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        }

        if (!item[fieldMappingObj.MountingType.Name]) {
          error = stringFormat('{0},{1}', fieldMappingObj.MountingType.Name, CORE.MESSAGE_CONSTANT.INVALID);
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }

        if (!item[fieldMappingObj.QPA.Name]) {
          error = stringFormat('{0},{1}', fieldMappingObj.QPA.Name, vm.CORE_MESSAGE_CONSTANT.REQUIRED);
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }
        if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.QPA_PRICE_MATRIX_TEMPLATE.Value) {
          if (!item[fieldMappingObj.ORDEREDQTY.Name]) {
            error = stringFormat('{0},{1}', fieldMappingObj.ORDEREDQTY.Name, vm.CORE_MESSAGE_CONSTANT.REQUIRED);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        }

        if (!item[fieldMappingObj.PRICE.Name]) {
          error = stringFormat('{0},{1}', fieldMappingObj.PRICE.Name, vm.CORE_MESSAGE_CONSTANT.REQUIRED);
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }
        if (isDirty) {
          item.Remark = remark.substring(1);
          if (!isFileImportInvalid) {
            isFileImportInvalid = true;
          }
        }
        LineNumber += 1;
        item.lineNo = LineNumber;
        dataModel.push(item);
      });
      if (isFileImportInvalid && dataModel.length > 0) {
        exportFilePopup(dataModel, 'errorLaborCost.xls');
      }
      else {
        _.each(dataModel, (item) => {
          if (vm.laborCost.pricetype == CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Value) {
            item.orderedQty = 0;
          }
          vm.sourceData.push(item);
        });
        vm.sourceDataCopy = null;
        vm.sourceDataCopy = angular.copy(vm.sourceData);
        vm.isNoDataFound = false;
        vm.totalSourceDataCount = vm.sourceData.length;
        vm.currentdata = vm.sourceData.length;
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        });
      }
    }

    vm.changePartType = () => {
      vm.sourceData = [];
      vm.sourceDataCopy = angular.copy(vm.sourceData);
      vm.isNoDataFound = true;
      vm.currentdata = vm.sourceData.length;
    };

    /*Used to export document*/
    const exportFilePopup = (LaborCostList, name) => {
      vm.cgBusyLoading = ImportExportFactory.importFile(LaborCostList).then((res) => {
        if (res.data && LaborCostList.length > 0) {
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, name);
          } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
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
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*Validation for price*/
    vm.validatePrice = () => {
      if (vm.laborCostDetails.orderedQty && vm.laborCostDetails.orderedQty != 0) {
        if (vm.sourceData.length === 0) {
          return;
        }
        const filterdQty = _.filter(vm.sourceData, (item) => item.orderedQty >= vm.laborCostDetails.orderedQty);

        const filterdPrice = _.filter(filterdQty, (item) => vm.laborCostDetails.price > item.price);

        const maxPrice = _.max(vm.sourceData, (item) => item);

        if (filterdPrice.length > 0 || vm.laborCostDetails.price > maxPrice.price) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.PRICE_VALIDATION_MESSAGE);
          const alertModel = {
            messageConten: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(alertModel).then((yes) => {
            if (yes) {
              vm.laborCostDetails.price = '';
              setFocus('price');
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    /*Used to redirect to mounting type*/
    vm.goToEquipmentTypeList = () => {
      BaseService.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
    };

    /* Show History Popup */
    vm.openLaborCostHistoryPopup = (ev) => {
      const data = {
        id: vm.id,
        title: `${CORE.LABOR_COST.LABOR_COST_TEMPLATE} History`,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.LABOR_COST_TEMPLATE,
        EmptyMesssage: CORE.COMMON_HISTORY.LABOR_COST_TEMPLATE.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: CORE.COMMON_HISTORY.LABOR_COST_TEMPLATE.LABLE_NAME,
          value: vm.laborCost.templateName,
          displayOrder: 1,
          labelLinkFn: vm.goToLaborCostTemplateList,
          valueLinkFn: vm.goToManageLaborCostTemplate,
          valueLinkFnParams: vm.id
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Labor Cost Template list page. */
    vm.goToLaborCostTemplateList = () => BaseService.goToLaborCostTemplateList();
    /* Goto manage Labor Cost Template page. */
    vm.goToManageLaborCostTemplate = (id) => BaseService.goToManageLaborCostTemplate(id);

    //get all labor cost template detail
    const getLaborCostTempMstDbList = (searchObj) => RFQSettingFactory.getLaborCostTemplateMstNumber().query(searchObj).$promise.
      then((lCostNumberComp) => {
        if (lCostNumberComp && lCostNumberComp.data) {
          if (searchObj.plborID) {
            $timeout(() => {
              if (vm.autoCompleteLaborCostTemplate && vm.autoCompleteLaborCostTemplate.inputName) {
                $scope.$broadcast(vm.autoCompleteLaborCostTemplate.inputName, lCostNumberComp.data[0]);
              }
            });
          }
          return lCostNumberComp.data;
        }
        else {
          return [];
        }
      }).catch((error) => BaseService.getErrorLog(error));

    const selectCostTemplate = (item) => {
      if (item) {
        vm.laborCostTemplate = item.templateName;
        if (item.id !== vm.id) {
          if ((vm.laborCostForm && (vm.laborCostForm.$dirty && vm.laborCostForm.$invalid)) ||
            (vm.laborCostDetailsForm && (vm.laborCostDetailsForm.$dirty && vm.laborCostDetailsForm.$invalid))) {
            showWithoutSavingAlertforBackButton(item);
          } else {
            vm.id = item.id;
            $state.go(USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE, { id: item.id }, {}, { reload: true });
          }
        }
        $timeout(() => {
          $scope.$broadcast(vm.autoCompleteLaborCostTemplate.inputName, null);
        }, true);
      }
    };
    // labor cost template autocomplete
    vm.autoCompleteLaborCostTemplate = {
      columnName: 'templateCostName',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Labor Template',
      placeholderName: 'Labor Template',
      isRequired: false,
      callbackFn: function (obj) {
        const searchObj = {
          plborID: obj.id,
          searchString: null
        };
        return getLaborCostTempMstDbList(searchObj);
      },
      onSelectCallbackFn: selectCostTemplate,
      onSearchFn: function (query) {
        const searchObj = {
          plborID: null,
          searchString: query
        };
        return getLaborCostTempMstDbList(searchObj);
      }
    };
    const searchObj = {
      plborID: vm.id,
      searchString: null
    };
    getLaborCostTempMstDbList(searchObj);

    vm.addlaborCostTemplate = (isNewTab) => {
      BaseService.goToManageLaborCostTemplate(null, isNewTab);
    };
    /*Caled on load form*/
    angular.element(() => {
      BaseService.currentPageForms = [vm.laborCostDetailsForm, vm.laborCostForm];
    });
  }
})();

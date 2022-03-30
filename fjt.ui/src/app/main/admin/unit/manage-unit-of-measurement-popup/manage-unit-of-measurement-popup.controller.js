(function () {
  'use strict';

  angular
    .module('app.admin.unit')
    .controller('ManageUnitOfMeasurementPopUpController', ManageUnitOfMeasurementPopUpController);

  function ManageUnitOfMeasurementPopUpController($mdDialog, $q, $timeout, data, CORE, USER, UnitFactory, DialogFactory, BaseService, ComponentFactory, $scope) {
    const vm = this;
    vm.isUpdatable = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMessageUDF = USER.ADMIN_EMPTYSTATE.UNIT_DETAIL_FORMULA;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.measurementTypeList = [];
    vm.baseUnitList = [];
    vm.toUnitList = [];
    let autocompletePromise = [];
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.tables = CORE.TABLE_NAME.UOM;
    vm.searchType = CORE.RFQ_SETTING.UOM;
    vm.UOMOperator = CORE.UOM_OPERATOR;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.UnitDetailFormulaModel = {};
    $scope.splitPaneFirstProperties = {};
    vm.aliasFieldName = 'uomalias';
    const typeId = data && data.typeId ? data.typeId : 0;
    let lastUnitId = 0;
    vm.headerdata = [];
    vm.radioButtonGroup = {
      isFormula: {
        array: USER.EmployeeRadioGroup.isFormula
      }
    };
    vm.listUOM = data && data.listUOM ? data.listUOM : [];
    vm.selectedType = data && data.selectedType ? data.selectedType : null;
    vm.disableOnFormula = false;
    let baseUnitValue;
    vm.isSetDefaultUOM = false;
    vm.DefaultUOMMessage = stringFormat(angular.copy(USER.DefaultUOMMessage), vm.selectedType);
    vm.enableDisableBaseUOM = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToEnableDisableBaseUOM);
    const searchColumn = {
      ColumnDataType: 'Number',
      ColumnName: 'unitID',
      SearchString: vm.UnitDetailFormulaModel.unitID
    };

    vm.goToUOMList = () => {
      BaseService.goToUOMList();
      return false;
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-center-center',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    },
    {
      field: '#',
      width: '70',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'unitName',
      displayName: 'From Unit',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'toUnitName',
      displayName: 'To Unit',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: '1UOM',
      displayName: '1 UOM',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'formula',
      displayName: 'Formula',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    }, {
      field: 'currentValue',
      displayName: 'Formula Equivalent',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}{{\' \'+row.entity.BaseUOM}}</div>'
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['unitName', 'ASC']],
        SearchColumns: [],
        UnitID: data ? data.id : 0
      };
    };

    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns
    };

    // [S] Method for Unit (Unit of measurement) list
    const getUnitOfMeasurementsFormula = () => UnitFactory.getUnitOfMeasurementList().query({
      id: vm.UnitDetailFormulaModel.unitID,
      measurementTypeID: vm.UnitDetailFormulaModel.measurementTypeID
    }).$promise.then((response) => {
      if (response && response.data) {
        vm.toUnitList = response.data;
      }
      else {
        vm.toUnitList = [];
      }
      return vm.toUnitList;
    }).catch((error) => BaseService.getErrorLog(error));
    // [E] Method for Unit (Unit of measurement) list

    // [S] Method for Getting Unit of Measurement Detail
    const getUnitofMeasurementDetail = () => UnitFactory.retriveUnitOfMeasurementDetail().query({
      id: vm.UnitOfMeasurementModel.id
    }).$promise.then((response) => {
      if (response && response.data) {
        vm.UnitOfMeasurementModel = response.data; //&& vm.isSaved
        vm.UnitOfMeasurementModel.isBaseUnit = !response.data.baseUnitID; //&& vm.isSaved
        if (vm.UnitOfMeasurementModel.isFormula && vm.isSaved) {
          vm.isFormulaShow = true;
          vm.UnitDetailFormulaModel = {
            unitID: vm.UnitOfMeasurementModel ? vm.UnitOfMeasurementModel.id : null,
            measurementTypeID: vm.UnitOfMeasurementModel ? vm.UnitOfMeasurementModel.measurementTypeID : null
          };
          vm.unitName = vm.UnitOfMeasurementModel.unitName;

          getUnitOfMeasurementsFormula().then(() => {
            if (vm.toUnitList) {
              initAutoCompleteFormula();
            }
          });

          vm.pagingInfo.UnitID = vm.UnitOfMeasurementModel.id;
        } else {
          vm.isFormulaShow = false;
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));
    // [E] Method for Getting Unit of Measurement Detail

    //retrieve all alias of uoms
    function getComponentGenericAlias() {
      var data = {
        refId: vm.UnitOfMeasurementModel.id,
        refTableName: CORE.TABLE_NAME.UOM
      };
      return ComponentFactory.getComponentGenericAlias().query(data).$promise.then((res) => {
        if (res && res.data) {
          vm.UnitOfMeasurementModel.alias = _.clone(res.data);
          _.each(vm.UnitOfMeasurementModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.UnitOfMeasurementModel.unitName) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase() ? 1 : 2;
            }
          });
          return res.data;
        };
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // [S] Method for BaseUnit (Unit of measurement) list
    const getUnitOfMeasurements = (measurementTypeID) => UnitFactory.getUOMListByMeasurementID().query({
      measurementTypeID: measurementTypeID
    }).$promise.then((response) => {
      if (response && response.data) {
        vm.baseUnitList = response.data;
        if (vm.baseUnitList && vm.baseUnitList.length > 1 && data.listUOM && !data.isFormula) {
          const findValue = _.find(data.listUOM, (data) => data.baseunit === 'N/A (Not Applicable)');
          baseUnitValue = findValue ? findValue.id : null;
          vm.baseUnitName = _.find(vm.baseUnitList, (data) => data.id === baseUnitValue);
          vm.showUnitName = angular.copy(vm.baseUnitName);
          if (vm.showUnitName) {
            vm.showUnitName.copyUnitName = angular.copy(vm.showUnitName.unitName);
            vm.showUnitName.unitName = stringFormat('1 {0}', vm.showUnitName.unitName);
          }
        }
      }
      else {
        vm.baseUnitList = [];
      }
    }).catch((error) => BaseService.getErrorLog(error));
    // [E] Method for BaseUnit (Unit of measurement) list

    const initAutoComplete = () => {
      vm.autoCompleteBaseUnit = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: vm.UnitOfMeasurementModel && (vm.UnitOfMeasurementModel.baseUnitID || vm.UnitOfMeasurementModel.baseUnitID === 0) ? vm.UnitOfMeasurementModel.baseUnitID : baseUnitValue ? baseUnitValue : null,
        inputName: 'Base Unit',
        placeholderName: 'Base UOM',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUnitOfMeasurements,
        onSelectCallbackFn: getUnitOfMeasurements
      };
    };

    const initAutoCompleteFormula = () => {
      vm.autoCompleteToUnit = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: vm.UnitDetailFormulaModel.toUnitID ? vm.UnitDetailFormulaModel.toUnitID : null,
        inputName: 'To Unit',
        placeholderName: 'To Unit',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUnitOfMeasurementsFormula
      };
    };

    vm.pageInit = (data) => {
      const currentId = vm.UnitOfMeasurementModel ? vm.UnitOfMeasurementModel.id : null;
      const currentbaseUOM = vm.UnitOfMeasurementModel ? vm.UnitOfMeasurementModel.isBaseUnit : false;
      vm.UnitOfMeasurementModel = {
        id: data && data.id ? data.id : (null),
        isFormula: false,
        refTableName: vm.tables,
        alias: [],
        operator: vm.UOMOperator[0].id,
        unitName: data && data.unitName ? data.unitName : null,
        measurementTypeID: data && data.measurementTypeID ? data.measurementTypeID : typeId
      };
      autocompletePromise = [];
      if (vm.UnitOfMeasurementModel.id || vm.UnitOfMeasurementModel.id === 0) {
        autocompletePromise.push(getUnitofMeasurementDetail(), getUnitOfMeasurements(vm.UnitOfMeasurementModel.measurementTypeID), getComponentGenericAlias());
      } else {
        autocompletePromise.push(getUnitOfMeasurements(typeId));
      }
      vm.isSystemDefault = data && data.isSystemDefault ? data.isSystemDefault : 0;
      vm.isSaved = vm.isFormulaShow = data && data.isFormula ? data.isFormula : false;

      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        if (vm.listUOM.length === 0) {
          vm.UnitOfMeasurementModel.defaultUOM = true;
        } if (!data) {
          vm.UnitOfMeasurementModel.defaultUOM = false;
        }
        if (vm.UnitOfMeasurementModel.id) {
          vm.UnitOfMeasurementModel.alias = responses[2];
          _.each(vm.UnitOfMeasurementModel.alias, (item) => {
            if (item.mfgCodeList) {
              item.mfgCodeList = item.mfgCodeList ? item.mfgCodeList.split('#$#') : null;
            }
            if (vm.UnitOfMeasurementModel.unitName) {
              item.isDefaultAlias = item.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase();
              item.index = item.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase() ? 1 : 2;
            }
          });
        }
        if (vm.UnitOfMeasurementModel.defaultUOM) {
          vm.isSetDefaultUOM = true;
        }
        if (!vm.autoCompleteBaseUnit) {
          initAutoComplete();
        } else {
          vm.autoCompleteBaseUnit.keyColumnId = !data && currentbaseUOM ? currentId : data && data.id ? data.baseUnitID : vm.autoCompleteBaseUnit.keyColumnId;
          vm.checkDuplicateName(true);
        }
      });
      vm.name = vm.UnitOfMeasurementModel.unitName;
    };
    vm.pageInit(data);

    vm.headerdata.push({
      label: 'Measurement Type',
      value: vm.selectedType,
      displayOrder: 1,
      labelLinkFn: vm.goToUOMList
    });

    // save functionality managed by button category
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.ManageUOMForm.$setPristine();
        vm.ManageUOMForm.$setUntouched();
        vm.ManageUOMForm.$invalid = false;
        vm.ManageUOMForm.$valid = true;
        vm.pageInit(data);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.ManageUOMForm);
        if (isdirty) {
          const data = {
            form: vm.ManageUOMForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
              vm.ManageUOMForm.$setPristine();
              vm.ManageUOMForm.$setUntouched();
              vm.ManageUOMForm.$invalid = false;
              vm.ManageUOMForm.$valid = true;
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.ManageUOMForm.$setPristine();
          vm.ManageUOMForm.$setUntouched();
          vm.ManageUOMForm.$invalid = false;
          vm.ManageUOMForm.$valid = true;
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('unitName');
    };

    vm.saveUnitOfMeasurement = (buttonCategory) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.ManageUOMForm)) {
        vm.saveBtnDisableFlag = false;
        if (vm.UnitOfMeasurementModel.id && !vm.checkFormDirty(vm.ManageUOMForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      if (vm.ManageUOMForm.$invalid) {
        BaseService.focusRequiredField(vm.ManageUOMForm);
        vm.saveBtnDisableFlag = false;
        return;
      }
      //check alias unit name added or not
      const alias = _.find(vm.UnitOfMeasurementModel.alias, (als) => als.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase());
      if (!alias) {
        const newalias = {
          alias: vm.UnitOfMeasurementModel.unitName,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.UnitOfMeasurementModel.alias.push(newalias);
        vm.checkDirty = true;
      }
      const aliasAbbrevation = _.find(vm.UnitOfMeasurementModel.alias, (als) => als.alias.toLowerCase() === vm.UnitOfMeasurementModel.abbreviation.toLowerCase());
      if (!aliasAbbrevation) {
        const newalias = {
          alias: vm.UnitOfMeasurementModel.abbreviation,
          createdAt: new Date(),
          fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        };
        vm.UnitOfMeasurementModel.alias.push(newalias);
        vm.checkDirty = true;
      }
      if (vm.alias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_NOT_ADDED_CONFRIMATION);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            saveUnitMeaserment(buttonCategory);
          }
        }, () => {
          vm.saveBtnDisableFlag = false;
        });
      }
      else {
        saveUnitMeaserment(buttonCategory);
      }
    };
    // save unit of measerment
    const saveUnitMeaserment = (buttonCategory) => {
      const unitOfMeasurement = angular.copy(vm.UnitOfMeasurementModel);
      unitOfMeasurement.isDefault = false;
      unitOfMeasurement.isSystemDefault = vm.isSystemDefault;
      unitOfMeasurement.perUnit = 1;
      unitOfMeasurement.baseUnitID = vm.autoCompleteBaseUnit.keyColumnId;
      unitOfMeasurement.measurementTypeID = vm.UnitOfMeasurementModel.id || vm.UnitOfMeasurementModel.id === 0 ? vm.UnitOfMeasurementModel.measurementTypeID : typeId;
      unitOfMeasurement.alias = vm.UnitOfMeasurementModel.alias;
      unitOfMeasurement.refTableName = CORE.TABLE_NAME.UOM;
      unitOfMeasurement.isBaseUnit = vm.UnitOfMeasurementModel.isBaseUnit;
      unitOfMeasurement.baseUnitConvertValue = vm.UnitOfMeasurementModel.operator === vm.UOMOperator[1].id ? ((1 * vm.UnitOfMeasurementModel.orgBaseUnitValue * 10) / 10) : ((1 * 10) / (vm.UnitOfMeasurementModel.orgBaseUnitValue * 10));
      vm.UnitOfMeasurementModel.operator = vm.UnitOfMeasurementModel.isBaseUnit ? vm.UOMOperator[1].id : vm.UnitOfMeasurementModel.operator;
      vm.cgBusyLoading = UnitFactory.saveUnitOfMeasurementDetail().save(unitOfMeasurement).$promise.then((response) => {
        if (response && response.data && response.data.isFormula) {
          vm.isSaved = true;
          vm.disableOnFormula = true;
          if (response && response.data && response.data.id) {
            vm.UnitOfMeasurementModel.id = response.data.id;
            autocompletePromise = [];
            autocompletePromise.push(getUnitofMeasurementDetail(), getComponentGenericAlias());
            vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
              initAutoComplete();
              vm.UnitOfMeasurementModel.alias = responses[1];
              vm.ManageUOMForm.$setPristine();
              vm.ManageUOMForm.$setUntouched();
              vm.ManageUOMForm.$invalid = false;
              vm.ManageUOMForm.$valid = true;
            });
          }
        } else if (response && response.data && !response.data.isFormula) {
          response.data.baseUnitID = vm.UnitOfMeasurementModel.isBaseUnit ? 0 : response.data.baseUnitID;
          vm.saveAndProceed(buttonCategory, response.data);
          getComponentGenericAlias();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Get Unit of Measurement data for grid bind */
    vm.loadData = () => {
      if (lastUnitId) {
        vm.pagingInfo.UnitID = lastUnitId;
      }
      if (vm.isSaved) {
        vm.cgBusyLoading = UnitFactory.retriveUnitDetailFormula(vm.pagingInfo).query().$promise.then((unitDetailFormula) => {
          _.each(unitDetailFormula.data.UnitDetailFormula, (data) => {
            data.currentValue = eval(data.currentValue);
          });

          vm.sourceData = unitDetailFormula.data.UnitDetailFormula;
          vm.totalSourceDataCount = unitDetailFormula.data.Count;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //Get data down
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.SearchColumns.push(searchColumn);
      vm.cgBusyLoading = UnitFactory.retriveUnitDetailFormula(vm.pagingInfo).query().$promise.then((unitDetailFormula) => {
        vm.sourceData = unitDetailFormula.data.UnitDetailFormula;
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Update Unit of Measurement Formula */
    vm.updateRecord = (row) => UnitFactory.retriveUnitDetailFormulaDetail().query({
      id: row.entity.id
    }).$promise.then((response) => {
      if (response && response.data) {
        vm.UnitDetailFormulaModel = response.data;
        vm.autoCompleteToUnit.keyColumnId = vm.UnitDetailFormulaModel.toUnitID;
      }
      else {
        vm.baseUnitList = [];
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /* Update Unit of Measurement Formula */
    vm.saveUnitDetailFormula = () => {
      if (BaseService.focusRequiredField(vm.ManageUDFForm)) {
        return;
      }
      const unitDetailFormula = vm.UnitDetailFormulaModel;
      unitDetailFormula.toUnitID = vm.autoCompleteToUnit.keyColumnId;

      const formula = vm.UnitDetailFormulaModel.formula.replace(/X/g, 1);

      try {
        eval(formula);
      } catch (e) {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_FORMULA);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      vm.cgBusyLoading = UnitFactory.saveUnitDetailFormula().save(unitDetailFormula).$promise.then((response) => {
        if (response && response.data) {
          lastUnitId = vm.pagingInfo.UnitID;
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          vm.UnitDetailFormulaModel.formula = '';
          vm.autoCompleteToUnit.keyColumnId = null;
          vm.UnitDetailFormulaModel.id = null;
          vm.ManageUDFForm.$setPristine();
          vm.ManageUDFForm.$setUntouched();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* delete Unit of Measurement Formula */
    vm.deleteRecord = (unitDetailFormula) => {
      let selectedIDs = [];
      if (unitDetailFormula) {
        selectedIDs.push(unitDetailFormula.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((measurementTypesItem) => measurementTypesItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Unit Formula', selectedIDs.length);

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = UnitFactory.deleteUnitDetailMeasurement().save({
              ids: selectedIDs
            }).$promise.then((data) => {
              if (data.data && data.data.TotalCount > 0) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE);

                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
              }
              else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Unit Formula');
        const model = {
          messageContent: messageContent,
          multiple: true
        };

        DialogFactory.messageAlertDialog(model);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.equationTypeChange = () => {
      if (vm.UnitOfMeasurementModel.isFormula && vm.checkFormDirty(vm.ManageUOMForm)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECV_UOM_DETAIL_REMOVE_CONFIRMATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            uomTypeChangeDetails();
          }
        }, () => {
          vm.UnitOfMeasurementModel.isFormula = !vm.UnitOfMeasurementModel.isFormula;
          // empty
        });
      } else {
        uomTypeChangeDetails();
      }
      //initAutoComplete();
    };

    // call for UOM update details
    const uomTypeChangeDetails = () => {
      if (vm.UnitOfMeasurementModel.isFormula) {
        vm.autoCompleteBaseUnit.keyColumnId = null;
      } else {
        if (vm.baseUnitList && vm.baseUnitList.length > 1 && data.listUOM) {
          const findValue = _.find(data.listUOM, (data) => data.baseunit === 'N/A (Not Applicable)');
          baseUnitValue = findValue ? findValue.id : null;
          vm.autoCompleteBaseUnit.keyColumnId = baseUnitValue;
        }
        vm.autoCompleteBaseUnit.keyColumnId = vm.UnitOfMeasurementModel && (vm.UnitOfMeasurementModel.baseUnitID || vm.UnitOfMeasurementModel.baseUnitID === 0) ? vm.UnitOfMeasurementModel.baseUnitID : baseUnitValue ? baseUnitValue : null;
        vm.baseUnitName = _.find(vm.baseUnitList, (data) => data.id === vm.autoCompleteBaseUnit.keyColumnId);
      }
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.ManageUOMForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.goToUnitList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Function call on uom blur event and check code exist or not
    vm.checkDuplicateName = (isName) => {
      vm.isduplicate = false;
      const uomName = isName ? vm.UnitOfMeasurementModel.unitName : vm.UnitOfMeasurementModel.abbreviation;
      if (uomName && vm.name !== uomName) {
        vm.cgBusyLoading = UnitFactory.checkDuplicateUOM().save({
          id: vm.UnitOfMeasurementModel.id ? vm.UnitOfMeasurementModel.id : null,
          name: uomName,
          refTableName: CORE.TABLE_NAME.UOM
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, uomName);
            const uniqueObj = {
              messageContent: messageContent,
              controlName: isName ? 'unitName' : 'abbreviation'
            };
            if (isName) {
              vm.UnitOfMeasurementModel.unitName = null;
            } else {
              vm.UnitOfMeasurementModel.abbreviation = null;
            }
            displayCodeAliasUniqueMessage(uniqueObj);
          } else if (!vm.showUnitName || (vm.showUnitName && !vm.showUnitName.copyUnitName)) {
            vm.showUnitName = { copyUnitName: vm.UnitOfMeasurementModel.unitName };
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (vm.UnitOfMeasurementModel.baseUnitID === 0) {
        vm.showUnitName = { copyUnitName: vm.UnitOfMeasurementModel.unitName };
      }
    };
    /* unit name unique message */
    const displayCodeAliasUniqueMessage = (uniqueObj) => {
      const obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        if (uniqueObj.controlName) {
          setFocusByName(uniqueObj.controlName);
        }
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }, () => {
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //add alias for uom
    vm.updateAliasList = ($event, alias) => {
      if (vm.ManageUOMForm.uomalias.$invalid) {
        return;
      }
      if (!vm.alias) {
        return;
      }
      const aliasObj = _.find(vm.UnitOfMeasurementModel.alias, (item) => item.alias.toLowerCase() === alias.toLowerCase());
      if (aliasObj) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, vm.UnitOfMeasurementModel.unitName);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        vm.ManageUOMForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = UnitFactory.checkUniqueUOMAlias().save({
          alias: vm.alias,
          id: vm.UnitOfMeasurementModel.id,
          refTableName: CORE.TABLE_NAME.UOM

        }).$promise.then((response) => {
          if (response && response.data && (response.data.uomAliasExistsInfo || response.data.uomExistInfo)) {
            if (response.data.uomAliasExistsInfo) {
              const aliasobj = _.find(vm.UnitOfMeasurementModel.alias, (alias) => alias.alias.toLowerCase() === response.data.uomAliasExistsInfo.alias.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.UnitOfMeasurementModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.uomAliasExistsInfo);
              }
            }
            else if (response.data.uomExistInfo) {
              const aliasobj = _.find(vm.UnitOfMeasurementModel.alias, (alias) => alias.alias.toLowerCase() === response.data.uomExistInfo.name.toLowerCase());
              if (aliasobj) {
                if (vm.alias) {
                  vm.UnitOfMeasurementModel.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_TYPE_EXISTS);
                messageContent.message = stringFormat(messageContent, vm.alias, vm.searchType, response.data.uomExistInfo.name);
                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true,
                  controlName: vm.aliasFieldName
                };
                displayCodeAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.UnitOfMeasurementModel.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                fullName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
            setFocusByName(vm.aliasFieldName);
          }
          vm.isupdated = true;
          vm.ManageUOMForm.$setDirty();
        });
      }
    };
    // check validation for alias
    function checkValidateAliasDetails(uomalias) {
      if (uomalias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, vm.searchType, uomalias.unitName);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true,
          controlName: vm.aliasFieldName
        };
        displayCodeAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }

    //update detais
    vm.selectedPart = (data) => {
      vm.UnitOfMeasurementModel.id = data.id;
      let promises = [getUnitofMeasurementDetail(), getComponentGenericAlias()];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        vm.UnitOfMeasurementModel.alias = responses[1];
        _.each(vm.UnitOfMeasurementModel.alias, (item) => {
          item.isDefaultAlias = item.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase();
          item.index = item.alias.toLowerCase() === vm.UnitOfMeasurementModel.unitName.toLowerCase() ? 1 : 2;
        });
        promises = [getUnitOfMeasurements(vm.UnitOfMeasurementModel.measurementTypeID)];
        vm.cgBusyLoading = $q.all(promises).then(() => {
          vm.autoCompleteBaseUnit.keyColumnId = vm.UnitOfMeasurementModel.baseUnitID;
        });
      });
    };
    /* set selected alias as default one and set it as uom */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'UOM');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.UnitOfMeasurementModel.unitName = aliasItem.alias;
            const defaultAlias = _.find(vm.UnitOfMeasurementModel.alias, (dAlias) => dAlias.isDefaultAlias);
            if (defaultAlias) {
              defaultAlias.isDefaultAlias = false;
              defaultAlias.index = 2;
            }
            aliasItem.isDefaultAlias = true;
            aliasItem.index = 1;
            vm.ManageUOMForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    //remove alias
    vm.removeAliasFromList = (item) => {
      const objIndex = vm.UnitOfMeasurementModel.alias.indexOf(item);
      vm.UnitOfMeasurementModel.alias.splice(objIndex, 1);
      vm.checkDirty = true;
      vm.ManageUOMForm.$$controls[0].$setDirty();
    };
    //get actual conversion value for units
    vm.getActualConversionValue = () => {
      if (vm.UnitOfMeasurementModel.operator && vm.UnitOfMeasurementModel.orgBaseUnitValue) {
        return parseFloat((vm.UnitOfMeasurementModel.operator === vm.UOMOperator[0].id ? ((1 * vm.UnitOfMeasurementModel.orgBaseUnitValue * 10) / 10) : ((1 * 10) / (10 * vm.UnitOfMeasurementModel.orgBaseUnitValue))).toFixed(9));
      }
    };
  }
})();

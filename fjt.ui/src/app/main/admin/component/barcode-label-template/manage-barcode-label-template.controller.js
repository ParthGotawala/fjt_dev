/* eslint-disable no-useless-escape */
(function () {
  'use strict';

  angular
    .module('app.admin.barcode-label-template')
    .controller('ManageBarcodeLabelTemplateController', ManageBarcodeLabelTemplateController);

  /** @ngInject */
  function ManageBarcodeLabelTemplateController($state, $q, $stateParams, $timeout, USER, CORE, TRANSACTION, BaseService, GenericCategoryFactory, DialogFactory, BarcodeLabelTemplateFactory, $scope, $filter, ManageMFGCodePopupFactory, $mdDialog) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BarcodeTypeList = USER.BARCODE;
    vm.BarcodeCategoryList = USER.BarcodeCategory;
    vm.isSubmit = false;
    vm.isEdit = false;
    vm.BarcodeTemplateModel = {};
    vm.taToolbar = CORE.Toolbar;
    vm.sourceData = [];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BARCODE_LABEL_TEMPLATE;
    vm.WoStatus = _.filter(CORE.WoStatus, (item) => item.ID === 0 || item.ID === 1);
    vm.dataTypeList = CORE.BARCODE_DELIMITER_DATATYPE;
    vm.entityID = CORE.AllEntityIDS.Component.ID;
    vm.fieldType = CORE.BARCODE_DELIMITER_FIELDTYPE;
    vm.barcodeDelimiterColor = CORE.BARCODE_DELIMITER_COLOR;
    vm.dataelementList = [];
    vm.delimiterData = [];
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isLoad = false;
    vm.pageLoad = false;
    vm.isChanged = false;
    vm.isHeaderChanged = false;
    let selectedMFG;
    vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
    vm.mfgTypeMfg = CORE.MFG_TYPE.MFG;
    vm.mfgLength = CORE.MFG_TYPE_LENGTH.MFG;
    vm.distLength = CORE.MFG_TYPE_LENGTH.DIST;
    let selectedRowIndex;
    let statusOfPublish;
    vm.saveBtnFlag = false;
    const barcodeLabelTemplete = {
      name: null,
      prefixlength: null,
      suffixlength: null,
      tempregexp: null,
      wildcardformat: null,
      Samplereaddata: null,
      description: null,
      status: null
    };
    vm.checkFormDirty = (form, columnName) => {
      vm.checkDirty = BaseService.checkFormDirty(form, columnName);
      if (vm.isChanged || vm.checkDirty) {
        vm.checkDirty = true;
      }
      return vm.checkDirty;
    };

    function getTemplateDataIdWise(Id) {
      if ($stateParams.id || Id || vm.id) {
        let id;
        id = $stateParams.id ? $stateParams.id : Id;
        id = id ? id : vm.id;
        BarcodeLabelTemplateFactory.barcode_label_template().query({ id: id }).$promise.then((response) => {
          vm.isEdit = true;
          vm.isLoad = true;
          vm.BarcodeTemplateModelCopy = angular.copy(response.data);

          statusOfPublish = { ID: response.data.status };
          let index = 0;
          if (response.data) {
            response.data.barcodeDelimiter = _.orderBy(response.data.barcodeDelimiter, 'displayOrder', ['asc']);
            // vm.delimiterData = [];
            _.each(response.data.barcodeDelimiter, (item) => {
              // find particular data element is manual field or dynamic field.
              const dynamicData = _.find(vm.dataelementList, { dataElementID: item.dataElementId });
              const manualData = _.find(vm.dataelementList, { id: item.dataElementId });
              const dynamicName = dynamicData ? dynamicData.dataElementName : null;
              const manualName = manualData ? manualData.dataElementName : null;
              // find particular data type from data type list
              const dataType = _.find(vm.dataTypeList, (itemData) => itemData.ID === item.dataTypeID);
              const obj = {
                index: index,
                id: item.id,
                delimiter: item.delimiter,
                // length: item.length,
                notes: item.notes,
                dataElementName: dynamicName ? dynamicName : manualName,
                dataTypeName: dataType ? dataType.dataTypeName : null,
                displayOrder: item.displayOrder,
                colorCode: vm.barcodeDelimiterColor[index],
                isValid: true
              };
              index = index + 1;
              vm.delimiterData.push(obj);
            });
            vm.checkDirtyObject = {
              oldModelName: vm.BarcodeTemplateModelCopy,
              newModelName: vm.BarcodeTemplateModel
            };
            vm.BarcodeTemplateModel = angular.copy(response.data);
            vm.BarcodeTemplateModel.Sampledata = vm.BarcodeTemplateModel.Samplereaddata;
            vm.gridOptions.gridApi.grid.options.hideAddNew = vm.BarcodeTemplateModel && vm.BarcodeTemplateModel.status === vm.WoStatus[0].ID ? false : true;
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            getMfgSearch({ mfgcodeID: vm.BarcodeTemplateModel.mfgcodeid });
            initAutoComplete();
            vm.pageLoad = true;
            if (vm.BarcodeTemplateModel && vm.BarcodeTemplateModel.mfgcodeid) {
              getMfgSearch({ mfgcodeID: vm.BarcodeTemplateModel.mfgcodeid });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        clearList();
      }
    }

    vm.getTemplateStatus = (statusID) => BaseService.getWoStatus(statusID);
    // On change workorder status
    vm.changeTemplateStatus = (status) => {
      if (!vm.AddBarcodeLabelTemapleteForm.$valid && status && status.ID === 1) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.PUBLISH_BARCODE_WITH_INVALID_FORM);
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(obj).then((yes) => {
          if (yes) {
            vm.BarcodeTemplateModel.status = 0;
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        statusOfPublish = status;
        // vm.BarcodeTemplateModel.status = status.ID;
        vm.SaveBarcodeTemplate(true);
      }

      // vm.isHeaderChanged = true;
    };

    function clearList() {
      vm.BarcodeTemplateModel = Object.assign({}, barcodeLabelTemplete);
    }

    // highlight delimiters in scan label
    vm.highlight = (ScanString, deletedDelimiterList, rowData) => {
      if (ScanString) {
        vm.text = ScanString ? ScanString : vm.BarcodeTemplateModel.Samplereaddata;
        let replacedStr;
        let allDelimiter;
        let str = '';
        const deleteDelimieters = [];
        // get values with separator split
        const splitString = ScanString.split(vm.BarcodeTemplateModel.selectedSeparator);

        if (vm.pageLoad) {
          allDelimiter = vm.delimiterData;
          vm.pageLoad = false;
        } else {
          allDelimiter = vm.sourceData;
        }
        // when row deleted ,get deleted delimiters.
        if (deletedDelimiterList && deletedDelimiterList.length > 0) {
          allDelimiter = _.difference(allDelimiter, deletedDelimiterList);
        } else {
          deleteDelimieters.push(deletedDelimiterList);
          allDelimiter = _.difference(allDelimiter, deleteDelimieters);
        }
        _.each(allDelimiter, (a) => {
          let tempData;
          _.find(splitString, (s) => {
            if (a.delimiter === TRANSACTION.BarcodeFixDelimeter.NONE || a.delimiter === TRANSACTION.BarcodeFixDelimeter.BLANK) {
              tempData = {
                index: a.index,
                delimiterData: s
              };
            } else {
              if (a.delimiter && s.toUpperCase().startsWith(a.delimiter.toUpperCase())) {
                tempData = {
                  index: a.index,
                  delimiterData: s
                };
              }
            }
            return tempData;
          });
          if (tempData) {
            if (rowData && rowData.length > 0) {
              _.each(rowData, (r) => {
                if (tempData.index === r.index) {
                  r.colorCode = vm.barcodeDelimiterColor[tempData.index];
                }
              });
            } else if (rowData && tempData.index === rowData.index) {
              rowData.colorCode = vm.barcodeDelimiterColor[tempData.index];
            }
            replacedStr = '<span style="background-color:' + vm.barcodeDelimiterColor[tempData.index] + '">' + tempData.delimiterData + '</span>';
            str = vm.text.replace(tempData.delimiterData, replacedStr);
            if (str && str.length > 0) {
              vm.text = str;
            }
          } else if (vm.autoCompleteBarcodeType && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id && (selectedRowIndex || selectedRowIndex === 0) && vm.sourceData[selectedRowIndex] && vm.sourceData[selectedRowIndex].dataElementName === CORE.LabelConstant.MFG.MFGPN && a.index === selectedRowIndex && vm.sourceData[selectedRowIndex].delimiter) {
            if (vm.sourceData[selectedRowIndex].delimiter !== TRANSACTION.BarcodeFixDelimeter.NONE) {
              $timeout(() => {
                vm.sourceData[selectedRowIndex].delimiter = '';
                vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[selectedRowIndex], vm.sourceHeader[2]);
              }, _configTimeout);
            }
          } else if (rowData && vm.autoCompleteBarcodeType && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id && a.index === selectedRowIndex && vm.sourceData[selectedRowIndex].delimiter) {
            rowData.colorCode = vm.barcodeDelimiterColor[selectedRowIndex];
            replacedStr = '<span style="background-color:' + vm.barcodeDelimiterColor[selectedRowIndex] + '">' + vm.sourceData[selectedRowIndex].delimiter + '</span>';
            str = vm.text.replace(vm.sourceData[selectedRowIndex].delimiter, replacedStr);
            if (str && str.length > 0) {
              vm.text = str;
            }
          }
          else if (vm.autoCompleteBarcodeType && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[1].Id && ((selectedRowIndex || selectedRowIndex === 0) && a.index === selectedRowIndex && vm.sourceData[selectedRowIndex].delimiter)) {
            $timeout(() => {
              vm.sourceData[selectedRowIndex].delimiter = '';
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[selectedRowIndex], vm.sourceHeader[2]);
            }, _configTimeout);
          }
        });
        return vm.text;
      } else {
        return vm.text = null;
      }
    };

    function getMfgSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        vm.mfgCodeDetail = mfgcodes.data;
        if (searchObj.mfgcodeID) {
          vm.BarcodeTemplateModel.mfgcodeid = mfgcodes.data[0] ? mfgcodes.data[0].id : '';
          selectedMFG = mfgcodes.data[0];
          $timeout(() => {
            if (vm.autoCompletemfgCode.inputName) {
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMFG);
            }
          }, true);
        }
        return mfgcodes.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getComponentMfg = (item) => {
      if (item) {
        vm.BarcodeTemplateModel.mfgcodeID = item.id;
      }
      else {
        vm.BarcodeTemplateModel.mfgcodeID = null;
      }
    };

    const getGenericCategoryList = () => {
      const listObj = {
        GencCategoryType: [CategoryTypeObjList.BarcodeSeparator.Name],
        isActive: $stateParams.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        vm.separatorList = genericCategories.data;
        _.each(genericCategories.data, (item) => {
          if (item.gencCategoryCode) {
            item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
          }
          else {
            item.gencCategoryDisplayName = item.gencCategoryName;
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };



    const getGenericCategory = (item) => {
      if (item) {
        const selectedSeparator = _.find(vm.separatorList, (p) => p.gencCategoryID === item.gencCategoryID);
        vm.BarcodeTemplateModel.selectedSeparator = selectedSeparator ? selectedSeparator.gencCategoryName : '';
        vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, null, null);
      }
      else {
        vm.BarcodeTemplateModel.selectedPartStatus = null;
      }
    };
    // initialize MFG Code autocomplete
    const initAutoComplete = () => {
      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.BarcodeTemplateModel && vm.BarcodeTemplateModel.mfgcodeid ? vm.BarcodeTemplateModel.mfgcodeid : null,
        inputName: 'MFG',
        placeholderName: CORE.LabelConstant.MFG.MFG + '/Supplier',
        isRequired: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        maxLength: CORE.MFG_TYPE_LENGTH.MFG,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: getComponentMfg,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName
          };
          return getMfgSearch(searchObj);
        }
      },
        vm.autoCompleteSeparator = {
          columnName: 'gencCategoryDisplayName',
          controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          keyColumnName: 'gencCategoryID',
          keyColumnId: vm.BarcodeTemplateModel ? vm.BarcodeTemplateModel.separator : null,
          inputName: CategoryTypeObjList.BarcodeSeparator.Name,
          placeholderName: CategoryTypeObjList.BarcodeSeparator.Title,
          addData: { headerTitle: CategoryTypeObjList.BarcodeSeparator.Title },
          isRequired: true,
          isAddnew: true,
          callbackFn: getGenericCategoryList,
          onSelectCallbackFn: getGenericCategory
        },
        vm.autoCompleteBarcodeType = {
          columnName: 'Value',
          keyColumnName: 'Id',
          keyColumnId: vm.BarcodeTemplateModel ? vm.BarcodeTemplateModel.barcodeType : null,
          inputName: 'Barcode Type',
          placeholderName: 'Barcode Type',
          isRequired: true,
          isAddnew: false,
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.gridOptions.gridApi.grid.options.disableAddNew = item.Id === vm.BarcodeTypeList[0].Id  && vm.sourceData.length !== 0 ? true : false;
            }
          }
        };
      vm.autoCompleteBarcodeCategory = {
        columnName: 'value',
        keyColumnName: 'key',
        keyColumnId: vm.BarcodeTemplateModel ? vm.BarcodeTemplateModel.barcodeCategory : null,
        inputName: 'Category',
        placeholderName: 'Category',
        isRequired: true,
        isAddnew: false
      };
    };
    // get component data element list
    function getDataElementList() {
      return BarcodeLabelTemplateFactory.getDataElementFields().query().$promise.then((res) => {
        let combinedArray = [];
        if (res.data && res.data.dynamicData) {
          res.data.dynamicData = _.filter(res.data.dynamicData, (o) => o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1]);
          combinedArray = res.data.dynamicData;
        }
        if (res.data && res.data.manualData) {
          _.each(res.data.manualData, (item) => {
            item.dataElementName = item.displayName;
            combinedArray.push(item);
          });
        }
        return vm.dataelementList = combinedArray;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const initPromise = [getDataElementList(), getGenericCategoryList()];
    vm.cgBusyLoading = $q.all(initPromise).then(() => {
      grid();
      if ($stateParams.id || vm.id) {
        let id;
        id = $stateParams.id ? $stateParams.id : Id;
        id = id ? id : vm.id;
        getTemplateDataIdWise(id);
      } else {
        getMfgSearch({ mfgcodeID: -7 });
        initAutoComplete();
      }
    }).catch((error) => BaseService.getErrorLog(error));
    /* ------------------start grid----------------*/
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[8].PageName
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: true,
      enablePaging: false,
      CurrentPage: CORE.PAGENAME_CONSTANT[8].PageName,
      hideAddNew: $stateParams.id || vm.id ? vm.BarcodeTemplateModel && vm.BarcodeTemplateModel.status === vm.WoStatus[0].ID ? false : true : false,
      disableAddNew: true
    };

    // load data detail
    vm.loadData = () => {
      const unsavePart = _.find(vm.sourceData, (item) => item.id === 0);
      const list = angular.copy(vm.sourceData);
      if (((vm.pagingInfo.SortColumns.length > 0 || vm.pagingInfo.SearchColumns.length > 0) && (unsavePart || vm.sourceData.length === 0)) || vm.AddBarcodeLabelTemapleteForm.$$controls[0].$dirty) {
        vm.search = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            getData();
          }
        }, () => {
          vm.sourceData = list;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        if (vm.search) {
          vm.search = false;
        }
        else {
          getData();
        }
      }
    };

    function getData() {
      vm.sourceData = [];
      if (!vm.isEdit) {
        const obj = {
          index: 0,
          id: 0,
          delimiter: null,
          // length: null,
          displayOrder: null,
          notes: null,
          isValid: false,
          dataElementName: null,
          dataTypeName: null
        };
        vm.sourceData.push(obj);
      } else if (vm.isEdit && vm.delimiterData && vm.delimiterData.length > 0) {
        vm.sourceData = angular.copy(vm.delimiterData);
        _.each(vm.sourceData, (sys) => {
          sys.systemGenerated = vm.BarcodeTemplateModel.status === vm.WoStatus[1].ID ? true : false;
        });
      } else if (vm.isEdit && vm.delimiterData && vm.delimiterData.length === 0) {
        const obj = {
          index: 0,
          id: 0,
          delimiter: null,
          // length: null,
          notes: null,
          dataElementName: null,
          dataTypeName: null
        };
        vm.sourceData.push(obj);
      }

      if (vm.pagingInfo.SortColumns.length > 0) {
        const column = [];
        const sortBy = [];
        _.each(vm.pagingInfo.SortColumns, (item) => {
          column.push(item[0]);
          sortBy.push(item[1]);
        });
        vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
      }
      if (vm.pagingInfo.SearchColumns.length > 0) {
        if (!vm.search) {
          vm.sourceDataCopy = angular.copy(vm.sourceData);
        }
        vm.search = true;
        _.each(vm.pagingInfo.SearchColumns, (item) => {
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
      vm.currentdata = vm.totalSourceDataCount;
      if (vm.BarcodeTemplateModel && vm.BarcodeTemplateModel.Samplereaddata) {
        vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, null, vm.sourceData);
      }
      $timeout(() => {
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.resetSourceGrid();
          $timeout(() => {
            if ($stateParams.id) {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[2]);
            } else {
              if (vm.sourceData.length === 1 && !vm.sourceData[0].dataElementName) {
                vm.sourceData[0].dataElementName = CORE.LabelConstant.MFG.MFGPN;
                vm.sourceData[0].dataTypeName = 'Alphanumeric';
              }
            }
            vm.gridOptions.gridApi.grid.options.disableAddNew = vm.BarcodeTemplateModel.barcodeCategory && vm.BarcodeTemplateModel.barcodeCategory === vm.BarcodeCategoryList[1].key && vm.BarcodeTemplateModel.barcodeType === vm.BarcodeTypeList[0].Id && vm.sourceData.length !== 0 ? true : (!vm.BarcodeTemplateModel.barcodeCategory && vm.sourceData.length !== 0 ? true : false);
          }, _configTimeout);
          cellEdit();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
        }
      });
    }
    function cellEdit() {
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        selectedRowIndex = rowEntity.index;
        if (newvalue !== oldvalue) {
          vm.isChanged = true;
          if (vm.isChanged) {
            vm.AddBarcodeLabelTemapleteForm.$$controls[0].$setDirty();
          }
        }

        if (colDef.field === 'delimiter' && vm.BarcodeTemplateModel.Samplereaddata) {
          rowEntity.delimiter = rowEntity.delimiter ? rowEntity.delimiter.toUpperCase() : null;
          if (rowEntity.delimiter) {
            //let string = '';
            // check for delimiter is available in scan label.
            let searchString = null;
            let splitString = vm.BarcodeTemplateModel.Samplereaddata.split(vm.BarcodeTemplateModel.selectedSeparator);
            if (vm.BarcodeTemplateModel.suffixlength === 0) {
              splitString = _.remove(splitString, (item, index) => {
                if (index !== (splitString.length - 1)) {
                  return item;
                }
              });
            }
            if (rowEntity.delimiter.toUpperCase() === TRANSACTION.BarcodeFixDelimeter.BLANK) {
              searchString = TRANSACTION.BarcodeFixDelimeter.BLANK;
            } else {
              searchString = _.find(splitString, (f) => {
                f = f.toUpperCase();
                if (f.startsWith(rowEntity.delimiter)) {
                  return true;
                }
              });
            }
            let duplicateDelimiter = null;
            if (rowEntity.delimiter && (rowEntity.delimiter.toUpperCase() !== TRANSACTION.BarcodeFixDelimeter.BLANK)) {
              // check for duplicate delimiter.
              duplicateDelimiter = _.find(vm.sourceData, (d) => {
                if (d.delimiter && d.delimiter.startsWith(rowEntity.delimiter) && rowEntity.index !== d.index) {
                  return true;
                }
                // return d.delimiter == rowEntity.delimiter && rowEntity.index != d.index
              });
            }
            if ((!searchString || duplicateDelimiter) && (vm.autoCompleteBarcodeType && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[1].Id)) {
              rowEntity.delimiter = null;
              const objBarcode = _.find(vm.sourceData, (item) => item.index === rowEntity.index);
              let index;
              if (objBarcode) {
                index = vm.sourceData.indexOf(objBarcode);
              }
              rowEntity.isValid = 'No';
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[index ? index : 0], vm.sourceHeader[2]);
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[index ? index : 0], vm.sourceHeader[2]);
            } else {
              rowEntity.isValid = true;
            }
          } else if (rowEntity.delimiter === null) {
            rowEntity.isValid = 'No';
          }
          vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, null, rowEntity);
        }
        if (rowEntity.dataElementName) {
          // check for duplicate data element.
          const duplicateDataElement = _.find(vm.sourceData, (d) => d.dataElementName === rowEntity.dataElementName && d.dataElementName !== 'Ignore' && rowEntity.index !== d.index);
          if (duplicateDataElement) {
            rowEntity.dataElementName = null;
            const objBarcode = _.find(vm.sourceData, (item) => item.index === rowEntity.index);
            let index;
            if (objBarcode) {
              index = vm.sourceData.indexOf(objBarcode);
            }
            vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[index ? index : 0], vm.sourceHeader[3]);
            vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[index ? index : 0], vm.sourceHeader[3]);
          }
        }
        if (rowEntity.displayOrder && rowEntity.displayOrder < 0) {
          rowEntity.displayOrder = 0;
        }
      });
    }
    vm.isHideDelete = true;
    function grid() {
      vm.getDataDown = () => { };
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '100',
          cellTemplate: '<md-button ng-show="(grid.appScope.$parent.vm.BarcodeTemplateModel.status == grid.appScope.$parent.vm.WoStatus[1].ID || (grid.appScope.$parent.vm.autoCompleteBarcodeType.keyColumnId === grid.appScope.$parent.vm.BarcodeTypeList[0].Id) ||( !row.entity.delimiter && !row.entity.dataElementName && !row.entity.dataTypeName && !row.entity.displayOrder && !row.entity.notes &&  grid.appScope.$parent.vm.sourceData.length==1))" style="cursor: not-allowed;opacity: 0.75;"  class="md-primary grid-button md-icon-button bdrbtn">' +
            '<md-icon role="img" md-font-icon="icon-trash"></md-icon><md-tooltip md-direction="top">Delete</md-tooltip>' +
            '</md-button>\
            <md-button ng-show="(grid.appScope.$parent.vm.BarcodeTemplateModel.status != grid.appScope.$parent.vm.WoStatus[1].ID && grid.appScope.$parent.vm.autoCompleteBarcodeType.keyColumnId !== grid.appScope.$parent.vm.BarcodeTypeList[0].Id && ( row.entity.delimiter || row.entity.dataElementName || row.entity.dataTypeName || row.entity.displayOrder || row.entity.notes || grid.appScope.$parent.vm.sourceData.length>1))"   class="md-primary grid-button md-icon-button bdrbtn" ng-click="grid.appScope.$parent.vm.deleteRecord(row.entity)">' +
            '<md-icon role="img" md-font-icon="icon-trash"></md-icon><md-tooltip md-direction="top">Delete</md-tooltip>' +
            '</md-button>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          maxWidth: '150',
          allowCellFocus: false
        },
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-disabled="row.Entity.isdisable"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false,
          maxWidth: '60',
          allowCellFocus: false

        },
        {
          field: 'delimiter',
          displayName: 'Field Identifier',
          cellTemplate: '<div ng-if="row.entity.id !=0 && row.entity.delimiter != null"class="ui-grid-cell-contents" ng-class="{\'invaliddelimeter\': (row.entity.isValid  == \'No\' && !row.entity.delimiter)}">' +
            '<span class="label-box" ng-if="row.entity.id !=0 && row.entity.delimiter != null" style="color: black; background-color:{{row.entity.colorCode}}" ng-click="grid.appScope.$parent.vm.setFocus(row.entity)">' +
            '{{row.entity.delimiter}}' +
            '</span>' +
            '</div>' +
            '<div ng-if="row.entity.delimiter == null && !row.entity.isValid" class="ui-grid-cell-contents color-black" ng-click="grid.appScope.$parent.vm.setFocus(row.entity)" ng-class="{\'invaliddelimeter\': (row.entity.isValid  == \'No\' && !row.entity.delimiter)}"></div>' +
            '<div ng-if="row.entity.delimiter == null && row.entity.isValid==\'No\'" class="ui-grid-cell-contents color-black" ng-click="grid.appScope.$parent.vm.setFocus(row.entity)" ng-class="{invaliddelimeter: (row.entity.isValid  == \'No\' && !row.entity.delimiter)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ></div>' +
            '<div ng-if="row.entity.delimiter != null" class="ui-grid-cell-contents"  ng-class="{invaliddelimeter: (row.entity.isValid  == \'No\' && !row.entity.delimiter)}"><span class="label-box" ng-click="grid.appScope.$parent.vm.setFocus(row.entity)" ng-if="row.entity.id ==0 && row.entity.delimiter != null && row.entity.isValid==true" style="color: black; background-color:{{row.entity.colorCode}} !important">{{row.entity.delimiter}}</span></div>',
          width: '90',
          validators: { required: true },
          maxWidth: '300',
          cellEditableCondition: cellEditable,
          enableCellEditOnFocus: true
        },
        {
          field: 'dataElementName',
          displayName: 'Attributes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
          width: '150',
          editableCellTemplate: '<div style="height:100% !important;width:100% !important" ><form name="inputForm" style="height:100% !important;width:100% !important"><select id="ddlDataElement_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-class="colt + col.uid" ui-grid-edit-dropdown ng-model="MODEL_COL_FIELD" ng-options="field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray"   style="height:100% !important;width:100% !important" class="form-control"></select></form></div>',
          editDropdownIdLabel: 'dataElementName',
          editDropdownValueLabel: 'dataElementName',
          editDropdownOptionsArray: vm.dataelementList,
          validators: { required: true },
          maxWidth: '300',
          cellEditableCondition: cellEditable,
          enableCellEditOnFocus: true
        },
        {
          field: 'dataTypeName',
          displayName: 'Attribute Type',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
          width: '150',
          editableCellTemplate: '<div style="height:100% !important;width:100% !important" ><form name="inputForm" style="height:100% !important;width:100% !important"><select id="ddlDataType_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-class="colt + col.uid" ui-grid-edit-dropdown ng-model="MODEL_COL_FIELD" ng-options="field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray"   style="height:100% !important;width:100% !important" class="form-control"></select></form></div>',
          editDropdownIdLabel: 'dataTypeName',
          editDropdownValueLabel: 'dataTypeName',
          editDropdownOptionsArray: vm.dataTypeList,
          validators: { required: true },
          maxWidth: '350',
          cellEditableCondition: cellEditable,
          enableCellEditOnFocus: true
        },
        {
          field: 'displayOrder',
          displayName: 'Display order',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | number: 2}}</div>',
          width: '90',
          type: 'number',
          validators: { required: true },
          maxWidth: '200',
          cellEditableCondition: cellEditable,
          enableCellEditOnFocus: true
        },
        {
          field: 'notes',
          displayName: 'Notes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '455',
          maxWidth: '700',
          cellEditableCondition: cellEditable,
          enableCellEditOnFocus: true
        }
      ];
    }

    const cellEditable = function () {
      if (vm.BarcodeTemplateModel.status === vm.WoStatus[1].ID) {
        return false;
      }
      else {
        return true;
      }
    };

    function checkDataFields(item, elementObj) {
      if (elementObj && elementObj.length > 1) {
        if (elementObj && _.first(elementObj).dataElementID) {
          item.elementID = _.first(elementObj).dataElementID;
          item.fieldType = vm.fieldType[1].ID;
        } else if (elementObj && _.first(elementObj).id) {
          item.elementID = _.first(elementObj).id;
          item.fieldType = vm.fieldType[0].ID;
        }
      } else if (elementObj && elementObj.length === 1) {
        if (elementObj && _.first(elementObj).dataElementID) {
          item.elementID = _.first(elementObj).dataElementID;
          item.fieldType = vm.fieldType[1].ID;
        } else if (elementObj && _.first(elementObj).id) {
          item.elementID = _.first(elementObj).id;
          item.fieldType = vm.fieldType[0].ID;
        }
      }
    }
    // save or update barcode template detail
    vm.SaveBarcodeTemplate = (isChangeStatus) => {
      vm.saveBtnFlag = true;
      // if (!isChangeStatus && (!vm.BarcodeTemplateModel.Samplereaddata || BaseService.focusRequiredField(vm.AddBarcodeLabelTemapleteForm))) {
      if (!isChangeStatus && BaseService.focusRequiredField(vm.AddBarcodeLabelTemapleteForm)) {
        //e.g. msWizard.currentStepForm() in case of wizard and vm.formKitRelease in simple form
        vm.saveBtnFlag = false;
        return;
      }
      vm.isfalse = false;
      const delimiterDetails = [];
      vm.isSubmit = false;
      let colindex;
      let tempregexp = '';
      let elementObj = [];
      let dataTypeObj = [];
      let duplicateDisplayOrder;
      let seprator;
      let sepratorLength;
      vm.isDisplayOrderDuplicate = false;
      let validationMessege = null;

      if (vm.autoCompleteBarcodeCategory.keyColumnId !== vm.BarcodeCategoryList[1].key && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id && vm.sourceData && vm.sourceData.length === 1) {
        const objMax = _.maxBy(vm.sourceData, (item) => item.index);
        if (objMax.dataElementName !== CORE.LabelConstant.MFG.MFGPN) {
          if (vm.gridOptions && vm.gridOptions.gridApi) {
            vm.resetSourceGrid();
          }
          vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[3]);
          vm.sourceData[vm.sourceData.length - 1].dataElementName = null;
          validationMessege = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_FIRST_DELIMITER_MFGPN);// TRANSACTION.BARCODE_FIRST_DELIMITER_MFGPN;
          showValidationPopUp(validationMessege);
          return;
        }
      }
      else {
        if (vm.autoCompleteBarcodeCategory.keyColumnId !== vm.BarcodeCategoryList[1].key && vm.sourceData && vm.sourceData.length > 0) {
          const checkMFRPN = _.some(vm.sourceData, ['dataElementName', CORE.LabelConstant.MFG.MFGPN]);
          if (!checkMFRPN) {
            validationMessege = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_CONTAIN_MFGPN);// TRANSACTION.BARCODE_CONTAIN_MFGPN;
            showValidationPopUp(validationMessege);
            return;
          }
        }
      }

      if (vm.sourceData.length > 0) {
        _.each(vm.sourceData, (item) => {
          // Check required validation for inner grid fields.
          if (!item.delimiter || !item.dataTypeName || !item.dataElementName || item.displayOrder === null) {
            vm.isfalse = true;
            colindex = item.index;
            validationMessege = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_ATTRIBUTE_VALUE_REQUIRED);
            if (!item.delimiter) {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[2]);
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[colindex], vm.sourceHeader[2]);
              validationMessege.message = stringFormat(validationMessege.message, vm.gridOptions.columnDefs[2].displayName.toLowerCase());
            }
            else if (!item.dataElementName) {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[3]);
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[colindex], vm.sourceHeader[3]);
              validationMessege.message = stringFormat(validationMessege.message, vm.gridOptions.columnDefs[3].displayName.toLowerCase());
            }
            else if (!item.dataTypeName) {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[4]);
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[colindex], vm.sourceHeader[4]);
              validationMessege.message = stringFormat(validationMessege.message, vm.gridOptions.columnDefs[4].displayName.toLowerCase());
            }
            else if (item.displayOrder === null) {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[5]);
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[colindex], vm.sourceHeader[5]);
              validationMessege.message = stringFormat(validationMessege.message, vm.gridOptions.columnDefs[5].displayName.toLowerCase());
            }
            showValidationPopUp(validationMessege);
            return false;
          }
          // check for duplicate delimiter.
          let duplicateDelimiter;
          if (item.delimiter.toUpperCase() !== TRANSACTION.BarcodeFixDelimeter.BLANK) {
            duplicateDelimiter = _.find(vm.sourceData, (d) => {
              if (d.delimiter && d.delimiter.startsWith(item.delimiter) && item.index !== d.index) {
                return true;
              }
            });
          }
          if (duplicateDelimiter) {
            vm.isfalse = true;
            vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[item.index], vm.sourceHeader[2]);
            vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[item.index], vm.sourceHeader[2]);
            validationMessege = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_DELIMITER_DUPLICATE_MESSAGE);// TRANSACTION.BARCODE_DELIMITER_DUPLICATE_MESSAGE;
            showValidationPopUp(validationMessege);
            return false;
          }
          if (item.displayOrder) {
            duplicateDisplayOrder = _.find(vm.sourceData, (x) => x.displayOrder === item.displayOrder && x.index !== item.index);
          }
          if (duplicateDisplayOrder) {
            vm.isDisplayOrderDuplicate = true;
          }
        });
      }

      if (vm.isDisplayOrderDuplicate) {
        validationMessege = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_DISPLAY_ORDER_DUPLICATE_MESSAGE); // CORE.MESSAGE_CONSTANT.BARCODE_DISPLAY_ORDER_DUPLICATE_MESSAGE;
        showValidationPopUp(validationMessege);
        return;
      }
      if (vm.isfalse) {
        vm.isfalse = false;
        vm.saveBtnFlag = false;
        return;
      }
      else {
        if (SeparatorText && SeparatorText !== '') {
          seprator = SeparatorText ? SeparatorText : ' ';
        } else {
          seprator = vm.BarcodeTemplateModel.selectedSeparator;
        }
        sepratorLength = seprator ? seprator.length : 1;
        vm.sourceData = _.orderBy(vm.sourceData, 'displayOrder', ['asc']);
        if (vm.sourceData.length > 0) {
          const LastElementObj = _.last(vm.sourceData);
          _.each(vm.sourceData, (item) => {
            if (item) {
              // if dataelement name is same then we have to take first name in dropdown.
              elementObj = _.filter(vm.dataelementList, (data) => data.dataElementName === item.dataElementName);
              checkDataFields(item, elementObj);
              dataTypeObj = _.find(vm.dataTypeList, (data) => data.dataTypeName === item.dataTypeName);
              item.dataTypeID = dataTypeObj ? dataTypeObj.ID : null;
              delimiterDetails.push(item);

              // set regular expression here.
              if (item.delimiter) {
                if (item && item.dataTypeID === 0) {
                  // if data type is alphanumeric
                  if (vm.autoCompleteBarcodeType.keyColumnId === 1) {
                    if (item.dataElementName === CORE.LabelConstant.MFG.MFGPN || vm.autoCompleteBarcodeCategory.keyColumnId === vm.BarcodeCategoryList[1].key) {
                      tempregexp = tempregexp + item.delimiter + '[ ><\"\',\\[\\]a-zA-Z0-9\\\/!@:#\$%\^\&*\\\\\)\({};+=._-]*';
                    }
                  } else {
                    if (LastElementObj && LastElementObj.delimiter === item.delimiter) {
                      tempregexp = tempregexp + item.delimiter + '[ ><\"\',\\[\\]a-zA-Z0-9\\\/!@:#\$%\^\&*\\\\\)\({};+=._-]*';
                    } else {
                      if (item.delimiter.toUpperCase() === TRANSACTION.BarcodeFixDelimeter.BLANK) {
                        tempregexp = tempregexp + '[' + seprator + ']{' + sepratorLength + '}';
                      } else {
                        tempregexp = tempregexp + item.delimiter + '[ ><\"\',\\[\\]a-zA-Z0-9\\\/!@:#\$%\^\&*\\\\\)\({};+=._-]*[' + seprator + ']{' + sepratorLength + '}';
                      }
                    }
                  }
                }
                else if (item && item.dataTypeID && item.dataTypeID === 1) {
                  // if data type is numeric
                  if (vm.autoCompleteBarcodeType.keyColumnId === 1) {
                    if (item.dataElementName === CORE.LabelConstant.MFG.MFGPN) {
                      tempregexp = tempregexp + item.delimiter + '[0-9]*';
                    }
                  } else {
                    if (LastElementObj && LastElementObj.delimiter === item.delimiter) {
                      tempregexp = tempregexp + item.delimiter + '[0-9]*';
                    } else {
                      tempregexp = tempregexp + item.delimiter + '[0-9]*[' + seprator + ']{' + sepratorLength + '}';
                    }
                  }
                }
              }
            }
          });
          const prefixLen = vm.BarcodeTemplateModel.prefixlength ? vm.BarcodeTemplateModel.prefixlength : 0;
          let suffixLen = vm.BarcodeTemplateModel.suffixlength ? vm.BarcodeTemplateModel.suffixlength : 0;
          if (suffixLen === 0) {
            suffixLen = '0,256';
          } else {
            tempregexp = tempregexp + '[' + seprator + ']{' + sepratorLength + '}[ ><\"\',\\[\\]a-zA-Z0-9\\\/!@:#\$%\^\&*\\\\\)\({};+=._-]{' + suffixLen + '}';
          }
          if (prefixLen > 0) {
            const getSparator = vm.BarcodeTemplateModel.Samplereaddata.substring(prefixLen, prefixLen + sepratorLength);
            if (getSparator === seprator) {
              tempregexp = '[ ><\"\',\\[\\]a-zA-Z0-9\\\/!@:#\$%\^\&*\\\\\)\({};+=._-]{' + prefixLen + '}' + '[' + seprator + ']{' + sepratorLength + '}' + tempregexp;
            }
            else {
              tempregexp = '[ ><\"\',\\[\\]a-zA-Z0-9\\\/!@:#\$%\^\&*\\\\\)\({};+=._-]{' + prefixLen + '}' + tempregexp;
            }
          }
          tempregexp = '^' + tempregexp + '$';
        }
        vm.BarcodeTemplateModel.status = statusOfPublish && statusOfPublish.ID ? statusOfPublish.ID : 0;
        const barcodeTemplateInfo = {
          name: vm.BarcodeTemplateModel.name,
          prefixlength: vm.BarcodeTemplateModel.prefixlength,
          suffixlength: vm.BarcodeTemplateModel.suffixlength,
          wildcardformat: null,
          description: vm.BarcodeTemplateModel.description,
          status: vm.BarcodeTemplateModel.status,
          mfgcodeid: vm.autoCompletemfgCode.keyColumnId ? vm.autoCompletemfgCode.keyColumnId : null,
          separator: vm.autoCompleteSeparator.keyColumnId ? vm.autoCompleteSeparator.keyColumnId : null,
          delimiterData: delimiterDetails,
          tempregexp: tempregexp,
          Samplereaddata: vm.BarcodeTemplateModel.Samplereaddata,
          barcodeType: vm.autoCompleteBarcodeType.keyColumnId,
          barcodeCategory: vm.autoCompleteBarcodeCategory.keyColumnId
        };
        if (vm.BarcodeTemplateModel.Samplereaddata && (vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id || seprator)) {
          if (!seprator && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id) {
            seprator = '';
          }
          const splitSeprator = vm.BarcodeTemplateModel.Samplereaddata.split(seprator);
          if (splitSeprator.length > 1) {
            // Update barcode template master & delimiter data
            if (vm.BarcodeTemplateModel && $stateParams.id || vm.id) {
              const id = $stateParams.id ? $stateParams.id : vm.id;
              vm.cgBusyLoading = BarcodeLabelTemplateFactory.barcode_label_template().update({
                id: id
              }, barcodeTemplateInfo).$promise.then((response) => {
                if (response.data) {
                  vm.id = $stateParams.id;
                  vm.isEdit = true;
                  vm.delimiterData = [];
                  vm.AddBarcodeLabelTemapleteForm.$setPristine();
                  // getTemplateDataIdWise(vm.id)
                  // grid();
                  $state.go(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, { id: vm.id }, { reload: true });
                } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.isDuplicateName) {
                  if (checkResponseHasCallBackFunctionPromise(response)) {
                    response.alretCallbackFn.then(() => {
                      vm.BarcodeTemplateModel.name = null;
                      setFocus('name');
                    });
                  }
                } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.isDuplicateExpression) {
                  response.alretCallbackFn.then(() => {
                    vm.BarcodeTemplateModel.Sampledata = vm.BarcodeTemplateModel.Samplereaddata = null;
                    setFocus('Sampledata');
                  });
                }
              }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
                vm.saveBtnFlag = false;
              });
            }
            else {
              // Save barcode template master & delimiter data
              vm.cgBusyLoading = BarcodeLabelTemplateFactory.barcode_label_template().save(barcodeTemplateInfo).$promise.then((response) => {
                if (response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  if (response.data.id) {
                    vm.id = response.data.id;
                    vm.isEdit = true;
                    vm.delimiterData = [];
                    vm.AddBarcodeLabelTemapleteForm.$setPristine();
                    $state.go(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, { id: vm.id }, { reload: true });
                  }
                } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.isDuplicateName) {
                  if (checkResponseHasCallBackFunctionPromise(response)) {
                    response.alretCallbackFn.then(() => {
                      vm.BarcodeTemplateModel.name = null;
                      setFocus('name');
                    });
                  }
                } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.isDuplicateExpression) {
                  response.alretCallbackFn.then(() => {
                    vm.BarcodeTemplateModel.Sampledata = vm.BarcodeTemplateModel.Samplereaddata = null;
                    setFocus('Sampledata');
                  });
                }
              }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
                vm.saveBtnFlag = false;
              });
            }
          } else {
            // if separator is not valid
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_SEPARATOR_VALIDATION_MESSAGE);
            const obj = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(obj);
            vm.saveBtnFlag = false;
          }
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SEPARATOR_REQUIRED);
          const obj = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj);
          vm.saveBtnFlag = false;
        }
      }
    };

    // Add new row in ui grid
    $scope.addNewParentRow = (char) => {
      const objMax = _.maxBy(vm.sourceData, (item) => item.index);
      const isEmpty = _.find(vm.sourceData, (s) => {
        if (s.delimiter === null || s.dataElementName === null || s.displayOrder === null || s.dataTypeName === null) {
          return true;
        }
      });
      const obj = {
        index: objMax ? objMax.index + 1 : 0,
        id: 0,
        delimiter: char ? char : null,
        // length: null,
        notes: null,
        dataElementName: null,
        dataTypeName: Array.isArray(vm.dataTypeList) && vm.dataTypeList.length > 0 ? 'Alphanumeric' : null,
        displayOrder: null,
        isValid: char ? true : false,
        colorCode: char ? vm.barcodeDelimiterColor[objMax ? objMax.index + 1 : 0] : null
      };
      if (!isEmpty || char) {
        if (objMax && vm.autoCompleteBarcodeCategory.keyColumnId !== vm.BarcodeCategoryList[1].key && vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id && vm.sourceData && vm.sourceData.length === 1) {
          if (objMax.dataElementName !== CORE.LabelConstant.MFG.MFGPN) {
            if (vm.gridOptions && vm.gridOptions.gridApi) {
              vm.resetSourceGrid();
            }
            vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[3]);
            vm.sourceData[vm.sourceData.length - 1].dataElementName = null;
            return;
          }
        }
        vm.AddBarcodeLabelTemapleteForm.$dirty = true;
        vm.sourceData.push(obj);
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_TEMPLATE_ADD_ROW_VALIDATION_MESSAGE);
        const obj = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      }

      if (objMax && vm.autoCompleteBarcodeType.keyColumnId === 0 && vm.sourceData && vm.sourceData.length === 1) {
        if (objMax.dataElementName !== CORE.LabelConstant.MFG.MFGPN) {
          $timeout(() => {
            if (vm.gridOptions && vm.gridOptions.gridApi) {
              vm.resetSourceGrid();
            }
            $timeout(() => {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[3]);
            }, _configTimeout);
          }, _configTimeout);
        }
      }

      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      $timeout(() => {
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.resetSourceGrid();
        }
        $timeout(() => {
          if (!char) {
            vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[2]);
          } else {
            vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[0], vm.sourceHeader[3]);
          }
        }, _configTimeout);
      }, _configTimeout);
    };

    // Deleted rows remove from source data.
    function removeIndexFromSourceData(index, list) {
      _.each(index, (itemData) => {
        var index = _.findIndex(vm.delimiterData, (deliM) => deliM.index === itemData);
        vm.delimiterData.splice(index, 1);
        vm.sourceData = _.reject(vm.sourceData, (item) => item.index === itemData);
      });
      let inde = -1;
      _.each(vm.sourceData, (s) => {
        inde = inde + 1;
        s.index = inde;
      });
      if (vm.sourceData && vm.sourceData.length === 0) {
        const obj = {
          index: 0,
          id: 0,
          delimiter: null,
          length: null,
          notes: null,
          dataElementName: null,
          dataTypeName: null,
          displayOrder: null,
          isValid: false
        };
        vm.sourceData.push(obj);
      }
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      vm.gridOptions.clearSelectedRows();
      $timeout(() => {
        vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, list, vm.sourceData);
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.resetSourceGrid();
        }
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[2]);
      }, 0);
    }

    // remove single blank row
    function removeSingleRowBlankData(index, list) {
      vm.sourceData.splice(index, 1);
      let inde = -1;
      _.each(vm.sourceData, (s) => {
        inde = inde + 1;
        s.index = inde;
      });
      if (vm.sourceData && vm.sourceData.length === 0) {
        const obj = {
          index: 0,
          id: 0,
          delimiter: null,
          length: null,
          notes: null,
          dataElementName: null,
          dataTypeName: null,
          displayOrder: null,
          isValid: false
        };
        vm.sourceData.push(obj);
      }
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      $timeout(() => {
        vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, list, vm.sourceData);
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.resetSourceGrid();
        }
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[2]);
      }, 0);
    }

    // Remove row from ui grid
    vm.deleteRecord = (row) => {
      let indexIDs = [];
      let selectedIDs = [];
      let obj;
      if (row && row.id) {
        indexIDs.push(row.index);
        selectedIDs.push(row.id);
      }
      else if (!row) {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
          indexIDs = vm.selectedRows.map((item) => item.index);
        }
      }
      const blankIDs = _.filter(selectedIDs, (item) => item === 0);
      const DBIDs = _.filter(selectedIDs, (item) => item !== 0);

      if (selectedIDs) {
        if (row && row.id === 0) {
          selectedIDs.length = 1;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Field identifier', selectedIDs.length);
        obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.AddBarcodeLabelTemapleteForm.$dirty = true;
            // if selected rows are saved in DB.
            if (DBIDs && DBIDs.length > 0) {
              vm.cgBusyLoading = BarcodeLabelTemplateFactory.deleteBarcodeLabelTemplateDelimiter().save({ id: DBIDs }).$promise.then((res) => {
                if (res) {
                  removeIndexFromSourceData(indexIDs, vm.selectedRowsList ? vm.selectedRowsList : row);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }

            // if row is blank.
            if (row && row.id === 0) {
              const data = _.find(vm.sourceData, (Item) => Item.index === row.index);
              const index = _.indexOf(vm.sourceData, data);
              removeSingleRowBlankData(index, vm.selectedRowsList ? vm.selectedRowsList : row);
            }

            // if selected rows are blank.
            if (blankIDs && blankIDs.length > 0 && DBIDs.length === 0) {
              removeIndexFromSourceData(indexIDs, vm.selectedRowsList ? vm.selectedRowsList : row);
            }
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    $scope.$on('AddNew', () => {
      $scope.addNewParentRow();
    });
    /* ------------------end grid----------------*/

    // Open description popup
    vm.AddDescription = (ev) => {
      const data = vm.BarcodeTemplateModel;
      DialogFactory.dialogService(
        USER.ADD_DESCRIPTION_POPUP_CONTROLLER,
        USER.ADD_DESCRIPTION_POPUP_VIEW,
        ev,
        data).then(() => {
        }
          , (insertedData) => {
            if (insertedData) {
              vm.BarcodeTemplateModel.description = insertedData;
            }
            vm.AddBarcodeLabelTemapleteForm.$dirty = true;
          }, (error) => BaseService.getErrorLog(error));
    };
    vm.goBack = () => {
      // if (vm.checkDirty) {
      //  showWithoutSavingAlertforGoback();
      // } else {
      //  $state.go(USER.ADMIN_BARCODE_LABEL_TEMPLATE_STATE, { id: null });
      // }
      $state.go(USER.ADMIN_BARCODE_LABEL_TEMPLATE_STATE, { id: null });
    };
    /*
    * Author : Rumit
    * Purpose :Show save alert popup on go back
    */
    // function showWithoutSavingAlertforGoback() {
    //  let obj = {
    //    title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
    //    textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
    //    btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
    //    canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
    //  };
    //  DialogFactory.confirmDiolog(obj).then((yes) => {
    //    if (yes)
    //      $state.go(USER.ADMIN_BARCODE_LABEL_TEMPLATE_STATE, { id: null });
    //  }, (cancel) => {
    //  }).catch((error) => {
    //    return BaseService.getErrorLog(error);
    //  });
    // }

    vm.setFocus = (row) => {
      const objBarcode = _.find(vm.sourceData, (item) => item.index === row.index);
      const index = vm.sourceData.indexOf(objBarcode);
      vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[index], vm.sourceHeader[2]);
    };

    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    vm.goToBarcodeSeparatorsList = () => {
      const seperatorId = _.find(CORE.Category_Type, (data) => data.categoryType === CORE.CategoryType.BarcodeSeparator.Name);
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_STATE, { categoryTypeID: seperatorId.categoryTypeID });
    };

    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.getNumberLengthValidation = (maxLength, enterTextLength) => {
      if (enterTextLength > maxLength) {
        return stringFormat(angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_RANGE_PREFIX_SUFFIX.message), maxLength);
      }
    };

    vm.tabToSaveButton = (e) => {
      $timeout(() => { tabToSaveButton(e); }, true);
    };

    const showValidationPopUp = (validationMessage) => {
      const obj = {
        messageContent: validationMessage,
        multiple: true
      };
      // var model = {
      //  title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
      //  textContent: validationMessage,
      //  multiple: true
      // };
      DialogFactory.messageAlertDialog(obj);
      vm.saveBtnFlag = false;
      return;
    };

    vm.scanLabelDet = (e, form) => {
      $timeout(() => {
        scanlabel(e, form);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    function scanlabel(e) {
      if ((e.keyCode === 13)) {
        if (!vm.BarcodeTemplateModel.Samplereaddata) {
          return;
        }
        if (vm.BarcodeTemplateModel.Samplereaddata !== vm.BarcodeTemplateModel.Sampledata) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SCANNED_LABEL_NOT_MATCH);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(obj).then((yes) => {
            if (yes) {
              setFocus('Samplereaddata');
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
        if (!$stateParams.id) {
          if (vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id) {
            vm.gridOptions.data[0].delimiter = TRANSACTION.BarcodeFixDelimeter.NONE;
            vm.gridOptions.data[0].colorCode = vm.barcodeDelimiterColor[0];
            vm.gridOptions.data[0].isValid = true;
            $timeout(() => { vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, null, vm.sourceData); }, true);
          } else {
            let scanLabel = angular.copy(vm.BarcodeTemplateModel.Samplereaddata);
            if (vm.BarcodeTemplateModel.prefixlength) {
              scanLabel = scanLabel.slice(vm.BarcodeTemplateModel.prefixlength ? vm.BarcodeTemplateModel.prefixlength : 0);
            }
            if (vm.BarcodeTemplateModel.suffixlength) {
              scanLabel = scanLabel.slice(0, vm.BarcodeTemplateModel.suffixlength ? -(vm.BarcodeTemplateModel.suffixlength) : 0);
            }
            // get selected seprator
            const objSeprator = _.find(vm.separatorList, (item) => item.gencCategoryID === vm.autoCompleteSeparator.keyColumnId);
            if (objSeprator && (vm.sourceData.length === 1)) {
              vm.sourceData = [];
              // break label string through seprator into multiple parts
              let breakLabel = scanLabel.split(objSeprator.gencCategoryName ? objSeprator.gencCategoryName : ' ');
              if (vm.BarcodeTemplateModel.suffixlength === 0) {
                breakLabel = _.remove(breakLabel, (item, index) => {
                  if (index !== (breakLabel.length - 1)) {
                    return item;
                  }
                });
              }
              _.each(breakLabel, (lblBreak, index) => {
                let char = '';
                if (lblBreak.charAt(0)) {
                  char = lblBreak.charAt(0);
                  if (_.find(vm.sourceData, (sData) => sData.delimiter === lblBreak.charAt(0))) {
                    char = lblBreak.substring(0, 2);
                  }
                  $scope.addNewParentRow(char);
                }
                else {
                  if (index !== 0 && index !== (breakLabel.length - 1)) {
                    $scope.addNewParentRow(TRANSACTION.BarcodeFixDelimeter.BLANK);
                  }
                }
              });
              $timeout(() => { vm.highlight(vm.BarcodeTemplateModel.Samplereaddata, null, vm.sourceData); }, true);
            }
          }
        }
      }
    }

    // set focus on ingore field
    vm.focusChange = (ev) => {
      if (ev.keyCode === 13) {
        const myEl = angular.element(document.querySelector(vm.autoCompleteBarcodeType.keyColumnId === vm.BarcodeTypeList[0].Id ? '#Samplereaddata' : '#prefixlength'));
        if (myEl) {
          myEl.focus();
        }
      }
    };

    // refresh attributes
    vm.refreshAttribute = () => {
      getDataElementList();
      const initPromise = [getDataElementList()];
      vm.cgBusyLoading = $q.all(initPromise).then(() => {
        if (vm.gridOptions && vm.gridOptions.columnDefs) {
          vm.gridOptions.columnDefs[3].editDropdownOptionsArray = vm.dataelementList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // go to dynamic field
    vm.goToAttribute = () => {
      BaseService.goToElementManage(CORE.AllEntityIDS.Component_sid_stock.ID);
    };

    // Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.AddBarcodeLabelTemapleteForm];
    });
  }
})();

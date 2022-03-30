(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ConfigureRestrictedFileTypeController', ConfigureRestrictedFileTypeController);
  function ConfigureRestrictedFileTypeController($mdDialog, $scope, DialogFactory, CORE, BaseService, CONFIGURATION, $timeout, SettingsFactory, USER) {
    var vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CONFIGURE_RESTRICT_FILE_TYPES;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isFormDirty = true;
    vm.extensionList = [];
    vm.checkDuplicate = false;
    vm.configureFileTypeModel = {
      fileExtension: null
    };
    vm.saveBtnFlag = false;
    vm.isUpdatable = true;
    vm.loginUser = BaseService.loginUser;
    vm.isSuperAdmin = (_.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID && item.name.toLowerCase() === CORE.Role.SuperAdmin.toLowerCase())) ? true : false;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.popupRights = false;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [], /* for default - directly set in sp */
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Restrict File Types.csv'
    };

    const isVisibleParent = () => {
      const objAction = _.find(vm.sourceHeader, (col) => col.field === 'Action');
      objAction.visible = false;
      if (vm.popupRights) {
        objAction.visible = true;
        vm.isHideDelete = false;
      }
      else {
        _.remove(vm.sourceHeader, (col) => col.field === 'Action');
        vm.isHideDelete = true;
        vm.gridOptions.enableRowHeaderSelection = false;
        vm.gridOptions.enableRowSelection = false;
        vm.gridOptions.multiSelect = false;
      }
    }

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true,
      enableCellEdit: false
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false
    }, {
      field: 'fileExtension',
      displayName: 'File Extension',
      width: 250,
      enableCellEdit: false
      },
      {
        field: 'SyatemGeneratedValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      },
      {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }];

    setPopupRights = (pageList) => {
      if (pageList && pageList.length > 0) {
        var tab = pageList.filter(a => a.PageDetails != null && a.PageDetails.pageRoute == CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.popupRights = true;
        }
        isVisibleParent();
      }
    }
    $timeout(() =>
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setPopupRights(menudata);
        $scope.$applyAsync();
      })
    );

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setPopupRights(BaseService.loginUserPageList);
    }

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = SettingsFactory.retriveConfigureFileTypeForUIGrid().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch(error => BaseService.getErrorLog(error));
    };

    setDataAfterGetAPICall = (fileExtensions, isGetDataDown) => {
      if (fileExtensions && fileExtensions.data.genericfileextension) {
        if (!isGetDataDown) {
          vm.sourceData = fileExtensions.data.genericfileextension;
          vm.currentdata = vm.sourceData.length;
        }
        else if (fileExtensions.data.genericfileextension.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(fileExtensions.data.genericfileextension);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        if (vm.sourceData && vm.sourceData.length > 0) {
          vm.sourceData.forEach(item => {
            item.isDisabledDelete = item.systemGenerated ? true : false
            item.isDisabledUpdate = item.isDisabledDelete;
            item.isRowSelectable = !item.isDisabledDelete;
          })
        }
        // must set after new data comes
        vm.totalSourceDataCount = fileExtensions.data.Count;
        if (!vm.gridOptions.enablePaging) {
          !isGetDataDown ? vm.gridOptions.gridApi.infiniteScroll.resetScroll() : vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage()
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
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
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SettingsFactory.retriveConfigureFileTypeForUIGrid().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Check Duplicate Extension
    vm.checkUniqueExtension = () => {
      vm.isduplicate = false;

      if (vm.configureFileTypeModel.fileExtension) {
        vm.cgBusyLoading = SettingsFactory.checkDuplicateExtension().save({
          id: (vm.configureFileTypeModel.id || vm.configureFileTypeModel.id === 0) ? vm.configureFileTypeModel.id : null,
          fileExtension: vm.configureFileTypeModel.fileExtension,
          refTableName: CORE.TABLE_NAME.GENERIC_FILE_EXTENSION
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;

            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Extension');

            const uniqueObj = {
              messageContent: messageContent,
              controlName: 'fileExtension'
            };
            const obj = {
              messageContent: uniqueObj.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };
            vm.configureFileTypeModel.fileExtension = null;

            DialogFactory.messageAlertDialog(obj).then(() => {
              if (uniqueObj.controlName) {
                setFocusByName(uniqueObj.controlName);
              }
            }, () => {
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
          else {
            vm.isduplicate = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Remove File Extension
    vm.deleteRecord = (item) => {

      let selectedIDs = [];

      if (!vm.configureFileTypeModel.fileExtension) {
        vm.configureFileTypeForm.$setUntouched();
        vm.configureFileTypeForm.$setPristine();
      }

      if (item) {
        selectedIDs.push(item.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map(fileExtensionItem => fileExtensionItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Extension', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = SettingsFactory.deleteConfigureFileType().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res) {
                if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    IsHideTransactionCount: false
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return SettingsFactory.deleteConfigureFileType().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data
                        ).then(() => {
                        }, () => {
                        });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                  vm.configureFileTypeForm.$setPristine();
                  vm.configureFileTypeForm.$setUntouched();
                  setFocusByName('fileExtension');
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
          setFocusByName('fileExtension');
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Extension');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    // Save Configure file Type
    vm.saveConfigureFileType = () => {
      vm.saveBtnFlag = true;
      if (BaseService.focusRequiredField(vm.configureFileTypeForm, vm.isFormDirty)) {
        vm.saveBtnFlag = false;
        return;
      }

      if (vm.configureFileTypeModel.id) {
        vm.cgBusyLoading = SettingsFactory.saveConfigureFileType().save(vm.configureFileTypeModel).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.configureFileTypeModel = {
              fileExtension: null
            };
            vm.configureFileTypeForm.$setPristine();
            vm.configureFileTypeForm.$setUntouched();
            vm.saveBtnFlag = false;
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          } else if (res && res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveBtnFlag = false;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.manageGenericCategoryForm);
              });
            }
          }
        }).catch((error) => {
          vm.saveBtnFlag = false;
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.configureFileTypeModel.type = 'R';
        vm.configureFileTypeModel.systemGenerated = false;

        vm.cgBusyLoading = SettingsFactory.saveConfigureFileType().save(vm.configureFileTypeModel).$promise.then((res) => {
          if (res.data) {
            vm.configureFileTypeModel = {
              fileExtension: null
            };
            vm.configureFileTypeForm.$setPristine();
            vm.configureFileTypeForm.$setUntouched();
            vm.saveBtnFlag = false;
            setFocusByName('fileExtension');
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }).catch((error) => {
          vm.saveBtnFlag = false;
          BaseService.getErrorLog(error);
        });
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => vm.deleteRecord();

    vm.updateRecord = (row) => {
      if (row && row.entity.id) {
        vm.cgBusyLoading = SettingsFactory.retriveConfigureFileTypeById().query({ id: row.entity.id }).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.configureFileTypeModel = response.data;
            setFocusByName('fileExtension');
          }
          $timeout(() => {
            if (vm.configureFileTypeModel) {
              BaseService.checkFormValid(vm.configureFileTypeModel, false);
            }
          }, 0);
        }).catch(error => BaseService.getErrorLog(error));
      }
    };

    // Close Configure file Type Popup
    vm.cancel = () => {
      if (vm.popupRights && vm.configureFileTypeForm.fileExtension.$dirty) {
        const data = {
          form: vm.configureFileTypeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();

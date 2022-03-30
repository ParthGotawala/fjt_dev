(function () {
  'use strict';

  angular
    .module('app.reports.misreport')
    .controller('DynamicReportDetailPopupController', DynamicReportDetailPopupController);

  /* @ngInject */
  function DynamicReportDetailPopupController($mdDialog, $timeout, data, WIDGET, CORE, DialogFactory,
    WidgetFactory, uiSortableMultiSelectionMethods, BaseService, $q, USER, DynamicReportMstFactory, REPORTS, $scope) {
    var vm = this;
    let loginUserDetails = BaseService.loginUser.employee;
    vm.MISCommonReportType = CORE.MISCommonReportType;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.filterSelected = true;
    vm.fieldsList = [];
    vm.miscommonreport = {};
    vm.AllFieldsSelected = false;
    vm.DefaultdateFormat = _dateDisplayFormat;
    let oldReportName = '';
    let selectedDbViewName = null;
    var groupCount = 0;
    var count = 0;
    var sublevelCount = 0;
    vm.OptionTypeArr = CORE.OPTIONTYPES;
    vm.datatypes = CORE.DATATYPE;
    vm.chartCategoryList = [];
    vm.list = [];

    vm.SearchAssignedFieldList = null;
    vm.SearchNotAssignedFieldList = null;
    vm.NotAssignedFieldList = [];
    vm.AssignedFieldList = [];
    vm.EmptyMesssageForAssigned = USER.ADMIN_EMPTYSTATE.MIS_REPORT_FIELDS_ASSIGNED_EMPTY;
    vm.EmptyMesssageForNotAssigned = USER.ADMIN_EMPTYSTATE.MIS_REPORT_NOT_ASSIGNED_EMPTY;

    // Reset selected fields
    let ResetSelectedFields = () => {
      $scope.selectedFieldListNotAdded = [];
      $scope.selectedFieldListAdded = [];
    }
    ResetSelectedFields();

    //Unselect all Field from list
    let UnSelectAllFields = () => {
      angular.element('[ui-sortable]#NotAssignedFieldList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#AssignedFieldList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedFields();
    }


    /* get all data source list (report db-views) */
    let getAllDataSourceList = () => {

      return WidgetFactory.getChartRawDataListByAccessRole().save({
        roleID: BaseService.loginUser.defaultLoginRoleID,
        selectedChartRawDataCatID: data && data.misReportFilterDetails ? data.misReportFilterDetails.chartRawDataCatID : null,
      }).$promise.then((response) => {
        if (response && response.data && response.data.chartRawdataCategoryList.length > 0) {
          vm.dataSourceList = response.data.chartRawdataCategoryList;
        }
        else {
          vm.dataSourceList = [];
        }
        return vm.dataSourceList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // [S] Getting Chart Category
    function getChartCategoryList() {
      return WidgetFactory.getChartCategoryList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.chartCategoryList = response.data;
          return vm.chartCategoryList;
        }
        else {
          vm.chartCategoryList = [];
        }
      }).catch((error) => {
        return null;
      });
    }
    // [E] Getting Chart Category

    /* get all report columns for selected data source (db-view) */
    let getReportColumnList = (selectedItem) => {
      if (!selectedItem) {
        vm.AllFieldsSelected = false;
        return;
      }

      let setSelectableListItem = () => {
        $timeout(() => {
          setFieldListItem();
        }, _configSelectListTimeout);
      }

      //#region unselect single element list
      let UnSelectFields = (unSelectFrom) => {
        if (unSelectFrom == "NoAdded") {
          angular.element('[ui-sortable]#NoAddedFieldList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#AddedFieldList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedFields();
      }
      //#endregion


      //#region  set item selectable
      let setFieldListItem = () => {
        angular.element('[ui-sortable]#AddedFieldList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectFields("NoAdded");
          let $this = $(this);
          $scope.selectedFieldListAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#NoAddedFieldList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectFields("Added");
          let $this = $(this);
          $scope.selectedFieldListNotAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
      }
      //#endregion


      //#region : Add and Add all Non-assigned fields
      let saveFields = (addType) => {
        let _objList = {};
        if (addType == "AddAll") {
          _objList.Fields = _.map(vm.NotAssignedFieldList, (item) => {
            item.selected = true;
            vm.AssignedFieldList.push(item);
          });
        }
        else {
          _objList.Fields = $scope.selectedFieldListNotAdded.map(function (item) {
            vm.NotAssignedFieldList.filter(function (filterItem) {
              if (filterItem.field == item) {
                filterItem.selected = true;
                vm.AssignedFieldList.push(filterItem);
              }
            });
          });
        }
        vm.refreshFields();
        return _objList.Fields = vm.AssignedFieldList;
      }
      //endregion

      //#region : Remove and Remove all assigned fields
      let removeAssignedFields = (addType) => {
        let _objList = {};
        if (addType == "RemoveAll") {
          _objList.Fields = _.map(vm.AssignedFieldList, (item) => {
            item.selected = false;
            vm.NotAssignedFieldList.push(item);
          });
        }
        else {
          _objList.Fields = $scope.selectedFieldListAdded.map(function (item) {
            vm.AssignedFieldList.filter(function (filterItem) {
              if (filterItem.field == item) {
                filterItem.selected = false;
                vm.NotAssignedFieldList.push(filterItem)
              }
            });
          });
        }
        return _objList.RemoveFields = vm.NotAssignedFieldList;
      }
      //endregion

      vm.ManageField = (AddType, event, ui) => {
        if (AddType == 'Add' || AddType == "AddAll") {
          var promises = [saveFields(AddType)];
          return vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0]) {
              ResetSelectedFields();
              vm.refreshFields();
              vm.SearchNotAssignedFieldList = null;
              vm.searchFieldsFromNotAssignedList();
              vm.MISCommonReportDetailsForm.$setDirty();
              vm.MISCommonReportDetailsForm.AddedFieldList.$dirty = true;
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else if (AddType == "Remove" || AddType == "RemoveAll") {
          var promises = [removeAssignedFields(AddType)];
          return vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0]) {
              ResetSelectedFields();
              vm.refreshFields();
              vm.SearchAssignedFieldList = null;
              vm.searchFieldsFromAssignedList();
              vm.MISCommonReportDetailsForm.$setDirty();
              vm.MISCommonReportDetailsForm.AddedFieldList.$dirty = true;
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;
        }
      }

      selectedDbViewName = selectedItem.dbViewName;
      return WidgetFactory.getChartRawViewColumns().query({ id: selectedItem.chartRawDataCatID }).$promise.then((response) => {
        if (response && response.data) {
          vm.fieldsList = angular.copy(response.data);

          if (vm.miscommonreport.ID && vm.miscommonreport.dynamicReportFields) {
            _.each(vm.miscommonreport.dynamicReportFields, (savedfielditem) => {
              let obj = _.find(vm.fieldsList, (fielditem) => {
                return fielditem.field == savedfielditem.Fields
              });
              if (obj) {
                obj.selected = true
              }
            });
            vm.miscommonreport.dynamicReportFields = _.sortBy(vm.miscommonreport.dynamicReportFields, 'orderBy');

            vm.AssignedFieldList = _.map(vm.miscommonreport.dynamicReportFields, (item) => {
              var detailObject = vm.fieldsList.find(Obj => Obj.field == item.Fields);
              if (detailObject) {
                return detailObject;
              }
            });
            vm.AssignedFieldList.map(function (item) {
              item.selected = true;
            });

            vm.AllFieldsSelected = vm.miscommonreport.dynamicReportFields.length == vm.fieldsList.length ? true : false;
          }
          vm.NotAssignedFieldList = _.difference(vm.fieldsList, vm.AssignedFieldList);
          vm.NotAssignedFieldList.map(function (item) {
            item.selected = false;
          });
          setSelectableListItem();
          reorderFieldsList();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initializeAutoComplete = () => {
      vm.autoCompleteDataSource = {
        columnName: 'name',
        keyColumnName: 'chartRawDataCatID',
        keyColumnId: vm.miscommonreport.chartRawDataCatID ? vm.miscommonreport.chartRawDataCatID : null,
        inputName: 'DataSource',
        placeholderName: 'Data Source',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllDataSourceList,
        onSelectCallbackFn: getReportColumnList
      }

      vm.autoCompleteChartCategory = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.miscommonreport.chartCategoryID ? vm.miscommonreport.chartCategoryID : null,
        controllerName: WIDGET.WIDGET_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: WIDGET.WIDGET_CATEGORY_MODAL_VIEW,
        addData: { categoryFor: 'Report' },
        inputName: 'chartCategory',
        placeholderName: 'Report Category',
        isRequired: true,
        isAddnew: true,
        callbackFn: getChartCategoryList,
        onSelectCallbackFn: null,
      };
    }

    var cgPromise = [getAllDataSourceList(), getChartCategoryList()];
    vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
      if (responses[0] && responses[1]) {
        initializeAutoComplete();
      }
    });


    // Create filter function for a query string
    let createFilterFor = (query) => {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return (angular.lowercase(contact.name).indexOf(lowercaseQuery) != -1);
      };
    }

    /* save-update mis report details */
    vm.saveMISReportData = () => {
      if (vm.SearchAssignedFieldList) {
        vm.SearchAssignedFieldList = ''
        vm.searchFieldsFromAssignedList();
      }
      if (vm.SearchNotAssignedFieldList) {
        vm.SearchNotAssignedFieldList = '';
        vm.searchFieldsFromNotAssignedList();
      }
      //Used to focus on first error filed of form
      if (BaseService.focusRequiredField(vm.MISCommonReportDetailsForm)) {
        return;
      }
      vm.isSubmit = false;
      if (!vm.MISCommonReportDetailsForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      //Sorting of fieldslist by its displayOrder in Ascending Order
      let fieldsSelectionList = [];
      let sequenceOrder = 1;
      _.each(vm.AssignedFieldList, function (item) {
        if (item.selected) {
          //item.displayOrder = sequenceOrder;
          var obj = { orderBy: sequenceOrder, Fields: item.field };
          fieldsSelectionList.push(obj);
          sequenceOrder++;
        }
      });

      if (fieldsSelectionList.length == 0) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SELECT_ATLEAST_ONE_FIELD);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      const reportInfo = {
        ReportName: vm.miscommonreport.ReportName,
        fieldsSelectionList: fieldsSelectionList,
        Filter: vm.miscommonreport.Filter ? JSON.stringify(vm.miscommonreport.Filter) : null,
        ReportType: vm.miscommonreport.ReportType,
        chartRawDataCatID: vm.autoCompleteDataSource.keyColumnId,
        employeeListForAllowedToViewReport: [],
        dbViewName: selectedDbViewName,
        pivotJsonData: null,
        chartCategoryID: vm.autoCompleteChartCategory.keyColumnId,
        isPinToDashboard: vm.miscommonreport.isPinToDashboard
      };

      if (vm.miscommonreport && vm.miscommonreport.ID) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ALL_PIVOT_CONFIGURATION_RESET);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = DynamicReportMstFactory.updateDynamicReportData().update({
              id: vm.miscommonreport.ID
            }, reportInfo).$promise.then((res) => {
              if (res.data && res.data.dynamicReportID) {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.hide(res.data.dynamicReportID);
              }
              if (res.data && res.data.ID) {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.hide(res.data.ID);
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }

        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        reportInfo.employeeListForAllowedToViewReport.push(loginUserDetails.id); // added access for login user by default

        vm.cgBusyLoading = DynamicReportMstFactory.saveDynamicReportData().save(reportInfo).$promise.then((res) => {
          if (res.data && res.data.dynamicReportID) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.data.dynamicReportID);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }


    //region      
    // set up sortable options
    $scope.sortableOptions = {
      update: (e, ui) => {
        let newPosition = null;
        let ResultFind = [];
        ResultFind = vm.fieldsList.find(function (items) {
          if (items.displayName == ui.item[0].innerText) {
            newPosition = ui.item.index() + 1;
            return items;
          }
        });
        let OldPosition = ResultFind.displayOrder;
        vm.fieldsList.map(function (item) {
          if (item.displayName != ResultFind.displayName) {
            if (item.displayOrder < OldPosition && item.displayOrder >= newPosition) {
              item.displayOrder = item.displayOrder + 1;
            }
            if (item.displayOrder > OldPosition && item.displayOrder <= newPosition) {
              item.displayOrder = item.displayOrder - 1;
            }
          }
          else if (item.displayName == ResultFind.displayName && item.displayOrder == OldPosition) {
            item.displayOrder = newPosition;
          }
          return item;
        });
        // console.log(vm.fieldsList);
      },
      stop: function (e, ui) {
        // do something here       
      }
    };
    //endregion

    //#region sortable option common for all list
    $scope.sortableOptionsFields = uiSortableMultiSelectionMethods.extendOptions({
      cancel: ".cursor-not-allow,:input",
      placeholder: "beingDragged",
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: (e, ui) => {
      },
      sort: (e, ui) => {
      },
      update: (e, ui) => {
        let sourceModel = ui.item.sortable.model;
        if (!ui.item.sortable.received && ui.item.sortable.droptarget) {
          let sourceTarget = ui.item.sortable.source[0];
          let dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded != DestinationDivAdded) {
            if (SourceDivAdded == false && DestinationDivAdded == true) {
              vm.MISCommonReportDetailsForm.$setDirty();
              vm.MISCommonReportDetailsForm.AddedFieldList.$dirty = true;
              return;
            }
            else if (SourceDivAdded == true && DestinationDivAdded == false) {
              vm.MISCommonReportDetailsForm.$setDirty();
              vm.MISCommonReportDetailsForm.AddedFieldList.$dirty = true;
              return;
            }
          }
          else if (sourceTarget.id == 'AddedFieldList' && dropTarget.id == 'AddedFieldList') {
            vm.MISCommonReportDetailsForm.$setDirty();
            vm.MISCommonReportDetailsForm.AddedFieldList.$dirty = true;
            return;
          }
        }
      },
      stop: (e, ui) => {
        vm.AssignedFieldList.map(function (item) {
          return item.selected = true;
        });
        vm.NotAssignedFieldList.map(function (item) {
          return item.selected = false;
        });
      },
      connectWith: '.items-container'
    });
    //#endregion

    // Reorder list of Not selected Fields
    let reorderFieldsList = () => {
      vm.NotAssignedFieldList = _.sortBy(vm.NotAssignedFieldList, 'displayOrder');
    }

    // Refresh Fields
    vm.refreshFields = () => {
      UnSelectAllFields();
      vm.SearchAssignedFieldList = null;
      vm.SearchNotAssignedFieldList = null;

      vm.AssignedFieldList = _.filter(vm.AssignedFieldList, (item) => {
        return item.selected == true;
      });
      vm.NotAssignedFieldList = _.filter(vm.NotAssignedFieldList, (item) => {
        return item.selected == false;
      });

      // call methods for sorting data
      reorderFieldsList();
    }


    vm.searchFieldsFromNotAssignedList = () => {
      UnSelectAllFields();
      if (vm.SearchNotAssignedFieldList) {
        vm.NotAssignedFieldList = vm.fieldsList.filter((item) => { return item.selected == false && (item.displayName ? item.displayName.toLowerCase().includes(vm.SearchNotAssignedFieldList.toLowerCase()) : false) });
      }
      else {
        vm.NotAssignedFieldList = vm.fieldsList.filter((item) => { return item.selected == false });
      }
      reorderFieldsList();
    }

    vm.searchFieldsFromAssignedList = () => {
      UnSelectAllFields();
      if (vm.SearchAssignedFieldList) {
        vm.AssignedFieldList = vm.fieldsList.filter((item) => { return item.selected == true && (item.displayName ? item.displayName.toLowerCase().includes(vm.SearchAssignedFieldList.toLowerCase()) : false) });
      }
      else {
        vm.AssignedFieldList = vm.fieldsList.filter((item) => { return item.selected == true });
      }
      reorderFieldsList();
    }

    /* open popup to add filter condition */
    vm.addCondition = function ($event) {
      var data = {
        axisList: vm.fieldsList,
        filterData: _.cloneDeep(vm.miscommonreport.Filter)
      };

      DialogFactory.dialogService(
        CORE.WIDGET_FILTER_MODAL_CONTROLLER,
        CORE.WIDGET_FILTER_MODAL_VIEW,
        $event,
        data).then((response) => {
          if (response.filterdata) {
            vm.miscommonreport.Filter = response.filterdata;
            DisplayExpression(vm.miscommonreport.Filter);
            if ($scope.expressionui) {
              /* manually set form dirty */
              vm.MISCommonReportDetailsForm.$setDirty();
              vm.MISCommonReportDetailsForm.ReportName.$dirty = true;
            }
          }
        }, (response) => {
          /* empty */
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };

    function DisplayExpression(data) {
      $scope.expressionui = "";
      groupCount = 0;
      count = 0;
      sublevelCount = 0;
      _.each(data, function (group) {
        if (group.Nodes.length > 0) {
          DisplaySubExpression(group);
        }
      });
      if (sublevelCount > 0) {
        for (var o = 0; o < sublevelCount; o++) {
          $scope.expressionui += ' ) ';
        }
      }
    };

    function DisplaySubExpression(group) {
      _.each(group.Nodes, function (node, index) {

        if (index > 0 && group.Condition) {
          $scope.expressionui += ' ' + '<span style="color:red;">' + (node.Condition || group.Condition) + '</span>';
        }
        if (node.Selected) {
          if (groupCount > 0 && count !== groupCount) {
            count = groupCount;
            $scope.expressionui += ' ( ';
          }
          if (node.Selected.OptionType == vm.OptionTypeArr[0]) {
            var valText = "";
            if (vm.datatypes.NUMBER.indexOf(node.datatype) != -1) {
              valText = node.OperatorValue != null ? node.OperatorValue : "";
            }
            else if (vm.datatypes.STRING.indexOf(node.datatype) != -1) {
              valText = node.OperatorValue != null ? stringFormat("'{0}'", node.OperatorValue) : "";
            }
            else if (vm.datatypes.DATE.indexOf(node.datatype) != -1) {
              valText = node.OperatorValue != null ? stringFormat("'{0}'", $filter('date')(new Date(node.OperatorValue), vm.DefaultDateFormat)) : "";
            }
            else if (vm.datatypes.TIME.indexOf(node.datatype) != -1) {
              valText = node.OperatorValue != null ? stringFormat("'{0}'", node.OperatorValue) : "";
            }
            else {
              valText = node.Selected.BooleanVal != null ? node.Selected.BooleanVal.Name : "";
            }
            $scope.expressionui += ' ' + node.Selected.FieldName.displayName + ' ' + node.Selected.Operator.Value + ' ' + valText;
          }
          if (node.Selected.OptionType == vm.OptionTypeArr[1]) {
            $scope.expressionui += ' ( ' + node.Selected.SelectedExpression.Expression + ' ' + node.Selected.Operator.Value + ' ' + node.OperatorValue + ' ) ';
          }
        }
        if (groupCount > 0 && group.ParentGroupLevel != null && index == group.Nodes.length - 1) {
          if (group.SubLevel == 1) {
            $scope.expressionui += ' ) ';
          }
          if (group.SubLevel > 1) {
            //console.log(group.SubLevel);
            sublevelCount++;
          }
        }
        if (node.Nodes && node.Nodes.length > 0) {
          groupCount++;
          DisplaySubExpression(node);
        }
      });
    };

    vm.clearCondition = function () {
      vm.miscommonreport.Filter = null;
      $scope.expressionui = null;
      /* manually set form dirty */
      vm.MISCommonReportDetailsForm.$setDirty();
      vm.MISCommonReportDetailsForm.ReportName.$dirty = true;
    };

    if (data && data.misReportFilterDetails) {
      let FilterData = null;
      vm.miscommonreport = angular.copy(data.misReportFilterDetails);
      oldReportName = angular.copy(vm.miscommonreport.ReportName);
      if (data.misReportFilterDetails.Filter) {
        FilterData = JSON.parse(data.misReportFilterDetails.Filter);
        vm.miscommonreport.Filter = FilterData;
      }
      DisplayExpression(vm.miscommonreport.Filter);
    }
    else {
      vm.miscommonreport.ReportType = vm.MISCommonReportType.Detail;
    }

    vm.selectAllFields = () => {
      vm.AllFieldsSelected = !vm.AllFieldsSelected;
      if (vm.AllFieldsSelected) {
        _.each(vm.fieldsList, (field) => { field.selected = true; });
      }
      else {
        _.each(vm.fieldsList, (field) => { field.selected = false; });
      }
      /* manually set form dirty */
      vm.MISCommonReportDetailsForm.$setDirty();
      vm.MISCommonReportDetailsForm.ReportName.$dirty = true;
    }

    vm.setAllFieldsSelectedDisplayText = () => {
      let selectionCount = _.countBy(vm.fieldsList, (field) => { return field.selected == true; });
      vm.AllFieldsSelected = selectionCount && selectionCount.true == vm.fieldsList.length ? true : false;
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.MISCommonReportDetailsForm);
      if (isdirty) {
        let data = {
          form: vm.MISCommonReportDetailsForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //Set as current form when page loaded
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.MISCommonReportDetailsForm);
    });

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    /* check duplicate mis report name */
    vm.checkDuplicateReportName = () => {
      if (oldReportName != vm.miscommonreport.ReportName) {
        if (vm.MISCommonReportDetailsForm && vm.MISCommonReportDetailsForm.ReportName.$dirty && vm.miscommonreport.ReportName) {
          vm.cgBusyLoading = DynamicReportMstFactory.checkDuplicateReportName().save({
            ID: vm.miscommonreport && vm.miscommonreport.ID ? vm.miscommonreport.ID : null,
            ReportName: vm.miscommonreport.ReportName
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldReportName = angular.copy(vm.miscommonreport.ReportName);
            if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateReportName) {
              oldReportName = '';
              let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
              messageContent.message = stringFormat(messageContent.message, "Report name");
              let obj = {
                messageContent: messageContent,
                multiple: true
              };
              vm.miscommonreport.ReportName = null;
              DialogFactory.messageAlertDialog(obj).then((okResp) => {
                angular.element(document.querySelector('#ReportName')).focus();
              });
            }

          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
    }

    // go to report data source list page
    vm.goDataSourceList = () => {
      BaseService.goToDataSourceList();
    }

  }
})();

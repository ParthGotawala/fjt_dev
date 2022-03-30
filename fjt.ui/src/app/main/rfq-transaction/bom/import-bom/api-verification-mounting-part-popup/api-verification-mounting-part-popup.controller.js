(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('APIVerificationMountPartController', APIVerificationMountPartController);

  /** @ngInject */
  function APIVerificationMountPartController($mdDialog, $scope, $timeout, $filter, $q, CORE, RFQTRANSACTION, USER,
    data, BaseService, DialogFactory, ComponentFactory, RFQSettingFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isHideDelete = true;
    vm.isdirty = false;
    vm.CORE = CORE;
    vm.cancel = () => {
      if (vm.isdirty) {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            BaseService.currentPageFlagForm.pop();
            $mdDialog.cancel();
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        BaseService.currentPageFlagForm.pop();
        $mdDialog.cancel();
      }
    };

    //paging details for grid
    vm.pagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [['id', 'ASC']],
      SearchColumns: [],
    };
    vm.isdirty = false;
    //set grid option for action with ui grid
    vm.gridOptions = {
      showColumnFooter: false,
      showGridFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: true,
      enablePaging: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Part Attribute Mapping List.csv',
      exporterMenuCsv: true,
      enableGrouping: false,
      enableGridMenu: false,
      enableSorting: false,
      enableCellEdit: false,
      enableFiltering: false,
    };

    //set header for ui grid
    function loadsource() {
      vm.sourceHeader = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          allowCellFocus: false,
          enableHiding: false,
          enableFiltering: false,
          enableSorting: false,
          maxWidth: '70',
        },
        {
          field: 'mfgName',
          displayName: 'MFR',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '300',
          enableFiltering: false,
          enableSorting: false,
          cellEditableCondition: false,
          enableCellEditOnFocus: false,
          enableHiding: false,
          maxWidth: '350',
        },
        {
          field: 'mfgPN',
          displayName: 'Part#',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.id" \
                                        label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        is-custom-part="row.entity.isCustom"\
                                        rohs-icon="row.entity.rfq_rohsmst.rohsIcon" \
                                        rohs-status="row.entity.rfq_rohsmst.name" \
                                        is-search-digi-key="true"  \
                                        is-search-findchip="true"></common-pid-code-label-link></div>',
          // cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          enableCellEdit: false,
          enableSorting: false,
          enableHiding: false,
          ColumnDataType: 'Number',
          enableFiltering: false,
          maxWidth: '350',
        },
        {
          field: 'category',
          displayName: 'Category',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >Component</div>',
          width: '150',
          enableFiltering: false,
          enableSorting: false,
          cellEditableCondition: false,
          enableCellEditOnFocus: false,
          enableHiding: false,
          maxWidth: '150',
        },
        {
          field: 'mountingTypeText',
          displayName: 'Mounting Type' + CORE.Modify_Grid_column_Allow_Change_Message,
          headerCellTemplate: '<div class="ui-grid-cell-contents">Mounting Type<md-button class="md-primary md-raised" ng-click="grid.appScope.$parent.vm.addMountingType($event)">Add Mounting Type</md-button></div>',
          // headerCellTemplate: '<div class="ui-grid-cell-contents"><span class="underline" ng-click="grid.appScope.$parent.vm.gotoMountingType()">Mounting Type</span></div>',
          cellTemplate: '<div style="overflow: hidden" ng-disabled="row.entity.LeadTime" class="ui-grid-cell-contents" ng-class="{\'api-bom-error\':row.entity.mountingTypeID==-1}">{{COL_FIELD}}<i class="ui-grid-icon-angle-down" aria-hidden="true" ng-if="row.entity.mountingTypeID==-1"></i></div>',
          width: '350',
          editableCellTemplate: "<div  style=\"height:100% !important;width:100% !important\" ><form name=\"inputForm\" style=\"height:100% !important;width:100% !important\"><select id='ddlAsswmbly_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}' ng-class=\"'colt' + col.uid\" ui-grid-edit-dropdown ng-model=\"MODEL_COL_FIELD\" ng-options=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray\" ng-change=\"grid.appScope.$parent.vm.changeinValue()\"   style=\"height:100% !important;width:100% !important\" class='form-control'></select></form></div>",
          editDropdownIdLabel: 'name',
          editDropdownValueLabel: 'name',
          editDropdownOptionsArray: vm.mountingTypeList,
          enableCellEdit: true,
          cellEditableCondition: cellEditableMount,
          enableHiding: false,
          enableFiltering: false,
          enableSorting: false,
          maxWidth: '350',
        },
        {
          field: 'functionalCategoryText',
          displayName: 'Functional Type' + CORE.Modify_Grid_column_Allow_Change_Message,
          headerCellTemplate: '<div class="ui-grid-cell-contents">Functional Type<md-button class="md-primary md-raised" ng-click="grid.appScope.$parent.vm.addFunctionalType($event)">Add Functional Type</md-button></div>',
          //headerCellTemplate: '<div class="ui-grid-cell-contents"><span class="underline" ng-click="grid.appScope.$parent.vm.gotoFunctionalType()">Functional Type</span></div>',
          cellTemplate: '<div style="overflow: hidden" ng-disabled="row.entity.LeadTime" class="ui-grid-cell-contents" ng-class="{\'api-bom-error\':row.entity.functionalCategoryID==-1}">{{COL_FIELD}}<i class="ui-grid-icon-angle-down" aria-hidden="true" ng-if="row.entity.functionalCategoryID==-1"></i></div>',
          width: '350',
          editableCellTemplate: "<div  style=\"height:100% !important;width:100% !important\" ><form name=\"inputForm\" style=\"height:100% !important;width:100% !important\"><select id='ddlAsswmbly_{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}' ng-class=\"'colt' + col.uid\" ui-grid-edit-dropdown ng-model=\"MODEL_COL_FIELD\" ng-options=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray\" ng-change=\"grid.appScope.$parent.vm.changeinValue()\"   style=\"height:100% !important;width:100% !important\" class='form-control'></select></form></div>",
          editDropdownIdLabel: 'partTypeName',
          editDropdownValueLabel: 'partTypeName',
          editDropdownOptionsArray: vm.functionalTypeList,
          enableCellEdit: true,
          cellEditableCondition: cellEditableFunctional,
          enableHiding: false,
          enableFiltering: false,
          enableSorting: false,
          maxWidth: '350',
        },
      ];
    };


    var cellEditableMount = function ($scope) {
      if ($scope.row.entity.mountingTypeID === -1)
        return true;
      else
        return false;
    }
    var cellEditableFunctional = function ($scope) {
      if ($scope.row.entity.functionalCategoryID === -1)
        return true;
      else
        return false;
    }
    //get list of component having none mount and part types
    vm.loadData = () => {
      let rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.cgBusyLoading = ComponentFactory.getNoneMountComponent().query({ components: data }).$promise.then((complist) => {
        _.each(complist.data.componentList, (comp) => {
          comp.rfq_rohsmst.rohsIcon = stringFormat("{0}{1}", rohsImagePath, comp.rfq_rohsmst.rohsIcon);
          comp.mfgName = stringFormat("({0}) {1}", comp.mfgCodemst.mfgCode, comp.mfgCodemst.mfgName);
          var functional = _.find(vm.functionalTypeList, (ftype) => { return ftype.id == comp.functionalCategoryID });
          var mounting = _.find(vm.mountingTypeList, (mtype) => { return mtype.id == comp.mountingTypeID });
          if (functional) {
            comp.partTypeName = functional.partTypeName;
            comp.functionalCategoryText = functional.partTypeName;
          }
          if (mounting) {
            comp.name = mounting.name;
            comp.mountingTypeText = mounting.name;
          }
        });
        vm.sourceData = complist.data.componentList;
        vm.totalSourceDataCount = vm.currentdata = complist.data.componentList.length;
        if (vm.totalSourceDataCount == 0) {
          vm.isNoDataFound = true;
          vm.emptyState = null;
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          $timeout(() => {
            celledit();
          }, true)
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      });
    }
    //it will use for infinite scroll and concate data 
    vm.getDataDown = () => {

    };
    // add mounting type 

    vm.addMountingType = (ev) => {
      var data = {
        isEdit: true,
        aliasText: "",
        refTableName: CORE.TABLE_NAME.RFQ_MOUNTINGTYPE,
        isMaster: false
      };
      let popUpData = { popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE], pageNameAccessLabel: CORE.PageName.mounting_type };
      let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          CORE.MANAGE_MOUNTING_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_MOUNTING_TYPE_MODAL_VIEW,
          ev,
          data).then((result) => {
            if (result) {
              getMountingType(true);
            }
          }, (error) => {
            return BaseService.getErrorLog(error);
          });
      }
    }

    //add functional type
    vm.addFunctionalType = (ev) => {
      var data = {
        isEdit: true,
        refTableName: CORE.TABLE_NAME.RFQ_PARTTYPE,
        aliasText: "",
        isMaster: false
      };
      DialogFactory.dialogService(
        CORE.MANAGE_PART_TYPE_MODAL_CONTROLLER,
        CORE.MANAGE_PART_TYPE_MODAL_VIEW,
        ev,
        data).then((data) => {
          if (data) {
            getFunctionalType(true)
          }
        },
          (err) => {
          });
    }
    // call function to save part types and mount type
    function celledit() {
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newvalue, oldvalue) {
        if (colDef.name == "mountingTypeText" || colDef.name == "functionalCategoryText") {
          vm.changeinValue();
        }
      });
      vm.gridOptions.gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef, newvalue, oldvalue) {
        var functional = _.find(vm.functionalTypeList, (ftype) => { return ftype.id == rowEntity.functionalCategoryID });
        var mounting = _.find(vm.mountingTypeList, (mtype) => { return mtype.id == rowEntity.mountingTypeID });
        if (functional)
          rowEntity.partTypeName = functional.partTypeName;
        if (mounting)
          rowEntity.name = mounting.name;
      });
      if (vm.sourceData.length > 0)
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[0], vm.gridOptions.columnDefs[0]);
    }
    //get functional type list
    function getFunctionalType(isAddnew) {
      return RFQSettingFactory.getPartTypeList().query().$promise.then((parttype) => {
        vm.functionalTypeList = parttype.data;
        if (isAddnew) {
          vm.gridOptions.columnDefs[5].editDropdownOptionsArray = vm.functionalTypeList;
        }
        return parttype.data;
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }
    //get mounting type list
    function getMountingType(isAddnew) {
      return ComponentFactory.getMountingTypeList().query().$promise.then((mount) => {
        vm.mountingTypeList = mount.data;
        if (isAddnew) {
          vm.gridOptions.columnDefs[4].editDropdownOptionsArray = vm.mountingTypeList;
        }
        return mount.data;
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }
    var autocompletePromise = [getMountingType(), getFunctionalType()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      loadsource();
      vm.isshowDetail = true;
    });
    //update component mount and part types
    vm.savecomponent = () => {
      var componentList = [];
      _.each(vm.sourceData, (item) => {
        var objmount = _.find(vm.mountingTypeList, (mount) => { return mount.name == item.mountingTypeText });
        //if (objmount)
        var objpart = _.find(vm.functionalTypeList, (part) => { return part.partTypeName == item.functionalCategoryText });
        var component = {
          id: item.id,
          functionalCategoryID: objpart ? objpart.id : item.functionalCategoryID,
          mountingTypeID: objmount ? objmount.id : null,
          mountingTypeText: item.mountingTypeText,
          functionalCategoryText: item.functionalCategoryText
        }
        componentList.push(component);
      });
      vm.cgBusyLoading = ComponentFactory.saveNoneMountComponent().query({ componentList: componentList }).$promise.then((saveCompo) => {
        if (saveCompo) {
          BaseService.currentPageFlagForm.pop();
          $mdDialog.cancel();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //check list update or not
    vm.changeinValue = () => {
      vm.isdirty = true;
    }

    //on load submit form 
    angular.element(() => {
      BaseService.currentPageFlagForm.push(vm.isdirty);
    });
  }
})();

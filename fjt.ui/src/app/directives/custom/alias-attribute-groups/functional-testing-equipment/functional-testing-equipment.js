(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('functionalTestingEquipment', functionalTestingEquipment);

  /** @ngInject */
  function functionalTestingEquipment(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=?',
        mfgType: '=?',
        partDetail: '=?',
        rohsList: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/functional-testing-equipment/functional-testing-equipment.html',
      controller: functionalTestingEquipmentCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of packagingPartsListCtrl
    *
    * @param
    */
    function functionalTestingEquipmentCtrl($scope, $element, $attrs, $timeout, $state, RFQTRANSACTION, DialogFactory, $q) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $scope.componentId;
      vm.partDetail = $scope.partDetail;
      vm.RohsList = $scope.rohsList;
      vm.mfgType = $scope.mfgType;
      vm.IsSupplier = vm.mfgType && vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? true : false;
      vm.addPackagingAliasPartLabel = stringFormat(CORE.ADD_ALIAS_PART, '');
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      vm.PackagingPartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PACKAGINGPART;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.EmptyMesssage = {};
      vm.FunctionalTestingEquipmentEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FUNCTIONAL_TESTING_FUNCTIONAL_PART;

      const onAddDeleteFunTestEquipment = $scope.$on(CORE.EventName.onAddDeleteFunTestEquipment, () => {
        BaseService.reloadUIGrid(vm.gridOptionsFTE, vm.pagingInfoFTE, iniFTEPageInfo, vm.loadDataFTE);
      });

      const getComponentFunctionalTestingEquipmentDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_FUNCTIONAL_TESTING_EQUIPMENT_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.assetName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              saveComponentFunctionalTestingEquipment(item);
            }
          }, () => {
            // Cancel
          });
        }
      };

      function getFunctionalTestingEquipmentSearch(searchObj) {
        searchObj.currentPartId = vm.cid;
        return ComponentFactory.getComponentFunctionalTestingEquipmentSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            if (searchObj.eqpID) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /* save  component alternate detail into database */
      function saveComponentFunctionalTestingEquipment(item) {
        const componentInfo = {
          eqpID: item.eqpID,
          componentID: vm.cid
        };
        ComponentFactory.createComponentFunctionalTestingEquipment().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName, null);
            $scope.$emit(CORE.EventName.onAddDeleteFunTestEquipment);
          }
          else {
            $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      vm.autoCompleteRequireFunctionalTestingEquipmentsAlias = {
        columnName: 'assetName',
        keyColumnName: 'eqpID',
        controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
        keyColumnId: null,
        inputName: 'Equipment',
        placeholderName: 'Search text or Add',
        isRequired: false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
          pageNameAccessLabel: CORE.PageName.equipments
        },
        callbackFn: function (obj) {
          if (obj.status === CORE.ApiResponseTypeStatus.SUCCESS && obj.data && obj.data.equipmentData) {
            const searchObj = {
              eqpID: obj.data.equipmentData.eqpID,
              query: obj.data.equipmentData.assetName,
              inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
            };
            return getFunctionalTestingEquipmentSearch(searchObj);
          } else {
            const searchObj = {
              eqpID: obj.eqpID,
              query: obj.assetName,
              inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
            };
            return getFunctionalTestingEquipmentSearch(searchObj);
          }
        },
        isAddnew: true,
        onSelectCallbackFn: getComponentFunctionalTestingEquipmentDetail,
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
          };
          return getFunctionalTestingEquipmentSearch(searchObj);
        }
      };
      vm.FTENotFound = false;
      vm.isHideDelete = true;
      vm.sourceHeaderFTE = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoFTE.pageSize * (grid.appScope.$parent.vm.pagingInfoFTE.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        }, {
          field: 'assetName',
          displayName: 'Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.eqpID > 0"\
                                  ng-click="grid.appScope.$parent.vm.goToEquipment(row.entity.eqpID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.eqpID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          width: '200'
        },
        {
          field: 'eqpMake',
          displayName: 'Make',
          width: '250'
        }, {
          field: 'eqpModel',
          displayName: 'Model',
          width: '130'
        }, {
          field: 'eqpYear',
          displayName: 'Year',
          width: '100'
        }
      ];

      const iniFTEPageInfo = () => {
        vm.pagingInfoFTE = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };
      vm.pagingInfoFTE = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsFTE = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoFTE.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Functional Testing Equipment.csv',
        hideFilter: true
      };

      /* retrieve work order serials list */
      vm.loadDataFTE = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoFTE, vm.gridOptionsFTE);
        if (vm.pagingInfoFTE.SortColumns.length === 0) {
          vm.pagingInfoFTE.SortColumns = [['assetName', 'ASC']];
          vm.pagingInfoFTE.type = vm.ComponentAlternatePartType;
        }
        vm.pagingInfoFTE.id = vm.cid ? vm.cid : null;
        vm.cgBusyLoading = ComponentFactory.getFunctionaltestingEquipmentGridList().query(vm.pagingInfoFTE).$promise.then((response) => {
          vm.FTENotFound = true;
          vm.sourceDataFTE = response.data.functionalTestingEquipmentList;
          vm.totalSourceDataCountFTE = response.data.Count;

          if (!vm.gridOptionsFTE.enablePaging) {
            vm.currentdataFTE = vm.sourceDataFTE.length;
            vm.gridOptionsFTE.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsFTE.clearSelectedRows();
          if (vm.totalSourceDataCountFTE === 0) {
            if (vm.pagingInfoFTE.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.FTENotFound = false;
              vm.emptyStateFTE = 0;
            }
            else {
              vm.FTENotFound = true;
              vm.emptyStateFTE = null;
            }
          }
          else {
            vm.FTENotFound = false;
            vm.emptyStateFTE = null;
          }

          if (!vm.gridOptionsFTE.enablePaging) {
            vm.currentdataFTE = vm.sourceDataFTE.length;
          }

          $timeout(() => {
            vm.resetSourceGridFTE();
            return vm.gridOptionsFTE.gridApi.infiniteScroll.dataLoaded(false, false);
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDownFTE = () => {
        vm.pagingInfoFTE.Page = vm.pagingInfoFTE.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getFunctionaltestingEquipmentGridList().query(vm.pagingInfoFTE).$promise.then((response) => {
          vm.sourceDataFTE = vm.gridOptionsFTE.data = vm.gridOptionsFTE.data.concat(response.data.functionalTestingEquipmentList);
          vm.currentdataFTE = vm.gridOptionsFTE.currentItem = vm.gridOptionsFTE.data.length;
          vm.gridOptionsFTE.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            if (!vm.gridOptionsFTE.enablePaging && vm.totalSourceDataCountFTE === vm.currentdataFTE) {
              return vm.gridOptionsFTE.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountFTE !== vm.currentdataFTE ? true : false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.goToEquipment = (equipmentId) => {
        BaseService.goToManageEquipmentWorkstation(equipmentId);
      };
      vm.editManufacturer = (mfgType, mfgcodeID) => {
        if (mfgType === CORE.MFG_TYPE.DIST) {
          BaseService.goToSupplierDetail(mfgcodeID);
        }
        else {
          BaseService.goToManufacturer(mfgcodeID);
        }
      };

      /* Open popup for display history of entry change */
      vm.showVersionHistory = (row, componentId, ev) => {
        BaseService.showVersionHistory(row, componentId, ev);
      };

      $scope.$on('$destroy', () => {
        onAddDeleteFunTestEquipment();
      });
    }
  }
})();

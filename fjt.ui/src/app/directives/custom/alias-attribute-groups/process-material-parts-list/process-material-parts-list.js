(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('processMaterialPartsList', processMaterialPartsList);

  /** @ngInject */
  function processMaterialPartsList(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
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
      templateUrl: 'app/directives/custom/alias-attribute-groups/process-material-parts-list/process-material-parts-list.html',
      controller: processMaterialPartsListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of driveToolPartsListCtrl
    *
    * @param
    */
    function processMaterialPartsListCtrl($scope, $element, $attrs, $timeout, $state, RFQTRANSACTION, DialogFactory) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $scope.componentId;
      vm.partDetail = $scope.partDetail;
      vm.RohsList = $scope.rohsList;
      vm.mfgType = $scope.mfgType;
      vm.IsSupplier = vm.mfgType && vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? true : false;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      vm.ProcessMaterialPartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PROCESS_MATERIAL_PART;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.EmptyMesssage = {};

      const onAddDeleteProcessMaterial = $scope.$on(CORE.EventName.onAddDeleteProcessMaterial, () => {
        BaseService.reloadUIGrid(vm.gridOptionsPM, vm.pagingInfoPM, iniPMPageInfo, vm.loadDataPM);
      });

      // when item selected from process Material auto complete
      const getComponentProcessMaterialDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PROCESS_MATERIAL_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentProcessMaterial = item;
              saveProcessMaterial();
              setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
            }
          }, () => {
            setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
          });
        }
      };
      //Save Process Material
      function saveProcessMaterial() {
        const componentInfo = {
          refComponentID: vm.cid,
          componentID: $scope.ComponentProcessMaterial.id
        };
        return ComponentFactory.createComponentProcessMaterial().save({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$emit(CORE.EventName.onAddDeleteProcessMaterial);
          }
          else {
            $scope.$broadcast(vm.autoCompleteProcessMaterial.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      function getAliasSearch(searchObj) {
        searchObj.currentPartId = vm.cid;
        return ComponentFactory.getComponentMFGAliasPartsSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            _.each(componentAlias.data.data, (item) => {
              item.isIcon = true;
            });
            if (searchObj.id) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.autoCompleteProcessMaterial = {
        columnName: 'mfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: null,
        inputName: 'ProcessMaterial',
        placeholderName: 'Search text or Add',
        isRequired: false,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          isBadPart: vm.PartCorrectList.CorrectPart
        },
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            categoryID: vm.partDetail.category,
            inputName: vm.autoCompleteProcessMaterial.inputName,
            processMaterialPartFilter: true
          };
          return getAliasSearch(searchObj);
        },
        onSelectCallbackFn: getComponentProcessMaterialDetail,
        onSearchFn: function (query) {
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            query: query,
            categoryID: vm.partDetail.category,
            inputName: vm.autoCompleteProcessMaterial.inputName,
            processMaterialPartFilter: true
          };
          return getAliasSearch(searchObj);
        }
      };

      // start component Drive tools alias region
      vm.PMNotFound = false;
      vm.isHideDelete = true;
      const iniPMPageInfo = () => {
        vm.pagingInfoPM = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };

      vm.sourceHeaderPM = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoPM.pageSize * (grid.appScope.$parent.vm.pagingInfoPM.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfgCode',
          displayName: vm.LabelConstant.MFG.MFG,
          width: 200,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-if="row.entity.mfgcodeID > 0"\
                                  ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                                  tabindex="-1">{{COL_FIELD}}</a>\
                              <span ng-if="row.entity.mfgcodeID <= 0">{{COL_FIELD}}</span>\
                          </div>',
          allowCellFocus: false
        },
        {
          field: 'mfgPN',
          displayName: vm.mfgLabelConstant.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.ID"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsName"\
                                             is-supplier="false"\
                      </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          enableCellEdit: false
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Part#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.id"\
                                                         value="COL_FIELD"\
                                                         is-copy="true"\
                                                         rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                         rohs-status="row.entity.rohsComplientConvertedValue"\
                                                         is-supplier="false"\
                                                         is-assembly="true"> \
                                  </common-pid-code-label-link> \
                            </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'rev',
          width: '95',
          displayName: 'Revision',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'PIDCode',
          displayName: 'PID Code',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.id"\
                                                         label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                                         value="COL_FIELD"\
                                                         is-good-part="row.entity.isGoodPart" \
                                                         is-search-findchip="false"\
                                                         is-search-digi-key="false"\
                                                         is-custom-part="row.entity.isCustom"\
                                                         restrict-use-permanently="row.entity.restrictUsePermanently" \
                                                         restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                                         restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                                         restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                                         is-copy="true"\
                                                         is-supplier="false"\
                                                         is-assembly="true"> \
                                  </common-pid-code-label-link> \
                            </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'liveVersion',
          width: '110',
          displayName: 'Internal Revision',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="!COL_FIELD">{{COL_FIELD}}</div> \
                        <div class="ui-grid-cell-contents text-left" ng-if="COL_FIELD" \
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.id,$event)"><a>{{COL_FIELD}}</a></div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'mfgPNDescription',
          width: 250,
          displayName: vm.LabelConstant.MFG.MFGPNDescription,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'functionalTypeExternal',
          displayName: 'Functional Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'functionalTypeInternal',
          displayName: 'Functional Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'mountingTypeExternal',
          displayName: 'Mounting Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'mountingTypeInternal',
          displayName: 'Mounting Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'feature',
          displayName: 'Feature',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'isEpoxyMount',
          displayName: 'Epoxy Mount',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                  ng-class="{\'label-success\':row.entity.isEpoxyMount === \'Yes\', \
                  \'label-warning\':row.entity.isEpoxyMount === \'No\'}"> \
                  {{ COL_FIELD }}'
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
          field: 'partPackage',
          displayName: 'Package/Case (Shape)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'operatingTemp',
          displayName: 'Operating Temperature',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'minOperatingTemp',
          displayName: 'Min Operating Temp',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'maxOperatingTemp',
          displayName: 'Max Operating Temp',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'temperatureCoefficient',
          displayName: 'Temperature Coefficient',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'temperatureCoefficientValue',
          displayName: 'Temperature Coefficient Value',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'temperatureCoefficientUnit',
          displayName: 'Temperature Coefficient Unit',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'connectorTypeText',
          width: 120,
          displayName: 'Connector Type (External)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'connecterTypeName',
          width: 120,
          displayName: 'Connector Type (Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'cm-input-color-red\' :row.entity.connecterTypeID==-1}">{{COL_FIELD}}</div>'
        },
        {
          field: 'noOfPositionText',
          displayName: vm.LabelConstant.MFG.noOfPositionText,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'noOfPosition',
          width: 120,
          displayName: vm.LabelConstant.MFG.noOfPosition,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'noOfRowsText',
          displayName: 'No. of Rows (External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'noOfRows',
          width: 120,
          displayName: 'No. of Rows',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'pitch',
          width: 120,
          displayName: 'Pitch (Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'pitchMating',
          width: 150,
          displayName: 'Pitch Mating(Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'sizeDimension',
          width: 120,
          displayName: 'Size/Dimension',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'length',
          width: 120,
          displayName: 'Size/Dimension Length',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'width',
          width: 120,
          displayName: 'Size/Dimension Width',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'heightText',
          width: 120,
          displayName: 'Height - Seated (Max)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'height',
          width: 120,
          displayName: 'Height - Seated (Max) Height',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
        },
        {
          field: 'maxOperatingTemp',
          displayName: 'Max Operating Temp',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'tolerance',
          displayName: 'Tolerance',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'voltage',
          displayName: 'Voltage',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'values',
          displayName: 'Values',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'powerRating',
          displayName: 'Power(Watts)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'weight',
          displayName: 'Weight',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'color',
          width: 120,
          displayName: 'Color',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
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
        },
        {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];

      vm.pagingInfoPM = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsPM = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoPM.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Process Material Parts.csv',
        hideFilter: true
      };

      /* retrieve Process material Part list */
      vm.loadDataPM = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoPM, vm.gridOptionsPM);
        if (vm.pagingInfoPM.SortColumns.length === 0) {
          vm.pagingInfoPM.SortColumns = [['mfgPN', 'ASC']];
          vm.pagingInfoPM.type = vm.ComponentAlternatePartType;
        }
        vm.pagingInfoPM.id = vm.cid ? vm.cid : null;
        vm.cgBusyLoading = ComponentFactory.getProcessMaterialPartGridList().query(vm.pagingInfoPM).$promise.then((response) => {
          vm.PMNotFound = true;
          vm.sourceDataPM = response.data.processMaterialPartList;
          vm.totalSourceDataCountPM = response.data.Count;

          if (!vm.gridOptionsPM.enablePaging) {
            vm.currentdataPM = vm.sourceDataPM.length;
            vm.gridOptionsPM.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsPM.clearSelectedRows();
          if (vm.totalSourceDataCountPM === 0) {
            if (vm.pagingInfoPM.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.PMNotFound = false;
              vm.emptyStatePM = 0;
            }
            else {
              vm.PMNotFound = true;
              vm.emptyStatePM = null;
            }
          }
          else {
            vm.PMNotFound = false;
            vm.emptyStatePM = null;
          }

          if (!vm.gridOptionsPM.enablePaging) {
            vm.currentdataPM = vm.sourceDataPM.length;
          }

          $timeout(() => {
            vm.resetSourceGridPM();
            return vm.gridOptionsPM.gridApi.infiniteScroll.dataLoaded(false, false);
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDownPM = () => {
        vm.pagingInfoPM.Page = vm.pagingInfoPM.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getProcessMaterialPartGridList().query(vm.pagingInfoPM).$promise.then((response) => {
          vm.sourceDataPM = vm.gridOptionsPM.data = vm.gridOptionsPM.data.concat(response.data.processMaterialPartList);
          vm.currentdataPM = vm.gridOptionsPM.currentItem = vm.gridOptionsPM.data.length;
          vm.gridOptionsPM.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            if (!vm.gridOptionsPM.enablePaging && vm.totalSourceDataCountPM === vm.currentdataPM) {
              return vm.gridOptionsPM.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountPM !== vm.currentdataPM ? true : false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
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
        onAddDeleteProcessMaterial();
      });
    }
  }
})();

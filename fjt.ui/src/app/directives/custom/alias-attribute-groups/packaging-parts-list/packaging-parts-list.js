(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('packagingPartsList', packagingPartsList);

  /** @ngInject */
  function packagingPartsList(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
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
      templateUrl: 'app/directives/custom/alias-attribute-groups/packaging-parts-list/packaging-parts-list.html',
      controller: packagingPartsListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of packagingPartsListCtrl
    *
    * @param
    */
    function packagingPartsListCtrl($scope, $element, $attrs, $timeout, $state, RFQTRANSACTION, DialogFactory, $q) {
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

      const onAddDeletePackagingAliasPart= $scope.$on(CORE.EventName.onAddDeletePackagingAliasPart, () => {
        BaseService.reloadUIGrid(vm.gridOptionsPackagingPart, vm.pagingInfoPackagingPart, iniPackagingParttPageInfo, vm.loadDataPackagingPart);
      });

      const stateChangeSuccessCall = $scope.$on('$viewContentLoaded', () => {
        $timeout(() => {
          vm.addAliasPart = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowAddAliasParts);
        }, _configWOTimeout);
      });

      $timeout(() => {
        vm.addAliasPart = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowAddAliasParts);
      });

      // start component packaging alias region
      const getComponentPackagingAliasDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PACKING_ALIAS_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const validationPromise = [checkPackagingAliasValidations(item)];
              $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
                var res = _.find(responses, (response) => response === false);
                if (res !== false) {
                  $scope.ComponentPackagingAlias = item;
                  saveComponentPackagingAlias();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // Cancel
          });
        }
      };
      //Check on Add Alternate Parts
      function checkPackagingAliasValidations(item) {
        var componentObj = {
          toPartId: vm.cid,
          fromPartId: item.id,
          typeId: CORE.ComponentValidationPartType.PackagingAlias
        };
        return $scope.$parent.vm.cgBusyLoading = ComponentFactory.checkAlternateAliasValidations().query(componentObj).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            return true;
          }
          else {
            return false;
          }
        }).catch(() => false);
      }
      /* save  component packaging detail into database */
      function saveComponentPackagingAlias() {
        const componentInfo = {
          PID: $scope.ComponentPackagingAlias.PID,
          componetID: $scope.ComponentPackagingAlias.id,
          mfgPN: $scope.ComponentPackagingAlias.mfgPN,
          aliasgroupID: $scope.ComponentPackagingAlias.packaginggroupID,
          parentComponentID: vm.cid,
          parentPackaginggroupID: vm.partDetail.packaginggroupID
        };
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.createPackagingAlias().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            if (res.data && res.data.assemblyList) {
              DialogFactory.dialogService(
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
                null,
                res.data.assemblyList
              ).then(() => {
                // success
              }, () => {
                // calcel
              });
            }
            else {
              if (res.data.aliasgroupID) {
                vm.partDetail.packaginggroupID = res.data.aliasgroupID;
              }
              $scope.$emit(CORE.EventName.onAddDeletePackagingAliasPart);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      vm.autoCompletePackagingAlias = {
        columnName: 'mfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        inputName: 'Packaging Alias',
        placeholderName: 'Search text or Add',
        isRequired: false,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          parentId: vm.partDetail.mfgcodeID,
          isBadPart: vm.PartCorrectList.CorrectPart,
          functionalCategoryID: vm.partDetail.functionalCategoryID,
          mountingTypeID: vm.partDetail.mountingTypeID
        },
        callbackFn: function (obj) {
          var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
          const searchObj = {
            id: obj.id,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletePackagingAlias.inputName,
            rohsMainCategoryID: selectedRoHS.refMainCategoryID,
            isRohsMainCategoryInvertMatch: true,
            mountingTypeID: vm.partDetail.mountingTypeID,
            packagingAliasFilter: true
          };
          if (!vm.partDetail.isCustom) {
            searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
          }
          return getAliasSearch(searchObj);
        },
        onSelectCallbackFn: getComponentPackagingAliasDetail,
        onSearchFn: function (query) {
          var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
          const searchObj = {
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            query: query,
            inputName: vm.autoCompletePackagingAlias.inputName,
            rohsMainCategoryID: selectedRoHS.refMainCategoryID,
            isRohsMainCategoryInvertMatch: true,
            mountingTypeID: vm.partDetail.mountingTypeID,
            packagingAliasFilter: true
          };
          if (!vm.partDetail.isCustom) {
            searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
          }
          return getAliasSearch(searchObj);
        }
      };

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
      vm.PackagingPartNotFound = false;
      const iniPackagingParttPageInfo = () => {
        vm.pagingInfoPackagingPart = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };

      vm.sourceHeaderPackagingPart = [
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false,
          enableCellEdit: false
        },
        {
          field: 'mfrCode',
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
                                             is-supplier="false"\
                                             rohs-status = row.entity.rohsName\
                                             rohs-icon= grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon>\
                      </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'custAssyPN',
          width: '320',
          displayName: 'Part#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-class="{\'text-line-through\': (row.entity.restrictUsePermanently == true || row.entity.restrictUSEwithpermission == true) }">\
                              <common-pid-code-label-link component-id="row.entity.ID"\
                                                         value="COL_FIELD"\
                                                         is-copy="true"\
                                                         rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                         rohs-status="row.entity.rohsName"\
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
                              <common-pid-code-label-link component-id="row.entity.ID"\
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity, row.entity.ID,$event)"><a>{{COL_FIELD}}</a></div>',
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
          displayName: 'Connector Type(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
        },
        {
          field: 'connecterTypeInternal',
          displayName: 'Connector Type(Internal)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '200',
          enableCellEdit: false
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
          displayName: 'Pitch (Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'pitchMating',
          displayName: 'Pitch Mating(Unit in mm)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'sizeDimension',
          displayName: 'Size/Dimension',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'length',
          displayName: 'Length',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'width',
          displayName: 'Width',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'heightText',
          displayName: 'Height-Seated (Max)(External)',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'height',
          displayName: 'Height-Seated (Max)(Internal)',
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
          field: 'value',
          displayName: 'Value',
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
          displayName: 'Color',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false
        }
      ];

      vm.pagingInfoPackagingPart = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: []
      };
      vm.gridOptionsPackagingPart = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoPackagingPart.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'PackagingAliasParts.csv',
        hideFilter: true
      };

      /* retrieve packaging parts */
      vm.loadDataPackagingPart = () => {
        if (vm.pagingInfoPackagingPart.SortColumns.length === 0) {
          vm.pagingInfoPackagingPart.SortColumns = [['id', 'ASC']];
        }
        vm.pagingInfoPackagingPart.id = vm.cid;

        vm.cgBusyLoading = ComponentFactory.getComponentPackgingParts().query(vm.pagingInfoPackagingPart).$promise.then((response) => {
          vm.PackagingPartNotFound = true;

          vm.sourceDataPackagingPart = response.data.packagingParts;
          vm.totalPackagingPartSourceDataCount = response.data.Count;

          if (!vm.gridOptionsPackagingPart.enablePaging) {
            vm.currentdataPackagingPart = vm.sourceDataPackagingPart.length;
            vm.gridOptionsPackagingPart.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsPackagingPart.clearSelectedRows();
          if (vm.totalPackagingPartSourceDataCount === 0) {
            if (vm.pagingInfoPackagingPart.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.PackagingPartNotFound = false;
              vm.packagingPartEmptyState = 0;
            }
            else {
              vm.PackagingPartNotFound = true;
              vm.packagingPartEmptyState = null;
            }
          }
          else {
            vm.PackagingPartNotFound = false;
            vm.packagingPartEmptyState = null;
          }

          if (!vm.gridOptionsPackagingPart.enablePaging) {
            vm.currentdataPackagingPart = vm.sourceDataPackagingPart.length;
          }

          $timeout(() => {
            vm.resetSourceGridPackagingPart();
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getPackagingPartDataDown = () => {
        vm.pagingInfoPackagingPart.Page = vm.pagingInfoPackagingPart.Page + 1;
        vm.cgBusyLoading = ComponentFactory.getComponentPackgingParts().query(vm.pagingInfoPackagingPart).$promise.then((response) => {
          vm.sourceDataPackagingPart = vm.sourceDataPackagingPart.concat(response.data.packagingParts);
          vm.currentdataPackagingPart = vm.sourceDataPackagingPart ? vm.sourceDataPackagingPart.length : null;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGridPackagingPart();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalPackagingPartSourceDataCount !== vm.currentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.addPackagingAliasPart = (event) => {
        vm.partDetail.mfgCode = vm.partDetail.mfgCodemst ? vm.partDetail.mfgCodemst.mfgCode : null;
        vm.partDetail.manufacturerName = vm.partDetail.mfgCodemst ? vm.partDetail.mfgCodemst.mfgName : null;
        vm.partDetail.rohsComplientConvertedValue = vm.partDetail.rohsName;
        vm.partDetail.mfgType = vm.partDetail.mfgCodemst.mfgType;
        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_CONTROLLER,
          USER.ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_VIEW,
          event,
          vm.partDetail).then(() => {
            $scope.$emit(CORE.EventName.onAddDeletePackagingAliasPart);
          }, (data) => {
            if (data) {
              //  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
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
        onAddDeletePackagingAliasPart();
        stateChangeSuccessCall();
      });
    }
  }
})();

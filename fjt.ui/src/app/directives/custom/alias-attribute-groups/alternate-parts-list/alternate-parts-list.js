(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('alternatePartsList', alternatePartsList);

  /** @ngInject */
  function alternatePartsList(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '=?',
        mfgType: '=?',
        alternatePartType: '=?',
        partDetail: '=?',
        rohsList: '=?',
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/alias-attribute-groups/alternate-parts-list/alternate-parts-list.html',
      controller: alternatePartsListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of alternatePartsListCtrl
    *
    * @param
    */
    function alternatePartsListCtrl($scope, $element, $attrs, $timeout, $state, RFQTRANSACTION, DialogFactory, $q) {
      const onAddDeleteAlternatePart = $scope.$on(CORE.EventName.onAddDeleteAlternatePart, () => {
        BaseService.reloadUIGrid(vm.gridOptionsAP, vm.pagingInfoAP, initPageInfo, vm.loadDataAP);
      });

      const initPageInfo = () => {
        vm.pagingInfoAP = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [],
          SearchColumns: []
        };
      };

      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.cid = $scope.componentId;
      vm.partDetail = $scope.partDetail;
      vm.RohsList = $scope.rohsList;
      vm.mfgType = $scope.mfgType;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.partMasterAlternateGroupsTabs = USER.PartMasterAlternateGroupsTabs;
      vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
      vm.PossibleAlternatePartEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_POSSIBLE_ALTERNATEPART;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.isAlternatePartList = false;
      vm.mfgLabelConstant = CORE.LabelConstant.MFG;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.EmptyMesssage = {};
      vm.aliasName = '';
      const init = () => {
        vm.ComponentAlternatePartType = $scope.alternatePartType;
        vm.ComponentAlternatePartTypeDetail = CORE.ComponentAlternatePartType;

        switch (vm.ComponentAlternatePartType) {
          case CORE.ComponentAlternatePartType.AlternatePart:
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_ALTERNATE_PART;
            vm.aliasName = 'Alternate Part';
            vm.isAlternatePartList = true;
            break;
          case CORE.ComponentAlternatePartType.RoHSReplacementPart:
            vm.aliasName = 'RoHS Replacement Part';
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_ROHS_REPLACEMENT_PART;
            break;
          case CORE.ComponentAlternatePartType.MatingPartRequired:
            vm.aliasName = 'Require Mating Part';
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_REQUIRE_MATING_PART;
            break;
          case CORE.ComponentAlternatePartType.PickupPadRequired:
            vm.aliasName = 'Pickup Pad Part';
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PICKUP_PAD_PART;
            break;
          case CORE.ComponentAlternatePartType.ProgrammingRequired:
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_PROGRAM_PART;
            break;
          case CORE.ComponentAlternatePartType.FunctionaTestingRequired:
            vm.aliasName = 'Require Functional Tools Part';
            vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_REQUIRE_FUNCTIONAL_TESTING_PART;
            break;
          default:
        }


        /*---------------------------- [S] - Possible Alternate List ----------------------------*/
        if (vm.ComponentAlternatePartTypeDetail.AlternatePart === vm.ComponentAlternatePartType) {
          vm.PALNotFound = false;
          vm.sourceHeaderPAL = [
            {
              field: '#',
              width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
              cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoPAL.pageSize * (grid.appScope.$parent.vm.pagingInfoPAL.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
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
              field: 'partPackage',
              displayName: 'Package/Case (Shape)',
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
              field: 'feature',
              displayName: 'Feature',
              cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
              width: '120',
              enableCellEdit: false
            },
            {
              field: 'updatedAt',
              displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
              cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
              width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
              type: 'datetime',
              enableFiltering: false
            },
            {
              field: 'updatedby',
              displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
              cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
              width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
              type: 'StringEquals',
              enableFiltering: true
            },
            {
              field: 'updatedbyRole',
              displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
              cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
              width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
              type: 'StringEquals',
              enableFiltering: true
            },
            {
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

          vm.pagingInfoPAL = {
            Page: CORE.UIGrid.Page(),
            SortColumns: [],
            SearchColumns: []
          };

          vm.gridOptionsPAL = {
            enablePaging: isEnablePagination,
            enablePaginationControls: isEnablePagination,
            showColumnFooter: false,
            enableRowHeaderSelection: false,
            enableFullRowSelection: false,
            enableRowSelection: false,
            multiSelect: false,
            filterOptions: vm.pagingInfoPAL.SearchColumns,
            exporterMenuCsv: true,
            exporterCsvFilename: 'PossibleAlternateList.csv',
            hideFilter: true
          };

          /* retrieve work order serials list */
          vm.loadDataPAL = () => {
            BaseService.setPageSizeOfGrid(vm.pagingInfoPAL, vm.gridOptionsPAL);
            if (vm.pagingInfoPAL.SortColumns.length === 0) {
              vm.pagingInfoPAL.SortColumns = [['mfgPN', 'ASC']];
            }
            vm.pagingInfoPAL.id = vm.cid ? vm.cid : null;
            vm.cgBusyLoading = ComponentFactory.getComponentPossibleAlternetPartList().query(vm.pagingInfoPAL).$promise.then((possibleparts) => {
              vm.sourceDataPAL = possibleparts.data.possiblePartList;
              vm.totalSourceDataCountPAL = possibleparts.data.Count;

              if (!vm.gridOptionsPAL.enablePaging) {
                vm.currentdataPAL = vm.sourceDataPAL.length;
                vm.gridOptionsPAL.gridApi.infiniteScroll.resetScroll();
              }
              vm.gridOptionsPAL.clearSelectedRows();
              if (vm.totalSourceDataCountPAL === 0) {
                if (vm.pagingInfoPAL.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                  vm.PALNotFound = false;
                  vm.emptyStatePAL = 0;
                }
                else {
                  vm.PALNotFound = true;
                  vm.emptyStatePAL = null;
                }
              }
              else {
                vm.PALNotFound = false;
                vm.emptyStatePAL = null;
              }

              if (!vm.gridOptionsPAL.enablePaging) {
                vm.currentdataPAL = vm.sourceDataPAL.length;
              }

              $timeout(() => {
                vm.resetSourceGridPAL();
                if (!vm.gridOptionsPAL.enablePaging && vm.totalSourceDataCountPAL === vm.currentdataPAL) {
                  return vm.gridOptionsPAL.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              }, 1000);
            }).catch((error) => BaseService.getErrorLog(error));
          };
          vm.getDataDownPAL = () => {
            vm.pagingInfoPAL.Page = vm.pagingInfoPAL.Page + 1;
            vm.cgBusyLoading = ComponentFactory.getComponentPossibleAlternetPartList().query(vm.pagingInfoPAL).$promise.then((possibleparts) => {
              vm.sourceDataPAL = vm.gridOptionsPAL.data = vm.gridOptionsPAL.data.concat(possibleparts.data.possiblePartList);
              vm.currentdataPAL = vm.gridOptionsPAL.currentItem = vm.gridOptionsPAL.data.length;
              vm.totalSourceDataCountPAL = possibleparts.data.Count;
              vm.gridOptionsPAL.gridApi.infiniteScroll.saveScrollPercentage();
              $timeout(() => {
                vm.resetSourceGridPAL();
                return vm.gridOptionsPAL.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountPAL !== vm.currentdataPAL ? true : false);
              });
            }).catch((error) => BaseService.getErrorLog(error));
          };
        }
        /*---------------------------- [E] - Possible Alternate  List ----------------------------*/
      };
      init();

      /*---------------------------- [S] - Alternate/RoHS Replacement/Pickup Pad/Mating Part/Program/Functional Testing Tools List ----------------------------*/
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
      // start component alternate alias region
      const getComponentAlternetAliasDetail = (item) => {
        if (item) {
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_ALTERNATE_PART_CONFIRMATION_BODY_MESSAGE);
          let typeId = CORE.ComponentValidationPartType.AlternatePart;
          switch (vm.ComponentAlternatePartType) {
            case CORE.ComponentAlternatePartType.RoHSReplacementPart:
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_ROHS_ALTERNATE_PART_CONFIRMATION_BODY_MESSAGE);
              typeId = CORE.ComponentValidationPartType.RohsAlternatePart;
              break;
            case CORE.ComponentAlternatePartType.MatingPartRequired:
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_REQUIRE_MATING_PARTS_CONFIRMATION_BODY_MESSAGE);
              break;
            case CORE.ComponentAlternatePartType.PickupPadRequired:
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PICKUP_PAD_CONFIRMATION_BODY_MESSAGE);
              break;
            case CORE.ComponentAlternatePartType.FunctionaTestingRequired:
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_FUNCTIONAL_TESTING_CONFIRMATION_BODY_MESSAGE);
              break;
            default:
          }

          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (vm.ComponentAlternatePartType === CORE.ComponentAlternatePartType.RoHSReplacementPart || vm.ComponentAlternatePartType === CORE.ComponentAlternatePartType.AlternatePart) {
                const validationPromise = [checkAddAlternatePartValidation(item, typeId)];
                $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
                  var res = _.find(responses, (response) => response === false);
                  if (res !== false) {
                    $scope.ComponentAlternetAlias = item;
                    $scope.ComponentAlternetAlias.type = vm.ComponentAlternatePartType;
                    saveComponentAlternetAlias();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                $scope.ComponentAlternetAlias = item;
                $scope.ComponentAlternetAlias.type = vm.ComponentAlternatePartType;
                saveComponentAlternetAlias();
              }
            }
          }, () => {
            // Cancel
          });
        }
      };

      //Check on Add Alternate/RoHS Replacement Parts
      function checkAddAlternatePartValidation(item, typeId) {
        var componentObj = {
          toPartId: vm.cid,
          fromPartId: item.id,
          typeId: typeId
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

      /* save  component alternate detail into database */
      function saveComponentAlternetAlias() {
        const componentInfo = {
          PID: $scope.ComponentAlternetAlias.PID,
          componetID: $scope.ComponentAlternetAlias.id,
          mfgPN: $scope.ComponentAlternetAlias.mfgPN,
          parentComponentID: vm.cid,
          type: $scope.ComponentAlternetAlias.type
        };
        ComponentFactory.createAlternetAlias().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$emit(CORE.EventName.onAddDeleteAlternatePart, vm.ComponentAlternatePartType);
            $scope.$broadcast(vm.autoCompleteAlternetAlias.inputName, null);
          }
          else {
            switch (vm.ComponentAlternatePartType) {
              case CORE.ComponentAlternatePartType.AlternatePart: {
                $scope.$broadcast(vm.autoCompleteAlternetAlias.inputName, null);
                break;
              }
              case CORE.ComponentAlternatePartType.PickupPadRequired: {
                $scope.$broadcast(vm.autoCompleteRequirePickupPadAlias.inputName, null);
                break;
              }
              case CORE.ComponentAlternatePartType.FunctionaTestingRequired: {
                $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingAlias.inputName, null);
                break;
              }
              case CORE.ComponentAlternatePartType.MatingPartRequired: {
                $scope.$broadcast(vm.autoCompleteRequireMatingPart.inputName, null);
                break;
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /*---------------------------- [E] - Alternate/RoHS Replacement/Pickup Pad/Mating Part/Program/Functional Testing Tools List ----------------------------*/
      if (vm.ComponentAlternatePartType !== CORE.ComponentAlternatePartType.ProgrammingRequired) {
        vm.autoCompleteAlternetAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Alternate Part',
          placeholderName: 'Search text or Add',
          isRequired: false,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart,
            functionalCategoryID: vm.partDetail.functionalCategoryID
          },
          callbackFn: function (obj) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
            const searchObj = {
              id: obj.id,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompleteAlternetAlias.inputName
            };
            switch (vm.ComponentAlternatePartType) {
              case CORE.ComponentAlternatePartType.AlternatePart:
                searchObj.rohsMainCategoryID = selectedRoHS.refMainCategoryID;
                searchObj.isRohsMainCategoryInvertMatch = true;
                break;
              case CORE.ComponentAlternatePartType.RoHSReplacementPart:
                searchObj.rohsMainCategoryID = selectedRoHS.refMainCategoryID,
                  searchObj.isRohsMainCategoryInvertMatch = false;
                break;
              case CORE.ComponentAlternatePartType.MatingPartRequired:
                searchObj.categoryID = vm.partDetail.category;
                break;
              case CORE.ComponentAlternatePartType.PickupPadRequired:
                searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
                searchObj.categoryID = vm.partDetail.category;
                break;
              case CORE.ComponentAlternatePartType.FunctionaTestingRequired:
                searchObj.mountingType = 'Tools';
                searchObj.strictCustomPart = false;
                break;
              default:
            }
            return getAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: function (item) {
            getComponentAlternetAliasDetail(item);
          },
          onSearchFn: function (query) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
            const searchObj = {
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              query: query,
              inputName: vm.autoCompleteAlternetAlias.inputName
            };
            switch (vm.ComponentAlternatePartType) {
              case CORE.ComponentAlternatePartType.AlternatePart:
                searchObj.rohsMainCategoryID = selectedRoHS.refMainCategoryID;
                searchObj.isRohsMainCategoryInvertMatch = true;
                searchObj.alternatePartFilter = true;
                break;
              case CORE.ComponentAlternatePartType.RoHSReplacementPart:
                searchObj.rohsMainCategoryID = selectedRoHS.refMainCategoryID,
                  searchObj.isRohsMainCategoryInvertMatch = false;
                searchObj.roHReplacementPartFilter = true;
                break;
              case CORE.ComponentAlternatePartType.MatingPartRequired:
                searchObj.categoryID = vm.partDetail.category;
                searchObj.requireMatingPartFilter = true;
                break;
              case CORE.ComponentAlternatePartType.PickupPadRequired:
                searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
                searchObj.categoryID = vm.partDetail.category;
                searchObj.pickupPadPartFilter = true;
                break;
              case CORE.ComponentAlternatePartType.FunctionaTestingRequired:
                searchObj.mountingType = 'Tools';
                searchObj.strictCustomPart = false;
                searchObj.requireFunctionalPartFilter = true;
                break;
              default:
            }
            return getAliasSearch(searchObj);
          }
        };
      }
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

      /*---------------------------- [S] - Alternate/RoHS Replacement/Require Mating/Pickup Pad/Require Functional Testing List ----------------------------*/
      vm.APNotFound = false;
      vm.isHideDelete = true;
      vm.sourceHeaderAP = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
          </div>\
          <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
          <span><b>{{(grid.appScope.$parent.vm.pagingInfoAP.pageSize * (grid.appScope.$parent.vm.pagingInfoAP.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
          </div>',
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
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                             rohs-status="row.entity.rohsName"\
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
          displayName: 'Customer Part#',
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
                            ng-click="grid.appScope.$parent.vm.showVersionHistory(row.entity,row.entity.ID,$event)"><a>{{COL_FIELD}}</a></div>',
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

      vm.pagingInfoAP = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: []
      };

      vm.gridOptionsAP = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfoAP.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: `${vm.aliasName} List.csv`,
        hideFilter: true
      };

      /* retrieve Alternate Parts list */
      vm.loadDataAP = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfoAP, vm.gridOptionsAP);
        if (vm.pagingInfoAP.SortColumns.length === 0) {
          vm.pagingInfoAP.SortColumns = [['mfgPN', 'ASC']];
          vm.pagingInfoAP.type = vm.ComponentAlternatePartType;
        }
        vm.pagingInfoAP.id = vm.cid ? vm.cid : null;
        vm.cgBusyLoading = ComponentFactory.getComponentAlternetPartList().query(vm.pagingInfoAP).$promise.then((alternetparts) => {
          vm.APNotFound = true;
          vm.sourceDataAP = alternetparts.data.alternetPartList;
          vm.totalSourceDataCountAP = alternetparts.data.Count;

          if (!vm.gridOptionsAP.enablePaging) {
            vm.currentdataAP = vm.sourceDataAP.length;
            vm.gridOptionsAP.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptionsAP.clearSelectedRows();
          if (vm.totalSourceDataCountAP === 0) {
            if (vm.pagingInfoAP.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.APNotFound = false;
              vm.emptyStateAP = 0;
            }
            else {
              vm.APNotFound = true;
              vm.emptyStateAP = null;
            }
          }
          else {
            vm.APNotFound = false;
            vm.emptyStateAP = null;
          }

          if (!vm.gridOptionsAP.enablePaging) {
            vm.currentdataAP = vm.sourceDataAP.length;
          }

          $timeout(() => {
            vm.resetSourceGridAP();
            return vm.gridOptionsAP.gridApi.infiniteScroll.dataLoaded(false, false);
          }, 1000);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDownAP = () => {
        vm.pagingInfoAP.Page = vm.pagingInfoAP.Page + 1;
        $scope.$parent.$parent.vm.cgBusyLoading = ComponentFactory.getComponentAlternetPartList().query(vm.pagingInfoAP).$promise.then((alternetparts) => {
          vm.sourceDataAP = vm.gridOptionsAP.data = vm.gridOptionsAP.data.concat(alternetparts.data.alternetPartList);
          vm.currentdataAP = vm.gridOptionsAP.currentItem = vm.gridOptionsAP.data.length;
          vm.gridOptionsAP.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            if (!vm.gridOptionsAP.enablePaging && vm.totalSourceDataCountAP === vm.currentdataAP) {
              return vm.gridOptionsAP.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountAP !== vm.currentdataAP ? true : false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      $scope.$watch('alternatePartType', (newVal, oldVal) => {
        if (newVal !== oldVal) {
          init();
          vm.APNotFound = true;
          BaseService.reloadUIGrid(vm.gridOptionsAP, vm.pagingInfoAP, initPageInfo, vm.loadDataAP);
        }
      });

      $scope.$on('$destroy', () => {
        onAddDeleteAlternatePart();
      });
      /*---------------------------- [E] - Alternate/RoHS Replacement/Require Mating/Pickup Pad/Require Functional Testing ----------------------------*/
    }
  }
})();

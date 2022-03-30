(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('workorderList', workorderList);

  /** @ngInject */
  function workorderList() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=?'
      },
      templateUrl: 'app/directives/custom/workorder-list/workorder-list-directive.html',
      controller: workorderListDirectiveCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function workorderListDirectiveCtrl($scope, $mdDialog, $timeout, $state, CORE, USER, WORKORDER, REPORTS, MasterFactory, WorkorderFactory, DialogFactory, BaseService, TRAVELER, socketConnectionService, AssyTypeFactory, $q, CertificateStandardFactory, ManageMFGCodePopupFactory) {
      var vm = this;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.partId = parseInt($scope.partId || 0);
      vm.isUpdatable = true;
      vm.isUsageMaterial = true;
      vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER;
      vm.DisplayStatus = CORE.DisplayStatus;
      vm.woSubStatusDetail = CORE.WorkOrderStatus;
      vm.wostatusFieldName = WORKORDER.WORKORDER_STATUS_FIELDNAME;
      vm.wosubstatusFieldName = WORKORDER.WORKORDER_SUB_STATUS_FIELDNAME;
      vm.DateOnlyFormat = _dateDisplayFormat;
      vm.DefaultDateFormat = _dateTimeDisplayFormat;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      const loginUserDetails = BaseService.loginUser;
      vm.isHaltResumeWorkOrder = true;
      vm.HaltResumePopUp = CORE.HaltResumePopUp;
      vm.haltImagePath = vm.HaltResumePopUp.stopImagePath;
      vm.resumeImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, vm.HaltResumePopUp.resumeFileName);
      vm.woSubStatusList = _.sortBy(CORE.WoStatus, [(o) => o.DisplayOrder]);
      vm.woTypeList = CORE.workOrderTypes;
      vm.EmptyFilterMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.fluxTypeDropDown = CORE.FluxTypeDropDown;
        vm.workorderAdvancedFilters = CORE.WorkorderAdvancedFilters;
        vm.isTerminateWorkorder = true;
        vm.isViewAssembly = true;
      vm.filter = {
        woSubStatus: Array.isArray(vm.woSubStatusDetail) ? [vm.woSubStatusDetail[0].Key.toString(), vm.woSubStatusDetail[1].Key.toString(), vm.woSubStatusDetail[4].Key.toString(), vm.woSubStatusDetail[5].Key.toString(), vm.woSubStatusDetail[7].Key.toString(), vm.woSubStatusDetail[8].Key.toString()] : [],
        wotype: CORE.DEFAULT_ALL,
        fluxTypeAll: true,
        openClosed: CORE.DEFAULT_ALL,
        customers: [],
        salesorders: [],
        assyIds: [],
        nicknames: [],
        operations: [],
        employees: [],
        equipments: [],
        materials: [],
        Umids: []
      };
      if (vm.partId) {
        vm.filter.assyIds.push({
          id: vm.partId,
          PIDCode: $scope.$parent.$parent.vm.displayComponentDetail.PIDCode,
          mfgCodeID: $scope.$parent.$parent.vm.displayComponentDetail.mfgcodeID,
          isDisable: true
        });
        vm.isAssyIdFilterDisabled = true;
      }
      vm.numberOfMasterFiltersApplied = 1;

      vm.kitReleaseStatus = CORE.ReleaseKitStatusGridHeaderDropdownWO;

      vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);

      vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

      vm.getWoTypeClassName = (typeID) => BaseService.getWoTypeClassName(typeID);

      const IsPermanentDelete = CORE.IsPermanentDelete;
      const ConfirmationType = CORE.woQtyApprovalConfirmationTypes.BuildQtyConfirmation;
      const refTablename = CORE.AllEntityIDS.Workorder.Name;
      vm.WorkOrderStatusGridHeaderDropdown = CORE.WorkOrderStatusGridHeaderDropdown;
      vm.SampleStatusGridHeaderDropdown = CORE.SampleStatusGridHeaderDropdown;
      vm.ClusterStatusGridHeaderDropdown = CORE.ClusterStatusGridHeaderDropdown;
      vm.HaltWorkorderGridHeaderDropdown = CORE.HaltWorkorderGridHeaderDropdown;
      const workOrderTypesWithGridHeaderDropdown = CORE.workOrderTypesWithGridHeaderDropdown;
      // for copy icon into ui-grid action column
      vm.isCopy = false;
      vm.viewWOProfile = true;
      vm.isECORequest = true;
      vm.isDFMRequest = true;
      vm.isQtyConfirmationlist = true;
      vm.isViewWOStatusChangeConfirmationList = true;
      vm.actionButtonName = 'Build Qty Change History';
      vm.isHaltResumeHistory = true;
      vm.tempWorkorderReview = true;
      vm.workorderChangesHistory = true;
      vm.ViewWorkorderManualEntryList = true;
      vm.addWorkorderManualEntry = true;
      vm.isConvertToTemplate = true;
      vm.isTerminateAndTransfer = true;
      vm.isWorkorderNarrativeHistory = true;
      vm.isNoDatainFilter = false;
      vm.countTotalRowsOfWOTable = 0;
      //vm.isDataFields = true;
      vm.entityID = CORE.AllEntityIDS.Workorder.ID;
      $scope.assyUIGridList = [];
      vm.HaltResumeWOFeatureBased = true;

      // get RoHS List
      vm.getRoHSList = () => {
        vm.rohsSearchText = null;
        return MasterFactory.getRohsList().query().$promise.then((requirement) => {
          vm.RohsList = [{ id: null, value: CORE.DEFAULT_ALL }];
          if (requirement && requirement.data) {
            vm.rohsList = requirement.data;
            vm.rohsListToDisplay = angular.copy(vm.rohsList);
            _.each(requirement.data, (item) => {
              var obj = {
                id: item.name,
                value: item.name
              };
              vm.RohsList.push(obj);
            });
          }
          vm.isshowGrid = true;
          loadsource();
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getRoHSList();


      vm.checkboxButtonGroup = {
        fluxType: {
          checkDisable: () => vm.filter.fluxTypeAll,
          onChange: () => {
            if (vm.filter.fluxTypeAll === true) {
              vm.filter.isFluxNotApplicable = false;
              vm.filter.isNoClean = false;
              vm.filter.isWaterSoluble = false;
            }
            vm.changeTogetWorkorder();
          }
        }
      };

      //Get Assembly Type List
      vm.getAssyTypeList = () => {
        vm.assemblyTypeSearchText = null;
        return AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
          vm.assemblyTypeList = vm.assemblyTypeListToDisplay = [];
          if (response && response.data) {
            vm.assemblyTypeList = _.sortBy(response.data, [(o) => o.name]);
            vm.assemblyTypeListToDisplay = angular.copy(vm.assemblyTypeList);
          }
          return $q.resolve(vm.assemblyTypeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //get standard list with its class
      vm.getStandard = () => {
        vm.standardsSearchText = null;
        return CertificateStandardFactory.getCertificateStandardRole().query().$promise.then((response) => {
          vm.standardsList = [];
          vm.standardClass = [];
          if (response && response.data) {
            _.each(response.data, (item) => {
              if (item.isActive) {
                const certificateStandards = {
                  certificateStandardID: item.certificateStandardID,
                  fullName: item.fullName,
                  displayOrder: item.displayOrder
                };
                vm.standardsList.push(certificateStandards);
                if (item.CertificateStandard_Class.length > 0) {
                  _.each(item.CertificateStandard_Class, (standardClass) => {
                    if (item.isActive) {
                      vm.standardClass.push(standardClass);
                      const standardsClass = {
                        certificateStandardID: stringFormat('{0}:{1}', item.certificateStandardID, standardClass.classID),
                        fullName: stringFormat('{0} {1}', item.fullName, standardClass.className),
                        displayOrder: item.displayOrder
                      };
                      vm.standardsList.push(standardsClass);
                    }
                  });
                }
              }
            });
            if (vm.standardsList.length > 0) {
              vm.standardsList = _.sortBy(vm.standardsList, ['displayOrder', 'fullName']);
            }
            if (vm.standardClass.length > 0) {
              vm.standardClass = _.sortBy(vm.standardClass, ['className']);
            }
          }
          vm.standardsListToDisplay = angular.copy(vm.standardsList);
          return $q.resolve(vm.standardsList);
        });
      };

      const loadsource = () => {
        vm.sourceHeader = [
          {
            field: 'Action',
            cellClass: 'gridCellColor',
            displayName: 'Action',
            width: '120',
            cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
            enableFiltering: false,
            enableSorting: false,
            pinnedLeft: true
          },
          {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableFiltering: false,
            enableSorting: false
          },
          {
            field: 'systemID',
            displayName: 'SystemID',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true,
            width: 145
          },
          {
            field: 'woSubStatusConvertedValue',
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getWoStatusClassName(row.entity.woSubStatus)">'
              + '{{COL_FIELD}}'
              + '</span>'
              + '<span class="ml-5">'
              + '<img class="wo-stop-image wo-stop-image-margin" ng-if="row.entity.isStopWorkorder != false"  src="assets/images/logos/stopped.png" />'
              + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.isStopWorkorder != false">{{row.entity.reasonDetails}}</md-tooltip>'
              + '</span>'
              + '</div>',
            enableFiltering: true,
            enableSorting: true,
            width: 210
          },
          {
            field: 'woCompletionPercentage',
            width: '100',
            minWidth: '100',
            displayName: 'WO Completion Status',
            cellTemplate: '<div>'
              + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left">'
              + '<div class="cm-quote-progress" style="width:{{(row.entity.woCompletionPercentage || 0) +\'%\'}}"></div>'
              + '<span class="relative" style="margin-left:5px !important;"><span> '
              + '{{(row.entity.woCompletionPercentage || 0)}}%</span></span>'
              + '<md-tooltip md-direction="top">Build Qty: {{row.entity.buildQty}} | Available Stock Qty: {{row.entity.readytoShipQty}} | {{grid.appScope.$parent.vm.LabelConstant.Traveler.ScrappedQty}}: {{row.entity.scrappedQty}}</md-tooltip>'
              + '</md-button>'
              + '</div>',
            enableFiltering: true,
            allowCellFocus: false
          },
          {
            field: 'kitReleaseStatus',
            displayName: 'Kit Release Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="{\'label-warning\':row.entity.kitReleaseStatus == grid.appScope.$parent.vm.kitReleaseStatus[1].id,\'label-success\' :row.entity.kitReleaseStatus == grid.appScope.$parent.vm.kitReleaseStatus[2].id}">'
              + '{{COL_FIELD}}'
              + '</span>'
              + '</div>',
            width: 150,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.kitReleaseStatus
            },
            ColumnDataType: 'StringEquals',
            enableFiltering: true,
            enableSorting: false
          },
          {
            field: 'isHotJobConvertedValue',
            displayName: vm.LabelConstant.Workorder.RushJob,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box"\
                            ng-class="{\'label-success\':row.entity.isHotJob == true, \
                            \'label-warning\':row.entity.isHotJob == false}"> \
                                {{ COL_FIELD }}'
              + '</span>'
              + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.SampleStatusGridHeaderDropdown
            },
            width: '100'
          },
          {
            field: 'woNumber',
            displayName: vm.LabelConstant.Workorder.WO,
            cellTemplate: '<a class="ui-grid-cell-contents cm-text-decoration" ng-click="grid.appScope.$parent.vm.goToWorkorderDetails(row.entity.woID);">\
                                                {{row.entity.woNumber}} </a>\
                                        <copy-text  label="grid.appScope.$parent.vm.LabelConstant.Workorder.WO" text="row.entity.woNumber" ng-if="row.entity.woNumber"> </copy-text>\
                                        <md-tooltip ng-if="row.entity.woNumber">{{row.entity.woNumber}}</md-tooltip> ',
            enableCellEdit: false,
            width: '150'
          },
          {
            field: 'woVersion',
            displayName: vm.LabelConstant.Workorder.Version,
            enableCellEdit: false,
            width: '60'
          }, {
            field: 'mfgCodeName',
            displayName: vm.LabelConstant.Customer.Customer,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="Customer" text="row.entity.mfgCodeName" ng-if="row.entity.mfgCodeName"></copy-text>\
                        </div>',
            width: '280'
          }, {
            field: 'PIDCode',
            displayName: vm.LabelConstant.Assembly.ID,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustom" \
                                        is-assembly="true"></div>',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: CORE.UI_GRID_COLUMN_WIDTH.PID,
            allowCellFocus: true
          }, {
            field: 'mfgPN',
            displayName: vm.LabelConstant.Assembly.MFGPN,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustom" \
                                        is-assembly="true"></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
            allowCellFocus: true
          },
          {
            field: 'assyTypeName',
            displayName: vm.LabelConstant.MFG.AssyType,
            enableCellEdit: false,
            enableCellEditOnFocus: false,
            width: '200'
          }, {
            field: 'liveVersion',
            displayName: vm.LabelConstant.BOM.InternalVersion,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '100'
          }, {
            field: 'initialInternalVersion',
            displayName: vm.LabelConstant.Workorder.InitialInternalVersion,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '100'
          }, {
            field: 'nickName',
            displayName: vm.LabelConstant.Assembly.NickName,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
          },
          {
            field: 'assyFluxType',
            displayName: 'Assembly Flux Type',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '{{row.entity.assyFluxTypeConvertedValue}}'
              + '</div>',
            width: 200,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.fluxTypeDropDown
            },
            ColumnDataType: 'StringEquals',
            enableFiltering: true,
            enableSorting: false
          },
          {
            field: 'mfgPNDescription',
            displayName: vm.LabelConstant.Assembly.Description,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '250'
          },
          {
            field: 'opCount',
            displayName: 'OP Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.opCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.opCount)}" \
                                                ng-click="grid.appScope.$parent.vm.showWorkOrderOperationList(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.opCount))">\
                                                {{COL_FIELD}}\
                                    </a>',
            enableCellEdit: false,
            width: '100'
          }, {
            field: 'parallelClusterCount',
            displayName: 'Parallel Cluster Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.parallelClusterCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.parallelClusterCount)}" \
                                                ng-click="grid.appScope.$parent.vm.showWorkOrderOperationList(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.parallelClusterCount))">\
                                                {{COL_FIELD}}\
                                    </a>',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '85'
          },
          {
            field: 'woReviewChangesCount',
            displayName: 'Change Request Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.woReviewChangesCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.woReviewChangesCount)}" \
                                                ng-click="grid.appScope.$parent.vm.openTempWorkorderReview(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.woReviewChangesCount))">\
                                                {{COL_FIELD}}\
                                    </a>',
            enableCellEdit: false,
            width: '85'
          },
          {
            field: 'pendingWOReqThreadCount',
            displayName: 'Change Request Pending Review Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.pendingWOReqThreadCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.pendingWOReqThreadCount)}" \
                                                ng-click="grid.appScope.$parent.vm.openPendingWorkorderReview(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.pendingWOReqThreadCount))">\
                                                {{COL_FIELD}}\
                                    </a>',
            enableCellEdit: false,
            width: '115'
          },
          {
            field: 'ecoRequestCount',
            displayName: 'ECO Request Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.ecoRequestCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.ecoRequestCount)}" \
                                                ng-click="grid.appScope.$parent.vm.openEcoRequestList(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.ecoRequestCount))">\
                                                {{COL_FIELD | numberWithoutDecimal}}\
                                    </a>',
            enableCellEdit: false,
            width: '85'
          }, {
            field: 'dfmRequestCount',
            displayName: 'DFM Request Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.dfmRequestCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.dfmRequestCount)}" \
                                                ng-click="grid.appScope.$parent.vm.openDFMRequestList(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.dfmRequestCount))">\
                                                {{COL_FIELD | numberWithoutDecimal}}\
                                    </a>',
            enableCellEdit: false,
            width: '85'
          },
          {
            field: 'woTypeConvertedText',
            displayName: vm.LabelConstant.Workorder.WOType,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: workOrderTypesWithGridHeaderDropdown
            },
            cellTemplate: '<div class="ui-grid-cell-contents" style="width:100%; float:left; overflow:hidden;">\
                                    <span class="label-box" ng-class="grid.appScope.$parent.vm.getWoTypeClassName(row.entity.woType)">\
                                    {{COL_FIELD}}\
                                    </span>\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
            ColumnDataType: 'StringEquals',
            width: '260'
          },
          {
            field: 'totalPOQty',
            displayName: 'PO Qty',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          }, {
            field: 'buildQty',
            displayName: 'Build Qty',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          }, {
            field: 'excessQty',
            displayName: vm.LabelConstant.Workorder.ExcessBuildQty,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          },
          {
            field: 'returnPending',
            displayName: 'Balance Qty',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          }, {
            field: 'scrappedQty',
            displayName: vm.LabelConstant.Traveler.ScrappedQty,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          },
          {
            field: 'readytoShipQty',
            displayName: 'Available Stock Qty',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          }, {
            field: 'shippedQty',
            displayName: 'Shipped Qty',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '85'
          }, {
            field: 'stockAdjustmentQty',
            displayName: vm.LabelConstant.Qty.ReadyToShipQtyWithStockAdjustment,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '120'
          }, {
            field: 'transferQty',
            displayName: 'Transferred Qty',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.transferQty),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.transferQty)}" \
                                                ng-click="grid.appScope.$parent.vm.showTerminateAndTransfer(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.transferQty))">\
                                                {{COL_FIELD | numberWithoutDecimal}}\
                                    </a>',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '85'
          }, {
            field: 'fromOpName',
            displayName: 'From Operation Name',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{grid.appScope.$parent.vm.showFromOpName(row.entity)}}</div>',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '200'
          }, {
            field: 'transferWoNumber',
            displayName: 'To WO#',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '100'
          }, {
            field: 'transferWoVersion',
            displayName: 'To WO Version',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '80'
          },

          {
            field: 'stopOperationCount',
            displayName: 'Hold OP Count',
            cellTemplate: '<a class="ui-grid-cell-contents grid-cell-text-right cursor-pointer"\
                                                ng-class="{\'cursor-not-allow custom-cnt-link\':grid.appScope.$parent.vm.isDisableLink(row.entity.stopOperationCount),\
                                                            \'underline\': !grid.appScope.$parent.vm.isDisableLink(row.entity.stopOperationCount)}" \
                                                ng-click="grid.appScope.$parent.vm.showWorkOrderHaltOperationList(row, $event, !grid.appScope.$parent.vm.isDisableLink(row.entity.stopOperationCount))">\
                                                {{COL_FIELD | numberWithoutDecimal}}\
                                    </a>',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '85'
          }, {
            field: 'salesOrderNumber',
            displayName: vm.LabelConstant.SalesOrder.SO,
            cellTemplate: '<span ng-if="row.entity.salesOrderNumber">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.showSalesOrderDetails($event, row.entity);$event.preventDefault();">{{row.entity.salesOrderNumber}}</a>\
                                        <md-tooltip>{{row.entity.salesOrderNumber}}</md-tooltip>\
                                    </span>',
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            width: '210',
            allowCellFocus: true
          },
          {
            field: 'isSampleAvailableConvertedValue',
            displayName: 'Sample Available',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box"  \
                            ng-class="{\'label-success\':row.entity.isSampleAvailableConvertedValue == \'Yes\', \
                            \'label-warning\':row.entity.isSampleAvailableConvertedValue == \'No\'}"> \
                                {{ COL_FIELD }}'
              + '</span>'
              + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.SampleStatusGridHeaderDropdown
            },
            width: '110'
          },
          {
            field: 'isOperationTrackBySerialNoConvertedValue',
            displayName: vm.LabelConstant.Workorder.TrackSerialNumbers,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isOperationTrackBySerialNo == true, \
                            \'label-warning\':row.entity.isOperationTrackBySerialNo == false}"> \
                                {{ COL_FIELD }}'
              + '</span>'
              + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.SampleStatusGridHeaderDropdown
            },
            width: '110'
          },
          {
            field: 'rohsName',
            width: '70',
            displayName: 'RoHS Status',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.RohsList
            }
          },
          {
            field: 'shippingDate',
            displayName: 'Shipping Date',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DateOnlyFormat}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
            type: 'datetime',
            enableSorting: true,
            enableFiltering: false
          },
          {
            field: 'DPMO',
            displayName: 'Defects per Million Opportunities (DPMO)',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 150,
            enableSorting: true,
            enableFiltering: true
          },
          {
            field: 'rackTrackingRequired',
            displayName: vm.LabelConstant.Workorder.RequiredRackTracking,
            width: 130,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':!row.entity.isRackTrackingRequired,\
                        \'label-box label-success\':row.entity.isRackTrackingRequired }"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableSorting: true,
            enableFiltering: true,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.MasterTemplateDropdown
            }
          },
          {
            field: 'strictlyFollowRackValidation',
            displayName: vm.LabelConstant.Workorder.StrictlyValidation,
            width: 130,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':!row.entity.isStrictlyFollowRackValidation,\
                        \'label-box label-success\':row.entity.isStrictlyFollowRackValidation }"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableSorting: true,
            enableFiltering: true,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.MasterTemplateDropdown
            }
          },
          {
            field: 'isInternalBuildConvertedValue',
            displayName: vm.LabelConstant.Workorder.InternalBuild,
            width: 140,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':!row.entity.isInternalBuild,\
                        \'label-box label-success\':row.entity.isInternalBuild }"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableSorting: true,
            enableFiltering: true,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.MasterTemplateDropdown
            }
          },
          {
            field: 'proposedUmidQty',
            displayName: vm.LabelConstant.Workorder.PropUmidQty,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '220'
          },
          {
            field: 'isKitAllocationNotRequiredConvertedValue',
            displayName: vm.LabelConstant.Workorder.IsKitAllocationNotRequired,
            width: 220,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':!row.entity.isKitAllocationNotRequired,\
                        \'label-box label-success\':row.entity.isKitAllocationNotRequired }"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableSorting: true,
            enableFiltering: true,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.MasterTemplateDropdown
            }
          },
          {
            field: 'woUpdatedAt',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
          }, {
            field: 'woModifiedBy',
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
            field: 'woCreatedAt',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
          },
          {
            field: 'woCreatedBy',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableSorting: true,
            enableFiltering: true
          }, {
            field: 'createdbyRole',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            type: 'StringEquals',
            enableFiltering: true
          }
        ];
      };

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['nickName', 'ASC']],
          SearchColumns: []
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
        exporterCsvFilename: 'Work Order.csv'
      };

      vm.showFromOpName = (data) => {
        if (data.fromOpName && data.fromOpNumber) {
          return operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, data.fromOpName, data.fromOpNumber);
        }
        return '';
      };

      const processWorkorderRecord = (workorderData) => {
        workorderData.forEach((item) => {
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.isDisabledTerminateAndTransfer = true;
          item.isDisbaledWorkorderNarrativeHistory = true;
          item.isDisabledConvertToTemplate = true;
          item.isDisabledTerminatWo = true;
          if (item.woSubStatus === CORE.WOSTATUS.UNDER_TERMINATION || item.woSubStatus === CORE.WOSTATUS.TERMINATED) {
            item.isDisabledDelete = true;
            // commented copy option after discussion with dixit sir to allow copy all information even it is terminate.
            //item.isDisabledCopy = true;
            //item.isDisabledECORequest = true;
            //item.isDisabledDFMRequest = true;
            item.isDisabledWorkorderReview = true;
            item.isRowSelectable = false;
            item.isDisabledTerminatWo = true;
          }
          else if (item.woSubStatus !== CORE.WOSTATUS.DRAFT) {
            item.isDisabledDelete = true;
            item.isRowSelectable = false;
            item.isDisabledTerminatWo = false;
          }
          if (item.woID && (item.woSubStatus === CORE.WOSTATUS.PUBLISHED || item.woSubStatus === CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS)) {
            if (item.isStopWorkorder) {
              item.workOrderHalt = vm.HaltResumePopUp.ResumeWorkOrder;
              item.workOrderHaltImage = vm.resumeImagePath;
            } else {
              item.workOrderHalt = vm.HaltResumePopUp.HaltWorkOrder;
              item.workOrderHaltImage = vm.haltImagePath;
            }
          } else {
            item.workOrderHaltImage = vm.haltImagePath;
            item.workOrderHalt = vm.HaltResumePopUp.HaltWorkOrder;
            item.isDisabledHaltResumeWorkOrder = true;
          }
          if (item.woSubStatus === CORE.WOSTATUS.COMPLETED || item.woSubStatus === CORE.WOSTATUS.VOID || item.woSubStatus === CORE.WOSTATUS.TERMINATED) {
            item.isDisabledECORequest = true;
            item.isDisabledDFMRequest = true;
            item.isDisabledAddManualEntry = true;
            //item.isDisabledHaltResumeHistory = true;
          }

          // Added by vaibhav shah - allow to add R&D Narrative History
          if (item.woSubStatus !== CORE.WOSTATUS.DRAFT && item.woSubStatus !== CORE.WOSTATUS.COMPLETED) {
            item.isDisbaledWorkorderNarrativeHistory = false;
          } else {
            item.isDisbaledWorkorderNarrativeHistory = true;
          }

          if (item.fromWOOPID) {
            item.isDisabledTerminateAndTransfer = false;
          }
          if (item.opCount) {
            item.isDisabledConvertToTemplate = false;
          }
        });
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (workorder, isGetDataDown) => {
        if (workorder && workorder.data && workorder.data.workorder) {
          processWorkorderRecord(workorder.data.workorder);
          if (!isGetDataDown) {
            vm.countTotalRowsOfWOTable = workorder.data.countTotalRowsOfWOTable;
            $scope.$parent.vm.countTotalRowsOfWOTable = vm.countTotalRowsOfWOTable;
            vm.sourceData = workorder.data.workorder;
            vm.currentdata = vm.sourceData.length;
          }
          else if (workorder.data.workorder.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workorder.data.workorder);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = workorder.data.Count;
          if (!vm.gridOptions.enablePaging) {
            if (!isGetDataDown) {
              vm.gridOptions.gridApi.infiniteScroll.resetScroll();
            }
            else {
              vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
            }
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
              if (vm.isNoDatainFilter) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
            }
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $scope.$parent.vm.isNoDataFound = vm.isNoDataFound;
          $timeout(() => {
            if (!isGetDataDown) {
              vm.resetSourceGrid();
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            }
          });
        }
      };

      /* retrieve work order list*/
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        bindFilterDetail();
        vm.cgBusyLoading = WorkorderFactory.retriveWorkorderlist().query(vm.pagingInfo).$promise.then((workorder) => {
          if (workorder && workorder.data) {
            setDataAfterGetAPICall(workorder, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //update one row of grid
      const updateOneRowOfGrid = (woID) => {
        if (woID) {
          vm.pagingInfo.woID = woID;
          vm.cgBusyLoading = WorkorderFactory.retriveWorkorderlist().query(vm.pagingInfo).$promise.then((workorder) => {
            vm.pagingInfo.woID = null;
            if (workorder.data) {
              processWorkorderRecord(workorder.data.workorder);
              if (workorder.data.workorder && workorder.data.workorder.length > 0) {
                _.map(vm.gridOptions.data, (data, $index) => {
                  if (data.woID === workorder.data.workorder[0].woID) {
                    vm.sourceData.splice($index, 1);
                    vm.sourceData.splice($index, 0, workorder.data.workorder[0]);
                  }
                });
              } else {
                const index = _.findIndex(vm.gridOptions.data, (data) => data.woID === rowData.woID);
                if (index !== -1) {
                  vm.sourceData.splice(index, 1);
                }
              }
              $timeout(() => {
                vm.resetSourceGrid();
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* to get data on scroll down in grid */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = WorkorderFactory.retriveWorkorderlist().query(vm.pagingInfo).$promise.then((workorder) => {
          if (workorder && workorder.data) {
            setDataAfterGetAPICall(workorder, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // select work order
      vm.selectedWorkorder = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

      vm.fab = {
        Status: false
      };

      // delete
      vm.deleteRecord = (workOrder) => {
        let selectedIDs = [];
        if (workOrder) {
          // selectedIDs = workOrder.woID;
          selectedIDs.push(workOrder.woID);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((workOrderItem) => workOrderItem.woID);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Work Order', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            isPermanentDelete: IsPermanentDelete,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = WorkorderFactory.deleteWorkorder().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.workorder
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return WorkorderFactory.deleteWorkorder().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = workOrder ? workOrder.woNumber : null;
                      data.PageName = CORE.PageName.workorder;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => { // Success Section
                          }, () => { // Cancel Section
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                }
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { // cancel section
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, 'work order');
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };


      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* display work order sales order header all details while click on that link*/
      vm.showSalesOrderDetails = (ev, soData) => {
        if (soData.poNumber && soData.salesOrderNumber) {
          const data = angular.copy(soData);
          DialogFactory.dialogService(
            CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
            CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
            ev,
            data).then(() => { // Success Section
            }, () => { // Cancel Section
            });
        }
      };

      // copy workorder details
      vm.copyRecord = (row, event, isNew) => {
        var data = {
          isNew: isNew,
          woID: row ? row.entity.woID : null,
          customerID: row ? row.entity.customerID : null
        };

        DialogFactory.dialogService(
          WORKORDER.COPY_WORKORDER_CONTROLLER,
          WORKORDER.COPY_WORKORDER_VIEW,
          event,
          data).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, () => {// Cancel Section
          });
      };

      // View Quantity confirmation details for status change
      vm.viewQtyConfirmationlist = (row, $event) => {
        const data = {
          confirmationType: angular.copy(CORE.woQtyApprovalConfirmationTypes.BuildQtyConfirmation)
        };
        openTaskConfirmationList(row, $event, data);
      };

      // View work order status change confirmation details for status change
      vm.viewWOStatusChangeConfirmationList = (row, $event) => {
        const data = {
          confirmationType: angular.copy(CORE.woQtyApprovalConfirmationTypes.WOStatusChangeRequest)
        };
        openTaskConfirmationList(row, $event, data);
      };

      // open task confirmation list popup
      const openTaskConfirmationList = (row, $event, data) => {
        data.refTablename = refTablename;
        data.refId = row.entity.woID;
        data.woNumber = row.entity.woNumber;
        data.woVersion = row.entity.woVersion;
        data.PIDCode = row.entity.PIDCode;
        data.nickName = row.entity.nickName;
        data.rohsIcon = row.entity.rohsIcon;
        data.rohsName = row.entity.rohsName;
        data.partID = row.entity.partID;

        DialogFactory.dialogService(
          CORE.QTY_CONFIRMATION_LIST.CONTROLLER,
          CORE.QTY_CONFIRMATION_LIST.VIEW,
          $event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          });
      };

      // View Popup for Halt Resume History List
      vm.haltResumeHistoryList = (row, $event) => {
        var data = {
          woID: row.entity.woID,
          woNumber: row.entity.woNumber,
          woVersion: row.entity.woVersion,
          PIDCode: row.entity.PIDCode,
          poNumber: row.entity.poNumber,
          salesOrderNumber: row.entity.salesOrderNumber,
          soPOQty: row.entity.soPOQty,
          soMRPQty: row.entity.soMRPQty,
          lineID: row.entity.lineID,
          salesOrderMstIDs: row.entity.salesOrderMstIDs,
          SOPOQtyValues: row.entity.SOPOQtyValues,
          rohsIcon: row.entity.rohsIcon,
          rohsName: row.entity.rohsName,
          partID: row.entity.partID
        };

        DialogFactory.dialogService(
          WORKORDER.WORKORDER_HALT_RESUME_POPUP_CONTROLLER,
          WORKORDER.WORKORDER_HALT_RESUME_POPUP_VIEW,
          $event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          });
      };

      // Open Work Order Review
      vm.openTempWorkorderReview = (row, $event, allowLink) => {
        var data = {};
        if (allowLink) {
          data = {
            woID: row.entity.woID,
            woNumber: row.entity.woNumber,
            woVersion: row.entity.woVersion,
            isViewPendingReviewCmtCountReq: false,
            PIDCode: row.entity.PIDCode,
            rohsIcon: row.entity.rohsIcon,
            rohsName: row.entity.rohsName,
            partID: row.entity.partID
          };
          openWOReviewChangesPopup($event, data);
        }
      };

      // Open Work Order Review
      vm.openPendingWorkorderReview = (row, $event, allowLink) => {
        var data = {};
        if (allowLink) {
          data = {
            woID: row.entity.woID,
            woNumber: row.entity.woNumber,
            woVersion: row.entity.woVersion,
            isViewPendingReviewCmtCountReq: true,
            PIDCode: row.entity.PIDCode,
            rohsIcon: row.entity.rohsIcon,
            rohsName: row.entity.rohsName,
            partID: row.entity.partID
          };
          openWOReviewChangesPopup($event, data);
        }
      };

      const openWOReviewChangesPopup = ($event, data) => {
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_REVIEW_CHANGES_POPUP_CONTROLLER,
          WORKORDER.WORKORDER_REVIEW_CHANGES_POPUP_VIEW,
          $event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          });
      };

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, {
          closeAll: true
        });
        removeSocketListener();
      });

      /*Show Disable if Count is not available for Workorder*/
      vm.isDisableLink = (count) => count > 0 ? false : true;

      /*Go to work order operation details*/
      vm.showWorkOrderOperationList = (row, ev, allowClick) => {
        if (allowClick) {
          BaseService.goToWorkorderOperations(row.entity.woID);
          return false;
        }
      };

      /* show work order halt operation list */
      vm.showWorkOrderHaltOperationList = (row, ev, allowClick) => {
        var data;
        if (allowClick) {
          data = {
            woID: row.entity.woID,
            woNumber: row.entity.woNumber,
            woVersion: row.entity.woVersion,
            PIDCode: row.entity.PIDCode,
            rohsIcon: row.entity.rohsIcon,
            rohsName: row.entity.rohsName,
            partID: row.entity.partID
          };

          DialogFactory.dialogService(
            WORKORDER.VIEW_WO_HALT_OPERATION_CONTROLLER,
            WORKORDER.VIEW_WO_HALT_OPERATION_VIEW,
            ev,
            data).then(() => {// Success Section
            }, () => { // Cancel Section
            });
        }
      };

      vm.openWorkorderManualEntryList = (row) => {
        BaseService.goToWorkorderManualEntryList(row.entity.woID);
        return false;
      };

      vm.openAddWorkorderManualEntryPage = (row) => {
        // stop access if wo status in TERMINATED or COMPLETED or VOID
        if (checkWOInSpecificStatusNotAllowedToChange(row.entity)) {
          return;
        }
        BaseService.goToAddUpdateWorkorderManualEntry(row.entity.woID, null); //woTransID : null for add time
        return false;
      };

      vm.openEcoRequestList = (row, event, allowClick) => {
        if (allowClick) {
          BaseService.goToWorkorderECORequestList(row.entity.woID, row.entity.partID);
          return false;
        }
      };

      vm.openDFMRequestList = (row, event, allowClick) => {
        if (allowClick) {
          BaseService.goToWorkorderDFMRequestList(row.entity.woID, row.entity.partID);
          return false;
        }
      };

      vm.addEcoRequest = (row) => {
        // stop access if wo status in TERMINATED or COMPLETED or VOID
        if (checkWOInSpecificStatusNotAllowedToChange(row.entity)) {
          return;
        }
        BaseService.goToAddWorkorderECORequest(row.entity.partID, row.entity.woID);
        return false;
      };

      vm.addDFMRequest = (row) => {
        // stop access if wo status in TERMINATED or COMPLETED or VOID
        if (checkWOInSpecificStatusNotAllowedToChange(row.entity)) {
          return;
        }
        BaseService.goToAddWorkorderDFMRequest(row.entity.partID, row.entity.woID);
        return false;
      };

      vm.openWorkorderChangesHistoryAuditLog = (row) => {
        BaseService.goToWorkorderChangeLog(row.entity.woID);
        return false;
      };

      /* work order profile*/
      vm.viewRecordProfile = (row) => {
        BaseService.goToWorkorderProfile(row.entity.woID);
      };

      vm.addRecord = (row) => {
        //vm.copyRecord(row, ev, true);\
        const pageRightsAccessDet = {
          popupAccessRoutingState: [WORKORDER.WORKORDER_WORKORDERS_STATE],
          pageNameAccessLabel: CORE.PageName.Workorder
        };

        if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
          const data = {
            woID: row ? row.entity.woID : null
          };
          // when workorder list shown in component master set default MFR and Assy Id
          if (vm.partId) {
            data.customerID = $scope.$parent.$parent.vm.displayComponentDetail.mfgcodeID;
            data.subAssy = { id: $scope.$parent.$parent.vm.displayComponentDetail.id };
          }
          DialogFactory.dialogService(
            WORKORDER.ADD_WORKORDER_CONTROLLER,
            WORKORDER.ADD_WORKORDER_VIEW,
            event,
            data).then(() => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }, () => { // Cancel Section
            });
        }
      };

      vm.updateRecord = (row) => {
        BaseService.goToWorkorderDetails(row.entity.woID);
        return false;
        //$state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, {
        //  woID: row.entity.woID
        //});
      };

      vm.goToNarrativeHistory = (row) => {
        BaseService.openInNew(REPORTS.WORKORDER_NARRATIVE_HISTORY_STATE, { woID: row.entity.woID });
        return false;
      };

      //open popup to copy master template
      vm.convertToMasterTemplate = (row, ev) => {
        var data = _.clone(row);
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_CONVERT_TO_MASTER_TEMPLATE_MODAL_CONTROLLER,
          WORKORDER.WORKORDER_CONVERT_TO_MASTER_TEMPLATE_MODAL_VIEW,
          ev,
          data).then(() => { // Success Section
          }, () => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData));
      };

      //// open workorder transfer history
      vm.showTerminateAndTransfer = function (data, $event, allowLink) {
        if (allowLink) {
          const model = {
            fromWOOPID: data.entity.fromWOOPID
          };
          DialogFactory.dialogService(
            TRAVELER.TERMINATE_OPERATION_HISTORY_MODAL_CONTROLLER,
            TRAVELER.TERMINATE_OPERATION_HISTORY_MODAL_VIEW,
            $event,
            model).then(() => { // Success Section
            }, () => { // Cancel Section
            });
        }
      };

      /* workorder halt/resume pop-up*/
      vm.haltResumeWorkOrder = (row, ev) => {
        const rowData = row.entity;
        const employeeDetails = loginUserDetails.employee;
        const enableToggleWorkorder = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ToggleWorkorder);
        let messageContent;
        if (!enableToggleWorkorder) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.HALT_RESUME_NOT_ALLOW_WORKORDER);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        const workorderStatus = {
          woID: rowData.woID,
          woTransHoldUnholdId: rowData.woTransHoldUnholdId,
          unHoldEmployeeId: employeeDetails.id,
          holdEmployeeId: employeeDetails.id,
          woNumber: rowData.woNumber,
          isStopWorkorder: !rowData.woTransHoldUnholdId,
          assyName: rowData.PIDCode,
          rohsIcon: rowData.rohsIcon,
          rohsName: rowData.rohsName,
          partID: row.entity.partID
        };
        DialogFactory.dialogService(
          TRAVELER.WORKORDER_HOLD_UNHOLD_MODEL_CONTROLLER,
          TRAVELER.WORKORDER_HOLD_UNHOLD_MODEL_VIEW,
          ev,
          workorderStatus).then(() => {
            updateOneRowOfGrid(rowData.woID);
          }, () => { //Cancel Section
          });
      };

      const connectSocket = () => {
        socketConnectionService.on('message:receive', notificationReceiveListener);
      };
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });
      const removeSocketListener = () => {
        socketConnectionService.removeListener('message:receive');
      };


      function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

      function notificationReceive(message) {
        switch (message.event) {
          case CORE.NOTIFICATION_MESSAGETYPE.WO_START.TYPE:
          case CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE: {
            if (message.data.woID) {
              updateOneRowOfGrid(message.data.woID);
            }
          }
        }
      }
      // on disconnect socket.io
      socketConnectionService.on('disconnect', () => {
        removeSocketListener();
      });

      /* to go at work order details page  */
      vm.goToWorkorderDetails = (woID) => {
        BaseService.goToWorkorderDetails(woID);
        return false;
      };

      // on page load bind autocomplete of customer.
      const autocompletePromise = [vm.getAssyTypeList(), vm.getStandard()];

      vm.cgBusyLoading = $q.all(autocompletePromise);
      //go to rohs master page
      vm.goToRoHSList = () => {
        BaseService.goToRohsList();
        return false;
      };
      //go to assy type list
      vm.goToAssyTypeList = () => {
        BaseService.goToAssyTypeList();
        return false;
      };
      //go to standard page'
      vm.goToStandardList = () => {
        BaseService.goToStandardList();
        return false;
      };
      //go to customer edit
      vm.goToCustomer = (id) => {
        if (id) {
          BaseService.goToCustomer(id);
        }
      };
      //go to customer list page
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
        return false;
      };
      //go to sales order list page
      vm.goToSalesOrderList = () => {
        BaseService.goToSalesOrderList();
        return false;
      };
      //go to part master list page
      vm.goToPartMasterList = () => {
        BaseService.goToPartList();
        return false;
      };
      //go to operation list
      vm.goToOperationList = () => {
        BaseService.goToOperationList();
        return false;
      };
      //go to personnel page
      vm.goToEmployeeList = () => {
          BaseService.goToPersonnelList();
        return false;
      };
      //go to equipment page list
      vm.goToEquipmentList = () => {
        BaseService.goToEquipmentWorkstationList();
        return false;
      };
      //go to UMID list page
      vm.goToUMIDList = () => {
        BaseService.goToUMIDList();
        return false;
      };
      vm.applyFilters = () => {
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        if (vm.partId) {
          const checkAdded = _.filter(vm.filter.assyIds, (det) => det.id === vm.partId);
          if (!checkAdded || checkAdded.length === 0) {
            vm.filter.assyIds.push({
              id: vm.partId,
              PIDCode: $scope.$parent.$parent.vm.displayComponentDetail.PIDCode,
              mfgCodeID: $scope.$parent.$parent.vm.displayComponentDetail.mfgcodeID,
              isDisable: true
            });
          }
        }
        setFilteredLabels(true);
        vm.loadData();
      };
      //reset all filter details.
      vm.resetAllFilter = () => {
        vm.filter = {
          woSubStatus: Array.isArray(vm.woSubStatusDetail) ? [vm.woSubStatusDetail[0].Key.toString(), vm.woSubStatusDetail[1].Key.toString(), vm.woSubStatusDetail[4].Key.toString(), vm.woSubStatusDetail[5].Key.toString(), vm.woSubStatusDetail[7].Key.toString(), vm.woSubStatusDetail[8].Key.toString()] : [],
          wotype: CORE.DEFAULT_ALL,
          cleanType: CORE.DEFAULT_ALL,
          openClosed: CORE.DEFAULT_ALL,
          fluxTypeAll: true,
          customers: [],
          salesorders: [],
          assyIds: [],
          nicknames: [],
          operations: [],
          employees: [],
          equipments: [],
          materials: [],
          Umids: []
        };
        if (vm.partId) {
          vm.filter.assyIds.push({
            id: vm.partId,
            PIDCode: $scope.$parent.$parent.vm.displayComponentDetail.PIDCode,
            mfgCodeID: $scope.$parent.$parent.vm.displayComponentDetail.mfgcodeID,
            isDisable: true
          });
        }
        vm.clearStandardsSearchText();
        vm.clearRohsSearchText();
        vm.clearAssemblyTypeSearchText();
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        setFilteredLabels(true);
        vm.loadData();
      };
      //clear workorder status search detail
      vm.clearWorkorderStatusFilter = () => {
        vm.filter.woSubStatus = [];
      };
      //clear workorder type search deatil
      vm.clearwoTypeFilter = () => {
        vm.filter.woTypes = [];
      };
      //clear rohs filter
      vm.clearRoHSFilter = () => {
        vm.filter.rohsStatus = [];
      };
      //clear assy type filter list
      vm.clearAssyTypeFilter = () => {
        vm.filter.assyTypeIds = [];
      };
      //clear standard filter
      vm.clearStandardFilter = () => {
        vm.filter.standards = [];
      };

      //search standard
      vm.searchStandardsList = () => {
        vm.filter.standards = [];
        const standardsListToFilter = angular.copy(vm.standardsList);
        vm.standardsListToDisplay = vm.standardsSearchText ? _.filter(standardsListToFilter, (item) => item.fullName.toLowerCase().contains(vm.standardsSearchText.toLowerCase())) : standardsListToFilter;
      };
      //clear standard search text
      vm.clearStandardsSearchText = () => {
        vm.standardsSearchText = null;
        vm.searchStandardsList();
      };
      //search rohs
      vm.searchRohsList = () => {
        vm.filter.rohsStatus = [];
        const rohsListToFilter = angular.copy(vm.rohsList);
        vm.rohsListToDisplay = vm.rohsSearchText ? _.filter(rohsListToFilter, (item) => item.name.toLowerCase().contains(vm.rohsSearchText.toLowerCase())) : rohsListToFilter;
      };
      //clear rohs search text
      vm.clearRohsSearchText = () => {
        vm.rohsSearchText = null;
        vm.searchRohsList();
      };
      //search assy type
      vm.searchAssemblyTypeList = () => {
        var assemblyTypeListToFilter;
        vm.filter.assyTypeIds = [];
        assemblyTypeListToFilter = angular.copy(vm.assemblyTypeList);
        vm.assemblyTypeListToDisplay = vm.assemblyTypeSearchText ? _.filter(assemblyTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.assemblyTypeSearchText.toLowerCase())) : assemblyTypeListToFilter;
      };
      //clear assy type
      vm.clearAssemblyTypeSearchText = () => {
        vm.assemblyTypeSearchText = null;
        vm.searchAssemblyTypeList();
      };
      //get filter workorder list
      vm.changeTogetWorkorder = () => {
        setFilteredLabels(true);
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };
      //search customer query
      vm.querycustomerSearch = (criteria) => {
        const searchObj = {
          searchQuery: returnCommonSearch(criteria),
          iscustordisty: 1,
          type: 'MFG'
        };
        return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
          if (mfgcodes && mfgcodes.data) {
            mfgcodes.data = _.differenceWith(mfgcodes.data, vm.filter.customers, (arrValue, othValue) => arrValue.id === othValue.id);
            return mfgcodes.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search sp po query
      vm.querySOPOSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria),
          customerIds: _.map(vm.filter.customers, 'id').join(',')
        };
        return WorkorderFactory.getSoPoFilterList().query(searchObj).$promise.then((soporesponse) => {
          if (soporesponse && soporesponse.data) {
            soporesponse.data = _.differenceWith(soporesponse.data, vm.filter.salesorders, (arrValue, othValue) => arrValue.id === othValue.id);
            return soporesponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search assy query
      vm.queryAssySearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria),
          customerIds: _.map(vm.filter.customers, 'id').join(',')
        };
        return WorkorderFactory.getAssyIdFilterList().query(searchObj).$promise.then((assyresponse) => {
          if (assyresponse && assyresponse.data) {
            assyresponse.data = _.differenceWith(assyresponse.data, vm.filter.assyIds, (arrValue, othValue) => arrValue.id === othValue.id);
            return assyresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search nick name query
      vm.queryNicknameSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria),
          customerIds: _.map(vm.filter.customers, 'id').join(',')
        };
        return WorkorderFactory.getNickNameFilterList().query(searchObj).$promise.then((nickresponse) => {
          if (nickresponse && nickresponse.data) {
            nickresponse.data = _.differenceWith(nickresponse.data, vm.filter.nicknames, (arrValue, othValue) => arrValue.nickname === othValue.nickname);
            return nickresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search operation name query
      vm.queryOperationSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria)
        };
        return WorkorderFactory.getOperationFilterList().query(searchObj).$promise.then((operationresponse) => {
          if (operationresponse && operationresponse.data) {
            operationresponse.data = _.differenceWith(operationresponse.data, vm.filter.operations, (arrValue, othValue) => arrValue.opid === othValue.opid);
            return operationresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search employee name query
      vm.queryEmployeeSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria)
        };
        return WorkorderFactory.getEmployeeFilterList().query(searchObj).$promise.then((empresponse) => {
          if (empresponse && empresponse.data) {
            empresponse.data = _.differenceWith(empresponse.data, vm.filter.employees, (arrValue, othValue) => arrValue.id === othValue.id);
            _.map(empresponse.data, (data) => {
              if (data.profileImg) {
                data.profileImg = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.EMPLOYEE_BASE_PATH, data.profileImg);
              }
              else {
                data.profileImg = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.EMPLOYEE_DEFAULT_IMAGE_PATH, 'profile.jpg');
              }
            });
            return empresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search equipment name query
      vm.queryEquipmentSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria)
        };
        return WorkorderFactory.getEquipmentFilterList().query(searchObj).$promise.then((eqpresponse) => {
          if (eqpresponse && eqpresponse.data) {
            eqpresponse.data = _.differenceWith(eqpresponse.data, vm.filter.equipments, (arrValue, othValue) => arrValue.eqpID === othValue.eqpID);
            _.map(eqpresponse.data, (data) => {
              if (data.profileImg) {
                data.profileImg = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.EQUIPMENT_BASE_PATH, data.profileImg);
              }
              else {
                data.profileImg = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.EQUIPMENT_DEFAULT_IMAGE_PATH, 'profile.jpg');
              }
            });
            return eqpresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search material,supplier and tools name query
      vm.queryMaterialSupplierSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria)
        };
        return WorkorderFactory.getMaterialSupplierFilterList().query(searchObj).$promise.then((materialresponse) => {
          if (materialresponse && materialresponse.data) {
            materialresponse.data = _.differenceWith(materialresponse.data, vm.filter.materials, (arrValue, othValue) => arrValue.id === othValue.id);
            return materialresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //give common search
      const returnCommonSearch = (criteria) => {
        const replacedString = criteria.replace('\\', '\\\\');
        criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
        return criteria.length > 100 ? criteria.substring(0, 100) : criteria;
      };

      //bind filter details
      const bindFilterDetail = () => {
        var certificateStandards = [];
        var standardsClass = [];
        vm.isNoDatainFilter = false;

        if (vm.filter.woSubStatus && vm.filter.woSubStatus.length > 0) {
          vm.pagingInfo.woSubStatusIds = vm.filter.woSubStatus.join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.woSubStatusIds = null;
        }
        if (vm.filter.woTypes && vm.filter.woTypes.length > 0) {
          vm.pagingInfo.woTypeIds = vm.filter.woTypes.join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.woTypeIds = null;
        }
        if (vm.filter.rohsStatus && vm.filter.rohsStatus.length > 0) {
          vm.pagingInfo.rohsStatusIds = vm.filter.rohsStatus.join(',');
          vm.isNoDatainFilter = true;
        } else { vm.pagingInfo.rohsStatusIds = null; };
        if (vm.filter.assyTypeIds && vm.filter.assyTypeIds.length > 0) {
          vm.pagingInfo.assyTypeIds = vm.filter.assyTypeIds.join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.assyTypeIds = null;
        }
        if (vm.filter.standards && vm.filter.standards.length > 0) {
          certificateStandards = [];
          standardsClass = [];
          _.each(vm.filter.standards, (item) => {
            if (item.contains(':')) {
              standardsClass.push(item.split(':')[1]);
            }
            else {
              certificateStandards.push(item);
            }
          });
          vm.pagingInfo.stdCertificationIds = certificateStandards.join(',');
          vm.pagingInfo.stdclassIds = standardsClass.join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.stdCertificationIds = null;
          vm.pagingInfo.stdclassIds = null;
        }
        if (vm.filter.pendingSoMapping) {
          vm.pagingInfo.isPendingSoMapping = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isPendingSoMapping = false;
        }
        if (vm.filter.isPendingkitMapping) {
          vm.pagingInfo.isPendingkitMapping = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isPendingkitMapping = false;
        }
        if (vm.filter.isTrackBySerialNumber) {
          vm.pagingInfo.isTrackBySerialNumber = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isTrackBySerialNumber = false;
        }
        if (vm.filter.isRunningwo) {
          vm.pagingInfo.isRunningwo = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isRunningwo = false;
        }
        if (vm.filter.isrushJob) {
          vm.pagingInfo.isrushJob = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isrushJob = false;
        }
        if (vm.filter.isstoppedWo) {
          vm.pagingInfo.isstoppedWo = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isstoppedWo = false;
        }
        if (vm.filter.wotype) {
          if (vm.filter.wotype === CORE.DEFAULT_ALL) {
            vm.pagingInfo.isnewWo = null;
          } else {
            vm.pagingInfo.isnewWo = true;
            vm.isNoDatainFilter = true;
          }
        } else {
          vm.pagingInfo.isnewWo = false;
          vm.isNoDatainFilter = true;
        }
        vm.pagingInfo.isWaterSoluble = null;
        vm.pagingInfo.isNoClean = null;
        vm.pagingInfo.isFluxNotApplicable = null;
        if (vm.filter.fluxTypeAll === true) {
          vm.pagingInfo.isWaterSoluble = null;
          vm.pagingInfo.isNoClean = null;
          vm.pagingInfo.isFluxNotApplicable = null;
        }
        if (vm.filter.isFluxNotApplicable === true) {
          vm.pagingInfo.isFluxNotApplicable = true;
          vm.isNoDatainFilter = true;
        }
        if (vm.filter.isNoClean === true) {
          vm.pagingInfo.isNoClean = true;
          vm.isNoDatainFilter = true;
        }
        if (vm.filter.isWaterSoluble === true) {
          vm.pagingInfo.isWaterSoluble = true;
          vm.isNoDatainFilter = true;
        }

        if (vm.filter.isecodfm) {
          vm.pagingInfo.isecodfm = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isecodfm = false;
        }
        if (vm.filter.openClosed) {
          if (vm.filter.openClosed === CORE.DEFAULT_ALL) {
            vm.pagingInfo.isOpenWo = null;
          } else {
            vm.pagingInfo.isOpenWo = true;
            vm.isNoDatainFilter = true;
          }
        } else {
          vm.pagingInfo.isOpenWo = false;
          vm.isNoDatainFilter = true;
        }
        if (vm.filter.customers && vm.filter.customers.length > 0) {
          vm.pagingInfo.customerIds = _.map(vm.filter.customers, 'id').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.customerIds = null;
        }
        if (vm.filter.salesorders && vm.filter.salesorders.length > 0) {
          vm.pagingInfo.salesOrderdetails = _.map(vm.filter.salesorders, 'id').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.salesOrderdetails = null;
        }

        if (vm.filter.nicknames && vm.filter.nicknames.length > 0) {
          vm.pagingInfo.assyNicknameIds = [];
          _.each(vm.filter.nicknames, (item) => {
            var replacedString = item.nickname.replace('\\', '\\\\');
            replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
            vm.pagingInfo.assyNicknameIds.push(replacedString);
          });
          vm.pagingInfo.assyNicknameIds = '\'' + vm.pagingInfo.assyNicknameIds.join('\',\'') + '\'';
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.assyNicknameIds = null;
        }

        if (vm.filter.assyIds && vm.filter.assyIds.length > 0) {
          vm.pagingInfo.assyIds = _.map(vm.filter.assyIds, 'id').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.assyIds = null;
        }

        if (vm.filter.operations && vm.filter.operations.length > 0) {
          vm.pagingInfo.operationIds = _.map(vm.filter.operations, 'opid').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.operationIds = null;
        }
        if (vm.filter.employees && vm.filter.employees.length > 0) {
          vm.pagingInfo.employeeIds = _.map(vm.filter.employees, 'id').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.employeeIds = null;
        }
        if (vm.filter.equipments && vm.filter.equipments.length > 0) {
          vm.pagingInfo.equipmentIds = _.map(vm.filter.equipments, 'eqpID').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.equipmentIds = null;
        }
        if (vm.filter.materials && vm.filter.materials.length > 0) {
          vm.pagingInfo.materialIds = _.map(vm.filter.materials, 'id').join(',');
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.materialIds = null;
        }
        if (vm.filter.Umids && vm.filter.Umids.length > 0) {
          vm.pagingInfo.umidIds = [];
          _.each(vm.filter.Umids, (item) => {
            var replacedString = item.replace('\\', '\\\\');
            replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
            vm.pagingInfo.umidIds.push(replacedString);
          });
          vm.pagingInfo.umidIds = '\'' + vm.pagingInfo.umidIds.join('\',\'') + '\'';
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.umidIds = null;
        }
        if (vm.filter.isInterBuildFilter) {
          vm.pagingInfo.isInterBuildFilter = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isInterBuildFilter = false;
        }
        if (vm.filter.isKitNotRequired) {
          vm.pagingInfo.isKitNotRequired = true;
          vm.isNoDatainFilter = true;
        } else {
          vm.pagingInfo.isKitNotRequired = false;
        }
      };

      const getFilterTooltipWithoutModel = (selectedModel, valueFieldName) => {
        var maxTooltipLimit = 10;
        var isTooltipGreatrtthenLimit = false;
        var moreTooltipText = '<br />more...';
        var toolTipText = '';
        if (selectedModel && selectedModel.length > 0) {
          toolTipText = selectedModel.map((a) => a[valueFieldName]);
          if (toolTipText && toolTipText.length > maxTooltipLimit) {
            toolTipText = toolTipText.splice(0, maxTooltipLimit);
            isTooltipGreatrtthenLimit = true;
          }
          return toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '');
        } else {
          return '';
        }
      };

      // set applied filter chip with tool tip
      const setFilteredLabels = (canReGenerateTootip) => {
        vm.workorderAdvancedFilters.Status.isDeleted = !(vm.filter.woSubStatus && vm.filter.woSubStatus.length > 0);
        vm.workorderAdvancedFilters.WoType.isDeleted = !(vm.filter.woTypes && vm.filter.woTypes.length > 0);
        vm.workorderAdvancedFilters.AssyType.isDeleted = !(vm.filter.assyTypeIds && vm.filter.assyTypeIds.length > 0);
        vm.workorderAdvancedFilters.RoHS.isDeleted = !(vm.filter.rohsStatus && vm.filter.rohsStatus.length > 0);
        vm.workorderAdvancedFilters.Standards.isDeleted = !(vm.filter.standards && vm.filter.standards.length > 0);
        vm.workorderAdvancedFilters.PendingSOMapping.isDeleted = !(vm.filter.pendingSoMapping);
        vm.workorderAdvancedFilters.PendingKitMapping.isDeleted = !(vm.filter.isPendingkitMapping);
        vm.workorderAdvancedFilters.TrackBySerialNumber.isDeleted = !(vm.filter.isTrackBySerialNumber);
        vm.workorderAdvancedFilters.InternalBuildOnly.isDeleted = !(vm.filter.isInterBuildFilter);
        vm.workorderAdvancedFilters.ValidateUMIDWithBomWOutKit.isDeleted = !(vm.filter.isKitNotRequired);
        vm.workorderAdvancedFilters.RevisedWo.isDeleted = !(vm.filter.wotype === true);
        vm.workorderAdvancedFilters.NewWo.isDeleted = !(vm.filter.wotype === false);
        vm.workorderAdvancedFilters.FluxType.isDeleted = !(vm.filter.isFluxNotApplicable || vm.filter.isNoClean || vm.filter.isWaterSoluble);
        vm.workorderAdvancedFilters.AppliedECO.isDeleted = !(vm.filter.isecodfm);
        // vm.workorderAdvancedFilters.Closed.isDeleted = !((vm.filter.openClosed === false) || (vm.filter.openClosed === true) );
        vm.workorderAdvancedFilters.RushJob.isDeleted = !(vm.filter.isrushJob);
        vm.workorderAdvancedFilters.RunningWorkOrder.isDeleted = !(vm.filter.isRunningwo);
        vm.workorderAdvancedFilters.StoppedWorkorder.isDeleted = !(vm.filter.isstoppedWo);
        vm.workorderAdvancedFilters.Customer.isDeleted = !(vm.filter.customers && vm.filter.customers.length > 0);
        vm.workorderAdvancedFilters.PONumber.isDeleted = !(vm.filter.salesorders && vm.filter.salesorders.length > 0);
        vm.workorderAdvancedFilters.AssyId.isDeleted = !(vm.filter.assyIds && vm.filter.assyIds.length > 0);
        vm.workorderAdvancedFilters.Operation.isDeleted = !(vm.filter.operations && vm.filter.operations.length > 0);
        vm.workorderAdvancedFilters.NickName.isDeleted = !(vm.filter.nicknames && vm.filter.nicknames.length > 0);
        vm.workorderAdvancedFilters.Personnel.isDeleted = !(vm.filter.employees && vm.filter.employees.length > 0);
        vm.workorderAdvancedFilters.Equipment.isDeleted = !(vm.filter.equipments && vm.filter.equipments.length > 0);
        vm.workorderAdvancedFilters.SuppliesMaterialsTools.isDeleted = !(vm.filter.materials && vm.filter.materials.length > 0);
        vm.workorderAdvancedFilters.UMIDUsed.isDeleted = !(vm.filter.Umids && vm.filter.Umids.length > 0);
        // set tool tip  if filter applied
        if (canReGenerateTootip) {
          vm.workorderAdvancedFilters.Status.tooltip = getFilterTooltip(vm.woSubStatusList, vm.filter.woSubStatus, 'ID', 'Name');
          vm.workorderAdvancedFilters.WoType.tooltip = getFilterTooltip(vm.woTypeList, vm.filter.woTypes, 'value', 'requestType');
          vm.workorderAdvancedFilters.AssyType.tooltip = getFilterTooltip(vm.assemblyTypeListToDisplay, vm.filter.assyTypeIds, 'id', 'name');
          vm.workorderAdvancedFilters.RoHS.tooltip = getFilterTooltip(vm.rohsListToDisplay, vm.filter.rohsStatus, 'id', 'name');
          vm.workorderAdvancedFilters.Standards.tooltip = getFilterTooltip(vm.standardsListToDisplay, vm.filter.standards, 'certificateStandardID', 'fullName');
          vm.workorderAdvancedFilters.RevisedWo.tooltip = vm.filter.wotype === true ? 'Revised WO' : '';
          vm.workorderAdvancedFilters.RevisedWo.tooltip = vm.filter.wotype === false ? 'New WO' : '';

          vm.workorderAdvancedFilters.FluxType.tooltip = '';
          if (vm.filter.isFluxNotApplicable) {
            vm.workorderAdvancedFilters.FluxType.tooltip = stringFormat('{0}<br/>{1}', 'Not Applicable', vm.workorderAdvancedFilters.FluxType.tooltip || '');
          }
          if (vm.filter.isNoClean) {
            vm.workorderAdvancedFilters.FluxType.tooltip = stringFormat('{0}<br/>{1}', 'No-Clean', vm.workorderAdvancedFilters.FluxType.tooltip || '');
          }
          if (vm.filter.isWaterSoluble) {
            vm.workorderAdvancedFilters.FluxType.tooltip = stringFormat('{0}<br/>{1}', 'Water Soluble', vm.workorderAdvancedFilters.FluxType.tooltip || '');
          }

          vm.workorderAdvancedFilters.Customer.tooltip = getFilterTooltipWithoutModel(vm.filter.customers, 'mfgCodeName');
          vm.workorderAdvancedFilters.PONumber.tooltip = getFilterTooltipWithoutModel(vm.filter.salesorders, 'posoNumber');
          vm.workorderAdvancedFilters.AssyId.tooltip = getFilterTooltipWithoutModel(vm.filter.assyIds, 'PIDCode');
          vm.workorderAdvancedFilters.Operation.tooltip = getFilterTooltipWithoutModel(vm.filter.operations, 'opName');
          vm.workorderAdvancedFilters.NickName.tooltip = getFilterTooltipWithoutModel(vm.filter.nicknames, 'nickname');
          vm.workorderAdvancedFilters.Personnel.tooltip = getFilterTooltipWithoutModel(vm.filter.employees, 'fullName');
          vm.workorderAdvancedFilters.Equipment.tooltip = getFilterTooltipWithoutModel(vm.filter.equipments, 'assetName');
          vm.workorderAdvancedFilters.SuppliesMaterialsTools.tooltip = getFilterTooltipWithoutModel(vm.filter.materials, 'PIDCode');
          vm.workorderAdvancedFilters.UMIDUsed.tooltip = vm.filter.Umids;
        }
        //set assy filter disable in case call from part master
        if (vm.partId) {
          vm.workorderAdvancedFilters.AssyId.isDisable = true;
        }
        vm.numberOfMasterFiltersApplied = _.filter(vm.workorderAdvancedFilters, (num) => num.isDeleted === false).length;
      };
      setFilteredLabels(true);

      vm.clearAllFilter = () => {
        vm.filter = {
          woSubStatus: [],
          wotype: CORE.DEFAULT_ALL,
          cleanType: CORE.DEFAULT_ALL,
          openClosed: CORE.DEFAULT_ALL,
          fluxTypeAll: true,
          customers: [],
          salesorders: [],
          assyIds: [],
          nicknames: [],
          operations: [],
          employees: [],
          equipments: [],
          materials: [],
          Umids: []
        };
        if (vm.partId) {
          vm.filter.assyIds.push({
            id: vm.partId,
            PIDCode: $scope.$parent.$parent.vm.displayComponentDetail.PIDCode,
            mfgCodeID: $scope.$parent.$parent.vm.displayComponentDetail.mfgcodeID,
            isDisable: true
          });
        }
        vm.clearStandardsSearchText();
        vm.clearRohsSearchText();
        vm.clearAssemblyTypeSearchText();
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        setFilteredLabels(true);
        vm.loadData();
      };

      vm.removeAppliedFilter = (item, index) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.workorderAdvancedFilters.Status.value:
              vm.filter.woSubStatus = [];
              break;
            case vm.workorderAdvancedFilters.WoType.value:
              vm.filter.woTypes = [];
              break;
            case vm.workorderAdvancedFilters.AssyType.value:
              vm.filter.assyTypeIds = [];
              break;
            case vm.workorderAdvancedFilters.RoHS.value:
              vm.filter.rohsStatus = [];
              break;
            case vm.workorderAdvancedFilters.Standards.value:
              // vm.clearStandardsSearchText();
              vm.filter.standards = [];
              break;
            case vm.workorderAdvancedFilters.PendingSOMapping.value:
              vm.filter.pendingSoMapping = null;
              break;
            case vm.workorderAdvancedFilters.PendingKitMapping.value:
              vm.filter.isPendingkitMapping = null;
              break;
            case vm.workorderAdvancedFilters.TrackBySerialNumber.value:
              vm.filter.isTrackBySerialNumber = null;
              break;
            case vm.workorderAdvancedFilters.InternalBuildOnly.value:
              vm.filter.isInterBuildFilter = null;
              break;
            case vm.workorderAdvancedFilters.ValidateUMIDWithBomWOutKit.value:
              vm.filter.isKitNotRequired = null;
              break;
            case vm.workorderAdvancedFilters.RevisedWo.value:
            case vm.workorderAdvancedFilters.NewWo:
              vm.filter.wotype = 'All';
              break;
            case vm.workorderAdvancedFilters.FluxType.value:
              vm.filter.isFluxNotApplicable = false;
              vm.filter.isNoClean = false;
              vm.filter.isWaterSoluble = false;
              vm.filter.fluxTypeAll = true;
              break;
            case vm.workorderAdvancedFilters.AppliedECO.value:
              vm.filter.isecodfm = null;
              vm.filter.openClosed = 'All';
              break;
            case vm.workorderAdvancedFilters.RushJob.value:
              vm.filter.isrushJob = null;
              break;
            case vm.workorderAdvancedFilters.RunningWorkOrder.value:
              vm.filter.isRunningwo = null;
              break;
            case vm.workorderAdvancedFilters.StoppedWorkorder.value:
              vm.filter.isstoppedWo = null;
              break;
            case vm.workorderAdvancedFilters.Customer.value:
              vm.filter.customers = [];
              break;
            case vm.workorderAdvancedFilters.PONumber.value:
              vm.filter.salesorders = [];
              break;
            case vm.workorderAdvancedFilters.AssyId.value:
              vm.filter.assyIds = [];
              break;
            case vm.workorderAdvancedFilters.Operation.value:
              vm.filter.operations = [];
              break;
            case vm.workorderAdvancedFilters.NickName.value:
              vm.filter.nicknames = [];
              break;
            case vm.workorderAdvancedFilters.Personnel.value:
              vm.filter.employees = [];
              break;
            case vm.workorderAdvancedFilters.Equipment.value:
              vm.filter.equipments = [];
              break;
            case vm.workorderAdvancedFilters.SuppliesMaterialsTools.value:
              vm.filter.materials = [];
              break;
            case vm.workorderAdvancedFilters.UMIDUsed.value:
              vm.filter.Umids = [];
              break;
          }
          vm.applyFilters();
        }
      };

      // Usage Material Reprot- Open filter pop up
      vm.usageMaterialReport = (row, ev) => {
        const data = {
          woID: row.woID,
          woNumber: row.woNumber,
          woSubStatus: row.woSubStatusConvertedValue,
          fromGenerated: CORE.UsageReportGeneratedFrom.WO, //generated from required at SP level
          PIDCode: row.PIDCode,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsName,
          partID: row.partID
        };
        DialogFactory.dialogService(
          WORKORDER.USAGE_MATERIAL_REPORT_POPUP_CONTROLLER,
          WORKORDER.USAGE_MATERIAL_REPORT_POPUP_VIEW,
          ev,
          data).then(() => { // Success Section
          }, () => { // Cancel  Section
          }).catch((err) => BaseService.getErrorLog(err));
      };

      const checkWOInSpecificStatusNotAllowedToChange = (woDet) => woDet.woSubStatus === CORE.WOSTATUS.COMPLETED || woDet.woSubStatus === CORE.WOSTATUS.VOID || woDet.woSubStatus === CORE.WOSTATUS.TERMINATED;

      // open work order number build history pop up
      vm.viewWONumberBuildHistory = (event) => {
        const data = {
          partID: vm.partId || null
        };
        if ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.vm && $scope.$parent.$parent.vm.displayComponentDetail) {
          data.assyNickName = $scope.$parent.$parent.vm.displayComponentDetail.nickName || null;
        }

        DialogFactory.dialogService(
          CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER,
          CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW,
          event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.TerminateWorkOrder = (row, event) => {
        const pageRightsAccessDet = {
          popupAccessRoutingState: [WORKORDER.MANAGE_WORKORDER_DETAILS_STATE],
          pageNameAccessLabel: CORE.PageName.Workorder
        };
        if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
          let data = {};
          if (row) {
            data = {
              customerID: row.customerID ? row.customerID : null,
              subAssy: {
                id: row.PIDCode ? row.partID : null
              },
              salesOrderDetailId: row.salesOrderDetailId ? row.salesOrderDetailId : null,
              woID: row.woID,
              woNumber: row.woNumber,
              isFromList: 2 // for terminate workorder
            };
          }
          DialogFactory.dialogService(
            WORKORDER.ADD_WORKORDER_CONTROLLER,
            WORKORDER.ADD_WORKORDER_VIEW,
            event,
            data).then(() => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData),
              (error) => BaseService.getErrorLog(error));
        }
      };

      angular.element(() => {
        /// $scope.$parent.vm.frmRequestForShip = vm.frmRequestForShip;
        $scope.$parent.vm.addRecord = vm.addRecord;
        $scope.$parent.vm.isNoDataFound = vm.isNoDataFound;
        $scope.$parent.vm.countTotalRowsOfWOTable = vm.countTotalRowsOfWOTable;
        // BaseService.currentPageForms.push(vm.frmRequestForShip);
      });

      // view assembly stock popup
      vm.ViewAssemblyStockStatus = (row, $event) => {
        const data = {
          partID: row.entity.partID,
          mfgPN: row.entity.mfgPN,
          woID: row.entity.woID,
          rohsIcon: row.entity.rohsIcon,
          rohsName: row.entity.rohsName,
          PIDCode: row.entity.PIDCode
        };
        DialogFactory.dialogService(
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
          event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          }, (err) => BaseService.getErrorLog(err));
      };
    }
  }
})();

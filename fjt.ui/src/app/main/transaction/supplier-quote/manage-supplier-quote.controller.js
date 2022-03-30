(function () {
  'use strict';

  angular
    .module('app.transaction.supplierquote')
    .controller('ManageSupplierQuoteController', ManageSupplierQuoteController);

  function ManageSupplierQuoteController($state, $q, $stateParams, $timeout, TRANSACTION, $scope, CORE, USER, BaseService, SupplierQuoteFactory,
    CustomerFactory, DialogFactory, ComponentFactory, ManageMFGCodePopupFactory, PackingSlipFactory) {
    const vm = this;
    vm.supplierQuoteStaus = CORE.SupplierQuoteWorkingStatus;
    vm.supplierQuote = {};
    vm.supplierQuoteCopy = {};
    vm.supplierQuotePartDetails = {};
    vm.supplierQuotePartDetails.isActive = true;
    vm.supplierQuotePartDetails.supplierQuoteMstID = $stateParams.id;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.supplierQuote.id = $stateParams.id || null;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    const componentobj = $stateParams.keywords ? $stateParams.keywords.split('###') : [];
    const searchMFR = componentobj.length > 0 ? componentobj[0] : null;
    const searchMFRPN = componentobj.length > 1 ? componentobj[1] : null;
    vm.isUpdatable = true;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_ASSEMBLY;
    vm.IsPickerOpen[vm.DATE_PICKER.quoteDate] = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.documentTabName = CORE.DocumentTabName;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.supplierQuoteTabs = TRANSACTION.SupplierQuoteTabs;
    vm.entityName = CORE.AllEntityIDS.Supplier_Quote.Name;
    vm.supplierQuoteDetTitle = 'Add';
    vm.autoFocusComponent = false;
    vm.isUpdatable = true;
    vm.isPartPricing = true;
    vm.isPartPricingHistory = true;
    vm.isViewRequirementReference = true;
    vm.attributeTemplateList = [];
    vm.IdOfSelectMultipleBarcode = null;
    vm.isScanLabel = false;
    vm.CORE = CORE;
    vm.loginUser = BaseService.loginUser;
    vm.autoFocusSupplierComponent = false;
    vm.billAddrViewActionBtnDet = vm.shipAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contPersnBillViewActionBtnDet = vm.contPersnShipViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.contPersnBillViewActionBtnDet.Delete.isVisible = vm.contPersnShipViewActionBtnDet.Delete.isVisible = false;
    vm.selectedTabIndex = 0;
    if ($state.current.name === TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_DOCUMENTS_STATE) {
      vm.tabName = vm.supplierQuoteTabs.Documents.Name;
      vm.selectedTabIndex = 1;
      vm.IsDocumentTab = true;
    } else {
      vm.tabName = vm.supplierQuoteTabs.Detail.Name;
      vm.selectedTabIndex = 0;
      vm.IsDocumentTab = false;
    }
    if (!vm.supplierQuote.id) {
      vm.autoFocusSupplier = true;
      vm.supplierQuote.quoteDate = new Date();
      vm.supplierQuote.quoteStatus = vm.supplierQuoteStaus[0].ID;
      vm.label = CORE.OPSTATUSLABLEPUBLISH;
    } else {
      vm.autoFocusSupplier = false;
      vm.autoFocusMfg = false;
      setFocus('scanLabel');
    }

    vm.viewBillAddrOtherDet = {
      addressType: CORE.AddressType.BusinessAddress,
      customerId: vm.supplierQuote.supplierID,
      mfgType: CORE.MFG_TYPE.DIST,
      showAddressEmptyState: false,
      addressBlockTitle: vm.LabelConstant.Address.SupplierBusinessAddress,
      companyName: '',
      refTransID: '',
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: ''
    };

    vm.viewShipAddrOtherDet = {
      addressType: CORE.AddressType.ShippingAddress,
      customerId: vm.supplierQuote.supplierID,
      mfgType: CORE.MFG_TYPE.DIST,
      showAddressEmptyState: false,
      addressBlockTitle: vm.LabelConstant.Address.ShippingAddress,
      companyName: '',
      refTransID: '',
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: ''
    };

    /* to display Line shipping comments */
    vm.showPartDescription = (row, ev) => {
      const popupData = {
        title: 'Description',
        description: row.entity.mfgPNDescription
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /** Paging detail for Part Detail grid */
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        pageSize: CORE.UIGrid.ItemsPerPage(),
        pageName: CORE.PAGENAME_CONSTANT[33].PageName,
        supplierQuoteMstID: vm.supplierQuote.id
      };
    };
    initPageInfo();

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '170',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="5" row="row" style="overflow: hidden;padding:5px !important;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        maxWidth: '100'
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'mfgName',
        width: '300',
        displayName: CORE.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeID);$event.preventDefault();">{{ row.entity.mfgName }}</a>\
                                        </span> <copy-text label="\'MFR\'" text="row.entity.mfgName" ng-if="row.entity.mfgName"></copy-text></div>'
      },
      {
        field: 'mfgPN',
        displayName: CORE.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.partID" \
                            component-id="row.entity.partID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                            value="row.entity.mfgPN" \
                            is-copy="true" \
                            is-custom-part="row.entity.isCustom || row.entity.isCustomSupplier "\
                            cust-part-number="row.entity.custAssyPN"\
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName" \
                            supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :row.entity.supplier" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: false
      },
      {
        field: 'supplierPN',
        displayName: CORE.LabelConstant.MFG.SupplierPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.supplierPartID" \
                            component-id="row.entity.supplierPartID" \
                            label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.SupplierPN" \
                            value="row.entity.supplierPN" \
                            is-copy="true" \
                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.supplierRohsIcon" \
                            rohs-status="row.entity.supplierRohsName" \
                            is-supplier="true" \
                            supplier-name="(row.entity.isCustom || row.entity.isCustomSupplier) ? null :row.entity.supplier" \
                            is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        allowCellFocus: false
      },
      {
        field: 'scanLabel',
        width: '170',
        displayName: 'Label String',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
      },
      {
        field: 'mfgPNDescription',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: vm.LabelConstant.MFG.MFGPNDescription,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.mfgPNDescription && row.entity.mfgPNDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showPartDescription(row, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'attributeNames',
        width: '250',
        displayName: 'Attributes',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents layout-wrap"> '
          + ' <span class="label-box margin-left-2 mb-5 background-skyblue-pricing" ng-repeat="attibuteName in row.entity.attributeNames">{{attibuteName}}</span> '
          + ' </div> ',
        enableFiltering: false,
        enableSorting: false
        //cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      },
      {
        field: 'pricingCount',
        width: '160',
        displayName: 'Price Record Count',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>'
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.isActive == true ,\
                        \'label-warning\':row.entity.isActive == false }"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        }
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime'
      },
      {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        enableFiltering: false,
        enableSorting: true,
        type: 'datetime'
      },
      {
        field: 'createdby',
        displayName: 'Created By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    vm.sourceHeader.unshift(
      {
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-disabled="vm.isDisable" ng-model="grid.appScope.$parent.vm.apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox class="margin-0" ng-disabled="row.entity.isDisabledDelete" ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setSupplierQuoteRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        allowCellFocus: false,
        maxWidth: '80',
        enableColumnMoving: false,
        manualAddedCheckbox: true
      }
    );

    /** Grid options for Part Detail grid */
    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      CurrentPage: CORE.PAGENAME_CONSTANT[33].PageName,
      exporterCsvFilename: 'SupplierQuotePartDetails.csv'
    };

    /* Retrieve Supplier Quote Part Detail list*/
    vm.loadData = () => {
      if (vm.supplierQuote.id > 0 && !vm.IsDocumentTab) {
        //vm.apply manually set at setSupplierQuoteRemove ,need to reset.
        vm.apply = false;
        vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePartList().query(vm.pagingInfo).$promise.then((response) => {
          vm.sourceData = [];
          if (response.data) {
            vm.sourceData = response.data.SupplierQuotePartList;
            vm.totalSourceDataCount = response.data.Count;
            processPartRecords();
          }
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          if (vm.sourceData && vm.sourceData.length > 0) {
            vm.isAllowedToPublish = _.sumBy(vm.sourceData, (data) => data.pricingCount === 0) > 0 ? false : true;
          } else {
            vm.isAllowedToPublish = false;
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0) {
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
      else {
        vm.sourceData = [];
        vm.totalSourceDataCount = 0;
        vm.isNoDataFound = true;
        vm.emptyState = null;
        $timeout(() => {
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }
    };

    /** Method call for infinite scroll of Supplier Quote Part Detail list */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePartList().query(vm.pagingInfo).$promise.then((response) => {
        vm.sourceData = vm.sourceData.concat(response.data.SupplierQuotePartList);
        vm.currentdata = vm.sourceData.length;
        processPartRecords();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getSupplierQuoteDetail = () => {
      vm.cgBusyLoading = SupplierQuoteFactory.getSupplierQuoteByID().query({ id: vm.supplierQuote.id }).$promise.then((response) => {
        if (response.data && response.data) {
          vm.supplierQuote = response.data;
          vm.supplierQuoteCopy = angular.copy(vm.supplierQuote);
          updateSupplierQuoteStatusLabel(vm.supplierQuote.quoteStatus);
          getAutoCompleteData();
          if (!vm.IsDocumentTab) {
            vm.retrieveSupplierAttributeTemplate();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getSupplierMappingDetails = () => SupplierQuoteFactory.getSupplierList().query({ id: vm.supplierQuote.supplierID }).$promise.then((response) => {
      if (response && response.data) {
        const data = response.data[0];
        vm.supplierQuote.supplierMFRMappingType = data.supplierMFRMappingType;
        vm.supplierQuote.isStrictlyCustomComponent = data.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key ? true : false;
        vm.supplierQuote.mappedManufacturers = _.map(data.supplier_mapping_mstSupplier, 'refMfgCodeMstID');
      }
      return $q.resolve(response);
    }).catch((error) => BaseService.getErrorLog(error));

    const checkMappingValidation = (item) => {
      if (item) {
        $q.all([getSupplierMappingDetails()]).then(() => {
          if (vm.supplierQuote.isStrictlyCustomComponent && !vm.supplierQuote.mappedManufacturers.includes(item.id)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_NOT_MAPPED_WITH_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, 'selected', item.mfgCode);
            const model = {
              messageContent: messageContent,
              btnText: vm.LabelConstant.SupplierQuote.MapSupplier,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL,
              multiple: true
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.autoCompletemfgCode.keyColumnId = null;
                $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
                setFocusByName(vm.autoCompletemfgCode.inputName);
                vm.goToSupplierDetail(vm.supplierQuote.supplierID);
              }
            }, () => {
              vm.autoCompletemfgCode.keyColumnId = null;
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
              setFocusByName(vm.autoCompletemfgCode.inputName);
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.autoCompletecomponent.addData.parentId = item.id;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.checkPartValidation = (partID, supplierPartID, partValidation) => {
      let messageContent;
      const promises = [vm.retrieveSupplierAttributeTemplate()];
      if (!supplierPartID) {
        promises.push(getSupplierMappingDetails());
      }
      $q.all(promises).then(() => {
        if (partValidation) {
          if (partValidation.isGoodPart === CORE.PartCorrectList.CorrectPart) {
            if (partValidation.restrictUsePermanently || partValidation.restrictPackagingUsePermanently) {
              if (partValidation.restrictUsePermanently) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PART);
                messageContent.message = stringFormat(messageContent.message, partValidation.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermanently);
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PACKAGING_PART);
                messageContent.message = stringFormat(messageContent.message, partValidation.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
              }

              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
                vm.supplierQuotePartDetails.partID = vm.supplierQuotePartDetails.supplierID = null;
                if (supplierPartID) {
                  $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, null);
                  vm.autoCompleteSupplierComponent.keyColumnId = null;
                  setFocusByName(vm.autoCompleteSupplierComponent.inputName);
                } else {
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  vm.autoCompletecomponent.keyColumnId = null;
                  setFocusByName(vm.autoCompletecomponent.inputName);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (partValidation.restrictUSEwithpermission || partValidation.restrictPackagingUseWithpermission) {
              const messageContentInfo = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_SLIP);
              if (partValidation.restrictUSEwithpermission) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
                messageContent.message = stringFormat(messageContent.message, partValidation.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
                partValidation.informationMsg = stringFormat('{0} {1}', messageContent.message, messageContentInfo.message);
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_PACKAGING_WITH_PERMISION);
                messageContent.message = stringFormat(messageContent.message, partValidation.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
                partValidation.informationMsg = stringFormat('{0} {1}', messageContent.message, messageContentInfo.message);
              }
              getAuthenticationOfApprovalPart(null, partValidation);
            }
            else if (vm.supplierQuote.isStrictlyCustomComponent && !partValidation.isCustom) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MAPPED_MFRPN_IS_NOT_CUSTOM_PART);
              messageContent.message = stringFormat(messageContent.message, 'selected', partValidation.mfgPN);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then(() => {
                vm.supplierQuotePartDetails.partID = null;
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                vm.autoCompletecomponent.keyColumnId = null;
                setFocusByName(vm.autoCompletecomponent.inputName);
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.checkUniqueSupplierQuotePart(partID, supplierPartID, false);
            }
          }
          else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFRPN_BAD_PART);
            messageContent.message = stringFormat(messageContent.message, partValidation.PIDCode, partValidation.isGoodPart === CORE.PartCorrectList.IncorrectPart ? CORE.PartCorrectLabelList.IncorrectPart : CORE.PartCorrectLabelList.UnknownPart);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
              vm.supplierQuotePartDetails.partID = vm.supplierQuotePartDetails.supplierID = null;
              if (supplierPartID) {
                $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, null);
                vm.autoCompleteSupplierComponent.keyColumnId = null;
                setFocusByName(vm.autoCompleteSupplierComponent.inputName);
              } else {
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                vm.autoCompletecomponent.keyColumnId = null;
                setFocusByName(vm.autoCompletecomponent.inputName);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkUniqueSupplierQuotePart = (partID, supplierPartID, isScannedPart) => {
      if (supplierPartID || partID) {
        const checkObject = {
          supplierQuoteMstID: vm.supplierQuote.id,
          //supplierPartID: supplierPartID,
          partID: partID
        };
        SupplierQuoteFactory.checkUniqueSupplierQuotePart().query(checkObject).$promise.then((response) => {
          if (response.data && response.data.length > 0) {
            if (vm.supplierQuotePartDetails.approvalDetails) {
              vm.supplierQuotePartDetails.approvalDetails = null;
            }
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Manufacturer wise part');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.autoCompletecomponent.keyColumnId = null;
                $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                if (vm.supplierQuotePartDetails.scanLabel && vm.isScanLabel) {
                  vm.supplierQuotePartDetails.scanLabel = null;
                  $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
                  vm.isScanLabel = false;
                  setFocus('scanLabel');
                } else {
                  setFocusByName(vm.autoCompletecomponent.inputName);
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            if (!vm.supplierQuotePartDetails.id) {
              vm.supplierQuotePartDetails.selectedAttributes = vm.selectedAttributes = vm.attributeTemplateList;
            }
            if (isScannedPart) {
              setFocus('isActiveRadio');
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.checkQuoteNumberUnique = () => {
      if (vm.supplierQuote.quoteNumber && vm.autoCompleteSupplier.keyColumnId) {
        const checkObject = {
          id: vm.supplierQuote.id ? vm.supplierQuote.id : null,
          quoteNumber: vm.supplierQuote.quoteNumber,
          supplierID: vm.autoCompleteSupplier.keyColumnId
        };
        SupplierQuoteFactory.checkUniqueSupplierQuoteNumber().query(checkObject).$promise.then((response) => {
          if (response.data && response.data.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, `Supplier wise ${vm.LabelConstant.SupplierQuote.Quote}`);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.supplierQuote.quoteNumber = null;
                setFocus('quoteNumber');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.scanLabel = (e) => {
      $timeout(() => scanlabel(e), true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    const scanlabel = (e) => {
      if (e.keyCode === 13) {
        if (!vm.supplierQuotePartDetails.scanLabel) {
          return;
        }
        vm.IdOfSelectMultipleBarcode = null;
        vm.cgBusyLoading = $q.all([getSupplierMappingDetails(), vm.retrieveSupplierAttributeTemplate()]).then(() => {
          const scanlabel = {
            regxpString: vm.supplierQuotePartDetails.scanLabel,
            supplierID: vm.supplierQuote.isStrictlyCustomComponent ? vm.supplierQuote.supplierID : null
          };
          scanBarcode(scanlabel);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const scanBarcode = (scanlabel) => {
      scanlabel.category = CORE.BarcodeCategory.MFRPN;
      scanlabel.exculdePartStatus = CORE.PartStatusList.InActiveInternal;
      vm.cgBusyLoading = PackingSlipFactory.scanPackingBarcode().save(scanlabel).$promise.then((res) => {
        vm.isScanLabel = true;
        if (res.data && res.data.Component) {
          if (res.data.Component.supplierMfgId && vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId && res.data.Component.supplierMfgId !== vm.autoCompleteSupplier.keyColumnId) {
            const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.autoCompleteSupplier.keyColumnId);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, res.data.Component.supplierMFGPN, objSupplier ? objSupplier.mfgName : '');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.resetSupplierQuoteDetail();
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          }

          if (res.data.Component.restrictUSEwithpermission || res.data.Component.restrictPackagingUseWithpermission) {
            const objPart = res.data.Component;
            objPart.informationMsg = stringFormat('{0} {1}', res.data.Component.restrictUSEwithpermission ? stringFormat(TRANSACTION.PID_RECTRICTED_WITH_PERMISION, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission) : stringFormat(TRANSACTION.PID_RECTRICTED_PACKAGING_WITH_PERMISION, res.data.Component.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission), TRANSACTION.FILL_DETAIL_FOR_SLIP);
            getAuthenticationOfApprovalPart(null, objPart);
          }
          else {
            const objPart = res.data.Component;
            vm.supplierQuotePartDetails.partID = objPart.id;
            if (objPart && objPart.supplierMFGPNID) {
              vm.supplierQuotePartDetails.supplierPartID = vm.autoCompleteSupplierComponent.keyColumnId = objPart.supplierMFGPNID;
              $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, `(${objPart.supplierMFGName}) ${objPart.supplierMFGPN}`);
            } else {
              vm.supplierQuotePartDetails.supplierPartID = null;
            }
            const autocompletePromise = [getMfgSearch({ mfgcodeID: objPart.mfgcodeID }), getComponentDetailsByMfg({ id: objPart.id, mfgcodeID: objPart.mfgcodeID, isContainCPN: true })];
            vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
              //vm.checkUniqueSupplierQuotePart(vm.supplierQuotePartDetails.partID, vm.supplierQuotePartDetails.supplierPartID ? vm.supplierQuotePartDetails.supplierPartID : null, true);
              //vm.isScanLabel = false;
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
        else {
          vm.isScanLabel = false;
          if (res.data && (res.data.messagecode === '0' || res.data.messagecode === '4')) {
            const obj = {
              title: USER.USER_INFORMATION_LABEL,
              textContent: res.data.Datamessage,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_ADDRECORD_TEXT,
              canbtnText: ''
            };
            if (res.data.messagecode && res.data.messagecode === '0') {
              obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_TEXT;
            } else {
              obj.canbtnText = CORE.MESSAGE_CONSTANT.BUTTON_SKIP_PART_TEXT;
            }
            DialogFactory.confirmDiolog(obj).then((item) => {
              if (item) {
                if (res.data && res.data.messagecode === '0') {
                  BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE);
                } else {
                  addNewComponent(res.data.MFGPart);
                }
              }
            }, () => {
              vm.supplierQuotePartDetails.scanLabel = null;
              setFocus('scanLabel');
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (res.data && res.data.messagecode === '5') {
            selectPartPopup(res.data.MFGPart);
          } else if (['6', '8', '11', '12', '16'].indexOf(res.data.messagecode) !== -1) {
            vm.cgBusyLoading = false;
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: res.data.messagecode === '11' ? stringFormat(res.data.Datamessage, 'receive') : res.data.Datamessage,
              multiple: true
            };
            return DialogFactory.alertDialog(model).then((yes) => {
              if (yes && res.data.messagecode === '8') {
                BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, { id: res.data.MFGPart });
              }
              else {
                vm.supplierQuotePartDetails.scanLabel = null;
                setFocus('scanLabel');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          } else if (res.data.messagecode === '9') {
            selectBarcodePopup(res.data.MFGPart);
          } else if (res.data.messagecode === '20') {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_NOT_MAPPED_WITH_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, 'scanned part', res.data.Datamessage);
            const model = {
              messageContent: messageContent,
              btnText: vm.LabelConstant.SupplierQuote.MapSupplier,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL,
              multiple: true
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.supplierQuotePartDetails.scanLabel = null;
                setFocus('scanLabel');
                vm.goToSupplierDetail(vm.supplierQuote.supplierID);
              }
            }, () => {
              vm.supplierQuotePartDetails.scanLabel = null;
              setFocus('scanLabel');
            }
            ).catch((error) => BaseService.getErrorLog(error));
          } else if (res.data.messagecode === '21') {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MAPPED_MFRPN_IS_NOT_CUSTOM_PART);
            messageContent.message = stringFormat(messageContent.message, 'scanned', vm.supplierQuotePartDetails.scanLabel);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.supplierQuotePartDetails.scanLabel = null;
                setFocus('scanLabel');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.CheckStepAndAction = (isFromStatus) => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.formSupplierQuoteDetails, true)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (!checkAddressValidation()) {
        vm.manageSupplierQuoteDetail(isFromStatus);
      }
    };

    vm.manageSupplierQuoteDetail = (isFromStatus) => {
      vm.supplierQuote.gencFileOwnerType = vm.entityName;
      vm.supplierQuote.quoteDate = BaseService.getAPIFormatedDate(vm.supplierQuote.quoteDate);
      vm.supplierQuote.billingAddress = BaseService.generateAddressFormateToStoreInDB(vm.billingAddress);
      vm.supplierQuote.billingContactPerson = BaseService.generateContactPersonDetFormat(vm.selectedBillContactPerson);
      vm.supplierQuote.shippingAddress = BaseService.generateAddressFormateToStoreInDB(vm.shippingAddress);
      vm.supplierQuote.shippingContactPerson = BaseService.generateContactPersonDetFormat(vm.selectedShipContactPerson);
      vm.cgBusyLoading = SupplierQuoteFactory.manageSupplierQuoteDetail().query(vm.supplierQuote).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.saveBtnDisableFlag = false;
          if (vm.formSupplierQuoteDetails) {
            vm.formSupplierQuoteDetails.$setPristine();
          }
          if (vm.formSupplierQuotePartDetails) {
            vm.formSupplierQuotePartDetails.$setPristine();
          }
          vm.resetSupplierQuoteDetail();
          if (response && response.data) {
            if (!vm.supplierQuote.id) {
              vm.supplierQuote.id = response.data.id;
              $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: vm.supplierQuote.id });
            } else {
              $state.transitionTo($state.$current, { id: vm.supplierQuote.id }, { location: true, inherit: false, notify: true, reload: true });
              if (isFromStatus) {
                vm.loadData();
              }
            }
            vm.supplierQuote.id = vm.supplierQuote.id;
            //$state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: vm.supplierQuote.id });
          }
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data) {
          vm.saveBtnDisableFlag = false;
          if (response.errors.data.quoteNumber) {
            vm.supplierQuote.quoteNumber = null;
            setFocus('quoteNumber');
          }
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.saveBtnDisableFlag = false;
      });
    };

    vm.saveSupplierQuotePartDetail = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.formSupplierQuotePartDetails)) {
        vm.saveBtnDisableFlag = false;
        return;
      }

      if (!vm.isScanLabel) {
        vm.supplierQuotePartDetails.scanLabel = null;
      }

      vm.cgBusyLoading = SupplierQuoteFactory.saveSupplierQuotePartDetail().query(vm.supplierQuotePartDetails).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.saveBtnDisableFlag = false;
          if (vm.formSupplierQuotePartDetails) {
            vm.formSupplierQuotePartDetails.$setPristine();
          }
          if (vm.supplierQuotePartDetails.mfgPN === searchMFRPN) {
            $state.transitionTo($state.$current, { id: vm.supplierQuote.id }, { location: true, inherit: false, notify: true, reload: true });
          } else {
            vm.resetSupplierQuoteDetail();
            if (response && response.data) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }
        } else if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
          vm.saveBtnDisableFlag = false;
          if (response.data) {
            let model;
            if (response.data.isMFRPN) {
              model = {
                messageContent: response.data,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.autoCompletecomponent.keyColumnId = null;
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  if (vm.supplierQuotePartDetails.scanLabel) {
                    vm.supplierQuotePartDetails.scanLabel = null;
                    vm.isScanLabel = false;
                    setFocus('scanLabel');
                  } else {
                    setFocusByName(vm.autoCompletecomponent.inputName);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              model = {
                messageContent: response.data,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.autoCompletemfgCode.keyColumnId = vm.autoCompletecomponent.keyColumnId = vm.autoCompleteSupplierComponent.keyColumnId = null;
                  $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
                  $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
                  $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, null);
                  if (vm.supplierQuotePartDetails.scanLabel) {
                    vm.supplierQuotePartDetails.scanLabel = null;
                    vm.isScanLabel = false;
                    setFocus('scanLabel');
                  } else {
                    setFocusByName(vm.autoFocusSupplierComponent.inputName);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.data && response.errors.data.data.length > 0) {
          const duplicateAttributes = _.map(response.errors.data.data, (item) => item.quotecharges_dynamic_fields_mst.fieldName).join(',');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
          messageContent.message = stringFormat(messageContent.message, duplicateAttributes);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              if (vm.formSupplierQuotePartDetails) {
                vm.formSupplierQuotePartDetails.$setPristine();
              }
              vm.resetSupplierQuoteDetail();
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.length > 0) {
          vm.saveBtnDisableFlag = false;
          const attributeData = response.errors.data[0].quotecharges_dynamic_fields_mst;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRICING_ADDED_FOR_ATTRIBUTE);
          messageContent.message = stringFormat(messageContent.message, attributeData.fieldName);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              if (vm.formSupplierQuotePartDetails) {
                vm.formSupplierQuotePartDetails.$setPristine();
              }
              vm.resetSupplierQuoteDetail();
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.saveBtnDisableFlag = false;
      });
    };

    vm.retrieveSupplierAttributeTemplate = () => {
      const templateObj = [vm.supplierQuote.supplierID, -7];// -7 stands for all MFR/Suppliers
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierAttributeTemplate().query({ IDs: templateObj }).$promise.then((response) => {
        if (response.data && response.data.length > 0) {
          const filterCurrentSupplier = _.filter(response.data, { supplierID: vm.supplierQuote.supplierID });
          if (filterCurrentSupplier.length > 0) {
            vm.attributeTemplateList = _.map(filterCurrentSupplier[0].supplier_attribute_template_det, (item) => item.quotecharges_dynamic_fields_mst);
          } else {
            const filterAllSupplier = _.filter(response.data, { supplierID: -7 });
            if (filterAllSupplier.length > 0) {
              vm.attributeTemplateList = _.map(filterAllSupplier[0].supplier_attribute_template_det, (item) => item.quotecharges_dynamic_fields_mst);
            }
          }
        }
        return $q.resolve(response);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const unSavedChangesConfirmation = (row) => {
      if (vm.formSupplierQuotePartDetails.$dirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            updateSupplierQuoteDetail(row);
          }
        }, () => {

        }, (error) => BaseService.getErrorLog(error));
      } else {
        updateSupplierQuoteDetail(row);
      }
    };

    vm.updateRecord = (row) => {
      unSavedChangesConfirmation(row);
    };

    const updateSupplierQuoteDetail = (row) => {
      vm.supplierQuoteDetTitle = 'Update';
      if (vm.formSupplierQuotePartDetails) {
        vm.formSupplierQuotePartDetails.$setPristine();
        vm.formSupplierQuotePartDetails.$setUntouched();
      }
      const rowData = angular.copy(row.entity);
      vm.supplierQuotePartDetails = rowData;
      vm.supplierQuotePartDetails.selectedAttributes = rowData.selectedAttributes;
      $timeout(() => {
        $scope.$broadcast(vm.autoCompletemfgCode.inputName, rowData.mfgName);
        $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${rowData.mfgCode}) ${rowData.mfgPN}`);
        vm.autoCompletemfgCode.keyColumnId = rowData.mfgcodeID;
        vm.autoCompletecomponent.keyColumnId = rowData.partID;
        if (rowData.supplierPartID) {
          $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, `(${rowData.supplierCode}) ${rowData.supplierPN}`);
          vm.autoCompleteSupplierComponent.keyColumnId = rowData.supplierPartID;
        }
      }, true);
    };

    const checkAddressValidation = () => {
      vm.saveBtnDisableFlag = true;
      let label;
      if (vm.supplierQuote.shippingAddressID || vm.supplierQuote.billingAddressID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
        if ((vm.supplierQuote.billingAddressID && !vm.supplierQuote.billingContactPersonID) || (!vm.supplierQuote.billingAddressID && vm.supplierQuote.billingContactPersonID)) {
          label = (vm.supplierQuote.billingAddressID && !vm.supplierQuote.billingContactPersonID) ? vm.LabelConstant.Address.BusinessAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName : vm.LabelConstant.Address.BusinessAddress;
          messageContent.message = stringFormat(messageContent.message, label);
          const obj = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(obj).then(() => {
            vm.saveBtnDisableFlag = false;
            return true;
          });
        } else if ((vm.supplierQuote.shippingAddressID && !vm.supplierQuote.shippingContactPersonID) || (!vm.supplierQuote.shippingAddressID && vm.supplierQuote.shippingContactPersonID)) {
          label = (vm.supplierQuote.shippingAddressID && !vm.supplierQuote.shippingContactPersonID) ? vm.LabelConstant.Address.ShippingAddress + ' ' + CORE.PAGENAME_CONSTANT[67].PageName : vm.LabelConstant.Address.ShippingAddress;
          messageContent.message = stringFormat(messageContent.message, label);
          const obj = {
            multiple: true,
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(obj).then(() => {
            vm.saveBtnDisableFlag = false;
            return true;
          });
        } else {
          vm.saveBtnDisableFlag = false;
          return false;
        }
      } else {
        vm.saveBtnDisableFlag = false;
        return false;
      }
    };

    //On change supplier quote status
    vm.changeSupplierQuoteStatus = (statusID, oldStatusID, event, msWizard) => {
      if (statusID !== oldStatusID) {
        if (vm.formSupplierQuoteDetails.$invalid) {
          const obj = {
            multiple: true,
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_QUOTE_STATUS_CHANGE)
          };
          return DialogFactory.messageAlertDialog(obj);
        } else if (checkAddressValidation()) {
          return;
        } else if (!vm.isAllowedToPublish) {
          const obj = {
            multiple: true,
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_PUBLISH_QUOTE)
          };
          DialogFactory.messageAlertDialog(obj);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SQ_STATUS_CHANGE);
          messageContent.message = stringFormat(messageContent.message, vm.getSupplierQuoteStatus(oldStatusID), vm.getSupplierQuoteStatus(statusID));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (msWizard.selectedIndex === 0) {
                if (vm.formSupplierQuotePartDetails) {
                  vm.formSupplierQuotePartDetails.$setPristine();
                  vm.formSupplierQuotePartDetails.$setUntouched();
                }
                updateSupplierQuoteStatusLabel(statusID);
                vm.CheckStepAndAction(true);
              }
              else if (msWizard.selectedIndex === 1) {
                updateSupplierQuoteStatusLabel(statusID);
                vm.CheckStepAndAction(true);
              }
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    const showWithoutSavingAlertforBackButton = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_STATE);
        }
      }, () => {
      }, (error) => BaseService.getErrorLog(error));
    };

    vm.goBack = () => {
      if (BaseService.checkFormDirty(vm.formSupplierQuoteDetails) || BaseService.checkFormDirty(vm.formSupplierQuotePartDetails)) {
        showWithoutSavingAlertforBackButton();
      } else {
        $state.go(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_STATE);
      }
    };

    vm.onTabChanges = (TabName, msWizard) => {
      if (vm.tabName !== TabName) {
        if (TabName === TRANSACTION.SupplierQuoteTabs.Detail.Name) {
          vm.IsDocumentTab = false;
          vm.currentForm = msWizard.currentStepForm();
        } else {
          vm.IsDocumentTab = true;
        }

        if (TabName === TRANSACTION.SupplierQuoteTabs.Documents.Name) {
          vm.IsDocumentTab = true;
          vm.currentForm = msWizard.currentStepForm();
        } else {
          vm.IsDocumentTab = false;
        }
        msWizard.selectedIndex = vm.selectedTabIndex;
        BaseService.currentPageForms = [vm.currentForm];
        vm.stateTransfer(TabName);
        $('#content').animate({ scrollTop: 0 }, 200);
      }
    };

    vm.stateTransfer = (TabName) => {
      if (vm.formSupplierQuotePartDetails && vm.formSupplierQuotePartDetails.$dirty) {
        vm.resetSupplierQuoteDetail();
      }

      switch (TabName) {
        case TRANSACTION.SupplierQuoteTabs.Detail.Name:
          $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: vm.supplierQuote.id });
          break;
        case TRANSACTION.SupplierQuoteTabs.Documents.Name:
          $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_DOCUMENTS_STATE, { id: vm.supplierQuote.id });
          break;
        default:
      }
    };

    vm.isStepValid = function () {
      var isDirty = (vm.formSupplierQuoteDetails ? vm.formSupplierQuoteDetails.$dirty : false) || (vm.formSupplierQuotePartDetails ? vm.formSupplierQuotePartDetails.$dirty : false);
      if (isDirty) {
        return showWithoutSavingAlertforTabChange();
      } else {
        return true;
      }
    };

    const showWithoutSavingAlertforTabChange = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (vm.formSupplierQuotePartDetails) {
            vm.formSupplierQuotePartDetails.$setPristine();
          }
          if (vm.formSupplierQuoteDetails) {
            vm.formSupplierQuoteDetails.$setPristine();
          }
          vm.resetSupplierQuoteDetail();
          return true;
        }
      }, () => 1).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getSupplierQuoteStatus = (statusID) => {
      const status = _.find(vm.supplierQuoteStaus, (item) => item.ID === statusID);
      return status ? status.Name : '';
    };

    // set data for customer address directive
    const setOtherDetForAddrDir = (addressType, suppID) => {
      if (addressType === CORE.AddressType.BusinessAddress) {
        vm.viewBillAddrOtherDet.customerId = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.viewBillAddrOtherDet.refTransID = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.viewBillAddrOtherDet.companyName = $scope.ParentNme ? $scope.ParentNme.mfgName : null;
        vm.viewBillAddrOtherDet.companyNameWithCode = $scope.ParentNme ? $scope.ParentNme.mfgFullName : null;
      } else if (addressType === CORE.AddressType.ShippingAddress) {
        vm.viewShipAddrOtherDet.customerId = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.viewShipAddrOtherDet.refTransID = suppID || vm.autoCompleteSupplier.keyColumnId;
        vm.viewShipAddrOtherDet.companyName = $scope.ParentNme ? $scope.ParentNme.mfgName : null;
        vm.viewShipAddrOtherDet.companyNameWithCode = $scope.ParentNme ? $scope.ParentNme.mfgFullName : null;
      }
    };

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for supplier */
      vm.autoCompleteSupplier = {
        columnName: 'mfgFullName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.supplierQuote && vm.supplierQuote.supplierID ? vm.supplierQuote.supplierID : null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        isRequired: true,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        callbackFn: getSupplierList,
        onSelectCallbackFn: selectedSupplierDetails
      };

      /** Auto-complete for MFG code */
      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'MFG',
        placeholderName: CORE.LabelConstant.MFG.MFG,
        isRequired: true,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              checkMappingValidation(item);
            }
          }
          else {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
            $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, null);
            vm.supplierQuotePartDetails.mfgcodeID = vm.supplierQuotePartDetails.mfgCode = null;
            vm.supplierQuotePartDetails.scanLabel = null;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletemfgCode.inputName
          };
          return getMfgSearch(searchObj);
        }
      };

      /** Auto-complete for MFG pn */
      vm.autoCompletecomponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.supplierQuotePartDetails.partID ? vm.supplierQuotePartDetails.partID : null,
        inputName: CORE.LabelConstant.MFG.MFGPN,
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG, category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            id: obj.id,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              vm.supplierQuotePartDetails.partID = item.id;
              vm.supplierQuotePartDetails.mfgPN = item.orgMfgPN;
              vm.supplierQuotePartDetails.mfgPNDescription = item.mfgPNDescription;
              vm.supplierQuotePartDetails.mfgcodeID = item.mfgcodeID;
              vm.supplierQuotePartDetails.mfgName = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
              vm.checkPartValidation(item.id, vm.supplierQuotePartDetails.supplierPartID ? vm.supplierQuotePartDetails.supplierPartID : null, item);
            }
          }
          else {
            vm.supplierQuotePartDetails.partID = vm.supplierQuotePartDetails.mfgPN = vm.supplierQuotePartDetails.mfgName = vm.supplierQuotePartDetails.mfgcodeID = null;
            $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, null);
            vm.supplierQuotePartDetails.scanLabel = null;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecomponent.inputName,
            isContainCPN: true,
            exculdePartStatus: CORE.PartStatusList.InActiveInternal
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };


      /** Auto-complete for Supplier pn */
      vm.autoCompleteSupplierComponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.supplierQuotePartDetails.supplierPartID ? vm.supplierQuotePartDetails.supplierPartID : null,
        inputName: CORE.LabelConstant.MFG.SupplierPN,
        placeholderName: CORE.LabelConstant.MFG.SupplierPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          category: CORE.PartCategory.Component,
          parentId: vm.autoCompleteSupplier && vm.autoCompleteSupplier.keyColumnId ? vm.autoCompleteSupplier.keyColumnId : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: false,
        callbackFn: (obj) => {
          const searchObj = {
            id: obj.id,
            mfgcodeID: vm.autoCompleteSupplier.keyColumnId,
            isContainCPN: true
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (!vm.supplierQuotePartDetails.id && item.supplierPartMfgName && item.supplierPartMfgCode && item.supplierPartMfgPn) {
              getMfgSearch({ mfgcodeID: item.refMfgPNMfgCodeId });
              getComponentDetailsByMfg({ id: item.refSupplierMfgpnComponentID, mfgcodeID: item.refMfgPNMfgCodeId, isContainCPN: true });
            }
            if (item.refSupplierMfgpnComponentID) {
              vm.supplierQuotePartDetails.supplierPartID = item.id ? item.id : vm.autoCompleteSupplierComponent.keyColumnId;
              vm.supplierQuote.partID = vm.autoCompletecomponent.keyColumnId = item.refSupplierMfgpnComponentID;
              vm.checkPartValidation(item.refSupplierMfgpnComponentID, item.id, item);
            }
          }
          else {
            vm.supplierQuote.partID = vm.supplierQuotePartDetails.supplierPartID = null;
            vm.supplierQuotePartDetails.scanLabel = null;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query,
            mfgcodeID: vm.autoCompleteSupplier.keyColumnId,
            mfgType: CORE.MFG_TYPE.DIST,
            inputName: vm.autoCompletecomponent.inputName,
            isContainCPN: true,
            exculdePartStatus: CORE.PartStatusList.InActiveInternal
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };

      vm.autoCompleteQuoteNumber = {
        columnName: 'quoteNumber',
        keyColumnName: 'id',
        keyColumnId: vm.supplierQuote.id ? vm.supplierQuote.id : null,
        inputName: 'quoteNumber',
        placeholderName: 'Quote#',
        isRequired: false,
        isAddnew: false,
        callbackFn: () => {
        },
        onSelectCallbackFn: selectSupplierQuote,
        onSearchFn: (query) => {
          const search = {
            id: vm.supplierQuote.id ? vm.supplierQuote.id : null,
            search: query
          };
          return getSupplierQuoteSearch(search);
        }
      };
    };

    const getSupplierQuoteSearch = (search) => SupplierQuoteFactory.getSupplierQuoteNumberList().query(search).$promise.then((supplierQuote) => {
      if (supplierQuote) {
        _.each(supplierQuote.data, (item) => {
          item.quoteNumber = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCodemst.mfgCode, item.quoteNumber);
        });
        return supplierQuote.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /**
     * Get MFG code list
     * @param {any} searchObj
     */
    const getMfgSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0 || searchObj.searchMFR) {
        $timeout(() => {
          let searchMFRDetail;
          if (vm.autoCompletemfgCode && vm.autoCompletemfgCode.inputName) {
            if (searchMFR) {
              searchMFRDetail = _.find(mfgcodes.data, { mfgCode: searchMFR });
              if (searchMFRDetail) {
                vm.autoCompletemfgCode.keyColumnId = searchMFRDetail.id;
                $scope.$broadcast(vm.autoCompletemfgCode.inputName, searchMFRDetail);
              }
            } else {
              vm.autoCompletemfgCode.keyColumnId = mfgcodes.data[0].id;
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, mfgcodes.data[0]);
            }
          }
          if (searchMFRDetail && searchMFRPN) {
            const searchMFRPNObj = {
              mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
              query: searchMFRPN,
              mfgType: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompletecomponent.inputName,
              isContainCPN: true,
              searchMFRPN: searchMFRPN
            };
            vm.autoCompletecomponent.isVisiableLoader = true;
            getComponentDetailsByMfg(searchMFRPNObj);
            vm.formSupplierQuotePartDetails.$setDirty();
          }
        }, true);
      }
      return mfgcodes.data;
    }).catch((error) => BaseService.getErrorLog(error));

    /**
     * Get MFG PN List
     * @param {any} searchObj
     */
    const getComponentDetailsByMfg = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
      vm.autoCompletecomponent.isVisiableLoader = false;
      if (searchObj.id || searchObj.id === 0 || searchObj.searchMFRPN) {
        const componentDet = component.data && component.data.data[0] ? component.data.data[0] : null;
        $timeout(() => {
          if (componentDet) {
            if (componentDet.refSupplierMfgpnComponentID) {
              $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, componentDet);
            } else {
              vm.autoCompletecomponent.keyColumnId = component.data.data[0].id;
              $scope.$broadcast(vm.autoCompletecomponent.inputName, componentDet);
            }
          }
        }, true);
      }
      return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getSupplierAddress = (id, addressType) => CustomerFactory.customerAddressList().query({
      customerId: id || vm.autoCompleteSupplier.keyColumnId,
      addressType: addressType ? addressType : [CORE.AddressType.ShippingAddress, CORE.AddressType.BusinessAddress],
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      onlyDefault: vm.supplierQuote.id ? false : true
    }).$promise.then((customeraddress) => {
      if (addressType) {
        if (addressType === CORE.AddressType.BusinessAddress) {
          vm.billingAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.BusinessAddress);
          vm.viewBillAddrOtherDet.showAddressEmptyState = vm.billingAddressList.length === 0 ? true : false;
          if (!vm.supplierQuote.id) {
            // bill to address
            const defaultBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.isDefault);
            if (defaultBillToAddrDet) {
              setBillToAddrContDetForApplied(defaultBillToAddrDet);
            }
          } else {
            // bill to address
            const selectedBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.id === vm.supplierQuote.billingAddressID);
            if (selectedBillToAddrDet) {
              vm.billingAddress = selectedBillToAddrDet;
              if (vm.viewBillAddrOtherDet) {
                vm.viewBillAddrOtherDet.alreadySelectedAddressID = selectedBillToAddrDet.id;
                vm.billingAddress = selectedBillToAddrDet;
              }
            }
          }
        } else if (addressType === CORE.AddressType.ShippingAddress) {
          vm.shippingAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.ShippingAddress);
          vm.viewShipAddrOtherDet.showAddressEmptyState = vm.shippingAddressList.length === 0 ? true : false;
          if (!vm.supplierQuote.id) {
            // ship to address
            const defaultShipToAddrDet = _.find(vm.shippingAddressList, (addrItem) => addrItem.isDefault);
            if (defaultShipToAddrDet) {
              setShipToAddrContDetForApplied(defaultShipToAddrDet);
            }
          } else {
            // ship to address
            const selectedShipToAddrDet = _.find(vm.shippingAddressList, (addrItem) => addrItem.id === vm.supplierQuote.shippingAddressID);
            if (selectedShipToAddrDet) {
              vm.shippingAddress = selectedShipToAddrDet;
              if (vm.viewShipAddrOtherDet) {
                vm.viewShipAddrOtherDet.alreadySelectedAddressID = selectedShipToAddrDet.id;
                vm.shippingAddress = selectedShipToAddrDet;
              }
            }
          }
        }
      } else {
        vm.shippingAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.ShippingAddress);
        vm.billingAddressList = _.filter(customeraddress.data, (item) => item.addressType === CORE.AddressType.BusinessAddress);
        vm.viewBillAddrOtherDet.showAddressEmptyState = vm.billingAddressList.length === 0 ? true : false;
        vm.viewShipAddrOtherDet.showAddressEmptyState = vm.shippingAddressList.length === 0 ? true : false;
        if (!vm.supplierQuote.id) {
          // bill to address
          const defaultBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.isDefault);
          if (defaultBillToAddrDet) {
            setBillToAddrContDetForApplied(defaultBillToAddrDet);
          }
          // ship to address
          const defaultShipToAddrDet = _.find(vm.shippingAddressList, (addrItem) => addrItem.isDefault);
          if (defaultShipToAddrDet) {
            setShipToAddrContDetForApplied(defaultShipToAddrDet);
          }
        } else {
          // bill to address
          const selectedBillToAddrDet = _.find(vm.billingAddressList, (addrItem) => addrItem.id === vm.supplierQuote.billingAddressID);
          if (selectedBillToAddrDet) {
            vm.billingAddress = selectedBillToAddrDet;
            if (vm.viewBillAddrOtherDet) {
              vm.viewBillAddrOtherDet.alreadySelectedAddressID = selectedBillToAddrDet.id;
              vm.billingAddress = selectedBillToAddrDet;
            }
          }
          // ship to address
          const selectedShipToAddrDet = _.find(vm.shippingAddressList, (addrItem) => addrItem.id === vm.supplierQuote.shippingAddressID);
          if (selectedShipToAddrDet) {
            vm.shippingAddress = selectedShipToAddrDet;
            if (vm.viewShipAddrOtherDet) {
              vm.viewShipAddrOtherDet.alreadySelectedAddressID = selectedShipToAddrDet.id;
              vm.shippingAddress = selectedShipToAddrDet;
            }
          }
        }
      }
      return $q.resolve(customeraddress.data);
    }).catch((error) => BaseService.getErrorLog(error));

    const selectedSupplierDetails = (item) => {
      if (item) {
        if ((vm.sourceData && vm.sourceData.length > 0) && vm.supplierQuote.supplierID) {
          const checkSupplierListValidation = _.filter(vm.sourceData, (data) => data.supplierID !== item.id);
          let PIDString;
          if (checkSupplierListValidation && checkSupplierListValidation.length > 0) {
            PIDString = _.map(checkSupplierListValidation, 'supplierPN');
            PIDString = _.compact(PIDString).join(',');
          }
          if (PIDString) {
            const objSupplier = _.find(vm.supplierList, (data) => data.id === vm.supplierQuote.supplierID);
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_SUPPLIER);
            messageContent.message = stringFormat(messageContent.message, PIDString, objSupplier ? objSupplier.mfgName : '');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.autoCompleteSupplier.keyColumnId = null;
                vm.autoFocusSupplier = true;
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
        if (vm.supplierQuote.quoteNumber && vm.formSupplierQuoteDetails.$dirty) {
          vm.checkQuoteNumberUnique();
        }
        vm.supplierQuote.supplierMFRMappingType = item.supplierMFRMappingType;
        vm.supplierQuote.isStrictlyCustomComponent = item.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key ? true : false;
        vm.supplierQuote.mappedManufacturers = _.map(item.supplier_mapping_mstSupplier, 'refMfgCodeMstID');
        vm.supplierQuote.supplierID = item.id;
        vm.supplierQuote.mfgFullName = item.mfgFullName;
        $scope.ParentNme = item;
        const autocompletePromise = [getCustomerContactPersonList(item.id), getSupplierAddress(item.id)];
        vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
          setOtherDetForAddrDir(CORE.AddressType.BusinessAddress, item.id);
          setOtherDetForAddrDir(CORE.AddressType.ShippingAddress, item.id);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        $scope.ParentNme = null;
        //vm.billingAddressList = [];
        //vm.shippingAddressList = [];
        vm.autoCompleteSupplier.keyColumnId = null;
        vm.billingAddress = null;
        vm.supplierQuote.billingAddress = null;
        vm.supplierQuote.billingAddressID = null;
        vm.selectedBillContactPerson = null;
        vm.supplierQuote.billingContactPersonID = null;
        vm.supplierQuote.billingContactPerson = null;
        vm.shippingAddress = null;
        vm.supplierQuote.shippingAddress = null;
        vm.supplierQuote.shippingAddressID = null;
        vm.selectedShipContactPerson = null;
        vm.supplierQuote.shippingContactPerson = null;
        vm.supplierQuote.shippingContactPersonID = null;
        vm.autoFocusSupplier = true;
        vm.viewBillAddrOtherDet.showAddressEmptyState = false;
        vm.viewShipAddrOtherDet.showAddressEmptyState = false;
        vm.viewBillAddrOtherDet.customerId = null;
        vm.viewShipAddrOtherDet.customerId = null;
        vm.viewBillAddrOtherDet.refTransID = null;
        vm.viewShipAddrOtherDet.refTransID = null;
        vm.viewBillAddrOtherDet.alreadySelectedAddressID = null;
        vm.viewShipAddrOtherDet.alreadySelectedAddressID = null;
        vm.viewBillAddrOtherDet.alreadySelectedPersonId = null;
        vm.viewShipAddrOtherDet.alreadySelectedPersonId = null;
      }
    };

    /** Get supplier list */
    const getSupplierList = () => SupplierQuoteFactory.getSupplierList().query().$promise.then((response) => {
      if (response && response.data) {
        _.each(response.data, (item) => {
          item.mfgFullName = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
        });
        vm.supplierList = response.data;
      }
      return $q.resolve(vm.supplierList);
    }).catch((error) => BaseService.getErrorLog(error));

    const getAutoCompleteData = () => {
      const autocompletePromise = [getSupplierList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
        if (searchMFR) {
          const searchMFRObj = {
            searchQuery: searchMFR,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletemfgCode.inputName,
            searchMFR: searchMFR
          };
          getMfgSearch(searchMFRObj);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const pageInit = () => {
      if (vm.supplierQuote.id) {
        vm.getSupplierQuoteDetail();
      } else {
        if (!vm.IsDocumentTab) {
          getAutoCompleteData();
        }
      }
    };
    pageInit();
    vm.getsupplierQuoteClassName = (statusID) => {
      const status = _.find(vm.supplierQuoteStaus, (item) => item.ID === statusID);
      return status ? status.ClassName : '';
    };

    const setBillToAddrContDetForApplied = (newApplyAddrDet) => {
      vm.supplierQuote.billToName = newApplyAddrDet.companyName;
      vm.supplierQuote.billingAddressID = newApplyAddrDet.id;
      vm.viewBillAddrOtherDet.alreadySelectedAddressID = newApplyAddrDet.id;
      if (newApplyAddrDet.contactPerson) {
        vm.supplierQuote.billingContactPersonID = newApplyAddrDet.contactPerson.personId;
        vm.supplierQuote.billingContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
        vm.selectedBillContactPerson = angular.copy(newApplyAddrDet.contactPerson);
        vm.viewBillAddrOtherDet.alreadySelectedPersonId = vm.selectedBillContactPerson.personId;
      } else {
        vm.supplierQuote.billingContactPersonID = null;
        vm.supplierQuote.billingContactPerson = null;
        vm.selectedBillContactPerson = null;
        vm.viewBillAddrOtherDet.alreadySelectedPersonId = null;
      }
      vm.billingAddress = newApplyAddrDet;
      vm.billAddrViewActionBtnDet.Update.isDisable = vm.contPersnBillViewActionBtnDet.ApplyNew.isDisable = (vm.billingAddress || !vm.isDisable) ? false : true;
      vm.contPersnBillViewActionBtnDet.Update.isDisable = (vm.selectedBillContactPerson || !vm.isDisable) ? false : true;
    };

    const setShipToAddrContDetForApplied = (newApplyAddrDet) => {
      vm.supplierQuote.shipToName = newApplyAddrDet.companyName;
      vm.supplierQuote.shippingAddressID = newApplyAddrDet.id;
      vm.viewShipAddrOtherDet.alreadySelectedAddressID = newApplyAddrDet.id;
      if (newApplyAddrDet.contactPerson) {
        vm.supplierQuote.shippingContactPersonID = newApplyAddrDet.contactPerson.personId;
        vm.supplierQuote.shippingContactPerson = BaseService.generateContactPersonDetFormat(newApplyAddrDet.contactPerson);
        vm.selectedShipContactPerson = angular.copy(newApplyAddrDet.contactPerson);
        vm.viewShipAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
      } else {
        vm.supplierQuote.shippingContactPersonID = null;
        vm.supplierQuote.shippingContactPerson = null;
        vm.selectedShipContactPerson = null;
        vm.viewShipAddrOtherDet.alreadySelectedPersonId = null;
      }
      vm.shippingAddress = newApplyAddrDet;
      vm.shipAddrViewActionBtnDet.Update.isDisable = vm.contPersnShipViewActionBtnDet.ApplyNew.isDisable = (vm.shippingAddress || !vm.isDisable) ? false : true;
      vm.contPersnShipViewActionBtnDet.Update.isDisable = (vm.selectedShipContactPerson || !vm.isDisable) ? false : true;
    };

    // get customer contact person list
    const getCustomerContactPersonList = (suppID) => CustomerFactory.getCustomerContactPersons().query({
      refTransID: suppID || vm.autoCompleteSupplier.keyColumnId,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (contactperson && contactperson.data) {
        vm.contactPersonList = contactperson.data;
        if (vm.supplierQuote.id && vm.supplierQuote.billingContactPersonID) {
          const selectedContPersonDet = _.find(vm.contactPersonList, (contItem) => contItem.personId === vm.supplierQuote.billingContactPersonID);
          if (selectedContPersonDet) {
            vm.selectedBillContactPerson = selectedContPersonDet;
            vm.viewBillAddrOtherDet.alreadySelectedPersonId = vm.selectedBillContactPerson.personId;
          }
        }
        if (vm.supplierQuote.id && vm.supplierQuote.shippingContactPersonID) {
          const selectedContPersonDet = _.find(vm.contactPersonList, (contItem) => contItem.personId === vm.supplierQuote.shippingContactPersonID);
          if (selectedContPersonDet) {
            vm.selectedShipContactPerson = selectedContPersonDet;
            vm.viewShipAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
          }
        }
        vm.contPersnBillViewActionBtnDet.Update.isDisable = vm.contPersnBillViewActionBtnDet.ApplyNew.isDisable = (vm.selectedBillContactPerson || !vm.isDisable) ? false : true;
        vm.contPersnShipViewActionBtnDet.Update.isDisable = vm.contPersnShipViewActionBtnDet.ApplyNew.isDisable = (vm.selectedShipContactPerson || !vm.isDisable) ? false : true;
        return $q.resolve(vm.contactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // set contact person details in current scope modal
    const setContPersonDetAfterApply = (callBackContactPerson, addressType) => {
      if (callBackContactPerson) {
        if (addressType === CORE.AddressType.BusinessAddress) {
          vm.selectedBillContactPerson = callBackContactPerson;
          vm.viewBillAddrOtherDet.alreadySelectedPersonId = vm.selectedBillContactPerson.personId;
          vm.supplierQuote.billingContactPersonID = vm.selectedBillContactPerson.personId;
          vm.supplierQuote.billingContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
          vm.contPersnBillViewActionBtnDet.Update.isDisable = vm.contPersnBillViewActionBtnDet.ApplyNew.isDisable = (vm.selectedBillContactPerson || !vm.isDisable) ? false : true;
        } else if (addressType === CORE.AddressType.ShippingAddress) {
          vm.selectedShipContactPerson = callBackContactPerson;
          vm.viewShipAddrOtherDet.alreadySelectedPersonId = vm.selectedShipContactPerson.personId;
          vm.supplierQuote.shippingContactPersonID = vm.selectedShipContactPerson.personId;
          vm.supplierQuote.shippingContactPerson = BaseService.generateContactPersonDetFormat(callBackContactPerson);
          vm.contPersnShipViewActionBtnDet.Update.isDisable = vm.contPersnShipViewActionBtnDet.ApplyNew.isDisable = (vm.selectedShipContactPerson || !vm.isDisable) ? false : true;
        }
        // Static code to enable save button
        vm.formSupplierQuoteDetails.$$controls[0].$setDirty();
      }
    };

    // Open add/edit contact persopn popup
    vm.addEditBillContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson, CORE.AddressType.BusinessAddress);
      }
    };

    // open select contact person  list
    vm.selectBillContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson, CORE.AddressType.BusinessAddress);
      }
    };

    // open select contact person  list
    vm.selectShipContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson, CORE.AddressType.ShippingAddress);
      }
    };

    // Open add/edit contact persopn popup
    vm.addEditShipContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        setContPersonDetAfterApply(callBackContactPerson, CORE.AddressType.ShippingAddress);
      }
    };

    vm.addEditBillAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.billingAddress = callBackAddress;
        const addressPromise = [getSupplierAddress()];
        vm.cgBusyLoading = $q.all(addressPromise).then(() => {
          // Static code to enable save button
          vm.formSupplierQuoteDetails.$$controls[0].$setDirty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* open customer address popup to select new one */
    vm.selectBillAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        setBillToAddrContDetForApplied(callBackAddress);
        // Static code to enable save button
        vm.formSupplierQuoteDetails.$$controls[0].$setDirty();
      }
    };

    vm.addEditShipAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.shippingAddress = callBackAddress;
        const addressPromise = [getSupplierAddress()];
        vm.cgBusyLoading = $q.all(addressPromise).then(() => {
          // Static code to enable save button
          vm.formSupplierQuoteDetails.$$controls[0].$setDirty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* open customer address popup to select new one */
    vm.selectShipAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        setShipToAddrContDetForApplied(callBackAddress);
        // Static code to enable save button
        vm.formSupplierQuoteDetails.$$controls[0].$setDirty();
      }
    };

    vm.deleteBillAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Address.BusinessAddress);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.billingAddress = null;
            vm.billingAddressList = [];
            vm.supplierQuote.billingAddress = null;
            vm.supplierQuote.billingAddressID = null;
            vm.selectedBillContactPerson = null;
            vm.supplierQuote.billingContactPersonID = null;
            vm.supplierQuote.billingContactPerson = null;
            vm.viewBillAddrOtherDet.alreadySelectedAddressID = null;
            vm.viewBillAddrOtherDet.alreadySelectedPersonId = null;
            // Static code to enable save button
            vm.formSupplierQuoteDetails.$setDirty();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.deleteShipAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.ShippingAddress);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.shippingAddress = null;
            vm.shippingAddressList = [];
            vm.supplierQuote.shippingAddress = null;
            vm.supplierQuote.shippingAddressID = null;
            vm.selectedShipContactPerson = null;
            vm.supplierQuote.shippingContactPerson = null;
            vm.supplierQuote.shippingContactPersonID = null;
            vm.viewShipAddrOtherDet.alreadySelectedAddressID = null;
            vm.viewShipAddrOtherDet.alreadySelectedPersonId = null;
            // Static code to enable save button
            vm.formSupplierQuoteDetails.$setDirty();
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // rerfresh address
    vm.refreshAddress = (ev, callBackData) => {
      const addressPromise = [getSupplierAddress(vm.autoCompleteSupplier.keyColumnId, callBackData.addressType)];
      vm.cgBusyLoading = $q.all(addressPromise).then(() => {
        if (callBackData.addressType === CORE.AddressType.BusinessAddress) {
          setOtherDetForAddrDir(callBackData.addressType, vm.autoCompleteSupplier.keyColumnId);
        } else if (callBackData.addressType === CORE.AddressType.ShippingAddress) {
          setOtherDetForAddrDir(callBackData.addressType, vm.autoCompleteSupplier.keyColumnId);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // update supplier quote status details
    const updateSupplierQuoteStatusLabel = (statusID) => {
      vm.supplierQuote.quoteStatus = statusID;
      if (vm.supplierQuote.quoteStatus === vm.supplierQuoteStaus[0].ID) {
        vm.isDisable = false;
        vm.billAddrViewActionBtnDet.AddNew.isDisable = vm.billAddrViewActionBtnDet.Update.isDisable = vm.billAddrViewActionBtnDet.ApplyNew.isDisable = vm.billAddrViewActionBtnDet.Delete.isDisable = vm.billAddrViewActionBtnDet.SetDefault.isDisable = false;
        vm.contPersnBillViewActionBtnDet.AddNew.isDisable = vm.contPersnBillViewActionBtnDet.Update.isDisable = vm.contPersnBillViewActionBtnDet.ApplyNew.isDisable = vm.contPersnBillViewActionBtnDet.SetDefault.isDisable = false;
        vm.shipAddrViewActionBtnDet.AddNew.isDisable = vm.shipAddrViewActionBtnDet.Update.isDisable = vm.shipAddrViewActionBtnDet.ApplyNew.isDisable = vm.shipAddrViewActionBtnDet.Delete.isDisable = vm.shipAddrViewActionBtnDet.SetDefault.isDisable = false;
        vm.contPersnShipViewActionBtnDet.AddNew.isDisable = vm.contPersnShipViewActionBtnDet.Update.isDisable = vm.contPersnShipViewActionBtnDet.ApplyNew.isDisable = vm.contPersnShipViewActionBtnDet.SetDefault.isDisable = false;
        vm.label = CORE.OPSTATUSLABLEPUBLISH;
      }
      else if (vm.supplierQuote.quoteStatus === vm.supplierQuoteStaus[1].ID) {
        vm.isDisable = true;
        vm.billAddrViewActionBtnDet.AddNew.isDisable = vm.billAddrViewActionBtnDet.Update.isDisable = vm.billAddrViewActionBtnDet.ApplyNew.isDisable = vm.billAddrViewActionBtnDet.Delete.isDisable = vm.billAddrViewActionBtnDet.SetDefault.isDisable = true;
        vm.contPersnBillViewActionBtnDet.AddNew.isDisable = vm.contPersnBillViewActionBtnDet.Update.isDisable = vm.contPersnBillViewActionBtnDet.ApplyNew.isDisable = vm.contPersnBillViewActionBtnDet.SetDefault.isDisable = true;
        vm.shipAddrViewActionBtnDet.AddNew.isDisable = vm.shipAddrViewActionBtnDet.Update.isDisable = vm.shipAddrViewActionBtnDet.ApplyNew.isDisable = vm.shipAddrViewActionBtnDet.Delete.isDisable = vm.shipAddrViewActionBtnDet.SetDefault.isDisable = true;
        vm.contPersnShipViewActionBtnDet.AddNew.isDisable = vm.contPersnShipViewActionBtnDet.Update.isDisable = vm.contPersnShipViewActionBtnDet.ApplyNew.isDisable = vm.contPersnShipViewActionBtnDet.SetDefault.isDisable = true;
        vm.label = CORE.OPSTATUSLABLEDRAFT;
      }
      else {
        vm.label = '';
      }
    };

    vm.resetSupplierQuoteDetail = () => {
      vm.supplierQuoteDetTitle = 'Add';
      vm.isScanLabel = false;
      vm.supplierQuotePartDetails = {};
      vm.supplierQuotePartDetails.supplierQuoteMstID = $stateParams.id;
      vm.supplierQuotePartDetails.isActive = true;
      vm.autoCompletemfgCode.keyColumnId = vm.autoCompletecomponent.keyColumnId = vm.autoCompleteSupplierComponent.keyColumnId = null;
      $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
      $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
      $scope.$broadcast(vm.autoCompleteSupplierComponent.inputName, null);
      $timeout(() => {
        if (vm.formSupplierQuotePartDetails) {
          vm.formSupplierQuotePartDetails.$setPristine();
          vm.formSupplierQuotePartDetails.$setUntouched();
          setFocus('scanLabel');
        }
      }, true);
    };

    vm.addSupplierQuotePartAttributes = (ev) => {
      const selectedAttributes = vm.supplierQuotePartDetails.selectedAttributes ? vm.supplierQuotePartDetails.selectedAttributes : [];
      const popUpData = {
        selectedAttributes: selectedAttributes,//_.filter(vm.listField, x => x.type == item)
        isFromUpdate: vm.supplierQuotePartDetails.id ? true : false,
        supplierQuotePartDetailID: vm.supplierQuotePartDetails.id ? vm.supplierQuotePartDetails.id : null
      };
      DialogFactory.dialogService(
        CORE.SUPPLIER_QUOTE_PART_ATTRIBUTES_CONTROLLER,
        CORE.SUPPLIER_QUOTE_PART_ATTRIBUTES_VIEW,
        ev,
        popUpData).then((data) => {
          if (data) {
            // Static code to enable save button
            vm.formSupplierQuotePartDetails.$$controls[0].$setDirty();
            vm.supplierQuotePartDetails.selectedAttributes = _.filter(data, { selected: true });
            if (popUpData.isFromUpdate) {
              vm.supplierQuotePartDetails.manageAttributes = {
                isCreate: _.filter(data, { isCreate: true }),
                isDelete: _.filter(data, { isDelete: true })
              };
            }
          }
        }, () => {
          setFocus('btnAddDet');
        }, (err) => BaseService.getErrorLog(err));
    };

    const addNewComponent = (MFGPart) => {
      const event = angular.element.Event('click');
      angular.element('body').trigger(event);
      const data = { Name: MFGPart, mfgType: CORE.MFG_TYPE.MFG, category: CORE.PartCategory.Component };
      DialogFactory.dialogService(
        CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        CORE.MANAGE_COMPONENT_MODAL_VIEW,
        event,
        data).then((result) => {
          const scanlabel = {
            regxpString: result.mfgPN,
            supplierID: vm.supplierQuote.isStrictlyCustomComponent ? vm.supplierQuote.supplierID : null
          };
          scanBarcode(scanlabel);
        }
          , () => {
          }, (error) => BaseService.getErrorLog(error));
    };

    const selectPartPopup = (mfgPart) => {
      const data = {
        mfgPart: mfgPart,
        supplierName: vm.supplierQuote && vm.supplierQuote.mfgCodemst ? vm.supplierQuote.mfgCodemst.mfgName : null,
        mappedManufactureList: vm.supplierQuote.isStrictlyCustomComponent ? vm.supplierQuote.mappedManufacturers : []
      };
      DialogFactory.dialogService(
        TRANSACTION.SELECT_PART_MODAL_CONTROLLER,
        TRANSACTION.SELECT_PART_MODAL_VIEW,
        event,
        data).then(() => {
        }, (selectItem) => {
          if (selectItem) {
            popUpForMultipleListed(selectItem, 'MultiplePart');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const selectBarcodePopup = (mfgPart) => {
      const data = mfgPart;
      DialogFactory.dialogService(
        TRANSACTION.SELECT_BARCODE_MODAL_CONTROLLER,
        TRANSACTION.SELECT_BARCODE_MODAL_VIEW,
        event,
        data).then(() => {
        }, (selectItem) => {
          if (selectItem) {
            vm.IdOfSelectMultipleBarcode = selectItem.id;
            popUpForMultipleListed(selectItem, 'MultipleBarcode');
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    const popUpForMultipleListed = (selectItem, selectType) => {
      if (selectItem) {
        const scanlabel = {
          regxpString: vm.supplierQuotePartDetails.scanLabel,
          mfgId: selectType === 'MultiplePart' && selectItem ? selectItem.id : 0,
          barcodeId: selectType === 'MultipleBarcode' && selectItem ? selectItem.id : vm.IdOfSelectMultipleBarcode ? vm.IdOfSelectMultipleBarcode : null,
          supplierID: vm.supplierQuote.isStrictlyCustomComponent ? vm.supplierQuote.supplierID : null
        };
        scanBarcode(scanlabel);
      }
    };
    const getAuthenticationOfApprovalPart = (ev, componentObj) => {
      const objPartDetail = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        refTableName: CORE.TABLE_NAME.SUPPLIER_QUOTE_PARTS_DET,
        isAllowSaveDirect: false,
        approveFromPage: CORE.PAGENAME_CONSTANT[33].PageName,
        confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_WITH_PACKAGING_ALIAS,
        createdBy: vm.loginUser.userid,
        updatedBy: vm.loginUser.userid,
        informationMsg: componentObj.informationMsg
      };
      DialogFactory.dialogService(
        CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
        CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
        ev,
        objPartDetail).then((data) => {
          if (data) {
            data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.PERMISSION_WITH_PACKAGING_ALIAS, componentObj.PIDCode, componentObj.restrictUSEwithpermission ? vm.CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission : vm.CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission, data.approveFromPage, data.username);
            vm.supplierQuotePartDetails.approvalDetails = data;
            if (vm.isScanLabel) {
              vm.supplierQuotePartDetails.partID = componentObj.id;
              vm.supplierQuotePartDetails.supplierPartID = componentObj.supplierMFGPNID ? componentObj.supplierMFGPNID : null;
              const autocompletePromise = [getMfgSearch({ mfgcodeID: componentObj.mfgcodeID }), getComponentDetailsByMfg({ id: componentObj.id, mfgcodeID: componentObj.mfgcodeID, isContainCPN: true })];
              vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
                vm.checkUniqueSupplierQuotePart(vm.supplierQuotePartDetails.partID, vm.supplierQuotePartDetails.supplierPartID ? vm.supplierQuotePartDetails.supplierPartID : null, true);
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.supplierQuotePartDetails.partID = componentObj.id;
              vm.supplierQuotePartDetails.supplierPartID = componentObj.supplierMFGPNID ? componentObj.supplierMFGPNID : null;
              setFocus('isActiveRadio');
            }
          }
        }, () => {
          vm.isScanLabel = false;
          vm.supplierQuotePartDetails.scanLabel = null;
          $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
          $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
          setFocus('scanLabel');
        }).catch((error) => BaseService.getErrorLog(error));
    };

    const processPartRecords = () => {
      _.each(vm.sourceData, (item) => {
        item.isRequirementReference = true;
        if (item.quoteStatus === CORE.SupplierQuoteWorkingStatus[1].ID) {
          item.isDisabledUpdate = true;
          item.isDisabledDelete = true;
        } else {
          item.isDisabledDelete = false;
        }
        if (item.attributesList) {
          const splitAttributes = item.attributesList.split('@@@');
          const attributes = {};
          const attributeNames = [];
          _.map(splitAttributes, (data) => {
            if (data) {
              const splitValue = data.split('###');
              if (splitValue.length > 0) {
                attributes[parseInt(splitValue[0])] = {
                  id: parseInt(splitValue[0]),
                  fieldName: splitValue[1],
                  selected: true,
                  supplierQuotePartDetID: item.id,
                  isPricingDone: item.pricingCount > 0 ? true : false
                };
                attributeNames.push(splitValue[1]);
              }
            }
          });
          item.selectedAttributes = attributes;
          item.attributeNames = attributeNames;//attributeNames.join(',');
        }
      });
    };

    vm.partPricing = (row, ev) => {
      const popUpData = {
        supplierQuoteId: vm.supplierQuote.id,
        supplierQuotePartDetailId: row.entity.id,
        partId: row.entity.partID
      };
      DialogFactory.dialogService(
        CORE.SUPPLIER_QUOTE_PART_PRICE_DETAIL_CONTROLLER,
        CORE.SUPPLIER_QUOTE_PART_PRICE_DETAIL_VIEW,
        ev,
        popUpData).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.partPricingHistory = (row, ev) => {
      const popUpData = {
        supplierQuotePartDetID: row.entity.id
      };
      DialogFactory.dialogService(
        CORE.SUPPLIER_QUOTE_PART_PRICING_HISTORY_CONTROLLER,
        CORE.SUPPLIER_QUOTE_PART_PRICING_HISTORY_VIEW,
        ev,
        popUpData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.viewRequirementReference = (row, ev) => {
      const popUpData = {
        supplierQuoteMstID: vm.supplierQuote.id,
        supplierQuotePartDetID: row.entity.id,
        partID: row.entity.partID
      };
      DialogFactory.dialogService(
        CORE.SUPPLIER_QUOTE_PART_PRICING_WHERE_USED_CONTROLLER,
        CORE.SUPPLIER_QUOTE_PART_PRICING_WHERE_USED_VIEW,
        ev,
        popUpData).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.goToSupplierQuoteList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_STATE);
    };
    const selectSupplierQuote = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: item.id });
        $timeout(() => {
          vm.autoCompleteQuoteNumber.keyColumnId = null;
        }, true);
      }
    };

    vm.deleteRecord = (supplierQuote) => {
      let selectedIDs = [];
      let refsupplierQuoteID = [];
      if (supplierQuote) {
        if (supplierQuote.id) {
          selectedIDs.push(supplierQuote.id);
          refsupplierQuoteID.push(supplierQuote.supplierQuoteMstID);
        }
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
          refsupplierQuoteID = vm.selectedRows.map((item) => item.supplierQuoteMstID);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Supplier Quote Part Detail', selectedIDs.length);

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          supplierQuoteID: refsupplierQuoteID,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = SupplierQuoteFactory.deleteSupplierQuotePartDetail().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.loadData();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'supplier quote part detail'),
          multiple: true
        };
        DialogFactory.alertDialog(alertModel);
      }
    };
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectQuote);
      } else {
        _.map(vm.sourceData, unselectQuote);
      }
    };
    const selectQuote = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectQuote = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setSupplierQuoteRemove = (row) => {
      const totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
      else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.apply = true;
      } else {
        vm.apply = false;
      }
    };
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* For max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToQuoteAttributelist = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE, { type: CORE.QUOTE_DB_ATTRIBUTE_TYPE.SUPPLIER });
    };

    /** Redirect to supplier page */
    vm.goToSupplier = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
    };

    /** Redirect to manufacturer page */
    vm.goToMFGList = () => {
      BaseService.openInNew(USER.ADMIN_MANUFACTURER_STATE, {});
    };

    /** Redirect to part master page */
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    vm.goToSupplierPartList = () => {
      BaseService.goToSupplierPartList();
    };

    // go to manufacturer page
    vm.goToManufacturer = (id) => {
      BaseService.goToManufacturer(id);
    };

    // redirect to manage supplier page
    vm.goToSupplierDetail = (id) => {
      BaseService.goToSupplierDetail(id);
    };

    /* Redirect to Add new records for supplier quote*/
    vm.addSupplierQuote = (isNewTab) => {
      if (isNewTab) {
        BaseService.goToSupplierQuoteWithPartDetail();
      } else {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: null });
      }
    };

    vm.goToSupplierQuoteList = () => {
      BaseService.goToSupplierQuoteList();
    };

    $scope.$on('$destroy', () => {
      bindDocuments();
    });

    // get supplier quote document count
    const getSupplierQuoteDocumentCount = () => {
      if (vm.supplierQuote.id) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.supplierQuote.id,
          type: CORE.AllEntityIDS.Supplier_Quote.Name
        }).$promise.then((response) => {
          vm.documentCount = response.data;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCount = 0;
      }
    };
    getSupplierQuoteDocumentCount();
    //on for document
    const bindDocuments = $scope.$on('documentCount', () => {
      getSupplierQuoteDocumentCount();
    });

    angular.element(() => {
      BaseService.currentPageForms = [vm.formSupplierQuoteDetails, vm.formSupplierQuotePartDetails];
    });
  }
})();


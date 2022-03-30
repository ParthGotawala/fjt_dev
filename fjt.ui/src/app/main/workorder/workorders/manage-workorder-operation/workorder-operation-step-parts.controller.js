(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationPartsController', WorkorderOperationPartsController);

  /** @ngInject */
  function WorkorderOperationPartsController($scope, $timeout, $q, WORKORDER,
    OPERATION, CORE, DialogFactory, $mdDialog, USER, RFQSettingFactory, RFQTRANSACTION,
    uiSortableMultiSelectionMethods, WorkorderOperationFactory, BaseService, WorkorderOperationPartFactory, WorkorderOperationEmployeeFactory, ComponentFactory) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'woOpPartsForm';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code
    var validateFluxTypeErr = 0;
    vm.SearchAddedListPart = null;
    vm.SearchNoAddedListPart = null;
    //vm.isHideSearchButtonPart = false;
    //vm.isHideSearchButtonaddedPart = false;
    vm.EmptyMesssagePart = OPERATION.OPERATION_EMPTYSTATE.ASSIGNPART;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssageForOpDataFields = OPERATION.OPERATION_EMPTYSTATE.ASSIGNPART;
    vm.isContainOpMasterParts = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const loginUserDetails = BaseService.loginUser;
    let restrictPartAuthenticationDet = null;

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    let pagingInfoForOpParts = {};
    const initPageInfoForOpParts = () => {
      pagingInfoForOpParts = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        searchTextOfNoAddedPart: null,
        partID: vm.operation.workorder.partID
      };
    };

    /* get Obsolete Part error code information */
    const getObsoletePartErrorInfo = () => {
      vm.cgBusyLoading = RFQSettingFactory.getErrorCodeByLogicID().save({
        logicID: CORE.errorCodeLogicIDs.OBS
      }).$promise.then((res) => {
        vm.obsoletePartErrorColor = res && res.data ? res.data.errorColor : '';
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* unit dropdown fill up */
    const getUomlist = () => ComponentFactory.getUOMsList().query().$promise.then((res) => {
      vm.uomlist = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const onSelectSetUOMDetails = (selectedItem, fromItem) => {
      fromItem.autoCompleteuom.keyColumnId = selectedItem ? selectedItem.id : null;
    };

    const defaultAutoCompleteUOM = {
      columnName: 'unitName',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Unit',
      placeholderName: 'UOM',
      isRequired: false,
      isAddnew: false,
      callbackFn: getUomlist,
      onSelectCallbackFn: onSelectSetUOMDetails,
      callbackFnParam: null
    };

    /**
    * Step 5 Drag and Drop Part and Select Part
    *
    * @param
    */

    //$scope.$on('getPartDetails', function (e, data) {
    //    vm.partDetails(data);
    //});
    /**
    * retreive Operation Part Details
    *
    * @param
    */

    vm.partDetails = () => {
      //if (isPartsTabClick) {
      initPageInfoForOpParts();
      UnSelectAllPart();
      //}
      vm.SearchAddedListPart = null;
      vm.SearchNoAddedListPart = null;

      const opPartPromises = [getAllPartsNotAddedInWoOp(false), getAllPartsAddedInWoOp()];
      vm.cgBusyLoading = $q.all(opPartPromises).then((responses) => {
        if (responses && responses.length > 0) {
          setDetailsForOpSMT();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const setDetailsForOpSMT = (isOnlyNotAddedPart) => {
      vm.isContainOpMasterParts = vm.partAddedList.length === 0 && vm.partNoAddedList.length === 0
        && !vm.SearchNoAddedListPart && !vm.SearchAddedListPart ? false : true;
      setSelectableListItem(isOnlyNotAddedPart);
    };

    /* load data of not added supplier , material and tools */
    const getAllPartsNotAddedInWoOp = (isCalledFromLoadMoreData) => WorkorderOperationFactory.retrieveNotAddedPartsForWoOp(pagingInfoForOpParts).query({ woOPID: vm.operation.woOPID }).$promise.then((res) => {
      if (res.data) {
        // if first time call then blank array and on load more need to concat with existing data
        if (!isCalledFromLoadMoreData) {
          vm.partNoAddedList = [];
        }
        vm.partNoAddedList = vm.partNoAddedList.concat(res.data.partMasterList);
        vm.partNoAddedListTotalCount = res.data.Count;
        _.each(vm.partNoAddedList, (itemData) => {
          const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
          itemData.displayRohsIcon = rohsImagePath + itemData.rohsIcon;
          if (!itemData.imageURL) {
            itemData.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          } else {
            if (!itemData.imageURL.startsWith('http://') && !itemData.imageURL.startsWith('https://')) {
              itemData.imageURL = BaseService.getPartMasterImageURL(itemData.documentPath, itemData.imageURL);
            }
          }
          itemData.fluxTypeList = [];
          itemData.fluxTypeList.push({
            value: itemData.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          itemData.fluxTypeList.push({
            value: itemData.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          itemData.fluxTypeList.push({
            value: itemData.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
          itemData.isObsoletePart = itemData.partStatusValue === RFQTRANSACTION.PART_COSTING.Obsolete;
          itemData.cleaningTypeText = '';
          if (itemData.isFluxNotApplicable === 1) {
            itemData.cleaningTypeText = 'Not Applicable';
          }
          if (itemData.isNoClean === 1) {
            itemData.cleaningTypeText = itemData.cleaningTypeText + 'No-Clean';
          }
          if (itemData.isWaterSoluble === 1) {
            itemData.cleaningTypeText = itemData.cleaningTypeText + 'Water-Soluble';
          }
          //itemData.restrictUSEwithpermission = itemData.restrictUSEwithpermission ? true : false;
          //itemData.restrictUsePermanently = itemData.restrictUsePermanently ? true : false;
          //itemData.restrictPackagingUseWithpermission = itemData.restrictPackagingUseWithpermission ? true : false;
          //itemData.restrictPackagingUsePermanently = itemData.restrictPackagingUsePermanently ? true : false;
          //itemData.restrictUseInBOMStep = itemData.restrictUseInBOMStep ? true : false;
          //itemData.restrictUseInBOMWithPermissionStep = itemData.restrictUseInBOMWithPermissionStep ? true : false;
        });
        vm.isLoadMore = res.data.Count > vm.partNoAddedList.length;
      }
    }).catch((error) => BaseService.getErrorLog(error));


    /* load data of already added supplier , material and tools */
    const getAllPartsAddedInWoOp = () => WorkorderOperationFactory.retrieveAddedPartsForWoOp().save({
      woOPID: vm.operation.woOPID,
      searchText: vm.SearchAddedListPart,
      partID: vm.operation.workorder.partID
    }).$promise.then((res) => {
      if (res.data && res.data.woOpPartList) {
        vm.partAddedList = [];
        vm.partAddedList = res.data.woOpPartList;
        _.each(vm.partAddedList, (itemData) => {
          const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
          itemData.displayRohsIcon = rohsImagePath + itemData.rohsIcon;
          if (!itemData.imageURL) {
            itemData.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
          } else {
            if (!itemData.imageURL.startsWith('http://') && !itemData.imageURL.startsWith('https://')) {
              itemData.imageURL = BaseService.getPartMasterImageURL(itemData.documentPath, itemData.imageURL);
            }
          }
          itemData.isObsoletePart = itemData.partStatusValue === RFQTRANSACTION.PART_COSTING.Obsolete;
          itemData.uomlist = _.filter(vm.uomlist, (uomitem) => uomitem.measurementTypeID === itemData.measurementTypeID);
          itemData.isQpaAllowedInDeciaml = itemData.measurementTypeID == CORE.UOM_DEFAULTS.EACH.ID ? false : true;
          itemData.autoCompleteuom = angular.copy(defaultAutoCompleteUOM);
          itemData.autoCompleteuom.keyColumnId = itemData.uomID ? itemData.uomID : itemData.uom;
          itemData.autoCompleteuom.callbackFnParam = itemData;
          itemData.fluxTypeList = [];
          itemData.fluxTypeList.push({
            value: itemData.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon: true
          });
          itemData.fluxTypeList.push({
            value: itemData.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
          });
          itemData.fluxTypeList.push({
            value: itemData.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
          });
          itemData.isObsoletePart = itemData.partStatusValue == RFQTRANSACTION.PART_COSTING.Obsolete;
          itemData.cleaningTypeText = '';
          if (itemData.isFluxNotApplicable === 1) {
            itemData.cleaningTypeText = 'Not Applicable';
          }
          if (itemData.isNoClean === 1) {
            itemData.cleaningTypeText = itemData.cleaningTypeText + 'No-Clean';
          }
          if (itemData.isWaterSoluble === 1) {
            itemData.cleaningTypeText = itemData.cleaningTypeText + 'Water-Soluble';
          }
        });
      }
    }).catch((error) => BaseService.getErrorLog(error));


    /* on click of load more button - get data of not added supply,material list */
    vm.getMoreSupplyMaterialToolData = () => {
      pagingInfoForOpParts.Page = pagingInfoForOpParts.Page + 1;
      const notAddedPartPromises = [getAllPartsNotAddedInWoOp(true)];
      vm.cgBusyLoading = $q.all(notAddedPartPromises).then((responses) => {
        if (responses && responses.length > 0) {
          setDetailsForOpSMT(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* searching functionality from  */
    vm.searchPartFromNoAddedList = () => {
      //if (vm.SearchNoAddedListPart) {
      initPageInfoForOpParts();
      UnSelectAllPart();
      pagingInfoForOpParts.searchTextOfNoAddedPart = vm.SearchNoAddedListPart;
      const notAddedPartPromises = [getAllPartsNotAddedInWoOp(false)];
      vm.cgBusyLoading = $q.all(notAddedPartPromises).then((responses) => {
        if (responses && responses.length > 0) {
          setDetailsForOpSMT();
        }
      }).catch((error) => BaseService.getErrorLog(error));
      //}
      //else {
      //    vm.partOperationDetails();
      //}
    };

    /* searching functionality from  */
    vm.searchPartFromAddedList = () => {
      UnSelectAllPart();
      const addedPartPromises = [getAllPartsAddedInWoOp()];
      vm.cgBusyLoading = $q.all(addedPartPromises).then((responses) => {
        if (responses && responses.length > 0) {
          setDetailsForOpSMT();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    $scope.selectedPartListNoAdded = [];
    $scope.selectedPartListAdded = [];

    //cancel drop event if canceled or validation failed
    const cancelDropEvent = (optype, e, ui) => {
      if (ui) {
        if (ui.item && ui.item.sortable && ui.item.sortable.cancel) {
          ui.item.sortable.cancel();
        } else {
          vm.refreshDataPart();
        }
      }
      return false;
    };

    //#region sortable option common for all list
    $scope.sortableOptionsPart = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow, :input',
      placeholder: 'beingDragged',
      disabled: vm.isWOUnderTermination,
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      handle: ':not(input)',
      stop: (e, ui) => {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target part
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded !== DestinationDivAdded) {
            if (SourceDivAdded === false && DestinationDivAdded === true) {
              if ($scope.selectedPartListNoAdded.length === 0) {
                $scope.selectedPartListNoAdded.push(sourceModel);
              }
              // validateFluxTypePartAgainstOperation(sourceModel,e,ui);
              const dragDropOtherDetails = {
                isRefreshDataRequired: true
              };
              vm.ModifyPageAddedPart('Add', e, ui, dragDropOtherDetails);
              return;
            }
            else if (SourceDivAdded === true && DestinationDivAdded === false) {
              if ($scope.selectedPartListAdded.length === 0) {
                $scope.selectedPartListAdded.push(sourceModel);
              }
              vm.ModifyPageAddedPart('Remove', e, ui, null);
              return;
            }
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion

    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    //#region reset value of selected part
    const ResetSelectedPart = () => {
      $scope.selectedPartListNoAdded = [];
      $scope.selectedPartListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    };
    //#endregion

    //#region check for selected part
    const checkSelectAllFlagPart = () => {
      $scope.selectAnyNoAdded = $scope.selectedPartListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedPartListAdded.length > 0 ? true : false;
    };
    //#endregion

    //#region unselect all part list
    const UnSelectAllPart = () => {
      angular.element('[ui-sortable]#partNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#partAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedPart();
    };
    //#endregion

    //#region unselect single part list
    const UnSelectPart = (unSelectFrom) => {
      if (unSelectFrom === 'NoAdded') {
        angular.element('[ui-sortable]#partNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#partAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedPart();
    };
    //#endregion

    //# set not add part selectable after render ui
    const setNotAddPartSelectable = () => {
      angular.element('[ui-sortable]#partAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectPart('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedPartListAdded = _.map(selectedItemIndexes, (i) => vm.partAddedList[i]);
        checkSelectAllFlagPart();
        $scope.$applyAsync();
      });
    };

    //# set add part selectable after render ui
    const setAddPartSelectable = () => {
      angular.element('[ui-sortable]#partNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectPart('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedPartListNoAdded = _.map(selectedItemIndexes, (i) => vm.partNoAddedList[i]);
        checkSelectAllFlagPart();
        $scope.$applyAsync();
      });
    };

    //#region  set item selectable
    const SetPartSelectable = (isOnlyNotAddedPart) => {
      console.time('SetPartSelectable');
      if (isOnlyNotAddedPart) {
        setNotAddPartSelectable();
      } else {
        setNotAddPartSelectable();
        setAddPartSelectable();
      }
    };

    const setSelectableListItem = (isOnlyNotAddedPart) => {
      $timeout(() => {
        SetPartSelectable(isOnlyNotAddedPart);
      }, _configSelectListTimeout);
    };
    //#endregion

    //#region for destroy selection
    const DestroyPartSelection = () => {
      angular.element('[ui-sortable]#partNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#partAddedList').off('ui-sortable-selectionschanged');
    };

    const DestroyAllSelectionPart = () => {
      DestroyPartSelection();
    };
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', () => {
      DestroyAllSelectionPart();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    //#endregion

    vm.refreshDataPart = () => {
      vm.partDetails();
    };

    vm.addDataPart = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      // modify code and add POPUP Code
      const event = angular.element.Event('click');
      angular.element('body').trigger(event);
      const data = { mfgType: CORE.MFG_TYPE.MFG };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW,
          event,
          data).then(() => { //success section
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    // ask for revision popup to user
    //let askForRevisionPopUp = (addType, event, ui) => {
    //  if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
    //    vm.openWOOPRevisionPopup(function (versionModel) {
    //      // Added for close revision dialog popup
    //      if (versionModel && versionModel.isCancelled) {
    //        cancelDropEvent(addType, event, ui);
    //        return;
    //      }
    //      if (versionModel) {
    //        saveWorkorderParts(addType, versionModel, ui);
    //      }
    //      else
    //        saveWorkorderParts(addType, null, ui);
    //    }, event);
    //  }
    //  else {
    //    saveWorkorderParts(addType, null, ui);
    //  }
    //}

    //#region modify data part Added based on selection from both list
    vm.ModifyPageAddedPart = (addType, event, ui, dragDropOtherDetails) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      restrictPartAuthenticationDet = null;
      if (addType === 'Add' || addType === 'AddAll') {
        /* check if any TBD RoHS part exists then not allowed to add any part */
        const TBDRohsPartList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => newAddingItem.isTBDROHSPart);

        /* check if any permanent restricted part exists then not allowed to add any part */
        const permanentlyRestrictedPartList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => newAddingItem.restrictUsePermanently || newAddingItem.restrictPackagingUsePermanently
          || newAddingItem.restrictUseInBOMStep);

        /* check if any restricted part with permission exists then ask for authentication */
        const usePartWithRestrictPermissionList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => newAddingItem.restrictUSEwithpermission || newAddingItem.restrictPackagingUseWithpermission
          || newAddingItem.restrictUseInBOMWithPermissionStep);

        const anyNonRestrictTypePartList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => !newAddingItem.restrictUsePermanently && !newAddingItem.restrictPackagingUsePermanently
          && !newAddingItem.restrictUseInBOMStep
          && !newAddingItem.restrictUSEwithpermission && !newAddingItem.restrictPackagingUseWithpermission
          && !newAddingItem.restrictUseInBOMWithPermissionStep);

        if (TBDRohsPartList && TBDRohsPartList.length > 0) {
          const restrictPartDet = {
            restrictedPartList: TBDRohsPartList,
            alertMessage: WORKORDER.SMT.NOT_ALLOW_TBD_ROHS_PART_ACCESS
          };
          openRestrictedPartPopup(restrictPartDet, dragDropOtherDetails);
          return;
        }
        else if (permanentlyRestrictedPartList && permanentlyRestrictedPartList.length > 0) {
          const restrictPartDet = {
            restrictedPartList: permanentlyRestrictedPartList,
            alertMessage: WORKORDER.SMT.PERMANENT_RESTRICTED_PART_NOT_ALLOWED
          };
          openRestrictedPartPopup(restrictPartDet, dragDropOtherDetails);
          return;
        }
        else if (usePartWithRestrictPermissionList && usePartWithRestrictPermissionList.length > 0) {
          /* multiple part selected including restricted part (with permission) and non restricted part together */
          if ((anyNonRestrictTypePartList && anyNonRestrictTypePartList.length > 0) || usePartWithRestrictPermissionList.length > 1) {
            const restrictPartDet = {
              restrictedPartList: usePartWithRestrictPermissionList,
              alertMessage: WORKORDER.SMT.MULTIPLE_RESTRICTED_PART_WITH_PERMISSION_NOT_ALLOWED
            };
            openRestrictedPartPopup(restrictPartDet, dragDropOtherDetails);
            return;
          }
          else if (usePartWithRestrictPermissionList.length === 1) { /* selected single restricted part (with permission) only */
            const data = {
              featureName: CORE.FEATURE_NAME.AllowRestrictWithPermission,
              isAllowSaveDirect: false,
              msgObject: {}
            };

            DialogFactory.dialogService(
              CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_CONTROLLER,
              CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_VIEW,
              event, data).then((resOfAuthData) => {
                if (resOfAuthData) {
                  const partASSMTDet = _.first(usePartWithRestrictPermissionList);
                  const opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.operation.opName, vm.operation.opNumber);
                  restrictPartAuthenticationDet = {
                    refID: null,
                    refTableName: CORE.TABLE_NAME.WORKORDER_OPERATION_PART,
                    isAllowSaveDirect: false,
                    approveFromPage: CORE.PageName.FullName.wo_op_suppliesMaterialsAndTools,
                    approvedBy: resOfAuthData.approvedBy,
                    approvalReason: resOfAuthData.approvalReason,
                    transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.WO_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD,
                      partASSMTDet.PIDCode, vm.operation.workorder.woNumber, opFullName),
                    confirmationType: CORE.Generic_Confirmation_Type.WO_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD,
                    createdBy: loginUserDetails.userid,
                    updatedBy: loginUserDetails.userid
                  };
                  //askForRevisionPopUp(addType, event, ui);
                  saveWorkorderParts(addType, null, ui);
                }
              }, () => {
                if (dragDropOtherDetails && dragDropOtherDetails.isRefreshDataRequired) {
                  vm.partDetails();
                }
              }).catch((error) => BaseService.getErrorLog(error));
          }
        }
        else {
          //askForRevisionPopUp(addType, event, ui);
          saveWorkorderParts(addType, null, ui);
        }
      } else {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, CORE.MainTitle.SupplyAndMaterial),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((res) => {
          if (res) {
            //askForRevisionPopUp(addType, event, ui);
            saveWorkorderParts(addType, null, ui);
          }
        }, () => {
          cancelDropEvent(addType, event, ui);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //#endregion

    const sendNotificationAndRefresh = (versionModel) => {
      vm.sendNotification(versionModel);
      vm.refreshDataPart();
      if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
        vm.refreshWorkOrderHeaderDetails();
      }
    };

    // validate part being added to  operation based on flux type combination of both side
    const validateFluxTypePartAgainstOperation = (selectedPartList, e, ui) => {
      const errMsg = '<br/>Following part(s) not allowed:';
      let messageContent;
      let opConfigMsg;
      let errOp = '<ui>';
      validateFluxTypeErr = 0;
      _.each(selectedPartList, (selectedPart) => {
        // Flux type not defined at Part level
        if (selectedPart.isFluxNotApplicable === 0 && selectedPart.isNoClean === 0 && selectedPart.isWaterSoluble === 0) {
          validateFluxTypeErr = 1;
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PART_FLUX_TYPE_NOT_CONFIGURED);
          messageContent.message = stringFormat(messageContent.message, selectedPart.PIDCode);
        } else {
          // OP: NA
          if (vm.operation.isFluxNotApplicable === true) {
            opConfigMsg = 'Operation configured as Flux Type-Not applicable';
            if (selectedPart.isNoClean === 1 && selectedPart.isWaterSoluble === 1) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- No-Clean and Water-Soluble </li>';
              validateFluxTypeErr = 2;
            } else if (selectedPart.isNoClean === 1) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- No-Clean </li> </li>';
              validateFluxTypeErr = 2;
            } else if (selectedPart.isWaterSoluble === 1) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- Water-Soluble</li> </li>';
              validateFluxTypeErr = 2;
            }
          }
          // OP: Both
          if ((vm.operation.isNoClean === true && vm.operation.isWaterSoluble === true) && (selectedPart.isWaterSoluble === 1 && selectedPart.isNoClean === 1)) {
            opConfigMsg = 'Operation configured as No-Clean and Water-Soluble.';
            errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- No-Clean and Water-Soluble</li>';
            validateFluxTypeErr = 2;
          }
          // OP: No-Clean
          if (vm.operation.isNoClean === true && vm.operation.isWaterSoluble === false) {
            opConfigMsg = 'Operation configured as No-Clean.';
            if (selectedPart.isNoClean === 0 && selectedPart.isWaterSoluble === 1) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- Water-Soluble </li>';
              validateFluxTypeErr = 2;
            } else if (selectedPart.isNoClean === 1 && selectedPart.isWaterSoluble === 1) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- No-Clean and Water-Soluble</li>';
              validateFluxTypeErr = 2;
            }
          }
          // OP: Water-Soluble
          if (vm.operation.isNoClean === false && vm.operation.isWaterSoluble === true) {
            opConfigMsg = 'Operation configured as Water-Soluble.';
            if (selectedPart.isNoClean === 1 && selectedPart.isWaterSoluble === 0) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- No-Clean</li>';
              validateFluxTypeErr = 2;
            } else if (selectedPart.isNoClean === 1 && selectedPart.isWaterSoluble === 1) {
              errOp = errOp + '<li>' + selectedPart.PIDCode + '&nbsp;&nbsp;- No-Clean and Water-Soluble</li>';
              validateFluxTypeErr = 2;
            }
          }
          errOp = errOp + '</ui>';
          if (validateFluxTypeErr === 2) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DYNAMIC_ERROR);
            messageContent.message = stringFormat(messageContent.message, opConfigMsg + errMsg + errOp);
            //DialogFactory.messageAlertDialog({
            //  messageContent: messageContent,
            //  multiple: true
            //}).then(() => cancelDropEvent('Add', e, ui));
          }
        }
      });
      if (validateFluxTypeErr > 0) {
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj).then(() => cancelDropEvent('Add', e, ui));
      }
    };
    //save- add part to  workorder operation
    const saveAddPartToWorkorderOperation = (versionModel) => {
      const promises = [saveWorkorderOperationParts($scope.selectedPartListNoAdded)];
      vm.cgBusyLoading = $q.all(promises).then((responses) => {
        if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
          sendNotificationAndRefresh(versionModel);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // common function for add/remove part for work order operation
    function saveWorkorderParts(addType, versionModel, ui) {
      if (addType === 'Add') {
        let inactivePart = false;
        const inactivePartList = [];
        // validate Part against operation
        validateFluxTypePartAgainstOperation($scope.selectedPartListNoAdded, event, ui);
        if (validateFluxTypeErr > 0) {
          return;
        }
        //confirm for part with inactive status
        _.each($scope.selectedPartListNoAdded, (item) => {
          if (item.partStatus === CORE.PartStatusList.InActiveInternal) {
            inactivePart = true;
            inactivePartList.push(item.PIDCode);
          }
        });
        if (inactivePart) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, inactivePartList.join(','));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              saveAddPartToWorkorderOperation(versionModel);
            }
          }, () => {
            return;
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          saveAddPartToWorkorderOperation(versionModel);
        }
      } else if (addType === 'Remove') {
        const promises = [deleteWorkorderOperationParts($scope.selectedPartListAdded)];
        vm.cgBusyLoading = $q.all(promises).then((resDel) => {
          if (resDel[0] && resDel[0].data) {
            if (resDel[0].data.TotalCount && resDel[0].data.TotalCount > 0) {
              BaseService.deleteAlertMessage(resDel[0].data);
              cancelDropEvent(addType, event, ui);
            } else {
              sendNotificationAndRefresh(versionModel);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (addType === 'RemoveAll') {
        const promises = [deleteWorkorderOperationParts(vm.partAddedList)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].data) {
            if (responses[0].data.TotalCount && responses[0].data.TotalCount > 0) {
              BaseService.deleteAlertMessage(responses[0].data);
              cancelDropEvent(addType, event, ui);
            } else {
              sendNotificationAndRefresh(versionModel);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    /* save component in work order operation */
    const saveWorkorderOperationParts = (newListToSave) => {
      let saveObj = [];
      saveObj = _.map(newListToSave, (item) => {
        return {
          woID: vm.operation.woID,
          opID: vm.operation.opID,
          woOPID: vm.operation.woOPID,
          partID: item.id
        };
      });
      const listObj = {
        woID: vm.operation.woID,
        opID: vm.operation.opID,
        woOPID: vm.operation.woOPID,
        partList: saveObj,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName,
        restrictPartAuthenticationDet: restrictPartAuthenticationDet
      };

      return WorkorderOperationFactory.createWorkorderOperationParts().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
    };

    /* delete component in work-order_operation */
    const deleteWorkorderOperationParts = (listToDelete) => {
      const _objList = {};
      _objList.woID = vm.operation.woID;
      _objList.woOPID = vm.operation.woOPID;
      _objList.partID = _.map(listToDelete, (obj) => obj.id);
      return WorkorderOperationEmployeeFactory.deleteOperationFromWorkOrder().query({ listObj: _objList }).$promise.then((part) => {
        return part;
      }).catch((error) => BaseService.getErrorLog(error));
    };


    const opPageInitPromises = [getObsoletePartErrorInfo(), getUomlist()];
    vm.cgBusyLoading = $q.all(opPageInitPromises).then(() => {
      vm.partDetails();
    }).catch((error) => BaseService.getErrorLog(error));

    /* save QAP and UOM details */
    vm.saveQPADetails = ($event) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }

      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.woOpPartsForm, false)) {
        vm.saveDisable = false;
        return;
      }

      const obj = {
        title: CORE.MESSAGE_CONSTANT.COMMON_CONFIRMATION,
        textContent: CORE.MESSAGE_CONSTANT.QPA_UOM_SAVE_FOR_SMT,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((res) => {
        if (res) {
          if (vm.operation.workorder.woSubStatus === CORE.WOSTATUS.PUBLISHED || vm.operation.workorder.woSubStatus === CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS) {
            vm.saveDisable = false;
            vm.openWOOPRevisionPopup((versionModel) => {
              // Added for close revision dialog popup
              if (versionModel && versionModel.isCancelled) {
                vm.SearchAddedListPart = '';
                vm.searchPartFromAddedList();
                return;
              }
              if (versionModel) {
                updateQPADetails(versionModel);
              }
              else {
                updateQPADetails(null);
              }
            }, $event);
          }
          else {
            updateQPADetails(null);
          }
        }
      }, () => {
        vm.SearchAddedListPart = '';
        vm.searchPartFromAddedList();
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    function updateQPADetails(versionModel) {
      const updateSMTQPAList = [];
      _.each(vm.partAddedList, (item) => {
        const _obj = {};
        _obj.qpa = item.qpa != null ? item.qpa.toFixed(_unitFilterDecimal) : null;
        _obj.actualQpa = item.actualQpa != null ? item.actualQpa.toFixed(_unitFilterDecimal) : null;
        _obj.uomID = item.autoCompleteuom.keyColumnId != null ? item.autoCompleteuom.keyColumnId : null;
        _obj.woOPPartID = item.woOPPartID;
        updateSMTQPAList.push(_obj);
      });

      const updateSMTQPAObj = {
        updateSMTQPAList: updateSMTQPAList,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName,
        woOPID: vm.operation.woOPID
      };

      vm.cgBusyLoading = WorkorderOperationPartFactory.saveSMTQPADetails().save(updateSMTQPAObj).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (versionModel) {
            vm.sendNotification(versionModel);
            if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
              vm.refreshWorkOrderHeaderDetails();
            }
          }
          vm.woOpPartsForm.$setPristine();
          vm.woOpPartsForm.$setUntouched();
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    const openRestrictedPartPopup = (restrictPartDet, dragDropOtherDetails) => {
      const data = restrictPartDet;

      DialogFactory.dialogService(
        WORKORDER.PERMANENT_RESTRICT_PART_MODAL_CONTROLLER,
        WORKORDER.PERMANENT_RESTRICT_PART_MODAL_VIEW,
        event, data).then(() => { // success section
          //if (resData) {
          //}
        }, () => {
          if (dragDropOtherDetails && dragDropOtherDetails.isRefreshDataRequired) {
            vm.partDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* go to mounting type list page */
    vm.goToMountingGroupData = () => {
      BaseService.goToMountingGroupList();
    };
  };

  //angular
  //   .module('app.workorder.workorders'). = function () {
  //   };
})();

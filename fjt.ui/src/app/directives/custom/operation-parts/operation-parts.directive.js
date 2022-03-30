(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationParts', operationParts);

  /** @ngInject */
  function operationParts(CORE, USER, uiSortableMultiSelectionMethods, $q, OperationFactory, BaseService, RFQTRANSACTION, WORKORDER,
    DialogFactory, $timeout, RFQSettingFactory, OPERATION) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationId: '='
      },
      templateUrl: 'app/directives/custom/operation-parts/operation-parts.html',
      controller: operationPartsCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationPartsCtrl($scope) {
      var vm = this;

      vm.isContainMasterPart = false;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssageForOpParts = OPERATION.OPERATION_EMPTYSTATE.ASSIGNPART;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;

      const operationId = $scope.operationId ? parseInt($scope.operationId) : null;
      let restrictPartAuthenticationDet = null;

      let _partAddedList = [];
      let _partNoAddedList = [];
      vm.SearchAddedListPart = null;
      vm.SearchNoAddedListPart = null;

      let pagingInfoForOpParts = {};

      $scope.selectedPartListNoAdded = [];
      $scope.selectedPartListAdded = [];

      const initPageInfoForOpParts = () => {
        pagingInfoForOpParts = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          searchTextOfNoAddedPart: null
        };
      };

      //#region sortable option common for all list
      $scope.sortableOptionsPart = uiSortableMultiSelectionMethods.extendOptions({
        cancel: '.cursor-not-allow',
        placeholder: 'beingDragged',
        'ui-floating': true,
        cursorAt: {
          top: 0, left: 0
        },
        start: (e, ui) => {
        },
        sort: (e, ui) => {
        },
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
                const dragDropOtherDetails = {
                  isRefreshDataRequired: true
                };
                vm.ModifyPageAddedPart('Add', dragDropOtherDetails);
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                if ($scope.selectedPartListAdded.length === 0) {
                  $scope.selectedPartListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedPart('Remove', null);
                return;
              }
            }
          }
        },
        connectWith: '.items-container'
      });
      //#endregion

      //#region reset value of selected part
      const ResetSelectedPart = () => {
        $scope.selectedPartListNoAdded = [];
        $scope.selectedPartListAdded = [];
        $scope.selectAnyNoAddedPart = false;
        $scope.selectAnyAddedPart = false;
      };
      //#endregion

      //#region check for selected part
      const checkSelectAllFlagPart = () => {
        $scope.selectAnyNoAddedPart = $scope.selectedPartListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedPart = $scope.selectedPartListAdded.length > 0 ? true : false;
      };
      //#endregion

      //#region unselect all part list
      const UnSelectAllPart = () => {
        angular.element('[ui-sortable]#partNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#partAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedPart();
      };
      //#endregion

      /* load data of not added supplier , material and tools */
      const getAllPartsNotAddedInOperation = (isCalledFromLoadMoreData) => OperationFactory.retrievePartsForOpMaster(pagingInfoForOpParts).query({ opID: operationId }).$promise.then((res) => {
        if (res && res.data) {
          _partNoAddedList = [];
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
            itemData.isObsoletePart = itemData.partStatusValue === RFQTRANSACTION.PART_COSTING.Obsolete;
          });
          _partNoAddedList = angular.copy(vm.partNoAddedList);
          vm.isLoadMore = res.data.Count > vm.partNoAddedList.length;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      /* get Obsolete Part error code information */
      const getObsoletePartErrorInfo = () => {
        vm.cgBusyLoading = RFQSettingFactory.getErrorCodeByLogicID().save({
          logicID: CORE.errorCodeLogicIDs.OBS
        }).$promise.then((res) => {
          vm.obsoletePartErrorColor = res && res.data ? res.data.errorColor : '';
        }).catch((error) => BaseService.getErrorLog(error));
      };
      getObsoletePartErrorInfo();

      /* searching functionality from  */
      vm.searchPartFromNoAddedList = () => {
        initPageInfoForOpParts();
        UnSelectAllPart();
        pagingInfoForOpParts.searchTextOfNoAddedPart = vm.SearchNoAddedListPart;
        const notAddedPartPromises = [getAllPartsNotAddedInOperation(false)];
        vm.cgBusyLoading = $q.all(notAddedPartPromises).then((responses) => {
          if (responses && responses.length > 0) {
            setDetailsForOpSMT();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //#region modify data part Added based on selection from both list
      vm.ModifyPageAddedPart = (addType, dragDropOtherDetails) => {
        if (addType === 'Remove' || addType === 'RemoveAll') {
          confirmPartDeleteDragDrop(addType, dragDropOtherDetails);
        }
        else {
          checkAndUpdateModifiedPartDragDrop(addType, dragDropOtherDetails);
        }
      };

      const setOperationPartsDragDropDetails = () => {
        vm.SearchAddedListPart = null;
        vm.SearchNoAddedListPart = null;
        vm.partAddedList = _partAddedList;
        vm.partNoAddedList = _partNoAddedList;
        vm.searchPartFromNoAddedList();
      };

      /* save component in operation */
      const saveOperationParts = (newListToSave) => {
        vm.SearchAddedListPart = null;
        vm.SearchNoAddedListPart = null;
        const saveObj = [];

        _.each(newListToSave, (item) => {
          if (item.id) {
            const _object = {};
            _object.opID = operationId,
              _object.partID = item.id,
              saveObj.push(_object);
          }
        });

        const listObj = {
          opID: operationId,
          partList: saveObj,
          restrictPartAuthenticationDet: restrictPartAuthenticationDet
        };

        return OperationFactory.createOperation_PartList().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
      };

      //Open popup if part dropped into Added List is restricted
      const openRestrictedPartPopup = (restrictPartDet, dragDropOtherDetails) => {
        const data = restrictPartDet;

        DialogFactory.dialogService(
          WORKORDER.PERMANENT_RESTRICT_PART_MODAL_CONTROLLER,
          WORKORDER.PERMANENT_RESTRICT_PART_MODAL_VIEW,
          event, data).then(() => { // empty
          }, () => {
            if (dragDropOtherDetails && dragDropOtherDetails.isRefreshDataRequired) {
              vm.partOperationDetails();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      //Reload data
      vm.refreshDataPartForNoAddedListPart = () => {
        vm.partOperationDetails();
      };

      //Get all parts data
      vm.partOperationDetails = () => {
        initPageInfoForOpParts();
        UnSelectAllPart();

        vm.SearchAddedListPart = null;
        vm.SearchNoAddedListPart = null;

        const opPartPromises = [getAllPartsNotAddedInOperation(false), getOperationPartsAddedInOperation()];
        vm.cgBusyLoading = $q.all(opPartPromises).then((responses) => {
          if (responses && responses.length > 0) {
            setDetailsForOpSMT();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load data of already added supplier , material and tools */
      const getOperationPartsAddedInOperation = () => OperationFactory.retrieveOperationPartDetails().save({
        opID: operationId,
        searchText: vm.SearchAddedListPart
      }).$promise.then((res) => {
        if (res && res.data && res.data.operationPartList) {
          _partAddedList = vm.partAddedList = [];
          vm.partAddedList = res.data.operationPartList;
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
          });
          _partAddedList = angular.copy(vm.partAddedList);
        }
        // eslint-disable-next-line arrow-body-style
      }).catch((error) => BaseService.getErrorLog(error));

      //Add new Supplies/Materials/Tools using popup
      vm.addDataPart = () => {
        const event = angular.element.Event('click');
        angular.element('body').trigger(event);
        const data = {
          mfgType: CORE.MFG_TYPE.MFG
        };
        const popUpData = {
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
            CORE.MANAGE_COMPONENT_MODAL_VIEW,
            event,
            data).then(() => { // empty
            }, () => { // empty
            }, (error) => BaseService.getErrorLog(error));
        }
      };

      /* searching functionality from  */
      vm.searchPartFromAddedList = () => {
        UnSelectAllPart();
        const addedPartPromises = [getOperationPartsAddedInOperation()];
        vm.cgBusyLoading = $q.all(addedPartPromises).then((responses) => {
            if (responses && responses.length > 0) {
              setDetailsForOpSMT();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      // check add/remove supplies, materials and tools from drag drop
      const checkAndUpdateModifiedPartDragDrop = (addType, dragDropOtherDetails) => {
        restrictPartAuthenticationDet = null;

        if (addType === 'Add') {
          /* check if any TBD RoHS part exists then not allowed to add any part */
          const TBDRohsPartList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => newAddingItem.isTBDROHSPart);

          /* check if any permanent restricted part exists then not allowed to add any part */
          const permanentlyRestrictedPartList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => newAddingItem.restrictUsePermanently || newAddingItem.restrictPackagingUsePermanently);

          /* check if any restricted part with permission exists then ask for authentication */
          const usePartWithRestrictPermissionList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => newAddingItem.restrictUSEwithpermission || newAddingItem.restrictPackagingUseWithpermission);

          const anyNonRestrictTypePartList = _.filter($scope.selectedPartListNoAdded, (newAddingItem) => !newAddingItem.restrictUsePermanently && !newAddingItem.restrictPackagingUsePermanently
          && !newAddingItem.restrictUSEwithpermission && !newAddingItem.restrictPackagingUseWithpermission);

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
                    const opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, $scope.$parent.vm.operation.opName, $scope.$parent.vm.operation.opNumberText);
                    restrictPartAuthenticationDet = {
                      refID: null,
                      refTableName: CORE.TABLE_NAME.OPERATION_PART,
                      isAllowSaveDirect: false,
                      approveFromPage: CORE.PageName.FullName.op_suppliesMaterialsAndTools,
                      approvedBy: resOfAuthData.approvedBy,
                      approvalReason: resOfAuthData.approvalReason,
                      confirmationType: CORE.Generic_Confirmation_Type.OP_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD,
                      transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.OP_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD,
                        partASSMTDet.PIDCode, opFullName),
                      createdBy: BaseService.loginUser.userid,
                      updatedBy: BaseService.loginUser.userid
                    };
                    saveOperationPartsDetails();
                  }
                }, () => {
                  if (dragDropOtherDetails && dragDropOtherDetails.isRefreshDataRequired) {
                    vm.partOperationDetails();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
            }
          }
          else {
            saveOperationPartsDetails();
          }
        }
        else if (addType === 'Remove') {
          const promises = [deleteOperationParts($scope.selectedPartListAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedPartListAdded, (item) => {
                  const added = _.find(_partNoAddedList, (part) => item.id === part.id);
                  if (!added) {
                    _partNoAddedList.push(item);
                  }
                });
                _.each($scope.selectedPartListAdded, (item) => {
                  _partAddedList = _.without(_partAddedList,
                    _.find(_partAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllPart();
                setOperationPartsDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'RemoveAll') {
          const promises = [deleteOperationParts(vm.partAddedList)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(vm.partAddedList, (item) => {
                  const added = _.find(_partNoAddedList, (part) => item.id === part.id);
                  if (!added) {
                    _partNoAddedList.push(item);
                  }
                });
                _.each(_partNoAddedList, (item) => {
                  _partAddedList = _.without(_partAddedList,
                    _.find(_partAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllPart();
                setOperationPartsDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* delete component in operation */
      const deleteOperationParts = (listToDelete) => {
        vm.SearchAddedListPart = null;
        vm.SearchNoAddedListPart = null;

        return OperationFactory.deleteOperation_PartList().delete({
          opID: operationId,
          partIDs: _.map(listToDelete, (obj) => { return obj.id; })
        }).$promise.then((res) => {
          return res;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // take confirmation for remove part items from drag drop options
      const confirmPartDeleteDragDrop = (addType, dragDropOtherDetails) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, CORE.MainTitle.SupplyAndMaterial);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            checkAndUpdateModifiedPartDragDrop(addType, dragDropOtherDetails);
          }
        }, () => {
          return false;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* save s.m.t. details while drag from not added to added part  */
      const saveOperationPartsDetails = () => {
        const promises = [saveOperationParts($scope.selectedPartListNoAdded)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
            if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
              _.each($scope.selectedPartListNoAdded, (item) => {
                const added = _.find(_partAddedList, (part) => item.id === part.id);
                if (!added) {
                  _partAddedList.push(item);
                }
              });
              _.each($scope.selectedPartListNoAdded, (item) => {
                _partNoAddedList = _.without(_partNoAddedList,
                  _.find(_partNoAddedList, (valItem) => valItem.id === item.id)
                );
              });
              UnSelectAllPart();
              setOperationPartsDragDropDetails();
            }
          }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

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

      //#region  set item selectable
      const SetPartSelectable = () => {
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

      //set class for item to be selectable
      const setSelectableListItemPart = () => {
        $timeout(() => {
          SetPartSelectable();
        }, _configSelectListTimeout);
      };

      const setDetailsForOpSMT = () => {
        vm.isContainMasterPart = _partAddedList.length === 0 && _partNoAddedList.length === 0
          && !vm.SearchNoAddedListPart && !vm.SearchAddedListPart ? false : true;

        setSelectableListItemPart();
      };

      vm.partOperationDetails();

      /* on click of load more button - get data of not added supply,material list */
      vm.getMoreSupplyMaterialToolData = () => {
        pagingInfoForOpParts.Page = pagingInfoForOpParts.Page + 1;
        const notAddedPartPromises = [getAllPartsNotAddedInOperation(true)];
        vm.cgBusyLoading = $q.all(notAddedPartPromises).then((responses) => {
            if (responses && responses.length > 0) {
              setDetailsForOpSMT();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      /* go to mounting type list page */
      vm.goToMountingGroupData = () => {
        BaseService.goToMountingGroupList();
      };
    }
  }
})();

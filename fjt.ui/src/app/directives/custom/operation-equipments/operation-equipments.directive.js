(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationEquipments', operationEquipments);

  /** @ngInject */
  function operationEquipments(OPERATION, uiSortableMultiSelectionMethods, OperationFactory, CORE, USER, BaseService, $q, DialogFactory,
    $timeout, $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationId: '='
      },
      templateUrl: 'app/directives/custom/operation-equipments/operation-equipments.html',
      controller: operationEquipmentsCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationEquipmentsCtrl($scope) {
      var vm = this;

      vm.EmptyMesssageForOpEquipment = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEQUIPMENT;
      vm.isContainOpMasterequipment = false;

      const operationId = $scope.operationId ? parseInt($scope.operationId) : null;

      let _equipmentAddedList = [];
      let _equipmentNoAddedList = [];
      vm.SearchAddedListEquipment = null;
      vm.SearchNoAddedListEquipment = null;

      $scope.selectedEquipmentListNoAdded = [];
      $scope.selectedEquipmentListAdded = [];

      //#region sortable option common for all list
      $scope.sortableOptionsEquipment = uiSortableMultiSelectionMethods.extendOptions({
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
            const dropTarget = ui.item.sortable.droptarget[0]; // get drop target equipment
            const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded !== DestinationDivAdded) {
              if (SourceDivAdded === false && DestinationDivAdded === true) {
                if ($scope.selectedEquipmentListNoAdded.length === 0) {
                  $scope.selectedEquipmentListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEquipment('Add');
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                if ($scope.selectedEquipmentListAdded.length === 0) {
                  $scope.selectedEquipmentListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEquipment('Remove');
                return;
              }
            }
          }
        },
        connectWith: '.items-container'
      });
      //#endregion

      //#region reset value of selected equipment
      const ResetSelectedEquipment = () => {
        $scope.selectedEquipmentListNoAdded = [];
        $scope.selectedEquipmentListAdded = [];
        $scope.selectAnyNoAddedEquipment = false;
        $scope.selectAnyAddedEquipment = false;
      };
      //#endregion

      //#region check for selected equipment
      const checkSelectAllFlagEquipment = () => {
        $scope.selectAnyNoAddedEquipment = $scope.selectedEquipmentListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedEquipment = $scope.selectedEquipmentListAdded.length > 0 ? true : false;
      };
      //#endregion

      //#region unselect all equipment list
      const UnSelectAllEquipment = () => {
        angular.element('[ui-sortable]#equipmentNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#equipmentAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedEquipment();
      };
      //#endregion

      //#region unselect single equipment list
      const UnSelectEquipment = (unSelectFrom) => {
        if (unSelectFrom === 'NoAdded') {
          angular.element('[ui-sortable]#equipmentNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#equipmentAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedEquipment();
      };
      //#endregion

      //Load equipment data
      vm.equipmentDetails = (isEquipmentTabClick) => {
        if (isEquipmentTabClick) {
          UnSelectAllEquipment();
        }

        vm.SearchAddedListEquipment = null;
        vm.SearchNoAddedListEquipment = null;

        vm.cgBusyLoading = OperationFactory.retrieveEquipmentOperationDetails().query({ id: operationId }).$promise.then((res) => {
          if (res && res.data) {
            _equipmentAddedList = vm.equipmentAddedList = [];
            _equipmentNoAddedList = vm.equipmentNoAddedList = [];
            _.each(res.data, (itemData) => {
              if (operationId) {
                itemData.operationEquipment = _.first(itemData.operationEquipment);
                if (itemData.genericFiles) {
                  itemData.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + itemData.genericFiles.gencFileName;
                }
                else {
                  itemData.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }
                if (itemData.operationEquipment) {
                  vm.equipmentAddedList.push(itemData);
                }
                else {
                  if (itemData.isActive){
                    vm.equipmentNoAddedList.push(itemData);
                  }
                }
              }
              else {
                if (itemData.isActive){
                  vm.equipmentNoAddedList.push(itemData);
                }
              }
            });
            _equipmentAddedList = angular.copy(vm.equipmentAddedList);
            _equipmentNoAddedList = angular.copy(vm.equipmentNoAddedList);

            if (_equipmentAddedList.length === 0 && _equipmentNoAddedList.length === 0) {
              vm.isContainOpMasterequipment = false;
            }
            else {
              vm.isContainOpMasterequipment = true;
            }

            setSelectableListItemEquipment();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //set class for item to be selectable
      const setSelectableListItemEquipment = () => {
        $timeout(() => {
          SetEquipmentSelectable();
        }, _configSelectListTimeout);
      };

      //#region  set item selectable
      const SetEquipmentSelectable = () => {
        angular.element('[ui-sortable]#equipmentAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectEquipment('NoAdded');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedEquipmentListAdded = _.map(selectedItemIndexes, (i) => vm.equipmentAddedList[i]);
          checkSelectAllFlagEquipment();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#equipmentNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectEquipment('Added');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedEquipmentListNoAdded = _.map(selectedItemIndexes, (i) => vm.equipmentNoAddedList[i]);
          checkSelectAllFlagEquipment();
          $scope.$applyAsync();
        });
      };
      //#endregion

      vm.equipmentDetails(true);

      //#region modify data equipment Added based on selection from both list
      vm.ModifyPageAddedEquipment = (addType) => {
        if (addType === 'Remove' || addType === 'RemoveAll') {
          confirmEquipmentDeleteDragDrop(addType);
        }
        else {
          checkAndUpdateModifiedEquipmentDragDrop(addType);
        }
      };

      const setOperationEquipmentDragDropDetails = () => {
        vm.SearchAddedListEquipment = null;
        vm.SearchNoAddedListEquipment = null;
        vm.equipmentAddedList = _equipmentAddedList;
        vm.equipmentNoAddedList = _equipmentNoAddedList;
        vm.FilterEquipmentAdded = vm.equipmentAddedList.length > 0;
        vm.FilterEquipmentNotAdded = vm.equipmentNoAddedList.length > 0;
      };

      // check add/remove equipment from drag drop
      const checkAndUpdateModifiedEquipmentDragDrop = (addType) => {
        if (addType === 'Add') {
          const promises = [saveOperationEquipment($scope.selectedEquipmentListNoAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedEquipmentListNoAdded, (item) => {
                  const added = _.find(_equipmentAddedList, (equipment) => item.eqpID === equipment.eqpID);
                  if (!added) {
                    _equipmentAddedList.push(item);
                  }
                });
                _.each($scope.selectedEquipmentListNoAdded, (item) => {
                  _equipmentNoAddedList = _.without(_equipmentNoAddedList,
                    _.find(_equipmentNoAddedList, (valItem) => valItem.eqpID === item.eqpID)
                  );
                });
                UnSelectAllEquipment();
                setOperationEquipmentDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'Remove') {
          const promises = [deleteOperationEquipment($scope.selectedEquipmentListAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedEquipmentListAdded, (item) => {
                  const added = _.find(_equipmentNoAddedList, (equipment) => item.eqpID === equipment.eqpID);
                  if (!added) {
                    _equipmentNoAddedList.push(item);
                  }
                });
                _.each($scope.selectedEquipmentListAdded, (item) => {
                  _equipmentAddedList = _.without(_equipmentAddedList,
                    _.find(_equipmentAddedList, (valItem) => valItem.eqpID === item.eqpID)
                  );
                });
                UnSelectAllEquipment();
                setOperationEquipmentDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'AddAll') {
          const promises = [saveOperationEquipment(vm.equipmentNoAddedList)];
          const equipmentdata = vm.equipmentNoAddedList;
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(equipmentdata, (item) => {
                  const added = _.find(_equipmentAddedList, (equipment) => item.eqpID === equipment.eqpID);
                  if (!added) {
                    _equipmentAddedList.push(item);
                  }
                });
                _.each(_equipmentAddedList, (item) => {
                  _equipmentNoAddedList = _.without(_equipmentNoAddedList,
                    _.find(_equipmentNoAddedList, (valItem) => valItem.eqpID === item.eqpID)
                  );
                });
                UnSelectAllEquipment();
                setOperationEquipmentDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'RemoveAll') {
          const promises = [deleteOperationEquipment(vm.equipmentAddedList)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(vm.equipmentAddedList, (item) => {
                  const added = _.find(_equipmentNoAddedList, (equipment) => item.eqpID === equipment.eqpID);
                  if (!added) {
                    _equipmentNoAddedList.push(item);
                  }
                });
                _.each(_equipmentNoAddedList, (item) => {
                  _equipmentAddedList = _.without(_equipmentAddedList,
                    _.find(_equipmentAddedList, (valItem) => valItem.eqpID === item.eqpID)
                  );
                });
                UnSelectAllEquipment();
                setOperationEquipmentDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //#endregion

      // take confirmation for remove equipment items from drag drop options
      const confirmEquipmentDeleteDragDrop = (addType) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, CORE.MainTitle.Equipment);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            checkAndUpdateModifiedEquipmentDragDrop(addType);
          }
        }, () => {
          return false;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* save equipment in operation */
      const saveOperationEquipment = (newListToSave) => {
        vm.SearchAddedListEquipment = null;
        vm.SearchNoAddedListEquipment = null;
        const saveObj = [];
        _.each(newListToSave, (item) => {
          if (item.eqpID) {
            const _object = {};
            _object.opID = operationId,
              _object.eqpID = item.eqpID,
              saveObj.push(_object);
          }
        });
        const listObj = {
          opID: operationId,
          equipmentList: saveObj
        };
        return OperationFactory.createOperation_EquipmentList().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
      };

      /* delete equipment in operation */
      const deleteOperationEquipment = (listToDelete) => {
        vm.SearchAddedListEquipment = null;
        vm.SearchNoAddedListEquipment = null;

        return OperationFactory.deleteOperation_EquipmentList().delete({
          opID: operationId,
          eqpIDs: _.map(listToDelete, (obj) => { return obj.eqpID; })
        }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
      };

      //Search equipment in search area
      vm.SearchEquipment = (searchText, IsAdded) => {
        UnSelectAllEquipment();
        if (!searchText) {
          if (IsAdded) {
            vm.SearchAddedListEquipment = null;
            vm.equipmentAddedList = _equipmentAddedList;
            vm.FilterEquipmentAdded = true;
          } else {
            vm.SearchNoAddedListEquipment = null;
            vm.FilterEquipmentNotAdded = true;
            vm.equipmentNoAddedList = _equipmentNoAddedList;
          }
          return;
        }
        if (IsAdded) {
          vm.equipmentAddedList = ($filter('filter')(_equipmentAddedList, { assetName: searchText }));
          vm.FilterEquipmentAdded = vm.equipmentAddedList.length > 0;
        }
        else {
          vm.equipmentNoAddedList = ($filter('filter')(_equipmentNoAddedList, { assetName: searchText }));
          vm.FilterEquipmentNotAdded = vm.equipmentNoAddedList.length > 0;
        }
      };

      //Reload data
      vm.refreshDataEquipment = () => {
        vm.equipmentDetails();
        ResetSelectedEquipment();
      };

      //Add new equipment
      vm.addDataEquipment = (data, ev) => {
        const pageRightsAccessDet = {
          popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
          pageNameAccessLabel: CORE.PageName.equipments
        };
        if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
          data = {};
          data.Title = CORE.EquipmentAndWorkstation_Title.Equipment;
          DialogFactory.dialogService(
            USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
            USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
            ev,
            data).then(() => { // empty
            }, (data) => {
              if (data) {
                vm.refreshDataEquipment();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /*Move to equipment page*/
      vm.goToManageEquipmentWorkstation = (equip) => {
        BaseService.goToManageEquipmentWorkstation(equip.eqpID);
      };
    }
  }
})();

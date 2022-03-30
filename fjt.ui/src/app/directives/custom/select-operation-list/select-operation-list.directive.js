(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('selectOperationList', selectOperationList);

  /** @ngInject */
  function selectOperationList(CORE, USER, $q, OPERATION, $state, DataElementFactory, DialogFactory, Upload, EntityFactory, $timeout, BaseService) {

    let directive = {
      restrict: 'E',
      replace: true,
      scope: {
        isFromMasterTemplate: '@',
        selectedOperationList: '=',
        masterTemplate: "=",
        maxOperationNumber: "=?",
        currActiveForm: "="
      },
      templateUrl: 'app/directives/custom/select-operation-list/select-operation-list.html',
      controller: selectOperationListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function selectOperationListCtrl($scope, $element, $attrs, $filter, WORKORDER, DialogFactory, OperationFactory, CORE, OPERATION,
      uiSortableMultiSelectionMethods) {

      let vm = this;
      vm.isFromMasterTemplate = $scope.isFromMasterTemplate == "true";
      vm.maxOperationNumber = $scope.maxOperationNumber ? $scope.maxOperationNumber : 0;
      vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.ASSIGNEDOPERATIONS;

      //vm.SearchOperationText = null;
      vm.isMasterOperationsCreated = true;

      vm.OperationNoAddedList = [];
      vm.OperationAddedList = _.clone($scope.selectedOperationList);

      let _OperationAddedList = [];
      let _OperationNoAddedList = [];
      vm.SearchAddedListOperation = null;
      vm.SearchNoAddedListOperation = null;

      $scope.selectedOperationListNoAdded = [];
      $scope.selectedOperationListAdded = [];

      //#region reset value of selected template
      let ResetSelectedOperation = () => {
        $scope.selectedOperationListNoAdded = [];
        $scope.selectedOperationListAdded = [];
        $scope.selectAnyNoAddedOperation = false;
        $scope.selectAnyAddedOperation = false;
      }
      //#endregion

      //#region unselect all template list
      let UnSelectAllOperation = () => {
        angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#operationAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedOperation();
      }
      //#endregion

      //#region check for selected template
      let checkSelectAllFlagOperation = () => {
        $scope.selectAnyNoAddedOperation = $scope.selectedOperationListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedOperation = $scope.selectedOperationListAdded.length > 0 ? true : false;
      }
      //#endregion

      if (vm.OperationAddedList.length > 0) {
        vm.OperationAddedList = _.sortBy(vm.OperationAddedList, Op => Op.opNumber);
        _.map(vm.OperationAddedList, (opItem) => {
          opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
        });
      }

      _OperationAddedList = angular.copy(vm.OperationAddedList);

      /*
       * Author :  Vaibhav Shah
       * Purpose : Get Operation list on click select from operaitons
       */
      let getOperationList = () => {
        vm.SearchAddedListTemplate = null;
        vm.SearchNoAddedListTemplate = null;

        vm.cgBusyLoading = OperationFactory.getOperationList().query({}).$promise.then((operation) => {
          if (operation && operation.data) {
            _OperationNoAddedList = vm.OperationNoAddedList = [];

            _.map(operation.data, (opItem) => {
              let obj = _.find(vm.OperationAddedList, (item) => { return item.opID == opItem.opID });
              if (obj) {
                opItem.opNumber = obj.opNumber;
                opItem.operationType = obj.operationType;
                opItem.isRework = obj.isRework;
                opItem.isParellelOperation = obj.isParellelOperation;
                opItem.clusterID = obj.clusterID;
                opItem.qtyControl = obj.qtyControl;
                opItem.isIssueQty = obj.isIssueQty;
                opItem.isMoveToStock = obj.isMoveToStock;
                opItem.isPlacementTracking = obj.isPlacementTracking;
                opItem.isPreProgrammingComponent = obj.isPreProgrammingComponent;
              }
              opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
              opItem.fluxTypeList = [];
              opItem.fluxTypeList.push({
                value: opItem.isFluxNotApplicable, icon: CORE.FluxTypeIcon.notApplicableIcon, toolTip: CORE.FluxTypeToolTip.notApplicable, isShowIcon : true
              });
              opItem.fluxTypeList.push({
                value: opItem.isNoClean, icon: CORE.FluxTypeIcon.noCleanIcon, toolTip: CORE.FluxTypeToolTip.noClean, isShowIcon: true
              });
              opItem.fluxTypeList.push({
                value: opItem.isWaterSoluble, icon: CORE.FluxTypeIcon.waterSolubleIcon, toolTip: CORE.FluxTypeToolTip.waterSoluble, isShowIcon: true
              });
              if (!obj) {
                vm.OperationNoAddedList.push(opItem);
              }
            });

            vm.OperationNoAddedList = _.sortBy(vm.OperationNoAddedList, Op => Op.opNumber);
            _OperationNoAddedList = angular.copy(vm.OperationNoAddedList);

            vm.isMasterOperationsCreated = _OperationNoAddedList.length == 0 ? false : true;
            setSelectableListItemOperation();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      if (vm.isFromMasterTemplate) {
        vm.MasterTemplateList = [];
        vm.selectedMasterTemplate = null;

        let getMasterTemplates = () => {
          return OperationFactory.getMasterTemplateListByTemplateStatus().save({
            masterTemplateStatus: CORE.DisplayStatus.Published.ID
          }).$promise.then((mastertemplate) => {
            if (mastertemplate && mastertemplate.data) {
              vm.MasterTemplateList = mastertemplate.data;
            }
            return $q.resolve(vm.MasterTemplateList);
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }

        var autocompletePromise = [getMasterTemplates()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          initAutoComplete();
        });
        let initAutoComplete = () => {
          vm.autoCompleteMasterTemplate = {
            columnName: 'masterTemplate',
            controllerName: OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_CONTROLLER,
            viewTemplateURL: OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_VIEW,
            keyColumnName: 'id',
            keyColumnId: $scope.masterTemplate ? ($scope.masterTemplate.id ? $scope.masterTemplate.id : null) : null,
            inputName: 'Operation Management',
            placeholderName: 'Operation Management',
            isRequired: true,
            isAddnew: false,
            callbackFn: getMasterTemplates,
            onSelectCallbackFn: vm.MasterTemplateSelected
          }
        }

        /*
         * Author :  Vaibhav Shah
         * Purpose : On Select Master Template
         */
        vm.MasterTemplateSelected = (selectedMasterTemplate) => {
          vm.SearchNoAddedListOperation = null;

          _OperationNoAddedList = vm.OperationNoAddedList = [];
          $scope.masterTemplate = selectedMasterTemplate;
          if (selectedMasterTemplate) {
            return OperationFactory.getMasterTemplateOperationList().query({ id: selectedMasterTemplate.id }).$promise.then((mastertemplate) => {
              if (mastertemplate && mastertemplate.data) {
                _.map(mastertemplate.data, (opItem) => {
                  opItem.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, opItem.opName, opItem.opNumber);
                });

                vm.OperationNoAddedList = _.without(mastertemplate.data, vm.OperationAddedList);
                vm.OperationNoAddedList = _.sortBy(vm.OperationNoAddedList, Op => Op.opNumber);
                _OperationNoAddedList = angular.copy(vm.OperationNoAddedList);
              }
              setSelectableListItemOperation();

              return $q.resolve(mastertemplate.data);
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
          else {
            angular.element(document.querySelector('#selectBtn')).focus();
          }
        }
      }
      else {
        getOperationList();
      }

      //set class for item to be selectable
      let setSelectableListItemOperation = () => {
        $timeout(() => {
          SetOperationSelectable();
        }, _configSelectListTimeout);
      }

      let setOperationDragDropDetails = () => {
        vm.SearchAddedListOperation = null;
        vm.SearchNoAddedListOperation = null;
        vm.OperationAddedList = _OperationAddedList;
        vm.OperationNoAddedList = _OperationNoAddedList;
        vm.FilterOperationAdded = vm.OperationAddedList.length > 0;
        vm.FilterOperationNotAdded = vm.OperationNoAddedList.length > 0;

        vm.OperationNoAddedList = _.sortBy(vm.OperationNoAddedList, Op => Op.opNumber);
        vm.OperationAddedList = _.sortBy(vm.OperationAddedList, Op => Op.opNumber);
      }

      vm.SearchOperation = (searchText, IsAdded) => {
        if (!searchText) {
          if (IsAdded) {
            vm.SearchAddedListOperation = null;
            vm.OperationAddedList = _OperationAddedList;
            vm.FilterOperationAdded = true;
          } else {
            vm.SearchNoAddedListOperation = null;
            vm.OperationNoAddedList = _OperationNoAddedList;
            vm.FilterOperationNotAdded = true;
          }
          return;
        }
        if (IsAdded) {
          vm.OperationAddedList = $filter('filter')(_OperationAddedList, { opFullName: searchText });
          vm.FilterOperationAdded = vm.OperationAddedList.length > 0;
          $scope.selectedOperationListAdded = [];
          $scope.selectAnyAddedOperation = false;
        }
        else {
          vm.OperationNoAddedList = $filter('filter')(_OperationNoAddedList, { opFullName: searchText });
          vm.FilterOperationNotAdded = vm.OperationNoAddedList.length > 0;
          $scope.selectedOperationListNoAdded = [];
          $scope.selectAnyNoAddedOperation = false;
        }
      }

      /*
      * Author :  Vaibhav Shah
      * Purpose : Search Operation
      */
      //vm.SearchOperation = (list, searchText) => {
      //  if (!searchText) {
      //    vm.SearchOperationText = null;
      //    vm.OperationList = _OperationList;
      //    vm.FilterOperation = true;
      //    return;
      //  }
      //  vm.OperationList = $filter('filter')(_OperationList, { opFullName: searchText });
      //  vm.FilterOperationList = vm.OperationList.length > 0;
      //}

      /* move to add master operation details  */
      vm.moveToAddMasterOperations = () => {
        BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {})
      }

      /* refresh operation list  */
      vm.refreshOperationList = () => {
        if (vm.isFromMasterTemplate && !vm.autoCompleteMasterTemplate.keyColumnId) {
          return;
        }
        else {
          getOperationList();
        }
      }

      vm.gotoOperationManagementList = () => {
        BaseService.openInNew(OPERATION.OPERATION_MASTER_TEMPLATE_STATE);
        return false;
      }

      /* to move at operation update page */
      vm.goToManageOperation = (operationID) => {
        BaseService.goToManageOperation(operationID);
      }

      //#region  set item selectable
      let SetOperationSelectable = () => {
        angular.element('[ui-sortable]#operationAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectOperation("NoAdded");
          var $this = $(this);
          var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedOperationListAdded = _.map(selectedItemIndexes, function (i) {
            return vm.OperationAddedList[i];
          });
          checkSelectAllFlagOperation();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#operationNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectOperation("Added");
          var $this = $(this);
          var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedOperationListNoAdded = _.map(selectedItemIndexes, function (i) {
            return vm.OperationNoAddedList[i];
          });
          checkSelectAllFlagOperation();
          $scope.$applyAsync();
        });
      }

      //#region unselect single template list
      let UnSelectOperation = (unSelectFrom) => {
        if (unSelectFrom == "NoAdded") {
          angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#operationAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedOperation();
      }
      //#endregion

      //#region sortable option common for all list
      $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
        cancel: ".cursor-not-allow",
        placeholder: "beingDragged",
        'ui-floating': true,
        cursorAt: {
          top: 0, left: 0
        },
        start: (e, ui) => {
        },
        sort: (e, ui) => {
        },
        stop: (e, ui) => {
          let sourceModel = ui.item.sortable.model;
          if (ui.item.sortable.droptarget) {
            let sourceTarget = ui.item.sortable.source[0];
            let dropTarget = ui.item.sortable.droptarget[0];
            let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded != DestinationDivAdded) {
              if (SourceDivAdded == false && DestinationDivAdded == true) {
                if ($scope.selectedOperationListNoAdded.length == 0) {
                  $scope.selectedOperationListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedOperation("Add");
                return;
              }
              else if (SourceDivAdded == true && DestinationDivAdded == false) {
                if ($scope.selectedOperationListAdded.length == 0) {
                  $scope.selectedOperationListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedOperation("Remove");
                return;
              }
            }
          }
        },
        connectWith: '.items-container'
      });
      //#endregion

      vm.ModifyPageAddedOperation = (addType) => {
        //if (addType == "Remove" || addType == "RemoveAll") {
        //  confirmOperationDeleteDragDrop(addType);
        //}
        //else {
          checkAndUpdateModifiedOperationDragDrop(addType);
        //}
      }


      let checkAndUpdateModifiedOperationDragDrop = (addType) => {
        if (addType == "Add") {
          _.each($scope.selectedOperationListNoAdded, (item) => {
            let added = _.find(_OperationAddedList, (operation) => {
              return item.opID == operation.opID
            });
            if (!added) {
              _OperationAddedList.push(item);
            }
          });
          _.each($scope.selectedOperationListNoAdded, (item) => {
            _OperationNoAddedList = _.without(_OperationNoAddedList,
              _.find(_OperationNoAddedList, (valItem) => {
                return valItem.opID == item.opID;
              })
            );
          });
          UnSelectAllOperation();
          setOperationDragDropDetails();
        }
        else if (addType == "AddAll") {
          _.each(vm.OperationNoAddedList, (item) => {
            let added = _.find(_OperationAddedList, (operation) => {
              return item.opID == operation.opID
            });
            if (!added) {
              _OperationAddedList.push(item);
            }
          });
          _.each(_OperationAddedList, (item) => {
            _OperationNoAddedList = _.without(_OperationNoAddedList,
              _.find(_OperationNoAddedList, (valItem) => {
                return valItem.opID == item.opID;
              })
            );
          });
          UnSelectAllOperation();
          setOperationDragDropDetails();
        }
        else if (addType == "Remove") {
          _.each($scope.selectedOperationListAdded, (item) => {
            let added = _.find(_OperationNoAddedList, (operation) => {
              return item.opID == operation.opID
            });
            if (!added) {
              _OperationNoAddedList.push(item);
            }
          });
          _.each($scope.selectedOperationListAdded, (item) => {
            _OperationAddedList = _.without(_OperationAddedList,
              _.find(_OperationAddedList, (valItem) => {
                return valItem.opID == item.opID;
              })
            );
          });
          UnSelectAllOperation();
          setOperationDragDropDetails();
        }
        else if (addType == "RemoveAll") {
          _.each(vm.OperationAddedList, (item) => {
            let added = _.find(_OperationNoAddedList, (operation) => {
              return item.opID == operation.opID;
            });
            let isDisabledToRemove = (vm.maxOperationNumber >= item.opNumber);
            if (!added && !isDisabledToRemove) {
              _OperationNoAddedList.push(item);
            }
          });
          _.each(_OperationNoAddedList, (item) => {
            _OperationAddedList = _.without(_OperationAddedList,
              _.find(_OperationAddedList, (valItem) => {
                return valItem.opID == item.opID;
              })
            );
          });
          UnSelectAllOperation();
          setOperationDragDropDetails();
        }

        $scope.selectedOperationList = angular.copy(vm.OperationAddedList);
        $scope.currActiveForm.$setDirty();
      }

    }
  }
})();

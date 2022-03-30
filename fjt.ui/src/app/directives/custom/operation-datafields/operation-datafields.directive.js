(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationDatafields', operationDatafields);

  /** @ngInject */
  function operationDatafields(CORE, BaseService, OperationFactory, $timeout, uiSortableMultiSelectionMethods, EntityFactory, DialogFactory,
    OPERATION, $filter, OperationDataelementFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationId: '='
      },
      templateUrl: 'app/directives/custom/operation-datafields/operation-datafields.html',
      controller: operationDatafieldsCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationDatafieldsCtrl($scope) {
      var vm = this;

      vm.inputFields = CORE.InputeFields;
      vm.EmptyMesssageForDataField = OPERATION.OPERATION_EMPTYSTATE.ASSIGNFILEDS;

      const operationId = $scope.operationId ? parseInt($scope.operationId) : null;

      vm.isContainMasterDataField = false;

      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;

      let _dataElementAddedList = [];
      let _dataElementNoAddedList = [];
      let SubFormElementList = [];
      vm.dataElementAddedList = [];
      vm.dataElementNoAddedList = [];

      $scope.selectedElementListNoAdded = [];
      $scope.selectedElementListAdded = [];

      //#region reset value of selected element
      const ResetSelectedElement = () => {
        $scope.selectedElementListNoAdded = [];
        $scope.selectedElementListAdded = [];
        $scope.selectAnyNoAddedElement = false;
        $scope.selectAnyAddedElement = false;
      };
    //#endregion

      //#region unselect all element list
      const UnSelectAllElement = () => {
        angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedElement();
      };
    //#endregion

      //#region check for selected element
      const checkSelectAllFlag = () => {
        $scope.selectAnyNoAddedElement = $scope.selectedElementListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedElement = $scope.selectedElementListAdded.length > 0 ? true : false;
      };
      //#endregion

      //#region unselect single element list
      const UnSelectElement = (unSelectFrom) => {
        if (unSelectFrom === 'NoAdded') {
          angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedElement();
      };
      //#endregion

      //#region  set item selectable
      const SetDataElementSelectable = () => {
        angular.element('[ui-sortable]#dataElementAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectElement('NoAdded');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedElementListAdded = _.map(selectedItemIndexes, (i) => vm.dataElementAddedList[i]);
          checkSelectAllFlag();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#dataElementNoAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectElement('Added');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedElementListNoAdded = _.map(selectedItemIndexes, (i) => vm.dataElementNoAddedList[i]);
          checkSelectAllFlag();
          $scope.$applyAsync();
        });
      };

      const setSelectableListItemDataElement = () => {
        $timeout(() => {
          SetDataElementSelectable();
        }, _configSelectListTimeout);
      };

      //Get all entities/Data fields
      vm.entitiesAll = (isDataFieldsTabClick) => {
        vm.SearchAddedListElement = null;
        vm.SearchNoAddedListElement = null;
        vm.cgBusyLoading = EntityFactory.getEntityByName().query({ name: CORE.Entity.Operation }).$promise.then((res) => {
          if (res && res.data) {
            if (isDataFieldsTabClick) {
              UnSelectAllElement();
            }
            const objEntity = res.data;
            vm.enityElementDetails(objEntity.entityID);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //retrieve EntityElement Details
      vm.enityElementDetails = (entityID) => {
        const objs = {
          id: entityID,
          opID: operationId
        };
        vm.cgBusyLoading = OperationFactory.retrieveOperationEntityDataElements().query({ operationObj: objs }).$promise.then((res) => {
          if (res && res.data) {
            SubFormElementList = _.remove(res.data, (o) => o.parentDataElementID !== null);
            res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
            _dataElementAddedList = vm.dataElementAddedList = [];
            _dataElementNoAddedList = vm.dataElementNoAddedList = [];
            _.each(res.data, (itemData) => {
              itemData.icon = _.find(vm.inputFields, (data) => itemData.controlTypeID === data.ID);
              itemData.operationDataelement = _.first(itemData.operationDataelement);
              if (operationId) {
                if (itemData.operationDataelement) {
                  vm.dataElementAddedList.push(itemData);
                }
                else {
                  vm.dataElementNoAddedList.push(itemData);
                }
              }
              else {
                vm.dataElementNoAddedList.push(itemData);
              }
            });
            vm.dataElementAddedList = _.orderBy(vm.dataElementAddedList, (e) => e.operationDataelement.displayOrder, ['asc']);
            _dataElementAddedList = angular.copy(vm.dataElementAddedList);
            _dataElementNoAddedList = angular.copy(vm.dataElementNoAddedList);
            if (_dataElementAddedList.length === 0 && _dataElementNoAddedList.length === 0) {
              vm.isContainMasterDataField = false;
            }
            else {
              vm.isContainMasterDataField = true;
            }
            setSelectableListItemDataElement();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //Search Data field
      vm.SearchElement = (searchText, IsAdded) => {
        if (!searchText) {
          if (IsAdded) {
            vm.SearchAddedListElement = null;
            vm.dataElementAddedList = _dataElementAddedList;
            vm.FilterDataElementAdded = true;
          } else {
            vm.SearchNoAddedListElement = null;
            vm.dataElementNoAddedList = _dataElementNoAddedList;
            vm.FilterDataElementNotAdded = true;
          }
          return;
        }
        if (IsAdded) {
          vm.dataElementAddedList = $filter('filter')(_dataElementAddedList, { dataElementName: searchText });
          vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
        }
        else {
          vm.dataElementNoAddedList = $filter('filter')(_dataElementNoAddedList, { dataElementName: searchText });
          vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
        }
      };

      //Reload data
      vm.refreshData = () => {
        vm.entitiesAll();
      };

      //Add new Data field for Operation
      vm.addData = () => {
        BaseService.goToElementManage(CORE.AllEntityIDS.Operation.ID);
      };

      // take confirmation for remove data element items from drag drop options
      const confirmDataElementDeleteDragDrop = (addType, indexPosition) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, CORE.MainTitle.OperationDataFields);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            checkAndUpdateModifiedDataElementDragDrop(addType, indexPosition);
          }
        }, () => {
          return false;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const setDataAfterSaveOrDeleteDataElement = () => {
        vm.SearchAddedListElement = null;
        vm.SearchNoAddedListElement = null;
        vm.dataElementAddedList = _dataElementAddedList;
        vm.dataElementNoAddedList = _dataElementNoAddedList;
        vm.entitiesAll(false);  // put here to get all data element with operationDataelement updated values
      };

      /* save data elements in operation */
      const saveOperationDataelement = (OperationTypeToChange, otherInfoForDataFields) => {
        vm.SearchAddedListElement = null;
        vm.SearchNoAddedListElement = null;
        const saveObj = [];
        let index = 1;
        _.each(_dataElementAddedList, (item) => {
          if (item.dataElementID) {
            const _object = {};
            _object.opDataElementID = item.operationDataelement ? item.operationDataelement.opDataElementID : null;
            _object.opID = operationId,
              _object.dataElementID = item.dataElementID,
              _object.displayOrder = index;
            saveObj.push(_object);
          }
          const subFormElements = _.filter(SubFormElementList, (subFormItem) => subFormItem.parentDataElementID === item.dataElementID);
          if (subFormElements.length > 0) {
            _.each(subFormElements, (subItem) => {
              if (subItem.dataElementID) {
                const opDataElementIDOfSubFormItem = _.find(subItem.operationDataelement, (subFormOpElementItem) => subFormOpElementItem.opID === operationId && subFormOpElementItem.dataElementID === subItem.dataElementID);
                const _object = {};
                _object.opDataElementID = opDataElementIDOfSubFormItem ? opDataElementIDOfSubFormItem.opDataElementID : null,
                  _object.opID = operationId,
                  _object.dataElementID = subItem.dataElementID,
                  _object.displayOrder = index;
                saveObj.push(_object);
              }
              index++;
            });
          }
          index++;
        });
        const listObj = {
          opID: operationId,
          dataElementList: saveObj,
          isInnerSortingOfElement: otherInfoForDataFields.isInnerSortingOfElement
        };

        /* add new data element with update order of already exists */
        if (OperationTypeToChange === 'Add' || OperationTypeToChange === 'AddAll') {
          vm.cgBusyLoading = OperationDataelementFactory.createOperation_DataElementList().save({ listObj: listObj }).$promise.then(() => {
            setDataAfterSaveOrDeleteDataElement();
          }).catch((error) => BaseService.getErrorLog(error));
        }
        /* delete data_element other than passed from here and update display_order of elements which are passed */
        else {
          vm.cgBusyLoading = OperationDataelementFactory.deleteOperation_DataElementList().save({ listObj: listObj }).$promise.then(() => {
            setDataAfterSaveOrDeleteDataElement();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // check add/remove elements from drag drop
      const checkAndUpdateModifiedDataElementDragDrop = (addType, indexPosition) => {
        const otherInfoForDataFields = {};
        if (addType === 'Add') {
          _.each($scope.selectedElementListNoAdded, (item) => {
            const added = _.find(_dataElementAddedList, (element) => item.dataElementID === element.dataElementID);
            if (!added) {
              if (indexPosition !== undefined && indexPosition !== null) {
                _dataElementAddedList.splice(indexPosition, 0, item);
              }
              else {
                _dataElementAddedList.push(item);
              }
              indexPosition++;
            }
          });
          _.each($scope.selectedElementListNoAdded, (item) => {
            _dataElementNoAddedList = _.without(_dataElementNoAddedList,
              _.find(_dataElementNoAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
            );
          });
          UnSelectAllElement();
        }
        else if (addType === 'Remove') {
          _.each($scope.selectedElementListAdded, (item) => {
            const added = _.find(_dataElementNoAddedList, (element) => item.dataElementID === element.dataElementID);
            if (!added) {
              _dataElementNoAddedList.push(item);
            }
          });
          _.each($scope.selectedElementListAdded, (item) => {
            _dataElementAddedList = _.without(_dataElementAddedList,
              _.find(_dataElementAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
            );
          });
          UnSelectAllElement();
        }
        else if (addType === 'AddAll') {
          _.each(vm.dataElementNoAddedList, (item) => {
            const added = _.find(_dataElementAddedList, (element) => item.dataElementID === element.dataElementID);
            if (!added) {
              _dataElementAddedList.push(item);
            }
          });
          _.each(_dataElementAddedList, (item) => {
            _dataElementNoAddedList = _.without(_dataElementNoAddedList,
              _.find(_dataElementNoAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
            );
          });
          UnSelectAllElement();
        }
        else if (addType === 'RemoveAll') {
          _.each(vm.dataElementAddedList, (item) => {
            const added = _.find(_dataElementNoAddedList, (element) => item.dataElementID === element.dataElementID);
            if (!added) {
              _dataElementNoAddedList.push(item);
            }
          });
          _.each(_dataElementNoAddedList, (item) => {
            _dataElementAddedList = _.without(_dataElementAddedList,
              _.find(_dataElementAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
            );
          });
          UnSelectAllElement();
        }
        else if (addType === 'InnerSorting') {
          otherInfoForDataFields.isInnerSortingOfElement = true;
          addType = 'AddAll';
        }
        vm.SearchAddedListElement = null;
        vm.SearchNoAddedListElement = null;
        vm.dataElementAddedList = _dataElementAddedList;
        vm.dataElementNoAddedList = _dataElementNoAddedList;
        vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
        vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
        //vm.isDataElementDragDropAnyChangesToSave = true;
        saveOperationDataelement(addType, otherInfoForDataFields);
      };

      //#region modify data element Added based on selection from both list
      vm.ModifyPageAdded = (addType, indexPosition) => {
        if (addType === 'Remove' || addType === 'RemoveAll') {
          confirmDataElementDeleteDragDrop(addType, indexPosition);
        }
        else {
          checkAndUpdateModifiedDataElementDragDrop(addType, indexPosition);
        }
      };
    //#endregion

      //#region sortable option common for all list
      $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
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
            const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
            const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded !== DestinationDivAdded) {
              if (SourceDivAdded === false && DestinationDivAdded === true) {
                if ($scope.selectedElementListNoAdded.length === 0) {
                  $scope.selectedElementListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAdded('Add', ui.item.sortable.dropindex);
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                if ($scope.selectedElementListAdded.length === 0) {
                  $scope.selectedElementListAdded.push(sourceModel);
                }
                vm.ModifyPageAdded('Remove');
                return;
              }
            }
            else if (sourceTarget.id === 'dataElementAddedList' && dropTarget.id === 'dataElementAddedList') {
              _dataElementAddedList = [];
              _dataElementAddedList = ui.item.sortable.droptargetModel;
              vm.ModifyPageAdded('InnerSorting');
              return;
            }
          }
        },
        connectWith: '.items-container'
      });
    //#endregion

      vm.entitiesAll(true);

      /* go to data element manage page */
      vm.goToElementManage = (entityID, dataElementID) => {
        BaseService.goToElementManage(entityID, dataElementID);
      };
    }
  }
})();

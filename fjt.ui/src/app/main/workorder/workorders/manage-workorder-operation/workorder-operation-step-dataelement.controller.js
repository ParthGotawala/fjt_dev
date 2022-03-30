(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkorderOperationDataFieldsController', WorkorderOperationDataFieldsController);

  /** @ngInject */
  function WorkorderOperationDataFieldsController($scope, $timeout, $filter,
    OPERATION, CORE, WORKORDER, $mdDialog, $state, CONFIGURATION,
    uiSortableMultiSelectionMethods, EntityFactory, WorkorderOperationFactory, DialogFactory, BaseService) {
    // Don't Remove this code
    // Don't add any code before this
    $scope.vm = $scope.$parent.$parent.vm;
    //Add form name for check form dirty
    $scope.vm.CurrentForm = 'frmWorkOrderDetails';
    let vm = $scope.vm;
    // add code after this only
    // Don't Remove this code

    vm.EmptyMesssageForOpDataFields = OPERATION.OPERATION_EMPTYSTATE.ASSIGNFILEDS;
    vm.isContainOpMasterDataElement = false;

    // Restrict changes into all fields if work order status is 'under termination'
    //vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

    let _dataElementAddedList = [];
    let _dataElementNoAddedList = [];
    vm.SearchAddedListElement = null;
    vm.SearchNoAddedListElement = null;
    let SubFormElementList = [];
    let woOpDataelementList = [];
    vm.isHideSearchButton = false;
    vm.isHideSearchButtonadded = false;
    let dataelementInputFieldList = CORE.InputeFields;

    /**
    * Step 4 Drag and Drop Data Elements and Select Employee
    *
    * @param
    */

    /**
    * retreive all entities
    *
    * @param
    */
    vm.setFocus = (text) => {
      let someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    }

    vm.entitiesAll = (isDataFieldsTabClick) => {
      vm.cgBusyLoading = EntityFactory.getEntityByName().query({ name: CORE.Entity.Operation }).$promise.then((res) => {
        if (res.data) {
          vm.entityId = res.data.entityID;
          if (isDataFieldsTabClick) {
            vm.UnSelectAllElement();
          }
          vm.enityElementDetails(vm.entityId);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.setDataAfterSaveOrDeleteDataElement = () => {
      vm.entitiesAll(false);
    }

    /**
    * retreive EntityElement Details
    *
    * @param
    */
    vm.enityElementDetails = (entityID) => {
      $scope.selectedElementListAdded = [];
      $scope.selectedElementListNoAdded = [];
      let objs = {
        id: entityID,
        woOPID: vm.operation.woOPID
      }
      vm.cgBusyLoading = WorkorderOperationFactory.retrieveOperationEntityDataElements().query({ operationObj: objs }).$promise.then((res) => {
        if (res.data) {
          SubFormElementList = _.remove(res.data.dataelements, (o) => { return o.parentDataElementID != null });
          res.data.dataelements = _.orderBy(res.data.dataelements, ['displayOrder'], ['asc']);
          _dataElementAddedList = vm.dataElementAddedList = [];
          _dataElementNoAddedList = vm.dataElementNoAddedList = [];
          _.each(res.data.dataelements, (itemData) => {
            itemData.icon = _.find(dataelementInputFieldList, (data) => {
              return itemData.controlTypeID == data.ID;
            });
            let operationDataelement = _.find(res.data.operationElements, { dataElementID: itemData.dataElementID });
            if (operationDataelement) {
              itemData["displayOrderDataToFilter"] = operationDataelement.displayOrder;
              itemData["woOpDataElementID"] = operationDataelement.woOpDataElementID;
              vm.dataElementAddedList.push(itemData);
            }
            else if (!itemData.isDeleted) {
              vm.dataElementNoAddedList.push(itemData);
            }
          });

          //vm.dataElementAddedList = _.orderBy(vm.dataElementAddedList, (e) => { return e.operationDataelement.displayOrder }, ['asc']);
          vm.dataElementAddedList = _.orderBy(vm.dataElementAddedList, (e) => { return e.displayOrderDataToFilter }, ['asc']);
          _dataElementAddedList = angular.copy(vm.dataElementAddedList);
          _dataElementNoAddedList = angular.copy(vm.dataElementNoAddedList);
          woOpDataelementList = res.data.operationElements;
          vm.isContainOpMasterDataElement = res.data.dataelements.length > 0;
          setSelectableListItem();
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    $scope.selectedElementListNoAdded = [];
    $scope.selectedElementListAdded = [];


    //cancel drop event if canceled or validation failed
    let cancelDropEvent = (optype, e, ui) => {
      if (ui) {
        if (ui.item && ui.item.sortable && ui.item.sortable.cancel) {
          ui.item.sortable.cancel();
        } else {
          vm.refreshData();
        }
      }
      return false;
    }

    //#region sortable option common for all list
    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: ".cursor-not-allow",
      placeholder: "beingDragged",
      disabled: vm.isWOUnderTermination,
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: (e, ui) => {
      },
      sort: (e, ui) => {
      },
      handle: ":not(input)",
      stop: (e, ui) => {
        let sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          let sourceTarget = ui.item.sortable.source[0];
          let dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded != DestinationDivAdded) {
            if (SourceDivAdded == false && DestinationDivAdded == true) {
              // check for selected element length 
              if ($scope.selectedElementListNoAdded.length == 0) {
                $scope.selectedElementListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAdded("Add", ui.item.sortable.dropindex, e, ui);
              return;
            }
            else if (SourceDivAdded == true && DestinationDivAdded == false) {
              if ($scope.selectedElementListAdded.length == 0) {
                $scope.selectedElementListAdded.push(sourceModel);
              }
              vm.ModifyPageAdded("Remove", null, e, ui);
              return;
            }
          }
          else if (sourceTarget.id == 'dataElementAddedList' && dropTarget.id == 'dataElementAddedList') {
            _dataElementAddedList = [];
            _dataElementAddedList = ui.item.sortable.droptargetModel;
            vm.ModifyPageAdded("InnerSorting", null, e, ui);
            return;
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region reset value of selected element
    let ResetSelectedElement = () => {
      $scope.selectedElementListNoAdded = [];
      $scope.selectedElementListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    }
    //#endregion

    //#region check for selected element
    let checkSelectAllFlag = () => {
      $scope.selectAnyNoAdded = $scope.selectedElementListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedElementListAdded.length > 0 ? true : false;
    }
    //#endregion

    //#region unselect all element list
    vm.UnSelectAllElement = () => {
      angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedElement();
    }
    //#endregion

    //#region unselect single element list
    let UnSelectElement = (unSelectFrom) => {
      if (unSelectFrom == "NoAdded") {
        angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedElement();
    }
    //#endregion

    //#region  set item selectable
    let SetDataElementSelectable = () => {
      angular.element('[ui-sortable]#dataElementAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectElement("NoAdded");
        var $this = $(this);
        var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedElementListAdded = _.map(selectedItemIndexes, function (i) {
          return vm.dataElementAddedList[i];
        });
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#dataElementNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectElement("Added");
        var $this = $(this);
        var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedElementListNoAdded = _.map(selectedItemIndexes, function (i) {
          return vm.dataElementNoAddedList[i];
        });
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
    }
    let setSelectableListItem = () => {
      $timeout(() => {
        SetDataElementSelectable();
      }, _configSelectListTimeout);
    }
    //#endregion

    //#region for destroy selection
    let DestroyDataElementSelection = () => {
      angular.element('[ui-sortable]#dataElementNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#dataElementAddedList').off('ui-sortable-selectionschanged');
    }

    let DestroyAllSelection = () => {
      DestroyDataElementSelection();
    }
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', (e) => {
      DestroyAllSelection();
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
    //#endregion

    vm.SearchElement = (list, searchText, IsAdded) => {
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListElement = null;
          vm.isHideSearchButtonadded = false;
          vm.dataElementAddedList = _dataElementAddedList;
          vm.FilterDataElementAdded = true;
        } else {
          vm.SearchNoAddedListElement = null;
          vm.isHideSearchButton = false;
          vm.dataElementNoAddedList = _dataElementNoAddedList;
          vm.FilterDataElementNotAdded = true;
        }
        return;
      }
      else {
        if (IsAdded) {
          vm.isHideSearchButtonadded = true;
        }
        else {
          vm.isHideSearchButton = true;
        }
      }
      if (IsAdded) {
        vm.dataElementAddedList = $filter('filter')(_dataElementAddedList, { dataElementName: searchText });
        vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
      }
      else {
        vm.dataElementNoAddedList = $filter('filter')(_dataElementNoAddedList, { dataElementName: searchText });
        vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
      }
    }

    vm.refreshData = () => {
      vm.entitiesAll(true);
    }

    vm.addData = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      BaseService.goToElementManage(CORE.AllEntityIDS.Operation.ID);
    }

    // ask for revision popup to user
    let askForRevisionPopUp = (addType, indexPosition, event, ui) => {
      if (vm.operation.workorder.woStatus == CORE.WOSTATUS.PUBLISHED) {
        vm.openWOOPRevisionPopup(function (versionModel) {
          // Added for close revision dialog popup
          if (versionModel && versionModel.isCancelled) {
            cancelDropEvent(addType, event, ui);
            return;
          }
          if (versionModel) {
            saveDataFields(addType, indexPosition, versionModel, ui);
          }
          else {
            saveDataFields(addType, indexPosition, null, ui);
          }
        }, event);
      }
      else {
        saveDataFields(addType, indexPosition, null, ui);
      }
    }
    //#region modify data element Added based on selection from both list
    vm.ModifyPageAdded = (addType, indexPosition, event, ui) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      checkElementOperationOngoing(addType, indexPosition, event, ui);
      //if (!isAllow) {
      //    cancelDropEvent(addType, event, ui);
      //    return;
      //}
    }
    //#endregion

    function saveDataFields(addType, indexPosition, versionModel, ui) {
      let otherInfoForDataFields = {};
      let removedItem = [];
      if (addType == "Add") {
        _.each($scope.selectedElementListNoAdded, (item) => {
          let added = _.find(_dataElementAddedList, (element) => {
            return item.dataElementID == element.dataElementID
          });
          if (!added) {
            if (indexPosition != undefined && indexPosition != null) {
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
            _.find(_dataElementNoAddedList, (valItem) => {
              return valItem.dataElementID == item.dataElementID;
            })
          );
        });
        vm.UnSelectAllElement();
      }
      else if (addType == "Remove") {
        if ($scope.selectedElementListAdded && $scope.selectedElementListAdded.length == 1) {
          let dataelement = _.first($scope.selectedElementListAdded);
          removedItem.push(dataelement.woOpDataElementID);
        } else {
          _.each($scope.selectedElementListAdded, (item) => {
            removedItem.push(item.woOpDataElementID);
          });
        }
        vm.woOpDataElementID = (removedItem ? removedItem : null);
        _.each($scope.selectedElementListAdded, (item) => {
          let added = _.find(_dataElementNoAddedList, (element) => {
            return item.dataElementID == element.dataElementID
          });
          if (!added) {
            _dataElementNoAddedList.push(item);
          }
        });
        _.each($scope.selectedElementListAdded, (item) => {
          _dataElementAddedList = _.without(_dataElementAddedList,
            _.find(_dataElementAddedList, (valItem) => {
              return valItem.dataElementID == item.dataElementID;
            })
          );
        });
        vm.UnSelectAllElement();

      }
      else if (addType == "AddAll") {
        _.each(vm.dataElementNoAddedList, (item) => {
          let added = _.find(_dataElementAddedList, (element) => {
            return item.dataElementID == element.dataElementID
          });
          if (!added) {
            _dataElementAddedList.push(item);
          }
        });
        _.each(_dataElementAddedList, (item) => {
          _dataElementNoAddedList = _.without(_dataElementNoAddedList,
            _.find(_dataElementNoAddedList, (valItem) => {
              return valItem.dataElementID == item.dataElementID;
            })
          );
        });
        vm.UnSelectAllElement();
      }
      else if (addType == "RemoveAll") {
        _.each(vm.dataElementAddedList, (item) => {
          let added = _.find(_dataElementNoAddedList, (element) => {
            return item.dataElementID == element.dataElementID
          });
          if (!added) {
            _dataElementNoAddedList.push(item);
          }
        });
        _.each(_dataElementNoAddedList, (item) => {
          _dataElementAddedList = _.without(_dataElementAddedList,
            _.find(_dataElementAddedList, (valItem) => {
              return valItem.dataElementID == item.dataElementID;
            })
          );
        });
        _.each(_dataElementNoAddedList, (item) => {
          if (item.woOpDataElementID) {
            removedItem.push(item.woOpDataElementID);
          }
        });
        vm.woOpDataElementID = (removedItem ? removedItem : null);
        vm.UnSelectAllElement();
      }
      else if (addType == "InnerSorting") {
        otherInfoForDataFields.isInnerSortingOfElement = true;
        addType = "AddAll";
      }
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.isHideSearchButton = false;
      vm.isHideSearchButtonadded = false;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
      vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
      vm.saveWorkorderOperationDataelement(addType, versionModel, otherInfoForDataFields, ui);
    }

    /* save data elements in work order operation */
    vm.saveWorkorderOperationDataelement = (OperationTypeToChange, versionModel, otherInfoForDataFields, ui) => {
      const saveObj = [];
      let index = 1;
      _.each(_dataElementAddedList, (item) => {
        if (item.dataElementID) {
          let woOpDlInfo = _.find(woOpDataelementList, (woOpDataelementItem) => {
            return woOpDataelementItem.dataElementID == item.dataElementID;
          });
          const _object = {
          };
          _object.woOpDataElementID = woOpDlInfo ? woOpDlInfo.woOpDataElementID : null,
            _object.woID = vm.operation.woID,
            _object.opID = vm.operation.opID,
            _object.woOPID = vm.operation.woOPID,
            _object.dataElementID = item.dataElementID,
            _object.displayOrder = index;
          saveObj.push(_object);
        }
        let subFormElements = _.filter(SubFormElementList, (subFormItem) => {
          return subFormItem.parentDataElementID == item.dataElementID
        });
        if (subFormElements.length > 0) {
          _.each(subFormElements, (subItem) => {
            if (subItem.dataElementID) {
              let woOpDlInfo = _.find(woOpDataelementList, (woOpDataelementItem) => {
                return woOpDataelementItem.dataElementID == subItem.dataElementID;
              });
              const _object = {
              };
              _object.woOpDataElementID = woOpDlInfo ? woOpDlInfo.woOpDataElementID : null,
                _object.woID = vm.operation.woID,
                _object.opID = vm.operation.opID,
                _object.woOPID = vm.operation.woOPID,
                _object.dataElementID = subItem.dataElementID,
                _object.displayOrder = index;
              saveObj.push(_object);
            }
            index++;
          })
        }
        index++;
      });
      let listObj = {
        woID: vm.operation.woID,
        opID: vm.operation.opID,
        woOPID: vm.operation.woOPID,
        dataElementList: saveObj,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName,
        isInnerSortingOfElement: otherInfoForDataFields.isInnerSortingOfElement,
        entityID: angular.copy(CORE.AllEntityIDS.Operation.ID)
      }

      /* add new data element with update order of already exists */
      if (OperationTypeToChange == "Add" || OperationTypeToChange == "AddAll") {
        vm.cgBusyLoading = WorkorderOperationFactory.createWorkorderOperationDataElements().save({ listObj: listObj }).$promise.then((res) => {
          vm.setDataAfterSaveOrDeleteDataElement();
          vm.sendNotification(versionModel);
          if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
            vm.refreshWorkOrderHeaderDetails();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      /* delete data_element other than passed from here and update display_order of elements which are passed */
      else {
        vm.cgBusyLoading = WorkorderOperationFactory.deleteWorkorderOperationDataElements().save({ listObj: listObj }).$promise.then((res) => {
          vm.cgBusyLoading = WorkorderOperationFactory.deleteWoOpdataElmentRoles().save({
            woOpDataElementID: vm.woOpDataElementID
          }).$promise.then((roleData) => {
            vm.setDataAfterSaveOrDeleteDataElement();
            vm.sendNotification(versionModel);
            if (versionModel && (versionModel.woVersion || versionModel.opVersion)) {
              vm.refreshWorkOrderHeaderDetails();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.entitiesAll(true);

    // Assign Role to Data Element to disaply on traveler and other details
    vm.assignRole = (dataElement, ev) => {
      let data = {
        woOpDataElementID: dataElement ? dataElement.woOpDataElementID : null,
        woStatus: vm.operation.workorder.woStatus,
        woOPID: vm.operation.woOPID,
        woNumber: vm.operation.workorder.woNumber,
        opName: vm.operation.opName,
        isWOUnderTermination: vm.isWOUnderTermination
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_SHOWROLE_MODAL_CONTROLLER,
        WORKORDER.WORKORDER_SHOWROLE_MODAL_VIEW,
        ev,
        data).then((response) => {
          if (response) {
          }
        }, () => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }


    //check employee is checked-in than show alert and return
    let checkElementOperationOngoing = (addType, indexPosition, event, ui) => {
      let checkAddedElement;
      let checkNoAddedElement;
      // check select element list is any one other than entity
      if ($scope.selectedElementListAdded.length > 0) {
        checkAddedElement = _.find($scope.selectedElementListAdded, (elem) => {
          if (elem.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[0]) {
            return true;
          }
        });

      }
      if ($scope.selectedElementListNoAdded.length > 0) {
        checkNoAddedElement = _.find($scope.selectedElementListNoAdded, (elem) => {
          if (elem.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[0]) {
            return true;
          }
        });
      }
      if ((checkNoAddedElement || checkAddedElement || addType == "AddAll" || addType == "RemoveAll") && vm.IsProductionStart) {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.CHANGE_ASSY_REV_CONFIRMATION_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.CONFIRM_WORKORDER_OPERATION_ANY_CHANGE,
          btnText: CORE.MESSAGE_CONSTANT.CONTINUE_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.CANCEL_BUTTON
        };
        DialogFactory.confirmDiolog(obj).then((res) => {
          if (res) {
            PerformAction(addType, indexPosition, event, ui, true);
          }
        }, (cancel) => {
          vm.refreshData();
          return false;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        PerformAction(addType, indexPosition, event, ui, false);
      }
    }

    // perform action after confirmation 
    let PerformAction = (addType, indexPosition, event, ui, isAlreadyConfirm) => {
      if (addType == "Add" || addType == "AddAll" || addType == "InnerSorting") {
        askForRevisionPopUp(addType, indexPosition, event, ui);
      } else {
        if (!isAlreadyConfirm) {
          let obj = {
            title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, CORE.MainTitle.OperationDataFields),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.confirmDiolog(obj).then((res) => {
            if (res) {
              askForRevisionPopUp(addType, indexPosition, event, ui);
            }
          }, (cancel) => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        } else {
          askForRevisionPopUp(addType, indexPosition, event, ui);
        }
      }
    }

    /* go to data element manage page */
    vm.goToElementManage = (entityID, dataElementID) => {
      BaseService.goToElementManage(entityID, dataElementID);
    }

  };

  //angular
  //   .module('app.workorder.workorders').WorkorderOperationDataFieldsController = function () {
  //   };
})();

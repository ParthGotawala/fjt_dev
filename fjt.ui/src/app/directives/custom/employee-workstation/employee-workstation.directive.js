(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('employeeWorkstation', employeeWorkstation);
  /** @ngInject */
  function employeeWorkstation(CORE, DialogFactory, $q, uiSortableMultiSelectionMethods, $timeout, USER, $filter, EmployeeFactory, BaseService, $mdDialog) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        employeeId: '=',
      },
      templateUrl: 'app/directives/custom/employee-workstation/employee-workstation.html',
      controller: employeeCredenialCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function employeeCredenialCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyMesssageForEquipmentWorkstation = USER.ADMIN_EMPTYSTATE.EQUIPMENT_WORKSTATION_DYNAMIC;
      vm.Message = stringFormat(vm.EmptyMesssageForEquipmentWorkstation.MESSAGE, CORE.WorksationEmpty);
      vm.AddnewMessage = stringFormat(vm.EmptyMesssageForEquipmentWorkstation.ADDNEWMESSAGE, CORE.WorksationEmpty);
      vm.EmptyMesssageWorkStation = USER.ADMIN_EMPTYSTATE.ASSIGN_EMPLOYEE_WORKSTATION_DRAGDROP;
      vm.isContainOpMasterWorkstation = false;

      let _workStationAddedList = [];
      let _workStationNoAddedList = [];
      $scope.selectedWorkStationListNoAdded = [];
      $scope.selectedWorkStationListAdded = [];
      vm.SearchAddedListWorkStation = null;
      vm.SearchNoAddedListWorkStation = null;

      let employeeId = $scope.employeeId ? parseInt($scope.employeeId) : null;
      vm.employeeId = employeeId;

      let setEmpWorkStationDragDropDetails = () => {
        vm.SearchAddedListWorkStation = null;
        vm.SearchNoAddedListWorkStation = null;
        vm.isHideSearchButton = false;
        vm.isHideSearchButtonadded = false;
        vm.workStationAddedList = _workStationAddedList;
        vm.workStationNoAddedList = _workStationNoAddedList;
        vm.FilterWorkStationAdded = vm.workStationAddedList.length > 0;
        vm.FilterWorkStationNoAdded = vm.workStationNoAddedList.length > 0;
      }

      /*Move to equipment page*/
      vm.goToManageEquipmentWorkstation = (equip) => {
        BaseService.goToManageEquipmentWorkstation(equip.eqpID);
      }

      //#region reset value of selected workstation
      let ResetSelectedWorkStation = () => {
        $scope.selectedWorkStationListNoAdded = [];
        $scope.selectedWorkStationListAdded = [];
        $scope.selectAnyNoAdded = false;
        $scope.selectAnyAdded = false;
      }
      //#endregion

      //#region check for selected workstation
      let checkSelectAllFlagWorkStation = () => {
        $scope.selectAnyNoAdded = $scope.selectedWorkStationListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAdded = $scope.selectedWorkStationListAdded.length > 0 ? true : false;
      }
      //#endregion

      //#region unselect all workstation list
      let UnSelectAllWorkStation = () => {
        angular.element('[ui-sortable]#workStationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#workStationAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedWorkStation();
      }
      //#endregion

      //#region unselect single workstation list
      let UnSelectWorkStation = (unSelectFrom) => {
        if (unSelectFrom == "NoAdded") {
          angular.element('[ui-sortable]#workStationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#workStationAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedWorkStation();
      }
      //#endregion

      //#region  set item selectable
      let SetWorkStationSelectable = () => {
        angular.element('[ui-sortable]#workStationAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectWorkStation("NoAdded");
          var $this = $(this);
          var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedWorkStationListAdded = _.map(selectedItemIndexes, function (i) {
            return vm.workStationAddedList[i];
          });
          checkSelectAllFlagWorkStation();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#workStationNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectWorkStation("Added");
          var $this = $(this);
          var selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedWorkStationListNoAdded = _.map(selectedItemIndexes, function (i) {
            return vm.workStationNoAddedList[i];
          });
          checkSelectAllFlagWorkStation();
          $scope.$applyAsync();
        });
      }
      //#endregion

      //#region for destroy selection
      let DestroyWorkStationSelection = () => {
        angular.element('[ui-sortable]#workStationNoAddedList').off('ui-sortable-selectionschanged');
        angular.element('[ui-sortable]#workStationAddedList').off('ui-sortable-selectionschanged');
      }

      //#region sortable option common for all list
      $scope.sortableOptionsWorkStation = uiSortableMultiSelectionMethods.extendOptions({
        cancel: ".cursor-not-allow ",
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
            let dropTarget = ui.item.sortable.droptarget[0]; // get drop target workstation
            let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded != DestinationDivAdded) {
              if (SourceDivAdded == false && DestinationDivAdded == true) {
                if ($scope.selectedWorkStationListNoAdded.length == 0) {
                  $scope.selectedWorkStationListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedWorkStation("Add");
                return;
              }
              else if (SourceDivAdded == true && DestinationDivAdded == false) {
                if ($scope.selectedWorkStationListAdded.length == 0) {
                  $scope.selectedWorkStationListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedWorkStation("Remove");
                return;
              }
            }
          }
        },
        connectWith: '.items-container'
      });
      //#endregion

      let DestroyAllSelectionWorkStation = () => {
        DestroyWorkStationSelection();
      }
      //#endregion

      vm.workStationDetails = (isWorkStationTabClick) => {
        if (isWorkStationTabClick) {
          UnSelectAllWorkStation();
        }
        if (vm.employeeId) {
          vm.cgBusyLoading = EmployeeFactory.retrieveWorkStationDetail().query({ id: vm.employeeId }).$promise.then((res) => {
            if (res.data) {
              _workStationAddedList = vm.workStationAddedList = [];
              _workStationNoAddedList = vm.workStationNoAddedList = [];
              _.each(res.data, (itemData) => {
                if (vm.employeeId) {
                  itemData.employeeEquipment = _.first(itemData.employeeEquipment);
                  if (itemData.genericFiles) {
                    itemData.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_BASE_PATH + itemData.genericFiles.gencFileName;
                  }
                  else {
                    itemData.ProfilePic = CORE.WEB_URL + USER.EQUIPMENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
                  }
                  if (itemData.employeeEquipment) {
                    vm.workStationAddedList.push(itemData);
                  }
                  else {
                    if (itemData.isActive)
                      vm.workStationNoAddedList.push(itemData);
                  }
                }
                else {
                  if (itemData.isActive)
                    vm._workStationNoAddedList.push(itemData);
                }
              });
              _workStationAddedList = angular.copy(vm.workStationAddedList);
              _workStationNoAddedList = angular.copy(vm.workStationNoAddedList);

              if (_workStationAddedList.length == 0 && _workStationNoAddedList.length == 0) {
                vm.isContainOpMasterWorkstation = false;
              }
              else {
                vm.isContainOpMasterWorkstation = true;
              }
              setSelectableListItem();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }

      let setSelectableListItem = () => {
        $timeout(() => {
          SetWorkStationSelectable();
        }, _configSelectListTimeout);
      }

      vm.workStationDetails(true);
      vm.SearchWorkStation = (list, searchText, IsAdded) => {
        if (!searchText) {
          if (IsAdded) {
            vm.SearchAddedListWorkStation = null;
            vm.isHideSearchButtonadded = false;
            vm.workStationAddedList = _workStationAddedList;
            vm.FilterWorkStationAdded = true;
          } else {
            vm.SearchNoAddedListWorkStation = null;
            vm.isHideSearchButton = false;
            vm.workStationNoAddedList = _workStationNoAddedList;
            vm.FilterworkStationNotAdded = true;
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
          vm.workStationAddedList = $filter('filter')(_workStationAddedList, { assetName: searchText });
          vm.FilterWorkStationAdded = vm.workStationAddedList.length > 0;
        }
        else {
          vm.workStationNoAddedList = $filter('filter')(_workStationNoAddedList, { assetName: searchText });
          vm.FilterworkStationNotAdded = vm.workStationNoAddedList.length > 0;
        }
      }
      vm.refreshData = () => {
        vm.workStationDetails();
      }
      vm.addData = (data, ev) => {
        let pageRightsAccessDet = {
          popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
          pageNameAccessLabel: CORE.PageName.workstations
        }
        if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
          data = {};
          data.Title = CORE.EquipmentAndWorkstation_Title.Workstation;
          data.isOpenedFromPersonnelPage = true;
          DialogFactory.dialogService(
            USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
            USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (data) => {
              if (data) {
                vm.refreshData();
              }
            },
              (err) => {
              });
        }
      }

      let saveWorkStation = (newListToSave) => {
        const saveObj = [];

        _.each(newListToSave, (item) => {
          if (item.eqpID) {
            const _object = {};
            _object.employeeID = vm.employeeId,
              _object.eqpID = item.eqpID,
              saveObj.push(_object);
          }
        });
        let listObj = {
          employeeID: vm.employeeId,
          equipmentList: saveObj
        }
        return EmployeeFactory.createWorkstation_EquipmentList().save({ listObj: listObj }).$promise.then((res) => {
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      let deleteWorkStation = (listToDelete) => {
        return EmployeeFactory.deleteWorkstation_EquipmentListFromEmployee().delete({
          employeeID: vm.employeeId,
          equipmentIDs: _.map(listToDelete, (obj) => { return obj.eqpID })
        }).$promise.then((res) => {
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //#region modify data workstation Added based on selection from both list
      vm.ModifyPageAddedWorkStation = (addType) => {
        if (addType == "Add") {
          var promises = [saveWorkStation($scope.selectedWorkStationListNoAdded)];
          vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
              _.each($scope.selectedWorkStationListNoAdded, (item) => {
                let added = _.find(_workStationAddedList, (workStation) => {
                  return item.eqpID == workStation.eqpID
                });
                if (!added) {
                  _workStationAddedList.push(item);
                }
              });
              _.each($scope.selectedWorkStationListNoAdded, (item) => {
                _workStationNoAddedList = _.without(_workStationNoAddedList,
                  _.find(_workStationNoAddedList, (valItem) => {
                    return valItem.eqpID == item.eqpID;
                  })
                );
              });
              UnSelectAllWorkStation();
              setEmpWorkStationDragDropDetails();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else if (addType == "Remove") {
          let obj = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WORKSTATION_DELETED_FROM_EMPLOYEE_CONFIRMATION,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((res) => {
            if (res) {
              var promises = [deleteWorkStation($scope.selectedWorkStationListAdded)];
              vm.cgBusyLoading = $q.all(promises).then(function (responses) {
                if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                  _.each($scope.selectedWorkStationListAdded, (item) => {
                    let added = _.find(_workStationNoAddedList, (workStation) => {
                      return item.eqpID == workStation.eqpID
                    });
                    if (!added) {
                      _workStationNoAddedList.push(item);
                    }
                  });
                  _.each($scope.selectedWorkStationListAdded, (item) => {
                    _workStationAddedList = _.without(_workStationAddedList,
                      _.find(_workStationAddedList, (valItem) => {
                        return valItem.eqpID == item.eqpID;
                      })
                    );
                  });
                  UnSelectAllWorkStation();
                  setEmpWorkStationDragDropDetails();
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }, (cancel) => {

          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;

        }
        else if (addType == "AddAll") {
          var promises = [saveWorkStation(vm.workStationNoAddedList)];
          vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
              _.each(vm.workStationNoAddedList, (item) => {
                let added = _.find(_workStationAddedList, (workStation) => {
                  return item.eqpID == workStation.eqpID
                });
                if (!added) {
                  _workStationAddedList.push(item);
                }
              });
              _.each(_workStationAddedList, (item) => {
                _workStationNoAddedList = _.without(_workStationNoAddedList,
                  _.find(_workStationNoAddedList, (valItem) => {
                    return valItem.eqpID == item.eqpID;
                  })
                );
              });
              UnSelectAllWorkStation();
              setEmpWorkStationDragDropDetails();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else if (addType == "RemoveAll") {
          let obj = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WORKSTATION_DELETED_FROM_EMPLOYEE_CONFIRMATION,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((res) => {
            if (res) {
              var promises = [deleteWorkStation(vm.workStationAddedList)];
              vm.cgBusyLoading = $q.all(promises).then(function (responses) {
                if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                  _.each(vm.workStationAddedList, (item) => {
                    let added = _.find(_workStationNoAddedList, (workStation) => {
                      return item.eqpID == workStation.eqpID
                    });
                    if (!added) {
                      _workStationNoAddedList.push(item);
                    }
                  });
                  _.each(_workStationNoAddedList, (item) => {
                    _workStationAddedList = _.without(_workStationAddedList,
                      _.find(_workStationAddedList, (valItem) => {
                        return valItem.eqpID == item.eqpID;
                      })
                    );
                  });
                  UnSelectAllWorkStation();
                  setEmpWorkStationDragDropDetails();
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }, (cancel) => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
          return;

        }

      }

      //cancel drop event if canceled or validation failed
      let cancelDropEvent = (optype, e, ui) => {
        if (ui) {
          if (ui.item && ui.item.sortable && ui.item.sortable.cancel) {
            ui.item.sortable.cancel();
          } else {
            vm.refreshDataEmployee();
          }
        }
        return false;
      }
      //#endregion

      // destory on event on controller destroy
      $scope.$on('$destroy', function () {
        DestroyAllSelectionWorkStation();
      });


      angular.element(() => {
        BaseService.currentPageForms.push(vm.workStationDetail);
        $scope.$parent.vm.workStationDetail = vm.workStationDetail;
      });

      $scope.$on("savePasswordChanges", function (evt, data) {
        vm.savePassword();
      });

    }
  }
})();

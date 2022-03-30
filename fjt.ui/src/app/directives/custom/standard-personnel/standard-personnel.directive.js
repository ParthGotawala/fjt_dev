(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('standardPersonnel', standardPersonnel);
  /** @ngInject */
  function standardPersonnel(CORE, DialogFactory, EmployeeCertificationFactory, $timeout, $q, USER, BaseService, uiSortableMultiSelectionMethods, StandardClassFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        standardId: '=?',
        classId: '=?'
      },
      templateUrl: 'app/directives/custom/standard-personnel/standard-personnel.html',
      controller: standardPersonnelController,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function standardPersonnelController($scope, $element, $attrs) {
      var vm = this;
      vm.certificateStandardID = $scope.standardId;
      vm.classID = $scope.classId || null;
      vm.selectedClassID;

      vm.SearchAssignedListPersonnel = null;
      vm.SearchNotAssignedListPersonnel = null;
      vm.EmptyMesssageForAssigned = USER.ADMIN_EMPTYSTATE.STANDARD_PERSONNEL_ASSIGNED_EMPTY;
      vm.EmptyMesssageForNotAssigned = USER.ADMIN_EMPTYSTATE.STANDARD_PERSONNEL_NOT_ASSIGNED_EMPTY;

      //Unselect all Personnels from list
      let UnSelectAllStandardPersonnel = () => {
        angular.element('[ui-sortable]#standardNotAssignedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#standardAssignedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedPersonnel();
      }

      //#region unselect single element list
      let UnSelectPersonnel = (unSelectFrom) => {
        if (unSelectFrom == "NoAdded") {
          angular.element('[ui-sortable]#standardNotAssignedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#standardAssignedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedPersonnel();
      }
      //#endregion

      let ResetSelectedPersonnel = () => {
        $scope.selectedPersonnelListNotAdded = [];
        $scope.selectedPersonnelListAdded = [];
      }
      ResetSelectedPersonnel();

      //#region  set item selectable
      let SetStandardPersonnelSelectable = () => {
        angular.element('[ui-sortable]#standardAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectPersonnel("NoAdded");
          let $this = $(this);
          $scope.selectedPersonnelListAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#standardNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
          UnSelectPersonnel("Added");
          let $this = $(this);
          $scope.selectedPersonnelListNotAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
      }
      function getStandardClass(item) {
        if (item) {
          vm.autoCompleteClass.keyColumnId = item.classID;
          vm.refreshStandardPersonnelEmployee();
        }
        else {
          vm.standardAssignedList = [];
          vm.standardNotAssignedList = [];
        }
      }

      function initAutoComplete() {
        vm.autoCompleteClass = {
          columnName: 'className',
          controllerName: USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_VIEW,
          keyColumnName: 'classID',
          keyColumnId: vm.selectedClassID,
          inputName: 'refclassId',
          placeholderName: 'Standards Categories',
          addData: { certificateStandardID: vm.certificateStandardID },
          isRequired: (vm.standardClassList && vm.standardClassList.length > 0),
          isAddnew: true,
          callbackFn: getStandardClassListByStandardId,
          onSelectCallbackFn: getStandardClass
        }
        return $q.resolve(true);
      }

      let savePersonnelStandard = (addType) => {
        let _objList = {};
        if (addType == "AddAll") {
          _objList.employeeID = _.map(vm.standardNotAssignedList, (item) => {
            return {
              employeeID: item.id,
              certificateStandardID: vm.certificateStandardID,
              classID: vm.autoCompleteClass.keyColumnId
            }
          });
        }
        else {
          _objList.employeeID = $scope.selectedPersonnelListNotAdded.map(function (item) {
            return {
              employeeID: item,
              certificateStandardID: vm.certificateStandardID,
              classID: vm.autoCompleteClass.keyColumnId
            }
          });
        }
        _objList.addNewEmpCertiIDs = vm.certificateStandardID;
        return $scope.$parent.vm.cgBusyLoading = EmployeeCertificationFactory.saveStandardPersonnelCertification().save({ listObj: _objList }).$promise.then((res) => {
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      let deleteWorkorderOperationEmployee = (addType) => {
        let _objList = {};
        if (addType == "RemoveAll") {
          _objList.id = _.map(vm.standardAssignedList, (item) => { return item.empCertiID });
        }
        else {
          _objList.id = $scope.selectedPersonnelListAdded;
        }
        _objList.certificateStandardID = vm.certificateStandardID;
        return $scope.$parent.vm.cgBusyLoading = EmployeeCertificationFactory.deleteStandardPersonnelCertification().save({ listObj: _objList }).$promise.then((res) => {
          return res;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      function getStandardClassListByStandardId() {
        return $scope.$parent.vm.cgBusyLoading = StandardClassFactory.getStandardClassListByStandardId().query({
          id: vm.certificateStandardID
        }).$promise.then((res) => {
          vm.standardClassList = [];
          if (res && res.data) {
            vm.standardClassList = res.data;
          }
          return $q.resolve(res);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      $scope.$parent.vm.cgBusyLoading = $q.all([getStandardClassListByStandardId()]).then(function (responses) {
        if (vm.standardClassList && vm.standardClassList.length > 0) {
          if (vm.classID) {
            vm.selectedClassID = vm.classID;
          }
          else {
            vm.selectedClassID = vm.standardClassList[0].classID;
          }
        }
        $scope.$parent.vm.cgBusyLoading = $q.all([initAutoComplete()]).then(function (response) {
          vm.refreshStandardPersonnelEmployee();
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });

      //#region Save Personnel
      vm.savePersonnel = (addType, ui) => {
        if (addType == "Add" || addType == "AddAll") {
          var promises = [savePersonnelStandard(addType)];
          $scope.$parent.vm.cgBusyLoading = $q.all(promises).then(function (responses) {
            if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
              ResetSelectedPersonnel();
              vm.refreshStandardPersonnelEmployee();
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else if (addType == "Remove" || addType == "RemoveAll") {
          var selectedCount = (addType == "Remove") ? $scope.selectedPersonnelListAdded.length : vm.standardAssignedList.length;
          let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, "Personnel(s)", selectedCount);
          let obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            var promises = [deleteWorkorderOperationEmployee(addType)];
            $scope.$parent.vm.cgBusyLoading = $q.all(promises).then(function (responses) {
              if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                ResetSelectedPersonnel();
                vm.refreshStandardPersonnelEmployee();
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
            return;
          }, (cancel) => {
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
      //#endregion

      vm.ModifyPageAddedEmployee = (addType, event, ui) => {
        vm.savePersonnel(addType, ui);
      }

      let setStandardCertificationDet = (StdCertificationData) => {
        let classWithColorCode = StdCertificationData.empCertifications.split("@@@@@@");
        _.each(classWithColorCode, (item) => {
          if (item) {
            let objItem = item.split("######");
            let standardClassObj = {};
            standardClassObj.stdClassName = objItem[0].trim();
            standardClassObj.colorCode = objItem[1] ? objItem[1] : CORE.DefaultStandardTagColor;
            StdCertificationData.CertificationDetList.push(standardClassObj);
          }
        });
      }

      let getAllStandardPersonnelNotAssigned = () => {
        return EmployeeCertificationFactory.retrieveEmployeeListGeneric().save().$promise.then((res) => {
          if (res && res.data && res.data.empMasterList) {
            vm.allEmployeesList = [];

            _.each(res.data.empMasterList, (itemData) => {
              let deptName = "";
              let gencCategoryName = "";
              if (itemData.deptName) {
                deptName = " (" + itemData.deptName + ")";
              }
              if (itemData.gencCategoryName) {
                gencCategoryName = " " + itemData.gencCategoryName;
              }
              itemData.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, itemData.initialName, itemData.firstName, itemData.lastName) + deptName + gencCategoryName;
              if (itemData.profileImg) {
                itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + itemData.profileImg;
              }
              else {
                itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
              }

              itemData.CertificationDetList = [];
              if (itemData.empCertifications) {
                setStandardCertificationDet(itemData);
              }
              
              itemData.personFullName = '(' + itemData.initialName + ') ' + (itemData.firstName ? itemData.firstName : "") + " " + (itemData.lastName ? itemData.lastName : "");
              vm.allEmployeesList.push(itemData);
            });

            vm.allEmployeesList = _.filter(vm.allEmployeesList, (personnelItem) => {
              return personnelItem.isActive;
            });

            // call methods for sorting data
            reorderStandardPersonnelList();
          }
          return $q.resolve(res);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      let getAllStandardPersonnelAssigned = () => {
        return EmployeeCertificationFactory.retrieveAssignedStandardEmployees().save({
          certificateStandardID: vm.certificateStandardID,
          classID: (vm.autoCompleteClass && vm.autoCompleteClass.keyColumnId) ? vm.autoCompleteClass.keyColumnId : null,
          searchText: vm.SearchAssignedListPersonnel ? vm.SearchAssignedListPersonnel : null
        }).$promise.then((res) => {
          if (res && res.data) {
            vm.AssignedListResponse = res.data;
          }
          return $q.resolve(res);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Call methods of assigned and non assigned to standard
      vm.refreshStandardPersonnelEmployee = () => {

        UnSelectAllStandardPersonnel();
        vm.SearchAssignedListPersonnel = null;
        vm.SearchNotAssignedListPersonnel = null;

        if (vm.standardClassList && vm.standardClassList.length > 0 && !vm.autoCompleteClass.keyColumnId) {
          return;
        }

        let standardPersonnelPromises = [getAllStandardPersonnelNotAssigned(), getAllStandardPersonnelAssigned()];
        $scope.$parent.vm.cgBusyLoading = $q.all(standardPersonnelPromises).then(function (responses) {
          let responseStatus = _.find(responses, (res) => {
            return res.status == 'SUCCESS';
          });
          if (responseStatus.status == 'SUCCESS') {
            if (responses && responses.length > 0) {
              setSelectableListItem();
            }

            _.each(vm.AssignedListResponse, (itemData) => {
              let assignedPersonnel = _.find(vm.allEmployeesList, (assignedItem) => {
                return assignedItem.id == itemData.employeeID;
              })
              if (assignedPersonnel) {
                assignedPersonnel.empCertiID = itemData.id;
              }
            });

            vm.standardAssignedList = _.filter(vm.allEmployeesList, (personnelItem) => {
              return personnelItem.isActive && personnelItem.empCertiID;
            });
            vm.standardNotAssignedList = _.filter(vm.allEmployeesList, (personnelItem) => {
              return personnelItem.isActive && !personnelItem.empCertiID;
            });

            // call methods for sorting data
            reorderStandardPersonnelList();
          }
          else {
            return CORE.ApiResponseTypeStatus.FAILED;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      

      //vm.refreshStandardPersonnelEmployee();

      let reorderStandardPersonnelList = () => {
        vm.standardAssignedList = _.sortBy(vm.standardAssignedList, 'name');
        vm.standardNotAssignedList = _.sortBy(vm.standardNotAssignedList, 'name');
      }
      let setSelectableListItem = () => {
        $timeout(() => {
          SetStandardPersonnelSelectable();
        }, _configSelectListTimeout);
      }
      //#endregion
      vm.searchStandardPersonnelFromNoAssignedList = () => {
        UnSelectAllStandardPersonnel();
        if (vm.SearchNotAssignedListPersonnel) {
          vm.standardNotAssignedList = vm.allEmployeesList.filter((item) => { return !item.empCertiID && (item.personFullName ? item.personFullName.toLowerCase().includes(vm.SearchNotAssignedListPersonnel.toLowerCase()) : false) });
        }
        else {
          vm.standardNotAssignedList = vm.allEmployeesList.filter((item) => { return !item.empCertiID });
        }
        reorderStandardPersonnelList();
      }
      vm.searchStandardPersonnelFromAssignedList = () => {
        UnSelectAllStandardPersonnel();
        if (vm.SearchAssignedListPersonnel) {
          vm.standardAssignedList = vm.allEmployeesList.filter((item) => { return item.empCertiID && (item.personFullName ? item.personFullName.toLowerCase().includes(vm.SearchAssignedListPersonnel.toLowerCase()) : false) });
        }
        else {
          vm.standardAssignedList = vm.allEmployeesList.filter((item) => { return item.empCertiID });
        }
        reorderStandardPersonnelList();
      }

      //#region sortable option common for all list
      $scope.sortableOptionsPersonnel = uiSortableMultiSelectionMethods.extendOptions({
        cancel: ".cursor-not-allow,:input",
        placeholder: "beingDragged",
        'ui-floating': true,
        cursorAt: {
          top: 0, left: 0
        },
        start: (e, ui) => {
        },
        sort: (e, ui) => {
        },
        update: (e, ui) => {
          let sourceModel = ui.item.sortable.model;
          if (!ui.item.sortable.received && ui.item.sortable.droptarget) {
            let sourceTarget = ui.item.sortable.source[0];
            let dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
            let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded != DestinationDivAdded) {
              if (SourceDivAdded == false && DestinationDivAdded == true) {
                $scope.selectedPersonnelListNotAdded = [];
                $scope.selectedPersonnelListNotAdded.push(sourceModel.id);
                vm.savePersonnel("Add");
                return;
              }
              else if (SourceDivAdded == true && DestinationDivAdded == false) {
                $scope.selectedPersonnelListAdded = [];
                $scope.selectedPersonnelListAdded.push(sourceModel.empCertiID);
                vm.savePersonnel("Remove");
                return;
              }
            }
          }
        },
        stop: (e, ui) => {
        },
        connectWith: '.items-container'
      });
      //#endregion

      vm.addDataEmployee = (data, ev) => {
        var data = {};
        let popUpData = { popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName };
        let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
            USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (data) => {
              if (data) {
                vm.refreshStandardPersonnelEmployee();
              }
            },
              (err) => {
              });
        }
      }
      vm.goToStandardCaregoryList = () => {
        BaseService.goToStandardCaregoryList();
      }

      /* to move at employee update page */
      vm.goToUpdatePersonnel = (employeeID) => {
        BaseService.goToManagePersonnel(employeeID);
      }
    }
  }
})();

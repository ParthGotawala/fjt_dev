(function () {
  'use strict';
  angular
    .module('app.admin.employee')
    .controller('ManageEmployeeResponsibilityPopupController', ManageEmployeeResponsibilityPopupController);
  /** @ngInject */
  function ManageEmployeeResponsibilityPopupController($mdDialog, $filter, CORE, data, EmployeeFactory, BaseService, DialogFactory, GenericCategoryFactory, $q, USER) {

    const vm = this;
    let employeeID = data.employeeID;
    vm.loginUser = BaseService.loginUser;
    vm.SelectedResponsibilityList = [];
    let employeeName = data.employeeName;
    let loginUserRoleList = [BaseService.loginUser.defaultLoginRoleID];
    vm.WorkArea = CORE.CategoryType.WorkArea;
    vm.EmptyMessage = USER.ADMIN_EMPTYSTATE.GENERICCATEGORY;
    vm.CategoryType = angular.copy(_.find(CORE.Category_Type, x => x.categoryTypeID == vm.WorkArea.ID));
    vm.Message = stringFormat(vm.EmptyMessage.MESSAGE, vm.CategoryType.displayName);
    vm.addButtonLabel = vm.CategoryType.singleLabel;
    vm.AddnewMessage = stringFormat(vm.EmptyMessage.ADDNEWMESSAGE, vm.CategoryType.displayName);
    vm.imageUrl = stringFormat(vm.EmptyMessage.IMAGEURL, vm.CategoryType.EmptyStateImageName + '.png');
    let CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.paymenterm = CategoryTypeObjList.Terms.ID;
    vm.HomeMenuID = CategoryTypeObjList.HomeMenu.ID;
    vm.notificationCategoryID = CategoryTypeObjList.NotificationCategory.ID;
    let GenericCategoryAllData = [];

    vm.headerdata = [];
    vm.headerdata.push({
      label: CORE.MainTitle.Employee,
      value: employeeName,
      displayOrder: 1
    });
    vm.roleAdmin = CORE.Role.SuperAdmin.toLowerCase();
    vm.roleExecutive = CORE.Role.Executive.toLowerCase();
    _.find(vm.loginUser.roles, (role) => {
      if (role.id == vm.loginUser.defaultLoginRoleID) {
        vm.defaultRole = role.name.toLowerCase();
      }
    });
    //Get Generic category list to bind standard type
    let getWorkAreaList = () => {
      let GencCategoryType = [];
      GencCategoryType.push(vm.WorkArea.Name);
      let listObj = {
        GencCategoryType: GencCategoryType,
        isActive: employeeID ? true : false
      }
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        vm.SelectedResponsibilityList = [];
        GenericCategoryAllData = genericCategories.data;
        vm.ResponsibilityList = _.filter(GenericCategoryAllData, (item) => {
          return item.parentGencCategoryID == null && item.categoryType == vm.WorkArea.Name;
        });
        vm.Responsibilitytarray = angular.copy(vm.ResponsibilityList);
        if (vm.ResponsibilityList.length > 0) {
          vm.isNoDataFound = false;
        } else {
          vm.isNoDataFound = true;
        }
        return $q.resolve(vm.ResponsibilityList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get Employee responsibilityList
    let getEmployeeResponsibilityList = () => {
      return EmployeeFactory.getEmployeeResponsibility().query({ employeeID: employeeID }).$promise.then((res) => {
        if (res && res.data) {
          vm.employeeResponsibilityList = res.data;
        }
        return $q.resolve(res);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initEmployeeResponsibilityData = () => {
      var promise = [getWorkAreaList(), getEmployeeResponsibilityList()];
      vm.cgBusyLoading = $q.all(promise).then((response) => {
        _.each(vm.ResponsibilityList, (item) => {
          let empResponsibility = _.find(vm.employeeResponsibilityList, x => x.responsibilityID == item.gencCategoryID);
          if (empResponsibility) {
            item.isSelected = true;
            vm.SelectedResponsibilityList.push(item)
          } else {
            item.isSelected = false;
          }
        })
        bindData();
      });
    }
    // Bind data as per selected items list
    function bindData() {
      vm.Responsibilitytarray = angular.copy(vm.ResponsibilityList);
      _.each(vm.SelectedResponsibilityList, (item) => {
        var index = _.find(vm.ResponsibilityList, (data) => {
          if (data.gencCategoryID == item.gencCategoryID) {
            data.isSelected = true;
            return true;
          }
        })
        vm.ResponsibilityList.splice(vm.ResponsibilityList.indexOf(index), 1);
        item.isSelected = true;
      })
    }
    initEmployeeResponsibilityData();


    /* save employee certification  */
    vm.SaveEmployeeResponsibility = (event) => {
      vm.saveDisable = true
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.EMPLOYEE_RESPONSIBILITY_CHANGE_CONFIRMATION);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          let NewSelectedResponsibility = [];
          let DeletedResponsibility = [];
          _.each(vm.ResponsibilityList, (item) => {
            let empResponsibility = _.find(vm.employeeResponsibilityList, x => x.responsibilityID == item.gencCategoryID);
            if (empResponsibility) {
              DeletedResponsibility.push(item.gencCategoryID);
            }
          })
          _.each(vm.SelectedResponsibilityList, (item) => {
            let empResponsibility = _.find(vm.employeeResponsibilityList, x => x.responsibilityID == item.gencCategoryID);
            if (!empResponsibility) {
              let objempResponsibility = {
                employeeID: employeeID,
                responsibilityID: item.gencCategoryID
              }
              NewSelectedResponsibility.push(objempResponsibility);
            }
          })
          SaveEmployeeStandardDetails(NewSelectedResponsibility, DeletedResponsibility);
        }
      }, (cancel) => {
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });

    }

    let SaveEmployeeStandardDetails = (newEmpResponsibility, deletedEmpResponsibility) => {
      if (employeeID) {
        let _objList = {
          newEmpResponsibility: newEmpResponsibility,
          deletedEmpResponsibility: deletedEmpResponsibility,
          employeeID: employeeID
        }
        vm.cgBusyLoading = EmployeeFactory.saveEmployeeResponsibility().save({ listObj: _objList }).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveDisable = false;
            $mdDialog.cancel();
          }
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.saveDisable = false;
      }
    }

    vm.searchListItems = (criteria) => {
      return $filter('filter')(vm.ResponsibilityList, { gencCategoryName: criteria });
    };

    vm.onSelectedItem = (item, form) => {
      item.isSelected = true;
      vm.SelectedResponsibilityList.push(item);
      vm.ResponsibilityList.splice(vm.ResponsibilityList.indexOf(item), 1);
      form.$setDirty();
    };

    vm.unselect = (form) => {
      vm.isChanged = true;
      vm.ResponsibilityList = _.filter(vm.Responsibilitytarray, (dataobj) => {
        let selectedType = _.find(vm.SelectedResponsibilityList, (m) => {
          return m.gencCategoryID == dataobj.gencCategoryID;
        });
        if (!selectedType) {
          dataobj.isSelected = false;
          return true;
        } else {
          return false;
        }
      })
      form.$setDirty();
    }
    vm.goToResponsibilityList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_WORKAREA_STATE, {});
    }

    /* Add Responsibility */
    vm.addResponsibility = (ev) => {
      vm.ResponsibilityDisable = true;
      let data = {
        headerTitle: CORE.CategoryType.WorkArea.Name,
        Title: CORE.CategoryType.WorkArea.Name
      };
      DialogFactory.dialogService(
        USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.ResponsibilityDisable = true;
        }, () => {
          vm.ResponsibilityDisable = true;
          initEmployeeResponsibilityData();
        }, (err) => {
          vm.ResponsibilityDisable = true;
          return BaseService.getErrorLog(err);
        });
    };

    /* refresh all Responsibility */
    vm.refreshResponsibility = () => {
      initEmployeeResponsibilityData();
    }

    vm.cancel = () => {
      if (vm.isChanged) {
        showWithoutSavingAlertforCancel();
      } else {
        BaseService.currentPageFlagForm = [];
        $mdDialog.cancel();
      }
    };
    function showWithoutSavingAlertforCancel() {

      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isChanged = false;
          BaseService.currentPageFlagForm = [];
          $mdDialog.cancel(false);
        }
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

  }
})();

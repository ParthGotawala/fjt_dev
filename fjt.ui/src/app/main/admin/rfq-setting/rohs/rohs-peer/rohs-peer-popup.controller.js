(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageRoHSPeersPopupController', ManageRoHSPeersPopupController);
  /** @ngInject */
  function ManageRoHSPeersPopupController($mdDialog, $filter, CORE, data, RFQSettingFactory, BaseService, DialogFactory, $q, USER) {

    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.SelectedRoHSPeersList = [];
    let loginUserRoleList = [BaseService.loginUser.defaultLoginRoleID];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ROHS;
    let rohsCategory = data.category;
    vm.RoHSPeersList = angular.copy(data.rohsPeerList);

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'RoHS Status',
      value: data.name,
      displayOrder: 1
    });
    vm.roleAdmin = CORE.Role.SuperAdmin.toLowerCase();
    vm.roleExecutive = CORE.Role.Executive.toLowerCase();
    _.find(vm.loginUser.roles, (role) => {
      if (role.id == vm.loginUser.defaultLoginRoleID) {
        vm.defaultRole = role.name.toLowerCase();
      }
    });
    //retrieve RoHS list for parent RoHS
    function retriveParentRoHSList() {
      return RFQSettingFactory.retrieveParentRoHS().query({ id: data.id || null }).$promise.then((response) => {
        if (response && response.data) {
          vm.RoHSListForPeer = _.filter(response.data, x => x.refMainCategoryID == rohsCategory);
          vm.RoHSforPeerArray = angular.copy(vm.RoHSListForPeer);
          if (vm.RoHSListForPeer.length > 0) {
            vm.isNoDataFound = false;
          } else {
            vm.isNoDataFound = true;
          }
        }
        return vm.RoHSListForPeer;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initRoHSPeerData = () => {
      vm.SelectedRoHSPeersList = [];
      var promise = [retriveParentRoHSList()];
      vm.cgBusyLoading = $q.all(promise).then((response) => {
        _.each(vm.RoHSListForPeer, (item) => {
          let rohsPeer = _.find(vm.RoHSPeersList, x => x.rohsPeerID == item.id);
          if (rohsPeer) {
            item.isSelected = true;
            vm.SelectedRoHSPeersList.push(item);
          } else {
            item.isSelected = false;
          }
        })
        bindData();
      });
    }
    // Bind data as per selected items list
    function bindData() {
      vm.RoHSforPeerArray = angular.copy(vm.RoHSListForPeer);
      _.each(vm.SelectedRoHSPeersList, (item) => {
        var index = _.find(vm.RoHSListForPeer, (data) => {
          if (data.id == item.id) {
            data.isSelected = true;
            return true;
          }
        })
        vm.RoHSListForPeer.splice(vm.RoHSListForPeer.indexOf(index), 1);
        item.isSelected = true;
      })
    }
    initRoHSPeerData();

    /* save RoHS Peers  */
    vm.SaveRoHSPeers = (event) => {
      vm.saveDisable = true
      let NewSelectedPeers = [];
      let DeletedPeers = [];
      _.each(vm.RoHSListForPeer, (item) => {
        let rohsPeer = _.find(vm.RoHSPeersList, x => x.rohsPeerID == item.id);
        if (rohsPeer) {
          DeletedPeers.push(item.id);
        }
      })
      _.each(vm.SelectedRoHSPeersList, (item) => {
        let rohsPeer = _.find(vm.RoHSPeersList, x => x.rohsPeerID == item.id);
        if (!rohsPeer) {
          let objRoHSPeer = {
            rohsID: data.id,
            rohsPeerID: item.id,
            name: item.name
          }
          NewSelectedPeers.push(objRoHSPeer);
        } else {
          NewSelectedPeers.push(rohsPeer);
        }
      })
      SaveRoHSPeerDetail(NewSelectedPeers, DeletedPeers);
    }

    let SaveRoHSPeerDetail = (newRohsPeer, deletedRohsPeer) => {
      let _objList = {
        newRoHSPeer: newRohsPeer,
        rohsID: data.id
      }
      $mdDialog.hide(_objList);
      vm.saveDisable = false;
    }

    // Search item from list
    vm.searchListItems = (criteria) => {
      return $filter('filter')(vm.RoHSListForPeer, { name: criteria });
    };
    // select Item from list
    vm.onSelectedItem = (item, form) => {
      vm.isChanged = true;
      item.isSelected = true;
      vm.SelectedRoHSPeersList.push(item);
      vm.RoHSListForPeer.splice(vm.RoHSListForPeer.indexOf(item), 1);
      form.$setDirty();
    };
    // Un-select selected item
    vm.unselect = (form) => {
      vm.isChanged = true;
      vm.RoHSListForPeer = _.filter(vm.RoHSforPeerArray, (dataobj) => {
        let selectedType = _.find(vm.SelectedRoHSPeersList, (m) => {
          return m.id == dataobj.id;
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

    // cancel /close popup
    vm.cancel = () => {
      if (vm.isChanged) {
        showWithoutSavingAlertforCancel();
      } else {
        BaseService.currentPageFlagForm = [];
        $mdDialog.cancel();
      }
    };

    // Show alert for dirty form
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

    // Refresh RoHS list and peers detail
    vm.refreshRoHS = (ev) => {
      initRoHSPeerData();
    }

    // go to RoHS list
    vm.goToRoHSList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    }

    /* Add RoHS */
    vm.addRoHS = (ev) => {
      vm.RoHSDisable = true;
      let data = {

      };
      DialogFactory.dialogService(
        CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        CORE.MANAGE_ROHS_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.RoHSDisable = false;
          initRoHSPeerData();
        }, () => {
          vm.RoHSDisable = false;
          initRoHSPeerData();
        }, (err) => {
          vm.RoHSDisable = false;
          return BaseService.getErrorLog(err);
        });
    };

  }
})();

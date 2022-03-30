(function () {
  'use strict';

  angular
    .module('app.customforms.entity')
    .controller('CustomFormsEntityMainController', CustomFormsEntityMainController);

  /** @ngInject */
  function CustomFormsEntityMainController($state, $timeout, $scope, CORE, BaseService, EntityFactory, $mdSidenav,
    CUSTOMFORMS, CONFIGURATION, socketConnectionService, DialogFactory) {
    const vm = this;
    vm.EmptyMesssageForCustomForms = CUSTOMFORMS.CUSTOMFORMS_EMPTYSTATE.ENTITY;
    vm.isShowSideNav = false;
    const loginUserDetails = BaseService.loginUser;
    vm.DisplayStatusConst = CORE.DisplayStatus;

    const refreshTree = $scope.$on('bindDynamicMasterTreeViewMain', (event, args) => {
      $timeout(() => {
        $scope.$broadcast('bindDynamicMasterTreeView', args);
      });
    });

    /* to get latest custom form details and bind same */
    const getlatestDataOfTree = $scope.$on('retrieveManualEntityList', () => {
      const isDirty = BaseService.checkFormDirty(vm.dynamicMasterEntityDetailForm);
      if (isDirty) {
        return showWithoutSavingAlertforTabRefresh();
      }
      else {
        vm.getManualEntityList();
      }
    });
    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabRefresh() {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.REFRESH_BUTTON_TXT,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.dynamicMasterEntityDetailForm.$setPristine();
        vm.getManualEntityList();
        return true;
      }, () => {
        /*Set focus on first enabled field when user click stay on button*/
        if (vm.dynamicMasterEntityDetailForm) {
          BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.dynamicMasterEntityDetailForm);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // get manual entity and data elements
    vm.getManualEntityList = () => {
      vm.ManualEntities = [];
      if (loginUserDetails.isUserSuperAdmin) {
        vm.cgBusyLoading = EntityFactory.getAllEntityWithDataElements().query();
      }
      else {
        const _queryObj = {
          loginEmployeeID: loginUserDetails.employee.id
        };
        vm.cgBusyLoading = EntityFactory.getAllCustomFormEntityByAccessPermissionOfEmployee().query(_queryObj);
      }
      vm.cgBusyLoading.$promise.then((entity) => {
        if (entity && entity.data) {
          vm.ManualEntities = _.filter(entity.data.entity, (ent) => ent.systemGenerated === false && ent.dataElement.length > 0);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getManualEntityList();

    //get status class
    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
    //get status text
    vm.getFormStatus = (statusID) => BaseService.getWoStatus(statusID);
    vm.addManualEntity = () => {
      $state.go(CONFIGURATION.CONFIGURATION_MANUAL_ENTITY_STATE, { systemGenerated: '0' });
    };

    vm.goToManageDataField = (id) => {
      BaseService.goToCreateFormsElementManage(id);
      //$state.go(CONFIGURATION.CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE, { entityID: id, dataElementID: null });
    };


    vm.HideShowSideNav = () => {
      $mdSidenav('workorder-tree').open();
      // added for custom apply z-index
      const myEl = angular.element(document.querySelector('workorder-tree'));
      if (myEl.length > 0) {
        myEl.removeClass('workorder-tree-hide');
      }
      // added for custom apply z-index
      vm.isShowSideNav = true;
    };

    //Function to get response of sent notification of custom form status change
    const sendNotificationOfCustomFormStatus = (recData) => {
      if (recData.entityID === vm.selectedEntity.entityID) {
        const obj = {
          messageContent: recData.messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
          cnbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageAlertDialog(obj).then(() => {
          ///refresh page
          $state.reload();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.EventName.sendNotificationOfCustomFormStatus, sendNotificationOfCustomFormStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.EventName.sendNotificationOfCustomFormStatus, sendNotificationOfCustomFormStatus);
    }

    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });


    $scope.$on('$destroy', () => {
      refreshTree();
      getlatestDataOfTree();
      removeSocketListener();
    });
  }
})();

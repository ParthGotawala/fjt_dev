(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('viewContactPersonDet', viewContactPersonDet);

  /** @ngInject */
  function viewContactPersonDet() {
    var directive = {
      replace: true,
      restrict: 'E',
      scope: {
        paramContactPersonDet: '=',
        paramOtherDet: '=',
        paramContPersonActionBtnDet: '=',
        paramRadioBtnSelectedId: '=',
        paramAddUpdateContactCallbackFn: '&',
        paramSelectContactCallbackFn: '&',
        paramDeleteContPersonCallbackFn: '&',
        paramSetDefaultPersonCallbackFn: '&',
        paramSetPrimaryPersonCallbackFn: '&',
        paramRefreshContactPersonCallbackFn: '&',
        paramDuplicateContactPersonCallbackFn: '&',
        paramSelectContactPersonCallbackFn: '&'
      },
      templateUrl: 'app/directives/custom/view-contact-person-det/view-contact-person-det.html',
      controller: viewContactPersonDetCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of customer address and contact details
    *
    * @param
    */
    function viewContactPersonDetCtrl($scope, DialogFactory, CORE, USER, BaseService) {
      var vm = this;
      vm.contactPersonEmptyStateObj = angular.copy(USER.ADMIN_EMPTYSTATE.CONTACT_PERSON);
      vm.selectedRadioPerson = $scope.paramRadioBtnSelectedId;
      vm.LabelConstant = CORE.LabelConstant;
      vm.phoneCategoryOrder = _.map(CORE.PhoneMobileFaxCategory, (phoneObj) => phoneObj.key);
      vm.isDeleteContPersonFeatureBased = (($scope.paramOtherDet && $scope.paramOtherDet.isMaster) || (vm.selectedRadioPerson || vm.selectedRadioPerson === 0)) ? true : false;
      if (vm.isDeleteContPersonFeatureBased) {
        vm.isEnableDeleteContPersonFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteContactPerson);
      }
      if ($scope.paramContactPersonDet) {
        $scope.paramContactPersonDet.isActiveText = _.find(CORE.ActiveRadioGroup, (item) => item.Value === $scope.paramContactPersonDet.isActive).Key;
      }

      $scope.$watch('paramContactPersonDet', () => {
        convertPhoneStringToArray();
      });

      const convertPhoneStringToArray = () => {
        const phoneList = $scope.paramContactPersonDet && $scope.paramContactPersonDet.phoneList ? $scope.paramContactPersonDet.phoneList : null;
        if (phoneList) {
          vm.phoneList = _.map(phoneList.split(' | '), (phoeObj) => phoeObj.split(':'));
          vm.phoneList = _.sortBy(vm.phoneList, (item) => vm.phoneCategoryOrder.indexOf(item[0]));
        } else {
          vm.phoneList = [];
        }
      };

      // Open add/edit contact persopn popup
      vm.addEditContactPerson = (ev, contactPersonDet) => {
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
        if (BaseService.checkRightToAccessPopUp(popUpData)) {
          const data = {};
          data.personId = contactPersonDet ? contactPersonDet.personId : null;
          data.companyName = $scope.paramOtherDet.companyName || null;
          data.refTransID = parseInt($scope.paramOtherDet.refTransID);
          data.refTableName = $scope.paramOtherDet.refTableName;
          data.mfgType = $scope.paramOtherDet.mfgType;
          data.isFromMasterpage = true;//$scope.paramOtherDet.isMaster;
          DialogFactory.dialogService(
            USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
            USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (savedContactPersonDet) => {
              if (savedContactPersonDet) {
                $scope.paramContactPersonDet = savedContactPersonDet;
                convertPhoneStringToArray();
                if ($scope.paramContactPersonDet) {
                  $scope.paramContactPersonDet.isActiveText = _.find(CORE.ActiveRadioGroup, (item) => item.Value === $scope.paramContactPersonDet.isActive).Key;
                }
                if ($scope.paramOtherDet && $scope.paramOtherDet.showContPersonEmptyState) {
                  $scope.paramOtherDet.showContPersonEmptyState = false;
                  $scope.paramOtherDet.alreadySelectedPersonId = $scope.paramContactPersonDet.personId;
                }
              }
              $scope.paramAddUpdateContactCallbackFn() ? $scope.paramAddUpdateContactCallbackFn()(ev, savedContactPersonDet) : '';
            });
        }
      };

      // open select contact person  list
      vm.selectContactPerson = (ev) => {
        const data = {};
        data.companyName = $scope.paramOtherDet.companyName || null;
        data.refTransID = parseInt($scope.paramOtherDet.refTransID);
        data.refTableName = $scope.paramOtherDet.refTableName;
        data.alreadySelectedPersonId = $scope.paramOtherDet.alreadySelectedPersonId || null;
        data.selectedContactPerson = $scope.paramContactPersonDet || null;
        data.mfgType = $scope.paramOtherDet.mfgType || null;
        DialogFactory.dialogService(
          USER.ADMIN_SELECT_CONTACT_PERSON_CONTROLLER,
          USER.ADMIN_SELECT_CONTACT_PERSON_VIEW,
          ev,
          data).then(() => {
          }, (appliedContactPersonDet) => {
            if (appliedContactPersonDet) {
              $scope.paramContactPersonDet = appliedContactPersonDet;
              convertPhoneStringToArray();
            }
            $scope.paramSelectContactCallbackFn() ? $scope.paramSelectContactCallbackFn()(ev, appliedContactPersonDet, $scope.paramOtherDet.addressType) : '';
          });
      };
      vm.refreshContactPerson = (ev) => {
        $scope.paramRefreshContactPersonCallbackFn() ? $scope.paramRefreshContactPersonCallbackFn()(ev, $scope.paramOtherDet) : '';
      };
      // to delete customer address
      vm.deleteContactPerson = (ev) => {
        if (vm.isDeleteContPersonFeatureBased) {
          if (vm.isEnableDeleteContPersonFeature) {
            $scope.paramDeleteContPersonCallbackFn() ? $scope.paramDeleteContPersonCallbackFn()(ev, $scope.paramContactPersonDet) : '';
          }
        } else {
          $scope.paramDeleteContPersonCallbackFn() ? $scope.paramDeleteContPersonCallbackFn()(ev, $scope.paramContactPersonDet) : '';
        }
      };
      // to duplicate contact person
      vm.duplicateAddress = (ev) => {
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
        if (BaseService.checkRightToAccessPopUp(popUpData)) {
          const data = {
            personId: $scope.paramContactPersonDet ? $scope.paramContactPersonDet.personId : null,
            isFromListPage: false,
            isFromMasterpage: $scope.paramOtherDet.isMaster
          };
          DialogFactory.dialogService(
            USER.ADMIN_DUPLICATE_CONTACTPERSON_MODAL_CONTROLLER,
            USER.ADMIN_DUPLICATE_CONTACTPERSON_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (data) => {
              if (data && data.personId) {
                $scope.paramDuplicateContactPersonCallbackFn() ? $scope.paramDuplicateContactPersonCallbackFn()(ev, $scope.paramContactPersonDet) : '';
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      };
      vm.goToCustomerContactPersonList = () => {
        const custType = $scope.paramOtherDet && $scope.paramOtherDet.mfgType === CORE.MFG_TYPE.DIST ? CORE.CUSTOMER_TYPE.SUPPLIER : CORE.CUSTOMER_TYPE.CUSTOMER;
        BaseService.goToCustTypeContactPersonList(custType, $scope.paramOtherDet.customerId);
      };
      // to set customer Contact Person to default
      vm.setDefaultContactPerson = (ev) => {
        $scope.paramSetDefaultPersonCallbackFn() ? $scope.paramSetDefaultPersonCallbackFn()(ev, $scope.paramContactPersonDet) : '';
      };
      // to set customer Contact Person to Primary
      vm.setPrimaryContactPerson = (ev) => {
        $scope.paramSetPrimaryPersonCallbackFn() ? $scope.paramSetPrimaryPersonCallbackFn()(ev, $scope.paramContactPersonDet) : '';
      };
      vm.selectDefaultContactPerson = (ev) => {
        $scope.paramSelectContactPersonCallbackFn() ? $scope.paramSelectContactPersonCallbackFn()(ev, $scope.paramContactPersonDet) : '';
      };

      // added watch for radio button update
      $scope.$watch('paramRadioBtnSelectedId', () => vm.selectedRadioPerson = $scope.paramRadioBtnSelectedId);
    }
  }
})();

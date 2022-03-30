(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('primaryContactPersonsChip', primaryContactPersonsChip);

  /** @ngInject */
  function primaryContactPersonsChip() {
    var directive = {
      replace: true,
      restrict: 'E',
      scope: {
        paramContactPersonsDet: '=',
        paramOtherDet: '='
      },
      templateUrl: 'app/directives/custom/primary-contact-persons-chip/primary-contact-persons-chip.html',
      controller: primaryContactPersonsChipCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for Display Primary Contact person Data as Chip.
    *
    * @param
    */
    function primaryContactPersonsChipCtrl($scope, DialogFactory, CORE, USER, BaseService, ContactPersonFactory, $mdMenu, CustomerFactory) {
      var vm = this;
      vm.contactPersonIconClass = USER.ADMIN_EMPTYSTATE.CONTACT_PERSON.ICON_CLASS;
      vm.emptyState = angular.copy(CORE.EMPTYSTATE.PRIMARY_CONTACT_PERSON_DIRECTIVE);
      vm.emptyState.MESSAGE = stringFormat(vm.emptyState.MESSAGE, $scope.paramOtherDet ? $scope.paramOtherDet.pageName : '');
      vm.updatecontactPersonFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateContactPerson);
      vm.isDeleteFeatureEnable = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteContactPerson);

      /** Check for Display Empty State. **/
      const checkEmptyState = () => {
        vm.isShowEmptyState = !(_.some($scope.paramContactPersonsDet, (item) => item.isPrimary && item.isActive));
      };
      checkEmptyState();

      /** Open add/edit contact persopn popup. **/
      vm.addEditContactPerson = (ev, contactPersonDet) => {
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE], pageNameAccessLabel: CORE.PageName.ContactPerson };
        if (BaseService.checkRightToAccessPopUp(popUpData)) {
          const data = {
            companyName: $scope.paramOtherDet && $scope.paramOtherDet.companyName ? $scope.paramOtherDet.companyName : null,
            refTransID: $scope.paramOtherDet && $scope.paramOtherDet.refTransID ? $scope.paramOtherDet.refTransID : null,
            refTableName: $scope.paramOtherDet && $scope.paramOtherDet.refTableName ? $scope.paramOtherDet.refTableName : null,
            personId: (contactPersonDet ? contactPersonDet.personId : null),
            isAddOnlyPrimaryPerson: true,
            isFromMasterpage: true,
            mfgType: $scope.paramOtherDet && $scope.paramOtherDet.mfgType ? $scope.paramOtherDet.mfgType : null
          };
          if (contactPersonDet && !contactPersonDet.personId) {
            data.contactPersonData = contactPersonDet;
          }

          DialogFactory.dialogService(
            USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
            USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (addedContPersonDet) => {
              if (addedContPersonDet) {
                if (checkDuplicateEntry(addedContPersonDet)) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY_WITHOUT_PARAMETER);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };

                  DialogFactory.messageAlertDialog(model).then(() => { // Empty Block.
                  }).catch((error) => BaseService.getErrorLog(error));
                } else {
                  if (addedContPersonDet && addedContPersonDet.personId) {
                    const updatedContPerson = _.find($scope.paramContactPersonsDet, (item) => item.personId === addedContPersonDet.personId);
                    if (updatedContPerson) {
                      updatedContPerson.personFullName = addedContPersonDet.personFullName;
                    }
                    vm.refreshPrimaryContPerson();
                  }
                  else if (addedContPersonDet && !addedContPersonDet.personId) {
                    setFormDirty();
                    const foundIsDefault = _.find($scope.paramContactPersonsDet, (item) => (item.isDefault && !item.personId));
                    if (foundIsDefault) {
                      // Manage validation can set only one Contact person as 'isDeafult'.
                      foundIsDefault.isDefault = false;
                    }
                    if (addedContPersonDet.tempPersonId) {
                      // update case in local OBJ.
                      const index = _.findIndex($scope.paramContactPersonsDet, { tempPersonId: addedContPersonDet.tempPersonId });
                      $scope.paramContactPersonsDet.splice(index, 1, addedContPersonDet);
                    } else {
                      // Add case
                      if (!addedContPersonDet.refTableName) {
                        addedContPersonDet.refTableName = $scope.paramOtherDet && $scope.paramOtherDet.refTableName ? $scope.paramOtherDet.refTableName : null;
                      }
                      const maxTempPersonId = _.max($scope.paramContactPersonsDet.map((item) => item.tempPersonId));
                      addedContPersonDet.tempPersonId = maxTempPersonId ? (maxTempPersonId + 1) : 1;
                      $scope.paramContactPersonsDet.push(addedContPersonDet);
                      checkEmptyState();
                    }
                  }
                }
              }
            });
        }
      };

      /** Check Duplicate Entry. **/
      const checkDuplicateEntry = (contPerson) => {
        const foundDuplicate = _.some($scope.paramContactPersonsDet, (item) => (
          ((item.tempPersonId || null) !== (contPerson.tempPersonId || null)) &&
          (item.firstName === contPerson.firstName) &&
          (item.lastName === contPerson.lastName) &&
          ((item.middleName || null) === (contPerson.middleName || null)
          )));
        return foundDuplicate;
      };

      /** Remove Contact Person From "paramContactPersonsDet" Scope Object by Contact Person Id. **/
      const removeContPersonByIdFromList = (id, isTempId) => {
        const itemIndex = $scope.paramContactPersonsDet.findIndex((item) => item[isTempId ? 'tempPersonId' : 'personId'] === id);
        if (itemIndex !== -1) {
          $scope.paramContactPersonsDet.splice(itemIndex, 1);
          checkEmptyState();
        }
      };

      /** Remove Contact Person From Primary Contact Person. **/
      vm.removeFromPrimary = (contPerson) => {
        if (contPerson) {
          let messageContent = {};
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.REMOVE_FROM_PRIMARY);
          messageContent.message = stringFormat(messageContent.message, contPerson.personFullName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (contPerson.personId && vm.updatecontactPersonFeature) {
              const personIds = [contPerson.personId];
              vm.cgBusyLoading = ContactPersonFactory.managePrimaryContactPersons().query({
                personIds: personIds,
                refTransID: $scope.paramOtherDet.refTransID || null,
                refTableName: $scope.paramOtherDet.refTableName || null,
                isPrimary: false
              }).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  removeContPersonByIdFromList(contPerson.personId, false);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (!contPerson.personId && contPerson.tempPersonId) {
              removeContPersonByIdFromList(contPerson.tempPersonId, true);
            }
          }, () => { // Empty Block.
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
      };

      /** Remove All Contact Person From Primary Contact Person. **/
      vm.removeAllFromPrimary = () => {
        let messageContent = {};
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.REMOVE_FROM_PRIMARY);
        messageContent.message = stringFormat(messageContent.message, 'All');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          const personIds = _.map($scope.paramContactPersonsDet, (item) => item.isPrimary ? item.personId : null).filter((personId) => personId);
          if (personIds && personIds.length > 0 && $scope.paramOtherDet.refTransID) {
            vm.cgBusyLoading = ContactPersonFactory.managePrimaryContactPersons().query({
              personIds: personIds,
              refTransID: $scope.paramOtherDet.refTransID || null,
              refTableName: $scope.paramOtherDet.refTableName || null,
              isPrimary: false
            }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                $scope.paramContactPersonsDet = [];
                checkEmptyState();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            $scope.paramContactPersonsDet = [];
            checkEmptyState();
          }
        }, () => { // Empty Block.
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };

      /** Delete Contact Person. **/
      vm.deleteContPerson = (contPerson) => {
        if (contPerson && contPerson.personId && vm.isDeleteFeatureEnable) {
          const selectedIDs = [contPerson.personId];
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE_DET);
          messageContent.message = stringFormat(messageContent.message, CORE.PageName.ContactPerson);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          $mdMenu.hide();
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = ContactPersonFactory.deleteCustomerContactPerson().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                    const data = {
                      TotalCount: res.data.transactionDetails[0].TotalCount,
                      pageName: CORE.PageName.ContactPerson
                    };
                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                      const IDs = {
                        id: selectedIDs,
                        CountList: true
                      };
                      return ContactPersonFactory.deleteCustomerContactPerson().query({
                        objIDs: IDs
                      }).$promise.then((res) => {
                        let data = {};
                        data = res.data;
                        data.pageTitle = contPerson ? contPerson.personFullName : null;
                        data.PageName = CORE.PageName.ContactPerson;
                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' selected');
                        if (res.data) {
                          DialogFactory.dialogService(
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                            ev,
                            data).then(() => {
                            }, () => {
                            }).catch((error) => BaseService.getErrorLog(error));
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    });
                  } else {
                    removeContPersonByIdFromList(contPerson.personId, false);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /** Refresh Primary Contact person List. **/
      vm.refreshPrimaryContPerson = (isResetList) => {
        if ($scope.paramOtherDet.refTransID && $scope.paramOtherDet.refTableName) {
          const contPersonData = {
            refTransID: $scope.paramOtherDet.refTransID,
            refTableName: $scope.paramOtherDet.refTableName
          };
          vm.cgBusyLoading = CustomerFactory.getCustomerContactPersons().query(contPersonData).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
              if (isResetList) {
                $scope.paramContactPersonsDet = res.data;
                checkEmptyState();
              } else {
                _.each(res.data, (item) => {
                  const contPerson = _.find($scope.paramContactPersonsDet, (contPerson) => contPerson.personId === item.personId);
                  if (contPerson && ((contPerson.isPrimary !== item.isPrimary) || (contPerson.isActive !== item.isActive))) {
                    // Update Contact person Data.
                    const index = _.findIndex($scope.paramContactPersonsDet, { personId: contPerson.personId });
                    $scope.paramContactPersonsDet.splice(index, 1, item);
                  }
                  else if (!contPerson) {
                    // Add new Added Contact person Data.
                    $scope.paramContactPersonsDet.push(item);
                  }
                });
                // Remove Deleted Record.
                $scope.paramContactPersonsDet = _.filter($scope.paramContactPersonsDet, (contPerson) => (!contPerson.personId || (_.some(res.data, (el) => el.personId === contPerson.personId))));
                checkEmptyState();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (isResetList) {
            $scope.paramContactPersonsDet = [];
            checkEmptyState();
          }
        }
      };

      /** Make Form Dirty. **/
      const setFormDirty = () => {
        $scope.paramOtherDet.isChange = true;
        const isChangeControl = _.find(vm.primaryPersonForm.$$controls, (ctrl) => ctrl.$name === 'isChange');
        isChangeControl.$setDirty();
      };

      /** Catch Event Of Reset Primary Contact person List. **/
      const refreshPrimaryContPerson = $scope.$on('refreshPrimaryContPerson', () => {
        $scope.paramOtherDet.isChange = false;
        vm.refreshPrimaryContPerson(true);
      });

      /** Go to contact tab. **/
      vm.goToCustomerContactPersonList = () => {
        if ($scope.paramOtherDet && $scope.paramOtherDet.contactRedirectionFn) {
          $scope.paramOtherDet.contactRedirectionFn();
        }
      };

      /** Destroy Event. **/
      $scope.$on('$destroy', () => {
        refreshPrimaryContPerson();
      });
    }
  }
})();

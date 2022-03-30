(function () {
  'use strict';

  angular
    .module('app.operation.masterTemplate')
    .controller('UpdateOperationTemplateController', UpdateOperationTemplateController);

  /** @ngInject */
  function UpdateOperationTemplateController($scope, $timeout, $state, $filter, $stateParams, OPERATION,
    OperationFactory, uiSortableMultiSelectionMethods, $q, CORE, BaseService, USER, DialogFactory, $mdMenu) {
    const vm = this;
    vm.templateID = $stateParams.id;
    let _operationAddedList = [];
    let _operationNoAddedList = [];
    let _Oplist = [];
    vm.SearchAddedListOperation = null;
    vm.SearchNoAddedListOperation = null;
    vm.EmptyMesssage = OPERATION.OPERATION_EMPTYSTATE.ASSIGNOPERATIONS;
    vm.operationTemplateIcon = OPERATION.OPRATION_TEMPLATE_ICON;
    vm.isClearCloseicon = true;
    vm.isHideSearchButton = false;
    vm.isClearCloseiconadded = true;
    vm.isHideSearchButtonadded = false;
    vm.opMgtTemplateStatus = CORE.GenericDraftPublishStatus;
    const displayStatusConst = CORE.DisplayStatus;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let oldMasterTemplateCode = '';
    let oldMasterTemplateForHistory = '';
    vm.mastertemplate = {};
    vm.opMgtNoteForNewRecord = OPERATION.OP_MGT_NOTE_FOR_NEW_RECORD;
    vm.CORE_OPSTATUS = CORE.OPSTATUS;
    vm.LabelConstantOperaion = CORE.LabelConstant.Operation;
    vm.historyactionButtonName = `${CORE.PageName.operation_management} History`;
    //vm.isMTODragDropAnyChangesToSave = false;

    vm.goBack = () => {
      $state.go(OPERATION.OPERATION_MASTER_TEMPLATE_STATE);
    };
    vm.EmptyMesssageOperation = OPERATION.OPERATION_EMPTYSTATE.OPERATION;
    vm.isContainMasterOperation = false;

    vm.materTemplateDetails = (id) => {
      vm.cgBusyLoading = OperationFactory.retrieveOperationMasterTemplate().query({ id: id }).$promise.then((res) => {
        if (res.data && res.data.mastertemplate) {
          vm.mastertemplate = res.data.mastertemplate;
          oldMasterTemplateForHistory = vm.oldMasterTemplate = vm.mastertemplate.masterTemplate;
          vm.oldDescription = vm.mastertemplate.description;
          setTemplateStatusText(vm.mastertemplate.masterTemplateStatus);
          vm.isTemplateInPublishMode = vm.mastertemplate.masterTemplateStatus === displayStatusConst.Published.ID;
          _Oplist = _.orderBy(res.data.operationList, 'opNumber');
          setCommonDetAfterGettingOpTempDet(_Oplist);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // set common details after getting operation template data (for both - add/update case)
    const setCommonDetAfterGettingOpTempDet = (_Oplist) => {
      _operationAddedList = vm.operationAddedList = [];
      _operationNoAddedList = vm.operationNoAddedList = [];

      _.each(_Oplist, (itemData) => {
        itemData.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, itemData.opName, itemData.opNumber);
        if (vm.templateID) {
          if (itemData.operationMasterTemplates.length > 0) {
            const _obj = _.find(itemData.operationMasterTemplates, (o) => o.masterTemplateId == vm.templateID);
            if (_obj) {
              vm.operationAddedList.push(itemData);
            }
            else {
              vm.operationNoAddedList.push(itemData);
            }
          }
          else {
            vm.operationNoAddedList.push(itemData);
          }
        }
        else {
          vm.operationNoAddedList.push(itemData);
        }
      });
      vm.operationNoAddedList = _.filter(vm.operationNoAddedList, (operation) => operation.opStatus === vm.CORE_OPSTATUS.PUBLISHED);
      _operationAddedList = angular.copy(vm.operationAddedList);
      _operationNoAddedList = angular.copy(vm.operationNoAddedList);

      if (_operationNoAddedList.length === 0 && _operationAddedList.length === 0) {
        vm.isContainMasterOperation = false;
      }
      else {
        vm.isContainMasterOperation = true;
      }
      setSelectableListItem();
    };

    // Getting all Operation list at add template time to display in draf drop list
    function getAllOperationDetail() {
      vm.cgBusyLoading = OperationFactory.getAllPublishedOpMasterList().save().$promise.then((response) => {
        if (response && response.data) {
          _Oplist = _.orderBy(response.data, 'opNumber');
          setCommonDetAfterGettingOpTempDet(_Oplist);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const pageInit = () => {
      if (vm.templateID) {
        vm.materTemplateDetails(vm.templateID);
      }
      else {
        vm.mastertemplate = {
          masterTemplateStatus: CORE.OPSTATUS.DRAFT
        };
        setTemplateStatusText(CORE.OPSTATUS.DRAFT);
        vm.isTemplateInPublishMode = false;
        getAllOperationDetail();
      }
    };
    pageInit();

    const selectOperationManagementTemplate = (item) => {
      if (item) {
        $state.go(OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_STATE, { id: item.id });
        $timeout(() => {
          vm.autoCompleteOpManagementTemplate.keyColumnId = null;
        }, true);
      }
    };

    const getOpManagementTemplateSearch = (searchObj) => OperationFactory.getMasterTemplateList().query(searchObj).$promise.then((op) => {
      if (op) {
        return op.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /*Auto-complete for Search Operation template */
    vm.autoCompleteOpManagementTemplate = {
      columnName: 'masterTemplate',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Master Template',
      placeholderName: 'Master Template',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectOperationManagementTemplate,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query
        };
        return getOpManagementTemplateSearch(searchobj);
      }
    };

    vm.setHeight = () => {
      $timeout(() => {
        //let ControlBox = document.getElementById("permission1");
        //ControlBox.setAttribute("style", "max-height:" + (window.innerHeight - ControlBox.offsetTop - 80) + "px");
        const divs = document.getElementsByClassName('permissions');
        _.each(divs, (element) => {
          element.setAttribute('style', 'max-height:' + (window.innerHeight - element.offsetTop - 80) + 'px');
        });
      }, 0);
    };
    vm.setHeight();

    const saveOperationsOfMasterTemplate = (newListToSave) => {
      vm.SearchAddedListOperation = null;
      vm.SearchNoAddedListOperation = null;
      //vm.operationAddedList = _operationAddedList;
      //vm.operationNoAddedList = _operationNoAddedList;
      const saveObj = [];

      _.each(newListToSave, (item) => {
        if (vm.templateID) {
          const _object = {};
          _object.masterTemplateId = vm.templateID,
            _object.operationId = item.opID,
            saveObj.push(_object);
        }
      });
      const listObj = {
        masterTemplateId: vm.templateID,
        operationList: saveObj
      };

      return OperationFactory.createOperation_MasterTemplateList().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
    };

    const deleteOperationsOfMasterTemplate = (listToDelete) => OperationFactory.deleteOperation_MasterTemplateList().delete({
      masterTemplateId: vm.templateID,
      operationIds: _.map(listToDelete, (obj) => obj.opID)
    }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));


    $scope.selectedOperationListNoAdded = [];
    $scope.selectedOperationListAdded = [];
    //#region sortable option common for all list
    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: function (e, ui) {
      },
      sort: function (e, ui) {
      },
      stop: function (e, ui) {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded !== DestinationDivAdded) {
            if (SourceDivAdded === false && DestinationDivAdded === true) {
              if ($scope.selectedOperationListNoAdded.length === 0) {
                $scope.selectedOperationListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Add');
              return;
            }
            else if (SourceDivAdded === true && DestinationDivAdded === false) {
              if ($scope.selectedOperationListAdded.length === 0) {
                $scope.selectedOperationListAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Remove');
              return;
            }
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region reset value of selected element
    const ResetSelectedOperation = () => {
      $scope.selectedOperationListNoAdded = [];
      $scope.selectedOperationListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    };
    //#endregion

    //#region check for selected operation
    const checkSelectAllFlag = () => {
      $scope.selectAnyNoAdded = $scope.selectedOperationListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedOperationListAdded.length > 0 ? true : false;
    };
    //#endregion

    //#region unselect all operation list
    const UnSelectAllOperation = () => {
      angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#operationAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedOperation();
    };
    //#endregion

    //#region unselect single operation list
    const UnSelectOperation = (unSelectFrom) => {
      if (unSelectFrom === 'NoAdded') {
        angular.element('[ui-sortable]#operationNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#operationAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedOperation();
    };
    //#endregion

    //#region  set item selectable
    const SetOperationSelectable = () => {
      angular.element('[ui-sortable]#operationAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectOperation('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedOperationListAdded = _.map(selectedItemIndexes, (i) => vm.operationAddedList[i]);
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#operationNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectOperation('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedOperationListNoAdded = _.map(selectedItemIndexes, (i) => vm.operationNoAddedList[i]);
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
    };

    const setSelectableListItem = () => {
      $timeout(() => {
        SetOperationSelectable();
      }, _configSelectListTimeout);
    };
    //#endregion

    //#region for destroy selection
    const DestroyOperationSelection = () => {
      angular.element('[ui-sortable]#operationNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#operationAddedList').off('ui-sortable-selectionschanged');
    };

    const DestroyAllSelection = () => {
      DestroyOperationSelection();
    };
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', () => {
      DestroyAllSelection();
    });
    //#endregion

    vm.SearchOperation = (list, searchText, IsAdded) => {
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListOperation = null;
          vm.isClearCloseiconadded = true;
          vm.isHideSearchButtonadded = false;
          vm.operationAddedList = _operationAddedList;
          vm.FilterOperationAdded = true;
        } else {
          vm.SearchNoAddedListOperation = null;
          vm.isClearCloseicon = true;
          vm.isHideSearchButton = false;
          vm.operationNoAddedList = _operationNoAddedList;
          vm.FilterOperationNotAdded = true;
        }
        return;
      }
      else {
        if (IsAdded) {
          vm.isClearCloseiconadded = false;
          vm.isHideSearchButtonadded = true;
        }
        else {
          vm.isClearCloseicon = false;
          vm.isHideSearchButton = true;
        }
      }
      if (IsAdded) {
        vm.operationAddedList = $filter('filter')(_operationAddedList, { opName: searchText });
        vm.FilterOperationAdded = vm.operationAddedList.length > 0;
      }
      else {
        vm.operationNoAddedList = $filter('filter')(_operationNoAddedList, { opName: searchText });
        vm.FilterOperationNotAdded = vm.operationNoAddedList.length > 0;
      }
    };

    vm.refreshData = () => {
      if (vm.templateID) {
        vm.materTemplateDetails(vm.templateID);
      }
      else {
        getAllOperationDetail();
      }
    };

    vm.addData = () => {
      BaseService.openInNew(OPERATION.OPERATION_MANAGE_DETAILS_STATE);
    };
    //#region modify operation Added based on selection from both list
    vm.ModifyPageAdded = (addType) => {
      if (vm.isTemplateInPublishMode) {
        vm.refreshData();
        return;
      }
      if (addType === 'Add') {
        const promises = [saveOperationsOfMasterTemplate($scope.selectedOperationListNoAdded)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each($scope.selectedOperationListNoAdded, (item) => {
              const added = _.find(_operationAddedList, (element) => item.opID === element.opID);
              if (!added) {
                _operationAddedList.push(item);
              }
            });
            _.each($scope.selectedOperationListNoAdded, (item) => {
              _operationNoAddedList = _.without(_operationNoAddedList,
                _.find(_operationNoAddedList, (valItem) => valItem.opID === item.opID)
              );
            });
            _operationAddedList = _.orderBy(_operationAddedList, 'opNumber');

            UnSelectAllOperation();
            setOperationOfMasterTemplateDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'Remove') {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.OPERATION_TEMPLATE_DELETE_MAPPING);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const promises = [deleteOperationsOfMasterTemplate($scope.selectedOperationListAdded)];
            vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedOperationListAdded, (item) => {
                  const added = _.find(_operationNoAddedList, (element) => item.opID === element.opID);
                  if (!added && item.opStatus === vm.CORE_OPSTATUS.PUBLISHED) {
                    _operationNoAddedList.push(item);
                  }
                });
                _.each($scope.selectedOperationListAdded, (item) => {
                  _operationAddedList = _.without(_operationAddedList,
                    _.find(_operationAddedList, (valItem) => valItem.opID === item.opID)
                  );
                });
                _operationNoAddedList = _.orderBy(_operationNoAddedList, 'opNumber');
                UnSelectAllOperation();
                setOperationOfMasterTemplateDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // Empty block
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'AddAll') {
        const promises = [saveOperationsOfMasterTemplate(vm.operationNoAddedList)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each(vm.operationNoAddedList, (item) => {
              const added = _.find(_operationAddedList, (element) => item.opID === element.opID);
              if (!added) {
                _operationAddedList.push(item);
              }
            });
            _.each(_operationAddedList, (item) => {
              _operationNoAddedList = _.without(_operationNoAddedList,
                _.find(_operationNoAddedList, (valItem) => valItem.opID === item.opID)
              );
            });
            _operationAddedList = _.orderBy(_operationAddedList, 'opNumber');
            UnSelectAllOperation();
            setOperationOfMasterTemplateDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'RemoveAll') {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.OPERATION_TEMPLATE_DELETE_MAPPING);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const promises = [deleteOperationsOfMasterTemplate(vm.operationAddedList)];
            vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _operationAddedList = vm.operationAddedList = _.filter(vm.operationAddedList, (item) => item.opStatus === vm.CORE_OPSTATUS.PUBLISHED);
                _.each(vm.operationAddedList, (item) => {
                  const added = _.find(_operationNoAddedList, (element) => item.opID === element.opID);
                  if (!added) {
                    _operationNoAddedList.push(item);
                  }
                });
                _.each(_operationNoAddedList, (item) => {
                  _operationAddedList = _.without(_operationAddedList,
                    _.find(_operationAddedList, (valItem) => valItem.opID === item.opID)
                  );
                });
                _operationNoAddedList = _.orderBy(_operationNoAddedList, 'opNumber');
                UnSelectAllOperation();
                setOperationOfMasterTemplateDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // Empty block
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //#endregion

    const setOperationOfMasterTemplateDragDropDetails = () => {
      vm.SearchAddedListOperation = null;
      vm.SearchNoAddedListOperation = null;
      vm.operationAddedList = _operationAddedList;
      vm.operationNoAddedList = _operationNoAddedList;
      vm.FilterOperationAdded = vm.operationAddedList.length > 0;
      vm.FilterOperationNotAdded = vm.operationNoAddedList.length > 0;
    };

    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    /* to update operation master template status */
    vm.changeOpMgtTemplateStatus = (statusID, oldStatusID) => {
      if (statusID !== oldStatusID) {
        if (vm.masterTemplateForm.$invalid) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.FILL_DET_BEFORE_STATUS_CHANGE);
          messageContent.message = stringFormat(messageContent.message, 'operation management');
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);
        }
        else if (!vm.isTemplateInPublishMode && vm.operationAddedList.length === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_OP_TO_CHANGE_TEMPLATE_STATUS);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, vm.getOpMgtTemplateStatus(oldStatusID), vm.getOpMgtTemplateStatus(statusID));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (!vm.mastertemplate.isMasterTemplate) {
                vm.cgBusyLoading = OperationFactory.saveMasterTemplateStatus().save({
                  masterTemplateID: vm.templateID, // master id
                  masterTemplateStatus: statusID
                }).$promise.then((resp) => {
                  if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    vm.refreshData();
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }, () => { // Empty block
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* set master template status label to display in ui */
    function setTemplateStatusText(statusID) {
      if (statusID === 0) {
        vm.masterTemplateStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
      }
      else if (statusID === 1) {
        vm.masterTemplateStatusLabel = CORE.OPSTATUSLABLEDRAFT;
      }
      else {
        vm.masterTemplateStatusLabel = '';
      }
    }

    //get operation master template status text by status id
    vm.getOpMgtTemplateStatus = (statusID) => BaseService.getGenericDraftPublishStatus(statusID);

    // Get operation status classname by status value.
    vm.getOpStatusClassName = (statusID) => BaseService.getOpStatusClassName(statusID);

    /* to move at operation update page */
    vm.goToManageOperation = (operationID) => {
      BaseService.goToManageOperation(operationID);
    };

    //save master template details to database
    vm.saveMasterTemplateDetails = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.masterTemplateForm)) {
        vm.saveDisable = false;
        return;
      }

      const masterTemplateInfo = {
        id: vm.mastertemplate.id,
        masterTemplate: vm.mastertemplate.masterTemplate,
        description: vm.mastertemplate.description,
        isMasterTemplate: false
      };
      if (vm.mastertemplate.id) {
        vm.cgBusyLoading = OperationFactory.mastertemplate().update({
          id: vm.mastertemplate.id
        }, masterTemplateInfo).$promise.then((mastertemplate) => {
          if (mastertemplate.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.masterTemplateForm.$setPristine();
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.cgBusyLoading = OperationFactory.mastertemplate().save(masterTemplateInfo).$promise.then((respOfMasterTemplate) => {
          if (respOfMasterTemplate.status === CORE.ApiResponseTypeStatus.SUCCESS && respOfMasterTemplate.data) {
            vm.templateID = respOfMasterTemplate.data.id;
            $state.transitionTo($state.$current, { id: vm.templateID }, { location: true, inherit: true, notify: false });
            vm.masterTemplateForm.$setPristine();
            pageInit();
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    vm.checkDublicateMasterTemplate = () => {
      if (vm.mastertemplate && vm.mastertemplate.masterTemplate) {
        if (oldMasterTemplateCode !== vm.mastertemplate.masterTemplate) {
          if (vm.masterTemplateForm && vm.masterTemplateForm.masterTemplate.$dirty && vm.mastertemplate.masterTemplate) {
            vm.cgBusyLoading = OperationFactory.checkDublicateMasterTemplate().query({
              id: vm.mastertemplate.id,
              masterTemplate: vm.mastertemplate.masterTemplate
            }).$promise.then((res) => {
              vm.cgBusyLoading = false;
              oldMasterTemplateCode = angular.copy(vm.mastertemplate.masterTemplate);
              if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateMasterTemplate) {
                displayMasterTemplateUniqueMessage();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }
    };

    /* display standard code unique confirmation message */
    const displayMasterTemplateUniqueMessage = () => {
      oldMasterTemplateCode = '';
      vm.mastertemplate.masterTemplate = null;
      const masterTemplateEle = angular.element(document.querySelector('#masterTemplate'));
      masterTemplateEle.focus();

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, 'Template');
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocus('masterTemplate');
      }, () => { // empty
      });
    };

    // Duplicate Operation Management.
    vm.duplicateOperationManagement = () => {
      var data = {
        isCopy: true,
        isMasterTemplate: false,
        masterTemplate: vm.oldMasterTemplate,
        description: vm.oldDescription,
        id: vm.templateID
      };

      DialogFactory.dialogService(
        OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_CONTROLLER,
        OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_VIEW,
        null,
        data).then(() => { // empty block
        }, () => { // empty block
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.addOperationManagement = (data, openINSameTab) => {
      BaseService.goToManageOperationManagement(data ? data.id : null, openINSameTab);
    };

    /* open menu of delete Operation template. */
    vm.openMenu = function ($mdMenu, ev) {
      $mdMenu.open(ev);
    };

    /* delete Operation template */
    vm.deleteRecord = () => {
      if (!vm.templateID) {
        return;
      }
      const selectedIDs = [vm.templateID];
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE_DET);
      messageContent.message = stringFormat(messageContent.message, 'Operation Management');
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
          vm.cgBusyLoading = OperationFactory.deleteMasterTemplate().query({ objIDs: objIDs }).$promise.then((res) => {
            if (res) {
              if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                const data = {
                  TotalCount: res.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.operation_management
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return OperationFactory.deleteMasterTemplate().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = oldMasterTemplateForHistory;
                    data.PageName = CORE.PageName.operation_management;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.currentPageForms = [];
                vm.goToOperationMasterTemplateList(true);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Show Description*/
    vm.showDescription = (operation, ev) => {
      const obj = {
        title: 'Operation',
        description: operation.shortDescription,
        name: operation.opName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show History Popup */
    vm.openOperationManagementHistory = (ev) => {
      const data = {
        id: vm.templateID,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.MASTER_TEMPLATES,
        EmptyMesssage: stringFormat(CORE.COMMON_HISTORY.MESSAGE, `${CORE.PageName.operation_management} history`),
        headerData: [{
          label: CORE.PageName.operation_management,
          value: oldMasterTemplateForHistory,
          displayOrder: 1,
          labelLinkFn: vm.goToOperationMasterTemplateList,
          valueLinkFn: vm.goToManageOperationManagement,
          valueLinkFnParams: vm.templateID
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Go To manage operation page. */
    vm.goToManageOperationManagement = (id) => BaseService.goToManageOperationManagement(id);
    /* Goto Operation Template list page. */
    vm.goToOperationMasterTemplateList = (openInSameTab) => BaseService.goToOperationMasterTemplateList(openInSameTab);

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.masterTemplateForm);
    });
  }
})();

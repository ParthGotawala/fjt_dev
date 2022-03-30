(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationTemplates', operationTemplates);

  /** @ngInject */
  function operationTemplates(OperationFactory, BaseService, $timeout, uiSortableMultiSelectionMethods, $q, CORE, OPERATION, DialogFactory,
    $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationId: '='
      },
      templateUrl: 'app/directives/custom/operation-templates/operation-templates.html',
      controller: operationTemplatesCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationTemplatesCtrl($scope) {
      var vm = this;

      vm.EmptyMesssageForOpTemplate = OPERATION.OPERATION_EMPTYSTATE.ASSIGN_TEMPLATE;

      const operationId = $scope.operationId ? parseInt($scope.operationId) : null;

      vm.isContainMasterTemplate = false;

      let _TemplateAddedList = [];
      let _TemplateNoAddedList = [];
      vm.SearchAddedListTemplate = null;
      vm.SearchNoAddedListTemplate = null;

      $scope.selectedTemplateListNoAdded = [];
      $scope.selectedTemplateListAdded = [];

      //#region reset value of selected template
      const ResetSelectedTemplate = () => {
        $scope.selectedTemplateListNoAdded = [];
        $scope.selectedTemplateListAdded = [];
        $scope.selectAnyNoAddedTemplate = false;
        $scope.selectAnyAddedTemplate = false;
      };
    //#endregion

      //#region unselect all template list
      const UnSelectAllTemplate = () => {
        angular.element('[ui-sortable]#templateNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#templateAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedTemplate();
      };
    //#endregion

      //#region check for selected template
      const checkSelectAllFlagTemplate = () => {
        $scope.selectAnyNoAddedTemplate = $scope.selectedTemplateListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedTemplate = $scope.selectedTemplateListAdded.length > 0 ? true : false;
      };
    //#endregion

      //Get list of templates
      vm.templateAllocationDetails = (isTemplateTabClick) => {
        if (isTemplateTabClick) {
          UnSelectAllTemplate();
        }

        vm.SearchAddedListTemplate = null;
        vm.SearchNoAddedListTemplate = null;

        vm.cgBusyLoading = OperationFactory.retrievetemplateOperationDetails().query().$promise.then((res) => {
          if (res && res.data) {
            _TemplateAddedList = vm.TemplateAddedList = [];
            _TemplateNoAddedList = vm.TemplateNoAddedList = [];
            _.each(res.data, (itemData) => {
              if (operationId) {
                const AddedList = _.filter(itemData.operationMasterTemplates, (data) => data.operationId === operationId);
                if (AddedList.length > 0) {
                  vm.TemplateAddedList.push(itemData);
                }
                else {
                  vm.TemplateNoAddedList.push(itemData);
                }
              }
            });
            _TemplateAddedList = angular.copy(vm.TemplateAddedList);
            _TemplateNoAddedList = angular.copy(vm.TemplateNoAddedList);
            if (_TemplateAddedList.length === 0 && _TemplateNoAddedList.length === 0) {
              vm.isContainMasterTemplate = false;
            }
            else {
              vm.isContainMasterTemplate = true;
            }
            setSelectableListItemTemplate();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //set class for item to be selectable
      const setSelectableListItemTemplate = () => {
        $timeout(() => {
          SetTemplateSelectable();
        }, _configSelectListTimeout);
      };

      //#region  set item selectable
      const SetTemplateSelectable = () => {
        angular.element('[ui-sortable]#templateAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectTemplate('NoAdded');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedTemplateListAdded = _.map(selectedItemIndexes, (i) => vm.TemplateAddedList[i]);
          checkSelectAllFlagTemplate();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#templateNoAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectTemplate('Added');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedTemplateListNoAdded = _.map(selectedItemIndexes, (i) => vm.TemplateNoAddedList[i]);
          checkSelectAllFlagTemplate();
          $scope.$applyAsync();
        });
      };

      //#region unselect single template list
      const UnSelectTemplate = (unSelectFrom) => {
        if (unSelectFrom === 'NoAdded') {
          angular.element('[ui-sortable]#templateNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#templateAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedTemplate();
      };
    //#endregion

      //#region sortable option common for all list
      $scope.sortableOptionsTemplate = uiSortableMultiSelectionMethods.extendOptions({
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
            const dropTarget = ui.item.sortable.droptarget[0]; // get drop target template
            const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded !== DestinationDivAdded) {
              if (SourceDivAdded === false && DestinationDivAdded === true) {
                if ($scope.selectedTemplateListNoAdded.length === 0) {
                  $scope.selectedTemplateListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedTemplate('Add');
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                if ($scope.selectedTemplateListAdded.length === 0) {
                  $scope.selectedTemplateListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedTemplate('Remove');
                return;
              }
            }
          }
        },
        connectWith: '.items-container'
      });
    //#endregion

      //#region modify data op template Added based on selection from both list
      vm.ModifyPageAddedTemplate = (addType) => {
        if (addType === 'Remove' || addType === 'RemoveAll') {
          confirmOpTemplateDeleteDragDrop(addType);
        }
        else {
          checkAndUpdateModifiedOpTemplateDragDrop(addType);
        }
      };

      // check add/remove op template from drag drop
      const checkAndUpdateModifiedOpTemplateDragDrop = (addType) => {
        if (addType === 'Add') {
          const promises = [saveOperationsOfMasterTemplate($scope.selectedTemplateListNoAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedTemplateListNoAdded, (item) => {
                  const added = _.find(_TemplateAddedList, (template) => item.id === template.id);
                  if (!added) {
                    _TemplateAddedList.push(item);
                  }
                });
                _.each($scope.selectedTemplateListNoAdded, (item) => {
                  _TemplateNoAddedList = _.without(_TemplateNoAddedList,
                    _.find(_TemplateNoAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllTemplate();
                setOperationTemplateDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'Remove') {
          const promises = [deleteOperationsOfMasterTemplate($scope.selectedTemplateListAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedTemplateListAdded, (item) => {
                  const added = _.find(_TemplateNoAddedList, (template) => item.id === template.id);
                  if (!added) {
                    _TemplateNoAddedList.push(item);
                  }
                });
                _.each($scope.selectedTemplateListAdded, (item) => {
                  _TemplateAddedList = _.without(_TemplateAddedList,
                    _.find(_TemplateAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllTemplate();
                setOperationTemplateDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'AddAll') {
          const promises = [saveOperationsOfMasterTemplate(vm.TemplateNoAddedList)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(vm.TemplateNoAddedList, (item) => {
                  const added = _.find(_TemplateAddedList, (template) => item.id === template.id);
                  if (!added) {
                    _TemplateAddedList.push(item);
                  }
                });
                _.each(_TemplateAddedList, (item) => {
                  _TemplateNoAddedList = _.without(_TemplateNoAddedList,
                    _.find(_TemplateNoAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllTemplate();
                setOperationTemplateDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'RemoveAll') {
          const promises = [deleteOperationsOfMasterTemplate(vm.TemplateAddedList)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(vm.TemplateAddedList, (item) => {
                  const added = _.find(_TemplateNoAddedList, (template) => item.id === template.id);
                  if (!added) {
                    _TemplateNoAddedList.push(item);
                  }
                });
                _.each(_TemplateNoAddedList, (item) => {
                  _TemplateAddedList = _.without(_TemplateAddedList,
                    _.find(_TemplateAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllTemplate();
                setOperationTemplateDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //#endregion

      // take confirmation for remove op template items from drag drop options
      const confirmOpTemplateDeleteDragDrop = (addType) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, CORE.MainTitle.Op_Template);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            checkAndUpdateModifiedOpTemplateDragDrop(addType);
          }
        }, () => {
          return false;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const saveOperationsOfMasterTemplate = (newListToSave) => {
        vm.SearchAddedListOperation = null;
        vm.SearchNoAddedListOperation = null;
        const saveObj = [];

        _.each(newListToSave, (item) => {
          if (item.id) {
            const _object = {};
            _object.masterTemplateId = item.id,
              _object.operationId = operationId,
              saveObj.push(_object);
          }
        });
        const listObj = {
          operationId: operationId,
          masterTemplateList: saveObj
        };
        return OperationFactory.createOperation_MasterTemplateList().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
      };

      const deleteOperationsOfMasterTemplate = (listToDelete) => OperationFactory.deleteOperation_MasterTemplateList().delete({
        masterTemplateIds: _.map(listToDelete, (obj) => { return obj.id; }),
        operationId: operationId
      }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));

      const setOperationTemplateDragDropDetails = () => {
        vm.SearchAddedListTemplate = null;
        vm.SearchNoAddedListTemplate = null;
        vm.TemplateAddedList = _TemplateAddedList;
        vm.TemplateNoAddedList = _TemplateNoAddedList;
        vm.FilterTemplateAdded = vm.TemplateAddedList.length > 0;
        vm.FilterTemplateNotAdded = vm.TemplateNoAddedList.length > 0;
      };

      //Search Template in search area
      vm.SearchTemplate = (searchText, IsAdded) => {
        if (!searchText) {
          if (IsAdded) {
            vm.SearchAddedListTemplate = null;
            vm.TemplateAddedList = _TemplateAddedList;
            vm.FilterTemplateAdded = true;
          } else {
            vm.SearchNoAddedListTemplate = null;
            vm.TemplateNoAddedList = _TemplateNoAddedList;
            vm.FilterTemplateNotAdded = true;
          }
          return;
        }
        if (IsAdded) {
          vm.TemplateAddedList = $filter('filter')(_TemplateAddedList, { masterTemplate: searchText });
          vm.FilterTemplateAdded = vm.TemplateAddedList.length > 0;
        }
        else {
          vm.TemplateNoAddedList = $filter('filter')(_TemplateNoAddedList, { masterTemplate: searchText });
          vm.FilterTemplatetNotAdded = vm.TemplateNoAddedList.length > 0;
        }
      };

      //Reload data
      vm.refreshDataTemplate = () => {
        vm.templateAllocationDetails();
      };

      //Add new template
      vm.addDataTemplate = (data, ev) => {
        DialogFactory.dialogService(OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_CONTROLLER,OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_VIEW,ev,data).then((data) => {
           if(data && data.id){
            vm.refreshDataTemplate();
           }
          }, () => { // Empty Block.
          }, (err) => BaseService.getErrorLog(err));
      };

      /* go to mounting type list page */
      vm.goToManageOperationManagement = (masterTemplateID) => {
        BaseService.goToManageOperationManagement(masterTemplateID);
      };

      vm.templateAllocationDetails(true);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentApprovedDisapprovedSupplier', componentApprovedDisapprovedSupplier);

  /** @ngInject */
  function componentApprovedDisapprovedSupplier($q, $stateParams, CORE, USER, DialogFactory, BaseService, ComponentFactory, uiSortableMultiSelectionMethods) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/component-approved-disapproved-supplier/component-approved-disapproved-supplier.html',
      controller: componentApprovedDisapprovedSupplierCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function componentApprovedDisapprovedSupplierCtrl($scope) {
      const vm = this;
      vm.isReadOnly = $scope.isReadOnly;
      vm.supplierNotAddedList = vm.supplierAddedList = [];
      $scope.selectedSupplierListNotAdded = [];
      $scope.selectedSupplierListAdded = [];
      vm.EmptyMesssageForNotAdded = USER.ADMIN_EMPTYSTATE.DISAPPROVED_SUPPLIER_NOT_ADDED_EMPTY;
      vm.EmptyMesssageForAdded = USER.ADMIN_EMPTYSTATE.DISAPPROVED_SUPPLIER_ADDED_EMPTY;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;

      const retrieveSupplierNotAddedList = () => ComponentFactory.retrieveSupplierNotAddedList().query(vm.pagingInfoSupplierNotAdded).$promise.then((response) => {
        if (response && response.data) {
          vm.supplierNotAddedList = vm.supplierNotAddedList.concat(response.data.NotAddedList);
          vm.supplierNotAddedList = _.orderBy(vm.supplierNotAddedList, ['priority', 'mfgName']);
          vm.pagingInfoSupplierNotAdded.total = response.data.Count;
          vm.pagingInfoSupplierNotAdded.TotalRecordWithNoExclude = response.data.TotalRecordWithNoExclude;
          vm.pagingInfoSupplierNotAdded.isLoadMore = response.data.Count > vm.supplierNotAddedList.length;
          return $q.resolve(vm.supplierNotAddedList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const retrieveSupplierAddedList = () => ComponentFactory.retrieveSupplierAddedList().query(vm.pagingInfoSupplierAdded).$promise.then((response) => {
        if (response && response.data) {
          vm.supplierAddedList = vm.supplierAddedList.concat(response.data.AddedList);
          vm.pagingInfoSupplierAdded.total = response.data.Count;
          vm.pagingInfoSupplierAdded.isLoadMore = response.data.Count > vm.supplierAddedList.length;
          return $q.resolve(vm.supplierNotAddedList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

      vm.getMoreSuppliers = (isAdded) => {
        if (isAdded) {
          vm.pagingInfoSupplierAdded.Page = vm.pagingInfoSupplierAdded.Page + 1;
          retrieveSupplierAddedList();
        } else {
          vm.pagingInfoSupplierNotAdded.Page = vm.pagingInfoSupplierNotAdded.Page + 1;
          retrieveSupplierNotAddedList();
        }
      };




      const initPageInfoAdded = () => {
        vm.pagingInfoSupplierAdded = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          supplierSearch: null,
          partID: $stateParams.coid,
          total: 0,
          isLoadMore: false
        };
      };

      const initPageInfoNotAdded = () => {
        vm.pagingInfoSupplierNotAdded = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          supplierSearch: null,
          partID: $stateParams.coid,
          total: 0,
          isLoadMore: false,
          TotalRecordWithNoExclude: 0
        };
      };

      const init = () => {
        initPageInfoAdded();
        initPageInfoNotAdded();
        const initPromise = [retrieveSupplierNotAddedList(), retrieveSupplierAddedList()];
        vm.cgBusyLoading = $q.all(initPromise).then(() => {
          setSupplierSelectable();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();

      vm.reInit = () => {
        vm.componentApprovedDisapprovedSupplierForm.$setPristine();
        vm.supplierNotAddedList = vm.supplierAddedList = [];
        UnSelectAllSupplier();
        init();
      };

      const setSupplierSelectable = () => {
        angular.element('[ui-sortable]#supplierAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectSupplier('NotAdded');
          const $this = $(this);
          $scope.selectedSupplierListAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#supplierNotAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectSupplier('Added');
          const $this = $(this);
          $scope.selectedSupplierListNotAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
      };
      //#region unselect single element list
      const UnSelectSupplier = (unSelectFrom) => {
        if (unSelectFrom === 'NotAdded') {
          angular.element('[ui-sortable]#supplierNotAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#supplierAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedSupplier();
      };

      //Unselect all Supplier from list
      const UnSelectAllSupplier = () => {
        angular.element('[ui-sortable]#supplierNotAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#supplierAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedSupplier();
      };

      const ResetSelectedSupplier = () => {
        $scope.selectedSupplierListNotAdded = [];
        $scope.selectedSupplierListAdded = [];
      };


      const saveComponentApprovedSupplier = (query) => {
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.saveComponentApprovedSupplier().query(query).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.reInit();
          } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data) {
            $scope.$parent.vm.cgBusyLoading = false;
            const duplicateSupplier = _.map(response.errors.data, (item) => stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCodeMst.mfgCode, item.mfgCodeMst.mfgName)).join(',');
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, duplicateSupplier);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
              vm.reInit();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const removeComponentApprovedSupplier = (query) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Part Disapproved Supplier', query.IDs.length);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then(() => {
          $scope.$parent.vm.cgBusyLoading = ComponentFactory.deleteComponentApprovedSupplier().query(query).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.reInit();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.manageSupplier = (type) => {
        if (vm.isReadOnly) {
          return;
        }
        if (type === 'Add') {
          const query = {
            partID: $stateParams.coid,
            supplierIDs: $scope.selectedSupplierListNotAdded
          };
          saveComponentApprovedSupplier(query);
        } else if (type === 'AddAll') {
          const query = {
            partID: $stateParams.coid,
            supplierIDs: _.map(vm.supplierNotAddedList, 'id')
          };
          saveComponentApprovedSupplier(query);
        } else if (type === 'Remove') {
          const query = {
            IDs: $scope.selectedSupplierListAdded
          };
          removeComponentApprovedSupplier(query);
        } else if (type === 'RemoveAll') {
          const query = {
            IDs: _.map(vm.supplierAddedList, 'id')
          };
          removeComponentApprovedSupplier(query);
        }
      };

      vm.savePriority = () => {
        if (vm.isReadOnly) {
          return;
        }

        if (BaseService.focusRequiredField(vm.componentApprovedDisapprovedSupplierForm)) {
          return;
        }
        const suppliers = _.map(_.filter(vm.supplierNotAddedList, (item) => item.priority || item.priorityID), (item) => (({
          id: item.priorityID,
          partID: $stateParams.coid,
          supplierID: item.id,
          priority: item.priority
        })));

        vm.cgBusyLoading = ComponentFactory.saveComponentApprovedSupplierPriority().query({ suppliers: suppliers }).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.supplierNotAddedList = _.orderBy(vm.supplierNotAddedList, ['priority', 'mfgName']);
            vm.componentApprovedDisapprovedSupplierForm.$setPristine();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
        cancel: '.cursor-not-allow,:input',
        connectWith: '.items-container',
        placeholder: 'beingDragged',
        disabled: vm.isReadOnly,
        'ui-floating': true,
        cursorAt: {
          top: 0, left: 0
        },
        start: () => {
        },
        sort: () => {
        },
        update: (e, ui) => {
          //  const sourceModel = ui.item.sortableMultiSelect.selectedModels;
          if (!ui.item.sortable.received && ui.item.sortable.droptarget) {
            const sourceTarget = ui.item.sortable.source[0];
            const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
            const SourceDivAdded = sourceTarget.id.indexOf('NotAdded') > -1 ? false : true;
            const DestinationDivAdded = dropTarget.id.indexOf('NotAdded') > -1 ? false : true;
            if (SourceDivAdded !== DestinationDivAdded) {
              if (SourceDivAdded === false && DestinationDivAdded === true) {
                $scope.selectedSupplierListNotAdded = [];
                _.each(ui.item.sortableMultiSelect.selectedModels, (item) => {
                  $scope.selectedSupplierListNotAdded.push(item.id);
                });
                vm.manageSupplier('Add');
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                $scope.selectedSupplierListAdded = [];
                _.each(ui.item.sortableMultiSelect.selectedModels, (item) => {
                  $scope.selectedSupplierListAdded.push(item.id);
                });
                vm.manageSupplier('Remove');
                return;
              }
            }
          }
        },
        stop: () => {
        }
      });


      vm.searchSupplier = (searchText, isAdded) => {
        UnSelectAllSupplier();
        if (isAdded) {
          initPageInfoAdded();
          vm.supplierAddedList = [];
          vm.pagingInfoSupplierAdded.supplierSearch = searchText;
          retrieveSupplierAddedList();
        } else {
          initPageInfoNotAdded();
          vm.supplierNotAddedList = [];
          vm.pagingInfoSupplierNotAdded.supplierSearch = searchText;
          retrieveSupplierNotAddedList();
        }
      };

      vm.goToSupplier = (supplierID) => {
        BaseService.goToSupplierDetail(supplierID);
      };

      vm.addSupplier = (ev) => {
        if (vm.isReadOnly) {
          return;
        }

        const data = {
          Title: CORE.COMPONENT_MFG_TYPE.SUPPLIER,
          mfgType: CORE.MFG_TYPE.DIST
        };
        DialogFactory.dialogService(
          CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          CORE.MANAGE_MFGCODE_MODAL_VIEW,
          ev,
          data).then((data) => {
            supplierNotAddedList.push(data);
            vm.supplierNotAddedList.push(data);
          }, (data) => {
            const mfgCode = {
              id: data.id,
              mfgName: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, data.mfgCode, data.mfgName)
            };
            vm.supplierNotAddedList.push(mfgCode);
          }).catch((error) => BaseService.getErrorLog(error));
      };

      angular.element(() => {
        BaseService.currentPageForms = [vm.componentApprovedDisapprovedSupplierForm];
      });
    }
  }
})();

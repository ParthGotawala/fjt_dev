(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customComponentApprovedDisapprovedDetails', customComponentApprovedDisapprovedDetails);

  /** @ngInject */
  function customComponentApprovedDisapprovedDetails($q, $stateParams, CORE, USER, DialogFactory, BaseService, ManufacturerFactory, ComponentFactory,uiSortableMultiSelectionMethods) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
      },
      templateUrl: 'app/directives/custom/custom-component-approved-disapproved-details/custom-component-approved-disapproved-details.html',
      controller: customComponentApprovedDisapprovedDetailsCtrl,
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
    function customComponentApprovedDisapprovedDetailsCtrl($scope) {
      const vm = this;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.LabelConstant = CORE.LabelConstant;
      vm.customComponentApprovedDisapprovedFilter = CORE.customComponentApprovedDisapprovedFilter;
      vm.mappedComponent = vm.customComponentApprovedDisapprovedFilter.MappedManufacturerCustomPartsOnly.key;
      vm.componentNotAddedList = vm.componentAddedList = [];
      $scope.selectedComponentListNotAdded = [];
      $scope.selectedComponentListAdded = [];
      vm.EmptyMesssageForNotAdded = USER.ADMIN_EMPTYSTATE.DISAPPROVED_COMPONENT_NOT_ADDED_EMPTY;
      vm.EmptyMesssageForAdded = USER.ADMIN_EMPTYSTATE.DISAPPROVED_COMPONENT_ADDED_EMPTY;
      const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

      const retrieveCustomComponentNotAddedList = () => ManufacturerFactory.retrieveCustomComponentNotAddedList().query(vm.pagingInfoComponentNotAdded).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data.NotAddedList, (item) => {
            if (!item.imageURL) {
              item.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
            } else {
              if (!item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
                item.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
              }
            }
            item.rohsIcon = rohsImagePath + item.rohsIcon;
          });
          vm.componentNotAddedList = vm.componentNotAddedList.concat(response.data.NotAddedList);
          vm.pagingInfoComponentNotAdded.total = response.data.Count;
          vm.pagingInfoComponentNotAdded.TotalRecordWithNoExclude = response.data.TotalRecordWithNoExclude;
          vm.pagingInfoComponentNotAdded.isLoadMore = response.data.Count > vm.componentNotAddedList.length;
          return $q.resolve(vm.componentNotAddedList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const retrieveCustomComponentAddedList = () => ManufacturerFactory.retrieveCustomComponentAddedList().query(vm.pagingInfoComponentAdded).$promise.then((response) => {
        if (response && response.data.AddedList) {
          _.each(response.data.AddedList, (item) => {
            if (!item.imageURL) {
              item.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
            } else {
              if (!item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
                item.imageURL = BaseService.getPartMasterImageURL(item.documentPath, item.imageURL);
              }
            }
            item.rohsIcon = rohsImagePath + item.rohsIcon;
          });
          vm.componentAddedList = vm.componentAddedList.concat(response.data.AddedList);
          vm.pagingInfoComponentAdded.total = response.data.Count;
          vm.pagingInfoComponentAdded.isLoadMore = response.data.Count > vm.componentAddedList.length;
        }
        return $q.resolve(vm.componentAddedList);
      }).catch((error) => BaseService.getErrorLog(error));

      vm.getMoreComponents = (isAdded) => {
        if (isAdded) {
          vm.pagingInfoComponentAdded.Page = vm.pagingInfoComponentAdded.Page + 1;
          retrieveCustomComponentAddedList();
        } else {
          vm.pagingInfoComponentNotAdded.Page = vm.pagingInfoComponentNotAdded.Page + 1;
          retrieveCustomComponentNotAddedList();
        }
      };

      const initPageInfoAdded = () => {
        vm.pagingInfoComponentAdded = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          componentSearch: null,
          supplierID: $stateParams.cid,
          total: 0,
          isLoadMore: false
        };
      };

      const initPageInfoNotAdded = () => {
        vm.pagingInfoComponentNotAdded = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          mappedComponent: vm.mappedComponent,
          componentSearch: null,
          supplierID: $stateParams.cid,
          total: 0,
          isLoadMore: false,
          TotalRecordWithNoExclude : 0
        };
      };

      const setComponentSelectable = () => {
        angular.element('[ui-sortable]#componentAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectComponent('NotAdded');
          const $this = $(this);
          $scope.selectedComponentListAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#componentNotAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectComponent('Added');
          const $this = $(this);
          $scope.selectedComponentListNotAdded = $this.find('.ui-sortable-selected').map(function () {
            return $(this)[0] && $(this)[0].id;
          }).toArray();
          $scope.$applyAsync();
        });
      };

      const init = () => {
        initPageInfoAdded();
        initPageInfoNotAdded();
        const initPromise = [retrieveCustomComponentAddedList(), retrieveCustomComponentNotAddedList()];
        vm.cgBusyLoading = $q.all(initPromise).then(() => {
          setComponentSelectable();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();

      vm.reInit = () => {
        vm.componentNotAddedList = vm.componentAddedList = [];
        UnSelectAllComponent();
        init();
      };

      //#region unselect single element list
      const UnSelectComponent = (unSelectFrom) => {
        if (unSelectFrom === 'NotAdded') {
          angular.element('[ui-sortable]#componentNotAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#componentAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedComponent();
      };

      //Unselect all component from list
      const UnSelectAllComponent = () => {
        angular.element('[ui-sortable]#componentNotAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#componentAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedComponent();
      };

      const ResetSelectedComponent = () => {
        $scope.selectedComponentListNotAdded = [];
        $scope.selectedComponentListAdded = [];
      };


      const saveComponentApprovedSupplier = (query) => {
        query.isFromSupplier = true;
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.saveComponentApprovedSupplier().query(query).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.reInit();
          } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data) {
            $scope.$parent.vm.cgBusyLoading = false;
            const duplicateComponent = _.map(response.errors.data, (item) => item.component.PIDCode).join(',');
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, duplicateComponent);
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
        messageContent.message = stringFormat(messageContent.message, 'Disapproved Part', query.IDs.length);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then(() => {
          query.isFromSupplier = true;
          $scope.$parent.vm.cgBusyLoading = ComponentFactory.deleteComponentApprovedSupplier().query(query).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.reInit();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.manageComponent = (type) => {
        if (type === 'Add') {
          const query = {
            supplierID: $stateParams.cid,
            partIDs: $scope.selectedComponentListNotAdded
          };
          saveComponentApprovedSupplier(query);
        } else if (type === 'AddAll') {
          const query = {
            supplierID: $stateParams.cid,
            partIDs: _.map(vm.componentNotAddedList, 'id')
          };
          saveComponentApprovedSupplier(query);
        } else if (type === 'Remove') {
          const query = {
            IDs: $scope.selectedComponentListAdded
          };
          removeComponentApprovedSupplier(query);
        } else if (type === 'RemoveAll') {
          const query = {
            IDs: _.map(vm.componentAddedList, 'id')
          };
          removeComponentApprovedSupplier(query);
        }
      };

      vm.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
        cancel: '.cursor-not-allow,:input',
        connectWith: '.items-container',
        placeholder: 'beingDragged',
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
                $scope.selectedComponentListNotAdded = [];
                _.each(ui.item.sortableMultiSelect.selectedModels, (item) => {
                  $scope.selectedComponentListNotAdded.push(item.id);
                });
                vm.manageComponent('Add');
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                $scope.selectedComponentListAdded = [];
                _.each(ui.item.sortableMultiSelect.selectedModels, (item) => {
                  $scope.selectedComponentListAdded.push(item.id);
                });
                vm.manageComponent('Remove');
                return;
              }
            }
          }
        },
        stop: () => {
        }
      });

      vm.searchComponent = (searchText, isAdded) => {
        UnSelectAllComponent();
        if (isAdded) {
          initPageInfoAdded();
          vm.componentAddedList = [];
          vm.pagingInfoComponentAdded.componentSearch = searchText;
          retrieveCustomComponentAddedList();
        } else {
          initPageInfoNotAdded();
          vm.componentNotAddedList = [];
          vm.pagingInfoComponentNotAdded.componentSearch = searchText;
          retrieveCustomComponentNotAddedList();
        }
      };


      vm.addComponent = (ev) => {
        const data = {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.Component
        };
        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
              initPageInfoNotAdded();
              vm.componentNotAddedList = [];
              retrieveCustomComponentNotAddedList();
          }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();

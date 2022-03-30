(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('ComponentApprovedSupplierPopupController', ComponentApprovedSupplierPopupController);
  /** @nginject */
  function ComponentApprovedSupplierPopupController($q, $mdDialog, data, USER, CORE, DialogFactory, BaseService, MasterFactory, ComponentFactory) {
    const vm = this;
    vm.customerApprovedSupplier = {
      refPartID: data.partID
    };
    vm.approvedSupplierList = vm.selectItem = [];
    vm.isSelectAll = false;
    vm.autoFocusSupplier = true;
    let priorityCheck;

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for supplier */
      vm.autoCompleteSupplier = {
        columnName: 'mfgName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'ComponentApprovedSupplier',
        placeholderName: 'Supplier',
        isRequired: true,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST, masterPage: true,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        callbackFn: getSupplierList,
        onSelectCallbackFn: vm.checkComponentApprovedSupplier
      };
    };

    /** Get supplier list */
    const getSupplierList = () => MasterFactory.getSupplierList().query().$promise.then((response) => {
      if (response && response.data) {
        _.each(response.data, (item) => {
          item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
        });
        vm.supplierList = response.data;
      }
      return $q.resolve(vm.supplierList);
    }).catch((error) => BaseService.getErrorLog(error));

    const retriveComponentApprovedSupplier = () => ComponentFactory.retriveComponentApprovedSupplier().query(vm.customerApprovedSupplier).$promise.then((response) => {
      if (response && response.data) {
        _.each(response.data, (item) => {
          item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCodeMst.mfgCode, item.mfgCodeMst.mfgName);
          item.priority = item.priority;
        });
        priorityCheck = angular.copy(_.sortBy(response.data, 'priority'));
        vm.approvedSupplierList = _.sortBy(response.data, 'priority');
        vm.componentApprovedSupplierForm.$setPristine();
        BaseService.currentPagePopupForm.pop();
        BaseService.currentPagePopupForm.push(vm.componentApprovedSupplierForm);
      }
      return $q.resolve(vm.approvedSupplierList);
    }).catch((error) => BaseService.getErrorLog(error));

    const init = () => {
      const initPromise = [getSupplierList(), retriveComponentApprovedSupplier()];
      vm.cgBusyLoading = $q.all(initPromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    init();
    let outside = true;
    vm.sortableOptions = {
      connectWith: '.approved-supplier-container',
      items: '.sortable-item',
      start: () => {
      },
      over: () => {
        outside = false;
      },
      out: () => {
        outside = true;
      },
      beforeStop: (e,ui) => {
        if (outside) {
          ui.item.sortable.cancel();
          return;
        }
      },
      update: () => {
      },
      stop: (e,ui) => {
        //let isChanged = false;
        if (ui.item && ui.item.sortable && ui.item.sortable.model) {
          const selected = ui.item.sortable.model;
          _.map(vm.approvedSupplierList, (item, index) => { item.priority = (index + 1); });
          const isChanged = _.find(priorityCheck, (element) => element.id === selected.id && element.priority !== selected.priority);
          //  _.each(vm.approvedSupplierList, (item, index) => {
          //  const element = _.find(priorityCheck, (element,i) => element.id===item.id && i!==index);
          //  if (element) {
          //    isChanged = true;
          //  }
          //});
          if (isChanged) {
            vm.approvedSupplierList; //_.map(vm.approvedSupplierList, (item, index) => { item.priority = (index + 1); });
            vm.saveSupplierPriority();
          }
        }
      }
    };

    vm.checkComponentApprovedSupplier = (supplier) => {
      if (supplier) {
        const query = {
          refPartID: data.partID,
          supplierID: supplier.id
        };
        ComponentFactory.checkComponentApprovedSupplierUnique().query(query).$promise.then((response) => {
          if (response && response.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Supplier');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.customerApprovedSupplier.supplierID = vm.autoCompleteSupplier.keyColumnId = null;
                setFocusByName(vm.autoCompleteSupplier.inputName);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.customerApprovedSupplier.supplierID = supplier.id;
            setFocus('btnAdd');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.customerApprovedSupplier.supplierID = null;
      }
    };

    vm.saveComponentApprovedSupplier = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.componentApprovedSupplierForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      vm.cgBusyLoading = ComponentFactory.saveComponentApprovedSupplier().query(vm.customerApprovedSupplier).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.saveBtnDisableFlag = false;
          vm.customerApprovedSupplier.supplierID = vm.autoCompleteSupplier.keyColumnId = null;
          setFocusByName(vm.autoCompleteSupplier.inputName);
          retriveComponentApprovedSupplier();
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY) {
          vm.cgBusyLoading = vm.saveBtnDisableFlag = false;
          vm.customerApprovedSupplier.supplierID = vm.autoCompleteSupplier.keyColumnId = null;
          setFocusByName(vm.autoCompleteSupplier.inputName);
        }
      }).catch((error) => BaseService.getErrorLog(error)
      ).finally(() => {
        vm.saveBtnDisableFlag = false;
      });
    };

    vm.saveSupplierPriority = () => {
      const priorityList = _.map(vm.approvedSupplierList, (item) => ({
        id: item.id,
        priority: item.priority
      }));
      vm.cgBusyLoading = ComponentFactory.saveComponentApprovedSupplierPriority().query({ priorityList: priorityList }).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.componentApprovedSupplierForm.$setPristine();
          retriveComponentApprovedSupplier();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectAllSupplier = () => {
      if (vm.isSelectAll) {
        vm.isSelectAll = false;
        _.map(vm.approvedSupplierList, (item) => item.isSelected = false);
      } else {
        vm.isSelectAll = true;
        _.map(vm.approvedSupplierList, (item) => item.isSelected = true);
      }
      vm.selectItem = _.filter(vm.approvedSupplierList, (data) => data.isSelected === true);
    };

    vm.selectSupplier = () => {
      vm.selectItem = _.filter(vm.approvedSupplierList, (data) => data.isSelected === true);
      if (vm.approvedSupplierList.length === vm.selectItem.length) {
        vm.isSelectAll = true;
      } else {
        vm.isSelectAll = false;
      }
    };

    vm.deleteApprovedSupplier = (supplier) => {
      //let selectedIDs = [];
      //if (supplier) {
      //  selectedIDs.push(supplier.id);
      //}
      //selectedIDs = [...selectedIDs, ..._.map(vm.selectItem, 'id')];
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message,'Part Approved Supplier',1);
      const model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(model).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = ComponentFactory.deleteComponentApprovedSupplier().query({ ID: supplier.id}).$promise.then((response) => {
            if (response.data) {
              vm.selectItem = [];
              vm.isSelectAll = false;
              BaseService.currentPagePopupForm.pop();
              BaseService.currentPagePopupForm.push(vm.componentApprovedSupplierForm);
              retriveComponentApprovedSupplier();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };



    /** Redirect to supplier page */
    vm.goToSupplier = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
    };

    vm.cancel = () => {
      if (vm.componentApprovedSupplierForm.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.componentApprovedSupplierForm);
    });
  }
})();

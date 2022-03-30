(function () {
  'use strict';
  angular
    .module('app.admin.supplierattributetemplate')
    .controller('SupplierAttributeTemplateAddUpdatePopupController', SupplierAttributeTemplateAddUpdatePopupController);
  /** @nginject */
  function SupplierAttributeTemplateAddUpdatePopupController($q, $mdDialog, data, USER, CORE, DialogFactory, BaseService, SupplierAttributeTemplateFactory, SupplierQuoteFactory) {
    const vm = this;
    vm.supplierAttributeTemplate = {
      id: data ? data.id : null
    };
    vm.themeClass = CORE.THEME;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_QUOTE_DYNAMIC_FIELDS;
    vm.EmptySearchMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_ATTRIBUTE_TEMPLATE;
    vm.autoFocusSupplier = true;
    vm.isCheckAll = false;
    vm.attributeList = [];
    vm.selectedAttributeList = [];
    vm.getSupplierQuoteAttribute = () => {
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuoteAttributes().query().$promise.then((quoteDynamicFields) => {
        if (quoteDynamicFields.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.attributeList = quoteDynamicFields.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.reInitSupplierAttributeTemplate = () => {
      if (vm.supplierAttributeTemplateForm.$dirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            init();
          }
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
      } else {
        init();
      }
    };

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for supplier */
      vm.autoCompleteSupplier = {
        columnName: 'mfgName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.supplierAttributeTemplate && vm.supplierAttributeTemplate.supplierID ? vm.supplierAttributeTemplate.supplierID : null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        isRequired: true,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST, masterPage: true,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        callbackFn: getSupplierList,
        onSelectCallbackFn: vm.checkSupplierAttributeTemplateSupplierUnique
      };
    };

    /** Get supplier list */
    const getSupplierList = () => SupplierAttributeTemplateFactory.getSupplierList().query().$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data,(item)=> {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.supplierList = response.data;
        }
        return $q.resolve(vm.supplierList);
      }).catch((error) => BaseService.getErrorLog(error));

    vm.checkSupplierAttributeTemplateSupplierUnique = (supplier) => {
      if (supplier) {
        const checkObj = {
          id: vm.supplierAttributeTemplate.id ? vm.supplierAttributeTemplate.id : null,
          supplierID: supplier.id
        };
        SupplierAttributeTemplateFactory.checkSupplierAttributeTemplateUnique().query(checkObj).$promise.then((response) => {
          if (response.data && response.data.supplier) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Supplier');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.autoCompleteSupplier.keyColumnId = vm.supplierAttributeTemplate.supplierID = null;
                setFocusByName(vm.autoCompleteSupplier.inputName);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.supplierAttributeTemplate.supplierID = supplier.id;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.supplierAttributeTemplate.supplierID = null;
      }
    };
    vm.checkSupplierAttributeTemplateNameUnique = () => {
      if (vm.supplierAttributeTemplate.name) {
        const checkObj = {
          id: vm.supplierAttributeTemplate.id ? vm.supplierAttributeTemplate.id : null,
          name: vm.supplierAttributeTemplate.name
        };
        SupplierAttributeTemplateFactory.checkSupplierAttributeTemplateUnique().query(checkObj).$promise.then((response) => {
          if (response.data && response.data.name) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, 'Template name');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.supplierAttributeTemplate.name = null;
                setFocus('name');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getSupplierAttributeTemplateByID = () => {
      vm.cgBusyLoading = SupplierAttributeTemplateFactory.getSupplierAttributeTemplateByID().query({ id: vm.supplierAttributeTemplate.id }).$promise.then((response) => {
        if (response.data && response.data) {
          vm.supplierAttributeTemplate = response.data;
          _.each(vm.attributeList, (objAttribute) => {
            const objAttributeData = _.find(response.data.supplier_attribute_template_det, (a) => a.attributeID === objAttribute.id);
            if (objAttributeData) {
              objAttribute.supplierAttributeTemplateDetID = objAttributeData.id;
              objAttribute.selected = true;
              vm.selectedAttributeList.push(objAttribute);
            }
            else {
              objAttribute.selected = false;
            }
          });
          const isCheckedAll = _.filter(vm.attributeList, (item) => !item.selected);
          vm.isCheckAll = isCheckedAll && isCheckedAll.length === 0 ? true : false;
          initAutoComplete();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const init = () => {
      const initPromise = [vm.getSupplierQuoteAttribute(), getSupplierList()];
      vm.cgBusyLoading = $q.all(initPromise).then(() => {
        if (vm.supplierAttributeTemplate.id) {
          vm.getSupplierAttributeTemplateByID();
        } else {
          initAutoComplete();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    init();

    vm.checkAllAttributes = () => {
      _.each(vm.attributeList, (item) => { item.selected = vm.isCheckAll ? true : false; });
    };

    vm.checkAttribute = () => {
      const isCheckedAll = _.filter(vm.attributeList, (item) =>!item.selected);
      vm.isCheckAll = isCheckedAll && isCheckedAll.length === 0 ? true : false;
    };

    vm.saveSupplierAttributeTemplate = () => {
      vm.isSavebtnDisable = true;
      if (BaseService.focusRequiredField(vm.supplierAttributeTemplateForm)) {
        vm.isSavebtnDisable = false;
        return;
      }
      vm.isAnyAttributeSelected = _.filter(vm.attributeList,(item)=> item.selected);
      if (vm.isAnyAttributeSelected && vm.isAnyAttributeSelected.length > 0) {
        if (vm.supplierAttributeTemplate.id) {
          const deleteditem = _.filter(vm.attributeList, (attribute) => {
            if (!attribute.selected) {
              const isDeleted = _.find(vm.selectedAttributeList, (a) => a.id === attribute.id);
              if (isDeleted) {
                return true;
              }
            }
          });
          if (deleteditem.length > 0) {
            const deleted = _.map(deleteditem, (x) => x.fieldName).join();
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DELETE_TEMPLATE_ATTRIBUTE_CONFIRMATION);
            messageContent.message = stringFormat(messageContent.message, deleted);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            return DialogFactory.messageConfirmDialog(obj).then((response) => {
              if (response) {
                vm.saveSupplierAttributeTemplateDetails();
              }
            }, () => {
                _.each(vm.attributeList, (objAttribute) => {
                  const objAttributeData = _.find(deleteditem, (a) => a.id === objAttribute.id);
                  if (objAttributeData) {
                    objAttribute.selected = true;
                  }
                });
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.saveSupplierAttributeTemplateDetails();
          }
        } else {
          vm.saveSupplierAttributeTemplateDetails();
        }
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'attribute');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model);
      }
    };

    vm.saveSupplierAttributeTemplateDetails = () => {
      vm.supplierAttributeTemplate.selectedAttributes = vm.isAnyAttributeSelected;
      vm.cgBusyLoading = SupplierAttributeTemplateFactory.saveSupplierAttributeTemplate().query(vm.supplierAttributeTemplate).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.isSavebtnDisable = false;
          if (response && response.data) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.cancel(response.data);
          }
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.duplicateRecord) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, 'Supplier and template name');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.autoCompleteSupplier.keyColumnId = vm.supplierAttributeTemplate.supplierID = vm.supplierAttributeTemplate.name = null;
              setFocusByName(vm.autoCompleteSupplier.inputName);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.name) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, 'Template name');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.supplierAttributeTemplate.name = null;
              setFocus('name');
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors.data && response.errors.data.supplier) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
          messageContent.message = stringFormat(messageContent.message, 'Supplier');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.autoCompleteSupplier.keyColumnId = vm.supplierAttributeTemplate.supplierID = null;
              setFocusByName(vm.autoCompleteSupplier.inputName);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors.data && response.errors.data.length > 0) {
          const duplicateAttributes = _.map(response.errors.data, (item) => item.quotecharges_dynamic_fields_mst.fieldName).join(',');
          const duplicateAttributesList = _.map(response.errors.data, (item) => item.quotecharges_dynamic_fields_mst);

          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
          messageContent.message = stringFormat(messageContent.message, duplicateAttributes);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              _.each(vm.attributeList, (item) => {
                const isExist = _.find(duplicateAttributesList, (dupList) => dupList.id === item.id);
                if (isExist) {
                  item.selected = false;
                }
              });
              //vm.cgBusyLoading = $q.all([vm.getSupplierQuoteAttribute()]).then((responses) => {
              //  vm.getSupplierAttributeTemplateByID(true);
              //}).catch((error) => {
              //  return BaseService.getErrorLog(error);
              //});
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.isSavebtnDisable = false;
      });
    };

    vm.addSupplierQuoteAttribute = (ev) => {
      const data = { quoteAttributeType: CORE.QUOTE_DB_ATTRIBUTE_TYPE.SUPPLIER };
      DialogFactory.dialogService(
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
            if (data) {
              vm.isCheckAll = false;
              vm.attributeList.push(data);
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.GoToQuoteAttributelist = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE, { type: CORE.QUOTE_DB_ATTRIBUTE_TYPE.SUPPLIER });
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };

    vm.cancel = () => {
      if (vm.supplierAttributeTemplateForm.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.supplierAttributeTemplateForm);
    });
  }
})();

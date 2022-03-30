(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('AddCustomerPopupController', AddCustomerPopupController);

  /** @ngInject */
  function AddCustomerPopupController($mdDialog, data, CORE, $scope, BaseService, USER, DialogFactory, $timeout, ManufacturerFactory, ManageMFGCodePopupFactory, MasterFactory, EmployeeFactory, FOBFactory, DCFormatFactory) {
    if (!data || !data.customerType) {
      $mdDialog.cancel();
      return;
    }
    const vm = this;
    vm.data = data || {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isSubmit = false;
    vm.focusDateCode = false;
    vm.isMaster = vm.data && vm.data.isMaster ? vm.data.isMaster : false;
    vm.customerType = vm.data.customerType;
    vm.mfgType = vm.data.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.MFG_TYPE.MFG : null;
    vm.mfgLength = CORE.MFG_TYPE_LENGTH.MFG;
    vm.CUSTOMER_TYPE_CONST = CORE.CUSTOMER_TYPE;
    vm.label = vm.customerType === vm.CUSTOMER_TYPE_CONST.CUSTOMER ? CORE.COMPONENT_MFG_TYPE.CUSTOMER : null;
    vm.fromPageRequest = vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.MFG_TYPE.CUSTOMER : null;
    vm.isShowAllMFGCustList = true;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    const loginUserDet = BaseService.loginUser;
    vm.isAllowDeleteCustSuppAlias = false;
    vm.MFRDateCodeFormat = CORE.LabelConstant.MFG.MFRDateCodeFormat;
    vm.customerTypeConst = CORE.CUSTOMER_TYPE;
    vm.customerTypeList = _.filter(CORE.customerTypeDropdown, (item) => item.id);
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    let selectedMFGCodeAlias = null;
    vm.initalData = {
      customerType: CORE.CUSTOMER_TYPE.CUSTOMER
    };
    vm.pageInit = (data) => {
      vm.customer = {
        id: data && data.id ? data.id : null,
        mfgType: data && data.mfgType ? data.mfgType : vm.mfgType,
        mfgName: data && data.Name ? data.Name : null,
        mfgCode: data && data.mfgCode ? data.mfgCode : null,
        alias: [],
        manufacturerMapping: [],
        salesCommissionTo: data && data.salesCommissionTo ? data.salesCommissionTo : null,
        freeOnBoardId: data && data.freeOnBoardId ? data.freeOnBoardId : null,
        customerType: data && data.customerType ? data.customerType : vm.customerTypeList[1].id
      };
      vm.alias = vm.data && vm.data.Name ? vm.data.Name.toUpperCase() : vm.customer.mfgName;
      if (vm.autoCompleteDateCodeFormat) {
        vm.autoCompleteDateCodeFormat.keyColumnId = vm.customer.dateCodeFormatID;
      }
      if (vm.autoCompleteFOB) {
        vm.autoCompleteFOB.keyColumnId = vm.customer.freeOnBoardId;
      }
      if (vm.autoCompleteSalesCommosssionTo) {
        vm.autoCompleteSalesCommosssionTo.keyColumnId = vm.customer.salesCommissionTo;
      }
      if (vm.autoCompleteCustomerType) {
        vm.autoCompleteCustomerType.keyColumnId = vm.customer.customerType;
      }
      if (vm.customer.mfgName) {
        $timeout(() => {
          vm.AddCustomerForm.$setDirty();
        });
      }
      vm.primaryContPersonsDet = [];
      vm.contactPersonDetail = {
        isMasterPage: true,
        pageName: vm.label,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
        mfgType: vm.mfgType,
        contactRedirectionFn: () => { vm.goToCustomerContactPersonList(); }
      };
    };
    vm.pageInit(vm.data);
    if (!vm.isMaster) {
      getMfgSearch();
    }
    let oldCompanyName = '';
    let oldCustomerCode = '';
    let isSetMFGAsCustomerAction = false;

    const getSalesCommissionEmployeeListbyCustomer = () => EmployeeFactory.getEmployeeListByCustomer().query({ customerID: vm.cid }).$promise.then((employees) => {
      if (employees && employees.data) {
        vm.SalesCommissionEmployeeList = angular.copy(employees.data);
        _.each(vm.SalesCommissionEmployeeList, (item) => {
          if (item.profileImg && item.profileImg != null) {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        vm.autoCompleteForCustomer();
        return vm.SalesCommissionEmployeeList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //Get list of FOB
    const getFOBList = () =>
      FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
        if (fob && fob.data) {
          vm.FOBList = fob.data;
          return vm.FOBList;
        }
      }).catch((error) => BaseService.getErrorLog(error));

    if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
      getFOBList();
      getSalesCommissionEmployeeListbyCustomer();
    }

    const getMfgDetail = (item) => {
      if (item) {
        retriveMfgCode(item.id);
      } else {
        vm.pageInit(vm.initalData);
      }
    };


    /* called from all mfg cust list - while unselect mfg checkbox to set as customer */
    vm.resetApplyAsCustomerDet = () => {
      vm.customer = { manufacturerMapping: [] };
      vm.AddCustomerForm.$setPristine();
      vm.AddCustomerForm.$setUntouched();
    };

    //  check and get accesslevel for delete customer/mfg/supplier alias : DELETEROLEACCESS key used right now
    function getAccessLevelForDeleteAlias() {
      return MasterFactory.getAcessLeval().query({
        access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.isAllowDeleteCustSuppAlias = false;
          const currentLoginUserRole = _.find(loginUserDet.roles, (item) => parseInt(item.id) === parseInt(loginUserDet.defaultLoginRoleID));
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.isAllowDeleteCustSuppAlias = true;
          }
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    getAccessLevelForDeleteAlias();

    /* get customer details by ID */
    function retriveMfgCode(id) {
      const mfgInfo = {
        mfgType: vm.mfgType,
        fromPageRequest: vm.fromPageRequest
      };
      return ManufacturerFactory.retriveMfgCode(mfgInfo).query({ id: id, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((response) => {
        if (response && response.data) {
          vm.customer.mfgType = response.data.mfgType;
          vm.customer.id = response.data.id;
          vm.customer.mfgName = response.data.mfgName;
          vm.customer.mfgCode = response.data.mfgCode;
          vm.customer.legalName = response.data.legalName;
          vm.customer.comments = response.data.comments;
          vm.autoCompletemfgCode.searchText = response.data.mfgCode;
          vm.customer.isMfgCodeUsedInFlow = response.data.isMfgCodeUsedInFlow ? true : false;
          vm.customer.isCustOrDisty = response.data.isCustOrDisty;
          vm.customer.customerID = response.data.customerID;
          vm.customer.isPricingApi = response.data.isPricingApi;
          vm.customer.systemGenerated = response.data.systemGenerated;
          vm.customer.isOrderQtyRequiredInPackingSlip = response.data.isOrderQtyRequiredInPackingSlip;
          vm.customer.dateCodeFormatID = response.data.dateCodeFormatID;
          oldCustomerCode = vm.customer.mfgCode;
          oldCompanyName = vm.customer.mfgName;
          vm.customer.isCompany = response.data.isCompany ? response.data.isCompany : false;
          vm.aliaslist = [];
          vm.customer.alias = [];
          vm.customer.supplierMFRMappingType = response.data.supplierMFRMappingType;
          vm.customer.freeOnBoardId = response.data.freeOnBoardId;
          vm.customer.invoicesRequireManagementApproval = response.data.invoicesRequireManagementApproval ? response.data.invoicesRequireManagementApproval : false;
          vm.autoCompleteDateCodeFormat.keyColumnId = response.data.dateCodeFormatID;
          vm.autoCompleteSalesCommosssionTo.keyColumnId = response.data.salesCommissionTo;
          vm.autoCompleteFOB.keyColumnId = response.data.freeOnBoardId;
          vm.autoCompleteCustomerType.keyColumnId = response.data.customerType;
          vm.contactPersonDetail = {
            companyName: vm.customer.mfgName,
            refTransID: vm.customer.id,
            refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
            isMasterPage: true,
            pageName: vm.label,
            mfgType: vm.mfgType,
            contactRedirectionFn: () => { vm.goToCustomerContactPersonList(); }
          };
          vm.primaryContPersonsDet = vm.customer.contactPerson;

          const aliaslist = vm.aliaslist = angular.copy(response.data.mfgCodeAlias);
          _.each(aliaslist, (item) => {
            var objAlis = {
              alias: item.alias,
              id: item.id,
              createdAt: item.createdAt,
              employeeName: item.user && item.user.employee ? (item.user.employee.firstName + ' ' + item.user.employee.lastName) : '',
              isSystemGenerated: vm.customer.systemGenerated || item.alias === vm.customer.mfgName.toUpperCase() || item.alias === vm.customer.mfgCode,
              isDefaultAlias: vm.customer.systemGenerated || item.alias === vm.customer.mfgName.toUpperCase(),
              isMapped: item.invalidMfgMapping.length,
              createdAtValue: item.createdAtValue
            };
            objAlis.index = objAlis.alias.toUpperCase() === vm.customer.mfgCode.toUpperCase() ? 1 : (objAlis.isDefaultAlias ? 2 : 3);
            vm.customer.alias.push(objAlis);
          });

          if (response.data.supplier_mapping_mstSupplier && response.data.supplier_mapping_mstSupplier.length > 0) {
            vm.customer.manufacturerMapping = _.map(response.data.supplier_mapping_mstSupplier, (item) => ({
              id: item.id,
              refMfgCodeMstID: item.MfgCodeMstManufacturer.id,
              mfgCode: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.MfgCodeMstManufacturer.mfgCode, item.MfgCodeMstManufacturer.mfgName)
            }));
          } else {
            vm.customer.manufacturerMapping = [];
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // save functionality managed by button category
    vm.saveAndProceed = (buttonCategory, data) => {
      vm.data = data ? data : {};
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddCustomerForm.$setPristine();
        vm.AddCustomerForm.$setUntouched();
        vm.pageInit(vm.data);
        retriveMfgCode(vm.data.id);
        vm.checkDirty = false;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.AddCustomerForm.$dirty ? true : vm.checkFormDirty(vm.AddCustomerForm);
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((respose) => {
            if (respose) {
              vm.pageInit();
              vm.AddCustomerForm.$setPristine();
              vm.AddCustomerForm.$setUntouched();
              if (vm.autoCompletemfgCode) {
                vm.autoCompletemfgCode.searchText = null;
              }
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit(vm.initalData);
          vm.AddCustomerForm.$setPristine();
          vm.AddCustomerForm.$setUntouched();
          if (vm.autoCompletemfgCode) {
            vm.autoCompletemfgCode.searchText = null;
          }
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('customerCode');
    };

    /* manage customer */
    const manageCustomer = (buttonCategory, customerInfo) => {
      vm.cgBusyLoading = ManufacturerFactory.managecustomer().save(customerInfo).$promise.then((res) => {
        if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.SUCCESS) {
          isSetMFGAsCustomerAction = false;
          vm.saveAndProceed(buttonCategory, vm.customer);
        }
        else if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
          displayCompanyNameUniqueMessage();
        }
        else if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
          displayCodeAliasUniqueMessage();
        }
        else if (res.data && res.data.status && res.data.status === 'alias') {
          const alias = res.data.data;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
          messageContent.message = stringFormat(messageContent.message, alias[0].alias, 'customer', alias[0].mfgCodemst.mfgCode);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* create employee */
    vm.SaveCustomer = (isCheckUnique, buttonCategory) => {
      if (vm.AddCustomerForm.$invalid || (!vm.autoCompletemfgCode.searchText && !vm.autoCompletemfgCode.keyColumnId && !vm.isMaster)) {
        BaseService.focusRequiredField(vm.AddCustomerForm);
        return;
      }
      if (BaseService.focusRequiredField(vm.AddCustomerForm)) {
        if (vm.customer.id && !vm.checkFormDirty(vm.AddCustomerForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      vm.isSubmit = false;
      if (!vm.AddCustomerForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      vm.customer.alias = vm.customer.alias ? vm.customer.alias : [];
      if (!vm.isMaster) {
        vm.customer.id = vm.autoCompletemfgCode.keyColumnId;
        vm.customer.mfgCode = vm.customer.id ? selectedMFGCodeAlias.mfgCode.toUpperCase() : vm.autoCompletemfgCode.searchText.toUpperCase();
      }
      /* add name and code as default alias */
      const defaultAliasCode = _.find(vm.customer.alias, (item) => item.alias.toUpperCase() === vm.customer.mfgCode.toUpperCase());
      if (!defaultAliasCode) {
        vm.customer.alias.push({
          alias: vm.customer.mfgCode.toUpperCase(),
          createdAt: new Date(),
          employeeName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        });
      }

      const defaultAliasName = _.find(vm.customer.alias, (item) => item.alias.toUpperCase() === vm.customer.mfgName.toUpperCase());
      if (!defaultAliasName) {
        vm.customer.alias.push({
          alias: vm.customer.mfgName.toUpperCase(),
          createdAt: new Date(),
          employeeName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
        });
      }

      if (vm.AddCustomerForm.$dirty) {
        const addedPrimaryContPerson = _.filter(vm.primaryContPersonsDet, (item) => !item.personId);
        const customerInfo = {
          id: vm.customer.id,
          mfgName: vm.customer.mfgName,
          mfgCode: vm.customer.mfgCode,
          legalName: vm.customer.legalName,
          comments: vm.customer.comments,
          isCheckUnique: isCheckUnique ? isCheckUnique : false,
          isCustOrDisty: true,
          isActive: true,
          alias: vm.customer.alias,
          mfgType: vm.mfgType,
          isSetMFGAsCustomerAction: isSetMFGAsCustomerAction,
          fromPageRequest: vm.fromPageRequest,
          dateCodeFormatID: vm.autoCompleteDateCodeFormat.keyColumnId,
          customerType: vm.autoCompleteCustomerType ? vm.autoCompleteCustomerType.keyColumnId : null,
          salesCommissionTo: vm.autoCompleteSalesCommosssionTo.keyColumnId,
          freeOnBoardId: vm.customerType === vm.customerTypeConst.CUSTOMER ? vm.autoCompleteFOB.keyColumnId : null,
          manufacturerMapping: vm.customer.manufacturerMapping,
          //isExistingAliasAllowedToChange: false
          primaryContPersonsDet: addedPrimaryContPerson
        };

        if (vm.customer.id) {
          CheckAnyCustomPartSupplierMFRMapping(buttonCategory, customerInfo);
        }
        else {
          vm.cgBusyLoading = ManufacturerFactory.managecustomer().save(customerInfo).$promise.then((res) => {
            if (res.data && res.data.id) {
              vm.saveAndProceed(buttonCategory, res.data);
            } else {
              if (res.data && res.data.fieldName) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
                messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
                const obj = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    vm.SaveCustomer(false, buttonCategory);
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
              else if (res.data && res.data.status && res.data.status === 'alias') {
                const alias = res.data.data;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
                messageContent.message = stringFormat(messageContent.message, alias[0].alias, 'customer', alias[0].mfgCodemst.mfgCode);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
              }
              else if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
                displayCompanyNameUniqueMessage();
              }
              else if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
                displayCodeAliasUniqueMessage();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(true);
      }
    };

    function CheckAnyCustomPartSupplierMFRMapping(buttonCategory, customerInfo) {
      if (customerInfo.id && vm.autoCompleteDateCodeFormat && vm.autoCompleteDateCodeFormat.keyColumnId) {
        return ManufacturerFactory.CheckAnyCustomPartSupplierMFRMapping().save({ mfgCodeID: customerInfo.id }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFR_SUPPLIER_MAPPING_CUSTOM_PART);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.focusDateCode = false;
                manageCustomer(buttonCategory, customerInfo);
              }
            }, () => {
              $timeout(() => {
                if (vm.autoCompleteDateCodeFormat) {
                  $scope.$broadcast(vm.autoCompleteDateCodeFormat.inputName, null);
                  vm.autoCompleteDateCodeFormat.keyColumnId = null;
                }
              }, 0);
              vm.customer.dateCodeFormatID = null;
              vm.focusDateCode = true;
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.focusDateCode = false;
            manageCustomer(buttonCategory, customerInfo);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.focusDateCode = false;
        manageCustomer(buttonCategory, customerInfo);
      }
    }

    /* to add customer alias in alias list */
    vm.updateAliasList = (alias) => {
      if (vm.AddCustomerForm.mfgcodealias.$invalid) {
        return;
      }
      if (!vm.alias || (!vm.isMaster && vm.autoCompletemfgCode && !vm.autoCompletemfgCode.searchText)) {
        return;
      }
      const aliasObj = _.find(vm.customer.alias, (item) => item.alias === alias);
      if (aliasObj) {
        const uniqueObj = {
          isSetAliasNull: true
        };
        let messageContent = {};
        if (vm.customer.id) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
          messageContent.message = stringFormat(messageContent.message, vm.alias, 'Customer', vm.customer.mfgCode);
        }
        else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS_GLOBAL);
        }
        uniqueObj.messageContent = messageContent;
        displayAliasUniqueMessage(uniqueObj);
        vm.AddCustomerForm.$setDirty();
      }
      else {
        vm.cgBusyLoading = ManageMFGCodePopupFactory.checkUniqueMFGAlias().save({
          alias: vm.alias,
          mfgType: vm.mfgType,
          fromPageRequest: vm.fromPageRequest
        }).$promise.then((response) => {
          if (response && response.data && (response.data.mfgAliasExistsInfo || response.data.mfgCodeExistsInfo)) {
            if (response.data.mfgAliasExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias === response.data.mfgAliasExistsInfo.alias);
              if (aliasobj) {
                if (vm.alias) {
                  vm.customer.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    employeeName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.mfgAliasExistsInfo);
              }
            }
            else if (response.data.mfgCodeExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias === response.data.mfgCodeExistsInfo.mfgName);
              if (aliasobj) {
                if (vm.alias) {
                  vm.customer.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    employeeName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, 'Customer', response.data.mfgCodeExistsInfo.mfgCode);
                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true
                };
                displayAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.customer.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                employeeName: BaseService.loginUser.employee.firstName + ' ' + BaseService.loginUser.employee.lastName
              });
            }
            vm.alias = null;
          }
          vm.AddCustomerForm.$setDirty();
        });
      }
    };

    function checkValidateAliasDetails(mfgalias) {
      if (mfgalias) {
        //var obj = mfgalias;
        //var mfgObj = {};
        //mfgObj.mfgCode = obj.mfgCodemst.mfgCode;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, 'customer', mfgalias.mfgCodemst.mfgCode);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true
        };
        displayAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }

    /* to remove customer alias */
    vm.removeAliasFromList = ($event, $index) => {
      if (vm.customer.alias[$index].id) {
        DialogFactory.dialogService(
          CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
          CORE.MANAGE_PASSWORD_POPUP_VIEW,
          $event, null).then((data) => {
            if (data) {
              vm.cgBusyLoading = ManageMFGCodePopupFactory.checkMFGAliasRemovable().save({ password: data, mfgCode: vm.customer.alias[$index].alias }).$promise.then((res) => {
                if (res && res.data) {
                  if (res.status.toUpperCase() === CORE.ApiResponseTypeStatus.SUCCESS && res.data.isAliasAllowedToDelete) {
                    vm.customer.alias.splice($index, 1);
                    /* manually set form dirty */
                    vm.AddCustomerForm.$setDirty();
                    vm.AddCustomerForm.companyName.$dirty = true;
                    //vm.checkDirty = true;
                  }
                  else if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && !res.data.isAliasAllowedToDelete) {
                    const data = {
                      displayMessage: res.data.errMessage,
                      usedPartIDsList: res.data.usedPartIDsList
                    };
                    BaseService.existsAssyListForMFGAliasDelete(data);
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.customer.alias.splice($index, 1);
        /* manually set form dirty */
        vm.AddCustomerForm.$setDirty();
        vm.AddCustomerForm.companyName.$dirty = true;
      }
    };

    function getMfgSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        if (mfgcodes && mfgcodes.data) {
          mfgcodes.data.forEach((item) => {
            if (item.mfgCodeAlias) {
              item.mfgCodeAlias.forEach((alias) => {
                alias.employeeName = alias.user && alias.user.employee ? (alias.user.employee.firstName + ' ' + alias.user.employee.lastName) : '';
              });
            }
          });
          vm.mfgCodeDetail = mfgcodes.data;
          const selectedMfgCode = mfgcodes.data[0];
          if (!vm.autoCompletemfgCode) {
            vm.initAutoComplete();
            if (!vm.data.id) {
              $timeout(() => {
                if (vm.data.Name) {
                  vm.autoCompletemfgCode.searchText = vm.data.Name;
                  vm.alias = vm.data.Name;
                }
              });
            }
          } else {
            vm.customer.mfgCode = vm.autoCompletemfgCode.searchText;
          }
          if (searchObj && searchObj.mfgcodeID) {
            $timeout(() => {
              if (vm.autoCompletemfgCode) {
                vm.autoCompletemfgCode.searchText = selectedMfgCode.mfgCode;
                $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfgCode);
              }
            });
          }
          return mfgcodes.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddCustomerForm);
      if (isdirty) {
        const data = {
          form: vm.AddCustomerForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(true);
      }
    };

    // Function call on company name blue event and check company name exist or not and ask for confirmation
    vm.checkDuplicateCompanyName = () => {
      if (oldCompanyName !== vm.customer.mfgName) {
        if (vm.customer && vm.customer.mfgName && pageVisible) {
          vm.cgBusyLoading = ManufacturerFactory.checkDuplicateMFGName().query({
            mfgCodeMstID: vm.customer.id,
            mfgName: vm.customer.mfgName,
            mfgType: vm.mfgType
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
              displayCompanyNameUniqueMessage();
            }
          }).catch((error) => {
            oldCompanyName = null;
            return BaseService.getErrorLog(error);
          });
          oldCompanyName = angular.copy(vm.customer.mfgName);
        }
      }
    };

    /* display company name unique confirmation message */
    const displayCompanyNameUniqueMessage = () => {
      oldCompanyName = '';
      const companyNameEle = angular.element(document.querySelector('#companyName'));
      companyNameEle.focus();

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
      messageContent.message = stringFormat(messageContent.message, vm.customer.mfgName); //stringFormat(CORE.MESSAGE_CONSTANT.DUPLICATE_ENTRY, vm.customer.mfgName)
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      vm.customer.mfgName = null;
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName('companyName');
      });
    };

    // Function call on customer code blue event and check code exist or not
    vm.checkDuplicateCustomerCode = () => {
      if (oldCustomerCode !== vm.customer.mfgCode) {
        if (vm.AddCustomerForm.customerCode.$dirty && vm.customer.mfgCode) {
          vm.cgBusyLoading = ManufacturerFactory.checkDuplicateMFGCode().save({
            mfgCodeMstID: vm.customer.id,
            mfgCode: vm.customer.mfgCode,
            mfgType: vm.mfgType
          }).$promise.then((res) => {
            if (res && res.status.toUpperCase() === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
              displayCodeAliasUniqueMessage();
            }
          }).catch((error) => {
            oldCustomerCode = null;
            return BaseService.getErrorLog(error);
          });
          oldCustomerCode = angular.copy(vm.customer.mfgCode);
        }
      }
    };

    const displayCodeAliasUniqueMessage = () => {
      oldCustomerCode = '';
      const companyCodeEle = angular.element(document.querySelector('#companyCode'));
      companyCodeEle.focus();
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
      messageContent.message = stringFormat(messageContent.message, vm.customer.mfgCode);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      vm.customer.mfgCode = null;
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName('customerCode');
      });
    };

    function getDateCodeFormatList() {
      return DCFormatFactory.retriveDateCodeFormatList().query().$promise.then((dcFormatList) => {
        if (dcFormatList && dcFormatList.data) {
          vm.dateCodeFormatList = dcFormatList.data;
          return vm.dateCodeFormatList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    if (vm.mfgType.toUpperCase() !== CORE.MFG_TYPE.DIST) {
      vm.autoCompleteForCustomer = () => {
        vm.autoCompleteDateCodeFormat = {
          columnName: 'dateCodeFormatValue',
          keyColumnName: 'id',
          controllerName: USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
          viewTemplateURL: USER.ADMIN_DC_FORMAT_POPUP_VIEW,
          keyColumnId: vm.customer ? vm.customer.dateCodeFormatID : null,
          inputName: 'dateCodeFormatValue',
          placeholderName: vm.MFRDateCodeFormat,
          isRequired: false,
          isAddnew: true,
          callbackFn: getDateCodeFormatList,
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.autoCompleteDateCodeFormat.keyColumnId = item.id;
            }
            else {
              vm.autoCompleteDateCodeFormat.keyColumnId = null;
            }
          }
        };
        vm.autoCompleteCustomerType = {
          columnName: 'value',
          keyColumnName: 'id',
          keyColumnId: 'E',
          inputName: 'value',
          placeholderName: 'Customer Type',
          isRequired: true
        };
        vm.autoCompleteSalesCommosssionTo = {
          columnName: 'name',
          keyColumnName: 'id',
          keyColumnId: vm.customer && vm.customer.salesCommissionTo ? vm.customer.salesCommissionTo : null,
          controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
            pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
          },
          inputName: 'Sales Commission To',
          placeholderName: 'Sales Commission To',
          isRequired: true,
          isAddnew: true,
          callbackFn: getSalesCommissionEmployeeListbyCustomer
        };

        vm.autoCompleteFOB = {
          columnName: 'name',
          controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.customer ? (vm.customer.freeOnBoardId ? vm.customer.freeOnBoardId : null) : null,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_FOB_STATE],
            pageNameAccessLabel: CORE.PageName.fob
          },
          inputName: 'FOBCustomer',
          placeholderName: 'FOB',
          isRequired: false,
          isAddnew: true,
          callbackFn: getFOBList
        };
      };
      getDateCodeFormatList();
      vm.autoCompleteForCustomer();
    }
    if (vm.customerType === vm.CUSTOMER_TYPE_CONST.CUSTOMER) {
      /** Auto-complete for MFG code */
      vm.autoCompleteMappingMfgCode = {
        columnName: 'mfgCode',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'MFG',
        placeholderName: CORE.LabelConstant.MFG.MFG,
        isRequired: false,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer,
          isCustOrDisty: true
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgMappingSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            item.refMfgCodeMstID = item.id ? item.id : (item.refMfgCodeMstID ? item.refMfgCodeMstID : null);
            if (item.refMfgCodeMstID) {
              manufacturerMapping(item);
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteMappingMfgCode.inputName
          };
          return getMfgMappingSearch(searchObj);
        }
      };
    }

    vm.initAutoComplete = () => {
      vm.autoCompletemfgCode = {
        columnName: 'mfgCode',
        parentColumnName: 'mfgCodeAlias',
        keyColumnName: 'id',
        keyColumnId: data ? data.id : null,
        inputName: 'Search' + vm.label + 'Code',
        placeholderName: 'Search Code and Add',
        isRequired: true,
        isAddnew: false,
        isUppercaseSearchText: true,
        addData: { mfgType: data ? data.mfgType : null },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          selectedMFGCodeAlias = item;
          getMfgDetail(item);
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName,
            type: data ? data.mfgType : null
          };
          return getMfgSearch(searchObj);
        }
      };
    };

    /* mfg alias unique message */
    const displayAliasUniqueMessage = (uniqueObj) => {
      const obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName('mfgcodealias');
      }, () => {
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* set selected alias as default one and set it as mfgname */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'company');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customer.mfgName = aliasItem.alias;
            vm.customer.alias.map((item) => item.isDefaultAlias = false);
            aliasItem.isDefaultAlias = true;
            // Static code to enable save button
            vm.AddCustomerForm.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        });
      }
    };
    /* get customer details when apply from all mfg ditective */
    vm.customerDetails = (cid, isExplicitCall) => {
      const mfgInfo = {
        mfgType: vm.mfgType,
        fromPageRequest: vm.fromPageRequest
      };
      vm.cgBusyLoading = ManufacturerFactory.customer(mfgInfo).query({ id: cid, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((customer) => {
        vm.customer = angular.copy(customer.data);
        if (vm.customer) {
          vm.autoCompleteDateCodeFormat.keyColumnId = vm.customer.dateCodeFormatID;
          vm.autoCompleteSalesCommosssionTo.keyColumnId = vm.customer.salesCommissionTo;
          vm.autoCompleteFOB.keyColumnId = vm.customer.freeOnBoardId;
          oldCompanyName = vm.customer.mfgName;
          oldCustomerCode = vm.customer.mfgCode;
          if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
            if (vm.customer.supplier_mapping_mstSupplier && vm.customer.supplier_mapping_mstSupplier.length > 0) {
              vm.customer.manufacturerMapping = _.map(vm.customer.supplier_mapping_mstSupplier, (item) => ({
                id: item.id,
                refMfgCodeMstID: item.MfgCodeMstManufacturer.id,
                mfgCode: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.MfgCodeMstManufacturer.mfgCode, item.MfgCodeMstManufacturer.mfgName)
              }));
            } else {
              vm.customer.manufacturerMapping = [];
            }
            const selectedMfgCode = {
              mfgCode: vm.customer.mfgCode,
              mfgCodeAlias: vm.customer.mfgCodeAlias,
              id: vm.customer.id,
              mfgName: vm.customer.mfgName
            };
            $timeout(() => {
              vm.autoCompletemfgCode.searchText = selectedMfgCode.mfgCode;
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfgCode);
            });
          }
        }

        /* default alias */
        const aliaslist = vm.aliaslist = angular.copy(vm.customer.mfgCodeAlias);
        vm.customer.alias = [];
        aliaslist.forEach((data) => {
          vm.customer.alias.push({
            alias: data.alias,
            id: data.id,
            createdAt: data.createdAt,
            employeeName: data.user.employee.firstName + ' ' + data.user.employee.lastName,
            isSystemGenerated: data.alias.toUpperCase() === vm.customer.mfgName.toUpperCase() || data.alias.toUpperCase() === vm.customer.mfgCode.toUpperCase(),
            isDefaultAlias: data.alias.toUpperCase() === vm.customer.mfgName.toUpperCase(),
            createdAtValue: data.createdAtValue
          });
        });

        vm.customerCopy = angular.copy(vm.customer);
        if (!vm.customer) {
          vm.customer = { manufacturerMapping: [] };
        }
        if (isExplicitCall) {  /* if called from all mfg directive */
          /* if action is SetMFGAsCustomer then this is add customer action else update customer action */
          if (vm.customer.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG && vm.customer.isCustOrDisty === null) {
            isSetMFGAsCustomerAction = true;
          }
          else {
            isSetMFGAsCustomerAction = false;
          }
          vm.customer.isCustOrDisty = true;
        }
        $timeout(() => {
          if (vm.customer.id && vm.AddCustomerForm) {
            BaseService.checkFormValid(vm.AddCustomerForm, false);
            vm.checkDirtyObject = {
              columnName: [],
              oldModelName: vm.customerCopy,
              newModelName: vm.customer
            };
          }
        }, 0);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToFOBList = () => {
      BaseService.goToFOB();
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.employeelist = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };

    let pageVisible = true;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pageVisible = false;
      } else {
        pageVisible = true;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    window.addEventListener('blur', () => {
      pageVisible = false;
    }, false);
    window.addEventListener('focus', () => {
      pageVisible = true;
    }, false);

    //get mapping mfr search
    const getMfgMappingSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcode) => {
      if (vm.cid) {
        mfgcode.data = _.filter(mfgcode.data, (mfgData) => mfgData.id !== parseInt(vm.cid));
      }
      _.each(mfgcode.data, (item) => {
        item.refMfgCodeMstID = item.id;
        item.id = null;
        item.mfg = item.mfgCode;
        item.mfgCode = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
      });
      mfgcode.data = _.differenceWith(mfgcode.data, vm.customer.manufacturerMapping, (arrValue, othValue) => arrValue.refMfgCodeMstID === othValue.refMfgCodeMstID);
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(() => {
          if (vm.autoCompleteMappingMfgCode && vm.autoCompleteMappingMfgCode.inputName) {
            $scope.$broadcast(vm.autoCompleteMappingMfgCode.inputName, mfgcode.data[0]);
          }
        }, true);
      }
      return mfgcode.data;
    }).catch((error) => BaseService.getErrorLog(error));

    //mapping manufacturer
    const manufacturerMapping = (item) => {
      vm.customer.manufacturerMapping.push(item);
      $timeout(() => {
        $scope.$broadcast(vm.autoCompleteMappingMfgCode.inputName, null);
        setFocusByName(vm.autoCompleteMappingMfgCode.inputName);
      }, true);
    };

    vm.removeManufacturer = (item, index) => {
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Mapped Customer', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.AddCustomerForm.$setDirty(true);
            vm.customer.manufacturerMapping.splice(index, 1);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //link to go for manufacture master list page
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    /* to go at Edit Manufacture Code details page  */
    vm.goToManufacturer = (mfgCodeID) => {
      BaseService.goToManufacturer(mfgCodeID);
      return false;
    };

    /* Go to customer contact tab. */
    vm.goToCustomerContactPersonList = () => {
      if (vm.customer.id && vm.customerType) {
        BaseService.goToCustTypeContactPersonList(vm.customerType, vm.customer.id);
      }
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddCustomerForm);
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.reports.dynamicreports')
    .controller('DynamicReportAddUpdatePopupController', DynamicReportAddUpdatePopupController);

  /** @ngInject */
  function DynamicReportAddUpdatePopupController($mdDialog, $scope, data, CORE, NotificationFactory, DialogFactory, ReportMasterFactory, EntityFactory, REPORTS, BaseService, USER, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.parameterList = [];
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.reportTypeDropdown = REPORTS.reportTypeDropdown;
    vm.ReportCategory = CORE.CategoryType.ReportCategory;
    vm.entityList = [];
    vm.templeteList = [];
    vm.genericCategoryList = [];

    vm.reportCreateType = CORE.REPORT_CREATE_TYPE;
    vm.isSubmit = false;
    vm.isDisableRadioBtn = false;
    vm.reportModel = angular.copy(data);
    vm.disableAutoCompleteSearchReport = false;
    if (data) {
      vm.isTransactionReport = data.isTransactionReport; // shows Popup Open From Entity(Trasaction) list Page for add new Trasaction report.
      if (!vm.isTransactionReport) {
        vm.copyActive = angular.copy(data.isActive);
        vm.reportModel.reportType = (data.reportViewType === 1 || data.reportViewType === true) ? 1 : 0;
        vm.isDisableRadioBtn = data.isDisableRadioBtn ? true : false;
        vm.selectedCloneReportId = data.selectedCloneReportId ? data.selectedCloneReportId : null;
        vm.disableAutoCompleteSearchReport = vm.selectedCloneReportId !== null ? true : false;
        vm.isCopyTemplateReport = data.reportGenerationType === CORE.REPORT_CATEGORY.TEMPLATE_REPORT; // only use in Copy Template report.
        vm.isSystemGeneratedReport = data.isSystemGeneratedReport;
      } else {
        vm.isDisabledEntity = true;
      }
    }

    bindautoCompleteReportCategory();
    bindautoCompleteSearchReport();

    if (vm.reportModel && vm.reportModel.reportCategoryId) {
      const searchObj = {
        query: vm.reportModel.category
      };
      getGenericCategoryList(searchObj);
    }

    if (vm.disableAutoCompleteSearchReport) {
      const searchObj = {
        id: vm.selectedCloneReportId
      };
      getReportSearch(searchObj);
    }

    $timeout(() => {
      if (data && data.reportName) {
        vm.reportModel.reportName = data.reportName ? data.reportName : null;
      } else if (vm.selectedCloneReportId) {
        vm.reportModel.reportCreateType = vm.reportCreateType.CloneFromExisting;
      }
      else {
        vm.reportModel.reportCreateType = vm.reportCreateType.CreateNew;
        vm.reportModel.templateId = null;
        vm.reportModel.entityId = vm.isTransactionReport ? vm.reportModel.entityId : null;
        vm.reportModel.gencCategoryID = null;
      }
    });

    vm.id = null;
    vm.isSubmit = false;

    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };

    if (data && data.id) {
      vm.id = data.id;
      vm.isDefaultReport = (data.isDefaultReport === 1 || data.isDefaultReport === true) ? true : false;
      vm.defaultEntityID = data.entityId;
      vm.isDisabledEntity = data.entityId ? true : false;
      vm.reportGenerationType = data.reportGenerationType;
      //$timeout(() => {
      if (vm.id) {
        vm.reportModelCopy = _.clone(vm.reportModel);
        vm.checkDirtyObject = {
          columnName: ['reportNam'],
          oldModelName: vm.reportModelCopy,
          newModelName: vm.reportModel
        };
      }
      //}, 0);
    } else {
      vm.reportModel = vm.isTransactionReport ? vm.reportModel : {};
    }

    function bindautoCompleteReportCategory() {
      vm.autoCompleteReportCategory = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: 'report Category',
        placeholderName: '"Type here to search report category',
        isAddnew: true,
        addData: { headerTitle: CORE.CategoryType.ReportCategory.Title, Title: CORE.CategoryType.ReportCategory.Title },
        callbackFn: (obj) => {
          const searchObj = {
            id: obj.gencCategoryID
          };
          return getGenericCategoryList(searchObj);
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getGenericCategoryList(searchObj);
        }
        //onSelectCallbackFn: (obj) => {
        //}
      };
    }
    function bindautoCompleteSearchReport() {
      let searchObj = {
        entityId: vm.isTransactionReport ? vm.reportModel.entityId : null
      };
      vm.autoCompleteSearchReport = {
        columnName: 'reportName',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'SearchReport',
        placeholderName: 'Type here to search report',
        callbackFn: (obj) => {
          searchObj.id = obj.id;
          return getReportSearch(searchObj);
        },
        onSearchFn: (query) => {
          searchObj.query = query;
          return getReportSearch(searchObj);
        },
        onSelectCallbackFn: (obj) => {
          $scope.$broadcast(vm.autoCompleteReportCategory.inputName, '');
          if (obj) {
            vm.reportGenerationType = obj.reportGenerationType;
            vm.reportModel.reportCategoryId = obj.reportCategoryId;
            const searchObj = {
              id: obj.reportCategoryId
            };
            // call for set vm.reportModel.gencCategoryName
            getGenericCategoryList(searchObj);
            vm.reportModel.entityId = obj.entityId;
            vm.reportModel.isEndUserReport = obj.isEndUserReport;
            vm.isDisabledEntity = obj.entityId ? true : false;
            // only in clone from systemgenerated reprot
            if (vm.disableAutoCompleteSearchReport) {
              vm.reportModel.reportType = obj.reportViewType === true ? 1 : 0;
              vm.reportModel.additionalNotes = obj.additionalNotes;
              vm.reportModel.reportTitle = obj.reportTitle;
            }
          }
        }
      };
    }

    // Retrieve List of Design Report (new reporting Tool) by passing relate 'Report Name'
    function getReportSearch(searchObj) {
      return ReportMasterFactory.getReportNameSearch().query({ listObj: searchObj }).$promise.then((resReportList) => {
        var reportList = [];
        if (resReportList && resReportList.data && Array.isArray(resReportList.data)) {
          reportList = resReportList.data;
        }
        if (vm.disableAutoCompleteSearchReport) {
          $timeout(() => {
            if (vm.autoCompleteSearchReport && vm.autoCompleteSearchReport.inputName && resReportList.data.length > 0) {
              $scope.$broadcast(vm.autoCompleteSearchReport.inputName, resReportList.data[0]);
            }
          });
        }
        return reportList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Retrieve List of all existing Report template list
    function getTemplateList() {
      vm.templeteList = [];
      vm.cgBusyLoading = ReportMasterFactory.retrieveReportTempleteList().query().$promise.then((response) => {
        if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && Array.isArray(response.data)) {
          vm.templeteList = vm.templeteList.concat(response.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Retrieve List of generic report Category.
    function getGenericCategoryList(searchObj) {
      return EntityFactory.retrieveGenericReportCategories().query({ listObj: searchObj }).$promise.then((response) => {
        var genericCategoryList = [];
        if (response && response.data && Array.isArray(response.data)) {
          genericCategoryList = response.data;

          if (vm.reportModel.reportCategoryId || searchObj.id) {
            bindautoCompleteReportCategory();
            $timeout(() => {
              if (vm.autoCompleteReportCategory && vm.autoCompleteReportCategory.inputName && response.data.length > 0) {
                $scope.$broadcast(vm.autoCompleteReportCategory.inputName, response.data[0]);
              }
            });
          }
        }
        return genericCategoryList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Retrieve List of System Generated Entity
    function getEntityList() {
      vm.entityList = [];
      vm.cgBusyLoading = EntityFactory.retrieveSystemGeneratedEntities().query().$promise.then((response) => {
        if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.entity && Array.isArray(response.data.entity)) {
          vm.entityList = vm.entityList.concat(response.data.entity);

        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    getTemplateList();
    getEntityList();

    vm.changeEntity = () => {
      if (!(vm.defaultEntityID && vm.defaultEntityID === vm.reportModel.entityId)) {
        vm.isDefaultReport = false;
      }
    };

    vm.changeReportCreateType = () => {
      setFocus('reportName');
      vm.reportModel.templateId = vm.reportModel.reportCreateType === vm.reportCreateType.CreateNew ? vm.reportModel.templateId : undefined;
      vm.reportModel.gencCategoryID = undefined;
      vm.reportModel.entityId = vm.isTransactionReport ? vm.reportModel.entityId : undefined;
      //vm.reportModel.gencCategoryName = null;
      $scope.$broadcast(vm.autoCompleteReportCategory.inputName, '');
      vm.reportModel.entityName = null;
      vm.reportModel.reportType = '';
      vm.reportModel.reportTitle = '';
      vm.reportModel.additionalNotes = '';
      vm.reportModel.refReportId = vm.reportModel.reportCreateType === vm.reportCreateType.CloneFromExisting ? vm.reportModel.refReportId : undefined;
    };
    //save or update report
    vm.saveReport = () => {
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.createReportForm)) {
        BaseService.focusRequiredField(vm.createReportForm);
        vm.isSubmit = true;
        return;
      }
      const loginUser = BaseService.loginUser;
      const reportInfo = {
        id: vm.reportModel.id ? vm.reportModel.id : undefined,
        reportName: vm.reportModel.reportName,
        templateId: (vm.reportModel.reportCreateType === undefined || !(vm.reportModel.templateId)) ? null : Number(vm.reportModel.templateId),
        entityId: Number(vm.reportModel.entityId),
        reportGenerationType: vm.reportGenerationType,
        isEndUserReport: vm.reportModel.isEndUserReport && (vm.reportModel.isEndUserReport === 1 || vm.reportModel.isEndUserReport === true) ? true : false,
        reportCreateType: vm.reportModel.reportCreateType === undefined ? 0 : Number(vm.reportModel.reportCreateType),
        reportType: Number(vm.reportModel.reportType),
        gencCategoryID: Number(vm.autoCompleteReportCategory.keyColumnId),
        reportTitle: vm.reportModel.reportTitle,
        additionalNotes: vm.reportModel.additionalNotes,
        isDefaultReport: vm.isDefaultReport ? vm.isDefaultReport : false,
        userId: Number(loginUser.userid),
        userRoleId: Number(loginUser.defaultLoginRoleID)
      };
      if (!vm.id) {
        reportInfo.refReportId = vm.autoCompleteSearchReport.keyColumnId ? Number(vm.autoCompleteSearchReport.keyColumnId) : null;
      }

      vm.cgBusyLoading = ReportMasterFactory.saveReport(reportInfo).then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(response.data);
        }
        //if (response && response.status == CORE.ApiResponseTypeStatus.FAILED && response.errors.unique) {
        //  vm.reportModel.reportName = null;
        //  $timeout(function () {
        //    vm.clickCancel = false;
        //  }, 300);
        //}
      }).catch((error) => {
        vm.clickCancel = false;
        BaseService.getErrorLog(error);
      });
    };

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.createReportForm, vm.checkDirtyObject);
      if (isdirty) {
        const data = {
          form: vm.createReportForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // Check Duplication of Report name
    vm.checkNameUnique = (data, isExists) => {
      if (data) {
        const objs = {
          reportName: isExists ? data : null,
          id: vm.reportModel.id ? vm.reportModel.id : null
        };
        vm.cgBusyLoading = ReportMasterFactory.checkNameUnique().query(objs).$promise.then((res) => {
          if (res && res.errors) {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                if (isExists) {
                  vm.reportModel.reportName = null;
                  setFocusByName('reportName');
                }
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // redirect to Report Category Master.
    vm.goToReportCategoryList = () => {
      BaseService.goToReportCategoryList();
    };

    // redirect to Template Report List.
    vm.goToTemplateReportList = () => {
      BaseService.goToTemplateReportList();
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.createReportForm);
    });
  }
})();

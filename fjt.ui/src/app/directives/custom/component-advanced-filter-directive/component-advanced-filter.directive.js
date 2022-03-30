(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('manageComponemtAdvancedFilter', manageComponemtAdvancedFilter);
  function manageComponemtAdvancedFilter(CORE, USER, $q, $timeout, $filter, $state, ManageMFGCodePopupFactory, PartCostingFactory, RFQSettingFactory, ComponentFactory, BaseService, DialogFactory, NotificationFactory, MasterFactory, CertificateStandardFactory, CONFIGURATION, CountryMstFactory, AssyTypeFactory, ManufacturerFactory, $location) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        mfgType: '=',
        applyFilters: '=',
        clearGroupFilters: '=',
        clearGridData: '=',
        advancedFilterOptions: '=',
        search: '=?',
        packagingList: '=',
        packageCaseList: '=',
        rohsList: '=',
        filteredMfgCodeList: '=',
        filteredMfgCodeForSupplierPartsList: '=',
        filteredPartStatusList: '=',
        filteredPackagingList: '=',
        filteredPackageCaseList: '=',
        filteredFunctionalTypeList: '=',
        filteredExternalFunctionalTypeList: '=',
        filteredMountingTypeList: '=',
        filteredExternalMountingTypeList: '=',
        filteredPartTypeList: '=',
        filteredStandardsList: '=',
        filteredRohsList: '=',
        filteredExternalRohsStatusList: '=',
        filteredCountryList: '=',
        filteredOperationalAttributeList: '=',
        headerSearchText: '=',
        filteredAssemblyTypeList: '=',
        gridOptions: '='
      },
      templateUrl: 'app/directives/custom/component-advanced-filter-directive/component-advanced-filter.html',
      controller: manageComponemtAdvancedFilterPopupController,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function manageComponemtAdvancedFilterPopupController($scope, $element, $attrs) {
      const vm = this;
      vm.mfgType = $scope.mfgType;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.COMPONENT_UPLOAD_PART_FOR_PARTSTAT_TOOLTIP_MESSAGE = CORE.COMPONENT_UPLOAD_PART_FOR_PARTSTAT_TOOLTIP_MESSAGE;
      vm.COMPONENT_BOM_PARTS_FILTER_TOOLTIP_MESSAGE = CORE.COMPONENT_BOM_PARTS_FILTER_TOOLTIP_MESSAGE;
      vm.PackagingAliasFilter = CORE.PackagingAliasFilter;
      vm.AlternatePartFilter = CORE.AlternatePartFilter;
      vm.RoHSAlternatePartFilter = CORE.RoHSAlternatePartFilter;
      vm.PartUsedInAssemblyFilter = CORE.PartUsedInAssemblyFilter;
      vm.PartRestrictionSettings = CORE.PartRestrictionSettings;
      vm.ComponentListOrder = CORE.ComponentListOrder;
      vm.ComponentUsageCriteria = CORE.ComponentUsageCriteria;
      vm.ComponentAdvancePartNoFilterTypeDropDown = CORE.ComponentAdvancePartNoFilterTypeDropDown;
      vm.PartMasterAdvancedFilters = angular.copy(CORE.PartMasterAdvancedFilters);
      vm.PartMasterAdvancedFiltersHeaderSearch = vm.PartMasterAdvancedFilters.HeaderSearch;
      vm.PartCategory = CORE.PartCategory;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.numberOfMasterFiltersApplied = 0;
      vm.isMoreFilterVisible = false;
      vm.isMultiplePart = false;
      vm.isRefreshMasterFilters = false;
      vm.multiplePartNumbers = [];
      vm.multiplePartByUploadFileDetail = { uploadCount: 0 };
      vm.multipleBOMParts = [];
      vm.multipleInactiveBOMParts = [];
      vm.multipleActiveBOMParts = [];
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.isReversal = false;
      vm.isCPN = false;
      vm.isCustom = false;
      vm.partRestrictionSettingModel = [];
      vm.isBOMActivityStarted = false;
      vm.isExportControl = false;
      vm.isOperatingTemperatureBlank = false;
      vm.isIdenticalMfrPN = false;
      vm.isProductionPNEmpty = false;
      vm.isExcludeIncorrectPart = false;
      vm.partNoFilterType = 'C';
      vm.IsSupplier = false;
      vm.isHasSearchCriteria = false;
      if (vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST) {
        vm.IsSupplier = true;
        vm.PartMasterAdvancedFilters.Manufacturer.value = vm.LabelConstant.MFG.Supplier; // "Supplier";
      }

      vm.COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER);
      vm.COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER.message = stringFormat(vm.COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER.message, (vm.IsSupplier ? (vm.LabelConstant.MFG.SupplierPN + ', Other Part name and ' + vm.LabelConstant.MFG.MFGPN) : (vm.LabelConstant.MFG.MFGPN + ' and Other Part name')), (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN));

      vm.COMPONENT_ADVANCE_FILTER_ATTRIBUTE_SEARCH_PLACEHOLDER = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_ADVANCE_FILTER_ATTRIBUTE_SEARCH_PLACEHOLDER);
      vm.COMPONENT_ADVANCE_FILTER_ATTRIBUTE_SEARCH_PLACEHOLDER.message = stringFormat(vm.COMPONENT_ADVANCE_FILTER_ATTRIBUTE_SEARCH_PLACEHOLDER.message, (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN));

      vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT);
      vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT.message = stringFormat(vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT.message, (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN));

      vm.PartMasterAdvancedFilters.IdenticalMfrPN.value = stringFormat(vm.PartMasterAdvancedFilters.IdenticalMfrPN.value, (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN));
      vm.PartMasterAdvancedFilters.IdenticalMfrPN.helptext = stringFormat(vm.PartMasterAdvancedFilters.IdenticalMfrPN.helptext, (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN), (vm.IsSupplier ? vm.LabelConstant.MFG.Supplier : vm.LabelConstant.MFG.MFG));

      vm.todayDate = new Date();
      vm.fromCreatedOnDateOptions = {
        maxDate: vm.todayDate,
        appendToBody: true,
        fromCreatedOnDateOpenFlag: false
      };
      vm.toCreatedOnDateOptions = {
        minDate: vm.todayDate,
        maxDate: vm.todayDate,
        appendToBody: true,
        toCreatedOnDateOpenFlag: false
      };

      vm.externalValueType = {
        functionalType: 1,
        mountingType: 2,
        rohsStatus: 3
      };

      if ($scope.search) {
        vm.attributesSearch = $scope.search;
      }

      function active() {
        const searchObj = $location.search();
        vm.hasHeaderSearchKeywork = searchObj && (searchObj.headersearchkeywords) ? true : false;
        vm.isHasSearchCriteria = searchObj && (searchObj.keywords || searchObj.headersearchkeywords) ? true : false;
      };
      active();

      vm.componentOrderingModel = undefined;
      if ($scope.packagingList) {
        vm.packagingDetail = _.filter($scope.packagingList, (item) => { return item.id != null });
        vm.packagingDetailToDisplay = angular.copy(vm.packagingDetail);
      };
      if ($scope.packageCaseList) {
        vm.packageCaseDetail = _.filter($scope.packageCaseList, (item) => { return item.id != null });
        vm.packagaCaseDetailToDisplay = angular.copy(vm.packageCaseDetail);
      }

      /*passed RoHS list from main page to reduce multiple API call*/
      if ($scope.rohsList) {
        /*remove all option from filter list*/
        vm.rohsList = _.filter($scope.rohsList, (item) => { return item.id != null });
        vm.rohsListToDisplay = angular.copy(vm.rohsList);
      }
      //get data for mfgcode
      vm.getMfgSearch = (isMfgSearch) => {
        vm.mfrSearchText = undefined;
        var searchObj = {
          mfgType: isMfgSearch ? CORE.MFG_TYPE.MFG : vm.mfgType,
          isCodeFirst: true
        };

        $scope.$parent.vm.cgBusyLoading = ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.mfgCodeDetail = vm.mfgCodeListToDisplay = [];
          if (mfgcodes && mfgcodes.data) {
            vm.mfgCodeDetail = mfgcodes.data;
            if (!vm.isRefreshMasterFilters) {
              vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
            }
          }
          return vm.mfgCodeDetail;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //get data for disapproved supplier filter
      vm.getDisApprovedSupplierSearch = () => {
        vm.disapprovedSupplierSearchText = undefined;
        const searchObj = {
          mfgType: CORE.MFG_TYPE.DIST,
          isCodeFirst: true
        };

        $scope.$parent.vm.cgBusyLoading = ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.disapprovedSupplierCodeDetail = [];
          if (mfgcodes && mfgcodes.data) {
            vm.disapprovedSupplierCodeDetail = mfgcodes.data;
            vm.disapprovedSupplierListToDisplay = angular.copy(vm.disapprovedSupplierCodeDetail);
          }
          return vm.disapprovedSupplierCodeDetail;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getMfgForSupplierPartSearch = () => {
        vm.mfrForSupplierPartsSearchText = undefined;
        var searchObj = {
          mfgType: CORE.MFG_TYPE.MFG,
          isCodeFirst: true
        };

        $scope.$parent.vm.cgBusyLoading = ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.mfgCodeForSupplierPartsDetail = vm.mfgCodeForSupplierPartsListToDisplay = [];
          if (mfgcodes && mfgcodes.data) {
            vm.mfgCodeForSupplierPartsDetail = mfgcodes.data;
            if (!vm.isRefreshMasterFilters) {
              vm.mfgCodeForSupplierPartsListToDisplay = angular.copy(vm.mfgCodeForSupplierPartsDetail);
            }
          }
          return vm.mfgCodeForSupplierPartsDetail;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //get data for Packaging
      vm.getPackaging = () => {
        vm.packagingSearchText = undefined;
        $scope.$parent.vm.cgBusyLoading = PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
          vm.packagingDetail = vm.packagingDetailToDisplay = [];
          if (packaging && packaging.data) {
            _.each(packaging.data, (item) => {
              var obj = {
                id: item.id,
                value: item.name
              };
              vm.packagingDetail.push(obj);
            });
            if (!vm.isRefreshMasterFilters) {
              vm.packagingDetailToDisplay = angular.copy(vm.packagingDetail);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get data for Package Case List
      vm.getPackageCase = () => {
        vm.packageCaseSearchText = undefined;
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.getPackageCaseTypeList().query().$promise.then((packageDet) => {
          vm.packageCaseDetail = vm.packagaCaseDetailToDisplay = [];
          if (packageDet && packageDet.data) {
            _.each(packageDet.data, (item) => {
              var obj = {
                id: item.id,
                value: item.name
              };
              vm.packageCaseDetail.push(obj);
            });
            if (!vm.isRefreshMasterFilters) {
              vm.packagaCaseDetailToDisplay = angular.copy(vm.packageCaseDetail);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get list for part status
      vm.getGenericCategoryList = () => {
        vm.partStatusSearchText = undefined;
        $scope.$parent.vm.cgBusyLoading = RFQSettingFactory.getPartStatusList().query().$promise.then((partstatus) => {
          vm.partStatusList = vm.partStatusListToDisplay = [];
          if (partstatus && partstatus.data) {
            vm.partStatusList = partstatus.data;
            if (!vm.isRefreshMasterFilters) {
              vm.partStatusListToDisplay = angular.copy(vm.partStatusList);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      /* mountingType dropdown fill up */
      vm.getMountingTypeList = () => {
        vm.mountingTypeSearchText = undefined;
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
          vm.mountingTypeList = vm.mountingTypeListToDisplay = [];
          if (res && res.data) {
            vm.mountingTypeList = res.data;
            if (!vm.isRefreshMasterFilters) {
              vm.mountingTypeListToDisplay = angular.copy(vm.mountingTypeList);
            }
          }
          return vm.mountingTypeList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      /* Functional Type dropdown fill up */
      vm.getFunctionalType = () => {
        vm.functionalTypeSearchText = undefined;
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.getPartTypeList().query().$promise.then((res) => {
          vm.functionalTypeList = vm.functionalTypeListToDisplay = [];
          if (res && res.data) {
            vm.functionalTypeList = res.data;
            if (!vm.isRefreshMasterFilters) {
              vm.functionalTypeListToDisplay = angular.copy(vm.functionalTypeList);
            }
          }
          return vm.functionalTypeList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      //get external vlues from DB
      vm.getExternalFunctionalAndMountingTypeValueList = (type) => {
        switch (type) {
          case vm.externalValueType.functionalType:
            vm.functionalTypeExternalSearchText = undefined;
            break;
          case vm.externalValueType.mountingType:
            vm.mountingTypeExternalSearchText = undefined;
            break;
          case vm.externalValueType.rohsStatus:
            vm.rohsExternalSearchText = undefined;
            break;
          default:
            vm.functionalTypeExternalSearchText = undefined;
            vm.mountingTypeExternalSearchText = undefined;
            vm.rohsExternalSearchText = undefined;
            break;
        }
        var searchObj = { mfgType: vm.mfgType };
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.getExternalFunctionalAndMountingTypeValueList().query({ listObj: searchObj }).$promise.then((res) => {
          if (res && res.data) {
            vm.externalFunctionalTypeList = res.data.externalFunctionalType;
            vm.externalMountingTypeList = res.data.externalMountingType;
            vm.externalRoHSStatusList = res.data.externalRoHSStatus;
            if (!vm.isRefreshMasterFilters) {
              switch (type) {
                case vm.externalValueType.functionalType:
                  vm.externalFunctionalTypeListToDisplay = angular.copy(vm.externalFunctionalTypeList);
                  break;
                case vm.externalValueType.mountingType:
                  vm.externalMountingTypeListToDisplay = angular.copy(vm.externalMountingTypeList);
                  break;
                case vm.externalValueType.rohsStatus:
                  vm.externalRoHSStatusListToDisplay = angular.copy(vm.externalRoHSStatusList);
                  break;
                default:
                  vm.externalFunctionalTypeListToDisplay = angular.copy(vm.externalFunctionalTypeList);
                  vm.externalMountingTypeListToDisplay = angular.copy(vm.externalMountingTypeList);
                  vm.externalRoHSStatusListToDisplay = angular.copy(vm.externalRoHSStatusList);
                  break;
              }
            }
          }
          return $q.resolve(res);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      // Get part category master list
      vm.getPartCategoryMstList = () => {
        vm.partTypeSearchText = undefined;
        return $scope.$parent.vm.cgBusyLoading = MasterFactory.getPartCategoryMstList().query().$promise.then((response) => {
          vm.categoryList = vm.categoryListToDisplay = [];
          if (response && response.data) {
            vm.categoryList = response.data.map((item) => {
              return {
                id: item.id,
                Value: item.categoryName,
                partCategory: item.partCategory,
                epicorType: item.epicorType
              };
            });
            if (!vm.isRefreshMasterFilters) {
              vm.categoryListToDisplay = angular.copy(vm.categoryList);
            }
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      };
      vm.getAllCountryList = () => {
        vm.shippingCountrySearchText = undefined;
        return $scope.$parent.vm.cgBusyLoading = CountryMstFactory.getAllCountry().query().$promise.then((countries) => {
          vm.countryList = vm.countryListToDisplay = [];
          if (countries && countries.data) {
            vm.countryList = countries.data;
            vm.countryListToDisplay = angular.copy(vm.countryList);
          }
          return vm.countryList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      vm.getOperationalAttributeList = () => {
        vm.operationalAttributesSearchText = undefined;
        return $scope.$parent.vm.cgBusyLoading = ComponentFactory.getPartDynamicAttributeList().query().$promise.then((res) => {
          vm.operationalAttributeList = vm.operationalAttributeListToDisplay = [];
          if (res && res.data) {
            vm.operationalAttributeList = res.data;
            vm.operationalAttributeListToDisplay = angular.copy(vm.operationalAttributeList);
          }
          return vm.operationalAttributeList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      vm.getStandard = () => {
        vm.standardsSearchText = undefined;
        return $scope.$parent.vm.cgBusyLoading = CertificateStandardFactory.getCertificateStandardRole().query().$promise.then((response) => {
          vm.standardsList = [];
          vm.standardClass = [];
          if (response && response.data) {
            _.each(response.data, (item) => {
              if (item.isActive) {
                let certificateStandards = {
                  certificateStandardID: item.certificateStandardID,
                  fullName: item.fullName,
                  displayOrder: item.displayOrder
                }
                vm.standardsList.push(certificateStandards);
                if (item.CertificateStandard_Class.length > 0) {
                  _.each(item.CertificateStandard_Class, (standardClass) => {
                    if (item.isActive) {
                      vm.standardClass.push(standardClass);
                      let standardsClass = {
                        certificateStandardID: stringFormat("{0}:{1}", item.certificateStandardID, standardClass.classID),
                        fullName: stringFormat("{0} {1}", item.fullName, standardClass.className),
                        displayOrder: item.displayOrder
                      }
                      vm.standardsList.push(standardsClass);
                    }
                  });
                }
              }
            });
            if (vm.standardsList.length > 0)
              vm.standardsList = _.sortBy(vm.standardsList, ['displayOrder', 'fullName']);
            if (vm.standardClass.length > 0)
              vm.standardClass = _.sortBy(vm.standardClass, ['className']);
          }
          vm.standardsListToDisplay = angular.copy(vm.standardsList);
          return $q.resolve(vm.standardsList);
        });
      };

      //Get Assembly Type List
      vm.getAssemblyTypeList = () => {
        vm.assemblyTypeSearchText = undefined;
        return $scope.$parent.vm.cgBusyLoading = AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
          vm.assemblyTypeList = vm.assemblyTypeListToDisplay = [];
          if (response && response.data) {
            vm.assemblyTypeList = response.data;
            vm.assemblyTypeListToDisplay = angular.copy(vm.assemblyTypeList);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      // get all assembly list
      function getAssemblySearch(searchObj) {
        return ComponentFactory.getAllAssemblyBySearch().save({
          listObj: searchObj
        }).$promise.then((partList) => {
          if (partList && partList.data && partList.data.data) {
            vm.assemblySearchList = partList.data.data;
          }
          else {
            vm.assemblySearchList = [];
          }
          return vm.assemblySearchList;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      let initAutoComplete = () => {
        vm.autoCompleteSearchActiveAssy = {
          columnName: 'PIDCode',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'SearchActivePart',
          placeholderName: "Type here to search assembly",
          callbackFn: (obj) => {
          },
          isAddnew: false,
          addData: {
          },
          onSelectCallbackFn: (partDetail) => {
            if (partDetail) {
              var isExists = _.find(vm.multipleActiveBOMParts, (m) => { return m.id == partDetail.id });
              if (isExists) {
                var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.BOM_PART_ALREADY_SELECTED);
                messageContent.message = stringFormat(messageContent.message, partDetail.PIDCode);
                let alertModel = {
                  messageContent: messageContent
                };

                DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                  $scope.$broadcast(vm.autoCompleteSearchActiveAssy.inputName, null);
                  setFocusByName(vm.autoCompleteSearchActiveAssy.inputName);
                });
                return;
              }
              else {
                vm.multipleActiveBOMParts.push(partDetail);
              }

              $scope.$broadcast(vm.autoCompleteSearchActiveAssy.inputName, null);
            }
          },
          onSearchFn: (query) => {
            let searchObj = {
              query: query,
              isActiveAssembly: true
            }
            return getAssemblySearch(searchObj);
          }
        }

        vm.autoCompleteSearchInactiveAssy = {
          columnName: 'PIDCode',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'SearchInactivePart',
          placeholderName: "Type here to search assembly",
          callbackFn: (obj) => {
          },
          isAddnew: false,
          addData: {
          },
          onSelectCallbackFn: (partDetail) => {
            if (partDetail) {
              var isExists = _.find(vm.multipleInactiveBOMParts, (m) => { return m.id == partDetail.id });
              if (isExists) {
                var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.BOM_PART_ALREADY_SELECTED);
                messageContent.message = stringFormat(messageContent.message, partDetail.PIDCode);
                let alertModel = {
                  messageContent: messageContent
                };

                DialogFactory.messageAlertDialog(alertModel).then((yes) => {
                  $scope.$broadcast(vm.autoCompleteSearchInactiveAssy.inputName, null);
                  setFocusByName(vm.autoCompleteSearchInactiveAssy.inputName);
                });
                return;
              }
              else {
                vm.multipleInactiveBOMParts.push(partDetail);
              }

              $scope.$broadcast(vm.autoCompleteSearchInactiveAssy.inputName, null);
            }
          },
          onSearchFn: (query) => {
            let searchObj = {
              query: query,
              isActiveAssembly: false
            }
            return getAssemblySearch(searchObj);
          }
        }
      };
      initAutoComplete();
      // get RoHS List
      vm.getRoHSList = () => {
        vm.rohsSearchText = undefined;
        return $scope.$parent.vm.cgBusyLoading = MasterFactory.getRohsList().query().$promise.then((res) => {
          vm.rohsList = vm.rohsListToDisplay = [];
          if (res && res.data) {
            _.each(res.data, function (item) {
              var obj = {
                id: item.id,
                value: item.name
              }
              vm.rohsList.push(obj);
            });
            if (!vm.isRefreshMasterFilters) {
              vm.rohsListToDisplay = angular.copy(vm.rohsList);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      vm.cancel = () => {
        let isdirty = vm.checkFormDirty(vm.AdvancedFilters);
        if (isdirty) {
          BaseService.showWithoutSavingAlertForPopUp();
        } else {
          //$mdDialog.cancel();
        }
      };

      vm.checkFormDirty = (form, columnName) => {
        let checkDirty = BaseService.checkFormDirty(form, columnName);
        return checkDirty;
      };

      vm.checkDuplicatePartNumber = () => {
        if (/*vm.isMultiplePart &&*/ vm.attributesSearch) {
          if (vm.multiplePartNumbers.indexOf(vm.attributesSearch) >= 0 &&
            !(vm.attributesSearch.split(' ').length > 1 && vm.partNoFilterType === 'C')) {
            vm.filtersInfo.attributesSearch.$setValidity('duplicate', false);
          }
          else {
            vm.filtersInfo.attributesSearch.$setValidity('duplicate', true);
          }
        }
        else {
          vm.filtersInfo.attributesSearch.$setValidity('duplicate', true);
        }
      }
      //Get Tool tip for selected filters
      function getFilterTooltip(displayList, selectedModdel, idFieldName, valueFieldName, optionalLabel) {
        var maxTooltipLimit = 10;
        var isTooltipGreatrtthenLimit = false;
        var moreTooltipText = "<br />more...";
        //((Array.isArray(selectedModdel) ? selectedModdel.length : true))
        //above condition to check non array models like "Part GRoup"
        if (displayList && displayList.length && selectedModdel && ((Array.isArray(selectedModdel) ? selectedModdel.length : true))) {
          var toolTipText;
          if (Array.isArray(selectedModdel)) {
            toolTipText = displayList.filter(function (item) {
              return item[idFieldName] && selectedModdel.includes(item[idFieldName].toString());
            });
          }
          else {
            toolTipText = displayList.filter(function (item) {
              return item[idFieldName] == selectedModdel;
            });
          }
          if (toolTipText && toolTipText.length > maxTooltipLimit) {
            toolTipText = toolTipText.splice(0, maxTooltipLimit);
            isTooltipGreatrtthenLimit = true;
          }
          toolTipText = toolTipText.map((a) => { return a[valueFieldName] });
          return (optionalLabel ? (optionalLabel + ": ") : "") + toolTipText.join("<br />") + (isTooltipGreatrtthenLimit ? moreTooltipText : "") + (optionalLabel ? "<br />" : "");
        }
        else {
          return "";
        }
      }
      //set Filter Labels
      function setFilteredLabels(canReGenerateTootip) {
        vm.PartMasterAdvancedFilters.HeaderSearch.isDeleted = !($scope.headerSearchText && $scope.headerSearchText.length > 0);
        vm.PartMasterAdvancedFilters.HeaderSearch.value = ($scope.headerSearchText ? $scope.headerSearchText : "");

        vm.PartMasterAdvancedFilters.Manufacturer.isDeleted = !(vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0);
        vm.PartMasterAdvancedFilters.ManufacturerForSupplierParts.isDeleted = !(vm.mfgCodeForSupplierPartsDetailModel && vm.mfgCodeForSupplierPartsDetailModel.length > 0);
        vm.PartMasterAdvancedFilters.PartStatus.isDeleted = !(vm.partStatusListModel && vm.partStatusListModel.length > 0);
        vm.PartMasterAdvancedFilters.Packaging.isDeleted = !(vm.packagingDetailModel && vm.packagingDetailModel.length > 0);
        vm.PartMasterAdvancedFilters.FunctionalType.isDeleted = !(vm.functionalTypeListModel && vm.functionalTypeListModel.length > 0);
        vm.PartMasterAdvancedFilters.ExternalFunctionalType.isDeleted = !(vm.externalFunctionalTypeListModel && vm.externalFunctionalTypeListModel.length > 0);
        vm.PartMasterAdvancedFilters.MountingType.isDeleted = !(vm.mountingTypeListModel && vm.mountingTypeListModel.length > 0);
        vm.PartMasterAdvancedFilters.ExternalMountingType.isDeleted = !(vm.externalMountingTypeListModel && vm.externalMountingTypeListModel.length > 0);
        vm.PartMasterAdvancedFilters.PartGroups.isDeleted = !(vm.packagingAlias || vm.alternatePart || vm.roHSAlternatePart || vm.partUsedInAssembly);
        vm.PartMasterAdvancedFilters.Standards.isDeleted = !(vm.allStandardsModel && vm.allStandardsModel.length > 0);
        vm.PartMasterAdvancedFilters.PartType.isDeleted = !(vm.partTypeModel && vm.partTypeModel.length > 0);
        vm.PartMasterAdvancedFilters.AssemblyType.isDeleted = !(vm.assemblyTypeModel && vm.assemblyTypeModel.length > 0);
        vm.PartMasterAdvancedFilters.RoHS.isDeleted = !(vm.rohsModel && vm.rohsModel.length > 0);
        vm.PartMasterAdvancedFilters.ExternalRoHS.isDeleted = !(vm.externalRoHSStatusListModel && vm.externalRoHSStatusListModel.length > 0);
        vm.PartMasterAdvancedFilters.AcceptableShippingCountry.isDeleted = !(vm.acceptableShippingCountryModel && vm.acceptableShippingCountryModel.length > 0);
        vm.PartMasterAdvancedFilters.OperationalAttributes.isDeleted = !(vm.operationalAttributeModel && vm.operationalAttributeModel.length > 0);
        vm.PartMasterAdvancedFilters.DisapprovedSuppliers.isDeleted = !(vm.disapprovedSupplierModel && vm.disapprovedSupplierModel.length > 0);
        vm.PartMasterAdvancedFilters.ReversalParts.isDeleted = !(vm.isReversal);
        vm.PartMasterAdvancedFilters.CPNParts.isDeleted = !(vm.isCPN);
        vm.PartMasterAdvancedFilters.CustomParts.isDeleted = !(vm.isCustom);
        vm.PartMasterAdvancedFilters.AssemblieswithActivityStarted.isDeleted = !(vm.isBOMActivityStarted);
        vm.PartMasterAdvancedFilters.ExportControlled.isDeleted = !(vm.isExportControl);
        vm.PartMasterAdvancedFilters.OperatingTemperatureBlank.isDeleted = !(vm.isOperatingTemperatureBlank);
        vm.PartMasterAdvancedFilters.DateFilters.isDeleted = !(vm.obsoleteDate);
        vm.PartMasterAdvancedFilters.IdenticalMfrPN.isDeleted = !(vm.isIdenticalMfrPN);
        vm.PartMasterAdvancedFilters.ProductionPNEmpty.isDeleted = !(vm.isProductionPNEmpty);
        vm.PartMasterAdvancedFilters.ExcludeIncorrectPart.isDeleted = !(vm.isExcludeIncorrectPart);
        vm.PartMasterAdvancedFilters.CreatedOn.isDeleted = !(vm.fromCreatedOnDate || vm.toCreatedOnDate);
        vm.PartMasterAdvancedFilters.PackageCaseType.isDeleted = !(vm.packageCaseDetailModel && vm.packageCaseDetailModel.length > 0);
        vm.PartMasterAdvancedFilters.PartRestrictionSetting.isDeleted = !(vm.partRestrictionSettingModel && vm.partRestrictionSettingModel.length > 0);

        //==>>>Set filter tool-tip
        if (canReGenerateTootip) {
          vm.PartMasterAdvancedFilters.Manufacturer.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.mfgCodeDetailModel, 'id', 'mfgCodeName');
          vm.PartMasterAdvancedFilters.ManufacturerForSupplierParts.tooltip = getFilterTooltip(vm.mfgCodeForSupplierPartsListToDisplay, vm.mfgCodeForSupplierPartsDetailModel, 'id', 'mfgCodeName');
          vm.PartMasterAdvancedFilters.PartStatus.tooltip = getFilterTooltip(vm.partStatusListToDisplay, vm.partStatusListModel, 'id', 'name');
          vm.PartMasterAdvancedFilters.Packaging.tooltip = getFilterTooltip(vm.packagingDetailToDisplay, vm.packagingDetailModel, 'id', 'value');
          vm.PartMasterAdvancedFilters.FunctionalType.tooltip = getFilterTooltip(vm.functionalTypeListToDisplay, vm.functionalTypeListModel, 'id', 'partTypeName');
          vm.PartMasterAdvancedFilters.ExternalFunctionalType.tooltip = getFilterTooltip(vm.externalFunctionalTypeListToDisplay, vm.externalFunctionalTypeListModel, 'functionalCategoryText', 'functionalCategoryText');
          vm.PartMasterAdvancedFilters.MountingType.tooltip = getFilterTooltip(vm.mountingTypeListToDisplay, vm.mountingTypeListModel, 'id', 'name');
          vm.PartMasterAdvancedFilters.ExternalMountingType.tooltip = getFilterTooltip(vm.externalMountingTypeListToDisplay, vm.externalMountingTypeListModel, 'mountingTypeText', 'mountingTypeText');

          vm.PartMasterAdvancedFilters.PartGroups.tooltip = getFilterTooltip(vm.PackagingAliasFilter, vm.packagingAlias, 'Value', 'Key', 'Packaging Alias');
          vm.PartMasterAdvancedFilters.PartGroups.tooltip += getFilterTooltip(vm.AlternatePartFilter, vm.alternatePart, 'Value', 'Key', 'Alternate');
          vm.PartMasterAdvancedFilters.PartGroups.tooltip += getFilterTooltip(vm.RoHSAlternatePartFilter, vm.roHSAlternatePart, 'Value', 'Key', 'RoHS Replacement');
          vm.PartMasterAdvancedFilters.PartGroups.tooltip += getFilterTooltip(vm.PartUsedInAssemblyFilter, vm.partUsedInAssembly, 'Value', 'Key', 'BOM Parts');

          vm.PartMasterAdvancedFilters.Standards.tooltip = getFilterTooltip(vm.standardsListToDisplay, vm.allStandardsModel, 'certificateStandardID', 'fullName');
          vm.PartMasterAdvancedFilters.PartType.tooltip = getFilterTooltip(vm.categoryListToDisplay, vm.partTypeModel, 'id', 'Value');
          vm.PartMasterAdvancedFilters.RoHS.tooltip = getFilterTooltip(vm.rohsListToDisplay, vm.rohsModel, 'id', 'value');
          vm.PartMasterAdvancedFilters.ExternalRoHS.tooltip = getFilterTooltip(vm.externalRoHSStatusListToDisplay, vm.externalRoHSStatusListModel, 'rohsText', 'rohsText');
          vm.PartMasterAdvancedFilters.AcceptableShippingCountry.tooltip = getFilterTooltip(vm.countryListToDisplay, vm.acceptableShippingCountryModel, 'countryID', 'countryName');
          vm.PartMasterAdvancedFilters.OperationalAttributes.tooltip = getFilterTooltip(vm.operationalAttributeListToDisplay, vm.operationalAttributeModel, 'id', 'attributeName');
          vm.PartMasterAdvancedFilters.DisapprovedSuppliers.tooltip = getFilterTooltip(vm.disapprovedSupplierCodeDetail, vm.disapprovedSupplierModel, 'id', 'mfgCodeName');
          vm.PartMasterAdvancedFilters.AssemblyType.tooltip = getFilterTooltip(vm.assemblyTypeListToDisplay, vm.assemblyTypeModel, 'id', 'name');
          vm.PartMasterAdvancedFilters.PackageCaseType.tooltip = getFilterTooltip(vm.packagaCaseDetailToDisplay, vm.packageCaseDetailModel, 'id', 'value');
          vm.PartMasterAdvancedFilters.PartRestrictionSetting.tooltip = getFilterTooltip(vm.PartRestrictionSettings, vm.partRestrictionSettingModel, 'Name', 'Name');
          if (vm.obsoleteDate) {
            vm.PartMasterAdvancedFilters.DateFilters.tooltip = 'Obsolete Date: ' + $filter('date')(new Date(vm.obsoleteDate), vm.DefaultDateFormat);
          }
          if (vm.fromCreatedOnDate && vm.toCreatedOnDate) {
            vm.PartMasterAdvancedFilters.CreatedOn.tooltip = 'Created On From:' + $filter('date')(new Date(vm.fromCreatedOnDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.toCreatedOnDate), vm.DefaultDateFormat);
          }
          else if (vm.fromCreatedOnDate) {
            vm.PartMasterAdvancedFilters.CreatedOn.tooltip = 'Created On: ' + $filter('date')(new Date(vm.fromCreatedOnDate), vm.DefaultDateFormat);
          }
        }
        //<<<==Set filter tool-tip

        vm.numberOfMasterFiltersApplied = _.filter(vm.PartMasterAdvancedFilters, function (num) { return num.isDeleted == false; }).length;
      }

      vm.search = (event, hasKeyword) => {
        if ((!event || event.keyCode === 13) && vm.filtersInfo.$valid) {
          if (event && vm.attributesSearch) {
            if (vm.filtersInfo.$valid) {
              const attributeArrayLength = vm.attributesSearch.split(' ').length;
              if (vm.multiplePartNumbers.indexOf(vm.attributesSearch) < 0 ||
                (attributeArrayLength > 1 && vm.partNoFilterType === 'C')) {
                if (vm.isMultiplePart || attributeArrayLength === 1 || vm.partNoFilterType === 'E') {
                  vm.multiplePartNumbers.push(vm.attributesSearch);
                }
                else if (!vm.isMultiplePart && attributeArrayLength > 1) {
                  _.each(vm.attributesSearch.split(' '), (item) => {
                    if (vm.multiplePartNumbers.indexOf(item) < 0) {
                      vm.multiplePartNumbers.push(item);
                    }
                  });
                }
                vm.attributesSearch = '';
              }
              else {
                vm.checkDuplicatePartNumber();
              }
            }
          }

          vm.checkDuplicatePartNumber();
          const headerSearch = $location.search();
          if (hasKeyword) {
            const headerSearch = $location.search();
            hasKeyword = headerSearch.mountingtype && headerSearch.functionaltype ? false : hasKeyword;
          }
          const returnObject = getSelectedFilters();
          returnObject.isGridVisible = true;
          if ($scope.applyFilters) {
            vm.isRefreshMasterFilters = true;
            $scope.applyFilters(returnObject, false, null, headerSearch, hasKeyword);

            setFilteredLabels(true);
          }
        }
      };
      vm.onMultiplePartChange = () => {
        vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT);
        if (vm.isMultiplePart) {
          vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT.message = stringFormat(vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT.message, (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN));
          vm.partNoFilterType = 'E';
        }
        else {
          vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT.message = stringFormat(vm.COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT.message, (vm.IsSupplier ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN) + ' or Attribute');
          vm.partNoFilterType = 'C';
        }
        if (/*!vm.isMultiplePart &&*/ vm.multiplePartNumbers.length > 0 || vm.multiplePartByUploadFileDetail.uploadCount > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_ADVANCE_FILTER_MULTIPLE_PART_UNCHECK_CONFIRMATION_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, (!vm.isMultiplePart ? 'Search Multiple Parts' : 'Attributes'));
          const obj = {
            messageContent: messageContent,
            btnText: vm.CORE_MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: vm.CORE_MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.multiplePartNumbers = [];
            vm.attributesSearch = '';
            vm.multiplePartByUploadFileDetail = { uploadCount: 0 };
            vm.checkDuplicatePartNumber();
          }, () => {
            //vm.isMultiplePart = true;
          });
        }
        else {
          vm.attributesSearch = '';
        }
      };
      vm.removePartNumber = (item, $index) => {
        if (vm.multiplePartNumbers && vm.multiplePartNumbers.length > 0) {
          /*Confirmation message before remove search criteria was removed as per request by Mr. Jignesh Kanani on 14th November 2019*/
          vm.multiplePartNumbers.splice($index, 1);
          vm.checkDuplicatePartNumber();
          vm.search();
        }
      }
      vm.removeBOMPart = (item, $index) => {
        if (vm.multipleBOMParts && vm.multipleBOMParts.length > 0) {
          vm.multipleBOMParts.splice($index, 1);
          if (vm.multipleActiveBOMParts && vm.multipleActiveBOMParts.length > 0) {
            var findIndex = _.findIndex(vm.multipleActiveBOMParts, (data) => { return data.id == item.id });
            if (findIndex >= 0) {
              vm.removeActiveBOMPart(item, findIndex);
            }
          }
          if (vm.multipleInactiveBOMParts && vm.multipleInactiveBOMParts.length > 0) {
            var findIndex = _.findIndex(vm.multipleInactiveBOMParts, (data) => { return data.id == item.id });
            if (findIndex >= 0) {
              vm.removeInactiveBOMPart(item, findIndex);
            }
          }
          vm.search();
        }
      }
      vm.removeActiveBOMPart = (item, $index) => {
        if (vm.multipleActiveBOMParts && vm.multipleActiveBOMParts.length > 0) {
          vm.multipleActiveBOMParts.splice($index, 1);
        }
      }
      vm.removeInactiveBOMPart = (item, $index) => {
        if (vm.multipleInactiveBOMParts && vm.multipleInactiveBOMParts.length > 0) {
          vm.multipleInactiveBOMParts.splice($index, 1);
        }
      }
      /**Set From Date To Date for Usage Calculation
       * /
       * @param {any} returnObject
       */
      function setUsageCalculationDate(returnObject) {
        returnObject.fromDate = null;
        returnObject.toDate = null;
        var currentDate = BaseService.getCurrentDateTime();
        switch (vm.componentUsageCriteriaModel) {
          case 'CURRENT_MONTH':
            returnObject.fromDate = moment(currentDate).startOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            returnObject.toDate = moment(currentDate).endOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case 'CURRENT_QUARTER':
            returnObject.fromDate = moment(currentDate).startOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            returnObject.toDate = moment(currentDate).endOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case 'CURRENT_YEAR':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  returnObject.fromDate = moment(currentDate).startOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  returnObject.toDate = moment(currentDate).endOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  var date = new Date(currentDate);
                  returnObject.fromDate = new Date(date.getFullYear() - 1, 3, 1);/*3 Means April month [as moment starting 0 as january, 1 is first date of the month*/
                  returnObject.toDate = new Date(date.getFullYear(), 3, 0);/*+1 Added One Year to current Year, 3 Means April month [as moment starting 0 as january, 0 is to take previous months last date]*/
                  break;
              }
            }
            break;
          case 'LAST_MONTH':
            returnObject.fromDate = moment(currentDate).subtract(1, 'months').startOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            returnObject.toDate = moment(currentDate).subtract(1, 'months').endOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case 'LAST_QUARTER':
            returnObject.fromDate = moment(currentDate).subtract(3, 'months').startOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            returnObject.toDate = moment(currentDate).subtract(3, 'months').endOf('quarter').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case 'LAST_YEAR':
            {
              switch (_accountingYear) {
                case CONFIGURATION.ACCOUNTINGYEAR.CALENDARYEAR:
                  returnObject.fromDate = moment(currentDate).subtract(12, 'months').startOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  returnObject.toDate = moment(currentDate).subtract(12, 'months').endOf('year').format(CORE.MOMENT_DATE_TIME_FORMAT);
                  break;
                case CONFIGURATION.ACCOUNTINGYEAR.FISCALYEAR:
                  var date = new Date(currentDate);
                  returnObject.fromDate = new Date(date.getFullYear() - 2, 3, 1);/*moment start month from 0(zero) as january*/
                  returnObject.toDate = new Date(date.getFullYear() - 1, 3, 0);
                  break;
              }
            }
            break;
          case 'TTM':
            returnObject.fromDate = moment(currentDate).subtract(12, 'months').format(CORE.MOMENT_DATE_TIME_FORMAT);
            returnObject.toDate = moment(currentDate).subtract(1, 'day').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
          case 'LIFE_TIME':/*to pass dummy date in case of life time we are not going to filter date wise*/
            returnObject.fromDate = moment(currentDate).startOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            returnObject.toDate = moment(currentDate).endOf('month').format(CORE.MOMENT_DATE_TIME_FORMAT);
            break;
        }
        returnObject.fromDate = BaseService.getAPIFormatedDate(returnObject.fromDate);
        returnObject.toDate = BaseService.getAPIFormatedDate(returnObject.toDate);
      }

      function getEcoDfmColumnVisibleOrNot(returnObject) {
        returnObject.isEcoDfmColumnVisible = false;
        if (returnObject && returnObject.partTypeModel && returnObject.partTypeModel.length &&
          vm.categoryList && vm.categoryList.length) {
          var resTemp = _.filter(vm.categoryList, (item) => { return returnObject.partTypeModel.some(i => i == item.id) });
          if (resTemp) {
            returnObject.isEcoDfmColumnVisible = !resTemp.some(item => item.partCategory != vm.PartCategory.SubAssembly);
          }
        }
      }

      vm.onComponentOrderingChange = () => {
        if (vm.componentOrderingModel == 'USAGE' && vm.ComponentUsageCriteria && vm.ComponentUsageCriteria.length > 0) {
          vm.componentUsageCriteriaModel = vm.ComponentUsageCriteria[0].key;
        }
        else {
          vm.componentUsageCriteriaModel = undefined;
        }
        vm.setSelectedFilterValues();
      }
      vm.setSelectedFilterValues = () => {
        var returnObject = getSelectedFilters();

        if ($scope.advancedFilterOptions)
          $scope.advancedFilterOptions = returnObject;
      }
      function getSelectedFilters() {
        var certificateStandards = [];
        var standardsClass = [];
        var returnObject = [];
        returnObject.attributesSearchHeader = $scope.headerSearchText;
        returnObject.mfgCodeDetailModel = vm.mfgCodeDetailModel;
        returnObject.mfgCodeForSupplierPartsDetailModel = vm.mfgCodeForSupplierPartsDetailModel;
        returnObject.packagingDetailModel = vm.packagingDetailModel;
        returnObject.partStatusListModel = vm.partStatusListModel;
        returnObject.mountingTypeListModel = vm.mountingTypeListModel;
        returnObject.externalMountingTypeListModel = vm.externalMountingTypeListModel;
        returnObject.functionalTypeListModel = vm.functionalTypeListModel;
        returnObject.externalFunctionalTypeListModel = vm.externalFunctionalTypeListModel;
        returnObject.packagingAlias = vm.packagingAlias;
        returnObject.alternatePart = vm.alternatePart;
        returnObject.roHSAlternatePart = vm.roHSAlternatePart;
        returnObject.partUsedInAssembly = vm.partUsedInAssembly;
        returnObject.partTypeModel = vm.partTypeModel;
        returnObject.assemblyModel = [];
        vm.multipleBOMParts = [];
        if (vm.multipleActiveBOMParts && vm.multipleActiveBOMParts.length) {
          _.each(vm.multipleActiveBOMParts, (i) => {
            returnObject.assemblyModel.push(i.id);
            vm.multipleBOMParts.push(i);
          });
        }
        if (vm.multipleInactiveBOMParts && vm.multipleInactiveBOMParts.length) {
          _.each(vm.multipleInactiveBOMParts, (i) => {
            returnObject.assemblyModel.push(i.id);
            vm.multipleBOMParts.push(i);
          });
        }
        returnObject.assemblyTypeModel = vm.assemblyTypeModel;
        returnObject.rohsModel = vm.rohsModel;
        returnObject.externalRoHSStatusListModel = vm.externalRoHSStatusListModel;
        returnObject.isReversal = vm.isReversal;
        returnObject.isCPN = vm.isCPN;
        returnObject.isCustom = vm.isCustom;
        returnObject.operationalAttributeModel = vm.operationalAttributeModel;
        returnObject.disapprovedSupplierModel = vm.disapprovedSupplierModel;
        returnObject.acceptableShippingCountryModel = vm.acceptableShippingCountryModel;
        returnObject.isBOMActivityStarted = vm.isBOMActivityStarted;
        returnObject.isExportControl = vm.isExportControl;
        returnObject.isOperatingTemperatureBlank = vm.isOperatingTemperatureBlank;
        returnObject.obsoleteDate = vm.obsoleteDate;
        returnObject.fromCreatedOnDate = vm.fromCreatedOnDate;
        returnObject.toCreatedOnDate = vm.toCreatedOnDate;
        returnObject.isIdenticalMfrPN = vm.isIdenticalMfrPN;
        returnObject.isProductionPNEmpty = vm.isProductionPNEmpty;
        returnObject.isExcludeIncorrectPart = vm.isExcludeIncorrectPart;
        returnObject.multiplePartFilterFieldName = vm.multiplePartByUploadFileDetail && vm.multiplePartByUploadFileDetail.filterFieldName ? vm.multiplePartByUploadFileDetail.filterFieldName : null;
        returnObject.multiplePartByUploadFileDetail = vm.multiplePartByUploadFileDetail && vm.multiplePartByUploadFileDetail.uploadData ? vm.multiplePartByUploadFileDetail.uploadData : null;
        returnObject.packageCaseDetailModel = vm.packageCaseDetailModel;

        const objRestrictUSEwithpermission = _.find(vm.partRestrictionSettingModel, (data) => data === CORE.PartRestrictionSettings[0].Name);
        const objRestrictPackagingUseWithpermission = _.find(vm.partRestrictionSettingModel, (data) => data === CORE.PartRestrictionSettings[1].Name);
        const objRestrictUsePermanently = _.find(vm.partRestrictionSettingModel, (data) => data === CORE.PartRestrictionSettings[2].Name);
        const objRestrictPackagingUsePermanently = _.find(vm.partRestrictionSettingModel, (data) => data === CORE.PartRestrictionSettings[3].Name);

        returnObject.restrictUSEwithpermission = objRestrictUSEwithpermission ? true : false;
        returnObject.restrictPackagingUseWithpermission = objRestrictPackagingUseWithpermission ? true : false;
        returnObject.restrictUsePermanently = objRestrictUsePermanently ? true : false;
        returnObject.restrictPackagingUsePermanently = objRestrictPackagingUsePermanently ? true : false;
        if (vm.allStandardsModel && vm.allStandardsModel.length > 0) {
          certificateStandards = [];
          standardsClass = [];
          _.each(vm.allStandardsModel, (item) => {
            if (item.contains(':')) {
              standardsClass.push(item.split(':')[1]);
            }
            else {
              certificateStandards.push(item);
            }
          });
          returnObject.certificateStandards = certificateStandards;
          returnObject.standardsClass = standardsClass;
        }
        returnObject.componentOrdering = vm.componentOrderingModel;
        returnObject.componentUsageCriteria = vm.componentUsageCriteriaModel;
        returnObject.isRefreshMasterFilters = true; //vm.isRefreshMasterFilters;
        setUsageCalculationDate(returnObject);
        getEcoDfmColumnVisibleOrNot(returnObject);
        /*if (vm.attributesSearch && !vm.isMultiplePart)
          returnObject.attributesSearch = vm.attributesSearch.replace(/\"/g, '\\"').replace(/\'/g, "\\'");

        if (vm.isMultiplePart && vm.multiplePartNumbers) {
          returnObject.multiplePartNumbers = vm.multiplePartNumbers;
          returnObject.multiplePartNumbers = _.map(vm.multiplePartNumbers, (item) => { return item.replace(/\"/g, '\\"').replace(/\'/g, "\\'"); });
        }*/
        if (vm.multiplePartNumbers) {
          if (!vm.isMultiplePart) {
            returnObject.attributesSearch = _.map(vm.multiplePartNumbers, (item) => item.replace('\\', '\\\\\\\\\\'));
            returnObject.attributesSearch = _.map(returnObject.attributesSearch, (item) => item.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]').replace(/\(/g, '\\\\(').replace(/\)/g, '\\\\)').replace(/\+/g, '\\\\+').replace(/\$/g, '\\\\$').replace(/\^/g, '\\\\^').replace(/}/g, '\\\\}').replace(/{/g, '\\\\{').replace(/\*/g, '\\\\*').replace(/\|/g, '\\\\|').replace(/\?/g, '\\\\?'));
          }
          else if (vm.isMultiplePart) {
            returnObject.multiplePartNumbers = _.map(vm.multiplePartNumbers, (item) => item.replace('\\', '\\\\'));
            returnObject.multiplePartNumbers = _.map(returnObject.multiplePartNumbers, (item) => item.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\+/g, '\\+').replace(/\$/g, '\\$').replace(/\^/g, '\\^').replace(/}/g, '\\}').replace(/{/g, '\\{').replace(/\*/g, '\\*').replace(/\|/g, '\\|').replace(/\?/g, '\\?'));
          }
        }
        returnObject.stockQuantity = vm.stockQuantity;

        return returnObject;
      }

      //Clear selected master filters from boxes
      vm.clearSelection = () => {
        /*_.each(vm.PartMasterAdvancedFilters, (item) => {
          item.isDeleted = true;
        });*/
        vm.attributesSearch = null;
        vm.checkDuplicatePartNumber();
        vm.multiplePartNumbers = [];
        vm.componentOrderingModel = undefined;
        vm.componentUsageCriteriaModel = undefined;
        vm.isReversal = false;
        vm.isCPN = false;
        vm.isCustom = false;
        vm.partRestrictionSettingModel = [];
        vm.isBOMActivityStarted = false;
        vm.isExportControl = false;
        vm.isOperatingTemperatureBlank = false;
        vm.isIdenticalMfrPN = false;
        vm.isProductionPNEmpty = false;
        vm.isExcludeIncorrectPart = false;
        vm.stockQuantity = undefined;
        if (vm.mfgCodeListToDisplay && vm.mfgCodeListToDisplay.length > 1) {
          vm.clearManufacturerFilter();
        }
        if (vm.mfgCodeForSupplierPartsListToDisplay && vm.mfgCodeForSupplierPartsListToDisplay.length > 1) {
          vm.clearManufacturerForSupplierPartsFilter();
        }
        if (vm.packagingDetailToDisplay && vm.packagingDetailToDisplay.length > 1) {
          vm.clearPackagingFilter();
        }
        if (vm.partStatusListToDisplay && vm.partStatusListToDisplay.length > 1) {
          vm.clearPartStatusFilter();
        }
        if (vm.packageCaseDetailToDisplay && vm.packageCaseDetailToDisplay.length > 1) {
          vm.clearPackageCaseFilter();
        }
        if (vm.mountingTypeListToDisplay && vm.mountingTypeListToDisplay.length > 1) {
          vm.clearMountingTypeFilter();
        }
        if (vm.externalMountingTypeListToDisplay && vm.externalMountingTypeListToDisplay.length > 1) {
          vm.clearExternalMountingTypeFilter();
        }
        if (vm.functionalTypeListToDisplay && vm.functionalTypeListToDisplay.length > 1) {
          vm.clearFunctionalTypeFilter();
        }
        if (vm.externalFunctionalTypeListToDisplay && vm.externalFunctionalTypeListToDisplay.length > 1) {
          vm.clearExternalFunctionalTypeFilter();
        }
        vm.clearPartGroupFilter();
        vm.clearDateFilters();
        vm.clearCreatedOnFilters();

        if (vm.categoryListToDisplay && vm.categoryListToDisplay.length > 1) {
          vm.clearPartTypeFilter();
        }

        vm.acceptableShippingCountryFilter();
        vm.operationalAttributeFilter();
        vm.disapprovedSupplierFilter();
        vm.partRestrictionSettingFilter();
        vm.clearStandardsFilter();
        vm.clearAssemblyTypeFilter();
        vm.clearAssemblyFilter();

        if (vm.rohsListToDisplay && vm.rohsListToDisplay.length > 1) {
          vm.clearRohsFilter();
        }
        if (vm.externalRoHSStatusListToDisplay && vm.externalRoHSStatusListToDisplay.length > 1) {
          vm.clearExternalRoHSStatusFilter();
        }

        $scope.$broadcast(vm.autoCompleteSearchActiveAssy.inputName, null);
        $scope.$broadcast(vm.autoCompleteSearchInactiveAssy.inputName, null);
        //setFilteredLabels(false);
        //vm.search();
      };

      vm.clearAllSelection = () => {
        _.each(vm.PartMasterAdvancedFilters, (item) => {
          item.isDeleted = true;
        });
        vm.attributesSearch = null;
        vm.checkDuplicatePartNumber();
        vm.multiplePartNumbers = [];
        vm.componentOrderingModel = undefined;
        vm.componentUsageCriteriaModel = undefined;
        vm.isReversal = false;
        vm.isCPN = false;
        vm.isCustom = false;
        vm.partRestrictionSettingModel = [];
        vm.isBOMActivityStarted = false;
        vm.isExportControl = false;
        vm.isOperatingTemperatureBlank = false;
        vm.isIdenticalMfrPN = false;
        vm.isProductionPNEmpty = false;
        vm.isExcludeIncorrectPart = false;
        vm.stockQuantity = undefined;
        vm.clearManufacturerFilter();
        vm.clearManufacturerForSupplierPartsFilter();
        vm.clearPackagingFilter();
        vm.clearPackageCaseFilter();
        vm.clearPartStatusFilter();
        vm.clearMountingTypeFilter();
        vm.clearExternalMountingTypeFilter();
        vm.clearFunctionalTypeFilter();
        vm.clearExternalFunctionalTypeFilter();
        vm.clearPartGroupFilter();
        vm.clearDateFilters();
        vm.clearCreatedOnFilters();
        vm.clearPartTypeFilter();
        vm.acceptableShippingCountryFilter();
        vm.operationalAttributeFilter();
        vm.disapprovedSupplierFilter();
        vm.partRestrictionSettingFilter();
        vm.clearStandardsFilter();
        vm.clearAssemblyTypeFilter();
        vm.clearAssemblyFilter();
        vm.clearRohsFilter();
        vm.clearExternalRoHSStatusFilter();
        $scope.$broadcast(vm.autoCompleteSearchActiveAssy.inputName, null);
        $scope.$broadcast(vm.autoCompleteSearchInactiveAssy.inputName, null);
        setFilteredLabels(false);
        //vm.search();
      };

      //clear master filters
      vm.clearFilter = () => {
        vm.clearMfrSearchText();
        vm.clearMfrForSupplierPartsSearchText();
        vm.clearPartStatusSearchText();
        vm.clearPackagingSearchText();
        vm.clearFunctionalTypeSearchText();
        vm.clearFunctionalTypeExternalSearchText();
        vm.clearMountingTypeSearchText();
        vm.clearMountingTypeExternalSearchText();
        vm.clearRohsSearchText();
        vm.clearRohsExternalSearchText();
        vm.clearPartTypeSearchText();
        vm.clearAssemblyTypeSearchText();
        vm.clearStandardsSearchText();
        vm.clearShippingCountrySearchText();
        vm.clearOperationalAttributesSearchText();
        vm.clearDisapprovedSupplierSearchText();
        vm.clearPackagCaseSearchText();
        setFilteredLabels(false);
      };

      vm.obsoleteDateChanged = () => {
        vm.obsoleteDateOptions = {
          obsoleteDateOpenFlag: false
        };
      };

      vm.fromCreatedOnDateChanged = () => {
        if (vm.fromCreatedOnDate) {
          vm.toCreatedOnDateOptions.minDate = (vm.fromCreatedOnDate ? vm.fromCreatedOnDate : vm.todayDate);

          if (new Date(vm.fromCreatedOnDate) > new Date(vm.toCreatedOnDate)) {
            vm.toCreatedOnDate = null;
          }
          if (!vm.toCreatedOnDate) {
            vm.toCreatedOnDate = null;
          }
        } else {
          vm.toCreatedOnDate = null;
          vm.fromCreatedOnDateOptions.fromCreatedOnDateOpenFlag = false;
        }
      };
      vm.toCreatedOnDateChanged = () => {
        vm.toCreatedOnDateOptions.toCreatedOnDateOpenFlag = false;
      };

      //==> Clear search within filter boxes
      vm.clearMfrSearchText = () => {
        vm.mfrSearchText = undefined;
        vm.searchMfrList();
      };
      vm.clearMfrForSupplierPartsSearchText = () => {
        vm.mfrForSupplierPartsSearchText = undefined;
        vm.searchMfrForSupplierPartsList();
      };
      vm.clearPartStatusSearchText = () => {
        vm.partStatusSearchText = undefined;
        vm.searchPartStatusList();
      };
      vm.clearPackagingSearchText = () => {
        vm.packagingSearchText = undefined;
        vm.searchPackagingList();
      };
      vm.clearPackagCaseSearchText = () => {
        vm.packageCaseSearchText = undefined;
        vm.searchPackagCaseList();
      };
      vm.clearFunctionalTypeSearchText = () => {
        vm.functionalTypeSearchText = undefined;
        vm.searchFunctionalTypeList();
      };
      vm.clearFunctionalTypeExternalSearchText = () => {
        vm.functionalTypeExternalSearchText = undefined;
        vm.searchFunctionalTypeExternalList();
      };
      vm.clearMountingTypeSearchText = () => {
        vm.mountingTypeSearchText = undefined;
        vm.searchMountingTypeList();
      };
      vm.clearMountingTypeExternalSearchText = () => {
        vm.mountingTypeExternalSearchText = undefined;
        vm.searchMountingTypeExternalList();
      };
      vm.clearRohsSearchText = () => {
        vm.rohsSearchText = undefined;
        vm.searchRohsList();
      };
      vm.clearRohsExternalSearchText = () => {
        vm.rohsExternalSearchText = undefined;
        vm.searchRohsExternalList();
      };
      vm.clearPartTypeSearchText = () => {
        vm.partTypeSearchText = undefined;
        vm.searchPartTypeList();
      };
      /*vm.clearAssemblySearchText = () => {
        vm.assemblySearchText = undefined;
        vm.searchAssemblyList();
      }*/
      vm.clearStandardsSearchText = () => {
        vm.standardsSearchText = undefined;
        vm.searchStandardsList();
      }
      vm.clearAssemblyTypeSearchText = () => {
        vm.assemblyTypeSearchText = undefined;
        vm.searchAssemblyTypeList();
      }
      vm.clearShippingCountrySearchText = () => {
        vm.shippingCountrySearchText = undefined;
        vm.searchShippingCountryList();
      }
      vm.clearOperationalAttributesSearchText = () => {
        vm.operationalAttributesSearchText = undefined;
        vm.searchOperationalAttributesList();
      };
      vm.clearDisapprovedSupplierSearchText = () => {
        vm.disapprovedSupplierSearchText = undefined;
        vm.searchDisapprovedSupplierList();
      };
      //<== Clear search within filter boxes

      //==> Search within filter boxes
      vm.searchMfrList = () => {
        if (vm.timeoutWatch) {
          $timeout.cancel(vm.timeoutWatch);
        }
        vm.timeoutWatch = $timeout(() => {
          vm.mfgCodeDetailModel = [];
          var mfrListToFilter;
          if (vm.isRefreshMasterFilters) {
            mfrListToFilter = angular.copy($scope.filteredMfgCodeList);
          }
          else {
            mfrListToFilter = angular.copy(vm.mfgCodeDetail);
          }
          vm.mfgCodeListToDisplay = vm.mfrSearchText ? _.filter(mfrListToFilter, (item) => { return item.mfgCodeName.toLowerCase().contains(vm.mfrSearchText.toLowerCase()) }) : mfrListToFilter;
        }, _configTimeout);
      }

      vm.searchMfrForSupplierPartsList = () => {
        if (vm.timeoutMfrForSupplierPartsWatch) {
          $timeout.cancel(vm.timeoutMfrForSupplierPartsWatch);
        }
        vm.timeoutMfrForSupplierPartsWatch = $timeout(() => {
          vm.mfgCodeForSupplierPartsDetailModel = [];
          var mfrForSupplierPartsListToFilter;
          if (vm.isRefreshMasterFilters) {
            mfrForSupplierPartsListToFilter = angular.copy($scope.filteredMfgCodeForSupplierPartsList);
          }
          else {
            mfrForSupplierPartsListToFilter = angular.copy(vm.mfgCodeForSupplierPartsDetail);
          }
          vm.mfgCodeForSupplierPartsListToDisplay = vm.mfrForSupplierPartsSearchText ? _.filter(mfrForSupplierPartsListToFilter, (item) => { return item.mfgCodeName.toLowerCase().contains(vm.mfrForSupplierPartsSearchText.toLowerCase()) }) : mfrForSupplierPartsListToFilter;
        }, _configTimeout);
      }
      vm.searchPartStatusList = () => {
        if (vm.timeoutPartStatusWatch) {
          $timeout.cancel(vm.timeoutPartStatusWatch);
        }
        vm.timeoutPartStatusWatch = $timeout(() => {
          vm.partStatusListModel = [];
          let partStatusListToFilter;
          if (vm.isRefreshMasterFilters) {
            partStatusListToFilter = angular.copy($scope.filteredPartStatusList);
          }
          else {
            partStatusListToFilter = angular.copy(vm.partStatusList);
          }
          vm.partStatusListToDisplay = vm.partStatusSearchText ? _.filter(partStatusListToFilter, (item) => { return item.name.toLowerCase().contains(vm.partStatusSearchText.toLowerCase()) }) : partStatusListToFilter;
        }, _configTimeout);
      };
      vm.searchPackagingList = () => {
        if (vm.timeoutPackagingWatch) {
          $timeout.cancel(vm.timeoutPackagingWatch);
        }
        vm.timeoutPackagingWatch = $timeout(() => {
          vm.packagingDetailModel = [];
          let packagingListToFilter;
          if (vm.isRefreshMasterFilters) {
            packagingListToFilter = angular.copy($scope.filteredPackagingList);
          }
          else {
            packagingListToFilter = angular.copy(vm.packagingDetail);
          }
          vm.packagingDetailToDisplay = vm.packagingSearchText ? _.filter(packagingListToFilter, (item) => { return item.value.toLowerCase().contains(vm.packagingSearchText.toLowerCase()) }) : packagingListToFilter;
        }, _configTimeout);
      };
      vm.searchFunctionalTypeList = () => {
        if (vm.timeoutFunctionalTypeWatch) {
          $timeout.cancel(vm.timeoutFunctionalTypeWatch);
        }
        vm.timeoutFunctionalTypeWatch = $timeout(() => {
          vm.functionalTypeListModel = [];
          let functionalTypeListToFilter;
          if (vm.isRefreshMasterFilters) {
            functionalTypeListToFilter = angular.copy($scope.filteredFunctionalTypeList);
          }
          else {
            functionalTypeListToFilter = angular.copy(vm.functionalTypeList);
          }
          vm.functionalTypeListToDisplay = vm.functionalTypeSearchText ? _.filter(functionalTypeListToFilter, (item) => { return item.partTypeName.toLowerCase().contains(vm.functionalTypeSearchText.toLowerCase()) }) : functionalTypeListToFilter;
        }, _configTimeout);
      };
      vm.searchFunctionalTypeExternalList = () => {
        if (vm.timeoutFunctionalTypeExternalWatch) {
          $timeout.cancel(vm.timeoutFunctionalTypeExternalWatch);
        }
        vm.timeoutFunctionalTypeExternalWatch = $timeout(() => {
          vm.externalFunctionalTypeListModel = [];
          let functionalTypeExternalListToFilter;
          if (vm.isRefreshMasterFilters) {
            functionalTypeExternalListToFilter = angular.copy($scope.filteredExternalFunctionalTypeList);
          }
          else {
            functionalTypeExternalListToFilter = angular.copy(vm.externalFunctionalTypeList);
          }
          vm.externalFunctionalTypeListToDisplay = vm.functionalTypeExternalSearchText ? _.filter(functionalTypeExternalListToFilter, (item) => { return item.functionalCategoryText.toLowerCase().contains(vm.functionalTypeExternalSearchText.toLowerCase()) }) : functionalTypeExternalListToFilter;
        }, _configTimeout);
      };
      vm.searchMountingTypeList = () => {
        if (vm.timeoutMountingTypeWatch) {
          $timeout.cancel(vm.timeoutMountingTypeWatch);
        }
        vm.timeoutMountingTypeWatch = $timeout(() => {
          vm.mountingTypeListModel = [];
          let mountingTypeListToFilter;
          if (vm.isRefreshMasterFilters) {
            mountingTypeListToFilter = angular.copy($scope.filteredMountingTypeList);
          }
          else {
            mountingTypeListToFilter = angular.copy(vm.mountingTypeList);
          }
          vm.mountingTypeListToDisplay = vm.mountingTypeSearchText ? _.filter(mountingTypeListToFilter, (item) => { return item.name.toLowerCase().contains(vm.mountingTypeSearchText.toLowerCase()) }) : mountingTypeListToFilter;
        }, _configTimeout);
      };
      vm.searchMountingTypeExternalList = () => {
        if (vm.timeoutMountingTypeExternalWatch) {
          $timeout.cancel(vm.timeoutMountingTypeExternalWatch);
        }
        vm.timeoutMountingTypeExternalWatch = $timeout(() => {
          vm.externalMountingTypeListModel = [];
          let mountingTypeExternalListToFilter;
          if (vm.isRefreshMasterFilters) {
            mountingTypeExternalListToFilter = angular.copy($scope.filteredExternalMountingTypeList);
          }
          else {
            mountingTypeExternalListToFilter = angular.copy(vm.externalMountingTypeList);
          }
          vm.externalMountingTypeListToDisplay = vm.mountingTypeExternalSearchText ? _.filter(mountingTypeExternalListToFilter, (item) => { return item.mountingTypeText.toLowerCase().contains(vm.mountingTypeExternalSearchText.toLowerCase()) }) : mountingTypeExternalListToFilter;
        }, _configTimeout);
      };
      vm.searchRohsList = () => {
        if (vm.timeoutRohsWatch) {
          $timeout.cancel(vm.timeoutRohsWatch);
        }
        vm.timeoutRohsWatch = $timeout(() => {
          vm.rohsModel = [];
          let rohsListToFilter;
          if (vm.isRefreshMasterFilters) {
            rohsListToFilter = angular.copy($scope.filteredRohsList);
          }
          else {
            rohsListToFilter = angular.copy(vm.rohsList);
          }
          vm.rohsListToDisplay = vm.rohsSearchText ? _.filter(rohsListToFilter, (item) => { return item.value.toLowerCase().contains(vm.rohsSearchText.toLowerCase()) }) : rohsListToFilter;
        }, _configTimeout);
      };
      vm.searchRohsExternalList = () => {
        if (vm.timeoutRohsExternalWatch) {
          $timeout.cancel(vm.timeoutRohsExternalWatch);
        }
        vm.timeoutRohsExternalWatch = $timeout(() => {
          vm.externalRoHSStatusListModel = [];
          let rohsExternalListToFilter;
          if (vm.isRefreshMasterFilters) {
            rohsExternalListToFilter = angular.copy($scope.filteredExternalRohsStatusList);
          }
          else {
            rohsExternalListToFilter = angular.copy(vm.externalRoHSStatusList);
          }
          vm.externalRoHSStatusListToDisplay = vm.rohsExternalSearchText ? _.filter(rohsExternalListToFilter, (item) => { return item.rohsText.toLowerCase().contains(vm.rohsExternalSearchText.toLowerCase()) }) : rohsExternalListToFilter;
        }, _configTimeout);
      };
      vm.searchPartTypeList = () => {
        if (vm.timeoutPartTypeWatch) {
          $timeout.cancel(vm.timeoutPartTypeWatch);
        }
        vm.timeoutPartTypeWatch = $timeout(() => {
          vm.partTypeModel = [];
          let partTypeListToFilter;
          if (vm.isRefreshMasterFilters) {
            partTypeListToFilter = angular.copy($scope.filteredPartTypeList);
          }
          else {
            partTypeListToFilter = angular.copy(vm.categoryList);
          }
          vm.categoryListToDisplay = vm.partTypeSearchText ? _.filter(partTypeListToFilter, (item) => { return item.Value.toLowerCase().contains(vm.partTypeSearchText.toLowerCase()) }) : partTypeListToFilter;
        }, _configTimeout);
      };

      vm.searchStandardsList = () => {
        if (vm.timeoutStandardsWatch) {
          $timeout.cancel(vm.timeoutStandardsWatch);
        }
        vm.timeoutStandardsWatch = $timeout(() => {
          vm.allStandardsModel = [];
          let standardsListToFilter;
          standardsListToFilter = angular.copy(vm.standardsList);

          vm.standardsListToDisplay = vm.standardsSearchText ? _.filter(standardsListToFilter, (item) => { return item.fullName.toLowerCase().contains(vm.standardsSearchText.toLowerCase()); }) : standardsListToFilter;
        }, _configTimeout);
      };
      vm.searchShippingCountryList = () => {
        if (vm.timeoutShippingCountryWatch) {
          $timeout.cancel(vm.timeoutShippingCountryWatch);
        }
        vm.timeoutShippingCountryWatch = $timeout(() => {
          vm.acceptableShippingCountryModel = [];
          let shippingCountryListToFilter;
          shippingCountryListToFilter = angular.copy(vm.countryList);
          vm.countryListToDisplay = vm.shippingCountrySearchText ? _.filter(shippingCountryListToFilter, (item) => { return item.countryName.toLowerCase().contains(vm.shippingCountrySearchText.toLowerCase()) }) : shippingCountryListToFilter;
        }, _configTimeout);
      };
      vm.searchOperationalAttributesList = () => {
        if (vm.timeoutOperationalAttributesWatch) {
          $timeout.cancel(vm.timeoutOperationalAttributesWatch);
        }
        vm.timeoutOperationalAttributesWatch = $timeout(() => {
          vm.operationalAttributeModel = [];
          let operationalAttributesListToFilter;
          operationalAttributesListToFilter = angular.copy(vm.operationalAttributeList);
          vm.operationalAttributeListToDisplay = vm.operationalAttributesSearchText ? _.filter(operationalAttributesListToFilter, (item) => { return item.attributeName.toLowerCase().contains(vm.operationalAttributesSearchText.toLowerCase()) }) : operationalAttributesListToFilter;
        }, _configTimeout);
      };
      vm.searchDisapprovedSupplierList = () => {
        if (vm.timeoutDisapprovedSupplierWatch) {
          $timeout.cancel(vm.timeoutDisapprovedSupplierWatch);
        }
        vm.timeoutDisapprovedSupplierWatch = $timeout(() => {
          vm.disapprovedSupplierModel = [];
          const disapprovedSupplierListToFilter = angular.copy(vm.disapprovedSupplierCodeDetail);
          vm.disapprovedSupplierListToDisplay = vm.disapprovedSupplierSearchText ? _.filter(disapprovedSupplierListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.disapprovedSupplierSearchText.toLowerCase())) : disapprovedSupplierListToFilter;
        }, _configTimeout);
      };
      vm.searchAssemblyTypeList = () => {
        if (vm.timeoutAssemblyTypeWatch) {
          $timeout.cancel(vm.timeoutAssemblyTypeWatch);
        }
        vm.timeoutAssemblyTypeWatch = $timeout(() => {
          vm.assemblyTypeModel = [];
          let assemblyTypeListToFilter;
          assemblyTypeListToFilter = angular.copy(vm.assemblyTypeList);

          vm.assemblyTypeListToDisplay = vm.assemblyTypeSearchText ? _.filter(assemblyTypeListToFilter, (item) => { return item.name.toLowerCase().contains(vm.assemblyTypeSearchText.toLowerCase()) }) : assemblyTypeListToFilter;
        }, _configTimeout);
      };

      vm.searchPackagCaseList = () => {
        if (vm.timeoutPackagCaseWatch) {
          $timeout.cancel(vm.timeoutPackagCaseWatch);
        }
        vm.timeoutPackagCaseWatch = $timeout(() => {
          vm.packagCaseDetailModel = [];
          let packagCaseListToFilter;
          if (vm.isRefreshMasterFilters) {
            packagCaseListToFilter = angular.copy($scope.filteredPackageCaseList);
          }
          else {
            packagCaseListToFilter = angular.copy(vm.packageCaseDetail);
          }
          vm.packagaCaseDetailToDisplay = vm.packageCaseSearchText ? _.filter(packagCaseListToFilter, (item) => {
            return item.value.toLowerCase().contains(vm.packageCaseSearchText.toLowerCase());
          }) : packagCaseListToFilter;
        }, _configTimeout);
      };
      //<== Search within filter boxes

      //==> Clear search within filter boxes
      vm.clearManufacturerFilter = () => {
        vm.mfgCodeDetailModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearManufacturerForSupplierPartsFilter = () => {
        vm.mfgCodeForSupplierPartsDetailModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearPartStatusFilter = () => {
        vm.partStatusListModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearPackagingFilter = () => {
        vm.packagingDetailModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearPackageCaseFilter = () => {
        vm.packageCaseDetailModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearMountingTypeFilter = () => {
        vm.mountingTypeListModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearExternalMountingTypeFilter = () => {
        vm.externalMountingTypeListModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearFunctionalTypeFilter = () => {
        vm.functionalTypeListModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearExternalFunctionalTypeFilter = () => {
        vm.externalFunctionalTypeListModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearPartGroupFilter = () => {
        vm.packagingAlias = vm.alternatePart = vm.roHSAlternatePart = vm.partUsedInAssembly = undefined;
      };
      vm.clearDateFilters = () => {
        vm.obsoleteDate = undefined;
      };
      vm.clearCreatedOnFilters = () => {
        vm.fromCreatedOnDate = undefined;
        vm.toCreatedOnDate = undefined;
      };
      vm.clearPartTypeFilter = () => {
        vm.partTypeModel = [];
        vm.setSelectedFilterValues();
      };
      vm.acceptableShippingCountryFilter = () => {
        vm.acceptableShippingCountryModel = [];
        vm.setSelectedFilterValues();
      };
      vm.operationalAttributeFilter = () => {
        vm.operationalAttributeModel = [];
        vm.setSelectedFilterValues();
      };
      //vm.disapprovedSupplierModel
      vm.disapprovedSupplierFilter = () => {
        vm.disapprovedSupplierModel = [];
        vm.setSelectedFilterValues();
      };
      vm.partRestrictionSettingFilter = () => {
        vm.partRestrictionSettingModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearStandardsCategoriesFilter = () => {
        vm.standardsCategoriesModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearStandardsFilter = () => {
        vm.allStandardsModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearAssemblyTypeFilter = () => {
        vm.assemblyTypeModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearBOMPartsFilter = () => {
        vm.multipleActiveBOMParts = [];
        vm.multipleInactiveBOMParts = [];
      };
      vm.clearAssemblyFilter = () => {
        vm.multipleBOMParts = [];
        vm.multipleActiveBOMParts = [];
        vm.multipleInactiveBOMParts = [];
        vm.setSelectedFilterValues();
      };
      vm.clearRohsFilter = () => {
        vm.rohsModel = [];
        vm.setSelectedFilterValues();
      };
      vm.clearExternalRoHSStatusFilter = () => {
        vm.externalRoHSStatusListModel = [];
        vm.setSelectedFilterValues();
      };
      //<== Clear search within filter boxes


      vm.moreFilters = () => {
        vm.isMoreFilterVisible = !vm.isMoreFilterVisible;
      }
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      };
      vm.erOptions = {
        workstart: function () {
          vm.isNoDataFound = true;
          $scope.$apply();
        },
        workend: function () {
        },
        sheet: function (json, sheetnames, select_sheet_cb, files) {
          var type = files.name.split('.');
          vm.fileName = files.name;
          if (!json || (Array.isArray(json) && _.isEmpty(json.flat()))) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UPLOAD_BLANK_CSV_EXCEL);
            messageContent.message = stringFormat(messageContent.message, type[type.length - 1]);
            const alertModel = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(alertModel);
          }
          else if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1]) && json) {
            const data = {
              excelHeaders: json[0],
              notquote: true,
              headerName: vm.importCustomerType,
              isExcludeIncorrectPart: vm.isExcludeIncorrectPart,
              mfgType: vm.mfgType.toUpperCase()
            };
            DialogFactory.dialogService(
              CORE.SEARCH_MULTIPART_COLUMN_MAPPING_POPUP_CONTROLLER,
              CORE.SEARCH_MULTIPART_COLUMN_MAPPING_POPUP_VIEW,
              vm.event,
              data).then((result) => {
                if (result) {
                  json[0] = result.excelHeaders;
                  vm.isExcludeIncorrectPart = result.isExcludeIncorrectPart;
                  vm.headerMapping = result.model;
                  vm.filterFieldName = result.filterFieldName;
                  vm.displayLableFilterFieldName = result.displayLableFilterFieldName;
                  generateModel(json, result.model, data.excelHeaders);
                }
              }, (err) => BaseService.getErrorLog(err));
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.FILE_TYPE_NOT_ALLOWED);
            messageContent.message = stringFormat(messageContent.message, 'csv,xls');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        },
        badfile: function () {
          var model = {
            title: vm.CORE_MESSAGE_CONSTANT.COMPONENT_FILTER_UPLOAD_FAIL,
            textContent: vm.CORE_MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_TEXT,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        },
        failed: function (e) {
          var model = {
            title: vm.CORE_MESSAGE_CONSTANT.PRICE_UPLOAD_FAIL,
            textContent: e.stack,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          console.log(e, e.stack);
        },
        multiplefile: function () {
          var model = {
            title: null,
            textContent: vm.CORE_MESSAGE_CONSTANT.SINGLE_FILE_UPLOAD,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        },
        large: function () {
          var model = {
            title: vm.CORE_MESSAGE_CONSTANT.PRICE_UPLOAD_FAIL,
            textContent: vm.CORE_MESSAGE_CONSTANT.BOM_UPLOAD_FAIL_SIZE_TEXT,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        }
      };

      /**
       * Generate model for apply Multipart search base on upload file and selected field
       * @param {any} uploadedMFR - Data of Uploaded file
       * @param {any} mfrHeaders - Header list which is are mapped
       * @param {any} excelHeader - Excel Header list
       */
      function generateModel(uploadedMFR, mfrHeaders, excelHeader) {
        vm.selectedColumnData = [];
        // loop through excel data and bind into model
        let rowIndex = 1;
        const len = uploadedMFR.length;
        vm.headers = angular.copy(CORE.MULTIPART_SEARCH_COLUMN_MAPPING);
        if (Array.isArray(vm.headers) && vm.headers.length > 0) {
          vm.headers[1].fieldName = `${(vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? '' : (CORE.COMPONENT_MFG_TYPE.SUPPLIER).concat(' '))}${vm.headers[1].fieldName}`;
          vm.headers[2].fieldName = vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN;
          // vm.headers[2].fieldName = vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN;
        }
        for (rowIndex; rowIndex < len; rowIndex++) {
          const item = uploadedMFR[rowIndex];
          excelHeader.forEach((column, index) => {
            if (!column) {
              return;
            }
            const obj = mfrHeaders.find((x) => x.column && x.column.toUpperCase() === column.toUpperCase());
            if (!obj) {
              return;
            }
            const field = vm.headers.find((x) => x.fieldName === obj.header.fieldName);
            if (field && field.fieldName) {
              let fieldValue = item[index] ? item[index] : null;
              if (fieldValue) {
                fieldValue = CORE.MULTIPART_SEARCH_COLUMN_MAPPING[0].fieldName === field.fieldName ? padStringFormat(fieldValue, 8, '0') : fieldValue;
                vm.selectedColumnData.push(fieldValue);
              }
            }
          });
        };

        if (vm.selectedColumnData.length > 0) {
          vm.multiplePartByUploadFileDetail = { uploadCount: vm.selectedColumnData.length, uploadData: vm.selectedColumnData, filterFieldName: vm.filterFieldName, displayLableFilterFieldName: vm.displayLableFilterFieldName };
          vm.search();
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.NO_RECORD_EXISTS_ON_UPLOAD_FILE);
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }
      }

      vm.removeMultipartFilter = () => {
        vm.multiplePartByUploadFileDetail = { uploadCount: 0 };
        vm.search();
      };

      vm.uploadExcelFile = function (event, file) {
        if (file && file.length > 1) {
          const model = {
            title: vm.CORE_MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: vm.CORE_MESSAGE_CONSTANT.SELECT_ANYONE_OPTION,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return;
        } else {
          angular.element('#div-excel #fi-excel').trigger('click');
        }
      };

      vm.onRefreshMasterFiltersChange = () => {
        if (!vm.isRefreshMasterFilters) {
          SetDefaultMasterFiltersData();
        }
      };
      function SetDefaultMasterFiltersData() {
        if (!vm.mfgCodeDetail) {
          vm.getProgressiveFilters();
        } else {
          vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
          vm.mfgCodeForSupplierPartsListToDisplay = angular.copy(vm.mfgCodeForSupplierPartsDetail);
          vm.partStatusListToDisplay = angular.copy(vm.partStatusList);
          vm.packagingDetailToDisplay = angular.copy(vm.packagingDetail);
          vm.rohsListToDisplay = angular.copy(vm.rohsList);
          vm.externalRoHSStatusListToDisplay = angular.copy(vm.externalRoHSStatusList);
          vm.functionalTypeListToDisplay = angular.copy(vm.functionalTypeList);
          vm.externalFunctionalTypeListToDisplay = angular.copy(vm.externalFunctionalTypeList);
          vm.mountingTypeListToDisplay = angular.copy(vm.mountingTypeList);
          vm.externalMountingTypeListToDisplay = angular.copy(vm.externalMountingTypeList);
          vm.categoryListToDisplay = angular.copy(vm.categoryList);
          vm.countryListToDisplay = angular.copy(vm.countryList);
          vm.operationalAttributeListToDisplay = angular.copy(vm.operationalAttributeList);
          vm.disapprovedSupplierListToDisplay = angular.copy(vm.disapprovedSupplierCodeDetail);
          vm.standardsListToDisplay = angular.copy(vm.standardsList);
          vm.assemblyTypeListToDisplay = angular.copy(vm.assemblyTypeList);
          vm.packagaCaseDetailToDisplay = angular.copy(vm.packageCaseDetail);
        }
      };
      function SetMasterFiltersData(isResetFilter) {
        if (vm.isRefreshMasterFilters && !isResetFilter) {
          vm.mfgCodeListToDisplay = angular.copy($scope.filteredMfgCodeList);
          vm.mfgCodeForSupplierPartsListToDisplay = angular.copy($scope.filteredMfgCodeForSupplierPartsList);
          vm.partStatusListToDisplay = angular.copy($scope.filteredPartStatusList);
          vm.packagingDetailToDisplay = angular.copy($scope.filteredPackagingList);
          vm.rohsListToDisplay = angular.copy($scope.filteredRohsList);
          vm.externalRoHSStatusListToDisplay = angular.copy($scope.filteredExternalRohsStatusList);
          vm.functionalTypeListToDisplay = angular.copy($scope.filteredFunctionalTypeList);
          vm.externalFunctionalTypeListToDisplay = angular.copy($scope.filteredExternalFunctionalTypeList);
          vm.mountingTypeListToDisplay = angular.copy($scope.filteredMountingTypeList);
          vm.externalMountingTypeListToDisplay = angular.copy($scope.filteredExternalMountingTypeList);
          vm.categoryListToDisplay = angular.copy($scope.filteredPartTypeList);
          vm.packagaCaseDetailToDisplay = angular.copy($scope.filteredPackageCaseList);
          //vm.countryListToDisplay = angular.copy($scope.filteredCountryList);
          //vm.operationalAttributeListToDisplay = angular.copy($scope.filteredOperationalAttributeList);
          //vm.standardsListToDisplay = angular.copy($scope.filteredStandardsList);
          //vm.assemblyTypeListToDisplay = angular.copy($scope.filteredAssemblyTypeList);

          if ($scope.gridOptions && $scope.gridOptions.gridApi) {
            vm.isUiGridColumnFiltersApplied = _.some($scope.gridOptions.gridApi.grid.columns, (col) => {
              return !_.isEmpty(col.filters[0].term);
            });
          }
        }
        else {
          SetDefaultMasterFiltersData();
        }
      };

      vm.removeAppliedFilter = (item, index) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.PartMasterAdvancedFilters.HeaderSearch.value:
              $scope.headerSearchText = "";
              break;
            case vm.PartMasterAdvancedFilters.Manufacturer.value:
              vm.mfgCodeDetailModel = [];
              break;
            case vm.PartMasterAdvancedFilters.ManufacturerForSupplierParts.value:
              vm.mfgCodeForSupplierPartsDetailModel = [];
              break;
            case vm.PartMasterAdvancedFilters.PartStatus.value:
              vm.partStatusListModel = [];
              break;
            case vm.PartMasterAdvancedFilters.Packaging.value:
              vm.packagingDetailModel = [];
              break;
            case vm.PartMasterAdvancedFilters.FunctionalType.value:
              vm.functionalTypeListModel = [];
              break;
            case vm.PartMasterAdvancedFilters.ExternalFunctionalType.value:
              vm.externalFunctionalTypeListModel = [];
              break;
            case vm.PartMasterAdvancedFilters.MountingType.value:
              vm.mountingTypeListModel = [];
              break;
            case vm.PartMasterAdvancedFilters.ExternalMountingType.value:
              vm.externalMountingTypeListModel = [];
              break;
            case vm.PartMasterAdvancedFilters.PartGroups.value:
              {
                vm.packagingAlias = undefined;
                vm.alternatePart = undefined;
                vm.roHSAlternatePart = undefined;
                vm.partUsedInAssembly = undefined;
              }
              break;
            case vm.PartMasterAdvancedFilters.Standards.value:
              vm.allStandardsModel = [];
              break;
            case vm.PartMasterAdvancedFilters.PartType.value:
              vm.partTypeModel = [];
              break;
            case vm.PartMasterAdvancedFilters.AssemblyType.value:
              vm.assemblyTypeModel = [];
              break;
            /*case vm.PartMasterAdvancedFilters.Assemblies.value:
              vm.assemblyModel = [];
              break;*/
            case vm.PartMasterAdvancedFilters.RoHS.value:
              vm.rohsModel = [];
              break;
            case vm.PartMasterAdvancedFilters.ExternalRoHS.value:
              vm.externalRoHSStatusListModel = [];
              break;
            case vm.PartMasterAdvancedFilters.ReversalParts.value:
              vm.isReversal = false;
              break;
            case vm.PartMasterAdvancedFilters.CPNParts.value:
              vm.isCPN = false;
              break;
            case vm.PartMasterAdvancedFilters.CustomParts.value:
              vm.isCustom = false;
              break;
            case vm.PartMasterAdvancedFilters.AcceptableShippingCountry.value:
              vm.acceptableShippingCountryModel = [];
              break;
            case vm.PartMasterAdvancedFilters.OperationalAttributes.value:
              vm.operationalAttributeModel = [];
              break;
            case vm.PartMasterAdvancedFilters.DisapprovedSuppliers.value:
              vm.disapprovedSupplierModel = [];
              break;
            case vm.PartMasterAdvancedFilters.AssemblieswithActivityStarted.value:
              vm.isBOMActivityStarted = false;
              break;
            case vm.PartMasterAdvancedFilters.ExportControlled.value:
              vm.isExportControl = false;
              break;
            case vm.PartMasterAdvancedFilters.OperatingTemperatureBlank.value:
              vm.isOperatingTemperatureBlank = false;
              break;
            case vm.PartMasterAdvancedFilters.DateFilters.value:
              vm.obsoleteDate = undefined;
              break;
            case vm.PartMasterAdvancedFilters.CreatedOn.value:
              vm.fromCreatedOnDate = vm.toCreatedOnDate = undefined;
              break;
            case vm.PartMasterAdvancedFilters.IdenticalMfrPN.value:
              vm.isIdenticalMfrPN = false;
              break;
            case vm.PartMasterAdvancedFilters.ProductionPNEmpty.value:
              vm.isProductionPNEmpty = false;
              break;
            case vm.PartMasterAdvancedFilters.ExcludeIncorrectPart.value:
              vm.isExcludeIncorrectPart = false;
              break;
            case vm.PartMasterAdvancedFilters.PackageCaseType.value:
              vm.packageCaseDetailModel = [];
              break;
            case vm.PartMasterAdvancedFilters.PartRestrictionSetting.value:
              vm.partRestrictionSettingModel = [];
              break;
          }
          vm.search();
        }
      };

      function clearSearchInFilterBlocks() {
        vm.mfrSearchText = vm.mfrForSupplierPartsSearchText = vm.partStatusSearchText = vm.packagingSearchText = vm.functionalTypeSearchText = vm.packageCaseSearchText =
          vm.functionalTypeExternalSearchText = vm.mountingTypeSearchText = vm.mountingTypeExternalSearchText =
          vm.rohsSearchText = vm.rohsExternalSearchText = vm.partTypeSearchText = vm.assemblyTypeSearchText =/*vm.assemblySearchText =*/
          vm.standardsSearchText = vm.shippingCountrySearchText = vm.operationalAttributesSearchText = vm.disapprovedSupplierSearchText = undefined;
      }

      vm.isClearSelectionDisabled = () => {
        const isButtonDisabled = (
          !vm.attributesSearch &&
          (!(vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length) || (vm.mfgCodeListToDisplay && vm.mfgCodeListToDisplay.length <= 1)) &&
          (!(vm.mfgCodeForSupplierPartsDetailModel && vm.mfgCodeForSupplierPartsDetailModel.length) || (vm.mfgCodeForSupplierPartsListToDisplay && vm.mfgCodeForSupplierPartsListToDisplay.length <= 1)) &&
          (!(vm.partStatusListModel && vm.partStatusListModel.length) || (vm.partStatusListToDisplay && vm.partStatusListToDisplay.length <= 1)) &&
          (!(vm.packagingDetailModel && vm.packagingDetailModel.length) || (vm.packagingDetailToDisplay && vm.packagingDetailToDisplay.length <= 1)) &&
          (!(vm.packageCaseDetailModel && vm.packageCaseDetailModel.length) || (vm.packagaCaseDetailToDisplay && vm.packagaCaseDetailToDisplay.length <= 1)) &&
          (!(vm.mountingTypeListModel && vm.mountingTypeListModel.length) || (vm.mountingTypeListToDisplay && vm.mountingTypeListToDisplay.length <= 1)) &&
          (!(vm.externalMountingTypeListModel && vm.externalMountingTypeListModel.length) || (vm.externalMountingTypeListToDisplay && vm.externalMountingTypeListToDisplay.length <= 1)) &&
          (!(vm.functionalTypeListModel && vm.functionalTypeListModel.length) || (vm.functionalTypeListToDisplay && vm.functionalTypeListToDisplay.length <= 1)) &&
          (!(vm.externalFunctionalTypeListModel && vm.externalFunctionalTypeListModel.length) || (vm.externalFunctionalTypeListToDisplay && vm.externalFunctionalTypeListToDisplay.length <= 1)) &&
          !vm.packagingAlias &&
          !vm.alternatePart &&
          !vm.roHSAlternatePart &&
          !vm.partUsedInAssembly &&
          !vm.stockQuantity &&
          (!(vm.partTypeModel && vm.partTypeModel.length) || (vm.categoryListToDisplay && vm.categoryListToDisplay.length <= 1)) &&
          !(vm.allStandardsModel && vm.allStandardsModel.length) &&
          !(vm.assemblyTypeModel && vm.assemblyTypeModel.length) &&
          !vm.componentOrderingModel &&
          !(vm.multipleActiveBOMParts && vm.multipleActiveBOMParts.length) &&
          !(vm.multipleInactiveBOMParts && vm.multipleInactiveBOMParts.length) &&
          (vm.autoCompleteSearchActiveAssy && !vm.autoCompleteSearchActiveAssy.searchText) &&
          (vm.autoCompleteSearchInactiveAssy && !vm.autoCompleteSearchInactiveAssy.searchText) &&
          (!(vm.rohsModel && vm.rohsModel.length) || (vm.rohsListToDisplay && vm.rohsListToDisplay.length <= 1)) &&
          (!(vm.externalRoHSStatusListModel && vm.externalRoHSStatusListModel.length) || (vm.externalRoHSStatusListToDisplay && vm.externalRoHSStatusListToDisplay.length <= 1)) &&
          !(vm.operationalAttributeModel && vm.operationalAttributeModel.length) &&
          !(vm.disapprovedSupplierModel && vm.disapprovedSupplierModel.length) &&
          !(vm.acceptableShippingCountryModel && vm.acceptableShippingCountryModel.length) &&
          !vm.isCPN &&
          !vm.isCustom &&
          !vm.isReversal &&
          !(vm.partRestrictionSettingModel && vm.partRestrictionSettingModel.length) &&
          !vm.isBOMActivityStarted &&
          !vm.isExportControl &&
          !vm.obsoleteDate
        );

        return isButtonDisabled;
      };

      //clear all filters, grid data and set page state back as page load
      vm.clearAllFiltersAndGridData = () => {
        vm.isUiGridColumnFiltersApplied = undefined;
        if ($scope.gridOptions && $scope.gridOptions.gridApi) {
          _.each($scope.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              col.filters[0].term = undefined;
            }
          });
        }
        vm.multiplePartByUploadFileDetail = { uploadCount: 0 };
        vm.clearAllSelection();
        $scope.headerSearchText = '';
        $scope.clearGroupFilters(false);
        clearSearchInFilterBlocks();
        vm.isRefreshMasterFilters = false;
        SetMasterFiltersData(false);
        setFilteredLabels(false);
        $scope.clearGridData();
        vm.checkDuplicatePartNumber();
        if (vm.isHasSearchCriteria) {
          if (vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST) {
            $state.transitionTo(USER.ADMIN_DIST_COMPONENT_STATE, null, {
              location: true,
              inherit: false,
              notify: false
            });
          } else {
            $state.transitionTo(USER.ADMIN_MFG_COMPONENT_STATE, {}, {
              location: true,
              inherit: false,
              notify: false
            });
          }
        }
      };
      //Clear grid Column Filter
      vm.clearGridColumnFilter = (item, index) => {
        if (item) {
          item.filters[0].term = undefined;
          if (!item.isFilterDeregistered) {
            //refresh data grid
            $scope.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
          }
        }
      };
      $scope.$on(USER.PartMasterAdvanceFilters.RefreshAdvanceFilterData, (event, data) => {
        vm.isRefreshMasterFilters = true;
        clearSearchInFilterBlocks();
        //vm.clearAssemblySearchText();
        SetMasterFiltersData();
        setFilteredLabels(false);
      });
      $scope.$on(USER.PartMasterAdvanceFilters.ClearFilterSelection, (event, data) => {
        vm.clearAllSelection();
      });

      /* Download Sample Filter Template */
      vm.exportSampleFilterTemplate = () => {
        let mfgTypeFile = vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? CORE.COMPONENT_MFG_TYPE.SUPPLIER : CORE.COMPONENT_MFG_TYPE.MANUFACTURER;
        mfgTypeFile = mfgTypeFile.concat('FilterTemplate');
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.exportSampleFilterTemplate(mfgTypeFile).then((response) => {
          let messageContent;
          if (response.status === 404) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
            DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
          } else if (response.status === 403) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
            DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
          } else if (response.status === 401) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
            DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
          }
          else {
            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, module + '.xlsx');
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', mfgTypeFile + '.xlsx');
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
              }
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      //get data for Progressive Filters
      vm.getProgressiveFilters = () => {
        vm.mfrSearchText = undefined;
        const searchObj = {
          mfgType: vm.mfgType.toUpperCase() !== CORE.MFG_TYPE.DIST ? CORE.MFG_TYPE.MFG : vm.mfgType,
          isCodeFirst: true,
          excludeSupplier: vm.mfgType.toUpperCase() === CORE.MFG_TYPE.DIST ? false : true
        };

        return ComponentFactory.getProgressiveFilters().query(searchObj).$promise.then((filterResponse) => {
          const filters = filterResponse.data;
          if (searchObj.excludeSupplier) {
            vm.mfgCodeListToDisplay = Array.isArray(filters.manufactureList) && filters.manufactureList.length > 0 ? filters.manufactureList : [];
            vm.mfgCodeForSupplierPartsListToDisplay = [];
            vm.mfgCodeForSupplierPartsDetail = [];
            vm.mfgCodeDetail = angular.copy(vm.mfgCodeListToDisplay);
          } else {
            vm.mfgCodeListToDisplay = Array.isArray(filters.supplierList) && filters.supplierList.length > 0 ? filters.supplierList : [];
            vm.mfgCodeForSupplierPartsListToDisplay = Array.isArray(filters.manufactureList) && filters.manufactureList.length > 0 ? filters.manufactureList : [];
            vm.mfgCodeForSupplierPartsDetail = angular.copy(vm.mfgCodeForSupplierPartsListToDisplay);
            vm.mfgCodeDetail = angular.copy(vm.mfgCodeListToDisplay);
          }
          vm.partStatusListToDisplay = Array.isArray(filters.partStatusList) && filters.partStatusList.length > 0 ? filters.partStatusList : [];
          vm.partStatusList = angular.copy(vm.partStatusListToDisplay);

          vm.packagingDetailToDisplay = Array.isArray(filters.packagingList) && filters.packagingList.length > 0 ? filters.packagingList : [];
          vm.packagingDetail = angular.copy(vm.packagingDetailToDisplay);

          vm.functionalTypeListToDisplay = Array.isArray(filters.functionalList) && filters.functionalList.length > 0 ? filters.functionalList : [];
          vm.functionalTypeList = angular.copy(vm.functionalTypeListToDisplay);

          vm.externalFunctionalTypeListToDisplay = Array.isArray(filters.externalFunctionList) && filters.externalFunctionList.length > 0 ? filters.externalFunctionList : [];
          vm.externalFunctionalTypeList = angular.copy(vm.externalFunctionalTypeListToDisplay);

          vm.packagaCaseDetailToDisplay = Array.isArray(filters.packageCaseShapeTypeList) && filters.packageCaseShapeTypeList.length > 0 ? filters.packageCaseShapeTypeList : [];
          vm.packageCaseDetail = angular.copy(vm.packagaCaseDetailToDisplay);

          vm.mountingTypeListToDisplay = Array.isArray(filters.mountingTypeList) && filters.mountingTypeList.length > 0 ? filters.mountingTypeList : [];
          vm.mountingTypeList = angular.copy(vm.mountingTypeListToDisplay);

          vm.externalMountingTypeListToDisplay = Array.isArray(filters.externalMountingList) && filters.externalMountingList.length > 0 ? filters.externalMountingList : [];
          vm.externalMountingTypeList = angular.copy(vm.externalMountingTypeListToDisplay);

          vm.rohsListToDisplay = Array.isArray(filters.rohsTypeList) && filters.rohsTypeList.length > 0 ? filters.rohsTypeList : [];
          vm.rohsList = angular.copy(vm.rohsListToDisplay);

          vm.externalRoHSStatusListToDisplay = Array.isArray(filters.externalROHSList) && filters.externalROHSList.length > 0 ? filters.externalROHSList : [];
          vm.externalRoHSStatusList = angular.copy(vm.externalRoHSStatusListToDisplay);

          vm.categoryListToDisplay = Array.isArray(filters.partTypeList) && filters.partTypeList.length > 0 ? filters.partTypeList : [];
          vm.categoryList = angular.copy(vm.categoryListToDisplay);


          return $q.resolve(filterResponse);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      //get data for None Progressive Filters
      vm.getNoneProgressiveFilters = () => {
        vm.mfrSearchText = undefined;
        const searchObj = {
          mfgType: vm.mfgType.toUpperCase() !== CORE.MFG_TYPE.DIST ? CORE.MFG_TYPE.MFG : vm.mfgType,
          isCodeFirst: true
        };

        return ComponentFactory.getNoneProgressiveFilters().query(searchObj).$promise.then((filterResponse) => {
          const filters = filterResponse.data;
          vm.assemblyTypeListToDisplay = Array.isArray(filters.assemblyTypeList) && filters.assemblyTypeList.length > 0 ? filters.assemblyTypeList : [];
          vm.assemblyTypeList = angular.copy(vm.assemblyTypeListToDisplay);

          vm.countryListToDisplay = Array.isArray(filters.acceptableShippingCountryList) && filters.acceptableShippingCountryList.length > 0 ? filters.acceptableShippingCountryList : [];
          vm.countryList = angular.copy(vm.countryListToDisplay);

          vm.operationalAttributeListToDisplay = Array.isArray(filters.operationalAttributeList) && filters.operationalAttributeList.length > 0 ? filters.operationalAttributeList : [];
          vm.operationalAttributeList = angular.copy(vm.operationalAttributeListToDisplay);

          vm.standardsListToDisplay = Array.isArray(filters.standardsList) && filters.standardsList.length > 0 ? filters.standardsList : [];
          vm.standardsList = angular.copy(vm.standardsListToDisplay);

          vm.disapprovedSupplierListToDisplay = Array.isArray(filters.disApprovedList) && filters.disApprovedList.length > 0 ? filters.disApprovedList : [];
          vm.disapprovedSupplierCodeDetail = angular.copy(vm.disapprovedSupplierListToDisplay);
          return $q.resolve(filterResponse);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      const getAllDataPromise = [vm.getNoneProgressiveFilters()];
      if (!vm.isHasSearchCriteria) {
        vm.getProgressiveFilters();
      }
      $scope.$parent.vm.cgBusyLoading = $q.all(getAllDataPromise).then((response) => {
        if (vm.isHasSearchCriteria) {
          vm.search(null, vm.hasHeaderSearchKeywork);
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });

      //==>> master redirection links
      vm.goToManufacturerList = (canRedirectToMfg) => {
        if (vm.mfgType.toUpperCase() == CORE.MFG_TYPE.DIST && !canRedirectToMfg) {
          BaseService.goToSupplierList();
        }
        else {
          BaseService.goToManufacturerList();
        }
      };
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };
      vm.goToPartStatusList = () => {
        BaseService.openInNew(USER.ADMIN_PART_STATUS_STATE, {});
      };
      vm.goToPackagingList = () => {
        BaseService.goToPackaging();
      };
      vm.goToFunctionalTypeList = () => {
        BaseService.goToFunctionalTypeList();
      };
      vm.goToMountingTypeList = () => {
        BaseService.goToMountingTypeList();
      };
      vm.goToStandardList = () => {
        BaseService.goToStandardList();
      };
      vm.goToRoHSStatusList = () => {
        BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
      };
      //redirect to Country master
      vm.goToCountryList = () => {
        BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});
      };
      //redirect to Operational Attributes master
      vm.goToOperationalAttributes = () => {
        BaseService.openInNew(USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_STATE, {});
      };
      //redirect to assembly type master
      vm.goToAssyTypeList = () => {
        BaseService.goToAssyTypeList();
      };
      // Redirect to Package/Case Type master
      vm.goToPackageCaseTypeList = () => {
        BaseService.goToPackageCaseTypeList();
      };
      //<<== master redirection links

      $scope.$on('$destroy', function (e) {
        if (vm.timeoutPartTypeWatch) {
          $timeout.cancel(vm.timeoutPartTypeWatch);
        }
        if (vm.timeoutRohsExternalWatch) {
          $timeout.cancel(vm.timeoutRohsExternalWatch);
        }
        if (vm.timeoutRohsWatch) {
          $timeout.cancel(vm.timeoutRohsWatch);
        }
        if (vm.timeoutMountingTypeExternalWatch) {
          $timeout.cancel(vm.timeoutMountingTypeExternalWatch);
        }
        if (vm.timeoutMountingTypeWatch) {
          $timeout.cancel(vm.timeoutMountingTypeWatch);
        }
        if (vm.timeoutFunctionalTypeExternalWatch) {
          $timeout.cancel(vm.timeoutFunctionalTypeExternalWatch);
        }
        if (vm.timeoutFunctionalTypeWatch) {
          $timeout.cancel(vm.timeoutFunctionalTypeWatch);
        }
        if (vm.timeoutPackagingWatch) {
          $timeout.cancel(vm.timeoutPackagingWatch);
        }
        if (vm.timeoutPartStatusWatch) {
          $timeout.cancel(vm.timeoutPartStatusWatch);
        }
        if (vm.timeoutWatch) {
          $timeout.cancel(vm.timeoutWatch);
        }
        if (vm.timeoutMfrForSupplierPartsWatch) {
          $timeout.cancel(vm.timeoutMfrForSupplierPartsWatch);
        }
        if (vm.timeoutPackagCaseWatch) {
          $timeout.cancel(vm.timeoutPackagCaseWatch);
        }
      });
    }
  }
})();

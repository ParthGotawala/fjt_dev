(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('viewDataElement', viewDataElement);

  /** @ngInject */
  function viewDataElement(CORE, USER, DataElementFactory, EntityFactory, $timeout, DataElementTransactionValueFactory, $q,
    $filter, CONFIGURATION, DialogFactory, DataElementTransactionValuesManualFactory, OperationDataelementFactory, SettingsFactory, WorkorderFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        dataelementList: '=?',
        refTransId: '@',
        refTransHistoryId: '=?',
        entityId: '=?',
        fileList: '=?',
        isProtected: '=?',
        applyTravelerFilter: '=?',
        currActiveForm: '=',
        optionalParameter: '=?', // if any new optional parameters are required then add here
        isReadOnly: '=?'
      },
      templateUrl: 'app/directives/custom/view-data-element/view-data-element.html',
      controller: viewDataElementCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function viewDataElementCtrl($scope, $element, $attrs, BaseService) {
      var vm = this;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSIGNFILEDS;
      vm.entity = $scope.entity;
      vm.isReadOnly = $scope.isReadOnly;
      vm.refTransId = $scope.refTransId ? parseInt($scope.refTransId) : 0;
      vm.refTransHistoryId = $scope.refTransHistoryId ? parseInt($scope.refTransHistoryId) : null;
      vm.optionalParameter = $scope.optionalParameter ? $scope.optionalParameter : {};
      vm.DateFormatArray = CORE.DateFormatArray;
      vm.WebSitePattern = CORE.WebSitePattern;
      vm.isProtected = $scope.isProtected;
      let subFormCount = 1;
      vm.taToolbar = CORE.Toolbar;
      vm.InputeFieldKeys = CORE.InputeFieldKeys;
      vm.applyTravelerFilter = $scope.applyTravelerFilter;
      vm.IsEdit = true;
      if (vm.applyTravelerFilter || vm.isProtected || vm.isReadOnly) {
        vm.isProtected = true;
        vm.IsEdit = false;
      }
      vm.deletedsubFormTransIDs = [];
      vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
      vm.dataElement_Default_Values = CORE.DataElement_Default_Values;

      const loginData = BaseService.loginUser;
      const roleData = loginData ? _.first(loginData.roles) : null;
      if (roleData && roleData.id && vm.entity === CORE.Entity.Operation) {
        getAllowOpDataElementRoleData();
      }
      if (vm.refTransId && vm.entity === CORE.Entity.Workorder) {
        getWoDataElementData();
      }
      let systemGeneratedEntity = true;

      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

      vm.OtherDetailTitle = CORE.OtherDetail.TabName;
      vm.DisplayStatusConst = CORE.DisplayStatus;

      vm.radioButtonGroup = {
        defaultValue: {
          array: CONFIGURATION.DataElement_Manage_RadioGroup.defaultValue
        }
      };

      vm.todayDate = new Date();
      vm.dateTimeOptions = {
        appendToBody: true
      };
      vm.timeOptions = {
        appendToBody: true
      };
      vm.dateOptions = {
        appendToBody: true
      };
      vm.FileTypeList = [];
      // -------------------------- [S] - Restricted Files Extension -------------------------------------------
      function retriveConfigureFileTypeList() {
        vm.cgBusyLoading = SettingsFactory.retriveConfigureFileType().query().$promise.then((response) => {
          vm.FileTypeList = [];
          vm.FileTypeExtension = '';
          if (response && response.data && response.data.length > 0) {
            vm.FileTypeList = _.map(response.data, (item) => item ? item.fileExtension : item);
            vm.FileTypeExtension = Array.isArray(vm.FileTypeList) && vm.FileTypeList.length > 0 ? '!' + vm.FileTypeList.join(',!') : '';
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };
      retriveConfigureFileTypeList();
      // -------------------------- [E] - Restricted Files Extension -------------------------------------------

      /**
       * Get Entity Details
       */

      const getEntityDetails = () => {
        EntityFactory.getEntityByName().query({ name: vm.entity }).$promise.then((res) => {
          if (res.data) {
            $scope.size = res.data.columnView ? res.data.columnView : 100;
            $scope.entityId = vm.entityId = res.data.entityID;
            vm.enityElementDetails(vm.entityId);
            systemGeneratedEntity = res.data.systemGenerated ? true : false;
            vm.isDisableEntityAccess = res.data.entityStatus === vm.DisplayStatusConst.Draft.ID;

            /* open edit page and delete any row of sub-form -> not save -> close edit page
                    and open edit page again then need to make data clear */
            if (systemGeneratedEntity) {
              vm.cgBusyLoading = DataElementTransactionValueFactory.clearGlobalTransIDsArrayOnInit();
            }
            else {
              vm.cgBusyLoading = DataElementTransactionValuesManualFactory.clearGlobalTransIDsArrayOnInit();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      if (vm.entity) {
        getEntityDetails();
      }
      //get workorder operation data element data woOPID wise.
      function getAllowOpDataElementRoleData() {
        return OperationDataelementFactory.retrieveWorkorderOperationDataElementList().query({ woOPID: vm.refTransId, woID: vm.optionalParameter.woID ? vm.optionalParameter.woID : '0' }).$promise.then((res) => {
          vm.List = [];
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            vm.List = res.data;
          }
          return res;
        }).catch((error) => BaseService.getErrorLog(error));
        //vm.cgBusyLoading = WorkorderOperationFactory.getAllowOpDataElementRoleData().query().$promise.then((roleData) => {
        //    if (roleData && roleData.data) {
        //        vm.roleList = roleData.data;
        //    }
        //}).catch((error) => {
        //    return BaseService.getErrorLog(error);
        //});
      }
      //get workorder data element data woOPID wise.
      function getWoDataElementData() {
        return WorkorderFactory.retrieveWorkorderDataElementList().query({ woID: vm.refTransId }).$promise.then((res) => {
          vm.WoList = [];
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            vm.WoList = res.data;
          }
          return res;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /**
      * retrieve EntityElement Details
      *
      * @param
      */
      vm.enityElementDetails = (entityID) => {
        let dataList = [];
        vm.cgBusyLoading = DataElementFactory.retrieveEntityDataElements().query({ id: entityID, isFromUI: true }).$promise.then((res) => {
          if (res.data) {
            _.each(res.data, (item) => {
              if (item.isRequired) {
                item.minlength = 10;
              }
              else {
                item.minlength = 0;
              }
            });
            if (res.data.length === 0) {
              $scope.dataelementList = vm.dataelementList = res.data;
              return;
            }
            /* Start - Keep only entity type dataelement (check dataelement_use_at field in dataelement table) */
            if (vm.entity === CORE.Entity.Equipment) {
              res.data = _.filter(res.data, (o) => (((o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1])
                && (o.equipmentDataelement.length > 0 && _.find(o.equipmentDataelement, (e) => e.eqpID === vm.refTransId)
                )))
              );

              if (res.data.length === 0) {
                $scope.dataelementList = vm.dataelementList = res.data;
                return;
              }
              //subFormControlLists = _.filter(subFormControlLists, (o) => { return o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[1] });
            }
            /* End - Keep only entity type dataelement (check dataelement_use_at field in dataelement table) */
            if (vm.entity === CORE.Entity.Component) {
              res.data = _.filter(res.data, (o) => ((o.componentDataelement.length > 0 && _.find(o.componentDataelement, (e) => e.componentID === vm.refTransId))));
              if (res.data.length === 0) {
                $scope.dataelementList = vm.dataelementList = res.data;
                return;
              }
              //subFormControlLists = _.filter(subFormControlLists, (o) => { return o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[1] });
            }
            /*start Keep only entity type dataelement of operation (check dataelement_use_at field in dataelement table)*/
            //if (vm.entity == CORE.Entity.Operation) {
            //    res.data = _.filter(res.data, (o) => {
            //        return ((o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[1])
            //            && (o.operationDataelement.length > 0 && _.find(o.operationDataelement, (e) => {
            //                return e.opID === vm.refTransId
            //            })))
            //    });

            //    if (res.data.length == 0) {
            //        $scope.dataelementList = vm.dataelementList = res.data;
            //        return;
            //    }
            //}
            /*end*/

            /*start Keep only entity type dataelement of operation (check dataelement_use_at field in dataelement table)
             Used only at workorder operation level,not for operation master.
             Here used woOPID as refTransId while saved.
             Each list is woOPIDwise for each workorder operation.
            */
            if (vm.entity === CORE.Entity.Operation) {
              vm.List = _.filter(vm.List, (o) =>
                ((o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1])
                  && (o.workorderOperationDataelement.length > 0 && _.find(o.workorderOperationDataelement, (e) => e.woOPID === vm.refTransId)
                  ))
              );
              //data filter for to get role wise dataelement.
              _.each(vm.List, (o) => {
                if (o.dataelement_use_at && o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1]) {
                  dataList.push(o);
                }
              });
              if (dataList && dataList.length > 0) {
                dataList = _.uniqBy(dataList, 'dataElementID');
                res.data = dataList;
              }

              if (vm.List.length === 0) {
                $scope.dataelementList = vm.dataelementList = vm.List;
                return;
              }
            }
            if (vm.entity === CORE.Entity.Workorder) {
              if (vm.applyTravelerFilter) {
                vm.WoList = _.filter(vm.WoList, (o) => ((o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[0])
                  && (o.workorderDataelement.length > 0 && _.find(o.workorderDataelement, (e) => e.woID === vm.refTransId)))
                );
                //data filter for to get role wise dataelement.
                _.each(vm.WoList, (o) => {
                  if (o.dataelement_use_at && o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[0]) {
                    dataList.push(o);
                  }
                });
              } else {
                vm.WoList = _.filter(vm.WoList, (o) =>
                  ((o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1])
                    && (o.workorderDataelement.length > 0 && _.find(o.workorderDataelement, (e) => e.woID === vm.refTransId
                    )))
                );
                //data filter for to get role wise dataelement.
                _.each(vm.WoList, (o) => {
                  if (o.dataelement_use_at && o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[1]) {
                    dataList.push(o);
                  }
                });
              }
              if (dataList && dataList.length > 0) {
                dataList = _.uniqBy(dataList, 'dataElementID');
                res.data = dataList;
              }

              if (vm.WoList.length === 0) {
                $scope.dataelementList = vm.dataelementList = vm.WoList;
                return;
              }
            }
            /*end*/

            /* Start - To Set empty state when all element only of subform type and has no sub element  */
            const isAllSubFormTrue = _.every(res.data, ['controlTypeID', CORE.InputeFieldKeys.SubForm]);
            if (isAllSubFormTrue) {
              $scope.dataelementList = vm.dataelementList = [];
              return;
            }
            /* End - To Set empty state when all element only of subform type and has no sub element  */


            res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
            //Sub form list
            const subFormControlLists = _.remove(res.data, (o) => o.controlTypeID === CORE.InputeFieldKeys.SubForm);


            _.each(subFormControlLists, (item) => {
              item.subFormControls = [];
              item.dataelementDefault = [];
              item.subFormCount = subFormCount++;
              //item.addSubFormItem = true;
              if (!_.isNull(item.recurring_limit) && !_.isUndefined(item.recurring_limit)) {
                item.isMultiple = true;
              }
              else {
                item.isMultiple = false;
                item.recurring_limit = null;
              }
            });

            _.each(res.data, (dataelement) => {
              if (dataelement.controlTypeID === vm.InputeFieldKeys.DateTime) {
                if (dataelement.dateTimeType === null || dataelement.dateTimeType === '' || dataelement.dateTimeType === '0') {
                  dataelement.dateTimeType = '0';
                  if (dataelement.formatMask) {
                    //let DateFormateMast = dataelement.formatMask;
                    //let splitDate = DateFormateMast.split(" ");
                    //let UpperDate = splitDate[0].toUpperCase();
                    //dataelement.DateformatMask = UpperDate + ' ' + splitDate[1];
                    dataelement.DateformatMask = dataelement.formatMask;
                    //let findFormat = _.find(vm.DateFormatArray, { 'bootstapformat': dataelement.formatMask });
                    //dataelement.uimaskformat = findFormat ? findFormat.uimaskformat : vm.DateFormatArray[1].uimaskformat;
                  }
                  else {
                    //let DateFormateMask = vm.DateFormatArray[1].bootstapformat;
                    //let splitDate = DateFormateMask.split(" ");
                    //let UpperDate = splitDate[0].toUpperCase();
                    //dataelement.DateformatMask = UpperDate + ' ' + splitDate[1];
                    //dataelement.uimaskformat = vm.DateFormatArray[1].uimaskformat;
                    dataelement.DateformatMask = vm.DateFormatArray[1].format;
                    dataelement.formatMask = vm.DateFormatArray[1].format;
                  }
                }
                else if (dataelement.dateTimeType === '1') {
                  if (dataelement.formatMask) {
                    //dataelement.DateformatMask = dataelement.formatMask.toUpperCase();
                    dataelement.DateformatMask = dataelement.formatMask;
                    //dataelement.DateformatMask = dataelement.formatMask;
                    //let findFormat = _.find(vm.DateFormatArray, { 'bootstapformat': dataelement.formatMask });
                    //dataelement.uimaskformat = findFormat ? findFormat.uimaskformat : vm.DateFormatArray[1].uimaskformat;
                  }
                  else {
                    dataelement.DateformatMask = vm.DateFormatArray[0].format;
                    dataelement.formatMask = vm.DateFormatArray[0].format;
                  }
                }
                else {
                  if (dataelement.formatMask) {
                    dataelement.DateformatMask = dataelement.formatMask;
                  }
                  else {
                    dataelement.DateformatMask = vm.DateFormatArray[15].format;
                    dataelement.formatMask = vm.DateFormatArray[15].format;
                  }
                  //dataelement.uimaskformat = findFormat ? findFormat.uimaskformat : vm.DateFormatArray[1].uimaskformat;
                }

                const findFormat = _.find(vm.DateFormatArray, { 'format': dataelement.formatMask });
                if (findFormat) {
                  dataelement.uimaskformatForDateTime = findFormat.uimaskformat;
                  dataelement.placeholderForDateTime = findFormat.placeholder;
                }

                if (dataelement.defaultValue || !dataelement.isManualData) {
                  //set current date if auto gets from db (auto specify current value is to be displayed)
                  dataelement.defaultValue = dataelement.defaultValue ? new Date(dataelement.defaultValue) : ((dataelement.isManualData) ? null : new Date());
                }
              }
              else if (dataelement.controlTypeID === vm.InputeFieldKeys.MultipleChoice) {
                dataelement.anySelected = false;
              }
              else if (dataelement.controlTypeID === vm.InputeFieldKeys.DateRange) {
                if (dataelement.formatMask === null) {
                  dataelement.formatMask = vm.DateFormatArray[0].format;
                }
                //set current date if auto gets from db (auto specify current value is to be displayed)
                if (dataelement.isManualData) {
                  dataelement.fromDate = dataelement.fromDate ? BaseService.checkForDateNullValue(dataelement.fromDate) : null;
                  dataelement.toDate = dataelement.toDate ? BaseService.checkForDateNullValue(dataelement.toDate) : null;
                } else {
                  dataelement.fromDate = new Date();
                  dataelement.toDate = new Date();
                }
                const findFormat = _.find(vm.DateFormatArray, { 'format': dataelement.formatMask });
                if (findFormat) {
                  dataelement.uimaskformatForDateTime = findFormat.uimaskformat;
                  dataelement.placeholderForDateTime = findFormat.placeholder;
                }
                dataelement.DateformatMask = dataelement.formatMask;

                dataelement.fromDateOptions = {
                  maxDate: dataelement.toDate ? dataelement.toDate : '',
                  appendToBody: false,
                  fromDateOpenFlag: false
                };
                dataelement.toDateOptions = {
                  minDate: dataelement.fromDate ? dataelement.fromDate : '',
                  appendToBody: false,
                  toDateOpenFlag: false
                };
              }
              else if (dataelement.controlTypeID === vm.InputeFieldKeys.FileUpload) {
                if (dataelement.fileType) {
                  try {
                    dataelement.fileType = JSON.parse(dataelement.fileType);
                  } catch (e) {
                    console.log(e);
                  }
                  _.each(vm.FileTypeList, (types) => {
                    _.each(dataelement.fileType, (file) => {
                      if (types.mimetype === file) {
                        types.isDefault = true;
                      }
                    });
                  });
                }
                else {
                  dataelement.fileType = [];
                }
              }
              if (dataelement.isDatasource && dataelement.datasourceID &&
                (dataelement.controlTypeID === vm.InputeFieldKeys.MultipleChoice
                  || dataelement.controlTypeID === vm.InputeFieldKeys.Option || dataelement.controlTypeID === vm.InputeFieldKeys.Combobox
                  || dataelement.controlTypeID === vm.InputeFieldKeys.MultipleChoiceDropdown)) {
                dataelement.dataElementKeyValues = [];
                if (!dataelement.isFixedEntity && dataelement.dataElementTransactionValuesManual && dataelement.datasourceDisplayColumnID) {
                  /* data from dataelement_transactionvalues_manual */
                  _.each(dataelement.dataElementTransactionValuesManual, (manualitem) => {
                    const _objDataFieldValueSelection = {};
                    _objDataFieldValueSelection.keyValueID = manualitem.dataElementTransManualID;
                    _objDataFieldValueSelection.name = manualitem.value;
                    _objDataFieldValueSelection.value = manualitem.dataElementTransManualID;
                    //_objDataFieldValueSelection.defaultValue = selectedDataElement.dataElementName;
                    dataelement.dataElementKeyValues.push(_objDataFieldValueSelection);
                  });
                }
                else if (dataelement.isFixedEntity) {
                  /* data from fixed_entity_dataelement related table */
                  _.each(dataelement.dataElementKeyValList, (fixeditem) => {
                    const _objDataFieldValueSelection = {};
                    _objDataFieldValueSelection.keyValueID = fixeditem[Object.keys(fixeditem)[0]];/* fixeditem[0] - key column id */
                    _objDataFieldValueSelection.name = fixeditem[Object.keys(fixeditem)[1]];/* fixeditem[1] - display column */
                    _objDataFieldValueSelection.value = fixeditem[Object.keys(fixeditem)[0]];
                    dataelement.dataElementKeyValues.push(_objDataFieldValueSelection);
                  });
                }
              }
              if ((dataelement.isManualData || (dataelement.isDatasource && dataelement.datasourceID))
                && dataelement.dataElementKeyColumn
                && (dataelement.controlTypeID === vm.InputeFieldKeys.CustomAutoCompleteSearch)) {
                if (!dataelement.isFixedEntity && dataelement.datasourceDisplayColumnID) {
                  /* data from dataelement_transactionvalues_manual */
                  const searchobj = {
                    datasourceID: dataelement.datasourceID,
                    datasourceDisplayColumnID: dataelement.datasourceDisplayColumnID
                  };
                  dataelement.autoCompleteEntity = {
                    columnName: dataelement.dataElementKeyColumn.keyColumnId,
                    keyColumnName: dataelement.dataElementKeyColumn.keyColumn,
                    keyColumnId: null,
                    inputName: dataelement.dataElementID,
                    placeholderName: dataelement.dataElementName,
                    isRequired: dataelement.isRequired,
                    isDisabled: false,
                    isAddnew: false,
                    onSelectCallbackFn: (item) => {
                      dataelement.defaultValue = item ? item.dataElementTransManualID : null;
                    },
                    onSearchFn: (query) => {
                      searchobj.searchText = query;
                      return getSearchValueForCustomEntity(searchobj, false);
                    }
                  };
                }
                else if (dataelement.isFixedEntity) {
                  /* data from fixed_entity_dataelement related table */
                  const searchobj = {
                    datasourceID: dataelement.datasourceID,
                    controlTypeID: dataelement.controlTypeID
                  };
                  dataelement.autoCompleteEntity = {
                    columnName: dataelement.dataElementKeyColumn.keyColumn,
                    keyColumnName: dataelement.dataElementKeyColumn.keyColumnId,
                    keyColumnId: null,
                    inputName: dataelement.dataElementID,
                    placeholderName: dataelement.dataElementName,
                    isRequired: dataelement.isRequired,
                    isDisabled: false,
                    isAddnew: false,
                    onSelectCallbackFn: (item) => {
                      dataelement.defaultValue = item ? item[dataelement.dataElementKeyColumn.keyColumnId] : null;
                    },
                    onSearchFn: (query) => {
                      searchobj.searchText = query;
                      return getSearchValueForFixedEntity(searchobj, false);
                    }
                  };
                } else if (dataelement.isManualData) {
                  /* for manual data */
                  const searchobj = {
                    dataElementID: dataelement.dataElementID,
                    controlTypeID: dataelement.controlTypeID,
                    isManualData: dataelement.isManualData
                  };
                  dataelement.autoCompleteEntity = {
                    columnName: dataelement.dataElementKeyColumn.keyColumn,
                    keyColumnName: dataelement.dataElementKeyColumn.keyColumnId,
                    keyColumnId: null,
                    inputName: dataelement.dataElementID,
                    placeholderName: dataelement.dataElementName,
                    isRequired: dataelement.isRequired,
                    isDisabled: false,
                    isAddnew: false,
                    onSelectCallbackFn: (item) => {
                      dataelement.defaultValue = item ? item[dataelement.dataElementKeyColumn.keyColumnId] : null;
                    },
                    onSearchFn: (query) => {
                      searchobj.searchText = query;
                      return getSearchValueForManualData(searchobj, false);
                    }
                  };
                }
              }
              if (dataelement.parentDataElementID) {
                const obj = _.find(subFormControlLists, (o) => o.dataElementID === dataelement.parentDataElementID);
                if (obj) {
                  dataelement.subFormCount = obj.subFormCount;
                  dataelement.IsSubFormElement = true;
                  obj.dataelementDefault.push(dataelement);
                  //obj.subFormControls.push(dataelement);
                }
              }
              if (dataelement) {
                dataelement.defaultValue = dataelement.defaultValue ?
                  ((dataelement.controlTypeID === vm.InputeFieldKeys.Numberbox || dataelement.controlTypeID === vm.InputeFieldKeys.Currency)
                    ? (dataelement.decimal_number > 0 ? parseFloat(dataelement.defaultValue) : parseInt(dataelement.defaultValue))
                    : (dataelement.controlTypeID === vm.InputeFieldKeys.SingleChoice ? dataelement.defaultValue === 'true' : dataelement.defaultValue)) : null;
                if (dataelement.decimal_number > 0) {
                  dataelement.isDecimal = true;
                }
                dataelement.fieldValue = dataelement.dataElementKeyValues;
              }
            });
            if (subFormControlLists.length > 0) {
              _.each(subFormControlLists, (t) => {
                if (!t.isMultiple) {
                  t.rowNumber = 1;
                  if (t.dataelementDefault) {
                    _.each(t.dataelementDefault, (dataElement) => {
                      dataElement.rowNumber = 1;
                    });
                  }
                  t.subFormControls.push(angular.copy(t.dataelementDefault));
                }
                res.data.push(t);
              });
            }
            res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
            _.remove(res.data, (o) => o.parentDataElementID !== null);

            $scope.dataelementList = vm.dataelementList = res.data;
            if (vm.refTransId) {
              if (systemGeneratedEntity) {
                if (!vm.refTransHistoryId) {
                  vm.getDataElementTransactionValues();
                } else {
                  vm.getRFQAssyDataElementTransactionValuesHistory();
                }
              }
              else {
                vm.getDataElementTransactionValuesManual();
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /**
      * Get EntityElement's Transaction Values
      */
      vm.getDataElementTransactionValues = () => {
        vm.cgBusyLoading = DataElementTransactionValueFactory.getDataElementTransactionValues().query({ refTransID: vm.refTransId, entityID: vm.entityId }).$promise.then((res) => {
          vm.elementTransactionList = res.data;
        }).catch((error) => BaseService.getErrorLog(error))
          .finally(() => {
            //vm.elementTransactionList = vm.elementTransactionList || [];
            //if (vm.elementTransactionList.length > 0) {
            //    assigneElementValue(vm.dataelementList);
            //}
            vm.getSubformTransactionDetail();
          });
      };

      /**
     * Get EntityElement's Transaction Values from History
     */
      vm.getRFQAssyDataElementTransactionValuesHistory = () => {
        vm.cgBusyLoading = DataElementTransactionValueFactory.getRFQAssyDataElementTransactionValuesHistory().query({ refTransID: vm.refTransId, refTransHistoryId: vm.refTransHistoryId, entityID: vm.entityId }).$promise.then((res) => {
          vm.elementTransactionList = res.data;
        }).catch((error) => BaseService.getErrorLog(error))
          .finally(() => {
            vm.getSubformTransactionDetail();
          });
      };


      /* Get EntityElement's Transaction Values Manual */
      vm.getDataElementTransactionValuesManual = () => {
        vm.cgBusyLoading = DataElementTransactionValuesManualFactory.getDataElementTransactionValuesManual().query({ refTransID: vm.refTransId, entityID: vm.entityId }).$promise.then((res) => {
          vm.elementTransactionList = res.data;
        }).catch((error) => BaseService.getErrorLog(error))
          .finally(() => {
            //vm.elementTransactionList = vm.elementTransactionList || [];
            //if (vm.elementTransactionList.length > 0) {
            //    assigneElementValue(vm.dataelementList);
            //}
            vm.getSubformTransactionDetail();
          });
      };


      vm.getSubformTransactionDetail = () => {
        const refSubFormTransIDs = _.filter(vm.elementTransactionList, (obj) => (obj.refSubFormTransID))
          .map((obj) => obj.refSubFormTransID);
        let subFormTransList = [];
        if (refSubFormTransIDs.length > 0) {
          vm.cgBusyLoading = DataElementTransactionValueFactory.getSubformTransactionDetail().query({ refSubFormTransIDs: refSubFormTransIDs }).$promise.then((res) => {
            subFormTransList = res.data;
          }).catch((error) => BaseService.getErrorLog(error))
            .finally(() => {
              if (subFormTransList.length > 0) {
                _.each(subFormTransList, (subFormData) => {
                  const objElement = _.find(vm.dataelementList, (itemElement) => itemElement.dataElementID === subFormData.parentDataElementID);
                  if (objElement) {
                    objElement.rowNumber = subFormData.rowNumber;
                    objElement.subFormTransID = subFormData.subFormTransID;

                    vm.AddNewSubFormRecord(objElement, true);
                  }
                });
              }
              defineLastElementSubForm();

              vm.elementTransactionList = vm.elementTransactionList || [];
              if (vm.elementTransactionList.length > 0) {
                assigneElementValue(vm.dataelementList);
              }
            });
        }
        else {
          vm.elementTransactionList = vm.elementTransactionList || [];
          if (vm.elementTransactionList.length > 0) {
            assigneElementValue(vm.dataelementList);
          }
          defineLastElementSubForm();
        }
      };

      /**
      * Assign Values to Element
      */
      const assigneElementValue = (dataelementList) => {
        _.each(dataelementList, (obj) => {
          if (obj.controlTypeID === vm.InputeFieldKeys.SubForm) {
            _.each(obj.subFormControls, (item) => {
              assigneElementValue(item);
            });
          }
          else {
            const dataelement = _.find(vm.elementTransactionList, (item) => {
              if (obj.subFormTransID) {
                return (item.dataElementID === obj.dataElementID && item.refSubFormTransID === obj.subFormTransID);
              }
              else {
                return (item.dataElementID === obj.dataElementID);
              }
            });
            if (dataelement) {
              if (obj.controlTypeID === vm.InputeFieldKeys.DateTime) {
                //set current date if auto gets from db (auto specify current value is to be displayed)
                obj.defaultValue = dataelement.value ? new Date(dataelement.value) : ((dataelement.isManualData) ? null : new Date());
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.DateRange) {
                if (dataelement.value) {
                  const dateRange = dataelement.value.split('|');
                  //set current date if auto gets from db (auto specify current value is to be displayed)
                  if (dateRange && dateRange.length > 0) {
                    obj.fromDate = (dataelement.isManualData) ? new Date() : BaseService.checkForDateNullValue(dateRange[0]);
                    obj.toDate = (dataelement.isManualData) ? new Date() : BaseService.checkForDateNullValue(dateRange[1]);
                  } else {
                    obj.fromDate = null;
                    obj.toDate = null;
                  }
                }
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.SingleChoice) {
                obj.defaultValue = dataelement.value === 'true' ? true : false;
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.MultipleChoice) {
                if (dataelement.value) {
                  const selectedOptions = dataelement.value.split('|').map((o) => parseInt(o));
                  obj.anySelected = selectedOptions.length > 0 ? true : false;
                  _.each(obj.fieldValue, (option) => {
                    if (selectedOptions.indexOf(option.keyValueID) !== -1) {
                      option.defaultValue = true;
                    }
                    else {
                      option.defaultValue = false;
                    }
                  });
                }
                else {
                  obj.anySelected = false;
                }
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.Option || obj.controlTypeID === vm.InputeFieldKeys.Combobox) {
                const selectedValue = _.find(obj.fieldValue, (option) => option.keyValueID === parseInt(dataelement.value));
                if (selectedValue) {
                  obj.defaultValue = selectedValue.value;
                }
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.CustomAutoCompleteSearch) {
                if (dataelement.value) {
                  const searchobj = {
                    datasourceID: obj.datasourceID,
                    controlTypeID: obj.controlTypeID,
                    searchID: dataelement.value,
                    datasourceDisplayColumnID: obj.datasourceDisplayColumnID,
                    dataElementID: obj.dataElementID,
                    isManualData: obj.isManualData
                  };
                  if (obj.isDatasource && obj.isFixedEntity) {
                    getSearchValueForFixedEntity(searchobj, obj);
                  } else if (obj.isDatasource && !obj.isFixedEntity) {
                    getSearchValueForCustomEntity(searchobj, obj);
                  } else if (obj.isManualData) {
                    getSearchValueForManualData(searchobj, obj);
                  }
                }
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.MultipleChoiceDropdown) {
                const selectedOptions = dataelement.value.split('|').map((o) => parseInt(o));
                obj.defaultValue = _.filter(obj.fieldValue, (o) => (selectedOptions.indexOf(o.keyValueID) !== -1))
                  .map((o) => o.value);
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.FileUpload) {
                //FileUpload
                const fileDetail = dataelement.value.split('|');
                obj.fileDetail = {
                  path: fileDetail.length > 0 ? fileDetail[0] : '',
                  mimetype: fileDetail.length > 1 ? fileDetail[1] : '',
                  originalname: fileDetail.length > 2 ? fileDetail[2] : '',
                  filename: fileDetail.length > 3 ? fileDetail[3] : ''
                };
                obj.fileDetail.isImageTypeFile = (obj.fileDetail.mimetype.indexOf('image/') !== -1);
                obj.fileDetail.isPDFTypeFile = (obj.fileDetail.mimetype.indexOf('/pdf') !== -1);
                obj.fileDetail.isVideoTypeFile = (obj.fileDetail.mimetype.indexOf('video/') !== -1);
                obj.fileDetail.isAudioTypeFile = (obj.fileDetail.mimetype.indexOf('audio/') !== -1);
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.Numberbox || obj.controlTypeID === vm.InputeFieldKeys.Currency) {
                obj.defaultValue = dataelement.value ? parseFloat(dataelement.value) : null;
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.Signature) {
                obj.defaultValue = dataelement.value;
                obj.isSignatureAdded = dataelement.value ? true : false;
              }
              else {
                obj.defaultValue = dataelement.value;
              }
              obj.refSubFormTransID = dataelement.refSubFormTransID;
              //obj.dataElementTransID = dataelement.dataElementTransID;
              obj.dataElementTransID = dataelement.dataElementTransID ? dataelement.dataElementTransID : dataelement.dataElementTransManualID;
              obj.createdBy = dataelement.createdBy;
            }
          }
        });
      };

      vm.documentFiles = (files, $invalidFiles, elementDet) => {
        _.each(files, (objFile, index) => {
          if (objFile.name === 'image.png') {
            files[index] = new File([objFile], `${new Date().getTime()}.png`, { type: 'image/png' });
          }
        });
        if (files.length > 0) {
          if (elementDet.parentDataElementID) {
            $scope.fileList[`${elementDet.dataElementID}` + '_RowNumber_' + elementDet.rowNumber] = elementDet.defaultValue;
          }
          else {
            $scope.fileList[`${elementDet.dataElementID}`] = elementDet.defaultValue;
          }
        }
        else if ($invalidFiles && $invalidFiles.length > 0) {
          elementDet.defaultValue = null;
        } else {
          if (elementDet.parentDataElementID) {
            elementDet.defaultValue = $scope.fileList[`${elementDet.dataElementID}` + '_RowNumber_' + elementDet.rowNumber];
          }
          else {
            elementDet.defaultValue = $scope.fileList[`${elementDet.dataElementID}`];
          }
        }
      };

      vm.removeDocument = (itemElement) => {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.REMOVE_SINGLE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Document');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            itemElement.value = '';
            itemElement.fileDetail = null;
            manuallyEnableSaveButton();
          }
        }, () => { // Block for cancel
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.downloadDocument = (itemElement) => {
        const file = itemElement.fileDetail;
        const downloadDocPromises = [downloadElementDocument(itemElement)];
        vm.cgBusyLoading = $q.all(downloadDocPromises).then((response) => {
          if (response && response.length > 0 && response[0] && response[0].data) {
            const blob = new Blob([response[0].data], { type: file.mimetype });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, file.originalname);
            } else {
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', file.originalname);
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // to download selected document
      const downloadElementDocument = (itemElement) => {
        if (systemGeneratedEntity) {
          vm.cgBusyLoading = DataElementTransactionValueFactory.downloadDocument(itemElement.dataElementTransID);
        }
        else {
          vm.cgBusyLoading = DataElementTransactionValuesManualFactory.downloadDocument(itemElement.dataElementTransID);
        }
        return vm.cgBusyLoading.then((response) => {
          //if (_.includes([404, 403, 401], response.status)) {
          const model = {
            messageContent: '',
            multiple: true
          };
          if (response.status === 404) {
            //model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.NotFound;
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 403) {
            //model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.AccessDenied;
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 401) {
            //model.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.Unauthorized;
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
            DialogFactory.messageAlertDialog(model);
          }
          else {
            return response;
          }
          //}
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //------------------------- [S] Check last Controle for Sub Form Element(Focus To Save Button) --------------------
      function defineLastElementSubForm() {
        var elementList = vm.dataelementList;
        if (elementList.length > 0) {
          const lastRec = _.last(elementList);
          if (typeof (_.last(elementList)) === 'object') {
            if (lastRec.controlTypeID === CORE.InputeFieldKeys.SubForm) {
              lastRec.isLastSubFormElement = true;

              const lastSubForm = _.last(lastRec.subFormControls);

              const limitExist = (lastRec.isMultiple && ((lastRec.recurring_limit === 0) || lastRec.subFormControls.length < lastRec.recurring_limit)) ? true : false;
              for (let controlIndex = 0; controlIndex < lastRec.subFormControls.length; controlIndex++) {
                if (controlIndex === (lastRec.subFormControls.length - 1)) {
                  const lastElement = _.last(lastSubForm);
                  _.each(lastRec.subFormControls[controlIndex], (dataItem) => {
                    dataItem.isLastElement = (!limitExist) && dataItem.dataElementID === lastElement.dataElementID ? true : false;
                  });
                }
                else {
                  _.each(lastRec.subFormControls[controlIndex], (dataItem) => {
                    dataItem.isLastElement = false;
                  });
                }
              }
            }
          }
        }
      }
      //------------------------- [E] Check last Controle for Sub Form Element(Focus To Save Button) --------------------

      vm.AddNewSubFormRecord = (itemElement, IsAuto) => {
        // IsAuto true - while render after getting data from subtransaction values

        if (!IsAuto) {
          if (!itemElement.rowNumber) {
            itemElement.rowNumber = 0;
          }
          itemElement.rowNumber = itemElement.rowNumber + 1;
          const objSubForm = itemElement;
          _.each(objSubForm.dataelementDefault, (dataItem) => {
            dataItem.refSubFormTransID = null;
            dataItem.dataElementTransID = null;
            //if (dataItem.dataElementTransManualID) {
            dataItem.dataElementTransManualID = null;
            //}
            dataItem.subFormTransID = null;
            dataItem.rowNumber = itemElement.rowNumber;
          });
          itemElement.subFormControls.push(angular.copy(objSubForm.dataelementDefault));
        } else {
          _.each(itemElement.dataelementDefault, (dataItem) => {
            dataItem.rowNumber = itemElement.rowNumber;
            dataItem.subFormTransID = itemElement.subFormTransID;
            if (dataItem.autoCompleteEntity) {
              dataItem.autoCompleteEntity.inputName = stringFormat('{0}_{1}', dataItem.dataElementID, dataItem.rowNumber);
            }
          });
          if (!itemElement.isMultiple) {
            itemElement.rowNumber = 1;
            _.each(itemElement.subFormControls, (item) => {
              _.each(item, (subItem) => {
                subItem.rowNumber = 1;
                subItem.subFormTransID = itemElement.subFormTransID;
              });
            });
            //if (itemElement.subFormControls.length == 0) {
            //    itemElement.subFormControls.push(angular.copy(itemElement.dataelementDefault));
            //}
          }
          else {
            itemElement.subFormControls.push(angular.copy(itemElement.dataelementDefault));
          }
        }

        defineLastElementSubForm();
      };

      const deletedRowNumberIDs = [];
      vm.DeleteSubFormRecord = (itemElement, subElement) => {
        // Case for delete binded entry of subform with subFormTransID
        const subFormTransIDList = _.compact(_.uniq(_.map(subElement, 'subFormTransID')));
        if (subFormTransIDList.length > 0) {
          _.each(subFormTransIDList, (ItemElement) => {
            if (ItemElement) {
              vm.deletedsubFormTransIDs.push(ItemElement);
            }
          });
        } else {
          // Case for delete new entry of subform without subFormTransID
          const uniList = _.uniq(_.map(subElement, 'rowNumber'));
          _.each(uniList, (ItemElement) => {
            if (ItemElement) {
              deletedRowNumberIDs.push(ItemElement);
            }
          });
        }

        _.each(itemElement.subFormControls, (item) => {
          // for all subformtransids
          _.remove(item, (obj) => _.includes(vm.deletedsubFormTransIDs, obj.subFormTransID));
          // for all rownumbers
          _.remove(item, (obj) => _.includes(deletedRowNumberIDs, obj.rowNumber));
        });

        // delete array of array if no data in array
        _.remove(itemElement.subFormControls, (obj) => obj.length === 0);

        if (systemGeneratedEntity) {
          vm.cgBusyLoading = DataElementTransactionValueFactory.assignDeletedsubFormTransID(vm.deletedsubFormTransIDs);
        }
        else {
          vm.cgBusyLoading = DataElementTransactionValuesManualFactory.assignDeletedsubFormTransID(vm.deletedsubFormTransIDs);
        }
        manuallyEnableSaveButton();
      };

      vm.CheckAnyOneSelected = (itemElementData) => {
        const trues = $filter('filter')(itemElementData.fieldValue, {
          defaultValue: true
        });
        itemElementData.anySelected = trues.length > 0 ? true : false;
      };

      /*set datepicker format*/
      vm.bindDatePicker = (format, from, to) => {
        vm.format = format ? format : vm.DateFormatArray[0].format;
        vm.maxdate = to ? to : new Date();
        vm.mindate = from ? from : new Date();
      };

      /*set date to partifuclar format in datepicker*/
      vm.locale = {
        formatDate: function (date) {
          return $filter('date')(date, vm.format);
        }
      };

      vm.setSignatureValue = (itemElementData, signature) => {
        if (signature.isEmpty || !signature.dataUrl) {
          //DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.PROVIDE_SIGNATURE, multiple: true });
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PROVIDE_SIGNATURE);
          const obj = {
            messageContent: messageContent,
            muliple: true
          };
          DialogFactory.messageAlertDialog(obj);
          return;
        }
        itemElementData.defaultValue = signature.dataUrl;
        itemElementData.isSignatureAdded = true;
        if (itemElementData.IsSubFormElement) {
          vm.dataElementValueForm[itemElementData.dataElementID + '_' + itemElementData.rowNumber].$setDirty();
        }
        else {
          vm.dataElementValueForm[itemElementData.dataElementID].$setDirty();
        }
      };

      vm.clearSignatureValue = (itemElementData) => {
        itemElementData.isSignatureAdded = false;
      };

      vm.deleteSignatureValue = (itemElementData, clearFunCallback, acceptFunCallback, signature) => {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.REMOVE_SINGLE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Signature');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            clearFunCallback();  //clear();
            signature = acceptFunCallback();  //accept();
            itemElementData.defaultValue = null;
            itemElementData.isSignatureAdded = false;
            if (itemElementData.IsSubFormElement) {
              vm.dataElementValueForm[itemElementData.dataElementID + '_' + itemElementData.rowNumber].$setDirty();
            }
            else {
              vm.dataElementValueForm[itemElementData.dataElementID].$setDirty();
            }
          }
        }, () => { // cancel Block
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.addRecord = () => {
        if (vm.entityId === CORE.AllEntityIDS.Operation.ID) {
          $('.jstree').jstree(true).deselect_all(true);
          $('.jstree').jstree(true).select_node(CORE.Workorder_Operation_Tabs.DataFields.ID + '_' + vm.refTransId);
        }
        else if (vm.entityId === CORE.AllEntityIDS.Workorder.ID) {
          $('.jstree').jstree(true).deselect_all(true);
          $('.jstree').jstree(true).select_node(CORE.Workorder_Tabs.DataFields.ID);
        }
        else if (vm.entityId === CORE.AllEntityIDS.Equipment.ID) { /* from manage equipment page */
          //$scope.$parent.$parent.vm.entitiesAll(true); // called parent controller method
          $scope.$parent.$parent.vm.selectedTabIndex = 4;  // 4 - Data Field Tab
        }
        else if ($scope.entityId) {
          BaseService.goToElementManage($scope.entityId);
        }
      };

      vm.elementChange = (itemElementData) => {
        if (itemElementData.IsSubFormElement) {
          vm.dataElementValueForm[itemElementData.dataElementID + '_' + itemElementData.rowNumber].$setDirty();
        }
        else {
          vm.dataElementValueForm[itemElementData.dataElementID].$setDirty();
        }
      };

      vm.fab = {
        isOpen: false
      };

      vm.moveToDataFields = () => {
        if (systemGeneratedEntity) {
          BaseService.goToElementManage(vm.entityId);
        }
        else {
          BaseService.goToCreateFormsElementManage(vm.entityId);
        }
      };

      // To Refresh Data Fields
      vm.getAndDisplayUpdatedDataFields = () => {
        const isDirty = vm.dataElementValueForm.$dirty;
        if (isDirty) {
          return showWithoutSavingAlertforTabRefresh();
        }
        else {
          refreshEntityElementData();
        }
      };

      /* Show save alert popup when performing tab change*/
      function showWithoutSavingAlertforTabRefresh() {
        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.REFRESH_BUTTON_TXT,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        return DialogFactory.messageConfirmDialog(obj).then(() => {
          refreshEntityElementData();
          vm.dataElementValueForm.$setPristine();
          if ($scope.currActiveForm) {
            $scope.currActiveForm.$dirty = false;
          }
          return true;
        }, () => {
          /*Set focus on first enabled field when user click stay on button*/
          if (vm.dataElementValueForm) {
            BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.dataElementValueForm);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // common function to refresh  data
      const refreshEntityElementData = () => {
        if (roleData && roleData.id && vm.entity === CORE.Entity.Operation) {
          getAllowOpDataElementRoleData();
        }
        else if (vm.refTransId && vm.entity === CORE.Entity.Workorder) {
          getWoDataElementData();
        }
        getEntityDetails();
      };

      const manuallyEnableSaveButton = () => {
        // Static code to enable save button
        //vm.dataElementValueForm.$$controls[0].$setDirty();
        vm.dataElementValueForm.$setDirty();
        vm.dataElementValueForm.$dirty = true;
      };

      //Set mindate value onchange in From Date
      vm.onChangeFromDate = (itemElementData, toDate, fromDate) => {
        if (fromDate) {
          itemElementData.toDateOptions = {
            minDate: fromDate,
            appendToBody: true,
            toDateOpenFlag: false
          };

          if (toDate) {
            const fromDatePartOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
            const toDatePartOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
            if (fromDatePartOnly > toDatePartOnly) {
              $timeout(() => {
                itemElementData.toDate = null;
              }, true);
            }
          }
        }
      };

      // to preview selected document
      vm.previewDocument = (ev, itemElementData) => {
        if (!itemElementData || !itemElementData.fileDetail || !itemElementData.fileDetail.path) {
          return;
        }
        const entityDocumentList = [];
        const docPath = itemElementData.fileDetail.path.startsWith('./') ? itemElementData.fileDetail.path.replace('./', '') : null;
        const previewEleDataObj = {
          originalFileName: itemElementData.fileDetail.originalname,
          docPathURL: CORE.WEB_URL + docPath,
          gencFileType: itemElementData.fileDetail.mimetype,
          PDFRespArrayData: null
        };

        const downloadDocPromises = [];
        if (itemElementData.fileDetail.mimetype.indexOf('/pdf') !== -1) {
          downloadDocPromises.push(downloadElementDocument(itemElementData));
        }
        vm.cgBusyLoading = $q.all(downloadDocPromises).then((response) => {
          if (response && response.length > 0 &&
            itemElementData.fileDetail.mimetype.indexOf('/pdf') !== -1) {
            previewEleDataObj.PDFRespArrayData = response[0].data;
          }
          entityDocumentList.push(previewEleDataObj);
          const data = {
            documentList: entityDocumentList
          };

          DialogFactory.dialogService(
            CORE.ENTITY_IMAGES_PREVIEW_MODAL_CONTROLLER,
            CORE.ENTITY_IMAGES_PREVIEW_MODAL_VIEW,
            ev,
            data).then(() => () => { // Empty
            }, () => {
              // Error Section
            });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //open configure restrict file types popup
      vm.restrictFileExtensionPopup = () => {
        DialogFactory.dialogService(
          USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_CONTROLLER,
          USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_VIEW,
          null,
          null).then(() => { // Empty
          }, (err) => BaseService.getErrorLog(err));
      };

      /* Get List Values on search for autocomplete for Manual data */
      const getSearchValueForManualData = (searchObj, obj) => {
        if (searchObj) {
          searchObj.isFromUI = true;
        }
        return DataElementFactory.getManualDataforCustomAutoCompleteForEntity().query(searchObj).$promise.then((response) => {
          if (response && response.data && response.data.dataElementKeyValues && response.data.dataElementKeyValues.length > 0) {
            response = response.data.dataElementKeyValues;
            if (obj) {
              $timeout(() => {
                $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
              }, 1000);
            }
            response = _.orderBy(response, ['displayOrder'], ['asc']);
          } else {
            response = [];
          }
          return response;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Get List Values on search for autocomplete for fixed entity */
      const getSearchValueForFixedEntity = (searchObj, obj) => {
        if (searchObj) {
          searchObj.isFromUI = true;
          // if from Workorder page
          if (vm.entity === CORE.Entity.Workorder) {
            searchObj.woID = vm.refTransId ? vm.refTransId : null;
          } else if (vm.entity === CORE.Entity.Operation) {
            searchObj.woID = vm.optionalParameter.woID ? vm.optionalParameter.woID : '0';
          }
        }
        return DataElementFactory.getFixedEntityDataforCustomAutoCompleteForEntity().query(searchObj).$promise.then((response) => {
          if (response && response.data && response.data[0].dataElementKeyValList && response.data[0].dataElementKeyValList.length > 0) {
            response = response.data[0].dataElementKeyValList;
            if (obj) {
              $timeout(() => {
                $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
              }, 1000);
            }
            response = _.orderBy(response, ['displayOrder'], ['asc']);
          } else {
            response = [];
          }
          return response;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Get List Values on search for autocomplete for custom entity */
      const getSearchValueForCustomEntity = (searchObj, obj) => {
        if (searchObj) {
          searchObj.isFromUI = true;
        }
        return DataElementFactory.getCustomEntityDataforCustomAutoCompleteForEntity().query(searchObj).$promise.then((response) => {
          if (response && response.data && response.data.dataElementTransactionValuesManual && response.data.dataElementTransactionValuesManual.length > 0) {
            response = response.data.dataElementTransactionValuesManual;
            if (obj) {
              $timeout(() => {
                $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
              }, 1000);
            }
            response = _.orderBy(response, ['displayOrder'], ['asc']);
          } else {
            response = [];
          }
          return response;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPageForms = [vm.dataElementValueForm];
      });
    }
  }
})();

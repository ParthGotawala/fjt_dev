(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderTransDataElement', workorderTransDataElement);

  /** @ngInject */
  function workorderTransDataElement(CORE, USER, OperationDataelementFactory, DialogFactory, EntityFactory,
    $timeout, WorkorderDataElementTransValueFactory, $filter, SettingsFactory,
    BaseService, WorkorderOperationFactory, CONFIGURATION, $q, DataElementFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        dataelementList: '=?',
        woTransId: '@',
        woOpId: '@',
        woId: '@',
        entityId: '=?',
        eqpId: '=?',
        fileList: '=?',
        calledFromPage: '=?'  // calledFromPage - not compulsory to pass
      },
      templateUrl: 'app/directives/custom/workorder-trans-data-element/workorder-trans-data-element.html',
      controller: workorderTransDataElementCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */

    function workorderTransDataElementCtrl($scope) {
      var vm = this;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSIGNFILEDS;
      vm.woOPID = $scope.woOpId;
      vm.woID = $scope.woId;
      vm.entity = $scope.entity;
      vm.woTransId = $scope.woTransId ? parseInt($scope.woTransId) : 0;
      vm.optionalParameter = $scope.optionalParameter ? $scope.optionalParameter : {};
      vm.DateFormatArray = CORE.DateFormatArray;
      let subFormCount = 1;
      vm.taToolbar = CORE.Toolbar;
      vm.InputeFieldKeys = CORE.InputeFieldKeys;
      vm.IsEdit = true;
      vm.deletedsubFormTransIDs = [];
      vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SIGNATURE_NOTE = CORE.MESSAGE_CONSTANT.SIGNATURE_NOTE;
      vm.dataElement_Default_Values = CORE.DataElement_Default_Values;
      vm.DisplayStatusConst = CORE.DisplayStatus;
      vm.isDisableEntityAccess = vm.woTransId === 0;

      const loginData = BaseService.loginUser;
      const roleData = loginData ? _.first(loginData.roles) : null;
      if (roleData && roleData.id && vm.entity === CORE.Entity.Operation) {
        getwoOpDataelementListRoleWise(roleData.id);
      }

      vm.radioButtonGroup = {
        defaultValue: {
          array: CONFIGURATION.DataElement_Manage_RadioGroup.defaultValue
        }
      };

      // -------------------------- [S] - Restricted Files Extension -------------------------------------------
      function retriveConfigureFileTypeList() {
        vm.FileTypeList = [];
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


      vm.radioButtonGroup = {
        defaultValue: {
          array: CONFIGURATION.DataElement_Manage_RadioGroup.defaultValue
        }
      };

      /* open popup and delete any row of sub-form -> not save -> close popup
          and open popup again then need to make data clear */
      WorkorderDataElementTransValueFactory.clearGlobalTransIDsArrayOnInit();

      /**
       * Get Entity Details
       */
      if (vm.entity) {
        EntityFactory.getEntityByName().query({ name: vm.entity }).$promise.then((res) => {
          if (res.data) {
            $scope.entityId = vm.entityId = res.data.entityID;
            vm.enityElementDetails(vm.entityId);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }


      /**
      * Get EntityElement's Transaction Values
      */
      const getWorkorderTransDataElementListValues = () => {
        WorkorderDataElementTransValueFactory.getWorkorderTransDataElementListValues().query({
          woTransID: vm.woTransId, woOPID: vm.woOPID, entityID: vm.entityId
        }).$promise.then((res) => {
          if (res.data) {
            return vm.elementTransactionList = res.data;
          }
        }).catch((error) => BaseService.getErrorLog(error)
        ).finally(() => {
          //vm.elementTransactionList = vm.elementTransactionList || [];
          //if (vm.elementTransactionList.length > 0) {
          //    assigneElementValue(vm.dataelementList);
          //}
          vm.getWorkorderTransSubformDataDetail();
        });
      };
      function getwoOpDataelementListRoleWise(roleID) {
        vm.cgBusyLoading = WorkorderOperationFactory.getwoOpDataelementListRoleWise().query({ roleID: roleID }).$promise.then((roleData) => {
          if (roleData && roleData.data) {
            vm.roleList = roleData.data;
          }
        }).catch((err) => BaseService.getErrorLog(err));
      }
      const setDataElements = (data) => {
        const dataList = [];
        if (data) {
          _.each(data, (item) => {
            if (item.isRequired) {
              item.minlength = 10;
            }
            else {
              item.minlength = 0;
            }
          });
          if (data.length === 0) {
            $scope.dataelementList = vm.dataelementList = data;
            return;
          }
          /* Start - Keep only entity type dataelement (check dataelement_use_at field in dataelement table) */
          if (vm.entity === CORE.Entity.Operation) {
            data = _.filter(data, (o) => ((o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[0])
              && (o.workorderOperationDataelement.length > 0 && _.find(o.workorderOperationDataelement, (e) => e.woOPID === Number(vm.woOPID))
              ))
            );
            //data filter for to get role wise dataelement.
            _.each(data, (o) => {
              if (o.dataelement_use_at !== CORE.SHOW_ELEMENT_OPTION[0]) {
                _.each(o.workorderOperationDataelement, (item) => {
                  if (item.workorder_Operation_DataElement_Id && item.workorder_Operation_DataElement_Id.length === 0) {
                    dataList.push(o);
                  } else {
                    const filterData = $filter('filter')(vm.roleList, { woOpDataElementID: item.woOpDataElementID });
                    if (filterData && filterData.length > 0) {
                      dataList.push(o);
                    }
                  }
                });
              }
            });
            if (dataList && dataList.length > 0) {
              data = dataList;
            }
            if (data.length === 0) {
              $scope.dataelementList = vm.dataelementList = data;
              return;
            }
            //subFormControlLists = _.filter(subFormControlLists, (o) => { return o.dataelement_use_at != CORE.SHOW_ELEMENT_OPTION[1] });
          }
          /* End - Keep only entity type dataelement (check dataelement_use_at field in dataelement table) */

          /* Start - To Set empty state when all element only of subform type and has no sub element  */
          const isAllSubFormTrue = _.every(data, ['controlTypeID', CORE.InputeFieldKeys.SubForm]);
          if (isAllSubFormTrue) {
            $scope.dataelementList = vm.dataelementList = [];
            return;
          }
          /* End - To Set empty state when all element only of subform type and has no sub element  */

          data = _.orderBy(data, ['displayOrder'], ['asc']);
          //Sub form list
          const subFormControlLists = _.remove(data, (o) => o.controlTypeID === CORE.InputeFieldKeys.SubForm);
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
          _.each(data, (dataelement) => {
            if (dataelement.controlTypeID === vm.InputeFieldKeys.DateTime) {
              if (dataelement.dateTimeType === null || dataelement.dateTimeType === '' || dataelement.dateTimeType === 0) {
                dataelement.dateTimeType = '0';

                if (dataelement.formatMask) {
                  //let DateFormateMast = dataelement.formatMask;
                  //let splitDate = DateFormateMast.split(" ");
                  //let UpperDate = splitDate[0].toUpperCase();
                  //dataelement.DateformatMask = UpperDate + ' ' + splitDate[1];
                  dataelement.DateformatMask = dataelement.formatMask;
                }
                else {
                  //let DateFormateMast = vm.DateFormatArray[1].format;
                  //let splitDate = DateFormateMast.split(" ");
                  //let UpperDate = splitDate[0].toUpperCase();
                  //dataelement.DateformatMask = UpperDate + ' ' + splitDate[1];
                  dataelement.DateformatMask = vm.DateFormatArray[1].format;
                  dataelement.formatMask = vm.DateFormatArray[1].format;
                }
              }
              else if (dataelement.dateTimeType === 1) {
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
                //dataelement.DateformatMask = dataelement.formatMask.toUpperCase();
              }
              else {
                if (dataelement.formatMask) {
                  dataelement.DateformatMask = dataelement.formatMask;
                }
                else {
                  dataelement.DateformatMask = vm.DateFormatArray[15].format;
                  dataelement.formatMask = vm.DateFormatArray[15].format;
                }
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
              // if (dataelement.fileType) {
              //   dataelement.fileType = JSON.parse(dataelement.fileType);
              //   _.each(vm.FileTypeList, (types) => {
              //     _.each(dataelement.fileType, (file) => {
              //       if (types.mimetype == file) {
              //         types.isDefault = true;
              //       }
              //     });
              //   });
              // }
              // else {
              //   dataelement.fileType = [];
              // }
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
              data.push(t);
            });
          }
          data = _.orderBy(data, ['displayOrder'], ['asc']);
          _.remove(data, (o) => o.parentDataElementID !== null);
          $scope.dataelementList = vm.dataelementList = data;
          if (vm.woTransId) {
            getWorkorderTransDataElementListValues();
          }
        }
      };
      /**
      * retrieve EntityElement Details
      *
      * @param
      */
      vm.enityElementDetails = (entityID) => {
        if ($scope.eqpId) {
          vm.cgBusyLoading = WorkorderDataElementTransValueFactory.retrieveWorkorderOperationEquipmentDataElementList().query({
            id: entityID, woOPID: vm.woOPID, eqpID: $scope.eqpId
          }).$promise.then((res) => {
            setDataElements(res.data);
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          OperationDataelementFactory.retrieveWorkorderOperationDataElementList().query({ woOPID: vm.woOPID, woID: vm.woID }).$promise.then((res) => {
            setDataElements(res.data);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };


      vm.getWorkorderTransSubformDataDetail = () => {
        const refWoTransSubFormDataIDs = _.filter(vm.elementTransactionList, (obj) => (obj.refWoTransSubFormDataID))
          .map((obj) => obj.refWoTransSubFormDataID);
        let subFormTransList = [];
        if (refWoTransSubFormDataIDs.length > 0) {
          WorkorderDataElementTransValueFactory.getWorkorderTransSubformDataDetail().query({ refWoTransSubFormDataIDs: refWoTransSubFormDataIDs }).$promise.then((res) => {
            subFormTransList = res.data;
          }).catch((error) => BaseService.getErrorLog(error))
            .finally(() => {
              if (subFormTransList.length > 0) {
                _.each(subFormTransList, (subFormData) => {
                  const objElement = _.find(vm.dataelementList, (itemElement) => itemElement.dataElementID === subFormData.parentDataElementID);
                  if (objElement) {
                    objElement.rowNumber = subFormData.rowNumber;
                    objElement.woTransSubFormDataID = subFormData.woTransSubFormDataID;

                    vm.AddNewSubFormRecord(objElement, true);
                  }
                });
              }
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
              if (obj.woTransSubFormDataID) {
                return (item.dataElementID === obj.dataElementID && item.refWoTransSubFormDataID === obj.woTransSubFormDataID);
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
                  if (dataelement.isManualData) {
                    obj.fromDate = (dateRange && dateRange.length > 0) ? BaseService.checkForDateNullValue(dateRange[0]) : null;
                    obj.toDate = (dateRange && dateRange.length > 1) ? BaseService.checkForDateNullValue(dateRange[1]) : null;
                  } else {
                    obj.fromDate = new Date();
                    obj.toDate = new Date();
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
                obj.defaultValue = _.filter(obj.fieldValue, (o) => (selectedOptions.indexOf(o.keyValueID) !== -1)).map((o) => o.value);
              }
              else if (obj.controlTypeID === vm.InputeFieldKeys.FileUpload) {
                //FileUpload
                if (dataelement.value) {
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
              obj.refWoTransSubFormDataID = dataelement.refWoTransSubFormDataID;
              obj.woTransDataElementID = dataelement.woTransDataElementID;
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
        } else if ($invalidFiles && $invalidFiles.length > 0) {
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
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Document'),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.REMOVE_SINGLE_CONFIRM_MESSAGE, 'Document'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            itemElement.value = '';
            itemElement.fileDetail = null;
            manuallyEnableSaveButton();
          }
        }, () => {
          // Block for Cancel Popup
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.downloadDocument = (itemElement) => {
        const file = itemElement.fileDetail;
        const downloadDocPromises = [downloadElementDocument(itemElement)];
        vm.cgBusyLoading = $q.all(downloadDocPromises).then((response) => {
          if (response && response.length > 0) {
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
      const downloadElementDocument = (itemElement) => WorkorderDataElementTransValueFactory.downloadDocument(itemElement.woTransDataElementID).then((response) => {
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


      vm.AddNewSubFormRecord = (itemElement, IsAuto) => {
        // IsAuto true - while render after getting data from subtransaction values
        if (!IsAuto) {
          if (!itemElement.rowNumber) {
            itemElement.rowNumber = 0;
          }
          itemElement.rowNumber = itemElement.rowNumber + 1;
          const objSubForm = itemElement;
          _.each(objSubForm.dataelementDefault, (dataItem) => {
            dataItem.refWoTransSubFormDataID = null;
            dataItem.woTransDataElementID = null;
            dataItem.woTransSubFormDataID = null;
            dataItem.rowNumber = itemElement.rowNumber;
          });
          itemElement.subFormControls.push(angular.copy(objSubForm.dataelementDefault));
        } else {
          _.each(itemElement.dataelementDefault, (dataItem) => {
            dataItem.rowNumber = itemElement.rowNumber;
            dataItem.woTransSubFormDataID = itemElement.woTransSubFormDataID;
          });
          if (!itemElement.isMultiple) {
            itemElement.rowNumber = 1;
            _.each(itemElement.subFormControls, (item) => {
              _.each(item, (subItem) => {
                subItem.rowNumber = 1;
                subItem.woTransSubFormDataID = itemElement.woTransSubFormDataID;
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
      };

      const deletedRowNumberIDs = [];
      vm.DeleteSubFormRecord = (itemElement, subElement) => {
        // Case for delete binded entry of subform with woTransSubFormDataID
        const subFormTransIDList = _.compact(_.uniq(_.map(subElement, 'woTransSubFormDataID')));
        if (subFormTransIDList.length > 0) {
          _.each(subFormTransIDList, (ItemElement) => {
            if (ItemElement) {
              vm.deletedsubFormTransIDs.push(ItemElement);
            }
          });
        } else {
          // Case for delete new entry of subform without woTransSubFormDataID
          const uniList = _.uniq(_.map(subElement, 'rowNumber'));
          _.each(uniList, (ItemElement) => {
            if (ItemElement) {
              deletedRowNumberIDs.push(ItemElement);
            }
          });
        }

        _.each(itemElement.subFormControls, (item) => {
          // for all subformtransids
          _.remove(item, (obj) => _.includes(vm.deletedsubFormTransIDs, obj.woTransSubFormDataID));
          // for all rownumbers
          _.remove(item, (obj) => _.includes(deletedRowNumberIDs, obj.rowNumber));
        });

        // delete array of array if no data in array
        _.remove(itemElement.subFormControls, (obj) => obj.length === 0);

        WorkorderDataElementTransValueFactory.assignDeletedsubFormTransID(vm.deletedsubFormTransIDs);
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
          DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.PROVIDE_SIGNATURE, multiple: true });
          return;
        }
        itemElementData.defaultValue = signature.dataUrl;
        itemElementData.isSignatureAdded = true;
      };

      vm.clearSignatureValue = (itemElementData) => {
        itemElementData.isSignatureAdded = false;
      };

      vm.deleteSignatureValue = (itemElementData, clearFunCallback, acceptFunCallback) => {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Signature'),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.REMOVE_SINGLE_CONFIRM_MESSAGE, 'signature'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            clearFunCallback();  //clear();
            signature = acceptFunCallback();  //accept();
            itemElementData.defaultValue = null;
            itemElementData.isSignatureAdded = false;
          }
        }, () => {
          // Block for Popup Close
        }).catch((error) => BaseService.getErrorLog(error));
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
            data).then(() => () => {
              // success
            }, () => {
              // Error Section
            });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.elementChange = (itemElementData) => {
        if (itemElementData.IsSubFormElement) {
          vm.dataElementValueForm[itemElementData.dataElementID + '_' + itemElementData.rowNumber].$setDirty();
        }
        else {
          vm.dataElementValueForm[itemElementData.dataElementID].$setDirty();
        }
      };

      const manuallyEnableSaveButton = () => {
        // Static code to enable save button
        vm.dataElementValueForm.$$controls[0].$setDirty();
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
              $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
            }
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
            searchObj.woID = vm.woID ? vm.woID : '0';
          }
        }
        return DataElementFactory.getFixedEntityDataforCustomAutoCompleteForEntity().query(searchObj).$promise.then((response) => {
          if (response && response.data && response.data[0].dataElementKeyValList && response.data[0].dataElementKeyValList.length > 0) {
            response = response.data[0].dataElementKeyValList;
            if (obj) {
              $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
            }
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
              $scope.$broadcast(obj.autoCompleteEntity.inputName, response[0]);
            }
          } else {
            response = [];
          }
          return response;
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
      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      //Set mindate value onchange in From Date
      vm.onChangeFromDate = (itemElementData, toDate, fromDate) => {
        if (fromDate) {
          //if (_.isDate(new Date(fromDate)) && new Date(fromDate) > new Date(toDate)) {
          //    itemElementData.toDate = null;
          //}
          //if (!toDate) {
          //    itemElementData.toDate = null;
          //}
          //itemElementData.toDateOptions = {
          //    minDate: new Date(fromDate),
          //    appendToBody: true,
          //    toDateOpenFlag: false
          //};

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
    }
  }
})();

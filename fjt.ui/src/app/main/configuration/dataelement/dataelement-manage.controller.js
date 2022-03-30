
(function () {
  'use strict';

  angular
    .module('app.configuration.dataelement')
    .controller('DataElementManageController', DataElementManageController);

  /** @ngInject */
  function DataElementManageController($stateParams, $timeout, $state, $filter, CONFIGURATION, CORE,
    BaseService, DataElementFactory, EntityFactory, NotificationFactory, uiSortableMultiSelectionMethods,
    $mdDialog, USER, DataElementTransactionValueFactory, DialogFactory, DataElementTransactionValuesManualFactory,
    $q, FixedEntityDataElementFactory, $scope, SettingsFactory) {
    const vm = this;
    //vm.IsEdit = true;
    vm.IsFromDataElement = true;
    vm.isSubmit = false;
    vm.IsRefreshValues = true;
    //vm.DataElementID = $stateParams.id;
    vm.DefaultdateFormat = _dateDisplayFormat;
    vm.DefaultDateTimeFormat = _dateDisplayFormat + ' ' + _timeDisplayFormat;
    vm.dataelementList = [];
    vm.subFormList = [];
    vm.dataelement = {};
    vm.dataelement.fieldValue = [];
    vm.dataelement.fileType = [];
    vm.dataelement.controlTypeID = 0;
    const entityID = $stateParams.entityID ? parseInt($stateParams.entityID) : null;
    vm.displayInputFieldList = angular.copy(CORE.InputeFields);
    const fields = angular.copy(CORE.InputeFields);
    vm.inputFieldList = _.remove(fields, (o) => o.ID !== 18);
    vm.DateFormatArray = angular.copy(CORE.DateFormatArray);
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.FileTypeList = [];// CORE.FileTypeList;
    vm.InputeFieldKeys = CORE.InputeFieldKeys;
    vm.SHOW_ELEMENT_OPTION = CORE.SHOW_ELEMENT_OPTION;
    vm.Entity = CORE.Entity;
    vm.isShowFieldAt = false;
    /* for down arrow key open datepicker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.fromDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.toDate] = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.SIGNATURE_NOTE = CORE.MESSAGE_CONSTANT.SIGNATURE_NOTE;
    let resetPrevModifiedElementDataCopy = {};
    vm.dataElement_Default_Values = CORE.DataElement_Default_Values;
    vm.CustomFormsStatus = CORE.CustomFormsStatus;
    vm.DisplayStatusConst = CORE.DisplayStatus;
    const dataElementIDToFocusFromExternalLink = $stateParams.dataElementID;
    let oldFieldName = '';
    let oldDisplayOrder = '';
    const loginUserDetails = BaseService.loginUser;
    vm.EmptyMesssageForForm = CONFIGURATION.CONFIGURATION_EMPTYSTATE.FORM;
    vm.isAuthorised = true;
    vm.dateTimeValueSelection = vm.dataElement_Default_Values.dateTimeValueSelection;
    vm.dataElementNotesConst = CONFIGURATION.DataElementNotes;

    vm.selectDateTimeOptions = {
      appendToBody: true,
      dateTimeCommonOpenFlag: false
    };

    vm.radioButtonGroup = {
      isRequired: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isRequired
      },
      isMultiple: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isMultiple
      },
      isDecimal: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isDecimal
      },
      isDatasource: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isDatasource
      },
      isFixedEntity: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isFixedEntity
      },
      isAutoIncrement: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isAutoIncrement
      },
      defaultValue: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.defaultValue
      },
      isUnique: {
        array: CONFIGURATION.DataElement_Manage_RadioGroup.isUnique
      }
    };

    // -------------------------- [S] - Restricted Files Extension -------------------------------------------
    function retriveConfigureFileTypeList() {
      vm.cgBusyLoading = SettingsFactory.retriveConfigureFileType().query().$promise.then((response) => {
        vm.FileTypeList = [];
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

    vm.openPicker = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.IsPickerOpen[type] = true;
      }
    };
    /* for down arrow key open datepicker */
    let subFormCount = 1;
    vm.taToolbar = CORE.Toolbar;
    let subFormlist;
    vm.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow-dataelement',
      placeholder: 'beingDragged',
      'ui-floating': false,
      //appendTo: 'body',
      //scroll: true,
      cursorAt: {
        top: 0, left: 0
      },
      start: function (e, ui) {
        ui.item.show().addClass('original-placeholder');
      },
      sort: function () {
      },
      update: function (e, ui) {
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          if (sourceTarget.id === dropTarget.id) {
            if (dropTarget.id !== 'DynamicFileds') {
              ui.item.sortable.cancel();
              return;
            }
          }
          else {
            if ( // ensure we are in the first update() callback
              !ui.item.sortable.received && // check that it's an actual moving between the two lists
              ui.item.sortable.source[0] !== ui.item.sortable.droptarget[0]) {
              ui.item.sortable.cancel(); // cancel drag and drop
              if (ui.item.sortable.model) {
                const object = {};
                object.controlTypeID = ui.item.sortable.model.ID;
                object.dataElementName = ui.item.sortable.model.Value;
                object.entityID = entityID;
                //object.displayOrder = count + 1;
                object.displayOrder = ui.item.sortable.dropindex;
                assginElementDefaultValues(ui.item.sortable.model, object, false);
                //vm.dataelementList.push(object);
                vm.dataelementList.splice(ui.item.sortable.dropindex, 0, object);
                vm.dataelement = object;

                /* default settting of radio buttons */
                vm.dataelement.isRequired = false;
                vm.dataelement.isUnique = false;

                //let dataElementInfo = vm.updateIndividualElements(object);

                // _.each(vm.FileTypeList, (types) => {
                //   types.isDefault = true;
                // });
                vm.SaveDataElementIndividual(object, false);
                // clear validation expression
                vm.expressionui = null;
                return;
              }
            }
          }
        }
      },
      stop: function (e, ui) {
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          let dropTargetModelList = [];
          if (sourceTarget.id === dropTarget.id) {
            if (dropTarget.id === 'DynamicFileds') {
              dropTargetModelList = ui.item.sortable.droptargetModel;
              _.each(dropTargetModelList, (o, $index) => {
                o.displayOrder = $index + 1;
              });
            }
            const displayOrder = _.map(dropTargetModelList, (obj) => ({ dataElementID: obj.dataElementID, displayOrder: obj.displayOrder }));
            vm.cgBusyLoading = DataElementFactory.updateDisplayOrder().update(null, displayOrder).$promise.then(() => {
              // Block of success result
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      },
      connectWith: '.items-container'
    });

    const initAutoCompleteForManualEntityDataSource = () => {
      vm.autoCompleteOfManualEntityDS = {
        columnName: 'entityName',
        keyColumnName: 'entityID',
        keyColumnId: vm.dataelement ? (vm.dataelement.datasourceID ? vm.dataelement.datasourceID : null) : null,
        inputName: 'EntityName',
        placeholderName: 'Data Source Name',
        isRequired: true,
        isAddnew: false,
        //callbackFn: getEntityDataList
        onSelectCallbackFn: getEntityDataList
      };
    };

    const initAutoCompleteForFixedEntityDataSource = () => {
      vm.autoCompleteOfFixedEntityDS = {
        columnName: 'displayEntityName',
        keyColumnName: 'id',
        keyColumnId: vm.dataelement ? (vm.dataelement.datasourceID ? vm.dataelement.datasourceID : null) : null,
        inputName: 'FixedEntityName',
        placeholderName: 'Data Source Name',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllFixedEntities,
        onSelectCallbackFn: setFixedEntityDetails
      };
    };
    //For Header Search List
    const initAutoCompleteEntityHeaderList = () => {
      vm.autoCompleteEntityHeaderList = {
        columnName: 'entityName',
        keyColumnName: 'entityID',
        keyColumnId: null,
        inputName: 'id',
        placeholderName: 'id',
        isRequired: false,
        isDisabled: false,
        isAddnew: false,
        onSelectCallbackFn: selectedEntity,
        onSearchFn: function (query) {
          const searchobj = {
            searchquery: query,
            systemGenerated: vm.systemGeneratedEntity
          };
          return getAllEntity(searchobj);
        }
      };
    };
    //Got to Selected entity manage page
    const selectedEntity = (item) => {
      if (item) {
        $state.go(CONFIGURATION.CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE, { entityID: item.entityID, dataElementID: null });
        $timeout(() => {
          vm.autoCompleteEntityHeaderList.keyColumnId = null;
        }, true);
      }
    };

    /* open popup for add entity */
    vm.addEntity = () => {
      //let reqData = { isHeaderAdd: true };
      DialogFactory.dialogService(
        CONFIGURATION.MANAGE_ENTITY_MODAL_CONTROLLER,
        CONFIGURATION.MANAGE_ENTITY_MODAL_VIEW,
        null,
        null).then((newEntity) => {
          $state.go(CONFIGURATION.CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE, { entityID: newEntity, dataElementID: null });
        }, (err) => BaseService.getErrorLog(err));
    };

    //Get List of entity for header
    const getAllEntity = (searchObj) => {
      let searchQuery = {};
      if (searchObj) {
        searchQuery = searchObj;
      }
      searchQuery['loginEmployeeID'] = loginUserDetails.employee.id;
      searchQuery['isUserSuperAdmin'] = loginUserDetails.isUserSuperAdmin;

      return EntityFactory.getAllEntity().query(searchQuery).$promise.then((entities) => {
        vm.EntityHeaderList = entities.data.entity;
        return $q.resolve(vm.EntityHeaderList);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    initAutoCompleteEntityHeaderList();

    /* retrieve entities*/
    vm.entitiesAll = () => {
      vm.cgBusyLoading = EntityFactory.getAllEntityWithUniqueDataElement().query().$promise.then((entity) => {
        vm.entities = entity.data.entity;
        const objEntity = _.find(vm.entities, (ent) => {
          if (entityID === ent.entityID) {
            return ent.entityName;
          }
        });

        vm.entityName = (objEntity ? objEntity.entityName : null);
        vm.systemGeneratedEntity = (objEntity ? objEntity.systemGenerated : null);
        vm.size = objEntity ? objEntity.columnView : 100;
        if (vm.entityName === vm.Entity.Equipment || vm.entityName === vm.Entity.Operation || vm.entityName === vm.Entity.Workorder) {
          vm.dataelement.dataelement_use_at = vm.SHOW_ELEMENT_OPTION[2];
        }
        vm.ManualEntities = _.filter(vm.entities, (ent) => ent.systemGenerated === false && entityID !== ent.entityID && ent.dataElement.length > 0);
        if (vm.ManualEntities.length > 0) {
          initAutoCompleteForManualEntityDataSource();
        }
        vm.entityDetails = objEntity;
        if (vm.entityDetails && vm.entityDetails.entityStatus === 1) {
          vm.isPublishDisabled = true;
          vm.entityStatusLabel = CORE.OPSTATUSLABLEDRAFT;
        }
        else if (vm.entityDetails && vm.entityDetails.entityStatus === 0) {
          vm.entityStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
        }
        else {
          vm.entityStatusLabel = '';
        }

        vm.EmptyMesssageForForm.UNAUTHORISED = stringFormat(vm.EmptyMesssageForForm.UNAUTHORISED, vm.entityDetails ? vm.entityDetails.entityName : '');
        //Check User Authorized or not for custom form only
        if (!vm.systemGeneratedEntity) {
          if (loginUserDetails.isUserSuperAdmin) {
            vm.isAuthorised = true;
          } else {
            if (vm.entityDetails && Number(vm.entityDetails.createdBy) === loginUserDetails.userid) {
              vm.isAuthorised = true;
            }
            else {
              vm.isAuthorised = false;
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.changSubFormType = (item) => {
      if (item) {
        vm.dataelement.recurring_limit = vm.dataelement.recurring_limit ? vm.dataelement.recurring_limit : 0;
      } else {
        vm.dataelement.recurring_limit = vm.dataelement.recurring_limit ? vm.dataelement.recurring_limit : null;
      }
    };

    // assignDefault Value in Dropdown of DateFormat Array
    const assignDefaultValue = (itemDataElement) => {
      if (itemDataElement.dateTimeType === null || itemDataElement.dateTimeType === '' || itemDataElement.dateTimeType === '0') {
        itemDataElement.dateTimeType = '0';
        if (itemDataElement.formatMask) {
          //itemDataElement.DateformatMask = applyDateTimeFormat(itemDataElement.formatMask);
          itemDataElement.DateformatMask = itemDataElement.formatMask;
          //itemDataElement.formatMask = itemDataElement.formatMask;
        }
        else {
          //itemDataElement.DateformatMask = applyDateTimeFormat(vm.DateFormatArray[1].format);
          itemDataElement.DateformatMask = vm.DateFormatArray[1].format;
          itemDataElement.formatMask = vm.DateFormatArray[1].format;
        }
        itemDataElement.dateTimeOpenFlag = false;
      } else if (itemDataElement.dateTimeType === '1') {
        if (itemDataElement.formatMask) {
          //itemDataElement.DateformatMask = itemDataElement.formatMask.toUpperCase();
          itemDataElement.DateformatMask = itemDataElement.formatMask;
          //itemDataElement.formatMask = itemDataElement.formatMask;
        } else {
          //itemDataElement.DateformatMask = applyDateTimeFormat(vm.DateFormatArray[0].format);
          itemDataElement.DateformatMask = vm.DateFormatArray[0].format;
          itemDataElement.formatMask = vm.DateFormatArray[0].format;
        }
        itemDataElement.dateOpenFlag = false;
      }
      else {
        if (itemDataElement.formatMask) {
          //itemDataElement.DateformatMask = applyDateTimeFormat(itemDataElement.formatMask);
          itemDataElement.DateformatMask = itemDataElement.formatMask;
          //itemDataElement.formatMask = itemDataElement.formatMask;
        } else {
          //itemDataElement.DateformatMask = applyDateTimeFormat(vm.DateFormatArray[15].format);
          itemDataElement.DateformatMask = vm.DateFormatArray[15].format;
          itemDataElement.formatMask = vm.DateFormatArray[15].format;
        }
        itemDataElement.timeOpenFlag = false;
      }
      const findFormat = _.find(vm.DateFormatArray, { 'format': itemDataElement.formatMask });
      if (findFormat) {
        itemDataElement.uimaskformatForDateTime = findFormat.uimaskformat;
        itemDataElement.placeholderForDateTime = findFormat.placeholder;
      }
    };

    /**
   * retrieve EntityElement Details
   *
   * @param
   */
    vm.enityElementDetails = (entityID) => {
      vm.cgBusyLoading = DataElementFactory.retrieveEntityDataElements().query({ id: entityID }).$promise.then((res) => {
        if (res.data) {
          res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
          //Sub form list
          subFormlist = _.remove(res.data, (o) => o.controlTypeID === 18);
          _.each(subFormlist, (item) => {
            item.subFormList = [];
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
              assignDefaultValue(dataelement);
              if (dataelement.defaultValue) {
                dataelement.defaultValue = new Date(dataelement.defaultValue);
              }
            }
            else if (dataelement.controlTypeID === vm.InputeFieldKeys.DateRange) {
              if (dataelement.dateTimeType === null || dataelement.dateTimeType === '') {
                dataelement.dateTimeType = '1';
              }
              if (dataelement.formatMask === null) {
                dataelement.formatMask = vm.DateFormatArray[0].format;
              }
              dataelement.fromDate = dataelement.fromDate ? BaseService.checkForDateNullValue(dataelement.fromDate) : null;
              dataelement.toDate = dataelement.toDate ? BaseService.checkForDateNullValue(dataelement.toDate) : null;
              const findFormat = _.find(vm.DateFormatArray, { 'format': dataelement.formatMask });
              if (findFormat) {
                dataelement.uimaskformatForDateTime = findFormat.uimaskformat;
                dataelement.placeholderForDateTime = findFormat.placeholder;
              }
              dataelement.DateformatMask = dataelement.formatMask;
            }
            else if (dataelement.controlTypeID === vm.InputeFieldKeys.FileUpload) {
              // if (dataelement.fileType) {
              //   // dataelement.fileType = JSON.parse(dataelement.fileType);
              //   // _.each(vm.FileTypeList, (types) => {
              //   //   _.each(dataelement.fileType, (file) => {
              //   //     //if (types.mimetype == file) {
              //   //     if (types.extension == file) {
              //   //       types.isDefault = true;
              //   //     }
              //   //   });
              //   // });
              //   dataelement.isCheckedAllDocType = checkAllDocTypeItemSelected();
              // }
              // else {
              //   dataelement.fileType = [];
              // }
            }
            else if (dataelement.isDatasource && dataelement.datasourceID && dataelement.datasourceDisplayColumnID &&
              (dataelement.controlTypeID === vm.InputeFieldKeys.MultipleChoice
                || dataelement.controlTypeID === vm.InputeFieldKeys.Option || dataelement.controlTypeID === vm.InputeFieldKeys.Combobox
                || dataelement.controlTypeID === vm.InputeFieldKeys.MultipleChoiceDropdown
                || dataelement.controlTypeID === vm.InputeFieldKeys.CustomAutoCompleteSearch)) {
              if (dataelement.datasourceDisplayColumnDataElement) {
                dataelement.dataElementKeyValues = [];
                const _objDataFieldSelection = {};
                _objDataFieldSelection.name = dataelement.datasourceDisplayColumnDataElement.dataElementName;
                _objDataFieldSelection.value = dataelement.datasourceDisplayColumnDataElement.dataElementName;
                dataelement.dataElementKeyValues.push(_objDataFieldSelection);
              }
            }
            if (dataelement.parentDataElementID) {
              const obj = _.find(subFormlist, (o) => o.dataElementID === dataelement.parentDataElementID);
              if (obj) {
                dataelement.subFormCount = obj.subFormCount;
                dataelement.IsSubFormElement = true;
                obj.subFormList.push(dataelement);
              }
            }
            if (dataelement) {
              dataelement.defaultValue = dataelement.defaultValue ?
                ((dataelement.controlTypeID === vm.InputeFieldKeys.Numberbox || dataelement.controlTypeID === vm.InputeFieldKeys.Currency)
                  ? (dataelement.decimal_number > 0 ? parseFloat(dataelement.defaultValue) : parseInt(dataelement.defaultValue))
                  : (dataelement.controlTypeID === vm.InputeFieldKeys.SingleChoice ? dataelement.defaultValue === 'true' : dataelement.defaultValue)) : null;

              dataelement.isDecimal = dataelement.decimal_number > 0 ? true : false;

              /* Static Code - for not to display defaultValue of auto increment integer data element*/
              if (dataelement.isAutoIncrement) {
                dataelement.defaultValue = null;
              }
              dataelement.fieldValue = dataelement.dataElementKeyValues;
            }
          });
          if (subFormlist.length > 0) {
            _.each(subFormlist, (t) => {
              res.data.push(t);
            });
          }
          res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
          _.remove(res.data, (o) => o.parentDataElementID !== null);
          vm.dataelementList = res.data;
          $timeout(() => {
            // to select/focus to particular element
            if (dataElementIDToFocusFromExternalLink) {
              let dataElementDetToFocusFromExternalLink = _.find(vm.dataelementList, (dataElementItem) => dataElementItem.dataElementID === Number(dataElementIDToFocusFromExternalLink));
              $timeout(() => {
                if (dataElementDetToFocusFromExternalLink) {
                  vm.IsEdit = true;
                  vm.getDataElementDetails(dataElementDetToFocusFromExternalLink, null);
                }
                if ($('[name^=' + dataElementIDToFocusFromExternalLink + '_' + ']').offset() && $('[name^=' + dataElementIDToFocusFromExternalLink + '_' + ']').offset().top) {
                  $('#DynamicFileds').animate({
                    //scrollTop: $("[name^=" + dataElementIDToFocusFromExternalLink + "_" + "]").offset().top
                    scrollTop: $('[name^=' + dataElementIDToFocusFromExternalLink + '_' + ']').offset().top - $('#DynamicFileds').offset().top + $('#DynamicFileds').scrollTop()
                  });
                }
                dataElementDetToFocusFromExternalLink = null;
              }, 1000);
            }

            if (entityID && vm.dataElementForm) {
              BaseService.checkFormValid(vm.dataElementForm, false);
            }
          }, 0);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //add element between two element in sub form
    vm.addDataElement = (itemobj, $event) => {
      if (vm.dataElementForm.$dirty && vm.IsEdit && vm.dataelement
        && Boolean(vm.dataelement.dataElementID) && vm.dataelement.dataElementID !== itemobj.dataElementID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_SAVING_ELEMENT_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            resetDataElementOriginalData();
            vm.getDataElementDetails(resetPrevModifiedElementDataCopy, event);
            addBlankDataElementInSubForm(itemobj, $event);
          }
        }, () => {
          //vm.enityElementDetails(entityID);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        addBlankDataElementInSubForm(itemobj, $event);
      }
    };

    const addBlankDataElementInSubForm = (itemobj, $event) => {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      const parentElement = _.find(vm.dataelementList, { dataElementID: itemobj.parentDataElementID });
      if (parentElement) {
        const newElement = {
          addSubFormItem: true,
          displayOrder: itemobj.displayOrder,
          parentDataElementID: parentElement.dataElementID
        };
        parentElement.subFormList.splice(itemobj.displayOrder, 0, newElement);
      }
    };

    // Add Options
    vm.addOption = (obj) => {
      if (!vm.dataelement.fieldValue) {
        vm.dataelement.fieldValue = [];
      }
      const objData = _.find(vm.dataelement.fieldValue, (field) => field.value === obj.value);
      if (objData) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.UNIQUE_DISPLAY_VALUE);
        DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
        return;
      }
      else {
        vm.dataelement.fieldValue.push(obj);
        vm.currentmodel = {};
        vm.IsRefreshValues = true;
        vm.SaveDataElementKeyValue(obj, false);
      }
    };

    // Delete Options
    vm.deleteOption = (obj) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Data', 1);
      const deleteConfirmObj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(deleteConfirmObj).then((yes) => {
        if (yes) {
          if (!obj.keyValueID) {
            const fieldIndex = _.findIndex(vm.dataelement.fieldValue, (field) => field.value === obj.value);
            if (fieldIndex >= 0) {
              vm.dataelement.fieldValue.splice(fieldIndex, 1);
              if (vm.dataelement.defaultValue === obj.value) {
                vm.IsRefreshValues = false;
                vm.dataelement.defaultValue = '';
                vm.IsRefreshValues = true;
              }
              return;
            }
          } else {
            const deleteObj = {};
            deleteObj.dataElementID = vm.dataelement.dataElementID;
            deleteObj.dataElementName = vm.dataelement.dataElementName;
            deleteObj.entityID = entityID;
            deleteObj.isSystemGeneratedEntity = vm.systemGeneratedEntity;
            deleteObj.id = obj.keyValueID;
            deleteObj.name = obj.name;
            vm.cgBusyLoading = DataElementFactory.deleteDataElement_KeyValues().query(deleteObj).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                const fieldIndex = _.findIndex(vm.dataelement.fieldValue, (field) => field.keyValueID === obj.keyValueID);
                if (fieldIndex >= 0) {
                  vm.dataelement.fieldValue.splice(fieldIndex, 1);
                  if (vm.dataelement.defaultValue === obj.value) {
                    vm.IsRefreshValues = false;
                    vm.dataelement.defaultValue = '';
                    vm.IsRefreshValues = true;
                  }
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }, () => {
        // Block for Cancel Popup
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // Get Entity Details
    if (entityID) {
      vm.enityElementDetails(entityID);
    }

    // Get all System Generated Entities
    vm.entitiesAll();

    // Calculation of stpes
    vm.calculateStep = () => {
      if (vm.dataelement.decimal_number) {
        vm.dataelement.step = 1 / Math.pow(10, vm.dataelement.decimal_number);
      }
    };

    // Assign Default values to each object
    const assginElementDefaultValues = (subInputField, object, IsSubForm) => {
      if (subInputField.ID === vm.InputeFieldKeys.Textbox) {
        //Textbox
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Numberbox) {
        //Numberbox
        object.isDecimal = false; // default setting
        object.isAutoIncrement = false;
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Multilinetextbox) {
        //Multilinetextbox
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Editor) {
        //Editor
      }
      else if (subInputField.ID === vm.InputeFieldKeys.DateTime) {
        //Date
        object.defaultValue = null;
        object.dateTimeType = '0';
        object.defaultDateTime = vm.dateTimeValueSelection.nullValue.id;
        assignDefaultValue(object);
      }
      else if (subInputField.ID === vm.InputeFieldKeys.DateRange) {
        //DateRange
        object.fromDate = null;
        object.toDate = null;
        object.dateTimeType = '1';
        object.defaultDateTime = vm.dateTimeValueSelection.nullValue.id;
        assignDefaultValue(object);
      }
      else if (subInputField.ID === vm.InputeFieldKeys.SingleChoice) {
        //SingleChoice
        object.defaultValue = false; // default setting
      }
      else if (subInputField.ID === vm.InputeFieldKeys.MultipleChoice) {
        //Multi-Choice
        object.fieldValue = [{
          name: 'Option1',
          value: 'Option1',
          displayOrder: 1
        }];

        object.isDatasource = false; // default setting
        object.isFixedEntity = false; // default setting
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Option) {
        //Option
        object.fieldValue = [{
          name: 'Option1',
          value: 'Option1',
          displayOrder: 1
        }];

        object.isDatasource = false; // default setting
        object.isFixedEntity = false; // default setting
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Combobox) {
        //Combobox
        object.fieldValue = [{
          name: 'Option1',
          value: 'Option1',
          displayOrder: 1
        }];

        object.isDatasource = false; // default setting
        object.isFixedEntity = false; // default setting
      }
      else if (subInputField.ID === vm.InputeFieldKeys.MultipleChoiceDropdown) {
        //MultipleChoiceDropdown
        object.fieldValue = [{
          name: 'Option1',
          value: 'Option1',
          displayOrder: 1
        }];

        object.isDatasource = false; // default setting
        object.isFixedEntity = false; // default setting
      }
      else if (subInputField.ID === vm.InputeFieldKeys.FileUpload) {
        //FileUpload
        object.isCheckedAllDocType = true;
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Email) {
        //Email
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Currency) {
        //Currency
      }
      else if (subInputField.ID === vm.InputeFieldKeys.URL) {
        //URL
      }
      else if (subInputField.ID === vm.InputeFieldKeys.Lookup) {
        //Lookup
      }
      else if (subInputField.ID === vm.InputeFieldKeys.SubForm && !IsSubForm) {
        //Sub Form
        object.subFormList = [];
        object.subFormCount = subFormCount++;
        object.addSubFormItem = true;
        object.isMultiple = false; // default setting
      }
      else if (subInputField.ID === vm.InputeFieldKeys.CustomAutoCompleteSearch) {
        //CustomAutoCompleteSearch
        object.fieldValue = [{
          name: 'Option1',
          value: 'Option1',
          displayOrder: 1
        }];
        object.isDatasource = true; // default setting
        object.isFixedEntity = false; // default setting
        object.autoCompleteEntity = {
          columnName: 'customAutoCompleteSearchColumnNameName',
          keyColumnName: 'customAutoCompleteSearchKeyColumnName',
          keyColumnId: null,
          inputName: 'customAutoCompleteSearchID',
          placeholderName: 'Custom AutoComplete Search',
          isRequired: false,
          isDisabled: false,
          isAddnew: false
        };
        if (vm.autoCompleteOfManualEntityDS) {
          vm.autoCompleteOfManualEntityDS.keyColumnId = (vm.ManualEntities && vm.ManualEntities.length > 0) ? vm.ManualEntities[0].entityID : null;
        }
      }
    };

    vm.changeInputFields = (itemElement, subInputField, $event) => {
      if (vm.dataElementForm.$dirty && vm.IsEdit && vm.dataelement
        && Boolean(vm.dataelement.dataElementID) && vm.dataelement.dataElementID !== itemElement.dataElementID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_SAVING_ELEMENT_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            resetDataElementOriginalData();
            changeAddInputFields(itemElement, subInputField, $event);
          }
        }, () => {
          vm.enityElementDetails(entityID);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        changeAddInputFields(itemElement, subInputField, $event);
      }
    };

    const changeAddInputFields = (itemElement, subInputField, $event) => {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      const object = {};
      const count = itemElement.subFormList.length;
      object.controlTypeID = subInputField.ID;
      object.entityID = entityID;
      object.dataElementName = subInputField.Value;
      object.displayOrder = count + 1;
      object.parentDataElementID = itemElement.dataElementID;
      object.parentDataElementName = itemElement.dataElementName;
      object.dataelement_use_at = itemElement.dataelement_use_at;
      object.subFormCount = itemElement.subFormCount;
      object.IsSubFormElement = true;
      assginElementDefaultValues(subInputField, object, true);
      itemElement.subFormList = _.filter(itemElement.subFormList, (o) => o.addSubFormItem !== true);
      itemElement.subFormList.push(object);
      itemElement.addSubFormItem = false;
      vm.isShowFieldAt = false;

      vm.dataelement = object;
      /* default settting of radio buttons */
      vm.dataelement.isRequired = false;
      vm.dataelement.isUnique = false;

      //let dataElementInfo = vm.updateIndividualElements(object);
      // _.each(vm.FileTypeList, (types) => {
      //   types.isDefault = true;
      // });
      itemElement.subFormList = _.sortBy(itemElement.subFormList, [(o) => o.displayOrder]);
      vm.SaveDataElementIndividual(object, true);
    };

    //save middle element's detail in subform
    vm.addSubFormFields = (itemElement, subInputField) => {
      const parentElement = _.find(vm.dataelementList, { dataElementID: itemElement.parentDataElementID });
      if (parentElement) {
        itemElement.controlTypeID = subInputField.ID;
        itemElement.entityID = entityID;
        itemElement.dataElementName = subInputField.Value;
        itemElement.parentDataElementID = parentElement.dataElementID;
        itemElement.parentDataElementName = parentElement.dataElementName;
        itemElement.subFormCount = parentElement.subFormCount;
        itemElement.IsSubFormElement = true;
        itemElement.addSubFormItem = false;
        parentElement.subFormList = _.filter(parentElement.subFormList, (o) => o.addSubFormItem !== true);
        parentElement.subFormList = _.sortBy(parentElement.subFormList, (o) => o.displayOrder);
        delete itemElement.subInputField;
        assginElementDefaultValues(subInputField, itemElement, true);
        vm.dataelement = itemElement;
        /* default settting of radio buttons */
        vm.dataelement.isRequired = false;
        vm.dataelement.isUnique = false;

        if (vm.dataelement.controlTypeID === vm.InputeFieldKeys.FileUpload) {
          // _.each(vm.FileTypeList, (types) => {
          //   types.isDefault = true;
          // });
          vm.dataelement.isCheckedAllDocType = true;
        }
        vm.SaveDataElementIndividual(itemElement, true);
      }
    };

    vm.goBack = () => {
      if (vm.dataElementForm && vm.dataElementForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      }
      else {
        if (vm.systemGeneratedEntity) {
          $state.go(CONFIGURATION.CONFIGURATION_ENTITY_STATE, { systemGenerated: '1' });
        }
        else {
          $state.go(CONFIGURATION.CONFIGURATION_MANUAL_ENTITY_STATE, { systemGenerated: '0' });
        }
      }
    };

    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.systemGeneratedEntity) {
            vm.dataElementForm.$setPristine();
            $state.go(CONFIGURATION.CONFIGURATION_ENTITY_STATE, { systemGenerated: '1' });
          }
          else {
            $state.go(CONFIGURATION.CONFIGURATION_MANUAL_ENTITY_STATE, { systemGenerated: '0' });
          }
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    function showWithoutSavingAlertforDataElement(itemElement, event) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_SAVING_ELEMENT_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.dataelement.parentDataElementID) {  /* sub-form */
            const subFormParentItem = _.find(vm.dataelementList, (item) => item.dataElementID === vm.dataelement.parentDataElementID);
            _.remove(subFormParentItem.subFormList, (item) => item.dataElementID === vm.dataelement.dataElementID);
            if (vm.dataelement.dataElementID === resetPrevModifiedElementDataCopy.dataElementID) {
              subFormParentItem.subFormList.push(resetPrevModifiedElementDataCopy);
            }
          }
          else {
            _.remove(vm.dataelementList, (item) => item.dataElementID === vm.dataelement.dataElementID);
            if (vm.dataelement.dataElementID === resetPrevModifiedElementDataCopy.dataElementID) {
              vm.dataelementList.push(resetPrevModifiedElementDataCopy);
            }
          }

          vm.dataElementForm.$setPristine();
          //vm.dataElementForm.$dirty = false;
          vm.getDataElementDetails(itemElement, event);
        }
      }, (error) => BaseService.getErrorLog(error));
    }

    vm.removeDataElement = (item, $event) => {
      if (vm.dataElementForm.$dirty && vm.IsEdit && vm.dataelement
        && Boolean(vm.dataelement.dataElementID) && vm.dataelement.dataElementID !== item.dataElementID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_SAVING_ELEMENT_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            resetDataElementOriginalData();
            removeSelectedDataElement(item, $event);
          }
        }, () => {
          //vm.enityElementDetails(entityID);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        removeSelectedDataElement(item, $event);
      }
    };

    const removeSelectedDataElement = (item, $event) => {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      if (!item.dataElementID && item.addSubFormItem === true) {
        const parentElement = _.find(vm.dataelementList, (element) => element.dataElementID === item.parentDataElementID);
        if (parentElement) {
          const fieldIndex = _.indexOf(parentElement.subFormList, item);
          if (fieldIndex >= 0) {
            parentElement.subFormList.splice(fieldIndex, 1);
            vm.dataelement = {};
            vm.dataelement.controlTypeID = 0;
          }
        }
      }
      else {
        if (!item.dataElementID || !item.dataElementName) {
          if (vm.dataElementForm && vm.dataElementForm.$dirty && BaseService.focusRequiredField(vm.dataElementForm)) {
            return;
          }
          return;
        }
        const objIDs = {
          id: item.dataElementID,
          dataelement: item.dataElementName,
          entityID: item.entityID
        };
        vm.cgBusyLoading = DataElementFactory.deleteDataElement().query({ objIDs: objIDs }).$promise.then((res) => {
          if (res) {
            if (res.data && res.data.TotalCount && res.data.TotalCount > 0) {
              BaseService.deleteAlertMessage(res.data);
            }
            else {
              let fieldIndex = _.findIndex(vm.dataelementList, (element) => element.dataElementID === item.dataElementID);
              if (fieldIndex >= 0) {
                vm.dataelementList.splice(fieldIndex, 1);
                vm.dataelement = {};
                vm.dataelement.controlTypeID = 0;
              }
              else {
                const parentElement = _.find(vm.dataelementList, (element) => element.dataElementID === item.parentDataElementID);
                if (parentElement) {
                  fieldIndex = _.findIndex(parentElement.subFormList, (element) => element.dataElementID === item.dataElementID);
                  if (fieldIndex >= 0) {
                    parentElement.subFormList.splice(fieldIndex, 1);
                    vm.dataelement = {};
                    vm.dataelement.controlTypeID = 0;
                  }
                }
              }
            }
          }
          vm.dataElementForm.$setPristine();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getDataElementDetails = (itemElement, $event) => {
      if (vm.dataElementForm.$dirty && vm.IsEdit && vm.dataelement
        && Boolean(vm.dataelement.dataElementID) && vm.dataelement.dataElementID !== itemElement.dataElementID) {
        showWithoutSavingAlertforDataElement(itemElement, $event);
      } else {
        vm.isShowFieldAt = true;
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        vm.dataelement = {};

        if (itemElement.validationExpr) {
          if (typeof itemElement.validationExpr === 'string') {
            itemElement.validationExpr = JSON.parse(itemElement.validationExpr);
          }
          DisplayExpression(itemElement.validationExpr);
        }
        else {
          vm.expressionui = null;
        }

        vm.dataelement = itemElement;
        vm.dataelement.rearrange = false;
        if (itemElement.controlTypeID === vm.InputeFieldKeys.FileUpload) {
          vm.dataelement.isCheckedAllDocType = checkAllDocTypeItemSelected();
        }
        if (itemElement.controlTypeID === vm.InputeFieldKeys.DateTime) {
          assignDefaultValue(vm.dataelement);
          // to set radio button value of Datetime
          if (vm.dataelement.isManualData === 0) {
            vm.dataelement.defaultDateTime = vm.dateTimeValueSelection.currentValue.id;
          } else if (vm.dataelement.defaultValue) {
            vm.dataelement.defaultDateTime = vm.dateTimeValueSelection.customValue.id;
          } else {
            vm.dataelement.defaultDateTime = vm.dateTimeValueSelection.nullValue.id;
          }
        }
        if (itemElement.controlTypeID === vm.InputeFieldKeys.DateRange) {
          // to set radio button value of Daterange
          if (vm.dataelement.isManualData === 0) {
            vm.dataelement.defaultDateTime = vm.dateTimeValueSelection.currentValue.id;
          } else if (vm.dataelement.fromDate || vm.dataelement.toDate) {
            vm.dataelement.defaultDateTime = vm.dateTimeValueSelection.customValue.id;
          } else {
            vm.dataelement.defaultDateTime = vm.dateTimeValueSelection.nullValue.id;
          }
        }
        if (!itemElement.dataelement_use_at) {
          vm.dataelement.dataelement_use_at = vm.SHOW_ELEMENT_OPTION[2];
        }
        if (itemElement && itemElement.IsSubFormElement) {
          vm.isShowFieldAt = false;
        }
        if (itemElement && itemElement.addSubFormItem) {
          vm.isShowFieldAt = false;
        }
        if (itemElement && itemElement.controlTypeID === vm.InputeFieldKeys.SubForm) {
          vm.isShowFieldAt = true;
          /* init here because on save button click , sub element of sub form also saved */
          initAutoCompleteForFixedEntityDataSource();
          initAutoCompleteForManualEntityDataSource();
        }
        if (itemElement.isDatasource) {
          if (itemElement.isFixedEntity) {
            if (vm.FixedEntities && vm.FixedEntities.length > 0) {
              initAutoCompleteForFixedEntityDataSource();
            }
            else {
              const autocompleteDataPromise = [getAllFixedEntities()];
              vm.cgBusyLoading = $q.all(autocompleteDataPromise).then(() => {
                initAutoCompleteForFixedEntityDataSource();
              });
            }
          }
          else {
            initAutoCompleteForManualEntityDataSource();
          }
        }
        else {
          if (vm.autoCompleteOfManualEntityDS) {
            vm.autoCompleteOfManualEntityDS.keyColumnId = null;
          }
          if (vm.autoCompleteOfFixedEntityDS) {
            vm.autoCompleteOfFixedEntityDS.keyColumnId = null;
          }
        }

        /* Bug #2752 set code to resolve sub-form date time clear issue after save sub-form and focus on date time */
        if (itemElement && itemElement.parentDataElementID && itemElement.controlTypeID === vm.InputeFieldKeys.DateTime) {
          if (itemElement.defaultValue && itemElement.defaultValue instanceof Date) {
            itemElement.defaultValue = $filter('date')(new Date(itemElement.defaultValue), vm.dataelement.formatMask ? vm.dataelement.formatMask : 'yyyy-MM-dd HH:mm:ss');
          }
          //else {
          //    itemElement.defaultValue = $filter('date')(new Date(), vm.dataelement.formatMask ? vm.dataelement.formatMask : 'yyyy-MM-dd HH:mm:ss');
          //}
        }
        resetPrevModifiedElementDataCopy = {};
        resetPrevModifiedElementDataCopy = angular.copy(vm.dataelement);
      }
    };

    //vm.setHeight = () => {
    //    $timeout(() => {
    //        let ControlBox = document.getElementById("ControlBox");
    //        if (ControlBox) {
    //            ControlBox.setAttribute("style", "height:" + (window.innerHeight - ControlBox.offsetTop - 16) + "px");
    //        }

    //        let DynamicFileds = document.getElementById("DynamicFileds");
    //        if (DynamicFileds) {
    //            DynamicFileds.setAttribute("style", "height:" + (window.innerHeight - DynamicFileds.offsetTop - 16) + "px");
    //        }

    //        let FieldSettings = document.getElementById("FieldSettings");
    //        if (FieldSettings) {
    //            FieldSettings.setAttribute("style", "height:" + (window.innerHeight - FieldSettings.offsetTop - 16) + "px");
    //        }

    //        //vm.maxHeight = { "max-height": (window.innerHeight - ControlBox.offsetTop - 80) + 'px' };
    //    }, 0);
    //}
    //vm.setHeight();

    vm.resclass = () => {
      $timeout(() => {
        if (BaseService.isMobile) {
          const reslayout = document.getElementById('reslayout-wrap');
          reslayout.className += ' layout-wrap';
        }
      }, 0);
    };
    vm.resclass();

    // Save Data Element Details Individually on save click
    vm.SaveDataElementIndividual = (dataElement, isSubForm) => {
      let isMultiple;
      if (vm.dataelement.controlTypeID === vm.InputeFieldKeys.SubForm) {
        if (subFormlist && subFormlist.length > 0) {
          isMultiple = _.filter(subFormlist, (obj) => (obj.dataElementName === 'Subform')).map((obj) => obj.isMultiple);
          isMultiple = _.first(isMultiple);

          if (isMultiple === false && vm.dataelement.isMultiple === false) {
            vm.cgBusyLoading = DataElementTransactionValueFactory.getDataElementTransactionValues().query({ entityID: entityID }).$promise.then((data) => {
              vm.data = data.data;
              const isUsedinOtherPages = _.find(vm.data, (item) =>
                item.refSubFormTransID !== null && item.refSubFormTransID !== undefined
                && item.refSubFormTransID !== '' && item.value !== '' && item.value !== null && item.value !== undefined
              );
              if (isUsedinOtherPages) {
                vm.dataelement.isMultiple = true;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SUBFORM_NOT_EDIT_MESSAGE);
                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
              }
              else {
                saveDataElement(dataElement, isSubForm);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            saveDataElement(dataElement, isSubForm);
          }
        }
        else {
          saveDataElement(dataElement, isSubForm);
        }
      }
      else {
        saveDataElement(dataElement, isSubForm);
      }
    };

    function saveDataElement(dataElement, isSubForm) {
      if ((vm.dataelement.controlTypeID === vm.InputeFieldKeys.DateTime || vm.dataelement.controlTypeID === vm.InputeFieldKeys.DateRange)
        && (vm.dataelement.defaultDateTime === vm.dateTimeValueSelection.currentValue.id)) {
        vm.dataelement.defaultValue = vm.dataelement.fromDate = vm.dataelement.toDate = null;
      }
      if (!vm.dataelement.isDatasource && vm.dataelement && vm.dataelement.fieldValue && vm.dataelement.fieldValue.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DATAELEMENT_KEYVALUE_REQUIRE);
        messageContent.message = stringFormat(messageContent.message, vm.dataelement.dataElementName);
        const model = {
          title: messageContent.messageCode,
          textContent: messageContent.message,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      if (vm.dataelement.isManualData && vm.ManualDataOptionsForm && BaseService.checkFormDirty(vm.ManualDataOptionsForm)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DATAELEMENT_MANUAL_DATA_NOT_SAVED);
        messageContent.message = stringFormat(messageContent.message, vm.dataelement.dataElementName);
        const model = {
          title: messageContent.messageCode,
          textContent: messageContent.message,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        return;
      }
      const dataElementInfo = vm.updateIndividualElements(dataElement);
      if (vm.dataelement.controlTypeID === vm.InputeFieldKeys.SubForm) {
        dataElement.subFormList = _.filter(dataElement.subFormList, (o) => o.addSubFormItem !== true);
      }
      vm.cgBusyLoading = DataElementFactory.createNewDataElement().save(dataElementInfo).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
          BaseService.currentPageForms = [];
          if (!vm.dataelement.dataElementID && res.data.dataElementID) { // create case : we update dataElementName from api to keep unique
            vm.dataelement.dataElementName = res.data.dataElementName;
          }
          vm.dataelement.dataElementID = res.data.dataElementID;


          //to update display order or data elements
          let dropTargetModelList = [], isUpdateOrder = false;
          if (isSubForm) {
            isUpdateOrder = false;
            const parentElement = _.find(vm.dataelementList, { dataElementID: vm.dataelement.parentDataElementID });

            if (parentElement) {
              if (vm.dataelement && vm.dataelement.displayOrder) {
                isUpdateOrder = _.filter(parentElement.subFormList, (o) => o.displayOrder === vm.dataelement.displayOrder).length > 1;
                dropTargetModelList = parentElement.subFormList;
              }
            }
          }
          else {
            if (vm.dataelement && vm.dataelement.displayOrder) {
              isUpdateOrder = _.filter(vm.dataelementList, (o) => o.displayOrder === vm.dataelement.displayOrder).length > 1;
              dropTargetModelList = vm.dataelementList;
            }
          }
          if (isUpdateOrder && dropTargetModelList) {
            if (isUpdateOrder && dropTargetModelList.length > 0) {
              _.each(dropTargetModelList, (o, $index) => {
                o.displayOrder = $index + 1;
              });
              const displayOrder = _.map(dropTargetModelList, (obj) => ({ dataElementID: obj.dataElementID, displayOrder: obj.displayOrder }));
              vm.cgBusyLoading = DataElementFactory.updateDisplayOrder().update(null, displayOrder).$promise.then(() => {
                // Block for Success of API
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }

          if (res.data.dataelement_use_at) {
            vm.dataelement.dataelement_use_at = res.data.dataelement_use_at;
            if (vm.dataelement) {
              vm.isShowFieldAt = true;
              if (vm.dataelement.IsSubFormElement || vm.dataelement.addSubFormItem) {
                vm.isShowFieldAt = false;
              }
              if (vm.dataelement && vm.dataelement.controlTypeID === vm.InputeFieldKeys.SubForm) {
                vm.isShowFieldAt = true;
              }
            }
          }
          vm.dataElementForm.$setPristine();
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data) {
          if (res.errors.data.isDuplicateFieldName || res.errors.data.isDuplicateDisplayOrder) {
            displayDLNameDisplayOrderUniqueMessage(res.errors.data);
          }
          resetDataElementOriginalData();
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY) {
          resetDataElementOriginalData();
        }
        resetPrevModifiedElementDataCopy = {};
        resetPrevModifiedElementDataCopy = angular.copy(vm.dataelement);

        if (vm.dataelement.controlTypeID === vm.InputeFieldKeys.FileUpload) {
          vm.dataelement.fileType = JSON.parse(dataElementInfo.fileType);
        }
        if (vm.dataelement && vm.dataelement.fieldValue) {
          if (vm.dataelement.fieldValue.length > 0 && !vm.dataelement.datasourceID) {
            const keyValue = _.find(vm.dataelement.fieldValue, (obj) => (!obj.keyValueID || obj.keyValueID === 0));
            if (keyValue) {
              keyValue.dataElementID = vm.dataelement.dataElementID;
              vm.SaveDataElementKeyValue(keyValue, true);
            }
          }
        }
        if ((vm.dataelement.controlTypeID === vm.InputeFieldKeys.DateTime || vm.dataelement.controlTypeID === vm.InputeFieldKeys.DateRange)
          && vm.dataelement.defaultDateTime === vm.dateTimeValueSelection.currentValue.id) {
          vm.dataelement.defaultValue = vm.dataelement.fromDate = vm.dataelement.toDate = new Date();
        }
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.dataElementForm.$setPristine();
        }
      }).catch((error) => {
        vm.enityElementDetails(entityID);
        return BaseService.getErrorLog(error);
      });
    }

    vm.updateIndividualElements = (item) => {
      // let fileType = [];
      // if (item.controlTypeID === vm.InputeFieldKeys.FileUpload) {
      //   fileType = _.filter(vm.FileTypeList, { isDefault: true });
      //   //fileType = _.map(fileType, 'mimetype');
      //   fileType = _.map(fileType, 'extension');
      // }
      //if (item && item.subFormList) {
      //    _.each(item.subFormList, (itemData) => {
      //        itemData.dataelement_use_at = item.dataelement_use_at;
      //        saveDataElement(itemData, true);
      //    });
      //}

      const dataElementInfo = {
        isSystemGeneratedEntity: vm.systemGeneratedEntity,
        dataElementID: item.dataElementID,
        dataElementName: item.dataElementName,
        entityID: item.entityID,
        controlTypeID: item.controlTypeID,
        defaultValue: item.defaultValue ?
          (item.controlTypeID === vm.InputeFieldKeys.DateTime ?
            //(item.defaultValue = $filter('date')(item.defaultValue, _dateTimeFullTimeDisplayFormat))
            // [DO NOT REMOVE] 'yyyy-MM-dd HH:mm:ss' : Temporary solution of date picker data bind issue
            //(item.defaultValue = $filter('date')(item.defaultValue, 'yyyy-MM-dd HH:mm:ss'))
            item.defaultValue
            : ((item.controlTypeID === vm.InputeFieldKeys.Numberbox || item.controlTypeID === vm.InputeFieldKeys.Currency)
              ? (item.isDecimal
                ? parseFloat(item.defaultValue) : parseInt(item.defaultValue))
              : (item.controlTypeID === vm.InputeFieldKeys.SingleChoice
                ? item.defaultValue.toString() : item.defaultValue))) : null,
        displayOrder: item.displayOrder,
        isRequired: item.isRequired,
        maxLength: item.maxLength,
        formatMask: item.formatMask,
        decimal_number: item.isDecimal ? item.decimal_number : ((item.decimal_number > 0) ? null : null),
        rangeFrom: item.isAutoIncrement ? null : item.rangeFrom,
        rangeTo: item.isAutoIncrement ? null : item.rangeTo,
        description: item.description,
        isActive: true,
        isDeleted: false,
        fromDate: item.fromDate,
        toDate: item.toDate,
        fileType: null,
        fileSize: item.fileSize,
        parentDataElementID: item.parentDataElementID,
        parentDataElementName: item.parentDataElementName,
        parentdataelement_use_at: item.dataelement_use_at,
        subFormCount: item.subFormCount,
        tooltip: item.tooltip,
        fieldWidth: item.fieldWidth,
        isHideLabel: item.isHideLabel,
        recurring_limit: item.isMultiple ? parseInt(item.recurring_limit) : ((item.recurring_limit > 0) ? null : null),
        dateTimeType: item.dateTimeType,
        dataelement_use_at: (vm.entityName === vm.Entity.Equipment || vm.entityName === vm.Entity.Operation || vm.entityName === vm.Entity.Workorder) ? (item.dataelement_use_at ? item.dataelement_use_at : vm.SHOW_ELEMENT_OPTION[2]) : '',
        isUnique: item.isUnique,
        isAutoIncrement: item.isDecimal ? false : item.isAutoIncrement,
        isDatasource: item.isDatasource,
        datasourceID: item.isDatasource ? (item.isFixedEntity ? (vm.autoCompleteOfFixedEntityDS ? item.datasourceID : null) : (vm.autoCompleteOfManualEntityDS ? item.datasourceID : null)) : null,
        datasourceDisplayColumnID: item.isDatasource ? (item.isFixedEntity ? null : (vm.autoCompleteOfManualEntityDS ? item.datasourceDisplayColumnID : null)) : null,
        isFixedEntity: item.isDatasource ? (item.isFixedEntity ? true : false) : null,
        validationExpr: item.validationExpr ? JSON.stringify(item.validationExpr) : null,
        validationExprSuccessMsg: item.validationExprSuccessMsg,
        validationExprErrorMsg: item.validationExprErrorMsg,
        isManualData: item.isManualData
      };
      return dataElementInfo;
    };

    vm.SaveDataElementKeyValue = (item, isAddNewDataElement) => {
      const ExistingKey = _.find(vm.dataelement.fieldValue, (field) => item.value === field.value && item.keyValueID !== field.keyValueID);
      if (ExistingKey) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.UNIQUE_DISPLAY_VALUE);
        DialogFactory.messageAlertDialog({ messageContent: messageContent, multiple: true });
        return;
      }
      else {
        vm.allKeyValuePair = vm.dataelement.fieldValue;
        item.IsEdit = false;
        item.dataElementID = vm.dataelement.dataElementID;
        item.isAddNewDataElement = isAddNewDataElement;
        if (item.keyValueID > 0) {
          vm.cgBusyLoading = DataElementFactory.SaveDataElementKeyValue().update({
            id: item.keyValueID, elementName: item.name
          }, item).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.ManualDataOptionsForm) {
                vm.ManualDataOptionsForm.$setPristine();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.cgBusyLoading = DataElementFactory.SaveDataElementKeyValue().save(item).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.ManualDataOptionsForm) {
                vm.ManualDataOptionsForm.$setPristine();
              }
              item.IsEdit = false;
            }
            if (res.data) {
              item.keyValueID = res.data.keyValueID;
            }
            vm.entitiesAll();
            _.remove(vm.dataelement.fieldValue, (element) => element.name === item.name &&
              element.value === item.value && element.displayOrder === item.displayOrder);

            vm.dataelement.fieldValue.push(item);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    vm.updateDataElementIndividual = (dataElement) => {
      if (!vm.dataElementForm.$valid || !(vm.IsEdit && vm.dataelement.controlTypeID !== 0)) {
        BaseService.focusRequiredField(vm.dataElementForm);
        return;
      }
      if (!vm.dataElementForm.$valid) {
        vm.isSubmit = true;
        return;
      }
      //if (vm.dataElementForm.$dirty) {
      vm.SaveDataElementIndividual(dataElement, false);
      // }
    };

    angular.element(() => {
      BaseService.currentPageForms = [vm.dataElementForm];
    });

    vm.rearrangeSubformElement = (dataElement, $event) => {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      vm.dataelement = dataElement;
      vm.dataelement.rearrange = true;
    };

    vm.rearrangeSortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': false,
      cursorAt: {
        top: 0, left: 0
      },
      start: function () {
      },
      sort: function () {
      },
      update: function () {
        vm.dataElementForm.$dirty = true;
      }
    });

    // update order
    vm.updateSubformElementOrder = () => {
      if (vm.dataElementForm.$dirty) {
        _.each(vm.dataelement.subFormList, (o, $index) => {
          o.displayOrder = $index + 1;
        });
        const displayOrder = _.map(vm.dataelement.subFormList, (obj) => ({ dataElementID: obj.dataElementID, displayOrder: obj.displayOrder }));
        vm.cgBusyLoading = DataElementFactory.updateDisplayOrder().update(null, displayOrder).$promise.then(() => {
          vm.dataelement.rearrange = false;
          vm.dataElementForm.$dirty = false;
          NotificationFactory.success('Subform order updated.');
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getIconClass = (controlTypeID) => {
      const object = _.find(CORE.InputeFields, (item) => item.ID === controlTypeID);
      return object ? object.IconClass : '';
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

    /*Set date format dropdown selection to dataelement Formatmask*/
    vm.dateFormat = function () {
      //if (vm.dataelement.dateTimeType == "2") {
      //    vm.dataelement.DateformatMask = vm.dataelement.formatMask;
      //}
      //else if (vm.dataelement.dateTimeType == "1") {
      //    if (vm.dataelement.dataElementName == vm.InputeFieldKeys.DateRange) {
      //        vm.dataelement.DateformatMask = vm.dataelement.formatMask;
      //    }
      //    else
      //        // vm.dataelement.DateformatMask = vm.dataelement.formatMask.toUpperCase();
      //        vm.dataelement.DateformatMask = vm.dataelement.formatMask;
      //}
      //else {
      //    //vm.dataelement.DateformatMask = applyDateTimeFormat(vm.dataelement.formatMask);
      //    vm.dataelement.DateformatMask = vm.dataelement.formatMask;
      //}

      vm.dataelement.DateformatMask = vm.dataelement.formatMask;
      const findFormat = _.find(vm.DateFormatArray, { 'format': vm.dataelement.formatMask });
      vm.dataelement.uimaskformatForDateTime = findFormat ? findFormat.uimaskformat : vm.DateFormatArray[1].uimaskformat;
      vm.dataelement.placeholderForDateTime = findFormat ? findFormat.placeholder : '';

      vm.hideDate = true;
      $timeout(() => {
        vm.hideDate = false;
      });
    };

    vm.size = 100;
    vm.changeSize = function (size) {
      vm.size = size;
      const entityInfo = {
        columnView: size,
        entityName: vm.entityName
      };
      vm.cgBusyLoading = EntityFactory.entity().update({
        id: entityID
      }, entityInfo).$promise.then(() => {
        var obj = _.find(vm.entities, (item) => item.entityID === entityID);
        obj.columnView = vm.size;
      }).catch(() => {
        // Block for Error
      });
    };

    const getEntityDataList = (selectedEntity) => {
      if (selectedEntity) {
        vm.cgBusyLoading = DataElementFactory.getEntityDataElementsByEntityID().query({ entityID: selectedEntity.entityID }).$promise.then((response) => {
          if (response && response.data) {
            _.remove(response.data, (item) => !item.isUnique);
            vm.dataelement.DynamicMasterEntityFieldList = response.data;
            vm.dataelement.datasourceID = vm.autoCompleteOfManualEntityDS.keyColumnId;
            vm.dataelement.datasourceDisplayColumnID = vm.autoCompleteOfManualEntityDS ? _.first(_.sortBy(response.data, 'displayOrder')).dataElementID : null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.dataelement.DynamicMasterEntityFieldList = [];
      }
    };

    const getAllFixedEntities = () =>
      FixedEntityDataElementFactory.retrieveFixedEntityDataelementList().query().$promise.then((fixedEntities) => {
        vm.FixedEntities = fixedEntities.data.fixedEntityList;
        return vm.FixedEntities;
      }).catch((error) => BaseService.getErrorLog(error));


    vm.showEntitiesAutoComplete = () => {
      vm.dataelement.datasourceID = null;
      vm.dataelement.datasourceDisplayColumnID = null;
      vm.dataelement.DynamicMasterEntityFieldList = [];

      if (vm.dataelement.isFixedEntity) {
        if (vm.FixedEntities && vm.FixedEntities.length > 0) {
          initAutoCompleteForFixedEntityDataSource();
          if (vm.autoCompleteOfFixedEntityDS) {
            vm.autoCompleteOfFixedEntityDS.keyColumnId = (vm.FixedEntities && vm.FixedEntities.length > 0) ? vm.FixedEntities[0].id : null;
          }
        }
        else {
          const autocompleteDataPromise = [getAllFixedEntities()];
          vm.cgBusyLoading = $q.all(autocompleteDataPromise).then(() => {
            initAutoCompleteForFixedEntityDataSource();
            if (vm.autoCompleteOfFixedEntityDS) {
              vm.autoCompleteOfFixedEntityDS.keyColumnId = (vm.FixedEntities && vm.FixedEntities.length > 0) ? vm.FixedEntities[0].id : null;
            }
          });
        }
      }
      else {
        if (vm.autoCompleteOfManualEntityDS) {
          vm.autoCompleteOfManualEntityDS.keyColumnId = (vm.ManualEntities && vm.ManualEntities.length > 0) ? vm.ManualEntities[0].entityID : null;
        }
      }
    };

    const setFixedEntityDetails = (selectedEntity) => {
      vm.dataelement.datasourceID = selectedEntity ? selectedEntity.id : null;
    };

    vm.addValidation = function ($event) {
      var data = {
        controlTypeID: vm.dataelement.controlTypeID,
        filterData: _.cloneDeep(vm.dataelement.validationExpr),
        dateTimeType: vm.dataelement.dateTimeType,
        isEntity: true,
        dataElementName: vm.dataelement.dataElementName
      };

      DialogFactory.dialogService(
        CORE.DATAELEMENT_VALIDATION_MODAL_CONTROLLER,
        CORE.DATAELEMENT_VALIDATION_MODAL_VIEW,
        $event,
        data).then((response) => {
          if (response) {
            // If only expression is changed then making one field dirty so form becomes dirty and user can save change.
            vm.dataElementForm.validationExprSuccessMsg.$setDirty();
            vm.dataelement.validationExpr = response;
            DisplayExpression(vm.dataelement.validationExpr);
          }
        }, () => {
          /* empty */
        }, (err) => BaseService.getErrorLog(err));
    };

    // clear all validation
    vm.clearValidation = function () {
      vm.dataelement.validationExpr = null;
      vm.expressionui = null;
      // If only expression is changed then making one field dirty so form becomes dirty and user can save change.
      vm.dataElementForm.validationExprSuccessMsg.$setDirty();
      assignDefaultValue(vm.dataelement);
    };

    // [S] Display expression as user readable string
    vm.OptionTypeArr = CORE.OPTIONTYPES_JS_EXP;
    vm.datatypes = CORE.DATATYPE;

    let groupCount = 0;
    let count = 0;
    let sublevelCount = 0;
    function DisplayExpression(data) {
      vm.expressionui = '';
      groupCount = 0;
      count = 0;
      sublevelCount = 0;
      _.each(data, (group) => {
        if (group.Nodes.length > 0) {
          DisplaySubExpression(group);
        }
      });
      if (sublevelCount > 0) {
        for (let o = 0; o < sublevelCount; o++) {
          vm.expressionui += ' ) ';
        }
      }
    };

    function DisplaySubExpression(group) {
      _.each(group.Nodes, (node, index) => {
        if (index > 0 && group.Condition) {
          vm.expressionui += ' ' + '<span style="color:red;">' + (node.Condition || group.Condition) + '</span>';
        }
        if (node.Selected) {
          if (groupCount > 0 && count !== groupCount) {
            count = groupCount;
            vm.expressionui += ' ( ';
          }
          if (node.Selected.OptionType === vm.OptionTypeArr[0]) {
            let valText = '';
            if (vm.datatypes.NUMBER.indexOf(node.datatype) !== -1) {
              valText = node.OperatorValue !== null ? node.OperatorValue : '';
            }
            else if (vm.datatypes.STRING.indexOf(node.datatype) !== -1) {
              valText = node.OperatorValue !== null ? stringFormat('\'{0}\'', node.OperatorValue) : '';
            }
            else if (vm.datatypes.DATE.indexOf(node.datatype) !== -1) {
              if (node.datatype === 'date') {
                valText = node.OperatorValue !== null ? stringFormat('\'{0}\'', $filter('date')(new Date(node.OperatorValue), vm.DefaultDateFormat)) : '';
              } else if (node.datatype === 'datetime') {
                valText = node.OperatorValue !== null ? stringFormat('\'{0}\'', $filter('date')(new Date(node.OperatorValue), vm.DefaultDateTimeFormat)) : '';
              }
            }
            else if (vm.datatypes.TIME.indexOf(node.datatype) !== -1) {
              valText = node.OperatorValue !== null ? stringFormat('\'{0}\'', node.OperatorValue) : '';
            }
            else {
              valText = node.Selected.BooleanVal !== null ? node.Selected.BooleanVal.Name : '';
            }
            vm.expressionui += ' {' + node.Selected.FieldName.Column_name + '} ' + node.Selected.Operator.Value + ' ' + valText;
          }
          if (node.Selected.OptionType === vm.OptionTypeArr[1]) {
            vm.expressionui += ' ( ' + node.Selected.SelectedExpression.Expression + ' ' + node.Selected.Operator.Value + ' ' + node.OperatorValue + ' ) ';
          }
        }
        if (groupCount > 0 && group.ParentGroupLevel !== null && index === group.Nodes.length - 1) {
          if (group.SubLevel === 1) {
            vm.expressionui += ' ) ';
          }
          if (group.SubLevel > 1) {
            //console.log(group.SubLevel);
            sublevelCount++;
          }
        }
        if (node.Nodes && node.Nodes.length > 0) {
          groupCount++;
          DisplaySubExpression(node);
        }
      });
    };
    // Ends

    // show confirmation to switch in edit mode
    vm.CheckForEdit = () => {
      //let obj = {
      //    title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
      //    textContent: CORE.MESSAGE_CONSTANT.EDIT_MODE_ALERT_BODY_MESSAGE,
      //    btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
      //    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      //};
      //DialogFactory.confirmDiolog(obj).then((yes) => {
      //    if (yes)
      if (vm.entityDetails.entityStatus !== vm.DisplayStatusConst.Published.ID) {
        vm.IsEdit = !vm.IsEdit;
      }
      //}, (error) => {
      //    return BaseService.getErrorLog(error);
      //});
    };

    vm.elementChange = () => {
      //if (itemElementData.IsSubFormElement) {
      //    vm.dataElementForm[itemElementData.dataElementID + '_' + itemElementData.rowNumber].$setDirty();
      //}
      //else {
      //    vm.dataElementForm[itemElementData.dataElementID].$setDirty();
      //}
      vm.dataElementForm.$setDirty();
    };

    vm.dateTimeChange = () => {
      //vm.dateFormat();
      vm.dataElementForm.$setDirty();
      if (vm.dataElementForm.selectDateTime) {
        vm.dataElementForm.selectDateTime.$dirty = true;
      }
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* get Validation message for field value. */
    const getMinMaxValueMessageContent = () => {
      const minValueMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MIN_VALUE);
      const maxValueMessageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MAX_VALUE);
      vm.minValueValidationMessage = stringFormat(minValueMessageContent.message, vm.dataElement_Default_Values.fieldWidthValidation.Min, 'px');
      vm.maxValueValidationMessage = stringFormat(maxValueMessageContent.message, vm.dataElement_Default_Values.fieldWidthValidation.Max, 'px');
    };
    getMinMaxValueMessageContent();

    vm.changeOfAutoIncrementRB = () => {
      if (!vm.systemGeneratedEntity && vm.dataelement.isAutoIncrement) {
        vm.dataelement.isRequired = true;
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    vm.dataelement.fromDateOptions = {
      maxDate: vm.dataelement.toDate ? vm.dataelement.toDate : '',
      appendToBody: false
    };
    vm.dataelement.toDateOptions = {
      minDate: vm.dataelement.fromDate ? vm.dataelement.fromDate : '',
      appendToBody: false
    };

    //Set mindate value onchange in From Date
    vm.onChangeFromDate = () => {
      if (vm.dataelement.fromDate) {
        vm.dataelement.toDateOptions = {
          minDate: vm.dataelement.fromDate,
          appendToBody: true
        };
        if (vm.dataelement.toDate) {
          const fromDatePartOnly = new Date(vm.dataelement.fromDate.getFullYear(), vm.dataelement.fromDate.getMonth(), vm.dataelement.fromDate.getDate());
          const toDatePartOnly = new Date(vm.dataelement.toDate.getFullYear(), vm.dataelement.toDate.getMonth(), vm.dataelement.toDate.getDate());
          if (fromDatePartOnly > toDatePartOnly) {
            $timeout(() => {
              vm.dataelement.toDate = '';
            }, true);
          }
        }
      }
    };

    /* to update custom form entity status */
    vm.changeEntityStatus = (statusID, oldStatusID) => {
      if (statusID !== oldStatusID) {
        if (vm.dataelementList.length === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ADD_ELEMENT_FIRST);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, vm.getEntityStatus(oldStatusID), vm.getEntityStatus(statusID));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.IsEdit = false;
              vm.entityDetails.entityStatus = statusID;
              if (statusID === 0) {
                vm.isPublishDisabled = false;
                vm.entityStatusLabel = CORE.OPSTATUSLABLEPUBLISH;
              }
              else if (statusID === 1) {
                vm.isPublishDisabled = true;
                vm.entityStatusLabel = CORE.OPSTATUSLABLEDRAFT;
              }
              else {
                vm.entityStatusLabel = '';
              }

              if (!vm.systemGeneratedEntity) {
                const entityStatusInfo = {
                  entityStatus: statusID
                };
                vm.cgBusyLoading = EntityFactory.entity().update({
                  id: entityID
                }, entityStatusInfo).$promise.then(() => {
                  vm.dataElementForm.$setPristine();
                }).catch(() => {
                  // Bloak of Error
                });
              }
            }
          }, () => {
            // Block for Cancel
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    //get custom forms entity status by id
    vm.getEntityStatus = (statusID) => BaseService.getOpStatus(statusID);

    vm.clearCurrentKeyValue = () => {
      if (vm.currentmodel) {
        vm.currentmodel.name = '';
        vm.currentmodel.value = '';
        vm.currentmodel.displayOrder = '';
      }
    };

    // after moving to next element, prev element set to its all original data
    const resetDataElementOriginalData = () => {
      if (vm.dataelement.parentDataElementID) {  /* sub-form */
        const subFormParentItem = _.find(vm.dataelementList, (item) => item.dataElementID === vm.dataelement.parentDataElementID);
        _.remove(subFormParentItem.subFormList, (item) => item.dataElementID === vm.dataelement.dataElementID);
        if (vm.dataelement.dataElementID === resetPrevModifiedElementDataCopy.dataElementID) {
          subFormParentItem.subFormList.push(resetPrevModifiedElementDataCopy);
        }
      }
      else {
        _.remove(vm.dataelementList, (item) => item.dataElementID === vm.dataelement.dataElementID);
        if (vm.dataelement.dataElementID === resetPrevModifiedElementDataCopy.dataElementID) {
          vm.dataelementList.push(resetPrevModifiedElementDataCopy);
          vm.dataelement = resetPrevModifiedElementDataCopy;
          if (vm.dataelement.isFixedEntity && vm.autoCompleteOfFixedEntityDS) {
            vm.autoCompleteOfFixedEntityDS.keyColumnId = vm.dataelement.datasourceID;
          } else if (!vm.dataelement.isFixedEntity && vm.autoCompleteOfManualEntityDS) {
            vm.autoCompleteOfManualEntityDS.keyColumnId = vm.dataelement.datasourceID;
            initAutoCompleteForManualEntityDataSource();
          }
        }
      }
      vm.dataElementForm.$setPristine();
    };

    // on click of "ADD FIELDS" button , add new blank in sub form for adding new element
    vm.addBlankFieldsInSubForm = (itemElement) => {
      if (vm.dataElementForm.$dirty && vm.IsEdit && vm.dataelement
        && Boolean(vm.dataelement.dataElementID)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_SAVING_ELEMENT_ALERT_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            itemElement.addSubFormItem = true;
            resetDataElementOriginalData();
          }
        }, () => {
          //vm.enityElementDetails(entityID);
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        itemElement.subInputField = null;
        itemElement.addSubFormItem = true;
      }
    };

    const currentMousePos = { x: -1, y: -1 };
    $(document).mousemove((event) => {
      currentMousePos.x = event.pageX;
      currentMousePos.y = event.pageY;
      $('#allElementListDragDropDiv').css('top', currentMousePos.y);
      $('#allElementListDragDropDiv').css('left', currentMousePos.x);
    });


    /* to select de select all doc type  */
    vm.selectDeselectAllDocType = () => {
      // _.each(vm.FileTypeList, (docTypeItem) => {
      //   docTypeItem.isDefault = vm.dataelement.isCheckedAllDocType;
      // });
    };

    vm.selectDeselectDocTypeItem = () => {
      vm.dataelement.isCheckedAllDocType = checkAllDocTypeItemSelected();
    };

    const checkAllDocTypeItemSelected = () => _.every(vm.FileTypeList, (fileTypeItem) => fileTypeItem.isDefault);

    //  to check duplicate field name - data element name
    vm.checkDuplicateFieldName = () => {
      if (oldFieldName !== vm.dataelement.dataElementName) {
        if (vm.dataelement && vm.dataelement.dataElementName) {
          vm.cgBusyLoading = DataElementFactory.checkDuplicateForDENameDisplayOrder().save({
            entityID: entityID,
            dataElementID: vm.dataelement.dataElementID,
            dataElementName: vm.dataelement.dataElementName,
            parentDataElementID: vm.dataelement.parentDataElementID
          }).$promise.then((res) => {
            oldFieldName = angular.copy(vm.dataelement.dataElementName);
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data && res.errors.data.isDuplicateFieldName) {
              displayDLNameDisplayOrderUniqueMessage(res.errors.data);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    //  to check duplicate field name - data element name
    vm.checkDuplicateDisplayOrder = () => {
      if (oldDisplayOrder !== vm.dataelement.displayOrder) {
        if (vm.dataelement && !_.isNaN(vm.dataelement.displayOrder) && !_.isUndefined(vm.dataelement.displayOrder)) {
          vm.cgBusyLoading = DataElementFactory.checkDuplicateForDENameDisplayOrder().save({
            entityID: entityID,
            dataElementID: vm.dataelement.dataElementID,
            parentDataElementID: vm.dataelement.parentDataElementID,
            displayOrder: vm.dataelement.displayOrder
          }).$promise.then((res) => {
            oldDisplayOrder = angular.copy(vm.dataelement.displayOrder);
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors && res.errors.data && res.errors.data.isDuplicateDisplayOrder) {
              displayDLNameDisplayOrderUniqueMessage(res.errors.data);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    // display unique message
    const displayDLNameDisplayOrderUniqueMessage = (data) => {
      oldFieldName = oldDisplayOrder = null;
      let setUniqueNameFor = null;
      let setFocusField = null;
      if (data.isDuplicateFieldName) {
        vm.dataelement.dataElementName = null;
        setUniqueNameFor = 'Field name';
        setFocusField = 'elementname';
      }
      else if (data.isDuplicateDisplayOrder) {
        vm.dataelement.displayOrder = null;
        setUniqueNameFor = 'Display order';
        setFocusField = 'displayOrder';
      }
      else {
        return;
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, setUniqueNameFor);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName(setFocusField);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.restrictFileExtensionPopup = () => {
      //open configure restrict file types popup
      DialogFactory.dialogService(
        USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_CONTROLLER,
        USER.CONFIGURE_RESTRICT_FILE_TYPE_POPUP_VIEW,
        null,
        null).then(() => { // Empty
        }, (err) => BaseService.getErrorLog(err));
    };
    // set default datetime as per selection
    vm.setDefaultDateTime = function () {
      // If only expression is changed then making one field dirty so form becomes dirty and user can save change.
      if (vm.dataelement.controlTypeID === vm.InputeFieldKeys.DateTime) {
        vm.dataElementForm.validationExprSuccessMsg.$setDirty();
      }
      // save isManualData = 0 if its Current datetime
      if (vm.dataelement.defaultDateTime === vm.dateTimeValueSelection.currentValue.id) {
        vm.dataelement.isManualData = 0;
        vm.dataelement.defaultValue = new Date();
        vm.dataelement.fromDate = vm.dataelement.toDate = new Date();
      } else {
        vm.dataelement.isManualData = 1;
        vm.dataelement.defaultValue = null;
        vm.dataelement.fromDate = vm.dataelement.toDate = null;
      }
      assignDefaultValue(vm.dataelement);
    };

    /* Clear All Input control field's width. */
    vm.clearFieldWidth = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RESET_FIELD_WIDTH_CONFIRM_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = DataElementFactory.resetFieldWidth().query({ entityID: entityID }).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.dataelement.fieldWidth = null;
              _.forEach(vm.dataelementList, (data) => data.fieldWidth = null);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();

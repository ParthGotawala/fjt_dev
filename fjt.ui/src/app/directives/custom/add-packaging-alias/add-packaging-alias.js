(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('addPackagingAlias', addPackagingAlias);

  /** @ngInject */
  function addPackagingAlias(BaseService, USER, CORE, DialogFactory, ComponentFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=?',
        partDetail: '=?'
      },
      templateUrl: 'app/directives/custom/add-packaging-alias/add-packaging-alias.html',
      controller: aliasAttributeGroupsCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of alias & attribute groups
    *
    * @param
    */
    function aliasAttributeGroupsCtrl($scope, $element, $attrs, $timeout, $state, $stateParams, DialogFactory, MasterFactory) {
      const vm = this;
      vm.id = $scope.partId;
      vm.basePartDet = $scope.partDetail;
      vm.isSaveAlias = false;
      vm.partDetail = $scope.partDetail;
      vm.addPackgingAliasHint = CORE.ADD_PACKGING_ALIAS_HINT;
      vm.updatePartsAttributesFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UpdatePartsAttributes);
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.PartCategory = CORE.PartCategory;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.VALIDATION_NOTE_ON_ADD_PACKGAGING_PART = CORE.MESSAGE_CONSTANT.VALIDATION_NOTE_ON_ADD_PACKGAGING_PART;
      $scope.splitPaneProperties = {};
      vm.validationList = [];
      vm.addedPackagingAliasList = [];
      vm.selectedPackagingPart = [];
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

      const initAutoComplete = () => {
        vm.autoCompletePackagingAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          keyColumnId: null,
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          inputName: 'Add Packaging Alias',
          placeholderName: 'Search text or Add',
          isRequired: false,
          isAddnew: true,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            parentId: vm.partDetail ? vm.partDetail.mfgcodeID : null,
            isBadPart: vm.PartCorrectList.CorrectPart,
            functionalCategoryID: vm.partDetail ? vm.partDetail.functionalCategoryID : null,
            mountingTypeID: vm.partDetail ? vm.partDetail.mountingTypeID : null
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              inputName: vm.autoCompletePackagingAlias.inputName
            };
            if (vm.partDetail) {
              const selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
              searchObj.rohsMainCategoryID = selectedRoHS.refMainCategoryID;
              searchObj.isRohsMainCategoryInvertMatch = true;
              searchObj.packagingAliasFilter = true;
              if (!vm.partDetail.isCustom) {
                searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
              }
            }
            return getAliasSearch(searchObj);
          },
          onSelectCallbackFn: function (item) {
            if (item && item.id) {
              const addedComponent = vm.addedPackagingAliasList.some((a) => a.id === item.id);
              if (addedComponent) {
                const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS;
                messageContent.message = stringFormat(messageContent.message, 'Packaging Alias Part');

                const obj = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(obj).then(() => {
                  $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
                  setFocusByName(vm.autoCompletePackagingAlias.inputName);
                }, () => {
                  // cancel
                });
              } else {
                getComponentPackagingAliasDetail(item.id);
              }
            }
          },
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              inputName: vm.autoCompletePackagingAlias.inputName
            };
            if (vm.partDetail) {
              const selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.partDetail.RoHSStatusID);
              searchObj.rohsMainCategoryID = selectedRoHS.refMainCategoryID;
              searchObj.isRohsMainCategoryInvertMatch = true;
              searchObj.packagingAliasFilter = true;
              searchObj.currentPartId = vm.partDetail.id;
              if (!vm.partDetail.isCustom) {
                searchObj.mfgcodeID = vm.partDetail.mfgcodeID;
              }
            }
            return getAliasSearch(searchObj);
          }
        };
      };

      // Get Alternate Part Validation list base on Selected Base Part Functional Type
      vm.getComponentAlternatePnValidations = (functionalCategoryID) => {
        var componentObj = {
          id: functionalCategoryID,
          type: CORE.ComponentValidationPartType.PackagingAlias
        };
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.getComponentAlternatePnValidations().query({ componentObj: componentObj }).$promise.then((validationCriteria) => {
          if (validationCriteria && validationCriteria.status === CORE.ApiResponseTypeStatus.SUCCESS && validationCriteria.data) {
            vm.validationList = validationCriteria.data;
          }
        }).catch(() => false);
      };

      // start component packaging alias region
      const getComponentPackagingAliasDetail = (ids) => {
        if (ids) {
          $scope.$parent.vm.cgBusyLoading = ComponentFactory.retrieveComponentWithPackagaingAlias().query({
            ids: ids
          }).$promise.then((component) => {
            if (component && Array.isArray(component.data) && component.data.length > 0) {
              const groupComponent = _.groupBy(component.data, 'id');
              Object.keys(groupComponent).forEach((componentId) => {
                const componentList = groupComponent[componentId];
                const componentDet = groupComponent[componentId][0];
                const partDetail = {
                  id: componentDet.id,
                  PIDCode: componentDet.PIDCode,
                  isGoodPart: componentDet.isGoodPart,
                  custAssyPN: componentDet.custAssyPN,
                  rev: componentDet.rev,
                  restrictUSEwithpermission: componentDet.restrictUSEwithpermission,
                  restrictPackagingUsePermanently: componentDet.restrictPackagingUsePermanently,
                  restrictUsePermanently: componentDet.restrictUsePermanently,
                  rohsIcon: componentDet.rohsIcon,
                  rohsComplientConvertedValue: componentDet.rohsComplientConvertedValue,
                  mfgPNDescription: componentDet.mfgPNDescription,
                  rohName: componentDet.rohName,
                  rohsImagePath: vm.rohsImagePath + componentDet.rohsIcon,
                  mountingTypeID: componentDet.mountingTypeID,
                  functionalCategoryID: componentDet.functionalCategoryID,
                  partPackageID: componentDet.partPackageID,
                  RoHSStatusID: componentDet.RoHSStatusID,
                  connecterTypeID: componentDet.connecterTypeID,
                  displayFunctionalType: componentDet.functionalTypeName,
                  displayMountingType: componentDet.mountingTypeName,
                  displayRoHSStatus: componentDet.rohName,
                  displayConnectorType: componentDet.connectorTypename,
                  displayPackage: componentDet.packageCaseName,
                  displayPackaging: componentDet.packagingName,
                  feature: componentDet.feature,
                  maxOperatingTemp: componentDet.maxOperatingTemp,
                  minOperatingTemp: componentDet.minOperatingTemp,
                  temperatureCoefficient: componentDet.temperatureCoefficient,
                  temperatureCoefficientValue: componentDet.temperatureCoefficientValue,
                  temperatureCoefficientUnit: componentDet.temperatureCoefficientUnit,
                  noOfPosition: componentDet.noOfPosition,
                  noOfRows: componentDet.noOfRows,
                  pitch: componentDet.pitch,
                  pitchMating: componentDet.pitchMating,
                  width: componentDet.width,
                  length: componentDet.length,
                  heightText: componentDet.heightText,
                  height: componentDet.height,
                  tolerance: componentDet.tolerance,
                  voltage: componentDet.voltage,
                  value: componentDet.value,
                  powerRating: componentDet.powerRating,
                  weight: componentDet.weight,
                  color: componentDet.color,
                  packaginggroupID: componentDet.packaginggroupID,
                  mfgType: componentDet.mfgType,
                  mfgcodeID: componentDet.mfgcodeID,
                  mfgCode: BaseService.getMfgCodeNameFormat(componentDet.mfgCode, componentDet.mfgName),
                  componentID: componentDet.id,
                  displayMfgPN: componentDet.mfgPN,
                  mfgPN: componentDet.mfgPN,
                  isCustom: componentDet.isCustom ? true : false,
                  programingRequired: componentDet.programingRequired ? 'Yes' : 'No',
                  driverToolRequired: componentDet.driverToolRequired ? 'Yes' : 'No',
                  matingPartRquired: componentDet.matingPartRquired ? 'Yes' : 'No',
                  functionalTestingRequired: componentDet.functionalTestingRequired ? 'Yes' : 'No',
                  isBase: vm.partDetail && componentDet.id === vm.partDetail.id ? true : false,
                  restrictionSettings: componentDet.restrictUSEwithpermission ? CORE.PartRestrictionSettings[0].Name :
                    (componentDet.restrictPackagingUseWithpermission ? CORE.PartRestrictionSettings[1].Name :
                      (componentDet.restrictUsePermanently ? CORE.PartRestrictionSettings[2].Name :
                        (componentDet.restrictPackagingUsePermanently ? CORE.PartRestrictionSettings[3].Name : ''))),
                  packagingAliasParts: []
                };

                if (partDetail.packaginggroupID) {
                  componentList.forEach((detail) => {
                    const packagingPartDet = {
                      mfgCode: BaseService.getMfgCodeNameFormat(detail.packgingMfcmfgCode, detail.packgingMfcmfgName),
                      componentID: detail.componentID,
                      displayMfgPN: detail.packgingmfgPN,
                      mfgPN: detail.packgingmfgPN,
                      isCustom: detail.packgingisCustom ? true : false
                    };
                    partDetail.packagingAliasParts.push(packagingPartDet);
                  });
                }
                vm.addedPackagingAliasList.push(partDetail);
              });

              updateBaseDetail();
              validateAttribute();
            }
            if (vm.autoCompletePackagingAlias) {
              $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const validateAttribute = () => {
        vm.addedPackagingAliasList.forEach((item) => {
          item.mountingMisMatchValue = item.mountingTypeID === vm.partDetail.mountingTypeID ? false : true;
          item.functionalMisMatchValue = item.functionalCategoryID === vm.partDetail.functionalCategoryID ? false : true;
          item.packageCaseMisMatchValue = item.partPackageID === vm.partDetail.partPackageID ? false : true;
          item.rohsStatusMisMatchValue = item.RoHSStatusID === vm.partDetail.RoHSStatusID ? false : true;
          item.connectorTypeMisMatchValue = item.connecterTypeID === vm.partDetail.connecterTypeID ? false : true;
          item.packagingMisMatchValue = item.packagingID === vm.partDetail.packagingID ? false : true;
          item.featureMisMatchValue = item.feature === vm.partDetail.feature ? false : true;
          item.maxiOpTempMisMatchValue = item.maxOperatingTemp === vm.partDetail.maxOperatingTemp ? false : true;
          item.miniOpTempMisMatchValue = item.minOperatingTemp === vm.partDetail.minOperatingTemp ? false : true;
          item.tempCoefficMisMatchValue = item.temperatureCoefficient === vm.partDetail.temperatureCoefficient ? false : true;
          item.tempCoefficUnitMisMatchValue = item.temperatureCoefficientValue === vm.partDetail.temperatureCoefficientValue ? false : true;
          item.tempCoefficValMisMatchValue = item.temperatureCoefficientUnit === vm.partDetail.temperatureCoefficientUnit ? false : true;
          item.pinCountMisMatchValue = item.noOfPosition === vm.partDetail.noOfPosition ? false : true;
          item.noOfRowsMisMatchValue = item.noOfRows === vm.partDetail.noOfRows ? false : true;
          item.pitchUnitMisMatchValue = item.pitch === vm.partDetail.pitch ? false : true;
          item.pitchMatingMisMatchValue = item.pitchMating === vm.partDetail.pitchMating ? false : true;
          item.sizeWidthMisMatchValue = item.width === vm.partDetail.width ? false : true;
          item.sizeLengthMisMatchValue = item.length === vm.partDetail.length ? false : true;
          item.heightMisMatchValue = item.height === vm.partDetail.height ? false : true;
          item.toleranceMisMatchValue = item.tolerance === vm.partDetail.tolerance ? false : true;
          item.voltageMisMatchValue = item.voltage === vm.partDetail.voltage ? false : true;
          item.valueMisMatchValue = item.value === vm.partDetail.value ? false : true;
          item.powerMisMatchValue = item.powerRating === vm.partDetail.powerRating ? false : true;
          item.weightMisMatchValue = item.weight === vm.partDetail.weight ? false : true;
          item.colorMisMatchValue = item.color === vm.partDetail.color ? false : true;
          item.programMisMatchValue = item.programingRequired === vm.partDetail.programingRequired ? false : true;
          item.driveToolsMisMatchValue = item.driverToolRequired === vm.partDetail.driverToolRequired ? false : true;
          item.requireMatingMisMatchValue = item.matingPartRquired === vm.partDetail.matingPartRquired ? false : true;
          item.requirFunctinalTestingValue = item.functionalTestingRequired === vm.partDetail.functionalTestingRequired ? false : true;
          item.restrictionSettingsValue = item.restrictUSEwithpermission === vm.partDetail.restrictUSEwithpermission &&
            item.restrictPackagingUseWithpermission === vm.partDetail.restrictPackagingUseWithpermission &&
            item.restrictUsePermanently === vm.partDetail.restrictUsePermanently &&
            item.restrictPackagingUsePermanently === vm.partDetail.restrictPackagingUsePermanently ? false : true;

          if (item.functionalMisMatchValue || item.mountingMisMatchValue || item.rohsStatusMisMatchValue || item.connectorTypeMisMatchValue || item.packageCaseMisMatchValue
            || item.packagingMisMatchValue || item.featureMisMatchValue || item.maxiOpTempMisMatchValue || item.miniOpTempMisMatchValue || item.tempCoefficMisMatchValue
            || item.tempCoefficUnitMisMatchValue || item.tempCoefficValMisMatchValue || item.pinCountMisMatchValue || item.noOfRowsMisMatchValue || item.pitchUnitMisMatchValue
            || item.pitchMatingMisMatchValue || item.sizeWidthMisMatchValue || item.sizeLengthMisMatchValue
            || item.heightMisMatchValue || item.toleranceMisMatchValue || item.voltageMisMatchValue || item.valueMisMatchValue
            || item.powerMisMatchValue || item.weightMisMatchValue || item.colorMisMatchValue) {
            item.misMatchValue = true;
          } else {
            item.misMatchValue = false;
          };
        });
      };

      if (vm.partDetail && (vm.partDetail.functionalCategoryID !== null || vm.partDetail.functionalCategoryID !== undefined)) {
        vm.getComponentAlternatePnValidations(vm.partDetail.functionalCategoryID);
        getComponentPackagingAliasDetail(vm.partDetail.id);
      }

      vm.clearColumnSearch = () => {
        vm.columnName = '';
      };
      // Select ALL Record for Update Attribute
      vm.changeSelectAll = () => {
        _.each(vm.addedPackagingAliasList, (item) => {
          item.isChecked = vm.selectAll;
        });
        vm.selectAll = vm.addedPackagingAliasList.some((item) => !item.isChecked) ? false : true;
        vm.selectedPackagingPart = vm.addedPackagingAliasList.filter((item) => item.isChecked);
      };

      // Select individual Record for Update Attribute
      vm.selectionChanges = () => {
        vm.selectAll = vm.addedPackagingAliasList.some((item) => !item.isChecked) ? false : true;
        vm.selectedPackagingPart = vm.addedPackagingAliasList.filter((item) => item.isChecked);
      };

      // Set Base Part for compare validation
      vm.setBasePart = (item) => {
        if (vm.addedPackagingAliasList.length === 1) {
          vm.addedPackagingAliasList[0].isBase = true;
          vm.partDetail = vm.addedPackagingAliasList[0];
          return;
        }

        if (item.id !== vm.partDetail.id) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.CONFIRM_ON_CHNAGE_BASE_PART);
          const mfgRedirectURL = BaseService.generateManufacturerDetailRedirectURL(CORE.CUSTOMER_TYPE.MANUFACTURER, item.mfgcodeID, false, true, item.mfgCode);
          const parthyperLink = BaseService.generateComponentRedirectURL(item.id, CORE.MFG_TYPE.MFG, true, item.mfgPN);

          messageContent.message = stringFormat(messageContent.message, `${mfgRedirectURL} ${parthyperLink}`);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (item.functionalCategoryID !== vm.partDetail.functionalCategoryID) {
                vm.getComponentAlternatePnValidations(item.functionalCategoryID);
              }
              vm.partDetail = item;

              vm.addedPackagingAliasList.forEach((partDet) => {
                if (partDet.id !== item.id) {
                  partDet.isBase = false;
                }
              });

              validateAttribute();
            } else {
              item.isBase = !item.isBase;
            }
          }, () => {
            item.isBase = !item.isBase;
          });
        } else if (!item.isBase) {
          item.isBase = true;
        }
      };

      // Refresh All Added Part Detail
      vm.refreshAddedAlias = () => {
        const ids = vm.addedPackagingAliasList.map((a) => a.id);
        vm.addedPackagingAliasList = [];
        getComponentPackagingAliasDetail(ids);
      };
      // Remove All Selected Part Detail
      vm.removeMultiplePart = () => {
        if (vm.selectedPackagingPart && vm.selectedPackagingPart.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Packaging Alias Part', vm.selectedPackagingPart.length);

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.selectedPackagingPart.forEach((row) => {
              const index = vm.addedPackagingAliasList.indexOf(row);
              if (index !== -1) {
                vm.addedPackagingAliasList.splice(index, 1);
              }
            });
            updateBaseDetail();
            vm.selectAll = false;
          }, () => {
            // cancel
          });
        }
      };

      // Get Part base on passed Search Criteria
      function getAliasSearch(searchObj) {
        return ComponentFactory.getComponentMFGAliasPartsSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            _.each(componentAlias.data.data, (item) => {
              item.isIcon = true;
            });
            if (searchObj.id) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // get RoHS List
      function getRoHSList() {
        MasterFactory.getRohsList().query().$promise.then((requirement) => {
          initAutoComplete();
          if (requirement && requirement.data) {
            if (vm.cid) {
              vm.RohsList = requirement.data;
            }
            else {
              vm.RohsList = _.filter(requirement.data, (item) => item.isActive);
            }
          }
          else {
            vm.RohsList = [];
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      getRoHSList();

      // Open Selected Part for Update their Attribute
      const updateAttributePopup = (parts) => {
        const objAttributes = {
          isfromMap: false,
          rowData: parts,
          refComponentId: vm.partDetail.id
        };
        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_CONTROLLER,
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_VIEW,
          event,
          objAttributes).then(() => {
            // success
          }, (data) => {
            if (data) {
              vm.refreshAddedAlias();
              // BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      // Open Individual Part for Update their Attribute
      vm.updatePartsAttributes = () => {
        if (vm.updatePartsAttributesFeature && vm.selectedPackagingPart && vm.selectedPackagingPart.length > 0) {
          updateAttributePopup(vm.selectedPackagingPart);
        }
      };

      // Open Selected Part for Update their Attribute
      vm.updateAttributeDet = (item) => {
        if (vm.updatePartsAttributesFeature) {
          updateAttributePopup([item]);
        }
      };

      // Remove Added part from list
      vm.removeRow = (row) => {
        if (row) {
          const index = vm.addedPackagingAliasList.indexOf(row);
          if (vm.addedPackagingAliasList.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, 'Packaging Alias Part', 1);

            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then(() => {
              vm.addedPackagingAliasList.splice(index, 1);
              updateBaseDetail();
            }, () => {
              // cancel
            });
          }
        }
      };

      const updateBaseDetail = () => {
        const partDetail = vm.addedPackagingAliasList.find((a) => a.isBase);
        if (!partDetail) {
          if (Array.isArray(vm.addedPackagingAliasList) && vm.addedPackagingAliasList.length > 0) {
            vm.addedPackagingAliasList[0].isBase = true;
            if (!vm.partDetail || (vm.addedPackagingAliasList[0].functionalCategoryID !== vm.partDetail.functionalCategoryID)) {
              vm.getComponentAlternatePnValidations(vm.addedPackagingAliasList[0].functionalCategoryID);
            }
            vm.partDetail = vm.addedPackagingAliasList[0];
          } else {
            vm.partDetail = null;
            vm.validationList = [];
          }
        } else {
          vm.partDetail = partDetail;
        }
      };

      vm.editManufacturer = (mfgType, mfgcodeID) => {
        if (mfgType === CORE.MFG_TYPE.DIST) {
          BaseService.goToSupplierDetail(mfgcodeID);
        }
        else {
          BaseService.goToManufacturer(mfgcodeID);
        }
      };
      //redirect to customer list
      vm.goToAliasValidationList = () => {
        BaseService.goToAliasValidationList();
        return false;
      };

      // Listener for Add Packaging Alias Detail
      const onAddPackagingAliasData = $scope.$on('addPackagingAliasData', (event, data) => {
        addAliasPartDetail(data.$mdDialog);
      });

      // start component packaging alias region
      const addAliasPartDetail = (mdDialog) => {
        if (vm.isSaveAlias) {
          return;
        }

        vm.isSaveAlias = true;
        if (vm.addedPackagingAliasList && vm.addedPackagingAliasList.length <= 1) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PACKCAGING_PART_LINE);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
            setFocusByName(vm.autoCompletePackagingAlias.inputName);
          }, () => {
            // cancel
          });
          vm.isSaveAlias = false;
          return;
        }
        const isAnyMisMatch = vm.addedPackagingAliasList.some((a) => a.misMatchValue);
        if (isAnyMisMatch) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.MIS_MATCH_ATTRIBUTE);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
          }, () => {
          });
          vm.isSaveAlias = false;
          return;
        }

        if (vm.partDetail.id === vm.cid) {
          createObjAndAddPackagingAlias(mdDialog);
        } else {
          const partList = vm.addedPackagingAliasList.map((item) => {
            const displayMPN = `${item.displayMfgPN} ${item.componentID === vm.basePartDet.id ? `(${CORE.MESSAGE_CONSTANT.AUTO_COMPLETE_EDIT})` : ''}`;
            const partDet = {
              mfgPN: item.displayMfgPN,
              displayMPN: displayMPN,
              componentID: item.componentID
            };
            return partDet;
          });

          const selectPartDet = {
            partList: partList,
            basePart: vm.partDetail,
            parentDet: vm.basePartDet
          };

          DialogFactory.dialogService(
            USER.CHANGE_BASE_PART_CONFIRMATION_POPUP_CONTROLLER,
            USER.CHANGE_BASE_PART_CONFIRMATION_POPUP_VIEW,
            null, selectPartDet).then((data) => {
              if (data) {
                vm.addedPackagingAliasList.forEach((item) => {
                  item.isBase = item.componentID === data.componentID ? true : false;
                });
                const partDetail = vm.addedPackagingAliasList.find((item) => item.componentID === data.componentID);
                vm.partDetail = partDetail;
                createObjAndAddPackagingAlias(mdDialog);
              }
              vm.isSaveAlias = false;
            }, () => {
              vm.isSaveAlias = false;
            }).catch((error) => {
              vm.isSaveAlias = false;
              return BaseService.getErrorLog(error);
            });
        }
      };

      const createObjAndAddPackagingAlias = (mdDialog) => {
        const excludeBaseParts = vm.addedPackagingAliasList.filter((a) => !a.isBase);
        const componentObj = {
          toPartId: vm.partDetail.id,
          fromPartId: excludeBaseParts.map((a) => a.id).join(','),
          typeId: CORE.ComponentValidationPartType.PackagingAlias,
          returnAllValidation: true
        };
        return $scope.$parent.vm.cgBusyLoading = ComponentFactory.checkAlternateAliasValidations().query(componentObj).$promise.then((res) => {
          vm.isSaveAlias = false;
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            if (Array.isArray(res.data) && res.data.length > 0) {
              res.data.forEach((detail) => {
                const partDetail = vm.addedPackagingAliasList.find((a) => a.id === detail.partId);
                Object.assign(detail, partDetail);
              });
              DialogFactory.dialogService(
                CORE.PACKAGINAG_ALIAS_VALIDATION_POPUP_CONTROLLER,
                CORE.PACKAGINAG_ALIAS_VALIDATION_POPUP_VIEW,
                event,
                res.data).then(() => {
                }, () => {
                });
            }
          } else {
            addBulkPackagingAlias(mdDialog);
          }
        }).catch(() => false);
        //let copyPartDetail = '';
        //const filterPackagingGroup = vm.addedPackagingAliasList.filter((a) => a.packaginggroupID && !a.isBase);
        //const addedPackagingAliasIds = _.groupBy(filterPackagingGroup, 'packaginggroupID');
        //const countPackgingGroup = Object.keys(addedPackagingAliasIds).length;
        //if (!vm.partDetail.packaginggroupID && countPackgingGroup >= 1) {
        //  const packaginggroupDet = _.maxBy(vm.addedPackagingAliasList, 'packaginggroupID');
        //  copyPartDetail = vm.addedPackagingAliasList.find((a) => a.packaginggroupID === packaginggroupDet.packaginggroupID);
        //} else {
        //  copyPartDetail = vm.partDetail;
        //}

        //const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PACKCAGING_ALIAS_PART_CONFIRMATION);
        //messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(copyPartDetail.id, copyPartDetail.mfgPN));
        //const obj = {
        //  messageContent: messageContent,
        //  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        //  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        //};

        //DialogFactory.messageConfirmDialog(obj).then((yes) => {
        //  if (yes) {
        //    const excludeBaseParts = vm.addedPackagingAliasList.filter((a) => !a.isBase);
        //    const componentObj = {
        //      toPartId: vm.partDetail.id,
        //      fromPartId: excludeBaseParts.map((a) => a.id).join(','),
        //      typeId: CORE.ComponentValidationPartType.PackagingAlias,
        //      returnAllValidation: true
        //    };
        //    return $scope.$parent.vm.cgBusyLoading = ComponentFactory.checkAlternateAliasValidations().query(componentObj).$promise.then((res) => {
        //      vm.isSaveAlias = false;
        //      if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
        //        if (Array.isArray(res.data) && res.data.length > 0) {
        //          res.data.forEach((detail) => {
        //            const partDetail = vm.addedPackagingAliasList.find((a) => a.id === detail.partId);
        //            Object.assign(detail, partDetail);
        //          });
        //          DialogFactory.dialogService(
        //            CORE.PACKAGINAG_ALIAS_VALIDATION_POPUP_CONTROLLER,
        //            CORE.PACKAGINAG_ALIAS_VALIDATION_POPUP_VIEW,
        //            event,
        //            res.data).then(() => {
        //            }, () => {
        //            });
        //        }
        //      } else {
        //        addBulkPackagingAlias(mdDialog);
        //      }
        //    }).catch(() => false);
        //  } else {
        //    vm.isSaveAlias = false;
        //  }
        //}, () => {
        //  vm.isSaveAlias = false;
        //  // Cancel
        //});
      };

      vm.updatePartsSingleAttributes = (attributeName) => {
        if (vm.updatePartsAttributesFeature) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.UPDATE_SINGLE_ATTRIBUTE_CONFRIMATION);
          messageContent.message = stringFormat(messageContent.message, attributeName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              updatePartAttributeDet(attributeName);
            }
          }, () => {
          });
        }
      };

      function updatePartAttributeDet(attributeName) {
        const basePartDet = vm.addedPackagingAliasList.find((a) => a.isBase);
        const updateComponentInfo = {};
        updateComponentInfo.ids = vm.addedPackagingAliasList.filter((obj) => !obj.isBase).map((obj) => obj.id);
        updateComponentInfo.data = {};
        let fieldName = '';
        switch (attributeName) {
          case vm.LabelConstant.PartAttribute.FunctionalType:
            fieldName = 'functionalCategoryID';
            break;
          case vm.LabelConstant.PartAttribute.MountingType:
            fieldName = 'mountingTypeID';
            break;
          case vm.LabelConstant.PartAttribute.RoHSStatus:
            fieldName = 'RoHSStatusID';
            break;
          case vm.LabelConstant.PartAttribute.ConnectorType:
            fieldName = 'connecterTypeID';
            break;
          case vm.LabelConstant.PartAttribute.Package:
            fieldName = 'partPackageID';
            break;
          case vm.LabelConstant.MFG.Packaging:
            fieldName = 'packagingID';
            break;
          case vm.LabelConstant.PartAttribute.Feature:
            fieldName = 'feature';
            break;
          case vm.LabelConstant.PartAttribute.MinOperatingTemp:
            fieldName = 'minOperatingTemp';
            break;
          case vm.LabelConstant.PartAttribute.MaxOperatingTemp:
            fieldName = 'maxOperatingTemp';
            break;
          case vm.LabelConstant.PartAttribute.TempCoefficient:
            fieldName = 'temperatureCoefficient';
            break;
          case vm.LabelConstant.PartAttribute.TempCoefficientUnit:
            fieldName = 'temperatureCoefficientUnit';
            break;
          case vm.LabelConstant.PartAttribute.TempCoefficientValue:
            fieldName = 'temperatureCoefficientValue';
            break;
          case vm.LabelConstant.PartAttribute.noOfPosition:
            fieldName = 'noOfPosition';
            break;
          case vm.LabelConstant.PartAttribute.NoOfRows:
            fieldName = 'noOfRows';
            break;
          case vm.LabelConstant.PartAttribute.Pitch:
            fieldName = 'pitch';
            break;
          case vm.LabelConstant.PartAttribute.PitchMating:
            fieldName = 'pitchMating';
            break;
          case vm.LabelConstant.PartAttribute.SizeDimensionLength:
            fieldName = 'length';
            break;
          case vm.LabelConstant.PartAttribute.SizeDimensionWidth:
            fieldName = 'width';
            break;
          case vm.LabelConstant.PartAttribute.Height:
            fieldName = 'height';
            break;
          case vm.LabelConstant.PartAttribute.Tolerance:
            fieldName = 'tolerance';
            break;
          case vm.LabelConstant.PartAttribute.Voltage:
            fieldName = 'voltage';
            break;
          case vm.LabelConstant.PartAttribute.Value:
            fieldName = 'value';
            break;
          case vm.LabelConstant.PartAttribute.PowerWatts:
            fieldName = 'powerRating';
            break;
          case vm.LabelConstant.PartAttribute.Weight:
            fieldName = 'weight';
            break;
          case vm.LabelConstant.PartAttribute.Color:
            fieldName = 'color';
            break;
        };

        updateComponentInfo.data[fieldName] = basePartDet[fieldName];
        updateComponentInfo.ids = vm.addedPackagingAliasList.filter((obj) => !obj.isBase && obj[fieldName] !== basePartDet[fieldName]).map((obj) => obj.id);

        vm.cgBusyLoading = ComponentFactory.updateComponentAttributes().query({ updateComponentInfo: updateComponentInfo }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.refreshAddedAlias();
          } else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
            updateComponentReturnResponse(res, attributeName);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      /**
      * Perform operation according Validation response return from (Validation/Update Part API)
      * @param {any} res - API response (Validation API/Update Part)
      */
      function updateComponentReturnResponse(res, attributeName) {
        if (res.errors && res.errors.data && res.errors.data.assemblyList) {
          DialogFactory.dialogService(
            USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
            USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
            null,
            res.errors.data.assemblyList
          ).then((activityPopupResDetail) => {
            if (activityPopupResDetail && activityPopupResDetail.continueSave) {
              updatePartAttributeDet(attributeName);
            }
          }, () => {
            // cancel
          });
        }
      };
      // Save added packaging Alias
      const addBulkPackagingAlias = (mdDialog) => {
        const excludeBaseParts = vm.addedPackagingAliasList.filter((a) => !a.isBase);
        const componentInfo = {
          parentComponentID: vm.partDetail.id,
          parentPackaginggroupID: vm.partDetail.packaginggroupID,
          addedPackagingAliasList: excludeBaseParts
        };
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.addBulkPackagingAlias().query(componentInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            if (res.data && res.data.assemblyList) {
              DialogFactory.dialogService(
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
                null,
                res.data.assemblyList
              ).then(() => {
                // success
              }, () => {
                // calcel
              });
            }
            else {
              if (mdDialog) {
                mdDialog.hide();
              }
            }
          }
          else {
            $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Create Redirect Link Contain
      //const redirectToPartDetail = (pId, pMfrPN) => {
      //  const redirectToPartUrl = BaseService.generateComponentRedirectURL(pId, CORE.MFG_TYPE.MFG);
      //  return BaseService.getHyperlinkHtml(redirectToPartUrl, pMfrPN);
      //};

      /* Open popup for display history of entry change */
      vm.showVersionHistory = (row, componentId, ev) => {
        BaseService.showVersionHistory(row, componentId, ev);
      };

      $scope.$on('$destroy', () => {
        onAddPackagingAliasData();
      });
    }
  }
})();

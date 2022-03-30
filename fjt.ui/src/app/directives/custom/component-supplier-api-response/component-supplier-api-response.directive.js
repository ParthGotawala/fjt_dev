(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentSupplierApiResponse', componentSupplierApiResponse);

  /** @ngInject */
  function componentSupplierApiResponse($q, $sce, $state, CORE, USER, DialogFactory, PRICING, BaseService, PricingFactory, ManufacturerFactory, RFQSettingFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '=?',
        mfgPn: '=?',
        supplierPn: '=?',
        supplier: '=?',
        mfgType: '=?',
        mfgCodeId: '=?',
        packagingId: '=?',
        isSupplier: '=?'
      },
      templateUrl: 'app/directives/custom/component-supplier-api-response/component-supplier-api-response.html',
      controller: componentSupplierApiResponseCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentSupplierApiResponseCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.isSupplier = $scope.isSupplier;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.customprice = false;
      vm.partno = $scope.mfgPn;
      vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
      vm.mfgType = $scope.mfgType ? $scope.mfgType.toUpperCase() : null;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_SUPPLIER_API_RESPONSE;
      vm.noDataFound = false;
      vm.supplierName = "";

      let getSupplierApi = (item) => {
        vm.noDataFound = false;
        if (!item) {
          vm.apiurl = "";
          vm.response = undefined;
        }
      }
      //get data for mfgcode
      vm.getSupplierCode = () => {
        var searchObj = {
          mfgType: CORE.MFG_TYPE.DIST,
          isCodeFirst: true,
          isPricingApi: true
        };

        return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.SupplierList = [];
          if (mfgcodes && mfgcodes.data) {
            vm.SupplierList = mfgcodes.data;
          }
          return $q.resolve(vm.SupplierList);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      function getPackagingTypeSearch() {
        vm.packagingTypeList = [];
        if ($scope.packagingId) {
          var searchObj = {
            id: $scope.packagingId
          };
          return RFQSettingFactory.getPackagingTypeList().query(searchObj).$promise.then((packagingtype) => {
            if (packagingtype && packagingtype.data) {
              vm.packagingTypeList = _.first(packagingtype.data);
              return packagingtype.data;
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else {
          return null;
        }
      }

      //Initialize auto complete for pricing APIs
      let initAutoComplete = () => {
        vm.autoCompletePricingDist = {
          columnName: 'mfgCodeName',
          keyColumnName: 'mfgCode',
          keyColumnId: $scope.supplier ? $scope.supplier : PRICING.SUPPLIER_CODE.DigiKey.Code,
          inputName: 'Supplier',
          placeholderName: 'Supplier',
          isRequired: true,
          isAddnew: false,
          callbackFn: vm.getSupplierCode,
          onSelectCallbackFn: getSupplierApi
        }
      }

      var autocompletePromise = [vm.getSupplierCode(), getMfgDetail(), getPackagingTypeSearch()];
      $scope.$parent.vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        initAutoComplete();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });


      function getMfgDetail() {
        let mfgInfo = {
          id: $scope.mfgCodeId
        };
        return ManufacturerFactory.retriveMfgCode(mfgInfo).query({ id: $scope.mfgCodeId, refTableName: CORE.TABLE_NAME.MFG_CODE_MST }).$promise.then((response) => {
          vm.mfgCodeDetails = (response && response.data) ? response.data : [];
          return $q.resolve(response);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //open pop up for digikey verification code
      vm.verfiyDigikey = (ev, clientID, appID) => {
        var data = {
          clientID: clientID,
          appID: appID ? appID : PRICING.APP_DK_TYPE.FJTScheduleForPartUpdate,
          isNewVersion: appID ? true : false
        };
        DialogFactory.dialogService(
          CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
          CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (err) => {
          });
      }

      //get partnumber pricing detail for digikey api
      let getDigikeyPricingV3 = () => {
        let listObj = {
          partNo: vm.partno,
          isCustom: vm.customprice
        }

        $scope.$parent.vm.cgBusyLoading = PricingFactory.getPartDetailVersion3().query({ pricingObj: listObj }).$promise.then((res) => {
          if (res && res.data) {
            vm.apiurl = PRICING.DigikeyPartApiV3;
            vm.jsonresponse = JSON.stringify(res.data.digikey);
            vm.extAPIresponse = res.data.digikey;
            vm.response = undefined;
            if (vm.extAPIresponse.StatusCode == PRICING.ERR_AUTH) {
              vm.response = vm.extAPIresponse;
              let event = angular.element.Event('click');
              angular.element('body').trigger(event);
              vm.verfiyDigikey(event, res.data.DigiKeyClientID, res.data.appID);
            }
            else if (vm.extAPIresponse.ExactManufacturerProductsCount) {
              if (vm.mfgCodeDetails) {

                //code to select part which match with Mfr
                if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                  _.each(vm.extAPIresponse.ExactManufacturerProducts, (dkPart) => {
                    if (!vm.response) {
                      let packagingDet = {};
                      if (Array.isArray(dkPart.Parameters) && dkPart.Parameters.length > 0 && dkPart.Packaging) {
                        packagingDet = dkPart.Parameters.find(a => a.Parameter === dkPart.Packaging.Parameter);
                      }
                      if ((dkPart.Manufacturer.Value &&
                        _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': dkPart.Manufacturer.Value.toUpperCase() }) &&
                        (vm.packagingTypeList.Component_Fields_Genericalias_Mst &&
                          vm.packagingTypeList &&
                        _.some(vm.packagingTypeList.Component_Fields_Genericalias_Mst, { 'alias': packagingDet.Value })) &&
                        dkPart.ManufacturerPartNumber == vm.partno)) {
                        vm.response = dkPart;
                      }
                      else {
                        if (!vm.response && dkPart.AlternatePackaging && dkPart.AlternatePackaging.length) {
                          _.each(dkPart.AlternatePackaging, (dkAlternatePart) => {
                            if (!vm.response) {
                              if (dkAlternatePart.Manufacturer.Value &&
                                _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': dkAlternatePart.Manufacturer.Value.toUpperCase() }) &&
                                (vm.packagingTypeList.Component_Fields_Genericalias_Mst &&
                                  vm.packagingTypeList &&
                                  _.some(vm.packagingTypeList.Component_Fields_Genericalias_Mst, { 'alias': dkAlternatePart.Packaging.Value })) &&
                                dkAlternatePart.ManufacturerPartNumber == vm.partno) {
                                vm.response = dkAlternatePart;
                              }
                            }
                          });
                        }
                      }
                    }
                  });
                }
                else {
                  _.each(vm.extAPIresponse.Products, (dkPart) => {
                    if (!vm.response) {
                      if (dkPart.DigiKeyPartNumber == $scope.supplierPn) {
                        vm.response = dkPart;
                      }
                    }
                  });
                }
              }
              else {
                vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
              }
            }
          }
          else {
            var model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: res.errors.Message,
              multiple: false
            };
            DialogFactory.alertDialog(model);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //get partnumber pricing detail for avnet api
      let AventApiPricing = () => {
        var mfgpartno = vm.partno.replace(/ /g, '');
        mfgpartno = encodeURIComponent(mfgpartno);
        let listObj = {
          partNo: mfgpartno,
          isCustom: vm.customprice
        }

        $scope.$parent.vm.cgBusyLoading = PricingFactory.getAvnetPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
          vm.apiurl = PRICING.AvnetPartApi;
          vm.jsonresponse = res.data;
          vm.extAPIresponse = res.data ? JSON.parse(res.data) : {};
          if (vm.extAPIresponse && vm.extAPIresponse.productDetails && vm.extAPIresponse.productDetails.length) {
            vm.response = undefined;

            if (vm.mfgCodeDetails) {
              //code to select part which match with Mfr
              _.each(vm.extAPIresponse.productDetails, (avPart) => {
                if (!vm.response) {
                  //mfr part
                  if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                    if (avPart.manufacturerName &&
                      _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': avPart.manufacturerName.toUpperCase() }) &&
                      (vm.packagingTypeList.Component_Fields_Genericalias_Mst &&
                        vm.packagingTypeList &&
                        _.some(vm.packagingTypeList.Component_Fields_Genericalias_Mst, { 'alias': avPart.packageTypeCode })) &&
                      avPart.mfPartNumber == mfgpartno) {
                      vm.response = avPart;
                    }
                  }
                  //supplier part
                  else {
                    if (avPart.supplierPartNumber == $scope.supplierPn) {
                      vm.response = avPart;
                    }
                  }
                }
              });
            }
            else {
              vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      //get partnumber pricing detail for newark api
      let NewarkApiPricing = () => {
        var mfgpartno = vm.partno.replace(/ /g, '');
        mfgpartno = encodeURIComponent(mfgpartno);
        let listObj = {
          partNo: mfgpartno,
          isCustom: vm.customprice
        }

        $scope.$parent.vm.cgBusyLoading = PricingFactory.getNewarkPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
          vm.apiurl = PRICING.NewarkPartApi;
          vm.jsonresponse = res.data;
          var result = false;
          try {
            JSON.parse(res.data);
            result = true;
          }
          catch (e) {
            result = false;
          }
          if (result) {
            vm.extAPIresponse = JSON.parse(res.data);
            vm.response = undefined;
            if (vm.extAPIresponse &&
              vm.extAPIresponse.manufacturerPartNumberSearchReturn &&
              vm.extAPIresponse.manufacturerPartNumberSearchReturn.numberOfResults) {

              if (vm.mfgCodeDetails) {
                //code to select part which match with Mfr
                _.each(vm.extAPIresponse.manufacturerPartNumberSearchReturn.products, (nwPart) => {
                  if (!vm.response) {
                    //mfg part
                    if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                      if (nwPart.brandName &&
                        _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': nwPart.brandName.toUpperCase() }) &&
                        nwPart.translatedManufacturerPartNumber == mfgpartno) {
                        vm.response = nwPart;
                      }
                    }
                    //supplier part
                    else {
                      if (nwPart.sku == $scope.supplierPn) {
                        vm.response = nwPart;
                      }
                    }
                  }
                });
              }
              else {
                vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
              }

            }
          }
          else
            vm.response = PRICING.NewarkMessage;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      //get partnumber pricing detail for mouser api
      let MouserApiPricing = () => {
        let listObj = {
          partNo: vm.partno,
        }

        $scope.$parent.vm.cgBusyLoading = PricingFactory.getMouserPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
          vm.apiurl = PRICING.MouserPartApi;
          var response = JSON.parse(res.data);
          vm.jsonresponse = res.data;
          vm.extAPIresponse = response && (response['soap:Envelope']) ? (response['soap:Envelope'])['soap:Body'] : "";
          vm.response = undefined;
          if (vm.extAPIresponse &&
            vm.extAPIresponse.SearchByPartNumberResponse &&
            vm.extAPIresponse.SearchByPartNumberResponse.SearchByPartNumberResult &&
            vm.extAPIresponse.SearchByPartNumberResponse.SearchByPartNumberResult.Parts &&
            vm.extAPIresponse.SearchByPartNumberResponse.SearchByPartNumberResult.Parts.MouserPart) {

            if (vm.mfgCodeDetails) {
              if (vm.extAPIresponse.SearchByPartNumberResponse.SearchByPartNumberResult.NumberOfResult._text > 1) {
                vm.extAPIresponse = vm.extAPIresponse.SearchByPartNumberResponse.SearchByPartNumberResult.Parts.MouserPart;
              }
              else {
                vm.extAPIresponse = vm.extAPIresponse.SearchByPartNumberResponse.SearchByPartNumberResult.Parts;
              }
              //code to select part which match with Mfr
              _.each(vm.extAPIresponse, (moPart) => {
                if (!vm.response) {
                  //mfg part
                  if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                    if (moPart.Manufacturer._text &&
                      _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': moPart.Manufacturer._text.toUpperCase() }) &&
                      moPart.ManufacturerPartNumber._text == vm.partno) {
                      let packaging = undefined;
                      try {
                        packaging = _.find(moPart.ProductAttributes.ProductAttribute, (item) => { return item.AttributeName._text == PRICING.SUPPLIER_CODE.Mouser.PackagingAttributeName });
                      } catch (err) {
                        packaging = undefined;
                      }
                      if ($scope.packagingId && moPart.ProductAttributes && packaging) {
                        _.each(moPart.ProductAttributes.ProductAttribute, (item) => {
                          if (_.some(vm.packagingTypeList.Component_Fields_Genericalias_Mst, { 'alias': item.AttributeValue._text })) {
                            vm.response = moPart;
                          }
                        });
                      }
                      else {
                        vm.response = moPart;
                      }
                    }
                  }
                  //Supplier part
                  else {
                    if (moPart.MouserPartNumber && moPart.MouserPartNumber._text == $scope.supplierPn) {
                      vm.response = moPart;
                    }
                  }
                }
              });
            }
            else {
              vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
            }

          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //get partnumber pricing detail for arrow api
      let ArrowApiPricing = () => {
        var mfgpartno = vm.partno.replace(/ /g, '');
        mfgpartno = encodeURIComponent(mfgpartno);
        let listObj = {
          partNo: mfgpartno,
        }

        $scope.$parent.vm.cgBusyLoading = PricingFactory.getArrowPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
          vm.apiurl = PRICING.ArrowPartApi;
          vm.jsonresponse = res.data;
          vm.extAPIresponse = (JSON.parse(res.data)).itemserviceresult.data;
          if (vm.extAPIresponse && vm.extAPIresponse[0].PartList && vm.extAPIresponse[0].PartList.length) {
            vm.response = undefined;
            if (vm.mfgCodeDetails) {
              //code to select part which match with Mfr
              _.each(vm.extAPIresponse[0].PartList, (arPart) => {
                if (!vm.response) {
                  //MFG Parts
                  if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                    if (arPart.manufacturer.mfrName &&
                      _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': arPart.manufacturer.mfrName.toUpperCase() }) &&
                      arPart.partNum == mfgpartno) {
                      vm.response = arPart;
                    }
                  }
                  else {
                    //Supplier Parts
                    if (arPart.InvOrg && arPart.InvOrg.sources) {
                      _.each(arPart.InvOrg.sources, (arSupplierPart) => {
                        if (arSupplierPart.sourceCd == PRICING.SUPPLIER_CODE.Arrow.PriceOrigin) {
                          _.each(arSupplierPart.sourceParts, (item) => {
                            if (!vm.response) {
                              if (item.sourcePartId == $scope.supplierPn) {
                                vm.response = item;
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                }
              });
            }
            else {
              vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      //get partnumber pricing detail for TTI api
      let TTIApiPricing = () => {
        var mfgpartno = vm.partno.replace(/ /g, '');
        mfgpartno = encodeURIComponent(mfgpartno);
        let listObj = {
          partNo: mfgpartno,
        }
        $scope.$parent.vm.cgBusyLoading = PricingFactory.getTTIPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
          vm.apiurl = PRICING.TTIPartApi;
          vm.jsonresponse = res.data;
          vm.extAPIresponse = (JSON.parse(res.data));
          vm.response = undefined;

          if (vm.mfgCodeDetails) {
            //code to select part which match with Mfr
            _.each(vm.extAPIresponse.records, (ttiPart) => {
              if (!vm.response) {
                if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                  if (ttiPart.mfgLongname &&
                    _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': ttiPart.mfgLongname.toUpperCase() }) &&
                    (vm.packagingTypeList.Component_Fields_Genericalias_Mst &&
                      vm.packagingTypeList &&
                      _.some(vm.packagingTypeList.Component_Fields_Genericalias_Mst, { 'alias': ttiPart.packaging })) &&
                    ttiPart.mfrPartNumber == mfgpartno) {
                    vm.response = ttiPart;
                  }
                }
                else {
                  if (ttiPart.ttiPartsNumber == $scope.supplierPn) {
                    vm.response = ttiPart;
                  }
                }
              }
            });
          }
          else {
            vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
          }

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      const getHelindPrice = () => {
        var mfgpartno = vm.partno.replace(/ /g, '');
        mfgpartno = encodeURIComponent(mfgpartno);
        const listObj = {
          partNo: mfgpartno
        };
        $scope.$parent.vm.cgBusyLoading = PricingFactory.getHeilindPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
          vm.apiurl = PRICING.HeilindPartApi;
          vm.jsonresponse = res.data;
          vm.extAPIresponse = res.data ? JSON.parse(res.data) : {};
          vm.response = undefined;
          if (vm.mfgCodeDetails) {
            //code to select part which match with Mfr
            _.each(vm.extAPIresponse.items, (heilindPart) => {
              if (!vm.response) {
                if (vm.mfgType == CORE.MFG_TYPE.MFG) {
                  if (heilindPart.mfg_desc &&
                    _.some(vm.mfgCodeDetails.mfgCodeAlias, { 'alias': heilindPart.mfg_desc.toUpperCase() }) &&
                    heilindPart.mfg_part == mfgpartno) {
                    vm.response = heilindPart;
                  }
                }
                else {
                  if (heilindPart.disty_part == $scope.supplierPn) {
                    vm.response = heilindPart;
                  }
                }
              }
            });
          }
          else {
            vm.response = vm.extAPIresponse.ExactManufacturerProducts[0];
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      //get pricing detail from server according selected pricing apis.
      vm.getpricingDetails = function (supplierCode) {
        vm.response = undefined;
        vm.noDataFound = true;
        if (supplierCode === PRICING.SUPPLIER_CODE.Arrow.Code) {
          ArrowApiPricing();
          vm.supplierName = PRICING.SUPPLIER_CODE.Arrow.Name;
        }
        else if (supplierCode === PRICING.SUPPLIER_CODE.Avnet.Code) {
          AventApiPricing();
          vm.supplierName = PRICING.SUPPLIER_CODE.Avnet.Name;
        }
        else if (supplierCode === PRICING.SUPPLIER_CODE.Mouser.Code) {
          MouserApiPricing();
          vm.supplierName = PRICING.SUPPLIER_CODE.Mouser.Name;
        }
        else if (supplierCode === PRICING.SUPPLIER_CODE.Newark.Code) {
          NewarkApiPricing();
          vm.supplierName = PRICING.SUPPLIER_CODE.Newark.Name;
        }
        else if (supplierCode === PRICING.SUPPLIER_CODE.TTI.Code) {
          TTIApiPricing();
          vm.supplierName = PRICING.SUPPLIER_CODE.TTI.Name;
        }
        else if (supplierCode === PRICING.SUPPLIER_CODE.DigiKey.Code) {
          getDigikeyPricingV3();
          vm.supplierName = PRICING.SUPPLIER_CODE.DigiKey.Name;
        } else if (supplierCode === PRICING.SUPPLIER_CODE.HEILIND.Code) {
          getHelindPrice();
          vm.supplierName = PRICING.SUPPLIER_CODE.HEILIND.Name;
        }
      };
    }
  }
})();

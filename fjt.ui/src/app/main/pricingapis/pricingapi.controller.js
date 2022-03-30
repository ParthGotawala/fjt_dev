(function () {
  'use strict';

  angular
    .module('app.pricing')
    .controller('PricingApiController', PricingApiController);

  /** @ngInject */
  function PricingApiController(PRICING, CORE, BaseService, PricingFactory, DialogFactory, EnterpriseSearchFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.SupplierList = PRICING.SUPPLIER_NAME;
    vm.customprice = false;
    const getSupplierApi = (item) => {
      if (!item) {
        vm.apiurl = '';
        vm.response = '';
      }
    };

    /* get listof all pages */
    const getPartDetail = (obj) => {
      const params = {
        PageIndex: 0,
        PageSize: 100000,
        SearchQuery: obj.searchquery,
        Type: 'ea207cab-cbec-4191-b9f8-ec10d8f95f6c',
        SearchModel: null
      };

      return EnterpriseSearchFactory.retriveTypeWise().query(params).$promise.then((response) => {
        if (response && response.model) {
          const filterDataList = _.map(response.model.results,(item)=>{
            return{
              title: item.title ? htmlToPlaintext(item.title).replace('Part ', '') : '',
              id: item.id
            };
          });
          return filterDataList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Initalize auto complete for pricing apis
    const initAutoComplete = () => {
      vm.autoCompletePricingDist = {
        columnName: 'Name',
        keyColumnName: 'Value',
        keyColumnId: null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getSupplierApi
      };
      vm.autoCompletePart = {
        columnName: 'title',
        keyColumnName: 'id',
        keyColumnId: 'id',
        inputName: 'title',
        placeholderName: 'AssyID/PID',
        isRequired: false,
        isAddnew: false,
        callbackFn: getPartDetail,
        onSelectCallbackFn: (item) => {
          if (item) {
            $timeout(() => {
              $scope.$broadcast(vm.autoCompletePart.inputName + "searchText", null);
            });
            vm.autoCompletePart.keyColumnId = null;
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchquery: query
          };
          return getPartDetail(searchObj);
        }
      };
    };
    initAutoComplete();

    //open popup for digikey verification code
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
        }, () => {
        });
    };

    //get partnumber pricing detail for digikey api
    const getDigikeyPricingV3 = () => {
      const listObj = {
        partNo: vm.partno,
        isCustom: vm.customprice
      };
      vm.cgBusyLoading = PricingFactory.getPartDetailVersion3().query({ pricingObj: listObj }).$promise.then((res) => {
        if (res && res.data) {
          vm.apiurl = PRICING.DigikeyPartApiV3;
          vm.jsonresponse = JSON.stringify(res.data.digikey);
          vm.response = res.data.digikey;
          if (vm.response.StatusCode == PRICING.ERR_AUTH) {
            const event = angular.element.Event('click');
            angular.element('body').trigger(event);
            vm.verfiyDigikey(event, res.data.DigiKeyClientID, res.data.appID);
          }
        }
        else {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: res.errors.Message,
            multiple: false
          };
          DialogFactory.alertDialog(model);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for avnet api
    const AventApiPricing = () => {
      var mfgpartno = vm.partno.replace(/ /g, '');
      mfgpartno = encodeURIComponent(mfgpartno);
      const listObj = {
        partNo: mfgpartno,
        isCustom: vm.customprice
      };
      vm.cgBusyLoading = PricingFactory.getAvnetPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.AvnetPartApi;
        vm.jsonresponse = res.data;
        vm.response = res.data ? JSON.parse(res.data) : {};
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for avnet api
    const HeilindApiPricing = () => {
      var mfgpartno = vm.partno.replace(/ /g, '');
      mfgpartno = encodeURIComponent(mfgpartno);
      const listObj = {
        partNo: mfgpartno,
        isCustom: vm.customprice
      };
      vm.cgBusyLoading = PricingFactory.getHeilindPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.HeilindPartApi;
        vm.jsonresponse = res.data;
        vm.response = res.data ? JSON.parse(res.data) : {};
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for newark api
    const NewarkApiPricing = () => {
      var mfgpartno = vm.partno.replace(/ /g, '');
      mfgpartno = encodeURIComponent(mfgpartno);
      const listObj = {
        partNo: mfgpartno,
        isCustom: vm.customprice
      };
      vm.cgBusyLoading = PricingFactory.getNewarkPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.NewarkPartApi;
        vm.jsonresponse = res.data;
        let result = false;
        try {
          JSON.parse(res.data);
          result = true;
        }
        catch (e) {
          result = false;
        }
        if (result) {
          vm.response = JSON.parse(res.data);
        }
        else {
          vm.response = PRICING.NewarkMessage;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get partnumber pricing detail for mouser api
    const MouserApiPricing = () => {
      const listObj = {
        partNo: vm.partno
      };
      vm.cgBusyLoading = PricingFactory.getMouserPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.MouserSOAPPartApi;
        const response = JSON.parse(res.data);
        vm.jsonresponse = res.data;
        vm.response = response && (response['soap:Envelope']) ? (response['soap:Envelope'])['soap:Body'] : '';
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for mouser json api
    const MouserJSONApiPricing = () => {
      const listObj = {
        partNo: vm.partno
      };
      vm.cgBusyLoading = PricingFactory.getMouserJsonPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.MouserJSONPartAPI;
        vm.jsonresponse = res.data;
        vm.response = JSON.parse(res.data);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for arrow api
    const ArrowApiPricing = () => {
      var mfgpartno = vm.partno.replace(/ /g, '');
      mfgpartno = encodeURIComponent(mfgpartno);
      const listObj = {
        partNo: mfgpartno
      };
      vm.cgBusyLoading = PricingFactory.getArrowPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.ArrowPartApi;
        vm.jsonresponse = res.data;
        vm.response = (JSON.parse(res.data)).itemserviceresult.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for TTI api
    const TTIApiPricing = () => {
      var mfgpartno = vm.partno.replace(/ /g, '');
      mfgpartno = encodeURIComponent(mfgpartno);
      const listObj = {
        partNo: mfgpartno
      };
      vm.cgBusyLoading = PricingFactory.getTTIPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.TTIPartApi;
        vm.jsonresponse = res.data;
        vm.response = (JSON.parse(res.data));
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get partnumber pricing detail for Octo Part api
    const OctoPartApiPricing = () => {
      var mfgpartno = vm.partno.replace(/ /g, '');
      const listObj = {
        partNo: mfgpartno
      };
      vm.cgBusyLoading = PricingFactory.getOctoPartDetail().query({ pricingObj: listObj }).$promise.then((res) => {
        vm.apiurl = PRICING.OctoPartApi;
        vm.jsonresponse = res.data;
        vm.response = (JSON.parse(res.data));
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get packing slip detail from salesorder
    const PackingSlipDetail = () => {
      vm.cgBusyLoading = PricingFactory.getPackingSlipDetails().query({ salesorderID: vm.salesorderID }).$promise.then((res) => {
        if (res.data) {
          vm.apiurl = PRICING.PackingSlipDetails;
          vm.jsonresponse = res.data;
          vm.response = (JSON.parse(res.data));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.generateToken = (ev) => {
      var data = {
        appID: PRICING.APP_DK_TYPE.FJTScheduleForPartUpdateV3,
        isNewVersion: true
      };
      DialogFactory.dialogService(
        CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
        CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //get pricing detail from server according selected pricing apis.
    vm.getpricingDetails = function () {
      vm.viewtype = 1;
      if (vm.salesorderdet) {
        PackingSlipDetail();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 1) {
        getDigikeyPricingV3();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 2) {
        ArrowApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 3) {
        AventApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 4) {
        MouserApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 5) {
        MouserJSONApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 6) {
        NewarkApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 7) {
        TTIApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 8) {
        HeilindApiPricing();
      }
      else if (vm.autoCompletePricingDist.keyColumnId === 9) {
        OctoPartApiPricing();
      }
    };
    //open digikey page in new window to login client and get code.
    vm.openlink = function () {
      BaseService.openURLInNew(PRICING.DigikeyGetKeyCode);
    };
  }
})();

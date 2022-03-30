(function () {
  'use strict';
  /** @ngInject */
  var PRICING = {
    PRICING_LABEL: 'Pricing',
    PRICING_ROUTE: '/pricing',
    PRICING_STATE: 'app.pricing',
    PRICING_CONTROLLER: 'PricingApiController',
    PRICING_VIEW: 'app/main/pricingapis/pricingapi.html',

    SUPPLIER_NAME: [
      { Name: 'DigiKey V3', Value: 1 },
      { Name: 'Arrow', Value: 2 },
      { Name: 'Avnet', Value: 3 },
      { Name: 'Mouser (XML)', Value: 4 },
      { Name: 'Mouser (JSON)', Value: 5 },
      { Name: 'Newark', Value: 6 },
      { Name: 'TTI', Value: 7 },
      { Name: 'Heilind', Value: 8 },
      { Name: 'Octo Part', Value: 9 }
    ],

    SUPPLIER_CODE: {
      DigiKey: { Id: -1, Code: 'DK', Name: 'DigiKey V3' },
      Arrow: { Id: -5, Code: 'AR', Name: 'Arrow', PriceOrigin: 'ACNA' },
      Avnet: { Id: -6, Code: 'AV', Name: 'Avnet' },
      Mouser: { Id: -3, Code: 'MO', Name: 'Mouser', PackagingAttributeName: 'Packaging' },
      Newark: { Id: -2, Code: 'NW', Name: 'Newark' },
      TTI: { Id: -4, Code: 'TTI', Name: 'TTI' },
      HEILIND: { Id: -12, Code: 'HEILIND', Name: 'Heilind', }
    },

    DigikeyPartApi: 'https://api.digikey.com/services/partsearch/v2/keywordsearch',
    DigikeyPartApiV3: 'https://api.digikey.com/Search/v3/Products/Keyword',
    DigikeyGetKeyCode: 'https://sso.digikey.com/as/authorization.oauth2?response_type=code&client_id=c07d5b9b-89b0-4958-8c40-b7238e1aec1a&redirect_uri=https://www.digikey.in',
    DigikeyDynamicGetKeyCode: '',
    NewarkPartApi: 'https://api.element14.com/catalog/products',
    MouserSOAPPartApi: 'https://api.mouser.com/service/searchapi.asmx',
    MouserJSONPartAPI: 'https://api.mouser.com/api/v1/search/partnumber',
    AvnetPartApi: 'https://apigw.avnet.com/external/getDEXFetchProducts',
    ArrowPartApi: 'http://api.arrow.com/itemservice/v3/en/search/token',
    TTIPartApi: 'https://www.ttiinc.com/service/part/search/customer/json',
    HeilindPartApi: 'https://ebizapi.dac-group.com/parts',
    OctoPartApi: 'https://octopart.com/api/v4/rest/parts/match',
    PackingSlipDetails: 'https://api.digikey.com/OrderDetails/v3/Status',
    NewarkMessage: 'No Result Found',
    ERR_AUTH: '401',
    DigiKey: {
      KeyURL: 'https://sso.digikey.com/as/authorization.oauth2?response_type={0}&client_id={1}&redirect_uri={2}',
      KeyURLV3: 'https://api.digikey.com/v1/oauth2/authorize?response_type=code&client_id={0}&redirect_uri={1}',
      ResponseType: 'code',
      ClientID: 'c07d5b9b-89b0-4958-8c40-b7238e1aec1a',
      RedirectURI: 'https://www.digikey.in',
      Step1Message: 'Click on following link to verify your account',
      Step2Message: 'Make sure to copy the URL',
      Step3Message: 'Paste URL in to following field and click on submit button',
      Step2V3Message: 'Allow to request for approval',
      LoginDetails: 'Login to your Digi-Key account.',
      Suggestion1: 'After login, click on allow button to generate URL. Refer following image for reference.',
      Suggestion: 'After login, Copy the URL which is present over there. Refer following image for reference.',
      Note1: 'Note: In case, If you are closing browser tab and if login was not done, Then you have to reopen link and login again.',
      Note2: 'Note: In case, If you missed to copy the URL and if you step further, You have to back on the page and copy it.'
    },
    APP_DK_TYPE: {
      FJT: 'FJT',
      FJTCleanBOM: 'FJT-CleanBOM',
      FJTScheduleForPartUpdate: 'FJT-ScheduleForPartUpdate',
      FJTV3: 'FJT-V3',
      FJTCleanBOMV3: 'FJTV3-CleanBOM',
      FJTScheduleForPartUpdateV3: 'FJTV3-ScheduleForPartUpdate'
    },
    PricingAPINames: {
      DigiKey: 'DigiKey',
      Mouser: 'Mouser',
      Newark: 'Newark',
      Arrow: 'Arrow'
    },
    PRICING_STATUS: {
      SendRequest: 0,
      NotPricing: 1,
      Success: 2
    },
    EventName: {
      UpdateStatus: 'UpdatePricingStatus',
      UpdateAllPricing: 'UpdateAllPricingStatus',
      LineItemPricingStatus: 'lineitem_autopricing_status:receive',
      AssemblyPricingStatus: 'assembly_autopricing_status:receive',
      AskDigiKeyAuthentication: 'askDigikeyAuthentication:receive',
      SaveSummary: 'SaveSummary',
      SaveSummaryTab: 'SaveSummaryTab',
      ChangeClickSubmitStatus: 'ChangeClickSubmitStatus',
      ExportSummary: 'ExportSummary',
      sendBOMStatusVerification: 'sendBOMStatusVerification:receive',
      sendBOMStartStopActivity: 'sendBOMStartStopActivity:receive',
      deleteBOMDetails: 'deleteBOMDetails:receive',
      updateBOMCPNDetails: 'updateBOMCPNDetails:receive',
      sendPartUpdatedNotification: 'sendPartUpdatedNotification:receive',
      SaleSPricingStatus: 'purchase_SalesOrder_autopricing_status:receive',
      PurchaseLineItemPricingStatus: 'Purchase_lineitem_autopricing_status:receive',
      Purchase_askDigikeyAuthentication: 'Purchase_askDigikeyAuthentication:receive',
      Costing_Button_EnableDisable: 'CostingButtonEnableDisable',
      sendBOMStatusProgressbarUpdate: 'sendBOMStatusProgressbarUpdate:receive',
      RemoveUMIDFrmList: 'RemoveUMIDFrmList:receive',
      ScannUMID: 'scanned-umid',
      revisedQuote: 'revisedQuote:receive',
      sendSubmittedQuote: 'sendSubmittedQuote:receive',
      updateSummaryQuote: 'updateSummaryQuote:receive',
      updateExpectedTimePrice: 'updateExpectedTimePrice',
      sendBOMSpecificPartRequirementChanged: 'sendBOMSpecificPartRequirementChanged:receive',
      sendCostingStartStopActivity: 'sendCostingStartStopActivity:receive'
    },
    REVIEW_PRICING:
      [{ id: 1, route: 'app.rfq.bom.partcosting.reviewpricing.notquoted', name: 'Not Quoted Line Items', icon: 'mdi mdi-pause-circle-outline', title: 'Not Quoted Line Items' },
      { id: 2, route: 'app.rfq.bom.partcosting.reviewpricing.rules', name: '80/20 Rules', icon: 'mdi mdi-ruler', title: '80-20 Rules' },
      { id: 3, route: 'app.rfq.bom.partcosting.reviewpricing.excess', name: 'Excess Material Exposure', icon: 'icon-crop-free', title: 'Excess Material Exposure' },
      { id: 4, route: 'app.rfq.bom.partcosting.reviewpricing.atrisk', name: 'Materials At Risk', icon: 'icon-no', title: 'Materials (Design) At Risk' },
      { id: 5, route: 'app.rfq.bom.partcosting.reviewpricing.leadtimerisk', name: 'Lead Time Risk', icon: 'icon-clock-fast', title: 'Lead Time Risk' },
      { id: 6, route: 'app.rfq.bom.partcosting.reviewpricing.alternative', name: 'Suggested Alternatives', icon: 'icon-content-duplicate', title: 'Suggested Alternatives' }],
    REVIEW_PRICING_TABS: {
      NotQuoted: {
        Name: 'Not Quoted Line Items'
      },
      CustomRules: {
        Name: '80/20 Rules'
      },
      ExcessMaterialExposure: {
        Name: 'Excess Material Exposure'
      },
      MaterialAtRisk: {
        Name: 'Materials At Risk'
      },
      LeadTimeRisk: {
        Name: 'Lead Time Risk'
      },
      SuggestedAlternative: {
        Name: 'Suggested Alternatives'
      },
      PartCosting: {
        Name: 'Part costing'
      }
    }
  };
  angular
    .module('app.pricing')
    .constant('PRICING', PRICING);
})();

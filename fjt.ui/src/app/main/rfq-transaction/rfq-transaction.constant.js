(function () {
  'use strict';
  /** @ngInject */
  var RFQTRANSACTION = {
    ERROR_ICON: 'error_icon.png',
    TBD_ICON: 'tbd.png',
    APPROVE_MOUNTING_TYPE_ICON_TOOLTIP: 'Approved Mounting Type and Functional Type',
    RFQTRANSACTION_EMPTYSTATE: {
      PERSONNAL_CUSTOMER_UNAUTHORIZE_ACCESS: {
        IMAGEURL: 'assets/images/emptystate/unauthorise.png',
        MESSAGE: 'You do not have permission to access this customer details.',
        CONTACT_ADMINISTRATOR: 'Please contact to administrator.'

      },
      BOM: {
        IMAGEURL: 'assets/images/emptystate/import-BOM.png',
        MESSAGE: 'Drag a BOM here',
        INACTIVEMESSAGE: 'Please start the BOM activity then drag a BOM here',
        ADDNEWMESSAGE: 'Click below to add a BOM',
        NO_BOM_UPLOADED: 'BOM is not added yet',
        MESSAGE_DISCRIPTIOM: 'There should be no hidden rows/columns in sheet, Please verify excel before upload.',
        // Used At Assembly at glance
        DNP_QPA_COUNT_MSG: 'DNP QPA = DNP Qty + QPA (If Populate is Un-checked) .',
        Mismatched: 'Mismatched'
      },
      API_ERROR_EMPTY_STATE: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: 'No any supplier API error press continue for further processing.'
      },
      SEARCH_BOM: {
        IMAGEURL: 'assets/images/emptystate/bom-search-empty.png',
        MESSAGE: 'Please select Assy ID to show a BOM.'
      },
      RFQ: {
        IMAGEURL: 'assets/images/emptystate/RFQ-list.png',
        MESSAGE: 'RFQ does not exist.',
        ADDNEWMESSAGE: 'Click below to add a RFQ'
      },
      RFQ_ASSY_QUANTITY: {
        IMAGEURL: 'assets/images/emptystate/RFQ-list.png',
        MESSAGE: 'Assembly quantity does not exist.'
      },
      RFQ_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder-narrative-history.png',
        MESSAGE: 'Assembly quote status history does not exist.'
      },
      PART_COSTING: {
        IMAGEURL: 'assets/images/emptystate/part-costing.png',
        MESSAGE: 'Consolidated Parts does not exist.'
      },
      PRICING: {
        IMAGEURL: 'assets/images/emptystate/rfq-pricing.png',
        MESSAGE: 'Pricing does not exist.',
        ADDNEWMESSAGE: 'Click below to add a manual price'
      },
      NOT_VERIFIED_BOM: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'BOM is not ready for pricing yet!'
      },
      NOT_MAPPING_PART: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Bad-good part detail does not exist.'
      },
      NO_ALTERNATE_PART: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Alternate parts does not exist.'
      },
      NO__ROHS_REPLACEMENT_PART: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'RoHS replacement parts does not exist.'
      },
      NO_PACKAGING_ALIAS_PART: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Packaging alias parts does not exist.'
      },
      NO_PROCESS_MATERIAL: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Process materials does not exist.'
      },
      NO_GOOD_PART: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Good parts does not exist.'
      },
      NO_SUMMARY: {
        IMAGEURL: 'assets/images/emptystate/summary.png',
        MESSAGE: 'Summary does not exist for quote.'
      },
      NOT_QUOTED: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Unquoted line item details does not exist.'
      },
      COSTING_NOT_REQUIRE: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Costing Not Require(DNP) line item details does not exist.'
      },
      CUSTOM_RULES: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Consolidated parts does not exist.'
      },
      MANUAL_PRICE: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Manual selected price details does not exist.'
      },
      EXCESS_MATERIAL: {
        IMAGEURL: 'assets/images/emptystate/excess-material.png',
        MESSAGE: 'Excess material exposure details does not exist.'
      },
      MATERIAL_RISK: {
        IMAGEURL: 'assets/images/emptystate/material-at-risk.png',
        MESSAGE: 'NRND and Obsolete items details does not exist.'
      },
      LEADTIME_RISK: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Leadtime risk details does not exist.'
      },
      SUGGESTED_ALTERNATIVE: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Alternative details does not exist.'
      },
      NO_QUOTE_SUMMARY_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/summary.png',
        MESSAGE: 'Quote not submitted yet!'
      },
      PRICING_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/part-costing.png',
        MESSAGE: 'Pricing history details does not exist.'
      },
      LABOR: {
        IMAGEURL: 'assets/images/emptystate/summary.png',
        MESSAGE: 'Labor items does not exist.'
      },
      ACTIVITY: {
        IMAGEURL: 'assets/images/emptystate/import-BOM.png',
        MESSAGE: 'No BOM Activity Start/Stop History!'
      },
      COSTING_ACTIVITY: {
        IMAGEURL: 'assets/images/emptystate/part-costing.png',
        MESSAGE: 'No Costing Activity Start/Stop History!',
        INACTIVEMESSAGE: 'Please start the costing activity to access the documents'
      },
      PART_PROGRAMM_MAPPING: {
        IMAGEURL: 'assets/images/emptystate/import-BOM.png',
        MESSAGE: 'Any Programming Require Part Not Available in BOM.'
      },
      BOM_ERROR_LEGEND: {
        IMAGEURL: 'assets/images/emptystate/Reason-icon.png',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ODDLY_NAME: {
        IMAGEURL: 'assets/images/emptystate/oddly-name.png',
        MESSAGE: 'There is no oddly named RefDes in this assembly.'
      }
    },
    VERIFY_PN_EXTERNALLY_TOOLTIP: 'Note : 1. System will verify and get the details of BOM "MPN/SPN" from following supplier APIs (DK, MO, AV, NW, AR, TTI, HEILIND).<br/>2. If supplier APIs info is already mapped to the system, it will auto- insert data into the part master along with the supplier parts.<br/>3. If any part details are found from the supplier API that were not mapped to the system, then it will be display in the error list.<br/>4. If the manufacturer or supplier is not found in the system, it will be displayed in the error list.',
    REF_DES_TOOLTIP: 'Valid RefDes Examples: \'R1,R2\', \'R1-R5\', \'R1-8\', \'R1,R2-R5\', \'COIL+\'.\nInvalid RefDes Examples: \'R-\', \'R?\', \'R1-?\', \'R1-8!\', \'0,R(-)\', \'COIL(-)\', \'0,COIL(+)\'. ',
    RFQ_TURN_TYPE: {
      BUSINESS_DAY: {
        TYPE: 'Business Days',
        VALUE: 'B'
      },
      WEEK_DAY: {
        TYPE: 'Weekdays',
        VALUE: 'D'
      },
      WEEK: {
        TYPE: 'Week',
        VALUE: 'W'
      },
      DAYLY: {
        TYPE: 'Daily',
        VALUE: 1,
        DURATION: 365
      },
      WEEKLY: {
        TYPE: 'Weekly',
        VALUE: 2,
        DURATION: 52
      },
      MONTHLY: {
        TYPE: 'Monthly',
        VALUE: 4,
        DURATION: 12
      },
      QUARTERLY: {
        TYPE: 'Quarterly',
        VALUE: 5,
        DURATION: 4
      },
      YEARLY: {
        TYPE: 'Yearly',
        VALUE: 3,
        DURATION: 1
      }
    },
    LIFE_EXPECTANCY: {
      ONE_TIME: {
        TYPE: 'One-Time',
        VALUE: 0
      },
      REPEAT: {
        TYPE: 'Repeat',
        VALUE: 1
      },
      MISC_BUILD: {
        TYPE: 'Misc-Build',
        VALUE: 2
      }
    },
    RFQ_QUOTE_STATUS: {
      STATUS: {
        NONE: 'N',
        IN_PROCESS: 'P',
        COMPLETED: 'C'
      },
      STATUS_TYPE: {
        BOM: 'BOM',
        LABOR: 'LABOR',
        MATERIAL_COSTING: 'MATERIAL COSTING',
        SUMMARY: 'SUMMARY',
        CUSTOM_PART_COSTING: 'CUSTOM PART COSTING'
      }
    },
    RFQ_ASSY_STATUS: {
      IN_PROGRESS: {
        NAME: 'In Progress',
        VALUE: 1
      },
      FOLLOW_UP: {
        NAME: 'Follow up Submitted RFQ',
        VALUE: 2
      },
      WON: {
        NAME: 'Win',
        VALUE: 3
      },
      LOST: {
        NAME: 'Loss',
        VALUE: 4
      },
      CANCEL: {
        NAME: 'Cancel',
        VALUE: 5
      }
    },
    RFQ_ASSY_QUOTE_STATUS: {
      PENDING: {
        NAME: 'Pending',
        VALUE: 1
      },
      RE_QUOTE: {
        NAME: 'Re-Quote',
        VALUE: 2
      },
      SUBMITTED: {
        NAME: 'Submitted',
        VALUE: 3
      },
      COMPLETED: {
        NAME: 'Completed',
        VALUE: 4
      }
    },
    RFQ_ASSY_LABOR_TYPE: {
      SUMMARY: {
        NAME: 'Summary',
        VALUE: 0
      },
      DETAIL: {
        NAME: 'Detail',
        VALUE: 1
      }
    },
    ACTIVITY_LABEL: {
      HEADER: 'Total Time Spent Per User'
    },
    RFQ_QUOTE_PRIORITY: {
      NONE: {
        TYPE: '',
        VALUE: null
      },
      ONE: {
        TYPE: '1',
        VALUE: '1'
      },
      TWO: {
        TYPE: '2',
        VALUE: '2'
      },
      THREE: {
        TYPE: '3',
        VALUE: '3'
      },
      FOUR: {
        TYPE: '4',
        VALUE: '4'
      },
      FIVE: {
        TYPE: '5',
        VALUE: '5'
      }
    },
    RFQFilterCriteria: {
      CURRENT_MONTH: { value: 'CURRENT_MONTH', key: 'Current Month' },
      CURRENT_QUARTER: { value: 'CURRENT_QUARTER', key: 'Current Quarter' },
      CURRENT_YEAR: { value: 'CURRENT_YEAR', key: 'Current Year' },
      LAST_MONTH: { value: 'LAST_MONTH', key: 'Last Month' },
      LAST_QUARTER: { value: 'LAST_QUARTER', key: 'Last Quarter' },
      LAST_YEAR: { value: 'LAST_YEAR', key: 'Last Year' }
    },
    CUSTOMER_APPROVAL: {
      NONE: 'N',
      APPROVED: 'A',
      PENDING: 'P'
    },
    QPA_VALIDATION_STEP: {
      Verifyed: 1,
      Change: 2,
      MisMatch: 3,
      Duplicate: 4,
      Invalid: 5,
      Require: 6
    },
    PRICING_UPDATE_STOCK: '/../../../../assets/images/etc/update-stock.png',
    Price_Header: 'Pricing',
    SUCCESS_COLOR: '#CEC',
    TBD: -1,
    NON_RoHS: -2,
    ERROR_COLOR: '#ff4c42',
    ERROR_TEXT_COLOR: '#000000',
    NON_ROHS_COLOR: '#ffffff',
    DEFAULT_RGB_COLOR: 'rgb(255,255,255)',
    RGB_COLOR_FORMAT: 'rgb({0},{1},{2})',
    DEFAULT_LTB_DATE_TEXT: 'near future',
    MULTI_FIELDS: ['mfgPNDescription', 'mfgCode', 'mfgPN', 'parttypeID', 'mountingtypeID', 'partcategoryID', 'pitch', 'partPackage', 'deviceMarking', 'packaging', 'value', 'tolerance', 'voltage', 'distributor', 'distPN', 'badMfgPN', 'rohsComplient', 'description', 'customerApprovalComment', 'powerRating', 'maxSolderingTemperature', 'minOperatingTemp', 'maxOperatingTemp', 'userData1', 'userData2', 'userData3', 'userData4', 'userData5', 'userData6', 'userData7', 'userData8', 'userData9', 'userData10', 'color', 'uom', 'functionaltypes', 'mountingtypes', 'additionalComment', 'componentLead', 'noOfRows', 'org_mfgCode','suggestedByApplicationMsg'],
    HIDDEN_FIELDS: ['id', 'rfqAlternatePartID', '_lineID', 'mergeLines', 'ltbDate', 'suggestedPart', 'duplicateLineID', 'duplicateRefDesig', 'refDesigCount', 'dnpDesigCount', 'invalidRefDesig', 'partRoHSStatus', 'assyRoHSStatus', 'invalidDNPREFDES', 'aliasMFGPN', 'componentLead', 'connectorType', 'level', 'refRFQLineItemID', 'partMFGCode', 'partDistributor', 'noOfRows', 'partStatus', 'cust_lineID', 'uom'],
    API_LINKS: {
      DIGIKEY: 'https://www.digikey.com/products/en?keywords=',
      FINDCHIPS: 'https://www.findchips.com/search/',
      OCTOPART: 'https://octopart.com/search?q=',
      ARROW: 'https://www.arrow.com/',
      AVNET: 'https://www.avnet.com/wps/portal/apac/',
      MOUSER: 'https://www.mouser.com/Search/Refine?Keyword=',
      NEWARK: 'https://www.newark.com/',
      Heilind: 'https://estore.heilindasia.com/search.asp?p={0}',
      TTI: 'https://www.ttiinc.com/content/ttiinc/en/apps/part-detail.html?partsNumber={0}&autoRedirect=true',
      DKimage: 'https://www.digikey.in/favicon.ico',
      FindChipImage: 'http://www.findchips.com/favicon.ico',
      ArrowImage: 'https://static4.arrow.com/static/img/icons/favicon.90beaa56c09ab8ea.ico',
      AvnetImage: '{0}/../../assets/images/etc/favicon.ico',
      MouserImage: 'https://www.mouser.com/favicon.ico',
      NewarkImage: 'https://www.newark.com/favicon.ico',
      HeilindImage: 'https://estore.heilindasia.com/favicon.ico',
      TTIImage: 'https://www.ttiinc.com/etc/designs/ttiinc/favicon.ico?v=1',
      OctopartImage: 'https://n1.octostatic.com/highfive/images/logos/octopart-cog-white2-2eadd0247d.png',
      GOOGLE: 'https://www.google.com/search?q=',
      GOOGLE_IMAGE: 'https://www.google.com/favicon.ico'
    },
    UnitMaxValue: '99999',
    EXTMaxValue: '999999999',
    SUPPLIER_QUOTE_CUSTOM_STATUS: [
      { ID: 0, VALUE: 'Unknown' },
      { ID: 1, VALUE: 'Yes' },
      { ID: 2, VALUE: 'No' }
    ],
    SUPPLIER_QUOTE_NCNR_STATUS: [
      { ID: 0, VALUE: 'Unknown' },
      { ID: 1, VALUE: 'Yes' },
      { ID: 2, VALUE: 'No' }
    ],
    COMMONLABELNAME: {
      MFG: 'MFR',
      MFGPN: 'MFR PN'
    },
    PRICING_TURN_TYPE: [{
      Name: 'Day'
    }, {
      Name: 'Week'
    }],
    CUSTOM_STATUS: [{
      Name: 'Unknown'
    }, {
      Name: 'Yes'
    }, {
      Name: 'No'
    }],
    CUSTOM_STATUSNAME: {
      Unknown: 'Unknown',
      Yes: 'Yes',
      No: 'No'
    },
    CUSTOM_PRICING_STATUS: [{
      value: 'N/A', id: 0
    }, {
      value: 'Highest', id: 1
    }, {
      value: 'Lowest', id: 2
    }],
    COMMON_STATUS: [{
      value: 'All', id: null
    }, {
      value: 'N/A', id: 0
    }, {
      value: 'Highest', id: 1
    }, {
      value: 'Lowest', id: 2
    }],
    COMMON_TYPE_STATUS: {
      HIGHEST: 1,
      LOWEST: 2,
      NOTAPPLIED: 0
    },
    FLEXTRON: 'FLEXTRON',
    PART_COSTING: {
      CHECK_ALL: 'Select All',
      UNCHECK_ALL: 'Deselect All',
      LineID: 'lineID',
      LineItemID: 'rfqLineItemID',
      AssyID: 'rfqAssyID',
      RFQAssyBomID: 'rfqAssyBomID',
      MFGAlterparts: 'mfgAlterparts',
      ConsolidateID: 'id',
      AttrationRate: 'Overage Percentage',
      LeadQty: 'Lead Qty',
      SelectedPN: 'selectedMpn',
      UnitPrice: 'unitPrice',
      Supplier: 'supplier',
      SelectionMode: 'selectionMode',
      ISPurchase: 'isPurchase',
      Pricing: 'pricing',
      LeadQtyField: 'leadQty',
      AttrationRateField: 'attritionRate',
      Active: 'Active',
      USD: 'USD',
      Manual: 'Manual',
      Sku: 'Sku',
      Week: 'Week',
      Unknown: 'Unknown',
      LTB: 'Last Time Buy',
      Obsolete: 'Obsolete',
      NRND: 'Not For New Designs',
      PartTypeName: 'partTypeName',
      PartClassName: 'name',
      Component: 'component',
      MfgComponents: 'mfgComponents',
      IsDisabled: 'isDisabled',
      ApiLeadTime: 'APILeadTime (days)',
      MFGAlterpartsData: 'mfgAlterpartsData',
      NumOfPosition: 'numOfPosition',
      AlternatePN: 'AlternatePN',
      SelectedRoHSStatus: 'selectedRoHSStatus',
      QPA: 'qpa',
      RequestQty: 'requestQty',
      CurrentStock: 'currentStock',
      StockName: 'stockName',
      PriceName: 'priceName',
      Stock: 'stock',
      Price: 'price',
      StockPercentage: 'stockPercentage',
      RowID: 'row_id',
      Sum10: 'sum_10',
      Agg10: 'agg_10',
      ApiLead: 'apiLead',
      Min: 'min',
      Mult: 'mult',
      customerID: 'customerID',
      ConsolidateQuantity: 'ConsolidateQuantity',
      numOfRows: 'numOfRows',
      lineItemCustoms: 'lineItemCustoms',
      uomID: 'uomID',
      Auto: 'Auto',
      Review: 'Add, Review or Modify Pricing',
      Both: 'Both',
      isqpaMismatch: 'isqpaMismatch',
      restrictUseInBOMStep: 'restrictUseInBOMStep',
      consolidateID: 'consolidateID',
      mfgPN: 'mfgPN',
      consolidatedpartlineIDPart: 'consolidatedpartlineIDPart',
      consolidateRestrictPartDetailPart: 'consolidateRestrictPartDetailPart',
      restrictCPNUseInBOMStep: 'restrictCPNUseInBOMStep',
      custPNID: 'custPNID',
      restrictCPNUsePermanentlyStep: 'restrictCPNUsePermanentlyStep',
      restrictCPNUseWithPermissionStep: 'restrictCPNUseWithPermissionStep',
      DK: 'DK',
      DigiKey: 'DigiKey',
      TTI: 'TTI',
      pricingList: 'pricingList',
      autoPricingStatus: 'autoPricingStatus',
      isCustom: 'isCustom',
      cpncustAssyPN: 'cpncustAssyPN',
      CPNRoHSName: 'CPNRoHSName',
      CPNRoHSIcon: 'CPNRoHSIcon'
    },
    PRICING_SOURCE: {
      DigiKey: 'DK',
      Mouser: 'MO',
      Newark: 'NW',
      Arrow: 'AR',
      Avnet: 'AV',
      TTI: 'TTI',
      HEILIND: 'HEILIND'
    },
    SUMMARY: {
      MaterialCostDay: 'Material Cost(Days)',
      MaterialCostDollar: 'Material Cost($)',
      PCBDays: 'PCB /EA (Days)',
      PCBDollar: 'PCB /EA ($)',
      AdditionalComment: 'Additional Comment',
      Summary: 'Summary',
      Notes: 'Notes',
      Terms: 'Terms & Condition',
      EXCELQUERY: 'SELECT * INTO XLSX("{0}.xlsx",?) FROM ?',
      ERROR: 'Error Description',
      REQUIREMENT: 'Additional Requirement',
      WEEKS: 'Weeks',
      DAYS: 'Days',
      TOTAL: 'Total',
      QUOTE_ATTRIBUTE_CRITERIA: [{ Name: 'Whichever is greater', Value: 1 }, { Name: 'Add to Lead Time', Value: 2 }],
      QUOTE_ATTRIBUTE_TYPE: [{ Name: 'Material', Value: 'M' }, { Name: 'Labor', Value: 'L' }]
    },
    LABOR: {
      TotalLabor: 'Total Labor',
      UI_ALTERNATE_COLOR: ['#e3f5fe', '#ade3fd']
    },
    EVENT_NAME: {
      OpenPriceSelector: 'OpenPriceSelector',
      ClosePriceSelector: 'ClosePriceSelector',
      ShowSummary: 'ShowSummary',
      HideSummarySave: 'HideSummarySave',
      ExportPricing: 'ExportPricing',
      ImportPricing: 'ImportPricing',
      HideImportExport: 'HideImportExport',
      UpdateInternalVersion: 'UpdateInternalVersion',
      UpdateBOMIcon: 'UpdateBOMIcon',
      PricingFilter: 'PricingFilter',
      Packaging: 'Packaging',
      ClearPricing: 'ClearPricing',
      CheckCount: 'CheckCount',
      StockUpdate: 'StockUpdate',
      isSummaryNotAttributes: 'isSummaryNotAttributes',
      DraftSave: 'DraftSave',
      RecalculateLogic: 'RecalculateLogic',
      UpdateComponentHeader: 'UpdateComponentHeader',
      ResponseReason: 'responseReason'
    },
    GRID_MENU_CONSTANT: {
      CLEAR_ALL_PRICING: {
        NAME: 'Clear All Pricing',
        ICON: 'icon icon-trash',
        IS_ACTIVE: true,
        IS_DYNAMIC: false
      }, CLEAR_SELECTIONS: {
        NAME: 'Clear Selections',
        ICON: 'icon icon-trash',
        IS_ACTIVE: true,
        IS_DYNAMIC: false
      }
      //, EXTENDED_PRICE: {
      //    NAME: 'Total Price',
      //    OK_ICON: 'ui-grid-icon-ok',
      //    CANCEL_ICON: 'ui-grid-icon-cancel',
      //    IS_ACTIVE: true,
      //    IS_DYNAMIC: true
      //}, UNIT_PRICE: {
      //    NAME: 'Unit Price',
      //    OK_ICON: 'ui-grid-icon-ok',
      //    CANCEL_ICON: 'ui-grid-icon-cancel',
      //    IS_ACTIVE: false,
      //    IS_DYNAMIC: true
      //}, ASSEMBLY_PRICE: {
      //    NAME: 'Assembly Price',
      //    OK_ICON: 'ui-grid-icon-ok',
      //    CANCEL_ICON: 'ui-grid-icon-cancel',
      //    IS_ACTIVE: false,
      //    IS_DYNAMIC:true
      //}
    },
    SUMMARY_COSTINGTYPE: {
      Material: 'Material',
      Labor: 'Labor',
      Adhoc: 'Overhead',
      FinalEA: 'PCB Final EA',
      TotalNRE: 'Total NRE',
      NRE: 'NRE',
      TOOL: 'Tooling',
      TotalTOOL: 'Total Tooling',
      ALL: 'All'
    },
    COSTIING_TYPE_NAME: {
      MATERIALCOSTING: 'Material Costing (Excludes Custom Parts)'
    },
    QUOTE_ATTRIBUTE_MARGIN_TYPE: [{ Name: 'Markup $', Value: 1 }, { Name: 'Markup %', Value: 2 }],
    PRICE_FILTER: {
      GetRFQConsolidateRfqLineItem: {
        ID: 1,
        Name: 'All',
        SpName: 'Sproc_GetRFQConsolidateRfqLineItem'
      },
      GetRFQUnQuotedLineItems: {
        ID: 2,
        Name: 'Unquoted Items',
        SpName: 'Sproc_GetRFQUnQuotedLineItems'
      },
      GetRFQCustomRulesLineItems: {
        ID: 3,
        Name: '80-20 Rules',
        SpName: 'Sproc_GetRFQCustomRulesLineItems'
      },
      GetExcessMaterialLineItems: {
        ID: 4,
        Name: 'Excess Material Exposure',
        SpName: 'Sproc_GetExcessMaterialLineItems'
      },
      GetRFQMaterialAtRiskLineItems: {
        ID: 5,
        Name: 'NRND & Obsolete Items',
        SpName: 'Sproc_GetRFQMaterialAtRiskLineItems'
      },
      GetLeadTimeRiskLineItems: {
        ID: 6,
        Name: 'Lead Time Risk',
        SpName: 'Sproc_GetLeadTimeRiskLineItems'
      },
      GetRFQManualSelectPrice: {
        ID: 7,
        Name: 'Manual Price Selection Items',
        SpName: 'Sproc_GetRFQManualSelectPrice'
      },
      GetCostingNotRequiredDNP: {
        ID: 8,
        Name: 'Costing Not Required(DNP)',
        SpName: 'Sproc_GetRFQCostingNotRequireLineItem'
      }
    },

    LEADTIME_FILTER: [{
      ID: 'W',
      Name: 'Weeks'
    },
    {
      ID: 'D',
      Name: 'Days'
    }
    ],
    PRICING_FILTER: [{
      ID: 1,
      Name: 'All',
      SpName: 'Sproc_GetRFQConsolidateRfqLineItem'
    }, {
      ID: 3,
      Name: '80-20 Costing Rule',
      SpName: 'Sproc_GetRFQCustomRulesLineItems'
    }, {
      ID: 4,
      Name: 'Excess Material Exposure',
      SpName: 'Sproc_GetExcessMaterialLineItems'
    }, {
      ID: 6,
      Name: 'Lead Time Risk',
      SpName: 'Sproc_GetLeadTimeRiskLineItems'
    }, {
      ID: 2,
      Name: 'Unquoted Items',
      SpName: 'Sproc_GetRFQUnQuotedLineItems'
    }, {
      ID: 5,
      Name: 'NRND & Obsolete Items',
      SpName: 'Sproc_GetRFQMaterialAtRiskLineItems'
    }, {
      ID: 7,
      Name: 'Manual Price Selection Items',
      SpName: 'Sproc_GetRFQManualSelectPrice'
    }, {
      ID: 8,
      Name: 'Costing Not Required(DNP)',
      SpName: 'Sproc_GetRFQCostingNotRequireLineItem'
    }
    ],
    PRICING_BG_COLORS: {
      STOCK_MATCH: 'rgb(204, 238, 204)',
      STOCK_HALF_MATCH: '#00bfff',
      STOCK_NOT_MATCH: '#ff1a1a'
    },
    LABOR_BG_COLOR: {
      PRICE_MINIMAL: 'rgb(255, 26, 26)!important'
    },
    ExportPriceGroupHeader: {
      PriceGroup: {
        Header: 'Price Group',
        Field: 'name'
      },
      AssyID: {
        Header: 'Assy ID',
        Field: 'PIDCode'
      },
      Qty: {
        Header: 'Quote Qty',
        Field: 'qty'
      },
      TurnTime: {
        Header: 'Turn Time',
        Field: 'turnTime'
      },
      UnitOfTime: {
        Header: 'Unit Of Time',
        Field: 'unitOfTime'
      }
    },
    PRICE_APPLIED: [{ id: null, value: 'All' }, { id: 'Auto', value: 'Auto' }, { id: 'Manual', value: 'Manual' }],
    PRICE_TYPE: [{ id: null, value: 'All' }, { id: 'Standard', value: 'Standard' }, { id: 'Special', value: 'Special' }],
    BOM_FILTERS: {
      ALL: {
        ID: 1,
        NAME: 'ALL', CODE: 'ALL'
      },
      PARTWITHISSUES: {
        ID: 2,
        NAME: 'All Parts with Issues', CODE: 'PARTWITHISSUES'
      },
      QPAREFDES: {
        ID: 3, NAME: 'QPA vs RefDes Mismatch', CODE: 'QPAREFDES'
      },
      INTERNALPN: {
        ID: 4, NAME: 'Various Internal Parts Issue (Mounting, Functional, pin, etc)', CODE: 'INTERNALPN'
      },
      NONROHS: {
        ID: 5, NAME: 'Non-RoHS Parts', CODE: 'NONROHS'
      },
      NONROHSNOAPPROVAL: {
        ID: 6, NAME: 'Non-RoHS Parts with No Approved ALT', CODE: 'NONROHSNOAPPROVAL'
      },
      NONROHSAPPROVAL: {
        ID: 7, NAME: 'Non-RoHS Parts with Approved ALT', CODE: 'NONROHSAPPROVAL'
      },
      OBSOLETE: {
        ID: 8, NAME: 'Obsolete Parts', CODE: 'OBSOLETE'
      },
      OBSOLETENOAPPROVAL: {
        ID: 9, NAME: 'Obsolete Parts With No Approved ALT', CODE: 'OBSOLETENOAPPROVAL'
      },
      OBSOLETEAPPROVAL: {
        ID: 10, NAME: 'Obsolete Parts With Approved ALT', CODE: 'OBSOLETEAPPROVAL'
      },
      BADPART: {
        ID: 11, NAME: 'Incorrect Parts', CODE: 'BADPART'
      },
      CUSTOMERAPPROVAL: {
        ID: 12, NAME: 'Engineering Approved Parts', CODE: 'CUSTOMERAPPROVAL'
      },
      SUGGESTEDGOODPART: {
        ID: 13, NAME: 'Correct Part suggestions', CODE: 'SUGGESTEDGOODPART'
      },
      CUSTOMERAPPROVALPENDDING: {
        ID: 14, NAME: 'Pending Customer Approvals', CODE: 'CUSTOMERAPPROVALPENDDING'
      },
      MISMATCHEDPIN: {
        ID: 15, NAME: 'Parts with Mismatched Pins', CODE: 'MISMATCHEDPIN'
      },
      NONEACHPART: {
        ID: 16, NAME: 'Other than Each (UOM) Parts', CODE: 'NONEACHPART'
      },
      DUPLICATEPID: {
        ID: 17, NAME: 'Duplicate part (common)', CODE: 'DUPLICATEPID'
      },
      TEMPERATUREPARTS: {
        ID: 18, NAME: 'Temperature Sensitive Parts', CODE: 'TEMPERATUREPARTS'
      },
      DRIVETOOLSPARTS: {
        ID: 20, NAME: 'Parts Require Drive Tools', CODE: 'DRIVETOOLSPARTS'
      },
      DNPQPALINES: {
        ID: 22, NAME: 'DNP BOM Lines', CODE: 'DNPQPALINES'
      },
      UNLOCKPART: {
        ID: 24, NAME: 'Unlocked Parts', CODE: 'UNLOCKPART'
      },
      UNKNOWNPART: {
        ID: 25, NAME: 'Parts with TBD (Correct/Incorrect) Status', CODE: 'UNKNOWNPART'
      },
      KITALLOCNOTREQUIRED: {
        ID: 26, NAME: 'Parts with Kit Allocation Not Required', CODE: 'KITALLOCNOTREQUIRED'
      },
      SUPPLIERTOBUY: {
        ID: 27, NAME: 'Supplier To Buy', CODE: 'SUPPLIERTOBUY'
      },
      MISMATCHPITCH: {
        ID: 28, NAME: 'Parts with Mismatched Pitch', CODE: 'MISMATCHPITCH'
      },
      CUSTOMERCONSIGNED: {
        ID: 29, NAME: 'Customer Consigned Parts', CODE: 'CUSTOMERCONSIGNED'
      }
    },
    PRICING_COLUMN_MAPPING: [
      { fieldName: 'ID' },
      { fieldName: 'Item' },
      { fieldName: 'MFR' },
      { fieldName: 'MPN' },
      { fieldName: 'Supplier' },
      { fieldName: 'Min' },
      { fieldName: 'Mult' },
      { fieldName: 'Quantity' },
      { fieldName: 'Supplier Stock' },
      { fieldName: 'Unit Price' },
      { fieldName: 'Ext. Price' },
      { fieldName: 'TimeStamp' },
      { fieldName: 'Std. Lead Time' },
      { fieldName: 'Additional Value Fee' },
      { fieldName: 'Packaging' },
      { fieldName: 'SPN' },
      { fieldName: 'NCNR' },
      { fieldName: 'Custom Reel' }],
    PRICING_COLUMN_MISSING: ['LineID', 'RfqAssyQtyId', 'PricePerPart', 'APILeadTime (days)', 'MinimumBuy', 'Multiplier', 'ManufacturerPartNumber', 'SupplierName', 'ManufacturerName'],
    PRICING_HISTORY_TYPE: [{ id: 1, Value: 'Last Five', spName: 'Sproc_GetPricingHistoryLastFive' }, { id: 2, Value: 'Select Range', spName: 'Sproc_GetPricingHistoryRange' }, { id: 3, Value: 'Compare Any Two', spName: 'Sproc_GetPricingHistoryCompareRange' }],
    QUOTE_PAGE_TYPE: {
      QUOTE: {
        Name: 'quote',
        TypeID: 1
      },
      PREVIEW_QUOTE: {
        Name: 'previewquote',
        TypeID: 2
      }
    },
    LABOR_ATTRIBUTE: [
      { Name: 'Material EA (A)', id: 1 },
      { Name: 'Labor EA (B)', id: 2 },
      { Name: 'Overhead EA (C)', id: 3 },
      { Name: 'PCB Final EA (A+B+C)', id: 4 },
      { Name: 'NRE', id: 5 },
      { Name: 'Tooling', id: 6 }
    ],
    DEFAULT_ID: {
      HEADER_BREAKWAY: -2,
      PINUOM: -2
    },
    PRICE_SELECTEION_SETTING_TYPE: {
      CUSTOM_PART_SELECTION: {
        name: 'Custom part price selection setting',
        value: 'C'
      },
      NON_CUSTOM_PART_SELECTION: {
        name: 'Non-Custom part price selection setting',
        value: 'N'
      }
    },

    DELETE_BOM_OPTIONS: {
      DELETE_WITHOUT_HISTORY: {
        name: 'Delete BOM only & keep all internal versions history.',
        value: 1,
        message: 'This will delete all BOM data, and update internal version.',
        dynamicMessage: 'BOM'
      },
      DELETE_WITH_HISTORY: {
        name: 'Delete BOM with all internal versions history (upload the fresh BOM)',
        value: 2,
        message: 'This will delete all BOM data with all internal version history, and reset internal version.',
        dynamicMessage: 'BOM with all internal version history'
      }
    },

    PRICING_LEADTIME: 15,
    RFQ_MANAGE_ROUTE: '/manage/:id/:rfqAssyId',
    RFQ_MANAGE_STATE: 'app.rfq.managerfq',
    RFQ_MANAGE_CONTROLLER: 'RFQController',
    RFQ_MANAGE_VIEW: 'app/main/rfq-transaction/rfq/manage-rfq.html',

    RFQ_RFQ_LABEL: 'RFQ List',
    RFQ_RFQ_ROUTE: '/rfq',
    RFQ_RFQ_STATE: 'app.rfq',
    RFQ_RFQ_CONTROLLER: 'RFQListController',
    RFQ_RFQ_VIEW: 'app/main/rfq-transaction/rfq/rfq-list.html',

    RFQ_BOM_ROUTE: '/bom',
    RFQ_BOM_STATE: 'app.rfq.bom',
    RFQ_BOM_CONTROLLER: 'BOMController',
    RFQ_BOM_VIEW: 'app/main/rfq-transaction/bom/bom.html',

    RFQ_IMPORT_BOM_ROUTE: '/import/:id/:partId',
    RFQ_IMPORT_BOM_STATE: 'app.rfq.bom.importbom',
    RFQ_IMPORT_BOM_CONTROLLER: 'ImportBOMController',
    RFQ_IMPORT_BOM_VIEW: 'app/main/rfq-transaction/bom/import-bom/import-bom.html',
    RFQ_IMPORT_BOM_LABEL: 'BOM',

    RFQ_SEARCH_BOM_ROUTE: '/searchbom/:assyid/:subassyid',
    RFQ_SEARCH_BOM_STATE: 'app.searchbom',
    RFQ_SEARCH_BOM_CONTROLLER: 'SearchBOMController',
    RFQ_SEARCH_BOM_VIEW: 'app/main/rfq-transaction/bom/search-bom/search-bom.html',
    RFQ_SEARCH_BOM_LABEL: 'Search BOM',

    RFQ_PLANNED_BOM_ROUTE: '/planned/:id',
    RFQ_PLANNED_BOM_STATE: 'app.rfq.bom.plannedbom',
    RFQ_PLANNED_BOM_CONTROLLER: 'PlannedBOMController',
    RFQ_PLANNED_BOM_VIEW: 'app/main/rfq-transaction/bom/planned-bom/planned-bom.html',
    RFQ_PLANNED_BOM_LABEL: 'BOM Levels',

    RFQ_QUOTE_ROUTE: '/quote/:id/:pageType',
    RFQ_QUOTE_STATE: 'app.rfq.bom.quote',
    RFQ_QUOTE_CONTROLLER: 'QuoteController',
    RFQ_QUOTE_VIEW: 'app/main/rfq-transaction/bom/quote/quote.html',
    RFQ_QUOTE_LABEL: 'Quote',
    RFQ_QUOTE_PREVIEW_LABEL: 'Quote Preview',

    RFQ_LABOR_ROUTE: '/labor/:id/:partId',
    RFQ_LABOR_STATE: 'app.rfq.bom.labor',
    RFQ_LABOR_CONTROLLER: 'LaborSummaryController',
    RFQ_LABOR_VIEW: 'app/main/rfq-transaction/bom/labor/labor-summary/labor-summary.html',
    RFQ_LABOR_LABEL: 'Labor Cost',

    RFQ_SUMMARY_ROUTE: '/summary/:id',
    RFQ_SUMMARY_STATE: 'app.rfq.bom.summary',
    RFQ_SUMMARY_CONTROLLER: 'SummaryController',
    RFQ_SUMMARY_VIEW: 'app/main/rfq-transaction/bom/summary/summary.html',
    RFQ_SUMMARY_LABEL: 'Cost Summary (Option 1)',

    RFQ_SUMMARY2_ROUTE: '/summarysecondoption/:id',
    RFQ_SUMMARY2_STATE: 'app.rfq.bom.summary2',
    RFQ_SUMMARY2_CONTROLLER: 'SummarySecondOptionController',
    RFQ_SUMMARY2_VIEW: 'app/main/rfq-transaction/bom/summary/summary2.html',
    RFQ_SUMMARY2_LABEL: 'Cost Summary',

    RFQ_DOCUMENT_ROUTE: '/document/:id',
    RFQ_DOCUMENT_STATE: 'app.rfq.bom.document',
    RFQ_DOCUMENT_VIEW: 'app/main/rfq-transaction/bom/document/bom-document.html',
    RFQ_DOCUMENT_LABEL: 'Documents',

    RFQ_PART_COSTING_ROUTE: '/partcosting/:id',
    RFQ_PART_COSTING_STATE: 'app.rfq.bom.partcosting',
    RFQ_PART_COSTING_CONTROLLER: 'PartCostingController',
    RFQ_PART_COSTING_VIEW: 'app/main/rfq-transaction/bom/part-costing/part-costing.html',
    RFQ_PART_COSTING_LABEL: 'Part Costing',

    RFQ_REVIEW_PRICING_ROUTE: '/reviewpricing',
    RFQ_REVIEW_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing',
    RFQ_REVIEW_PRICING_CONTROLLER: 'ReviewPricingController',
    RFQ_REVIEW_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/review-pricing.html',


    RFQ_NOTQUOTED_PRICING_ROUTE: '/not-quoted/:id',
    RFQ_NOTQUOTED_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing.notquoted',
    RFQ_NOTQUOTED_PRICING_CONTROLLER: 'NotQuotedItemController',
    RFQ_NOTQUOTED_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/not-quoted-lineitems/not-quoted-lineitems.html',

    RFQ_RULES_PRICING_ROUTE: '/rules/:id',
    RFQ_RULES_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing.rules',
    RFQ_RULES_PRICING_CONTROLLER: 'CustomRulesController',
    RFQ_RULES_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/custom-rules/custom-rules.html',

    RFQ_EXCESS_PRICING_ROUTE: '/excess/:id',
    RFQ_EXCESS_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing.excess',
    RFQ_EXCESS_PRICING_CONTROLLER: 'ExcessMaterialController',
    RFQ_EXCESS_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/excess-material/excess-material.html',

    RFQ_ATRISK_PRICING_ROUTE: '/atrisk/:id',
    RFQ_ATRISK_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing.atrisk',
    RFQ_ATRISK_PRICING_CONTROLLER: 'MaterialsAtRiskController',
    RFQ_ATRISK_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/materials-at-risk/materials-at-risk.html',

    RFQ_LEADTIME_PRICING_ROUTE: '/leadtimerisk/:id',
    RFQ_LEADTIME_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing.leadtimerisk',
    RFQ_LEADTIME_PRICING_CONTROLLER: 'LeadTimeRiskController',
    RFQ_LEADTIME_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/lead-time-risk/lead-time-risk.html',

    RFQ_ALTERNATIVE_PRICING_ROUTE: '/alternate/:id',
    RFQ_ALTERNATIVE_PRICING_STATE: 'app.rfq.bom.partcosting.reviewpricing.alternative',
    RFQ_ALTERNATIVE_PRICING_CONTROLLER: 'SuggestedAlternativeController',
    RFQ_ALTERNATIVE_PRICING_VIEW: 'app/main/rfq-transaction/bom/part-costing/review-pricing/suggested-alternative/suggested-alternative.html',

    QUOTE_SUMMARY_DETAIL_ROUTE: '/quotesummanydetails/:id/:quoteSubmittedID/:pageType',
    QUOTE_SUMMARY_DETAIL_STATE: 'app.rfq.bom.quotesummarydetails',
    QUOTE_SUMMARY_DETAIL_CONTROLLER: 'QuoteSummaryDetailsController',
    QUOTE_SUMMARY_DETAIL_VIEW: 'app/main/rfq-transaction/bom/summary/quote-summary-details/quote-summary-details.html',
    QUOTE_SUMMARY_DETAIL_LABEL: 'Quote',

    RFQ_LINEITEMS_HEADER_VIEW: 'app/main/rfq-transaction/bom/import-bom/manage-rfq-lineitems-headers-popup/manage-rfq-lineitems-headers-popup.html',
    RFQ_LINEITEMS_HEADER_CONTROLLER: 'ManageRFQLineitemsHeadersPopupController',

    RFQ_LINEITEMS_FILTER_VIEW: 'app/main/rfq-transaction/bom/import-bom/manage-rfq-lineitems-filter-popup/manage-rfq-lineitems-filter-popup.html',
    RFQ_LINEITEMS_FILTER_CONTROLLER: 'ManageRFQLineitemsFilterPopupController',

    RFQ_LINEITEMS_DESCRIPTION_VIEW: 'app/main/rfq-transaction/bom/import-bom/customer-confirmation-popup/customer-confirmation-popup.html',
    RFQ_LINEITEMS_DESCRIPTION_CONTROLLER: 'CustomerConfirmationPopupController',

    BOM_ADDITONAL_COLUMN_CONFIGURATION_VIEW: 'app/main/rfq-transaction/bom/import-bom/bom-additional-column-configuration-popup/bom-additional-column-configuration-popup.html',
    BOM_ADDITONAL_COLUMN_CONFIGURATION_CONTROLLER: 'BOMAdditonalColumnConfigurationPopupController',

    BOM_COLUMN_MAPPING_VIEW: 'app/main/rfq-transaction/bom/import-bom/bom-column-mapping-popup/bom-column-mapping-popup.html',
    BOM_COLUMN_MAPPING_CONTROLLER: 'BOMColumnMappingPopupController',

    API_VERIFICATION_ERROR_VIEW: 'app/main/rfq-transaction/bom/import-bom/api-verification-error-popup/api-verification-error-popup.html',
    API_VERIFICATION_ERROR_CONTROLLER: 'APIVerificationErrorPopupController',

    API_VERIFICATION_PID_CODE_CHANGE_VIEW: 'app/main/rfq-transaction/bom/import-bom/api-verification-pid-code-change-popup/api-verification-pid-code-change-popup.html',
    API_VERIFICATION_PID_CODE_CHANGE_CONTROLLER: 'APIVerificationPIDCodeChangePopupController',

    API_VERIFICATION_ALTERNATEPART_VIEW: 'app/main/rfq-transaction/bom/import-bom/api-verification-alternatepart-popup/api-verification-alternatepart-popup.html',
    API_VERIFICATION_ALTERNATEPART_CONTROLLER: 'APIVerificationAlternatePopupController',

    RFQTRANSACTION_EXPANDABLEJS: 'app/main/rfq-transaction/bom/import-bom/api-verification-alternatepart-popup/apialternatepartdetail.html',

    PRICE_MANUAL_ADD_VIEW: 'app/main/rfq-transaction/bom/part-costing/part-price-select/manual-price/manual-price-popup.html',
    PRICE_MANUAL_ADD_CONTROLLER: 'ManualPricePopupController',

    SUPPLIER_QUOTE_DETAILS_VIEW: 'app/main/rfq-transaction/bom/part-costing/part-price-select/supplier-quote-details-popup/supplier-quote-details-popup.html',
    SUPPLIER_QUOTE_DETAILS_CONTROLLER: 'SupplierQuoteDetailsPopupController',

    COPY_BOM_VIEW: 'app/main/rfq-transaction/bom/import-bom/copy-bom-popup/copy-bom-popup.html',
    COPY_BOM_CONTROLLER: 'CopyBOMPopupController',

    ASSEMBLY_AT_GLANCE_VIEW: 'app/directives/custom/assembly-at-glance/assembly-at-glance-popup.html',
    ASSEMBLY_AT_GLANCE_CONTROLLER: 'AssemblyAtGlancePopupController',

    DRIVE_TOOLS_PARTS_VIEW: 'app/directives/custom/drive-tools-parts/drive-tools-parts-popup.html',
    DRIVE_TOOLS_PARTS_CONTROLLER: 'DriveToolsPartsPopupController',

    ASSEMBLY_REQUOTE_HISTORY_VIEW: 'app/main/rfq-transaction/rfq/rfq-assembly-requote-history-popup/rfq-assembly-requote-history-popup.html',
    ASSEMBLY_REQUOTE_HISTORY_CONTROLLER: 'AssemblyRequoteHistoryPopupController',

    PRICING_COLUMN_MAPPING_VIEW: 'app/main/rfq-transaction/bom/part-costing/pricing-column-mapping-popup/pricing-column-mapping-popup.html',
    PRICING_COLUMN_MAPPING_CONTROLLER: 'PricingColumnMappingPopupController',

    MANUAL_GOOD_BAD_PART_MAPPING_VIEW: 'app/main/rfq-transaction/bom/import-bom/manual-good-bad-partmapping-popup/manual-good-bad-partmapping-popup.html',
    MANUAL_GOOD_BAD_PART_MAPPING_CONTROLLER: 'ManualGoodBadPartMappingPopupController',

    IMPORT_CUSTOMER_AVL_VIEW: 'app/main/rfq-transaction/bom/import-bom/import-customer-avl-popup/import-customer-avl-popup.html',
    IMPORT_CUSTOMER_AVL_CONTROLLER: 'ImportCustomerAVLPopupController',

    RFQ_ASSEMBLY_STANDARD_CLASS_VIEW: 'app/main/rfq-transaction/rfq/assembly-standard-class/manage-assembly-standard-class-popup.html',
    RFQ_ASSEMBLY_STANDARD_CLASS_CONTROLLER: 'ManageAssemblyStandardClassPopupController',

    RFQ_ERRORCODE_LEGEND_VIEW: 'app/main/rfq-transaction/bom/import-bom/error-code-legend-popup/error-code-legend-popup.html',
    RFQ_ERRORCODE_LEGEND_CONTROLLER: 'ManageErrorCodeLegendPopupController',

    RFQ_API_MOUNTPART_VIEW: 'app/main/rfq-transaction/bom/import-bom/api-verification-mounting-part-popup/api-verification-mounting-part-popup.html',
    RFQ_API_MOUNTPART_CONTROLLER: 'APIVerificationMountPartController',

    BOM_HISTORY_POPUP_CONTROLLER: 'RFQAssemblyHistoryController',
    BOM_HISTORY_POPUP_VIEW: 'app/main/rfq-transaction/bom/history/history-list-popup.html',

    BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER: 'ActivityHistoryPopupController',
    BOM_ACTIVITY_HISTORY_POPUP_VIEW: 'app/main/rfq-transaction/bom/history/activity-history-popup.html',

    BOM_NARRATIVE_HISTORY_POPUP_CONTROLLER: 'ManageHistoryNarrativePopupController',
    BOM_NARRATIVE_HISTORY_POPUP_VIEW: 'app/main/rfq-transaction/bom/history/manage-history-narrative-popup.html',

    DIFFERENCE_OF_BOM_CHANGE_POPUP_CONTROLLER: 'DiffOfBomEntryChangeController',
    DIFFERENCE_OF_BOM_CHANGE_POPUP_VIEW: 'app/main/rfq-transaction/bom/history/difference-history-popup.html',

    CUSTOMER_APPROVAL_POPUP_VIEW: 'app/main/rfq-transaction/bom/import-bom/customer-approval-popup/customer-approval-popup.html',
    CUSTOMER_APPROVAL_POPUP_CONTROLLER: 'CustomerApprovalPopupController',

    ASSEMBLY_CATEGORY_REQUIREMENTS_POPUP_VIEW: 'app/main/rfq-transaction/bom/import-bom/assembly-category-requirements-popup/assembly-category-requirements-popup.html',
    ASSEMBLY_CATEGORY_REQUIREMENTS_POPUP_CONTROLLER: 'AssemblyCategoryRequirementsController',

    BOM_LINE_ADDITIONAL_COMMENT_POPUP_VIEW: 'app/main/rfq-transaction/bom/import-bom/bom-line-additional-comment-popup/bom-line-additional-comment-popup.html',
    BOM_LINE_ADDITIONAL_COMMENT_POPUP_CONTROLLER: 'BomLineAdditionalCommentPopupController',

    COPY_BOM_CUSTOMER_APPROVAL_POPUP_VIEW: 'app/main/rfq-transaction/bom/import-bom/copy-bom-customer-approval-popup/copy-bom-customer-approval-popup.html',
    COPY_BOM_CUSTOMER_APPROVAL_POPUP_CONTROLLER: 'CopyBOMCustomerApprovalPopupController',

    CUSTOMER_DEFAULT_APPROVAL_POPUP_VIEW: 'app/main/rfq-transaction/bom/import-bom/customer-default-approval-popup/customer-default-approval-popup.html',
    CUSTOMER_DEFAULT_APPROVAL_POPUP_CONTROLLER: 'CustomerDefaultApprovalPopupController',

    COMPONENT_CUSTOMER_LOA_POPUP_VIEW: 'app/main/rfq-transaction/bom/part-costing/component-customer-loa-popup/component-customer-loa-popup.html',
    COMPONENT_CUSTOMER_LOA_POPUP_CONTROLLER: 'ComponentCustomerLOAPopupController',

    COMPONENT_PACKAGING_ALIAS_POPUP_VIEW: 'app/directives/custom/alternative-component-details/packaging-alias/packaging-alias-popup.html',
    COMPONENT_PACKAGING_ALIAS_POPUP_CONTROLLER: 'PackagingAliasPopupController',

    ADDITIONAL_REQUIREMENT_SELECT_POPUP_VIEW: 'app/directives/custom/additional-requiremment-select-popup/additional-requirement-select-popup.html',
    ADDITIONAL_REQUIREMENT_SELECT_POPUP_CONTROLLER: 'AdditionalRequirementSelectPopupController',

    REASON_SELECT_POPUP_VIEW: 'app/directives/custom/reason-select-popup/reason-select-popup.html',
    REASON_SELECT_POPUP_CONTROLLER: 'ReasonSelectPopupController',

    VIEW_ASSEMBLY_STATUS_CHANGE_POPUP_VIEW: 'app/main/rfq-transaction/rfq/view-assy-status-change-list/view-assy-status-change-list-popup.html',
    VIEW_ASSEMBLY_STATUS_CHANGE_POPUP_CONTROLLER: 'ViewAssyChangeStatusListController',

    ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_VIEW: 'app/main/rfq-transaction/rfq/rfq-assembly-change-status/rfq-assembly-change-status-popup.html',
    ASSEMBLY_QUOTE_STATUS_CHANGE_POPUP_CONTROLLER: 'AssemblyQuoteStatusChangePopupController',

    CONSOLIDATED_QPA_POPUP_VIEW: 'app/core/component/consolidated-qpa-popup/consolidated-qpa.html',
    CONSOLIDATED_QPA_POPUP_CONTROLLER: 'ConsolidatedQPAPopupController',

    CONSOLIDATED_RESTRICTED_PART_POPUP_VIEW: 'app/core/component/consolidated-restrict-part-popup/consolidated-restrict-part-popup.html',
    CONSOLIDATED_RESTRICTED_PART_POPUP_CONTROLLER: 'ConsolidatedRestrictedPartPopupController',

    PRICE_HISTORY_POPUP_CONTROLLER: 'PricingHistoryPopupController',
    PRICE_HISTORY_POPUP_VIEW: 'app/main/rfq-transaction/bom/part-costing/pricing_history/pricing-history-popup.html',

    SELECT_OPTIONAL_QUOTE_ATTRIBUTE_POPUP_CONTROLLER: 'SelectOptionalQuoteAttributePopupController',
    SELECT_OPTIONAL_QUOTE_ATTRIBUTE_POPUP_VIEW: 'app/main/rfq-transaction/bom/summary/select-optional-quote-attribute/select-optional-quote-attribute-popup.html',

    ADD_RFQ_MISC_BUILD_POPUP_CONTROLLER: 'AddRFQMiscBuildController',
    ADD_RFQ_MISC_BUILD_POPUP_VIEW: 'app/main/rfq-transaction/rfq/rfq-misc-build/rfq-misc-build-popup.html',

    ADD_RFQ_PRICE_GROUP_POPUP_CONTROLLER: 'RFQPriceGroupController',
    ADD_RFQ_PRICE_GROUP_POPUP_VIEW: 'app/main/rfq-transaction/rfq/rfq-price-group/rfq-price-group-popup.html',

    ADD_RFQ_PRICE_GROUP_DETAILS_POPUP_CONTROLLER: 'RFQPriceGroupDetailController',
    ADD_RFQ_PRICE_GROUP_DETAILS_POPUP_VIEW: 'app/main/rfq-transaction/rfq/rfq-price-group-detail-view/rfq-price-group-detail-popup.html',

    RFQ_PRICE_GROUP_MATRIX_VIEW_POPUP_CONTROLLER: 'RFQPriceGroupMatrixViewController',
    RFQ_PRICE_GROUP_MATRIX_VIEW_POPUP_VIEW: 'app/main/rfq-transaction/rfq/rfq-price-group-matrix-view/rfq-price-group-matrix-view-popup.html',

    PART_PROGRAM_MAPPING_VIEW: 'app/main/rfq-transaction/bom/import-bom/part-program-mapping-popup/part-program-mapping-popup.html',
    PART_PROGRAM_MAPPING_CONTROLLER: 'PartProgramMappingPopupController',

    DELETE_BOM_CONFIRMATION_VIEW: 'app/main/rfq-transaction/bom/import-bom/delete-bom-popup/delete-bom-popup.html',
    DELETE_BOM_CONFIRMATION_CONTROLLER: 'DeleteBOMConfirmationPopupController'

  };
  angular
    .module('app.rfqtransaction')
    .constant('RFQTRANSACTION', RFQTRANSACTION);
})();

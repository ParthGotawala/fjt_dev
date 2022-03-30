(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('showTransactionDetailsPopupController', showTransactionDetailsPopupController);
  /** @ngInject */

  function showTransactionDetailsPopupController($mdDialog, $stateParams, data, BaseService, CustomerFactory, CORE, USER, TRANSACTION, OPERATION, CUSTOMFORMS) {
    const vm = this;
    vm.redirectLink = CORE.redirectLink;
    vm.customerType = $stateParams.customerType;
    vm.transactionList = data.transactionDetails;
    vm.redirectToPartDetailPage = data.redirectToPartDetailPage;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.title = data.PageName;
    let id = data.id;
    vm.pageTitle = data.pageTitle;
    vm.selectedIDs = data.selectedIDs;
    vm.headerdata = [];
    vm.headerdata.push({ label: vm.title, value: vm.pageTitle ? vm.pageTitle : vm.selectedIDs, displayOrder: 1 });
    vm.total = _.sumBy(data.transactionDetails, function (o) { return o.cnt; });
    vm.selectedItems = [];
    vm.isAlterntePartValidation = data.isAlterntePartValidation;
    if (vm.isAlterntePartValidation) {
      vm.transactionList = [];
      vm.transactionList.push(data.transactionDetails);
      vm.total = _.sumBy(vm.transactionList, function (o) { return o.cnt; });
    }
    vm.query = {
      order: '',
      search: '',
      limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
    };
    vm.redirect = (transactionName, transactionDetail, ev) => {
      //redirect to customer
      if (transactionName == vm.redirectLink.customer_contactperson) {
        BaseService.goToCustomerList();
        return false;
      }
      //redirect to shipping addresses,billing addresses
      if (transactionName == vm.redirectLink.shipping_addresses || transactionName == vm.redirectLink.billing_addresses
        || transactionName == vm.redirectLink.customer_addresses) {
        BaseService.goToCustomerList();
        return false;
      }
      //redirect to country master 
      if (transactionName == vm.redirectLink.component_fields_genericalias_mst) {
        BaseService.goToCountryList();
        return false;
      }
      //redirect to RoHS Status master 
      if (transactionName == vm.redirectLink.RoHS_Stauts) {
        BaseService.goToRohsList();
        return false;
      }
      //redirect to parts master
      if (transactionName == vm.redirectLink.component) {
        //Added to open part detail page while delete parts from part list page
        if (transactionDetail && transactionDetail.componentID && vm.redirectToPartDetailPage) {
          BaseService.goToComponentDetailTab(transactionDetail.mfgType, transactionDetail.componentID);
        }
        else {
          BaseService.goToPartList();
        }
        return false;
      }
      //redirect to work order master
      if (transactionName == vm.redirectLink.workorder || transactionName == vm.redirectLink.eco_request_type_values || transactionName == vm.redirectLink.eco_request || transactionName == vm.redirectLink.dfm_request || transactionName == vm.redirectLink.workorder_operation_cluster
        || transactionName == vm.redirectLink.workorder_operation_dataelement || transactionName == vm.redirectLink.workorder_operation_employee || transactionName == vm.redirectLink.workorder_operation_equipment || transactionName == vm.redirectLink.workorder_operation
        || transactionName == vm.redirectLink.woworkorder_operation_partrkorder_operation || transactionName == vm.redirectLink.workorder_transfer) {
        BaseService.goToWorkorderList();
        return false;
      }
      //redirect to standards master
      if (transactionName == vm.redirectLink.certificate_standards) {
        BaseService.goToStandardList();
        return false;
      }
      //redirect to sales order master
      if (transactionName == vm.redirectLink.salesordermst) {
        BaseService.goToSalesOrderList();
        return false;
      }
      //redirect to sales order master 
      if (transactionName == vm.redirectLink.shippedassembly) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_SHIPPED_STATE);
        return false;
      }
      //redirect to equipment and workstation master
      if (transactionName == vm.redirectLink.equipment && transactionName == vm.redirectLink.component_functionaltestingequipment) {
        BaseService.goToEquipmentWorkstationList();
        return false;
      }

      //redirect to label template master
      if (transactionName == vm.redirectLink.br_label_template) {
        BaseService.goToLabelTemplateList();
        return false;
      }
      //redirect to employee master
      if (transactionName == vm.redirectLink.employees) {
        BaseService.goToPersonnelList();
        return false;
      }
      //redirect to employee master
      if (transactionName == vm.redirectLink.salesorderdet) {
        BaseService.goToManageSalesOrder(id);
        return false;
      }
      //Redirect to department master
      if (transactionName == vm.redirectLink.department || transactionName == vm.redirectLink.department_location) {
        BaseService.openInNew(USER.ADMIN_DEPARTMENT_STATE, {});
        return false;
      }
      //Redirect to  Manage Packing Slip
      if (transactionName == vm.redirectLink.Material_Receive_Detail) {
        if (id) {
          BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, { id: id });
        }
        else {
          BaseService.openInNew(TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_STATE);
        }
        return false;
      }
      //Redirect to  Manage Packing Slip
      if (transactionName == vm.redirectLink.shipping_requestdet) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_REQUEST_FOR_SHIP_STATE, { id: id });
        return false;
      }
      //Redirect to  Manage Packing Slip
      if (transactionName == vm.redirectLink.operations) {
        BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE);
        return false;
      }
      //Redirect to  Manage Packing Slip
      if (transactionName == vm.redirectLink.uoms) {
        BaseService.openInNew(USER.ADMIN_UNIT_STATE);
        return false;
      }
      //Redirect to  Manage Packing Slip
      if (transactionName == vm.redirectLink.br_label_template_delimiter) {
        BaseService.openInNew(USER.ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE, { id: id });
        return false;
      }
      //Redirect equipment workstation groups
      if (transactionName == vm.redirectLink.equipment_workstation_groups) {
        BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE);
        return false;
      }
      //redirect to RFQ master
      if (transactionName == vm.redirectLink.rfq_lineitems_alternatepart || transactionName == vm.redirectLink.rfqforms ||
        transactionName == vm.redirectLink.rfq_consolidated_mfgpn_lineitem_alternate || transactionName == vm.redirectLink.rfq_assemblies || transactionName == vm.redirectLink.br_label_template_delimiter ||
        transactionName == vm.redirectLink.rfq_lineitems_additional_comment ||
        transactionName == vm.redirectLink.rfq_bom_header_component_configuration ||
        transactionName == vm.redirectLink.rfq_lineitems) {
        //Added to open part detail page while delete parts from part list page
        if (transactionDetail && transactionDetail.componentID && vm.redirectToPartDetailPage) {
          BaseService.goToComponentDetailTab(null, transactionDetail.componentID);
        }
        else {
          BaseService.goToRFQList();
        }
        return false;
      }
      if (transactionName == vm.redirectLink.eco_type_values) {
        BaseService.openInNew(USER.ADMIN_ECO_CATEGORY_VALUES_STATE);
        return false;
      }
      if (transactionName == vm.redirectLink.standard_class) {
        BaseService.openInNew(USER.STANDARD_CLASS_STATE);
        return false;
      }
      if (transactionName == vm.redirectLink.component_sid_stock) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE);
        return false;
      }
      //if (transactionName == vm.redirectLink.kit_allocation) {
      //    BaseService.openInNew(TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE);
      //    return false;
      //}
      if (transactionName == vm.redirectLink.workorder_assembly_excessstock_location) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_STATE);
        return false;
      }
      if (transactionName == vm.redirectLink.operation_part) {
        BaseService.goToWorkorderDetails();
        return false;
      }
      if (transactionName == vm.redirectLink.assemblystock) {
        BaseService.openInNew(USER.ADMIN_ASSEMBLYSTOCK_STATE);
        return false;
      }
      if (transactionName == vm.redirectLink.cost_category) {
        BaseService.openInNew(USER.ADMIN_COST_CATEGORY_STATE);
        return false;
      }
      //redirect to bin master
      if (transactionName == vm.redirectLink.binmst) {
        BaseService.goToBinList();
        return false;
      }
      //redirect to warehouse master
      if (transactionName == vm.redirectLink.warehousemst) {
        BaseService.goToWHList();
        return false;
      }
      //redirect to kit list
      if (transactionName == vm.redirectLink.kit_allocation) {
        BaseService.goToKitDataList();
        return false;
      }
      //redirect to workorder transaction umid details
      if (transactionName == vm.redirectLink.workorder_trans_umid_details) {
        BaseService.goToWorkorderList();
        return false;
      }

      if (transactionName == vm.redirectLink.supplier_invoice) {
        if (id) {
          BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, id);
        }
        else {
          BaseService.goToSupplierInvoiceList();
        }
        return false;
      }
      //Redirect to "Quote Terms & Conditions Attributes"
      if (transactionName == vm.redirectLink.rfq_type_values) {
        BaseService.openInNew(USER.ADMIN_RFQ_CATEGORY_VALUES_STATE);
        return false;
      }

      // redirect to Mergers & Acquisitions page (who bought who)
      if (transactionName == vm.redirectLink.who_bought_who) {
        BaseService.goTowhoAcquiredWhoList();
        return false;
      }
      //redirect to task list page
      if (transactionName == vm.redirectLink.taskList) {
        BaseService.gotoTaskList();
        return false;
      }

      //redirect to manage part purchase inspection requiremen
      if (transactionName == vm.redirectLink.purchase_inspection_requirement) {
        if (id) {
          BaseService.goToPartPurchaseInspectionRequirement(id);
        }
        else {
          BaseService.goToPartList(null);
        }
        return false;
      }
      //redirect to custom forms
      if (transactionName == vm.redirectLink.custom_form) {
        BaseService.openInNew(CUSTOMFORMS.CUSTOMFORMS_ENTITY_STATE);
        return false;
      }

      //redirect to inspection requirement template 
      if (transactionName == vm.redirectLink.purchase_inspection_requirement_template) {
        BaseService.goToTemplatePurchaseInspectionRequirement();
        return false;
      }

      //redirect to inspection requirement template 
      if (transactionName == vm.redirectLink.purchase_inspection_requirement_template) {
        BaseService.goToTemplatePurchaseInspectionRequirement();
        return false;
      }

      //redirect to customer
      if (transactionName === vm.redirectLink.mfgCodeMst) {
        BaseService.goToCustomerList();
        return false;
      }

      //redirect to customer packaging slip
      if (transactionName === vm.redirectLink.customerPackagingSlip) {
        BaseService.goToCustomerPackingSlipList();
        return false;
      }
      //redirect to Carrier master
      if (transactionName === vm.redirectLink.carriers) {
        BaseService.goToGenericCategoryCarrierList();
        return false;
      }
      //redirect to shippping method
      if (transactionName === vm.redirectLink.shipping_method) {
        BaseService.goToGenericCategoryShippingTypeList();
        return false;
      }
      //redirect to supplier Quote
      if (transactionName == vm.redirectLink.supplierQuotePartAttribute || transactionName == vm.redirectLink.supplierQuotePartPrice
        || transactionName == vm.redirectLink.SupplierQuote || transactionName == vm.redirectLink.SupplierQuotePartsDetail
      ) {
        if (id) {
          BaseService.goToSupplierQuoteWithPartDetail(id);
        } else {
          BaseService.goToSupplierQuoteList();
        }
        return false;
      }
      if (transactionName === vm.redirectLink.SupplierAttributeTemplate) {
        BaseService.goToSupplierAttributeTemplate();
      }
      if (transactionName === vm.redirectLink.mfgcodemstSupplier) {
        BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
      }
      if (transactionName === vm.redirectLink.component_approved_supplier_mst || transactionName === vm.redirectLink.component_approved_supplier_priority_detail) {
        if (transactionDetail && transactionDetail.componentID && vm.redirectToPartDetailPage) {
          BaseService.openInNew(USER.ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_STATE, { coid: transactionDetail.componentID, selectedTab: USER.PartMasterTabs.ApprovedDisapprovedSupplier.Name });
        }
        else {
          BaseService.goToPartList();
        }
      }
      if (transactionName === vm.redirectLink.supplier_mapping_mst || transactionName === vm.redirectLink.Invalid_MFR_Mapping || transactionName === vm.redirectLink.mfgcodemstManufacturer) {
        BaseService.openInNew(USER.ADMIN_MANUFACTURER_STATE, {});
      }
      if (transactionName === vm.redirectLink.packingslip_invoice_payment) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE, {});
      }
      if (transactionName === vm.redirectLink.supplier_rma) {
        BaseService.goToSupplierRMAList();
      }
      if (transactionName === vm.redirectLink.purchase_order) {
        BaseService.goToPurchaseOrderList();
      }
      // redirect to invoice list page
      if (transactionName === vm.redirectLink.customer_invoice) {
        BaseService.goToCustomerInvoiceList();
        return false;
      }
      // redirect to umid verification list page
      if (transactionName === vm.redirectLink.umid_verification_details) {
        const popupData = {};
        popupData.controllerName = data.controllerName;
        popupData.viewTemplateUrl = data.viewTemplateUrl;
        popupData.event = ev;
        popupData.data = data.redirectData;
        BaseService.openTargetPopup(popupData);
        return false;
      }
      if (transactionName === vm.redirectLink.chart_of_accounts) {
        BaseService.goToChartOfAccountList();
        return false;
      }
      if (transactionName === vm.redirectLink.account_type) {
        BaseService.goToAccountTypeList();
        return false;
      }
      if (transactionName === vm.redirectLink.bank_mst) {
        BaseService.goToBankList();
        return false;
      }
      if (transactionName === vm.redirectLink.payable_payment_methods) {
        BaseService.goToGenericCategoryPayablePaymentMethodList();
        return false;
      }
      if (transactionName === vm.redirectLink.receivable_payment_methods) {
        BaseService.goToGenericCategoryReceivablePaymentMethodList();
        return false;
      }
      if (transactionName === vm.redirectLink.inspection_mst) {
        BaseService.goToPurchaseInspectionRequirement();
        return false;
      }
      // redirect to credit memo list page
      if (transactionName === vm.redirectLink.customer_packingslip_creditmemo) {
        BaseService.goToCustomerCreditMemoList();
        return false;
      }
      if (transactionName === vm.redirectLink.supplier_debit_memo) {
        BaseService.goToDebitMemoList();
        return false;
      }
      if (transactionName === vm.redirectLink.supplier_credit_memo) {
        BaseService.goToCreditMemoList();
        return false;
      }
      // redirect to transaction mode list page
      if (transactionName === vm.redirectLink.transaction_mode_payable || transactionName === vm.redirectLink.transaction_mode_receivable) {
        BaseService.goToTransactionModesList(transactionName === vm.redirectLink.transaction_mode_receivable ? USER.TransactionModesTabs.Receivable.Name : USER.TransactionModesTabs.Payable.Name, false);
        return false;
      }
      if (transactionName === vm.redirectLink.supplier_payment) {
        BaseService.goToSupplierPaymentList();
        return false;
      }
      if (transactionName === vm.redirectLink.supplier_refund) {
        BaseService.goToSupplierRefundList();
        return false;
      }
      //redirect to workorder serial
      if (transactionName == vm.redirectLink.workorder_serialmst) {
        BaseService.goToWorkorderList();
        return false;
      }
      if (transactionName === vm.redirectLink.contactperson) {
        BaseService.goToContactPersonList();
        return false;
      }
      if (transactionName === vm.redirectLink.packingslip_invoice_payment_cust_refund) {
        BaseService.goToCustomerRefundList();
        return false;
      }
      if (transactionName === vm.redirectLink.systemconfigrations) {
        BaseService.gotoDataKeyList();
        return false;
      }
    };

    vm.saveAliasPartsValidation = () => {
      $mdDialog.hide(true);
    };
    //close
    vm.close = () => {
      $mdDialog.cancel();
    };
    //cancel
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }

})();

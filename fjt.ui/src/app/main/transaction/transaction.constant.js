(function () {
  'use strict';
  /** @ngInject */
  var TRANSACTION = {
    TRANSACTION_LABEL: 'Transaction',
    TRANSACTION_ROUTE: '/transaction',
    TRANSACTION_STATE: 'app.transaction',
    TRANSACTION_CONTROLLER: '',
    TRANSACTION_VIEW: '',

    TRANSACTION_SALESORDER_LABEL: 'Sales Order',
    TRANSACTION_SALESORDER_ROUTE: '/salesorder',
    TRANSACTION_SALESORDER_STATE: 'app.transaction.salesorder',
    TRANSACTION_SALESORDER_CONTROLLER: 'SalesOrdersListController',
    TRANSACTION_SALESORDER_VIEW: 'app/main/transaction/salesorder/salesorder-list.html',

    TRANSACTION_SALESORDER_DETAILLIST_LABEL: 'Summary',
    TRANSACTION_SALESORDER_DETAILLIST_STATE: 'app.transaction.salesorder.detail',
    TRANSACTION_SALESORDER_DETAILLIST_ROUTE: '/detail',
    TRANSACTION_SALESORDER_DETAILLIST_CONTROLLER: 'SalesOrderDetailController',
    TRANSACTION_SALESORDER_DETAILLIST_VIEW: 'app/main/transaction/salesorder/sales-order-detail-list.html',

    TRANSACTION_SALESORDER_DETAILLIST_PART_LABEL: 'Detail Per Line',
    TRANSACTION_SALESORDER_DETAILLIST_PART_STATE: 'app.transaction.salesorder.partdetail',
    TRANSACTION_SALESORDER_DETAILLIST_PART_ROUTE: '/partdetail?soNumber?soStatus',
    TRANSACTION_SALESORDER_DETAILLIST_PART_CONTROLLER: 'SalesOrderPartDetailController',
    TRANSACTION_SALESORDER_DETAILLIST_PART_VIEW: 'app/main/transaction/salesorder/sales-order-part-detail-list.html',

    TRANSACTION_SALESORDER_DETAIL_LABEL: 'Details',
    TRANSACTION_SALESORDER_DETAIL_ROUTE: '/manage/:sID?blanketPOID?partID',
    TRANSACTION_SALESORDER_DETAIL_STATE: 'app.transaction.salesorder.main.manage',
    TRANSACTION_SALESORDER_DETAIL_CONTROLLER: 'ManageSalesOrderController',
    TRANSACTION_SALESORDER_DETAIL_VIEW: 'app/main/transaction/salesorder/manage-salesorder.html',

    TRANSACTION_SALESORDER_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_SALESORDER_DOCUMENT_ROUTE: '/documents/:sID',
    TRANSACTION_SALESORDER_DOCUMENT_STATE: 'app.transaction.salesorder.main.documents',
    TRANSACTION_SALESORDER_DOCUMENT_CONTROLLER: 'ManageSalesOrderDocument',
    TRANSACTION_SALESORDER_DOCUMENT_VIEW: 'app/main/transaction/salesorder/manage-salesorder-documents.html',

    TRANSACTION_SALESORDER_MISC_LABEL: 'MISC',
    TRANSACTION_SALESORDER_MISC_ROUTE: '/misc/:sID',
    TRANSACTION_SALESORDER_MISC_STATE: 'app.transaction.salesorder.main.misc',
    TRANSACTION_SALESORDER_MISC_CONTROLLER: 'ManageSalesOrderMISCController',
    TRANSACTION_SALESORDER_MISC_VIEW: 'app/main/transaction/salesorder/manage-salesorder-misc.html',

    TRANSACTION_SALESORDER_MAIN_ROUTE: '/salesorder',
    TRANSACTION_SALESORDER_MAIN_STATE: 'app.transaction.salesorder.main',
    TRANSACTION_SALESORDER_MAIN_CONTROLLER: 'ManageSalesOrderMainController',
    TRANSACTION_SALESORDER_MAIN_VIEW: 'app/main/transaction/salesorder/manage-salesorder-main.html',

    TRANSACTION_CHANGE_HISTORY_CONTROLLER: 'SalesOrdersDataEntryController',
    TRANSACTION_CHANGE_HISTORY_VIEW: 'app/main/transaction/salesorder/salesorder-dataentry-auditlog-list-popup.html',

    TRANSACTION_PLANN_PURCHASE_CONTROLLER: 'PlannPurchasePopupController',
    TRANSACTION_PLANN_PURCHASE_VIEW: 'app/core/component/plann-purchase-popup/plann-purchase-popup.html',

    TRANSACTION_CANCLE_REASON_CONTROLLER: 'SalesOrdersCancleReasonController',
    TRANSACTION_CANCLE_REASON_VIEW: 'app/main/transaction/salesorder/salesorder-cancle-reason-popup.html',

    TRANSACTION_SHIPPED_LABEL: 'Shipped Assembly',
    TRANSACTION_SHIPPED_ROUTE: '/shipped',
    TRANSACTION_SHIPPED_STATE: 'app.transaction.shipped',
    TRANSACTION_SHIPPED_CONTROLLER: 'ShippedAssemblyListController',
    TRANSACTION_SHIPPED_VIEW: 'app/main/transaction/shippedassembly/shippedassembly-list.html',

    TRANSACTION_MANAGESHIPPED_LABEL: 'Manage Shipped Assembly',
    TRANSACTION_MANAGESHIPPED_ROUTE: '/manageshipped/:owID',
    TRANSACTION_MANAGESHIPPED_STATE: 'app.transaction.shipped.manage',
    TRANSACTION_MANAGESHIPPED_CONTROLLER: 'ManageShippedAssemblyController',
    TRANSACTION_MANAGESHIPPED_VIEW: 'app/main/transaction/shippedassembly/manageshippedassembly.html',

    //TRANSACTION_WAREHOUSEBIN_LABEL: 'WarehouseBin',
    //TRANSACTION_WAREHOUSEBIN_STATE: 'app.transaction.warehousebin',
    //TRANSACTION_WAREHOUSEBIN_ROUTE: '/warehouse',
    TRANSACTION_WAREHOUSEBIN_CONTROLLER: 'WareHouseBinController',
    TRANSACTION_WAREHOUSEBIN_VIEW: 'app/main/transaction/warehouse-bin/warehouse-bin.html',

    TRANSACTION_WAREHOUSE_LABEL: 'Warehouse',
    TRANSACTION_WAREHOUSE_STATE: 'app.transaction.warehousebin',
    TRANSACTION_WAREHOUSE_ROUTE: '/warehouse/:warehousetype',
    TRANSACTION_WAREHOUSE_CONTROLLER: 'WarehouseController',
    TRANSACTION_WAREHOUSE_VIEW: 'app/main/transaction/warehouse-bin/warehouse.html',

    TRANSACTION_INOVAXEHISTORY_LABEL: 'Transaction Request Response',
    TRANSACTION_INOVAXEHISTORY_STATE: 'app.transaction.inovaxenotification',
    TRANSACTION_INOVAXEHISTORY_ROUTE: '/inovaxenotification',
    TRANSACTION_INOVAXEHISTORY_CONTROLLER: 'InovaxeNotificationHistoryController',
    TRANSACTION_INOVAXEHISTORY_VIEW: 'app/main/transaction/inovaxe-notification-history/inovaxe-notification-history.html',


    TRANSACTION_INOVAXELOG_STATE: 'app.transaction.inovaxenotification.all',
    TRANSACTION_INOVAXELOG_ROUTE: '/all',
    TRANSACTION_INOVAXELOG_CONTROLLER: 'InovaxeNotificationLogController',
    TRANSACTION_INOVAXELOG_VIEW: 'app/main/transaction/inovaxe-notification-log/inovaxe-notification-log.html',

    TRANSACTION_INOVAXESERVERLOG_LABEL: 'Server Heartbeat Status History',
    TRANSACTION_INOVAXESERVERLOG_STATE: 'app.transaction.inovaxenotification.serverstatus',
    TRANSACTION_INOVAXESERVERLOG_ROUTE: '/serverlog',
    TRANSACTION_INOVAXESERVERLOG_CONTROLLER: 'InovaxeNotificationServerStatusHistoryController',
    TRANSACTION_INOVAXESERVERLOG_VIEW: 'app/main/transaction/inovaxe-notification-history/inovaxe-notification-server-status-history.html',

    TRANSACTION_INOVAXEUNAUTHORIZELOG_LABEL: 'Unauthorized Notification',
    TRANSACTION_INOVAXEUNAUTHORIZELOG_STATE: 'app.transaction.unauthorize',
    //TRANSACTION_INOVAXEUNAUTHORIZELOG_STATE: 'app.transaction.unauthorize',
    TRANSACTION_INOVAXEUNAUTHORIZELOG_ROUTE: '/unauthorize',
    TRANSACTION_INOVAXEUNAUTHORIZELOG_CONTROLLER: 'InovaxeNotificationUnAuthorizeHistoryController',
    TRANSACTION_INOVAXEUNAUTHORIZELOG_VIEW: 'app/main/transaction/inovaxe-notification-history/inovaxe-notification-unauthorize-history.html',

    TRANSACTION_INOVAXECARTSTATUSLOG_LABEL: 'Cart Heartbeat Status History',
    TRANSACTION_INOVAXECARTSTATUSLOG_STATE: 'app.transaction.inovaxenotification.cartstatus',
    TRANSACTION_INOVAXECARTSTATUSLOG_ROUTE: '/cartstatus',
    TRANSACTION_INOVAXECARTSTATUSLOG_CONTROLLER: 'InovaxeNotificationCartStatusHistoryController',
    TRANSACTION_INOVAXECARTSTATUSLOG_VIEW: 'app/main/transaction/inovaxe-notification-history/inovaxe-notification-cart-status-history.html',

    TRANSACTION_MANAGEWAREHOUSE_STATE: 'app.transaction.managewarehouse',
    TRANSACTION_MANAGEWAREHOUSE_ROUTE: '/warehouse/managewarehouse/:id',
    TRANSACTION_MANAGEWAREHOUSE_CONTROLLER: 'ManageWarehouseController',
    TRANSACTION_MANAGEWAREHOUSE_VIEW: 'app/main/transaction/warehouse-bin/manage-warehouse.html',

    TRANSACTION_BIN_LABEL: 'Bin',
    TRANSACTION_BIN_STATE: 'app.transaction.bin',
    TRANSACTION_BIN_ROUTE: '/bin/:warehouseId/:warehousetype',
    TRANSACTION_BIN_CONTROLLER: 'BinController',
    TRANSACTION_BIN_VIEW: 'app/main/transaction/warehouse-bin/bin/bin.html',

    TRANSACTION_BIN_ADD_UPDATE_MODAL_CONTROLLER: 'BinAddUpdatePopupController',
    TRANSACTION_BIN_ADD_UPDATE_MODAL_VIEW: 'app/main/transaction/warehouse-bin/bin/bin-add-update-popup.html',

    TRANSACTION_RACK_LABEL: 'Rack',
    TRANSACTION_RACK_STATE: 'app.transaction.rack',
    TRANSACTION_RACK_ROUTE: '/rack',
    TRANSACTION_RACK_CONTROLLER: 'RackController',
    TRANSACTION_RACK_VIEW: 'app/main/transaction/warehouse-bin/rack/rack-list.html',

    TRANSACTION_RACK_ADD_UPDATE_MODAL_CONTROLLER: 'RackAddUpdatePopupController',
    TRANSACTION_RACK_ADD_UPDATE_MODAL_VIEW: 'app/main/transaction/warehouse-bin/rack/rack-add-update-popup.html',

    TRANSACTION_UNAUTHORIZE_CLEAER_CONTROLLER: 'ClearRequestReasonController',
    TRANSACTION_UNAUTHORIZE_CLEAER_MODAL_VIEW: 'app/main/transaction/inovaxe-notification-history/Inovaxe-unauthorize-clear-reason-popup.html',

    TRANSACTION_RECEIVINGMATERIAL_LABEL: 'Receiving Material',
    TRANSACTION_RECEIVINGMATERIAL_ROUTE: '/receivingmaterial',
    TRANSACTION_RECEIVINGMATERIAL_STATE: 'app.transaction.receivingmaterial',
    TRANSACTION_RECEIVINGMATERIAL_CONTROLLER: 'ReceiveMaterialListController',
    TRANSACTION_RECEIVINGMATERIAL_VIEW: 'app/main/transaction/receive-material/receive-material.html',

    TRANSACTION_RECEIVINGMATERIAL_LIST_LABEL: 'Receiving Material',
    TRANSACTION_RECEIVINGMATERIAL_LIST_ROUTE: '/list/:whId/:binId/:refSalesOrderDetID/:assyID?keywords',
    TRANSACTION_RECEIVINGMATERIAL_LIST_STATE: 'app.transaction.receivingmaterial.list',
    TRANSACTION_RECEIVINGMATERIAL_LIST_CONTROLLER: 'ReceivingMaterialListController',
    TRANSACTION_RECEIVINGMATERIAL_LIST_VIEW: 'app/main/transaction/receiving-material/receiving-material-list.html',

    TRANSACTION_MANAGERECEIVINGMATERIAL_LABEL: 'Manage Receiving Material',
    TRANSACTION_MANAGERECEIVINGMATERIAL_ROUTE: '/managereceivingmaterial/:id',
    TRANSACTION_MANAGERECEIVINGMATERIAL_STATE: 'app.transaction.receivingmaterial.manage',
    TRANSACTION_MANAGERECEIVINGMATERIAL_CONTROLLER: 'ManageReceivingMaterialController',
    TRANSACTION_MANAGERECEIVINGMATERIAL_VIEW: 'app/main/transaction/receiving-material/receiving-material.html',

    TRANSACTION_REQUEST_FOR_SHIP_LIST_LABEL: 'Request For Shipment',
    TRANSACTION_REQUEST_FOR_SHIP_LIST_ROUTE: '/requestforship',
    TRANSACTION_REQUEST_FOR_SHIP_LIST_STATE: 'app.transaction.requestforship',
    TRANSACTION_REQUEST_FOR_SHIP_LIST_CONTROLLER: 'RequestForShipListController',
    TRANSACTION_REQUEST_FOR_SHIP_LIST_VIEW: 'app/main/transaction/request-for-ship/request-for-ship-list.html',

    TRANSACTION_MANAGE_REQUEST_FOR_SHIP_LABEL: 'Manage Request For Shipment',
    TRANSACTION_MANAGE_REQUEST_FOR_SHIP_ROUTE: '/managerequestforship',
    TRANSACTION_MANAGE_REQUEST_FOR_SHIP_STATE: 'app.transaction.requestforship.manage',
    TRANSACTION_MANAGE_REQUEST_FOR_SHIP_CONTROLLER: 'ManageRequestForShipController',
    TRANSACTION_MANAGE_REQUEST_FOR_SHIP_VIEW: 'app/main/transaction/request-for-ship/manage-request-for-ship/manage-request-for-ship.html',
    TRANSACTION_MANAGE_DETAIL_ROUTE: '/detail/:id',
    TRANSACTION_MANAGE_DETAIL_STATE: 'app.transaction.requestforship.manage.details',
    TRANSACTION_MANAGE_APPROVAL_ROUTE: '/approval/:id',
    TRANSACTION_MANAGE_APPROVAL_STATE: 'app.transaction.requestforship.manage.approval',

    TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_LABEL: 'In House Assembly Stock',
    TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_ROUTE: '/inhouseassemblystock',
    TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_STATE: 'app.transaction.inhouseassemblystock',
    TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_CONTROLLER: 'InHouseAssemblyStockListController',
    TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_VIEW: 'app/main/transaction/in-house-assembly-stock/in-house-assembly-stock-list.html',

    TRANSACTION_CPN_MANAGERECEIVINGMATERIAL_LABEL: 'Manage CPN (Component) Receiving Material',
    TRANSACTION_CPN_MANAGERECEIVINGMATERIAL_ROUTE: '/managecpnreceivingmaterial/:id',
    TRANSACTION_CPN_MANAGERECEIVINGMATERIAL_STATE: 'app.transaction.receivingmaterial.cpnreceive',
    TRANSACTION_CPN_MANAGERECEIVINGMATERIAL_CONTROLLER: 'ManageReceivingMaterialController',
    TRANSACTION_CPN_MANAGERECEIVINGMATERIAL_VIEW: 'app/main/transaction/receiving-material/receiving-material.html',

    TRANSACTION_PARTTOKIT_MANAGERECEIVINGMATERIAL_LABEL: 'Manage Reserve Stock Material',
    TRANSACTION_PARTTOKIT_MANAGERECEIVINGMATERIAL_ROUTE: '/managereservestockmaterial/:id',
    TRANSACTION_PARTTOKIT_MANAGERECEIVINGMATERIAL_STATE: 'app.transaction.receivingmaterial.reservestock',
    TRANSACTION_PARTTOKIT_MANAGERECEIVINGMATERIAL_CONTROLLER: 'ManageReceivingMaterialController',
    TRANSACTION_PARTTOKIT_MANAGERECEIVINGMATERIAL_VIEW: 'app/main/transaction/receiving-material/receiving-material.html',

    TRANSACTION_SALESORDER_QTY_CONTROLLER: 'SalesOrderShippedQtyPopupController',
    TRANSACTION_SALESORDER_QTY_VIEW: 'app/main/transaction/salesorder/sales-order-shipped-qty-popup.html',

    TRANSACTION_EXPANDABLEJS: 'app/main/transaction/salesorder/salesorderdetail.html',

    ADD_REQUEST_FOR_SHIP_MODAL_CONTROLLER: 'AddRequestForShipController',
    ADD_REQUEST_FOR_SHIP_MODAL_VIEW: 'app/main/transaction/request-for-ship/add-request-for-ship-popup/add-request-for-ship-popup.html',

    SELECT_PART_MODAL_CONTROLLER: 'SelectPartPopUpController',
    SELECT_PART_MODAL_VIEW: 'app/main/transaction/receiving-material/select-part-popup.html',

    SELECT_MULTI_COMPONENT_MODAL_CONTROLLER: 'SelectMultiPartComponentPopUpController',
    SELECT_MULTI_COMPONENT_MODAL_VIEW: 'app/core/component/select-multipart-component-popup/select-multipart-component-popup.html',

    SELECT_BARCODE_MODAL_CONTROLLER: 'SelectBarcodePopUpController',
    SELECT_BARCODE_MODAL_VIEW: 'app/main/transaction/receiving-material/select-barcode-popup.html',

    ALLOCATED_KIT_CONTROLLER: 'AllocatedKitPopUpController',
    ALLOCATED_KIT_VIEW: 'app/main/transaction/receiving-material/allocated-kit-popup.html',

    ADD_RESERVE_STOCK_MODAL_CONTROLLER: 'AddReserveStockPopUpController',
    ADD_RESERVE_STOCK_MODAL_VIEW: 'app/main/transaction/receiving-material/add-reserve-stock-popup.html',

    ADD_SUPPLIER_QUOTE_MODAL_CONTROLLER: 'AddSupplierQuotePopUpController',
    ADD_SUPPLIER_QUOTE_MODAL_VIEW: 'app/main/transaction/supplier-quote/add-supplier-quote-popup/add-supplier-quote-popup.html',

    TRANSACTION_UMID_DOCUMENT_LABEL: 'UMID Document',
    TRANSACTION_UMID_DOCUMENT_ROUTE: '/document/:id',
    TRANSACTION_UMID_DOCUMENT_STATE: 'app.transaction.receivingmaterial.umiddocument',
    TRANSACTION_UMID_DOCUMENT_CONTROLLER: 'UMIDDocumentController',
    TRANSACTION_UMID_DOCUMENT_VIEW: 'app/main/transaction/receiving-material/umid-document.html',

    TRANSACTION_COFC_DOCUMENT_LABEL: 'COFC Document',
    TRANSACTION_COFC_DOCUMENT_ROUTE: '/cofcdocument/:id',
    TRANSACTION_COFC_DOCUMENT_STATE: 'app.transaction.receivingmaterial.cofcdocument',
    TRANSACTION_COFC_DOCUMENT_CONTROLLER: 'COFCDocumentController',
    TRANSACTION_COFC_DOCUMENT_VIEW: 'app/main/transaction/receiving-material/cofc-document.html',

    TRANSACTION_PARENT_UMID_DOCUMENT_LABEL: 'Origin UMID Document',
    TRANSACTION_PARENT_UMID_DOCUMENT_ROUTE: '/parentdocument/:id',
    TRANSACTION_PARENT_UMID_DOCUMENT_STATE: 'app.transaction.receivingmaterial.parentumiddocument',
    TRANSACTION_PARENT_UMID_DOCUMENT_CONTROLLER: 'ParentUMIDDocumentController',
    TRANSACTION_PARENT_UMID_DOCUMENT_VIEW: 'app/main/transaction/receiving-material/parent-umid-document.html',

    TRANSACTION_VERIFICATIONHISTORY_LABEL: 'Verification History',
    TRANSACTION_VERIFICATIONHISTORY_ROUTE: '/verificationhistory/:id',
    TRANSACTION_VERIFICATIONHISTORY_STATE: 'app.transaction.receivingmaterial.verificationhistory',
    TRANSACTION_VERIFICATIONHISTORY_CONTROLLER: 'VerificationHistoryController',
    TRANSACTION_VERIFICATIONHISTORY_VIEW: 'app/main/transaction/verification-history/verification-history.html',

    TRANSACTION_TRANSFER_STOCK_LABEL: 'Transfer Material',
    TRANSACTION_TRANSFER_STOCK_ROUTE: '/transfermaterial/:whId/:sodId/:assyId',
    TRANSACTION_TRANSFER_STOCK_STATE: 'app.transaction.transfermaterial',
    TRANSACTION_TRANSFER_STOCK_CONTROLLER: 'TransferStockController',
    TRANSACTION_TRANSFER_STOCK_VIEW: 'app/main/transaction/transfer-stock/transfer-stock.html',

    TRANSACTION_TRANSFER_STOCK_HISTORY_CONTROLLER: 'TransferStockHistoryController',
    TRANSACTION_TRANSFER_STOCK_HISTORY_VIEW: 'app/main/transaction/transfer-stock/transfer-stock-history.html',

    UID_TRANSFER_CONTROLLER: 'UIDTransferPopUpController',
    UID_TRANSFER_VIEW: 'app/main/transaction/receiving-material/uid-transfer-popup.html',

    UID_TRANSFER_DEALLOCATION_VERIFACTION_CONTROLLER: 'UIDTransferDeallocationVerificationPopUpController',
    UID_TRANSFER_DEALLOCATION_VERIFACTION_VIEW: 'app/main/transaction/receiving-material/uid-transfer-deallocation-verifaction-popup.html',

    DUPLICATE_WAREHOUSE_BIN_CONTROLLER: 'DuplicateWarehouseBinPopupController',
    DUPLICATE_WAREHOUSE_BIN_VIEW: 'app/main/transaction/warehouse-bin/duplicate-warehouse-bin-popup.html',

    TRANSACTION_MATERIAL_MANAGEMENT: 'Material Management',
    TRANSACTION_MATERIAL_RECEIVE_LABEL: 'Material Receipt',
    TRANSACTION_MATERIAL_RECEIVE_ROUTE: '/materialreceipt/:type',
    TRANSACTION_MATERIAL_RECEIVE_STATE: 'app.transaction.materialreceipt',
    TRANSACTION_MATERIAL_RECEIVE_CONTROLLER: 'PackingSlipController',
    TRANSACTION_MATERIAL_RECEIVE_VIEW: 'app/main/transaction/packing-slip/packing-slip.html',

    TRANSACTION_MANAGE_MATERIAL_RECEIVE_LABEL: 'Manage Packing Slip',
    TRANSACTION_MANAGE_MATERIAL_RECEIVE_ROUTE: '/manage/:type/:id',
    TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE: 'app.transaction.materialreceipt.manage',
    TRANSACTION_MANAGE_MATERIAL_RECEIVE_CONTROLLER: 'ManagePackingSlipController',
    TRANSACTION_MANAGE_MATERIAL_RECEIVE_VIEW: 'app/main/transaction/packing-slip/packing-slip-manage.html',

    TRANSACTION_SUPPLIER_INVOICE_LABEL: 'Supplier Invoices',
    TRANSACTION_SUPPLIER_INVOICE_ROUTE: '/supplierinvoices/:type',
    TRANSACTION_SUPPLIER_INVOICE_STATE: 'app.transaction.supplierinvoices',
    TRANSACTION_SUPPLIER_INVOICE_CONTROLLER: 'SupplierInvoiceController',
    TRANSACTION_SUPPLIER_INVOICE_VIEW: 'app/main/transaction/supplier-invoice/supplier-invoice.html',

    TRANSACTION_KIT_ALLOCATION_LABEL: 'Kit Allocation',
    TRANSACTION_KIT_ALLOCATION_ROUTE: '/kitallocation/:id/:partId/:mountingTypeId',
    TRANSACTION_KIT_ALLOCATION_STATE: 'app.transaction.kitAllocation',
    TRANSACTION_KIT_ALLOCATION_CONTROLLER: 'KitAllocationController',
    TRANSACTION_KIT_ALLOCATION_VIEW: 'app/main/transaction/kit-allocation/kit-allocation.html',

    TRANSACTION_KIT_PREPARATION_ROUTE: '/kitpreparation/:id/:partId/:mountingTypeId',
    TRANSACTION_KIT_PREPARATION_STATE: 'app.transaction.kitPreparation',

    TRANSACTION_SUPPLIER_QUOTE_LABEL: 'Supplier Quote',
    TRANSACTION_SUPPLIER_QUOTE_ROUTE: '/supplierquote',
    TRANSACTION_SUPPLIER_QUOTE_STATE: 'app.transaction.supplierquote',
    TRANSACTION_SUPPLIER_QUOTE_CONTROLLER: 'SupplierQuoteController',
    TRANSACTION_SUPPLIER_QUOTE_VIEW: 'app/main/transaction/supplier-quote/supplier-quote-list.html',

    TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_LABEL: 'Summary',
    TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_STATE: 'app.transaction.supplierquote.summary',
    TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_ROUTE: '/summarylist',
    TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_CONTROLLER: 'SupplierQuoteDetailController',
    TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_VIEW: 'app/main/transaction/supplier-quote/supplier-quote-detail-list.html',

    TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_LABEL: 'Detail Per Line',
    TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_STATE: 'app.transaction.supplierquote.detail',
    TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_ROUTE: '/detaillist?quote',
    TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_CONTROLLER: 'SupplierQuotePartDetailController',
    TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_VIEW: 'app/main/transaction/supplier-quote/supplier-quote-part-detail-list.html',

    TRANSACTION_MANAGE_SUPPLIER_QUOTE_LABEL: 'Manage Supplier Quote',
    TRANSACTION_MANAGE_SUPPLIER_QUOTE_ROUTE: '/manage/:id?keywords',
    TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE: 'app.transaction.supplierquote.manage',
    TRANSACTION_MANAGE_SUPPLIER_QUOTE_CONTROLLER: 'ManageSupplierQuoteController',
    TRANSACTION_MANAGE_SUPPLIER_QUOTE_VIEW: 'app/main/transaction/supplier-quote/manage-supplier-quote.html',

    TRANSACTION_MANAGE_SUPPLIER_QUOTE_DOCUMENTS_ROUTE: '/documents/:id',
    TRANSACTION_MANAGE_SUPPLIER_QUOTE_DOCUMENTS_STATE: 'app.transaction.supplierquote.documents',

    VERIFICATION_PACKAGING_CONTROLLER: 'VerificationPackagingSlipController',
    VERIFICATION_PACKAGING_VIEW: 'app/main/transaction/packing-slip/verification-packing-slip-popup.html',

    PURCHASE_COMMENT_VIEW_POPUP_CONTROLLER: 'PurchaseCommentViewPopupController',
    PURCHASE_COMMENT_VIEW_POPUP_VIEW: 'app/main/transaction/packing-slip/purchase-comment-view-popup.html',

    PAID_VERIFICATION_PACKAGING_CONTROLLER: 'PaidVerificationPackagingController',
    PAID_VERIFICATION_PACKAGING_VIEW: 'app/main/transaction/packing-slip/paid-verification-packing-popup.html',

    INVOICE_REFUND_POPUP_CONTROLLER: 'InvoiceRefundPopupController',
    INVOICE_REFUND_POPUP_VIEW: 'app/main/transaction/supplier-invoice/invoice-refund-popup.html',

    SUPPLIER_BALANCE_AND_PAST_DUE_POPUP_CONTROLLER: 'SupplierInvoiceCurrentBalanceAndPastDuePopup',
    SUPPLIER_BALANCE_AND_PAST_DUE_POPUP_VIEW: 'app/main/transaction/packing-slip/supplier-invoice-current-balalce-and-past-due-popup.html',

    STATUS_FILTER_CONTROLLER: 'StatusFilterController',
    STATUS_FILTER_VIEW: 'app/main/transaction/packing-slip/status-filter-popup.html',

    TRANSACTION_RESERVE_STOCK_REQUEST_LABEL: 'Reserve Stock Request',
    TRANSACTION_RESERVE_STOCK_REQUEST_ROUTE: '/reservestockrequest',
    TRANSACTION_RESERVE_STOCK_REQUEST_STATE: 'app.transaction.reservestockrequest',
    TRANSACTION_RESERVE_STOCK_REQUEST_CONTROLLER: 'ReserveStockRequestController',
    TRANSACTION_RESERVE_STOCK_REQUEST_VIEW: 'app/main/transaction/reserve-stock-request/reserve-stock-request.html',

    RESERVE_STOCK_REQUEST_POPUP_CONTROLLER: 'ReserveStockRequestPopupController',
    RESERVE_STOCK_REQUEST_POPUP_VIEW: 'app/core/component/reserve-stock-request-popup/reserve-stock-request-popup.html',

    STOCK_ALLOCATE_POPUP_CONTROLLER: 'StockAllocatePopUpController',
    STOCK_ALLOCATE_POPUP_VIEW: 'app/main/transaction/kit-allocation/stock-allocate-popup.html',

    TRANSACTION_NONUMIDSTOCK_LABEL: 'Non-UMID Stock List',
    TRANSACTION_NONUMIDSTOCK_ROUTE: '/nonumidstocklist/:whId/:binId?keywords',
    TRANSACTION_NONUMIDSTOCK_STATE: 'app.transaction.receivingmaterial.nonumidstocklist',
    TRANSACTION_NONUMIDSTOCK_CONTROLLER: 'NonUMIDStockController',
    TRANSACTION_NONUMIDSTOCK_VIEW: 'app/main/transaction/non-umid-stock/non-umid-stock.html',

    ADD_INVOICE_CONTROLLER: 'AddInvoiceController',
    ADD_INVOICE_VIEW: 'app/main/transaction/packing-slip/add-invoice-popup.html',

    INVOICE_DETAIL_NOTE_POPUP_CONTROLLER: 'InvoiceDetailNotePopUpController',
    INVOICE_DETAIL_NOTE_POPUP_VIEW: 'app/main/transaction/packing-slip/invoice-detail-note-popup.html',

    SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER: 'SupplierInvoicePaymentTransactionListPopupController',
    SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW: 'app/core/component/supplier-invoice-payment-transaction-list-popup/supplier-invoice-payment-transaction-list-popup.html',

    SELECT_SUPPLIER_INVOICE_POPUP_CONTROLLER: 'SelectSupplierInvoicePopupController',
    SELECT_SUPPLIER_INVOICE_POPUP_VIEW: 'app/core/component/select-supplier-invoice-popup/select-supplier-invoice-popup.html',

    FULL_KIT_ALLOCATION_POPUP_CONTROLLER: 'FullKitAllocationPopUpController',
    FULL_KIT_ALLOCATION_POPUP_VIEW: 'app/main/transaction/receiving-material/full-kit-allocation-popup.html',

    TRANSACTION_PURCHASE_LABEL: 'Purchase List',
    TRANSACTION_PURCHASE_ROUTE: '/purchase/:id/:partId',
    TRANSACTION_PURCHASE_STATE: 'app.transaction.purchase',
    TRANSACTION_PURCHASE_CONTROLLER: 'PurchaseController',
    TRANSACTION_PURCHASE_VIEW: 'app/main/transaction/purchase-management/purchase/manage-purchase.html',

    MANAGE_PURCHASE_MODAL_CONTROLLER: 'ManagePurchasePopupController',
    MANAGE_PURCHASE_MODAL_VIEW: 'app/main/transaction/purchase-management/purchase/manage-purchase-popup.html',

    TRANSACTION_PURCHASE_LIST_LABEL: 'MRP List',
    TRANSACTION_PURCHASE_LIST_ROUTE: '/purchaselist',
    TRANSACTION_PURCHASE_LIST_STATE: 'app.transaction.purchaselist',
    TRANSACTION_PURCHASE_LIST_CONTROLLER: 'KitListController',
    TRANSACTION_PURCHASE_LIST_VIEW: 'app/main/transaction/kit-allocation/kit-list.html',
    /*while change in kit allocation list page please take care for purchase list page also
     reason: same page is used as purchase list page (cross check your changes)*/
    KIT_LIST_LABEL: 'Kit List',
    KIT_LIST_ROUTE: '/kitlist',
    KIT_LIST_STATE: 'app.transaction.kitlist',
    KIT_LIST_CONTROLLER: 'KitListController',
    KIT_LIST_VIEW: 'app/main/transaction/kit-allocation/kit-list.html',

    SUB_KIT_LIST_LABEL: 'Sub Assembly Kit List',
    SUB_KIT_LIST_ROUTE: '/subkitlist',
    SUB_KIT_LIST_STATE: 'app.transaction.subkitlist',
    SUB_KIT_LIST_CONTROLLER: 'KitListController',
    SUB_KIT_LIST_VIEW: 'app/main/transaction/kit-allocation/kit-list.html',

    KIT_FEASIBILITY_POPUP_CONTROLLER: 'KitFeasibilityPopUpController',
    KIT_FEASIBILITY_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-feasibility-popup.html',

    KIT_RELEASE_POPUP_CONTROLLER: 'KitReleasePopUpController',
    KIT_RELEASE_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-release-popup.html',

    KIT_RELEASE_MISMATCH_INVENTORY_POPUP_CONTROLLER: 'KitReleaseMismatchInventoryPopUpController',
    KIT_RELEASE_MISMATCH_INVENTORY_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-release-mismatch-inventory-popup.html',

    KIT_RELEASE_HISTORY_POPUP_CONTROLLER: 'KitReleaseHistoryPopUpController',
    KIT_RELEASE_HISTORY_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-release-history-popup.html',

    KIT_RELEASE_SUMMARY_POPUP_CONTROLLER: 'KitReleaseSummaryPopUpController',
    KIT_RELEASE_SUMMARY_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-release-summary-popup.html',

    RESTRICT_UMID_POPUP_CONTROLLER: 'RestrictUMIDPopUpController',
    RESTRICT_UMID_POPUP_VIEW: 'app/main/transaction/receiving-material/restrict-umid-popup.html',

    RESTRICT_UMID_HISTORY_POPUP_CONTROLLER: 'RestrictUMIDHistoryPopUpController',
    RESTRICT_UMID_HISTORY_POPUP_VIEW: 'app/main/transaction/receiving-material/restrict-umid-history-popup.html',

    SELECT_BOM_LINEITEM_POPUP_CONTROLLER: 'SelectBOMLineItemPopUpController',
    SELECT_BOM_LINEITEM_POPUP_VIEW: 'app/main/transaction/receiving-material/select-bom-lineitem-popup.html',

    TRANSACTION_INVOICE_PACKING_SLIP_LABEL: 'Packing Slip',
    TRANSACTION_INVOICE_PACKING_SLIP_STATE: 'app.transaction.invoicepackingslip',
    TRANSACTION_INVOICE_PACKING_SLIP_ROUTE: '/supplierinvoice/packingslip',
    TRANSACTION_INVOICE_PACKING_SLIP_CONTROLLER: 'InvoicePackingSlipController',
    TRANSACTION_INVOICE_PACKING_SLIP_VIEW: 'app/main/transaction/supplier-invoice/invoice-packing-slip.html',

    TRANSACTION_INVOICE_TARIFF_LABEL: 'Invoice',
    TRANSACTION_INVOICE_TARIFF_STATE: 'app.transaction.invoicetariff',
    TRANSACTION_INVOICE_TARIFF_ROUTE: '/supplierinvoice/invoice?mfgCodeID?termsAndAboveDays?dueDate?additionalDays',
    TRANSACTION_INVOICE_TARIFF_CONTROLLER: 'InvoiceTariffController',
    TRANSACTION_INVOICE_TARIFF_VIEW: 'app/main/transaction/supplier-invoice/invoice-tariff.html',

    TRANSACTION_INVOICE_RMA_LABEL: 'RMA',
    TRANSACTION_INVOICE_RMA_STATE: 'app.transaction.invoicesupplierrma',
    TRANSACTION_INVOICE_RMA_ROUTE: '/supplierinvoice/supplierrma',
    TRANSACTION_INVOICE_RMA_CONTROLLER: 'InvoiceSupplierRMAController',
    TRANSACTION_INVOICE_RMA_VIEW: 'app/main/transaction/supplier-invoice/invoice-supplier-rma.html',

    SUPPLIER_RMA_CREATE_POPUP_CONTROLLER: 'AddSupplierRMAPopUpController',
    SUPPLIER_RMA_CREATE_POPUP_VIEW: 'app/core/component/supplier-rma-create-popup/supplier-rma-create-popup.html',

    TRANSACTION_INVOICE_CREDIT_MEMO_LABEL: 'Credit Memo',
    TRANSACTION_INVOICE_CREDIT_MEMO_STATE: 'app.transaction.invoicecreditmemo',
    TRANSACTION_INVOICE_CREDIT_MEMO_ROUTE: '/supplierinvoice/creditmemo',
    TRANSACTION_INVOICE_CREDIT_MEMO_CONTROLLER: 'InvoiceCreditMemoController',
    TRANSACTION_INVOICE_CREDIT_MEMO_VIEW: 'app/main/transaction/supplier-invoice/invoice-credit-memo.html',

    TRANSACTION_INVOICE_DEBIT_MEMO_LABEL: 'Debit Memo',
    TRANSACTION_INVOICE_DEBIT_MEMO_STATE: 'app.transaction.invoicedebitmemo',
    TRANSACTION_INVOICE_DEBIT_MEMO_ROUTE: '/supplierinvoice/debitmemo',
    TRANSACTION_INVOICE_DEBIT_MEMO_CONTROLLER: 'InvoiceDebitMemoController',
    TRANSACTION_INVOICE_DEBIT_MEMO_VIEW: 'app/main/transaction/supplier-invoice/invoice-debit-memo.html',

    TRANSACTION_INVOICE_PAYMENT_LABEL: 'Payment',
    TRANSACTION_INVOICE_PAYMENT_STATE: 'app.transaction.invoicepayment',
    TRANSACTION_INVOICE_PAYMENT_ROUTE: '/supplierinvoice/paymenthistory',
    TRANSACTION_INVOICE_PAYMENT_CONTROLLER: 'InvoicePaymentController',
    TRANSACTION_INVOICE_PAYMENT_VIEW: 'app/main/transaction/supplier-invoice/invoice-payment.html',

    TRANSACTION_INVOICE_REFUND_LABEL: 'Refund',
    TRANSACTION_INVOICE_REFUND_STATE: 'app.transaction.invoicerefund',
    TRANSACTION_INVOICE_REFUND_ROUTE: '/supplierinvoice/refund',
    TRANSACTION_INVOICE_REFUND_CONTROLLER: 'InvoiceRefundController',
    TRANSACTION_INVOICE_REFUND_VIEW: 'app/main/transaction/supplier-invoice/invoice-refund.html',

    TRANSACTION_MANAGE_SUPPLIER_INVOICE_LABEL: 'Manage Supplier Invoices',
    TRANSACTION_MANAGE_SUPPLIER_INVOICE_ROUTE: '/:type/:id',
    TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE: 'app.transaction.invoicetariff.manage',
    TRANSACTION_MANAGE_SUPPLIER_INVOICE_CONTROLLER: 'ManageSupplierInvoiceController',
    TRANSACTION_MANAGE_SUPPLIER_INVOICE_VIEW: 'app/main/transaction/supplier-invoice/supplier-invoice-manage.html',

    TRANSACTION_MANAGE_CREDIT_INVOICE_LABEL: 'Manage Supplier Invoices',
    TRANSACTION_MANAGE_CREDIT_INVOICE_ROUTE: '/:type/:id',
    TRANSACTION_MANAGE_CREDIT_INVOICE_STATE: 'app.transaction.invoicecreditmemo.manage',
    TRANSACTION_MANAGE_CREDIT_INVOICE_CONTROLLER: 'ManageSupplierInvoiceController',
    TRANSACTION_MANAGE_CREDIT_INVOICE_VIEW: 'app/main/transaction/supplier-invoice/supplier-invoice-manage.html',

    TRANSACTION_MANAGE_DEBIT_INVOICE_LABEL: 'Manage Supplier Invoices',
    TRANSACTION_MANAGE_DEBIT_INVOICE_ROUTE: '/:type/:id',
    TRANSACTION_MANAGE_DEBIT_INVOICE_STATE: 'app.transaction.invoicedebitmemo.manage',
    TRANSACTION_MANAGE_DEBIT_INVOICE_CONTROLLER: 'ManageSupplierInvoiceController',
    TRANSACTION_MANAGE_DEBIT_INVOICE_VIEW: 'app/main/transaction/supplier-invoice/supplier-invoice-manage.html',

    TRANSACTION_PACKING_SLIP_CONTROLLER: 'SelectPackingSlipPopUpController',
    TRANSACTION_PACKING_SLIP_VIEW: 'app/main/transaction/supplier-invoice/select-packing-slip.html',

    // Manage supplier payment page
    TRANSACTION_INVOICE_MANAGE_PAYMENT_ROUTE: '/managepayment',
    TRANSACTION_INVOICE_MANAGE_PAYMENT_STATE: 'app.transaction.invoicepayment.managepayment',
    TRANSACTION_INVOICE_MANAGE_PAYMENT_CONTROLLER: 'SupplierPaymentManageController',
    TRANSACTION_INVOICE_MANAGE_PAYMENT_VIEW: 'app/main/transaction/supplier-payment/supplier-payment-manage.html',

    //Manage supplier payment detail Tab
    TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_ROUTE: '/detail/:id',
    TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE: 'app.transaction.invoicepayment.managepayment.detail',

    //Manage supplier payment document Tab
    TRANSACTION_INVOICE_MANAGE_PAYMENT_DOCUMENT_ROUTE: '/documents/:id',
    TRANSACTION_INVOICE_MANAGE_PAYMENT_DOCUMENT_STATE: 'app.transaction.invoicepayment.managepayment.document',

    // Manage supplier refund page
    TRANSACTION_INVOICE_MANAGE_REFUND_ROUTE: '/managerefund',
    TRANSACTION_INVOICE_MANAGE_REFUND_STATE: 'app.transaction.invoicerefund.managerefund',
    TRANSACTION_INVOICE_MANAGE_REFUND_CONTROLLER: 'SupplierRefundManageController',
    TRANSACTION_INVOICE_MANAGE_REFUND_VIEW: 'app/main/transaction/supplier-refund/supplier-refund-manage.html',

    //Manage supplier refund detail Tab
    TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_ROUTE: '/detail/:id?mfgcodeid?memoid',
    TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE: 'app.transaction.invoicerefund.managerefund.detail',

    //Manage supplier refund document Tab
    TRANSACTION_INVOICE_MANAGE_REFUND_DOCUMENT_ROUTE: '/documents/:id',
    TRANSACTION_INVOICE_MANAGE_REFUND_DOCUMENT_STATE: 'app.transaction.invoicerefund.managerefund.document',

    MEMO_APPROVE_NOTE_POPUP_CONTROLLER: 'MemoApproveNotePopUpController',
    MEMO_APPROVE_NOTE_POPUP_VIEW: 'app/main/transaction/supplier-invoice/memo-approve-note-popup.html',

    EXPORT_CONTROLLED_PART_MODAL_CONTROLLER: 'ViewExportControlledPartPopupController',
    EXPORT_CONTROLLED_PART_MODAL_VIEW: 'app/main/transaction/shippedassembly/view-export-controlled-part-popup/view-export-controlled-part-popup.html',

    UPDATE_KIT_MRP_QTY_POPUP_CONTROLLER: 'UpdateKitMrpQtyPopUpController',
    UPDATE_KIT_MRP_QTY_POPUP_VIEW: 'app/main/transaction/kit-allocation/update-kit-mrp-qty-popup.html',

    KIT_ALLOCATION_FEASIBILITY_POPUP_CONTROLLER: 'KitAllocationFeasibilityPopUpController',
    KIT_ALLOCATION_FEASIBILITY_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-allocation-feasibility-popup.html',

    BIN_TRANSFER_POPUP_CONTROLLER: 'BinTransferPopUpController',
    BIN_TRANSFER_POPUP_VIEW: 'app/main/transaction/receiving-material/bin-transfer-popup.html',

    TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_CONTROLLER: 'TransferStockUnallocatedUmidHistoryPopUpController',
    TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_VIEW: 'app/main/transaction/transfer-stock/transfer-stock-unallocated-umid-history-popup/transfer-stock-unallocated-umid-history-popup.html',

    UNALLOCATE_UMID_TRANSFER_HISTORY_LABEL: 'Unallocated UMID Xfer History',
    UNALLOCATE_UMID_TRANSFER_HISTORY_ROUTE: '/unallocatedUmidXferHistory',
    UNALLOCATE_UMID_TRANSFER_HISTORY_STATE: 'app.transaction.unallocatedUmidXferHistory',
    UNALLOCATE_UMID_TRANSFER_HISTORY_CONTROLLER: 'UnallocateUMIDXferHistoryController',
    UNALLOCATE_UMID_TRANSFER_HISTORY_VIEW: 'app/main/transaction/transfer-stock/transfer-stock-unallocated-umid-xfer-history/transfer-stock-unallocated-umid-xfer-history.html',

    TRANSACTION_SALES_COMMISSION_CONTROLLER: 'SalesOrderCommissionPopupController',
    TRANSACTION_SALES_COMMISSION_VIEW: 'app/core/component/salesorder-commission-popup/salesorder-commission-popup.html',

    TRANSACTION_SALES_MASTER_COMMISSION_CONTROLLER: 'SalesOrderMasterCommissionPopupController',
    TRANSACTION_SALES_MASTER_COMMISSION_VIEW: 'app/core/component/salesorder-commission-popup/salesorder-master-commission-popup.html',

    TRANSACTION_CUSTOMER_PACKING_SLIP_LABEL: 'Packing Slip',
    TRANSACTION_CUSTOMER_PACKING_SLIP_ROUTE: '/customerpackinglist',
    TRANSACTION_CUSTOMER_PACKING_SLIP_STATE: 'app.transaction.customerpacking',
    TRANSACTION_CUSTOMER_PACKING_SLIP_CONTROLLER: 'CustomerPackingSlipController',
    TRANSACTION_CUSTOMER_PACKING_SLIP_VIEW: 'app/main/transaction/customer-packing-slip/customer-packing-slip.html',


    TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_LABEL: 'Summary',
    TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_ROUTE: '/summarylist?customerID',
    TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_STATE: 'app.transaction.customerpacking.summary',
    //TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_CONTROLLER: 'CustomerPackingSlipListSummaryController',
    //TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_VIEW: 'app/main/transaction/customer-packing-slip/customer-packing-slip-list-summary.html',

    TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_LABEL: 'Detail',
    TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_STATE: 'app.transaction.customerpacking.detail',
    TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_ROUTE: '/detaillist?psNumber',
    //TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_CONTROLLER: 'CustomerPackingSlipListDetailController',
    //TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_VIEW: 'app/main/transaction/customer-packing-slip/customer-packing-slip-list-detail.html',


    TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_LABEL: 'Details',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_ROUTE: '/manage/:id/:sdetid/?lType?sodid?sorelid',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE: 'app.transaction.customerpacking.main.manage',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_CONTROLLER: 'ManageCustomerPackingSlipController',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_VIEW: 'app/main/transaction/customer-packing-slip/manage-customer-packing-slip.html',

    TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_ROUTE: '/documents/:id/:sdetid',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_STATE: 'app.transaction.customerpacking.main.documents',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_CONTROLLER: 'ManageCustomerPackingSlipDocument',
    TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_VIEW: 'app/main/transaction/customer-packing-slip/manage-customer-packing-slip-document.html',

    TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_LABEL: 'MISC',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_ROUTE: '/misc/:id/:sdetid',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_STATE: 'app.transaction.customerpacking.main.misc',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_CONTROLLER: 'ManageCustomerPackingSlipMISCController',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_VIEW: 'app/main/transaction/customer-packing-slip/manage-customer-packing-slip-misc.html',

    TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_ROUTE: '/customerpacking',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_STATE: 'app.transaction.customerpacking.main',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_CONTROLLER: 'ManageCustomerPackingSlipMainController',
    TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_VIEW: 'app/main/transaction/customer-packing-slip/manage-customer-packing-slip-main.html',

    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_ROUTE: '/pendingpolist',
    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_STATE: 'app.transaction.pendingpolist',

    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_PART_ROUTE: '/partdetail',
    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_PART_STATE: 'app.transaction.pendingpolist.partdetail',

    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_DETAIL_ROUTE: '/detail',
    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_DETAIL_STATE: 'app.transaction.pendingpolist.detail',

    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_CREATION_POPUP_CONTROLLER: 'PendingCustomerPackingSlipCreationPopupController',
    TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_CREATION_POPUP_VIEW: 'app/main/transaction/customer-packing-slip/pending-packingslip-list-view-popup.html',

    PACKING_SLIP_RECEIVE_PART_INSPECTION_POPUP_CONTROLLER: 'PackingSlipReceivePartInspectionPopupController',
    PACKING_SLIP_RECEIVE_PART_INSPECTION_POPUP_VIEW: 'app/main/transaction/packing-slip/packing-slip-receive-part-inspection-popup.html',

    TRANSACTION_STOCK_ADJUSTMENT_LABEL: 'Stock Adjustment',
    TRANSACTION_STOCK_ADJUSTMENT_ROUTE: '/stockadjustment',
    TRANSACTION_STOCK_ADJUSTMENT_STATE: 'app.transaction.stockadjustment',
    TRANSACTION_STOCK_ADJUSTMENT_CONTROLLER: 'StockAdjustmentController',
    TRANSACTION_STOCK_ADJUSTMENT_VIEW: 'app/main/transaction/stock-adjustment/stock-adjustment.html',

    TRANSACTION_BOX_SERIAL_NUMBERS_LABEL: 'Box Serial Numbers',
    TRANSACTION_BOX_SERIAL_NUMBERS_ROUTE: '/boxserialnumbers',
    TRANSACTION_BOX_SERIAL_NUMBERS_STATE: 'app.transaction.boxserialnumbers',
    TRANSACTION_BOX_SERIAL_NUMBERS_CONTROLLER: 'BoxSerialNumbersController',
    TRANSACTION_BOX_SERIAL_NUMBERS_VIEW: 'app/main/transaction/box-serial-numbers/box-serial-numbers.html',
    TRANSACTION_BOX_SERIAL_NUMBERS_POPUP_CONTROLLER: 'ManageBoxSerialNumbersController',
    TRANSACTION_BOX_SERIAL_NUMBERS_POPUP_VIEW: 'app/main/transaction/box-serial-numbers/manage-box-serial-numbers-popup.html',
    TRANSACTION_MOVE_SERIAL_NUMBERS_POPUP_CONTROLLER: 'MoveSerialNumbersController',
    TRANSACTION_MOVE_SERIAL_NUMBERS_POPUP_VIEW: 'app/main/transaction/box-serial-numbers/move-serial-numbers-pop-up/move-serial-numbers-pop-up.html',
    TRANSACTION_BOX_SERIAL_NUMBERS_HISTORY_POPUP_CONTROLLER: 'BoxSerialNumbersHistoryPopupController',
    TRANSACTION_BOX_SERIAL_NUMBERS_HISTORY_POPUP_VIEW: 'app/main/transaction/box-serial-numbers/box-serial-numbers-history-popup/box-serial-numbers-history-popup.html',

    //TRANSACTION_STOCK_ADJUSTMENT_POPUP_STATE: 'app.transaction.stockadjustment.manage',
    TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER: 'ManageStockAdjustmentController',
    TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW: 'app/main/transaction/stock-adjustment/manage-stock-adjustment-popup.html',

    TRANSACTION_CUSTOMER_INVOICE_MAIN_LABEL: 'Invoice',
    //TRANSACTION_CUSTOMER_INVOICE_MAIN_ROUTE: '/customerinvoice',
    //TRANSACTION_CUSTOMER_INVOICE_MAIN_STATE: 'app.transaction.customerinvoice',
    TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER: 'CustomerInvoiceMainController',
    TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW: 'app/main/transaction/customer-invoice/customer-invoice-main.html',

    TRANSACTION_CUSTOMER_INVOICE_LABEL: 'Invoice',
    TRANSACTION_CUSTOMER_INVOICE_ROUTE: '/customerinvoicelist?customerID?dueDate?termsAndAboveDays?additionalDays?isIncludeZeroValueInv?custInvCMSubStatusList',
    TRANSACTION_CUSTOMER_INVOICE_STATE: 'app.transaction.customerinvoice',
    TRANSACTION_CUSTOMER_INVOICE_CONTROLLER: 'CustomerInvoiceListController',
    TRANSACTION_CUSTOMER_INVOICE_VIEW: 'app/main/transaction/customer-invoice/customer-invoicelist.html',

    TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_LABEL: 'Summary',
    TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_ROUTE: '/summarylist',
    TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE: 'app.transaction.customerinvoice.summary',
    TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_CONTROLLER: 'CustomerInvoiceListSummaryController',
    TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_VIEW: 'app/main/transaction/customer-invoice/customer-invoicelist-summary.html',

    TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_LABEL: 'Detail',
    TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE: 'app.transaction.customerinvoice.detail',
    TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_ROUTE: '/detaillist?transNumber',
    TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_CONTROLLER: 'CustomerInvoiceListDetailController',
    TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_VIEW: 'app/main/transaction/customer-invoice/customer-invoicelist-detail.html',

    TRANSACTION_CUSTOMER_INVOICE_PACKING_LABEL: 'Packing Slip',
    TRANSACTION_CUSTOMER_INVOICE_PACKING_ROUTE: '/customerinvoicepackingslip',
    TRANSACTION_CUSTOMER_INVOICE_PACKING_STATE: 'app.transaction.customerpackingslipinvoice',
    TRANSACTION_CUSTOMER_INVOICE_PACKING_CONTROLLER: 'CustomerInvoicePackingSlipListListController',
    TRANSACTION_CUSTOMER_INVOICE_PACKING_VIEW: 'app/main/transaction/customer-invoice/customer-invoice-packing-slip-list.html',

    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_LABEL: 'Summary',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_ROUTE: '/summarylist',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE: 'app.transaction.customerpackingslipinvoice.summary',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_CONTROLLER: 'CustomerPackingSlipListSummaryController',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_VIEW: 'app/main/transaction/customer-packing-slip/customer-packing-slip-list-summary.html',

    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_LABEL: 'Detail',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE: 'app.transaction.customerpackingslipinvoice.detail',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_ROUTE: '/detaillist?psNumber',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_CONTROLLER: 'CustomerPackingSlipListDetailController',
    TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_VIEW: 'app/main/transaction/customer-packing-slip/customer-packing-slip-list-detail.html',

    TRANSACTION_CUSTOMER_INVOICE_DETAIL_LABEL: 'Details',
    TRANSACTION_CUSTOMER_INVOICE_DETAIL_ROUTE: '/manage/:transType/:id/:packingSlipNumber',
    TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE: 'app.transaction.customerinvoice.main.manage',
    TRANSACTION_CUSTOMER_INVOICE_DETAIL_CONTROLLER: 'ManageCustomerInvoiceController',
    TRANSACTION_CUSTOMER_INVOICE_DETAIL_VIEW: 'app/main/transaction/customer-invoice/manage-customer-invoice.html',

    TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_ROUTE: '/documents/:transType/:id',
    TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_STATE: 'app.transaction.customerinvoice.main.documents',
    TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_CONTROLLER: 'ManageCustomerInvoiceDocument',
    TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_VIEW: 'app/main/transaction/customer-invoice/manage-customer-invoice-document.html',

    TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_LABEL: 'Customer Packing Slip Documents',
    TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_ROUTE: '/packingdocuments/:transType/:id',
    TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_STATE: 'app.transaction.customerinvoice.main.packingdocuments',
    TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_CONTROLLER: 'ManageCustomerInvoicePackingSlipDocument',
    TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_VIEW: 'app/main/transaction/customer-invoice/manage-customer-invoice-packingslipdocument.html',

    TRANSACTION_CUSTOMER_INVOICE_MISC_LABEL: 'MISC',
    TRANSACTION_CUSTOMER_INVOICE_MISC_ROUTE: '/misc/:transType/:id',
    TRANSACTION_CUSTOMER_INVOICE_MISC_STATE: 'app.transaction.customerinvoice.main.misc',
    TRANSACTION_CUSTOMER_INVOICE_MISC_CONTROLLER: 'ManageCustomerInvoiceMISCController',
    TRANSACTION_CUSTOMER_INVOICE_MISC_VIEW: 'app/main/transaction/customer-invoice/manage-customer-invoice-misc.html',

    TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_ROUTE: '/customerinvoice',
    TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_STATE: 'app.transaction.customerinvoice.main',
    TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_CONTROLLER: 'ManageCustomerInvoiceMainController',
    TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_VIEW: 'app/main/transaction/customer-invoice/manage-customer-invoice-main.html',

    TRANSACTION_CUSTOMER_CREDIT_NOTE_LABEL: 'Credit Memo',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_ROUTE: '/customercreditnotelist',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE: 'app.transaction.customercreditnote',

    TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_LABEL: 'Summary',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_ROUTE: '/summarylist?customerID?dueDate?termsAndAboveDays?additionalDays?custInvCMSubStatusList',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE: 'app.transaction.customercreditnote.summary',

    TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_LABEL: 'Detail',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_ROUTE: '/detaillist?transNumber',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE: 'app.transaction.customercreditnote.detail',

    TRANSACTION_MANAGE_CUSTOMER_CREDIT_NOTE_MAIN_LABEL: 'Manage Credit Memo',
    TRANSACTION_MANAGE_CUSTOMER_CREDIT_NOTE_MAIN_ROUTE: '/creditnote',
    TRANSACTION_MANAGE_CUSTOMER_CREDIT_NOTE_MAIN_STATE: 'app.transaction.customercreditnote.main',

    TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_LABEL: 'Details',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_ROUTE: '/manage/:transType/:id',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE: 'app.transaction.customercreditnote.main.manage',

    TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_ROUTE: '/documents/:transType/:id',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_STATE: 'app.transaction.customercreditnote.main.documents',

    TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_LABEL: 'MISC',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_ROUTE: '/misc/:transType/:id',
    TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_STATE: 'app.transaction.customercreditnote.main.misc',


    TRANSACTION_SEARCH_MATERIAL_LABEL: 'Search Material',
    TRANSACTION_SEARCH_MATERIAL_ROUTE: '/searchmaterial',
    TRANSACTION_SEARCH_MATERIAL_STATE: 'app.transaction.searchmaterial',
    TRANSACTION_SEARCH_MATERIAL_CONTROLLER: 'SearchMaterialController',
    TRANSACTION_SEARCH_MATERIAL_VIEW: 'app/main/transaction/search-material/search-material.html',

    SEARCH_MATERIAL_PRINT_UTILITY_POPUP_CONTROLLER: 'SearchMaterialPrintUtilityPopUpController',
    SEARCH_MATERIAL_PRINT_UTILITY_POPUP_VIEW: 'app/main/transaction/search-material/search-material-print-utility-popup.html',

    PAID_VERIFICATION_CUSTOMER_PACKAGING_CONTROLLER: 'PaidVerificationCustomerPackingController',
    PAID_VERIFICATION_CUSTOMER_PACKAGING_VIEW: 'app/main/transaction/customer-invoice/paid-verification-customer-packing-popup.html',

    TRANSACTION_PURCHASE_ORDER_LABEL: 'Purchase Order',
    TRANSACTION_PURCHASE_ORDER_ROUTE: '/purchaseorderlist',
    TRANSACTION_PURCHASE_ORDER_STATE: 'app.transaction.purchaseorder',
    TRANSACTION_PURCHASE_ORDER_CONTROLLER: 'PurchaseOrderController',
    TRANSACTION_PURCHASE_ORDER_VIEW: 'app/main/transaction/purchase-management/purchase-order/purchase-order-list.html',

    TRANSACTION_PURCHASE_ORDER_DETAILLIST_LABEL: 'Summary',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE: 'app.transaction.purchaseorder.detail',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_ROUTE: '/detail',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_CONTROLLER: 'PurchaseOrderDetailController',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_VIEW: 'app/main/transaction/purchase-management/purchase-order/purchase-order-detail-list.html',

    TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_LABEL: 'Detail Per Line',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_STATE: 'app.transaction.purchaseorder.partdetail',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_ROUTE: '/partdetail?poNumber?status',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_CONTROLLER: 'PurchaseOrderPartDetailController',
    TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_VIEW: 'app/main/transaction/purchase-management/purchase-order/purchase-order-part-detail-list.html',

    TRANSACTION_PURCHASE_ORDER_DETAIL_LABEL: 'Details',
    TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE: '/manage/:id',
    TRANSACTION_PURCHASE_ORDER_DETAIL_STATE: 'app.transaction.purchaseorder.main.manage',
    TRANSACTION_PURCHASE_ORDER_DETAIL_CONTROLLER: 'ManagePurchaseOrderController',
    TRANSACTION_PURCHASE_ORDER_DETAIL_VIEW: 'app/main/transaction/purchase-management/purchase-order/manage-purchase-order.html',

    TRANSACTION_PURCHASE_ORDER_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_PURCHASE_ORDER_DOCUMENT_ROUTE: '/documents/:id',
    TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE: 'app.transaction.purchaseorder.main.documents',
    TRANSACTION_PURCHASE_ORDER_DOCUMENT_CONTROLLER: 'ManagePurchaseOrderDocument',
    TRANSACTION_PURCHASE_ORDER_DOCUMENT_VIEW: 'app/main/transaction/purchase-management/purchase-order/manage-purchase-order-document.html',

    TRANSACTION_PURCHASE_ORDER_MISC_LABEL: 'MISC',
    TRANSACTION_PURCHASE_ORDER_MISC_ROUTE: '/misc/:id',
    TRANSACTION_PURCHASE_ORDER_MISC_STATE: 'app.transaction.purchaseorder.main.misc',
    TRANSACTION_PURCHASE_ORDER_MISC_CONTROLLER: 'ManagePurchaseOrderMISCController',
    TRANSACTION_PURCHASE_ORDER_MISC_VIEW: 'app/main/transaction/purchase-management/purchase-order/manage-purchase-order-misc.html',

    TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE: '/purchaseorder',
    TRANSACTION_PURCHASE_ORDER_MAIN_STATE: 'app.transaction.purchaseorder.main',
    TRANSACTION_PURCHASE_ORDER_MAIN_CONTROLLER: 'ManagePurchaseOrderMainController',
    TRANSACTION_PURCHASE_ORDER_MAIN_VIEW: 'app/main/transaction/purchase-management/purchase-order/manage-purchase-order-main.html',

    TRANSACTION_CUSTOMERINVOICE_OTHERCHARGES_EXPANDABLEJS: 'app/main/transaction/customer-invoice/customer-invoice-othercharges.html',

    TRANSACTION_SUPPLIER_RMA_LABEL: 'RMA',
    TRANSACTION_SUPPLIER_RMA_ROUTE: '/supplierrma',
    TRANSACTION_SUPPLIER_RMA_STATE: 'app.transaction.supplierrma',
    TRANSACTION_SUPPLIER_RMA_CONTROLLER: 'SupplierRMAController',
    TRANSACTION_SUPPLIER_RMA_VIEW: 'app/main/transaction/supplier-rma/supplier-rma.html',

    TRANSACTION_MANAGE_SUPPLIER_RMA_LABEL: 'Manage Supplier RMA',
    TRANSACTION_MANAGE_SUPPLIER_RMA_ROUTE: '/manage/:type/:id?partid?packingslipid',
    TRANSACTION_MANAGE_SUPPLIER_RMA_STATE: 'app.transaction.supplierrma.manage',
    TRANSACTION_MANAGE_SUPPLIER_RMA_CONTROLLER: 'ManageSupplierRMAController',
    TRANSACTION_MANAGE_SUPPLIER_RMA_VIEW: 'app/main/transaction/supplier-rma/supplier-rma-manage.html',

    TRANSACTION_MANUAL_CHANGE_STATUS_REASON_CONTROLLER: 'ManualChangeStatusReasonController',
    TRANSACTION_MANUAL_CHANGE_STATUS_REASON_VIEW: 'app/main/transaction/salesorder/manual-change-status-reason.html',

    CUST_PACKING_SLIP_ADDR_CONFM_MODAL_CONTROLLER: 'CustomerPackingSlipAddrMismatchPopupController',
    CUST_PACKING_SLIP_ADDR_CONFM_MODAL_VIEW: 'app/main/transaction/customer-packing-slip/packing-slip-address-mismatch-confirmation-popup/packing-slip-address-mismatch-confirmation-popup.html',

    CUST_PACKING_SLIP_QTY_KIT_CHANGE_CONFM_MODAL_CONTROLLER: 'CustomerPackingSlipQtyKitChangePopupController',
    CUST_PACKING_SLIP_QTY_KIT_CHANGE_CONFM_MODAL_VIEW: 'app/main/transaction/customer-packing-slip/packing-slip-ship-qty-kit-change-confirmation-popup/packing-slip-ship-qty-kit-change-confirmation-popup.html',

    TRANSACTION_CUSTOMER_PAYMENT_LABEL: 'Payment',
    TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE: 'app.transaction.customerpayment',
    TRANSACTION_CUSTOMER_PAYMENT_LIST_ROUTE: '/customerpaymentlist',
    TRANSACTION_CUSTOMER_PAYMENT_LIST_CONTROLLER: 'CustomerPaymentListController',
    TRANSACTION_CUSTOMER_PAYMENT_LIST_VIEW: 'app/main/transaction/customer-payment/customer-payment-list.html',

    TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_LABEL: 'Summary',
    TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_STATE: 'app.transaction.customerpayment.summary',
    TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_ROUTE: '/summarylist',
    TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_CONTROLLER: 'CustomerPaymentSummaryListController',
    TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_VIEW: 'app/main/transaction/customer-payment/customer-payment-summary-list.html',

    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_LABEL: 'Detail',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE: 'app.transaction.customerpayment.detail',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_ROUTE: '/detaillist?paymentMstID?paymentNumber',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_CONTROLLER: 'CustomerPaymentDetailListController',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_VIEW: 'app/main/transaction/customer-payment/customer-payment-detail-list.html',

    TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_ROUTE: '/customerpayment',
    TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_STATE: 'app.transaction.customerpayment.main',
    TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_CONTROLLER: 'ManageCustomerPaymentMainController',
    TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_VIEW: 'app/main/transaction/customer-payment/manage-customer-payment-main.html',

    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LABEL: 'Details',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_ROUTE: '/manage/:id',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE: 'app.transaction.customerpayment.main.manage',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_CONTROLLER: 'ManageCustomerPaymentController',
    TRANSACTION_CUSTOMER_PAYMENT_DETAIL_VIEW: 'app/main/transaction/customer-payment/manage-customer-payment.html',

    TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_ROUTE: '/documents/:id',
    TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_STATE: 'app.transaction.customerpayment.main.documents',
    TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_CONTROLLER: 'ManageCustomerPaymentDocumentController',
    TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_VIEW: 'app/main/transaction/customer-payment/manage-customer-payment-document.html',

    TRANSACTION_CUSTOMER_REFUND_LABEL: 'Refund',
    TRANSACTION_CUSTOMER_REFUND_LIST_STATE: 'app.transaction.customerrefund',
    TRANSACTION_CUSTOMER_REFUND_LIST_ROUTE: '/customerrefundlist',
    TRANSACTION_CUSTOMER_REFUND_LIST_CONTROLLER: 'CustomerRefundListController',
    TRANSACTION_CUSTOMER_REFUND_LIST_VIEW: 'app/main/transaction/customer-refund/customer-refund-list.html',

    TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_LABEL: 'Summary',
    TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_STATE: 'app.transaction.customerrefund.summary',
    TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_ROUTE: '/summarylist',
    TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_CONTROLLER: 'CustomerRefundSummaryListController',
    TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_VIEW: 'app/main/transaction/customer-refund/customer-refund-summary-list.html',

    TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_LABEL: 'Detail',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_STATE: 'app.transaction.customerrefund.detail',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_ROUTE: '/detaillist?paymentMstID?paymentNumber',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_CONTROLLER: 'CustomerRefundDetailListController',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_VIEW: 'app/main/transaction/customer-refund/customer-refund-detail-list.html',

    TRANSACTION_CUSTOMER_REFUND_MANAGE_MAIN_ROUTE: '/customerrefund',
    TRANSACTION_CUSTOMER_REFUND_MANAGE_MAIN_STATE: 'app.transaction.customerrefund.main',
    TRANSACTION_CUSTOMER_REFUND_MANAGE_MAIN_CONTROLLER: 'ManageCustomerRefundMainController',
    TRANSACTION_CUSTOMER_REFUND_MANAGE_MAIN_VIEW: 'app/main/transaction/customer-refund/manage-customer-refund-main.html',

    TRANSACTION_CUSTOMER_REFUND_DETAIL_LABEL: 'Details',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_ROUTE: '/manage/:id?transModeID?custID?CMID?CPID',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE: 'app.transaction.customerrefund.main.manage',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_CONTROLLER: 'ManageCustomerRefundController',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_VIEW: 'app/main/transaction/customer-refund/manage-customer-refund.html',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_REASON_POPUP_CONTROLLER: 'ManageCustomerRefundCommentPopupController',
    TRANSACTION_CUSTOMER_REFUND_DETAIL_REASON_POPUP_VIEW: 'app/main/transaction/customer-refund/manage-customer-refund-comment-popup.html',

    TRANSACTION_CUSTOMER_REFUND_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_CUSTOMER_REFUND_DOCUMENT_ROUTE: '/documents/:id',
    TRANSACTION_CUSTOMER_REFUND_DOCUMENT_STATE: 'app.transaction.customerrefund.main.documents',
    TRANSACTION_CUSTOMER_REFUND_DOCUMENT_CONTROLLER: 'ManageCustomerRefundDocumentController',
    TRANSACTION_CUSTOMER_REFUND_DOCUMENT_VIEW: 'app/main/transaction/customer-refund/manage-customer-refund-document.html',

    CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_CONTROLLER: 'CustomerRefundTransactionListPopupController',
    CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_VIEW: 'app/core/component/customer-refund-transaction-list-popup/customer-refund-transaction-list-popup.html',

    TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER: 'PackingSlipChangeHistoryController',
    TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW: 'app/main/transaction/packing-slip/packing-slip-change-history.html',

    DUPLICATE_PO_POPUP_CONTROLLER: 'ManageDuplicatePurchaseOrderPopupController',
    DUPLICATE_PO_POPUP_VIEW: 'app/main/transaction/purchase-management/purchase-order/manage-duplicate-purchase-order-popup.html',

    SEARCH_MATERIL_MANAGE_FIELD_POPUP_CONTROLLER: 'SearchMaterialManageFieldPopUpController',
    SEARCH_MATERIL_MANAGE_FIELD_POPUP_VIEW: 'app/main/transaction/search-material/search-material-manage-field-popup.html',

    VOID_REISSUE_CUST_PAYMENT_MODAL_CONTROLLER: 'VoidReissueCustomerPaymentController',
    VOID_REISSUE_CUST_PAYMENT_MODAL_VIEW: 'app/main/transaction/customer-payment/void-reissue-customer-payment-popup/void-reissue-customer-payment-popup.html',

    CUST_INV_CURR_BAL_AND_PAST_DUE_POPUP_CONTROLLER: 'CustomerInvCurrBalanceAndPastDuePopupController',
    CUST_INV_CURR_BAL_AND_PAST_DUE_POPUP_VIEW: 'app/main/transaction/customer-invoice/cust-inv-curr-balance-and-past-due-popup/cust-inv-curr-balance-and-past-due-popup.html',

    SELCET_LINE_FOR_SAME_MFRPN_LINE_CONTROLLER: 'SelectLineForSameMFRPNLineController',
    SELCET_LINE_FOR_SAME_MFRPN_LINE_VIEW: 'app/main/transaction/supplier-rma/select-line-for-same-mfrpn-line.html',

    SUPPLIER_RMA_STOCK_POPUP_CONTROLLER: 'SupplierRMAStockPopUpController',
    SUPPLIER_RMA_STOCK_POPUP_VIEW: 'app/main/transaction/supplier-rma/supplier-rma-stock-list-popup.html',

    TRANSACTION_COUNTAPPROVAL_LABEL: 'Deallocation Approval History',
    TRANSACTION_COUNTAPPROVAL_ROUTE: '/countapprovallist',
    TRANSACTION_COUNTAPPROVAL_STATE: 'app.transaction.receivingmaterial.countapprovallist',
    TRANSACTION_COUNTAPPROVAL_CONTROLLER: 'CountapprovalController',
    TRANSACTION_COUNTAPPROVAL_VIEW: 'app/main/transaction/count-approval-history/count-approval-history.html',

    // customer applied credit memo
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LABEL: 'Applied Credit Memo',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE: 'app.transaction.applycustomercreditmemo',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_ROUTE: '/applycredittoinvoicelist',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_CONTROLLER: 'ApplyCustCreditMemoListController',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_VIEW: 'app/main/transaction/apply-cust-credit-memo/apply-cust-credit-memo-list.html',

    TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_LABEL: 'Summary',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_STATE: 'app.transaction.applycustomercreditmemo.summary',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_ROUTE: '/summarylist',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_CONTROLLER: 'AppliedCustCreditMemoSummaryListController',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_VIEW: 'app/main/transaction/apply-cust-credit-memo/apply-cust-credit-memo-summary-list.html',

    TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_LABEL: 'Detail',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE: 'app.transaction.applycustomercreditmemo.detail',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_ROUTE: '/detaillist?paymentMstID?paymentNumber',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_CONTROLLER: 'AppliedCustCreditMemoDetailListController',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_VIEW: 'app/main/transaction/apply-cust-credit-memo/apply-cust-credit-memo-detail-list.html',

    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_ROUTE: '/applycustomercreditmemo',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_STATE: 'app.transaction.applycustomercreditmemo.main',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_CONTROLLER: 'ApplyCustCreditMemoToInvManageMainController',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_VIEW: 'app/main/transaction/apply-cust-credit-memo/apply-cust-credit-memo-manage-main.html',

    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_LABEL: 'Details',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_ROUTE: '/manage/:ccmid/:pid',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE: 'app.transaction.applycustomercreditmemo.main.manage',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_CONTROLLER: 'ApplyCustCreditMemoToInvManageDetailController',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_VIEW: 'app/main/transaction/apply-cust-credit-memo/apply-cust-credit-memo-manage-detail.html',

    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_ROUTE: '/documents/:ccmid/:pid',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_STATE: 'app.transaction.applycustomercreditmemo.main.documents',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_CONTROLLER: 'ApplyCustCreditMemoToInvManageDocumentController',
    TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_VIEW: 'app/main/transaction/apply-cust-credit-memo/apply-cust-credit-memo-manage-document.html',

    // customer payment applied write off
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LABEL: 'Write Offs',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE: 'app.transaction.applycustomerwriteoff',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_ROUTE: '/applywriteofftoinvoicelist',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_CONTROLLER: 'ApplyCustWriteOffListController',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_VIEW: 'app/main/transaction/apply-cust-write-off/apply-cust-write-off-list.html',

    TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_LABEL: 'Summary',
    TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_STATE: 'app.transaction.applycustomerwriteoff.summary',
    TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_ROUTE: '/summarylist',
    TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_CONTROLLER: 'AppliedCustWriteOffSummaryListController',
    TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_VIEW: 'app/main/transaction/apply-cust-write-off/apply-cust-write-off-summary-list.html',

    TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_LABEL: 'Detail',
    TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_STATE: 'app.transaction.applycustomerwriteoff.detail',
    TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_ROUTE: '/detaillist?paymentMstID?paymentNumber',
    TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_CONTROLLER: 'AppliedCustWriteOffDetailListController',
    TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_VIEW: 'app/main/transaction/apply-cust-write-off/apply-cust-write-off-detail-list.html',

    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_MAIN_ROUTE: '/applycustomerwriteoff',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_MAIN_STATE: 'app.transaction.applycustomerwriteoff.main',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_MAIN_CONTROLLER: 'ApplyCustWriteOffToInvManageMainController',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_MAIN_VIEW: 'app/main/transaction/apply-cust-write-off/apply-cust-write-off-manage-main.html',

    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_LABEL: 'Details',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_ROUTE: '/manage/:id',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE: 'app.transaction.applycustomerwriteoff.main.manage',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_CONTROLLER: 'ApplyCustWriteOffToInvManageDetailController',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_VIEW: 'app/main/transaction/apply-cust-write-off/apply-cust-write-off-manage-detail.html',

    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_LABEL: 'Documents',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_ROUTE: '/documents/:id',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_STATE: 'app.transaction.applycustomerwriteoff.main.documents',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_CONTROLLER: 'ApplyCustWriteOffToInvManageDocumentController',
    TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_VIEW: 'app/main/transaction/apply-cust-write-off/apply-cust-write-off-manage-document.html',

    TRANSACTION_SPLIT_UID_LABEL: 'Split UMID List',
    TRANSACTION_SPLIT_UID_ROUTE: '/splitumidlist/:id',
    TRANSACTION_SPLIT_UID_STATE: 'app.transaction.receivingmaterial.splitumidlist',
    TRANSACTION_SPLIT_UID_CONTROLLER: 'SplitUIDController',
    TRANSACTION_SPLIT_UID_VIEW: 'app/main/transaction/split-uid/split-uid-list.html',

    SPLIT_UID_POPUP_CONTROLLER: 'SplitUIDPopUpController',
    SPLIT_UID_POPUP_VIEW: 'app/main/transaction/split-uid/split-uid-popup.html',

    REMOVE_UID_VALIDATION_POPUP_CONTROLLER: 'RemoveUIDValidationController',
    REMOVE_UID_VALIDATION_POPUP_VIEW: 'app/main/transaction/receiving-material/remove-umid-validation-popup.html',

    DEALLOCATED_UID_POPUP_CONTROLLER: 'DeallocatedUIDPopUpController',
    DEALLOCATED_UID_POPUP_VIEW: 'app/main/transaction/deallocated-uid/deallocated-uid-popup.html',

    RE_RELEASE_POPUP_CONTROLLER: 'ReReleaseKitValidationController',
    RE_RELEASE_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-re-release-popup.html',

    CUST_REFUND_DETAILS_POPUP_CONTROLLER: 'CustomerRefundDetailsPopupController',
    CUST_REFUND_DETAILS_POPUP_VIEW: 'app/main/transaction/customer-refund/customer-refund-details-popup/customer-refund-details-popup.html',

    CUST_REFUND_DUPLICATE_PAYMENT_NUM_POPUP_CONTROLLER: 'CustRefundDuplicatePaymentNumPopupController',
    CUST_REFUND_DUPLICATE_PAYMENT_NUM_POPUP_VIEW: 'app/main/transaction/customer-refund/duplicate-payment-num-popup/duplicate-payment-num-popup.html',

    DUPLICATE_PO_LINE_VALIDATION_CONTROLLER: 'DuplicatePoLineValidationController',
    DUPLICATE_PO_LINE_VALIDATION_VIEW: 'app/main/transaction/packing-slip/duplicate-po-line-validation.html',

    DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_CONTROLLER: 'DuplicateBinWithDiffReceivedStatusController',
    DUPLICATE_BIN_WITH_DIFFERENT_RECEIVED_STATUS_VIEW: 'app/main/transaction/packing-slip/duplicate-bin-with-different-received-status.html',
    DUPLICATE_SO_POPUP_CONTROLLER: 'SalesOrderCopyOptionController',
    DUPLICATE_SO_POPUP_VIEW: 'app/main/transaction/salesorder/sales-order-copy-option.html',

    DUPLICATE_PACKINGSLIP_PENDING_UID_STOCK_POPUP_CONTROLLER: 'DuplicatePackingslipStockPopupController',
    DUPLICATE_PACKINGSLIP_PENDING_UID_STOCK_POPUP_VIEW: 'app/main/transaction/receiving-material/duplicate-packingslip-stock-popup.html',

    VALIDATED_CUST_REFUND_LIST_FOR_LOCK_MODAL_CONTROLLER: 'ValidatedCustRefundListForLockPopupController',
    VALIDATED_CUST_REFUND_LIST_FOR_LOCK_MODAL_VIEW: 'app/main/transaction/customer-refund/validated-refund-list-for-lock-popup/validated-refund-list-for-lock-popup.html',

    TRANSACTION_BOM_LINE_LIST_MODAL_CONTROLLER: 'SelectRefDesListPopupController',
    TRANSACTION_BOM_LINE_LIST_MODAL_VIEW: 'app/main/workorder/workorders/select-refdes-list-popup/select-refdes-list-popup.html',

    KIT_CUSTCONSIGN_MISMATCH_POPUP_CONTROLLER: 'KitCustConsignMismatchPopUpController',
    KIT_CUSTCONSIGN_MISMATCH_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-custconsign-mismatch-popup.html',

    TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_ROUTE: '/salesordershipment',
    TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_STATE: 'app.transaction.salesordershipment',
    TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_CONTROLLER: 'SalesOrderShipmentSummaryController',
    TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_VIEW: 'app/main/transaction/salesorder-shipment-summary/salesorder-shipment-summary.html',

    TRANSACTION_MATERIALMGMT_SHIPMENT_SUMMARY_ROUTE: '/shipmentsummary',
    TRANSACTION_MATERIALMGMT_SHIPMENT_SUMMARY_STATE: 'app.transaction.shipmentsummary',

    VIEW_CUST_TRANS_LIST_TO_BE_LOCK_UNLOCK_MODAL_CONTROLLER: 'ViewTransListToBeLockUnlockPopupController',
    VIEW_CUST_TRANS_LIST_TO_BE_LOCK_UNLOCK_MODAL_VIEW: 'app/main/transaction/customer-payment/view-cust-trans-tobe-lock-unlock-popup/view-cust-trans-tobe-lock-unlock-popup.html',

    SALESORDER_BPO_MODAL_CONTROLLER: 'SalesOrderBlanketPOPopupController',
    SALESORDER_BPO_MODAL_VIEW: 'app/main/transaction/salesorder/salesorder-blanketpo-list-popup.html',

    VIEW_CUST_AGED_RECV_RANGE_DET_MODAL_CONTROLLER: 'CustAgedRecvRangeDetPopupController',
    VIEW_CUST_AGED_RECV_RANGE_DET_MODAL_VIEW: 'app/main/transaction/customer-invoice/cust-aged-receivables-range-det/cust-aged-receivables-range-det-popup.html',

    MANUAL_ENTRY_LIST_STATE: 'app.transaction.manualentry',
    MANUAL_ENTRY_LIST_ROUTE: '/manualentrylist',
    MANUAL_ENTRY_LIST_VIEW: 'app/main/transaction/kit-allocation/manual-entry/manual-entry-list.html',
    MANUAL_ENTRY_LIST_CONTROLLER: 'ManualEntryListController',

    MANAGE_MANUAL_ENTRY_STATE: 'app.transaction.manualentry.manage',
    MANAGE_MANUAL_ENTRY_ROUTE: '/manualentry/:transType/:refTransId/:id',
    MANAGE_MANUAL_ENTRY_VIEW: 'app/main/transaction/kit-allocation/manual-entry/manage-manual-entry.html',
    MANAGE_MANUAL_ENTRY_CONTROLLER: 'ManageManualEntryController',

    RETURN_KIT_POPUP_CONTROLLER: 'ReturnKitDecisionController',
    RETURN_KIT_POPUP_VIEW: 'app/main/transaction/kit-allocation/kit-return-popup.html',

    RELEASE_RETURN_HISTORY_POPUP_CONTROLLER: 'ReleaseReturnHistPopupController',
    RELEASE_RETURN_HISTORY_POPUP_VIEW: 'app/main/transaction/kit-allocation/release-return-history-popup.html',

    TREE_IN_VIEW_POPUP_CONTROLLER: 'BOMTreeViewPopupController',
    TREE_IN_VIEW_POPUP_VIEW: 'app/main/transaction/kit-allocation/tree-in-view-popup.html',

    TRANSACTION_CUSTOMER_PACKING_SLIP_ADD_POPUP_CONTROLLER: 'AddCustomerPackingSlipPopupController',
    TRANSACTION_CUSTOMER_PACKING_SLIP_ADD_POPUP_VIEW: 'app/main/transaction/customer-packing-slip/customer-packingslip-add-popup.html',

    IDENTICAL_UMID_POPUP_LABEL: 'CREATE UMID WITH IDENTICAL DETAILS',
    IDENTICAL_UMID_POPUP_CONTROLLER: 'IdenticalUMIDPopupController',
    IDENTICAL_UMID_POPUP_VIEW: 'app/main/transaction/create-identical-umid-popup/create-identical-umid-popup.html',

    SET_DATE_CODE_POPUP_CONTROLLER: 'SetDateCodeFormatPopupController',
    SET_DATE_CODE_POPUP_VIEW: 'app/main/transaction/set-dc-format-popup/set-dc-format-popup.html',

    TRANSACTION_EMPTYSTATE: {
      KITLIST: {
        IMAGEURL: 'assets/images/emptystate/kit-list.png',
        MESSAGE: 'No Kit is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a Kit'
      },
      SALESORDER: {
        IMAGEURL: 'assets/images/emptystate/sales-order-list.png',
        MESSAGE: 'No Sales Order is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a Sales Order',
        CLEARALLFILTERMESSAGE: 'Please select filter options then click on APPLY FILTERS to get Sales Order list or else for whole list just click on APPLY FILTERS!'
      },
      ADD_SALESORDER: {
        IMAGEURL: 'assets/images/emptystate/sales-order-list.png',
        MESSAGE: 'Add New Sales Order of {0}!',
        ADDNEWMESSAGE: 'Published sales order will show up here.'
      },
      WO_ASSEMBLY: {
        IMAGEURL: 'assets/images/emptystate/sales-order-list.png',
        MESSAGE: 'Assembly work order details are not available.',
        NO_WO_AVAILABLE_FOR_PO_MESSAGE: 'Assembly work order details are not available for selected PO#.'
      },
      PO_ASSEMBLY: {
        IMAGEURL: 'assets/images/emptystate/sales-order-list.png',
        MESSAGE: 'Assembly PO details are not available.'
      },
      SHIPPED: {
        IMAGEURL: 'assets/images/emptystate/shipped-list.png',
        MESSAGE: 'No shipping record data is listed yet!',
        ADDNEWMESSAGE: 'Click below to add'
      },
      RECEIVINGMATERIAL: {
        IMAGEURL: 'assets/images/emptystate/umid-list.png',
        MESSAGE: 'No Receiving Material is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a receiving material',
        NOUMIDALLOCATEDMESSAGE: 'No Kit Allocation available for {0}. Click on below to view UMID for {0}'
      },
      REQUEST_FOR_SHIP_LIST: {
        IMAGEURL: 'assets/images/emptystate/request-for-shipment.png',
        MESSAGE: 'No Shipping request added yet!',
        ADDNEWMESSAGE: 'Click below to add a shipping request'
      },
      REQUEST_FOR_SHIP: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No shipping request added yet!'
      },
      SHIPPING_REQ_EMPLOYEEDET: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No shipping approval request added yet!'
      },
      IN_HOUSE_ASSEMBLY_STOCK: {
        IMAGEURL: 'assets/images/emptystate/assembly-stock.png',
        MESSAGE: 'No assembly stock details listed yet!'
      },
      CUSTOMER_ASSEMBLY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No assembly information found for customer!',
        ADDNEWMESSAGE: 'Click below to add assembly information'
      },
      RECEIVINGMATERIALPOPUP: {
        IMAGEURL: 'assets/images/emptystate/scan-image.png',
        MESSAGE: 'Scan the label, verify & take picture.'
      },
      ZOOMNOTCLICK: {
        IMAGEURL: 'assets/images/emptystate/no-capture.png',
        MESSAGE: 'Click on CAPTURE button to capture image.'
      },
      DOCUMENTZOOMNOTCLICK: {
        IMAGEURL: 'assets/images/emptystate/receiving-material.png',
        MESSAGE: 'No document selected yet!'
      },
      VERIFICATIONHISTORY: {
        IMAGEURL: 'assets/images/emptystate/receiving-material.png',
        MESSAGE: 'No verification history listed yet!'
      },
      SALESORDERHISTORY: {
        IMAGEURL: 'assets/images/emptystate/sales-order-list.png',
        MESSAGE: 'No sales order history listed yet!'
      },
      CUSTOMERPACKINGHISTORY: {
        IMAGEURL: 'assets/images/emptystate/shipped-list.png',
        MESSAGE: 'No customer packing slip history listed yet!'
      },
      CUSTOMERINVOICEHISTORY: {
        IMAGEURL: 'assets/images/emptystate/shipped-list.png',
        MESSAGE: 'No customer invoice history listed yet!'
      },
      TRANSFERSTOCKHISTORY: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'UMID transaction history not found!'
      },
      KITHISTORY: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'Kit history not found!'
      },
      WOHISTORY: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'Work order history not found!'
      },
      PURCHASEORDERHISTORY: {
        IMAGEURL: 'assets/images/emptystate/shipped-list.png',
        MESSAGE: 'No purchase order history listed yet!'
      },
      STARTSTOPACTIVITYHISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'Start stop activity history not found!'
      },
      KITRELEASERETURNHISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'History not found!'
      },
      KIT_ALLOCATION: {
        IMAGEURL: 'assets/images/emptystate/kit-allocation.png',
        MESSAGE: 'Select SO# for show detail of kit',
        BOMNOTFOUND: 'Selected assembly BOM is missing. Please upload in prior to kit allocation',
        ADDNEWMESSAGE: 'Click below to upload BOM',
        RECALCULATE: 'Press RECALCULATE button to get updated value of kit allocation',
        DEALLOCATEUMID: '<div> \
                          <span class="font-size-26">After recalculation, some UMID will be deallocated in following cases</span> <br /> \
                            <ol class="layout-column cm-kit-allocation-emtpy"> \
                              <li class="text-left font-size-20 mb-8">If any line removed from BOM, then it will deallocate the UMID for that line.</li> \
                              <li class="text-left font-size-20 mb-8">If part# is removed from BOM line, then it will deallcoate UMID of that part# along with it\'s packaging aliases.</li> \
                              <li class="text-left font-size-20 mb-8">If any MFR PN changed or removed from sales order, then it will deallocate the UMID for that MFR PN.</li> \
                            </ol> \
                        </div>',
        BOMNOTSAVE: 'Please clean atleast one line of selected kit assembly BOM',
        CLEANBOMMESSAGE: 'Click below to go to BOM for clean line'
      },
      KITRELEASE: {
        MESSAGE: 'Kit Plan detail not found!',
        ADDNEWMESSAGE: 'Click below to add plan kit.',
        SUB_ASSY_MESSAGE: 'Add Kit Plan detail for Main Assembly to get Kit Plan detail for all related Sub Assembly(s).',
        RESOLVED_INVENTORY_ISSUE: 'All inventory issues are resolved. Press RELEASE KIT button to complete release kit.'
      },
      NONUMIDSTOCK: {
        IMAGEURL: 'assets/images/emptystate/receiving-material.png',
        MESSAGE: 'No UMID Pending Parts listed yet!',
        ADDNEWMESSAGE: 'Click below to add a non-UMID stock'
      },
      PURCHASE_CONSOLIDATED: {
        IMAGEURL: 'assets/images/emptystate/empty-shoping-cart.png',
        MESSAGE: 'Select SO# to show Purchase list details',
        BOMNOTFOUND: 'Selected assembly BOM is missing. Please upload in prior to purchase list details',
        ADDNEWMESSAGE: 'Click below to upload BOM',
        RECALCULATE: 'Press RECALCULATE KIT button for get update value of purchase list details!'
      },
      PURCHASE_PARTS_DETAILS: {
        IMAGEURL: 'assets/images/emptystate/empty-shoping-cart.png',
        MESSAGE: 'No purchase list details found!'
      },
      PURCHASE_PARTS_LIST: {
        IMAGEURL: 'assets/images/emptystate/empty-shoping-cart.png',
        MESSAGE: 'Selected assembly BOM is missing. Please upload in prior to purchase list details!',
        ADDNEWMESSAGE: 'Click below to upload BOM'
      },
      RESTRICTUMIDHISTORY: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'Restricted UMID history not found!'
      },
      INOVAXESERVERSTATUS: {
        IMAGEURL: 'assets/images/emptystate/request-response.png',
        MESSAGE: 'Server heartbeat history not found!'
      },
      INOVAXECARTSTATUS: {
        IMAGEURL: 'assets/images/emptystate/request-response.png',
        MESSAGE: 'Cart heartbeat history not found!'
      },
      PURCHASE_ORDER_SUMMARY_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/purchase-order-empty.png',
        MESSAGE: 'Purchase Order summary detail does not exists.'
      },
      PURCHASE_ORDER_PART_LINE_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/purchase-order-empty.png',
        MESSAGE: 'Purchase Order per line detail does not exists.',
        ADDNEWMESSAGE: 'Click below to add a purchase order.'
      },
      INOVAXEUNAUTHORIZELOG: {
        IMAGEURL: 'assets/images/emptystate/request-response.png',
        MESSAGE: 'Unauthorize notification history does not exists.'
      },
      INOVAXEALLLOG: {
        IMAGEURL: 'assets/images/emptystate/request-response.png',
        MESSAGE: 'Transaction request response history does not exists.'
      },
      PENDINGWOCREATION: {
        IMAGEURL: 'assets/images/emptystate/wo-pending.png',
        MESSAGE: 'No work orders pending to create sales order.'
      },
      PSRECEVIEDPARTINSTRUCTIONDETAIL: {
        IMAGEURL: 'assets/images/emptystate/material-inspection-audit.png',
        MESSAGE: 'No packing slip material receive part instruction detail listed yet!'
      },
      POPURCHASEPARTREQUIREMENTNDETAIL: {
        IMAGEURL: 'assets/images/emptystate/material-inspection-audit.png',
        MESSAGE: 'No purchase order material purchase Requirements & Comments detail listed yet!'
      },
      SUPPLIER_QUOTE: {
        IMAGEURL: 'assets/images/emptystate/supplier-quote.png',
        MESSAGE: 'Supplier quotes does not exist.',
        ADDNEWMESSAGE: 'Click below to add Supplier quotes'
      },
      SUPPLIER_QUOTE_PURCHASE_ORDER: {
        IMAGEURL: 'assets/images/emptystate/supplier-quote.png',
        MESSAGE: 'Supplier quotes part price does not exist.'
      },
      SUPPLIER_QUOTE_PART_PRICING_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'No supplier quote part pricing history found!'
      },
      SUPPLIER_QUOTE_PART_PRICING_WHERE_USED: {
        IMAGEURL: 'assets/images/emptystate/supplier-quote.png',
        MESSAGE: 'supplier quote part pricing is not used anywhere.'
      },
      CUSTOMER_PACKING_SLIP: {
        IMAGEURL: 'assets/images/emptystate/shipped-list.png',
        MESSAGE: 'No customer packing slip is listed yet!',
        ADDNEWMESSAGE: 'Click below to add customer packing slip',
        CLEARALLFILTERMESSAGE: 'Please select filter options then click on APPLY FILTERS to get Packing Slip list or else for whole list just click on APPLY FILTERS!'
      },
      CUSTOMER_INVOICE: {
        IMAGEURL: 'assets/images/emptystate/customer-invoice.png',
        MESSAGE: 'No customer invoice is listed yet!',
        ADDNEWMESSAGE: 'Click below to add customer invoice',
        CLEARALLFILTERMESSAGE: 'Please select filter options then click on APPLY FILTERS to get Invoice list or else for whole list just click on APPLY FILTERS!'
      },
      CUSTOMER_CREDIT_MEMO: {
        IMAGEURL: 'assets/images/emptystate/customer-credit-memo.png',
        MESSAGE: 'No customer credit memo is listed yet!',
        ADDNEWMESSAGE: 'Click below to add customer credit memo',
        SELECT_CREDIT_MEMO_TO_APPLY_IN_INV: 'Please select credit memo to apply in invoice.',
        CLEARALLFILTERMESSAGE: 'Please select filter options then click on APPLY FILTERS to get Credit Memo list or else for whole list just click on APPLY FILTERS!'
      },
      CUSTOMER_SHIPASSY: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'Part {0} stock does not exists!'
      },
      STOCK_ADJUSTMENT: {
        IMAGEURL: 'assets/images/emptystate/stock-adjustment.png',
        MESSAGE: 'No Stock Adjustment is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an stock adjustment'
      },
      SEARCH_MATERIAL: {
        IMAGEURL: 'assets/images/emptystate/search-material.png',
        SEARCHMESSAGE: 'Please fill the search criteria for desire result.',
        NOTFOUNDUMID: 'No result matching your search criteria.',
        NOTFOUNDBOM: 'No result matching your search criteria.'
      },
      BOX_SERIAL_NUMBERS: {
        IMAGEURL: 'assets/images/emptystate/box-serial-empty.png',
        MESSAGE: 'No Packaging/Box Serial# is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an box serial#'
      },
      SCAN_BOX_SERIAL: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Serial# transaction not processed yet!'
      },
      SCAN_BOX_SERIAL_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'No serial# transaction history found!'
      }, SALESORDER_OTHER_EXP: {
        IMAGEURL: 'assets/images/emptystate/other-exp-empty.png',
        MESSAGE: 'No Other Charge is listed yet!'
      },
      SUPPLIER_INVOICE_PAYMENT: {
        IMAGEURL: 'assets/images/emptystate/payment-history.png',
        MESSAGE: 'No supplier invoice payment history found!'
      },
      SUPPLIER_INVOICE_REFUND: {
        IMAGEURL: 'assets/images/emptystate/supplier-refund.png',
        MESSAGE: 'No supplier refund history found!',
        SUPPLIER_NOT_SELECTED_MESSAGE: 'Please select supplier and transaction mode.',
        SUPPLIER_CM_DM_FOR_REFUND_NOT_FOUND_MESSAGE: 'No credit/debit memo is listed yet!'
      },
      SUPPLIER_INVOICE_PAYMENT_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'No payment history found!',
        MESSAGE_REFUND: 'No refund history found!',
        MESSAGE_APPLIED_CUST_CREDIT_MEMO_OFF: 'Applied credit memo history not found!',
        MESSAGE_WRITE_OFF: 'No write off history found!'
      },
      SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'No payment details found!'
      },
      SUPPLIER_INVOICE_BALANCE_DUE: {
        IMAGEURL: 'assets/images/emptystate/payment-history.png',
        MESSAGE: 'No supplier invoice payment balalnce found!'
      },
      SUPPLIER_INVOICE_REASON_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'No supplier invoice payment reason history found!'
      },
      MFR_WHERE_USED_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'Transaction history not found!'
      },
      CUSTOMER_PAYMENT: {
        IMAGEURL: 'assets/images/emptystate/customer-payment.png',
        MESSAGE: 'No customer payment found!'
      },
      PENDING_CUSTOMER_PACKING_SLIP_CREATION: {
        IMAGEURL: 'assets/images/emptystate/pending-customer-ps-empty.png',
        MESSAGE: 'No Pending Customer Packing Slip creation list found!',
        CLEARALLFILTERMESSAGE: 'Please select filter options then click on APPLY FILTERS to get Sales Order list or else for whole list just click on APPLY FILTERS!'
      },
      CUSTOMERCREDITMEMOHISTORY: {
        IMAGEURL: 'assets/images/emptystate/shipped-list.png',
        MESSAGE: 'No customer credit memo history listed yet!'
      },
      COUNTAPPROVALHISTORY: {
        IMAGEURL: 'assets/images/emptystate/count-approval-history-empty.png',
        MESSAGE: 'No history for deallocation approval is listed yet!'
      },
      CUSTOMER_INV_CURR_BALANCE_AND_PAST_DUE: {
        IMAGEURL: 'assets/images/emptystate/customer-payment.png',
        MESSAGE: 'Customer aged receivable details not found!'
      },
      HELPBLOGHISTORY: {
        IMAGEURL: 'assets/images/emptystate/help-blog-history.png',
        MESSAGE: 'No history for help blog is listed yet!'
      },
      APPLY_CREDIT_MEMO_TO_INV_PAYMENT: {
        IMAGEURL: 'assets/images/emptystate/apply-credit-memo.png',
        MESSAGE: 'No credit memo applied yet!'
      },
      SPLITUIDLIST: {
        IMAGEURL: 'assets/images/emptystate/split-umid-list.png',
        MESSAGE: 'Split UMID is not found!'
      },
      DEALLOCATEDUIDLIST: {
        IMAGEURL: 'assets/images/emptystate/deallocated-material.png',
        MESSAGE: 'No UMID deallocation is done yet!'
      },
      APPLY_WRITE_OFF_TO_INV_PAYMENT: {
        IMAGEURL: 'assets/images/emptystate/apply-write-off.png',
        MESSAGE: 'No write off applied yet!'
      },
      CUSTOMER_REFUND: {
        IMAGEURL: 'assets/images/emptystate/customer-refund.png',
        MESSAGE_PAYMENT: 'No customer payment marked for refund yet!',
        MESSAGE_CM: 'No customer credit memo marked for refund yet!',
        MESSAGE_PAYREF: 'No customer payment refund applied yet!',
        MESSAGE_CMREF: 'No customer credit memo refund applied yet!',
        MESSAGE_NO_DUPLICATE_RFFUND: 'No duplicate refund/payment found yet!'
      },
      STOCK_ALLOCATION: {
        IMAGEURL: 'assets/images/emptystate/stock-allocated.png',
        ALLOCATE_STOCK_MESSAGE: 'Stock is not allocated yet!',
        INTERNAL_STOCK_MESSAGE: 'Internal stock not found!',
        CUSTOMER_STOCK_MESSAGE: 'Customer stock not found!',
        CONSUMED_STOCK_MESSAGE: 'Stock is not consumed yet!'
      },
      INITIAL_STOCK_ASSEMBLY: {
        IMAGEURL: 'assets/images/emptystate/assembly-stock.png',
        MESSAGE: 'Please select Assy ID and add WO# to show Initial Stock Summary detail.'
      },
      CUSTOMERCONSIGNSTATUSHISTORY: {
        IMAGEURL: 'assets/images/emptystate/change-customer-consigned-status-history.png',
        MESSAGE: 'Customer Consigned Status history not found!'
      },
      SEARCHRECORD: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: 'No result matching your search criteria.'
      }
    },
    RECEIVINGMATERIAL: {
      FIRSTMFG: 'Parts Without Barcode',
      FIRSTSCANLBL: 'Parts With Barcode',
      CreateUMIDWithoutKitAllocation: 'Create UMID without Kit Allocation',
      CreateUMIDWithoutKitAllocationCancel: 'Cancel'
    },
    BINACTIVEINACTIVE:
    {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive'
    },
    SALESORDER: {
      ASSEMBLY: 4,
      REVISION: 5,
      NICKNAME: 6,
      DESCRIPTION: 7,
      QTY: 10,
      PRICE: 11,
      MRPQTY: 15,
      MATERIALDATE: 19,
      SUBQTY: 2,
      SUBSHIPPINGDATE: 3,
      SUBSHIPPINGTYPE: 5,
      FULLADDRESS: 6,
      ACTION: 10,
      SUBPROMISEDSHIPDATE: 4,
      KITQTY: 15
    },
    SHIPPING: {
      FAILED: 'FAILED'
    },
    NOTFOUND: {
      //BARCODETEMPLATENOTFOUND: "Barcode template does not exist, Please add template",
      //MFGPNNOTFOUND: "MFR PN does not exist",           Not In Use
      //MULTIPLEPARTFOUND: "Multiple MFR PN found",       Not In Use
      //MISMATCHPART: "CPN MFR Part is mismatch with CPN MFR Code",       Not In Use
      //NOTINBOM: "MFR PN/Supplier PN/CPN does not contain in this assembly ID. Please select right MFR/Part Number.",
      //MISMATCHBARCODEMFG: "MFGCode is mismatch with barcode template MFGCode",      Not In Use
      //SCANUIDNOTFOUND: "Scanned UMID not found.",
      //SCANWHBINNOTFOUND: "Scanned warehouse/bin not found.",
      //SCANNOTCPN: "Scanned MFR Part is not CPN, Please check",
      //NOTINCPN: "MFR PN is not contain in CPN",
      //MFGPNRECTRICTED: "MFR PN was restricted part."        Not In Use
    },
    DateType: [
      { type: 'N', Name: 'None', IsDisable: false },
      { type: 'M', Name: 'Date of Manufacture', IsDisable: false },
      { type: 'E', Name: 'Date of Expiry', IsDisable: false }
    ],
    DateUnit: [
      { id: 1, Name: 'Day' },
      { id: 2, Name: 'Month' },
      { id: 3, Name: 'Year' }
    ],
    WebcamURLConfigNote: 'Configure IP webcam app  broadcasting url. i.e http://<ip>:<port>',
    WarehouseDept: {
      MaterialDepartment: 'Material Department',
      ProductionDepartment: 'Production Department'
    },
    TypeWHBin: {
      Warehouse: 'Warehouse',
      Bin: 'Bins',
      Rack: 'Rack'
    },
    userAccessMode: {
      Single: 'S',
      Multiple: 'M'
    },
    StartStopActivityTransactionType: [
      { id: 'B', value: 'BOM' },
      { id: 'C', value: 'Costing' },
      { id: 'K', value: 'Kit' }
    ],
    StartStopActivityActionType: [
      { id: 'P', value: 'Production' },
      { id: 'S', value: 'Setup' }
    ],
    UNAUTHORIZEREQUEST: 1004,
    VALIDATION_MSG: {
      //WAREHOUSEUNIQUE: "{0} {1} is already exist.",
      //BINUNIQUE: "{0} {1} is already exist.",
      //CART_ID_UNIQUE: "Cart id must be unique.",
      //USEBININOTHER: "Cannot inactive Bin because it is in use.",
      //USEWHINOTHER: "Cannot inactive Warehouse because it is in use.",
      //EQPINUSE: "Cannot change the equipment because it is in use.",
      //FIRSTACTIVEWH: "Cannot Active Bin, because it's Warehouse is Inactive. First active that Warehouse.",
      //REQUIRE_PREFIX: "UMID Prefix is required for scan label.",
      //REQUIRE_CUSTOMER: "Customer is required for scan label.",
      //SAME_FROM_TO_BIN: "Same From bin and To bin not allowed, Please check",
      //FREIGHT_NOT_GREATER: "Freight is not greater than 100.",      Not In Use
      //TAX_NOT_GREATER: "Tax is not greater than 100.",
      //LINE_ITEM_NOT_FOUND: "Packing slip line# not found in material detail.",
      //UPADTE_INVOICE_PRICE: "Invoice price 0 should not allow.",
      //UPADTE_PURCHASE_PRICE: "Purchase price 0 should not allow.",
      //ALREADY_VERIFIED: "This record is already approved so now you can't change it.",
      //NOT_PAID: "From selected records some records are not approved or already paid. Please check selected records.",
      //MISMATCH_AMOUNT: "Payment amount is mismatch with selected item total.",
      //COUNT_GREATER: "Count could not be greater than SPQ.",
      //PART_EXPIRE: "In future part will be out of expire, please contact to supervisor",
      //COMPONENT_EXPIRE: "Component is expire, please contact to supervisor",
      //AVAILABLE_QTY_GREATER: "Available quantity could not be greater than count.",
      //NOTDELETEUSEBININOTHER: "Cannot delete Bin because it is in use.",        Not In Use
      //NOT_PAID_Othre_Supplier: "From selected records some records are other supplier. Please check selected records.",
      //BARCODE_FIRST_DELIMITER_MFGPN: "Barcode first attribute should be MFR PN.",
      //BARCODE_VALUE_NULL: "Barcode {0} must be required.",
      //BARCODE_DELIMITER_DUPLICATE_MESSAGE: "Barcode delimiter already exist.",
      //PUBLISH_BARCODE_WITH_INVALID_FORM: "In prior to publish barcode template, you must have to fill up all required details of barcode template.",
      //NOT_PACKING_SLIP: "From selected records not any record as a packing invoice. Please check selected records.",
      //CONFIRMATION_FOR_PACKING_SLIP: "Do you want to change in supplier invoice?",
      //REQUIRE_SUB_Assembly: "Assy ID is required for scan label.",
      //RE_CALCULATE_INTERNALVERSIO: "Internal Version are mismatch due to changes in BOM. Current version of BOM is <b>{0}</b> and Kit Allocation version is <b>{1}</b>. Please click on Re-calculate button to apply changes in Kit Allocation.",
      //RE_CALCULATE_KITQTY: "You have made some changes in Kit Quantity of Sales Order# <b>{0}</b>. Please click on Re-calculate button to apply changes in Kit Allocation.",
      //ALLOCATED_QTY_GREATER: "Allocated units could not be greater than units.",
      //CONFIRMATION_FOR_STOCK_ALLOCATION: "Allocating units are more than shortage per build. <br/> Are you sure you want to allocate stock?",
      //STOCK_NOT_ALLOCATED: "This UMID <b>{0}</b> could not be allocated further, because others UMID already shared with this kit. <br/> To allocate this UMID into this kit, please de-allocate from the existing kit <b>{1}</b>.",
      //UMID_STOCK_NOT_ALLOCATED: "This UMID could not be allocated further, because others UMID already shared with this kit. <br/> To allocate this UMID into this kit, please de-allocate from the existing kit <b>{0}</b>.",
      //SAME_UMID_ALLOCATED: "Same UMID <b>{0}</b> is already allocated. <br/> Are you sure you want to allocate same UMID in this kit?",
      //MFGPNRECTRICTEDWITHPERMISION: "<b>{0}</b> has been restricted with permission. <br/> Are you sure you want to give permission for scan this MFR PN?",     Not In Use
      //PIDRECTRICTEDWITHPERMISION: "PID <b>{0}</b> has been <b>{1}</b> at the part master level.",
      //REENTERBIN: "Please do either Scan <b>{0}</b> name or type <b>{1}</b> name and press enter key.",
      //PARTRESTRICTINBOM: "PID <b>{0}</b> has been <b>Restrict use in BOM</b>.<br/>Thus, you cannot allocate to this assembly.",
      //PARTRESTRICTWITHPERMISSIONINBOM: "PID <b>{0}</b> has been <b>Restricted With Permission</b> at BOM level.",
      //CHECKTOFROMVALUE: "From value must be smaller then To value.",
      //BARCODE_CONTAIN_MFGPN: "MFR PN must be require in barcode attribute.",
      //PARTNOTPOPULATE: 'MFR PN does not populate in BOM. So, you cannot allocate to kit.',
      //BOMLINENOTCLEAN: 'Due to the below pending issues/status your BOM line is not clean. So, you cannot allocate to kit.<br/>{0}',
      //BOMLINENOTCLEAN: 'Assembly <b>{0}\'s</b> BOM line no <b>{1}</b> is not clean. So, you cannot allocate UMID into kit.',
      //RESERVEFORCUSTOMER: 'UMID <b>{0}</b> is reserve for customer <b>{1}</b>. So, you cannot allocate to customer <b>{2}</b>.',
      //RESERVEFORASSY: 'UMID <b>{0}</b> is reserve for assembly <b>{1}</b>. So, you cannot allocate to assembly <b>{2}</b>.',
      //FROMTODEPTSAME: "<b>From Bin</b> and <b>To Bin</b> department must be same.",
      //UNRESERVECONFIMATION: "Are you sure you want to unreserve stock?",
      //MFRRESTRICTEDPART: "PID <b>{0}</b> was <b>{1}</b> at the part master level.",
      //MFRRESTRICTEDPACKAGINGPART: "PID <b>{0}</b> was <b>{1}</b> at the part master level.",
      //PIDRECTRICTEDPACKAGINGWITHPERMISION: "PID <b>{0}</b> has been <b>{1}</b> at the part master level.",
      //WITHRESERVE: "In selected record some record is reserve, Please check the selected record",
      //WITHOUTRESERVE: "In selected record some record is without reserve, Please check the selected record",
      //PARTEXISTWITHSAMEPACKAGING: "<b>{0}</b> is already existed in the list with the same <b>{1}</b> packaging. <br /> Please, update either Packaging type or append into existing quantity.",
      //BINCONTAINSAMEPSPART: "This PID <b>{0}</b> containing into the <b>{1}</b> supplier's packing slip number <b>{2}</b>, is already existed in the <b>{3}</b> bin/location. Please select different bin.",
      //SCANMFRPN: "<br/> Are you sure you want to give permission to this MFR PN?",
      //ALLOCATETOKIT: "<br/> Are you sure you want to give permission for allocate to this kit?",
      //MFRPNBADPART: "PID <b>{0}</b> has been defined as an <b>{1}</b> in part master, You cannot receive this part.",
      //RESTRICTMISMATCH: "UMID <b>{0}</b> is already <b>{1}</b>.",
      //FILLDETAILFORKITALLOCATION: "<br/> Please fill the User ID, Password and Reason for give permission to allocate in kit",
      //FILLDETAILFORUMID: "<br/> Please fill the User ID, Password and Reason to give permission to generate UMID.",
      //FILLDETAILFORSLIP: "<br/> Please fill the User ID, Password and Reason to give permission.",
      //SCANVALIDUMID: "Please enter or scan valid UMID.",
      //PERMISSIONPARTNOTCUSTOMERAPPROVE: "PID <b>{0}</b> is <b>{1}</b> at part master level, but did not get customer approval at the BOM level. <br />So you cannot allocate in kit",
      //MISMATCHSUPPLIER: "MFR PN <b>{0}</b> does not belong from the Selected supplier <b>{1}</b>.",
      //MISMATCHUOMFORKITALLOCATION: "There is an inappropriate available stock detail due to the mismatch of UOM on line item <b>{0}</b> of the BOM. Please resolve the error to get proper stock detail."
    },
    VerifyPictureType: {
      TakePicture: 'Take Picture',
      TransferLabel: 'Transfer Label',
      VerifyPicture: 'Verify Picture'
    },
    SupplierInvoiceType: {
      Detail: 'detail',
      Document: 'document',
      PackingSlipDocument: 'packingslipdocument',
      OtherDetail: 'otherdetail'
    },
    MaterialReceiveTabType: {
      Detail: 'detail',
      InvoiceVerification: 'InvoiceVerification',
      PackingSlip: 'PackingSlip',
      Documents: 'Documents',
      PackingSlipDocument: 'PackingSlipDocument',
      SupplierInvoiceDocument: 'SupplierInvoiceDocument',
      MISC: 'MISC'
    },
    TypeOfUpdateMaterial: [{ Key: 'Add Line', Value: true, isDisabled: false }, { Key: 'Add Line (Other)', Value: false, isDisabled: false }],
    ComponentStockType: [{ Key: 'Inventory (UMID and Non-UMID)', Value: true, isDisabled: false }, { Key: 'Without Inventory', Value: false, isDisabled: false }],
    PackingSlipTabType: {
      PackingSlip: 'PackingSlip',
      InvoiceVerification: 'InvoiceVerification',
      CreditMemo: 'creditmemo',
      DebitMemo: 'debitmemo'
    },
    SupplierQuoteTabs: {
      Detail: { ID: 0, Name: 'detail' },
      Documents: { ID: 1, Name: 'documents' }
    },
    SO_COMMISSION_ATTR: {
      PARTMASTER: {
        COMMISSIONCALCULATEDFROM: 'From Part Master',
        FIELDNAME: 'Sales Price Matrix',
        ID: 1
      },
      RFQ: {
        COMMISSIONCALCULATEDFROM: 'From RFQ',
        FIELDNAME: 'RFQ Quote Summary',
        ID: 2
      },
      MISC: {
        COMMISSIONCALCULATEDFROM: 'MISC',
        FIELDNAME: 'Manual',
        ID: 3
      }
    },
    PackingSlipColumn: {
      Status: 'status',
      ChequeNumber: 'chequeNumber',
      BankName: 'bankName',
      ChequeDate: 'chequeDate',
      ChequeAmount: 'chequeAmount',
      BankAccountNo: 'bankAccountNo',
      AccountReference: 'accountReference',
      PaymentMethod: 'paymentTypeName',
      ItemReceived: 'itemReceived',
      ReceiptType: 'receiptMemoType',
      ModifyDate: 'updatedAt',
      Amount: 'totalExtendedAmount',
      TotalCreditAmount: 'totalCreditAmount',
      TotalAmount: 'amount',
      InvoiceNoField: 'invoiceNumber',
      InvoiceDate: 'invoiceDate',
      DebitNoField: 'debitMemoNumber',
      DebitDate: 'debitMemoDate',
      CreditNoField: 'creditMemoNumber',
      CreditDate: 'creditMemoDate',
      PackingSlipNumber: 'packingSlipNumber',
      ItemDisapprove: 'itemDisapproved',
      AmountToPay: 'amountToPay',
      TotalDebitAmount: 'totalDebitAmount',
      PackingDetailNote: 'packingDetailNote',
      RefInvoiceNumber: 'refInvoiceNumber',
      DisplayInvoiceNoField: 'Invoice/Credit Number',
      DisplayInvoiceDate: 'Invoice/Credit Date',
      DisplayDebitNoField: 'Debit Number',
      DisplayDebitDate: 'Debit Date',
      InvoiceStatus: 'invoiceStatus',
      PaymentDueDate: 'paymentDueDate',
      PaymentTermName: 'paymentTermName'
    },
    PackingSlipLineColumn: {
      ApproveNote: 'approveNote',
      ReceiptTypeName: 'receiptTypeName',
      CreditMemoNumber: 'creditMemoNumber',
      CreditMemoDate: 'creditMemoDate',
      DebitMemoNumber: 'debitMemoNumber',
      DebitMemoDate: 'debitMemoDate',
      Difference: 'difference',
      DifferenceQty: 'differenceQty',
      Amount: 'amount',
      InvoiceVerificationStatus: 'invoiceVerificationStatus',
      MemoNumber: 'memoNumber',
      RefInvoiceLine: 'refInvoiceLine',
      RefInvoiceNumberForMemo: 'refInvoiceNumberForMemo',
      ReceivedStatusValue: 'receivedStatusValue',
      PurchasePrice: 'purchasePrice',
      VerificationAction: 'Verification Action',
      ChargedStatus: 'Charged Status',
      SupplierCode: 'supplierCode',
      SupplierPN: 'supplierPN'
    },
    PackingSlipDetailColumn: {
      InvoiceVerificationStatus: 'invoiceVerificationStatus',
      Status: 'status'
    },
    Packaging: {
      TapeAndReel: 'Tape & Reel',
      CuteTape: 'Cut Tape',
      CustomReel: 'Custom Reel',
      Bulk: 'Bulk'
    },
    EventName: {
      UpdateAllPurchasePricing: 'UpdateAllPurchasePricing',
      UpdatePurchaseStatus: 'UpdatePurchaseStatus',
      PurchaseStockUpdate: 'PurchaseStockUpdate'
    },
    CheckSearchType: [
      { id: 'E', value: 'Exact Search' },
      { id: 'C', value: 'Contains Search' }
    ],
    warehouseType: {
      SmartCart: { key: 'SMC', value: 'Smart Cart' },
      ShelvingCart: { key: 'SHC', value: 'Shelving Cart' },
      Equipment: { key: 'EQP', value: 'Equipment' }
    },
    smartCartStatus: [
      {
        value: 1,
        Name: 'Online'
      },
      {
        value: 0,
        Name: 'Offline'
      }
    ],
    warehouseTypes: [{ Name: 'Smart Cart' }, { Name: 'Shelving Cart' }, { Name: 'Equipment' }],
    DepartmentType: [
      { id: -1, value: 'Main Material Warehouse' },
      { id: -2, value: 'Main Production Warehouse' }
    ],
    binType: [
      { key: 'Non-Movable', value: true },
      { key: 'Movable', value: false }
    ],
    binGenerate: [
      { key: 'Single', value: true },
      { key: 'Multiple', value: false }
    ],
    binGenerateType: [
      { key: 'Random', value: true },
      { key: 'Sequence', value: false }
    ],
    binGenerateMethod: [
      { key: 'Range', value: true },
      { key: 'Manual', value: false }
    ],
    binPrefixMethod: [
      { key: 'Prefix', value: true },
      { key: 'Suffix', value: false }
    ],
    Warehouse_Side: {
      L: {
        key: 1, value: 'Left'
      },
      R: {
        key: 2, value: 'Right'
      },
      B: {
        key: 3, value: 'Left & Right'
      }
    },
    Warehouse_Audit_Side: {
      L: {
        key: 0, value: 'Left'
      },
      R: {
        key: 1, value: 'Right'
      }
    },
    Department_Search: {
      Department: {
        key: 1, value: 'Department Level'
      },
      System: {
        key: 2, value: 'Company Level'
      }
    },
    KIT_STATUS: {
      Released: 'Released',
      InProgress: 'In Progress'
    },
    KIT_RELEASE_STATUS: {
      R: { name: 'Released', value: 'R' },
      P: { name: 'In Progress', value: 'P' }
    },
    KIT_RETURN_STATUS: {
      NA: { name: 'N/A', value: 'NA' },
      NR: { name: 'Not Returned', value: 'NR' },
      RR: { name: 'Ready To Return', value: 'RR' },
      PR: { name: 'Partially Returned', value: 'PR' },
      RS: { name: 'Intent to Re-Release', value: 'RS' },
      FR: { name: 'Fully Returned', value: 'FR' }
    },
    Purchase_Split_UI: {
      PurchaseGridUI: 'gridScrollHeight_Purchase_Split',
      SelectedPartGridUI: 'gridScrollHeight_Purchase_SelectedPart_Split',
      PricingGridUI: 'gridScrollHeight_Purchase_Price_Split'
    },
    PartComment_Split_UI: {
      PurchasingIncomingInspectionCommentsGridUI: 'gridScrollHeight_PurchasingIncomingInspectionComments_Split',
      ManufacturingProductionCommentsGridUI: 'gridScrollHeight_ManufacturingProductionComments_Split',
      ShippingCommentsGridUI: 'gridScrollHeight_ShippingComments_Split',
      PartCommentsGridUI: 'gridScrollHeight_PartComments_Split'
    },
    SalesPrice_Quote_Split_UI: {
      QuoteHistoryGridUI: 'gridScrollHeight_QuoteHistory_Split',
      QuoteHistoryDetailGridUI: 'gridScrollHeight_QuoteHistoryDetail_Split'
    },
    restrictUMIDType: [
      { key: 'Restrict UMID', value: true },
      { key: 'Unrestrict UMID', value: false }
    ],
    restrictUMIDReasonTitle: 'Reason For Restricted UMID',
    KitAllocationAdvanceFilterType: {
      FunctionalType: 'functionalType',
      MountingType: 'mountingType',
      CartType: 'cartType',
      Warehouse: 'warehouse'
    },
    PackingSlipInvoiceTabName: {
      PackingSlip: 'Packing Slip',
      SupplierInvoices: 'Invoice',
      DebitMemo: 'Debit Memo',
      CreditMemo: 'Credit Memo',
      SupplierRMA: 'RMA'
    },
    IPWebCamConfiguration: {
      HeaderLabel: 'IP Webcam Configuration',
      ToolTipLabel: 'Click for detailed IP Webcam Configuration',
      DownloadLink: 'https://play.google.com/store/apps/details?id=com.pas.webcam&hl=en_IN',
      Step1Message: 'Install Application IP Webcam By Pavel Khlebovich from Google Play Store.',
      Step2Message: 'Modify the webcam setting by accessing video preferences.',
      Step3Message: 'Go to service control and select start server option. ',
      Step3SubMessage1: 'Note: After starting the server give necessary permission to allow audio,video and capture from mobile device.',
      Step4Message1: 'Take the Live stream URL from here.',
      Step4Message2: 'Also you can modify the webcam setting by opening below URL in browser.',
      Step4URLNote: 'Note: If browser stops you while accessing the URL click on Advance button and then click to Proceed link.'
    },
    invoiceType: [
      { key: 'Invoice', value: true },
      { key: 'MISC Invoice', value: false }
    ],
    AUDITPAGE: {
      ErrorStatus: {
        OK: 'Matched',
        Mismatched: 'Bin/Location mismatched',
        NotInInovaxe: 'Available in system, Not available in inovaxe',
        NotInFJT: 'Not available in system, Available in inovaxe'
      },
      NextRowInterval: 'NextRowInterval',
      SearchRequestTimeout: 'SearchRequestTimeout'
    },
    InvoiceMemoType: {
      DebitMemo: 'Debit Memo',
      CreditMemo: 'Credit Memo'
    },
    miscFilter: [
      { Name: 'Restricted Part' },
      { Name: 'Available To Sell' },
      { Name: 'Restricted UMID' },
      { Name: 'Internal Stock' },
      { Name: 'Customer Stock' }
    ],
    InventoryType: [
      { Name: 'New Incoming Stock', value: 'NI' },
      { Name: 'Move Non-Q2C to Q2C Stock', value: 'OI' },
      { Name: 'Non-UMID Assembly Stock', value: 'AI' },
      { Name: 'Split UMID', value: 'SI' }
    ],
    InventoryTypeDropDown: [
      { id: null, value: 'All' },
      { id: 'New Incoming Stock', value: 'New Incoming Stock' },
      { id: 'Move Non-Q2C to Q2C Stock', value: 'Move Non-Q2C to Q2C Stock' },
      { id: 'Non-UMID Assembly Stock', value: 'Non-UMID Assembly Stock' },
      { id: 'Split UMID', value: 'Split UMID' }
    ],
    ReceiveMaterialTypeDropDown: [
      { id: null, value: 'All' },
      { id: 'Purchased Part', value: 'Purchased Part' },
      { id: 'Customer Consigned Part', value: 'Customer Consigned Part' }
    ],
    PackingSlipSameLineConfirmationButton: {
      EditLine: 'Edit Line',
      ChangeLine: 'Change Line#'
    },
    PackingSlipScanMismatchButton: {
      RESET: 'RESET'
    },
    BarcodeFixDelimeter: {
      NONE: 'NONE',
      BLANK: 'BLANK'
    },
    UMID_History_Split_UI: {
      UmidHistoryGridUI: 'gridScrollHeight_UMID_History_Split',
      KITWOHistoryGridUI: 'gridScrollHeight_Kit_WO_Split'
    },
    STOCK_ALLOCATION_POPUP: {
      AllocatedUnit: 'Allocated Unit'
    },
    UMID_STATUS_LIST_SCREEN: {
      Bin_Transfer: 'Bin Transfer',
      UMID_Transfer: 'UMID Transfer',
      UMID_Stock_Transfer: 'UMID Stock Transfer'
    },
    RELEASE_KIT_INFORMATION_MESSAGE: {
      NOT_ALLOCATE: 'Note: To release kit, please allocate inventory first.',
      MISAMATCH_COUNT: 'Note: Resolve All mismatched items/bins prior to releasing kit.',
      RESOLVE_ISSUE_FOR_KIT_RELEASE: 'Note: Resolve following inventory issue(s) to complete the kit release.',
      RESOLVE_ISSUE_FOR_TRANSFER_WH: 'Note: Resolve following inventory issue(s) to transfer warehouse.',
      RESOLVE_ISSUE_FOR_TRANSFER_BIN: 'Note: Resolve following inventory issue(s) to transfer bin.',
      RESOLVE_ISSUE_FOR_TRANSFER_KIT: 'Note: Resolve following inventory issue(s) to transfer kit.'
    },
    PERFORM_ACTION_IN_TRANSFER_VALIDATION: {
      OPEN_EMPTY_POP_UP: 'Open transfer empty bin pop-up',
      WH_TRANSFER_CONFIRMATION_ALLOCATED_KIT: 'WH transfer allocated kit confirmation',
      WH_TRANSFER_CONFIRMATION_UNALLOCATED_UMID: 'WH transfer unallocated UMID confirmation'
    },
    TRANSFER_EMPTY_BIN_ACTION: {
      TRANSFER_EMPTY_BIN: 'TransferEmptyBin',
      CONTINUE: 'Continue'
    },
    TRANSFER_BIN_VALIDATION_TYPE: {
      BINCONTAINKIT: 'BINCONTAINKIT',
      Unallocate: 'UNALLOCATEUMID'
    },
    RequestShippingTabs: {
      Detail: { ID: 0, Name: 'detail' },
      Approval: { ID: 1, Name: 'approval' }
    },
    PackingSlipReceivedStatus: [
      { key: 'Pending', value: 'P' },
      { key: 'Accepted', value: 'A' },
      { key: 'Rejected', value: 'R' },
      { key: 'Accepted with Deviation', value: 'AD' }
    ],
    dropDownPackingSlipReceivedStatus: [
      { id: null, value: 'All' },
      { id: 'Pending', value: 'Pending' },
      { id: 'Accepted', value: 'Accepted' },
      { id: 'Accepted with Deviation', value: 'Accepted with Deviation' },
      { id: 'Rejected', value: 'Rejected' }
    ],
    PackingSlipInspectionStatus: [
      { key: 'Pending', value: 'P' },
      { key: 'Accept', value: 'A' },
      { key: 'Reject', value: 'R' },
      { key: 'Accepted with Deviation', value: 'AD' }
    ],
    PackingSlipStatus: {
      WAITINGFORINVOICE: 'W',
      APPROVEDTOPAY: 'A',
      PAID: 'P',
      PARTIALLY_PAID: 'PP'
    },
    ReGetType: {
      REFRESH: 'REFRESH',
      INSERT: 'INSERT',
      UPDATE: 'UPDATE',
      DELETE: 'DELETE'
    },
    QTYTYE: {
      POQTY: 1,
      MRPQTY: 2,
      KITQTY: 3
    },
    SalesCommissionFrom: {
      FromRFQ: { id: 1, value: 'From Quote' },
      FromPartMaster: { id: 2, value: 'From Part Master' },
      NA: { id: 3, value: 'N/A' }
    },
    OnChangeCommissionType: {
      assyId: { id: 'assyId', value: 'MFR PN' },
      quoteFrom: { id: 'quoteFrom', value: 'Quote From RFQ/Part Master' },
      quoteGroup: { id: 'quoteGroup', value: 'Quote Group' },
      poQty: { id: 'poQty', value: 'PO Qty' },
      quoteQtyTurnTime: { id: 'quoteQtyTurnTime', value: 'Quote Qty Turn Time' },
      price: { id: 'price', value: 'Price' },
      shipQty: { id: 'shipQty', value: 'Qty' }
    },
    Search_Material_Split_UI: {
      SearchUmidGridUI: 'gridScrollHeight_Search_UMID_Split'
    },
    SearchMaterialPrintOption: [
      { value: 'NN', key: 'Nickname' },
      { value: 'AI', key: 'Assy ID' },
      { value: 'AS', key: 'Assy#' },
      { value: 'FT', key: 'Free Text' }
    ],
    PSReceivedPartInspectionColumn: {
      Instruction: 'instruction',
      InspectionStatusValue: 'inspectionStatusValue',
      Remark: 'remark'
    },
    DEFAULT_OTHER_LINE: 1,
    PO_DETAIL_TAB: {
      DETAIL: 1,
      PART_DETAIL: 2
    },
    SupplierRMATab: {
      SupplierRMA: 'supplierrma',
      Documents: 'documents',
      MISC: 'misc'
    },
    SupplierRMATabName: {
      SupplierRMA: 'Supplier RMA',
      Documents: 'Documents',
      MISC: 'MISC'
    },
    SupplierInvoiceRefundTabs: {
      Detail: { ID: 0, Name: 'detail' },
      Document: { ID: 1, Name: 'documents' }
    },
    SupplierInvoicePaymentTabs: {
      Detail: { ID: 0, Name: 'detail' },
      Document: { ID: 1, Name: 'documents' }
    },
    PackingSlipReceiptType: {
      PackingSlip: 'P',
      SupplierInvoice: 'I',
      CreditMemo: 'C',
      DebitMemo: 'D',
      SupplierRMA: 'R'
    },
    PURCHASEORDER: {
      ASSEMBLY: 3,
      QTY: 9,
      PRICE: 10,
      SUBQTY: 2,
      SUBDUEDATE: 3,
      PROMISEDDELIVERYDATE: 4
    },
    creditMemoType: [
      { key: 'Invoice Credit Memo (Auto)', value: 'IC' },
      { key: 'RMA Credit Memo', value: 'RC' },
      { key: 'MISC Credit Memo', value: 'MC' }
    ],
    UMIDListAdvancedFilters: {
      MfgCode: { value: 'Manufacturer', isDeleted: true, isDisable: false },
      SupplierCode: { value: 'Supplier', isDeleted: true, isDisable: false },
      FunctionalType: { value: 'Functional Type', isDeleted: true, isDisable: false },
      MountingType: { value: 'Mounting Type', isDeleted: true, isDisable: false },
      AllocatedKit: { value: 'Allocated Kit', isDeleted: true, isDisable: false },
      WarehouseType: { value: 'Warehouse Type', isDeleted: true, isDisable: false },
      InventoryType: { value: 'Inventory Type', isDeleted: true, isDisable: false },
      Misc: { value: 'MISC', isDeleted: true, isDisable: false },
      CostCategory: { value: 'Cost Category', isDeleted: true, isDisable: false },
      Standard: { value: 'Standard', isDeleted: true, isDisable: false },
      ParentWarehouse: { value: 'Parent Warehouse', isDeleted: true, isDisable: false },
      Warehouse: { value: 'Warehouse', isDeleted: true, isDisable: false },
      Rohs: { value: 'RoHS', isDeleted: true, isDisable: false },
      SearchUmidPidMfrPn: { value: 'Search UMID / PID / MFR PN', isDeleted: true, isDisable: false },
      SearchInternalDateCode: { value: 'Search Internal Date Code', isDeleted: true, isDisable: false },
      ScanLocationBINWarehouse: { value: 'Scan (Location) / Warehouse', isDeleted: true, isDisable: false },
      InTransit: { value: 'In Transit (Bin to Bin)', isDeleted: true, isDisable: false },
      ExpiredMaterial: { value: 'Expire Material', isDeleted: true, isDisable: false },
      StockStatus: { value: 'Stock Status', isDeleted: true, isDisable: true },
      CreatedOn: { value: 'Created On', isDeleted: true, isDisable: false },
      NonCOFC: { value: 'Non COFC', isDeleted: true, isDisable: false },
      CreatedBy: { value: 'Created By', isDeleted: true, isDisable: false },
      ClearAll: { value: 'Clear All', isDeleted: true, isDisable: true }
    },
    NonUMIDListAdvancedFilters: {
      Supplier: { value: 'Supplier', isDeleted: true },
      SearchPidMfrPn: { value: 'Search PID / MPN', isDeleted: true },
      ReceivedStatus: { value: 'Received Status', isDeleted: true },
      SearchPackingSlip: { value: 'Packing Slip#', isDeleted: true },
      SearchWarehouseBin: { value: 'Search Warehouse/Bin', isDeleted: true },
      PackingSlipDate: { value: 'Packing Slip Date', isDeleted: true },
      ClearAll: { value: 'Clear All', isDeleted: true }
    },
    SupplierQuoteAdvancedFilters: {
      Supplier: { value: 'Supplier', isDeleted: true },
      QuoteStatus: { value: 'Quote Status', isDeleted: true },
      QuoteDate: { value: 'Quote Date', isDeleted: true },
      Parts: { value: 'MPN/ SPN', isDeleted: true },
      Quote: { value: 'Quote#', isDeleted: true },
      ClearAll: { value: 'Clear All', isDeleted: true }
    },
    ActivityTrackingAdvanceFilters: {
      Personnel: { value: 'Personnel', isDeleted: true },
      TransactionType: { value: 'Transaction Type', isDeleted: true },
      ActivityType: { value: 'Activity Type', isDeleted: true },
      PartId: { value: 'Assy # /Assy ID', isDeleted: true, isDisable: false },
      ClearAll: { value: 'Clear All', isDeleted: false }
    },
    DCFormatAdvanceFilters: {
      DCFormat: { value: 'Date Code Format', isDeleted: true, isDisable: false },
      ClearAll: { value: 'Clear All', isDeleted: false, isDisable: false }
    },
    CountApprovalAdvanceFilters: {
      DCFormat: { value: 'UMID', isDeleted: true, isDisable: false },
      QuoteDate: { value: 'Approved Date', isDeleted: true, isDisable: false },
      ClearAll: { value: 'Clear All', isDeleted: false, isDisable: false }
    },
    debitMemoType: [
      { key: 'Invoice Debit Memo', value: 'ID' },
      { key: 'MISC Debit Memo', value: 'MD' }
    ],
    UMIDTextAdvanceFilterTypeDropDown: [
      { id: 'C', value: 'Contains' },
      { id: 'E', value: 'Exact' }
    ],
    CustomerPaymentTabIDs: {
      CustomerPayment: 0,
      Document: 1
    },
    UnderPaymentActions: {
      LeavethisAsAnUnderpayment: { Key: 'Leave this as an underpayment', Value: '1' },
      WriteOffTheExtraAmount: { Key: 'Write off the extra amount', Value: '2' }
    },
    OverPaymentActions: [
      { Key: 'Leave the credit to be used later', Value: 1 },
      { Key: 'Refund the amount to the customer', Value: 2 }
    ],
    CustomerInvRadioGroup: {
      invoiceType: [{ Key: 'Invoice', Value: true }, { Key: 'MISC Invoice', Value: false }]
    },
    CustomerPaymentDiffNotes: {
      AccountReferenceTooltip: 'This field information will retrieve from the selected customer master.',
      AccountReferenceNote: 'Hint: Supplier ID is given by the Customer.',
      WriteOffAmtTooltip: 'Hint: Please select at least one invoice to apply write off.'
    },
    RMAStockStatus: {
      PendingUMID: 'PU',
      UMID: 'U'
    },
    /*used in Supplier and Customer Payment transactions*/
    CustomerPaymentLockStatus: {
      NA: 'NA',
      ReadyToLock: 'RL',
      Locked: 'LC'
    },
    /*used in Supplier and Customer Payment transactions*/
    CustomerPaymentLockStatusList: [{
      Name: 'NA',
      ClassName: 'label-warning'
    }, {
      Name: 'RL',
      ClassName: 'label-success'
    }, {
      Name: 'LC',
      ClassName: 'label-danger'
    }
    ],
    TAPEANDREELID: 1,
    SupplierPaymentLockStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Ready To Lock', value: 'Ready To Lock'
      },
      {
        id: 'Locked', value: 'Locked'
      }
    ],
    /* for binding in ui-grid header filter Lock Status in customer payment list*/
    CustomerPaymentLockStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Not Applicable', value: 'Not Applicable'
      },
      {
        id: 'Ready To Lock', value: 'Ready To Lock'
      },
      {
        id: 'Locked', value: 'Locked'
      }
    ],
    CustomerPaymentNotes: {
      PaymentVarianceHelpText: 'Payment Variance = Payment amount - (Sum of selected invoice payment + Agreed Refund amount)',
      PayZeroInvPaymentNumNote: 'Payment# is Auto for $0 invoice(s)',
      CustomerReceiptInvoiceAutoSelectHelpText: 'Once user enter payment amount, Invoice selection is based on "CustomerReceiptInvoiceAutoSelect" key setting applied from data  keys.',
      NoOfDaysLateHelpText: '#Days Late calculation is based on customer current terms days. Current terms days are derived from Customer Master.',
      CurrentTermsDaysAgeReceivableHint: 'Current terms days are derived from Customer Master.',
      RemainingAmountHelpText: 'Remaining Amount = Credit memo amount - Sum of selected invoice payment',
      RemainingCreditMemoAmtHelpText: 'Remaining Credit Memo Amount = Credit Memo Amount - (Total Credit Memo Amount Applied In Invoice + Agreed Refund Amt.)',
      CMInvAppliedDateLTErrorText: 'Not less than credit memo date',
      WriteOffTotAmtHint: 'Hint: Select invoice and enter Write Off amount. Entered amount will be reflected in total write off amount above',
      TotalPaymentAmtHelpText: 'Includes Current Payment Amt.',
      TotalWriteOffAmtHelpText: 'Includes Current WOFF Amt.',
      TotalAppliedCMAmtHelpText: 'Includes Current CM Amt.'
    },
    CustomerPaymentStatusList: [{
      Name: 'No Pending Amount',
      ClassName: 'green-bg'
    },
    {
      Name: 'Fully Applied',
      ClassName: 'label-success'
    }, {
      Name: 'Partially Applied',
      ClassName: 'label-primary'
    },
    {
      Name: 'Not Applied',
      ClassName: 'label-warning'
    },
    {
      Name: 'Voided',
      ClassName: 'label-danger'
    }
    ],
    CustomerPaymentAdvanceFilters: {
      Customer: { value: 'Customer', isDeleted: true },
      PaymentMethod: { value: 'Payment Method', isDeleted: true },
      BankAccountCode: { value: 'Bank Account Code', isDeleted: true },
      PaymentOrCheckNumber: { value: 'Payment# or Check#', isDeleted: true },
      PaymentDate: { value: 'Payment Date', isDeleted: true },
      InvoiceDate: { value: 'Invoice Date', isDeleted: true },
      AppliedDate: { value: 'Applied Date', isDeleted: true },
      InvoiceNumber: { value: 'Invoice#', isDeleted: true },
      PaymentAmount: { value: 'Payment Amount ($)', isDeleted: true },
      TotAppliedCMAmount: { value: 'Total Applied Credit Memo Amount ($)', isDeleted: true },
      IsShowZeroPaymentOnly: { value: 'Show Zero Payment Only', isDeleted: true },
      TransactionOrCreditMemoNumber: { value: 'Transaction# or Credit Memo#', isDeleted: true },
      AppliedCreditMemoAmount: { value: 'Applied Credit Memo Amount ($)', isDeleted: true },
      TransactionNumber: { value: 'Transaction#', isDeleted: true },
      TransactionDate: { value: 'Transaction Date', isDeleted: true },
      IsIncludeVoidedTransaction: { value: 'Include Void Transaction', isDeleted: true },
      WriteOffNumber: { value: 'Write Off#', isDeleted: true },
      WriteOffDate: { value: 'Write Off Date', isDeleted: true },
      WriteOffAmount: { value: 'Write Off Amount ($)', isDeleted: true },
      PaymentRefundStatus: { value: 'Payment Refund Status', isDeleted: true }
    },
    CustomerPaymentListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    CustInvPayAgedReceivableTabs: {
      //AgedReceivable: { tabName: 'AgedReceivable', title: 'Aged Receivable', requestType: 'AR' },
      PastDue: { tabName: 'PastDue', title: 'Past Due', requestType: 'PD' }
    },
    ApplyCustCreditMemoManageTabIDs: {
      Detail: 0,
      Document: 1
    },
    ReceivablePaymentMethodGenericCategory: {
      CreditMemo: { gencCategoryName: 'Credit Memo', gencCategoryCode: 'CM' },
      WriteOff: { gencCategoryName: 'Write Off', gencCategoryCode: 'WOFF' }
    },
    ReceivableRefPaymentMode: {
      ReceivablePayment: { name: 'Payment', code: 'R', className: 'label-success' },
      CreditMemoApplied: { name: 'Credit Memo Applied', code: 'CA', className: 'label-warning' },
      Refund: { name: 'Refund', code: 'CR', className: 'label-danger' },
      Writeoff: { name: 'Write Off', code: 'WOFF', className: 'label-primary' }
    },
    ApplyCustomerCreditMemoStatusText: {
      All: { id: null, value: 'All', Code: '' },
      UnappliedCredit: { id: 'Unapplied Credit', value: 'Unapplied Credit', ClassName: 'md-purple-300-bg', Code: 'PE', Name: 'Unapplied Credit' },
      PartialCreditApplied: { id: 'Partial Credit Applied', value: 'Partial Credit Applied', ClassName: 'label-primary', Code: 'PR', Name: 'Partial Credit Applied' },
      FullCreditApplied: { id: 'Full Credit Applied', value: 'Full Credit Applied', ClassName: 'label-success', Code: 'RE', Name: 'Full Credit Applied' },
      NoPendingCredit: { id: 'No Pending Credit', value: 'No Pending Credit', ClassName: 'green-bg', Code: 'NP', Name: 'No Pending Credit' }
    },
    CustAppliedCreditMemoListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    CustAppliedWriteOffListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    ApplyCustWriteOffManageTabIDs: {
      Detail: 0,
      Document: 1
    },
    CustomerRefundTabIDs: {
      CustomerRefund: 0,
      Document: 1
    },
    CustomerRefundNotes: {
      OffsetAmountHelpNote: 'Offset amount will be extra amount added in Refund amount.',
      RefundAmountHelpNote: 'Total Refund Amount will be sum of selected Payment or Credit Memo Refund Amount and Offset Amount.',
      PaymentCMNumberHelpNote: 'Select Payment or Credit Memo and enter Refund amount. Entered amount will be reflected in total refund amount above.',
      CommentRefundPrintNote: 'Will print on refund remittance advise report.'
    },
    CustomerRefundStatusList: [{
      Name: 'Paid',
      ClassName: 'label-success'
    }, {
      Name: 'Voided',
      ClassName: 'label-warning'
    }
    ],
    /* for binding in ui-grid header filter refund Status in customer refund list*/
    CustomerRefundStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Paid', value: 'Paid'
      },
      {
        id: 'Voided', value: 'Voided'
      }
    ],
    CustomerRefundAdvanceFilters: {
      Customer: { value: 'Customer', isDeleted: true },
      PaymentMethod: { value: 'Payment Method', isDeleted: true },
      BankAccountCode: { value: 'Bank Account Code', isDeleted: true },
      TransactionMode: { value: 'Transaction Mode', isDeleted: true },
      SubStatus: { value: 'Status', isDeleted: true },
      PaymentOrCheckNumber: { value: 'Payment# or Check#', isDeleted: true },
      RefundDate: { value: 'Refund Date', isDeleted: true },
      CMPaymentDate: { value: 'CM Date or Payment Date', isDeleted: true },
      PaymentCMNumber: { value: 'CM# or Payment#', isDeleted: true },
      RefundAmount: { value: 'Refund Amount ($)', isDeleted: true },
      IsIncludeVoidedTransaction: { value: 'Include Void Transaction', isDeleted: true }
    },
    CustomerRefundListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    PayablePaymentMethodGenericCategory: {
      Check: { gencCategoryName: 'Check', gencCategoryCode: 'CHECK' }
    },
    CustomerPaymentRefundStatusText: {
      All: { id: null, value: 'All', Code: '' },
      NotApplicable: { id: 'Not Applicable', value: 'Not Applicable', ClassName: 'label-warning', Code: 'NA', Name: 'Not Applicable' },
      PendingRefund: { id: 'Pending Refund', value: 'Pending Refund', ClassName: 'md-purple-300-bg', Code: 'PE', Name: 'Pending Refund' },
      PartialPaymentRefunded: { id: 'Partial Payment Refunded', value: 'Partial Payment Refunded', ClassName: 'label-primary', Code: 'PR', Name: 'Partial Payment Refunded' },
      FullPaymentRefunded: { id: 'Full Payment Refunded', value: 'Full Payment Refunded', ClassName: 'label-success', Code: 'FR', Name: 'Full Payment Refunded' }
    },
    CustomerCreditMemoRefundStatusText: {
      All: { id: null, value: 'All', Code: '' },
      NotApplicable: { id: 'Not Applicable', value: 'Not Applicable', ClassName: 'label-warning', Code: 'NA', Name: 'Not Applicable' },
      PendingRefund: { id: 'Pending Refund', value: 'Pending Refund', ClassName: 'md-purple-300-bg', Code: 'PE', Name: 'Pending Refund' },
      PartialCMRefunded: { id: 'Partial CM Refunded', value: 'Partial CM Refunded', ClassName: 'label-primary', Code: 'PR', Name: 'Partial CM Refunded' },
      FullCMRefunded: { id: 'Full CM Refunded', value: 'Full CM Refunded', ClassName: 'label-success', Code: 'FR', Name: 'Full CM Refunded' }
    },
    CustomerInvoiceListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    CustomerCreditNoteListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    CustomerPackingSlipListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    SupplierQuoteListTabIDs: {
      SummaryList: 0,
      DetailList: 1
    },
    CustomerRefundStatusID: {
      Draft: 1,
      Published: 2
    },
    CustomerRefundSubStatusIDDet: {
      //All: { id: null, value: 'All', Code: '' },
      Draft: { name: 'Draft', id: 'Pending', value: 'Pending', className: 'label-warning', code: 1 },
      Published: { name: 'Published', id: 'Approved to Refund', value: 'Approved to Refund', className: 'label-primary', code: 2 },
      ReadytoPrintCheck: { name: 'Ready to Print Check', id: 'Approved To Pay', value: 'Approved To Pay', className: 'md-purple-300-bg', code: 3 },
      Refunded: { name: 'Refunded', id: 'Paid', value: 'Paid', className: 'label-success', code: 4 }
    },
    CustRefundMarkAsPaidStatusDet: {
      Yes: { id: 'Yes', value: 'Yes' },
      No: { id: 'No', value: 'No' },
      NotApplicable: { id: 'NotApplicable', value: 'NotApplicable' }
    },
    supplierQuoteStatusDropdown: [
      { id: 'All', value: 'All' },
      { id: 'D', value: 'Draft' },
      { id: 'P', value: 'Published' }
    ],
    ActivityTransactionTypeDropdown: [
      { id: 'All', value: 'All' },
      { id: 'B', value: 'BOM' },
      { id: 'C', value: 'Costing' },
      { id: 'K', value: 'Kit' }
    ],
    ActivityTypeDropdown: [
      { id: 'All', value: 'All' },
      { id: 'P', value: 'Production' },
      { id: 'S', value: 'Setup' }
    ],
    PurchaseOrderTabListId: {
      Summary: 0,
      DetailPerLine: 1
    },
    BLANKETPOOPTION: [
      {
        id: 1,
        value: 'Use This Blanket PO# for All Releases',
        className: 'light-green-bg'
      }, {
        id: 2,
        value: 'Link Future PO(s) to This Blanket PO',
        className: 'light-blue-bg'
      }, {
        id: 3,
        value: 'Use Blanket PO# and Release# for All Releases',
        className: 'light-pink-bg'
      }],
    BLANKETPOOPTIONDET: {
      USEBLANKETPO: 1,
      LINKBLANKETPO: 2,
      USEBPOANDRELEASE: 3
    },
    PurchaseOrderLockStatus: {
      NA: { id: 'NA', value: 'Not Applicable' },
      ReadyToLock: { id: 'RL', value: 'Ready To Lock' },
      Locked: { id: 'LC', value: 'Locked' }
    },
    PurchaseOrderLockStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Not Applicable', value: 'Not Applicable' },
      { id: 'Ready To Lock', value: 'Ready To Lock' },
      { id: 'Locked', value: 'Locked' }
    ],
    PackingSlipLockStatus: {
      NA: { id: 'NA', value: 'Not Applicable' },
      ReadyToLock: { id: 'RL', value: 'Ready To Lock' },
      Locked: { id: 'LC', value: 'Locked' }
    },
    PackingSlipLockStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Not Applicable', value: 'Not Applicable' },
      { id: 'Ready To Lock', value: 'Ready To Lock' },
      { id: 'Locked', value: 'Locked' }
    ],
    SupplierInvoiceLockStatus: {
      NA: { id: 'NA', value: 'Not Applicable' },
      ReadyToLock: { id: 'RL', value: 'Ready To Lock' },
      Locked: { id: 'LC', value: 'Locked' }
    },
    SupplierInvoiceLockStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Not Applicable', value: 'Not Applicable' },
      { id: 'Ready To Lock', value: 'Ready To Lock' },
      { id: 'Locked', value: 'Locked' }
    ],
    SupplierPaymentLockStatus: {
      ReadyToLock: { id: 'RL', value: 'Ready To Lock' },
      Locked: { id: 'LC', value: 'Locked' }
    },
    SupplierRMALockStatus: {
      NA: { id: 'NA', value: 'Not Applicable' },
      ReadyToLock: { id: 'RL', value: 'Ready To Lock' },
      Locked: { id: 'LC', value: 'Locked' }
    },
    SupplierRMALockStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Not Applicable', value: 'Not Applicable' },
      { id: 'Ready To Lock', value: 'Ready To Lock' },
      { id: 'Locked', value: 'Locked' }
    ],
    STOCKALLOCATIONERRORCODE: {
      MOUNTING_TYPE_MISMATCHED: 'MOUNTING_TYPE_MISMATCHED',
      FUNCTIONAL_TYPE_MISMATCHED: 'FUNCTIONAL_TYPE_MISMATCHED',
      PO_HALT_ERROR: 'PO_HALT_ERROR',
      KIT_ALLOCATION_HALT_ERROR: 'KIT_ALLOCATION_HALT_ERROR',
      SAME_UMID_ALLOCATED: 'SAME_UMID_ALLOCATED',
      STOCK_NOT_ALLOCATED: 'STOCK_NOT_ALLOCATED',
      SOME_UMID_ALLOCATED: 'SOME_UMID_ALLOCATED',
      FULLY_KIT_RETUNRED: 'FULLY_KIT_RETUNRED',
      RESERVED_RESTRICTED_UMID: 'RESERVED_RESTRICTED_UMID',
      FULLY_KIT_RETUNRED_NOT_ALLOW_ALLOCATION: 'FULLY_KIT_RETUNRED_NOT_ALLOW_ALLOCATION'
    },
    MaterialReceiptDateFilterList: [
      { key: 'PO', value: 'PO Date' },
      { key: 'M', value: 'Material Receipt Date' },
      { key: 'P', value: 'Packing Slip Date' }
    ],
    SupplierInvoiceDateFilterList: [
      { key: 'PO', value: 'PO / RMA Date' },
      { key: 'M', value: 'Material Receipt Date' },
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'I', value: 'Invoice Date' }
    ],
    SupplierCreditMemoDateFilterList: [
      { key: 'PO', value: 'PO / RMA Date' },
      { key: 'M', value: 'Material Receipt Date' },
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'C', value: 'Credit Memo Date' }
    ],
    SupplierDebitMemoDateFilterList: [
      { key: 'PO', value: 'PO / RMA Date' },
      { key: 'M', value: 'Material Receipt Date' },
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'D', value: 'Debit Memo Date' }
    ],
    SupplierPaymentDateFilterList: [
      { key: 'PO', value: 'PO Date' },
      { key: 'M', value: 'Material Receipt Date' },
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'I', value: 'Invoice Date' },
      { key: 'PM', value: 'Payment Date' }
    ],
    SupplierRefundDateFilterList: [
      { key: 'PO', value: 'PO Date' },
      { key: 'M', value: 'Material Receipt Date' },
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'I', value: 'Invoice Date' },
      { key: 'PM', value: 'Refund Date' }
    ],
    SO_RELEASE_LINE_STATUS_FILTER: [{ id: 0, name: 'All' }, { id: 1, name: 'Open' }, { id: 2, name: 'Completed' }],
    SO_RELEASE_LINE_STATUS: {
      ALL: 0,
      OPEN: 1,
      COMPLETED: 2
    },
    SOWorkingStatusList: [
      { id: 0, value: 'All', Name: 'All' },
      { id: 1, value: 'In Progress', Name: 'In Progress' },
      { id: 2, value: 'Completed', Name: 'Completed' },
      { id: -1, value: 'Canceled', Name: 'Canceled' }
    ],
    SalesOrderStatus: [
      { id: -1, value: 'All', Name: 'All' },
      { id: 0, value: 'Draft', Name: 'Draft' },
      { id: 1, value: 'Published', Name: 'Published' }
    ],
    VIEW_TYPE: {
      SingleLevelView: 'SV',
      MultiLevelView: 'MV',
      FlattenedView: 'FV'
    },
    PaidStatusHelpIconTooltip: 'Paid = Paid, Applied, Consumed, Used',
    CustomerPackingSlipDateFilterList: [
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'PO', value: 'PO Date' },
      { key: 'SO', value: 'SO Date' }
    ],
    CustomerInvoiceDateFilterList: [
      { key: 'I', value: 'Invoice Date' },
      { key: 'P', value: 'Packing Slip Date' },
      { key: 'PO', value: 'PO Date' },
      { key: 'SO', value: 'SO Date' }
    ],
    CustomerCrNoteDateFilterList: [
      { key: 'C', value: 'CM Date' },
      { key: 'D', value: 'Ref. DM Date' },
      { key: 'I', value: 'Invoice Date' },
      { key: 'PO', value: 'PO Date' }
    ],
    SalesOrderDateFilterList: [
      { key: 'PO', value: 'PO Date' },
      { key: 'SO', value: 'SO Date' },
      { key: 'PR', value: 'PO Rev. Date' }
    ],
    OtherChargeTypeList: [{ Key: 'PO/SO', Value: 'PO', isDisabled: false }, { Key: 'MISC', Value: 'M', isDisabled: false }],
    OtherChargeType: {
      PO: 'PO',
      MISC:'M'
    }
    //CustomerRefundMainSubStatusGridHeaderDropdown: {
    //  All: { id: null, value: 'All', Code: '' },
    //  Draft: { id: 'Draft', value: 'Draft' },
    //  Published: { id: 'Published', value: 'Approved to Refund' },
    //  ReadytoPrintCheck: { id: 'Ready to Print Check', value: 'Ready to Print Check' },
    //  Refunded: { id: 'Refunded', value: 'Refunded' }
    //}
  };
  angular
    .module('app.transaction.salesorder')
    .constant('TRANSACTION', TRANSACTION);
})();
